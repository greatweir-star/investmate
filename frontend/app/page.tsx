"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketStatusCard } from "@/components/cards/MarketStatusCard";
import { RiskSummaryCard } from "@/components/cards/RiskSummaryCard";
import { QuickAnalyzeBox } from "@/components/forms/QuickAnalyzeBox";
import { FooterNotice } from "@/components/layout/FooterNotice";
import { PageHeader } from "@/components/layout/PageHeader";
import { HistoryTable } from "@/components/history/HistoryTable";
import { api } from "@/lib/api";
import type { HistoryRecord, MarketStatus } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([api.getMarketStatus(), api.getHistory({ limit: 5 })])
      .then(([status, records]) => {
        if (!active) return;
        setMarketStatus(status);
        setHistory(records);
      })
      .catch((err: Error) => {
        if (active) setError(err.message || "数据暂时无法加载，请稍后重试。");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <PageHeader
        title="今天先看什么"
        description="用市场状态、快速分析和历史复盘，帮助你在投资判断前获得一份结构化第二意见。"
        question="首页回答：当前市场环境和我的下一步研究重点是什么？"
      />

      {error ? <div className="mb-5 rounded-md bg-redSoft px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <MarketStatusCard status={marketStatus} />
        <RiskSummaryCard status={marketStatus} />
      </div>

      <div className="mt-5">
        <QuickAnalyzeBox onSubmit={(keyword) => router.push(`/assets?keyword=${encodeURIComponent(keyword)}`)} />
      </div>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">最近分析记录</h2>
          <button type="button" onClick={() => router.push("/history")} className="text-sm font-bold text-pine">
            查看全部
          </button>
        </div>
        <HistoryTable records={history} onSelect={() => router.push("/history")} />
      </section>

      <FooterNotice />
    </div>
  );
}
