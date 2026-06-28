# DECISION ENGINE

## Purpose

The Decision Engine converts user context, market signals, asset signals and portfolio context into structured investment decision support.

## Core Principle

Decision support should be probabilistic, transparent and risk-aware. It must not present itself as guaranteed financial advice.

## Decision Pipeline

```text
User Investment DNA
        ↓
User Intent
        ↓
Market State
        ↓
Asset Signals
        ↓
Portfolio Context
        ↓
Risk Checks
        ↓
Decision Recommendation
        ↓
Explanation + Evidence
        ↓
Decision Record
```

## Supported Decisions

- buy
- sell
- add
- reduce
- hold
- watch

## Output Actions

- proceed
- proceed_with_smaller_size
- wait
- hold
- reduce_risk
- avoid
- insufficient_evidence

## Key Scores

| Score | Range | Meaning |
|---|---:|---|
| market_score | 0-100 | Overall market state |
| asset_score | 0-100 | Asset attractiveness |
| risk_score | 0-100 | Higher means higher risk |
| confidence | 0-1 | Strength of the decision |
| suitability_score | 0-100 | Fit with user's Investment DNA |

## Recommendation Logic

The final recommendation should consider:

1. Is the user's intended action aligned with their Investment DNA?
2. Is current market state supportive or hostile?
3. Is the asset trend improving, weakening, or unclear?
4. Would this action increase portfolio concentration risk?
5. Is there enough evidence to act?
6. What are the main invalidation conditions?

## Required Output

Every decision output must include:

- action
- confidence
- summary
- suggested_position_size
- evidence
- risks
- invalidation_conditions
- user_language_explanation
- compliance_disclaimer
