from __future__ import annotations

from collections import defaultdict

from expense_core.models import Txn
from expense_core.pipeline import is_investment
from expense_core.stats import catalog_group_key, clean_counterparty, txn_key

MONTHLY_MIN = 28
MONTHLY_MAX = 35
QUARTERLY_MIN = 85
QUARTERLY_MAX = 95
AMOUNT_VARIANCE_MAX = 0.10
SUBSCRIPTION_CATEGORY = "会员订阅"
INVESTMENT_CATEGORY = "理财/基金"


def _detect_cadence(intervals: list[int]) -> str | None:
    if not intervals:
        return None
    if all(MONTHLY_MIN <= days <= MONTHLY_MAX for days in intervals):
        return "monthly"
    if all(QUARTERLY_MIN <= days <= QUARTERLY_MAX for days in intervals):
        return "quarterly"
    return None


def _amount_stable(amounts: list[float]) -> bool:
    if not amounts:
        return False
    avg = sum(amounts) / len(amounts)
    if avg <= 0:
        return False
    return (max(amounts) - min(amounts)) / avg <= AMOUNT_VARIANCE_MAX


def _display_label(txn: Txn) -> str:
    cp = clean_counterparty(txn.counterparty)
    desc = txn.description.strip()
    generic = {"", "/", "商户消费", "扫二维码付款", "网上快捷支付"}
    if cp and cp not in generic:
        return cp
    return desc or cp or "未知"


def _subscription_rule_hit(txn: Txn, cfg: dict) -> bool:
    rules = cfg.get("category_rules") or {}
    keywords = rules.get(SUBSCRIPTION_CATEGORY) or []
    blob = txn.text_blob()
    return any(kw and kw in blob for kw in keywords)


def _resolve_category(txns: list[Txn], label_map: dict[tuple, str]) -> str:
    categories = [label_map.get(txn_key(t), "其他") for t in txns]
    if any(is_investment(t.counterparty, t.description) for t in txns):
        return INVESTMENT_CATEGORY
    if SUBSCRIPTION_CATEGORY in categories:
        return SUBSCRIPTION_CATEGORY
    return max(set(categories), key=categories.count)


def _recurring_group_key(txn: Txn) -> str:
    base = catalog_group_key(txn)
    if is_investment(txn.counterparty, txn.description):
        return f"{base}|amt:{round(txn.amount, 2)}"
    return base


def detect_recurring(
    kept: list[Txn],
    label_map: dict[tuple, str],
    cfg: dict,
) -> list[dict]:
    """Detect monthly or quarterly recurring charges grouped by catalog_group_key."""
    groups: dict[str, list[Txn]] = defaultdict(list)
    for txn in kept:
        groups[_recurring_group_key(txn)].append(txn)

    results: list[dict] = []
    for txns in groups.values():
        if len(txns) < 2:
            continue

        txns_sorted = sorted(txns, key=lambda t: t.dt)
        intervals = [
            (txns_sorted[i + 1].dt - txns_sorted[i].dt).days
            for i in range(len(txns_sorted) - 1)
        ]
        cadence = _detect_cadence(intervals)
        if cadence is None:
            continue

        amounts = [t.amount for t in txns_sorted]
        if not _amount_stable(amounts):
            continue

        investment = any(is_investment(t.counterparty, t.description) for t in txns_sorted)
        category = _resolve_category(txns_sorted, label_map)
        rule_hit = any(_subscription_rule_hit(t, cfg) for t in txns_sorted)
        confidence = (
            "high"
            if investment or rule_hit or category == SUBSCRIPTION_CATEGORY
            else "medium"
        )
        kind = "investment" if investment else "subscription"

        avg_amount = round(sum(amounts) / len(amounts), 2)
        annual_factor = 12 if cadence == "monthly" else 4
        last_txn = txns_sorted[-1]

        results.append({
            "label": _display_label(last_txn),
            "category": category,
            "amount": avg_amount,
            "cadence": cadence,
            "annualEst": round(avg_amount * annual_factor, 2),
            "confidence": confidence,
            "lastDate": last_txn.dt.isoformat(),
            "kind": kind,
        })

    results.sort(key=lambda row: (-row["annualEst"], row["label"]))
    return results
