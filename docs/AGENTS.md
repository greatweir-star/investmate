# AGENTS

## Purpose

InvestMate is an AI-native system. Agents are role-based reasoning modules, not necessarily independent services in MVP.

## Agent 1 — Market Agent

### Responsibility

Evaluate broad market state.

### Inputs

- index daily data
- market breadth
- volume
- volatility

### Outputs

- market_score
- market_state
- exposure_range
- opportunity_themes
- risk_themes

## Agent 2 — Asset Agent

### Responsibility

Analyze a specific asset.

### Inputs

- asset price data
- valuation data
- industry data
- user intended action

### Outputs

- asset_score
- trend_state
- risk_score
- evidence_summary

## Agent 3 — Portfolio Agent

### Responsibility

Review user's portfolio suitability and risk.

### Inputs

- user holdings
- Investment DNA
- market state

### Outputs

- concentration risk
- sector/style bias
- suggested adjustments

## Agent 4 — Decision Agent

### Responsibility

Synthesize all signals into final decision support.

### Outputs

- recommended_action
- confidence
- explanation
- risks
- invalidation conditions

## Agent 5 — Review Agent

### Responsibility

Track historical decisions and user feedback.

### Outputs

- decision usefulness
- followed / ignored
- outcome tracking in future versions
