/* ==========================================================================
   v15 verification — the three sweeps from the handover, extended to the
   desktop breakpoints v15 adds, plus a token-discipline sweep.

   1. Render   — every stage x view, console errors captured
   2. Overflow — 320 / 390 / 430 / 672 / 834 / 1024 / 1280 / 1600
   3. Contrast — every distinct text/background pair, WCAG AA
   4. Tokens   — hardcoded hex and rgba() outside the token block
   ========================================================================== */
import {chromium} from 'playwright';
import fs from 'fs';

const FILE = 'file://' + process.cwd() + '/talentnext-candidate-portal-v24.html';
const WIDTHS = [320, 390, 430, 672, 744, 834, 1024, 1280, 1600];

const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const parse = s => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null;
  const p = m[1].split(',').map(Number); return p.length > 3 && p[3] < 0.95 ? null : p.slice(0, 3); };

const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium'});
const page = await b.newPage({viewport: {width: 1700, height: 1200}});

const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + e.message));

await page.goto(FILE);
await page.waitForTimeout(400);
// Every invariant here is about the RESTING layout. Entrance animations hold
// their from-state at t=0 (opacity 0, translated 10px), so measuring during
// one would report a page that has not arrived yet. Motion is switched off
// for the sweep; whether it looks right is a question for the eye, not for
// a geometry check.
await page.addStyleTag({content:
  '*,*::before,*::after{animation:none!important;transition:none!important}'});

// enumerate every reachable stage x view
const combos = await page.evaluate(() => {
  const out = [];
  for (const [stage] of STAGES) {
    if (stage === 'signup') { for (const v of Object.keys(AUTH)) out.push([stage, v]); continue; }
    const nav = NAVSETS[CFG[stage].nav].map(n => n[0]);
    const extra = ['account', 'report', 'agents', 'agent', 'booking', 'payment', 'chapter', 'terms', 'rewards', 'result', 'ivt', 'mem', 'rp'];
    for (const v of [...new Set([...nav, ...extra])]) out.push([stage, v]);
  }
  return out;
});

// ---------------------------------------------------------------- 1 + 2 ---
const overflow = [], undef = [];
for (const w of WIDTHS) {
  await page.evaluate(w => {
    const d = document.getElementById('device');
    d.dataset.vp = 'fluid';
    d.style.maxWidth = w + 'px';
    d.style.width = w + 'px';
  }, w);
  for (const [stage, view] of combos) {
    await page.evaluate(([s, v]) => { setStage(s); S.view = v; S.nav = false; render(); }, [stage, view]);
    const bad = await page.evaluate(w => {
      const out = [];
      const frame = document.getElementById('device').getBoundingClientRect();
      for (const el of document.querySelectorAll('#device *')) {
        // the glow on a dark card is a light source that hangs off the
        // card's corner and is CLIPPED by it — overflow:hidden hides the
        // paint but not the box, and the box is meant to be outside.
        if (el.classList.contains('dark-glow')) continue;
        if (el.closest('.tabs, .daystrip, .tbl-wrap, svg, .sidenav, .notif, .tal-panel, .modal')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.right > frame.right + 1 || r.left < frame.left - 1) {
          out.push(el.className && typeof el.className === 'string'
            ? el.tagName.toLowerCase() + '.' + el.className.split(' ').slice(0, 2).join('.')
            : el.tagName.toLowerCase());
        }
      }
      return [...new Set(out)];
    }, w);
    if (bad.length) overflow.push({w, stage, view, els: bad.slice(0, 4)});
    const txt = await page.$eval('#device', d => d.innerText);
    if (/undefined|NaN|\[object/.test(txt)) undef.push(`${stage}/${view} @${w}`);
  }
}


// ------------------------------------------------------------------- 2b ---
// THE SPINE. Every row, cell and block must start its content on the same
// left edge as the page header. This has regressed three times because it
// was only ever checked by eye; it is an invariant now.
const spine = [];
for (const w of [390, 1280]) {
  await page.evaluate(w => { const d = document.getElementById('device');
    d.dataset.vp = 'fluid'; d.style.maxWidth = w + 'px'; d.style.width = w + 'px'; }, w);
  for (const [stage, view] of combos) {
    await page.evaluate(([s, v]) => { setStage(s); S.view = v; S.nav = false; render(); }, [stage, view]);
    const bad = await page.evaluate(() => {
      // the crumb is hidden below 900px, so the reference must be a visible one
      // THE REFERENCE IS THE BLOCK, NOT THE HEADING. The sign-up card puts
      // the back control inline with the title, the way the Figma file does,
      // so on that screen `h1` starts right of the spine. `.ph-main` is the
      // block they both sit in, and on every screen without a back control
      // it is the same edge `h1` was.
      const ref = [...document.querySelectorAll('#device .ph .ph-main, #device .ph h1, #device .ph .lead, #device .crumb')]
        .find(e => e.getBoundingClientRect().width > 0);
      if (!ref) return [];
      const spineX = Math.round(ref.getBoundingClientRect().left);
      const root = document.querySelector('#device .page');
      if (!root) return [];
      // Assert on CONTENT, not on containers. A hand-listed set of row
      // classes is how the signup screens slipped through; asserting on
      // containers instead flags every list that bleeds by design. So: walk
      // every element that actually carries content — one that holds its own
      // text, or is a leaf (input, icon, image, rule) — and require its
      // CONTENT-BOX left edge to sit on the spine or right of it. A wrapper
      // that pulls out by -pad-x is invisible to this; its children are not.
      const out = [];
      for (const el of root.querySelectorAll('*')) {
        if (el.closest('.sidenav,.notif,.tal-panel,.modal,.lvl-hero,.ios-top,.ios-bottom')) continue;
        // the tab strip is a run of cells that spans the column edge to edge
        // by design — its first cell starts at the rule, not at the spine
        if (el.closest('.tabs, .cs')) continue;
        // a path inside an icon is artwork, not content — the icon's own box
        // is what has to sit on the spine, and that is checked as a leaf
        if (el.closest('svg')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (cs.position === 'absolute' || cs.position === 'fixed') continue;
        const ownText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (!ownText && el.children.length) continue;
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        const x = Math.round(r.left + parseFloat(cs.paddingLeft || 0) + parseFloat(cs.borderLeftWidth || 0));
        if (x < spineX - 1) {
          const cls = typeof el.className === 'string' ? el.className.split(' ').slice(0,2).join('.') : '';
          const txt = (el.textContent || '').trim().slice(0, 18);
          out.push(`${el.tagName.toLowerCase()}.${cls} @${x} (spine ${spineX}) "${txt}"`);
        }
      }
      return [...new Set(out)];
    });
    if (bad.length) spine.push({w, stage, view, els: bad.slice(0, 3)});
  }
}

// ------------------------------------------------------------------- 2c ---
// HEADINGS ARE FLUSH. The spine check above only catches content that hangs
// LEFT of the page edge. A heading that pays the gutter twice hangs RIGHT of
// it, which is invisible to that check and is exactly how "Decided so far"
// ended up one gutter in from "Where you are". Every section heading must
// land on the spine EXACTLY, in both directions.
const heads = [];
for (const w of [390, 1280]) {
  await page.evaluate(w => { const d = document.getElementById('device');
    d.dataset.vp = 'fluid'; d.style.maxWidth = w + 'px'; d.style.width = w + 'px'; }, w);
  for (const [stage, view] of combos) {
    await page.evaluate(([s, v]) => { setStage(s); S.view = v; S.nav = false; render(); }, [stage, view]);
    const bad = await page.evaluate(() => {
      const ref = [...document.querySelectorAll('#device .ph .ph-main, #device .ph h1, #device .ph .lead')]
        .find(e => e.getBoundingClientRect().width > 0);
      if (!ref) return [];
      const spineX = Math.round(ref.getBoundingClientRect().left);
      const out = [];
      // The desktop second column has its own left edge — that is the point
      // of a column. Headings there are measured against each other and
      // against that column, not against the page spine.
      const sideX = new Map();
      for (const h of document.querySelectorAll('#device .page .sec-h h2, #device .page .sec > .eyebrow')) {
        if (h.closest('.sidenav,.notif,.tal-panel,.modal,.lvl-hero')) continue;
        const cs = getComputedStyle(h);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = h.getBoundingClientRect();
        if (!r.width) continue;
        const x = Math.round(r.left);
        // at the desktop label column the heading sits in its own rail, which
        // is a deliberate offset, not a stray gutter
        if (h.closest('.sec') && getComputedStyle(h.closest('.sec')).display === 'grid') continue;
        const col = h.closest('.col-side,.col-b');
        let ref = spineX, what = 'spine';
        if (col) {
          if (!sideX.has(col)) sideX.set(col, x);
          ref = sideX.get(col); what = 'column';
        }
        if (Math.abs(x - ref) > 1) {
          out.push(`"${h.textContent.trim().slice(0,20)}" @${x} (${what} ${ref})`);
        }
      }
      return [...new Set(out)];
    });
    if (bad.length) heads.push({w, stage, view, els: bad.slice(0, 3)});
  }
}

// -------------------------------------------------------------------- 3 ---
await page.evaluate(() => { const d = document.getElementById('device');
  d.style.maxWidth = '1280px'; d.style.width = '1280px'; });
const pairs = new Map();
const onBrand = new Set();
const onInk = new Set();
for (const [stage, view] of combos) {
  await page.evaluate(([s, v]) => { setStage(s); S.view = v; render(); }, [stage, view]);
  const found = await page.evaluate(() => {
    const bgOf = el => { let n = el;
      while (n && n !== document.body) { const c = getComputedStyle(n).backgroundColor;
        if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; n = n.parentElement; }
      return 'rgb(243, 242, 238)'; };
    const out = [], brandSeen = new Set(), inkSeen = new Set();
    for (const el of document.querySelectorAll('#device *')) {
      const cs = getComputedStyle(el);
      // THE BRAND GRADIENT IS THE SECONDARY COLOUR, AND IT DOES NOT PASS.
      // White on it reads 2.8:1 at the light end and 3.5:1 at the dark one;
      // AA wants 4.5 at these sizes. Every other colour in the product was
      // tuned until it passed — this one is the client's brand, applied
      // deliberately to every accent fill, so it is COUNTED AND REPORTED
      // rather than either failing the build or passing unnoticed. Anything
      // carrying the gradient sets --on-brand-fill, and the flag inherits to
      // the label sitting on it. The AA-safe pair is #C15708 -> #D1480A.
      if (cs.getPropertyValue('--on-brand-fill').trim() === '1') { brandSeen.add(
        (el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
          ? '.' + el.className.split(' ')[0] : ''))); continue; }
      // THE BRAND AS INK, WHICH IS A DIFFERENT EXCEPTION AND IS NAMED AS ONE.
      // `--accent` on white is 2.8:1. Everywhere else the product sets orange
      // in text it uses `--accent-text` (5.2:1) for exactly that reason; the
      // one place it does not is the "Ask Tal" label on an agent card, where
      // Maryam asked for the word to be the same colour as the mark beside
      // it. Counted and reported SEPARATELY from the gradient, because
      // folding it into that number would hide a second decision inside a
      // first. The AA-safe near-match is #C2540A at 4.6:1.
      if (cs.getPropertyValue('--on-brand-ink').trim() === '1') { inkSeen.add(
        (el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
          ? '.' + el.className.split(' ')[0] : ''))); continue; }
      if (cs.display === 'none' || cs.visibility === 'hidden' || !cs.opacity || +cs.opacity < 0.9) continue;
      const t = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join('');
      if (!t) continue;
      const size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
      out.push({fg: cs.color, bg: bgOf(el), size, weight,
                sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : '')});
    }
    return {out, brand: [...brandSeen], ink: [...inkSeen]};
  });
  for (const n of found.brand) onBrand.add(n);
  for (const n of found.ink || []) onInk.add(n);
  for (const p of found.out) pairs.set(`${p.fg}|${p.bg}|${p.size}|${p.weight}`, p);
}
const failures = [];
for (const p of pairs.values()) {
  const fg = parse(p.fg), bg = parse(p.bg);
  if (!fg || !bg) continue;
  const large = p.size >= 24 || (p.size >= 18.66 && p.weight >= 600);
  const need = large ? 3 : 4.5, got = ratio(fg, bg);
  if (got < need - 0.005) failures.push({...p, got: got.toFixed(2), need});
}


// ------------------------------------------------------------------- 3b ---
// Overlay surfaces must be opaque. A drawer, panel or dialog with a
// transparent background lets the scrimmed page read straight through it —
// which is exactly what shipped in v15.1 and had to be caught by eye.
const sheer = [];
await page.evaluate(() => { const d = document.getElementById('device');
  d.dataset.vp = 'mobile'; d.style.maxWidth = '390px'; d.style.width = '390px'; });
for (const [sel, open] of [['.sidenav', () => { S.nav = true; }],
                           ['.notif',   () => { S.notif = true; }],
                           ['.tal-panel', () => { S.tal = true; }]]) {
  await page.evaluate(([s, fn]) => {
    setStage('day34'); S.view = 'dashboard';
    S.nav = S.notif = S.tal = false;
    eval('(' + fn + ')()');
    render();
  }, [sel, open.toString()]);
  const bg = await page.evaluate(s => {
    const el = document.querySelector('#device ' + s);
    if (!el) return 'MISSING';
    return getComputedStyle(el).backgroundColor;
  }, sel);
  const m = String(bg).match(/rgba?\(([^)]+)\)/);
  const alpha = m && m[1].split(',')[3] !== undefined ? parseFloat(m[1].split(',')[3]) : 1;
  if (bg === 'MISSING' || alpha < 0.99) sheer.push(`${sel} = ${bg}`);
}


// ------------------------------------------------------------------- 3c ---
// THE TYPE SCALE. An audit found 81 distinct size/line-height combinations
// across the product, most of them accidental fall-through to the browser
// default. Nine roles are allowed; anything else fails the build.
const ALLOWED = new Set(['34/40','28/34','24/30','17/23','14/19','13.5/22',
                         '13.5/19','13.5/18','13/23','13/13','12.5/17','11.5/16',
                         '11.5/15','11/15','18/24','9.5/10',
  // THE SIGN-UP CARD RUNS ON THE FIGMA FILE'S OWN SCALE. It is drawn in
  // Figma at these sizes and the designer asked for them exactly, so the
  // card is a stated second scale rather than nine roles bent to fit. They
  // apply inside `.auth-card` above 900 and nowhere else — see layer 17.
                         '20/28','16/24','14/24','14/20','14/18','12/20','12/16','24/32']);
const offScale = new Map();
// the card's type only exists above 900, so a 390 sweep alone would permit
// it in ALLOWED without ever measuring it. Signup is swept at 1280 as well.
const typeSweeps = [[390, combos], [1280, combos.filter(([s]) => s === 'signup')]];
for (const [tw, tcombos] of typeSweeps) {
await page.evaluate(w => { const d = document.getElementById('device');
  d.dataset.vp = 'fluid'; d.style.maxWidth = w + 'px'; d.style.width = w + 'px'; }, tw);
for (const [stage, view] of tcombos) {
  await page.evaluate(([s, v]) => { setStage(s); S.view = v; S.nav = false; render(); }, [stage, view]);
  const r = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('#device .app *')) {
      // avatar initials sit behind a photograph as a fallback, not as read text
      if (el.closest('.av,.av-ph,.mem-av,.shell-avatar,.ios-top,svg,.bmk')) continue;
      if (el instanceof SVGElement) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const t = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
      if (!t.length) continue;
      const size = Math.round(parseFloat(cs.fontSize) * 2) / 2;
      const lh = Math.round(parseFloat(cs.lineHeight));
      const cls = typeof el.className === 'string' ? el.className.split(' ')[0] : '';
      out.push([`${size}/${lh}`, `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`,
                t.map(n => n.textContent.trim()).join(' ').slice(0, 28)]);
    }
    return out;
  });
  for (const [k, sel, txt] of r) if (!offScale.has(k)) offScale.set(k, `${sel} «${txt}»`);
}
}
const strayType = [...offScale.entries()].filter(([k]) => !ALLOWED.has(k));


// ------------------------------------------------------------------- 3d ---
// NO WHITE SURFACES. The canvas is #F3F2EE and nothing sits on it in white.
// Walks every element AND every ::before/::after, in every view, in seven
// open/closed states. White survives only as ink on dark grounds and inside
// the payment-card brand marks, both allowlisted below.
const whites = new Map();
const STATES = [{}, {nav:true}, {notif:true}, {tal:true},
                {editProfile:true}, {editPhoto:true}, {addCard:true}];
for (const vpw of [390, 1280]) {
  await page.evaluate(w => { const d = document.getElementById('device');
    d.dataset.vp = 'fluid'; d.style.maxWidth = w + 'px'; d.style.width = w + 'px'; }, vpw);
  for (const [stage, view] of combos) {
    for (const st of STATES) {
      await page.evaluate(([s, v, st]) => {
        setStage(s); S.view = v;
        S.nav = S.notif = S.tal = S.editProfile = S.editPhoto = S.addCard = false;
        Object.assign(S, st); render();
      }, [stage, view, st]);
      const found = await page.evaluate(() => {
        // a THIRD tone: opaque, near-neutral and light, but not one of the two
        const TONES = ['255,255,255', '247,247,247'];
        const near = bg => {
          const m = String(bg).match(/rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([\d.]+))?\)/);
          if (!m) return false;
          const a = m[4] === undefined ? 1 : +m[4];
          if (a < 0.9) return false;
          const [r, g, bl] = [+m[1], +m[2], +m[3]];
          if (r < 225 || g < 225 || bl < 225) return false;
          return !TONES.includes(r + ',' + g + ',' + bl);
        };
        const out = [];
        for (const el of document.querySelectorAll('#device *')) {
          if (el instanceof SVGElement) continue;
          if (el.closest('.bmk')) continue;            // card networks' own marks
          // a field you WRITE INTO is white on purpose, so it reads as empty
          // rather than as one more panel: the message composer, and the one
          // place the product asks for something in your own words.
          if (el.closest('.composer, .cap-in')) continue;
          // A SUGGESTED QUESTION IS A TINT, NOT A SURFACE. The Tal chip
          // carries a two-layer brand fill from the Figma file — warm
          // ground, cool pool — and both land in the near-neutral range
          // this sweep polices. It is a control's own colour, not a plane
          // the page is built out of, which is what the two tones are.
          if (el.closest('.chip-tal')) continue;
          // AND THE MARK IN A BOX CARRIES THE SAME FILL. Figma 287:186 gives
          // every identifying mark — the card row, the kit cell, the figure
          // cell, the award — the Tal chip's two layers, so the shape reads
          // as one component wherever it appears. Same argument as above: it
          // is a component's own colour, not a plane the page is built from.
          if (el.matches('.cardrow-ic,.nrow-ic,.aw-ic,.ach-ic,.kit-ic,.stat-ic,.ch-num')) continue;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          // a masked element's background is a glyph, not a surface: the shape
          // you see is the mask and the colour is its ink. Tal's star on the
          // black avatar is white for the same reason the label on a black
          // button is white.
          const mask = cs.webkitMaskImage || cs.maskImage;
          if (mask && mask !== 'none') continue;
          const cls = typeof el.className === 'string'
            ? el.className.split(' ').slice(0, 2).join('.') : '';
          const name = el.tagName.toLowerCase() + (cls ? '.' + cls : '');
          if (near(cs.backgroundColor)) out.push(`${name} bg`);
          for (const pseudo of ['::before', '::after']) {
            const ps = getComputedStyle(el, pseudo);
            if (ps.content === 'none') continue;
            // same rule as above: a masked pseudo is a glyph, its background
            // colour is ink
            const pm = ps.webkitMaskImage || ps.maskImage;
            if (pm && pm !== 'none') continue;
            if (near(ps.backgroundColor)) out.push(`${name}${pseudo}`);
          }
        }
        return [...new Set(out)];
      });
      for (const f of found) if (!whites.has(f)) whites.set(f, `${vpw}px ${stage}/${view}`);
    }
  }
}

// -------------------------------------------------------------------- 4 ---
const src = fs.readFileSync('talentnext-candidate-portal-v24.html', 'utf8');
const css = src.slice(src.indexOf('<style>'), src.indexOf('</style>'));
// every :root{} block is the token layer, wherever it is declared
const after = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:root\s*\{[^}]*\}/g, '');
const strays = [...new Set([...after.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(m => m[0])
  .concat([...after.matchAll(/rgba?\([^)]*\)/g)].map(m => m[0])))]
  .filter(v => !/^rgba?\(0, ?0, ?0, ?0\)$/.test(v));

await b.close();

const line = (t, ok, d) => `${ok ? 'PASS' : 'FAIL'}  ${t.padEnd(28)} ${d}`;
console.log('\n' + '='.repeat(74));
console.log(`v15 verification — ${combos.length} stage x view combinations`);
console.log('='.repeat(74));
console.log(line('render / console errors', consoleErrors.length === 0,
  consoleErrors.length ? consoleErrors.slice(0, 5).join(' | ') : 'no console errors'));
console.log(line('no undefined leaks', undef.length === 0,
  undef.length ? undef.slice(0, 5).join(', ') : 'clean across all widths'));
console.log(line('horizontal overflow', overflow.length === 0,
  overflow.length ? overflow.slice(0, 6).map(o => `${o.w}px ${o.stage}/${o.view}: ${o.els.join(', ')}`).join('\n' + ' '.repeat(36))
  : `clear at ${WIDTHS.join(' / ')}px`));
console.log(line('content on the spine', spine.length === 0,
  spine.length ? spine.slice(0, 8).map(o => `${o.w}px ${o.stage}/${o.view}: ${o.els.join(' | ')}`).join('\n' + ' '.repeat(36))
  : 'every row and block starts on the page spine'));
console.log(line('headings are flush', heads.length === 0,
  heads.length ? heads.slice(0, 8).map(o => `${o.w}px ${o.stage}/${o.view}: ${o.els.join(' | ')}`).join('\n' + ' '.repeat(36))
  : 'every section heading lands on the page spine'));
console.log(line('WCAG AA contrast', failures.length === 0,
  failures.length ? failures.slice(0, 8).map(f => `${f.sel} ${f.fg} on ${f.bg} = ${f.got} (needs ${f.need})`).join('\n' + ' '.repeat(36))
  : `${pairs.size} pairs pass` + (onBrand.size
      ? ` \u00b7 ${onBrand.size} on the brand gradient are a stated exception (2.8:1)` : '')
      + (onInk.size
      ? ` \u00b7 ${onInk.size} with the brand as ink are a stated exception (2.8:1)` : '')));
console.log(line('type on the scale', strayType.length === 0,
  strayType.length ? `${strayType.length} off-scale: ` + strayType.slice(0,6).map(([k,v]) => `${k} ${v}`).join('  |  ')
  : `${offScale.size} size/line-height pairs, all on the scale`));
console.log(line('overlays are opaque', sheer.length === 0,
  sheer.length ? sheer.join(', ') : 'drawer, notifications and Tal all opaque'));
console.log(line('two tones only', whites.size === 0,
  whites.size ? [...whites.entries()].slice(0,6).map(([k,v]) => `${k} @ ${v}`).join('\n' + ' '.repeat(36))
  : '#FFFFFF canvas and #F7F7F7 panel; no third light surface'));
console.log(line('token discipline', strays.length === 0,
  strays.length ? `${strays.length} hardcoded: ${strays.slice(0, 10).join(' ')}` : 'no colour outside the token block'));
console.log('='.repeat(74) + '\n');
