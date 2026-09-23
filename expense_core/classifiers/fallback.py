from __future__ import annotations

import logging

from expense_core.classifiers.base import Classifier
from expense_core.models import Txn

logger = logging.getLogger(__name__)


class FallbackClassifier:
    """主分类器失败时回退到备用分类器。"""

    def __init__(self, primary: Classifier, fallback: Classifier) -> None:
        self._primary = primary
        self._fallback = fallback

    def classify(self, txn: Txn) -> str:
        return self.classify_many([txn])[0]

    def classify_many(self, txns: list[Txn]) -> list[str]:
        if not txns:
            return []
        try:
            return self._primary.classify_many(txns)
        except Exception as exc:
            logger.warning("主分类器失败，回退到关键词匹配: %s", exc)
            return self._fallback.classify_many(txns)
