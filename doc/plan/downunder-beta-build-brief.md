---
cursor:
  subagentId: "bc-419282fc-79de-5afa-acaf-05b4ebaa2eee"
---

# DownUnder beta build brief (handoff to the repo-attached agent)

Written 2026-11-07 for the worker that will have `https://github.com/tonkagavin/DownUnder.git` checked out. The planning worker that wrote this had no repo access. Read the plan first; do not re-derive it.

## Read in this order

1. `/cursor/stores/bc-1f85a0c4-b2ad-4d85-8eea-b52f14a8a426/internal/downunder-roadmap-extract.md` — what the current code actually does (commit `74a7fce`), what is broken, verified live API behaviour. Facts here win over assumptions.
2. `/cursor/stores/bc-1f85a0c4-b2ad-4d85-8eea-b52f14a8a426/docs/downunder/02-technical-architecture.md` — target architecture, rules engine as data, data model, data sources, migration path (§11 is the step list to follow).
3. `/cursor/stores/bc-1f85a0c4-b2ad-4d85-8eea-b52f14a8a426/docs/downunder/01-product-definition.md` — Horizon 1 feature table (N1–N17) and non-goals.
4. `/cursor/stores/bc-1f85a0c4-b2ad-4d85-8eea-b52f14a8a426/docs/downunder/03-frontend-and-ux.md` — four-outcome vocabulary, screen list, copy rules, accessibility bar.
5. `/cursor/stores/bc-1f85a0c4-b2ad-4d85-8eea-b52f14a8a426/docs/downunder/06-risks-and-ethics.md` §4 — the "never do" list; treat as acceptance criteria.
6. `/cursor/stores/bc-1f85a0c4-b2ad-4d85-8eea-b52f14a8a426/docs/downunder/00-plan-index.md` — index and open decisions.

Companion: `/cursor/stores/bc-1f85a0c4-b2ad-4d85-8eea-b52f14a8a426/internal/downunder-repo-overview.md` (repo layout).

## Goal of the beta

A demo Gavin can show Sandai's CEO (Jeremy Williams; profile in docs/downunder/05 §7.1) that runs end to end without 500s, gives method-aware, bidirectional, source-cited results, abstains honestly, and has a complete frontend with clearly labelled placeholders for unsupported features. Not a pilot deployment.

## Decisions still needed from Gavin before coding starts

| # | Question | Default if no answer |
|---|---|---|
| 1 | Greenfield monorepo (apps/api, apps/web, packages/rules, rules-data, types, eval) vs incremental inside `frontend/` + `backend/` | Greenfield; port seed methods and typeahead |
| 2 | Demo database: real Postgres via Docker vs PGlite (embedded Postgres, zero setup, same SQL) | PGlite for beta, RDS at pilot |
| 3 | Live LLM label-extraction demo for the CEO (needs an API key as a secret) vs offline pre-computed extractions | Pre-computed, with a "run extraction" button that shows the pipeline on cached labels |
| 4 | Clinician view: functional in beta or placeholder | Functional read-only evidence panel plus review buttons; SSO is a placeholder |
| 5 | Visual direction (palette, type) | Follow docs/downunder/03 §7 tokens; neutral clinical palette |
| 6 | Branch/PR style | One `cursor/beta-*` branch per migration step in 02 §11, PRs ready for review |

## Build order (maps to docs/downunder/02 §11)

1. Repo hygiene; remove retired RxNav interaction call; fail-safe vocabulary; frontend error handling.
2. `packages/types` + `packages/rules` + first `rules-data` YAML (inducers, reverse effects, methods, MEC subset) with table-driven tests.
3. RxNorm normalization (ingredient resolution) + openFDA by `openfda.rxcui` with cached label sections and `set_id` passages.
4. Fastify API with zod schemas, pino, error handler; Drizzle schema from 02 §3.
5. Gold set v0 (50 items) + eval harness in CI.
6. Frontend: patient flow P1–P12 and clinician C2–C5 from 03, placeholders for P13, C6, C7, C8 and anything not backed by the API.
7. Demo script and seeded demo profile (rifampin vs pill; lamotrigine reverse; amoxicillin boring case; unresolved supplement abstention; IUD unaffected).

## Constraints

- No patient data to third-party models. No ads, trackers, or analytics SDKs. No "safe"/"Low"/green checkmark anywhere.
- Any upstream failure returns `insufficient_information`, never `none_known_in_sources`.
- Keep verification scripts out of the repo (use /tmp).
- Report back to the Project coordinator with PR links and the absolute paths of anything written to the store.
