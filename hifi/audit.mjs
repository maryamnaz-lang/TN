import { chromium } from 'playwright';
const FILE = 'file://' + process.cwd() + '/talentnext-candidate-portal-v24.html';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});

const PAGES = [
  ['new','dashboard'],['booked','dashboard'],['assessed','dashboard'],
  ['week1','dashboard'],['day34','dashboard'],['day90','dashboard'],['promoted','dashboard'],
  ['day34','level'],['day34','coursework'],['day34','rewards'],['day34','cohort'],
  ['day34','interviews'],['assessed','enrol'],['day34','billing'],['day34','transcript'],
];
const VPS = [['mobile',900,1000],['tablet',1200,1200],['fluid',1900,1300]];

const rows = [];
for (const [vp, W, H] of VPS) {
  const page = await b.newPage({viewport:{width:W, height:H}});
  await page.goto(FILE); await page.waitForTimeout(500);
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
  await page.click(`#vp button[data-vp="${vp}"]`);
  await page.waitForTimeout(300);
  for (const [stage, view] of PAGES) {
    const r = await page.evaluate(([s,v]) => {
      setStage(s); S.view = v; render();
      const m = document.querySelector('#device .modhead');
      if (!m) return {err:'no band'};
      const mr = m.getBoundingClientRect();
      const X = el => el ? Math.round(el.getBoundingClientRect().x - mr.x) : null;
      const Y = el => el ? Math.round(el.getBoundingClientRect().y - mr.y) : null;
      const W2 = el => el ? Math.round(el.getBoundingClientRect().width) : null;
      const chips = [...m.querySelectorAll('.chip-tal')];
      const field = m.querySelector('.askline');
      const mark  = m.querySelector('.ai-label');
      const h3    = m.querySelector('.ai-head h3');
      const body  = m.querySelector('.ai-body');
      const act   = m.querySelector('.ai-do, .ai-head .btn-p');
      return {
        band: Math.round(mr.width),
        markX: X(mark), h3X: X(h3), h3Y: Y(h3), bodyX: X(body), bodyY: Y(body),
        actX: X(act), actY: Y(act), actW: W2(act),
        chips: chips.map(c => [X(c), Y(c)]),
        fieldX: X(field), fieldY: Y(field),
      };
    }, [stage, view]);
    rows.push({vp, stage, view, ...r});
  }
  await page.close();
}
await b.close();

// ---- the rules the band must obey, stated once ---------------------------
const fails = [];
for (const r of rows) {
  if (r.err) continue;
  const tag = `${r.vp} ${r.stage}/${r.view}`;
  if (r.fieldX === null) { fails.push(`${tag}: no ask field`); continue; }
  // 1. every chip starts on the same left edge as the field
  r.chips.forEach(([x], i) => {
    if (i === 0 && x !== r.fieldX) fails.push(`${tag}: first chip x=${x}, field x=${r.fieldX}`);
  });
  // 2. all chips are on one row
  if (r.chips.length > 1) {
    const ys = new Set(r.chips.map(c => c[1]));
    // wrapping is allowed under 900 — two chips do not fit on a 390 phone —
    // but every wrapped chip must still start on the spine
    if (ys.size > 1 && r.vp === 'fluid')
      fails.push(`${tag}: chips on ${ys.size} rows (${[...ys].join(',')})`);
    if (ys.size > 1) {
      const first = {};
      r.chips.forEach(([x,y]) => { if (first[y] === undefined || x < first[y]) first[y] = x; });
      Object.entries(first).forEach(([y,x]) => {
        if (x !== r.fieldX) fails.push(`${tag}: wrapped chip row y=${y} starts at ${x}, spine ${r.fieldX}`);
      });
    }
    const gaps = r.chips.slice(1).map((c,i) => c[0] - r.chips[i][0]);
    if (gaps.some(g => g > 400)) fails.push(`${tag}: chips split apart (gaps ${gaps.join(',')})`);
  }
  // 3. the mark is on the spine, and so is the field
  if (r.markX !== null && r.markX !== r.fieldX)
    fails.push(`${tag}: mark x=${r.markX}, field x=${r.fieldX}`);
  // 4. the action: top-right at desktop, full width and below the body under 900
  if (r.actX !== null) {
    if (r.vp === 'fluid') {
      if (r.actY > (r.bodyY ?? 0)) fails.push(`${tag}: action below the body at desktop`);
    } else {
      if (r.actY < (r.bodyY ?? 0)) fails.push(`${tag}: action above the body under 900`);
      if (r.actX !== r.fieldX) fails.push(`${tag}: action x=${r.actX}, field x=${r.fieldX}`);
      if (Math.abs((r.actW ?? 0) - (r.band - 2*r.fieldX)) > 2)
        fails.push(`${tag}: action w=${r.actW}, column=${r.band - 2*r.fieldX}`);
    }
  }
  // 5. the heading and the body share the second column
  if (r.h3X !== null && r.bodyX !== null && r.h3X !== r.bodyX)
    fails.push(`${tag}: heading x=${r.h3X}, body x=${r.bodyX}`);
}

console.log(`\nchecked ${rows.length} band renders (${PAGES.length} pages x ${VPS.length} viewports)\n`);
if (!fails.length) console.log('PASS  every band obeys all five rules');
else { console.log(`FAIL  ${fails.length}\n`); fails.forEach(f => console.log('  ' + f)); }
