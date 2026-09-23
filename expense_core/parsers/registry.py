from __future__ import annotations

from pathlib import Path
from typing import Any

from expense_core.models import ParseAggregate, SourceStatus, Txn
from expense_core.parsers.base import ParseInput, StatementParser
from expense_core.parsers.alipay import AlipayCsvParser, infer_range_from_alipay_filename


class ParserRegistry:
    def __init__(self) -> None:
        self._parsers: dict[str, StatementParser] = {}

    def register(self, parser: StatementParser) -> None:
        self._parsers[parser.id] = parser

    def get(self, id: str) -> StatementParser:
        return self._parsers[id]

    def all(self) -> list[StatementParser]:
        return list(self._parsers.values())

    def discover(self, directory: Path, cfg: dict) -> dict[str, Path]:
        patterns = cfg.get("file_patterns", {})
        found: dict[str, Path] = {}
        for parser in self._parsers.values():
            pat = patterns.get(parser.id) or (
                parser.file_patterns[0] if parser.file_patterns else f"{parser.id}*"
            )
            matches = sorted(directory.glob(pat))
            if matches:
                matches.sort(key=lambda p: p.stat().st_mtime, reverse=True)
                found[parser.id] = matches[0]
        return found

    def discover_optional(self, directory: Path, cfg: dict) -> dict[str, Path | None]:
        patterns = cfg.get("file_patterns", {})
        found: dict[str, Path | None] = {}
        for parser in self._parsers.values():
            pat = patterns.get(parser.id) or (
                parser.file_patterns[0] if parser.file_patterns else f"{parser.id}*"
            )
            matches = sorted(directory.glob(pat))
            if matches:
                matches.sort(key=lambda p: p.stat().st_mtime, reverse=True)
                found[parser.id] = matches[0]
            else:
                found[parser.id] = None
        return found

    def parse_paths(
        self,
        files: dict[str, Path],
        d0,
        d1,
    ) -> ParseAggregate:
        uploads: dict[str, ParseInput] = {}
        for pid, path in files.items():
            if path is None:
                continue
            uploads[pid] = ParseInput(
                filename=path.name,
                content=path.read_bytes(),
                mime=None,
            )
        return self.parse_uploads(uploads, d0, d1)

    def parse_uploads(
        self,
        uploads: dict[str, ParseInput],
        d0,
        d1,
    ) -> ParseAggregate:
        agg = ParseAggregate()
        for parser in self._parsers.values():
            inp = uploads.get(parser.id)
            if inp is None:
                agg.sources[parser.id] = SourceStatus(skipped=True)
                continue
            try:
                expenses = parser.parse_expenses(inp, d0, d1)
                if parser.role.value == "primary":
                    agg.primary.extend(expenses)
                elif parser.role.value == "bank":
                    agg.bank.extend(expenses)
                aux = parser.parse_auxiliary(inp, d0, d1)
                for k, v in aux.items():
                    if k == "boc.refunds":
                        existing = agg.auxiliary.get("boc.refunds", [])
                        agg.auxiliary["boc.refunds"] = existing + v
                    else:
                        agg.auxiliary[k] = v
                agg.sources[parser.id] = SourceStatus(parsed=len(expenses))
            except Exception as e:
                agg.sources[parser.id] = SourceStatus(error=str(e))
        return agg

    def infer_date_range(
        self,
        uploads: dict[str, ParseInput],
        parsed_txns: list[Txn] | None = None,
    ) -> tuple[Any, Any] | None:
        alipay = uploads.get("alipay")
        if alipay:
            r = infer_range_from_alipay_filename(alipay.filename)
            if r:
                return r
        if parsed_txns:
            dates = [t.dt for t in parsed_txns]
            return min(dates), max(dates)
        return None

    def parser_info(self) -> list[dict]:
        return [
            {
                "id": p.id,
                "displayName": p.display_name,
                "role": p.role.value,
                "filePatterns": p.file_patterns,
            }
            for p in self._parsers.values()
        ]


def default_registry() -> ParserRegistry:
    from expense_core.parsers.alipay import AlipayCsvParser
    from expense_core.parsers.boc import BocPdfParser
    from expense_core.parsers.cmb import CmbPdfParser
    from expense_core.parsers.wechat import WechatXlsxParser

    r = ParserRegistry()
    r.register(AlipayCsvParser())
    r.register(WechatXlsxParser())
    r.register(CmbPdfParser())
    r.register(BocPdfParser())
    return r
