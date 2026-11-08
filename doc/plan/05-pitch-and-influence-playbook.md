# 05 · Pitch and influence playbook (for Gavin)

Part of the DownUnder plan. Index: [00-plan-index.md](./00-plan-index.md). Numbers and timeline behind every claim here: [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md). Product honesty: [01-product-definition.md](./01-product-definition.md) §2. Risks you will be asked about: [06-risks-and-ethics.md](./06-risks-and-ethics.md).

This is written to be used, not read once. Print §2, §6 and §8 before a meeting.

## 1. The one-liner and the story arc

One-liner: "DownUnder checks a woman's birth control against her other medications in both directions, shows its sources, and tells her and her clinician when to ask a pharmacist."

Shorter: "Medication safety for women on birth control, with the evidence shown."

Story arc (use this order every time: problem → proof → path):
1. The gap: birth control and other medications are prescribed by different people; nobody checks the two against each other. Both directions.
2. Why it is hard: the real task is separating the few drugs that matter from the many that don't, and knowing which methods are affected. Generic checkers and pharmacy alerts fail at exactly this.
3. What we have: an MVP shell and a clear, validated path. Be the first to say the current engine is not it.
4. What we will prove: a pharmacist-labeled gold set with published accuracy and zero dangerous misses; a campus pilot with clinician-confirmed flags and time saved.
5. Why it grows: the same profile and engine become the medication-safety layer for women's health (reverse check, pregnancy, hormonal conditions, menopause), sold to campuses, telehealth, pharmacies, payers.
6. The ask: specific, small, time-boxed.

## 2. 90-second pitch to Sandai's CEO

Say it in your own words; keep the beats and the numbers.

"I want to show you something I've been building and ask for four weeks of your backing to find out if it's real.

Here's the problem. About two-thirds of women of reproductive age use contraception, and a big share of them are on hormonal methods. Their birth control usually comes from one place — a telehealth service, a campus clinic, now even the shelf at CVS — and their other prescriptions come from somewhere else. Nobody is responsible for checking the two against each other, and it goes both ways: some drugs make the pill stop working, and some drugs should never be taken without reliable birth control. In one published chart review, a quarter of women aged 13 to 45 had been prescribed a drug with pregnancy risk, and more than half of those had no contraception on record. Under-25s were half as likely to have it. That's the college population.

Generic drug checkers don't solve this. They don't know which method you're on, so they can't tell you that an IUD is unaffected while the pill isn't, and they bury the few interactions that matter under warnings that don't.

DownUnder is a check that knows the method, checks both directions, cites the exact label or guideline passage, and says 'ask a pharmacist' when the data is thin. Students use it free. Campus health centers pay for the clinician view and analytics, then telehealth and pharmacies pay for the API. No ads, no data sales, ever — in this category trust is the product.

Where we are honestly: a hackathon MVP that proves the flow but whose engine I'm replacing. The real asset is the plan: a pharmacist-labeled validation set, a rules engine built on CDC and FSRH guidance, and a pilot at one campus in August.

What I'm asking for today: back a four-week scoping sprint — my time, a few hours of legal, and an introduction to one clinician in your network — so I can come back with a working engine, a scored validation set, and a pilot prospect. Then we decide together whether Sandai backs this as a venture."

Timing guide: problem 35 s, why generic fails 10 s, product 20 s, honesty 10 s, ask 15 s.

## 3. 10-slide investor deck outline with speaker notes

Design the deck after Gate 1 so slide 5 has real numbers. Until then use it for the CEO and advisors with "target" clearly marked.

| # | Slide | On the slide | Speaker notes |
|---|---|---|---|
| 1 | Title | Name, one-liner, "Sandai-backed", your name and role | Say the one-liner, then: "I'll show you a gap nobody owns, how we prove we close it, and how it becomes a platform." |
| 2 | The gap | Two arrows: "drugs that weaken birth control" and "drugs that need birth control". Three sourced stats: 65% contraceptive use (NCHS), 25%/55% (Panchal 2019), under-25 aOR 0.47 | Tell Maya's story in two sentences. Name the sources out loud; it signals how you'll run the company. |
| 3 | Why now | OTC Opill (2023); GLP-1 label guidance on oral contraceptives; pharmacist prescribing in ~30 states; post-Dobbs privacy as a buying criterion; FDA's 2026 CDS guidance keeps the non-device path | "Each of these removes a human who used to catch this, or adds a buyer who needs to." |
| 4 | Product | Three screens: result with direction and sources; clinician evidence panel; "not enough information — ask a pharmacist" | Demo the abstention screen first. "Most products hide uncertainty; ours sells it." |
| 5 | Proof | The gold-set table: precision, recall, dangerous misses = 0, abstention rate; labeler and version | This is the slide. If you have only a target, say "this is the bar we set, scored by [advisor]". Never show a number you cannot defend. |
| 6 | Business model | Free patient front door; institution pays. Tier sheet for campuses; API pricing for telehealth; pharmacist mode. "No ads, no data sales." | "Campus TAM alone is small — about $27M — and that's fine. It's the wedge into a $180–250M layer with the same buyers paying for more modules." |
| 7 | Go-to-market | Pilot campus → ACHA → 5–10 campuses → telehealth API → pharmacy chain → payers. Academic-calendar timeline | "Universities buy in August. Our whole plan is built around not missing August." |
| 8 | Competition | Matrix: method-aware, bidirectional, evidence-cited, abstains, clinician loop, patient-free, no data monetization. Rows: Lexicomp/Epocrates, pharmacy DUR, Drugs.com/GoodRx, Medisafe, telehealth intake, DownUnder | "Everyone answers 'do these two drugs interact'. We answer 'is my birth control still working, and should I be on it given what I take'." |
| 9 | Platform and roadmap | Six phases, five gates; the three signs of a platform | "We don't widen scope until the pilot gate passes. Each new module gets counsel first." |
| 10 | Team and ask | You, Sandai, clinical advisor, counsel; the ask with use of funds and the gate it reaches | State the amount, the months it buys, the gate it hits, and what you'll show at that gate. Stop talking. |

Appendix slides: architecture diagram; regulatory memo summary; privacy posture; risk register top five; pilot protocol; data sources.

## 4. Anticipated objections and answers

Answer pattern: acknowledge, give the specific thing, offer evidence or a next step. Do not argue.

| Objection | Answer |
|---|---|
| "Isn't this just a drug interaction checker?" | "A general checker asks whether two drugs interact. We ask whether a woman's specific method is still working given everything she takes, and whether anything she takes needs reliable contraception. That requires method taxonomy, direction, and guidelines like US MEC that general checkers don't encode. Here's the IUD-versus-pill example." |
| "What about liability when you're wrong?" | "Three things. We never say 'safe'; the vocabulary doesn't have it. Every output cites its source and is designed for a clinician to review, which is the FDA non-device CDS posture. And we measure false reassurance explicitly: the gate to launch is zero dangerous misses on a pharmacist-labeled set, with abstention when evidence is thin. We also carry product liability insurance and counsel reviews patient-facing copy." |
| "Is this an FDA-regulated device?" | "We design to the four non-device CDS criteria: clinician-facing recommendations with the basis visible for independent review. The patient view is informational with the same sources. FDA's January 2026 guidance kept that framework. We have a regulatory consult in Phase 0 and we don't widen scope without re-checking." |
| "Why now?" | Slide 3. Add: "The RxNav interaction API that hobbyist tools relied on was retired in 2024; the field is open for a validated source." |
| "Why you?" | "I built the MVP and I know exactly where it's wrong, which is why the plan starts with a validation set instead of features. I work at Sandai, which gives this engineering and governance backing a solo founder wouldn't have. I'm recruiting a pharmacist advisor as the clinical owner. What I'm not is a salesperson, so the plan is built around evidence that sells itself and partners who open doors." |
| "The market is small." | "Campus alone is about $27M a year; we chose it because nobody owns the problem there and it's where the under-25 risk is. The same buyer pays more for each module; telehealth, pharmacy, and payers widen it to an estimated $180–250M. We are not claiming a billion-dollar TAM." |
| "Won't Lexicomp or an EHR vendor just add this?" | "They could add a method field. They won't publish a contraception-specific validation set, abstain by design, or give students a free, ad-free front door. If they do, our pilot data and campus relationships make us the acquisition rather than the casualty." |
| "Your accuracy depends on public labels; what if the data is bad?" | "Rules come from guidelines first, labels second. Any upstream failure returns 'not enough information', never 'none found'. We mirror labels nightly and version everything, so we can show what changed and re-evaluate past checks." |
| "Privacy: this is reproductive health data after Dobbs." | "Which is why there's a no-account mode where nothing leaves the device, minimal fields, short retention, US residency, no trackers, and a subpoena policy written before launch. It's also why there will never be ads or data sales." |
| "Students won't use it." | "They don't have to use it daily. The institution buys the clinician console and analytics; student use is the trust layer. The pilot measures repeat use honestly and we'll report it either way." |
| "What's the AI?" | "One narrow job: extracting contraception-relevant statements from label text, benchmarked against the pharmacist set, never overriding rules. Later, with consented data, cohort analytics. Calling the whole thing 'predictive' would cost us credibility with clinicians." |
| "What happened to the hackathon team?" | Answer factually about who is still involved, and how IP from the hackathon is handled. Decide this before the meeting (open decision in [00-plan-index.md](./00-plan-index.md)). |
| "Why 'DownUnder'?" | Have an answer or a rename plan. "Discover what's down there" does not survive a campus procurement meeting. |

## 5. Handling "I'm not a salesperson"

You do not need to be. In this category, the people you are persuading (a CEO, clinicians, privacy officers, health-tech investors) distrust polish and trust preparation. Your job is to be the most prepared person in the room, ask good questions, and make the next step small and easy.

### 5.1 Preparation routine (90 minutes, the day before)
1. Write the one sentence you want them to repeat to someone else after the meeting. Everything else serves that sentence.
2. Write the ask: one specific, time-boxed request. If you cannot write it in 15 words, you are not ready.
3. List the three questions you need answered by them (what would make this a yes; who else decides; what have they seen fail in this space).
4. Re-read the objection table (§4) and pick the three most likely for this person. Say your answers out loud once.
5. Prepare one honest weakness you will volunteer unprompted (the engine is being rebuilt; you are not a salesperson). Volunteering it first makes everything else more believable.
6. Check the numbers you will say against [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) and mark which are estimates.
7. Decide how the meeting ends: what you will say in the last two minutes.

### 5.2 Questions to ask (listen more than you talk)
- "What would you need to see to back this for four weeks?"
- "Who else would need to be comfortable with this?"
- "What's the last thing like this you saw, and what went wrong?"
- "If this works, what does it do for you / your clinic / your fund?"
- "What's the risk you'd worry about most?"
- For clinicians: "How do you answer this question today? How long does it take? When was the last time one surprised you?"
- For buyers: "How does something like this get approved here, and who kills it?"

### 5.3 How to listen
- After you ask, stop. Count to five in silence if needed.
- Write down their words, not your interpretation; reuse their phrasing when you reply.
- When they object, say "that's fair" and ask one clarifying question before answering.
- Notice what they lean into; drop your script and follow it.
- Summarize what you heard before the ask: "So if I hear you right, you'd need X and Y."

### 5.4 How to ask for the next meeting
- Make the step small and dated: "Can I come back in four weeks with the scored validation set and a pilot prospect? Would the 10th work?"
- Give them something to do that is easy and useful: "Would you introduce me to one clinician you trust to poke holes in this?"
- Confirm in writing the same day: three lines, what you agreed, when you will deliver, what you asked of them.
- If they say no: ask "what would need to be true for this to be a yes later?" and write it down. That is a roadmap, not a rejection.

### 5.5 Influence principles applied honestly (Cialdini's set), with limits
- Reciprocity: give before asking. Share the accuracy table, the regulatory memo summary, or a useful finding about their own workflow before asking for anything. Limit: never give something manufactured to create obligation.
- Commitment and consistency: ask for small, real commitments (an intro, a 30-minute workflow interview, a letter of intent) that lead naturally to bigger ones. Limit: never trap someone with a prior "yes" they would not give again with full information.
- Social proof via pilot data: show clinician-confirmed flags, repeat use, and a peer campus reference. Limit: only real data, with denominators and dates; never imply adoption you don't have.
- Authority: let the clinical advisor and the sources speak; cite guidelines by name. Limit: don't borrow authority you don't have (no "FDA-approved", no "clinically proven" until it is).
- Liking: be genuinely curious about their problem; reference their words. Limit: no flattery you don't mean.
- Scarcity: the academic calendar is real ("if we don't sign by June we lose a year"). Limit: never invent deadlines or competing offers.
- Unity: you share a goal with clinicians and privacy officers (patients not harmed, data not abused). Say so and mean it.

Ethical floor: you are asking people to trust a safety tool. Anything that would make a pharmacist or a student feel manipulated when they learn how the deal was done is out.

## 6. Pre-meeting checklist

- [ ] One sentence they should repeat afterwards
- [ ] The ask, in 15 words, with a date
- [ ] Three questions for them
- [ ] Three likely objections, answers rehearsed aloud
- [ ] One weakness to volunteer
- [ ] Numbers checked; estimates marked
- [ ] Demo: abstention screen, result with direction and sources, clinician evidence panel (offline copy in case Wi-Fi fails)
- [ ] One-pager printed (problem, product, proof, path, ask)
- [ ] Accuracy table (or target) and its labeler named
- [ ] Regulatory and privacy one-paragraph positions ready
- [ ] Know who else decides and how they are reached
- [ ] Closing two minutes written down
- [ ] Follow-up email drafted with blanks

## 7. Meeting-specific notes

### 7.1 Sandai CEO (first meeting)
- Who: Jeremy Williams, Sandai global CEO. Blunt, direct, charismatic. Loves AI and data; believes the future is AI creating for us and work becoming largely freelance. (Gavin's description, 2026-11-07.)
- What that means for the pitch: lead with the data asset (gold set, accuracy table, versioned rules, cohort analytics) and the AI story told precisely (label extraction benchmarked against pharmacist labels; later cohort and adherence models), not the campus sales motion. Show the demo early; keep slides to a minimum; expect interruptions and answer them in one sentence. Frame the team model as small core plus specialist contractors (pharmacist labelers, counsel, contract engineers), which matches his view of work. Do not oversell "AI" past what the engine does; he will probe and the honesty is the credibility.
- Goal: a yes to a four-week scoping sprint with named resources, plus clarity on structure and IP. Do not try to get venture funding in the first meeting.
- Volunteer: your employment agreement and IP question. Asking about it first is a sign of judgment, not a threat.
- Likely objections: time away from Sandai work; liability to Sandai's brand; "is the market big enough". Prepare the "wedge, not TAM" answer.
- End with: "What would you need to see in four weeks?"

### 7.2 Clinical advisor candidate
- Goal: a signed advisor agreement with a stipend and small equity; agreement on the labeling schema.
- Lead with the gold set: they get authorship on the validation write-up and an ACHA abstract.
- Ask: "What's the interaction question you get most, and the one that worries you most?"

### 7.3 Pilot campus clinician and director
- Goal: a letter of intent for an August pilot under a QI protocol; introduction to the privacy office.
- Bring the four-page pilot proposal and the privacy pack. Ask for the HECVAT questionnaire early.
- Make the pilot cheap for them: no integration, SSO optional in year one, we do the write-up.

### 7.4 Investors (after Gate 3)
- Lead with slide 5 and the pilot usage table. State the small TAM yourself before they do.
- Ask: "What's the proof point that would make you lead?"

## 8. One-page leave-behind (template)

```
DownUnder — medication safety for women on birth control, with the evidence shown
Problem: contraception and other medications are prescribed by different people; nobody checks both directions. [2 sourced stats]
Product: method-aware, bidirectional check; cites the label/guideline passage; abstains to "ask a pharmacist"; clinician console; free patient front door; no ads, no data sales.
Proof: pharmacist-labeled validation set — [precision/recall/dangerous misses] — scored by [advisor]; campus pilot [dates].
Path: campus health centers → telehealth API → pharmacies → payers; six phases, five gates.
Ask: [amount or resources] for [months] to reach [gate], at which we show [artifact].
Contact: Gavin McKay, Sandai
```

## Progress log

- 2026-11-07: Initial draft.
- 2026-11-07: Added CEO profile (Jeremy Williams) and pitch implications to §7.1.
