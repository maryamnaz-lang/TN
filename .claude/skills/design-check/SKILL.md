---
name: design-check
description: Sweep a TalentNext portal against DESIGN.md — computed type, weight, case, hairline, radius and accent checks at 390/744/1024/1280, plus respcheck for hifi. Use after any UI change, or when asked whether a portal is consistent.
---

# /design-check <portal>

`<portal>` is one of `candidate`, `leader`, `agent`, `admin`, or a path/URL. `candidate` and
`leader` share one built file, so both run the same command.

## Run

```bash
# candidate / leader (hifi) — layout first, then the rule sweep
cd hifi && node respcheck.mjs --quick && node designcheck.mjs

# talent agent
node hifi/designcheck.mjs --url=tn-agent-portal.html

# super admin (expected to report gaps — it is not on the design system yet)
node hifi/designcheck.mjs --url=tn-admin.html
```

Add `--widths=390,1280` to narrow, `--quiet` for three examples per rule.

## Read the report

Each rule prints distinct findings as `selector  value  ×hits  e.g. width:screen`. The rules
are DESIGN.md §2–§3: `weight` (not 400/500), `face` (not Plus Jakarta Sans), `size` (off the
scale), `transform` / `caps-text` (capitals), `border` (a line colour that is not a token),
`radius` (a corner on a box that is not a disc or pill), `old-accent` (a previous accent hex).

## Fix

1. Fix at the **layer** in `hifi/build/` that states the rule — never in `talentnext-ds.css`
   or the built HTML (DESIGN.md §6). Type, weight, case and ink belong in `63-typography.css`.
2. For `tn-agent-portal.html`, a `border` or `radius` finding on a class the design system ships
   is a layer fix; one on a class only that file writes is a markup fix in the file.
3. For `tn-admin.html`, the report is the migration list; fixing it by hand is the deferred
   admin migration task, not this skill.
4. Rebuild both (`cd hifi/build && python3 build.py`, `cd design-system && python3 build-ds.py`),
   re-run the check, and report the before/after counts per rule.

A finding that is a **stated exception** in DESIGN.md (the card wordmarks, `.agt-tag`'s pill,
the `.tbl-flag` chip, `--t-sec-lg` on `.dc-t`) is not a defect; say so rather than "fixing" it.
