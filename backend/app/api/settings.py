from __future__ import annotations

from typing import Optional

from pydantic import BaseModel
from fastapi import APIRouter

from app.core.config import get_settings
from app.core.response import now_iso, success_response, today_text
from app.services.mock_store import settings_state

router = APIRouter()


class InvestmentDNA(BaseModel):
    risk_level: str
    investment_horizon: str
    max_drawdown_tolerance: float
    asset_preferences: list[str]
    trading_frequency: Optional[str] = None
    experience_level: str
    explanation_style: Optional[str] = "structured"


class SettingsRequest(BaseModel):
    investment_dna: InvestmentDNA


@router.get("/api/settings")
def get_app_settings():
    config = get_settings()
    return success_response(
        {
            "data_source": {
                "tushare_configured": bool(config.tushare_token),
                "latest_data_date": today_text(),
                "sync_status": "mock_ready",
            },
            "ai_service": {
                "provider": "openai_compatible",
                "model_name": config.openai_model,
                "api_key_configured": bool(config.openai_api_key),
            },
            "investment_dna": settings_state["investment_dna"],
        }
    )


@router.post("/api/settings")
def save_app_settings(payload: SettingsRequest):
    settings_state["investment_dna"] = payload.investment_dna.model_dump()
    return success_response({"saved": True, "updated_at": now_iso()})
