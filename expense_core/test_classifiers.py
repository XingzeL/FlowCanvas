from __future__ import annotations

from datetime import date

import pytest

from expense_core.classifiers.fallback import FallbackClassifier
from expense_core.classifiers.keyword import KeywordClassifier
from expense_core.classifiers.llm import LLMClassifier
from expense_core.models import Txn


def _txn(description: str, amount: float = 10.0) -> Txn:
    return Txn(
        dt=date(2026, 1, 1),
        time="12:00",
        amount=amount,
        platform="支付宝",
        counterparty="商户",
        description=description,
        source="alipay",
    )


def test_keyword_classifier_matches_rules():
    rules = {"餐饮食品": ["美团", "肯德基"]}
    clf = KeywordClassifier(rules)
    assert clf.classify(_txn("美团外卖")) == "餐饮食品"
    assert clf.classify(_txn("未知商户")) == "其他"


def test_fallback_classifier_uses_keyword_on_llm_failure():
    rules = {"餐饮食品": ["美团"]}

    def fail_api(*_args, **_kwargs):
        raise RuntimeError("network down")

    llm = LLMClassifier(
        api_key="test-key",
        api_caller=lambda _base, _key, body: fail_api(),
    )
    fallback = FallbackClassifier(primary=llm, fallback=KeywordClassifier(rules))
    assert fallback.classify(_txn("美团")) == "餐饮食品"
    assert fallback.classify(_txn("其他")) == "其他"


def test_llm_classifier_parses_batch_response():
    rules: dict = {}

    def mock_api(_base, _key, body):
        user = body["messages"][1]["content"]
        import json

        items = json.loads(user)
        return json.dumps(
            [{"id": row["id"], "category": "餐饮食品"} for row in items],
            ensure_ascii=False,
        )

    llm = LLMClassifier(api_key="test-key", api_caller=mock_api)
    txns = [_txn("肯德基", 35.5), _txn("星巴克", 42)]
    assert llm.classify_many(txns) == ["餐饮食品", "餐饮食品"]
    _ = rules  # unused; keep test focused on LLM path
