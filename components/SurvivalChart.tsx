"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Passenger } from "@/lib/types";

const COLORS = ["#10b981", "#f43f5e"];

export default function SurvivalChart({ data }: { data: Passenger[] }) {
  const survived = data.filter((p) => p.Survived === 1).length;
  const died = data.length - survived;
  const chartData = [
    { name: "Survived", value: survived },
    { name: "Did Not Survive", value: died },
  ];

  return (
    <div className="card h-full">
      <h3 className="card-title mb-2">Survival Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
