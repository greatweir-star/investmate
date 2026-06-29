from __future__ import annotations


def build_score_evidence(key: str, name: str, source_value, description: str) -> list[dict]:
    return [
        {
            "source_type": "rule_calculation",
            "source_field": key,
            "source_value": source_value,
            "description": description,
            "name": name,
        }
    ]


def build_exposure_evidence(category: str, name: str, weight: float) -> list[dict]:
    return [
        {
            "source_type": "position_aggregation",
            "source_field": category,
            "source_value": weight,
            "description": f"{name}在当前组合中的合计权重约为{round(weight * 100, 1)}%。",
        }
    ]


def build_watch_evidence(title: str, detail: str, source_field: str, source_value) -> list[dict]:
    return [
        {
            "source_type": "watch_rule",
            "source_field": source_field,
            "source_value": source_value,
            "description": f"{title}：{detail}",
        }
    ]


def build_report_evidence(
    enriched_positions: list[dict],
    score_items: list[dict],
    exposure_items: list[dict],
    watch_items: list[dict],
    memory_context: dict,
) -> dict:
    return {
        "enriched_positions": enriched_positions,
        "score_calculation": [
            {
                "key": item["key"],
                "score": item["score"],
                "evidence": item.get("evidence", []),
            }
            for item in score_items
        ],
        "exposure_calculation": [
            {
                "category": item["category"],
                "name": item["name"],
                "weight": item["weight"],
                "evidence": item.get("evidence", []),
            }
            for item in exposure_items
        ],
        "watch_item_evidence": [
            {
                "title": item["title"],
                "level": item["level"],
                "evidence": item.get("evidence", []),
            }
            for item in watch_items
        ],
        "memory_context": {
            "latest_report_id": (memory_context.get("latest_report") or {}).get("report_id"),
            "history_report_count": len(memory_context.get("history_reports", [])),
            "feedback_count": len(memory_context.get("feedback_memory", [])),
        },
    }

