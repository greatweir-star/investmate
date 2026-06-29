"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HistoryTable } from "@/components/history/HistoryTable";
import { FooterNotice } from "@/components/layout/FooterNotice";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api";
import type { HistoryRecord } from "@/lib/types";

export default function HistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    api
      .getHistory({ limit: 50, analysisType: filter || undefined })
      .then((data) => {
        if (active) setRecords(data);
      })
      .catch((err: Error) => {
        if (active) setMessage(err.message || "历史记录暂时无法加载，请稍后重试。");
      });
    return () => {
      active = false;
    };
  }, [filter]);

  return (
    <div className="page-shell">
      <PageHeader
        title="历史回看"
        description="这里保存每一份体检报告和周度复盘，方便你按当时的输入、数据日期、质量状态和解释版本回看。"
        question="历史不是归档，而是下一次复盘的上下文。打开一份报告时，应该能继续看到它当时为什么这样判断。"
      />

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[22px] border border-[rgba(23,34,47,0.08)] bg-white/80 p-4 shadow-soft">
        <span className="small-label">记录类型</span>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-full border border-line bg-white px-4 text-sm">
          <option value="">全部</option>
          <option value="portfolio_health">持仓体检</option>
          <option value="weekly_review">周度复盘</option>
          <option value="asset_review">标的分析</option>
        </select>
      </div>

      {message ? <div className="mb-5 rounded-xl bg-redSoft px-4 py-3 text-sm text-red-700">{message}</div> : null}

      <HistoryTable records={records} onSelect={(id) => router.push(`/reports/${id}`)} />

      <FooterNotice />
    </div>
  );
}

