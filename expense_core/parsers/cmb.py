from __future__ import annotations

import re
from datetime import date, datetime

from expense_core.models import Txn
from expense_core.parsers.base import BaseStatementParser, ParseInput, ParserRole
from expense_core.parsers.pdf_util import pdf_text_from_bytes


class CmbPdfParser(BaseStatementParser):
    id = "cmb"
    display_name = "招商银行 PDF"
    role = ParserRole.BANK
    file_patterns = ["招商银行交易流水*.pdf"]

    def parse_expenses(self, input: ParseInput, d0: date, d1: date) -> list[Txn]:
        text = pdf_text_from_bytes(input.content)
        out: list[Txn] = []
        flat = re.sub(r"\n(?!\d{4}-\d{2}-\d{2})", " ", text)
        pat = re.compile(
            r"(?P<date>\d{4}-\d{2}-\d{2})\s+CNY\s+(?P<amt>-[\d,]+\.\d{2})\s+"
            r"[\d,]+\.\d{2}\s+(?P<summary>.*?)\s+(?P<party>.*?)(?=\d{4}-\d{2}-\d{2}\s+CNY|$)"
        )
        for m in pat.finditer(flat):
            dt = datetime.strptime(m.group("date"), "%Y-%m-%d").date()
            if dt < d0 or dt > d1:
                continue
            amt = abs(float(m.group("amt").replace(",", "")))
            if amt <= 0:
                continue
            summary = m.group("summary").strip()
            party = re.sub(r"\s+", " ", m.group("party")).strip()
            out.append(
                Txn(
                    dt=dt,
                    time="",
                    amount=amt,
                    platform="招商银行",
                    counterparty=party,
                    description=summary,
                    source="cmb",
                )
            )
        return out
