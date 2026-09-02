"use client";

import { useMemo, useState } from "react";
import type { Passenger } from "@/lib/types";
import { toCsv } from "@/lib/data";

type SortKey = keyof Pick<
  Passenger,
  "PassengerId" | "Name" | "Sex" | "Age" | "Pclass" | "Fare" | "SibSp" | "Parch" | "Survived"
>;

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "PassengerId", label: "ID" },
  { key: "Name", label: "Name" },
  { key: "Sex", label: "Sex" },
  { key: "Age", label: "Age" },
  { key: "Pclass", label: "Class" },
  { key: "Fare", label: "Fare" },
  { key: "SibSp", label: "SibSp" },
  { key: "Parch", label: "Parch" },
  { key: "Survived", label: "Survived" },
];

const PAGE_SIZE = 10;

export default function PassengerTable({ data }: { data: Passenger[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("PassengerId");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (p) => p.Name.toLowerCase().includes(q) || p.Ticket.toLowerCase().includes(q)
    );
  }, [data, query]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null) return 1;
      if (bv === null) return -1;
      if (typeof av === "string" && typeof bv === "string") {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortAsc ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
    return copy;
  }, [filtered, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  }

  function handleDownload() {
    const csv = toCsv(sorted);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "titanic-filtered-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-base font-semibold text-gray-900">Passenger Details</h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search name or ticket..."
            className="select-input sm:w-64"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <button onClick={handleDownload} className="btn-primary whitespace-nowrap" disabled={sorted.length === 0}>
            ⬇ Download CSV
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">
          No passengers match your filters. Try adjusting the filters above.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-5 py-2 font-semibold cursor-pointer select-none hover:text-gray-700 whitespace-nowrap"
                    >
                      {col.label}
                      {sortKey === col.key && <span className="ml-1">{sortAsc ? "▲" : "▼"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((p) => (
                  <tr key={p.PassengerId} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-2.5 text-gray-500">{p.PassengerId}</td>
                    <td className="px-5 py-2.5 font-medium text-gray-900 whitespace-nowrap">{p.Name}</td>
                    <td className="px-5 py-2.5 capitalize text-gray-600">{p.Sex}</td>
                    <td className="px-5 py-2.5 text-gray-600">{p.Age?.toFixed(0) ?? "—"}</td>
                    <td className="px-5 py-2.5 text-gray-600">{p.Pclass}</td>
                    <td className="px-5 py-2.5 text-gray-600">${p.Fare.toFixed(2)}</td>
                    <td className="px-5 py-2.5 text-gray-600">{p.SibSp}</td>
                    <td className="px-5 py-2.5 text-gray-600">{p.Parch}</td>
                    <td className="px-5 py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          p.Survived === 1 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {p.Survived === 1 ? "Survived" : "Did Not Survive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)} of{" "}
              {sorted.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Prev
              </button>
              <span className="text-xs font-medium">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
