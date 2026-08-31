/* ==========================================================================
   RESPCHECK — "is the new UI broken on a phone or a tablet?"

   Maryam's standing ask, 31 Aug 2026: every new design or component is
   authored at desktop and must be verified on mobile and tablet in the SAME
   task. Other sessions are working in this repo too, so the rule cannot live
   only in one conversation's head — this is the mechanical half of it.

   WHY IT IS ITS OWN FILE AND NOT MORE OF `verify.mjs`. That sweep is the
   whole product audit — contrast, the type scale, the two tones, token
   discipline — and several of its tables predate §63 and §64, so running it
   today prints a wall of stale failures with the two or three real ones
   buried in it. A check nobody can read is a check nobody runs. This one
   answers ONE question, at four widths, and its silence is meaningful.

   THE SIX FAILURES IT LOOKS FOR ARE THE SIX THAT HAVE ACTUALLY HAPPENED
   HERE, and every one of them was invisible at the width it was authored at:

     1. Horizontal overflow — something wider than the frame it is in.
     2. The label column live below its breakpoint. §10.15's 184px rail is
        stated inside `@container app (min-width:900px)`; a rule restated
        carelessly (trap 3) can leak it to the phone, where 184px of a 390px
        frame leaves 206 for the content.
     3. A heading in that column wrapping past three lines at desktop —
        trap 13's other half. §65's `.found` heading set on FOUR lines at
        57px wide, and nothing warned.
     4. Content escaping its own section — how §65's button ended up hanging
        172px past the section's right edge.
     5. A button label on two lines. §56 cut six of these on 28 Aug 2026;
        the invariant is that no `.plate-a > .btn` measures taller than 34px.
     6. A vertical hairline still drawn after the columns stacked. §72.3's
        dividers are absolutely positioned, so below 900 they must be
        switched OFF (`content:none`), not re-pointed — stacked, a re-pointed
        one draws a line down every row but the first.

   Plus the two silent ones: a thrown error or a `console.warn` (every pass
   wraps itself in a try/catch that warns, so a broken pass is a warning
   rather than a blank page), and an `undefined` / `NaN` / `[object` leak in
   the rendered text.

   IT IS SILENT WHEN THE BUILT FILE HAS NOT CHANGED, which is the funnel.py
   pattern and the reason it can go on a timer or a hook without becoming
   noise. `--quiet` prints nothing and exits 0 when the portal's hash matches
   the last clean run.

       node respcheck.mjs                 # the report
       node respcheck.mjs --quiet         # nothing unless something is wrong
                                          # (exit 0 = clean, 1 = findings)
       node respcheck.mjs --quick         # dashboards + the changed widths only
       node respcheck.mjs --edge          # add 899 / 900, the breakpoint seam
       node respcheck.mjs --widths=390,1280
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';

/* `new URL(...).pathname` keeps the percent-encoding, and this repo lives under
   "Application Support" — so that spelling resolved to a path with %20 in it
   and the script reported the built file missing. `fileURLToPath` decodes. */
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(HERE, 'talentnext-candidate-portal-v24.html');
const STATE = path.join(HERE, '.respcheck-state.json');

const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const QUIET = has('--quiet'), QUICK = has('--quick');

/* THE BROWSER IS THE ONE THING THIS MACHINE DOES NOT HAVE AS A DEPENDENCY.
   `verify.mjs` hardcodes `executablePath:'/opt/pw-browsers/chromium'`, which
   is a Linux CI path and does not exist here — that is why both existing
   sweeps cannot run on this Mac. Playwright itself is on disk (the Playwright
   MCP server's npx cache) and Google Chrome is installed, so the pair is
   resolved rather than installed: `createRequire` against the cache for the
   library, `channel:'chrome'` for the binary. No download, no node_modules in
   this repo. If either moves, the failure is one clear message rather than a
   stack trace. */
const PW_HINTS = [
  '/Users/maryam.naz/.npm/_npx/9833c18b2d85bc59/',
  path.join(HERE, 'node_modules', ''),
  path.join(HERE, '..', 'node_modules', ''),
];
function loadPlaywright(){
  for(const h of PW_HINTS){
    try { return createRequire(h)('playwright'); } catch(e){ /* next */ }
  }
  try { return createRequire(import.meta.url)('playwright'); } catch(e){}
  console.error('respcheck: cannot resolve the `playwright` package.\n' +
    '  Looked in: ' + PW_HINTS.join(', ') + '\n' +
    '  Fix: npm i -D playwright, or point PW_HINTS at a cache that has it.');
  process.exit(2);
}

/* ------------------------------------------------------------------ state --
   The hash is of the BUILT FILE, because that is what the sweep measures. A
   layer edited but not rebuilt is not a change to the thing being checked,
   and reporting on it would be reporting on a file nobody is looking at. */
const src = fs.existsSync(FILE) ? fs.readFileSync(FILE) : null;
if(!src){ console.error(`respcheck: ${FILE} is missing — run build.py first.`); process.exit(2); }
const hash = crypto.createHash('sha1').update(src).digest('hex').slice(0, 12);
const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};

const WIDTHS = (() => {
  const w = argv.find(a => a.startsWith('--widths='));
  if(w) return w.slice(9).split(',').map(Number).filter(Boolean);
  /* 390 is the phone. 744 is the prototype's own tablet frame and 1024 is
     that tablet in landscape — one either side of the product's only real
     breakpoint, `@container app (min-width:900px)`. 1280 is there because §63
     §8b's lesson is that a sweep at 390 and 760 alone reports finished when
     four sizes are still wrong at desktop: several rules only resize INSIDE
     the container query, so the query has to be entered as well as skipped. */
  const base = [390, 744, 1024, 1280];
  return has('--edge') ? [390, 744, 899, 900, 940, 1024, 1280] : base;
})();

/* THE SKIP HAS TO MATCH THE RUN THAT EARNED IT, and getting this wrong would
   have made the hook actively harmful. `--quiet` exits early when the built
   file's hash is the one a previous CLEAN run measured — but the hook runs
   `--quick`, ~30 screens, and if that stored a bare `clean:true` then a later
   full sweep of the same build would see its own hash and exit 0 without
   measuring anything. The fast triage would have been silently standing in for
   the real sweep. So the mode and the widths are part of the key: a quick run
   only ever skips another quick run at the same widths. */
const MODE = QUICK ? 'quick' : 'full';
const KEY = MODE + ':' + WIDTHS.join(',');
if(QUIET && state.hash === hash && state.clean && state.key === KEY){ process.exit(0); }

const {chromium} = loadPlaywright();
let browser;
try {
  browser = await chromium.launch({channel: 'chrome'});
} catch(e){
  try { browser = await chromium.launch(); }
  catch(e2){
    console.error('respcheck: no browser. Chrome was not launchable ' +
      `(${e.message.split('\n')[0]}) and Playwright has no bundled build.`);
    process.exit(2);
  }
}

const page = await browser.newPage({viewport: {width: 1500, height: 1100}});
const thrown = [], warned = [];
page.on('console', m => {
  if(m.type() === 'error') thrown.push(m.text().slice(0, 160));
  if(m.type() === 'warning') warned.push(m.text().slice(0, 160));
});
page.on('pageerror', e => thrown.push('PAGEERROR: ' + e.message.slice(0, 160)));

await page.goto(pathToFileURL(FILE).href);
await page.waitForTimeout(400);

/* Trap 2: entrance animations run with `fill-mode:both`, so a played
   animation's last keyframe keeps applying and an element measured mid-flight
   is translated and scaled — off by two orders of magnitude in the same tick
   as the render. Every invariant here is about the RESTING layout. */
await page.addStyleTag({content:
  '*,*::before,*::after{animation:none!important;transition:none!important}'});

/* Trap 15's sibling, and the reason this is asserted rather than assumed: in a
   pane that reports itself hidden the frame measures `innerWidth: 0`, every
   element measures 0 and the page's scrollHeight comes back around 15,000px —
   which reads exactly like a broken layout and is not one. Playwright's page is
   never hidden, so this can only fail if the harness changes underneath us; a
   sweep that silently measured zeros would report a clean product. */
const live = await page.evaluate(() => window.innerWidth);
if(!live){ console.error('respcheck: the page reports innerWidth 0 — nothing can be measured.'); process.exit(2); }

/* ----------------------------------------------------------------- combos --
   Enumerated IN THE PAGE from `STAGES` / `NAVSETS` / `CFG` rather than typed
   here, so a stage or a module added to data.js is swept without this file
   being touched. The sub-pages have to be listed because they are reached by
   a `data-go` rather than by the rail. */
const combos = await page.evaluate(() => {
  const out = [];
  const SUB = ['account', 'report', 'result', 'agents', 'agent', 'booking',
               'payment', 'welcome', 'chapter', 'terms', 'rewards', 'ivt', 'mem', 'rp'];
  for(const [stage] of STAGES){
    if(stage === 'signup'){
      for(const v of Object.keys(AUTH)) out.push(['candidate', stage, v]);
      continue;
    }
    const nav = NAVSETS[CFG[stage].nav].map(n => n[0]);
    for(const v of [...new Set([...nav, ...SUB])]) out.push(['candidate', stage, v]);
  }
  /* The leader is a different signed-in USER on the same renderer, so its
     views are swept the same way. Its four detail pages take their subject
     from `S.ldrCo` / `S.ldrMem` / `S.ldrEv` / `S.ldrSum`; two of those
     default to null, so they are seeded from the data below rather than left
     to render an empty state that measures nothing. */
  const lead = NAVSETS.leader.map(n => n[0])
    .concat(['leadCohort', 'leadMember', 'leadEval', 'leadSum', 'leadProfile']);
  for(const v of lead) out.push(['leader', 'day34', v]);
  return out;
});

const show = async ([portal, stage, view]) => {
  await page.evaluate(([p, s, v]) => {
    setStage(s);
    /* `setStage` resets the portal, so this order is load-bearing — CLAUDE.md
       says so and the sweep is where it gets checked. */
    S.portal = p;
    S.view = v;
    S.nav = S.notif = S.tal = false;
    if(p === 'leader'){
      try {
        if(typeof LEAD_COHORTS !== 'undefined' && !S.ldrCo) S.ldrCo = LEAD_COHORTS[0].id;
        const c = typeof lcoOf === 'function' ? lcoOf(S.ldrCo) : null;
        if(c && c.members && c.members.length && !S.ldrMem)
          S.ldrMem = c.members[0].id ?? c.members[0].name;
        if(typeof LEAD_EVALS !== 'undefined' && LEAD_EVALS.length && !S.ldrEv)
          S.ldrEv = LEAD_EVALS[0].id ?? LEAD_EVALS[0].name;
      } catch(e){ /* seeded best-effort; a view that still renders empty is
                     measured empty, which is a finding rather than a crash */ }
    }
    render();
  }, [portal, stage, view]);
};

const setW = w => page.evaluate(w => {
  const d = document.getElementById('device');
  d.dataset.vp = 'fluid';
  /* the frame is normally scaled to fit the pane; a scaled box reports scaled
     pixels, so the transform comes off and the width is stated honestly. The
     container query inside must resolve against the real number. */
  d.style.transform = 'none';
  d.style.width = w + 'px';
  d.style.maxWidth = w + 'px';
  d.style.height = '1200px';
}, w);

/* ------------------------------------------------------------------ sweep -- */
const F = {overflow: [], labelcol: [], headwrap: [], escape: [], btn2: [], divider: [], leak: []};
const push = (k, w, c, detail) => F[k].push({w, at: `${c[0] === 'leader' ? 'leader/' : ''}${c[1]}/${c[2]}`, detail});

/* THE QUICK SET IS NOT "THE DASHBOARDS", and the difference is one of the two
   bugs this sweep found on the day it was written. `signup/verify` is not a
   dashboard, and it was the screen whose primary action spilled out of its own
   box between 900 and 1100 — so a dashboards-only fast path would have shipped
   it. The set is: every dashboard (one per nav set, and where the head band
   changes shape), all seven auth screens, and the pages that carry a dark card
   or a multi-column band, which is where a width failure has somewhere to
   happen. About 30 screens, so it is seconds rather than minutes and is what a
   hook can afford to run on every rebuild. It is a TRIAGE, not the sweep —
   clean here means "nothing obvious", and the four-width full run is still the
   thing that says a change is finished.

   EVERY DASHBOARD BUT ONLY ONE OF EACH SUB-PAGE. The dashboards are eight
   genuinely different screens — the head band changes shape at every stage, and
   both of today's findings were width failures in a head-band component. A
   sub-page is the same page whichever stage you reach it from, so sweeping
   `enrol` eight times is eight times the cost for one screen; the first stage
   that offers it is kept and the rest are dropped. 30 screens, ~15s. */
const QUICK_VIEWS = /^(dashboard|enrol|payment|welcome|result|report|transcript|cohort|level|chapter|leadDash|leadCohort|leadEval)$/;
const seenView = new Set();
const sweepCombos = QUICK
  ? combos.filter(c => {
      if(c[1] === 'signup') return true;
      if(!QUICK_VIEWS.test(c[2])) return false;
      if(c[2] === 'dashboard') return true;
      const k = c[0] + '/' + c[2];
      if(seenView.has(k)) return false;
      seenView.add(k);
      return true;
    })
  : combos;

for(const w of WIDTHS){
  await setW(w);
  for(const c of sweepCombos){
    await show(c);
    const r = await page.evaluate(w => {
      const dev = document.getElementById('device');
      const frame = dev.getBoundingClientRect();
      const vis = el => { const cs = getComputedStyle(el);
        return !(cs.display === 'none' || cs.visibility === 'hidden'); };
      const name = el => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
      const out = {overflow: [], labelcol: [], headwrap: [], escape: [], btn2: [], divider: []};

      /* A CHILD OF A HORIZONTAL SCROLLER IS NOT AN OVERFLOW, AND THE TEST HAS
         TO BE COMPUTED RATHER THAN LISTED. The first cut named the four
         scrollers it knew — `.tabs`, `.daystrip`, `.tbl-wrap`, `.cs` — and the
         first new layer to add a fifth broke it: §73 turns `.cov-row` into a
         scroller below 900 on the argument that a SEQUENCE must not wrap, so
         five 200px cells running off a 358px page is the design. A hardcoded
         list makes this sweep report every future scroller as a bug, which is
         how a check stops being read. Walking up for a real `overflow-x` keeps
         it honest and needs no maintenance. The scroller's OWN box is still
         measured, because that is the thing that must fit. */
      const inScroller = el => {
        for(let n = el.parentElement; n && n !== dev; n = n.parentElement){
          const ox = getComputedStyle(n).overflowX;
          if(ox === 'auto' || ox === 'scroll' || ox === 'hidden') return true;
        }
        return false;
      };

      // ---- 1. horizontal overflow -------------------------------------
      for(const el of dev.querySelectorAll('*')){
        // the glow on a dark card is a light source hanging off the card's
        // corner and CLIPPED by it — overflow:hidden hides the paint but not
        // the box, and the box is meant to be outside
        if(el.classList.contains('dark-glow')) continue;
        if(el.closest('svg,.sidenav,.notif,.tal-panel,.modal')) continue;
        const cs = getComputedStyle(el);
        if(!vis(el) || cs.position === 'fixed') continue;
        if(inScroller(el)) continue;
        const b = el.getBoundingClientRect();
        if(!b.width) continue;
        if(b.right > frame.right + 1 || b.left < frame.left - 1) out.overflow.push(name(el));
      }

      // ---- 2. the 184px label column below its breakpoint -------------
      // §10.15 states it inside `@container app (min-width:900px)`. Anything
      // that leaks it downward (trap 3, restating a rule outside the tier)
      // leaves 206px of a 390px frame for the content.
      if(w < 900){
        for(const sec of dev.querySelectorAll('.sec')){
          if(!vis(sec)) continue;
          const cs = getComputedStyle(sec);
          if(cs.display !== 'grid') continue;
          const first = parseFloat((cs.gridTemplateColumns || '').split(' ')[0]);
          if(first >= 150 && first <= 230)
            out.labelcol.push(`${name(sec)} first track ${Math.round(first)}px`);
        }
      }

      // ---- 3. a heading wrapping past three lines in that column ------
      // trap 13's other half, and the half no width-390 sweep can see. §65's
      // `.found` heading set on FOUR lines at 57px wide with nothing warned.
      if(w >= 900){
        for(const h of dev.querySelectorAll('.sec-h h2, .sec-h .found-t')){
          if(!vis(h)) continue;
          const cs = getComputedStyle(h);
          const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
          const lines = Math.round(h.getBoundingClientRect().height / lh);
          if(lines > 3) out.headwrap.push(`"${h.textContent.trim().slice(0, 22)}" ${lines} lines @${Math.round(h.getBoundingClientRect().width)}px`);
        }
      }

      // ---- 4. content escaping its own section ------------------------
      // §65's button hung 172px past the section's right edge when a wrapper
      // silently dropped the label-column opt-out. Relative to the SECTION,
      // so it is caught before it becomes frame overflow (which it may never).
      for(const sec of dev.querySelectorAll('.sec')){
        if(!vis(sec)) continue;
        const sb = sec.getBoundingClientRect();
        if(!sb.width) continue;
        for(const el of sec.querySelectorAll('*')){
          // `.band` bleeds to the column edge by a NEGATIVE margin — that is
          // what it is for, so it is out by name; everything else that runs
          // past its section is either a scroller's child or a finding.
          if(el.closest('.band,svg,.modal')) continue;
          if(inScroller(el)) continue;
          const cs = getComputedStyle(el);
          if(!vis(el) || cs.position === 'absolute' || cs.position === 'fixed') continue;
          const b = el.getBoundingClientRect();
          if(!b.width) continue;
          if(b.right > sb.right + 2) out.escape.push(`${name(el)} +${Math.round(b.right - sb.right)}px past ${name(sec)}`);
        }
      }

      // ---- 5. a button label on two lines ----------------------------
      // §56: the plate is minmax(300px,330px) with 32px of padding, so a
      // two-button row divides about 250px. `white-space:normal` is there as a
      // safety valve, not a licence — a label that does not fit wraps, and the
      // card wants one 32px row of actions rather than a 38px row of broken
      // phrases. The invariant is the one written down: 34px.
      for(const b of dev.querySelectorAll('.plate-a > .btn')){
        if(!vis(b)) continue;
        const h = b.getBoundingClientRect().height;
        if(h > 34) out.btn2.push(`plate "${b.textContent.trim().slice(0, 18)}" ${Math.round(h)}px`);
      }
      // and the general case, because a wrapped label anywhere is a label
      // written for a wider column than the one it ended up in.
      //
      // COUNT THE LINES WITH A RANGE, NOT WITH THE BOX. Subtracting padding
      // and border from the button's height and dividing by line-height is
      // the obvious way and it is wrong here: §64 puts a `mask-image` arrow on
      // every quiet button and 57 of these carry an inline `<svg>` in the
      // label, so the content box is taller than one line on buttons that do
      // not wrap at all — it reported "Reschedule" and "Join call" wrapping at
      // 1280px. A Range over the button's own text nodes returns one client
      // rect per rendered LINE of that text, which is the question being
      // asked, and is blind to anything sitting beside the words.
      for(const b of dev.querySelectorAll('.btn')){
        if(b.closest('.plate-a') || !vis(b)) continue;
        const words = [...b.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
        if(!words.length) continue;
        const rg = document.createRange();
        rg.setStartBefore(words[0]);
        rg.setEndAfter(words[words.length - 1]);
        if(rg.getClientRects().length > 1)
          out.btn2.push(`"${b.textContent.trim().slice(0, 18)}" on ${rg.getClientRects().length} lines`);
      }

      // ---- 6. a vertical hairline still drawn once stacked ------------
      // §72.3's column dividers are absolutely positioned pseudo-elements, so
      // below 900 they must be `content:none` rather than re-pointed —
      // stacked, a re-pointed one draws a line down every row but the first.
      if(w < 900){
        for(const el of dev.querySelectorAll('.pulse-col,.col-side,.col-b,.modhead > *')){
          if(!vis(el)) continue;
          for(const p of ['::before', '::after']){
            const ps = getComputedStyle(el, p);
            if(ps.content === 'none' || ps.display === 'none') continue;
            const pw = parseFloat(ps.width), ph = parseFloat(ps.height);
            if(ps.position === 'absolute' && pw <= 2 && ph >= 40)
              out.divider.push(`${name(el)}${p} ${pw}x${Math.round(ph)}`);
          }
        }
      }
      return {
        overflow: [...new Set(out.overflow)].slice(0, 4),
        labelcol: [...new Set(out.labelcol)].slice(0, 3),
        headwrap: [...new Set(out.headwrap)].slice(0, 3),
        escape: [...new Set(out.escape)].slice(0, 3),
        btn2: [...new Set(out.btn2)].slice(0, 3),
        divider: [...new Set(out.divider)].slice(0, 3),
        text: dev.innerText,
      };
    }, w);

    for(const k of ['overflow', 'labelcol', 'headwrap', 'escape', 'btn2', 'divider'])
      if(r[k].length) push(k, w, c, r[k]);
    if(/undefined|NaN|\[object/.test(r.text)) push('leak', w, c, ['rendered text']);
  }
}

await browser.close();

/* ----------------------------------------------------------------- report -- */
const TITLES = {
  overflow: 'horizontal overflow',
  labelcol: 'label column below 900',
  headwrap: 'heading wraps past 3 lines',
  escape:   'content escapes its section',
  btn2:     'button label on two lines',
  divider:  'vertical rule drawn while stacked',
  leak:     'undefined / NaN in the text',
};
const findings = Object.entries(F).filter(([, v]) => v.length);
const clean = findings.length === 0 && thrown.length === 0 && warned.length === 0;

fs.writeFileSync(STATE, JSON.stringify({hash, clean, key: KEY, when: new Date().toISOString(),
  widths: WIDTHS, combos: sweepCombos.length,
  counts: Object.fromEntries(Object.entries(F).map(([k, v]) => [k, v.length]))}, null, 2));

if(QUIET && clean) process.exit(0);

const pad = ' '.repeat(4);
console.log('\n' + '='.repeat(74));
console.log(`respcheck — ${sweepCombos.length} screens x ${WIDTHS.join(' / ')}px`);
console.log('='.repeat(74));
if(thrown.length) console.log(`FAIL  thrown errors (${thrown.length})\n${pad}` + thrown.slice(0, 4).join('\n' + pad));
if(warned.length) console.log(`FAIL  console.warn (${warned.length}) — a pass caught something\n${pad}` + warned.slice(0, 4).join('\n' + pad));
if(!thrown.length && !warned.length) console.log('PASS  renders clean, no thrown error and no console.warn');

for(const [k, list] of Object.entries(F)){
  if(!list.length){ console.log(`PASS  ${TITLES[k]}`); continue; }
  /* grouped by width, because "at 390 only" and "at every width" are two
     different bugs and the report should not make you work that out */
  const byW = new Map();
  for(const f of list){ if(!byW.has(f.w)) byW.set(f.w, []); byW.get(f.w).push(f); }
  console.log(`FAIL  ${TITLES[k]} — ${list.length} screen(s)`);
  for(const [w, fs_] of byW)
    for(const f of fs_.slice(0, 5))
      console.log(`${pad}${w}px  ${f.at}: ${f.detail.join(' | ')}`);
}
console.log('='.repeat(74) + '\n');
process.exit(clean ? 0 : 1);
