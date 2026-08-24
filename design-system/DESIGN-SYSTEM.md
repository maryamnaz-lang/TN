# The TalentNext design system

The hi-fi candidate portal's design language, extracted so a new page can link it
and come out looking like that portal — same tokens, same components, same
desktop behaviour — with no design work to redo.

## Which file *is* the design system?

**`design-system/talentnext-ds.css`.** One file, 254 KB: every token, the reset,
the type scale, the app shell, all components, motion and the responsive tiers.
Linking it is what makes a page look like the portal.

```html
<link rel="stylesheet" href="design-system/talentnext-ds.css">
```

A second file is **optional** and carries the icon set only — take it if you want
`I.calendar` or `inner('calendar')`:

```html
<script src="design-system/talentnext-ds.js"></script>
```

That is the whole dependency. The four font faces are base64-embedded in the
stylesheet, so there are no font paths to get wrong and nothing reaches the
network.

### But that file is build output, so don't edit it

The design system *lives* in `hifi/build/*.css` — the portal's 38 numbered
layers. `talentnext-ds.css` is **generated** from them, the same way
`hifi/talentnext-candidate-portal-v24.html` is. Two artefacts, one source.

| Where | What |
|---|---|
| `hifi/build/*.css` | **The source of truth.** 38 layers, each rule carrying its reasoning as a comment. Edit here. |
| `design-system/talentnext-ds.css` | **Generated.** The linkable artefact. Never hand-edit — the next build overwrites it. |

```bash
cd design-system && python3 build-ds.py
```

## The rest of this folder

None of these are the design system; they are how you use and rebuild it.

| File | What it is |
|---|---|
| `gallery.html` | The reference: every component, live, with the markup that made it. **Start here** — it is the place to find a class rather than invent one. |
| `starter.html` | A working three-page portal skeleton to copy. |
| `build-ds.py` | The build. Regenerates the two generated files from `hifi/build/`. |
| `DESIGN-SYSTEM.md` | This file — the prose. The system itself is the CSS; this explains it. |

Open the gallery over http — a browser blocks a linked stylesheet on `file://`:

```bash
python3 -m http.server 8799 --bind 127.0.0.1
```

Then `http://127.0.0.1:8799/design-system/gallery.html`.

## Adding a new component so every portal can use it

Build it as a layer in `hifi/build/` as usual, with a class prefix no earlier
layer mentions. Then add that prefix to the `SYSTEM` set in `build-ds.py` and
rebuild. It is now in the design system and available to every portal.

**Nothing is shared by accident, and nothing is dropped silently.** Anything not
in `SYSTEM` is excluded — correct for one screen's own vocabulary, wrong for a
component another portal will want — so the build ends with an **unclassified
report**: every class name that is in neither `SYSTEM` nor `PRODUCT_PREFIXES`,
listed with the layer it came from.

```
UNCLASSIFIED — 2 class name(s) are in neither SYSTEM nor PRODUCT_PREFIXES,
so they were DROPPED by default. Decide each: shared (add to SYSTEM) or
product (add its prefix to PRODUCT_PREFIXES).

  39-gauge.css             .gauge .gauge-track
```

Two ways to clear an entry, and both record the decision in the file rather than
in someone's memory of a conversation:

- **shared** → add the name to `SYSTEM`, rebuild, it ships in the design system
- **product** → add its prefix to `PRODUCT_PREFIXES` and it stops asking

The baseline is **zero**, which is what makes a new name visible. Short or
ambiguous names are matched exactly rather than by prefix, so a new `.bandroll`
is not silently classified as product just because a legacy `.b` exists.

### The funnel — `funnel.py`

Deciding "is this a new component?" on every change is a tax on whatever you
were actually doing, so the question is batched instead. `funnel.py` answers it
in one shot and stays quiet when the answer is no:

```bash
cd design-system && python3 funnel.py
```

It reports three things, in order of how much it costs to miss them:

1. **A layer on disk that `build-ds.py` does not read.** The worst one and
   completely silent — add `39-gauge.css` to `build.py`'s list, forget
   `build-ds.py`'s, and the design system never sees it. No warning anywhere,
   because from `build-ds.py`'s side the file does not exist.
2. **Unclassified class names**, with a rule count and their child classes, so
   a real component (`.gauge` with four `.gauge-*` children) is distinguishable
   from a one-off leaf at a glance.
3. **Layers edited since the last review**, because a rule changed inside an
   existing class will never show up as a new name but can still move a shared
   component.

State lives in `.funnel-state.json`, so a "that one is product" answer is not
re-asked. After deciding, record the baseline:

```bash
python3 funnel.py --accept-all    # then rebuild if anything moved into SYSTEM
```

`--quiet` prints nothing when there is nothing new and exits 0 / 1, which is
what a timer or a hook should call.

### Stateful widgets need more than a prefix

The design system is CSS plus icons. A component whose behaviour lives in a
render pass — Tal's thread is the real example, where `placeAsk` rebuilds the
whole thing from `S.thread` on every paint and nothing may keep state in the DOM
— does not port by widening the allowlist. Its *shell* does (bubbles, composer,
chips, the mark: pure CSS, cheap to add); its *flow* needs the render loop, so
sharing it means shipping a third generated file with a documented contract —
a render hook and a state shape. Worth deciding before building, not after.

## Why this is an extraction, not a rewrite

The portal's look is not a set of values you can restate. It is 38 CSS layers in
which later layers correct earlier ones **by name**, and the cascade order *is*
the architecture. A hand-written design system that re-declared the tokens and
re-drew the buttons would look right for a week and then drift, because the rules
that make the thing sit correctly at 900px live in §10, §14, §18, §20, §29 and
§37 — not in §01 and §02.

So `build-ds.py` walks the same layers in the same order as `hifi/build/build.py`
and keeps the rules belonging to the shared vocabulary, dropping the rules
belonging to one product surface. **Every rule in the output is a real rule from
the real portal, in its real cascade position.** Nothing is re-typed.

The build enforces that: before it writes anything it checks that every
`(selector, declarations)` pair in the output appears identically in some source
layer, and fails the build if one does not. 1313 rules kept, 2243 dropped as
product-specific.

### To change the design system

Change the layer in `hifi/build/` that states the rule — the reasoning for every
rule lives there as a comment, which is this project's convention — then:

```bash
cd design-system && python3 build-ds.py
```

Do not edit `talentnext-ds.css`. The next build overwrites it.

Note that this changes the **portal** too, since that is where the rule lives.
That is the intended coupling: one design language, one source.

## What came across, and what did not

**In:** the app shell (bar, rail, drawer, scrim, scrolling main), the page and
section system, the desktop label column, type scale, all tokens, buttons, links,
every form control, the list-row family, figure cells, facts, key/value, tables,
progress, steppers, tabs, segmented controls, accordions, chips, badges, notes,
empty states, modals and sheets, avatars, motion, and the icon set.

**Out:** Tal and its thread, the course player, levels and points, the agent and
booking flows, the auth card, the Cohort Leader's pages, the Next in Leadership
run-up, messaging, the payment pages, and the module head band. Those are one
product surface's own vocabulary, and most of them depend on the portal's
`views.js` DOM to work at all. `build-ds.py` lists them by name.

## The five things to know before building a page

### 1. The host is not optional

Nothing in this system responds to the browser window. Every breakpoint is
`@container app (min-width: …)`, so it resolves against a container you provide.

```css
.host{
  position:relative; width:100%; height:100dvh;
  container-type:inline-size; container-name:app;
  overflow:hidden; background:var(--background);
}
```

```html
<div class="host"><div class="app"> … </div></div>
```

`.app` is `position:absolute; inset:0`, so the host must be positioned and have a
height. Leave `container-type` off and the page renders its phone layout at every
width. `dsFrame(el)` does the same thing from JS.

The tiers: **600px** (gutter 24, sheets centre), **900px** (permanent icon rail,
label column), **1200px** (rail 280, gutter 32).

### 2. The label column is keyed on what the section contains

At 900px and up, a `.sec` with a `.sec-h` splits into a 184px heading column and
a content column, divided by a vertical rule. That is the desktop reading pattern
and you get it for free.

It opts **out** automatically when the section holds `.stats`, `.facts`,
`.tbl-wrap`, `.cardrow`, `.gcard` or `.tile-stack` — those components are sized
against the full column width. Build sections out of those six and the spine is
free.

Invent your own wrapper and the heading keeps its 184px while your content is
laid out against a width 184px narrower than it expects. The two collide. If you
genuinely need a new wrapper, restate the opt-out **inside the same container
query** — a container query is its own cascade tier and cannot be beaten from
outside one:

```css
@container app (min-width:900px){
  .sec:has(> .my-list){display:block;
    padding-left:var(--pad-x); padding-right:var(--pad-x)}
  .sec:has(> .my-list) > .sec-h{
    border-right:0; min-height:0; margin-bottom:var(--s05); padding:0}
}
```

And keep `.sec-h` headings to **three words**. 184px is two lines.

### 3. `.stats` takes four cells; `.facts` only fills a row it does not wrap

Both draw their hairlines as a 1px grid **gap**, with the rule colour showing
through from the container's own background. Nothing paints an empty cell, so an
incomplete row shows as a grey block rather than closing up.

Both also span an odd last cell across its row, which fills it:

```css
.stats > .stat:last-child:nth-child(odd){grid-column:1 / -1}
.facts > div:last-child:nth-child(odd){grid-column:1 / -1}
```

- **`.stats` has a fixed column count** — 2 on a phone, 4 from 700px — so a
  spare track can never collapse. **Give it exactly four**, which fills both
  tiers (4 across, or 2 + 2). Three is the case to avoid: the last cell spans
  row 2 and the two slots beside the first pair stay grey.
- **`.facts` is `auto-fit` at `minmax(140px,1fr)`**, so the column count is
  `floor(width / 140)` and spare tracks *do* collapse. A band whose cells all
  fit on one row therefore always fills, at any width. Cells that **wrap** do
  not: row 2 keeps the full column count and its empty slots paint grey. Four
  cells are right for a full-width band and wrap to 3 + 1 in a band of roughly
  420–560px.

**For three items, or for a band that has to hold at every width, use `.kv`** —
a hairline list, safe at any size, and what this README's own tables would be.

Measured across five widths and every view, the portal is clean except at a
container width near 900px, where its four-cell `.facts` blocks get three
columns and the fourth cell wraps, leaving two grey slots. That is pre-existing
and inherited rather than introduced by the extraction; it affects the candidate
interview page and six Cohort Leader pages. Worth a look if 900px matters.

### 4. Hover is deliberately disarmed

`build.py` rewrites every `:hover` to `:hover:where(.__nh)` — a class that never
appears in the DOM — so the rule never matches. The reason: a wash on a
borderless row reads as a box that was not there a moment ago, and on a page made
of hairlines that is one more edge than the page has. Five are left live by name:
the rail item, the primary button, the rail corner, the leader's figure cells and
the portal switch.

`build-ds.py` applies the same rewrite, so a page built on the design system
feels like the portal. To build with the state layers live:

```bash
DS_ARM_HOVER=1 python3 build-ds.py
```

`:focus-visible` is untouched — it is how the keyboard sees the page.

### 5. Two motion rules that bite

- **Never state a resting style with `opacity`.** Entrance animations run with
  `fill-mode:both`, so a played animation's final keyframe keeps applying and
  beats a normal declaration. Put the weight in `background-color`.
- **Never measure geometry in the same tick as a state change.** The entrances
  translate and scale, and the rail's width transitions over 240ms, so a
  `getBoundingClientRect` read straight after a render can be off by orders of
  magnitude. Wait for the animation or kill it.

`data-enter` and `data-open` are one-render motion cues; only motion may read
them. `data-rail` and `.on` are the persistent state that layout reads.

## The JS half

```js
I.calendar        // a whole <svg>, ready to drop in
inner('calendar') // just the <path>, for an svg you give your own class
TN_MARK           // the TalentNext lockup
CHEV              // the brand chevron, as a path string
Object.keys(IP)   // all 75 icon names

dsFrame(el)       // stamp the container the layout queries
dsEnter(app)      // fire the entrance once, then clear the marker
dsStagger(page)   // stamp --i on each child for the 26ms cascade
```

The icon set is the official Material **filled** cut, checked against
`@material-design-icons/svg/filled`. Several marks look linear and are correct:
the filled cut is intrinsically hollow for a ring or a tick. Do not blanket-fill
them.

## Rendering

The design system has no opinion about how you build the DOM, but `starter.html`
uses the portal's own shape — one state object, one view registry, one `render()`
that reprints the frame — because it has a consequence worth inheriting: **no
component may keep state in the DOM.** A class a click handler adds is gone on
the next render, so anything interactive has to be a pure function of state. That
constraint is what keeps a growing prototype honest.
