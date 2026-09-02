import type { Passenger, FilterState, DataBounds } from "./types";

export const DEFAULT_FILTERS = (bounds: DataBounds): FilterState => ({
  sex: "All",
  pclass: "All",
  survived: "All",
  ageRange: [bounds.minAge, bounds.maxAge],
  fareRange: [bounds.minFare, bounds.maxFare],
  search: "",
});

export function getDataBounds(data: Passenger[]): DataBounds {
  if (data.length === 0) {
    return { minAge: 0, maxAge: 80, minFare: 0, maxFare: 512 };
  }
  const ages = data.map((p) => p.Age ?? 0);
  const fares = data.map((p) => p.Fare);
  return {
    minAge: Math.floor(Math.min(...ages)),
    maxAge: Math.ceil(Math.max(...ages)),
    minFare: Math.floor(Math.min(...fares)),
    maxFare: Math.ceil(Math.max(...fares)),
  };
}

export function applyFilters(data: Passenger[], filters: FilterState): Passenger[] {
  const search = filters.search.trim().toLowerCase();
  return data.filter((p) => {
    if (filters.sex !== "All" && p.Sex !== filters.sex) return false;
    if (filters.pclass !== "All" && p.Pclass !== filters.pclass) return false;
    if (filters.survived !== "All" && p.Survived !== filters.survived) return false;
    const age = p.Age ?? 0;
    if (age < filters.ageRange[0] || age > filters.ageRange[1]) return false;
    if (p.Fare < filters.fareRange[0] || p.Fare > filters.fareRange[1]) return false;
    if (search && !p.Name.toLowerCase().includes(search)) return false;
    return true;
  });
}

export interface KPIs {
  total: number;
  survivors: number;
  deaths: number;
  survivalRate: number;
  avgAge: number;
  avgFare: number;
}

export function computeKPIs(data: Passenger[]): KPIs {
  const total = data.length;
  const survivors = data.filter((p) => p.Survived === 1).length;
  const deaths = total - survivors;
  const survivalRate = total > 0 ? (survivors / total) * 100 : 0;
  const avgAge = total > 0 ? data.reduce((s, p) => s + (p.Age ?? 0), 0) / total : 0;
  const avgFare = total > 0 ? data.reduce((s, p) => s + p.Fare, 0) / total : 0;
  return { total, survivors, deaths, survivalRate, avgAge, avgFare };
}

export function survivalRateBy(data: Passenger[], key: "Sex" | "Pclass"): { label: string; rate: number; count: number }[] {
  const groups = new Map<string, Passenger[]>();
  for (const p of data) {
    const k = String(p[key]);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(p);
  }
  return Array.from(groups.entries())
    .map(([label, rows]) => ({
      label,
      rate: rows.length > 0 ? (rows.filter((r) => r.Survived === 1).length / rows.length) * 100 : 0,
      count: rows.length,
    }))
    .sort((a, b) => (key === "Pclass" ? a.label.localeCompare(b.label) : b.rate - a.rate));
}

export function genderVsSurvival(data: Passenger[]) {
  const sexes: ("male" | "female")[] = ["male", "female"];
  return sexes.map((sex) => {
    const rows = data.filter((p) => p.Sex === sex);
    return {
      sex: sex === "male" ? "Male" : "Female",
      Survived: rows.filter((r) => r.Survived === 1).length,
      "Did Not Survive": rows.filter((r) => r.Survived === 0).length,
    };
  });
}

export function classVsSurvival(data: Passenger[]) {
  return [1, 2, 3].map((pclass) => {
    const rows = data.filter((p) => p.Pclass === pclass);
    return {
      pclass: `Class ${pclass}`,
      Survived: rows.filter((r) => r.Survived === 1).length,
      "Did Not Survive": rows.filter((r) => r.Survived === 0).length,
    };
  });
}

export function ageHistogram(data: Passenger[], binSize = 5) {
  if (data.length === 0) return [];
  const maxAge = Math.max(...data.map((p) => p.Age ?? 0));
  const numBins = Math.ceil((maxAge + 1) / binSize);
  const bins = Array.from({ length: numBins }, (_, i) => ({
    range: `${i * binSize}-${i * binSize + binSize - 1}`,
    Survived: 0,
    "Did Not Survive": 0,
  }));
  for (const p of data) {
    const age = p.Age ?? 0;
    const idx = Math.min(Math.floor(age / binSize), numBins - 1);
    if (p.Survived === 1) bins[idx].Survived += 1;
    else bins[idx]["Did Not Survive"] += 1;
  }
  return bins;
}

export function fareHistogram(data: Passenger[], binSize = 25) {
  if (data.length === 0) return [];
  const maxFare = Math.max(...data.map((p) => p.Fare));
  const numBins = Math.max(1, Math.ceil((maxFare + 1) / binSize));
  const bins = Array.from({ length: numBins }, (_, i) => ({
    range: `${i * binSize}-${i * binSize + binSize - 1}`,
    count: 0,
  }));
  for (const p of data) {
    const idx = Math.min(Math.floor(p.Fare / binSize), numBins - 1);
    bins[idx].count += 1;
  }
  return bins;
}

export function familySizeAnalysis(data: Passenger[]) {
  const groups = new Map<number, Passenger[]>();
  for (const p of data) {
    if (!groups.has(p.FamilySize)) groups.set(p.FamilySize, []);
    groups.get(p.FamilySize)!.push(p);
  }
  return Array.from(groups.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([size, rows]) => ({
      familySize: size,
      survivalRate: rows.length > 0 ? (rows.filter((r) => r.Survived === 1).length / rows.length) * 100 : 0,
      count: rows.length,
    }));
}

export function generateInsights(data: Passenger[]): string[] {
  const insights: string[] = [];
  if (data.length === 0) {
    return ["No passengers match the current filters. Try widening your filter selection."];
  }

  const bySex = survivalRateBy(data, "Sex");
  const female = bySex.find((s) => s.label === "female");
  const male = bySex.find((s) => s.label === "male");
  if (female && male) {
    const higher = female.rate >= male.rate ? "Female" : "Male";
    const lower = higher === "Female" ? "Male" : "Female";
    const higherRate = higher === "Female" ? female.rate : male.rate;
    const lowerRate = higher === "Female" ? male.rate : female.rate;
    insights.push(
      `${higher} passengers had a higher survival rate (${higherRate.toFixed(1)}%) than ${lower.toLowerCase()} passengers (${lowerRate.toFixed(1)}%).`
    );
  }

  const byClass = survivalRateBy(data, "Pclass").sort((a, b) => Number(a.label) - Number(b.label));
  if (byClass.length >= 2) {
    const first = byClass.find((c) => c.label === "1");
    const third = byClass.find((c) => c.label === "3");
    if (first && third) {
      insights.push(
        `First-class passengers survived at ${first.rate.toFixed(1)}% compared to ${third.rate.toFixed(1)}% for third-class passengers.`
      );
    }
  }

  const kpis = computeKPIs(data);
  insights.push(
    `The current filtered dataset contains ${kpis.total} passenger${kpis.total === 1 ? "" : "s"}, with an overall survival rate of ${kpis.survivalRate.toFixed(1)}%.`
  );

  const fam = familySizeAnalysis(data).filter((f) => f.count >= 3);
  if (fam.length > 0) {
    const best = fam.reduce((a, b) => (b.survivalRate > a.survivalRate ? b : a));
    insights.push(
      `Passengers travelling with a family size of ${best.familySize} had the highest survival rate among sizeable groups, at ${best.survivalRate.toFixed(1)}%.`
    );
  }

  const avgFareSurvived = data.filter((p) => p.Survived === 1).reduce((s, p, _, arr) => s + p.Fare / arr.length, 0);
  const avgFareDied = data.filter((p) => p.Survived === 0).reduce((s, p, _, arr) => s + p.Fare / (arr.length || 1), 0);
  if (avgFareSurvived > 0 || avgFareDied > 0) {
    insights.push(
      `Survivors paid an average fare of $${avgFareSurvived.toFixed(2)}, versus $${avgFareDied.toFixed(2)} for those who did not survive.`
    );
  }

  return insights;
}

export function toCsv(data: Passenger[]): string {
  const headers = ["PassengerId", "Name", "Sex", "Age", "Pclass", "Fare", "SibSp", "Parch", "Survived", "FamilySize"];
  const rows = data.map((p) =>
    [
      p.PassengerId,
      `"${p.Name.replace(/"/g, '""')}"`,
      p.Sex,
      p.Age?.toFixed(2) ?? "",
      p.Pclass,
      p.Fare.toFixed(2),
      p.SibSp,
      p.Parch,
      p.Survived,
      p.FamilySize,
    ].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
