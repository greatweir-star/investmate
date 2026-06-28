from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

from app.core.response import now_iso, success_response
from app.services.analysis_service import analyze_portfolio
from app.services.mock_store import DEMO_USER_ID, save_positions

router = APIRouter()


class PositionPayload(BaseModel):
    asset_code: str
    asset_name: Optional[str] = None
    weight: float = Field(gt=0)
    cost_price: Optional[float] = None
    note: Optional[str] = None


class SavePortfolioRequest(BaseModel):
    user_id: str = DEMO_USER_ID
    positions: list[PositionPayload]


class PortfolioAnalysisRequest(BaseModel):
    user_id: str = DEMO_USER_ID


@router.post("/api/portfolio")
def save_portfolio(payload: SavePortfolioRequest):
    positions = [item.model_dump() for item in payload.positions]
    normalized = save_positions(payload.user_id, positions)
    total_weight = round(sum(item["weight"] for item in normalized), 4)
    return success_response(
        {
            "portfolio_id": f"portfolio_{payload.user_id}",
            "user_id": payload.user_id,
            "position_count": len(normalized),
            "total_weight": total_weight,
            "updated_at": now_iso(),
        }
    )


@router.post("/api/analysis/portfolio")
def analysis_portfolio(payload: PortfolioAnalysisRequest):
    result = analyze_portfolio(payload.user_id)
    if not result:
        raise HTTPException(status_code=400, detail="请先保存至少一条持仓，再生成持仓体检报告。")
    return success_response(result, result.get("data_date"))
