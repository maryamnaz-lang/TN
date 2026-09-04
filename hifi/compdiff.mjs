/* ==========================================================================
   COMPDIFF — "does this screen draw the same COMPONENTS as the reference?"

   /portal-sync's step 2, and the reason it exists is a miss: the first sync of
   tn-agent-portal.html (4 Sep 2026) compared the classes the file WRITES with
   the classes the design system SHIPS, found 331 of 335 present, and reported
   the markup current. It was not — the Tal dock was the older `.askline`
   without §70's travelling light, and the interviews page drew a `.tabs` strip
   where every other portal draws `.sec-cs` + `.cs`. Both pass a class inventory
   (their classes ship) and a computed rule sweep (their type is right). What
   catches a stale GENERATION is putting a reference screen and the target
   screen side by side and reading the component signature of each.

   So this prints, per screen: the SHELL line (which named components the .app
   contains — dock, light, trail, account menu, band members, dark card, quick
   actions, disclosures, strips…) and each `.page` child's class with the
   components inside it. Two portals, two blocks, read across.

       node compdiff.mjs                                     # hifi vs the agent portal, default screens
       node compdiff.mjs --target=../tn-admin.html           # any plain-URL portal
       node compdiff.mjs --ref=candidate/new/dashboard,leader/day34/leadDash --screens=working/dashboard,live/dashboard

   hifi screens are `portal/stage/view`; a stage-driven target's are `stage/view`;
   a rail-driven target's are the rail item's label. It reuses respcheck's
   browser bootstrap by copy.
   ========================================================================== */
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = k => { const a = argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const REF = pathToFileURL(path.join(HERE, 'talentnext-candidate-portal-v24.html')).href;
const tgt = opt('target') || path.join(HERE, '..', 'tn-agent-portal.html');
const TARGET = /^https?:/.test(tgt) ? tgt : pathToFileURL(path.resolve(process.cwd(), tgt)).href;

const PW_HINTS = ['/Users/maryam.naz/.npm/_npx/9833c18b2d85bc59/', path.join(HERE, 'node_modules', ''), path.join(HERE, '..', 'node_modules', '')];
function loadPlaywright(){ for(const h of PW_HINTS){ try { return createRequire(h)('playwright'); } catch(e){} } try { return createRequire(import.meta.url)('playwright'); } catch(e){} console.error('compdiff: cannot resolve playwright'); process.exit(2); }
const {chromium} = loadPlaywright();
const browser = await chromium.launch({channel: 'chrome'}).catch(() => chromium.launch());

/* the signature — runs in the page */
const SIG = () => {
  const cls = e => e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].filter(c => !/^(on|is-|__|tint|cards|white|open|active|tsum|talsum|tight)$/.test(c)).slice(0,3).join('.') : '');
  const app = document.querySelector('.app'); if(!app) return {shell:'(no .app)', page:[]};
  const NAMED = ['header','.crumb-trail','.acct-t','.pswitch','.sn','.rail','.askdock','.askline','.ai-run','.askline-mic','.modhead','.ph','.ai-aura','.jrn','.stps','.plate','.dark-card','.crow','.sec-qa','.aih','.found','.acc','.pulse','.stats','.facts','.certban','.lead-bar','.sec-cs','.cs','.tabs','.agt','.tbl','.kv','.gcard','.cardrow','.conf','.sheet'];
  const shell = NAMED.filter(s => app.querySelector(s)).join(' ');
  const page = document.querySelector('.page');
  const kids = page ? [...page.children].map(k => {
    const inner = [...k.querySelectorAll('.sec-h, .aih, .dark-card, .plate, .stats, .qa-c, .crow, .found, .acc, .tile-stack, .kv, .tbl, .rail, .cardrow, .gcard, .facts, .pulse, .jrn, .stps, .ai-aura, .cs, .tabs, .agt')].slice(0,6).map(cls);
    return cls(k) + (inner.length ? ' {' + [...new Set(inner)].join(', ') + '}' : '');
  }) : [];
  return {shell, page: kids};
};

async function dump(url, screensArg){
  const page = await browser.newPage({viewport: {width: 1280, height: 1100}});
  await page.goto(url); await page.waitForTimeout(400);
  const gateKey = (await page.content()).match(/GATE_KEY\s*=\s*['"]([^'"]+)['"]/)?.[1];
  if(gateKey){ await page.addInitScript(k => { try { sessionStorage.setItem(k, '1'); } catch(e){} }, gateKey); await page.reload(); await page.waitForTimeout(400); }
  const kind = await page.evaluate(() => typeof STAGES !== 'undefined' && typeof render === 'function' && typeof S !== 'undefined' ? (typeof setStage === 'function' ? 'hifi' : 'stage') : 'rail');
  let screens = screensArg ? screensArg.split(',') : null;
  if(!screens){
    screens = await page.evaluate(k => {
      if(k === 'hifi') return ['candidate/new/dashboard','candidate/booked/dashboard','candidate/week1/dashboard','candidate/new/agents','candidate/booked/ivt','candidate/new/account','leader/day34/leadDash','leader/day34/leadProfile'];
      if(k === 'stage'){ const o = []; for(const [st] of STAGES){ const nav = CFG[st] && NAVSETS[CFG[st].nav]; if(!nav) continue; for(const n of nav) o.push(st + '/' + n[0]); } return o.slice(0, 16); }
      return ['(initial)', ...[...document.querySelectorAll('nav [data-go],.sn-item,[data-mod][data-sub]')].map(e => e.textContent.trim()).filter(Boolean).slice(0, 12)];
    }, kind);
  }
  const out = {};
  for(const s of screens){
    await page.evaluate(([k, s]) => {
      const p = s.split('/');
      if(k === 'hifi'){ setStage(p[1]); S.portal = p[0]; S.view = p[2]; S.nav = S.notif = S.tal = false; render(); }
      else if(k === 'stage'){ S.stage = p[0]; S.view = p[1]; S.nav = S.notif = S.tal = false; render(); }
      else if(s !== '(initial)'){ const el = [...document.querySelectorAll('nav [data-go],.sn-item,[data-mod][data-sub]')].find(e => e.textContent.trim() === s); if(el) el.click(); }
    }, [kind, s]);
    await page.waitForTimeout(200);
    out[s] = await page.evaluate(SIG);
  }
  await page.close(); return out;
}
const show = (title, o) => { console.log('\n#### ' + title); for(const [k, v] of Object.entries(o)){ console.log('== ' + k); console.log('   shell: ' + v.shell); v.page.forEach(x => console.log('   - ' + x)); } };
show('REFERENCE  ' + fileURLToPath(REF).split('/').slice(-1)[0], await dump(REF, opt('ref')));
show('TARGET     ' + tgt, await dump(TARGET, opt('screens')));
await browser.close();
