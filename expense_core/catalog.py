from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

from expense_core.models import Txn
from expense_core.categories import CATEGORY_NAMES
from expense_core.classifiers.factory import create_classifier
from expense_core.config import default_config_path
from expense_core.stats import (
    build_catalog_entries,
    clean_counterparty,
    clean_description,
)


def _md_escape_cell(s: str) -> str:
    return s.replace("|", "\\|").replace("\n", " ").strip()


def export_catalog_md(
    txns: list[Txn],
    cfg: dict,
    out_path: Path,
    date_range: str,
) -> tuple[int, int, float]:
    clf = create_classifier(cfg, default_config_path())
    entries = build_catalog_entries(txns, classifier=clf)
    uncat = [e for e in entries if e["current"] == "其他"]
    cat_ok = [e for e in entries if e["current"] != "其他"]
    uncat_amt = sum(e["amount"] for e in uncat)

    cats_list = " / ".join(CATEGORY_NAMES)
    lines: list[str] = [
        "# 开销分类目录（待标注）",
        "",
        f"- 统计区间：{date_range}",
        f"- 去重后条目：{len(entries)}（未分类「其他」：{len(uncat)} 条，合计 {uncat_amt:,.2f} 元）",
        f"- 生成命令：`python3 build_expense_report.py --export-catalog`",
        "",
        "## 标注说明（给大模型 / 人工）",
        "",
        "1. 只改下方每个条目里的 `category` 与 `keyword` 两行；其余字段请勿改动结构。",
        f"2. `category` 必须是以下之一：`{cats_list}`。",
        "3. `keyword` 填短关键词（会写入 `expense_config.json`），须能匹配该条目的对方或摘要原文；",
        "   避免过短泛词（如「支付」「订单」），优先商户名/品牌/可区分片段。",
        "4. 若确属无法归类，`category` 填 `其他`，`keyword` 可留空。",
        "5. 同类多条可用同一个 `keyword`；脚本会按类别去重合并关键词。",
        "6. 标注完成后执行：",
        "   `python3 build_expense_report.py --apply-catalog category-catalog.md`",
        "   再 `--all` 重新生成报表。",
        "",
        "## 待标注：当前落在「其他」",
        "",
    ]

    def emit_entry(idx: int, e: dict) -> None:
        lines.append(f"### #{idx}")
        lines.append(f"- counterparty: {_md_escape_cell(e['counterparty']) or '（空）'}")
        lines.append(f"- description: {_md_escape_cell(e['description']) or '（空）'}")
        lines.append(f"- platforms: {e['platforms']}")
        lines.append(f"- count: {e['count']}")
        lines.append(f"- amount: {e['amount']:.2f}")
        lines.append(f"- current: {e['current']}")
        lines.append(f"- samples: {_md_escape_cell(' | '.join(e['samples']))}")
        if e["current"] != "其他":
            lines.append(f"- category: {e['current']}")
            hint = e["counterparty"] or e["description"]
            hint = re.sub(r"<NUM>", "", hint).strip()[:20]
            lines.append(f"- keyword: {hint}")
        else:
            lines.append("- category: ")
            lines.append("- keyword: ")
        lines.append("")

    for i, e in enumerate(uncat, 1):
        emit_entry(i, e)

    lines += [
        "## 已命中规则（供校对，可改 category/keyword）",
        "",
    ]
    for i, e in enumerate(cat_ok, len(uncat) + 1):
        emit_entry(i, e)

    lines += [
        "## 速览表（未分类）",
        "",
        "| # | 对方 | 摘要 | 笔数 | 金额 | 建议类别 | 建议关键词 |",
        "| --- | --- | --- | ---: | ---: | --- | --- |",
    ]
    for i, e in enumerate(uncat, 1):
        lines.append(
            f"| {i} | {_md_escape_cell(e['counterparty'][:24])} "
            f"| {_md_escape_cell(e['description'][:36])} "
            f"| {e['count']} | {e['amount']:.2f} |  |  |"
        )
    lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8")
    return len(entries), len(uncat), uncat_amt


def apply_catalog_md(catalog_path: Path, config_path: Path) -> tuple[int, dict[str, list[str]]]:
    text = catalog_path.read_text(encoding="utf-8")
    cfg = json.loads(config_path.read_text(encoding="utf-8")) if config_path.exists() else {}
    rules: dict[str, list[str]] = dict(cfg.get("category_rules") or {})
    for name in CATEGORY_NAMES:
        rules.setdefault(name, [])

    added: dict[str, list[str]] = defaultdict(list)
    blocks = re.split(r"\n### #\d+\n", text)
    for block in blocks[1:]:
        fields: dict[str, str] = {}
        for line in block.splitlines():
            m = re.match(r"- (counterparty|description|category|keyword):\s*(.*)$", line)
            if m:
                fields[m.group(1)] = m.group(2).strip()
        cat = fields.get("category", "")
        kw = fields.get("keyword", "")
        if not cat or cat not in rules:
            continue
        if cat == "其他" or not kw:
            continue
        if kw in ("（空）", "<NUM>"):
            continue
        existing = rules[cat]
        if kw not in existing and not any(kw == x for x in existing):
            existing.append(kw)
            added[cat].append(kw)

    cfg["category_rules"] = {k: rules.get(k, []) for k in CATEGORY_NAMES}
    if config_path.exists():
        raw = json.loads(config_path.read_text(encoding="utf-8"))
        raw["category_rules"] = cfg["category_rules"]
        config_path.write_text(
            json.dumps(raw, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    else:
        config_path.write_text(
            json.dumps(cfg, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    n = sum(len(v) for v in added.values())
    return n, dict(added)
