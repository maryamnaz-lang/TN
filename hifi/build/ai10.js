/* ==========================================================================
   AI10 — THE LIVE CALL

   Join did nothing. Every appointment in the product ends in a black card with
   a face on it and a primary button that said `Join`, and pressing it was the
   one control on the candidate's side with no destination — the worst place in
   a prototype to run out of product, because it is the moment the whole thing
   is FOR.

   So there is a call now, and it is a surface rather than a page: `render()`
   draws it INSTEAD OF the shell and the view, the same way it draws the run-up
   and the auth screens. §60 carries the composition and the argument for it;
   this file is the state, the copy, the clock and the controls.

   TWO KINDS — Figma 499:2022 and 499:1617. `iv` (and `re`) is two people: the
   far side full bleed, you in a picture-in-picture inside it, no column. And
   `cohort` is ten: the leader full bleed, the nine others in a column of discs
   beside it, YOU among them rather than in a picture-in-picture. A fourth kind
   is one entry in `CALL` plus a `data-call` on a button.

   EVERY CONTROL DOES SOMETHING, which is what decided the list. Maryam's
   instruction was that each button be functional, so the bar holds exactly the
   things this prototype can honestly act on: the microphone, the camera,
   sharing, a raised hand and captions are states of the call and are drawn
   everywhere they are visible; People and More decide what the right-hand
   column shows; Leave ends it. The Google Meet reference has a device-picker
   chevron beside the microphone and a reactions button — neither has anything
   to open here, and a dead control on a live surface is worse than a missing
   one.

   WHAT IT DOES NOT DO. It does not move the stage. Ending a session returns
   you to the page you pressed Join on and the prototype's stage picker still
   walks the journey — an interview that levelled you the moment you left the
   call would take the assessment, the report and the 48 hours the product
   describes and throw them away. The last caption says the recording is with
   your agent, which is true and is where the wait starts.

   AND IT IS NOT IN THE HASH. The chrome writes `#<stage>/<view>` on every
   paint so a screen can be sent to somebody (the note at the foot of build.py's
   template is the long version), and a live call is the one thing here that is
   not a screen you can send: it is a moment with a clock running. Reloading
   into it would start the clock again at 00:00 on an interview that had
   already finished, so the hash keeps naming the page underneath.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. STATE

   `S.call` is null or the whole call: which kind, when it started, the five
   things the bar toggles and which panel the column is showing. One object
   that exists or does not, because every surface that reads it reads it whole.

   THE CONTROLS ARE STATE AND NOT CLASSES, which is trap 9. `render()` replaces
   `device.innerHTML`, so a class a click handler puts on the mute button is
   gone the next time anything repaints. A muted microphone is a fact about the
   call, so it lives with the call, and the button — and your tile's mark, and
   your picture-in-picture — are pure functions of it.
   -------------------------------------------------------------------------- */
S.call = null;

/* THE WHOLE SESSION, COMPRESSED. A prototype cannot ask its reader to sit
   through forty-five minutes to see the end of the arc, so the clock runs the
   full length of the session over this many milliseconds and everything else
   moves with it. The number is a BUDGET for the whole call rather than a rate,
   which is the same choice `SUM_MS` makes in ai6.js and for the same reason: a
   45-minute interview and a 60-minute cohort call then take the same time to
   watch. */
const CALL_MS = 42000;

/* PACED WITH `setInterval`, DERIVED FROM ELAPSED TIME — trap 17. This
   prototype is usually read in a pane that reports itself hidden, where
   `requestAnimationFrame` never fires at all: an rAF loop would run its first
   synchronous call and then stop forever, leaving the clock at 00:00 and the
   caption on "Connecting…" in every tab that was not at the front. A timer
   that reads `Date.now()` simply arrives late with more work to do. */
let callTimer = null;

/* --------------------------------------------------------------------------
   2. WHO IS IN THE ROOM

   THE ATTENDANCE IS DERIVED, NOT WRITTEN. `COHORT` (views.js) is the ten
   members of Cohort 41 and carries a last-active line for each; the one member
   who has not been seen recently is the one empty seat. So "9 of 10 here", the
   column of faces and the panel's Attending row are three readings of one list
   and cannot disagree — or with the Cohort page, which draws the same ten rows
   from the same array.

   `COHORT` rows are `[name, initials, avatar, status, mine]`.
   -------------------------------------------------------------------------- */
const CALL_AWAY = 'Not active recently';
const callHere  = () => COHORT.filter(m => m[3] !== CALL_AWAY);
const callMe    = () => COHORT.find(m => m[4]) || COHORT[0];

/* TWO MEMBERS HAVE A PHOTOGRAPH OF THEIR OWN. The design brought three
   pictures (build.py's `CALL_ART` note says what each is and why it is the
   size it is): a landscape still for the feed, and two faces which Figma
   499:1617 puts on two of the tiles — one of them the speaking tile. `AV`'s
   five faces are shared out across ten members, so two of them appearing
   twice in a nine-tile column was the most visible thing in it.

   KEYED BY NAME, and NOT merged into `AV`: an avatar table the whole product
   reads is the wrong place for a photograph two tiles on one surface use, and
   assigning these in `AV` would change a face on nine other pages. */
const CALL_FACE = {'Daniel Kerr': CALL_ART.faceM, 'Nora Lindqvist': CALL_ART.faceW};
const callFaceOf = (m) => CALL_FACE[m[0]] || AV[m[2]];

/* --------------------------------------------------------------------------
   3. THE TWO KINDS

   Each entry answers the same nine questions, and every figure in them is read
   off something else rather than restated here: the agent and the slot come
   from `bkAgent()` / `bkShort()` in ai7.js, so a call opened after Tal has
   booked somebody names the person you actually booked; the week and the
   chapter come from `cfg()` and `CH`; the room's size comes from `COHORT`.
   Nothing in this file is the only place a number is written down.

   THE COHORT CALL IS NOT RECORDED, AND THE FIGMA AGREES. The earlier wireframe
   put a REC pill on the cohort bar and "Recording · On, kept 90 days" in its
   aside; the product's own Data use notice — `V.account`, the page a candidate
   is sent to when they ask — says "Your weekly cohort calls are not recorded".
   The notice won, and 499:1617 draws no recording chip either.
   -------------------------------------------------------------------------- */
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
      /* YOU ARE IN THE COLUMN, NOT IN A PICTURE-IN-PICTURE — 499:1617. Your own
         tile is first, which is where a person looks for themselves, and it is
         the tile that carries what the bar has switched off. */
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
        /* WHAT THE LEADER CAN SEE, because it is the question a person has on a
           call with the ten people they are being compared with — and the
           answer is in the leader's own portal: `V.leadCohort`'s roster is
           progress, assessment average and attempts, per member, visible to
           Priya and to nobody else. */
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

/* THE INTERVIEW AND THE RE-INTERVIEW ARE ONE FUNCTION, because they are one
   appointment at two points on the ladder: same agent, same forty-five
   minutes, same recording, and the difference is entirely what you are being
   assessed against. Two entries in `CALL` would have been the same twenty
   lines twice with three sentences changed. */
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
        /* the dial-in is the agent's own line, so it moves when the agent does
           rather than being a number that belongs to nobody */
        ['Dial-in',    `+44 20 7946 0${400 + (a.ivs % 99)}`],
        ['Recording',  'On, both sides'],
        ['Transcript', 'Generating live'],
        ['Scheduled',  bkShort()]
      ], 'The recording and transcript are what your report is built from. Nothing here is shared with an employer.'],
      re
        ? ['Bring what changed', null, 'One thing you do differently since the last report, and the situation that changed it. The 90 days are the evidence &mdash; this is you saying what they did.']
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

/* --------------------------------------------------------------------------
   4. THE CLOCK, AND WHO IS TALKING

   Three readings out of ONE number — how long the call has been open — so the
   clock, the caption and the ring around the speaking participant can never be
   describing different moments. `frac` is the whole session as 0..1.
   -------------------------------------------------------------------------- */
const callFrac = () => S.call ? Math.min(1, (Date.now() - S.call.t0) / CALL_MS) : 0;

const callClockText = (spec, frac) => {
  const secs = Math.round(frac * spec.mins * 60);
  return String(Math.floor(secs / 60)).padStart(2,'0') + ':' + String(secs % 60).padStart(2,'0');
};
const callPhaseIx = (spec, frac) => {
  const n = spec.phase.length;
  /* the last line is the END and is only ever reached at 1, not by rounding
     into the last bucket a moment early */
  return frac >= 1 ? n - 1 : Math.min(n - 2, Math.floor(frac * (n - 1)));
};
const callPhaseText = (spec, frac) => spec.phase[callPhaseIx(spec, frac)];

/* THE SPEAKER MOVES WITH THE PHASE, which is the cheapest honest answer: a
   call where the ring never moves reads as a still, and a random walk would put
   somebody on it for 400ms. The opening and the closing phase ring nobody —
   during those the host on the feed is the one talking.

   YOU ARE NEVER THE SPEAKER. Your own tile is first in the column, and the ring
   claims something about a microphone this prototype knows nothing about;
   drawing it on yourself while your own Mute button says otherwise would be
   the one contradiction on the surface. */
function callSpeaker(spec, frac){
  if(!spec.people || spec.people.length < 2) return -1;
  const ix = callPhaseIx(spec, frac);
  if(ix === 0 || ix === spec.phase.length - 1) return -1;
  return 1 + ((ix - 1) % (spec.people.length - 1));
}

/* THE TICK WRITES TWO TEXT NODES AND MOVES ONE CLASS. It does not re-render: a
   full repaint twice a second would restart every entrance animation and throw
   away the column's scroll position. Everything it touches is found fresh — a
   render between ticks replaces the elements — and their ABSENCE is how the
   timer learns the call is over, which is the one state it cannot be told. */
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

/* --------------------------------------------------------------------------
   5. OPENING, TOGGLING, LEAVING
   -------------------------------------------------------------------------- */
function callOpen(kind){
  const make = CALL[kind];
  if(!make) return;
  const spec = make(cfg(S.stage));
  S.call = {kind, t0:Date.now(), spec,
    /* CAPTIONS ARE ON BY DEFAULT and the other four are off, which is the state
       both Figma frames are drawn in except for this one: the caption is the
       only line on the surface that changes while you watch it, and a prototype
       that opens with it switched off looks like a photograph. */
    mic:true, cam:true, share:false, hand:false, cc:true, panel:spec.panel};
  /* the rail and any open panel belong to the page underneath; leaving them set
     would put them back over the page the moment the call closes, which is not
     where the reader left them */
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
   inside `.app` and nothing else is. The photographs are set INLINE — a picture
   belongs to the person, not to the stylesheet — which is why §60 draws every
   scrim as a pseudo-element (trap 1), and why the camera-off state is decided
   HERE: no rule can take an inline background off, so the markup simply does
   not set one.
   -------------------------------------------------------------------------- */
function callSelf(c, spec){
  const marks = (c.mic ? '' : I.micOff) + (c.hand ? I.raiseHand : '');
  const body = `${marks ? `<span class="call-selfmk">${marks}</span>` : ''}
    <span class="call-selfn">${spec.self.name} (you)</span>`;
  /* camera on: the photograph fills the tile. camera off: the ground, your own
     disc, and the marks — §60.5. */
  return c.cam
    ? `<div class="call-self" style="background-image:url(${spec.self.img})">${body}</div>`
    : `<div class="call-self"><span class="call-selfav"><img src="${spec.self.img}" alt=""></span>${body}</div>`;
}

/* A PARTICIPANT: a disc, a name, and their state in the corner. `i === 0` is
   you, so your marks come off `S.call`; everybody else's are derived — everyone
   but the person speaking is muted, which is what a cohort call looks like and
   is one fewer thing to remember. */
function callPerson(c, m, i, speaking){
  const mine = i === 0;
  /* EVERYBODY ELSE'S MICROPHONE MARK IS ALWAYS DRAWN, and §60 hides it on
     whichever tile is `.on`. That is not a styling flourish, it is what keeps
     the mark and the ring in step: `callTick` moves the ring between renders —
     it toggles one class and does not rebuild the column — so a mark decided
     HERE would still be showing on the person who has just started talking and
     missing from the one who has just stopped. One class, two things follow.

     YOUR OWN marks are the exception and are decided here, because they come
     off `S.call` rather than off who is speaking, and a render happens every
     time you press one of those buttons. */
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

/* ONE CONTROL. `on` and `off` are two different claims and §60 draws them two
   different ways — black for something you have switched OFF, the accent tint
   for something you have switched ON — so the state is passed as a word rather
   than as a boolean. */
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

/* --------------------------------------------------------------------------
   7. THE ROUTER

   Its own listener rather than four more branches in views.js's: the delegated
   listener there returns rather than stopping propagation, so a second one on
   the same element sees everything it did not claim. Join buttons carry no
   `data-go`, so nothing there matches them today.

   THE TWO PANEL BUTTONS TOGGLE RATHER THAN SET, and they are the reason the
   column is ONE piece of state and not two flags: People and More cannot both
   be open — there is one column — so pressing either means "show me this
   instead", and pressing the one already showing means "give the space back".
   Two booleans would have needed a rule about what to do when both were true.
   -------------------------------------------------------------------------- */
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

/* THE LAST STATEMENT, for the reason ai5.js records and CLAUDE.md's trap 8
   states: the boot render is the final line of views.js and has already run by
   the time this file is parsed, so every pass re-renders at its own foot.
   Nothing on screen at boot is a call — `S.call` starts null — but views.js's
   first render branch has to have been given a `callScreen` to find before the
   first Join can be pressed, and one call here is what proves it. */
render();
