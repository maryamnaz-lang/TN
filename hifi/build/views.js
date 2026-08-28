
/* ============================================================
   ICONS — IBM Carbon icon set (16/20/32), traced from @carbon/icons
   ============================================================ */
;

/* ============================================================
   STATE — one object. Every screen is derived from it.
   ============================================================ */
;
;

/* Views the nav does not offer at a given stage can still be reached by deep link,
   so every stage resolves against a complete base. Nothing renders undefined. */
;
const cfg = k => Object.assign({}, CFG_BASE, CFG[k]);

/* `portal` IS NOT A STAGE. Every other axis of this state object describes one
   candidate moving through 90 days; `portal` describes WHICH PERSON is
   signed in — the candidate, or the cohort leader who runs their calls. The two
   are separate accounts in the real product and a leader has no stage at all,
   so the stage picker and `portal` are deliberately independent: switching
   stage returns you to the candidate (see setStage), and switching portal
   leaves the stage untouched so you come back to where you were. */
const S = {stage:'new', view:'dashboard', portal:'candidate', tal:false, talQ:null, nav:false, notif:false, read:[], hideAch:[], rtab:'points', ctab:'discussion', hist:[], thread:[], typing:false,
  addCard:false, editProfile:false, editPhoto:false, stg:0, notes:false, iv:'level',
  /* the three scenes kept from each interview. `null` means "not chosen yet",
     which is what puts the chooser on the Interviews module — see the note
     over `SCENES` and the seeding in `setStage`. The boot stage is `new`, at
     which no interview has happened, so both start empty. */
  scenes:{level:null, re:null}, scPick:{level:[], re:[]},
  cards:[{brand:'Visa',last:'4242',exp:'09/29',def:true}]};
const isLead = () => S.portal === 'leader';
;
const lvlName = c => 'Explorer – ' + c;
const who = f => f.pred ? f.track + ' track' : lvlName(f.level);
/* the POSITION on the ladder, 1-15, as against `f.level`'s code. Both are
   spoken as "level" in the product; the note over `RUNG` in data.js is why
   only one of them is spelt that way in the code. */
const rungOf  = c => RUNG[c] || 2;
;
;
;
;   /* chapters that map to this candidate's growth areas */

/* ============================================================
   NOTIFICATIONS — derived from the stage, newest first
   ============================================================ */
;
/* THE BELL BELONGS TO WHOEVER IS SIGNED IN. A candidate's notifications are
   keyed by stage because everything that happens to them is a consequence of
   where they are in the 90 days. A leader has no stage: what reaches them
   is other people's work arriving — an interview finished, a candidate going
   quiet — so their list is one list. `LEAD_NOTIF` is declared in lead.js,
   which is parsed after this file, hence the guard rather than a direct read. */
const notifList = () => isLead()
  ? (typeof LEAD_NOTIF !== 'undefined' ? LEAD_NOTIF : [])
  : (NOTIF[S.stage] || []);
const unreadCount = () => notifList().filter(n=>n.unread && !S.read.includes(n.t)).length;

function notifPanel(){
  const list = notifList();
  const rows = (group) => list.filter(n=>group==='today' ? /ago|Today/.test(n.w) : !/ago|Today/.test(n.w))
    .map(n=>{
      const un = n.unread && !S.read.includes(n.t);
      return `<button class="nrow ${un?'un':''}" data-go="${n.go}" data-read="${n.t}">
        <span class="nrow-ic">${I[n.ic]}</span>
        <span class="nrow-b"><span class="nrow-t">${n.t}</span><span class="nrow-d">${n.b}</span></span>
        <span class="nrow-w">${n.w}</span>
      </button>`;
    }).join('');
  const today = rows('today'), earlier = rows('earlier');
  return `<div class="notif ${S.notif?'on':''}">
    <div class="notif-h">
      <h2>Notifications</h2>
      ${unreadCount()?`<button class="notif-all" data-readall="1">Mark all read</button>`:''}
      <button class="x" data-toggle="notif" aria-label="Close">${I.close}</button>
    </div>
    <div class="notif-b">
      ${list.length?`
        ${today?`<div class="notif-g">Today</div>${today}`:''}
        ${earlier?`<div class="notif-g">Earlier</div>${earlier}`:''}`
      :`<div class="empty" style="border:0">${I.time}
        <h3>Nothing yet</h3><p>${isLead()?'Finished interviews, cohort activity and messages will show up here.':'Course updates, cohort calls and points will show up here.'}</p></div>`}
    </div>
  </div>`;
}

/* ============================================================
   NAV
   ============================================================ */
;
;

function sidenav(f){
  const active = PARENT[S.view] || S.view;
  /* The leader's rail is a FIXED set. A candidate's nav grows with their stage —
     four items when they join, nine once enrolled — because the nav is the
     record of what they have unlocked. A cohort leader unlocks nothing: they
     have the same seven modules on their first day as on their last, so the set
     is named directly rather than read off `f.nav`, which is a candidate fact. */
  const items = NAVSETS[isLead() ? 'leader' : f.nav].map(([k,l,ic,badge]) =>
    `<button class="sn-item ${k===active?'on':''}" title="${l}" data-go="${k}"${k===active?' aria-current="page"':''}>${I[ic]}<span>${l}</span>${badge?`<span class="badge">${badge}</span>`:''}</button>`).join('');
  return `
  <div class="scrim ${S.nav?'on':''}" data-close="nav"></div>
  <nav class="sidenav ${S.nav?'on':''}" aria-label="Portal">
    <div class="sn-main">${items}</div>
    <div class="sn-foot">
      <button class="sn-item ${active===(isLead()?'leadProfile':'account')?'on':''}" title="Profile" data-go="${isLead()?'leadProfile':'account'}">${I.user}<span>Profile</span></button>
      <button class="sn-item" title="Log out" data-go="stage:signup/login">${I.logout}<span>Log out</span></button>
    </div>
  </nav>`;
}

/* ============================================================
   THE PORTAL SWITCH
   Two accounts, one prototype. A candidate and the cohort leader who runs
   their calls see genuinely different products — different rail, different
   pages, different notifications — and the client needs to walk from one to
   the other in a demo without a reload.

   IT SITS NEXT TO THE LOGO because that is where a product says which product
   this is. The right-hand end of the bar is already the row of things about
   YOU (your name, your bell, your face); putting a portal switch there would
   read as another personal control rather than as the frame around everything
   below it. Next to the mark it reads the way it should: TalentNext, and then
   which side of TalentNext you are looking at.

   IT IS NOT A NAV ITEM. `data-portal` is its own branch in the delegated
   listener rather than a `data-go`, because `go()` pushes history and swaps a
   view inside the current portal — and this changes who is signed in. Crossing
   that line resets the stack rather than adding to it (see swapPortal).
   ============================================================ */
const PORTALS = [['candidate','Candidate'],['leader','Cohort Leader']];
function pswitch(){
  return `<div class="pswitch" role="tablist" aria-label="Portal">
    ${PORTALS.map(([k,l])=>`<button class="psw-t ${S.portal===k?'on':''}" role="tab" aria-selected="${S.portal===k}" data-portal="${k}">${l}</button>`).join('')}
  </div>`;
}

function shell(){
  const f = cfg(S.stage);
  /* The leader's own line is their ROLE, not a level. `who(f)` prints the
     candidate's track or level, which a leader does not have — they are not on
     the ladder they assess against.

     THE LEADER SIGNED IN IS PRIYA NAIR, on purpose. She is already the person
     this candidate's portal names as their agent and the leader of Cohort 41,
     so flipping the tab shows the other side of a cohort the demo has just
     been looking at rather than introducing a stranger. The wireframe used a
     separate name (Dana Whitfield) because it had no candidate beside it. */
  const name = isLead() ? 'Cohort Leader &middot; Explorer and Builder' : who(f);
  /* THE MARK IS THE MENU.
     Collapsed, the rail's own 72px column had two things in it at the top:
     a hamburger, and the full wordmark beside it in a header wide enough for
     neither. Maryam's frame puts ONE control there — the TalentNext icon
     mark, sitting over the rail it opens — and turns it into the hamburger
     under the pointer, so the mark says which product this is and the hover
     says what it does. Open, the same corner is the drawer's own head: the
     full wordmark on the left, the close on the right, and the pair is
     exactly `--drawer-w` wide so the rule under it is the rail's rule.

     TWO GLYPHS IN ONE BUTTON, swapped in CSS rather than on a `mouseenter`
     handler. A JS swap would have to fire on a re-render too, and the mark
     is the only thing on this header that is not already state-driven.
     `nav-t` is in `HOVER_KEEP` in build.py for exactly this — everything
     else in the build has its `:hover` disarmed. §34 draws it.

     THE WORDMARK STAYS A LINK HOME and the toggle stays a toggle, even
     though open they read as one object. Pressing a logo goes to the
     dashboard everywhere in this product; making it close the drawer
     instead, only here, would be a third behaviour for the same mark. */
  return `
  <header class="shell">
    <button class="shell-act nav-t ${S.nav?'on':''}" data-toggle="nav" aria-label="${S.nav?'Collapse':'Expand'} navigation" title="${S.nav?'Collapse':'Expand'} navigation">${S.nav?I.close
      :`<span class="nav-t-mark">${TN_MARK}</span><span class="nav-t-menu">${I.menu}</span>`}</button>
    <button class="shell-logo" data-go="${isLead()?'leadDash':'dashboard'}" aria-label="TalentNext home"><img src="${LOGO_K}" alt="TalentNext"></button>
    ${pswitch()}
    <div class="shell-right">
      <span class="shell-name">${name}</span>
      <button class="shell-act ${S.notif?'on':''}" data-toggle="notif" aria-label="Notifications">${I.notification}${unreadCount()?`<span class="shell-badge">${unreadCount()}</span>`:''}</button>
      <button class="shell-act" data-go="${isLead()?'leadProfile':'account'}" aria-label="Account"><span class="shell-avatar"><img src="${isLead()?AV.priya:AV.hana}" alt=""><i>${isLead()?'PN':'MN'}</i></span></button>
    </div>
  </header>`;
}

function authShell(back){
  return `
  <header class="shell">
    ${back?`<button class="shell-act" data-go="${back}" aria-label="Back">${I.arrowLeft}</button>
    <span class="shell-logo" style="padding-left:var(--s02)"><img src="${LOGO_K}" alt="TalentNext"></span>`
    :`<span class="shell-logo" style="padding-left:var(--s05)"><img src="${LOGO_K}" alt="TalentNext"></span>`}
  </header>`;
}

/* ============================================================
   SHARED PIECES
   ============================================================ */
const talLabel = (s) => `<span class="ai-label${s?' '+s:''}">Tal</span>`;

function stars(n){
  let out='';
  for(let i=1;i<=5;i++) out += `<svg class="${i<=Math.round(n)?'f':''}" viewBox="0 0 24 24">${inner('star')}</svg>`;
  return `<span class="stars">${out}</span>`;
}
/* Photos point at a portrait service so the prototype shows real faces when
   online; if the request fails the initials underneath show through. Swap the
   `img` values for embedded headshots when they are available. */
/* Agent headshots, cropped square on the face and embedded, so the cards render
   with no network request. The initials stay behind each one as a fallback. */
;
;
function avatar(a,size){
  return `<span class="av-ph" style="width:${size}px;height:${size}px">
    <i>${a.i}</i><img src="${a.img}" alt="" loading="lazy" onerror="this.style.display='none'"></span>`;
}
const talStar = (q) => `<button class="tal-star" data-tal-ask="${q}" aria-label="Ask Tal"><span class="lbl">Ask Tal</span><span class="sk-mark xs"></span></button>`;

/* horizontal card for the shortlist rail */
function agentCardH(key){
  const a=AGENTS[key];
  return `<div class="agh draw agh-book">
    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${avatar(a,72)}
    <span class="agh-n">${a.n}<span class="ag-price">${a.price}</span></span>
    <span class="agh-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span></span>
    <span class="agh-m">${a.range} · ${a.ivs} interviews</span>
    <span class="agh-f"><span class="agh-slot">${a.slot}</span>
      <span class="agh-act">
        ${talStar('What is '+a.n.split(' ')[0]+' like to be interviewed by?')}
        <button class="btn btn-p btn-sm noic" data-go="agent:${key}">Book</button>
      </span></span>
  </div>`;
}

/* row for the full list */
function agentCard(key){
  const a=AGENTS[key];
  return `<div class="ag draw" role="button" tabindex="0" data-go="agent:${key}">
    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${talStar('What is '+a.n.split(' ')[0]+' like to be interviewed by?')}
    ${avatar(a,48)}
    <span class="ag-b">
      <span class="ag-n">${a.n}</span>
      <span class="ag-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span></span>
      <span class="ag-m">${a.range} · ${a.ivs} interviews</span>
      <span class="ag-foot"><span style="color:var(--text-secondary)">Next: ${a.slot}</span><span class="ag-price">${a.price}</span></span>
    </span>
    <svg class="card-go" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
  </div>`;
}
function mem(name,ini,meta,you,img){
  return `<div class="mem">
    <span class="mem-av mem-ph">${avatar({i:ini, img:AV[img||'priya']}, 36)}</span>
    <span class="mem-b"><span class="mem-n">${name}</span><span class="mem-m">${meta}</span></span>
    ${you?'<span class="tag brand sm">You</span>':''}
  </div>`;
}
/* `clip` is the old row form of a scene — a 48px thumbnail, a title, a
   checkbox. It is unreferenced now: the chooser is `scenePick` and the kept
   set is `sceneRow`, both below. Kept because it is the only compact form of
   a scene in the file and a list of six inside a Tal bubble would want it. */
function clip(title,note,stamp,len,kept){
  return `<div class="clip">
    <span class="thumb">${I.play}<span class="t">${len}</span></span>
    <span class="cb"><span class="ct">${title}</span><span class="cq">${note} · from ${stamp}</span></span>
    <label class="cbx clip-pick" style="padding:0;margin-top:2px"><input type="checkbox" ${kept?'checked':''}><span class="box">${I.check}</span></label>
  </div>`;
}

/* ==========================================================================
   SCENES

   WHAT A CANDIDATE SEES OF THEIR OWN INTERVIEW. The interview is recorded and
   transcribed, and neither of those is theirs to watch: the recording is
   evidence the agent assessed against and the transcript is what Tal reads.
   What the candidate gets is SCENES — short cuts from the conversation, six
   offered and three kept — and they are the only video surface in the module.

   THE SIX ARE OFFERED, NOT ATTRIBUTED. Nothing here says who chose them. The
   copy asks the candidate to choose, and that is the whole of what they are
   told, because a line naming the agent or the platform as the sender turns a
   choice into a review of somebody else's shortlist.

   THREE IS THE CAP AND IT IS A CAP, NOT A TARGET. `sceneToggle` refuses the
   fourth rather than dropping the oldest — a silent swap is the one behaviour
   a person cannot undo, because they never saw it happen.

   `stamp` is where the scene starts in the interview and it is real: the level
   interview's six are the six timestamps `SCENE_AT` (ai.js) marks in the
   transcript, so a scene and the lines it is cut from cannot disagree.
   ========================================================================== */
const SCENES = {
  level: [
    ['The reorganization call',      'Where you changed your mind after listening', '02:14', '1:48'],
    ['Handing over the vendor review','You explain why you took it back',           '11:02', '2:10'],
    ['The Friday rhythm',            'How your weekly meeting actually runs',       '19:37', '1:22'],
    ['Managing up',                  'What you do when a decision comes down',      '24:50', '2:41'],
    ['Conflict with a peer',         'Strong opening, thin resolution',             '31:15', '1:56'],
    ['Closing reflection',           'Summary of your own gaps',                    '41:03', '1:11']
  ],
  re: [
    ['Finishing the reorganization', 'The same story, 90 days later',           '03:40', '2:22'],
    ['The handover that held',       'You left it with Sam and it landed',          '09:18', '1:51'],
    ['A hard conversation',          'Where you said the difficult part first',     '16:05', '2:04'],
    ['Running the Thursday call',    'You took the group through your own example', '22:31', '1:39'],
    ['What you would do again',      'Answer is specific and dated',                '29:47', '1:28'],
    ['Where you are still short',    'Named it before Priya did',                   '38:12', '1:33']
  ]
};

/* THE KEPT SET LIVES IN `S`, NOT IN THE DOM (trap 9). The old chooser held it
   in six `<input type=checkbox>` and counted them on click, which worked only
   because the report page happened not to be rebuilt by a pass. It has to
   outlive a render now — the row of three is drawn on a different page from
   the chooser — so it is state, and `null` is the meaningful third value:
   nothing chosen yet, which is what makes the chooser appear. */
/* TWO SETS, AND THE SECOND ONE IS THE REASON THE SAVE BUTTON EXISTS.
   `S.scPick` is what is selected right now, in the chooser. `S.scenes` is what
   was COMMITTED, and it is the one the rest of the product reads. Collapsing
   them into one array is the obvious simplification and it breaks the flow:
   the chooser is drawn while nothing is committed, so the moment a third card
   went in, the chooser would vanish out from under the finger that pressed it
   — before the person had seen the third selection land, and with no way back
   if the third one was a misfire. `null` on the committed set means "still
   choosing", and Save is what ends it. */
const sceneKeep = (kind) => (S.scenes && S.scenes[kind]) || null;
const scenePicked = (kind) => (S.scPick && S.scPick[kind]) || [];
const sceneDone = (kind) => { const k = sceneKeep(kind); return !!k && k.length === 3; };

/* ONE BIG CARD. Horizontal, a 16:9 still with the play mark over it, the
   scene's own length in the corner of the still, and the title and the line
   about it underneath. Three of these in a row is the whole of what the
   detail page shows of the interview.

   THE STILL IS THE CANDIDATE'S OWN PHOTOGRAPH, dimmed. There is no video in a
   prototype, and the alternatives are both worse than this: a flat grey plate
   reads as a broken image, and a stock frame reads as somebody else's
   interview. A dimmed portrait behind a play mark is what a cut from a video
   call actually looks like, and it is a photograph the product already
   carries for this person. */
/* SIX CUTS FROM ONE CONVERSATION SHOULD NOT LOOK LIKE SIX COPIES OF ONE
   FRAME. There is one photograph, so the frame is varied by moving it: each
   scene sets its own vertical crop through `--still-y`, which §38.1 reads.
   Six positions down one portrait is six different compositions of the same
   person, which is exactly what six moments of a video call are. */
const STILL_Y = ['14%','24%','34%','19%','29%','39%'];
function sceneCard(kind, i, n){
  const s = SCENES[kind][i];
  return `<button class="scene" data-scene-play="${kind}:${i}" aria-label="Play ${s[0]}, ${s[3]}">
    <span class="scene-still" style="background-image:url('${AV.hana}');--still-y:${STILL_Y[i%6]}">
      <span class="scene-play">${I.play}</span>
      <span class="scene-len">${s[3]}</span>
    </span>
    <span class="scene-b">
      <span class="scene-eb">Scene ${n} &middot; from ${s[2]}</span>
      <span class="scene-t">${s[0]}</span>
      <span class="scene-q">${s[1]}</span>
    </span>
  </button>`;
}

/* the three kept scenes, across. Falls back to the first three if a stage
   arrives with nothing chosen, so a detail page is never empty — the chooser
   is what handles "nothing chosen yet", and it is a different page. */
function sceneRow(kind){
  const keep = sceneKeep(kind) || [0,1,2];
  return `<div class="scene-row">${keep.map((i,n)=>sceneCard(kind,i,n+1)).join('')}</div>`;
}

/* THE CHOOSER. Six of the same card, each one selectable, with the count and
   the save in a bar underneath. A selected card carries `.on` — and it is
   drawn from `S`, so pressing one re-renders and the mark is a fact about the
   state rather than a class a handler left behind. */
function scenePick(kind){
  const keep = scenePicked(kind);
  const n = keep.length;
  return `<div class="scene-pick">
    ${SCENES[kind].map((s,i)=>{
      const on = keep.indexOf(i);
      const full = n >= 3 && on < 0;
      return `<button class="scene scene-sel${on>=0?' on':''}${full?' scene-full':''}"
        data-scene="${kind}:${i}" aria-pressed="${on>=0}">
        <span class="scene-still" style="background-image:url('${AV.hana}');--still-y:${STILL_Y[i%6]}">
          <span class="scene-play">${I.play}</span>
          <span class="scene-len">${s[3]}</span>
          ${''/* THE BOX IS THE PRODUCT'S CHECKBOX, DRAWN RATHER THAN WIRED.
                §2's `.cbx` is a `<label>` around a real `<input type=checkbox>`
                and neither can go here: the card is a `<button>`, and a label
                or an input inside a button is interactive content nested in
                interactive content — invalid, and in practice a click target
                that fights the one around it.

                So this is a span carrying the same geometry and the same two
                states (§38.3 mirrors §2's values), and the ONE control is the
                card. `aria-pressed` on the button is what says selected to a
                screen reader; the box is the picture of it, which is why it
                takes no aria of its own and no tabindex. */}
          <span class="scene-box">${I.check}</span>
        </span>
        <span class="scene-b">
          <span class="scene-eb">From ${s[2]}</span>
          <span class="scene-t">${s[0]}</span>
          <span class="scene-q">${s[1]}</span>
        </span>
      </button>`;
    }).join('')}
  </div>
  <div class="scene-bar">
    <span class="scene-count">${n === 0 ? 'Nothing chosen yet' : n === 3 ? 'Three chosen' : n + ' of 3 chosen'}</span>
    ${''/* §2 already styles `.btn[disabled]`, so the attribute is the whole of
          the treatment — no companion class, and the button cannot be pressed
          rather than being pressable and refused. */}
    <button class="btn btn-p btn-sm" data-scenesave="${kind}"
      ${n === 3 ? '' : 'disabled'}>Save these three ${I.arrowRight}</button>
  </div>`;
}
function chRow(i,f){
  const n=i+1, name=CH[i][0], mins=CH[i][1];
  let state='', meta='';
  if(i < f.done){ state='done'; meta=`${mins} min · ${SCORE[i]}% assessment`; }
  else if(i === f.open && f.enrolled){ state='open'; meta = S.stage==='day34'&&i===3 ? '12 of 70 min · 4 opens' : `Started · ${mins} min`; }
  else if(OPEN_DATES[i] && f.week < i){ state='locked'; meta='Opens '+OPEN_DATES[i]; }
  else { state=''; meta='Not started · '+mins+' min'; }
  const flag = GROWTH.includes(i) ? 'Your growth area' : '';
  const trail = state==='done'
      ? `<span class="ch-act">Restart</span>`
    : state==='open'
      ? `<span class="ch-act resume">Resume</span>`
    : state==='locked'
      ? `<span class="ch-ic"><span style="fill:var(--gray-50)">${I.locked}</span></span>`
      : `<span class="ch-ic"><span style="fill:var(--gray-40)">${I.circle}</span></span>`;
  return `<button class="ch ${state}" data-go="chapter:${i}">
    <span class="ch-num">${String(n).padStart(2,'0')}</span>
    <span class="ch-b"><span class="ch-n">${name}${state==='done'?`<span class="ch-tick">${I.checkFilled}</span>`:''}</span>
      <span class="ch-m">${meta}${flag?`<span class="sep">·</span><span class="ai-inline"><span class="sk"></span>${flag}</span>`:''}</span></span>
    ${trail}
  </button>`;
}

/* Tal — the layer over whatever screen you are on. */
;

/* ============================================================
   TAL'S REPLIES: a keyword router that answers with widgets, the
   way the wireframes had Tal reply with cards rather than prose
   ============================================================ */
/* THE MARK ON A WIDGET'S LABEL.
   `tw()` takes a title string, not a title and an icon, and it is not given a
   fourth parameter because every one of its ~25 call sites would have to pass
   `null` for it. The mark goes IN the title instead — `.tw-h` is a flex row
   (§39.13) so an svg and a word sit on one line without either knowing about
   the other.

   `acc` IS THE EXCEPTION, NOT THE DEFAULT. Ink is the resting state: a card
   about what a chapter contains, or where the calls are, is reference and its
   mark should be as quiet as the label it sits beside. The accent is for the
   cards a person has to DO something about — what is next, what they are
   behind on, what costs money, where a human takes over. If everything is
   accent then nothing is, which is the same failure the highlight rule in
   ai8.js is written to avoid. */
const twIc = (name, tone) => `<span class="tw-ic${tone ? ' ' + tone : ''}">${I[name] || ''}</span>`;

const tw = (title,body,action) => `<span class="tw">
  ${title?`<span class="tw-h">${title}</span>`:''}${body}
  ${action?`<span class="tw-a">${action}</span>`:''}</span>`;
const twBtn = (label,go) => `<button class="tw-btn"${go?` data-go="${go}"`:''}>${label}${I.arrowRight}</button>`;
const twChips = (qs) => `<span class="tw-chips">${qs.map(q=>`<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>${q}</button>`).join('')}</span>`;

function wChapter(i){
  const g = GAME[S.stage];
  const done = g && i < g.done, inprog = S.stage==='day34' && i===3;
  return tw(twIc('book') + `Chapter ${i+1} · ${CH[i][0]}`,
    `<span class="tw-row"><span class="tw-bar"><i style="width:${inprog?17:done?100:0}%"></i></span>
     <span class="tw-k">${inprog?'12 of 70':done?CH[i][1]+' of '+CH[i][1]:'0 of '+CH[i][1]} min</span></span>`,
    twBtn('Open chapter '+(i+1),'chapter:'+i));
}
function wTerms(){
  return tw(twIc('idea') + 'Two terms this chapter turns on',
    `<span class="tw-def"><b>Operating rhythm</b>The regular cadence of check-ins that lets you follow work without hovering over it.</span>
     <span class="tw-def"><b>Drop-off point</b>The moment work stops moving and nobody has said so out loud.</span>`);
}
function wLadder(){
  const f = cfg(S.stage);
  /* NO LEVEL IS MARKED BEFORE THE INTERVIEW.
     `cfg()` merges CFG_BASE, which carries `level:'E3'` so that nothing
     downstream renders undefined — but on `consult`, `new` and `booked` that
     E3 is a DEFAULT, not a fact, and this widget was drawing it as the
     current level. On the consultant-call dashboard that is the one claim the
     whole screen exists to deny, and Tal is one chip away from saying it.

     `trackBand()` already settled this for the My Level page, in those words:
     no segment is filled, because the level is what the interview decides and
     a solid one would be a claim the product has not made. `f.pred` is the
     flag that says the level is still a prediction, and it is what both
     drawings now read. The list changes with it — "finish the chapters" is
     advice for somebody enrolled, not for somebody four days in. */
  const cur = f.pred ? null : f.level;
  return tw(twIc('growth') + 'The Explorer track',
    `<span class="tw-rungs">${['E1','E2','E3','E4','E5'].map(r=>`<i class="${r===cur?'on':''}">${r}</i>`).join('')}</span>
     <span class="tw-list">
       ${f.pred
         ? `<span>An interview with a talent agent confirms which level you are on</span>
            <span>Your level opens the 90-day course built for it</span>
            <span>Re-interview at day 91: move up, hold, or drop back</span>`
         : `<span>Finish the 13 chapters and keep your weekly tasks on time</span>
            <span>Re-interview once the 90 days are up</span>
            <span>Your cohort leader decides: move up, hold, or drop back</span>`}
     </span>`,
    twBtn('See my level','level'));
}
function wPoints(){
  const g = GAME[S.stage];
  if(!g) return tw(twIc('trophy','acc') + 'Points','<span class="tw-k">Points start when your cohort does.</span>');
  return tw(twIc('trophy') + 'Fastest points from here',
    `<span class="tw-lines">
      <span><b>+25</b>each chapter you finish</span>
      <span><b>+50</b>each cohort call you attend</span>
      <span><b>+10</b>a post on the cohort board</span>
      <span><b>+20</b>someone reacts to your post</span>
     </span>
     <span class="tw-k">You are on ${g.pts.toLocaleString()}. Bronze lands at 2,500.</span>`,
    twBtn('Open Points','rewards'));
}
function wPrep(){
  return tw(twIc('checkOutline') + 'A 10-minute run-through',
    `<span class="tw-check">
      <span>One story where you handed work over and it went wrong</span>
      <span>What you would do differently, in one sentence</span>
      <span>One decision you changed after listening to someone</span>
     </span>`,
    twBtn('Start the practice run'));
}
function wAgent(){
  const a = AGENTS[S.agent||'priya'];
  return tw(null,
    `<span class="tw-ag">${avatar(a,40)}<span><b>${a.n}</b><span class="tw-k">${a.range} · ${a.ivs} interviews · ${a.price}</span></span></span>
     <span class="tw-list">
       <span>Opens with a situation from your own answers</span>
       <span>Pushes hardest on delegation</span>
       <span>Reports inside 24 hours</span>
     </span>`,
    twBtn('See '+a.n.split(' ')[0]+'&rsquo;s slots','agents'));
}
function wCall(){
  return tw(twIc('video') + 'Thursday 6:00 PM ET · 60 minutes',
    `<span class="tw-list">
       <span>Week ${cfg(S.stage).week} is on hard conversations</span>
       <span>Bring the Sam handover from your notes</span>
       <span>Three others flagged the same chapter</span>
     </span>`,
    twBtn('Open Cohort 41','cohort'));
}
function wDraft(){
  return tw(twIc('edit') + 'A reply you could send',
    `<span class="tw-quote">Thanks Priya. I will bring the vendor review to Thursday. The part I am stuck on is telling someone I am taking work back without it reading as a lack of trust.</span>`,
    `${twBtn('Use this','messages')}<button class="tw-btn ghost" data-ask="1">Try another wording</button>`);
}
function wWorkload(){
  return tw(twIc('time') + 'What the weeks look like',
    `<span class="tw-lines">
      <span><b>~55 min</b>chapters and assessment</span>
      <span><b>60 min</b>the live cohort call</span>
      <span><b>~15 min</b>the weekly task</span>
     </span>
     <span class="tw-k">Two hours a week, near enough. Weeks 4 and 12 run longer.</span>`);
}
;
function talReply(q){
  for(const [m,fn] of TAL_ROUTES) if(m.test(q)) return fn();
  return 'I can help with your course, your level, the cohort call and your points. Try one of these.'
    + twChips(TALCTX[S.view] || TALCTX.dashboard);
}

function talPanel(f){
  /* TAL READS THE PORTAL, NOT JUST THE PAGE. The opener names where you are and
     what is true of you, and both halves change with who is signed in: a leader
     is not on day 34 of anything, and "my level" is not one of their pages. The
     leader's page names and state line come from lead.js (parsed later, hence
     the guards); everything else about the panel — the thread, the composer,
     the hero — is the same surface for both. */
  const lead = isLead() && typeof LEAD_TAL !== 'undefined' ? LEAD_TAL : null;
  const ctx = (lead ? (lead.ctx[S.view] || lead.ctx.leadDash) : (TALCTX[S.view] || TALCTX.dashboard));
  const where = (lead ? lead.where[S.view] : ({dashboard:'Dashboard',level:'My Level',report:'Your report',interviews:'Interviews',
    agents:'Choosing an agent',agent:'Agent profile',booking:'Interview booked',enrol:'Enrolling',
    payment:'Payment',coursework:'Coursework',chapter:'Chapter '+((S.ch??3)+1),transcript:'Course Progress',rewards:'Points',
    cohort:'Cohort 41',billing:'Payments',account:'Profile',messages:'Messages'})[S.view]) || 'TalentNext';
  const state = lead ? lead.state()
    : f.complete ? lvlName(f.level)+', cohort complete'
    : f.enrolled ? lvlName(f.level)+', day '+f.day+' of 90'
    : f.pred ? f.track+' track, level not set yet'
    : lvlName(f.level)+' confirmed, not enrolled';

  const opener = S.view==='chapter' && S.ch===3
    ? `You are 12 minutes into chapter 4. Want the short version before you go back in?`
    : `You are on <b>${where.toLowerCase()}</b>, ${state.toLowerCase()}. Ask me anything, or start with one of these.`;
  const bubble = (who,html) => who==='me'
    ? `<div class="tal-msg me"><span class="tal-who"><span class="tal-who-n">You</span><span class="av"><img src="${isLead()?AV.priya:AV.hana}" alt=""><i>${isLead()?'PN':'MN'}</i></span></span><div class="bb">${html}</div></div>`
    : `<div class="tal-msg"><span class="tal-who"><span class="tal-mk sm"></span><span class="tal-who-n">Tal</span></span><div class="bb">${html}</div></div>`;
  const hero = `<div class="tal-hero">
      <span class="tal-mk lg orb"></span>
      <h2>Hello <b>${isLead()?'Priya':'Maryam'}</b>, I am Tal &#128075;</h2>
      <p>${isLead()?'I can read your cohorts, your evaluations and where people are stuck. What do you need?':'I am here to assist you with anything you need help with. What&rsquo;s going on?'}</p>
    </div>`;
  const thread = (S.thread.length ? '' : hero)
    + S.thread.map(m=>bubble(m.who,m.html)).join('')
    + (S.typing?bubble('tal',`<div class="ai-stream"><i></i><i></i><i></i></div>`):'');

  return `<div class="tal-panel ${S.tal?'on':''}" id="talPanel">
    <div class="tal-h">
      <span class="tal-mk"></span>
      <span class="nm"><b>Tal</b></span>
      <button class="shell-act tal-x" data-toggle="tal" aria-label="Close Tal" style="color:var(--icon-primary)">${I.close}</button>
    </div>
    <div class="tal-body" id="talBody">${thread}</div>
    ${S.thread.length?'':`<div class="tal-sugg">${ctx.map(s=>`<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>${s}</button>`).join('')}</div>`}
    
    <div class="composer">
      <span class="tal-mk sm composer-mk"></span>
      <input class="inp ai-field" placeholder="Ask Tal anything" aria-label="Ask Tal">
      <button aria-label="Send">${I.send}</button>
    </div>
  </div>`;
}

const askChip = (q,label) => `<button class="chip-tal" data-tal-ask="${q}"><span class="sk-mark xs"></span>${label||'Ask Tal'}</button>`;
/* THE FAB WEARS TAL'S MARK AND A CHAT ICON. The button used to be a black
   square carrying the sparkle — the generic "there is AI here" mark, which
   said what the control was made of rather than what it does. It is now the
   gradient circle (27-tal.css §8 draws it as a pseudo-element, so nothing
   here has to hold it) with the chat mark on top: the circle is WHO you are
   about to talk to, the icon is WHAT happens when you press. `.tal-fab-t`
   stays in the markup and is hidden by that same section — see the note
   there about the desktop label 15-course.css added.

   `I.talChat` and not `I.chat`: the mark is Maryam's, traced — the note in
   icons.js says why the two are different icons and why the rail keeps the
   Material one. */
const talFab = () => `<button class="tal-fab" data-toggle="tal" aria-label="Ask Tal"><svg viewBox="0 0 559 559" aria-hidden="true"><path d="M104.015 128.327H166.308L299.699 279.673L75.2133 533.824H14.0996L238.586 279.673L104.015 128.327Z"/><path d="M350.022 197.67L422.299 279.673L197.813 533.824H136.699L361.185 279.673L288.275 197.67H350.022Z"/><path d="M362.423 418.329H424.716L544.872 280.191L321.278 25.2051H260.164L483.758 280.191L362.423 418.329Z"/></svg><span class="tal-fab-t">Tal</span></button>`;

/* ============================================================
   PICTOGRAMS — IBM Design Language line art. Carbon ships icons,
   not pictograms, so these are drawn to the DL spec: 1.5px stroke,
   no fill, 48px canvas, currentColor.
   ============================================================ */
;

/* ============================================================
   GRAPHIC PANELS — IBM Design Language "layered planes": flat
   geometric fields in one hue family with a white object on top.
   These replace the line pictograms at the top of cards.
   ============================================================ */
/* Each panel gets its own colour family from the Carbon ramps, the way IBM
   varies its card illustrations. Lime is a highlight inside them, not the
   ground, so the brand marks the graphic rather than flooding it. */
/* kept as a name so the stage reads cleanly; the corner plane takes the family's
   deepest tone, which balances the stepped planes bottom left */

;
/* One construction for all six panels, so nothing drifts between them: a 400x160
   stage that matches the banner's 5:2 box exactly, so the art never crops and
   never stretches at any width. Ground plane, a quarter disc anchored bottom
   right, two stepped planes bottom left, one lime block top right, and a white
   card just left of centre carrying the motif. Only the motif changes. */
const gstage = (P,motif) => `<svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
  <rect width="400" height="160" fill="${P.a}"/>
  <path d="M264 160A136 136 0 0 1 400 24L400 160Z" fill="${P.b}"/>
  <rect x="0" y="96" width="72" height="64" fill="${P.b}"/>
  <rect x="0" y="128" width="36" height="32" fill="${P.c}"/>
  <rect x="356" y="0" width="44" height="26" fill="${P.d}"/>
  <rect x="168" y="60" width="124" height="96" fill="${P.c}"/>
  <rect x="160" y="52" width="124" height="96" fill="#fff"/>
  <g transform="translate(20,18)">${motif}</g>
</svg>`;

/* every motif is drawn in a 154,46 to 250,118 box and translated into the card */
;
/* a card whose top is a graphic panel with the category pill over it */
/* A quiet variant: grey outlines that fade into the card rather than a colour
   panel. For explainer cards, where a full-colour banner would outshout the copy. */
const GFXLINE = `<svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
  <rect width="400" height="160" fill="var(--gray-10)"/>
  <g fill="none" stroke="var(--gray-30)" stroke-width="1.25">
    <circle cx="330" cy="152" r="150"/><circle cx="330" cy="152" r="112"/><circle cx="330" cy="152" r="74"/>
  </g>
  <g fill="none" stroke="var(--gray-20)" stroke-width="1">
    <path d="M0 34h400M0 68h400M0 102h400M0 136h400"/>
  </g>
  <g fill="none" stroke="var(--gray-40)" stroke-width="1.5">
    <rect x="40" y="28" width="172" height="106"/>
    <rect x="58" y="94" width="26" height="24"/>
    <rect x="96" y="76" width="26" height="42"/>
    <rect x="134" y="60" width="26" height="58"/>
  </g>
  <rect x="172" y="42" width="26" height="76" fill="none" stroke="var(--brand-primary)" stroke-width="2"/>
  <path d="M71 88 109 70 147 54 185 36" fill="none" stroke="var(--gray-60)" stroke-width="1.5"/>
  <circle cx="185" cy="36" r="4.5" fill="var(--brand-primary)"/>
</svg>`;
const gfxLine = tag => `<span class="gfx wide line lead">${GFXLINE}${tag?`<span class="gfx-tag">${tag}</span>`:''}</span>`;

const gfxLead = (kind,tag) => `<span class="gfx wide lead" style="background:${PAL[kind].a}">${GFX[kind]}${tag?`<span class="gfx-tag">${tag}</span>`:''}</span>`;
const GC_IC = {track:'growth', course:'courseCard', interview:'video', cohort:'group',
               points:'trophy', certificate:'certificate', time:'time', community:'chat'};
/* NO CALL SITE IN THIS FILE TODAY, AND IT STAYS ANYWAY. Its two users were the
   `new` dashboard's "Decided so far" section, removed for restating the quiz
   block above it. `.gcard` itself is very much alive — 68 rules in
   `talentnext-ds.css`, ten uses in `tn-agent-portal.html`, its own entry in
   the gallery, and a place in §10.15's label-column opt-out list — so what is
   unused is this portal's RECIPE for it, not the component.

   Deleting the recipe is the expensive half of that trade. The markup here is
   load-bearing in the way CLAUDE.md warns about: `.cardrow-ic`, `.gcard-b` and
   the `.tile-arrow` svg are structure the CSS keys on, and a guessed version
   looks broken rather than absent. Five lines of template against the next
   page re-deriving them from the stylesheet. */
const gcard = (kind,tag,title,sub,go) => `<button class="tile clk gcard" data-go="${go}">
  <span class="cardrow-ic">${I[GC_IC[kind]||'document']}</span>
  <span class="gcard-b">
    ${tag?`<span class="eyebrow">${tag}</span>`:''}
    <h3>${title}</h3><span class="sub">${sub}</span>
  </span>
  <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
</button>`;

const pict = (k,cls) => `<span class="pict ${cls||''}">${PG[k]}</span>`;

/* Card brand marks. Drawn, not fetched, so the file stays self-contained. */

;
const bmk = (b,cls) => `<span class="bmk ${cls||''}" aria-hidden="true">${BMK[b]||BMK.card}</span>`;
const brandOf = n => { n=(n||'').replace(/\D/g,'');
  if(/^4/.test(n)) return 'Visa';
  if(/^3[47]/.test(n)) return 'Amex';
  if(/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if(/^6(011|5|4[4-9])/.test(n)) return 'Discover';
  return null; };

/* ============================================================
   POINTS, BADGES, RANK
   The criteria come from LightSpeed VT and arrive over their API,
   so the shapes below mirror their payload exactly: an award list
   with positive and negative values, four badges, three star ranks.
   ============================================================ */
;
;
;
/* per stage: total, which awards have fired, badges held, star rank, minutes per week */
;

/* what to celebrate at the top of the dashboard, dismissible */
;
/* THE MARK IS THE AWARD, AND VIEW IS A BUTTON.
   Two things were wrong with the first drawing of this band, and they were
   the same mistake twice: the one moment on the dashboard that exists to
   say "you won something" was drawn out of the parts a list row is made of.

   The mark took `.ach-ic`, the 40px glyph chip every list row leads with,
   so a Bronze shield you can see on the rewards page arrived here as a
   line drawing in a box. It takes the artwork instead — see the note on
   ACH — and drops the box with it, because a photograph of an object does
   not need a frame drawn around it.

   And "View" was a `<button>` sitting inside `.ach-b`, the TEXT slot, where
   §02's trailing-icon rule sized it 20x20 as though it were a chevron. It
   reads as underlined text at the foot of a sentence: the same shape as the
   two links either side of it on the page and none of the weight of the one
   thing this band is asking you to do. It comes out of the text slot and
   becomes a real control at the end of the row, next to the dismiss. */
function achBanner(){
  const a = ACH[S.stage];
  if(!a || S.hideAch.includes(S.stage)) return '';
  return `<div class="ach">
    ${a.art
      ? `<span class="ach-art"><img src="${AWARD[a.art]}" alt=""></span>`
      : `<span class="ach-ic">${I[a.ic]}</span>`}
    <span class="ach-b"><span class="ach-t">${a.t}</span><span class="ach-d">${a.b}</span></span>
    <button class="btn btn-p btn-sm noic ach-go" data-go="${a.go}">View</button>
    <button class="ach-x" data-hideach="1" aria-label="Dismiss">${I.close}</button>
  </div>`;
}

/* progress strip: one percentage, thirteen chapter blocks, three figures */
function progressStrip(f){
  const pct = Math.round(f.done/13*100);
  const tasks = S.stage==='week1'?'0 of 3':S.stage==='day34'?'1 of 3':'3 of 3';
  const hrs = Math.floor(f.mins/60)+'h '+(f.mins%60)+'m';
  return `<div class="prog">
    <div class="prog-top">
      <div><div class="prog-pct">${pct}<small>%</small></div><div class="prog-l">of the course done</div></div>
      <div class="prog-day"><div class="prog-dn">Day ${f.day}</div><div class="prog-l">of 90</div></div>
    </div>
    <div class="prog-seg">${CH.map((c,i)=>
      `<i class="${i<f.done?'done':(i===f.open?'now':'')}" title="Chapter ${i+1}"></i>`).join('')}</div>
    <div class="prog-figs">
      <span><b>${f.done} of 13</b>chapters</span>
      <span><b>${tasks}</b>week ${f.week} tasks</span>
      <span><b>${hrs}</b>invested</span>
    </div>
  </div>`;
}

/* THE RING IS THE BAR, BENT.
   A full-width track under a two-line title is a lot of page spent on one
   percentage, and it spends it in the worst place: the eye reads the title,
   crosses eight hundred pixels of grey, and arrives at a number set below in
   helper type. Bent into a 64px ring the same figure sits at the end of the
   title line, reads as one object with it, and gives the row a right-hand
   anchor the card can hang its other numbers off.

   SOLID, NOT THE GRADIENT. §19 runs the brand gradient through every FILL in
   the product, progress bars included, and states the exception this falls
   under: marks that are DRAWN rather than filled — an SVG path, a border, a
   caret — keep the solid, because a gradient across a 6px stroke is not a
   gradient, it is a smudge. A ring is a stroke.

   `--arc` carries the visible arc length rather than a `width` percentage,
   because a dash pattern is the only way to fill part of a circle and the
   pattern needs the length in user units. 2πr for r=26 is 163.4, so the arc
   is that times the fraction; the gap is any number larger than the
   circumference, which is what stops the pattern repeating.

   The figure is the OPEN CHAPTER's progress — the number the old bar drew —
   not the week's minutes. `GAME[stage].weeks` and `CFG.mins` disagree about
   week 1 (see the note above WEEKLY in data.js), and the strip below this
   card already prints one of them. */
function ring(pct, label){
  const arc = (2 * Math.PI * 26 * Math.min(pct, 100) / 100).toFixed(1);
  return `<div class="ring" role="img" aria-label="${label || pct + '% done'}">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle class="ring-t" cx="32" cy="32" r="26"></circle>
      <circle class="ring-f" cx="32" cy="32" r="26" style="--arc:${arc}"></circle>
    </svg>
    <span class="ring-n u-h2">${pct}<small>%</small></span>
  </div>`;
}

/* THIS WEEK — TWO HALVES AND A RING
   What the card used to be: the open chapter, a bar, and its minutes. What it
   left out is the whole of the week either side of that chapter — so it now
   answers two questions in order, and the chapter it used to be about is the
   band across the top.

     what I have done      chapters finished and assessments scored, from
                           WEEKLY[stage].did. Facts only, past tense; see the
                           note above WEEKLY for why nothing undone is in it.
     what is expected      Tal, comparing you with the members of the cohort
                           who are furthest ahead. Attributed, because it is
                           the one place in the card reading somebody else's
                           numbers, and closed by the question a person
                           actually has at that point.

   THE CARD IS NOT A BUTTON ANY MORE. It was `tile clk arrow` — the whole
   block one click target to the chapter. It cannot stay one: it now contains
   a Tal chip, and a control inside a control is a click whose destination
   depends on where in the block you land. Same conclusion §29.16 reached for
   the report card on My Level, and the same fix — the way in becomes a real
   button.

   THAT BUTTON SITS IN THE TOP BAND, NOT AT THE FOOT. It closed the card for
   one release, on the argument that a way in belongs where the reading ends.
   The reading is two blocks long and the button was grey, which made the
   only required action on the page the last and faintest thing in it. It is
   primary weight now and sits under the chapter it opens; the foot keeps
   Tal's question, which is the thing you do when you are NOT ready to open
   the chapter.

   Used at both stages that draw the section (week1, day34). Day 90 does not:
   `f.finished` hides the section entirely, which is why the old markup's
   `f.finished ? 'Course complete' : …` branch was unreachable and is gone. */
function weekCard(f){
  const w = WEEKLY[S.stage] || WEEKLY.week1;
  const i = f.open, mins = CH[i][1];
  const did = S.stage === 'day34' ? 12 : 0;
  const pct = Math.round(did / mins * 100);
  return `<div class="wkc">
    <div class="wkc-top">
      <div class="wkc-tb">
        <div class="wkc-eb t-label-01">Chapter ${i + 1} &middot; ${S.stage === 'week1' ? 'unlocked today' : 'in progress'}</div>
        <h3 class="u-h3">${CH[i][0]}</h3>
        <div class="wkc-min sub">${did} of ${mins} minutes</div>
        <!-- THE WAY IN IS NOT IN THE CARD ANY MORE — it is the section's head
             row action, next to "This week", where it replaced a "Coursework"
             button that pointed at the module rather than the work. The
             argument for hoisting it out of the card's foot still holds and
             this is the same argument one step further: the one thing this
             section exists to make happen is now the first thing on it and in
             the position every other section on the dashboard uses for its
             own action. The reading below is what you do INSTEAD of opening
             the chapter, which is the honest order.

             NO BACKTICKS IN THIS COMMENT. It is an HTML comment inside a
             template literal, so a backtick here closes the string and the
             prose after it is parsed as JavaScript — which is exactly what
             happened on the first attempt at this edit: the class name below
             was quoted the way every other note in this file quotes one, and
             week1 and day34 both threw out of weekCard on first render.

             The wkc-go rule is §37.3 and is left there: it is the correct
             treatment IF the button ever comes back inside the top band, and
             on a card that no longer draws the element it matches nothing. -->
      </div>
      ${ring(pct, `${pct}% of chapter ${i + 1} done`)}
    </div>
    <div class="wkc-blk">
      <div class="wkc-h"><span class="u-overline">What I have done this week</span></div>
      ${w.did.length
        ? `<ul class="wkc-did">${w.did.map(([t, m]) => `<li class="u-compact">
            <span class="wkc-tick">${I.checkFilled}</span>
            <span class="wkc-db"><b>${t}</b><span class="u-caption">${m}</span></span></li>`).join('')}</ul>`
        : `<p class="wkc-none u-body">${w.none}</p>`}
    </div>
    <div class="wkc-blk">
      <!-- THE ROLE CLASS GOES ON THE SPAN, NOT THE ROW. u-overline is
           uppercase and text-transform inherits, so on the wrapper it
           renders Tal's chip as "TAL". The chip is a name.

           AND THE CHIP IS THE BARE MARK HERE — the "bare" variant, styled
           in §37 the way the page-summary band styles its own. §33 is where
           the argument is: at the head of a page the mark and the name in
           accent ink are enough. A solid orange chip with a
           sheen running through it is the loudest object in a card whose
           actual point is the black button at the top of it, and it was
           announcing a one-line attribution. Same name, same mark, no
           fill: it says who wrote the sentence without competing with the
           thing the sentence is asking you to do. -->
      <div class="wkc-h">${talLabel('bare')}<span class="u-overline">What is expected of me this week</span></div>
      <p class="wkc-p u-body">${w.tal}</p>
      <div class="wkc-a">
        ${askChip(w.ask[0], w.ask[1])}
      </div>
    </div>
  </div>`;
}

/* stacked bars: four activity types, Carbon data-viz palette, 2px surface gaps */
;
;
const segsOf = t => { const a = SPLIT.map(s=>Math.round(t*s)); a[0] += t - a.reduce((x,y)=>x+y,0); return a; };
function stackChart(id,{title,sub,weeks,target,targetLabel}){
  const n = 13;
  const max = Math.max(...weeks, target||0) * 1.2 || 1;
  const cols = Array.from({length:n},(_,i)=>{
    const t = weeks[i];
    if(!(t>0)) return `<button class="sc-col none" data-chart="${id}" data-i="${i}" aria-label="Week ${i+1}, nothing yet"><i></i></button>`;
    const segs = segsOf(t).map((v,k)=>`<u style="height:${(v/max*100).toFixed(2)}%;background:${SERIES[k][1]}"></u>`).reverse().join('');
    return `<button class="sc-col" data-chart="${id}" data-i="${i}"
      aria-label="Week ${i+1}, ${t} min">${segs}</button>`;
  }).join('');
  const refTop = target ? (100 - target/max*100) : null;
  const ticks = Array.from({length:n},(_,i)=>`<span>${(i%4===0||i===n-1)?(i+1):'&nbsp;'}</span>`).join('');
  const li = weeks.length-1;
  return `<div class="chart chart-stacked" id="${id}">
    <div class="chart-head"><span class="t">${title}</span><span class="s">${sub}</span></div>
    <div class="sc-plot">
      ${target?`<div class="chart-ref" style="top:${refTop}%"><span>${targetLabel}</span></div>`:''}
      ${cols}
    </div>
    <div class="chart-x">${ticks}</div>
    <div class="chart-read" data-read="${id}">
      <span class="k">Week ${li+1}</span><span class="v">${weeks[li]} min</span></div>
    <div class="legend">${SERIES.map(([nm,c])=>`<span><i style="background:${c}"></i>${nm}</span>`).join('')}</div>
    <div class="chart-table sc-table">
      <div class="sc-row sc-head">
        <span>Week</span>${SERIES.map(([nm])=>`<span class="num">${nm}</span>`).join('')}<span class="num">Total</span>
      </div>
      ${weeks.map((t,i)=>`<div class="sc-row">
        <span class="sc-w">Week ${i+1}</span>${
        segsOf(t).map(v=>`<span class="num">${v}</span>`).join('')}<span class="num sc-t">${t} min</span>
      </div>`).join('')}
    </div>
    <div class="mt4"><button class="btn btn-g btn-sm noic" data-tbl="${id}" style="padding-left:0">View as a table</button></div>
  </div>`;
}
const nextBadge = pts => BDG.filter(b=>b.need && b.need>pts).sort((a,b)=>a.need-b.need)[0] || null;

/* dashboard summary: total, rank and the next badge in one block */
function scoreCard(g){
  const nb = nextBadge(g.pts);
  const prev = [0,2500,5000,10000].filter(x=>x<=g.pts).pop();
  const pct = nb ? Math.round((g.pts-prev)/(nb.need-prev)*100) : 100;
  return `<div class="score">
    <div class="score-top">
      <div class="score-pts"><div class="l">Points</div><div class="n">${g.pts.toLocaleString()}</div></div>
      <div class="score-rank"><div class="n"><img class="rank-mk" src="${AWARD['rank'+g.rank]}" alt="">${RANKS[g.rank-1].n}</div><div class="l">${g.badges} of 4 badges</div></div>
    </div>
    ${nb?`<div class="score-next">
      <div class="pb-track"><div class="pb-fill" style="width:${pct}%"></div></div>
      <div class="score-meta"><span>${(nb.need-g.pts).toLocaleString()} points to ${nb.n}</span><span>${pct}%</span></div>
    </div>`:''}
  </div>`;
}

/* the three award lists, each rendered as one row grid */
/* The client's own award artwork, embedded at build time. Lossless-enough
   WebP at 160px: these are read at 40-56px and never printed. */
const BDG_ART = ['bronze','silver','gold','involved'];

function awardRow({name,desc,val,state,when,pct,tone,art}){
  const neg = val<0;
  const mark = art
    ? `<span class="aw-art"><img src="${AWARD[art]}" alt="" loading="lazy"></span>`
    : `<span class="aw-ic"${tone?` style="color:${tone}"`:''}>${state==='got'?I.checkFilled:(neg?I.subtract:I.locked)}</span>`;
  return `<div class="aw ${state}${art?' has-art':''}">
    ${mark}
    <span class="aw-b">
      <span class="aw-n">${name}</span>
      <span class="aw-d">${desc}</span>
    </span>
    <span class="aw-r">
      <span class="aw-v">${neg?'&minus;':'+'}${Math.abs(val)}</span>
      <span class="aw-s">${state==='got'?'Awarded '+when:(pct!==undefined?pct+'%':'Not yet')}</span>
    </span>
  </div>`;
}
function pointsList(g){
  const got = PTS.map((r,i)=>({r,i})).filter(x=>g.got.includes(x.i));
  const rest = PTS.map((r,i)=>({r,i})).filter(x=>!g.got.includes(x.i));
  return [...got,...rest].map(({r,i})=>awardRow({
    name:r.n, desc:r.d, val:r.v, art:'points',
    state:g.got.includes(i)?'got':'not', when:g.last[i]
  })).join('');
}
function badgeList(g){
  return BDG.map((b,i)=>{
    const got = i < g.badges;
    return awardRow({name:b.n, desc:b.d, val:b.v, state:got?'got':'not', art:BDG_ART[i],
      when:'11/06/2026', pct: got?undefined:(b.need?Math.min(99,Math.round(g.pts/b.need*100)):0)});
  }).join('');
}
function rankList(g){
  return RANKS.map((r,i)=>awardRow({name:r.n, desc:r.d, val:r.v, art:'rank'+(i+1),
    state:i<g.rank?'got':'not', when:'07/23/2026', pct:i<g.rank?undefined:0})).join('');
}

/* One bar chart, one hue, a dashed reference line for the comparison and a
   tappable readout. Table view sits behind a toggle. */
function barChart(id,{title,sub,data,labels,slots,target,targetLabel,unit}){
  const n = slots || data.length;
  const max = Math.max(...data, target||0) * 1.2 || 1;
  const bars = Array.from({length:n},(_,i)=>{
    const v = data[i];
    const hasV = v!==undefined && v!==null && v>0;
    return `<button class="chart-bar ${hasV?'':'none'}" data-chart="${id}" data-i="${i}" aria-label="${labels[i]}, ${hasV?v+' '+unit:'nothing yet'}">
      <i style="height:${hasV?Math.max(3,Math.round(v/max*100)):1}%"></i></button>`;
  }).join('');
  const refTop = target ? (100 - target/max*100) : null;
  const ticks = Array.from({length:n},(_,i)=>`<span>${(i%4===0||i===n-1)?(i+1):'&nbsp;'}</span>`).join('');
  const last = data.length-1;
  return `<div class="chart" id="${id}">
    <div class="chart-head"><span class="t">${title}</span><span class="s">${sub}</span></div>
    <div class="chart-plot">
      ${target?`<div class="chart-ref" style="top:${refTop}%"><span>${targetLabel}</span></div>`:''}
      ${bars}
    </div>
    <div class="chart-x">${ticks}</div>
    <div class="chart-read" data-read="${id}">
      <span class="k">${labels[last]}</span><span class="v">${data[last]} ${unit}</span></div>
    <div class="chart-table">
      ${data.map((v,i)=>`<div class="kv"><span class="k">${labels[i]}</span><span class="v n">${v} ${unit}</span></div>`).join('')}
    </div>
    <div class="mt4"><button class="btn btn-g btn-sm noic" data-tbl="${id}" style="padding-left:0">View as a table</button></div>
  </div>`;
}

/* Scores sit between 79 and 92, so a zero-baseline bar hides the differences
   and truncating a bar axis would misread. Chapters are sequential, so this is
   a line: 2px stroke, 8px markers with a 2px surface ring, a dashed reference
   line for the cohort average, and the same table view behind the toggle. */
function lineChart(id,{title,sub,data,labels,slots,target,targetLabel,unit,min,max}){
  const W=320,H=104;
  const PAD=5, IW=W-PAD*2;
  const x=i=> slots>1 ? (PAD + i*(IW/(slots-1))) : W/2;
  const y=v=> H - ((v-min)/(max-min))*H;
  const pts = data.map((v,i)=>[x(i),y(v)]);
  const path = pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const dots = pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4"
      fill="url(#g-${id})" stroke="var(--background)" stroke-width="2"/>`).join('');
  const hits = data.map((v,i)=>{
    const w = IW/slots, x0 = Math.max(0, Math.min(W-w, x(i)-w/2));
    return `<rect class="hit" data-chart="${id}" data-i="${i}" x="${x0.toFixed(1)}" y="0"
      width="${w.toFixed(1)}" height="${H}" fill="transparent" aria-label="${labels[i]}, ${v}${unit}"/>`;
  }).join('');
  const ticks = Array.from({length:slots},(_,i)=>`<span>${(i%4===0||i===slots-1)?(i+1):'&nbsp;'}</span>`).join('');
  const last=data.length-1;
  return `<div class="chart" id="${id}">
    <div class="chart-head"><span class="t">${title}</span><span class="s">${sub}</span></div>
    <div class="chart-line">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${title}">
        <defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="var(--dv-grad-a)"/>
          <stop offset="1" stop-color="var(--dv-grad-b)"/>
        </linearGradient></defs>
        <line x1="0" x2="${W}" y1="${y(target).toFixed(1)}" y2="${y(target).toFixed(1)}"
          stroke="var(--border-strong-01)" stroke-width="1" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>
        <path d="${path}" fill="none" stroke="url(#g-${id})" stroke-width="2"
          stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        ${dots}${hits}
      </svg>
      <span class="chart-reflab" style="top:calc(${(y(target)/H*100).toFixed(1)}% + 3px)">${targetLabel}</span>
    </div>
    <div class="chart-x">${ticks}</div>
    <div class="chart-read" data-read="${id}"><span class="k">${labels[last]}</span><span class="v">${data[last]}${unit}</span></div>
    <div class="chart-table ct-bars">${data.map((v,i)=>`<div class="kv" style="--p:${Math.round((v-min)/(max-min)*100)}%"><span class="k">${labels[i]}</span><span class="ct-bar"><i></i></span><span class="v n">${v}${unit}</span></div>`).join('')}</div>
    <div class="mt4"><button class="btn btn-g btn-sm noic" data-tbl="${id}" style="padding-left:0">View as a table</button></div>
  </div>`;
}

/* the cohort board — the community surface the LightSpeed VT points refer to */
;
function discussionList(){
  return `
  <div class="mb5" style="display:flex;gap:var(--s03)">
    <button class="btn btn-p btn-sm" style="flex:1">Start a conversation ${I.add}</button>
  </div>
  <div class="tile-stack">
    ${POSTS.map(p=>`<div class="post">
      <div class="post-h">
        <span class="av-ph" style="width:32px;height:32px;font-size:11px${p.mine?';background:var(--brand-primary);color:var(--on-brand)':''}"><i>${p.i}</i></span>
        <span class="post-who"><b>${p.mine?'You':p.a}</b><span>${p.w}</span></span>
      </div>
      <div class="post-t">${p.t}</div>
      <div class="post-b">${p.b}</div>
      <div class="post-f">
        <span class="post-act">${I.chat}<b>${p.r}</b> replies</span>
        <span class="post-act">${I.thumbsUp}<b>${p.k}</b></span>
        <span class="post-tal">${askChip('Help me reply to &ldquo;'+p.t+'&rdquo;','Ask Tal')}</span>
      </div>
    </div>`).join('')}
  </div>
  <p class="t-helper-01 mt5">Posting, replying and getting a reaction all earn points.</p>`;
}

/* page furniture */
function crumb(...parts){
  const last = parts.pop();
  return `<div class="crumb">${parts.map(([l,v])=>`<a data-go="${v}">${l}</a><span class="sep">/</span>`).join('')}<span>${last}</span></div>`;
}
/* A MODULE'S FRONT PAGE HAS NOWHERE TO GO BACK TO.
   The back arrow was drawn on any page with history behind it, which meant
   it appeared beside "My Level", "Points", "Cohort 41" — the destinations
   the rail itself takes you to. Back from one module lands you in another,
   and an arrow that means "the last module you were looking at" is not a
   back button, it is browser history wearing the page's chrome. The rail is
   how you move between modules and it is on screen at every width.

   Inside a module the arrow is exactly right and stays: Report is under My
   Level, an agent is under Interviews, a chapter is under Coursework, and
   from any of them there is a real parent to return to.

   THE TEST IS THE RAIL'S OWN LIST, not a hand-kept set of view names. A
   module's front page is precisely a page the rail can reach — plus Profile
   and Log out, which sit in the rail's foot rather than its body. Read off
   `NAVSETS` so a module added to the rail needs no edit here, and off the
   candidate's CURRENT set so a page that is not in the rail yet at this
   stage (Enroll before they are levelled) still offers the way back. */
const railRoots = () => {
  const set = NAVSETS[isLead() ? 'leader' : cfg(S.stage).nav] || [];
  return set.map(([k]) => k).concat(isLead() ? ['leadProfile'] : ['account']);
};
/* AND A PAGE MAY NAME ITS OWN PARENT.
   The rule above answers "is there somewhere to go back TO" with the history
   stack, which is right for a page you can only have reached by navigating.
   Two pages are not like that: the agent page and the booking confirmation
   are reachable from the stage picker and from a link, and on a page whose
   whole job is one transaction, arriving with an empty stack meant arriving
   with no way out at all — the crumb is a location, not a control, and at
   desktop the band hides it.

   `backTo` is the parent to fall back on, used ONLY when history is empty.
   With history the arrow still means "back", because that is the more
   useful answer when it is available and it is what the arrow means
   everywhere else in the product. */
const bk = (to) => (S.hist.length && !railRoots().includes(S.view))
  ? `<button class="ph-back" data-back="1" aria-label="Back">${I.arrowLeft}</button>`
  : to ? `<button class="ph-back" data-go="${to}" aria-label="Back">${I.arrowLeft}</button>` : '';
/* ==========================================================================
   `sub` IS FACTS, NOT A SENTENCE ABOUT THE PAGE — AND THAT IS A RULE NOW

   Tal's summary sits about six millimetres under this line (ai6.js builds it
   into the module head band), so these two are read as one block whether or
   not they were written as one. For a long time nineteen of them were a
   SENTENCE explaining the page, and the summary underneath explained the
   same page again, in a second voice. Profile said "Your details, your
   preferences, and what Tal is allowed to do" and Tal said "Your details,
   how you want to be contacted, and what Tal is allowed to do." Cohort said
   "Ten people at Explorer – E3, led by Priya Nair · week 5 of 13" and Tal
   said "Ten of you at E3 with Priya leading, week 5 of 13". Interviews
   managed it three times, because the plate below it carried the sentence as
   well. That is not two components each doing its job badly; it is one job
   done twice.

   THE SPLIT, and it holds both ways:

     `sub`  the page's factual spine, as a `&middot;` row — where this page
            sits in the product and in time. "Explorer Track – E3 · Cohort 41
            · week 5 of 13". Never a claim, never an explanation, no verb.
     Tal    the reading — what moved, what is open, what is on you. Prose,
            two sentences, and the only prose at the head of the page.

   AND WHERE THERE IS NO SPINE, THERE IS NO `sub`. Profile, Payments, Points
   before enrolment, What Tal knows, Practice — none of them has a location
   or a date to state, and inventing a sentence to fill the slot is what
   produced the duplication in the first place. `sub` is optional in the
   template on purpose: the title stands alone over Tal's sentence, which is
   the shape a person already reads everywhere else that a machine summarises
   something. Adding a description to a page that has a Tal summary means
   answering "what fact does this state that Tal does not" first.

   The auth screens are the exception and stay prose: they have no Tal card —
   `placePageSummary` bails on `.auth-card` — so there the description is the
   only thing that can say what the screen wants.
   ========================================================================== */
/* AND THE FACT ROW WEARS ITS OWN MARKS — ONE PER FACT, READ OFF THE FACT.
   `sub` is a `&middot;` row by the rule above: "Explorer Track – E3 · Cohort 41
   · week 5 of 13". Set as one grey string it is three facts a reader has to
   parse apart, and it was the weakest line in a band whose whole job is to be
   read first — the middots do all the work of separating four different KINDS
   of thing (a track, a level, a place, a date).

   A 16px mark in front of each one is what makes the row scan: the eye finds
   the calendar before it reads the week. Same argument, same table shape and
   the same first-match-wins order as `stepIcon` below — and for the same
   reason, DERIVED rather than declared: thirty-odd `ph()` calls across two
   portals state about ninety facts between them, and an `ic:` field on each is
   ninety edits now and the ninety-first forgotten later.

   TWO OR MORE PARTS, OR IT IS LEFT ALONE. The auth screens' descriptions are
   prose with no middot in them (see the note above), and a sentence with an
   icon in front of it is a callout, not a fact row. `.ph-facts` is the class
   §56 draws; a `sub` that does not split keeps the plain `<p>` every layer
   already styles.

   THE SEPARATOR STAYS AND MOVES TO CSS. With marks in the row the middots are
   no longer carrying the split on their own, but four facts with no divider at
   all read as one phrase — so §56 draws them as a `::after` on every fact but
   the last, which also means the row can drop them at a width where it wraps
   without the markup changing. */
const PH_IC = [
  [/re-?interview|interview/i,                        'video'],
  [/track|explorer|builder|trailblazer/i,             'growth'],
  [/cohort|candidates|members|others/i,               'group'],
  [/level|rung|\bE\d\b|not enrolled|enrolled|signed/i,'certificate'],
  [/quiz|score|of 100|average|%/i,                    'chart'],
  [/week|day \d|of 90|month|\bAug\b|\bNov\b|\bDec\b/i,'calendar'],
  [/minute|hour|\bmin\b/i,                            'time'],
  [/\$|paid|fee|price|refund/i,                        'wallet'],
  [/session|call|thread|message/i,                     'chat'],
  [/chapter|course|module|training/i,                  'book'],
  [/vetting|verif|identity|reference/i,                'shield'],
  [/certificate|award|badge|star/i,                    'trophy']
];
function factIcon(t){
  const s = String(t || '').replace(/&[a-z]+;|&#\d+;/gi, ' ');
  for(const [re,k] of PH_IC) if(re.test(s)) return I[k];
  return I.circle;
}
/* AND EACH FACT OPENS ON A CAPITAL, which 486:1084 draws and which is what a
   fact wearing its own mark asks for: with an icon in front of it the part
   stops being a clause in a sentence and becomes an item, and "explorer track"
   under a mark reads as a sentence that lost its beginning. Done here rather
   than in thirty `ph()` calls across two portals, for the reason the icon table
   is: one rule, and a fact added next week gets it for free. Only a letter is
   touched, so "$95 paid" and "&ndash; E3" are left exactly as written. */
const _cap = t => t.replace(/^([a-z])/, (m,c) => c.toUpperCase());
const phSub = sub => {
  const parts = String(sub).split(/\s*(?:&middot;|·)\s*/).map(s => s.trim()).filter(Boolean);
  if(parts.length < 2) return `<p>${sub}</p>`;
  return `<p class="ph-facts">${parts.map(t =>
    `<span class="ph-f">${factIcon(t)}<span>${_cap(t)}</span></span>`).join('')}</p>`;
};
function ph(title,sub,act,backTo){
  return `<div class="ph${act?' ph-has-act':''}">
    <div class="ph-main"><div class="ph-top">${bk(backTo)}<h1>${title}</h1></div>${sub?phSub(sub):''}</div>
    ${act?`<div class="ph-act">${act}</div>`:''}</div>`;
}
/* BEFORE THE INTERVIEW, THE SAME BAR — SEE §29.4
   This drew a three-column grid of the three tracks with "You are here" under
   one of them. The confirmed card next door drew the fifteen-level ladder, so
   one page had two drawings of one idea, and the grid was the one that could
   not show how far it is from here to the top.

   It draws the ladder now. The five levels of your own track are marked; NO
   level is filled, because the level is what the interview decides and a solid
   segment would be a claim the product has not made yet.

   Nothing replaces the grid's fact row. "Levels in this track" is what the five
   marked segments are showing, "your level" is what the sub already says, and
   "your track" is the card's own heading — a line restating all three under a
   bar that draws them is the grid's redundancy carried across in text. */
function trackBand(track){
  const T = ['Explorer','Builder','Trailblazer'];
  const ti = Math.max(0, T.indexOf(track));
  const lo = ti * 5;
  return `<div class="ladder ladder-track" role="img" aria-label="${track} track, levels ${lo+1} to ${lo+5} of 15. Your level is set at the interview.">
    ${Array.from({length:15},(_,i)=>`<i class="${i>=lo&&i<lo+5?'mine':''}"></i>`).join('')}
  </div>
  <div class="ladder-lab">${T.map(n=>`<span${n===track?' class="on"':''}>${n}</span>`).join('')}</div>`;
}
function ladder(cur,confirmed){
  const r = rungOf(cur);
  return `<div class="ladder">${Array.from({length:15},(_,i)=>`<i class="${i<r-1?'done':(i===r-1?'on':'')}"></i>`).join('')}</div>
  <div class="ladder-lab"><span>Explorer</span><span>Builder</span><span>Trailblazer</span></div>`;
}

/* THE STEP'S OWN ICON, READ OFF ITS LABEL. The panel drew five identical rings
   down its left edge, which told the reader nothing about the five steps: the
   mark was carrying done / now / next, and the rail and the "Step 1 of 5"
   caption two lines above it were already carrying that twice. So the mark
   carries the SUBJECT of a step you have not reached — a quiz is a score, an
   interview is a call, vetting is a check — and a step you have FINISHED keeps
   its tick, because "done" is the one thing a person reads a list like this
   for and a tick is the shortest way to say it. §33.7 carries the rest of the
   state in the mark's ground: brand behind the tick, accent behind the step you
   are on, a hairline in front of everything ahead.

   IT IS DERIVED, NOT DECLARED, and that is the whole reason it is affordable.
   Six `stepper()` calls in this file and one in `tn-agent-portal.html` list
   thirty-odd steps between them; an `ic:` field on each is thirty edits now and
   a thirty-first that gets forgotten later. FIRST MATCH WINS, so the order
   below is the argument: `/interview/` leads because it is the word in the most
   labels, `enrol` beats `90` because "Enroll and start your 90 days" is an
   enrolment rather than the course, and `report` sits with `level` because
   "Your level and report" is the level arriving. An unmatched label gets the
   plain dot — a confidently wrong icon is worse than a neutral one. */
const STEP_IC = [
  [/re-?interview|interview/i,                     'video'],
  [/vetting|background|reference|identity|verif/i,  'shield'],
  [/quiz/i,                                         'chart'],
  [/consultant|call/i,                              'chat'],
  [/level|report|rung|promot|certif/i,              'certificate'],
  [/enrol|cohort/i,                                 'group'],
  [/listing|payout|\bpay\b|fee|price|earn/i,        'wallet'],
  [/training|calibration|module|chapter|course|90/i,'book'],
  [/account|application|apply|profile|details/i,    'document'],
  [/book|slot|date|session/i,                       'calendar']
];
/* Entities first — labels here are written as HTML (`&middot;`, `&mdash;`) and
   `&d` inside `90-day` is not a word this test should see. */
function stepIcon(lab){
  const t = String(lab||'').replace(/&[a-z]+;|&#\d+;/gi,' ');
  for(const [re,k] of STEP_IC) if(re.test(t)) return I[k];
  return I.circle;
}

/* THE STEPS ARE OPEN, AND THAT IS THE WHOLE OF THIS COMPONENT NOW.
   §56 is where the argument is written down; what changes here is the markup.

   WHAT WENT. A meter (`.stp-rail`, four or five orange segments), a toggle
   ("All steps"), the dropdown panel it opened (`.stp-tw` / `.stp-all` /
   `.stp-pop` / `.pi`), and `.stp-now` — the one step you are on, printed under
   the meter because the other five were behind the button. Five drawings of one
   fact: the rail said "four of five", the caption said "Step 4 of 5",
   `.stp-now` named the fourth, and the panel listed all five with a tick
   against three of them. The head band has room to say it once, so it does:
   every step, in a row, marked.

   WHAT STAYED, AND WHY IT IS THE SAME NAMES. `.stp-top` is §24.4's header row
   (heading left, figure right) and `.stp-c` is its "Step n of m" caption — the
   count is the one thing a row of marks does not say, because "where am I in
   this" is a position and the marks are a picture. `.pi-lab` and `.pi-sec` are
   the step's own type roles from §11; a step's label is a step's label whether
   it is in a row or in a list.

   `id` AND `flush` ARE GONE FROM THE SIGNATURE. `id` was the key the open/shut
   state was held under (`S.piOpen`) and there is no state left to hold; `flush`
   set a class no layer has ever styled. Six call sites, all passing the same
   two dead arguments.

   NO INLINE `fill` — trap 1. The three states used to set it on the span, which
   beat every stylesheet at every specificity. §56 owns the mark's ink. */
/* THE STATE IN WORDS, UNDER THE LABEL. Three columns of one line each read as
   a list of five names with some colour on it; the second line is what makes
   the row a row — every column the same shape, every label on the same
   baseline, and the state said rather than only drawn. The mark is the picture
   and this is its caption, which is also the only version of the state a screen
   reader gets. It is the ROW's line: below 900 the step's own detail (`sec` —
   "Priya Nair · Thu, Aug 20") is the more useful second line and there is width
   for it, so §56 swaps them over. */
const STPS_W = {done:'Completed', on:'In progress'};

/* AND THE COUNT IS GONE WITH THE METER. 486:1084 draws the header row as the
   heading and nothing else, which is right for an open row: "Step 4 of 5" is a
   position, and a row of five marks with four of them marked IS that position,
   drawn. It was worth keeping while the steps were behind a button.
   `aria-current="step"` is what says it to a reader who cannot see the row. */
function stepper(steps, title){
  /* THE MARK KEEPS THE STEP'S SUBJECT AT EVERY STATE, so a column means the
     same thing whatever has happened to it and the row reads as five subjects
     rather than as three ticks and two pictures. §33.7b's dropdown swaps the
     icon for a tick, which is right in a list of five rows where "done" is what
     the reader came for; here the state is on the mark's own ground and in the
     word under the label, twice, so the icon is free to say what the step IS.
     `stepIcon` above is where the subject table and its argument live. */
  const mark = x => `<span class="stps-m">${stepIcon(x.lab)}</span>`;
  return `<div class="stp stp-open stp-titled">
    <div class="stp-top"><h2 class="u-h3">${title||'Your journey so far'}</h2></div>
    <ol class="stps">
      ${steps.map(x=>`<li class="stps-i ${x.st}"${x.st==='on'?' aria-current="step"':''}>${mark(x)}
        <span class="stps-b"><span class="pi-lab">${x.lab}</span>
          <span class="stps-st">${STPS_W[x.st]||'Upcoming'}</span>${
          x.sec?`<span class="pi-sec">${x.sec}</span>`:''}</span></li>`).join('')}
    </ol>
  </div>`;
}

/* ==========================================================================
   ONE JOURNEY, FOUR STEPS, AND IT ENDS WHERE THE COURSE BEGINS

   The six dashboards used to state their own step list, and they disagreed
   about how many steps the journey HAS: four on `new`, `booked` and
   `assessed`, five on the enrolled three, six on `consult`. So the section
   changed length as you moved through the product — five columns on Monday,
   four on Tuesday — and the same milestone was called three different things
   ("Your level and report", "Level confirmed", "Interview and level").
   Maryam's rule: it is always these four.

     Leadership quiz -> Interview and level -> Enrolled -> 90-day course

   THE LABELS ARE THE SPINE AND THE `sec` LINES ARE THE STAGE. What changes
   between stages is which step is `on` and what the detail line under each
   one says — "Not booked yet · 45 minutes" becomes "Priya Nair · Thu, Aug 20"
   becomes "E3 · confirmed Aug 21" as the same step is approached, held and
   passed. That is what a journey looks like: the road is fixed, your position
   on it moves.

   "RE-INTERVIEW" WAS A FIFTH STEP AND IS GONE — Maryam's cut, and the row is
   better for it in a way that is worth writing down. Four of the five steps
   are things that happen ONCE on the way in: you take the quiz, you are
   interviewed, you enrol, you do the 90 days. The re-interview is not on that
   road, it is the road turning back on itself — it is what the NEXT ninety
   days start from, and drawing it as the end of this journey said the ladder
   stops at E4. It also cost the row a fifth column, which is what broke
   "Re-interview" across its own hyphen at 99px.

   THREE STEPS WERE LOST BEFORE IT AND ALL THREE ARE STILL SAID. `consult`
   named "Account created" and "Consultant call" as steps of their own; the
   account is not a milestone of the LEADERSHIP journey (you cannot be on this
   page without one), and Jordan's call is what the second step's detail line
   says on that stage — plus the whole black card beside it. `promoted` named
   "Next course — E4" as a sixth; the E4 course has not started, Tal's summary
   says when it opens, and a step for it would be a promise on the section's
   part.

   AND ONLY FOUR STAGES REACH THIS FUNCTION NOW. The journey row stops at
   `assessed` — see the note over `wingBlock` below for what stands in its
   place once the course is running. `promoted`'s all-done row went with the
   fifth step; the `default` here is `assessed`'s so this can never hand
   `stepper` an undefined.
   ========================================================================== */
/* THE ENROLMENT CARD, AND ONE FUNCTION FOR THE TWO STAGES THAT DRAW IT.
   `assessed` and `promoted` are the same moment one level apart — a level has
   just been confirmed and no course has been started — so they get the same
   card, which is the argument `quizResults` makes for itself two hundred lines
   down and the reason those two pages did not drift before.

   IT IS THE PAGE'S DARK CARD, so §56 puts it in the head band's second column:
   the thing you would DO about everything above it, beside the reading of it.
   Both stages used to put the black LEVEL card there instead — a fifteen-rung
   ladder in a 300px column, which is the object §56's gate exists to keep out.

   EVERY FIGURE IS READ OFF `V.enrol`, none of them restated here: the course fee
   is its `Course fee` row, the chapter count and the cohort size are its `.stats`
   cells, and the thirteen assessments are one per chapter (`chRow`'s own "SCORE%
   assessment", and Course Progress's "assessments, all thirteen"). The credit
   and what is due today stay on that page, which is where the arithmetic belongs
   and where this button goes.

   NO `data-when`. That attribute is the plate's live figure — the distance to an
   APPOINTMENT — and enrolling has no clock. When the next cohort starts is Tal's
   sentence on both stages, two inches to the left. */
const enrolPlate = lvl => `<div class="sec">
      <div class="plate">
        <div class="plate-t">Enroll on Explorer &ndash; ${lvl}</div>
        <div class="plate-b">Course price <b>$690</b> &middot; 13 chapters, one a week &middot; 13 assessments, one per chapter &middot; A cohort of ten with a live leader</div>
        <div class="plate-a">
          <button class="btn btn-p btn-sm noic" data-go="enrol">Enroll now ${I.arrowRight}</button>
        </div>
      </div>
    </div>`;

const JRN = ['Leadership quiz','Interview and level','Enrolled','90-day course'];
function journey(){
  const row = (sts, secs) => JRN.map((lab,i) => ({st:sts[i], lab, sec:secs[i]}));
  /* the two steps nobody on these four stages has reached yet */
  const AHEAD = ['Locks in your cohort and your price','13 chapters, one a week'];
  const LEVELLED = row(['done','done','on',''],
    ['Explorer track &middot; Aug 12', 'E3 &middot; signed by Priya, Aug 21',
     'Not enrolled yet', AHEAD[1]]);
  switch(S.stage){
    case 'consult': return row(['done','on','',''],
      ['Explorer track &middot; Aug 3',
       'Jordan calls Thu, Aug 13 &middot; an agent sets your level', ...AHEAD]);
    case 'new': return row(['done','on','',''],
      ['Explorer track &middot; Aug 12', 'Not booked yet &middot; 45 minutes', ...AHEAD]);
    case 'booked': return row(['done','on','',''],
      ['Explorer track', 'Priya Nair &middot; Thu, Aug 20', ...AHEAD]);
    case 'assessed': return LEVELLED;
    default: return LEVELLED;
  }
}

/* ==========================================================================
   THE WING SAYS WHERE YOU ARE, AND "WHERE" MEANS THREE DIFFERENT THINGS

   §56 gives the head band's left column one status block between the fact row
   and Tal's sentence. For the first four stages that block is the journey: a
   row of four marks saying how far along the way IN you are. It was the same
   row on all eight dashboards, and on the last four it was answering a
   question nobody on those pages has — a candidate in week 5 of Cohort 41 does
   not need to be told that the quiz and the interview happened, and one who
   has been promoted does not need four ticks to be told the way in is behind
   them.

   So the wing changes with what there is to be somewhere IN. Maryam's rule:

     consult, new, booked, assessed   the journey        four steps, marked
     week1, day34, day90              the 90 days        `progressStrip`
     promoted                         the ladder         `ladder`, and next

   THE MIDDLE ONE IS THE PAGE'S OWN PROGRESS SECTION, MOVED, NOT COPIED. The
   enrolled dashboards drew `progressStrip` as a section of their own about two
   thirds down the page — the percentage, the thirteen chapter blocks and three
   figures. It is the exact shape the wing wants (a headline number, a rail, a
   row of facts) and it is the one thing on those pages that answers "where am
   I", so it moves up into the wing and the section it used to be is gone. Two
   drawings of one strip on one page would be the mistake §56 records for the
   meter and the current-step block.

   AND `promoted` GETS THE LADDER, WHICH IS THE ONLY PROGRESS A CANDIDATE
   BETWEEN COURSES HAS. There is no journey left to draw — every step of it is
   done — and no 90 days running to measure, so both of the blocks above would
   be full bars saying "finished", which is the least useful thing a status
   block can say. What has actually moved for this reader is their position on
   the fifteen-level ladder, and the RE-INTERVIEW is what moved it: the header
   states the level and names the re-interview that confirmed it, the ladder is
   the rail, and the three figures under it are the next climb rather than the
   last one. The last one is already the "Cohort 41, in the end" strip further
   down this same page, which is why none of these three repeats it.

   ALL THREE WEAR `.stp .stp-open .stp-titled`. That is the WING's block rather
   than the stepper's: §04 gives it the vertical rhythm, §24.4 gives `.stp-top`
   the header row, and §56.2 gives that row its 16 underneath. A second wrapper
   class for two blocks that want all four of those would be four rules
   restated. `.wing-prog` and `.wing-lvl` are the hooks §59 needs for the two
   things that genuinely differ — the strip's gutter and the ladder's track.
   ========================================================================== */
const wingHead = t => `<div class="stp-top"><h2 class="u-h3">${t}</h2></div>`;

/* THE STRIP INSIDE THE WING IS `progressStrip` UNTOUCHED. Everything it needs
   to change is a gutter, and a gutter is CSS — see §59.1. */
const progressWing = f => `<div class="stp stp-open stp-titled wing-prog">
    ${wingHead('Your 90 days so far')}
    ${progressStrip(f)}
  </div>`;

/* THE LADDER WING IS `progressStrip`'S OWN SHAPE WITH THE LADDER AS ITS RAIL —
   `.prog-top`, a rail, `.prog-figs` — so the three wings read as one component
   in three states rather than as three blocks that happen to share one slot.
   `ladder()` draws the fifteen levels and the three track names under them.

   THE FIGURES ARE FORWARD-LOOKING, and that is the point of them. Everything
   about the 90 days just finished is on this page already: the fact row says
   E4 and level 4 of 15, the achievement banner says the promotion, and "Cohort
   41, in the end" states the chapters, the average, the points and the level
   move as four cells. What no block on the page says is when the next course
   opens and what re-qualifying at E4 involves, which is the one open question
   a promoted candidate has. December 1 is `PAGESUM.promoted`'s own date and
   the chapter count is `CH`'s — neither is a new number. */
const ladderWing = f => `<div class="stp stp-open stp-titled wing-lvl">
    ${wingHead('Where you are on the ladder')}
    <div class="prog">
      <div class="prog-top">
        <div><div class="prog-pct">${f.level}</div>
          <div class="prog-l">confirmed at your re-interview</div></div>
        <div class="prog-day"><div class="prog-dn">${rungOf(f.level)}<small> of 15</small></div>
          <div class="prog-l">on the ladder</div></div>
      </div>
      ${ladder(f.level)}
      <div class="prog-figs">
        <span><b>Dec 1</b>next cohort opens</span>
        <span><b>${CH.length}</b>chapters at E4</span>
        ${''/* "then you re-interview" and not "to your next re-interview":
              §10.16 sets these labels at 10.5px uppercase in a third of the
              wing, and the longer wording ran to three lines while the two
              beside it took one, which stretched the whole row to fit it. */}
        <span><b>90 days</b>then you re-interview</span>
      </div>
    </div>
  </div>`;

function wingBlock(){
  const f = cfg(S.stage);
  if(f.complete) return ladderWing(f);
  if(f.enrolled) return progressWing(f);
  return stepper(journey());
}

/* ============================================================
   AUTH — stage: signup
   ============================================================ */
const AUTH_ART = `
<div class="auth-brand">
  <span class="auth-logo"><img src="${LOGO_K}" alt="TalentNext"></span>
  <div class="auth-intro">
    <h2 class="t-heading-01">Welcome to TALENTnext</h2>
    <p class="t-body-02">TalentNext is the AI-native leadership platform that assesses you in real conversation, compounds every interview, chapter and call into a live picture of where you stand, then moves you up the ladder a level at a time.</p>
    <p class="t-body-02">From here, growth stops being guesswork.</p>
    <p class="t-body-02 auth-begin">Let&rsquo;s begin.</p>
  </div>
  <p class="t-helper-01 auth-foot">&copy; 2026 TALENTnext Limited</p>
</div>
<i class="auth-mark" aria-hidden="true"></i>`;

/* THE IDENTITY PANEL — the orange block that says which account this screen is
   about. §57.4 draws it; Figma 483:976 puts it on "Create your account".

   ONE HELPER FOR EVERY SCREEN THAT NAMES AN ADDRESS, which is the whole reason
   it is a function. `create` and `verify` both had the same thing written out
   as a `.sec.sec-id` with an `.inp-static` in it — a label over a value,
   styled as a disabled field. That was the right shape when it was a field
   with the input taken away; it is the wrong one now, because the panel is not
   a field at all. Two copies of it would drift the first time one gained the
   way out and the other did not, which is exactly what happened to the two
   labels ("Your Email Address" on one, "Sent on" on the other).

   `back` IS OPTIONAL AND IT IS A VIEW NAME. Given, the panel carries "Not
   you?" pointing at it — on `create` that is `login`, because the way out of
   "this is the address we have" is to sign in as somebody else. On `verify` it
   is `create`, one step back to change the address before the code is spent.
   Omitted, the panel is a statement with no exit, which is what a screen that
   has already committed wants. */
const authId = (label, email, back) => `
  <div class="sec sec-id">
    <div class="auth-id">
      <span class="auth-id-l">${label}</span>
      <span class="auth-id-v">${email}${
        back ? `<a data-go="${back}">Not you?</a>` : ''}</span>
    </div>
  </div>`;

const AUTH = {
login: () => `${authShell()}
<main class="main"><div class="page form-page">
  ${ph('Log in','Enter the email address and password on your TalentNext account.')}
  <div class="sec sec-rule">
    <div class="f"><label for="lem">Email address</label>
      <input class="inp fill" id="lem" type="email" value="maryam.naz@tkxel.io"></div>
    <div class="f last"><label for="lpw">Password</label>
      <div class="pw-wrap"><input class="inp fill" id="lpw" type="password" value="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
        <button class="pw-eye" data-eye="lpw" aria-label="Show password">${I.view}</button></div></div>
    <p class="t-body-02 aux"><a data-go="forgot">Forgotten your password?</a></p>
  </div>
  <div class="sec sec-act">
    <div class="foot-row foot-stack"><div><button class="btn btn-p btn-full" data-go="stage:new">Log in ${I.arrowRight}</button></div><p class="t-body-02 mt5" style="color:var(--text-secondary)">Don&rsquo;t have an account? <a data-go="create">Sign up</a></p></div>
  </div>
</div></main>`,

forgot: () => `${authShell('login')}
<main class="main"><div class="page form-page">
  ${ph('Reset your password','Give us the email address on your account and we will send you a link to set a new password.')}
  <div class="sec">
    <div class="f last"><label for="fem">Email address</label>
      <input class="inp fill" id="fem" type="email" value="maryam.naz@tkxel.io"></div>
  </div>
  <div class="sec">
    <button class="btn btn-p btn-full" data-go="sent">Send the reset link ${I.arrowRight}</button>
    <p class="t-body-02 mt5" style="color:var(--text-secondary)">Remembered it? <a data-go="login">Back to log in</a></p>
  </div>
</div></main>`,

sent: () => `${authShell('forgot')}
<main class="main"><div class="page form-page">
  ${ph('Check your email','The link expires in 30 minutes and can be used once.')}
  ${''/* THE ADDRESS MOVES OUT OF THE SENTENCE AND INTO THE PANEL. It read "A
        reset link is on its way to maryam.naz@tkxel.io" — an address set in
        running prose, in the one line on the screen the reader skims, on the
        one screen whose entire purpose is "did we send it to the right
        place". The panel is where an address belongs on these screens now,
        and the description keeps the two facts prose is good at: how long the
        link lasts and that it works once.

        AND THE FOOTER LINE GOES WITH IT. "Wrong address? Change it and try
        again" was the same offer the panel's "Not you?" now makes, three
        inches lower, next to a "Send it again" button that is the other half
        of it. Two ways to say one thing is how a screen stops being read. */}
  ${authId('Sent to', 'maryam.naz@tkxel.io', 'forgot')}
  <div class="sec">
    <div class="note"><span>${I.info}</span><div class="nb"><b>Nothing yet?</b>Give it a minute, then look in spam. The sender is hello@talentnext.com.</div></div>
  </div>
  <div class="sec">
    <button class="btn btn-p btn-full" data-go="reset">Open the link ${I.arrowRight}</button>
    <div class="mt4"><button class="btn btn-g btn-full" data-go="sent">Send it again ${I.restart}</button></div>
  </div>
</div></main>`,

reset: () => `${authShell('login')}
<main class="main"><div class="page form-page">
  ${ph('Set a new password','Choose something you have not used here before. You will be logged in once it is saved.')}
  <div class="sec">
    <div class="f-row"><div class="f"><label for="rpw">New password</label>
      <div class="pw-wrap"><input class="inp fill" id="rpw" type="password" value="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
        <button class="pw-eye" data-eye="rpw" aria-label="Show password">${I.view}</button></div>
      <ul class="pw-rules">
        <li class="ok">${I.checkFilled}At least 12 characters</li>
        <li class="ok">${I.checkFilled}Upper and lower case</li>
        <li>${I.circle}One number or symbol</li>
      </ul></div>
    <div class="f last"><label for="rpw2">Confirm new password</label>
      <div class="pw-wrap"><input class="inp fill" id="rpw2" type="password" placeholder="Re-enter password">
        <button class="pw-eye" data-eye="rpw2" aria-label="Show password">${I.view}</button></div></div></div>
  </div>
  <div class="sec">
    <button class="btn btn-p btn-full" data-go="stage:new">Save and log in ${I.arrowRight}</button>
    <p class="t-body-02 mt5" style="color:var(--text-secondary)">Changed your mind? <a data-go="login">Back to log in</a></p>
  </div>
</div></main>`,

create: () => `${authShell()}
<main class="main"><div class="page form-page">
  ${ph('Create your account','You&rsquo;re one step away. Create your password to continue.')}
  ${authId('Your Email Address', 'maryam.naz@tkxel.io', 'login')}
  <div class="sec sec-rule">
    <div class="f-row"><div class="f"><label for="pw">Password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw" type="password" value="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
        <button class="pw-eye" data-eye="pw" aria-label="Show password">${I.view}</button></div>
      <ul class="pw-rules">
        <li class="ok">${I.checkFilled}At least 12 characters</li>
        <li class="ok">${I.checkFilled}Upper and lower case</li>
        <li>${I.circle}One number or symbol</li>
      </ul></div>
    <div class="f last"><label for="pw2">Confirm Password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw2" type="password" placeholder="Re-enter password">
        <button class="pw-eye" data-eye="pw2" aria-label="Show password">${I.view}</button></div></div></div>
  </div>
  <div class="sec sec-cbx">
    <div class="cbx-list">
      <label class="cbx"><input type="checkbox" checked><span class="box">${I.check}</span>
        <span class="txt">I accept the <a data-go="terms">Terms of Service</a> and <a data-go="terms">Privacy Policy</a>.</span></label>
      <label class="cbx"><input type="checkbox" checked><span class="box">${I.check}</span>
        <span class="txt">I consent to my interviews being recorded and transcribed.</span></label>
      <label class="cbx"><input type="checkbox"><span class="box">${I.check}</span>
        <span class="txt">Send me occasional product and course emails.</span></label>
    </div>
    </div>
  <div class="sec sec-act"><div class="foot-row foot-stack"><div class="mt6"><button class="btn btn-p btn-full" data-go="verify">Create Account ${I.arrowRight}</button></div><p class="t-body-02 mt5" style="color:var(--text-secondary)">Already have an account? <a data-go="login">Log in</a></p></div>
  </div>
</div></main>`,

terms: () => `${authShell('create')}
<main class="main"><div class="page" style="padding-bottom:0">
  <div class="tabs"><button>Terms</button><button>Privacy</button><button class="on">Data use</button><button>Cookies</button></div>
  <div class="ph" style="padding-bottom:var(--s05)">
    <div class="ph-top"><h1 class="u-h2">Data use notice</h1></div>
    <p class="t-helper-01" style="color:var(--text-helper);margin-top:var(--s03)">Version 3.1 · Effective July 1, 2026 · 4 min read</p>
  </div>
  <div class="sec"><div class="note"><span>${I.info}</span><div class="nb"><b>The short version</b>Your interview is recorded so your agent can write your report. You can ask for your level to be reviewed, and you can delete a recording at any time.</div></div></div>
  <div class="acc">
    <div class="acc-i on"><button class="acc-h"><span class="ttl">1. What we record</span><span class="chev">${I.chevDown}</span></button>
      <div class="acc-b"><p>Every interview and re-interview is recorded as video and audio, and transcribed so your agent can write your report. Recordings are stored for 24 months, then deleted. Your weekly cohort calls are not recorded.</p><p>You can request deletion of a specific recording at any time. Deleting the recording behind a confirmed level does not reverse the level.</p></div></div>
    <div class="acc-i"><button class="acc-h"><span class="ttl">2. Who sees your interview</span><span class="chev">${I.chevDown}</span></button>
      <div class="acc-b"><p>The agent who interviewed you, and the cohort leader who runs your course. Nobody else, unless you share your report yourself.</p></div></div>
    <div class="acc-i"><button class="acc-h"><span class="ttl">3. Your level and who sets it</span><span class="chev">${I.chevDown}</span></button>
      <div class="acc-b"><p>A talent agent sets your level from the interview and signs the report. At the end of each course your cohort leader decides whether you move up, hold or drop back, and records the reason.</p><p>You can ask for your level to be reviewed by a second agent.</p></div></div>
    <div class="acc-i"><button class="acc-h"><span class="ttl">4. Tal, your assistant</span><span class="chev">${I.chevDown}</span></button>
      <div class="acc-b"><p>Tal is the assistant inside your course. It can see your course progress, your chapter notes and your points so that it can help you with the material. Tal cannot see your one-to-one messages, your payment details, or other candidates' data.</p></div></div>
    <div class="acc-i"><button class="acc-h"><span class="ttl">5. What we never do</span><span class="chev">${I.chevDown}</span></button>
      <div class="acc-b"><p>We do not sell your data. We do not share your individual progress with an employer without your written instruction.</p></div></div>
    <div class="acc-i"><button class="acc-h"><span class="ttl">6. Your controls</span><span class="chev">${I.chevDown}</span></button>
      <div class="acc-b"><p>Profile holds every switch: pause Tal, ask for a level review, download everything we hold, delete a recording, or close your account.</p></div></div>
  </div>
  <div class="sec mt6"><button class="btn btn-g noic" style="padding-left:var(--s04)">${I.download} Download as PDF</button></div>
</div></main>
<div style="flex:none;border-top:1px solid var(--border-subtle-01);display:flex;gap:1px">
  <button class="btn btn-s noic" data-go="create" style="flex:1;max-width:none;justify-content:center">Back</button>
  <button class="btn btn-p noic" data-go="create" style="flex:1;max-width:none;justify-content:center">Accept</button>
</div>`,

/* THE SEAM MOVED. "Verify & Continue" used to land on the `new` stage, which
   opens by asking a four-second-old member to choose and pay a talent agent —
   the biggest decision on the ladder, put first. It lands on `consult` now:
   account created, a free fifteen-minute screening call already booked,
   nothing asked for. `new` is still reachable from the stage picker and from
   a returning log-in, which is what it has always described.

   A NOTE FOR THE NEXT PERSON TO ANNOTATE A VIEW: this was first written as an
   HTML comment inside the template literal below, and a backtick in the word
   `new` closed the literal — the whole bundle stopped parsing and the app
   rendered as an empty frame with nothing in the console, because the failure
   is at parse time. Reasoning about a template goes ABOVE it, in a JS comment,
   which build.py strips from the output anyway. */
verify: () => `${authShell('create')}
<main class="main"><div class="page form-page">
  <div class="ph"><div class="ph-main">
    <div class="ph-top"><button class="ph-back" data-go="create" aria-label="Back">${I.arrowLeft}</button><h1>Verify Your Email Address</h1></div>
    <p>Enter the 6 digits code sent to your email address.</p>
  </div></div>
  ${''/* THE SAME PANEL, AND THE LABEL CHANGES BECAUSE THE JOB DOES. On create
        the address is what you are setting a password for; here it is where
        the six digits went, and "Sent to" is the fact the reader needs to
        check before they go looking in a mailbox. "Not you?" steps back to
        create, which is the only place the address can still be changed
        before the code is spent. */}
  ${authId('Sent to', 'maryam.naz@tkxel.io', 'create')}
  <div class="sec sec-rule">
    <div class="sec-h"><h2 class="u-h2">Verification Code</h2></div>
    <div class="otp">${[7,5,2,8,9,1].map((d,i)=>`<input value="${d}" size="1" inputmode="numeric" maxlength="1" aria-label="Digit ${i+1}">`).join('')}</div>
  </div>
  <div class="sec sec-act"><div class="foot-row">
    <div class="mt6"><button class="btn btn-p btn-full" data-go="stage:consult">Verify &amp; Continue ${I.arrowRight}</button></div>
    <button class="btn btn-g btn-lead noic">${I.restart}<span>Resend Code in 0:40</span></button>
  </div></div>
</div></main>`,

created: () => `${authShell()}
<main class="main"><div class="page form-page">
  <div class="sec" style="padding-top:var(--s07)">
    <span style="display:block;width:32px;height:32px;fill:var(--support-success);margin-bottom:var(--s05)">${I.checkFilled}</span>
    <h1 class="t-heading-04" style="margin:0 0 var(--s03)">You are in</h1>
    <p class="t-body-02" style="margin:0;color:var(--text-secondary)">Welcome to TalentNext, Maryam. Your quiz result carried over, so you already know which track you are on.</p>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="t-label-01" style="color:var(--text-secondary)">Your track, from the quiz</div>
      <div class="t-heading-03 mt3">Explorer</div>
      <p class="t-body-01 mt4" style="margin:0;color:var(--text-secondary)">The quiz places you on one of three tracks. Your level inside that track is set by an interview with a talent agent.</p>
    </div>
  </div>
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>Meet Tal</h3></div>
      <div class="ai-body"><p>Tal knows your level and your course. Start here.</p></div>
      <div class="mt5" style="display:flex;flex-direction:column;gap:1px">
        ${['What happens in the interview?','How do I move up a level?','Which agent suits me?'].map(q=>
        `<button class="tile clk arrow band" data-go="stage:new">
          <span class="t-body-compact-01">${q}</span>
          <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg></button>`).join('')}
      </div>
    </div>
  </div>
  <div class="sec"><button class="btn btn-p" data-go="stage:new">Go to my dashboard ${I.arrowRight}</button></div>
</div></main>`
};

/* ============================================================
   VIEWS
   ============================================================ */
const V = {};

V.dashboard = (f) => {
  let body = '';
  /* ============================================================
     THE CONSULTANT CALL
     Wireframe: the "Consultant Call" frame. Redrawn in the product's own
     components rather than transcribed — same six facts, four existing
     parts.

     THE CALL IS THE SAME OBJECT AS THE OTHER TWO CALLS. There are three
     appointments in this product: the agent interview (`booked`), the weekly
     cohort call (`week1`..`day34`), and now the consultant screening. All
     three are "a named person, at a time, that you join" and all three are
     `.plate` — the black wall with a face, an eyebrow, a title, a line of
     detail and up to two actions. Drawing a fourth card for a third
     appointment would be three drawings of one idea, which is the mistake
     §29.4 records for the level card.

     WHAT THE EYEBROW CARRIES. The wireframe puts a "Booked" tag in the
     block's top-right corner. The plate has no tag slot and does not need
     one: `plate-eb` is where the other two calls say "Next up" and "Weekly
     call · in 2 days", so it says the state AND the distance here too.
     One line, in the place the component already keeps that line.

     "WHAT TO EXPECT" IS A TINTED BAND, NOT A BOX INSIDE THE PLATE. The
     wireframe nests a grey panel inside the call block. On black that would
     be a third tone inside a wall, and §25/§29 already establish the
     alternative: plate followed by `.sec.tint` joins flush, with no white
     strip and no rule between them. So the reassurance reads as the bottom
     half of the call block, which is what the wireframe was drawing.
     ============================================================ */
  if(S.stage==='consult') body = `
    ${ph('Hi Maryam','Explorer track &middot; quiz 64 of 100 &middot; no level yet')}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Welcome in &mdash; your result is saved</h3></div>
        <div class="ai-body"><p>Your quiz put you on the <b>Explorer track</b> from a score of 64. Jordan&rsquo;s call on Thursday is a 15-minute check-in &mdash; peer to peer, not an assessment. Nothing to prepare, and it does not set your level.</p></div>
        <div class="stp-wing">
          ${wingBlock()}
        </div>
        <div class="ai-foot">
          ${askChip('What happens on the consultant call?','What happens on the call?')}
          ${askChip('Show me my quiz results','Show my quiz results')}
          <span class="sp"><button class="ic" aria-label="Helpful">${I.thumbsUp}</button><button class="ic" aria-label="More">${I.overflow}</button></span></div>
      </div>
    </div>
    ${/* "BOOKED" WAS THE CARD SAYING WHAT THE CARD IS. A call with a person,
          a time and a Join button is booked; the word above it added nothing
          the four lines under it did not already say, and it was the only
          part of the eyebrow that was not the countdown. `data-when` carries
          the countdown on its own now — `placePlates` reads it and seats the
          title in the head row beside it (the note in ai5.js is where that
          is written down), so the card loses a row of label AND a row of
          heading and is the same six facts, closer together.

          AND "WHAT TO EXPECT" COMES INSIDE. It was a tinted band under the
          plate, joined flush to it by §25/§29 so the two already read as one
          block — which is the tell that they were one block being drawn as
          two. Everything in it is about this call: who Jordan is, what the
          fifteen minutes are like, what they do not decide. Inside the card,
          under a hairline, it is the second half of the thing it describes
          rather than a note about the thing above it. The tint band goes;
          nothing else on the page moves. */''}
    <div class="sec">
      <div class="plate" data-when="in 2 days">
        <div class="plate-who">${avatar(CONSULTANT,56)}
          <span class="plate-wb"><b>${CONSULTANT.n}</b><span>Talent consultant &middot; screens Explorer candidates</span></span>
        </div>
        <div class="plate-t">Your consultant call</div>
        <div class="plate-b">Thursday, August 13 at 2:00 PM ET &middot; 15 minutes, online</div>
        <div class="plate-a">
          <button class="btn btn-p btn-sm noic">Join call ${I.video}</button>
          <button class="btn btn-sm noic plate-b2" data-go="interviews">Add to calendar</button>
        </div>
        <div class="plate-x">
          <b>What to expect</b>
          <p>An initial screening, and a relaxed one &mdash; peer to peer, not an assessment. Jordan asks where you are and what you are after. It does not set your level: that comes later, from an agent interview, if you choose to go further.</p>
        </div>
      </div>
    </div>
    ${quizResults(qzTaken(), 'the interview decides it')}
    <div class="sec flat">
      <div class="sec-h"><h2>How this works</h2></div>
      <div class="acc">
        <div class="acc-i"><button class="acc-h"><span class="ttl">The quiz gives you a title</span><span class="chev">${I.chevDown}</span></button>
          <div class="acc-b"><p>Explorer, Builder or Trailblazer. It is the band you start in, and it came across with your account &mdash; you do not retake it.</p></div></div>
        <div class="acc-i"><button class="acc-h"><span class="ttl">The interview sets your level</span><span class="chev">${I.chevDown}</span></button>
          <div class="acc-b"><p>Each title has five levels, E1 to E5. A talent agent talks to you for forty-five minutes, confirms the level and signs a report. A quiz cannot do this and the consultant call does not either.</p></div></div>
        <div class="acc-i"><button class="acc-h"><span class="ttl">Every 90 days you can move up</span><span class="chev">${I.chevDown}</span></button>
          <div class="acc-b"><p>Your level opens the course built for it. 90 days later you re-interview, and you move up a level, hold where you are, or drop back one.</p></div></div>
      </div>
    </div>`;

  else if(S.stage==='new') body = `
    ${ph('Welcome back, Maryam!','Explorer track &middot; quiz 64 of 100 &middot; no level yet')}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>You&rsquo;re on the <b>Explorer track</b> from a quiz score of 64, but you have no level yet &mdash; that comes from a 45-minute interview. Three agents have a slot this week, $80 to $95.</p></div>
        <div class="stp-wing">
          ${wingBlock()}
        </div>
        <div class="ai-foot noline">
          <button class="btn btn-p btn-sm ic-l ai-do" data-go="agents">${I.calendar}Book an Interview</button>
          <span class="sp"><button class="ic" aria-label="Helpful">${I.thumbsUp}</button><button class="ic" aria-label="More">${I.overflow}</button></span></div>
      </div>
    </div>
    ${''/* THE ONE STAGE WHOSE BAND HAD NO CARD IN IT. Every other dashboard puts
          something in §56's second column — a call, an enrolment — and this one
          had the agent rail instead, three sections down. So the page's own
          next step was the only thing the head band did not say, on the stage
          whose entire job is that step.

          IT IS WHAT THE INTERVIEW IS, NOT WHEN IT IS. There is nothing booked
          yet, so the card has no `data-when` and no person on it; what it can
          carry is the four things a person wants before choosing an agent, and
          three of them are said nowhere else on this page. The rail below
          answers WHO and WHEN — faces, ratings, slots and prices — and this
          answers WHAT, which is why the two are not the same block.

          THE PRICE RANGE IS THE RAIL'S OWN, read off `AGENTS` (Lena $80,
          Priya $95) rather than restated: the same pair Tal's sentence quotes
          two inches to the left. If an agent's fee changes there, this line is
          the one place that has to change with it — the note over `AGENTS` is
          where that is written down.

          "Book an Agent" AND NOT "Book an Interview", which is the wording
          Maryam asked for and the more accurate of the two: the thing you do
          next is choose a person, and the rail it jumps to is a list of three
          people. Tal's own button above it keeps the other wording because it
          is Tal offering the step rather than the card naming it. */}
    <div class="sec">
      <div class="plate">
        <div class="plate-t">Your level interview</div>
        <div class="plate-b">45 minutes, recorded &middot; Real situations, not hypotheticals &middot; Your agent sets your level, E1 to E5 &middot; $80 to $95</div>
        <div class="plate-a">
          <button class="btn btn-p btn-sm noic" data-go="agents">Book an Agent ${I.arrowRight}</button>
        </div>
      </div>
    </div>
    <div class="sec">
      <div class="sec-h"><h2>Book your interview</h2><button class="btn btn-g btn-sm noic" data-go="agents">View All Agents</button></div>
      <p class="all-desc">Three agents assess Explorer candidates and have a slot inside seven days. Tal ordered them by how their past candidates progressed.</p>
    </div>
    <div class="rail-wrap">
      <div class="rail">${['priya','owen','lena'].map(k=>agentCardH(k)).join('')}</div>
    </div>
    ${''/* the quiz date is the stepper's, 12 Aug, not consult's 3 Aug */}
    ${quizResults(qzTaken(), 'the interview decides it')}
    ${''/* "DECIDED SO FAR" WAS HERE AND IS GONE, and it was the third telling of
          one fact. Two `.gcard`s said the track is Explorer and that a 90-day
          course follows — and the quiz block directly above already prints
          "Title given / Explorer / first of three tracks" as one of its four
          figures, while Tal's summary at the head of the page opens with "You're
          on the Explorer track from a quiz score of 64". `patch.py`'s note at
          line 3163 had already caught this section restating the card above it
          once before; this is the same section doing it again to the block that
          replaced that card.

          The two jumps it carried are not lost: both went to `level`, which is
          where "See full breakdown" and the rail's My Level both go.

          The page now ENDS on the quiz block, which is what `booked` already
          does — §10 gives a page's last child the frame's own edge, so the
          tinted block closes itself and needs no closing rule. */}`;

  else if(S.stage==='booked') body = `
    ${ph('Welcome back, Maryam!','Explorer track &middot; interview 20 August &middot; no level yet')}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>Your interview with <b>Priya</b> is in 6 days. Delegation is the question she asks most often &mdash; ten minutes of practice is usually enough. Your quiz scored 64; the interview is what sets your actual rung.</p></div>
        <div class="stp-wing">
          ${wingBlock()}
        </div>
        <div class="ai-foot">${askChip('Run a mock interview on delegation','Start the mock')}
          <span class="sp"><button class="ic" aria-label="Helpful">${I.thumbsUp}</button><button class="ic" aria-label="More">${I.overflow}</button></span></div>
      </div>
    </div>
    <div class="sec">
      <div class="plate">
        <div class="plate-who">${avatar(AGENTS.priya,56)}
          <span class="plate-wb"><b>Priya Nair</b><span>Talent agent &middot; assesses Explorer</span></span>
        </div>
        <div class="plate-t">Your level interview</div>
        <div class="plate-b">Thursday, August 20 at 6:30 PM ET &middot; 45 minutes, recorded</div>
        <div class="plate-a">
          <button class="btn btn-p btn-sm noic" data-call="iv">Join ${I.video}</button>
          <button class="btn btn-sm noic plate-b2" data-go="interviews">Reschedule</button>
        </div>
      </div>
    </div>
    ${''/* WHAT THE 45 MINUTES ACTUALLY ARE — AND IT COMES BEFORE THE QUIZ.
          The one thing this stage's page did not say. Everything on it was
          about the booking — who, when, how long — and nothing about what
          happens inside the call, which is the only question a person has
          between booking one and taking it. The copy is Maryam's.

          FIRST, BECAUSE IT IS THE ONLY THING AHEAD. The quiz is three months
          behind this reader and settled; the interview is on Thursday. Read in
          this order the page runs forwards — the card in the head band says
          when, this section says what it is and what to bring, and the quiz
          block closes on where the level came from. It was the other way round
          for one build, which put a finished score above the open appointment.

          ON THE CANVAS, WITH THE QUIZ BLOCK UNDER IT ON THE PANEL. Two sections
          in a row cannot both be filled or the page reads as panels all the way
          down, so one takes the ground and the other takes the canvas: a panel
          is §12's ground for "a section the reader treats as one object", which
          four figures under one heading are and a sentence-plus-strip-plus-list
          is not. The note over `quizResults` carries the argument for the pair.

          AND THE JOIN NEEDS NOTHING SAID ABOUT IT. While the panel was ABOVE
          this section the pair drew its boundary twice — a hairline and a change
          of ground — and a `.sec-notop` class in §56 subtracted the second.
          Reversed, neither section draws a rule at all (measured at 1280 and
          390: `border-top:0`, `::after:none` on both), because this one opens
          under the head band's own closing rule and the panel below it is its
          own top edge. The class went with the need for it.

          THE FOUR FACTS ARE A `.stats` STRIP, which is the component Maryam's
          card was drawing: `.stats` is a FIXED four-column grid, so Length,
          Format, Your report and Fee is the shape, one line each. The two facts
          a strip cannot hold — "real situations, not hypotheticals" and "their
          judgement, not a score" — are the character of the interview rather
          than figures about it, and they are the section's lede.

          NO MARKS ON ANY OF THE SEVEN. The four cells are LABELLED figures, so
          a chip in front of one is a third statement of the same thing; four of
          them turn a quiet strip into a row of objects. What to bring is three
          sentences, and they are counted rather than marked — `.cardrow-n` in
          §56.7 is the 20px slot, and the rows keep §02.10's rule under them
          because a list that is numbered is a list of items.

          THE AGENT IS "YOUR AGENT", NOT PRIYA. `bkStamp` (ai7) rewrites the
          hand-written mentions of the booked agent on this stage so a booking
          made inside Tal reads back correctly, and its note says a new surface
          naming the agent has to be added there. Written without a name, this
          needs no entry and cannot go stale — and the fee is the RANGE the rail
          shows ("from $80") for the same reason, since it is true of all three
          agents. The exact fee is on the plate above and on Payments.

          AND IT DOES NOT REPEAT THE BOOKING. Maryam's copy closes on "You are
          booked in for Thu 3 Sep · 14:00 with Dana Whitfield"; on this page the
          black card two inches up already states the agent, the day and the
          time, the fact row states the date a third time, and Tal's summary a
          fourth. The section says what the session IS and leaves when it is to
          the card that exists to say so. */}
    <div class="sec">
      <div class="sec-h"><h2>Your session, step by step</h2><button class="btn btn-g btn-sm noic" data-go="interviews">Interview details</button></div>
      <p class="all-desc">Your agent asks for real situations &mdash; what you actually did, not hypotheticals &mdash; and sets your level from what you describe. Their judgement, not a score.</p>
      <div class="stats">
        ${statCell('', `Length`, `45 minutes`, `one sitting`)}
        ${statCell('', `Format`, `Video`, `recorded, with a transcript`)}
        ${statCell('', `Your report`, `48 hours`, `your level, E1 to E5`)}
        ${statCell('', `Fee`, `From $80`, `credited to the course`)}
      </div>
      <div class="u-overline mt6">What to bring</div>
      <div class="tile-stack mt4">
        ${['One situation from the last three months that did not go well',
           'A decision you would make differently now',
           'Somewhere quiet &mdash; the transcript is part of the assessment'
          ].map((t,i) => `<div class="cardrow"><span class="cardrow-n">${i+1}</span>
          <span class="cardrow-b"><span class="cardrow-t">${t}</span></span></div>`).join('')}
      </div>
    </div>
    ${''/* on this stage the "what sets it" answer has a name and a date on it */}
    ${quizResults(qzTaken(), 'Priya sets it on 20 Aug')}`;

  else if(S.stage==='assessed') body = `
    ${ph('Welcome back, Maryam!','Explorer Track &ndash; E3 &middot; level 3 of 15 &middot; not enrolled yet')}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>Priya confirmed you at <b>E3 &mdash; rung 3 of 15</b>. Your growth areas are chapters 4 and 12. The next cohort starts within two weeks; enrolling locks in your spot and your price.</p></div>
        <div class="stp-wing">
          ${wingBlock()}
        </div>
        <div class="ai-foot"><a class="lk" data-go="enrol">See the cohorts</a></div>
      </div>
    </div>
    ${''/* THE CARD IN THE HEAD BAND'S COLUMN IS THE ENROLMENT, NOT THE LEVEL.
          §56 puts the page's one dark card beside the head, and on this stage
          the level card was it — a 15-rung ladder in a 300px column, which is
          the case §56's gate excludes by design. What belongs in that slot is
          the thing you would DO about everything above it, and on `assessed`
          that is enrolling: the level is confirmed, the report is signed, and
          the only step left in the journey row is step three.

          A `.plate`, because a plate is what this product draws for "the one
          thing to do next" and `placeDark` moves it into the column for free.
          It has no `.plate-who` — there is no person in an enrolment — so §47
          packs its text to the top, which is what the note there is for.

          EVERY FIGURE IS READ OFF `V.enrol`, none of them restated: the fee,
          the interview credit and what is due today are that page's three `.kv`
          rows, the chapter count and the cohort size are its `.stats` cells,
          and the thirteen assessments are one per chapter (`chRow`'s own
          "SCORE% assessment", and Course Progress's "assessments, all
          thirteen"). If any of those change, they change there.

          AND THE LEVEL CARD KEEPS ITS REPORT BUTTON AND LOSES ITS ENROL ONE.
          Two Enroll buttons 200px apart is the page offering one action twice;
          the card in the column is the louder of the two and the one the eye
          reaches first. */}
    ${''/* AND NO COUNTDOWN ON IT. `data-when` is the plate's live figure — the
          distance to an APPOINTMENT, which is why §15 draws it as a chip with a
          clock in it and why every other plate in the build has one. Enrolling
          is not an appointment: it has no time, and "IN 2 WEEKS" over the price
          read as a deadline on the offer. When the next cohort starts is Tal's
          sentence on this stage, two inches to the left ("The next cohort starts
          within two weeks"), where it is a fact rather than a clock. */}
    ${enrolPlate('E3')}
    ${''/* THE BLACK LEVEL CARD IS GONE FROM THIS PAGE, and it could not simply be
          moved down: `placeDark` (ai5) hoists any dark card on the page into the
          head band wherever the view puts it, so "further down" is not a place a
          `.lvl-hero` can be. The band already carries the one dark card this
          stage needs — the enrolment — and two of them stacked there made the
          head 900px tall on a page whose next section is the course.

          NOTHING IS LOST WITH IT. The fifteen-rung ladder is what `V.level`
          draws, at full width, with the report and the breakdown beside it; the
          fact it was stating here — "Explorer – E3, level 3 of 15, confirmed by
          Priya on 21 August" — is in the page's own fact row under the title,
          in the journey row's second step, and in Tal's summary. Its one jump,
          Read my report, is the "What the interview found" section's own head
          action two blocks below. */}
    <div class="sec">
      <div class="sec-h"><h2>What the 90 days cover</h2><button class="btn btn-g btn-sm noic" data-go="enrol">See the full course</button></div>
      <p class="all-desc">Thirteen chapters, one a week, with a live cohort call alongside each. Everything opens on enrolment.</p>
      <div class="ch-two">${CH.map((c,i)=>`
        <div class="ch ch-flat">
          <span class="ch-num">${String(i+1).padStart(2,'0')}</span>
          <span class="ch-b"><span class="ch-t">${c[0]}</span><span class="ch-s">${c[1]} min</span></span>
        </div>`).join('')}</div>
    </div>
    ${''/* AND WHY THOSE CHAPTERS, IMMEDIATELY UNDER THEM.
          The interview is the only thing that has happened to this candidate,
          and the page was showing its RESULT — a level, a black hero, a course
          — without a word of what was actually said in it. The digest goes
          here rather than higher up because its growth-areas line ends on
          "chapters 4 and 12", and the thirteen chapters are the block directly
          above: read in this order the course stops being a catalogue and
          becomes the answer to what Priya wrote down. Higher up, between the
          hero and the course, it would have been a third block about the
          level before the reader had been told what the level buys. */}
    ${''/* THE QUIET GROUND, `sec tint cards` — #F7F7F7 (§12) with §55's white
          head action. This block is the one thing on the page you READ rather
          than act on: it is Priya's write-up, and everything around it is a
          course to enrol on and a level to look at, which is §45's test. §55
          takes the head button white so it is not the only thing left in the
          block still the panel's colour, and §55.2 takes the rule off the
          block above — a change of ground is already the boundary. */}
    <div class="sec tint cards">
      <div class="sec-h"><h2>What the interview found</h2><button class="btn btn-g btn-sm noic" data-go="report">Read the full report</button></div>
      <p class="all-desc">The short version of Priya&rsquo;s write-up, signed 21 August. Your strengths, your growth areas and the scenes you kept sit behind it.</p>
      ${signedSummary(true)}
    </div>`;

  else if(f.complete) body = `
    ${ph('Welcome back, Maryam!','Explorer Track &ndash; E4 &middot; level 4 of 15 &middot; Cohort 41 closed')}
    ${achBanner()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>You moved from <b>E3 to E4</b> in 90 days &mdash; 13 chapters, ${f.avg}% average, ${f.mins.toLocaleString()} minutes of coursework. E4 opens December 1 with a new cohort. Delegation and coaching, your two growth areas, are chapters 3 and 9.</p></div>
        <div class="stp-wing">
          ${wingBlock()}
        </div>
      </div>
    </div>
    ${enrolPlate('E4')}
    ${''/* THE SAME TWO CHANGES AS `assessed`, ONE LEVEL UP — see the note over
          `enrolPlate`. The black level card and the ladder are gone from this
          page: `placeDark` hoists any dark card into the head band, so with the
          enrolment card already in the band's column the two were stacked there,
          and the fact the hero stated — "Explorer – E4, promoted from E3, rung 4
          of 15, signed 21 November" — is in the page's own fact row under the
          title, in the achievement banner directly below it, in the journey
          row's last step and in Tal's summary. `V.level` is where the ladder is
          drawn at the width it needs.

          THE CERTIFICATE KEEPS ITS BUTTON and the enrolment loses its second
          one: the card in the column is the Enroll action now, and the same
          action drawn twice 200px apart is the page offering one thing as two.
          `.btn-set` stays a section of its own rather than being absorbed —
          `placeLevelCards` (ai5) pulls a lone button row into the hero above it
          when there is one, and now there is not. */}
    <div class="sec"><div class="btn-set">
      <button class="btn btn-t" data-go="transcript">Download my certificate ${I.download}</button>
    </div></div>
    ${''/* THIS PAGE IS THE `assessed` PAGE AGAIN, ONE LEVEL UP.
          Both stages are the same moment — a level has just been confirmed
          and a course has not been started — so they were answering the same
          two questions, and only one of them was answering them. `assessed`
          says what the 90 days hold and what the agent actually wrote;
          `promoted` said neither, and went straight from the level to a
          points card. The two blocks below are that page's, with the
          re-interview's report rather than the first one's. */}
    <div class="sec">
      <div class="sec-h"><h2>What the 90 days cover</h2><button class="btn btn-g btn-sm noic" data-go="enrol">See the full course</button></div>
      <p class="all-desc">Thirteen chapters at E4, one a week, with a live cohort call alongside each. Everything opens on enrolment.</p>
      <div class="ch-two">${CH.map((c,i)=>`
        <div class="ch ch-flat">
          <span class="ch-num">${String(i+1).padStart(2,'0')}</span>
          <span class="ch-b"><span class="ch-t">${c[0]}</span><span class="ch-s">${c[1]} min</span></span>
        </div>`).join('')}</div>
    </div>
    ${''/* THE QUIET GROUND, `sec tint cards` — #F7F7F7 (§12) with §55's white
          head action. This block is the one thing on the page you READ rather
          than act on: it is Priya's write-up, and everything around it is a
          course to enrol on and a level to look at, which is §45's test. §55
          takes the head button white so it is not the only thing left in the
          block still the panel's colour, and §55.2 takes the rule off the
          block above — a change of ground is already the boundary. */}
    <div class="sec tint cards">
      <div class="sec-h"><h2>What the re-interview found</h2><button class="btn btn-g btn-sm noic" data-go="report">Read the full report</button></div>
      <p class="all-desc">The short version of Priya&rsquo;s write-up, signed 22 November off the 90 days you had just finished.</p>
      ${signedSummary(true, true)}
    </div>
    ${''/* AND THE COHORT CLOSES OUT IN FIGURES, NOT IN A CHART.
          The weekly-minutes chart lived here — thirteen stacked bars of how
          long you spent, week by week, on a course that is over. That is a
          chart you read WHILE you are behind on it; once the 90 days are
          closed the only questions left are what you finished, how well, and
          what it earned, and all four of those are one number each. The
          chart is still on Course Progress, which is where the week-by-week
          record belongs and which the heading links to. */}
    <div class="sec tint">
      <div class="sec-h"><h2>Cohort 41, in the end</h2><button class="btn btn-g btn-sm noic" data-go="transcript">Course Progress</button></div>
      <div class="stats">
        ${statCell(I.book, `Chapters`, `13<small>/13</small>`, `all finished`)}
        ${statCell(I.chart, `Average`, `${f.avg}<small>%</small>`, `assessments, all thirteen`)}
        ${statCell(I.trophy, `Points`, GAME.promoted.pts.toLocaleString(), `${GAME.promoted.badges} of 4 badges`)}
        ${statCell(I.growth, `Level`, `E3 &rarr; E4`, `up one, on 21 November`)}
      </div>
      <button class="score-link mt5" data-go="rewards">${scoreCard(GAME.promoted)}</button>
    </div>
    <div class="sec tint">
      <div class="sec-h"><h2>What changes at E4</h2></div>
      ${/* THE ACTION GOES TO THE END OF THE ROW IT BELONGS TO.
            Both of these were a heading, a line, and a button on a line of
            its own underneath — three rows for one offer, twice, in a block
            whose two halves are the same shape. There is a column and a
            half of empty tile to the right of each sentence and the button
            is the only other thing in the row, so that is where it goes:
            what changes on the left, what to do about it at the right-hand
            end, one row each. `.chgrow` is the shape; §24 draws it. */''}
      <div class="tile-stack">
        <div class="tile chgrow"><div class="chgrow-b"><h3>You can lead a cohort</h3>
          <div class="sub">Volunteer to lead any cohort below E4. It is recognition, not payment, and your request goes to the admin team.</div></div>
          <button class="btn btn-g btn-sm" data-go="transcript">Become a Cohort Leader ${I.arrowRight}</button></div>
        <div class="tile chgrow"><div class="chgrow-b"><h3>Your listing goes public</h3>
          <div class="sub">Your level and certificates become a shareable page. Nothing else on your profile is published.</div></div>
          <button class="btn btn-g btn-sm" data-go="account">Manage what is shown ${I.arrowRight}</button></div>
      </div>
    </div>`;

  else { /* enrolled: week1, day34, day90 */
    const g = GAME[S.stage];
    const stalling = S.stage==='day34';
    const dueRe = S.stage==='day90';
    /* THE ONE REQUIRED ACTION GOES ABOVE THE READING.
       On day 90 the re-interview is the only thing on this page that has a
       deadline: everything else — where you stand, the progress strip, the
       weekly chart — is a record of 90 days that are already over. It
       sat at the FOOT of that record, four blocks and a chart below the
       fold, which is the one place a due action cannot be. It sits directly
       under the achievement band instead, so the top of the page reads:
       here is what you just won, and here is the thing to do next.

       Order in the source is not order on the page: `talFirst` (below) lifts
       Tal's card to sit against the header, and `placeBand` in ai5.js then
       wraps the two into the module head. The plate lands after the band and
       after the achievement banner, which is where it is wanted. */
    const reBook = dueRe?`<div class="sec">
      <div class="plate">
        <div class="plate-eb">Due now</div>
        <div class="plate-t">Book your re-interview</div>
        <div class="plate-b">Your 90 days are complete. The re-interview decides whether you move up to E4, hold at E3, or drop back to E2.</div>
        <div class="plate-a"><button class="btn btn-p btn-sm noic" data-go="agents">Choose an agent ${I.arrowRight}</button></div>
      </div></div>`:'';
    body = `
    ${''/* `Welcome Back, Maryam!` until §56 made the header visible again on
          every stage — capital B and an exclamation mark on one of eight
          dashboards, which was invisible while the greeting inside Tal's
          summary was drawing the title. Same words as the other seven now. */}
    ${ph('Welcome back, Maryam!', f.finished?'Explorer Track &ndash; E3 &middot; Cohort 41 &middot; ninety days complete':`Explorer Track &ndash; E3 &middot; Cohort 41 &middot; week ${f.week} of 13`)}
    ${achBanner()}
    ${reBook}
    <div class="sec">
      <div class="ai-aura tile tight">
        <div class="ai-head">${talLabel()}<h3>${stalling?'Where you are stuck':dueRe?'Before your re-interview':'Getting started'}</h3></div>
        <div class="ai-body"><p>${stalling
          ?`Day ${f.day} of 90, week ${f.week}. You&rsquo;ve finished ${f.done} of 13 chapters, averaging ${f.avg}% &mdash; ${f.mins.toLocaleString()} minutes so far. But chapter 4 has been opened four times without finishing. The three furthest ahead in Cohort 41 had it done by now.`
          :dueRe?`All 13 chapters done in 90 days, ${f.avg}% average, ${f.mins.toLocaleString()} minutes total. Your growth areas were chapters 4 and 12 &mdash; and you passed both. Book your re-interview to have Priya assess whether you move up.`
          :`Day ${f.day} of 90. Chapter 1 &mdash; ${CH[0][0]} &mdash; unlocked today, ${CH[0][1]} minutes. Four of the ten in your cohort have already finished it. Nothing is assessed this week, so you can take it at your own pace.`}</p></div>
        <div class="stp-wing">
          ${wingBlock()}
        </div>
        <div class="ai-foot">${askChip(stalling?'Walk me through chapter 4':dueRe?'Prepare me for the re-interview':'What is chapter 1 about?',
          stalling?'Walk me through it':dueRe?'Prepare me':'Tell me more')}</div>
      </div>
    </div>
    ${/* NO EYEBROW ON THIS ONE. "Weekly call" over "Cohort … Session" was the
          same fact said twice — the title already names the thing — and the
          label was costing a whole row above the title on a card whose only
          real content is four short lines. `data-when` carries the distance
          in time instead of the old "label · when" eyebrow; `placePlates` in
          ai5.js reads it and, finding no label, seats the TITLE in the head
          row so the timer chip holds the opposite corner of the title's own
          line rather than of an empty one. The note there is where that is
          written down. */''}
    ${f.finished?'':`<div class="sec">
      <div class="plate" data-when="in 2 days">
        <div class="plate-who">${avatar(AGENTS.priya,56)}
          <span class="plate-wb"><b>Priya Nair</b><span>Cohort leader &middot; leads Cohort 41</span></span>
        </div>
        <div class="plate-t">Cohort Week 36 Session</div>
        <div class="plate-b">Thursday at 6:00 PM ET &middot; 9 others &middot; 60 minutes</div>
        <div class="plate-a">
          <button class="btn btn-p btn-sm noic" data-call="cohort">Join Call ${I.video}</button>
        </div>
      </div>
    </div>`}
    ${''/* THIS WEEK IS WHITE NOW, AND IT IS THE FIRST BLOCK UNDER THE CALL.
          `tint` is §12's mark for supporting material — the tone says "this
          is a note about the page, not the page". That was the wrong claim
          for the one block on this dashboard that holds the week's actual
          work and the way into the chapter, and it was reading as one:
          filled, it sat back while the points row above it sat forward.
          The hairlines either side already separate it, so nothing is lost
          by taking the ground away.

          Two rules in §32 are keyed on `.sec.tint` for this card — the block
          dividers and the ring track. They are left in place rather than
          deleted: they are the correct values IF this card is ever put back
          on a panel, and on white the base values they were stepping down
          from are what applies. */}
    ${''/* AND THE WAY IN IS THE SECTION'S OWN ACTION.
          The head row held "Coursework" — the module, not the work — while the
          chapter button sat inside the card four lines below it. Two routes
          into the same module, one general and one specific, with the general
          one given the more prominent position: a person on this dashboard
          wants chapter 4, and the rail already carries Coursework on every
          screen, so the generic route was a duplicate of the rail spending the
          section's action slot.

          One button, in the slot every other section on this page uses for
          "the thing this section is for" (`Where you stand` → View more), and
          it is the specific route. `weekCard` therefore no longer draws its
          own — see the note over `.wkc-go` there. */}
    ${f.finished?'':`<div class="sec">
      <div class="sec-h"><h2>This week</h2><button class="btn btn-p btn-sm" data-go="chapter:${f.open}">Open chapter ${f.open+1} ${I.arrowRight}</button></div>
      ${weekCard(f)}
    </div>`}
    ${''/* THE PROGRESS STRIP WAS HERE AND IS NOW THE HEAD BAND'S WING.
          It is the one block on this page that answers "where am I in the 90
          days", which is exactly the question §56's wing exists to answer, and
          it was doing it two thirds of the way down the page under the week
          card. `wingBlock` (above `V.dashboard`) is where it is drawn now, in
          the slot the journey row holds on the four stages before this one.
          Drawn in both places it would be the same percentage, the same
          thirteen blocks and the same three figures twice on one screen.

          THE WEEKLY CHART STAYS DOWN HERE, and the difference is worth a line:
          the strip is a POSITION (day 34 of 90) and belongs at the head with
          the rest of the page's state, while the chart is a RECORD, thirteen
          weeks of minutes, and is read after the work rather than before it. */}
    <div class="sec">
      <div class="tile" style="padding-top:var(--s05)">
        ${stackChart('wk',{title:'Time on the course',sub:'minutes each week',weeks:g.weeks,
          target:WEEK_TARGET,targetLabel:WEEK_TARGET+' min target'})}
      </div>
    </div>
    ${''/* POINTS, BADGES AND RANK GO LAST.
          This row sat third on the page, directly under the cohort call —
          which put the standing before the work, and pushed the week's own
          chapter below it. None of it is due, none of it moves your level
          (§ai6's rewards summary says so in as many words), and it is the
          one block here a person reads out of interest rather than need. So
          it closes the page instead of interrupting it, under the record of
          the 90 days that earned the number. */}
  ${g?`<div class="sec">
    <div class="sec-h"><h2>Where you stand</h2><button class="btn btn-g btn-sm noic" data-go="rewards">View more</button></div>
    ${standRow(g)}
  </div>`:''}
`;
  }
  return `<main class="main"><div class="page">${body}</div></main>`;
};

V.level = (f) => {
  const confirmed = !f.pred;
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'My Level')}
  ${''/* NO DESCRIPTION. The old pair named the page's three sections, which
        is the caption failure ai6's note opens with — and a `&middot;` spine
        of track and position, which is what replaced them first, turned out
        to be two thirds of Tal's own first sentence. This page's spine is
        DRAWN: the fifteen-rung ladder below is the position, and Tal says
        which rung and what moves it. See the note over `ph()`. */}
  ${ph('My Level')}
  <div class="lvl-hero">
    <div class="eb">${confirmed?(f.complete?'Promoted November 21 · signed by Priya Nair':'Confirmed August 21 · signed by Priya Nair'):'Your track, from the quiz'}</div>
    <div class="big">${confirmed?lvlName(f.level):f.track}</div>
    <div class="sub">${confirmed?'Level '+rungOf(f.level)+' of 15':'Your level is set at the interview'}</div>
    ${confirmed?ladder(f.level):trackBand(f.track)}
  </div>
  <!-- ONE WAY INTO THE REPORT, NOT THREE. A black primary button sat here
       saying "Read my full report", the signed card below it is itself a
       button to the same place, and that card closes with "Read the full
       report" as a link. Three controls, one destination, stacked. The two
       that belong to the card stay — the card IS the report's summary, so
       the way in reads off the thing it summarises — and the loose button
       above goes. The link at the foot of the card is where the reading
       ends, which is where the next step belongs. -->
  <div class="sec mt6">
    <!-- ONE CONTROL, AT THE FOOT. The card used to be a button — the whole
         block clickable, with a trailing arrow saying so — AND it closed with
         a link to the same place. Now that the link is a real button (§29.16)
         the card stops being one: two controls wrapping one destination is a
         click target inside a click target, and the arrow was the only thing
         announcing the outer one. The button says it better, and says it
         where the reading ends. -->
    ${confirmed?signedSummary(false, false, true):`<div class="tile bordered">
      <div class="ai-head"><h3>What the Explorer track means</h3></div>
      <div class="ai-body">
        <p>Explorer is the first of three tracks. It is for people who already lead work but not a whole function, and it covers the operating basics: rhythm, delegation, hard conversations and feedback.</p>
        <p>Your interview places you on one of five levels inside it, and that decides which course you take.</p>
      </div>
    </div>`}
  </div>
  ${!confirmed?`<div class="sec">
    <div class="note quiet note-act"><span>${I.info}</span><div class="nb"><b>A quiz cannot set your level</b>It only tells you your track. An interview with an agent sets the level, and your report follows within 48 hours.</div><button class="btn btn-p ic-l note-cta" data-go="agents">${I.calendar}Book your interview</button></div>
  </div>`:''}
  <!-- THE REFERENCE BLOCK SITS ON THE PANEL TONE. Everything above this on
       the page is about YOUR level; this is how the ladder works for
       everyone, which is supporting material — exactly what §12's second
       tone is for. It also ends the run of white blocks at the foot of the
       page, so the tone change is what separates it rather than one more
       hairline. -->
  <div class="sec flat tint">
    <div class="sec-h"><h2>How the ladder works</h2></div>
    <div class="acc">
      <div class="acc-i"><button class="acc-h"><span class="ttl">The three tracks</span><span class="chev">${I.chevDown}</span></button>
        <div class="acc-b"><p>Explorer (E1&ndash;E5), Builder (B1&ndash;B5), Trailblazer (T1&ndash;T5). Fifteen levels in one line. You do not jump tracks, you move up one level at a time.</p></div></div>
      <div class="acc-i"><button class="acc-h"><span class="ttl">Moving up</span><span class="chev">${I.chevDown}</span></button>
        <div class="acc-b"><p>Every course is 90 days. Once the 90 days are up you re-interview, and you move up a level, hold where you are, or drop back one.</p></div></div>
      <div class="acc-i"><button class="acc-h"><span class="ttl">Who decides</span><span class="chev">${I.chevDown}</span></button>
        <div class="acc-b"><p>A talent agent decides your level from the interview and signs the report. At the end of a course, your cohort leader decides whether you move up, hold or drop back, and writes the reason.</p></div></div>
    </div>
  </div>
</div></main>`;
};

/* ==========================================================================
   THE QUIZ RESULT — "See full breakdown" now goes somewhere of its own

   The button under "Quiz results" went to `level`, which is the page about
   the LADDER: a hero, fifteen rungs and how moving up works. None of the
   quiz is on it. So the one control in the product offering a breakdown
   landed on a page that does not contain one, and the four figures the
   reader had just pressed past were the whole of what they got.

   `PARENT` has had `result:'level'` in it since before this page existed —
   the slot was reserved and never filled. This fills it.

   WHAT THIS PAGE IS FOR, AND WHAT IT REFUSES TO SAY AGAIN. Everything on it
   is the quiz's own working: five bands with a score each, the three things
   the answers did well, the three they did badly, and which chapters address
   the two weakest. None of that appears anywhere else in the product.

   What it deliberately does NOT carry:

     THE FOUR FIGURES. Title given, quiz score, taken, level — that is
     `quizResults`, the block whose button brought you here, and restating it
     as the first thing on the destination is the "See full breakdown" of a
     breakdown you have already read. The `ph` fact row says the same three
     facts in one line because a page has to say where it sits.

     THE TITLE AS A HERO. `Explorer` set at 30px over "level to be confirmed"
     is `.lvl-hero` on My Level, one click away, and this page's own crumb
     starts there.

     "A QUIZ CANNOT SET YOUR LEVEL". `V.level` carries that note with a Book
     button, and the caption under the rose already says what the interview
     does with these five numbers. Two pages one click apart do not both get
     to make the point.
   ========================================================================== */

/* THE FIVE BANDS, AND THEY ARE THE ONLY PLACE THESE NUMBERS ARE WRITTEN.
   Tal reads them for the "what did the quiz say" answers; the rose draws
   them; the rows underneath list them; and `qzLow` derives the two the
   interview pushes on rather than anybody naming them twice. */
const SCORES = [['Decisiveness',78],['Delegation',41],['Directness',66],
                ['Coaching',38],['Composure',84]];
/* Two thresholds, one function, three words. Both the wedge's fill and the
   row's tag come out of here, so a band cannot be drawn solid and labelled
   Weak. */
const qzBand = v => v >= 70 ? ['s','Strong'] : v >= 50 ? ['m','Mixed'] : ['w','Weak'];
const qzLow  = (n) => SCORES.slice().sort((a,b) => a[1] - b[1]).slice(0, n || 2);

/* WHAT THE ANSWERS SHOWED, IN WORDS. Six phrases, and they are the QUIZ's
   reading — not Priya's. Priya's two paragraphs (`signedSummary`) come from
   forty-five minutes of examples with names and dates in them; these come
   from a hundred multiple-choice questions, and the page says so under its
   own heading. Keeping them apart is the point: the product's whole argument
   is that the second kind is worth paying for. */
const QZ_STR = ['Execution under pressure','Comfortable with ambiguity',
                'Holds a line under challenge'];
const QZ_DEV = ['Delegates too late','Avoids conflict until it escalates',
                'Coaches by telling'];

/* THE EDITORIAL MAP: a band, and the chapter built on it. It is the bridge
   from the quiz to the course and the one thing this page can say that no
   other page does.

   THE CHAPTER NUMBERS ARE DERIVED FROM `CH`, not written here, and that is
   what makes this agree with Priya's report: `signedSummary` says "Delegation,
   and coaching rather than fixing. Chapters 4 and 12 are built on exactly
   this", and looking the two titles up in `CH` gives 4 and 12. Written as
   numbers they would have been two more figures to keep in step; the earlier
   prototype mapped Coaching to Feedback That Lands and would have said 9. */
const QZ_CH = {
  Decisiveness:'Decisions Under Incomplete Information',
  Delegation:  'Delegation Without Drop-Off',
  Directness:  'Hard Conversations',
  Coaching:    'Coaching vs Fixing',
  Composure:   'Building Trust at Speed'};
function qzChapter(band){
  const t = QZ_CH[band], i = CH.findIndex(c => c[0] === t);
  return i < 0 ? null : {n:i + 1, t};
}

/* WHEN IT WAS TAKEN, ONCE. `quizResults` takes the date as an argument
   because each dashboard's stepper prints its own and the block cannot
   contradict the line above it — the note over that function is the long
   version. This is the rule behind those arguments, so the three call sites
   and this page read one function and cannot drift apart. */
const qzTaken = (long) => S.stage === 'consult'
  ? (long ? '3 August 2026'  : '3 Aug')
  : (long ? '12 August 2026' : '12 Aug');

/* --------------------------------------------------------------------------
   THE ROSE

   Five wedges from a common hub, each reaching out as far as its score. It is
   a bar chart bent into a circle, and the reason to bend it is that these
   five are not a sequence — there is no first band and no last one, and a row
   of five bars implies an order the quiz does not have.

   THE FILL CARRIES THE VERDICT, NOT A HUE. Solid ink for Strong, a hatch for
   Mixed, empty with a hairline for Weak — `qzBand`'s three words, drawn.
   Three greens or a traffic light would have said the same thing in colour,
   and colour is what this product spends on one accent and nothing else; a
   pattern also survives being printed, photocopied and read by somebody who
   does not separate red from green.

   THE RINGS ARE AT 25 / 50 / 75 / 100 so a wedge can be read against them
   without a scale down the side, and the hub holds the one number that is not
   a band: the quiz score itself.

   THE GEOMETRY IS THE EARLIER PROTOTYPE'S, unchanged — `quizRose` in
   tn-portals.html, where this chart was designed. What changed is every
   colour, the type, and that the legend is `.kv` rows rather than a private
   three-column grid.
   -------------------------------------------------------------------------- */
function quizRose(dims, score){
  const CX = 180, CY = 158, R0 = 36, R = 108, GAP = 1.4;
  const pol = (a,r) => [CX + r * Math.cos(a * Math.PI/180), CY + r * Math.sin(a * Math.PI/180)];
  /* one wedge: out along its first edge, round at its own radius, back in,
     and round the hub to close */
  const seg = (a0,a1,r) => {
    const [x0,y0] = pol(a0,R0), [x1,y1] = pol(a0,r), [x2,y2] = pol(a1,r), [x3,y3] = pol(a1,R0);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}L${x1.toFixed(1)} ${y1.toFixed(1)}`
      + `A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
      + `L${x3.toFixed(1)} ${y3.toFixed(1)}`
      + `A${R0} ${R0} 0 0 0 ${x0.toFixed(1)} ${y0.toFixed(1)}Z`;
  };
  const step = 360 / dims.length;
  const fill = v => ({s:'var(--chart-ink)', m:'url(#qzHatch)', w:'var(--layer-01)'})[qzBand(v)[0]];
  const rings = [25,50,75,100].map(p =>
    `<circle cx="${CX}" cy="${CY}" r="${(R0 + (p/100)*(R-R0)).toFixed(1)}" fill="none"
      stroke="var(--border-subtle-01)" stroke-width="1" stroke-dasharray="2 4"/>`).join('');
  const wedges = dims.map(([k,v],i) => {
    const a0 = -90 + i*step + GAP, a1 = -90 + (i+1)*step - GAP;
    return `<path d="${seg(a0,a1,R0 + (v/100)*(R-R0))}" fill="${fill(v)}"
      stroke="var(--chart-ink)" stroke-width="1.2"/>`;
  }).join('');
  /* the band's name outside the outer ring, its figure inside its own wedge —
     and the figure flips to white where the wedge under it is solid ink */
  const marks = dims.map(([k,v],i) => {
    const mid = -90 + i*step + step/2;
    const [lx,ly] = pol(mid, R + 21);
    const anchor = Math.abs(lx - CX) < 14 ? 'middle' : (lx > CX ? 'start' : 'end');
    const [vx,vy] = pol(mid, R0 + (v/100)*(R-R0) - 15);
    return `<text x="${lx.toFixed(1)}" y="${(ly+4).toFixed(1)}" text-anchor="${anchor}" class="qz-lab">${k}</text>
      <text x="${vx.toFixed(1)}" y="${(vy+4).toFixed(1)}" text-anchor="middle"
        class="qz-val${qzBand(v)[0] === 's' ? ' on' : ''}">${v}</text>`;
  }).join('');
  return `<div class="qz-rose">
    ${''/* THE VIEWBOX IS WIDER THAN THE CHART, and by a measured amount. The
          five band names sit 21px outside the outer ring and are anchored
          `start` or `end`, so the longest of them runs past the plot: at 162°
          COACHING ends at x=57 and reaches back to about -5, which an SVG
          clips at the viewBox edge. 32px of room each side is the longest
          label at 10.5px plus a little, and it is why the box is 424 wide for
          a 360-wide drawing. `CX` is unchanged, so no coordinate moves. */}
    <svg viewBox="-32 0 424 326" class="qz-svg" role="img"
      aria-label="Quiz bands: ${dims.map(([k,v]) => k + ' ' + v).join(', ')}">
      <defs><pattern id="qzHatch" width="6" height="6" patternTransform="rotate(45)"
        patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="var(--layer-01)"/>
        <line x1="0" y1="0" x2="0" y2="6" stroke="var(--chart-ink)" stroke-width="2"/></pattern></defs>
      ${rings}${wedges}
      <circle cx="${CX}" cy="${CY}" r="${R0}" fill="var(--layer-01)"
        stroke="var(--chart-ink)" stroke-width="1.2"/>
      <text x="${CX}" y="${CY-2}" text-anchor="middle" class="qz-mid">${score}</text>
      <text x="${CX}" y="${CY+14}" text-anchor="middle" class="qz-mids">of 100</text>
      ${marks}
    </svg>
    <div class="qz-key">
      ${dims.map(([k,v]) => { const [cls,word] = qzBand(v);
        return `<div class="kv"><span class="k"><i class="qz-sw ${cls}"></i>${k}</span>
          <span class="v">${v}<span class="tag qz-vd">${word}</span></span></div>`; }).join('')}
    </div>
    <p class="t-helper-01 qz-note">Each wedge reaches out as far as its score. The two shortest are what
      the interview probes hardest, and what the course spends most of its time on.</p>
  </div>`;
}

V.result = (f) => {
  const low = qzLow(2).map(([k,v]) => ({k, v, ch:qzChapter(k)}));
  const mark = (ic, kind, txt) =>
    `<div class="qz-row"><span class="qz-mk ${kind}">${ic}</span><span class="qz-t">${txt}</span></div>`;
  return `<main class="main"><div class="page">
  ${crumb(['My Level','level'],'Quiz result')}
  ${ph('Quiz result', `Explorer track &middot; 64 of 100 &middot; taken ${qzTaken(true)}`)}
  <div class="sec">
    <div class="sec-h"><h2>How you scored</h2></div>
    ${quizRose(SCORES, 64)}
  </div>
  ${''/* TWO LISTS UNDER ONE HEADING, and the heading is what stops them being
        read as Priya's. `.sig-l` is the label the report already uses for
        exactly this pair — §58 gives it full ink and 28px of air — and it is
        scoped to `.ai-body`, which is why the tile has one. */}
  <div class="sec">
    <div class="sec-h"><h2>What the quiz saw</h2></div>
    ${''/* THE SOURCE LINE IS THE TILE'S FOOT, NOT THE SECTION'S HELPER. At
          desktop §10.15 gives this section a 184px label column — it holds a
          `.tile`, which is not on the opt-out list — and "What the quiz saw"
          is already three lines in it. A second line of helper text under
          that put five lines of grey in a gutter beside a two-item list.
          `.ai-foot` is where `V.report` puts "Written by Priya Nair from your
          interview", which is the same sentence doing the same job: it says
          whose reading this is, at the end of the reading. */}
    <div class="tile">
      <div class="ai-body">
        <p class="t-label-01 sig-l">What you do well</p>
        ${QZ_STR.map(s => mark(I.checkFilled, 'ok', s)).join('')}
        <p class="t-label-01 sig-l">Where you lose ground</p>
        ${QZ_DEV.map(s => mark(I.growth, 'wa', s)).join('')}
      </div>
      <div class="ai-foot"><span class="t-legal-01" style="color:var(--text-helper)">From a hundred
        multiple-choice answers &mdash; not from an interview</span></div>
    </div>
  </div>
  ${''/* THE BRIDGE TO THE COURSE, and it is the reason this page exists rather
        than being two paragraphs on My Level. The two weakest bands are
        derived, their chapters are looked up in `CH`, and the action depends
        on whether anybody has interviewed you yet: unlevelled, the next step
        is the interview these two bands will be pushed on; levelled, the
        report is where they were pushed. */}
  <div class="sec tint">
    <div class="sec-h"><h2>Where the course picks this up</h2></div>
    ${low.map(b => `<div class="kv"><span class="k">${b.k} &middot; ${b.v}</span>
      <span class="v">${b.ch ? `Chapter ${b.ch.n} &middot; ${b.ch.t}` : 'Not on this course'}</span></div>`).join('')}
    <p class="t-helper-01 mt4">Your course opens at your level, and these two chapters are where the 90
      days spend the most time. The quiz cannot tell them apart from a bad afternoon &mdash;
      ${f.pred ? 'the interview is what does.' : 'the interview is what did.'}</p>
    <div class="mt5">${f.pred
      ? `<button class="btn btn-p" data-go="agents">Book your interview ${I.calendar}</button>`
      : `<button class="btn btn-g" data-go="report">Read your report ${I.arrowRight}</button>`}</div>
  </div>
</div></main>`;
};

V.report = (f) => `<main class="main"><div class="page">
  ${crumb(['My Level','level'],'Report')}
  <div class="lvl-hero">
    <div class="eb">${S.iv==='re'?'Re-interview · confirmed November 22':'Level interview · confirmed August 21'}</div>
    <div class="big">${lvlName(f.level)}</div>
    <div class="sub">Level ${rungOf(f.level)} of 15 on the Explorer track</div>
    ${ladder(f.level)}
  </div>
  ${''/* THE SCENES ARE THE SECOND BLOCK ON THE PAGE.
        First is the level card, which `placeDark` lifts into the module head
        band (trap 12) — so this is the first thing in the page proper, above
        the signature, the write-up and the actions. That order is the point:
        the page used to open on prose about the interview and put anything
        you could actually watch at the foot, under a recording block. There
        is no recording block any more (see `ivRow`), and the three scenes are
        the only thing here that shows the interview rather than describing
        it, so they go where the eye lands. */}
  <div class="sec sec-scene">
    <div class="sec-h"><h2>Scenes</h2><span class="t-helper-01">The three you kept</span></div>
    ${sceneRow(S.iv === 're' ? 're' : 'level')}
  </div>
  <div class="sec mt6">
    <div class="tile">
      <div class="row-lead">
        ${avatar(AGENTS.priya,40)}
        <div style="flex:1">
          <div class="t-heading-compact-01">Assessed and signed by Priya Nair</div>
          <div class="t-helper-01 mt3">August 21, 2026 · 45-minute interview</div>
        </div>
      </div>
      <div class="note mt5 band">
        <span style="fill:var(--icon-secondary)">${I.user}</span>
        <div class="nb"><b>Priya&rsquo;s note</b>&ldquo;She talks cautiously, but she has already run a reorganization and can explain every call she made in it. That is an E3, not an E2.&rdquo;</div>
      </div>
      <div class="mt5"><button class="btn btn-g" data-go="account">Ask for your level to be reviewed ${I.renew}</button></div>
    </div>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="ai-head"><h3>Strengths and growth areas</h3></div>
      <div class="ai-body">
        <p class="t-label-01 sig-l">Strengths</p>
        <p>You reason from consequence to people, not policy. You gave three examples where you changed a decision after listening, and each one had a date and a name attached.</p>
        <p class="t-label-01 sig-l">Growth areas</p>
        <p>You describe delegation as risk. Twice you took work back rather than let it land badly. Chapters 4 and 12 are built on exactly this.</p>
      </div>
      <div class="ai-foot"><span class="t-legal-01" style="color:var(--text-helper)">Written by Priya Nair from your interview</span></div>
    </div>
  </div>
  ${''/* WHAT WAS HERE: a "From this interview" block — a 45:12 recording plate
        with Watch, Read the transcript and Download — and, under it, the
        six-scene chooser with its checkboxes. Both are gone.

        The recording and the transcript are not screens in the candidate's
        flow any more; the note over `ivRow` is where that is written down.
        The chooser moved to the Interviews module, where it is the first
        thing you meet and it happens once, rather than being re-offered every
        time you open a report you have already settled. What this page shows
        of the interview is the three kept scenes, at the top.

        Tal's question stays, because it is about the LEVEL rather than about
        the recording, and it is now the last thing on the page rather than
        the caption on a block that no longer exists. */}
  <div class="sec">
    ${askChip('What does Explorer E3 mean in practice?','Ask Tal what E3 means')}
  </div>
  <div class="sec"><div class="btn-set">
    ${f.enrolled||f.complete?'':`<button class="btn btn-p" data-go="enrol">Enroll on Explorer Track &ndash; E3 ${I.arrowRight}</button>`}
    <button class="btn btn-t">Download report as PDF ${I.download}</button>
  </div></div>
</div></main>`;

/* --------------------------------------------------------------------------
   INTERVIEWS: THE HEADER STATES, IT DOES NOT ASK

   THE HEADER BUTTON IS GONE AND IT IS NOT COMING BACK. `ph()`'s third slot
   put "Choose an agent" beside the h1 on every stage but `booked`, which was
   wrong twice over:

   1. IT WAS OFFERED WHEN THERE IS NOTHING TO CHOOSE. On `assessed`, `week1`
      and `day34` the level interview has already happened and its report is
      the first thing further down the page — the row that says "Confirmed
      Explorer – E3". Asking someone thirty-four days into a course to choose
      an agent is offering them the step they finished last month. On
      `promoted` it is worse: the page is a two-row history and nothing is due
      at all.
   2. WHERE IT IS DUE, A BUTTON IS THE WRONG SIZE FOR IT. On `day90` booking
      the re-interview is the one thing with a deadline, and the dashboard
      already draws that: `reBook`, the black `.plate` — eyebrow, title, the
      sentence about E4/E3/E2, one accent action. A 40px button in the corner
      of a header was carrying the weight of a whole block.

   So the header takes copy only, and a stage that has something due says so
   in the plate. `placeDark` (ai5) then lifts it into the module head band,
   which is what makes this page's top read exactly like the dashboard's — the
   plate is a page child, and the band is where a dark card lands.

   THE TWO STAGES THAT HAVE SOMETHING DUE are the two ends of the arc: no
   interview yet (`pred`, and not already booked), where the level interview
   is the way in; and 90 days done (`reinterview`), where the re-interview
   is. Everything between them has a level and a report, and the way to book
   another conversation from those stages is Tal — "Book an interview with a
   top agent" is in the ask bar on every one of them.
   -------------------------------------------------------------------------- */
V.interviews = (f) => {
  const booked = S.stage==='booked';
  const dueRe = !!f.reinterview;
  const dueFirst = !!f.pred && !booked;
  const due = dueRe || dueFirst;
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Interviews')}
  ${''/* THE SPINE, NOT THE SENTENCE — see the note over `ph()`. All four of
        these were descriptions of the page, and the last one was the plate's
        own paragraph forty pixels below said in different words. What is
        left states where the candidate is in the one sequence this module is
        about, and Tal's summary does the counting. */}
  ${ph('Interviews','45 minutes, by video &middot; recorded &middot; sets your level')}
  ${due?`
  <div class="sec">
    <div class="plate">
      <div class="plate-eb">${dueRe?'Due now':'Next step'}</div>
      <div class="plate-t">${dueRe?'Book your re-interview':'Book your level interview'}</div>
      <div class="plate-b">${dueRe
        ?'Your 90 days are complete. The re-interview decides whether you move up to E4, hold at E3, or drop back to E2.'
        :'Forty-five minutes by video with the agent you pick. It sets the level you enroll at, and the report is yours to keep.'}</div>
      <div class="plate-a"><button class="btn btn-p btn-sm noic" data-go="agents">Choose an agent ${I.arrowRight}</button></div>
    </div>
  </div>`:''}
  ${''/* CHOOSING THE SCENES IS THE FIRST THING IN THE MODULE, AND ONLY ONCE.
        The level interview is done, six scenes are cut from it, and the
        candidate keeps three. It opens the module rather than sitting below
        the history because it is the one thing on this page that is waiting
        on them — and it disappears the moment they save, which is why
        `sceneDone` and not the stage is the condition. Everything else on the
        module is still underneath it; nothing is hidden while choosing.

        NOTHING HERE SAYS WHERE THE SIX CAME FROM. Not the agent, not the
        platform. The moment the copy names a sender, the choice reads as
        approving somebody else's shortlist rather than picking your own
        three, and the sentence a person needs is the one about what happens
        to the three — see the note over `SCENES`. */}
  ${(f.enrolled||f.complete||!f.pred) && !sceneDone('level')?`
  <div class="sec">
    <div class="sec-h"><h2>Choose your scenes</h2></div>
    <p class="t-body-01 mb5" style="color:var(--text-secondary)">Six moments were cut from your interview. Keep the three you would be happy for someone to watch &mdash; they are what shows on your interview from now on, and you can play any of them first.</p>
    ${scenePick('level')}
  </div>`:''}
  ${''/* PAST INTERVIEWS IS A VERTICAL BLOCK. §10.15 gives a `.sec` with a
        `.sec-h` a 184px label column at desktop, which put "Past interviews /
        Kept for 24 months" in a narrow gutter beside the rows and set the
        heading three words to a line. The section's contents decide the
        opt-out (trap 13) and `.ivlist` is now in §10.15's list, so the
        heading sits above the rows and the rows take the column. */}
  ${(f.enrolled||f.complete||!f.pred)?`
  <div class="sec">
    <div class="sec-h"><h2>Past interviews</h2><span class="t-helper-01">Kept for 24 months</span></div>
    <div class="ivlist">
      ${f.complete?ivRow('re','Re-interview','November 21, 2026','Promoted to Explorer &ndash; E4','44:06'):''}
      ${ivRow('level','Level interview','August 20, 2026','Confirmed Explorer &ndash; E3','45:12')}
    </div>
  </div>`:''}
  ${booked?`
  <div class="sec">
    <div class="sec-h"><h2>Scheduled</h2></div>
    <div class="tile">
      <div class="kv"><span class="k">Agent</span><span class="v">Priya Nair</span></div>
      <div class="kv"><span class="k">When</span><span class="v">Thu, Aug 20 · 6:30 PM ET</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Paid</span><span class="v n">$95 · Visa ending 4242</span></div>
    </div>
    <div class="btn-set mt5">
      <button class="btn btn-p" data-call="iv">Join the interview ${I.video}</button>
      <button class="btn btn-t">Add to calendar ${I.calendar}</button>
      <button class="btn btn-t" data-go="agents">Reschedule or cancel ${I.time}</button>
    </div>
    <p class="t-helper-01 mt4">Free to reschedule up to 24 hours before. Inside 24 hours the fee is not refundable.</p>
  </div>`:`
  ${''/* THE FOUR FACTS ARE THE HEAD OF "HOW IT WORKS", NOT A BAND ABOVE IT.
        They were their own headingless section — a bordered strip of Length,
        Format, Your report, Fee sitting between the past interviews and the
        four steps, belonging to neither. Every one of the four is answered
        again in the steps underneath it: "Forty-five minutes by video" is
        step 2, "Within 24 hours, signed by" is step 3, and the fee is the
        thing step 1 sends you to the agent list to compare. So the band was
        the same four answers stated twice, once without a heading.

        Under the heading it becomes the summary of the thing the steps then
        walk through — the shape every other module on this product uses for a
        figure band, and the shape §10.15's opt-out list already expects: a
        `.sec` holding `.facts` keeps the full column and puts its heading
        above, so nothing had to be added for this to sit right.

        §37.16 is the spacing between the two halves; §10's `.facts` keeps its
        own top and bottom rule, which it only gives up as an `:only-child`
        and is not one any more. */}
  <div class="sec">
    <div class="sec-h"><h2>How it works</h2></div>
    <div class="facts">
      <div><span class="l">Length</span><span class="v">45 minutes</span></div>
      <div><span class="l">Format</span><span class="v">Video, recorded</span></div>
      <div><span class="l">Your report</span><span class="v">Within 24 hours</span></div>
      <div><span class="l">Fee</span><span class="v">From $80</span></div>
    </div>
    <ol class="steps">
      <li><span class="s-n">1</span><span class="s-b"><b>You choose the agent</b>
        Every agent who assesses your track is listed with their next free slot. You pick who you talk to.</span></li>
      <li><span class="s-n">2</span><span class="s-b"><b>You have the conversation</b>
        Forty-five minutes by video. Your agent walks you through real situations from your own answers and asks what you did and why. There is nothing to revise and no way to fail it.</span></li>
      <li><span class="s-n">3</span><span class="s-b"><b>Your agent writes your report</b>
        Within 24 hours, signed by the person who interviewed you: your strengths, your growth areas, and the level they have confirmed you at.</span></li>
      <li><span class="s-n">4</span><span class="s-b"><b>The report is yours</b>
        It stays in your account and you decide who ever sees it. Your level opens the course built for that level.</span></li>
    </ol>
  </div>
`}
</div></main>`;
};

V.agents = (f) => `<main class="main"><div class="page">
  ${crumb(['Interviews','interviews'],'All agents')}
  ${ph(f.reinterview?'Choose an agent for your re-interview':'Choose an agent','3 agents at your level &middot; 45 minutes, by video &middot; recorded')}

  <div class="sec" style="padding-bottom:var(--s05)">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>Suggested for you</h3></div>
      <div class="ai-body"><p>3 of 24 agents assess ${f.pred?'Explorer candidates':'at your level'} and have a slot inside seven days. They are ordered by how their past candidates progressed.</p></div>
    </div>
  </div>

  <div class="rail-wrap">
    <div class="rail">${['priya','owen','lena'].map(k=>agentCardH(k)).join('')}</div>
  </div>

  <div class="sec">
    <div class="hd-srch">
      <div class="hd-srch-t">
        <div class="sec-h"><h2>All agents</h2></div>
        <p class="all-desc">Select an agent from whom you want to be interviewed.</p>
      </div>
      <div class="srch all-srch">
        <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
        <input class="inp" placeholder="Search all 24 agents" aria-label="Search agents">
      </div>
    </div>
  </div>

  <div class="rail-wrap">
    <div class="rail rail-all">${['priya','owen','lena','samuel','hana','priya'].map(k=>agentCardH(k)).join('')}</div>
  </div>
</div></main>`;

V.agent = (f) => {
  const a = AGENTS[S.agent||'priya'];
  const slots = ['9:00 AM','11:30 AM','2:00 PM','4:30 PM','6:30 PM','8:00 PM'];
  return `<main class="main"><div class="page">
  ${crumb(['Interviews','interviews'],['All agents','agents'],a.n)}
  ${''/* THIS PAGE HAD NO HEADER AND THEREFORE NO WAY BACK.
        It opened straight onto the agent's face, with a breadcrumb above it
        as the only route out — and a crumb is a location, not a control you
        reach for. Every other page under a module carries `ph`, and `ph`
        draws the back arrow itself (`bk`, above: history exists and this is
        not a rail root, so the arrow is drawn). Adding the header is what
        adds the way back; it is not a second thing.

        "Book <name>", not the name alone, because the crumb directly above
        already says the name and the page is not a profile — you arrive on
        it having chosen, and everything on it is in service of picking a
        time. The heading is the verb the page is for.

        It also gives the page a module head: `placeBand` in ai5 keys on the
        presence of a `.ph`, so with one here Tal's summary lands in the band
        against the title, the way it does on every other page, instead of
        being built as a loose card in the body. */}
  ${''/* NO DESCRIPTION. Tal's summary on this page IS the agent's figures —
        band, interviews run, rating, price, next slot — so a `&middot;` row
        of the same numbers would be the duplication the note over `ph()` is
        about, and "Everything about this agent, and the times they have
        open" was a caption for the page. The title names the person and Tal
        states the facts. */}
  ${ph('Book ' + a.n, null, null, 'agents')}
  <div class="sec" style="padding-top:var(--s05)">
    <div class="agid">
      ${avatar(a,96)}
      <div class="agid-b">
        <div class="agid-n">${a.n}</div>
        <div class="agid-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span><span class="agid-iv">&middot; ${a.ivs} interviews</span></div>
        <div class="agid-c"><span>Assesses ${a.range}</span><span class="agid-v">${I.checkFilled}Verified</span></div>
      </div>
    </div>
    ${a.bio?`<p class="agid-bio">${a.bio}</p>`:''}
    <div class="mt5 kv-bands">
      <div class="kv"><span class="k">Interview fee</span><span class="v">${a.price}</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Report turnaround</span><span class="v n">Within 24 hours</span></div>
    </div>
  </div>
  ${''/* TWO TAL CARDS ON ONE PAGE, AND THE SECOND ONE WENT.
        This page carried a hand-written "What to expect with <name>" card
        from before ai6 existed. ai6 then gave the page a summary of its own
        — and that summary already opens with what this agent is like to be
        interviewed by, in the agent's own words, because §ai6's `agent`
        entry quotes the bio. So the page said "Tal" twice above the fold,
        in two different chip styles, before it had said the agent's name
        once. The summary is the one that stays: it is the treatment every
        other page uses and it sits in the header rather than in the body.

        The practice-interview chip went with the card. It is not lost — the
        composer at the foot of the page carries this page's suggestions
        (§ai4 keys them off the view), and "Run a mock interview with me" is
        one of them. */}
  <div class="sec">
    <div class="sec-h"><h2>Pick a slot</h2><span class="t-helper-01">Times in ET</span></div>
    <div class="daystrip">
      ${[['Wed',19],['Thu',20],['Fri',21],['Mon',24],['Tue',25]].map(([d,n],i)=>
        `<button class="day ${i===1?'on':''}"><div class="d">${d}</div><div class="n">${n}</div></button>`).join('')}
    </div>
    <div class="slots">${slots.map((t,i)=>
      `<button class="slot ${i===4?'on':''}" ${i===0||i===5?'disabled':''}>${t}</button>`).join('')}</div>
    <p class="slots-note">Two other candidates are looking at Thursday. Slots are held for 10 minutes once you continue.</p>
  </div>
</div></main>
<div class="stickybar">
  <div class="sb-b">
    <span class="sb-when">Thu, Aug 20 &middot; 6:30 PM</span>
    <span class="sb-price">${a.price}</span>
  </div>
  <button class="btn btn-p sb-go" data-go="booking">Continue to payment ${I.arrowRight}</button>
</div>`;
};

/* THE CONFIRMATION IS A RECEIPT, AND A RECEIPT IS SHORT.
   Four changes, all the same argument — this page is read once, immediately
   after paying, to check that what happened is what was meant to happen:

   1. IT HAS A HEADER AND A WAY BACK. It opened on a green note with no title
      and no control, which is a page you can only leave by the rail. The
      parent is Interviews, named explicitly, because you can land here from
      the stage picker with an empty history (see `bk`).
   2. TAL'S PREPARE CARD IS GONE. Two mock-interview offers and a paragraph
      about growth areas, thirty seconds after paying — the thing to do next
      is nothing, and §ai6's summary for this page says exactly that
      ("Nothing is expected of you before the day"). Preparation belongs on
      the `booked` dashboard, which is where the same offer already lives and
      where a person actually is when they come back to prepare.
   3. THE AGENT GETS A FACE. She was the value of the row labelled "Agent" in
      a list of four facts, between the date and the card number. You have
      just paid $95 to spend 45 minutes with a specific person; her name and
      picture lead the card, in the same `row-lead` the report uses to say
      who signed it, and the fact row goes because the card now says it.
   4. ADD TO CALENDAR AND RESCHEDULE ARE GONE. Both the note above and the
      page summary say the invite is already in the reader's email, so the
      calendar button offers what has happened. Rescheduling is a real thing
      to want and it has a real home — Interviews — which the back arrow now
      goes to; offering it here puts "change this" beside "this is done". */
V.booking = (f) => {
  const a = AGENTS[S.agent||'priya'];
  return `<main class="main"><div class="page">
  ${''/* "Everything about it is on this page" is the page describing itself,
        and the `.note` directly below already announced the booking, and Tal
        above it announced the booking a third time. The note is the one that
        keeps it — it is the confirmation banner — so the title carries the
        rest. */}
  ${ph('Booking Details', null, null, 'interviews')}
  <div class="sec" style="padding-top:var(--s06)">
    <div class="note succ"><span>${I.checkFilled}</span><div class="nb"><b>Interview booked</b>Thursday, August 20 at 6:30 PM ET with ${a.n}. A calendar invite and joining link are in your email.</div></div>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="row-lead">
        ${avatar(a,40)}
        <div style="flex:1">
          <div class="t-heading-compact-01">${a.n}</div>
          <div class="t-helper-01 mt3">Talent agent &middot; assesses ${a.range}</div>
        </div>
      </div>
      <div class="kv mt5"><span class="k">When</span><span class="v">Thu, Aug 20 · 6:30 PM ET</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Paid</span><span class="v n">${a.price} · Visa ending 4242</span></div>
    </div>
  </div>
  <div class="sec"><button class="btn btn-p" data-go="stage:booked">Back to my dashboard ${I.arrowRight}</button></div>
</div></main>`;
};

V.enrol = (f) => {
  const next = f.complete;
  const lvl = next?'E4':'E3';
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],next?'Next course':'Enroll')}
  <div class="ph">
    <div class="ph-top">${bk()}<h1>Explorer Track &ndash; ${lvl}</h1></div>
    ${''/* A `&middot;` SPINE, NOT A SENTENCE. Tal's summary used to open "90
          days, 13 chapters and a cohort of ten with a live leader" — this
          line with two commas moved. The facts stay here where a description
          belongs and Tal keeps the commitment, which is the money and the
          hours. See the note over `ph()`. */}
    <p>90 days &middot; 13 chapters &middot; a cohort of ten with a live leader</p>
  </div>
  <div class="sec">
    <div class="ai-aura tile tight">
      <div class="ai-head">${talLabel()}<h3>What the 90 days ask of you</h3></div>
      <div class="ai-body"><p>An hour a week, plus the 60-minute cohort call. People who keep to that average above 85%.</p></div>
      <div class="ai-foot">${askChip('How much time does the course really take each week?','Ask Tal about the workload')}</div>
    </div>
  </div>
  <div class="sec">
    <div class="stats">
      ${statCell(I.book, `Chapters`, `13`, `one a week`)}
      ${statCell(I.video, `Live calls`, `13`, `60 min, weekly`)}
      ${statCell(I.group, `Cohort size`, `10`, `max, all at ${lvl}`)}
      ${statCell(I.calendar, `Re-interview`, `Day 91`, `then you move`)}
    </div>
  </div>
  <div class="sec">
    <div class="note"><span>${I.group}</span><div class="nb"><b>Your cohort is assigned for you</b>You join up to ten people at your level, led by a volunteer cohort leader, with one live call a week.</div></div>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="kv"><span class="k">Course fee</span><span class="v">$690</span></div>
      <div class="kv"><span class="k">${next?'Returning candidate credit':'Interview already paid'}</span><span class="v n">&minus;$95</span></div>
      <div class="kv kv-due"><span class="k">Due today</span><span class="v">$595</span></div>
    </div>
    <p class="t-helper-01 mt4">One payment. Nothing recurs, and the re-interview at the end is included.</p>
    <div class="pay-act mt5">
      <button class="btn btn-p" data-go="payment">Continue to payment ${I.arrowRight}</button>
      ${askChip('What happens on the weekly cohort call?','Ask Tal about the calls')}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>What the 90 days cover</h2><button class="btn btn-g btn-sm noic" data-go="coursework">All 13</button></div>
    <div class="tile-stack">${[0,1,2,3].map(i=>chRow(i,{done:0,open:-1,week:99,enrolled:false})).join('')}</div>
  </div>
</div></main>`;
};

V.payment = (f) => `<main class="main"><div class="page">
  ${crumb(['Enroll','enrol'],'Payment')}
  ${''/* The last clause was a sentence spliced onto a `&middot;` row, and Tal
        below said it as one — "your cohort is assigned as soon as it clears".
        A spine states, it does not promise. */}
  ${ph('Payment','Explorer Track &ndash; E3 &middot; 90 days &middot; 13 chapters')}
  <div class="sec">
    <div class="f"><label for="cn">Card number</label><input class="inp" id="cn" inputmode="numeric" placeholder="1234 5678 9012 3456"></div>
    <div class="f"><label for="cnm">Name on card</label><input class="inp" id="cnm" placeholder="Maryam Naz"></div>
    <div style="display:flex;gap:var(--s05)">
      <div class="f" style="flex:1"><label for="cx">Expiry</label><input class="inp" id="cx" placeholder="MM/YY"></div>
      <div class="f" style="flex:1"><label for="cv">Security code</label><input class="inp" id="cv" placeholder="123"></div>
    </div>
    <div class="f"><label for="cz">Billing ZIP code</label><input class="inp" id="cz" placeholder="10018"></div>
    <label class="cbx"><input type="checkbox" checked><span class="box">${I.check}</span><span class="txt">Save this card for future courses</span></label>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="kv"><span class="k">Explorer Track &ndash; E3</span><span class="v n">$690</span></div>
      <div class="kv"><span class="k">Interview credit</span><span class="v n">&minus;$95</span></div>
      <div class="kv"><span class="k" style="color:var(--text-primary);font-weight:600">Total</span><span class="v">$595</span></div>
    </div>
    <div class="note mt5 band"><span style="fill:var(--icon-secondary)">${I.shield}</span><div class="nb">Card details go straight to our payment processor. TalentNext never stores them.</div></div>
    <div class="mt5"><button class="btn btn-p" data-go="stage:week1">Pay $595 and start ${I.arrowRight}</button></div>
    <p class="t-legal-01 mt5" style="color:var(--text-helper)">Full refund up to 7 days after your cohort starts, provided you have not completed more than one chapter.</p>
  </div>
</div></main>`;

/* ==========================================================================
   THE COURSEWORK MODULE IS BLANK ON PURPOSE

   LightspeedVT is the courseware, and in the product the whole of this module
   is THEIR interface inside an iframe — not ours with a frame somewhere in it.
   The moment a candidate opens Coursework they are looking at LightspeedVT, so
   anything we draw here is a second set of chrome around a screen that already
   has its own.

   So both views in the module — the chapter list and the chapter itself —
   render one empty slot and nothing else: no crumb, no page header, no Tal
   card. The slot is `.lsvt-slot`, sized in §29 to fill the view column, and it
   is where the iframe goes once the LightspeedVT screens are confirmed.

   Consequences worth knowing, so the blank does not look broken:
     - `placeBand` (ai5) and `placeAI` (ai2) both bail on a page with no `.ph`
       and no `.lsvt-sec`, so neither injects anything here. Nothing to undo.
     - `coursework` is dropped from `ASK_ON` in ai4 for the same reason — an
       ask line is a member of the head band, and there is no head.
     - The rail entry, the dashboard tiles and the transcript rows still point
       here. They are how you REACH the courseware, and they stay.

   What was here is parked below in `PARKED`, unreferenced. It is the design we
   drew for a world where we owned this module, and it is the reference for
   anything that turns out to live outside the iframe (progress, notes, the
   chapter's Tal card) once we see how much of it LightspeedVT already does.

   BOTH VIEWS ARE THE SAME FRAME. `coursework` and `chapter` were two screens
   of ours; they are now one embedded application that has its own screens, and
   which one it is showing is `S.ls`, not `S.view`. The pair is kept rather
   than collapsed to one because the rail, the dashboard tiles and the
   transcript rows all still point at both names, and `PARENT` maps `chapter`
   under `coursework` so the rail highlights correctly either way.
   ========================================================================== */
const lsvtFrame = () => `<main class="main lsvt-blank"><div class="page"><div class="lsvt-slot">
  <iframe class="lsvt-if" title="Coursework &mdash; LightspeedVT"></iframe></div></div></main>`;

V.coursework = lsvtFrame;
V.chapter = lsvtFrame;

const PARKED = {};

PARKED.coursework = (f) => {
  const pct = Math.round(f.done/13*100);
  const hrs = Math.floor(f.mins/60)+'h '+(f.mins%60)+'m';
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Coursework')}
  ${ph('Coursework',`${f.done} of 13 chapters &middot; ${pct}% &middot; ${hrs} invested`)}
  <div class="sec">
    <div class="note"><span>${I.info}</span><div class="nb">Your cohort moves together. Chapter ${Math.min(f.week+1,13)} opens on Monday, whether or not you finish the ones before it.</div></div>
  </div>
  <div class="sec flat bleed">
    <div class="tile-stack">${CH.map((_,i)=>chRow(i,f)).join('')}</div>
  </div>
</div></main>`;
};

PARKED.chapter = (f) => {
  const i = S.ch ?? f.open ?? 3;
  const name = CH[i][0], mins = CH[i][1];
  const inprog = S.stage==='day34' && i===3;
  const stg = Math.min(S.stg||0, STAGE_L.length-1);
  const done = i < f.done;
  return `<main class="main"><div class="page">
  ${crumb(['Coursework','coursework'],'Chapter '+(i+1))}
  <div class="ph">
    <span class="card-tag">Chapter ${i+1} of 13 · week ${i+1}</span>
    <div class="ph-top">${bk()}<h1>${name}</h1></div>
    <p>${i===3?'The shift from doing the work to owning the outcome, and what has to be true before you hand something over.':'Part of the Explorer Track &ndash; E3 curriculum.'}</p>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="pb" style="margin-bottom:var(--s05)">
        <div class="pb-top"><span class="l">Your progress</span><span class="v">${done?mins+' of '+mins:(inprog?'12 of '+mins:'0 of '+mins)} min</span></div>
        <div class="pb-track"><div class="pb-fill${done?' succ':''}" style="width:${done?100:(inprog?17:0)}%"></div></div>
      </div>
      <div class="kv"><span class="k">Video</span><span class="v n">${done?'6 of 6 watched':inprog?'4 of 6 watched':'Not started'}</span></div>
      <div class="kv"><span class="k">Reading</span><span class="v n">${done?'Complete':'Not opened'}</span></div>
      <div class="kv"><span class="k">Roleplay</span><span class="v n"><button class="lnk" data-go="rp">${done?'Complete &middot; run it again':'Practice with Tal'}</button></span></div>
      <div class="kv"><span class="k">Assessment</span><span class="v n">${done?SCORE[i]+'%':'Locked until the roleplay is done'}</span></div>
    </div>
  </div>
  <div class="sec lsvt-sec">
    <div class="lsvt-head">
      <div class="lsvt-ttl"><b>${STAGE_L[stg][0]}</b><span class="lsvt-n">${stg+1} of ${STAGE_L.length}</span></div>
      <button class="btn btn-g btn-sm${S.notes?' on':''}" data-toggle="notes">${S.notes?'Hide notes':'Notes'} ${I.edit}</button>
    </div>
    <div class="lsvt-wrap">
      <ol class="stp-list">
        ${STAGE_L.map((s,n)=>`<li class="stp-row${n===stg?' on':''}${n<stg?' did':''}" data-stage="${n}" role="button" tabindex="0">
          <span class="stp-ic">${n<stg?I.checkFilled:(n===stg?I.play:I.circle)}</span>
          <span class="stp-b"><b>${s[0]}</b><span>${s[1]}</span></span></li>`).join('')}
      </ol>
      <div class="lsvt-frame">
        <iframe class="lsvt-if" data-lsvt="${stg}" data-ttl="${name}" title="Course content"></iframe>
      </div>
    </div>
    ${S.notes?`<div class="lsvt-notes">
      <label class="t-label-01" for="chn">Your notes on this chapter</label>
      <textarea class="inp ai-field" id="chn" placeholder="What landed, what did not">${i===3?'Handed the vendor review to Sam and took it back after two days. Did not tell him why.':''}</textarea>
      <div class="lsvt-notes-f">${askChip('Turn my note into a reflection for this chapter','Turn this into a reflection')}<span class="t-legal-01">Saved to this chapter. Only you and Tal can see it.</span></div>
    </div>`:''}
    <div class="lsvt-foot">
      <span class="t-helper-01">${stg===STAGE_L.length-1?'Finish the summary to complete this chapter.':'Time required before you can continue &middot; '+STAGE_L[stg][2]}</span>
      <button class="btn btn-p" data-stage="${Math.min(stg+1,STAGE_L.length-1)}">${stg===STAGE_L.length-1?'Complete chapter':'Continue'} ${I.arrowRight}</button>
    </div>
  </div>
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>Help with this chapter</h3></div>
      <div class="ai-body"><p>${i===3?'This chapter comes down to one question: what has to be true before you hand something over. Most people get stuck because they treat it as a question about trust when it is a question about clarity.':'You can get a summary of this chapter, its key terms, or a few questions to test yourself once you have watched the video.'}</p></div>
      <div class="mt5" style="display:flex;flex-direction:column;gap:1px">
        ${['Explain this chapter in 60 seconds','Give me the two key terms','I am stuck, ask me a question instead'].map(q=>
          `<button class="tile clk band" data-tal-ask="${q}"><span class="t-body-compact-01">${q}</span></button>`).join('')}
      </div>
    </div>
  </div>
</div></main>`;
};

V.rewards = (f) => {
  const g = GAME[S.stage];
  /* NO DESCRIPTION BEFORE ENROLMENT. It said "Points start once you enroll
     on a course" and Tal, directly below, opened with "Points start when you
     enroll" — the same clause twice with a synonym between them. There is no
     spine to state on a page that has no points on it yet, and the empty
     state below says the rest. */
  if(!g) return `<main class="main"><div class="page">${ph('Points')}
    <div class="sec"><div class="empty" style="padding:0 0 var(--s07)">${I.trophy}<h3 style="margin-top:var(--s06)">Nothing to show yet</h3>
      <p>Points, badges and rank begin when your cohort starts.</p></div></div></div></main>`;
  const tab = S.rtab || 'points';
  const counts = {points:`${g.got.length} of ${PTS.length} earned`, badges:`${g.badges} of ${BDG.length} earned`, rank:`Currently ${RANKS[g.rank-1].n}`};
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Points')}
  ${''/* NO DESCRIPTION HERE EITHER. "Points, badges and rank come from your
        activity across the course and the community" is the page's three
        section names plus a claim, and Tal's summary states the three
        figures. A `&middot;` spine of the same three would have made it
        three statements of one thing on the one page in the product where
        the numbers change nothing. */}
  ${ph('Points')}
  ${/* THE QUESTION BELONGS AT THE TOP OF THE MODULE, NOT AT THE BOTTOM OF IT.
        This chip sat at the very foot of the last section, under the points
        table and the "updates within a few minutes" line — so the one thing
        on the page that offers to explain the page was the last thing you
        could reach, and on `day90` that is a scroll past nine rows.

        It is a head-band member now, directly above the field you would type
        the same question into. That is the structure every module landing
        page already has (§25): header, what Tal offers, the line you ask in.
        Points was the ONLY page in the build with a `.chip-tal` outside the
        band — every other one measures zero — so this is a page catching up
        with the pattern rather than a new pattern.

        `.ask-chips` is the marker the two passes read: `_mhIsTal` in ai5
        takes it into the band, and `placeAsk` in ai4 anchors the field under
        it rather than under the header. The inner `.ai-asks` is the chip row
        itself, borrowed from Tal's card — it carries the flex layout, the
        chip styling and the §13 entrance, none of which needs a card around
        it.

        It no longer switches off outside the Points tab. A band member that
        blinks in and out as you move between Points, Badges and Rank would
        be the header changing shape under a tab strip below it, and the
        question is about the module, which is all three tabs. */''}
  <div class="sec ask-chips"><div class="ai-asks">
    ${askChip('How do I earn points fastest?','Ask Tal how to earn more')}
  </div></div>
  <div class="sec" style="padding-bottom:var(--s06)">${scoreCard(g)}</div>
  <div class="tabs">
    ${['points','badges','rank'].map(k=>`<button class="${k===tab?'on':''}" data-rtab="${k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}
  </div>
  <div class="sec nofill" style="padding-top:var(--s05)">
    <div class="sec-h" style="margin-bottom:var(--s04)"><span class="t-helper-01">${counts[tab]}</span>
      <span class="t-helper-01" style="margin-left:auto">Updated today</span></div>
    <div class="aw-list">
      ${tab==='points'?pointsList(g):tab==='badges'?badgeList(g):rankList(g)}
    </div>
    ${tab==='points'?`<p class="t-helper-01 mt5">Points update within a few minutes of the activity.</p>`:''}
    ${tab==='rank'?`<p class="t-helper-01 mt5">Rank reflects your activity. It is separate from your level.</p>`:''}
  </div>
</div></main>`;
};

V.transcript = (f) => {
  const pct = Math.round(f.done/13*100);
  const hrs = Math.floor(f.mins/60)+'h '+(f.mins%60)+'m';
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Course Progress')}
  ${ph('Course Progress', (f.complete||f.finished)?'Explorer Track &ndash; E3 &middot; Cohort 41 &middot; 90 days complete':`Explorer Track &ndash; E3 &middot; Cohort 41 &middot; day ${f.day} of 90`)}
  <div class="sec">
    <div class="stats">
      ${statCell(I.book, `Chapters done`, `${f.done} <small>of 13</small>`, `${pct}%`)}
      ${statCell(I.chart, `Assessment average`, `${f.avg?f.avg+'<small>%</small>':'<small>Not yet</small>'}`, `${f.avg?'cohort average 79%':'nothing assessed yet'}`)}
      ${statCell(I.time, `Time invested`, `${hrs.split(' ')[0]}<small>${hrs.replace(/^\S+/,'')}</small>`, `${f.done?Math.round(f.mins/f.done)+' min per chapter':'not started'}`)}
      ${statCell(I.flag, `Tasks on time`, `${S.stage==='day34'?'4 <small>of 5</small>':S.stage==='week1'?'0 <small>of 0</small>':'12 <small>of 13</small>'}`, `${S.stage==='week1'?'none due yet':'one overdue'}`)}
    </div>
  </div>
  ${''/* THE 90-DAY SUMMARY APPEARS WHEN THERE IS ONE.
        This block used to draw at every stage, with an unsigned variant that
        said, in three places at once, that nothing in it was final: a heading
        reading "in progress", a "Not signed yet" warning tag, and a paragraph
        explaining that Priya signs it at the end. A candidate still inside
        their 90 days is not waiting on this and cannot act on it — it is
        the one block on the page that reports on a date rather than on them,
        and it sat second, above their own scores.

        Nothing is deleted: at `complete` the summary is a signed artefact the
        candidate can read and share, and that is exactly when the page should
        lead with it. So the block keeps its position and loses its unsigned
        state — which also takes the `.tag.warm` / `.tag.cool` pair and the
        second `.lk` off the page while the course is running. */}
  ${f.complete?`<div class="sec">
    <div class="tile">
      <div class="ai-head"><h3>90-day summary · signed</h3></div>
      <div class="ai-body"><p>Priya signed this on November 21. It is what your re-interview was assessed against, and it is yours to share.</p></div>
      <div class="tag-row mt5"><span class="tag green">${I.checkFilled}Signed by Priya Nair</span></div>
      <div class="ai-foot"><a class="lk">Read the summary</a></div>
    </div>
  </div>`:''}
  ${f.done?`<div class="sec">
    <div class="tile" style="padding-top:var(--s04)">
      ${lineChart('sc',{title:'Assessment scores',sub:'70 to 100%',
        data:SCORE.slice(0,f.done),labels:CH.map((c,i)=>'Chapter '+(i+1)),slots:13,
        target:79,targetLabel:'Cohort average 79%',unit:'%',min:70,max:100})}
    </div>
  </div>
`:''}
  ${''/* SHOW ALL 13 OPENS THE REST OF THE LIST, IT DOES NOT LEAVE THE PAGE.
        It was `data-go="coursework"` — a button whose words promise more of
        the block you are looking at and whose behaviour was a navigation to
        another module, which since the LightspeedVT frame landed means the
        list it promised is not even there to see. This is the record of the
        90 days and the record is what the page is; the remaining eight
        rows belong under the five already on it.

        `S.chAll` is the whole of the state, read here and toggled by the
        `data-chall` branch in the click handler. It is deliberately NOT reset
        per view: a person who opened the list and went to look at a chapter
        comes back to it open. The label and the chevron both follow it, so
        the control says which way it goes rather than only what it did. */}
  <div class="sec tint">
    <div class="sec-h"><h2>Chapter record</h2></div>
    <div class="tile-stack">${(S.chAll?CH:CH.slice(0,5)).map((_,i)=>chRow(i,f)).join('')}</div>
    <div class="mt4"><button class="btn btn-g" data-chall="1">${S.chAll?`Show the first five ${I.chevUp}`:`Show all 13 ${I.chevDown}`}</button></div>
  </div>
  ${f.done>0?`<div class="sec">
    <div class="cert">
      <span class="cert-mark">${I.certificate}</span>
      <div class="cert-b">
        <div class="cert-eb">Certificate of completion</div>
        <div class="n">Explorer Track &ndash; ${f.complete?'E3':'E2'}</div>
        <div class="m">${f.complete?'Completed November 21, 2026 · Cohort 41':'Completed May 4, 2026 · Cohort 12'}</div>
        <div class="m">Signed by ${f.complete?'Priya Nair':'Daniel Kerr'}</div>
      </div>
      <div class="cert-act">
        <button class="btn btn-sm noic cert-btn">Download</button>
        <button class="btn btn-sm noic cert-btn">Share link</button>
      </div>
    </div>
  </div>`:''}
</div></main>`;
};

V.cohort = (f) => `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Cohort 41')}
  ${''/* THIS ONE WAS THE DUPLICATION AT ITS PLAINEST — Tal's summary used to
        open "Ten of you at E3 with Priya leading, week 5 of 13", which is
        this line with the pronouns changed. The description keeps the facts
        because that is what a `&middot;` row is for; Tal now carries the
        call, which is the thing on this page with a date on it. */}
  ${ph('Cohort 41',`Ten people at Explorer &ndash; E3 &middot; led by Priya Nair &middot; week ${f.week} of 13`)}
  ${/* THE FOURTH CALL IS THE SAME CARD AS THE OTHER THREE.
        This drew `.callband` — an orange date tile, the detail beside it, one
        button at the right — and it was the only appointment in the product
        that did. The agent interview, the consultant screening and this same
        weekly call ON THE DASHBOARD are all `.plate`: the black wall with the
        leader's face, an eyebrow, a title, a line of detail and up to two
        actions. So the cohort page showed a candidate a different drawing of
        the very call its own dashboard had just shown them, one click
        earlier, and the orange tile was the loudest thing on a page whose
        subject is the discussion below it.

        Same six facts, in the component that already carries them. The
        actions are the consultant plate's pair rather than the dashboard's
        "Open the cohort" — you are already in the cohort, so the thing to
        offer is joining the call and putting it in a calendar, which is what
        `.callband` offered.

        `.callband`'s CSS stays in §15/§19/§22 unreferenced. It is the only
        drawing of a date-tile row in the build and worth keeping around until
        someone decides it is not; nothing renders it today. */''}
  <div class="sec">
    <div class="plate">
      <div class="plate-who">${avatar(AGENTS.priya,56)}
        <span class="plate-wb"><b>Priya Nair</b><span>Cohort leader &middot; leads Cohort 41</span></span>
      </div>
      <div class="plate-eb">Weekly call &middot; in 2 days</div>
      <div class="plate-t">Cohort 41, week ${f.week}</div>
      <div class="plate-b">Thursday at 6:00 PM ET &middot; 9 others &middot; 60 minutes</div>
      <div class="plate-a">
        <button class="btn btn-p btn-sm noic" data-call="cohort">Join call ${I.video}</button>
        <button class="btn btn-sm noic plate-b2">Add to calendar</button>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>What to bring on Thursday</h3></div>
      <div class="ai-body"><p>Priya is running week ${f.week} on ${f.week<=1?'why we exist':'hard conversations'}. Bring the Sam handover from your notes — it is the closest example you have.</p></div>
      
    </div>
  </div>
  ${/* sec-cs: this section holds a full-bleed tab strip, and §20 needs to know
        so the call plate above it can sit flush. Named rather than sniffed —
        the `:has()` that would have detected it has to nest, and nested
        `:has()` is invalid CSS that takes its whole rule down with it. */''}
  <div class="sec sec-cs">
    <div class="cs">
      <button class="${(S.ctab||'discussion')==='discussion'?'on':''}" data-ctab="discussion">Discussion</button>
      <button class="${S.ctab==='ranking'?'on':''}" data-ctab="ranking">Ranking</button>
      <button class="${S.ctab==='members'?'on':''}" data-ctab="members">Members</button>
    </div>
    ${S.ctab==='members'
      ? `<div class="tile-stack">${COHORT.map(([n,i,img,meta,you])=>mem(n,i,meta,you,img)).join('')}</div>`
      : S.ctab==='ranking' ? boardList() : discussionRoom()}
  </div>
</div></main>`;

V.messages = (f) => {
  const her = AGENTS.priya;
  const you = {i:'MN', img: AV.hana};
  const av = a => avatar(a, 32);
  const m = (side, who, body, when) => `<div class="m ${side}">
    <span class="m-av">${av(side === 'me' ? you : her)}</span>
    <div class="m-c">
      <div class="m-b">${body}</div>
      <div class="m-w">${who} &middot; ${when}</div>
    </div>
  </div>`;
  const voice = (len) => `<span class="vn">
    <span class="vn-play">${I.play}</span>
    <span class="vn-wave">${Array.from({length:28},(_,i)=>`<i style="height:${4 + ((i*7)%11)}px"></i>`).join('')}</span>
    <span class="vn-len">${len}</span></span>`;
  const file = (n, s) => `<span class="fa">
    <span class="fa-ic">${I.document}</span>
    <span class="fa-b"><b>${n}</b><span>${s}</span></span>
    <span class="fa-dl">${I.download}</span></span>`;
  return `<main class="main"><div class="page msg-page">
  <div class="ph" style="padding-bottom:var(--s04)"><h1>Messages</h1>
    <p>One-to-one with Priya Nair. Private, and it stays after the cohort closes.</p></div>

  <div class="msgs">
    <div class="m-day"><span>Monday</span></div>
    ${m('them','Priya Nair','Week 5 is the one people find hardest. If chapter 4 is not landing, say so on Thursday rather than pushing through it.','11:04 AM')}
    ${m('me','You','It is not landing. I keep taking work back and I do not know how to stop doing that.','9:36 PM')}
    <div class="m-day"><span>Tuesday</span></div>
    ${m('them','Priya Nair','Good. That is the actual chapter. Bring the vendor review example on Thursday and we will work through it with the group, if you are happy with that.','9:12 AM')}
    ${m('me','You','Yes. I will bring the handover I took back from Sam.','9:40 AM')}
    <div class="m-unread"><span>2 unread messages</span></div>
    ${m('them','Priya Nair', voice('0:38'),'Wed 8:15 AM')}
    ${m('them','Priya Nair','Listen to that before Thursday. The one-pager below is the frame I want you to use for the handover.<br>' + file('Handover one-pager.pdf','PDF &middot; 240 KB'),'Wed 8:17 AM')}
  </div>
  <div class="msg-foot">
    ${''/* THE LEADING MARK IS THE ATTACHMENT, NOT TAL'S STAR.
          `.composer-star` put Tal's mark at the head of this field, which is a
          claim the field cannot honour: this is a message to Priya Nair, a
          person, and nothing Tal does is involved in sending it. §16.12 calls
          the construction "one field, everywhere" and lists what each one
          carries — Messages the attachment and the microphone, the room the
          attachment — and the star was the one thing in the row that carried
          no function at all. Every field in the product that DOES reach Tal
          has its own component (`.askfield`, the panel composer with
          `.composer-mk`), so the mark is not lost, it is back where it means
          something.

          The attachment takes the vacated slot rather than a fourth control
          being invented for it: the leading position is where a mail client
          and every chat app in the product's reference set put "add a thing to
          this message", and the right end of the row is then send plus the one
          control that RECORDS a message rather than decorating it. */}
    <div class="composer">
      <button class="composer-act composer-lead" aria-label="Attach a file">${I.attachment}</button>
      <input class="inp" placeholder="Message Priya" aria-label="Message">
      <button class="composer-act" aria-label="Record a voice message">${I.microphone}</button>
      <button class="composer-send" aria-label="Send">${I.send}</button>
    </div>
  </div>
</div></main>`;
};

V.billing = (f) => {
  const rows = [];
  if(f.enrolled||f.complete) rows.push(['Explorer Track &ndash; E3','Aug 14, 2026','$595','Visa','4242']);
  if(!f.pred) rows.push(['Interview · Priya Nair','Aug 13, 2026','$95','Visa','4242']);
  if(S.stage==='booked') rows.push(['Interview · Priya Nair','Aug 13, 2026','$95','Visa','4242']);
  rows.push(['Explorer Track &ndash; E2','Feb 4, 2026','$490','Mastercard','8210']);
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Payments')}
  ${''/* "One-off payments only. Nothing here recurs." is two statements of
        one fact, and Tal's summary closes on the same one. Tal keeps it,
        because on this page it is the answer to the question the page
        raises; there is no spine to state above it. */}
  ${ph('Payments')}
  <div class="sec pay-sec">
    <div class="paytbl">
      <div class="payrow payhead">
        <span>What</span><span>When</span><span>Card</span>
        <span class="num">Amount</span><span></span>
      </div>
      ${rows.map(([n,d,amt,br,last])=>`<div class="payrow">
        <span class="pay-n">${n}</span>
        <span class="pay-d">${d}</span>
        <span class="pay-c">${br?bmk(br)+`<span class="n">&bull;&bull;&bull;&bull; ${last}</span>`:''}</span>
        <span class="pay-a num">${amt}</span>
        <span class="pay-r"><button class="lnk">Receipt</button></span>
      </div>`).join('')}
    </div>
  </div>
  <div class="sec">
    ${/* NO "1 OF 3". The three-card cap is a rule the cards themselves
          already enforce — "Add a card" disappears at the third one, which is
          the only moment the number would have told you anything, and by then
          it is not on the page either. Until then it is a count of a list you
          can see in full, set against a ceiling nobody is near. */''}
    <div class="sec-h"><h2>Saved cards</h2>${S.cards.length<3?`<button class="btn btn-p btn-sm noic sec-h-act" data-addcard="1">Add a card ${I.add}</button>`:''}</div>
    <div class="tile-stack">
      ${S.cards.map((c,i)=>`<div class="cardrow">
        <span class="cardrow-ic">${BMK[c.brand]||BMK.card}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${c.brand} ending ${c.last}${c.def?' <span class="pill-def">Default</span>':''}</span>
          <span class="cardrow-d">Expires ${c.exp}</span>
        </span>
        <span class="cardrow-a">
          ${c.def?'':`<button class="lnk" data-setdef="${i}">Make default</button>`}
          <button class="lnk" data-delcard="${i}">Remove</button>
        </span>
      </div>`).join('')}
    </div>
    ${S.cards.length<3?'':`<p class="t-helper-01 mt4">Three cards is the maximum. Remove one to add another.</p>`}
  </div>
</div></main>`;
};

/* add-a-card sheet */
function profileSheet(){
  return `<div class="modal ${S.editProfile?'on':''}" data-close="editprofile">
    <div class="sheet">
      <div class="sheet-h"><h2>Edit details</h2>
        <button class="x" data-editprofile="0" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="idhead mb6">
          <button class="idphoto" data-editphoto="1" aria-label="Change your photo">
            <span class="av-ph" style="width:64px;height:64px"><i>MN</i><img src="${AV.hana}" alt=""></span>
            <span class="idphoto-edit">${I.edit}</span>
          </button>
          <div class="idhead-b">
            <span class="idname">Your photo</span>
            <span class="idmeta">Shown to your agent and your cohort.</span>
            <button class="lk" data-editphoto="1">Change photo</button>
          </div>
        </div>
        <div class="f"><label for="pn">Name</label><input class="inp" id="pn" value="Maryam Naz"></div>
        <div class="f"><label for="pz">Time zone</label>
          <select class="inp" id="pz">
            <option>Eastern Time (ET)</option><option>Central Time (CT)</option>
            <option>Mountain Time (MT)</option><option>Pacific Time (PT)</option>
            <option>Pakistan Standard Time (PKT)</option>
          </select></div>
        <p class="t-helper-01">Your level is set by your agent and cannot be edited here.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-editprofile="0">Cancel</button>
        <button class="btn btn-p noic" data-editprofile="0">Save changes</button>
      </div>
    </div>
  </div>`;
}

function photoSheet(){
  const opts = ['hana','priya','lena','owen','samuel'];
  return `<div class="modal ${S.editPhoto?'on':''}" data-close="editphoto">
    <div class="sheet">
      <div class="sheet-h"><h2>Your photo</h2>
        <button class="x" data-editphoto="0" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="photogrid">
          ${opts.map((k,i)=>`<button class="photopick ${i===0?'on':''}" data-pick="${k}">
            <span class="av-ph" style="width:100%;height:100%"><img src="${AV[k]}" alt=""></span></button>`).join('')}
        </div>
        <div class="btn-row mt6">
          <button class="btn btn-s" data-editphoto="0">Upload a photo ${I.add}</button>
          <button class="btn btn-t" data-editphoto="0">Remove ${I.close}</button>
        </div>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-editphoto="0">Cancel</button>
        <button class="btn btn-p noic" data-editphoto="0">Use this photo</button>
      </div>
    </div>
  </div>`;
}

function cardSheet(){
  return `<div class="modal ${S.addCard?'on':''}">
    <div class="sheet">
      <div class="sheet-h"><h2>Add a card</h2><button class="x" data-addcard="0" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="f"><label for="nc">Card number</label>
          <div class="inp-mk"><input class="inp" id="nc" inputmode="numeric" autocomplete="cc-number" maxlength="23" placeholder="1234 5678 9012 3456">
            <span class="bmk lg" id="ncb">${BMK.card}</span></div>
          <div class="bmk-row mt3"><span class="lab">We accept</span>
            ${['Visa','Mastercard','Amex','Discover'].map(b=>bmk(b)).join('')}</div></div>
        <div class="f"><label for="nn">Name on card</label><input class="inp" id="nn" placeholder="Maryam Naz"></div>
        <div style="display:flex;gap:var(--s05)">
          <div class="f" style="flex:1"><label for="nx">Expiry</label><input class="inp" id="nx" placeholder="MM/YY"></div>
          <div class="f" style="flex:1"><label for="nv">Security code</label><input class="inp" id="nv" placeholder="123"></div>
        </div>
        <div class="f"><label for="nz">Billing ZIP code</label><input class="inp" id="nz" placeholder="10018"></div>
        <label class="cbx"><input type="checkbox"><span class="box">${I.check}</span><span class="txt">Make this my default card</span></label>
        <div class="note mt5 band"><span style="fill:var(--icon-secondary)">${I.shield}</span><div class="nb">Card details go straight to our payment processor. TalentNext never stores them.</div></div>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-addcard="0" style="justify-content:center">Cancel</button>
        <button class="btn btn-p noic" data-savecard="1" style="justify-content:center">Add card</button>
      </div>
    </div>
  </div>`;
}

/* WHAT YOU HAVE EARNED, ON THE PAGE THAT IS ABOUT YOU — AND ONLY IF ANY
   Profile held your name, your level and your switches, and nothing you had
   won. Points, badges and rank are the one part of the record that is
   yours rather than the course's, and Profile is where a person goes to look
   at their own record; making them navigate to Points to see whether they
   have a badge is making them ask a question the page they are on should
   already have answered.

   AND IT IS NOT DRAWN AT ZERO. Points do not start until you are on a course,
   so on five of the eight stages this block would be three cells reading 0,
   0 of 4 and 1-Star — an empty trophy case, which says "you have nothing"
   far louder than not asking says anything at all. `GAME[stage]` is
   undefined before a course and `pts` is the first thing to move once one
   starts, so the two together are the test. */
function standSec(){
  const g = GAME[S.stage];
  if(!g || !g.pts) return '';
  return `<div class="sec">
    <div class="sec-h"><h2>What you have earned</h2><button class="btn btn-g btn-sm noic" data-go="rewards">View Points</button></div>
    ${standRow(g)}
  </div>`;
}
V.account = (f) => `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Profile')}
  ${''/* THE VERBATIM ONE. This said "Your details, your preferences, and what
        Tal is allowed to do" and Tal's summary said "Your details, how you
        want to be contacted, and what Tal is allowed to do" — the same three
        nouns, in the same order, twice, six millimetres apart. Both were
        naming the page's sections, which the section headings do. Tal's is
        rewritten to point at the permissions and this one is gone. */}
  ${ph('Profile')}
  <div class="sec">
    <div class="idhead">
      <button class="idphoto" data-editphoto="1" aria-label="Change your photo">
        <span class="av-ph" style="width:72px;height:72px"><i>MN</i><img src="${AV.hana}" alt=""></span>
        <span class="idphoto-edit">${I.edit}</span>
      </button>
      <div class="idhead-b">
        <span class="idname">Maryam Naz</span>
        <span class="idmeta">maryam.naz@tkxel.io</span>
        <span class="tag">${f.pred ? f.track + ' track' : lvlName(f.level)}</span>
      </div>
      <!-- EDIT SITS ON THE ROW IT EDITS. It was below the table, so the
           control was two blocks away from the name and photo it changes, and
           it read as the section's action rather than as this row's. On the
           right end of the identity row it is opposite the thing it acts on,
           which is where the photo's own edit affordance already is. -->
      <div class="idhead-a"><button class="btn btn-g" data-editprofile="1">Edit details ${I.edit}</button></div>
    </div>
    <div class="tile">
      <div class="kv"><span class="k">Name</span><span class="v">Maryam Naz</span></div>
      <div class="kv"><span class="k">Email</span><span class="v n">maryam.naz@tkxel.io</span></div>
      <div class="kv"><span class="k">Time zone</span><span class="v n">Eastern Time (ET)</span></div>
      <div class="kv"><span class="k">Level</span><span class="v n">${f.pred?f.track+' track · set at the interview':lvlName(f.level)+' · confirmed'}</span></div>
    </div>
  </div>
  ${standSec()}

  <div class="sec tint">
    <div class="sec-h"><h2>Notifications</h2></div>
    <label class="tg"><div class="tb"><b>Weekly call reminders</b><span>24 hours and 1 hour before</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Task deadlines</b><span>The morning a task is due</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Product and course emails</b><span>Occasional, never more than monthly</span></div><input type="checkbox"><span class="sw"></span></label>
  </div>
  <div class="sec">
    <div class="lead-b">
      <div class="lead-eb">Give back &amp; grow</div>
      <div class="lead-t">Become a cohort leader</div>
      <div class="lead-x">Volunteer to guide a cohort through the 90 days. It is unpaid &mdash; what you get back is a recognised cohort-leader certification, and the growth that comes from teaching what you have already learned. You can only lead cohorts at a level below your own, so you are always a step ahead of the people you are mentoring.</div>
      <div class="lead-tags"><span>Volunteer role</span><span>Earns a certification</span><span>Teaches below ${lvlName(f.level)}</span></div>
      <div class="lead-a">${S.ledApplied
        ? `<button class="btn btn-p btn-sm noic" disabled>Request sent ${I.checkFilled}</button>`
        : `<button class="btn btn-p btn-sm noic" data-leadapply="1">Apply to lead a cohort ${I.arrowRight}</button>`}</div>
      ${S.ledApplied?`<div class="lead-ok">${I.checkFilled}<span>Your request is with the TalentNext team. They review applications weekly and will email you either way.</span></div>`:''}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Closing your account</h2></div>
    <!-- THE ACTION SITS ON THE LINE IT IS EXPLAINED BY. The control was a
         btn-set UNDER the paragraph, which made a third stacked block out
         of a sentence and the one thing it is telling you about. They are one
         row: what deleting does on the left, the control that does it held at
         the right end — the same shape §29.10 gives the identity row and
         §15 gives the plate. The inline style goes with it; a measure and a
         tone belong in the stylesheet, and an inline declaration is the one
         thing no later layer can correct (trap 1). -->
    <div class="close-b">
      <p class="t-body-01 close-x">Deleting your account removes your profile, your notes and your interview recordings. Certificates you have already earned stay valid and stay downloadable.</p>
      <div class="close-a">
        <button class="btn btn-t danger" data-del="1">Delete my account ${I.misuse}</button>
      </div>
    </div>
  </div>
  <!-- LOGGING OUT IS NOT CLOSING YOUR ACCOUNT. It sat inside "Closing your
       account", under the delete control and above that section's closing
       rule, which put the mildest thing on the page inside the block about
       the most destructive one. Its own section puts the rule between them.

       The sec-out class is what makes that rule actually appear above 900:
       §14 draws a rule only before a section that introduces itself with a
       heading, and this one introduces itself with a button. It is named so
       §14 can list it and §20 can keep the full gap either side of it. -->
  <div class="sec sec-out">
    <button class="btn btn-g" data-go="stage:signup/login">Log out ${I.logout}</button>
  </div>
</div></main>
${S.delAsk?`<div class="modal" data-del="0">
  <div class="sheet sheet-c" role="dialog" aria-modal="true" aria-label="Delete your account">
    <div class="sheet-h"><h2>Delete your account?</h2><button class="x" data-del="0" aria-label="Close">${I.close}</button></div>
    <div class="sheet-b">
      <div class="note err"><span>${I.warning}</span><div class="nb"><b>This cannot be undone</b>Your profile, your notes and every interview recording are deleted. Your certificates stay valid and downloadable from the link in your email.</div></div>
      <div class="f mt5"><label for="delc">Type DELETE to confirm</label><input class="inp" id="delc" placeholder="DELETE" autocomplete="off"></div>
    </div>
    <div class="sheet-f">
      <button class="btn btn-s noic" data-del="0">Keep my account</button>
      <button class="btn btn-p noic danger" data-delgo="1">Delete everything</button>
    </div>
  </div>
</div>`:''}`;

V.terms = AUTH.terms;

/* ============================================================
   RUNTIME
   ============================================================ */
const device = document.getElementById('device');
const pick   = document.getElementById('pick');
const cap    = document.getElementById('cap');

document.getElementById('ptLogo').src = LOGO_W;
pick.innerHTML = stagesShown().map(([k,l])=>`<option value="${k}">${l}</option>`).join('');

/* A STAGE WITH ITS OWN FRONT DOOR IS NOT REACHED THROUGH THE NAVIGATION.
   `signup` was the only one, so the two lines below said "signup" by name.
   `nil` — the Next in Leadership run-up — is the second, and naming it twice
   more would leave the next one to be found by whoever adds it and wonders
   why their stage lands on the dashboard. The table is the test now: a stage
   listed here opens on the view it names and the reachability check, which
   only knows about views the rail can get to, does not apply to it. */
const DEFAULT_VIEW = {signup:'create', nil:'quiz'};
function setStage(k,keepView){
  /* A HIDDEN STAGE RESOLVES FORWARD, and this is the one place it has to
     happen — every route to a stage comes through here: the picker, the arrow
     keys, `data-go="stage:…"`, and the boot reader restoring a hash. See
     `STAGES_HIDDEN` in data.js for why it is a set and not a deleted row. */
  k = stageResolve(k);
  /* A STAGE IS A CANDIDATE FACT, so picking one puts you back in the candidate
     portal. Without this the picker silently changes a candidate who is not on
     screen: you would be looking at the leader's cohorts while the host bar
     claims Day 34, and the reachability check below — which only knows candidate
     views — would bounce the leader's page to a dashboard that is not theirs. */
  S.portal = 'candidate';
  S.stage = k;
  const f = CFG[k];
  if(!keepView){
    S.view = DEFAULT_VIEW[k] || 'dashboard';
    S.ch = f.open;
  }
  /* if the current view is not reachable at this stage, fall back */
  const reachable = NAVSETS[f.nav].map(n=>n[0]).concat(['account','report','agents','agent','booking','payment','chapter','terms','rewards','ivt','mem','rp']);
  if(!DEFAULT_VIEW[k] && !reachable.includes(PARENT[S.view]||S.view)) S.view='dashboard';
  if(DEFAULT_VIEW[k]) S.view = DEFAULT_VIEW[k];
  /* THE SCENES A STAGE ARRIVES WITH.
     `assessed` is the stage the choice happens at — the level interview is
     done, its six scenes are waiting, and nothing is enrolled yet — so it
     starts with `level:null` and the Interviews module opens on the chooser.
     Every stage after it starts with the three already chosen, because those
     stages are AFTER the choosing: a prototype of day 34 that asked you to
     pick your scenes would be showing you a step you took two months ago.
     The first three are the default set; a person who picks a different three
     at `assessed` keeps them until they change stage.

     `re` only exists at `promoted`, which is the only stage with a second
     interview behind it — two past interviews, three scenes each. Stages
     before it get `null` and never ask for it. */
  S.scenes = {
    level: k === 'assessed' ? null : [0,1,2],
    re: k === 'promoted' ? [0,1,2] : null
  };
  S.scPick = {level:[], re:[]};
  S.hist = [];
  render();
}
/* ==========================================================================
   THE HISTORY STACK IS A CONVENIENCE, NOT A DEPENDENCY

   `pushState` and `replaceState` can THROW, and the way they throw is the
   worst kind: Chrome rate-limits them, and once it has, every subsequent call
   raises. It logs "Throttling navigation to prevent the browser from hanging"
   ONCE, to the console, and then says nothing.

   Every navigation in this prototype ran through an unguarded `pushState`
   sitting BEFORE `S.view = target`, so the throw took the assignment and the
   `render()` with it. The result is a page that stops navigating: the rail
   still highlights, the pointer still changes, every click does nothing, and
   there is no error to find because the only one was logged minutes earlier.
   It reads exactly like the app having frozen.

   The limit is real and reachable — a browser hammered by an automated sweep
   hits it, and so does anyone clicking around a prototype fast enough. The
   URL is a nicety here (it makes a screen linkable and lets the hardware back
   button work); the app must not depend on writing one. So both calls go
   through this, and a refused write costs the back button and nothing else.
   ========================================================================== */
function histWrite(fn, arg1, arg2, arg3){
  try { history[fn](arg1, arg2, arg3); } catch(e){ /* rate-limited: the URL
    stops tracking, the app keeps working */ }
}

function go(target, fresh){
  if(target.startsWith('stage:')){ const p = target.slice(6).split('/');
    setStage(p[0]); if(p[1]){ S.view = p[1]; S.nav = false; render(); } return; }
  if(target.startsWith('agent:')){ S.agent = target.slice(6); S.hist.push(S.view); histWrite('pushState',{v:'agent'},''); S.view='agent'; S.nav=false; render(); return; }
  /* ENTERING THE MODULE LANDS ON THE CHAPTER MENU, ALWAYS.
     `chapter:N` used to open our chapter N directly, and thirteen of our
     chapters do not map onto LightspeedVT's four. More to the point, where you
     land inside the courseware is the courseware's decision, not ours — every
     one of these links now means "open Coursework" and LightspeedVT opens on
     its menu. Kept as a distinct branch so `S.ch` still tracks for the parked
     views and for anything that reads it. */
  if(target.startsWith('chapter:')){ S.ch = +target.slice(8); S.stg = 0; S.notes = false; S.ls = {screen:'menu', ch:1}; S.hist.push(S.view); histWrite('pushState',{v:'chapter'},''); S.view='chapter'; S.nav=false; render(); return; }
  if(target === 'coursework') S.ls = {screen:'menu', ch:1};
  if(S.view!==target) talReset();
  if(fresh) S.hist = [];
  else if(S.view!==target){ S.hist.push(S.view); histWrite('pushState',{v:target},''); }
  S.view = target;
  S.nav = false;
  render();
}

/* Ask Tal something: the question lands, Tal thinks, then answers with widgets.
   Questions queue, so asking three things in a row gets three answers in order. */
/* HOW LONG TAL TAKES, AND WHY IT IS NOT AS FAST AS POSSIBLE.
   This was 650ms, which is long enough to run the animation and too short to
   see it: the three dots appeared and were replaced inside half a blink, so
   the answer read as having been sitting there all along — canned, not
   composed. An assistant that answers instantly is not impressive, it is
   obviously not thinking, and the one thing the dots exist to say is that it
   is. 1.4 seconds is long enough to read as a pause and short enough not to
   read as a wait. It is one constant so that every surface Tal answers on —
   the panel, the ask page, a pressed widget button in ai7 — takes the same
   beat; two different speeds would be two different assistants. */
const TAL_BEAT = 1400;
let talTimer = null;
let talQueue = [];
function ask(q){
  if(!q) return;
  S.thread.push({who:'me', html:q});
  talQueue.push(q);
  S.typing = true;
  render();
  talPump();
}
function talPump(){
  if(talTimer || !talQueue.length) return;
  const q = talQueue.shift();
  talTimer = setTimeout(() => {
    talTimer = null;
    let html;
    try { html = talReply(q); } catch(e){ html = null; }
    if(!html) html = 'I did not follow that one. Try one of these.'
      + twChips(TALCTX[S.view] || TALCTX.dashboard);
    S.thread.push({who:'tal', html});
    S.typing = talQueue.length > 0;
    render();
    talPump();
  }, TAL_BEAT);
}
function talReset(){ talQueue = []; clearTimeout(talTimer); talTimer = null; S.thread = []; S.typing = false; }
function back(){
  const prev = S.hist.pop();
  if(prev){ S.view = prev; S.nav=false; S.notif=false; render(); }
}
const TAL_CARDS = [
  [/^Meet Tal/,             'What can you help me with?',
     ['What can you help me with?', 'How does the interview work?']],
  [/^Your next step/,       'What should I do next?',
     ['What should I do next?', 'How long does the whole thing take?']],
  [/^Getting started/,      'How should I start week 1?',
     ['How should I start week 1?', 'What gets assessed this week?']],
  [/^Where you are stuck/,  'Walk me through chapter 4',
     ['Walk me through chapter 4', 'Why is this my growth area?']],
  [/^Before your re-interview/, 'Prepare me for the re-interview',
     ['Prepare me for the re-interview', 'What will Priya assess?']],
  [/^Suggested for you/,    'How should I choose between these agents?',
     ['How should I choose between these agents?', 'What happens in the interview?']],
  [/^What to expect with/,  'What is this agent like to be interviewed by?',
     ['What are they like to be interviewed by?', 'What should I prepare?']],
  [/^Time to prepare/,      'What should I prepare for the interview?',
     ['What should I prepare?', 'What happens on the day?']],
  [/^What the 90 days/,     'What does the course actually involve?',
     ['What does the course involve?', 'How much time will it take each week?']],
  [/^Help with this chapter/, 'Explain this chapter',
     ['Explain this chapter', 'I am stuck — help me']],
  [/^What to bring/,        'What should I say on Thursday’s call?',
     ['What should I say on the call?', 'What is week 5 about?']]
];

function enhanceTalCards(){
  device.querySelectorAll('.ai-aura').forEach(card => {
    const h = card.querySelector('.ai-head h3');
    const title = h ? h.textContent.trim() : '';
    const hit = TAL_CARDS.find(([re]) => re.test(title));
    if(!card.hasAttribute('data-tal-ask')){
      card.setAttribute('data-tal-ask', hit ? hit[1] : ('Tell me about ' + (title || 'this').toLowerCase()));
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Ask Tal about ' + (title || 'this'));
      card.classList.add('ai-clickable');
    }
    const want = hit ? hit[2] : [];
    if(!want.length) return;
    let foot = card.querySelector('.ai-foot');
    if(!foot){ foot = document.createElement('div'); foot.className = 'ai-foot'; card.appendChild(foot); }
    /* A card that already carries a navigation link has one job to offer, not
       three. The link keeps the footer row to itself and a single suggested
       question goes on the line below it, so the two never read as peers. */
    const hasLink = !!foot.querySelector('a[data-go],.lk,.lnk,button[data-go]');
    let rail = foot;
    if(hasLink){
      rail = card.querySelector('.ai-asks');
      if(!rail){ rail = document.createElement('div'); rail.className = 'ai-asks';
                 foot.insertAdjacentElement('afterend', rail); }
    }
    const cap = hasLink ? 1 : 2;
    const have = [...rail.querySelectorAll('[data-tal-ask]')].map(b => b.dataset.talAsk);
    for(const q of want){
      if(have.length >= cap || have.includes(q)) continue;
      rail.insertAdjacentHTML('beforeend', askChip(q, q));
      have.push(q);
    }
  });
}

const IOS_TOP = `<div class="ios-top" aria-hidden="true">
  <span class="ios-time">9:41</span>
  <span class="ios-ind">
    <svg viewBox="0 0 18 12"><path d="M1 9h2v3H1zM5 6.5h2V12H5zM9 4h2v8H9zM13 1.5h2V12h-2z"/></svg>
    <svg viewBox="0 0 16 12"><path d="M8 10.2 6 8.2a2.9 2.9 0 0 1 4 0l-2 2Zm0-4.1a5.8 5.8 0 0 0-4.1 1.7L2.5 6.4a7.8 7.8 0 0 1 11 0L12.1 7.8A5.8 5.8 0 0 0 8 6.1Zm0-4A9.8 9.8 0 0 0 1.1 5L-.3 3.6a11.8 11.8 0 0 1 16.6 0L14.9 5A9.8 9.8 0 0 0 8 2Z"/></svg>
    <svg viewBox="0 0 26 12"><rect x=".5" y=".5" width="21" height="11" rx="2.5" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="15" height="8" rx="1"/><path d="M23 4.2v3.6a2 2 0 0 0 0-3.6Z" opacity=".45"/></svg>
  </span>
</div>`;
const IOS_BOTTOM = `<div class="ios-home" aria-hidden="true"><i></i></div>`;

const MO = {key:'', thread:0, open:{}};
/* The five stages of a chapter, as LightSpeed VT delivers them. The third
   value is the gate: the time that has to pass before Continue is honest. */
const STAGE_L = [
  ['Video','12 min · Sarah Kaplan','6:00 of 12:00 watched'],
  ['Reading','6 min · 3 pages','2 of 3 pages'],
  ['Workbook','10 min · 4 prompts','1 of 4 answered'],
  ['Assessment','8 questions · 70% to pass','0 of 8 answered'],
  ['Summary','3 min · what to try this week','']];

/* ==========================================================================
   WHAT LIGHTSPEEDVT SHOWS INSIDE THE FRAME
   Three screens, drawn from Maryam's captures of the real LMS: the chapter
   menu, a chapter, and the completion screen. Only the PAGE CONTENT is
   reproduced — the captures also show our own top bar and rail around it, and
   those are ours and already on the page. Drawing them twice is the mistake
   the captures were made to prevent.

   IT IS A REAL IFRAME, WRITTEN NOT EMBEDDED. `about:blank` is same-origin, so
   the parent can `document.write` into it (this is how the old chapter player
   worked, and it is kept). Two reasons it is a frame and not markup on our
   page. The honest one: in the product this region IS a third-party document,
   and a mock that shares our cascade would quietly inherit our type ramp and
   our button rules and then look right for the wrong reason. The practical
   one: 28 layers of stylesheet cannot reach into a separate document, so none
   of it has to be fought off.

   THE FRAME NAVIGATES ITSELF. Pressing a chapter re-writes the frame; it does
   NOT call `render()`. An embedded application moving between its own screens
   does not re-render its host, and routing it through our render would reset
   our scroll and replay our entrance animations for a click that never
   touched us. `S.ls` is therefore read at write time, not at render time.
   ========================================================================== */
const LS_COURSE = 'TalentAgent Training', LS_CID = '242081';
const LS_CH = [
  ['Welcome and Orientation', '1198420', 'done'],
  ['Test Chapter',            '1203797', 'now' ],
  ['Working the Pipeline',    '1211044', 'todo'],
  ['Closing and Handover',    '1216508', 'todo']];
const LS_STATE = {done:['Complete',100], now:['Not started &middot; up next',0], todo:['Not started',0]};

/* the completion ring. One drawing serves the 56px one on the hero, the 46px
   one on the card and the 44px one on a chapter row, so `dark` is the only
   thing that varies: on the hero it stands on near-black and needs a light
   track and white figure, everywhere else it stands on white. */
const lsRing = (pct, size, dark) => {
  const r = size/2 - 3.5, c = 2*Math.PI*r, m = size/2;
  return `<svg class=ls-ring width=${size} height=${size} viewBox="0 0 ${size} ${size}" aria-hidden=true>
    <circle cx=${m} cy=${m} r=${r+3.5} fill="${dark?'#1b1b1b':'#f2f2f2'}"></circle>
    <circle cx=${m} cy=${m} r=${r} fill=none stroke="${dark?'#3c3c3c':'#e2e2e2'}" stroke-width=4></circle>
    <circle cx=${m} cy=${m} r=${r} fill=none stroke="#79c142" stroke-width=4 stroke-linecap=round
      stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c*(1-pct/100)).toFixed(1)}"
      transform="rotate(-90 ${m} ${m})"></circle>
    <text x=${m} y=${m} text-anchor=middle dy=".36em" font-size="${Math.round(size*0.27)}"
      font-weight=700 fill="${dark?'#fff':'#4a4a4a'}">${pct}%</text></svg>`;
};

const LS_GLYPH = `<svg viewBox="0 0 64 46" class=ls-gl aria-hidden=true>
  <rect x=2 y=2 width=36 height=26 rx=2 fill=#fff opacity=.92></rect>
  <path d="M15 9v12l11-6z" fill=#7d7d7d></path>
  <path d="M6 33h26v2.4H6zM6 38h18v2.4H6z" fill=#fff opacity=.92></path>
  <rect x=34 y=20 width=28 height=24 rx=2 fill=#fff opacity=.92></rect>
  <path d="M40 30h10v2.2H40zM40 35h14v2.2H40z" fill=#8a8a8a></path>
  <path d="M55 24l2.6 2.6L62 22" fill=none stroke=#8a8a8a stroke-width=2></path></svg>`;

const LS_MENU_IC = `<svg viewBox="0 0 20 20" class=ls-mi aria-hidden=true>
  <circle cx=3 cy=4 r=1.6></circle><circle cx=3 cy=10 r=1.6></circle><circle cx=3 cy=16 r=1.6></circle>
  <path d="M8 3h11v2H8zM8 9h11v2H8zM8 15h11v2H8z"></path></svg>`;

/* the black bar a chapter runs under. The course is the small line and the
   chapter is the big one, both with their LightspeedVT ids in parentheses —
   that pairing is how you know which record you are looking at when someone
   sends you a screenshot, which is exactly what happened here. */
const lsHead = (ch) => `<header class=ls-top>
  <button class=ls-burger data-ls=menu title="Chapter menu">${LS_MENU_IC}</button>
  <span class=ls-rule></span>
  <span class=ls-tt><small>${LS_COURSE} (${LS_CID})</small>
    <b>${LS_CH[ch][0]} <i>(${LS_CH[ch][1]})</i></b></span>
  <button class=ls-x data-ls=close title="Close chapter" aria-label="Close chapter">
    <svg viewBox="0 0 24 24"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg>
  </button></header>`;

const LS_SCREEN = {};

LS_SCREEN.menu = () => `<div class=ls-bar><svg viewBox="0 0 20 16" class=ls-bi aria-hidden=true>
    <path d="M1 2.5h7l1.6 2H19v9H1z" fill=none stroke=currentColor stroke-width=1.6></path></svg>
  <span class=ls-rule></span><span>AgentTraining</span></div>
<section class=ls-hero><div class=ls-hero-in>
  <div class=ls-hero-t><button class=ls-back data-ls=close aria-label="Back to course list">&#8249;</button>
    <span class=ls-rule></span><h1>${LS_COURSE}</h1></div>
  <div class=ls-hero-p>${lsRing(25,56,1)}
    <span><b>Course Completion:</b><span>In Progress (1 / 4)</span></span></div>
</div></section>
<nav class=ls-tabs><button class="ls-tab on">Curriculum</button><button class=ls-tab>Course Report</button></nav>
<div class=ls-body>
  <ol class=ls-list>${LS_CH.map((c,i) => {
    const [lab, pct] = LS_STATE[c[2]];
    return `<li><button class="ls-row${c[2]==='now'?' now':''}" data-ls=open data-ch=${i}>
      <span class=ls-thumb>${LS_GLYPH}</span>
      <span class=ls-rb><b>Chapter ${i+1}: ${c[0]}</b><span>${lab}</span></span>
      ${lsRing(pct,44)}</button></li>`;
  }).join('')}</ol>
  <aside class=ls-card><div class=ls-card-art>${LS_GLYPH}</div>
    <div class=ls-card-b><span><b>Course Completion:</b><span>In Progress (1 / 4)</span></span>${lsRing(25,46)}</div>
  </aside>
</div>`;

LS_SCREEN.chapter = (ch) => `${lsHead(ch)}
<div class=ls-doc>
  <h1>${LS_CH[ch][0]}</h1>
  <p class=ls-lead>This page provides reference content for testing LMS formatting, layout, and accessibility components.</p>
  <h2>1. Purpose of This &ldquo;Test Chapter&rdquo; Content</h2>
  <p>The &ldquo;Test Chapter&rdquo; section below includes common LMS elements such as headings, lists, a callout, a quote, a structured table, and responsive images&mdash;intended for layout and rendering checks.</p>
  <div class=ls-note><b>Testing note:</b> Review spacing, typography hierarchy, and component alignment across devices. This content is intentionally neutral and reusable.</div>
  <h2>2. Reference Concepts (Sample)</h2>
  <div class=ls-cols>
    <div><h3>Key idea A</h3><ul>
      <li><b>Clarity:</b> Short sentences and predictable structure improve readability.</li>
      <li><b>Consistency:</b> Use the same heading levels and spacing patterns throughout.</li>
      <li><b>Accessibility:</b> Semantic elements and meaningful alternative text support learners.</li></ul></div>
    <div><h3>Key idea B</h3><ul>
      <li><b>Responsiveness:</b> Components should adapt cleanly from mobile to desktop.</li>
      <li><b>Legibility:</b> Maintain strong contrast and avoid dense paragraphs.</li>
      <li><b>Reusability:</b> &ldquo;Test Chapter&rdquo; blocks can be repurposed for other lessons.</li></ul></div>
  </div>
  <h2>3. Example Visual Block</h2>
  <div class=ls-fig>Test Chapter Reference Image</div>
</div>
<footer class=ls-foot>
  <span class=ls-gate><small>Time required before continuing</small>
    <span class=ls-clock><svg viewBox="0 0 24 24" aria-hidden=true>
      <path d="M9 1h6v2H9zM11 8h2v6h-2z"/><path d="M12 4a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 16a7 7 0 1 1 7-7 7 7 0 0 1-7 7Z"/>
      <path d="m18.7 5.3 1.6-1.6 1.4 1.4-1.6 1.6z"/></svg><b>0:49</b></span></span>
  <button class=ls-btn data-ls=done>Continue</button></footer>`;

LS_SCREEN.done = (ch) => `${lsHead(ch)}
<div class=ls-end>
  <svg class=ls-check viewBox="0 0 80 80" aria-hidden=true>
    <circle cx=40 cy=40 r=34 fill=none stroke=#79c142 stroke-width=6></circle>
    <path d="M24 41.5 34.5 52 57 28.5" fill=none stroke=#111 stroke-width=7
      stroke-linecap=round stroke-linejoin=round></path></svg>
  <p>Your progress has been recorded and is viewable on your REPORT CARD. Please click the &quot;NEXT CHAPTER&quot; button below to continue training, or you can click on the &quot;CHAPTER MENU&quot; button to return to the Chapter Menu where you can select another chapter for training.</p>
  <div class=ls-acts><button class=ls-btn data-ls=menu>Chapter menu</button>
    <button class=ls-btn data-ls=next>Next chapter</button></div>
</div>`;

const LS_CSS = `*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:#fff;color:#111;
  font:400 15px/1.6 "Segoe UI",ui-sans-serif,system-ui,-apple-system,sans-serif;
  display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.ls-rule{width:1px;height:20px;background:currentColor;opacity:.4;flex:none}
.ls-top{flex:none;display:flex;align-items:center;gap:14px;padding:0 20px;height:70px;background:#000;color:#fff}
.ls-burger{display:grid;place-items:center;padding:6px;opacity:.95}
.ls-mi{width:20px;height:20px;fill:#fff}
.ls-tt{display:flex;flex-direction:column;line-height:1.15;min-width:0}
.ls-tt small{font-size:11px;opacity:.82}
.ls-tt b{font-size:22px;font-weight:700;letter-spacing:-.2px}
.ls-tt i{font-style:normal;font-size:11px;font-weight:400;opacity:.82}
.ls-x{margin-left:auto;display:grid;place-items:center;width:44px;height:44px}
.ls-x svg{width:30px;height:30px;fill:#fff}
.ls-bar{flex:none;display:flex;align-items:center;gap:12px;padding:0 22px;height:40px;
  background:#1d1d1d;color:#fff;font-size:13px}
.ls-bi{width:19px;height:15px;color:#fff}
.ls-hero{flex:none;position:relative;background:#2c2c2c;overflow:hidden;padding:34px 62px 30px}
.ls-hero::before{content:"";position:absolute;inset:-60px;filter:blur(30px);
  background:radial-gradient(230px 150px at 44% 42%,rgba(255,255,255,.22),transparent 70%),
    radial-gradient(300px 190px at 72% 38%,rgba(255,255,255,.14),transparent 70%),
    radial-gradient(260px 200px at 28% 82%,rgba(255,255,255,.10),transparent 70%),#303030}
.ls-hero-in{position:relative;color:#fff}
.ls-hero-t{display:flex;align-items:center;gap:16px}
.ls-back{font-size:34px;line-height:1;padding:0 2px}
.ls-hero-t h1{margin:0;font-size:40px;line-height:1.1;font-weight:700;letter-spacing:-.6px}
.ls-hero-p{display:flex;align-items:center;gap:14px;margin-top:18px}
.ls-hero-p span{display:flex;flex-direction:column;font-size:15px;line-height:1.45}
.ls-tabs{flex:none;display:flex;padding:0 62px;border-bottom:1px solid #e4e4e4;background:#fff}
.ls-tab{padding:15px 18px;font-size:15px;color:#666;border-bottom:3px solid transparent;margin-bottom:-1px}
.ls-tab.on{color:#111;font-weight:700;border-bottom-color:#111}
.ls-body{flex:1;min-height:0;overflow:auto;padding:28px 62px 60px;display:grid;gap:34px;
  grid-template-columns:minmax(0,1fr) 390px;align-items:start;background:#fff}
.ls-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.ls-row{width:100%;display:flex;align-items:center;gap:16px;padding:12px;text-align:left;
  border:1px solid #e0e0e0;background:#fff}
.ls-row.now{border-color:#111;box-shadow:inset 3px 0 0 #111}
.ls-thumb{flex:none;width:118px;height:66px;background:#7a7a7a;display:grid;place-items:center}
.ls-gl{width:52px;height:38px}
.ls-rb{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.ls-rb b{font-size:15px;font-weight:700}
.ls-rb span{font-size:13px;color:#6a6a6a}
.ls-card{border:1px solid #ddd;background:#fff}
.ls-card-art{height:200px;background:#7a7a7a;display:grid;place-items:center}
.ls-card-art .ls-gl{width:132px;height:96px}
.ls-card-b{display:flex;align-items:center;gap:14px;padding:16px}
.ls-card-b > span{flex:1;display:flex;flex-direction:column;font-size:15px;line-height:1.45}
.ls-doc{flex:1;min-height:0;overflow:auto;padding:34px 122px 48px;background:#fff}
.ls-doc h1{margin:0 0 14px;font-size:44px;line-height:1.1;font-weight:700;letter-spacing:-1px}
.ls-doc h2{margin:34px 0 12px;font-size:28px;line-height:1.2;font-weight:700;letter-spacing:-.4px}
.ls-doc h3{margin:0 0 10px;font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-.2px}
.ls-doc p{margin:0 0 12px}
.ls-lead{color:#222}
.ls-note{margin:18px 0 6px;padding:16px 20px;background:#f6f6f6;border:1px solid #e6e6e6}
.ls-cols{display:grid;grid-template-columns:1fr 1fr;gap:34px;margin-top:4px}
.ls-cols ul{margin:0;padding-left:20px}
.ls-cols li{margin-bottom:8px}
.ls-fig{margin-top:14px;max-width:830px;height:300px;background:#d9d9d9;display:grid;place-items:center;
  color:#8f8f8f;font-size:31px;text-align:center;padding:0 20px}
.ls-foot{flex:none;display:flex;align-items:center;justify-content:flex-end;gap:22px;
  padding:14px 62px;border-top:1px solid #e4e4e4;background:#fff}
.ls-gate{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.ls-gate small{font-size:11px;font-weight:600;color:#555}
.ls-clock{display:flex;align-items:center;gap:7px;color:#e8342a}
.ls-clock svg{width:19px;height:19px;fill:currentColor}
.ls-clock b{font-size:17px;font-weight:700;font-variant-numeric:tabular-nums}
.ls-btn{background:#111;color:#fff;padding:15px 26px;font-size:12px;font-weight:700;
  letter-spacing:.6px;text-transform:uppercase}
.ls-row:hover{background:#fafafa;border-color:#bdbdbd}
.ls-btn:hover{background:#333}
.ls-x:hover,.ls-burger:hover,.ls-back:hover{opacity:.7}
.ls-end{flex:1;min-height:0;overflow:auto;padding:110px 40px 60px;text-align:center}
.ls-check{width:82px;height:82px;display:block;margin:0 auto 26px}
.ls-end p{max-width:820px;margin:0 auto}
.ls-acts{display:flex;justify-content:center;gap:20px;margin-top:64px}
@media (max-width:1000px){
  .ls-hero,.ls-tabs,.ls-body,.ls-foot{padding-left:24px;padding-right:24px}
  .ls-doc{padding-left:24px;padding-right:24px}
  .ls-body{grid-template-columns:minmax(0,1fr)}
  .ls-hero-t h1{font-size:28px}
  .ls-doc h1{font-size:32px}.ls-doc h2{font-size:23px}
  .ls-cols{grid-template-columns:1fr;gap:20px}
  .ls-fig{height:200px;font-size:22px}}
@media (max-width:620px){
  .ls-row{flex-wrap:wrap}.ls-thumb{width:88px;height:52px}
  .ls-acts{flex-direction:column;align-items:center;gap:12px}
  .ls-end{padding-top:56px}}`;

const LSVT_PAGE = () => `<!doctype html><html lang=en><head><meta charset=utf-8>
<title>${LS_COURSE}</title><style>${LS_CSS}</style></head>
<body>${(LS_SCREEN[S.ls.screen] || LS_SCREEN.menu)(S.ls.ch)}</body></html>`;

/* Where the frame is, between writes. It is on `S` so a stage change or a trip
   out to the dashboard and back finds the module where it was left. */
S.ls = {screen:'menu', ch:1};

/* about:blank is same-origin, so the document can simply be written. */
function mountLsvt(){
  device.querySelectorAll('iframe.lsvt-if').forEach(fr => {
    const d = fr.contentDocument;
    if(!d) return;
    d.open(); d.write(LSVT_PAGE()); d.close();
    /* the listener goes on the document we just wrote, and is lost with it on
       the next write — which is why it is re-attached here every time rather
       than once at mount */
    d.addEventListener('click', e => {
      const b = e.target.closest('[data-ls]');
      if(b) lsGo(b.dataset.ls, b.dataset.ch);
    });
  });
}

/* THE FIVE THINGS YOU CAN PRESS IN THERE
   open  — a chapter row on the menu
   done  — Continue, at the foot of a chapter
   next  — Next chapter, on the completion screen
   menu  — Chapter menu, and the list control in the black bar
   close — the cross, and the chevron on the hero. It leaves the chapter, which
           for us means the chapter menu: the module is the whole of Coursework,
           so there is nothing above the menu to close out to. */
function lsGo(what, ch){
  if(what === 'open') S.ls = {screen:'chapter', ch:+ch};
  else if(what === 'done') S.ls = {screen:'done', ch:S.ls.ch};
  else if(what === 'next') S.ls = {screen:'chapter', ch:Math.min(S.ls.ch+1, LS_CH.length-1)};
  else S.ls = {screen:'menu', ch:S.ls.ch};
  mountLsvt();
}

/* ============================================================
   TAL COMES FIRST
   Wherever Tal has something to say about a page, it is the first thing on
   that page — above the panels it is talking about, on every device. The
   card is authored where it reads best in source order; this moves it.
   ============================================================ */
function talFirst(){
  device.querySelectorAll('.main > .page').forEach(page => {
    const kids = [...page.children];
    const sec = kids.find(el => el.classList.contains('sec') && el.querySelector('.ai-aura'));
    if(!sec) return;
    const anchor = page.querySelector(':scope > .ph, :scope > .lvl-hero')
                || page.querySelector(':scope > .crumb');
    if(anchor){
      if(anchor.nextElementSibling !== sec) anchor.insertAdjacentElement('afterend', sec);
    } else if(page.firstElementChild !== sec){
      page.prepend(sec);
    }
  });
}

/* One past interview: who set what, and the three things it left behind. */
/* THE ROW IS A ROW AGAIN — THE KIT STRIP IS GONE.
   It carried three tiles: the 45-minute recording, the full transcript, and
   the scenes. The first two went first, because neither is a screen in the
   candidate's flow — the recording is what the agent assessed against and the
   transcript is what Tal reads, and the report page no longer links to either.

   The remaining two went with them. "3 scenes" and "Your report" named the
   two things on the page this row opens, which is not information: the row is
   already one click target with an arrow at its end, so a strip of tiles
   underneath was a table of contents for a page one press away, and it made a
   two-line row four lines tall. What the row has to say is which interview,
   when, who ran it and what it decided, and all four are above.

   `.ivrow-kit`, `.kit`, `.kit-ic` and `.kit-b` are still styled in §15 and
   are now drawn nowhere. Left in place: `.kit` is the product's only compact
   "an artefact and what it is" mark, and it is what the recording will come
   back as if it is ever the candidate's to open.

   `len` is still taken as an argument and no longer drawn, for the same
   reason — the callers pass the recording length. */
function ivRow(kind, label, date, outcome, len){
  const a = AGENTS.priya;
  return `<div class="ivrow" role="button" tabindex="0" data-go="report" data-iv="${kind}">
    <div class="ivrow-h">
      <span class="ivrow-eb">${label} &middot; ${date}</span>
      <span class="ivrow-out">${outcome}</span>
    </div>
    <div class="ivrow-who">
      ${avatar(a,40)}
      <span class="ivrow-wb"><b>${a.n}</b><span>45 minutes &middot; report signed</span></span>
      <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
    </div>
  </div>`;
}

/* The cohort. Five photographs are available and the group is ten, so the
   faces repeat — a prototype fidelity choice, not a claim about the people. */
const COHORT = [
  ['Maryam Naz','MN','hana','Chapter 13 &middot; active today',true],
  ['Aisha Bello','AB','priya','Active today'],
  ['Daniel Kerr','DK','owen','Active today'],
  ['Sofia Marchetti','SM','lena','Active 2 days ago'],
  ['Ravi Chandran','RC','samuel','Active today'],
  ['Nora Lindqvist','NL','lena','Active 3 days ago'],
  ['James Whitby','JW','owen','Active today'],
  ['Chloe Ferreira','CF','priya','Active 5 days ago'],
  ['Tobias Mensah','TM','samuel','Active 8 days ago'],
  ['Yuki Tanaka','YT','hana','Not active recently']];

/* The room. Everyone is somebody else, so everything sits on the left. */
const ROOM = [
  ['day','Yesterday'],
  ['Daniel Kerr','owen','DK','Did anyone else find chapter 4 harder than the three before it? I have read the handover section twice.','4:12 PM'],
  ['Aisha Bello','priya','AB','Yes. It is the first one that asks you to change something at work rather than understand something.','4:31 PM'],
  ['Maryam Naz','hana','MN','I took a piece of work back off someone this week and could not explain why. That is the whole chapter, I think.','7:02 PM',true],
  ['day','Today'],
  ['Ravi Chandran','samuel','RC','Priya said on the call that the handover is where it fails, not the work. That helped me.','8:40 AM'],
  ['Sofia Marchetti','lena','SM','Bringing my example on Thursday. Mine is a vendor review that went badly and I still think I was right to take it back.','9:15 AM']];

/* THE ATTRIBUTION IS A HEADER ON A BOARD POST, NOT A FOOTNOTE.
   In the one-to-one thread there are two people and the sides say which is
   which, so "Priya Nair · 11:04 AM" under a bubble is a timestamp you look at
   only if you want it. On a board every consecutive post is a different
   person, and the name is the first thing you need — reading it after the
   sentence means re-reading the sentence knowing who said it.

   So the name and the time are separate elements rather than one string
   joined by a middot: §37.14 sets them above the bubble and gives them
   different weights, which a single text node cannot carry. The middot goes
   with the join — two elements a gap apart do not need a separator to be two
   things. */
function roomLine(name, img, ini, body, when, mine){
  return `<div class="m them">
    <span class="m-av">${avatar({i:ini, img:AV[img]}, 32)}</span>
    <div class="m-c">
      <div class="m-w"><b>${mine ? 'You' : name}</b><span>${when}</span></div>
      <div class="m-b">${body}</div>
    </div>
  </div>`;
}

function discussionRoom(){
  return `<div class="msgs room">
    ${ROOM.map(r => r[0] === 'day'
      ? `<div class="m-day"><span>${r[1]}</span></div>`
      : roomLine(r[0], r[1], r[2], r[3], r[4], r[5])).join('')}
  </div>
  <div class="composer room-composer">
    <button class="composer-act composer-lead" aria-label="Attach a file">${I.attachment}</button>
    <input class="inp" placeholder="Say something to Cohort 41" aria-label="Message the cohort">
    <button class="composer-send" aria-label="Send">${I.send}</button>
  </div>`;
}

/* The cohort standing. Points, badges earned and star rank per member;
   the candidate's own row is marked wherever it lands. */
const BOARD = [
  ['Aisha Bello','AB','priya',   3420, 1, 2],
  ['Ravi Chandran','RC','samuel',2980, 1, 2],
  ['Daniel Kerr','DK','owen',    2610, 1, 1],
  ['James Whitby','JW','owen',   2240, 0, 1],
  ['Maryam Naz','MN','hana',     1095, 0, 1, true],
  ['Sofia Marchetti','SM','lena',1040, 0, 1],
  ['Chloe Ferreira','CF','priya',  920, 0, 1],
  ['Nora Lindqvist','NL','lena',   780, 0, 1],
  ['Tobias Mensah','TM','samuel',  610, 0, 1],
  ['Yuki Tanaka','YT','hana',      240, 0, 1]];

function boardList(){
  return `<div class="board">
    <div class="brow bhead">
      <span>#</span><span>Member</span><span>Earned</span><span class="num">Points</span>
    </div>
    ${BOARD.map(([n,i,img,pts,bdg,rank,mine],k)=>`<div class="brow${mine?' mine':''}">
      <span class="b-n">${k+1}</span>
      <span class="b-who">${avatar({i, img:AV[img]}, 32)}<span class="b-nm">${mine?'You':n}</span></span>
      <span class="b-earn">
        <span class="b-mk" title="${rank}-Star"><img src="${AWARD['rank'+rank]}" alt="${rank}-Star"></span>
        ${bdg?`<span class="b-mk" title="Bronze"><img src="${AWARD.bronze}" alt="Bronze"></span>`:''}
        <span class="b-earn-t">${rank}-Star${bdg?' &middot; '+bdg+' badge':''}</span>
      </span>
      <span class="b-pts num">${pts.toLocaleString()}</span>
    </div>`).join('')}
  </div>`;
}

/* ONE FIGURE CELL, IN ONE PLACE. Three views drew this cell inline — the quiz
   results, the course summary on Enroll, the transcript — twelve copies of the
   same four-part shape, which is twelve places to miss when the shape changes.
   It changed: the label and the figure now share a line, so they need a wrapper
   the inline version did not have. One function, three call sites.

   `.stat-top` is the wrapper, and the reason it is a flex row rather than two
   more grid areas is the same reason `.stand-top` is: when the label and the
   figure cannot share a line they have to wrap as a PAIR, and a grid cell
   cannot do that. §29.17 has the layout. */
/* `jump` IS OPTIONAL AND CHANGES THE ELEMENT, NOT THE CONTENTS. A figure cell
   that scrolls the page to the section it counts is a control, and a control
   has to be a button — a div with a click handler is unreachable by keyboard
   and unannounced by a screen reader. Every existing call site passes four
   arguments and keeps the div it always had; the leader's dashboard passes a
   fifth and gets four buttons. The contents are identical either way, which is
   the point of the helper: §29.17's one-line label-and-figure pair is stated
   once whether the cell is read or pressed.

   The local is `body`, not `inner` — `inner()` is the global that returns an
   icon's paths, and shadowing it inside the one helper every figure band goes
   through is a trap set for whoever adds an icon to this cell next. */
/* THE SIGNED SUMMARY OF THE INTERVIEW, WHEREVER THE REPORT ITSELF IS NOT
   My Level has carried this card since §29.16: who signed it, the two
   paragraphs the agent actually wrote, and one button into the full report.
   The `assessed` dashboard needs the same thing for the same reason — the
   interview is the only thing that has happened to this candidate and the
   dashboard was showing the RESULT of it (a level, a black hero) without a
   word of what was said. So it is a function now rather than a second copy
   drifting away from the first.

   `withNote` is the one difference, and it is deliberate. On My Level the
   card sits under a hero that already declares the level and a page whose
   subject is the ladder, so the quote would be a third voice on a page about
   a number. On the dashboard this card is the ONLY place the interview
   speaks, so Priya's own sentence — the one that names why E3 and not E2 —
   goes in. Same card, one extra line where there is room for it.

   AND `re` IS THE RE-INTERVIEW'S. Same card, the other interview: after the
   90 days Priya writes a second report, and on the `promoted` dashboard
   that is the one the reader has just been given. The two must not be mixed
   up — the August report argued E3 off a reorganization the candidate had
   just started, the November one is written off thirteen finished chapters —
   so the whole of the text switches, not just the date. */
/* `footAction` — THE "READ THE FULL REPORT" BUTTON AT THE FOOT, AND IT IS A
   PARAMETER BECAUSE THE ANSWER DIFFERS BY CALL SITE.

   On the two dashboards this card sits inside a section whose HEAD already
   carries "Read the full report", so the foot button was the same words
   pointing at the same view a hand's width lower: one destination offered
   twice, which makes a reader stop to work out whether they differ.

   On `V.level` it is the opposite, and that call site's own comment is
   explicit — "ONE CONTROL, AT THE FOOT ... The button says it better, and says
   it where the reading ends." There the card has no section head to carry a
   route, so dropping the foot button would drop the route.

   A FLAG RATHER THAN A DELETION, DEFAULTING TO OFF: a new call site that
   forgets it gets the version with no duplicate, which is the safe failure. */
function signedSummary(withNote, re, footAction){
  return `<div class="signed">
      <div class="signed-h">
        <span class="av-ph" style="width:36px;height:36px;font-size:12px"><i>PN</i><img src="${AV.priya}" alt=""></span>
        <span class="signed-b"><b>Assessed and signed by Priya Nair</b><span>${re?'Re-interview &middot; 21 November 2026':'Level interview &middot; 20 August 2026'}</span></span>
      </div>
      <div class="ai-body">
        <p class="t-label-01 sig-l">Strengths</p>
        <p>${re
          ?'You argue your own decisions from evidence now, and you no longer play them down as you give them. Three examples out of the 90 days, each with a name and a date on it.'
          :'You reason from consequence to people, not policy. Three examples, each with a date and a name attached.'}</p>
        <p class="t-label-01 sig-l">Growth areas</p>
        <p>${re
          ?'Delegation still, and coaching rather than fixing. Chapters 3 and 9 on the E4 course are built on exactly this.'
          :'Delegation, and coaching rather than fixing. Chapters 4 and 12 are built on exactly this.'}</p>
      </div>
      ${withNote?`<div class="note band">
        <span style="fill:var(--icon-secondary)">${I.user}</span>
        <div class="nb"><b>Priya&rsquo;s note</b>${re
          ?'&ldquo;She came back with the reorganization finished and could tell me which parts of it she would do differently. That is an E4.&rdquo;'
          :'&ldquo;She talks cautiously, but she has already run a reorganization and can explain every call she made in it. That is an E3, not an E2.&rdquo;'}</div>
      </div>`:''}
      ${footAction?`<div class="ai-foot signed-foot"><button class="btn btn-p btn-sm noic" data-go="report">Read the full report ${I.arrowRight}</button></div>`:''}
    </div>`;
}

/* THE QUIZ RESULT, ON EVERY DASHBOARD STAGE THAT STILL HAS NO LEVEL
   `consult`, `new` and `booked` are all the same sentence — the quiz has
   happened and nothing has replaced it yet — so all three now print the same
   four figures rather than the reader losing sight of their score the moment
   they finish signing up. One function, not three copies, because only two
   things vary and both are worth varying:

   `taken`      each stage's own stepper prints a quiz date, and the block
                cannot contradict a line three inches above it. consult was
                sat on 3 Aug; from `new` on, the stepper says 12 Aug.
                ALL THREE CALL SITES NOW PASS `qzTaken()`, which is that rule
                as a function — the Quiz result page has to say the same date
                and two literals in two files is one edit away from
                disagreeing. The parameter stays: a caller with a different
                date is the whole reason it is a parameter.
   `levelNote`  the fourth cell's job is to say what WILL set the level, and
                by `booked` that is a named agent on a known date rather than
                an interview nobody has arranged. Same "Not set" value, more
                specific answer to the question the value provokes. */
/* AND IT SITS ON THE PANEL TONE, `sec tint` — #F7F7F7, §12's `--surface-2`.
   Plain `.tint` and nothing else: §12's note says `--surface-2` is the ground
   for "a section the reader is meant to treat as one object", which is what
   four figures under one heading are, on a page whose other sections are
   things you DO — book an agent, open a chapter.

   IT WAS `tint info` (#FBFBFB) FIRST, and the two are worth keeping straight
   because both are one step off white. §45's lighter value is for a section
   that should RECEDE — background reading nobody is being asked to act on,
   which is what the agent portal's four `.tint.info` sections are. This block
   is not receding: it is the answer to "where do I stand" and the first thing
   under the agent rail.

   NOTHING IS RESTATED TO CHANGE IT, which is the point of §45's mechanism.
   §45 works by declaring `--surface-2` ON the element, so §12's twenty-odd
   `.sec.tint` selectors — the hairlines stepping to `--rule-on-2`, `.stats`
   repainting its cells so its 1px grid gaps still read as rules — resolve
   against whichever value is in scope. Dropping one class moves the whole
   tone system with it, and `.info` alone would have been a colour with none
   of that behind it.

   ALL THREE STAGES, because this is one function and the block is the same
   block. `consult`, `new` and `booked` print the same four figures — the
   note above says why — so tinting the function rather than a call site is
   what stops the quiz block being a panel on one stage and a plain section
   on the next. */
/* AND ITS FOUR CELLS ARE CARDS ON THE PANEL, `cards` — §55. White fills, so
   the four figures read as four separate facts rather than as regions of one
   divided area, which is what they are: a title, a score, a date and a level,
   each with its own icon. It also matches the three bordered agent cards
   directly above it, which is what makes the foot of the page read as one
   page. The grid keeps `--rule-on-2`, so the hairlines between cells are still
   the 1px gaps and are more visible against white than they were against the
   panel. §55 carries the argument and the one thing that rides along with it
   (the head button, which §02 leaves transparent and which was the only thing
   in the block still the panel's colour). */
/* THE PANEL IS BACK, AND THE PAIR IS WHAT DECIDES IT. This block has worn three
   tones — `tint info` (#FBFBFB, §45's "background reading"), then `tint cards`
   (#F7F7F7 with white cells, §55), then plain white for one build — and the
   argument was always about the block on its own. It is not on its own: on the
   booked dashboard it closes the page under "Your session, step by step", and
   two sections in a row cannot both be filled or the page reads as panels all
   the way down. One of the two takes the panel and the other takes the canvas.

   THE QUIZ BLOCK IS THE FILLED ONE, on Maryam's call and on §12's own test: a
   panel is for "a section the reader is meant to treat as one object", and four
   figures under one heading are exactly that, while the interview section is a
   sentence, a strip and a numbered list — three kinds of thing that are not one
   object. `cards` with it, so §55 takes the four cells white against the panel
   and the 1px grid gaps stay readable as rules.

   ALL THREE STAGES, because this is one function and the block is the same
   block. `consult`, `new` and `booked` print the same four figures. */
function quizResults(taken, levelNote){
  return `<div class="sec tint cards">
      <div class="sec-h"><h2>Quiz results</h2><button class="btn btn-g btn-sm noic" data-go="result">See full breakdown</button></div>
      <div class="stats">
        ${statCell(I.trophy, `Title given`, `Explorer`, `first of three tracks`)}
        ${statCell(I.chart, `Quiz score`, `64<small>/100</small>`, `places you on Explorer`)}
        ${statCell(I.calendar, `Taken`, taken, `2026 &middot; one attempt`)}
        ${statCell(I.growth, `Level`, `Not set`, levelNote)}
      </div>
    </div>`;
}
/* AND `ic` IS OPTIONAL — pass nothing and the cell has no mark at all, which is
   a different thing from passing an empty one. §29 draws the mark as a 28px chip
   in one of four hues and §24 as the warm Tal-chip square; an empty `.stat-ic`
   would keep the chip, the hue and the `auto` grid column it sits in, so the
   cell would be three lines indented past a coloured blank. §56 states the
   mark-less cell's template — one column, three rows — against the same
   `:not(:has(> .stat-ic))` test this line creates. */
function statCell(ic, label, value, note, jump){
  const body = `${ic ? `<span class="stat-ic">${ic}</span>` : ''}
      <div class="stat-top"><div class="l">${label}</div><div class="n">${value}</div></div>
      <div class="d">${note}</div>`;
  return jump
    ? `<button class="stat stat-jump" data-jump="${jump}">${body}</button>`
    : `<div class="stat">${body}</div>`;
}

/* Three standings, three marks. Points is a number moving toward a target,
   badges are a count out of four, rank is where those two put you. */
function standRow(g){
  const nb = nextBadge(g.pts);
  const bdgArt = ['bronze','silver','gold','involved'][Math.max(0, Math.min(3, g.badges-1))];
  /* THE LABEL AND THE FIGURE ARE ONE LINE. `.stand-top` is the only structural
     change: the label used to stack above the figure, which put four things in
     a column and made each cell read as a little paragraph. Paired on one line
     — name hard left, number hard right — the three cells line up as a table
     you can read across, and the note keeps the full width beneath them.

     AND THE THIRD CELL IS THE SAME AS THE OTHER TWO. Points used to carry a
     progress bar under its note, which made one cell of three a row taller
     than its neighbours: the box took its height from that cell, and the two
     without a bar had their content stranded above centre in the space it
     left. The bar was also saying what the note already says in words —
     "1,405 to Bronze" is the same fact, and the only one of the two you can
     read without measuring a stripe. Gone, so all three cells hold two lines,
     the box is as tall as it needs to be, and every cell's content sits on
     the same centre line. §29.15 has the rest. */
  const cell = (art, artOff, label, value, note) => `
    <button class="stand-c" data-go="rewards">
      <span class="stand-mk${artOff?' none':''}"><img src="${art}" alt=""></span>
      <span class="stand-b">
        <span class="stand-top">
          <span class="stand-l">${label}</span>
          <span class="stand-v">${value}</span>
        </span>
        <span class="stand-d">${note}</span>
      </span>
    </button>`;
  return `<div class="stand">
    ${cell(AWARD.points, false, 'Points', g.pts.toLocaleString(),
      nb ? (nb.need-g.pts).toLocaleString()+' to '+nb.n : 'Every badge earned')}
    ${cell(AWARD[bdgArt], !g.badges, 'Badges', g.badges+' <small>of 4</small>',
      g.badges ? BDG[g.badges-1].n+' earned' : 'Bronze at 2,500 points')}
    ${cell(AWARD['rank'+g.rank], false, 'Rank', RANKS[g.rank-1].n,
      g.rank<3 ? RANKS[g.rank].d : 'The top of the ladder')}
  </div>`;
}

function render(){
  const f = cfg(S.stage);
  let html;
  /* A LIVE CALL IS NOT A PAGE, so it takes the frame: no app bar, no rail, no
     Tal. It is FIRST because it is on top of everything — whatever page you
     pressed Join on is still what `S.view` says and is what comes back when
     the call ends, so the branch cannot be keyed on the view.

     `callScreen` LIVES IN ai10.js, the last file in the bundle, so it is
     undefined at every render until that file is parsed — which is exactly
     the shape the `nil` branch below has and is safe for the same reason:
     `S.call` starts null and only ai10's own router can set it, so the guard
     can never be the thing that decides whether a call is showing. §60 draws
     it; ai10 holds the state, the copy and the clock. */
  if(S.call && typeof callScreen === 'function'){
    html = callScreen();
  } else
  /* THE RUN-UP IS NOT THE PRODUCT, so it gets neither shell nor auth card:
     nil.js draws its own site bar and its own scroller, and the branch is
     first because `nil` is first in the journey. TEMPORARY — this branch, the
     two `nil` rows in data.js, nil.js and 30-nil.css are the whole feature.
     `NIL` is declared in nil.js, which is the last file in the bundle; every
     render before it is parsed is on some other stage, and this branch is
     never taken until a stage change brings you here. */
  if(S.stage==='nil'){
    html = '<div class="nil">' + (NIL[S.view] || NIL.quiz)() + '</div>';
  } else if(S.stage==='signup'){
    const inner = (AUTH[S.view]||AUTH.create)();
    html = S.view === 'terms' ? inner
         : '<div class="auth-card">' + AUTH_ART
           + '<div class="auth-col">' + inner + '</div></div>';
  } else {
    /* THE FALLBACK HAS TO KNOW WHICH PORTAL IT IS FALLING BACK INTO. `V.dashboard`
       is the candidate's, and landing a leader on it after a bad deep link would
       show them somebody else's 90 days behind their own rail.

       AND IT HAS TO END SOMEWHERE THAT EXISTS. `V.leadDash` is registered by
       lead.js, which is parsed nine files after this one — so at the boot
       render (the last statement in this file, per trap 8) the leader branch
       resolved to `undefined` and `view(f)` threw. Uncaught, at the top level:
       it took the rest of the bundle with it, so lead.js through ai7.js never
       ran and the frame stayed empty. That was reachable the moment a reload
       could restore `S.portal === 'leader'`, which is what the hash reader at
       the foot of this file now does.

       `&&` rather than `?:` for exactly that: the leader's fallback applies
       when there IS one, and the candidate's dashboard — defined above, in
       this file, unconditionally — is the floor. The boot paint of a restored
       leader page is therefore the candidate dashboard for one frame, and
       lead4.js's own `render()` at its foot redraws it as the leader's page
       with `S.view` already correct. */
    const view = V[S.view] || (isLead() && V.leadDash) || V.dashboard;
    /* NO FLOATING TAL OVER THE COURSEWARE. The button is bottom-right of the
       view column, and bottom-right of a LightspeedVT chapter is its Continue
       — the two land on each other, and ours is on top. We do not get to put a
       control over somebody else's control. It is also the one region of the
       product where Tal can see nothing: the chapter is in a frame we do not
       read. Tal is a rail away on every page that leads here. */
    const NO_FAB = ['terms','coursework','chapter'];
    html = shell() + '<div class="shell-body">' + sidenav(f) + '<div class="view-col">' + view(f) + '</div></div>' + (NO_FAB.includes(S.view)?'':talFab())
         + talPanel(f) + notifPanel() + (S.view==='billing'?cardSheet():'')
         + (S.view==='account'?profileSheet()+photoSheet():'');
  }
  /* THE CALL IS PART OF THE KEY, because it is a whole surface arriving and
     leaving: without it, joining a call is a repaint of the same stage and
     view, `entered` is false, and §60's entrance never plays — while every
     mute press, which IS the same surface, would replay it if the key were
     the kind alone. Opening and closing each change the key exactly once. */
  const key = S.stage + '/' + S.view + (S.call ? '/call' : '');
  const entered = key !== MO.key;
  const OVERLAYS = ['nav','notif','tal','editProfile','editPhoto','addCard','notes'];
  /* `data-open` is a TRANSITION MARKER and it is meant to be: §13.2 gates every
     entrance on it precisely because it lasts one render, so an animation does
     not replay each time a switch is flipped or a character is typed.

     `data-shown` is the STATE. It lists what is open right now, on every render
     for as long as it stays open, and it is what a LAYOUT rule has to ask —
     "is Tal open", not "did Tal just open". Three rules had the margins on
     `data-open` and so they held for exactly one frame: opening Tal from the
     rail happened to be that frame, but a chip on the page sets `S.tal` and
     then asks, and the ask renders again — by which point the marker is gone
     and the page took its margins back with the panel still open.

     Two attributes because they answer two different questions. Motion keeps
     `data-open`; anything that must survive the next render reads `data-shown`. */
  const opened = OVERLAYS.filter(k => S[k] && !MO.open[k]);
  const shown  = OVERLAYS.filter(k => S[k]);
  const grew = S.thread.length > MO.thread;
  MO.key = key;
  MO.thread = S.thread.length;
  for(const k of OVERLAYS) MO.open[k] = !!S[k];
  const at = ` data-rail="${S.nav ? 'open' : 'shut'}"`
           + (entered ? ' data-enter' : '')
           + (opened.length ? ` data-open="${opened.join(' ')}"` : '')
           + (shown.length ? ` data-shown="${shown.join(' ')}"` : '')
           + (grew ? ' data-said' : '');
  device.innerHTML = IOS_TOP + `<div class="app"${at}>${html}</div>` + IOS_BOTTOM;
  pick.value = S.stage;
  const st = STAGES.find(s=>s[0]===S.stage);
  /* THE LEADER'S HASH CARRIES THE STAGE TOO, and that third segment is the
     whole of what makes a reload land where you were. `#leader/<view>` was
     already being written, but the boot reader at the foot of this file only
     knew how to restore a hash whose first segment is a STAGE — `leader` is
     not one, so it fell through to `setStage('new')` and a reload on the
     leader portal dropped you on the candidate's dashboard.

     The stage is written even though no leader page reads it, because the
     portal switch does not change the stage: flip to the leader, reload, flip
     back, and without this you would return to `new` rather than to the
     candidate you left. Two segments still restore correctly — the reader
     defaults the third — so a bookmarked `#leader/leadEvals` keeps working. */
  histWrite('replaceState',null,'',
    isLead() ? '#leader/'+S.view+'/'+S.stage : '#'+S.stage+'/'+S.view);
  for(const pass of [talFirst, enhanceTalCards, mountLsvt]){
    try { pass(); } catch(e) { console.warn('pass failed:', e); }
  }
  /* the cascade is a per-section delay, capped so a long page never waits */
  const app = device.querySelector('.app');
  if(app && app.hasAttribute('data-enter')){
    const kids = device.querySelectorAll('.page > .sec, .page > .ph, .page > .lvl-hero, .page > .acc, .page > .tabs');
    kids.forEach((el,i) => el.style.setProperty('--i', Math.min(i,7)));
  }
  const tb = device.querySelector('#talBody'); if(tb) tb.scrollTop = tb.scrollHeight;
  /* THERE IS NO STEPS PANEL TO LIFT OUT OF `.app` ANY MORE. Two removals, in
     order: the panel was `position:fixed` and had to be moved here because
     `.device`'s `container-type:inline-size` makes it the containing block for
     a fixed descendant, so a fixed popup declared in the band was clipped by
     it; §33.7 made it an absolutely-positioned dropdown, which needed no lift;
     §56 opened the steps into the band, which needs no dropdown. The note is
     kept because `position:fixed` inside `.device` is a trap the next popup
     will walk into, and this is where it was found. */
}

pick.onchange = e => setStage(e.target.value);
document.getElementById('back').onclick = back;
/* the browser and hardware back buttons drive the same stack */
window.addEventListener('popstate', () => { if(S.hist.length) back(); });
document.getElementById('reset').onclick = () => setStage(S.stage);

/* card number: group the digits and show the brand as it is recognised */
device.addEventListener('input', e => {
  if(e.target.id !== 'nc') return;
  const el = e.target, dig = el.value.replace(/\D/g,'').slice(0,19);
  const amex = /^3[47]/.test(dig);
  const g = amex ? [4,6,5] : [4,4,4,4,3];
  let out = '', i = 0;
  for(const n of g){ if(i>=dig.length) break; out += (out?' ':'') + dig.substr(i,n); i += n; }
  el.value = out;
  const mk = document.getElementById('ncb'), b = brandOf(dig);
  if(mk){ mk.innerHTML = BMK[b] || BMK.card; mk.classList.toggle('on', !!b); }
});

/* THE "CLICK AWAY TO CLOSE THE STEPS PANEL" LISTENER IS GONE WITH THE PANEL.
   It was here because the dropdown had no scrim to press: closing had to come
   from the ABSENCE of a hit inside `.stp`, which is not a branch the router can
   hold. §56 opens the steps for good, so there is nothing to close, no
   `S.piOpen` to hold it in and no `data-stp` branch in the router either. */

/* one delegated listener runs the whole product */
device.addEventListener('click', e => {
  const t = e.target;

  /* EVERY ASK OPENS THE SAME SURFACE.
     This used to be `S.tal = true; ask(q)` — the question went into the side
     panel. The panel is off (§27.9 in the stylesheet): there is one Tal now,
     the field docked at the bottom of every page, and asking from anywhere
     opens that. `askOpen` lives in ai4.js and is a function declaration in a
     bundle that is one script, so it is hoisted above this listener however
     late in the file it is written. */
  const askT = t.closest('[data-tal-ask]');
  if(askT){
    const goT = t.closest('[data-go]');
    if(!(goT && askT.contains(goT))){
      e.preventDefault(); askOpen(askT.dataset.talAsk); return;
    }
  }

  const stgT = t.closest('[data-stage]');
  if(stgT){ S.stg = +stgT.dataset.stage || 0; render(); return; }

  const ivt = t.closest('[data-iv]');
  if(ivt) S.iv = ivt.dataset.iv;

  const bk = t.closest('[data-back]');
  if(bk){ back(); return; }

  const ep = t.closest('[data-editprofile]');
  if(ep){ S.editProfile = ep.dataset.editprofile==='1'; render(); return; }

  const eph = t.closest('[data-editphoto]');
  if(eph){ S.editPhoto = eph.dataset.editphoto==='1'; render(); return; }

  const pk = t.closest('[data-pick]');
  if(pk){ device.querySelectorAll('.photopick').forEach(x=>x.classList.remove('on'));
    pk.classList.add('on'); return; }

  const ac = t.closest('[data-addcard]');
  if(ac){ S.addCard = ac.dataset.addcard==='1'; render(); return; }
  if(t.closest('[data-savecard]')){
    const num = (document.getElementById('nc')||{}).value || '';
    const dig = num.replace(/\D/g,'');
    const def = !!(document.querySelector('.sheet .cbx input')||{}).checked;
    const exp = ((document.getElementById('nx')||{}).value || '').trim();
    if(def) S.cards.forEach(c=>c.def=false);
    S.cards.push({brand: brandOf(dig) || 'Mastercard',
      last: dig.length>=4 ? dig.slice(-4) : '8210',
      exp: /^\d\d\/\d\d$/.test(exp) ? exp : '04/30', def});
    S.addCard=false; render(); return;
  }
  const sd = t.closest('[data-setdef]');
  if(sd){ S.cards.forEach((c,i)=>c.def = i===+sd.dataset.setdef); render(); return; }
  const dc = t.closest('[data-delcard]');
  if(dc){ const i=+dc.dataset.delcard; const wasDef=S.cards[i].def;
    S.cards.splice(i,1); if(wasDef && S.cards[0]) S.cards[0].def=true; render(); return; }

  const ha = t.closest('[data-hideach]');
  if(ha){ if(!S.hideAch.includes(S.stage)) S.hideAch.push(S.stage); render(); return; }

  const ra = t.closest('[data-readall]');
  if(ra){ notifList().forEach(n=>{ if(!S.read.includes(n.t)) S.read.push(n.t); }); render(); return; }

  /* CROSSING PORTALS IS NOT NAVIGATION. It changes who is signed in, so the
     back stack, the open overlays and anything Tal was mid-conversation about
     all belong to the account you are leaving. Everything resets except the
     stage, which is the candidate's and is waiting where you left it. */
  /* ONE ATTRIBUTE CANNOT BE BOTH A CONTROL AND A STATE STAMP.
     This branch was `t.closest('[data-portal]')`, which was right when
     `data-portal` appeared only on the two switch buttons. It does not any
     more: `lead.js`'s render wrapper stamps `data-portal` on `.app` so that
     31-lead.css can scope its rules with `.app[data-portal="leader"]`, and
     `.app` is the ancestor of EVERYTHING. So `closest` matched the root on
     every click in the product, `k !== S.portal` was false, and the
     unconditional `return` below swallowed the event before it could reach
     the `[data-go]` branch four lines down.

     Every navigation in the app died at once — the rail, the shell logo, every
     card, every button — while the stage picker went on working, because that
     is an `onchange` on the prototype chrome and never enters this listener.
     A page that highlights on click and then does nothing, with nothing in the
     console.

     The selector is scoped to the control's own class. The stamp keeps its
     name, so 31-lead.css is untouched. */
  const pw = t.closest('.psw-t[data-portal]');
  if(pw){
    const k = pw.dataset.portal;
    if(k !== S.portal){
      S.portal = k;
      S.view = k==='leader' ? 'leadDash' : 'dashboard';
      S.hist = []; S.nav = false; S.notif = false; S.tal = false;
      talReset();
      render();
    }
    return;
  }

  const g = t.closest('[data-go]');
  if(g){ e.preventDefault();
    const mark = g.dataset.read; if(mark && !S.read.includes(mark)) S.read.push(mark);
    if(S.notif) S.notif=false;
    /* a module opened from the side nav is a top-level destination, so it starts
       a fresh stack and shows no back control */
    const fresh = !!(g.closest('.sn-item') || g.classList.contains('shell-logo'));
    go(g.dataset.go, fresh); return; }

  const tog = t.closest('[data-toggle]');
  if(tog){
    const w = tog.dataset.toggle;
    if(w==='nav'){ S.nav=!S.nav; render(); }
    if(w==='tal'){ S.tal=!S.tal; if(!S.tal) talReset(); render(); }
    if(w==='notif'){ S.notif=!S.notif; render(); }
    return;
  }
  if(t.closest('[data-close="nav"]')){ S.nav=false; render(); return; }

  const p = t.closest('[data-pop]');
  if(p){
    const el = device.querySelector('#'+p.dataset.pop);
    if(el){
      const on = el.classList.toggle('on');
      if(on){
        const r = p.getBoundingClientRect(), d = device.getBoundingClientRect();
        el.style.top = Math.max(56, Math.min(r.bottom - d.top + 8, d.height - 280)) + 'px';
      }
    }
    return;
  }

  const eye = t.closest('[data-eye]');
  if(eye){
    const inp = device.querySelector('#'+eye.dataset.eye);
    const show = inp.type==='password';
    inp.type = show?'text':'password';
    if(show && inp.value.startsWith('•')) inp.value='NewYork-2026!';
    eye.innerHTML = show?I.viewOff:I.view;
    return;
  }

  const ah = t.closest('.acc-h');       if(ah){ ah.parentElement.classList.toggle('on'); return; }
  const sl = t.closest('.slot');        if(sl && !sl.disabled){ device.querySelectorAll('.slot').forEach(x=>x.classList.remove('on')); sl.classList.add('on'); return; }
  const dy = t.closest('.day');         if(dy){ device.querySelectorAll('.day').forEach(x=>x.classList.remove('on')); dy.classList.add('on'); return; }
  /* A tab that carries data-ctab / data-rtab changes what is RENDERED, so it
     must not be intercepted by the generic strip handler below it — that one
     only moves the `.on` class and returns, which is why the cohort tabs
     highlighted but never switched. It handles unwired strips only. */
  const cs = t.closest('.cs button:not([data-ctab]):not([data-rtab])');
  if(cs){ cs.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('on')); cs.classList.add('on'); return; }
  const rt2 = t.closest('[data-rtab]');
  if(rt2){ S.rtab = rt2.dataset.rtab; render(); return; }
  /* the chapter record's own "show all" — a re-render, not a navigation, and it
     goes through `S` for trap 9's reason: the list is rebuilt from scratch on
     every render, so a class toggled on the button here would not survive the
     next pass */
  if(t.closest('[data-chall]')){ S.chAll = !S.chAll; render(); return; }

  /* --- CHOOSING THE SCENES ------------------------------------------------
     Selection is state and the mark is drawn from it, for trap 9's reason and
     for a second one this control makes obvious: the count, the save button's
     enabled-ness and the "three already, this one is unavailable" treatment
     on the other three cards are all functions of the same set, so a handler
     that toggled a class would have to reproduce three derivations by hand
     and keep them in step. Set the array, re-render, and every one of them
     falls out of `scenePick`.

     THE FOURTH PRESS IS REFUSED, NOT ABSORBED. Dropping the oldest to make
     room is the behaviour a person cannot see happen and cannot undo. A card
     that is already chosen still deselects — that is how you change your
     mind, and it is the only way to. */
  const sc = t.closest('[data-scene]');
  if(sc){
    const [kind, i] = sc.dataset.scene.split(':');
    const n = +i;
    const keep = scenePicked(kind).slice();
    const at = keep.indexOf(n);
    if(at >= 0) keep.splice(at, 1);
    else if(keep.length < 3) keep.push(n);
    S.scPick[kind] = keep;
    render(); return;
  }
  /* SAVING COMMITS THE SELECTION. It copies `S.scPick` into `S.scenes`, which
     is what every other surface reads and what makes the chooser stop being
     drawn — see the note over `sceneKeep` for why those are two sets and not
     one. `.slice()` because the two must not share an array: the chooser
     would otherwise keep writing into the committed set. */
  const ss = t.closest('[data-scenesave]');
  if(ss){
    const kind = ss.dataset.scenesave;
    if(scenePicked(kind).length === 3) S.scenes[kind] = scenePicked(kind).slice();
    render(); return;
  }
  /* playing one is a prototype no-op: there is no video behind a scene, and a
     button that silently does nothing is better than one that opens an empty
     player. The card is still a button so that it reads and focuses as one. */
  if(t.closest('[data-scene-play]')) return;
  const ct = t.closest('[data-ctab]');
  if(ct){ S.ctab = ct.dataset.ctab; render(); return; }
  const tb = t.closest('.tabs button'); if(tb){ tb.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('on')); tb.classList.add('on'); return; }

  const rt = t.closest('[data-rtab]');
  if(rt){ S.rtab = rt.dataset.rtab; render(); return; }

  const tbl = t.closest('[data-tbl]');
  if(tbl){
    const c = device.querySelector('#'+tbl.dataset.tbl);
    const on = c.classList.toggle('tbl');
    tbl.textContent = on ? 'View as a chart' : 'View as a table';
    return;
  }

  const hit = t.closest('.hit');
  if(hit){
    const c = device.querySelector('#'+hit.dataset.chart);
    const read = c.querySelector('[data-read]');
    const [lab,val] = hit.getAttribute('aria-label').split(', ');
    read.innerHTML = `<span class="k">${lab}</span><span class="v">${val}</span>`;
    return;
  }

  const col = t.closest('.sc-col');
  if(col){
    const c = device.querySelector('#'+col.dataset.chart);
    c.querySelectorAll('.sc-col').forEach(x=>x.classList.remove('on'));
    col.classList.add('on');
    const i = +col.dataset.i, tot = GAME[S.stage].weeks[i]||0;
    const parts = tot? segsOf(tot).map((v,k)=>SERIES[k][0]+' '+v).join(' · ') : 'nothing yet';
    c.querySelector('[data-read]').innerHTML =
      `<span class="k">Week ${i+1} · ${parts}</span><span class="v">${tot} min</span>`;
    return;
  }

  const bar = t.closest('.chart-bar');
  if(bar){
    const c = device.querySelector('#'+bar.dataset.chart);
    c.querySelectorAll('.chart-bar').forEach(x=>x.classList.remove('on'));
    bar.classList.add('on');
    const read = c.querySelector('[data-read]');
    const [lab,val] = bar.getAttribute('aria-label').split(', ');
    read.innerHTML = `<span class="k">${lab}</span><span class="v">${val}</span>`;
    return;
  }

  const sg = t.closest('[data-ask]');
  if(sg){ ask(sg.textContent.trim()); return; }

  if(t.closest('.composer button')){
    const inp = device.querySelector('.tal-panel .composer .inp');
    if(inp && inp.value.trim()){ const v=inp.value.trim(); inp.value=''; ask(v); }
    return;
  }
});

/* THE OLD CLIP COUNTER IS GONE WITH THE BLOCK IT COUNTED. It read six
   checkboxes out of the DOM and wrote a sentence into `#clipCount` — trap 9's
   shape exactly, and it survived only because the report page happened not to
   be rebuilt by a pass. The chooser is `scenePick` now, its selection is in
   `S`, and every derived thing on it — the count, the save button, the
   unavailable state on the other three — falls out of a re-render. */

device.addEventListener('keydown', e => {
  const card = e.target.closest('.ai-clickable');
  if(card && (e.key === 'Enter' || e.key === ' ')){
    e.preventDefault(); askOpen(card.dataset.talAsk); return;
  }
  if(e.key==='Enter' && e.target.closest('.tal-panel .composer')){
    e.preventDefault(); const v=e.target.value.trim(); if(v){ e.target.value=''; ask(v); }
  }
});
document.addEventListener('keydown', e => {
  if(e.target.matches('input,textarea,select')) return;
  /* WALKED OVER THE VISIBLE LIST, so a hidden stage is not a dead press. Off
     the shown list `indexOf` is -1, and -1 + 1 is 0 — the first visible stage —
     which is the right answer for "you are somewhere not on this list, go
     right". See `STAGES_HIDDEN` in data.js. */
  const shown = stagesShown();
  const i = shown.findIndex(s=>s[0]===S.stage);
  if(e.key==='ArrowRight') setStage(shown[(i+1)%shown.length][0]);
  if(e.key==='ArrowLeft')  setStage(shown[(i-1+shown.length)%shown.length][0]);
});

/* WHERE A RELOAD PUTS YOU.
   `render` writes the hash on every paint, so the address bar is always a
   description of the screen. This reads it back, and it has two forms because
   the product has two signed-in users:

     #<stage>/<view>          the candidate
     #leader/<view>/<stage>   the cohort leader

   THE LEADER'S FORM IS THE FIX. The hash was already being written, but this
   reader only understood the first form: it tested `CFG[hash[0]]`, `leader`
   is not a stage, the test failed, and every reload on any of the leader's
   seven pages fell through to `setStage('new')` — the candidate's dashboard,
   in the candidate's portal, in a portal switch that had silently flipped.

   `setStage` is NOT the way back in for the leader: its first statement is
   `S.portal = 'candidate'`, deliberately, and its reachability check only
   knows candidate views (both documented over it). So the leader's branch
   sets the three fields itself. The stage is restored before the view so the
   candidate half is correct the moment you switch back to it, and it is
   guarded rather than trusted — a hand-edited hash must not put `CFG[S.stage]`
   at undefined, which every view helper dereferences on the first line.

   An unknown view is left to `V` and the renderer's own fallback rather than
   being validated here: `render` already answers a missing view, and a second
   opinion in the boot path is a second place to keep the list of views. */
const hash = location.hash.slice(1).split('/');
if(hash[0] === 'leader'){
  S.portal = 'leader';
  S.view = hash[1] || 'leadDash';
  S.stage = CFG[hash[2]] ? hash[2] : 'new';
  S.ch = CFG[S.stage].open;
  render();
}
else if(hash[0] && CFG[hash[0]]){ S.stage=hash[0]; S.view = hash[1] || (DEFAULT_VIEW[hash[0]]||'dashboard'); S.ch=CFG[hash[0]].open; render(); }
else setStage('new');
