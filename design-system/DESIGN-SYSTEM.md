# The TalentNext design system

The hi-fi candidate portal's design language, extracted so a new page can link it
and come out looking like that portal — same tokens, same components, same
desktop behaviour — with no design work to redo.

## Which file *is* the design system?

**`design-system/talentnext-ds.css`.** One file, 504 KB: every token, the reset,
the type scale, the app shell, every component the portal draws — including the
black plate, the progress ring, Tal's band and Tal's mark — motion, and the
responsive tiers. Linking it is what makes a page look like the portal.

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
| `gallery.html` | The reference: every component, live, with the markup that made it. **Start here** — and read **Signature** first, since those carry the look and their markup is fixed. |
| `proof.html` | Every signature component, hand-authored, with no portal JS — the check that the look really does travel. |
| `starter.html` | A working three-page portal skeleton to copy. |
| `build-ds.py` | The build. Regenerates the two generated files from `hifi/build/`. |
| `DESIGN-SYSTEM.md` | This file — the prose. The system itself is the CSS; this explains it. |

Open the gallery over http — a browser blocks a linked stylesheet on `file://`:

```bash
python3 -m http.server 8799 --bind 127.0.0.1
```

Then `http://127.0.0.1:8799/design-system/gallery.html`.

## Adding a new component so every portal can use it

**Nothing to do.** Build it as a layer in `hifi/build/` and rebuild — it is in
the design system. The policy is include-by-default: everything the portal
draws ships, except the short `EXCLUDE_PREFIXES` list.

### Why it works that way, because it used to work the other way

v1 of this script kept an allowlist and asked "does a *second* portal need this
word?". That test sounds right and produced the wrong artefact. The Talent Agent
portal is the proof: built entirely on the output, 127 classes used, only two
the stylesheet did not cover — and it still did not look like TalentNext, because
the allowlist had dropped every component that carries the brand:

| Dropped as "one surface's own" | What it actually is |
|---|---|
| `.plate*` | the black hero card — and with it §19's `.plate .btn-p`, the only reason the primary action inside it is the brand gradient instead of black |
| `.wkc*` `.ring*` | the week card, its progress ring, its tick list |
| `.ai-aura` `.ai-head` `.ai-body` `.ai-label` | the band Tal speaks from at the head of every page |
| `__TALCIRCLE__` | Tal's actual mark, dropped as "product artwork" — which is why Tal rendered as a hard orange square |
| `.tw-btn` | the other accent-filled CTA |
| `.cert*` `.lvl-hero` `.score*` `.aw*` | every remaining dark card and earned mark |

A page built from hairline sections, figure cells and list rows can be perfectly
correct and still read as a generic admin table, because none of the components
carrying the brand were in the box.

So the test is inverted. **Excluding a class costs a portal that does not look
like the product; including one nobody uses costs a single unused rule.** Those
are not the same size, and v1 priced them as though they were.

Excluded now, and only these — flows whose behaviour *is* a render pass over
portal state, plus three surfaces that are their own thing:

`ask*` `askdock` `askbar` `askfield` `askline` (Tal's full-page thread) ·
`bk*` `bkw` `sb-*` (booking inside it) · `scene*` (the scene picker) ·
`auth*` (the sign-up front door, plus 250 KB of artwork) ·
`lsvt*` `ios-*` (pictures of someone else's UI) · `nil*` (a separate microsite)

The build prints that list every time, so it is re-read rather than remembered.
`SYSTEM` still exists but no longer gates anything: it names the **core** — the
vocabulary guaranteed to work with no JS at all.

### The head-band gradient — one wrapper

The warm-to-green wash at the top of every module page is
`.app .modhead::before`: two radial gradients in `--tal-chip-2` (#f4fef6). It
looked JS-only because the portal *builds* the wrapper with a render pass
(`placeBand`), but the paint needs nothing but the wrapper:

```html
<div class="modhead">
  <div class="ph"> … </div>
  <section class="sec"> … Tal's band, a plate, whatever belongs with the head … </section>
</div>
```

It draws its own closing hairline (`::after`), so do not add one. `starter.html`
and `proof.html` both open with it, so the page you copy already has it.

### Spacing and padding — five rules

The tokens were always in the stylesheet; what was missing was them being
stated as rules to follow. All of these are in `gallery.html` → **Spacing**.

| | |
|---|---|
| Horizontal | Only `--pad-x` — 16 / 24 / 32 by tier |
| Vertical | `.sec` pays it for you: `--s06`, `--s07` from 900px |
| Gaps inside a component | Only `--s01` … `--s12` (2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96) |
| Column width | `--content-max`, centred by `.page` |
| Radius | `--radius` = 0, everywhere |

**`--pad-x` is the one to memorise.** Section padding, page headers, list rows,
cells, tabs and the head band all resolve to it, so the column has a single left
edge whatever is drawn in it. A page that hard-codes `padding-left:20px` is a
page whose rows no longer line up with their own headings — and that mismatch is
the most visible way a new portal stops looking like the others. `.sec` already
pays it; do not pay it twice.

### The markup is part of the component

Including the CSS is not sufficient, and this is the trap worth knowing. The
signature components have internal structure the CSS keys on, so guessing it
makes them look broken rather than absent. The first version of `proof.html`
invented the markup and got four of six wrong. The recipes are now in
`gallery.html` under **Signature**, taken from `views.js`:

- `.ai-label` **needs `.bare`** on a hand-authored page. Plain `.ai-label` only
  gets the mark inside the JS-assembled head band (§33 keys it on
  `.modhead .ai-aura.talsum`), so without it Tal is a hard orange square.
- `.plate` takes `data-when` as an **attribute**, not a child, and its children
  are ordered: `.plate-who`, `.plate-t`, `.plate-b`, `.plate-a`.
- `.ring` is **two SVG circles**, not a conic gradient, and `--arc` is a
  dasharray *length*: r=26, so `arc = 163.36 × pct/100`.
- A plate's fact list has **three forms and you pick one in the markup**. Plain
  `.plate-b` is a sentence. `.plate-b.plate-lines` is a spine of rows, each with
  a mark that says what kind of thing the row is about, and one of them may end
  in `<b class="plate-v">` for a figure on the right in the accent. Add
  **`.plate-tab`** when *every* row is a labelled figure — a price breakdown —
  and **write the rows with no icon**: §69 then rules the last row off as the
  total and §63 gives the accent to that row alone. In the portal
  `splitPlateBody` works all of this out from a `&middot;` run; a page with no
  render pass writes the class and the rows itself, the same way it already
  writes `.plate-h` and `.plate-when`.
- A **disclosure** (`.sec.tint.cards.found` + `.found-h` + `.found-b`) hides the
  panel and nothing else, so an `.all-desc` between the head row and the panel
  **stays visible while it is shut** — use it when the reader may not know what
  the block is about yet. The toggle must be the `<button class="found-t">`
  wrapping the chevron and the `<h2>`, because §65 moves `flex:1 1 auto` onto
  it; and the open/closed state has to live outside the DOM if your page
  re-renders (`.on` on the section is gone at the next paint).

- A **call row** (`.crow`) is the light answer to what `.plate` answers loudly,
  and it has **two states in one component**. `.crow` on its own is a call
  outside the day: a 182px grey countdown cell, a 78px square portrait, the name
  with its green tick, and two 185×40 buttons. Add **`.urgent`** and the
  countdown cell alone goes accent with the ink flipped — nothing else about the
  two differs, so never write a `.urgent` variant of another rule on this row.
  Three things the CSS will not tell you: the countdown cell is a **fixed** 182
  (as a minimum it takes its max-content and the caption stops wrapping to two
  centred lines), the portrait is **not `avatar()`** (that helper writes its size
  inline and draws a disc), and `.crow-who` carries **`flex:1 1 300px`** — that
  basis is the whole of how the row behaves, because flex decides wrapping on
  the base size before it shrinks anything. `dsCallUrgent(row)` picks the state
  from the words and `dsCallLeft(when)` words the same countdown both ways
  ("2 days left" / "In 2 hours").
- The **black card** is `.dark-card` on a `.sec`, and **adding the class is the
  whole conversion**. §75 states the ground, the top-right haze, the page-gutter
  inset, the 32px frame, the section's own hairlines off, the next section's
  join off, the heading row and its rule, the two button fills and the ink, so a
  caller writes only what is different about its own content — the leader
  portal's next interview wears `.dark-card crow-dark` and adds not one rule.
  The head is `.dc-hd` › `.dc-hd-r` › `.dc-t`, and that row takes **either** a
  `.dc-act` control **or** a `.dc-when` time at its right end, **never both**:
  they share one `margin-left:auto`, so two of them jam together with the row's
  slack in front of the pair. Four things the CSS will not tell you. The haze is
  a **`background-image`, not an element** — the portal's `.dark-glow` is a div
  a render pass appends, which then needs `position:relative`, `overflow:hidden`
  and a `z-index` on every child, so the card ships as one class with no pass
  behind it. The gap between the head and the content **belongs to the card**;
  it shipped missing for two builds because the first caller also wore
  `.sec-rec`, which brings its own `gap:20px`. A `disabled` `.btn-p` gets §81's
  unlit wash **and the gradient turned off** — the default disabled treatment is
  (0,2,0) against the card's accent fill at (0,4,0), so without it the button
  stays fully accent and unpressable, which reads as a broken page. And **never
  `.plate` or `.sec.on-dark`** — both are in the portal's `DARK_CARD` list, so a
  render pass hoists them into the head band; `.dark-card` is in no pass's list,
  which is the entire reason it exists. That is also why it needed its own ink:
  every generic on-dark rule in the build keys on the class it deliberately does
  not carry, so §63 §6a states the pair for `.dark-card` separately. Before that
  rule a converted section holding an ordinary `.kv` band drew its **values at
  1:1** — `#111` on `#111` — and its quiet button invisible.
- The head band's **second column** is `.sec.head-sec.head-col`, written
  **directly after `ph()`** — the collector walks a run, not a search — and
  `.head-col` is the class that opens the column at all. `.sec-jrn` (a numbered
  step list) and `.sec-prog` (a progress column) only say *which tenant*, and
  they take different track widths on purpose: labels compress, single words
  like "chapters" do not. A page that writes `.head-col` also gets its `<h1>`
  visually hidden and its dark card left in the body, so the greeting has to be
  in Tal's sentence.

`proof.html` is the check: every signature component, hand-written, with no
portal JS in the document at all. If it looks like the candidate portal, the
components really are in the stylesheet.

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

**The typing summary is the small case of this, and it was got wrong first.** §52
came into the box on the include-by-default policy and its clock stayed behind in
`ai6.js`, on the reasoning that a render loop does not port. True of a render
loop; false of this — the behaviour is twelve lines of clock over a paragraph the
calling page already owns, with no state shape and no hook, so it ports as a
plain function. The test is not "is there JS" but **"does the behaviour need the
portal's state, or only the element you hand it"**. `dsTypeSummary(p, key)` needs
only the element. Tal's thread needs `S.thread`, and still does not port.

The tell that something has fallen into this gap: a family of rules in the output
whose gate is a class **nothing in the box ever writes**. Grep the two files for
the class name — if only the stylesheet mentions it, the component is decoration.

## Why this is an extraction, not a rewrite

The portal's look is not a set of values you can restate. It is 38 CSS layers in
which later layers correct earlier ones **by name**, and the cascade order *is*
the architecture. A hand-written design system that re-declared the tokens and
re-drew the buttons would look right for a week and then drift, because the rules
that make the thing sit correctly at 900px live in §10, §14, §18, §20, §29 and
§37 — not in §01 and §02.

So `build-ds.py` walks the same layers in the same order as `hifi/build/build.py`
and keeps everything except the eight excluded families. **Every rule in the output is a real rule from
the real portal, in its real cascade position.** Nothing is re-typed.

The build enforces that: before it writes anything it checks that every
`(selector, declarations)` pair in the output appears identically in some source
layer, and fails the build if one does not. Everything dropped comes from the excluded
families — **the build prints the kept/dropped count and the surviving exclusion list every
run**, so read that rather than a number written down here, which goes stale every time a
layer is added.

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

## Typography — `63-typography.css`

The scale is stated once, in the **last** layer of both builds, and nothing may
be appended after it that sets a font size. It has to be last: §11 was written
to be the type authority and lost, not by being wrong but by being in the
middle — `.app .foo` in §15 beats `.app .foo` in §11 on order alone, so every
later layer that wanted a size took one.

A computed sweep of the portal before this layer went in — ten stages by 34
views, both portals, ~30,000 text elements — found **26 rendered font sizes**
against §11's stated nine, **160 distinct type signatures**, **five font
weights in a face that ships two**, **1283 elements set in uppercase**, and
**two greys used interchangeably** for the same job. The same sweep at 390,
760, 1000 and 1280 now returns **zero** off-ladder elements.

### The ladder — eight sizes, eleven roles

| Role | Class | Size / line | Weight | Tracking | Ink |
|---|---|---|---|---|---|
| Display | `.t-display` | 34 / 40 | 600 | −1px | primary |
| Heading 1 | `.t-h1` | 24 / 30 · **28 / 34 at ≥900** | 600 | −0.5px | primary |
| Heading 2 | `.t-h2` | 20 / 26 | 600 | −0.3px | primary |
| Heading 3 | `.t-h3` | 17 / 23 | 600 | −0.2px | primary |
| Heading 4 | `.t-h4` | 14 / 19 | 600 | −0.02px | primary |
| Body | `.t-body` | 13.5 / 22 | 400 | 0.1px | primary |
| Body compact | `.t-compact` | 13.5 / 19 | 400 | 0.1px | primary |
| Label | `.t-label` | 12.5 / 17 | 600 | 0.1px | primary |
| **Description** | `.t-desc` | 12.5 / 17 | 400 | 0.1px | **secondary** |
| Eyebrow | `.t-eyebrow` | 11.5 / 16 | 600 | 0.2px | **secondary** |
| Caption | `.t-caption` | 11.5 / 16 | 400 | 0.1px | helper |

**Display is for hero NUMERALS and nothing else.** A figure can be huge because
it carries no reading — you take "38%" in at a glance and the size is the
emphasis. A name is read as words, so it belongs in the heading ladder: set a
section's subject at 34/40 and it comes out larger than the page's own title,
which is the hierarchy inverted. The level name ("Explorer – E4") is **h2** for
exactly this reason, and it is the one thing the ladder demoted rather than
merely re-sized.

Three pairs share a size, and each pair is separated by weight, by ink or by
both: body/compact by line-height, label/description by weight **and** ink,
eyebrow/caption by weight **and** ink. That is deliberate. A scale with 11px
and 11.5px as separate steps is not a scale — it is two sizes nobody can tell
apart, and that is what the sweep found. **Eight sizes that are each visibly
different is worth more than eleven that are not.**

`.t-heading-01`…`-05`, `.u-h1`…`.u-caption` and `.u-overline` are kept as
aliases onto the same rules, because both portals and the gallery already use
them. They are aliases, not a second scale — `-01` is h1, `-02` is h3, `-03`
and `-04` are h4, `-05` is the eyebrow. That ambiguity (`-02` meant 17px in
§11 and 20px in §01) is what the pinning ends.

### Two weights, because the face has two

Söhne is embedded at **400 (Buch)** and **600 (Kräftig)** and at nothing else.
Measured: a 40px string is 280.9px wide at both 400 and 500, and 282.9px at
600, 700 and 800. So `font-weight:500` renders as Buch and 700/800 render as
Kräftig — they are not a hierarchy, they are three weights that never existed.

- **400** — all prose, all descriptions
- **600** — all headings, labels, eyebrows and buttons
- **500 / 700 / 800** — write these and you get a declaration that does not do
  what it says. Use `var(--t-w-book)` / `var(--t-w-strong)`.

This reverses the earlier one-weight instruction, and deliberately. §11's note
records the original rule: hierarchy carried by *size, colour, case and
position — not weight*. Case is now gone (below), and size alone was never
carrying it — 13.5px covers 13,451 elements across both prose roles.
Confirmed with Maryam, 28 Aug 2026.

### Nothing is set in capitals

66 rules across 18 layers declared `text-transform:uppercase`. All of them are
off. The eyebrow keeps its slot, its weight and its position and gives up its
case and most of its tracking — 0.8px was there to open up capitals and reads
as a gap at sentence case.

Every string behind those rules was checked before the change: all of them were
already written in sentence case in the view ("Quiz score", "Card number",
"Wed", "Next step", "Scene 1 · from 02:14"), so this is presentational and
needed no copy edit. **Write your strings in sentence case** — no stylesheet
can un-shout a word that was typed shouting.

The only capitals left in the product are the card wordmarks — VISA, AMEX,
DISCOVER — which are registered marks drawn as artwork inside a card graphic.
Setting those in sentence case does not make the payment row more readable; it
makes the card look counterfeit.

### Ink is decided by role, not per component

This is the half that was least consistent before. `.sub` and `.ag-m` took
secondary; `.chev-d` and `.aw-d` took helper; nothing said which was right.

| Token | Value | Used for |
|---|---|---|
| `--text-primary` | `#111111` | headings, values, body prose |
| `--text-secondary` | `#525250` | **every** description, supporting line and eyebrow |
| `--text-helper` | `#666563` | the floor tier only — timestamps, legal, chart axes, captions |
| `--on-dark` | `#ffffff` | primary, inverted |
| `--on-dark-2` | `#c7c6c3` | secondary **and** helper, inverted |

A dark ground has two inks, not three. Write against the `--on-dark*` tokens
rather than against white, so §59's quiet plate — which re-points those three
tokens rather than restating rules — keeps working.

### Taking a role

```html
<p class="t-desc">Signed by Priya Nair</p>
```

```css
.my-thing{
  font-size:var(--t-h3-size); line-height:var(--t-h3-lh);
  font-weight:var(--t-w-strong); letter-spacing:var(--t-h3-ls);
}
```

Both are the same numbers. Use the class on an element; use the tokens when you
are styling a component of your own and want it to move with the system. Every
role has `--t-<role>-size`, `-lh` and `-ls`.

**The host requirement applies here too.** §63 scopes every rule to `.app`, so
a page without an `.app` ancestor gets browser defaults and none of this.

### What sits outside the ladder — a closed list

Each is a glyph fitted to a box rather than a word in a column, so a ladder step
would either overflow the box or leave it half empty:

- **Avatar initials** — sized from JS. `avatar()` writes `font-size:size/3`
  inline (trap 1), because the caller chooses the diameter.
- **Badges and pips** — 10px, a count inside a dot.
- **OTP digits** — 18px, one character per field.
- **Card wordmarks** — artwork, above.
- **The iOS status bar** — Apple's typography in a picture of Apple's UI.
  `ios-*` is excluded from this box entirely.

### Two traps this layer had to answer, and you will hit both

1. **Specificity beats order.** §2 and §3 of the layer are written at
   `.app .foo` (0,2,0). Twenty-odd rules in the build are 0,3,0 or 0,4,0 —
   `.app .ach .ach-t`, `.app .nrow:not(.un) .nrow-t`, `.app .tal-sugg
   .chip-tal` — and landing last does not reach them. §7b restates each at its
   own weight. They were found by sweeping the rendered DOM and reading back
   the winning selector; a grep cannot tell you which of four matching rules
   won.
2. **A container query is its own cascade tier** (trap 3). §3 cleaned the whole
   product at 390 and 760 and left 1280 holding four sizes it does not have,
   because the section heading, the page lead and two eyebrows are resized
   inside `@container app (min-width:900px)`. §8b restates them at the same
   width. **Sweep at more than one width, or you will call this finished when
   it is not.**

At ≥900 a `.sec` with a `.sec-h` becomes a 184px label column and its heading
is a *spine*, so it takes the **label** role rather than h4 — and the four
headings that carry an action, a link or a day strip stay at **h4**. Two tiers,
both on the ladder, and the distinction survives.

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

**And a page is not finished until it has been read at more than one of them.**
The standing rule for this project (Maryam, 31 Aug 2026) is that anything built at
desktop has to work on mobile and tablet in the same task — see *Verifying a change*
in the root `CLAUDE.md`. Two things worth knowing here specifically:

- **The band just above 900 is where failures hide.** Both bugs found on the day
  the rule was written lived between 900 and 1100 — a landscape tablet, or a
  half-width desktop window — and were correct at 390 and at 1280. Sweep **390,
  744, 900, 940, 1024 and 1280**, not two widths.
- **`hifi/respcheck.mjs` measures the portal, not a page built on this folder.**
  It drives the built portal's own view registry, so it cannot sweep your page.
  What it checks is the list to check by hand: horizontal overflow, the label
  column live below 900, a heading wrapping past three lines inside it, content
  escaping its section, a button label on two lines, and a vertical divider still
  drawn after the columns stacked.

### 2. The label column is keyed on what the section contains

At 900px and up, a `.sec` with a `.sec-h` splits into a 184px heading column and
a content column, divided by a vertical rule. That is the desktop reading pattern
and you get it for free.

It opts **out** automatically when the section holds `.stats`, `.facts`,
`.tbl-wrap`, `.cardrow`, `.gcard` or `.tile-stack` — those components are sized
against the full column width. Build sections out of those six and the spine is
free. `.ch`, `.ag`, `.aw` and `.mem` are on the list too, and §69 adds one more:
a `.tile` whose first child is a **`.row-lead`** — the face-plus-name row that
says "this block is about a person". A card whose subject is one person is a
single object, so 184px taken off it buys nothing; there is no second row for
the spine to line up against.

**The trap runs in both directions.** Adding a wrapper can move a section's
opt-out out of reach (§65.1a: `.found-b` pushed an `.all-desc` one level down
and `> .all-desc` stopped matching). *Removing content* can take the opt-out
away with it — the cohort-leader card was opting out through `.sec:has(.kv)`
because of two fact rows, and cutting those rows dropped the section into the
label column with nothing to warn you. Whenever you add or remove a block inside
a headed section, check what it still contains.

`.kv` opts out too, and for a different reason: **a `.kv` list already *is* a
label column.** At this same 900px breakpoint `.kv` takes
`grid-template-columns:var(--label-col) minmax(0,1fr)` — the identical 184px
token — so a kv band under a heading drew the spine twice and pushed the value
416px in from the page edge. So a headed kv section stacks: heading on top, keys
and values below, one spine. The reach is by descendant (`.sec:has(.kv)`) because
the band is always wrapped — a `.tile`, or a bare `div` — and it excludes
`:has(.chart-table)`, where `.kv` is borrowed for a chart's data table and the
section keeps its column.

**A `.kv` row's divider is its own `border-bottom`, and it must stay that way.**
§18 draws every *list* row's hairline as an inset `::after` instead, because
those rows (`.ch`, `.cardrow`, `.mem`, `.nrow`, `.ag`, …) bleed to the rails and
take the gutter back as their own padding, so the line has to pay the same
gutter the words pay. `.kv` is the one row type that never bleeds — whatever
holds it has already paid the gutter and its own padding is `12px 0` — so it is
deliberately **off** that list. Put it back, or add a `.kv::after` inset in a
later layer, and the hairline comes out 32px short at both ends, indented from
the label above it. The single exception is `.kv-bands`, which does bleed
(§15.34 pulls the wrapper out by `--pad-x` and gives each row it back), and that
is the selector §18 carries.

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
dsTypeSummary(p, key)   // Tal's summary writes itself — see below
dsPlateQuiet(plate)     // a dark card's two priorities
dsCallUrgent(row)       // a call row's two priorities — see below
dsCallLeft(when)        // "in 2 days" -> "2 days left" / "In 2 hours"
```

The icon set is **Material Symbols, the Rounded style at FILL 0** — Google's
current library, linear, with rounded terminals. Every mark is the official
Rounded outlined file from `google/material-design-icons`, pasted rather than
drawn, so the set is one optical family. Do not mix a filled mark into it: the
cut this replaced was filled, and what made it work was holding ONE cut, not
which cut it was.

**Four marks are filled, and fill is a STATE axis rather than a style** — which
is Google's own definition of it. The set sits at FILL 0 and flips to 1 to say
"this one is on": `star` / `starOutline` (a rating's lit and unlit slots),
`checkFilled` (done, against `checkOutline`'s not-done) and `stopFilled` (a
solid dot). The test for adding a fifth is whether the **same glyph also appears
unfilled** and the difference is the information. `trophy`, `certificate` and
`shield` fail it — they are subject marks and never appear both ways.

**The viewBox is `0 -960 960 960`, not `0 0 24 24`.** Material Symbols are drawn
forty times larger than Material Icons, with the baseline at y=0 and the glyph
above it in negative y. `I.name` states this for you; if you wrap `inner('name')`
in an `<svg>` of your own you must state it too, or the mark renders as an
invisible speck in the top-left corner — nothing throws.

The two brand marks keep their own boxes: `TN_MARK` is `0 0 194.28 194.28` and
`CHEV` is a bare 24-grid path you supply a `0 0 24 24` box for.

### Tal's summary types itself — `dsTypeSummary(p, key)`

The summary is the one line on a page that is **written rather than stored** —
assembled from state at the moment you arrive. Printed whole it reads as a caption
that was always there; typed, it reads as something being said to you now. Call it
once, last, at the end of your render:

```js
dsTypeSummary(app.querySelector('.modhead .ai-body p'), S.view);
```

Both halves ship — §52 is the layout, `dsTypeSummary` is the clock. **This is the
worked example of "Stateful widgets need more than a prefix" above**: for one build
only the CSS was here, and three rules gated on a class that only a clock ever
stamps are three rules nothing in the box can switch on.

Five things about it, and none is guessable from the CSS:

- **The paragraph is drawn twice.** `.tsum-g` is the finished line at
  `visibility:hidden`, holding the final box open; `.tsum-t` is the visible copy
  laid over it. A typewriter that grows its own box shoves the whole page down
  mid-read — this is the part worth copying rather than reinventing.
- **`<span class="tal-greet">` does not type.** §33.9 hides the page's `.ph` when a
  greeting is present, so the greeting *is* that page's title, and a title that
  types itself in is a louder effect than a sentence that does.
- **The key is "which page, and which words".** You pass the page — a view name,
  plus whatever identifies the subject on a detail page. The helper appends the
  paragraph's text, so the line re-types when the page changes *or* when the
  reading does, and prints instantly on every other re-render.
- **Pass `null` on a page with no summary.** That is not a no-op: it is how the
  next arrival is recognised as one. Without it, leaving a page and coming back
  returns to an unchanged key and nothing types.
- **The pace is one number.** `DS_SUM_MS` is a budget for the whole line, not a
  rate, so a long summary and a short one finish together. Under
  `prefers-reduced-motion` the line prints whole, immediately.

It uses `setTimeout` rather than `requestAnimationFrame` on purpose: **a hidden
document gets no frames at all**, so an rAF version leaves the summary blank
indefinitely in any tab that was not at the front when the page loaded. Each tick
derives what to show from elapsed time, so a throttled tick just arrives with more
to reveal.

`gallery.html` has it live under **Signature**, with a button to replay it.

### An appointment has two priorities — `dsPlateQuiet` / `dsCallUrgent`

Black plus the warm haze is the loudest object this system draws, and it is
spent on something **time-sensitive**. Outside twenty-four hours the same card
is quiet. There are two components that carry an appointment and they take the
decision the same way, from opposite defaults:

```js
app.querySelectorAll('.plate').forEach(dsPlateQuiet);  // adds .plate-quiet when NOT urgent
app.querySelectorAll('.crow').forEach(dsCallUrgent);   // adds .urgent when it IS
```

Both read the same vocabulary of inside-the-day — *now, today, tonight,
starting*, or a count of hours or minutes — off the words the card already
carries, because in a prototype every appointment is a hand-written string.
`data-urgent="1"` / `="0"` overrides the reading. Swap either function for a
date difference in a real build and nothing else changes: **the class is the
contract**.

They ship for the reason `dsTypeSummary` does. The test is not "is there JS" but
*does the behaviour need the page's state, or only the element you hand it* —
and these need only the element. `dsCallLeft(when)` is the other half of the
call row: the two states word one countdown two ways, a quantity you have
outside the day and a time it happens at inside it, so a page states its
countdown once and gets the right phrasing for whichever cell it draws.

## Rendering

The design system has no opinion about how you build the DOM, but `starter.html`
uses the portal's own shape — one state object, one view registry, one `render()`
that reprints the frame — because it has a consequence worth inheriting: **no
component may keep state in the DOM.** A class a click handler adds is gone on
the next render, so anything interactive has to be a pure function of state. That
constraint is what keeps a growing prototype honest.
