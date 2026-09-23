from __future__ import annotations

import logging
from pathlib import Path

from expense_core.categories import CATEGORY_NAMES
from expense_core.classifiers.keyword import KeywordClassifier
from expense_core.classifiers.keyword_extract import merge_keyword, suggest_keyword
from expense_core.classifiers.llm import LLMClassifier
from expense_core.config import save_config
from expense_core.models import Txn
from expense_core.stats import catalog_group_key

logger = logging.getLogger(__name__)


class LearningClassifier:
    """关键词优先；未命中时批量 LLM，并将结果写回 category_rules。"""

    def __init__(
        self,
        cfg: dict,
        config_path: Path,
        keyword: KeywordClassifier,
        llm: LLMClassifier | None,
    ) -> None:
        self._cfg = cfg
        self._config_path = config_path
        self._rules: dict[str, list[str]] = cfg.setdefault("category_rules", {})
        for name in CATEGORY_NAMES:
            self._rules.setdefault(name, [])
        self._keyword = keyword
        self._llm = llm
        self.learned_added = 0

    def classify(self, txn: Txn) -> str:
        return self.classify_many([txn])[0]

    def classify_many(self, txns: list[Txn]) -> list[str]:
        if not txns:
            return []

        results: list[str | None] = [None] * len(txns)
        rep_txns: list[Txn] = []
        rep_index: dict[str, int] = {}
        pending: list[tuple[int, int]] = []

        for i, t in enumerate(txns):
            cat = self._keyword.classify(t)
            if cat != "其他":
                results[i] = cat
                continue
            gk = catalog_group_key(t)
            if gk not in rep_index:
                rep_index[gk] = len(rep_txns)
                rep_txns.append(t)
            pending.append((i, rep_index[gk]))

        if rep_txns and self._llm is not None:
            try:
                llm_labels = self._llm.classify_many(rep_txns)
            except Exception as exc:
                logger.warning("LLM 分类失败，未学习新关键词: %s", exc)
                llm_labels = ["其他"] * len(rep_txns)

            learned_store: dict[str, list[str]] = self._cfg.setdefault(
                "_learned_keywords", {}
            )
            for name in CATEGORY_NAMES:
                learned_store.setdefault(name, [])

            dirty = False
            added = 0
            for txn, cat in zip(rep_txns, llm_labels):
                if cat == "其他":
                    continue
                kw = suggest_keyword(txn)
                if kw and merge_keyword(self._rules, cat, kw):
                    if kw not in learned_store[cat]:
                        learned_store[cat].append(kw)
                    dirty = True
                    added += 1

            if dirty:
                self._cfg["category_rules"] = {
                    k: list(self._rules.get(k, [])) for k in CATEGORY_NAMES
                }
                self._cfg["_learned_keywords"] = {
                    k: list(learned_store.get(k, [])) for k in CATEGORY_NAMES
                }
                save_config(self._config_path, self._cfg)
                self._keyword = KeywordClassifier(self._rules)
                self.learned_added += added

            for i, rep_i in pending:
                results[i] = llm_labels[rep_i]
        else:
            for i, _ in pending:
                results[i] = "其他"

        return [r or "其他" for r in results]
