import { Suspense } from "react";
import { AssetsClient } from "./AssetsClient";

export default function AssetsPage() {
  return (
    <Suspense fallback={<div className="page-shell text-sm text-slate-600">正在准备标的分析页面...</div>}>
      <AssetsClient />
    </Suspense>
  );
}
