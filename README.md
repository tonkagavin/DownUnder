# DownUnder MVP

DownUnder is a full-stack MVP that helps women check whether a medication may interact with their selected birth control method or with other medications in their profile.

## Stack

- Frontend: Vite + React + TypeScript
- Backend: Node + Express + TypeScript
- Database: SQLite via `sql.js` persisted at `backend/db/downunder.sqlite`
- External data sources: RxNav and openFDA drug label APIs

## Features

- Create/update a local profile with physical metrics
- Choose a birth control method from a seeded catalog
- Add current medications to profile
- Search medications via RxNav typeahead
- Check interaction risk against birth control and profile meds
- View plain-language guidance, risk level, source links, and disclaimers

## Run locally

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Build and test

```bash
npm run build
npm run test
```

## Important disclaimer

This MVP is educational and does **not** provide medical diagnosis or treatment advice.
Always consult a licensed clinician or pharmacist before changing medications or contraception.

## Known limitations

- Public APIs can rate-limit or return incomplete interaction data.
- Interaction classification uses a rules-based normalization layer and is not clinically exhaustive.
- The app currently supports a single local profile (no authentication).
