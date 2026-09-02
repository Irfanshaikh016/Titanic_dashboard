"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Item = { href: string; label: string; icon?: React.ReactNode };

export default function Sidebar() {
  const pathname = usePathname() || "/";

  const items: Item[] = [
    { href: "/", label: "Overview", icon: <span className="text-xl">📊</span> },
    { href: "/charts", label: "Charts", icon: <span className="text-xl">📈</span> },
    { href: "/insights", label: "Insights", icon: <span className="text-xl">💡</span> },
    { href: "/passenger-data", label: "Passenger Data", icon: <span className="text-xl">📄</span> },
  ];

  // active if pathname matches or is a nested route under href
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-64 bg-[#071226] text-white p-6 rounded-md">
      <header className="mb-6 flex items-center gap-3">
        <span className="text-2xl">🚢</span>
        <h1 className="font-semibold text-lg">Titanic Analytics</h1>
      </header>

      <nav className="space-y-3">
        {items.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150
                ${active
                  ? "bg-blue-600 text-white ring-2 ring-white/30 shadow-sm"
                  : "text-slate-300 hover:bg-white/5"}`}
            >
              <span>{it.icon}</span>
              <span className="flex-1">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 text-slate-400 text-sm">
        Data: train-selected-columns.csv
        <br />
        891 passengers · cleaned pipeline
      </div>
    </aside>
  );
}
