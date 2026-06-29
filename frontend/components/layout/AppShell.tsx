"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/assets", label: "标的分析" },
  { href: "/portfolio", label: "持仓体检" },
  { href: "/history", label: "历史记录" },
  { href: "/settings", label: "设置" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex flex-col gap-1">
            <span className="font-[var(--heading-font)] text-[26px] font-bold leading-none text-ink">InvestMate</span>
            <span className="text-sm text-muted">把持仓体检、解释追溯和周度复盘放进同一个 AI 工作流</span>
          </Link>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href === "/history" && pathname.startsWith("/reports/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
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
