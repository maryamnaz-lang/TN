#!/usr/bin/env python3
"""where.py — WHERE DOES THIS CHANGE LIVE?

    python3 design-system/where.py askline askdock ai-run
    python3 design-system/where.py .dark-card

For each class it answers the one question that decides how a change is made
(DESIGN.md §6): is this a DESIGN-SYSTEM change or a one-file change?

  stated in   — the hifi/build layers that write a rule for it (file:line, count)
  shipped     — whether talentnext-ds.css carries it (so every portal on the box has it)
  written by  — which portal files emit the class in markup or JS, with counts

The rule that falls out, printed at the end:
  shipped and/or written by more than one portal  →  change the LAYER in hifi/build/,
                                                    rebuild both, verify on every portal
                                                    that writes it
  written by exactly one file and stated in no layer →  change that file
  stated in a layer but written by nothing        →  the "gate nothing writes" tell;
                                                    say so before adding a caller

Written 4 Sep 2026 after Maryam asked how any model, not just the one in the
room, could see "this is a design-system change" as quickly. It is grep, so
it is the same answer on every machine and in every session.
"""
import re, sys, pathlib, glob

ROOT = pathlib.Path(__file__).resolve().parent.parent
LAYERS = sorted(glob.glob(str(ROOT / 'hifi/build/*.css')))
DS = ROOT / 'design-system/talentnext-ds.css'
WRITERS = ['tn-agent-portal.html', 'tn-admin-portal.html', 'tn-admin.html', 'tn-portals.html',
           'tn-new-portal.html', 'design-system/gallery.html', 'design-system/starter.html']
HIFI_JS = sorted(glob.glob(str(ROOT / 'hifi/build/*.js')))

def strip_comments(s): return re.sub(r'/\*.*?\*/', '', s, flags=re.S)

def stated_in(cls):
    out = []
    for f in LAYERS:
        t = pathlib.Path(f).read_text(errors='ignore')
        code = strip_comments(t)
        n = len(re.findall(r'\.%s(?![\w-])' % re.escape(cls), code))
        if n:
            first = next((i + 1 for i, l in enumerate(t.split('\n')) if re.search(r'\.%s(?![\w-])' % re.escape(cls), l) and not l.lstrip().startswith(('*', '/*'))), '?')
            out.append((pathlib.Path(f).name, first, n))
    return out

def written_by(cls):
    out = []
    pat = re.compile(r'\b%s\b' % re.escape(cls))
    for w in WRITERS:
        p = ROOT / w
        if not p.exists(): continue
        t = p.read_text(errors='ignore')
        n = sum(1 for m in re.finditer(r'class=["\'`][^"\'`]*["\'`]|class="[^"]*"', t) if pat.search(m.group(0)))
        n += len(re.findall(r"classList\.(?:add|toggle|contains)\(['\"]%s['\"]" % re.escape(cls), t))
        if n: out.append((w, n))
    hn = 0
    for f in HIFI_JS:
        t = strip_comments(pathlib.Path(f).read_text(errors='ignore'))
        hn += len(re.findall(r'(?:class=|className\s*=|classList\.(?:add|toggle))[^;\n]*\b%s\b' % re.escape(cls), t))
    if hn: out.insert(0, ('hifi/ (compiled, candidate + leader)', hn))
    return out

def main(args):
    if not args:
        print(__doc__); return 2
    ds = strip_comments(DS.read_text(errors='ignore')) if DS.exists() else ''
    for raw in args:
        cls = raw.lstrip('.')
        st, wr = stated_in(cls), written_by(cls)
        shipped = bool(re.search(r'\.%s(?![\w-])' % re.escape(cls), ds))
        print(f'\n.{cls}')
        print('  stated in : ' + (', '.join(f'{f}:{l} (x{n})' for f, l, n in st) if st else 'no layer'))
        print('  shipped   : ' + ('yes — talentnext-ds.css' if shipped else 'no'))
        print('  written by: ' + (', '.join(f'{w} (x{n})' for w, n in wr) if wr else 'nothing'))
        portals = [w for w, _ in wr]
        if st and not wr: verdict = 'stated, written by nothing — the "gate nothing writes" tell; say so before adding a caller'
        elif shipped or len(portals) > 1: verdict = 'DESIGN-SYSTEM change → edit the layer in hifi/build/, run both builds, verify on: ' + (', '.join(portals) or 'every portal')
        elif len(portals) == 1 and not st: verdict = f'one-file change → edit {portals[0]}'
        elif len(portals) == 1: verdict = f'stated in a layer, drawn by one file → still a layer change (the box ships it); verify on {portals[0]}'
        else: verdict = 'unknown class — check the spelling, or it is new (then it is a new layer in BOTH build lists)'
        print('  → ' + verdict)
    return 0

if __name__ == '__main__': sys.exit(main(sys.argv[1:]))
