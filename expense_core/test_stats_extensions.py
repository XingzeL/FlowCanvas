from __future__ import annotations

from datetime import date

from expense_core.models import Txn
from expense_core.stats import category_trend, daily_spending_map, platform_breakdown


def _txn(dt: date, amount: float, platform: str = "支付宝") -> Txn:
    return Txn(
        dt=dt,
        time="12:00",
        amount=amount,
        platform=platform,
        counterparty="商户",
        description="测试",
        source="alipay",
    )


def test_category_trend_empty():
    assert category_trend([]) == {"keys": [], "series": []}


def test_category_trend_transposes_period_categories():
    payloads = [
        {
            "key": "2026-01",
            "categories": [
                {"name": "餐饮食品", "amount": 100.0, "pct": 50.0, "count": 1},
                {"name": "交通出行", "amount": 100.0, "pct": 50.0, "count": 1},
            ],
        },
        {
            "key": "2026-02",
            "categories": [
                {"name": "餐饮食品", "amount": 200.0, "pct": 100.0, "count": 2},
            ],
        },
    ]
    result = category_trend(payloads)
    assert result["keys"] == ["2026-01", "2026-02"]
    names = [s["name"] for s in result["series"]]
    assert names == ["交通出行", "餐饮食品"]
    food = next(s for s in result["series"] if s["name"] == "餐饮食品")
    traffic = next(s for s in result["series"] if s["name"] == "交通出行")
    assert food["amounts"] == [100.0, 200.0]
    assert traffic["amounts"] == [100.0, 0.0]


def test_category_trend_skips_all_zero_categories():
    payloads = [
        {
            "key": "2026-03",
            "categories": [
                {"name": "游戏动漫", "amount": 50.0, "pct": 100.0, "count": 1},
            ],
        },
    ]
    result = category_trend(payloads)
    assert len(result["series"]) == 1
    assert result["series"][0]["name"] == "游戏动漫"


def test_daily_spending_map_empty():
    assert daily_spending_map([]) == {"days": [], "maxAmount": 0.0}


def test_platform_breakdown_groups_and_pct():
    txns = [
        _txn(date(2026, 1, 1), 100, platform="支付宝"),
        _txn(date(2026, 1, 2), 50, platform="支付宝"),
        _txn(date(2026, 1, 3), 150, platform="微信"),
    ]
    rows = platform_breakdown(txns)
    assert len(rows) == 2
    assert rows[0]["platform"] == "支付宝"
    assert rows[0]["amount"] == 150.0
    assert rows[0]["count"] == 2
    assert rows[0]["pct"] == 50.0
    assert rows[1]["platform"] == "微信"
    assert rows[1]["pct"] == 50.0
    assert sum(r["pct"] for r in rows) == 100.0


def test_platform_breakdown_empty():
    assert platform_breakdown([]) == []


def test_daily_spending_map_aggregates_by_date():
    txns = [
        _txn(date(2026, 1, 5), 100),
        _txn(date(2026, 1, 5), 50),
        _txn(date(2026, 1, 10), 200),
    ]
    result = daily_spending_map(txns)
    assert result["maxAmount"] == 200.0
    assert len(result["days"]) == 2
    assert result["days"][0] == {
        "date": "2026-01-05",
        "amount": 150.0,
        "count": 2,
    }
    assert result["days"][1] == {
        "date": "2026-01-10",
        "amount": 200.0,
        "count": 1,
    }
