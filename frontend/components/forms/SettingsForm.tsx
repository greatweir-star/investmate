"use client";

import type { InvestmentDNA } from "@/lib/types";

const riskOptions = [
  { value: "conservative", label: "稳健" },
  { value: "balanced", label: "均衡" },
  { value: "aggressive", label: "积极" },
];

const explanationOptions = [
  { value: "structured", label: "结构化" },
  { value: "plain", label: "更白话" },
  { value: "review", label: "偏复盘" },
];

export function SettingsForm({
  value,
  onChange,
}: {
  value: InvestmentDNA;
  onChange: (value: InvestmentDNA) => void;
}) {
  function patch(update: Partial<InvestmentDNA>) {
    onChange({ ...value, ...update });
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="section-title">投资 DNA</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="small-label">风险偏好</span>
          <select
            value={value.risk_level}
            onChange={(event) => patch({ risk_level: event.target.value })}
            className="h-11 rounded-md border border-line px-3 text-sm"
          >
            {riskOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="small-label">投资周期</span>
          <select
            value={value.investment_horizon}
            onChange={(event) => patch({ investment_horizon: event.target.value })}
            className="h-11 rounded-md border border-line px-3 text-sm"
          >
            <option value="less_than_1y">1 年以内</option>
            <option value="1-3y">1 到 3 年</option>
            <option value="3y_plus">3 年以上</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="small-label">最大可接受回撤</span>
          <input
            type="number"
            min="0"
            max="80"
            value={Math.round(value.max_drawdown_tolerance * 100)}
            onChange={(event) => patch({ max_drawdown_tolerance: Number(event.target.value) / 100 })}
            className="h-11 rounded-md border border-line px-3 text-sm"
          />
        </label>
        <label className="grid gap-2">
          <span className="small-label">投资经验</span>
          <select
            value={value.experience_level}
            onChange={(event) => patch({ experience_level: event.target.value })}
            className="h-11 rounded-md border border-line px-3 text-sm"
          >
            <option value="beginner">刚开始</option>
            <option value="intermediate">有一定经验</option>
            <option value="advanced">经验较多</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="small-label">解释偏好</span>
          <select
            value={value.explanation_style || "structured"}
            onChange={(event) => patch({ explanation_style: event.target.value })}
            className="h-11 rounded-md border border-line px-3 text-sm"
          >
            {explanationOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="small-label">关注资产</span>
          <input
            value={value.asset_preferences.join(", ")}
            onChange={(event) =>
              patch({
                asset_preferences: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            className="h-11 rounded-md border border-line px-3 text-sm"
          />
        </label>
      </div>
    </section>
  );
}
