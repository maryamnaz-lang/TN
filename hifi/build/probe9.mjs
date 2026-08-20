import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const page = await b.newPage({viewport:{width:900,height:1000}});
await page.goto('file:///home/claude/talentnext/talentnext-candidate-portal-v15.html');
await page.waitForTimeout(700);
await page.evaluate(()=>{const d=document.getElementById('device');d.dataset.vp='fluid';d.style.maxWidth='390px';d.style.width='390px';});
await page.evaluate(()=>{setStage('new');S.view='level';render();});
await page.waitForTimeout(300);
console.log(await page.evaluate(()=>{
  let el=null;
  for(const h of document.querySelectorAll('#device .sec-h h2')) if(/ladder/.test(h.textContent)) el=h.parentElement;
  const hits=[];
  const walk=(rules)=>{for(const r of rules){
    if(r.cssRules){ walk(r.cssRules); continue; }
    if(!r.selectorText||!r.style) continue;
    if(!/padding/.test(r.style.cssText)) continue;
    try{ if(el.matches(r.selectorText)) hits.push(r.selectorText+' => '+r.style.cssText); }catch(e){}
  }};
  for(const ss of document.styleSheets){ try{ walk(ss.cssRules); }catch(e){} }
  return hits.join('\n');
}));
await b.close();
