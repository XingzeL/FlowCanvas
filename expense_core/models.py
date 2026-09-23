from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Any, Literal

Granularity = Literal["day", "3day", "week", "month"]


@dataclass
class Txn:
    dt: date
    time: str
    amount: float
    platform: str
    counterparty: str
    description: str
    source: str
    raw_id: str = ""

    @property
    def day_key(self) -> str:
        return self.dt.isoformat()

    def text_blob(self) -> str:
        return f"{self.counterparty} {self.description}"


@dataclass
class Report:
    period_label: str
    date_start: date
    date_end: date
    transactions: list[Txn]
    excluded: list[Txn] = field(default_factory=list)
    excluded_note: str = ""

    @property
    def month_label(self) -> str:
        return self.period_label

    @property
    def total(self) -> float:
        return sum(t.amount for t in self.transactions)

    @property
    def count(self) -> int:
        return len(self.transactions)


@dataclass
class PeriodSlice:
    start: date
    end: date
    label: str
    key: str


@dataclass
class SourceStatus:
    parsed: int = 0
    skipped: bool = False
    error: str | None = None


@dataclass
class ParseAggregate:
    primary: list[Txn] = field(default_factory=list)
    bank: list[Txn] = field(default_factory=list)
    auxiliary: dict[str, Any] = field(default_factory=dict)
    sources: dict[str, SourceStatus] = field(default_factory=dict)
