import { percent, score } from "@/lib/format";
import type { ReportDetail } from "@/lib/types";
import { Panel } from "@/components/ui/Panel";
import { StatusPill } from "@/components/ui/StatusPill";

export function PortfolioPanel({ analysis }: { analysis: ReportDetail | null }) {
  if (!analysis) {
    return (
      <Panel title="组合概览">
        <p className="text-sm text-slate-600">请先录入你的持仓，系统会帮助你查看组合结构。</p>
      </Panel>
    );
  }

  return (
    <Panel title="组合概览" action={<StatusPill level={analysis.risk_level} />}>
      <p className="text-base font-semibold leading-7 text-ink">{analysis.summary}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Metric label="组合健康度" value={score(analysis.health_score)} />
        <Metric label="用户匹配度" value={score(analysis.fit_score)} />
        <Metric label="持仓数量" value={`${analysis.position_count}`} />
        <Metric label="录入比例" value={percent(analysis.position_input.reduce((sum, item) => sum + item.weight, 0))} />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Exposure title="行业或主题分布" data={analysis.exposure_items.filter((item) => item.category === "industry")} />
        <Exposure title="风格暴露" data={analysis.exposure_items.filter((item) => item.category === "style")} />
      </div>
      {analysis.duplicate_exposure.length ? (
        <div className="mt-5 rounded-md bg-amberSoft px-4 py-3 text-sm leading-6 text-amber-900">
          {analysis.duplicate_exposure[0].note}
        </div>
      ) : null}
    </Panel>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-md border border-line bg-slate-50 p-4">
      <div className="small-label">{label}</div>
      <div className="mt-2 text-xl font-extrabold text-ink">{value}</div>
      {detail ? <div className="mt-1 text-xs text-slate-500">{detail}</div> : null}
    </div>
  );
}

function Exposure({
  title,
  data,
}: {
  title: string;
  data: Array<{ name: string; weight: number }>;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-slate-700">{title}</h3>
      <div className="grid gap-2">
        {data.map((item) => (
          <div key={`${item.name}-${item.weight}`} className="rounded-md bg-slate-50 px-3 py-2">
            <div className="mb-2 flex justify-between text-sm text-slate-700">
              <span>{item.name || "未分类"}</span>
              <span>{percent(item.weight)}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-pine" style={{ width: `${Math.min(item.weight * 100, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
