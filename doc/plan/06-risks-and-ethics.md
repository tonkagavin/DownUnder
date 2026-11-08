# 06 · Risks and ethics

Part of the DownUnder plan. Index: [00-plan-index.md](./00-plan-index.md). Mitigations reference features in [01-product-definition.md](./01-product-definition.md) and design in [02-technical-architecture.md](./02-technical-architecture.md) and [03-frontend-and-ux.md](./03-frontend-and-ux.md). Objection handling built on this register: [05-pitch-and-influence-playbook.md](./05-pitch-and-influence-playbook.md) §4.

Scales: Likelihood L/M/H over the next 24 months; Impact L/M/H on users (harm) or on the venture (existential). Owner roles until named: Gavin, Advisor (clinical), Counsel, Eng, CEO (Sandai).

## 1. The hardest challenge first

The product's value proposition, "we tell you which of the many interactions actually matters", is also its most dangerous failure mode. A tool that says "no known interaction" is more consequential than one that says nothing, because it changes behavior: a student who would have used condoms, or asked, may not. Every other risk below is downstream of this one. The design response is to make "none known in our sources" a scoped statement, make abstention a first-class output, validate against pharmacist labels with a zero-dangerous-miss gate, and keep a clinician in the loop for anything institutional. If those controls are ever traded for growth, the product should not ship.

## 2. Technical risks

| # | Risk | Likelihood | Impact | Mitigation | Owner | Open question |
|---|---|---|---|---|---|---|
| T1 | Data source reliability: RxNav rate limits or outages; openFDA label gaps, stale labels, mislabeled `openfda` fields; a second NLM retirement like the 2024 interaction API | H | H | Nightly mirrors (RxNorm release, openFDA bulk, DailyMed SPL) so the request path never depends on a live public API; fail to `insufficient_information`; monitor abstention-rate spikes as an outage signal; guideline-derived tables are the primary source, labels secondary | Eng | Budget and timing for a commercial license as a third source |
| T2 | False negatives (dangerous misses): an inducer, absorption effect, or needs-contraception drug not in tables and not extracted | M | H | Gold set stratified for dangerous items; CI gate: zero dangerous misses; class-level rules via RxClass to catch new members of known classes (e.g., new rifamycins); monthly advisor review of new labels; "report a problem" on every result | Advisor, Eng | What is the acceptable recall floor for `possible_interaction` where guidelines are silent? |
| T3 | False positives and alarm fatigue: over-flagging (today's keyword engine flags "pregnancy" anywhere) trains users to ignore results | H today, M after rebuild | M | Remove keyword scoring; guideline-first rules; "boring but true" messaging for non-interactors; measure false-alarm rate on the deliberately boring gold-set items; comprehension testing | Eng, Advisor | Target false-alarm ceiling? Proposed ≤5% on boring items |
| T4 | Abstention rate too high: if 40% of checks say "ask a pharmacist", the product is a referral button | M | M (venture) | Track abstention on items with evidence available (target ≤15%); grow tables where abstention clusters; RxNorm normalization fixes most "could not identify" cases; supplements need a separate strategy (NHP database or curated list) | Eng | How to handle supplements without RxNorm concepts? |
| T5 | Model drift and extraction noise: label wording changes; LLM-based extraction varies between runs or model versions | M | M | Extraction is offline, versioned, and benchmarked per release; deterministic prompts with pinned model versions; extraction can only add `possible`, never remove or upgrade to `known`; re-run gold set on each model or label-mirror update | Eng | Will we need a fine-tuned local model to avoid vendor model churn? |
| T6 | Scope creep: general DDI, cycle tracking, symptom checking, pregnancy modules before Stage 1 is proven | H | H (venture and regulatory) | Gates in the roadmap; counsel before each module; UI states scope explicitly; a "not in scope" list in [01-product-definition.md](./01-product-definition.md) §7 | Gavin, CEO | Who has veto power over scope: advisor, counsel, or board? |
| T7 | Normalization errors: wrong RxCUI from typeahead (brand confusion, combination products, salt forms) | M | H | Disambiguation UI; MIN-to-IN expansion; show resolved ingredients to the user; treat unresolved as `insufficient_information` | Eng | Handling of compounded or foreign products? |
| T8 | Rules-table maintenance debt: guidelines update (US MEC 2024 replaced 2016), labels change, advisor leaves | M | H | Tables versioned with `review_due`; quarterly review cadence; second reviewer by Phase 3; change log visible in clinician UI | Advisor, Gavin | Succession plan for the clinical owner |
| T9 | Security breach of PHI | M | H | AWS with BAA; encryption; RLS; audit logs; pen test before pilot; minimal data; short retention; incident plan; cyber insurance | Eng, Counsel | Budget for annual pen test and SOC 2 timeline |
| T10 | Single-engineer dependency on Gavin | H | H (venture) | Documentation; infra as code; contractor from Phase 0; hire at seed | CEO, Gavin | Sandai's engineering support commitment |
| T11 | Hosting vendor lock-in or BAA changes | L | M | Containers; Postgres; infra as code; avoid proprietary services beyond RDS, KMS, Cognito behind interfaces | Eng | |
| T12 | Multi-tenant leakage (one campus seeing another's data) | L | H | RLS at the database; tenant context tests; analytics small-cell suppression | Eng | |

## 3. Ethical risks

| # | Risk | Likelihood | Impact | Mitigation | Owner | Open question |
|---|---|---|---|---|---|---|
| E1 | Harm from wrong reassurance: a user stops backup contraception or ignores a teratogen warning because the tool said nothing was found | M | H | No "safe" vocabulary; `none_known` is scoped and names sources; pharmacist CTA on every result; comprehension testing shows users understand the boundary; zero-dangerous-miss gate; clinician loop institutionally | Advisor, Eng | Should `none_known` require a clinician confirmation before display in the patient view during pilot? |
| E2 | Equity: who is left out | H | M–H | Spanish in Horizon 2; plain language grade 6–8; WCAG 2.2 AA; works on low-end phones and slow Wi-Fi; no-account mode for those who distrust institutions; include OTC and low-cost methods; design for trans and nonbinary people who use contraception (inclusive copy, no assumption of gender identity from method); campus wedge excludes students at institutions without health services (often community colleges) — plan a public no-account version from day one so they are not excluded by the sales model | Gavin, Advisor | Which campuses in the pilot pipeline serve the students most at risk, not just the easiest to sell to? |
| E3 | Privacy of reproductive health data post-Dobbs; state-level risk of data being sought in investigations | M | H | Data minimization (no location, no cycle data, year-month DOB); short default retention; local-first no-account mode; US residency with no cross-state inference; no third-party SDKs; encryption; a written subpoena and law-enforcement request policy (notify user where lawful, require valid process, challenge overbroad requests); transparency report; consider not storing method history for consumer accounts by default | Counsel, Gavin | Should consumer accounts be designed so that we cannot produce method history even under valid process (end-to-end encryption with user-held keys)? Cost vs benefit |
| E4 | Minors on campus (16–17-year-olds, dual-enrolled students) and parental access | M | H | Minimum account age 13 (COPPA); tenant-configurable under-18 policy aligned with state minor-consent-to-contraception laws; no parental portal; no data to the institution without consent; counsel review per state | Counsel | How to verify age without collecting more data? |
| E5 | Clinician deskilling and over-reliance | M | M | Evidence panel open by default; "independent review" affordance; rules and sources browsable; no auto-documentation without clinician action; training materials frame it as a second check | Advisor | Measure whether clinicians still consult primary sources after six months |
| E6 | Liability and the information/advice line | M | H | Non-device CDS design; informational patient copy; counsel review; disclaimers that are accurate, not boilerplate; product liability insurance; incident review process for any reported harm | Counsel, CEO | Insurance cost and coverage for a pre-revenue venture |
| E7 | Dark patterns and engagement pressure | L now, M under growth pressure | H (trust) | No streaks, no guilt notifications, no fake urgency, no pre-checked consent, no confirm-shaming on delete; UI review checklist; board-level commitment in the operating principles | Gavin, CEO | Who audits the UI for dark patterns before each release? |
| E8 | Institutional surveillance: a campus using analytics or clinician access to identify students | L | H | Small-cell suppression (<10); no individual-level data to administrators; clinician access requires patient share or documented treatment relationship, logged and visible to the patient; contract clauses prohibiting re-identification | Counsel, Eng | Threshold choice and auditing of tenant admin behavior |
| E9 | Overclaiming outcomes (fewer pregnancies, lives saved) | M | H (credibility, FTC) | Process measures only; marketing review checklist; statistics refreshed and sourced; "estimate" labels in all materials | Gavin | |
| E10 | Conflicts of interest: pharma, pharmacy, or telehealth partners influencing rules or recommendations | L | H | Rules sourced only from guidelines, labels, and advisor review; partners get API access, never rules influence; disclosed funding; no drug or brand recommendations | CEO, Advisor | Governance document before first partner contract |
| E11 | Unverified claims inherited from hackathon materials (ibuprofen raises BP with BC; "majority of college women"; 47.2% hormonal use) reaching investors | M | M | Purge from all materials; cite only verified figures; this plan marks estimates | Gavin | |
| E12 | Sandai brand and governance risk: a safety product with Sandai's name on it fails publicly | L | H (for Sandai) | Gates with CEO review; incident plan; clear scope statements; honest comms | CEO | Does Sandai want its name on the patient-facing product? |

## 4. What we will never do

Operating commitments to be adopted by the founder and Sandai and written into the operating agreement or charter:

1. Never sell, share, or license user data to anyone, including researchers, advertisers, or partners. De-identified aggregates are shown only to the paying institution about its own population, with small-cell suppression, and never leave the platform.
2. Never run advertising, affiliate links, sponsored content, or pharma-funded features.
3. Never use the word "safe", "protected", or a green checkmark to describe a medication-and-method combination.
4. Never present a verdict without the source that produced it.
5. Never let a model override a guideline-derived rule.
6. Never send patient data to a third-party model or analytics service.
7. Never collect location, cycle, or sexual-activity data in the core product.
8. Never paywall safety information for patients.
9. Never use engagement dark patterns (streaks, guilt, fake urgency, pre-checked consent, confirm-shaming).
10. Never claim outcomes we have not measured.
11. Never expand into a new clinical module without clinical and legal review documented first.
12. Never comply with a data request without valid legal process, and always notify the user when lawful.

## 5. Risk review cadence

- Phase 0–2: monthly review of T2, T3, T4, E1, E3 using the eval harness and pilot data; quarterly review of the full register with the advisor and counsel.
- Each gate: register re-scored; any H/H risk without a funded mitigation blocks the gate.
- Incidents: any report of possible harm triggers a 48-hour review with the advisor; outcomes logged and, where appropriate, disclosed to the affected institution.

## 6. Open questions that need a decision owner

1. Should `none_known` be gated behind clinician confirmation in the patient view during the pilot? (E1)
2. End-to-end encryption with user-held keys for consumer accounts: worth the recovery and support cost? (E3)
3. Who has scope veto power? (T6)
4. Commercial data license: when and which, if the gold set shows coverage gaps? (T1, T4)
5. Which pilot campuses serve the most exposed students, and how is that weighed against ease of sale? (E2)
6. Does Sandai's name go on the patient-facing product? (E12)
7. Insurance scope and cost before pilot. (E6)

## Progress log

- 2026-11-07: Initial draft.
