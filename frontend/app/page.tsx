"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FooterNotice } from "@/components/layout/FooterNotice";
import { HistoryTable } from "@/components/history/HistoryTable";
import { analysisTypeLabel, shortDateTime } from "@/lib/format";
import { api } from "@/lib/api";
import type { HistoryRecord } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    api
      .getHistory({ limit: 6 })
      .then((records) => {
        if (active) setHistory(records);
      })
      .catch((err: Error) => {
        if (active) setMessage(err.message || "最近报告暂时无法加载，请稍后重试。");
      });
    return () => {
      active = false;
    };
  }, []);

  const latestReport = history[0];

  return (
    <div className="page-shell">
      <section className="hero-panel grain-bg rounded-[28px] px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div className="relative z-[1]">
            <p className="small-label">AI 持仓体检报告</p>
            <h1 className="mt-3 max-w-3xl font-[var(--heading-font)] text-4xl font-bold leading-[1.05] text-ink md:text-[58px]">
              给你的持仓做一次 AI 体检
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">
              从持仓录入开始，生成一份带依据、带边界检查、可保存、可复盘的结构化报告。它不会替你做决定，但会把值得回看的问题整理清楚。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/portfolio")}
                className="h-12 rounded-full bg-pine px-6 text-sm font-bold text-white shadow-soft"
              >
                开始录入持仓
              </button>
              <button
                type="button"
                onClick={() => router.push(latestReport ? `/reports/${latestReport.analysis_id}` : "/history")}
                className="h-12 rounded-full border border-[rgba(23,34,47,0.14)] bg-white/70 px-6 text-sm font-bold text-ink"
              >
                {latestReport ? "查看最近报告" : "查看历史记录"}
              </button>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <StepCard title="录入持仓" body="手动录入当前组合，系统补全基础字段与结构信息。" />
              <StepCard title="生成报告" body="先规则计算，再由 AI 组织成克制、可解释的中文结果。" />
              <StepCard title="继续复盘" body="查看依据、提交反馈、生成周度复盘并进入历史记忆。" />
            </div>
          </div>

          <aside className="relative z-[1] rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/76 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="small-label">最近一次结果</span>
              <span className="rounded-full bg-pineSoft px-3 py-1 text-xs font-bold text-pine">AI Native 闭环</span>
            </div>
            {latestReport ? (
              <div className="mt-5 grid gap-4">
                <div>
                  <p className="text-sm text-slate-500">{analysisTypeLabel(latestReport.analysis_type)}</p>
                  <h2 className="mt-2 font-[var(--heading-font)] text-3xl font-bold leading-tight text-ink">{latestReport.target_name}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{latestReport.summary}</p>
                </div>
                <dl className="grid gap-3 rounded-[18px] bg-[rgba(244,238,228,0.9)] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-slate-500">生成时间</dt>
                    <dd className="font-semibold text-ink">{shortDateTime(latestReport.created_at)}</dd>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-slate-500">数据日期</dt>
                    <dd className="font-semibold text-ink">{latestReport.data_date}</dd>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-slate-500">记录状态</dt>
                    <dd className="font-semibold text-ink">{latestReport.quality_status || "已保存"}</dd>
                  </div>
                </dl>
                <Link
                  href={`/reports/${latestReport.analysis_id}`}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-bold text-white"
                >
                  打开报告详情
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-[18px] border border-dashed border-[rgba(23,34,47,0.12)] px-4 py-6 text-sm leading-7 text-slate-600">
                还没有报告。完成一次持仓录入后，首页会把最新结果、反馈入口和复盘入口放到这里。
              </div>
            )}
          </aside>
        </div>
      </section>

      {message ? <div className="mt-5 rounded-xl bg-redSoft px-4 py-3 text-sm text-red-700">{message}</div> : null}

      <section className="mt-8 grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/80 p-6 shadow-soft">
          <p className="small-label">这版优先回答什么</p>
          <h2 className="mt-3 font-[var(--heading-font)] text-3xl font-bold text-ink">不是告诉你买卖，而是告诉你哪里值得继续看</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
            <li className="rounded-2xl bg-[rgba(33,76,68,0.06)] px-4 py-3">组合健康度和用户匹配度是否偏离</li>
            <li className="rounded-2xl bg-[rgba(33,76,68,0.06)] px-4 py-3">哪些暴露、集中和重复方向需要确认</li>
            <li className="rounded-2xl bg-[rgba(33,76,68,0.06)] px-4 py-3">为什么这么说，对应的依据和数据日期是什么</li>
            <li className="rounded-2xl bg-[rgba(33,76,68,0.06)] px-4 py-3">下次周度复盘时，哪些问题应该延续回看</li>
          </ul>
        </div>

        <div className="rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/80 p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="small-label">历史回看</p>
              <h2 className="mt-2 font-[var(--heading-font)] text-3xl font-bold text-ink">最近报告</h2>
            </div>
            <button type="button" onClick={() => router.push("/history")} className="text-sm font-bold text-pine">
              查看全部
            </button>
          </div>
          <HistoryTable records={history} onSelect={(id) => router.push(`/reports/${id}`)} />
        </div>
      </section>

      <FooterNotice />
    </div>
  );
}

function StepCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[18px] border border-[rgba(23,34,47,0.08)] bg-white/72 p-4">
      <div className="small-label">{title}</div>
      <p className="mt-2 text-sm leading-7 text-slate-700">{body}</p>
    </div>
  );
}

