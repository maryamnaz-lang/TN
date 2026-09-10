# Tal scenarios — Super Admin portal
Design coverage for every response Tal gives to a signed-in Super Admin.
Source of truth: `tn-admin-portal.html` and `design-system/talentnext-ds.js`, read on 8 Sep 2026. Every figure was produced by running the portal's own summary functions against its own seed data.
Prepared for the Tal response design pass. Companion documents cover the Candidate, Cohort Leader and Talent Agent portals.

## 1. How to read this document

**Who the user is.** The signed-in Super Admin in the prototype is Derek Sole, Head of Operations, the one account with override on any level or setting. The platform he reads has 33 accounts, 20 candidates, 5 agents, 9 employers, 3 running cohorts, 13 booked interviews, $1,250 processed and $920 in progress, 3 held payouts worth $600, 2 overdue invoices, 2 open refunds, one unmatched settlement batch, one degraded integration and a placement fee that has never been set. Every number Tal speaks below is one of those, so the designer can see exactly which figures a response carries and which ones move.

**What Tal can read here.** Tal reads the live records of the module the admin is on: accounts, the vetting queue, candidates and levels, cohorts, the marketplace, the money and the system. Two hard limits are stated in the portal's own configuration page: anything outside the module's records is declined, and the billing ledger is never read, on any portal. Tal gives aggregates about money, never a transaction row.

**Tal never acts.** Every consequential action in this portal goes through a sheet or a confirmation dialog, four of them through a step-up authenticator code. Tal points at the control; it never presses it. Tal says nothing inside confirmations, sheets, notifications or empty states.

**The Rulings Register.** The portal is built against the Super Admin journey, sixteen use cases, of which several are open or blocked pending a ruling. Module pages carry no inline ruling note. The one place Tal names a blocked case and its owner is the Dashboard chat, and it points at the register.

**Each scenario is a card** with the same fields:

| Field | Meaning |
|---|---|
| Module | Where the admin is when they ask |
| User asks | The natural phrasings that should reach this answer. The first is the chip the module offers |
| State | The data condition that produces this exact answer |
| Response type | One of the patterns below. This field tells the designer whether there is a visual |
| Status | **In prototype** means the copy exists today. **Proposed** means a real admin will ask it and the prototype has no answer yet |

**Response patterns.** Every Tal response in this portal is one of these shapes.

| Pattern | Shape | Where it is used |
|---|---|---|
| **P1 Summary band** | "Summary by Tal" at the head of a page: label and one or two typed-in sentences with one accent-highlighted phrase. Full width; this portal never draws a second column | All 43 module pages and 11 detail pages |
| **P2 Text answer** | In the chat: an eyebrow repeating the question, then one to three sentences | The rare answer with no next screen |
| **P3 Text + facts** | P2 plus stacked key/value rows (label left, value right, tabular figures) | Queues, holders, blocked cases |
| **P4 Text + action** | P2 plus one quiet outlined button with a trailing arrow that opens the page the answer is about | The commonest admin reply: 29 of 30 answers carry a button |
| **P5 Text + facts + action** | P3 and P4 together | The queue answers: what needs me, who is ready, what is owed |
| **P6 Refusal** | The eyebrow "I do not have that one" and a fixed sentence naming what Tal can read, then the module's chips re-offered | Anything outside the module's records |
| **P7 Chat opening** | Large animated Tal mark, "Hello Derek, I am Tal", one line on what Tal reads, the module's chips, the field | Each fresh conversation |
| **P8 Thinking** | Three pulsing accent dots in a Tal bubble for about half a second | Between question and answer |
| **P9 Tal as a subject** | Not Tal speaking: the System module's configuration rows that state what Tal reads and never reads | System and Audit, Overview |

## 2. Where Tal appears

### 2.1 The Summary by Tal band (P1)

At the head of every module and detail page. Label **Summary by Tal**. One or two sentences, real figures, one phrase highlighted in the accent as the actionable part. Always full width in this portal.

**States to design**

- **Typing in.** On arrival the summary types itself over about 3.4 seconds with a thin caret; a hidden ghost copy holds the box at final height so the page never reflows. It does not re-type on same-page re-renders (filter, sort, opening a menu, paging a table). Prints whole under reduced motion.
- **Singular and plural.** Many summaries flip between "1 invoice is overdue" and "2 invoices are overdue". Design the sentence for both lengths.
- **Clause drops.** Some summaries lose a whole clause when the condition clears (cohorts: the "1 has no leader yet" clause disappears when every cohort is led). The band must be comfortable one clause shorter.
- **Never dropped.** No page in this portal removes the band. A page's empty table still has a summary above it, because the summary is what tells the admin the queue is empty.

### 2.2 The Ask Tal dock

A floating bar at the foot of every page under the Tal dock rule: a travelling-light gradient border, the Tal mark, **Ask Tal anything**, then the module's sample question in curly quotes rotating every three seconds, then an arrow. Hidden while the chat, a sheet or a confirmation is open. The quoted question hides at narrow widths. There is no microphone in this portal.

### 2.3 The chat (P7, P8, P2 to P6)

A full-height page replacing the module content. Top row: a back arrow and **Back to** the module title, for example "Back to Finance & Settlement". The breadcrumb in the app bar reads **Tal** while the chat is open.

- **Opening state (P7).** A large orb Tal mark. Heading **Hello Derek, I am Tal 👋**. Line: *I can read the platform: accounts, the vetting queue, candidates and levels, cohorts, the marketplace, the money and the system. What do you need?* Below it the module's chips (two to four), then the field with placeholder **Ask anything**.
- **Chips.** A small spark mark and the question, white with a hairline. The set belongs to the module the admin came from, so every sub-page of Finance offers the same three. Chips disappear once the first question is asked.
- **Messages.** Speaker named above the bubble. **You** with the admin's initials disc, bubble on the brand ground with on-brand ink. **Tal** with the small Tal mark, white bubble.
- **Thinking (P8).** Three accent dots pulsing for about half a second.
- **Memory.** The thread survives leaving the chat and moving between pages, so reopening the dock shows the earlier conversation without chips. Reset clears it.
- **In View As.** Tal still answers while the admin is viewing as another user. Reads are allowed, writes are refused by the router with its own toast. Tal's copy does not mention the session; the View As bar above the page does.

### 2.4 Tal as a configuration subject (P9)

System and Audit, Overview, section **Quiz, Tal and notification routing**. Two key/value rows describe Tal's own limits and are editable in a sheet whose footnote reads *Applies from the next request. Logged at high severity, this is platform behaviour, not a preference.*

| Row | Value |
|---|---|
| Tal answers from | The live records of the module you are on; anything outside them is declined with a support contact |
| Tal and the billing ledger | Never read. The ledger is outside Tal's answers on every portal |

### 2.5 Where Tal is absent, on purpose

- **Before sign-in.** The sign-in scene holds no rail, no dock and no band.
- **Confirmations and step-up.** The six-digit code dialog, the delete and status confirmations, the grant and revoke sheets: Tal says nothing. The router's own toasts speak here (*Enter the 6-digit code from your authenticator*; *Read-only while viewing as Maryam Naz. End the session to make changes*).
- **Notifications, sheets, empty states.** No Tal line anywhere.

## 3. Page summaries — Summary by Tal

Bold marks the highlighted phrase. Chips are per module and listed once at the top of each module.

### 3.1 Dashboard

Chips: *What needs me today?* · *How is the money?* · *Which use cases are blocked?* · *Which decisions are still open?*

| Page | Summary |
|---|---|
| Overview | You have **4 agents to vet** and **3 payouts to release**. Two high-severity decisions, agent pay and the placement fee, are still open across the platform. |
| Rulings Register | Sixteen use cases: **2 confirmed, 7 open, 7 blocked**. Four of the blocked cases wait on rulings outside this module: level definitions, the settlement model, the LMS vendor and the double-blind carve-out. |

Design note: the prototype's register sentence says "Four of the five blocked cases" while the live count is seven. The corrected copy above drops the hard-coded number.

### 3.2 Users and Roles

Chips: *How many accounts do we have?* · *Who can see the AI raw score?* · *Can one person hold two roles?* · *Who holds Super Admin?*

| Page | Summary |
|---|---|
| Users | The platform has **33 accounts**: 21 candidates, 5 agents, 9 employers and 3 internal. Roles stack, so one person can be both a candidate and a cohort leader. |
| Roles and permissions, one holder | 9 roles, and the walls between them are deliberate. Only a **Reviewer sees the AI raw score**, and a full-access role can hold no other. One account holds Super Admin, so a grant here is single-approver until there is a second. |
| Roles and permissions, two or more holders | Same first two sentences, then: 2 accounts hold Super Admin. |
| Import users | Four steps from a CSV to live accounts. **Every row is matched to a role** before anything is created, and an invite goes to each new address on import. |
| Staff detail | **Derek Sole** holds one role, Super Admin, and joined 01-02-2026. An internal account. |
| Staff detail, product account | **Maryam Naz** holds 2 roles, Candidate and Cohort Leader, and joined 03-12-2026. A product account, matched to the marketplace records. |

### 3.3 Vetting and Approvals

Chips: *Who is ready to decide?* · *Which employers are unverified?*

| Page | Summary |
|---|---|
| Agent applications | 4 agents are in the queue, 3 ready to decide. Agents run recorded 1:1 interviews with 18 to 24 year-olds, so **2 need an enhanced safeguarding check** before they can go live. |
| Application detail, check required | **Ben Carto**, Engineering Manager, Loom, San Francisco, CA. 9 years and 120 prior interviews, at $180. An enhanced safeguarding check is required before going live. |
| Application detail, other third sentences | This application was approved. · This application was rejected. · The background check returned an adverse item to review. · Checks are clear. |
| Employer verification | **4 employer accounts are not yet verified.** An employer is verified before it can unlock candidate interviews or make a hire, so the queue is the gate on the hiring side. |
| Employer verification, one left | **1 employer account is not yet verified.** Same second sentence. |

### 3.4 Candidates

Chips: *How are candidates spread across buckets?* · *What is waiting in levelling?*

| Page | Summary |
|---|---|
| Candidates | 20 candidates across three buckets: **14 Explorer, 5 Builder, 1 Trailblazer**. A level is the reviewer's call off the agent's interview, and you can override any of them. |
| Levelling queue | **6 level reviews** are waiting on a decision, 3 recommended for promotion. The agent recommends off the interview; the reviewer decides to promote or hold. |
| Candidate detail | **Maryam Naz** is E2 in the Explorer bucket, assessed by Dana Whitfield. As Super Admin your level call wins over the AI and the reviewer, and the change is logged. |
| Candidate detail, no agent | Same, with "assessed by no agent yet". |

### 3.5 Talent Agents

Chips: *Who leads the ranking?* · *What do agents charge?*

| Page | Summary |
|---|---|
| Agents | 5 agents list on the marketplace and set their own fee, from $150 to $225. Ranking is computed from rating, then interviews conducted. **Dana Whitfield leads.** |
| Agent detail | **Dana Whitfield** is rated 4.9 over 64 interviews, ranked 1 of 5, at $180 a session. $156.00 sits in escrow and $144.00 has settled. |

### 3.6 Cohort Management

Chips: *Which cohorts need a leader?* · *How full are the cohorts?*

| Page | Summary |
|---|---|
| Cohorts, one unled | 3 cohorts are running across the Explorer and Builder tracks, and **1 has no leader yet**. Every cohort caps at 10 members and runs the 90-day loop. |
| Cohorts, all led | 3 cohorts are running across the Explorer and Builder tracks. Every cohort caps at 10 members and runs the 90-day loop. |
| Leader assignment | 21 candidates applied to lead, **7 recommended and ready to allot**. A Builder leads Explorer cohorts and a Trailblazer leads Builder, but nobody leads the very first ones. |
| Templates | 5 reusable blueprints, a course plus a session outline, tagged by level. A template already **in use by a cohort can't be deleted**; the rest can. |
| Course catalogue | 6 of 8 courses are live, from $90 to $280. **Explorer 1 is the $100 entry course**; more can be imported from the library. |
| Level mapping | Three buckets, Explorer, Builder, Trailblazer, each with three levels. A candidate climbs by re-interviewing, and **the bucket decides which cohorts they can lead**. |
| Cohort detail, active | **Explorer 12** is an Explorer cohort at E1, led by Maryam Naz. Week 12 of 13, 5 of 10 members. |
| Cohort detail, unled | **Explorer 14** is an Explorer cohort at E1, led by nobody yet. Week 1 of 13, 6 of 10 members. |
| Cohort detail, draft | **Explorer 15** is an Explorer cohort at E3, led by Grace Kim. It has not started; starting it begins the 90-day cycle. |
| Cohort detail, archived | Same opening, then: It ended at week 13. |
| Course detail | **Explorer 1** is an Explorer course at $100, over 90 days. It is live and bookable. · Draft: It is a draft, not yet on sale. |

Design note: the prototype prints "a Explorer cohort"; the article should follow the word.

### 3.7 Marketplace and Interviews

Chips: *How many interviews are booked?* · *How long are recordings kept?*

| Page | Summary |
|---|---|
| Bookings | 13 interviews are booked, **8 confirmed** and $1,565 paid into escrow. A candidate's first interview is free; a re-interview is the agent's own rate. |
| Recordings | Every 1:1 interview is recorded for review and levelling. **Recordings are kept 24 months**, and a highlight reel reaches an employer only when the candidate has consented. |

### 3.8 Employers and Hiring

Chips: *Who is spending most?* · *Why are placement invoices stuck?*

| Page | Summary |
|---|---|
| Employers | 9 employers, **5 verified**. They pay $40 to unlock a full interview and a placement fee on a hire. Hiring and Sponsoring are two different tracks. |
| Unlocks | An employer pays **$40 to unlock a candidate's full interview** beyond the free highlight clip. 20 unlocks so far, and this is exactly what an unlock reveals. |
| Placements, fee unset | 10 confirmed hires. The placement fee is the platform's largest revenue line and the **one fee with no agreed basis**, so 2 invoices sit blocked in draft. |
| Placements, fee set | 10 confirmed hires. The placement fee is the platform's largest revenue line, and **every placement invoice is issued**. |
| Employer detail | **BrightPath** is a hiring employer in EdTech, verified. 4 unlocks and 2 hires, $14,800 spent. · Variants: not yet verified · suspended · sponsoring employer. |

### 3.9 Finance and Settlement

Chips: *What is owed to agents?* · *What is overdue?* · *Is the ledger reconciled?*

| Page | Summary |
|---|---|
| Overview | $1,250 processed and $920 in progress. Settlement timing is a deliberate black box, **3 payouts are held**, and how agents are paid is still an open high-severity decision. |
| Transactions | Every money movement: course fees, interview payments, employer unlocks and agent payouts. **Held payments settle on the weekly cycle**; a placement charge is blocked until the fee is set. |
| Payouts | 3 payouts are held pending settlement. As Super Admin you can **release one ahead of the cycle**, and the release is written to the audit log. |
| Invoices | **2 invoices are overdue** and 2 sit in draft. The drafts are placement fees, blocked until that fee is set. · Singular: **1 invoice is overdue**. |
| Refunds and disputes | 6 refunds and disputes, **2 open**. A course fee is refundable inside the 14-day window; a card chargeback is fought or lost with the issuer, not by us. |
| Reconciliation | Stripe settles to the platform bank in batches. 2 are reconciled and **1 is unmatched** and needs a look. · Plural: **2 are unmatched** and need a look. |
| Fee configuration, open fees | Every price the platform charges, in one place. **Four fees are still unset**, the placement fee first among them, and the platform's share of an interview payment is configured here. |
| Fee configuration, all set | Every price the platform charges, in one place. **Every fee is set**, and the platform's share of an interview payment is configured here. |

Design note: the prototype says "the placement fee is the one still unset" while four lines read Not set. The corrected copy above counts them.

### 3.10 CRM and Attribution

Chips: *Where do accounts come from?* · *Which campaign works best?*

| Page | Summary |
|---|---|
| Overview | 1,000 tracked arrivals became **241 accounts**, a 24% conversion, worth about $96,400 in first-year value. NIL campaign is the largest channel by far. |
| Leads | 24 leads in the recent window, from first landing to converted. A lead becomes an account when it converts; **5 have left a contact** and are ready to nurture. |
| Campaigns | 6 campaigns across five channels. **Summer-Leadership drives the most leads**; each shows its cost per acquisition and its return on spend. |
| Attribution | The same 241 conversions, read three ways, **first-touch, last-touch and even multi-touch**, because a journey has several steps and each model credits them differently. |
| Referrals | Agents share their own NIL link and are credited the leads it drives. 3 are active; **Dana Whitfield's link leads** on clicks and revenue. |
| Lead detail | **Alex Rivera** arrived via NIL campaign and reached **Contact captured** over 4 touches. Quiz score 78. · Variants: Converted to an account. · No quiz score yet. |
| Campaign detail | **Summer-Leadership** runs on NIL campaign with a $5,000 budget, $3,200 spent. 42 leads, 14 converted, a cost per acquisition of $229. |

### 3.11 System and Audit

Chips: *Is anything down?* · *What did I change recently?* · *Any open data requests?*

| Page | Summary |
|---|---|
| Overview, one degraded | Every service is live except 1: video and recording is degraded. **3 of 6 feature flags are on**, and sign-in is email and password behind an 18+ age gate. |
| Overview, all live | Every service is live. **3 of 6 feature flags are on**, and sign-in is email and password behind an 18+ age gate. |
| Integrations, degraded | 7 external services run the platform. **Video and recording is degraded**; Stripe is in production, handling charges, escrow and payouts. |
| Integrations, all live | 7 external services run the platform. **Every integration is live**; Stripe is in production, handling charges, escrow and payouts. |
| Audit log | The immutable record of every consequential action: a level change, a released payout, a flag flip. It is **retained indefinitely in a WORM store** and cannot be edited. |
| Compliance | Safeguarding, consent and data rights in one place. Enhanced checks gate agents who interview 18 to 24s, and **2 data requests are open** against the 30-day clock. · Singular: **1 data request is open**. |

### 3.12 Settings

Chips: *Is two-factor on?* · *Where do dates and currency get set?*

| Page | Summary |
|---|---|
| General | The platform's identity and how dates, currency and the timezone read across the admin. These change the admin views, **not what a candidate sees**. |
| Profile | Your Super Admin account: **Derek Sole, Head of Operations**. The one account with override on any level or setting on the platform. |
| Notifications | What reaches you, by email and in the bell. **The vetting queue and settlement alerts** are the two worth keeping on. |
| Login and Security | How your session is protected. Two-factor is on, a fresh code is asked for on the highest-severity actions, and you can **end any other session** from here. · Variants: Two-factor is off · a fresh code is not asked for. |
| Payments | The cards and billing details the platform bills against. Full card numbers are never stored; **Stripe tokenises them**. |

## 4. Chat scenarios

Grouped by the module whose chips lead to them. Any question can be asked from any module. The prototype matches chip text exactly; the phrasings under **User asks** are what the production router should also catch.

### 4.1 Dashboard

#### S-01 · What needs me today

:: Module: Dashboard
:: User asks: "What needs me today?" · "What's waiting on me?" · "What should I do first?" · "Show me my queue"
:: State: 4 in vetting, 3 payouts held, 6 level reviews, 4 employers unverified
:: Response type: P5 Text + facts + action
:: Status: In prototype

> 4 agents are waiting on a vetting decision, 3 payouts are held and 6 level reviews want a signature. The vetting queue is the one that blocks other people.

Facts: **Agents to vet** · 4 · **Payouts held** · 3, $600 · **Level reviews** · 6 · **Employers to verify** · 4. Action: **Open the vetting queue →**.

Empty variation: *Nothing is waiting on you. The vetting queue is clear, every payout has settled and no level review is open. The next thing that arrives lands in the bell.* (P2)

#### S-02 · How is the money

:: Module: Dashboard
:: User asks: "How is the money?" · "Where do we stand financially?" · "How much is held?"
:: State: $1,250 processed, $920 in progress, $600 owed
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts block proposed)

> $1,250 processed this window and $920 still held. $600 is owed to agents across 3 held payouts.

Facts: **Processed** · $1,250 · **In progress** · $920 · **Owed to agents** · $600, 3 payouts · **Overdue invoices** · 2, $280. Action: **Open Finance →**.

#### S-03 · Which use cases are blocked

:: Module: Dashboard
:: User asks: "Which use cases are blocked?" · "What's blocked in the journey?" · "What can't we build yet?"
:: State: 7 of 16 blocked
:: Response type: P5 Text + facts + action
:: Status: In prototype

> 7 of 16. Four of them wait on rulings outside this module: level definitions, the settlement model, the LMS vendor and the double-blind carve-out. The register names an owner for each.

Facts, one row per blocked case with its owner's first name: **SA-02** · Sign in · Umair · **SA-03** · Console landing · Umair · **SA-05** · Score override · Derek · **SA-06** · Refunds · Reed · **SA-07** · Payout override · Reed · **SA-13** · Course-to-level mapping · Umair · **SA-15** · Audit log · Umair. Action: **Open the register →**.

This is the one place Tal names a blocked case. Owners are first names only, by rule.

#### S-04 · Which decisions are still open

:: Module: Dashboard
:: User asks: "Which decisions are still open?" · "What hasn't been decided?" · "What's the highest-severity open item?"
:: State: 13 high, 11 medium
:: Response type: P4 Text + action
:: Status: In prototype

> 13 high and 11 medium. The two that cost money are agent pay and the placement fee, and both live in Fee Configuration.

Action: **Open Fee Configuration →**.

### 4.2 Users and Roles

#### S-05 · How many accounts do we have

:: Module: Users and Roles
:: User asks: "How many accounts do we have?" · "How many users?" · "How many are deactivated?"
:: State: 33 accounts, 1 inactive
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts proposed)

> 33 accounts: 21 candidates, 5 agents, 9 employers and 3 internal. One is deactivated.

Facts: **Candidates** · 21 · **Agents** · 5 · **Employers** · 9 · **Internal** · 3 · **Inactive** · 1. Action: **Open Users →**.

#### S-06 · Who can see the AI raw score

:: Module: Users and Roles
:: User asks: "Who can see the AI raw score?" · "Which roles see the raw score?" · "Can a manager see the AI score?"
:: State: Any
:: Response type: P4 Text + action
:: Status: In prototype (copy corrected)

> Only roles with the raw-score capability: Reviewer, Supervisor, Admin and Super Admin. A Manager can conduct interviews and still not see it; that wall is deliberate, so the number never leaks into a conversation.

Action: **Open the permission matrix →**.

Design note: the prototype lists Manager in the first sentence and denies it in the second. The seed matrix should be corrected to match the intent above.

#### S-07 · Can one person hold two roles

:: Module: Users and Roles
:: User asks: "Can one person hold two roles?" · "Do roles stack?" · "Can a candidate also be a leader?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> Yes, roles stack. Maryam Naz is a candidate and a cohort leader on one account. The exception is a full-access role, which can hold no other.

#### S-08 · Who holds Super Admin

:: Module: Users and Roles
:: User asks: "Who holds Super Admin?" · "How many super admins are there?" · "When does the grant expire?"
:: State: One permanent holder
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts proposed)

> Derek Sole, permanent. With one holder a grant is single-approver until there is a second. A time-boxed grant expires on its own; every grant and revocation is logged at high severity.

Facts, one row per holder: **Derek Sole** · Permanent. Other row forms: *until 12-07-2026* · *expired*. Action: **Super Admin holders →**.

With two or more holders the single-approver sentence is dropped.

#### S-09 · Grant someone Super Admin

:: Module: Users and Roles
:: User asks: "Make Umair a super admin" · "Grant Super Admin to Nadia" · "How do I add a second super admin?"
:: State: Any
:: Response type: P4 Text + action
:: Status: Proposed

> That one is yours to sign, not mine. A grant is time-boxed by default, 30 or 90 days or permanent, needs a reason and a second approver, and confirms with your authenticator code. It cannot go to an account that is also an agent or a leader.

Action: **Open the grant sheet →**. Tal never grants, revokes or escalates.

### 4.3 Vetting and Approvals

#### S-10 · Who is ready to decide

:: Module: Vetting
:: User asks: "Who is ready to decide?" · "Which applications can I approve?" · "Who's in the vetting queue?"
:: State: 4 open, 3 ready, 2 flagged
:: Response type: P5 Text + facts + action
:: Status: In prototype

> 3 applications are ready. 2 need the enhanced safeguarding check to clear first because they would interview 18 to 24 year-olds.

Facts, one row per applicant: **Ben Carto** · Engineering Manager, Loom · Enhanced check · **Ivy Chen** · Senior PM, Convex · Checks clear · **Raul Mendez** · Staff Engineer, Kavak · Checks clear · **Grace Lin** · Design Director, Freelance · Enhanced check. The third value can also read *Adverse item*. Action: **Open the queue →**.

#### S-11 · Which employers are unverified

:: Module: Vetting
:: User asks: "Which employers are unverified?" · "Who can't hire yet?" · "What's in employer verification?"
:: State: 4 unverified
:: Response type: P4 Text + action
:: Status: In prototype

> 4: Northgate Health, Filter Go, Vantage Media and Cedar & Co. None can unlock an interview or hire until verified.

Action: **Verify employers →**.

#### S-12 · Tell me about an applicant

:: Module: Vetting, application detail
:: User asks: "Tell me about Ben Carto" · "What did the check return?" · "Is Grace Lin safe to approve?"
:: State: Application open
:: Response type: P3 Text + facts
:: Status: Proposed

> Ben Carto is an Engineering Manager at Loom with 9 years and 120 prior interviews, asking $180. He would interview 18 to 24 year-olds, so the enhanced safeguarding check has to clear before he can go live. Nothing else on the file is waiting.

Facts: **Role** · Engineering Manager, Loom · **Experience** · 9 years, 120 interviews · **Fee** · $180 · **Check** · Enhanced, pending.

### 4.4 Candidates

#### S-13 · How are candidates spread across buckets

:: Module: Candidates
:: User asks: "How are candidates spread across buckets?" · "How many Explorers do we have?" · "Who has no agent?"
:: State: 20 candidates
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts proposed)

> 14 Explorer, 5 Builder and 1 Trailblazer, 20 in all. 7 have no assessing agent yet.

Facts: **Explorer** · 14 · **Builder** · 5 · **Trailblazer** · 1 · **No agent yet** · 7. Action: **Open the directory →**.

#### S-14 · What is waiting in levelling

:: Module: Candidates
:: User asks: "What is waiting in levelling?" · "Which level reviews are open?" · "Who is up for promotion?"
:: State: 6 in queue, 3 promote
:: Response type: P5 Text + facts + action
:: Status: In prototype

> 6 reviews, 3 recommended for promotion. The agent recommends off the interview; you sign or hold.

Facts, the first four of the queue: **Maryam Naz** · E1 to E2 · Promote · **Jordan Vale** · B1 to B1 · Hold at level · **Chris Boone** · E1 to E1 · Not ready to re-interview · **Hana Sato** · B1 to B2 · Promote. Action: **Open levelling →**.

#### S-15 · Override a level

:: Module: Candidates, candidate detail
:: User asks: "Move Maryam to E3" · "Can I override this level?" · "Set Jordan down to E4"
:: State: Any
:: Response type: P4 Text + action
:: Status: Proposed

> Yes, and it is your press, not mine. The override sheet offers the MVP levels, asks a downward move twice, records whether the candidate is told, and says when it lands if a cohort is mid-run. Both lines stay in the history and it can be reversed.

Action: **Open the override sheet →**.

### 4.5 Talent Agents

#### S-16 · Who leads the ranking

:: Module: Talent Agents
:: User asks: "Who leads the ranking?" · "Who's the top agent?" · "How is ranking calculated?"
:: State: 5 agents
:: Response type: P4 Text + action
:: Status: In prototype

> Dana Whitfield, rated 4.9 over 64 interviews at $180. Ranking is rating first, then interviews conducted, recalculated weekly.

Action: **Open agents →**. Empty variation: *No agents are listed.*

#### S-17 · What do agents charge

:: Module: Talent Agents
:: User asks: "What do agents charge?" · "What's the fee range?" · "Who is most expensive?"
:: State: Fees $150 to $225
:: Response type: P4 Text + action
:: Status: In prototype

> From $150 to $225. They set their own fee; a candidate's first interview is free and the platform takes its configured share of the rest.

Action: **Fee configuration →**.

### 4.6 Cohort Management

#### S-18 · Which cohorts need a leader

:: Module: Cohorts
:: User asks: "Which cohorts need a leader?" · "Who is unled?" · "How many leaders are ready?"
:: State: Explorer 14 unled, 7 recommended
:: Response type: P4 Text + action
:: Status: In prototype

> Explorer 14. 7 leaders are recommended and ready to allot.

Action: **Allot a leader →**. All-led variation: *None. 7 leaders are recommended and ready to allot.*

#### S-19 · How full are the cohorts

:: Module: Cohorts
:: User asks: "How full are the cohorts?" · "How many members in Explorer 12?" · "Is any cohort full?"
:: State: 3 running
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts proposed)

> Explorer 12 has 5 of 10, Explorer 14 has 6 of 10 and Builder 3 has 4 of 10. Every cohort caps at 10 and runs the 90-day loop.

Facts: **Explorer 12** · 5 of 10, week 12 · **Explorer 14** · 6 of 10, week 1 · **Builder 3** · 4 of 10. Action: **Open cohorts →**.

#### S-20 · Intervene in a cohort

:: Module: Cohorts, cohort detail
:: User asks: "Extend Explorer 12 by two weeks" · "Merge Explorer 14 into 12" · "Dissolve Builder 3"
:: State: Any
:: Response type: P4 Text + action
:: Status: Proposed

> Each of those is a sheet on the cohort page: extend, merge, move members or dissolve, and each states what happens to the members before you confirm. Dissolving asks twice. I can tell you the cohort's state; the press is yours.

Action: **Open Explorer 12 →**.

### 4.7 Marketplace and Interviews

#### S-21 · How many interviews are booked

:: Module: Marketplace
:: User asks: "How many interviews are booked?" · "How much is in escrow?" · "How many are unpaid?"
:: State: 13 booked
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts proposed)

> 13. 8 confirmed and paid into escrow, 5 waiting on payment.

Facts: **Confirmed** · 8 · **Awaiting payment** · 5 · **In escrow** · $1,565. Action: **Open bookings →**.

#### S-22 · How long are recordings kept

:: Module: Marketplace
:: User asks: "How long are recordings kept?" · "What's the retention on interviews?" · "Can an employer see the whole recording?"
:: State: Any
:: Response type: P4 Text + action
:: Status: In prototype

> Twenty-four months, with the candidate's consent captured at booking. A highlight reel reaches an employer only when the candidate agreed to it, and the full interview only when the employer has paid to unlock it.

Action: **Recordings →**.

### 4.8 Employers and Hiring

#### S-23 · Who is spending most

:: Module: Employers
:: User asks: "Who is spending most?" · "Which employer hires most?" · "Top employers by spend"
:: State: 9 employers
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts proposed)

> Kestrel Labs, then Meridian Bank, then BrightPath. Between them they account for 15 unlocks and 8 hires.

Facts: **Kestrel Labs** · 6 unlocks, 3 hires · **Meridian Bank** · 5 unlocks, 3 hires · **BrightPath** · 4 unlocks, 2 hires. Action: **Open employers →**.

#### S-24 · Why are placement invoices stuck

:: Module: Employers, Finance
:: User asks: "Why are placement invoices stuck?" · "Why are invoices in draft?" · "What's blocking the placement charge?"
:: State: Placement fee unset
:: Response type: P4 Text + action
:: Status: In prototype

> The placement fee has no agreed basis, so 2 invoices sit in draft. Setting the fee in Fee Configuration issues them.

Action: **Set the placement fee →**. Fee-set variation: *Nothing is stuck. Every placement invoice is issued.*

### 4.9 Finance and Settlement

#### S-25 · What is owed to agents

:: Module: Finance
:: User asks: "What is owed to agents?" · "Which payouts are held?" · "Can I release Dana's payout?"
:: State: 3 held, $600
:: Response type: P5 Text + facts + action
:: Status: In prototype

> $600 across 3 held payouts. Weekly auto-release is on; you can release any one early and it is logged.

Facts, one per held payout: **Priya Raman** · $180 · Awaiting settlement · **Dana Whitfield** · $156 · Scheduled Aug 18 · **Sofia Reyes** · $264 · Awaiting settlement. Action: **Open payouts →**.

Releasing all at once is a step-up action; Tal names it but never performs it.

#### S-26 · What is overdue

:: Module: Finance
:: User asks: "What is overdue?" · "Which invoices are late?" · "Any open disputes?"
:: State: 2 overdue, 2 open refunds
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts proposed)

> 2 invoices, $280 in total. 2 refunds or disputes are open.

Facts: **Overdue invoices** · 2, $280 · **Open refunds** · 2 · **Drafts blocked** · 2, placement fee. Action: **Open invoices →**.

#### S-27 · Is the ledger reconciled

:: Module: Finance
:: User asks: "Is the ledger reconciled?" · "Do the Stripe batches match?" · "What's unmatched?"
:: State: 1 unmatched
:: Response type: P4 Text + action
:: Status: In prototype

> 2 of 4 batches match; 1 is unmatched. Stripe settles to the platform bank in batches, and the unmatched one needs a look before the week closes.

Action: **Reconciliation →**.

#### S-28 · Approve a refund

:: Module: Finance, refunds
:: User asks: "Approve the refund for Callum" · "Can I refund this course fee?" · "Is there a chargeback on this charge?"
:: State: Refund open
:: Response type: P4 Text + action
:: Status: Proposed

> A refund carries its kind, interview, cohort pro-rata, sponsored or goodwill credit, and its source. Approval is refused while a chargeback is in flight on the same charge, and warns when the agent's payout has already settled. With no threshold set, every refund is yours to approve.

Action: **Open the refund →**.

#### S-29 · Show me a transaction

:: Module: Finance
:: User asks: "Show me Maryam's payment" · "List today's transactions" · "What did BrightPath pay on the 12th?"
:: State: Any
:: Response type: P6 Refusal
:: Status: Proposed

> I give you the money in aggregates, processed, held, owed and overdue, but I never read the ledger itself. The transaction rows are on the Transactions page, filterable by kind and date.

Action: **Open Transactions →**. This is the billing-ledger rule made visible.

### 4.10 CRM and Attribution

#### S-30 · Where do accounts come from

:: Module: CRM
:: User asks: "Where do accounts come from?" · "Which channel converts best?" · "How many leads left a contact?"
:: State: 241 conversions
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts proposed)

> NIL campaign first, then QR code, then referral. 5 leads have left a contact and are ready to nurture.

Facts: **NIL campaign** · 96 · **QR code** · 44 · **Referral** · 40. Action: **Open leads →**.

#### S-31 · Which campaign works best

:: Module: CRM
:: User asks: "Which campaign works best?" · "What's our cost per acquisition?" · "Which campaign should we cut?"
:: State: 6 campaigns
:: Response type: P4 Text + action
:: Status: In prototype

> Summer-Leadership drives the most conversions: 42 leads, 14 converted, at $229 an acquisition. Cost per acquisition is on every row of Campaigns.

Action: **Campaigns →**.

### 4.11 System and Audit

#### S-32 · Is anything down

:: Module: System
:: User asks: "Is anything down?" · "Is Stripe working?" · "What's degraded?"
:: State: Video and recording degraded
:: Response type: P4 Text + action
:: Status: In prototype

> Video and recording is degraded; everything else is live, and Stripe is in production. 3 of 6 feature flags are on.

Action: **System health →**. All-live variation: *Every service is live. 3 of 6 feature flags are on.*

#### S-33 · What did I change recently

:: Module: System
:: User asks: "What did I change recently?" · "Show my last actions" · "What's in the audit log from me?"
:: State: Grows with the session
:: Response type: P5 Text + facts + action
:: Status: In prototype (facts proposed)

> Your three most recent lines. Every one is retained indefinitely and cannot be edited.

Facts, the newest three audit lines by the admin: **Changed feature flag** · SCENES to employers, on · **Released payout** · Marcus Ozoro, $160 released early · **Adjusted agent level** · Marcus Ozoro to T3. Action: **Audit log →**.

#### S-34 · Any open data requests

:: Module: System
:: User asks: "Any open data requests?" · "Who has asked for their data?" · "What's due on the 30-day clock?"
:: State: 2 open
:: Response type: P5 Text + facts + action
:: Status: In prototype (dates corrected to MM-DD-YYYY)

> 2 against the 30-day clock.

Facts: **Maryam Naz** · Data export · due 08-26-2026 · **Callum Reid** · Account deletion · due 08-25-2026. Action: **Compliance →**.

#### S-35 · Rotate a key or flip a flag

:: Module: System
:: User asks: "Turn SCENES off" · "Rotate the Stripe key" · "Enable the new flag"
:: State: Any
:: Response type: P4 Text + action
:: Status: Proposed

> A flag flips on the Overview and writes an audit line the moment it does. A key rotation confirms first and tells you which integration reconnects. I will not flip either from here.

Action: **System overview →**.

### 4.12 Settings

#### S-36 · Is two-factor on

:: Module: Settings
:: User asks: "Is two-factor on?" · "Is my account secured?" · "How do I end other sessions?"
:: State: Two-factor on
:: Response type: P4 Text + action
:: Status: In prototype

> Yes, required for staff and on for your account. You can end any other session from Login and Security.

Action: **Login and Security →**. Off variation: *Off for your account, though it is required for staff.*

#### S-37 · Where do dates and currency get set

:: Module: Settings
:: User asks: "Where do dates and currency get set?" · "How do I change the timezone?" · "Can I change the date format?"
:: State: Any
:: Response type: P4 Text + action
:: Status: In prototype

> General settings. They change how the admin reads, not what a candidate sees.

Action: **General →**.

### 4.13 View As

#### S-38 · Ask Tal while viewing as someone

:: Module: Any, View As open
:: User asks: Any question · "Why can't I edit this?" · "Am I still viewing as Maryam?"
:: State: View As read-only
:: Response type: P2 Text
:: Status: Proposed

> You are viewing as Maryam Naz, read-only, since 2:14 PM. Interview video is excluded. I still answer off the records, but every write is refused until you end the session from the bar above.

Tal's ordinary answers are unchanged in View As; only this question about the session is new.

## 5. Refusals and fallbacks

#### S-39 · Outside the module's records (P6)

:: Module: Any
:: User asks: Anything not about accounts, vetting, candidates and levels, cohorts, the marketplace, the money or the system, or a typo of a chip
:: Response type: P6 Refusal
:: Status: In prototype (chips re-offer and support contact proposed)

> **I do not have that one**
> I can read the platform: accounts, the vetting queue, candidates and levels, cohorts, the marketplace, the money and the system. Ask me about one of those and I will answer off the records.

Design: re-offer the module's chips under the bubble, and where the question is a real platform question Tal cannot answer, add a quiet support line: *If it is about the platform and I cannot read it, support can: support@talentnext.com.* The prototype describes the support contact in its own configuration page but never shows one.

#### S-40 · Personal or sensitive data

:: Module: Any
:: User asks: "What's Maryam's password?" · "Show me Ben's background check file" · "What's Dana's bank account?"
:: Response type: P6 Refusal
:: Status: Proposed

> I do not read credentials, check files or bank details. Passwords are never stored in a readable form, check results reach you as a status on the application, and payout accounts stay with Stripe.

#### S-41 · Another portal

:: Module: Any
:: User asks: "What does Maryam see on her dashboard?" · "Show me the agent portal"
:: Response type: P4 Text + action
:: Status: Proposed

> I read this portal's records, not another user's screen. View As shows you exactly what Maryam sees, read-only, with interview video excluded, and both ends of the session are audited.

Action: **Start View As →**. That control confirms with a step-up code.

## 6. State variation at a glance

| Condition | Where Tal changes | Now / alternate |
|---|---|---|
| Degraded integration | System overview and integrations summaries; S-32 | "Video and recording is degraded" / "Every service is live" |
| Unmatched settlements | Reconciliation summary; S-27 | "1 is unmatched" / "2 are unmatched" / all match |
| Single Super Admin holder | Roles summary; S-08 | Single-approver sentence present / dropped; holder rows read permanent, until a date, or expired. Time-boxed grants expire on their own on every render |
| Placement fee unset | Fee configuration, Placements, Invoices summaries; S-24; Dashboard | "no agreed basis, 2 invoices in draft" / "every placement invoice is issued" |
| Open refunds | Refunds summary; S-26 | count and plural |
| Held payouts | Dashboard, Finance overview and Payouts summaries; S-01, S-02, S-25 | count, dollar sum, per-payout rows |
| Vetting queue and safeguarding | Dashboard and Applications summaries; S-01, S-10 | counts; third value per applicant: Enhanced check, Adverse item, Checks clear |
| Unled cohorts | Cohorts summary; S-18 | clause present / dropped; "None." |
| Cohort status | Cohort detail summary | active with week and members / draft, not started / archived, ended at week N |
| Application decided | Application detail summary | check sentence replaced by approved or rejected |
| Two-factor and step-up | Security summary; S-36 | on / off; asked for / not asked for |
| Weekly auto-release | S-25 | on / off |
| Open data requests | Compliance summary; S-34 | count, singular, per-request rows |
| Admin's own actions | S-33 | newest three audit lines, grows within the session |
| View As open | S-38 only | Tal continues; writes refused by the router |

## 7. Gaps found while reading the prototype

- **Exact-match routing.** Only a chip's text typed verbatim gets an answer; anything else falls to the refusal. Section 4 lists the phrasings the router should catch.
- **The refusal re-offers nothing.** After the first question the chips never return, and the support contact described on the System page does not exist in the chat.
- **Rulings Register summary contradicts its count.** "Four of the five blocked" against a live seven. Corrected in 3.1.
- **Raw-score answer contradicts itself.** Manager is listed as seeing the raw score and then denied it; the seed matrix gives Manager the capability. Corrected in S-06.
- **Fee configuration says "the one" fee is unset** while four lines read Not set. Corrected in 3.9.
- **Grammar edge cases.** "1 are deactivated", "a Explorer cohort". Corrected in S-05 and 3.6.
- **Dates in the compliance answer** are "26 Aug" against the MM-DD-YYYY rule. Corrected in S-34.
- **Two different subject lists.** The chat opening names five subjects and the refusal names seven. Both should use the seven-subject line in 2.3.
- **Tal has no answer about its own limits** (what it reads, the ledger rule, View As). S-29, S-38 and S-40 propose them.
