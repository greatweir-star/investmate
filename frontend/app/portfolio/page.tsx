"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PositionEditor } from "@/components/forms/PositionEditor";
import { FooterNotice } from "@/components/layout/FooterNotice";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api";
import type { Position } from "@/lib/types";

const seedPositions: Position[] = [
  { asset_code: "510300.SH", asset_name: "沪深300ETF", weight: 0.35, cost_price: 3.8, note: "宽基底仓" },
  { asset_code: "159915.SZ", asset_name: "创业板ETF", weight: 0.25, cost_price: 2.1, note: "成长方向" },
  { asset_code: "600519.SH", asset_name: "贵州茅台", weight: 0.18, cost_price: 1680, note: "质量资产观察" },
];

export default function PortfolioPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>(seedPositions);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function saveAndAnalyze() {
    const valid = positions.filter((item) => item.asset_code.trim() && item.weight > 0);
    if (!valid.length) {
      setMessage("请至少录入一条有效持仓。");
      return;
    }
    setMessage("");
    try {
      await api.savePortfolio(valid);
      const report = await api.createPortfolioHealthReport(valid);
      startTransition(() => {
        router.push(`/reports/${report.report_id}`);
      });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "体检报告暂时无法生成，请稍后重试。");
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="持仓录入"
        description="录入当前组合后，系统会按 AI Native 工作流生成一份可追溯、可保存、可复盘的持仓体检报告。"
        question="这一页只负责把你的输入整理清楚；真正的结果页会回答：哪里需要关注、为什么这么说、下次该怎么复盘。"
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <PositionEditor positions={positions} onChange={setPositions} />
        <aside className="rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/80 p-6 shadow-soft">
          <p className="small-label">生成后会得到什么</p>
          <h2 className="mt-3 font-[var(--heading-font)] text-3xl font-bold text-ink">一份可以继续被使用的报告，不是一段一次性文案</h2>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
            <div className="rounded-2xl bg-[rgba(33,76,68,0.06)] px-4 py-3">组合健康度、匹配度、集中度和数据完整度</div>
            <div className="rounded-2xl bg-[rgba(33,76,68,0.06)] px-4 py-3">行业、风格、资产类型暴露和重复方向提示</div>
            <div className="rounded-2xl bg-[rgba(33,76,68,0.06)] px-4 py-3">“为什么这么说”展开依据、数据日期和解释边界</div>
            <div className="rounded-2xl bg-[rgba(33,76,68,0.06)] px-4 py-3">反馈入口和周度复盘入口，直接进入后续历史记忆</div>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-[rgba(23,34,47,0.12)] px-4 py-4 text-sm leading-7 text-slate-600">
            MVP 阶段仍使用 mock 补全行业、风格与解释，但已经预留 Agent 编排、质量检查、解释追溯和反馈学习的工程结构。
          </div>
        </aside>
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-600">建议至少录入 2 个标的，体检结果会更像真实组合而不是单点判断。</p>
        <button
          type="button"
          onClick={saveAndAnalyze}
          disabled={isPending}
          className="h-12 rounded-full bg-pine px-6 text-sm font-bold text-white disabled:bg-slate-300"
        >
          {isPending ? "跳转报告中" : "生成 AI 持仓体检报告"}
        </button>
      </div>

      {message ? <div className="mt-5 rounded-xl bg-redSoft px-4 py-3 text-sm text-red-700">{message}</div> : null}

      <FooterNotice />
    </div>
  );
}

