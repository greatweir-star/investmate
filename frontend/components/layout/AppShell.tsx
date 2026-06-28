"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/assets", label: "标的分析" },
  { href: "/portfolio", label: "持仓分析" },
  { href: "/history", label: "历史记录" },
  { href: "/settings", label: "设置" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-white/90">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex flex-col gap-1">
            <span className="text-[22px] font-extrabold leading-none text-ink">InvestMate</span>
            <span className="text-sm text-muted">AI 投资副驾驶，提供结构化第二意见</span>
          </Link>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    active ? "bg-pine text-white" : "text-slate-700 hover:bg-pineSoft hover:text-pine"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
