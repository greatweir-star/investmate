import { confidenceLabel } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";

export function ExplanationPanel({
  summary,
  explanation,
  confidence,
  dataDate,
}: {
  summary?: string;
  explanation?: string;
  confidence?: number;
  dataDate?: string;
}) {
  return (
    <Panel title="中文解释">
      {summary || explanation ? (
        <div className="grid gap-4">
          <p className="text-base font-semibold leading-7 text-ink">{summary}</p>
          <p className="text-sm leading-7 text-slate-700">{explanation}</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span>置信度：{confidenceLabel(confidence)}</span>
            <span>数据日期：{dataDate || "--"}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-600">暂无解释内容。</p>
      )}
    </Panel>
  );
}
