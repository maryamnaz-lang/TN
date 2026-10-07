#!/usr/bin/env python3
"""
DEV HANDOFF EXPORT — one folder per portal, as ordinary files.

    cd handoff && python3 export.py

Writes handoff/candidate-portal, handoff/cohort-leader-portal and
handoff/talent-agent-portal. Each is the WORKING prototype, unbundled:

    index.html   the page shell
    css/         the stylesheets
    js/          the scripts, one file per source file where it can be recovered
    images/      photos, covers, badges, artwork
    logos/       brand and issuer marks
    fonts/       the web fonts
    media/       video and audio

Nothing here is hand-edited and nothing is re-typed: the script reads the
BUILT portals (hifi/talentnext-candidate-portal-v24.html, tn-agent-portal.html
and the design-system files it links), pulls every inline <style>/<script> out
into a file, and decodes every base64 data URI into a real file with a
readable name. Re-run it after any rebuild and the folders follow.

The candidate and cohort-leader portals are ONE app (the same renderer, a
different signed-in user), so their folders hold the same code; the leader's
index.html opens on the leader's dashboard (#leader).
"""
import base64, hashlib, pathlib, re, shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'handoff'
HIFI = ROOT / 'hifi' / 'talentnext-candidate-portal-v24.html'
HIFI_SRC = ROOT / 'hifi' / 'build'
AGENT = ROOT / 'tn-agent-portal.html'
DS = ROOT / 'design-system'

EXT = {'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg',
       'image/gif': 'gif', 'image/svg+xml': 'svg', 'font/woff2': 'woff2', 'font/woff': 'woff',
       'font/otf': 'otf', 'font/ttf': 'ttf', 'application/font-woff2': 'woff2',
       'video/webm': 'webm', 'video/mp4': 'mp4', 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3',
       'audio/wav': 'wav'}
DATA = re.compile(r'data:([\w/+.-]+);base64,([A-Za-z0-9+/=]{64,})')
LOGO = re.compile(r'logo|wordmark|issuer|pf-?art|social|tal-mark|auth-mark|brand-mark|bmk', re.I)


def slug(s):
    s = re.sub(r'[^A-Za-z0-9]+', '-', s).strip('-').lower()
    return s[:60] or 'asset'


class Assets:
    """Decodes data URIs into files, de-duplicated by content."""

    def __init__(self, base):
        self.base = base
        self.by_hash = {}
        self.names = set()

    def _folder(self, mime, name):
        if mime.startswith('font/') or 'font' in mime:
            return 'fonts'
        if mime.startswith(('video/', 'audio/')):
            return 'media'
        return 'logos' if LOGO.search(name) else 'images'

    def save(self, mime, payload, hint):
        raw = base64.b64decode(payload)
        h = hashlib.sha1(raw).hexdigest()
        if h in self.by_hash:
            return self.by_hash[h]
        ext = EXT.get(mime, mime.split('/')[-1].split('+')[0])
        name = slug(hint) if hint else 'asset-' + h[:8]
        folder = self._folder(mime, name)
        stem, n = name, 2
        while f'{folder}/{stem}.{ext}' in self.names:
            stem = f'{name}-{n}'; n += 1
        rel = f'{folder}/{stem}.{ext}'
        self.names.add(rel)
        p = self.base / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(raw)
        self.by_hash[h] = rel
        return rel


def hint_js(text, i):
    """Name a data URI inside JS from the identifier it is assigned to."""
    back = text[max(0, i - 400):i]
    key = re.search(r'([A-Za-z_$][\w$]*)\s*[:=]\s*[\'"`]$', back)
    key = key.group(1) if key else ''
    owner = None
    for m in re.finditer(r'(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=', text[:i]):
        owner = m.group(1)
    if owner and key and owner != key:
        return f'{owner}-{key}'
    return key or owner or ''


def hint_css(text, i):
    """Name a data URI inside CSS from its @font-face or custom property."""
    back = text[max(0, i - 600):i]
    ff = re.search(r'@font-face\s*\{[^}]*$', back)
    if ff:
        fam = re.search(r'font-family\s*:\s*[\'"]?([^;\'"]+)', ff.group(0))
        wt = re.search(r'font-weight\s*:\s*([^;]+)', text[i:i + 99999].split('}')[0] + ff.group(0))
        return (fam.group(1) if fam else 'font') + ('-' + wt.group(1).strip() if wt else '')
    var = list(re.finditer(r'(--[\w-]+)\s*:', back))
    if var:
        return var[-1].group(1)
    sel = re.search(r'([^{}]+)\{[^{}]*$', back)
    if not sel:
        return ''
    toks = re.findall(r'[\w-]+', sel.group(1).split(',')[-1])
    return toks[-1] if toks else ''


def extract(text, assets, kind, prefix=''):
    """Replace every base64 data URI with a path to a real file."""
    hint = hint_css if kind == 'css' else hint_js
    out, last = [], 0
    for m in DATA.finditer(text):
        rel = assets.save(m.group(1), m.group(2), hint(text, m.start()))
        out.append(text[last:m.start()])
        out.append(prefix + rel)
        last = m.end()
    out.append(text[last:])
    return ''.join(out)


HIFI_JS_ORDER = None


def split_hifi_js(js):
    """The hifi bundle is generated consts + the source files concatenated,
    with line-start block comments stripped. Find each source file's stripped
    text in the bundle and cut there, so the dev gets data.js, views.js, …"""
    strip = lambda t: re.sub(r'^[ \t]*/\*[\s\S]*?\*/[ \t]*\n?', '', t, flags=re.M)
    hits = []
    for f in HIFI_SRC.glob('*.js'):
        t = strip(f.read_text())
        i = js.find(t)
        if i >= 0 and t.strip():
            hits.append((i, i + len(t), f.name))
    hits.sort()
    # the build's own load order, so a chunk that did not match verbatim can
    # still be named by the one file it must be
    src = (HIFI_SRC / 'build.py').read_text()
    seg = src[src.index("js = award_js"):src.index('_js_before')]
    order = re.findall(r"'([\w-]+\.js)'", seg)
    def gap_name(prev, nxt):
        try:
            a = order.index(prev) + 1 if prev else 0
            b = order.index(nxt) if nxt else len(order)
        except ValueError:
            return None
        miss = order[a:b]
        return miss[0] if len(miss) == 1 else None
    parts, pos, prev = [], 0, None
    for a, b, name in hits:
        if a < pos:  # nested/duplicate match, skip
            continue
        if js[pos:a].strip():
            nm = '00-generated-assets.js' if pos == 0 else (gap_name(prev, name) or f'glue-{len(parts):02d}.js')
            parts.append((nm, js[pos:a]))
        parts.append((name, js[a:b]))
        pos, prev = b, name
    if js[pos:].strip():
        parts.append(('99-prototype-frame.js', js[pos:]))
    # number them in load order so the folder lists the way the page loads
    return [(f'{i:02d}-{n.split("-", 1)[1] if n[:2].isdigit() else n}', body)
            for i, (n, body) in enumerate(parts, 1)]


def unbundle(html, base, assets, css_name, js_names=None):
    """Pull inline <style>/<script> blocks into files; return the new HTML."""
    (base / 'css').mkdir(parents=True, exist_ok=True)
    (base / 'js').mkdir(parents=True, exist_ok=True)
    n_css = [0]
    # HTML comments can mention <style>/<script> in prose; keep them out of
    # the matching so a comment is never read as a tag
    comments = []
    def keep(m):
        comments.append(m.group(0))
        return f'\x00C{len(comments)-1}\x00'
    html = re.sub(r'<!--.*?-->', keep, html, flags=re.S)

    def do_style(m):
        n_css[0] += 1
        name = css_name if n_css[0] == 1 else f'{pathlib.Path(css_name).stem}-{n_css[0]}.css'
        body = extract(m.group(1), assets, 'css', '../')
        (base / 'css' / name).write_text(body.strip() + '\n')
        return f'<link rel="stylesheet" href="css/{name}">'

    html = re.sub(r'<style\b[^>]*>(.*?)</style>', do_style, html, flags=re.S)

    scripts = list(re.finditer(r'<script\b([^>]*)>(.*?)</script>', html, re.S))
    out, last = [], 0
    for k, m in enumerate(scripts, 1):
        out.append(html[last:m.start()])
        attrs, body = m.group(1), m.group(2)
        if 'src=' in attrs or not body.strip():
            out.append(m.group(0))
        else:
            pieces = js_names(body) if (js_names and len(body) > 200000) else [(f'00-boot-{k}.js', body)]
            tags = []
            for name, code in pieces:
                code = extract(code, assets, 'js')
                (base / 'js' / name).write_text(code.strip() + '\n')
                tags.append(f'<script src="js/{name}"></script>')
            out.append('\n'.join(tags))
        last = m.end()
    out.append(html[last:])
    html = ''.join(out)
    return re.sub(r'\x00C(\d+)\x00', lambda m: comments[int(m.group(1))], html)


README = """# {title}

Working front-end prototype of the TalentNext {title}, unbundled into ordinary files.
It is the visual and behavioural reference: every screen, state and flow can be clicked
through. It is prototype code with hardcoded sample data and no backend.

## Run it

Browsers block some files when a page is opened straight from disk, so serve the folder:

```bash
python3 -m http.server 8000
```

then open http://localhost:8000 . The frame at the top switches Mobile / Tablet / Desktop.

## What is where

| Folder | Contents |
|---|---|
| `index.html` | the page shell |
| `css/` | the stylesheets{css_note} |
| `js/` | the scripts, loaded in the numbered order{js_note} |
| `images/` | photos, course covers, badges, artwork |
| `logos/` | brand and issuer marks |
| `fonts/` | web fonts (Plus Jakarta Sans and others) |
| `media/` | video and audio (Tal's animated mark, voice) |

{extra}
Exported {date} from the TalentNext prototype repository.
"""


def write_readme(base, title, css_note='', js_note='', extra=''):
    import datetime
    (base / 'README.md').write_text(README.format(title=title, css_note=css_note, js_note=js_note,
                                                  extra=extra, date=datetime.date.today().isoformat()))


def export_hifi(folder, title, hash_=None, extra=''):
    base = OUT / folder
    if base.exists():
        shutil.rmtree(base)
    base.mkdir(parents=True)
    assets = Assets(base)
    html = HIFI.read_text()
    if hash_:
        # open on this portal when no deep link is given
        html = html.replace('<head>', '<head>\n<script>if(!location.hash)history.replaceState(null,"","#'
                            + hash_ + '")</script>', 1)
    html = unbundle(html, base, assets, 'portal.css', split_hifi_js)
    (base / 'index.html').write_text(html)
    write_readme(base, title,
                 css_note=' (`portal.css` is the full design: tokens, components and every screen; `portal-2.css` is the prototype frame around the device)',
                 js_note=': `icons.js` the icon set, `data.js` the sample data, `views.js` the screens, `ai*.js` Tal (the AI assistant), `lead*.js` the cohort-leader screens, `ob.js` onboarding, `orb*.js` Tal\'s animated mark; `00-generated-assets.js` maps image names to files',
                 extra=extra)
    return base, assets


def export_agent():
    base = OUT / 'talent-agent-portal'
    if base.exists():
        shutil.rmtree(base)
    base.mkdir(parents=True)
    assets = Assets(base)
    html = AGENT.read_text()
    # the design system it links becomes two ordinary files in the folder
    (base / 'css').mkdir(parents=True, exist_ok=True)
    (base / 'js').mkdir(parents=True, exist_ok=True)
    ds_css = extract((DS / 'talentnext-ds.css').read_text(), assets, 'css', '../')
    (base / 'css' / 'design-system.css').write_text(ds_css)
    ds_js = extract((DS / 'talentnext-ds.js').read_text(), assets, 'js')
    (base / 'js' / '01-design-system.js').write_text(ds_js)
    html = re.sub(r'href="design-system/talentnext-ds\.css[^"]*"', 'href="css/design-system.css"', html)
    html = re.sub(r'src="design-system/talentnext-ds\.js[^"]*"', 'src="js/01-design-system.js"', html)
    html = unbundle(html, base, assets, 'agent-portal.css',
                    lambda body: [('02-agent-portal.js', body)])
    # local files the page references by path
    css_dir = base / 'css'
    for f in css_dir.glob('*.css'):
        t = f.read_text()
        for ref in sorted(set(re.findall(r'design-system/([\w.-]+\.(?:svg|webp|png|jpg))', t))):
            (base / 'images').mkdir(exist_ok=True)
            shutil.copy2(DS / ref, base / 'images' / ref)
            t = t.replace('design-system/' + ref, '../images/' + ref)
        f.write_text(t)
    for ref in sorted(set(re.findall(r'assets/[\w./-]+\.\w+', html))):
        src = ROOT / ref
        if src.exists():
            dst = base / 'images' / src.name
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            html = html.replace(ref, f'images/{src.name}')
    (base / 'index.html').write_text(html)
    write_readme(base, 'Talent Agent portal',
                 css_note=' (`design-system.css` is the shared TalentNext design system; `agent-portal.css` holds this portal\'s own additions)',
                 js_note=': `01-design-system.js` shared helpers and components, `02-agent-portal.js` this portal\'s data and screens')
    return base, assets


def report(base, assets):
    files = [p for p in base.rglob('*') if p.is_file()]
    size = sum(p.stat().st_size for p in files)
    by = {}
    for p in files:
        k = p.relative_to(base).parts[0] if len(p.relative_to(base).parts) > 1 else '.'
        by[k] = by.get(k, 0) + 1
    print(f'{base.name}: {len(files)} files, {size/1024/1024:.1f} MB  ' +
          '  '.join(f'{k}/ {v}' for k, v in sorted(by.items())))


if __name__ == '__main__':
    report(*export_hifi('candidate-portal', 'Candidate portal'))
    report(*export_hifi('cohort-leader-portal', 'Cohort Leader portal', hash_='leader',
                        extra='This folder opens on the cohort leader\'s dashboard (`#leader`). The candidate and '
                              'cohort leader portals are the same application with a different signed-in user, '
                              'so the code here matches the candidate folder.\n'))
    report(*export_agent())
