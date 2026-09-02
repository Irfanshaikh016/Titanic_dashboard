"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Item = { href: string; label: string; icon?: React.ReactNode };

type SidebarProps = {
  active?: string;
  onNavigate?: React.Dispatch<React.SetStateAction<string>>;
};

export default function Sidebar({ active: activeProp, onNavigate }: SidebarProps) {
  // Prefer the explicitly provided `active` prop (used by some parent components).
  // Fall back to the router pathname when `active` isn't provided.
  const pathname = usePathname();
  const activeFromPath = pathname || "/";
  const active = activeProp ?? activeFromPath;

  const items: Item[] = [
    { href: "/", label: "Overview", icon: <span className="text-xl">📊</span> },
    { href: "/charts", label: "Charts", icon: <span className="text-xl">📈</span> },
    { href: "/insights", label: "Insights", icon: <span className="text-xl">💡</span> },
    { href: "/passenger-data", label: "Passenger Data", icon: <span className="text-xl">📄</span> },
  ];

  // active if `active` matches or is a nested route under href
  const isActive = (href: string) =>
    href === "/" ? active === "/" : active === href || active.startsWith(href + "/");

  return (
    <aside className="w-64 bg-[#071226] text-white p-6 rounded-md">
      <header className="mb-6 flex items-center gap-3">
        <span className="text-2xl">🚢</span>
        <h1 className="font-semibold text-lg">Titanic Analytics</h1>
      </header>

      <nav className="space-y-3">
        {items.map((it) => {
          const activeItem = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => {
                if (onNavigate) onNavigate(it.href);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150
                ${activeItem ? "bg-blue-600 text-white ring-2 ring-white/30 shadow-sm" : "text-slate-300 hover:bg-white/5"}`}
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
