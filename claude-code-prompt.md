# TalentNext prototype — add the assistant "Tal", make the portal proactive, and build onboarding

You are editing a single file: `tn-portals.html` (~2.2 MB), in this folder. It is a black-and-white
**wireframe** prototype of a two-portal product for TalentNext / Next In Leadership — a Candidate
portal and an Agent portal. It is shown to clients as a clickable prototype, not a high-fidelity
design.

Read the file's structure before changing anything. Do not reformat it, do not split it into multiple
files, and do not add build tooling. It must remain one openable HTML file.

Do the work in two parts, in this order: **Part 1** (the assistant and proactive surfaces), then
**Part 2** (onboarding), because Part 2 ends by handing the candidate into screens Part 1 rebuilds.

---

## How the file is built

- Vanilla JS. Two state objects: `S` (candidate) and `G` (agent), persisted to `localStorage`.
- Event delegation: clickable elements carry `data-act="..."` (candidate) or `data-ag="..."` (agent).
  Candidate handlers live on the `A` object and are dispatched by name.
- Candidate screens are functions on `VIEWS` (e.g. `VIEWS.level`, `VIEWS.account`, `VIEWS.seam`),
  rendered into `#view`. Agent screens are functions on `V`, rendered into `#agView`.
- Six candidate prototype states, switched with `data-act="jump:<state>"`:
  `new` (just joined), `booked` (interview booked), `week1`, `mid` (day 34), `end` (day 88),
  `next` (levelled, not enrolled).
- Full-screen surfaces (session call, chapter player, video playback) are built by `sesShell()` and
  live **outside** the `.ui` wrapper, so `.ui`-scoped CSS does not reach them. The same is true of the
  modal layer `#mk` and the right-hand slider `#bkWrap`.
- Screenshots of the third-party course platform are inlined as base64 on `window.LSVT` and rendered
  through `shotFrame()`.

## Visual rules — do not break these

- Black and white only. **No gradients.** No grey fills as decoration: use black on white, or white on
  black. Where two blocks would otherwise merge into the page, give them an outline; use a very light
  grey tone only where an outline is clearly wrong. Black fill is reserved for primary actions.
- Placeholder imagery is a wireframe crossed box. The only real images in the file are the course
  platform screenshots, which appear only on the internal Integration notes screen and in the chapter
  player.
- Dashboard page background is `#f7f7f7`. Side nav is solid black; hover is `#ffffff` at 5% opacity.
- Every modal is centred on screen. Payment and the interview transcript open in the right-hand slider
  (`#bkWrap`), never as modals.
- Breadcrumbs on every sub-page in both portals. Steppers are centred, not full width.
- When the assistant panel is collapsed, the content container takes the full width.

## Apply every change universally

If a component you change exists on another screen or in another prototype state, change it there
too. Assume it does until you have grepped and proved it doesn't. This is a standing client
instruction and the most common source of rejected work on this file.

## Product constraints — settled facts, not preferences

1. **The course platform hand-off is invisible to candidates.** Coursework runs on a third-party
   platform (LightSpeed VT), but no candidate-facing screen may mention LightSpeed, SAML, SSO, or
   their sign-up route. All integration facts live on one internal-only screen, `VIEWS.seam`,
   reachable via `data-act="nav:seam"` and labelled "Integration notes".

2. **No comparisons between named participants may be shown to a candidate.** "You're behind the pace
   for week 6" is allowed. "You're behind Ana and Marcus" is not. This does not apply to the agent
   portal, where naming members is the point.

3. **What data exists.** Anything the assistant says must be groundable in one of these:
   - *Confirmed from the course platform:* chapter and course status, progress %, assessment score,
     pass mark, retake count, completion dates.
   - *Ours already:* five quiz dimensions (Decisiveness, Delegation, Directness, Coaching, Composure),
     the agent's written interview assessment, booking history, payments, chapter notes.
   - *Not confirmed — never build a claim on these:* time spent per chapter, which specific answers
     were wrong, depth of interaction inside a video.
   - *Does not exist:* transcripts. The course platform performs no speech-to-text. The interview call
     is ours and could be transcribed, but no such pipeline is built.

4. **One person, one record.** A candidate who later becomes an agent keeps the same participant ID.
   Nothing may break if the same human holds both roles.

---

# Part 1 — The assistant "Tal" and the proactive interface

The portal currently has a generic AI chat panel bolted onto conventional module screens. Convert it
to a **proactive, intent-based** interface fronted by a named assistant.

The test to apply to each screen: *if you removed the assistant entirely, would the screen still work
exactly as before?* If yes, the work isn't done — the assistant's read should be the primary content
and the old module should become the evidence beneath it.

**The assistant's name is Tal.** Rename the chat panel throughout the candidate portal: panel header,
collapsed and expanded toggles, tooltips, empty state, and every "AI assistant" or "Ask AI" string.
Tal speaks in the first person — "I'd start Chapter 7 before Friday" — never as "the AI".

**Tal proposes; the candidate confirms.** Tal may prepare an action — hold a slot with an agent, queue
the next chapter, pre-select a saved card — and the candidate commits with one tap. Tal never books,
pays, or enrols on its own. Build every Tal action as a proposal with an explicit confirm.

**Tal does not exist before the account exists.** Tal is named for the first time on the consent screen
at step 10, because that screen is where the candidate agrees to what Tal will do with their data. Tal
first *speaks* on the ready-state dashboard at step 11. Nothing earlier mentions it. See Part 2.

### 1.1 Dashboard

This is the only screen a candidate opens without an intention already formed, so it is where
proactivity earns its keep. At the top of the candidate dashboard, in **all six states**, add Tal's
opening read: one or two sentences on the single thing that matters today, followed by two or three
**intent chips** that are actions, not navigation.

Tailor each state to data that state actually has. In `new` there is no progress yet, so the read is
about booking the interview. In `mid` it is pace against the 90-day window. In `end` it is the
completion summary. In `next` it is what enrolling unlocks.

Keep the existing dashboard cards below it. Do not delete the "See what's next in this course" block
or the course outline block.

### 1.2 Agent cards — invert them

The candidate currently sees a list of agents and picks one. Change it so Tal surfaces **one
recommended agent**, with the reasoning as the card's main content, grounded in real data — for
example, "your quiz put Delegation at 41, and Dana's last four cohorts moved that dimension most".
Move the remaining agents behind a **"See other agents"** control.

Add a small Tal affordance on every agent card that opens the chat panel already scoped to that agent,
so the candidate can ask about them before booking.

### 1.3 Course enrolment

Do not write "this course was chosen for you". There is one course path, so that copy would be false.
What is true is the mapping from quiz dimensions to chapters: have Tal name the specific chapters that
address the candidate's two lowest dimensions. Add the same Tal affordance to open a discussion about
the course.

### 1.4 My Level

The screen currently shows a rose chart and five dials and leaves the candidate to interpret them. Put
Tal's two-sentence interpretation at the top, and let the charts sit beneath it as evidence.

Do not change the underlying numbers, the per-state row ordering, or the two-column "From your
interview" / "From your quiz" arrangement. Those were specified per state by the client and must not
merge.

### 1.5 Cohort and members

Add Tal's read on the candidate's own pace and what to do next. It must not name, rank, or imply a
comparison with another participant — see constraint 2.

### 1.6 Interview transcript

The transcript opens in the right-hand slider. Add a short Tal summary at the top of it. On the
internal Integration notes screen, record that this depends on a speech-to-text pipeline that does not
exist yet — see constraint 3. Do not surface that caveat to the candidate.

### 1.7 Relative time on every scheduled thing

The prototype shows absolute times only — "Thursday · 18:00" — and never how far away they are. Add a
relative label beside the absolute one everywhere a future scheduled item appears: the next cohort
call, a booked interview, an upcoming session. Format: `Thursday · 18:00 · in 2 days`.

Apply it universally — dashboard, cohort screen, booking confirmation, session lists, and the agent
portal's equivalents. Derive it from the same clock the booking date strip (`bkDays()`) already uses,
so the two can never disagree. Where a chapter cannot be continued yet because the platform enforces a
minimum time on the previous one, say when it can.

### 1.8 Internal Integration notes screen

Add a section describing **what Tal can and cannot ground its statements in**, using the four tiers in
constraint 3: confirmed platform fields, our own data, unconfirmed fields, and the absence of
transcripts. This is the screen the team uses to defend the design in front of the client, so be
specific, and attribute claims to their source where known — the course platform's CTO, Jason Straub,
or their support documentation.

---

# Part 2 — Candidate onboarding

The candidate portal currently begins at the "Just joined" state (`jump:new`) — someone who already has
an account and is about to book an interview. Everything before that is missing. Build it.

Onboarding runs in three stages and eleven steps. The step numbers below are the client's own and must
be preserved in any internal labelling, so the prototype maps onto their flow document.

## What is out of scope

Steps 1 to 3 are not built: the candidate arriving from a marketing link, the Next In Leadership
landing page, and the leadership quiz itself (12–13 behavioural questions, one per screen). Do not
build the quiz.

**Our prototype starts the moment the quiz has been taken**, at step 4, and ends at the boundary where
the interview marketplace begins.

Also out of scope, but shown as a branch: the **employer-sponsored** path at step 8. It sits outside
MVP — it requires an org hierarchy of parent, child and franchise accounts, billing to the employer,
and employer visibility defaulted off. Build it as a labelled dead-end branch, not a working path.

## Stage 1 — Anonymous: verification and result. No account exists yet.

Nothing in Stage 1 may reference AI, Tal, scoring, models or algorithms. The candidate is anonymous,
uncommitted, and the client's rule is that AI stays invisible here.

**Step 4 — Contact capture.** First name, last name, email, mobile number. **All four are required
before any result is shown.** The mobile number is mandatory by deliberate decision: emails are trivial
to fabricate, phone numbers are not. Behind the scenes a lead is created in the pipeline and the phone
is checked against existing records — put that on the internal notes screen, not on this screen.

**Step 4a — Phone verification gate.** A one-time-code screen. Until the number is validated the
candidate is **blocked**: no result, no account, no progress. Build the blocked state as a real screen
with resend and change-the-number routes. This gate is the reason the result appears after verification
rather than before.

**Step 5 — Result reveal.** Their **bucket** — Explorer, Builder or Trailblazer — framed as a narrative,
not a score. No numbers, no dimension charts, no mention of how it was derived.

## Stage 2 — The conversion decision

**The "wants to go further?" branch.** A candidate can stop here and keep their bucket, remaining a
nurture lead. Build this exit as a labelled screen so it can be demonstrated.

**Step 6 — Bucket-specific offer page.** Their track explained, course options with prices, and the
available talent agents with their own rates. The course catalogue is filtered by bucket and the agent
roster carries rankings and fees. This is the first screen where money appears.

**The "creates an account?" branch.** Declining returns them to nurture with the result retained and no
account created — build that exit as a labelled screen too. Accepting moves them to Stage 3.

## Stage 3 — Account creation and profile

**Step 7 — Account creation.** Credentials set, terms and privacy accepted. This is the first point of
real commitment in the whole product. Build it with an email-and-password form, and note on the
internal notes screen that the auth method is still unspecified — password, magic link or social — and
that no age gate has been defined even though interviews are video-recorded.

Architecturally, Next In Leadership is the parent account and TalentNext is provisioned as a child, so
one login roams all NIL properties by SSO. The candidate must never see that seam; record it on the
internal notes screen only.

**Step 8 — Origin capture.** How they came in: individual, employer-sponsored, Signal, or Filter Go.
Where Signal or Filter Go applies, the account links to an existing user record there. The sponsored
selection leads to the out-of-MVP branch described above.

**Step 9 — Profile completion.** Location, industry, years of experience, education, current role,
career interest. **Location is load-bearing** — geolocation is central to placement matching — so give
it prominence rather than burying it in a list. All of it is self-reported and unverified.

**Step 10 — Consent capture.** The most significant screen in the flow and the least defined. It covers
four things: video recording, AI analysis, SCENES clips being shown to employers, and profile
visibility. Build each as a **separately toggleable consent**, never one blanket checkbox — these are
three distinct processing purposes and granular consent is likely to be required.

This screen is where the product's promise that the candidate owns their own data is actually
established, so give it real weight in the layout rather than treating it as a legal formality.

**This is where Tal is named for the first time in the product.** The second consent is what the
candidate agrees to before Tal can say anything about them, so name it plainly rather than hiding it
behind "AI analysis". Use this copy:

1. **Recording your interview** — "Your interview is recorded so your agent can assess it, and so you
   can watch it back later." *Required to continue.*
2. **Letting Tal read your results** — "Tal is your assistant here. It reads your quiz results, your
   agent's assessment and your course progress, so it can tell you what to do next instead of leaving
   you to work it out." *Required to continue.*
3. **Showing clips to employers** — "Short moments from your interview can be shown to employers
   looking for someone at your level. You choose this, and you can change it whenever you like."
   *Optional, off by default.*
4. **Being visible to employers** — "Employers can find your profile and see your level." *Optional,
   off by default.*

Treat the copy above as placeholder wording with the right structure. Record on the internal notes
screen that the final wording, and which consents are genuinely mandatory, are undefined — and that
making consent 2 mandatory is a prototype assumption, since a candidate who declines it gets a product
with no assistant at all.

**Step 11 — Ready state.** The candidate dashboard. It shows their bucket, their track, and **a single
next step: book your first interview.** Their state is "account holder, pre-interview" and they are not
yet visible to employers.

**This is where Tal first speaks.** From here on, Part 1 applies: the ready-state dashboard is the
existing `jump:new` dashboard with Tal's read at the top.

Tal's opening read has almost no data to work with — there is a bucket, and nothing else. No interview
has happened, no course exists, no progress exists. So it must be short, must not pretend to know more
than it does, and must not show a number, since the candidate has never been shown one. Use this copy
for the Builder bucket, and write the Explorer and Trailblazer variants to match:

> **Tal** — "You came out a Builder: leading well already, but not yet tested at the next level. One
> thing moves you forward from here, and it's the interview. I'd get it booked this week."

Intent chips beneath it, in this order:

- **Book my interview** — goes straight into the existing booking flow.
- **Who should interview me?** — opens the agent recommendation from section 1.2.
- **What happens in an interview?** — opens the Tal panel with that question already asked.

Do not add a fourth chip and do not let Tal reference quiz dimensions here. The dimension-level
reasoning belongs in the agent recommendation, one click later, where it has something to justify.

## The boundary

Onboarding ends here and the interview marketplace begins: browse agents, choose an interviewer, pay,
book. That flow already exists in the prototype. Step 11 must hand straight into it — do not build a
"you're all set" screen, and do not duplicate the booking flow.

## Bucket versus level

The bucket is the pre-interview label from the quiz. The assessed level, which an agent assigns after
the interview, is separate and later. Use Explorer / Builder / Trailblazer in onboarding and on the
dashboard for the two pre-interview states (`new` and `booked`) only. Leave the existing My Level screen
and all existing level naming exactly as they are. The bucket never appears on a screen belonging to an
assessed candidate.

## Open items to record on the internal Integration notes screen

Add each as an open question. Do not invent an answer on any candidate screen.

- **Agent attribution.** If a candidate arrives on a talent agent's own referral link, is that agent
  credited on a later placement? Undefined.
- **Quiz save and resume.** Never discussed. A half-finished quiz has no defined behaviour.
- **Verification limits.** Attempt limit, lockout behaviour and the support fallback are all undefined.
- **Pre-signup visibility.** How much of step 6 is visible before an account exists — prices, agent
  names, rates — was never discussed.
- **Auth method and age gate.** Password, magic link or social is unspecified; no age gate is defined
  despite video-recorded interviews.
- **Origin question set.** The full set of options at step 8 is still to be agreed, pending Umair and
  Derek.
- **Mandatory profile fields.** Which of step 9's fields are required is undefined, and everything is
  self-reported and unverified.
- **Consent.** Three distinct processing purposes, entirely undefined across three client calls. Note
  that the prototype's mandatory/optional split is an assumption.
- Also note that the quiz scoring is deterministic today and is being rebuilt as AI-driven, so the
  bucket a candidate receives may change behaviour later.

## Wiring it in

- Make the flow demoable: add an entry to the prototype-state switcher alongside the existing six —
  `data-act="jump:signup"` — landing on step 4.
- Build steps 4 to 10 as a stepped flow using the existing centred stepper, with a breadcrumb on each.
- Every branch and exit must be reachable and labelled: not-verified blocked, exits with a result,
  back to nurture, sponsored out-of-MVP.
- Completing step 11 must leave `S` in exactly the state `jump:new` produces, so the candidate lands on
  the current "Just joined" dashboard with no discontinuity. Verify by comparing both paths.
- Persist partial progress in `S` the way the rest of the prototype persists state, so a candidate can
  resume mid-flow.
- Also build a returning **sign-in** screen: email and password, forgot password, and a route that lands
  an abandoned candidate back on the step they left.

## Error states to build

A stale or missing hand-off from the quiz, an email that already has an account, a password that fails
policy, and an expired verification code.

---

# How to verify

There is no browser available. Verify with jsdom, and do it for every change.

Load the file with `runScripts:'dangerously'`, wait about 500 ms for initial render, click through
`data-act` handlers, and assert on DOM content. Write the harnesses as `.mjs` files in `.build/` and run
them with `node`.

Four traps that have caused silent false passes in this file:

- **Assert on the right container.** `#view` for candidate screens, `#agView` for agent screens. Reading
  the wrong one makes assertions pass trivially.
- **Catch `jsdomError` and fail on it.** One stray backtick in a template literal kills all rendering,
  and content assertions then fail in confusing ways rather than pointing at the syntax error.
- **CSS overrides must be appended to the last `</style>` block** (split on the final one), or the
  cascade drops them.
- **Overlay surfaces sit outside `.ui`.** `#ses`, `#mk` and `#bkWrap` do not receive `.ui`-scoped
  utility classes like `.f1`; they need their own rules.

Assertions this work must pass:

- Every candidate state's dashboard shows Tal's read and at least two intent chips.
- Tal's recommended agent appears with reasoning; the other agents sit behind "See other agents".
- Every Tal action is a proposal with an explicit confirm; none commits a booking, payment or enrolment
  directly.
- No candidate screen anywhere contains "lightspeed", "SAML", "Service Provider", or "Join Now".
- No candidate screen names another participant in a comparison.
- Steps 4, 4a, 5 and 6 contain none of: "AI", "Tal", "score", "algorithm", "model".
- The result reveal at step 5 shows a bucket name and no numeric score.
- The verification gate blocks progress: from step 4a, without verifying, neither step 5 nor step 6 is
  reachable.
- Step 10 exposes four independently toggleable consents, names Tal in the second one, and blocks
  continuing until consents 1 and 2 are given while consents 3 and 4 start off.
- Steps 7, 8 and 9 do not mention Tal — it is named at step 10 and speaks first at step 11.
- Step 11 shows Tal's read, three intent chips, no numeric score, and no quiz dimension names.
- Step 9 collects location, and the field is visually prominent.
- All four branch exits are reachable and labelled.
- Onboarding ends with `S` equivalent to `jump:new`, and step 11 hands into the existing booking flow
  rather than a new one.
- The quiz was not built anywhere.

# How to work

- Patch `tn-portals.html` in place with Python string replacements that **assert** their anchor matched
  exactly once, so a stale anchor fails loudly instead of silently doing nothing.
- Keep patch scripts and harnesses in `.build/` — it persists. `/tmp` does not.
- After each change that passes: `cp tn-portals.html .build/bk-$(date +%m%d-%H%M).html`.
- Work in a few large patches rather than many small ones. Speed matters on this project.
