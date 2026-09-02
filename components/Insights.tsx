import type { Passenger } from "@/lib/types";
import { generateInsights } from "@/lib/data";

export default function Insights({ data }: { data: Passenger[] }) {
  const insights = generateInsights(data);

  return (
    <div className="card">
      <h3 className="card-title mb-3">Dynamic Insights</h3>
      <ul className="space-y-3">
        {insights.map((text, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 text-xs font-bold">
              {i + 1}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
