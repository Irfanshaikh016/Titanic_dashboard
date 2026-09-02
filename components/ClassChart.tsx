"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Passenger } from "@/lib/types";
import { survivalRateBy } from "@/lib/data";

export default function ClassChart({ data }: { data: Passenger[] }) {
  const rows = survivalRateBy(data, "Pclass")
    .sort((a, b) => Number(a.label) - Number(b.label))
    .map((r) => ({ ...r, label: `Class ${r.label}` }));

  return (
    <div className="card h-full">
      <h3 className="card-title mb-2">Survival Rate by Class</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} unit="%" />
          <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
          <Bar dataKey="rate" fill="#316bff" radius={[8, 8, 0, 0]} maxBarSize={80} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
