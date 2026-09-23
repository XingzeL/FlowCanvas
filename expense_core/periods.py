from __future__ import annotations

from datetime import date, timedelta

from expense_core.models import Granularity, PeriodSlice, Txn


def iter_month_ranges(d0: date, d1: date) -> list[PeriodSlice]:
    out: list[PeriodSlice] = []
    y, m = d0.year, d0.month
    while True:
        start = date(y, m, 1)
        if m == 12:
            end = date(y, 12, 31)
            ny, nm = y + 1, 1
        else:
            end = date(y, m + 1, 1) - timedelta(days=1)
            ny, nm = y, m + 1
        slice_start = max(start, d0)
        slice_end = min(end, d1)
        if slice_start <= slice_end:
            key = f"{y}-{m:02d}"
            out.append(PeriodSlice(
                start=slice_start,
                end=slice_end,
                label=f"{y} 年 {m} 月",
                key=key,
            ))
        if date(ny, nm, 1) > d1:
            break
        y, m = ny, nm
    return out


def iter_week_ranges(d0: date, d1: date, week_start: int = 0) -> list[PeriodSlice]:
    """week_start: 0=周一, 6=周日"""
    out: list[PeriodSlice] = []
    cur = d0
    while cur <= d1:
        offset = (cur.weekday() - week_start) % 7
        week_start_date = cur - timedelta(days=offset)
        week_end_date = week_start_date + timedelta(days=6)
        slice_start = max(week_start_date, d0)
        slice_end = min(week_end_date, d1)
        if slice_start <= slice_end:
            key = slice_start.isoformat()
            label = f"{slice_start.strftime('%Y-%m-%d')} 周"
            out.append(PeriodSlice(start=slice_start, end=slice_end, label=label, key=key))
        cur = week_end_date + timedelta(days=1)
    return out


def iter_3day_ranges(d0: date, d1: date) -> list[PeriodSlice]:
    out: list[PeriodSlice] = []
    cur = d0
    while cur <= d1:
        slice_end = min(cur + timedelta(days=2), d1)
        key = cur.isoformat()
        label = f"{cur.strftime('%m-%d')} ~ {slice_end.strftime('%m-%d')}"
        out.append(PeriodSlice(start=cur, end=slice_end, label=label, key=key))
        cur = slice_end + timedelta(days=1)
    return out


def iter_day_ranges(d0: date, d1: date, txns: list[Txn] | None = None) -> list[PeriodSlice]:
    if txns is not None:
        days_with_txn = sorted({t.dt for t in txns if d0 <= t.dt <= d1})
        return [
            PeriodSlice(
                start=d,
                end=d,
                label=d.strftime("%Y-%m-%d"),
                key=d.isoformat(),
            )
            for d in days_with_txn
        ]
    out: list[PeriodSlice] = []
    cur = d0
    while cur <= d1:
        out.append(PeriodSlice(
            start=cur,
            end=cur,
            label=cur.strftime("%Y-%m-%d"),
            key=cur.isoformat(),
        ))
        cur += timedelta(days=1)
    return out


def iter_period_ranges(
    d0: date,
    d1: date,
    granularity: Granularity,
    week_start: int = 0,
    txns: list[Txn] | None = None,
) -> list[PeriodSlice]:
    if granularity == "month":
        return iter_month_ranges(d0, d1)
    if granularity == "week":
        return iter_week_ranges(d0, d1, week_start)
    if granularity == "3day":
        return iter_3day_ranges(d0, d1)
    if granularity == "day":
        return iter_day_ranges(d0, d1, txns)
    raise ValueError(f"Unknown granularity: {granularity}")


def infer_range_from_txns(txns: list[Txn]) -> tuple[date, date] | None:
    if not txns:
        return None
    dates = [t.dt for t in txns]
    return min(dates), max(dates)
