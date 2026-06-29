from __future__ import annotations

from copy import deepcopy
from typing import Optional
from uuid import uuid4

from app.core.response import now_iso, today_text


DEMO_USER_ID = "demo_user"
REPORT_PROMPT_VERSION = "portfolio_health_prompt_v0.0.01"
REPORT_MODEL_VERSION = "mock-agent-stack_v0.0.01"

ASSETS = [
    {
        "asset_code": "510300.SH",
        "asset_name": "沪深300ETF",
        "asset_type": "etf",
        "market": "SH",
        "industry": "宽基ETF",
        "style": "大盘均衡",
    },
    {
        "asset_code": "159915.SZ",
        "asset_name": "创业板ETF",
        "asset_type": "etf",
        "market": "SZ",
        "industry": "成长ETF",
        "style": "成长风格",
    },
    {
        "asset_code": "600519.SH",
        "asset_name": "贵州茅台",
        "asset_type": "stock",
        "market": "SH",
        "industry": "食品饮料",
        "style": "质量价值",
    },
    {
        "asset_code": "300750.SZ",
        "asset_name": "宁德时代",
        "asset_type": "stock",
        "market": "SZ",
        "industry": "电力设备",
        "style": "成长制造",
    },
    {
        "asset_code": "000001.SZ",
        "asset_name": "平安银行",
        "asset_type": "stock",
        "market": "SZ",
        "industry": "银行",
        "style": "价值金融",
    },
    {
        "asset_code": "000300.SH",
        "asset_name": "沪深300指数",
        "asset_type": "index",
        "market": "SH",
        "industry": "宽基指数",
        "style": "大盘均衡",
    },
]

ASSET_BY_CODE = {asset["asset_code"]: asset for asset in ASSETS}

settings_state = {
    "investment_dna": {
        "risk_level": "balanced",
        "investment_horizon": "1-3y",
        "max_drawdown_tolerance": 0.15,
        "asset_preferences": ["a_share", "etf"],
        "trading_frequency": "medium",
        "experience_level": "intermediate",
        "explanation_style": "structured",
    }
}

portfolio_state = {
    DEMO_USER_ID: [
        {
            "asset_code": "510300.SH",
            "asset_name": "沪深300ETF",
            "weight": 0.35,
            "cost_price": 3.8,
            "note": "宽基底仓",
        },
        {
            "asset_code": "159915.SZ",
            "asset_name": "创业板ETF",
            "weight": 0.25,
            "cost_price": 2.1,
            "note": "成长方向",
        },
        {
            "asset_code": "600519.SH",
            "asset_name": "贵州茅台",
            "weight": 0.18,
            "cost_price": 1680,
            "note": "质量资产观察",
        },
    ]
}

report_records: list[dict] = []
feedback_records: list[dict] = []


def make_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:10]}"


def get_asset(asset_code: Optional[str]):
    if not asset_code:
        return None
    return ASSET_BY_CODE.get(asset_code.upper())


def search_assets(keyword: str):
    text = keyword.strip().lower()
    if not text:
        return []
    results = []
    for asset in ASSETS:
        haystack = f"{asset['asset_code']} {asset['asset_name']} {asset['industry']}".lower()
        if text in haystack:
            item = deepcopy(asset)
            item.pop("style", None)
            results.append(item)
    return results[:10]


def save_positions(user_id: str, positions: list[dict]):
    normalized = []
    for position in positions:
        asset_code = str(position.get("asset_code", "")).upper().strip()
        asset = get_asset(asset_code) or {}
        raw_weight = float(position.get("weight") or 0)
        normalized_weight = raw_weight / 100 if raw_weight > 1 else raw_weight
        normalized.append(
            {
                "asset_code": asset_code,
                "asset_name": position.get("asset_name") or asset.get("asset_name") or "未命名标的",
                "weight": normalized_weight,
                "cost_price": position.get("cost_price"),
                "note": position.get("note") or "",
            }
        )
    portfolio_state[user_id] = normalized
    return deepcopy(normalized)


def get_positions(user_id: str):
    return deepcopy(portfolio_state.get(user_id, []))


def save_report(report: dict):
    report_records.insert(0, deepcopy(report))
    return deepcopy(report)


def get_report(report_id: str):
    for report in report_records:
        if report["report_id"] == report_id:
            return deepcopy(report)
    return None


def list_reports(user_id: str, limit: int = 20, report_type: Optional[str] = None):
    rows = [
        row
        for row in report_records
        if row["user_id"] == user_id and (not report_type or row["report_type"] == report_type)
    ]
    return deepcopy(rows[:limit])


def get_latest_report(user_id: str, report_type: Optional[str] = None, exclude_report_id: Optional[str] = None):
    for report in report_records:
        if report["user_id"] != user_id:
            continue
        if report_type and report["report_type"] != report_type:
            continue
        if exclude_report_id and report["report_id"] == exclude_report_id:
            continue
        return deepcopy(report)
    return None


def add_feedback(feedback: dict):
    feedback_records.insert(0, deepcopy(feedback))
    return deepcopy(feedback)


def list_feedback_for_report(report_id: str):
    rows = [row for row in feedback_records if row["report_id"] == report_id]
    return deepcopy(rows)


def list_feedback_for_user(user_id: str, limit: int = 20):
    rows = [row for row in feedback_records if row["user_id"] == user_id]
    return deepcopy(rows[:limit])


def get_watch_item_history(user_id: str, limit: int = 12):
    history = []
    for report in report_records:
        if report["user_id"] != user_id:
            continue
        for item in report.get("watch_items", []):
            history.append(
                {
                    "report_id": report["report_id"],
                    "report_type": report["report_type"],
                    "title": item.get("title", ""),
                    "level": item.get("level", "medium"),
                    "created_at": report["created_at"],
                }
            )
    return deepcopy(history[:limit])


def list_history(user_id: str, limit: int = 20, analysis_type: Optional[str] = None):
    rows = list_reports(user_id=user_id, limit=limit, report_type=analysis_type)
    return [
        {
            "analysis_id": row["report_id"],
            "analysis_type": row["report_type"],
            "target_name": row["title"],
            "summary": row["summary"],
            "risk_level": row["risk_level"],
            "confidence": row["confidence"],
            "data_date": row["data_date"],
            "created_at": row["created_at"],
            "quality_status": row["quality_status"]["status"],
        }
        for row in rows
    ]


def get_history_detail(analysis_id: str):
    report = get_report(analysis_id)
    if not report:
        return None
    return {
        "analysis_id": report["report_id"],
        "analysis_type": report["report_type"],
        "target_name": report["title"],
        "input_payload": {
            "positions": report.get("position_input", []),
            "user_id": report["user_id"],
        },
        "structured_result": report,
        "natural_language": report.get("explanation", {}).get("detailed_explanation", ""),
        "data_date": report["data_date"],
        "prompt_version": report["prompt_version"],
        "model_version": report["model_version"],
        "created_at": report["created_at"],
    }

