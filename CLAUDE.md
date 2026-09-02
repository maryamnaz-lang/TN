# TalentNext prototypes

**The active work is `hifi/` — the high-fidelity candidate portal.** Everything else in this
repo is an earlier generation. Three generations of the same product live side by side, so
check this table before editing anything.

| File | What it is | Status |
|---|---|---|
| `hifi/` | High-fidelity candidate portal, **compiled** from `hifi/build/` | **ACTIVE — work here** |
| `design-system/` | The portal's design language as two linkable files, **extracted** from `hifi/build/` | **ACTIVE — for new pages** |
| `tn-agent-portal.html` | **Talent Agent portal**, hand-written on `design-system/` | **ACTIVE** |
| `tn-portals.html` | Candidate + Cohort Leader portals, hand-written | Prototype, still live |
| `tn-admin.html` | Super Admin panel, hand-written | Prototype, still live |
| `tn-portals.css` | Stylesheet extracted from `tn-portals.html` | Supports the above |
| `talentnext-wireframes.html` | **The wireframes** (TalentNext × LightspeedVT) | Frozen reference |
| `tn-candidate-portal.html` | *Early* candidate portal prototype | **Superseded by `hifi/`** |
| `tn-candidate-portal-flow.html` / `.mmd` | Screen-journey flow diagram | Frozen reference |
| `tn-brand.css` / `tn-brand.json` | Brand tokens | Reference |
| `*-handoff-prompt.md`, `claude-code-prompt.md` | Old session handoff notes | Superseded by this file |

**The name collision to watch.** `tn-candidate-portal.html` (103 KB, untouched since the
initial commit) and `hifi/talentnext-candidate-portal-v24.html` (1.1 MB, current) are both
"the candidate portal". When the request says candidate portal it means the **hifi/** one
unless it explicitly says wireframe, flow, or early prototype. If it is genuinely ambiguous,
ask — do not guess, because the two look similar enough that a wrong edit is not obvious.

**And "agent" means two different people.** In `hifi/` an *agent* is somebody the candidate
books — the `agents` / `agent` views are the candidate's view of a marketplace. In
`tn-agent-portal.html` the agent is the **signed-in user**, and that file is where their own
journey lives. It links `design-system/` rather than living in `hifi/`, because an agent
never sees the 90 days and there is nothing for a portal switch to walk between; the file's
own header records the four flow-diagram questions it decides and why.

Same trap for "the wireframes": that is `talentnext-wireframes.html`, a frozen reference. It
is not a thing to update when the hi-fi design changes; the two are not kept in sync.

The frozen files are still worth *reading* — they are where an intent or a flow decision was
first recorded. Read them freely; just do not edit them without being asked.

## A NEW page or portal starts from `design-system/` — IT IS ALSO GENERATED

`design-system/talentnext-ds.css` and `.js` are the portal's design language, linkable:

```html
<link rel="stylesheet" href="design-system/talentnext-ds.css">
<script src="design-system/talentnext-ds.js"></script>
```

Both are **build output** of `design-system/build-ds.py`, which walks the same 40 layers in
the same order as `hifi/build/build.py` and keeps everything except eight render-pass-bound or
separate-surface families — the build prints the kept/dropped count, so read that rather than
a number written down here. Every rule in the output is a real
rule from the real portal in its real cascade position — nothing is re-typed, and the build
refuses to write if any output rule cannot be traced back to a source layer.

So there are two generated artefacts from one source, and the same rule applies to both:
**never hand-edit `talentnext-ds.css`.** Change the layer in `hifi/build/` that states the
rule, then re-run both builds. Changing the design system changes the portal, by design —
one design language, one source.

```bash
cd hifi/build && python3 build.py
cd design-system && python3 build-ds.py
```

**It is INCLUDE-BY-DEFAULT FOR A CLASS AND OPT-IN BY HAND FOR A LAYER, and that asymmetry is
the one step that is easy to miss.** Once a layer is in the list, every class in it crosses
unless an `EXCLUDE_PREFIXES` entry names it — that is the include-by-default part, and it was
a correction. But **`LAYERS` in `build-ds.py` is a hand-written list, so a NEW LAYER FILE IS
NOT PICKED UP BY REBUILDING.** Add the layer to `build.py`, add it to `build-ds.py`'s `LAYERS`
with a note on what crosses and why, then re-run both builds.

**Nothing used to warn, and it cost four layers.** `verify_subset` checks output → source
("does every rule I wrote trace back to a layer?"), which a layer that was never read passes
trivially; coverage is the other direction and had nothing checking it. §70 shipped
`.jrn-pill`'s ink with no pill and `.rec-alt`'s `color:transparent` with no gradient under it;
§72's note predicted the same failure and §73/§74 walked into it anyway, so `.aih-t`'s size,
`.eo-pill`'s violet and `.signed-card`'s title hue all reached the output with nothing to draw
them. The shape of the failure is always the same and is always quiet: **§63 IS in the list**,
so the design system ships a family's type with no layer stating its grid, ground or geometry —
a half-shipped stylesheet, which renders as a subtly wrong page rather than an absent one.

`check_coverage()` now answers it: `build-ds.py` reads `build.py`'s own layer list and **exits
1** on any layer that is in neither `LAYERS` nor `NOT_IN_DS`. Every build prints
`layer coverage: N of M portal layers`, so read that line rather than trusting a rebuild.
`NOT_IN_DS` holds the deliberate omissions with their reasons, and there is exactly one:
**`49-agentstar.css`**, which is one portal's 16px sizing of `.stars` — a class the system
already ships and already draws — rather than a component. That layer's own note makes the
argument; it is the single place this build breaks the "change a layer, re-run both" rule, and
it is now stated where the list is instead of only in the layer.

**And a layer can go dead the other way too.** §73's `aiHead` replaced §72's own head row, and
`.pulse-head` / `.pulse-ttl` / `.pulse-lede` / `.pulse-mk` kept shipping with nothing writing
them — the "gate nothing writes" tell, invisible in the portal because a dead rule costs
nothing on the page it was written for, and expensive in the box because `gallery.html` went on
teaching that markup as the recipe. All four are deleted. When a layer takes over another's
job, grep both files for the classes it replaced.

The first version kept a `SYSTEM` allowlist and asked "does a *second* portal need this word?".
`tn-agent-portal.html` was built on that output — 127 classes, only two unstyled — and still
did not look like TalentNext, because the allowlist had dropped every component carrying the
brand: `.plate*` (and with it §19's `.plate .btn-p`, the only reason the CTA inside a plate is
the accent gradient), `.wkc*`/`.ring*`, `.ai-aura`/`.ai-head`/`.ai-label`, `.tw-btn`, `.cert*`,
`.lvl-hero`, `.score*`, `.aw*` — plus `__TALCIRCLE__`, Tal's own mark, dropped as "product
artwork", which is why Tal came out a hard orange square. **Excluding a class costs a portal
that looks generic; including an unused one costs one rule.** Default to include.

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

Excluded now, and only these three prefixes: `lsvt*` `ios-*` (pictures of somebody else's
UI) and `nil*` (the Next in Leadership microsite, its own visual language, marked temporary
in `build.py` too). `ask*`, `bk*`, `scene*` and `auth*` were on this list and are **not** any
more — the chat is the one screen every portal wants and the least like a plain page.
`build-ds.py` prints the surviving list every build; read that rather than this sentence.
`SYSTEM` survives but gates nothing — it names the JS-free core.

**The CSS is only half a component; the markup is the other half.** These have internal
structure the CSS keys on, and a guessed structure looks *broken* rather than absent — the
first `proof.html` invented it and got four of six wrong. Recipes are in `gallery.html` under
**Signature**. Three that bite: `.ai-label` needs **`.bare`** outside the JS-assembled band
(§33 keys the mark on `.modhead .ai-aura.talsum`); `.plate` takes **`data-when` as an
attribute**, not a child; `.ring` is **two SVG circles** and `--arc` is a dasharray *length*
(`163.36 × pct/100`), not a percentage.

**And for a component whose point is BEHAVIOUR, the JS is the other half — shipping the
rules alone is worse than leaving it out.** §52's typing summary went in on
include-by-default with its clock left behind in `ai6.js`, on the reasoning that a render
loop does not port. True of a render loop, false of this: it is twelve lines of clock over a
paragraph the calling page already owns. The result was three rules gated on `.tsum`, a class
only a clock ever stamps, so nothing that had the stylesheet could switch it on — and §52's
selectors were scoped to `.modhead .ai-aura.talsum`, a shape `placeBand` builds and a
hand-authored page does not, so they could not have matched anyway. Both halves ship now,
`dsTypeSummary(p, key)`, and the gate is `.tsum` alone.

The test is not "is there JS" but **does the behaviour need the portal's STATE, or only the
element you hand it**. `dsTypeSummary` needs only the element. Tal's thread needs
`S.thread`, and still does not port. The tell that something has fallen in this gap: a family
in the output whose gate is a class **nothing in the box ever writes** — grep both files for
the class, and if only the stylesheet says it, the component is decoration.

- `design-system/gallery.html` — the reference: every component, live, with its markup. The
  place to look before inventing a class. The typing summary is under **Signature** with a
  replay button, because it is the one component you cannot see twice without re-arming.
- `design-system/starter.html` — a working three-page skeleton to copy for a new portal.
- `design-system/DESIGN-SYSTEM.md` — what came across, what did not, and the five things
  that bite (the host requirement, the label column's opt-out list, the `.stats` / `.facts`
  cell counts, the disarmed hover, and the two motion traps).

Two constraints that are easy to miss and are written up in full in that README: a new page
needs a **host** with `container-type:inline-size; container-name:app` or no breakpoint ever
fires; and `.stats` / `.facts` draw their hairlines as the 1px grid **gap**, so a row they do
not fill paints grey rather than closing up. `.stats` is a fixed 2/4-column grid — give it
exactly four. `.facts` is `auto-fit` at `minmax(140px,1fr)`, so it fills any row it does not
wrap; for three items, or a band that must hold at every width, use `.kv`. The portal itself
hits this at a container width near 900px, where its four-cell `.facts` wraps to 3 + 1 — one
candidate page and six leader pages, pre-existing.

## Hand-written prototypes — `tn-portals.html`, `tn-admin.html`

Single self-contained files, edited directly. `tn-portals.html` is ~2.4 MB; expect large
files and search rather than read end-to-end.

## The hi-fi candidate portal — `hifi/` — IS COMPILED

`hifi/talentnext-candidate-portal-v24.html` is **build output**. Never hand-edit it: the
next build overwrites it, and it carries no comments (the build strips ~250 KB of prose).

The real source is `hifi/build/`:

- **The numbered CSS layers**, `01-foundation.css` → `77-crowdark.css` (there is no 48),
  concatenated in
  the exact order listed in `build.py`. Cascade order *is* the architecture — later layers
  patch earlier ones by name. Everything from `30-nil` on is late because every rule in it
  is either a class no earlier layer mentions or a correction that has to land after the
  layer it corrects; `build.py` records the argument for each one, in place. Read that
  comment before inserting a layer.
  **`63-typography.css` owns type, and no layer after it may set a font size, a
  font weight, a text-transform or a text colour** — those four belong to §63
  wherever they appear in the file list. Layers after it are free to do anything
  else. See the typography section below.
- **18 JS layers**, in this order: `icons.js` → `data.js` → `views.js` → `ai.js` … `ai5.js`
  → `nil.js` → `lead.js` → `lead2.js` → `lead3.js` → `lead4.js` → `ai6.js` → `ai7.js` →
  `ai8.js` → `ai9.js` → `ai10.js`. Order matters, and `build.py` says why for each of the
  late ones.
- Fonts, the Tal mark, auth artwork and 8 award WebPs, all base64-embedded at build time.

The loop:

```bash
cd hifi/build && python3 build.py
```

**Every rule carries its reasoning in the source.** That is this project's convention: read
the comment above a rule before changing it — several of them record a decision that looks
like a bug and isn't. Keep writing them that way.

**And the comments are load-bearing enough that the build checks them.** The common edit is
"add a paragraph to the note above this rule", and a paragraph that lands *after* the closing
`*/` is read by CSS as the start of a selector — it silently eats the rule underneath it.
Nothing throws, the page renders, one declaration is just absent. It happened twice (§39.3's
`.tw-lede` sizing had shipped dead for as long as that layer existed; §33.7's panel padding
went the same way, found the same afternoon), so `build.py` now refuses to write if any
unmatched `/*` or `*/` survives the comment strip, and prints the line.

### TYPOGRAPHY IS §63 AND IT IS THE LAST LAYER IN BOTH BUILDS

`63-typography.css` states the whole type system — scale, weight, case and ink.
**No layer after it may set a font size, a font weight, a `text-transform` or a
text colour.** Those four are §63's, wherever a later layer sits in the list; a
layer that needs a size either takes a role that already exists or states its
exception inside §63's §7. Everything else — layout, borders, grounds, motion —
a later layer may do freely, which is why §64 can exist at all.

§11 was written to be this layer and lost, and the reason is worth knowing before
you touch either file: **a type scale cannot be stated in the middle of a
cascade.** `.app .foo` in §15 beats `.app .foo` in §11 on order alone, so all 51
layers after §11 that wanted a size simply took one. A computed sweep — ten
stages by 34 views, both portals, ~30,000 text elements — found **26 rendered
sizes** against §11's stated nine, **five weights in a face that ships two**,
**1283 elements in uppercase** and **two greys doing one job**. §11 still says
nine roles; it was never wrong, it was only overtaken.

**Eight sizes, eleven roles, two weights, three inks.** The full table is in
`design-system/DESIGN-SYSTEM.md` under **Typography**, live in `gallery.html`
under **Type**, and the roles are `.t-display` `.t-h1` `.t-h2` `.t-h3` `.t-h4`
`.t-body` `.t-compact` `.t-label` `.t-desc` `.t-eyebrow` `.t-caption`, each
backed by `--t-<role>-size` / `-lh` / `-ls` tokens. Six things that bite:

- **THERE ARE TWO WEIGHTS AND ONLY TWO.** Söhne is embedded at 400 (Buch) and
  600 (Kräftig) and at nothing else. Measured: 40px of text is 280.9px wide at
  both 400 and 500, and 282.9px at 600, 700 and 800. So `font-weight:500` was
  already rendering as Buch on 979 elements and 700/800 as Kräftig on 325 — not
  a hierarchy, three weights that never existed. Write `var(--t-w-book)` or
  `var(--t-w-strong)`. **This reverses the one-weight instruction §11 records**
  ("Maryam asked for the regular style throughout"); confirmed with Maryam on
  28 Aug 2026, because removing uppercase removed one of the four carriers that
  rule depended on.
- **NOTHING IS SET IN CAPITALS.** 66 rules across 18 layers declared it; all are
  off. Every string behind them was already written in sentence case in the
  view, so this needed no copy edit — and that is the rule going forward: **the
  words go in the markup in sentence case.** The only capitals left are the card
  wordmarks (VISA / AMEX / DISCOVER), which are artwork, and they are excluded
  by name so the exception is stated rather than accidental.
- **A DESCRIPTION IS ONE GREY.** `--text-secondary` (#525250) for every
  description, supporting line and eyebrow. `--text-helper` (#666563) is the
  floor tier ONLY — timestamps, legal, chart axes, captions. Before this the two
  were picked per component with nothing saying which was right. On a dark
  ground there are two inks, not three: secondary *and* helper both become
  `--on-dark-2`.
- **SPECIFICITY BEATS ORDER, so landing last is not enough.** §63's assignments
  are `.app .foo` (0,2,0); twenty-odd rules in the build are 0,3,0 or 0,4,0 and
  are untouched by it. §7b restates each. They were found by sweeping the
  rendered DOM and reading back the winning selector — a grep cannot tell you
  which of four matching rules won. **The `.lf-n` case is the one to read**: §31
  states it twice scoped to the leader and §36 then generalised it to
  `.app .cs button > .lf-n`, so answering §31's pair fixes two pages and leaves
  the two §36 added.
- **SWEEP AT MORE THAN ONE WIDTH** (trap 3). §3 of the layer cleaned the product
  at 390 and 760 and left 1280 holding four sizes it does not have, because the
  section heading, the page lead and two eyebrows are resized inside
  `@container app (min-width:900px)`. §8b restates them at the same width. A
  one-width sweep will tell you this is finished when it is not.
- **SVG `<text>` WAS NEVER IN THE SYSTEM.** §11 neutralises HTML elements by
  name and `text` is not one, so the charts and the rose fell through to 6px,
  7.5px, 9.5px, 10.5px, 12px and 26px. §5 brings them in, on `fill` rather than
  `color`.
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

**MEASURE WITH THE BROWSER PANE OPEN.** When the pane is hidden the frame
reports `innerWidth: 0`, every element measures 0 and the page's scrollHeight
comes back around 15,000px — which reads exactly like a broken layout and is
not one. `window.innerWidth === 0` is the check; re-open the preview and
measure again. This is trap 15's sibling and cost twenty minutes.

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
  — a Join that opened a *page*) and the Cohort page's own plate. **The leader's remaining Join
  and the consultant call's are still dead** — the component takes them, nothing points at them
  yet. There were four leader-side Joins; three went with the interviews on 1 Sep 2026 and the
  one left is on `V.leadCohort`'s weekly-call plate.
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

### The Cohort Leader portal — `lead*.js` + `31-lead.css`, `36-lead2.css`

The portal switcher in the app bar flips `S.portal`; `lead.js`'s render wrapper stamps
`data-portal` on `.app`, which is how both stylesheets scope themselves. One view registry,
one renderer — the leader is a different signed-in **user**, not a different application, so
every key is prefixed `lead`.

| File | Views |
|---|---|
| `lead.js` | the data (`LEAD_COHORTS`, `LEAD_RUN`, `LEAD_SUMMARIES`, `LEADER`), `leadDash`, `leadCallCard`, the sticky figure bar, the attention queue's search/filter |
| `lead2.js` | `leadCohorts`, `leadCohort`, `leadMember`, `leadReports`, the brief and note sheets, `LDR_SHEETS` |
| `lead3.js` | `leadCalls`, `leadEvals`, `leadSum` — and the one signature flow |
| `lead4.js` | `leadMessages`, `leadCerts`, `leadProfile`, the profile and availability sheets |

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
- **BRIEF BECAME RESCHEDULE, AS A SECONDARY** — *"just a black text with reschedule icon on its
  left"*. `.btn-t btn-sm ic-l`: §64 took the border off `.btn-t` and left the ink at
  `--text-primary`, so a text button on a page IS black words, and §64's trailing arrow does not
  arrive because its test is `:not(:has(svg))` and this one carries a mark. **The mark is
  `I.calendar`, which is what Reschedule already wears** on the candidate's own call row — one
  word, one glyph, rather than a second mark for the same verb. **It opens the weekly-calls
  sheet** (`data-ldravail`, mounted on every leader page by `placeLdrSheets`), which is the
  surface that actually moves a call: pointing it at the brief would be a button lying about what
  it does, and inert would be §60's dead control. The brief is still the black card's action at
  the top of the page and is on the cohort page twice.

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

### Traps that cost real time here

1. **`views.js` writes inline `style="padding-…"` on some sections.** An inline declaration
   beats every stylesheet rule at any specificity. When a rule that clearly matches does
   nothing, check `el.getAttribute('style')` **first**. Fix at source, not with `!important`.
2. **Entrance animations beat normal declarations.** `13-motion.css` runs with
   `fill-mode:both`, so a played animation's final keyframe keeps applying. Never style a
   resting state with `opacity` — put the weight in `background-color` (e.g. `color-mix`).
3. **A rule that must differ per width has to be restated INSIDE the container query — and it
   has to be LATER in the file as well.** Restating inside the tier is half of it
   (`25-modhead.css` §7 does this twice). **This trap used to read "a rule inside `@container
   app (min-width:900px)` beats an unconditional rule of equal weight regardless of layer
   order", and that is not what CSS does** — a container query adds **no** specificity, so an
   unconditional rule of equal weight that lands later still wins. It held everywhere it was
   cited only because those query blocks happen to sit later in the file than the rules they
   answer. **§77.6a is the counter-example and it cost a build cycle**: the stacked-tier
   correction for `.crow-a`'s `align-self` was written into §77.5's existing query block, four
   lines *above* §77.6's unconditional rule at the same (0,3,0) — it lost on order, the group
   stayed `flex-end`, and nothing warned. Moved below §77.6 it wins. Check the *order* as well
   as the tier and the weight.
4. **`20-group.css`'s desktop rule carries ~13 classes.** It cannot be outweighed from a later
   layer — extend its `:not()` exclusion list instead. That list is where "which section pairs
   are already joined" is decided.
5. **`data-open` vs `data-shown` on `.app`.** `data-open` is a **one-render** transition marker
   that entrance animations gate on. `data-shown` is the persistent state. Layout must read
   `data-shown`; only motion may read `data-open`.
6. **Hover is deliberately disarmed.** `build.py` rewrites every `:hover` to
   `:hover:where(.__nh)` — 300-odd selectors; the build prints the count. Only the handful in
   `HOVER_KEEP` stay live. To keep a new one, add it there — **there and nowhere else**:
   `build-ds.py` now PARSES that tuple out of `build.py` rather than keeping a copy, and
   filters it by `EXCLUDE_PREFIXES` so the four `nil-*` entries do not name rules the design
   system does not ship. The copy it used to keep had drifted two entries — `tal-star` and
   `tal-fab` were live in the portal and disarmed in the box, so the design system shipped the
   agent card's ask control with **no way to open it** (`.tal-star` is collapsed to a mark until
   you point at it, and `.agh-book .tal-star:hover .lbl` could never match because `.__nh` is on
   no element in any page). It fails silently in both directions: a rewritten `:hover` is still
   a perfectly valid rule, and an ARMED hover the portal does not have would be just as
   invisible. One source, parsed.
7. **The icon set is official Material *Symbols*, the ROUNDED style at FILL 0 — LINEAR, and
   ON A `0 -960 960 960` BOX.** Changed platform-wide on 31 Aug 2026 (Maryam, by name and
   with the Google Fonts panel: Material Symbols / Rounded / Fill off) from the Material
   *Icons* filled cut. Every mark is the official Rounded outlined file from
   `google/material-design-icons`, pasted rather than drawn. Do not mix a filled mark in —
   what made the previous cut work was holding ONE cut, not which cut it was, so the same
   rule now points the other way.
   **THE GRID IS THE THING THAT BREAKS A CALL SITE.** Material Symbols are forty times the
   size of Material Icons and are drawn ABOVE a y=0 baseline, into negative y. A Symbols path
   in a `0 0 24 24` box renders as an invisible speck in the top-left corner and **nothing
   throws**. `I.name` and `inner()`'s proxy state the box once; the 25 call sites that wrap
   `inner()` in an `<svg>` of their own were all repointed with it. After touching `icons.js`,
   `grep 'viewBox="0 0 24 24"'` and expect only the deliberate exceptions — **the built portal
   contains exactly five and they are all correct**: `nil.js`'s `NILP` proxy and views.js's
   two `ls-*` chapter-player marks (pictures of somebody else's UI, both already excluded from
   the design system), and the **prototype chrome's Back and Reset buttons, which live in
   `build.py`'s HTML template rather than in a layer** — the frame around the device is not
   the product. In source, add `CHEV` and `TN_MARK` (brand marks carrying their own boxes,
   `gallery.html` draws the first) and `tn-agent-portal.html`'s own chrome Reset. That is the
   whole list; anything else is a call site that was missed.
   **`talChat` was REGRIDDED, NOT REDRAWN** — it is Maryam's traced mark, not Google's, so it
   was mapped through `(x,y) -> (40x, 40y - 960)`, the exact affine between the two boxes, and
   checked by rendering both into one 960 box for equal bounding boxes. A uniform scale plus a
   translate cannot change a shape; re-tracing it against the Rounded cut would have been a
   redrawing of a mark that was never Google's.
   **FOUR MARKS ARE STILL FILLED AND THAT IS THE RULE, NOT AN EXCEPTION TO IT.** In Material
   Symbols `FILL` is an axis for conveying STATE — selected/unselected, done/not done — not a
   second look you may prefer. So the set sits at FILL 0 and flips to 1 to say "this one is
   on": `star` / `starOutline` (a rating's lit and unlit slots), `checkFilled` (done, against
   `checkOutline`'s not-done) and `stopFilled` (a solid dot, which is what its name says).
   **The test for a fifth is whether the SAME glyph also appears unfilled and the difference
   is what the reader is being asked to see.** `trophy`, `certificate` and `shield` fail it —
   they are subject marks (a widget's topic, a stat cell's category, the security note beside
   a card form) and never appear both ways, so a filled trophy would be an award nobody has or
   has not won. `circleDash` needs no entry either: Rounded's `radio_button_checked` already
   draws its centre solid at FILL 0.
   **`stars()` is the one call site the pairing forced to change** — in views.js and again in
   `tn-agent-portal.html`'s own copy. It printed `star` five times and let a `.f` class carry
   the whole rating in colour, which was doing half the work when the glyph was solid and
   would have been doing all of it here. `.f` stays; it is no longer alone.
8. **Any new `ai*.js`-style pass file must end with `render()`.** The boot render is the last
   statement in `views.js` and runs before any pass is parsed, so each pass re-renders at its
   own foot. `ai5.js` was missing that call and the module head band was absent from the first
   paint until any interaction.
9. **Nothing inside Tal's thread may keep state in the DOM.** `render()` replaces
   `device.innerHTML` outright, and `placeAsk` (`ai4.js`) then rebuilds the whole `.ask-page`
   from `S.thread` — so a class a click handler puts on a button is gone by the next paint.
   Anything interactive in a bubble is a pure function of `S`, re-run by a pass. `ai7.js` is
   the worked example: `S.thread` holds an empty `<div class="bkw" data-bkw="…">` and
   `placeBook` fills it on every render.
10. **A page component borrowed into a bubble brings the page's gutter with it.** `.ask-page`
   carries `.page`, so every `.app .page …` rule reaches inside a Tal bubble — which is what
   lets the chat use the real agent card, picker and card row. But those components indent
   themselves against `--pad-x`, and `.band` uses it as a *negative* margin to bleed to the
   column edge, so in a bubble they hang off both sides. `35-book.css` §1 answers all of them
   with one declaration: `--pad-x:0px` on the widget root. Do that rather than chasing
   selectors.
11. **A page's Tal card is its `PAGESUM` entry — you cannot hand-author one.** Three passes
    act on it in order: `talFirst` (`views.js`) hoists *any* `.sec` containing an `.ai-aura`
    to directly under the `.ph`; `placeBand` (`ai5.js`) pulls it into the `.modhead`; and
    `placePageSummary` (`ai6.js`) strips `.ai-foot`, `.ai-asks` and any head-row action out
    of the band, then replaces the card's `h3` and body with `pageSummary()`. So a card
    written into a view loses its button and its words, and moving it further down the page
    does not help — it gets hoisted back. Put the copy in `PAGESUM` (a function, if it reads
    `S`) and put the route on the page. **A new view with no `PAGESUM` entry is worse than
    wrong:** `if(!text) return` fires *after* the stripping, leaving the card with its `h3`
    in a shape §33 does not style — the head band renders ~700px wider than the page.
12. **`.plate` and `.cert` move themselves.** Both are in `DARK_CARD` (`ai5.js`), and
    `placeDark` lifts whichever page child contains one into the head band. One dark card per
    page: three `.cert`s in a row arrived in the band as a single black slab with the section
    heading clipped to "Earn/ed" in the label column. `V.leadCerts` uses one `.cert` as the
    hero and `.cardrow`s for the rest.
13. **§10.15's label-column opt-out is keyed by CONTENTS, and it is the cheapest thing to
    get right.** At desktop a `.sec` with a `.sec-h` gets a 184px label column unless it
    contains `.tile-stack`, `.stats`, `.tbl-wrap`, `.facts`, `.cardrow`, `.gcard` or `.kv`.
    Build pages from those and the spine is free; introduce a wrapper (`.msgs`, `.ivt-lines`)
    and its heading collides with its own content. The list lives inside `@container app
    (min-width:900px)`, so per trap 3 it can only be extended by restating it inside the same
    query — `36-lead2.css` §36.9 does that twice. Also keep those headings SHORT: three words
    is two lines in 184px.
    **`.kv` is the newest member and the odd one out: it opts out because it ALREADY IS a
    label column.** §10.5 gives `.kv` `var(--label-col)` — the same 184px — at the same
    breakpoint, so a kv band under a heading drew the spine twice and set the value 416px in
    ("What you sent" on the agent's application is the case that showed it). A headed kv
    section therefore stacks: heading on top, keys and values below. It is the one entry
    reached by descendant rather than `> `, because the band is always wrapped (a `.tile` in
    the portal, a bare `div` from the agent portal's `kv()` helper) — and the one with an
    exclusion, `:not(:has(.chart-table))`, because §05/§15 borrow `.kv` for a chart's data
    table and a headed chart section keeps its column.
14. **A `TAL_ROUTES` handler is called with NO ARGUMENT.** `talReply` is
    `for(const [m,fn] of TAL_ROUTES) if(m.test(q)) return fn()` — the regex is the whole of
    the parsing, and every route before `ai8.js` is a closure over `S` that never needed the
    words, so nobody had hit it. Write `(q) => q.match(…)` and you get `undefined.match`,
    which `ai8.js`'s wrapper then swallows into a support card — a route that looks like it
    declined. Read `TAL_Q` instead; the wrapper sets it one statement before the router runs.
15. **A widget in a Tal bubble is capped at the bubble's measure, and `.tw` was capped at the
    wrong one.** §27.8 gives a Tal bubble `max-width:min(55%, 620px)` because a 1400px
    paragraph is a log file. 55% of a 390px phone is 190px, and `.tw-lines` is a two-column
    flex with a fixed 58px label — so the value cell got **76px** and a four-word value set
    one word to a line. Every widget Tal ever printed was 160px wide on a phone. `35-book.css`
    §2 is where this is answered: `.bb:has(.bkw)` takes the whole measure, and `.bb:has(.tw)`
    now takes `min(100%, 620px)` — full column on mobile, a readable line on desktop. The two
    differ because `.bkw` is cards with an intrinsic size and `.tw` is a grid that takes every
    pixel it is given. **Also: measure with `offsetWidth`, not `getBoundingClientRect`** —
    `#device` carries the harness's fit-to-pane scale (~0.02), so a rect-measured 320px widget
    reports 7px, which reads exactly like the animation trap in the next section and is not it.
16. **`:first-child` cannot tell you whether a bubble opens with prose.** A bubble is built by
    assigning a string to `innerHTML`, so leading prose is a TEXT NODE and `:first-child`
    counts elements only — a widget is `:first-child` whether or not a sentence sits above it.
    That matters because the two need opposite spacing: after a sentence the widget needs its
    16px, opening the bubble it must not have it or the label sits 34px down against 17px at
    the sides. There is no selector for this. `twTop` (ai8.js) stamps `.tw-top` from an
    anchored prefix test on the reply string, in the one wrapper every reply passes through —
    which is also why it fixes data.js's and ai2's answers and a per-widget marker would not.
17. **`requestAnimationFrame` NEVER FIRES in a hidden document, and this prototype is
    usually read in a pane that reports itself hidden.** Not throttled — stopped: no frame
    ever arrives, so an rAF loop scheduled at boot runs its first synchronous call and then
    nothing, forever. `typeSummary`'s first version left the page summary showing only its
    greeting in every tab that was not at the front when the page loaded, which reads exactly
    like a broken pass except that nothing warns. Anything paced over time here uses
    `setTimeout` and derives what to show from the ELAPSED TIME rather than from a counter, so
    a background-throttled tick simply arrives with more work to do. `document.hidden` is
    worth checking first when a timed effect appears not to run at all.
18. **Write `:hover` PLAIN in a layer — never pre-disarmed.** Trap 6 says the build rewrites
    every `:hover` to `:hover:where(.__nh)`, and the obvious conclusion — "so I will write the
    disarmed form myself" — breaks the design system: `build-ds.py`'s `verify_subset` refuses
    to write anything if an output selector cannot be traced back to a source layer, and a
    source that already says `:where(.__nh)` is not what it is looking for. The portal builds
    fine, the DS build stops dead with "2 rule(s) in the output do not appear in the source".
    State it plain and let both builds do the rewrite (`60-call.css` §7 records this).
19. **`align-self` CHANGED AXIS UNDER §47 WHEN §56 TURNED THE PLATE INTO A COLUMN FLEX.** In a
    grid it is the block axis, so `align-self:start` meant "pack the text to the top" — which
    is what §47 was written to do for a plate with no `.plate-who`. In a COLUMN FLEX the same
    property is the inline axis, so the identical declaration means "shrink to your content
    width". Nothing errored and nothing warned; the tell was §56's hairline under the plate's
    head row, which is `.plate-h`'s own `border-bottom` — 167px of a 265px column on the
    enrolment card, and 56px on day 90's, where the head row holds only the "DUE NOW" eyebrow.
    §47's rule is deleted and its note kept. **When a layer changes a component's `display`,
    re-read every `align-*` / `justify-*` an earlier layer set on its children** — those are
    the four properties whose meaning is defined by the parent's formatting context, and the
    cascade will not tell you they flipped.

### Verifying a change

**RESPONSIVE IS PART OF DONE — A COMPONENT THAT ONLY WORKS AT DESKTOP IS NOT FINISHED.**
Standing instruction (Maryam, 31 Aug 2026): every new design or component is authored at
desktop and must be verified at **mobile and tablet too, in the same task**, with nothing
broken. It is not a follow-up and not a separate ticket.

Sweep at **390, 760, 1000 and 1280** — one width will tell you a thing is finished when it is
not. `@container app (min-width:900px)` is the portal's only real breakpoint, so 760 and 1000
straddle it and 1280 catches what only resizes *inside* the query (§63 §8b is exactly this
mistake). What to look for, all of which has actually happened here: horizontal overflow, a
`.sec-h` heading colliding with its own content (trap 13's label column), a two-column block
that did not stack, a fixed-px child inside a narrow column (trap 15's 58px `.tw-lines` label
in a 76px cell), an absolutely-positioned divider still drawing once the columns stacked
(§72.3 — switch it off with `content:none`, do not re-point it), and a `.plate-a > .btn` label
on two lines (§56).

A rule that must differ per width goes **inside** the container query, restated there per
trap 3 — a later layer cannot outweigh the tier from outside it.

**Measure with the Browser pane OPEN.** Hidden, the frame reports `innerWidth: 0`, every
element measures 0 and the page's scrollHeight comes back around 15,000px, which reads exactly
like a broken layout and is not one. `window.innerWidth === 0` is the check.

#### `hifi/respcheck.mjs` IS THAT CHECK, AND A HOOK RUNS IT ON EVERY REBUILD

```bash
cd hifi && node respcheck.mjs          # 197 screens x 390/744/1024/1280, ~90s
cd hifi && node respcheck.mjs --edge   # adds 899/900/940 — the breakpoint seam
cd hifi && node respcheck.mjs --quick  # ~30 screens, ~15s — the triage
```

It enumerates the matrix **from `STAGES` / `NAVSETS` in the page**, so a stage or module added
to data.js is swept without touching the script, and it checks the six failures that have
actually happened here: frame overflow, §10.15's label column live below 900, a heading
wrapping past three lines in that column, content escaping its own section, a button label on
two lines, and a vertical divider still drawn after the columns stacked — plus thrown errors,
`console.warn` and `undefined`/`NaN` leaks.

- **It runs on the installed Chrome, resolved from the Playwright MCP's npx cache** — no
  download and no `node_modules` in this repo. That is why it works and `verify.mjs` /
  `audit.mjs` do not: those hardcode `/opt/pw-browsers/chromium`, a Linux CI path.
- **It is deliberately NOT more of `verify.mjs`.** That sweep is the whole product audit and
  its type-scale and tone tables predate §63/§64, so running it today prints a wall of stale
  failures with the real ones buried in it. This one answers one question, so its silence
  means something.
- **`respcheck-hook.sh` is a PostToolUse hook on Bash** (`.claude/settings.json`, checked in,
  so every session in this repo gets it). It does nothing unless the command that just ran was
  a `build.py`, then runs `--quick --quiet`: silent when clean, and on a finding it prints the
  report to stderr and exits 2, which is the code that feeds it back to the model. A checker
  failure (no Chrome, no built file) prints once and exits **0** — a missing browser is not a
  broken layout, and blocking on it would put a false finding in front of every rebuild.
- **The skip key includes the mode.** `--quiet` exits early when the built file's hash is one
  a previous clean run measured; that key carries `quick|full` and the widths, because
  otherwise the hook's 30-screen triage would silently stand in for the 197-screen sweep.
- **A child of a horizontal scroller is not an overflow, and the test is computed.** The first
  cut named the four scrollers it knew and §73's `.cov-row` — a scroller below 900 by design —
  broke it immediately. It walks up for a real `overflow-x` now; the scroller's own box is
  still measured.

Open the built file over http (not `file://` — the browser blocks it) and sweep the matrix:

```bash
cd hifi && python3 -m http.server 8791 --bind 127.0.0.1
```

Then, in the page, loop `STAGES` × `NAVSETS[CFG[stage].nav]` (plus the sub-pages: `report`,
`result`, `agents`, `agent`, `booking`, `payment`, `welcome`, `chapter`, `ivt`, `mem`, `rp`, `account`)
calling `setStage` / `render`, then the leader's seven, then `callOpen('iv'|'re'|'cohort')` and
`callLeave()` at each stage — 280-odd combinations, all of which must render with no thrown
error **and no `console.warn`**: every pass wraps itself in a try/catch that warns, so a broken
pass is a silent warning rather than a blank page.

Disable motion (`animation:none!important`) before measuring geometry, or trap 2 will
confuse the numbers — and note that this also applies to `getBoundingClientRect` read
straight after a render: the entrance animations translate and scale, so a width measured in
the same tick can be off by two orders of magnitude. Wait for the animation or kill it.

`hifi/verify.mjs` and `hifi/audit.mjs` are Playwright sweeps (render, overflow at 9 widths,
WCAG AA contrast, token discipline) but hardcode `executablePath: '/opt/pw-browsers/chromium'`,
which does not exist on macOS — patch that before running them.

`hifi/build/patch.py`, `hifi/build/extract.py` and `hifi/build/views-orig.js` are historical
one-shot migration artefacts. Not part of the build; `extract.py` can no longer run.

**The prototype chrome remembers two different things in two different places, deliberately.**
The app — portal, stage, view — is in the **hash** (`#day34/cohort`, `#leader/leadEvals/new`),
written by the renderer and read by views.js at boot, because that is what you send somebody
when you want them to see the screen you are looking at. The **frame** (Mobile / Tablet /
Desktop) is in `localStorage` under `tn-vp`, because it is this reader's preference for how to
look at the thing and has no business in a link or in a function that runs 200 times a sweep.
Both live in `build.py`'s HTML template, not in a layer.

## Deploying

Vercel serves this repo statically — **there is no build step**, so `hifi/talentnext-candidate-portal-v24.html`
must stay committed. `vercel.json` serves `tn-portals.html` at `/` and the hi-fi portal at
`/candidate`. Pushing any branch other than `main` gives a preview URL and leaves production
alone.
