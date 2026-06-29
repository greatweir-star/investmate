import { analysisTypeLabel, confidenceLabel, qualityStatusLabel, shortDateTime } from "@/lib/format";
import type { HistoryRecord } from "@/lib/types";

export function HistoryTable({
  records,
  onSelect,
}: {
  records: HistoryRecord[];
  onSelect: (analysisId: string) => void;
}) {
  if (!records.length) {
    return (
      <div className="rounded-[24px] border border-line bg-white/80 p-6 text-sm leading-6 text-slate-600 shadow-soft">
        暂无历史报告。完成一次持仓体检或周度复盘后，记录会显示在这里。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-line bg-white/86 shadow-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold text-slate-500">
          <tr>
            <th className="px-4 py-3">时间</th>
            <th className="px-4 py-3">类型</th>
            <th className="px-4 py-3">报告</th>
            <th className="px-4 py-3">摘要</th>
            <th className="px-4 py-3">置信度</th>
            <th className="px-4 py-3">质量</th>
            <th className="px-4 py-3">数据日期</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.analysis_id}
              onClick={() => onSelect(record.analysis_id)}
              className="cursor-pointer border-t border-line transition hover:bg-pineSoft"
            >
              <td className="px-4 py-3 text-slate-600">{shortDateTime(record.created_at)}</td>
              <td className="px-4 py-3 font-semibold text-ink">{analysisTypeLabel(record.analysis_type)}</td>
              <td className="px-4 py-3 text-slate-700">{record.target_name}</td>
              <td className="max-w-[360px] px-4 py-3 leading-6 text-slate-600">{record.summary}</td>
              <td className="px-4 py-3 text-slate-600">{confidenceLabel(record.confidence)}</td>
              <td className="px-4 py-3 text-slate-600">{qualityStatusLabel(record.quality_status)}</td>
              <td className="px-4 py-3 text-slate-600">{record.data_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
