import { Panel } from "@/components/ui/Panel";

export function FactorList({
  title = "因素列表",
  keyFactors,
  watchFactors,
}: {
  title?: string;
  keyFactors: string[];
  watchFactors: string[];
}) {
  return (
    <Panel title={title}>
      <div className="grid gap-4 md:grid-cols-2">
        <FactorGroup title="关键因素" items={keyFactors} tone="positive" />
        <FactorGroup title="需要关注" items={watchFactors} tone="watch" />
      </div>
    </Panel>
  );
}

function FactorGroup({ title, items, tone }: { title: string; items: string[]; tone: "positive" | "watch" }) {
  const toneClass = tone === "positive" ? "bg-pineSoft text-pine" : "bg-amberSoft text-amber-900";
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-slate-700">{title}</h3>
      {items.length ? (
        <ul className="grid gap-2">
          {items.map((item) => (
            <li key={item} className={`rounded-md px-3 py-2 text-sm leading-6 ${toneClass}`}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">暂无可展示内容。</p>
      )}
    </div>
  );
}
