from __future__ import annotations

import re
from typing import Protocol, runtime_checkable

from expense_core.models import Txn
from expense_core.categories import CATEGORY_NAMES

VALID_CATEGORIES = frozenset(CATEGORY_NAMES)


@runtime_checkable
class Classifier(Protocol):
    def classify(self, txn: Txn) -> str: ...

    def classify_many(self, txns: list[Txn]) -> list[str]: ...


def normalize_category(name: str) -> str:
    cleaned = name.strip().replace(" ", "")
    if cleaned in VALID_CATEGORIES:
        return cleaned
    for cat in CATEGORY_NAMES:
        if cat in cleaned or cleaned in cat:
            return cat
    return "其他"


def txn_display_name(txn: Txn) -> str:
    cp = re.sub(r"\s*\([^)]*\)", "", txn.counterparty).strip()
    desc = txn.description.strip()
    generic = {
        "",
        "/",
        "转账",
        "转账备注:微信转账",
        "商户消费",
        "扫二维码付款",
        "网上快捷支付",
        "快捷支付",
        "无卡支付",
    }
    if desc in generic or desc.startswith("收款方备注"):
        name = cp
    elif cp and cp not in desc:
        name = f"{cp} {desc}"
    elif desc:
        name = desc
    else:
        name = cp or "未知"
    return name[:120]
