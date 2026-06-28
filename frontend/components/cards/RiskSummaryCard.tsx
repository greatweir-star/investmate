import type { MarketStatus } from "@/lib/types";
import { Panel } from "@/components/ui/Panel";
import { StatusPill } from "@/components/ui/StatusPill";

export function RiskSummaryCard({ status }: { status: MarketStatus | null }) {
  return (
    <Panel title="风险摘要" action={status ? <StatusPill level={status.risk_level} /> : null}>
      {status ? (
        <>
          <ul className="grid gap-2 text-sm leading-6 text-slate-700">
            {status.risk_factors.map((item) => (
              <li key={item} className="rounded-md bg-amberSoft px-3 py-2 text-amber-900">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-slate-600">{status.explanation}</p>
        </>
      ) : (
        <p className="text-sm text-slate-600">数据暂时无法加载，请稍后重试。</p>
      )}
    </Panel>
  );
}
