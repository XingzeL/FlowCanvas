from __future__ import annotations

from expense_core.models import Txn
from expense_core.categories import CATEGORY_ORDER


class KeywordClassifier:
    """基于 category_rules 关键词子串匹配的分类器（原有逻辑）。"""

    def __init__(self, rules: dict[str, list[str]]) -> None:
        self._rules = rules

    def classify(self, txn: Txn) -> str:
        blob = txn.text_blob()
        for cat in CATEGORY_ORDER:
            kws = self._rules.get(cat, [])
            if any(k in blob for k in kws):
                return cat
        return "其他"

    def classify_many(self, txns: list[Txn]) -> list[str]:
        return [self.classify(t) for t in txns]
