# Handoff prompt — add the AI assistant "Tal" to the TalentNext candidate portal

Paste everything below the line into Claude Code.

---

## What you're working on

A single self-contained HTML prototype at `tn-portals.html` (~2.2 MB, in this folder). It is a
black-and-white **wireframe** prototype of a two-portal product for TalentNext / Next In Leadership:
a **Candidate portal** and an **Agent portal**. It is shown to clients (Derek and Umair) as a
clickable prototype, not a high-fidelity design.

Read the file's structure before changing anything. Do not reformat it, do not split it into
multiple files, and do not add build tooling. It must stay one openable HTML file.

### How the file is built

- Vanilla JS. Two state objects: `S` (candidate) and `G` (agent), persisted to `localStorage`.
- Event delegation: clickable things carry `data-act="..."` (candidate) or `data-ag="..."` (agent).
  Handlers live in the `A` object (candidate actions) and are dispatched by name.
- Candidate screens are functions on `VIEWS` (e.g. `VIEWS.account`, `VIEWS.level`, `VIEWS.seam`),
  rendered into `#view`. Agent screens are functions on `V`, rendered into `#agView`.
- Six candidate prototype states, switched with `data-act="jump:<state>"`:
  `new` (just joined), `booked` (interview booked), `week1`, `mid` (day 34), `end` (day 88),
  `next` (levelled, not enrolled).
- Full-screen surfaces (session call, chapter player, video playback) are built by `sesShell()` and
  live **outside** the `.ui` wrapper, so `.ui`-scoped CSS does not reach them. Same for the modal
  layer `#mk` and the right-hand slider `#bkWrap`.
- LightSpeed screenshots are inlined as base64 on `window.LSVT` (`login`, `player_video`,
  `player_html`, `player_intro`, `player_q`, `player_done`, `player_thumb`, `hooks`, …) and rendered
  through `shotFrame()`.

### Hard visual rules — do not break these

- Black and white only. **No gradients.** No grey fills as decoration: use black-on-white or
  white-on-black. Where two blocks would otherwise merge into the page, give them an outline/stroke,
  or a very light grey tone only if an outline is wrong. Black fill is reserved for primary actions.
- Placeholder imagery is a wireframe crossed box. The only real images are the inlined LightSpeed
  screenshots, which appear **only** on the internal Integration notes screen and in the chapter
  player frames.
- Dashboard page background is `#f7f7f7`. Side nav is solid black, hover is `#ffffff` at 5% opacity.
- Every modal is centred on screen. Payment and the interview transcript open in the **right-hand
  slider** (`#bkWrap`), not as modals.
- Breadcrumbs on every sub-page in both portals.
- Steppers are centred, not full width.
- When the assistant panel is collapsed, the content container takes the full width.

### Standing instruction from the client

**Any change must be applied universally.** If the component you are editing exists on another
screen or in another prototype state, change it there too. Assume it does until you have grepped and
proved it doesn't.

## Product constraints you must respect

1. **The LightSpeed hand-off is invisible to candidates.** Coursework runs on LightSpeed VT's
   platform, but no candidate-facing screen may mention LightSpeed, SAML, SSO, or their sign-up
   route. All integration facts live on one internal-only screen, `VIEWS.seam`
   (`data-act="nav:seam"`), labelled "Integration notes".
2. **No comparisons between named participants** may be shown to a candidate. Umair's requirements
   forbid it. "You're behind the pace for week 6" is fine. "You're behind Ana and Marcus" is not.
   This restriction does **not** apply to the agent portal.
3. **What data actually exists.** Anything the assistant says must be groundable in:
   - *Confirmed from LightSpeed:* chapter and course status, progress %, assessment score, pass mark,
     retake count (they call these "revolutions"), completion dates.
   - *Ours already:* quiz dimension scores (Decisiveness, Delegation, Directness, Coaching,
     Composure), the agent's written interview assessment, booking history, payments, chapter notes.
   - *Unconfirmed — do not build a claim on these:* time spent per chapter, which specific answers
     were wrong, depth of interaction inside a video.
   - *Does not exist:* transcripts. LightSpeed does no speech-to-text at all. The interview call is
     ours, so it could be transcribed, but that pipeline is not scoped or costed.

## The change to make

Introduce a named AI assistant called **Tal** and convert the candidate portal from
"modules with an AI panel bolted on" to a **proactive, intent-based** interface. The test to apply
to each screen: *if you removed Tal entirely, would the screen still work exactly as before?* If
yes, you haven't done the work — Tal should be the primary content and the old module should become
the evidence underneath it.

Two decisions already made, unless the user says otherwise:

- **Tal proposes, the candidate confirms.** Tal may prepare an action — hold a slot with an agent,
  queue the next chapter, pre-select a saved card — and the candidate commits it with one tap. Tal
  never books, pays, or enrols on its own.
- **This is for the client pitch, with honesty marks.** Candidate screens should look complete and
  ambitious. Anything that depends on LightSpeed data that hasn't been confirmed gets flagged on the
  internal Integration notes screen, never on a candidate screen.

### 1. Name the assistant

Rename the existing AI chat panel to **Tal** throughout the candidate portal: panel header, the
collapsed/expanded toggle, tooltips, empty state, and any "AI assistant" or "Ask AI" string. Tal
speaks in first person ("I'd start Chapter 7 before Friday"), never as "the AI".

### 2. Dashboard — the main proactive surface

This is the only screen a candidate opens without an intention already formed, so it's where
proactivity earns its keep. At the top of the candidate dashboard, in **all six states**, add Tal's
opening read: one or two sentences on the single thing that matters today, followed by two or three
**intent chips** that are actions, not navigation. Tailor per state using data that state actually
has — e.g. in `new` there is no progress yet, so Tal's read is about booking the interview; in `mid`
it is about pace against the 90-day window; in `next` it is about what enrolling unlocks.

Keep the existing dashboard cards below it. Do not delete the "See what's next in this course" block
or the course outline block.

### 3. Agent cards — invert them

Currently the candidate sees a list of agents and picks. Change it so Tal surfaces **one recommended
agent**, with the reasoning as the card's main content, grounded in real data — e.g. "your quiz put
Delegation at 41; Dana's last four cohorts moved that dimension most". The rest of the agents move
behind a **"See other agents"** control. Add a small Tal affordance on each agent card that opens the
chat panel already scoped to that agent, so the candidate can ask about them.

### 4. Course enrolment

Do **not** write "this course was chosen for you" — it wasn't; there is effectively one course path,
and that copy would be dishonest. What is real is the mapping from quiz dimensions to chapters: have
Tal name the specific chapters that address the candidate's two lowest dimensions. Add the same Tal
affordance to open a discussion about the course.

### 5. My Level

The screen currently shows a rose chart and five dials and leaves the candidate to interpret them.
Put Tal's two-sentence interpretation at the top and let the charts sit beneath it as evidence.
Do not change the underlying numbers, the existing row structure, or the two-column
"From your interview" / "From your quiz" arrangement — the client specified those per state and they
must not merge.

### 6. Cohort and members

Add Tal's read on the candidate's own pace and what to do next. It must not name, rank, or imply a
comparison with any other participant. See constraint 2.

### 7. Interview transcript

The transcript opens in the right-hand slider. Add a short Tal summary at the top of it. Because no
transcript pipeline is confirmed, add a line about that dependency to the internal Integration notes
screen — not to the candidate screen.

### 8. Internal Integration notes screen

Add a section covering **what Tal can and cannot ground its statements in**, using the three tiers in
constraint 3 above: confirmed LightSpeed fields, our own data, unconfirmed fields, and the total
absence of transcripts. This is the screen the team uses to defend the design, so be specific and
attribute claims where they came from (Jason Straub, LightSpeed's CTO; or their support docs).

### 9. Relative time on every scheduled thing

Today the prototype shows absolute times only — "Thursday · 18:00" — and never how far away that is.
Add a relative label next to the absolute one everywhere a future scheduled item appears: the next
cohort call, a booked interview, an upcoming session. Format: `Thursday · 18:00 · in 2 days`.

Apply it universally — dashboard, cohort screen, booking confirmation, session lists, and the agent
portal's equivalents. Derive it from the same clock the booking date strip (`bkDays()`) already uses,
so the two never disagree.

This also fits the product's own sense of time: the candidate screens already say "day 34 of 90", and
LightSpeed enforces a minimum dwell time before a chapter can be continued. Where a chapter cannot
be continued yet, say when it can.

## How to verify

There is no browser available. Verify with jsdom.

- The existing harnesses are in `.build/*.mjs`. Copy one as a template — they load the file with
  `runScripts:'dangerously'`, wait ~500 ms, click through `data-act` handlers, and assert on DOM
  content. Run them with `node .build/YOURNAME.mjs`.
- Assert on the **right container**: `#view` for candidate screens, `#agView` for agent screens.
  Reading the wrong one makes assertions pass trivially.
- Catch `jsdomError` and fail loudly on it. A stray syntax error in a template literal will silently
  kill all rendering otherwise.
- Write a leak test: walk all six candidate states, open every nav item, and assert that no candidate
  screen contains "lightspeed", "SAML", "Service Provider", or "Join Now".
- CSS overrides must be appended to the **last** `</style>` block (use `rpartition`) or the cascade
  will drop them. Overlay surfaces (`#ses`, `#mk`, `#bkWrap`) sit outside `.ui`, so `.ui`-scoped
  utility classes like `.f1` do not reach them — they need their own rules.

## How to work

- Patch `tn-portals.html` in place with Python string replacements that **assert** their anchor
  matched exactly once, so a stale anchor fails loudly instead of silently doing nothing.
- Keep patch scripts and harnesses in `.build/` — it persists. `/tmp` does not.
- After each accepted change: `cp tn-portals.html .build/bk-$(date +%m%d-%H%M).html`.
- Work in a few large patches rather than many small ones; the user has repeatedly asked for speed.

Start with the dashboard, since that's where proactivity actually matters, then the agent cards.
