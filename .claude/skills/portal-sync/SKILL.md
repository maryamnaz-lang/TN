---
name: portal-sync
description: Bring a TalentNext portal onto the current component generation — inventory the classes it writes against what the design system ships, port each stale component to the gallery recipe, rebuild and sweep. Use when asked to make a portal consistent with the candidate/cohort-leader portals.
---

# /portal-sync <portal>

Markup does not propagate by rebuild. CSS does (every portal on `design-system/` takes a token or
layer change from `build-ds.py`), but a portal keeps writing an older component's classes until
somebody ports it. This is that port, as one procedure, so it is never re-explained.

`<portal>` is `agent` (`tn-agent-portal.html`), `admin` (`tn-admin.html`), or a path. For
`candidate` / `leader` there is no markup to port — both render from `hifi/`'s one `render()` —
so run step 4 only.

## 1. Read the baseline

`DESIGN.md` is already imported. Re-read §3 (the checklist) and §4 (the recipe index), and open
`design-system/gallery.html` for any recipe you will port.

## 2. Diff the components, screen by screen

```bash
node hifi/compdiff.mjs --target=tn-agent-portal.html
```

It prints, for a set of reference screens on hifi and the same number on the target, the
SHELL line (which named components the `.app` contains — dock, `.ai-run` light, trail, account
menu, band members, dark card, quick actions, disclosures, strips) and each `.page` child with
the components inside it. **Read the two blocks across**: every component a hifi screen has that
the target's equivalent lacks, or draws in an older shape, is a port. Pass `--ref=` / `--screens=`
to pick screens (`portal/stage/view` for hifi, `stage/view` for a stage-driven target).

**A CLASS INVENTORY IS NOT THIS STEP AND WAS THE FIRST SYNC'S MISTAKE** (4 Sep 2026): comparing
the classes the file writes with the classes the stylesheet ships said "331 of 335 present" and
"current" while the Tal dock was the old `.askline` without §70's travelling light and the
interviews page drew a `.tabs` strip where the other portals draw `.sec-cs` + `.cs`. Both pass an
inventory and a rule sweep; only the side-by-side sees them. Three buckets still apply: **stale**
(an older shape of a component the reference now draws differently), **unstyled** (a class in no
layer — `grep -o 'class="[^"]*"'` against `talentnext-ds.css` finds these and only these),
**fine**.

## 3. Port

For each stale item: copy the recipe out of `gallery.html`, fill it with the portal's OWN data
(never invent content, §74), delete the old markup rather than leaving it caller-less, and keep
the old shape's argument in a note in the file's header if it recorded a decision. Match the
reference portal's placement rules (badge banner below the black card; one Tal star per page;
the page's name in the top bar, not an `<h1>`).

## 4. Rebuild and sweep

```bash
cd design-system && python3 build-ds.py          # only if a layer moved
node hifi/designcheck.mjs --url=tn-agent-portal.html
```

Then verify at 390 / 744 / 1024 / 1280 in the Browser pane: no overflow, no heading colliding
with its content, no button label on two lines. Responsive is part of done.

## 5. Report

Bucket counts before and after, the components ported, and anything still in "stale" with its
reason (a documented exception, or a decision that is Maryam's).

For `admin`, step 2 will report that the file is not on the design system at all — every class is
"unstyled". That output is the migration list; the migration itself is a separate, deferred task.
