from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

AnalysisMode = Literal["month", "range", "all"]
CanvasMode = Literal["month", "year"]
ExportFormat = Literal["json", "markdown", "canvas", "catalog"]
Granularity = Literal["day", "3day", "week", "month"]


class AnalyzeRequest(BaseModel):
    dirs: list[str] = Field(..., min_length=1)
    extra_dirs: list[str] = Field(default_factory=list)
    files: dict[str, str] = Field(default_factory=dict)
    mode: AnalysisMode = "range"
    month: str | None = None
    date_start: str | None = None
    date_end: str | None = None
    granularity: Granularity = "month"
    pure_spending: bool = True
    large_threshold: float = 500
    config_path: str | None = None


class ExportRequest(AnalyzeRequest):
    formats: list[ExportFormat] = Field(default_factory=lambda: ["json"])
    canvas_mode: CanvasMode = "year"
    inline: bool = True
    output_dir: str | None = None
    output_names: dict[str, str] = Field(default_factory=dict)


class HealthResponse(BaseModel):
    status: str
    version: str
    allowed_roots_count: int
    api_key_required: bool
