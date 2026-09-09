# Tal scenarios — Cohort Leader portal
Design coverage for every response Tal gives to a signed-in Cohort Leader.
Source of truth: the hi-fi portal, `hifi/build/lead.js` to `lead4.js` with the shared Tal passes (ai4, ai6, ai8), read on 8 Sep 2026. Every leader question was traced through the live router to record what it lands on today.
Prepared for the Tal response design pass. Companion documents cover the Candidate, Talent Agent and Super Admin portals.

## 1. How to read this document

**Who the user is.** The signed-in leader in the prototype is Priya Nair, assessing range Explorer E1 to E3, leading since March 2024. She leads three Explorer cohorts at three points in the 90 days:

| Cohort | Level and course | Where it is | Members | Next call |
|---|---|---|---|---|
| Cohort 41 | E3 · Business Fundamentals | Week 5, day 34 | 10 | Today, 6:00 PM |
| Cohort 33 | E1 · Business Essentials | Week 11, day 76 | 8 | Tomorrow, 5:00 PM |
| Cohort 47 | E2 · Business and Productivity Tools | Week 1, day 4 | 10 | Monday, 6:00 PM |

Twenty-eight candidates in all. Three are flagged: Yuki Tanaka (severe, inactive 12 days, 9% at day 34), Chloe Ferreira (moderate, behind pace, 28% against 38% expected) and James Whitby (moderate, struggling, 2.4 attempts against a 65% assessment average). Two 90-day summaries are waiting on Priya's signature in Cohort 33, Owen Clarke's and Lena Fischer's. The leader is a volunteer: no money appears anywhere in this portal, and a leader interviews nobody.

**The one thing to know before designing.** The leader shares the candidate's renderer, and Tal's page summaries, chips, dock, chat page and voice recorder all exist for the leader today. **The leader chat router is now built too** (8 Sep 2026, `lead5.js`): a `S.portal==='leader'`-gated route table that intercepts before the candidate routes and answers L-01…L-24 with leader widgets (brief, attention list, cohort table, evaluations, drafts), deferring only the refusals to the shared chain (which already handles them). So section 4's cards are **In prototype** now; the "Today:" lines record what each landed on *before* the router and are kept as the record of the gap that was closed. What is NOT built: the live "did-bar" draft insertion into the field (L-11/L-19 open the Messages/summary destination instead), and the leader's own call room.

**Each scenario is a card** with the same fields:

| Field | Meaning |
|---|---|
| Page | Where the leader is when they ask |
| User asks | The natural phrasings that should reach this answer. The first is a chip the page offers where one exists |
| State | The cohort or queue state that produces this exact answer |
| Response type | One of the patterns below. This field tells the designer whether there is a visual |
| Status | **In prototype** means it exists today. **Proposed** means the response is written here for design and build. **Today** records what the same question lands on right now, where that matters |

**Response patterns.** The leader inherits the candidate's widget vocabulary; the shapes below are the ones a leader needs.

| Pattern | Shape | Used for |
|---|---|---|
| **L1 Summary band** | "Summary by Tal" at the head of a page: one paragraph typed in, full width, no second column | Every leader page except Messages and the 90-day summary |
| **L2 Prose answer** | One paragraph with one highlighted phrase and two follow-up chips | Short facts, refusals |
| **L3 Facts widget** | A titled card with a glyph, key/value rows, a kicker and one action button | Cohort figures, the queue count, call logistics |
| **L4 People list** | A card whose rows are candidates: 36px disc, name, a flag tag, one detail line, each row opening the member page | Who needs attention, who has stopped, who is behind |
| **L5 Cohort table** | A card with one row per cohort: name, week, average against pace, flagged count | Comparing cohorts |
| **L6 Brief** | The week brief: a Tal card, four numbered steps, a facts tile, a private-names list. Exists today as a sheet | Preparing a call |
| **L7 Draft offer** | A card offering to write a check-in or a summary paragraph with one button; accepting puts an editable draft in the real field with a "did" bar and Undo | Messages to candidates, the 90-day recommendation |
| **L8 Support hand-off** | The support desk card appended after Tal states the rule | Anything Tal cannot decide |
| **L9 Chat surfaces** | The opening hero, the thinking dots, the voice recorder | Every conversation |

**What Tal reads for the leader.** The cohorts and where each person is, the sessions, the evaluations and the reports. Tal does not read a candidate's written answers, the one-to-one message threads, anything said on a call, or any money. Tal never writes the 90-day recommendation: *the recommendation is the part only you can write.*

## 2. Where Tal appears

### 2.1 The Summary by Tal band (L1)

At the head of every leader page except two. Label **Summary by Tal** beside Tal's mark, then one paragraph in the page's ink. Always full width: no leader page puts a plate in the band, so the two-column layout never fires here.

**States to design**

- **Typing.** The paragraph types in with a thin caret over 2 to 3.4 seconds; a ghost copy holds the height. It re-types on every arrival, which for the leader includes opening a different candidate, switching a Reports cohort tab, or publishing a summary, because the text changes. Instant under reduced motion.
- **Counts that move.** Publishing a summary changes three pages' sentences (Dashboard, Evaluations, the black card). The band must be comfortable one word shorter or longer.
- **Absent.** Messages has no band (the page ends in its own composer) and the single 90-day summary page has none (Tal does not speak over the leader's own writing). Their summaries are authored but unreachable and are recorded in section 3 for the record.

### 2.2 The Ask Tal dock (L9)

The same floating bar as the candidate's: the comet border, Tal's mark, **Ask Tal anything**, one rotating suggested question in grey quotes every three seconds, a microphone when the browser supports speech, a disabled send arrow. Not shown on Messages, nor on a cohort's Discussion tab when the board has its own composer (Cohort 41 today; Cohorts 33 and 47 show an empty board and keep the dock).

### 2.3 The chat page (L9)

- **Back label.** **Back to** Dashboard, Upcoming Sessions, Evaluations, Cohorts, Course reports, Messages, Certifications, Your profile, a cohort, a candidate, or a 90-day summary.
- **Opening state.** The orb. Heading **Hey, Priya!** and, in gradient ink, **What do you need?** Line: *I can read your cohorts, your evaluations and where people are stuck.* Below it the page's chips, then the field with placeholder **What can I help you with?**
- **Thinking.** Three pulsing dots for 1.4 seconds before every answer.
- **Bubbles.** **You** with Priya's photo, **Tal** with the small mark. Only the newest Tal answer keeps its follow-up chips.
- **Voice.** The full recorder from the candidate portal: recording with a live waveform, Transcribing…, stop to edit, send, cancel; an empty take substitutes one of the page's suggested questions.

### 2.4 Tal on a page

| Surface | Page | What to design |
|---|---|---|
| **The week brief** (L6) | Cohort page and Upcoming Sessions, opened by **Generate the brief** on the black call card | A sheet titled **Week 5 brief**. Inside: a Tal card labelled **Tal** with the heading **Run the call like this** and one sentence; four numbered steps with a bold lead each; a facts tile of four rows; when anyone is flagged, **Bring these 3 up privately** with a row per person (disc, name, flag tag, detail line); a helper line; footer **Close** and **Print for the call**. Full copy in 3.12 |
| **Notifications** | The bell | Not Tal, but the same register: *Owen Clarke is waiting on his 90-day summary. Cohort 33 closes next week. Nothing goes to his next agent until you publish it.* |
| **The 90-day summary form** | The summary page | No Tal card. An inline note when the leader recommends anything other than a promotion with no reason: **This one needs a reason.** *Anything other than a promotion is you saying the 90 days did not do what they were meant to. Say why, and it goes on the summary.* |

Nothing else on a leader page speaks as Tal. The candidate's Tal star, scene ask and chapter help do not appear here. The retired side panel is still emitted and hidden; do not design for it.

### 2.5 During a call

While the cohort call is open the whole shell is replaced by the call screen: no band, no dock, no Tal. Join goes live five minutes before the hour in the code; the design rule says one minute. The call room today is the candidate's room and names Maryam as "you"; the leader's room is its own piece of work.

## 3. Page summaries — Summary by Tal

Bold marks the recommended highlight (the leader's summaries ship with none today). Chips are the page's suggested questions.

### 3.1 Dashboard

Chips: *Brief me for Thursday's call* · *Who should I worry about this week?* · *What is waiting on my signature?*

| State | Summary |
|---|---|
| Two pending | **Two 90-day summaries are waiting on your signature**, and nothing reaches those candidates' next agent until you publish. Three candidates need a look, one of them seriously. |
| One pending | One 90-day summary is waiting on your signature, and nothing reaches that candidate's next agent until you publish. Three candidates need a look, one of them seriously. |
| None pending | Nothing is waiting on your signature. **Three candidates need a look**, one of them seriously, and Cohort 41 meets today at 6:00 PM. |

Design note: the prototype's zero state reads "No 90-day summaries are waiting on your signature, and nothing reaches those candidates' next agent"; the corrected copy above leads with the queue instead.

### 3.2 Upcoming Sessions

Chips: *Brief me for tonight's call* · *Who missed the last one?*

> Three calls this week, **Cohort 41 first at 6:00 PM today**. Across the four cohorts behind you, 32 of 36 seats were filled, and the brief reads from where each cohort actually is.

First cohort ever: *Your first cohort call is this week.* replaces the second sentence. This is the only place attendance appears in the product.

### 3.3 Evaluations

Chips: *Is Owen Clarke ready to be promoted?* · *What should the summary say?*

| State | Summary |
|---|---|
| Two pending | **Two of Cohort 33's eight 90-day summaries are still waiting on you.** Owen Clarke's numbers are the argument; the recommendation is the part only you can write. |
| One pending | **One of Cohort 33's eight 90-day summaries is still waiting on you.** Lena Fischer's numbers are the argument; the recommendation is the part only you can write. |
| None | Nothing is waiting on your signature. **Every 90-day summary is published.** |

### 3.4 One 90-day summary

No band on this page. Chips (the dock is present): *Are they ready to be promoted?* · *What should I write here?* The authored, unreached copy for the record: *Owen Clarke finished the 90 days at 92% with 87% on assessments and 12 of 13 chapters. The recommendation is the part only you can write.* · Published: *Published. You recommended: Ready to promote.*

### 3.5 Cohorts

Chips: *Where is Cohort 41 stuck?* · *Which cohort needs me most?*

> **Cohort 33 is one point behind pace**, the widest gap of the three. 3 of the 28 candidates are flagged, and every cohort has its call this week.

Design note: the prototype prints "1 points behind" and would print "0 points behind" or "-1 points behind" when the gap closes or reverses. The sentence needs three forms: *N points behind pace*, *on pace*, *N points ahead of pace*, with "one" spelt.

### 3.6 One cohort

Chips: *Where is this cohort stuck?* · *Brief me for this call* · *Who here needs me most?*

| Cohort | Summary |
|---|---|
| Cohort 41 | Averaging 39% against 38% expected, one point ahead, with assessments at 70%. **One candidate is at risk.** |
| Cohort 33 | Averaging 83% against 84% expected, one point behind, with assessments at 80%. Nobody is at risk this week. |
| Cohort 47 | Averaging 6% against 4% expected, two points ahead. **Nothing is assessed yet**, and nobody is at risk this week. |

Design note: the prototype gives Cohort 47 an assessment average of 26% by counting members with no assessment as zero, while the page's own stat cell says "not yet". The corrected copy above says what the page says.

### 3.7 One candidate

Chips: *What should I say to them?* · *Is this recoverable?* · *Draft a check-in*

Six readings, first match wins:

| Reading | Summary |
|---|---|
| Never signed in | Yuki has never signed in: no chapter opened, no assessment, no time on the course at all. **Act on this before any of the behind-pace names**; a cohort place is being held open. |
| Stopped (idle 7+ days) | **Yuki stopped 12 days ago at 9%**, 1 of 13 chapters, then nothing. Worth a direct message rather than a mention on the call; people who stop mid-course rarely restart unasked. |
| Trying, not absorbing | **James is trying, not absorbing**: 2.4 attempts on average against a 65% assessment score. The material is landing badly rather than the effort being missing. This is the pattern that gets worse if you push harder. |
| Well behind (15+ points) | Chloe is well behind pace at 20% against 38% expected on day 34. Assessments hold up at 77%, so **this is time rather than comprehension**; worth direct outreach before the next call. |
| Behind (5 to 14 points) | **Chloe is 10 points behind pace**, 28% against 38% expected, with assessments at 77%. A gap this size usually recovers on its own; worth watching rather than intervening. |
| Fine | Nothing alarming in Maryam's numbers: 46% against 38% expected, assessments at 84%, 6 of 13 chapters. A second pass on some, which at this score is thoroughness. · Or: First-time passes on almost everything. |

### 3.8 Course reports

Chips: *Who has stopped in the last week?* · *Which chapter is losing people?*

| Cohort tab | Summary |
|---|---|
| Cohort 41 | **Three of the 10 in Cohort 41 are five points or more behind pace.** Yuki Tanaka is furthest back at 9%. |
| Cohort 33 | None of the 8 in Cohort 33 is more than five points behind pace. |
| Cohort 47 | None of the 10 in Cohort 47 is more than five points behind pace. |

With never-signed-in members the sentence appends *, and one has never signed in*.

### 3.9 Messages

No band (own composer) and no dock. Chips reachable only from an answer: *Draft a check-in to Yuki Tanaka* · *What came up on the board this week?* Authored, unreached copy: *One direct thread is waiting on a reply, out of three you have open. Everything here is private to you and the candidate.*

### 3.10 Certifications

Chips: *What do I need for the next certification?*

> Three earned and one in progress, off eight cohorts led. **Candidate Mentoring is the open one**, and it opens the Builder band.

Design note: the prototype still says "and 62 interviews run"; a leader interviews nobody since the 1 Sep decision, so the clause is dropped above.

### 3.11 Your profile

Chips: *How is my standing calculated?*

> Your listing is what candidates read when they choose you. **The bio is yours to write**; the assessing range comes from your certifications. The rest is the account behind it.

### 3.12 The week brief (L6), Cohort 41

**Tal card.** Label **Tal**, heading **Run the call like this**, sentence: *Cohort 41 is on pace at week 5 of 13, and this is drawn from where they actually are rather than from the syllabus.* (Cohort 33: *is one point behind at week 11 of 13*.)

**Four steps.**

1. **Open on Hard Conversations.** It is this week's chapter and the one carrying the cohort's lowest scores. James is at 65%. (Cohort 33: Conflict and Repair, Zoe at 66%. Cohort 47: Why We Exist, Ines at 75%.)
2. **Skip what is already landing.** Anything with near-universal completion and scores above 85% does not need the hour. 78% is the cohort's assessment average. (Cohort 47: nothing is assessed yet.)
3. **Ask for a real example, not a hypothetical.** 3 of 10 are behind pace, which is usually time rather than comprehension. A concrete example from their own week gets further than more material.
4. **Raise the one at risk privately.** Never in the group. Yuki Tanaka. (No severe flag: **Raise nothing privately this week.** Nobody in this cohort is flagged severely.)

**Facts tile.** Average progress 39% · Expected by now 38% · Assessment average 78% · Behind pace 3 of 10.

**Bring these 3 up privately.** Yuki Tanaka, Inactive 12 days, *9% at day 34 · last active 12d ago* · Chloe Ferreira, Behind pace, *28% at day 34 · last active 5d ago* · James Whitby, Struggling, *31% at day 34 · last active today*.

**Helper.** *Everything above is computed from course activity: progress, scores, attempts and timing. Nothing in it reads their written answers, so it cannot tell you how well they are thinking.*

Footer **Close** · **Print for the call**.

## 4. Chat scenarios

Grouped by subject. Where a chip exists it is the first phrasing. **Today** records what the question currently lands on, so build knows the gap.

### 4.1 Preparing a call

#### L-01 · Brief me for the call

:: Page: Dashboard, Upcoming Sessions, Cohort
:: User asks: "Brief me for Thursday's call" · "Brief me for tonight's call" · "Brief me for this call" · "What should I cover tonight?" · "Prepare me for Cohort 33"
:: State: A call this week
:: Response type: L6 Brief, in the bubble, with a button
:: Status: Proposed. Today: the candidate's "Your next call is Thursday" card about Maryam's cohort

> Cohort 41 meets at 6:00 PM today, week 5 of 13, on pace at 39% against 38% expected. Open on Hard Conversations, this week's chapter and the one carrying the lowest scores; James is at 65%. Skip what is already landing above 85%. Ask for a real example rather than a hypothetical, because three of the ten are behind on time, not comprehension. Raise Yuki privately, never in the group.

Widget: the four steps as a numbered list, then rows **Average progress** · 39% · **Expected** · 38% · **Assessments** · 78% · **Behind pace** · 3 of 10. Button **Open the full brief** (the sheet, printable). Chips: *Who should I raise privately?* · *Which chapter is losing people?*

With no call named, Tal takes the next call in the diary and says which: *Your next call is Cohort 41 at 6:00 PM today.*

#### L-02 · When is my next call

:: Page: Dashboard, Upcoming Sessions
:: User asks: "When is my next call?" · "What's on this week?" · "Show my sessions" · "How many calls this week?"
:: State: Any
:: Response type: L3 Facts widget with a button
:: Status: Proposed. Today: the candidate's Thursday card

> Three calls this week. Cohort 41 is first, at 6:00 PM today. Each is 60 minutes, and the brief for each reads from where that cohort actually is.

Rows: **Cohort 41** · Today, 6:00 PM · week 5 · **Cohort 33** · Tomorrow, 5:00 PM · week 11 · **Cohort 47** · Monday, 6:00 PM · week 1. Button **Open Upcoming Sessions**.

#### L-03 · Who missed the last one

:: Page: Upcoming Sessions
:: User asks: "Who missed the last one?" · "Who wasn't on last week's call?" · "What was attendance?"
:: State: A cohort with a past call
:: Response type: L4 People list with a button
:: Status: Proposed. Today: the support card

> Nine of ten were on Cohort 41's week 4 call. Yuki Tanaka missed it, and has not opened a chapter since, so the two are the same absence. Across the four cohorts you have finished, 32 of 36 seats were filled.

Rows: the absentees, each with disc, name, flag and *last active 12d ago*. Button **Open Cohort 41**. Chips: *Draft a check-in to Yuki Tanaka* · *Who should I worry about this week?*

Nothing missed: *Everyone was on Cohort 41's week 4 call. That is the fourth full house in a row.*

#### L-04 · Can I move the call

:: Page: Upcoming Sessions
:: User asks: "Can I reschedule the call?" · "Move Thursday to Friday" · "Cancel tonight's session"
:: State: Any
:: Response type: L2 Prose with chips
:: Status: Proposed. Today: the candidate's Thursday card

> You can, from the session card, and the ten are told the moment you save it. The call is the one fixed hour in their week, so a move inside 24 hours costs attendance; if tonight cannot happen, post to the board first and move it after.

Chips: *Brief me for tonight's call* · *Who missed the last one?*

### 4.2 Who needs attention

#### L-05 · Who should I worry about this week

:: Page: Dashboard, Cohort
:: User asks: "Who should I worry about this week?" · "Who here needs me most?" · "Which candidates are at risk?" · "Show me the attention queue" · "Who is inactive?"
:: State: Three flagged
:: Response type: L4 People list with a button
:: Status: Proposed. Today: a quote from Maryam's interview transcript, because the word "week" matches a candidate route

> Three need a look, one seriously. Yuki Tanaka stopped 12 days ago at 9% and is the one to message today. Chloe Ferreira is 10 points behind with assessments holding at 77%, which usually recovers on its own. James Whitby is passing on the second and third attempt, so the material is landing badly rather than the effort being missing.

Rows: **Yuki Tanaka** · Inactive 12 days · *9% at day 34, Cohort 41* · **Chloe Ferreira** · Behind pace · *28% against 38%, Cohort 41* · **James Whitby** · Struggling · *2.4 attempts, 65% average, Cohort 41*. Button **Open the attention queue**. Chips: *Draft a check-in to Yuki Tanaka* · *Is James recoverable?*

Nobody flagged: *Nobody needs a look this week. All 28 are within five points of pace and everyone has been in since Monday.*

#### L-06 · Who has stopped in the last week

:: Page: Course reports
:: User asks: "Who has stopped in the last week?" · "Who has not signed in?" · "Who is idle?"
:: State: Any
:: Response type: L4 People list
:: Status: Proposed. Today: the transcript quote

> One person has gone quiet: Yuki Tanaka, last active 12 days ago, one chapter in. Nobody else has been away more than five days. Nobody in your three cohorts has never signed in.

Rows: Yuki with the detail line *last active 12d ago · 1 of 13 chapters*. Button **Open Course reports**.

#### L-07 · Who is behind pace

:: Page: Cohorts, Course reports
:: User asks: "Who is behind pace?" · "Is Cohort 47 on track?" · "How many are behind?"
:: State: Any
:: Response type: L4 People list with a button
:: Status: Proposed. Today: "That is a candidate question" refusal, because "pace" matches a candidate route

> Three of the 28 are five points or more behind pace, all in Cohort 41. Yuki Tanaka is furthest back at 9% against 38% expected. Cohort 47 is on track: two points ahead at week 1, and nothing is assessed yet.

Rows: Yuki 9% · Chloe 28% · James 31%, each against 38% expected. Button **Open Course reports**.

#### L-08 · Tell me about a candidate

:: Page: Any
:: User asks: "Who is Yuki Tanaka?" · "Tell me about James Whitby" · "What is Chloe's progress?" · "How is Maryam doing?"
:: State: Any
:: Response type: L3 Facts widget with a button
:: Status: Proposed. Today: the support card

> James is trying, not absorbing: 2.4 attempts on average against a 65% assessment score, 31% through at day 34 against 38% expected, last active today. The material is landing badly rather than the effort being missing, and this is the pattern that gets worse if you push harder.

Rows: **Progress** · 31% against 38% · **Assessments** · 65%, 2.4 attempts · **Chapters** · 4 of 13 · **Last active** · today. Button **Open James Whitby**. Chips: *What should I say to him?* · *Is this recoverable?*

The paragraph is the same six-way reading as the candidate page summary in 3.7, so the answer in the chat and the band on the page never disagree.

#### L-09 · Is this recoverable

:: Page: One candidate
:: User asks: "Is this recoverable?" · "Can Yuki still finish?" · "Is it too late for Chloe?"
:: State: A flagged candidate open
:: Response type: L2 Prose with chips
:: Status: Proposed. Today: the support card

> For Yuki, yes, but only with a message today. 56 days remain and twelve chapters are about 12 hours of work, so the time is there; what is missing is a reason to come back, and people who stop mid-course rarely restart unasked. If there is no reply in a week, that is the point to talk to support about a transfer to a later cohort.

Chloe: *Yes, and probably on her own. A ten-point gap with assessments at 77% is time, not comprehension, and gaps that size close by week 8 more often than not.* James: *Yes, but not by pushing. Two or three attempts a chapter means the material needs a different route in; ten minutes on the call working his own example is worth more than another reminder.*

Chips: *Draft a check-in* · *What should I say to them?*

#### L-10 · What should I say to them

:: Page: One candidate
:: User asks: "What should I say to them?" · "How do I approach Yuki?" · "What do I say to James on the call?"
:: State: A candidate open
:: Response type: L2 Prose with chips, leading to L7
:: Status: Proposed. Today: the support card

> Ask, do not chase. Yuki stopped after chapter 1, so the useful question is what happened after it, not why the next twelve are not done. One line, direct thread, no mention of the numbers; she can see them herself. I can draft it and you change every word before it goes.

Chips: *Draft a check-in to Yuki Tanaka* · *Is this recoverable?*

#### L-11 · Draft a check-in

:: Page: One candidate, Messages
:: User asks: "Draft a check-in to Yuki Tanaka" · "Draft a check-in" · "Write a message to Chloe" · "Help me word a reply"
:: State: A candidate named or open
:: Response type: L7 Draft offer, then the draft block in the Messages composer
:: Status: Proposed. Today: the candidate's "reply to Priya" flow, which drops the leader into the candidate's Messages page

> Source **Drawn from Yuki's course record**. I can put a check-in in your Messages field for Yuki. It asks what happened after chapter 1 rather than why the rest is not done, and it does not quote the numbers at her. You change every word before it goes.

Button **Draft the check-in →**. On Messages the did bar reads **Tal drafted a check-in to Yuki Tanaka** with **Undo**, and the draft block holds: *Hi Yuki. You finished chapter 1 and then it went quiet, and I would rather ask than guess. Did something get in the way after it? There is time to catch up and I would like you on Thursday's call. Reply here whenever you can.* with **Use this** · **Try again** · **Discard** and the note *Nothing is sent until you send it.*

James's draft: *Hi James. I can see you are putting the work in on chapter 4, and I would like to spend ten minutes of Thursday's call on your own example rather than the reading. Bring the one that went wrong. That is where the chapter lives.*

### 4.3 Cohorts

#### L-12 · How are my cohorts doing

:: Page: Dashboard, Cohorts
:: User asks: "How are my cohorts doing?" · "Which cohort needs me most?" · "Compare my cohorts" · "Summarise Cohort 33"
:: State: Three cohorts
:: Response type: L5 Cohort table with a button
:: Status: Proposed. Today: the candidate's Thursday card

> All three are within two points of pace. Cohort 41 needs you most: one point ahead, but it holds all three flagged names, and its call is tonight. Cohort 33 is one point behind at week 11 with two summaries waiting. Cohort 47 is a week old and ahead.

Rows: **Cohort 41** · week 5 · 39% against 38% · 3 flagged · **Cohort 33** · week 11 · 83% against 84% · 0 flagged · **Cohort 47** · week 1 · 6% against 4% · 0 flagged. Button **Open Cohorts**.

#### L-13 · Where is this cohort stuck

:: Page: One cohort, Cohorts
:: User asks: "Where is Cohort 41 stuck?" · "Where is this cohort stuck?" · "Which chapter is losing people?" · "Which chapter has the lowest scores?"
:: State: A cohort with assessments
:: Response type: L3 Facts widget with a button
:: Status: Proposed. Today: the candidate's chapter 4 explainer and progress bar

> Chapter 4, Delegation Without Drop-Off. It carries Cohort 41's lowest assessment average at 62%, three of the ten have opened it more than three times without finishing, and it is this week's chapter for nobody, so it is the one dragging rather than the one due. Hard Conversations, this week's, is landing fine so far.

Rows: **Chapter 4** · 62% average · 3 stalled · **Chapter 5** · this week · 70% so far · **Cohort average** · 70% assessments. Button **Open Course reports**. Chips: *Brief me for this call* · *Who here needs me most?*

Cohort 47: *Nowhere yet. It is week 1, nothing is assessed, and eight of ten have opened chapter 1. Ines is furthest in at 75% of it.*

#### L-14 · What is the cohort average

:: Page: One cohort
:: User asks: "What is the cohort average?" · "How is Cohort 41 scoring?" · "Show me Cohort 41"
:: State: Any
:: Response type: L3 Facts widget with a button
:: Status: Proposed. Today: the candidate's Thursday card

> Cohort 41 is averaging 39% progress against 38% expected on day 34, with assessments at 70% across those who have sat one. One of the ten is at risk.

Rows: **Progress** · 39% against 38% · **Assessments** · 70% · **Members** · 10 · **Flagged** · 3, 1 severe. Button **Open Cohort 41**.

#### L-15 · What came up on the board this week

:: Page: Cohort, Messages
:: User asks: "What came up on the board this week?" · "Anything on the discussion board?" · "What are they talking about?"
:: State: A cohort with posts
:: Response type: L2 Prose with a button
:: Status: Proposed. Today: the transcript quote

> Four posts on Cohort 41's board this week, three of them on chapter 4. Two people asked the same thing, whether the roleplay counts, and nobody has answered them yet. That is worth a line from you before tonight.

Button **Open the board**. Tal reads the board's posts; it never reads the one-to-one threads.

### 4.4 Evaluations and the 90-day summary

#### L-16 · What is waiting on my signature

:: Page: Dashboard, Evaluations
:: User asks: "What is waiting on my signature?" · "How many summaries are pending?" · "What do I need to sign?"
:: State: Two pending
:: Response type: L4 People list with a button
:: Status: Proposed. Today: the support card

> Two 90-day summaries in Cohort 33: Owen Clarke's and Lena Fischer's. Nothing reaches their next agent, and no level moves, until you publish what you saw. Cohort 33 closes next week.

Rows: **Owen Clarke** · 92% · 87% assessments · 12 of 13 · **Lena Fischer** · her figures. Button **Open Evaluations**. None pending: *Nothing. Every 90-day summary is published.*

#### L-17 · Is Owen Clarke ready to be promoted

:: Page: Evaluations, one summary
:: User asks: "Is Owen Clarke ready to be promoted?" · "Are they ready to be promoted?" · "Should I promote Owen?"
:: State: A summary pending
:: Response type: L3 Facts widget with a button
:: Status: Proposed. Today: "That is a candidate question, a fee is not part of the cohort-leader role", because "promoted" matches a promo-code route

> The numbers say yes: Owen finished at 92% with 87% on assessments and 12 of 13 chapters, first-time passes on ten of them, and he was on every call. What the numbers cannot say is whether the delegation gap he named in August moved, and that is the part only you can write. The recommendation is yours.

Rows: **Progress** · 92% · **Assessments** · 87% · **Chapters** · 12 of 13 · **Calls** · 11 of 11. Button **Open Owen's summary**. Chips: *What should the summary say?* · *What did he say on the calls?*

Tal states the evidence and never recommends a level.

#### L-18 · What should the summary say

:: Page: Evaluations, one summary
:: User asks: "What should the summary say?" · "What should I write here?" · "Help me with the recommendation"
:: State: A summary open
:: Response type: L2 Prose with chips, leading to L7
:: Status: Proposed. Today: the support card

> Three things, in this order: what the 90 days were meant to move for Owen, which was delegation; what you saw move, with one example from a call rather than a score; and your recommendation with its reason. The figures are already on the page, so the paragraph does not need to repeat them. I can draft the first two parts from his record; the third is yours.

Chips: *Draft the evidence paragraph* · *Is Owen Clarke ready to be promoted?*

#### L-19 · Draft the evidence paragraph

:: Page: One summary
:: User asks: "Draft the evidence paragraph" · "Draft Owen's summary" · "Start the write-up for me"
:: State: A summary open
:: Response type: L7 Draft offer, then the draft block in the summary form
:: Status: Proposed

> Source **Drawn from Owen's course record and your call notes**. I can put the evidence half into the summary field: what he came in to work on and what the record shows moved. The recommendation and its reason stay blank for you.

Button **Draft the evidence →**. The draft: *Owen came into Cohort 33 with delegation named as his growth area. Over the 90 days he finished 12 of 13 chapters at 87% on assessments, with first-time passes on ten, and was on all eleven calls. On the week 9 call he brought a hand-over he had let stand for two weeks, which is the thing he could not do in August.* The did bar reads **Tal drafted the evidence for Owen Clarke** with **Undo**. The recommendation field stays empty and the form still asks for a reason on anything but a promotion.

### 4.5 Certifications and standing

#### L-20 · What do I need for the next certification

:: Page: Certifications
:: User asks: "What do I need for the next certification?" · "How do I get certified?" · "What opens the Builder band?"
:: State: One in progress
:: Response type: L3 Facts widget with a button
:: Status: Proposed. Today: "a certification is not part of the cohort-leader role"

> Candidate Mentoring is the open one, and it opens the Builder band. You have three of its four requirements: eight cohorts led, a standing above 4.5, and two published summaries this quarter. The one left is a mentoring log of six sessions, and you have four.

Rows: **Cohorts led** · 8 of 6 ✓ · **Standing** · 4.9 ✓ · **Summaries this quarter** · 2 of 2 ✓ · **Mentoring sessions** · 4 of 6. Button **Open Certifications**.

#### L-21 · How is my standing calculated

:: Page: Your profile
:: User asks: "How is my standing calculated?" · "What is my rating?" · "Where does 4.9 come from?"
:: State: Any
:: Response type: L3 Facts widget with a button
:: Status: Proposed. Today: the support card

> 4.9, from the candidates you have led rating the 90 days after their re-interview, across eight cohorts. It moved up 0.8 over the year. Completion in your cohorts is 84%, which is read separately and does not feed the rating. Neither number changes your assessing range; that comes from your certifications.

Rows: **Standing** · 4.9, up 0.8 · **Cohorts led** · 8 · **Completion** · 84% · **Range** · E1 to E3, from certifications. Button **Open Your profile**.

### 4.6 Tal itself

#### L-22 · What can you help me with

:: Page: Any
:: User asks: "What can you help me with?" · "What do you do?" · "Who are you?"
:: State: Any
:: Response type: L2 Prose with chips
:: Status: In prototype

> I read your side of the product: your cohorts and where each person is, your sessions, your evaluations and the reports. I can tell you who needs attention and why, and draft a note or a brief for you. Nothing I write is sent until you send it.

Chips: *Brief me for Thursday's call* · *Who should I worry about this week?* · *What is waiting on my signature?*

#### L-23 · What can you see

:: Page: Your profile
:: User asks: "What can you see about my candidates?" · "Can you read their answers?" · "Do you read my messages?"
:: State: Any
:: Response type: L3 Facts widget
:: Status: Proposed. Today: the candidate's "What I can and cannot see" card about Maryam

> Rows: **I see** · progress, scores, attempts and timing for every candidate in your cohorts, the board, and your published summaries · **I never** · a candidate's written answers; your one-to-one threads; anything said on a call, which is not recorded; any money, of which there is none here. Kicker: Everything in a brief is computed from course activity, so it can tell you who is stuck and cannot tell you how well they are thinking.

#### L-24 · Am I paid for leading

:: Page: Any
:: User asks: "How much do I get paid?" · "Am I paid for leading?" · "Is there a fee for this?"
:: State: Any
:: Response type: L2 Prose
:: Status: Proposed. Today: "a payment is not part of the cohort-leader role", which is accidentally right

> Leading is a volunteer role, and there is no money anywhere on this side of the product. What it earns is the cohort-leader certifications, and Candidate Mentoring is the one that opens the Builder band.

## 5. Refusals and fallbacks

#### L-25 · A candidate's question in the leader's chat

:: User asks: "Is my card stored?" · "What is the refund window?" · "How do I get to E4?" · "When does my course end?"
:: Response type: L2 Prose with the Dashboard chips
:: Status: In prototype (copy corrected)

> That is a candidate question. A refund is not part of the cohort-leader role, and I cannot see any candidate's money. I can read your cohorts, your sessions and your evaluations.

The named subject follows the question: a card, a charge, a payment, a refund, a fee, a cohort place, a level, an assessment score, a course record, the 90 days, a summary. Two subjects must leave this list: **promotion** (the leader's own question about a candidate, L-17) and **certification** (the leader's own, L-20).

#### L-26 · A candidate's private words

:: User asks: "What did Owen write in his chapter 4 reflection?" · "Show me Yuki's notes" · "What did James say to me in messages?"
:: Response type: L2 Prose
:: Status: Proposed

> I do not read a candidate's written answers or your one-to-one threads. I can tell you Owen finished chapter 4 at 80% on the second attempt; what he wrote in it is his, and yours to open on his page.

#### L-27 · Anything Tal cannot answer

:: User asks: Anything no route recognises
:: Response type: L2 Prose then L8 Support hand-off, then the page's chips
:: Status: In prototype (cohort number corrected)

> I **do not have an answer** for that one, and I would rather say so than guess at it. Anyone on the support desk can pick it up.

Support card: **Ask for** · this question, worded exactly as you asked me; they will have your account open · **Email** · support@talentnext.com · **Phone** · (555) 123-4567 · **Hours** · Mon to Fri, 9:00 AM to 6:00 PM ET. Kicker: *They answer inside one working day. Say you lead Cohorts 41, 33 and 47.* Then *Here is what I can answer from where you are.* and the page's chips.

The prototype's kicker says "Quote your cohort number, Cohort 41" to a leader of three cohorts.

#### L-28 · Off-topic

:: User asks: "Tell me a joke" · "Should I quit my job?" · "What do you think of my manager?"
:: Response type: L2 Prose with chips
:: Status: In prototype (copy made leader-shaped)

> That is outside what I am for. I am the assistant inside your cohorts: the people in them, the calls, the evaluations and the reports. I am not the one to ask about your job or the people in it, and I would rather say so than have an opinion.

Chips: *Who should I worry about this week?* · *What is waiting on my signature?*

## 6. State variation at a glance

| Condition | Where Tal changes | Now / alternate |
|---|---|---|
| Summaries pending (2 → 1 → 0) | Dashboard and Evaluations bands, the black card, L-16 | "Two … are waiting" / "One … is waiting" / "Nothing is waiting"; the band re-types on each publish |
| Cohort at week 1 (Cohort 47) | Cohort band, brief, L-13, L-14 | "Nothing is assessed yet"; brief step 4 reads "Raise nothing privately"; no private-names list |
| Cohort mid-run with flags (Cohort 41) | Dashboard second sentence, brief, L-05 to L-11 | Three named people, one severe |
| Cohort closing (Cohort 33) | Evaluations, summaries, L-16 to L-19 | Owen and Lena pending; brief on Conflict and Repair |
| A candidate's reading | Candidate band and L-08 | Six readings by idle days, attempts, gap; the same paragraph in both places |
| Reports cohort tab | Reports band | "Three of the 10 in Cohort 41…" / "None of the 8 in Cohort 33…" |
| Call open | Everything | No band, no dock, no Tal until the call ends |
| Nobody flagged | Dashboard band, L-05, L-06 | "Nobody needs a look this week" |

## 7. Gaps found while reading the prototype

- ~~**No leader router.**~~ **Built 8 Sep** (`lead5.js`): a `S.portal==='leader'`-gated `LEAD_ROUTES` table wrapping ai8's `talReply` — it answers L-01…L-24 with leader widgets and defers refusals to the shared chain. The three mis-routings below went with it (leader vocabulary now matches a leader route before the candidate route can fire). Verified: all 22 questions land on their leader answer, no `undefined`/`NaN`, candidate portal unaffected.
- ~~**"week" matches a transcript route.**~~ Fixed by the router — "brief me for the call", "who missed" etc. match leader routes first, so no leader question returns Maryam's transcript.
- ~~**"promoted" matches a promo-code route** and "certification" a candidate route~~ — both now hit `wLeadPromote` / `wLeadCert` first.
- **Draft chips** (~~open the candidate's Messages page~~) — L-11 now offers the drafted text and opens the leader's own DM composer via `data-ldrdm`; L-19 opens the summary. The live "did-bar" insertion into the field is the one part not built.
- ~~**The support card quotes Cohort 41**~~ **Fixed 8 Sep** (`supportCohortLine`, ai8): a leader gets "Say you lead Cohorts 41, 33 and 47"; a candidate keeps "Cohort 41".
- ~~**Grammar in live summaries** ("1 points behind", "eight 90-day summary is", the zero-pending sentence)~~ **Fixed 8 Sep** (`ai6.js` leader summaries): zero-pending leads with the queue and names the next call; the possessive agrees; the noun stays plural with only the verb agreeing; the pace line has three forms ("one point behind / on pace / N points ahead") with the number spelt — `leadCohort` and `leadCohorts` both.
- ~~**Cohort 47's assessment average** computed over unassessed members~~ **Fixed 8 Sep**: `leadCohort` and `ldrBriefSheet` now read `lassess` (assessed-only), matching the cohort page's own stat cell — 41 at 78%, 33 at 80%, 47 at 88% (three of ten assessed), and "nothing assessed yet" only when nobody has a score. NB this differs from 3.6's earlier "nothing assessed yet" wording for 47: the page shows 88%, because 3 members are assessed, so the band matches the page.
- ~~**Certifications still says "62 interviews run"**~~ **Fixed 8 Sep** (`leadCerts`, ai6): clause dropped — a leader interviews nobody.
- **Two authored summaries are unreachable** (Messages, one 90-day summary) and the Dashboard's hand-written Tal card is always replaced by the band. They can be deleted. *(Not touched — cleanup, no user impact.)*
- **The call room is the candidate's** and names Maryam as "you". The leader's room is separate work and outside Tal's scope. *(Not touched — out of scope.)*
