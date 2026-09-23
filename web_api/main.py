from __future__ import annotations

from expense_core.env import load_project_env

load_project_env()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from web_api.routes import bot_v1, legacy

app = FastAPI(title="FlowCanvas API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(legacy.router)
app.include_router(bot_v1.router)
