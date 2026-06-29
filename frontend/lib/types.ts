export type RiskLevel = "low" | "medium" | "high" | "unknown";
export type ReportType = "portfolio_health" | "weekly_review" | "asset_review";

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

export type PositionEnriched = {
  asset_code: string;
  asset_name: string;
  asset_type: string;
  industry: string;
  style: string;
  weight: number;
  cost_price?: number | null;
  note?: string;
  data_status: string;
};

export type EvidenceItem = {
  source_type: string;
  source_field: string;
  source_value: unknown;
  description: string;
  name?: string;
};

export type ScoreItem = {
  key: string;
  name: string;
  score: number;
  explanation: string;
  evidence: EvidenceItem[];
};

export type ExposureItem = {
  category: string;
  name: string;
  weight: number;
  description: string;
  evidence: EvidenceItem[];
};

export type WatchItem = {
  title: string;
  description: string;
  evidence: EvidenceItem[];
  level: RiskLevel;
};

export type ReportExplanation = {
  short_summary: string;
  detailed_explanation: string;
  assumptions: string[];
  data_notes: string[];
};

export type QualityStatus = {
  status: "passed" | "review" | "partial";
  quality_score: number;
  missing_fields: string[];
  notes: string[];
};

export type BoundaryCheckResult = {
  status: "passed" | "warning";
  notes: string[];
  blocked_phrases: string[];
  review_required: boolean;
};

export type ReportDetail = {
  report_id: string;
  user_id: string;
  report_type: ReportType;
  title: string;
  summary: string;
  health_score: number;
  fit_score: number;
  risk_level: RiskLevel;
  confidence: number;
  data_date: string;
  generated_at: string;
  created_at: string;
  position_count: number;
  position_input: Position[];
  enriched_positions: PositionEnriched[];
  score_items: ScoreItem[];
  exposure_items: ExposureItem[];
  watch_items: WatchItem[];
  duplicate_exposure: Array<{
    theme: string;
    assets: string[];
    note: string;
  }>;
  explanation: ReportExplanation;
  evidence: {
    enriched_positions?: PositionEnriched[];
    score_calculation?: Array<{
      key: string;
      score: number;
      evidence: EvidenceItem[];
    }>;
    exposure_calculation?: Array<{
      category: string;
      name: string;
      weight: number;
      evidence: EvidenceItem[];
    }>;
    watch_item_evidence?: Array<{
      title: string;
      level: RiskLevel;
      evidence: EvidenceItem[];
    }>;
    memory_context?: {
      latest_report_id?: string;
      history_report_count: number;
      feedback_count: number;
    };
    review_compare?: {
      previous_report_id?: string;
      current_report_id: string;
      previous_health_score?: number | null;
      current_health_score: number;
      health_score_change?: number | null;
      continued_watch_titles: string[];
    };
  };
  prompt_version: string;
  model_version: string;
  quality_status: QualityStatus;
  boundary_check_result: BoundaryCheckResult;
  agent_trace?: Array<{
    agent_name: string;
    output_status: string;
  }>;
  review?: {
    previous_report_id?: string;
    changes: Array<{
      field: string;
      previous_value?: number | null;
      current_value?: number | null;
      direction: string;
      description: string;
    }>;
    continued_watch_items: WatchItem[];
    feedback_context_count: number;
    next_review_hint: string;
  };
};

export type HistoryRecord = {
  analysis_id: string;
  analysis_type: ReportType;
  target_name: string;
  summary: string;
  risk_level: RiskLevel;
  confidence: number;
  data_date: string;
  created_at: string;
  quality_status?: string;
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
  explanation_style?: string;
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

export type FeedbackPayload = {
  report_id: string;
  feedback_type: string;
  feedback_text?: string;
};

export type FeedbackResponse = {
  feedback: {
    feedback_id: string;
    report_id: string;
    user_id: string;
    feedback_type: string;
    feedback_label: string;
    feedback_text: string;
    target_module: string;
    priority: string;
    created_at: string;
  };
  report_feedback_count: number;
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

