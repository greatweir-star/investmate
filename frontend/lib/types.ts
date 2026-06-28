export type RiskLevel = "low" | "medium" | "high" | "unknown";

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: null | {
    code: string;
    message: string;
  };
  meta: {
    request_id?: string;
    generated_at?: string;
    data_date?: string;
    version?: string;
  };
};

export type MarketStatus = {
  analysis_type: "market_status";
  market_state: string;
  market_score: number;
  risk_level: RiskLevel;
  confidence: number;
  summary: string;
  key_factors: string[];
  risk_factors: string[];
  explanation: string;
  data_date: string;
};

export type AssetSuggestion = {
  asset_code: string;
  asset_name: string;
  asset_type: string;
  market: string;
  industry: string;
};

export type Scores = {
  trend?: number;
  valuation?: number;
  liquidity?: number;
  risk?: number;
  volatility?: number;
  fit_to_user?: number;
};

export type AssetAnalysis = {
  analysis_id: string;
  analysis_type: "asset_review";
  asset_code: string;
  asset_name: string;
  asset_type: string;
  scores: Scores;
  risk_level: RiskLevel;
  confidence: number;
  summary: string;
  key_factors: string[];
  risk_factors: string[];
  explanation: string;
  data_date: string;
};

export type Position = {
  asset_code: string;
  asset_name: string;
  weight: number;
  cost_price?: number | null;
  note?: string;
};

export type ExposureItem = {
  industry?: string;
  style?: string;
  weight: number;
};

export type PortfolioAnalysis = {
  analysis_id: string;
  analysis_type: "portfolio_review";
  risk_level: RiskLevel;
  confidence: number;
  concentration_risk: RiskLevel;
  concentration: {
    max_position_asset: string;
    max_position_weight: number;
    total_weight: number;
    position_count: number;
  };
  industry_exposure: ExposureItem[];
  style_exposure: ExposureItem[];
  fit_to_user: number;
  duplicate_exposure: Array<{
    theme: string;
    assets: string[];
    note: string;
  }>;
  summary: string;
  key_factors: string[];
  risk_factors: string[];
  next_review_focus: string[];
  explanation: string;
  data_date: string;
};

export type HistoryRecord = {
  analysis_id: string;
  analysis_type: "market_status" | "asset_review" | "portfolio_review" | "history_review";
  target_name: string;
  summary: string;
  risk_level: RiskLevel;
  confidence: number;
  data_date: string;
  created_at: string;
};

export type HistoryDetail = {
  analysis_id: string;
  analysis_type: string;
  target_name: string;
  input_payload: unknown;
  structured_result: unknown;
  natural_language: string;
  data_date: string;
  prompt_version: string;
  model_version: string;
  created_at: string;
};

export type InvestmentDNA = {
  risk_level: string;
  investment_horizon: string;
  max_drawdown_tolerance: number;
  asset_preferences: string[];
  trading_frequency?: string;
  experience_level: string;
};

export type AppSettings = {
  data_source: {
    tushare_configured: boolean;
    latest_data_date: string | null;
    sync_status: string;
  };
  ai_service: {
    provider: string;
    model_name: string;
    api_key_configured: boolean;
  };
  investment_dna: InvestmentDNA;
};

export type SyncStatus = {
  latest_data_date: string;
  status: string;
  items: Array<{
    data_type: string;
    row_count: number;
    status: string;
  }>;
};
