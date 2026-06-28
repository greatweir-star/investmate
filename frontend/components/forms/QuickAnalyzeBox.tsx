"use client";

import { FormEvent, useState } from "react";

export function QuickAnalyzeBox({
  defaultKeyword = "",
  placeholder = "输入股票、ETF 或指数代码",
  onSubmit,
}: {
  defaultKeyword?: string;
  placeholder?: string;
  onSubmit: (keyword: string) => void;
}) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const trimmed = keyword.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 2;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmed || tooShort) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <label className="small-label" htmlFor="quick-analyze">
        快速标的分析
      </label>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          id="quick-analyze"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={placeholder}
          className="h-12 rounded-md border border-line bg-white px-4 text-base text-ink"
        />
        <button
          type="submit"
          disabled={!trimmed || tooShort}
          className="h-12 rounded-md bg-pine px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          开始分析
        </button>
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {tooShort ? "请输入有效的代码或名称。" : "输入股票、ETF 或指数代码，开始一次结构化分析。"}
      </p>
    </form>
  );
}
