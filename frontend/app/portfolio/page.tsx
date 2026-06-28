"use client";

import { useState } from "react";
import { ExplanationPanel } from "@/components/analysis/ExplanationPanel";
import { FactorList } from "@/components/analysis/FactorList";
import { PortfolioPanel } from "@/components/analysis/PortfolioPanel";
import { PositionEditor } from "@/components/forms/PositionEditor";
import { FooterNotice } from "@/components/layout/FooterNotice";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api";
import type { PortfolioAnalysis, Position } from "@/lib/types";

const seedPositions: Position[] = [
  { asset_code: "510300.SH", asset_name: "沪深300ETF", weight: 0.35, cost_price: 3.8, note: "宽基底仓" },
  { asset_code: "159915.SZ", asset_name: "创业板ETF", weight: 0.25, cost_price: 2.1, note: "成长方向" },
  { asset_code: "600519.SH", asset_name: "贵州茅台", weight: 0.18, cost_price: 1680, note: "质量资产观察" },
];

export default function PortfolioPage() {
  const [positions, setPositions] = useState<Position[]>(seedPositions);
  const [analysis, setAnalysis] = useState<PortfolioAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function saveAndAnalyze() {
    const valid = positions.filter((item) => item.asset_code.trim() && item.weight > 0);
    if (!valid.length) {
      setMessage("请至少录入一条有效持仓。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await api.savePortfolio(valid);
      const result = await api.analyzePortfolio();
      setAnalysis(result);
      setMessage("持仓已保存，体检报告已生成并写入历史记录。");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "持仓分析暂时不可用，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="AI 持仓体检报告"
        description="手动录入持仓，查看集中度、行业分布、风格暴露、用户匹配度和中文解释。"
        question="页面回答：我的组合结构是否存在明显集中、偏离或风险暴露？"
      />

      <PositionEditor positions={positions} onChange={setPositions} />

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-600">第一版使用 mock 数据补全行业和风格，只用于演示结构化体检闭环。</p>
        <button
          type="button"
          onClick={saveAndAnalyze}
          disabled={loading}
          className="h-11 rounded-md bg-pine px-5 text-sm font-bold text-white disabled:bg-slate-300"
        >
          {loading ? "生成中" : "保存并生成体检报告"}
        </button>
      </div>

      {message ? <div className="mt-5 rounded-md bg-pineSoft px-4 py-3 text-sm text-pine">{message}</div> : null}

      <div className="mt-5 grid gap-5">
        <PortfolioPanel analysis={analysis} />
        <FactorList
          title="组合关注事项"
          keyFactors={analysis?.key_factors || []}
          watchFactors={[...(analysis?.risk_factors || []), ...(analysis?.next_review_focus || [])]}
        />
        <ExplanationPanel
          summary={analysis?.summary}
          explanation={analysis?.explanation}
          confidence={analysis?.confidence}
          dataDate={analysis?.data_date}
        />
      </div>

      <FooterNotice />
    </div>
  );
}
