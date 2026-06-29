from __future__ import annotations

from app.services.mock_store import (
    DEMO_USER_ID,
    get_latest_report,
    get_watch_item_history,
    list_feedback_for_user,
    list_reports,
    settings_state,
)


def load_user_memory(user_id: str = DEMO_USER_ID) -> dict:
    profile = settings_state["investment_dna"]
    reports = list_reports(user_id=user_id, limit=6)
    feedback = list_feedback_for_user(user_id=user_id, limit=10)
    watch_history = get_watch_item_history(user_id=user_id, limit=12)
    return {
        "user_id": user_id,
        "investment_dna": profile,
        "history_reports": reports,
        "feedback_memory": feedback,
        "watch_item_history": watch_history,
        "latest_report": get_latest_report(user_id=user_id),
        "explanation_preference": profile.get("explanation_style", "structured"),
    }

