# 01 · Product definition

Part of the DownUnder plan. Index: [00-plan-index.md](./00-plan-index.md). Architecture that implements this: [02-technical-architecture.md](./02-technical-architecture.md). UX: [03-frontend-and-ux.md](./03-frontend-and-ux.md). Business case: [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md). Risks: [06-risks-and-ethics.md](./06-risks-and-ethics.md).

Facts about the current app come from the repo survey in the roadmap extract (commit `74a7fce`, read 2026-11-07). Anything else is marked as a hypothesis or cited.

## 1. One paragraph

DownUnder is a medication-safety check for women who use birth control. A user keeps one profile (contraceptive method, other medications, the few health facts that matter for eligibility) and asks two questions: "does this medication affect my birth control, and does my birth control affect it?" and "what adverse effects does the label report for this medicine on my body, whether or not birth control is involved?" The contraception answer is deterministic where published guidance exists (CDC US MEC, FSRH drug-interaction guidance, FDA labels), cites the exact source passage, says which drug affects which and how, and says "not enough information, ask a pharmacist" when the data is thin. The adverse-effect answer quotes the FDA label (boxed warning, adverse reactions, warnings, contraindications). It is a report of what the label lists, not a prediction of what will happen to her, and a missing list is never shown as "no adverse effects." It is sold to institutions that already answer this question badly or not at all (campus health centers first), with a free patient front door. It is not a diagnosis tool, does not replace a clinician, and never says "safe".

## 2. What the app does today (MVP shell, commit `74a7fce`)

Honest status: a working profile/medication-list CRUD with a live RxNav typeahead and a non-functional interaction verdict.

What works:

- Single local profile: name, age (12–60), height, weight, smoker, free-text conditions; one birth-control method from a seeded catalog of 8 (combined pill, progestin-only pill, hormonal IUD, copper IUD, patch, ring, Depo-Provera, implant).
- Add/remove medications via RxNav `/drugs.json` typeahead (live and working).
- Checker page: pick a medication, press "Check Interaction", see a result card (risk level, one fixed sentence of guidance, "also checked against" list, two disclaimers, two homepage links as "sources").
- Stack: Vite + React 19 + TypeScript frontend, Node + Express 5 + TypeScript backend, SQLite via sql.js (whole file rewritten on each save), no auth, open CORS, no deployment.

What is broken or misleading:

- The core check calls RxNav `/REST/interaction/list.json`, retired by NLM on 2024-01-02; it returns 404, the call is not caught, and the request fails with HTTP 500 whenever the user has a hormonal method with an RxCUI or any profile medication with an RxCUI. That is the primary use case.
- openFDA lookup searches `openfda.generic_name` with RxNav display names like `rifampin 150 MG Oral Capsule [Rifadin]`, which returns nothing; label text is almost always empty in real use.
- Risk scoring is keyword matching over label text: "pregnancy" or "contraindicated" anywhere forces High; non-empty text with no keyword yields "Low — no major interaction signals detected", which is the false-reassurance failure the roadmap warns about.
- No direction (which drug affects which), no mechanism, no birth-control-type specificity (copper IUD is scored like the pill), no use of age/smoking/BMI even though they are collected.
- "Sources" are `rxnav.nlm.nih.gov` and `open.fda.gov` root URLs, not passages.
- Check history is written but never read. Medication catalog and `defaultRiskNote` are seeded but unused.
- Frontend hangs on "Checking…" if the backend returns a non-JSON error.
- Tests: 4 unit tests on the keyword scorer, 1 profile round trip that mutates the committed SQLite file, 2 render tests. No CI.

## 3. What the app does not do (and must say so)

- Does not check whether a medication requires reliable contraception (the reverse / teratogen check). Not built.
- Does not apply US MEC eligibility (e.g., smoking at 35+ with combined hormonal methods, migraine with aura).
- Does not support accounts, more than one user, a clinician, an institution, or any hosted deployment.
- Does not cite evidence, version its rules, or record what source produced a verdict.
- Does not abstain properly: "Unknown" only when every source is empty.
- Does not handle supplements, OTC products, or emergency contraception interactions (e.g., ulipristal acetate followed by starting a hormonal method).

## 4. The user problem and the evidence

Core claim (from the roadmap, sourced): birth control and a woman's other medications are managed by different people and no one is reliably responsible for checking the two against each other. The gap runs both ways.

| Direction | Evidence in hand | Caveat |
|---|---|---|
| Other medicines weaken hormonal birth control | Enzyme inducers (carbamazepine, phenytoin, topiramate, efavirenz, rifampin, St John's wort) clear hormones faster; most antibiotics and most other drugs do not interact (Cleveland Clinic, read 2026-11-07). Combined hormonal methods lower lamotrigine levels (reverse direction). | The task is separating the few that matter from the many that don't, which is exactly what keyword scoring cannot do. |
| Medicines that need reliable contraception are prescribed without it | Panchal et al., JABFM 2019: 25% of women 13–45 at two family-medicine clinics were prescribed a medication with pregnancy risk; 55% of those had no documented contraception; under-25s had about half the odds of receiving contraception (aOR 0.47). Excluding ondansetron, 62% still lacked documented contraception. | One center, 2015 data, ondansetron-heavy. |
| Stakes | 45% of US pregnancies unintended (2011); typical-use pill failure 7%/yr (Sundaram et al., Guttmacher 2017). Most contraceptive pregnancies come from inconsistent/incorrect use (Frost and Darroch 2008). | No source measures how many failures come from interactions. Do not claim it. |
| Women's medication safety is under-served | 2020 review: higher blood concentrations in women for 76 of 86 drugs; ADRs nearly twice as often (Zucker and Prendergast 2020). | General pharmacology, not contraception. |

Newer signals that strengthen "why now" (public, not from the extract; verify wording before external use):

- Opill (norgestrel) was approved for over-the-counter sale by FDA in July 2023 and reached shelves in 2024. OTC use removes the prescriber and pharmacist touchpoint where interaction questions used to get asked.
- GLP-1/GIP agents: the tirzepatide label advises patients on oral contraceptives to switch to a non-oral method or add a barrier method for four weeks after initiation and after each dose escalation. These drugs are now prescribed at scale to women of reproductive age by prescribers who may not manage their contraception.
- Pharmacist-prescribed contraception is authorized in roughly 30 US states (estimate; check the Birth Control Pharmacist tracker), so pharmacists increasingly own the contraception decision without the patient's full medication list.

Untested claim to test in the pilot: students are more exposed to fragmented care (campus clinic, urgent care, telehealth, home providers). No source measures students specifically.

Statistics in the roadmap are 2011–2020 vintage. Refresh (Guttmacher, NCHS) before any external deck. See [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §2 for the figures used in sizing.

## 5. Personas

### 5.1 Maya, 20, student on the combined pill

- Gets the pill from a telehealth service, antibiotics from urgent care, an SSRI from campus counseling, and buys St John's wort and ibuprofen herself.
- Has heard "antibiotics cancel the pill" and does not know which ones actually matter.
- Wants a fast, private answer on her phone; does not want an account that her university can see; will not read a label.
- Success for her: a clear "this one matters / this one doesn't / ask a pharmacist" with one sentence of why and what to do, in under a minute, without being alarmed.
- Failure modes we must prevent: false reassurance; a wall of yellow warnings that she learns to ignore; a data trail she did not consent to.

### 5.2 Dr. Reyes, campus health nurse practitioner

- Sees 20–30 students a day; contraception counseling is a routine visit; interaction questions are answered from memory, Lexicomp, or a call to the pharmacy.
- Documents in a campus EHR (Medicat, PyraMED, Point and Click are the common ones; verify for the pilot campus).
- Wants a view she can trust in front of a student: what flagged, why, from which source, what the guideline says, and a one-click way to record that she reviewed it.
- Her institution's constraints: privacy office sign-off, FERPA/HIPAA determination, procurement on the academic calendar, no budget line for "apps".
- Success for her: fewer interruptions for lookup, a defensible source trail, a teaching aid for the student.

### 5.3 Priya, community or campus pharmacist

- Runs prospective drug utilization review at dispensing; her system (FDB or Medi-Span) fires many low-value alerts, and contraception-specific context (which method, is it hormonal, is it oral) is usually missing because the method came from elsewhere or is OTC.
- Increasingly prescribes contraception herself under state protocols.
- Wants: a method-aware, direction-aware check she can run in 30 seconds, and a patient-facing explanation she can hand over.
- Success for her: catching the inducer or teratogen case that DUR misses because the contraceptive is not in the dispensing record; fewer "is it safe with my pill?" calls.

Administrators (health center director) are a secondary persona: they buy on de-identified cohort analytics and clinician time saved, not on the patient UI.

## 6. Feature roadmap in three horizons

Dependencies refer to items in this table or to gates in [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §9.

### Horizon 1 · Now (Phase 0 → Gate 1 → Phase 1; Nov 2026 – Jul 2027): fix and validate the core

| # | Feature | What | Why | For whom | Dependency |
|---|---|---|---|---|---|
| N1 | Kill the retired call; fail safe | Remove RxNav interaction call; any upstream failure yields "not enough information" and never "no interaction" or a 500. | Headline feature returns 500 today; fail-safe default is the first trust requirement. | All | None. Day 1. |
| N2 | RxNorm normalization | Map any RxCUI (SCD/SBD/brand) to ingredient(s) (IN/MIN/PIN) via RxNav `related` and `properties`; store both. | openFDA and rules operate at ingredient level; display names break lookups today. | Engine | None |
| N3 | Curated rules tables (v1) | Data-not-code tables: enzyme inducers vs combined/progestin-only/implant/injectable/IUD methods; lamotrigine reverse effect; ulipristal; drospirenone + potassium; US MEC categories for smoking, age, migraine with aura, hypertension, VTE history. Each row: direction, mechanism, severity, evidence grade, source citation, version. | This is the validated engine; it must be reviewable by a pharmacist without reading code. | Engine, clinical advisor | N2 |
| N4 | Method-aware logic | Copper IUD and LNG-IUD and implant are not affected by inducers the way pills/patch/ring are (per FSRH/US MEC); logic branches on method category. | Today every method is scored identically. | Patient, clinician | N3 |
| N5 | Direction and mechanism in every result | Result states "X reduces the effectiveness of your pill (enzyme induction)" or "your pill lowers lamotrigine levels". | Roadmap requirement; the thing generic checkers do worst. | All | N3 |
| N6 | Evidence trail | Each result links the specific label section (set_id, section, effective_time) or guideline table row that produced it. | "Every output must point to the label passage." Needed for FDA non-device CDS posture. | Clinician, counsel | N2, N3 |
| N7 | Abstention as a first-class result | Four outcomes: known interaction / possible interaction / none known in our sources / not enough information → ask a pharmacist. "Low/safe" is removed from the vocabulary. | Safety-minded buyers value abstention more than features (roadmap). | All | N3 |
| N8 | openFDA label retrieval done right | Query by `openfda.rxcui` or ingredient; pull `drug_interactions`, `contraindications`, `warnings_and_cautions`, `use_in_specific_populations`; cache; handle multiple labels. | Current query returns nothing. | Engine | N2 |
| N9 | Gold set + eval harness | 150–300 pharmacist-labeled pairs (both directions, all method categories); script reports precision/recall per severity, dangerous-miss count, abstention rate; runs in CI. | The one table that anchors grant, pilot proposal, and deck. Gate 1 criterion. | Founder, advisor, investors | N3, clinical advisor |
| N10 | Clinical advisor onboarding kit | Labeling schema, rules review workflow, sign-off record. | Gate 1 requires advisor signed on. | Advisor | None |
| N11 | Postgres + migrations + multi-profile schema | Replace sql.js; profile-scoped medications; audit log table. | Campus cannot buy a single-tenant local file. | Buyer | None (can start day 1) |
| N12 | Accounts and consent | Patient accounts (email + passkey), explicit consent screens, data export/delete. | Prerequisite for any hosted pilot. | Patient, privacy office | N11 |
| N13 | Clinician view (v1) | Look up a consented patient's check, see flags with evidence, mark "reviewed", add a note. | FDA path and pilot measurement both need it. | Clinician | N6, N12 |
| N14 | Label NLP extraction vs rules baseline | Offline service extracts contraceptive-relevant statements from label text with passage pointers; benchmarked against gold set; never overrides rules. | Covers the long tail the curated table cannot; defensible AI component. | Engine, investors | N8, N9 |
| N15 | Responsive patient web | Mobile-first layout, risk communication per [03-frontend-and-ux.md](./03-frontend-and-ux.md). | Students are on phones; web avoids app-store gating during pilot. | Patient | N7 |
| N16 | De-identified campus analytics (v1) | Counts of checks, flags by category, abstention rate, top method/medication combinations, with k-anonymity threshold. | What a health center director pays for. | Administrator | N11, N12 |
| N17 | Security baseline | Encryption at rest and in transit, secrets management, dependency scanning, pen-test before pilot. | Gate 2 "security review passed". | Buyer | N11 |

### Horizon 2 · Soon (Phase 2–3; Aug 2027 – end 2028): pilot, prove, commercialize

| # | Feature | What | Why | For whom | Dependency |
|---|---|---|---|---|---|
| S1 | Pilot instrumentation | Capture pharmacist-confirmed flags, follow-up advice delivered, clinician minutes saved (self-report + timestamps), repeat use. | Gate 3 evidence. | Buyer, investors | N13, N16 |
| S2 | Reverse (teratogen) check | Table of medications where reliable contraception is recommended or required (REMS such as isotretinoin iPLEDGE and mycophenolate; label PLLR statements; selected classes). Flags when profile has such a drug and no reliable method, or a method vulnerable to the drug. | The Panchal gap; strongest clinician value. | Clinician, pharmacist | N3, N6 |
| S3 | Adherence support (light) | Reminders and "what to do if you missed a dose" per method, following US SPR. | Most failures are inconsistent use; low regulatory risk if guideline-based. | Patient | N15 |
| S4 | Institution admin console | SSO (SAML via campus IdP), roles, clinician roster, consent policy configuration, data retention settings. | Multi-campus sales. | Buyer | N12, N13 |
| S5 | Clinician export | PDF/HL7 note summary to paste or attach in campus EHR. | Fits existing workflow without integration work. | Clinician | N13 |
| S6 | Pharmacist mode | Fast method-plus-list check without patient account; patient hand-out generation. | Second buyer segment entry. | Pharmacist | N7, N5 |
| S7 | Spanish language | Full UI and guidance text; label passages remain English with translation note. | Equity; large Hispanic student populations at target campuses. | Patient | N15 |
| S8 | Rules versioning and change log | Each verdict stores rules version; diff view for advisors; monthly review cadence. | Accuracy must hold on new campus data (Gate 4). | Advisor, counsel | N3 |
| S9 | Licensed interaction dataset integration (if chosen) | Adapter for DrugBank/FDB/Medi-Span as an additional evidence source behind the same engine. | Coverage beyond curated table and labels. | Engine | Data-source decision, budget |
| S10 | Public API (private beta) | Authenticated `/check` API with evidence payload for one telehealth partner. | Prepares Gate 5. | Partner | S8 |

### Horizon 3 · Far (Phase 4–5; 2029+): platform

| # | Feature | What | Why | For whom | Dependency |
|---|---|---|---|---|---|
| F1 | Partner API and FHIR integration | SMART on FHIR app and MedicationStatement/Condition ingestion; outbound Flag resources. | Distribution via EHRs and telehealth. | Partners | S10 |
| F2 | Native mobile (Expo) | Shared TS types and rules package; passkeys; local-first cache. | Push, offline, app-store presence once retention justifies it. | Patient, alumni | N15, S3 |
| F3 | Alumni accounts | Portable profile after graduation; consumer tier remains free. | Retention past campus. | Patient | S4 |
| F4 | Hormonal conditions module | PCOS, endometriosis, hormonal acne medication checks against method and list. | Second module without rebuild (Gate 5). | Patient, clinician | S8 |
| F5 | Pregnancy planning and lactation module | Preconception and breastfeeding checks (LactMed and label PLLR). | Life-stage continuity. | Patient, clinician | F4 pattern |
| F6 | Perimenopause/menopause module | Hormone therapy interaction checks. | Later life-stage buyers. | Patient, clinician | F5 |
| F7 | Preventive care prompts | Cervical screening, HPV vaccination reminders. | Low-risk engagement. | Patient | F3 |
| F8 | Cohort and adherence models | Consented, de-identified longitudinal models; only after real usage data. | Roadmap §1.5 item 4; not promised earlier. | Administrator, payers | F3, data volume |

## 7. Explicit non-goals and retired ideas

- No advertising, no affiliate links to drug brands or pharmacies, no sale or sharing of data with researchers or anyone else, no pharma sponsorship. These hackathon-era ideas conflict with the trust posture and are retired. See [06-risks-and-ethics.md](./06-risks-and-ethics.md) §4.
- No consumer subscription paywall on safety information. The patient front door stays free; institutions pay.
- No "safe"/"green" verdict. No cycle tracking, no fertility awareness features in the core (regulated territory, different product).
- No symptom-based diagnosis.
- No claims of reducing unintended pregnancy until measured.

## Progress log

- 2026-11-07: Initial draft.
