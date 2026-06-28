# AI 输出结构

## 1. 目标

AI 输出需要同时服务三个场景：

1. 前端展示；
2. 数据库存档；
3. 后续复盘。

因此，每次分析都必须先生成结构化对象，再生成面向用户的中文解释。

## 2. 通用字段

所有分析结果都应包含以下字段：

```json
{
  "analysis_id": "ana_demo",
  "analysis_type": "asset_review",
  "data_date": "2026-06-28",
  "confidence": 0.72,
  "risk_level": "medium",
  "summary": "当前数据提示该对象适合进一步研究。",
  "key_factors": [],
  "risk_factors": [],
  "scores": {},
  "explanation": "这里是中文解释。"
}
```

## 3. analysis_type 枚举

```text
market_status       市场状态
asset_review        标的分析
portfolio_review    持仓分析
history_review      历史复盘
```

## 4. risk_level 枚举

```text
low       低
medium    中
high      高
unknown   未知
```

## 5. confidence 说明

confidence 使用 0 到 1。

它表示当前数据和规则对输出结果的支持程度，不代表未来结果。

## 6. 市场状态输出

```json
{
  "analysis_type": "market_status",
  "market_state": "震荡",
  "market_score": 60,
  "risk_level": "medium",
  "confidence": 0.7,
  "key_factors": ["主要指数处于区间波动"],
  "risk_factors": ["部分方向波动较大"],
  "summary": "当前市场环境偏震荡。",
  "explanation": "从指数和成交情况看，当前环境更适合保持观察和结构化研究。"
}
```

## 7. 标的分析输出

```json
{
  "analysis_type": "asset_review",
  "asset_code": "510300.SH",
  "asset_name": "沪深300ETF",
  "asset_type": "etf",
  "scores": {
    "trend": 70,
    "valuation": 60,
    "liquidity": 85,
    "risk": 45,
    "fit_to_user": 68
  },
  "risk_level": "medium",
  "confidence": 0.74,
  "key_factors": ["流动性较好"],
  "risk_factors": ["仍受整体市场波动影响"],
  "summary": "该对象适合作为后续研究对象。",
  "explanation": "该 ETF 具备宽基和流动性特点，但需要结合用户组合比例评估。"
}
```

## 8. 持仓分析输出

```json
{
  "analysis_type": "portfolio_review",
  "concentration_risk": "medium",
  "industry_exposure": [],
  "style_exposure": [],
  "risk_factors": ["权益类资产占比较高时，组合波动可能增加"],
  "fit_to_user": 65,
  "summary": "当前组合需要关注集中度和波动。",
  "explanation": "从结构看，组合的主要问题在于部分方向占比较高。"
}
```

## 9. 前端展示顺序

1. 摘要；
2. 风险等级；
3. 置信度；
4. 核心评分；
5. 关键因素；
6. 风险因素；
7. 中文解释；
8. 数据日期。

## 10. 生成原则

1. 结构化结果优先于自然语言。
2. 中文解释必须基于结构化结果。
3. 如果数据不足，应输出 unknown 或 evidence_insufficient。
4. 输出应保持克制和可解释。
