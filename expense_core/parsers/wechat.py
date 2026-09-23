from __future__ import annotations

import zipfile
import xml.etree.ElementTree as ET
from datetime import date, datetime, timedelta

from expense_core.models import Txn
from expense_core.parsers.base import BaseStatementParser, ParseInput, ParserRole


def _xlsx_rows_from_bytes(content: bytes) -> list[list[str]]:
    z = zipfile.ZipFile(__import__("io").BytesIO(content))
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    ss: list[str] = []
    root = ET.fromstring(z.read("xl/sharedStrings.xml"))
    for si in root.findall("m:si", ns):
        ss.append("".join(t.text or "" for t in si.iter(f"{{{ns['m']}}}t")))

    sheet = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
    rows: list[list[str]] = []
    for row in sheet.iter(f"{{{ns['m']}}}row"):
        cells: list[str] = []
        for c in row.findall("m:c", ns):
            t = c.get("t")
            v = c.find("m:v", ns)
            if v is None:
                is_el = c.find("m:is", ns)
                if is_el is not None:
                    txt = "".join(
                        x.text or "" for x in is_el.iter(f"{{{ns['m']}}}t")
                    )
                    cells.append(txt)
                else:
                    cells.append("")
            elif t == "s":
                cells.append(ss[int(v.text)])
            else:
                cells.append(v.text or "")
        rows.append(cells)
    return rows


class WechatXlsxParser(BaseStatementParser):
    id = "wechat"
    display_name = "微信 XLSX"
    role = ParserRole.PRIMARY
    file_patterns = ["微信支付账单流水文件*.xlsx"]

    def parse_expenses(self, input: ParseInput, d0: date, d1: date) -> list[Txn]:
        rows = _xlsx_rows_from_bytes(input.content)
        header_idx = next(
            (i for i, r in enumerate(rows) if r and "交易时间" in r[0]), None
        )
        if header_idx is None:
            return []

        excel_base = datetime(1899, 12, 30)
        out: list[Txn] = []
        for r in rows[header_idx + 1 :]:
            if len(r) < 7:
                continue
            first = r[0].strip()
            if not first or first.startswith("---") or "共" in first:
                continue
            try:
                serial = float(first)
            except ValueError:
                continue
            dt = (excel_base + timedelta(days=serial)).date()
            if dt < d0 or dt > d1:
                continue
            if r[4].strip() != "支出":
                continue
            amt = float(r[5])
            if amt <= 0:
                continue
            out.append(
                Txn(
                    dt=dt,
                    time="",
                    amount=amt,
                    platform="微信",
                    counterparty=r[2],
                    description=r[3],
                    source="wechat",
                    raw_id=r[8] if len(r) > 8 else "",
                )
            )
        return out
