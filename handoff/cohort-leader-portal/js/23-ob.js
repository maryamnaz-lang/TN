S.ob = {where:null, band:null, why:null, want:null};
S.obStep = 0;
S.obSpoken = false;
S.obMode = 'chat';
S.obChatOpen = false;
S.obQi = 0;
S.obBarFrom = 0;
S.obLoading = false;

const OB_LOW = () => qzLow(2);

const OB_Q = [
  {k:'where',
   q:'Where are you right now?',
   tal:'Before I point you at anybody, I need a few things a quiz cannot tell me.',
   o:[['moveup','In a job I want to move up in'],
      ['leaving',"In a job I don't plan to stay in"],
      ['own','Running something of my own, or trying to start it'],
      ['between','Between things']]},

  {k:'persona',
   q:'Which of these sounds most like you? Pick one.',
   tal:'One word people would use for you. There is no wrong answer.',
   o:[['top','Top Performer'],
      ['athlete','Athlete'],
      ['leader','Leader'],
      ['entrepreneur','Entrepreneur'],
      ['notsure','Not Sure'],
      ['team','Team Player']]},

  {k:'role', t:'text',
   q:'What do you do now?',
   tal:'In your own words is fine.',
   ph:'Operations coordinator, student, own a detailing business'},

  {k:'industry', t:'dd',
   q:'What industry is that in?',
   tal:'Pick the closest one, or Other.',
   o:[['security','Security'],
      ['franchise','Franchise ownership'],
      ['retail','Retail'],
      ['food','Food and hospitality'],
      ['trades','Trades and construction'],
      ['healthcare','Healthcare'],
      ['logistics','Transportation and logistics'],
      ['sales','Sales'],
      ['education','Education'],
      ['technology','Technology'],
      ['student','Student'],
      ['other','Other']],
   ph:'Tell me your industry'},

  {k:'years',
   q:'How many years have you been working?',
   tal:'Roughly is fine.',
   o:[['0','Under 1'],
      ['1','1 to 3'],
      ['3','3 to 7'],
      ['7','7 to 15'],
      ['15','15 or more']]}
];

const obOpts = (s) => s.o || [];
const obTitle = (s) => s.q;
const obAttr = v => (v || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const OB_N = OB_Q.length;
const obLast = () => OB_N + 1;

function obReady(){
  const s = OB_Q[S.obStep - 1];
  if(!s) return true;
  if(s.t === 'text'){ const v = S.ob[s.k]; return !!(v && v.trim()); }
  if(s.t === 'dd'){
    const chosen = S.ddVal['ob-' + s.k] || obOpts(s)[0][1];
    if(chosen === 'Other'){ const o = S.ob[s.k + 'Other']; return !!(o && o.trim()); }
    return true;
  }
  return !!S.ob[s.k];
}

const OB_SPINE = ['Where you are','Who you are','What you do','Your industry','Your experience'];


function obPanel(){
  const step = S.obStep;
  const tal = step === 0
    ? `I am Tal. I am going to be with you for the whole of this, so let me start by telling you what I already know.`
    : step > OB_N
      ? `That is everything. Here it is back, in case I heard any of it wrong.`
      : OB_Q[step - 1].tal;

  return `<div class="auth-brand ob-brand">
    <div class="tal-hero">
      ${borbMark('tal-mk lg', true)}
      <h2>Hello <b>Maryam</b>, I am Tal &#128075;</h2>
      <p>${tal}</p>
    </div>
    <ol class="ob-spine">
      ${OB_Q.map((s,i) => {
        const n = i + 1;
        const st = step > n ? ' done' : step === n ? ' on' : '';
        return `<li class="ob-sp${st}"><i class="ob-sp-m">${
          step > n ? I.checkFilled : ''}</i><span>${OB_SPINE[i]}</span></li>`;
      }).join('')}
    </ol>
    <p class="t-helper-01 auth-foot ob-foot">Nothing here is assessed and none of it sets your level. Your level comes from a 45-minute interview with a talent agent, later, if you choose to go further.</p>
  </div>`;
}


const OB_GREET = 'Good Morning, Maryam!';

const obBlob = () => `<video class="tal-blobv ob-blobv" src="${TAL_BLOB}"`
  + ` poster="${TAL_BLOB_POSTER}"${reduce() ? '' : ' autoplay'}`
  + ` loop muted playsinline preload="auto" aria-hidden="true"></video>`;

let obAud = null;

function obBars(on){
  const el = device.querySelector('.ob-bars');
  if(el) el.classList.toggle('on', !!on);
}

function obPlay(){
  if(!obAud){
    obAud = new Audio(TAL_SPEECH);
    obAud.preload = 'auto';
    obAud.addEventListener('playing', () => obBars(true));
    obAud.addEventListener('pause',   () => obBars(false));
    obAud.addEventListener('ended',   () => obBars(false));
  }
  if(!obAud.paused) return;
  const armed = () => {
    document.removeEventListener('pointerdown', armed, true);
    document.removeEventListener('keydown', armed, true);
    obAud.play().catch(() => {});
  };
  obAud.play().catch(() => {
    document.addEventListener('pointerdown', armed, true);
    document.addEventListener('keydown', armed, true);
  });
}

const OB_SAY_AT = 1200;
let obSayTimer = null;
function obSpeak(){
  if(S.obSpoken) return;
  S.obSpoken = true;
  clearTimeout(obSayTimer);
  obSayTimer = setTimeout(() => { obSayTimer = null; obPlay(); }, OB_SAY_AT);
}
function obReplay(){
  if(obAud) obAud.currentTime = 0;
  obPlay();
}

function obHush(){
  if(obSayTimer){ clearTimeout(obSayTimer); obSayTimer = null; }
  if(!obAud || obAud.paused) return;
  obAud.pause();
  obAud.currentTime = 0;
}

const OB_BARS = 13;
const obBarsEl = () => `<span class="ob-bars${
  obAud && !obAud.paused ? ' on' : ''}" aria-hidden="true">${
  '<i></i>'.repeat(OB_BARS)}</span>`;

const obIntro = () => `
  <div class="ob-stage">
    <p class="ob-greet">${OB_GREET}</p>
    <div class="ob-orb" data-obgo="1" role="button" tabindex="0"
         aria-label="Let&rsquo;s get started">
      <i class="ob-ring ob-ring-1" aria-hidden="true"></i>
      <i class="ob-ring ob-ring-2" aria-hidden="true"></i>
      <span class="ob-blob">${obBlob()}</span>
      ${obBarsEl()}
    </div>
  </div>`;

const obDock = (mid, top) => `
  <div class="ob-dock">
    ${top || ''}
    ${S.obMode === 'chat' ? '' : `<button class="ob-mute${obAud && obAud.muted ? ' off' : ''}"
            data-obmute="1" aria-pressed="${obAud && obAud.muted}"
            aria-label="Mute Tal" title="${
            obAud && obAud.muted ? 'Unmute Tal' : 'Mute Tal'}">${
      obAud && obAud.muted ? I.volumeOff : I.volume}</button>`}
    <span class="ob-dock-mid">${mid || ''}</span>
    ${obModes()}
  </div>`;

function obProgress(){
  const answered = OB_Q.filter(q => S.ob[q.k] != null && S.ob[q.k] !== '').length;
  const done = Math.min(OB_N, Math.max(answered, S.obQi));
  return `<div class="ob-prog">
    <h3 class="ob-prog-h t-h3">You&rsquo;re almost there!</h3>
    <div class="ob-prog-bar" role="progressbar"
      aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${OB_N}">
      ${Array.from({length: OB_N}, (_, i) =>
        `<span class="ob-prog-seg${i < done ? ' on' : ''}"></span>`).join('')}
    </div>
  </div>`;
}

const obHead = () => `
  <header class="ob-head">
    <span class="ob-logo"><img src="${LOGO_K}" alt="TalentNext"></span>
  </header>`;

const obModes = () => {
  return '';
  const m = S.obMode === 'chat' ? 'chat' : 'voice';
  return `
  <div class="ob-modes" role="group" aria-label="How Tal talks to you">
    <button class="ob-mode${m === 'voice' ? ' on' : ''}" data-obmode="voice"
            aria-pressed="${m === 'voice'}">
      <span class="ob-mode-bars" aria-hidden="true">${'<i></i>'.repeat(5)}</span>
      <span>Voice</span>
    </button>
    <button class="ob-mode${m === 'chat' ? ' on' : ''}" data-obmode="chat"
            aria-pressed="${m === 'chat'}">${I.chat}<span>Chat</span></button>
  </div>`;
};

const OB_CHAT = [
  'Welcome to TALENTnext, Maryam!',
  'I&rsquo;m Tal, and I&rsquo;ll be your companion throughout your TalentNext journey.',
  'Before we dive into the experience, let&rsquo;s start with a few quick questions about you. Nothing too complicated, just a chance for us to get to know you better.'
];


function obChat(){
  obHush();
  S.obMode = 'chat';
  render();
}

const obChatMsg = (m) => m.who === 'me'
  ? `<div class="ob-m ob-m-me"><span class="ob-m-b">${m.html}</span></div>`
  : `<div class="ob-m ob-m-tal">
       <span class="ob-m-mk">${obBlob()}</span>
       <div class="ob-m-t">${
         m.q ? obChatQ(m.q) : m.done ? obChatDone() : m.html}</div>
     </div>`;


function obAsk(i){
  S.obQi = i;
  S.thread.push({who:'tal', q:i});
}

const OB_LEAVE = 220;
let obTimer = null;
function obSay(fn){
  clearTimeout(obTimer);
  S.typing = true;
  render();
  obTimer = setTimeout(() => {
    obTimer = null;
    S.typing = false;
    if(S.stage !== 'onboard' || !S.obChatOpen) return;
    fn();
    render();
  }, TAL_BEAT);
}

function obAnswer(k, v){
  if(k === 'band' && S.ob.band !== v) S.ob.why = null;
  S.ob[k] = v;
  const s = OB_Q.find(x => x.k === k);
  const hit = obOpts(s).find(o => o[0] === v);
  S.thread.push({who:'me', html: hit ? hit[1] : v});
  const next = S.obQi + 1;
  S.obQi = 0;
  obSay(() => {
    if(next > OB_N){ S.obQi = OB_N + 1; S.thread.push({who:'tal', done:true}); }
    else obAsk(next);
  });
}

const obChatQ = (i) => {
  const s = OB_Q[i - 1];
  if(i !== S.obQi)
    return `<p class="ob-q-tal">${s.tal}</p><p class="ob-q-ask">${obTitle(s)}</p>`;
  return `<p class="ob-q-tal">${s.tal}</p>
  <div class="ob-qp">
    <div class="ob-qp-h">
      <p class="ob-qp-t">${obTitle(s)}</p>
      <span class="ob-qp-n">${i} of ${OB_N}</span>
    </div>
    ${obOpts(s).map(([k,l,d], n) => `<button class="ob-qp-o" data-obans="${s.k}:${k}">
      <span class="ob-qp-i">${n + 1}</span>
      <span class="ob-qp-b"><span class="ob-qp-l">${l}</span>${
        d ? `<span class="ob-qp-d">${d}</span>` : ''}</span>
    </button>`).join('')}
  </div>`;
};


const OB_JRN = [
  ['done', 'You have taken it. Explorer track.'],
  ['on',   'You are here. 45 minutes with a talent agent, and it is what sets your level.'],
  ['',     'Locks in your cohort and your price.'],
  ['',     '13 chapters, one a week.']
];

const OB_JRN_IC = {done:'checkFilled', on:'hourglass'};
const obJourney = () => {
  const now = OB_JRN.findIndex(([st]) => st === 'on') + 1;
  return `<div class="ob-qp ob-plan">
    <div class="ob-qp-h">
      <p class="ob-qp-t">Your journey</p>
      <span class="ob-qp-n">Step ${now} of ${OB_JRN.length}</span>
    </div>
    ${OB_JRN.map(([st,d], n) => `<div class="ob-qp-r${st ? ' ' + st : ''}">
      <span class="ob-jr-ic">${I[OB_JRN_IC[st] || 'time']}</span>
      <span class="ob-qp-b"><span class="ob-qp-l">${JRN_AI[n]}</span><span class="ob-qp-d">${d}</span></span>
    </div>`).join('')}
  </div>`;
};

const obChatDone = () => `
  <p>That is everything I needed. I have enough now to understand what you are after and where it is getting stuck.</p>
  <p>From here it is the platform's turn, and you are already on step two.</p>
  ${obJourney()}
  <div class="ob-opts"><button class="ob-opt ob-opt-go" data-obdone="1">Find an Agent</button></div>`;

const obChatScreen = () => `
  <div class="ob-stage ob-stage-chat">
    ${''/* THE SMALL ORB CARRIES NO BARS (Maryam, 3 Sep 2026: "remove the voice
          icon from the blob"). It is right on the voice screen, where the orb
          IS the speaking thing and the clip is playing; in chat Tal is writing
          rather than talking, so an indicator of speech over a silent mark is
          a control reporting a state the screen is not in. `obBarsEl` is not
          called here — the class is simply absent, which is cheaper than
          hiding it and means the `em` base has nothing to resolve. */}
    <div class="ob-chat-head">
      ${''/* THE WELCOME ORB IS THE `borb` COMPONENT (Maryam, 18 Sep 2026), the
            same orb the chat hero and the voice intro use, not the older
            `obBlob()` video. `live` so it breathes like a hero mark; §133 sizes
            it into the `.ob-orb-sm` slot. */}
      <div class="ob-orb ob-orb-sm">${borbMark('tal-mk', true)}</div>
      <div class="ob-chat-lede">${OB_CHAT.map(t => `<p>${t}</p>`).join('')}</div>
      ${''/* IT IS `.ob-go`, THE SAME ELEMENT THE VOICE SCREEN DRAWS — not a
            restyled button. "Same font size same color same formatting" is
            satisfied by emitting the same class rather than by copying three
            declarations onto a `.btn-p`, which is how two controls come to
            drift apart. §44 types it and §107 gives it the accent underline;
            both apply here with nothing stated.

            IT SITS AT THE END OF THE DESCRIPTION, which is where the
            instruction puts it and is also §29.10's rule — the control is on
            the thing it acts on. The dock's middle slot holds the disabled
            field in this mode, not this. */}
      <div class="ob-chat-act"><span class="ob-go" data-obstart="1" role="button" tabindex="0">Let&rsquo;s Get Started!</span></div>
    </div>
  </div>`;

const obThread = () => `
  <div class="ob-dock-thread">
    ${''/* THE TYPING TURN CARRIES `.ob-m-typing`, AND IT IS A CLASS RATHER THAN
          A `:has()` BECAUSE OF WHAT IT IS FOR. Every other Tal turn is a block
          of text whose first line sits against the top of the 28px mark, which
          is why `.ob-m-tal` is `align-items:flex-start`; this one is a 6px row
          and top-aligning it puts the dots against the mark's crown instead of
          its middle (Maryam, 4 Sep 2026). §107 gives the cell the mark's own
          height and centres in it — one rule, keyed on the one turn that is
          not prose. */}
    <div class="ob-msgs">${S.thread.map(obChatMsg).join('')}${
      S.typing ? `<div class="ob-m ob-m-tal ob-m-typing"><span class="ob-m-mk">${obBlob()}</span><div class="ob-m-t"><div class="ai-stream"><i></i><i></i><i></i></div></div></div>` : ''}</div>
  </div>`;

const obCompose = () => {
  const off = !S.obChatOpen;
  const tap = S.obQi >= 1 && S.obQi <= OB_N;
  return `
  <div class="ob-compose${off ? ' off' : ''}">
    <input class="ob-in" id="obIn"${off ? ' disabled' : ''}
      placeholder="${off ? 'Press Let&rsquo;s Get Started to begin'
        : tap ? 'Choose an option, or type anything' : 'Reply to Tal'}"
      aria-label="Reply to Tal">
    <button class="ob-send" data-obsend="1"${off ? ' disabled' : ''}
      aria-label="Send">${I.send}</button>
  </div>`;
};



function obSurveyScreen(){
  const s = OB_Q[S.obStep - 1];
  const to = Math.round((S.obStep - 1) / OB_N * 100);
  const from = S.obBarFrom || 0;
  S.obBarFrom = to;
  const prev = S.obStep > 1
    ? `<button class="btn btn-t noic ob-sv-prev" data-obgo="${S.obStep - 1}">${I.arrowLeft} Previous</button>`
    : '';
  const next = `<button class="btn btn-p noic ob-sv-next" data-obgo="${S.obStep + 1}"${
    obReady() ? '' : ' disabled'}>Next ${I.arrowRight}</button>`;
  return `<div class="ob-survey">
    <div class="ob-sv-top"><i style="--ob-from:${from}%;--ob-to:${to}%"></i></div>
    ${''/* THE BRAND ROW (Maryam, 18 Sep 2026): the wordmark top-left and
          "You're almost there!" top-right, aligned on one row under the bar. */}
    <div class="ob-sv-head">
      <span class="ob-logo"><img src="${LOGO_K}" alt="TalentNext"></span>
      <span class="ob-sv-hint">You&rsquo;re almost there!</span>
    </div>
    <main class="main"><div class="ob-sv-wrap">
      ${''/* THE QUESTION IS THE HEADING (Maryam, 18 Sep 2026: "i want the
            questions to be a heading and forget about a description") — no theme
            title, no sub-line. */}
      <div class="ob-sv-orb">${borbMark('tal-mk', true)}</div>
      <h1 class="ob-sv-title">${obTitle(s)}</h1>
      <div class="ob-sv-opts${s.t === 'text' || s.t === 'dd' ? ' ob-sv-opts-field' : ''}">
        ${s.t === 'text'
          ? `<input class="inp ob-sv-text" type="text" data-obtext="${s.k}"
               value="${obAttr(S.ob[s.k])}" placeholder="${s.ph || ''}"
               aria-label="${obTitle(s)}">`
          : s.t === 'dd'
            ? `${dd('ob-' + s.k, obOpts(s).map(o => o[1]), S.ddVal['ob-' + s.k])}${
                (S.ddVal['ob-' + s.k] || obOpts(s)[0][1]) === 'Other'
                  ? `<input class="inp ob-sv-text ob-sv-other" type="text" data-obtext="${s.k}Other"
                       value="${obAttr(S.ob[s.k + 'Other'])}" placeholder="${s.ph || ''}"
                       aria-label="Your industry">`
                  : ''}`
            : obOpts(s).map(([k,l]) => {
                const on = S.ob[s.k] === k;
                return `<label class="ob-sv-o${on ? ' on' : ''}" data-ob="${s.k}" data-obv="${k}">
                  <input type="radio" name="ob-${s.k}"${on ? ' checked' : ''}>
                  <span class="ob-sv-rad" aria-hidden="true"></span>
                  <span class="ob-sv-ot"><span class="ob-sv-ol">${l}</span></span>
                </label>`;
              }).join('')}
      </div>
      <div class="ob-sv-foot">${prev}${next}</div>
    </div></main>
  </div>`;
}




const OB_PICK = {coaching:'priya', delegation:'lena', other:'owen'};
const obAgent = () => OB_PICK[S.ob.band] || REC_ORDER[0];

const obLabel = (k) => {
  const s = OB_Q.find(x => x.k === k);
  const hit = obOpts(s).find(o => o[0] === S.ob[k]);
  return hit ? hit[1] : '&mdash;';
};

function obDoneScreen(){
  const from = S.obBarFrom || 100;
  S.obBarFrom = 100;
  return `<div class="ob-survey ob-done">
    <div class="ob-sv-top"><i style="--ob-from:${from}%;--ob-to:100%"></i></div>
    ${''/* THE WORDMARK ROW (Maryam, 28 Sep 2026: "show the logo on this screen as
          well, keep things consistent"). Same `.ob-sv-head` the survey steps carry
          — logo top-left — but NO "You're almost there!" hint: the journey is done
          on this screen, so that copy would contradict "You're all set". The row is
          `space-between`, so a lone logo sits left as it should. */}
    <div class="ob-sv-head">
      <span class="ob-logo"><img src="${LOGO_K}" alt="TalentNext"></span>
    </div>
    <main class="main"><div class="ob-sv-wrap">
      <div class="ob-sv-orb">${borbMark('tal-mk', true)}</div>
      <h1 class="ob-sv-title">You&rsquo;re all set</h1>
      <p class="ob-sv-q">That is everything I needed. Here is where you are, and what comes next.</p>
      ${obJourney()}
      <div class="ob-sv-foot">
        <button class="btn btn-p noic ob-sv-next" data-obdone="1">Find an Agent ${I.arrowRight}</button>
      </div>
    </div></main>
  </div>`;
}

const OB_FIT = {
  priya:'assesses for judgement under pressure rather than vocabulary, and will tell you plainly where you are',
  owen:'looks for how you decide when the information is incomplete, which is most of the time',
  lena:'came up through engineering management, and expects a lot of &ldquo;and then what happened&rdquo;'
};

function obFit(){
  const k = obAgent();
  return `You said &ldquo;<b>${obLabel('why')}</b>&rdquo;, and ${
    AGENTS[k].n} ${OB_FIT[k]}.`;
}

function obLoaderScreen(){
  return `<div class="ob-survey ob-loading">
    <main class="main">
      <div class="tn-loader" role="status" aria-label="Loading">
        <span class="tn-loader__blade tn-loader__blade--a"></span>
        <span class="tn-loader__blade tn-loader__blade--b"></span>
        <span class="tn-loader__blade tn-loader__blade--c"></span>
      </div>
    </main>
  </div>`;
}

function obScreen(){
  const step = S.obStep;
  if(S.obLoading) return obLoaderScreen();

  if(step === 0){
    const chat = S.obMode === 'chat';
    const live = chat && S.obChatOpen;
    const mid = chat ? obCompose()
      : `<span class="ob-go" data-obstart="1" role="button" tabindex="0">Let&rsquo;s Get Started!</span>`;
    const welcome = chat && !live;
    return `<div class="ob-open${chat ? ' ob-open-chat' : ''}${live ? ' ob-open-live' : ''}">${
      obHead()}${
      live ? obProgress() : ''}${
      live ? '' : chat ? obChatScreen() : obIntro()}${
      welcome ? '' : obDock(mid, live ? obThread() : '')}</div>`;
  }

  if(step >= 1 && step <= OB_N) return obSurveyScreen();
  return obDoneScreen();
}


device.addEventListener('click', e => {
  if(S.stage !== 'onboard') return;
  const t = e.target;

  const md = t.closest('[data-obmode]');
  if(md){
    e.preventDefault(); e.stopPropagation();
    if(md.dataset.obmode === 'chat') obChat();
    else if(S.obMode === 'chat'){ S.obMode = 'voice'; S.obSpoken = false; render(); }
    else obReplay();
    return;
  }

  const mu = t.closest('[data-obmute]');
  if(mu){
    e.preventDefault(); e.stopPropagation();
    if(!obAud) obPlay();
    if(obAud) obAud.muted = !obAud.muted;
    render(); return;
  }


  const o = t.closest('[data-ob]');
  if(o){
    const k = o.dataset.ob;
    if(k === 'band' && S.ob.band !== o.dataset.obv) S.ob.why = null;
    S.ob[k] = o.dataset.obv;
    e.preventDefault(); e.stopPropagation();
    render(); return;
  }

  const st = t.closest('[data-obstart]');
  if(st){
    e.preventDefault(); e.stopPropagation();
    obHush();
    const stage = device.querySelector('.ob-stage');
    const load = () => {
      S.obLoading = true; render();
      setTimeout(() => { S.obLoading = false; S.obStep = 1; render(); }, 2000);
    };
    if(stage){ stage.classList.add('ob-leave'); setTimeout(load, OB_LEAVE); }
    else load();
    return;
  }

  const an = t.closest('[data-obans]');
  if(an){
    e.preventDefault(); e.stopPropagation();
    const [k, v] = an.dataset.obans.split(':');
    obAnswer(k, v);
    render(); return;
  }

  const sd = t.closest('[data-obsend]');
  if(sd && !sd.disabled){
    e.preventDefault(); e.stopPropagation();
    obSend();
    return;
  }

  const g = t.closest('[data-obgo]');
  if(g && !g.disabled){
    const n = Math.max(0, Math.min(obLast(), +g.dataset.obgo));
    if(n > S.obStep && !obReady()){ e.preventDefault(); e.stopPropagation(); return; }
    S.obStep = n;
    e.preventDefault(); e.stopPropagation();
    render(); return;
  }

  const d = t.closest('[data-obdone]');
  if(d){
    S.recKey = obAgent();
    if(S.ob.role)  PF.general.role  = S.ob.role;
    if(S.ob.years) PF.general.years = obLabel('years');
    const ind = S.ddVal['ob-industry'];
    if(ind === 'Other'){ if(S.ob.industryOther) PF.general.industry = S.ob.industryOther; }
    else if(ind)       PF.general.industry = ind;
    e.preventDefault(); e.stopPropagation();
    S.obLoading = true; render();
    setTimeout(() => {
      S.obLoading = false;
      talReset(); S.askOpen = false; S.tal = false;
      setStage('new'); render();
    }, 2000);
    return;
  }
}, true);

function obSend(){
  const el = device.querySelector('#obIn');
  const q = el ? el.value.trim() : '';
  if(el) el.value = '';
  if(q) ask(q);
}

device.addEventListener('input', e => {
  if(S.stage !== 'onboard') return;
  const el = e.target.closest('[data-obtext]');
  if(!el) return;
  S.ob[el.dataset.obtext] = el.value;
  const next = device.querySelector('.ob-sv-next[data-obgo]');
  if(next) next.disabled = !obReady();
});

device.addEventListener('keydown', e => {
  const enter = e.key === 'Enter' || e.key === 'Return' || e.keyCode === 13;
  if(!enter || !e.target.closest || !e.target.closest('#obIn')) return;
  e.preventDefault();
  if(!e.target.disabled) obSend();
});

const _baseOb = render;
render = function(){
  _baseOb.apply(null, arguments);
  try {
    if(S.stage === 'onboard' && S.obStep === 0 && S.obMode !== 'chat') obSpeak();
    else obHush();
  } catch(e){ console.warn('ob speech', e); }
};

S.obReady = true;
render();
