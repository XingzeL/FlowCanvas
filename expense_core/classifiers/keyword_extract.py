from __future__ import annotations

import re

from expense_core.categories import CATEGORY_NAMES
from expense_core.models import Txn
from expense_core.stats import clean_counterparty, clean_description

GENERIC_KEYWORDS = frozenset({
    "支付", "订单", "商户", "消费", "转账", "退款", "充值", "提现",
    "快捷支付", "无卡支付", "扫二维码付款", "商户消费",
})

MIN_KEYWORD_LEN = 3


def suggest_keyword(txn: Txn) -> str | None:
    cp = clean_counterparty(txn.counterparty)
    desc = clean_description(txn.description)
    generic_desc = {
        "", "/", "转账", "转账备注:微信转账", "商户消费", "扫二维码付款",
        "网上快捷支付", "快捷支付", "无卡支付",
    }

    if cp and cp not in generic_desc:
        hint = cp
    elif desc and desc not in generic_desc:
        hint = re.sub(r"<NUM>", "", desc).strip()[:20]
    else:
        return None

    hint = hint.strip()
    if len(hint) < MIN_KEYWORD_LEN:
        return None
    if hint in ("（空）", "<NUM>"):
        return None
    if hint in GENERIC_KEYWORDS:
        return None
    return hint


def merge_keyword(rules: dict[str, list[str]], category: str, keyword: str) -> bool:
    if category not in CATEGORY_NAMES or category == "其他":
        return False
    if not keyword or keyword in GENERIC_KEYWORDS:
        return False
    bucket = rules.setdefault(category, [])
    if keyword in bucket:
        return False
    if any(keyword in existing or existing in keyword for existing in bucket if len(existing) >= 4):
        return False
    bucket.append(keyword)
    return True
