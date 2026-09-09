# Tal scenarios — Candidate portal
Design coverage for every response Tal gives to a signed-in candidate.
Source of truth: the hi-fi candidate portal, `hifi/build/` (data, views, ai through ai11, ob), read on 8 Sep 2026.
Prepared for the Tal response design pass. Companion documents cover the Cohort Leader, Talent Agent and Super Admin portals.

## 1. How to read this document

**Who the user is.** The signed-in candidate in the prototype is Maryam. She scored 64 of 100 on the Next in Leadership quiz on 12 August (Composure 84 highest, Coaching 38 and Delegation 41 lowest), which put her on the Explorer track. Priya Nair interviewed her on 20 August and confirmed her at Explorer E3, rung 3 of 15, naming delegation and hard conversations as growth areas. She enrolled in the E3 course, Cohort 41, ten people, one chapter a week for 13 weeks, a 60-minute call every Thursday at 6:00 PM ET led by Priya. At day 34 she has finished 5 of 13 chapters at a 75% average against a cohort average of 79%, with chapter 4, Delegation Without Drop-Off, opened four times and unfinished. At day 90 all 13 are done at 83%, and the re-interview on 21 November moves her to E4.

**Eight stages of the journey** change what Tal says on the same page. In order: Consult (a screening call is booked, hidden stage), New (quiz done, no level, no interview), Booked (interview booked), Assessed (E3 confirmed, not enrolled), Week 1 (day 4 of the course), Day 34 (mid-course, the default), Day 90 (course done, re-interview to book) and Promoted (E4). Tal's responses in this document name the stage they belong to.

**Each scenario is a card** with the same fields:

| Field | Meaning |
|---|---|
| Page | Where the candidate usually is when they ask. Any question can be asked from any page |
| User asks | The natural phrasings that reach this answer. The first is a suggested-question chip where one exists |
| Stage | The stage or state that produces this exact answer |
| Response type | One of the patterns below. This field tells the designer whether there is a visual and which one |
| Status | **In prototype** means the copy and behaviour exist today. **Proposed** means a real candidate will ask it and the response is written here so design can cover it |

**Response patterns.** The candidate portal has the richest Tal in the product. Every response is one of these shapes; design each once.

| Pattern | Shape | Used for |
|---|---|---|
| **C1 Summary band** | "Summary by Tal" at the head of a page: one paragraph typed in, one or more phrases highlighted, some of them pressable | Every module page with a summary |
| **C2 Phrase popover** | Pressing a highlighted phrase in the summary opens a small card under it: a lead sentence, a labelled reading, a **Your Next Step** line and one action button | Dashboard, My Level, Interviews, Payments |
| **C3 Prose answer** | A chat reply of one paragraph with exactly one highlighted phrase, and usually two follow-up chips | Short factual answers and refusals |
| **C4 Facts widget** | A titled card with a glyph, a lede, then key/value rows (bold label, value), an optional kicker sentence and one action button | Costs, timings, standing, the weekly call |
| **C5 List widget** | Same card with a bulleted list, a checklist or a term-and-definition pair instead of rows | Rules, what to avoid, what is in the summary, key terms |
| **C6 Progress widget** | A card with a progress bar and minutes, or the five-rung Explorer rail with the current rung lit | Chapter questions, level and ladder questions |
| **C7 Person widget** | A card with one or two agent rows (photo, name, meta line) and a short list under them | An agent, comparing agents, the cohort leader |
| **C8 Booking flow** | Three agent cards in the thread, each flipping to a profile, then a day-and-time picker, then a confirmation with a receipt | "Book an interview" |
| **C9 Transcript answer** | A generated card: a source line, a lead sentence, up to four quote buttons with timestamp and speaker, a footer link to the transcript | Any question about what was said in an interview |
| **C10 Support hand-off** | A card with the support desk's details and an "Ask for" line, appended after Tal states the rule | Refunds, disputes, pauses, technical faults, anything Tal cannot answer |
| **C11 Draft offer** | A generated card offering to write something, with one button; accepting places an editable draft in the real field with a "did" bar and Undo | Replies to Priya, reflections from notes |
| **C12 Chat surfaces** | The opening hero, the thinking dots, the voice recorder states | Every conversation |
| **C13 Tal on a page** | Tal speaking outside the chat: the recommendation block, the Tal star, the scene ask, chapter help, the quiz peek, the learning pulse, the memory page, the practice page | Named pages |
| **C14 Onboarding** | Tal's first conversation: a voice screen, four questions with options, a journey read-back | First arrival |

**What Tal answers.** Six subjects: the course, your level, your interviews, your cohort, the money as policy, and Tal itself. Three kinds of no: a human decision hands off to support, something Tal cannot see is declined in the product's words, and anything outside the product gets one honest sentence with the nearest chips.

## 2. Where Tal appears

### 2.1 The Summary by Tal band (C1)

At the head of every module page. Label **Summary by Tal** with Tal's animated mark. One paragraph; enrolled dashboards run to two blocks. Highlighted phrases carry a pale accent wash. A phrase that opens a popover is pressable; the rule is that a phrase is highlighted only if pressing it says something.

**States to design**

- **Typing.** The paragraph types in character by character with a thin caret over 2 to 3.4 seconds. A hidden ghost copy holds the final height so the page never reflows. Re-types only on a new arrival (page, stage or text change). Instant under reduced motion.
- **Two-column band.** On New, Booked and Assessed the right column is the four-step journey. On Week 1, Day 34 and Day 90 it is the course progress strip. The page title is hidden and the summary opens with the greeting.
- **With the page's one dark card** hoisted into the band beneath it (the enrolment plate, the certificate, the level hero).
- **Absent.** No band on Payment, Checkout, Agents, Agent profile, Booking, Messages, Coursework and Chapter (the LightspeedVT frame), the chat page, sign-in and Terms.

### 2.2 The phrase popover (C2)

Pressing a highlighted phrase opens a card under it, left-aligned to the phrase and clamped inside the paragraph. Structure: a lead sentence stating what is true, a bold label and reading, a **Your Next Step** heading with one sentence, and one action button with a glyph. Click-away or Escape closes it. Fourteen popovers exist; all are in section 3.10.

### 2.3 The Ask Tal dock (C12)

A floating bar at the foot of every page: a comet of light running the border, Tal's animated mark, **Ask Tal anything**, one example question from the page's set in grey quotes rotating every three seconds, a microphone when the browser supports speech, and a send arrow disabled until there is text. Pressing anywhere opens the chat. Pressing the mic opens the chat and starts recording. Not shown on sign-up, onboarding, coursework, chapter, Terms, or any page that ends in its own composer (Messages, the cohort Discussion tab).

### 2.4 The chat page (C12)

The page lifts and fades, the dock line widens into the field. Top bar: a back arrow reading **Back to** the page you came from (Dashboard, My Level, Coursework, Course Progress, Points, Cohort 41, Interviews, Enrolling, Payments, Your report, Choosing an agent, Agent profile, Interview booked, Payment, Enrolled, Profile, Messages, A chapter, An interview transcript, Practising with Tal, A cohort member), then Tal's mark and the name **Tal**.

- **Opening state.** A large animated orb. Heading **Hey, Maryam!** and, in gradient ink, **What's going on?** Line: *I am here to assist you with anything you need help with.* The page's suggestion chips below, then the field with placeholder **What can I help you with?**, an attach clip, a mic and a round send arrow.
- **Chips.** A small spark and the question. Chips fade out on the first message. Follow-up chips under an answer appear only on the newest answer; older ones lose theirs.
- **Thinking.** Every answer, on every surface, is preceded by a Tal bubble with three pulsing dots for 1.4 seconds. Questions queue and answer in order.
- **Bubbles.** The speaker is named above each bubble: **You** with the candidate's photo, **Tal** with the small mark. A Tal bubble is capped at a readable measure; one holding a facts widget takes up to 620px; one holding agent cards takes the full column.
- **Leaving.** Moving to another module closes the conversation. The thread belongs to the page it opened from.

### 2.5 The voice recorder (C12)

Pressing the mic turns the field into a recorder, built to the ChatGPT reference.

| State | What shows |
|---|---|
| Recording | A cancel disc on the left, a live waveform driven by the real microphone (newest bar right, quiet past trailing left as dots), a square stop, an up-arrow send |
| Microphone denied | The same, with a smoothed synthetic meter so the take still reads as live |
| Transcribing | The bars are replaced by the note **Transcribing…** for at least half a second |
| Stop | The words land in the field to edit; the send arrow arms |
| Send | The words post straight to Tal |
| Cancel | The take is discarded and the empty field returns |
| Nothing heard | One of the page's suggested questions stands in, so stop and send always land a real message |

### 2.6 Tal on a page (C13)

| Surface | Page | What to design |
|---|---|---|
| **Tal recommends** | Dashboard New and Day 90, inside the black card | Heading **Your Next Step - Interview** (or **Re-interview**), a **Tal recommends** spark label, the agent's photo, name and verified tick, "★ 4.8 · 210 interviews", the claim *Priya's Architecture strength perfectly matches your need for System Design.*, facts "$95 Interview Fee · 45 mins call · Next slot: Thu, Aug 20 · 6:30 PM", button **Book Priya Now →**, link **View all agents** |
| **Recommended chip** | Agents table | A static **Recommended** chip on Tal's pick |
| **Tal star** | Every agent row and card | A spark collapsed to a mark; on hover it expands to **Ask Tal**. Pressing opens the chat with *What is Priya like to be interviewed by?* |
| **Scene ask** | Interviews and Report, under the six-scene chooser; Profile scenes | A line reading **Ask Tal why these scenes were chosen from your interview?** which opens the chat with that question |
| **Quick actions** | Dashboard New and Booked | **Quick-Start Preparation**, *Ask Tal to prepare you for the interview.* · **What to bring**, *Ask Tal what to have ready for the call.* Both open the chat with the preparation question |
| **Help with this chapter** | Chapter page (no band here) | A Tal card titled **Help with this chapter**. Chapter 4: *This chapter comes down to one question: what has to be true before you hand something over. Most people get stuck because they treat it as a question about trust when it is a question about clarity.* Other chapters: *You can get a summary of this chapter, its key terms, or a few questions to test yourself once you have watched the video.* Three full-width buttons: **Explain this chapter in 60 seconds** · **Give me the two key terms** · **I am stuck, ask me a question instead** |
| **Reflection chip** | Chapter notes panel | Chip **Turn this into a reflection** and the note *Saved to this chapter. Only you and Tal can see it.* |
| **Quiz results peek** | The Your Quiz Results panel | A spark and *Composure at 84 is your strongest band, coaching at 38 your weakest. An agent pushes hardest on the two lowest, and both are holding you a rung below the rest of you.* |
| **Your learning pulse** | Course Progress | A spark heading and a lede: *You have completed 12 of 70 minutes for Delegation Without Drop-Off, which is all the time you have spent learning this week. Complete chapter 4 to stay on the pace.* Week 1 and Day 90 variants name chapter 1 and the 13 finished chapters |
| **Did bar** | Top of Messages or a chapter after Tal drafted | Tal's mark and **Tal drafted a reply to Priya** or **Tal turned your note into a reflection**, with **Undo**. After accepting: **Tal's draft is in your field** |
| **Draft block** | Messages composer foot, chapter notes | A Tal pill and **Draft, not sent**, an editable text area, buttons **Use this** · **Try again** · **Discard**, note *Nothing is sent until you send it.* |
| **What Tal knows** | Profile → the memory page | Title **What Tal knows about you**. Section **Held about you**, newest first: each row is a claim, why it matters, a source chip that opens the transcript at its minute, "Learned 20 Aug", and actions **This is wrong** · **Forget this**. A flagged row reads **Marked wrong, not in use** with **Undo**. Empty state: **Nothing held**, *You have asked me to forget everything. I will start again from what happens next.* Section **What I have never seen** lists the one-to-one thread with Priya, anything said on a cohort call, and card details and billing history |
| **Practice** | The practice page | **Practice a conversation**, **Drawn from your record**: three scenarios (Sam, your direct report · Rita in finance · Elena), each *Your level interview, 11:02 and 12:11*. Inside: a brief card **What Sam has been told**, footer *Built from your interview at 12:11* and *Not recorded. Not shared with Priya.*, then a turn-by-turn thread with option buttons under **Your turn**, closing with a **How that went** card and **Run it again** · **Another conversation** |
| **Transcript ask bar** | Interview transcript | A Tal-marked field **Ask this interview a question** with three chips: *What did Priya mean by cautious?* · *Show me every moment I framed delegation as risk* · *What changed between August and November?* |

### 2.7 Onboarding (C14)

Tal's first conversation, before any dashboard. No dock, no band. Header is the wordmark alone.

- **Voice screen.** Greeting **Good Morning, Maryam!**, a large orb with two rings and thirteen audio bars that move while Tal speaks (the clip starts 1.2 seconds after the greeting), a **Mute Tal** control, the control **Let's Get Started!**, and mode pills **Voice** / **Chat**.
- **Chat mode, not started.** The greeting as prose: *Good morning, Maryam! I'm Tal, and I'll be your companion throughout your TalentNext journey. Before we dive into the experience, let's start with a few quick questions about you. Nothing too complicated, just a chance for us to get to know you better.* Field placeholder **Press Let's Get Started to begin**.
- **Started.** Your first turn is recorded as **Let's Get Started!**; thinking dots; Tal's turns are prose beside a small orb, yours are filled bubbles. Placeholder **Choose an option, or type anything** while a question is live, else **Reply to Tal**. Anything typed goes to the normal routes.
- **The four questions**, each a Tal line, then a bordered panel with the question, a count "1 of 4" and numbered options with a description:
  1. *Before I point you at anybody, I need four things a quiz cannot tell me.* **Where are you right now?** In a role · Between roles · In school · Running my own thing.
  2. *Your quiz measured five things. Two of them came out low, and I would rather ask than assume which one matters.* **Your quiz put Coaching at 38 and Delegation at 41. Which one is actually biting?** Coaching · Delegation · Neither, it is something else.
  3. *This is the part the fifteen-minute call was for. The score says what; it never says why.* **Why is coaching hard right now?** or **Why is delegating hard right now?** or **Then what is the hard part?**, four options each (for delegating: No one to hand it to · I do not trust the handover · No one has shown me how · It is not the delegating, it is the workload).
  4. *Last one of the four. It decides what I put in front of you first.* **What do you want out of the next 90 days?** A level on record · To move up where I am · To change direction · To find out where I stand.
- **Closing.** *That is everything I needed. I have enough now to understand what you are after and where it is getting stuck. From here it is the platform's turn, and you are already on step two.* Then a **Your journey · Step 2 of 4** panel (quiz done, Interview and Levelling here, Course Enrollment, 90-day Cohort Journey) and the button **Find an Agent**. The answer to question 3 picks the recommended agent: coaching → Priya, delegation → Lena, other → Owen, and the dashboard summary quotes the words back.
- **Read-back** (via Change): **What I heard** rows with Change; **Who I would put you with**: *Three agents assess Explorer candidates. This is the one whose subject is the thing you just described.*, the agent card with a fit line such as *You said "I do not trust the handover", and Lena Fischer came up through engineering management, and expects a lot of "and then what happened".*, the hint *You are not booking anything now.*, and **Go to my dashboard**.

## 3. Page summaries — Summary by Tal

Bold marks a highlighted phrase; ᵖ marks a pressable one that opens a popover (section 3.10). The chips listed are the page's suggested questions, used by the dock, the chat opening and the fallback.

### 3.1 Dashboard

Chips: *What should I do next?* · *How am I doing overall?* · *Explain the 90-day cycle*

| Stage | Summary |
|---|---|
| Consult | Your quiz put you on the Explorer track from a score of 64. Jordan Blake calls on Thursday at 2:00 PM ET for fifteen minutes. Nothing to prepare, and it doesn't set your level. |
| New | Welcome back, Maryam! Based on your **quiz results**ᵖ, you are currently on the **Explorer track**ᵖ. Your level from E1 to E5 anchors after a 45-minute interview. Considering your strengths I have analysed the active roster and **matched you with Priya Nair below**ᵖ to specifically anchor your growth areas. |
| New, after onboarding | Same, with the middle clause: You told me "**I do not trust the handover**", so I have gone through the active roster and **matched you with Lena Fischer below**. |
| Booked | Welcome back, Maryam! Your **levelling interview with Priya Nair**ᵖ is confirmed for Thursday, August 20 at 6:30 PM ET (45 minutes, video-recorded). My analysis of Priya's evaluation patterns shows a heavy emphasis on delegation frameworks. Since your quiz placed you on the **Explorer track**ᵖ, spending just **10 minutes practising your delegation talking points**ᵖ before Thursday is your best strategy for an optimal levelling outcome. |
| Assessed | Welcome back, Maryam! You are **Explorer E3**ᵖ, rung 3 of 15, signed by Priya on 21 August, with **delegation and hard conversations**ᵖ as your growth areas. **Enrolling**ᵖ is the only thing left. |
| Week 1 | Good morning, Maryam! **Chapter 1 ('Why We Exist')** has unlocked today. This week has no graded assessments, so you have a buffer window to explore. Right now, **four of the ten in your cohort** have already finished it. It takes about 45 minutes, so starting today puts your **55-minute weekly target** within reach without touching next week. |
| Day 34 | Good morning, Maryam! You are **5 of 13 chapters** in at 75%, 260 minutes on the course so far. **Chapter 4 ('Delegation Without Drop-Off')** has been opened four times without finishing, and the three furthest ahead in Cohort 41 had it done by now. It is 70 minutes of work. Clearing it this week is what puts you back on the **55-minute weekly target** before week 6 adds its own. |
| Day 90 | Good morning, Maryam! **All 13 chapters** are done in 90 days, 83% average, 700 minutes total. Your growth areas were **chapters 4 and 12**, and you passed both. The re-interview is what decides whether your level moves, so I have been over the roster and **matched you with Priya Nair below**. |
| Promoted | You moved from E3 to E4 in 90 days: 13 chapters, 83% average, 700 minutes of coursework. At this level you can also volunteer to lead a cohort. |

The greeting on enrolled stages follows the clock: Good morning, Good afternoon, Good evening. After a booking made in the chat, every "Priya Nair" in the Booked summary follows the agent actually booked.

### 3.2 My Level

Chips: *What would move me up?* · *How does the ladder work?* · *What is the Explorer track?*

| Stage | Summary |
|---|---|
| Consult, New | Your **quiz result**ᵖ places you on the **Explorer track**ᵖ, with your level to be determined through a **45-minute interview**ᵖ. The ladder shows your current path across Explorer, Builder and Trailblazer, with five levels in each track. |
| Booked | Your interview is booked for **20 August**ᵖ, but your exact level is still to be determined. Your quiz placed you on the **Explorer track (E1 to E5)**ᵖ, and the interview will establish where you land on the ladder. |
| Assessed to Day 90 | E3, level 3 of 15 on the Explorer track, confirmed by Priya on 21 August. Only a re-interview at the end of a course moves it. |
| Promoted | E4, level 4 of 15, signed on 21 November after your re-interview, one up from where the 90 days started. Another course and re-interview moves it again. |

### 3.3 Your report

Chips: *What do chapters 4 and 12 cover?* · *How do I get to E4?* · *What does E3 mean in practice?*

> Priya's write-up of the 20 August interview, confirming Explorer E3. Delegation and hard conversations are the growth areas, and both are chapters on your course.

### 3.4 Quiz results

Chips fall back to the dashboard's.

> Composure at 84 is your strongest band, coaching at 38 your weakest. An agent pushes hardest on the two lowest, and both have a chapter on the course.

### 3.5 Interviews

Chips: *Book an interview with a top agent* · *What happens in the 45 minutes?* · *What should I not do?* · *How soon do I get my level?*

| Stage | Summary |
|---|---|
| Consult, New | You haven't completed an interview yet. Choose from **24 available agents**ᵖ to book a **45-minute conversation**ᵖ and determine your level, with options across different experience areas, ratings and fees. |
| Booked | Your **45-minute interview with Priya Nair**ᵖ is scheduled for Thursday, August 20 at 6:30 PM ET. She'll assess your skills across the E1 to E3 levels, and your final level and report will be based on this conversation. *(Was "scheduled and ready to join"; fixed 8 Sep — see §7. "Ready to join" belongs to the final minute only.)* |
| Assessed, Week 1, Day 34 | One on record: 20 August with Priya, which set Explorer E3. A re-interview at the end of the 90 days is what moves the level. |
| Day 90 | One interview on record, and the re-interview still to book. Whoever you pick reads your 90-day summary before the call. |
| Promoted | Two interviews on record: 20 August set Explorer E3, and 21 November moved you to E4. Both reports are yours to keep. |

Agents, Agent profile and Booking pages carry no band. Their chips: Agents *Book an interview with a top agent* · *What does the rank number mean?* · *Compare Priya and Owen for me* · *Does a pricier agent score higher?*; Agent *What is this agent like?* · *Run a mock interview with me* · *What should I prepare?*; Booking *Run a mock on delegation* · *What if I freeze?* · *Can I see the questions first?*

### 3.6 Enrol and Welcome

Enrol chips: *What happens on the weekly call?* · *Can I change cohort later?* · *Is the fee refundable?*

> About an hour a week on the chapter, plus the 60-minute call. People who keep to that finish all 13 and average above 85%.

Payment and Checkout carry no band (chips: *Is my card stored?* · *What is the refund window?*). Welcome (chips: *What should I do before it starts?* · *What happens on the weekly call?* · *Can I change cohort later?*):

> Your place is paid and the cohort is yours for the 90 days. Nothing is due from you until chapter 1 unlocks, and Priya posts to the board before then.

### 3.7 Course Progress

Chips: *How do I compare with my cohort?* · *What is in the 90-day summary?* · *Which chapter dragged my average down?*

| Stage | Summary |
|---|---|
| Week 1 | Nothing on the record yet. The 90 days only started this week. |
| Day 34 | 5 of 13 chapters at 75%, about 4 hours in. This is the record an agent reads before your re-interview. |
| Day 90 | 13 of 13 chapters at 83%, about 12 hours in. This is the record an agent reads before your re-interview. |
| Promoted | Cohort 41 is closed: 13 chapters at 83%, about 12 hours of coursework. Nothing lands on this record again until you enrol at E4. |

Coursework and Chapter pages sit in the LightspeedVT frame and carry no band. Their chips: Coursework *Which chapter should I do first?* · *How far behind am I?* · *What is next week about?*; Chapter *Explain this chapter in 60 seconds* · *Give me the two key terms* · *I am stuck, ask me a question instead*.

### 3.8 Achievements

Chips: *How do I earn more points?* · *What is the Bronze badge?* · *Does rank affect my level?*

| Stage | Summary |
|---|---|
| Before enrolling | Points start when you enrol: 10 for signing in, 25 a chapter, Bronze at 2,500. None of it affects your level. |
| Week 1 | 985 points at 1-Star, 1,515 short of the Bronze badge at 2,500. Points come from signing in, chapters and cohort posts. None of it touches your level. |
| Day 34 | 1,095 points at 1-Star, 1,405 short of the Bronze badge at 2,500. Same second sentence. |
| Day 90 | 2,955 points at 1-Star, with Bronze earned and Silver at 5,000. Same second sentence. |
| Promoted | 3,205 points at 1-Star, with Bronze earned and Silver at 5,000. |

### 3.9 Cohort, Messages, Payments, Profile, memory, practice, transcript

| Page | Summary | Chips |
|---|---|---|
| Cohort 41 | Thursday's call is at 6:00 PM ET on hard conversations, and Priya has asked everyone to bring a real one to talk through. | *What should I say on the call?* · *Am I behind the others?* · *Who leads this cohort?* |
| Messages | No band (the page ends in its own composer). | *Help me word a reply* |
| Payments | Your saved Visa, Mastercard and Amex cards are on file for future payments, with your default set to **Visa ending 4242**ᵖ. A course and an interview have **different refund windows**ᵖ, and I can state both — every charge keeps its own receipt in the table below. *(Was reciting the $490 / E2 charge; fixed 8 Sep — see §7. The charge lives in the Previous Transactions table.)* | *What does the course fee cover?* · *What is the refund window?* · *Is my card stored?* |
| Profile | Everything here saves as you go. The block worth a look is the last one: what I'm allowed to remember, and what I can do without asking. | *What can you see about me?* · *How do I turn you off?* |
| What Tal knows | Seven things I've learned about you, each traced back to where it came from. Mark anything wrong and I'll stop using it. | *How is this cohort doing overall?* · *Who else is at my level?* |
| Practice | Rehearse a hard conversation before you have it for real. I play the other person, briefed from your interview. Nothing is recorded or scored. | *Give me a harder scenario* · *How did I do?* · *Play the other person again* |
| Interview transcript | Searchable and tagged by topic, all 45:12 of it. Everything in your report was drawn from here, and the quotes link back to the minute. | *Summarise this interview* · *What did I say about delegation?* · *Find the part on hard conversations* |

Design note (resolved 8 Sep): the Payments summary used to recite the ledger while Tal's memory page and two chat answers say Tal has never seen billing. Resolved as recommended — the band now names the cards on file and the refund windows and leaves the charge to the table beneath it, so the page is consistent with `NEVER[2]`, `wLedger` and the dock placeholder.

### 3.10 The phrase popovers (C2)

Each is: lead sentence · **label** and reading · Your Next Step · action.

| Phrase | Lead | Reading | Your Next Step | Action |
|---|---|---|---|---|
| quiz results | You scored 64 of 100 on the Next in Leadership quiz on 12 Aug, across five bands. | **What it measured.** Composure came out highest at 84, and Coaching lowest at 38. A quiz sets the track, not the level. It is the interview that decides which of E1 to E5 you sit on. | Open the full breakdown to see all five bands scored, and the two chapters built on the ones you scored lowest. | Open your quiz results |
| Explorer track | According to the Next in Leadership quiz, you are evaluated as an Explorer. | **Discovering your direction.** You're exploring what fits you best, and that's a strength. Stay curious, ask questions, and keep trying new experiences. | Connect with a TalentNext agent to get yourself evaluated and get a level. Your level anchors after a 45-minute interview. | Book your interview with Priya Nair (stage-aware: See the booking · See your interviews) |
| matched you with Priya Nair | Priya Nair assesses E1 to E3 and has run 210 interviews, rated 4.8. | **Why this pair.** Your growth area is system design and their strength is architecture. 98% of what your quiz surfaced overlaps with what they assess. | Their next opening is Thu, Aug 20 · 6:30 PM, 45 minutes, $95. Nothing is charged until you confirm the slot. | Book your interview with Priya Nair |
| levelling interview with Priya Nair | Your interview with Priya Nair is booked for Thursday, August 20 at 6:30 PM ET. | **What happens in it.** 45 minutes, recorded, and real situations rather than hypotheticals. She confirms which of E1 to E5 you sit on and signs a report you keep. | Nothing has to be prepared. If you want to, ten minutes on delegation is the most useful ten minutes you can spend. | See the booking |
| 10 minutes practising | Delegation is the question Priya asks most often, and it is one of your two lowest quiz bands at 41. | **How to spend ten minutes.** Have one real example ready: something you handed over, what actually happened, and what you would do differently. She is assessing judgement, not vocabulary. | Tal can run a mock interview on it whenever you want one, and it does not go on your record. | Run a mock interview (asks Tal) |
| Explorer E3 | Priya confirmed you at Explorer E3 on 21 August, rung 3 of the fifteen-rung ladder. | **What a level is.** Explorer is rungs 1 to 5 of 15, and the interview is the only thing that sets one; a quiz cannot. E3 opens the course built for E3, and 90 days later you re-interview. | The ladder shows all fifteen rungs and the three tracks they sit in. | See where you are on the ladder |
| delegation and hard conversations | Your two lowest bands were Coaching at 38 and Delegation at 41. | **Where the course meets them.** Chapters 4 and 5 are built on exactly these two, which is why they are the two Priya wrote up. | The full report has her write-up on both, in her own words, with the evidence she based it on. | Read the full report |
| Enrolling | Enrolling locks in your place in the next cohort and the price you were quoted. | **What the 90 days are.** 13 chapters, one a week, each closing on an assessment, with a cohort of ten and a live leader running a weekly call. The average of the thirteen is what an agent reads at your re-interview. | The next cohort starts within two weeks of paying, and the interview you have already paid for comes off the price. | See what enrolling costs |
| 45-minute interview | A level interview is 45 minutes with a talent agent, video-recorded, and it is the only thing that sets a level. | **What happens in it.** Real situations rather than hypotheticals. The agent decides which of E1 to E5 you sit on and signs a report you keep. A quiz can predict the track, but it cannot set the rung. | Any agent whose range covers your track can run it. Nothing is charged until you confirm a slot. | Book your interview with Priya Nair |
| 24 available agents | Every agent sets their own fee and assesses their own band of levels: $80 to $110 here, rated 4.3 to 4.8. | **What has to match.** The range, and only the range. An agent assesses a band of the fifteen rungs, and yours has to sit inside it. Fee, rating and what they assess for are yours to weigh after that. | Tal already has a pick, on the strength of what your quiz surfaced. | Book your interview with Priya Nair |
| ready to join *(final-minute only)* | The call opens five minutes before the start and stays open until the session ends. | **What you are joining.** A video call in the browser: camera, microphone, screen share and captions. It is recorded, and the recording goes to your agent rather than to Tal. | Nothing has to be prepared. If the time no longer works, reschedule from the card below. | Join the interview |
| different refund windows *(replaces the $490 / E2 charge popovers, 8 Sep)* | A course and an interview are refunded on different clocks. | **Two windows, not one.** A course purchase and an interview fee are always separate rows, and each keeps its own receipt and its own refund window for as long as the account is open. | Tal can state both windows against your charges — the figures come from the terms, not from a billing ledger Tal cannot see. | Ask about the refund windows (asks Tal) |
| Visa ending 4242 | Visa ending 4242 is your default card, expiring 09/29. | **What default means.** It is the card a new charge is offered against first, and it is a preference rather than a commitment. You can switch it, or take a card off, without touching anything already paid. | The other two are on file for later, and each can be made the default from the list below. (One card: It is the only card on file.) | Ask how your card is held (asks Tal) |

## 4. Chat scenarios

Grouped by subject. The prototype routes by keyword, first match wins, so the phrasings under **User asks** are the ones that reach each answer today; a production router should catch the same intent.

### 4.1 Next steps and standing

#### K-01 · What should I do next

:: Page: Any
:: User asks: "What should I do next?" · "What now?" · "Where do I start?" · "What's the most important thing?"
:: Stage: All eight, one answer each
:: Response type: C4 Facts widget, flagged as must-act (accent glyph), with a button and a follow-up chip
:: Status: In prototype

Title **Next**, then a headline and a paragraph per stage:

| Stage | Headline | Paragraph | Button · chip |
|---|---|---|---|
| Consult | Nothing, and that is the point | Your call with Jordan Blake is Thursday, August 13 at 2:00 PM ET. Fifteen minutes, nothing assessed, nothing to prepare. He points you at the agents whose range fits, and you book after that. | Open Interviews · What happens on the consultant call? |
| New | Book the interview that sets your level | Your quiz put you on the Explorer track, and that is a title rather than a level. Forty-five minutes with an agent is what turns it into E1 to E5, and the course you can enrol on follows from it. | See the agents · Book an interview with a top agent |
| Booked | Spend ten minutes preparing | Priya Nair, Thursday 20 August, 6:30 PM ET. She opens with a situation from your own answers, so the useful preparation is one story you can actually tell, not revision. I can run it with you now. | Open Interviews · Run a mock interview with me |
| Assessed | Enrol in the Explorer E3 course | Your report is signed and E3 is confirmed. The cohort is assigned for you and the 90 days start when it does: $595 with your interview credited. | Open Enrol · What do the 90 days ask of me? |
| Week 1 | Finish chapter 1 | Forty-five minutes, and nothing this week is assessed. Four of the ten in Cohort 41 have already done it, so the only thing between you and their pace is the chapter itself. | Open Coursework · What is next week about? |
| Day 34 | Finish chapter 4 | You are 12 minutes into it after four opens, it is 70 minutes long, and it is the growth area Priya named in your report. It is the one place extra time changes your level rather than your average. | Open chapter 4 · How do I catch up? |
| Day 90 | Book the re-interview | All 13 chapters are done at 83% and your 90-day summary is written. Priya signs it once the re-interview is booked, and whoever you pick reads it before the call. There is nothing further to pay. | Open Interviews · What happens at the re-interview? |
| Promoted | Enrol in the E4 course | You moved up on November 21. The next 90 days are built for E4, and your returning-candidate credit comes off the fee. | Open Enrol · What is different about E4? |

#### K-02 · How am I doing overall

:: Page: Dashboard, Course Progress
:: User asks: "How am I doing overall?" · "Where do I stand?" · "How do I compare with my cohort?" · "My progress"
:: Stage: Enrolled stages
:: Response type: C4 Facts widget with button
:: Status: In prototype

Title **Where you are**. Rows: **5 of 13** · chapters finished · **75%** · your average, against a cohort average of 79% · **Day 34** · of 90, week 5 of 13. Kicker by stage:

- Week 1: rows read **0 of 13**, **—** nothing assessed yet, **Day 4**. *Too early to say anything about scores. Nothing this week is assessed.*
- Day 34: *Comfortably above the cohort on the work you have finished. Pace is the open question, not quality.*
- Day 90: **13 of 13**, **83%**. *All 13 done, above the cohort average on every one. The re-interview is the only thing left.*
- Promoted: *All 13 done and the re-interview signed. You moved to E4 on November 21.*

Button **Open Course Progress**. Not enrolled (C3): *You are not on a course yet, so there is nothing to be doing well or badly at. What is decided so far is your track, Explorer, from the quiz, and the next thing that moves is your level.* Chips: *What should I do next?* · *How does the ladder work?*

#### K-03 · Am I behind

:: Page: Coursework, Cohort
:: User asks: "How far behind am I?" · "Am I behind the others?" · "How do I catch up?" · "Am I on track?"
:: Stage: Week 1, Day 34
:: Response type: C4 widget, must-act, with a button and a ghost chip
:: Status: In prototype

Title **Against your cohort**. Day 34 lede: *The three furthest ahead in Cohort 41 had this week's chapter finished and its assessment submitted by day 34. You are 58 minutes and one assessment behind that pace, and chapter 4 is the growth area in your report, so it is the one worth the extra time.* Week 1: *Four of the ten in Cohort 41 have already finished chapter 1. Nothing is assessed this week, so the only thing between you and their pace is the 45 minutes of the chapter itself.* Button **Open Coursework**; ghost chip *What do I have to do to catch up this week?*

Finished (C3): *You are not behind. All 13 chapters are done and the 90 days are finished. What is outstanding is the re-interview, and that is a booking rather than a backlog.* Not enrolled: *There is no pace to be behind yet. The 90 days start when your cohort does.*

#### K-04 · When does the course end

:: Page: Course Progress, Enrol
:: User asks: "When does the course end?" · "How many weeks left?" · "What's the finish date?"
:: Stage: Enrolled
:: Response type: C4 Facts widget with button
:: Status: In prototype

Title **What is left**. Rows: **Day 34** · of 90, 56 days to go · **Week 5** · of 13, 8 chapters still to open · **Day 91** · the re-interview, which is the last thing in the course. Kicker: *Your cohort finishes together. The ten of you started on the same day and the calls stop on the same week.* Button **Open Course Progress**.

Not enrolled (C3): *Ninety days from the day your cohort starts, and the cohort starts when it is full. The re-interview is day 91.* Promoted: *It is finished. All 13 chapters, the summary signed on November 21, and the re-interview decided: you moved to E4. What is open now is the next course, not this one.*

#### K-05 · Explain the 90-day cycle

:: Page: Dashboard, Enrol
:: User asks: "Explain the 90-day cycle" · "How does the course work?" · "How is the course structured?"
:: Stage: Any
:: Response type: C4 Facts widget with button
:: Status: In prototype

> Title **How the 90 days run**. **Day 1** · your cohort of ten starts together, all at the same level · **Weekly** · one chapter, its assessment, and a 60-minute call on Thursday · **Day 90** · 13 chapters done, and your 90-day summary written · **Day 91** · the re-interview: you move up, hold, or drop back. Kicker: About **two hours a week**. The cohort is fixed for the whole 90 days and your leader is a volunteer who has already done the level above yours.

Button **See the 13 chapters**.

#### K-06 · How much time each week

:: Page: Enrol, Coursework
:: User asks: "How much time does it take?" · "Hours each week?" · "What if I fall behind?" · "Can I work ahead?"
:: Stage: Any
:: Response type: C4 Facts widget with chips
:: Status: In prototype

> Plan for about two hours a week. Title **What the weeks look like**. **~55 min** · chapters and assessment · **60 min** · the live cohort call · **~15 min** · the weekly task. Kicker: Two hours a week, near enough. Weeks 4 and 12 run longer.

Chips: *What if I fall behind?* · *Can I work ahead?*

### 4.2 Chapters and the course

#### K-07 · Walk me through chapter 4

:: Page: Dashboard Day 34, Chapter
:: User asks: "Walk me through chapter 4" · "Explain this chapter in 60 seconds" · "I am stuck" · "What does the roleplay ask for?"
:: Stage: Enrolled
:: Response type: C6 Progress widget with button and chips
:: Status: In prototype

> The whole chapter is one question: what has to be true before you hand something over. Most people read it as trust when it is really clarity.

Widget: title **Chapter 4 · Delegation Without Drop-Off**, a progress bar at 17% and the line **12 of 70 min** (100% and 70 of 70 when done; 0 of 70 when unopened). Button **Open chapter 4**. Chips: *Give me the two key terms* · *How are chapters assessed?*

#### K-08 · Give me the two key terms

:: Page: Chapter
:: User asks: "Give me the two key terms" · "Key terms for this chapter" · "What are the main concepts?"
:: Stage: Enrolled
:: Response type: C5 List widget, term and definition, with chips
:: Status: In prototype

> Chapter 4 turns on two ideas. Title **Two terms this chapter turns on**. **Operating rhythm**: the regular cadence of check-ins that lets you follow work without hovering over it. **Drop-off point**: the moment work stops moving and nobody has said so out loud.

Chips: *Explain the chapter in 60 seconds* · *What does the roleplay ask for?*

#### K-09 · What is chapter 1 about

:: Page: Dashboard Week 1
:: User asks: "What is chapter 1 about?" · "Tell me more" · "What is the first chapter?"
:: Stage: Week 1
:: Response type: C6 Progress widget with chips
:: Status: In prototype

> Chapter 1 sets up why the operator role exists and how your week ladders up to the outcome your team owns.

Widget **Chapter 1 · Why We Exist**, 0 of 45 min. Chips: *What happens on the call?* · *How are chapters assessed?*

#### K-10 · What do chapters 4 and 12 cover

:: Page: Your report
:: User asks: "What do chapters 4 and 12 cover?" · "Chapters 2 to 5" · "What is chapter 7?"
:: Stage: Any
:: Response type: C5 List widget with button
:: Status: In prototype

> Title **The chapters you asked about**. **Chapter 4 · Delegation Without Drop-Off**, 70 min · open now · your growth area. **Chapter 12 · Coaching vs Fixing**, 55 min · opens Mon, Sep 29 · your growth area. Kicker: Both are growth areas from your report, which is why they are named together. Extra time there moves your level more than extra time anywhere else.

Row states: *finished, assessed 80%* · *open now* · *opens Mon, Sep 29* · *not started*. Button **Open Coursework**. A single chapter answers with one row, title **Chapter 7**, button **Open chapter 7**.

#### K-11 · Which chapter dragged my average down

:: Page: Course Progress
:: User asks: "Which chapter dragged my average down?" · "My worst score" · "Which chapter did I do badly on?"
:: Stage: Day 34 onward
:: Response type: C4 Facts widget with button
:: Status: In prototype (kicker corrected)

> Title **Your lowest assessment**. **50%** · chapter 4, Delegation Without Drop-Off · **75%** · your average across 5 assessed · **79%** · the cohort average. Kicker: 50% is below the cohort average and well below your own, so it is the one with the most left in it, and your report names it as a growth area. Finishing it properly is worth more than any other hour this week.

Button **Open chapter 4**. Not yet assessed (C3): *Nothing is assessed yet, so there is no average to drag down. Your first score lands when you finish chapter 1.*

#### K-12 · Can I have the assessment answers

:: Page: Chapter
:: User asks: "Give me the answers to the assessment" · "Do the quiz for me" · "Pass it for me"
:: Stage: Enrolled
:: Response type: C3 Prose with chips
:: Status: In prototype

> I **will not** do that one. The assessment is what tells your leader where you are, and an answer I handed you tells them something false. It comes out of your level at the re-interview, not out of a mark. If it is the time rather than the material, say so and I will tell you the shortest honest route through this week.

Chips: *How do I catch up?* · *Explain this chapter in 60 seconds* · *I am stuck, ask me a question instead*

#### K-13 · What is in the 90-day summary

:: Page: Course Progress
:: User asks: "What is in the 90-day summary?" · "What does the summary contain?"
:: Stage: Any enrolled
:: Response type: C5 List widget with button
:: Status: In prototype

> Title **What is in the 90-day summary**. Every chapter you finished and what it was assessed at. The growth areas from your level interview, and whether the 90 days moved them. What your cohort leader wrote, and their recommendation: move up, hold, or drop back.

Kicker by stage: *Yours is being assembled as you go. It is signed at day 90.* · Day 90: *Yours is written. Priya signs it once you book the re-interview, and whoever you pick reads it before the call.* · Promoted: *Yours was signed by Priya on November 21. It is what your re-interview was assessed against.* Button **Open Course Progress**.

#### K-14 · What do I have at the end

:: Page: Enrol, Course Progress
:: User asks: "What do I have at the end?" · "Do I get a certificate?" · "Is this a qualification?"
:: Stage: Any
:: Response type: C5 List widget with button
:: Status: In prototype

> Title **What you have at the end**. A confirmed level, decided at the re-interview and signed by an agent. Your 90-day summary, the signed record of the 13 chapters, your assessment scores and what your leader wrote; it is yours to read and to share. Everything you earned along the way: your points, your badges and your rank stay on the account. Kicker: Deleting your account later **does not** take a signed summary off you.

Button **Open Course Progress**.

### 4.3 Level and ladder

#### K-15 · How does the ladder work

:: Page: My Level
:: User asks: "How does the ladder work?" · "What is the Explorer track?" · "What does E3 mean?" · "Show me my quiz results"
:: Stage: Any
:: Response type: C6 Rungs widget with button and chips
:: Status: In prototype

> Your level is where you sit on the Explorer track, set by an interview and reviewed at the end of each course.

Widget **The Explorer track**: a rail of E1 E2 E3 E4 E5 with the current rung lit (none lit before an interview). List before a level: *An interview with a talent agent confirms which level you are on* · *Your level opens the 90-day course built for it* · *Re-interview at day 91: move up, hold, or drop back*. List once levelled: *Finish the 13 chapters and keep your weekly tasks on time* · *Re-interview once the 90 days are up* · *Your cohort leader decides: move up, hold, or drop back*. Button **See my level**. Chips: *What would move me to E4?* · *What is on my report?*

The quiz phrasing prepends: *You scored 64 out of 100, which puts you on the Explorer track, the first of three. That is a title, not a level: the five levels inside it are set by an interview with a talent agent, and the quiz cannot do it.*

#### K-16 · What would move me up

:: Page: My Level, Your report
:: User asks: "What would move me up?" · "How do I get to E4?" · "Next level" · "How do I get promoted?"
:: Stage: Assessed onward
:: Response type: C5 List widget, must-act, with two buttons
:: Status: In prototype

> Title **What moves you from E3 to E4**. The two growth areas Priya named in your report: **chapter 4, Delegation Without Drop-Off** and **chapter 5, Hard Conversations**. Those are what she will re-test. Your cohort leader's recommendation at day 90, which is written from your weekly tasks and the calls, not from your average. The re-interview at day 91. It is the same 45 minutes and the same questions, and what is assessed is whether the answers changed. Kicker (Day 34 onward): Your average is 75% against a cohort average of 79%, so scores are not what is holding you. A high average with the growth areas untouched **holds you at E3**.

Buttons **Open My Level** and ghost **Read the report**. Before a level (C3): *Nothing yet, because you are not on the ladder. The quiz gave you a track and an interview gives you a level, E1 to E5, and until an agent has done that there is no rung to move off.* Promoted: *You moved on November 21. E5 is the top of the Explorer track and the next 90 days are what decide it; the shape is the same: the chapters, the leader's recommendation, the re-interview.*

#### K-17 · What is E4 worth in salary

:: Page: My Level
:: User asks: "What salary is E4 worth?" · "What does an E3 earn?" · "Market rate for this level"
:: Stage: Any
:: Response type: C3 Prose refusal with chips
:: Status: In prototype

> I do not have that, and TalentNext does not publish it. A level is an assessment of how you operate, made by an agent inside this product. It is not a pay band and it is not benchmarked against a market. Anyone who told you an E4 is worth a number would be making it up, and so would I.

Chips: *What would move me to E4?* · *What is on my report?*

### 4.4 Interviews and agents

#### K-18 · Book an interview

:: Page: Dashboard New, Interviews, Agents
:: User asks: "Book an interview with a top agent" · "I want to be interviewed" · "Show me agents" · "Which agent should I book?" · "Who is available?"
:: Stage: New, Day 90 (the re-interview); available at any stage
:: Response type: C8 Booking flow
:: Status: In prototype

Step 1. Tal: *Here are the top profile agents you should consider.* Three agent cards across the thread: photo, name and price, stars and rating, "E1–E3 · 210 interviews", "Next: Thu, Aug 20 · 6:30 PM", a **Book** button. A booked card shows a **✓ Booked** flag instead.

Step 2, pressing a card flips it to a profile: **← All agents**, name, stars, "210 interviews", "Assesses E1–E3", ✓ Verified, the bio, then rows **Interview fee** $95 · **Length** 45 minutes, recorded · **Report turnaround** within 24 hours · **Next free slot** Thu, Aug 20 · 6:30 PM, and **Book Priya →**.

Step 3, pressing Book posts *Book an interview with Priya Nair* as your turn. Tal: *Pick a day and a time that suits you.* A picker: **Pick a day** with a strip Wed 19 · Thu 20 · Fri 21 · Mon 24 · Tue 25; **Pick a time**, times in ET: 9:00 AM, 11:30 AM, 2:00 PM, 4:30 PM, 6:30 PM, 8:00 PM, two of them disabled; a summary line *Thursday, August 20 at 6:30 PM ET* and *$95*; the button **Continue to payment →**; the note *Two other candidates are looking at Thursday. Slots are held for 10 minutes once you continue.*

Step 4, pressing Continue posts the chosen time as your turn. Tal: *Done, your interview is booked.* A frozen confirmation: a green note **Interview booked**, *Thursday, August 20 at 6:30 PM ET with Priya Nair. A calendar invite and joining link are in your email.*; a receipt tile **Agent** Priya Nair · **When** Thu, Aug 20 · 6:30 PM ET · **Length** 45 minutes, recorded · **Paid** $95 · Visa ending 4242; buttons **Back to my dashboard →** and **Interviews**. The picker above locks and shows **✓ Confirmed**. The stage advances to Booked and every page re-reads the booking.

#### K-19 · What is this agent like

:: Page: Agents, Agent profile
:: User asks: "What is Priya like to be interviewed by?" (the Tal star) · "Tell me about Owen" · "What is this agent like?"
:: Stage: Any
:: Response type: C7 Person widget with button and chips
:: Status: In prototype

> Here is what past candidates say about her. Card: Priya's photo, **Priya Nair**, "E1–E3 · 210 interviews · $95". Opens with a situation from your own answers. Pushes hardest on delegation. Reports inside 24 hours.

Button **See Priya's slots**. Chips: *What should I prepare?* · *How soon do I get my level?*

#### K-20 · Compare two agents

:: Page: Agents
:: User asks: "Compare Priya and Owen for me" · "Lena vs Owen" · "Which agent is better for me?" · "What's the difference between the agents?"
:: Stage: Any
:: Response type: C7 Person widget, two rows, with button
:: Status: In prototype

> Two rows: **Priya Nair**, "E1–E3 · 4.8 · 210 interviews · $95"; **Owen Clarke**, "E2–B1 · 4.6 · 164 interviews · $85". Priya pushes hardest on how you decide under pressure and will tell you plainly where you are. Owen works on incomplete information; expect "and then what happened" more than once. Kicker: Both assess Explorer candidates and both report inside 24 hours. The difference you will feel is the register, not the standard.

Button **See both profiles**.

#### K-21 · What does the rank number mean

:: Page: Agents
:: User asks: "What does the rank number mean?" · "How are agents rated?" · "What is the star based on?"
:: Stage: Any
:: Response type: C4 Facts widget with button
:: Status: In prototype

> Title **The number on an agent card**. **4.8** · the average score past candidates gave Priya after their interview, out of 5, across 210 of them · **E1–E3** · the levels she is certified to assess, not the levels she tends to give · **210** · interviews conducted. Kicker: The shortlist itself is ordered by how each agent's past candidates went on to progress, which is a different measure from the rating. **Neither one predicts** the level you will get. That comes out of your own 45 minutes.

Button **See the agents**.

#### K-22 · Does a pricier agent score higher

:: Page: Agents
:: User asks: "Does a pricier agent score higher?" · "Is a more expensive agent better?" · "Does paying more help?"
:: Stage: Any
:: Response type: C4 Facts widget with button
:: Status: In prototype

> Title **What the price is and is not**. **$80** · Lena Fischer · 4.5 · E1–E4 · **$95** · Priya Nair · 4.8 · E1–E3 · **$110** · Hana Kim · 4.3 · B1–B4. Kicker: The dearest of the three is the lowest rated and the cheapest is not the worst, so price is not a quality ranking. It is the agent's own rate, and it tracks the level band they assess and how booked they are. It buys you a different person, **never a different level**. The level comes out of the 45 minutes.

Button **Compare the agents**.

#### K-23 · What happens in the 45 minutes

:: Page: Interviews
:: User asks: "What happens in the 45 minutes?" · "What is the interview like?" · "Is it recorded?"
:: Stage: Any
:: Response type: C3 Prose with chips
:: Status: In prototype

> Forty-five minutes, recorded, with a talent agent you pick. They work through real situations from your own answers and then write your report.

Chips: *What should I prepare?* · *Who sees the recording?*

#### K-24 · Prepare me for the interview

:: Page: Booking, Dashboard Booked
:: User asks: "Prepare me for my level interview" · "What should I prepare?" · "What if I freeze?" · "Prepare me for the re-interview"
:: Stage: Booked, Day 90
:: Response type: C5 Checklist widget with button and chips
:: Status: In prototype

> We can run it now. I ask, you answer out loud, and I tell you where the answer went thin. Title **A 10-minute run-through**. ☐ One story where you handed work over and it went wrong. ☐ What you would do differently, in one sentence. ☐ One decision you changed after listening to someone.

Button **Start the practice run** (opens Practice). Chips: *What should I not do in the interview?* · *How long is the interview?*

#### K-25 · Run a mock interview

:: Page: Booking, Agent profile
:: User asks: "Run a mock interview with me" · "Run a mock on delegation" · "Practice" · "Roleplay" · "Rehearse"
:: Stage: Any with an interview on record
:: Response type: C11 Draft-style offer card with button
:: Status: In prototype

> Source line **Three conversations from your interview**. I can play the other person. Sam, so you can hand something over and leave it handed over; Rita in finance, the disagreement you ran on paper for two quarters; or Elena, where you bring a decision you have already made.

Button **Open practice →**.

#### K-26 · Can I see the questions first

:: Page: Booking
:: User asks: "Can I see the questions first?" · "What will she ask?" · "Is there a list of questions?"
:: Stage: Any
:: Response type: C3 Prose followed by C5 Checklist widget
:: Status: In prototype

> There is no list to send you, and that is deliberate rather than cagey. The agent opens on something from your own first few answers and follows it, so the second half of the interview is built out of the first half. **Nobody** has the questions in advance, including them.

Widget **So preparation is three things, not revision**: the same three checklist items as K-24. Button **Practise it with me**.

#### K-27 · What should I not do

:: Page: Interviews
:: User asks: "What should I not do?" · "Common mistakes" · "What should I avoid in the interview?"
:: Stage: Any
:: Response type: C5 List widget, must-act, with button
:: Status: In prototype

> Title **The four that cost people most**. Do not qualify your answer while you are giving it. Say the thing, then say what you would change. Do not bring the story where you were right. Bring the one that went wrong; the judgement is in what you did next. Do not answer in the abstract. "I would usually" cannot be assessed; "in March I" can. Do not negotiate the level in the room. The report comes 24 hours later and there is a proper route to a review. Kicker: None of this is about polish. Priya assesses **judgement under pressure** rather than vocabulary, and she says so on her profile.

Button **Practise one**.

#### K-28 · How soon do I get my level

:: Page: Interviews
:: User asks: "How soon do I get my level?" · "When will I see the report?" · "Is the report ready?"
:: Stage: Any
:: Response type: C3 Prose with chips
:: Status: In prototype

> **Inside 24 hours.** The agent writes the report after the call rather than during it, and your level appears on My Level the moment they sign it. There is no panel and no waiting list. If you disagree with what they set, you can ask for a review by a second agent.

Chips: *What is on my report?* · *How do I ask for a review?*

#### K-29 · Reschedule or cancel my interview

:: Page: Interviews
:: User asks: "Reschedule my interview" · "Cancel the booking" · "Move the slot" · "What happens if I don't show?"
:: Stage: Booked
:: Response type: C4 Facts widget with button
:: Status: In prototype

> Title **Moving or cancelling an interview**. **Up to 24h** · free to move to any of the agent's other slots, or to cancel for a full refund · **Inside 24h** · you can still move it, but the fee is not refundable · **No-show** · treated as inside 24 hours. Kicker: Rescheduling is on the booking itself. It **does not need a person**, and it does not go back to the start of the queue.

Button **Open Interviews**.

#### K-30 · Why were these scenes chosen

:: Page: Interviews, Your report, Profile
:: User asks: "Ask Tal why these scenes were chosen from your interview?" (the scene ask) · "Which scenes are shown?" · "What do the six moments mean?"
:: Stage: Assessed onward
:: Response type: C5 List widget with button
:: Status: In prototype

> Title **The six moments from your level interview**. Lede: Each one is a stretch of the recording where you were doing something the interview was looking for, not a highlight, and not a verdict. Rows: **The reorganization call**, Where you changed your mind · 1:48 · **Handing over the vendor review**, You explain why you took it back · 2:10 · **The Friday rhythm**, How your weekly meeting actually runs · 1:22 · **Managing up**, When a decision comes down · 2:41 · **Conflict with a peer**, Strong opening, thin resolution · 1:56 · **Closing reflection**, Summary of your own gaps · 1:11.

Kicker by selection: none kept, *Keep three of the six. Those three are what shows on your interview from now on, and the other three are not published anywhere.* · one or two kept, *You have 2 of three chosen. Save them and those three are what shows on your interview from now on.* · three kept, *You kept The reorganization call, Handing over the vendor review, Closing reflection. Those three are what shows on your interview; the other three are not published anywhere.* Button **Open Interviews**. The re-interview has its own six titles.

#### K-31 · Who can see my report

:: Page: Profile, Interviews
:: User asks: "Who can see my report?" · "Does my employer see this?" · "How long is the recording kept?" · "Is my data private?"
:: Stage: Any
:: Response type: C5 List widget with button
:: Status: In prototype

> Title **Who sees your interview**. The agent who interviewed you, and the cohort leader who runs your course. Nobody else, unless you share your report yourself. Recordings are video and audio, transcribed so the agent can write the report, kept for 24 months and then deleted. You can ask for a specific recording to be deleted at any time. Deleting the recording behind a confirmed level does not reverse the level. Your weekly cohort calls are not recorded at all. Kicker: TalentNext **does not sell** your data and does not share your individual progress with an employer without your written instruction.

Button **Read the data use notice**.

### 4.5 The transcript (C9)

Every answer in this group is a generated card: source line **From your level interview, 20 August 2026**, a lead sentence, up to four quote buttons (timestamp · Priya or You · the line), a count of further moments, and a footer **Open the transcript** with the note *Quoted, not summarised. Every line above is what was said.* Pressing a quote opens the transcript at that second. After Promoted the re-interview corpus answers when it is the one open.

#### K-32 · Show me every moment I framed delegation as risk

:: User asks: "Show me every moment I framed delegation as risk" · "What did I say about delegation?" · "The Sam handover" · "When I took it back"
:: Status: In prototype

> You framed delegation as a risk you were carrying, and it came up four separate times without me prompting you. 09:20 Priya "Tell me about something you handed over recently." · 11:02 You "There was a vendor review. I gave it to Sam. Two days later I took it back." · 11:20 Priya "Why?" · 11:26 You "It was going to land badly." 5 more moments in the transcript.

#### K-33 · What did Priya mean by cautious

:: User asks: "What did Priya mean by cautious?" · "Why did she say I hedge?" · "Am I too modest?"
:: Status: In prototype

> Priya wrote that you talk cautiously. She was not describing your manner; she was describing a habit in the answers themselves. You qualify a thing at the moment you say it. Quotes at 01:10, 06:15, 12:11, 25:04. 2 more moments in the transcript.

#### K-34 · Find the part on hard conversations

:: User asks: "Find the part on hard conversations" · "The disagreement with finance" · "Conflict with a peer"
:: Status: In prototype

> Priya asked you for a real hard conversation, and this is the exchange it turned into. Chapter 5 is built on the same thing. 31:15 Priya "Tell me about a disagreement with a peer." · 31:33 You "Finance and I disagreed about headcount…" · 33:40 You "It resolved when our director put us in a room…"

#### K-35 · The other themes

:: User asks: "What is my gap?" (gap) · "My Friday routine" (rhythm) · "Managing up" · "When did I change my mind?" (decision)
:: Status: In prototype

Same card, one lead each: *You named the gap before Priya did, and you brought an example to it.* · *One fixed hour a week, and an honest account of everything else moving.* · *You corrected yourself mid-answer here, which is the part Priya marked.* · *You changed a structural decision after listening, and you were clear about what changed it.*

#### K-36 · What changed between August and November

:: User asks: "What changed between August and November?" · "Compare both interviews"
:: Stage: Promoted
:: Response type: C9 with two columns
:: Status: In prototype

> Source **Both interviews, side by side**. You were asked the same question twice, 90 days apart. In August the gap was letting go of work. In November it is speed. That is the shape of the promotion. Column **August**: 41:03, 41:19. Column **November**: 01:05 Priya "90 days. Start with the thing you said your gap was." · 01:22 You "Letting go of work. It is better. Not fixed."

Footer **Open the November transcript**.

#### K-37 · Summarise this interview

:: User asks: "Summarise this interview" · "Transcript" · "What did I say in my interview?"
:: Status: In prototype

> Source **Your interviews**. Both interviews are transcribed and I can search either one. Ask me about a theme and I will bring you the lines rather than a summary.

Chips: *What did Priya mean by cautious?* · *Show me every moment I framed delegation as risk* · *What changed between August and November?*

### 4.6 Cohort and the weekly call

#### K-38 · What should I say on the call

:: Page: Cohort
:: User asks: "What should I say on the call?" · "What's Thursday about?" · "What should I bring?"
:: Stage: Enrolled
:: Response type: C4 Facts widget with button and chips
:: Status: In prototype

> Your next call is Thursday. Here is what it covers and what to bring. Title **Thursday 6:00 PM ET · 60 minutes**. Week 5 is on hard conversations. Bring the Sam handover from your notes. Three others flagged the same chapter.

Button **Open Cohort 41**. Chips: *Am I behind the others?* · *Can I message the whole cohort?*

#### K-39 · The call's logistics

:: Page: Cohort, Enrol
:: User asks: "What if I miss the call?" · "Is the call recorded?" · "What time is the call?" · "Which time zone?" · "How long is the call?"
:: Stage: Any
:: Response type: C4 Facts widget with two buttons
:: Status: In prototype

> Title **The weekly call**. **When** · Thursday, 6:00 PM ET, every week for 13 weeks · **Long** · 60 minutes, video, you and the other nine · **Missed** · tell your leader beforehand and it is fine. It is not recorded, so there is nothing to catch up on afterwards; ask on the board instead. Kicker: Times follow the time zone on your profile, which is Eastern. Reminders go out 24 hours and 1 hour before unless you have turned them off.

Buttons **Open Cohort 41** and ghost **Change your time zone**.

#### K-40 · Who leads this cohort

:: Page: Cohort
:: User asks: "Who leads this cohort?" · "Who is my leader?" · "Is the leader paid?" · "How do I contact my leader?"
:: Stage: Enrolled
:: Response type: C7 Person widget with two buttons
:: Status: In prototype

> Priya's photo, **Priya Nair**, "Cohort leader, Cohort 41 · leading since March 2024". She runs the Thursday call, reads your weekly tasks and writes the recommendation at day 90. She is also the agent who interviewed you and set your level at E3: the same person in two roles, which is common but not required. It is a **volunteer role**. Cohort leaders are unpaid; what they earn is the cohort-leader certification. Kicker: She can only lead cohorts below her own level, so she is always a step ahead of the ten of you.

Buttons **Open Cohort 41** and ghost **Message her**.

#### K-41 · Can I change cohort

:: Page: Enrol, Cohort
:: User asks: "Can I change cohort later?" · "Switch cohort" · "Join a later cohort"
:: Stage: Any
:: Response type: C3 Prose then C5 List widget with chips
:: Status: In prototype

> **Not once it has started.** Your cohort is ten people at the same level moving through the same 13 weeks together, and the group is a large part of what you are paying for, so it is assigned for you and it is fixed for the 90 days.

Widget **What can change**: Before your cohort starts, the support desk can move you to a later intake. Once it has started, a bad fortnight is something your leader absorbs rather than something you move cohort for. Chips: *What is the refund window?* · *What happens on the weekly call?*

#### K-42 · Can I pause

:: Page: Cohort, Coursework
:: User asks: "Can I pause?" · "Defer" · "Extension" · "Take a break" · "Drop out" · "Withdraw"
:: Stage: Enrolled
:: Response type: C5 List widget with button, then C10 Support hand-off
:: Status: In prototype

> Title **Pausing, or moving cohort**. A cohort is a fixed ten moving together for 90 days, with one live call a week. There is no self-service pause, because pausing means leaving the group you are in. Your cohort leader can carry you through a bad fortnight; that is what the flag on their dashboard is for, and it clears itself when you come back. Anything longer than that is a transfer to a later cohort, and the support desk decides those case by case. Kicker: **Tell your leader** first. Most of what people ask a pause for, a leader can just absorb.

Button **Message your leader**. Support card: Ask for *a transfer to a later cohort, and say which weeks you would miss*.

#### K-43 · Help me word a reply

:: Page: Messages
:: User asks: "Help me word a reply" · "Draft a reply to Priya" · "Reply to Priya"
:: Stage: Enrolled
:: Response type: C11 Draft offer, then the draft block on Messages
:: Status: In prototype

> Source **Drawn from her message and your chapter 4 note**. I can put a reply in the field for you. It picks up the handover she asked about and the thing you wrote in your notes. You can change every word of it before it goes.

Button **Draft the reply →**. On Messages the did bar reads **Tal drafted a reply to Priya** and the draft block holds: *Thursday works. I will bring the Sam handover, the one I took back after two days without telling him why. I have read the one-pager and the three sentences are the part I did not do.* with **Use this** · **Try again** · **Discard**.

#### K-44 · Turn my note into a reflection

:: Page: Chapter notes
:: User asks: "Turn my note into a reflection" · "Write up my note" · "Turn this into a reflection"
:: Stage: Enrolled
:: Response type: C11 Draft offer, then the draft block in the notes panel
:: Status: In prototype

> Source **Drawn from your note on chapter 4**. Your note has the event but not the shape the chapter asks for. I can restructure it into what you did, what was true, and what you will try, and put it in the notes panel as a draft.

Button **Write the reflection →**. The draft: *What I did: gave the vendor review to Sam, then took it back two days later and told him it was capacity. What was actually true: I could see the meeting going wrong and I did not want to own that. What I will try: say the worry out loud at the handover, and let the work stay handed over.*

#### K-45 · The consultant call

:: Page: Dashboard Consult
:: User asks: "What happens on the consultant call?" · "Who is Jordan?" · "Is the screening assessed?"
:: Stage: Consult
:: Response type: C3 Prose with chips
:: Status: In prototype

> Fifteen minutes with Jordan Blake, and nothing in it is assessed. He asks where you are now and what you want next, then points you at the agents whose range fits. There is nothing to prepare and it sets no level.

Chips: *How is that different from the agent interview?* · *What happens in the interview?*

### 4.7 Points

#### K-46 · How do I earn more points

:: Page: Achievements
:: User asks: "How do I earn more points?" · "What is the Bronze badge?" · "Does rank affect my level?"
:: Stage: Enrolled
:: Response type: C4 Facts widget with button and chips
:: Status: In prototype

> Points come from finishing chapters, turning up to calls and being useful on the board. Title **Fastest points from here**. **+25** · each chapter you finish · **+50** · each cohort call you attend · **+10** · a post on the cohort board · **+20** · someone reacts to your post. Kicker: You are on 1,095. Bronze lands at 2,500.

Button **Open Achievements**. Chips: *Does rank affect my level?* · *What is the Get Involved badge?* Before enrolling the widget is titled **Points** with the kicker *Points start when your cohort does.*

### 4.8 Money

#### K-47 · How much does it cost

:: Page: Enrol, Payments
:: User asks: "How much does it cost?" · "What does the course fee cover?" · "Is there a payment plan?" · "Any discount?"
:: Stage: Any
:: Response type: C4 Facts widget, must-act, with button
:: Status: In prototype

> Title **What the 90 days cost**. **$95** · the interview that sets your level, paid to the agent · **$690** · the Explorer E3 course · **−$95** · your interview, credited against it · **$595** · due when you enrol. Kicker: **One payment.** Nothing recurs, no card is kept on file by us, and the re-interview at day 91 is included. The agent's fee is theirs and it varies, $80 to $110 across the twenty-four.

Button **Open Enrol**.

#### K-48 · Does the re-interview cost

:: Page: Course Progress, Interviews
:: User asks: "Does the re-interview cost?" · "Is the re-interview included?" · "Who pays for the re-interview?"
:: Stage: Any
:: Response type: C3 Prose with chips
:: Status: In prototype

> The re-interview is **included**. You paid an agent $95 to set your level at the start; the one at day 91 that decides whether you move up is part of the $690 course fee, and there is nothing further to pay for it.

Chips: *What happens at the re-interview?* · *What would move me to E4?*

#### K-49 · Is the fee refundable

:: Page: Enrol, Payments
:: User asks: "Is the fee refundable?" · "What is the refund window?" · "Cancellation policy" · "Money back"
:: Stage: Any
:: Response type: C4 Facts widget, then C10 Support hand-off
:: Status: In prototype

> Title **The two refund windows**. **Interview** · free to move or cancel up to 24 hours before. Inside 24 hours the fee is not refundable. · **Course** · full refund up to 7 days after your cohort starts, as long as you have not finished more than one chapter. Kicker: Both are decided by **the support desk**, not by me. I can tell you which window you are in, and they are the ones who action it.

Support card: Ask for *a refund, and say which of the two windows it falls in*.

#### K-50 · Is my card stored

:: Page: Payments, Payment
:: User asks: "Is my card stored?" · "Do you keep my card?" · "Is my payment data safe?"
:: Stage: Any
:: Response type: C5 List widget with button
:: Status: In prototype

> Title **Where your card actually is**. The number goes straight to our payment processor. It never reaches a TalentNext server. We keep the brand and the last four digits, so a saved card is something you can recognise and choose again, not something we could charge on our own. You can add another or remove any of them from Payments. Kicker: I **cannot see** any of it. Card details are on the list of things I have never been shown.

Button **Open Payments**.

#### K-51 · What have I paid

:: Page: Payments
:: User asks: "What have I paid so far?" · "Can I get a receipt?" · "Payment history" · "Change my card"
:: Stage: Any
:: Response type: C5 List widget with two buttons (a "cannot see" decline)
:: Status: In prototype

> Title **Your payments, and why I am not reading them**. Payments has every charge with its date, the card it went to, and a Receipt button on each row. Billing is on the short list of things I have never been shown, along with your messages with Priya and anything said on a cohort call. Kicker: So I **cannot tell you the figure**. The page can, and it is the same tap as asking me.

Buttons **Open Payments** and ghost **See what I do hold**.

#### K-52 · I was charged twice

:: Page: Payments
:: User asks: "I was charged twice" · "Wrong amount" · "Dispute a charge" · "Refund my money"
:: Stage: Any
:: Response type: C3 Prose then C10 Support hand-off with chips
:: Status: In prototype

> That one **needs a person**, and quickly. I cannot see charges and I cannot reverse one, so there is nothing I can check first that would save you the message.

Support card: Ask for *a charge to be checked. Give them the amount, the date and the last four digits, and attach the receipt from Payments*. Chips: *What is the refund window?* · *Is my card stored?*

### 4.9 Tal itself and privacy

#### K-53 · What can you do

:: Page: Any
:: User asks: "What can you help me with?" · "What do you do?" · "Who are you?" · "Are you a bot?"
:: Stage: Any
:: Response type: C4 Facts widget with two buttons
:: Status: In prototype

> Title **What I can do**. **Course** · what is in a chapter, what your assessments measured, where you are against the other nine, and what to do this week · **Level** · the Explorer track, what E3 means, and what would move you up · **Interviews** · book one, prepare for one, practise against the real scenarios from yours, and search the transcript of one you have done · **Cohort** · the Thursday call, who leads it, and the board · **Me** · everything I hold about you, where each line came from, and how to correct it or switch me off. Kicker: What I will not do is **guess**. I cannot see your payments, your one-to-one messages with Priya, or anything said on a cohort call, and where I do not have an answer I will say so and give you the support desk rather than invent one.

Buttons **See what I hold about you** and ghost **What should I do next?** Before enrolling the Course row reads *what the 90 days are, what they ask of you each week, and what they cost* and the Level row *what the interview decides*.

#### K-54 · What can you see about me

:: Page: Profile
:: User asks: "What can you see about me?" · "How do I turn you off?" · "Can you see my messages?" · "Stop reading my notes"
:: Stage: Any
:: Response type: C4 Facts widget with two buttons
:: Status: In prototype

> Title **What I can and cannot see**. **I see** · your course progress, your chapter notes, your points, your interview transcripts and your report · **I never** · your messages with Priya; anything said on a cohort call; your card details and billing history. Kicker: 7 things are held about you right now and every one of them opens the thing it came from. Mark a line wrong and I stop using it; forget it and it is gone. Profile is where you pause me altogether. Nothing breaks, the pages just stop carrying my summaries.

Buttons **See everything I hold** and ghost **Open Profile**.

#### K-55 · What do you know about me

:: Page: Profile, memory
:: User asks: "What do you know about me?" · "Your memory" · "What do you remember about me?"
:: Stage: Any
:: Response type: C9 Generated card with three quote rows and a footer link
:: Status: In prototype

> Source **7 things, all sourced**. Everything I hold about you came from something you can open: an interview line, your report, your notes, or your course activity. Nothing came from your messages with Priya. Rows: 13:20 · Level interview · "You treat handing work over as a risk you are still carrying." · 04:02 · Level interview · "You change your mind when you are in the room, and not when you are sent a document." · 06:15 · Level interview · "You qualify your own answers as you give them."

Footer **See all of it, and correct it**.

#### K-56 · Delete my account

:: Page: Profile
:: User asks: "Delete my account" · "Close my account" · "Download my data"
:: Stage: Any
:: Response type: C5 List widget with button
:: Status: In prototype

> Title **Closing your account**. It removes your profile, your notes and your interview recordings. Certificates and signed summaries you have already earned stay valid and stay downloadable. Profile also holds "download everything we hold", which is worth doing first. Kicker: The control is on Profile, under Closing your account, and it asks you to confirm. I **cannot do it for you** and I would not want to be the one that could.

Button **Open Profile**.

### 4.10 Technical faults

#### K-57 · Something is broken

:: Page: Any
:: User asks: "The video won't play" · "My progress did not save" · "The page is frozen"
:: Stage: Any
:: Response type: C3 Prose, C5 List widget, then C10 Support hand-off
:: Status: In prototype

> That is not something I can see from in here. I have your course and your interviews, not your browser or the video player.

Widget **Worth trying once**: **Reload the page.** Coursework runs inside LightspeedVT, and it is usually the frame rather than the course. If it is the same on a second browser, it is our end, not yours. Support card: Ask for *the page you were on, what you were doing and which browser. A screenshot saves a round trip*.

Two branches. Verification email: *Give it a minute and then look in your spam folder; the sender is hello@talentnext.com. If it is not there after five minutes, the address on the account is usually the reason, and support can check it and resend.* Sign-in: *I cannot see anything to do with signing in; I only exist once you are already inside. Reset the password from the log-in screen first; that clears most of these, and it does not touch your course record.* Each with its own support card.

## 5. Refusals and fallbacks

**Three kinds of no**, each with its own shape.

#### K-58 · A human decision (C10)

Refunds, disputed charges, closed accounts, level appeals, a date that has to move, transfers. Tal states the rule, then hands over. The support card: title **TalentNext support**, rows **Ask for** · the specific thing to say · **Email** · support@talentnext.com · **Phone** · (555) 123-4567 · **Hours** · Mon to Fri, 9:00 AM to 6:00 PM ET. Kicker: *They answer inside one working day. Quote your cohort number, Cohort 41.*

#### K-59 · Something Tal cannot see

The billing ledger, the one-to-one thread with Priya, the cohort calls. Declined in the product's own words with the page pointed at: K-50, K-51, K-54. Tal never reads the ledger and never reports a figure from it.

#### K-60 · Not the product at all (C3)

:: User asks: "Get me a job" · "Write my performance review" · "Tell me a joke" · "What do you think of my boss?" · "Should I quit?"
:: Response type: C3 Prose with two chips, no support number
:: Status: In prototype

Jobs: *TalentNext does not place people. It assesses how you operate and gives you a level and a record you can show; what you do with that is yours. There is no job board in here and I cannot introduce you to anyone.* Chips: *What is in the 90-day summary?* · *What do I have at the end?*

Performance review: *Not that one. I write about your work on this course: a reply in the messages thread, or your chapter note turned into a proper reflection. A review of somebody on your team is a judgement I have no part of and a document I have never seen the shape of.* Chips: *Help me word a reply* · *Turn my note into a reflection*

Off-topic: *That is outside what I am for. I am the assistant inside your course: the 13 chapters, your level, your interviews, your cohort and what I hold about you. I am not the one to ask about your job or the people in it, and I would rather say so than have an opinion.* Chips: *What should I do next?* · *How am I doing overall?*

#### K-61 · The last resort

:: User asks: Anything no route recognises
:: Response type: C3 Prose then C10 Support hand-off, then the page's chips
:: Status: In prototype

> I **do not have an answer** for that one, and I would rather say so than guess at it. Anyone on the support desk can pick it up.

Support card with Ask for *this question, worded exactly as you asked me; they will have your account open*. Kicker *Here is what I can answer from where you are.* and the page's suggested questions as chips. During onboarding the kicker and chips are dropped and the card stands alone.

## 6. State variation at a glance

| Question | New | Booked | Assessed | Week 1 | Day 34 | Day 90 | Promoted |
|---|---|---|---|---|---|---|---|
| What should I do next | Book the interview | Spend ten minutes preparing | Enrol in E3 | Finish chapter 1 | Finish chapter 4 | Book the re-interview | Enrol in E4 |
| How am I doing | Prose: not on a course yet | same | same | Widget, nothing assessed | Widget 5/13, 75% | Widget 13/13, 83% | You moved to E4 |
| Am I behind | Prose: no pace yet | same | same | Week 1 widget | Day 34 widget | Not behind, re-interview to book | same |
| What would move me up | Prose: not on the ladder | same | Widget, no average line | Widget | Widget with average | Widget with 83% | E5 is the top |
| When does it end | Ninety days from the start | same | same | Day 4, 86 to go | Day 34, 56 to go | Day 90 | It is finished |
| Points | Start when your cohort does | same | same | 985 | 1,095 | 2,955 | 3,205 |
| Ladder | No rung lit | same | E3 lit | E3 | E3 | E3 | E4 lit |
| Popover action on the track phrase | Book with Priya | See the booking | See your interviews | same | same | same | same |
| Transcript answers | none | none | Level interview | same | same | same | Re-interview when open |
| Booking flow | Advances to Booked | Records the booking | | | | Records the re-interview | |

After onboarding, the New dashboard quotes the candidate's own words and the recommended agent follows the answer to question 3. After a booking in the chat, every summary, plate, journey step and receipt re-reads the booking. The memory count in K-54 falls as lines are forgotten. The scenes kicker follows how many are kept.

## 7. Gaps found while reading the prototype

- ~~**Payments summary recites the ledger**~~ **Fixed in prototype 8 Sep** (`PAGESUM.billing`, ai6.js): the band now names the cards on file and the refund windows ("Your saved Visa, Mastercard and Amex cards are on file… A course and an interview have **different refund windows**…") and leaves the charge to the Previous Transactions table, per 3.9. The `$490 charge` and `Explorer Track E2` popovers went with the phrases; a `refund` popover replaces them (routes to `wRefund`). Now consistent with `NEVER[2]`, `wLedger` and the dock placeholder.
- ~~**Interviews Booked summary says "ready to join"**~~ **Fixed in prototype 8 Sep** (`PAGESUM.interviews`, ai6.js): now "…is scheduled for Thursday, August 20 at 6:30 PM ET" — the booking's real time, matching the dashboard summary. The `data-sum="join"` phrase is gone; `SUMDROP.join` stays as the designed final-minute popover, dormant until a live gate triggers it. The call row's "in 1 minute" (the Join-gate demo) is unchanged.
- ~~**The lowest-assessment kicker says 50% is above the cohort average of 79%.**~~ **Fixed in prototype 8 Sep** (`wLowest`, ai8.js): now "50% is below the cohort average and well below your own… Finishing it properly is worth more than any other hour this week." Matches K-11.
- **"Practice" and "mock" match the practice offer before the preparation checklist**, so *Run a mock interview with me* opens the practice offer and *Prepare me* opens the checklist. Both are valid; design both.
- ~~**"Start the practice run" has no destination** in the preparation checklist.~~ **Fixed in prototype 8 Sep** (`wPrep`, views.js): the button now carries `data-go="rp"` and opens Practice, as K-26/K-27 do.
- **Enrolled dashboard highlights are not pressable** although highlighted. Either wire them to popovers (chapter, cohort pace, weekly target) or drop the highlight, per the rule that a highlight must say something when pressed.
- **A finding-another-agent skeleton state** exists in the recommendation block with no trigger. It can be deleted or given a "Show me another" control.
- **The retired side panel and floating action button** are still emitted and hidden. Do not design for them.
