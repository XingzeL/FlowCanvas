from __future__ import annotations

from collections import defaultdict

from expense_core.models import Txn

MIRROR_KEYWORDS = (
    "支付宝", "财付通", "微信", "余额宝", "理财通", "网商银行", "余利宝",
    "网上支付", "银联入账", "提现",
)

INVEST_KEYWORDS = (
    "基金", "定投", "余额宝", "理财通", "雪球", "余利宝", "蚂蚁财富", "南方基金",
    "腾安基金", "基金销售", "投资理财", "网商银行", "小金库", "肯特瑞",
)

DEBT_KEYWORDS = (
    "贷款还款", "信用卡还款", "花呗", "月付还款", "还款", "信用借还",
    "华鑫信托", "金条华鑫信托",
)

TRANSFER_KEYWORDS = ("微信转账", "转账", "汇入汇款", "网联收款", "跨行转账")

NON_SPENDING_BUILTIN = (
    "ATM取款", "本行ATM", "ATM", "现金取款", "取现",
    "养老金", "公积金缴存", "公积金",
    "住房租赁", "信富住房", "贝壳租房",
    "小金库", "肯特瑞",
    "结构性存款", "大额存单",
)


def is_mirror_channel(party: str, desc: str) -> bool:
    blob = f"{party} {desc}"
    if "肯特瑞" in blob or "小金库" in blob:
        return True
    if "网银在线" in blob:
        return False
    return any(k in blob for k in MIRROR_KEYWORDS)


def is_investment(party: str, desc: str) -> bool:
    blob = f"{party} {desc}"
    return any(k in blob for k in INVEST_KEYWORDS)


def is_debt(party: str, desc: str) -> bool:
    blob = f"{party} {desc}"
    return any(k in blob for k in DEBT_KEYWORDS)


def is_self_transfer(party: str, desc: str) -> bool:
    blob = f"{party} {desc}"
    if "李星泽" in blob and ("快捷支付" in blob or "转账" in blob or "转入" in blob):
        return True
    return False


def is_non_spending(party: str, desc: str, cfg: dict | None = None) -> bool:
    blob = f"{party} {desc}"
    if any(k in blob for k in NON_SPENDING_BUILTIN):
        return True
    pure = (cfg or {}).get("pure_spending", {})
    extra = pure.get("exclude_non_spending_keywords", [])
    return any(k in blob for k in extra)


def keyword_overlap(a: str, b: str) -> int:
    keys = (
        "京东", "美团", "携程", "国网", "醉面", "魔盒", "小绿人", "贝壳",
        "米哈游", "哔哩", "顺家", "顺佳", "库洛", "Stripe", "App Store",
    )
    return sum(1 for k in keys if k in a and k in b)


def _merchant_text_match(bt: Txn, pt: Txn) -> bool:
    """Require shared merchant text; date+amount alone is not enough."""
    from expense_core.stats import clean_counterparty

    bc = clean_counterparty(bt.counterparty)
    pc = clean_counterparty(pt.counterparty)
    if len(bc) >= 2 and len(pc) >= 2 and (bc in pc or pc in bc):
        return True
    blob_b = bt.text_blob()
    blob_p = pt.text_blob()
    if len(pc) >= 2 and pc in blob_b:
        return True
    if len(bc) >= 2 and bc in blob_p:
        return True
    return False


def _bank_matches_primary(bt: Txn, pt: Txn) -> bool:
    if pt.dt != bt.dt or abs(pt.amount - bt.amount) > 0.011:
        return False
    blob_b = bt.text_blob()
    blob_p = pt.text_blob()
    if keyword_overlap(blob_b, blob_p) > 0:
        return True
    if "网银在线" in blob_b and "网银在线" not in blob_p:
        return False
    if is_mirror_channel(bt.counterparty, bt.description):
        return True
    return _merchant_text_match(bt, pt)


def dedupe_transactions(
    primary: list[Txn], bank: list[Txn]
) -> tuple[list[Txn], list[tuple[Txn, str]]]:
    result = list(primary)
    excluded_from_dedupe: list[tuple[Txn, str]] = []
    used_bank: set[int] = set()

    for i, bt in enumerate(bank):
        if is_investment(bt.counterparty, bt.description):
            excluded_from_dedupe.append((bt, "investment"))
            used_bank.add(i)
            continue
        if is_debt(bt.counterparty, bt.description):
            excluded_from_dedupe.append((bt, "debt"))
            used_bank.add(i)
            continue
        if is_non_spending(bt.counterparty, bt.description):
            excluded_from_dedupe.append((bt, "non_spending"))
            used_bank.add(i)
            continue
        if is_self_transfer(bt.counterparty, bt.description):
            excluded_from_dedupe.append((bt, "transfer"))
            used_bank.add(i)
            continue

    for i, bt in enumerate(bank):
        if i in used_bank:
            continue
        matched = False
        for pt in primary:
            if _bank_matches_primary(bt, pt):
                matched = True
                break
        if matched:
            used_bank.add(i)
        else:
            result.append(bt)

    return result, excluded_from_dedupe


def cancel_refunded(txns: list[Txn], refunds: list[tuple]) -> list[Txn]:
    if not refunds:
        return txns
    pending = defaultdict(int)
    for dt, amt in refunds:
        pending[(dt, amt)] += 1
    kept: list[Txn] = []
    for t in txns:
        key = (t.dt, round(t.amount, 2))
        if pending[key] > 0:
            pending[key] -= 1
            continue
        kept.append(t)
    return kept


def apply_pure_filter(
    txns: list[Txn], cfg: dict
) -> tuple[list[Txn], list[tuple[Txn, str]], str]:
    pure = cfg.get("pure_spending", {})
    if not pure.get("enabled", True):
        return txns, [], ""

    kw_transfer = pure.get("exclude_transfer_keywords", [])
    kw_merchant = pure.get("exclude_merchant_keywords", [])
    excl_wechat_tf = pure.get("exclude_wechat_transfer", True)

    kept: list[Txn] = []
    excluded: list[tuple[Txn, str]] = []
    for t in txns:
        blob = t.text_blob()
        if excl_wechat_tf and (
            "转账备注:" in blob
            or t.description.strip() in ("微信红包", "转账")
            or "发出群红包" in blob
            or blob.startswith("发给")
            or "极速退款" in blob
            or "买家主动还款" in blob
        ):
            excluded.append((t, "wechat_transfer"))
            continue
        if any(k in blob for k in kw_merchant):
            excluded.append((t, "rent"))
            continue
        if any(k in blob for k in kw_transfer):
            excluded.append((t, "transfer"))
            continue
        if is_investment(t.counterparty, t.description):
            excluded.append((t, "investment"))
            continue
        if is_debt(t.counterparty, t.description):
            excluded.append((t, "debt"))
            continue
        if is_non_spending(t.counterparty, t.description, cfg):
            excluded.append((t, "non_spending"))
            continue
        kept.append(t)

    excl_amt = sum(t.amount for t, _ in excluded)
    note = f"已剔除转账/房租/取现/理财等 {len(excluded)} 笔，共 {excl_amt:,.2f} 元"
    return kept, excluded, note


def collect_from_aggregate(
    aggregate, cfg: dict
) -> tuple[list[Txn], list[tuple[Txn, str]], str]:
    from expense_core.models import ParseAggregate

    agg: ParseAggregate = aggregate
    merged, dedupe_excluded = dedupe_transactions(agg.primary, agg.bank)
    refunds = agg.auxiliary.get("boc.refunds", [])
    merged = cancel_refunded(merged, refunds)
    kept, pure_excluded, note = apply_pure_filter(merged, cfg)
    pure = cfg.get("pure_spending", {})
    if not pure.get("enabled", True):
        return kept, dedupe_excluded, note
    excluded = dedupe_excluded + pure_excluded
    if excluded:
        excl_amt = sum(t.amount for t, _ in excluded)
        note = (
            f"已剔除转账/房租/取现/理财等 {len(excluded)} 笔，共 {excl_amt:,.2f} 元"
        )
    return kept, excluded, note
