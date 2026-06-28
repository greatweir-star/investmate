"use client";

import type { Position } from "@/lib/types";
import { percent } from "@/lib/format";

const emptyPosition: Position = {
  asset_code: "",
  asset_name: "",
  weight: 0.1,
  cost_price: null,
  note: "",
};

export function PositionEditor({
  positions,
  onChange,
}: {
  positions: Position[];
  onChange: (positions: Position[]) => void;
}) {
  const totalWeight = positions.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  const overWeight = totalWeight > 1;

  function update(index: number, patch: Partial<Position>) {
    onChange(positions.map((item, current) => (current === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    onChange(positions.filter((_, current) => current !== index));
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="section-title">持仓录入</h2>
          <p className="mt-1 text-sm text-slate-600">MVP 阶段只支持手动录入，比例按组合权重填写。</p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...positions, { ...emptyPosition }])}
          className="h-10 rounded-md border border-pine px-4 text-sm font-bold text-pine"
        >
          新增持仓
        </button>
      </div>
      <div className="grid gap-3">
        {positions.map((position, index) => (
          <div key={index} className="grid gap-3 rounded-md border border-line bg-slate-50 p-3 md:grid-cols-[1fr_1fr_120px_120px_1fr_auto]">
            <input
              aria-label="标的代码"
              value={position.asset_code}
              onChange={(event) => update(index, { asset_code: event.target.value.toUpperCase() })}
              placeholder="代码"
              className="h-10 rounded-md border border-line px-3 text-sm"
            />
            <input
              aria-label="标的名称"
              value={position.asset_name}
              onChange={(event) => update(index, { asset_name: event.target.value })}
              placeholder="名称"
              className="h-10 rounded-md border border-line px-3 text-sm"
            />
            <input
              aria-label="持仓比例"
              type="number"
              min="0"
              step="1"
              value={Math.round((position.weight || 0) * 100)}
              onChange={(event) => update(index, { weight: Number(event.target.value) / 100 })}
              className="h-10 rounded-md border border-line px-3 text-sm"
            />
            <input
              aria-label="成本价"
              type="number"
              min="0"
              step="0.01"
              value={position.cost_price ?? ""}
              onChange={(event) => update(index, { cost_price: event.target.value ? Number(event.target.value) : null })}
              placeholder="成本价"
              className="h-10 rounded-md border border-line px-3 text-sm"
            />
            <input
              aria-label="备注"
              value={position.note || ""}
              onChange={(event) => update(index, { note: event.target.value })}
              placeholder="备注"
              className="h-10 rounded-md border border-line px-3 text-sm"
            />
            <button type="button" onClick={() => remove(index)} className="h-10 rounded-md px-3 text-sm font-bold text-red-700">
              删除
            </button>
          </div>
        ))}
      </div>
      <div className={`mt-4 rounded-md px-3 py-2 text-sm ${overWeight ? "bg-redSoft text-red-700" : "bg-pineSoft text-pine"}`}>
        当前录入比例合计：{percent(totalWeight)}。{overWeight ? "合计超过 100%，请检查比例口径。" : "可以小于 100%，未录入部分视为现金或其他资产。"}
      </div>
    </section>
  );
}
