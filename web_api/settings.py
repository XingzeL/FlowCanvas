from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from expense_core.config import default_config_path


@lru_cache
def get_settings() -> "Settings":
    return Settings()


class Settings:
    def __init__(self) -> None:
        project_root = Path(__file__).resolve().parent.parent
        default_roots = str(project_root)
        roots_raw = os.getenv("EXPENSE_ALLOWED_ROOTS", default_roots)
        self.allowed_roots: list[Path] = [
            Path(p.strip()).expanduser().resolve()
            for p in roots_raw.split(",")
            if p.strip()
        ]
        self.api_key: str = os.getenv("EXPENSE_API_KEY", "")
        config_raw = os.getenv("EXPENSE_DEFAULT_CONFIG", "")
        self.default_config_path: Path = (
            Path(config_raw).expanduser().resolve()
            if config_raw
            else default_config_path().resolve()
        )
        self.project_root = project_root
