/* ==========================================================================
   AI LAYER — pass 3
   Two more things, and the reason for each.

   1. PRACTICE. Roleplay is already a stage in every chapter of this course —
      it is in the curriculum. As an AI feature it was a suggestion chip. An
      agent that plays the person you have to have the conversation with,
      briefed on what you actually said in your interview, is the thing a
      competitor cannot copy by writing better content. It gets a surface.

   2. CAPTURE. Every signal the product holds comes from clicks, scores and
      one notes box. The leadership happens at her job, and almost none of it
      is being collected. One line at the top of the dashboard, in her own
      words, is worth more than another chart of minutes watched.
   ========================================================================== */

/* --------------------------------------------------------------------------
   THE SCENARIOS
   Each is drawn from a specific thing in her record, and says so. `brief` is
   what the character has been told; showing it is the difference between a
   practice partner and a black box.
   -------------------------------------------------------------------------- */
const RP = {
  sam: {
    who:'Sam', role:'Your direct report', img:'owen',
    title:'Hand the vendor review over — and leave it handed over',
    from:'Your level interview, 11:02 and 12:11',
    iv:'level', at:'12:11',
    brief:'Sam is capable and has not met this vendor. He reads politeness as approval. He will not ask what you are worried about unless you offer it.',
    open:'Sure, I can take the vendor review. Anything I should know before I start?',
    turns:[
      { opts:[
        {t:'Not really. It is fairly straightforward.', k:'dodge'},
        {t:'Yes — the vendor is difficult, and there is a sentence that always sets them off. Let me tell you which.', k:'good'},
        {t:'Actually, leave it with me. I will pick it up.', k:'take'}
      ]},
      { reply:{
        dodge:'Great, I will get a draft over on Thursday then.',
        good:'That is useful. So if they push back on scope I should not soften it, I should just restate the date?',
        take:'Oh — okay. Was there something wrong with how I was going to do it?'
      }, opts:[
        {t:'Yes. Restate the date and tell me the same day.', k:'good'},
        {t:'No, nothing wrong. I just have capacity this week.', k:'dodge'},
        {t:'Nothing wrong. I am finding it hard to leave this one alone, which is mine, not yours.', k:'honest'}
      ]},
      { reply:{
        good:'Understood. I will send you what I send them, before I send it.',
        dodge:'Alright. I will pick up something else then.',
        honest:'I would rather you told me that than took it back. I will send you the draft before it goes.'
      }}
    ],
    debrief:{
      good:'You said the worry out loud and the work stayed handed over. That is the whole of chapter 4, and it is the thing you told Priya you could not do.',
      dodge:'You kept it pleasant and Sam left without the one piece of information that decides whether this lands. This is the shape of the August answer.',
      take:'You took it back. Sam heard that as a judgement of him, which is exactly what happened in the real one.',
      honest:'You named the thing as yours rather than dressing it as capacity. Sam gave you a better offer than you asked for.'
    }
  },
  finance: {
    who:'Rita', role:'Finance director, your peer', img:'lena',
    title:'Have the conversation you exchanged documents about',
    from:'Your level interview, 31:33',
    iv:'level', at:'31:33',
    brief:'Rita has your headcount paper and has not read past page one. She is not hostile; she is protecting a number she has been given. She responds to specifics and hardens against process.',
    open:'I have got your paper. I am going to be honest, I have not read all of it — where are we, exactly?',
    turns:[
      { opts:[
        {t:'It is all in the document. Page four has the model.', k:'dodge'},
        {t:'Two roles, both in the delivery team, both funded from a budget you already hold. That is the whole ask.', k:'good'},
        {t:'We have been going round this for two quarters and I would like to just decide it today.', k:'blunt'}
      ]},
      { reply:{
        dodge:'Then send me a summary. I am not reading four pages before Thursday.',
        good:'That is the first time anyone has said it in one sentence. Which budget?',
        blunt:'So would I. But I am not agreeing to something I do not understand because we are both tired of it.'
      }, opts:[
        {t:'The delivery contingency. It is not new money.', k:'good'},
        {t:'I will put it in writing and send it over.', k:'dodge'}
      ]},
      { reply:{
        good:'Then I do not think we disagree. I think we have been writing at each other.',
        dodge:'Fine. Another document.'
      }}
    ],
    debrief:{
      good:'You put it in one sentence and it resolved in three exchanges. You told Priya this ran for two quarters on paper.',
      dodge:'You reached for the document again. That is the avoidance you named yourself in the interview.',
      blunt:'Direct, but you led with the history rather than the ask, and she defended.'
    }
  },
  director: {
    who:'Elena', role:'Your director', img:'priya',
    title:'Bring a decision, not cover for one you have made',
    from:'Your level interview, 25:04',
    iv:'level', at:'25:04',
    brief:'Elena is short of time and reads confidence as competence. She will approve almost anything you bring with certainty, which is the trap.',
    open:'You said you needed ten minutes. Go.',
    turns:[
      { opts:[
        {t:'I want to move the launch to March. I have thought it through and I think it is right.', k:'cover'},
        {t:'I am between two dates and I want your read before I choose. Here is what each costs.', k:'good'}
      ]},
      { reply:{
        cover:'Fine. Your call, you know it better than I do.',
        good:'Alright. What does February cost us that March does not?'
      }, opts:[
        {t:'February costs us the second QA pass. March costs us the conference.', k:'good'},
        {t:'Honestly, not much either way.', k:'cover'}
      ]},
      { reply:{
        good:'Then March, and I will handle the conference conversation. Good — you actually asked me something.',
        cover:'Then why are we having this meeting?'
      }}
    ],
    debrief:{
      good:'You brought a decision you had not made and got something back. You told Priya you bring decisions you are looking for cover on — this was not that.',
      cover:'She approved it without engaging, which is what happens when the decision arrives finished. You spotted this pattern yourself at 25:04.'
    }
  }
};

const rpKeys = Object.keys(RP);

V.rp = (f) => {
  const key = S.rpk;
  if(!key) return `<main class="main"><div class="page">
    ${crumb(['Dashboard','dashboard'],'Practice')}
    ${ph('Practice a conversation',
      'Tal plays the other person, briefed on what you actually said in your interview. Nothing here is recorded or shared &mdash; it is a rehearsal room.')}
    <div class="sec">
      <div class="sec-h"><h2>Drawn from your record</h2><span class="t-helper-01">3 scenarios</span></div>
      <div class="rp-list">
        ${rpKeys.map(k => { const r = RP[k]; return `
          <button class="rp-c" data-rp="${k}">
            <span class="rp-av">${avatar({i:r.who[0]+r.role[0], img:AV[r.img]}, 44)}</span>
            <span class="rp-b">
              <span class="rp-t">${r.title}</span>
              <span class="rp-w">With ${r.who} &middot; ${r.role.toLowerCase()}</span>
              <span class="rp-src">${I.video}${r.from}</span>
            </span>
            <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
          </button>`; }).join('')}
      </div>
    </div>
    <div class="sec">
      <div class="note band"><span>${I.info}</span><div class="nb"><b>Why these three</b>They are the three conversations you described going wrong, in your own words, at the interview. Practising something you did not struggle with would be a waste of your Thursday.</div></div>
    </div>
  </div></main>`;

  const r = RP[key];
  const said = S.rpSaid || [];
  const i = said.length;
  /* the last turn is the character's closing line and carries no options,
     so the exchange is over when there is nothing left to say rather than
     when the array runs out */
  const done = i >= r.turns.length || !r.turns[i].opts;
  const last = said.length ? said[said.length-1] : null;

  const line = (who, txt, mine) => `<div class="m ${mine?'me':'them'}">
    <span class="m-av">${mine ? avatar({i:'MN', img:AV.hana},32) : avatar({i:r.who[0], img:AV[r.img]},32)}</span>
    <div class="m-c"><div class="m-b">${txt}</div><div class="m-w">${mine?'You':r.who}</div></div>
  </div>`;

  let thread = line(r.who, r.open, false);
  said.forEach((k, n) => {
    const opt = r.turns[n].opts.find(o => o.k === k);
    thread += line('You', opt ? opt.t : '', true);
    const nxt = r.turns[n+1];
    if(nxt && nxt.reply && nxt.reply[k]) thread += line(r.who, nxt.reply[k], false);
  });

  return `<main class="main"><div class="page">
  ${crumb(['Practice','rp'], r.who)}
  ${ph(r.title, `With ${r.who} &mdash; ${r.role.toLowerCase()}`,
    `<button class="btn btn-g" data-rprestart="1">Start again ${I.restart}</button>`)}

  <div class="sec">
    <div class="gen">
      <div class="gen-h">${talLabel()}<span class="gen-src">What ${r.who} has been told</span></div>
      <p>${r.brief}</p>
      <div class="gen-f">
        <button class="lnk" data-ivt="${r.iv}" data-at="${r.at}">Built from your interview at ${r.at}</button>
        <span class="gen-note">Not recorded. Not shared with Priya.</span>
      </div>
    </div>
  </div>

  <div class="sec">
    <div class="msgs room rp-thread">${thread}</div>
    ${done ? '' : `<div class="rp-opts">
      <div class="rp-opts-h">Your turn</div>
      ${r.turns[i].opts.map(o => `<button class="rp-o" data-rpsay="${o.k}">${o.t}</button>`).join('')}
    </div>`}
  </div>

  ${done ? `<div class="sec">
    <div class="sec-h"><h2>How that went</h2></div>
    <div class="gen">
      <div class="gen-h">${talLabel()}<span class="gen-src">Against what you told Priya</span></div>
      <p>${r.debrief[last] || r.debrief.good}</p>
      <div class="gen-f">
        <button class="btn btn-g btn-sm noic" data-rprestart="1">Run it again ${I.restart}</button>
        <button class="lnk" data-go="rp">Another conversation</button>
      </div>
    </div>
  </div>` : ''}
</div></main>`;
};

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
  const r = t.closest('[data-rp]');
  if(r){ S.rpk = r.dataset.rp; S.rpSaid = []; S.hist.push('rp'); render(); return; }
  const s = t.closest('[data-rpsay]');
  if(s){ S.rpSaid = [...(S.rpSaid||[]), s.dataset.rpsay]; render(); return; }
  if(t.closest('[data-rprestart]')){ S.rpSaid = []; render(); return; }

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

TAL_ROUTES.unshift(
  [/practi[cs]e|roleplay|role play|mock|rehears/i, () => `<div class="gen">
    <div class="gen-h">${talLabel()}<span class="gen-src">Three conversations from your interview</span></div>
    <p>I can play the other person. Sam, so you can hand something over and leave it handed over; Rita in finance, the disagreement you ran on paper for two quarters; or Elena, where you bring a decision you have already made.</p>
    <div class="gen-f"><button class="btn btn-p btn-sm noic" data-go="rp">Open practice ${I.arrowRight}</button></div>
  </div>`]
);

S.rpk = null; S.rpSaid = []; S.capDone = false; S.capText = '';

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
  /* and once more when the webfonts land, for the same reason: Inter and
     Söhne are base64 in the bundle but still load asynchronously, and text
     re-set in the real face is a different height than text set in the
     fallback. `.then` on an already-resolved `fonts.ready` is a microtask, so
     this costs nothing on every render after the first. */
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(pin);
}
const _base4 = render;
render = function(){ _base4(); try { scrollThread(); } catch(e){} };
render();
