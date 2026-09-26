from __future__ import annotations

import re
from collections import defaultdict
from datetime import date, timedelta

from expense_core.models import Txn

from expense_core.categories import CATEGORY_NAMES, CATEGORY_ORDER
from expense_core.classifiers.base import Classifier
from expense_core.classifiers.keyword import KeywordClassifier
from expense_core.models import Txn


def txn_key(t: Txn) -> tuple:
    return (
        t.dt.isoformat(),
        t.time,
        t.amount,
        t.platform,
        t.counterparty,
        t.description,
        t.source,
    )


def classify_transactions(
    txns: list[Txn], classifier: Classifier
) -> dict[tuple, str]:
    labels = classifier.classify_many(txns)
    return {txn_key(t): cat for t, cat in zip(txns, labels)}


def classify(
    txn: Txn,
    rules: dict[str, list[str]] | None = None,
    classifier: Classifier | None = None,
) -> str:
    clf = classifier or KeywordClassifier(rules or {})
    return clf.classify(txn)


def clean_counterparty(s: str) -> str:
    s = re.sub(r"\s*\([^)]*\)", "", s).strip()
    s = re.sub(r"\s+", " ", s)
    return s


def clean_description(s: str) -> str:
    s = s.strip()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"\d{8,}", "<NUM>", s)
    s = re.sub(r"(订单编号|商户单号|订单号)[:：]?\s*<NUM>", r"\1:<NUM>", s)
    return s


def catalog_group_key(txn: Txn) -> str:
    cp = clean_counterparty(txn.counterparty)
    desc = clean_description(txn.description)
    generic = {
        "", "/", "转账", "转账备注:微信转账", "商户消费", "扫二维码付款",
        "网上快捷支付", "快捷支付", "无卡支付",
    }
    if desc in generic or desc.startswith("收款方备注"):
        return f"cp:{cp}"
    if cp and cp in desc:
        return f"desc:{desc}"
    if not cp:
        return f"desc:{desc}"
    return f"both:{cp}|{desc}"


def build_catalog_entries(
    txns: list[Txn],
    rules: dict | None = None,
    classifier: Classifier | None = None,
) -> list[dict]:
    clf = classifier or KeywordClassifier(rules or {})
    groups: dict[str, dict] = {}
    for t in txns:
        key = catalog_group_key(t)
        g = groups.get(key)
        if g is None:
            g = {
                "key": key,
                "counterparty": clean_counterparty(t.counterparty),
                "description": clean_description(t.description),
                "platforms": set(),
                "count": 0,
                "amount": 0.0,
                "samples": [],
                "current": clf.classify(t),
            }
            groups[key] = g
        g["platforms"].add(t.platform)
        g["count"] += 1
        g["amount"] += t.amount
        if len(g["samples"]) < 3:
            g["samples"].append(
                f"{t.dt.isoformat()} {t.platform} ¥{t.amount:,.2f}"
                f" · {clean_counterparty(t.counterparty)} / {t.description[:40]}"
            )
        cat = clf.classify(t)
        if g["current"] != cat and "其他" in (g["current"], cat):
            g["current"] = "其他"

    rows = []
    for g in groups.values():
        rows.append({
            **g,
            "platforms": "、".join(sorted(g["platforms"])),
            "amount": round(g["amount"], 2),
        })
    rows.sort(key=lambda r: (-r["amount"], -r["count"], r["counterparty"]))
    return rows


def amount_bucket_label(amount: float) -> str:
    bounds = [0, 30, 50, 100, 200, 300, 500, 800, 1000]
    labels = ["0–30", "30–50", "50–100", "100–200", "200–300", "300–500", "500–800", "800–1000", "1000+"]
    for i in range(len(bounds) - 1):
        if bounds[i] <= amount < bounds[i + 1]:
            return labels[i]
    return labels[-1]


def merged_bucket_label(amount: float) -> str:
    if amount < 50:
        return "0–50"
    if amount < 200:
        return "50–200"
    if amount < 500:
        return "200–500"
    return "500+"


def build_buckets(txns: list[Txn], label_fn) -> list[dict]:
    acc: dict[str, dict] = defaultdict(lambda: {"count": 0, "amount": 0.0})
    for t in txns:
        lb = label_fn(t.amount)
        acc[lb]["count"] += 1
        acc[lb]["amount"] += t.amount
    if label_fn is amount_bucket_label:
        order = ["0–30", "30–50", "50–100", "100–200", "200–300", "300–500", "500–800", "800–1000", "1000+"]
    else:
        order = ["0–50", "50–200", "200–500", "500+"]
    return [{"label": lb, "count": acc[lb]["count"], "amount": round(acc[lb]["amount"], 2)} for lb in order]


def bucket_category_breakdown(
    txns: list[Txn],
    label_fn,
    classifier: Classifier | None = None,
    *,
    label_map: dict[tuple, str] | None = None,
) -> list[dict]:
    by_bucket: dict[str, list[Txn]] = defaultdict(list)
    for t in txns:
        by_bucket[label_fn(t.amount)].append(t)
    if label_fn is amount_bucket_label:
        order = ["0–30", "30–50", "50–100", "100–200", "200–300", "300–500", "500–800", "800–1000", "1000+"]
    else:
        order = ["0–50", "50–200", "200–500", "500+"]
    out: list[dict] = []
    for lb in order:
        items = by_bucket.get(lb, [])
        if not items:
            continue
        cats = category_stats(items, classifier, label_map=label_map)
        cats_sorted = sorted(cats, key=lambda c: -c["amount"])
        out.append({
            "label": lb,
            "count": len(items),
            "amount": round(sum(t.amount for t in items), 2),
            "categories": [
                {
                    "name": c["name"],
                    "amount": c["amount"],
                    "pct": c["pct"],
                    "count": c["count"],
                }
                for c in cats_sorted
            ],
        })
    return out


def daily_totals(txns: list[Txn], d0: date, d1: date) -> list[float]:
    by_day: dict[date, float] = defaultdict(float)
    for t in txns:
        by_day[t.dt] += t.amount
    days = (d1 - d0).days + 1
    return [round(by_day.get(d0 + timedelta(days=i), 0.0), 2) for i in range(days)]


def _percentile(values: list[float], p: float) -> float:
    if not values:
        return 0.0
    sorted_vals = sorted(values)
    n = len(sorted_vals)
    if n == 1:
        return sorted_vals[0]
    k = (n - 1) * p / 100.0
    f = int(k)
    c = min(f + 1, n - 1)
    if f == c:
        return sorted_vals[f]
    return sorted_vals[f] + (sorted_vals[c] - sorted_vals[f]) * (k - f)


def summary_stats(txns: list[Txn]) -> dict:
    if not txns:
        return {
            "dailyAvg": 0.0,
            "txnAvg": 0.0,
            "medianTxn": 0.0,
            "p90Txn": 0.0,
        }
    total = sum(t.amount for t in txns)
    count = len(txns)
    spending_days = len({t.dt for t in txns})
    amounts = [t.amount for t in txns]
    return {
        "dailyAvg": round(total / spending_days, 2),
        "txnAvg": round(total / count, 2),
        "medianTxn": round(_percentile(amounts, 50), 2),
        "p90Txn": round(_percentile(amounts, 90), 2),
    }


def _category_public_fields(
    items: list[Txn],
    amt: float,
    total_amt: float,
    total_count: int,
    global_txn_avg: float,
) -> dict:
    count = len(items)
    spending_days = len({t.dt for t in items}) or 1
    txn_avg = amt / count if count else 0.0
    if global_txn_avg > 0:
        txn_avg_delta = (txn_avg / global_txn_avg - 1) * 100
    else:
        txn_avg_delta = 0.0
    return {
        "amount": round(amt, 2),
        "pct": round(amt / total_amt * 100, 1) if total_amt else 0.0,
        "count": count,
        "dailyAvg": round(amt / spending_days, 2),
        "txnAvg": round(txn_avg, 2),
        "countPct": round(count / total_count * 100, 1) if total_count else 0.0,
        "maxTxn": round(max(t.amount for t in items), 2),
        "txnAvgDeltaPct": round(txn_avg_delta, 1),
    }


def category_stats(
    txns: list[Txn],
    classifier: Classifier | None = None,
    *,
    label_map: dict[tuple, str] | None = None,
) -> list[dict]:
    if label_map is not None:
        labels = [label_map[txn_key(t)] for t in txns]
    elif classifier is not None:
        labels = classifier.classify_many(txns)
    else:
        raise ValueError("category_stats 需要 classifier 或 label_map")
    acc: dict[str, list[Txn]] = defaultdict(list)
    for t, cat in zip(txns, labels):
        acc[cat].append(t)
    total_amt = sum(t.amount for t in txns) or 1.0
    total_count = len(txns) or 1
    global_txn_avg = sum(t.amount for t in txns) / len(txns) if txns else 0.0
    rows = []
    for name in CATEGORY_NAMES:
        items = acc.get(name, [])
        if not items:
            continue
        amt = sum(t.amount for t in items)
        rows.append({
            "name": name,
            **_category_public_fields(items, amt, total_amt, total_count, global_txn_avg),
            "items": sorted(items, key=lambda x: -x.amount),
        })
    return rows


def platform_breakdown(txns: list[Txn]) -> list[dict]:
    acc: dict[str, dict] = defaultdict(lambda: {"amount": 0.0, "count": 0})
    for t in txns:
        acc[t.platform]["amount"] += t.amount
        acc[t.platform]["count"] += 1
    total = sum(t.amount for t in txns) or 1.0
    rows: list[dict] = []
    for platform, data in sorted(acc.items(), key=lambda x: -x[1]["amount"]):
        amt = data["amount"]
        rows.append({
            "platform": platform,
            "amount": round(amt, 2),
            "count": data["count"],
            "pct": round(amt / total * 100, 1),
        })
    return rows


def category_trend(period_payloads: list[dict]) -> dict:
    keys = [p["key"] for p in period_payloads]
    series: list[dict] = []
    for name in CATEGORY_NAMES:
        amounts: list[float] = []
        for p in period_payloads:
            cat_map = {c["name"]: c["amount"] for c in p.get("categories", [])}
            amounts.append(round(cat_map.get(name, 0.0), 2))
        if any(a > 0 for a in amounts):
            series.append({"name": name, "amounts": amounts})
    return {"keys": keys, "series": series}


def daily_spending_map(txns: list[Txn]) -> dict:
    by_day: dict[date, dict[str, float | int]] = defaultdict(
        lambda: {"amount": 0.0, "count": 0}
    )
    for t in txns:
        by_day[t.dt]["amount"] += t.amount
        by_day[t.dt]["count"] += 1
    days = [
        {
            "date": d.isoformat(),
            "amount": round(v["amount"], 2),
            "count": int(v["count"]),
        }
        for d, v in sorted(by_day.items())
    ]
    max_amount = max((d["amount"] for d in days), default=0.0)
    return {"days": days, "maxAmount": round(max_amount, 2)}


def fmt_item_row(t: Txn) -> tuple[str, str]:
    cp = re.sub(r"\s*\([^)]*\)", "", t.counterparty).strip()
    desc = t.description.strip()
    generic = {"转账备注:微信转账", "转账", "商户消费", "扫二维码付款"}
    if desc in generic or not desc:
        label = f"{t.dt.strftime('%m-%d')} {cp}"
    elif desc not in cp:
        short = desc[:24] + ("…" if len(desc) > 24 else "")
        label = f"{t.dt.strftime('%m-%d')} {short}"
    else:
        label = f"{t.dt.strftime('%m-%d')} {cp}"
    return label, f"{t.amount:,.2f}"
