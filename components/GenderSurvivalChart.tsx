"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Passenger } from "@/lib/types";
import { genderVsSurvival } from "@/lib/data";

export default function GenderSurvivalChart({ data }: { data: Passenger[] }) {
  const rows = genderVsSurvival(data);

  return (
    <div className="card h-full">
      <h3 className="card-title mb-2">Gender vs Survival</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
          <XAxis dataKey="sex" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Survived" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
          <Bar dataKey="Did Not Survive" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
