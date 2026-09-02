"use client";

import { useMemo, useState } from "react";
import type { Passenger, FilterState } from "@/lib/types";
import { applyFilters, computeKPIs, getDataBounds, DEFAULT_FILTERS } from "@/lib/data";

import Sidebar from "@/components/Sidebar";
import KPICards from "@/components/KPICards";
import Filters from "@/components/Filters";
import SurvivalChart from "@/components/SurvivalChart";
import GenderChart from "@/components/GenderChart";
import ClassChart from "@/components/ClassChart";
import AgeChart from "@/components/AgeChart";
import FareChart from "@/components/FareChart";
import GenderSurvivalChart from "@/components/GenderSurvivalChart";
import ClassSurvivalChart from "@/components/ClassSurvivalChart";
import FamilyChart from "@/components/FamilyChart";
import Insights from "@/components/Insights";
import PassengerTable from "@/components/PassengerTable";

export default function Dashboard({ initialData }: { initialData: Passenger[] }) {
  const [active, setActive] = useState("overview");
  const bounds = useMemo(() => getDataBounds(initialData), [initialData]);
  const [filters, setFilters] = useState<FilterState>(() => DEFAULT_FILTERS(bounds));

  const filteredData = useMemo(() => applyFilters(initialData, filters), [initialData, filters]);
  const kpis = useMemo(() => computeKPIs(filteredData), [filteredData]);

  if (initialData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold text-gray-900 mb-2">No data found</h1>
          <p className="text-sm text-gray-500">
            Could not load <code className="bg-gray-100 px-1 rounded">public/data/train-selected-columns.csv</code>.
            Make sure the file exists at that path and redeploy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f6f7fb]">
      <Sidebar active={active} onNavigate={setActive} />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Titanic Survival Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Interactive analysis of passenger survival patterns</p>
        </header>

        <section id="overview" className="space-y-6">
          <KPICards kpis={kpis} />
          <Filters
            filters={filters}
            bounds={bounds}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS(bounds))}
          />
        </section>

        <section id="charts" className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SurvivalChart data={filteredData} />
            <GenderChart data={filteredData} />
            <ClassChart data={filteredData} />
            <AgeChart data={filteredData} />
            <FareChart data={filteredData} />
            <GenderSurvivalChart data={filteredData} />
            <ClassSurvivalChart data={filteredData} />
            <FamilyChart data={filteredData} />
          </div>
        </section>

        <section id="insights">
          <Insights data={filteredData} />
        </section>

        <section id="table" className="pb-10">
          <PassengerTable data={filteredData} />
        </section>
      </main>
    </div>
  );
}
