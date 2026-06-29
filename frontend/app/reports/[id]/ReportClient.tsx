"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FooterNotice } from "@/components/layout/FooterNotice";
import { qualityStatusLabel, riskLabel, score, percent, shortDateTime, analysisTypeLabel } from "@/lib/format";
import { api } from "@/lib/api";
import type { ExposureItem, ReportDetail, WatchItem } from "@/lib/types";

export function ReportClient({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [message, setMessage] = useState("");
  const [showEvidence, setShowEvidence] = useState(false);
  const [feedbackState, setFeedbackState] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    api
      .getReport(reportId)
      .then((data) => {
        if (active) setReport(data);
      })
      .catch((err: Error) => {
        if (active) setMessage(err.message || "报告暂时无法加载，请稍后重试。");
      });
    return () => {
      active = false;
    };
  }, [reportId]);

  const exposureGroups = useMemo(() => {
    const buckets: Record<string, ExposureItem[]> = {};
    for (const item of report?.exposure_items || []) {
      if (!buckets[item.category]) buckets[item.category] = [];
      buckets[item.category].push(item);
    }
    return buckets;
  }, [report]);

  async function handleShare() {
    const url = `${window.location.origin}/reports/${reportId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: report?.title || "AI 持仓体检报告", url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("报告链接已复制，可以直接分享。");
      }
    } catch {
      setMessage("分享动作已取消。");
    }
  }

  async function handleWeeklyReview() {
    if (!report) return;
    setMessage("");
    try {
      const review = await api.generateWeeklyReview(report.report_id);
      startTransition(() => {
        router.push(`/reports/${review.report_id}`);
      });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "周度复盘暂时无法生成，请稍后重试。");
    }
  }

  async function handleFeedback(type: string) {
    if (!report) return;
    try {
      const result = await api.createFeedback({ report_id: report.report_id, feedback_type: type });
      setFeedbackState(type);
      setMessage(`反馈已记录：${result.feedback.feedback_label}。系统会在后续解释和质量评估中参考这条反馈。`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "反馈暂时无法提交，请稍后重试。");
    }
  }

  if (!report) {
    return (
      <div className="page-shell">
        <div className="report-frame rounded-[28px] p-8">
          <p className="text-sm text-slate-600">{message || "报告加载中..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      {message ? <div className="mb-5 rounded-xl bg-pineSoft px-4 py-3 text-sm text-pine">{message}</div> : null}

      <section className="report-frame rounded-[30px] p-6 md:p-8">
        <div className="flex flex-col gap-5 border-b border-[rgba(23,34,47,0.08)] pb-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="small-label">{analysisTypeLabel(report.report_type)}</span>
              <span className="rounded-full bg-pineSoft px-3 py-1 text-xs font-bold text-pine">{qualityStatusLabel(report.quality_status.status)}</span>
              <span className="rounded-full bg-[rgba(183,134,63,0.12)] px-3 py-1 text-xs font-bold text-[#8a6425]">
                {report.boundary_check_result.status === "passed" ? "边界检查通过" : "边界检查提示"}
              </span>
            </div>
            <h1 className="mt-3 font-[var(--heading-font)] text-4xl font-bold leading-[1.05] text-ink md:text-[54px]">{report.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">{report.summary}</p>
            <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-600">
              <span>生成时间：{shortDateTime(report.generated_at)}</span>
              <span>数据日期：{report.data_date}</span>
              <span>持仓数量：{report.position_count}</span>
            </div>
          </div>

          <div className="grid min-w-[220px] gap-3">
            <button type="button" onClick={handleShare} className="h-11 rounded-full border border-[rgba(23,34,47,0.12)] bg-white px-5 text-sm font-bold text-ink">
              复制或分享报告
            </button>
            <button
              type="button"
              onClick={handleWeeklyReview}
              disabled={isPending}
              className="h-11 rounded-full bg-pine px-5 text-sm font-bold text-white disabled:bg-slate-300"
            >
              {isPending ? "生成中" : "生成周度复盘"}
            </button>
            <Link href="/history" className="flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-bold text-white">
              查看历史回看
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <MetricCard label="组合健康度" value={score(report.health_score)} note={riskLabel(report.risk_level)} />
          <MetricCard label="用户匹配度" value={score(report.fit_score)} note="结合投资 DNA" />
          <MetricCard
            label="质量状态"
            value={`${report.quality_status.quality_score} / 5`}
            note={report.boundary_check_result.status === "passed" ? "解释可用" : "需留意边界提示"}
          />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/74 p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="section-title">评分与摘要</h2>
              <button
                type="button"
                onClick={() => setShowEvidence((value) => !value)}
                className="rounded-full border border-[rgba(23,34,47,0.12)] px-4 py-2 text-xs font-bold text-ink"
              >
                {showEvidence ? "收起依据" : "为什么这么说"}
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {report.score_items.map((item) => (
                <div key={item.key} className="rounded-2xl bg-[rgba(244,238,228,0.9)] px-4 py-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-ink">{item.name}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.explanation}</p>
                    </div>
                    <div className="font-[var(--heading-font)] text-3xl font-bold text-ink">{item.score}</div>
                  </div>
                  {showEvidence ? <EvidenceList title="依据" items={item.evidence} className="mt-4" /> : null}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/74 p-5">
            <h2 className="section-title">重点关注事项</h2>
            <div className="mt-4 grid gap-3">
              {report.watch_items.map((item) => (
                <WatchCard key={item.title} item={item} showEvidence={showEvidence} />
              ))}
            </div>
            {!!report.duplicate_exposure.length && (
              <div className="mt-4 rounded-2xl border border-[rgba(23,34,47,0.08)] bg-[rgba(33,76,68,0.05)] px-4 py-4">
                <div className="small-label">重复暴露提示</div>
                {report.duplicate_exposure.map((item) => (
                  <div key={item.theme} className="mt-3 text-sm leading-7 text-slate-700">
                    <strong className="text-ink">{item.theme}</strong>：{item.assets.join("、")}。{item.note}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/74 p-5">
            <h2 className="section-title">暴露分布</h2>
            <div className="mt-4 grid gap-4">
              {Object.entries(exposureGroups).map(([category, items]) => (
                <div key={category} className="rounded-2xl bg-[rgba(244,238,228,0.9)] p-4">
                  <div className="small-label">{categoryLabel(category)}</div>
                  <div className="mt-3 grid gap-3">
                    {items.map((item) => (
                      <div key={`${category}-${item.name}`} className="grid gap-2">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold text-ink">{item.name}</span>
                          <span className="text-slate-600">{percent(item.weight)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[rgba(23,34,47,0.08)]">
                          <div className="h-full rounded-full bg-pine" style={{ width: `${Math.min(100, item.weight * 100)}%` }} />
                        </div>
                        <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                        {showEvidence ? <EvidenceList title="依据" items={item.evidence} /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/74 p-5">
            <h2 className="section-title">中文解释</h2>
            <div className="mt-4 rounded-2xl bg-[rgba(244,238,228,0.9)] p-4">
              <p className="text-base font-semibold leading-7 text-ink">{report.explanation.short_summary}</p>
              <p className="mt-4 text-sm leading-7 text-slate-700">{report.explanation.detailed_explanation}</p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ListBlock title="前提假设" items={report.explanation.assumptions} />
              <ListBlock title="数据说明" items={report.explanation.data_notes} />
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-[rgba(23,34,47,0.12)] px-4 py-4 text-sm leading-7 text-slate-600">
              Prompt 版本：{report.prompt_version} · 模型版本：{report.model_version}
            </div>
          </section>
        </div>

        {showEvidence ? (
          <section className="mt-6 rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/74 p-5">
            <div className="flex flex-col gap-2">
              <h2 className="section-title">依据与追溯链路</h2>
              <p className="text-sm leading-7 text-slate-600">
                这部分保留了输入、结构化计算、历史上下文和边界检查结果，用来回答“为什么这么说”。
              </p>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <ListBlock
                title="边界检查结果"
                items={report.boundary_check_result.notes}
                tone={report.boundary_check_result.status === "passed" ? "calm" : "warn"}
              />
              <ListBlock title="质量检查结果" items={report.quality_status.notes} tone="calm" />
            </div>
            <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-slate-100">
              <div className="small-label !text-slate-400">结构化追溯快照</div>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs leading-6">
                {JSON.stringify(
                  {
                    memory_context: report.evidence.memory_context,
                    review_compare: report.evidence.review_compare,
                    agent_trace: report.agent_trace,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </section>
        ) : null}

        <section className="mt-6 rounded-[24px] border border-[rgba(23,34,47,0.08)] bg-white/74 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="section-title">这条解释有帮助吗</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">你的反馈会进入质量评估和后续解释偏好，不会直接替你修改结论。</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                ["helpful", "有帮助"],
                ["confusing", "看不懂"],
                ["inaccurate", "不准确"],
                ["more_depth", "想看更多"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleFeedback(value)}
                  className={`h-11 rounded-full px-5 text-sm font-bold transition ${
                    feedbackState === value ? "bg-pine text-white" : "border border-[rgba(23,34,47,0.12)] bg-white text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </section>

      <FooterNotice />
    </div>
  );
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[22px] border border-[rgba(23,34,47,0.08)] bg-white/74 p-5">
      <div className="small-label">{label}</div>
      <div className="mt-3 font-[var(--heading-font)] text-4xl font-bold text-ink">{value}</div>
      <p className="mt-2 text-sm text-slate-600">{note}</p>
    </div>
  );
}

function WatchCard({ item, showEvidence }: { item: WatchItem; showEvidence: boolean }) {
  const levelTone =
    item.level === "high"
      ? "border-[rgba(170,69,45,0.18)] bg-[rgba(170,69,45,0.06)]"
      : item.level === "medium"
        ? "border-[rgba(183,134,63,0.18)] bg-[rgba(183,134,63,0.08)]"
        : "border-[rgba(33,76,68,0.14)] bg-[rgba(33,76,68,0.06)]";

  return (
    <div className={`rounded-2xl border px-4 py-4 ${levelTone}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{item.title}</h3>
        <span className="text-xs font-bold text-slate-600">{riskLabel(item.level)}</span>
      </div>
      <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
      {showEvidence ? <EvidenceList title="依据" items={item.evidence} className="mt-4" /> : null}
    </div>
  );
}

function EvidenceList({ title, items, className = "" }: { title: string; items: Array<{ description: string }>; className?: string }) {
  return (
    <div className={className}>
      <div className="small-label">{title}</div>
      <ul className="mt-2 grid gap-2">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="rounded-xl bg-white/70 px-3 py-3 text-sm leading-6 text-slate-700">
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListBlock({
  title,
  items,
  tone = "base",
}: {
  title: string;
  items: string[];
  tone?: "base" | "calm" | "warn";
}) {
  const toneClass =
    tone === "warn"
      ? "bg-[rgba(170,69,45,0.06)]"
      : tone === "calm"
        ? "bg-[rgba(33,76,68,0.06)]"
        : "bg-[rgba(244,238,228,0.9)]";

  return (
    <div className={`rounded-2xl p-4 ${toneClass}`}>
      <div className="small-label">{title}</div>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-7 text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    industry: "行业分布",
    style: "风格分布",
    asset_type: "资产类型分布",
  };
  return labels[category] || category;
}

