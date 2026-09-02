"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Bar, ComposedChart } from "recharts";
import type { Passenger } from "@/lib/types";
import { familySizeAnalysis } from "@/lib/data";

export default function FamilyChart({ data }: { data: Passenger[] }) {
  const rows = familySizeAnalysis(data);

  return (
    <div className="card h-full">
      <h3 className="card-title mb-2">Family Size vs Survival Rate</h3>
      <p className="text-xs text-gray-400 mb-1">FamilySize = SibSp + Parch + 1</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
          <XAxis dataKey="familySize" tick={{ fontSize: 12 }} label={{ value: "Family Size", position: "insideBottom", offset: -2, fontSize: 11 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} unit="%" />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Bar yAxisId="right" dataKey="count" fill="#dbeafe" name="Passenger Count" radius={[4, 4, 0, 0]} />
          <Line yAxisId="left" type="monotone" dataKey="survivalRate" stroke="#316bff" strokeWidth={2.5} dot={{ r: 3 }} name="Survival Rate (%)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
