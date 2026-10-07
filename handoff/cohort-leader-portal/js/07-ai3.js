const capture = () => S.capDone ? `<div class="cap done">
    <span class="cap-mk">${I.checkFilled}</span>
    <div class="cap-b">
      <div class="cap-t">Filed against chapter 4 and your growth area</div>
      <div class="cap-x">&ldquo;${S.capText}&rdquo;</div>
      <div class="cap-f">
        <button class="lnk" data-capundo="1">Undo</button>
        <span class="cap-n">I will bring this up on Thursday if it is still open.</span>
      </div>
    </div>
  </div>` : `<div class="cap">
    <div class="cap-b">
      <div class="cap-t">What happened this week?</div>
      <div class="askbar">
        <span class="askbar-mk">${I.ai}</span>
        <input class="inp" id="capIn" placeholder="Something you handed over, ducked, or got wrong" aria-label="What happened this week">
        <button class="composer-send" data-capsave="1" aria-label="Save">${I.arrowRight}</button>
      </div>
    </div>
  </div>`;

device.addEventListener('click', e => {
  const t = e.target;
  if(t.closest('[data-capsave]')){
    const el = document.getElementById('capIn');
    const v = el && el.value.trim();
    if(v){ S.capText = v; S.capDone = true; render(); }
    return;
  }
  if(t.closest('[data-capvoice]')){
    S.capText = 'Took the Thursday review back off Sam again. Told myself it was the deadline.';
    S.capDone = true; render(); return;
  }
  if(t.closest('[data-capundo]')){ S.capDone = false; S.capText = ''; render(); return; }
});

S.capDone = false; S.capText = '';

function placeCapture(){
  if(S.view !== 'dashboard') return;
  const page = device.querySelector('.main > .page');
  if(!page || page.querySelector('.cap')) return;
  const tal = [...page.children].find(el => el.classList.contains('sec') && el.querySelector('.ai-aura'));
  const anchor = tal || page.querySelector(':scope > .ph');
  if(!anchor) return;
  const sec = document.createElement('div');
  sec.className = 'sec cap-sec';
  sec.innerHTML = capture();
  anchor.insertAdjacentElement('afterend', sec);
}

const _base3 = render;
render = function(){ _base3(); try { placeCapture(); } catch(e){ console.warn('capture', e); } };
render();

S.ledApplied = false; S.delAsk = false;

device.addEventListener('click', e => {
  const capOpen = e.target.closest('[data-revopen]');
  if(capOpen){ const key = capOpen.dataset.revopen; (S.reviews[key] = S.reviews[key] || {}).open = true; S.revMorph = true; render(); S.revMorph = false; return; }
  const capClose = e.target.closest('[data-revclose]');
  if(capClose){ const key = capClose.dataset.revclose; (S.reviews[key] = S.reviews[key] || {}).open = false; S.revMorph = true; render(); S.revMorph = false; return; }
  const star = e.target.closest('[data-rate]');
  if(star){ const [key, n] = star.dataset.rate.split(':'); (S.reviews[key] = S.reviews[key] || {}).stars = +n; render(); return; }
  const sub = e.target.closest('[data-review-submit]');
  if(sub){ const key = sub.dataset.reviewSubmit; const r = S.reviews[key] = S.reviews[key] || {};
    if(!r.stars) return;
    const ta = device.querySelector(`[data-revta="${key}"]`); if(ta) r.text = ta.value;
    r.sent = true; render();
    setTimeout(() => { r.done = true; render(); }, 3500); return; }
  const later = e.target.closest('[data-review-later]');
  if(later){ const key = later.dataset.reviewLater; (S.reviews[key] = S.reviews[key] || {}).later = true; render(); return; }
});
device.addEventListener('input', e => {
  const ta = e.target.closest('[data-revta]'); if(!ta) return;
  const key = ta.dataset.revta;
  (S.reviews[key] = S.reviews[key] || {}).text = ta.value;
  const c = device.querySelector(`[data-revcount="${key}"]`); if(c) c.textContent = ta.value.length;
});

device.addEventListener('click', e => {
  if(e.target.closest('[data-leadapply]')){ S.ledApplied = true; render(); return; }
  const d = e.target.closest('[data-del]');
  if(d){
    if(d.classList.contains('modal') && e.target !== d) return;
    S.delAsk = d.dataset.del === '1';
    render(); return;
  }
  if(e.target.closest('[data-delgo]')){
    const v = (document.getElementById('delc')||{}).value || '';
    if(v.trim().toUpperCase() !== 'DELETE') return;
    S.delAsk = false; go('stage:signup/login');
  }
});

let stick = true;
function scrollThread(){
  const box = device.querySelector('.msg-page > .msgs');
  if(!box) return;
  let last = box.scrollTop;
  const end = () => box.scrollHeight - box.clientHeight;
  const pin = () => { if(stick){ box.scrollTop = box.scrollHeight; last = box.scrollTop; } };
  pin();
  if(!box.dataset.pin){
    box.dataset.pin = '1';
    box.addEventListener('scroll', () => {
      if(box.scrollTop < last - 8) stick = false;
      else if(box.scrollTop >= end() - 8) stick = true;
      last = box.scrollTop;
    });
    if(typeof ResizeObserver === 'function'){
      const ro = new ResizeObserver(pin);
      ro.observe(box);
      for(const k of box.children) ro.observe(k);
    }
  }
  requestAnimationFrame(pin);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(pin);
}
const _base4 = render;
render = function(){ _base4(); try { scrollThread(); } catch(e){} };
render();
