from __future__ import annotations

from collections import defaultdict

from app.core.response import now_iso, today_text
from app.services.evidence_trace import (
    build_exposure_evidence,
    build_report_evidence,
    build_score_evidence,
    build_watch_evidence,
)
from app.services.mock_store import REPORT_MODEL_VERSION, REPORT_PROMPT_VERSION, ASSET_BY_CODE, make_id


def build_portfolio_health_report(positions: list[dict], memory_context: dict) -> dict:
    enriched_positions = [_enrich_position(position) for position in positions]
    total_weight = round(sum(item["weight"] for item in enriched_positions), 4)
    position_count = len(enriched_positions)
    max_position = max(enriched_positions, key=lambda item: item["weight"])
    top_three_weight = round(sum(item["weight"] for item in sorted(enriched_positions, key=lambda item: item["weight"], reverse=True)[:3]), 4)
    industry_exposure = _group_exposure(enriched_positions, "industry")
    style_exposure = _group_exposure(enriched_positions, "style")
    asset_type_exposure = _group_exposure(enriched_positions, "asset_type")
    top_industry = max(industry_exposure, key=lambda item: item["weight"]) if industry_exposure else None
    max_weight = max_position["weight"]
    fit_score = _fit_to_user(total_weight, max_weight, top_industry["weight"] if top_industry else 0, memory_context["investment_dna"])
    health_score = _health_score(total_weight, max_weight, top_three_weight, fit_score)
    risk_level = "high" if health_score < 58 else "medium" if health_score < 78 else "low"
    duplicate_exposure = _duplicate_exposure(enriched_positions)
    score_items = _build_score_items(total_weight, max_weight, top_three_weight, fit_score, len(duplicate_exposure))
    exposure_items = _build_exposure_items(industry_exposure, style_exposure, asset_type_exposure)
    watch_items = _build_watch_items(total_weight, max_weight, top_industry, duplicate_exposure, memory_context)
    evidence = build_report_evidence(enriched_positions, score_items, exposure_items, watch_items, memory_context)

    return {
        "report_id": make_id("rpt"),
        "report_type": "portfolio_health",
        "title": "AI 持仓体检报告",
        "summary": _report_summary(health_score, watch_items),
        "health_score": health_score,
        "fit_score": fit_score,
        "risk_level": risk_level,
        "confidence": 0.78,
        "data_date": today_text(),
        "generated_at": now_iso(),
        "created_at": now_iso(),
        "position_count": position_count,
        "position_input": positions,
        "enriched_positions": enriched_positions,
        "score_items": score_items,
        "exposure_items": exposure_items,
        "watch_items": watch_items,
        "duplicate_exposure": duplicate_exposure,
        "prompt_version": REPORT_PROMPT_VERSION,
        "model_version": REPORT_MODEL_VERSION,
        "evidence": evidence,
        "explanation": _build_explanation(score_items, watch_items, memory_context, health_score, fit_score),
    }


def _enrich_position(position: dict) -> dict:
    asset = ASSET_BY_CODE.get(position["asset_code"], {})
    return {
        "asset_code": position["asset_code"],
        "asset_name": position.get("asset_name") or asset.get("asset_name") or "未命名标的",
        "asset_type": asset.get("asset_type", "unknown"),
        "industry": asset.get("industry", "未分类"),
        "style": asset.get("style", "未分类"),
        "weight": float(position.get("weight", 0)),
        "cost_price": position.get("cost_price"),
        "note": position.get("note", ""),
        "data_status": "complete" if asset else "partial",
    }


def _group_exposure(positions: list[dict], field: str) -> list[dict]:
    grouped = defaultdict(float)
    for item in positions:
        grouped[item.get(field) or "未分类"] += item["weight"]
    return [{"name": key, "weight": round(value, 4), "category": field} for key, value in grouped.items()]


def _fit_to_user(total_weight: float, max_weight: float, top_industry_weight: float, dna: dict) -> int:
    score = 80
    if dna.get("risk_level") == "conservative":
        score -= 8
    if dna.get("investment_horizon") == "0-1y":
        score -= 4
    if max_weight > 0.35:
        score -= 12
    elif max_weight > 0.25:
        score -= 6
    if top_industry_weight > 0.45:
        score -= 8
    if total_weight > 1:
        score -= 8
    if total_weight < 0.8:
        score -= 4
    return max(38, min(92, score))


def _health_score(total_weight: float, max_weight: float, top_three_weight: float, fit_score: int) -> int:
    score = 84
    if total_weight > 1:
        score -= 10
    elif total_weight < 0.8:
        score -= 6
    if max_weight > 0.4:
        score -= 14
    elif max_weight > 0.3:
        score -= 8
    if top_three_weight > 0.85:
        score -= 8
    elif top_three_weight > 0.7:
        score -= 4
    score = round((score * 0.65) + (fit_score * 0.35))
    return max(35, min(93, score))


def _build_score_items(total_weight: float, max_weight: float, top_three_weight: float, fit_score: int, duplicate_count: int) -> list[dict]:
    diversification = max(35, min(92, round(88 - (max_weight * 70) - (top_three_weight * 18))))
    concentration = max(30, min(92, round(90 - (max_weight * 120))))
    duplicate_score = max(42, 82 - duplicate_count * 14)

    return [
        {
            "key": "health_score",
            "name": "组合健康度",
            "score": round((diversification + concentration + fit_score + duplicate_score) / 4),
            "explanation": "综合考虑集中度、分散度、用户匹配度和重复暴露后的整体判断。",
            "evidence": build_score_evidence("health_score", "组合健康度", round((diversification + concentration + fit_score + duplicate_score) / 4), "由多个结构化指标综合得出。"),
        },
        {
            "key": "diversification",
            "name": "分散度",
            "score": diversification,
            "explanation": "单一持仓和前三大持仓占比较高时，分散度会下降。",
            "evidence": build_score_evidence("top_three_weight", "分散度", top_three_weight, f"前三大持仓合计约为{round(top_three_weight * 100, 1)}%。"),
        },
        {
            "key": "concentration",
            "name": "集中度",
            "score": concentration,
            "explanation": "最大单一持仓越高，组合越容易受单点波动影响。",
            "evidence": build_score_evidence("max_weight", "集中度", max_weight, f"最大单一持仓约为{round(max_weight * 100, 1)}%。"),
        },
        {
            "key": "fit_score",
            "name": "用户匹配度",
            "score": fit_score,
            "explanation": "结合用户风险偏好、投资期限和当前组合结构得出。",
            "evidence": build_score_evidence("fit_score", "用户匹配度", fit_score, "已结合投资 DNA 进行匹配评估。"),
        },
        {
            "key": "data_completeness",
            "name": "数据完整度",
            "score": 90 if 0.8 <= total_weight <= 1 else 74,
            "explanation": "当前以录入持仓和 mock 补全字段为基础，若权重口径异常会降低完整度。",
            "evidence": build_score_evidence("total_weight", "数据完整度", total_weight, f"当前录入权重合计约为{round(total_weight * 100, 1)}%。"),
        },
    ]


def _build_exposure_items(industry_exposure: list[dict], style_exposure: list[dict], asset_type_exposure: list[dict]) -> list[dict]:
    items = []
    for source in (industry_exposure, style_exposure, asset_type_exposure):
        for item in source:
            items.append(
                {
                    **item,
                    "description": f"{item['name']}在当前组合中的占比约为{round(item['weight'] * 100, 1)}%。",
                    "evidence": build_exposure_evidence(item["category"], item["name"], item["weight"]),
                }
            )
    return items


def _build_watch_items(
    total_weight: float,
    max_weight: float,
    top_industry: dict | None,
    duplicate_exposure: list[dict],
    memory_context: dict,
) -> list[dict]:
    items = []
    if max_weight > 0.3:
        items.append(
            {
                "title": "单一持仓权重偏高",
                "description": "建议回看这笔持仓是否仍符合最初仓位计划和风险预算。",
                "level": "high",
                "evidence": build_watch_evidence("单一持仓权重偏高", "最大单一持仓超过 30%。", "max_weight", max_weight),
            }
        )
    if top_industry and top_industry["weight"] > 0.45:
        items.append(
            {
                "title": "主要方向存在集中",
                "description": f"{top_industry['name']}方向占比较高，后续波动可能更集中地影响组合。",
                "level": "medium",
                "evidence": build_watch_evidence("主要方向存在集中", "单一方向暴露偏高。", "top_industry_weight", top_industry["weight"]),
            }
        )
    if duplicate_exposure:
        items.append(
            {
                "title": "需要确认重复暴露",
                "description": "多个 ETF 或相近主题可能在核心成分上重叠，建议确认是否重复承担了相似风险。",
                "level": "medium",
                "evidence": build_watch_evidence("需要确认重复暴露", "检测到多个可能存在成分重叠的持仓。", "duplicate_exposure", len(duplicate_exposure)),
            }
        )
    if total_weight > 1:
        items.append(
            {
                "title": "持仓权重口径需要复核",
                "description": "当前录入权重超过 100%，建议检查是否混用了仓位和持仓市值口径。",
                "level": "high",
                "evidence": build_watch_evidence("持仓权重口径需要复核", "录入权重超过 100%。", "total_weight", total_weight),
            }
        )

    previous_titles = {item["title"] for item in memory_context.get("watch_item_history", [])}
    for item in items:
        if item["title"] in previous_titles:
            item["description"] += " 该事项已在历史报告中出现过，值得连续回看。"

    if not items:
        items.append(
            {
                "title": "当前未识别到突出结构问题",
                "description": "组合结构相对平衡，但仍建议定期复盘持仓变化和风险偏好。",
                "level": "low",
                "evidence": build_watch_evidence("当前未识别到突出结构问题", "当前规则未识别明显异常。", "watch_items", 0),
            }
        )
    return items


def _duplicate_exposure(positions: list[dict]) -> list[dict]:
    etf_positions = [item for item in positions if item["asset_type"] == "etf"]
    if len(etf_positions) < 2:
        return []
    return [
        {
            "theme": "宽基或成长方向",
            "assets": [item["asset_name"] for item in etf_positions],
            "note": "这些产品可能在核心持仓上存在部分重叠。",
        }
    ]


def _report_summary(health_score: int, watch_items: list[dict]) -> str:
    if health_score >= 78:
        return "当前组合结构基本稳健，可以把重点放在持续复盘和确认后续变化。"
    if any(item["level"] == "high" for item in watch_items):
        return "当前组合已有明确关注点，建议先回看高权重和重复暴露，再决定是否需要调整。"
    return "当前组合结构有一定可用基础，但仍有几处值得继续核对的方向。"


def _build_explanation(score_items: list[dict], watch_items: list[dict], memory_context: dict, health_score: int, fit_score: int) -> dict:
    top_scores = "；".join(f"{item['name']} {item['score']} 分" for item in score_items[:3])
    watch_text = "；".join(item["title"] for item in watch_items[:3])
    explanation_style = memory_context.get("explanation_preference", "structured")
    if explanation_style == "plain":
        detailed = (
            f"这次体检先看组合结构本身，再结合你的投资偏好做匹配。当前健康度是 {health_score} 分，"
            f"用户匹配度是 {fit_score} 分。最值得回看的地方是：{watch_text}。"
            "这份报告更适合作为复盘清单，而不是直接替你做调整决定。"
        )
    else:
        detailed = (
            f"这份 AI 持仓体检先完成规则计算，再组织中文解释。当前关键评分包括：{top_scores}。"
            f"优先关注：{watch_text}。系统会保留依据链路与数据日期，帮助你在下次复盘时回看同一问题是否仍然存在。"
        )
    return {
        "short_summary": f"当前组合健康度 {health_score} 分，建议优先回看 {watch_items[0]['title']}。",
        "detailed_explanation": detailed,
        "assumptions": [
            "当前录入持仓被视为最近一次有效组合结构。",
            "MVP 阶段行业、风格等字段来自 mock 数据补全。",
        ],
        "data_notes": [
            "报告仅基于已录入持仓与 mock 数据字段生成。",
            "系统提供结构化第二意见，不替代用户最终判断。",
        ],
    }

