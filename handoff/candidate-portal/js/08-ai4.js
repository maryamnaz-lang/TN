const NO_ASK = ['coursework','chapter','terms'];

const ASK_WHERE = {dashboard:'Dashboard', level:'My Level', coursework:'Coursework',
  transcript:'Course Progress', rewards:'Points', cohort:'Cohort 41',
  interviews:'Interviews', enrol:'Enrolling', billing:'Payments',
  report:'Your report', agents:'Choosing an agent', agent:'Agent profile',
  booking:'Interview booked', payment:'Payment', welcome:'Enrolled', account:'Profile',
  messages:'Messages', chapter:'A chapter', ivt:'An interview transcript',
  rp:'Practising with Tal', mem:'A cohort member'};

S.askOpen = false;
S.askFrom = null;
let ASK_FRESH = false;

const SPEECH = window.SpeechRecognition || window.webkitSpeechRecognition;
const SPEECH_OK = !!SPEECH;


function askBar(){
  const q = askQ();
  return `<button class="askline" data-askopen="1" aria-label="Ask Tal anything">
    ${AI_RUN}
    <span class="askline-mark">${borbMark('tal-mk')}</span>
    ${''/* "Ask Tal", not "Ask Tal anything" — Figma 875:6598, 9 Sep 2026. The
          example question beside it carries the "…anything" sense; the label is
          the shorter of the two now. The aria-label keeps the full phrase. */}
    <span class="askline-t">Ask Tal</span>
    <span class="askline-q" aria-hidden="true">${q ? '&ldquo;' + q + '&rdquo;' : ''}</span>
    ${''/* ARROW-RIGHT, NOT ARROW-UP — Figma 578:5966 (581:6589), and it agrees
          with the note above about the control being drawn OFF. Up is the chat
          convention for "send this message"; the collapsed line does not send
          anything, it OPENS the conversation, and the file draws that as the
          same forward arrow every other "go on to the next screen" control in
          the build carries. §70 gives the chip the accent gradient at the
          file's own 20%, which is what says the control is not live yet. */}
    ${''/* THE DOCK CARRIES THE SAME PAIR AS THE CHAT'S FIELD (Maryam, 2 Sep
           2026: "the tal bar should also have the round arrow icon with the mic
           like we have on the tal chat page"), and the mic here is a `<span>`
           for the reason this whole row is one `<button>`: §21's note — "a
           button inside a button is a click whose destination depends on where
           in the row you land".

           IT IS NOT A DEAD CONTROL EITHER, which is the other half. §60's rule
           would refuse a decorative mic, so pressing it does the one thing it
           can honestly mean on a collapsed line: it opens the conversation AND
           starts recording, in that order (Maryam, 6 Sep 2026: recording is not
           offered on the floating bar itself — pressing the bar's mic opens the
           chat and begins the take there, with no second press). `data-askmicopen`
           is read before `data-askopen` in the click handler, so the mark is a
           shortcut into the same surface rather than a second destination.

           AND IT IS DRAWN ONLY WHERE DICTATION EXISTS — `SPEECH_OK`, the same
           constructor test the chat's field uses. A browser with no Web Speech
           API gets the row exactly as it was. */}
    ${SPEECH_OK ? `<span class="askline-mic" data-askmicopen="1"
      title="Ask Tal by voice">${I.microphone}</span>` : ''}
    <span class="askline-send" aria-hidden="true">${I.arrowRight}</span>
  </button>`;
}

function askCtx(v){
  const view = v || S.view;
  const lead = isLead() && typeof LEAD_TAL !== 'undefined' ? LEAD_TAL : null;
  return (lead ? (lead.ctx[view] || lead.ctx.leadDash)
               : (TALCTX[view] || TALCTX.dashboard)) || [];
}

const ASK_ROT_MS = 3000;
let ASK_ROT_KEY = null, ASK_ROT_I = 0, ASK_ROT_ON = false;

const askQKey = () => (S.portal || 'candidate') + '/' + S.view;

function askQ(){
  const list = askCtx();
  if(askQKey() !== ASK_ROT_KEY){ ASK_ROT_KEY = askQKey(); ASK_ROT_I = 0; }
  return list.length ? list[ASK_ROT_I % list.length] : '';
}

function askRotate(){
  const q = device.querySelector('.askdock .askline-q');
  if(!q) return;
  const list = askCtx();
  if(askQKey() !== ASK_ROT_KEY){ ASK_ROT_KEY = askQKey(); ASK_ROT_I = 0; return; }
  if(list.length < 2) return;
  ASK_ROT_I = (ASK_ROT_I + 1) % list.length;
  q.classList.add('going');
  setTimeout(() => {
    const still = device.querySelector('.askdock .askline-q');
    if(!still) return;
    still.innerHTML = '&ldquo;' + list[ASK_ROT_I % list.length] + '&rdquo;';
    still.classList.remove('going');
  }, 200);
}

function askBubble(who, html, live){
  return who === 'me'
    ? `<div class="tal-msg me"><span class="tal-who"><span class="tal-who-n">You</span><span class="av"><img src="${isLead()?AV.priya:AV.hana}" alt=""><i>${isLead()?'PN':'MN'}</i></span></span><div class="bb">${html}</div></div>`
    : `<div class="tal-msg"><span class="tal-who">${borbMark('tal-mk sm', live)}<span class="tal-who-n">Tal</span></span><div class="bb">${html}</div></div>`;
}

function askView(f){
  const lead = isLead() && typeof LEAD_TAL !== 'undefined' ? LEAD_TAL : null;
  const where = (lead ? lead.where[S.askFrom] : ASK_WHERE[S.askFrom]) || 'TalentNext';
  const ctx = (lead ? (lead.ctx[S.askFrom] || lead.ctx.leadDash) : (TALCTX[S.askFrom] || TALCTX.dashboard));

  const opened = S.thread.length > 0;
  const blob = `<video class="tal-blobv" src="${TAL_BLOB}"`
    + ` poster="${TAL_BLOB_POSTER}"${reduce() ? '' : ' autoplay'}`
    + ` loop muted playsinline preload="auto" aria-hidden="true"></video>`;
  const hero = `<div class="tal-hero">
      ${borbMark('tal-mk lg', true)}
      <h2>Hey, ${isLead()?'Priya':'Maryam'}! <span class="askv-q">${isLead()?'What do you need?':'What&rsquo;s going on?'}</span></h2>
      <p>${isLead()?'I can read your cohorts, your evaluations and where people are stuck.':'I am here to assist you with anything you need help with.'}</p>
    </div>`;
  const thread = (opened ? '' : hero)
    + S.thread.map(m => askBubble(m.who, m.html)).join('')
    + (S.typing ? askBubble('tal', `<div class="ai-stream"><i></i><i></i><i></i></div>`, true) : '');

  return `<div class="page ask-page">
    <div class="ask-top">
      <button class="ph-back" data-askback="1" aria-label="Back to ${where}">${I.arrowLeft}</button>
      <span class="ask-top-id">
        ${borbMark('tal-mk')}
        <span class="ask-top-t">Tal</span>
      </span>
    </div>
    <div class="ask-thread" id="askThread">${thread}</div>
    <div class="ask-foot">
      ${''/* THE DAILY-LIMIT STATE (story 15.5). At the limit the thread carries the
             limit line, the suggestion chips are gone (inactive) and the composer
             below is disabled. `talAtLimit` is a views.js const, available at render
             time. Below the limit it is the usual chip row. */}
      ${talAtLimit()
        ? `<div class="ask-limit">You have asked Tal everything it can take today. Come back tomorrow.</div>`
        : (opened ? '' : `<div class="ask-sugg">${ctx.map(s =>
          `<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>${s}</button>`).join('')}</div>`)}
      <div class="askfield${talAtLimit()?' askfield-off':''}">
        ${''/* THE COMET COMES BACK (Maryam, 17 Sep 2026: "in the internal chat
               screens make sure the ui of chat bar is almost same in terms of
               shadows and this running strobe effect"). §118's note records the
               4 Sep ask this reverses — "do not add the moving line on the
               border" — so the field was built as the dock MINUS `.ai-run` and
               minus the lift. Both come back here and in §118; the walking
               `::before` stroke §53 drew stays off, because the comet is now
               the moving line and two of them on one edge is the thing §118
               took the first one off to avoid. */}
        ${AI_RUN}
        <span class="askv-clip">${I.attachFile}</span>
        ${''/* PLACEHOLDER "Ask Tal anything" — the fixed placeholder story 15.5
               names. Disabled at the daily limit (the send is already disabled at
               render and stays that way while the input is off). */}
        <input class="inp" id="askIn" placeholder="Ask Tal anything" autocomplete="off"${talAtLimit()?' disabled':''}>
        ${''/* THE MIC IS DRAWN ONLY WHERE IT CAN WORK — §60's rule, applied to a
               browser capability rather than to missing data: "a dead control on
               a live surface is worse than a missing one", which is why the
               month chevrons stayed off §76 until `AGENT_CAL` gave them
               somewhere to go. `SPEECH_OK` is the constructor test, so in a
               browser with no Web Speech API the field is exactly what it was.

               IT IS A VOICE MESSAGE, NOT DICTATION (Maryam, 6 Sep 2026). It
               used to write the Web Speech transcript straight into this input;
               pressing it now turns the whole field into the §121 recorder —
               `askRecStart` adds `.rec` and the `.askrec` row. It still sits
               beside the send because it is the field's own control, and it is
               still drawn only where the recogniser exists (`SPEECH_OK`), so a
               browser with no Web Speech keeps the field it always had. */}
        ${SPEECH_OK && !talAtLimit() ? `<button class="askfield-mic" data-askmic="1"
          aria-label="Record a voice message"
          title="Record a voice message">${I.microphone}</button>` : ''}
        ${''/* THE SEND IS OFF UNTIL THERE IS SOMETHING TO SEND (Maryam, 2 Sep
               2026: "keep the send arrow circle little disable until nothing has
               been written or no voice has been recorded yet"). It is the real
               `disabled` attribute rather than a class, so the control cannot be
               pressed as well as not looking pressable — §21's original note for
               the collapsed line makes the argument for the look ("a control
               that is visibly OFF tells the truth"), and this adds the half that
               makes it true.

               `disabled` AT RENDER IS ALWAYS CORRECT, which is why there is no
               state to keep: `placeAsk` rebuilds the field on every render, so
               the `<input>` is new and empty every time it is drawn. What turns
               it on is `askSendArm`, from the field's own `input` event and from
               dictation's `onresult` — neither of which re-renders, for the
               caret reason ai4's own trap records. */}
        ${''/* THE SEND IS THE ARROW, LIKE THE FLOATING FIELD (Maryam, 9 Sep 2026:
               "the voice and send icon should also be like the ones we have on
               the floating field"). The dock's `.askline-send` is `I.arrowRight`;
               this was `I.send` (a paper plane). The mic is already `I.microphone`
               on both, so only the send changes. */}
        <button class="askfield-send" data-asksend="1" aria-label="Send" disabled>${I.arrowRight}</button>
      </div>
    </div>
  </div>`;
}

placeCapture = function(){};

function placeAsk(){
  if(S.stage === 'signup' || S.stage === 'onboard') return;
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;

  if(S.askOpen){
    let pg = main.querySelector('.ask-page');
    if(!pg){
      main.innerHTML = askView(cfg(S.stage));
      pg = main.querySelector('.ask-page');
      const th0 = pg && pg.querySelector('#askThread');
      if(th0) th0.dataset.n = String(S.thread.length);
      if(pg && ASK_FRESH){ pg.classList.add('ask-in'); ASK_FRESH = false; }
    }
    if(pg) askSync(pg);
    return;
  }

  device.querySelectorAll('.cap-sec').forEach(n => n.remove());
  if(NO_ASK.includes(S.view)) return;
  const col = main.parentElement;
  if(col && col.querySelector('.composer')) return;
  const page = main.querySelector('.page');
  if(!page) return;

  if(!col || col.querySelector(':scope > .askdock')) return;
  const dock = document.createElement('div');
  dock.className = 'askdock';
  dock.innerHTML = askBar();
  col.appendChild(dock);

  if(!ASK_ROT_ON){ ASK_ROT_ON = true; setInterval(askRotate, ASK_ROT_MS); }
}

const _baseAsk = render;
render = function(){ _baseAsk(); try { placeAsk(); } catch(e){ console.warn('ask', e); } };

function placeReviewFloat(){
  const col = device.querySelector('.view-col'); if(!col) return;
  if(typeof S !== 'undefined' && S.stage === 'held' && typeof reviewCard === 'function' && !col.querySelector('.rev-float')){
    const nm = (typeof COHORT_LEAD !== 'undefined' && COHORT_LEAD.n) ? COHORT_LEAD.n.split(' ')[0] : 'your agent';
    const html = reviewCard({key:'agent', title:`Rate your interview with ${nm}`, sub:'', capsule:`Rate your interview with ${nm}`});
    const main = col.querySelector('.main');
    if(html && main) main.insertAdjacentHTML('beforeend', html);
  }
  const rf = col.querySelector('.main .rev-float'); if(!rf) return;
  col.appendChild(rf);
  rf.classList.toggle('rev-float-nodock', !col.querySelector(':scope > .askdock'));
}
const _baseRevFloat = render;
render = function(){ _baseRevFloat(); try { placeReviewFloat(); } catch(e){ console.warn('revfloat', e); } };

function askSync(pg){
  const th = pg.querySelector('#askThread');
  if(!th) return;
  th.querySelectorAll('.ai-stream').forEach(n => {
    const b = n.closest('.tal-msg'); if(b) b.remove();
  });
  const have = +(th.dataset.n || 0);
  for(let i = have; i < S.thread.length; i++){
    th.insertAdjacentHTML('beforeend', askBubble(S.thread[i].who, S.thread[i].html));
    th.lastElementChild.classList.add('msg-in');
  }
  th.dataset.n = String(S.thread.length);
  if(S.typing){
    th.insertAdjacentHTML('beforeend',
      askBubble('tal', `<div class="ai-stream"><i></i><i></i><i></i></div>`));
    th.lastElementChild.classList.add('msg-in');
  }
  if(S.thread.length){
    const sg = pg.querySelector('.ask-sugg');
    if(sg && !sg.classList.contains('going')){
      sg.classList.add('going');
      setTimeout(() => sg.remove(), 200);
    }
  }
  try { th.scrollTo({top: th.scrollHeight, behavior: 'smooth'}); }
  catch(e){ th.scrollTop = th.scrollHeight; }
  const inp = pg.querySelector('#askIn');
  if(inp && document.activeElement !== inp && S.askOpen) inp.focus({preventScroll:true});
}

const ASK_OUT = 170, ASK_BACK = 190;
const reduce = () => window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function askOpen(q, then){
  if(S.askOpen){ if(q) ask(q); if(then) then(); return; }
  const go2 = () => {
    S.askFrom = S.view;
    S.askOpen = true;
    ASK_FRESH = true;
    S.nav = false; S.notif = false; S.acct = false; S.tal = false;
    render();
    if(q){ ask(q); if(then) then(); return; }
    const el = device.querySelector('#askIn');
    if(el) el.focus();
    if(then) then();
  };
  const pg = device.querySelector('.view-col .page');
  if(!pg || reduce()) return go2();
  pg.classList.add('page-to-ask');
  setTimeout(go2, ASK_OUT);
}

function askClose(){
  if(!S.askOpen) return;
  const back = () => {
    S.askOpen = false;
    if(S.askFrom) S.view = S.askFrom;
    render();
    const pg = device.querySelector('.view-col .page');
    if(pg && !reduce()) pg.classList.add('page-from-ask');
  };
  const pg = device.querySelector('.ask-page');
  if(!pg || reduce()) return back();
  pg.classList.remove('ask-in');
  pg.classList.add('ask-out');
  setTimeout(back, ASK_BACK);
}

device.addEventListener('click', e => {
  if(e.target.closest('[data-askmicopen]')){ askOpen(undefined, askRecStart); return; }
  if(e.target.closest('[data-askopen]')){ askOpen(); return; }
  if(e.target.closest('[data-askback]')){ askClose(); return; }
  if(e.target.closest('[data-askmic]')){ askRecStart(); return; }
  if(e.target.closest('[data-askreccancel]')){ askRecCancel(); return; }
  if(e.target.closest('[data-askrecstop]')){ askRecToField(); return; }
  if(e.target.closest('[data-askrecsend]')){ askRecSend(); return; }
  if(e.target.closest('[data-asksend]')){
    const el = device.querySelector('#askIn');
    const v = el && el.value.trim();
    if(v){ el.value = ''; askSendArm(); ask(v); }
    return;
  }
});

function askSendArm(){
  const el = device.querySelector('#askIn');
  const b = device.querySelector('.askfield-send');
  if(el && b) b.disabled = !el.value.trim();
}
device.addEventListener('input', e => { if(e.target.id === 'askIn') askSendArm(); });

let _vrec = null;        /* the live recogniser, or null */
let _vtxt = '';          /* the transcript so far */
let _vstream = null;     /* the getUserMedia stream feeding the waveform */
let _vac = null;         /* the AudioContext, closed on teardown */
let _vanal = null;       /* the AnalyserNode read each tick */
let _vtick = null;       /* the waveform setTimeout handle */
let _vbars = [];         /* the bar elements, left → right */
let _vsamples = [];      /* amplitudes, oldest → newest, capped at _vbars.length */
let _vactive = false;    /* true while a take is open (for the recogniser restart) */
let _vpending = null;    /* 'field' | 'send' — what to do when the take finalises */
let _vfatal = false;     /* the recogniser hit a permission/network wall — do not restart it */
let _vsyn = null;        /* the smoothed value the synthetic meter walks when there is no mic */

const askField = () => device.querySelector('.ask-page .askfield');

function askRecFallback(){
  const list = askCtx(S.askFrom || S.view) || [];
  return list.length ? list[Math.floor(Math.random() * list.length)] : '';
}

function askRecTeardown(){
  _vactive = false;
  if(_vtick){ clearTimeout(_vtick); _vtick = null; }
  if(_vrec){ try{ _vrec.stop(); }catch(err){} _vrec = null; }
  if(_vstream){ try{ _vstream.getTracks().forEach(t => t.stop()); }catch(err){} _vstream = null; }
  if(_vac){ try{ _vac.close(); }catch(err){} _vac = null; }
  _vanal = null; _vsamples = []; _vbars = [];
}

function askRecClear(){
  askRecTeardown();
  _vtxt = ''; _vpending = null;
  const fld = askField();
  if(!fld) return;
  fld.classList.remove('rec', 'rectx', 'recerr');
  const row = fld.querySelector('.askrec');
  if(row) row.remove();
}

function askRecTick(){
  if(!_vbars.length){ return; }
  let amp;
  if(_vanal){
    const buf = new Uint8Array(_vanal.fftSize);
    _vanal.getByteTimeDomainData(buf);
    let sum = 0;
    for(let i = 0; i < buf.length; i++){ const v = (buf[i] - 128) / 128; sum += v * v; }
    amp = Math.min(1, Math.sqrt(sum / buf.length) * 3.4);
  }else{
    _vsyn = (_vsyn == null ? 0.4 : _vsyn) * 0.7 + (0.15 + Math.random() * 0.7) * 0.3;
    amp = _vsyn;
  }
  _vsamples.push(amp);
  if(_vsamples.length > _vbars.length) _vsamples.shift();
  const off = _vbars.length - _vsamples.length;
  for(let i = 0; i < _vbars.length; i++){
    const s = i >= off ? _vsamples[i - off] : 0;
    _vbars[i].style.height = (3 + s * 33).toFixed(1) + 'px';   /* 3px dot → 36px peak in a 40px row */
  }
  _vtick = setTimeout(askRecTick, 55);
}

function askRecNote(state, msg){
  const fld = askField();
  if(!fld) return;
  fld.classList.remove('rectx', 'recerr');
  fld.classList.add(state);
  const n = fld.querySelector('.askrec-note');
  if(n) n.textContent = msg;
}

async function askRecStart(){
  const fld = askField();
  if(!fld || fld.classList.contains('rec')) return;
  askRecClear();
  _vtxt = ''; _vpending = null; _vactive = true; _vfatal = false; _vsyn = null;
  const row = document.createElement('div');
  row.className = 'askrec';
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', 'Recording a voice message');
  row.innerHTML =
    `<button class="askrec-x" data-askreccancel="1" aria-label="Cancel recording">${I.close}</button>`
    + `<div class="askrec-body">`
    +   `<div class="askrec-wave" aria-hidden="true"></div>`
    +   `<span class="askrec-note t-caption"></span>`
    + `</div>`
    + `<button class="askrec-stop" data-askrecstop="1" aria-label="Stop and edit"><span class="askrec-sq"></span></button>`
    + `<button class="askrec-send" data-askrecsend="1" aria-label="Send voice message">${I.arrowUp}</button>`;
  fld.classList.add('rec');
  fld.appendChild(row);

  try{
    _vstream = await navigator.mediaDevices.getUserMedia({audio:true});
  }catch(err){
    _vstream = null;
  }
  const fld2 = askField();
  if(!fld2 || !fld2.classList.contains('rec')){ askRecTeardown(); return; }

  const wave = fld2.querySelector('.askrec-wave');
  const w = wave ? wave.offsetWidth : 0;
  const n = Math.max(8, Math.floor((w || 240) / 6));   /* 3px bar + 3px gap = 6px pitch */
  wave.innerHTML = Array.from({length:n}, () => '<i></i>').join('');
  _vbars = [...wave.querySelectorAll('i')];
  _vsamples = [];
  if(_vstream){
    try{
      _vac = new (window.AudioContext || window.webkitAudioContext)();
      const src = _vac.createMediaStreamSource(_vstream);
      _vanal = _vac.createAnalyser();
      _vanal.fftSize = 512;
      src.connect(_vanal);
    }catch(err){ _vanal = null; }
  }
  askRecTick();

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(SR){
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = true;
    r.continuous = true;
    r.onresult = ev => {
      let full = '';
      for(let i = 0; i < ev.results.length; i++) full += ev.results[i][0].transcript;
      _vtxt = full.trim();
    };
    r.onerror = ev => {
      if(/not-allowed|service-not-allowed|audio-capture|network/.test(ev.error || '')) _vfatal = true;
    };
    r.onend = () => {
      if(_vpending){ const m = _vpending; _vpending = null; _vrec = null; askRecDeliver(m); return; }
      if(_vactive && !_vfatal){ try{ r.start(); }catch(err){ _vrec = null; } }
      else _vrec = null;
    };
    try{ r.start(); _vrec = r; }catch(err){ _vrec = null; }
  }
}

function askRecDeliver(mode){
  const txt = (_vtxt || '').trim() || askRecFallback();
  if(!txt){ askRecClear(); return; }   /* nothing, and no suggestion to stand in — just close */
  if(mode === 'send'){ askRecClear(); ask(txt); return; }
  askRecClear();
  const el = device.querySelector('#askIn');
  if(el){ el.value = txt; askSendArm(); el.focus(); }
}

function askRecFinish(mode){
  const fld = askField();
  if(!fld || !fld.classList.contains('rec')) return;
  if(fld.classList.contains('recerr') || fld.classList.contains('rectx')) return;
  _vactive = false;
  if(_vtick){ clearTimeout(_vtick); _vtick = null; }
  if(_vstream){ try{ _vstream.getTracks().forEach(t => t.stop()); }catch(err){} _vstream = null; }
  askRecNote('rectx', 'Transcribing…');
  if(_vrec){
    _vpending = mode;
    try{ _vrec.stop(); }
    catch(err){ _vpending = null; _vrec = null; setTimeout(() => askRecDeliver(mode), 450); }
  }else{
    setTimeout(() => askRecDeliver(mode), 450);
  }
}

function askRecCancel(){ askRecClear(); }
function askRecToField(){ askRecFinish('field'); }
function askRecSend(){ askRecFinish('send'); }

device.addEventListener('keydown', e => {
  if(e.target.id === 'askIn' && e.key === 'Enter'){
    const v = e.target.value.trim();
    if(v){ e.target.value = ''; ask(v); }
    e.preventDefault();
    return;
  }
  if(e.key === 'Escape' && S.askOpen){ askClose(); }
});

const _goAsk = go;
go = function(v, fresh){ if(S.askOpen && v !== S.askFrom){ S.askOpen = false; } _goAsk(v, fresh); };

render();

const GLOW_ON = '.plate, .cert, .sec.on-dark, .score.on-dark, .lead-b';

function placeGlow(){
  device.querySelectorAll(GLOW_ON).forEach(card => {
    if(card.querySelector(':scope > .dark-glow')) return;
    const i = document.createElement('i');
    i.className = 'dark-glow';
    i.setAttribute('aria-hidden', 'true');
    card.prepend(i);
  });
}

const _baseGlow = render;
render = function(){ _baseGlow(); try { placeGlow(); } catch(e){ console.warn('glow', e); } };
render();
