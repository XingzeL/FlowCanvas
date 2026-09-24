from __future__ import annotations

import logging

from expense_core.classifiers.base import Classifier
from expense_core.models import Txn
from expense_core.stats import catalog_group_key

logger = logging.getLogger(__name__)


class FallbackClassifier:
    """关键词优先；仅对未命中项调用 LLM，失败时保留「其他」。"""

    def __init__(self, primary: Classifier, fallback: Classifier) -> None:
        self._primary = primary
        self._fallback = fallback

    def classify(self, txn: Txn) -> str:
        return self.classify_many([txn])[0]

    def classify_many(self, txns: list[Txn]) -> list[str]:
        if not txns:
            return []

        kw_results = self._fallback.classify_many(txns)
        pending: list[int] = [i for i, cat in enumerate(kw_results) if cat == "其他"]
        if not pending:
            return kw_results

        rep_txns: list[Txn] = []
        rep_index: dict[str, int] = {}
        pending_map: list[tuple[int, int]] = []
        for i in pending:
            gk = catalog_group_key(txns[i])
            if gk not in rep_index:
                rep_index[gk] = len(rep_txns)
                rep_txns.append(txns[i])
            pending_map.append((i, rep_index[gk]))

        try:
            llm_labels = self._primary.classify_many(rep_txns)
        except Exception as exc:
            logger.warning("LLM 分类失败，保留关键词未命中为「其他」: %s", exc)
            return kw_results

        out = list(kw_results)
        for txn_i, rep_i in pending_map:
            out[txn_i] = llm_labels[rep_i]
        return out
