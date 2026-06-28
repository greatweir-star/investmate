"use client";

import { useEffect, useState } from "react";
import { HistoryTable } from "@/components/history/HistoryTable";
import { FooterNotice } from "@/components/layout/FooterNotice";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { api } from "@/lib/api";
import { analysisTypeLabel } from "@/lib/format";
import type { HistoryDetail, HistoryRecord } from "@/lib/types";

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadHistory(filter);
  }, [filter]);

  async function loadHistory(analysisType: string) {
    try {
      const data = await api.getHistory({ limit: 50, analysisType: analysisType || undefined });
      setRecords(data);
      if (!data.length) setDetail(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "历史记录暂时无法加载，请稍后重试。");
    }
  }

  async function selectRecord(analysisId: string) {
    setSelectedId(analysisId);
    setMessage("");
    try {
      setDetail(await api.getHistoryDetail(analysisId));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "历史详情暂时无法加载，请稍后重试。");
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="历史记录"
        description="回看系统过去生成的分析结果，包括输入条件、结构化结果、中文解释和数据日期。"
        question="页面回答：系统过去输出过什么，我能否回看当时的输入、结果和解释？"
      />

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-white p-4 shadow-soft">
        <span className="small-label">分析类型</span>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-md border border-line px-3 text-sm">
          <option value="">全部</option>
          <option value="asset_review">标的分析</option>
          <option value="portfolio_review">持仓体检</option>
        </select>
      </div>

      {message ? <div className="mb-5 rounded-md bg-redSoft px-4 py-3 text-sm text-red-700">{message}</div> : null}

      <HistoryTable records={records} selectedId={selectedId} onSelect={selectRecord} />

      <div className="mt-5">
        <Panel title="历史详情">
          {detail ? (
            <div className="grid gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-ink">{detail.target_name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {analysisTypeLabel(detail.analysis_type)} · 数据日期：{detail.data_date}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <h3 className="mb-2 text-sm font-bold text-slate-700">中文解释</h3>
                <p className="text-sm leading-7 text-slate-700">{detail.natural_language}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <PreBlock title="输入" value={detail.input_payload} />
                <PreBlock title="结构化结果" value={detail.structured_result} />
              </div>
              <p className="text-xs text-slate-500">
                Prompt：{detail.prompt_version} · 模型：{detail.model_version}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">点击一条历史记录查看完整详情。</p>
          )}
        </Panel>
      </div>

      <FooterNotice />
    </div>
  );
}

function PreBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="rounded-md bg-slate-950 p-4 text-slate-100">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap text-xs leading-5">{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}
