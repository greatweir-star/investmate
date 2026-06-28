"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AssetScorePanel } from "@/components/analysis/AssetScorePanel";
import { ExplanationPanel } from "@/components/analysis/ExplanationPanel";
import { FactorList } from "@/components/analysis/FactorList";
import { AssetSearchInput } from "@/components/forms/AssetSearchInput";
import { FooterNotice } from "@/components/layout/FooterNotice";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatusPill } from "@/components/ui/StatusPill";
import { api } from "@/lib/api";
import type { AssetAnalysis, AssetSuggestion } from "@/lib/types";

export function AssetsClient() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const [suggestions, setSuggestions] = useState<AssetSuggestion[]>([]);
  const [selected, setSelected] = useState<AssetSuggestion | null>(null);
  const [analysis, setAnalysis] = useState<AssetAnalysis | null>(null);
  const [question, setQuestion] = useState("我想了解这个标的当前有哪些值得关注的因素");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialKeyword) {
      handleSearch(initialKeyword, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKeyword]);

  async function handleSearch(keyword: string, autoSelect = false) {
    setLoading(true);
    setMessage("");
    setAnalysis(null);
    try {
      const results = await api.searchAssets(keyword);
      setSuggestions(results);
      if (autoSelect && results[0]) setSelected(results[0]);
      if (!results.length) setMessage("未找到相关标的，请检查代码或名称。");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "分析服务暂时不可用，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    if (!selected) {
      setMessage("请先选择一个标的。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const result = await api.analyzeAsset(selected.asset_code, question);
      setAnalysis(result);
      setMessage("分析已生成，并保存到历史记录。");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "分析服务暂时不可用，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="标的分析"
        description="输入股票、ETF 或指数，查看结构化评分、关键因素、风险因素和中文解释。"
        question="页面回答：这个标的当前有哪些值得进一步关注的因素？"
      />

      <AssetSearchInput
        defaultKeyword={initialKeyword}
        suggestions={suggestions}
        loading={loading}
        onSearch={handleSearch}
        onSelect={setSelected}
      />

      {selected ? (
        <Panel
          title="基础信息"
          action={
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="h-10 rounded-md bg-pine px-4 text-sm font-bold text-white disabled:bg-slate-300"
            >
              {loading ? "分析中" : "生成分析"}
            </button>
          }
        >
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-ink">{selected.asset_name}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {selected.asset_code} · {selected.asset_type} · {selected.industry}
              </p>
            </div>
            {analysis ? <StatusPill level={analysis.risk_level} /> : null}
          </div>
          <label className="mt-4 grid gap-2">
            <span className="small-label">关注问题</span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="min-h-[82px] rounded-md border border-line px-3 py-2 text-sm leading-6"
            />
          </label>
        </Panel>
      ) : null}

      {message ? <div className="mt-5 rounded-md bg-pineSoft px-4 py-3 text-sm text-pine">{message}</div> : null}

      <div className="mt-5 grid gap-5">
        <AssetScorePanel scores={analysis?.scores || null} />
        <FactorList title="标的因素" keyFactors={analysis?.key_factors || []} watchFactors={analysis?.risk_factors || []} />
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
