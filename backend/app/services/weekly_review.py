from __future__ import annotations

from typing import Optional

from app.core.response import now_iso, today_text
from app.services.mock_store import REPORT_MODEL_VERSION, REPORT_PROMPT_VERSION, make_id


def build_weekly_review_report(current_report: dict, previous_report: Optional[dict], memory_context: dict) -> dict:
    previous_health = previous_report.get("health_score") if previous_report else None
    current_health = current_report.get("health_score")
    change = None if previous_health is None else current_health - previous_health

    continued_watch_items = []
    previous_titles = {item.get("title") for item in (previous_report or {}).get("watch_items", [])}
    for item in current_report.get("watch_items", []):
        if item.get("title") in previous_titles:
            continued_watch_items.append(item)

    summary_parts = []
    if change is None:
        summary_parts.append("这是第一次周度复盘，系统先记录当前组合状态。")
    elif change > 0:
        summary_parts.append(f"与上次相比，组合健康度提升了 {change} 分。")
    elif change < 0:
        summary_parts.append(f"与上次相比，组合健康度下降了 {abs(change)} 分。")
    else:
        summary_parts.append("与上次相比，组合健康度基本没有变化。")

    if continued_watch_items:
        summary_parts.append("上次出现的关注事项仍在延续，建议优先回看。")
    else:
        summary_parts.append("本次未发现需要继续延续的旧关注事项。")

    data_notes = [
        "当前为 mock 周度复盘，用于验证主动复盘闭环。",
        "后续接入真实数据后，会进一步展示前后变化依据。",
    ]

    return {
        "report_id": make_id("rpt"),
        "user_id": current_report["user_id"],
        "report_type": "weekly_review",
        "title": "AI 周度复盘",
        "summary": " ".join(summary_parts),
        "health_score": current_health,
        "fit_score": current_report["fit_score"],
        "data_date": today_text(),
        "generated_at": now_iso(),
        "created_at": now_iso(),
        "prompt_version": REPORT_PROMPT_VERSION,
        "model_version": REPORT_MODEL_VERSION,
        "risk_level": current_report["risk_level"],
        "confidence": 0.72,
        "position_count": current_report["position_count"],
        "position_input": current_report["position_input"],
        "enriched_positions": current_report["enriched_positions"],
        "score_items": current_report["score_items"],
        "exposure_items": current_report["exposure_items"],
        "watch_items": current_report["watch_items"],
        "duplicate_exposure": current_report.get("duplicate_exposure", []),
        "quality_status": current_report["quality_status"],
        "boundary_check_result": current_report["boundary_check_result"],
        "evidence": {
            **current_report["evidence"],
            "review_compare": {
                "previous_report_id": (previous_report or {}).get("report_id"),
                "current_report_id": current_report["report_id"],
                "previous_health_score": previous_health,
                "current_health_score": current_health,
                "health_score_change": change,
                "continued_watch_titles": [item["title"] for item in continued_watch_items],
            },
        },
        "explanation": {
            "short_summary": " ".join(summary_parts),
            "detailed_explanation": (
                f"{' '.join(summary_parts)} 本次复盘沿用了最近报告的结构化结果，并保留用户继续判断的空间。"
            ),
            "assumptions": ["默认当前录入持仓仍代表最新组合结构。"],
            "data_notes": data_notes,
        },
        "review": {
            "previous_report_id": (previous_report or {}).get("report_id"),
            "changes": [
                {
                    "field": "health_score",
                    "previous_value": previous_health,
                    "current_value": current_health,
                    "direction": "up" if change and change > 0 else "down" if change and change < 0 else "flat",
                    "description": summary_parts[0],
                }
            ],
            "continued_watch_items": continued_watch_items,
            "feedback_context_count": len(memory_context.get("feedback_memory", [])),
            "next_review_hint": "距离上次体检已有一段时间时，可以再次生成周度复盘。",
        },
    }
