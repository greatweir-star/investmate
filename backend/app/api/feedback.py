from __future__ import annotations

from typing import Optional

from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.core.response import success_response
from app.services.feedback_learning import record_feedback
from app.services.mock_store import DEMO_USER_ID, get_report, list_feedback_for_report

router = APIRouter()


class FeedbackRequest(BaseModel):
    report_id: str
    feedback_type: str
    feedback_text: Optional[str] = None
    user_id: str = DEMO_USER_ID


@router.post("/api/feedback")
def create_feedback(payload: FeedbackRequest):
    report = get_report(payload.report_id)
    if not report:
        raise HTTPException(status_code=404, detail="未找到要反馈的报告。")
    feedback = record_feedback(
        report_id=payload.report_id,
        feedback_type=payload.feedback_type,
        feedback_text=payload.feedback_text,
        user_id=payload.user_id,
    )
    return success_response(
        {
            "feedback": feedback,
            "report_feedback_count": len(list_feedback_for_report(payload.report_id)),
        },
        report["data_date"],
    )

