# 04 · Business plan and timeline

Part of the DownUnder plan. Index: [00-plan-index.md](./00-plan-index.md). Product: [01-product-definition.md](./01-product-definition.md). Architecture: [02-technical-architecture.md](./02-technical-architecture.md). Pitch material built from this doc: [05-pitch-and-influence-playbook.md](./05-pitch-and-influence-playbook.md). Risks: [06-risks-and-ethics.md](./06-risks-and-ethics.md).

Every figure below is either (a) from the roadmap extract, (b) a public figure with its source named, or (c) an estimate or hypothesis, labeled as such. Refresh (b) before any external deck; several are 2017–2020 vintage.

## 1. Business model in one paragraph

DownUnder is a Sandai-backed venture that sells a validated, clinician-in-the-loop contraception-and-medication safety check to institutions, starting with campus health centers, then contraception telehealth providers and pharmacies, later payers and employers. Students and other patients use it free; institutions pay for the clinician console, de-identified analytics, SSO/tenancy, and the evidence trail. Revenue is subscription (per institution, tiered) and, later, usage-based API fees. There are no ads, no affiliate links, no data sales, and no consumer paywall on safety information; the hackathon-era ideas (freemium $4.99/month, pharma ads, affiliate links, "anonymized data sales to researchers") are retired because they conflict with the trust posture that the buyers, the regulators, and the users require.

## 2. Market sizing

### 2.1 Population figures used

| Figure | Value | Source / label |
|---|---|---|
| US women aged 15–49 | ~76 million | Estimate from US Census population estimates; verify current year |
| Women 15–49 currently using any contraception | 65.3% (2017–2019) | NCHS Data Brief 388 (Daniels and Abma, 2020); verify before external use |
| Most common methods among women 15–49 | Female sterilization 18.1%, pill 14.0%, LARC 10.4%, male condom 8.4% | NCHS Data Brief 388; verify |
| Women using a hormonal method (pill, hormonal IUD, implant, injection, patch, ring) | ~25% of 15–49 → ~19 million | Estimate derived from the above (LARC split and injectable/patch/ring shares assumed) |
| Women enrolled in US degree-granting institutions | ~11 million | Estimate from NCES total enrollment (~19 million) and ~58% female share; hackathon deck used 10 million |
| US degree-granting postsecondary institutions | ~3,900 | NCES; estimate |
| Institutions with a student health service | ~1,500–2,000 | Estimate; ACHA reports several hundred institutional members; verify count |
| US community pharmacies | ~60,000 | Estimate from NCPA/NACDS industry figures |
| States authorizing pharmacist-prescribed contraception | ~30 plus DC | Estimate; check Birth Control Pharmacist policy tracker |
| Unintended pregnancies (share of US pregnancies, 2011) | 45% | Sundaram et al., Guttmacher 2017 (from extract) |
| Pill typical-use first-year failure | 7% | Sundaram et al., Guttmacher 2017 (from extract) |
| Women 13–45 prescribed a pregnancy-risk medication; share without documented contraception | 25%; 55% | Panchal et al., JABFM 2019 (from extract; one center, 2015 data) |

### 2.2 TAM / SAM / SOM (annual recurring revenue, US)

Assumptions are explicit so Gavin can defend or change them.

| Segment | Units | Price hypothesis | TAM (est.) |
|---|---|---|---|
| Campus health centers | ~1,800 institutions with health services | $15k average per year (tiered by enrollment, §3) | ~$27M |
| Contraception and women's telehealth | ~15 meaningful providers plus large multi-condition platforms; ~5 million women served per year (estimate) | $0.50 per active member per year equivalent (platform fee plus per-check) | ~$3M direct; strategic value exceeds revenue |
| Pharmacies (pharmacist mode, DUR gap-fill) | ~60,000 stores; realistically chains and independents in pharmacist-prescribing states (~35,000) | $50 per store per month | ~$36M |
| Payers and employers (women 15–49 covered lives) | ~50 million commercially insured women of reproductive age (estimate) | $0.10 PMPM | ~$60M |
| Platform modules (hormonal conditions, pregnancy/lactation, menopause) | Same buyers, additional modules | 50–100% uplift on core | ~$60M+ |
| Total US TAM | | | ~$180–250M per year (estimate) |

- SAM (reachable in 3–4 years with the product described): campuses with health services and a pharmacy or NP-led contraception service (~1,000), contraception telehealth providers, pharmacies in pharmacist-prescribing states where chains run pilots: ~$40–60M per year (estimate).
- SOM by end of 2030 (Phase 5 start): 40 paying campuses (~$600k), 2 telehealth API partners (~$300k), 1 pharmacy chain pilot-to-contract (~$500k), early payer pilot (~$300k): ~$1.5–2M ARR (estimate). This is small; the investor story is (1) a wedge that no incumbent owns, (2) retention into a system of record for women's medication and hormonal context, and (3) module expansion that multiplies ACV with the same buyers. Say that plainly rather than inflating TAM.

### 2.3 Why the market is reachable now
- OTC Opill (FDA approval July 2023; retail 2024) removes the prescriber and pharmacist from the loop for a growing share of pill users (public fact; share of users is not yet published, do not estimate it externally).
- GLP-1/GIP agents prescribed at scale to women of reproductive age with label-level contraception guidance (tirzepatide label).
- Pharmacist prescribing of contraception in ~30 states creates a buyer who owns the contraception decision without the full medication list.
- Post-Dobbs sensitivity makes privacy-first, no-ads positioning a purchasing criterion for campuses and telehealth, not a nicety.
- FDA's January 2026 CDS guidance revision kept the non-device CDS framework (extract §1.9), so a clinician-facing, evidence-visible product has a clear posture.

## 3. Buyer segments and pricing hypotheses

| Segment | Who signs | What they buy | Price hypothesis (annual) | Sales cycle | Proof they need |
|---|---|---|---|---|---|
| Campus health center (first) | Health center director; privacy office and IT security sign off; sometimes student government for fee-funded items | Clinician console, student front door branded for the campus, analytics, SSO, BAA/FERPA agreement | <5k students $6k; 5–15k $12k; 15–30k $20k; >30k $30k. Pilot year: $0–5k with a signed letter of intent for paid year two | 6–12 months; decisions align to August semester start and spring budget cycle | Gold-set accuracy table; privacy review pack; a peer campus reference |
| Contraception telehealth (second) | VP Clinical or Head of Product | API: method-aware check at intake and at refill; patient-facing explanation; evidence payload | $3k–5k per month platform fee plus $0.10–0.25 per check, or $0.03–0.05 per active member per month | 3–6 months | Accuracy table; latency and uptime SLO; pharmacist review workflow |
| Pharmacies (third) | Chain clinical services lead; independent owner | Pharmacist mode; patient hand-out; DUR gap-fill for OTC and external methods | $40–80 per store per month; enterprise license for chains | 6–12 months (chains), weeks (independents) | Pilot data on catches DUR missed; time per check |
| Payers and employers (later) | Medical director; benefits lead | PMPM for women 15–49; member app access; de-identified outcome reporting | $0.05–0.15 PMPM | 9–18 months | Outcome evidence from campus and telehealth; actuarial case |
| Consumers | n/a | Free forever; no-account mode | $0 | n/a | Trust |

All prices are hypotheses to test in the first ten buyer conversations. Suggested test: present the campus tier sheet and ask "which tier would you be in and what would make this a no-brainer", then listen. How the tiers, the blends, and the market totals were built, and which sources do and do not support them, is in [pricing-hypothesis.md](./pricing-hypothesis.md).

## 4. Go-to-market

### 4.1 Campus wedge (2027–2028)
- Pick the pilot where there is already a contact (the hackathon team's NC State and Raleigh clinic links are the obvious starting point; confirm who still has the relationship).
- Sell to the problem owner: the nurse practitioner or pharmacist who answers interaction questions today, then let her bring the director.
- Enter via the grant-and-pilot door, not procurement: a no-cost or $5k pilot with an IRB-exempt quality-improvement protocol, with the health center as co-author on the write-up. Health centers value publications and ACHA presentations.
- Channel: ACHA annual meeting (late May/June) and regional affiliates; campus pharmacy associations; the campus EHR vendors (Medicat, PyraMED, Point and Click) as later integration partners.
- Asset to produce first: a four-page pilot proposal (problem, what we measure, what we need from the campus, privacy pack, timeline). See roadmap §1.11.

### 4.2 Telehealth and pharmacy (2028–2029)
- Telehealth: approach clinical leads with the gold-set table and an API sandbox; offer a 90-day shadow mode (we score their intake data in a de-identified sandbox and report what they would have caught).
- Pharmacy: start with independents in a pharmacist-prescribing state near the pilot campus; use pharmacist-mode usage data to approach a regional chain.

### 4.3 Payers and platform (2029+)
- Only with outcome data; approach via a Medicaid managed-care plan interested in contraceptive access measures.

### 4.4 Consumer front door
- Free, no-account mode on the web; discovered through the campus, pharmacist hand-outs, and search. No paid acquisition. Its job is trust and top-of-funnel for institutional sales (students asking the health center "do you have DownUnder?").

## 5. Competitive landscape and the wedge

| Player | What they do | Where they fall short for this problem | Our relation |
|---|---|---|---|
| Lexicomp / UpToDate (Wolters Kluwer), Micromedex (Merative), Epocrates (athenahealth) | Clinician drug references with general DDI checkers | General, not method-aware; no patient view; no "which method is unaffected"; no abstention concept; expensive for a campus clinic; no campus analytics | Reference standard we validate against; not displaced |
| First Databank, Medi-Span, Elsevier Gold Standard | DDI data embedded in pharmacy and EHR systems (prospective DUR mandated since OBRA '90 for Medicaid) | Fires on what is in the dispensing record; misses OTC Opill, methods dispensed elsewhere, IUDs/implants; notorious alert fatigue | Potential data licensor; complementary |
| Drugs.com, Medscape, WebMD, GoodRx interaction checkers | Free consumer/clinician general checkers | Ad-supported; not method-aware; no evidence passages; GoodRx paid $1.5M in a 2023 FTC Health Breach Notification Rule action over sharing health data with advertisers (public) | Illustrates why no-ads matters |
| Medisafe | Consumer adherence app with interaction alerts; pharma-partnered | General DDI; pharma relationships; not contraception-specific; not sold to campuses | Adjacent; shows adherence demand |
| Bedsider (Power to Decide) | Method education, reminders, clinic finder | No interaction checking; not a clinical tool | Content partner candidate |
| Planned Parenthood Direct, Nurx (Thirty Madison), Hers, Twentyeight Health | Telehealth contraception prescribing with intake questionnaires | Screen for their own prescription at intake; no ongoing check when a new drug is added elsewhere; no evidence passages for the patient | Target API customers |
| Flo, Clue, Natural Cycles | Cycle tracking (Natural Cycles is FDA-cleared as a contraceptive) | Different job; Flo's 2021 FTC settlement over data sharing is the cautionary tale | Not competitors; possible distribution later |
| Campus EHR vendors (Medicat, PyraMED, Point and Click) | Campus clinic systems of record | Could add a generic checker; unlikely to build method-aware bidirectional logic with a patient view | Integration partners; medium-term acquirer candidates |

The wedge: the only product that is method-aware, bidirectional (including "this drug needs reliable contraception"), evidence-cited to the passage, abstains honestly, has a clinician loop, and is free to the patient with no data monetization, sold to the institution where nobody currently owns the problem. Generic checkers answer "do these two drugs interact"; DownUnder answers "is my birth control still working, and should I be on birth control given what I take".

Defensibility, honestly: the curated tables are reproducible by a competent team; the moat is the validated gold set and published accuracy, the clinician-review data, the campus relationships and privacy approvals, and later the consented longitudinal profile. Move fast on the evidence, not on features.

## 6. Regulatory path

| Area | Position | Action and timing |
|---|---|---|
| FDA | Design to non-device CDS criteria; clinician view primary; patient view informational with evidence; no patient-specific directives; document the analysis | Regulatory consult in Phase 0; counsel review of patient copy before pilot; re-check at each new module |
| HIPAA vs FERPA | Depends on the campus clinic; support BAA and FERPA school-official agreements | Counsel determination per pilot; template agreements drafted in Phase 1 |
| State consumer health data laws (WA MHMDA, NV, CT, others) | Consumer front door complies regardless: consent, no sale, geofencing-free, access/delete rights | Privacy policy and consent flows in Phase 1; state tracker reviewed quarterly |
| FTC Health Breach Notification Rule and Section 5 | Applies to the consumer app outside HIPAA; no sharing with advertisers; breach notification procedures | Policy and incident plan in Phase 1 |
| Minors | Minimum age 13 for accounts (COPPA below 13); tenant-configurable under-18 consent policy aligned with state minor-consent-to-contraception laws | Counsel in Phase 0; see [06-risks-and-ethics.md](./06-risks-and-ethics.md) §3.4 |
| Reproductive health data post-Dobbs | Data minimization, short retention, US residency, subpoena policy, no location data; HIPAA 2024 reproductive-health privacy rule status must be verified (reported vacated in 2025) | Policy before pilot |
| State pharmacy practice | Pharmacist mode supports, does not replace, professional judgment | Advisor review of pharmacist copy |
| Claims | Process measures only; no outcome claims until measured | Marketing review checklist |
| Grants | NIH SBIR/STTR eligibility requires a US small business majority-owned by individuals or other small businesses; Sandai ownership structure affects eligibility | Decide entity structure before applying (Phase 0) |

## 7. Unit economics sketch (hypotheses)

| Item | Hypothesis | Note |
|---|---|---|
| Campus ACV | $12k (median tier) | §3 |
| Platform hosting (all tenants) | $500–1,500 per month at pilot scale; scales sub-linearly | AWS with BAA; estimate |
| Licensed data (if adopted at Gate 2) | $30k–100k per year | Vendor-confidential; estimate |
| Clinical review and rules maintenance | 0.2 FTE pharmacist (~$30k per year) | Estimate |
| Gross margin at 20 campuses | ~75–85% | Depends on data license |
| Campus CAC | $5k–10k (conference, travel, founder time, pilot concessions) | Estimate |
| Payback | <12 months at $12k ACV | |
| Gross retention | 85–90% once embedded in clinic workflow | Hypothesis; campus software renewals are sticky but budget-sensitive |
| Telehealth API | Near-zero marginal cost per check; margin >90% | |
| Break-even | ~60 campus-equivalents at a 3-person team (~$600k burn) | Estimate |

## 8. Funding asks by stage

| Stage | When | Amount (est.) | Source | Spend | Milestone that unlocks the next |
|---|---|---|---|---|---|
| Sandai commitment (pre-seed) | Nov 2026 – Jul 2027 | $300k–600k cash and in-kind (engineering time, legal, cloud credits) | Sandai; possibly NIH SBIR Phase I (~$300k; NICHD or AHRQ; eligibility depends on entity structure) | Clinical advisor stipend, regulatory and privacy counsel, 1 contract engineer, pharmacist labeling, hosting | Gate 1 (gold set scored) and Gate 2 (security review, pilot agreed) |
| Pilot bridge | Aug 2027 – Jan 2028 | $200k–400k | Sandai, women's-health foundation grant, angel | Pilot ops, security, analytics | Gate 3 (pilot written up, paid conversion or second campus) |
| Seed | Q1–Q2 2028 | $2M–3.5M for 18–24 months | Health-tech seed funds, Sandai pro-rata | 2 engineers, clinical lead (pharmacist), part-time sales/partnerships, counsel, data license, 5–10 campuses, telehealth API beta | Gate 4 (recurring revenue, accuracy held, privacy and FDA path confirmed) |
| Series A | 2029 | $8M–15M | Health-tech growth funds, strategic (pharmacy or EHR vendor) | Sales team, platform API, second module, payer pilots | Gate 5 (external partner on API, second module shipped) |

All amounts are estimates; set them with Sandai's CEO once the relationship structure is decided (see open decisions in [00-plan-index.md](./00-plan-index.md)).

## 9. Timeline: from the first Sandai conversation to platform

Aligned to the roadmap's six phases and five gates. "Owner" uses roles until people are named: Gavin (founder), CEO (Sandai), Advisor (clinical), Counsel, Champion (pilot campus clinician), Eng (Gavin plus contractor).

### Phase 0 · Validate and harden (Nov 2026 – Feb 2027)

| # | Step | When | Goal | Owner | Exit criteria | What could kill it |
|---|---|---|---|---|---|---|
| 0.1 | First conversation with Sandai CEO | Nov 2026 | Agreement in principle to back DownUnder; decide structure (spinout, internal venture, sponsored project) and IP | Gavin | CEO says yes to a defined next step: a 4-week scoping sprint with named resources; IP position stated | CEO sees it as a side project; unclear IP; Gavin asks for too much or nothing (see [05-pitch-and-influence-playbook.md](./05-pitch-and-influence-playbook.md)) |
| 0.2 | Scoping sprint | Nov–Dec 2026 | Repo hygiene; remove retired call; fail-safe vocabulary; first rules table; honest demo | Eng | Demo runs end to end without 500s; 12+ rules rows; `insufficient_information` on any failure | Time; scope creep into features |
| 0.3 | Entity and IP decision | Dec 2026 | Legal form that allows grants and investment | CEO, Gavin, Counsel | Entity formed or decision documented; invention-assignment status clear | Employment agreement conflicts; SBIR eligibility blocked by ownership |
| 0.4 | Recruit clinical advisor | Nov 2026 – Jan 2027 | Pharmacist or campus NP with contraception expertise, paid stipend plus small equity | Gavin | Signed advisor agreement; labeling schema approved | No network; unpaid ask; advisor wants employment |
| 0.5 | Regulatory and privacy consult | Jan 2027 | Non-device CDS analysis; HIPAA/FERPA/state matrix; minors policy | Counsel | Written memo; patient-copy guardrails list | Memo says patient view is a device without redesign; budget |
| 0.6 | Gold set v1 | Dec 2026 – Feb 2027 | 150–300 labeled pairs; harness in CI | Advisor, Eng | Precision/recall table; zero dangerous misses on `known` items; abstention rate reported | Labeler disagreement; schema churn; advisor time |
| 0.7 | Data-source decision | Feb 2027 | Curated tables plus mirrored labels for pilot; license decision deferred to Gate 2 with cost quotes in hand | Gavin, Advisor | Decision memo with vendor quotes | Vendor redistribution terms block patient display |
| Gate 1 | | end Feb 2027 | Advisor signed on and gold set scored with dangerous misses reviewed | CEO review | Go/no-go with CEO | Accuracy table is weak; nobody owns it |

### Phase 1 · Build the sellable product (Mar – Jul 2027)

| # | Step | When | Goal | Owner | Exit criteria | What could kill it |
|---|---|---|---|---|---|---|
| 1.1 | Pilot prospecting | Mar–Apr 2027 | 5 campus conversations; 1 champion | Gavin, CEO intro | Signed pilot LOI by June for August start | Academic calendar missed → slips to Jan 2028 |
| 1.2 | Postgres, accounts, consent, tenancy, audit | Mar–May 2027 | Deployable multi-tenant platform | Eng | Staging on AWS; threat model; tests | Contractor availability |
| 1.3 | Clinician view v1 and patient web v1 | Apr–Jun 2027 | Pilot UX per [03-frontend-and-ux.md](./03-frontend-and-ux.md) | Eng, Advisor | Comprehension testing ≥85% correct action recall with 8–12 students | Copy fails counsel review; accessibility gaps |
| 1.4 | Label extraction vs rules | Apr–Jul 2027 | Python service; benchmark | Eng | Model matches rules on dangerous misses, adds coverage | Overfitting to gold set; extraction noise |
| 1.5 | Campus analytics v1 | Jun–Jul 2027 | Director dashboard with small-cell suppression | Eng | Privacy office approves | Re-identification concerns |
| 1.6 | Security review and pen test | Jul 2027 | Pass campus IT security questionnaire (HECVAT) | Eng, Counsel | HECVAT completed; findings fixed | Budget; findings |
| 1.7 | Grant application | Mar–Jun 2027 (deadline-dependent) | SBIR Phase I or foundation grant | Gavin, Advisor | Submitted | Eligibility; PI time commitment |
| 1.8 | Pilot agreement signed | Jun–Jul 2027 | BAA or FERPA agreement; QI protocol; metrics baseline | Gavin, Champion, Counsel | Signed; baseline measured (current clinician minutes per interaction question, flag volume) | Procurement; privacy office |
| Gate 2 | | end Jul 2027 | Model matches rules on dangerous misses; security review passed; pilot agreed | CEO review | Go/no-go; bridge funding | Pilot not signed in time |

### Phase 2 · Campus pilot (Aug – Dec 2027)

| # | Step | When | Goal | Owner | Exit criteria | What could kill it |
|---|---|---|---|---|---|---|
| 2.1 | Launch at pilot campus | Aug 2027 | Live for students and clinicians | Eng, Champion | Orientation-week availability; clinicians trained | Launch slips past orientation |
| 2.2 | Measure | Aug–Dec 2027 | Pharmacist-confirmed flags; follow-up advice delivered; clinician time saved; repeat use; abstention rate; comprehension | Champion, Gavin | Monthly reports; mid-pilot fixes | Low usage; clinicians don't open the console |
| 2.3 | Rules review cadence | Monthly | Advisor reviews flagged misses and new labels | Advisor | Change log | Advisor bandwidth |
| 2.4 | Second-campus and telehealth conversations | Oct–Dec 2027 | Pipeline for Phase 3 | Gavin, CEO | 2 LOIs | Pilot data not yet compelling |
| 2.5 | Write-up | Dec 2027 – Jan 2028 | Pilot report; ACHA abstract; grant progress report | Gavin, Champion, Advisor | Published report; one accuracy table; one usage table | Weak results; honest write-up still useful |
| Gate 3 | | Jan 2028 | Pilot results written up; paid conversion or second campus committed | CEO, investors | Seed process starts | No conversion |

### Phase 3 · Commercialize the core (2028)

| # | Step | When | Goal | Owner | Exit criteria | What could kill it |
|---|---|---|---|---|---|---|
| 3.1 | Seed raise | Q1–Q2 2028 | $2–3.5M | Gavin, CEO | Closed | Market; weak pilot |
| 3.2 | Hire clinical lead and 2 engineers | Q2 2028 | Team | Gavin | Hired | Talent in a niche |
| 3.3 | 5–10 paid campuses | 2028 (August cohort) | Recurring revenue | Sales (part-time), Gavin | $100k+ ARR | Sales cycle; pricing wrong |
| 3.4 | Reverse (teratogen) check | H1 2028 | Second flagship capability | Eng, Advisor | Gold set extended; shipped | Source maintenance burden |
| 3.5 | Adherence support | H2 2028 | Light reminders per US SPR | Eng | Opt-in usage | Regulatory scope |
| 3.6 | Telehealth API beta | H2 2028 | One partner in shadow mode | Eng, Gavin | Shadow-mode report | Partner priorities |
| 3.7 | Data license decision executed | 2028 | Coverage gap closed if needed | Gavin | Contract or documented no | Cost; terms |
| Gate 4 | | end 2028 | Recurring revenue; accuracy held on new campus data; privacy and FDA path confirmed | Board | Series A prep | Accuracy regressions on new populations |

### Phase 4 · Open the platform (2029)

| # | Step | When | Goal | Owner | Exit criteria | What could kill it |
|---|---|---|---|---|---|---|
| 4.1 | Partner API GA and SMART on FHIR | H1 2029 | External partner live | Eng | One partner in production | Integration costs |
| 4.2 | Expo mobile | 2029 | Native app sharing TS packages | Eng | App-store release with privacy labels | Retention doesn't justify |
| 4.3 | Alumni accounts | 2029 | Retention past graduation | Eng | Portable profile | Low demand |
| 4.4 | Second module (hormonal conditions or pregnancy/lactation) | 2029 | Ships without core rebuild | Eng, Advisor, Counsel | Shipped; counsel review | Scope creep; regulatory |
| 4.5 | Series A | 2029 | $8–15M | CEO, Gavin | Closed | Traction |
| Gate 5 | | end 2029 | Outside partner on API; second module shipped without rebuild | Board | Platform stage | |

### Phase 5 · Life-stage platform (2030+)
Menopause and preventive-care modules; employer, health-plan, telehealth buyers; cohort and adherence models only with consented data volume. Detail intentionally light, as in the roadmap.

## 10. Metrics that matter per stage

| Stage | Metric | Target (hypothesis) |
|---|---|---|
| Gate 1 | Dangerous misses on gold set | 0 |
| Gate 1 | Precision / recall on `known_interaction` | ≥0.95 / ≥0.95 |
| Gate 1 | Abstention rate on items with evidence available | ≤15% |
| Pilot | Clinician-confirmed flags per 100 checks | Baseline then ≥ previous month |
| Pilot | Clinician minutes per interaction question | −50% vs baseline |
| Pilot | Repeat use within 90 days | ≥30% of accounts |
| Pilot | Correct next-action recall (comprehension) | ≥85% |
| Phase 3 | ARR; gross retention; CAC payback | $100k+; ≥85%; <12 months |
| Phase 4 | Partner API uptime and p95 latency | 99.9%; <500 ms |

## Progress log

- 2026-11-07: Initial draft.
