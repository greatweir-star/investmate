from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException

from app.core.response import success_response
from app.services.mock_store import DEMO_USER_ID, get_history_detail, list_history

router = APIRouter()


@router.get("/api/analysis/history")
def analysis_history(user_id: str = DEMO_USER_ID, limit: int = 20, analysis_type: Optional[str] = None):
    rows = list_history(user_id=user_id, limit=limit, analysis_type=analysis_type)
    data = [
        {
            "analysis_id": row["analysis_id"],
            "analysis_type": row["analysis_type"],
            "target_name": row["target_name"],
            "summary": row["summary"],
            "risk_level": row["risk_level"],
            "confidence": row["confidence"],
            "data_date": row["data_date"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]
    return success_response(data)


@router.get("/api/analysis/{analysis_id}")
def analysis_detail(analysis_id: str):
    record = get_history_detail(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="未找到这条历史记录。")
    return success_response(
        {
            "analysis_id": record["analysis_id"],
            "analysis_type": record["analysis_type"],
            "target_name": record["target_name"],
            "input_payload": record["input_payload"],
            "structured_result": record["structured_result"],
            "natural_language": record["natural_language"],
            "data_date": record["data_date"],
            "prompt_version": record["prompt_version"],
            "model_version": record["model_version"],
            "created_at": record["created_at"],
        },
        record["data_date"],
    )
