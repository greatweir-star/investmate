# PRD MVP

## Goal

Build the first usable version of InvestMate: a web app that helps a user get AI-assisted investment decision support.

## Scope

MVP includes four pages:

1. Onboarding / Investment DNA
2. Home / Daily Decision
3. Second Opinion
4. Portfolio Review
5. Decision History

## Page 1 — Investment DNA

### User Story

As an investor, I want the AI to understand my risk profile and investment preferences before giving suggestions.

### Inputs

- Investment experience
- Capital size range
- Investment horizon
- Risk tolerance
- Maximum acceptable drawdown
- Preferred assets: stocks, ETFs, funds, bonds, cash
- Preferred trading frequency
- Goal: growth, income, capital preservation, learning

### Output

A structured `investment_dna` object.

## Page 2 — Home / Daily Decision

### Goal

Give the user a one-minute view of today's investment stance.

### Cards

1. Today's stance: hold / observe / cautious / risk-on / risk-off
2. Suggested exposure range
3. Market state score
4. Opportunities to watch
5. Risks to avoid
6. One-sentence summary

## Page 3 — Second Opinion

### User Story

Before I buy, sell, add, reduce, or hold an asset, I want a transparent AI second opinion.

### Inputs

- Asset code/name
- Intended action: buy / sell / add / reduce / hold / watch
- Planned position size
- Current holding status
- Optional reason from user

### Outputs

- Suggested action: proceed / wait / reduce size / avoid / review
- Confidence score
- Risk score
- Position sizing suggestion
- Evidence summary
- Key risks
- Invalidation conditions
- Plain-language explanation

## Page 4 — Portfolio Review

### Inputs

Manual entry or CSV upload:

- Asset name/code
- Weight or quantity
- Cost price optional
- Holding period optional

### Outputs

- Portfolio risk level
- Concentration warnings
- Style/sector bias
- Suggested improvements
- Alignment with Investment DNA

## Page 5 — Decision History

### Goal

Build trust through memory and traceability.

### Features

- List previous decisions
- Show action, confidence, asset, date
- Show original reasoning
- Allow user feedback: useful / not useful / followed / ignored

## Non-goals

- No live trading
- No brokerage connection
- No guaranteed predictions
- No social/community features
- No complex charts in MVP
