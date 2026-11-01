from __future__ import annotations

import re
from datetime import date, datetime

from expense_core.models import Txn
from expense_core.parsers.base import BaseStatementParser, ParseInput, ParserRole
from expense_core.parsers.pdf_util import pdf_text_from_bytes

_ROW = re.compile(
    r"^(?P<date>\d{8})\s+RMB\s+(?P<a1>[\d.]+)\s+RMB\s+(?P<balance>[\d.]+)\s+(?P<tail>.+)$",
    re.MULTILINE,
)

_TAIL = re.compile(
    r"^(?P<desc>.+?)(?:\s+(?P<acct>\d{6,})(?:\s+(?P<name>.+))?)?$"
)

_PAYMENT_HINTS = ("支付宝", "财付通", "美团", "网银在线", "网银互联")


def infer_range_from_citic_filename(filename: str) -> tuple[date, date] | None:
    m = re.search(r"(\d{8})-(\d{8})", filename)
    if not m:
        return None
    d0 = datetime.strptime(m.group(1), "%Y%m%d").date()
    d1 = datetime.strptime(m.group(2), "%Y%m%d").date()
    return d0, d1


def _split_tail(tail: str) -> tuple[str, str]:
    tail = tail.strip()
    m = _TAIL.match(tail)
    if not m:
        return tail, ""
    desc = m.group("desc").strip()
    name = (m.group("name") or "").strip()
    acct = (m.group("acct") or "").strip()
    if name:
        return desc, name
    if acct and desc not in ("支付宝", "财付通快捷支付", "网银在线"):
        return desc, acct
    return desc, desc


def parse_citic_text(text: str, d0: date, d1: date) -> list[Txn]:
    out: list[Txn] = []
    prev_balance: float | None = None

    for m in _ROW.finditer(text):
        dt = datetime.strptime(m.group("date"), "%Y%m%d").date()
        if dt < d0 or dt > d1:
            continue

        amt1 = float(m.group("a1"))
        balance = float(m.group("balance"))
        desc, counterparty = _split_tail(m.group("tail"))

        expense: float | None = None
        if prev_balance is not None:
            if balance < prev_balance - 0.001:
                expense = round(prev_balance - balance, 2)
            prev_balance = balance
        else:
            prev_balance = balance
            if any(h in desc for h in _PAYMENT_HINTS):
                expense = round(amt1, 2)

        if expense is None or expense <= 0:
            continue

        out.append(
            Txn(
                dt=dt,
                time="",
                amount=expense,
                platform="中信银行",
                counterparty=counterparty or desc,
                description=desc,
                source="citic",
            )
        )

    return out


class CiticPdfParser(BaseStatementParser):
    id = "citic"
    display_name = "中信银行 PDF"
    role = ParserRole.BANK
    file_patterns = ["中信银行*.pdf"]

    def parse_expenses(self, input: ParseInput, d0: date, d1: date) -> list[Txn]:
        text = pdf_text_from_bytes(input.content)
        return parse_citic_text(text, d0, d1)
