/* ==========================================================================
   AI10 — THE LIVE CALL

   Join did nothing. Every appointment in the product ends in a black card
   with a face on it and a primary button that said `Join`, and pressing it
   was the one control on the candidate's side of the portal with no
   destination — which is the worst place in a prototype to run out of
   product, because it is the moment the whole thing is FOR.

   So there is a call now, and it is a surface rather than a page: `render()`
   draws it INSTEAD OF the shell and the view, the same way it draws the
   run-up and the auth screens. §60 carries the argument for that and the
   drawing; this file is the state, the copy and the clock.

   THREE KINDS, TWO SHAPES. `iv` and `re` are one person opposite you — a
   level interview and a re-interview differ only in what the aside says to
   have ready — and `cohort` is the weekly call: a host, the nine others in a
   row beneath the feed, and no transcript. A fourth kind is one entry in
   `CALL` plus a `data-call` on a button.

   WHAT IT DOES NOT DO. It does not move the stage. Ending a session returns
   you to the page you pressed Join on, and the prototype's stage picker is
   still what walks the journey — an interview that levelled you the moment
   you left the call would take the assessment, the report and the 48 hours
   the product describes and throw them away. The end of the call says the
   recording is with your agent, which is true and is where the wait starts.

   AND IT IS NOT IN THE HASH. The chrome writes `#<stage>/<view>` on every
   paint so a screen can be sent to somebody (the note at the foot of
   build.py's template is the long version), and a live call is the one thing
   here that is not a screen you can send: it is a moment with a clock
   running. Reloading into it would start the clock again at 00:00 on an
   interview that had already finished, so the hash keeps naming the page
   underneath and the call is what you are doing on top of it.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. STATE

   `S.call` is null or the whole call: which kind, when it started, and the
   three things the footer can toggle. It is deliberately NOT split across
   several flags — the call is one object that exists or does not, and every
   surface that reads it reads it whole.

   THE CONTROLS ARE STATE AND NOT CLASSES, which is trap 9. `render()`
   replaces `device.innerHTML`, so a class a click handler puts on the mute
   button is gone the next time anything repaints; the microphone being off
   is a fact about the call, so it lives with the call and the button is a
   pure function of it.
   -------------------------------------------------------------------------- */
S.call = null;

/* THE WHOLE SESSION, COMPRESSED. A prototype cannot ask its reader to sit
   through forty-five minutes to see the end of the arc, so the clock runs the
   full length of the session over this many milliseconds and the caption
   moves with it. The number is a BUDGET for the whole call rather than a
   rate, which is the same choice `SUM_MS` makes in ai6.js and for the same
   reason: a 45-minute interview and a 60-minute cohort call then take the
   same time to watch. */
const CALL_MS = 42000;

/* PACED WITH `setTimeout`, DERIVED FROM ELAPSED TIME — trap 17. This
   prototype is usually read in a pane that reports itself hidden, where
   `requestAnimationFrame` never fires at all: an rAF loop would run its first
   synchronous call and then stop forever, leaving the clock at 00:00 and the
   caption on "Connecting…" in every tab that was not at the front. A timer
   that reads `Date.now()` simply arrives late with more work to do. */
let callTimer = null;

/* --------------------------------------------------------------------------
   2. WHO IS IN THE ROOM

   THE ATTENDANCE IS DERIVED, NOT WRITTEN. `COHORT` (views.js) is the ten
   members of Cohort 41 and carries a last-active line for each; the one
   member who has not been seen recently is the one empty seat. So "9 of 10
   here", the row of faces and the aside's Attending row are three readings of
   one list and cannot disagree with each other — or with the Cohort page,
   which draws the same ten rows from the same array.

   `COHORT` rows are `[name, initials, avatar, status, mine]`.
   -------------------------------------------------------------------------- */
const CALL_AWAY = 'Not active recently';
const callHere  = () => COHORT.filter(m => m[3] !== CALL_AWAY);
const callMe    = () => COHORT.find(m => m[4]) || COHORT[0];
const callOthers= () => callHere().filter(m => !m[4]);

/* HOW MANY FACES THE STRIP NAMES BEFORE IT STARTS COUNTING. Six, which is the
   wireframe's own arrangement and is the better of the two once the tiles are
   measured: all eight of Cohort 41's other attendees do fit in the desktop
   column, at 111px wide and 62px tall, which is a letterbox slit with a name
   chip over a third of it. Six plus a `+2` cell is seven tiles, half a step
   larger each, and the count says exactly what the two missing faces are.

   THE OVERFLOW CELL IS THEREFORE NORMAL RATHER THAN AN EDGE CASE, which is
   worth knowing before changing this number: `+2` on Cohort 41 is the shape
   the row is designed around, not a cohort that has outgrown it. */
const CALL_FACES = 6;

/* --------------------------------------------------------------------------
   3. THE THREE KINDS

   Each entry answers the same eight questions, and every figure in them is
   read off something else rather than restated here: the agent and the slot
   come from `bkAgent()` / `bkShort()` in ai7.js, so a call opened after Tal
   has booked somebody names the person you actually booked; the week and the
   chapter come from `cfg()` and `CH`; the cohort's size comes from `COHORT`.
   Nothing in this file is the only place a number is written down.

   THE COHORT CALL IS NOT RECORDED, AND THAT IS THE ONE PLACE THIS SURFACE
   DISAGREES WITH THE WIREFRAME. The wireframe's cohort screen has a REC pill
   on the bar and "Recording · On, kept 90 days" in the aside. The product's
   own Data use notice — `V.account`, and it is the page a candidate is sent
   to when they ask — says in as many words: "Every interview and re-interview
   is recorded as video and audio... Your weekly cohort calls are not
   recorded." A bar that says REC over that sentence makes one of the two a
   lie, and the one that has to give is the one the reader cannot check. So
   the cohort call carries no recording mark and its aside says so; the
   interview carries both, because there the notice and the wireframe agree.
   -------------------------------------------------------------------------- */
const CALL = {
  iv:  (f) => callIv(f, false),
  re:  (f) => callIv(f, true),
  cohort: (f) => {
    const me = callMe(), others = callOthers(), here = callHere().length;
    const chapter = (CH[Math.min(CH.length - 1, Math.max(0, f.week - 1))] || CH[0])[0];
    return {
      rec:   false,
      title: `Cohort 41 &middot; week ${f.week} call`,
      sub:   `Led by Priya Nair &middot; 60 minutes &middot; ${here} of ${COHORT.length} here`,
      mins:  60,
      main:  {img:AV.priya, name:'Priya Nair', role:'host'},
      self:  {img:AV[me[2]], name:me[0]},
      strip: others,
      count: here,
      leave: 'Leave call',
      /* THE ROOM NAME IS THE COHORT AND THE WEEK, which is the only thing on
         this panel a person might read out loud. */
      panel: [
        ['This call', [
          ['Platform',  'Video call'],
          ['Room',      `cohort-41-w${f.week}`],
          ['Week',      `${f.week} of 13`],
          ['Attending', `${here} of ${COHORT.length}`],
          ['Recording', 'Off &middot; cohort calls are not recorded'],
          ['Notes',     'Priya posts them to the board']
        ], 'Nothing said on this call reaches an employer, and no part of it is kept as video.']
      ],
      /* WHAT THE LEADER CAN SEE, because it is the question a person has on a
         call with the ten people they are being compared with, and the answer
         is in the leader's own portal: `V.leadCohort`'s roster is progress,
         assessment average and attempts, per member, visible to Priya and to
         nobody else. */
      brief: ['What Priya already has',
        `Your chapter scores and how many attempts each one took. Nobody else on this call sees any of it.`],
      phase: [
        'Connecting&hellip;',
        `Priya opens week ${f.week} &mdash; ${chapter}`,
        'Two members walk through their week',
        'Working in pairs on the chapter task',
        'Questions, and what week ' + (f.week + 1) + ' asks for',
        'Call ended. Priya is writing up the notes for the board.'
      ]
    };
  }
};

/* THE INTERVIEW AND THE RE-INTERVIEW ARE ONE FUNCTION, because they are one
   appointment at two points in the ladder: same agent, same forty-five
   minutes, same recording, and the difference is entirely in what you are
   being assessed against. Two entries in `CALL` would have been the same
   twenty lines twice with three sentences changed. */
function callIv(f, re){
  const a = bkAgent();
  const me = callMe();
  return {
    rec:   true,
    title: `${re ? 'Re-interview' : 'Level interview'} &middot; ${a.n}`,
    sub:   `${who(f)} &middot; 45 minutes, recorded`,
    mins:  45,
    main:  {img:a.img, name:a.n},
    self:  {img:AV[me[2]], name:me[0]},
    strip: null,
    count: 2,
    leave: 'End session',
    panel: [
      ['Session details', [
        ['Platform',   'Video call'],
        ['Meeting ID', 'TN&nbsp;482&nbsp;119&nbsp;603'],
        ['Passcode',   '4 8 2 1 1 9'],
        /* the dial-in is the agent's own line, so it moves when the agent
           does rather than being a number that belongs to nobody */
        ['Dial-in',    `+44 20 7946 0${400 + (a.ivs % 99)}`],
        ['Recording',  'On, both sides'],
        ['Transcript', 'Generating live'],
        ['Scheduled',  bkShort()]
      ], 'The recording and transcript are what your report is built from. Nothing here is shared with an employer.']
    ],
    brief: re
      ? ['Bring what changed', 'One thing you do differently since the last report, and the situation that changed it. The 90 days are the evidence &mdash; this is you saying what they did.']
      : ['Bring one example',  'A real leadership situation from the last three months. That single story moves your level more than anything else in the conversation.'],
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

/* --------------------------------------------------------------------------
   4. THE CLOCK

   Both readings come out of ONE number — how long the call has been open —
   so the caption and the clock can never be describing different moments.
   `frac` is the whole session as 0..1; the clock scales it to the session's
   real length and the caption picks its line off the same fraction.
   -------------------------------------------------------------------------- */
const callFrac = () => {
  if(!S.call) return 0;
  return Math.min(1, (Date.now() - S.call.t0) / CALL_MS);
};
const callClockText = (spec, frac) => {
  const secs = Math.round(frac * spec.mins * 60);
  return String(Math.floor(secs / 60)).padStart(2,'0') + ':' + String(secs % 60).padStart(2,'0');
};
const callPhaseText = (spec, frac) => {
  const n = spec.phase.length;
  /* the last line is the END and is only ever reached at 1, not by rounding
     into the last bucket a moment early */
  if(frac >= 1) return spec.phase[n - 1];
  return spec.phase[Math.min(n - 2, Math.floor(frac * (n - 1)))];
};

/* THE TICK WRITES TWO TEXT NODES AND NOTHING ELSE. It does not re-render:
   a full repaint twice a second would restart every entrance animation on
   the surface and throw away the scroll position of the aside. The two
   elements are found fresh each time — a render between ticks replaces them —
   and their ABSENCE is how the timer learns the call is over, which is the
   one state it cannot be told about. */
function callTick(){
  if(!S.call) return callStop();
  const spec = S.call.spec, frac = callFrac();
  const clock = device.querySelector('.call-clock');
  const cap   = device.querySelector('.call-cap');
  if(!clock && !cap) return callStop();
  if(clock) clock.textContent = callClockText(spec, frac);
  if(cap)   cap.innerHTML     = callPhaseText(spec, frac);
  if(frac >= 1) return callStop();
}
function callStop(){
  if(callTimer){ clearInterval(callTimer); callTimer = null; }
}

/* --------------------------------------------------------------------------
   5. OPENING AND LEAVING
   -------------------------------------------------------------------------- */
function callOpen(kind){
  const make = CALL[kind];
  if(!make) return;
  const f = cfg(S.stage);
  S.call = {kind, t0:Date.now(), mic:true, cam:true, share:false, spec:make(f)};
  /* the rail and any open panel belong to the page underneath; leaving them
     set would put them back over the page the moment the call closes, which
     is not where the reader left them */
  S.nav = false; S.notif = false; S.tal = false;
  callStop();
  callTimer = setInterval(callTick, 500);
  render();
}
function callLeave(){
  callStop();
  S.call = null;
  render();
}

/* A CALL DOES NOT SURVIVE THE JOURNEY MOVING UNDER IT. The stage picker, the
   arrow keys and the boot hash all land in `setStage`, and `go()` is every
   in-product jump; either one means the reader has left the appointment.
   Wrapping both rather than editing them keeps this file the only place the
   call touches the runtime, which is the shape `lead.js` uses for
   `data-portal` and ai5 for `stampView`. */
const _callStage = setStage;
setStage = function(k, keepView){ callStop(); S.call = null; return _callStage(k, keepView); };
const _callGo = go;
go = function(target, fresh){ callStop(); S.call = null; return _callGo(target, fresh); };

/* --------------------------------------------------------------------------
   6. THE SURFACE

   `render()` calls this in place of `shell() + view()`, so everything here is
   inside `.app` and nothing else is. The tiles set their photograph INLINE —
   the picture belongs to the person, not to the stylesheet — which is why §60
   draws every scrim and every gradient as a pseudo-element (trap 1).
   -------------------------------------------------------------------------- */
const callFeed = (cls, p, inner) =>
  `<div class="${cls}" style="background-image:url(${p.img})">`
  + (inner || '')
  + `<span class="call-nm">${p.name}${p.role ? ` <em>&middot; ${p.role}</em>` : ''}</span></div>`;

function callScreen(){
  const c = S.call, spec = c.spec, frac = callFrac();
  const kv = (rows) => rows.map(([k,v]) =>
    `<div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('');
  const faces = spec.strip ? spec.strip.slice(0, CALL_FACES) : [];
  const more  = spec.strip ? spec.strip.length - faces.length : 0;

  return `<div class="call" data-callkind="${c.kind}" role="region" aria-label="${spec.leave === 'Leave call' ? 'Cohort call' : 'Interview'} in progress">
  <div class="call-bar">
    ${spec.rec ? `<span class="call-rec"><i></i>Rec</span>` : ''}
    <span class="call-id">
      <span class="call-ttl">${spec.title}</span>
      <span class="call-sub">${spec.sub}</span>
    </span>
    <span class="call-clock">${callClockText(spec, frac)}</span>
  </div>
  <div class="call-body">
    <div class="call-stage">
      ${callFeed('call-main', spec.main,
        `<span class="call-cap">${callPhaseText(spec, frac)}</span>`
        + callFeed('call-self', {img:spec.self.img, name:spec.self.name + ' (you)'}))}
      ${spec.strip ? `<div class="call-strip">
        ${faces.map(m => callFeed('call-mem', {img:AV[m[2]], name:m[0]})).join('')}
        ${more > 0 ? `<div class="call-more" aria-label="${more} more in the call">+${more}</div>` : ''}
      </div>` : ''}
    </div>
    <aside class="call-side">
      ${spec.panel.map(([head, rows, legal]) => `<div class="call-panel">
        <span class="eyebrow">${head}</span>
        ${kv(rows)}
        ${legal ? `<p class="t-legal-01 call-legal">${legal}</p>` : ''}
      </div>`).join('')}
      <div class="call-panel">
        <span class="eyebrow">${spec.brief[0]}</span>
        <p class="t-body-02">${spec.brief[1]}</p>
      </div>
    </aside>
  </div>
  <div class="call-foot">
    <button class="call-ctl${c.mic ? '' : ' off'}" data-callctl="mic"
      aria-label="${c.mic ? 'Mute' : 'Unmute'}" aria-pressed="${!c.mic}">${I.microphone}<span>${c.mic ? 'Mute' : 'Unmute'}</span></button>
    <button class="call-ctl${c.cam ? '' : ' off'}" data-callctl="cam"
      aria-label="${c.cam ? 'Turn the camera off' : 'Turn the camera on'}" aria-pressed="${!c.cam}">${I.video}<span>Camera</span></button>
    <button class="call-ctl${c.share ? ' off' : ''}" data-callctl="share"
      aria-label="Share your screen" aria-pressed="${c.share}">${I.launch}<span>Share</span></button>
    <span class="call-ctl call-count">${I.group}<span>People &middot; ${spec.count}</span></span>
    <button class="btn btn-p noic call-leave" data-callend="1">${spec.leave}</button>
  </div>
</div>`;
}

/* --------------------------------------------------------------------------
   7. THE ROUTER
   Its own listener rather than four more branches in views.js's: the delegated
   listener there returns rather than stopping propagation, so a second one on
   the same element sees everything it did not claim. Join buttons carry no
   `data-go`, so nothing there matches them today.
   -------------------------------------------------------------------------- */
device.addEventListener('click', e => {
  const open = e.target.closest('[data-call]');
  if(open){ callOpen(open.dataset.call); return; }
  if(e.target.closest('[data-callend]')){ callLeave(); return; }
  const ctl = e.target.closest('[data-callctl]');
  if(ctl && S.call){
    const k = ctl.dataset.callctl;
    S.call[k] = !S.call[k];
    render();
  }
});

/* THE LAST STATEMENT, for the reason ai5.js records and CLAUDE.md's trap 8
   states: the boot render is the final line of views.js and has already run
   by the time this file is parsed, so every pass re-renders at its own foot.
   Nothing on screen at boot is a call — `S.call` starts null — but the render
   branch in views.js has to have been given a `callScreen` to find before the
   first Join can be pressed, and one call here is what proves it. */
render();
