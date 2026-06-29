from __future__ import annotations

from typing import Optional

from app.services.boundary_guard import run_boundary_guard
from app.services.mock_store import DEMO_USER_ID, get_latest_report, save_report
from app.services.report_quality_check import run_quality_check
from app.services.report_service import build_portfolio_health_report
from app.services.user_memory import load_user_memory
from app.services.weekly_review import build_weekly_review_report


def generate_portfolio_health_report(user_id: str, positions: list[dict]) -> dict:
    memory_context = load_user_memory(user_id)
    report = build_portfolio_health_report(positions, memory_context)
    report["user_id"] = user_id
    report["boundary_check_result"] = run_boundary_guard(report)
    report["quality_status"] = run_quality_check(report)
    report["agent_trace"] = [
        {"agent_name": "data_prepare_agent", "output_status": "completed"},
        {"agent_name": "portfolio_analysis_agent", "output_status": "completed"},
        {"agent_name": "report_explanation_agent", "output_status": "completed"},
        {"agent_name": "boundary_check_agent", "output_status": "completed"},
    ]
    save_report(report)
    return report


def generate_weekly_review(user_id: str = DEMO_USER_ID, base_report: Optional[dict] = None):
    memory_context = load_user_memory(user_id)
    current_report = base_report or get_latest_report(user_id=user_id, report_type="portfolio_health")
    if not current_report:
        return None
    previous_report = get_latest_report(
        user_id=user_id,
        report_type="portfolio_health",
        exclude_report_id=current_report["report_id"],
    )
    review_report = build_weekly_review_report(current_report, previous_report, memory_context)
    review_report["boundary_check_result"] = run_boundary_guard(review_report)
    review_report["quality_status"] = run_quality_check(review_report)
    review_report["agent_trace"] = [
        {"agent_name": "review_agent", "output_status": "completed"},
        {"agent_name": "boundary_check_agent", "output_status": "completed"},
    ]
    save_report(review_report)
    return review_report
