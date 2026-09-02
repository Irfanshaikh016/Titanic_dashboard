"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import type { Passenger } from "@/lib/types";
import { survivalRateBy } from "@/lib/data";

const COLORS: Record<string, string> = {
  male: "#316bff",
  female: "#f472b6",
};

export default function GenderChart({ data }: { data: Passenger[] }) {
  const rows = survivalRateBy(data, "Sex").map((r) => ({
    ...r,
    label: r.label === "male" ? "Male" : "Female",
  }));

  return (
    <div className="card h-full">
      <h3 className="card-title mb-2">Survival Rate by Gender</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} unit="%" />
          <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
          <Bar dataKey="rate" radius={[8, 8, 0, 0]} maxBarSize={80}>
            {rows.map((r, i) => (
              <Cell key={i} fill={COLORS[r.label === "Male" ? "male" : "female"]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
