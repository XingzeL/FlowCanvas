from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parent.parent


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv("EXPENSE_API_KEY", "")
    monkeypatch.delenv("EXPENSE_ALLOWED_ROOTS", raising=False)
    from web_api.settings import get_settings

    get_settings.cache_clear()
    from web_api.main import app

    return TestClient(app)


@pytest.fixture
def client_with_key(monkeypatch):
    monkeypatch.setenv("EXPENSE_API_KEY", "test-secret-key")
    monkeypatch.delenv("EXPENSE_ALLOWED_ROOTS", raising=False)
    from web_api.settings import get_settings

    get_settings.cache_clear()
    from web_api.main import app

    return TestClient(app)


def test_legacy_parsers(client):
    r = client.get("/api/parsers")
    assert r.status_code == 200
    assert len(r.json()) == 4


def test_legacy_config(client):
    r = client.get("/api/config/default")
    assert r.status_code == 200
    assert "category_rules" in r.json()


def test_bot_health(client):
    r = client.get("/api/bot/v1/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["api_key_required"] is False


def test_api_key_required(client_with_key):
    r = client_with_key.get("/api/bot/v1/health")
    assert r.status_code == 403

    r = client_with_key.get(
        "/api/bot/v1/health",
        headers={"X-API-Key": "test-secret-key"},
    )
    assert r.status_code == 200


def test_path_sandbox(client):
    r = client.get(
        "/api/bot/v1/files/discover",
        params={"dir": "/etc"},
    )
    assert r.status_code == 403


def test_discover(client):
    r = client.get(
        "/api/bot/v1/files/discover",
        params={"dir": str(PROJECT_ROOT)},
    )
    assert r.status_code == 200
    data = r.json()
    assert "alipay" in data


def test_analyze_path(client):
    r = client.post(
        "/api/bot/v1/analyze",
        json={
            "dirs": [str(PROJECT_ROOT)],
            "mode": "range",
            "date_start": "2025-08-01",
            "date_end": "2026-07-31",
            "granularity": "month",
        },
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert "report" in body
    assert "inputs" in body
    assert body["report"]["meta"]["txnCount"] > 0


def test_export_inline(client):
    r = client.post(
        "/api/bot/v1/export",
        json={
            "dirs": [str(PROJECT_ROOT)],
            "mode": "range",
            "date_start": "2026-08-01",
            "date_end": "2026-08-31",
            "formats": ["json", "markdown"],
            "inline": True,
        },
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert "json" in body["artifacts"]["inline"]
    assert body["artifacts"]["inline"]["markdown"].startswith("#")


def test_export_write(client):
    with tempfile.TemporaryDirectory(dir=PROJECT_ROOT) as tmp:
        out_dir = Path(tmp)
        r = client.post(
            "/api/bot/v1/export",
            json={
                "dirs": [str(PROJECT_ROOT)],
                "mode": "range",
                "date_start": "2026-08-01",
                "date_end": "2026-08-31",
                "formats": ["json"],
                "inline": False,
                "output_dir": str(out_dir),
            },
        )
        assert r.status_code == 200, r.text
        written = r.json()["artifacts"]["written"]
        assert "json" in written
        assert Path(written["json"]).exists()


def test_legacy_analyze_upload(client):
    files = {}
    mapping = {
        "alipay": "支付宝交易明细(20250801-20260731).csv",
        "wechat": "微信支付账单流水文件(20250801-20260801)_20260803170104.xlsx",
        "cmb": "招商银行交易流水(申请时间2026年08月03日17时08分37秒).pdf",
        "boc": "交易流水明细20260803170331.pdf",
    }
    for key, name in mapping.items():
        path = PROJECT_ROOT / name
        if path.exists():
            files[key] = (name, path.open("rb"), "application/octet-stream")

    if len(files) < 4:
        pytest.skip("流水文件不全")

    r = client.post(
        "/api/analyze",
        data={
            "granularity": "month",
            "pure_spending": "true",
            "large_threshold": "500",
        },
        files=files,
    )
    for f in files.values():
        f[1].close()
    assert r.status_code == 200
    assert r.json()["meta"]["txnCount"] > 0
