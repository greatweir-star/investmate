from __future__ import annotations

from typing import Optional

from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.core.response import success_response
from app.services.analysis_service import analyze_asset
from app.services.mock_store import DEMO_USER_ID, search_assets

router = APIRouter()


class AssetAnalysisRequest(BaseModel):
    asset_code: str
    question: Optional[str] = None
    user_id: str = DEMO_USER_ID


@router.get("/api/assets/search")
def search(keyword: str = ""):
    return success_response(search_assets(keyword))


@router.post("/api/analysis/asset")
def analysis_asset(payload: AssetAnalysisRequest):
    result = analyze_asset(payload.asset_code, payload.question, payload.user_id)
    if not result:
        raise HTTPException(status_code=404, detail="未找到相关标的，请检查代码或名称。")
    return success_response(result, result.get("data_date"))
