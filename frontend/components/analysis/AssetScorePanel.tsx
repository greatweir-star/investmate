import { score } from "@/lib/format";
import type { Scores } from "@/lib/types";
import { Panel } from "@/components/ui/Panel";

const scoreItems: Array<{ key: keyof Scores; label: string; help: string }> = [
  { key: "trend", label: "趋势", help: "中低频走势状态" },
  { key: "valuation", label: "估值", help: "估值位置参考" },
  { key: "liquidity", label: "流动性", help: "成交与进出便利度" },
  { key: "risk", label: "风险", help: "波动与不确定性" },
  { key: "fit_to_user", label: "用户匹配", help: "与投资 DNA 的匹配度" },
];

export function AssetScorePanel({ scores }: { scores: Scores | null }) {
  return (
    <Panel title="结构化评分">
      <div className="grid gap-3 md:grid-cols-5">
        {scoreItems.map((item) => (
          <div key={item.key} className="rounded-md border border-line bg-slate-50 p-4">
            <div className="small-label">{item.label}</div>
            <div className="mt-2 text-xl font-extrabold text-ink">{score(scores?.[item.key])}</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{item.help}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
