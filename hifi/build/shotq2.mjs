import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const page = await b.newPage({viewport:{width:900,height:1300}});
await page.goto('file:///home/claude/talentnext/talentnext-candidate-portal-v15.html');
await page.waitForTimeout(600);
await page.evaluate(()=>{const d=document.getElementById('device');d.dataset.vp='fluid';d.style.maxWidth='390px';d.style.width='390px';d.style.height='1250px';});
await page.evaluate(()=>{setStage('day34');S.view='account';render();});
await page.waitForTimeout(300);
console.log(await page.evaluate(()=>{
  const e=document.querySelector('#device .idphoto-edit');
  const r=e.getBoundingClientRect();
  const top=document.elementFromPoint(r.left+4,r.top+4);
  const cs=getComputedStyle(e);
  const ph=document.querySelector('#device .idphoto');
  return JSON.stringify({top:top.tagName+'.'+top.className, z:cs.zIndex, pos:cs.position,
    isolation:getComputedStyle(ph).isolation, phOverflow:getComputedStyle(ph).overflow,
    order:[...ph.children].map(c=>c.className)});
}));
await b.close();
