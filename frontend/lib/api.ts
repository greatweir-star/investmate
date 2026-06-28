import type {
  ApiResponse,
  AppSettings,
  AssetAnalysis,
  AssetSuggestion,
  HistoryDetail,
  HistoryRecord,
  InvestmentDNA,
  MarketStatus,
  PortfolioAnalysis,
  Position,
  SyncStatus,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success || !payload.data) {
    throw new Error(payload.error?.message || "服务暂时不可用，请稍后重试。");
  }
  return payload.data;
}

export const api = {
  getMarketStatus: () => request<MarketStatus>("/api/market/status"),
  searchAssets: (keyword: string) =>
    request<AssetSuggestion[]>(`/api/assets/search?keyword=${encodeURIComponent(keyword)}`),
  analyzeAsset: (assetCode: string, question?: string) =>
    request<AssetAnalysis>("/api/analysis/asset", {
      method: "POST",
      body: JSON.stringify({ asset_code: assetCode, question, user_id: "demo_user" }),
    }),
  savePortfolio: (positions: Position[]) =>
    request<{ portfolio_id: string; position_count: number; total_weight: number; updated_at: string }>(
      "/api/portfolio",
      {
        method: "POST",
        body: JSON.stringify({ user_id: "demo_user", positions }),
      },
    ),
  analyzePortfolio: () =>
    request<PortfolioAnalysis>("/api/analysis/portfolio", {
      method: "POST",
      body: JSON.stringify({ user_id: "demo_user" }),
    }),
  getHistory: (params?: { limit?: number; analysisType?: string }) => {
    const query = new URLSearchParams({
      user_id: "demo_user",
      limit: String(params?.limit || 20),
    });
    if (params?.analysisType) query.set("analysis_type", params.analysisType);
    return request<HistoryRecord[]>(`/api/analysis/history?${query.toString()}`);
  },
  getHistoryDetail: (analysisId: string) => request<HistoryDetail>(`/api/analysis/${analysisId}`),
  getSettings: () => request<AppSettings>("/api/settings"),
  saveSettings: (investmentDna: InvestmentDNA) =>
    request<{ saved: boolean; updated_at: string }>("/api/settings", {
      method: "POST",
      body: JSON.stringify({ investment_dna: investmentDna }),
    }),
  getSyncStatus: () => request<SyncStatus>("/api/admin/sync/status"),
  triggerSync: (scope: string[]) =>
    request<{ sync_id: string; status: string; scope: string[] }>("/api/admin/sync", {
      method: "POST",
      body: JSON.stringify({ scope }),
    }),
};
