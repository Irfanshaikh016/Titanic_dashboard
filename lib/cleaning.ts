import Papa from "papaparse";
import type { Passenger, RawPassenger } from "./types";

/**
 * This module reimplements — line for line in intent — the cleaning logic
 * from the original Python notebook, since Python cannot run natively in a
 * Next.js/Vercel frontend:
 *
 *   df = df.drop_duplicates()                                  -> dedupeRows()
 *   df["Age"] = df["Age"].fillna(df["Age"].mean())              -> (superseded below)
 *   df["Name"] = df["Name"].str.strip()                         -> trim Name
 *   median_age = df["Age"].median()
 *   df["Age"] = df["Age"].fillna(median_age)                    -> fillAgeWithMedian()
 *
 * In the original script the median fill runs *after* the mean fill, so the
 * median value is what actually ends up in every previously-missing Age
 * cell. We reproduce that end result directly: missing Age -> median Age.
 *
 * We additionally derive FamilySize = SibSp + Parch + 1, used by the
 * "Family Size Analysis" chart, mirroring the requested feature engineering.
 */

function toNumberOrNull(value: string | undefined): number | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Parses raw CSV text into loosely-typed rows using PapaParse. */
export function parseCsv(csvText: string): RawPassenger[] {
  const result = Papa.parse<RawPassenger>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data;
}

/**
 * Removes fully duplicate rows, keeping the first occurrence — equivalent
 * to pandas' df.drop_duplicates().
 */
function dedupeRows(rows: RawPassenger[]): RawPassenger[] {
  const seen = new Set<string>();
  const out: RawPassenger[] = [];
  for (const row of rows) {
    const key = JSON.stringify(row);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(row);
    }
  }
  return out;
}

/** Full cleaning pipeline: raw CSV text -> cleaned, typed Passenger[]. */
export function cleanData(csvText: string): Passenger[] {
  const rawRows = dedupeRows(parseCsv(csvText));

  // First pass: coerce types, skip rows missing required identifiers.
  const partial = rawRows
    .filter((r) => r.PassengerId && r.PassengerId.trim() !== "")
    .map((r) => {
      const age = toNumberOrNull(r.Age);
      const sexRaw = (r.Sex || "").trim().toLowerCase();
      const sex: "male" | "female" = sexRaw === "female" ? "female" : "male";
      const pclassNum = toNumberOrNull(r.Pclass);
      const pclass: 1 | 2 | 3 =
        pclassNum === 1 || pclassNum === 2 || pclassNum === 3 ? pclassNum : 3;
      const survivedNum = toNumberOrNull(r.Survived);
      const survived: 0 | 1 = survivedNum === 1 ? 1 : 0;

      return {
        PassengerId: toNumberOrNull(r.PassengerId) ?? 0,
        Survived: survived,
        Pclass: pclass,
        Name: (r.Name || "").trim(),
        Sex: sex,
        Age: age,
        AgeWasMissing: age === null,
        SibSp: toNumberOrNull(r.SibSp) ?? 0,
        Parch: toNumberOrNull(r.Parch) ?? 0,
        Ticket: (r.Ticket || "").trim(),
        Fare: toNumberOrNull(r.Fare) ?? 0,
        FamilySize: (toNumberOrNull(r.SibSp) ?? 0) + (toNumberOrNull(r.Parch) ?? 0) + 1,
      } as Passenger;
    });

  // Compute median Age from all known (non-missing) ages, then fill.
  const knownAges = partial
    .map((p) => p.Age)
    .filter((a): a is number => a !== null);
  const medianAge = median(knownAges);

  const cleaned: Passenger[] = partial.map((p) => ({
    ...p,
    Age: p.Age === null ? medianAge : p.Age,
  }));

  return cleaned;
}
