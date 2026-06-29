import type { RiskLevel } from "@/lib/types";

export function riskLabel(level?: RiskLevel | string) {
  const labels: Record<string, string> = {
    low: "低风险",
    medium: "中等风险",
    high: "高风险",
    unknown: "未知",
  };
  return labels[level || "unknown"] || "未知";
}

export function analysisTypeLabel(type: string) {
  const labels: Record<string, string> = {
    market_status: "市场状态",
    asset_review: "标的分析",
    portfolio_review: "持仓体检",
    portfolio_health: "持仓体检",
    weekly_review: "周度复盘",
    history_review: "历史复盘",
  };
  return labels[type] || "分析记录";
}

export function percent(value: number | null | undefined, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }
  return `${(value * 100).toFixed(digits)}%`;
}

export function score(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }
  return `${Math.round(value)} / 100`;
}

export function confidenceLabel(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }
  return `${Math.round(value * 100)}%`;
}

export function shortDateTime(value: string) {
  if (!value) return "--";
  return value.replace("T", " ").slice(0, 16);
}

export function qualityStatusLabel(value?: string) {
  const labels: Record<string, string> = {
    passed: "质量通过",
    review: "需要复核",
    partial: "部分可用",
  };
  return labels[value || ""] || "待评估";
}
