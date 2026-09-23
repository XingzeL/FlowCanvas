from __future__ import annotations

import csv
import re
from datetime import date, datetime

from expense_core.models import Txn
from expense_core.parsers.base import BaseStatementParser, ParseInput, ParserRole


class AlipayCsvParser(BaseStatementParser):
    id = "alipay"
    display_name = "支付宝 CSV"
    role = ParserRole.PRIMARY
    file_patterns = ["支付宝交易明细*.csv"]

    def parse_expenses(self, input: ParseInput, d0: date, d1: date) -> list[Txn]:
        raw = input.content
        for enc in ("utf-8-sig", "gbk", "utf-8"):
            try:
                text = raw.decode(enc)
                break
            except UnicodeDecodeError:
                continue
        else:
            text = raw.decode("utf-8", errors="replace")

        lines = text.splitlines()
        start = next((i for i, l in enumerate(lines) if l.startswith("交易时间")), None)
        if start is None:
            return []

        out: list[Txn] = []
        for row in csv.reader(lines[start + 1 :]):
            if len(row) < 7 or not row[0][:4].isdigit():
                continue
            dt = datetime.strptime(row[0][:19], "%Y-%m-%d %H:%M:%S").date()
            if dt < d0 or dt > d1:
                continue
            if row[5] != "支出":
                continue
            amt = float(row[6])
            if amt <= 0:
                continue
            out.append(
                Txn(
                    dt=dt,
                    time=row[0][11:16] if len(row[0]) >= 16 else "",
                    amount=amt,
                    platform="支付宝",
                    counterparty=row[2],
                    description=row[4],
                    source="alipay",
                    raw_id=row[9] if len(row) > 9 else "",
                )
            )
        return out


def infer_range_from_filename(filename: str) -> tuple[date, date] | None:
    """从流水文件名 (YYYYMMDD-YYYYMMDD) 解析区间，适用于支付宝/微信等。"""
    m = re.search(r"\((\d{8})-(\d{8})\)", filename)
    if not m:
        return None
    d0 = datetime.strptime(m.group(1), "%Y%m%d").date()
    d1 = datetime.strptime(m.group(2), "%Y%m%d").date()
    return d0, d1


def infer_range_from_alipay_filename(filename: str) -> tuple[date, date] | None:
    return infer_range_from_filename(filename)


def infer_range_from_alipay_content(content: bytes) -> tuple[date, date] | None:
    """从支付宝 CSV 内容推断交易日期区间（文件名不可用时）。"""
    for enc in ("utf-8-sig", "gbk", "utf-8"):
        try:
            text = content.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    else:
        text = content.decode("utf-8", errors="replace")
    dates: list[date] = []
    for line in text.splitlines():
        if len(line) >= 10 and line[:4].isdigit() and line[4] == "-":
            try:
                dates.append(datetime.strptime(line[:10], "%Y-%m-%d").date())
            except ValueError:
                continue
    if not dates:
        return None
    return min(dates), max(dates)
