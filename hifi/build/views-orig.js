
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

const S = {stage:'new', view:'dashboard', tal:false, talQ:null, nav:false, notif:false, read:[], hideAch:[], rtab:'points', ctab:'members', hist:[], thread:[], typing:false,
  addCard:false, piOpen:{},
  cards:[{brand:'Visa',last:'4242',exp:'09/29',def:true}]};
;
const lvlName = c => 'Explorer – ' + c;
const who = f => f.pred ? f.track + ' track' : lvlName(f.level);
const rungOf  = c => RUNG[c] || 2;
;
;
;
;   /* chapters that map to this candidate's growth areas */

/* ============================================================
   NOTIFICATIONS — derived from the stage, newest first
   ============================================================ */
;
const unreadCount = () => (NOTIF[S.stage]||[]).filter(n=>n.unread && !S.read.includes(n.t)).length;

function notifPanel(){
  const list = NOTIF[S.stage] || [];
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
      :`<div class="empty" style="border:0"><span class="pict" style="margin:0 auto var(--s05)">${PG.time}</span>
        <h3>Nothing yet</h3><p>Course updates, cohort calls and points will show up here.</p></div>`}
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
  const items = NAVSETS[f.nav].map(([k,l,ic,badge]) =>
    `<button class="sn-item ${k===active?'on':''}" data-go="${k}"><i>${I[ic]}</i>${l}${badge?`<u>${badge}</u>`:''}</button>`).join('');
  const sub = f.enrolled ? 'Candidate · ' + who(f) + ' · Cohort 41' : 'Candidate · ' + who(f);
  return `
  <div class="scrim ${S.nav?'on':''}" data-close="nav"></div>
  <nav class="sidenav ${S.nav?'on':''}" aria-label="Portal">
    <div class="sn-head">
      <span class="sn-av">MN</span>
      <div><div class="t-heading-compact-01">Maryam Naz</div><div class="t-helper-01">${sub}</div></div>
    </div>
    ${items}
    <div class="sn-div"></div>
    <button class="sn-item ${active==='account'?'on':''}" data-go="account"><i>${I.user}</i>Profile</button>
    <button class="sn-item" data-go="stage:signup"><i>${I.logout}</i>Log out</button>
  </nav>`;
}

function shell(){
  return `
  <header class="shell">
    <button class="shell-act" data-toggle="nav" aria-label="Open menu">${I.menu}</button>
    <button class="shell-logo" data-go="dashboard" aria-label="TalentNext home"><img src="${LOGO_K}" alt="TalentNext"></button>
    <div class="shell-right">
      <button class="shell-act ${S.notif?'on':''}" data-toggle="notif" aria-label="Notifications">${I.notification}${unreadCount()?`<span class="shell-badge">${unreadCount()}</span>`:''}</button>
      <button class="shell-act" data-go="account" aria-label="Account"><span class="shell-avatar">MN</span></button>
    </div>
  </header>`;
}

function authShell(back){
  return `
  <header class="shell">
    ${back?`<button class="shell-act" data-go="${back}" aria-label="Back">${I.arrowLeft}</button>
    <span class="shell-logo" style="padding-left:var(--s02)"><img src="${LOGO_K}" alt="TalentNext"></span>`
    :`<span class="shell-logo" style="padding-left:var(--s05)"><img src="${LOGO_K}" alt="TalentNext"></span>`}
    <div class="shell-right"><button class="shell-act" aria-label="Help">${I.info}</button></div>
  </header>`;
}

/* ============================================================
   SHARED PIECES
   ============================================================ */
const talLabel = (s) => `<span class="ai-label${s?' '+s:''}">Tal</span>`;
const inner = (n) => I[n].replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');

function stars(n){
  let out='';
  for(let i=1;i<=5;i++) out += `<svg class="${i<=Math.round(n)?'f':''}" viewBox="0 0 32 32">${inner('star')}</svg>`;
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
  return `<span class="av-ph" style="width:${size}px;height:${size}px;font-size:${Math.round(size/3)}px">
    <i>${a.i}</i><img src="${a.img}" alt="" loading="lazy" onerror="this.style.display='none'"></span>`;
}
const talStar = (q) => `<button class="tal-star" data-tal-ask="${q}" aria-label="Ask Tal"><span class="lbl">Ask Tal</span><span class="sk-mark xs"></span></button>`;

/* horizontal card for the shortlist rail */
function agentCardH(key){
  const a=AGENTS[key];
  return `<div class="agh draw" role="button" tabindex="0" data-go="agent:${key}">
    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${talStar('What is '+a.n.split(' ')[0]+' like to be interviewed by?')}
    ${avatar(a,56)}
    <span class="agh-n">${a.n}</span>
    <span class="agh-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span></span>
    <span class="agh-m">${a.range} · ${a.ivs} interviews</span>
    <span class="agh-f"><span class="agh-slot">${a.slot}</span><span class="ag-price">${a.price}</span></span>
    <svg class="card-go" viewBox="0 0 32 32">${inner('arrowRight')}</svg>
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
    <svg class="card-go" viewBox="0 0 32 32">${inner('arrowRight')}</svg>
  </div>`;
}
function mem(name,ini,meta,you){
  return `<div class="mem">
    <span class="mem-av"${you?' style="background:var(--brand-primary);color:var(--on-brand)"':''}>${ini}</span>
    <span class="mem-b"><span class="mem-n">${name}</span><span class="mem-m">${meta}</span></span>
    ${you?'<span class="tag brand sm">You</span>':''}
  </div>`;
}
function clip(title,note,stamp,len,kept){
  return `<div class="clip">
    <span class="thumb">${I.play}<span class="t">${len}</span></span>
    <span class="cb"><span class="ct">${title}</span><span class="cq">${note} · from ${stamp}</span></span>
    <label class="cbx clip-pick" style="padding:0;margin-top:2px"><input type="checkbox" ${kept?'checked':''}><span class="box">${I.check}</span></label>
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
  const ic = state==='done' ? `<span style="fill:var(--support-success)">${I.checkFilled}</span>`
    : state==='open' ? `<span style="fill:var(--text-primary)">${I.circleDash}</span>`
    : state==='locked' ? `<span style="fill:var(--gray-50)">${I.locked}</span>`
    : `<span style="fill:var(--gray-40)">${I.circle}</span>`;
  return `<button class="ch ${state==='locked'?'locked':''}" data-go="chapter:${i}">
    <span class="ch-num">${String(n).padStart(2,'0')}</span>
    <span class="ch-b"><span class="ch-n">${name}</span>
      <span class="ch-m">${meta}${flag?`<span class="sep">·</span><span class="ai-inline"><span class="sk"></span>${flag}</span>`:''}</span></span>
    <span class="ch-ic">${ic}</span>
  </button>`;
}

/* Tal — the layer over whatever screen you are on. */
;

/* ============================================================
   TAL'S REPLIES: a keyword router that answers with widgets, the
   way the wireframes had Tal reply with cards rather than prose
   ============================================================ */
const tw = (title,body,action) => `<span class="tw">
  ${title?`<span class="tw-h">${title}</span>`:''}${body}
  ${action?`<span class="tw-a">${action}</span>`:''}</span>`;
const twBtn = (label,go) => `<button class="tw-btn"${go?` data-go="${go}"`:''}>${label}${I.arrowRight}</button>`;
const twChips = (qs) => `<span class="tw-chips">${qs.map(q=>`<button data-ask="1">${q}</button>`).join('')}</span>`;

function wChapter(i){
  const g = GAME[S.stage];
  const done = g && i < g.done, inprog = S.stage==='day34' && i===3;
  return tw(`Chapter ${i+1} · ${CH[i][0]}`,
    `<span class="tw-row"><span class="tw-bar"><i style="width:${inprog?17:done?100:0}%"></i></span>
     <span class="tw-k">${inprog?'12 of 70':done?CH[i][1]+' of '+CH[i][1]:'0 of '+CH[i][1]} min</span></span>`,
    twBtn('Open chapter '+(i+1),'chapter:'+i));
}
function wTerms(){
  return tw('Two terms this chapter turns on',
    `<span class="tw-def"><b>Operating rhythm</b>The regular cadence of check-ins that lets you follow work without hovering over it.</span>
     <span class="tw-def"><b>Drop-off point</b>The moment work stops moving and nobody has said so out loud.</span>`);
}
function wLadder(){
  const cur = cfg(S.stage).level;
  return tw('The Explorer track',
    `<span class="tw-rungs">${['E1','E2','E3','E4','E5'].map(r=>`<i class="${r===cur?'on':''}">${r}</i>`).join('')}</span>
     <span class="tw-list">
       <span>Finish the 13 chapters and keep your weekly tasks on time</span>
       <span>Re-interview once the 90 days are up</span>
       <span>Your cohort leader decides: move up, hold, or drop back</span>
     </span>`,
    twBtn('See my level','level'));
}
function wPoints(){
  const g = GAME[S.stage];
  if(!g) return tw('Points','<span class="tw-k">Points start when your cohort does.</span>');
  return tw('Fastest points from here',
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
  return tw('A 10-minute run-through',
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
  return tw('Thursday 6:00 PM ET · 60 minutes',
    `<span class="tw-list">
       <span>Week ${cfg(S.stage).week} is on hard conversations</span>
       <span>Bring the Sam handover from your notes</span>
       <span>Three others flagged the same chapter</span>
     </span>`,
    twBtn('Open Cohort 41','cohort'));
}
function wDraft(){
  return tw('A reply you could send',
    `<span class="tw-quote">Thanks Priya. I will bring the vendor review to Thursday. The part I am stuck on is telling someone I am taking work back without it reading as a lack of trust.</span>`,
    `${twBtn('Use this','messages')}<button class="tw-btn ghost" data-ask="1">Try another wording</button>`);
}
function wWorkload(){
  return tw('What the weeks look like',
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
  const ctx = TALCTX[S.view] || TALCTX.dashboard;
  const where = ({dashboard:'Dashboard',level:'My Level',report:'Your report',interviews:'Interviews',
    agents:'Choosing an agent',agent:'Agent profile',booking:'Interview booked',enrol:'Enrolling',
    payment:'Payment',coursework:'Coursework',chapter:'Chapter '+((S.ch??3)+1),transcript:'Transcript',rewards:'Points',
    cohort:'Cohort 41',billing:'Payments',account:'Profile',messages:'Messages'})[S.view] || 'TalentNext';
  const state = f.complete ? lvlName(f.level)+', cohort complete'
    : f.enrolled ? lvlName(f.level)+', day '+f.day+' of 90'
    : f.pred ? f.track+' track, level not set yet'
    : lvlName(f.level)+' confirmed, not enrolled';

  const opener = S.view==='chapter' && S.ch===3
    ? `You are 12 minutes into chapter 4. Want the short version before you go back in?`
    : `You are on <b>${where.toLowerCase()}</b>, ${state.toLowerCase()}. Ask me anything, or start with one of these.`;
  const bubble = (who,html) => who==='me'
    ? `<div class="tal-msg me"><span class="av">MN</span><div class="bb">${html}</div></div>`
    : `<div class="tal-msg"><span class="av"><span class="sk-mark xs"></span></span><div class="bb">${html}</div></div>`;
  const thread = bubble('tal',opener)
    + S.thread.map(m=>bubble(m.who,m.html)).join('')
    + (S.typing?bubble('tal',`<div class="ai-stream"><i></i><i></i><i></i></div>`):'');

  return `<div class="tal-panel ${S.tal?'on':''}" id="talPanel">
    <div class="tal-h">
      <span class="av"><span class="sk-mark xs"></span></span>
      <span class="nm"><b>Tal</b><span>${where} · ${state}</span></span>
      <button class="shell-act" data-toggle="tal" aria-label="Close Tal" style="color:var(--icon-primary)">${I.close}</button>
    </div>
    <div class="tal-body" id="talBody">${thread}</div>
    <div class="tal-sugg">${ctx.map(s=>`<button data-ask="1">${s}</button>`).join('')}</div>
    
    <div class="composer">
      <input class="inp ai-field" placeholder="Ask Tal" aria-label="Ask Tal">
      <button aria-label="Send">${I.send}</button>
    </div>
  </div>`;
}

const askChip = (q,label) => `<button class="chip-tal" data-tal-ask="${q}"><span class="sk-mark xs"></span>${label||'Ask Tal'}</button>`;
const talFab = () => `<button class="tal-fab" data-toggle="tal" aria-label="Ask Tal">${TALMARK}</button>`;

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
const gcard = (kind,tag,title,sub,go) => `<button class="tile clk gcard" data-go="${go}">
  <span class="gfx wide" style="background:${PAL[kind].a}">${GFX[kind]}${tag?`<span class="gfx-tag">${tag}</span>`:''}</span>
  <span class="gcard-b">
    <h3>${title}</h3><div class="sub">${sub}</div>
    <svg class="tile-arrow" viewBox="0 0 32 32">${inner('arrowRight')}</svg>
  </span>
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
function achBanner(){
  const a = ACH[S.stage];
  if(!a || S.hideAch.includes(S.stage)) return '';
  return `<div class="ach">
    <span class="ach-ic">${I[a.ic]}</span>
    <span class="ach-b"><span class="ach-t">${a.t}</span><span class="ach-d">${a.b}</span>
      <button class="ach-go" data-go="${a.go}">View</button></span>
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
  return `<div class="chart" id="${id}">
    <div class="chart-head"><span class="t">${title}</span><span class="s">${sub}</span></div>
    <div class="sc-plot">
      ${target?`<div class="chart-ref" style="top:${refTop}%"><span>${targetLabel}</span></div>`:''}
      ${cols}
    </div>
    <div class="chart-x">${ticks}</div>
    <div class="chart-read" data-read="${id}">
      <span class="k">Week ${li+1}</span><span class="v">${weeks[li]} min</span></div>
    <div class="legend">${SERIES.map(([nm,c])=>`<span><i style="background:${c}"></i>${nm}</span>`).join('')}</div>
    <div class="chart-table">
      ${weeks.map((t,i)=>`<div class="kv"><span class="k">Week ${i+1}</span><span class="v n">${
        segsOf(t).map((v,k)=>SERIES[k][0]+' '+v).join(' · ')} · ${t} min</span></div>`).join('')}
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
      <div class="score-rank"><div class="n">${RANKS[g.rank-1].n}</div><div class="l">${g.badges} of 4 badges</div></div>
    </div>
    ${nb?`<div class="score-next">
      <div class="pb-track"><div class="pb-fill" style="width:${pct}%"></div></div>
      <div class="score-meta"><span>${(nb.need-g.pts).toLocaleString()} points to ${nb.n}</span><span>${pct}%</span></div>
    </div>`:''}
  </div>`;
}

/* the three award lists, each rendered as one row grid */
function awardRow({name,desc,val,state,when,pct,tone}){
  const neg = val<0;
  return `<div class="aw ${state}">
    <span class="aw-ic"${tone?` style="color:${tone}"`:''}>${state==='got'?I.checkFilled:(neg?I.subtract:I.locked)}</span>
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
    name:r.n, desc:r.d, val:r.v,
    state:g.got.includes(i)?'got':'not', when:g.last[i]
  })).join('');
}
function badgeList(g){
  return BDG.map((b,i)=>{
    const got = i < g.badges;
    return awardRow({name:b.n, desc:b.d, val:b.v, state:got?'got':'not', tone:got?b.c:null,
      when:'11/06/2026', pct: got?undefined:(b.need?Math.min(99,Math.round(g.pts/b.need*100)):0)});
  }).join('');
}
function rankList(g){
  return RANKS.map((r,i)=>awardRow({name:r.n, desc:r.d, val:r.v, tone:i<g.rank?'#b28600':null,
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
      fill="var(--dv-3)" stroke="var(--layer-01)" stroke-width="2"/>`).join('');
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
        <line x1="0" x2="${W}" y1="${y(target).toFixed(1)}" y2="${y(target).toFixed(1)}"
          stroke="var(--border-strong-01)" stroke-width="1" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>
        <path d="${path}" fill="none" stroke="var(--dv-3)" stroke-width="2"
          stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        ${dots}${hits}
      </svg>
      <span class="chart-reflab" style="top:calc(${(y(target)/H*100).toFixed(1)}% + 3px)">${targetLabel}</span>
    </div>
    <div class="chart-x">${ticks}</div>
    <div class="chart-read" data-read="${id}"><span class="k">${labels[last]}</span><span class="v">${data[last]}${unit}</span></div>
    <div class="chart-table">${data.map((v,i)=>`<div class="kv"><span class="k">${labels[i]}</span><span class="v n">${v}${unit}</span></div>`).join('')}</div>
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
const bk = () => S.hist.length ? `<button class="ph-back" data-back="1" aria-label="Back">${I.arrowLeft}</button>` : '';
function ph(title,sub){
  return `<div class="ph"><div class="ph-top">${bk()}<h1>${title}</h1></div>${sub?`<p>${sub}</p>`:''}</div>`;
}
function trackBand(track){
  const T=['Explorer','Builder','Trailblazer'];
  return `<div class="bands">${T.map(t=>`<span class="${t===track?'on':''}">${t}</span>`).join('')}</div>
  <div class="bands-note">Five rungs in each track. Your rung comes from the interview.</div>`;
}
function ladder(cur,confirmed){
  const r = rungOf(cur);
  return `<div class="ladder">${Array.from({length:15},(_,i)=>`<i class="${i<r-1?'f':(i===r-1?'c':'')}"></i>`).join('')}</div>
  <div class="ladder-lab"><span>Explorer</span><span>Builder</span><span>Trailblazer</span></div>`;
}

/* A stepper on a phone eats a screen. Show the rail, the step you are on,
   and keep the rest one tap away. */
function stepper(id, steps, flush){
  let i = steps.findIndex(x=>x.st==='on');
  if(i<0) i = steps.filter(x=>x.st==='done').length ? steps.length-1 : 0;
  const open = !!S.piOpen[id], cur = steps[i];
  const ic = st => st==='done' ? `<span class="pi-ic" style="fill:var(--text-primary)">${I.checkFilled}</span>`
    : st==='on' ? `<span class="pi-ic" style="fill:var(--text-primary)">${I.circleDash}</span>`
    : `<span class="pi-ic" style="fill:var(--gray-50)">${I.circle}</span>`;
  return `<div class="stp${flush?' flush':''}${open?' open':''}">
    <div class="stp-rail" role="img" aria-label="Step ${i+1} of ${steps.length}">
      ${steps.map(x=>`<i class="${x.st}"></i>`).join('')}
    </div>
    <div class="stp-h">
      <span class="stp-c">Step ${i+1} of ${steps.length}</span>
      <button class="stp-t" data-stp="${id}" aria-expanded="${open}">${open?'Hide steps':'All steps'}${I.chevDown}</button>
    </div>
    <div class="stp-now">
      <div class="pi-lab">${cur.lab}</div>${cur.sec?`<div class="pi-sec">${cur.sec}</div>`:''}
    </div>
    <div class="stp-all"><div class="pi" style="padding:0">
      ${steps.map(x=>`<div class="pi-step ${x.st}">${ic(x.st)}
        <div><div class="pi-lab">${x.lab}</div>${x.sec?`<div class="pi-sec">${x.sec}</div>`:''}</div></div>`).join('')}
    </div></div>
  </div>`;
}

/* ============================================================
   AUTH — stage: signup
   ============================================================ */
const AUTH = {
create: () => `${authShell()}
<main class="main"><div class="page">
  ${ph('Create your account','Your details came across from Next in Leadership. All that is left is a password and your consent.')}
  ${stepper('auth',[
    {st:'done',lab:'Your details',sec:'Received from Next in Leadership'},
    {st:'on',  lab:'Account and consent',sec:'A password and your consent'},
    {st:'',    lab:'Verify your email'}
  ])}
  <div class="sec">
    <div class="f"><label for="em">Email address</label>
      <input class="inp" id="em" value="maryam.naz@tkxel.io" readonly>
      <div class="help">From your Next in Leadership profile. <a data-go="terms">Not you?</a></div></div>
    <div class="f"><label for="pw">Password</label>
      <div class="pw-wrap"><input class="inp" id="pw" type="password" value="••••••••••••">
        <button class="pw-eye" data-eye="pw" aria-label="Show password">${I.view}</button></div>
      <ul class="pw-rules">
        <li class="ok">${I.checkFilled}At least 12 characters</li>
        <li class="ok">${I.checkFilled}Upper and lower case</li>
        <li>${I.circle}One number or symbol</li>
      </ul></div>
    <div class="f"><label for="pw2">Confirm password</label>
      <div class="pw-wrap"><input class="inp" id="pw2" type="password" placeholder="Re-enter password">
        <button class="pw-eye" data-eye="pw2" aria-label="Show password">${I.view}</button></div></div>
  </div>
  <div class="sec">
    <h2 class="t-heading-02 mb4">Terms and consent</h2>
    <label class="cbx legal"><input type="checkbox" checked><span class="box">${I.check}</span>
      <span class="txt">I accept the <a data-go="terms">Terms of Service</a> and the <a data-go="terms">Privacy Policy</a>. <b style="font-weight:600">Required</b></span></label>
    <label class="cbx legal"><input type="checkbox" checked><span class="box">${I.check}</span>
      <span class="txt">I consent to my interviews being recorded and transcribed so my agent can assess them and write my report, as set out in the <a data-go="terms">data use notice</a>. <b style="font-weight:600">Required</b></span></label>
    <label class="cbx legal"><input type="checkbox"><span class="box">${I.check}</span>
      <span class="txt">Send me occasional product and course emails. You can turn this off any time.</span></label>
    <div class="mt6"><button class="btn btn-p" data-go="verify">Create account ${I.arrowRight}</button></div>
    <p class="t-body-01 mt5" style="color:var(--text-secondary)">Already have an account? <a data-go="stage:new">Log in</a></p>
    <p class="t-legal-01 mt5" style="color:var(--text-helper)">TalentNext is operated by Next in Leadership. You can withdraw consent at any time in Profile.</p>
  </div>
</div></main>`,

terms: () => `${authShell('create')}
<main class="main"><div class="page" style="padding-bottom:0">
  <div class="tabs"><button>Terms</button><button>Privacy</button><button class="on">Data use</button><button>Cookies</button></div>
  <div class="ph" style="padding-bottom:var(--s05)">
    <div class="ph-top"><h1 style="font-size:20px;line-height:26px">Data use notice</h1></div>
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
    <div class="acc-i"><button class="acc-h"><span class="ttl">4. Tal, your coach</span><span class="chev">${I.chevDown}</span></button>
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

verify: () => `${authShell('create')}
<main class="main"><div class="page" style="padding-bottom:var(--s05)">
  <div class="ph" style="padding-bottom:var(--s05)">
    <h1>Verify your email</h1>
    <p>Six-digit code sent to <b>maryam.naz@tkxel.io</b>. It expires in 10 minutes.</p>
  </div>
  <div class="sec" style="padding-bottom:var(--s05)">
    <span class="lab" style="display:block;font-size:12px;line-height:16px;letter-spacing:.32px;color:var(--text-secondary);margin-bottom:var(--s03)">Verification code</span>
    <div class="otp">${[4,9,2,7,1,6].map((d,i)=>`<input value="${d}" size="1" inputmode="numeric" maxlength="1" aria-label="Digit ${i+1}">`).join('')}</div>
    <div class="help" style="margin-top:var(--s03)">Paste the whole code and it will fill itself in.</div>
  </div>
  <div class="sec">
    <button class="btn btn-p" data-go="created">Verify and continue ${I.arrowRight}</button>
    <div class="mt4"><button class="btn btn-g">Resend code in 0:42 ${I.restart}</button></div>
    <p class="t-helper-01 mt4">Wrong address? <a data-go="create">Change it</a> before you verify.</p>
  </div>
</div></main>`,

created: () => `${authShell()}
<main class="main"><div class="page">
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
      <div class="ai-head">${talLabel()}<h3>Meet Tal, your coach</h3></div>
      <div class="ai-body"><p>Tal knows your level, your course and where you have got to. Start with one of these.</p></div>
      <div class="mt5" style="display:flex;flex-direction:column;gap:1px">
        ${['What happens in the interview?','How do I move up a level?','Which agent suits me?'].map(q=>
        `<button class="tile clk arrow" data-go="stage:new" style="background:var(--layer-02);padding:var(--s04)">
          <span class="t-body-compact-01">${q}</span>
          <svg class="tile-arrow" viewBox="0 0 32 32">${inner('arrowRight')}</svg></button>`).join('')}
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
  if(S.stage==='new') body = `
    ${ph('Hi Maryam','Your next step, and everything decided so far.')}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p><b>Book your interview.</b> Three agents who assess Explorer candidates have slots this week. Booking early usually means starting a cohort within 10 days instead of 4 weeks.</p></div>
        <div class="ai-foot"><a data-go="agents" class="lk">See the 3 agents</a>
          <span class="sp"><button class="ic" aria-label="Helpful">${I.thumbsUp}</button><button class="ic" aria-label="More">${I.overflow}</button></span></div>
      </div>
    </div>
    <div class="sec"><button class="btn btn-p" data-go="agents">Book your interview ${I.calendar}</button></div>
    <div class="sec tint">
      <div class="sec-h"><h2>Where you are</h2></div>
      ${stepper('whereNew',[
        {st:'done',lab:'Leadership quiz',sec:'Explorer track · Aug 12'},
        {st:'on',  lab:'Interview with an agent',sec:'Not booked yet · 45 minutes'},
        {st:'',    lab:'Your level and report',sec:'Within 48 hours of the interview'},
        {st:'',    lab:'Enroll and start your 90 days'}
      ],1)}
    </div>
    <div class="sec">
      <div class="sec-h"><h2>Decided so far</h2><a data-go="level">My Level</a></div>
      <div class="tile-stack spaced">
        ${gcard('track','Your track','Explorer','From your quiz. Your level is set at the interview.','level')}
        ${gcard('course','What comes next','A 90-day course','13 chapters, a cohort of ten and a live cohort leader. Course and price follow your level.','level')}
      </div>
    </div>`;

  else if(S.stage==='booked') body = `
    ${ph('Hi Maryam','Interview in 6 days. Everything decided so far is below.')}
    <div class="sec">
      <div class="tile" style="background:var(--surface-dark);color:var(--on-dark);border-color:var(--surface-dark)">
        <div class="t-label-01" style="color:var(--on-dark-2)">Next up</div>
        <div class="t-heading-03 mt3" style="color:var(--on-dark)">Interview with Priya Nair</div>
        <div class="t-body-01 mt3" style="color:var(--on-dark-2)">Thursday, August 20 at 6:30 PM ET · 45 minutes, recorded</div>
        <div class="mt5" style="display:flex;gap:1px">
          <button class="btn btn-sm noic" style="flex:1;justify-content:center;background:var(--on-dark);color:var(--surface-dark)">Join</button>
          <button class="btn btn-sm noic" data-go="interviews" style="flex:1;justify-content:center;background:var(--surface-dark-2);color:var(--on-dark)">Reschedule</button>
        </div>
      </div>
    </div>
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p><b>Prepare one delegation story.</b> It is the question this agent asks most often. Ten minutes of practice is usually enough.</p></div>
        <div class="ai-foot">${askChip('Run a mock interview on delegation','Start the mock')}
          <span class="sp"><button class="ic" aria-label="Helpful">${I.thumbsUp}</button><button class="ic" aria-label="More">${I.overflow}</button></span></div>
      </div>
    </div>
    <div class="sec tint">
      <div class="sec-h"><h2>Where you are</h2></div>
      ${stepper('whereBooked',[
        {st:'done',lab:'Leadership quiz',sec:'Explorer track'},
        {st:'done',lab:'Interview booked',sec:'Priya Nair · Thu, Aug 20'},
        {st:'on',  lab:'Your level and report',sec:'Within 48 hours of the interview'},
        {st:'',    lab:'Enroll and start your 90 days'}
      ],1)}
    </div>`;

  else if(S.stage==='assessed') body = `
    ${ph('Hi Maryam','Your level is confirmed. One step left before the 90 days start.')}
    <div class="sec">
      <div class="note succ"><span>${I.checkFilled}</span><div class="nb"><b>Explorer &ndash; E3 confirmed</b>Priya signed your report on August 21. That is rung 3 of the Explorer track.</div></div>
    </div>
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p><b>Enroll on Explorer Track &ndash; E3.</b> The next cohort at your level starts within two weeks, and you keep the same cohort for all 90 days.</p></div>
        <div class="ai-foot"><a class="lk" data-go="enrol">See the cohorts</a></div>
      </div>
    </div>
    <div class="sec"><div class="btn-set">
      <button class="btn btn-p" data-go="enrol">Enroll on Explorer Track &ndash; E3 ${I.arrowRight}</button>
      <button class="btn btn-t" data-go="report">Read my report ${I.document}</button>
    </div></div>
    <div class="sec">
      <div class="sec-h"><h2>Decided so far</h2><a data-go="level">My Level</a></div>
      <div class="tile-stack">
        <button class="tile clk arrow" data-go="report">
          <div class="t-label-01" style="color:var(--text-secondary)">Confirmed level</div>
          <h3 class="mt3">Explorer &ndash; E3</h3><div class="sub">Rung 3 of 15 · signed by Priya Nair, 21 Aug</div>
          <svg class="tile-arrow" viewBox="0 0 32 32">${inner('arrowRight')}</svg></button>
      </div>
    </div>`;

  else if(f.complete) body = `
    ${ph('Hi Maryam','Cohort 41 is complete. You moved up a rung.')}
    ${achBanner()}
    <div class="sec">
      <div class="lvl-hero" style="margin:0">
        <div class="eb">Re-interview · 21 November · signed by Priya Nair</div>
        <div class="big">Explorer &ndash; E4</div>
        <div class="sub">Promoted from E3 · rung 4 of 15</div>
        ${ladder('E4')}
      </div>
    </div>
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p><b>Explorer Track &ndash; E4 opens on December 1.</b> Your growth areas from the last 90 days, delegation and coaching, are chapters 3 and 9 of it.</p></div>
      </div>
    </div>
    <div class="sec"><div class="btn-set">
      <button class="btn btn-p" data-go="enrol">Enroll on Explorer Track &ndash; E4 ${I.arrowRight}</button>
      <button class="btn btn-t" data-go="transcript">Download my certificate ${I.download}</button>
    </div></div>
    <div class="sec tint">
      <div class="sec-h"><h2>Cohort 41, in the end</h2><a data-go="transcript">Transcript</a></div>
      <button class="score-link" data-go="rewards">${scoreCard(GAME.promoted)}</button>
    </div>
    <div class="sec">
      <div class="tile" style="padding-top:var(--s04)">
        ${stackChart('wk',{title:'Time on the course',sub:'minutes each week',weeks:GAME.promoted.weeks,
          target:WEEK_TARGET,targetLabel:WEEK_TARGET+' min target'})}
      </div>
    </div>
    <div class="sec tint">
      <div class="sec-h"><h2>What changes at E4</h2></div>
      <div class="tile-stack">
        <div class="tile"><h3>You can lead a cohort</h3>
          <div class="sub">Volunteer to lead any cohort below E4. It is recognition, not payment, and your request goes to the admin team.</div>
          <div class="mt4"><button class="btn btn-g btn-sm" data-go="transcript">See open cohorts ${I.arrowRight}</button></div></div>
        <div class="tile"><h3>Your listing goes public</h3>
          <div class="sub">Your level and certificates become a shareable page. Nothing else on your profile is published.</div>
          <div class="mt4"><button class="btn btn-g btn-sm" data-go="account">Manage what is shown ${I.arrowRight}</button></div></div>
      </div>
    </div>`;

  else { /* enrolled: week1, day34, day90 */
    const g = GAME[S.stage];
    const stalling = S.stage==='day34';
    const dueRe = S.stage==='day90';
    body = `
    ${ph('Hi Maryam', f.finished?'Explorer Track &ndash; E3 · Cohort 41 · ninety days complete':`Explorer Track &ndash; E3 · Cohort 41 · week ${f.week} of 13`)}
    ${achBanner()}
    <div class="sec" style="padding-bottom:var(--s06)">
      <div class="ai-aura tile tight">
        <div class="ai-head">${talLabel()}<h3>${stalling?'Where you are stuck':dueRe?'Before your re-interview':'Getting started'}</h3></div>
        <div class="ai-body"><p>${stalling
          ?'You have opened chapter 4 four times without finishing it, and it is the growth area in your report. Worth the extra time.'
          :dueRe?'All thirteen chapters are done and your average is 87%. Book the re-interview and Priya will assess the ninety days against your summary.'
          :'Chapter 1 unlocks today and your first call is Thursday. Nothing is assessed this week.'}</p></div>
        <div class="ai-foot">${askChip(stalling?'Walk me through chapter 4':dueRe?'Prepare me for the re-interview':'What is chapter 1 about?',
          stalling?'Walk me through it':dueRe?'Prepare me':'Tell me more')}</div>
      </div>
    </div>
    <div class="sec" style="padding-bottom:var(--s06)">${progressStrip(f)}</div>
    <div class="sec">
      <div class="tile" style="padding-top:var(--s05)">
        ${stackChart('wk',{title:'Time on the course',sub:'minutes each week',weeks:g.weeks,
          target:WEEK_TARGET,targetLabel:WEEK_TARGET+' min target'})}
      </div>
    </div>
    ${dueRe?`<div class="sec">
      <div class="tile" style="background:var(--gray-100);color:#fff;border-color:var(--gray-100)">
        <div class="t-label-01" style="color:var(--gray-40)">Due now</div>
        <div class="t-heading-03 mt3" style="color:#fff">Book your re-interview</div>
        <div class="t-body-01 mt3" style="color:var(--gray-30)">Your ninety days are complete. The re-interview decides whether you move up to E4, hold at E3, or drop back to E2.</div>
        <div class="mt5"><button class="btn btn-p btn-sm noic" data-go="agents" style="justify-content:center">Choose an agent</button></div>
      </div></div>`:''}
    <div class="sec">
      <div class="sec-h"><h2>${f.finished?'Your course':'This week'}</h2><a data-go="coursework">Coursework</a></div>
      <div class="tile-stack">
        ${f.finished?`<button class="tile clk arrow" data-go="coursework">
          <div class="t-label-01" style="color:var(--text-secondary)">All 13 chapters</div>
          <h3 class="mt3">Course complete</h3><div class="sub">87% average · 11h 40m invested</div>
          <svg class="tile-arrow" viewBox="0 0 32 32">${inner('arrowRight')}</svg></button>`:`
        <button class="tile clk arrow" data-go="chapter:${f.open}">
          <div class="t-label-01" style="color:var(--text-secondary)">Chapter ${f.open+1} · ${S.stage==='week1'?'unlocked today':'in progress'}</div>
          <h3 class="mt3">${CH[f.open][0]}</h3>
          <div class="pb mt4" style="margin-bottom:0"><div class="pb-track sm"><div class="pb-fill" style="width:${stalling?17:0}%"></div></div></div>
          <div class="sub mt3">${stalling?'12 of 70':'0 of '+CH[f.open][1]} minutes · opens in LightSpeed VT</div>
          <svg class="tile-arrow" viewBox="0 0 32 32">${inner('arrowRight')}</svg></button>`}
        ${f.finished?'':`<button class="tile clk arrow" data-go="cohort">
          <div class="t-label-01" style="color:var(--text-secondary)">Weekly call · in 2 days</div>
          <h3 class="mt3">Thursday 6:00 PM ET</h3><div class="sub">Priya Nair · 9 others · 60 minutes</div>
          <svg class="tile-arrow" viewBox="0 0 32 32">${inner('arrowRight')}</svg></button>`}
      </div>
    </div>
    ${stalling?`<div class="sec"><div class="note warn"><span>${I.warning}</span><div class="nb"><b>One task is overdue</b>Week 4 reflection was due Monday. Priya can see it on her roster.</div></div></div>`:''}
    <div class="sec tint">
      <div class="sec-h"><h2>Points</h2><a data-go="rewards">Badges and rank</a></div>
      <button class="score-link" data-go="rewards">${scoreCard(g)}</button>
    </div>
`;
  }
  return `<main class="main"><div class="page">${body}</div></main>`;
};

V.level = (f) => {
  const confirmed = !f.pred;
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'My Level')}
  ${ph('My Level', confirmed?'Your level, what it is based on, and how you move up.':'Your track, and how your level gets set.')}
  <div class="lvl-hero">
    <div class="eb">${confirmed?(f.complete?'Promoted November 21 · signed by Priya Nair':'Confirmed August 21 · signed by Priya Nair'):'Your track, from the quiz'}</div>
    <div class="big">${confirmed?lvlName(f.level):f.track}</div>
    <div class="sub">${confirmed?'Rung '+rungOf(f.level)+' of 15':'Your level is set at the interview'}</div>
    ${confirmed?ladder(f.level):trackBand(f.track)}
  </div>
  ${confirmed?`<div class="sec mt6"><button class="btn btn-p" data-go="report">Read my full report ${I.arrowRight}</button></div>`:''}
  <div class="sec ${confirmed?'':'mt6'}">
    <div class="tile bordered">
      ${confirmed?'':gfxLine('Explorer track')}
      <div class="ai-head"><h3>${confirmed?'What Priya wrote':'What the Explorer track means'}</h3></div>
      <div class="ai-body">
        ${confirmed?`<p class="t-label-01" style="color:var(--text-secondary)">Strengths</p>
        <p>You reason from consequence to people, not policy. Three examples, each with a date and a name attached.</p>
        <p class="t-label-01" style="color:var(--text-secondary)">Growth areas</p>
        <p>Delegation, and coaching rather than fixing. Chapters 4 and 12 are built on exactly this.</p>`
        :`<p>Explorer is the first of three tracks. It is for people who already lead work but not a whole function, and it covers the operating basics: rhythm, delegation, hard conversations and feedback.</p>
        <p>Your interview places you on one of five rungs inside it, and that decides which course you take.</p>`}
      </div>
      ${confirmed?`<div class="ai-foot"><a class="lk" data-go="report">Read the full report</a></div>`:''}
    </div>
  </div>
  ${!confirmed?`<div class="sec">
    <div class="note quiet"><span>${I.info}</span><div class="nb"><b>A quiz cannot set your level</b>It only tells you your track. An interview with an agent sets the level, and your report follows within 48 hours.</div></div>
    <div class="mt5"><button class="btn btn-p" data-go="agents">Book your interview ${I.calendar}</button></div>
  </div>`:''}
  <div class="sec flat tint" style="padding:var(--s07) 0">
    <div class="sec-h" style="padding:0 var(--s05)"><h2>How the ladder works</h2></div>
    <div class="acc">
      <div class="acc-i"><button class="acc-h"><span class="ttl">The three tracks</span><span class="chev">${I.chevDown}</span></button>
        <div class="acc-b"><p>Explorer (E1&ndash;E5), Builder (B1&ndash;B5), Trailblazer (T1&ndash;T5). Fifteen rungs in one line. You do not jump tracks, you move up one rung at a time.</p></div></div>
      <div class="acc-i"><button class="acc-h"><span class="ttl">Moving up</span><span class="chev">${I.chevDown}</span></button>
        <div class="acc-b"><p>Every course is 90 days. Once the ninety days are up you re-interview, and you move up a rung, hold where you are, or drop back one.</p></div></div>
      <div class="acc-i"><button class="acc-h"><span class="ttl">Who decides</span><span class="chev">${I.chevDown}</span></button>
        <div class="acc-b"><p>A talent agent decides your level from the interview and signs the report. At the end of a course, your cohort leader decides whether you move up, hold or drop back, and writes the reason.</p></div></div>
    </div>
  </div>
</div></main>`;
};

V.report = (f) => `<main class="main"><div class="page">
  ${crumb(['My Level','level'],'Report')}
  <div class="lvl-hero">
    <div class="eb">Confirmed August 21</div>
    <div class="big">${lvlName(f.level)}</div>
    <div class="sub">Rung ${rungOf(f.level)} of 15 on the Explorer track</div>
    ${ladder(f.level)}
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
      <div class="note mt5" style="background:var(--layer-02);border-left-color:var(--gray-50)">
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
        <p class="t-label-01" style="color:var(--text-secondary)">Strengths</p>
        <p>You reason from consequence to people, not policy. You gave three examples where you changed a decision after listening, and each one had a date and a name attached.</p>
        <p class="t-label-01" style="color:var(--text-secondary)">Growth areas</p>
        <p>You describe delegation as risk. Twice you took work back rather than let it land badly. Chapters 4 and 12 are built on exactly this.</p>
      </div>
      <div class="ai-foot"><span class="t-legal-01" style="color:var(--text-helper)">Written by Priya Nair from your interview</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Clips for your report</h2></div>
    <p class="t-body-01 mb5" style="color:var(--text-secondary)">Priya marked six moments from your interview. Keep the three you would be happy to show an employer. The rest are removed from the shared version.</p>
    <div class="tile-stack">
      ${clip('The reorganization call','Where you changed your mind after listening','02:14','1:48',true)}
      ${clip('Handing over the vendor review','You explain why you took it back','11:02','2:10',true)}
      ${clip('The Friday rhythm','How your weekly meeting actually runs','19:37','1:22',true)}
      ${clip('Managing up','Answer trails off at the end','24:50','2:41',false)}
      ${clip('Conflict with a peer','Strong opening, thin resolution','31:15','1:56',false)}
      ${clip('Closing reflection','Summary of your own gaps','41:03','1:11',false)}
    </div>
    <p class="t-helper-01 mt4" id="clipCount">3 of 3 kept. Deselect one to swap.</p>
    <div class="mt5">${askChip('What does Explorer E3 mean in practice?','Ask Tal what E3 means')}</div>
  </div>
  <div class="sec"><div class="btn-set">
    ${f.enrolled||f.complete?'':`<button class="btn btn-p" data-go="enrol">Enroll on Explorer Track &ndash; E3 ${I.arrowRight}</button>`}
    <button class="btn btn-t">Download report as PDF ${I.download}</button>
    <button class="btn btn-t">Watch the full interview ${I.video}</button>
  </div></div>
</div></main>`;

V.interviews = (f) => {
  const booked = S.stage==='booked';
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Interviews')}
  ${ph('Interviews', f.complete?'Your interview history, and the re-interview that set your current level.'
    : f.reinterview?'Your ninety days are complete. Book a re-interview to have them assessed, and whoever you pick reads your summary first.'
    : booked?'Your booked interview, and what happens after it.'
    : 'Agents set their own price and availability. Rank reflects how their past candidates performed over ninety days.')}
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
      <button class="btn btn-p">Join the interview ${I.video}</button>
      <button class="btn btn-t">Add to calendar ${I.calendar}</button>
      <button class="btn btn-t" data-go="agents">Reschedule or cancel ${I.time}</button>
    </div>
    <p class="t-helper-01 mt4">Free to reschedule up to 24 hours before. Inside 24 hours the fee is not refundable.</p>
  </div>`:`
  <div class="sec">
    <div class="tile mb5" style="padding:0 0 var(--s05)">
      <span class="gfx wide" style="background:${PAL.interview.a}">${GFX.interview}<span class="gfx-tag">45 minutes, recorded</span></span>
      <h3 style="padding:0 var(--s05);margin:var(--s05) 0 var(--s02)">How the interview works</h3>
      <div class="sub" style="padding:0 var(--s05)">A talent agent takes you through real situations from your own answers, then writes your report and sets your level. You choose who interviews you.</div>
    </div>
    <button class="btn btn-p" data-go="agents">${f.reinterview?'Book your re-interview':'Choose an agent'} ${I.arrowRight}</button>
  </div>`}
  ${(f.enrolled||f.complete||!f.pred)?`
  <div class="sec tint">
    <div class="sec-h"><h2>Past interviews</h2></div>
    <div class="tile-stack">
      ${f.complete?`<button class="tile clk arrow" data-go="report">
        <div class="t-label-01" style="color:var(--text-secondary)">Re-interview · Nov 21, 2026</div>
        <h3 class="mt3">Priya Nair</h3><div class="sub">Promoted to Explorer &ndash; E4 · 45 min</div>
        <svg class="tile-arrow" viewBox="0 0 32 32">${inner('arrowRight')}</svg></button>`:''}
      <button class="tile clk arrow" data-go="report">
        <div class="t-label-01" style="color:var(--text-secondary)">Level interview · Aug 20, 2026</div>
        <h3 class="mt3">Priya Nair</h3><div class="sub">Confirmed Explorer &ndash; E3 · 45 min · report signed</div>
        <svg class="tile-arrow" viewBox="0 0 32 32">${inner('arrowRight')}</svg></button>
    </div>
  </div>`:''}
</div></main>`;
};

V.agents = (f) => `<main class="main"><div class="page">
  ${crumb(['Interviews','interviews'],'All agents')}
  ${ph(f.reinterview?'Choose an agent for your re-interview':'Choose an agent','Agents set their own price and availability. Rank reflects how their past candidates performed over ninety days.')}

  <div class="sec" style="padding-bottom:var(--s05)">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>Suggested for you</h3></div>
      <div class="ai-body"><p>3 of 24 agents assess ${f.pred?'Explorer candidates':'at your level'} and have a slot inside seven days. They are ordered by how their past candidates progressed.</p></div>
    </div>
  </div>

  <div class="rail-wrap">
    <div class="rail">${['priya','owen','lena'].map(k=>agentCardH(k)).join('')}</div>
  </div>

  <div class="sec" style="padding-top:var(--s07)">
    <div class="srch" style="margin-bottom:0">
      <svg class="mag" viewBox="0 0 32 32">${inner('search')}</svg>
      <input class="inp" placeholder="Search all 24 agents" aria-label="Search agents">
    </div>
  </div>

  <div class="sec">
    <div class="sec-h"><h2>All agents</h2><span class="t-helper-01">Soonest first</span></div>
    <div class="tile-stack">${['priya','owen','lena','samuel','hana'].map(k=>agentCard(k)).join('')}</div>
  </div>
</div></main>`;

V.agent = (f) => {
  const a = AGENTS[S.agent||'priya'];
  const slots = ['9:00 AM','11:30 AM','2:00 PM','4:30 PM','6:30 PM','8:00 PM'];
  return `<main class="main"><div class="page">
  ${crumb(['Interviews','interviews'],['All agents','agents'],a.n)}
  <div class="sec" style="padding-top:var(--s05)">
    <div class="ag" style="padding:0;background:transparent">
      ${avatar(a,56)}
      <div class="ag-b">
        <div class="ag-n" style="font-size:20px;line-height:26px;font-weight:400">${a.n}</div>
        <div class="ag-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span><span class="t-helper-01">· ${a.ivs} interviews</span></div>
        <div class="tag-row mt3"><span class="tag">Assesses ${a.range}</span><span class="tag green">${I.checkFilled}Verified</span></div>
      </div>
    </div>
    ${a.bio?`<p class="t-body-01 mt5" style="color:var(--text-secondary)">${a.bio}</p>`:''}
    <div class="mt5">
      <div class="kv"><span class="k">Interview fee</span><span class="v">${a.price}</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Report turnaround</span><span class="v n">Within 24 hours</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>What to expect with ${a.n.split(' ')[0]}</h3></div>
      <div class="ai-body"><p>She opens with a real situation from your own answers, then asks about the decision you made. Candidates find the delegation question hardest, so have an example ready where you handed something over and it went wrong.</p></div>
      <div class="ai-foot">${askChip('Run a practice interview with me for '+a.n.split(' ')[0],'Practice with Tal')}</div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Pick a slot</h2><span class="t-helper-01">Times in ET</span></div>
    <div class="daystrip">
      ${[['Wed',19],['Thu',20],['Fri',21],['Mon',24],['Tue',25]].map(([d,n],i)=>
        `<button class="day ${i===1?'on':''}"><div class="d">${d}</div><div class="n">${n}</div></button>`).join('')}
    </div>
    <div class="slots">${slots.map((t,i)=>
      `<button class="slot ${i===4?'on':''}" ${i===0||i===5?'disabled':''}>${t}</button>`).join('')}</div>
    <p class="t-helper-01 mt4">Two other candidates are looking at Thursday. Slots are held for 10 minutes once you continue.</p>
    <div class="mt5">${askChip('What should I prepare before this interview?','Ask Tal what to prepare')}</div>
  </div>
</div></main>
<div style="flex:none;background:var(--layer-01);border-top:1px solid var(--border-subtle-01);padding:var(--s04) var(--s05)">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:var(--s04)">
    <span class="t-body-compact-01">Thu, Aug 20 · 6:30 PM</span><span class="t-heading-02">${a.price}</span></div>
  <button class="btn btn-p" data-go="booking" style="max-width:none">Continue to payment ${I.arrowRight}</button>
</div>`;
};

V.booking = (f) => `<main class="main"><div class="page">
  <div class="sec" style="padding-top:var(--s06)">
    <div class="note succ"><span>${I.checkFilled}</span><div class="nb"><b>Interview booked</b>Thursday, August 20 at 6:30 PM ET with ${(AGENTS[S.agent||'priya']).n}. A calendar invite and joining link are in your email.</div></div>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="kv"><span class="k">Agent</span><span class="v">${(AGENTS[S.agent||'priya']).n}</span></div>
      <div class="kv"><span class="k">When</span><span class="v">Thu, Aug 20 · 6:30 PM ET</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Paid</span><span class="v n">${(AGENTS[S.agent||'priya']).price} · Visa ending 4242</span></div>
    </div>
    <div class="btn-set mt5">
      <button class="btn btn-t">Add to calendar ${I.calendar}</button>
      <button class="btn btn-t" data-go="interviews">Reschedule or cancel ${I.time}</button>
    </div>
  </div>
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>Time to prepare</h3></div>
      <div class="ai-body"><p>Your quiz flagged delegation and hard conversations. You can run a 10-minute practice session on either and get feedback on where your answer was thin.</p></div>
      <div class="mt5" style="display:flex;flex-direction:column;gap:1px">
        <button class="tile clk" data-tal-ask="Run a mock interview on delegation" style="background:var(--layer-02);padding:var(--s04)"><span class="t-body-compact-01">Run a mock on delegation</span></button>
        <button class="tile clk" data-tal-ask="Help me find a real delegation example from my own work" style="background:var(--layer-02);padding:var(--s04)"><span class="t-body-compact-01">Help me find a real example</span></button>
      </div>
      
    </div>
  </div>
  <div class="sec"><button class="btn btn-p" data-go="stage:booked">Back to my dashboard ${I.arrowRight}</button></div>
</div></main>`;

V.enrol = (f) => {
  const next = f.complete;
  const lvl = next?'E4':'E3';
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],next?'Next course':'Enroll')}
  <div class="sec" style="padding-top:var(--s05);padding-bottom:var(--s05)">
    <span class="gfx wide" style="background:${PAL.course.a}">${GFX.course}<span class="gfx-tag">Explorer track · level ${lvl}</span></span>
  </div>
  <div class="ph" style="padding-top:0">
    <div class="ph-top">${bk()}<h1>Explorer Track &ndash; ${lvl}</h1></div>
    <p>90 days, 13 chapters, and a cohort of ten with a live cohort leader.</p>
  </div>
  <div class="sec" style="padding-bottom:var(--s06)">
    <div class="ai-aura tile tight">
      <div class="ai-head">${talLabel()}<h3>What the 90 days ask of you</h3></div>
      <div class="ai-body"><p>About an hour a week on the chapters, plus a 60-minute cohort call. People who keep to that finish with an average above 85%.</p></div>
      <div class="ai-foot">${askChip('How much time does the course really take each week?','Ask Tal about the workload')}</div>
    </div>
  </div>
  <div class="sec">
    <div class="stats">
      <div class="stat"><div class="l">Chapters</div><div class="n">13</div><div class="d">one a week</div></div>
      <div class="stat"><div class="l">Live calls</div><div class="n">13</div><div class="d">60 min, weekly</div></div>
      <div class="stat"><div class="l">Cohort size</div><div class="n">10</div><div class="d">max, all at ${lvl}</div></div>
      <div class="stat"><div class="l">Re-interview</div><div class="n">Day 91</div><div class="d">then you move</div></div>
    </div>
  </div>
  <div class="sec">
    <div class="note"><span>${I.group}</span><div class="nb"><b>Your cohort is assigned for you</b>You join a group of up to ten people at your level, led by a cohort leader. Your cohort and its weekly call time appear on your dashboard as soon as you enroll.</div></div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>What the 90 days cover</h2><a data-go="coursework">All 13</a></div>
    <div class="tile-stack">${[0,1,2,3].map(i=>chRow(i,{done:0,open:-1,week:99,enrolled:false})).join('')}</div>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="kv"><span class="k">Course fee</span><span class="v">$690</span></div>
      <div class="kv"><span class="k">${next?'Returning candidate credit':'Interview already paid'}</span><span class="v n">&minus;$95</span></div>
      <div class="kv"><span class="k">Due today</span><span class="v">$595</span></div>
    </div>
    <p class="t-helper-01 mt4">One payment. Nothing recurs, and the re-interview at the end is included.</p>
    <div class="mt5">${askChip('What happens on the weekly cohort call?','Ask Tal about the calls')}</div>
    <div class="mt5"><button class="btn btn-p" data-go="payment">Continue to payment ${I.arrowRight}</button></div>
  </div>
</div></main>`;
};

V.payment = (f) => `<main class="main"><div class="page">
  ${crumb(['Enroll','enrol'],'Payment')}
  ${ph('Payment','Explorer Track &ndash; E3 · 90 days · your cohort starts within two weeks.')}
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
    <div class="note mt5" style="background:var(--layer-02);border-left-color:var(--gray-50)"><span style="fill:var(--icon-secondary)">${I.shield}</span><div class="nb">Card details go straight to our payment processor. TalentNext never stores them.</div></div>
    <div class="mt5"><button class="btn btn-p" data-go="stage:week1">Pay $595 and start ${I.arrowRight}</button></div>
    <p class="t-legal-01 mt5" style="color:var(--text-helper)">Full refund up to 7 days after your cohort starts, provided you have not completed more than one chapter.</p>
  </div>
</div></main>`;

V.coursework = (f) => {
  const pct = Math.round(f.done/13*100);
  const hrs = Math.floor(f.mins/60)+'h '+(f.mins%60)+'m';
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Coursework')}
  ${ph('Coursework',`${f.done} of 13 chapters &middot; ${pct}% &middot; ${hrs} invested`)}
  <div class="sec">
    <div class="pb"><div class="pb-track"><div class="pb-fill" style="width:${pct}%"></div></div></div>
    <div class="note"><span>${I.info}</span><div class="nb">Your cohort moves together. Chapter ${Math.min(f.week+1,13)} opens on Monday, whether or not you finish the ones before it.</div></div>
  </div>
  <div class="sec flat" style="padding:0">
    <div class="tile-stack">${CH.map((_,i)=>chRow(i,f)).join('')}</div>
  </div>
</div></main>`;
};

V.chapter = (f) => {
  const i = S.ch ?? f.open ?? 3;
  const name = CH[i][0], mins = CH[i][1];
  const inprog = S.stage==='day34' && i===3;
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
      <div class="kv"><span class="k">Roleplay</span><span class="v n">${done?'Complete':'Not started'}</span></div>
      <div class="kv"><span class="k">Assessment</span><span class="v n">${done?SCORE[i]+'%':'Locked until the roleplay is done'}</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="note"><span>${I.launch}</span><div class="nb"><b>Content opens in LightSpeed VT</b>You are signed in automatically. Your progress comes back here within a minute of you finishing.</div></div>
    <div class="mt5"><button class="btn btn-p">${done?'Revisit in LightSpeed VT':inprog?'Continue in LightSpeed VT':'Start in LightSpeed VT'} ${I.launch}</button></div>
  </div>
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>Help with this chapter</h3></div>
      <div class="ai-body"><p>${i===3?'This chapter comes down to one question: what has to be true before you hand something over. Most people get stuck because they treat it as a question about trust when it is a question about clarity.':'You can get a summary of this chapter, its key terms, or a few questions to test yourself once you have watched the video.'}</p></div>
      <div class="mt5" style="display:flex;flex-direction:column;gap:1px">
        ${['Explain this chapter in 60 seconds','Give me the two key terms','I am stuck, ask me a question instead'].map(q=>
          `<button class="tile clk" data-tal-ask="${q}" style="background:var(--layer-02);padding:var(--s04)"><span class="t-body-compact-01">${q}</span></button>`).join('')}
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Your notes</h2></div>
    <textarea class="inp ai-field" placeholder="What landed, what did not">${i===3?'Handed the vendor review to Sam and took it back after two days. Did not tell him why.':''}</textarea>
    <div class="mt4">${askChip('Turn my note into a reflection for this chapter','Turn this into a reflection')}</div>
    
  </div>
</div></main>`;
};

V.rewards = (f) => {
  const g = GAME[S.stage];
  if(!g) return `<main class="main"><div class="page">${ph('Points','Points start once you enroll on a course.')}
    <div class="sec"><div class="empty" style="padding:0 0 var(--s07)"><span class="gfx wide" style="background:${PAL.points.a}">${GFX.points}</span><h3 style="margin-top:var(--s06)">Nothing to show yet</h3>
      <p>Points, badges and rank begin when your cohort starts.</p></div></div></div></main>`;
  const tab = S.rtab || 'points';
  const counts = {points:`${g.got.length} of ${PTS.length} earned`, badges:`${g.badges} of ${BDG.length} earned`, rank:`Currently ${RANKS[g.rank-1].n}`};
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Points')}
  ${ph('Points','Points, badges and rank come from your activity across the course and the community.')}
  <div class="sec" style="padding-bottom:var(--s06)">${scoreCard(g)}</div>
  <div class="tabs">
    ${['points','badges','rank'].map(k=>`<button class="${k===tab?'on':''}" data-rtab="${k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}
  </div>
  <div class="sec" style="padding-top:var(--s05)">
    <div class="sec-h" style="margin-bottom:var(--s04)"><span class="t-helper-01">${counts[tab]}</span>
      <span class="t-helper-01" style="margin-left:auto">Updated today</span></div>
    <div class="aw-list">
      ${tab==='points'?pointsList(g):tab==='badges'?badgeList(g):rankList(g)}
    </div>
    ${tab==='points'?`<p class="t-helper-01 mt5">Points update within a few minutes of the activity.</p>
    <div class="mt5">${askChip('How do I earn points fastest?','Ask Tal how to earn more')}</div>`:''}
    ${tab==='rank'?`<p class="t-helper-01 mt5">Rank reflects your activity. It is separate from your level.</p>`:''}
  </div>
</div></main>`;
};

V.transcript = (f) => {
  const pct = Math.round(f.done/13*100);
  const hrs = Math.floor(f.mins/60)+'h '+(f.mins%60)+'m';
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Transcript')}
  ${ph('Transcript', (f.complete||f.finished)?'Explorer Track &ndash; E3 · Cohort 41 · ninety days complete':`Explorer Track &ndash; E3 · Cohort 41 · day ${f.day} of 90`)}
  <div class="sec">
    <div class="stats">
      <div class="stat"><div class="l">Chapters done</div><div class="n">${f.done} <small>of 13</small></div><div class="d">${pct}%</div></div>
      <div class="stat"><div class="l">Assessment average</div><div class="n">${f.avg?f.avg+'<small>%</small>':'<small style="font-size:16px">Not yet</small>'}</div><div class="d">${f.avg?'cohort average 79%':'nothing assessed yet'}</div></div>
      <div class="stat"><div class="l">Time invested</div><div class="n">${hrs.split(' ')[0]}<small>${hrs.replace(/^\S+/,'')}</small></div><div class="d">${f.done?Math.round(f.mins/f.done)+' min per chapter':'not started'}</div></div>
      <div class="stat"><div class="l">Tasks on time</div><div class="n">${S.stage==='day34'?'4 <small>of 5</small>':S.stage==='week1'?'0 <small>of 0</small>':'12 <small>of 13</small>'}</div><div class="d">${S.stage==='week1'?'none due yet':'one overdue'}</div></div>
    </div>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="ai-head"><h3>90-day summary · ${f.complete?'signed':'in progress'}</h3></div>
      <div class="ai-body"><p>${f.complete?'Priya signed this on November 21. It is what your re-interview was assessed against, and it is yours to share.':'Priya adds to this after each weekly call and signs it at the end of the ninety days. Until then nothing in it is final.'}</p></div>
      <div class="tag-row mt5">${f.complete?`<span class="tag green">${I.checkFilled}Signed by Priya Nair</span>`:`<span class="tag warm">${I.warningAlt}Not signed yet</span><span class="tag cool">Updated today</span>`}</div>
      <div class="ai-foot"><a class="lk">${f.complete?'Read the summary':'Read what Priya has written'}</a></div>
    </div>
  </div>
  ${f.done?`<div class="sec">
    <div class="tile" style="padding-top:var(--s04)">
      ${lineChart('sc',{title:'Assessment scores',sub:'70 to 100%',
        data:SCORE.slice(0,f.done),labels:CH.map((c,i)=>'Chapter '+(i+1)),slots:13,
        target:79,targetLabel:'Cohort average 79%',unit:'%',min:70,max:100})}
    </div>
  </div>
`:''}
  <div class="sec tint">
    <div class="sec-h"><h2>Chapter record</h2></div>
    <div class="tile">
      ${CH.slice(0,5).map((c,i)=>`<div class="kv"><span class="k">${String(i+1).padStart(2,'0')} · ${c[0]}</span>
        <span class="${i<f.done?'v':'v n'}" ${i<f.done?'':'style="color:var(--text-secondary)"'}>${i<f.done?SCORE[i]+'%':(i===f.open?'In progress':'Not started')}</span></div>`).join('')}
    </div>
    <div class="mt4"><button class="btn btn-g" data-go="coursework">Show all 13 ${I.chevDown}</button></div>
  </div>
  ${f.done>0?`<div class="sec">
    <div class="cert"><span class="pict on-dark" style="margin:0 auto var(--s05)">${PG.certificate}</span>
      <div class="n">Explorer Track &ndash; ${f.complete?'E3':'E2'}</div>
      <div class="m">${f.complete?'Completed November 21, 2026 · Cohort 41':'Completed May 4, 2026 · Cohort 12'}</div>
      <div class="m" style="margin-top:var(--s02)">Signed by ${f.complete?'Priya Nair':'Daniel Kerr'}</div>
      <div class="mt5" style="display:flex;gap:1px">
        <button class="btn btn-sm noic" style="flex:1;justify-content:center;background:var(--gray-80);color:#fff">Download</button>
        <button class="btn btn-sm noic" style="flex:1;justify-content:center;background:var(--gray-80);color:#fff">Share link</button>
      </div></div>
  </div>`:''}
</div></main>`;
};

V.cohort = (f) => `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Cohort 41')}
  ${ph('Cohort 41',`Ten people at Explorer &ndash; E3, led by Priya Nair &middot; week ${f.week} of 13`)}
  <div class="sec">
    <div class="tile" style="padding:0 0 var(--s05)">
      <span class="gfx wide" style="background:${PAL.cohort.a}">${GFX.cohort}<span class="gfx-tag">Weekly call · in 2 days</span></span>
      <div class="t-label-01" style="padding:0 var(--s05);margin-top:var(--s05);color:var(--text-secondary)">Cohort 41</div>
      <div class="t-heading-03 mt3" style="padding:0 var(--s05)">Thursday 6:00 PM ET</div>
      <div class="t-body-01 mt3" style="padding:0 var(--s05);color:var(--text-secondary)">60 minutes · Priya Nair · 9 others</div>
      <div class="mt5" style="padding:0 var(--s05)"><button class="btn btn-p btn-sm noic" style="justify-content:center">Add to calendar</button></div>
    </div>
  </div>
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>What to bring on Thursday</h3></div>
      <div class="ai-body"><p>Priya is running week ${f.week} on ${f.week<=1?'why we exist':'hard conversations'}. Bring the Sam handover from your notes. It is the closest real example you have, and three others in the cohort flagged the same chapter.</p></div>
      
    </div>
  </div>
  <div class="sec">
    <div class="mb5">${askChip('What should I say on Thursday&rsquo;s call?','Ask Tal about the call')}</div>
    <div class="cs">
      <button class="${S.ctab!=='discussion'?'on':''}" data-ctab="members">Members</button>
      <button class="${S.ctab==='discussion'?'on':''}" data-ctab="discussion">Discussion</button>
    </div>
    ${S.ctab==='discussion'? discussionList() : `<div class="tile-stack">
      ${mem('Maryam Naz','MN','Chapter '+(f.open+1)+' · active today',true)}
      ${mem('Aisha Bello','AB','Active today')}
      ${mem('Daniel Kerr','DK','Active today')}
      ${mem('Sofia Marchetti','SM','Active 2 days ago')}
      ${mem('Ravi Chandran','RC','Active today')}
      ${mem('Nora Lindqvist','NL','Active 3 days ago')}
      ${mem('James Whitby','JW','Active today')}
      ${mem('Chloe Ferreira','CF','Active 5 days ago')}
      ${mem('Tobias Mensah','TM','Active 8 days ago')}
      ${mem('Yuki Tanaka','YT','Not active recently')}
    </div>`}
  </div>
</div></main>`;

V.messages = (f) => `<main class="main"><div class="page" style="padding-bottom:var(--s05)">
  <div class="ph" style="padding-bottom:var(--s04)"><h1>Messages</h1>
    <p>One-to-one with Priya Nair. Private, and it stays after the cohort closes.</p></div>

  <div class="msgs">
    <div class="msg"><div class="bub">Week 5 is the one people find hardest. If chapter 4 is not landing, say so on Thursday rather than pushing through it.</div><div class="mt">Priya Nair · Mon 11:04 AM</div></div>
    <div class="msg me"><div class="bub">It is not landing. I keep taking work back and I do not know how to stop doing that.</div><div class="mt">You · Mon 9:36 PM</div></div>
    <div class="msg"><div class="bub">Good. That is the actual chapter. Bring the vendor review example on Thursday and we will work through it with the group, if you are happy with that.</div><div class="mt">Priya Nair · Tue 9:12 AM</div></div>
  </div>
</div></main>
<div class="tal-sugg" style="padding:0 var(--s05) var(--s04);flex:none">
  ${askChip('Help me word a reply to Priya','Help me word a reply')}
</div>
<div class="composer" style="flex:none">
  <input class="inp" placeholder="Message Priya" aria-label="Message">
  <button aria-label="Send">${I.send}</button>
</div>`;

V.billing = (f) => {
  const rows = [];
  if(f.enrolled||f.complete) rows.push(['Explorer Track &ndash; E3','Aug 14, 2026','$595','Visa','4242']);
  if(!f.pred) rows.push(['Interview · Priya Nair','Aug 13, 2026','$95','Visa','4242']);
  if(S.stage==='booked') rows.push(['Interview · Priya Nair','Aug 13, 2026','$95','Visa','4242']);
  rows.push(['Explorer Track &ndash; E2','Feb 4, 2026','$490','Mastercard','8210']);
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Payments')}
  ${ph('Payments','One-off payments only. Nothing here recurs.')}
  <div class="sec"><div class="tile-stack">
    ${rows.map(([n,d,amt,br,last])=>`<div class="tile">
      <div style="display:flex;justify-content:space-between;gap:var(--s04)">
        <div><div class="t-heading-compact-01">${n}</div>
          <div class="paymeta mt3"><span>${d}</span><span>·</span>${br?bmk(br)+`<span class="n">&bull;&bull;&bull;&bull; ${last}</span>`:''}</div></div>
        <div style="text-align:right"><div class="t-heading-02">${amt}</div><span class="tag green sm mt3">Paid</span></div>
      </div>
      <div class="mt4"><button class="btn btn-g btn-sm">Receipt ${I.download}</button></div></div>`).join('')}
  </div></div>
  <div class="sec tint">
    <div class="sec-h"><h2>Saved cards</h2><span class="t-helper-01">${S.cards.length} of 3</span></div>
    <div class="tile-stack">
      ${S.cards.map((c,i)=>`<div class="cardrow">
        <span class="cardrow-ic">${BMK[c.brand]||BMK.card}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${c.brand} ending ${c.last}${c.def?' <span class="tag brand sm">Default</span>':''}</span>
          <span class="cardrow-d">Expires ${c.exp}</span>
        </span>
        <span class="cardrow-a">
          ${c.def?'':`<button class="lnk" data-setdef="${i}">Make default</button>`}
          <button class="lnk" data-delcard="${i}">Remove</button>
        </span>
      </div>`).join('')}
    </div>
    ${S.cards.length<3?`<div class="mt5"><button class="btn btn-t" data-addcard="1">Add a card ${I.add}</button></div>`
      :`<p class="t-helper-01 mt4">Three cards is the maximum. Remove one to add another.</p>`}
  </div>
</div></main>`;
};

/* add-a-card sheet */
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
        <div class="note mt5" style="background:var(--layer-02);border-left-color:var(--gray-50)"><span style="fill:var(--icon-secondary)">${I.shield}</span><div class="nb">Card details go straight to our payment processor. TalentNext never stores them.</div></div>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-addcard="0" style="justify-content:center">Cancel</button>
        <button class="btn btn-p noic" data-savecard="1" style="justify-content:center">Add card</button>
      </div>
    </div>
  </div>`;
}

V.account = (f) => `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Profile')}
  ${ph('Profile','Your details, your preferences, and what Tal is allowed to do.')}
  <div class="sec">
    <div class="tile">
      <div class="kv"><span class="k">Name</span><span class="v">Maryam Naz</span></div>
      <div class="kv"><span class="k">Email</span><span class="v n">maryam.naz@tkxel.io</span></div>
      <div class="kv"><span class="k">Time zone</span><span class="v n">Eastern Time (ET)</span></div>
      <div class="kv"><span class="k">Level</span><span class="v n">${f.pred?f.track+' track · set at the interview':lvlName(f.level)+' · confirmed'}</span></div>
    </div>
    <div class="mt4"><button class="btn btn-g">Edit details ${I.edit}</button></div>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Tal and your data</h2></div>
    <label class="tg"><div class="tb"><b>Tal, your coach</b><span>Can see your course progress and notes. Never your messages.</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Proactive nudges</b><span>Let Tal tell you when it spots you stalling on a chapter.</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <div class="btn-set mt5">
      <button class="btn btn-t">Ask for your level to be reviewed ${I.renew}</button>
      <button class="btn btn-t">Download everything we hold ${I.download}</button>
      <button class="btn btn-t">Manage interview recordings ${I.video}</button>
    </div>
    <p class="t-legal-01 mt5" style="color:var(--text-helper)">Recordings are deleted after 24 months. Deleting a recording does not reverse a confirmed level.</p>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Notifications</h2></div>
    <label class="tg"><div class="tb"><b>Weekly call reminders</b><span>24 hours and 1 hour before</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Task deadlines</b><span>The morning a task is due</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Product and course emails</b><span>Occasional, never more than monthly</span></div><input type="checkbox"><span class="sw"></span></label>
  </div>
  <div class="sec">
    <div class="note err"><span>${I.warning}</span><div class="nb"><b>Withdrawing consent closes your account</b>Interviews cannot be assessed without a recording. Your certificates stay valid and downloadable.</div></div>
    <div class="btn-set mt5">
      <button class="btn btn-t">Withdraw consent ${I.misuse}</button>
      <button class="btn btn-g" data-go="stage:signup">Log out ${I.logout}</button>
    </div>
  </div>
</div></main>`;

V.terms = AUTH.terms;

/* ============================================================
   RUNTIME
   ============================================================ */
const device = document.getElementById('device');
const pick   = document.getElementById('pick');
const cap    = document.getElementById('cap');

document.getElementById('ptLogo').src = LOGO_W;
pick.innerHTML = STAGES.map(([k,l])=>`<option value="${k}">${l}</option>`).join('');

const DEFAULT_VIEW = {signup:'create'};
function setStage(k,keepView){
  S.stage = k;
  const f = CFG[k];
  if(!keepView){
    S.view = DEFAULT_VIEW[k] || 'dashboard';
    S.ch = f.open;
  }
  /* if the current view is not reachable at this stage, fall back */
  const reachable = NAVSETS[f.nav].map(n=>n[0]).concat(['account','report','agents','agent','booking','payment','chapter','terms','rewards']);
  if(k!=='signup' && !reachable.includes(PARENT[S.view]||S.view)) S.view='dashboard';
  if(k==='signup') S.view = DEFAULT_VIEW.signup;
  S.hist = [];
  render();
}
function go(target, fresh){
  if(target.startsWith('stage:')){ setStage(target.slice(6)); return; }
  if(target.startsWith('agent:')){ S.agent = target.slice(6); S.hist.push(S.view); history.pushState({v:'agent'},''); S.view='agent'; S.nav=false; render(); return; }
  if(target.startsWith('chapter:')){ S.ch = +target.slice(8); S.hist.push(S.view); history.pushState({v:'chapter'},''); S.view='chapter'; S.nav=false; render(); return; }
  if(S.view!==target) talReset();
  if(fresh) S.hist = [];
  else if(S.view!==target){ S.hist.push(S.view); history.pushState({v:target},''); }
  S.view = target;
  S.nav = false;
  render();
}

/* Ask Tal something: the question lands, Tal thinks, then answers with widgets.
   Questions queue, so asking three things in a row gets three answers in order. */
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
  }, 650);
}
function talReset(){ talQueue = []; clearTimeout(talTimer); talTimer = null; S.thread = []; S.typing = false; }
function back(){
  const prev = S.hist.pop();
  if(prev){ S.view = prev; S.nav=false; S.notif=false; render(); }
}
function render(){
  const f = cfg(S.stage);
  let html;
  if(S.stage==='signup'){
    html = (AUTH[S.view]||AUTH.create)();
  } else {
    const view = V[S.view] || V.dashboard;
    html = shell() + sidenav(f) + view(f) + (['messages','agent','terms'].includes(S.view)?'':talFab())
         + talPanel(f) + notifPanel() + (S.view==='billing'?cardSheet():'');
  }
  device.innerHTML = `<div class="app">${html}</div>`;
  pick.value = S.stage;
  const st = STAGES.find(s=>s[0]===S.stage);
  cap.innerHTML = `<b>${st[1]}</b> · ${st[2]} <span style="color:var(--gray-50)">· everything inside the frame is clickable.</span>`;
  history.replaceState(null,'','#'+S.stage+'/'+S.view);
  const tb = device.querySelector('#talBody'); if(tb) tb.scrollTop = tb.scrollHeight;
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

/* one delegated listener runs the whole product */
device.addEventListener('click', e => {
  const t = e.target;

  const askT = t.closest('[data-tal-ask]');
  if(askT){ e.preventDefault(); S.tal = true; ask(askT.dataset.talAsk); return; }

  const bk = t.closest('[data-back]');
  if(bk){ back(); return; }

  const stp = t.closest('[data-stp]');
  if(stp){ const k=stp.dataset.stp; S.piOpen[k] = !S.piOpen[k]; render(); return; }

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
  if(ra){ (NOTIF[S.stage]||[]).forEach(n=>{ if(!S.read.includes(n.t)) S.read.push(n.t); }); render(); return; }

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
  const cs = t.closest('.cs button');   if(cs){ cs.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('on')); cs.classList.add('on'); return; }
  const rt2 = t.closest('[data-rtab]');
  if(rt2){ S.rtab = rt2.dataset.rtab; render(); return; }
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

/* keep the clip counter honest on the report screen */
device.addEventListener('change', e => {
  if(e.target.closest('.clip-pick')){
    const n = device.querySelectorAll('.clip-pick input:checked').length;
    const el = device.querySelector('#clipCount');
    if(el) el.textContent = n===3 ? '3 of 3 kept. Deselect one to swap.' : `${n} of 3 kept. Pick ${3-n} more.`;
  }
});

device.addEventListener('keydown', e => {
  if(e.key==='Enter' && e.target.closest('.tal-panel .composer')){
    e.preventDefault(); const v=e.target.value.trim(); if(v){ e.target.value=''; ask(v); }
  }
});
document.addEventListener('keydown', e => {
  if(e.target.matches('input,textarea,select')) return;
  const i = STAGES.findIndex(s=>s[0]===S.stage);
  if(e.key==='ArrowRight') setStage(STAGES[(i+1)%STAGES.length][0]);
  if(e.key==='ArrowLeft')  setStage(STAGES[(i-1+STAGES.length)%STAGES.length][0]);
});

const hash = location.hash.slice(1).split('/');
if(hash[0] && CFG[hash[0]]){ S.stage=hash[0]; S.view = hash[1] || (DEFAULT_VIEW[hash[0]]||'dashboard'); S.ch=CFG[hash[0]].open; render(); }
else setStage('new');
