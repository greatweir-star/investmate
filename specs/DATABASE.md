# DATABASE SPEC

## users

- id
- email
- created_at
- updated_at

## investment_dna

- id
- user_id
- risk_tolerance
- investment_horizon
- capital_size_range
- max_drawdown_tolerance
- preferred_assets JSON
- trading_frequency
- primary_goal
- experience_level
- created_at
- updated_at

## assets

- id
- asset_code
- asset_name
- asset_type
- market
- industry
- listed_date

## market_daily

- id
- asset_code
- trade_date
- open
- high
- low
- close
- volume
- amount
- pct_change

## signals_daily

- id
- asset_code
- trade_date
- trend_score
- risk_score
- volatility
- ma20
- ma60
- ma120
- created_at

## portfolios

- id
- user_id
- name
- created_at
- updated_at

## portfolio_holdings

- id
- portfolio_id
- asset_code
- asset_name
- weight
- quantity
- cost_price
- created_at
- updated_at

## decisions

- id
- user_id
- decision_type
- asset_code
- intended_action
- recommended_action
- confidence
- risk_score
- suggested_position_size
- summary
- evidence JSON
- risks JSON
- invalidation_conditions JSON
- full_output JSON
- created_at

## decision_feedback

- id
- decision_id
- user_id
- feedback_type
- comment
- followed_decision boolean
- created_at
