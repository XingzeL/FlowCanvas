from __future__ import annotations

from datetime import date, timedelta

from expense_core.classifiers.factory import create_classifier
from expense_core.config import default_config_path
from expense_core.models import Granularity, PeriodSlice, Report, Txn
from expense_core.periods import iter_period_ranges
from expense_core.insights.exclusions import build_excluded_detail
from expense_core.insights.recurring import detect_recurring
from expense_core.stats import (
    amount_bucket_label,
    bucket_category_breakdown,
    build_buckets,
    category_stats,
    category_trend,
    classify_transactions,
    daily_spending_map,
    daily_totals,
    fmt_item_row,
    merged_bucket_label,
    platform_breakdown,
    txn_key,
)


def make_report(
    kept: list[Txn],
    excluded: list[Txn],
    note: str,
    d0: date,
    d1: date,
    label: str,
) -> Report:
    kept_s = [t for t in kept if d0 <= t.dt <= d1]
    excl_s = [t for t in excluded if d0 <= t.dt <= d1]
    slice_note = ""
    if note and excl_s:
        excl_amt = sum(t.amount for t in excl_s)
        slice_note = f"已剔除转账/房租/取现/理财等 {len(excl_s)} 笔，共 {excl_amt:,.2f} 元"
    elif note and not excl_s:
        slice_note = "本月无剔除项（转账/房租等）"
    return Report(
        period_label=label,
        date_start=d0,
        date_end=d1,
        transactions=sorted(kept_s, key=lambda t: (t.dt, t.time)),
        excluded=excl_s,
        excluded_note=slice_note if note else "",
    )


def build_period_payload(
    report: Report,
    cfg: dict,
    classifier=None,
    *,
    label_map: dict[tuple, str] | None = None,
) -> dict:
    from expense_core.classifiers.base import Classifier

    if label_map is not None:
        cats = category_stats(report.transactions, label_map=label_map)
    else:
        clf: Classifier = classifier or create_classifier(cfg)
        cats = category_stats(report.transactions, clf)
    total = report.total
    n = report.count
    daily = daily_totals(report.transactions, report.date_start, report.date_end)
    buckets = build_buckets(report.transactions, amount_bucket_label)
    buckets_merged = build_buckets(report.transactions, merged_bucket_label)

    max_txn = max((t.amount for t in report.transactions), default=0)
    top2_pct = 0.0
    if len(cats) >= 2:
        top2_pct = cats[0]["pct"] + cats[1]["pct"]

    details = []
    for c in cats:
        rows = [list(fmt_item_row(t)) for t in c["items"]]
        details.append({
            "name": c["name"],
            "meta": f"共 {c['count']} 笔 · {c['amount']:,.2f} 元",
            "rows": rows,
        })

    peak_days = sorted(
        ((report.date_start + timedelta(days=i), daily[i]) for i in range(len(daily))),
        key=lambda x: -x[1],
    )[:3]
    peak_note = " · ".join(
        f"{d.strftime('%m-%d')} {amt:,.2f}" for d, amt in peak_days if amt > 0
    ) or "—"

    subtitle = report.excluded_note or "全量日常开销（含转账/房租）"
    days_count = (report.date_end - report.date_start).days + 1
    daily_avg = total / days_count if days_count else 0
    title_suffix = "纯花销占比" if report.excluded_note else "日常开销占比"

    return {
        "key": f"{report.date_start.year}-{report.date_start.month:02d}",
        "title": f"{report.period_label} {title_suffix}",
        "subtitle": subtitle,
        "txnCount": n,
        "total": round(total, 2),
        "dailyAvg": round(daily_avg, 2),
        "maxTxn": round(max_txn, 2),
        "top2Pct": round(top2_pct, 1),
        "peakNote": peak_note,
        "dateRange": f"{report.date_start} ~ {report.date_end}",
        "categories": [
            {
                "name": c["name"],
                "amount": c["amount"],
                "pct": c["pct"],
                "count": c["count"],
            }
            for c in cats
        ],
        "daily": daily,
        "amountBuckets": buckets,
        "amountBucketsMerged": buckets_merged,
        "details": details,
    }


def _slice_amounts(
    kept: list[Txn],
    excluded: list[Txn],
    d0: date,
    d1: date,
) -> tuple[float, int, float, int, float, int, float | None]:
    kept_s = [t for t in kept if d0 <= t.dt <= d1]
    excl_s = [t for t in excluded if d0 <= t.dt <= d1]
    pure_total = sum(t.amount for t in kept_s)
    pure_count = len(kept_s)
    excl_total = sum(t.amount for t in excl_s)
    excl_count = len(excl_s)
    gross_total = pure_total + excl_total
    count_all = pure_count + excl_count
    pure_pct = round(pure_total / gross_total * 100, 1) if gross_total > 0 else None
    return pure_total, pure_count, excl_total, excl_count, gross_total, count_all, pure_pct


def _period_chart_label(s: PeriodSlice, granularity: Granularity) -> str:
    if granularity == "month":
        return f"{s.start.month}月"
    if granularity == "week":
        return f"{s.start.strftime('%m-%d')}周"
    if granularity == "day":
        return s.start.strftime("%m-%d")
    return s.label


def _calc_trends(period_payloads: list[dict]) -> dict:
    if len(period_payloads) < 2:
        return {"totalPct": None, "countPct": None, "label": None}
    prev = period_payloads[-2]
    last = period_payloads[-1]
    total_pct = None
    count_pct = None
    if prev["total"] > 0:
        total_pct = round((last["total"] - prev["total"]) / prev["total"] * 100, 1)
    if prev["txnCount"] > 0:
        count_pct = round(
            (last["txnCount"] - prev["txnCount"]) / prev["txnCount"] * 100, 1
        )
    return {"totalPct": total_pct, "countPct": count_pct, "label": prev["key"]}


def build_full_report(
    kept: list[Txn],
    excluded: list[Txn],
    note: str,
    d0: date,
    d1: date,
    label: str,
    cfg: dict,
    granularity: Granularity = "month",
    large_threshold: float = 500,
    week_start: int = 0,
    sources: dict | None = None,
    classifier=None,
    config_path=None,
    excluded_with_reason: list[tuple[Txn, str]] | None = None,
) -> dict:
    import os

    from expense_core.classifiers.base import Classifier

    cfg_path = config_path or default_config_path()
    clf: Classifier = classifier or create_classifier(cfg, cfg_path)

    pure_spending = bool(note) or bool(
        cfg.get("pure_spending", {}).get("enabled", False)
    )

    year_report = make_report(kept, excluded, note, d0, d1, label)
    if note:
        excl_amt = sum(t.amount for t in excluded)
        year_report.excluded_note = (
            f"已剔除转账/房租/取现/理财等 {len(excluded)} 笔，共 {excl_amt:,.2f} 元"
        )

    label_map = classify_transactions(year_report.transactions, clf)

    if excluded_with_reason is not None:
        excluded_in_range_for_labels = [
            (t, reason) for t, reason in excluded_with_reason if d0 <= t.dt <= d1
        ]
    elif pure_spending and excluded:
        excluded_in_range_for_labels = [
            (t, "transfer") for t in excluded if d0 <= t.dt <= d1
        ]
    else:
        excluded_in_range_for_labels = []

    investment_txns = [
        t for t, reason in excluded_in_range_for_labels if reason == "investment"
    ]
    if investment_txns:
        label_map = {**label_map, **classify_transactions(investment_txns, clf)}

    year_payload = build_period_payload(year_report, cfg, label_map=label_map)

    day_txns = kept + excluded if granularity == "day" else kept
    slices = iter_period_ranges(d0, d1, granularity, week_start, day_txns)
    period_payloads: list[dict] = []
    for s in slices:
        _, _, _, excl_count, gross_total, count_all, pure_pct = _slice_amounts(
            kept, excluded, s.start, s.end
        )
        r = make_report(kept, excluded, note, s.start, s.end, s.label)
        if r.count == 0 and excl_count == 0:
            continue
        p = build_period_payload(r, cfg, label_map=label_map)
        p["key"] = s.key
        p["chartLabel"] = _period_chart_label(s, granularity)
        p["grossTotal"] = round(gross_total, 2)
        p["countAll"] = count_all
        p["purePct"] = pure_pct
        period_payloads.append(p)

    period_totals = [
        {
            "key": p["key"],
            "label": p.get("chartLabel", p["key"]),
            "total": p["total"],
            "count": p["txnCount"],
            "totalPure": p["total"],
            "countPure": p["txnCount"],
            "totalAll": p["grossTotal"],
            "countAll": p["countAll"],
            "purePct": p["purePct"],
        }
        for p in period_payloads
    ]
    period_count = len(period_payloads)
    max_period = max(period_payloads, key=lambda p: p["total"]) if period_payloads else None
    top_cats = year_payload["categories"][:2]
    top2_label = "+".join(c["name"] for c in top_cats)
    top2_pct = sum(c["pct"] for c in top_cats)

    large_txns = sorted(
        (t for t in year_report.transactions if t.amount >= large_threshold),
        key=lambda t: (-t.amount, t.dt),
    )
    large_labels = [label_map[txn_key(t)] for t in large_txns]
    large_rows = [
        {
            "date": t.dt.isoformat(),
            "amount": round(t.amount, 2),
            "category": large_labels[i],
            "platform": t.platform,
            "label": fmt_item_row(t)[0],
        }
        for i, t in enumerate(large_txns)
    ]
    large_total = round(sum(t.amount for t in large_txns), 2)

    bucket_cats_fine = bucket_category_breakdown(
        year_report.transactions, amount_bucket_label, label_map=label_map
    )
    bucket_cats_merged = bucket_category_breakdown(
        year_report.transactions, merged_bucket_label, label_map=label_map
    )

    title_suffix = "纯花销汇总" if year_report.excluded_note else "日常开销汇总"
    period_avg = round(year_payload["total"] / period_count, 2) if period_count else 0

    trends = _calc_trends(period_payloads)

    clf_cfg = cfg.get("classifier") or {}
    classifier_mode = os.environ.get("EXPENSE_CLASSIFIER_MODE") or clf_cfg.get(
        "mode", "keyword"
    )

    excluded_in_range = excluded_in_range_for_labels

    meta = {
        "dateStart": d0.isoformat(),
        "dateEnd": d1.isoformat(),
        "title": f"{year_report.period_label} {title_suffix}",
        "subtitle": year_report.excluded_note
        or "全量日常开销（含转账/房租）· 按自然月展开",
        "dateRange": f"{year_report.date_start} ~ {year_report.date_end}",
        "txnCount": year_payload["txnCount"],
        "total": year_payload["total"],
        "periodAvg": period_avg,
        "maxPeriodTotal": max_period["total"] if max_period else 0,
        "maxPeriodLabel": max_period["key"] if max_period else "",
        "top2Pct": round(top2_pct, 1),
        "top2Label": top2_label,
        "periodCount": period_count,
        "largeTxnCount": len(large_rows),
        "largeTxnTotal": large_total,
        "largeThreshold": large_threshold,
        "granularity": granularity,
        "pureSpending": pure_spending,
        "trends": trends,
        "sources": sources or {},
        "classifier": {
            "mode": classifier_mode,
            "learned_added": getattr(clf, "learned_added", 0),
        },
    }

    return {
        "meta": meta,
        "periodTotals": period_totals,
        "categories": year_payload["categories"],
        "categoryDetails": year_payload["details"],
        "amountBuckets": year_payload["amountBuckets"],
        "amountBucketsMerged": year_payload["amountBucketsMerged"],
        "bucketCategories": bucket_cats_fine,
        "bucketCategoriesMerged": bucket_cats_merged,
        "largeTxns": large_rows,
        "periods": period_payloads,
        "platformShare": platform_breakdown(year_report.transactions),
        "excludedDetail": (
            build_excluded_detail(excluded_in_range)
            if pure_spending and excluded_in_range
            else None
        ),
        "categoryTrend": category_trend(period_payloads),
        "spendingCalendar": daily_spending_map(year_report.transactions),
        "recurring": detect_recurring(
            year_report.transactions + investment_txns, label_map, cfg
        ),
    }
