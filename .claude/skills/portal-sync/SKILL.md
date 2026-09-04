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

## 2. Inventory the gap

```bash
python3 - tn-agent-portal.html <<'PY'
import re,sys,pathlib
html=pathlib.Path(sys.argv[1]).read_text()
css=pathlib.Path('design-system/talentnext-ds.css').read_text()
written={c for m in re.findall(r'class="([^"]*)"',html) for c in m.split() if not c.startswith('${')}
written|={c for m in re.findall(r"class=\\?'([^']*)\\?'",html) for c in m.split()}
shipped=set(re.findall(r'\.([A-Za-z_][\w-]*)',css))
STALE={ # older generation -> current (DESIGN.md §4)
 'plate':'.dark-card (+ .crow-dark / .rec-dark) in the page body',
 'lvl-hero':'removed — no agent level; a level name is h2',
 'wkc':'.pulse / .stat cells','ach':'.ph-earned one-line celebration (§62)',
 'pswitch':'.acct-t account menu (§78)','stp-all':'.stps row (§56) unless the dropdown is wanted',
 'ph-facts':'no fact row on module pages (§78)','crumb':'top-bar trail (§78)',
 'tal-panel':'the ask dock','tal-fab':'the ask dock','sec-h':'aiHead where a sentence sits under the heading (§73)',
}
stale={c:STALE[c] for c in written if c in STALE}
unstyled=sorted(c for c in written-shipped if not c.startswith(('pt-','chrome','ad-')))
print(f'written {len(written)} | shipped-by-DS {len(written&shipped)} | unstyled {len(unstyled)} | stale {len(stale)}')
print('\nSTALE (port these):'); [print(f'  .{k:14} -> {v}') for k,v in sorted(stale.items())]
print('\nUNSTYLED (in no layer):', ', '.join(unstyled) or 'none')
PY
```

Three buckets: **stale** (an older generation of a component the design system has replaced),
**unstyled** (written by the page and in no layer — either prototype chrome, or a class that
should not exist), **fine**. The `sec-h` row is a prompt, not a verdict: a `.sec-h` with no
sentence under it is current.

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
