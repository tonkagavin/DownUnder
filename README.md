# DownUnder

Medication-safety check for birth control. A student records her method and other medications; DownUnder says whether anything in that combination matters, cites the source, and asks a pharmacist when it cannot tell. It never says “safe”. This is information from published labels and guidelines, not medical advice.

The previous `frontend/` and `backend/` Express + sql.js MVP is retired. Use `apps/` and `packages/`.

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
- Student product: http://localhost:8081
- Campus demo (Maya, clinician, admin): http://localhost:8081/demo

The student product is a separate profile. It has no role switcher. The campus demo keeps Maya (combined pill, sertraline) plus Dr. Reyes’s worklist and the admin dashboard. Search **rifampin** (known interaction), **lamotrigine** (reverse effect), **amoxicillin** (pick the product), **mystery herb** (not enough information).

## Test

```bash
npm test
npm run eval
```

Gold set v0 must report **zero dangerous misses**.

## Important

This tool does not diagnose, prescribe, or replace a pharmacist or clinician. Confirm with a licensed professional before changing medications or contraception.
