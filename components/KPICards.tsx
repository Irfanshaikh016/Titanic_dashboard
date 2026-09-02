import type { KPIs } from "@/lib/data";

function Card({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <p className="card-title">{title}</p>
        <span className={`h-2 w-2 rounded-full ${accent}`} />
      </div>
      <p className="kpi-value">{value}</p>
    </div>
  );
}

export default function KPICards({ kpis }: { kpis: KPIs }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card title="Total Passengers" value={kpis.total.toLocaleString()} accent="bg-brand-500" />
      <Card title="Survivors" value={kpis.survivors.toLocaleString()} accent="bg-emerald-500" />
      <Card title="Deaths" value={kpis.deaths.toLocaleString()} accent="bg-rose-500" />
      <Card title="Survival Rate" value={`${kpis.survivalRate.toFixed(1)}%`} accent="bg-amber-500" />
      <Card title="Average Age" value={kpis.avgAge.toFixed(1)} accent="bg-violet-500" />
      <Card title="Average Fare" value={`$${kpis.avgFare.toFixed(2)}`} accent="bg-sky-500" />
    </div>
  );
}
