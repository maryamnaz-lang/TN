/* ==========================================================================
   DESIGNCHECK — "does this portal obey DESIGN.md?"

   The computed half of the checklist in /DESIGN.md §2–§3, swept at the four
   widths respcheck uses. respcheck asks whether a layout is BROKEN; this asks
   whether it is OFF-SPEC while rendering perfectly — a 600 weight, a 15px
   heading, a rounded corner, a hairline in the old grey, a word set in caps.
   Every one of those has shipped here without warning (§63's sweep found 26
   sizes against nine stated), which is why the check is computed off the
   rendered DOM rather than grepped out of the source.

   It takes any portal:
       node designcheck.mjs                              # hifi (candidate + leader)
       node designcheck.mjs --url=../tn-agent-portal.html
       node designcheck.mjs --url=../tn-admin.html
       node designcheck.mjs --widths=390,1280 --quiet

   When the page exposes STAGES / NAVSETS (hifi) the screens are enumerated
   the way respcheck does. Otherwise it walks the rail: every element carrying
   data-go / data-view / data-nav / data-mod / data-ag inside nav, .rail or .sn,
   one screen each, capped at 40.

   The browser bootstrap is respcheck's, by copy — that file exports nothing.
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const opt = k => { const a = argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const QUIET = has('--quiet');

const urlArg = opt('url');
const TARGET = urlArg
  ? (/^https?:/.test(urlArg) ? urlArg : pathToFileURL(path.resolve(process.cwd(), urlArg)).href)
  : pathToFileURL(path.join(HERE, 'talentnext-candidate-portal-v24.html')).href;
if(!/^https?:/.test(TARGET) && !fs.existsSync(fileURLToPath(TARGET))){
  console.error(`designcheck: ${fileURLToPath(TARGET)} is missing.`); process.exit(2);
}

const WIDTHS = (opt('widths') || '390,744,1024,1280').split(',').map(Number).filter(Boolean);

const PW_HINTS = [
  '/Users/maryam.naz/.npm/_npx/9833c18b2d85bc59/',
  path.join(HERE, 'node_modules', ''),
  path.join(HERE, '..', 'node_modules', ''),
];
function loadPlaywright(){
  for(const h of PW_HINTS){ try { return createRequire(h)('playwright'); } catch(e){} }
  try { return createRequire(import.meta.url)('playwright'); } catch(e){}
  console.error('designcheck: cannot resolve `playwright`. Looked in: ' + PW_HINTS.join(', '));
  process.exit(2);
}
const {chromium} = loadPlaywright();
let browser;
try { browser = await chromium.launch({channel: 'chrome'}); }
catch(e){ try { browser = await chromium.launch(); } catch(e2){ console.error('designcheck: no browser.'); process.exit(2); } }

const page = await browser.newPage({viewport: {width: 1500, height: 1100}});
await page.goto(TARGET);
await page.waitForTimeout(400);
/* Trap 2: measure the RESTING layout. */
await page.addStyleTag({content: '*,*::before,*::after{animation:none!important;transition:none!important}'});
if(!(await page.evaluate(() => window.innerWidth))){ console.error('designcheck: innerWidth 0 — nothing can be measured.'); process.exit(2); }

/* ---------------------------------------------------------------- screens --
   Three shapes of portal, detected off the page rather than off the filename:
     hifi   — STAGES × NAVSETS[CFG[stage].nav] plus the sub-pages, `setStage`,
              and a leader set (respcheck's enumeration).
     agent  — the same STAGES / CFG / NAVSETS vocabulary hand-written, driven by
              `S.stage` / `S.view` + `render()` with no `setStage`.
     rail   — anything else: walk every rail item once (`data-go`, `data-view`,
              the admin's `data-mod`/`data-sub`), capped at 40.
   The admin is behind a session gate; it is opened before enumerating. */
/* The admin's gate (`GATE_KEY` / `signedIn`) lives inside a closure, so it is
   read off the page SOURCE and the session key is planted before the reload. */
const gateKey = (await page.content()).match(/GATE_KEY\s*=\s*['"]([^'"]+)['"]/)?.[1] || null;
if(gateKey){
  await page.addInitScript(k => { try { sessionStorage.setItem(k, '1'); } catch(e){} }, gateKey);
  await page.reload(); await page.waitForTimeout(500);
  await page.addStyleTag({content: '*,*::before,*::after{animation:none!important;transition:none!important}'});
}

const RAIL_SEL = 'nav [data-go],nav [data-view],nav [data-nav],nav [data-ag],.rail [data-go],.rail [data-view],.rail [data-ag],.sn [data-go],.sn [data-view],.sn [data-ag],.sn-item,[data-mod][data-sub],.ad-gh[data-go]';
const railKey = el => el.getAttribute('data-go') || el.getAttribute('data-view') || el.getAttribute('data-nav') || el.getAttribute('data-ag')
  || ((el.getAttribute('data-mod') || '') + '/' + (el.getAttribute('data-sub') || '')).replace(/^\/$/, '') || el.textContent.trim();

const screens = await page.evaluate((RAIL_SEL_S) => {
  const out = [];
  const stageDriven = typeof STAGES !== 'undefined' && typeof NAVSETS !== 'undefined' && typeof CFG !== 'undefined' && typeof render === 'function' && typeof S !== 'undefined';
  if(stageDriven){
    const hifi = typeof setStage === 'function' && !!NAVSETS.leader;
    const SUB = hifi ? ['account','report','result','agents','agent','booking','payment','chapter','ivt','mem','rp'] : [];
    for(const [stage] of STAGES){
      if(/^(signup|signin|reddemo|nil)$/.test(stage)) continue;   /* auth is its own surface; reddemo is a deliberate re-hue; nil is a microsite with its own language (excluded from the DS by decision) */
      const nav = CFG[stage] && NAVSETS[CFG[stage].nav];
      if(!nav) continue;
      for(const v of [...new Set([...nav.map(n => n[0]), ...SUB])]) out.push({kind:'stage', hifi, portal:'candidate', stage, view:v});
    }
    if(hifi) for(const v of NAVSETS.leader.map(n => n[0]).concat(['leadCohort','leadMember','leadSum','leadProfile']))
      out.push({kind:'stage', hifi, portal:'leader', stage:'day34', view:v});
    if(out.length) return out;
  }
  out.push({kind:'rail', label:'(initial)', idx:-1});
  const seen = new Set(); let i = 0;
  const railKey = el => el.getAttribute('data-go') || el.getAttribute('data-view') || el.getAttribute('data-nav') || el.getAttribute('data-ag')
    || ((el.getAttribute('data-mod') || '') + '/' + (el.getAttribute('data-sub') || '')).replace(/^\/$/, '') || el.textContent.trim();
  for(const el of document.querySelectorAll(RAIL_SEL_S)){
    const key = railKey(el);
    if(!key || seen.has(key)) continue; seen.add(key);
    out.push({kind:'rail', label:((el.textContent.trim() || key).slice(0,40)), key, idx:i++});
    if(out.length > 40) break;
  }
  return out;
}, RAIL_SEL);

const show = async s => {
  if(s.kind === 'stage'){
    await page.evaluate(([p, st, v, hifi]) => {
      if(hifi){ setStage(st); S.portal = p; } else { S.stage = st; }
      S.view = v; S.nav = S.notif = S.tal = false;
      if(hifi && p === 'leader'){ try {
        if(typeof LEAD_COHORTS !== 'undefined' && !S.ldrCo) S.ldrCo = LEAD_COHORTS[0].id;
        const c = typeof lcoOf === 'function' ? lcoOf(S.ldrCo) : null;
        if(c && c.members && c.members.length && !S.ldrMem) S.ldrMem = c.members[0].id ?? c.members[0].name;
      } catch(e){} }
      render();
    }, [s.portal, s.stage, s.view, s.hifi]);
  } else if(s.idx >= 0){
    await page.evaluate(([key, RAIL_SEL_S]) => {
      const railKey = el => el.getAttribute('data-go') || el.getAttribute('data-view') || el.getAttribute('data-nav') || el.getAttribute('data-ag')
        || ((el.getAttribute('data-mod') || '') + '/' + (el.getAttribute('data-sub') || '')).replace(/^\/$/, '') || el.textContent.trim();
      const el = [...document.querySelectorAll(RAIL_SEL_S)].find(e => railKey(e) === key);
      if(el) el.click();
    }, [s.key, RAIL_SEL]);
  }
  await page.waitForTimeout(250);
};
const name = s => s.kind === 'stage' ? `${s.hifi ? s.portal + '/' : ''}${s.stage}/${s.view}` : s.label;

/* ---------------------------------------------------------------- the sweep --
   Everything below runs in the page and returns plain records. The allowed
   sets are READ OFF THE TOKENS where the page has them (so a re-hue moves the
   check with it) and fall back to DESIGN.md's literals where it does not. */
const sweep = async () => page.evaluate(() => {
  const root = document.querySelector('.app') || document.body;
  const cs = getComputedStyle(document.documentElement);
  const tok = n => cs.getPropertyValue(n).trim();
  const toRGB = c => { const d = document.createElement('i'); d.style.color = c; document.body.appendChild(d); const v = getComputedStyle(d).color; d.remove(); return v; };
  const norm = c => c && c !== 'rgba(0, 0, 0, 0)' ? c.replace(/\s+/g,'') : 'transparent';
  const rgbHex = c => { const m = c.match(/\d+/g); return m ? '#' + m.slice(0,3).map(x => (+x).toString(16).padStart(2,'0')).join('') : c; };

  /* allowed line colours: every token that IS a hairline or a control edge, resolved */
  const LINE_TOKENS = ['--rule','--rule-ink','--border-subtle-01','--border-subtle-02','--border-strong-01','--accent','--accent-2',
    '--on-dark-rule','--on-dark-border','--on-dark-fill','--on-dark-track','--brand-primary','--gray-100','--gray-20','--gray-30','--gray-50',
    '--layer-02','--surface-2','--surface-3','--auth-rule','--auth-card-line','--askv-rule','--askv-stroke','--askv-stroke-hot','--danger-ink',
    '--support-error','--support-success','--support-attention','--support-warning','--support-info','--mk-1','--mk-2','--mk-3','--pure-white','--background',
    '--accent-tint','--brand-tint','--brand-tint-2','--tal-chip-1','--tal-chip-2','--support-error-bg','--support-success-bg','--support-warning-bg','--support-info-bg'];
  const allowedLine = new Set(['transparent','#e9e9e9','#111111','#ff3733','#ffffff'].map(x => norm(toRGB(x))));
  for(const t of LINE_TOKENS){ const v = tok(t); if(v) allowedLine.add(norm(toRGB(v))); }

  const SIZES = new Set([34,28,24,20,17,16,14,13.5,12.5,11.5,18]);
  const OLD_WARM = new Set(['#f47113','#f57414','#ff584a','#fd4e59','#f480f2','#b94a09','#f83524','#f68441','#bd2c1f','#f6dc92','#e85d0f']);
  const WORDMARK = /^(VISA|AMEX|DISCOVER|MASTERCARD|REC|PDF|ET|AI|ID)$/;

  const out = [];
  const key = el => {
    const cls = [...el.classList].filter(c => !/^(on|is-|__)/.test(c)).slice(0,3).join('.');
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '');
  };
  const push = (rule, el, value) => out.push({rule, sel: key(el), value: String(value).slice(0,60)});
  const isVisible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  for(const el of root.querySelectorAll('*')){
    if(el.closest('svg, iframe, script, style, code, pre, .mono, .nil')) continue;
    if(!isVisible(el)) continue;
    const st = getComputedStyle(el);
    const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();

    if(ownText){
      const w = +st.fontWeight;
      if(!(w === 400 || w === 500)) push('weight', el, w);
      if(!/Plus Jakarta Sans/i.test(st.fontFamily)) push('face', el, st.fontFamily.split(',')[0]);
      const fs = Math.round(parseFloat(st.fontSize) * 2) / 2;
      if(!SIZES.has(fs) && !el.closest('.shell-badge, .sn-item .badge')) push('size', el, fs + 'px');   /* §63:876 states the 15px count badge at 9.5 */
      const tt = st.textTransform;
      if(tt !== 'none' && tt !== 'capitalize') push('transform', el, tt);
      const letters = ownText.replace(/[^A-Za-z]/g,'');
      if(letters.length >= 4 && letters === letters.toUpperCase() && !WORDMARK.test(ownText.trim()) && !/\d/.test(ownText)) push('caps-text', el, ownText.slice(0,30));
      const ink = rgbHex(norm(st.color));
      if(OLD_WARM.has(ink) && !el.closest('[class*="jrn"]')) push('old-accent', el, ink);   /* §63 §14: the journey's states are a set */
    }
    const bg = rgbHex(norm(st.backgroundColor));
    if(OLD_WARM.has(bg)) push('old-accent', el, 'bg ' + bg);

    /* borders: any drawn side must be a token colour */
    for(const side of ['Top','Right','Bottom','Left']){
      if(parseFloat(st['border' + side + 'Width']) > 0 && st['border' + side + 'Style'] !== 'none'){
        const c = norm(st['border' + side + 'Color']);
        if(/^rgb\(\d+,\d+,\d+\)$/.test(c) && !allowedLine.has(c)) { push('border', el, rgbHex(c)); break; }
      }
    }

    /* radius: 0 unless the box is a disc/pill (fully round) or an image */
    const r = parseFloat(st.borderTopLeftRadius);
    if(r > 0 && !/^(IMG|VIDEO)$/.test(el.tagName) && !el.closest('.m-b, .bb, [class^="ob-m"]')){   /* §115: a chat bubble's corners are stated */
      const b = el.getBoundingClientRect();
      const round = r >= Math.min(b.width, b.height) / 2 - 1 || /%/.test(st.borderTopLeftRadius);
      if(!round) push('radius', el, st.borderTopLeftRadius);
    }
  }
  return out;
});

/* ----------------------------------------------------------------- run ---- */
const agg = new Map();   /* rule|sel|value -> {count, where:Set} */
for(const w of WIDTHS){
  await page.setViewportSize({width: w, height: 1100});
  for(const s of screens){
    await show(s);
    const found = await sweep();
    for(const f of found){
      const k = `${f.rule}|${f.sel}|${f.value}`;
      const e = agg.get(k) || {...f, count: 0, where: new Set()};
      e.count++; e.where.add(`${w}:${name(s)}`); agg.set(k, e);
    }
  }
}
await browser.close();

const rows = [...agg.values()];
const byRule = {};
for(const r of rows) (byRule[r.rule] ||= []).push(r);
const ORDER = ['weight','face','size','transform','caps-text','border','radius','old-accent'];
const WHY = {
  weight: 'font-weight not 400/500 (DESIGN.md §2: two weights)',
  face: 'font-family is not Plus Jakarta Sans',
  size: 'font-size outside the 8-size scale (+16 --t-sec, 18 --t-sec-lg, 28 h1-lg)',
  transform: 'text-transform other than none/capitalize (§63 §2: nothing in capitals)',
  'caps-text': 'text typed in capitals in the markup',
  border: 'border colour is not a token (one hairline, --rule)',
  radius: 'border-radius on a box that is not a disc/pill (--radius is 0)',
  'old-accent': 'a previous accent hex is still rendering',
};
const target = urlArg || 'hifi/talentnext-candidate-portal-v24.html';
if(!rows.length){
  if(!QUIET) console.log(`designcheck: ${target} — clean at ${WIDTHS.join('/')} over ${screens.length} screens.`);
  process.exit(0);
}
console.log(`designcheck: ${target} — ${rows.length} distinct finding(s) over ${screens.length} screens at ${WIDTHS.join('/')}\n`);
for(const rule of ORDER){
  const list = byRule[rule]; if(!list) continue;
  list.sort((a,b) => b.count - a.count);
  console.log(`## ${rule} — ${list.length} distinct, ${list.reduce((n,r)=>n+r.count,0)} hits — ${WHY[rule]}`);
  for(const r of list.slice(0, QUIET ? 3 : 12)){
    const where = [...r.where];
    console.log(`   ${r.sel.padEnd(34)} ${String(r.value).padEnd(22)} ×${String(r.count).padEnd(4)} e.g. ${where.slice(0,2).join(', ')}${where.length > 2 ? ` (+${where.length-2})` : ''}`);
  }
  if(list.length > (QUIET ? 3 : 12)) console.log(`   … ${list.length - (QUIET ? 3 : 12)} more`);
  console.log('');
}
process.exit(1);
