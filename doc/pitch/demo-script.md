# Campus demo script

Branch `campus-demo`. Run `npm run dev` before he arrives. Campus demo is http://localhost:8081. API is http://localhost:4000. Use the laptop on Wi-Fi; medication search calls RxNav. If that call fails, the honest result is "not enough information," and you say so. Do not refresh into a blank error and improvise.

Maya is already seeded: 20, combined pill, sertraline (Zoloft). The top bar is the role switcher (patient, clinician, admin). The bottom bar is icons only: home, search (Check), person (Profile), speech bubble (Ask). Screen readers still hear the names. Say that once if he asks where the labels went.

Say this before you touch anything: "This is a campus walkthrough, not a pilot. One seeded student, one clinician view, one dashboard. Sample campus numbers are labeled as sample. Anything under Coming is not built."

## How the backend works

Say this if he asks what is behind the screen, or once after the hub. Keep it to a minute.

"The phone app does not decide. It asks a small API. That API stores Maya's method and medicines in a local database. When she checks a drug, the API turns the name into an ingredient, then does two reads. First, our own tables: enzyme inducers, the reverse cases such as lamotrigine, eligibility, and drugs that require birth control. Those tables produce the chip. Second, the FDA label we have cached for that ingredient. On the result we keep only the sentences that mention birth control or this kind of method. Stomach upset, rash, and a boxed warning that is not about the method stay off the check. They show up when she taps that medicine on her profile. If we cannot match the product or cannot read a source, the chip is 'not enough information.' We never fill that gap with 'safe.'"

Time: the story through the admin screen is about 12 minutes. The rest of this script visits every other screen. If the meeting is 30 minutes, stop after beat 8 and go to the meeting script. Offer the rest if he asks to see that the product is finished.

## 1. Hub (`/`)

Read the three lines on the card out loud.

- Patient: Maya, 20, combined pill, sertraline.
- Clinician: Dr. Reyes’s worklist. Students never see it.
- Admin: de-identified counts. What a campus would buy.

Point at the switcher. "In a real campus this is SSO. Here it is a switch so you can see all three jobs."

Say the try-line at the bottom, then press **Open Maya’s patient app**.

## 2. Maya’s home (`/home`)

"Hi, Maya." Method card says **Combined pill** and **sertraline (Zoloft)**.

"She keeps one list. A check looks at her method, that list, and a few health facts. Students use this free. The health center pays for the clinician view and the dashboard."

Do not press **Check my whole list** yet. Press **Check a medication**.

## 3. Known interaction — rifampin (`/check` then `/result/...`)

Type `rifampin`. Wait for the hits. Press **Use rifampin**. Do not press a combination product (anything with isoniazid or pyrazinamide) and do not press **Add rifampin as written**.

Press **Check rifampin**.

On the result:

- The chip is **Known interaction — act**. Read the headline: rifampin can make the combined pill less effective.
- Read the action: ask about a method that enzyme inducers do not affect (IUD or the shot), or a barrier method during use and for 28 days after stopping.
- Press **Why and what to do**. One sentence: direction is drug → method, source is a guideline table, not a guess.
- Press **Show sources**. Read the rule id and the source name. "No verdict without the passage that produced it."
- Read **Because of your birth control**. The sentence is that rifampin may reduce the effectiveness of hormonal contraceptives, or menstrual disturbances. Liver injury, stomach effects, and sertraline's suicidality warning are not on this screen. "Those are real label effects. They are not here because they are not caused by the pill. They live on the medicine in her profile."
- Read **Checked against** (combined pill, rifampin, sertraline) and **Not checked** (a full check of every medicine against every other medicine). "We do not pretend to be Lexicomp."
- Press **Talk to a pharmacist** under "What will you do next?" "That choice is for her. We do not send it to the campus unless she has turned sharing on."
- Leave **Ask a pharmacist** and **Ask DownUnder** for later beats. Press **Check another medication** only if you are moving to the next drug; otherwise use the search icon.

## 4. Reverse effect — lamotrigine

Check tab. Type `lamotrigine`. Pick **Use lamotrigine**, not a combo. Run the check.

Say: "This is the other direction. The pill can lower lamotrigine levels. A general checker that only asks 'does this drug weaken birth control?' misses it. We still cite the source, and we still do not say safe."

Open **Why and what to do** if the headline is not enough.

## 5. None known, and not enough information

Check tab. Type `amoxicillin`. Pick the plain amoxicillin product, not amoxicillin with probenecid or clavulanate. Run it.

Say: "Most antibiotics do not undo the pill. If our sources have nothing on this pair, the chip is 'no known interaction in our sources.' That sentence is not 'safe.' Because of your birth control should say nothing tied to the method. Rash and diarrhea are on the label, and they stay off this screen."

Check tab again. Type `mystery herb`. If there is no real product, add it as written or pick nothing resolvable, whichever the screen offers, and run it.

Say: "We could not resolve this to a label. The result is 'not enough information.' That is success. A failed lookup must never look like a clean bill."

## 6. Method changes the answer (`/profile`)

Profile icon. Press **Change method**. Choose **Hormonal IUD**. The card says IUDs and the shot are not affected by most medicines.

Check tab. Rifampin again, pick the plain product, run it.

Say: "Same drug, different method. An inducer that matters for the pill does not get to call an IUD a known interaction. The method is the point. Lexicomp does not carry it."

Set the method back to **Combined pill** before you leave this screen, so the rest of the demo is still Maya on the pill.

Scroll the profile far enough to show age, smoker, and the four conditions (migraine with aura, high blood pressure, history of a blood clot, breastfeeding). Say: "These are eligibility facts, like the combined pill at 35 if she smokes. They are not a diagnosis, and they are not sent anywhere unless she shares with the clinic." Do not save a fake age unless you are ready to set it back to 20.

Press **Label effects** on sertraline. "This is the pharmacy label: nausea, bleeding, the young-adult warning. It is here because she asked for this medicine, not because the check decided the pill caused it."

Show the search box. "She can add and remove. A check will not run on a name she typed and did not pick, because the wrong product is how you get a false answer."

## 7. Clinician (`/clinic`)

Switcher → **clinician**, or **Clinician worklist** from the hub if you go back.

"This is Dr. Reyes. Students never see this. In a real campus it sits behind SSO. That sign-in is not built."

Open the rifampin row. Read the consent banner: Maya shared this check for clinical review in the demo.

Show the finding, the why, and the evidence lines. Type a one-line note. Press **Confirmed**. "Advised and Dismissed are the other two. Nothing is written into an EHR. The screen says that export is coming."

## 8. Campus dashboard (`/admin`)

Switcher → **admin**.

Say this before he reads the numbers: "These counts are a sample campus, not a live tally of what we just clicked. Cells under 10 are hidden so one student cannot be picked out. Live numbers are a later build, and only from people who turned analytics on."

Press **Run label extraction on rifampin**. When the line appears, say: "That is the AI. It reads a public label we already cached and pulls a sentence. It can only add a 'possible interaction,' and only with the quote. It cannot override a guideline, it cannot see Maya’s chart, and it is not a chatbot."

Stop here if you still need time for the ask.

## 9. Whole list

Switcher → **patient**. Home. Press **Check my whole list**.

"This checks what she already takes against her method, with no new drug. Sertraline is on her list on purpose: a common medicine where the honest answer is usually that our sources do not show a contraception problem. We still refuse the word safe."

## 10. Ask (`/ask`)

Press **Ask DownUnder about this** on the result so the question is tied to that check. The Ask tab alone does not have a label list to read.

Read the line under the title: answers come from the tables and labels; her profile is not sent to a third-party model; this is not a doctor.

Press the chip **Does rifampin affect the pill?** Show the citation under the answer.

If you have a second, press **Do most antibiotics cancel the pill?** The point of that prompt is the boring truth from beat 5.

## 11. How DownUnder decides (`/how`)

From home, **How DownUnder decides**. Read the four chips in order:

- Known interaction: a guideline names the pair.
- Possible interaction: the label mentions something that may matter.
- No known interaction in our sources: not the same as safe.
- Not enough information: we could not tell. Ask a pharmacist.

"Guidelines first, label second, extraction last. A sentence classifier cannot overrule a table. A result only adds an adverse-effect sentence when it is about the method. The rest of the label is on the profile."

## 12. Help (`/help`)

**Find a pharmacist**. Read **Demo campus clinic**, the weekday hours, and the fake number (555) 010-0147. Do not press the call button.

"A real campus puts its own hours here. Until then the screen tells her to use a pharmacist or 911. Poison control is the US number, and it is a real one, so do not tap it in the room."

## 13. Privacy (`/privacy`)

From home, **Privacy center**.

- Read what is stored. It is a list, not a slogan.
- Show the access log.
- Show analytics and clinic-share toggles, both default off. "The dashboard cannot count her, and Dr. Reyes cannot see her, unless she turns these on."
- Press **Export my data** only if you are willing to have a JSON file download. It is real.
- Do not press **Delete everything**. Say: "Delete is real. I am not wiping Maya in the middle of this meeting."

## 14. Consent, method, and medications

These are the first-run path. Maya never sees them because she is seeded. Open the URLs directly. Do not press **Continue** or **Go to home**, or you will walk her profile through onboarding.

- `/consent` — **How do you want to check?** Two choices: check without an account, or save a profile. Separate switches for de-identified analytics and sharing with the campus clinic. Both start off. The copy says what is stored and that a campus sees nothing unless she shares.
- `/method` — she picks a method from the grid. Continue would save it and go to medications.
- `/medications` — search, pick a product, add it, or skip. Same rule as the check screen: a typed name is not enough.

Say: "A student who is not Maya starts here. No account is a finished path, not a teaser."

## 15. Coming (`/coming`)

Home, the line **Coming: missed-dose reminders**. Read the list and say each one is absent on purpose:

- Missed-dose reminders
- Pharmacist quick-check with no patient record
- Browsable rules tables and a change log
- Live campus analytics
- Passkeys instead of this role switcher
- Spanish
- Partner API

"I will not demo any of these as if they work."

## If something breaks

- Search spins: wait, then pick a hit. Do not submit the raw string.
- Result says not enough information on rifampin: the network or the product pick failed. Say that. Do not call it a known interaction from memory while the screen disagrees.
- He asks to see the student product: "That is a separate build, on another branch, with no Maya and no role switcher. This meeting is the campus demo."
