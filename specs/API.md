# API SPEC

## Base Path

`/api/v1`

## POST /investment-dna

Create or update user Investment DNA.

### Request

```json
{
  "risk_tolerance": "medium",
  "investment_horizon": "long",
  "capital_size_range": "200k-1m",
  "max_drawdown_tolerance": 0.15,
  "preferred_assets": ["stock", "etf"],
  "trading_frequency": "low",
  "primary_goal": "growth",
  "experience_level": "intermediate"
}
```

### Response

```json
{
  "investment_dna_id": "dna_123",
  "status": "saved"
}
```

## GET /daily-decision

Return today's general decision support view.

### Response

```json
{
  "date": "2026-06-28",
  "market_state": "neutral_positive",
  "market_score": 68,
  "suggested_exposure_range": [0.45, 0.65],
  "stance": "hold_and_observe",
  "opportunities": ["broad-market ETF", "dividend assets"],
  "risks": ["high-volatility themes"],
  "summary": "The market is constructive but not strong enough for aggressive chasing."
}
```

## POST /second-opinion

### Request

```json
{
  "user_id": "user_123",
  "asset_code": "300750.SZ",
  "asset_name": "宁德时代",
  "intended_action": "buy",
  "planned_position_size": 0.1,
  "user_reason": "I think new energy may rebound."
}
```

### Response

```json
{
  "decision_id": "dec_123",
  "recommended_action": "wait",
  "confidence": 0.72,
  "risk_score": 76,
  "suggested_position_size": 0.03,
  "summary": "Consider waiting rather than buying immediately.",
  "evidence": ["Trend confirmation is insufficient", "Position size may be high for current risk"],
  "risks": ["sector volatility", "drawdown risk"],
  "invalidation_conditions": ["price stabilizes above 60-day MA", "sector strength improves"],
  "disclaimer": "For decision support only, not financial advice."
}
```

## POST /portfolio-review

### Request

```json
{
  "user_id": "user_123",
  "holdings": [
    {"asset_code": "510300.SH", "asset_name": "沪深300ETF", "weight": 0.4},
    {"asset_code": "300750.SZ", "asset_name": "宁德时代", "weight": 0.3}
  ]
}
```

### Response

```json
{
  "portfolio_score": 63,
  "risk_level": "medium_high",
  "warnings": ["single sector exposure may be high"],
  "suggestions": ["reduce concentration", "increase diversified ETF exposure"]
}
```

## GET /decision-history

Return historical decisions for current user.
