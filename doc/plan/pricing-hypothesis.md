# Pricing hypothesis — thought process and sources

Written 2026-11-07. This explains the dollar figures in [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §2.2, §3, and §7. It does not replace them. Those figures are hypotheses. No buyer has agreed to one, and no vendor price list was used to set them.

The roadmap PDF that the plan is built on does not contain prices. The extract says so directly. See [downunder-roadmap-extract.md](./downunder-roadmap-extract.md) §1.8.

## 1. What was decided before any dollar amount

The shape of the price was fixed by the product and the ethics rules, not by a market study.

The patient does not pay. Safety information is not paywalled. [01-product-definition.md](./01-product-definition.md) §1 sells to institutions and keeps a free patient front door. [06-risks-and-ethics.md](./06-risks-and-ethics.md) §4 items 1, 2, and 8 forbid selling user data, running ads or affiliate links, and charging patients for the check.

That kills the hackathon pricing. The pitch deck described a website subscription. The team notes proposed $4.99 a month, affiliate links, pharma ads, and selling anonymized data. The extract records both, and records that they conflict with the trust posture. See [downunder-roadmap-extract.md](./downunder-roadmap-extract.md) §2.3 and §2.4. Those ideas are retired in [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §1.

What remains is a subscription the institution pays, and later a usage fee on an API. The patient app is the reason a campus believes the product. It is not the revenue.

## 2. Campus health centers — the only price we would say out loud now

### The tiers

From [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §3:

| Enrollment | Annual price | Role in the model |
|---|---|---|
| Under 5,000 | $6,000 | Floor. A small health center can say yes without a capital request. |
| 5,000–15,000 | $12,000 | Working number. Called the median tier in §7 and used as campus ACV. |
| 15,000–30,000 | $20,000 | Large campus. |
| Over 30,000 | $30,000 | Ceiling for the first product. Above this, the conversation is a procurement project, not a pilot. |
| Pilot year | $0–$5,000 | Plus a letter of intent for a paid second year. §4.1 also says a no-cost or $5,000 pilot. |

The $15,000 "average" in the market table is not a fifth tier. It is the blended price used only to turn a count of institutions into a market size: about 1,800 health services × $15,000 = $27 million. The 1,800 is itself an estimate. The plan says ACHA reports several hundred institutional members and that the count of institutions with a student health service should be verified. See §2.1 and §2.2.

The $100,000 figure for 2028 is the same $12,000 applied to a handful of campuses. Five campuses at $12,000 is $60,000. Ten is $120,000. The plan's exit line for that year is "$100k+ ARR" ([04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §9, step 3.3). It assumes most of those campuses are in the middle tier, not the $30,000 tier.

### Why these amounts, and not a published rate card

Nothing in the source documents prices a campus clinical tool at $6,000 or $30,000. The reasoning inside the plan is:

- A health center director can approve a low five-figure annual software line more easily than a six-figure one. The tiers sit in that band on purpose.
- The first year is cheap because the sale is a quality-improvement pilot and a write-up, not a procurement. The academic calendar is the constraint: miss June and the August start slips a year (§4.1, §9).
- Price scales with enrollment because a larger campus has a larger health fee and a larger clinic, not because we have measured willingness to pay.
- $12,000 is the number the unit economics use. At a hypothesized campus acquisition cost of $5,000–$10,000, payback is under a year (§7). That arithmetic only works if the second year is actually paid. It is a hypothesis about stickiness (85–90% gross retention, also labeled a hypothesis), not a measured renewal rate.

What would change the tiers: the first ten buyer conversations. The plan's own test is to show the sheet and ask which tier they would be in and what would make it a no-brainer. That revision is an open decision, due before Gate 3. See [00-plan-index.md](./00-plan-index.md) decision 5, and [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §3.

## 3. Later prices — how the bigger numbers were multiplied

These are further hypotheses. They are not inputs to a quote we would send this year.

**Telehealth.** §3: $3,000–$5,000 per month as a platform fee ($36,000–$60,000 a year) plus $0.10–$0.25 per check, or $0.03–$0.05 per active member per month. The market table collapses that to "$0.50 per active member per year" times an estimated 5 million women, which is about $2.5 million, written as "~$3M direct." The $0.50 is a blend chosen so the market line is one number, not a price we have offered anyone. Two partners at about $150,000 each produce the "~$300k" in the 2030 picture (§2.2). That is above the platform fee alone, so it assumes usage fees or a larger contract.

**Pharmacies.** §3: $40–$80 per store per month. The market line uses the midpoint, $50, times 12, which is $600 a store per year. $600 × 60,000 stores = $36 million. That is the TAM cell. The same row says the realistic set is chains and independents in pharmacist-prescribing states, about 35,000 stores. At the same $600, that is $21 million, not $36 million. The plan states both and does not reconcile them. A single chain contract of about $500,000 is the 2030 pharmacy line, not 35,000 separate invoices.

**Payers and employers.** §3: $0.05–$0.15 per member per month for women 15–49. The market line uses the midpoint, $0.10. Times 12 is $1.20 per woman per year. Times an estimated 50 million commercially insured women is $60 million. Both the $0.10 and the 50 million are estimates in §2.1 and §2.2. This price is not usable until there is outcome evidence. §4.3 says so.

**Later modules.** Hormonal conditions, pregnancy and lactation, and menopause are priced as a 50–100% uplift on the core, written as "~$60M+". The core cells are $27M + $3M + $36M + $60M = $126 million. Half of that is about $63 million, which is the "~$60M+" line. Adding a 50% uplift to the core lands near $190 million. Adding a 100% uplift lands near $250 million. That is the "$180–250 million" band. It is the same buyers paying again, not a new population.

**2030 picture.** 40 campuses × the $15,000 blend = $600,000, plus about $300,000 from two telehealth partners, about $500,000 from one pharmacy contract, and about $300,000 from an early payer. The sum is $1.7 million, written as $1.5–2 million ARR. §2.2 says this is small on purpose.

## 4. A cost that can erase the margin

Gross margin at 20 campuses is hypothesized at 75–85% (§7). The line that moves it is a commercial interaction database, estimated at $30,000–$100,000 a year, called "five to low-six figures" and marked confidential. See [02-technical-architecture.md](./02-technical-architecture.md) §4. The plan does not spend that until Gate 2, and only if the gold set shows a coverage gap the public tables cannot close. Twenty campuses at $12,000 is $240,000 of revenue. A $100,000 data license is a large share of that. The margin hypothesis assumes the license is either absent or small relative to revenue.

Hosting is a separate, smaller hypothesis: $500–$1,500 a month at pilot scale (§7). Clinical review is estimated at 0.2 of a pharmacist, about $30,000 a year (§7). Neither figure comes from an invoice.

## 5. Public sources that constrain the model, and do not set the price

These are the sources the plan actually names. They support who the buyer is, why the patient is free, and why a campus is the first door. They are not a price study.

- Contraceptive use. Daniels K, Abma JC. Current contraceptive status among women aged 15–49: United States, 2017–2019. NCHS Data Brief no. 388. 2020. Cited in [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §2.1 for 65.3% using any contraception. The plan says to verify the brief before it is used outside the building. https://www.cdc.gov/nchs/products/databriefs/db388.htm
- The contraception gap the campus wedge is aimed at. Panchal BD, et al. Family-medicine chart review, reported in the plan as JABFM 2019: 25% of women 13–45 prescribed a pregnancy-risk medication, 55% of those with no documented contraception, under-25s about half as likely to have it. One center, 2015 data. [04-business-plan-and-timeline.md](./04-business-plan-and-timeline.md) §2.1. This is why the first buyer is a college health service, not why the price is $12,000.
- Enrollment context for "college women." The plan estimates about 11 million women in US degree-granting institutions from NCES totals and marks the figure an estimate (§2.1). The hackathon deck used 10 million ([downunder-roadmap-extract.md](./downunder-roadmap-extract.md) §2.3).
- Why a general checker is not the product we are pricing. Prospective drug-utilization review for Medicaid is tied to OBRA '90, as named in §5. The plan's point is that those alerts miss a method that was never dispensed in that pharmacy. That is an argument for a separate campus product, not a rate card.
- Why the patient price is zero and ads are out. FTC actions named in §5: GoodRx, $1.5 million in 2023 under the Health Breach Notification Rule; Flo's 2021 settlement over data sharing. [06-risks-and-ethics.md](./06-risks-and-ethics.md) §4 is the internal rule those cases are used to support.
- Why a clinician-facing, cited check can be sold without claiming to be a device. The plan cites FDA's January 2026 CDS guidance as keeping the non-device framework (§2.3, §6). Counsel still has to write the memo. The guidance is not a pricing source.

## 6. What this document will not do

It will not treat $6,000–$30,000 as a fact a buyer has accepted. It will not reuse the hackathon's $4.99 price. It will not turn the $180–250 million band into a claim about revenue DownUnder will collect. The next real number is whatever a health center says when shown the tier sheet. Until then, the sentence in the email is the accurate one: these are our current hypotheses.
