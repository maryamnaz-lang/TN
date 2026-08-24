#!/usr/bin/env python3
"""
Extract the TalentNext design system out of the hi-fi portal's build layers.

WHY THIS IS AN EXTRACTION AND NOT A REWRITE
The portal's look is not a set of values you can restate — it is 38 CSS layers
in which later layers correct earlier ones by name, and the cascade order IS
the architecture (see hifi/build/build.py, and CLAUDE.md's traps 3 and 4). A
hand-written "design system" that re-declared the tokens and re-drew the
buttons would look right for a week and then drift, because the corrections
that make the real thing sit correctly at 900px live in §10, §14, §18, §20,
§29 and §37 — not in §01 and §02.

So this script walks THE SAME LAYERS IN THE SAME ORDER as build.py, and keeps
the rules that belong to the shared vocabulary while dropping the rules that
belong to one product surface. Every rule in the output is a real rule from
the real portal, in its real cascade position. Nothing here is re-typed.

HOW A RULE IS CLASSIFIED
By its selector's class names, against the two sets below. A selector survives
only if EVERY class in it is in SYSTEM — so `.app .sec .tile` is kept and
`.app .lvl-hero .tile` is dropped, which is what makes the output the shared
part rather than a sample of the whole.

One refinement, and it is load-bearing: inside `:not()` / `:is()` / `:where()`
the argument list is FILTERED rather than judged. §20's desktop rule carries a
13-class `:not()` exclusion list, some of it product classes; judging the whole
selector would drop the rule that decides which sections join, and losing it
would silently re-join every pair. Filtering the list keeps the rule and keeps
it honest.

Run:  python3 build-ds.py
"""
import base64
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).parent
SRC = HERE.parent / 'hifi' / 'build'

# The layer order is build.py's, verbatim. It is not alphabetical by accident
# and it must not be sorted: `05` unsets what `02` sets, `37` corrects `26`.
LAYERS = [
    '01-foundation.css', '02-components.css', '03-product.css', '04-fixes.css',
    '05-refine.css', '06-polish.css', '07-final.css', '08-last.css',
    '09-avatar.css', '10-lattice.css', '11-type.css', '12-tone.css',
    '13-motion.css', '14-desktop.css', '15-course.css', '16-ai.css',
    '17-auth.css', '18-contain.css', '19-accent.css', '20-group.css',
    '21-ask.css', '22-noedge.css', '23-ink.css', '24-dash.css',
    '25-modhead.css', '26-agent.css', '27-tal.css', '28-frame.css',
    '29-consistency.css', '30-nil.css', '31-lead.css', '32-week.css',
    '33-talsum.css', '34-rail.css', '35-book.css', '36-lead2.css',
    '37-refit.css', '38-scene.css',
]

# ==========================================================================
# THE VOCABULARY
# Every class the 38 layers mention was read and put in one of two places.
# The test applied was not "is this pretty" but "does a SECOND portal, with
# different content, need this word" — which is why the list rows, the figure
# cells and the label column are here and the course player, Tal's thread and
# the leader's evaluation queue are not.
# ==========================================================================
SYSTEM = set("""
app device
shell shell-act shell-avatar shell-badge shell-body shell-logo shell-name
shell-right sidenav sn-item sn-cap sn-div sn-foot sn-head sn-main sn-av
scrim main page view-col nav-t nav-t-mark nav-t-menu

ph ph-top ph-back ph-act ph-main ph-has-act crumb last
sec sec-h sec-h-act sec-out sec-stp
eyebrow lead sub help quiet divider sep hr-full center sr band bleed
flush tight none tint warm on-dark spaced wide flat
bordered nofill box brand dark

t-body-01 t-body-02 t-body-compact-01 t-code-01 t-heading-01 t-heading-02
t-heading-03 t-heading-04 t-heading-05 t-heading-compact-01 t-helper-01
t-label-01 t-legal-01 legal big lg mono ttl
u-h2 u-h3 u-body u-caption u-compact u-display u-label u-overline
u-acc-fill u-acc-text

btn btn-p btn-s btn-t btn-g btn-d btn-sm btn-full btn-row btn-set btn-like
ghost noic locked lk lnk danger

f f-row lbl inp inp-mk inp-static srch pw-wrap pw-eye pw-rules otp otp-act
cbx cbx-list rad sw sel invalid err ok txt

row-lead tile tile-arrow tile-stack gcard gcard-b clk clip card-go arrow chev
cardrow cardrow-a cardrow-b cardrow-d cardrow-ic cardrow-t
nrow nrow-b nrow-d nrow-ic nrow-t nrow-w
mem mem-av mem-b mem-m mem-n mem-ph slot slots av av-ph

stats stats-lead stat stat-ic stat-jump stat-top kv facts
tbl tbl-wrap tbl-flag chart-table num n v k l d m
steps s-n s-b
stp stp-all stp-b stp-c stp-h stp-ic stp-list stp-meter stp-now
stp-rail stp-row stp-t stp-titled stp-top
prog prog-day prog-dn prog-figs prog-l prog-pct prog-seg prog-top
pb pb-fill pb-top pb-track

tag tag-row badge badges dot mdot pill-def
acc green red warn org succ done on open now never high
sm xs

note note-act note-cta nb empty modal sheet sheet-b sheet-f sheet-h why quote
acc-b acc-h acc-i tabs tb tg
stickybar foot-row foot-stack form-page

mb0 mb4 mb5 mb6 mt mt0 mt3 mt4 mt5 mt6 sp x t

pt-bar pt-cap pt-fit pt-lab pt-meta pt-nav pt-scale pt-sel pt-stage pt-vp
""".split())

# ==========================================================================
# THE OTHER HALF OF THE DECISION, AND IT IS CHECKED RATHER THAN COMMENTED
# Everything not in SYSTEM is dropped. That is correct for the vocabulary
# below — one product surface's own words — but it is a silent default, and a
# silent default is the wrong behaviour for a NEW component: build one, forget
# to classify it, and it simply never reaches the design system. Nothing
# fails, nothing warns, and the next portal quietly re-implements it.
#
# So the exclusions are a LIST, not a comment. Anything in neither set is
# reported at the end of every build as unclassified, with the layer it came
# from, so the choice — shared or one surface's own — is made deliberately and
# once. Adding a prefix here is how you say "product"; adding it to SYSTEM is
# how you say "shared, put it in the design system".
# ==========================================================================
# Namespaced families. A prefix is only used where the name really is a
# namespace, because a short prefix would swallow a FUTURE class and hide the
# very thing the report exists to surface: `'b'` as a prefix would silently
# classify a new `.bandroll` as product. Anything short or ambiguous is an
# exact name in PRODUCT_EXACT below instead.
PRODUCT_PREFIXES = (
    'ai-', 'ask', 'tal', 'talsum',            # Tal, the thread, the summary card
    'agh', 'ag-', 'agid',                     # the agent cards and profiles
    'lvl-', 'score', 'stars', 'aw-', 'aw.',   # levels, points, awards
    'ch-', 'chapters', 'chgrow',              # the course player
    'nil', 'lsvt', 'ios-',                    # the run-up, LSVT frame, phone chrome
    'lead', 'ldr', 'psw',                     # the Cohort Leader portal, the switch
    'auth',                                   # the sign-up card and its artwork
    'bk', 'sb-',                              # booking inside Tal
    'scene', 'vn-', 'rec-',                   # the scene picker, video notes
    'modhead',                                # the module head band
    'pay',                                    # the payment pages
    'path', 'ladder', 'chev', 'trackband',    # the journey diagrams
    'msg', 'room', 'post', 'memo', 'm-',      # messaging and the cohort board
    'cert', 'plate',                          # JS-relocated dark cards
    'ivt', 'ivrow', 'ivlist',                 # the interview tables
    'wkc', 'ring',                            # the dashboard's "This week" card
    'chart', 'sc-', 'ct-',                    # the drawn charts
    'sk-', 'stand', 'signed',                 # skills, standing, the signature
    'notif', 'rail', 'composer', 'askdock',   # notifications, card rail, composer
    'pi-', 'stp',                             # steppers belonging to one flow
    'ach', 'daystrip',                        # achievements, the day strip
    'idhead', 'idname', 'idmeta', 'idphoto',  # the identity block
    'photo', 'draft', 'gen-', 'did-',         # media pickers, generated answers
    'rp-', 'q-', 'tq', 'quiz',                # the review panel and quizzes
    'tw', 'wcall', 'callband',                # the weekly task, the call bands
    'cap', 'kit', 'flag-t',                   # captions, the interview kit
    'bub', 'bmk', 'bhead',                    # bubbles and bookmarks
    'gfx', 'pict', 'bands',                   # retired illustration blocks
    'form-page', 'pointsList', 'badgeList',
    'rank', 'hd-srch', 'close-', 'kv-',
    'page-from-ask', 'page-to-ask', 'all-',
    'sec-act', 'sec-cbx', 'sec-id',
    'sec-rule', 'sec-dark', 'sec-cs',
    'static-row', 'show-thread', 'slots-note',
    'dark-glow', 'has-art', 'face-row',
    'btn-lead', 'layer-02', 'accent-text',
    'border-subtle',
)

# One-off leaf names, matched EXACTLY. Most are the neutered legacy utility
# lists in `03-product.css` — `.l,.r,.m,.n,.s,.t,.v,.k,.p,.d,.c,.g,.x{}` and
# friends, emptied out years ago after they collided with the accordion. They
# have to be named rather than prefixed so a new `.gauge` or `.stepper` still
# reports as unclassified.
PRODUCT_EXACT = set("""
ag ch chip-tal aw card caption fill vn cap ct cb rt2 dsp bx
b c g p q r s s1 s2 s3 s4 nm pi at aux eb cool ic lab line mod neg panel pct
sev sp trk conf cq draw grp hit high live mine never noline not now past
plain quote ref req resume right sel span2 sugg typing wide wrong x you board
mag mtxt lf-n bb bd brow fa going is-draft is-gone is-off is-stuck got un
day thumb w3 legend bar
bars cs me sk gen quotes eb-ok ic-l bare did rec
b-earn b-earn-t b-mk b-n b-nm b-pts b-who fa-b fa-dl fa-ic
""".split())


def classify(name):
    """-> 'system' | 'product' | 'unclassified'
    SYSTEM wins over both, so a shared name is never shadowed by a product
    prefix that happens to be a substring of it."""
    if name in SYSTEM:
        return 'system'
    if name in PRODUCT_EXACT:
        return 'product'
    if any(name.startswith(p) for p in PRODUCT_PREFIXES):
        return 'product'
    return 'unclassified'

# Hover, as build.py leaves it. Same rewrite, same keep-list: a design system
# that felt different from the portal it came out of would be the wrong
# artefact. See build.py's NO HOVER block for the argument — a wash on a
# borderless row reads as a box that was not there a moment ago. Set
# DS_ARM_HOVER=1 to build with the state layers live.
ARM_HOVER = bool(int(__import__('os').environ.get('DS_ARM_HOVER', '0')))
HOVER_KEEP = ('sn-item', 'btn-p', 'nav-t', 'stat-jump', 'psw-t')

# Font placeholders build.py fills. The DS embeds the same faces, so one
# <link> is the whole dependency — no relative font paths to get wrong.
FONTS = {
    '__INTER__': 'inter.woff2',
    '__SOEHNE__': 'soehne-buch.woff2',
    '__SOEHNEMONO__': 'soehne-mono-buch.woff2',
    '__SOEHNEKRAFTIG__': 'soehne-kraftig.woff2',
    '__STANDIN__': 'stand-in.woff2',
}
# Artwork placeholders. These are product images (Tal's mark, the sign-up
# art), not system assets, so any declaration still holding one is dropped
# rather than embedded — see `_drop_artwork`.
ARTWORK = ('__TALCIRCLE__', '__AUTHART__', '__AUTHMARK__')


# ==========================================================================
# PARSE
# A small tokenizer rather than a regex sweep. build.py records why: an
# earlier version of ITS hover pass walked the stylesheet with a regex, and a
# comment sitting in front of an @container was enough to make it mistake the
# at-rule for a prelude and re-flow blocks that had nothing to do with hover.
# Comments come off first, then braces are matched by counting.
# ==========================================================================
def strip_comments(text):
    return re.sub(r'/\*[\s\S]*?\*/', '', text)


def parse(text):
    """-> list of nodes. ('at', prelude, [children]) | ('at-verbatim', prelude,
    body) | ('rule', selector, decls)"""
    nodes, i, n = [], 0, len(text)
    while i < n:
        # find the next '{' or the end
        brace = text.find('{', i)
        if brace == -1:
            break
        prelude = text[i:brace].strip()
        # match the block
        depth, j = 1, brace + 1
        while j < n and depth:
            if text[j] == '{':
                depth += 1
            elif text[j] == '}':
                depth -= 1
            j += 1
        body = text[brace + 1:j - 1]
        i = j
        if not prelude:
            continue
        if prelude.startswith('@'):
            name = prelude.split()[0].lower()
            if name in ('@media', '@container', '@supports'):
                nodes.append(('at', prelude, parse(body)))
            else:                      # @font-face, @keyframes — kept whole
                nodes.append(('at-verbatim', prelude, body))
        else:
            nodes.append(('rule', prelude, body))
    return nodes


# ==========================================================================
# FILTER
# ==========================================================================
CLASS_RE = re.compile(r'\.(-?[A-Za-z_][A-Za-z0-9_-]*)')
FUNC_PSEUDO_RE = re.compile(r':(not|is|where|has)\(', re.I)


def split_top_level(text, sep=','):
    """Split on `sep` at paren depth 0 — a selector list may contain
    `:is(a,b)`, and splitting inside that would produce nonsense."""
    out, depth, cur = [], 0, ''
    for ch in text:
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if ch == sep and depth == 0:
            out.append(cur)
            cur = ''
        else:
            cur += ch
    out.append(cur)
    return out


def filter_functional(sel):
    """Rewrite `:not(a, .product, b)` -> `:not(a, b)`, dropping the pseudo
    entirely if nothing survives. Recurses, because §10 nests :where(:is()).
    Returns None if the selector should be dropped outright."""
    m = FUNC_PSEUDO_RE.search(sel)
    if not m:
        return sel
    start = m.start()
    open_paren = m.end() - 1
    depth, j = 1, open_paren + 1
    while j < len(sel) and depth:
        if sel[j] == '(':
            depth += 1
        elif sel[j] == ')':
            depth -= 1
        j += 1
    inner, name = sel[open_paren + 1:j - 1], m.group(1)
    kept = []
    for arg in split_top_level(inner):
        arg = arg.strip()
        if not arg:
            continue
        sub = filter_functional(arg)
        if sub is None:
            continue
        if all(c in SYSTEM for c in CLASS_RE.findall(sub)):
            kept.append(sub)
    head, tail = sel[:start], sel[j:]
    tail = filter_functional(tail)
    if tail is None:
        return None
    if not kept:
        # the whole point of the pseudo is gone. For :not() that is safe —
        # the rule simply applies more widely, which is what it did before the
        # exclusion existed. For :is()/:where()/:has() it is NOT safe: the
        # selector would stop matching what it was written to match.
        if name.lower() == 'not':
            return head + tail
        return None
    return f'{head}:{name}({", ".join(kept)}){tail}'


def keep_selector(sel):
    """-> the selector to emit, or None."""
    sel = filter_functional(sel.strip())
    if sel is None or not sel.strip():
        return None
    if not all(c in SYSTEM for c in CLASS_RE.findall(sel)):
        return None
    return sel.strip()


def keep_rule(selector):
    kept = [s for s in (keep_selector(x) for x in split_top_level(selector)) if s]
    return ',\n'.join(kept) if kept else None


def clean_decls(body):
    """Split a declaration block, drop anything still holding a product-image
    placeholder, and return the survivors. Doing this HERE rather than with a
    regex over the finished stylesheet is not a style preference — see the
    EMPTY RULES note in `filter_nodes`."""
    out = []
    for d in body.split(';'):
        d = d.strip()
        if not d:
            continue
        if any(tok in d for tok in ARTWORK):
            continue
        out.append(d)
    return out


def filter_nodes(nodes, stats):
    out = []
    for node in nodes:
        kind = node[0]
        if kind == 'rule':
            sel, decls = node[1], node[2]
            # ==============================================================
            # EMPTY RULES ARE DROPPED HERE, AT THE TREE, AND THAT IS THE ONLY
            # SAFE PLACE TO DO IT.
            # `03-product.css` carries several deliberately-neutered legacy
            # utility lists — `.l,.r,.m,.n,.s,.t,.v,.k,.p,.d,.c,.g,.x{}` is
            # the big one, emptied out after it collided with the accordion.
            # An earlier version of this script emitted them and then swept
            # empty blocks with a regex over the finished text. Because the
            # emitted selector list is one selector per line, `^[^{}\n]+\{\}`
            # matched only its LAST line and deleted that — welding the seven
            # remaining selectors onto the FOLLOWING rule. The following rule
            # was `.u-acc-fill{background:var(--accent)}`, so every `.k`, `.v`
            # and `.l` in the system came out filled orange: a bare
            # single-class selector, applying to every figure label on every
            # page, from a rule nobody wrote.
            # Dropping the node means there is no empty block to sweep.
            # ==============================================================
            kept_decls = clean_decls(decls)
            if not kept_decls:
                stats['dropped'] += 1
                continue
            decls = '; '.join(kept_decls)
            # :root carries the tokens. Kept whole, always: a token nobody
            # references costs one line, and a MISSING token silently resolves
            # to nothing and takes a colour with it.
            if sel.strip() in (':root', 'html', 'body', '*', '*,*::before,*::after'):
                out.append(('rule', sel.strip(), decls))
                stats['kept'] += 1
                continue
            new = keep_rule(sel)
            if new:
                out.append(('rule', new, decls))
                stats['kept'] += 1
            else:
                stats['dropped'] += 1
        elif kind == 'at':
            kids = filter_nodes(node[2], stats)
            if kids:
                out.append(('at', node[1], kids))
        else:                                      # at-verbatim
            out.append(node)
            stats['kept'] += 1
    return out


# ==========================================================================
# EMIT
# ==========================================================================
def emit(nodes, indent=0):
    pad = '  ' * indent
    chunks = []
    for node in nodes:
        if node[0] == 'at':
            chunks.append(f'{pad}{node[1]}{{\n' + emit(node[2], indent + 1) + f'{pad}}}\n')
        elif node[0] == 'at-verbatim':
            body = re.sub(r'\n\s*', ' ', node[2].strip())
            chunks.append(f'{pad}{node[1]}{{{body}}}\n')
        else:
            decls = '; '.join(d.strip() for d in node[2].split(';') if d.strip())
            sel = node[1].replace('\n', '\n' + pad)
            chunks.append(f'{pad}{sel}{{{decls}}}\n')
    return ''.join(chunks)


def disarm_hover(css):
    if ARM_HOVER:
        return css, 0
    n = 0

    def sub(m):
        nonlocal n
        compound = m.group(1)
        if any(compound.endswith(k) for k in HOVER_KEEP):
            return m.group(0)
        n += 1
        return compound + ':hover:where(.__nh)'

    return re.sub(r'([A-Za-z0-9_.#\[\]="\'-]*):hover(?!:where)', sub, css), n


def drop_orphan_fontface(css):
    """Drop any @font-face whose source never arrived — the browser would
    otherwise be pointed at the literal string `__SOEHNEKRAFTIG__`. Product
    ARTWORK placeholders are already gone: `clean_decls` takes those out at
    the declaration level, which is what keeps this from having to touch
    anything but a whole at-rule."""
    return re.sub(r'@font-face\{[^}]*__[A-Z]+__[^}]*\}\n?', '', css)


# ==========================================================================
# THE OUTPUT IS VERIFIED AGAINST THE INPUT
# One invariant catches every mistake this script can make: the design system
# must be a SUBSET of the portal. Every (selector, declarations) pair in the
# output has to appear, identically, in some source layer. Re-typed values,
# merged blocks, mangled selector lists and dropped declarations all break it.
#
# It is here because the orange-figure-label bug shipped once: the output had
# a rule nobody had written, and nothing in the build noticed. A diff of the
# rendered page against the portal would have caught it, but only if someone
# looked at that page. This looks every time.
# ==========================================================================
SKIP_VERIFY = (':root', 'html', 'body', '*', '*,*::before,*::after')


def verify_subset(css, layers):
    """Index the source by the selector AS THIS SCRIPT WOULD REWRITE IT, so a
    selector the `:not()` filter shortened still matches its own origin
    exactly. Then every output selector must be a key, and its declarations a
    subset of what that key carries in the source. No looser fallback: a
    fallback that matches on declarations alone would accept a rule welded
    onto the wrong selector, which is precisely the bug this exists for."""
    source = {}
    for name in layers:
        path = SRC / name
        if not path.exists():
            continue

        def walk(nodes):
            for n in nodes:
                if n[0] == 'at':
                    walk(n[2])
                elif n[0] == 'rule':
                    decls = frozenset(clean_decls(n[2]))
                    for one in split_top_level(n[1]):
                        key = keep_selector(one)
                        if key:
                            source.setdefault(key, []).append(decls)

        walk(parse(strip_comments(path.read_text())))

    problems = []

    def check(nodes):
        for n in nodes:
            if n[0] == 'at':
                check(n[2])
            elif n[0] == 'rule':
                if n[1].strip() in SKIP_VERIFY:
                    continue
                mine = frozenset(d.strip() for d in n[2].split(';') if d.strip())
                for one in split_top_level(n[1]):
                    one = one.strip()
                    if not one:
                        continue
                    # undo this script's own hover rewrite before comparing —
                    # `:hover:where(.__nh)` is a deliberate edit, not a drift
                    probe = one.replace(':hover:where(.__nh)', ':hover')
                    known = source.get(probe)
                    if known and any(mine <= k for k in known):
                        continue
                    problems.append(
                        f'{one} {{{"; ".join(sorted(mine))[:70]}}}')

    check(parse(strip_comments(css)))
    return problems


def main():
    if not SRC.is_dir():
        sys.exit(f'source layers not found: {SRC}')

    stats = {'kept': 0, 'dropped': 0}
    parts = []
    unclassified = {}          # class name -> the layer it first appeared in
    for name in LAYERS:
        path = SRC / name
        if not path.exists():
            print(f'  ! missing layer {name} — skipped')
            continue
        raw = strip_comments(path.read_text())
        for sel_text in re.findall(r'([^{}]+)\{', raw):
            if sel_text.strip().startswith('@'):
                continue
            for cls in CLASS_RE.findall(sel_text):
                if classify(cls) == 'unclassified':
                    unclassified.setdefault(cls, name)
        nodes = filter_nodes(parse(raw), stats)
        body = emit(nodes)
        if not body.strip():
            print(f'  {name:24s} —')
            continue
        parts.append(f'/* ---- {name} ---- */\n{body}')
        print(f'  {name:24s} {len(body)/1024:6.1f} KB')

    css = '\n'.join(parts)
    css, n_hover = disarm_hover(css)
    print(f'hover selectors disarmed: {n_hover}'
          if n_hover else 'hover left ARMED (DS_ARM_HOVER=1)')

    # fonts, embedded, so the stylesheet is the whole dependency
    for token, filename in FONTS.items():
        f = SRC / filename
        if f.exists():
            b64 = base64.b64encode(f.read_bytes()).decode()
            css = css.replace(token, f'data:font/woff2;base64,{b64}')
            print(f'embedded {filename} ({f.stat().st_size/1024:.0f} KB)')
        else:
            print(f'  ! {filename} missing — its @font-face is dropped')
    css = drop_orphan_fontface(css)

    # the invariant. Checked before the file is written, so a build that would
    # have shipped an invented rule fails instead.
    problems = verify_subset(css, LAYERS)
    if problems:
        print(f'\n!! {len(problems)} rule(s) in the output do not appear in the '
              f'source. NOTHING WRITTEN.')
        for p in problems[:12]:
            print('   ' + p)
        sys.exit(1)
    print('verified: every rule traces to a source layer')

    header = f"""/* ==========================================================================
   TALENTNEXT DESIGN SYSTEM
   Generated by design-system/build-ds.py — DO NOT EDIT THIS FILE.

   Extracted from hifi/build/*.css, in build.py's layer order, keeping the
   rules whose selectors belong to the shared vocabulary. Every rule below is
   a real rule from the hi-fi candidate portal in its real cascade position,
   so a page built on these class names comes out looking like that portal
   rather than like an approximation of it.

   To change the design system, change the layer in hifi/build/ that states
   the rule — the reasoning for every rule lives there as a comment, which is
   this project's convention — then re-run:

       cd design-system && python3 build-ds.py

   Rules kept: {stats['kept']}.  Rules dropped as product-specific: {stats['dropped']}.
   Fonts are embedded, so this one file is the whole dependency.
   Hover state layers are {'ARMED' if ARM_HOVER else 'disarmed, as in the portal'}.
   ========================================================================== */
"""
    out = HERE / 'talentnext-ds.css'
    out.write_text(header + css)
    print(f'\n{out.name}  {len(header+css)/1024:.0f} KB  '
          f'({stats["kept"]} rules kept, {stats["dropped"]} dropped)')

    # ---- the JS half: the icon set, verbatim, plus the two helpers a page
    # needs to use it. icons.js is already self-contained and already the
    # official Material filled cut (CLAUDE.md trap 7), so it is copied rather
    # than re-derived.
    icons = (SRC / 'icons.js').read_text()
    js_header = """/* ==========================================================================
   TALENTNEXT DESIGN SYSTEM — icons and helpers
   Generated by design-system/build-ds.py — DO NOT EDIT THIS FILE.
   The icon set is hifi/build/icons.js verbatim: 75 Material *filled* marks,
   the brand chevron, and the TalentNext lockup.

       document.body.insertAdjacentHTML('beforeend', I.calendar)  // <svg>
       inner('calendar')                                          // <path>
       TN_MARK                                                    // the logo
   ========================================================================== */
"""
    js_tail = """

/* ==========================================================================
   TWO HELPERS, AND ONLY TWO
   The portal's own render loop is 15 files of view functions and is not part
   of the design system — a second portal will have its own. What it does
   need is the frame's two behaviours: `dsFrame` stamps the container the
   layout queries (nothing responds to the window in this system — see the
   `container-type` note in §01), and `dsEnter` sets the one-render marker the
   entrance animations gate on.

   `data-enter` is a ONE-RENDER marker, which is CLAUDE.md's trap 5: layout
   must read persistent state, only motion may read this. It is removed on the
   next frame so a re-render for an unrelated reason does not replay the page.
   ========================================================================== */
function dsFrame(el){
  /* `container-type:inline-size` + `container-name:app` is what makes the
     breakpoints resolve against the frame instead of the browser window, so
     one document can show phone, tablet and desktop side by side. */
  el.style.containerType = 'inline-size';
  el.style.containerName = 'app';
  return el;
}

function dsEnter(app){
  app.setAttribute('data-enter', '');
  requestAnimationFrame(() =>
    requestAnimationFrame(() => app.removeAttribute('data-enter')));
}

/* The section entrance cascade reads `--i` off each child to stagger itself
   (26ms a step, stopping after eight — §13). render() in the portal stamps
   it; this does the same for any page. */
function dsStagger(page){
  [...page.children].forEach((el, i) => el.style.setProperty('--i', Math.min(i, 8)));
}
"""
    jsout = HERE / 'talentnext-ds.js'
    jsout.write_text(js_header + icons + js_tail)
    print(f'{jsout.name}  {(len(js_header)+len(icons)+len(js_tail))/1024:.0f} KB')

    # ======================================================================
    # THE UNCLASSIFIED REPORT
    # The last thing the build says, because it is the only thing that needs
    # a decision from a person. A class here has been DROPPED — silently, by
    # the default — and that is right for a one-screen detail and wrong for a
    # component another portal will want. Two ways to clear it:
    #   shared  -> add the name to SYSTEM, rebuild, it is in the design system
    #   product -> add its prefix to PRODUCT_PREFIXES, and it stops asking
    # Either way the choice is recorded in this file instead of in someone's
    # memory of a conversation.
    # ======================================================================
    if unclassified:
        by_layer = {}
        for cls, layer in unclassified.items():
            by_layer.setdefault(layer, []).append(cls)
        print(f'\n{"="*70}\nUNCLASSIFIED — {len(unclassified)} class name(s) are in neither '
              f'SYSTEM nor PRODUCT_PREFIXES,\nso they were DROPPED by default. Decide each: '
              f'shared (add to SYSTEM) or\nproduct (add its prefix to PRODUCT_PREFIXES).\n')
        for layer in LAYERS:
            if layer in by_layer:
                print(f'  {layer:24s} {" ".join("." + c for c in sorted(by_layer[layer]))}')
        print('=' * 70)
    else:
        print('\nno unclassified classes — every name in the layers is either '
              'in the\ndesign system or deliberately excluded')


if __name__ == '__main__':
    main()
