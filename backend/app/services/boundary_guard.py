from __future__ import annotations


ABSOLUTE_PHRASES = ["一定会", "必然", "必须马上", "稳赚", "确定会", "毫无风险"]


def run_boundary_guard(report: dict) -> dict:
    notes = []
    explanation = report.get("explanation", {})
    text = " ".join(
        [
            report.get("summary", ""),
            explanation.get("short_summary", ""),
            explanation.get("detailed_explanation", ""),
        ]
    )

    hit_phrases = [phrase for phrase in ABSOLUTE_PHRASES if phrase in text]
    if hit_phrases:
        notes.append("检测到过度确定性表达，已标记为需要人工复查。")
    if not report.get("data_date"):
        notes.append("缺少数据日期。")
    if not report.get("evidence"):
        notes.append("缺少可追溯依据。")
    if not explanation.get("data_notes"):
        notes.append("建议补充数据限制说明。")

    return {
        "status": "warning" if notes else "passed",
        "notes": notes or ["未发现明显越界表达。"],
        "blocked_phrases": hit_phrases,
        "review_required": bool(hit_phrases),
    }

