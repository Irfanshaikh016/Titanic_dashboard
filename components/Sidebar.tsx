"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "charts", label: "Charts", icon: "📈" },
  { id: "insights", label: "Insights", icon: "💡" },
  { id: "table", label: "Passenger Data", icon: "🧾" },
];

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-[#0b1220] px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center gap-2 text-white font-bold">
          <span className="text-xl">🚢</span>
          <span>Titanic Analytics</span>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-white p-2 rounded-md hover:bg-white/10"
          aria-label="Toggle navigation"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <aside
        className={`bg-[#0b1220] text-gray-300 w-full lg:w-64 lg:min-h-screen lg:sticky lg:top-0 flex-shrink-0 ${
          open ? "block" : "hidden"
        } lg:block`}
      >
        <div className="hidden lg:flex items-center gap-2 px-6 py-6 text-white font-bold text-lg">
          <span className="text-2xl">🚢</span>
          <span>Titanic Analytics</span>
        </div>

        <nav className="px-3 py-4 lg:py-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === item.id
                  ? "bg-brand-600 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden lg:block px-6 py-4 mt-auto text-xs text-gray-500 border-t border-white/5">
          Data: train-selected-columns.csv
          <br />
          891 passengers · cleaned pipeline
        </div>
      </aside>
    </>
  );
}
