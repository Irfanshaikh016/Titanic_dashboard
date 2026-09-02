"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Passenger } from "@/lib/types";
import { ageHistogram } from "@/lib/data";

export default function AgeChart({ data }: { data: Passenger[] }) {
  const rows = ageHistogram(data, 5);

  return (
    <div className="card h-full">
      <h3 className="card-title mb-2">Age Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
          <XAxis dataKey="range" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Survived" stackId="a" fill="#10b981" />
          <Bar dataKey="Did Not Survive" stackId="a" fill="#f43f5e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
