# Tal scenarios — Talent Agent portal
Design coverage for every response Tal gives to a signed-in Talent Agent.
Source of truth: `tn-agent-portal.html` and `design-system/talentnext-ds.js`, read on 8 Sep 2026.
Prepared for the Tal response design pass. Companion documents cover the Candidate, Cohort Leader and Super Admin portals.

## 1. How to read this document

**Who the user is.** The signed-in agent in the prototype is Owen Clarke: interview fee $85, paid $68 an interview, rating 4.6, 164 interviews behind him, ranked 12 of 38, assessing Explorer E2 to Builder B1, managed by Nadia Rahman, with $204 held in escrow and $612 earned this month. Every figure in a Tal response below is one of those, so the designer can see exactly which numbers a response carries.

**Four stages of the agent's journey** change what Tal says on the same page: Setup (approved, profile still open), Training (three of four lessons done, calibration booked), Working (booked and busy, the default) and Reviewed (range widened after the quarterly review). A fifth, Listed-but-empty, exists in the copy tables and is hidden from the stage picker.

**Each scenario is a card** with the same fields:

| Field | Meaning |
|---|---|
| Page | Where the user is when they ask, and where the answer is drawn |
| User asks | The natural phrasings that should reach this answer. The first one is the suggested-question chip the page offers |
| State | The portal state that produces this exact answer |
| Response type | One of the response patterns in the table below. This is the field that tells the designer whether there is a visual |
| Status | **In prototype** means the copy exists in the portal today. **Proposed** means the question is one a real agent will ask and the prototype has no answer for it yet; the response is written here so design can cover it |

**Response patterns.** Every Tal response in this portal is one of these shapes. Design the shape once and every scenario below points at one of them.

| Pattern | Shape | Where it is used |
|---|---|---|
| **P1 Summary band** | "Summary by Tal" at the head of a page: a label, one or two typed-in sentences, optionally a second column to its right | Every module page except two that speak for themselves |
| **P2 Text answer** | In the chat: an eyebrow repeating the question, then one short paragraph | The commonest chat reply |
| **P3 Text + facts** | P2 plus a block of key/value lines under the paragraph (label left, value right, tabular figures) | Scores, money, timings |
| **P4 Text + facts + action** | P3 plus one quiet outlined button with a trailing arrow that opens a page | Only where the answer has a natural next screen |
| **P5 Text + list** | P2 plus a short list of people or slots as rows (avatar or time, name, one caption) | Proposed for "what is booked" and "who is waiting" questions |
| **P6 Refusal** | P2 shape with the eyebrow "I do not have that one" and a fixed sentence naming what Tal can answer, then the page's chips re-offered | Any question outside Tal's four subjects |
| **P7 Chat opening** | The empty conversation: a large animated Tal mark, "Hello Owen, I am Tal", one line on what Tal can read, three chips, the field | Every time the chat is opened fresh |
| **P8 Thinking** | A Tal bubble holding three pulsing accent dots for about half a second before the answer replaces it | Between every question and answer |
| **P9 Tal on a page** | Tal speaking inside a page, not the chat: the "Evaluation by Tal" card, the "Tal recommends" flag on the level ladder, the Tal star on a candidate's quote | Evaluation page, Requests tab |

**What Tal can read in this portal.** Four subjects, stated to the agent in the chat opening: the public profile, the interviews, the scores and the money. Training and availability are folded into those. Tal does not read a candidate's private data, another agent's figures, or anything on another portal.

## 2. Where Tal appears

### 2.1 The Summary by Tal band (P1)

At the head of every module page, inside the head band. Label reads **Summary by Tal**, never "Tal". One or two sentences, 18 to 28 words, real figures from the page, no framing, no policy, no pointing at the interface.

**States to design**

- **Typing in.** On arrival the summary types itself over roughly 3.4 seconds with a thin caret. A ghost copy holds the box at its final height so nothing below it moves. It re-types when the page changes, when the stage changes, when the Interviews tab changes, and whenever the sentence genuinely changes (accepting a request changes the Interviews sentence). Prints instantly when the reader has reduced motion on.
- **Full width.** The band is Tal's sentence alone.
- **Two columns.** Tal's sentence left, one of two right-hand blocks: the journey stepper (Setup and Training dashboards) or the **Your earnings** block (Working and Reviewed dashboards: $612 earned this month, $204 held, a segmented rail of the ledger, "9 interviews · $68 an interview · $255 in escrow").
- **With a black card under it.** The dashboard carries one plate beneath the band: "Write your public profile" (Setup), the calibration card with Derek Hale (Training), or the next-interview call card with a Join button (Working, Reviewed).
- **Dropped.** Two pages have no band at all. The evaluation page, because Tal already speaks there through the Evaluation by Tal card. Earnings before a payout destination exists, because the page is one empty state and a summary over an empty page is noise.

### 2.2 The Ask Tal dock

A floating bar at the foot of every page: the Tal mark, the words **Ask Tal anything**, then the page's first suggested question in quotes and grey, rotating every three seconds with a short fade, then a send arrow. On the phone the sample question is hidden and the label stays. Pressing anywhere on it opens the chat with the page's chips. Hidden while the chat or a sheet is open. There is no microphone in this portal.

### 2.3 The chat (P7, P8, P2 to P6)

A full-height conversation page with a back link reading **Back to** the module the agent came from (Home, Interviews, Availability, Earnings, Standing, Training; the transcript and interview pages return to Interviews).

- **Opening state (P7).** Large animated Tal mark. Heading **Hello Owen, I am Tal 👋**. Line: *I can read your public profile, your interviews, your scores and the money. What do you need?* Below it, the three chips for the page the agent came from, then the field with placeholder **Ask anything** and a send arrow.
- **Chips.** Each chip is a small Tal spark mark and the question. Pressing one posts it as the agent's message. Chips disappear once the first question is asked.
- **Messages.** The speaker is named above each bubble: **You** with the agent's avatar, **Tal** with the small Tal mark. Tal's bubble is capped at a readable measure (about 60 characters).
- **Thinking (P8).** Three accent dots pulsing in a Tal bubble for about half a second, then the answer replaces them. The caret returns to the field only on the agent's own turn.
- **The answer (P2 to P6).** Eyebrow, paragraph, optional facts block, optional action button.

### 2.4 Tal on a page (P9)

| Surface | Page | What to design |
|---|---|---|
| **Tal star on the quote** | Interviews, Requests tab, each request card | A round pill on Tal's pale wash with a small gradient spark and the candidate's own words in accent ink, for example *"Running a project across two teams for the first time"* |
| **Evaluation by Tal** | An interview whose report is owed | A stacked card: label **Evaluation by Tal**, then two to four paragraphs of Tal's read of the transcript, the actionable phrases highlighted on the pale wash. Full page width, sits where the summary band would |
| **Tal recommends** | The level ladder on the same page | The rung Tal suggests carries a small accent label **Tal recommends** above it and is pre-selected. The agent can pick another rung |
| **Report drafting note** | The "Before it" disclosure on an upcoming interview | A step reading *Send the report within a day. Tal drafts it off the transcript. The level is set by you and signed by you.* |
| **Notification** | App bar, Working stage | *Sofia Marek's report is due. 6:00 PM today. Tal has a draft off the transcript waiting for your edit.* |

## 3. Page summaries — Summary by Tal

Every summary the band can show, by page and state, with the chips that page hands to the dock and the chat. Bold marks the phrase that would carry the accent highlight; the agent portal currently ships these without any highlight, and design should decide whether to add one per sentence as the candidate portal does.

### 3.1 Dashboard

| State | Summary |
|---|---|
| Setup | Approved on 12 June, and the agent role sits on the account you already had. **Your public profile, your fee and payouts are all still open.** |
| Training | Three of four lessons done, and calibration is Thursday 20 June with Derek Hale. **Certification is the last thing before you can be booked.** |
| Listed, nothing booked | Listed since Monday and nothing booked yet. Six slots are open over the next fortnight, and **Friday at 5:00 PM is the first.** |
| Working | **Sofia Marek's report is due at 6:00 PM today**, and Rafael Ortiz is Thursday at 3:00 PM. $204 is held for you in escrow. |
| Reviewed | Nadia widened your range on 1 October, so **you can assess E1 to B2 now.** Two bookings arrived in the week since. |

Chips: *What's on me today?* · *How are my scores moving?* · *When does the escrow release?*

### 3.2 Training

| State | Summary |
|---|---|
| Setup | None of the four lessons are started, and calibration is booked once they are. **Nothing you write goes into browse until Derek has signed you off.** |
| Training | Three lessons done, one to go, and **calibration is Thursday with Derek Hale.** He watches for tenacity, energy, and whether you notice what isn't said. |
| Certified | All four lessons done and calibrated on 20 June by Derek Hale. The method is re-checked once a year, so **nothing's due until June.** |

Chips: *What is calibration?* · *Can I fail it?* · *Does training come back?*

### 3.3 Interviews

One sentence across all four tabs (Requests, Upcoming, Evaluations, Past Interviews). It re-types when the tab changes and when a request is accepted or declined, because the figures move.

| State | Summary |
|---|---|
| Listed, nothing booked | Nothing booked yet. Six slots are open over the next fortnight, and **a request waits here for your answer** the moment somebody takes one. |
| Requests waiting (3) | **3 requests are waiting on you**, and 5 interviews are booked with the first tomorrow. Sofia's report is due at 6:00 PM. |
| One request | **One request is waiting on you**, and 5 interviews are booked with the first tomorrow. Sofia's report is due at 6:00 PM. |
| All answered | 5 interviews are booked, the first tomorrow, and **Sofia's report is due at 6:00 PM.** 164 finished in total. |

Chips: *Can I decline a booking?* · *What if they don't show?* · *What do I read beforehand?*

### 3.4 Interview detail

The summary is a function of the record. A black call card with the Join button sits under the band on an upcoming interview.

| Record | Summary |
|---|---|
| Upcoming, first interview | Rafael Ortiz is Thursday at 3:00 PM, confirmed and in your diary. **They're straight off the quiz, so no level exists yet.** |
| Upcoming, re-interview | Amara Osei is Monday at 6:00 PM, confirmed and in your diary. **It's a re-interview, so their 90-day summary is on the brief.** |
| Just accepted | Nadia Brenner is Friday at 5:00 PM, confirmed and in your diary. They're straight off the quiz, so no level exists yet. |
| Report owed | No band. The Evaluation by Tal card takes its place (see 2.4) |
| Done | Tom Whelan, 17 August, **confirmed at Builder B1 and signed the same evening.** Follow-up scored 4.6 and depth 4.8. |

Chips: *How is the report written?* · *Can I change a level afterwards?* · *How long do I have?*

### 3.5 Transcript

No band; the recording speaks for itself. The dock falls back to the dashboard's chips today. **Proposed:** give the transcript its own three chips so the dock is about the recording: *Summarise this interview* · *Where did the follow-up land?* · *Draft the report from this.*

### 3.6 Availability (the calendar)

Computed from the slots. Working stage as seeded:

> 22 slots are open in the weeks ahead and 5 are taken. **Today at 3:00 PM is the first one nobody has claimed.**

The first-open phrase reads *today*, *tomorrow* or a weekday name with the time. When every slot is taken the sentence must degrade cleanly; the prototype's edge case currently reads awkwardly and the design copy should be: *Every slot in the weeks ahead is taken. Open one on the grid and it is offered the same minute.*

Chips: *How far ahead can I open?* · *Can I take a slot back?* · **Proposed third:** *Which days do candidates book most?*

### 3.7 Earnings

| State | Summary |
|---|---|
| No payout destination | No band. The page is one empty state with a Stripe hand-off button |
| Listed, nothing earned | Nothing earned yet. **Your $85 splits to $68 once a report is delivered**, and it sits in escrow for three working days first. |
| Earning | $612 earned this month across nine interviews, and **$204 is still held for you in escrow.** Tom's $68 releases Thursday, three days after his report went out. |

Chips: *How does the split work?* · *Where do payouts land?* · *What about tax?*

### 3.8 Standing (My stats)

| State | Summary |
|---|---|
| Working | **Follow-up came up to 4.4 in August** and depth has held at 4.7 since May. Nadia Rahman reads the quarter on 1 October. |
| Reviewed | The review widened your range on 1 October, so **you may assess E1 to B2 now.** Follow-up came up to 4.6 over the quarter. |

Chips: *What's actually being scored?* · *What widens my range?* · *Does my rank change my fee?*

### 3.9 Profile

| State | Summary |
|---|---|
| Setup | Your card and fee are written, and **a payout destination is the one thing still stopping a booking.** The agent role sits on the account you already had. |
| Training | Your card and fee are set, and nothing is visible yet: **your public profile goes live the day you're certified.** Delegation is your first specialism. |
| Listed | You've been in browse since Monday at $85, assessing E2 to B1. **No rating yet: the first three interviews are what make one.** |
| Working, Reviewed | You're visible at $85 assessing E2 to B1, with 164 interviews and 4.6 behind you. **Your public profile is how a candidate reads all of that before they book.** |

Chips: the prototype offers only two here (*What can Tal see?* · *Does this affect my candidate account?*) because a second copy of the profile row overwrote the first. Design for **five**, all answered in section 4.7: the two above plus *Can I change my fee?* · *What does pausing do?* · *Why can't I assess above B1?*

## 4. Chat scenarios

Scenarios are grouped by the page whose chips lead to them, but any question can be asked from any page. The prototype matches the chip text exactly; the natural phrasings listed under **User asks** are what the production router should also catch.

### 4.1 Today and the diary

#### A-01 · What is on me today

:: Page: Dashboard
:: User asks: "What's on me today?" · "What do I need to do today?" · "Anything due?" · "What's my day look like?"
:: State: Working
:: Response type: P4 Text + facts + action
:: Status: In prototype (facts block proposed)

> Sofia Marek's report is the one with a clock on it, due at 6:00 PM. Five more evaluations are waiting behind it, and two interviews are still ahead this week: Rafael on Thursday, Amara on Monday, both paid for already.

Facts block: **Due today** · Sofia Marek, report, 6:00 PM · **Next interview** · Rafael Ortiz, Thursday 3:00 PM · **Waiting on you** · 3 requests, 5 evaluations. Action: **Open the report →** to Interviews.

Variation: on Setup the same question answers *Nothing is booked yet, and nothing can be until a payout destination exists. That is the one thing on you today.* with the action **Connect payouts →**. On Training it names the calibration slot with Derek Hale and the one lesson left.

#### A-02 · What is booked

:: Page: Dashboard, Interviews
:: User asks: "What's booked?" · "Show me my upcoming interviews" · "Who am I interviewing this week?" · "When is my next interview?"
:: State: Working
:: Response type: P5 Text + list
:: Status: Proposed

> Five interviews are booked. Rafael Ortiz is first, Thursday at 3:00 PM, and Amara Osei's on Monday is a re-interview, so her 90-day summary is already on the brief.

List: five rows, each with the candidate's disc, name, day and time, and a caption reading *First interview* or *Re-interview*. Each row opens the interview page.

#### A-03 · Who is waiting on me

:: Page: Interviews
:: User asks: "Who's waiting on me?" · "Do I have any requests?" · "What requests are open?"
:: State: Working, requests open
:: Response type: P5 Text + list
:: Status: Proposed

> Three requests are waiting for your answer. Each one holds a slot until you accept or decline, so the sooner you answer the sooner the slot is either yours or back in browse.

List: three rows with the candidate's disc, name, requested slot, and their quote in Tal's pill. Action: **Open Requests →**.

When nothing waits: *Nothing is waiting on you. Every request has been answered, and the next thing that arrives lands on the Requests tab and in your notifications.* (P2)

### 4.2 Scores and standing

#### A-04 · How are my scores moving

:: Page: Dashboard, Standing
:: User asks: "How are my scores moving?" · "How am I doing?" · "What's my rating?" · "Am I improving?"
:: State: Working
:: Response type: P4 Text + facts + action
:: Status: In prototype

> Follow-up is 4.4, up from 4.2 in July. Depth has sat at 4.7 since May. Both are read off your transcripts, not off candidate ratings.

Facts: **Follow-up** · 4.4, was 4.2 · **Depth** · 4.7, unchanged · **Rank** · 12 of 38. Action: **Open Standing →**.

Variation, Reviewed: *Follow-up came up to 4.6 over the quarter and depth held at 4.7. You are 9th of 38 now, and the review widened your range to E1 to B2.*

#### A-05 · What is actually being scored

:: Page: Standing
:: User asks: "What's actually being scored?" · "How is my score calculated?" · "Where do these numbers come from?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> Your half of the conversation: how well you followed up, and how deep you got. I read the transcript for both. The candidate's rating of you is counted separately and does not move these two.

#### A-06 · What widens my range

:: Page: Standing, Profile
:: User asks: "What widens my range?" · "How do I get to assess higher levels?" · "Why can't I assess above B1?"
:: State: Working
:: Response type: P3 Text + facts
:: Status: In prototype (two entries merged)

> Your range is Explorer E2 to Builder B1 today, and a candidate outside it cannot book you at all. The quarterly review is what widens it: last quarter's volume and both scores, read by Nadia on 1 October. Follow-up at 4.5 is the usual bar, and you are at 4.4.

Facts: **Range today** · E2 to B1 · **Next review** · 1 October, Nadia Rahman · **Usual bar** · Follow-up 4.5, you are at 4.4.

#### A-07 · Does my rank change my fee

:: Page: Standing
:: User asks: "Does my rank change my fee?" · "Does ranking affect what I earn?" · "What does rank do?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> No. You set your fee. Rank changes where you sit in browse, which is a different thing, and it is recalculated weekly.

### 4.3 Money

#### A-08 · When does the escrow release

:: Page: Dashboard, Earnings
:: User asks: "When does the escrow release?" · "When do I get paid?" · "Why is $204 held?" · "When does Tom's payment land?"
:: State: Working
:: Response type: P4 Text + facts + action
:: Status: In prototype

> Three working days after a report is delivered. Tom's $68 releases Thursday; Sofia's starts counting the moment you send hers tonight.

Facts: **Rafael Ortiz** · $68, held to the interview · **Sofia Marek** · $68, report due tonight · **Tom Whelan** · $68, releases Thursday. Action: **Open Earnings →**.

#### A-09 · How does the split work

:: Page: Earnings
:: User asks: "How does the split work?" · "How much do I keep?" · "What does TalentNext take?" · "Why do I get $68 from $85?"
:: State: Any
:: Response type: P3 Text + facts
:: Status: In prototype

> The candidate pays $85. TalentNext keeps 20%, which is $17, and $68 comes to you three working days after the report is delivered.

Facts: **The candidate pays** · $85 · **TalentNext keeps** · $17, 20% · **You are paid** · $68, 80%.

Note for design: this is the one place the split is explained to the agent. It never appears on a booking or interview card.

#### A-10 · How much have I earned

:: Page: Earnings, Dashboard
:: User asks: "How much have I earned this month?" · "What have I made?" · "Show me my earnings"
:: State: Working
:: Response type: P4 Text + facts + action
:: Status: Proposed

> $612 this month, across nine interviews. $204 more is held in escrow and releases as each report goes out, so the month closes nearer $816 if you send Sofia's tonight.

Facts: **Earned** · $612 · **Held** · $204 · **Interviews** · 9. Action: **Open Earnings →**.

Before a payout destination: *Nothing yet, and nothing can be booked until a payout destination exists. It is a Stripe hand-off, TalentNext never sees an account number, and it takes a minute.* Action: **Connect payouts →**.

#### A-11 · Where do payouts land

:: Page: Earnings
:: User asks: "Where do payouts land?" · "Which account am I paid into?" · "How do I change my bank?"
:: State: Destination connected
:: Response type: P2 Text
:: Status: In prototype

> Stripe, on the account ending 4417. TalentNext never holds your bank details. Stripe does, and Stripe is where you change them.

#### A-12 · What about tax

:: Page: Earnings
:: User asks: "What about tax?" · "Do you send me a tax form?" · "Where are my statements?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> You are paid as a contractor and the paperwork sits with Stripe. Your statements are there too, not here.

### 4.4 Interviews and the report

#### A-13 · Can I decline a booking

:: Page: Interviews
:: User asks: "Can I decline a booking?" · "What happens if I decline?" · "Can I say no to a request?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> Yes. A request waits on the Interviews page until you answer it. Declining puts the slot back so somebody else can take it; closing the slot on Availability stops it being offered at all.

#### A-14 · What if they do not show

:: Page: Interviews, Interview detail
:: User asks: "What if they don't show?" · "The candidate isn't here" · "How long do I wait?"
:: State: Any
:: Response type: P3 Text + facts
:: Status: In prototype

> Wait fifteen minutes, then mark it. The fee stays with the candidate, the slot comes back to you, and it does not touch your scores.

Facts: **Wait** · 15 minutes · **Fee** · stays with the candidate · **Your scores** · unaffected.

#### A-15 · What do I read beforehand

:: Page: Interviews, Interview detail
:: User asks: "What do I read beforehand?" · "How do I prepare?" · "What's on the brief?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> The brief on the interview page: their quiz result, what they asked to be assessed on, and, for a re-interview, their 90-day summary.

#### A-16 · How is the report written

:: Page: Interview detail
:: User asks: "How is the report written?" · "Do you write the evaluation?" · "Where does the draft come from?"
:: State: Any
:: Response type: P3 Text + facts
:: Status: In prototype

> I draft it off the transcript within the hour, you edit it, and it is yours the moment you sign. The candidate reads what you sent.

Facts: **Draft ready** · within an hour of the call · **Yours to change** · every word of it · **Due** · 24 hours from the end.

#### A-17 · How long do I have

:: Page: Interview detail
:: User asks: "How long do I have?" · "When is the report due?" · "What's the deadline?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> Twenty-four hours from the end of the call. It is the one promise made to the candidate before they pay.

With a report owed: *Sofia's is due at 6:00 PM today, twenty-four hours from the end of the call. The draft is waiting for your edit.* Action: **Open the report →**. (P4)

#### A-18 · Can I change a level afterwards

:: Page: Interview detail
:: User asks: "Can I change a level afterwards?" · "I signed the wrong level" · "Can I edit a sent report?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> Not once you have signed. The interview is what sets it; a change after that is a review decision and sits above you.

#### A-19 · How do I join the call

:: Page: Interview detail, Dashboard
:: User asks: "How do I join the call?" · "Where's the link?" · "Why is Join greyed out?"
:: State: Upcoming interview
:: Response type: P2 Text
:: Status: Proposed

> Join lights up on the interview card in the final minute before 3:00 PM and stays live once the call is open. Until then it is disabled on purpose, so the button you see is the right one, just early.

#### A-20 · Summarise this interview

:: Page: Transcript
:: User asks: "Summarise this interview" · "What did they say about delegation?" · "Where did the follow-up land?"
:: State: Transcript open
:: Response type: P3 Text + facts
:: Status: Proposed

> Sofia spent the first ten minutes on a project she inherited mid-way and only reached her own decisions when you pressed on the hand-over. The strongest stretch is minute 22 to 31, and that is where the draft's evidence comes from.

Facts: **Strongest stretch** · 22:00 to 31:00 · **Follow-up read** · 4.5 · **Depth read** · 4.7. Action: **Open the draft →**.

### 4.5 Training and calibration

#### A-21 · What is calibration

:: Page: Training
:: User asks: "What is calibration?" · "What happens on Thursday?" · "What does Derek look for?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> A 45-minute mock, recorded, with Derek watching how you follow up. He is looking for tenacity, energy, and whether you notice what a candidate did not say.

#### A-22 · Can I fail it

:: Page: Training
:: User asks: "Can I fail it?" · "What if calibration goes badly?" · "Is it pass or fail?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> You can be asked to sit it again; about one in six are. Nothing else about your application is reopened by it.

#### A-23 · Does training come back

:: Page: Training
:: User asks: "Does training come back?" · "Do I have to redo the lessons?" · "When is my next recheck?"
:: State: Certified
:: Response type: P2 Text
:: Status: In prototype

> Once a year the method is re-checked, and it is two lessons rather than four. Yours is due next June.

### 4.6 Availability

#### A-24 · How far ahead can I open

:: Page: Availability
:: User asks: "How far ahead can I open?" · "Can I add slots for next month?" · "How many weeks ahead?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> Eight weeks. Candidates browse by the next free slot, so an agent with nothing in the next fortnight drops down the list.

#### A-25 · Can I take a slot back

:: Page: Availability
:: User asks: "Can I take a slot back?" · "How do I remove a slot?" · "Can I cancel an interview?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> Until it is booked, yes. After that it is a cancellation: the candidate is refunded in full and it shows on your record for ninety days.

#### A-26 · What is open this week

:: Page: Availability
:: User asks: "What's open this week?" · "Which slots are free?" · "When am I free?"
:: State: Any
:: Response type: P5 Text + list
:: Status: Proposed

> Twenty-two slots are open in the weeks ahead and five are taken. Today at 3:00 PM is the first one nobody has claimed.

List: the next five open slots as rows (weekday, time), each opening the day view. Action: **Open the calendar →**.

### 4.7 Profile and account

#### A-27 · What can Tal see

:: Page: Profile
:: User asks: "What can Tal see?" · "What do you have access to?" · "Do you read my messages?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype (copy corrected)

> Your transcripts and your briefs, your scores and your earnings, and nothing outside this portal. I never see a candidate's private profile, another agent's figures, or your bank details, which stay with Stripe.

#### A-28 · Does this affect my candidate account

:: Page: Profile
:: User asks: "Does this affect my candidate account?" · "Is this the same login?" · "Do I have two accounts?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype

> No. The agent role was added to the account you already had. Same login, same details, and nothing on the other side changed.

#### A-29 · Can I change my fee

:: Page: Profile, Earnings
:: User asks: "Can I change my fee?" · "How do I raise my price?" · "What happens to booked interviews if I change my fee?"
:: State: Any
:: Response type: P3 Text + facts
:: Status: In prototype (unreachable today, see section 6)

> Yes, and it applies to new bookings only. Anything already in escrow settles at the rate it was booked at, including Thursday's. The Interview fee field is in General details on your profile.

Facts: **Fee today** · $85 · **You keep** · $68 · **Applies to** · new bookings only.

#### A-30 · What does pausing do

:: Page: Profile
:: User asks: "What does pausing do?" · "Can I take a break?" · "How do I go invisible for a while?"
:: State: Any
:: Response type: P2 Text
:: Status: In prototype (unreachable today, see section 6)

> It takes you out of browse. Interviews already booked still stand, and your public profile comes back exactly as it was. Nothing is re-approved.

#### A-31 · How do candidates see me

:: Page: Profile
:: User asks: "How do candidates see me?" · "What's on my public profile?" · "What does my card show?"
:: State: Working
:: Response type: P3 Text + facts
:: Status: Proposed

> They see your card in browse: your photo, $85, Explorer E2 to Builder B1, a 4.6 from 164 interviews, and your specialities. Your About paragraph is what they read before they book, so it is the sentence worth a minute.

Facts: **Fee** · $85 · **Range** · E2 to B1 · **Rating** · 4.6 from 164. Action: **Open Public Profile →**.

## 5. Refusals and fallbacks

#### A-32 · Outside Tal's four subjects (P6)

:: Page: Any
:: User asks: Anything not about the profile, the interviews, the scores or the money: "What's the weather?" · "Tell me about Sofia's employer" · "How is the candidate portal doing?" · a typo of a chip
:: Response type: P6 Refusal
:: Status: In prototype (chips re-offer proposed)

> **I do not have that one**
> I can read your public profile, your interviews, your scores and the money. Ask me about one of those and I will answer off the pages you are looking at.

Design: after the refusal the page's three chips are re-offered under the bubble, so the agent is never left with an empty field and no suggestions. The prototype hides the chips after the first question and does not bring them back; that is the gap.

#### A-33 · A candidate's private data

:: Page: Any
:: User asks: "What's Sofia's email?" · "Where does Rafael work?" · "Show me Amara's other interviews"
:: Response type: P6 Refusal
:: Status: Proposed

> I only see what the candidate put on their brief for you: their quiz result, what they asked to be assessed on, and for a re-interview their 90-day summary. Anything beyond that is theirs, and it is not mine to read.

#### A-34 · Another agent's figures

:: Page: Standing
:: User asks: "Who is ranked first?" · "What does the top agent charge?" · "Show me other agents' scores"
:: Response type: P6 Refusal
:: Status: Proposed

> I read your figures, not another agent's. Your rank, 12 of 38, is the one comparison the platform makes, and it is recalculated weekly.

#### A-35 · Asking Tal to act

:: Page: Any
:: User asks: "Accept Nadia's request" · "Cancel Thursday" · "Change my fee to $95"
:: Response type: P4 Text + action
:: Status: Proposed

> That one is yours to press, not mine. Nadia's request is on the Requests tab with Accept and Decline side by side, and it holds her slot until you answer.

Action: **Open Requests →**. Tal never takes an action on the agent's behalf; every reply that touches an action routes to the control instead.

## 6. State variation at a glance

| Dimension | What Tal changes |
|---|---|
| Stage: Setup → Training → Working → Reviewed | Dashboard, Training, Earnings, Standing and Profile summaries each have a sentence per stage (section 3). The band's right column moves from the journey stepper to the earnings block. The plate under the dashboard band changes from Write your profile, to the calibration card, to the next-interview card |
| Requests waiting vs answered | The Interviews sentence flips and re-types. Accepting moves the Availability counts (22 open, 5 taken becomes 21 and 6) and the accepted person's detail summary reads "confirmed and in your diary" |
| Report owed | The band is replaced by the Evaluation by Tal card; the ladder shows Tal recommends; the app-bar notification names the due time |
| Payout destination missing | Earnings has no band and its chat answers route to Connect payouts |
| Interview today, minute before | Only the card's Join button changes state; Tal's copy names the time and does not add urgency of its own |
| Everything answered, nothing due | Summaries drop the clock sentence and lead with the next booking; the chat's "what's on me" answers *Nothing is due today* |

## 7. Gaps found while reading the prototype

These are recorded so the design pass covers them and the build knows what to change.

- **Exact-match routing.** The chat answers only the chip text typed verbatim. A question one character off receives the refusal. Every scenario above lists natural phrasings the router should catch.
- **Profile chips are overwritten.** The profile page declares its chips twice and only the second set shows, so three written answers (fee, pausing, range) are unreachable. Section 4.7 lists all five.
- **Two summaries can never display.** The report-owed interview summary and the no-destination Earnings summary are written but their pages drop the band. Their content is folded into the Evaluation card and the empty state, which is the right call; the copy can be deleted.
- **The refusal does not re-offer chips.** After any question the chip row is gone for the rest of the conversation.
- **Earnings claims $612 on the Training stage**, where nothing has been earned yet. The Training stage should read the Listed sentence.
- **Chat answers are static.** All 22 answers carry the Working-stage figures whatever the stage; the Reviewed variations in section 4 are proposed.
- **No highlight in summaries.** The candidate portal marks one actionable phrase per summary in the accent; the agent portal ships none. The bold phrases in section 3 are the recommended marks.
- **Transcript has no chips of its own** and borrows the dashboard's. Section 3.5 proposes three.
