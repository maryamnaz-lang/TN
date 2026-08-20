# TalentNext prototypes

**The active work is `hifi/` — the high-fidelity candidate portal.** Everything else in this
repo is an earlier generation. Three generations of the same product live side by side, so
check this table before editing anything.

| File | What it is | Status |
|---|---|---|
| `hifi/` | High-fidelity candidate portal, **compiled** from `hifi/build/` | **ACTIVE — work here** |
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

Same trap for "the wireframes": that is `talentnext-wireframes.html`, a frozen reference. It
is not a thing to update when the hi-fi design changes; the two are not kept in sync.

The frozen files are still worth *reading* — they are where an intent or a flow decision was
first recorded. Read them freely; just do not edit them without being asked.

## Hand-written prototypes — `tn-portals.html`, `tn-admin.html`

Single self-contained files, edited directly. `tn-portals.html` is ~2.4 MB; expect large
files and search rather than read end-to-end.

## The hi-fi candidate portal — `hifi/` — IS COMPILED

`hifi/talentnext-candidate-portal-v24.html` is **build output**. Never hand-edit it: the
next build overwrites it, and it carries no comments (the build strips ~250 KB of prose).

The real source is `hifi/build/`:

- **32 numbered CSS layers**, `01-foundation.css` → `32-week.css`, concatenated in
  the exact order listed in `build.py`. Cascade order *is* the architecture — later layers
  patch earlier ones by name. The last three (`30-nil`, `31-lead`, `32-week`) are there
  because everything in them is a class no earlier layer mentions; `build.py` records why
  each one sits where it does.
- **10 JS layers**: `icons.js` → `data.js` → `views.js` → `ai.js` … `ai5.js` → `nil.js`
  → `lead.js`. Order matters.
- Fonts, the Tal mark, auth artwork and 8 award WebPs, all base64-embedded at build time.

The loop:

```bash
cd hifi/build && python3 build.py
```

**Every rule carries its reasoning in the source.** That is this project's convention: read
the comment above a rule before changing it — several of them record a decision that looks
like a bug and isn't. Keep writing them that way.

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
   `:hover:where(.__nh)` — 294 selectors. Only `sn-item`, `btn-p`, `tal-fab`, `tal-star` stay
   live. To keep a new one, add it to `HOVER_KEEP` in `build.py`.
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

### Verifying a change

Open the built file over http (not `file://` — the browser blocks it) and sweep the matrix:

```bash
cd hifi && python3 -m http.server 8791 --bind 127.0.0.1
```

Then, in the page, loop `STAGES` × `NAVSETS[CFG[stage].nav]` calling `setStage` / `render` —
55 stage×view combinations, all of which must render without error. Disable motion
(`animation:none!important`) before measuring geometry, or trap 2 will confuse the numbers.

`hifi/verify.mjs` and `hifi/audit.mjs` are Playwright sweeps (render, overflow at 9 widths,
WCAG AA contrast, token discipline) but hardcode `executablePath: '/opt/pw-browsers/chromium'`,
which does not exist on macOS — patch that before running them.

`hifi/build/patch.py`, `hifi/build/extract.py` and `hifi/build/views-orig.js` are historical
one-shot migration artefacts. Not part of the build; `extract.py` can no longer run.

## Deploying

Vercel serves this repo statically — **there is no build step**, so `hifi/talentnext-candidate-portal-v24.html`
must stay committed. `vercel.json` serves `tn-portals.html` at `/` and the hi-fi portal at
`/candidate`. Pushing any branch other than `main` gives a preview URL and leaves production
alone.
