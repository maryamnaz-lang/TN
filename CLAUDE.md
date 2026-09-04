@DESIGN.md

# TalentNext prototypes

**Before any UI change on any of the four portals, read `DESIGN.md`** (imported above): the
tokens, the standing rules as a checklist, and the component recipe index. The reasoning behind
every rule is in `docs/HISTORY.md`, keyed by the same § numbers; the CSS layer's own comment is
the primary source. A new rule Maryam gives goes into `DESIGN.md` first, then into a layer.

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


*The dated notes for this section (the agent-portal port of 2–4 Sep 2026 and the steps popup recipe) are in `docs/HISTORY.md` under the same heading; the rules they state are in `DESIGN.md`.*

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

*The `--t-sec` decision, the display-role note and the type sweep are in `docs/HISTORY.md` under the same heading; the rules they state are in `DESIGN.md`.*


**MEASURE WITH THE BROWSER PANE OPEN.** When the pane is hidden the frame
reports `innerWidth: 0`, every element measures 0 and the page's scrollHeight
comes back around 15,000px — which reads exactly like a broken layout and is
not one. `window.innerWidth === 0` is the check; re-open the preview and
measure again. This is trap 15's sibling and cost twenty minutes.

*Every dated design section that used to follow here (§56–§116, both portals) are in `docs/HISTORY.md` under the same heading; the rules they state are in `DESIGN.md`.*

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

*The 1 Sep 2026 cohort-leader correction and the leader sub-sections are in `docs/HISTORY.md` under the same heading; the rules they state are in `DESIGN.md`.*

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
   **AND THAT LIST MATCHES THE COMPOUND BY `endswith`, SO NAME A NARROW CLASS.** §110's
   "Chapter details" label needed one armed hover on the Course Outline's row; `'acc-h'`
   would have armed §04.53's row wash and §10.711's for **every** accordion in the product,
   so the row carries `.ol-row` and that is the entry. A class minted for nothing but the
   hover is the cheap answer; widening an existing one is a state layer nobody asked for.
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
20. **"AS TALL AS ITS CONTENT" MEANS NOTHING WHILE THE PARENT HAS A `min-height`, and this one
    cost two days and a repeated ask.** §70.3e makes the cohort leader's portrait `height:100%`
    inside a grid row so it measures the two lines beside it, and its note argues the whole thing
    correctly — grid rather than flex (§75.3's collapse), `stretch` rather than `center`, the
    transfer through `aspect-ratio`. It resolved against **§02.229's `min-height:64px` on
    `.row-lead`**, four layers back, which is right for a 64px person row and is that row's
    height whatever it holds. The text cell is 43 (19 + 8 + 16, two type roles and the gap) and
    the face came out 64, hanging 21px below the role line. **Everything in the note was true and
    the box it measured was the wrong box** — which is why the ask came back a second day
    unchanged. `min-height:0` is the fix and a stated `43px` is not: a number has to be
    re-derived every time the cell's content changes, which it had twice already. Read
    `getComputedStyle(parent).minHeight` before trusting a percentage height.

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
