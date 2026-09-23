#!/usr/bin/env python3
"""
从四份固定格式流水（支付宝 CSV、微信 XLSX、招行/中行 PDF）解析支出，
去重后生成 expense-breakdown.canvas.tsx 与可选 Markdown 汇总。

用法:
  python3 build_expense_report.py
  python3 build_expense_report.py --dir /path/to/202608 --month 2026-08
  python3 build_expense_report.py --full   # 不去除转账/房租（纯花销模式见 expense_config.json）
  python3 build_expense_report.py --all    # 按账单全区间逐月汇总到单一 year canvas
  python3 build_expense_report.py --export-catalog   # 导出去重后的开销目录 MD
  python3 build_expense_report.py --apply-catalog category-catalog.md
  python3 build_expense_report.py --all --extra-dir /path/to/202608

依赖: pip install -r requirements.txt  （或使用目录下 .venv）
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path

from expense_core.env import load_project_env

load_project_env()

from expense_core.catalog import apply_catalog_md
from expense_core.config import DEFAULT_CONFIG, load_config
from expense_core.parsers.registry import default_registry
from expense_core.runner import (
    build_json_report,
    build_single_report,
    build_year_reports,
    default_templates,
    discover_files,
    resolve_data_dirs,
    run_analysis,
)


def main() -> None:
    parser = argparse.ArgumentParser(description="四流水去重并生成 expense canvas")
    parser.add_argument("--dir", type=Path, default=Path(__file__).parent, help="流水文件目录")
    parser.add_argument(
        "--extra-dir",
        action="append",
        default=[],
        metavar="PATH",
        help="额外流水目录（可与 --dir 合并去重，用于续期账单）",
    )
    parser.add_argument("--config", type=Path, default=Path(__file__).parent / "expense_config.json")
    parser.add_argument("--month", help="统计月份 YYYY-MM，默认从文件名推断")
    parser.add_argument("--date-start", help="覆盖起始日 YYYY-MM-DD")
    parser.add_argument("--date-end", help="覆盖结束日 YYYY-MM-DD")
    parser.add_argument(
        "--all",
        action="store_true",
        help="按账单全区间逐月统计，汇总到单一 year canvas",
    )
    parser.add_argument("--full", action="store_true", help="全量模式，不剔除转账/房租")
    parser.add_argument(
        "--export-catalog",
        nargs="?",
        const="__DEFAULT__",
        default=None,
        help="导出去重清理后的开销目录 MD",
    )
    parser.add_argument(
        "--apply-catalog",
        type=Path,
        default=None,
        help="读取已标注的目录 MD，把 keyword 合并进 expense_config.json",
    )
    parser.add_argument(
        "--output-canvas",
        type=Path,
        default=None,
        help="输出 canvas 路径；--all 时默认 <dir>/expense-year-breakdown.canvas.tsx",
    )
    parser.add_argument("--output-md", type=Path, default=None, help="可选 Markdown 输出路径")
    parser.add_argument(
        "--json-out",
        type=Path,
        default=None,
        help="输出 build_full_report JSON 契约文件",
    )
    parser.add_argument(
        "--template",
        type=Path,
        default=None,
        help="Canvas 模板路径；--all 时默认 year 模板，否则单月模板",
    )
    args = parser.parse_args()

    if args.apply_catalog:
        n, added = apply_catalog_md(args.apply_catalog.resolve(), args.config.resolve())
        print(f"已写回配置: {args.config}")
        print(f"  新增关键词: {n} 个")
        for cat, kws in sorted(added.items()):
            print(f"    {cat}: {', '.join(kws)}")
        if n == 0:
            print("  （未解析到有效 category+keyword，请检查 MD 是否已填写）")
        return

    cfg = load_config(args.config)
    if args.full:
        cfg["pure_spending"]["enabled"] = False

    directory = args.dir.resolve()
    extra_dirs = [Path(p).resolve() for p in args.extra_dir]
    data_dirs = resolve_data_dirs(directory, extra_dirs)
    registry = default_registry()
    files = discover_files(registry, data_dirs, cfg)
    rules = cfg.get("category_rules", DEFAULT_CONFIG["category_rules"])

    if not any(files.values()) and not any(
        registry.discover_optional(d, cfg) for d in data_dirs
    ):
        raise SystemExit(f"目录 {data_dirs} 中未找到任何匹配的流水文件")

    if args.all or args.export_catalog:
        mode = "all"
    elif args.month:
        mode = "month"
    else:
        mode = "range"

    date_start = datetime.strptime(args.date_start, "%Y-%m-%d").date() if args.date_start else None
    date_end = datetime.strptime(args.date_end, "%Y-%m-%d").date() if args.date_end else None

    result = run_analysis(
        [directory],
        cfg,
        extra_dirs=extra_dirs,
        mode=mode,
        month=args.month,
        date_start=date_start,
        date_end=date_end,
        registry=registry,
    )
    kept = result.kept
    excluded = result.excluded
    note = result.note
    aggregate = result.aggregate
    d0, d1 = result.d0, result.d1

    if args.export_catalog is not None:
        out = (
            directory / "category-catalog.md"
            if args.export_catalog == "__DEFAULT__"
            else Path(args.export_catalog).expanduser()
        )
        if not out.is_absolute():
            out = (directory / out).resolve()
        from expense_core.catalog import export_catalog_md

        n_all, n_uncat, uncat_amt = export_catalog_md(kept, cfg, out, f"{d0} ~ {d1}")
        print(f"已导出分类目录: {out}")
        print(f"  区间: {d0} ~ {d1}")
        print(f"  去重条目: {n_all}（未分类 {n_uncat} 条 / {uncat_amt:,.2f} 元）")
        if not args.all:
            return

    if args.json_out:
        report = build_json_report(result, granularity="month")
        args.json_out.write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"已输出 JSON: {args.json_out}")

    if args.all:
        year_report, month_reports = build_year_reports(result)
        tpl = args.template or default_templates(Path(__file__).parent)["year"]
        out_canvas = args.output_canvas or directory / "expense-year-breakdown.canvas.tsx"
        from expense_core.canvas import render_markdown, render_year_canvas

        render_year_canvas(year_report, month_reports, cfg, tpl, out_canvas)

        if args.output_md:
            render_markdown(year_report, cfg, args.output_md)

        print(f"已生成全年 Canvas: {out_canvas}")
        print(f"  区间: {d0} ~ {d1}")
        print(f"  全年支出: {year_report.count} 笔, {year_report.total:,.2f} 元")
        print(f"  有数据月份: {sum(1 for r in month_reports if r.count > 0)} / {len(month_reports)}")
        if year_report.excluded_note:
            print(f"  {year_report.excluded_note}")
        for r in month_reports:
            if r.count:
                print(f"    {r.period_label}: {r.count} 笔, {r.total:,.2f} 元")
        print("  数据源:")
        for d in data_dirs:
            found = registry.discover_optional(d, cfg)
            for k, p in found.items():
                if p:
                    print(f"    [{d.name}] {k}: {p.name}")
        return

    report = build_single_report(result)
    tpl = args.template or default_templates(Path(__file__).parent)["month"]
    out_canvas = args.output_canvas or directory / "expense-breakdown.canvas.tsx"
    from expense_core.canvas import render_canvas, render_markdown

    render_canvas(report, cfg, tpl, out_canvas)

    if args.output_md:
        render_markdown(report, cfg, args.output_md)

    print(f"已生成 Canvas: {out_canvas}")
    print(f"  区间: {d0} ~ {d1}")
    print(f"  支出: {report.count} 笔, {report.total:,.2f} 元")
    if report.excluded_note:
        print(f"  {report.excluded_note}")
    print("  数据源:")
    for d in data_dirs:
        found = registry.discover_optional(d, cfg)
        for k, p in found.items():
            if p:
                print(f"    [{d.name}] {k}: {p.name}")


if __name__ == "__main__":
    main()
