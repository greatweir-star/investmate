import type { RiskLevel } from "@/lib/types";
import { riskLabel } from "@/lib/format";

const styles: Record<RiskLevel, string> = {
  low: "bg-pineSoft text-pine border-emerald-200",
  medium: "bg-amberSoft text-amber-800 border-amber-200",
  high: "bg-redSoft text-red-700 border-red-200",
  unknown: "bg-slate-100 text-slate-600 border-slate-200",
};

export function StatusPill({ level }: { level?: RiskLevel | string }) {
  const normalized = (level || "unknown") as RiskLevel;
  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${styles[normalized] || styles.unknown}`}>
      {riskLabel(normalized)}
    </span>
  );
}
