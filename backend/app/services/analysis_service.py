from __future__ import annotations

from collections import defaultdict
from typing import Optional

from app.core.response import today_text
from app.services.ai_service import explain_asset, explain_portfolio
from app.services.mock_store import (
    ASSET_BY_CODE,
    DEMO_USER_ID,
    get_asset,
    get_positions,
    make_id,
    save_report,
    settings_state,
)


def get_market_status():
    return {
        "analysis_type": "market_status",
        "market_state": "震荡",
        "market_score": 62,
        "risk_level": "medium",
        "confidence": 0.7,
        "summary": "当前市场环境偏震荡，适合先做结构化研究，避免被短期波动牵着走。",
        "key_factors": [
            "主要指数处于区间波动",
            "宽基资产流动性较好",
            "成长方向分化较明显",
        ],
        "risk_factors": [
            "部分主题波动仍然偏高",
            "成交没有显示一致性放量",
        ],
        "explanation": "从中低频视角看，当前环境更适合保持观察、控制仓位集中度，并优先复盘已有持仓。",
        "data_date": today_text(),
    }


def analyze_asset(asset_code: str, question: Optional[str], user_id: str = DEMO_USER_ID):
    asset = get_asset(asset_code)
    if not asset:
        return None

    scores = _asset_scores(asset["asset_code"])
    risk_score = scores["risk"]
    risk_level = "high" if risk_score >= 70 else "medium" if risk_score >= 40 else "low"
    result = {
        "analysis_id": make_id("ana_asset"),
        "analysis_type": "asset_review",
        "asset_code": asset["asset_code"],
        "asset_name": asset["asset_name"],
        "asset_type": asset["asset_type"],
        "scores": scores,
        "risk_level": risk_level,
        "confidence": 0.74,
        "summary": f"{asset['asset_name']}可以作为后续研究对象，但需要结合组合占比和风险偏好评估。",
        "key_factors": _asset_key_factors(asset),
        "risk_factors": _asset_risk_factors(asset),
        "data_date": today_text(),
    }
    result["explanation"] = explain_asset(result)
    save_report(
        {
            "report_id": result["analysis_id"],
            "user_id": user_id,
            "report_type": "asset_review",
            "title": asset["asset_name"],
            "summary": result["summary"],
            "health_score": scores.get("fit_to_user", 60),
            "fit_score": scores.get("fit_to_user", 60),
            "risk_level": risk_level,
            "confidence": result["confidence"],
            "data_date": result["data_date"],
            "generated_at": today_text(),
            "created_at": today_text(),
            "position_count": 1,
            "position_input": [{"asset_code": asset["asset_code"]}],
            "enriched_positions": [],
            "score_items": [],
            "exposure_items": [],
            "watch_items": [],
            "duplicate_exposure": [],
            "explanation": {
                "short_summary": result["summary"],
                "detailed_explanation": result["explanation"],
                "assumptions": [],
                "data_notes": ["标的分析暂未接入完整报告对象，仅用于兼容历史记录。"],
            },
            "evidence": {"score_calculation": [], "exposure_calculation": [], "watch_item_evidence": []},
            "prompt_version": "asset_prompt_v0.0.01",
            "model_version": "mock-asset-v0.0.01",
            "quality_status": {"status": "review", "quality_score": 3, "missing_fields": [], "notes": ["兼容模式记录。"]},
            "boundary_check_result": {"status": "passed", "notes": ["兼容模式记录。"], "blocked_phrases": [], "review_required": False},
        }
    )
    return result


def analyze_portfolio(user_id: str = DEMO_USER_ID):
    positions = get_positions(user_id)
    if not positions:
        return None

    total_weight = round(sum(float(item.get("weight", 0)) for item in positions), 4)
    max_position = max(positions, key=lambda item: float(item.get("weight", 0)))
    industry_exposure = _group_exposure(positions, "industry")
    style_exposure = _group_exposure(positions, "style")
    top_industry = max(industry_exposure, key=lambda item: item["weight"]) if industry_exposure else None

    max_weight = float(max_position.get("weight", 0))
    top_industry_weight = float(top_industry["weight"]) if top_industry else 0
    concentration_risk = "high" if max_weight > 0.4 or top_industry_weight > 0.55 else "medium" if max_weight > 0.25 else "low"
    fit_to_user = _fit_to_user(total_weight, max_weight, top_industry_weight)
    risk_level = "high" if fit_to_user < 55 else "medium" if fit_to_user < 75 else "low"

    result = {
        "analysis_id": make_id("ana_portfolio"),
        "analysis_type": "portfolio_review",
        "risk_level": risk_level,
        "confidence": 0.76,
        "concentration_risk": concentration_risk,
        "concentration": {
            "max_position_asset": max_position.get("asset_name") or max_position.get("asset_code"),
            "max_position_weight": round(max_weight, 4),
            "total_weight": total_weight,
            "position_count": len(positions),
        },
        "industry_exposure": industry_exposure,
        "style_exposure": style_exposure,
        "fit_to_user": fit_to_user,
        "duplicate_exposure": _duplicate_exposure(positions),
        "summary": _portfolio_summary(concentration_risk, fit_to_user),
        "key_factors": _portfolio_key_factors(positions, total_weight),
        "risk_factors": _portfolio_risk_factors(total_weight, max_weight, top_industry),
        "next_review_focus": [
            "复盘单一方向占比是否符合原计划",
            "关注高波动资产在组合中的比例变化",
            "下次调整前先确认投资期限和最大可接受回撤",
        ],
        "data_date": today_text(),
    }
    result["explanation"] = explain_portfolio(result)
    return result


def _asset_scores(asset_code: str):
    score_map = {
        "510300.SH": {"trend": 68, "valuation": 62, "liquidity": 88, "risk": 42, "fit_to_user": 72},
        "159915.SZ": {"trend": 66, "valuation": 55, "liquidity": 82, "risk": 58, "fit_to_user": 64},
        "600519.SH": {"trend": 57, "valuation": 52, "liquidity": 78, "risk": 48, "fit_to_user": 61},
        "300750.SZ": {"trend": 63, "valuation": 50, "liquidity": 76, "risk": 62, "fit_to_user": 58},
        "000001.SZ": {"trend": 54, "valuation": 70, "liquidity": 74, "risk": 46, "fit_to_user": 65},
        "000300.SH": {"trend": 61, "valuation": 64, "liquidity": 90, "risk": 40, "fit_to_user": 73},
    }
    return score_map.get(asset_code, {"trend": 50, "valuation": 50, "liquidity": 50, "risk": 50, "fit_to_user": 50})


def _asset_key_factors(asset: dict):
    if asset["asset_type"] in {"etf", "index"}:
        return ["宽基属性较强", "流动性基础较好", "适合作为组合结构观察对象"]
    return [f"所属行业为{asset['industry']}", f"风格特征偏{asset['style']}", "适合结合仓位占比继续评估"]


def _asset_risk_factors(asset: dict):
    if asset["asset_type"] == "etf":
        return ["仍会受到整体市场波动影响", "如果组合中同类宽基过多，可能产生重复暴露"]
    if asset["asset_type"] == "index":
        return ["指数本身不代表低风险", "短期波动仍可能影响持有体验"]
    return ["单一股票波动可能高于宽基资产", "需要结合财务和估值变化继续跟踪"]


def _group_exposure(positions: list[dict], field: str):
    grouped = defaultdict(float)
    for position in positions:
        asset = ASSET_BY_CODE.get(position.get("asset_code"), {})
        label = asset.get(field) or "未分类"
        grouped[label] += float(position.get("weight", 0))
    return [{"industry" if field == "industry" else "style": key, "weight": round(value, 4)} for key, value in grouped.items()]


def _fit_to_user(total_weight: float, max_weight: float, top_industry_weight: float) -> int:
    dna = settings_state["investment_dna"]
    score = 78
    if dna.get("risk_level") == "conservative":
        score -= 8
    if total_weight > 0.95:
        score -= 6
    if max_weight > 0.35:
        score -= 12
    elif max_weight > 0.25:
        score -= 6
    if top_industry_weight > 0.55:
        score -= 10
    return max(35, min(92, score))


def _portfolio_summary(concentration_risk: str, fit_to_user: int):
    risk_text = {"low": "集中度较低", "medium": "存在一定集中度", "high": "集中度偏高"}.get(concentration_risk, "集中度未知")
    if fit_to_user >= 75:
        return f"当前组合{risk_text}，与已配置的投资偏好基本匹配，适合继续定期复盘。"
    return f"当前组合{risk_text}，与已配置的投资偏好并不完全匹配，建议重点检查单一方向占比。"


def _portfolio_key_factors(positions: list[dict], total_weight: float):
    factors = [f"已录入 {len(positions)} 个持仓，合计权重约 {round(total_weight * 100, 1)}%"]
    if any(ASSET_BY_CODE.get(p.get("asset_code"), {}).get("asset_type") == "etf" for p in positions):
        factors.append("组合中包含 ETF，具备一定分散基础")
    if total_weight < 0.9:
        factors.append("未录入部分可视为现金或其他资产，分析结果会保留不确定性")
    return factors


def _portfolio_risk_factors(total_weight: float, max_weight: float, top_industry: Optional[dict]):
    factors = []
    if max_weight > 0.25:
        factors.append("单一标的权重较高，需要确认是否符合原计划")
    if top_industry and top_industry["weight"] > 0.45:
        factors.append(f"{top_industry['industry']}方向占比较高，可能带来主题集中风险")
    if total_weight > 1:
        factors.append("录入持仓权重超过 100%，请检查比例口径")
    if not factors:
        factors.append("当前未识别到特别突出的单一集中风险")
    return factors


def _duplicate_exposure(positions: list[dict]):
    etf_positions = [p for p in positions if ASSET_BY_CODE.get(p.get("asset_code"), {}).get("asset_type") == "etf"]
    if len(etf_positions) < 2:
        return []
    return [
        {
            "theme": "宽基或成长 ETF",
            "assets": [item.get("asset_name") for item in etf_positions],
            "note": "多个 ETF 可能在核心成分上存在交叉，需要进一步确认是否重复暴露。",
        }
    ]
