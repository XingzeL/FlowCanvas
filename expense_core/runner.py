from __future__ import annotations

import json
import re
import tempfile
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Literal

from expense_core.catalog import export_catalog_md
from expense_core.canvas import render_canvas, render_markdown, render_year_canvas
from expense_core.config import DEFAULT_CONFIG
from expense_core.merge import collect_from_directories
from expense_core.models import Granularity, ParseAggregate, Report, Txn
from expense_core.parsers.alipay import infer_range_from_alipay_filename, infer_range_from_filename
from expense_core.parsers.registry import ParserRegistry, default_registry
from expense_core.periods import iter_month_ranges
from expense_core.report import build_full_report, make_report

AnalysisMode = Literal["month", "range", "all"]
CanvasMode = Literal["month", "year"]
ExportFormat = Literal["json", "markdown", "canvas", "catalog"]


@dataclass
class AnalysisResult:
    kept: list[Txn]
    excluded_records: list[tuple[Txn, str]]
    note: str
    aggregate: ParseAggregate
    d0: date
    d1: date
    label: str
    files: dict[str, Path | None]
    data_dirs: list[Path]
    cfg: dict

    @property
    def excluded(self) -> list[Txn]:
        return [t for t, _ in self.excluded_records]


@dataclass
class ExportArtifacts:
    inline: dict[str, str] = field(default_factory=dict)
    written: dict[str, str] = field(default_factory=dict)


def sources_status_dict(aggregate: ParseAggregate) -> dict:
    return {
        k: {
            "parsed": s.parsed,
            "skipped": s.skipped,
            "error": s.error,
        }
        for k, s in aggregate.sources.items()
    }


def sources_with_paths(
    aggregate: ParseAggregate,
    files: dict[str, Path | None],
) -> dict:
    status = sources_status_dict(aggregate)
    for pid, path in files.items():
        if path and pid in status:
            status[pid]["path"] = str(path)
            status[pid]["filename"] = path.name
    return status


def resolve_data_dirs(primary: Path, extra_dirs: list[Path] | None = None) -> list[Path]:
    directory = primary.resolve()
    extras = [Path(p).resolve() for p in (extra_dirs or [])]
    return [directory] + [d for d in extras if d != directory]


def discover_files(
    registry: ParserRegistry,
    dirs: list[Path],
    cfg: dict,
    explicit_files: dict[str, str | Path] | None = None,
) -> dict[str, Path | None]:
    if not dirs:
        return {pid: None for pid in ("alipay", "wechat", "cmb", "boc")}

    files: dict[str, Path | None] = registry.discover_optional(dirs[0], cfg)
    for directory in dirs[1:]:
        extra = registry.discover_optional(directory, cfg)
        for k, p in extra.items():
            if p and not files.get(k):
                files[k] = p

    if explicit_files:
        for pid, raw in explicit_files.items():
            if raw:
                files[pid] = Path(raw).resolve()

    return files


def infer_month_from_files(files: dict[str, Path | None]) -> tuple[date, date, str]:
    alipay = files.get("alipay")
    if alipay:
        m = re.search(r"\((\d{8})-(\d{8})\)", alipay.name)
        if m:
            d_end = datetime.strptime(m.group(2), "%Y%m%d").date()
            d0 = date(d_end.year, d_end.month, 1)
            label = f"{d_end.year} 年 {d_end.month} 月"
            return d0, d_end, label
    today = date.today()
    d0m = date(today.year, today.month, 1)
    return d0m, today, f"{today.year} 年 {today.month} 月"


def infer_full_range_from_files(files: dict[str, Path | None]) -> tuple[date, date]:
    alipay = files.get("alipay")
    if not alipay:
        raise ValueError("需要支付宝 CSV 文件名推断全区间，或指定 date_start / date_end")
    r = infer_range_from_alipay_filename(alipay.name)
    if not r:
        raise ValueError(f"无法从支付宝文件名解析日期区间: {alipay.name}")
    return r


def infer_date_range(
    registry: ParserRegistry,
    files: dict[str, Path | None],
    cfg: dict,
    mode: AnalysisMode,
    month: str | None = None,
    date_start: date | None = None,
    date_end: date | None = None,
    extra_dirs: list[Path] | None = None,
) -> tuple[date, date, str]:
    extras = extra_dirs or []

    if mode == "all":
        if month:
            y, m = map(int, month.split("-"))
            d0 = date(y, m, 1)
            d1 = date(y, 12, 31) if m == 12 else date(y, m + 1, 1) - timedelta(days=1)
        elif date_start and date_end:
            d0, d1 = date_start, date_end
        elif extras:
            d0, d1 = infer_full_range_from_files(files)
            for ed in extras:
                for p in registry.discover_optional(ed, cfg).values():
                    if p:
                        r = infer_range_from_filename(p.name)
                        if r:
                            d1 = max(d1, r[1])
        else:
            d0, d1 = infer_full_range_from_files(files)
        label = f"{d0.year}.{d0.month:02d}–{d1.year}.{d1.month:02d}"
        return d0, d1, label

    if mode == "month":
        if not month:
            raise ValueError("mode=month 需要指定 month=YYYY-MM")
        y, m = map(int, month.split("-"))
        d0 = date(y, m, 1)
        if m == 12:
            d1 = date(y, 12, 31)
        else:
            d1 = date(y, m + 1, 1) - timedelta(days=1)
        _, file_end, _ = infer_month_from_files(files)
        if file_end.year == y and file_end.month == m:
            d1 = min(d1, file_end)
        label = f"{y} 年 {m} 月"
        return d0, d1, label

    if date_start and date_end:
        d0, d1 = date_start, date_end
        label = f"{d0.year}.{d0.month:02d}–{d1.year}.{d1.month:02d}"
        return d0, d1, label

    d0, d1, label = infer_month_from_files(files)
    return d0, d1, label


def run_analysis(
    dirs: list[Path],
    cfg: dict,
    *,
    extra_dirs: list[Path] | None = None,
    explicit_files: dict[str, str | Path] | None = None,
    mode: AnalysisMode = "range",
    month: str | None = None,
    date_start: date | None = None,
    date_end: date | None = None,
    registry: ParserRegistry | None = None,
) -> AnalysisResult:
    reg = registry or default_registry()
    if not dirs:
        raise ValueError("至少需要指定一个 dirs 目录")

    data_dirs = resolve_data_dirs(dirs[0], extra_dirs)
    files = discover_files(reg, data_dirs, cfg, explicit_files)

    if not any(files.values()) and not any(
        reg.discover_optional(d, cfg) for d in data_dirs
    ):
        raise FileNotFoundError(f"目录 {data_dirs} 中未找到任何匹配的流水文件")

    d0, d1, label = infer_date_range(
        reg,
        files,
        cfg,
        mode,
        month=month,
        date_start=date_start,
        date_end=date_end,
        extra_dirs=[d for d in (extra_dirs or [])],
    )

    overrides = {k: v for k, v in files.items() if v is not None and explicit_files and k in explicit_files}
    kept, excluded_records, note, aggregate = collect_from_directories(
        reg, data_dirs, d0, d1, cfg, file_overrides=overrides or None
    )

    if not kept and not aggregate.primary and not aggregate.bank:
        errors = {k: s.error for k, s in aggregate.sources.items() if s.error}
        raise ValueError(f"未能解析到任何交易记录。错误: {errors or '无 primary/bank 数据'}")

    return AnalysisResult(
        kept=kept,
        excluded_records=excluded_records,
        note=note,
        aggregate=aggregate,
        d0=d0,
        d1=d1,
        label=label,
        files=files,
        data_dirs=data_dirs,
        cfg=cfg,
    )


def build_json_report(
    result: AnalysisResult,
    *,
    granularity: Granularity = "month",
    large_threshold: float = 500,
) -> dict:
    return build_full_report(
        result.kept,
        result.excluded,
        result.note,
        result.d0,
        result.d1,
        result.label,
        result.cfg,
        granularity=granularity,
        large_threshold=large_threshold,
        sources=sources_status_dict(result.aggregate),
        excluded_with_reason=result.excluded_records,
    )


def build_year_reports(result: AnalysisResult) -> tuple[Report, list[Report]]:
    year_report = make_report(
        result.kept, result.excluded, result.note, result.d0, result.d1, result.label
    )
    if result.note:
        excl_amt = sum(t.amount for t in result.excluded)
        year_report.excluded_note = (
            f"已剔除转账/房租/取现/理财等 {len(result.excluded)} 笔，共 {excl_amt:,.2f} 元"
        )

    month_reports = [
        make_report(result.kept, result.excluded, result.note, ms, me, mlb)
        for ms, me, mlb in [
            (s.start, s.end, s.label) for s in iter_month_ranges(result.d0, result.d1)
        ]
    ]
    return year_report, month_reports


def build_single_report(result: AnalysisResult) -> Report:
    report = make_report(
        result.kept, result.excluded, result.note, result.d0, result.d1, result.label
    )
    if result.note:
        excl_amt = sum(t.amount for t in result.excluded)
        report.excluded_note = (
            f"已剔除转账/房租/取现/理财等 {len(result.excluded)} 笔，共 {excl_amt:,.2f} 元"
        )
    return report


def discover_dir_files(
    registry: ParserRegistry,
    directory: Path,
    cfg: dict,
) -> dict[str, dict | None]:
    found = registry.discover_optional(directory, cfg)
    out: dict[str, dict | None] = {}
    for pid, path in found.items():
        if path is None:
            out[pid] = None
        else:
            out[pid] = {
                "id": pid,
                "path": str(path.resolve()),
                "filename": path.name,
                "mtime": path.stat().st_mtime,
            }
    return out


def default_templates(project_root: Path | None = None) -> dict[str, Path]:
    root = project_root or Path(__file__).resolve().parent.parent
    tpl_dir = root / "templates"
    return {
        "month": tpl_dir / "expense-breakdown.canvas.template.tsx",
        "year": tpl_dir / "expense-year-breakdown.canvas.template.tsx",
    }


def _write_via_temp(render_fn, *args) -> str:
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".tmp", delete=False, encoding="utf-8"
    ) as tmp:
        tmp_path = Path(tmp.name)
    render_fn(*args, tmp_path)
    content = tmp_path.read_text(encoding="utf-8")
    tmp_path.unlink(missing_ok=True)
    return content


def build_exports(
    result: AnalysisResult,
    formats: list[ExportFormat],
    *,
    canvas_mode: CanvasMode = "year",
    inline: bool = True,
    output_dir: Path | None = None,
    output_names: dict[str, str] | None = None,
    templates: dict[str, Path] | None = None,
    granularity: Granularity = "month",
    large_threshold: float = 500,
) -> ExportArtifacts:
    names = {
        "json": "report.json",
        "markdown": "summary.md",
        "canvas": (
            "expense-year-breakdown.canvas.tsx"
            if canvas_mode == "year"
            else "expense-breakdown.canvas.tsx"
        ),
        "catalog": "category-catalog.md",
    }
    if output_names:
        names.update(output_names)

    tpls = templates or default_templates()
    artifacts = ExportArtifacts()
    rules = result.cfg.get("category_rules", DEFAULT_CONFIG["category_rules"])

    if output_dir is not None:
        output_dir.mkdir(parents=True, exist_ok=True)

    if "json" in formats:
        report_json = build_json_report(
            result, granularity=granularity, large_threshold=large_threshold
        )
        content = json.dumps(report_json, ensure_ascii=False, indent=2) + "\n"
        if inline:
            artifacts.inline["json"] = content
        if output_dir is not None:
            path = output_dir / names["json"]
            path.write_text(content, encoding="utf-8")
            artifacts.written["json"] = str(path.resolve())

    md_report: Report | None = None
    if "markdown" in formats or "canvas" in formats:
        if canvas_mode == "year":
            md_report, _ = build_year_reports(result)
        else:
            md_report = build_single_report(result)

    if "markdown" in formats and md_report is not None:
        content = _write_via_temp(render_markdown, md_report, result.cfg)
        if inline:
            artifacts.inline["markdown"] = content
        if output_dir is not None:
            path = output_dir / names["markdown"]
            path.write_text(content, encoding="utf-8")
            artifacts.written["markdown"] = str(path.resolve())

    if "canvas" in formats:
        if canvas_mode == "year":
            year_report, month_reports = build_year_reports(result)
            content = _write_via_temp(
                render_year_canvas, year_report, month_reports, result.cfg, tpls["year"]
            )
        else:
            report = build_single_report(result)
            content = _write_via_temp(render_canvas, report, result.cfg, tpls["month"])
        if inline:
            artifacts.inline["canvas"] = content
        if output_dir is not None:
            path = output_dir / names["canvas"]
            path.write_text(content, encoding="utf-8")
            artifacts.written["canvas"] = str(path.resolve())

    if "catalog" in formats:
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".md", delete=False, encoding="utf-8"
        ) as tmp:
            tmp_path = Path(tmp.name)
        export_catalog_md(result.kept, result.cfg, tmp_path, f"{result.d0} ~ {result.d1}")
        content = tmp_path.read_text(encoding="utf-8")
        tmp_path.unlink(missing_ok=True)
        if inline:
            artifacts.inline["catalog"] = content
        if output_dir is not None:
            path = output_dir / names["catalog"]
            path.write_text(content, encoding="utf-8")
            artifacts.written["catalog"] = str(path.resolve())

    return artifacts


def analysis_summary(result: AnalysisResult) -> dict:
    in_range = [t for t in result.kept if result.d0 <= t.dt <= result.d1]
    total = sum(t.amount for t in in_range)
    return {
        "txn_count": len(in_range),
        "total": round(total, 2),
        "date_range": f"{result.d0} ~ {result.d1}",
        "label": result.label,
    }
