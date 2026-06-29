from __future__ import annotations

from typing import Optional

from app.core.response import now_iso
from app.services.mock_store import DEMO_USER_ID, add_feedback, make_id


FEEDBACK_CATEGORY_MAP = {
    "helpful": ("有帮助", "report_explanation", "low"),
    "confusing": ("看不懂", "report_explanation", "high"),
    "inaccurate": ("不准确", "evidence_trace", "high"),
    "more_depth": ("想看更多", "report_depth", "medium"),
    "not_needed": ("不需要", "report_delivery", "medium"),
}


def record_feedback(
    report_id: str,
    feedback_type: str,
    feedback_text: Optional[str] = None,
    user_id: str = DEMO_USER_ID,
) -> dict:
    label, target_module, priority = FEEDBACK_CATEGORY_MAP.get(
        feedback_type,
        ("其他反馈", "product_iteration", "medium"),
    )
    payload = {
        "feedback_id": make_id("fb"),
        "report_id": report_id,
        "user_id": user_id,
        "feedback_type": feedback_type,
        "feedback_label": label,
        "feedback_text": feedback_text or "",
        "target_module": target_module,
        "priority": priority,
        "created_at": now_iso(),
    }
    add_feedback(payload)
    return payload

