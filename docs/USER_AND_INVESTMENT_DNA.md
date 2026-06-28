# USER AND INVESTMENT DNA

## Purpose

Investment DNA is the user's decision context. It prevents generic market commentary from becoming unsuitable personal suggestions.

## Core Fields

```json
{
  "risk_tolerance": "low | medium | high",
  "investment_horizon": "short | medium | long",
  "capital_size_range": "<50k | 50k-200k | 200k-1m | 1m+",
  "max_drawdown_tolerance": 0.1,
  "preferred_assets": ["stock", "etf", "fund", "cash"],
  "trading_frequency": "low | medium | high",
  "primary_goal": "growth | income | preservation | learning",
  "experience_level": "beginner | intermediate | advanced",
  "sector_preferences": [],
  "sector_restrictions": []
}
```

## Decision Impact

Investment DNA affects:

- suggested exposure;
- maximum single-asset position;
- risk language;
- whether to prefer ETFs over single stocks;
- how aggressive an action should be;
- when to recommend observation instead of action.

## Example

Same market, same stock, different user:

- Conservative beginner: “wait, use ETF exposure, max 3% single stock.”
- Aggressive experienced user: “small test position acceptable, max 5%, monitor invalidation level.”
