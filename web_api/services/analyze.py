from __future__ import annotations

from datetime import datetime
from pathlib import Path

from fastapi import HTTPException

from expense_core.config import load_config
from expense_core.parsers.registry import default_registry
from expense_core.runner import (
    AnalysisResult,
    ExportArtifacts,
    analysis_summary,
    build_exports,
    build_json_report,
    discover_dir_files,
    run_analysis,
    sources_with_paths,
)
from web_api.schemas import AnalyzeRequest, ExportRequest
from web_api.security import resolve_allowed_dir, resolve_allowed_file, resolve_allowed_output_dir
from web_api.settings import get_settings

registry = default_registry()


def _parse_date(raw: str | None, field: str):
    if not raw:
        return None
    try:
        return datetime.strptime(raw, "%Y-%m-%d").date()
    except ValueError as e:
        raise HTTPException(400, f"无效的 {field}，应为 YYYY-MM-DD") from e


def _load_cfg(config_path: str | None, pure_spending: bool) -> dict:
    settings = get_settings()
    if config_path:
        path = resolve_allowed_file(config_path)
        cfg = load_config(path)
    else:
        cfg = load_config(settings.default_config_path)
    cfg.setdefault("pure_spending", {})
    cfg["pure_spending"]["enabled"] = pure_spending
    return cfg


def _resolve_dirs(req: AnalyzeRequest) -> tuple[list[Path], list[Path], dict[str, Path]]:
    dirs = [resolve_allowed_dir(d) for d in req.dirs]
    extra_dirs = [resolve_allowed_dir(d) for d in req.extra_dirs]
    explicit: dict[str, Path] = {}
    for pid, raw in req.files.items():
        explicit[pid] = resolve_allowed_file(raw)
    return dirs, extra_dirs, explicit


def execute_analyze(req: AnalyzeRequest) -> tuple[AnalysisResult, dict]:
    if req.granularity not in ("day", "3day", "week", "month"):
        raise HTTPException(400, f"Invalid granularity: {req.granularity}")

    cfg = _load_cfg(req.config_path, req.pure_spending)
    dirs, extra_dirs, explicit = _resolve_dirs(req)

    try:
        result = run_analysis(
            dirs,
            cfg,
            extra_dirs=extra_dirs,
            explicit_files=explicit or None,
            mode=req.mode,
            month=req.month,
            date_start=_parse_date(req.date_start, "date_start"),
            date_end=_parse_date(req.date_end, "date_end"),
            registry=registry,
        )
    except FileNotFoundError as e:
        raise HTTPException(404, str(e)) from e
    except ValueError as e:
        raise HTTPException(400, str(e)) from e

    report = build_json_report(
        result,
        granularity=req.granularity,
        large_threshold=req.large_threshold,
    )
    inputs = {
        "date_start": result.d0.isoformat(),
        "date_end": result.d1.isoformat(),
        "label": result.label,
        "sources": sources_with_paths(result.aggregate, result.files),
    }
    return result, {"report": report, "inputs": inputs}


def execute_discover(directory: str, config_path: str | None) -> dict:
    cfg = _load_cfg(config_path, pure_spending=True)
    dir_path = resolve_allowed_dir(directory)
    return discover_dir_files(registry, dir_path, cfg)


def execute_export(req: ExportRequest) -> dict:
    if not req.formats:
        raise HTTPException(400, "formats 不能为空")
    if not req.inline and not req.output_dir:
        raise HTTPException(400, "inline=false 时必须指定 output_dir")

    result, analyze_payload = execute_analyze(req)
    output_dir = (
        resolve_allowed_output_dir(req.output_dir) if req.output_dir else None
    )

    canvas_mode = req.canvas_mode
    if req.mode != "all" and "canvas" in req.formats:
        canvas_mode = "month"

    artifacts: ExportArtifacts = build_exports(
        result,
        req.formats,
        canvas_mode=canvas_mode,
        inline=req.inline,
        output_dir=output_dir,
        output_names=req.output_names or None,
        granularity=req.granularity,
        large_threshold=req.large_threshold,
    )

    return {
        "summary": analysis_summary(result),
        "report": analyze_payload["report"] if "json" in req.formats else None,
        "inputs": analyze_payload["inputs"],
        "artifacts": {
            "inline": artifacts.inline,
            "written": artifacts.written,
        },
    }
