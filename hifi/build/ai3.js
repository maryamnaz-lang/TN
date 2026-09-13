/* ==========================================================================
   AI LAYER — pass 3
   One thing now — CAPTURE. (PRACTICE, the candidate AI roleplay surface, was
   removed 9 Sep 2026: candidates practise through their real week, and AI
   roleplay is a Talent Agent training feature. See the note below.)

   CAPTURE. Every signal the product holds comes from clicks, scores and
      one notes box. The leadership happens at her job, and almost none of it
      is being collected. One line at the top of the dashboard, in her own
      words, is worth more than another chart of minutes watched.
   ========================================================================== */

/* PRACTICE (candidate AI roleplay) WAS REMOVED HERE (Client, 9 Sep 2026).
   The candidate practises through their real week (the cohort cycle),
   not an AI partner; AI roleplay is a Talent Agent training feature now.
   Gone with it: the `RP` scenarios, `V.rp`, the `data-rp*` handlers, the
   `practice|roleplay|mock` TAL_ROUTES trigger and `S.rpk`/`S.rpSaid`. The
   chapter's Roleplay stage and every `data-go="rp"` entry point went too
   (views.js, ai8.js). CAPTURE below is untouched. */

/* --------------------------------------------------------------------------
   CAPTURE
   The product's whole signal is clicks and scores. This is one line, in her
   own words, about the week her cohort has just had — and Tal says what it
   did with it rather than swallowing it. The explanation that used to sit
   here was the design arguing for itself; the question is the whole point
   and it does not need defending.
   -------------------------------------------------------------------------- */
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

/* the capture bar goes at the head of the dashboard, under Tal */
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

/* --------------------------------------------------------------------------
   THE ACCOUNT'S TWO NEW ACTIONS
   Volunteering to lead, and closing the account. One is a request that goes
   to a person; the other is irreversible and therefore asks twice.
   -------------------------------------------------------------------------- */
S.ledApplied = false; S.delAsk = false;

/* THE RATING + REVIEW CARD (reviewCard, views.js). A star click sets the score
   and re-renders; Submit stores whatever the note holds and flips to the sent
   state; Maybe later dismisses. The note itself is kept in sync WITHOUT a render
   by the input listener below, so typing does not lose focus and a star click
   redraws the textarea from `S`. */
device.addEventListener('click', e => {
  const star = e.target.closest('[data-rate]');
  if(star){ const [key, n] = star.dataset.rate.split(':'); (S.reviews[key] = S.reviews[key] || {}).stars = +n; render(); return; }
  const sub = e.target.closest('[data-review-submit]');
  if(sub){ const key = sub.dataset.reviewSubmit; const r = S.reviews[key] = S.reviews[key] || {};
    if(!r.stars) return;
    const ta = device.querySelector(`[data-revta="${key}"]`); if(ta) r.text = ta.value;
    r.sent = true; render(); return; }
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
    /* clicking the scrim closes it; clicking inside the sheet does not */
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

/* the thread opens on the latest message, not the oldest.

   SETTING IT ONCE PER RENDER IS NOT ENOUGH, and the reason is this file's
   position in the chain. Every later pass wraps `render` again — ai4 rebuilds
   Tal's page, ai5 hoists the summary card into the module head band, ai6
   rewrites its words — so the scroller is a different SIZE moments after this
   runs: the band appearing above the thread takes ~116px off the box, which
   moves the end of the thread 116px further down without moving the scroll
   position with it. The thread was left short of the newest message by
   whatever the passes added, which read as "it opens in the middle".

   So the box is PINNED rather than set: `pin()` on the render, again on the
   next frame, and again whenever the box changes size (the ResizeObserver is
   what catches the passes, the font swap and a window resize alike). The box
   is rebuilt from scratch on every render — trap 9 — so the observer is
   attached to the new node each time and the old one is collected with it;
   `stick` lives outside so the INTENT survives the re-render even though the
   element does not.

   AND IT LETS GO WHEN YOU SCROLL BACK. Reading Monday's messages while the
   box keeps yanking you to Wednesday would be worse than opening at the top.
   So the pin releases on a scroll UP and takes hold again at the end.

   DIRECTION, NOT DISTANCE, AND THIS IS THE WHOLE TRAP. The first version
   asked "is the box near its end?" — and switched itself off on the very
   scroll `pin()` had just performed. A scroll event is dispatched after the
   task that caused it, so by the time it was read the band had already been
   hoisted, the box was 116px shorter, its end was 116px further away, and the
   position the pin had just set no longer counted as "near the end". The pin
   released before the frame that would have corrected it. Comparing against
   the LAST position instead cannot be fooled that way: `pin()` records where
   it left the box, a resize moves the end without moving the box, and only an
   actual scroll backwards means a person is reading. */
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
    /* THE BOX AND EVERY MESSAGE IN IT. Observing the box alone catches the
       passes taking height off it, and misses the other half: the box is
       frame-bound, so when the CONTENT grows its own size never changes and
       the observer never fires. That is what was left — the embedded faces
       (§27) swap in after the first paint and the thread gets ~116px taller
       under a scroll position that was correct when it was set. Each child is
       observed too, which is a dozen nodes and catches every one of them. */
    if(typeof ResizeObserver === 'function'){
      const ro = new ResizeObserver(pin);
      ro.observe(box);
      for(const k of box.children) ro.observe(k);
    }
  }
  requestAnimationFrame(pin);
  /* and once more when the webfonts land, for the same reason: Plus Jakarta
     Sans and Inter are base64 in the bundle but still load asynchronously, and text
     re-set in the real face is a different height than text set in the
     fallback. `.then` on an already-resolved `fonts.ready` is a microtask, so
     this costs nothing on every render after the first. */
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(pin);
}
const _base4 = render;
render = function(){ _base4(); try { scrollThread(); } catch(e){} };
render();
