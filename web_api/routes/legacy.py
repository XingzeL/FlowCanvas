from __future__ import annotations

import json
from datetime import date, datetime
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from expense_core.config import (
    clear_learned_keywords,
    count_learned_keywords,
    default_config_path,
    load_config,
)
from expense_core.parsers.base import ParseInput
from expense_core.parsers.alipay import infer_range_from_alipay_content, infer_range_from_alipay_filename
from expense_core.parsers.registry import default_registry
from expense_core.pipeline import collect_from_aggregate
from expense_core.periods import infer_range_from_txns
from expense_core.report import build_full_report

router = APIRouter(tags=["legacy"])
registry = default_registry()


def _infer_date_range(uploads: dict[str, ParseInput]) -> tuple[date, date]:
    alipay_inp = uploads.get("alipay")
    if alipay_inp:
        r = infer_range_from_alipay_filename(alipay_inp.filename)
        if r:
            return r
        r = infer_range_from_alipay_content(alipay_inp.content)
        if r:
            return r
    wide_d0 = date(2000, 1, 1)
    wide_d1 = date(2099, 12, 31)
    agg_wide = registry.parse_uploads(uploads, wide_d0, wide_d1)
    all_txns = agg_wide.primary + agg_wide.bank
    r = infer_range_from_txns(all_txns)
    if r:
        return r
    raise HTTPException(400, "无法推断日期区间，请指定 date_start / date_end")


def _sources_status(aggregate) -> dict[str, Any]:
    return {
        k: {
            "parsed": s.parsed,
            "skipped": s.skipped,
            "error": s.error,
        }
        for k, s in aggregate.sources.items()
    }


@router.get("/api/config/default")
def get_default_config() -> dict:
    path = default_config_path()
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return load_config(None)


@router.get("/api/parsers")
def get_parsers() -> list[dict]:
    return registry.parser_info()


@router.get("/api/config/learned-keywords")
def get_learned_keywords() -> dict[str, Any]:
    path = default_config_path()
    cfg = load_config(path if path.exists() else None)
    learned = cfg.get("_learned_keywords") or {}
    return {
        "count": count_learned_keywords(cfg),
        "byCategory": learned,
    }


@router.post("/api/config/clear-learned-keywords")
def post_clear_learned_keywords() -> dict[str, int]:
    path = default_config_path()
    removed = clear_learned_keywords(path)
    return {"removed": removed}


@router.post("/api/analyze")
async def analyze(
    granularity: str = Form("month"),
    pure_spending: bool = Form(True),
    large_threshold: float = Form(500),
    date_start: str | None = Form(None),
    date_end: str | None = Form(None),
    config: str | None = Form(None),
    alipay: UploadFile | None = File(None),
    wechat: UploadFile | None = File(None),
    cmb: UploadFile | None = File(None),
    boc: UploadFile | None = File(None),
) -> dict:
    if granularity not in ("day", "3day", "week", "month"):
        raise HTTPException(400, f"Invalid granularity: {granularity}")

    if config:
        cfg = json.loads(config)
    else:
        cfg = load_config(default_config_path())
    cfg.setdefault("pure_spending", {})
    cfg["pure_spending"]["enabled"] = pure_spending

    uploads: dict[str, ParseInput] = {}
    file_map = {"alipay": alipay, "wechat": wechat, "cmb": cmb, "boc": boc}
    for pid, uf in file_map.items():
        if uf is not None and uf.filename:
            content = await uf.read()
            uploads[pid] = ParseInput(
                filename=uf.filename,
                content=content,
                mime=uf.content_type,
            )

    if not uploads:
        raise HTTPException(400, "至少需要上传一份流水文件")

    if date_start and date_end:
        d0 = datetime.strptime(date_start, "%Y-%m-%d").date()
        d1 = datetime.strptime(date_end, "%Y-%m-%d").date()
    else:
        d0, d1 = _infer_date_range(uploads)

    aggregate = registry.parse_uploads(uploads, d0, d1)
    if not aggregate.primary and not aggregate.bank:
        errors = {k: s.error for k, s in aggregate.sources.items() if s.error}
        raise HTTPException(
            400,
            f"未能解析到任何交易记录。错误: {errors or '无 primary/bank 数据'}",
        )

    kept, excluded_records, note = collect_from_aggregate(aggregate, cfg)
    excluded = [t for t, _ in excluded_records]
    label = f"{d0.year}.{d0.month:02d}–{d1.year}.{d1.month:02d}"

    try:
        return build_full_report(
            kept,
            excluded,
            note,
            d0,
            d1,
            label,
            cfg,
            granularity=granularity,
            large_threshold=large_threshold,
            sources=_sources_status(aggregate),
            config_path=default_config_path(),
            excluded_with_reason=excluded_records,
        )
    except RuntimeError as e:
        msg = str(e)
        if "LLM API" in msg:
            raise HTTPException(
                502,
                f"大模型分类失败：{msg}。"
                "请检查 EXPENSE_LLM_API_KEY / API 地址，"
                "或将 EXPENSE_CLASSIFIER_MODE 设为 learn / llm_with_fallback / keyword。",
            ) from e
        raise
