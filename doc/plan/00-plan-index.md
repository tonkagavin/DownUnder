# DownUnder plan · Index

Investor-ready product and business plan for DownUnder, a women's medication-safety app that checks birth control against other medications in both directions and lists adverse effects the FDA label reports for her body. Pitched as a Sandai-backed venture; B2B buyers first with a free consumer front door; privacy-first, no ads, no data sales. The source of facts about the current app and the original roadmap is the extract at `../../internal/downunder-roadmap-extract.md` (Project store, internal). This plan builds on it and does not contradict it.

Founder: Gavin McKay (Sandai). First audience: Sandai's CEO. Second: clinical advisor and pilot campus. Third: investors after Gate 3.

## 1. What each document is for

| Doc | Purpose | Read it when |
|---|---|---|
| [01-product-definition.md](./01-product-definition.md) | What the app is and does today (honestly), what it does not do, problem evidence, personas, and a three-horizon feature roadmap with dependencies | Scoping work, writing the pilot proposal, answering "what is it" |
| [02-technical-architecture.md](./02-technical-architecture.md) | Backend choice (TypeScript/Fastify plus an offline Python extraction service), rules engine as data, Postgres model, live data sources, AI scope, auth/PHI/HIPAA-FERPA posture, audit, FDA CDS criteria, deploy/CI/testing, gold-set harness, platform order, diagrams, migration from the current repo | Building anything; security or privacy review; technical diligence |
| [03-frontend-and-ux.md](./03-frontend-and-ux.md) | HCI principles applied (Nielsen, Fitts/Hick, progressive disclosure, risk communication, WCAG 2.2 AA, health literacy), screen-by-screen outline for patient and clinician, the four-outcome risk vocabulary, privacy UX | Designing screens; comprehension testing; copy review with counsel |
| [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) | Market sizing with explicit assumptions, buyers and pricing hypotheses, GTM, competition and wedge, regulatory path, unit economics, funding by stage, the step-by-step timeline across six phases and five gates with exit criteria and kill risks | Preparing the CEO or investor conversation; planning each quarter |
| [05-pitch-and-influence-playbook.md](./05-pitch-and-influence-playbook.md) | For Gavin: one-liner, 90-second CEO script, 10-slide deck with notes, objections and answers, how to operate when you are not a salesperson, influence principles with ethical limits, pre-meeting checklist, leave-behind | The day before any meeting |
| [06-risks-and-ethics.md](./06-risks-and-ethics.md) | Technical and ethical risk register with likelihood, impact, mitigation, owner, open question; the "never do" list; review cadence | Every gate review; any incident; diligence |

## 2. How to use these documents to track progress

- Each document ends with a "Progress log". Add a dated entry whenever a decision in it changes, a number is refreshed, or a milestone in its scope is reached. Keep entries to one line.
- Update the status table below at every gate review and at least monthly during Phase 0–2. "Status" values: Draft (not yet reviewed by anyone else), Reviewed (advisor, counsel, or CEO has read and commented), Active (being executed against), Stale (contains figures or decisions known to be out of date).
- Numbers labeled "estimate" or "hypothesis" are to be replaced with measured values as they arrive; when a number changes, update it in the doc that owns it (04 for market and pricing, 02 for accuracy metrics) and reference it elsewhere rather than copying.
- Timeline tracking lives in [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §9. Mark each step Done / In progress / Blocked with a date in the step's row rather than in a separate tracker.
- Risk tracking lives in [06-risks-and-ethics.md](./06-risks-and-ethics.md). Re-score at each gate.

### Status table

| Doc | Status | Last reviewed | Reviewed by | Next review due |
|---|---|---|---|---|
| 00-plan-index | Draft | 2026-11-07 | — | Before CEO meeting |
| 01-product-definition | Draft | 2026-11-07 | — | After clinical advisor signs (Gate 1) |
| 02-technical-architecture | Draft | 2026-11-07 | — | End of scoping sprint (Dec 2026) |
| 03-frontend-and-ux | Draft | 2026-11-07 | — | Before comprehension testing (Phase 1) |
| 04-business-plan-and-timeline | Draft | 2026-11-07 | — | Before CEO meeting; monthly thereafter |
| 05-pitch-and-influence-playbook | Draft | 2026-11-07 | — | Day before CEO meeting |
| 06-risks-and-ethics | Draft | 2026-11-07 | — | Gate 1 |

## 3. Key recommendations in one place

- Backend: keep TypeScript on Node, move Express to Fastify, rules engine as pure TS over versioned YAML tables, Postgres with Drizzle; one offline Python service for label NLP extraction; no Go. ([02](./02-technical-architecture.md) §1)
- Platform order: responsive web first (patient mobile-first, clinician desktop-first), native Expo mobile after Gate 3, partner API and SMART on FHIR after Gate 4. ([02](./02-technical-architecture.md) §8)
- First buyer: one campus health center with an existing contact, entered through a quality-improvement pilot for August 2027, sold to the clinician who answers interaction questions today. ([04](./04-business-plan-and-timeline.md) §4)
- First ask of Sandai's CEO: back a four-week scoping sprint (Gavin's time, a few hours of legal, one clinician introduction) and settle the structure and IP question; not venture funding in meeting one. ([05](./05-pitch-and-influence-playbook.md) §2, §7.1)
- Biggest risk: false reassurance from a "no known interaction" result; mitigated by removing "safe" from the vocabulary, first-class abstention, a zero-dangerous-miss gate on a pharmacist-labeled gold set, and a clinician loop. ([06](./06-risks-and-ethics.md) §1)

## 4. Top 10 decisions still open for Gavin

| # | Decision | Why it matters | Where it is discussed | Needed by |
|---|---|---|---|---|
| 1 | Sandai relationship and IP: spinout, internal venture, or sponsored project; invention-assignment status; whether Sandai's name goes on the patient product | Determines who owns what, SBIR eligibility, investor structure, and brand exposure | [04](./04-business-plan-and-timeline.md) §6, §8; [06](./06-risks-and-ethics.md) E12 | Before or at the first CEO meeting |
| 2 | Interaction data strategy: curated tables plus mirrored labels now; whether and when to add a commercial license (DrugBank, FDB, Medi-Span, Lexicomp) | Coverage, cost, redistribution terms for patient display | [02](./02-technical-architecture.md) §4; [06](./06-risks-and-ethics.md) T1, T4 | Gate 2 |
| 3 | Pilot campus and contract type: which campus (NC State contact?), free or $5k, who signs, HIPAA or FERPA | Academic calendar makes this the critical path to August 2027 | [04](./04-business-plan-and-timeline.md) §4, §9 Phase 1 | LOI by June 2027 |
| 4 | Clinical advisor: who, compensation (stipend plus equity), authorship terms | Gate 1 requires it; labeling schema depends on it | [04](./04-business-plan-and-timeline.md) §9 step 0.4 | January 2027 |
| 5 | Pricing model: confirm or revise the campus tier sheet and telehealth API pricing after the first ten buyer conversations | Unit economics and seed narrative | [04](./04-business-plan-and-timeline.md) §3, §7 | Before Gate 3 |
| 6 | Regulatory posture for the patient view: informational-only copy with evidence, or gate `none_known` behind clinician confirmation during the pilot | Device exposure and false-reassurance harm | [02](./02-technical-architecture.md) §6.5; [06](./06-risks-and-ethics.md) E1, E6 | Counsel memo, January 2027 |
| 7 | Privacy architecture for consumer accounts: standard encryption with short retention, or user-held-key end-to-end encryption that prevents producing method history even under legal process | Post-Dobbs risk vs support and recovery cost | [02](./02-technical-architecture.md) §6.3; [06](./06-risks-and-ethics.md) E3 | Before pilot build |
| 8 | Team: which hackathon members are still involved and under what terms; first contractor hire; when Gavin goes full time | Single-engineer dependency; "why you" answer | [05](./05-pitch-and-influence-playbook.md) §4; [06](./06-risks-and-ethics.md) T10 | Scoping sprint |
| 9 | Planned Parenthood and Bedsider: keep as content or distribution partners, or drop | Credibility and distribution vs political exposure for campus buyers in some states | [04](./04-business-plan-and-timeline.md) §5 | Phase 1 |
| 10 | Name and brand: keep "DownUnder" (and retire "Discover what's down there") or rename for clinical buyers | Procurement and clinician credibility | [05](./05-pitch-and-influence-playbook.md) §4 | Before pilot proposal |

Also pending but smaller: grant timing and SBIR eligibility (follows from #1); minimum account age and under-18 policy (counsel); supplement handling strategy; Spanish timing.

## 5. Files

All under `/cursor/stores/bc-1f85a0c4-b2ad-4d85-8eea-b52f14a8a426/docs/downunder/`:

- `00-plan-index.md` (this file)
- `01-product-definition.md`
- `02-technical-architecture.md`
- `03-frontend-and-ux.md`
- `04-business-plan-and-timeline.md`
- `05-pitch-and-influence-playbook.md`
- `06-risks-and-ethics.md`

## Progress log

- 2026-11-07: Initial draft.
