# TalentNext — DESIGN.md

**The baseline for all four portals.** Read this in full before any UI change on any of them.
Every value below is copied from the layer that states it, with the `file:line`, so it can be
re-derived and never retyped from memory. If a rule here and a reference screenshot disagree,
the rule wins unless Maryam says otherwise. **A new rule she gives is written HERE first, as one
line, in the same session — then implemented.** The argument behind each line is in
`docs/HISTORY.md` under the same § number; the primary source is the comment above the rule in
its `hifi/build/` layer.

## 1. The four portals

| Portal | File | On the design system | Rebuild |
|---|---|---|---|
| Candidate | `hifi/` (compiled from `hifi/build/`) | source of it | `cd hifi/build && python3 build.py` |
| Cohort Leader | `hifi/` — same renderer, `S.portal='leader'`, `lead*.js` | source of it | same |
| Talent Agent | `tn-agent-portal.html`, hand-written | yes — links `design-system/talentnext-ds.css` + `.js` | `cd design-system && python3 build-ds.py` |
| Super Admin | `tn-admin.html`, hand-written | **no** — own inline styles; rules apply by hand | edit the file |

Collisions: "candidate portal" = `hifi/` unless "wireframe"/"early prototype" is said; "agent"
in `hifi/` is somebody the candidate books, in `tn-agent-portal.html` it is the signed-in user.

## 2. Tokens

**Colour** — `hifi/build/01-foundation.css:145-164, 309-315`, `10-lattice.css:43`, `12-tone.css:13-14`, `70-ainative.css:169-262`

| Token | Value | Role |
|---|---|---|
| `--accent` | `#ff3733` | the brand red — fills, marks, the selected rail row. Solid, not a gradient |
| `--accent-2` | `#ee0500` | one step deeper — the black card's haze, hot strokes |
| `--accent-text` | `#c51c18` | the accent as INK (5.9:1) — never `--accent` for words except the stated exceptions |
| `--text-primary` / `-secondary` / `-helper` | `#111111` / `#525250` / `#666563` | body; every description and eyebrow; floor tier only (timestamps, legal, axes) |
| `--rule` | `#e9e9e9` | THE hairline. One value, every separator, every portal |
| `--surface-2` / `--surface-3` | `#f7f7f7` / `#fbfbfb` | the tinted panel / the page margin — two values, never merge them |
| `--gray-100` | `#111111` | the black card's ground; on it the inks are `--on-dark` / `--on-dark-2` |
| `--ai-1 / --ai-2 / --ai-3` | `#ff3733 / #ff9a96 / #ff3733` | Tal's text ramp (label, stars, `<b>` in summaries) |
| `--ai-line-2`, `--ai-line-alpha` | `#cce7cb`, 70% | the ask dock's border and comet — the LINE ramp, a different middle from the text ramp |
| `--star` | `#ffcb05` | the rating star, always, never the accent |

**Type** — `63-typography.css:140-236`; face `11-type.css:294` (**Plus Jakarta Sans**)

| Role | size / lh | Role | size / lh |
|---|---|---|---|
| `--t-display` | 34 / 40 — hero NUMERALS only | `--t-body` / `--t-compact` | 13.5 / 22 · 13.5 / 19 |
| `--t-h1` (≥900: 28) | 24 / 30 | `--t-label` / `--t-desc` | 12.5 / 17 |
| `--t-h2` | 20 / 26 | `--t-eyebrow` / `--t-caption` | 11.5 / 16 |
| `--t-h3` | 17 / 23 | `--t-sec` | **16 / 22 — every section heading, every width, every ground** |
| `--t-h4` | 14 / 19 | `--t-sec-lg` | 18 / 24 — one reader, `.dc-t` |

Weights: `--t-w-book` **400**, `--t-w-strong` **500**. Nothing else is loaded for a role.
§63 is the last layer: no layer after it may set a size, a weight, a `text-transform` or a text
colour. Take a role; if none fits, state the exception inside §63 §7.

**Space** — `01-foundation.css:389-390, 414, 435, 438`; `10-lattice.css:46`

`--s01..--s12` = 2 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96. Section padding `--s06`
top and bottom (48 between sections). `--sec-h-gap` 12 (heading → its content). `--sec-desc-gap` 8
(heading → its own description). `--radius` **0px**. `--label-col` 184px (the desktop label column).

## 3. Standing rules — the checklist

Type and case
- Two weights, 400 and 500. Never 600+. "No bold" means Medium. (§63, memory 4 Sep)
- Nothing is set in capitals except the card wordmarks. Words go in the markup in sentence case. (§63 §2)
- Buttons are Title Case, every word, by `text-transform:capitalize` on `.btn` — not by editing strings. (§63 §4b)
- Section heading is `--t-sec` 16px everywhere; `aiHead`'s title shares the token. (§63 §8b)
- Display size is hero numerals only; a level NAME is h2. (§63)

Colour and line
- One hairline, `--rule`. Panels `--surface-2`, page margin `--surface-3`. (§10, §12, §18)
- Never hardcode a hex; read the token. State colours are a SET and do not follow the accent: the journey's green/orange/grey, the rating star. (§63 §14, re-hue notes)
- The accent as ink is `--accent-text`; `--accent` on words is a stated exception (the selected rail label, `.jrn-pill`). (§63 §41)
- A field's line is `--rule` at rest and `#FF3733` at 2px on focus. (§12)
- All cards and containers have a white fill; grey only for intentional tracks and hover. (memory, admin)

Shape and rhythm
- Radius 0. Round things: marks/discs, `.agt-tag`, the `.tbl-flag` chip (literal `999px`), and a chat bubble's `16 16 4 16`. (§56, §31.6, §114, §115)
- Sections are 48 apart; heading to content 12; heading to description 8. (§10, §01)
- A mark is a bare 20px glyph in a named hue, no tinted chip — `.stat-ic`, `.qa-ic`, `.pulse-ic`, `.pf-sr`. (§29, §72)
- `.stat` and `.qa-c` are one shape: title `--t-h4`, content hangs from the top, the figure/arrow centred on the block's right. (§29, §70)
- Every photograph of a person is a disc; artwork (covers, badges, `.crt-art`) stays square. (§106)
- Icons are Material Symbols **Rounded, FILL 0**, pasted on the `0 -960 960 960` box; only four glyphs flip to FILL 1 to say a state (`star`, `checkFilled`, `stopFilled`, and their pairs). (trap 7)
- Cohort covers are one 9:5 rectangle, `object-fit:contain`. (§86)

Components
- "Make this a black card" means the WHOLE §75 recipe — inset by `--pad-x`, `--s07` inside, haze as `background-image`, the section's hairlines off, `.dc-hd` heading rule, ink flipped by token. Never `.plate` / `.sec.on-dark` in the page body (they get hoisted into the head band). (§75)
- Every heading with a sentence under it is `aiHead({title, desc, act})`; the actions centre on the pair. One Tal star per page. (§73)
- Head band: Tal's summary left, the one dark card or the journey right; full-width summary when there is no second column. (§56, §70)
- Module pages have no `<h1>` and no fact row; the page name is in the top bar; back is "← Back". (§78)
- A Join is shut (`disabled`, grey) until the call opens; the gate is on by default. (§81, `joinLive`)
- A disclosure's state is `S.disc` AND a DOM class; opening one must not reset the scroller. (§65)
- A row's arrow may carry a verb label (`.row-cta`) only when it is the one thing the page behind it is for. (§112)
- Confirm every delete and log-out in a modal before acting. (memory)
- Data over decorative charts: `.kv` rows and tables unless a proportion needs a chart. Admin-configurable numbers stay out of copy. (memory)

Data and copy
- Nothing is typed twice: read the record (`bkStamp`, `AGENTS[k].price`, `CH`, `PF`, `COHORT_LEAD`). (§76, `bkStamp`)
- No invented claims or data; authored placeholder copy is flagged in its source note (`CH_SYL`, `COURSE_NAME.E1`). (§74)
- A dead control on a live surface is worse than a missing one; a control that can never act is not drawn. (§60)
- Dates are `MM-DD-YYYY`; the course is `90 days`; the document is the `90-day summary`; a small count is spelt when it opens a sentence. (memory, ai6)

How to read an ask
- "Reuse X" = port X's declarations exactly and change only the dimension named; extras in the screenshot are the other surface's. (memory)
- A reference screenshot is structure inspiration, built in our components at the reference's proportions. A **third-party product** in a reference is embedded, never redrawn (Calendly). (§76)
- "This portal is a previous design" = port the current component generation wholesale (`/portal-sync`). (memory)
- Design arrives in corrections: act on the newest message, keep the old shape's argument in a note, do not ask which she meant. (memory)
- Artwork must be a file on disk; a pasted image cannot be embedded — name the folder and stems. (memory)
- **Responsive is part of done**: 390 / 744 / 1024 / 1280 in the same task. (memory 31 Aug)

## 4. Component recipe index — before inventing a class, open the gallery

`design-system/gallery.html` renders every component with its markup. The CSS is half of each;
the other half is below.

| Component | Gallery | The other half |
|---|---|---|
| Head band, Tal summary, journey `.jrn` | `#signature` | `placeBand` / `placePageSummary` in `hifi/`; a hand page emits `.modhead` itself; copy is `PAGESUM` |
| Typing summary | `#signature` (replay) | `dsTypeSummary(p, key)` in `talentnext-ds.js` |
| `aiHead` | `#signature` | `aiHead({mark, title, desc, act, extra})` — `.aih-mk` is NOT `.ai-label` |
| Black card `.dark-card` (+ `.crow-dark`, `.rec-dark`) | `#signature` | `.dc-hd > .dc-hd-r > .dc-t` + ONE of `.dc-act` / `.dc-when`; §63 §6a inks by token |
| Call row `crow(kind, o)` | `#rows` | record fields `img`/`cover`/`v`/`xl`; `o.gate`; `data-call`; `joinLive` |
| `.stat` figure cell, `.qa-c` quick action | `#figures` | `.stats` takes exactly four; `--mk` inline per cell |
| `.stps` steps row / `.stp-all` popup | `#signature` | `.stp-all` INSIDE `.stp-top`; words in `.stp-t-l`; `stepIcon` table copied per portal |
| Disclosure `.found` | `#signature` | `foundHead(title, key)`; `S.disc[key]` + DOM class |
| Accordion `.acc`, course outline | `#rows` | `S.outl`; the `data-outl` branch runs BEFORE the generic `.acc-h` one |
| `.plate` + quiet state | `#signature` | `data-when` attribute; `dsPlateQuiet(el)`; `.plate-h`/`.plate-when` emitted by hand |
| `.ring` | `#figures` | two SVG circles; `--arc` is a dasharray length `163.36 × pct/100` |
| Agents table `.agt` | `#tables` | rows are `subgrid`; `--agt-act-w` reserves the hover |
| Confirmation dialog `.conf` | `#signature` | `.modal > .sheet.conf`; `.conf-ok` for success |
| Account menu `.acct-t` | `#nav` | `acctMenu()`; `data-swap` (repaint) vs `data-doc`/`data-portal` (load) |
| `.row-cta`, `.rec-tag`, `.tbl-flag` chip | `#rows`, `#chips` | `<span>` never `<button>`; hue written inline as `--mk` |
| Cohort cover `.gcard-art` | `#rows` | `gcard(..., {src, i})`; label is the `onerror` fallback |

Three that bite: `.ai-label` needs `.bare` outside the JS-assembled band; `.plate` takes
`data-when` as an attribute; a new page needs a host with `container-type:inline-size;
container-name:app` or no breakpoint fires.

## 5. Copy and voice

- A page head has two slots: `ph(title, sub)` is the factual spine as a `·` row (or `title` alone), `PAGESUM` is Tal's reading — two sentences, 18–28 words, real figures, `<b>` on the actionable phrase.
- Four bans in a summary: no framing, no policy, no pointing at the UI, nothing from the other portal.
- Tal answers six subjects; anything else gets one of three refusals; Tal never reads the billing ledger. (`ai8.js`)
- Chip text and skills are sentence case; titles are Title Case; buttons capitalize by CSS.

## 6. Change protocol

1. Change the layer in `hifi/build/` that states the rule — never `talentnext-ds.css`, never the built portal HTML.
2. A NEW layer goes in `build.py` AND `build-ds.py`'s `LAYERS` (with a note), or `NOT_IN_DS` with a reason.
3. `cd hifi/build && python3 build.py` then `cd design-system && python3 build-ds.py`; read `layer coverage: N of M`.
4. `cd hifi && node respcheck.mjs --quick`; the agent portal follows by the rebuild; the admin portal is by hand.
5. Write `:hover` plain; arm it in `build.py`'s `HOVER_KEEP` by a narrow class.

## 7. Verification protocol

Sweep at 390 / 744 / 1024 / 1280 (`--edge` adds 899 / 900 / 940). Look for: horizontal overflow,
the label column live below 900, a heading past three lines in it, content escaping its section,
a button label on two lines, a divider still drawn after the columns stacked, `console.warn`.
Measure with the Browser pane OPEN (`window.innerWidth === 0` means nothing is measurable), with
motion off, using `offsetWidth`. `/design-check <portal>` runs the computed rule sweep.

## 8. Flagged, not fixed

E1 course name is a placeholder · `CH_SYL` is authored copy · the Calendly URL 404s · `V.welcome`
is reached by nothing · data-use clause 6 names switches Profile no longer holds · `reddemo`
previews the previous accent · `--ai-amber`, `.cert-btn` read by nothing · `tn-admin.html` and
`tn-portals.html` are not on the design system.
