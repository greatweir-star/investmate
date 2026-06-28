"use client";

import { FormEvent, useState } from "react";
import type { AssetSuggestion } from "@/lib/types";

export function AssetSearchInput({
  defaultKeyword = "",
  suggestions,
  loading,
  onSearch,
  onSelect,
}: {
  defaultKeyword?: string;
  suggestions: AssetSuggestion[];
  loading: boolean;
  onSearch: (keyword: string) => void;
  onSelect: (asset: AssetSuggestion) => void;
}) {
  const [keyword, setKeyword] = useState(defaultKeyword);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed.length >= 2) onSearch(trimmed);
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="输入代码或名称，例如 510300"
          className="h-12 rounded-md border border-line px-4 text-base text-ink"
        />
        <button
          type="submit"
          disabled={keyword.trim().length < 2 || loading}
          className="h-12 rounded-md bg-pine px-5 text-sm font-bold text-white disabled:bg-slate-300"
        >
          {loading ? "搜索中" : "搜索标的"}
        </button>
      </form>
      <div className="mt-4 grid gap-2">
        {suggestions.map((asset) => (
          <button
            key={asset.asset_code}
            type="button"
            onClick={() => onSelect(asset)}
            className="grid rounded-md border border-line bg-slate-50 px-4 py-3 text-left transition hover:border-pine md:grid-cols-[1fr_auto]"
          >
            <span>
              <span className="font-bold text-ink">{asset.asset_name}</span>
              <span className="ml-2 text-sm text-slate-500">{asset.asset_code}</span>
            </span>
            <span className="text-sm text-slate-500">{asset.industry}</span>
          </button>
        ))}
        {!loading && suggestions.length === 0 ? (
          <p className="text-sm text-slate-500">请输入股票、ETF 或指数代码开始分析。</p>
        ) : null}
      </div>
    </section>
  );
}
