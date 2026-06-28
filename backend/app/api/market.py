from __future__ import annotations

from typing import Optional

from fastapi import APIRouter

from app.core.response import success_response
from app.services.analysis_service import get_market_status

router = APIRouter()


@router.get("/api/market/status")
def market_status(date: Optional[str] = None):
    data = get_market_status()
    if date:
        data["data_date"] = date
    return success_response(data, data.get("data_date"))
