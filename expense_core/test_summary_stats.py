from __future__ import annotations

from datetime import date

from expense_core.models import Txn
from expense_core.report import build_full_report
from expense_core.stats import category_stats, summary_stats, txn_key
from expense_core.config import DEFAULT_CONFIG


def _txn(dt: date, amount: float, description: str = "测试") -> Txn:
    return Txn(
        dt=dt,
        time="12:00",
        amount=amount,
        platform="支付宝",
        counterparty="商户",
        description=description,
        source="alipay",
    )


def test_summary_stats_three_days():
    txns = [
        _txn(date(2026, 1, 1), 10),
        _txn(date(2026, 1, 2), 20),
        _txn(date(2026, 1, 3), 30),
    ]

    stats = summary_stats(txns)

    assert stats["dailyAvg"] == 20.0
    assert stats["txnAvg"] == 20.0
    assert stats["medianTxn"] == 20.0
    assert stats["p90Txn"] == 28.0


def test_summary_stats_median_and_p90():
    txns = [
        _txn(date(2026, 1, 1), 1),
        _txn(date(2026, 1, 1), 2),
        _txn(date(2026, 1, 2), 100),
    ]

    stats = summary_stats(txns)

    assert stats["medianTxn"] == 2.0
    assert stats["p90Txn"] == 80.4


def test_summary_stats_empty():
    stats = summary_stats([])

    assert stats == {
        "dailyAvg": 0.0,
        "txnAvg": 0.0,
        "medianTxn": 0.0,
        "p90Txn": 0.0,
    }


def test_category_stats_extended_fields():
    txns = [
        _txn(date(2026, 1, 1), 10, "美团"),
        _txn(date(2026, 1, 2), 30, "美团"),
        _txn(date(2026, 1, 3), 100, "地铁"),
    ]
    label_map = {
        txn_key(txns[0]): "餐饮食品",
        txn_key(txns[1]): "餐饮食品",
        txn_key(txns[2]): "交通出行",
    }

    rows = category_stats(txns, label_map=label_map)
    by_name = {r["name"]: r for r in rows}

    food = by_name["餐饮食品"]
    assert food["amount"] == 40.0
    assert food["count"] == 2
    assert food["txnAvg"] == 20.0
    assert food["dailyAvg"] == 20.0
    assert food["countPct"] == round(2 / 3 * 100, 1)
    assert food["maxTxn"] == 30.0
    assert food["txnAvgDeltaPct"] == -57.1

    transport = by_name["交通出行"]
    assert transport["txnAvg"] == 100.0
    assert transport["txnAvgDeltaPct"] == 114.3


def test_full_report_includes_summary_and_extended_categories():
    txns = [
        _txn(date(2026, 1, 1), 10),
        _txn(date(2026, 1, 2), 20),
    ]
    cfg = dict(DEFAULT_CONFIG)

    report = build_full_report(
        txns,
        [],
        "",
        date(2026, 1, 1),
        date(2026, 1, 31),
        "2026.01",
        cfg,
    )

    assert report["meta"]["summary"]["dailyAvg"] == 15.0
    assert report["meta"]["summary"]["txnAvg"] == 15.0
    assert "dailyAvg" in report["categories"][0]
    assert "txnAvgDeltaPct" in report["categories"][0]
