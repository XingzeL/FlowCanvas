from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from web_api.schemas import AnalyzeRequest, ExportRequest, HealthResponse
from web_api.security import verify_api_key
from web_api.services.analyze import execute_analyze, execute_discover, execute_export
from web_api.settings import get_settings

router = APIRouter(
    prefix="/api/bot/v1",
    tags=["bot"],
    dependencies=[Depends(verify_api_key)],
)


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok",
        version="1.0.0",
        allowed_roots_count=len(settings.allowed_roots),
        api_key_required=bool(settings.api_key),
    )


@router.get("/files/discover")
def discover_files(
    dir: str = Query(..., description="流水目录绝对路径"),
    config_path: str | None = Query(None),
) -> dict:
    return execute_discover(dir, config_path)


@router.post("/analyze")
def analyze_path(req: AnalyzeRequest) -> dict:
    _, payload = execute_analyze(req)
    return payload


@router.post("/export")
def export_report(req: ExportRequest) -> dict:
    return execute_export(req)
