#!/usr/bin/env python3
"""Split the surviving build's JS into a verbatim data layer and a view layer.

The data — copy, agents, notifications, Tal's routes, the LSVT points tables —
is the expensive part of the prior work and is carried across untouched.
Order matters: declarations are emitted in dependency order, not alphabetically.
"""
import re, pathlib

js = pathlib.Path('orig-full.js').read_text()

def span(name):
    m = re.search(r'\n\s*(?:const|let|var)\s+' + re.escape(name) + r'\s*=\s*', js)
    if not m: return None
    i = m.end(); opens = {'{': '}', '[': ']', '(': ')'}
    if js[i] in '"\'`':                      # string literal — data URIs contain ';'
        q = js[i]; j = i + 1
        while j < len(js):
            if js[j] == '\\': j += 2; continue
            if js[j] == q: break
            j += 1
        return (m.start() + 1, js.find(';', j) + 1)
    if js[i] not in opens:
        return (m.start() + 1, js.find(';', i) + 1)
    stack = []; j = i; instr = None
    while j < len(js):
        c = js[j]
        if instr:
            if c == '\\': j += 2; continue
            if c == instr: instr = None
        else:
            if c in '"\'`': instr = c
            elif c in opens: stack.append(opens[c])
            elif c in '}])':
                stack.pop()
                if not stack: j += 1; break
        j += 1
    return (m.start() + 1, j)

DATA = ['LOGO_K','LOGO_W','LOGO_D','STAGES','CFG','CFG_BASE','RUNG','CH','SCORE',
        'OPEN_DATES','GROWTH','NOTIF','NAVSETS','PARENT','AV','AGENTS','TALCTX',
        'TAL_ROUTES','PTS','BDG','RANKS','GAME','WEEK_TARGET','ACH','SPLIT','SERIES',
        'POSTS','MKF','mkFrame','BMK']          # MKF and mkFrame precede BMK, which uses them
DROP = DATA + ['I','PG','GFX','PAL','LIME','TALMARK']   # Carbon icons, pictograms, illustrations

out = []
for n in DATA:
    sp = span(n)
    if not sp: print('MISS', n); continue
    t = js[sp[0]:sp[1]].rstrip()
    out.append(t if t.endswith(';') else t + ';')
pathlib.Path('data.js').write_text('\n\n'.join(out))

spans = sorted(s for s in (span(n) for n in DROP) if s)
rest, prev = [], 0
for a, b in spans:
    rest.append(js[prev:a]); prev = b
rest.append(js[prev:])
views = re.sub(r'\n{3,}', '\n\n', ''.join(rest))
views = views[:views.rindex('</script>')]
pathlib.Path('views-orig.js').write_text(views)

print(f'data.js {len(open("data.js").read()):,}   views-orig.js {len(views):,}')
