from __future__ import annotations

from pathlib import Path


def project_root() -> Path:
    return Path(__file__).resolve().parent.parent


def load_project_env() -> None:
    """加载项目根目录 `.env`（若存在）。已存在的环境变量不会被覆盖。"""
    env_path = project_root() / ".env"
    if not env_path.is_file():
        return
    try:
        from dotenv import load_dotenv
    except ImportError:
        return
    load_dotenv(dotenv_path=env_path, override=False, interpolate=True)
