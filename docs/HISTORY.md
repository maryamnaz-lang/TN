# TalentNext — the design history

Every dated design decision that used to live in `CLAUDE.md`, moved here verbatim on 4 Sep 2026
so that `CLAUDE.md` holds the build mechanics and `DESIGN.md` holds the rules. Nothing below was
rewritten. The rule each section states is one line in `DESIGN.md`; the argument is here; the
primary source is the comment above the rule in its `hifi/build/` layer. Read this when a rule
looks wrong — several of them record a decision that looks like a bug and is not.

## From: A NEW page or portal starts from `design-system/` — the agent portal, 2–4 Sep 2026

**AND IT WAS BROUGHT UP TO THE CURRENT COMPONENT GENERATION ON 2 SEP 2026** (Maryam: "the look
talent agent portal have right now is a previous design but we have improved this design, so
see the cohort leader portal and implement those components that suits on talent agent portal
as per its content", then "follow the candidate portal summary and steps ui … please remove
picture and welcome context"). It had been left on the §56/§33 generation while §70–§86 landed
on the other two, so one design system was rendering two generations with class sets that did
not overlap — the failure that is invisible from either file alone. What changed, all of it
components the other portals already draw: the head band is **§70's** (Tal's summary is the
whole left column on the warm wash, the journey is `.jrn` in a `.sec.head-sec.head-col
.sec-jrn` right column, and the 75px face, the greeting and the fact row are gone behind a
`.ph-bare`); every `.plate` hero became a full-width **`.dark-card`** in the page body, with
`.crow-dark` + **`.crow`** wherever the subject is an appointment with a person; headings with
a sentence under them became **`aiHead`**; six read-once reference blocks became **§65
disclosures** keyed by name in `S.disc`; and the dashboard's stranded `.btn-row` became
**Quick Actions**. `plate()`, `stepper()`, `youMark()`, `stepIcon` and `ph()`'s `mark` argument
are deleted or left caller-less with their arguments preserved in place. Also on 2 Sep: the
`Choose a portal` sign-in step is **removed** — login goes straight to the dashboard — and
because that screen was the only element writing `data-portal`, the route to `hifi/` moved to
`V.profile`'s "Your roles", which is §78's account-menu decision one step longer.

**AND THE APP BAR FINALLY TOOK §78's ACCOUNT MENU ON 4 SEP 2026** (Maryam: *"when i switch to
talent agent portal the top chevron with the profile icon is missing, i think the top header is
not updated component on agent portal, i can switch back to leader or candidate"*). This portal
was still drawing the pre-§78 bar — a bare `.av-ph.sm` linking to Profile — so there was **no way
back out of the file** except the "Your roles" row two clicks inside Profile. The face is
`.acct-t` + `.acct-c` now, opening `acctMenu()`: **Profile Settings**, **Switch to Candidate**,
**Switch to Cohort Leader**, with the two people's own photographs as the marks (§106 rounds
them). *Not one line of CSS was written* — §78, §63 §17 and §106 all cross into
`design-system/`, so the component was already in `talentnext-ds.css` waiting for the markup.

- **BOTH SWITCHES ARE `data-portal`, WHICH IS THIS FILE'S ATTRIBUTE FOR "ANOTHER DOCUMENT".**
  `hifi/`'s own menu needs two names — `data-swap` for the repaint between Candidate and Cohort
  Leader, `data-doc` for the load to this file — because from THERE they are different kinds of
  thing. From here both are a load, so one attribute is right and its one-line handler already
  existed.
- **THE LEADER ROW CARRIES `#leader/leadDash` AND THE CANDIDATE ROW CARRIES NO HASH.** That is
  the whole difference: `hifi/`'s boot reader takes `#leader/<view>` as "restore the cohort
  leader" and everything else falls to `setStage('new')`, the candidate's front door. The third
  hash segment is a STAGE and is guarded, so leaving it off lands the leader on `new` — right,
  because a leader has no journey of their own to be part-way through. **Verified both
  directions land** (`S.portal==='leader'` / `'candidate'`).
- **THE CLICK-AWAY GOES *BEFORE* `if(!t) return`, WHICH IS NOT WHERE `hifi/` PUTS IT.** That
  router's `t` is `e.target`, so its close line can sit among the branches; this file's `t` is a
  `closest()` over an attribute list, so a press on the page background carries no attribute and
  the guard would have swallowed the dismissal, leaving the menu standing. Same test
  (`.acct-t, .acct-menu`), different position, and the position is the load-bearing part.
- **`V.profile`'s "Your roles" ROW STAYS** — §112's duplicate test is two controls with the same
  words on one screen, and a bar menu is not a page block. Its note's claim to be the only
  `data-portal` writer is corrected in place.
- Swept: **120 screens** (5 stages × 8 views × 3 frames) — zero thrown errors, zero
  `console.warn`, zero horizontal overflow, `.acct-t` present on every one, and the menu fits
  inside the frame at 390 / 744 / 1440.

**AND §78 LANDED ON IT LAST** (Maryam, 2 Sep 2026: *"we are not using headings or insights on
our new ui look. please follow the structure of candidate and cohort portal"*). Every module
page still opened with an `<h1>` and a `&middot;` fact row where the other two portals put the
page's name in the bar — checked rather than assumed, by sweeping 55 candidate screens and
finding **zero `<h1>`s and zero `.ph-facts`**. Both mechanisms are now ported: `phSub` returns
`''` for a multi-part row (the single-part branch stays, because that is the auth screens'
prose), and a `placeTopbar` pass at the foot of the file reads `pageLabel`, strips the heading,
draws the trail and marks the `.ph` `.ph-bare` / `.ph-backonly`. **The back stack is `S.hist`
with `{view, label}` entries and ONE push site** — the `data-go` branch, which captures the
label off the page still on screen; the candidate portal diffs the stack's length instead
because it has six push sites across five files, and §78's note records why a map keyed by view
fails. A rail item empties the stack, a hash arrival empties it, and a deep link gets its
module prepended. The local `.shell .shell-name` rule is **deleted** with the label it styled,
so the agent portal's `<style>` block is prototype chrome and nothing else.

**AND THERE IS NO AGENT LEVEL** (Maryam, 2 Sep 2026: *"we don't have any concept of agent
level, so remove that kinda thing totally from the talent agent portal"*). `A.level:'A2'` /
`A.levels:4` were an A1–A4 ladder for the agent themselves — a mirror of the candidate ladder
that nothing outside that one file ever defined: no agent ladder in the flow diagram, none in
`hifi/`, none in the wireframes. Gone with it: Standing's `.lvl-hero` hero card, its `Level`
figure cell, `askState`'s `Agent – A2` lead, a notification headed "Nadia moved you to A3",
and every "A3 is E1 to B2" gloss. **Three things it was confused with all survive** and are
different concepts: `range`/`rangeShort` (which candidate levels this agent may assess — a
permission, and what the quarterly review actually moves), `rank`/`pool` (9 of 38 in browse,
recalculated weekly), and the review by `A.manager`. The range took the level's figure-cell
slot, so `.stats` still has its required four. Swept: **zero `\bA[1-4]\b` and zero
`.lvl-hero` in the rendered text of all 44 screens.**

**THE DASHBOARD'S SECTIONS TOOK THE LEADER'S HEAD BLOCKS AND GROUND RHYTHM, AND THE STICKY
STRIP WAS BUILT AND REMOVED** (Maryam, 2 Sep 2026: *"for the sections improvement on talent
agent dashboard, please utilize the components from the cohort leader dashboard"*). What landed:
`aiHead` on "On you" (the page's last bare `.sec-h`), the alternating white/tint ground that is
the leader's page rhythm, and the "nothing to accept" note folded into the section it is about.
What did not, and why it is worth knowing: the **sticky section strip** (`.lead-bar` /
`.lead-tabs`) was ported in full and worked — then measured. This dashboard is 1270px in a 600px
frame and the strip sits 609px down, so it had **61px of scroll** before its own `is-gone` rule
correctly hid it. §60's "a dead control on a live surface is worse than a missing one". The
longest page in the portal is Profile at 1793px; the leader's dashboard is ~3000px with four
substantial queues. **The four figure cells are deliberately not `.stat-jump` cells** — the
leader's each count a section below them, an agent's are readings ($204 has no section to
scroll to), and making them jump would have meant inventing sections.

- **THE CSS UN-SCOPING STAYS, and it fixed a real defect:** `.lead-bar`, `.lead-tabs` and
  `.stat-jump` were `[data-portal="leader"]`-scoped, so a hand-authored page could write the
  markup and get nothing — §31.5's exact `.bk-row` problem. Nineteen selectors across §31 and
  §37 lost the attribute; `scroll-margin-top` gained a `.jump-sec` class beside its
  `[id^="lead-"]` half so a second portal's sections need not be called `lead-anything`.
  **`.stats-lead` deliberately kept its scope** — it is five `nth-child` rules carrying the
  leader's four NAMED hues (red = falling behind, amber = awaiting signature, blue = scheduled,
  violet = cohorts), which are semantics of that portal's content.
- **AND UN-SCOPING SILENTLY DROPS A RULE'S WEIGHT — the one regression, caught by measuring.**
  `.app[data-portal="leader"] .stat-jump{cursor:pointer}` is (0,3,0) and beat §10.16's
  `.app .stats > .stat{cursor:default}` — also (0,3,0) — on order. Un-scoped to `.app
  .stat-jump` it is (0,2,0) and **lost**, so the leader's jump cells stopped saying they were
  pressable. Nothing warns: the rule is still valid and still matches. Re-qualified as
  `.app .stats > .stat-jump`, which is (0,3,0) again and states a structural truth. **Removing
  an attribute from a selector is a specificity change, so re-check every declaration in it
  against what it was competing with** — §63 §7b's trap, arriving from a direction that layer
  does not describe.

That portal has since been **rebuilt on the include-by-default output** and is no longer the
example of the problem — it is the example of the fix. Tal speaks from `.ai-aura`, the next
interview and the calibration slot are `.plate`s with the orange CTA, the training modules are
a `.wkc` with its `.ring`, the agent's level is a `.lvl-hero` and the certificate a `.cert`.
Two things it had to solve that any second portal will hit: `.plate`'s countdown chip is
assembled by `placePlates` (`ai5.js`) rather than by CSS, so a page with no render passes must
emit the `.plate-h` / `.plate-when` row itself; and **`.tal-panel` and `.tal-fab` are switched
off** by §27 — the thread moved to the ask dock, which `build-ds.py` excludes — so Tal's
questions belong in a component the system still ships.

It now opens with the **head band** too, one page at a time: `.modhead` wrapping the `.ph`,
Tal's card and the hero, with the greeting and a `.stp-wing` stepper on the dashboard. Two
more render-pass jobs a hand-authored page has to do itself: the steps popup is
`position:fixed` inside a container, so it is clipped unless it is moved out to `.device`
(`views.js` ends on exactly those two lines), and the entrance cascade stamps `--i` on the
section list rather than on every child.

**THE CANDIDATE PORTAL NO LONGER DRAWS THE STEPS POPUP — §56 opened it.** The steps are a row
in the head band now (`.stps`, `stepper()` in views.js), so nothing in `hifi/` emits `.stp-all`,
`.stp-tw`, `.stp-pop`, `.stp-t` or `.stp-now`, and `S.piOpen` is gone with the router branch and
the click-away listener that closed it. §33.7's rules all still ship — `tn-agent-portal.html`
hand-writes that markup and the design system carries it — so the four notes below are still
live for a hand-authored page that wants the dropdown. A page that wants the OPEN row copies
`.stps` out of `gallery.html`'s Signature section instead; it is markup plus §56 and no JS at
all, and `stepIcon`'s table is the one thing that does not cross (both portals keep a copy so a
step's subject icon cannot differ between them).

**The steps popup is a dropdown, and three of its rules are markup, not CSS.** §33.7 owns it
and the whole argument is written there; what a hand-authored page has to do:

- **`.stp-all` goes INSIDE `.stp-top`** (or `.stp-h` on the untitled variant), because the row
  the toggle is in is what the panel is anchored on. Written as a sibling of that row it
  anchors on `.stp` — the whole stepper — and opens 117px below the button, clear of the
  current-step block, reading as a loose card rather than that button's menu.
- **The toggle's words go in `<span class="stp-t-l">`.** At desktop the wing is an `auto` grid
  track, so the header row's max-content sizes it, and "Hide steps" is 13px wider than "All
  steps" — pressing it moved the card and reflowed Tal's sentence. The span reserves 68px.
- **A row is `.pi-ic` + `.pi-b`.** A tick (`I.checkFilled`) when the step is done, the step's
  own subject icon when it is not — `stepIcon` derives that from the label, and both portals
  carry the same table so "Vetting" cannot be a shield on one page and a ring on the other.
  State goes on the row (`.pi-step.done` / `.on`); the mark's ground is drawn from it.

Two specificity traps live here and both are answered on one selector. §03/§04's `.stp-all >
div` (0,1,1) was written when `.stp-all` held the step rows directly and now lands on §33's
`.stp-pop` wrapper, so it beat `.stp-pop`'s own `display` *and* its `padding` — the first laid
the panel's heading out beside the list, the second gave the panel 8px top and bottom and
**none at the sides**. `.stp-all > .stp-pop` in `33-talsum.css` states both.

## From: TYPOGRAPHY IS §63 — the `--t-sec` decision and the type sweep

- **A SECTION HEADING IS `--t-sec` — 16px, EVERY SECTION, EVERY WIDTH** (Maryam,
  1 Sep 2026: "make the section heading size consistent everywhere, in some grey
  sections it is different and in some white sections it is different"). It had
  **five at desktop** — 12.5 `--t-label` (177), 14 `--t-h4` (§8b's seven
  `:has()` exceptions plus §65's `.found`, 38), 16 `--t-sec` (the AI-native
  heads, 35), 17 `--t-h3` ("Quick Actions", 54) and 18 `--t-sec-lg` (the leader
  dashboard's four queues, 8) — and 14 for everything on a phone. It is now
  **286 headings at 16px at 390 and at 1280, white ground and grey alike, with
  no page drawing two.** `.aih-t` shares the token rather than out-ranking it,
  so there is exactly one section-heading size in the product. §8b states it in
  both tiers; §21 and the `.sec-qa` rule are deleted with their arguments
  preserved in place; §65's `font-size` is gone, which was **the only rule in
  the build breaking "no type after §63"**.
  - **`--t-sec` IS NO LONGER AN EXCEPTION BESIDE THE SECTION HEADING, IT IS THE
    SECTION HEADING.** Its token note used to justify itself as a distinct rank
    "because §63 §4 puts every other section heading at 12.5"; that is the
    sentence the instruction overturned. `--t-sec-lg` is down to one reader,
    `.dc-t`.
  - **IT IS STATED TWICE, UNCONDITIONALLY AND INSIDE THE QUERY**, because the
    heading must not change rank at 900 and because §4 sizes `.app .sec-h h2`
    as part of a shared LIST (`.cardrow-t`, `.nrow-t`, `.gcard-b h3`, a dozen
    more) that cannot be moved without moving all of them.
  - **THE SPINE ARGUMENT IS GONE AND WAS MOSTLY FALSE.** §8b used to justify a
    smaller heading at ≥900 by §10.15's 184px column — "it stops being a title
    and starts being a spine". Measured across 184 pages, **36 of 290 section
    headings actually have that column** (four distinct ones, all on What Tal
    knows); everything else opts out, because §10.15's list is keyed on
    CONTENTS and nearly every section is built from the components on it. Worth
    knowing if a smaller spine is ever re-proposed: it is right for an eighth
    of the product. **The 184px column holds 16px** — checked, not assumed:
    that is trap 13's "heading wraps past three lines", and `respcheck --edge`
    passes it at seven widths.
  - **THE SEVEN `:has()` SELECTORS ARE RE-POINTED, NOT DELETED.** §15 and §16
    state the same seven at 15px inside the same container query at (0,5,2),
    heavier than §8b's default at (0,4,1). Delete §8b's block and those win —
    the headings go to 15 and the page is less consistent than before the edit.
  - **AND TRAP 13 REACHES THE TYPE LAYER.** `.sec:has(> .sec-h) > .sec-h` is a
    direct child twice over, so a section that WRAPS its heading drops out and
    lands on §4's unconditional h4. The Agents page does exactly that
    (`.sec > .hd-srch > .hd-srch-t > .sec-h`) and was the last 14 left. It is
    the only wrapped one in either portal — a sweep finds two shapes, 238
    direct and 12 wrapped — so §8b names it rather than loosening the
    combinator to `.sec .sec-h h2`, which would reach `.sec-h` inside sheets,
    Tal's bubbles and the auth card.

**THE DISPLAY ROLE IS HERO NUMERALS AND NOTHING ELSE.** §11 described it as
"hero numerals, the level name" and the second half was the mistake: a numeral
can be huge because it carries no reading, but "Explorer – E4" is words, sits
under a section heading, and at 34/40 came out larger than the page title above
it. The level name is h2 in both places it is drawn — `.big` on `.lvl-hero`, and
`.wing-lvl .prog-pct`, which is the same class that holds "38%" on the enrolled
dashboards because `ladderWing` borrows `progressStrip`'s shape. `.lg` came off
the role too: it is a size modifier on `.tal-mk` and `.bmk`, marks with no text
in them at all.

The sweep that proves it is worth keeping: walk `STAGES` × `NAVSETS` plus the
sub-pages for both portals (set `S.portal` **after** `setStage`, which resets
it), call `callOpen()` for the three call kinds, and collect
`getComputedStyle` for every element that owns a text node. It should return
zero elements outside the ladder at 390, 760, 1000 and 1280.

## The candidate portal, dated (§56–§116)

### ONE SECTION RHYTHM — 48px, EVERY PAGE, BOTH PORTALS

Maryam, 1 Sep 2026: *"each section on all pages on both portals should have equal spacing
from each other."* §10's base has always said `.sec{padding:var(--s06)}` — 24 top and
bottom, so 48 between two sections. Everything that made it uneven was an override of
that base, and the fix was to take the overrides out rather than to state a new rule.
Measured over 184 pages, 349 adjacent section pairs: **270 now sit at exactly 48px, at
390 and at 1280 alike.** Before, there were eight distinct gaps at desktop and seven at
mobile.

The four that mattered, by count:

| was | pairs | cause | now |
|---|---|---|---|
| 32 | 94 | **§20's half-gap** — "two blocks with no rule between them pay 16 and 16" | 24 + 24 |
| 64 | 54 | **§73.10** gave the AI-native dashboards their own 32px rhythm | `--s06` |
| 88 | 54 | **§70's `.sec-qa`** paid its own `--s07` frame | `--s06` |
| 72 | 12 | a `.mt6` margin utility stacked on a section's own padding | class removed |

- **§20's TWO RULES ARE RE-POINTED, NOT DELETED, AND SO IS §73.10's.** Their `:not()`
  chains are not about the half-gap — they keep `.lead-bar` (a zero-height sticky hook),
  `.ldr-dm-sec` (a panel attached to its tab strip) and `.cap-sec` (a pass-through)
  paying nothing, and `.sec-call` / `.dark-card` paying their own frames. Those selectors
  run to fourteen classes inside a container query, so per trap 4 nothing later can put
  them back. Pointed at `--s06` they agree with §10's base for everything they still
  reach.
- **§20's ARGUMENT HAD ALSO LOST ITS OTHER HALF.** "Space follows the rule" only works
  while the rule is visible, and §54, §55.2 and §84 have since taken the hairline off
  every tinted section and its neighbour. The pairing stopped being drawn; only the
  spacing difference was left.
- **A DARK CARD'S 32 IS ITS FRAME, NOT THE GAP.** All 64 dark-card pairs read 80px
  content-to-content — 24 (neighbour) + 24 (card margin) + 32 (the card's own inside).
  Edge to edge that is the same 48 as everything else. `.dark-card` now carries
  `margin:var(--s06) var(--pad-x)` on **both** edges; it was top-only, and §75's note
  records both reasons that had expired.
- **TWO STRUCTURAL EXCEPTIONS SURVIVE AND ARE NOT BUGS.** `.sec-call` → `.sec-cs` at 0
  (nine pairs) is two full-bleed surfaces meant to meet on one line — §16 zeroes a
  section holding a tab strip and §71 zeroes the call row — and `→ .lead-bar` at 24 is
  the zero-height sticky hook whose height must never change. Both are named in §20's
  note; forcing 48 on them puts white between two grounds.

### A MARK IS A BARE 20px GLYPH — the chip came off `.stat` on 1 Sep 2026

Maryam: *"the icons should not have the background, all four icons should be in different
relevant colors to their nature. increase the size of the icons since removing the
background will make them look very small otherwise"* — then, of the Quick Action cards,
*"do the same for the quick action icons as well."*

**§72 HAD ALREADY MADE THIS MOVE AND ITS NOTE IS THE ARGUMENT.** That layer took the same
28px tinted square off the pulse's three column marks and stepped the glyph 16 → 20
"because it now holds the line alone". §29's `.stat-ic` is the last caller of the chip and
goes the same way: **20px box, 20px glyph, no ground**, hue still inherited from `--mk` so
the mark and the figure cannot disagree. The box is 20 and not 28 for `.pulse-ic`'s reason
— a bare mark has no padding to hold, and an oversized box reads as a bad gap before the
label rather than as a column. `fill:var(--mk)` rather than `currentColor`, because
`.stat` sets no `color` (§72 could use `currentColor` only because `.pulse-ic` sets one).

**IT IS A COMPONENT CHANGE, SO THE CANDIDATE PORTAL MOVED TOO** — every `.stats > .stat`
in the product, not just the leader's jump band. §29's `nth-child` cycle is untouched
there, so those four are still blue / green / violet / rose by position.

**THE LEADER'S FOUR ARE NAMED, NOT CYCLED, AND ALL FOUR NOW CARRY A HUE.** §31 had the two
counts on `--gray-70` — "neutral for the two that are just counts" — which was right while
the mark was a wash behind a glyph, where a hue on a count would have read as a status.
With nothing tinted, a grey glyph beside three coloured ones reads as two marks that
failed to load. Red `--danger-ink` for the queue of people falling behind, amber
`--support-attention` for the work waiting on a signature, blue `--mk-1` for a scheduled
session (the hue `.qa-ic.ic-prep` already gives a call) and violet `--mk-3` for the
cohorts (§82's hue for `.cov-pill` and the course cover). **The FIGURE still reddens on
the two demands only** — a hue on the mark says what kind of thing this is, a hue on the
number says it needs you.

`.qa-ic` steps 16 → 20 with it and its `margin-top` drops 3 → 1: that offset optically
centred a 16px glyph against the card's 21px title line, and four more pixels of glyph is
two more above the cap height. 20 is now the product's one bare-glyph size, shared by
`.stat-ic`, `.pulse-ic` and `.qa-ic`.

**Pre-existing and NOT introduced here:** below about 1200 the leader's first two jump
cells drop their figure under the label (`.stat-top` wraps the pair, §37.11). Measured
with the old 28px chip and the new 20px glyph at 1150 / 1280 / 1440 / 1600 — identical at
every width, so the smaller mark neither caused it nor fixed it.

### THE FIGURE CELL AND THE QUICK ACTION CARD ARE ONE SHAPE — 1 Sep 2026

Maryam, over three messages: the marks lose their grounds and grow; *"the content and
icons both should be aligned from top"*; *"the arrow and the numbers on both screenshots
should be right middle aligned to the block"*; and *"just like the quick action block
headings, give the same to the 4 blocks heading, the font size and weight should be same."*
Read together they make `.stat` and `.qa-c` the same object — a small bordered block whose
first line names it, whose second line qualifies it, and whose one figure or control holds
the right edge.

| | `.stat` (§29) | `.qa-c` (§70) |
|---|---|---|
| mark | bare 20px glyph, hue from `--mk` | bare 20px glyph, hue per card |
| title | `--t-h4` — 14 / 600 / 19 | `--t-h4` — 14 / 600 / 19 |
| content | hangs from the top | hangs from the top |
| right-hand item | the figure, centred on the cell | the arrow, centred on the card |

- **`.stat` IS THREE COLUMNS NOW** — `'ic top n' 'ic d n' 'ic sl n'` — with
  `display:contents` on `.stat-top` so the wrapper dissolves and its two children take grid
  areas without a markup change (§72.4's move on `.stand-top`). **The third row is a `1fr`
  spacer and it is the whole of why "middle" means the block**: `align-content:start`
  packed the rows to the top and left the slack undistributed, so the figure centred on the
  CONTENT and a cell whose label wrapped put its number ~9px below its neighbours'.
- **IT RETIRES §37.11's STAGGER.** The old `.stat-top` was a baseline flex line that wrapped
  the label/figure PAIR — the reason the transcript's "Assessment average" cell sat 15px
  low. A long label now wraps inside its own column and every cell in a row starts level.
- **`.qa-c` IS `align-items:flex-start`, NOT `center`.** Centred, two cards side by side
  started their titles at different heights whenever their descriptions ran to different
  numbers of lines — measured at 1280, y=1 against y=11. The arrow keeps its own
  `align-self:center` plus `margin-left:auto`, which is what "right middle" needs once the
  text block no longer fills the row.
- **THE LABEL CAME OFF THE EYEBROW ROLE**, pulled out of §63 §4's thirty-class list at
  (0,4,0) rather than moved inside it — every other member of that list really is an
  eyebrow. `.stats .k` / `.stat .k` stay behind deliberately: they are the older `.k`/`.v`
  spelling `gallery.html` documents as the shape *not* to build a figure cell from.
- **A 20px GLYPH NEEDS NO OPTICAL OFFSET AGAINST A 19px LINE.** `.stat-ic` briefly carried
  `margin-top:4px` to answer the old baseline push; with the label starting its own row at
  top 0 that same 4px put the mark 4px low. Both are `align-self:start` at 0 now.

### THE GAP INSIDE A SECTION IS `--sec-h-gap` — 12px, ONE TOKEN

Maryam, 1 Sep 2026: *"you need to reduce the spacing within the section, means between
section heading and it's content … so they seems connected."* The sections are 48 apart
(above); this is the other half — the heading and its own content read as one object.

**IT WAS NOT ONE VALUE AND IT WAS NOT IN ONE PLACE — twenty-six declarations across
eighteen layers.** §02 and §10 set the base and then §12, §14, §15 (×5), §16 (×2), §17,
§28, §32, §36 (×2), §38 (×3), §43, §44, §65, §69 (×2), §70 (×2), §72 and §73 each said it
again, because every one of them had to restate `padding` or `border-right` for a section
that opts out of §10.15's label column, and carried `margin-bottom` along for the ride.
Measured over 184 pages: **16px on 116 headed sections at desktop, 20 on 54, 12 on 18 and
32 on one.** "Reduce the gap" meant finding all twenty-six.

**SO IT IS A TOKEN NOW.** `--sec-h-gap:12px` in §01, and all twenty-six sites read it —
197 headed sections at desktop and 233 at mobile now measure exactly 12, and the next
adjustment is one line. **16 → 12 is deliberately one step**: the instruction is "a little
bit", and 8 would put a 16px heading closer to its content than the 12 that already
separates two `.kv` rows. Heading-to-content 12 against section-to-section 48 is a 4:1
ratio where it was 3:1.

- **THE `mb:0` SECTIONS ARE NOT MISSING THE TOKEN.** 75 headed sections at desktop are
  §10.15's label column, where the heading sits *beside* its content — there is no
  vertical gap to set, and their measured "gap" is negative for that reason.
- **NINE SECTIONS STILL READ 19–42px AND IT IS THE CONTENT'S OWN MARGIN, NOT THE
  HEADING'S.** `.stand`, `.tile-stack` and `.scene-pick` each carry a `margin-top`; the
  heading pays 12 in every one of them. Worth knowing before chasing the number again.
- **THE `.sec-h.aih` BLOCK MEASURES 80–176 AND IS NOT A GAP.** `aiHead` puts the title,
  the description and the actions all *inside* the `.sec-h`, so "heading text bottom to
  next sibling" spans the whole head block. Its margin is the token like everything else.

### A HEADING AND ITS DESCRIPTION ARE ONE OBJECT — `--sec-desc-gap`, 8px

Maryam, 1 Sep 2026: *"wherever there will be desc with the heading, their gap will be this
much which we have in the choose your scenes and it's desc."* §38's `.scene-hb` is the
reference and its own note has the working — 16 → 12 → 8 over two asks, ending at "the
pair is closer to each other than either is to anything else on the page".

**TWO TOKENS, AND THE DIFFERENCE IS WHAT THE SPACE SEPARATES.** `--sec-h-gap` (12) is a
heading from its CONTENT — a grid, a table, a row of cards, which are different objects.
`--sec-desc-gap` (8) is a heading from a sentence ABOUT that heading: one object on two
lines. Both are in §01 next to each other.

**THREE PLACES DRAW THE PAIR AND THEY WERE THREE VALUES.** Measured over 184 pages:

| | was | count |
|---|---|---|
| `aiHead`'s `.aih-b` flex gap (613:7984's own 12) | 12 | 44 |
| a `.sec-h` followed by an `.all-desc` — paying `--sec-h-gap`, because the sentence is a SIBLING of the heading rather than a child of the head block | 12 | 16 |
| `.scene-hb` | 8 | 1 |

**61 of 62 now measure 8 at desktop and 67 of 68 at 390.**

- **THE `.all-desc` RULE HAS NO `.sec >` IN IT, AND THAT IS TRAP 13 AGAIN.** Written as
  `.sec > .sec-h:has(+ .all-desc)` it missed the Agents page at both widths — that section
  wraps its heading (`.sec > .hd-srch > .hd-srch-t > .sec-h`), the same wrapper that drops
  it out of §63 §8b's heading size. Twelve sections, one per stage, all reading 12 while
  every other description read 8. Keyed on the PAIR instead: wherever a `.sec-h` is
  immediately followed by an `.all-desc`, whatever wraps them. `:has(+ .all-desc)` is also
  what keeps it narrow — it cannot reach a `.sec-h` in a sheet or a Tal bubble.
- **IT NEEDED BOTH TIERS.** §16 states it inside `@container app (min-width:900px)` for
  the sections that opt out of the label column there; the unconditional rule is what
  reaches the phone, where the heading otherwise falls to the base `--sec-h-gap`.
- **THE ONE SECTION STILL AT 24 IS NOT A PAIR.** `.ldr-board`'s `.sec-h` holds the heading
  AND a cohort tab strip, so the helper line under it is separated by the tabs, not by a
  margin. Its heading pays the token like everything else.

### THE QUIET BUTTON — §64, `64-quietbtn.css`

`.btn-s` / `.btn-t` / `.btn-g` — 88 of them — were outlined, and on a product
made of hairlines a drawn rectangle is one more edge than the page has. The
border is off and an arrow is on. Four things:

- **The border is set TRANSPARENT, not removed.** `.btn` declares
  `border:1px solid transparent` and every variant only re-points the colour,
  so the 1px is in the contained button's box model too — `border:0` makes a
  `.btn-g` 2px shorter than the `.btn-p` beside it in the same `.btn-row`.
- **The arrow is a `mask-image`, not a glyph and not an `<svg>`.** It must take
  `currentColor` (these are `--text-primary` on a page, `--on-dark` on the black
  card, `--accent-text` under §19). A `content:'→'` would come from the stand-in
  face — Söhne's trial file carries 68 glyphs and an arrow is not one — and an
  inline `<svg>` would mean editing 88 call sites and would still not reach a
  hand-authored page.
- **It appears only where there is no icon already, and the test is
  `:not(:has(svg))`, NOT `.noic`.** `.noic` means "do not push the icon to the
  far edge", and 57 of these are written `.noic` *with* an icon in the label
  (`${I.download} Download as PDF`). Keying on `.noic` puts a second arrow on
  all 57.
- **`.cert-btn` keeps its border** and is deliberate — it is a different variant
  on the black card, and the certificate card is the shape this was modelled on.

§55.2's white fill on a `.sec.tint.cards` head button is also off (§65): that
fill existed to lift a *bordered* button off the panel, and with no border it
was a pale rectangle floating in a grey band.

### THE FOUND DISCLOSURE — §65, `65-founddisc.css` + `foundHead` (views.js)

"What the interview found" is the longest block on the two dashboards that carry
it and it is a re-read, so it starts closed with the chevron on the **left** of
its heading — the row already ends in "Read the full report", and two controls at
the same edge, one opening in place and one navigating away, is the ambiguity
worth avoiding. Three things that cost a round trip each:

- **The state is `S.disc` AND a DOM class.** `render()` alone was wrong: it
  replaces `device.innerHTML`, which resets the scroller, so opening a section
  1200px down threw you back to the header and closing it threw you back again.
  The class handles this interaction, `S.disc` survives the next render.
- **THE DISCLOSURES ARE KEYED BY NAME AND THERE ARE TWO.** It was one boolean,
  `S.found`, on the reasoning that the two dashboards never appear together so a
  second key would only hold the first one's value — true of those two, and
  false the moment "How your cohort works" appeared on the Enroll page (§69).
  `foundHead(title, act, key)` writes the key into `data-found` and the section
  reads `discOpen(key)`; `report` is the default, so the two dashboards are
  unchanged. **Nothing in this reached the stylesheet** — §65's rules are about
  the SHAPE of a disclosure and all of them key on `.found` / `.found.on`.
- **THE WRAPPER PUT THE SECTION BACK IN THE LABEL COLUMN — trap 13, exactly as
  written.** The section's opt-out was §16's `.sec:has(> .all-desc)`, a DIRECT
  child. Wrapping the panel in `.found-b` moved that sentence one level down,
  the opt-out stopped matching, and at desktop the heading set on four lines at
  57px wide with the button hanging 172px past the section's right edge.
  Restated on `.found`, inside the same container query per trap 3.
- **`.found-t` has to carry `flex:1 1 auto`.** §24.13 gives it to `.sec-h > h2`
  — a direct child — and wrapping the `<h2>` in the toggle made it a grandchild.

Riding with it: `.prog-ic`, `.stat`'s mark on the three
`progressStrip` figures, with the hues **named** (`--mk-1/2/3`) rather than
cycled by `nth-child` the way §29 does it, so a chapter is blue in both places.
The mark is a left-hand COLUMN, not a row above the figure, which is why the
figure and its label had to be wrapped in `.prog-fb` — the label was a bare text
node and could not be given a column of its own.

`certCard(f)` (views.js) is the certificate as a card rather than a lone
"Download my certificate" button. One function, both candidate call sites
(`V.transcript` and the promoted dashboard); the leader's stays its own because
`LDR_CERTS` carries a track and an issuer per row and this takes neither. Per
trap 12 it lands in the head band, and on `promoted` it is the *second* dark
card there, so §56 spans it across both columns underneath — written down, not a
surprise. Do not add a third.

### THE COURSE OUTLINE — §110, `outlineSec` + `CH_SYL` — AND IT NEEDED NEW COPY

Maryam, 3 Sep 2026, with a Coursera reference: *"i do not want to tell a generic what
you'll learn and skills you will gain, i want a course outline section here and each course
will have its own what you will learn and skills you will gain … each chapter will be listed
… follow our collapse component for this"*, then *"give spaces between each chapters more.
also do not open a chapter by default. you see on coursera, on hover the course details
button appears. also show the certificate at the bottom just like coursera."*

`learnSec()` — one generic tick list and one row of chapter-title chips — is **deleted**.
The page's third block is now thirteen `.acc` rows, each with its own "What you'll learn"
and "Skills you'll gain", plus a certificate row that does not open.

- **THE SYLLABUS IS NEW PROTOTYPE COPY AND THAT IS THE ONE THING TO KNOW.** `CH` is a title
  and a duration, so **39 outcome lines and 52 skill names in `CH_SYL` were written**, not
  derived. The build predicted this exactly: a three-chapter version of this panel was
  built on the black card on 2 Sep and removed, and its note ends "THE ONE THING THAT DID
  NEED WRITING was three outcomes per chapter … that is the honest cost of the block and is
  where a second attempt should start." §74's rule is about inventing CLAIMS the product
  then contradicts; this is a syllabus the build did not hold. **Read it before showing the
  page to anyone who knows the real curriculum.**
- **FOUR THINGS ARE DERIVED so they cannot disagree with another surface:** the chapters and
  their minutes from `CH`, the numbering from the index, and **`LEARN[0]` / `[1]` / `[3]` by
  REFERENCE** into chapters 7, 4 and 12 — the three competency-band outcomes `QZ_CH` already
  maps to exactly those chapters. `LEARN[2]` and `[4]` are deliberately not referenced: each
  is about TWO chapters (Directness is 5 and 9, Composure 11 and 13), so half the line would
  be about the chapter below it.
- **AND `LEARN`'s NOTE AND `QZ_CH` ALREADY DISAGREED ABOUT COMPOSURE** — that note pairs it
  with chapters 11 and 13, `QZ_CH` maps it to chapter 6. Pre-existing, flagged, NOT touched:
  `QZ_CH` has four other readers and this page is the wrong place to settle it.
- **THE CHIPS ARE SENTENCE CASE, WHICH IS §63 §2 AND NOT THE REFERENCE.** Coursera sets
  Title Case; a skill is a phrase, not a name. Chapter titles stay Title Case because those
  are titles. One line to reverse.
- **THE STATE IS `S.outl` AND A DOM CLASS — §65's SPLIT, AND BOTH HALVES ARE NEEDED HERE.**
  `.acc`'s own handler keeps its open row in a class alone and its note says why that is
  safe *there*: "`.acc` is on pages nothing re-renders under the reader." **False on this
  page** — the ask dock is at its foot and Tal answering repaints it. And `render()` on the
  click is the other half: it resets the scroller, so opening chapter 11 would throw the
  reader back to the header. Class for this interaction, `S.outl` for the next render.
  Verified: opening row 3, calling `render()`, row 3 still open.
- **`null` IS THE DEFAULT, WHICH REVERSED THE SAME DAY'S FIRST ASK** and is right on the
  drawing — chapter 1's panel is ~200px, which pushed the other twelve rows below the fold
  and stopped the section reading as an outline.
- **THE `data-outl` BRANCH MUST RUN BEFORE THE GENERIC `.acc-h` ONE.** Those rows ARE
  `.acc-h` buttons and that branch moves `.on` and RETURNS, so underneath it `S.outl` would
  never update. The removed black-card version named this trap in advance; §76's `S.bkSlot`
  is the same hazard against the shared `.slot` handler.
- **THE HOVER LABEL IS ARMED IN `build.py`, AND `.ol-row` EXISTS ONLY FOR THAT.** Trap 6
  rewrites every `:hover` to `:hover:where(.__nh)` and `.__nh` is on no element, so
  "Chapter details" could never appear without a `HOVER_KEEP` entry. **`'acc-h'` could not
  be the entry** — that list matches by `endswith`, so it would arm §04.53's row wash and
  §10.711's for every accordion in the product. Trap 18 is the other half: write the
  `:hover` PLAIN in the layer or `build-ds.py` refuses to write. It is `display:none`, not
  `visibility:hidden` (a reserved width puts a phantom gap beside the chevron) and not
  `opacity` (trap 2). It also shows on `.acc-i.on`, which is what carries it on a touch
  screen. **"Chapter details", not "Course details"** — the reference's rows are courses.
- **§110 IS FIVE CORRECTIONS AND NOT A COMPONENT**, and four of them are rules the panel has
  to un-say: §05's 68ch prose cap on `.acc-b` (measured — the two-column list was one column
  at 1280), §87.1c's divider on the *first* subhead, §87.1's 24px list margin (now
  `--sec-h-gap`), and §04's 8px row padding (now 16, which is the "more space" ask). The
  fifth is **trap 13 in a third direction**: §87.1a keyed the label-column opt-out on
  `:has(> .lrn)`, a DIRECT child, and the list is now three levels down inside `.acc-b`.
  §69 lost an opt-out by *removing* content, §65 and §73 by *adding* a wrapper, this one by
  moving the content the opt-out was keyed on. **Every existing accordion in the build has
  no heading over it**, so this is the first headed one.
- **WHAT WENT WITH `learnSec`:** `SKL_SHOWN`, `skillsSheet`, `S.sklAll`, its two click
  branches, the `S.view==='enrol'` gate in `render()`, §87.2's `.skl-more`, §87.3's
  `.skl-full` and §63 §22's type for the control. A chapter's four skills are one line, so
  there is nothing to truncate and no "Show all" to reveal — §60's test for whether a
  control may exist at all. Every argument is kept in place.
- **AND THE BOX HAD NO RECIPE FOR ANY OF IT.** `gallery.html` wrote neither `.lrn` nor
  `.skl` — the design system had been shipping §87 with nothing documenting it, the same gap
  §105's `.conf` had. Both are now in the gallery, and the outline's entry is live so the
  hover can be pointed at.

### PAYING LANDS ON WEEK 1 — §109, `enrolSheet` — AND `V.welcome` IS UNREACHED

Maryam, 3 Sep 2026: *"instead of this screen, i want you to take the user on the next
prototype that is Week 1 but on that view, a modal of success icon on top and then
'Successfully enrolled' with some description, and a secondary button 'Close'."* So the
flow is **Enroll → Payment → the week 1 dashboard with the receipt as a dialog over it**,
and the section below on §69 describes the screen that is no longer in it.

- **IT IS §105.6's CONFIRMATION DIALOG, NOT A NEW COMPONENT.** `.modal > .sheet.conf` is
  the centred dialog the delete-account flow already draws — `.conf-mk` for the 48px
  ringed mark, `.conf-t`, `.conf-x`, `.conf-a` — and every decision in that layer is one
  this wants: square corners, two hairline rings instead of a glow, no rule above the
  footer, §64's arrow off the action. **§109 is one selector**: `.conf-ok` re-points the
  mark to §02.440's success pair (`--support-success-bg` behind it, `--support-success` in
  the rings and the glyph). No `--conf-hue` token — two callers is not yet the case for
  an indirection.
- **IT NEEDS AN ANIMATION RATHER THAN §02.398's TRANSITION, and that is the half a second
  portal cannot guess.** Every other sheet is born at `opacity:0` and gains `.on` when a
  press flips a boolean; this one is rendered by the same paint that draws the whole week
  1 page, so there is no previous computed style to transition from and without a rule it
  is simply already there. §109.2 gates a `mo-up` / `mo-fade` pair on
  `data-open~="enrolOk"`, which is why `enrolOk` is in `render()`'s `OVERLAYS`.
- **THE HANDLER SETS THE FLAG *BEFORE* `setStage('week1')` AND THAT ORDER IS THE
  MECHANISM.** `setStage` ends in its own `render()`, so a flag set afterwards needs a
  second paint — and a repaint at an unchanged stage/view/text key makes `typeSummary`
  print instantly, so week 1's summary would arrive already typed. `setStage` does NOT
  clear the flag, which is why the render gate is `S.enrolOk && S.stage==='week1'`.
- **THE COPY ANSWERS THE PAGE UNDERNEATH.** §69's own argument against `stage:week1` — "a
  strange place to be thirty seconds after paying" — is still true and is a real cost of
  this ask, so the description says what is true of that dashboard (chapter 1 open today,
  per `PAGESUM.week1`) rather than `V.welcome`'s "nothing is due until chapter 1 unlocks".
  The card is read off `S.cards`, not typed (`bkStamp`'s rule).
- **`V.welcome` IS STILL IN THE BUILD AND IS REACHED BY NOTHING.** `#assessed/welcome`
  still draws it and `respcheck` still sweeps it. Left rather than deleted because taking
  it out takes §69.6's `.wpair` grid, `leaderCard`'s `lab` argument, `PAGESUM.welcome` and
  the `welcome` rows in `PARENT` / `TALCTX` / ai4's crumb table with it — a screen's worth
  of deletion this ask does not name. **Say so before deleting it.**
- **AND `.conf-t` HAD NEVER BEEN A TITLE — §63 §45.** §105.6's note claimed the title,
  the description and the label are "roles §63 already states"; §63 sizes `.sheet-h h2`
  (a header BAR) and a bare `<h2>` in a `.sheet-b` is in no list, so it fell to
  `--t-body` and **measured 13.5/400 against a 13.5/400 description**. It is
  `--t-sec-size` / strong now — §78's "the build's 16px role" — and **both dialogs
  moved**, which is the point rather than a side effect: one component, one rank. Found by
  measuring the second caller, which is the general shape of it (a component tested
  through one call site is not tested).

### THE PROFILE PAGE — §111, `PF` / `pfPanel` — THREE TABS, SIX SECTIONS, ONE RECORD

Maryam, 3 Sep 2026, over eight messages in one session, with her own LinkedIn profile as the
reference. **It moved three times and the two reversals are the useful part of this note** —
read them before proposing either shape again.

| ask | what was built | what replaced it |
|---|---|---|
| a Quick Action whose mark is a **progress circle** | `pfRing` on `QA_NEW` | still there |
| "replace the modal with the complete screen view … back button, Edit Profile heading, **stepper**" | `V.profileEdit`, §56's `.stps` made pressable over six steps | **deleted an hour later** |
| "we have an edit icon with each section … allow editing **that section only**" | `S.pfEdit`, a section's panel becomes its form in place | still there |
| "**merge all these in one tab** … the tabs here should be My Profile / Notifications / Privacy Settings" | the six sections stack on tab 1; tabs 2 and 3 are the account | still there |

**`PF` IS THE RECORD AND NOTHING IS TYPED TWICE.** `pfMiss(k)` returns the WORDS for what a
section is still missing, `pfSecDone` is `length === 0`, `pfDone()` counts the finished
sections. The ring on the dashboard, the "3/6" in the tab strip and the "N still to add" note
under a panel all read that one function, so filling the two empty Education fields moves the
dashboard's figure with no second edit. **Three of six is 50%**, and the three gaps are the
reference's own: no degree or field of study under COMSATS, no description on the Tkxel role,
nothing but Companies under Interests.

- **COMPLETION IS COUNTED BY SECTION, NOT BY FIELD.** Fields were tried first and measure the
  wrong thing — Experience's twenty-odd filled cells against Education's two empty ones came
  out at 90%, which says "nearly done" about a page with three sections still to answer.
- **THE ACCOUNT EMAIL IS THE PRODUCT'S, NOT THE PROFILE'S.** LinkedIn's contact card carries a
  personal address; `V.account` has printed `maryam.naz@tkxel.io` since it existed. **The phone
  number IS the reference's** and is now in a file Vercel serves publicly — worth knowing.
- **THE SKILL COUNT IS THE LIST'S LENGTH.** LinkedIn says "Skills (26)" and shows twelve.
  LinkedIn's seven **Services** are folded into `skills` rather than given a seventh section.
- **A SECTION IS FINISHED IN WHATEVER ORDER THE READER REACHES IT, AND THAT IS WHY THE STEPPER
  WENT.** §56's rail paints the segment right of a finished step in `--accent`, which is right
  for four milestones that happen in order; here it lit the legs after steps 4 and 5 and left
  1 and 3 grey — a meter with holes in it. The second instruction reached the deeper answer.

**THREE MEASUREMENTS FROM THE DELETED SCREEN ARE KEPT IN WORDS in §111.2** and are the things
worth having again: a page that wants its own `<h1>` **cannot put it in the `.ph`** (§78's
`stripPageHead` removes it unconditionally, and then `placeBand`, `tidyPh` and `pageLabel` all
change behaviour); `.ph-backonly`'s padding is 16 above and nothing below, because a 40px
control paying a 26px title's separation is ~100px of white; and `.ph-back` needs
`margin-left:-8px` in a block that pays the page gutter itself.

**THE RING IS SIZED TO THE TEXT BESIDE IT AND THAT TOOK THREE TRIES** (§111.1) — 42px, stated
as `calc(--t-h4-lh + --s02 + --t-compact-lh)`, which is §86's `--gcard-art-h` technique.

- **STRETCHING MEASURES THE WRONG BOX.** `.qa-c` is `align-items:flex-start` with
  `min-height:74px`, so a stretched item takes the FLEX LINE's height — the tallest card in
  the row, a fact about its neighbour.
- **AND `height:100%` + `aspect-ratio` IN A GRID PAIR IS CIRCULAR HERE, although §75.3
  recommends exactly that shape and is right there.** Built and measured: it settles at 80×80,
  because the ring's width feeds the `auto` track, which narrows the text, which wraps it to
  three lines, which grows the row, which widens the ring. §75.3's portrait escapes the loop
  because the facts beside it are a fixed number of lines whatever width they get.
- **THE THREE CARDS SIT ON ONE LINE AND THE MARK CENTRES ON THE PAIR.** §79 widens the Quick
  Action grid at a third card, so each is 271px and the description takes two lines — 61
  against a 42px mark. Growing the calc to 61 does not fix it: 19px more mark leaves 124px of
  text and the TITLE wraps too. 42 is the largest value at which the title holds one line;
  `align-self:center` is the one place this reverses §70.6.

**THE PROFILE PAGE IS THREE TABS AND THE SIX SECTIONS ARE TAB 1.** The strip is §15's
`.cs` + `.sec.sec-cs`, stated by nothing, sitting directly after `ph()` — which is both what
"after the tal section" names and what stops `placeBand`'s run (the job `leadSec` used to do).

- **THE SIX ARE EMITTED FLAT, NOT WRAPPED — trap 13.** A `<div>` per section would put every
  `.sec` one level below `.page`, which is what §10.2's closing hairline, §14's rules and
  §20's `+ .sec` pairs all key on. `data-pfsec` rides on each group's first `.sec` instead,
  on BOTH its read view and its form — the scroll runs after the render that swapped them.
- **EDITING SWAPS THE HEAD ROW'S CONTROL FOR TWO** (`pfActs`): Save Changes on the right,
  Discard Changes on its left as `.btn-t.danger` with `I.delete` leading and the border taken
  off. `pfFoot`'s bottom Cancel/Save row is deleted — the control that opens a section and the
  ones that close it are the same 40px of the same row. **`.app .btn.pfe-discard` is (0,3,0)
  because §16.673's `.app .btn.danger` is** — a (0,2,0) restatement lost silently and the
  border stayed red.
- **PRIVACY SETTINGS IS EVERY PROMISE THE PRODUCT HAD ALREADY MADE.** Clause 6 of the Data use
  notice says "Profile holds every switch: pause Tal, ask for a level review, download
  everything we hold, delete a recording, or close your account", and Profile held none of
  them; `PAGESUM.account` has been promising "what I'm allowed to remember" over a page with no
  such block. Nothing here is invented. **Reset password** is `S.pfPw` — its own boolean and
  not a seventh `S.pfEdit` key, because a password is not a section of the profile and a
  seventh key would need excluding from `pfDone`, `pfMiss`, the tab count and the scroll.
- **THE STRIP DRAWS NO RULE UNDER IT** (§111.6a). §10.2's `::after` closed the strip's section
  24px under the tabs, one pixel above the panel's own 24 — and `.cs` already carries a
  `border-bottom`, so the boundary was drawn twice with 24px of nothing between. Both the rule
  and the padding go, scoped by a `pf-cs` marker rather than by `.sec-cs` (three other pages
  wear that class).
- **THE BAND AND THE STRIP ARE STICKY, AND THE STRIP'S `top` IS THE BAND'S HEIGHT** (§111.10 +
  `placePfStick` in ai11). That offset is the one thing CSS cannot do: the band is ~90–200px
  depending on frame and stage. **It is measured in ai11 because that is after `placeBand`**,
  and it is watched by a `ResizeObserver` because the synchronous read is taken while §01's
  `.device` transition is still running — measured, `--pf-stick` came out **2514px** on a band
  that settles at 97, which parks the tabs a screen and a half below the fold with nothing
  thrown. Every `.sec` on the page gets `scroll-margin-top` for the same reason.
- **INTERVIEW SCENES IS `SCENES.level`, SIX UPRIGHT CARDS IN A SCROLLER** (§111.9), after
  About, with two chevrons in the heading row. The agent is read off `S.booking` / `S.agent` /
  `recKey()`. **Flagged: the section draws on every stage, including the ones where no
  interview has happened** — the gate is one line if it should not.

**AND FIVE THINGS ABOUT THAT PAGE WERE CORRECTED LATE ON 3 SEP 2026, ALL OF THEM SIDE EFFECTS
OF THE STICKY PAIR OR OF `.all-desc` DOING TWO JOBS.** Every one was invisible from the source
and obvious on the page, which is the shape worth recognising.

- **THE RAILS WERE PAINTED OVER BY THE PAGE'S OWN FURNITURE — §111.10a** (*"on the profile
  module the side borders of the content window are not starting from the top"*). §10.1 draws
  them as `.page::before` / `::after` at **`z-index:1`**, and §111.10 then put the band at 4 and
  the strip at 3 with an opaque `--background` behind each. Those two are `.page`'s own children
  in `.page`'s stacking context (`position:relative`, no `z-index`, so it creates none) and are
  its full width, so for ~150px the column had no edges. **The rails are `z-index:5` on this
  page**, gated `:has(> .sec.pf-cs)`; §10's own note — "the rails must outrank the rules they
  cross" — was already the argument. Taking the sticky ground off instead is not an option: a
  sticky block the page shows through is not sticky.
- **THE STRIP WAS 40px TALLER THAN ITS TAB ROW, AND BEING STICKY THAT WAS 40px OF CLIPPING**
  (*"there is really something beneath the tabs on My profile page … remove that gapped row"*).
  Two causes, and §111.6a's note had claimed both were already answered: **§20's desktop pair
  rule** handed the section `padding-bottom:var(--s06)` from fourteen classes inside a container
  query, so §111's (0,3,0) zero held on a phone and lost at desktop — trap 4, fixed by adding
  `:not(.pf-cs)` to §20's own list — and **`.cs` carries `margin-bottom:var(--s05)`** (§10.4),
  never counted at all. Measured 89 → **49**, and `scroll-margin-top`'s stated clearance came
  down from 89 to 49 with it.
- **THE SCENE ROW BLED LEFT BECAUSE §14.2 STRUCK OFF HALF OF §10.3's IDIOM.** The row was
  written with a negative `--pad-x` margin and the same padding back, which is right in a
  section that pays no gutter to its children; `.app .page:not(.form-page) .sec:has(> .sec-h) >
  :not(.sec-h){padding-left:0}` is (0,6,0) in the desktop tier, so the padding went and the
  margin stayed and the first card sat on the rail. **The left side now asks for nothing** and
  the section's gutter places it; the right keeps the negative margin and gives up its padding,
  so the last card runs under the rail. Verified `rowLeft === h2Left` at 390 / 744 / 1440.
- **THE THUMBNAILS ARE 240 × 320, WAS 168 × 224** (*"increase the size of the scenes
  thumbnails, let them scroll if increasing the size cause that, we have arrows for that"*).
  168 was chosen as "five and a bit across the desktop column" — a measure of how many fit, not
  of how big a clip should be. The column holds three and a bit now and the chevrons step one
  card plus the gap (256px, read off the card rather than stated twice).
- **A SCENE CARD IS HEADING, DESCRIPTION, THEN §108's `.eo-lead`** (*"Heading, Desc, Interview
  with — this needs ui improvement, show this how we are showing the cohort leader, instead of
  cohort leader the text will be 'Talent Agent:'"*). The attribution used to open the card, so
  all six started with the same six words. It is the enrolment card's leader row **verbatim** —
  `.eo-lead` + `.eo-lead-ph`, a 24px disc, `.t-desc` with the name in `<b>` — which needed
  nothing new because §108.2 states it unscoped on `.app .eo-lead`. **Check that before
  borrowing any class out of a page layer.** `.scv-who` and its rule are deleted, and the row is
  a sibling of `.scv-b` rather than a third line inside it: `.scv-b`'s gap is 2px for a title
  and its own sentence, `.scv`'s is 8, and `margin-top:auto` on a stretched flex card pins all
  six attributions to one line (§72.2's idiom).

**AND THERE IS NO SECTION DESCRIPTION ANYWHERE ON THE PAGE** (Maryam, 3 Sep 2026: *"I do not
need any section desc in the settings page"*). Eleven came off — five over the read sections,
five over the forms, one each over Notifications, Sign in and security, What Tal can do, Your
data and Interview scenes. **`pfHead`'s third argument is deleted rather than left unpassed**
(the "gate nothing writes" tell), with all eleven sentences kept in its note in case one is
wanted back; four of them were `pfMiss`'s own words for gaps `pfGap` already prints under the
rows they are about.

- **`.all-desc` IS §16's LABEL-COLUMN OPT-OUT, SO REMOVING IT IS TRAP 13 AGAIN** — §69's
  "removing content does it too", one layer on. Four sections had no other route out (Interview
  scenes, Skills, Interests, Notifications) and each heading would have set in 184px beside its
  own content. **§111.11 states the opt-out for the whole page**, gated `:has(> .sec.pf-cs)`, on
  the honest ground that every section here is a record with an Edit control on its heading row.
  Swept: twelve headed sections across the three tabs plus the six forms, all `display:block`,
  `.sec-h` full width at 958.

**`profileSheet` IS DELETED** — the "Edit details" modal, `S.editProfile`, its `OVERLAYS` entry
and its `[data-editprofile]` branch. All four of its controls are on the General Details form.
`photoSheet` stays with two callers.

**Five traps this walked into, all of them already in this file and all of them silent:**

1. **`typeof` DOES NOT SAVE YOU FROM A `const` IN TDZ.** `pfScenes` called ai7's `bkAgent`
   behind a `typeof` guard; views.js's boot render reached it first, the guard **threw**, and
   the throw killed the rest of the bundle — ai7 through ob.js never ran. That is ob.js's own
   head note arrived at from the other side. Read `S.booking` / `S.agent` instead.
2. **A MARK MUST BE IN `IP`, NOT `PHP` — trap 7's quiet form.** `I.graduationCap` and
   `I.heart` are Phosphor names behind the `P` proxy; `I.<phosphor name>` returns an **empty
   `<svg>`** and the row draws a blank box. `I.book` and `I.idea` are the Material ones.
3. **`grid-column: 1 / -1` DOES NOT SPAN INSIDE `repeat(auto-fit, …)`** — the repetition count
   and the span are circular, so the item silently takes one track. State the tracks.
4. **A SMOOTH SCROLL DOES NOTHING HERE, SILENTLY.** Measured on the live page, same element,
   same tick: `scrollBy({left:184, behavior:'smooth'})` leaves `scrollLeft` at 0 after 800ms;
   `'instant'` leaves it at 184. `.main` carries `scroll-behavior:smooth`, and in `scrollTo`
   the option `'auto'` means "use the CSS value" — so `'auto'` is not the escape hatch,
   `'instant'` is. Both `pfScroll` and the scene chevrons say so.
5. **`offsetTop` NEVER MEETS `.main`, WHICH IS NOT POSITIONED.** A walk up `offsetParent`
   runs on to `<body>` and adds the whole frame's offset (measured: a 2563px scroll on a page
   whose target is near the top). `scrollIntoView` works the transform out itself; a
   `getBoundingClientRect` delta needs trap 15's scale divided out and is still fragile.

**Two §64 catches, both the documented opt-out:** a bare quiet button gets an arrow, so
"Cancel" came out "Cancel →" and "Add" read as navigating. **`.noic` is not the opt-out; an
icon in the label is** (§64: 57 buttons are written `.noic` WITH an icon).

### A JOIN IS SHUT UNTIL THE CALL OPENS — the gate is ON BY DEFAULT

Maryam, 3 Sep 2026: *"in cards where the time left in the call is more than a minute, show
a grey disabled join call button if it's in orange."* `crow`'s `o.gate` was opt-in and
only the leader's card took it; it is now `o.gate !== false` and every Join in the product
is gated.

- **`joinLive` ALREADY WAS THE ASK, so nothing about the window moved.** `JOIN_NOW`'s
  vocabulary is `now` / `starting` / `imminent` / `in N minutes`, so `CALL_ROW.iv`'s
  "in 1 minute" stays orange and `WEEK_CALL`'s "in 2 days" is grey and `disabled` with
  `joinShut`'s `title` on it. Swept: **the Cohort page's Join is shut at all seven stages
  and the booked interview's is open**; the leader portal has no Join at all.
- **THE DEMO COST IS REAL AND THE LEVER IS ONE STRING.** §60's five Joins were the
  prototype's own way into `callScreen`; the cohort call's door is now shut, so to walk
  that screen edit `WEEK_CALL.when` into `JOIN_NOW`'s vocabulary ("in 2 minutes", "now").
  The booked interview keeps a live door as the build stands.
- **§81 GREW A SECOND HOST — `.plate`, §81.2 + §63 §20.** That layer stated the unlit
  `--on-dark-fill` ground on `.dark-card` only, and a plate is the OTHER black card: it
  shares the ground, the haze and the ink register and **none** of the classes (§63 §6a's
  note is the same discovery from the ink side). §19's `.app .plate .btn-p` is (0,3,0), so
  the state selector is (0,4,0) and `background-image:none` is half the rule again.
  Without both, `disabled` on a plate's button is **invisible** — the exact failure §81's
  head describes.
- **THE ONE PLATE JOIN IS ON A HIDDEN STAGE.** `consult` is in `STAGES_HIDDEN` and
  resolves forward to `new`, so the consultant-call plate is not drawn today; its Join
  also carried no `data-call`, which made it a dead control that looked live. Gated at the
  markup anyway, with `CONSULT_CALL` (`{when, mins}`) stated once so the `data-when` and
  the gate cannot disagree.
- **`o.gate === false` IS KEPT AND NOTHING PASSES IT.** Normally the "gate nothing writes"
  tell; the difference is that the DEFAULT changed sides, so the parameter is read on
  every render and merely reads false nowhere.

### THE ENROLMENT FLOW — §69, `69-enrolflow.css` + `V.enrol` / `V.welcome`

Enroll → Payment → **Welcome**. The page that asks for $595 had the fee as a
three-row `.kv` tile 860px down with the only button on the screen under it, so
everything above the fold was context for a decision the page never got round to
putting. Seven things:

- **THE MONEY IS THE PAGE'S DARK CARD**, so `placeDark` puts it in the head
  band's second column beside the title — the same slot the `assessed`
  dashboard's `enrolPlate` occupies, one step on. That card is the *offer*;
  `checkoutPlate` is the *checkout*, and it is the only place on the page the
  three figures appear. Quiet by construction (§59: no clock, no black wall),
  and it reuses `ENROL_OPENS` verbatim so the start date cannot drift.
- **A `.plate-b` WHOSE ROWS ALL END IN A FIGURE IS AN INVOICE.**
  `splitPlateBody` (ai5) stamps `.plate-tab` and **drops the subject marks** —
  `PLATE_IC` leads on money, so fee / credit / due all matched the wallet and
  the card said one word three times. §69 rules the last row off as the total
  and §63 keeps `--accent-text` for `:last-child` only, because three figures in
  the accent is the card shouting a number, then a second, then a third.
  `enrolPlate`'s four rows have three with no `<b>` and are untouched.
- **`COHORT_LEAD` IS IN views.js AND `LEADER` (lead.js) READS IT.** Not the
  other way round: lead.js parses after views.js *and after its boot
  `render()`*, so `#assessed/enrol` off the hash would reach a `LEADER`
  declared there in the temporal dead zone — the hazard `notifList` already
  guards `LEAD_NOTIF` against. Name, range and "leading since" are stated once.
- **The leader is a `.tile`, not a `.plate`** — trap 12, one dark card per page,
  and a plate is "the one thing to do next" while there is nothing to do about
  Priya until the 90 days start. `row-lead` is what `V.booking` already uses for
  "who you have paid to spend time with". **The E4 page does not draw it**:
  `COHORT_LEAD`'s range is E1–E3 and her three cohorts are E3/E1/E2, so naming
  her as an E4 leader would be false.
- **THE LEADER IS INSIDE THE HEAD BAND, AS A THIRD MEMBER OF THE LEFT COLUMN**
  (Maryam, 28 Aug 2026): the `<h1>`, the fact row, Tal's sentence, **a divider**,
  then her. §56 reads that column as "title, facts, hairline, the wing, hairline,
  Tal" — the Enroll page has no wing (the journey stops at `assessed`), so this
  takes the slot the wing would have had, one row lower. Above the fold, because
  on a page whose whole job is a $595 decision, *who* you spend thirteen
  Thursdays with is part of the answer.
  - **`.head-sec` is how a view declares it**, and `placeBand` (ai5) takes it.
    Everything else that pass collects is recognised by what it *contains*
    (`_mhIsTal` looks for Tal's mark); a third member is a judgement about one
    page, so the view says so. **The loop is a run from the `.ph`**, so the
    section must be written directly after `ph()` — and it still lands *third*,
    because `placePageSummary` inserts Tal's card after the `.ph` two passes
    later. That ordering is load-bearing.
  - **The divider is on top and there is none underneath** — §56's wing rule
    turned over. The wing draws a `border-bottom` because it comes first; this
    member comes last, so the band's own full-bleed closing rule (§25.2) ends
    the block. §69.4 also kills the section's `::after`, the `.tile`'s ground
    and `.row-lead`'s inset and underline: inside the band every member is
    transparent and on the spine, and a hairline 28px above the band's own rule
    reads as a section that failed to close.
- **The card is a face, a name and a role line, and nothing else.** It had two
  fact rows about the call and a sentence in her own voice; both went with the
  move — the logistics are said again in "How your cohort works" and in the
  confirmation's "What happens next". The one `.kv` left is `V.welcome`'s
  "Leads Cohort 41", which is the assignment itself.
  **THE SUBTRACTION TOOK THE LABEL-COLUMN OPT-OUT WITH IT — trap 13, the mirror
  of §65.1a.** The section was opting out through `.sec:has(.kv)` *because of
  those rows*; with them gone it fell into the 184px column and nothing warned.
  §69.3 restates it on `:has(> .tile > .row-lead)`. Adding a wrapper is not the
  only way to lose an opt-out — removing content does it too.
- **§69.3 copies THREE of §10.15's four declarations, and §69.4 restates the
  gutter §10 took away.** The fourth declaration, `padding:0 var(--pad-x)` on
  the heading, is dead in §10: §14 zeroes every headed section's `.sec-h`
  padding at this width ("a section pays the gutter and its heading must not").
  Restating it from §69 un-does §14 and set that one heading 32px right of the
  three below it. **Copy what a rule does today, not what its source says.** The
  other half of the same trap: §10's grid also sets the *section*'s
  `padding-left:0`, and its own opted-out members get away with it because their
  content indents itself (trap 10) — a `.tile` does not, so §69.4 states it.
- **The order is the order of the questions** (Maryam, 28 Aug 2026): the band
  answers what-and-how-much and *who* before anything scrolls, then WHAT you
  would learn, HOW the cohort runs, and last the four figures that recap all
  three.
- **"How your cohort works" is the §65 disclosure with `key='cohort'`,** and its
  lede sits **outside** `.found-b` so the block still says what a cohort is
  while it is shut. §69 gives the section its full bottom padding back in that
  case; §65 takes half of it away on the reasoning that a closed disclosure is
  one row, which stops being true the moment there are two.
- **`V.welcome` is the receipt, and `V.booking`'s note is its argument.** Paying
  went to `stage:week1` — day 4 of the 90, "Welcome back", a chapter already
  open — which confirms nothing and opens in the middle. It **does not move the
  stage**; the button at its foot does, exactly as the interview's confirmation
  works, so the rail still shows the `assessed` set while it is open. It is also
  **the first place the cohort has a number**, which is the other side of
  `PAGESUM.payment`'s "your cohort is assigned as soon as it clears".
- **The hand-written Tal card came off `V.enrol` and nothing was lost.** Trap 11:
  `placePageSummary` was already replacing its heading and body with
  `PAGESUM.enrol` and step 1b was already removing its chip, so neither had been
  on screen. The words are in `PAGESUM.enrol`, which lost the money with the
  card gaining it and now carries the hours — the one thing no figure states.

Two latent bugs in `PH_IC` (`factIcon`'s table) fell out of this and are fixed:
`\bDec\b` does not match "December", and `star` — the LAST row, so the catch-all
— matched **"Starts"**, which is how "starts 1 December" came out as a trophy.

### THE OTHER AGENTS WERE BUILT AND REMOVED THE SAME AFTERNOON — 3 Sep 2026

Maryam: *"I need to show three agent beneath the black card, this section will have the
'Other Agents' heading and a button on the right side 'View All Agents'"*, then twenty
minutes later *"take back how this page was means remove the agents."* So the `new`
dashboard is Tal's card and Quick Actions again, `talRec` has its heading-row "View all
agents" back, and `otherAgents` / `OTHER_N` are deleted. **§70's argument survived its own
reversal** and is the thing to read before a third attempt: "a shortlist is a list you still
have to work through. An AI-native page does the working." The rail of three came off for
that reason, went back under a heading that said *Other* rather than *Book your interview*,
and came off again.

- **WHAT IT WAS, IF IT IS ASKED FOR AGAIN.** No CSS at all. The three were
  `AG_ORDER.filter(k => k !== recKey()).slice(0,3)` — **derived, which a hardcoded list gets
  wrong**: `S.recKey` cycles when the card's "Show me another" is pressed, so a fixed
  owen/lena/samuel recommended Owen at the top and offered Owen again 80px below. The cards
  were `agentCardH` in a plain `.rail` (§14.496 lays that out as equal cells at desktop, a
  column below 900), and the heading's control was `.btn.btn-t.btn-sm.noic.sec-h-act` —
  which is what answered trap 13, since §16.567 hands any section carrying one §10.15's
  label-column opt-out.
- **MOVING THE CARD'S BUTTON DOWN TO IT WAS RIGHT AND IS ALSO REVERSED.** Two controls
  reading "View all agents" 200px apart pointing at one view is the duplicate §112 deletes
  on the leader dashboard. With no section, §75.3's own note is true again — the card's
  heading row is the nearest honest place.
- **`AG_ORDER` SURVIVES WITH ONE READER.** It replaced a literal six-key array inside
  `V.agents` so the two surfaces could not disagree about who exists; the second reader is
  gone and the named list is still the better statement (the order is a decision — Priya
  first, she is `REC_ORDER[0]` and the cohort leader — and `Object.keys` is not a thing to
  depend on). `REC_ORDER` stays separate: "who Tal will recommend" against "who can be
  booked at all".
- **AND THE REVERT ITSELF BROKE THE BUILD FOR ONE CYCLE, WHICH IS WORTH RECORDING.**
  Deleting the block by character range (from the note's start to `const recKey`) overran
  into `const REC` and the four `S.recKey` / `S.bkMo` / `S.bkSlot` / `S.recBusy` lines that
  sit between them — so the boot `render()` threw `REC is not defined`, and per the ob.js
  trap that killed the rest of the bundle and left `NIL` and every other late const in TDZ.
  Restored verbatim from HEAD and checked byte-identical. **The check that catches it is
  `comm` over every top-level declaration in HEAD against the working file**, not reading
  the diff — a deletion that spans two unrelated blocks looks plausible in a diff.

### THREE MORE FIXES FROM THE SAME AFTERNOON, all 3 Sep 2026

- **"Read the full report" is off the Cohort 41 record** (*"remove the read the full report
  button"*), and §65's third decision goes with it — that argument ("it is useful whether or
  not the summary is open") held while this heading row was the only route to `V.report`.
  It is not: `signedSummary`'s foot carries the same words, `SUMDROP.report` offers them as
  Tal's action, and the Interviews module is a rail click away. **`foundHead`'s second
  argument is deleted** — the only other caller passed `''`. **What it costs is one press on
  `promoted/transcript`**, which draws `signedSummary` with `footAction` off, so that page
  now has no direct link to the report; flagged, and the honest place for one is
  `signedSummary`'s foot.
- **The disclosure's lede aligns with its heading's TEXT and sits 8px under it** (*"the
  cohort desc should align and close to the 'Your Cohort 41 record'"*). Two defects, both
  measured: the sentence started 28px left of the heading — `.found-chev`'s 20px box plus
  `.found-t`'s 8px gap — and the pair read 12 apart. §69's `margin-top:var(--s04)` was
  competing with §16.502's `--sec-desc-gap`: sibling margins collapse to the larger, so 12
  beat 8 and **the token had no effect on any disclosure in the build**. Now `margin-top:0`
  and `margin-left:calc(20px + var(--s03))`. **It shipped with `--s04` for one build** — 12
  against the gap's 8 — landing the lede four pixels PAST the heading, which is why the
  check is `descLeft === h2Left` and not "looks about right". Verified 0px at 390 / 744 /
  1500. Both disclosures that draw a lede move, which is the point: one component, one
  alignment.
- **The Course Outline's certificate row shows the real badge** (*"show a real badge instead
  of icon"*). `I.certificate` in §02's 40px `.cardrow-ic` chip becomes `CERT_ART.explorer` in
  `.crt-art` — the level certificate's own artwork, which `certAll` stamps `k:'explorer'` on;
  the other five badges are `CERTIFS` achievements with gates and none is what finishing
  thirteen chapters issues. §110.1d re-points `--crt-art-w/h` to **44 × 48** (70/76 is
  0.9211, 44/48 is 0.9167 — half a percent), which is §96's own mechanism and §105's third
  caller. 48 rather than 40 because the row is a title over a description: a badge exactly
  as tall as the text reads as a third line. **The chip went with the glyph** — a tinted
  square behind photographic artwork is §72's box-in-a-box and §106's "artwork is not a face".

### THE AI-NATIVE HEAD — §70, `70-ainative.css` (Figma 578:5966)

**The `new` dashboard only**, and it turns §56's band round: Tal's sentence is the whole of
the left column on its own warm wash, the four steps are a numbered list in the right one,
and the page's next step is ONE agent Tal picked rather than a rail of three. Four sections
came off — the dark plate, the `agentCardH` rail, `quizResults`, and `wingBlock()` inside
Tal's card — and all four are said once somewhere else now (`talRec`, `jrnList`, and a Quick
Action pointing at `V.result`). Everything else on the page is `talRec` / `quickActions` /
`jrnList`, all in views.js beside `journey()`.

**The right column is a `.head-sec`, which is the documented opt-in** — `placeBand` only
takes the ask line, anything containing Tal's mark, and a section the view has DECLARED as
head furniture. §70 then gives it column two, gated on `.modhead:has(> .sec-jrn)` so no other
page moves. Both columns are **top-aligned** (Maryam, 30 Aug 2026), which the file is not —
581:6662 and 587:6742 are both centred — and §56.2's `margin-top` on Tal's label has to be
zeroed inside the same container query or the two labels sit 16px apart.

**`placeBand`'s run now takes AT MOST ONE Tal section, and that was a real bug.** `_mhIsTal`
recognises a member by CONTENT — anything with `.ai-aura` or `.ai-label` — and there had only
ever been one at the head of a page, so the cap never mattered. "Tal's recommends" wears an
`.ai-label.bare`, so the run walked into it: the section went into the band, laid out in the
left column at 576px instead of the page's 901, and the photograph, the facts and the actions
each wrapped onto a line of their own. Nothing threw and nothing warned.

**TAL'S SUMMARY IS CAPPED AT 733 ONLY WHERE THERE IS A SECOND COLUMN** (Maryam, 1 Sep
2026: *"when there is no block on the right side of tal summary block then give its
summary full width rather than making it go on the second line"*). 581:6662's 733 of 925
is a measure stated in a frame whose right-hand side is occupied; applied to every band
it was landing on the **104 pages whose band is a single column**, where it is not a
measure but a ragged right edge — at 1280 the summary broke to a second line with 168px
of empty cream beside it, and on `assessed/level` the second line was the word "it."
Uncapped, those fall to §33.3's `max-width:none`, which is what that layer wanted
("a summary is two sentences read once"); §14's `.app .ai-body p{max-width:68ch}` is
(0,2,1) against §33's (0,4,1) and does not come back.

**THE GATE IS THE UNION OF THE TWO THAT BUILD THE SECOND COLUMN** — `:has(> .head-col)`
(§70/§73's own) and `:has(> .sec-dark .plate)` (§56's). Swept over all 146 pages that
draw a summary, the pair matches all 32 two-column bands and none of the 114
single-column ones. **`:has(> .sec-dark)` alone is the obvious short version and is
wrong**: it also matches ten single-column bands whose dark card is a `.cert` or a
`.lvl-hero`, which §56 leaves under the head rather than beside it.

**The travelling light is ON THE ASK FIELD ONLY, and it STOPS.** The file parks a 374×2
blurred bar on two edges — the summary panel's bottom and the dock's top — and both were
running for one build. The summary's is off (Maryam, 30 Aug 2026): that panel's sentence
types itself in (§52), so a light going round it is a second animation competing for the same
two seconds on the one block the reader is already reading. §25.2's `display:none` on
`.modhead > .sec::after` takes it away on its own, so the selector is just gone from §70.1's
list — nothing turns it off.

The dock's **runs continuously, slowly, and never blinks** — `--ai-lap` is 9s, which on that
field's ~2080px perimeter is about 230px a second. A build in between ran it twice and faded
it out, on the reading that Google's field animates "for a little time"; the half worth taking
from Google is that the motion is slow and smooth, not that it ends. Ending gave the block a
break point, which is the one artefact a light like this cannot have — it dimmed out mid-edge
and came back on the next render, so the field flickered on every navigation. **The loop is
seamless because the conic is**: the angle runs 0→360deg on `linear`, and the gradient is
transparent at both 0% and 100%, so the frame after the wrap is the frame before it.

**The ramp is 581:6584's own five stops, mapped onto a 22% arc** — each of Maryam's
percentages placed at `74 + p × 0.22`, which preserves the file's spacing between them. The
two outermost stops are *transparent* white, which the file does not need and this does: on
the file's bar the white ends sit on white paper, and on the ring they sit on the dock's
orange border, where a hard white end reads as a bright gap chasing the light round.

**It is a STROKED RECTANGLE WITH A DASH ON IT**, and the two techniques it is not are both
worth knowing, because each looks correct while you write it and neither survives a 976×64
field:

- **`offset-path`** — a real 374×2 element on `offset-path:border-box`. Constant linear speed,
  which is the right pace, and the element is *rigid*, so it cannot turn a corner. Its anchor
  is its own centre, so near a corner half its length hangs off the edge and paints outside
  the field; and `offset-rotate:auto` follows the path direction, which on a rectangle is a
  step function, so it snaps 90° between frames. Overshoot and jerk.
- **conic + mask** — a conic clipped to a 2px ring. Cannot leave the box and has no
  orientation to snap, so it fixes both of those, and it **stretches**, which is worse. A
  conic sweeps a fixed *angle*, and on a flat rectangle a fixed angle is a wildly variable
  *length*: at the middle of this field's top edge one degree moves ~0.6px, at its corner
  ~8.5px. The light stretches along the top, collapses through the corner, stretches again.
  An earlier note here worked the error out per-edge, got 1.5×, and called it small — that
  arithmetic is right and answers the wrong question. **The variation *within* one edge is
  15×, and that is the one you see.**

A dash is a *length of the perimeter*: same pixels wherever it is, one speed because
`stroke-dashoffset` is measured along the path, and it bends round corners because the path
does. Nothing about it is aspect-dependent. `pathLength="1000"` renumbers the perimeter
whatever the field's real size, so `stroke-dasharray:180 820` is 18% of the border — 374px
here, the file's own bar length — and the two sum to 1000, so the pattern tiles the path
exactly once and the loop has no seam.

**The markup is half of it** and lives in `AI_RUN` (ai4.js), because an SVG cannot be a
pseudo-element. The rect carries no geometry attributes — §70 sets `x`/`y`/`width`/`height`
as CSS geometry properties so the line insets itself by half its stroke without the markup
knowing the dock's size. The gradient is the file's five stops laid corner to corner; a
stroke samples its paint by position rather than carrying it along the dash, which is the one
place this cannot do what the file does, and is not nameable on a 2px blurred line.

**Reduced motion needs its own block** — §13.187 clamps every duration to 1ms, which on an
infinite animation is a strobe rather than "off". It parks the dash on the top edge, where
581:6584 draws the bar standing still.

**§63 §10 owns every size, weight, case and ink these families use** — including the two that
look like mechanism, the `color:transparent` under each clipped gradient and the three step
states. The step states are the file's `#00a43c` / `#f47113` / `#515151` (Maryam's call over
this build's AA rule; the first two read 2.8:1 and 3.1:1 and the note in §63 says so).
**Priya's fee is the one place the file does not win**: 581:6479 says $120 and
`AGENTS.priya.price` says $95, which is also what three other screens charge.

`70-ainative.css` has to be in **both** build lists. Leaving it out of `design-system/
build-ds.py` is worse than it sounds and is why that entry carries a long note: §63 IS in
that list, so the design system shipped `.jrn-pill`'s ink with nothing to draw the pill and
`.rec-alt`'s `color:transparent` with no gradient under it. Grep the output for a class §70
introduces after either build.

### THE WEEK PULSE — §72, `72-weekpulse.css` + `pulse()` (views.js)

Figma 599:7418. **The three enrolled dashboards drew one question as three panels.** Under the
head band, `week1` / `day34` / `day90` ran "This week", "Time on the course" and "Where you
stand" as three `.sec`s — three headings, 1230px, all three answering "how am I doing". They
are now **one section headed "Your learning pulse"**: Tal's sparkle, a derived opening
sentence, and three columns — **Current focus** (the chapter, its ring, what the week already
holds, and the way in), **Your pace** (the week's minutes against the 55-minute target),
**Your standing** (`standRow`). Drawn in our own components throughout: the ring, `standRow`,
§65's `.stat` chip, §70's sparkle, `I.checkFilled`, `I.book` / `I.time` / `I.star`.

- **THE HEADING IS TAL'S AND IT MUST NOT WEAR `.ai-label` OR `.ai-aura`.** This is the one
  thing in the file that would break the page. `talFirst` **hoists** any `.sec` containing an
  `.ai-aura` to directly under the `.ph` (trap 11), and `placeBand`'s `_mhIsTal` claims a
  section containing **either** class as head furniture. §70 records that exact bug — "Tal's
  recommends" wore an `.ai-label.bare`, the band's run walked into it, and the section
  rendered at 576px instead of 901 with nothing thrown and nothing warned. The one-Tal cap in
  that run would save this section *today*, which is precisely the accident not to depend on.
  `.pulse-mk` is its own class painted with §70's `--ai-star` and `--ai-grad`, so the mark is
  the same object the band's label wears and **no pass can see it**. The words are in ink, not
  clipped to the ramp: §70 clips the band's label because that label is Tal *speaking*; this
  one heads a grid of figures, and a gradient heading over a table is the ramp as decoration.
  **It is 16px, and so are §73's two** — see the note on `--t-sec-size` below.
- **THE COLUMN MARKS ARE BARE GLYPHS AND THE LABELS ARE h4** (Maryam, 31 Aug 2026). §65's chip
  — 28px tinted square, 16px glyph — is the mark for a figure cell in a *continuous band*,
  where the chip is what separates one number from the three beside it. These three each open a
  column with a rule between them, so the chip was a box inside a box inside a box and three
  filled squares were the heaviest objects in a section made of hairlines. The hue survives and
  the wash goes; the glyph steps 16 → 20 because it now holds the line alone. The label goes
  11.5 → 14 with it: with no chip the pair stopped being a figure-cell heading and became the
  section's own subheading, and the section reads 17 / 14 / figures rather than 17 / 11.5.
- **THERE IS NO BOX ROUND THE ROW — ONE RULE ABOVE IT** (Maryam, 31 Aug 2026), and the column
  dividers are **inset pseudo-elements, not `border-left`**. A border runs the column's full
  height, so it meets the rule above and the two form a corner — which turns three columns back
  into the table this section is trying not to be. `top`/`bottom` at the column's own `--s06`,
  so the line spans exactly the content box. §71.1c reached the same shape for the figure strip
  and used grid items in slack tracks, because *its* dividers had to sit centred in a negotiated
  gap; here the columns are equal `1fr`s and the divider belongs to the column it precedes.
  Below 900 it must be switched **off** (`content:none`), not re-pointed — it is absolutely
  positioned, so stacked it would draw a vertical line down every row but the first.
- **THE LEDE IS DERIVED, NOT WRITTEN, AND IS NOT A `PAGESUM` ENTRY.** Every figure in it is
  read off the same `f` / `g` / `pacePart` the columns are drawn from, so it cannot disagree
  with the block under it. That slot belongs to the head band, one per page, and
  `placePageSummary` owns it; this is the section's own opening line. The overlap with the
  band's summary is the chapter name and the 45 minutes — the band says what has *happened*
  (unlocked today, four of ten ahead of you), this says where you *are* in it.
  **One accent phrase, and it is the chapter name**, because it is the only thing in the
  sentence not reprinted as a figure below. The `<b>` figures stay in primary ink: §70.2's
  tinted ground belongs to the band, and lighting a number here that is printed 40px lower at
  four times the size is the same figure shouted twice.
  **The second clause collapses when the two figures are the same number** — day 34 has 12
  minutes on chapter 4 and 12 on the course this week, and "12 of 70 … and have spent 12"
  reads as two facts that happen to agree.
- **THE GRID COUNTS ITS OWN CHILDREN.** `grid-auto-flow:column` with no
  `grid-template-columns`, because **day 90 has two columns** — every chapter is finished and
  `pulse` does not emit the focus one. `repeat(3,1fr)` leaves an empty third track with a
  hairline hanging in space. `minmax(0,1fr)` on the auto columns, because the standing
  figures are `white-space:nowrap` by §29 and a `1fr` floor is `auto`.
- **THE COLUMN HUES ARE NAMED, NOT CYCLED** — `pulseCol` writes `--mk` inline. §65's decision
  squared: with the focus column absent on day 90, an `nth-child` cycle would make "your pace"
  green on day 34 and blue on day 90.
- **THE PACE BAR IS UPRIGHT TICKS IN THE COLUMN'S OWN HUE, AND BOTH REVERSE §71.1b.** That
  layer draws a 2px rail in the AI ramp because it is in *Tal's band* and the amber says whose
  block it is. This is a figure column with a green clock chip 100px above it: `--mk` ties the
  mark and the bar into one object, and 14px upright reads as a measure being filled rather
  than as a rule. **One block per two minutes**, so 28 blocks *is* the 55-minute target and
  ten lit is 20 minutes — which is also exactly the 36% the figure below prints. The file's
  own bar draws 7 lit beside that 36%; the count is derived in `pacePart` so the two cannot
  disagree. Once the 90 days are over the blocks become the thirteen **weeks**, lit where the
  week met target — the stacked chart's one durable fact in §71's thirteen-block language.
- **THE STANDING ROWS HAVE NO BOX AND NO DIVIDERS, AND KEEP THE AWARD ARTWORK AT 24px**
  (Maryam, 31 Aug 2026). Both were tried the other way first and both notes are worth reading
  before reversing them. A `standRow(g, icons)` mode replaced the three WebPs with
  `I.trophy` / `I.shield` / `I.star` on the argument that they are the only photographic
  objects in the section and that two of the three rows describe an award you have *not* won
  ("Bronze at 2,500 points"); the artwork came back, which also restores `ACH`'s own reasoning
  — "a generic glyph of a shield is a picture of the category instead". The parameter is gone
  rather than left unused: a mode no caller asks for is the "gate nothing writes" tell.
  The card went the same way — inside a column already delimited by §72.1's inset divider it
  was a third nested edge. **Both halves of §15's divider technique have to go together**:
  `gap:0` alone leaves the rule-coloured GROUND painted behind the cells, so `background:none`
  goes with it, and `border:0` rather than `border-top/bottom` because §29.17 states all four
  sides at (0,3,0).
- **THE STANDING CELL ITSELF IS UNTOUCHED.** §72.4 works entirely from outside:
  `display:contents` on `.stand-top` dissolves the wrapper and promotes the label and the
  figure into `.stand-b`'s grid. **The note runs full width under the pair, and
  that is a correction to the file.** 599:7418 puts the figure beside a note in column one,
  which works for its "Earn the Silver badge"; the product's is "Earn the Silver badge and the
  Get Involved badge", and in the 80px left after a 32px mark and a 60px figure it set to
  **four lines** and made that row 115px against Points' 67. Full width it is two lines and
  the three rows land within 16px of each other.
- **SQUARE, NOT ROUNDED.** The file draws the standing card with a ~10px radius; `--radius` is
  `0px` by token and every `border-radius` in the build resolves through it, so a curved card
  would be the only one in the portal. Stated as `var(--radius)` rather than omitted.
- **TRAP 13, AND IT IS THE CHEAPEST THING HERE TO GET WRONG.** All three sections this
  replaces opted out of §10.15's 184px label column by a different route. `.pulse` is a new
  wrapper, so the merged section fell straight into the column. §72.1a restates the opt-out
  inside `@container app (min-width:900px)` per trap 3 — and copies what §10 *does*, not what
  it says: the `padding:0 var(--pad-x)` on that rule is dead (§14.2 zeroes it) and restating
  it would set this one heading 32px right of the page. That is §69's lesson.
- **THE CALL ROW'S JOIN IS "Join call"** (Maryam, 31 Aug 2026). §71's `.crow-a` buttons are a
  fixed 185px so there is no wrap risk, and the phrase is sentence case to match "Cohort week
  call · session 36" 200px to its left. `V.cohort`'s plate Join is deliberately **not** changed:
  §56's "one or two short words" rule cut those labels on 28 Aug 2026 to stop a two-button plate
  row setting both labels on two lines.
- **TWO ROUTES TO THE CHAPTER, DELIBERATELY** (Maryam, 31 Aug 2026). The head row's "Open
  chapter N" belongs to the *section*; "Continue learning" closes the *column*, pinned to its
  foot by `margin-top:auto` so the three columns end level whatever the did-list holds. It
  keeps its border — the same reversal of §64 that §71.2 makes for `.crow-a`, stated as
  `border-color` because `.btn` already carries a transparent 1px.
- **THE EMPTY STATE WENT.** `weekCard` printed "Nothing finished yet…" where week 1's did-list
  is empty; the ring beside it already shows 0% and the band says the rest. On week 1 the
  focus column is now exactly the four rows the file draws; on day 34 the two real facts sit
  above the button rather than being thrown away.
- **THE 13-WEEK STACKED CHART MOVED TO COURSE PROGRESS**, under "Assessment scores" and gated
  on `f.done`. It cannot be a third of a column, and the time data reads as week progress in
  the pace column instead. This makes the promoted branch's long-standing claim that "the
  chart is still on Course Progress" true — it was written before `stackChart` had any caller
  but the dashboard.
- **THE SECOND TAL PARAGRAPH WENT, AND `weekCard` WITH IT.** It duplicated the band's summary
  almost verbatim. `WEEKLY[stage].tal` and `.ask` stay in data.js and nothing reads them. The
  ask chip had already been invisible on every build — step 1b of `placePageSummary` removes
  every `.chip-tal` not inside something of Tal's, and `.wkc-a` is page flow.

**Pre-existing and NOT fixed here:** week 1 shows "0h 0m invested" in the head strip and
"20 min" in the pace column, because `CFG.week1.mins` is 0 and `GAME.week1.weeks` is `[20]`.
data.js records that disagreement; the merge only moves the two figures closer together.
### WHAT THE INTERVIEW FOUND — §74, `74-signedcards.css` + `signedSummary` (views.js)

**Priya's write-up was four paragraphs and two grey labels.** It is the only block on the
`assessed` dashboard a candidate READS rather than acts on, and nothing in the drawing said the
three findings are three different KINDS — what you are good at, what you are not, and what the
assessor made of it — so the two a reader most wants to compare sat 400px apart in one column.
Three cards now, in three of §12's named marker hues: **green** for the strengths, **violet**
for the growth areas, **blue** for her note, with the pair abreast and the note under them.

- **NOT ORANGE, AND THAT IS THE INSTRUCTION** (Maryam, 31 Aug 2026: "do not go for orange color
  only"). The accent is Tal's voice and the page's one CTA, and it is spent twice on this page
  already. These three are the product reporting what a *person* found, which is not Tal
  speaking.
- **THE SECTION HAD TO GO WHITE, AND THAT WAS THE DECISION THE TINT FORCED.** The block lived in
  a `sec tint cards` — #F7F7F7 — and a 5%-tinted card on a 4% grey ground is two washes a shade
  apart: the green and the violet vanished and the row read as three empty boxes. Maryam flagged
  the ground and left the call open; white panel with coloured cards is the answer, and it is
  `quizResults`'s own swap ("the panel was a 16px frame of #F7F7F7 around four white boxes").
  **`V.enrol`'s `cohort` disclosure keeps its panel** — it has no tinted cards in it.
- **5% FOR THE CARD, 12% FOR THE CHIP, 14% FOR THE TAG, all mixed from the one `--mk`.** §65's
  chip is 12% and that is right for a 28px square; across a 430px card the same mix is a colour
  rather than a wash and three of them read as three status banners.
- **THIS IS THE ONE LAYER OF THE FOUR THAT KEEPS §65'S FILLED CHIP.** §72 and §73 both went to
  bare glyphs because their marks sit inside a bordered cell or beside a column rule, where a
  filled square is a box in a box. Here the card's ground is a 5% wash and the chip is 12% of the
  same hue, so the mark reads as a denser patch of the card rather than an object on it.
- **THE CARD TITLE TAKES THE HUE AND EVERY OTHER WORD STAYS IN INK** — the opposite of §72 §12's
  call for the pulse's column labels ("a coloured word beside a coloured mark reads as a status
  pill"). The difference is the ground: there the mark sits on white, here the card *is* that
  hue, so the title in it is the card naming itself.
- **WHAT IT REFUSES FROM THE REFERENCE:** a "Key takeaways" strip of three further claims about
  the candidate — three sentences of new product copy no data in this build supports, which is
  the one thing a redesign must not invent — and a decorative orange planet on the block whose
  whole job is to be read. The tags it *does* take, "Strong" and "Focus", are one-word labels on
  findings that already exist.
- **`flex:none` ON `.signed-b`, because §10.1130 gives it `flex:1`** — it was the only member of
  the old stacked header. Left there it absorbs the row and pushes the date to the far edge,
  which reads as two unrelated facts at opposite ends rather than a pair with a rule between them.

**Pre-existing and NOT touched:** `V.level` has ~608px of horizontal overflow at 1280 from
`.lvl-hero` and the "How the ladder works" `.acc` — confirmed unrelated (hiding `.signed`
changes nothing). It predates all of §72–§74.

### THE BLACK CARD IS A COMPONENT — §75, `.dark-card` — AND CONVERTING IS ONE CLASS

**Standing instruction (Maryam, 31 Aug 2026):** *"now when i say convert a section to black
card, you have this reference right? … i will not tell you that remove the bottom border
attached or give black box padding, do this all yourself."* So **"make this a black card" means
the whole recipe** and none of it is a question to ask. `75-recdark.css` is the reference
implementation — read it before converting anything.

**What `.dark-card` gives you, all of it stated once in §75:**

| | |
|---|---|
| ground | `--gray-100` + §21.22's top-right haze, as a `background-image` |
| place | inset by `--pad-x` as a **margin**, `--s07` padding inside, `margin-top` for section air |
| inside | `display:flex; flex-direction:column; gap:20px` — 581:6456's number, between the head block and the content |
| seams | the section's own `::after` / `::before` off; the **next** section's join off if it draws one |
| head | `.dc-hd` › `.dc-hd-r` (`.dc-t` title + **either** a `.dc-act` control **or** a `.dc-when` time at the right end — never both, they share one auto margin) with `--on-dark-rule` under it, 16 above and below |
| buttons | `.btn-p` → accent fill (§15.1853 + §19); a quiet button → borderless white; a **`disabled` `.btn-p`** → §81's unlit `--on-dark-fill` wash with the gradient off |
| ink | **§63 §6a** — the generic pair for anything the card holds: headings, body, `<b>`, `.v`/`.n`/`.ttl` → `--on-dark`; descriptions, eyebrows, helpers, `.k`/`.l`/`.d` → `--on-dark-2`; a quiet `.btn` and its `svg` → `--on-dark`. §63 §15/§17 still state `.rec-*`/`.crow-*` by hand at (0,3,0) and still win |
| seams inside | **§75.5** — `.kv` / `.stat` / `.facts` / `.tile` / `.cardrow` / `.note` borders → `--on-dark-rule`; a quiet button's border → transparent; `.tile` / `.note` grounds → transparent |
| joins | §20's two desktop pair rules skip it (`:not(.dark-card)`, both sides) — a card's frame is 32 on all four sides and no join rule may take half of one |

**A caller states only what is different about its own content.** Three so far: `.rec-dark`
(§75.3, the recommendation's portrait, action group and skeleton), `.crow-dark` (§77, the call
row) and `.sec-pulse` (§79, the pulse's head row and next-call block). Most of what looks new
when you convert a fourth is already above — **the leader dashboard's next interview is the
proof**: it wears `.dark-card crow-dark` and states not one rule of its own.

**THE GAP WAS MISSING FROM THE RECIPE FOR TWO BUILDS AND ONLY THE SECOND CALLER SHOWED IT.**
`.sec-rec` carries §70.5's own `flex-direction:column; gap:20px`, and the recommendation wears
*both* classes — so it had the spacing all along from a rule that is not the card's. `.crow-dark`
wears `.dark-card` alone and its two children stacked as plain blocks, with the call row touching
the heading's rule (Maryam: *"why did you attached the content with the divider?"*). **A component
tested through one caller that has extra classes is not tested.** Stated on `.dark-card` now.

**AND THE INK WAS MISSING FOR THREE CALLERS, FOR THE SAME REASON ONE LAYER DOWN.** Every generic
on-dark ink rule in the build — §02, §06, §11, §12, §24, §63 §6 — keys on `.on-dark`,
`.lvl-hero`, `.cert`, `.score.on-dark` or `.plate-*`. `.dark-card` carries **none** of those
classes, and that is the whole point of it: `.sec.on-dark` and `.plate` are in ai5's `DARK_CARD`,
so `placeDark` hoists them into the head band, and this class was minted precisely to be a black
card that stays in the page body. It bought that by giving up every rule the build writes against
the class it dropped. **Nothing was broken, which is why it survived three callers** — all three
hold `.crow-*` / `.rec-*` content and §63 §15/§17 ink those by hand, component by component. So
the card looked complete for exactly as long as nobody put anything else in it. Measured on a
`.sec` holding an ordinary `.kv` band and a `.btn-row`: the **values came out at 1:1**, `#111` on
`#111`, the keys at 1.7:1 and the quiet button's label invisible. Against a standing instruction
that a conversion is one class, that is the half-shipped component this build most needs not to
ship. §63 §6a is the ink and §75.5 is the seams; both are written against the `--on-dark*`
**tokens**, so §59's quiet plate keeps working, and both are (0,2,x) so every per-component rule
already in §15 and §17 still wins and nothing already drawn moved.

**§77 is the worked example, and what it had to answer is the general shape of the problem** —
not the card, which was free, but the *host section's existing opinions*: four `.sec-call`
padding rules from §71 and §73 (two inside the 900 query, so restated there per trap 3), §20's
`+ .sec{padding-top:0}` answered from inside §20's own tier, `--layer-02` grounds and
`var(--rule)` borders that vanish on black, and trap 10 — a stacked component bringing the page
gutter inside a card that already pays it (`--pad-x:0px` on the row, **not** on the section, or
the card loses its own inset).

**Never `.plate` or `.sec.on-dark`.** Both are in ai5's `DARK_CARD`, so `placeDark` hoists the
section into the head band. The long version is over `recWrap` in views.js.

#### The recommendation — §75.3, `.rec-dark`

Maryam, 31 Aug 2026 — "make this card black, you know what our black card do right? it has the
top right gradient". `talRec` on the `new` dashboard was the first caller. Six things:

- **IT IS `.rec-dark`, NOT `.plate` AND NOT `.sec.on-dark`.** Both of those are in ai5's
  `DARK_CARD`, so `placeDark` would hoist the whole block into the head band's second column —
  which on this page is §70's journey list. It would land there at 330px with the photograph,
  the facts and the two buttons each on a line of their own, and **nothing would throw and
  nothing would warn**: exactly the bug §70 records for `placeBand` walking into `.rec-lab`.
- **THE HAZE IS A `background-image`, NOT `.dark-glow`.** §21.22 draws it as an absolutely
  positioned div that `injectGlow` (ai4) appends, which then costs three more rules —
  `position:relative` + `overflow:hidden` on the card so the light cannot escape (§21's own
  note records `.ldr-read` painting a 700px orange rectangle across the band for want of it —
  that card was deleted on 1 Sep 2026 and the record is deliberately kept, because it is the
  only worked example in the build of a card joining `GLOW_ON` and not §21's clip list),
  and `z-index:2` on every child. A background layer is behind all content by definition and
  needs no pass, so the design system carries the card as **one class**. The values are §21's
  to the number: element opacity `.22` over an opaque ground and per-stop alpha composite
  identically when the far stop is already transparent, so the `.22` moves into the stop.
- **THE HEADING AND THE ATTRIBUTION ARE TWO LINES.** "Agent recommended by Tal" said what the
  block is and whose choice it is at once; `Your Next Step - Interview` at **18px** says the
  first and "Tal recommends" says the second. `.rec-hdb` wraps the pair, because `.sec-rec` is
  a column at 20 (581:6456's gap to the content) and a heading dropped straight into it sits
  20 off its own attribution.
- **THE HEADING IS A ROW WITH A RULE UNDER IT, AND "VIEW ALL AGENTS" IS ON IT.** That button
  was the left half of a pair at the card's foot, beside Book — and the two are not the same
  kind of thing: Book is what the card is *for*, View all agents is the way out of the
  *section*. The rule is `--on-dark-rule` (white at 16%), **not `--on-dark-border`** at 42% —
  §15's `.plate-x` note is the argument, the border token is for the edge of something you can
  press. 16px above it and 16 below, set in two places (the row's `padding-bottom` and
  `.rec-hdb`'s gap); it shipped at 12/12 for one build and crowded an 18px heading.
- **THE BUTTON IS WHITE, WHICH IS ITS THIRD INK AND THE FIRST TIME IT IS NOT IN A PAIR.**
  §70.5 gave it 581:6548's accent outline as "one of a PAIR, beside a black button of
  identical size"; §75 took the border off when the card went black; now the pair is gone —
  the accent button is 200px down and 800px across — so the orange was distinguishing it from
  nothing. `--on-dark` is simply the card's ink, and the arrow follows on `currentColor`
  (§70.5's hard `fill:#f47113` is re-pointed rather than left to miss). `.rec-a`'s stated
  382px goes with it: that was 185 + 12 + 185.
- **THE CARD IS INSET BY `--pad-x` AS A MARGIN AND PAYS `--s07` INSIDE.** The black is on the
  `.sec`, so it ran rail to rail and met the head band's closing hairline directly — the page
  turning black rather than an object arriving on it. Margin for the gutter (16 / 24 / 32 by
  width, so the card's edges land on the page's spine), flat 32 for the frame, `margin-top`
  only — the space below is `.sec-qa`'s own 32px of padding, and a margin would add to it
  rather than replace it.
- **AND QUICK ACTIONS' `border-top` COMES OFF UNDER THIS CARD.** §70.5c gives `.sec-qa` the
  only bottom-drawn join in the build (581:6344), and §14 and §70.5 both stop the section
  *above* it from closing itself for that reason. **The arrangement stopped working the moment
  the card got a margin**: a full-bleed grey rule at the pixel row below an inset black card
  runs past it on both sides and reads as a line stuck to the card, not as the top of the next
  section. `.rec-dark + .sec-qa` — keyed on what PRECEDES, the mirror of §14's and §70.5's
  `:has(+ .sec-qa)`, because here the reason is a property of the card. Any other section above
  Quick Actions keeps the line.
- **THE PORTRAIT IS A SQUARE SIZED BY THE CONTENT'S HEIGHT, AND FLEX CANNOT DO IT.** §70.5's
  `width:166px;aspect-ratio:1` described itself as "as tall as the facts beside it AND square"
  — two claims that were one only because 166 happened to be both. With two rows off the block
  it measures ~120, so the square hung 45px below the sentence. The fix is to make the HEIGHT
  the input: `width:auto; height:100%; aspect-ratio:1`. **In a flex row that ships an 18px
  photograph, silently** — flex resolves the main size from the flex base size, and a box whose
  only content is a `position:absolute` `<img>` contributes zero, so the ratio has nothing to
  transfer into. `.rec-l` becomes `display:grid; grid-template-columns:auto minmax(0,1fr)` at
  600 and up (measured on the live page: flex 18×18, grid 120×120). **Trap 19 is live on it** —
  §70.5's phone rule is `flex-direction:column`, which is inert on a grid, so the whole block
  is gated at `min-width:600px` and below it the fixed square header stands.
- **`.rec-v` IS `I.verified`, NOT `I.checkFilled`, AND ALL THREE CALL SITES MOVED.** A ringed
  tick is this product's "done" mark — `jrnList` puts it against a finished step — so beside a
  name it read as "Priya Nair: complete". A scalloped badge is "this identity has been
  checked", a property of the person. The glyph is Material Symbols Rounded FILL 0 24px,
  **pasted** from `symbols/web/verified/materialsymbolsrounded/verified_24px.svg` per icons.js's
  own rule, on the same `0 -960 960 960` grid as everything else there. `talRec`, `V.agent` and
  `V.booking` all write `.rec-v` and it means the same thing on each.
  **`.crow-v` was NOT changed** — the reference screen for the call row draws the ringed tick,
  and that change was asked for on the recommendation. One to raise rather than assume.

#### The call — §77, `77-crowdark.css` + `.crow-dark`

Maryam, 31 Aug 2026. The `booked` dashboard's interview row takes `.dark-card` **under the same
heading `talRec` carries one stage earlier**, because the two are the same slot: on `new` the
page's next step is "book an interview", here it is "join the one you booked", and both sit
directly after Tal's card before the body. The heading is byte-identical.

- **NO CONTROL ON THE HEADING ROW, WHICH `.dc-hd-r` ALLOWS.** `talRec` puts "View all agents"
  there because the recommendation is one of five and the way out belongs to the section. A
  booked interview is not one of anything — Reschedule is on the row, where it acts on *this*
  appointment rather than being a way past it. `.dc-hd` holds one child here and two there.
- **ONE CALL SITE OF FOUR, AND `.crow-dark` IS ON THE WRAPPER SO THE VIEW DECIDES.** `crow` is
  drawn by this dashboard, the Interviews module, `V.cohort` and `callRow()`. Only this one is a
  page's *next step*; `callRow()` is a `.head-sec` **inside the band**, where a black card would
  be a second dark object in a block that already has one.
- **THE COUNTDOWN IS IN THE HEADING ROW AND §71.1'S 182px CELL IS GONE** (Maryam, 31 Aug 2026).
  That cell was argued as "the row's only ground" — the one figure that changes by itself, set
  apart by a tint — and that argument was about a row standing on a **white page**, where a
  ground is the only way to lift a figure. Inside a card, the heading row is already where a
  card says what it is *about*. `.dc-when` takes `.dc-act`'s slot, ink and auto margin; the
  portrait goes back on the card's own spine, which the 20px cell inset had been breaking.
- **`.dc-when` IS NOT `.dc-act`, AND THEY ARE ONE-OR-THE-OTHER.** Same position, same ink,
  different element: `.dc-act` is a control that navigates, this is a figure that does nothing.
  Both carry `margin-left:auto`, so two of them would jam together with the row's slack in
  front of the pair — a card that wants both needs a group, not a second auto margin.
- **"In 1 minute" IS DERIVED, NOT TYPED.** `CALL_ROW.iv.when` is `'in 1 minute'` and
  `callLeft` produces exactly that string — `PLATE_SOON` matches `in \d+ minute`, so the
  preposition-first branch fires. **Flagged and not fixed:** Tal's summary on this stage says
  the interview is "confirmed for Thursday, August 20 at 6:30 PM" and `dashPh` says "interview
  20 August". A one-minute countdown cannot be true alongside a date six days out — one edit
  either way, and `bkStamp`'s note is why they have to agree.
- **THE VIOLET WENT WITH THE CELL IT WAS WRITTEN FOR.** §63 §11's `#b948c7` existed to lift a
  figure off a 4% grey ground; there is no ground left. `.dc-when` is `--on-dark` and **not the
  accent even though it is urgent** — §59's answer to urgency *is* the card, and the accent is
  already spent on Join 100px below.
- **`crow(kind, o)` TAKES TWO FLAGS AND BOTH MODES HAVE A CALLER** — `{when:false, second:false}`
  here, defaults everywhere else. Two rather than one because they are two decisions. **`when`
  takes the label with it** ("Level interview · 45 minutes, recorded"), which is only acceptable
  because Tal's summary 40px above says the same thing; on a page with no summary that is a
  fact going missing.
- **FIVE RULES WERE DELETED AS THE CARD LOST PARTS**, and that is the discipline rather than an
  aside: the countdown cell's ground (§77), the quiet button's border (§77), and three inks in
  §63 §17. Each was keyed on a class `.crow-dark` no longer writes — the "gate nothing writes"
  tell, which a stylesheet accumulates fastest, because a colour matching nothing costs nothing
  to look at. The same classes on the other three `crow` call sites are untouched.
- **`.crow.urgent` NEEDED NOTHING** either way, which is §71.2a's design paying off on a ground
  it never imagined: that state re-points the cell's *ground* and lets both lines inherit.
- **18px IS A STATED §63 §7 EXCEPTION AND IS NOT TOKENISED.** §11's rule is take the nearest
  role and h3 is 17 — the same one-pixel gap that minted `--t-sec-size`. That one earned a
  token because three headings across two layers read it; this has one reader. If a second
  block ever wants 18, tokenise it then rather than copying the number.
- **TWO INKS ON THE CARD, NOT FIVE.** The block ran `#414141`, `#973177`, `#0488c5`, primary
  and secondary, all picked on a white page; three of the five are under 3:1 on `--gray-100`,
  including the magenta claim at 2.1:1 — the one line the block exists to deliver. §63 §15 is
  `--on-dark` for the name and the claim, `--on-dark-2` for everything supporting them.
  **`.rec-n` / `.rec-r` / `.rec-f` are scoped to `.rec-dark` and `.rec-why` is not**, and the
  difference is who writes them: the first three are drawn on `V.agent`'s white page too, and
  `.rec-why` has exactly one caller. A `.rec-dark` scope on it would be a condition that is
  true every time it is evaluated.
- **THE LABEL NEEDED (0,5,0).** `.app .ai-label.bare.rec-lab` is (0,4,0), so a
  `.app .rec-dark .rec-lab` restatement at (0,3,0) loses **silently** — the words simply stay
  black on black. §63 §7b's trap, one more time.
- **THE ROWS THAT CAME OFF.** The expertise line and "Data Overlap Tags: 98% match" are gone
  and the rating moved under the name to take the row the first left, so `.rec-top` is still
  two rows and the 166px portrait is still square against its own content. `rec.match` and
  `rec.expertise` both keep readers elsewhere (`SUMDROP.quiz` in ai6; `V.agent`); **`.rec-m`
  and the skeleton's `.sk-x` / `.sk-m` do not, so their rules are deleted** rather than left
  as the "gate nothing writes" tell.
- **THE QUIET BUTTON LOST ITS STROKE, which turns over §70.5's third stated reversal of §64.**
  That note argued a borderless button beside a black one "read as a text link that happened
  to be 185px wide" — true on white, where the pair differed only by fill weight. On black the
  accent button is the brightest object on the card, so the fill makes the distinction and the
  outline is one more edge. `border-color`, not `border` (§64.1): `.btn` carries a transparent
  1px and dropping the shorthand makes this one 2px shorter than the button beside it.

#### The LEADER's next cohort call — `leadCallCard` (lead.js) + §81, `81-joingate.css`

**IT WAS THE NEXT INTERVIEW UNTIL 1 SEP 2026** and everything below about HOW it is placed is
unchanged — what changed is its subject, because a cohort leader does not interview anybody.
Two bullets have been rewritten in place (the content table and the record's fields); the Join
and its gate were already off this card before that, on 31 Aug 2026, and the last three bullets
are kept because §81's machinery is still the reference for any future gated action on a black
card.

Maryam, 31 Aug 2026: *"The call card from the top will be out and will be next to the summary
section. Just like the black call card we have on the candidate portal. Content will be the
same just the ui changes. Disable the join call button and enable it at time of the call. The
summary will take the full width."* The leader dashboard's `.plate` becomes the third
`.dark-card` in the build and the FOURTH caller of `crow` — same slot as `talRec` on `new` and
`.crow-dark` on `booked`, one portal over. `leadCallCard` in lead.js is the long note.

- **"OUT OF THE TOP" AND "FULL WIDTH" ARE ONE CHANGE, NOT TWO.** `.plate` is in ai5's
  `DARK_CARD`, so `placeDark` was lifting it into the head band — that is the only reason the
  card was up there. §56's two-column band is gated on `.modhead:has(> .sec-dark .plate)`, so
  with no plate on the page the gate stops matching and the band is one `minmax(0,1fr)`
  column: **the summary takes the width back with nothing restated.** `.dark-card` is in no
  pass's list, which is §75's whole point.
- **IT GOES AFTER TAL'S `.sec`, AND THAT IS LOAD-BEARING.** `placeBand`'s run walks forward
  from the `.ph` and stops at the first section that is not head furniture, so a card written
  *between* the `.ph` and Tal's card would leave the summary in the page body (trap 11's
  neighbourhood). Written after it, the card is what stops the run — the job the stats band
  used to do.
- **§20'S JOIN RULES MAY NOT TAKE HALF OF A CARD'S FRAME, and this is the first page where
  they could.** Both of that layer's desktop rules hand `var(--s05)` to one edge of a pair, at
  thirteen classes inside a container query — so §75's `padding:var(--s07)` (0,3,0) and §77.1's
  restatement (0,4,0) both lose silently and the card renders with a 32px frame and a 16px top
  or bottom. `:not(.dark-card)` is added on **both** sides of the pair, per trap 4 (that list is
  where "which pairs are joined" is decided). Nothing visible moved on the two existing cards:
  both follow the `.modhead`, which is not a `.sec`, so neither pair ever matched.
- **THE CONTENT IS ONE COHORT RECORD, ROW FOR ROW** — `lcall(c)`'s `callDay`+`callTime` in
  `.dc-when`, `lcTitle(k)` ("Cohort 41 call") in `.dc-t`, the cohort's NUMBER as the 78px mark
  and again as `.crow-n`, `members.length` + `level` as `.crow-role`, and `lcDetail(k)` (60
  minutes · week 5 of 13 · the chapter off `CH`) as `.crow-x`. `lcTitle` / `lcDetail` live in
  lead.js because three surfaces state those strings — this card, the dashboard's list and the
  Calls page — one place, three readers, the `bkStamp` rule.
  **THE MARK IS A LABEL AND THAT NEEDED TWO LAYERS.** `crow` omits the `<img>` when the record
  carries no `img` (an undefined `src` 404s on every render, which `respcheck` reads as a broken
  screen), §71.405 normalises the `<i>` out of italic — its note names this exact card as the
  case it was written for — §77.7 gives the square `--on-dark-fill` so two digits on a pale grey
  ground do not read as a photograph that failed to load, and §63 §17 sizes it at h2 (`.av-ph i`
  is unsized everywhere else and inherits body, which is right in a 56px plate mark and lost in
  78px of black).
  **ITS ONE ACTION IS "GENERATE THE BRIEF"**, `second.at` — a sheet, not a route — and it is the
  first time this card's action has done anything. It was "All sessions", a way out of a set of
  one, and before that the gated Join below.
- **`crow` TAKES A RECORD NOW, AND THREE FIELDS DEFAULT TO THE CANDIDATE'S ROW.** `CALL_ROW`'s
  note invites a fourth appointment, but this one's facts are all `lead.js`'s and views.js is
  parsed first (§69's direction rule), so the leader states its own record and hands it over.
  `xl:''` drops the **`Expertise:`** lead-in (the third line is the appointment, not a claim
  about its subject), `v:false` drops the **green tick** — the reason has CHANGED and is now
  stronger: it was "a candidate nobody has assessed is not a checked identity", and the subject
  is no longer an identity at all — and no `kind` means no `data-call`.
- **THE JOIN IS GATED, AND STILL UNWIRED — TWO DIFFERENT FACTS.** `joinLive(when, mins)`
  (views.js) is the window: five minutes before until the session ends. **`PLATE_SOON` cannot
  answer this** — its first two words are `now` and `today`, because the question it answers is
  §59's volume question, and a call at 4:30 this afternoon is emphatically "today" and
  emphatically not joinable at 9am. `JOIN_NOW` is the narrow vocabulary; `joinClock` stamps a
  `Today h:mm am/pm` string onto today's date and everything else returns null, so "Tomorrow
  11:00 AM" and "Nov 21, 6:30 PM" stay shut by construction. What has NOT changed is that
  pressing it does nothing: `callOpen` builds the *candidate's* interview, so a leader-side
  `CALL` entry is its own piece of work.
- **THE GATE IS OPT-IN (`{gate:true}`) AND THE THREE CANDIDATE CALL SITES DO NOT TAKE IT.**
  Their Joins are the prototype's way into `callScreen` — five buttons, one surface — and
  gating them by the clock would switch the product's own demo off for twenty-three hours a day.
- **IT ARMS ITSELF WITHOUT A RENDER.** `joinArm()` on a 20s interval writes `disabled` and the
  `title` on `[data-joinwhen]` in place — `callTick`'s pattern, and trap 9 is not in play
  because the value is a pure function of `Date.now()` and the button's own attribute, so the
  next render recomputes exactly what the timer wrote.
- **THE DEMO USED TO DEPEND ON THE TIME OF DAY**, which was the honest reading of the ask:
  `LEAD_SESSIONS.s3.when` was `'Today 4:30 PM'`, so the button was live 16:25–17:15 and shut the
  rest of the day. That record no longer exists and this card has no Join, so the lever is gone
  with it. `WEEK_CALL.when` is still the same lever for the candidate's cohort call, and
  `LEAD_COHORTS[n].callDay` / `.callTime` is what moves the leader's — but those only move the
  card's `.dc-when`, not a gate.
- **§81 EXISTS BECAUSE `disabled` DID NOTHING ON A BLACK CARD.** §02.108's whole disabled
  treatment is (0,2,0) against §75.3's accent fill at (0,4,0), so the button stayed the full
  accent gradient with white ink and could not be pressed — a control that looks live and is
  not, which reads as a broken page rather than a closed door. The ground is `--on-dark-fill`
  (§02's substitution in the card's own register, and the token §75 and §77 already reach for),
  the ink is §63 §20's `--on-dark-2` at (0,5,0), and `background-image:none` is half the rule
  because §71.2 and §75.3 both paint a **gradient** as well as a colour. **Not `opacity`** —
  trap 2: the entrance animations run with `fill-mode:both`, so a resting state on opacity is
  fighting a keyframe. Stated on `.dark-card`, so the next black card with a gated action gets
  it free.

**AND TWO PRE-EXISTING PHONE BUGS IN `crow` CAME OUT WITH IT — BOTH ON THE CANDIDATE PORTAL
TOO, and both fixed at the cause.** §71.3 turns the row into a column below 900, and:

- **`flex-basis` IS A FIFTH PROPERTY WHOSE MEANING THE PARENT DEFINES — trap 19's list is one
  short.** §71.1's `.crow-who{flex:1 1 300px}` is argued entirely as a *width* basis; in a
  column it is a 300px floor on the HEIGHT with `flex-grow:1` behind it. Measured at 390: a
  96px block of text in a 300px cell — ~200px of dead ground between the person and the
  buttons. Invisible for as long as the row stood on white paper; obvious the moment the ground
  is black. `flex:0 0 auto` in the stacked tier.
- **`margin-left:auto` DISABLES `align-items:stretch`,** so §71.3's own `.crow-a > .btn
  {width:100%}` had never done anything: the group was content-sized and pinned right, and
  `100%` of a shrink-to-fit box measured 110px (one button) and 130px (two). `margin-left:0` in
  the same tier. All four `crow` call sites now stack full-width buttons on a phone, which is
  what that block always said it did.
- **AND `.crow-a`'S 24px BOTTOM PADDING IS THE OTHER HALF OF §77.2** — the frame charged twice
  inside a card, 32 above the heading against 56 below the last button. §77.4's `--pad-x:0px`
  cannot reach it (that zeroes the sides; the bottom is a flat `var(--s06)`), so §77.5 states it.

### THE BOOKING PAGE IS THREE PANELS — §76, `76-bookpage.css` + `V.agent`

Maryam, 31 Aug 2026, with a reference screen — "the look and feel will be ours, but take the
structuring inspo from the reference". Six loose blocks down one column (identity, bio, a
`.facts` row, a heading, a day strip, a time row, a button) become **the profile beside its
three purchase facts**, **the picker as two numbered steps**, and **a checkout row**.

- **ONE `.sec`, THREE PANELS.** §10.2 closes every section with a full-bleed hairline and tick
  marks at the rails, so three sections would draw a page-wide rule one pixel under each
  panel's own bottom border — §14's "TWO 1px rules one pixel apart", three times over. The
  inline `style="padding-top"` came off with the merge (trap 1).
- **THE FRAME IS §41'S** — `1px solid var(--rule)` on `--layer-01`, the only other bounded
  panel in the build. The reference's cards have an 8px radius and a soft shadow; `--radius`
  is `0px` by token and §02's opening note is that "depth is expressed as rhythm and rule
  weight, nothing else".
- **THE DIVIDER IS A `border-left` AND §72.1 ARGUES FOR A PSEUDO-ELEMENT.** Both are right and
  the difference is what the rule would meet: §72's columns sit under a rule of their own, so
  a full-height border forms a corner with it; these sit inside a panel with nothing above
  them, and the grid item's own stretched height *is* the inset. A border also turns over
  correctly at the stack — it becomes `border-top` on the same element. §72.3's `content:none`
  warning is about an **absolutely positioned** divider and does not apply.
- **THE THREE FACTS ARE A COLUMN AND ARE NO LONGER `.facts.eo-facts`.** §73's cell draws its
  hairlines as the grid's column gap and gives cell 3 an absolutely-positioned divider out
  into the gutter; stacked, all three mechanisms draw vertical lines down a column. §76 states
  the column and the mark goes to **§65's 28px tinted chip** — the shape for a figure cell in a
  continuous band, which is what three rows on one ground are. Hues named, not cycled.
- **THE STEP NUMERAL IS `--brand-tint-2`, NOT A SOLID ACCENT.** §10.29 reserves the solid
  accent for the candidate's own SELECTION, and the lit day and the lit time are 30px below
  the numeral. `--accent-text` on the tint (5.8:1) rather than `--on-accent` on the accent.
- **`.bks-slots` AND `.bks-days` HAVE TO GIVE BACK §10.3'S BLEED.** `.sec > .slots` pulls
  itself out by `--pad-x` on both sides; inside a panel that hangs the grid over both borders.
  Trap 10, one component along, answered the same way — at the element.
- **WHAT IT REFUSES FROM THE REFERENCE.** The **"Talent Agent" chip**, which names the category
  the crumb two rows above already puts you inside (§73 refuses a social-proof row on the same
  test).
- **THE MONTH CALENDAR WAS REFUSED, THEN BUILT, AND THE ROUND TRIP IS THE LESSON.** §76 first
  declined it on §41's argument ("a chip row answers *which of these do you want* perfectly,
  which is the candidate's question in the booking flow… It is not the agent's question") **and
  on the data** — the agent had five open days, so a month was 26 dead cells. Maryam asked for
  it anyway, and the honest way to build it was to fix the *second* objection rather than
  override it: `AGENT_CAL` now holds **two months of real weekday availability**, so most of the
  grid is live. The refusal was right about the data and the data changed.
- **THE CHEVRONS ARE LIVE, WHICH IS THE ONLY WAY THEY GET TO EXIST.** §60's rule is "a dead
  control on a live surface is worse than a missing one", and that is exactly why the first
  version drew none — nothing held a second month, so both would have been permanently inert.
  So they were not *drawn*, they were *given somewhere to go*. At the ends one is `disabled`,
  which is a bounded range rather than a dead control: the distinction §60 draws is between a
  control that can never do anything and one that cannot do anything **from here**.
- **`S.bkMo` IS STATE — TRAP 9.** Every neighbouring handler moves an `.on` class and returns,
  because it changes one class on one element. A month is 42 different cells, so it cannot be a
  class move; the handler sets the number, clamps the step, and `V.agent` is a pure function of
  it. `data-bkmo` carries **±1**, not a target index, so neither button knows how many months
  exist.
- **THE WEEKDAY IS NEVER TYPED.** This replaced five `['Thu','Thursday',20]` tuples — five
  hand-written names `Date` could contradict, and thirty-odd chances to once availability grew.
  `dowLong` reads it off `Date`, so the heading cannot call a day Thursday that the grid draws
  under Wednesday. Availability is derived too: Mon–Fri minus a `skip` list, because **every
  slot in the build is a weekday** and a bookable Saturday would be the invented data §74 rules
  out.
- **THE SELECTION IS A MONTH *AND* A DAY.** It draws `.on` only while its own month shows, but
  the heading over the times keeps naming it — that heading states what you **chose**, the grid
  states what you are **looking at**. Aug 20 is the day the rest of the build names (`bkStamp`,
  `PAGESUM.booked`, `CALL_ROW.iv`).
- **NO DOTS, NO STEP NUMERALS, NO BORDERS ON THE TIMES** (Maryam, 31 Aug 2026). Each was drawn
  for a condition that stopped being true: the dot marked five open days out of 31 and now
  would mark the majority; the `1`/`2` chips restated a reading order two columns with a rule
  between them already had, and were the only `--brand-tint-2` objects on a page where orange
  means "you chose this"; the six outlined time cells were the heaviest object on a page whose
  own three blocks had just lost their frames. **All three deleted, not hidden** — `.bks-n`'s
  box and ink, `.bkd.day::after` and its `.on` variant.
- **THE TIMES ARE A LIST, AND THE CELL HAS NOW HAD THREE SELECTED STATES.** §03 filled it solid
  `--brand-primary` with white on it; §76 made that a `--brand-tint-2` wash when the grid lost
  its borders; then the wash went too (Maryam, 31 Aug 2026 — *"the orange color and selected
  radio button is enough"*). What carries the selection is `--accent-text` on the words and a
  filled ring at the far edge — `I.circleDash` against three `I.circle`s, which are **Material's
  own radio pair** (icons.js says so), so `.rad .box` is reused in spirit without the
  `<label>`+`<input>` a `<button>` cannot host. `background:transparent` is **stated**, not
  deleted — §03's fill is (0,1,0) and would come back.
  **The rows are `gap:0` at 44px**: §10.29's 8px gap and §03's 48px min-height are a 56px pitch,
  right for chips that must read as separate targets and far too loose for four rows of one list.
- **A TAKEN SLOT IS NOT DRAWN, WHICH REVERSES ai7'S RULE FOR THIS PAGE ONLY.** That file argues
  disabled chips well — "six chips with no gaps says *this is all there is*" — and it stops
  holding for a list, where a struck-through row is a full-width line you read and discard. **The
  record keeps both**: `SLOT_ALL` and `taken` are unchanged and `open` is still a real count, so
  "4 available slots" cannot drift from the list. ai7's own picker is untouched.
- **`S.bkSlot` IS STATE AND ITS HANDLER RUNS *BEFORE* THE GENERIC `.slot` ONE.** `data-bkslot` is
  on a `.slot`, so the shared handler matches it too — and that one moves `.on` and returns,
  which would tint the new row and leave the filled glyph on the old one, because the mark is
  chosen at render. **Order is the whole of the fix.**
- **THE DATE KEEPS ITS SOLID ORANGE DISC** and that asymmetry is deliberate: a numeral in a
  42-cell grid is a **mark** (§56 grants marks the one curve this system allows) and a tint there
  is a smudge; a row in a list of four carries it in ink.
- **THE PROFILE'S THREE PURCHASE FACTS CAME OFF AND `.bkp` IS ONE COLUMN.** Two of the three were
  printed 40px to their left in `.rec-f` ("$95 Interview Fee", "45 mins call"), so the block
  stated the fee twice and the length twice either side of a divider whose job was to separate
  them from each other. **What is actually lost is "Within 24 hours"** — the report turnaround,
  the one of the three not already said twice; `V.booking` still states it, this page no longer
  does. Three rounds of reasoning went with the column (`fit-content(360px)` on the track, the
  420px cap on the *row* rather than the column, the chip-to-glyph trade) — all answers to
  questions the block no longer asks.
- **"Times in ET" IS GONE AND SO IS THE CLOSING SENTENCE**, so the page states no timezone while
  you are choosing. `V.booking` names it on the receipt. Flagged, not assumed — if it comes back,
  the row of times is the place for it, not the heading.
- **TWO BLOCKS HAVE BEEN BUILT AND REMOVED FROM THE SLOT UNDER THE LIST**: the "Video interview"
  definition panel, and a dark Scheduling card joining the day and time with a reminder line.
  §76.5 keeps the note without the rules, because **what the second one was for is still an
  unmet gap** — nothing on this page puts the date and the time in one string, and the checkout
  row states the fee and not the when. The place for it is the checkout row.
- **THE FEE IS `a.price` AND THE $695 CONFLICT IS CLOSED** (Maryam, 31 Aug 2026: "this is $95 not
  $695"). It had been a literal, twice asked for, disagreeing with the five surfaces that read
  `AGENTS.<agent>.price`. One record, five surfaces, no drift.
- **EVERY FIGURE IS READ.** "4 available slots" is the enabled cells counted, not the
  reference's own "6 available" over a grid with two struck through.
- **THE FEE AND THE BUTTON DISAGREE AND THIS ROW MADE IT VISIBLE — NOT FIXED HERE.** `$695` is
  a literal and is Maryam's, twice asked for; every other surface reads `AGENTS.<agent>.price`,
  which is $95 for Priya. The two used to sit ~600px apart down a column and now sit on one
  line, which is what a checkout row is for. **The structure is not the bug.** If 695 is real
  the fix is `AGENTS.<agent>.price` and five surfaces follow; if it is the fee plus something
  this page does not draw, that something belongs in the row before the total does.

#### THE SCHEDULER IS CALENDLY'S IFRAME — 3 Sep 2026, and it took four tries

**The ask was one sentence and it did not change: put the attached Calendly iframe on that
screen.** What it cost is worth recording, because every wrong turn was a different way of not
doing what was asked:

| try | what was built | why it was wrong |
|---|---|---|
| 1 | the widget **restyled into our design system** — our accent, square corners, our type | *"i didn't say that i needed the design like calendly"* |
| 2 | a grey **placeholder** block reading "Calendly scheduling embed" | *"why you are using this calendly placeholder?"* |
| 3 | a **hand-drawn facsimile** of the widget in Calendly's blue | *"who asked you to draw it?"* |
| 4 | `<iframe src="https://calendly.com/…">` | what was asked for each time |

- **THE LESSON, AND IT IS THE ONE TO CARRY:** when a reference image is of a **third-party
  product the team has already chosen to integrate**, it is neither a design to translate, nor a
  hint to leave a placeholder, nor a picture to reproduce. It is the vendor's UI, and the only
  correct answer is to embed the vendor. **Ask what the URL is; do not build a substitute.**
- **`CALENDLY_URL` IS THE INTEGRATION POINT AND THE ONLY ONE.** One constant in views.js;
  `AGENTS[k].cal` overrides it per agent, so pointing six agents at six real links is six fields
  and no markup. The embed options (`embed_type=Inline&hide_gdpr_banner=1`) are appended at the
  call site rather than stored on the record, so a field only ever holds a URL.
- **IT NEEDS A REAL EVENT AND DOES NOT HAVE ONE YET.** `https://calendly.com/talentnext/interview`
  is a placeholder and returns **404** (checked; `calendly.com` itself answers 200), so the frame
  renders blank. **This is the one thing outstanding on the page** — swap in a real TalentNext
  Calendly link and it renders.
- **`.bkframe` IS FOUR DECLARATIONS BECAUSE THAT IS ALL WE OWN.** `display:block` (an iframe is
  inline by default and leaves ~4px of descender under it, which reads as a misaligned seam on a
  block that ends on a hairline), `border:0` (the UA's 2px inset border draws a second frame
  inside Calendly's own card), `width:100%`, and **`height:700px`, which is Calendly's own
  recommended inline height** — an iframe has no intrinsic height and cannot be measured across
  origins without their embed script.
- **EVERYTHING THIS PAGE USED TO COMPUTE IS DELETED.** `AGENT_CAL`, `calDays`, the six `cal*`
  locals, `SLOT_ALL`, `taken`, `slots`, `sSel`, `DOW`, `MON`, `dowLong`, `S.bkMo`, `S.bkSlot`
  and the two handler branches. **ai7's `S.bk.slot` is a different key** — Tal's own picker in
  the thread is this product's UI and stays.
- **§63 STATES NO TYPE FOR THE SCHEDULER AT ALL**, which is the shape of the right answer: every
  string in that block is set by calendly.com and no declaration here crosses an origin. The
  eleven roles the hand-built picker used and the two the placeholder used are both gone, and
  nothing was lost from the scale.
- **THE CHOSEN SLOT COMES BACK FROM CALENDLY.** The downstream screens read `a.slot`,
  `CALL_ROW.iv` and `bkStamp`, which is what they did while the picker existed too — that picker
  never wrote the booking either (`selD` was the literal `20`).

### THE AGENTS SCREEN IS A TABLE — §114, `agentsTable` / `agentRow`

Maryam, 3 Sep 2026, with the screen attached: *"for the agents screen, I want you to use the
reference design."* Six cards two-across become six columns of one record: **Agent · Expertise ·
Experience · Next available · Rate ·** the actions.

- **IT IS A CHANGE OF KIND, NOT OF STYLE.** A directory of twenty-four is a thing you SCAN, one
  column at a time, and every column the reference adds is a comparison the card made
  impossible — rate against rate, next slot against next slot, years against years. The card had
  each of those facts in a different place on each card.
- **TWO FIELDS WERE ADDED TO `AGENTS` AND ALMOST NOTHING IS INVENTED.** The reference was drawn
  on this build's own data — its six rows carry our interview counts to the number (210, 164,
  98, 143, 121, 176), our ratings, ranges, slots and prices — so `yrs` and the first three of
  each `tags` are transcribed from the drawing. **What is authored is the overflow, eight
  strings**, because a `+1` over a list with nothing in it is the invented figure §74 rules out.
  Owen's and Lena's are `REC.<k>.expertise` verbatim. **Priya's is not**, and the disagreement is
  pre-existing: `REC.priya.expertise` is 'System Architecture' against a bio about logistics
  operations, so her overflow is 'Operations' and `REC` is left alone.
- **NOTHING IN A ROW IS TYPED TWICE.** `a.slot` is one string and the cell splits it on the
  middot, so the date over the time cannot drift from what every other surface prints whole.
  The overflow count is `length - 3`, not a stored number.
- **`subgrid` IS LOAD-BEARING, AND STATING THE SAME TRACKS ON EVERY ROW IS NOT ENOUGH.** Seven
  sibling grids each declaring `1fr 1fr auto auto auto auto` are seven grids, and an `auto`
  track is sized from ITS OWN row's content. Measured at 1280 before the fix: head cells at
  258 / 573 / 889 / 965 / 1056 / 1094 against the first row's 258 / 509 / 759 / 851 / 956 / 994
  — **up to 116px off, with every row a perfectly valid grid and nothing warning.** `.agt` is
  the grid now and each row is `grid-column:1/-1` + `grid-template-columns:subgrid`. **Not
  `display:contents`**, which would dissolve the row box and take its hairline and padding with
  it.
- **FOUR OF THE SIX TRACKS ARE `auto`, AND COPYING THE REFERENCE'S PROPORTIONS IS WHAT FAILED.**
  That drawing is ~1300 wide; `.page` is **901 at a 1280 frame** (the reference was drawn at
  1728, where it is ~1216). Six proportional columns divided 757px into 193/193/91/112/26/142
  and both text columns broke — the Recommended chip wrapped under the name and four chips set
  on three lines. A year count, a date, a price and two buttons have no variable length, so a
  fraction spends width on cells that cannot use it. **The gap is `--s04`, not `--s05`:** those
  20px are the difference between the name and its chip fitting on one line at 1280.
- **THE `+` CONTROL IS §24's COLLAPSED `.tal-star`, REACHED BY WIDENING ITS SELECTOR** to
  `:is(.agh-book,.agt-act)` rather than restating it in §114. A copy would be a second set of
  numbers to keep in step (36px box, 14px mask, 80px reveal) — and §114 lands after §63, where
  it may not state the label's size, weight or ink at all. CLAUDE.md's §108.2 rule from the
  other side: check whether the class is stated unscoped before copying it; this one was
  scoped, so widen the scope.
- **`agentCardH` IS DELETED AND `.agh*` IS NOT** — §82's case. `tn-agent-portal.html`
  hand-writes that markup on the design system, so the class family is a component the box
  still ships; what went is the function, whose last caller was the rail this replaced.
- **THE COLUMN HEADS ARE SENTENCE CASE AND THE REFERENCE SETS THEM IN CAPITALS.** §63 §2, for
  the second time in one session (the booking calendar's SUN MON TUE was the other). They are
  the eyebrow role, and `--text-secondary` rather than `.tbl th`'s `--rule-ink` (#111), which is
  right for a dense table and far too heavy over six rows with 48px portraits.
- **THE INTERVIEW COUNT PRINTS TWICE ON EVERY ROW AND THAT IS THE REFERENCE'S.** Once under the
  name, once under the years. Both are `a.ivs`, so they cannot disagree.
- **`.agt` PAYS THE PAGE GUTTER ITSELF** rather than being wrapped in a `.sec` — §10.2 would
  close the section with a full-bleed hairline one pixel under the last row's own rule, which is
  §14's "TWO 1px rules one pixel apart".
- **Verified:** `respcheck --edge` clean (237 × 7), all six rows and the head sharing identical
  column positions at 1280, and the stacked card at 390 / 744 with no overflow.

### EVERY AI-NATIVE SECTION HEAD IS `aiHead` — ONE COMPONENT, THREE CALLERS

Figma 613:7984. **The heading, its description and the row's actions are one block, and the
actions are centred against the title-and-description pair — not against the title.** Frame 209
is the title row (27) + 12 + the description (29) = 68 tall, and Frame 211, the 447×40 action
group, sits at y=14 inside that same 68. `aiHead({mark, title, desc, act, extra})` in views.js
is the markup; §73.1 is the drawing; §63 §12 states its two type roles once.

**This existed because three sections had drifted three different ways** (Maryam, 31 Aug 2026:
"no section should have this kind of heading and description random placements, do this one
time"). Read this before adding a fourth — it needs no new class and no new type rule.

- **THE BUG THAT MEASURING MARGINS COULD NOT FIND.** The wrong version put the title and the
  actions in a `.sec-h` and left the description as the section's *next* child. The action group
  is 40px tall and a 16px title's line box is 22, so the row took 40 and the title sat centred
  in it — 9px of empty row under the title before its own 12px margin even began. The gaps
  computed to exactly 12 and 20, the specified numbers, and the heading still read as detached
  from its own description. **The margin was right and the box was wrong.**
- **AND THE CENTRING NEEDS `align-self:center` STATED — `align-items:center` ON THE ROW IS NOT
  ENOUGH.** §37.11b sets `align-self:flex-start` on every child of a `.sec-h`, on the reasoning
  that it is inert "wherever the box is not stretched — a full-width heading row is exactly its
  own content's height, so there is no free space to move into". True of every `.sec-h` that
  existed when it was written; **`.aih` broke that assumption** by putting two items of
  different heights in the row. Its exclusion cannot catch it either: `:not(:has(> .btn))`
  wants the control as a *direct* child and `aiHead` nests it inside `.aih-a`. §73 states
  `align-self:center` on both children at (0,6,0), which beats §37's (0,4,1).
  **THE 14px COINCIDENCE IS WHY IT SHIPPED WRONG FOR A BUILD.** 613:7984 puts the 40px action
  group at y=14 inside the 68-tall block, and 14 *is* the centred offset for those two heights
  ((68 − 40) / 2) — so top-aligned, the gap between the two tops measures the file's own number.
  Measuring "is the action 14px down" confirms both states. **The test is the MID-POINTS**:
  centred is `deltaMid == 0` at every pair of heights, and the cover row (53 / 32) reads 10.5
  rather than 14, which is the tell. This is trap 19's family — a property whose meaning or
  winner depends on a parent an earlier layer was reasoning about.
- **THREE SIZES WHERE THERE SHOULD HAVE BEEN ONE.** `.pulse-ttl`, `.eo-ttl` and `.cov-ttl`
  rendered 16, 12.5 and 14 — because §63 §8b sizes section headings inside a container query
  through eight `:has()` selectors, and each section matched a different one. `.aih-t` and
  `.aih-d` are one role each.
- **`:has()` CARRIES ITS ARGUMENT'S SPECIFICITY, AND THAT IS THE TRAP THIS COST MOST TIME ON.**
  §63 §8b's `.app .sec:has(> .sec-h) > .sec-h h2` is **(0,4,1)**, not the (0,2,1) it reads as.
  Landing a restatement in the right container tier is necessary and not sufficient: a (0,3,1)
  rule loses inside the same tier, which looks exactly like the tier fix not having worked. Four
  of §8b's eight selectors are `:has()` and every one is a class heavier than it appears.
- **THE BLOCK IS CAPPED AT 60% SO THE DESCRIPTION WRAPS CLEAR OF THE ACTION.** 613:7985 is 687
  of 1332 — 51.6% — and 60 is that with slack. Uncapped, `flex:1 1 340px` grows to every pixel
  the action group is not using, and the pulse's derived sentence ran 890px to a few characters
  short of the button: one line of prose across the frame, 150 characters where §63 wants ~75.
  **The cap is also what makes the centring visible** — against a one-line block there is
  nothing to centre, so the button merely looked top-aligned.
- **THE 340px BASIS IS THE WRAP MECHANISM.** §24.132 gives `.sec-h > h2` `flex:1 1 auto` with
  `min-width:0` at (0,3,1); a flex item only moves to a new line when its BASE size does not
  fit, so with `auto` there was no base and the block shrank to 0 instead of wrapping — the
  title set one word to a line at 390 and the page did not overflow, so nothing measured it.
- **THE STAR IS 12px AND DOES NOT TRACK THE HEADING** (Maryam, 31 Aug 2026). 613:7987 draws 18
  against a 16px heading and that shipped for one round; §70.2a's reasoning is the one that
  holds — below the cap height of the words it reads as a bullet introducing the line, above it
  as a second object competing with it. One value everywhere, so it cannot drift when a heading
  changes size.
- **ONE STAR PER PAGE, NOT PER SECTION.** The mark says a block is Tal *speaking*; a page that
  says it three times has stopped attributing and started decorating. On `assessed` it is the
  enrolment offer; on the enrolled dashboards it is the pulse. "What the 90 days cover" is a
  plain `<h2>`.
- **AND `.aih-mk` IS NOT `.ai-label` OR `.ai-aura`** — `talFirst` hoists any `.sec` containing
  an `.ai-aura` to under the `.ph`, and `placeBand`'s `_mhIsTal` claims either class as head
  furniture. §72 records that trap at length.
- **REMOVING CONTENT LOSES A LABEL-COLUMN OPT-OUT TOO — TRAP 13, TWICE IN ONE CHANGE.** The
  course preview was opting out through §10.15's `:has(> .all-desc)` because its lede carried
  that class; folding the lede into `aiHead` dropped it, and the heading, the pill and the lede
  stacked into a 184px column with five chapter cards crushed beside them. §73.1b restates it on
  `:has(> .cov-row)`. §69 says this in as many words: "Adding a wrapper is not the only way to
  lose an opt-out — removing content does it too."

**Two more spacing rules both rows follow, and both were corrections:** the columns take the
section's own gutter and nothing else — no side padding on any cell, so the first mark is flush
with the heading above it — and the separation is the grid's `column-gap` with the divider at
`calc(var(--s07) / -2)`, one value driving the space and the line together. And a chip beside a
button is `align-self:center` at a stated 40, never `stretch`: stretch takes the height of the
flex LINE, which on these rows is set by the text block, so the chip came out 85px against a
40px button and dragged the group to 133.

### THE ENROLMENT OFFER — §73, `73-enroloffer.css` + `enrolOffer` / `coverSec` (views.js)

Figma 613:7983. **The page whose job is a $690 decision was drawing that decision as a black
card.** `enrolPlate` is a `.plate`, and §59 spends a layer establishing that as the loudest
object the product has, spent on something with a clock in it — while the note over
`enrolPlate` records its countdown being *removed* because "IN 2 WEEKS" read as a deadline on
the offer. So it was permanently drawing §59's quiet state. It is now a full-width white
section: a Tal-marked heading with the date chip and the accent CTA on its row, a lede, and the
four figures as a `.facts` row. Under it, `coverSec` replaces the flat thirteen-chapter list
with **four chapter cards and the remainder as a fifth cell**. §71's plate-to-white-row move,
applied one page earlier.

- **`enrolOffer` IS A SECOND FUNCTION AND `enrolPlate` STAYS.** `promoted` draws the same offer
  one level up and there it *is* in the head band — `placeDark` moves the plate into §56's
  second column, where the certificate is the second dark card spanning underneath. Taking
  `.plate` off would empty that column on a page this brief does not touch. What the two must
  not do is disagree about the offer, and they cannot: `ENROL_OPENS`, `ENROL_DESC` and the fee
  are read from one place by both.
- **TWO OF THE FILE'S FOUR FACTS ARE NOT TRUE HERE.** 613:7983 draws Course Fee, Cohort of 10,
  **Report Turnaround** and **Nearest Available Slot**. The last two are interview facts, and on
  `assessed` the interview has already happened — Priya signed the report on 21 August, which is
  what put the candidate on this page. Printing a nearest slot would offer a booking that is not
  on offer. The row keeps the file's shape and takes the four things enrolling actually buys,
  which are `enrolPlate`'s own `.plate-b` rows.
- **THE CELLS ARE CONTENT-SIZED WITH THE DIVIDERS CENTRED BETWEEN THEM**, which is §71.1c's grid
  again: 613:8074's cells are 187 / 213 / 175 / 196 across 1020, with Line 27/28/29 exactly half
  way between each pair. `.facts` is `auto-fit minmax(140px,1fr)` — four equal thirds, which
  puts "Cohort of 10" in the same width as "$690". **The class is still `.facts`** because
  §10.15's label-column opt-out names it (trap 13 answered by the class choice), but almost
  everything §29.17 gives it is overridden. **Three dividers needs three elements and a grid
  container has two**: the row carries `::before` and `::after`, and cell 3 carries its own,
  absolutely positioned out into the gutter beside it.
- **TWO ROWS A CELL, NOT THREE, AND THE LABEL IS THE STRONG ONE.** 613:8078/8079 are a 21px
  line over a 19px line — h4 over compact to the pixel — so the row that *names* the fact is
  larger than the row that states it. That inverts `.stat`, and it is right: these four are not
  figures being compared, they are four different things, and what you scan is the names. The
  fee is the one accent string, on the value.
- **`--t-sec-size` IS A NINTH SIZE AND IT IS RECORDED, NOT SMUGGLED IN.** 16px, for the three
  AI-native section headings — "Your learning pulse", "You're enrolling on…", "What the 90 days
  cover" (Maryam, 31 Aug 2026, by number). §63 §11's own rule is *take the nearest role* and h3
  is 17, one pixel off, which is what these shipped at first. This is a stated exception under
  §63 §7 on two grounds: it is a ROLE across two layers rather than one component's one-off, and
  every other section heading is 12.5, so it is not a near-duplicate of a size doing the same
  job. To revert, delete the token and point the three rules at `--t-h3-*`; nothing else reads it.
- **THE HEADING NEEDED (0,6,1) AND TWO TRIES, WHICH IS TRAP 3 PLUS `:has()` ARITHMETIC.** §63
  §8b sizes section headings *inside* `@container app (min-width:900px)`, so an unconditional
  rule cannot answer it at any weight — the three read 16 on a phone and 12.5 or 14 on the frame
  the product is read at. Restating inside the tier was still not enough: §8b's selector is
  `.app .sec:has(> .sec-h) > .sec-h h2`, and **`:has()` carries its argument's specificity**, so
  that is (0,4,1) rather than the (0,2,1) it looks like. Four of §8b's eight selectors are
  `:has()` and every one is a class heavier than it reads.
- **ONE STAR PER PAGE REGION.** The sparkle is the offer heading's alone. "What the 90 days
  cover" is a plain `<h2>` — the band already has "Summary by Tal" and the offer above carries
  the second; a third on the block underneath stops reading as attribution and becomes a bullet
  style. **The class is `.aih-mk`, not `.eo-mk`** — there is no `.eo-mk` and there never was in
  the shipped build: the mark is `aiHead`'s `mark:true` option, so the offer and the pulse wear
  the same object. It is **12px**, not the 18 an earlier draft of this note recorded; §70.2a's
  reasoning won (below the cap height of the words it is a bullet introducing the line, above it
  a second object competing with it) and one value everywhere is what stops it drifting when a
  heading's size changes.
- **AND `.aih-mk` IS NOT `.ai-label` OR `.ai-aura`** — the same hoist trap §72 records. This
  section is the page's second block and must stay there.
- **THE CLOSING SOCIAL-PROOF ROW WENT** (Maryam, 31 Aug 2026): a tinted bar with "Learners like
  you spend about 12 hours…", three cohort faces and "You're in good company". Two of its three
  parts were already on the page — the hours are the five chapter cells read together, the
  cohort of ten is one of the four figures. `enrolHours()` went with it, being that sentence's
  only caller.
- **THE FIXED-WIDTH ACTION GROUP IS THE ONE THING THAT CANNOT SURVIVE 390.** Chip 254 + gap 8 +
  button 185 is a 447px base against a 358px page, and with `flex:none` nothing could give: the
  row wrapped exactly as designed and then hung 38px off the edge. Full width and stacked below
  900, and the figures go 2 × 2 with the dividers switched **off** (`content:none`) rather than
  re-pointed — they are placed in named tracks that no longer exist.

### THE QUIZ BLOCK IS OFF THE DASHBOARDS, AND `quizResults` IS DELETED

Maryam, 31 Aug 2026. `V.dashboard`'s `consult` and `booked` branches were its last two
callers — `new` had already swapped it for a Quick Action when §70 rebuilt that page — so
the function is gone rather than orphaned. **Nothing is unreachable:** `V.result` still
holds all five bands and the rose, and the three routes in are `quickActions`
(`data-go="result"`), `SUMDROP.quiz`'s action (ai6.js) and the NIL microsite's Verify &
continue. The long argument is where the function was defined, in `views.js`.

`qzTaken()` STAYS and its own note is corrected in place: it now has two readers,
`V.result` and the `quiz` summary card, and they still must not sit the quiz on two dates.

### A COUNTED LIST OF SENTENCES IS BUCH — `.tile-stack.prose`, §63 §7b

`.cardrow-t` is in §63's h4 list because in fourteen of its fifteen call sites it holds a
**name** with a `.cardrow-d` description under it. The `booked` dashboard's "What to bring"
has neither: three full sentences, one per numbered row, which at 15/600 came out heavier
than the section heading above them. `.prose` on the `.tile-stack` takes the weight to Buch
and **leaves the size alone** — dropping to `--t-desc` would make each row a description of
the number beside it, which is not what it is. Scoped, not global: `V.welcome`'s "What
happens next" is the same `.cardrow-n` shape with real titles and is correct as it is.

### THE TOP BAR — §78, `78-topbar.css` + `placeTopbar` (ai11.js)

Maryam, 31 Aug 2026. **The portal switch came out of the bar, the breadcrumb took its
place, and the page heading went with it.** Three asks and they are one change: the switch
was a personal control standing in the frame's position, the trail is a frame control that
had no position at all, and the page's name was about to be said twice.

- **THE SWITCH IS A ROW IN THE ACCOUNT MENU.** `.pswitch` / `.psw-t` are **deleted** —
  §31's whole §1, §34's `margin-left` and §63's four references. §31's head keeps the
  three decisions in words. The face in the app bar now wears a chevron and opens a
  two-row menu: **Profile settings** (the `data-go` the avatar always had) and
  **Switch to {other portal}**, whose mark is the OTHER person's photograph rather than a
  glyph — `ACH`'s argument, and it needs no new icon.
- **IT IS `data-swap`, NOT `data-portal`.** That name is also the stamp `lead.js` writes on
  `.app`, and the router note records what a `closest('[data-portal]')` did when it started
  matching the root: every navigation in the product died at once, silently. A different
  attribute retires the collision instead of re-pointing it. Log out is deliberately NOT in
  the menu — it is in the rail's foot and it ends the session.
- **THE TRAIL IS THE PATH YOU TOOK, NOT THE PLACE YOU ARE, and this took three tries.**
  It started at the product (`TalentNext / …`), then at the module read off the view's
  hand-written `crumb()`. Both print where a page SITS: pressing "Book Priya now" on the
  dashboard gave `Interviews / All agents / Priya Nair`, three crumbs, two of them links
  back to pages the reader never opened. `trailParts` walks **`S.hist`** now, so the trail
  agrees with the back button by construction and `go`'s `fresh` rule — a rail item empties
  the stack — is free.
- **`pageLabel`'s FOUR SOURCES ARE IN THAT ORDER FOR A REASON.** A module is its RAIL
  label, never its heading, because the six dashboards' `<h1>` is a greeting; then the
  `<h1>`; then the hand-written `crumb()`'s tail; then the module. Nothing is composed from
  the button that was pressed — `V.agent`'s heading already reads "Book Priya Nair".
- **THE REMEMBERED LABELS ARE A STACK BESIDE `S.hist`, NOT A MAP KEYED BY VIEW.** A map was
  the first version and it fails the moment one view is visited twice: `agent` is whichever
  agent `S.agent` points at, so opening Owen rewrote the earlier "Book Priya Nair" crumb.
  `syncStack` DIFFS the stack's length on every render instead of hooking the six
  `S.hist.push` sites across five files.
- **THE HEADING AND THE IN-PAGE `.crumb` ARE BOTH REMOVED, UNCONDITIONALLY.** `.ph-bare`
  hides a `.ph` with nothing left in it — **hidden, not removed**, because §56 and §70
  place the band's members with `:has()` gates and `:has()` is structural, so a
  `display:none` element still satisfies every one of them at no cost in space. The
  dashboards keep their `.ph`: §62's face, medal and celebration live in it.
  `.crumb`'s own rules stay — `gallery.html` documents it for a hand-authored page.
- **THE BACK CONTROL IS "← Back" AND IT PAYS A CONTROL'S SPACING** (`.ph-backonly`,
  stamped by `tidyPh` because the test is a COUNT, not a `:has()`). Taking the title away
  left a 40px glyph paying a 26px heading's separation — ~100px of white.
  **§25.386 is (0,6,0), not the (0,3,0) it reads as**:
  `.app .modhead:not(:has(.ai-aura)):not(:has(.ask-sec)) > .ph` — `:not()` takes its
  argument's specificity and so does `:has()`, so every rule in that family is twice as
  heavy as it looks. It matched exactly the pages this fix is for.
- **ONE UNDERLINE, NOT TWO, AND GREY NOT BLUE.** §12.405's `.app a[data-go]` is (0,2,1) —
  every parent crumb is a `data-go` — so it beat the (0,2,0) the trail first shipped at and
  painted it blue with a border UNDER the anchor's own `text-decoration`. §78.1 kills the
  decoration and keeps the border (§02.56's idiom); §63 §18 states the three inks at
  (0,3,1). The trail is **16px `--t-sec-size` in Kräftig** — no new token, and that token
  now means "the build's 16px role" rather than "the section heading's 16".
- **IT IS A PASS BECAUSE `shell()` IS EVALUATED BEFORE `view()`** — one string
  concatenation in `render()`. The header ships an empty `.crumb-trail` and ai11 fills it.
  **LAST in the bundle**, and it is `tidyPh` that needs it, not the trail.

Riding with it: **the frame is restored before the first paint.** `vpSet` was the last
statement of the script, so a reload painted the markup's own `data-vp="mobile"` bezel,
then §01's `transition` on `.device`'s `max-width`/`height` slid it out to the stored
frame — which read as the page loading twice. A tiny inline script above the bundle stamps
the attribute (no transition runs: the element has no previous computed style yet) and
hides the box until the app is in it. The hide is written from JS onto the element's own
style, **not stated in §01**, because `.device` crosses into `design-system/` and
`tn-agent-portal.html` hosts itself in one.

**And `ai4.js`'s `go` wrapper was dropping its second argument** — `go(v)` instead of
`go(v, fresh)` — so a rail item has never emptied the back stack. Nothing showed it: `bk()`
hides the arrow on a rail root anyway, so the one surface reading `S.hist.length` was
masking it on exactly the pages it applied to. The trail is the first thing in the product
to render the whole stack rather than ask whether it is empty.

### THE PRE-COURSE DASHBOARD SHAPE — §82, and `assessed` / `promoted` share it

Maryam, 31 Aug 2026, over two asks: "change the You're enrolling on Explorer – E3 section to a
black card" and then "the Promoted to E4 prototype is similar to the Leveled, not enrolled
prototype, so you need to follow that dashboard ui here." **Both dashboards are now the same
three things:** the band (Tal's summary, with `jrnList` in column two), the enrolment offer as a
**full-width `.dark-card`**, and the reading blocks as **Quick Actions**.

- **`enrolOffer` IS THE ONLY WAY THE OFFER IS DRAWN — `enrolPlate` IS DELETED.** §73 split it
  in two for one stated reason: "taking `.plate` off would empty that column on a page this
  brief does not touch." The brief touched it; `jrnList` fills that column on both pages now, so
  the reason expired and the second function went. Every figure survives because §73 had already
  forced both halves to read `ENROL_OPENS` / `ENROL_DESC` / the fee from one place. **E4's
  optional second line ("Cohort 58 has 7 places left") moved onto the lede** — the date chip is a
  40px pill measured against the button beside it, so a second line in it breaks §73.1's pair.
- **§82 IS NOT A REVERSAL OF §73.** That layer's argument was against `.plate`, which §59
  reserves for an action with a *clock* in it; `.dark-card` is a different object with a
  different rule — §75's "this is the one thing the page is about". `.dark-card` is also **not**
  in ai5's `DARK_CARD`, so `placeDark` leaves it in the page body at full width; a `.plate` gets
  hoisted into §56's column two.
- **`journey()` NEEDED A `promoted` CASE AND `default` WAS HIDING IT.** That switch fell through
  to `LEVELLED` — step 3 of 4, "Not enrolled yet" — on a page whose subject is having finished.
  It rendered, and it was wrong: the failure a `default` branch always hides. With no `on` step
  the pill reads "Step 4 of 4".
- **`coverSec` IS DELETED AND ITS STYLESHEET IS NOT**, which is the one place the "gate nothing
  writes" test has a second reader: `design-system/talentnext-ds.css` ships `.cov-*` and
  `gallery.html` documents that markup as a recipe, so the box still writes those classes.
  `enrolPlate` is the opposite case — `.plate-d` / `.plate-n` keep `checkoutPlate` as a writer,
  so no CSS went with it.
- **Two Quick Action hues, named per §70.6:** `ic-cover` is `--mk-3`, `.cov-pill`'s own violet;
  `ic-found` is `--mk-1`, §74's hue for Priya's note. §82.4 states both.
- **What `promoted` deliberately does NOT copy:** "Cohort 41, in the end", "What changes at E4"
  and the certificate. `assessed` has no equivalent, so converting them would be designing
  rather than matching. `.keep-place` still earns its keep on the certificate — its note's
  "the band already holds the enrolment plate" clause is stale, but `.cert` is still in
  `DARK_CARD` and would now be hoisted into the journey list's column.
- **AND THE E4 CARD TOOK §108's COURSE BLOCK ON 3 SEP 2026** (Maryam: *"this promoted to e4
  four prototype course black card should also follow the course card on the leveled not
  enrolled prototype"*). `ENROL_COURSE` was keyed by level with **only an E3 entry**, and its
  note argued three of the four rows would be false on `promoted`. Two are answered and one
  is not:
  - **the name is AUTHORED** — "Business Leadership", against E3's "Business Fundamentals".
    `CH` is ONE thirteen-chapter array both levels read, so E4 is the same syllabus taken
    harder (which is what `ENROL_DESC.E4` always said) and the name is the same subject one
    tier up. New copy, like `CH_SYL` — §74 allows a name for the thing being sold. **It is
    not §86's cover title**: `build.py` calls the E3 artwork "Business Foundations" and there
    is no E4 cover, so a fourth one would need to match this name.
  - **the seat count is DERIVED and always could have been.** `taken:3` against `COHORT_SIZE`
    reproduces `ENROL_OPENS.E4[1]`'s existing "7 places left" exactly — the record's own
    arithmetic from a day earlier. The rating pair (4.7 / 128) is authored; nothing in the
    build rates a COURSE (`AGENTS` and `LEADER` rate people).
  - **THE LEADER ROW IS THE ONE E4 DOES NOT DRAW, and that is §69's ruling on a fourth
    surface.** `COHORT_LEAD.range` is E1–E3 and her cohorts are E3/E1/E2, so naming Priya as
    an E4 leader is the one thing on that card that would be false, and there is no second
    leader in the build. `lead` is optional now and `enrolOffer` tests for it. **A row with
    no face would be worse than no row** (`crow`'s undefined-`src` rule). If E4 should name
    a leader, that is a second `COHORT_LEAD`-shaped record and Maryam's call.
  - **ADDING E4 SILENCES ITS LEDE**, because `desc` is `ENROL_COURSE[lvl] ? '' : …`. The
    sentence is `ENROL_DESC.E4` and the course description says it at length; "7 places left"
    survives as the chip. **The string "Cohort 58" is genuinely lost** — the only place that
    number appeared. If it must stay, the fourth cell's label is where it goes, not the date
    chip (a 40px pill cannot hold two lines).
  - Measured at 390 / 744 / 1500: the two cards are now identical in cell count, wrap
    behaviour and description line count, with no overflow on either.

### THE RED ACCENT DEMO — a TENTH STAGE, and its duplication is deliberate

Maryam, 31 Aug 2026. **"Red Accent Demo" is a frozen copy of Day 34 drawn in solid
`#FF0000`, last in the stage picker, temporary, and explicitly not linked to anything else** —
it exists to be shown to somebody. §67 and `tmpaccent.js` already existed for an earlier red
trial and were inert; the demo is that machinery pointed at one stage instead of three
dashboards, so **no new layer and no new class were added**.

- **THE DUPLICATED RECORDS ARE THE POINT — DO NOT "TIDY" THEM.** Six stage-keyed records are
  typed out in full rather than spread from day 34's: `CFG`, `NOTIF`, `GAME`, `WEEKLY`
  (data.js), `PAGESUM` (ai6.js), `NEXT` (ai8.js). `reddemo: {...CFG.day34}` would have been
  three characters and would have re-linked the two by construction — every later edit to day
  34 would land on the demo. They are allowed to drift. `RED_DEMO` in data.js is where the
  whole argument is written.
- **WHAT IS STILL SHARED IS `views.js`, and `isDay34(s)` is the one place it is asked.** Eight
  branches decide seven facts the mock has nowhere else to put — chapter 4's `12 of 70 min ·
  4 opens`, its in-progress bar, `1 of 3` tasks, `4 of 5` on time, one overdue, 12 minutes
  done, and whether the dashboard reads as stalling. So a change to how those seven are
  **drawn** reaches both pages; a change to any stage's **data** reaches one. If the demo ever
  needs its own rendering, lift those seven literals onto the `CFG` record — where they
  arguably belong — rather than adding a second branch.
- **THE STAGE-WIDE SWITCH IS `TMP_ACCENT_ON`'s `'*'` VIEW.** The array still holds
  `[stage, view]` pairs so a single page can be named again; `[RED_DEMO, '*']` is every page of
  the stage, because a demo you can only walk one page of is a screenshot. §67 names no page in
  its own selector, so widening or narrowing is still one edit in `tmpaccent.js`.
- **IT TAKES TWO LAYERS AND §83 IS THE ONE THAT MATTERS — `83-tmpaccent2.css`.** §67 re-points
  the `--accent*` tokens and that is *all it can reach*: §70 states `--ai-1/2/3` on `.app`,
  which is the same (0,1,0) as `.tmp-accent`, and **§70 lands after §67**, so a re-point written
  there loses on order and the AI ramp stays orange **silently** — a custom property that loses
  does not warn. §83 is dead last and every selector in it carries `.app.tmp-accent` (0,2,0) or
  better. It covers the AI ramp (which drags Tal's label, `.aih-mk`, `.pulse-mk`, the summary
  wash, the inline highlight and the ask dock's travelling light with it), Tal's **sphere** at
  all three sizes (§50 overrides §33's and §40's own backgrounds, so restating §50's three
  selectors is the whole of it), `--brand-tint-2`, `--askv-*`, §39's bubble edge, `.sk-mark`,
  and §70's three `.rec-*` literals.
- **A RED RAMP IS THREE SHADES OF ONE HUE, NOT #ff0000 THREE TIMES.** Mapping all three stops
  onto the flat red would flatten every gradient whose whole job is to be a ramp. Each keeps its
  **lightness arc** and changes hue — light red, pure red, deep red — with `#ff0000` as the
  middle stop so the trial's stated colour is the one the eye lands on.
- **§83 STATES `color` THREE TIMES AGAINST §63's RULE, AND THAT IS DELIBERATE.** §63 writes
  `.ai-body p b`, `.jrn-pill` and `.jrn-i.on` as hardcoded `#f47113` rather than as a token
  (correctly — §39: "`#f47113` is NOT `--accent`"), so there is nothing for §67 to re-point.
  §83.4 lists all three with their specificity arithmetic. They take `#dc0000`, not `#ff0000`,
  for §67's own AA reason.
- **WHAT IS STILL NOT RED IS ONLY THE ARTWORK:** the award WebPs and the auth photograph
  (images cannot follow a token), `--tal-mark`'s PNG (nothing on the stage draws it — `.tal-fab`
  is `display:none` and §50 replaces the ask line's mark), and `--auth-o-*`, left orange so the
  trial cannot leak into a surface it was not asked for.
- **THE FILLS ARE `#ff0000` AND THE INK IS `#dc0000`, also §67's** — pure `#ff0000` is 4.00:1
  on white and would fail AA as text, which is exactly the fill/ink split §01 already makes for
  the orange.
- **REMOVAL IS ONE LIST**, written twice: the `reddemo` row in `STAGES` carries it, and §67's
  head carries the layer half.

### AND THEN #FF3733, WITH THE BUTTON SOLID — the SECOND re-hue of 4 Sep 2026

Maryam, hours after the first: *"I want you to change the whole platform accent color to
#FF3733. Change the gradient button to solid color and that will be #FF3733"*, plus new
specs for the dock border, the comet, the summary wash and Tal's text.

**READ THIS BEFORE THE THIRD ONE.** The #FF584A pass is what made this pass cheap — it
moved every leak onto tokens and wrote the derivations down as PERCENTAGES and CONTRAST
TARGETS rather than as hexes. So this was ~20 token edits and two Figma samples, against
the first pass's 33 literals across ten layers. The §83 advice in the section below still
stands, and it now has a second use: **the values in these two sections are a worked
example of every derivation, so re-run the derivation, never eyeball a new hex.**

| what | value | from |
|---|---|---|
| the accent | `#FF3733` | the instruction |
| the button | **solid** `#FF3733`, all three states | the instruction |
| `--accent-2` | `#EE0500` | the old pair's ΔL, re-applied |
| Tal's text and stars | `#FF3733 → #FF9A96 → #FF3733` at 136.05deg, stops 33.67/49.47/68.46 | her CSS |
| the dock border | `#FF3733 → #CCE7CB → #FF3733` at 70%, green at **60%** | 742:6191, sampled |
| the comet | white → red → `#CCE7CB` → red → white, all at 70% | her CSS |
| the summary wash | the same green and red at 5% | 761:6291, sampled |

- **THE BRAND IS NO LONGER A GRADIENT, AND THAT TURNS OVER §01's HEAD NOTE.** "THE
  SECONDARY COLOUR IS THE BRAND GRADIENT" had been true since the Create Account button
  was quoted out of Figma. **The three state ramps stay `linear-gradient()` with one stop
  repeated** rather than becoming `background-color`: §19 paints ~60 selectors with
  `background-image:var(--accent-grad)`, so a token that stopped being a gradient would
  need all sixty re-pointed to a different property. §107 had already taken this shape.
- **THE RAMP SPLIT IN TWO, WHICH IS THE STRUCTURAL CHANGE.** Tal's text/stars take a
  **salmon** middle and the dock border + comet take a **pale green** one — the first time
  in this component's life that the label and the light are different gradients. `--ai-2`
  is the text ramp's middle and **`--ai-line-2`** is the line's; `--ai-1`/`--ai-3` are
  still the shared ends. Neither was guessable: the text ramp is her CSS and the line ramp
  was **measured off 742:6191's render** — (254,55,51) at both ends and (202,229,202) at
  60% once the 70% is divided out, which is her own `rgba(204,231,203)` within two units.
- **THE GREEN'S 60% OFFSET WAS FITTED, NOT READ.** Her comet puts the green at 49.04%
  between reds at 22.6% and 75%, and the dock's peak is not there. A three-stop `0/60/100`
  predicts (236,121,108) / (213,199,175) / (223,165,146) at her three offsets; the render
  measures (235,119,106) / (212,196,174) / (222,166,146). Every channel within three, so
  the dock is three stops with the green at 60 — not five stops with the whites cropped.
- **EVERY INK WAS SOLVED FOR THE RATIO ITS PREDECESSOR HAD**, which is what stops a
  re-hue quietly becoming a legibility change: `--accent-text` #c51c18 (5.91, was 5.93),
  `--accent-hover` #ab1815 (7.31, was 7.32), `--accent-on-2` #b81a17 (6.57, was 6.61),
  `--accent-text-2` #a11714 (7.93, was 7.99), `--accent-on-dark` #ff7b79 (7.52 on
  `--gray-100`, was 7.53). **The FILL got safer again** — 3.59:1 against #ff584a's 3.11
  and the original orange's 2.84 — and is still the stated sub-AA exception.
- **EVERY TINT WAS RE-DERIVED AT ITS MEASURED STRENGTH**, not at its stated one:
  `--brand-tint-2` #ffccca (25.7%), `--accent-tint` #ffd6d5 (20.4%), `--askv-stroke`
  #ffa4a2 (45.5%), the bubble's middle #ffcac9 (26.3%), `--tal-chip-1` #ffe8e8 (11.4%),
  `--auth-wash-1` #ffcdcc (25.1%).
- **`--accent-2` SURVIVED THE BUTTON GOING SOLID, AND THAT IS THE ONE JUDGEMENT.** Eleven
  rules read it and only three were the button: the black card's haze ramps to it, and so
  do `--askv-stroke-hot` and `--auth-o-2`. So it is "the accent one step deeper" now,
  derived as #ff584a → #f83524's ΔL of −0.088 re-applied. **FLAGGED: if "solid" means the
  whole accent is one colour, `--accent-2:var(--accent)` is one line** and the haze goes
  back to §21's original single ellipse. Not assumed — the two-stop haze was asked for by
  name that morning and has not been retracted.
- **§107 HARDCODES THE ACCENT AND WOULD HAVE SHIPPED THE OLD RED.** Two scoped blocks set
  `--accent` / `--accent-text` / `--accent-2` / the three grads by hex rather than reading
  §01, so a platform token change reaches every screen **except the onboarding** — the one
  flow whose chat §115 had just been made to match. Both blocks re-pointed by the same
  derivations. **And the flat `--accent-grad` there is now what §01 says**, so half that
  block's reason has expired; the ink is still a real difference (the flat accent against
  §01's AA-safe #c51c18), but these are the lines to try deleting first.
- **THE SPHERE'S ARC WAS RE-DERIVED, NOT RE-PICKED — the same method, second run.**
  #FFC8C6 / #FF3733 / #EE0500 lands within .003 luminance of the previous three at every
  stop. Six sites, one string (§33 once, §40 twice, §50 three times).
- **`--ai-amber` READS NOTHING** — grepped, zero `var(--ai-amber)`. It named the original
  orange ramp's middle, which has since been a magenta and a salmon. The "gate nothing
  writes" tell; left rather than deleted in a colour pass.
- **AND THE RED ACCENT DEMO IS MEANINGFUL AGAIN, BY ACCIDENT.** §67/§83 are still on
  #FF584A, so the `reddemo` stage now previews the *previous* platform accent rather than
  the current one. It renders; it is a preview of nothing shipping. `RED_DEMO`'s note
  argues for its six duplicated records and removing the stage is still Maryam's call.

**Verified:** `--accent` / `--accent-2` / `--accent-grad` / `--ai-1` / `--ai-2` /
`--ai-line-2` all resolve on the live page; the primary button's `background-image` reads
back as `linear-gradient(90deg, rgb(255,55,51) 0%, rgb(255,55,51) 100%)`; the label's ramp
and the dock's `border-image-source` read as written; the comet's five `stop-color`s are
white / #ff3733 / #cce7cb / #ff3733 / white. Swept by eye: the candidate dashboard, the ask
page's sphere and composer, the onboarding's voice screen (§107 following), and the agent
portal via `build-ds.py`.

### THE ACCENT IS RED — `#FF584A`, 4 Sep 2026, AND IT IS SIX SEPARATE ASKS

Maryam: *"I want you to change the whole platform accent color to #FF584A"*, plus five
Figma nodes / CSS blocks for the things that have a gradient of their own. **All three
portals follow**, the agent portal by re-running `build-ds.py`.

| what | new value | from |
|---|---|---|
| the accent | `#FF584A` | the instruction |
| the gradient button | `linear-gradient(90deg,#FF584A,#F83524)` | 737:6161 |
| the ask dock's border | the AI ramp, as a `border-image` | 742:6191 |
| the travelling light | white → `#FD4E59` → `#F480F2` → `#FD4E59` → white, all at 70% | her CSS |
| a black card's haze | `#FF584A → #F83524`, ramping left to right | her CSS |
| the Tal summary wash | the same three stops at 5%, re-hued | 578:6047 |
| Tal's text and the stars | `#FD4E59 → #F480F2 → #FD4E59` at 70% | her CSS |

**§67 AND §83 DID MOST OF THE WORK EIGHT DAYS EARLY, AND THAT IS THE THING TO KNOW BEFORE
ANY FUTURE RE-HUE.** The red-accent demo was built on **this exact hue** on 31 Aug 2026,
so those two layers are a complete, tested map of everywhere the accent leaks — tokens,
the AI ramp, the sphere, the bubble border, `--askv-*`, §63's three literals. Promoting
them into §01/§12/§53/§63 was most of this change. **Read §83 first the next time the
accent moves**; a grep for the old hex finds 33 live values across ten layers and misses
the four that are already tokens pointing at each other.

- **THE INKS ARE §67's AND THEY GOT SAFER.** `--accent-text` #b94a09 → **#bd2c1f** (5.19
  → 5.93:1), `--accent-on-2` → **#b1271b** (6.61), `--accent-hover` → **#9d2f25** (7.32),
  `--accent-on-dark` #f68441 → **#ff7c70** (7.46 → 7.53 on `--gray-100`). The FILL got
  brighter and is still the stated sub-AA exception: 3.11:1 against #f57414's 2.84.
- **THE ANGLE CHANGED AND THAT IS THE FILE'S.** `--accent-grad` was 104.86deg at
  10.02%/115.55% — the old Create Account button's, quoted to the decimal. 737:6161 is
  `bg-gradient-to-r`, so it is **90deg at 0%/100%** now, and the hover and active ramps
  follow so the three cannot disagree.
- **THE TINTS PRESERVE THEIR STRENGTH, NOT THEIR STATED PERCENTAGE, and that mattered.**
  §12's `--accent-tint` calls itself "the accent at 8%" and #fde3d4 measures **20.1%** of
  the old accent; §67 had picked #fff2f1, which is a true 8%. Re-deriving from the comment
  would have made every chip ground in the product two thirds paler in a change nobody
  asked for. Every tint is `<measured α> of #ff584a` instead: `--brand-tint-2` #ffd4d0
  (25.9%), `--accent-tint` #ffdddb (20.1%), `--askv-stroke` #ffb3ad (45.3%), `--tal-chip-1`
  #ffecea (11.5%), `--auth-wash-1` #ffd5d1 (25.2%).
- **THE RAMP IS SYMMETRIC NOW, SO `--ai-1` AND `--ai-3` ARE THE SAME VALUE.** That looks
  like one token too many and is not: §70.3's dock glow reads all three and §88 falls back
  to 1 and 3, and keeping three is what lets §83 re-point the ramp without rewriting the
  gradients. **`--ai-alpha` is a token** (70%) because `--ai-1` is *also* read as a solid —
  the dock border, `.qa-ic`'s fill, `.sumdrop`'s edge — where 70% would be a second
  decision nobody made; `color-mix` puts the alpha in the gradients only.
- **THE 70% COSTS CONTRAST ON TAL'S LABEL AND IT IS DRAWN AS SPECIFIED.** Clipped to text
  on white, `rgba(253,78,89,.7)` composites to #FE838B — **2.38:1**, against the old
  #f47113's 2.84. §63 §10 already states this family as a §7 exception, the sparkle beside
  it is painted through the same ramp so the label is never the only carrier, and §63 §41
  is the precedent for a stated sub-AA value that is Maryam's call. **To reverse it, set
  `--ai-alpha:100%` — one line, and the three stops stay the file's.**
- **THE HAZE IS ONE TOKEN AND TWO ELLIPSES, NOT THE ROTATED BLURRED DIV THE SPEC
  DESCRIBES.** §21.22a states `--dark-haze` and §75 reads it — those two had written the
  same radial out twice, so "the black card's haze" was two values that happened to agree
  and one of them would have moved. **A real `filter:blur(250px)` element costs §75.3's
  three extra rules** (`position:relative` + `overflow:hidden` on the card, `z-index` on
  every child) and §21's own note records `.ldr-read` painting a 700px rectangle across a
  head band for want of them. The ramp is drawn as the two stops side by side instead —
  `--accent`'s ellipse at 66% across, `--accent-2`'s at 96% — which is the file's direction
  and both its colours, still as a flat `background-image`.
  - **19% EACH, WHICH IS ARITHMETIC.** At x=66% the second ellipse lands at
    1 − (30/56)/0.64 = 0.163 of its own alpha, so `1 − (1−.19)(1 − .19×.163)` = **0.215**
    against the single layer's 0.22, and the mid-point computes to 0.208 — flat across its
    middle rather than two lamps. **15% each was the first value and measures 0.171**:
    visibly dimmer than the day before, in a change that is about hue and not brightness.
  - The alpha moved off the element and into the stops, which retires an `opacity` on a
    resting state (trap 2).
- **THE DOCK'S BORDER IS BUILT FROM THE NODE'S RENDER, NOT ITS CODE EXPORT.** 742:6191
  exports `border-[#fd4e59]` — a gradient stroke flattened to its first stop, with the
  gradient itself reported as an empty `stroke gradient:` string. Sampled at 988px the top
  edge composites to (252,131,139) at both ends and (247,165,244) at the centre; dividing
  the 70% back out gives **#FD4E59 and #F480F2 — the label's three stops exactly**. So
  "follow the gradient only from this" turns out to mean the dock's edge and Tal's own name
  are one gradient. `border-image` + `border-color` together, per §39's construction.
- **THE COMET'S .7 IS `stop-opacity`, NOT A COLOUR.** SVG has no `rgba()` in `stop-color`,
  and baking the alpha into the hex would need it composited against what is behind — which
  on that element is the dock's own coloured border, not white.
- **THE SPHERE MOVED AND SHE DID NOT NAME IT.** It is the most accent-coloured object the
  product draws and it sits 12px from the dock, so an orange ball beside a red field reads
  as a component that failed to update. The method is **§83's own** — "a red ramp is three
  shades of one hue… each keeps its lightness arc and changes hue" — so #F6DC92 / #F47113 /
  #E85D0F becomes **#FFD0CC / #FF584A / #F83524**, one string at **six sites** (§33 once,
  §40 twice, §50 three times). The literals stay literals for §70's reason: the three are
  also the ball's specular arrangement, and a ramp assembled from tokens a demo may
  re-point drifts.
- **§63's THREE LITERALS ARE `--accent-text` NOW, AND §39's RULE FOR THEM EXPIRED.** That
  rule was "`#f47113` is NOT `--accent`", the ramp's hue and the brand's being a shade
  apart — and the re-hue closed the gap from both ends: the accent is #ff584a and the ramp
  is #fd4e59, and #f47113 is neither. Left alone those three would have been the only
  orange left in the product. **The one that is a judgement is `.jrn-i.on`** — §63 §14
  records the file's #f47113 at 3.1:1 as Maryam's call, and that argument was about a HUE
  the AA substitution got wrong ("a brown that did not match the accent anywhere else");
  it is the accent's own ink that answers it now.
- **`.rec-see` MATCHES NOTHING and was re-pointed anyway.** Grepped 4 Sep 2026: `.rec-r`
  has three call sites and `.rec-see` has none — §63 §33 records why (the button left that
  group when the card went black). Flagged: if it is ever written again it is on a BLACK
  card, so the ink is `--accent-on-dark` (7.53) and not `--accent-text` (3.19 there).

**AND FIVE CORRECTIONS CAME BACK THE SAME DAY. Every one of them is the accent
re-hue being told where it does NOT reach, which is the useful shape to recognise.**

| ask | what changed |
|---|---|
| *"for tal text and star change the gradient colors opacity to"* + flat hex | `--ai-grad` / `--ai-grad-alt` run at **full strength**; the 70% survives on `--ai-line-alpha` alone |
| *"the module selected icon and text should be in #ff584a and remove the text color on hover"* | the rail label came off §12's hover list |
| *"some places had to have the bright orange accent … that shows the in progress, status kinda thing"* | `.jrn-i.on` and `.jrn-pill` back to `#f47113` |
| *"the rating star will always be yellow"* | `.rec-r svg` → `--star` |

- **THE 70% WAS THE FLAGGED COST AND IT WAS TAKEN BACK IN ONE LINE.** The first spec
  gave the ramp as `rgba(...,0.7)`; clipped to text that composites to #FE838B, 2.38:1,
  which was shipped as specified with `--ai-alpha` named as the reversal. The second spec
  is the same three stops as flat hex — **#FD4E59 is 3.28:1**, better than the orange it
  replaced. **The token was renamed `--ai-line-alpha` rather than deleted, and that is the
  correction that matters:** the dock border's 70% is *measured* off 742:6191's render and
  the comet's `.7` is in Maryam's own CSS for it, so the FILLS are full strength and the
  two 1px LINES are 70%, each because its own source says so. One token for both was the
  mistake — the name said "the ramp's alpha" when it meant "the line's".
- **THE RAIL'S HOVER INK WAS REMOVED FROM §12's LIST, NOT OVERRIDDEN** (trap 4's
  discipline — that selector is where "which rows recolour their title on hover" is
  decided). §12 gave every full-bleed row's title `--accent-text` on hover, which is that
  layer's whole idea; the rail is the one member where it costs more than it buys, because
  §63 §41 already spends the accent on the row you are ON. **And it reached the selected
  row too** — `.sn-item.on:hover > span:first-of-type` matches, so pointing at the page you
  are already on took its label *down* from #ff584a to #bd2c1f. Invisible from the source.
  The 3px marker, the 600 weight and §01.623's wash all stay.
- **THE JOURNEY'S STEP STATES ARE A SET, NOT THREE VALUES.** §63 §14 already called
  `#00a43c` / `#f47113` / `#515151` "the file's three exactly"; green and grey never moved,
  and pointing the middle one at `--accent-text` made a green *done* sit beside a dark-red
  *in progress*, which reads as a failure. **The test the re-hue should have applied: does
  this value mean the brand or does it mean a state?** `.jrn-pill` went with it — it counts
  the step 16px above the list, so a red pill over an orange marker is two colours doing one
  job inside one component. **`.ai-aura.talsum .ai-body p b` stays red** and passes the test
  cleanly: those are figures being pointed at, not a state anything is in.
- **AND `.jrn-pill` WENT BACK TO THE ACCENT AN HOUR LATER** (*"the steps chip text should
  be in FF584A color"*), which overrules the judgement call in the bullet above. The two
  are not one job: `.jrn-i.on` marks WHICH STEP you are on — a state in a set of three,
  which is why its green and grey siblings never moved — and the pill states WHERE YOU
  ARE IN THE WHOLE ("Step 2 of 4"), a reading of the journey. `--accent` at **3.11:1** is
  the second stated sub-AA exception in §63, on §41's grounds: never the only carrier,
  one chip per screen. The token, not the hex, so it follows the next re-hue.
- **THE RATING STAR WAS THE ONLY ONE IN THE PRODUCT THAT WAS NOT `--star`.** §15.960,
  §44.157 and §108.235 all read that token; `.rec-r svg` was `#f47113` because 581:6479
  draws it that way, then `--accent`, which put a red star beside four yellow ones.
  §83's `.rec-r svg` rule is **deleted** — a star that never follows the accent has nothing
  for a demo to re-point.

**THREE THINGS ARE NOW REDUNDANT AND NONE OF THEM WAS DELETED.** Say so before touching
any of them:

- **THE RED ACCENT DEMO IS A DEMO OF THE PLATFORM.** §67 re-points `--accent` to
  `#ff584a`, which is what §01 now says, so the `reddemo` stage differs from every other
  stage only in §83's `--ai-1/2/3` — the older monochrome red ramp against the platform's
  red-into-pink. It renders and it is no longer a preview of anything. `RED_DEMO`'s note
  argues at length for its six duplicated records; removing the stage is a real deletion
  and Maryam's call.
- **§107's TWO LOCAL RE-POINTS ARE NO-OPS.** The onboarding layer sets `--accent:#ff584a`
  and `--accent-text:#ff584a` in two scoped blocks — the second is still a difference (the
  platform ink is #bd2c1f) but the first is the platform value restated.
- **THE AUTH PHOTOGRAPH AND THE AWARD WebPs ARE STILL WARM**, which is §83's own carve-out
  and is not fixable in CSS: an image cannot follow a token. `--auth-o-*` DID move (§83
  left them orange "so the trial cannot leak into a surface it was not asked for", which
  was right for a demo and wrong for a platform re-hue), so the form's ink and buttons are
  red on a photograph that is not.

**Verified:** zero occurrences of the eighteen old warm hexes anywhere in the built portal;
`--accent` / `--accent-2` / `--ai-1` / `--ai-2` / `--ai-alpha` / `--dark-haze` all resolve
on the live page; the dock's `border-image-source` and the comet's five `stop-opacity`
attributes read back as written; and all three portals swept by eye at desktop — candidate
dashboard, the ask page's 132px sphere, the enrolment offer's black card, login, the leader
dashboard and the agent portal's own dashboard.

### THE PROFILE PAGE, TRIMMED — 4 Sep 2026, ten asks in one session

Maryam, on `V.account` (the page the rail calls **Profile** — `V.profile` does not exist,
which is worth knowing before a hash like `#assessed/profile` sends you to the dashboard
with nothing thrown). Read together the ten asks are one instruction: **this page states a
record, and everything that is not the record comes off.**

| ask | what changed |
|---|---|
| *"remove the desc of scene"* | `.scv-d` gone; a scene card is its title then §108's `.eo-lead` |
| *"Add the 'Ask Tal why these scenes were chosen…' line we have on the interview module"* | `scenePick`'s `.scene-ask` **verbatim**, under the scroller |
| *"add only two jobs … related to a business explorer person"* | five design roles → Operations Lead (Tkxel) and Business Operations Analyst |
| *"remove add and the bottom detail desc row from experiences"* | the `desc` FIELD deleted — record, form textarea and `pfMiss` branch |
| *"give the add button … at the left of the edit button"* | `PF_ADD`, on the heading row |
| *"All the edit buttons … icon only, same goes for the add button"* | §111.12, a 32px square that keeps its border |
| *"remove this"* ×3 (Experience, Education, Interests) | `pfGap` and its `.note` deleted |
| *"remove such icons in each section against rows"* | `pfRow`'s `ic` argument and every `.cardrow-ic` |
| *"remove these"* (endorsements) | `PF.skills` is a list of STRINGS now |
| *"remove this whole section"* (Interests) | `PF_INT`, `PF.interests`, `pfFormInt`, `pfSecView.int` |
| the two IBM badges, the COMSATS crest, *"equal to the height of the right side content"* | `pfArt` + §111.13, and the three files are in `hifi/build/logos/` |
| *"remove this"* (Who can apply?) | §116.3's note and its one rule deleted |
| *"remove logout from all settings tabs except My Profile"* | gated on `S.pfTab === 'me'` |
| *"remove become a leader black card from all tabs"* | **`leadSec` deleted** — one caller, and the tab replaces it |
| *"remove the lahore punjab row from both experiences"* | the `place` / `mode` FIELDS deleted with the line |
| *"on editing, a border comes on the section"*, *"remove the divider after the job title"*, *"remove the count against each job"* | §111.5 down to padding and a head row; `pfEntry` lost its `n`, `pfNum` deleted |
| *"the line of each field should be … very light"*, *"on click … the accent color FF3733"* | **§12, platform-wide** — see below |
| *"the notification should each be in a row"*, then *"use dividers between them instead of … blocks"* | §105.4 — one column, no frames, `border-top` between |
| *"remove the dividers between these two rows"*, *"colored icons without blocks"* (Sign in) | §111.14, `.pf-sr` + a bare 20px `--mk` glyph |
| *"remove what tal can do and your data sections"* | both gone from Privacy Settings |
| green tick + new copy on the cohort-leader confirmation | §111.15, `.note.cl-ok` |
| *"in this black card, right center align button"* (the pulse) | §85.2's `align-self:flex-start` **deleted** |

- **THE RING MOVED AND THAT IS THE POINT OF DERIVING IT.** `PF_SEC` is five sections and
  Experience has nothing left to be missing, so `pfDone()` reads **4 of 5** where it read 3
  of 6 — on the dashboard's Quick Action ring, on the tab strip's `.lf-n` and anywhere else
  that asks. Nothing was edited to move it.
- **AN ISSUER'S MARK IS A FILE, AND A MISSING FILE IS NOT AN ERROR.** `build.py`'s `PF_ART`
  block globs `hifi/build/logos/<stem>.{png,webp,jpg,svg}` — `ibmco`, `ibmpr`, `comsats` —
  embeds what it finds, omits what it does not, and prints the count either way. `pfArt`
  falls back to the row's old glyph chip, so the page is correct with none of them present.
  **THE ASSET CANNOT COME FROM THE CHAT**: every other picture in this build (the cohort
  covers, the six certification badges, the call photographs) arrived as a FILE in this
  repo or in `~/Downloads` and was embedded from disk; an image pasted into the
  conversation is not on disk and nothing can read it. The three arrived that way an hour
  later and are in now — **`ibmco.webp`, `ibmpr.webp`, `comsats.jpeg`**, prepared the way
  every other set in this build was: the two 352px PNGs downscaled to 128 and written as
  LOSSLESS WebP (50 KB each → ~10, §96's reason — a ring of 5px type smears at q82), and
  the crest left as its own 100px JPEG because lossless WebP made it three times BIGGER.
  **The glob tries `.png` before `.webp`**, so a stale PNG beside a WebP of the same stem
  wins; the originals were deleted rather than kept alongside.
- **THE MARK IS SIZED BY WHAT THE ROW CONTAINS, WHICH IS TWO SIZES.** A certification has
  three lines and measures 59; the education row has two and measures 38, and one stated
  value put a 21px overhang under the crest. `:has(.pfe-row-x)` picks the taller — §10.15's
  "keyed on contents" test, one component over. **`align-self:stretch` + `aspect-ratio` was
  tried and measured**: flex resolves the main size first, `width:auto` on a box holding an
  `<img>` is that image's NATURAL width, and the ratio then drives the height up — the marks
  came out 100x100 and 128x128 and the rows grew to 124 and 153. Stated is the only thing
  that works in this position, which is what §86 found from the other side.
- **THE BOX IS THE SUM OF THE THREE TYPE ROLES BESIDE IT**, §86's technique — `--t-h4-lh` +
  §02's own 2px + `--t-desc-lh` + `--s02` + `--t-desc-lh` = 59, measured against
  `.cardrow-b` rather than derived on paper. **Not `align-self:stretch` and not
  `height:100%`**: §111.1 and §86 both record that trap from their own side (stretch
  measures the flex LINE, and a percentage height wants a definite parent).
- **AND `leadSec` IS GONE, WHICH IS WHAT THE TAB WAS ALWAYS GOING TO COST.** The black
  wall at the foot of `V.account` was hidden on its own tab first (§112's duplicate test)
  and then removed outright. Three things survive it and are written up where the function
  was: `.lead-b` is in ai5's `DARK_CARD` **and** ai4's `GLOW_ON`, so a page that draws one
  gets it hoisted into the head band unless the wrapper carries **`.keep-place`** — whose
  one writer this was, so that documented escape hatch now has no caller and must not be
  deleted for looking dead; the tags' marks are white rather than hued because the named
  marker hues run 2.2:1 to 3.1:1 on `--gray-100`; and **the CSS stays** (§82's case — eleven
  layers state `.lead-*` and `design-system/` ships it). Its one FALSE line went with it:
  "You've completed your 90-day journey", drawn at every stage including week 1.
- **LOG OUT IS ON MY PROFILE ALONE**, which turns over the note that put it under the strip
  on every tab. That note's argument — "a Log out that appears on one tab of three is a way
  out you have to go looking for" — did not account for §78's account menu and the rail's
  foot, which carry Log out on every page of the product; this is a fourth copy, and on the
  settings tabs it was landing at the foot of somebody else's subject.
- **THE FOURTH TAB IS `leadSec`'s CARD ANSWERED IN FULL** — *"on the right of privacy
  settings add another tab of 'Become a Cohort Leader'"*, with the screen attached. §116 is
  two arrangements (a four-across card grid, a pair of bordered lists) over `aiHead`, §87's
  `.lrn` and §02's `.note`; the copy is the reference's, transcribed, and it agrees with the
  leader portal at every point (volunteer, three hours, a certification). **It presses the
  same `data-leadapply`**, and `V.account` skips `leadSec` on that tab, because two Apply
  buttons on one screen is §112's duplicate.

- **THE FIELD LINE IS A PLATFORM CHANGE AND IT TURNS OVER THE 3 Sep CARVE-OUT.** §12 now
  rules every `.inp` with `--rule` (#e9e9e9) and lights it **#FF3733 at 2px on focus**;
  §37's `textarea.inp` follows so one form cannot hold two focus colours. That day's
  hairline note had kept `--border-strong-01` (#8e8d8a) for control edges on the argument
  that "an input edged #e9e9e9 is a field you cannot see" — what makes the reversal work is
  the second half of the ask: the line you are ON is now the loudest hairline on the page,
  where it used to be a 2px BLACK rule (`--brand-primary` is `#000000`). **#FF3733 is a
  third red and a literal** — not `--accent` (#FF584A), not `--accent-2` — so a grep for the
  accent will not find it on the next re-hue; §83's own lesson, stated where the rule is.
  The auth card is the one surface that does not follow (§17's `--auth-rule`).
- **AND THE DATA-USE NOTICE NOW PROMISES A BLOCK THAT IS GONE.** Clause 6 of `AUTH.terms`
  reads "Profile holds every switch: pause Tal, ask for a level review, download everything
  we hold, delete a recording, or close your account" — with "What Tal can do" and "Your
  data" removed, only the last of the five is on the page, and `PAGESUM.account` still
  points at it ("what I'm allowed to remember, and what I can do without asking"). Flagged
  and not fixed: the two honest settlements are editing the clause or putting the three data
  ROWS back without the switches, and both are Maryam's call.

### THE AGENTS TABLE, TUNED — §114 over one session, 4 Sep 2026

Nine asks on `V.agents` in a row. Read together they are one thing: the table was
authored at a wide desktop frame and every column had been sized by what the grid gave
it rather than by what its content is.

| ask | change |
|---|---|
| *"a lot of space after the first column, the other column are looking congested"* | column 1 `1fr` → `auto`; the gap `--s04` → `--s06` |
| *"why we are not giving the equal space between all columns?"* (at 1728) | no track flexes; the leftover goes into the GAPS, `justify-content:space-between` |
| *"each column should have equal space from the left side column"* | the chips `1fr` → `minmax(0,auto)`; the slack moved to column 6 |
| *"this column should have more width so when i hover on star … it should not affect the position of the other columns"* | `--agt-act-w:200px`, and `justify-self:stretch` |
| *"these expertise should have full round sides not edgy"* | `border-radius:999px` on `.agt-tag` |
| *"instead of blob I would recommend the star icon we are using with the summary"* | `--ai-star` masked, painted with `--ai-grad` |
| *"reduce the star size"* / *"mid align ask tal with the star"* / *"ask tal color should be of the star gradient color"* | 14 → 12; `.lbl` margin zeroed in §29 §2; the ramp clipped to the words |
| *"align the stars with the rating digit"* + *"3 rows … equal spacing"* | `.stars svg{margin:0}` |
| *"remove the interview part from experience"* / *"remove the time from this column"* | both second lines dropped |

- **EVERY PLACE TO PUT THE SLACK IS A VOID, WHICH TOOK THREE VERSIONS OF ONE RULE.** A
  `1fr` on the chips put ~150px of white before Experience; moving it to the actions column
  moved the same white to the far right, behind the pinned pair — measured ink-to-ink,
  **12, 12, 12, 50, 157** at 1280 and **12, 12, 12, 50, 303** at 1728. A track that grows
  while its content is aligned to one side turns its growth into a gap. All six tracks are
  intrinsic now and `space-between` shares the leftover between them, so the columns spread
  across the frame together (at 1728 the last gap is 201 rather than 303, and the head cells
  sit 53 apart rather than 24). **It works only because the rows are `subgrid`** — they take
  the parent's lines, so a distribution on the parent moves every row with it.
- **THE ONE GAP THAT STAYS WIDER IS THE HOVER RESERVATION.** `--agt-act-w` is 200 for a pair
  that measures ~124, which is the earlier ask ("it should not affect the position of the
  other columns"). Reclaiming those ~76px means giving that up.
- **TWO CLASS COLLISIONS CAUSED THREE OF THESE, AND BOTH ARE STILL LIVE ELSEWHERE.**
  `stars()` writes `<svg class="f">` for a lit star and §02.136 is
  `.f{margin-bottom:var(--s05);display:block}` — the **form-field** utility — so every
  star glyph carries 16px under it and `.stars` measures **29px for a row of 13px
  marks**. That was both the "align the stars" and the "equal spacing" complaint at once:
  the mid-points were genuinely level (293.5 against 293.5) and the stars simply sat in
  the top 13px of a 29px box. `.lbl` is the same story one class over — §02's form
  *label*, with `margin-bottom:var(--s02)` — and §29 §2 had already diagnosed it for three
  surfaces and written the diagnosis down; the table was the fourth and was not on the
  list. **Every star row in the product still has the `.f` phantom** (§16.381/384 fix the
  `display` half only); the general repair is `.app .stars svg{margin:0}` or renaming one
  of the two, and both reach ~40 call sites.
- **`max-width:none` ON A BASE RULE OUTRANKED §35's `:has()` CAPS** — same class of
  mistake as §115's, found the same way. See that section; the fix is
  `:not(:has(.tw,.bkw,.gen,.bk-list))`.
- **THE HOVER RESERVATION IS ARITHMETIC, NOT A ROUND NUMBER.** 14 (mark) + 4 (`--s02`) +
  80 (the label's stated cap) + 24 (`--s04` ×2) + 2 (border) = **124** for the star at
  full stretch, + 8 + 61 ("Book", measured) = 193 → **200**. `justify-self:stretch` is the
  load-bearing half: with `end` the cell still shrink-wraps and only *looks* right.
  Verified by measuring `.agt-fee`'s `left` with and without the pointer on the star —
  641 / 729 / 840 / 1035 in both states.
- **AND TRAP 17 MADE THAT VERIFICATION LOOK LIKE A BROKEN RULE.** With the Browser pane
  hidden, `document.hidden` is true, **no frames arrive, so a `transition` never
  advances** — `getComputedStyle` returned the from-value (`max-width:0`) while
  `lbl.matches('… .tal-star:hover .lbl')` returned **true** and the rule was sitting right
  there in the CSSOM at (0,5,0) with `80px`. Killing the transition made it resolve
  instantly. **If a hover/transition reads as "not applying", check `document.hidden`
  before the cascade.**
- **A `1fr` PUTS ALL THE LEFTOVER IN ONE GAP.** Content-edge to next-cell-edge measured
  **12, 158, 12, 12, 12** — the chips' track was the only flexible one, so it swallowed
  every pixel nothing else wanted. `minmax(0,auto)` for the chips and
  `minmax(var(--agt-act-w),1fr)` for the actions gives **12, 12, 12, 12, 12**, and the
  slack sits behind the buttons where §114.2b already pins the pair right.
- **`999px` IS THE THIRD STATED RADIUS EXCEPTION**, after §56's marks and §31.6's flag
  chip, and it is a literal for §31.6's reason: a `--radius` token that is 0 everywhere is
  worth being able to trust. Scoped to `.agt-tag` — `.tag` has ~40 other call sites.
- **THE SPARKLE WAS THE BLOB BY OMISSION.** §27.36 points every `.tal-star .sk-mark` at
  `--tal-mark` and §27.332 re-points three surfaces back; this table is newer than that
  list. It takes the **summary's** star — `--ai-star` + `--ai-grad`, not §27.332's flat
  `--accent` — because that is what "the star icon we are using with the summary" names.
  **Flagged: `.agh` and `.ag` still wear the flat sparkle**, so the mark is drawn two ways.
- **BOTH DROPPED LINES WERE SAID TWICE ON THE SAME ROW.** "210 interviews" is printed in
  `.agt-m` 500px to the left of the Experience cell, and the hour belongs to §76's slot
  grid two clicks on. `a.slot` is still one string and still printed whole by five other
  surfaces; only `parts[1]` lost its reader.

### THE E4 CARD NAMES A LEADER — `COHORT_LEAD_E4`, 4 Sep 2026

Maryam: *"on this black card why we are not showing 'Cohort Leader' row? Like the one we
have on the leveled, not enrolled prototype"*. `ENROL_COURSE.E4`'s own note had asked for
this decision by name — *"if E4 should name a leader, that is a second `COHORT_LEAD`-shaped
record and Maryam's call"* — so this is that call, and the refusal is **answered rather
than overridden**.

- **§69's RULING WAS NEVER "E4 HAS NO LEADER", IT WAS "PRIYA IS NOT AN E4 LEADER."**
  `COHORT_LEAD.range` is E1–E3 and `LEAD_COHORTS` puts her cohorts at E3/E1/E2. Widening
  her range would have made the leader portal wrong in two places — her own Profile prints
  that range and the Cohorts page is the roster — so E3 keeps its leader and E4 gets its
  own.
- **THE PERSON IS NOT INVENTED, WHICH WAS THE OTHER HALF OF THE REFUSAL** (*"a name is the
  product's, a person is somebody's"*). **`AGENTS.lena.range` is `E1–E4`** — the only range
  in the build that reaches this level — so Lena Fischer is who the product already says
  works at E4, and `COHORT_LEAD_E4` reads her name, initials, photograph **and range** off
  that entry rather than restating them. The precedent for one human holding both roles is
  Priya: `AGENTS.priya` **and** `COHORT_LEAD`, which that record's note states outright.
- **ONE FIELD IS AUTHORED AND IT IS THE ONE TO CHECK.** `since:'January 2025'`, later than
  Priya's 'March 2024' because E4 is the newer tier. **Nothing reads it today** — it is
  there for the shape. There is deliberately no `expertise`: `COHORT_LEAD`'s exists for
  §71's call row, and there is no E4 call row for one to appear in.
- A thunk, like E3's, because `COHORT_LEAD_E4` is declared below `ENROL_COURSE`.

### TAL'S CHAT IS THE ONBOARDING'S CHAT — §115 + §63 §49, 4 Sep 2026

Maryam: *"I want our current tal experience on dashboard to be like the one we have created
on the tal onboarding. I am talking about the chat ui, copy the font, the message styling,
the welcome message also should have the look of the one we are using on onboarding."*

**TWO SURFACES DREW ONE CONVERSATION IN TWO LANGUAGES.** `.ask-page` is the product's Tal —
the dock at the foot of every page opens it — and §107's `.ob-*` is the onboarding's, built
four days later against newer references. They disagreed about four things: the face the
greeting is set in, whether Tal's turn has a box round it, whether either speaker is
labelled by name, and what the reader's own turn is filled with.

| | was | is (§107's) |
|---|---|---|
| the greeting | Abhaya Libre 34/40, second line in a black→accent ramp | the platform sans at `--t-h1-size-lg`, one flat ink |
| the orb | 120px, `--s07` under it | 104px, `--s06` |
| the helper | 14px capped at **246px** | `--t-sec-size`/26 capped at 720 |
| Tal's turn | name row above a white bubble with §39's gradient border | a 28px mark beside prose, no box, no name |
| the reader's | "You" + a 36px face above a pale wash on white | a right-aligned `--gray-100` bubble, `16px 16px 4px 16px` |
| between turns | `--s05` | `--s06` |

- **IT RESTYLES `.tal-msg` / `.bb` RATHER THAN EMITTING `.ob-m`, AND THAT IS THE ONE
  DECISION WORTH ARGUING WITH.** Reusing §107's classes is what "reuse means reuse" asks
  for and the classes really are unscoped (checked — §108's `.eo-lede` precedent). It was
  the first build and it **strands the answers**: §35 §2 caps the bubble by what it HOLDS
  (`:has(.bkw)`, `:has(.tw)`, `:has(.gen)`) and §53 §14 flattens every page component
  borrowed into a reply — eleven rules, all keyed on `.bb`, none with an `.ob-m-t` twin.
  §39 is the counter-example and the reason this was close: **that layer already writes
  `:is(.tal-msg > .bb, .ob-m-t)` on twenty-eight selectors.** Give §35 and §53 the same
  treatment and the markup swap becomes right.
- **THE `max-width` MISTAKE IS THE ONE TO LEARN FROM.** §115 first put `max-width:none` on
  the base rule to un-say §27.302's `min(55%,620px)` — and that rule is (0,6,0) while §35's
  caps are `:has()` rules at (0,5,0), **so it beat every one of them and a reply holding a
  widget ran the full width of the thread** (measured 797px against a stated 620). Trap 15's
  failure reached from the other side: a later layer being heavier rather than a bubble being
  too narrow. The measure is keyed on `:not(:has(.tw,.bkw,.gen,.bk-list))` now — the exact
  inverse of §35's four selectors, so the two can never both match.
- **THE TYPE IS §63 §49 AND THE FACE IS §53 §13.** No type in §115 (the house rule), and the
  `font-family` reversal sits *inside* §53 §13 beside the argument it reverses, because
  `font-family` is not one of §63's four properties. **§53's `@font-face` and
  `--tal-greet-face` are deleted with the rule** — a face with no rule naming the family is
  the "gate nothing writes" tell, and that token had exactly one reader.
  **`build.py`'s `__ABHAYA__` block is now inert and deliberately left**: the token appears
  in no layer, so `css.replace` is a no-op and the 12.6 KB never reaches the output. Three
  lines to delete when that file is free.
- **UN-CLIPPING TEXT NEEDS `-webkit-text-fill-color` AS WELL AS `background-image`.** §51.199
  sets both it *and* `color` to transparent, belt-and-braces, because `background-clip:text`
  needs one and browsers disagree which. Reset only the gradient and the greeting renders as
  **blank space**.
- **THE TYPING TURN CENTRES ON THE MARK**, keyed `:has(> .ai-stream)` — there is no
  `.ob-m-typing` equivalent and the markup already states the state by what it contains.
  §107's own note is the argument, including why the fix goes on the cell and not the row.
- **`.tal-panel`'s COPIES ARE STILL IN THE DOM AND STILL UNSTYLED**, which reads as a bug in
  a measurement sweep and is not one: §27.9 sets that panel `display:none` and §115 is scoped
  `.ask-page`. A query for `.tal-msg` finds two of everything; only one renders.

### ONE HAIRLINE, ONE VALUE — `--rule` IS `#e9e9e9`, AND THE MARGIN IS `#fbfbfb`

Maryam, 3 Sep 2026, as a design-system change: *"I need to change the color of margins of
the page which is f7f7f7 right now, i want those to be fbfbfb. And for the strokes/border
that we are using right now everywhere needs to be of E9E9E9 color now."* Two token edits
in the layers, both builds re-run, and **all three portals follow** — the agent portal gets
its half by re-running `build-ds.py`.

**THE STROKE WAS THREE TOKENS PRETENDING TO BE ONE, AND THAT IS THE PART THAT WOULD HAVE
HALF-LANDED.** `--rule` (#d7d5cd, §10, 253 readers) is "the hairline, one weight, used
everywhere" — and `--border-subtle-01` (#dcdad3, §01, 48 readers) was the same line under
an older name, and `--rule-on-2` (#ede9e2, §12) was #d7d5cd re-tuned for the #f7f7f7 panel.
One step apart, indistinguishable in place, and enough that changing "the hairline" meant
finding three values. Both now **read** `var(--rule)` rather than restating a hex, so there
is one hairline and the next adjustment is one line.

- **AND THE CONTROL-EDGE CARVE-OUT WAS REVERSED ON 4 Sep 2026** (Maryam: *"the line of each
  field should be the color we are using on the borders of the platform means very light"*,
  plus *"on click to a field the field line color should changed to the accent color
  FF3733"*). §12's `.inp` baseline is `--rule` now and its focus state is #FF3733 at 2px;
  §37's bordered `textarea.inp` follows. **The bullet below is still the right argument and
  is kept for that reason** — what answers it is not the resting line but the focus one: a
  field you cannot see at rest is findable the moment the caret is in it, and it is now the
  loudest hairline on the page rather than a 2px black rule. `--border-subtle-02` and
  `--border-strong-01` still hold their values for checkbox and radio boxes, which have no
  focus line of their own.
- **THE TWO CONTROL-EDGE TOKENS KEEP THEIR VALUES AND THAT IS THE LINE.**
  `--border-subtle-02` (#c7c6c3) and `--border-strong-01` (#8e8d8a) are not separators,
  they are the edge of an **input, select, checkbox or radio box**. A separator is
  decoration and is free to be as faint as it was asked to be (#e9e9e9 is 1.13:1 on white
  against #d7d5cd's 1.42:1); a control's boundary has to be findable. An input edged
  #e9e9e9 is a field you cannot see.
- **IT IS NEUTRAL, WHICH IS THE HALF THAT IS NOT JUST A LIGHTENING.** §01 casts the whole
  grey ramp warm at b* +2.0 because "pure-neutral greys read blue on bone". That decision
  still stands for INK and for GROUNDS; the rule is what has come off it.
- **TWO NAMESPACED HAIRLINES ARE DELIBERATELY UNCHANGED, both on a non-white ground**:
  `--askv-rule` (§51, the ask screen's ivory — its note is explicitly "on ivory the cool one
  reads as a grey line drawn on a cream page") and `--auth-card-line` (#f0f0f0, the sign-up
  card). Also unchanged: `--layer-accent-01` (a progress-bar TRACK fill, not a stroke) and
  `--surround` (the ground behind the device — prototype chrome, not the product).
- **FOUR HAIRLINES WERE WRITTEN AS THE LITERAL `#d7d5cc` AND WOULD HAVE MISSED THIS.** Three
  in §70 (`.head-col`'s stacked top and desktop left, `.sec-qa`'s top) and one in §71
  (`.sec-call` in the band). **§39 had already written the argument** — "`#d7d5cc` IS
  `--rule`… the token is used rather than the literal so this hairline keeps moving with
  every other hairline in the product" — and those two layers wrote the literal anyway.
  Nothing showed it while the two values were a digit apart in the last place. All four read
  the token now; the tell would have been the head band's column divider not matching the
  section rule 40px under it.

**THE MARGIN IS `--surface-3`, NOT A FOURTH VALUE.** §18 ("THE MARGINS ARE THE SECOND TONE")
gives `.view-col > .main` a tone above 900 and puts `.page` back to white on top, so the
column reads as a sheet lying on a surface — that argument is unchanged and still the
reason the rule exists. What changed is **which** tone. At `--surface-2` the margin was the
same value as `.sec.tint`, and a tinted section bleeds past the rails by §10.2 — so the two
met edge to edge and became one field of grey with the rails suspended in the middle of it.
`--surface-3` (#fbfbfb) already existed for exactly this reading ("still a tone rather than
a colour… it recedes instead of arriving") and had one reader, `.sec.tint.tint-2`.

- **SO THE PANEL AND THE MARGIN ARE NOW TWO VALUES AND MUST STAY TWO.** `--surface-2` is
  the ground of a block you are meant to ACT ON; `--surface-3` is the ground of the room it
  sits in. Setting them to one value is what this edit undid — do not "simplify" them back.
- **THE TINTED SECTIONS ARE STILL #f7f7f7.** The ask named the margins and this changed the
  margins. `--surface-2` / `--layer-02` are untouched.

### THE SELECTED MODULE IS ORANGE ALL THE WAY ACROSS — §63 §41

Maryam, 3 Sep 2026, with a screenshot of the rail's Dashboard row: *"the selected module
text should also bi orange"*, then — after it shipped in the AA-safe ink — *"by orange i
meant the color using in the icon, the text should be in the same color"*. So
`.app .sn-item.on{color:var(--accent)}`, the glyph's own #f57414.

- **§34.2's NOTE ARGUED THE OPPOSITE AND IS TURNED OVER IN PLACE**, both clauses. It said
  "THE LABEL DOES NOT… the icon is a mark and can take a brand colour; the word is text and
  keeps the text colour", on §01's fill/ink split (#f57414 is "fills only, never text").
- **THE SECOND MESSAGE IS THE ONE THAT DECIDES THE VALUE, and it is not about legibility.**
  The word and the mark are read as ONE OBJECT: at 13.5px beside a 22px glyph, `--accent-text`
  (#b94a09) does not read as a safer orange, it reads as a label that failed to match its own
  icon. A rust word next to a bright mark is worse than either value alone.
- **2.94:1 IS A STATED EXCEPTION, WRITTEN DOWN WITH ITS RATIO** — this build's form for
  exactly this (§01's gradient carries `--on-brand-fill` so the sweep reports it as a
  decision; §70's three step states are "Maryam's call over this build's AA rule" at 2.8 and
  3.1). Two things narrow it: the label is never the only carrier (the 3px marker, the 600
  weight and the glyph all say the same thing, and at the collapsed 72px rail the word is not
  drawn), and it is ONE row per screen — the one you are already on.
- **THE RULE IS IN §63, NOT §34, and that is the house rule not an aesthetic choice.** §34
  may fill an SVG; it may not set a text colour. §63 lands last.
- **IT NEEDS (0,3,0) AS BELT-AND-BRACES.** Nothing outranks it today — §01.532's
  `.sn-item.on` sets `background` and `font-weight` only, and the inherited colour is
  §01.525's `.sn-item` at (0,1,0) — but `.sn-item.on` has already been restated by five
  layers (§01, §10 ×2, §14, §34), so a sixth at (0,2,0) landing after §63 is precisely §7b's
  trap. `.app` in front makes it a weight question rather than an order question.
- **TO REVERSE IT, `--accent-text` IS THE VALUE AND §63 §41 IS THE ONLY LINE.** Do not
  reverse it by re-pointing `--accent` — the marker, the glyph and 60-odd fills read that
  token.

### A BUTTON IS TITLE CASE — §63 §4b, ONE DECLARATION, ALL THREE PORTALS

Maryam, 3 Sep 2026: *"make sure that in buttons on all three portals each word initial
should be in uppercase."* `text-transform:capitalize` on `.app .btn,.app .tw-btn` plus
`.nil .nil-btn,.nil .nil-cta`, stated in §63 §4 beside the no-uppercase block.

- **IT IS THE LAYER, NOT 183 EDITED STRINGS, AND THAT IS §2's OWN CALL IN THE OTHER
  DIRECTION.** Case is one of the four properties §63 owns; 66 uppercase rules were pulled
  out of 18 layers precisely because case decided per component drifts. A sweep of the
  sources finds **183 distinct button bodies** across `views.js`, six `ai*.js`, four
  `lead*.js`, `ob.js`, `nil.js` and `tn-agent-portal.html` — and about a fifth are
  **interpolations** (`${act.label}`, `${chip}`, `${IVT[other].label}`, a chapter title, an
  agent's first name) that no edit to a literal can reach.
- **IT REVERSES §63 §2's "THE WORDS GO IN THE MARKUP", FOR CONTROLS ONLY.** §2 is about
  UPPERCASE — a decorative treatment on whole strings, where a heading is written the way
  it is read. A button's label is a NAME for an action. Nothing else moved: headings,
  eyebrows, descriptions and tags are all still sentence case.
- **IT IS EVERY WORD, INCLUDING THE SMALL ONES, WHICH IS THE ASK READ LITERALLY.** "Read
  The Full Report", not the publishers' "Read the Full Report". A style that lowers
  articles is `capitalize` plus a per-word exception list, which CSS cannot express — **so
  wanting the publishers' form is the thing that turns this into a markup change.**
- **THE FIVE FAMILIES ARE THE ONES THAT ARE BUTTONS.** Deliberately NOT included, though
  §63 §3 sizes them in the same tier: `.slot` (a time), `.day .n` (a date), `.tabs button`
  / `.cs button` (a tab strip), `.acc-h` (a disclosure heading), `.sn-item` (a rail label).
  Title case on a nav label is a different decision nobody asked for.
- **`.cert-btn` IS ABSENT ON PURPOSE — nothing writes that class any more.** §15, §37 and
  §64 all still state rules against it, which is the "gate nothing writes" tell; a sixth
  dead rule would only make it harder to find. Flagged, not fixed.
- **THE ONE HYPHENATED LABEL IS `IVT.re.label` AND IT RENDERS "Re-Interview".** A hyphen is
  a word boundary to the engine. Found on the page rather than predicted — the first draft
  of §4b's note claimed no such label existed. It is the only one in either portal, it is
  what Chicago does to a hyphenated compound, and it reads correctly at 110px.
- **THE THIRD PORTAL GETS IT FROM THE BOX**, which is the whole argument for the layer:
  `build-ds.py` keeps §63 and `tn-agent-portal.html`'s 43 buttons are `.btn`. `nil*` is
  excluded from the design system, which is why the microsite's two selectors are written
  apart from the `.app` one.
- **Verified:** `respcheck` full and `--edge` (237 screens × 7 widths) clean on both
  portals, and the agent portal swept separately — 48 screens × 3 frames, 187 buttons,
  **zero wrapped labels and zero overflow**, max button height 48. Capitals are wider than
  lowercase, so a wrapped label is the real risk of this change and it is the thing to
  re-check after it.

### LOGGING IN ASKS WHICH OF THREE — `LOGIN_ROLES`, §104

Maryam, 3 Sep 2026: *"allow three selection, add one more 'As Talent Agent', change the
other two as well to 'As Candidate' and 'As Cohort Leader'."*

- **THE THIRD ROLE LEAVES THE DOCUMENT, WHICH IS THE DISTINCTION `PORTALS` IS BUILT ON.**
  That array's own note refuses the Talent Agent a row because it is "a different
  DOCUMENT"; `LOGIN_ROLES` is a different list for a different question — three answers to
  "who is signing in" against two values `S.portal` can hold. The handler branches on
  `agent` and does `location.href = AGENT_PORTAL`, `data-doc`'s gesture reached from the
  auth screen. **`AGENT_PORTAL` now has two readers** and is still the only string either
  writes into that position.
- **THE EARLY RETURN IS LOAD-BEARING, NOT TIDY.** `setStage('new')` writes `S.stage`,
  `S.portal` and the hash; running it on a document one statement from being replaced
  leaves the candidate portal remembering a login that went elsewhere — press Back and you
  land on `#new/dashboard` having never chosen it.
- **THEY STACK NOW, AND THE ARITHMETIC IS WHY.** §104 was `repeat(auto-fit,minmax(200px,
  1fr))` — two across in the form column, stacked on the phone, no breakpoint. Measured:
  the widest label is 106px, the block's chrome is 64, so a one-line block is **170px** and
  three across needs **534**. `.role-pick` is **475** at a 1280 frame and ~524 at `.page`'s
  608px cap, so three across fits at **no width this product is read at**. A smaller floor
  is worse, not better: at 475 it wraps **2 + 1** and orphans the third block in a
  half-width row. `grid-template-columns:1fr`.
- **THE STACK COSTS 60px AND MATCHES THE FORM UNDER IT.** Three 48px rows + two 12px gaps
  is 168 against the pair's 108 — and at tablet `.role-pick` and the email field are both
  710px, so a full-width role row is the same shape as the field below it.
- **THE VERB CAME OFF ALL THREE.** "Login as Candidate" restated the only button on the
  screen 200px below it, and three blocks all opening "Login as" read as a list of the same
  thing rather than a choice between three.

### EVERY PHOTOGRAPH OF A PERSON IS A DISC — §106, `106-roundfaces.css`

Maryam, 2 Sep 2026: *"everywhere on the candidate, cohort leader, and talent agent portal we
have an image I need it to be a circle image not a block image."* **One `border-radius`, stated
at the component**, and it is the platform decision §89.2 wrote down and declined to make
("rounding all of them is a platform decision rather than this page's").

- **IT REPLACES FIVE SCOPED COPIES OF THE SAME VALUE AND ALL FIVE ARE DELETED.** §89.2 rounded
  the cohort page's three lists, §89.5 the leader's three wrappers, §103 the message thread's
  faces, §105 the profile picture and §70.3e the cohort leader's portrait — five layers, five
  selectors, one shape, and the product still drew a **square** face in the app bar, on every
  dashboard, on the black recommendation card, on the call row, in the interviews list and down
  the leader's rosters. That is what a restatement costs. `.idphoto-round` went with §105's rule:
  a class nothing styles is the same dead weight as a rule nothing writes.
- **THE LIST IS §09's THREE PLUS SIX PORTRAITS THAT ARE NOT THEM.** `.av-ph` / `.av` / `.mem-av`
  carry everything `avatar()` draws; `.shell-avatar`, `.acct-i-av`, `.rec-ph`, `.pnc-ph`,
  `.crow-ph` and `.idphoto` / `.photopick` were each hand-built as their own span. Swept over
  219 screens both portals: **41 person photographs round, 15 artwork boxes still square.**
- **ARTWORK IS NOT A FACE, and the four families that stay square are named in the layer**: the
  wordmark, the eight award WebPs, `.crt-art`, and §86's cohort covers — where a circle is
  exactly the crop the 1 Sep instruction ruled out ("so the image do not cut from sides"), since
  the half that carries the meaning is the line of type across the middle. `.crow-ph` is the one
  element on both lists, so `:not(.crow-cover)` is the one exclusion written as a selector — it
  reads the RECORD's decision (`crow`'s `cover:true`), not the portal's.
- **TWO RULES HAD TO BE ANSWERED AT SOURCE RATHER THAN OUT-WEIGHED.** §11.194/195's
  `border-radius:0` on `.idphoto` is deleted, and §27's `.ask-thread .tal-msg.me .av` is (0,4,0)
  — heavier than anything the component can state — **and its box was 35×37**, so a `999px` on it
  would have drawn an ellipse. Squared to 36 in §27. A non-square box is the one thing that makes
  this change read as a bug rather than as a shape; check for it before adding a portrait.
- **`.ph-rank`'s CORNER MEDAL IS NOT A PROBLEM AND IT IS WORTH KNOWING WHY**: §62's face row is
  clipped to 1px on every dashboard since §78 took the page heading out, so nothing in the
  product draws that pairing today. Left alone rather than re-placed blind. §106.3 *does* move
  the photo picker's `.on` tick — a 14px mark at `right:4px;bottom:4px` sits outside a disc,
  whose own edge on that diagonal is ~12px in — to bottom centre.
- **THE THIRD PORTAL GETS IT FROM THE BOX.** `tn-agent-portal.html` is hand-written on
  `design-system/` and draws `.av-ph`, `.av` and `.mem-av mem-ph`, so re-running `build-ds.py` is
  the whole of its half of the ask. §106 is in **both** layer lists; without the `build-ds.py`
  entry the design system would go *backwards*, since §89/§103/§105's own copies are gone.

### The head band is TWO COLUMNS — §56, `56-headband.css`

Figma 486:1084. The left column reads: the `<h1>`, the `&middot;` fact row under it, a
hairline, **the wing** — the status block, which is the journey row on the way in — a second
hairline, then what Tal says. The right column is the page's one dark card — `placeDark` still
moves it into the band, §56 gives it column two, and it stretches to the left column's height
with its content packed to the top and its actions on an `auto` margin at the foot.

Seven things worth knowing before touching it:

- **A PLATE'S BUTTON IS ONE OR TWO SHORT WORDS.** The card is
  `minmax(300px,330px)` with 32px of padding, so a two-button row divides about
  250px — and §56 sets `white-space:normal` on those buttons deliberately, as a
  safety valve rather than a licence: a label that does not fit wraps to two
  lines instead of overflowing. "Join the interview" beside "All sessions" made
  **both** of them two lines tall (147 + 95 in a 250 row), which is a 38px row of
  broken phrases where the card wants one 32px row of actions. The card has
  already said what the appointment is — its title, the person and the time are
  three rows above — so the button only says what you DO: `Join`. Six labels were
  cut across both portals on 28 Aug 2026; the check is that no `.plate-a > .btn`
  measures taller than 34px on any of the 200 screens.
- **The gate is `.modhead:has(> .sec-dark .plate)` at 900 and up.** A plate is a vertical card
  and gains from the column; `.lvl-hero`, `.cert` and `.score` are wide objects (a 15-rung
  ladder, an award, a table) and keep §25.12's full-width place under the head. A SECOND dark
  card in the band spans both columns and lands under them.
- **The wing has THREE states and `wingBlock()` (views.js) picks one.** The journey row is
  only the way IN, so it stops at `assessed`; from week 1 the wing carries the course
  `progressStrip` and once promoted it carries the `ladder`. All three wear
  `.stp .stp-open .stp-titled` — §04's rhythm, §24.4's header row, §56.2's 16 under it — with
  `.wing-prog` / `.wing-lvl` as §59's hooks for the gutter (trap 10) and the ladder's track,
  and the ladder wing is the one that carries **`ladder(cur, true)`** — a level code in every
  one of the fifteen blocks (`LVL_CODES` — `lead3.js`'s `LDR_RUNGS` was an alias of it and is
  deleted with the leader's level picker),
  the track names left-aligned to E1 / B1 / T1 by a fifteen-column grid on `.ladder-lab`, and
  the level you are ON **lit rather than filled**: a repeating two-tint strip on a `::before`,
  one tile wide, translated by exactly one tile so the loop has no seam. Two bugs worth not
  repeating are written up over that rule — `<i>` is italic by default, and lifting §05's
  `.done{opacity:.55}` into a later layer silently undid §29's correction of it.
  which is an on-dark value and has to be re-pointed on a light ground. The enrolled
  dashboards no longer draw `progressStrip` as a section of their own; it MOVED.
- **The journey is always four steps** — `journey()` in views.js is the single list and only
  the four pre-course dashboards reach it. The labels are the spine, the `sec` lines are the
  stage. Five- and six-step variants are what it replaced; "Re-interview" was the fifth and
  came off because it is where the NEXT ninety days start, not where these ones end.
- **The row is left-aligned and each item is a three-row grid**, with `.stps-b` at
  `display:contents` so the state words stay on one line when one label wraps and another
  does not. Each `.stps-i` paints the rail segment to its own right; there is no rail element.
- **The mark's ground carries the state**: flat `--accent` for done, `--brand-tint-2` for the
  step you are on, `--layer-02` for what is ahead, with the subject icon at full ink on all
  three. Discs, not squares — a mark is one of the two things this system lets curve.
- **The dashboard's greeting moved to the `.ph`.** No `PAGESUM` entry carries
  `<span class="tal-greet">` any more, so §33.9's `.ph`-hiding rule matches nothing in `hifi/`
  — it still ships, and `tn-agent-portal.html` still uses it.
- **`ph()`'s fact row draws its own marks.** `phSub` splits the `&middot;` row into a `.ph-f`
  per fact, capitalises each one and puts a 15px icon in front of it (`PH_IC` / `factIcon`,
  same first-match-wins shape as `stepIcon`). A `sub` with no middot in it — the auth screens —
  is left as a plain `<p>`.

- **The wash is in the top-right corner** — Figma 494:1447, §25.1. Same two ellipses and the
  same two colours as 292:288; what moved is where they sit. The warm one used to be centred
  at 43.4% across and low, so every page opened on a cream panel with the words printed on it.
  Both are off the right-hand edge now (87.6% and 101.1%), the words are on white paper, and
  the warm layer is back at the file's own 50% because there is no panel left to knock down.

### A CELEBRATION IS ONE LINE IN THE HEADER — §62, `62-rankhead.css`

Figma 486:1084 (498:1578). The dashboard's header row is the reader: their own face at
75px with the rank medal hanging 4px off its top-right corner, the `<h1>` and the fact row
beside it, and at the far right of the same line the celebration — the award artwork at 28
and a sentence in `--link` with its last word underlined. **The green `.ach` band is gone
for all three of `ACH`'s entries**, and nothing on the dashboard is dismissible any more.
Six things:

- **One shape, three sentences.** The first pass moved only the rank, on the argument that a
  rank is a property of you while a badge and a promotion are news you dismiss. It did not
  survive: a promotion is not news you want to close either, and a blue line at the top for
  one kind with a green slab lower down for another is the product announcing in two
  registers. `S.hideAch` and the `data-hideach` handler went with the band.
- **The copy lives in `ACH.up` and must END on the thing it names** — "rank!", "badge!",
  "E4!". `achLine` splits on the last space and underlines the tail, so a fourth
  celebration needs a sentence of that shape and no code. `art` is the award artwork at 28;
  the promotion has none (a decision is not an object) and falls back to `ic`, which §62
  draws at 20 in `currentColor` so it reads as the first word of the link.
- **The two halves have different lifetimes.** `.ph-you` — the mark — is on **every**
  dashboard, and the medal on it appears wherever `GAME[stage]` does (the four enrolled and
  complete stages). `.ph-earned` appears only on the three stages `ACH` names. The row has
  to look right with the right-hand half missing, which is what it is on four of seven.
- **`.ph-rank` is a SIBLING of `.av-ph`, not a child** — §09 gives the avatar
  `overflow:hidden` so the photograph cannot escape, and it clips a corner badge too.
- **`youMark` does not call `avatar()`** — that helper writes the size inline, which is
  trap 1, and the mark steps to 56 below 900. The size is §62's on both sides.
- **The row wraps rather than crushing the title.** `.ph` is the band's LEFT column, so it
  is 507 wide at a 900 frame and 886 at 1280 while the sentence is 207 whatever the frame
  does. `flex-wrap` plus a 360px floor on `.ph-main` is what turns "shrink the `<h1>`" into
  "move the sentence to its own line"; there is no breakpoint in it.

`ph()` takes a fifth argument, `mark`, and `dashPh(title, sub)` is the six dashboards'
wrapper over it. Every other `ph()` call in either portal emits byte-identical markup.

### The black card has TWO priorities — §59, `59-priority.css` + `plateUrgent` (ai5.js)

Black ground plus §21's warm haze is the loudest object this product draws, and it is spent
on an action that is **time-sensitive**. Inside twenty-four hours a `.plate` is §15's black
card, untouched. Outside it the same card is **quiet**: `.plate-quiet` takes the ground and
the haze off, and in the head band a **vertical rule between the two columns** takes over the
job the card's black edge was doing. Same content, same buttons, same order — one priority
down. Four things to know:

- **The ink flips by re-pointing three variables**, not by restating rules. `--on-dark`,
  `--on-dark-2` and `--on-dark-border` are reassigned on `.plate-quiet`, so the eleven
  declarations §15, §21 and §56 write against them all follow — and so does anything a later
  layer writes. Do not add a `.plate-quiet` variant of a rule; write the rule against the
  token and it is correct on both states for free.
- **`plateUrgent` reads the WORDS, because the words are all there is.** Every appointment in
  the build is a hand-written string, so the test is the vocabulary of inside-the-day — now,
  today, tonight, starting, or a count of hours or minutes. It tests the countdown AND the
  eyebrow label, which is what makes "Due now" — a label, not a clock — come out urgent.
  `data-urgent="1"`/`="0"` on the card overrides it. A card with no time at all is quiet.
  Swap the one function for a date difference in a real build; the class is the contract.
- **Only `.plate`.** The other members of `DARK_CARD` are not actions: `.cert` is an award,
  `.lvl-hero` a level, `.score` a table, `.lead-b` a wall. (`.ldr-read`, the competency read,
  was a sixth and left the list with the level decision on 1 Sep 2026.) None of them
  has a deadline to be inside or outside, and a quiet certificate is a certificate with the
  ceremony taken off it. They keep their ground.
- **Below 900 the divider turns with the layout** — no second column to divide, so it is a
  hairline on the card's top edge instead.

Both halves ship in `design-system/` (`dsPlateQuiet`, and the gallery shows the pair under
**Signature**) because the decision needs only the element, not `S`. **`tn-agent-portal.html`
does not call it yet** — every plate on that page is a day or more out, so adopting it would
leave that portal with no black card at all; that is a look decision, not a bug.

### The head of a page has TWO copy slots and they do different jobs

A module page opens with an `<h1>`, a fact row under it, and Tal's summary below that. The
fact row and the summary are read as one block whether or not they were written as one, so
the split is a rule:

| Slot | Written in | Carries |
|---|---|---|
| `ph(title, sub)` — the grey line | the view | the page's **factual spine**, as a `&middot;` row. `Explorer Track – E3 · Cohort 41 · week 5 of 13`. No verb, no claim, no explanation. |
| Tal's summary — `PAGESUM` | `ai6.js` | the **reading**: what moved, what's open, what's on you. Two sentences, 18–28 words, and the only prose at the head of the page. |

**Where a page has no spine, it has no `sub`** — Profile, Payments, Points, What Tal knows,
Practice, one agent, Booking Details, My Level all pass `title` alone and let Tal's sentence
be the opening line. Inventing a sentence to fill the slot is what produced the duplication
this rule exists to stop: Profile once said "Your details, your preferences, and what Tal is
allowed to do" over a summary saying "Your details, how you want to be contacted, and what
Tal is allowed to do." Before adding either half, read the other and check they are not the
same sentence. The auth screens are the exception and stay prose — they have no Tal card.

`PAGESUM`'s own note in `ai6.js` is the long version, and it also holds the four content
bans that the last rewrite was mostly made of: **no framing** ("this is the page that"), **no
policy** ("nothing renews, no card is kept on file"), **no pointing at the UI** ("each row
downloads its receipt"), and **nothing from the other portal** — a candidate is not told they
could lead a cohort, a leader is not told what their candidates' Cohort page looks like.

House style for the two numbers that appear everywhere: the course length is **`90 days`**
numeric (and the document is the **`90-day summary`**), and a **small count is spelt when it
opens a sentence, set when it does not** — "Four decisions are waiting", "5 of 13 chapters".
`_W` / `_w` in `ai6.js` are what hold the second one for the leader's assembled summaries.

**And the summary TYPES ITSELF on arrival** — `typeSummary` (ai6.js) + `52-talsumtype.css`.
It is the one line on a page that is written rather than stored, so it is said rather than
already there. Four things about it that are not guessable:

- **The paragraph is drawn twice.** `.tsum-g` is the finished line, `visibility:hidden`,
  holding the final box open; `.tsum-t` is the visible copy laid over it, absolute. Without
  the ghost a second line arriving mid-read shoves the whole page down. Both are built from
  the same `innerHTML`, which is what makes them wrap identically.
- **`<span class="tal-greet">` does not type.** §33.9 hides the page's `.ph` when it is
  present, so the greeting *is* the dashboard's title, and no other page's `<h1>` types.
- **One run per arrival**, keyed on portal + view + stage + *the text* — so a detail page
  whose subject changed re-types, and an ordinary interaction prints instantly (a re-render
  that does not re-type leaves a plain `<p>` with no `.tsum`, which is the state every other
  layer already styles).
- **The pace is one number**, `SUM_MS` — a budget for the whole line, not a rate — so every
  summary finishes in about the same time whatever its length.
- **A page with no summary CLEARS the key.** Eight pages get none, and with the key left
  standing `dashboard → messages → dashboard` came back to an unchanged key and printed
  instantly — the one case where returning to a page did not type. `placePageSummary` is a
  two-line wrapper over `placeSummaryPass` for exactly this: the pass keeps its eight plain
  `return`s and only the success path returns `true`, so the bail path cannot be forgotten at
  one of eight sites.

**All three portals type it, and the third one is not in `hifi/`.** The candidate and the
cohort leader share `render()`, so `ai6.js` covers both. `tn-agent-portal.html` is
hand-written on `design-system/` and calls `dsTypeSummary` at the end of its own render,
keyed on the `stage/view/interview/tab` string it already builds for `data-enter`. The two
implementations are deliberately the same shape — including reading the source back off the
ghost rather than off `p.innerHTML`, which is what stops a second call nesting the pair
inside itself (the portal cannot reach that state; `gallery.html`'s replay does).

### Booking an interview happens inside Tal — `ai7.js` + `35-book.css`

Ask Tal to book an interview and the whole flow runs in the thread: shortlist → profile →
day and time → confirmation, then the stage moves to `booked`. **There is no payment step,
deliberately** — the fee is taken by Stripe on Stripe's own hosted page, so "Continue to
payment" is a handoff and the confirmation is what comes back. Do not draw a card form here.

Two state objects: `S.bk` is the flow in progress (cleared by `talReset`), `S.booking` is the
result and outlives the conversation. `bkStamp` is what makes the booked stage's six
hand-written mentions of "Priya Nair, Thursday 20 August, 6:30 PM, $95" read the actual
choice instead — if you add a seventh surface that names the booking, add it there. Traps 9
and 10 below are both about this file.

**A surface GENERATED from state needs no stamp, and the live call is the first one.** `bkStamp`
exists because those six mentions are prose typed into views; `callScreen` (ai10) builds its
title, its aside and its Scheduled row out of `bkAgent()` and `bkShort()` on every render, so
it cannot disagree with the booking in the first place. Read those two helpers rather than
adding a seventh site to the stamp.

### Joining a call is a SURFACE, not a page — `ai10.js` + `60-call.css`

Figma 499:2022 (the interview) and 499:1617 (the cohort call). Press Join and the frame becomes
the call: no app bar, no rail, no Tal. `render()`'s FIRST branch draws it in place of
`shell() + view()` — the same shape the `nil` and `signup` branches have, and `callScreen` is
`typeof`-guarded there because ai10 is the last file in the bundle. Ending the call clears
`S.call` and the page you pressed Join on comes back, because the call never changed `S.view`.

**The photograph is the screen.** Full bleed, the far side's name written in white over the
bottom-left corner, and nothing else on it. The first cut put a permanent 328px column of
session details beside the feed — meeting ID, passcode, dial-in — which is a form beside a
face; those facts are one press away now (the More control), and the default state of a call is
the person you are talking to.

- **Three kinds, two shapes.** `data-call="iv"` / `"re"` is two people: a `.call-self`
  picture-in-picture inside the feed, no column. `data-call="cohort"` is ten: the nine others
  in a column of **discs on a light ground** beside the feed, with YOU as the first tile rather
  than in a picture-in-picture. Nine 16:9 thumbnails in a 300px column are nine letterbox
  slits — that is why the column is discs. A fourth kind is one entry in `CALL` plus a
  `data-call` on a button.
- **Wired to five buttons**, all candidate-side: the booked dashboard plate, the Interviews
  module's Scheduled tile, the dashboard's weekly-call plate (which used to `data-go="cohort"`
  — a Join that opened a *page*) and the Cohort page's own plate. **The consultant call's Join
  is still dead** — the component takes it, nothing points at it — and that plate is on
  `consult`, which is in `STAGES_HIDDEN` and resolves forward, so it is not drawn today.
  **THE LEADER HAS NONE LEFT.** Four went with the interviews on 1 Sep 2026 and this file
  recorded a fifth surviving on `V.leadCohort`'s weekly-call plate; swept 3 Sep 2026 across all
  eleven leader views — zero Joins and zero `.plate`s on that page, which draws a `crow` with
  `join:false`. **AND EVERY JOIN THAT IS DRAWN IS NOW GATED BY THE CLOCK** (see "A JOIN IS SHUT
  UNTIL THE CALL OPENS"), so the number of live doors into this screen is one: the booked
  interview, at "in 1 minute".
- **Every control on the bar does something, and that is what decided the list.** Mic, camera,
  share, hand and captions are states of the call and are drawn everywhere they show — your
  tile's marks, your picture-in-picture, the feed's banner. People and More decide what the one
  right-hand column holds (`S.call.panel`, so they cannot both be open). Leave ends it. The
  Google Meet bar Maryam attached also has a device-picker chevron and a reactions button;
  neither has anything to open here, and a dead control on a live surface is worse than a
  missing one.
- **The bar is LIGHT and square**, against the dark floating discs of the reference:
  `--layer-02` available, **black** for something you switched OFF, `--brand-tint-2` for
  something you switched ON, the error tint on the way out. Same tint as the speaking
  participant's tile, so "on" is one colour on this surface however it is drawn.
- **Six icons were added to `icons.js`** — `micOff`, `videoOff`, `screenShare`, `raiseHand`,
  `captions`, `callEnd` — all pasted from the official set, per trap 7 (Material Symbols
  Rounded at FILL 0 since 31 Aug 2026; they were the filled cut when this was written).
  `overflow` already IS `more_vert`, so More reuses it. The two "off" marks read BETTER
  linear than they did filled: the slash now cuts through an open form rather than across a
  solid one.
- **Three photographs are embedded** (`CALL_ART` in build.py): a 735x412 landscape still for
  the feed and two 240px faces. `AV`'s squares are cut for a 36px disc and the first cut
  stretched one across a 1200px feed — a 6x upscale, which read as a very bad connection. The
  two faces are keyed by member name in `CALL_FACE` and are deliberately NOT merged into `AV`,
  which nine other pages read.
- **The cohort call is NOT recorded.** The Data use notice on `V.account` says weekly cohort
  calls are not; the older wireframe had a REC pill and "kept 90 days" on that screen, and the
  notice won. 499:1617 draws no chip either. The interview has both.
- **It does not move the stage.** No levelling, no report, no 48 hours skipped; the stage picker
  still walks the journey. The last caption says the recording is with your agent.
- **It is not in the hash.** Everything else about the screen is (`#<stage>/<view>`), because a
  screen is a thing you send somebody. A call is a moment with a clock in it, and reloading into
  one would restart the clock on an interview that had finished.
- **One number drives the clock, the caption and the ring** — `CALL_MS`, a budget for the whole
  session, so a 45-minute interview and a 60-minute call take the same 42 seconds to watch.
  `setInterval` + `Date.now()`, per trap 17. The tick writes two text nodes and moves one class;
  it never re-renders, because a repaint twice a second restarts every entrance animation.
- **Every toggle is STATE** (`S.call.mic` …) and every button a pure function of it — trap 9. A
  class on a button would be gone at the next paint.


### The quiz breakdown is its own page — `V.result` + `61-quizrose.css`

"See full breakdown", under the four Quiz results figures, went to `level` — the page about the
**ladder**, which holds none of the quiz. It now opens `result`, the slot `PARENT` had reserved
and never filled. Everything on it is the quiz's own working and nothing else has any of it:
five bands as a rose (`quizRose`), the same five as `.kv` rows with a fill-matched swatch, three
things the answers did well and three they did badly, and the two weakest bands against the
chapters built on them.

What it refuses to restate, and each refusal is written up over the view: the four figures
(that is the block whose button brought you here), the title as a `.lvl-hero` (that is My Level,
one click away) and "a quiz cannot set your level" (that is My Level's note, and the caption
under the rose already says what the interview does with these numbers).

- **`SCORES` is the only place the five numbers live.** `qzLow` derives the two weakest for the
  page's closing section AND for `PAGESUM.result`, so Tal's sentence cannot name a different
  pair from the chart above it.
- **The chapter numbers are looked up in `CH`, never typed.** `QZ_CH` maps a band to a chapter
  *title*; that is what makes this page say "Chapter 4" and "Chapter 12" and agree with
  `signedSummary`'s "Chapters 4 and 12 are built on exactly this".
- **The fill carries the verdict, not a hue** — solid ink from 70, a 45° hatch from 50, empty
  below. `qzBand` decides the wedge and the swatch and the word, so they cannot disagree.
- **`qzTaken()` is the quiz date, once.** All three `quizResults` call sites and this page read
  it; the parameter stays for a caller that needs another date.

### What Tal answers, and what it hands to a person — `ai8.js`

`TAL_ROUTES` (data.js) is a `[regex, fn]` list and **first match wins**; every pass
`unshift`s, so the file parsed LAST is tried FIRST. `ai8.js` is last, adds no view and no
capability, and does three things: it states the narrow routes that have to land in front of
data.js's broad ones, it wraps `talReply`, and it pushes a catch-all route so no question
reaches a placeholder.

**Tal's scope is six subjects**: the course, your level, your interviews, your cohort, the
money, and Tal itself. Anything else gets one of three answers, and the difference between
them is the point — "I cannot help" is three sentences, not one:

| Kind | Answer | Support details? |
|---|---|---|
| A human decision — refund, disputed charge, closed account, a date that must move | Tal states the *rule*, then hands over | yes, `wSupport` |
| Something Tal cannot see — the billing ledger, the Priya thread, a cohort call | Tal declines in the product's own words and points at the page that *is* allowed to hold it | sometimes |
| Not the product — a salary, a job, an opinion, the assessment answers | one honest sentence and the way back | **no** — a helpdesk number for "tell me a joke" is the same failure as inventing an answer |

**The rule that will bite you: Tal never reads the ledger.** `NEVER` (ai2.js) and clause 4 of
the Data use notice both say Tal has never seen billing. So "What have I paid so far?" is
answered by `wLedger`, which *declines* and links Payments — where every row already carries a
Receipt button. Producing a table there would make two other screens into lies. `TALCTX.billing`
used to offer that question as a chip; the chips were changed with the routes, because a chip is
a promise the product makes on Tal's behalf.

Every figure in these answers is read off a page — the fee and credit from `V.enrol` / `V.payment`,
the two refund windows from the legal lines on `V.booking` / `V.payment`, prices and ratings from
`AGENTS`, chapters from `CH` / `SCORE` / `GROWTH` / `OPEN_DATES`. **Do not restate a number here
that a page owns**; read it, or the two drift.

`cand(re, fn, what)` wraps a candidate-only route so the cohort leader gets `leadNA` instead —
the router is shared and a leader has no fee, no level and no chapter of their own.

`SUPPORT` holds the contact details, once.

**The widgets are drawn by `39-talwidget.css`, and the rule is one frame.** `.tw` used to
carry its own background and border — right when these were read in the side panel, wrong on
the ask page, where §27.8 already gives the bubble a frame and 17px of padding. Two frames
around one thing, 31px of gutter. §39 takes the inner frame off and puts the spacing back
(every gap one step up), fixes the action row (`.tw-a` had `margin-left:auto` and no gap, so
two buttons touched), and gives the quiet action `--accent-on-2` — the accent ink §16 already
uses on Tal's own surfaces. Links here are **not** an option: they are blue by §12's explicit
decision, and blue inside Tal's answer would be the only blue on the screen.

**Tal has THREE marks, and knowing which is which saves an hour.** They are different
implementations, not sizes of one thing:

| Where | What it is | Keyframes |
|---|---|---|
| `33-talsum.css` §6 — the head band, 32px | a CSS-only **sphere**: gradient body, inlined SVG chevron, specular highlight, breathing glow, a conic band of light turning across it | `tal-sphere-glow` / `-spin` |
| `40-talorb.css` — the chat empty state, 132px | the **same sphere**, ported up | `tal-sphere-glow-lg` / reuses `-spin` |
| `27-tal.css` §8 and `21-ask.css` §4 — the floating button and the ask line | the `tal-circle.png` blob (`--tal-mark`) plus a halo | `tal-orb-*` |

**The sphere's backgrounds scale themselves; its shadows do not.** All four background layers are
proportional (`60% 60%` chevron, percentage-positioned radials, a `155deg` linear), so they copy
across untouched. `box-shadow` blur and spread are pixel lengths — §40 multiplies them by
`132/32 = 4.125`, and that is also why `tal-sphere-glow` cannot be reused: it *animates* those
same 32px shadows, so borrowing it snaps the glow to a hairline on the first frame. `-spin` is a
bare rotation and is shared.

**§27.4's `-6px` bottom margin is measured, not chosen, and the sphere inverts it.** That number
assumes the PNG's soft tail — "the orange is down to about a fifth of its peak 22px above the
bottom of the 132 box". A sphere is a hard-edged disc filling the box, so the 22px term is zero
and the same arithmetic gives **+16px**. §40 restates it. Read the note over that rule before
changing any mark's size or file.

**Reduced motion needs its own block.** §13.187 clamps every duration to 1ms, and 1ms on an
*infinite* animation is a strobe, not "off". §21.4, §27.8, §33.6 and §40 each state their own.

`.tal-fab` and `.tal-panel` are **`display:none`** (§27, end) — the thread moved to the ask dock.
`.orb` on `.tal-mk` is what opts the empty state into the sphere.

**Pre-existing, unfixed:** `.tal-hero::before` (§27.4) is the lattice behind the mark, at a fixed
`width:432px` with `translateX(-50%)`, so it scrolls the thread horizontally by 37px at 360 and
22px at 390. Measured with and without the sphere — it is the lattice, not the mark.

Three shapes to reuse rather than reinvent: **`.tw-lines`** is a 58px label column, and it
earns that on a *figure* (`$690`, `88%`, `Day 34`) — never on a one-character label, which
leaves 50px of white and wraps the value into what is left. **`.tw-list`** is the bulleted row
for a sentence, and a `<b>` lead-in with a `<br>` is how a row gets a title. **`.tw-lede`** is
the one-line answer at the head of a widget — a one-item `.tw-list` reads as a list that lost
the rest of itself.

## The Cohort Leader portal, dated

**A COHORT LEADER TAKES COHORT CALLS AND DOES NOT INTERVIEW ANYBODY** — Maryam, 1 Sep 2026:
"a cohort leader will only be taking cohort calls, not interviewing the initial candidates, so
please change this flow overall in the cohort leader portal." This is the largest correction
this side has taken and it removed a whole module's worth of work, so read it before adding
anything that assesses a candidate here.

The initial level interview is the **talent agent's**, and the candidate portal has always
drawn it that way: Priya interviews, Priya signs the report, and the candidate enrols on the
strength of it (`signedSummary`, §74; `PAGESUM.assessed` dates it; §73 is about the page it
unlocks). A leader signing a level as well was one act performed twice by two people, and the
leader's half had no evidence under it — lead2.js tells them in as many words that "the full
recording is never shared with you". What the leader keeps is the signature that is genuinely
theirs: the **90-day summary**, which closes thirteen weeks they were in the room for.

- **`LEAD_SESSIONS` and `LEAD_EVALS` are gone, and the diary is DERIVED from `LEAD_COHORTS`.**
  `lcall(c)` is a view of a cohort — day, hour, week, seats, level, and the chapter off `CH` —
  so the three appointments cannot drift from the record the Cohorts page and the roster read.
  `LEAD_RUN` is the calls already run and states **attendance and nothing else**, because that
  is the only fact about a finished call no other record knows. Cohort 47 is in week 1 and has
  no rows in it, which is the empty half of the Calls list.
- **`Sessions` is `Calls`** (`V.leadCalls`, lead3.js) — one rail slot renamed and repointed:
  this week's three calls with their briefs, and "Already run" with the week, the chapter and
  who turned up. **`V.leadCohorts` gave its own "This week's calls" section UP to it** with a
  route at the foot, because two pages drawing one list is the "route to the same content" this
  portal keeps deleting.
- **`Evaluations` is the 90-day summary alone.** The level-decision queue, `V.leadEval` (Tal's
  competency read, the transcript quotes, the fifteen-rung picker, the override box), `LDR_AN`,
  `ldrConf`, `ldrEvOf`, `ldrEvFor`, `LDR_RUNGS` and `ldrRungView` are **deleted, not hidden** —
  and so are the rules that only they wrote: `.ldr-rungs`, `.ldr-read*`, `.ldr-pos`/`.ldr-neg`,
  `.ldr-prose`, `.tq-x + .tq-x`, §36's leader-scoped `.ivt-lines` trio, `.ldr-read`'s two §63
  rules and its §21.22 pair, plus its entries in ai5's `DARK_CARD` and (already absent) ai4's
  `GLOW_ON`. Every deletion note keeps the ARGUMENT and drops the selector; §36's chip note and
  ai4's haze-over-content note are the two worth reading before the next dark table.
- **The dashboard's black card is the next cohort call**, and `crow` plus §71.405 were already
  built for it — both files name "the leader's weekly-call card" as the first row whose mark is
  a LABEL rather than a face. It carries `i:'41'` and no `img` (an undefined `src` 404s on every
  render, which `respcheck` reads as a broken screen), §77.7 gives the square `--on-dark-fill`
  so a label does not read as a failed photograph, and §63 §17 sizes it at h2.
  **THE MARK IS A COVER NOW AND THE LABEL IS ITS FALLBACK** — see the cover section below;
  §77.7's ground and §63 §17's numeral both stay, because `crow`'s `onerror` is exactly when
  they render.
  **ITS ACTION IS THE CALLER'S: "View all calls" on the dashboard, "Generate the brief" on the
  Calls page** (Maryam, 1 Sep 2026). Both are a change from "All sessions", which was a way out
  of a set of one, and both DO something — the first is `data-go="leadCalls"`, the second
  `data-ldrbrief`, a sheet rather than a route. On the Calls page "View all calls" would be a
  link to the page you are on, which is why the secondary is per-caller again.
  **AND IT SITS IN THE CORNER — §77.6 PUT ITS BOX THERE AND §77.8 PUT THE WORDS THERE.**
  Measured at 1280, `.crow-a`'s right edge was already exactly on `.crow`'s and its bottom on the
  row's, both 32px inside the card, which is `.dark-card`'s own `--s07` frame and not slack. What
  was not aligned was the part you can see: §71.441 gives `.crow-a > .btn` a stated `width:185px`
  from a Figma row that ends in a PAIR of equal buttons, and the label is centred in it, so one
  borderless button stopped ~26px short of the corner. §77.8 lets the SINGLE action size to its
  content and give up its right padding — scoped to `crow`'s own `.crow-a1` flag so the
  two-button rows keep the pair, and to ≥900 per trap 3 because §71.617 gives the button
  `width:100%` in the stacked tier and that is right.
- **What did NOT change.** The re-interview is still in the product and still the agent's, so
  `V.leadSum`'s "published to whichever agent runs their re-interview" is now more accurate
  rather than less. `LDR_RECS` and its required-reason box are untouched, and they are now the
  only place on the portal that makes the argument the override box used to make with them.

#### A ROW'S ARROW GETS A LABEL — §112, `.row-cta`

Maryam, 2 Sep 2026, twice in a minute: *"instead of arrows only, add text on left of the arrow
'Evaluate Candidate'"*, then *"also add text with these arrows 'View Cohort'"*. Two queues on the
leader dashboard, one class, one rule.

- **IT IS A `<span>`, NEVER A `<button>`.** `gcard` and `faceRow` both wrap the whole row in a
  `<button>`, so a control here is a nested `<button>` — invalid markup and two targets doing one
  job. The label names what pressing the ROW does; the arrow goes on saying it is pressable.
- **IT TURNS OVER "AN ARROW, NOT A VERB", WHICH `lead.js` STATES TWICE, AND THE TURNOVER IS
  NARROWER THAN IT LOOKS.** `bookedRow`'s note is the argument: the two words in that slot were
  "Join" and "Brief", which named the KIND of appointment as much as the action, and *neither
  happened on the row* — both opened another page. That is an argument against **a verb that
  lies**, not against a label. "Evaluate Candidate" and "View Cohort" are each the one thing the
  page behind the row is for, so it does not reach them. **`bookedRow` keeps its bare arrow.**
- **ONE CALLER, `faceRow`'s FIFTH ARGUMENT — AND "View Cohort" WAS REMOVED THE SAME AFTERNOON**
  (Maryam: *"remove the view cohort"*). That is `bookedRow`'s own rule arriving at the row it was
  written about: three rows in a column all ending in the same two words say only "these are the
  same kind of thing", and the section's heading row already ends in **"View All Cohorts"**, so
  the label was that control's words repeated three times underneath it. **The Awaiting
  Evaluations queue keeps its label** — one verb, on a queue whose heading row has no control of
  its own. `gcard`'s eighth argument came off with it rather than being left as an option nothing
  takes; the class, its rules and `gallery.html`'s recipe stay, which is §82's case (a component
  the box ships that the portal happens not to call from here).
- **8px FROM THE ARROW, NOT THE ROW'S 16.** §04.12 gives `.tile.clk` / `.tile.gcard`
  `gap:var(--s05)`, right between the picture, the text and a trailing control — three different
  objects. The label and the arrow are ONE object, so §112.1 pulls the arrow back by the
  difference, written as `calc(--s03 - --s05)` so it follows if either step moves.
- **OFF BELOW 600.** At 390 the pair is ~110px of a 358px row and costs the title a third of its
  measure to repeat what the arrow already says. The breakpoint is **599, not the 900** the label
  column turns at: at 744 the same row is ~700px wide and the label is what was asked for.
- **§63 §47 OWNS ITS TYPE** — `--t-body` / strong / 18px line, the same three values §4 gives
  `.app .btn`, and `--text-primary` rather than `.tile-arrow`'s `--text-disabled`: a *word* at
  that value reads as a disabled control, which on a row that navigates is a lie.

#### AN EVALUATED ROW WEARS ITS RECOMMENDATION — `.rec-tag`, §31.6

Maryam, 2 Sep 2026: *"against each evaluated user next to their name their should be a chips that
tell their recommendation … the chip color should be based on the recommendation"*, and *"instead
of the bottom cohort name, show the score of the candidate."*

- **THE HUE IS `LDR_RECS`' FOURTH FIELD** — a token name, so the five decisions are stated on the
  row that already states the label and the line, and §72's `pulseCol` idiom (`--mk` written
  inline, named per instance) draws it. **Three hues for five rows:** green for the two that move
  a candidate up, amber for a hold (a delay, not a failure), red for a move down — the only one
  that takes something away. `notready` is deliberately untoned and keeps §10's outlined chip; it
  is not a verdict on the candidate at all.
- **THEY ARE §31's THREE INKS AND NOT `.tag`'s OWN, AND THAT IS THE WHOLE REASON THE FIRST
  ATTEMPT LOOKED WRONG.** `.tag.green` / `.red` / `.warn` carry `--on-success-bg` etc., inks tuned
  to sit on §02's pale FILLS — and **§10.293 turns those fills off**, so a `.tag.warn` in this
  build is an outlined chip with a neutral `--rule` border. Three of them in a column read as
  three grey outlines with differently-coloured text. §31's attention-table flag chip is the
  shape Maryam already asked for by name ("round chips, the red item will have a light red chip
  bg"), so this reuses that formula and its tokens: a red on Evaluations is the red on the
  dashboard.
- **IT HAS TO BEAT TWO RULES**: §10.293 at (0,2,0) and **§12's `.app .sec.tint .tag` at (0,3,0)**
  — and this section IS a `.sec.tint`, so without the second half the chip would be right
  everywhere except the one list that draws it. `.app .tag.rec-tag` is (0,3,0) landing later.
- **THE CHIP GOES INSIDE THE `<h3>`, which is the product's own idiom** — `V.leadReports`' roster
  writes `${m.name} ${lflagTag(m.flag)}` into a `.cardrow-t`. No new class for the line: `.tag` is
  `inline-flex` and §63 types it wherever it lands.
- **"you recommended:" CAME OFF WITH THE COHORT NAME.** The instruction names only the cohort, but
  the chip IS the recommendation, so the words would be the same verdict twice sixteen pixels
  apart — the reason the "Published" tag was deleted from this same list on 1 Sep. The score is
  `m.avg` read off the roster through `lmemOf`, never stored on the summary.
- **THE CHIP IS SMALLER THAN A `.tag.sm` AND THE LINE READS "Scored 79%"** (Maryam, 2 Sep 2026:
  *"not assessment score, just 'Scored 78%'"*, *"reduce the font size of the chips and make them
  smaller"*). §02's `.sm` box is 24px, which is the size of a chip that stands ALONE in a row;
  this one sits inside a 19px heading beside the name, so at 24 it was taller than the line it is
  part of. **20px, and `--t-caption` (11.5) rather than §63 §4's `--t-label` (12.5)** — the next
  role that already exists, per §11's take-the-nearest-role rule, not a ninth size. `--s03` stays
  as the side padding: 4 is the next step down and at that width a 999px radius has nothing to
  curve around. **"Scored" is the page's own word** — the black card 200px above labels the same
  figure under its ring with it.
- **"View Evaluation" RIDES THE ARROW ON THE PUBLISHED ROWS ONLY** (§112's `.row-cta`, written
  into `sumRow` directly rather than through `faceRow`'s fifth argument, because this row is
  `sumRow`'s own markup). A waiting row opens the same page to WRITE the recommendation and the
  black card at the top already labels that "Evaluate Candidate" — one verb per state, and the
  two must not be on screen saying different things about the same destination.

#### A COHORT HAS A COURSE — `COURSE_NAME` / `courseOf` (views.js), `lcourse` (lead.js)

Maryam, 2 Sep 2026: *"now other than cohort name, we do have a course name as well so implement
where it needs to be shown."*

- **KEYED BY LEVEL, WHICH IS HOW THE PRODUCT ALREADY DECIDES THIS.** `cohortArt` reads
  `COHORT_ART` by level and build.py's note is the argument ("a fourth cohort at E1 gets a cover
  for free"). The cover *is* the course's title card, so the name beside it has to be keyed the
  same way or the two disagree the first time a fourth cohort appears.
- **TWO OF THE FOUR NAMES ARE READ, NOT TYPED.** E3 and E4 come off `ENROL_COURSE`, the record
  the candidate's own enrolment page prints — so the course a candidate pays for and the course
  their leader sees on the roster cannot drift. E2 is transcribed from its cover, which is a
  title card reading "Business and Productivity Tools".
- **E1 IS WRITTEN AND IS THE ONE THING TO CHECK BEFORE A DEMO.** Its cover is an untitled
  illustration and nothing in the build names the first course; "Business Essentials" is a
  placeholder. §110's `CH_SYL` is the same honesty about the same kind of gap.
- **IT SHOWS IN FOUR PLACES, all of them where a cohort is IDENTIFIED**: the dashboard's Your
  cohorts eyebrow (`Cohort 41 · Business Fundamentals · Explorer – E3` — cohort, course, level,
  the order a leader scans), the Cohorts page's `.cco-d`, the black call card's `.crow-role`
  (the caption for the cover 16px to its left), and `V.leadMember`'s `.idmeta`. **NOT in
  `ph()`'s fact row** — §78 hides every leader `.ph`, so that slot renders nothing.
- **TWO CONFLICTS IT EXPOSES RATHER THAN CREATES, both flagged, neither fixed:** the E3 cover
  reads "BUSINESS FOUNDATIONS" while `ENROL_COURSE.E3.name` is "Business **Fundamentals**" (the
  map takes the record; one edit either way); and **every cohort runs `CH`**, so `lcDetail` puts
  Cohort 33 at E1 on "Conflict and Repair", a chapter of the E3 course. Naming three courses is
  what makes the second one visible.

#### The leader's Profile is TWO TABS — `S.ldrPfTab`, `V.leadProfile`

Maryam, 2 Sep 2026: *"this page should have 2 tabs right after the summary section, 'General
Profile' and 'Public Profile' … divide the content in both profile tabs accordingly."*

- **THE LINE IS WHO THE BLOCK IS FOR, and the page had already half-drawn it.** "What candidates
  see" is a section whose entire heading is that distinction. **Public** is what a candidate
  reads when they choose you — the card, the bio, the three listing fields that MAKE the card,
  and Your standing. **General** is the account behind it — who you are, when you are on, who
  reviews you, notifications. Nobody else ever sees a line of the General tab.
- **THE `.kv` TILE IS THE ONE BLOCK CUT IN TWO, AND THE CUT IS `ldrProfileSheet`'s OWN LIST.**
  That sheet edits display name, specialism, bio and call length — so four of the tile's five
  rows are listing copy and only Role is a fact about the account. General keeps **Display name**
  and **Role**; Public takes **Specialism**, **Assessing range** and **Call length** under a
  "Your listing" heading directly under the card they build.
- **YOUR STANDING GOES PUBLIC, which is the one judgement worth arguing.** Its own heading says
  "Read-only · across every cohort you have closed", which reads private — but 4.9 and "8 cohorts
  led" are printed on the card 200px above it, so the four figures are the working behind two
  numbers a candidate already reads. On General it would be the only block anyone else can see.
- **ONE EDIT CONTROL PER TAB, AT THE TOP, AND ONE SHEET BEHIND BOTH.** "Edit details" on
  General's identity row, "Edit listing" on Public's `What candidates see` heading — §29.10's
  rule that an action sits on the thing it acts on. `ldrProfileSheet` holds the whole record, so
  splitting it as well would be two forms writing one `LEADER`. "Your listing" therefore has no
  control of its own: the card above it is one press away and covers it.
- **`S.ldrPfTab` IS STATE — TRAP 9, and it is the version of the trap that is easy to get wrong.**
  The tab does not SHOW a hidden panel, it decides which sections the page emits, so a class move
  on the button (the idiom every neighbouring handler uses) would paint nothing. `V.leadReports`'
  cohort strip makes the same call with `S.ldrRep`, and `.sec.sec-cs` + `.cs` is that page's
  markup reused — §16 zeroes a section holding a tab strip and §20 knows the marker, so the two
  grounds meet on one line with no rule of its own. **No new CSS at all.**
- **"RIGHT AFTER THE SUMMARY SECTION" IS FREE, AND `placeBand` IS WHY.** That pass walks forward
  from the `.ph` taking Tal's card, the ask line and any declared `.head-sec`, and stops at the
  first sibling that is none of those. A plain `.sec` holding the strip, written directly after
  `ph()`, is what stops the run — so the band closes above the tabs instead of swallowing them.
- **`PAGESUM.leadProfile` NOW COVERS BOTH HALVES AND NAMES NEITHER TAB** — pointing at the UI is
  one of that record's four content bans, so the sentence says what the two halves hold.

#### The cohort cover — §86, `.gcard-art` + `COHORT_ART` / `cohortArt`

Maryam, 1 Sep 2026: *"the cohort left blocks should have images … also the block square should
have the height equal to the right side content"*, then *"show the yellow one in the black call
cards"*. Three covers, embedded by `build.py` as 200px WebP squares (18 KB for all three).

- **THE COVER IS KEYED BY LEVEL, NOT BY COHORT ID.** `cohortArt(c)` reads `c.level` and falls
  back to `e1`. Keying on the id would have worked with three cohorts and three files and would
  have been a coincidence — a fourth cohort lands on `undefined`, and `crow`'s note is why that
  is worse than no image at all (an undefined `src` 404s on every render, which `respcheck`
  reads as a broken screen).
- **THE ORANGE ONE IS E3's BECAUSE THE BLACK CARD ASKED FOR IT.** The card draws the NEXT cohort
  call and takes that cohort's own cover, because a card showing another cohort's artwork is the
  card lying about its subject. The next call is Cohort 41 at E3, so E3 holds the orange one.
  **The consequence is stated rather than hidden**: a week where Cohort 33 came first would put
  the E1 cover on the card. If it must be orange whatever it is about, that is a fixed cover on
  `leadCall`, not a fourth file.
- **IT IS A 9:5 RECTANGLE AND IT SHIPPED SQUARE FOR ONE BUILD** (Maryam, 1 Sep 2026: *"i need
  the image blocks in horizontal rectangle form so the image do not cut from sides. this does not
  mean that you use different widths for different images, just use a rectangle for same width
  for all."*). All three covers are ~1.80:1 title cards, so a square threw away 45% of every one
  of them from the SIDES — on a cover whose subject is a line of type, the half that carries the
  meaning. 9:5 is 1.800, which is what the three measure to within 1%, so the box shows each one
  whole and the render is 1:1 with the asset.
- **ONE WIDTH FOR ALL THREE, WHICH THE ASK STATES AND THE COMPONENT WOULD WANT ANYWAY.** A
  per-image ratio would size the column from the picture, so three rows in one `.tile-stack`
  would start their text at three different x — §31.5's own argument for the date chip ("a diary
  is scanned down the date and across the detail, and both of those need a straight edge").
- **`object-fit` IS `contain`, NOT `cover`.** With the box and every asset at 9:5 the two are
  identical today; they stop being identical the moment somebody points this at artwork of
  another shape, and `cover` would go back to trimming the sides. `contain` fills the width and
  letterboxes against the box's own ground instead.
- **BOTH DIMENSIONS ARE STATED, AND ONE `calc()` GIVES BOTH.** `--gcard-art-h` is the sum of the
  three type roles the body draws — `--t-eyebrow-lh` + `--s03` + `--t-h4-lh` + 2px +
  `--t-desc-lh` = **62px** — and `--gcard-art-w` is that sum at 9:5, so the box is a rectangle
  AND exactly as tall as the three lines beside it. Measured 112 × 62 against a 62px body.
  **`aspect-ratio` does NOT work in this position** and §75.3 records the same trap from the
  other side: a flex or grid container resolves the main axis first, so the item's height is
  unknown when the ratio would need it and the box collapses to its content.
- **THE HEIGHT IS STATED RATHER THAN STRETCHED, AND THAT WAS THE COST OF THE RECTANGLE.** It was
  `align-self:stretch`, which gave the box the row's content height for free — right for a square
  and wrong for a rectangle: at 390 the description wraps, so a stretched box became 111 × 79
  (1.4:1) and started cutting the sides again at the width the row can least afford it. Stated,
  the picture is uncut at every width and the box is centred in a taller row.
- **THE BLACK CARD'S SLOT IS THE SAME RECTANGLE — §86.2, `.crow-cover`.** `crow`'s portrait slot
  is a 78px square because on its other four call sites it holds a FACE, so the card was reading
  "BUSINESS FOUNDATIO". The height stays §71's 78 (the mark and the three lines beside it are the
  same height by design) and only the width changes, to 78 × 9/5. **It is a class the record asks
  for, not a portal scope**: `.crow-dark` is worn by the candidate's booked interview too, where
  the mark IS a face, so `crow` takes a `cover:true` field — `img` is whether there is a picture,
  `cover` is what shape the slot should be.
- **THE CROP IS DONE OUT OF BUILD, PER IMAGE, AND THAT IS WHY.** E1 and E2 are centred
  compositions and E3's title sits hard left, so a single `object-position` could not serve all
  three and three CSS rules would put a property of the PICTURE in the stylesheet.
- **`gcard`'s SIXTH ARGUMENT IS `{src, i}` AND THE LABEL IS THE CALLER'S.** Deriving it inside
  the component was the first version — digits off the title — and it read "513", because a
  cohort row's title is "Week 5 of 13" and its number is in the eyebrow. The `<i>` sits behind
  the `<img>` and the `onerror` uncovers it; §63 §23 types it at h4, the row's own tier.
- **IT CROSSES INTO `design-system/`** — the rules know nothing about the images, so a
  hand-authored page pointing the `<img>` at its own artwork gets the whole component.
  `gallery.html` documents it under **Rows** with both states, the cover and the fallback.

#### The dashboard's four blocks — `LEAD_JUMPS` — and the three flags

**THE ORDER AND THE FOUR WORDS ARE MARYAM'S, 1 Sep 2026:** Attention Required, Awaiting
Decisions, Cohort Calls, Cohorts — *"the order of these block here and on the page as well"*.

- **`LEAD_JUMPS` IS THE ONE LIST AND IT DRIVES THREE THINGS**, which is why a reorder is one edit
  and two follow-ups. The cards are generated from the array, the four page sections carry its
  ids, and **§31's four hues are keyed by `nth-child`** — so the red moved from cell 2 to cell 1
  and the amber from 3 to 2 with it. The rule is unchanged in substance: the two cells that are
  DEMANDS carry a hue, the two that are counts stay ink. If it is reordered again, §31 is the
  other half.
- **THE TWO DEMANDS COME FIRST.** Attention and the signature queue are somebody waiting on this
  leader; Calls and Cohorts are counts of what they hold.
- **`lead-booked` IS NOW `lead-calls`.** That id is from the week the diary held interviews
  somebody had booked, and nobody books a cohort leader.
- **THE GROUNDS ALTERNATE BY POSITION, NOT BY SUBJECT.** White, tint, white, tint was already the
  page's rhythm and it is a property of where a section SITS, so the two blocks that swapped ends
  swapped grounds with them. Nothing about §84 or §55 changes; the classes moved.

**THREE FLAGGED CANDIDATES, ONE SEVERE** (Maryam, 1 Sep 2026: *"show only three attentions in
total, from which 1 will be severe and one will be moderate"*). Read as one severe and the
remainder moderate, because `lflag` has no third severity: **1 severe, 2 moderate** — Yuki
Tanaka inactive 12 days, Chloe Ferreira behind pace, James Whitby struggling, all in Cohort 41.

- **IT IS DONE BY MOVING THE ACTIVITY DATA, NOT BY SLICING THE QUEUE.** A flag is derived, never
  set (the rule below), so capping the list at three rows would have left twelve flags behind it
  and made `lattention` disagree with the cohort pages, the reports and the figure card — all of
  which count the same predicate. Nine candidates came back instead.
- **EACH ONE HAD TO CLEAR EVERY TEST, not just the one that was firing.** `lflag` runs six in
  order, so raising progress on somebody eight days quiet only moves them from "at risk" to
  "inactive". Tobias, Ivan and Zoe each needed progress AND a recent sign-in AND an attempts
  figure under 2.0; Cohort 47's four "Never" needed a first sign-in.
- **TWO PLACES OUTSIDE `LEAD_COHORTS` HAD TO FOLLOW**, both hand-written prose naming a number
  that array owns: `COHORT` (views.js) reads Tobias's last-active on the CANDIDATE's own Cohort
  page, and `LDR_THREADS` (lead4) opened Priya's message to him with "eight days quiet and 18% at
  week 5". His thread now shows a reply — which is what a resolved one looks like, and a message
  list that only held currently-flagged people would delete its own history every time somebody
  recovered.
- **YUKI IS THE ONE THIS HAD TO LEAVE ALONE.** `LEAD_NOTIF` names her 12 days and her 9%, and
  her own thread is about them.

**AND THE SECTION LOST ITS FIVE CONTROLS WITH THEM** (Maryam, same day): the helper line "From
course activity, not from you", the search field, the All / Severe / Moderate strip, the
"All 3 flagged candidates." count and the empty state are all deleted. They were answers to one
premise — that this was a queue of twelve you had to work through — and it is three rows.

- **THE JS WENT WITH THE MARKUP.** `S.leadQ`, `S.leadFilter`, `leadFilterApply`, the `input` and
  `[data-lfilter]` listeners, the render wrapper's call to it, and `data-nm` / `data-co` on each
  row (attributes only the search read). §31 lost `.lead-tools`, `.lead-srch`, `.lead-filter`
  and its phone tier, `.lead-none` and `tr.is-off` — twenty-two rules. The row still carries
  `sev` / `mod`, because §31 keys the flag's INK on it, which is a different job from visibility.
  **The technique is kept in a note** rather than the code: it filtered the DOM and did NOT
  re-render, because `render()` destroys an `<input>` and takes the caret with it (ai4's trap).
  The next control typed into on a leader page wants that shape.
- **THE TABLE KEEPS ONE RULE AND IT IS LIGHT GREY** — *"remove the lines between the table rows,
  keep the one after the column header but use light grey"*. Two declarations, and both are
  overrides of a base this table no longer wants: §02.461 gives every `td` a border and §10.243
  points it at `--rule`, so the row lines are turned OFF rather than not turned on; and §10.242
  gives `.tbl th` `--rule-ink`, which is **`#111`** — a black rule, right for the dense tables
  §10 wrote it for and far too heavy over three rows. `--rule` (#d7d5cd) is the build's one
  hairline, which is what "light grey" names. `.app[data-portal="leader"] .tbl-flag th` is
  (0,3,1) against §10's (0,1,1), so it wins on weight rather than on the layer order.
- **THE FLAG IS A ROUNDED CHIP IN THIS TABLE** — *"round chips, the red item will have a light
  red chip bg and the orange item will have a light orange bg"*. The tint is a `color-mix` off the
  same ink the row already carried (12% for red, 14% for amber — red is the stronger hue, §74's
  own adjustment) rather than `--support-error-bg` / `--support-warning-bg`: those are `.tag`'s
  pair and the warning one is `#fcf4d6`, a pale YELLOW that does not belong to
  `--support-attention`'s hue. **It is the only rounded rectangle in the build and it is by
  instruction** — `--radius` is `0px` by token and §56 grants the one exception to MARKS, so the
  pill is a literal `999px` rather than a re-pointed token, which keeps the token honest. Scoped
  to `.tbl-flag`, so the agent's payment ledger keeps `.flag-t` with no ground — five filled
  pills down a column of plain text is the drawing that component replaced.
- **A ROW THAT OPENS ONE OF SOMETHING CARRIES ITS SUBJECT, and this bit twice in one afternoon.**
  *"it should not take me there instead open the detail view"* (Awaiting Decisions), then *"on
  clicking a cohort, i should go to it's detail page, not on cohort module"*. `data-go` can only
  name a VIEW, so both lists opened their module — which then drew the same rows again one click
  below the ones just pressed. The fix is the same in both places and is `crow`'s `second.at`
  idiom: **`faceRow` takes a fourth argument and `gcard` a seventh, both a raw attribute**, and
  the dashboard passes `data-ldrsum="<id>"` / `data-ldrco="<id>"` beside the `data-go`. lead2's
  and lead3's capture-phase listeners set `S.ldrCo` / `S.ldrSum` before `go()` runs. Both are
  optional, so every other caller — including the ten `gcard`s in `tn-agent-portal.html` — emits
  byte-identical markup. **The heading row's "View all 3" is still how you reach the list**, which
  is the whole reason a row does not have to be it.

**AND THE CALLS PAGE LOST ITS PAST** (Maryam, same day): *"remove this section"* — "Already run",
the calls behind the leader with the week, the chapter and who turned up.

- **THAT SECTION WAS THE MODULE'S OWN ARGUMENT, so the argument is restated rather than dropped.**
  §-note over `V.leadCalls` used to say the page earned its rail slot on the PAST, because
  `V.leadCohorts` was already listing the week's three calls. It no longer holds — and the slot
  is still earned by the simpler fact that Cohorts gave its call list up to this page in the same
  pass, so this is now the only place the week's appointments are listed at all.
- **`LEAD_RUN` STAYS, WITH ONE READER.** `PAGESUM.leadCalls` sums the seats across it — "across
  the four behind you, 32 of 36 seats were filled" — which is now the only place attendance
  appears in the product, and a figure read once is what a Tal summary is for. `lranChapter` went
  with the rows; `V.leadProfile`'s row stopped promising "attendance is on the Calls page".
- **BRIEF BECAME RESCHEDULE ON 1 SEP AND THE WHOLE RESCHEDULE FLOW IS GONE ON 2 SEP** (Maryam:
  *"a cohort leader can not reschedule a weekly call so remove that flow"*). The row now has **no
  action at all**, and that is the point: a weekly cohort call belongs to the PROGRAMME — ten
  candidates, a fixed hour, thirteen weeks — and lead4's sheet said so in its own helper line
  ("moving one moves it for every candidate in that cohort"). This is the 1 Sep correction one
  surface smaller; the portal keeps drifting toward giving this person an agent's powers.
  **Deleted together, because a sheet nothing opens is the "gate nothing writes" tell one level
  up:** the Calls page's Reschedule button, `V.leadProfile`'s "Manage" control on the *Your
  cohort calls* row, `ldrAvailSheet`, `ldrDays`, `LDR_DAY_NAMES`, `S.ldrAvail`, the
  `data-ldravail` branch and the `'avail'` close branch — `LDR_SHEETS` is down to the profile
  sheet plus lead2's two. **What survives is what a leader still does**: "Generate the brief" is
  the black card's action at the top of the page and is on the cohort page twice, and the Profile
  row is now a FACT — the three hours they are committed to, read off `LEAD_COHORTS`, in the same
  register as "Volunteer cohort leader · unpaid" two sections above it.
  **THE CANDIDATE'S RESCHEDULE IS UNTOUCHED** and the distinction is the whole rule: `CALL_ROW.iv`
  moves an *interview* the candidate booked and paid for with an agent who sets their own
  availability. `I.calendar` still means Reschedule product-wide; there is one caller now, not two.

Four rules the wireframe settled and this side keeps: **no money anywhere** (a cohort leader
volunteers — Certifications replaced Earnings, and there is no fee on any leader page); the
leader is measured on their candidates, not their throughput; **a flag is derived, never set**,
so it clears when the candidate comes back; and Cohort 41 is Maryam's, its ten members *are*
`COHORT` in `views.js`, and its board *is* `ROOM` — post on the leader side and it is there on
the candidate side.

Detail pages take their subject from `S.ldrCo` / `S.ldrMem` / `S.ldrSum`, set by a
**capture-phase** listener on `device` reading `data-ldrco` / `data-ldrmem` / … so `data-go`
stays a plain view name and `go()` needs no colon-splitting branch (the wireframe's
`data-ag="member:41:Maryam Naz"` is what that avoids). The wireframe's client-facing
annotations ("Open question — client decision") deliberately do **not** cross into hi-fi:
`.note` here is product copy, read by Priya.
