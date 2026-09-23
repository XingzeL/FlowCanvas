from __future__ import annotations

import json
import re
from datetime import date, timedelta
from pathlib import Path

from expense_core.classifiers.factory import create_classifier
from expense_core.config import DEFAULT_CONFIG, default_config_path
from expense_core.models import Report
from expense_core.report import build_period_payload
from expense_core.stats import daily_totals, fmt_item_row


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def js_array_numbers(values: list[float], per_line: int = 8) -> str:
    parts = [f"{v:.2f}".rstrip("0").rstrip(".") if v != int(v) else str(int(v)) for v in values]
    lines = []
    for i in range(0, len(parts), per_line):
        chunk = ", ".join(parts[i : i + per_line])
        lines.append(f"  {chunk},")
    return "[\n" + "\n".join(lines).rstrip(",") + "\n]"


def render_canvas(report: Report, cfg: dict, template_path: Path, out_path: Path) -> None:
    payload = build_period_payload(report, cfg)
    cats = payload["categories"]
    mapping = {
        "游戏动漫": "GAME_TOP",
        "交通出行": "TRAVEL_ALL",
        "购物消费": "SHOPPING_TOP",
        "餐饮食品": "FOOD_TOP",
        "会员订阅": "SUB_ALL",
        "通讯话费": "TELECOM_ALL",
        "生活缴费": "UTILITY_ALL",
        "医疗健康": "MEDICAL_ALL",
        "教育学习": "EDU_ALL",
        "其他": "OTHER_ALL",
    }

    cat_lines = ",\n".join(
        f'  {{ name: {js_str(c["name"])}, amount: {c["amount"]}, pct: {c["pct"]}, count: {c["count"]} }}'
        for c in cats
    )

    detail_blocks: list[str] = []
    detail_entries: list[str] = []
    used_names: set[str] = set()
    for i, d in enumerate(payload["details"]):
        cname = mapping.get(d["name"], f"CAT_{i}")
        if cname in used_names:
            cname = f"{cname}_{i}"
        used_names.add(cname)
        row_lines = ",\n".join(
            f'  [{js_str(a)}, {js_str(b)}]' for a, b in d["rows"]
        )
        detail_blocks.append(f"const {cname}: Item[] = [\n{row_lines}\n];")
        detail_entries.append(
            f'  {{ name: {js_str(d["name"])}, meta: {js_str(d["meta"])}, rows: {cname} }}'
        )

    bucket_lines = ",\n".join(
        f'  {{ label: {js_str(b["label"])}, count: {b["count"]}, amount: {b["amount"]} }}'
        for b in payload["amountBuckets"]
    )
    bucket_m_lines = ",\n".join(
        f'  {{ label: {js_str(b["label"])}, count: {b["count"]}, amount: {b["amount"]} }}'
        for b in payload["amountBucketsMerged"]
    )

    data_section = f"""
const CATEGORIES = [
{cat_lines}
];

const DAILY = {js_array_numbers(payload["daily"])};

type Item = [string, string];

{chr(10).join(detail_blocks)}

const AMOUNT_BUCKETS = [
{bucket_lines}
];

const AMOUNT_BUCKETS_MERGED = [
{bucket_m_lines}
];

const DETAILS: {{ name: string; meta: string; rows: Item[] }}[] = [
{",\n".join(detail_entries)}
];

const REPORT_META = {{
  title: {js_str(payload["title"])},
  subtitle: {js_str(payload["subtitle"])},
  txnCount: {payload["txnCount"]},
  total: {payload["total"]},
  dailyAvg: {payload["dailyAvg"]},
  maxTxn: {payload["maxTxn"]},
  top2Pct: {payload["top2Pct"]},
  peakNote: {js_str(payload["peakNote"])},
  dateRange: {js_str(payload["dateRange"])},
  bucketTxnCount: {payload["txnCount"]},
}};
"""

    if template_path.exists():
        tpl = template_path.read_text(encoding="utf-8")
    else:
        tpl = _default_template()

    out = re.sub(
        r"// @generated-data-start.*?// @generated-data-end",
        f"// @generated-data-start\n{data_section.strip()}\n// @generated-data-end",
        tpl,
        flags=re.DOTALL,
    )
    out_path.write_text(out, encoding="utf-8")


def render_year_canvas(
    year_report: Report,
    month_reports: list[Report],
    cfg: dict,
    template_path: Path,
    out_path: Path,
) -> None:
    clf = create_classifier(cfg, default_config_path())
    month_payloads = [
        build_period_payload(r, cfg, clf) for r in month_reports if r.count > 0
    ]
    year_payload = build_period_payload(year_report, cfg, clf)

    monthly_totals = [
        {
            "label": p["key"],
            "total": p["total"],
            "count": p["txnCount"],
        }
        for p in month_payloads
    ]
    month_count = len(month_payloads)
    max_month = max(month_payloads, key=lambda p: p["total"]) if month_payloads else None
    top_cats = year_payload["categories"][:2]
    top2_label = "+".join(c["name"] for c in top_cats)
    top2_pct = sum(c["pct"] for c in top_cats)

    from expense_core.stats import bucket_category_breakdown, amount_bucket_label, merged_bucket_label

    large_txns = sorted(
        (t for t in year_report.transactions if t.amount >= 500),
        key=lambda t: (-t.amount, t.dt),
    )
    large_list = list(large_txns)
    large_labels = clf.classify_many(large_list)
    large_rows = [
        {
            "date": t.dt.isoformat(),
            "amount": round(t.amount, 2),
            "category": large_labels[i],
            "platform": t.platform,
            "label": fmt_item_row(t)[0],
        }
        for i, t in enumerate(large_list)
    ]
    large_total = round(sum(t.amount for t in large_list), 2)
    bucket_cats_fine = bucket_category_breakdown(
        year_report.transactions, amount_bucket_label, clf
    )
    bucket_cats_merged = bucket_category_breakdown(
        year_report.transactions, merged_bucket_label, clf
    )

    title_suffix = "纯花销汇总" if year_report.excluded_note else "日常开销汇总"
    year_meta = {
        "title": f"{year_report.period_label} {title_suffix}",
        "subtitle": year_report.excluded_note
        or "全量日常开销（含转账/房租）· 按自然月展开",
        "dateRange": f"{year_report.date_start} ~ {year_report.date_end}",
        "txnCount": year_payload["txnCount"],
        "total": year_payload["total"],
        "monthlyAvg": round(year_payload["total"] / month_count, 2) if month_count else 0,
        "maxMonthTotal": max_month["total"] if max_month else 0,
        "maxMonthLabel": max_month["key"] if max_month else "",
        "top2Pct": round(top2_pct, 1),
        "top2Label": top2_label,
        "monthCount": month_count,
        "largeTxnCount": len(large_rows),
        "largeTxnTotal": large_total,
    }

    data_section = f"""
type Item = [string, string];
type Category = {{ name: string; amount: number; pct: number; count: number }};
type Bucket = {{ label: string; count: number; amount: number }};
type Detail = {{ name: string; meta: string; rows: Item[] }};
type LargeTxn = {{
  date: string;
  amount: number;
  category: string;
  platform: string;
  label: string;
}};
type BucketCategory = {{
  label: string;
  count: number;
  amount: number;
  categories: Category[];
}};
type MonthPayload = {{
  key: string;
  title: string;
  subtitle: string;
  txnCount: number;
  total: number;
  dailyAvg: number;
  maxTxn: number;
  top2Pct: number;
  peakNote: string;
  dateRange: string;
  categories: Category[];
  daily: number[];
  amountBuckets: Bucket[];
  amountBucketsMerged: Bucket[];
  details: Detail[];
}};

const YEAR_META = {json.dumps(year_meta, ensure_ascii=False, indent=2)};

const MONTHLY_TOTALS: {{ label: string; total: number; count: number }}[] = {json.dumps(monthly_totals, ensure_ascii=False, indent=2)};

const YEAR_CATEGORIES: Category[] = {json.dumps(year_payload["categories"], ensure_ascii=False, indent=2)};

const YEAR_AMOUNT_BUCKETS: Bucket[] = {json.dumps(year_payload["amountBuckets"], ensure_ascii=False, indent=2)};

const YEAR_AMOUNT_BUCKETS_MERGED: Bucket[] = {json.dumps(year_payload["amountBucketsMerged"], ensure_ascii=False, indent=2)};

const YEAR_BUCKET_CATEGORIES: BucketCategory[] = {json.dumps(bucket_cats_fine, ensure_ascii=False, indent=2)};

const YEAR_BUCKET_CATEGORIES_MERGED: BucketCategory[] = {json.dumps(bucket_cats_merged, ensure_ascii=False, indent=2)};

const LARGE_TXNS: LargeTxn[] = {json.dumps(large_rows, ensure_ascii=False, indent=2)};

const MONTHS: MonthPayload[] = {json.dumps(month_payloads, ensure_ascii=False, indent=2)};
"""

    tpl = template_path.read_text(encoding="utf-8")
    out = re.sub(
        r"// @generated-data-start.*?// @generated-data-end",
        f"// @generated-data-start\n{data_section.strip()}\n// @generated-data-end",
        tpl,
        flags=re.DOTALL,
    )
    out_path.write_text(out, encoding="utf-8")


def render_markdown(report: Report, cfg: dict, out_path: Path) -> None:
    from expense_core.stats import category_stats

    clf = create_classifier(cfg, default_config_path())
    cats = category_stats(report.transactions, clf)
    lines = [
        f"# {report.period_label} 开销报表（脚本生成）",
        "",
        f"统计区间：{report.date_start} ~ {report.date_end}",
        f"**合计：{report.total:,.2f} 元（{report.count} 笔）**",
        "",
    ]
    if report.excluded_note:
        lines += [report.excluded_note, ""]
    lines += ["## 分类汇总", "", "| 类别 | 金额 | 占比 | 笔数 |", "| --- | --- | --- | --- |"]
    for c in cats:
        lines.append(f"| {c['name']} | {c['amount']:,.2f} | {c['pct']}% | {c['count']} |")
    lines += ["", "## 每日汇总", ""]
    daily = daily_totals(report.transactions, report.date_start, report.date_end)
    for i, amt in enumerate(daily):
        if amt > 0:
            lines.append(f"- {report.date_start + timedelta(days=i)}: {amt:,.2f} 元")
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _default_template() -> str:
    return (Path(__file__).resolve().parent.parent / "templates" / "expense-breakdown.canvas.template.tsx").read_text(
        encoding="utf-8"
    )
