from __future__ import annotations

import json
from datetime import date
from pathlib import Path

from expense_core.categories import CATEGORY_NAMES
from expense_core.classifiers.keyword import KeywordClassifier
from expense_core.classifiers.learn import LearningClassifier
from expense_core.classifiers.llm import LLMClassifier
from expense_core.config import DEFAULT_CONFIG, clear_learned_keywords, load_config, save_config
from expense_core.models import Txn
from expense_core.report import build_full_report


def _txn(
    *,
    dt: date | None = None,
    counterparty: str = "商户",
    description: str = "测试",
    amount: float = 10.0,
) -> Txn:
    return Txn(
        dt=dt or date(2026, 1, 1),
        time="12:00",
        amount=amount,
        platform="支付宝",
        counterparty=counterparty,
        description=description,
        source="alipay",
    )


def _empty_rules() -> dict[str, list[str]]:
    return {name: [] for name in CATEGORY_NAMES}


def test_learning_classifier_persists_keyword(tmp_path: Path):
    cfg_path = tmp_path / "expense_config.json"
    cfg = load_config(None)
    cfg["category_rules"] = _empty_rules()
    save_config(cfg_path, cfg)

    llm_calls = 0

    def mock_api(_base, _key, body):
        nonlocal llm_calls
        llm_calls += 1
        items = json.loads(body["messages"][1]["content"])
        return json.dumps(
            [{"id": row["id"], "category": "游戏动漫"} for row in items],
            ensure_ascii=False,
        )

    llm = LLMClassifier(api_key="test-key", api_caller=mock_api)
    learn = LearningClassifier(
        cfg, cfg_path, KeywordClassifier(cfg["category_rules"]), llm
    )
    txn = _txn(counterparty="Good Smile Company", description="蔚蓝档案手办")

    assert learn.classify(txn) == "游戏动漫"
    assert llm_calls == 1
    assert learn.learned_added == 1

    saved = json.loads(cfg_path.read_text(encoding="utf-8"))
    assert "Good Smile Company" in saved["category_rules"]["游戏动漫"]
    assert "Good Smile Company" in saved["_learned_keywords"]["游戏动漫"]

    llm_calls = 0
    learn_again = LearningClassifier(
        cfg,
        cfg_path,
        KeywordClassifier(saved["category_rules"]),
        llm,
    )
    assert learn_again.classify(txn) == "游戏动漫"
    assert llm_calls == 0


def test_build_full_report_classifies_once():
    kept = [
        _txn(dt=date(2026, 1, 5), amount=100, description="一月"),
        _txn(dt=date(2026, 2, 10), amount=200, description="二月"),
    ]

    class CountingClassifier:
        learned_added = 0

        def __init__(self) -> None:
            self.calls = 0

        def classify(self, txn: Txn) -> str:
            return self.classify_many([txn])[0]

        def classify_many(self, txns: list[Txn]) -> list[str]:
            self.calls += 1
            return ["其他"] * len(txns)

    clf = CountingClassifier()
    cfg = dict(DEFAULT_CONFIG)
    cfg["pure_spending"] = {"enabled": True}

    build_full_report(
        kept,
        [],
        "",
        date(2026, 1, 1),
        date(2026, 2, 28),
        "2026.01–02",
        cfg,
        granularity="month",
        classifier=clf,
    )

    assert clf.calls == 1


def test_merge_keyword_skips_generic():
    from expense_core.classifiers.keyword_extract import merge_keyword

    rules = _empty_rules()
    assert merge_keyword(rules, "餐饮食品", "支付") is False
    assert rules["餐饮食品"] == []


def test_clear_learned_keywords(tmp_path: Path):
    cfg_path = tmp_path / "expense_config.json"
    cfg = load_config(None)
    cfg["category_rules"] = _empty_rules()
    cfg["category_rules"]["游戏动漫"] = ["手工规则", "LLM学到"]
    cfg["_learned_keywords"] = {"游戏动漫": ["LLM学到"]}
    for name in CATEGORY_NAMES:
        cfg["_learned_keywords"].setdefault(name, [])
    save_config(cfg_path, cfg)

    removed = clear_learned_keywords(cfg_path)
    assert removed == 1

    saved = json.loads(cfg_path.read_text(encoding="utf-8"))
    assert saved["category_rules"]["游戏动漫"] == ["手工规则"]
    assert saved["_learned_keywords"]["游戏动漫"] == []
