CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    nickname TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_investment_dna (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    risk_level TEXT NOT NULL DEFAULT 'balanced',
    investment_horizon TEXT NOT NULL DEFAULT '1-3y',
    max_drawdown_tolerance NUMERIC(6,4),
    asset_preferences JSONB NOT NULL DEFAULT '[]'::jsonb,
    style_preference TEXT,
    trading_frequency TEXT,
    experience_level TEXT,
    behavior_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_investment_dna_user_id
ON user_investment_dna(user_id);

CREATE TABLE IF NOT EXISTS asset_basic (
    asset_code TEXT PRIMARY KEY,
    asset_name TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    market TEXT,
    industry TEXT,
    list_date DATE,
    status TEXT DEFAULT 'active',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_asset_basic_name ON asset_basic(asset_name);
CREATE INDEX IF NOT EXISTS idx_asset_basic_type ON asset_basic(asset_type);

CREATE TABLE IF NOT EXISTS asset_daily_price (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code TEXT NOT NULL REFERENCES asset_basic(asset_code) ON DELETE CASCADE,
    trade_date DATE NOT NULL,
    open NUMERIC,
    high NUMERIC,
    low NUMERIC,
    close NUMERIC,
    pre_close NUMERIC,
    change_amount NUMERIC,
    pct_chg NUMERIC,
    volume NUMERIC,
    amount NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(asset_code, trade_date)
);

CREATE INDEX IF NOT EXISTS idx_asset_daily_price_code_date
ON asset_daily_price(asset_code, trade_date DESC);

CREATE TABLE IF NOT EXISTS asset_daily_basic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code TEXT NOT NULL REFERENCES asset_basic(asset_code) ON DELETE CASCADE,
    trade_date DATE NOT NULL,
    turnover_rate NUMERIC,
    pe NUMERIC,
    pb NUMERIC,
    ps NUMERIC,
    total_mv NUMERIC,
    circ_mv NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(asset_code, trade_date)
);

CREATE INDEX IF NOT EXISTS idx_asset_daily_basic_code_date
ON asset_daily_basic(asset_code, trade_date DESC);

CREATE TABLE IF NOT EXISTS index_daily_price (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    index_code TEXT NOT NULL,
    index_name TEXT,
    trade_date DATE NOT NULL,
    open NUMERIC,
    high NUMERIC,
    low NUMERIC,
    close NUMERIC,
    pre_close NUMERIC,
    pct_chg NUMERIC,
    volume NUMERIC,
    amount NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(index_code, trade_date)
);

CREATE INDEX IF NOT EXISTS idx_index_daily_price_code_date
ON index_daily_price(index_code, trade_date DESC);

CREATE TABLE IF NOT EXISTS user_portfolio_position (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    asset_code TEXT NOT NULL,
    asset_name TEXT,
    weight NUMERIC(8,6) NOT NULL,
    cost_price NUMERIC,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_portfolio_position_user_id
ON user_portfolio_position(user_id);

CREATE TABLE IF NOT EXISTS portfolio_snapshot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    positions JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_risk_level TEXT,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_snapshot_user_date
ON portfolio_snapshot(user_id, snapshot_date DESC);

CREATE TABLE IF NOT EXISTS analysis_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    analysis_type TEXT NOT NULL,
    target_code TEXT,
    target_name TEXT,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    structured_result JSONB NOT NULL DEFAULT '{}'::jsonb,
    natural_language TEXT,
    data_date DATE,
    confidence NUMERIC(5,4),
    risk_level TEXT,
    prompt_version TEXT,
    model_version TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_record_user_created
ON analysis_record(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analysis_record_type
ON analysis_record(analysis_type);

CREATE TABLE IF NOT EXISTS data_sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    data_type TEXT NOT NULL,
    trade_date DATE,
    status TEXT NOT NULL,
    row_count INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_data_sync_log_type_date
ON data_sync_log(data_type, trade_date DESC);

INSERT INTO users (id, email, nickname)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'demo@investmate.local',
    'Demo User'
)
ON CONFLICT (email) DO NOTHING;
