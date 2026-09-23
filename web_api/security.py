from __future__ import annotations

import secrets
from pathlib import Path

from fastapi import Header, HTTPException

from web_api.settings import get_settings


def _is_under_root(path: Path, root: Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return path == root


def is_path_allowed(path: Path, roots: list[Path]) -> bool:
    resolved = path.resolve()
    return any(_is_under_root(resolved, root.resolve()) for root in roots)


def resolve_allowed_path(raw: str, roots: list[Path] | None = None) -> Path:
    settings = get_settings()
    allowed = roots or settings.allowed_roots
    p = Path(raw).expanduser().resolve()
    if not is_path_allowed(p, allowed):
        raise HTTPException(403, "路径不在允许范围内")
    return p


def resolve_allowed_dir(raw: str, roots: list[Path] | None = None) -> Path:
    p = resolve_allowed_path(raw, roots)
    if not p.is_dir():
        raise HTTPException(404, f"目录不存在: {raw}")
    return p


def resolve_allowed_file(raw: str, roots: list[Path] | None = None) -> Path:
    p = resolve_allowed_path(raw, roots)
    if not p.is_file():
        raise HTTPException(404, f"文件不存在: {raw}")
    return p


def resolve_allowed_output_dir(raw: str, roots: list[Path] | None = None) -> Path:
    p = resolve_allowed_path(raw, roots)
    p.mkdir(parents=True, exist_ok=True)
    return p


async def verify_api_key(x_api_key: str | None = Header(None, alias="X-API-Key")) -> None:
    settings = get_settings()
    if not settings.api_key:
        return
    if not x_api_key:
        raise HTTPException(403, "缺少 X-API-Key")
    if not secrets.compare_digest(x_api_key, settings.api_key):
        raise HTTPException(403, "无效的 API Key")
