import fs from "fs";
import path from "path";
import Dashboard from "@/components/Dashboard";
import { cleanData } from "@/lib/cleaning";

// This runs at build/request time on the server, reads the CSV from disk,
// and passes already-cleaned data down to the client dashboard.
export default function Home() {
  const csvPath = path.join(process.cwd(), "public", "data", "train-selected-columns.csv");
  let csvText = "";
  try {
    csvText = fs.readFileSync(csvPath, "utf-8");
  } catch (err) {
    csvText = "";
  }

  const passengers = csvText ? cleanData(csvText) : [];

  return <Dashboard initialData={passengers} />;
}
