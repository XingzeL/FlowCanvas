from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from enum import Enum
from typing import Any, Protocol

from expense_core.models import Txn


class ParserRole(str, Enum):
    PRIMARY = "primary"
    BANK = "bank"
    AUXILIARY = "auxiliary"


@dataclass
class ParseInput:
    filename: str
    content: bytes
    mime: str | None = None

    @classmethod
    def from_path(cls, path) -> "ParseInput":
        from pathlib import Path
        p = Path(path)
        return cls(filename=p.name, content=p.read_bytes())


class StatementParser(Protocol):
    id: str
    display_name: str
    role: ParserRole
    file_patterns: list[str]

    def can_parse(self, input: ParseInput) -> bool: ...
    def parse_expenses(self, input: ParseInput, d0: date, d1: date) -> list[Txn]: ...
    def parse_auxiliary(self, input: ParseInput, d0: date, d1: date) -> dict[str, Any]: ...


class BaseStatementParser:
    id: str = ""
    display_name: str = ""
    role: ParserRole = ParserRole.PRIMARY
    file_patterns: list[str] = []

    def can_parse(self, input: ParseInput) -> bool:
        fn = input.filename.lower()
        for pat in self.file_patterns:
            ext = pat.split("*")[-1].lower()
            if ext and fn.endswith(ext.replace(".", "")):
                return True
        return False

    def parse_auxiliary(self, input: ParseInput, d0: date, d1: date) -> dict[str, Any]:
        return {}
