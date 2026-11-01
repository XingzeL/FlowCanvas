from __future__ import annotations

from datetime import date
from pathlib import Path

import pytest

from expense_core.config import default_config_path, load_config
from expense_core.parsers.base import ParseInput
from expense_core.parsers.citic import (
    CiticPdfParser,
    infer_range_from_citic_filename,
    parse_citic_text,
)
from expense_core.parsers.registry import default_registry

SAMPLE = """
20260802 RMB 911.44 RMB 3097.63 08月02日约定提取 7111010196000000141 北京住房公积金管理中心
20260802 RMB 281.40 RMB 2816.23 财付通快捷支付 281530613 美团平台商户
20260803 RMB 2568.66 RMB 0.00 网银互联跨行转出 6217853100025578592 李星泽
20260831 RMB 18785.87 RMB 18785.87 代发工资 7115510182600019504 北京握奇智能科技有限公司
20261009 RMB 251.88 RMB 3213.79 支付宝 20880316964136650156 上海动魂文化传媒有限公司
"""


def test_infer_range_from_citic_filename():
    r = infer_range_from_citic_filename("中信银行_账户明细_20260802-20261031.pdf")
    assert r == (date(2026, 8, 2), date(2026, 10, 31))


def test_parse_citic_text_expenses_only():
    txns = parse_citic_text(SAMPLE, date(2026, 8, 1), date(2026, 10, 31))
    assert len(txns) == 3
    assert txns[0].amount == 281.40
    assert txns[0].platform == "中信银行"
    assert txns[0].source == "citic"
    assert txns[0].counterparty == "美团平台商户"
    assert txns[1].description == "网银互联跨行转出"
    assert txns[2].counterparty == "上海动魂文化传媒有限公司"


def test_citic_pdf_discovered_like_other_banks():
    """与招行/中行相同：在用户指定的流水目录内按 file_patterns 发现文件。"""
    root = Path(__file__).resolve().parents[1]
    cfg = load_config(default_config_path())
    reg = default_registry()
    pdf = reg.discover_optional(root, cfg).get("citic")
    if pdf is None:
        pytest.skip(
            "当前项目根目录无匹配中信 PDF（expense_config.json → file_patterns.citic）"
        )

    parser = CiticPdfParser()
    txns = parser.parse_expenses(
        ParseInput(filename=pdf.name, content=pdf.read_bytes()),
        date(2026, 8, 2),
        date(2026, 10, 31),
    )
    assert len(txns) >= 40
    assert all(t.source == "citic" for t in txns)
    assert sum(t.amount for t in txns) > 1000
