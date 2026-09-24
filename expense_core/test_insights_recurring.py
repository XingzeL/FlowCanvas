from __future__ import annotations

from datetime import date

from expense_core.config import DEFAULT_CONFIG
from expense_core.insights.recurring import detect_recurring
from expense_core.models import Txn
from expense_core.stats import txn_key


def _txn(
    dt: date,
    amount: float,
    counterparty: str = "Apple",
    description: str = "iCloud 续费",
    platform: str = "支付宝",
) -> Txn:
    return Txn(
        dt=dt,
        time="12:00",
        amount=amount,
        platform=platform,
        counterparty=counterparty,
        description=description,
        source="alipay",
    )


def _label_map(*txns: Txn, category: str = "其他") -> dict[tuple, str]:
    return {txn_key(t): category for t in txns}


def test_monthly_same_amount_high_confidence():
    txns = [
        _txn(date(2026, 1, 15), 6.0),
        _txn(date(2026, 2, 15), 6.0),
        _txn(date(2026, 3, 15), 6.0),
    ]
    cfg = dict(DEFAULT_CONFIG)
    cfg["category_rules"] = {"会员订阅": ["iCloud"]}
    labels = _label_map(*txns, category="会员订阅")

    rows = detect_recurring(txns, labels, cfg)

    assert len(rows) == 1
    row = rows[0]
    assert row["label"] == "Apple"
    assert row["category"] == "会员订阅"
    assert row["amount"] == 6.0
    assert row["cadence"] == "monthly"
    assert row["annualEst"] == 72.0
    assert row["confidence"] == "high"
    assert row["lastDate"] == "2026-03-15"


def test_monthly_medium_confidence_without_subscription_signal():
    txns = [
        _txn(date(2026, 1, 10), 50.0, counterparty="健身房", description="月卡扣费"),
        _txn(date(2026, 2, 10), 50.0, counterparty="健身房", description="月卡扣费"),
    ]
    labels = _label_map(*txns, category="医疗健康")

    rows = detect_recurring(txns, labels, DEFAULT_CONFIG)

    assert len(rows) == 1
    assert rows[0]["confidence"] == "medium"
    assert rows[0]["cadence"] == "monthly"
    assert rows[0]["annualEst"] == 600.0


def test_quarterly_interval_detected():
    txns = [
        _txn(date(2026, 1, 1), 99.0, counterparty="Adobe", description="Creative Cloud"),
        _txn(date(2026, 4, 1), 99.0, counterparty="Adobe", description="Creative Cloud"),
    ]
    labels = _label_map(*txns, category="会员订阅")

    rows = detect_recurring(txns, labels, DEFAULT_CONFIG)

    assert len(rows) == 1
    assert rows[0]["cadence"] == "quarterly"
    assert rows[0]["annualEst"] == 396.0


def test_irregular_interval_not_detected():
    txns = [
        _txn(date(2026, 1, 1), 20.0, counterparty="咖啡店", description="消费"),
        _txn(date(2026, 1, 20), 20.0, counterparty="咖啡店", description="消费"),
        _txn(date(2026, 3, 1), 20.0, counterparty="咖啡店", description="消费"),
    ]
    labels = _label_map(*txns)

    rows = detect_recurring(txns, labels, DEFAULT_CONFIG)

    assert rows == []


def test_amount_variance_over_10_percent_not_detected():
    txns = [
        _txn(date(2026, 1, 15), 100.0, counterparty="运营商", description="话费"),
        _txn(date(2026, 2, 15), 120.0, counterparty="运营商", description="话费"),
    ]
    labels = _label_map(*txns, category="通讯话费")

    rows = detect_recurring(txns, labels, DEFAULT_CONFIG)

    assert rows == []


def test_amount_within_10_percent_variance():
    txns = [
        _txn(date(2026, 1, 15), 100.0, counterparty="运营商", description="话费"),
        _txn(date(2026, 2, 15), 108.0, counterparty="运营商", description="话费"),
    ]
    labels = _label_map(*txns, category="通讯话费")

    rows = detect_recurring(txns, labels, DEFAULT_CONFIG)

    assert len(rows) == 1
    assert rows[0]["amount"] == 104.0


def test_single_transaction_group_ignored():
    txns = [_txn(date(2026, 1, 15), 6.0)]
    labels = _label_map(*txns, category="会员订阅")

    rows = detect_recurring(txns, labels, DEFAULT_CONFIG)

    assert rows == []


def test_monthly_fund_sip_detected_as_investment():
    txns = [
        _txn(
            date(2026, 1, 10),
            10.0,
            counterparty="蚂蚁财富",
            description="基金定投-纳指100",
        ),
        _txn(
            date(2026, 2, 10),
            10.0,
            counterparty="蚂蚁财富",
            description="基金定投-纳指100",
        ),
        _txn(
            date(2026, 1, 15),
            100.0,
            counterparty="蚂蚁财富",
            description="基金定投-沪深300",
        ),
        _txn(
            date(2026, 2, 15),
            100.0,
            counterparty="蚂蚁财富",
            description="基金定投-沪深300",
        ),
    ]
    labels = _label_map(*txns, category="其他")

    rows = detect_recurring(txns, labels, DEFAULT_CONFIG)

    assert len(rows) == 2
    amounts = sorted(row["amount"] for row in rows)
    assert amounts == [10.0, 100.0]
    assert all(row["kind"] == "investment" for row in rows)
    assert all(row["category"] == "理财/基金" for row in rows)
    assert all(row["confidence"] == "high" for row in rows)
