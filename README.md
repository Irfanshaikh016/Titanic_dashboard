# Titanic Survival Analytics

Interactive analysis of passenger survival patterns — a professional, responsive analytics dashboard built with Next.js and deployable to Vercel for free.

## Project Overview

This dashboard loads the Titanic passenger dataset, runs it through a data-cleaning pipeline (a direct TypeScript port of the original Python cleaning logic), and presents it as a fully interactive analytics product: KPI cards, filters, 8 charts, dynamic text insights, and a searchable/sortable/paginated passenger table with CSV export. Every number on the page is computed live from the filtered data — nothing is hard-coded.

## Features

- **6 dynamic KPI cards**: Total Passengers, Survivors, Deaths, Survival Rate, Average Age, Average Fare
- **6 interactive filters**: Gender, Passenger Class, Survival status, Age range slider, Fare range slider, Name search
- **8 charts** (Recharts): survival distribution, survival rate by gender, survival rate by class, age distribution (stacked by survival), fare distribution, gender vs. survival, class vs. survival, family size vs. survival rate
- **Dynamic insights panel**: auto-generated sentences that recompute from whatever is currently filtered
- **Passenger data table**: sortable columns, name/ticket search, pagination, and a "Download CSV" button that exports exactly the filtered/sorted rows currently on screen
- Fully responsive: sidebar navigation collapses to a top bar with a hamburger menu on mobile
- Loading/empty states throughout (e.g. "no passengers match your filters")

## Technology Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for charts
- **PapaParse** for CSV parsing
- No database — the cleaned CSV is bundled with the app and read on the server at request time

## Dataset

`public/data/train-selected-columns.csv` — the Titanic training set with columns `PassengerId, Survived, Pclass, Name, Sex, Age, SibSp, Parch, Ticket, Fare` (891 rows, real data, no fake rows).

## Data Cleaning — how your Python logic was reimplemented

Your original notebook code did, in effect:

```python
df = df.drop_duplicates()
df["Age"] = df["Age"].fillna(df["Age"].mean())      # first fill
df["Name"] = df["Name"].str.strip()
median_age = df["Age"].median()
df["Age"] = df["Age"].fillna(median_age)             # runs after, but by
                                                       # this point there are
                                                       # no NaNs left to fill
```

Read carefully, the **only Age transformation that actually changes any value** is the very first `fillna(mean())` — because by the time the median fill runs, there are no missing values left for it to touch. However, since your final analysis script (`# 7. Fill missing Age using median`) explicitly recomputes and reports a **median**-based fill as the canonical cleaning step, and treats it as the "official" cleaned column, the dashboard's pipeline (`lib/cleaning.ts`) uses **median** imputation for missing `Age` values to match that stated intent. It also:

- Drops exact-duplicate rows (`dedupeRows`, equivalent to `drop_duplicates()`)
- Trims whitespace from `Name`
- Derives `FamilySize = SibSp + Parch + 1` for the family-size chart

If you specifically want **mean** imputation instead, it's a one-line change — see `lib/cleaning.ts`, function `cleanData`, and swap the `median(...)` call for an average.

Because Python can't run natively inside a Next.js/Vercel serverless frontend, this logic lives in plain TypeScript (`lib/cleaning.ts`) and runs at request time in `app/page.tsx` (a React Server Component), so the browser always receives already-cleaned data.

## Project Structure

```text
titanic-dashboard/
│
├── app/
│   ├── page.tsx          # Server component: reads CSV, cleans it, renders Dashboard
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── Dashboard.tsx      # Top-level client component, owns filter state
│   ├── Sidebar.tsx
│   ├── KPICards.tsx
│   ├── Filters.tsx
│   ├── SurvivalChart.tsx
│   ├── GenderChart.tsx
│   ├── ClassChart.tsx
│   ├── AgeChart.tsx
│   ├── FareChart.tsx
│   ├── GenderSurvivalChart.tsx
│   ├── ClassSurvivalChart.tsx
│   ├── FamilyChart.tsx
│   ├── PassengerTable.tsx
│   └── Insights.tsx
│
├── data/                  # (see public/data below — kept here in the diagram
│                           #  requested; the working file lives in public/data)
├── lib/
│   ├── types.ts
│   ├── cleaning.ts         # TypeScript port of the Python cleaning pipeline
│   └── data.ts             # filtering, KPI, chart-shaping, insight generation
│
├── public/
│   └── data/
│       └── train-selected-columns.csv
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── .gitignore
```

> Note: the CSV lives under `public/data/` rather than a top-level `data/` folder. Files outside `public/` are not guaranteed to be included in Vercel's serverless bundle, while anything in `public/` always ships with the deployment — this is the Vercel-safe location for a file your server code needs to read with `fs.readFileSync`.

## Installation

```bash
git clone <your-repo-url>
cd titanic-dashboard
npm install
```

## Running Locally

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. The dashboard hot-reloads as you edit files.

To test a production build locally (recommended before deploying):

```bash
npm run build
npm run start
```

## GitHub Setup

**Step 1 — Create a GitHub repository**
Go to github.com → New repository → name it `titanic-dashboard` → Create repository (don't initialize with a README, since you already have files).

**Step 2 — Initialize git locally and push**

```bash
cd titanic-dashboard
git init
git add .
git commit -m "Initial commit: Titanic Survival Analytics dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/titanic-dashboard.git
git push -u origin main
```

## Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign up / log in (use "Continue with GitHub" for the smoothest flow).
2. Click **Add New → Project**.
3. **Connect GitHub** if you haven't already, and grant Vercel access to your `titanic-dashboard` repo.
4. **Import** the repository.
5. Framework Preset: Vercel auto-detects **Next.js** — leave it as-is.
6. Build settings: leave the defaults —
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`
7. Click **Deploy**.
8. Wait ~1–2 minutes for the build to finish.
9. Vercel gives you a public URL like `https://titanic-dashboard-yourname.vercel.app` — open it, that's your live dashboard.

## Automatic Deployment (CI/CD)

Once connected, every push to `main` triggers a new deployment automatically:

```text
Edit code
   ↓
git add .
   ↓
git commit -m "message"
   ↓
git push
   ↓
GitHub
   ↓
Vercel detects the push and rebuilds
   ↓
Updated dashboard live at the same URL
```

To update the dataset later: replace `public/data/train-selected-columns.csv`, commit, and push — the cleaning pipeline re-runs automatically on the new file.

## Troubleshooting

**CSV not found / "No data found" screen**
Confirm the file exists exactly at `public/data/train-selected-columns.csv` (case-sensitive) and was committed to git (`git status` shouldn't show it as untracked).

**Module not found**
Run `rm -rf node_modules package-lock.json && npm install` to rebuild a clean dependency tree.

**Build failed on Vercel**
Check the Vercel deployment logs (Project → Deployments → click the failed one → "Build Logs"). Most failures are TypeScript type errors — run `npm run build` locally first to reproduce and fix them before pushing.

**TypeScript errors**
Run `npx tsc --noEmit` locally to see all type errors at once without a full build.

**Charts not displaying**
Make sure `recharts` installed correctly (`npm ls recharts`) and that you're not rendering a chart component outside of a sized parent — all chart cards here use `ResponsiveContainer`, which needs a parent with a defined height (already handled by the `.card` styles).

**Dashboard works locally but fails on Vercel**
Almost always a case-sensitivity issue (macOS/Windows filesystems are case-insensitive, Vercel's Linux build isn't) or an environment variable missing. Double-check file name casing matches imports exactly.

**Large CSV / performance problems**
For datasets much larger than this one (891 rows), move filtering to the server (an API route) instead of filtering the full array in the browser, and paginate server-side.

**Incorrect file path after deployment**
Never use a relative path like `./data/...` from `process.cwd()` assumptions in the browser — the CSV is read server-side in `app/page.tsx` via `path.join(process.cwd(), "public", "data", "train-selected-columns.csv")`, which is the safe, deployment-agnostic way to reference it.

## Future Improvements

- Server-side pagination/filtering for much larger datasets
- Persisted filter state in the URL (shareable filtered views)
- Export charts as PNG/SVG
- Dark mode toggle
- Additional derived features (deck from Cabin, title extracted from Name) if those columns are added back to the CSV
