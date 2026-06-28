from __future__ import annotations

from copy import deepcopy
from typing import Optional
from uuid import uuid4

from app.core.response import now_iso, today_text


DEMO_USER_ID = "demo_user"
PROMPT_VERSION = "prompt_mock_v0.1"
MODEL_VERSION = "mock-rule-engine-v0.1"

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

analysis_records = []


def make_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:10]}"


def get_asset(asset_code: Optional[str]):
    if not asset_code:
        return None
    upper_code = asset_code.upper()
    return ASSET_BY_CODE.get(upper_code)


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


def add_analysis_record(
    user_id: str,
    analysis_type: str,
    target_code: Optional[str],
    target_name: str,
    input_payload: dict,
    structured_result: dict,
    natural_language: str,
):
    record = {
        "analysis_id": structured_result["analysis_id"],
        "user_id": user_id,
        "analysis_type": analysis_type,
        "target_code": target_code,
        "target_name": target_name,
        "input_payload": deepcopy(input_payload),
        "structured_result": deepcopy(structured_result),
        "natural_language": natural_language,
        "summary": structured_result.get("summary", ""),
        "confidence": structured_result.get("confidence", 0),
        "risk_level": structured_result.get("risk_level", "unknown"),
        "data_date": structured_result.get("data_date", today_text()),
        "prompt_version": PROMPT_VERSION,
        "model_version": MODEL_VERSION,
        "created_at": now_iso(),
    }
    analysis_records.insert(0, record)
    return deepcopy(record)


def list_history(user_id: str, limit: int = 20, analysis_type: Optional[str] = None):
    rows = [
        row
        for row in analysis_records
        if row["user_id"] == user_id and (not analysis_type or row["analysis_type"] == analysis_type)
    ]
    return deepcopy(rows[:limit])


def get_history_detail(analysis_id: str):
    for record in analysis_records:
        if record["analysis_id"] == analysis_id:
            return deepcopy(record)
    return None
