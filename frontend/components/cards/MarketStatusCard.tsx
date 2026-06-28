import { score } from "@/lib/format";
import type { MarketStatus } from "@/lib/types";
import { Panel } from "@/components/ui/Panel";
import { StatusPill } from "@/components/ui/StatusPill";

export function MarketStatusCard({ status }: { status: MarketStatus | null }) {
  if (!status) {
    return (
      <Panel title="市场状态">
        <p className="text-sm text-slate-600">暂无市场状态数据。请先完成数据同步。</p>
      </Panel>
    );
  }

  return (
    <Panel title="市场状态">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-pineSoft px-3 py-1 text-sm font-bold text-pine">{status.market_state}</span>
            <StatusPill level={status.risk_level} />
          </div>
          <p className="text-base leading-7 text-slate-700">{status.summary}</p>
        </div>
        <div className="rounded-md bg-slate-50 px-4 py-3 text-right">
          <div className="small-label">市场评分</div>
          <div className="metric-value">{score(status.market_score)}</div>
        </div>
      </div>
      <ul className="mt-5 grid gap-2 text-sm leading-6 text-slate-700">
        {status.key_factors.map((item) => (
          <li key={item} className="rounded-md bg-slate-50 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-500">数据日期：{status.data_date}</p>
    </Panel>
  );
}
