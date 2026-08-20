#!/usr/bin/env python3
"""Assemble the single self-contained v24 file."""
import base64, re, pathlib, re

here = pathlib.Path(__file__).parent
css = '\n'.join((here / f).read_text() for f in
                ['01-foundation.css', '02-components.css', '03-product.css', '04-fixes.css', '05-refine.css', '06-polish.css', '07-final.css', '08-last.css', '09-avatar.css', '10-lattice.css', '11-type.css', '12-tone.css', '13-motion.css', '14-desktop.css', '15-course.css', '16-ai.css', '17-auth.css', '18-contain.css', '19-accent.css', '20-group.css', '21-ask.css', '22-noedge.css', '23-ink.css', '24-dash.css', '25-modhead.css', '26-agent.css', '27-tal.css', '28-frame.css', '29-consistency.css',
                 # TEMPORARY — the Next in Leadership run-up. Last because it
                 # patches nothing: every rule in it is under `.nil`, which no
                 # earlier layer mentions, so its position in the cascade is
                 # the one place it cannot cause an argument. Delete this
                 # entry with 30-nil.css and nil.js.
                 '30-nil.css',
                 # The portal switch and the Cohort Leader's pages. After nil
                 # for the same reason nil is last: everything in it is either
                 # a new component (`.pswitch`) or scoped to
                 # `[data-portal="leader"]`, an attribute no earlier layer
                 # mentions — so its place in the cascade cannot be argued
                 # with, and the corrections it makes to shared components
                 # (`.tbl`, `.kv`) have to land after those components' own
                 # layers to be corrections at all.
                 '31-lead.css',
                 # The dashboard's "This week" card and the progress ring.
                 # Last, on the same argument as the two above: everything in
                 # it is a new class (`.wkc*`, `.ring*`) that no earlier layer
                 # mentions, and the one rule that IS a correction — §10's
                 # label column, at the foot of the file — has to land after
                 # the layer it corrects to be a correction at all.
                 '32-week.css',
                 # Tal's page summary at the head of every page. Last because
                 # it is the one layer that has to beat §25 — §25 states the
                 # band's Tal card as a named-area grid inside a container
                 # query, and a query is its own cascade tier, so the only way
                 # to restate that card's shape is from a later layer INSIDE
                 # the same query. Everything else in it is gated on
                 # `.talsum`, a class no earlier layer mentions.
                 '33-talsum.css',
                 # The rail: the count's red, the accent on the module you
                 # are on, and the mark-becomes-menu corner. After §33 and
                 # after §19 in particular — §19 paints every accent fill in
                 # the product from a GENERATED list, so a fill that must NOT
                 # be accent can only be corrected from later than it.
                 '34-rail.css',
                 # Booking an interview inside Tal's thread. LAST, and it has
                 # to be: every rule in it takes a page indent off a component
                 # that is being borrowed into a chat bubble, so it can only
                 # be a subtraction if it lands after the layer that stated
                 # the indent — §07 for the agent card, §10 for the slot grid,
                 # §15 for the fact rows. The one rule that is not a
                 # subtraction widens a Tal bubble that has a card in it, and
                 # that is §27's cap, so it too can only be answered from
                 # later. Everything else is `.bkw` / `.bk-*`, which nothing
                 # earlier mentions.
                 '35-book.css',
                 # The Cohort Leader's other seven modules — Cohorts, one
                 # cohort, one candidate, Course Reports, Sessions,
                 # Evaluations, one decision, one summary, Messages,
                 # Certifications and the leader's own profile. Last for §31's
                 # reason and only that one: every rule in it is either a new
                 # `.ldr-*` class no earlier layer mentions, or a correction
                 # to a shared component (`.tq`, `.cardrow`, `.steps`) that
                 # has to land after that component's own layer to be a
                 # correction at all. It does not compete with §35 — nothing
                 # in either file names a selector the other does.
                 #
                 # ELEVEN VIEWS AND NO ADDITIONS TO §10.15's OPT-OUT LIST,
                 # which is the test of whether a pass reused the design
                 # system or forked it: every section on those pages is built
                 # from `.stats`, `.facts`, `.tbl-wrap`, `.tile-stack`,
                 # `.cardrow` or `.gcard`, so the desktop label column comes
                 # out right without being argued with from inside a container
                 # query.
                 '36-lead2.css',
                 # Three corrections that can only be corrections from the
                 # end of the list: the card rail's own closing rule (§26
                 # takes the rule ABOVE the rail off and never gave it one
                 # below), Tal's chip without its fill (§12 states the fill
                 # and the sheen, §19 restates both — a variant has to be
                 # later than the later of the two), and the week card's
                 # promoted chapter button, which is a class no earlier layer
                 # mentions. Nothing in it competes with §35 or §36.
                 '37-refit.css',
                 # THE SCENES. A new component and the only layer in the file
                 # that patches nothing at all: every selector in it is
                 # `.scene*`, a prefix no earlier layer mentions, so it could
                 # sit anywhere and is put last because that is where a new
                 # thing goes. It DOES reach into two shared components — the
                 # interview row's kit strip and `.ivlist`'s label column —
                 # and both of those have to be later than §10.15 and §15 to
                 # be corrections, which the end of the list gives for free.
                 '38-scene.css'])
# ==========================================================================
# NO HOVER
# The state layer was fighting the layout everywhere it appeared: a wash on a
# borderless row reads as a box that was not there a moment ago, and on a
# page made of rules that is one more edge than the page has.
#
# Rather than hunt forty rules across fourteen files and hope none comes
# back, the build disarms them — and it does it TEXTUALLY, not by parsing.
# An earlier version of this walked the stylesheet rule by rule and deleted
# the hover ones; a comment sitting in front of an @container was enough to
# make it mistake the at-rule for a prelude, and it quietly re-flowed blocks
# that had nothing to do with hover. Rewriting `:hover` to `:hover:where(.__nh)`
# has no such failure mode: `:where()` contributes no specificity, `.__nh` is
# a class that never appears in the DOM, so the rule simply never matches and
# every other rule keeps its exact place in the cascade.
#
# Two are left armed, by name:
#   .sn-item:hover   — the navigation rail. Icon-only at desktop, so the
#                      pointer needs to know which target it is on.
#   .btn-p / .tal-fab — the primary action going black to purple. The one
#                      place hover carries the brand rather than a grey plate.
#
# :focus-visible is untouched: it is how the keyboard sees the page.
# ==========================================================================
#   .tal-star:hover — the ask control on an agent card. It is collapsed to a
#                     mark until you point at it; disarmed, it never opens.
#   .nil-btn / .nil-fbtn / .nil-step.live — the run-up's buttons. The
#                     argument above is about THIS product's surfaces: a wash
#                     on a borderless row, on a page made of hairlines. The
#                     Next in Leadership screens are neither — they are boxed
#                     cards and filled navy buttons on white, where a pointer
#                     state is what the page already looks like. And they are
#                     the screens whose entire brief is "the buttons should
#                     work", which is worth being able to feel.
#   .psw-t:hover  — the portal switch. It is the one control in the app bar
#                     that changes who is signed in, and the two halves are
#                     plain text until one of them is live, so without a
#                     pointer state the inactive half gives no sign that it is
#                     a target at all.
#   .nav-t          — the rail's corner. The mark becomes the hamburger
#                     under the pointer, which is the control saying what it
#                     does rather than a state layer decorating one. Disarmed,
#                     the mark simply never becomes a menu. See §34.
#   .stat-jump    — the leader dashboard's four figure cells. They look exactly
#                     like the read-only figure cells everywhere else in the
#                     product, and unlike those they scroll the page. The
#                     pointer state is the only thing on the card that says so.
HOVER_KEEP = ('sn-item', 'btn-p', 'tal-fab', 'tal-star',
              'nil-btn', 'nil-fbtn', 'nil-step.live', 'nil-btn.ghost',
              'psw-t', 'nav-t', 'stat-jump')
_hover_n = 0

def _disarm(m):
    global _hover_n
    compound = m.group(1)
    if any(compound.endswith(k) for k in HOVER_KEEP):
        return m.group(0)
    _hover_n += 1
    return compound + ':hover:where(.__nh)'

css = re.sub(r'([A-Za-z0-9_.#\[\]="\'-]*):hover(?!:where)', _disarm, css)
print(f'hover selectors disarmed: {_hover_n}')

# ==========================================================================
# THE COMMENTS STAY IN THE SOURCE
# Every rule in this stylesheet carries the reasoning for it, and that is the
# point: the next person to touch it needs to know why a thing is the way it
# is. But the reasoning belongs in build/*.css, which is where it is written
# and where it survives. Shipping 110 KB of prose inside a single-file
# prototype only makes the file harder to move around — and this one has to
# be openable by double-click and small enough to share.
# ==========================================================================
_css_before = len(css)
css = re.sub(r'/\*[\s\S]*?\*/', '', css)
css = re.sub(r'\n[ \t]*\n+', '\n', css)
print(f'css comments stripped: {(_css_before - len(css))/1024:.0f} KB')

inter = base64.b64encode((here / 'inter.woff2').read_bytes()).decode()
css = css.replace('__INTER__', f'data:font/woff2;base64,{inter}')
standin = base64.b64encode((here / 'stand-in.woff2').read_bytes()).decode()
css = css.replace('__STANDIN__', f'data:font/woff2;base64,{standin}')
soehne = base64.b64encode((here / 'soehne-buch.woff2').read_bytes()).decode()
css = css.replace('__SOEHNE__', f'data:font/woff2;base64,{soehne}')
soehnemono = base64.b64encode((here / 'soehne-mono-buch.woff2').read_bytes()).decode()
css = css.replace('__SOEHNEMONO__', f'data:font/woff2;base64,{soehnemono}')

# SÖHNE KRÄFTIG. The system is two styles of one face, and this is the
# second. If the file is not here the @font-face is dropped rather than left
# pointing at nothing — the browser then synthesises 600 from Buch, which is
# worse than Kräftig and better than a second typeface.
# ==========================================================================
# TAL'S MARK IS A GRADIENT CIRCLE
# The four-pointed star was the product's own drawing of "AI". Maryam
# supplied the real mark: a soft orange sphere, blurred at the edge. It is a
# RASTER — the falloff is a gradient with noise in it and an SVG of it would
# either band or be larger than the PNG — so it is embedded as a data URI and
# placed with `background-size:contain`, which lets one file serve the 15px
# mark on a thread label and the 81px one on the panel's empty state.
# ==========================================================================
_circ = here / 'tal-circle.png'
css = css.replace('__TALCIRCLE__',
    'data:image/png;base64,' + base64.b64encode(_circ.read_bytes()).decode())
print(f'Tal circle embedded: {_circ.stat().st_size/1024:.0f} KB')

_kr = here / 'soehne-kraftig.woff2'
if _kr.exists():
    kraftig = base64.b64encode(_kr.read_bytes()).decode()
    css = css.replace('__SOEHNEKRAFTIG__', f'data:font/woff2;base64,{kraftig}')
    print('Söhne Kräftig embedded')
else:
    css = re.sub(r'@font-face\{[^}]*__SOEHNEKRAFTIG__[^}]*\}', '', css)
    print('Söhne Kräftig MISSING — 600 falls to the stand-in')

# the sign-up artwork, exported from the Figma file. Lossless WebP so the
# embedded copy is pixel-identical to what came out of Figma — the graphic is
# the logo and it does not get re-drawn, re-scaled or re-compressed.
art = base64.b64encode((here / 'auth-art.webp').read_bytes()).decode()
css = css.replace('__AUTHART__', f'data:image/webp;base64,{art}')

# the brand chevron that bleeds off the left edge of the sign-up card, as
# exported from the Figma file at its placed size (112 x 294). Lossless WebP,
# so the embedded copy is the export: the crop is part of the artwork and it
# is neither redrawn nor re-scaled.
mark = base64.b64encode((here / 'auth-mark.webp').read_bytes()).decode()
css = css.replace('__AUTHMARK__', f'data:image/webp;base64,{mark}')

# the client's award artwork — the coin stack, the four shields and the three
# star medallions — embedded as one table so nothing on this page reaches the
# network. Cropped to their own alpha bounds at build time so every mark fills
# its box the same way.
AWARDS = ['points', 'bronze', 'silver', 'gold', 'involved', 'rank1', 'rank2', 'rank3']
_aw = ',\n  '.join(
    "%s:'data:image/webp;base64,%s'" % (k, base64.b64encode((here / 'awards' / (k + '.webp')).read_bytes()).decode())
    for k in AWARDS)
award_js = 'const AWARD = {\n  ' + _aw + '\n};\n'
print(f'award artwork embedded: {len(AWARDS)} marks, {len(award_js)/1024:.0f} KB')

# TEMPORARY — nil.js is LAST, and that is load-bearing. It declares `const
# NIL`, which render() reads inside the `S.stage==='nil'` branch; a const is
# in its temporal dead zone until its own statement runs, so the boot render
# at the foot of views.js and the five re-renders at the feet of ai.js .. ai5.js
# would all throw if any of them were on that stage. None is — they are on
# `new` — and by the time a stage change can reach the run-up, this file has
# run. Being last also means its own closing render() is the final paint, with
# every wrapper in the chain installed. Delete with 30-nil.css.
# lead.js is after nil.js so that its render() is the final paint and its
# wrapper is the outermost in the chain — the `data-portal` stamp has to run
# after ai5's view stamp, not before it. It reads `AV` and `V` from data.js and
# views.js, and calls nothing that nil.js declares, so nothing about its
# position is load-bearing beyond being last.
js = award_js + '\n\n' + '\n\n'.join((here / f).read_text() for f in ['icons.js', 'data.js', 'views.js', 'ai.js', 'ai2.js', 'ai3.js', 'ai4.js', 'ai5.js', 'nil.js', 'lead.js',
                                                        # The leader's seven module pages, plus the four pages under
                                                        # them. After lead.js because they read its data
                                                        # (`LEAD_COHORTS`, `LEAD_EVALS`, `LEADER`, `lpace`, `lavg`)
                                                        # and because each one REPLACES a `LEAD_SOON` stub that file
                                                        # assigns into `V` — the later assignment is the whole
                                                        # mechanism, so being after it is load-bearing. Before ai6
                                                        # so the note above it stays true: it has to see these views
                                                        # to summarise them.
                                                        #
                                                        # Order among the three is not load-bearing except in one
                                                        # place: lead4 pushes onto lead2's `LDR_SHEETS` registry, so
                                                        # it cannot be parsed first.
                                                        'lead2.js', 'lead3.js', 'lead4.js',
                                                        # LAST, and that is load-bearing twice: `placeBand` (ai5)
                                                        # has to have assembled the head band before this pass can
                                                        # find it, and `enhanceTalCards` (views.js) has to have
                                                        # added its suggested questions before this can take them
                                                        # out again. It also has to see lead.js's views to
                                                        # summarise them.
                                                        'ai6.js',
                                                        # Booking an interview inside Tal's thread. AFTER ai6, and
                                                        # for two reasons that both point the same way. Its own pass
                                                        # fills the widget hosts that `placeAsk` (ai4) has just
                                                        # printed, so its render wrapper has to be the outermost in
                                                        # the chain — which means being parsed last. And it REPLACES
                                                        # two of ai6's page summaries and wraps `pageSummary` itself,
                                                        # so ai6 has to have declared them before this can.
                                                        # It reads `AGENTS`, `S.cards` and `BMK` from
                                                        # data.js and views.js, and reassigns `talReset` — all of
                                                        # them function declarations or consts that have long since
                                                        # run by the time this file is parsed.
                                                        'ai7.js'])
# same argument as the stylesheet: the reasoning lives in build/*.js, which is
# where it is written and where it survives. Verified safe by scan — no `/*`
# or `*/` appears inside a string or a regex literal anywhere in the sources.
_js_before = len(js)
js = re.sub(r'^[ \t]*/\*[\s\S]*?\*/[ \t]*\n?', '', js, flags=re.M)
print(f'js comments stripped: {(_js_before - len(js))/1024:.0f} KB')

HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TalentNext — Candidate Portal · v24 · Material UI · Responsive</title>
<style>
{css}
</style>
</head>
<body>
<!-- prototype chrome — not part of the product -->
<div class="pt-bar">
  <img id="ptLogo" alt="TalentNext" style="height:18px;width:auto">
  <span class="dot"></span>
  <span class="pt-meta">Candidate portal · v24 · Material UI · Next in Leadership</span>
  <span class="pt-lab">Stage</span>
  <select class="pt-sel" id="pick" aria-label="Candidate stage"></select>
  <div class="pt-vp" id="vp" role="group" aria-label="Viewport">
    <button data-vp="mobile" class="on">Mobile</button>
    <button data-vp="tablet">Tablet</button>
    <button data-vp="fluid">Desktop</button>
    <span class="pt-scale" id="vpscale">100%</span>
  </div>
  <div class="pt-nav">
    <button id="back" title="Back" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z"/></svg></button>
    <button id="reset" title="Reset this stage" aria-label="Reset"><svg viewBox="0 0 24 24"><path d="M12 5V2L8 6l4 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7Z"/></svg></button>
  </div>
</div>

<div class="pt-stage">
  <div class="pt-fit" id="fit">
    <div class="device" id="device" data-vp="mobile"></div>
  </div>
</div>

<script>
{js}

/* ============================================================
   VIEWPORT SWITCHER — prototype chrome.
   The app itself responds to its container, not to the window, so one
   document renders phone, tablet and desktop without a reload.
   ============================================================ */
/* Each frame keeps its true pixel size so the container queries inside it
   resolve honestly — a 1280px desktop frame must query as 1280 even when the
   preview pane is 700px wide. It is scaled down to fit instead of squashed,
   which is the only way the desktop layout is visible in a narrow panel. */
const VP_SIZE = {{mobile:[390,844], tablet:[744,1133], fluid:[1440,900]}};
const fitBox = document.getElementById('fit');

function fitFrame(){{
  const vp = device.dataset.vp;
  const stage = fitBox.parentElement;
  const pct = document.getElementById('vpscale');
  /* Desktop is not a device. It has no bezel and no fixed size: it takes the
     whole stage, which is also the honest preview, because a desktop browser
     is whatever width the person's window happens to be. */
  if(vp === 'fluid'){{
    device.style.transform = 'none';
    device.style.width = '100%';
    device.style.height = Math.max(520, window.innerHeight - stage.getBoundingClientRect().top) + 'px';
    fitBox.style.width = '100%';
    fitBox.style.height = device.style.height;
    if(pct) pct.textContent = Math.round(stage.clientWidth) + 'px';
    return;
  }}
  const [w, h] = VP_SIZE[vp] || VP_SIZE.mobile;
  device.style.width = w + 'px';
  device.style.height = Math.min(h, Math.round(window.innerHeight * 0.82)) + 'px';
  const avail = stage.clientWidth - 8;
  const scale = Math.min(1, avail / w);
  device.style.transform = scale < 1 ? `scale(${{scale}})` : 'none';
  fitBox.style.width = Math.round(w * scale) + 'px';
  fitBox.style.height = Math.round(parseFloat(device.style.height) * scale) + 'px';
  if(pct) pct.textContent = scale < 1 ? Math.round(scale * 100) + '%' : '100%';
}}

document.getElementById('vp').addEventListener('click', e => {{
  const b = e.target.closest('button[data-vp]');
  if(!b) return;
  document.querySelectorAll('#vp button').forEach(x => x.classList.toggle('on', x === b));
  device.dataset.vp = b.dataset.vp;
  S.nav = false;
  render();
  fitFrame();
}});
window.addEventListener('resize', fitFrame);
fitFrame();
</script>
</body>
</html>
"""

# ==========================================================================
# THE BUNDLE IS SYNTAX-CHECKED, BECAUSE ITS FAILURE MODE IS SILENT
# Nine files of template literals concatenate into one classic script. A
# single stray backtick — one inside a comment written into a template, which
# is how this check came to exist — closes the literal and the whole bundle
# stops parsing. The page then loads, styles, and renders an EMPTY frame:
# `<div id=device>` never gets its innerHTML because the script that would
# have set it was never run. Nothing appears in the console after the fact
# either, since the error is at parse time, so the symptom reads as "the app
# is blank" with no lead at all.
#
# `node --check` on the assembled script catches it in one second. Node is
# not a build dependency — it is here for verify.mjs and audit.mjs — so a
# machine without it gets a warning rather than a failed build, and a machine
# with it gets a hard stop before the broken file is written.
# ==========================================================================
import shutil, subprocess, tempfile
_node = shutil.which('node')
if _node:
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(js)
        _probe = fh.name
    _r = subprocess.run([_node, '--check', _probe], capture_output=True, text=True)
    pathlib.Path(_probe).unlink(missing_ok=True)
    if _r.returncode:
        # the temp path in node's message is meaningless to the reader; the
        # line number is not, and it maps onto the concatenation order above
        raise SystemExit('BUNDLE DOES NOT PARSE — nothing written.\n'
                         + _r.stderr.replace(_probe, '<bundle>'))
    print('bundle parses')
else:
    print('node not found — bundle NOT syntax-checked')

out = here.parent / 'talentnext-candidate-portal-v24.html'
out.write_text(HTML)
print(f'{out.name}  {len(HTML):,} chars  ({len(HTML)/1024:.0f} KB)')
