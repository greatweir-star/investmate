from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.core.response import success_response
from app.services.agent_orchestrator import generate_portfolio_health_report, generate_weekly_review
from app.services.mock_store import DEMO_USER_ID, get_positions, get_report, save_positions

router = APIRouter()


class PositionPayload(BaseModel):
    asset_code: str
    asset_name: Optional[str] = None
    weight: float
    cost_price: Optional[float] = None
    note: Optional[str] = None


class PortfolioHealthRequest(BaseModel):
    user_id: str = DEMO_USER_ID
    positions: Optional[List[PositionPayload]] = None


class WeeklyReviewRequest(BaseModel):
    user_id: str = DEMO_USER_ID


@router.post("/api/reports/portfolio-health")
def create_portfolio_health_report(payload: PortfolioHealthRequest):
    positions = [item.model_dump() for item in payload.positions] if payload.positions is not None else get_positions(payload.user_id)
    if not positions:
        raise HTTPException(status_code=400, detail="请先录入至少一条持仓，再生成 AI 持仓体检报告。")
    normalized = save_positions(payload.user_id, positions)
    report = generate_portfolio_health_report(payload.user_id, normalized)
    return success_response(report, report["data_date"])


@router.get("/api/reports/{report_id}")
def get_report_detail(report_id: str):
    report = get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="未找到这份报告。")
    return success_response(report, report["data_date"])


@router.post("/api/reports/{report_id}/weekly-review")
def create_weekly_review(report_id: str, payload: WeeklyReviewRequest):
    base_report = get_report(report_id)
    if not base_report:
        raise HTTPException(status_code=404, detail="未找到要复盘的基础报告。")
    review = generate_weekly_review(payload.user_id, base_report=base_report)
    if not review:
        raise HTTPException(status_code=400, detail="当前还没有可用于复盘的体检报告。")
    return success_response(review, review["data_date"])
