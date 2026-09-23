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
    total = sum(t.amount for t in txns) or 1.0
    rows = []
    for name in CATEGORY_NAMES:
        items = acc.get(name, [])
        if not items:
            continue
        amt = sum(t.amount for t in items)
        rows.append({
            "name": name,
            "amount": round(amt, 2),
            "pct": round(amt / total * 100, 1),
            "count": len(items),
            "items": sorted(items, key=lambda x: -x.amount),
        })
    return rows


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
