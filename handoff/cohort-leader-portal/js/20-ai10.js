S.call = null;

const CALL_MS = 42000;

let callTimer = null;

const CALL_AWAY = 'Not active recently';
const callHere  = () => COHORT.filter(m => m[3] !== CALL_AWAY);
const callMe    = () => COHORT.find(m => m[4]) || COHORT[0];

const CALL_FACE = {'Daniel Kerr': CALL_ART.faceM, 'Nora Lindqvist': CALL_ART.faceW};
const callFaceOf = (m) => CALL_FACE[m[0]] || AV[m[2]];

const CALL = {
  iv:  (f) => callIv(f, false),
  re:  (f) => callIv(f, true),
  cohort: (f) => {
    const me = callMe(), here = callHere();
    const chapter = (CH[Math.min(CH.length - 1, Math.max(0, f.week - 1))] || CH[0])[0];
    return {
      rec:    false,
      title:  `Cohort 41 &middot; week ${f.week} call`,
      sub:    `Led by Priya Nair &middot; 60 minutes &middot; ${here.length} of ${COHORT.length} here`,
      mins:   60,
      feed:   {img:CALL_ART.feed, name:'Priya Nair', role:'host'},
      people: [me].concat(here.filter(m => !m[4])),
      count:  here.length,
      panel:  'people',
      leave:  'Leave call',
      details: [
        ['This call', [
          ['Platform',  'Video call'],
          ['Room',      `cohort-41-w${f.week}`],
          ['Week',      `${f.week} of 13`],
          ['Attending', `${here.length} of ${COHORT.length}`],
          ['Recording', 'Off &middot; cohort calls are not recorded'],
          ['Notes',     'Priya posts them to the board']
        ], 'Nothing said on this call reaches an employer, and no part of it is kept as video.'],
        ['What Priya already has', null,
          'Your chapter scores and how many attempts each one took. Nobody else on this call sees any of it.']
      ],
      phase: [
        'Connecting&hellip;',
        `Priya opens week ${f.week} &mdash; ${chapter}`,
        'Two members walk through their week',
        'Working in pairs on the chapter task',
        `Questions, and what week ${f.week + 1} asks for`,
        'Call ended. Priya is writing up the notes for the board.'
      ]
    };
  }
};

function callIv(f, re){
  const a = bkAgent(), me = callMe();
  return {
    rec:    true,
    title:  `${re ? 'Re-interview' : 'Level interview'} &middot; ${a.n}`,
    sub:    `${who(f)} &middot; 45 minutes, recorded`,
    mins:   45,
    feed:   {img:CALL_ART.feed, name:a.n},
    self:   {img:AV[me[2]], name:me[0]},
    people: null,
    count:  2,
    panel:  null,
    leave:  'End session',
    details: [
      ['Session details', [
        ['Platform',   'Video call'],
        ['Meeting ID', 'TN&nbsp;482&nbsp;119&nbsp;603'],
        ['Passcode',   '4 8 2 1 1 9'],
        ['Dial-in',    `+44 20 7946 0${400 + (a.ivs % 99)}`],
        ['Recording',  'On, both sides'],
        ['Transcript', 'Generating live'],
        ['Scheduled',  bkShort()]
      ], 'The recording and transcript are what your report is built from. Nothing here is shared with an employer.'],
      re
        ? ['Bring what changed', null, 'One thing you do differently since the last report, and the situation that changed it. The 90 days are the evidence. This is you saying what they did.']
        : ['Bring one example',  null, 'A real leadership situation from the last three months. That single story moves your level more than anything else in the conversation.']
    ],
    phase: [
      'Connecting&hellip;',
      `${a.n.split(' ')[0]} asks what you have been leading lately`,
      'Working through one real situation, end to end',
      re ? 'Probing what the 90 days actually changed' : 'Probing delegation, and a decision you regret',
      'Wrapping up &mdash; what happens next and when',
      `Session complete. The recording and transcript are with ${a.n.split(' ')[0]}.`
    ]
  };
}

const callFrac = () => S.call ? Math.min(1, (Date.now() - S.call.t0) / CALL_MS) : 0;

const callClockText = (spec, frac) => {
  const secs = Math.round(frac * spec.mins * 60);
  return String(Math.floor(secs / 60)).padStart(2,'0') + ':' + String(secs % 60).padStart(2,'0');
};
const callPhaseIx = (spec, frac) => {
  const n = spec.phase.length;
  return frac >= 1 ? n - 1 : Math.min(n - 2, Math.floor(frac * (n - 1)));
};
const callPhaseText = (spec, frac) => spec.phase[callPhaseIx(spec, frac)];

function callSpeaker(spec, frac){
  if(!spec.people || spec.people.length < 2) return -1;
  const ix = callPhaseIx(spec, frac);
  if(ix === 0 || ix === spec.phase.length - 1) return -1;
  return 1 + ((ix - 1) % (spec.people.length - 1));
}

function callTick(){
  if(!S.call) return callStop();
  const spec = S.call.spec, frac = callFrac();
  const clock = device.querySelector('.call-clock');
  const cap   = device.querySelector('.call-cap');
  const tiles = device.querySelectorAll('.call-p');
  if(!clock && !tiles.length) return callStop();
  if(clock) clock.textContent = callClockText(spec, frac);
  if(cap)   cap.innerHTML     = callPhaseText(spec, frac);
  if(tiles.length){
    const sp = callSpeaker(spec, frac);
    tiles.forEach((el,i) => el.classList.toggle('on', i === sp));
  }
  if(frac >= 1) return callStop();
}
function callStop(){
  if(callTimer){ clearInterval(callTimer); callTimer = null; }
}

function callOpen(kind){
  const make = CALL[kind];
  if(!make) return;
  const spec = make(cfg(S.stage));
  S.call = {kind, t0:Date.now(), spec,
    mic:true, cam:true, share:false, hand:false, cc:true, panel:spec.panel};
  S.nav = false; S.notif = false; S.acct = false; S.tal = false;
  callStop();
  callTimer = setInterval(callTick, 500);
  render();
}
function callLeave(){
  const kind = S.call && S.call.kind;
  callStop();
  S.call = null;
  if(kind === 'iv' && isBooked(S.stage)){ setStage('held'); return; }
  render();
}

const _callStage = setStage;
setStage = function(k, keepView){ callStop(); S.call = null; return _callStage(k, keepView); };
const _callGo = go;
go = function(target, fresh){ callStop(); S.call = null; return _callGo(target, fresh); };

function callSelf(c, spec){
  const marks = (c.mic ? '' : I.micOff) + (c.hand ? I.raiseHand : '');
  const body = `${marks ? `<span class="call-selfmk">${marks}</span>` : ''}
    <span class="call-selfn">${spec.self.name} (you)</span>`;
  return c.cam
    ? `<div class="call-self" style="background-image:url(${spec.self.img})">${body}</div>`
    : `<div class="call-self"><span class="call-selfav"><img src="${spec.self.img}" alt=""></span>${body}</div>`;
}

function callPerson(c, m, i, speaking){
  const mine = i === 0;
  const marks = mine
    ? (!c.mic ? I.micOff : '') + (!c.cam ? I.videoOff : '') + (c.hand ? I.raiseHand : '')
    : `<i class="call-p-mic">${I.micOff}</i>`;
  return `<div class="call-p${speaking ? ' on' : ''}${mine ? ' me' : ''}">
    ${marks ? `<span class="call-p-mk">${marks}</span>` : ''}
    <span class="call-p-av"><img src="${callFaceOf(m)}" alt=""></span>
    <span class="call-p-n">${m[0]}${mine ? ' <em>(you)</em>' : ''}</span>
  </div>`;
}

function callColumn(c, spec, frac){
  if(c.panel === 'people' && spec.people){
    const sp = callSpeaker(spec, frac);
    return `<aside class="call-col" aria-label="In this call">
      <div class="call-people">
        ${spec.people.map((m,i) => callPerson(c, m, i, i === sp)).join('')}
      </div></aside>`;
  }
  if(c.panel === 'details'){
    return `<aside class="call-col" aria-label="Session details">
      ${spec.details.map(([head, rows, legal]) => `<div class="call-panel">
        <span class="eyebrow">${head}</span>
        ${rows ? rows.map(([k,v]) =>
          `<div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('') : ''}
        ${legal ? `<p class="${rows ? 't-legal-01 call-legal' : 't-body-02'}">${legal}</p>` : ''}
      </div>`).join('')}</aside>`;
  }
  return '';
}

const callCtl = (key, ic, label, state) =>
  `<button class="call-ctl${state ? ' ' + state : ''}" data-callctl="${key}"
    aria-label="${label}" title="${label}"${state ? ' aria-pressed="true"' : ''}>${ic}</button>`;

function callScreen(){
  const c = S.call, spec = c.spec, frac = callFrac();
  return `<div class="call" data-callkind="${c.kind}" role="region"
    aria-label="${spec.people ? 'Cohort call' : 'Interview'} in progress">
  <div class="call-bar">
    ${spec.rec ? `<span class="call-rec"><i></i>Rec</span>` : ''}
    <span class="call-id">
      <span class="call-ttl">${spec.title}</span>
      <span class="call-sub">${spec.sub}</span>
    </span>
    <span class="call-clock">${callClockText(spec, frac)}</span>
  </div>
  <div class="call-body">
    <div class="call-main" style="background-image:url(${spec.feed.img})">
      ${c.share ? `<span class="call-flag">${I.screenShare}You are sharing your screen</span>` : ''}
      <div class="call-said">
        ${c.cc ? `<span class="call-cap">${callPhaseText(spec, frac)}</span>` : ''}
        <span class="call-nm">${spec.feed.name}${spec.feed.role ? ` <em>&middot; ${spec.feed.role}</em>` : ''}</span>
      </div>
      ${spec.self ? callSelf(c, spec) : ''}
    </div>
    ${callColumn(c, spec, frac)}
    <div class="call-foot">
      ${callCtl('mic',   c.mic ? I.microphone : I.micOff, c.mic ? 'Mute' : 'Unmute', c.mic ? '' : 'off')}
      ${callCtl('cam',   c.cam ? I.video : I.videoOff,
                c.cam ? 'Turn the camera off' : 'Turn the camera on', c.cam ? '' : 'off')}
      ${callCtl('share', I.screenShare, c.share ? 'Stop sharing your screen' : 'Share your screen',
                c.share ? 'on' : '')}
      ${callCtl('hand',  I.raiseHand, c.hand ? 'Lower your hand' : 'Raise your hand', c.hand ? 'on' : '')}
      ${callCtl('cc',    I.captions, c.cc ? 'Turn captions off' : 'Turn captions on', c.cc ? 'on' : '')}
      ${spec.people ? callCtl('people', I.group, `Who is here — ${spec.count} of ${COHORT.length}`,
                c.panel === 'people' ? 'on' : '') : ''}
      ${callCtl('details', I.overflow, c.panel === 'details' ? 'Close the session details' : 'Session details',
                c.panel === 'details' ? 'on' : '')}
      <button class="call-leave" data-callend="1">${I.callEnd}<span>${spec.leave}</span></button>
    </div>
  </div>
</div>`;
}

device.addEventListener('click', e => {
  const open = e.target.closest('[data-call]');
  if(open){ callOpen(open.dataset.call); return; }
  if(e.target.closest('[data-callend]')){ callLeave(); return; }
  const ctl = e.target.closest('[data-callctl]');
  if(!ctl || !S.call) return;
  const k = ctl.dataset.callctl;
  if(k === 'people' || k === 'details') S.call.panel = S.call.panel === k ? null : k;
  else S.call[k] = !S.call[k];
  render();
});

render();
