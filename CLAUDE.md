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

**It is INCLUDE-BY-DEFAULT, and that was a correction.** A new component needs no step at all:
build it as a layer in `hifi/build/`, rebuild, it is in the design system.

The first version kept a `SYSTEM` allowlist and asked "does a *second* portal need this word?".
`tn-agent-portal.html` was built on that output — 127 classes, only two unstyled — and still
did not look like TalentNext, because the allowlist had dropped every component carrying the
brand: `.plate*` (and with it §19's `.plate .btn-p`, the only reason the CTA inside a plate is
the accent gradient), `.wkc*`/`.ring*`, `.ai-aura`/`.ai-head`/`.ai-label`, `.tw-btn`, `.cert*`,
`.lvl-hero`, `.score*`, `.aw*` — plus `__TALCIRCLE__`, Tal's own mark, dropped as "product
artwork", which is why Tal came out a hard orange square. **Excluding a class costs a portal
that looks generic; including an unused one costs one rule.** Default to include.

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

- **The numbered CSS layers**, `01-foundation.css` → `63-typography.css` (there is no 48),
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

- **The state is `S.found` AND a DOM class.** `render()` alone was wrong: it
  replaces `device.innerHTML`, which resets the scroller, so opening a section
  1200px down threw you back to the header and closing it threw you back again.
  The class handles this interaction, `S.found` survives the next render.
- **THE WRAPPER PUT THE SECTION BACK IN THE LABEL COLUMN — trap 13, exactly as
  written.** The section's opt-out was §16's `.sec:has(> .all-desc)`, a DIRECT
  child. Wrapping the panel in `.found-b` moved that sentence one level down,
  the opt-out stopped matching, and at desktop the heading set on four lines at
  57px wide with the button hanging 172px past the section's right edge.
  Restated on `.found`, inside the same container query per trap 3.
- **`.found-t` has to carry `flex:1 1 auto`.** §24.13 gives it to `.sec-h > h2`
  — a direct child — and wrapping the `<h2>` in the toggle made it a grandchild.

Riding with it: `.prog-ic`, `.stat`'s 28px tinted chip on the three
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

### The head band is TWO COLUMNS — §56, `56-headband.css`

Figma 486:1084. The left column reads: the `<h1>`, the `&middot;` fact row under it, a
hairline, **the wing** — the status block, which is the journey row on the way in — a second
hairline, then what Tal says. The right column is the page's one dark card — `placeDark` still
moves it into the band, §56 gives it column two, and it stretches to the left column's height
with its content packed to the top and its actions on an `auto` margin at the foot.

Seven things worth knowing before touching it:

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
  one of the fifteen blocks (`LVL_CODES`, which `lead3.js`'s `LDR_RUNGS` is now an alias of),
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
- **Only `.plate`.** The other five members of `DARK_CARD` are not actions: `.cert` is an
  award, `.lvl-hero` a level, `.score` a table, `.ldr-read` a competency read. None of them
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
  — a Join that opened a *page*) and the Cohort page's own plate. **The leader's four Joins and
  the consultant call's are still dead** — the component takes them, nothing points at them yet.
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
  `captions`, `callEnd` — all pasted from `@material-design-icons/svg/filled`, per trap 7.
  `overflow` already IS `more_vert`, so More reuses it.
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
| `lead.js` | the data (`LEAD_COHORTS`, `LEAD_SESSIONS`, `LEAD_EVALS`, `LEADER`), `leadDash`, the sticky figure bar, the attention queue's search/filter |
| `lead2.js` | `leadCohorts`, `leadCohort`, `leadMember`, `leadReports`, the brief and note sheets, `LDR_SHEETS` |
| `lead3.js` | `leadSessions`, `leadEvals`, `leadEval`, `leadSum` — and the two signature flows |
| `lead4.js` | `leadMessages`, `leadCerts`, `leadProfile`, the profile and availability sheets |

Four rules the wireframe settled and this side keeps: **no money anywhere** (a cohort leader
volunteers — Certifications replaced Earnings, and there is no fee on any leader page); the
leader is measured on their candidates, not their throughput; **a flag is derived, never set**,
so it clears when the candidate comes back; and Cohort 41 is Maryam's, its ten members *are*
`COHORT` in `views.js`, and its board *is* `ROOM` — post on the leader side and it is there on
the candidate side.

Detail pages take their subject from `S.ldrCo` / `S.ldrMem` / `S.ldrEv` / `S.ldrSum`, set by a
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
3. **A container query is its own cascade tier.** A rule inside `@container app (min-width:900px)`
   beats an unconditional rule of equal weight regardless of layer order. Restate inside the
   tier (`25-modhead.css` §7 does this twice).
4. **`20-group.css`'s desktop rule carries ~13 classes.** It cannot be outweighed from a later
   layer — extend its `:not()` exclusion list instead. That list is where "which section pairs
   are already joined" is decided.
5. **`data-open` vs `data-shown` on `.app`.** `data-open` is a **one-render** transition marker
   that entrance animations gate on. `data-shown` is the persistent state. Layout must read
   `data-shown`; only motion may read `data-open`.
6. **Hover is deliberately disarmed.** `build.py` rewrites every `:hover` to
   `:hover:where(.__nh)` — 300-odd selectors; the build prints the count. Only the handful in
   `HOVER_KEEP` stay live. To keep a new one, add it there.
7. **The icon set is already official Material *filled*.** Checked against
   `material-design-icons/svg/filled`: `group`, `copy`, `wallet`, `creditCard`, `search`,
   `circle`, `circleDash`, `view`, `chat`, `document`, `chart`, `book`, `calendar`,
   `certificate` are byte-identical to the official filled cut. Material's filled cut is
   intrinsically hollow for many marks (filled `radio_button_unchecked` is a ring). Icons that
   look "linear" mostly are correct — do not blanket-fill them.
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

Open the built file over http (not `file://` — the browser blocks it) and sweep the matrix:

```bash
cd hifi && python3 -m http.server 8791 --bind 127.0.0.1
```

Then, in the page, loop `STAGES` × `NAVSETS[CFG[stage].nav]` (plus the sub-pages: `report`,
`result`, `agents`, `agent`, `booking`, `payment`, `chapter`, `ivt`, `mem`, `rp`, `account`)
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
