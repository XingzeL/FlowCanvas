from __future__ import annotations

from datetime import date

from expense_core.config import DEFAULT_CONFIG
from expense_core.insights.exclusions import build_excluded_detail
from expense_core.models import Txn
from expense_core.pipeline import apply_pure_filter, dedupe_transactions


def _txn(
    dt: date,
    amount: float,
    *,
    platform: str = "支付宝",
    counterparty: str = "商户",
    description: str = "测试",
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


def _cfg(**overrides) -> dict:
    cfg = dict(DEFAULT_CONFIG)
    cfg["pure_spending"] = {
        **DEFAULT_CONFIG["pure_spending"],
        "enabled": True,
        **overrides,
    }
    return cfg


def test_apply_pure_filter_assigns_reasons():
    txns = [
        _txn(date(2026, 1, 1), 100, description="ATM取款"),
        _txn(date(2026, 1, 2), 50, description="转账"),
        _txn(date(2026, 1, 3), 200, counterparty="贝壳租房", description="房租"),
        _txn(date(2026, 1, 4), 80, counterparty="橘宝", description="转账给好友"),
        _txn(date(2026, 1, 5), 30, description="午餐"),
    ]

    kept, excluded, note = apply_pure_filter(txns, _cfg())

    assert len(kept) == 1
    assert kept[0].description == "午餐"
    assert {reason for _, reason in excluded} == {
        "non_spending",
        "wechat_transfer",
        "rent",
        "transfer",
    }
    assert note == "已剔除转账/房租/取现/理财等 4 笔，共 430.00 元"


def test_build_excluded_detail_groups_and_summary():
    records = [
        (_txn(date(2026, 1, 1), 100, description="ATM取款"), "non_spending"),
        (_txn(date(2026, 1, 2), 50, description="转账"), "wechat_transfer"),
        (_txn(date(2026, 1, 3), 200, counterparty="贝壳租房", description="房租"), "rent"),
        (_txn(date(2026, 1, 4), 80, counterparty="橘宝", description="转账给好友"), "transfer"),
    ]

    detail = build_excluded_detail(records)

    assert detail["summary"] == {"count": 4, "amount": 430.0}
    assert [g["reason"] for g in detail["groups"]] == [
        "wechat_transfer",
        "transfer",
        "rent",
        "non_spending",
    ]
    assert detail["groups"][0]["label"] == "微信转账/红包"
    assert detail["groups"][0]["count"] == 1
    assert detail["groups"][0]["amount"] == 50.0
    assert detail["groups"][0]["items"][0]["amount"] == 50.0
    assert detail["groups"][2]["amount"] == 200.0


def test_apply_pure_filter_disabled_returns_empty_excluded():
    txns = [_txn(date(2026, 1, 1), 100, description="转账")]

    kept, excluded, note = apply_pure_filter(txns, _cfg(enabled=False))

    assert kept == txns
    assert excluded == []
    assert note == ""


def test_apply_pure_filter_excludes_investment():
    txns = [
        _txn(
            date(2026, 1, 1),
            1000,
            counterparty="南方基金",
            description="申购确认",
        ),
        _txn(date(2026, 1, 2), 30, description="午餐"),
    ]

    kept, excluded, _note = apply_pure_filter(txns, _cfg())

    assert len(kept) == 1
    assert kept[0].description == "午餐"
    assert excluded == [(txns[0], "investment")]


def test_build_excluded_detail_includes_investment_group():
    records = [
        (
            _txn(
                date(2026, 1, 1),
                1000,
                counterparty="蚂蚁财富",
                description="余额宝转入",
            ),
            "investment",
        ),
    ]

    detail = build_excluded_detail(records)

    assert detail["groups"][0]["reason"] == "investment"
    assert detail["groups"][0]["label"] == "理财/基金"


def test_dedupe_surfaces_bank_investment_in_excluded():
    primary = [_txn(date(2026, 1, 1), 30, description="午餐")]
    bank = [
        Txn(
            dt=date(2026, 1, 2),
            time="12:00",
            amount=5000,
            platform="招商银行",
            counterparty="南方基金",
            description="基金申购",
            source="cmb",
        ),
    ]

    merged, excluded = dedupe_transactions(primary, bank)

    assert len(merged) == 1
    assert excluded == [(bank[0], "investment")]


def test_dedupe_ant_fund_sales_not_silent_mirror_drop():
    bank = [
        Txn(
            dt=date(2026, 7, 30),
            time="",
            amount=10.0,
            platform="招商银行",
            counterparty="蚂蚁（杭州）基金销售有限公司",
            description="快捷支付",
            source="cmb",
        ),
        Txn(
            dt=date(2026, 7, 30),
            time="",
            amount=5.0,
            platform="招商银行",
            counterparty="蚂蚁（杭州）基金销售有限公司",
            description="银联快捷支付",
            source="cmb",
        ),
    ]

    merged, excluded = dedupe_transactions([], bank)

    assert merged == []
    assert excluded == [(bank[0], "investment"), (bank[1], "investment")]


def test_dedupe_licaitong_fund_refund_not_silent_mirror_drop():
    bank = [
        Txn(
            dt=date(2026, 7, 30),
            time="",
            amount=7.0,
            platform="招商银行",
            counterparty="理财通-腾安基金销售（深圳）有限公司",
            description="快捷退款",
            source="cmb",
        ),
    ]

    merged, excluded = dedupe_transactions([], bank)

    assert merged == []
    assert excluded == [(bank[0], "investment")]


def test_dedupe_mirror_bank_kept_when_no_primary():
    bank = [
        Txn(
            dt=date(2026, 7, 30),
            time="",
            amount=25.0,
            platform="招商银行",
            counterparty="支付宝",
            description="快捷支付",
            source="cmb",
        ),
    ]

    merged, excluded = dedupe_transactions([], bank)

    assert merged == bank
    assert excluded == []


def test_dedupe_same_amount_different_merchant_not_silent_drop():
    primary = [
        _txn(
            date(2026, 7, 30),
            10.0,
            counterparty="美团",
            description="外卖",
            platform="支付宝",
        ),
    ]
    bank = [
        Txn(
            dt=date(2026, 7, 30),
            time="",
            amount=10.0,
            platform="招商银行",
            counterparty="顾家生活超市马头庄店",
            description="快捷支付",
            source="cmb",
        ),
    ]

    merged, excluded = dedupe_transactions(primary, bank)

    assert len(merged) == 2
    assert bank[0] in merged
    assert excluded == []


def test_dedupe_mirror_drops_only_when_primary_matches():
    primary = [
        _txn(
            date(2026, 7, 30),
            25.0,
            counterparty="星巴克",
            description="消费",
            platform="支付宝",
        ),
    ]
    bank = [
        Txn(
            dt=date(2026, 7, 30),
            time="",
            amount=25.0,
            platform="招商银行",
            counterparty="支付宝",
            description="快捷支付",
            source="cmb",
        ),
        Txn(
            dt=date(2026, 7, 30),
            time="",
            amount=25.0,
            platform="招商银行",
            counterparty="支付宝",
            description="快捷支付",
            source="cmb",
        ),
    ]

    merged, excluded = dedupe_transactions(primary, bank)

    assert len(merged) == 1
    assert merged[0] == primary[0]
    assert excluded == []


def test_dedupe_merchant_overlap_matches():
    primary = [
        _txn(
            date(2026, 7, 30),
            4.43,
            counterparty="顾家生活超市",
            description="消费",
            platform="支付宝",
        ),
    ]
    bank = [
        Txn(
            dt=date(2026, 7, 30),
            time="",
            amount=4.43,
            platform="招商银行",
            counterparty="顾家生活超市马头庄店",
            description="快捷支付",
            source="cmb",
        ),
    ]

    merged, excluded = dedupe_transactions(primary, bank)

    assert len(merged) == 1
    assert merged[0] == primary[0]
