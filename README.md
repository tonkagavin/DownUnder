# DownUnder — campus demo

Medication-safety check for birth control, shown as a campus health center walkthrough. Maya records her method and other medications; DownUnder says whether anything in that combination matters, cites the source, and asks a pharmacist when it cannot tell. It never says “safe”. This is information from published labels and guidelines, not medical advice.

This branch is the campus demo only. The student product lives on `beta-build`.

## Stack

- `apps/api` — Fastify, Drizzle, PGlite
- `apps/mobile` — Expo Router (iOS, Android, web)
- `apps/extract` — label sentence classifier (offline)
- `packages/types`, `rules`, `rules-data`, `eval`, `ui`, `api-client`

## Run

```bash
npm install
npm run dev
```

- API: http://localhost:4000
- Campus demo: http://localhost:8081

Open Maya (combined pill, sertraline), Dr. Reyes’s worklist, or the admin dashboard from the hub or the role switcher. Search **rifampin** (known interaction), **lamotrigine** (reverse effect), **amoxicillin** (pick the product), **mystery herb** (not enough information).

## Test

```bash
npm test
npm run eval
```

Gold set v0 must report **zero dangerous misses**.

## Important

This tool does not diagnose, prescribe, or replace a pharmacist or clinician. Confirm with a licensed professional before changing medications or contraception.
