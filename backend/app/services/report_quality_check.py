from __future__ import annotations


REQUIRED_FIELDS = [
    "report_id",
    "report_type",
    "title",
    "summary",
    "health_score",
    "fit_score",
    "data_date",
    "score_items",
    "exposure_items",
    "watch_items",
    "explanation",
    "evidence",
    "prompt_version",
    "model_version",
    "boundary_check_result",
]


def run_quality_check(report: dict) -> dict:
    missing_fields = [field for field in REQUIRED_FIELDS if field not in report or report.get(field) in (None, "")]
    explanation = report.get("explanation", {})
    notes = []

    if not explanation.get("short_summary"):
        missing_fields.append("explanation.short_summary")
    if not explanation.get("detailed_explanation"):
        missing_fields.append("explanation.detailed_explanation")
    if not report.get("evidence", {}).get("score_calculation"):
        notes.append("评分依据为空。")
    if not report.get("watch_items"):
        notes.append("当前未生成关注事项，建议人工确认是否符合预期。")

    score = 5
    if missing_fields:
        score -= min(3, len(missing_fields))
    if notes:
        score -= 1
    score = max(1, score)

    if missing_fields:
        status = "partial"
    elif notes:
        status = "review"
    else:
        status = "passed"

    return {
        "status": status,
        "quality_score": score,
        "missing_fields": missing_fields,
        "notes": notes or ["结构完整性检查通过。"],
    }

