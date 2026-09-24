from __future__ import annotations

from collections import defaultdict

from expense_core.models import Txn

REASON_LABELS: dict[str, str] = {
    "transfer": "转账/红包",
    "rent": "房租",
    "investment": "理财/基金",
    "debt": "还款/信贷",
    "non_spending": "非消费",
    "wechat_transfer": "微信转账/红包",
}

REASON_ORDER = (
    "wechat_transfer",
    "transfer",
    "rent",
    "investment",
    "debt",
    "non_spending",
)


def _item_description(t: Txn) -> str:
    cp = t.counterparty.strip()
    desc = t.description.strip()
    if cp and desc and cp not in desc:
        return f"{cp} · {desc}"
    return cp or desc


def build_excluded_detail(excluded_records: list[tuple[Txn, str]]) -> dict:
    groups_acc: dict[str, list[Txn]] = defaultdict(list)
    for txn, reason in excluded_records:
        groups_acc[reason].append(txn)

    groups: list[dict] = []
    for reason in REASON_ORDER:
        items = groups_acc.get(reason)
        if not items:
            continue
        amount = round(sum(t.amount for t in items), 2)
        groups.append({
            "reason": reason,
            "label": REASON_LABELS.get(reason, reason),
            "count": len(items),
            "amount": amount,
            "items": [
                {
                    "date": t.dt.isoformat(),
                    "platform": t.platform,
                    "description": _item_description(t),
                    "amount": round(t.amount, 2),
                }
                for t in sorted(items, key=lambda x: (-x.amount, x.dt, x.time))
            ],
        })

    for reason, items in groups_acc.items():
        if reason in REASON_ORDER:
            continue
        amount = round(sum(t.amount for t in items), 2)
        groups.append({
            "reason": reason,
            "label": REASON_LABELS.get(reason, reason),
            "count": len(items),
            "amount": amount,
            "items": [
                {
                    "date": t.dt.isoformat(),
                    "platform": t.platform,
                    "description": _item_description(t),
                    "amount": round(t.amount, 2),
                }
                for t in sorted(items, key=lambda x: (-x.amount, x.dt, x.time))
            ],
        })

    total_amount = round(sum(t.amount for t, _ in excluded_records), 2)
    return {
        "summary": {
            "count": len(excluded_records),
            "amount": total_amount,
        },
        "groups": groups,
    }
