---
cursor:
  subagentId: "bc-9604d00d-8b0e-592d-99e8-3e5b860e00ca"
---

# DownUnder roadmap extract (research for investor-facing product plan)

Surveyed 2026-11-07 on Gavin's MacBook, read-only. Repo: `/Users/gabinch/git/DownUnder` (single commit `74a7fce`, 2026-05-10; the roadmap PDF is untracked). `node_modules` is not installed and nothing was installed, so tests were not run; code findings are from static reading plus a few live read-only HTTP calls to RxNav and openFDA. Companion doc: `internal/downunder-repo-overview.md` (repo/layout survey by another worker).

How the PDF was read: the built-in PDF-to-text reader extracted all 10 pages; page 7's timeline is a graphic, which was rendered to PNG with a throwaway Swift/PDFKit script (in `/tmp`, since deleted) and read visually. Nothing on the machine was installed.

---

## 1. Roadmap PDF summary — "DownUnder: Roadmap to a Fundable Product" (10 pages, sources checked Nov 7, 2026)

### 1.1 One-line thesis

DownUnder helps women check whether a medication interacts with their birth control or their other medications. The document "sets out the problem it solves, how it grows from a product into a platform, and a phased timeline to get there." The pitch (p.9): a narrow, validated, clinician-in-the-loop contraception-and-medication safety check, proven in a campus pilot, that then becomes "the medication-safety layer for women's health."

### 1.2 The problem (p.1–2)

Framing: birth control and a woman's other medications are managed by different people, and no one is reliably responsible for checking how they affect each other. The gap runs in two directions, both documented.

**Direction 1 — other medicines can weaken birth control, and the rules are hard to remember**
- Combined hormonal methods (pill, patch, ring) are metabolized by liver cytochrome P450 enzymes; enzyme inducers clear the hormones faster.
- Cleveland Clinic names the main concerns: seizure medicines (carbamazepine, phenytoin, topiramate), the HIV drug efavirenz, the TB antibiotic rifampin, and St. John's wort. The same source says most antibiotics and most other medications do NOT interact — "the real task is separating the few that matter from the many that don't."
- Reverse effect: combined hormonal birth control can make the seizure medicine lamotrigine less effective.

**Direction 2 — medicines that require reliable contraception are often prescribed without it**
- Chart review of two family-medicine clinics at one academic center (Panchal et al., JABFM, 2019): 25% of women aged 13–45 had been prescribed at least one medication with potential risk in pregnancy; 55% of those had no documented contraception.
- Women under 25 had about half the odds of receiving contraception alongside such a prescription (adjusted OR 0.47) — "the age group campuses serve."
- Authors note a specialist may prescribe such a drug without telling the primary care clinician.
- Two cautions the PDF itself applies: one center, 2015 data; ondansetron accounted for 73% of flagged women. Excluding ondansetron, 62% of flagged women still had no documented contraception.

**The stakes are real, but interactions are one slice of them**
- 2011: 45% of US pregnancies unintended; first-year typical-use pill failure rate 7% (2006–2010 data) (Sundaram et al., Guttmacher, 2017). These figures include every cause.
- Pregnancies among contraceptive users are almost entirely due to inconsistent or incorrect use (Frost and Darroch, 2008). None of the cited sources measures how many failures come from drug interactions.
- Explicit positioning: "the case for DownUnder is not that interactions explain most unintended pregnancies. It is that this is a specific, preventable failure that no one owns, and that the same profile can support adherence help and wider medication-safety checks later."

**Why it is a women's health problem more broadly**
- A 2020 review of 86 drugs found higher blood concentrations in women for 76 of them, and women experienced adverse drug reactions nearly twice as often as men (Zucker and Prendergast, 2020). PDF caveat: about dosing/side effects in general, not contraceptive interactions, but supports that women's medication safety is under-served.

**What DownUnder does about it**: checks both directions in one profile (does a medication weaken the selected birth control; how does it interact with the rest of the list), explains in plain language, shows sources, and says "ask a pharmacist" when data is unclear.

**Untested claim flagged by the author**: that students are more exposed to fragmentation because they get care from campus clinic, urgent care, telehealth, and home providers. No source measures students specifically; "the pilot should."

### 1.3 Target users / customers

- End user: women (students first — college-aged, under-25 cohort emphasized), then alumni retained past graduation.
- Clinical users: pharmacists and campus clinicians (clinician-facing view needed for FDA path and pilot).
- Buyer: one campus health center first; later telehealth companies, pharmacies, employers/benefits providers, health plans, women's health clinics.
- Administrators: de-identified cohort analytics dashboard "a health center would pay for."

### 1.4 What DownUnder is today, per the PDF (p.2–3)

"A working full-stack MVP: a consumer-style interaction checker built on public data" covering profile → birth control method → medication search → risk level → plain-language guidance → source links → disclaimers. Running locally with a single profile is called "a real privacy advantage at this stage."

Four gaps that matter to buyers:
1. **No predictive layer yet.** Rules-based normalization over public APIs is a lookup tool; the predictive layer is still to build.
2. **Interaction data source needs a decision.** NLM discontinued RxNav's drug-interaction features on January 2, 2024 (NLM RxNav FAQ); the sources it drew on (a high-priority interaction list and DrugBank's dataset) may remain available elsewhere. README uses RxNav for typeahead, a different function. Author: "I haven't read the code, so confirm that nothing still calls the retired endpoint and that an empty or failed lookup never displays as 'no interaction found.' If interactions are inferred from openFDA label text, that parsing is the most fragile part of the app and also the best opportunity." (See §3 and §5 — the code DOES still call the retired endpoint.)
3. **No accounts or multi-tenancy.** "A university can't buy it in that form."
4. **No clinician-facing view.** Matters for FDA path and the pilot.

### 1.5 Where AI and prediction fit (p.3–4)

Principle: use ML where rules don't scale; keep clinical rules deterministic where published guidance exists. CDC US MEC eligibility categories (smoking, migraine with aura, clotting risk) and FSRH interaction guidance anchor the rules layer; a model should not override them. Calling the whole product "predictive" would hurt credibility with clinicians — name each model's job precisely:

1. **NLP extraction from label text** — train or prompt-tune a model to extract and grade contraceptive-relevant statements from openFDA labels ("reduces effectiveness," "backup method recommended," "contraindicated"). Every output must point to the label passage; rules layer remains the baseline to beat.
2. **Confidence scoring and abstention** — predict when data is incomplete or conflicting and route to "ask a pharmacist." "Safety-minded buyers value this more than extra features."
3. **Cohort analytics once there are users** — aggregate de-identified patterns (common medication/method combinations on a campus; where students get stuck). The dashboard a health center would pay for.
4. **Adherence and method-switch modeling** — valuable because most failures are inconsistent use, but only after real usage data; planned for Phase 3, "not promised earlier."

**The credibility move: a validation ("gold") set.** Have a pharmacist/clinician label ~150–300 pairs covering both directions; report agreement of rules engine and model with labels, with precision and recall and special attention to dangerous misses. "That one table can anchor a grant application, a pilot proposal, and an investor deck."

### 1.6 From product to platform (p.4–6)

Definition: a product answers one question for one user; a platform lets new questions, users, and partners plug into the same core. DownUnder becomes a platform when profile, interaction engine, and clinician tools are reusable pieces.

| Layer | Today (product) | Target (platform) |
|---|---|---|
| Health profile | One local profile with metrics, method, medications | Consented, longitudinal profile covering medications, methods, conditions, life stage |
| Engine | Rules plus label lookups inside the app | Versioned interaction and risk engine with an API, validated against the gold set |
| Users | A student on her own device | Students, alumni, pharmacists and clinicians, campus administrators |
| Modules | Birth control and medication check | Adds teratogen-and-contraception check, hormonal conditions, pregnancy and lactation, menopause, preventive care |
| Buyers | One campus health center | Adds telehealth, pharmacies, employers, health plans |
| Distribution | Direct, campus by campus | Partner API and health-record integrations |

**Five expansion stages**
1. Contraception and medication safety (the MVP) — meds/supplements vs. selected method and med list, then add the reverse check (meds requiring reliable contraception).
2. Adjacent hormonal and reproductive conditions — PCOS, endometriosis, heavy/irregular periods, hormonal acne.
3. Pregnancy planning and lactation — preconception and breastfeeding medication checks using existing labeling/reference sources.
4. Perimenopause and menopause — hormone therapy and symptom-treatment decisions.
5. Preventive care and personalized recommendations — screening and vaccination reminders (cervical screening, HPV vaccination), symptom and cycle tracking, tailored "when to talk to a clinician" suggestions.

**How the AI layer scales**: longitudinal data is the moat (enables risk models, adherence prediction, personalization a one-time lookup can't match); consented de-identified usage refines recommendations; confidence-aware "ask a pharmacist" outputs stay central.

**How the business scales**: retention past graduation; new buyers at each stage (campus health centers → telehealth → pharmacies → employers/benefits → health plans → women's health clinics); "a system of record for a woman's medication and hormonal context" — "a stronger investor story than a single-purpose app, but only after Stage 1 is proven."

**Three signs it has become a platform**: (1) an outside partner runs on the DownUnder API; (2) a second module ships without rebuilding the core; (3) clinicians at more than one institution use the same console.

### 1.7 Timeline: six phases, five gates (~4 years) (p.6–8)

Assumptions: small team working part-time; dates shift with when a campus agrees to a pilot; universities buy on academic calendars, so a pilot that misses the August start slips a semester. Phases 0–2 prove the narrow product, Phase 3 turns it into revenue, Phases 4–5 open the platform only after the pilot gate passes. Phases 3–5 are intentionally light on detail.

| Phase | Dates | Content (from the p.7 graphic) |
|---|---|---|
| **Phase 0 · Validate and harden** | Nov 2026 – Feb 2027 | Clinical advisor, pharmacist-labeled gold set, data-source plan, ask-a-pharmacist fallback |
| Gate 1 | | Advisor signed on and gold set scored, with dangerous misses reviewed |
| **Phase 1 · Build the sellable product** | Mar – Jul 2027 | Accounts, encryption, clinician view, label-extraction model vs rules baseline, campus analytics |
| Gate 2 | | Model at least matches rules on dangerous misses, security review passed, pilot agreed |
| **Phase 2 · Campus pilot** | Aug – Dec 2027 | One campus health center; measure confirmed flags, clinician time saved, and repeat use |
| Gate 3 | | Pilot results written up and a paid conversion or second campus committed |
| **Phase 3 · Commercialize the core** | 2028 | A handful of paid campuses; add the teratogen-and-contraception check and adherence support |
| Gate 4 | | Recurring revenue, accuracy held on new campus data, privacy and FDA path confirmed |
| **Phase 4 · Open the platform** | 2029 | Partner API and integrations, alumni accounts, hormonal-condition and pregnancy modules |
| Gate 5 | | An outside partner runs on the API and a second module ships without a rebuild |
| **Phase 5 · Life-stage platform** | 2030 onward | Menopause and preventive-care recommendations; employer, health-plan, and telehealth buyers |

**The next twelve months in detail**

Phase 0 (Nov 2026 – Feb 2027):
- Recruit a clinical advisor, ideally a pharmacist or campus health provider.
- Build the labeled gold set and an evaluation script in the repo.
- Decide the interaction data source (license or curate), add caching and fallbacks for external APIs, make "unknown, ask a pharmacist" a first-class result.
- Book a regulatory and privacy consult.

Phase 1 (Mar – Jul 2027):
- Add accounts, a hosted database such as Postgres, encryption, and audit logging. "SQLite via sql.js is fine for the MVP but not for a campus deployment."
- Add the clinician-facing view.
- Benchmark the NLP extraction model against the rules engine.
- Add de-identified aggregate analytics for administrators.
- Submit a first grant application (NIH SBIR/STTR or a women's-health foundation; check current due dates) and secure a pilot agreement.

Phase 2 (Aug – Dec 2027):
- Run the pilot at one campus health center, ideally one with an existing contact.
- Track pharmacist-confirmed flags, follow-up advice delivered, clinician time saved, repeat use.
- Write up results for grants and the next campus.

### 1.8 Business model and revenue (as stated or implied)

The PDF does not give pricing. Revenue model implied: B2B2C — sell to campus health centers first (paid campuses in Phase 3, "recurring revenue" at Gate 4), then telehealth, pharmacies, employers/benefits providers, health plans, women's health clinics; partner API and health-record integrations as distribution in Phase 4; non-dilutive funding via NIH SBIR/STTR or women's-health foundation grants in Phase 1. Success/process metrics: pharmacist-confirmed flags, follow-up advice delivered, clinician time saved, repeat use; paid conversion or second campus. (The older hackathon docs in §2 propose consumer subscription/freemium pricing instead — a divergence to reconcile.)

### 1.9 Risks to settle early (p.8–9) — "This is not legal advice; get counsel before charging for the product."

- **FDA path.** Software is excluded from device regulation as "non-device CDS" only if it meets four criteria, including supporting recommendations to a healthcare professional who can independently review the basis. FDA's January 2026 revision keeps that framework and announced nothing new for consumer-facing tools; patient-facing software meeting the device definition stays under FDA's existing digital health policies (Covington summary; FDA guidance page). Practical take: a clinician-facing view with visible sources is the cleaner route; a student-facing "this is safe for you" verdict carries more exposure. Present results as information to discuss with a clinician.
- **Privacy and who the customer is.** Contraceptive, medication, and pregnancy-related data is highly sensitive. Applicable regime (HIPAA, FERPA, or state law) depends on customer and setting; confirm with counsel before signing a pilot. Design for data minimization, strong consent, de-identified analytics from the start; keep local-only design as long as it serves the product.
- **Accuracy and liability.** A wrong "safe" answer could lead to a pregnancy or a harmful combination. Use authoritative sources, keep a pharmacist/clinician reviewing, treat "unknown, ask a pharmacist" as a valid result.
- **Evidence and claims.** Don't claim fewer unintended pregnancies until measured; pilot outcomes should be process measures. Statistics in the document date from 2011–2020 — refresh before external use.
- **Scope creep.** Each expansion stage widens regulatory and privacy surface; prove Stage 1 first, bring counsel in before each new stage, keep a clinician in the loop. "DownUnder helps women prepare for and use clinical care, and does not replace it."

### 1.10 How to pitch it (p.9, verbatim)

"Hormonal birth control is common, but the medications that can weaken it, and the medications that require reliable contraception, are prescribed by different providers who may not see the whole list. DownUnder checks both directions in one profile, shows its sources, and tells students and campus clinicians when to ask a pharmacist. We validate its accuracy against clinician-labeled data, prove it in a campus pilot, and then extend the same core into pregnancy, hormonal conditions, and menopause, becoming the medication-safety layer for women's health."

Frames: a problem, a customer, a measurable result, a defensible AI component, a path to a larger market. Order: problem → proof → path.

### 1.11 Possible next deliverables (p.9)

- Validation-set template and evaluation script
- NLP extraction approach for openFDA labels
- Pilot proposal for a campus health center

### 1.12 Sources cited (p.10)

Opened and read (checked Nov 7, 2026): NLM RxNav FAQ (interaction features discontinued Jan 2, 2024); Sundaram et al., Guttmacher, 2017 (45% unintended in 2011; pill failure 7%); Panchal et al., JABFM, 2019 (teratogenic prescriptions and contraception in family medicine); Cleveland Clinic (which medications affect hormonal birth control); Covington summary of FDA's 2026 CDS guidance.

Seen only as abstracts/search summaries ("open them before quoting externally"): Zucker and Prendergast, 2020 (sex differences in pharmacokinetics and ADRs); Frost and Darroch, 2008 (contraceptive pregnancies mostly due to inconsistent use); FDA CDS guidance page.

---

## 2. Other docs

### 2.1 `README.md` (repo root)
Describes the MVP: Vite+React+TS frontend, Node+Express+TS backend, SQLite via sql.js at `backend/db/downunder.sqlite`, external data RxNav and openFDA. Features: local profile with physical metrics; birth control from seeded catalog; add medications; RxNav typeahead; check interaction risk against birth control and profile meds; plain-language guidance, risk level, source links, disclaimers. Run: `npm install && npm run dev` (frontend :5173, backend :4000). Disclaimer: educational, not diagnosis. Known limitations: public APIs can rate-limit/return incomplete data; rules-based normalization not clinically exhaustive; single local profile, no authentication.

### 2.2 `doc/systemArchitecture.md`
Mermaid flow: WomanUser → ReactUI → ExpressAPI → {SQLite (sql.js), RxNav API, openFDA API}. Says RxNav provides "medication lookup and interaction graph data" (the interaction part is now dead — see §3.4) and openFDA provides label-derived interaction text; SQLite stores profile, seeded methods, meds catalog, and check history.

### 2.3 `doc/Hackathon Pitchdeck.pdf` (10 slides, mostly imagery)
Team: Armaan Raina, Gavin McKay, Julia Zhong, Manaka Green, Kara George. Tagline "Discover what's down there" / "We dig under so you can feel clearer." Target: college-aged women considering or on birth control who take/start other meds; "10 million women enrolled in US colleges." Problem: women take BC with painkillers, antibiotics, supplements, SSRIs unaware of risk. Product: "a website subscription" showing which drugs negatively affect the body alongside BC plus menstrual-health understanding. Metrics/UX: monthly subscription with free trial, monthly questionnaire, website reviews. Prospective partner: Planned Parenthood. Slides for Demo and Impact are images with no text.

### 2.4 `doc/Cofoundr hackathon team doc.pdf` (8 pages; team working notes)
- Canva pitch deck link. Hackathon prompt: problem, target user, solution, awareness, measurable behavior change, feasibility; "keep it realistic, build an MVP."
- Target: women 16–25 on birth control plus other meds; ideal customer college-aged; partner Planned Parenthood (distribution + credibility). "App is free" (page 2) vs. subscription elsewhere — internal inconsistency.
- Stat cited: 47.2% of women ages 15–49 use some form of hormonal contraceptive (cites CDC NCHS data brief db539) — not verified here; NCHS briefs usually report overall contraceptive use among women 15–49 (roughly two-thirds) rather than hormonal-only, so check the brief before reusing the number. Also links a PMC article (PMC11491692) on awareness by age group.
- Claims: "a majority of college women take birth control and ... painkillers to manage stress"; "ibuprofen plus hormonal birth control can raise blood pressure" (used as an example educational snippet — unverified).
- Proposed MVP (brainstorm): iOS/React Native app, manual drug entry, curated DB of top 50 interactions; red/yellow/green indicators; push notifications; in-app education; "Talk to your provider" CTA. Behavior metrics: % who see alert then remove/delay med; CTA taps; repeat opens; 30/60-day surveys; clinic-measured conversation increase. Feasibility: public data (FDA, NIH DailyMed, Drugs.com API); 1 dev + 1 designer + 1 health advisor; 8–12 weeks.
- Monetization brainstorm (page 7, reads like AI-generated advice): freemium with $4.99/month premium (alerts, history, doctor export — "like Flo Health"); affiliate links (Tylenol, pharmacies, Nurx); partnerships with Raleigh/NC State clinics, OBGYNs, Bedsider; white-label; pharma ads; "anonymized data sales to researchers, ensuring HIPAA compliance"; freelance marketing side hustle ($1,000–5,000/month); Etsy digital guides; target "$1,000+/month initially." Several of these (pharma ads, data sales, affiliate links to drug brands) conflict directly with the roadmap PDF's privacy/trust posture and would need to be dropped or re-justified in an investor plan.

### 2.5 `frontend/README.md`
Unmodified Vite React template boilerplate; no project content.

---

## 3. Current app capabilities (from code, `74a7fce`)

### 3.1 Backend routes (`backend/src`, Express 5, ~310 lines total)
| Method & path | What it does |
|---|---|
| `GET /api/health` | `{ok:true}` |
| `GET /api/profile` | Returns the single profile (id=1), its birth control method id, and all `profileMedications` |
| `PUT /api/profile` | zod-validated (name; age 12–60; height 100–230 cm; weight 30–250 kg; smoker bool; conditionsNotes ≤500 chars; birthControlMethodId nullable). Deletes and re-inserts profile row 1 and its BC link |
| `POST /api/profile/medications` | Adds `{name, rxcui?, className?}` to `profileMedications` (no dedupe) |
| `DELETE /api/profile/medications/:id` | Removes a profile medication |
| `GET /api/catalog/birth-control` | 8 seeded methods |
| `GET /api/catalog/medications` | 10 seeded common meds (not used by the frontend) |
| `GET /api/interactions/medications/search?q=` | RxNav `/drugs.json?name=` typeahead; first 10 concepts (rxcui, name, tty); errors → empty list |
| `POST /api/interactions/check` | The core check (see 3.4). Requires profile. Logs to `interactionChecks` |

No auth, no rate limiting, open CORS (`cors()` default = any origin), no error-handling middleware, no logging beyond startup.

### 3.2 Data model (`backend/db/schema.sql`, SQLite via sql.js WASM, whole DB rewritten to disk on each save)
- `profile` (id CHECK id=1, name, age, heightCm, weightKg, smoker, conditionsNotes) — hard-coded single tenant.
- `birthControlMethods` (name, category, defaultRiskNote, rxcui) — seeded: Combined OC Pill (rxcui 259255), Progestin-Only Pill (316047), Hormonal IUD (null), Copper IUD (null), Patch (753542), Vaginal Ring (748856), Depo-Provera (1011752), Implant (null). `defaultRiskNote` is never surfaced in the API/UI.
- `profileBirthControl` (profileId PK → one method per profile).
- `medicationsCatalog` (name, className) — 10 seeds: ibuprofen, acetaminophen, amoxicillin, doxycycline, sertraline, fluoxetine, lamotrigine, carbamazepine, St John's wort, rifampin. Served but unused by UI.
- `profileMedications` (name, rxcui, className) — not linked to profile id.
- `interactionChecks` (searchedMedication, checkedAt, riskLevel, summary) — history log; never read back by any route or screen.
- Height/weight/age/smoker are collected but **not used** in any logic (no US MEC rules, no BMI, no smoking-plus-estrogen check).
- Committed DB file already contains test data: profile "Ava", 24, 168 cm, 60 kg; one medication "cetirizine hydrochloride 10 MG Disintegrating Oral Tablet [Zyrtec]"; zero check rows.

### 3.3 Frontend (`frontend/src`, React 19 + react-router 7, two routes, minimal unstyled markup)
- `/` **ProfilePage**: form for name/age/height/weight/smoker/notes, birth-control `<select>`, Save; "Current Medications" with RxNav-backed `MedicationSearch` (250 ms debounce, ≥2 chars) to add, and Remove buttons.
- `/checker` **InteractionCheckerPage**: search a medication, "Check Interaction" button, `InteractionResultCard` showing medication, birth control name, risk level, summary sentence, "also checked against" list, two disclaimers, and two generic source links (rxnav.nlm.nih.gov and open.fda.gov root — not the specific label passage).
- No history view, no clinician view, no onboarding, no mobile packaging, no i18n, no risk colour coding, no per-med explanation of *why*.
- Frontend fetch calls lack error handling for non-JSON/500 responses (a backend 500 leaves the checker stuck in "Checking..." because `response.json()` rejects before `setLoading(false)`).

### 3.4 How RxNav and openFDA are used, and the interaction/risk logic
Flow of `POST /api/interactions/check`:
1. Resolve searched medication's rxcui (from client, or RxNav name search exact-match).
2. Load BC method name/rxcui and profile meds (name, rxcui).
3. If ≥2 rxcuis among {searched, BC, profile meds} → call RxNav `GET /REST/interaction/list.json?rxcuis=a+b+…` and JSON-stringify the response.
   - **This endpoint is retired (NLM, Jan 2, 2024). Live check 2026-11-07: HTTP 404 "Not found".** `getInteractionsForRxcuis` has no try/catch, so axios throws and the whole request fails with an Express default 500 whenever the user has a hormonal method with an rxcui (pill/patch/ring/shot) or any profile med with an rxcui — i.e., the primary use case.
4. openFDA: `GET https://api.fda.gov/drug/label.json?search=openfda.generic_name:"<medicationName>"&limit=1`, take `drug_interactions[0]` of the first label; errors → `''`.
   - The frontend sends RxNav display names such as `rifampin 150 MG Oral Capsule [Rifadin]`; the exact-phrase generic_name search returns NOT_FOUND for these (verified live), so label text is almost always empty in real use. It only works when the user's selected name happens to equal a bare generic name.
   - Only the first label is used; some labels have empty `drug_interactions` (ibuprofen's first result did, live).
5. Signals: `mentionsBirthControl` = label text contains "contracept" or "ethinyl estradiol"; `mentionsProfileMeds` = label text contains a profile med's (RxNav display) name.
6. `scoreRiskFromTexts([...])` — keyword rules over concatenated lowercased text:
   - **High** if contains "contraindicated", "reduce contraceptive efficacy", "decrease plasma concentrations", or **"pregnancy"**.
   - **Caution** if contains "monitor", "caution", "may increase", "may decrease", or "interaction".
   - **Low** if non-empty text with none of those.
   - **Unknown** if all text empty.
   - Consequences: any label whose interaction section says "contraindicated" with *any* drug (e.g., rifampin + saquinavir) scores High regardless of the user's BC; the word "pregnancy" alone forces High; non-empty text without keywords yields "Low" ("No major interaction signals detected") — exactly the "failed lookup displayed as no interaction" failure mode the roadmap warns about, though in practice Unknown or 500 is the more common outcome today.
7. Guidance is one fixed sentence per risk level (`guidanceByRisk`); no mechanism/explanation, no label passage citation, no direction (which drug affects which).
8. Writes a row to `interactionChecks`; returns fixed disclaimers and the two root URLs as "sources."

Net: today the app is a working profile/medication-list CRUD plus a RxNav typeahead; the interaction verdict itself is effectively non-functional (500 on the main path, Unknown on the rest) and, where it does fire, is a keyword heuristic with no BC-specific or direction-specific logic. The "reverse check" (meds that require reliable contraception / teratogen check) does not exist at all.

### 3.5 Test coverage
- Backend: `interactionEngine.test.ts` (4 unit tests on keyword scoring/guidance), `profile.test.ts` (1 supertest PUT/GET round trip — runs against and persists to the real committed `downunder.sqlite`, so running tests mutates the repo DB). No tests for `/check`, RxNav/openFDA clients, catalog, or medication add/delete.
- Frontend: `ProfilePage.test.tsx` (renders heading with mocked fetch), `InteractionResultCard.test.tsx` (renders fields). No tests for `MedicationSearch` or `InteractionCheckerPage`.
- No CI config, no coverage thresholds, no lint for backend, no E2E. Tests could not be run here (no `node_modules`, install prohibited).

---

## 4. Current tech stack and architecture

- Monorepo: npm workspaces (`frontend`, `backend`), root scripts via `concurrently`; Node 24 on the dev machine.
- Backend: Node ESM, Express 5.2, TypeScript 6, zod 4, axios, sql.js 1.14 (SQLite in WASM, in-memory with full-file export on each write), tsx for dev, tsc → `backend/dist`. Vitest 4 + supertest.
- Frontend: Vite 8, React 19, react-router-dom 7, TypeScript 6, ESLint 10 (template config), Vitest + Testing Library + jsdom. Dev proxy `/api` → `localhost:4000`.
- Runtime topology: single process API, local file DB, two third-party public APIs called synchronously per request with 10 s timeouts and no caching, retries, or circuit breaking.
- Deployment: none (local only). No Dockerfile, no env config beyond `PORT`, no hosting.
- Repo hygiene: single commit; `.gitignore` only ignores `node_modules`; `backend/dist/` (14 compiled files incl. compiled tests) and `backend/db/downunder.sqlite` (with sample profile data) are committed; `backend/db/seed.ts`/`seed.js` duplicate `src/lib/seedData.ts`; `frontend/README.md` is template boilerplate; `.DS_Store` files untracked in working tree; roadmap PDF untracked.

---

## 5. Gaps and risks

### 5.1 Technical
1. **Core check depends on a retired API and fails.** RxNav `/interaction/list.json` returns 404; uncaught → HTTP 500 for the main use case. Blocks any demo of the headline feature until replaced (roadmap Phase 0 "data-source decision" is actually a P0 bug fix). Options named in the roadmap: license a dataset (DrugBank etc.), curate a list, or extract from openFDA labels.
2. **openFDA lookup is mis-keyed.** Exact-phrase search on `generic_name` with RxNav brand/strength display names → no label found. Needs RxNorm → ingredient normalization (RxNav `/rxcui/{id}/related` or `/properties`) before querying openFDA, and multi-label handling.
3. **Risk scoring is keyword matching** with false-positive triggers ("pregnancy", "contraindicated" with unrelated drugs, "interaction") and a "Low" default on non-empty text. No direction, no mechanism, no BC-type specificity (copper IUD gets the same logic as the pill), no use of US MEC profile data (smoker, age, BMI).
4. **Sources are not evidence.** Response "sources" are two homepage URLs; no label passage, no section, no timestamp — fails the roadmap's "every output must point to the label passage" requirement.
5. **Data layer not deployable**: sql.js full-file rewrite on each save, single-tenant schema (`id = 1` CHECK), `profileMedications` not keyed to a profile, no migrations, no indices, no encryption.
6. **Resilience**: no caching, retries, fallbacks, or rate-limit handling for public APIs (openFDA unauthenticated limit is low; RxNav ~20 req/s); no server-side error middleware; frontend hangs on non-JSON errors.
7. **Quality infrastructure**: no CI, minimal tests (none on the check path), tests mutate the committed DB, compiled `dist` and DB committed, duplicated seed files, template README, no backend lint, no type for sql.js results (`any`).
8. **Unused surface**: `medicationsCatalog`, `defaultRiskNote`, `interactionChecks` history, and profile metrics are collected/stored but never used — both tech debt and an opportunity (history view, MEC rules).

### 5.2 Regulatory / legal
- Current UI gives a student-facing verdict ("High-risk… use backup contraception", "No major interaction signals detected") — the pattern the roadmap identifies as the higher-exposure path under FDA's CDS criteria; no clinician-facing view exists.
- No privacy regime determined (HIPAA vs FERPA vs state law) — depends on buyer; no consent flow, no privacy policy, no data-retention policy, no audit log.
- Any hosted version collecting contraception and medication data from under-25s (some under 18 — age validation allows 12) raises minors/consent and state reproductive-health-data laws (e.g., Washington My Health My Data, state shield laws).
- Monetization ideas in the hackathon notes (pharma ads, data sales to researchers, affiliate links to drug brands) would undermine the regulatory/trust position and should be explicitly disavowed in the investor plan.

### 5.3 Ethical / clinical
- Risk of false reassurance ("Low") and alarm fatigue (over-triggered "High") with no clinician review; no evidence base or validation set yet; no abstention logic beyond "all sources empty."
- Height/weight/age/smoker collected without purpose (data minimization violation in spirit) while not used for the one thing they could legitimately inform (US MEC eligibility, e.g., smoking ≥35 with combined hormonal methods).
- Claims in older docs (ibuprofen + BC raises BP; "majority of college women" take BC plus painkillers; 47.2% statistic) are unverified or misattributed and should not reach investor materials without checking.
- Equity: English-only, web-only, assumes a single user on a private device.

---

## 6. Open questions the roadmap leaves

1. **Interaction data source** — license (DrugBank, Lexicomp, FDB, Medi-Span: cost, redistribution terms), curate a clinician-maintained list (scope: how many pairs; who maintains), or label NLP? Which combination, and what is the Phase 0 budget?
2. **Who is the first customer and under what contract?** Campus health center pilot — paid or free? Which campus ("one where you already have a contact" — NC State is implied by the team docs)? Who signs: student health, pharmacy, or the university's IT/privacy office?
3. **Pricing and revenue model** — the roadmap says "recurring revenue" from "a handful of paid campuses" but gives no price point, contract size, or unit economics; the hackathon docs propose consumer $4.99/month freemium. Which is it, and is a consumer tier compatible with the clinician-in-the-loop FDA posture?
4. **Team and funding** — "a small team working part-time"; who are the founders now (five hackathon names vs. the current repo author), who is the clinical advisor, and what capital or grant covers Phases 0–1? SBIR/STTR requires a small business entity and PI commitment.
5. **Regulatory determination** — is the student-facing product a device? Will the student view be redesigned to "information to discuss," and does the clinician view become the primary product? Which privacy regime applies to a campus deployment (FERPA via student health records vs HIPAA via a covered-entity clinic)?
6. **Validation design** — who labels the 150–300 pairs, what labeling schema (severity, direction, evidence grade), what are acceptable precision/recall thresholds, and how is "dangerous miss" defined and gated?
7. **Reverse check scope** — the teratogen-and-contraception check (Phase 3) needs a source for "medications requiring reliable contraception" (FDA pregnancy categories were retired in favor of PLLR narrative labeling; REMS lists such as isotretinoin iPLEDGE exist) — which source and how maintained?
8. **Platform API** — who are plausible first external partners (telehealth, pharmacy, campus EHRs like Medicat/PyraMED/Point and Click), and what integration standard (FHIR) is assumed?
9. **Competitive landscape** — the roadmap does not discuss Drugs.com/Medscape/Epocrates interaction checkers, Bedsider, Planned Parenthood Direct, Nurx/Hers, or pharmacy DUR systems, nor why a BC-specific check wins against generic tools and existing pharmacist DUR.
10. **Metrics baseline** — process measures are proposed but no baseline (current clinician time per interaction question, current flag volume) or target numbers are set for Gate 3.
11. **Planned Parenthood** — prominent in hackathon materials, absent from the roadmap. Still a partner thesis or dropped?
12. **Statistics refresh** — 2011–2020 data; roadmap itself says refresh before external use. Newer Guttmacher/CDC unintended-pregnancy and contraceptive-use figures should be pulled for the plan.
13. **Local-first vs hosted** — the roadmap values local-only privacy but Phase 1 moves to hosted Postgres with accounts; is a local-first/edge-encrypted architecture an option worth preserving as a differentiator?
