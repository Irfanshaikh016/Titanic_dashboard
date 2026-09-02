"use client";

import type { FilterState, DataBounds } from "@/lib/types";

export default function Filters({
  filters,
  bounds,
  onChange,
  onReset,
}: {
  filters: FilterState;
  bounds: DataBounds;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Reset all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div>
          <label className="label-text">Gender</label>
          <select
            className="select-input"
            value={filters.sex}
            onChange={(e) => onChange({ ...filters, sex: e.target.value as FilterState["sex"] })}
          >
            <option value="All">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="label-text">Passenger Class</label>
          <select
            className="select-input"
            value={filters.pclass}
            onChange={(e) =>
              onChange({
                ...filters,
                pclass: e.target.value === "All" ? "All" : (Number(e.target.value) as 1 | 2 | 3),
              })
            }
          >
            <option value="All">All</option>
            <option value="1">1st Class</option>
            <option value="2">2nd Class</option>
            <option value="3">3rd Class</option>
          </select>
        </div>

        <div>
          <label className="label-text">Survival</label>
          <select
            className="select-input"
            value={filters.survived}
            onChange={(e) =>
              onChange({
                ...filters,
                survived: e.target.value === "All" ? "All" : (Number(e.target.value) as 0 | 1),
              })
            }
          >
            <option value="All">All</option>
            <option value="1">Survived</option>
            <option value="0">Did Not Survive</option>
          </select>
        </div>

        <div>
          <label className="label-text">
            Age Range: {filters.ageRange[0]} – {filters.ageRange[1]}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={bounds.minAge}
              max={bounds.maxAge}
              value={filters.ageRange[0]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  ageRange: [Math.min(Number(e.target.value), filters.ageRange[1]), filters.ageRange[1]],
                })
              }
              className="w-full accent-brand-600"
            />
            <input
              type="range"
              min={bounds.minAge}
              max={bounds.maxAge}
              value={filters.ageRange[1]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  ageRange: [filters.ageRange[0], Math.max(Number(e.target.value), filters.ageRange[0])],
                })
              }
              className="w-full accent-brand-600"
            />
          </div>
        </div>

        <div>
          <label className="label-text">
            Fare Range: ${filters.fareRange[0]} – ${filters.fareRange[1]}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={bounds.minFare}
              max={bounds.maxFare}
              value={filters.fareRange[0]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  fareRange: [Math.min(Number(e.target.value), filters.fareRange[1]), filters.fareRange[1]],
                })
              }
              className="w-full accent-brand-600"
            />
            <input
              type="range"
              min={bounds.minFare}
              max={bounds.maxFare}
              value={filters.fareRange[1]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  fareRange: [filters.fareRange[0], Math.max(Number(e.target.value), filters.fareRange[0])],
                })
              }
              className="w-full accent-brand-600"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Search by Name</label>
          <input
            type="text"
            placeholder="e.g. Braund"
            className="select-input"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
