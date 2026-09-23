from __future__ import annotations

from datetime import date

from expense_core.config import DEFAULT_CONFIG
from expense_core.models import Txn
from expense_core.report import build_full_report


def _txn(
    dt: date,
    amount: float,
    platform: str = "支付宝",
    description: str = "测试",
) -> Txn:
    return Txn(
        dt=dt,
        time="12:00",
        amount=amount,
        platform=platform,
        counterparty="商户",
        description=description,
        source="alipay",
    )


def test_period_totals_dual_series():
    kept = [
        _txn(date(2026, 1, 5), 100),
        _txn(date(2026, 2, 10), 200),
    ]
    excluded = [
        _txn(date(2026, 1, 6), 50, description="转账"),
        _txn(date(2026, 2, 11), 80, description="转账"),
    ]
    note = "已剔除转账/房租/取现/理财等 2 笔，共 130.00 元"
    cfg = dict(DEFAULT_CONFIG)
    cfg["pure_spending"] = {"enabled": True}

    report = build_full_report(
        kept,
        excluded,
        note,
        date(2026, 1, 1),
        date(2026, 2, 28),
        "2026.01–02",
        cfg,
        granularity="month",
    )

    assert len(report["periodTotals"]) == 2
    jan = report["periodTotals"][0]
    assert jan["totalPure"] == 100
    assert jan["totalAll"] == 150
    assert jan["countPure"] == 1
    assert jan["countAll"] == 2
    assert jan["purePct"] == round(100 / 150 * 100, 1)
    assert jan["total"] == jan["totalPure"]
    assert jan["count"] == jan["countPure"]


def test_day_granularity_includes_excluded_only_day():
    kept = [_txn(date(2026, 3, 1), 30)]
    excluded = [_txn(date(2026, 3, 2), 500, description="转账")]
    note = "已剔除转账/房租/取现/理财等 1 笔，共 500.00 元"
    cfg = dict(DEFAULT_CONFIG)
    cfg["pure_spending"] = {"enabled": True}

    report = build_full_report(
        kept,
        excluded,
        note,
        date(2026, 3, 1),
        date(2026, 3, 2),
        "2026.03",
        cfg,
        granularity="day",
    )

    keys = [p["key"] for p in report["periodTotals"]]
    assert "2026-03-01" in keys
    assert "2026-03-02" in keys

    excl_day = next(p for p in report["periodTotals"] if p["key"] == "2026-03-02")
    assert excl_day["totalPure"] == 0
    assert excl_day["totalAll"] == 500
    assert excl_day["countPure"] == 0
    assert excl_day["countAll"] == 1


def test_meta_trends():
    kept = [
        _txn(date(2026, 1, 5), 100),
        _txn(date(2026, 2, 10), 300),
    ]
    excluded: list[Txn] = []
    note = "已剔除转账/房租/取现/理财等 0 笔，共 0.00 元"
    cfg = dict(DEFAULT_CONFIG)
    cfg["pure_spending"] = {"enabled": True}

    report = build_full_report(
        kept,
        excluded,
        note,
        date(2026, 1, 1),
        date(2026, 2, 28),
        "2026.01–02",
        cfg,
        granularity="month",
    )

    trends = report["meta"]["trends"]
    assert trends["label"] == "2026-01"
    assert trends["totalPct"] == 200.0
    assert trends["countPct"] == 0.0
    assert report["meta"]["pureSpending"] is True


def test_trends_null_when_single_period():
    kept = [_txn(date(2026, 1, 5), 100)]
    report = build_full_report(
        kept,
        [],
        "",
        date(2026, 1, 1),
        date(2026, 1, 31),
        "2026.01",
        dict(DEFAULT_CONFIG),
        granularity="month",
    )
    assert report["meta"]["trends"]["totalPct"] is None
    assert report["meta"]["trends"]["countPct"] is None


def test_periods_have_gross_and_pure_pct():
    kept = [_txn(date(2026, 1, 5), 100)]
    excluded = [_txn(date(2026, 1, 6), 50, description="转账")]
    note = "已剔除转账/房租/取现/理财等 1 笔，共 50.00 元"
    cfg = dict(DEFAULT_CONFIG)
    cfg["pure_spending"] = {"enabled": True}

    report = build_full_report(
        kept,
        excluded,
        note,
        date(2026, 1, 1),
        date(2026, 1, 31),
        "2026.01",
        cfg,
        granularity="month",
    )

    period = report["periods"][0]
    assert period["grossTotal"] == 150
    assert period["purePct"] == round(100 / 150 * 100, 1)


def test_category_details_in_full_report():
    kept = [
        _txn(date(2026, 1, 5), 100, description="美团外卖"),
        _txn(date(2026, 1, 8), 50, description="地铁出行"),
    ]
    cfg = dict(DEFAULT_CONFIG)
    cfg["category_rules"] = {
        **{k: [] for k in cfg.get("category_rules", {})},
        "餐饮食品": ["美团"],
        "交通出行": ["地铁"],
    }

    report = build_full_report(
        kept,
        [],
        "",
        date(2026, 1, 1),
        date(2026, 1, 31),
        "2026.01",
        cfg,
        granularity="month",
    )

    assert "categoryDetails" in report
    names = {d["name"] for d in report["categoryDetails"]}
    assert "餐饮食品" in names
    assert "交通出行" in names
    food = next(d for d in report["categoryDetails"] if d["name"] == "餐饮食品")
    assert len(food["rows"]) >= 1
