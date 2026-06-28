# OUTPUT FORMATS

## Decision Output

```json
{
  "recommended_action": "wait",
  "confidence": 0.72,
  "suitability_score": 64,
  "risk_score": 76,
  "suggested_position_size": 0.03,
  "summary": "Consider waiting rather than buying immediately.",
  "reasoning": {
    "market": "Market condition is neutral-positive but not aggressive.",
    "asset": "Asset trend is not confirmed.",
    "portfolio": "Planned position size may increase concentration risk.",
    "user_fit": "Action may exceed user's drawdown tolerance."
  },
  "evidence": [
    {"type": "signal", "text": "Price remains below 60-day moving average."},
    {"type": "risk", "text": "Sector volatility is elevated."}
  ],
  "risks": ["trend failure", "sector rotation risk"],
  "invalidation_conditions": ["asset closes above 60-day MA for multiple sessions"],
  "plain_language": "If you still want exposure, consider waiting or using a smaller position.",
  "disclaimer": "For decision support only, not financial advice."
}
```

## Daily Decision Output

```json
{
  "date": "YYYY-MM-DD",
  "market_state": "risk_on | neutral_positive | neutral | cautious | risk_off",
  "market_score": 0,
  "suggested_exposure_range": [0.3, 0.5],
  "stance": "hold | observe | reduce_risk | cautiously_add",
  "opportunities": [],
  "risks": [],
  "summary": ""
}
```
