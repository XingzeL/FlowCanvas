from __future__ import annotations

from datetime import date
from pathlib import Path

from expense_core.models import ParseAggregate, Txn
from expense_core.pipeline import collect_from_aggregate
from expense_core.parsers.registry import ParserRegistry


def txn_dedupe_key(t: Txn) -> str:
    if t.raw_id:
        return f"{t.source}:{t.raw_id}"
    return (
        f"{t.source}:{t.dt.isoformat()}:{t.time}:"
        f"{t.amount:.2f}:{t.counterparty}:{t.description}"
    )


def dedupe_txns(txns: list[Txn]) -> list[Txn]:
    seen: dict[str, Txn] = {}
    for t in txns:
        seen[txn_dedupe_key(t)] = t
    return sorted(seen.values(), key=lambda x: (x.dt, x.time, x.amount))


def merge_aggregates(aggregates: list[ParseAggregate]) -> ParseAggregate:
    primary: list[Txn] = []
    bank: list[Txn] = []
    auxiliary: dict = {}
    sources: dict = {}
    for agg in aggregates:
        primary.extend(agg.primary)
        bank.extend(agg.bank)
        for k, v in agg.auxiliary.items():
            if k == "boc.refunds":
                auxiliary.setdefault(k, [])
                auxiliary[k].extend(v)
            else:
                auxiliary[k] = v
        sources.update(agg.sources)
    return ParseAggregate(
        primary=dedupe_txns(primary),
        bank=dedupe_txns(bank),
        auxiliary=auxiliary,
        sources=sources,
    )


def collect_from_directories(
    registry: ParserRegistry,
    directories: list[Path],
    d0: date,
    d1: date,
    cfg: dict,
    file_overrides: dict[str, Path] | None = None,
) -> tuple[list[Txn], list[tuple[Txn, str]], str, ParseAggregate]:
    aggregates: list[ParseAggregate] = []
    used_overrides: set[str] = set()
    for directory in directories:
        files = registry.discover_optional(directory, cfg)
        paths = {k: v for k, v in files.items() if v is not None}
        if file_overrides:
            for pid, opath in file_overrides.items():
                if opath is None:
                    continue
                if opath.parent == directory or (
                    pid not in used_overrides and directory == directories[0]
                ):
                    paths[pid] = opath
                    used_overrides.add(pid)
        if not paths:
            continue
        aggregates.append(registry.parse_paths(paths, d0, d1))
    if not aggregates:
        raise FileNotFoundError(f"未在任何目录找到流水文件: {directories}")
    merged = merge_aggregates(aggregates)
    kept, excluded_records, note = collect_from_aggregate(merged, cfg)
    return kept, excluded_records, note, merged
