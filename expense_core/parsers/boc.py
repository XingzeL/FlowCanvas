from __future__ import annotations

import re
from datetime import date, datetime

from expense_core.models import Txn
from expense_core.parsers.base import BaseStatementParser, ParseInput, ParserRole
from expense_core.parsers.pdf_util import pdf_text_from_bytes


class BocPdfParser(BaseStatementParser):
    id = "boc"
    display_name = "中国银行 PDF"
    role = ParserRole.BANK
    file_patterns = ["交易流水明细*.pdf"]

    def parse_expenses(self, input: ParseInput, d0: date, d1: date) -> list[Txn]:
        text = pdf_text_from_bytes(input.content)
        out: list[Txn] = []
        pat = re.compile(
            r"(?P<date>\d{4}-\d{2}-\d{2})\s+(?P<time>\d{2}:\d{2}:\d{2})\s+人民币\s+"
            r"(?P<amt>-[\d,]+\.\d{2})\s+[\d,]+\.\d{2}\s+"
            r"(?P<name>[^\s]+)\s+"
            r"(?P<channel>.*?)\s+"
            r"(?P<party>支付宝-|财付通-|网银在线-|美团支付|PAYPAL_|.*?)"
            r"(?=\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+人民币|\Z)",
            re.DOTALL,
        )
        for m in pat.finditer(text):
            dt = datetime.strptime(m.group("date"), "%Y-%m-%d").date()
            if dt < d0 or dt > d1:
                continue
            amt_val = float(m.group("amt").replace(",", ""))
            if amt_val >= 0:
                continue
            amt = abs(amt_val)
            party = re.sub(r"\s+", " ", m.group("party")).strip()
            party = party.split("Z200")[0].split("48429202")[0].strip()
            out.append(
                Txn(
                    dt=dt,
                    time=m.group("time")[:5],
                    amount=amt,
                    platform="中国银行",
                    counterparty=party,
                    description=m.group("name").strip(),
                    source="boc",
                )
            )
        return out

    def parse_auxiliary(self, input: ParseInput, d0: date, d1: date) -> dict:
        text = pdf_text_from_bytes(input.content)
        refunds: list[tuple[date, float]] = []
        pat = re.compile(
            r"(?P<date>\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}:\d{2}\s+人民币\s+"
            r"(?P<amt>[\d,]+\.\d{2})\s+[\d,]+\.\d{2}\s+"
            r"(?P<name>[^\n]*退款[^\n]*)"
        )
        for m in pat.finditer(text):
            dt = datetime.strptime(m.group("date"), "%Y-%m-%d").date()
            if dt < d0 or dt > d1:
                continue
            refunds.append((dt, round(float(m.group("amt").replace(",", "")), 2)))
        return {"boc.refunds": refunds}
