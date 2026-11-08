# 03 · Frontend and UX

Part of the DownUnder plan. Index: [00-plan-index.md](./00-plan-index.md). Product scope: [01-product-definition.md](./01-product-definition.md). Engine and output vocabulary: [02-technical-architecture.md](./02-technical-architecture.md) §2. Ethical constraints on the UI: [06-risks-and-ethics.md](./06-risks-and-ethics.md).

Design brief: a student should get a correct, actionable answer on her phone in under a minute without being alarmed or falsely reassured; a clinician should see why, from where, and be able to record that she looked. Both must survive a privacy officer's review and a WCAG 2.2 AA audit.

## 1. HCI principles applied (not just cited)

### 1.1 Nielsen's ten heuristics, mapped to concrete decisions

| Heuristic | Decision in DownUnder |
|---|---|
| Visibility of system status | Check runs show a three-step progress line ("Identifying medication → Reading sources → Applying guidelines"); result header states what was checked and what was not ("Checked against: combined pill, sertraline. Not checked: supplements without a product match."). |
| Match between system and real world | Users type brand or generic names; we show "rifampin (Rifadin)". Plain-language direction: "Rifampin can make your pill less effective." No "CYP3A4" unless the user expands "How does this work?". |
| User control and freedom | Every added medication is removable; profile edits are reversible; the user can delete the account and all data in two taps with a confirmation that states what will be deleted. |
| Consistency and standards | One four-level outcome vocabulary everywhere (patient, clinician, PDF, API). Same icon + label + color triple; never color alone. |
| Error prevention | Typeahead forces a product match before a check; ambiguous names ("Yaz" vs "Yasmin") prompt a disambiguation; cannot run a check without a method selected (prompt to select "I'm not sure / none"). |
| Recognition rather than recall | Current method and medication list are visible on the check screen; recent checks are listed; no codes to remember. |
| Flexibility and efficiency | Clinician view has keyboard shortcuts, batch review, and a search-first layout; patient view has a one-tap "check a new medication" from the home screen. |
| Aesthetic and minimalist design | Result card shows outcome, one-sentence why, one-sentence what-to-do. Everything else is behind "Show sources" and "How does this work?". |
| Help users recognize, diagnose, recover from errors | Upstream failure reads "We couldn't read the official label for this medication right now. That doesn't mean it's safe. Ask a pharmacist, or try again later." Never a bare "Error". |
| Help and documentation | Inline "What does 'possible interaction' mean?" and a one-page "How DownUnder decides" with the source list. |

### 1.2 Fitts's law and Hick's law
- Primary action (Check, Add medication, Ask a pharmacist) is a full-width 48 px button in the thumb zone on mobile; secondary actions are smaller and higher.
- Risk outcomes are limited to four to keep choice-reaction time low (Hick); each outcome has exactly one recommended next action.
- Clinician review buttons (Confirmed / Dismissed / Advised) are grouped, equal size, with 8 px gaps to reduce mis-taps; destructive actions are separated.

### 1.3 Progressive disclosure
Three layers on every finding: (1) outcome + plain sentence; (2) "Why and what to do" (mechanism in plain terms, guideline action, method alternatives); (3) "Sources" (exact label passage with set_id and date, guideline table row, rules version). Clinicians default to layer 2 open; patients default to layer 1.

### 1.4 Risk-communication research applied
- Use evaluative category labels with action verbs rather than numeric probabilities (there are no good per-person probabilities for interaction-caused failure; inventing one would be false precision). Labels: "Known interaction — act", "Possible interaction — check", "No known interaction in our sources", "Not enough information — ask a pharmacist".
- Where numbers exist and are patient-relevant (typical-use failure rates per method from US SPR/CDC), present as natural frequencies ("about 7 in 100 people using the pill typically get pregnant in a year") with an icon array (Gigerenzer; Fagerlin, Zikmund-Fisher, Ubel; Trevena et al. on risk presentation). Never relative risk alone.
- Avoid the "all warnings look the same" alarm fatigue that pharmacy DUR suffers from: the boring case ("most antibiotics do not affect your pill") is rendered calmly and explicitly, because the product's value is separating the few from the many.
- Never use "safe", "protected", "fine", or a green checkmark. "No known interaction in our sources" is phrased with the scope stated; the boundary of knowledge is part of the message.
- Uncertainty is shown, not hidden: "Not enough information" has its own neutral visual treatment (grey, question icon), equal visual weight to the others, and the most prominent next action (find a pharmacist).

### 1.5 Trust and credibility
- Stanford web-credibility findings: show who is behind it (clinical advisor named with credentials, institution logo when deployed by a campus), show sources and dates, keep design professional and consistent, make it easy to contact a human.
- Every result shows "Sources updated: <date>" and "Rules version <x>".
- Honest scope statement on first run: "DownUnder checks birth control against other medications. It does not check every drug against every drug."

### 1.6 Accessibility (WCAG 2.2 AA)
- Color contrast ≥4.5:1 text, ≥3:1 UI components; outcomes carry icon + text label, never color alone (1.4.1, 1.4.3, 1.4.11).
- Target size ≥24×24 CSS px with spacing (2.5.8); we use 44×44 for primary controls.
- Focus visible and not obscured by sticky headers or sheets (2.4.7, 2.4.11).
- No drag-only interactions (2.5.7).
- Consistent help location across screens (3.2.6).
- No redundant entry: method and medications persist into the check flow (3.3.7).
- Accessible authentication: passkeys or magic link; no cognitive-function tests, no CAPTCHA puzzles (3.3.8).
- Semantic headings, landmarks, ARIA live region announcing the result; all content works at 200% zoom and 320 px width; respects reduced-motion.
- Audited with axe in CI and a manual screen-reader pass (VoiceOver iOS, NVDA) before pilot.

### 1.7 Health literacy
- Target reading level grade 6–8 for all patient text (measured with a readability check in CI for template strings). Follow CDC Clear Communication Index and AHRQ Health Literacy Universal Precautions: one idea per sentence, active voice, numbers as frequencies, define any term on first use.
- Teach-back built in: after a "Known interaction" result, a one-question "What will you do next?" with three options (use condoms too / talk to a pharmacist / ask my prescriber) that doubles as a pilot metric and reinforces the action.
- Spanish in Horizon 2 (S7); templates authored with translation from the start (ICU message format).

## 2. Information architecture

```
Patient (web, mobile-first)
  Welcome and scope → Consent and mode choice (no-account / save my profile)
  Home: method, medication list, "Check a medication", recent checks
  Add method · Add medication (typeahead, disambiguation)
  Check result · Finding detail · Sources · How DownUnder decides
  Find a pharmacist / campus clinic (tenant-configured)
  Privacy center: what we store, who viewed, export, delete
Clinician (web, desktop-first)
  SSO sign-in → Worklist (shared checks awaiting review)
  Patient check view (with consent banner) · Evidence panel · Review + note · Export summary
  Quick check (no patient record; pharmacist mode, Horizon 2)
  Rules and sources reference · Change log
Admin
  Tenant settings (consent policy, retention, SSO) · De-identified analytics · Audit search
```

## 3. Screen-by-screen: patient (web and later mobile)

| # | Screen | Purpose | Key elements | Principles |
|---|---|---|---|---|
| P1 | Welcome and scope | Set expectations in 20 words | One sentence of what it does, one of what it doesn't, "Continue". No marketing. | Credibility, scope honesty |
| P2 | Mode and consent | Choose "Check without an account" (local-first) or "Save my profile" | Plain-language consent: what is stored, for how long, who can see it (nobody unless you share with a clinician), how to delete. Separate toggles: service / de-identified analytics / share with my campus clinic. Default off for analytics and sharing. | Privacy UX, 3.3.8 |
| P3 | Your method | Pick method | Eight-plus cards with pictures and plain names; "I'm not sure" and "None right now" are valid; OTC Opill listed. Method-specific note ("IUDs are not affected by most medications"). | Match real world, error prevention |
| P4 | Your medications | Build the list | Typeahead with brand/generic; supplements category; "I'll add it later". Each item shows resolved name; unresolved items shown with a caution tag. | Recognition, error prevention |
| P5 | Home | Hub | Method chip, medication list, big "Check a medication" button, recent checks with outcome chips, privacy center link. | Fitts, visibility |
| P6 | Check: pick medication | Start a check | Search box; also "Check my whole list" against method. | Flexibility |
| P7 | Check: progress | Status | Three-step progress text; cancel. | Visibility |
| P8 | Result | The answer | Header: outcome label + icon. One sentence why (direction stated). One sentence do-now. Expanders: "Why and what to do", "Sources". Footer: "Checked against … / Not checked …", sources date, "Ask a pharmacist" button always present, "I'll do this: …" teach-back. | Progressive disclosure, risk comms |
| P9 | Finding detail | Depth | Mechanism in plain terms, guideline action, alternatives that are not affected (e.g., IUD), how long the effect lasts (e.g., 28 days after stopping an inducer), label passage quoted with highlight. | Trust |
| P10 | Not-enough-information | Honest abstention | Neutral treatment; why we couldn't tell (no product match / label unavailable / conflicting sources); pharmacist finder; "try again later" if upstream. | Error recovery |
| P11 | Find help | Route to a human | Campus clinic hours and phone (tenant-configured), pharmacist locator, telehealth link if the tenant is a telehealth partner. | Consistent help |
| P12 | Privacy center | Control | What we store (listed, not summarized), access log ("who viewed"), export (JSON/PDF), delete everything, consent toggles. | Trust, user control |
| P13 | Reminders (Horizon 2) | Adherence | Opt-in only; missed-dose guidance per method from US SPR; no notification content reveals the method on the lock screen. | Privacy UX |

Mobile-native (Horizon 3) reuses P1–P13 with platform navigation; adds passkey prompts and local encrypted cache.

## 4. Screen-by-screen: clinician view

| # | Screen | Purpose | Key elements | Principles |
|---|---|---|---|---|
| C1 | SSO sign-in | Trust boundary | Campus IdP; MFA; role shown after login. | 3.3.8 |
| C2 | Worklist | Triage | Checks shared with the clinic awaiting review, sorted by severity then time; filters; keyboard navigation; counts. | Efficiency |
| C3 | Patient check view | Review | Consent banner (what the patient shared and when); method, list, findings with evidence panel open by default; guideline row and label passage side by side; "Independent review" affordance (the FDA criterion 4 made visible). | Progressive disclosure layer 2 default |
| C4 | Review and note | Record | Confirmed / Dismissed / Advised; structured reasons; free-text note (encrypted); time-to-review captured for pilot metrics. | Error prevention (grouped, spaced) |
| C5 | Export summary | Fit workflow | One-page PDF or copyable text for the campus EHR: findings, sources, rules version, reviewer. | Consistency |
| C6 | Quick check (pharmacist mode, Horizon 2) | Speed | Method + medication list entry without a patient record; same result component; printable patient hand-out. | Flexibility |
| C7 | Rules and sources | Transparency | Browsable tables with versions and citations; change log; "report a problem with this rule". | Trust |
| C8 | Admin: analytics | Buyer value | De-identified aggregates with small-cell suppression; export. | Privacy by design |

## 5. Communicating risk without alarm or false reassurance

Outcome system (shared with the engine; see [02-technical-architecture.md](./02-technical-architecture.md) §2.3):

| Outcome | Label (patient) | Visual | Default sentence pattern | Next action |
|---|---|---|---|---|
| known_interaction | Known interaction — act | Deep orange, exclamation-in-circle | "<Drug> can make your <method> less effective." / "Your <method> can lower <drug> levels." | Specific guideline action + "Ask a pharmacist" |
| possible_interaction | Possible interaction — check | Amber, question-in-triangle | "The label for <drug> mentions <topic>. It may matter for your <method>." | "Check with a pharmacist before relying on your <method>" |
| none_known_in_sources | No known interaction in our sources | Slate blue, info-in-circle (not green, not a checkmark) | "We found no interaction between <drug> and <method> in the sources we check (listed below)." | "Keep taking your method as directed. Ask if anything changes." |
| insufficient_information | Not enough information — ask a pharmacist | Grey, question-in-circle | "We couldn't check <drug> reliably because <reason>." | Pharmacist finder is primary |

Rules of copy:
- Direction is always explicit (who affects whom).
- Duration is stated when known ("for 28 days after you stop").
- Alternatives are named when the method is vulnerable ("IUDs and the shot are not affected").
- No hedging stacks ("may possibly potentially"); one hedge word maximum.
- The pharmacist CTA appears on every outcome, visually strongest on the two uncertain ones.
- The "boring but true" message for common non-interactors is affirmative about the sources, not about safety: "Amoxicillin is not known to reduce the effectiveness of the pill (CDC US MEC; FSRH). If you have vomiting or diarrhea, follow missed-pill guidance."

Testing plan: comprehension testing with 8–12 students per iteration (think-aloud, teach-back) before pilot; measure correct recall of outcome and next action; target ≥85% correct action recall for known_interaction and ≥80% correct understanding that "no known in our sources" is not "safe".

## 6. Privacy UX

- Layered notice: one screen in plain language (what, why, how long, who) with "Details" linking to the full policy. Inventory is literal: "We store: your method, your medication list, your birth month and year, whether you smoke, your check results." Nothing else.
- Consent is granular, off by default for anything beyond providing the service, revocable from the privacy center, and versioned (users are re-asked when terms change).
- No-account mode is real: the engine runs in the browser with a bundled rules snapshot; nothing leaves the device unless the user saves.
- "Who viewed my data" is visible to the patient; clinician access requires the patient's share action or the tenant's documented treatment relationship, shown on screen.
- No third-party trackers, no ad SDKs, no fingerprinting; the web app sets only functional cookies. This is stated in the UI, not only in the policy.
- Delete is complete and immediate for user-facing data, with a stated retention exception for audit logs where law requires, explained in one sentence.
- Sensitive-content hygiene: no method or medication names in notification previews, email subjects, or browser tab titles; app-switcher snapshot blurred on mobile.
- Minors: age gate at account creation; tenant-configurable consent policy for under-18s; see [06-risks-and-ethics.md](./06-risks-and-ethics.md) §3.4.

## 7. Design system and implementation notes

- React + TypeScript with Radix UI primitives (accessible by construction) and Tailwind; `packages/ui` holds tokens (color roles for the four outcomes, type scale, spacing) shared with Expo via Tamagui or NativeWind when mobile ships.
- Typography: a humanist sans at 16 px base minimum; line length ≤70 characters; left-aligned; no justified text.
- Color tokens are semantic (`outcome.known`, `outcome.possible`, `outcome.noneKnown`, `outcome.insufficient`), each paired with an icon and label token so color-only states are impossible by API.
- Templates for guidance text are reviewed by the clinical advisor and versioned alongside rules; the UI never composes clinical sentences from fragments.
- i18n from day one (ICU MessageFormat); RTL-safe layout.
- Performance budget: first result in <2 s on a mid-range phone over campus Wi-Fi; result page <150 KB JS.

## Progress log

- 2026-11-07: Initial draft.
