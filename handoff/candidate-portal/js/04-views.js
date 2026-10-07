;

;
;

;
const cfg = k => Object.assign({}, CFG_BASE, CFG[k]);

const S = {stage:'new', view:'dashboard', portal:'candidate', tal:false, talQ:null, nav:false, notif:false, acct:false, peek:null, read:[], rtab:'points', crtMenu:null, ctab:'discussion', hist:[], thread:[], typing:false,
  dismissed:[],
  talAsked:0, celebDismiss:[],
  addCard:false, editPhoto:false, stg:0, notes:false, iv:'level',
  ivTopic:'', ivCancel:false, ivCancelNote:'', receipt:null, legalTab:'data',
  photoTab:'photo', photoPreview:null, avatarPick:'av1',
  payTab:'card',
  payWith:null,
  role:'candidate',
  outl:null,
  disc:{},
  certBan:{},
  scenes:{level:null, re:null}, scPick:{level:[], re:[]},
  cards:[{brand:'Visa',last:'4242',exp:'09/29',def:true},
         {brand:'Mastercard',last:'8210',exp:'04/28'},
         {brand:'Amex',last:'1005',exp:'11/27'}]};
const isLead = () => S.portal === 'leader';
;
const lvlName = c => 'Explorer – ' + c;
const who = f => f.pred ? f.track + ' track' : lvlName(f.level);
const rungOf  = c => RUNG[c] || 2;
;
;
;
;   /* chapters that map to this candidate's growth areas */

;
const notifList = () => isLead()
  ? (typeof LEAD_NOTIF !== 'undefined' ? LEAD_NOTIF : [])
  : (NOTIF[S.stage] || []);
const notifShown = () => notifList().filter(n=>!S.dismissed.includes(n.t));
const unreadCount = () => notifShown().filter(n=>n.unread && !S.read.includes(n.t)).length;
const notifReadInfo = () => notifShown().filter(n=>n.kind!=='cond' && !(n.unread && !S.read.includes(n.t)));

function notifPanel(){
  const list = notifShown();
  const rows = (group) => list.filter(n=>group==='today' ? /ago|Today/.test(n.w) : !/ago|Today/.test(n.w))
    .map(n=>{
      const un = n.unread && !S.read.includes(n.t);
      const info = n.kind!=='cond';
      return `<button class="nrow ${un?'un':''} ${info?'nrow-info':''}" data-go="${n.go}" data-read="${n.t}">
        <span class="nrow-ic">${I[n.ic]}</span>
        <span class="nrow-b"><span class="nrow-t">${n.t}</span><span class="nrow-d">${n.b}</span></span>
        <span class="nrow-w">${n.w}</span>
        ${info?`<span class="nrow-x" role="button" tabindex="0" data-dismiss="${n.t}" aria-label="Dismiss notification">${I.close}</span>`:''}
      </button>`;
    }).join('');
  const today = rows('today'), earlier = rows('earlier');
  return `<div class="notif-scrim ${S.notif?'on':''}" data-toggle="notif" aria-hidden="true"></div>
  <div class="notif ${S.notif?'on':''}">
    <div class="notif-h">
      <h2>Notifications</h2>
      ${unreadCount()?`<button class="notif-all" data-readall="1">Mark all read</button>`:''}
      ${notifReadInfo().length?`<button class="notif-all" data-dismissread="1">Dismiss all read</button>`:''}
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

;
;

function sidenav(f){
  const active = PARENT[S.view] || S.view;
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

const PORTALS = [['candidate','Candidate','hana'],['leader','Cohort Leader','priya']];
const otherPortal = () => PORTALS.find(([k]) => k !== S.portal);
const AGENT_PORTAL = '../tn-agent-portal.html';
const ADMIN_PORTAL = '../tn-admin-portal.html';


const CRUMB_FOOT = {account:'Profile', leadProfile:'Profile'};

function crumbMod(view){
  const v = view || S.view;
  const k = PARENT[v] || v;
  if(CRUMB_FOOT[k]) return [CRUMB_FOOT[k], k];
  const row = NAVSETS[isLead() ? 'leader' : cfg(S.stage).nav].find(([n]) => n === k);
  return row ? [row[1], row[0]] : null;
}

const crumbBar = () =>
  `<nav class="crumb-bar" aria-label="Breadcrumb"><ol class="crumb-trail"></ol></nav>`;

function acctMenu(){
  const [ok, ol, oi] = otherPortal();
  const prof = isLead() ? 'leadProfile' : 'account';
  return `<div class="acct-menu ${S.acct?'on':''}" role="menu" aria-label="Account">
    <button class="acct-i" role="menuitem" data-go="${prof}" data-pftab="me">
      <span class="acct-i-mk">${I.user}</span>
      <span class="acct-i-t">My profile</span>
    </button>
    <button class="acct-i" role="menuitem" data-go="${prof}" data-pftab="priv">
      <span class="acct-i-mk">${I.settings}</span>
      <span class="acct-i-t">Profile settings</span>
    </button>
    <button class="acct-i" role="menuitem" data-swap="${ok}">
      <span class="acct-i-mk acct-i-av"><img src="${AV[oi]}" alt=""></span>
      <span class="acct-i-t">Switch to ${ol}</span>
    </button>
    <button class="acct-i" role="menuitem" data-doc="${AGENT_PORTAL}">
      <span class="acct-i-mk acct-i-av"><img src="${AV.owen}" alt=""></span>
      <span class="acct-i-t">Switch to Talent Agent</span>
    </button>
    <button class="acct-i" role="menuitem" data-doc="${ADMIN_PORTAL}">
      <span class="acct-i-mk acct-i-av"><img src="${AV.samuel}" alt=""></span>
      <span class="acct-i-t">Switch to Super Admin</span>
    </button>
    <button class="acct-i" role="menuitem" data-go="stage:signup/login">
      <span class="acct-i-mk">${I.logout}</span>
      <span class="acct-i-t">Sign out</span>
    </button>
  </div>`;
}

function shell(){
  const f = cfg(S.stage);
  const name = isLead() ? 'Cohort Leader &middot; Explorer and Builder' : who(f);
  return `
  <header class="shell">
    <button class="shell-act nav-t ${S.nav?'on':''}" data-toggle="nav" aria-label="${S.nav?'Collapse':'Expand'} navigation" title="${S.nav?'Collapse':'Expand'} navigation">${S.nav?I.close
      :`<span class="nav-t-mark">${TN_MARK}</span><span class="nav-t-menu">${I.menu}</span>`}</button>
    <button class="shell-logo" data-go="${isLead()?'leadDash':'dashboard'}" aria-label="TalentNext home"><img src="${LOGO_K}" alt="TalentNext"></button>
    ${crumbBar()}
    <div class="shell-right">
      ${isLead() && V.leadDash ? leadHeaderChip() : ''/* EPIC 12 (12.1): the leader header carries
             the current cohort name and week. The `V.leadDash` guard is the
             cross-file TDZ fence lead.js records: on a `#leader/...` deep link
             views.js's boot render runs BEFORE lead.js initialises its consts,
             and `leadHeaderChip` reads `leadLive()` (a lead.js const in its
             temporal dead zone then). `V.leadDash` is undefined until lead.js
             assigns it, so it is a safe proxy for "lead.js has run" — the boot
             render skips the chip and lead.js's own foot render() draws it.
             the current cohort name and week throughout the workspace. This is
             functional context (which cohort am I in), not the decorative
             "Explorer track" label removed below, so it is reintroduced only for
             the leader and only where a live cohort exists. */}
      ${''/* THE TRACK/ROLE TEXT IS REMOVED from the top bar (Maryam, 16 Sep 2026:
             "remove the Explorer track text from the top nav, all the portals have
             something in place of Explorer track so remove them all"). The candidate
             showed "Explorer track" and the leader "Cohort Leader · …"; the agent
             portal already dropped its `.shell-name` and the admin never had one, so
             all four bars now carry only the notification bell and the account menu.
             `name`/`who(f)` stay computed and unused — a one-line revert. */}
      <button class="shell-act ${S.notif?'on':''}" data-toggle="notif" aria-label="Notifications">${I.notification}${unreadCount()?`<span class="shell-badge">${unreadCount()}</span>`:''}</button>
      ${/* THE FACE IS A MENU NOW, NOT A LINK, and the chevron is what says so.
            Pressed, it used to go straight to Profile; that destination is the
            menu's first item, so nothing was taken away — a second one was
            added under the same mark, which is the only reason the affordance
            has to change. `aria-haspopup` and `aria-expanded` are the pair a
            screen reader needs to hear the difference.

            THE CHEVRON IS `.acct-c`, NOT A `.shell-act svg`. §01 sizes every
            glyph in this bar at 24px and fills it `--icon-primary`; at 24 next
            to a 32px face it reads as a second control rather than as the
            face's own disclosure. §77 sizes it and §63 §17 inks it. */''}
      <button class="shell-act acct-t ${S.acct?'on':''}" data-toggle="acct"
        aria-label="Account" aria-haspopup="menu" aria-expanded="${S.acct?'true':'false'}">
        <span class="shell-avatar"><img src="${isLead()?AV.priya:AV.hana}" alt=""><i>${isLead()?'PN':'MN'}</i></span>
        <svg class="acct-c" viewBox="0 0 24 24" aria-hidden="true">${inner('chevDown')}</svg>
      </button>
      ${acctMenu()}
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

const talLabel = (s) => `<span class="ai-label${s?' '+s:''}">Tal</span>`;

function stars(n){
  let out='';
  for(let i=1;i<=5;i++) out += `<svg class="${i<=Math.round(n)?'f':''}" viewBox="0 -960 960 960">${inner(i<=Math.round(n)?'star':'starOutline')}</svg>`;
  return `<span class="stars">${out}</span>`;
}
;
;
function avatar(a,size){
  return `<span class="av-ph"${size?` style="width:${size}px;height:${size}px"`:''}>
    <i>${a.i}</i><img src="${a.img}" alt="" loading="lazy" onerror="this.style.display='none'"></span>`;
}
const talStar = (q) => `<button class="tal-star" data-tal-ask="${q}" aria-label="Ask Tal"><span class="lbl">Ask Tal</span><span class="sk-mark xs"></span></button>`;


const AG_TAGS_SHOWN = 3;
function agentTags(a){
  const t = a.tags || [];
  const more = t.length - AG_TAGS_SHOWN;
  return t.slice(0, AG_TAGS_SHOWN).map(x=>`<span class="tag agt-tag">${x}</span>`).join('') +
    (more > 0 ? `<span class="tag agt-tag agt-more">+${more}</span>` : '');
}

function agentRow(key){
  const a = AGENTS[key];
  const rec = key === recKey() ? '<span class="ag-rec">Recommended</span>' : '';
  return `<div class="agt-r draw">
    <span class="agt-c agt-who">
      ${avatar(a,48)}
      <span class="agt-wb">
        <span class="agt-n">${a.n}${rec}</span>
        <span class="agt-rate">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span></span>
        <span class="agt-m">${a.range} · ${a.ivs} interviews</span>
      </span>
    </span>
    <span class="agt-c agt-tags">${agentTags(a)}</span>
    ${''/* EXPERIENCE IS THE YEARS AND NOTHING ELSE (Maryam, 4 Sep 2026:
          "remove the interview part from experience"). It read "3 yrs" over
          "210 interviews", and that second line is printed 500px to its left in
          the SAME ROW — `.agt-m` is "E1–E3 · 210 interviews". One figure, two
          columns, which is the repetition §72 took out of the pulse and §73 out
          of the social-proof row. The count stays where it identifies the
          agent; the column keeps the fact it is named after. */}
    <span class="agt-c agt-exp"><span class="agt-v">${a.yrs} yrs</span></span>
    <span class="agt-c agt-fee">${a.price}</span>
    <span class="agt-c agt-act">
      ${talStar('What is '+a.n.split(' ')[0]+' like to be interviewed by?')}
      <button class="btn btn-p btn-sm noic" data-go="agent:${key}">Book</button>
    </span>
  </div>`;
}

const agentsTable = () => `
  <div class="agt">
    <div class="agt-h" aria-hidden="true">
      <span class="agt-c">Agent</span>
      <span class="agt-c">Expertise</span>
      <span class="agt-c">Experience</span>
      <span class="agt-c">Rate</span>
      <span class="agt-c"></span>
    </div>
    ${AG_ORDER.map(k=>agentRow(k)).join('')}
  </div>`;

function agentCardOf(a, key){
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
function agentCard(key){ return agentCardOf(AGENTS[key], key); }
function mem(name,ini,meta,you,img){
  return `<div class="mem">
    <span class="mem-av mem-ph">${avatar({i:ini, img:AV[img||'priya']}, 36)}</span>
    <span class="mem-b"><span class="mem-n">${name}</span>${meta?`<span class="mem-m">${meta}</span>`:''}</span>
    ${you?'<span class="tag tag-you sm">You</span>':''}
  </div>`;
}
function clip(title,note,stamp,len,kept){
  return `<div class="clip">
    <span class="thumb">${I.play}<span class="t">${len}</span></span>
    <span class="cb"><span class="ct">${title}</span><span class="cq">${note} · from ${stamp}</span></span>
    <label class="cbx clip-pick" style="padding:0;margin-top:2px"><input type="checkbox" ${kept?'checked':''}><span class="box">${I.check}</span></label>
  </div>`;
}

const SCENES = {
  level: [
    ['The reorganization call',      'Where you changed your mind',                 '02:14', '1:48'],
    ['Handing over the vendor review','You explain why you took it back',           '11:02', '2:10'],
    ['The Friday rhythm',            'How your weekly meeting actually runs',       '19:37', '1:22'],
    ['Managing up',                  'When a decision comes down',                  '24:50', '2:41'],
    ['Conflict with a peer',         'Strong opening, thin resolution',             '31:15', '1:56'],
    ['Closing reflection',           'Summary of your own gaps',                    '41:03', '1:11']
  ],
  re: [
    ['Finishing the reorganization', 'The same story, 90 days later',               '03:40', '2:22'],
    ['The handover that held',       'Sam took it and it landed',                   '09:18', '1:51'],
    ['A hard conversation',          'Where you said the difficult part first',     '16:05', '2:04'],
    ['Running the Thursday call',    'You led the group through it',                '22:31', '1:39'],
    ['What you would do again',      'Answer is specific and dated',                '29:47', '1:28'],
    ['Where you are still short',    'Named it before Priya did',                   '38:12', '1:33']
  ]
};

const SCENES_PRICE = '$29';

const sceneKeep = (kind) => (S.scenes && S.scenes[kind]) || null;
const scenePicked = (kind) => (S.scPick && S.scPick[kind]) || [];
const sceneDone = (kind) => { const k = sceneKeep(kind); return !!k && k.length >= 3; };

const STILL_Y = ['14%','24%','34%','19%','29%','39%'];
function sceneCard(kind, i, n){
  const s = SCENES[kind][i];
  return `<button class="scene" data-scene-play="${kind}:${i}" aria-label="Play ${s[0]}, ${s[3]}">
    <span class="scene-still" style="background-image:url('${AV.hana}');--still-y:${STILL_Y[i%6]}">
      <span class="scene-play">${I.play}</span>
      <span class="scene-len">${s[3]}</span>
    </span>
    ${''/* THE CARD IS ITS TITLE AND NOTHING ELSE (Maryam, 2 Sep 2026: "remove
          the Scene 1 · from 02:14 and Where you changed your mind after
          listening texts, just the headings are fine").

          BOTH DELETED LINES WERE ALREADY DRAWN SOMEWHERE ON THE CARD. The
          eyebrow's timestamp is the one fact the still cannot show, and the
          duration chip in the corner is the figure a reader of a video actually
          wants; "Scene 1" is the card's position in a row of three, which the
          row states by being a row. The `.scene-q` line described the clip in
          the same register as the title above it, so the pair read as a heading
          and its own restatement.

          `n` STAYS A PARAMETER AND `s[1]` / `s[2]` STAY IN THE RECORD. The
          number is still what `aria-label` would want if this ever grows one
          beyond the title, and both strings have a second reader in the scene
          chooser (§38), where the description is what you choose BY. Deleting
          them from `SCENES` would break that page. */}
    <span class="scene-b">
      <span class="scene-t">${s[0]}</span>
    </span>
  </button>`;
}

function sceneRow(kind){
  const keep = sceneKeep(kind) || [0,1,2];
  return `<div class="scene-row">${keep.map((i,n)=>`<div class="scene-cell">${sceneCard(kind,i,n+1)}${shareControl('rep:'+kind+':'+i)}</div>`).join('')}</div>`;
}

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
        ${''/* ONE LINE, NOT THREE — Maryam, 1 Sep 2026 ("remove the 'From
              {time}' below each scene"), then, the same afternoon, "remove the
              'Why this scene?' from each scene, instead after the scenes row
              add only one."

              THE PER-CARD ASK SHIPPED FOR ONE BUILD AND THE CORRECTION IS THE
              INTERESTING PART. Six cards each carrying "Why this scene?" made
              the question the most repeated string in the section — six orange
              phrases against six black titles, so the accent stopped marking
              anything and the strip read as six controls rather than six
              pictures. The question is also the same question six times: it is
              about the CUT, not about any one of them. `.scene-ask` under the
              grid asks it once and reads as the section's own line.

              IT ALSO GETS TO BE A REAL `<button>` DOWN THERE, which the
              per-card version could not: the card is a button and a button
              inside a button is interactive content nested in interactive
              content — the objection `.scene-box` records for the checkbox two
              elements above. That version was a `<span>` with `data-tal-ask`,
              which worked on a press and was unreachable on a keyboard.

              THE TIMECODE WAS THE ONE FACT ON THE CARD YOU CANNOT USE. "From
              02:14" is an offset into a recording this product does not let
              you scrub — the six are the only cuts there are, and the card
              already prints its own length in the still's corner. It stays on
              `sceneCard`, the kept-scenes row on `V.report`, because there it
              is written "Scene 1 · from 02:14" and the SCENE NUMBER is what
              names one of the three you chose.

              AND THE DESCRIPTION ANSWERED A QUESTION AT THE WRONG MOMENT.
              "Where you changed your mind" is the reading of a
              scene, printed on the card while you are deciding whether to keep
              it — so the strip was six titles and six readings, and the reading
              is longer than the title. The line is now the question itself, and
              pressing it puts it to Tal, who has the scene's own sentence to
              answer with (`SCENES` is one record and `talScene` in ai8 reads
              it). Nothing is lost; it moved behind a press.

              IT IS A `<span>` WITH `data-tal-ask`, NOT A `<button>`, and that
              is forced rather than chosen: the card IS a button, and a button
              inside a button is interactive content nested in interactive
              content — the exact objection `.scene-box` two elements above
              records for the checkbox. The click listener tests
              `[data-tal-ask]` as its first real branch and `[data-scene]` ~290
              lines later, so the ask wins the press and returns before the
              selection handler sees it. What a span cannot do is take focus,
              so on a keyboard the card still selects and the question is not
              reachable — the honest trade for keeping the card a real button.

              AND THE DESCRIPTION IS NOT LOST, IT MOVED BEHIND THE PRESS.
              `SCENES` holds `[title, why, from, length]` and `why` is the line
              the card used to print; `wScenes` (ai8) reads all six out of that
              same record, so the copy has one home and Tal's answer cannot
              disagree with the strip. */}
        <span class="scene-b">
          <span class="scene-t">${s[0]}</span>
        </span>
      </button>`;
    }).join('')}
  </div>
  ${''/* THE SECTION'S ONE ASK, UNDER THE GRID (Maryam, 1 Sep 2026, with the
        wording and the mark both specified: "'Ask Tal why these scenes were
        chosen from your interview?' this text should be in orange color, the
        star I am asking you to use is the one we are using with the summary on
        each page").

        THE MARK IS `.aih-mk`, WHICH IS THAT STAR AND IS ALREADY A CLASS. §70.2a
        draws the head band's "Summary by Tal" sparkle as `.ai-label::before` —
        `--ai-star` masked over `--ai-grad` at 12px — and §73.147 lifted exactly
        that into `.aih-mk` so `aiHead` could wear it. Reusing the class is what
        makes this the same object rather than a copy of one: if the ramp or the
        glyph changes, all three follow.

        AND IT MUST BE `.aih-mk`, NOT `.ai-label` OR `.ai-aura`. `talFirst`
        (this file) hoists any `.sec` containing an `.ai-aura` to directly under
        the `.ph`, and `placeBand`'s `_mhIsTal` (ai5) claims a section holding
        EITHER class as head furniture — §70 and §72 both record the bug that
        follows, a section rendering at 576px instead of 901 with nothing thrown
        and nothing warned. This line sits in the page's second section and has
        to stay there.

        IT IS THE PAGE'S SECOND STAR AND THAT IS A DEPARTURE, STATED RATHER THAN
        SMUGGLED. §73's rule is one star per page region, because a mark that
        says "Tal is speaking" stops attributing when it is repeated. The band
        above carries "Summary by Tal"; this is the second. The reason it is
        acceptable is that the two are doing different jobs — that one labels
        Tal's own sentence, this one labels a question you are about to ASK Tal
        — and the reason it is worth watching is that a third would make the
        sparkle this page's bullet style. Six of them did exactly that, which is
        why the per-card version came off. */}
  <button class="scene-ask" data-tal-ask="Why were these scenes chosen from my interview?"><i class="aih-mk"></i>Ask Tal why these scenes were chosen from your interview?</button>`;
}

function sceneSave(kind){
  const n = scenePicked(kind).length;
  return `<button class="btn btn-p btn-sm" data-scenesave="${kind}"
    ${n === 3 ? '' : 'disabled'}>Save Scenes ${I.arrowRight}</button>`;
}
function chRow(i,f){
  const n=i+1, name=CH[i][0], mins=CH[i][1];
  let state='', meta='';
  if(i < f.done){ state='done'; meta=`${mins} min · ${SCORE[i]}% assessment`; }
  else if(i === f.open && f.enrolled){ state='open'; meta = isDay34(S.stage)&&i===3 ? '12 of 70 min · 4 opens' : `Started · ${mins} min`; }
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
    ${''/* THE NUMBER BLOCK IS REMOVED (Maryam, 3 Sep 2026: "remove the left
           side count blocks from all chapters rows"). It was
           `<span class="ch-num">01</span>` — §03.139's 32px tile with the
           ordinal in tabular figures — at the head of every chapter row on
           Course Progress and in the coursework list.

           THE ORDINAL IS NOW CARRIED BY POSITION ALONE, which is worth saying
           out loud because it is the one thing the block did that nothing else
           on the row does: the list is always in chapter order, `n` is still
           computed and still `i + 1`, but no row prints it. If it should come
           back as a word rather than a tile, the meta line is where it goes
           ("Chapter 1 · 45 min · 75% assessment"), which is the shape
           §110's outline row already uses.

           NOTHING ELSE ON THE ROW DEPENDED ON IT, and that was checked rather
           than assumed. The state a reader has to see is carried four ways
           over: §10.1180 draws a 2px accent bar down the open row's left edge,
           bolds its title, lifts its meta to primary ink and appends
           "Continue →"; `.ch-tick` sits inline after a finished chapter's name
           and "Restart" closes its row; and a locked row keeps §03.145's
           `opacity:.55` and the padlock in the trailing slot. The tile was the
           fifth carrier of the first of those and the only carrier of nothing.

           `.ch-num`'s ~30 RULES ACROSS 12 LAYERS ARE KEPT, AND THAT IS NOT THE
           usual "deleted, not hidden" exception being waved. The class has a
           SECOND LIVE WRITER: `tn-agent-portal.html` draws
           `<span class="ch-num">${'${n + 1}'}</span>` in its own application
           steps and its note names §03.139 as the component it is using. So
           the rules are a shipped part of `talentnext-ds.css` that another
           portal renders today — deleting them would break a live surface,
           which is the opposite of the tidy. Half of them are also shared
           selector lists with `.cardrow-ic`, `.nrow-ic`, `.aw-ic` and
           `.ch-ic`, where removing one word is a change to four components. */}
    <span class="ch-b"><span class="ch-n">${name}${state==='done'?`<span class="ch-tick">${I.checkFilled}</span>`:''}</span>
      <span class="ch-m">${meta}${flag?`<span class="sep">·</span><span class="ai-inline"><span class="sk"></span>${flag}</span>`:''}</span></span>
    ${trail}
  </button>`;
}

;

const twIc = (name, tone) => `<span class="tw-ic${tone ? ' ' + tone : ''}">${I[name] || ''}</span>`;

const tw = (title,body,action) => `<span class="tw">
  ${title?`<span class="tw-h">${title}</span>`:''}${body}
  ${action?`<span class="tw-a">${action}</span>`:''}</span>`;
const twBtn = (label,go) => `<button class="tw-btn"${go?` data-go="${go}"`:''}>${label}${I.arrowRight}</button>`;
const twChips = (qs) => `<span class="tw-chips">${qs.map(q=>`<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>${q}</button>`).join('')}</span>`;

function wChapter(i){
  const g = GAME[S.stage];
  const done = g && i < g.done, inprog = isDay34(S.stage) && i===3;
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
  const cur = f.pred ? null : f.level;
  const RUNGS = ['E1','E2','E3','E4','E5'];
  const ci = cur ? RUNGS.indexOf(cur) : -1;
  return tw(twIc('growth') + 'The Explorer track',
    `<span class="tw-rungs">${RUNGS.map((r,idx)=>`<i class="${r===cur?'on':(ci>=0&&idx<ci?'done':'')}">${r}</i>`).join('')}</span>
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
    twBtn('Open Achievements','rewards'));
}
function wPrep(){
  return tw(twIc('checkOutline') + 'A 10-minute run-through',
    `<span class="tw-check">
      <span>One story where you handed work over and it went wrong</span>
      <span>What you would do differently, in one sentence</span>
      <span>One decision you changed after listening to someone</span>
     </span>`);
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
  const lead = isLead() && typeof LEAD_TAL !== 'undefined' ? LEAD_TAL : null;
  const ctx = (lead ? (lead.ctx[S.view] || lead.ctx.leadDash) : (TALCTX[S.view] || TALCTX.dashboard));
  const where = (lead ? lead.where[S.view] : ({dashboard:'Dashboard',level:'My Level',report:'Your report',interviews:'Interviews',
    agents:'Choosing an agent',agent:'Agent profile',booking:'Interview booked',enrol:'Enrolling',
    payment:'Payment',welcome:'Enrolled',coursework:'Coursework',chapter:'Chapter '+((S.ch??3)+1),transcript:'Course Progress',rewards:'Achievements',
    cohort:'Cohort 41',billing:'Payments',account:'Profile',messages:'Messages'})[S.view]) || 'TalentNext';
  const state = lead ? lead.state()
    : f.complete ? lvlName(f.level)+', cohort complete'
    : f.enrolled ? lvlName(f.level)+', day '+f.day+' of 90'
    : f.pred ? f.track+' track, level not set yet'
    : lvlName(f.level)+' confirmed, not enrolled';

  const opener = S.view==='chapter' && S.ch===3
    ? `You are 12 minutes into chapter 4. Want the short version before you go back in?`
    : `You are on <b>${where.toLowerCase()}</b>, ${state.toLowerCase()}. Ask me anything, or start with one of these.`;
  const bubble = (who,html,live) => who==='me'
    ? `<div class="tal-msg me"><span class="tal-who"><span class="tal-who-n">You</span><span class="av"><img src="${isLead()?AV.priya:AV.hana}" alt=""><i>${isLead()?'PN':'MN'}</i></span></span><div class="bb">${html}</div></div>`
    : `<div class="tal-msg"><span class="tal-who">${borbMark('tal-mk sm', live)}<span class="tal-who-n">Tal</span></span><div class="bb">${html}</div></div>`;
  const hero = `<div class="tal-hero">
      ${borbMark('tal-mk lg', true)}
      <h2>Hello <b>${isLead()?'Priya':'Maryam'}</b>, I am Tal &#128075;</h2>
      <p>${isLead()?'I can read your cohorts, your evaluations and where people are stuck. What do you need?':'I am here to assist you with anything you need help with. What&rsquo;s going on?'}</p>
    </div>`;
  const thread = (S.thread.length ? '' : hero)
    + S.thread.map(m=>bubble(m.who,m.html)).join('')
    + (S.typing?bubble('tal',`<div class="ai-stream"><i></i><i></i><i></i></div>`,true):'');

  return `<div class="tal-panel ${S.tal?'on':''}" id="talPanel">
    <div class="tal-h">
      ${borbMark('tal-mk')}
      <span class="nm"><b>Tal</b></span>
      <button class="shell-act tal-x" data-toggle="tal" aria-label="Close Tal" style="color:var(--icon-primary)">${I.close}</button>
    </div>
    <div class="tal-body" id="talBody">${thread}</div>
    ${''/* THE DAILY-LIMIT STATE (story 15.5), same as the ask-page: at the limit
           the chips give way to the limit line and the composer is disabled. The
           `ask()` guard is the real enforcement; this is the visible half. */}
    ${talAtLimit()
      ? `<div class="tal-limit">You have asked Tal everything it can take today. Come back tomorrow.</div>`
      : (S.thread.length?'':`<div class="tal-sugg">${ctx.map(s=>`<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>${s}</button>`).join('')}</div>`)}

    <div class="composer${talAtLimit()?' composer-off':''}">
      ${AI_RUN}
      ${borbMark('tal-mk sm composer-mk')}
      <input class="inp ai-field" placeholder="Ask Tal anything" aria-label="Ask Tal"${talAtLimit()?' disabled':''}>
      <button aria-label="Send"${talAtLimit()?' disabled':''}>${I.send}</button>
    </div>
  </div>`;
}

const AI_RUN = `<span class="ai-run" aria-hidden="true">
    <svg preserveAspectRatio="none">
      <defs>
        ${''/* THE COMET'S FIVE STOPS — Maryam, 9 Sep 2026, off Figma 875:6598,
              given as the exact CSS to follow:
              `linear-gradient(90.13deg, rgba(255,255,255,0.7) 0%,
              rgba(213,81,215,0.7) 22.6%, rgba(255,110,36,0.7) 49.04%,
              rgba(255,55,51,0.7) 75%, rgba(255,255,255,0.7) 100%)`.

              WHITE INTO MAGENTA, ORANGE, RED AND BACK TO WHITE. The offsets are
              unchanged from the 4 Sep set (0 / .226 / .4904 / .75 / 1); the
              THREE middle colours are new — #d551d7 (magenta), #ff6e24 (orange)
              and #ff3733 (red), where the ramp had been red / pale-green / red.
              So the light is no longer symmetric: it warms across rather than
              mirroring, which is the node's own gradient.

              90.13deg IS HORIZONTAL, so the SVG gradient is `x2=1 y2=0` now,
              not the corner-to-corner `y2=1` §70.3a's note argued for. On a wide,
              short field the ramp lives on the top and bottom edges and the white
              ends fall on the short sides — which is where the file draws them —
              so the comet fades through the corners rather than at mid-edge.

              THE .7 IS `stop-opacity`, NOT A COLOUR. SVG has no `rgba()` in
              `stop-color`, and baking the alpha into the hex would need it
              composited against whatever is behind — the dock's own border, not
              white. Stated as the attribute the stop is genuinely 70% and the
              border shows through it, which is what the spec's `rgba` means on a
              `filter:blur(1px)` line lying over a coloured edge. The white ends
              at 70% are what make the dash fade in and out of its travel; §70.1's
              note has the long version, including why the loop has no seam. */}
        ${''/* THE MAGENTA STOP IS DROPPED (Maryam, 9 Sep 2026): the comet is now
              white → orange → red → white, four stops, off the updated node —
              `linear-gradient(90.13deg, rgba(255,255,255,.7) 0%,
              rgba(255,110,36,.7) 49.04%, rgba(255,55,51,.7) 75%,
              rgba(255,255,255,.7) 100%)`. The offsets that remain are unchanged
              (0 / .4904 / .75 / 1); only #d551d7 at .226 came out, so the light
              warms straight from white into orange with no purple lead-in. */}
        <linearGradient id="aiRunGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".7"/>
          <stop offset="0.4904" stop-color="#ff6e24" stop-opacity=".7"/>
          <stop offset="0.75" stop-color="#ff3733" stop-opacity=".7"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity=".7"/>
        </linearGradient>
      </defs>
      <rect pathLength="1000"/>
    </svg>
  </span>`;

const askChip = (q,label) => `<button class="chip-tal" data-tal-ask="${q}"><span class="sk-mark xs"></span>${label||'Ask Tal'}</button>`;
const talFab = () => `<button class="tal-fab" data-toggle="tal" aria-label="Ask Tal"><svg viewBox="0 0 559 559" aria-hidden="true"><path d="M104.015 128.327H166.308L299.699 279.673L75.2133 533.824H14.0996L238.586 279.673L104.015 128.327Z"/><path d="M350.022 197.67L422.299 279.673L197.813 533.824H136.699L361.185 279.673L288.275 197.67H350.022Z"/><path d="M362.423 418.329H424.716L544.872 280.191L321.278 25.2051H260.164L483.758 280.191L362.423 418.329Z"/></svg><span class="tal-fab-t">Tal</span></button>`;

;


;
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

;
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
const gcard = (kind,tag,title,sub,go,art,at) => `<button class="tile clk gcard" data-go="${go}"${at ? ' ' + at : ''}>
  ${''/* NO LEFT ICON WHEN THERE IS NO COVER (Maryam, 9 Sep 2026: "remove the left
         side cohort icons"). The fallback used to draw a `.cardrow-ic` mark
         (`GC_IC[kind]`, the cohort's `group` glyph) when no `art` was passed;
         the cohort rows pass `null` art, so that mark was the icon on every row.
         Only the real cover (`art.src`, when a caller gives one) draws now; with
         no cover the row is the text and the arrow. `kind`/`GC_IC` stay for a
         caller that passes a cover. */}
  ${art
    ? `<span class="gcard-art">${art.i ? `<i>${art.i}</i>` : ''}<img src="${art.src}" alt="" loading="lazy" onerror="this.style.display='none'"></span>`
    : ''}
  <span class="gcard-b">
    ${tag?`<span class="eyebrow">${tag}</span>`:''}
    <h3>${title}</h3><span class="sub">${sub}</span>
  </span>
  <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
</button>`;

const pict = (k,cls) => `<span class="pict ${cls||''}">${PG[k]}</span>`;


;
const bmk = (b,cls) => `<span class="bmk ${cls||''}" aria-hidden="true">${BMK[b]||BMK.card}</span>`;
const brandOf = n => { n=(n||'').replace(/\D/g,'');
  if(/^4/.test(n)) return 'Visa';
  if(/^3[47]/.test(n)) return 'Amex';
  if(/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if(/^6(011|5|4[4-9])/.test(n)) return 'Discover';
  return null; };

;
;
;
;

;

function youMark(){
  const g = GAME[S.stage];
  return `<span class="ph-you-av">
    <span class="av-ph"><i>MN</i><img src="${AV.hana}" alt="" loading="lazy" onerror="this.style.display='none'"></span>
    ${g ? `<span class="ph-rank"><img src="${AWARD['rank'+g.rank]}" alt="${RANKS[g.rank-1].n} rank"></span>` : ''}
  </span>`;
}

function achLine(){
  const a = ACH[S.stage];
  if(!a || !a.up) return '';
  const cut = a.up.lastIndexOf(' ');
  const head = cut > -1 ? a.up.slice(0, cut) : '';
  const tail = cut > -1 ? a.up.slice(cut + 1) : a.up;
  return `<a class="ph-earned" data-go="${a.go}">
    <span class="ph-earned-mk">${a.art
      ? `<img src="${AWARD[a.art]}" alt="">`
      : I[a.ic]}</span>
    <span>${head} <span class="ph-earned-u">${tail}</span></span></a>`;
}

const dashPh = (title, sub) =>
  ph(title, sub, achLine(), null, youMark());

const discOpen = (key) => !!S.disc[key || 'report'];
const foundHead = (title, key) => `<div class="sec-h found-h">
    <button class="found-t" data-found="${key||'report'}" aria-expanded="${discOpen(key)?'true':'false'}">
      <span class="found-chev">${I.chevRight}</span><h2>${title}</h2></button>
  </div>`;

const CERTS = [
  {lvl:'E2', on:'May 4, 2026',       cohort:'Cohort 12', by:'Daniel Kerr'},
  {lvl:'E3', on:'November 21, 2026', cohort:'Cohort 41', by:'Priya Nair'}
];
const certsFor = f => f.complete ? CERTS : CERTS.slice(0, 1);

const BRONZE_ON = '11/06/2026';
const CERTIFS = [
  {k:'course', n:'Course Complete',  gate:() => true,
    on:(f)     => certsFor(f).slice(-1)[0].on},
  {k:'assess', n:'Assessment Ace',   gate:(f)   => f.avg >= 80,
    on:()      => 'November 18, 2026'},
  {k:'pace',   n:'Fast Tracker',     gate:(f,g) => (g.weeks||[]).filter(w => w >= WEEK_TARGET).length >= 8,
    on:()      => 'October 30, 2026'},
  {k:'cohort', n:'Cohort Champion',  gate:(f,g) => [4,5,6].every(i => g.got.includes(i)),
    on:(f,g)   => longDate(g.last[6])},
  {k:'top',    n:'Top Performer',    gate:(f,g) => g.pts >= BDG[0].need,
    on:()      => longDate(BRONZE_ON)}
];

const MONTHS = ['January','February','March','April','May','June','July',
  'August','September','October','November','December'];
const longDate = s => {
  const [m,d,y] = String(s||'').split('/');
  return MONTHS[+m-1] ? `${MONTHS[+m-1]} ${+d}, ${y}` : s;
};

const certAll = (f, g) => [
  ...certsFor(f).map(c => ({k:'explorer', n:`Explorer Track &ndash; ${c.lvl}`, on:c.on})),
  ...CERTIFS.filter(c => c.gate(f, g)).map(c => ({k:c.k, n:c.n, on:c.on(f, g)}))
].sort((a, b) => new Date(b.on) - new Date(a.on));



function certHero(c, {title = 'Congratulations on your most recent certification &#127881;'} = {}){
  const name = courseOf(c.lvl) || c.n;
  return `<div class="sec dark-card crt-dark">
    <div class="dc-hd"><div class="dc-hd-r">
      <h2 class="dc-t">${title}</h2>
    </div></div>
    <div class="crt-hero">
      <span class="crt-art"><img src="${CERT_ART[c.k]}" alt=""></span>
      <span class="crt-hero-b">
        <span class="crt-hero-n">${name}</span>
        <span class="crt-hero-i">TALENTnext</span>
      </span>
      ${''/* ON THE CARD THE PAIR LOSES ITS TWO HUES AND TAKES THE CARD'S.
            §63 §26's blue and violet were picked against `--layer-01` and read
            2.3:1 and 2.6:1 on `--gray-100`; §75's recipe already answers what a
            button does here — `.btn-p` is the accent fill, a quiet button is
            borderless white — so the classes simply do not come along.

            DOWNLOAD IS THE PRIMARY (Maryam, 2 Sep 2026: "the download button
            should be orange and share link should be without bg"), which
            reverses what shipped first. That version followed the reference,
            where Share is the card's whole point; this product's certificate
            is a thing you TAKE — the tab's own second control has always been
            Download and `V.transcript` is where it goes — and a share link is
            something you generate afterwards. The order swaps with the fill,
            because the accent button leads a pair. */}
      ${''/* SHARE OPENS A MENU OF THE LINKED ACCOUNTS (Maryam, 11 Sep 2026:
            "Share" with a share glyph, not "Share link" with a chain; on click,
            a dropdown of the candidate's connected networks to post the
            certificate to). It reads the SAME `S.linked` the profile's Linked
            Accounts tab writes, so the two cannot disagree about what is
            connected. A prototype, so picking a network is the whole flow — it
            closes the menu (§121's rule: a control that would reach a real
            service does not, here). The menu is a pure function of `S.certShare`
            (trap 9) and the dark card does not clip, so it opens downward. */}
      <span class="crt-hero-a">
        <button class="btn btn-p btn-sm ic-l" data-go="transcript">${I.download} Download</button>
        <span class="crt-share-wrap">
          <button class="btn btn-sm ic-l" data-certshare aria-haspopup="true" aria-expanded="${!!S.certShare}">${I.share} Share</button>
          ${S.certShare ? `<div class="crt-share-menu">
            ${(() => {
              const linked = SOCIAL.filter(s => S.linked[s.k]);
              return linked.length
                ? linked.map(s => `<button class="crt-share-i" data-shareto="${s.k}" style="--brand:${s.color}"><span class="crt-share-ic">${s.svg}</span><span class="t-body">Share on ${s.n}</span></button>`).join('')
                : `<div class="crt-share-empty t-desc">No linked accounts yet. Connect one on the Linked Accounts tab of your profile.</div>`;
            })()}
          </div>` : ''}
        </span>
      </span>
    </div>
  </div>`;
}
function certGrid(list){
  return list.map((c, i) => `<div class="crt-card${S.crtMenu === i ? ' on' : ''}">
    <button class="crt-menu" data-crtmenu="${i}" aria-haspopup="true"
      aria-expanded="${S.crtMenu === i}" aria-label="Actions for ${c.n}">${I.overflow}</button>
    ${S.crtMenu === i ? `<div class="crt-pop">
      <button class="crt-pop-i" data-go="transcript">${I.download} Download</button>
      <button class="crt-pop-i">${I.share} Share</button>
    </div>` : ''}
    <span class="crt-art"><img src="${CERT_ART[c.k]}" alt=""></span>
    <span class="crt-n">${courseOf(c.lvl) || c.n}</span>
    <span class="crt-i">TALENTnext</span>
    <span class="crt-on">Issued ${c.on}</span>
  </div>`).join('');
}

const courseCerts = (f) =>
  certsFor(f).map(c => ({k:'explorer', lvl:c.lvl, n:`Explorer Track &ndash; ${c.lvl}`, on:c.on}))
    .sort((a, b) => new Date(b.on) - new Date(a.on));

function certEarn(f){
  const name = f.level ? `the Explorer Track &ndash; ${f.level} certificate`
                       : 'your Explorer Track certificate';
  return `<div class="sec"><div class="crt-earn">
    <span class="crt-earn-ic"><img src="${CERT_ART.course}" alt=""></span>
    <div class="crt-earn-b">
      <div class="t-h3">Earn a course certificate</div>
      <p class="t-desc crt-earn-d">Complete the course to earn ${name}. You can add it to your LinkedIn profile, resume, or CV, and share it.</p>
    </div>
  </div></div>`;
}
function certsTab(f, g){
  if(!f.complete) return certEarn(f);
  const all = courseCerts(f);
  return certHero(all[0]) + `<div class="sec">
    <div class="sec-h"><h2>All certifications</h2></div>
    <div class="crt-grid">${certGrid(all)}</div>
  </div>`;
}

const banClosed = (key) => !!S.certBan[key || 'cert'];

function certBanner(f, {close = false, key = 'cert'} = {}){
  if(close && banClosed(key)) return '';
  const c = certsFor(f).slice(-1)[0];
  return `<div class="sec">
    <div class="certban">
      ${''/* THE MARK IS THE CERTIFICATION BADGE, NOT A GLYPH OF ONE (Maryam,
             2 Sep 2026: "in these banners, use the badges we are using on the
             achievements page, not these badge icons").

             IT IS THE SAME PICTURE THE SAME ROW DRAWS ONE CLICK AWAY.
             `CERT_ART.explorer` is what the Achievements module's Certificates
             tab puts against this certificate — `certAll` stamps `k:'explorer'`
             on every `CERTS` row, so the hero, the grid card and this banner
             are three sizes of one asset and cannot disagree about which award
             they are announcing. `I.certificate` was a picture of the CATEGORY,
             which is `ACH`'s own argument for the award WebPs ("a generic glyph
             of a shield is a picture of the category instead").

             IT IS NOT `AWARD`, and the distinction is worth stating because the
             ask says "the badges on the achievements page" and that page draws
             two sets: `AWARD`'s medals on the Badges and Rank tabs, and
             `CERT_ART`'s badges on Certificates. This banner is a certificate,
             so it takes the certificate's. */}
      <span class="certban-mk"><img src="${CERT_ART.explorer}" alt=""></span>
      <span class="certban-b">
        <span class="certban-t">Explorer Track &ndash; ${c.lvl}</span>
        <span class="certban-m">Completed ${c.on} &middot; ${c.cohort}</span>
      </span>
      <span class="certban-a">
        <button class="btn btn-p btn-sm noic" data-go="transcript">View</button>
      </span>
      ${''/* THE CROSS IS ITS OWN CHILD, OUTSIDE `.certban-a`, so the action
             group's `margin-left:auto` still pins the pair to the right and the
             close sits past it at the true end of the row. Inside the group the
             two would share one auto margin — §77's `.dc-act` / `.dc-when`
             problem, one component along. `aria-label` because the button's
             only content is a glyph. */}
      ${close?`<button class="certban-x" data-certban="${key}" aria-label="Dismiss">${I.close}</button>`:''}
    </div>
  </div>`;
}

S.reviews = S.reviews || {};
const REV_MAX = 500;
function reviewCard({key, title, sub, capsule}){
  const r = S.reviews[key] || {};
  if(r.later || r.done) return '';
  const wrap = capsule ? 'rev-float' : 'sec';
  const anim = S.revMorph ? ' rev-anim' : '';
  if(capsule && !r.sent && !r.open) return `<div class="${wrap}"><button type="button" class="rev-cap${anim}" data-revopen="${key}">
    <span class="rev-cap-ic">${I.chat}</span><span class="rev-cap-t t-body">${capsule}</span>
  </button></div>`;
  if(r.sent) return `<div class="${wrap}"><div class="review review-done">
    <div class="rev-head">
      <span class="rev-ic rev-ic-ok">${I.checkFilled}</span>
      <h2>Thanks for your review</h2>
    </div>
    <p class="rev-sub t-desc">${r.stars ? `You rated ${r.stars} out of 5. ` : ''}Your feedback helps us keep raising the bar.</p>
  </div></div>`;
  const stars = r.stars || 0;
  const text = (r.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<div class="${wrap}"><div class="review${anim}">
    ${capsule ? `<button type="button" class="rev-x" data-revclose="${key}" aria-label="Close">${I.close}</button>` : ''}
    <div class="rev-head">
      <span class="rev-ic">${I.chat}</span>
      <h2>${title}</h2>
    </div>
    ${sub ? `<p class="rev-sub t-desc">${sub}</p>` : ''}
    <div class="rev-rate">
      <div class="rev-stars" role="radiogroup" aria-label="Rate your experience">
        ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="rev-star${n <= stars ? ' on' : ''}" data-rate="${key}:${n}" aria-label="${n} star${n > 1 ? 's' : ''}" aria-pressed="${n <= stars}">${n <= stars ? I.star : I.starOutline}</button>`).join('')}
      </div>
    </div>
    <div class="rev-note">
      <textarea id="revta-${key}" class="inp rev-ta" data-revta="${key}" maxlength="${REV_MAX}" aria-label="Your review" placeholder="Share a few words about your experience (optional)">${text}</textarea>
    </div>
    <div class="rev-acts">
      <button class="btn btn-p noic" data-review-submit="${key}"${stars ? '' : ' disabled'}>Submit review</button>
      <button class="btn btn-t noic" data-review-later="${key}">Maybe later</button>
    </div>
  </div></div>`;
}

function progressStrip(f){
  const pct = Math.round(f.done/13*100);
  const tasks = S.stage==='week1'?'0 of 3':isDay34(S.stage)?'1 of 3':'3 of 3';
  const hrs = Math.floor(f.mins/60)+'h '+(f.mins%60)+'m';
  return `<div class="prog">
    <div class="prog-top">
      <div><div class="prog-pct">${pct}<small>%</small></div><div class="prog-l">of the course done</div></div>
      <div class="prog-day"><div class="prog-dn">Day ${f.day}</div><div class="prog-l">of 90</div></div>
    </div>
    <div class="prog-seg">${CH.map((c,i)=>
      `<i class="${i<f.done?'done':(i===f.open?'now':'')}" title="Chapter ${i+1}"></i>`).join('')}</div>
    ${''/* EACH FIGURE GETS ITS SUBJECT'S MARK, AND THE MARKS ARE THE `.stat`
          CELL'S — a 28px tinted chip with a 16px glyph in `--mk`, the same
          component §29.17 draws for the four-cell figure grid. Three cells
          with nothing but numbers in them read as one block of digits; the
          mark is what lets you find "how long have I spent" without reading
          all three labels.

          The icons are chosen to say the SUBJECT, not the state: `book` is
          chapters, `checkFilled` is tasks and `time` is minutes. And the
          hues are §29's first three in §29's order, so a chapter is blue
          here and blue in every `.stats` grid on the other pages — the cycle
          is positional there and named here, which is the only way the two
          can agree when this strip has three cells and that grid has four.
          §65 states them. */}
    ${''/* THE MARK IS A COLUMN, NOT A ROW ABOVE THE FIGURE. `.stat` puts its
          chip to the LEFT of the label and the figure and every other card in
          the product follows it, so a mark stacked on top read as a different
          component that happened to share a colour. That needs the figure and
          its label wrapped — `.prog-fb` — because the cell is now two columns
          and the label was a bare text node, which cannot be given a column
          of its own. */}
    <div class="prog-figs">
      <span><i class="prog-ic">${I.book}</i><span class="prog-fb"><b>${f.done} of 13</b><span class="prog-lab">chapters</span></span></span>
      <span><i class="prog-ic">${I.checkFilled}</i><span class="prog-fb"><b>${tasks}</b><span class="prog-lab">week ${f.week} tasks</span></span></span>
      <span><i class="prog-ic">${I.time}</i><span class="prog-fb"><b>${hrs}</b><span class="prog-lab">invested</span></span></span>
    </div>
  </div>`;
}

function ring(pct, label, cls){
  const arc = (2 * Math.PI * 26 * Math.min(pct, 100) / 100).toFixed(1);
  return `<div class="ring${cls ? ' ' + cls : ''}" role="img" aria-label="${label || pct + '% done'}">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle class="ring-t" cx="32" cy="32" r="26"></circle>
      <circle class="ring-f" cx="32" cy="32" r="26" style="--arc:${arc}"></circle>
    </svg>
    <span class="ring-n${cls ? '' : ' u-h2'}">${pct}<small>%</small></span>
  </div>`;
}

function aiHead({mark, title, desc, act, extra, under}){
  return `<div class="sec-h aih">
    <div class="aih-b">
      <h2 class="aih-t">${mark ? '<i class="aih-mk"></i>' : ''}${title}${extra || ''}</h2>
      ${desc ? `<p class="aih-d">${desc}</p>` : ''}
      ${under || ''}
    </div>
    ${act ? `<div class="aih-a">${act}</div>` : ''}
  </div>`;
}

function pacePart(f, g){
  const per = 2;
  if(f.finished){
    const total = g.weeks.reduce((a,b)=>a+b, 0);
    const goal  = WEEK_TARGET * g.weeks.length;
    const avg   = Math.round(total / g.weeks.length);
    const pct   = Math.round(total / goal * 100);
    return {
      fig:total.toLocaleString(), unit:'min', sub:`over ${g.weeks.length} weeks, against ${WEEK_TARGET} a week`,
      segs:g.weeks.map(m => m >= WEEK_TARGET ? 'done' : 'now'),
      label:`${goal.toLocaleString()} min over the course`,
      figs:[[total.toLocaleString()+' min','In total'],[avg+' min','A week'],[pct+'%','Of target']]
    };
  }
  const wk   = g.weeks[g.weeks.length-1] || 0;
  const left = Math.max(0, WEEK_TARGET - wk);
  const pct  = Math.round(wk / WEEK_TARGET * 100);
  const n    = Math.round(WEEK_TARGET / per);
  const lit  = Math.min(n, Math.round(wk / per));
  return {
    fig:String(wk), unit:'min', sub:`of the ${WEEK_TARGET} min weekly target`,
    segs:Array.from({length:n}, (_,i) => i < lit ? 'done' : ''),
    label:`${WEEK_TARGET} min target`,
    figs:[[wk+' min','This week'],[left+' min','Remaining'],[pct+'%','Of target']]
  };
}

function pulseCol(mk, ic, label, body, cls){
  return `<div class="pulse-c${cls ? ' ' + cls : ''}" style="--mk:var(--mk-${mk})">
    <div class="pulse-h"><i class="pulse-ic">${ic}</i><span class="pulse-lab">${label}</span></div>
    ${body}
  </div>`;
}

function pulseLede(f, g, p){
  if(f.finished){
    const n = g.weeks.length;
    return `All <b>13 chapters</b> are done: ${p.figs[0][0]} across ${n} weeks, ${p.figs[2][0]} of the ${WEEK_TARGET} min weekly target. Booking the re-interview is the only thing left.`;
  }
  const i = f.open, mins = CH[i][1];
  const did = isDay34(S.stage) ? 12 : 0;
  const wk = g.weeks[g.weeks.length-1] || 0;
  const same = did > 0 && did === wk;
  return `You have completed <b>${did} of ${mins} minutes</b> for <span class="pulse-hl">${CH[i][0]}</span>, ${
    same ? `which is all the time you have spent learning this week`
         : `and have spent <b>${wk} minutes</b> learning overall this week`
  }. Complete chapter ${i+1} to stay on the pace.`;
}

function pulseCols(f, g){
  const p = pacePart(f, g);

  const pace = pulseCol(2, I.time, 'Your pace', `
    <div class="pulse-fig">${p.fig}<small>${p.unit}</small></div>
    <div class="pulse-sub">${p.sub}</div>
    <div class="pulse-bar">
      <span class="pulse-bl">${p.label}</span>
      <span class="pulse-seg" role="img" aria-label="${p.sub}">${
        p.segs.map(s => `<i class="${s}"></i>`).join('')}</span>
    </div>
    <div class="pulse-3">${p.figs.map(([v,l]) =>
      `<span><b>${v}</b><span class="pulse-3l">${l}</span></span>`).join('')}</div>`, 'pulse-wide');

  const stand = pulseCol(3, I.trophy, 'Your standing', standRow(g));

  const act = f.finished
    ? `<button class="btn btn-g btn-sm noic" data-go="rewards">View more</button>`
    : `<button class="btn btn-p btn-sm" data-go="chapter:${f.open}">Open chapter ${f.open+1} ${I.arrowRight}</button>`;

  return `<div class="sec sec-pulse dark-card">
    ${''/* ONE STAR PER PAGE, AND ON THE ENROLLED DASHBOARDS THIS IS IT. The rule
          is Maryam's (31 Aug 2026) — "do not use star with each new section" —
          and it is a rule about a page, not about a component: the mark says a
          block is Tal speaking, and a page that says it three times has stopped
          attributing and started decorating. The band's "Summary by Tal" carries
          its own label, and this is the one section below it that is Tal's
          reading rather than the product's list. `What the 90 days cover` on
          `assessed` is the case that went the other way. */}
    ${''/* THE TWO COLUMNS CAME OFF (Maryam, 1 Sep 2026: "remove the your pace
           and your standing from the black card"). `<div class="pulse">` held
           `pace` and `stand` — the minutes against the weekly target with its
           28-block bar, and the three standing rows.

           NEITHER READING IS LOST AND BOTH ARE ONE PRESS AWAY. Pace is the
           `.stats` strip directly under this card (Time invested, Chapters
           done) and the lede's own "0 of 45 minutes … 20 minutes this week";
           standing is the Achievements module, which draws `standRow` from the
           same `GAME[stage]` record — the note over `pulseCols` always said the
           two could not disagree, and that is why moving the reading costs
           nothing.

           WHAT IS LEFT IS THE HEAD ROW, which is the whole card now: Tal's
           mark, the derived sentence, and the way into the open chapter. That
           is exactly `pulse()`'s shape on the dashboards minus the next call,
           so the two are one component again. */}
    ${aiHead({mark:true, title:'Your learning pulse', desc:pulseLede(f, g, p), act})}
  </div>`;
}

function pulseCard(f, g){
  const p = pacePart(f, g);
  const act = f.finished
    ? `<button class="btn btn-p btn-sm noic" data-go="rewards">View more ${I.arrowRight}</button>`
    : `<button class="btn btn-p btn-sm" data-go="chapter:${f.open}">Open chapter ${f.open+1} ${I.arrowRight}</button>`;
  const c = f.finished ? null : CALL_ROW.cohort();
  return `<div class="sec sec-pulse dark-card">
    ${aiHead({mark:true, title:'Your learning pulse', desc:pulseLede(f, g, p), act})}
    ${c ? `<div class="pnc">
      <h3 class="pnc-t">Your Next Call</h3>
      ${''/* THE PORTRAIT IS A SQUARE SIZED BY THE TEXT BESIDE IT (Maryam, 31 Aug
             2026: "the profile square will be of the height of the right side
             content"), and §75's note on `.rec-l` is why the row is a GRID.
             `width:auto; height:100%; aspect-ratio:1` cannot work in a flex row:
             flex resolves the main size from the flex base size, and a box whose
             only content is a `position:absolute` `<img>` contributes zero, so
             the ratio has nothing to transfer into and the photograph ships at
             18px — silently, on a card that otherwise looks right. §79 states
             the three tracks. */}
      <div class="pnc-row">
        <span class="pnc-ph"><i>${c.who.i}</i><img src="${c.who.img}" alt="" loading="lazy" onerror="this.style.display='none'"></span>
        <div class="pnc-b">
          <p class="pnc-n">${c.who.n}<span class="pnc-v">${I.checkFilled}</span></p>
          <p class="pnc-r">${c.role}</p>
        </div>
        <span class="pnc-when">${I.time}${callIn(c.when)}</span>
      </div>
    </div>` : ''}
  </div>`;
}

function pulseQA(f, g){
  const p = pacePart(f, g);
  const cards = [];
  if(!f.finished) cards.push({
    ic:I.book, hue:'ic-focus', t:'Current focus',
    d:`Chapter ${f.open+1}, ${CH[f.open][1]} minutes.`,
    go:`chapter:${f.open}`});
  cards.push({
    ic:I.time, hue:'ic-pace', t:'Your pace',
    d:`${p.figs[0][0]} ${p.figs[0][1].toLowerCase()}, ${p.figs[2][0].toLowerCase()} of target.`,
    go:'transcript'});
  cards.push({
    ic:I.trophy, hue:'ic-stand', t:'Your standing',
    d:`${g.pts.toLocaleString()} points at ${RANKS[g.rank-1].n}.`,
    go:'rewards'});
  return quickActions(cards);
}

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

const BDG_ART = ['bronze','silver','gold','involved'];

function awardRow({name,desc,val,state,when,pct,art,ph,mk}){
  const neg = val<0;
  const mark = art
    ? `<span class="aw-art"><img src="${AWARD[art]}" alt="" loading="lazy"></span>`
    : ph
    ? `<span class="aw-ph"${mk && state==='got'?` style="--mk:var(${mk})"`:''}>${P[ph]}</span>`
    : `<span class="aw-ic">${state==='got'?I.checkFilled:(neg?I.subtract:I.locked)}</span>`;
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
const PTS_MK = [
  {ph:'flame',          mk:'--support-attention'},
  {ph:'sealCheck',      mk:'--support-attention'},
  {ph:'bookOpenText',   mk:'--mk-1'},
  {ph:'graduationCap',  mk:'--mk-3'},
  {ph:'chatNew',        mk:'--mk-4'},
  {ph:'chatsCircle',    mk:'--mk-4'},
  {ph:'heart',          mk:'--mk-4'},
  {ph:'clockCountdown', mk:'--danger-ink'},
  {ph:'calendarX',      mk:'--danger-ink'}
];
function pointsList(g){
  const got = PTS.map((r,i)=>({r,i})).filter(x=>g.got.includes(x.i));
  const rest = PTS.map((r,i)=>({r,i})).filter(x=>!g.got.includes(x.i));
  return [...got,...rest].map(({r,i})=>awardRow({
    name:r.n, desc:r.d, val:r.v, ...PTS_MK[i],
    state:g.got.includes(i)?'got':'not', when:g.last[i]
  })).join('');
}
function awardCard({name,desc,val,state,when,pct,art}){
  const got = state==='got';
  const p = got ? 100 : Math.max(0, Math.min(100, pct||0));
  return `<div class="aw awc ${state} has-art">
    <span class="aw-art"><img src="${AWARD[art]}" alt=""></span>
    <span class="aw-b">
      <span class="aw-n">${name}</span>
      <span class="aw-d">${desc}</span>
    </span>
    <span class="aw-v awc-v">+${val}</span>
    <span class="awc-m">
      <span class="aw-s">${got?'Awarded '+when:p+'%'}</span>
      <span class="pb-track"><span class="pb-fill" style="width:${p}%"></span></span>
    </span>
  </div>`;
}
function badgeList(g){
  return BDG.map((b,i)=>{
    const got = i < g.badges;
    return awardCard({name:b.n, desc:b.d, val:b.v, state:got?'got':'not', art:BDG_ART[i],
      when:'11/06/2026', pct: got?undefined:(b.need?Math.min(99,Math.round(g.pts/b.need*100)):0)});
  }).join('');
}
function rankList(g){
  return RANKS.map((r,i)=>awardCard({name:r.n, desc:r.d, val:r.v, art:'rank'+(i+1),
    state:i<g.rank?'got':'not', when:'07/23/2026', pct:i<g.rank?undefined:0})).join('');
}

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

function lineChart(id,{title,sub,data,labels,slots,target,unit,min,max}){
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
    </div>
    <div class="chart-x">${ticks}</div>
    <div class="chart-table ct-bars">${data.map((v,i)=>`<div class="kv" style="--p:${Math.round((v-min)/(max-min)*100)}%"><span class="k">${labels[i]}</span><span class="ct-bar"><i></i></span><span class="v n">${v}${unit}</span></div>`).join('')}</div>
    <div class="mt4"><button class="btn btn-g btn-sm noic" data-tbl="${id}" style="padding-left:0">View as a table</button></div>
  </div>`;
}

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

function crumb(...parts){
  const last = parts.pop();
  return `<div class="crumb">${parts.map(([l,v])=>`<a data-go="${v}">${l}</a><span class="sep">/</span>`).join('')}<span>${last}</span></div>`;
}
const railRoots = () => {
  const set = NAVSETS[isLead() ? 'leader' : cfg(S.stage).nav] || [];
  return set.map(([k]) => k).concat(isLead() ? ['leadProfile'] : ['account']);
};
const bkLabel = `${I.arrowLeft}<span class="ph-back-t">Back</span>`;
const bk = (to) => (S.hist.length && !railRoots().includes(S.view))
  ? `<button class="ph-back" data-back="1">${bkLabel}</button>`
  : to ? `<button class="ph-back" data-go="${to}">${bkLabel}</button>` : '';
const PH_IC = [
  [/re-?interview|interview/i,                        'video'],
  [/track|explorer|builder|trailblazer/i,             'growth'],
  [/cohort|candidates|members|others/i,               'group'],
  [/level|rung|\bE\d\b|not enrolled|enrolled|signed/i,'certificate'],
  [/quiz|score|of 100|average|%/i,                    'chart'],
  [/week|\b\d+ days?\b|day \d|of 90|month|\bAug\b|\bNov\b|\bDec\b|\b(january|february|march|april|june|july|august|september|october|november|december)\b/i,'calendar'],
  [/minute|hour|\bmin\b/i,                            'time'],
  [/\$|paid|fee|price|refund/i,                        'wallet'],
  [/session|call|thread|message/i,                     'chat'],
  [/chapter|course|module|training/i,                  'book'],
  [/vetting|verif|identity|reference/i,                'shield'],
  [/certificate|award|badge|\bstars?\b/i,              'trophy']
];
function factIcon(t){
  const s = String(t || '').replace(/&[a-z]+;|&#\d+;/gi, ' ');
  for(const [re,k] of PH_IC) if(re.test(s)) return I[k];
  return I.circle;
}
const _cap = t => t.replace(/^([a-z])/, (m,c) => c.toUpperCase());
const phSub = sub => {
  const parts = String(sub).split(/\s*(?:&middot;|·)\s*/).map(s => s.trim()).filter(Boolean);
  if(parts.length < 2) return `<p>${sub}</p>`;
  return '';
};
function ph(title,sub,act,backTo,mark){
  return `<div class="ph${act?' ph-has-act':''}${mark?' ph-you':''}">
    <div class="ph-main">${mark||''}<div class="ph-top">${bk(backTo)}<h1>${title}</h1></div>${sub?phSub(sub):''}</div>
    ${act?`<div class="ph-act">${act}</div>`:''}</div>`;
}
function trackBand(track, codes){
  const T = ['Explorer','Builder','Trailblazer'];
  const ti = Math.max(0, T.indexOf(track));
  const lo = ti * 5;
  return `<div class="ladder ladder-track" role="img" aria-label="${track} track, levels ${lo+1} to ${lo+5} of 15. Your level is set after your interview.">
    ${Array.from({length:15},(_,i)=>`<i class="${i>=lo&&i<lo+5?'mine':''}">${codes?`<b>${LVL_CODES[i]}</b>`:''}</i>`).join('')}
  </div>
  <div class="ladder-lab">${T.map(n=>`<span${n===track?' class="on"':''}>${n}</span>`).join('')}</div>`;
}
const LVL_CODES = ['E','B','T'].flatMap(b => [1,2,3,4,5].map(n => b + n));

function ladder(cur,codes){
  const r = rungOf(cur);
  return `<div class="ladder">${LVL_CODES.map((c,i)=>
    `<i class="${i<r-1?'done':(i===r-1?'on':'')}">${codes?`<b>${c}</b>`:''}</i>`).join('')}</div>
  <div class="ladder-lab"><span>Explorer</span><span>Builder</span><span>Trailblazer</span></div>`;
}

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
function stepIcon(lab){
  const t = String(lab||'').replace(/&[a-z]+;|&#\d+;/gi,' ');
  for(const [re,k] of STEP_IC) if(re.test(t)) return I[k];
  return I.circle;
}

const STPS_W = {done:'Completed', on:'In progress'};

function stepper(steps, title){
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

const ENROL_OPENS = {
  E3: ['Cohort starts on 1st Dec, 2026'],
  E4: ['E4 opens on December 1', 'Cohort 58 has 7 places left.']
};
const ENROL_DESC = {
  E3: '90 days at your own level, then a re-interview that can move you up.',
  E4: 'Harder chapters at E4, then a re-interview that can move you again.'
};

const COHORT_SIZE = 10;
const ENROL_COURSE = {
  E3: {
    name: 'Business Fundamentals',
    desc: 'Build a strong understanding of the key principles that drive '
        + 'successful businesses. Learn about business strategy, operations, '
        + 'finance, marketing, and effective decision-making to develop a solid '
        + 'foundation for your professional journey.',
    lead: () => COHORT_LEAD,
    taken: 8,
    rating: 4.5,
    reviews: 339
  },
  E4: {
    name: 'Business Leadership',
    desc: 'Build the capabilities that define effective leadership. Learn to '
        + 'delegate with trust, navigate difficult conversations, coach and '
        + 'develop others, and lead through change &mdash; turning strong '
        + 'fundamentals into the judgment and presence that leading people demands.',
    lead: () => COHORT_LEAD_E4,
    taken: 3,
    rating: 4.7,
    reviews: 128
  }
};

const COURSE_NAME = {
  E1: 'Business Essentials',
  E2: 'Business and Productivity Tools',
  E3: ENROL_COURSE.E3.name,
  E4: ENROL_COURSE.E4.name
};
const courseOf = lvl => COURSE_NAME[String(lvl || '').toUpperCase()] || '';

const enrolFacts = lvl => {
  const c = ENROL_COURSE[lvl];
  return [
    [I.wallet, 'Course fee', '$690', {acc:1}],
    [I.book,   'Chapters',   '13, one a week', {}],
    c ? [I.star,  String(c.rating), `${c.reviews} user reviews`, {star:1}]
      : [I.chart, 'Assessments', '13, one per chapter', {}],
    c ? [I.group, 'Members', `${c.taken} members till now`,
         {chip:`${COHORT_SIZE - c.taken} seats left`}]
      : [I.group, `Cohort of ${COHORT_SIZE}`, 'live calls with your leader', {}]
  ];
};



const courseArt = lvl => COHORT_ART[String(lvl).toLowerCase()] || COHORT_ART.e3;
const COURSE_TOPICS = {
  E1:['Communication','Teamwork','Time management'],
  E2:['Tools','Productivity','Collaboration'],
  E3:['Strategy','Operations','Finance'],
  E4:['Leadership','Decisions','Ownership']
};
const courseTags = lvl => (COURSE_TOPICS[lvl] || []).map(t => `<span class="tag agt-tag">${t}</span>`).join('');
const COURSE_LEVELS = ['E1','E2','E3','E4'];

const COURSE_RATE_PH = { E1:[4.6,210], E2:[4.4,176] };   // placeholder, no seed record
const courseRating = lvl => {
  const c = ENROL_COURSE[lvl];
  return c ? [c.rating, c.reviews] : (COURSE_RATE_PH[lvl] || [4.5, 0]);
};

function courseRow(lvl, cur){
  const rec = lvl === cur ? '<span class="ag-rec">Recommended</span>' : '';
  const [rating, reviews] = courseRating(lvl);
  return `<div class="agt-r draw">
    <span class="agt-c agt-who">
      <img src="${courseArt(lvl)}" alt="" loading="lazy" onerror="this.style.display='none'"
        style="width:56px;height:38px;object-fit:cover;flex:0 0 56px;border:1px solid var(--rule)">
      <span class="agt-wb">
        <span class="agt-n">${COURSE_NAME[lvl]}${rec}</span>
        <span class="agt-rate">${stars(rating)}<span class="num">${rating.toFixed(1)}</span></span>
        <span class="agt-m">${reviews} reviews</span>
      </span>
    </span>
    <span class="agt-c agt-tags">${courseTags(lvl)}</span>
    <span class="agt-c agt-exp"><span class="agt-v">13 chapters</span></span>
    <span class="agt-c agt-next"><span class="agt-v">One a week</span></span>
    <span class="agt-c agt-fee">$690</span>
    <span class="agt-c agt-act">
      <button class="btn btn-p btn-sm noic" data-go="enrol">View Course</button>
    </span>
  </div>`;
}

const allCourses = (f) => {
  const cur = String((f && f.level) || 'E3').toUpperCase();
  return `
  <div class="sec">
    <div class="hd-srch">
      <div class="hd-srch-t">
        <div class="sec-h"><h2>Choose a course</h2></div>
        <p class="all-desc">Every course in your track. The one recommended for you now is marked.</p>
      </div>
      <div class="srch all-srch">
        <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
        <input class="inp" placeholder="Search all ${COURSE_LEVELS.length} courses" aria-label="Search courses">
      </div>
    </div>
  </div>
  ${''/* THE TABLE IS A BARE `.agt` SIBLING OF THE HEADING SEC, exactly as
        `allAgents` places `agentsTable()` (Maryam, 9 Sep 2026: "follow the
        organized ui we have on the all agents screen"). It used to live INSIDE
        the `.sec`, which pays a 32px inset each side, so the table was 64px
        narrower than the agent list — and the whole shortfall came off the one
        flexible column (`.agt-tags`), squeezing "What it covers" to ~173px so
        every topic pill wrapped onto its own line. Out here the table takes the
        full page width the agent list gets, and the topics group the way the
        expertise column does. */}
  <div class="agt">
    <div class="agt-h" aria-hidden="true">
      <span class="agt-c">Course</span>
      <span class="agt-c">What it covers</span>
      <span class="agt-c">Length</span>
      <span class="agt-c">Cadence</span>
      <span class="agt-c">Fee</span>
      <span class="agt-c"></span>
    </div>
    ${COURSE_LEVELS.filter(l => COURSE_NAME[l]).map(l => courseRow(l, cur)).join('')}
  </div>`;
};
const enrolOffer = (lvl, act) => `<div class="sec eo dark-card">
      ${aiHead({
        mark:false,
        title:'Your Next Step - Course Enrollment',
        desc:ENROL_COURSE[lvl] ? ''
          : `${ENROL_DESC[lvl]}${ENROL_OPENS[lvl][1] ? ' ' + ENROL_OPENS[lvl][1] : ''}`,
        under:`<span class="eo-when">${I.calendar}<b>${ENROL_OPENS[lvl][0]}</b></span>`,
        act:act === false ? '' : (act || `<button class="btn btn-s btn-sm noic" data-go="courses">View Other Courses ${I.arrowRight}</button>`)
      })}
      ${''/* THE ROW IS `.facts`, AND THE CLASS IS KEPT FOR ONE REASON: §10.15's
             label-column opt-out names it, so a headed section carrying one gets
             the page spine with no rule in §73 (trap 13). Almost everything else
             §29.17 gives it — the box, the equal columns, the cell padding — is
             overridden in §73.1a, because 613:8074 draws content-sized cells with
             the dividers centred between them rather than a four-across grid.

             TWO ROWS A CELL, NOT THREE. 613:8078/8079 are one 21px line and one
             19px line and that is the whole cell; the version before this had a
             label, a figure and a caption, which is `.stat`'s shape and one row
             more than the file. The middle line absorbed the third: "13" and
             "one a week" are one value, not a figure with a footnote. */}
      ${''/* A THREE-CHAPTER PANEL WAS BUILT BESIDE THESE FIGURES AND IS
             REMOVED, and the reasoning is kept because the block it answers is
             a real gap and because the next attempt should not re-derive it.

             THE ASK AND THE REVERSAL, both 2 Sep 2026. First: "the 4 sections
             in a row in black card should be aligned vertically on the left and
             I need a divider on its right and on the right side there needs to
             be a highlighting chapters list they could be 3 chapters that
             aligns with the candidate needs to learn, all 3 chapters will be
             openable, first one will be opened by default, on opening we need
             to show what you'll learn and Skills you'll gain section". Then:
             "hide the chapters on the black card" — confirmed as dropping the
             panel rather than closing its rows. So the figures go back to
             §73.1a's row and the card is the head, a rule, and four cells.

             WHAT IT WAS MADE OF, IF IT COMES BACK. Almost none of it needed
             inventing, which is the part worth keeping:

               which three   `GROWTH` — [3,4,11] in data.js, already the three
                             chapters this candidate's assessment points at and
                             already read by `V.course`'s rows, ai8's chapter
                             widget and lead2. Reading it is what stops the
                             panel naming a different three from Tal's summary
                             200px above, which opens on "delegation and hard
                             conversations as your growth areas".
               the rows      §04's `.acc` — openable rows, one open at a time,
                             the chevron turning, and a handler already in this
                             file scoped to the nearest `.acc`.
               the body      §87's two sections ARE the reference's two
                             sections: `learnSec()` draws a `.lrn` checklist
                             under "What you'll learn" and `.skl-c` pills under
                             a `.skl-h` reading "Skills you'll gain".
               the state     §65's split, not `.acc`'s. That component keeps its
                             open row in a DOM class alone and its own note says
                             why that is safe there — "`.acc` is on pages nothing
                             re-renders under the reader". This card is on three
                             dashboards, so the class alone loses the open row
                             every time Tal answers; and `render()` alone resets
                             the scroller and throws the reader back to the
                             header. Both halves.

             THE ONE THING THAT DID NEED WRITING was three outcomes per chapter:
             `CH` is a title and a duration, so the build holds no per-chapter
             syllabus. That is the honest cost of the block and is where a
             second attempt should start.

             AND THE HANDLER ORDER IS THE TRAP IT WOULD HIT AGAIN. Those rows
             are `.acc-h` buttons, so the generic `.acc-h` branch matches them —
             and that branch moves `.on` and returns, so a `data-eoch` branch has
             to run BEFORE it. §76's `S.bkSlot` records the identical hazard
             against the shared `.slot` handler. */}
      ${''/* WHAT YOU ARE BUYING, IN FOUR ROWS, UNDER THE START DATE — the
             `ENROL_COURSE` block, and that record's note is the argument for
             every figure in it. Order is the ask's order: the name, then what
             the course is, then who runs it, then how many people are already
             in it.

             IT GOES ABOVE §82.2's RULE, NOT BELOW IT, and that is what keeps
             the card two parts rather than three. The head, the date and these
             four rows are all one statement of the offer; the rule and the four
             figures under it are the SPEC. §82.2's own reading is "on a black
             card the head and the figures are two parts of ONE object, and a
             hairline is what says so" — the hairline still says it, with more
             on the head's side of it.

             THE NAME IS 20px AND IS THE BIGGEST THING ON THE CARD, WHICH IS
             DELIBERATE AND IS A TENSION WORTH NAMING. `.aih-t` above it is
             `--t-sec-size`, 16 — so the course name out-ranks the card's own
             heading. That is the arrangement §75.3 established for a black
             card and this is the first card to have a subject big enough to
             use it: "Your Next Step - Course Enrollment" is the SLOT, learned
             once and never read again, and "Business Fundamentals" is the
             thing. §63's display-role note records the mistake this would be
             if it were words competing with a page TITLE; a slot label is not
             a title. `.t-h2` is the role — 20px is already in the scale, so no
             token and no exception is added.

             EVERY ROW TAKES AN EXISTING §63 ROLE CLASS AND NO NEW TYPE RULE IS
             ADDED, which is the point of those classes: `.t-h2` on an `<h3>`
             takes its size from the role and its ink from §63 §6a's
             `.dark-card h3`; `.t-desc` takes `--on-dark-2` from the same block;
             and the leader's NAME is a `<b>`, which §6a lifts back to
             `--on-dark`. So the label is quiet, the name is not, and §63 owns
             all of it.

             THE FACE IS `.av-ph` WITH NO INLINE SIZE — trap 1. `avatar()`
             writes `style="width:…"` and an inline declaration beats every
             stylesheet rule at every specificity, so a mark whose size a layer
             owns cannot use that helper (§62's `youMark` note is the same
             call). The span is written out; §106 makes it a disc and §108 sizes
             it at 24. */}
      ${(() => {
        const c = ENROL_COURSE[lvl];
        if(!c) return '';
        const p = c.lead ? c.lead() : null;
        return `<div class="eo-course">
        ${''/* "TAL RECOMMENDS" OVER THE COURSE NAME (Maryam, 9 Sep 2026: "just
               like the agent black card i need you to add Tal recommends with the
               star above the course name"). The same `.rec-lab` the agent
               recommendation card wears — the 12px sparkle plus the label — so
               the two black cards read as one voice making a pick. `.bare` is the
               `.ai-label` opt-out for a mark outside the JS-assembled head band
               (recipe note), which is what this hand-authored card is. */}
        <span class="ai-label bare rec-lab">Tal recommends</span>
        ${''/* 28px, WHICH IS `--t-h1-size-lg` AND IS ALREADY IN THE SCALE
               (Maryam, 2 Sep 2026: "increase the course name font size to
               28px"). It shipped at 20 — `.t-h2` — and the role class is gone
               with it: 28 has no role class because it is the h1's DESKTOP
               step, so §63 §44 states this one by name. Still no new token and
               still no §7 exception; the value was in §1's table already.

               IT IS NOW THE LARGEST THING ON THE PAGE AND THAT IS THE POINT.
               `.aih-t` above it is 16, Tal's summary is 13.5, and the page has
               no `<h1>` at all since §78 took the heading out of the `.ph`. So
               the course name is the page's title in everything but markup —
               which is what a card whose whole job is a $690 decision about
               that course should look like. §63's display-role note is the
               limit this stays inside: 34/40 is for hero NUMERALS, and two
               words at 28/34 is a title rather than a figure. */}
        <h3 class="eo-cname">${c.name}</h3>
        ${''/* THE DESCRIPTION IS THE PROSE ROLE, NOT THE DESCRIPTION ROLE, AND
               THE DIFFERENCE IS MEASURED. It shipped as `.t-desc` for one build
               — 12.5/17 — and this is 44 words: three lines of label-sized type
               with 17px leading, which §63's own note rules out in as many
               words ("body leads at 22 and compact at 19, so the description
               reads as a paragraph and the fact rows read as a list"). `.plate-d`
               is the object this is — "the one sentence on a plate" — and it
               takes `--t-body`. §63 §44 states the pair, because the SIZE is a
               role and the INK is a description's grey, and the two do not come
               from one existing class. */}
        <p class="eo-cdesc">${c.desc}</p>
        ${''/* THE LEADER ROW IS DRAWN ONLY WHERE THERE IS A LEADER, and E4 is
               why (Maryam, 3 Sep 2026 — the E4 card follows this one). The
               record's head note has the argument: `COHORT_LEAD`'s range is
               E1–E3, so naming Priya as the leader of an E4 cohort is the one
               thing on that card that would be false, and there is no second
               leader in the build to name instead.

               A ROW WITH NO FACE WOULD HAVE BEEN WORSE THAN NO ROW. The shape
               is a 24px disc and a line of text; with no photograph the disc is
               an empty circle and `crow`'s own note is the general rule — an
               undefined `src` 404s on every render, which `respcheck` reads as
               a broken screen. `.eo-course` is a flex column with a `gap`, so
               omitting a child costs nothing to lay out. */}
        ${p ? `<p class="t-desc eo-lead">
          <span class="av-ph eo-lead-ph"><i>${p.i}</i><img src="${p.img}" alt="" loading="lazy" onerror="this.style.display='none'"></span>
          Cohort Leader: <b>${p.n}</b></p>` : ''}
        ${''/* THE ENROLLED-COUNT ROW WAS HERE AND IS REMOVED, BECAUSE THE
               FOURTH FIGURE CELL NOW SAYS IT BETTER — see `enrolFacts`.

               It read "6 of 10 candidates have already enrolled", from the ask
               of 2 Sep 2026 ("beneath that show the count of how many candidate
               have already enrolled into this course"), and it was the right
               row while the cell below it said "Cohort of 10" and nothing else.
               The next ask that day moved that cell to "Total Members / 8
               members till now" with a red "2 seats left" chip on it — which is
               the same figure, its denominator and the urgency, in the slot
               built for figures. Two statements of one number 100px apart is the
               repetition §72 took out of the pulse and §73 took out of the
               social-proof row.

               ONE FIGURE, THREE READERS, AND IT IS NOW ALL IN ONE CELL:
               `ENROL_COURSE.E3.taken` is the 8, `COHORT_SIZE - taken` is the
               chip's 2, and `COHORT_SIZE` is the ten. Restoring this row is one
               line if the card should say it twice. */}
      </div>`;
      })()}
      ${''/* THE OPTION OBJECT IS DESTRUCTURED RATHER THAN READ AS A FOURTH
             POSITIONAL ARGUMENT, so a cell that wants two modifiers can have
             them — the rating cell takes `star` and the members cell takes
             `chip`, and the fee still takes `acc`.

             THE CHIP IS INSIDE `.eo-fl`, WHICH IS WHAT "ON THE RIGHT OF TOTAL
             MEMBERS" MEANS. Not a third row and not beside the cell: the label
             line becomes a flex row and the chip takes an auto margin to its
             end (§108.5). §63 §13 keeps the label's own type; the chip states
             its own, because a chip is `--t-label`'s case ("a chip, a tag, a
             small value") and not a heading's. */}
      <div class="facts eo-facts">
        ${enrolFacts(lvl).map(([ic, lab, val, o]) => `<div>
          <i class="eo-fi${o.star ? ' eo-fi-star' : ''}">${ic}</i>
          <span class="eo-fb"><span class="eo-fl">${lab}${
            o.chip ? `<span class="eo-chip">${o.chip}</span>` : ''}</span>
            <span class="eo-fv${o.acc ? ' eo-fv-acc' : ''}">${val}</span></span>
        </div>`).join('')}
        ${''/* "View Course" JOINS THE STAT ROW (Maryam, 9 Sep 2026: "take the view
              course button at bottom in the same row of the other stats"). It is
              the card's own action, so it stays `btn-p`; it rides the far end of
              the `.facts` row (`margin-left:auto`), which is the "adjust that row
              spacing accordingly" — the four figures keep their cells and the
              button takes the slack on the right. Dashboard only (`!act`); on
              `V.enrol` the action is the passed "Continue to payment".

              FULL HEIGHT, NOT `btn-sm` (Maryam, 9 Sep 2026: "why the size of view
              course button is not matching with our other buttons"). §10.299
              makes `.btn-sm` 32px at desktop while the standard `.btn` is 40px
              (§10.298), so a `btn-sm` CTA read a step short of the card's own
              "View Other Courses" and every other button. Dropped to the plain
              `.btn` height so it matches.

              DASHBOARD ONLY — `act === undefined`, NOT `!act` (Maryam, 9 Sep
              2026: "remove the view course button from black card on this page",
              the payment page). `V.payment` passes `act:false` for a card with no
              head-row action, and `false` is falsy, so `!act` was drawing "View
              Course" there too — on the one page where you have already chosen
              the course and are paying for it. `undefined` is the dashboard's own
              "no act passed"; `false` is the payment page saying "no action at
              all", and now the two read apart. */}
        ${act === undefined ? `<div class="eo-cta" style="display:flex;align-items:center;margin-left:auto">
          <button class="btn btn-p noic" data-go="enrol" style="white-space:nowrap">View Course ${I.arrowRight}</button></div>` : ''}
      </div>
    </div>`;


const JRN = ['Leadership quiz','Interview and level','Enrolled','90-day course'];
function journey(){
  const row = (sts, secs) => JRN.map((lab,i) => ({st:sts[i], lab, sec:secs[i]}));
  const AHEAD = ['Locks in your cohort and your price','13 chapters, one a week'];
  const LEVELLED = row(['done','done','on',''],
    ['Explorer track &middot; Aug 12', 'E3 &middot; set by TalentNext, Aug 21',
     'Not enrolled yet', AHEAD[1]]);
  switch(S.stage){
    case 'consult': return row(['done','on','',''],
      ['Explorer track &middot; Aug 3',
       'Jordan calls Thu, Aug 13 &middot; your interview sets your level', ...AHEAD]);
    case 'new': return row(['done','on','',''],
      ['Explorer track &middot; Aug 12', 'Not booked yet &middot; 45 minutes', ...AHEAD]);
    case RESCHED:
    case 'booked': return row(['done','on','',''],
      ['Explorer track', 'Priya Nair &middot; Thu, Aug 20', ...AHEAD]);
    case 'held': return row(['done','on','',''],
      ['Explorer track', 'Priya Nair &middot; report on its way', ...AHEAD]);
    case 'assessed': return LEVELLED;
    case 'enrolPre': return row(['done','done','done','on'],
      ['Explorer track &middot; Aug 12', 'E3 &middot; set by TalentNext, Aug 21',
       'Cohort 41', 'Starts in 6 days']);
    case 'cancelled': return row(['done','done','done','on'],
      ['Explorer track &middot; Aug 12', 'E3 &middot; set by TalentNext, Aug 21',
       'Moved to Cohort 47', 'Starts 12 Mar']);
    case 'rebook': return row(['done','on','',''],
      ['Explorer track &middot; Aug 12', 'Could not take place &middot; free rebooking', ...AHEAD]);
    case 'promoted': return [
      {st:'done', lab:'Interview and level', ai:'Re-interview &amp; Levelling',
       sec:'E4 &middot; set by TalentNext, Nov 21'},
      {st:'on',   lab:'Enrolled',            ai:'Course Enrollment',
       sec:'Not enrolled yet'},
      {st:'',     lab:'90-day course',       ai:'90 days Cohort Journey',
       sec:AHEAD[1]}
    ];
    default: return LEVELLED;
  }
}

const wingHead = t => `<div class="stp-top"><h2 class="u-h3">${t}</h2></div>`;

const progressWing = f => `<div class="stp stp-open stp-titled wing-prog">
    ${wingHead('Your 90 days so far')}
    ${progressStrip(f)}
  </div>`;

const ladderWing = f => `<div class="stp stp-open stp-titled wing-lvl">
    ${wingHead('Where you are on the ladder')}
    <div class="prog">
      ${''/* THE TRACK AND THE LEVEL, NOT THE LEVEL ALONE. "E4" is a code, and a
            code is only half the answer to "where am I": the ladder under it has
            three tracks on it and the reader has to know which one the four
            filled blocks are in. `f.track` is the same word the first block of
            the row below is labelled with, so the headline and the bar name the
            same thing. The en dash matches every other place the pair is set —
            the fact row's "Explorer Track &ndash; E4" and `enrolPlate`'s title. */}
      <div class="prog-top">
        <div><div class="prog-pct">${f.track} &ndash; ${f.level}</div>
          <div class="prog-l">confirmed at your re-interview</div></div>
        <div class="prog-day"><div class="prog-dn">${rungOf(f.level)}<small> of 15</small></div>
          <div class="prog-l">on the ladder</div></div>
      </div>
      ${ladder(f.level, true)}
    </div>
  </div>`;

function wingBlock(){
  const f = cfg(S.stage);
  if(f.complete) return ladderWing(f);
  return stepper(journey());
}

const progCol = f => `<div class="sec head-sec head-col sec-prog${f.done >= CH.length ? ' prog-full' : ''}">
    ${progressWing(f)}
  </div>`;

const PLATE_SOON = /\b(now|today|tonight|imminent|starting|under an hour|in an hour|in \d+ ?(h|hr|hrs|hour|hours|m|min|mins|minute|minutes)\b)/i;

const WEEK_CALL = {when:'in 2 days', session:36};

const CONSULT_CALL = {when:'in 2 days', mins:15};

const callLeft = w => !/^in /i.test(w) ? w
  : PLATE_SOON.test(w) ? 'In ' + w.slice(3) : w.slice(3) + ' left';

const callIn = w => /^in /i.test(w) ? 'In ' + w.slice(3) : w;

const JOIN_NOW = /\b(now|starting|imminent|in \d+ ?(m|min|mins|minute|minutes)\b)/i;
const JOIN_EARLY = 5;   /* minutes you may arrive before the hour */

const joinClock = (w) => {
  const m = /\btoday\b[,\s]+(\d{1,2}):(\d{2})\s*([ap])\.?m\.?/i.exec(String(w || ''));
  if(!m) return null;
  let h = +m[1] % 12;
  if(/p/i.test(m[3])) h += 12;
  const d = new Date();
  d.setHours(h, +m[2], 0, 0);
  return d.getTime();
};

function joinLive(when, mins){
  if(JOIN_NOW.test(String(when || ''))) return true;
  const t = joinClock(when);
  if(t === null) return false;
  const now = Date.now();
  return now >= t - JOIN_EARLY * 60000 && now <= t + (mins || 45) * 60000;
}

function joinArm(){
  const btns = (typeof device !== 'undefined' && device)
    ? device.querySelectorAll('[data-joinwhen]') : [];
  btns.forEach(b => {
    const live = joinLive(b.dataset.joinwhen, +b.dataset.joinmins || 45);
    if(live === !b.disabled) return;
    b.disabled = !live;
    if(live) b.removeAttribute('title');
    else b.title = joinShut(b.dataset.joinwhen);
  });
}
const joinShut = (w) => {
  const t = joinClock(w);
  if(t === null) return 'Opens when the call starts';
  const d = new Date(t - JOIN_EARLY * 60000);
  const h = d.getHours() % 12 || 12;
  return `You can join from ${h}:${String(d.getMinutes()).padStart(2,'0')} ${d.getHours() < 12 ? 'AM' : 'PM'}`;
};
setInterval(joinArm, 20000);

function heldTill(){
  if(!S.heldTill) S.heldTill = Date.now() + 24 * 3600 * 1000;
  return S.heldTill;
}
const heldOverdue = () => heldTill() - Date.now() <= 0;
function heldFmt(ms){
  const s = Math.max(0, Math.floor(ms / 1000));
  const p = n => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor(s % 3600 / 60))}:${p(s % 60)}`;
}
function heldArm(){
  const els = (typeof device !== 'undefined' && device)
    ? device.querySelectorAll('.held-timer[data-heldtill]') : [];
  els.forEach(el => {
    const t = +el.dataset.heldtill;
    if(t) el.textContent = heldFmt(t - Date.now());
  });
}
setInterval(heldArm, 1000);

function cohortStartTill(f){
  if(!S.cohortStartTill) S.cohortStartTill = Date.now() + ((f && f.startIn) || 0) * 24 * 3600 * 1000;
  return S.cohortStartTill;
}
function startFmt(ms){
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const p = n => String(n).padStart(2, '0');
  const hms = `${p(Math.floor(s % 86400 / 3600))}:${p(Math.floor(s % 3600 / 60))}:${p(s % 60)}`;
  return d > 0 ? `${d}d ${hms}` : hms;
}
function startArm(){
  const els = (typeof device !== 'undefined' && device)
    ? device.querySelectorAll('.start-timer[data-starttill]') : [];
  els.forEach(el => {
    const t = +el.dataset.starttill;
    if(t) el.textContent = startFmt(t - Date.now());
  });
}
setInterval(startArm, 1000);

function callTimerFmt(ms){
  if(ms <= 0) return 'Live now';
  const m = Math.floor(ms / 60000);
  const p = n => String(n).padStart(2, '0');
  return `${p(Math.floor(m / 60))}:${p(m % 60)}`;
}
function callTimerArm(){
  const els = (typeof device !== 'undefined' && device)
    ? device.querySelectorAll('.lcal-timer[data-calltill]') : [];
  els.forEach(el => {
    const t = +el.dataset.calltill;
    if(t) el.textContent = callTimerFmt(t - Date.now());
  });
}
setInterval(callTimerArm, 1000);

const CALL_ROW = {
  iv: () => {
    const k = (S.booking && S.booking.agent) || (S.bk && S.bk.agent) || S.agent || 'priya';
    const a = AGENTS[k] || AGENTS.priya;
    const resched = S.stage === RESCHED;
    return {who:a, role:'Talent agent', when: resched ? 'in 2 days' : 'in 5 minutes',
      label:'Level interview &middot; 45 minutes, recorded',
      x:`${(REC[k] || REC.priya).expertise}, assesses ${a.range}`,
      kind:'iv', key:k, resched, second:{go:'interviews', ic:I.calendar, t:'Reschedule'}};
  },
  cohort: () => {
    const L = COHORT_LEAD, w = WEEK_CALL.when;
    return {who:L, role:'Cohort leader', when:w,
      label:`Cohort week call${PLATE_SOON.test(w) ? '' : ` &middot; session ${WEEK_CALL.session}`}`,
      x:`${L.expertise}, assesses ${L.range}`,
      kind:'cohort', second:{go:'messages', ic:I.chat, t:'Message ' + L.n.split(' ')[0]}};
  },
  re: () => {
    const a = AGENTS.priya;
    return {who:a, role:'Talent agent', when:'due now',
      label:'Re-interview &middot; 45 minutes, recorded',
      x:`${REC.priya.expertise}, assesses ${a.range}`,
      kind:'re', second:{go:'interviews', ic:I.calendar, t:'See the booking'}};
  }
};

function crow(kind, o){
  const c = typeof kind === 'object' && kind ? kind : (CALL_ROW[kind] || CALL_ROW.cohort)();
  const p = c.who;
  const soon = PLATE_SOON.test(c.when);
  o = o || {};
  const xl = c.xl === undefined ? 'Expertise:' : c.xl;
  const gated = o.gate !== false;
  const gate = gated && !joinLive(c.when, c.mins);
  return `<div class="crow${soon ? ' urgent' : ''}">
      ${o.when === false ? '' : `<div class="crow-when">
        <b>${callLeft(c.when)}</b>
        <span>${c.label}</span>
      </div>`}
      <div class="crow-who">
        ${''/* THE `<img>` IS OMITTED WHEN THERE IS NO PHOTOGRAPH, rather than
               written with an undefined `src`. The leader's weekly call is the
               first row whose subject is not a person — the mark is the cohort's
               number — and `src="undefined"` is a real request that 404s: the
               `onerror` hides the element, so the card LOOKS right and the
               console carries a failed resource on every render, which is
               exactly what `respcheck` reads as a broken screen. The `<i>` is
               the mark in that case (§71 normalises its `font-style`). */}
        ${''/* `c.cover` MEANS "THIS MARK IS ARTWORK, NOT A FACE", and it is a
               separate field from `img` because the two are different questions:
               `img` is whether there is a picture, `cover` is what SHAPE the slot
               should be. A face wants the 78px square §71.405 draws; a cohort's
               course cover is a ~1.8:1 title card, and a square crop of one
               throws away the half that carries the words (§86 is the argument
               and the ratio). One flag, one class, and the four call sites that
               draw a person are untouched. */}
        ${''/* NO MARK AT ALL WHEN THE RECORD HAS NEITHER INITIALS NOR A PHOTO
               (Maryam, 9 Sep 2026: "remove the circle 41 from the black card").
               The leader's weekly call set `who.i` to the cohort number, which
               drew a disc reading "41"; dropping `i` from the record now drops
               the whole `.crow-ph`, so the detail sits flush left. Every person
               row still carries `i`/`img`, so their avatar is untouched. */}
        ${(p.i || p.img) ? `<span class="crow-ph${c.cover ? ' crow-cover' : ''}"><i>${p.i || ''}</i>${p.img
          ? `<img src="${p.img}" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}</span>` : ''}
        <div class="crow-b">
          <p class="crow-id"><span class="crow-n">${p.n}</span>
            ${c.v === false ? '' : `<span class="crow-v">${I.checkFilled}</span>`}</p>
          <p class="crow-role">${c.role}</p>
          <p class="crow-x">${xl ? `<b>${xl}</b> ` : ''}${c.x}</p>
        </div>
      </div>
      ${''/* `o.join === false` DROPS THE PRIMARY AND PROMOTES THE SECONDARY
             (Maryam, 31 Aug 2026). The leader's card carried a Join that
             §81 gates shut for twenty-three hours a day, so what the card
             showed almost always was a dead control beside a live one —
             and §60's rule is that a dead control on a live surface is
             worse than a missing one. §81's gate was the honest answer
             while Join was the card's POINT; it is not the point here, so
             the button goes rather than being explained.
             WITH THE PAIR GONE THE SURVIVOR CHANGES SHAPE: it loses its
             leading subject icon and takes a TRAILING `arrowRight`, which
             is this product's mark for "this takes you somewhere" and ends
             forty-odd buttons already. `ic-l` comes off with the icon —
             that class exists to seat a leading mark. Nothing else in the
             product passes `join`, so the candidate's three call sites and
             `callRow` render byte-identically. */}
      <div class="crow-a${o.join === false ? ' crow-a1' : ''}">
        ${''/* AND THE SECONDARY'S ATTRIBUTE IS THE RECORD'S, because not every
               way onward is a `data-go`. The leader's weekly-call card opens the
               brief SHEET, which is `data-ldrbrief="<id>"` (lead2) — a
               `data-go="null"` would have been a route into the router with no
               view behind it. `second.at` is a raw attribute the caller states;
               `go` still wins when it is there, so the four rows that had one
               are untouched. */}
        ${o.second === false ? '' : `<button class="btn btn-sm noic${o.join === false ? '' : ' ic-l'}" ${
          c.second.go ? `data-go="${c.second.go}"` : (c.second.at || '')}>${
          o.join === false ? `${c.second.t} ${I.arrowRight}` : `${c.second.ic}${c.second.t}`}</button>`}
        ${o.join === false ? ''
          : c.resched ? `<button class="btn btn-sm noic crow-resched" data-go="cal:${c.key}">Reschedule ${I.arrowRight}</button>`
          : `<button class="btn btn-p btn-sm noic"${c.kind ? ` data-call="${c.kind}"` : ''}${
          gated ? ` data-joinwhen="${c.when}" data-joinmins="${c.mins || 45}"` : ''}${
          gate ? ` disabled title="${joinShut(c.when)}"` : ''}>Join call ${I.arrowRight}</button>`}
      </div>
    </div>`;
}

const callRow = () => `<div class="sec head-sec head-col sec-call">${crow('cohort')}</div>`;

const JRN_AI = ['Nextinleadership Quiz','Interview &amp; Levelling',
                'Course Enrollment','90 days Cohort Journey'];

function jrnList(){
  const steps = journey();
  const at = steps.findIndex(s => s.st === 'on');
  const now = at < 0 ? steps.length : at + 1;
  return `<div class="sec head-sec head-col sec-jrn">
    <div class="jrn">
      <div class="jrn-h">
        <h2 class="jrn-t">Your journey so far</h2>
        <span class="jrn-pill">Step ${now} of ${steps.length}</span>
      </div>
      <ol class="jrn-l">
        ${steps.map((s,i) => `<li class="jrn-i${s.st ? ' ' + s.st : ''}">
          ${''/* THE MARK IS THE STATE, NOT THE SUBJECT, AND THIS REVERSES THE
                NOTE THAT WAS HERE (Maryam, 31 Aug 2026: "the ui i sent you for
                this section have completion and progress or queue icons instead
                of the icons relevant to the level").

                WHAT IT USED TO DO AND WHY THAT ARGUMENT LOST. It called
                `stepIcon(s.lab)`, which matches on words `STEP_IC` knows, so the
                four rows came out a tick, a video camera, a group and a book —
                and the note defended it on the grounds that CLAUDE.md forbids a
                step's mark differing between two drawings of the same step. That
                rule is about `stepIcon`'s TABLE not being forked, so that
                "Vetting" cannot be a shield on one page and a ring on another;
                it is not a rule that every drawing of a step must use that
                table. `stepper()` is untouched and still does.

                AND THE SUBJECT MARK WAS SAYING NOTHING HERE. A row already
                carries its subject in words 8px to the right — "Interview &
                Levelling" beside a video camera is the label twice — while the
                one thing the row does NOT say is where you are in it. 587:6741
                spends the mark on that instead: tick for done, `hourglass_top`
                for the step that is yours and unfinished (icons.js's own note on
                why the filled top cut, not the empty one), a clock for a step
                that is only queued. Three marks, three states, and the ink §63
                gives the row already agrees with each.

                THE NUMBERS ARE WHAT CARRY THE SEQUENCE, which is what makes the
                subject mark affordable to spend: the list is an `<ol>` and every
                row is numbered, so nothing is lost by the mark stopping being a
                second label. */}
          <span class="jrn-ic">${s.st === 'done' ? I.checkFilled
                                : s.st === 'on' ? I.hourglass : I.time}</span>
          ${''/* THE NUMBER IS GONE (Maryam, 31 Aug 2026: "remove the 1,2,3,4
                 from texts"). It was saying a third time what the list already
                 says twice: the rows are in order down the page, and the pill in
                 the head row prints "Step 3 of 4" — so the numeral was position
                 stated as content, beside a mark whose whole job is to say where
                 in the sequence this row is. `<ol>` keeps the semantics for a
                 screen reader with no marker drawn.

                 `.jrn-n` GOES WITH IT rather than being left standing — §70.648
                 gave it `flex:none` and §63 §10 named it in a `flex` list, and a
                 class nothing writes is the "gate nothing writes" tell
                 CLAUDE.md describes. Both removed. */}
          ${''/* `s.ai` FIRST, BECAUSE `JRN_AI` IS INDEXED AND ONE STAGE IS NOT
                 FOUR STEPS LONG (Maryam, 1 Sep 2026). `promoted` returns three
                 rows with their own words, and looking those up by position in a
                 four-label list would have printed the first three labels of the
                 way IN against rows about the way round again — silently, since
                 `JRN_AI[0..2]` all exist. Only that stage sets `ai`; every other
                 step object has none, so `JRN_AI[i]` still answers for them and
                 no other page's labels move. `s.lab` stays as the last resort
                 for a fifth step added to `journey()` and not to `JRN_AI`. */}
          <span class="jrn-lab">${s.ai || JRN_AI[i] || s.lab}</span>
        </li>`).join('')}
      </ol>
    </div>
  </div>`;
}

const REC_ORDER = ['priya','owen','lena'];

const AG_ORDER = ['priya','owen','lena','samuel','hana','camila'];

const REC = {
  priya:{match:'98%', need:'System Design',    strength:'Architecture',
         expertise:'System Architecture', mins:'45 mins call'},
  owen: {match:'94%', need:'Decision Making',  strength:'Incomplete Information',
         expertise:'Retail Operations',   mins:'45 mins call'},
  lena: {match:'91%', need:'Delegation',       strength:'Engineering Teams',
         expertise:'Engineering Management', mins:'45 mins call'}
};

S.recKey = 'priya';
S.recBusy = false;
const recKey = () => REC_ORDER.includes(S.recKey) ? S.recKey : REC_ORDER[0];

const REC_MS = 4500;

const recWrap = () => 'sec sec-rec no-band dark-card rec-dark';

function recSkeleton(){
  const a = AGENTS[recKey()];
  const first = a.n.split(' ')[0];
  return `<div class="${recWrap()}">
    ${''/* THE HEADING IS REAL AND ITS STAND-IN IS A BAR, because it is the one
          thing on the block that does NOT change when Tal picks somebody else.
          Drawn rather than printed all the same: the skeleton replaces the
          whole section, and a live 18px heading over nine ramp bars would read
          as a heading that had lost its block. */}
    <div class="dc-hd">
      <div class="dc-hd-r"><span class="sk sk-hd"></span><span class="sk sk-see"></span></div>
      <span class="sk sk-lab"></span>
    </div>
    <div class="rec rec-busy" aria-busy="true">
      <div class="rec-l">
        <span class="sk sk-ph"></span>
        <div class="rec-b">
          ${''/* TWO BARS IN THE TOP BLOCK AND THEY ARE THE NAME AND THE RATING
                — the expertise line came off the real block (Maryam, 31 Aug
                2026) and the rating moved under the name to take its row. The
                skeleton's whole point is that every bar is the BOX of the thing
                it replaces so nothing moves when the real content lands, which
                stops being true the moment the real content changes shape.
                Updated even though nothing can currently reach this function —
                see the note in `talRec`: if the swap is not re-homed the family
                goes, and until then a skeleton describing a layout that no
                longer exists is worse than none. */}
          <div class="rec-top">
            <span class="sk sk-n"></span>
            <span class="sk sk-rt"></span>
          </div>
          <div class="rec-ov">
            <p class="rec-tags"><span class="sk sk-t sk-why"></span></p>
          </div>
          ${''/* THE THREE FACT BARS MOVED WITH THE ROW THEY STAND IN FOR. A
                skeleton is only worth having while every bar is the BOX of the
                thing it replaces, so an order it no longer shares is the same
                failure as a width it no longer shares. */}
          <p class="rec-f"><span class="sk sk-f"></span><span class="sk sk-f"></span><span class="sk sk-f"></span></p>
        </div>
      </div>
      <div class="rec-a">
        <button class="btn btn-p btn-sm noic rec-off" disabled>Book call with ${first} ${I.arrowRight}</button>
        <span class="rec-alt rec-finding">Finding another agent</span>
      </div>
    </div>
  </div>`;
}

function talRec(title){
  if(S.recBusy) return recSkeleton();
  const a = AGENTS[recKey()];
  const rec = REC[recKey()];
  const isRe = !!cfg(S.stage).reinterview;
  const first = a.n.split(' ')[0];
  return `<div class="${recWrap()}">
    ${''/* THE BLOCK NAMES ITSELF, AND THE LABEL BECOMES THE ATTRIBUTION UNDER
          IT (Maryam, 31 Aug 2026). "Agent recommended by Tal" was doing two
          jobs in one line — saying what this block IS and saying whose choice
          it is — which is why it read as a caption on a page whose other three
          blocks all open with a heading. The heading answers the first ("Your
          Next Step - Interview", which is the page's own question) and the
          sparkle line answers the second in three words.

          THE PAIR IS WRAPPED, and it is not decoration: `.sec-rec` is a column
          at 20px, which is the file's gap between the label and the row of
          content beneath it. A heading dropped straight into that column sits
          20px off its own attribution and 20px off the block, so the three
          read as three things. `.rec-hdb` holds the head at 12 and leaves the
          20 where 581:6456 puts it.

          AND "VIEW ALL AGENTS" MOVED UP HERE, WITH A RULE UNDER THE ROW
          (Maryam, 31 Aug 2026). It was the left half of a pair at the foot of
          the card, beside Book — and the two were never the same KIND of
          thing. Book is what this card is for; View all agents is the way out
          of it, which belongs to the SECTION rather than to Priya. On the
          heading's row it is the section's own control and the card underneath
          has one action, which is what a recommendation should have.

          THE RULE IS WHAT MAKES THE ROW A HEADER rather than two things that
          happen to be on one line — and it is `--on-dark-rule`, white at 16%,
          not `--on-dark-border` at 42%. §15's note on `.plate-x` is where that
          distinction is argued: the border token is for something you can
          press, and a hairline drawn at that weight reads as the top edge of a
          box rather than as a rule. */}
    <div class="dc-hd">
      <div class="dc-hd-r">
        <h2 class="dc-t">${title || 'Your Next Step - Interview'}</h2>
        ${''/* IT CAME OFF FOR TWENTY MINUTES ON 3 SEP 2026 and is back. While
               "Other Agents" existed below, this was the same words pointing at
               the same view 200px above that section's own `.sec-h-act` — the
               duplicate §112 deletes on the leader dashboard. With the section
               reverted (see the note over `recKey`), the heading row is the
               nearest honest place for it again, which is what the paragraph
               above says it is. */}
        <button class="btn btn-s btn-sm noic dc-act" data-go="agents">View all agents ${I.arrowRight}</button>
      </div>
      <span class="ai-label bare rec-lab">Tal recommends</span>
    </div>
    ${''/* THE ROW IS TWO GROUPS, NOT THREE ITEMS — 581:6460. The file nests the
          photograph and the facts inside one frame at gap 16 and pushes the
          actions to the far edge with `justify-between`; written flat, the
          same `space-between` puts the free space BETWEEN the photograph and
          the name as well, which is the one gap on this block that is measured
          rather than elastic. `.rec-l` is that frame. */}
    <div class="rec">
      <div class="rec-l">
        <span class="rec-ph"><i>${a.i}</i><img src="${a.img}" alt="" loading="lazy" onerror="this.style.display='none'"></span>
        <div class="rec-b">
          ${''/* THE RATING IS A ROW OF ITS OWN UNDER THE NAME, AND THE
                EXPERTISE LINE IS GONE (Maryam, 31 Aug 2026).

                THE TWO CHANGES ARE ONE CHANGE. `.rec-top` is a column at 8px
                that held two rows: name-and-rating, then "Expertise: System
                Architecture, Assesses E1–E3". Dropping the second and moving
                the rating down keeps the block exactly two rows tall, so the
                166px photograph beside it is still square against its own
                content — and what the second row says is now a measure of the
                person rather than a restatement of their range, which the
                three facts under it and the claim under those already circle.
                The range itself is not lost: `V.agent` is one press away and
                draws `.rec-x` in full, which is why that class stays.

                `.rec-id` KEEPS ITS WRAPPER AROUND ONE CHILD, deliberately.
                `V.agent` and `V.booking` write the same three-class shape with
                the rating still inside it, and every §70.5 selector for this
                family is written `.app .rec-…` so the markup travels between
                the three. Collapsing it here would fork the block into two
                shapes to save one div. §75 is what re-lays the row. */}
          <div class="rec-top">
            <p class="rec-id"><span class="rec-who"><span class="rec-n">${a.n}</span>
                <span class="rec-v">${I.verified}</span></span></p>
            <p class="rec-r">${I.star}${a.r.toFixed(1)} &middot; ${a.ivs} interviews</p>
          </div>
          ${''/* THE TWO TAGS BECOME ONE SENTENCE — 581:6535 (Maryam, 31 Aug
                2026). The pair was "Your need: System Design" and "Priya's
                Strength: Architecture", two pills side by side, and the reader
                had to do the join themselves: the block stated a need, stated a
                strength, and left the fact that they are the SAME fact as an
                inference. 581:6539 says it — "Priya's Architecture strength
                perfectly matches your need for System Design." — which is the
                one claim the recommendation is actually making.

                IT IS DERIVED FROM `REC`, NEVER TYPED. `rec.strength` and
                `rec.need` are the same two strings the pills read, and the
                first name comes off the record, so pressing the swap cannot
                leave a sentence about Priya over Owen's photograph. Owen's
                reads "Owen's Incomplete Information strength perfectly matches
                your need for Decision Making" — clumsier than Priya's, and the
                alternative is a third hand-written string per agent in `REC`
                that could disagree with the two beside it.

                AND THE INK IS NO LONGER THE FILE'S, BECAUSE THE GROUND IS NOT
                WHITE ANY MORE. Two rounds of this note argued about #973177:
                §70.5 substituted `--mk-4` for it on the tag's #fbf1f9 pill
                (4.0:1, under AA at 14px) and the previous version restored the
                file's own value once the pill went, measuring 6.95:1 on white.
                On `--gray-100` the same magenta is 2.1:1 and neither answer
                survives. §63 sets the sentence in `--on-dark` — the plate's own
                discipline, where the title and the one thing worth reading are
                white and every supporting line is `--on-dark-2`. Three inks on
                a black card is a card with a highlighter on it.

                AND "DATA OVERLAP TAGS: 98% MATCH" IS GONE WITH THE PILLS
                (Maryam, 31 Aug 2026). It was the same fact as the sentence
                under it, stated as a number — and the sentence is the readable
                half: "98% match" needs the reader to know what was matched
                against what, which is exactly what the line beneath spells out.
                `rec.match` is untouched in the record and still has a reader,
                `SUMDROP.quiz`'s read in ai6, so nothing in the data goes dead —
                but `.rec-m` is now written by nobody, which is the "gate
                nothing writes" tell, so its two rules come out of §63 with it.
                `.rec-ov` keeps its wrapper: one child at the same 16px gap
                `.rec-b` already has, and the skeleton mirrors it. */}
          <div class="rec-ov">
            <p class="rec-why">${first}&rsquo;s ${rec.strength} strength perfectly matches your need for ${rec.need}.</p>
          </div>
          ${''/* THE FACT ROW CLOSES THE COLUMN (Maryam, 31 Aug 2026: "take the
                fee row at the end of the priya content"). It sat between the
                rating and the claim, which put the block's three KINDS in the
                wrong order: who she is, then what she costs, then why her — so
                the sentence the whole card exists to deliver was separated from
                the name it is about by three figures. Last, the column reads
                identity → claim → terms, and the terms sit directly above the
                Book button that acts on them.

                IT IS THE SAME ROW AND THE SAME RULES. `.rec-f` is a wrapping
                flex row (§70.5) and its position in a `column` flex is markup
                only, so nothing in §70 or §63 moves with it — which is also why
                `V.agent`'s copy needed no change: that block has no claim
                sentence, so the row was already its last child.
                THE FEE IS `AGENTS.priya.price` AND THE FILE SAYS $120.
                581:6479 is the one number on this block that contradicts the
                product: the record says $95, and so do the Agents page, the
                agent profile and the booking flow. A file's placeholder does
                not get to be the fourth price on one journey, so the record
                wins and the file's wording keeps it. Change `AGENTS.priya` if
                $120 is the real fee and all four surfaces move together. */}
          ${''/* THE FEE IS THE STRUCK PRICE, NOT "Next slot" (Maryam, 21 Sep 2026:
                "instead of the next slot show the price that is $120 Free for the
                first interview, cut the $120 so the user knows it is free"). The
                complimentary first interview shows the agent's price STRUCK with
                "Free" (`ivFeeLabel`, the same struck label the booking page uses)
                in the fee chip — so the "Complimentary" word AND the next-slot
                chip both go, leaving one clear free indicator beside the length.
                The price is `a.price` (the agent record, $95 for Priya — one
                price across every surface, per the note above); it reads "$120"
                only if the record does. A charged re-interview is unchanged:
                the fee, the length and the next slot. */}
          <p class="rec-f"><span>${I.wallet}${ivCharged(isRe)?a.price+' Interview Fee':ivFeeLabel(false, a.price)}</span>
            <span>${I.video}${rec.mins}</span>
            ${ivCharged(isRe)?`<span>${I.calendar}Next slot: ${a.slot}</span>`:''}</p>
        </div>
      </div>
      ${''/* ONE BUTTON AGAIN, AND IT IS NOT THE ONE THAT WAS HERE FIRST.

            THE HISTORY IS WORTH THE THREE LINES, because this slot has now held
            three different things and each change was an argument about what a
            recommendation IS. It began as Book plus a line of quoted italic text
            — "the recommendation was reasoned, so the way past it is to say why
            it is wrong, which is a thing you say to Tal". Then 583:6679 made the
            way past it an ordinary button, `View all agents`, on the reasoning
            that a reader who does not want Priya wants to SEE the other four
            rather than open a conversation about her. That is still true; what
            was wrong was the PLACEMENT. Book is what this card is for and View
            all agents is the way out of the section, so as a pair at the card's
            foot they read as two answers to one question. The second is in the
            heading row now (§75.2) and this slot holds the card's own action.

            SO `.rec-a`'S 382px IS GONE WITH IT. That width was 185 + 12 + 185,
            stated because the group had to be `flex:none` for §70.5's
            `margin-left:auto` to hold the right edge against a `flex:1 1 620px`
            block. One button needs no stated width and `auto` keeps the auto
            margin working, which is the whole of §75.3's change.

            THIS LEAVES THE 4.5s SKELETON WITH NO TRIGGER. `data-recswap` was
            the only thing that ever set `S.recBusy`, so `recSkeleton` (§70.5b,
            588:6781) is now unreachable — kept rather than deleted, because it
            is a designed state with a node behind it and re-homing the swap is
            a decision rather than a tidy-up. If it is not re-homed, that whole
            family is the "gate nothing writes" tell CLAUDE.md describes and
            should go: `recSkeleton`, `REC_MS`, `S.recBusy`, the `[data-recswap]`
            handler, §70.5b and §63's `.rec-alt` / `.rec-finding` rules.

            A `noAll` FLAG DROPPED THE QUIET BUTTON FOR ONE ROUND AND IS GONE.
            `V.interviews` drew this block over its own agent list, so "View all
            agents" was a link to the page it was already on; the flag answered
            that. That page no longer draws the block at all — the recommendation
            is a chip on the card (`agentCardH`) — so the flag had one caller and
            then none, which is the "mode nobody asks for" CLAUDE.md warns about.
            Both buttons are unconditional again. */}
      <div class="rec-a">
        <button class="btn btn-p btn-sm noic" data-go="agent:${recKey()}">Book call with ${first} ${I.arrowRight}</button>
      </div>
    </div>
  </div>`;
}

const QA_NEW = [
  {mk:() => pfRing(), t:'Complete Your Profile',
   d:'Set how you want to be seen.', go:'account', edit:() => pfFirstGap()},
  {ic:I.trophy,    hue:'ic-quiz', t:'Open Quiz Results',
   d:'Review your score and quiz performance.', modal:'quiz'},
  {ic:I.lightning, hue:'ic-prep', t:'Quick-Start Preparation',
   d:'Ask Tal to prepare you for the interview.', ask:'Prepare me for my level interview'}
];
const quickActions = (cards) => `<div class="sec sec-qa">
  <div class="sec-h"><h2>Quick Actions</h2></div>
  <div class="qa">${(cards || QA_NEW).map(c => `
    <button class="qa-c${c.mk ? ' qa-c-mk' : ''}" ${c.ask ? `data-tal-ask="${c.ask}"`
      : c.modal ? `data-quizmodal="${c.modal}"`
      : c.peek ? `data-peek="${c.peek}"` : `data-go="${c.go}"`}${c.disc?` data-disc="${c.disc}"`:''}${
      c.edit?` data-pfedit="${c.edit()}"`:''}>
      ${''/* A WRAPPER ROUND THE MARK AND THE TEXT WAS BUILT AND TAKEN OUT.
            `.qa-ring` has to be as tall as the block beside it, and the obvious
            way to say that is §75.3's — a two-column grid holding exactly those
            two, with `height:100%` and `aspect-ratio` on the mark. Measured, it
            settles at 80x80: the ring's width feeds the `auto` track, narrowing
            the text, wrapping it to a third line, growing the row, widening the
            ring. §111.1 has the full working and the stated height that answers
            it. The markup is therefore one flat row exactly as it was, and a
            `mk` card differs from an `ic` card by one element. */}
      ${c.mk ? c.mk() : `<span class="qa-ic ${c.hue}">${c.ic}</span>`}
      <span class="qa-b"><b>${c.t}</b><span>${c.d}</span></span>
      <span class="qa-go">${I.arrowRight}</span>
    </button>`).join('')}
  </div>
</div>`;

const AUTH_ART = `
<div class="auth-brand">
  <i class="auth-slide auth-slide-1" aria-hidden="true"></i>
  <i class="auth-slide auth-slide-2" aria-hidden="true"></i>
  <i class="auth-slide auth-slide-3" aria-hidden="true"></i>
  <span class="auth-logo" role="img" aria-label="TalentNext">${LOGO_SVG}</span>
  <div class="auth-intro">
    <h2 class="t-heading-01">Welcome to TALENTnext</h2>
    <p class="t-body-02 auth-lede">An AI-native platform that grows your leadership,<br>one level at a time.</p>
  </div>
  <div class="auth-foot-row">
    <p class="t-helper-01 auth-foot">&copy; 2026 TALENTnext Limited</p>
    <div class="auth-bars" aria-hidden="true"><span class="auth-bar auth-bar-1"></span><span class="auth-bar auth-bar-2"></span><span class="auth-bar auth-bar-3"></span></div>
  </div>
</div>
<i class="auth-mark" aria-hidden="true"></i>`;

const authId = (label, email, back) => `
  <div class="sec sec-id">
    <div class="auth-id">
      <span class="auth-id-l">${label}</span>
      <span class="auth-id-v">${email}${
        back ? `<a data-go="${back}">Not you?</a>` : ''}</span>
    </div>
  </div>`;

const LOGIN_ROLES = [['candidate','As Candidate'],['leader','As Cohort Leader'],['agent','As Talent Agent']];
const loginRoles = () => `
  <div class="sec sec-role">
    <div class="role-pick">
      ${LOGIN_ROLES.map(([k,l])=>`<label class="rad role-c${
        (S.role||'candidate')===k?' on':''}" data-lrole="${k}"><input type="radio" name="lrole"${
        (S.role||'candidate')===k?' checked':''}><span class="box"></span><span class="txt role-t">${l}</span></label>`).join('')}
    </div>
  </div>`;

const escHtml = s => String(s == null ? '' : s).replace(/[&<>"]/g,
  c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const LEGAL_VER = 'Version 3.2 &middot; Effective September 15, 2026 &middot; 4 min read';
const LEGAL_TABS = [['terms','Terms'],['privacy','Privacy'],['data','Data use'],['cookies','Cookies']];
const legalHead = t => `<div class="ph" style="padding-bottom:var(--s05)">
    <div class="ph-top"><h1 class="u-h2">${t}</h1></div>
    <p class="t-helper-01" style="color:var(--text-helper);margin-top:var(--s03)">${LEGAL_VER}</p>
  </div>`;
const legalAcc = items => `<div class="acc">${items.map(([ttl,body],i)=>
  `<div class="acc-i${i===0?' on':''}"><button class="acc-h"><span class="ttl">${ttl}</span><span class="chev">${I.chevDown}</span></button>
    <div class="acc-b"><p>${body}</p></div></div>`).join('')}</div>`;
const LEGAL_BODY = {
  terms: () => `${legalHead('Terms of service')}
    <div class="sec"><div class="note"><span>${I.info}</span><div class="nb"><b>The short version</b>TalentNext helps you get levelled, enrol on a course and track your progress. Use it as yourself, keep your sign-in safe, and these terms apply while you do.</div></div></div>
    ${legalAcc([
      ['1. Your account','You sign in through our identity provider and the account is yours to use. Keep your credentials safe. The email address you sign up with identifies your account for its whole life and cannot be changed.'],
      ['2. Using the service','Use TalentNext for your own leadership development. Do not misuse it, reach for another person&rsquo;s records, or disrupt the service for others.'],
      ['3. Payments','A first interview is complimentary. Later interviews and course enrolments are paid at the price shown before you pay, and your receipts are in Payments.'],
      ['4. Changes','We may update these terms. When a version changes materially you are asked to accept the new one at your next sign-in.']
    ])}`,
  privacy: () => `${legalHead('Privacy notice')}
    <div class="sec"><div class="note"><span>${I.info}</span><div class="nb"><b>The short version</b>We hold what you give us and what you do on the platform, use it to run your course and your level, and do not sell it.</div></div></div>
    ${legalAcc([
      ['1. What we hold','Your profile, your quiz result and band scores, your interviews and their reports, your course progress, and your payments. Card numbers are held by our payment processor, not by us.'],
      ['2. Why we hold it','To level you, recommend a course, run the 90 days and show you your own record. Tal reads your progress to help you with the material.'],
      ['3. How long','Interview recordings are kept for 24 months, then deleted. Payment records are kept for seven years to meet accounting obligations. The rest is held while your account is open.'],
      ['4. Your rights','You can read and edit your profile, read your reports and transcripts, and close your account at any time from Privacy Settings.']
    ])}`,
  data: () => `${legalHead('Data use notice')}
    <div class="sec"><div class="note"><span>${I.info}</span><div class="nb"><b>The short version</b>Your interview is recorded so your level can be set from it. TalentNext sets your level after the interview is analysed, and that decision is final.</div></div></div>
    ${legalAcc([
      ['1. What we record','Every interview and re-interview is recorded as video and audio, and transcribed so your level can be set from it. Recordings are stored for 24 months, then deleted. Your weekly cohort calls are not recorded.'],
      ['2. Who sees your interview','The agent who interviewed you, and the cohort leader who runs your course. Nobody else, unless you share your report yourself.'],
      ['3. Your level and who sets it','A talent agent interviews you. TalentNext then sets your level from that interview, after analysing it. At the end of each course a re-interview decides whether you move up, hold or drop back. That decision is final.'],
      ['4. Tal, your assistant','Tal can see your course progress, your chapter notes and your points so that it can help you with the material. Tal cannot see your one-to-one messages, your cohort calls, your payment details, or other candidates&rsquo; data.'],
      ['5. What we never do','We do not sell your data. We do not share your individual progress with an employer without your written instruction.'],
      ['6. Your controls','You can close your account at any time from Privacy Settings. Closing it removes your profile, your notes and your interview recordings; certificates you have already earned stay valid.']
    ])}`,
  cookies: () => `${legalHead('Cookie notice')}
    <div class="sec"><div class="note"><span>${I.info}</span><div class="nb"><b>The short version</b>We use only the cookies the platform needs to sign you in and keep you signed in. No advertising, and no third-party tracking.</div></div></div>
    ${legalAcc([
      ['1. Strictly necessary','These keep you signed in and remember your session. The platform does not work without them, so they are always on.'],
      ['2. What we do not use','No advertising cookies, no cross-site trackers, and no selling of any signal to a third party.']
    ])}`
};
function legalDoc(){
  const tab = S.legalTab || 'data';
  return `<div class="tabs">${LEGAL_TABS.map(([k,l])=>`<button class="${tab===k?'on':''}" data-legaltab="${k}">${l}</button>`).join('')}</div>
    ${LEGAL_BODY[tab]()}`;
}

const AUTH = {
login: () => `${authShell()}
<main class="main"><div class="page form-page authtight">
  ${''/* THE LOG-IN SCREEN, per Maryam's content (17 Sep 2026): a clean
        email + password sign-in reached from the Set Password CTA. It drops the
        role picker (`loginRoles()`) and the "Sign up" row that the older login
        carried — neither is in the supplied content — for a title, a sub-line,
        the two fields (placeholders, not pre-filled), a "Forgot Password?" link
        under the password, a "Remember me" box and one Log In button. `Log In`
        is the supplied casing (kept exactly). The button logs into the
        candidate dashboard (`data-loginas`). */}
  ${ph('Log In','Enter your details to sign in to your account.')}
  <div class="sec sec-rule">
    <div class="f"><label for="lem">Email Address</label>
      <input class="inp fill" id="lem" type="email" placeholder="Enter your email address"></div>
    <div class="f last"><label for="lpw">Password</label>
      <div class="pw-wrap"><input class="inp fill" id="lpw" type="password" placeholder="Enter your password">
        <button class="pw-eye" data-eye="lpw" aria-label="Show password">${I.view}</button></div>
      <p class="t-body-02 aux"><a data-go="forgot" style="color:var(--accent-text)">Forgot Password?</a></p></div>
  </div>
  <div class="sec sec-cbx">
    <div class="cbx-list">
      <label class="cbx"><input type="checkbox"><span class="box">${I.check}</span>
        <span class="txt">Remember me</span></label>
    </div>
  </div>
  ${''/* THE LOG IN BUTTON GOES TO THE TAL ONBOARDING PROTOTYPE (Maryam, 18 Sep
        2026), not the candidate dashboard — now THROUGH THE TN LOADER (Maryam,
        4 Oct 2026: "on clicking login, before going to onboarding screen i need
        a loader screen first"). `data-loadgo="onboard"` runs the load convention:
        it paints the three-blade `.tn-loader` for 2s on the onboard stage, then
        the onboarding welcome arrives. It REPLACES the plain `stage:onboard`
        `go()`; `data-loginas` (sign-straight-into-a-portal) was already retired. */}
  <div class="sec sec-act">
    <div class="foot-row foot-stack"><div><button class="btn btn-p btn-full" data-loadgo="onboard">Log in ${I.arrowRight}</button></div></div>
    ${''/* SIGN-UP ROW (Maryam, 22 Sep 2026): a closing line below the button.
          "Sign up" is the accent as ink (--accent-text), semibold (the platform's
          strong weight, 500) and underlined; the lead-in is the secondary grey.
          NAVIGATION (Maryam, 22 Sep 2026): "Sign up" opens the get-started page on
          the external site in a NEW TAB — a real href + target=_blank (rel
          noopener), NOT a data-go route, because it leaves the prototype for
          another origin. Inline styles follow the "Forgot Password?" precedent
          above (hifi-only markup, no layer). */}
    <p class="auth-alt" style="text-align:left;color:var(--text-secondary);margin-top:24px">New to TALENTnext? <a href="https://web-puce-six-27.vercel.app/new/get-started" target="_blank" rel="noopener" style="color:var(--accent-text);font-weight:var(--t-w-strong);text-decoration:underline">Sign up</a></p>
  </div>
</div></main>`,

forgot: () => `${authShell('login')}
<main class="main"><div class="page form-page">
  ${ph('Reset Password','Enter your email address to receive password reset instructions.')}
  <div class="sec">
    <div class="f last"><label for="fem">Email address</label>
      <input class="inp fill" id="fem" type="email" value="maryam.naz@tkxel.io"></div>
  </div>
  ${''/* CONTINUE HAS A LOADING BEAT (Maryam, 18 Sep 2026; 27 Sep 2026). `data-send`
        swaps the button to "Sending..." and disables it, then advances after a
        short pause — the handler mutates the button and does NOT render() in the
        interval, so the loading label survives the wait (trap 9 only bites a
        re-render). The verification-code step is HIDDEN (Maryam, 27 Sep 2026):
        the flow is forgot -> (Sending...) -> reset, straight to Set New Password;
        `fcode` (and the old `sent` "Check your email") stay defined but off the
        path. */}
  <div class="sec">
    <button class="btn btn-p btn-full" data-send="reset">Continue ${I.arrowRight}</button>
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

fcode: () => `${authShell('forgot')}
<main class="main"><div class="page form-page">
  ${ph('Enter Code','We sent a 6-digit code to your email.')}
  <div class="sec sec-rule">
    <div class="sec-h" style="margin-bottom:var(--s06)"><h2 class="u-h2">Verification Code</h2></div>
    <div class="otp">${[0,1,2,3,4,5].map(i=>`<input value="" size="1" inputmode="numeric" maxlength="1" aria-label="Digit ${i+1}">`).join('')}</div>
  </div>
  ${''/* THE RESEND LINE SITS BELOW THE BUTTON (Maryam, 18 Sep 2026), not beside
        it — so this is plain block flow, NOT `.foot-row` (which lays the action
        and the way-out side by side on desktop). Verify Code full width, the
        resend line under it. */}
  <div class="sec sec-act">
    <button class="btn btn-p btn-full" data-go="reset">Verify Code ${I.arrowRight}</button>
    <p class="t-body-02 mt5" style="color:var(--text-secondary)">Didn't receive code? <a data-go="fcode">Resend</a></p>
  </div>
</div></main>`,

reset: () => `${authShell('login')}
<main class="main"><div class="page form-page">
  ${''/* THE FORGOT-FLOW LANDING (Maryam, 18 Sep 2026): heading "Set New
        Password", a short desc, no `.pw-rules` checklist, one "Update Password"
        CTA and no "Back to log in" closing row. The create screen owns the
        pre-filled/pre-ticked composition; this one is stripped to the two
        fields and the button. */}
  ${ph('Set New Password','Create a strong password for your account.')}
  <div class="sec">
    <div class="f-row"><div class="f"><label for="rpw">Password</label>
      <div class="pw-wrap"><input class="inp fill" id="rpw" type="password" value="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
        <button class="pw-eye" data-eye="rpw" aria-label="Show password">${I.view}</button></div></div>
    <div class="f last"><label for="rpw2">Confirm Password</label>
      <div class="pw-wrap"><input class="inp fill" id="rpw2" type="password" placeholder="Re-enter password">
        <button class="pw-eye" data-eye="rpw2" aria-label="Show password">${I.view}</button></div></div></div>
  </div>
  <div class="sec">
    <button class="btn btn-p btn-full" data-go="login">Update Password ${I.arrowRight}</button>
  </div>
</div></main>`,

create: () => `${authShell()}
<main class="main"><div class="page form-page authtight">
  ${ph('Set New Password','Create a strong password for your account.')}
  ${authId('Your Email Address', 'maryam.naz@tkxel.io', 'login')}
  <div class="sec sec-rule">
    <div class="f-row"><div class="f"><label for="pw">Password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw" type="password" value="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
        <button class="pw-eye" data-eye="pw" aria-label="Show password">${I.view}</button></div>
      ${''/* THE THREE RULES CAME OFF THIS SCREEN (Maryam, 31 Aug 2026), AND
             OFF THIS SCREEN ONLY. `AUTH.reset` draws the same `<ul class=
             "pw-rules">` and keeps it: there the reader is CHOOSING a password
             and the list is the specification they are choosing against. Here
             the field arrives pre-filled with twelve dots and two of the three
             already ticked, so the list is a checklist for work the prototype
             has done — three rows of chrome between the password and the
             confirm field, on the one screen whose whole job is to be short.

             `.pw-rules` KEEPS ITS RULES in §02, §11, §12, §14 and §17 because
             it keeps a writer. This is not the "gate nothing writes" case —
             grep before deleting any of them. */}
      </div>
    <div class="f last"><label for="pw2">Confirm Password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw2" type="password" placeholder="Re-enter password">
        <button class="pw-eye" data-eye="pw2" aria-label="Show password">${I.view}</button></div></div></div>
  </div>
  <div class="sec sec-cbx">
    ${''/* THE TWO REQUIRED CONSENTS START UNCHECKED and gate the CTA: §17's
          `.form-page:has(.cbx-req input:not(:checked)) … .btn-p` greys and
          disables Set Password until BOTH `.cbx-req` boxes are ticked. Native
          checkboxes, so `:has()` re-reads live on each toggle with no render —
          nothing here keeps state in the DOM (trap 9), the checkbox IS the
          state. The optional marketing box was removed (Maryam 1 Oct 2026). */}
    <div class="cbx-list">
      <label class="cbx cbx-req"><input type="checkbox"><span class="box">${I.check}</span>
        <span class="txt">I accept the <a data-go="terms">Terms of Service</a> and <a data-go="terms">Privacy Policy</a>.</span></label>
      <label class="cbx cbx-req"><input type="checkbox"><span class="box">${I.check}</span>
        <span class="txt">I consent to my interviews being recorded and transcribed.</span></label>
    </div>
    </div>
  <div class="sec sec-act"><div class="foot-row foot-stack"><div class="mt6"><button class="btn btn-p btn-full" data-go="login">Set Password ${I.arrowRight}</button></div></div>
  </div>
</div></main>`,

terms: () => `${authShell('create')}
<main class="main"><div class="page" style="padding-bottom:0">
  ${''/* ONE SOURCE — `legalDoc()`. The four tabs switch on `S.legalTab` and the
        Data use notice is aligned to the product (no pause-Tal / level-review /
        download-everything promises). The signed-in copy of this is in the
        Privacy Settings tab (`pfPrivacy`). */}
  ${legalDoc()}
  <div class="sec"><button class="btn btn-g noic" style="padding-left:var(--s04)">${I.download} Download as PDF</button></div>
</div></main>
<div style="flex:none;border-top:1px solid var(--border-subtle-01);display:flex;gap:1px">
  <button class="btn btn-s noic" data-go="create" style="flex:1;max-width:none;justify-content:center">Back</button>
  <button class="btn btn-p noic" data-go="create" style="flex:1;max-width:none;justify-content:center">Accept</button>
</div>`,

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
    <div class="mt6"><button class="btn btn-p btn-full" data-go="stage:onboard">Verify &amp; Continue ${I.arrowRight}</button></div>
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

const V = {};

const COHORT_COURSE = 'Communicating with Impact';

const preStartBlock = (f) => {
  const till = cohortStartTill(f);
  const dateStr = f.cancelled ? '12 Mar 2026' : 'Monday, 18 August 2026';
  const coh = f.cancelled ? 'Cohort 47' : 'Cohort 41';
  return `<div class="sec sec-call dark-card crow-dark">
    <div class="dc-hd">
      <div class="dc-hd-r"><h2 class="dc-t">You&rsquo;re enrolled on ${coh}</h2>
        <span class="dc-when">${I.time}Starts in <span class="start-timer" data-starttill="${till}" style="font-variant-numeric:tabular-nums">${startFmt(till - Date.now())}</span></span></div>
    </div>
    <div class="crow">
      <div class="crow-who">
        <span class="crow-ph"><img src="${COHORT_LEAD.img}" alt="" loading="lazy" onerror="this.style.display='none'"></span>
        <div class="crow-b">
          <p class="crow-id"><span class="crow-n">Priya Nair</span><span class="crow-v">${I.checkFilled}</span></p>
          <p class="crow-role">Cohort leader</p>
          <p class="crow-x">${COHORT_COURSE} &middot; starts ${dateStr}</p>
        </div>
      </div>
      <div class="crow-a crow-a1">
        <button class="btn btn-sm noic" data-go="cohort">Meet your cohort ${I.arrowRight}</button>
      </div>
    </div>
  </div>`;
};

V.dashboard = (f) => {
  let body = '';
  if(S.stage==='consult') body = `
    ${dashPh('Hi Maryam','Explorer track &middot; quiz 64 of 100 &middot; no level yet')}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Welcome in, your result is saved</h3></div>
        <div class="ai-body"><p>Your quiz put you on the <b>Explorer track</b> from a score of 64. Jordan&rsquo;s call on Thursday is a 15-minute check-in, peer to peer, not an assessment. Nothing to prepare, and it does not set your level.</p></div>
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
      <div class="plate" data-when="${CONSULT_CALL.when}">
        <div class="plate-who">${avatar(CONSULTANT,56)}
          <span class="plate-wb"><b>${CONSULTANT.n}</b><span>Talent consultant &middot; screens Explorer candidates</span></span>
        </div>
        <div class="plate-t">Your consultant call</div>
        <div class="plate-b">Thursday, August 13 at 2:00 PM ET &middot; 15 minutes, online</div>
        ${''/* THE PLATE'S JOIN IS GATED TOO, AND IT IS THE ONE THAT WAS ALREADY
               DEAD. Maryam, 3 Sep 2026 — "in cards where the time left in the
               call is more than a minute, show a grey disabled join call
               button if it's in orange" — and `crow`'s note is the argument.
               This button is the second orange Join in the build and the only
               one outside that component; it carries no `data-call`, so
               pressing it has never done anything, which is §60's "dead
               control on a live surface" with nothing saying so. The gate is
               what says so.

               §81 HAD TO GROW A SECOND HOST FOR IT. That layer states the
               unlit ground on `.dark-card`, and a `.plate` is the OTHER black
               card — §19's `.app .plate .btn-p` is what makes this button the
               accent gradient, at (0,3,0). §81.2 restates the pair at (0,4,0)
               and §63 §20 the ink; without them `disabled` on this button is
               invisible, which is the exact failure §81's head describes.

               `data-joinwhen` GOES ON IT SO `joinArm` OWNS IT TOO — the 20s
               timer writes `disabled` and the `title` in place on every gated
               button in the product, and a button gated only at render would
               stay shut through the minute its call opened. */}
        <div class="plate-a">
          <button class="btn btn-p btn-sm noic" data-joinwhen="${CONSULT_CALL.when}" data-joinmins="${CONSULT_CALL.mins}"${
            joinLive(CONSULT_CALL.when, CONSULT_CALL.mins) ? '' : ` disabled title="${joinShut(CONSULT_CALL.when)}"`}>Join ${I.video}</button>
          <button class="btn btn-sm noic plate-b2" data-go="interviews">Add to calendar</button>
        </div>
        <div class="plate-x">
          <b>What to expect</b>
          <p>An initial screening, and a relaxed one &mdash; peer to peer, not an assessment. Jordan asks where you are and what you are after. It does not set your level: that comes later, from an agent interview, if you choose to go further.</p>
        </div>
      </div>
    </div>
    ${''/* THE QUIZ BLOCK STOOD HERE AND DOES NOT ANY MORE — the argument is
          the note where `quizResults` used to be defined. "How this works"
          directly under the plate is the better neighbour for it anyway: the
          first thing that accordion says is that the quiz gives you a title,
          which is the one of the four figures this page still needs. */}
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
    ${dashPh('Welcome back, Maryam!','Explorer track &middot; quiz 64 of 100 &middot; no level yet')}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>You&rsquo;re on the <b>Explorer track</b> from a quiz score of 64, but you have no level yet. That comes from a 45-minute interview. Three agents have a slot this week, $80 to $95.</p></div>
      </div>
    </div>
    ${talRec()}
    ${quickActions()}`;

  else if(isBooked(S.stage)) body = `
    ${dashPh('Welcome back, Maryam!','Explorer track &middot; interview 20 August &middot; no level yet')}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>Your interview with <b>Priya</b> is in 6 days. Delegation is the question she asks most often. Ten minutes of practice is usually enough. Your quiz scored 64; the interview is what sets your actual rung.</p></div>
      </div>
    </div>
    ${''/* THE INTERVIEW IS THE SAME ROW THE WEEKLY CALL DRAWS — see `CALL_ROW`.
          It was a black `.plate` here and a `.crow` on the enrolled dashboards,
          which is one appointment drawn two ways. Not a `.head-sec`: this
          band's second column is the journey (§70.3), so the row is the first
          section of the page body.

          AND IT IS THE BLACK CARD, IN THE SAME SLOT AND UNDER THE SAME HEADING
          AS `talRec` ONE STAGE EARLIER (Maryam, 31 Aug 2026). That is the whole
          argument: on `new` the page's next step is "book an interview" and it
          is `talRec`; here the next step is "join the interview you booked", it
          sits in the identical position — directly after Tal's card, before the
          body — and it was a white row. One slot, one object.

          THE HEADING IS BYTE-IDENTICAL to `talRec`'s, cased as that one is. The
          two are the same sentence about the same thing at two stages, so a
          reader moving from one to the other should see the card change and not
          the words above it.

          NO CONTROL ON THE HEADING ROW, WHICH `.dc-hd-r` ALLOWS. `talRec` puts
          "View all agents" there because the recommendation is one of five and
          the way out belongs to the section. A booked interview is not one of
          anything — Reschedule is on the row itself, where it is an action on
          THIS appointment rather than a way past it. `.dc-hd` holds one child
          here and two there.

          `.dark-card` AND `.crow-dark`, and the split is the point: everything
          about the card is §75's and everything about this row inside it is
          §77's. §75's own note is where the recipe is listed.

          THE COUNTDOWN IS IN THE HEADING ROW AND THE 182px CELL IS GONE
          (Maryam, 31 Aug 2026). §71.1 argued that cell as "the row's only
          ground" — one tinted band holding the one figure that changes by
          itself — and that argument was about a row standing on a white page,
          where a ground is the only way to set a figure apart. Inside a card
          the heading row is already the place a card says what it is ABOUT, and
          `.dc-hd-r`'s right-hand slot is already load-bearing on `talRec`
          ("View all agents"). So the time takes the slot and the cell goes,
          which also puts the portrait back on the card's own spine.

          `.dc-when`, NOT `.dc-act`, AND THEY ARE NOT INTERCHANGEABLE. The slot
          holds one or the other: `.dc-act` is a control — a way out of the
          section — and this is a fact about the thing below it. Same position,
          same ink, different element and no `data-go`; a `<span>` that looked
          like the button beside it on the other card would be the worst of both.

          THE STRING IS `callLeft(CALL_ROW.iv().when)` AND NOT A LITERAL, which
          is what stops the head and the row disagreeing about the same
          appointment — the failure `bkStamp` exists to prevent for six prose
          mentions of the booking. `CALL_ROW.iv` is read twice on this page and
          both reads are derived. */}
    <div class="sec sec-call dark-card crow-dark">
      <div class="dc-hd">
        <div class="dc-hd-r"><h2 class="dc-t">Your Next Step - Interview</h2>
          <span class="dc-when">${I.time}${S.stage===RESCHED?"In 2 days":callLeft(CALL_ROW.iv().when)}</span></div>
      </div>
      ${crow('iv', {when:false, second:false})}
    </div>
    ${''/* THE SESSION BLOCK IS TWO QUICK ACTIONS NOW (Maryam, 1 Sep 2026:
          "change the content beneath the black card into 2 quick actions").
          What stood here was one `.sec` running ~640px under the black card: a
          lede, a four-cell `.stats` strip (Length, Format, Your report, Fee)
          and "What to bring" as three numbered sentences.

          THIS IS §82'S MOVE, ONE STAGE EARLIER, AND THE ARGUMENT CARRIES OVER
          UNCHANGED. That layer turned the `assessed` and `promoted` dashboards'
          reading blocks into Quick Actions on the reasoning that a dashboard
          states where you are and offers the ways on, while the READING belongs
          on the page that owns it. Everything in the strip was a fact about an
          interview that has a whole module — `V.interviews` opens on
          "45 minutes, by video · recorded · sets your level", which is this
          block's four cells said once — and the section's own head row already
          carried an "Interview details" button pointing there. A section whose
          heading row links to the page that says the same thing better is a
          section arguing for its own removal.

          SO THE TWO CARDS ARE THE TWO THINGS IT HELD, and neither loses a
          reader: the session's shape goes to `V.interviews` by `go`, and "what
          to bring" goes to Tal by `ask`, which is a better home than a list of
          three fixed sentences — `wPrep` runs the questions rather than
          printing them, and data.js's `/prepare/` route is already the one the
          `new` dashboard's own second card fires.

          THE PAGE IS NOW THE §82 SHAPE ON EVERY PRE-COURSE STAGE: the band,
          one black card, two Quick Actions. `new`, `booked`, `assessed` and
          `promoted` all read the same way, which is what §70.6's named hues
          were for — `ic-cover` and `ic-prep` mean the same thing on each.

          NO FIGURE IS RESTATED AND THAT IS DELIBERATE. The old strip typed
          "45 minutes", "48 hours" and "From $80" into this view; the fee in
          particular was the RANGE ("from $80") because `bkStamp` cannot reach a
          number, and it sat two inches under a black card naming the actual
          agent. A card description that names no figure cannot drift from the
          page it opens — which also retires this view's last dependence on the
          "your agent, not Priya" rule the old note had to state.

          WHAT IS GENUINELY GONE is the three "what to bring" sentences as
          standing copy. They are Maryam's words and they are worth keeping, so
          they are NOT deleted — `wPrep` is where the same ground is covered,
          and the card's own `ask` is what opens it. If they should be on the
          page again, they are a Tal card (`PAGESUM` owns the head, so a `.sec`
          with an `.ai-aura` under the cards), not a numbered list. */}
    ${quickActions([
      {ic:I.video, hue:'ic-cover', t:'Your session, step by step',
       d:'How 45 minutes interview will set your level', go:'interviews',
       disc:'how'},
      {ic:I.lightning, hue:'ic-prep', t:'What to bring',
       d:'Ask Tal what to have ready for the call.',
       ask:'What should I prepare for my level interview?'}
    ])}`;

  else if(S.stage==='held') body = `
    ${dashPh('Welcome back, Maryam!','Explorer track &middot; interview held &middot; report within 24 hours')}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>Your interview with <b>Priya</b> is done. It is being analysed now, and <b>TalentNext sets your level</b> from it within 24 hours. There is nothing to do but wait.</p></div>
      </div>
    </div>
    ${''/* THE INTERVIEW THAT HAPPENED, IN THE SAME BLACK CARD SLOT `booked` USES
          (Maryam, 18 Sep 2026: "show a black card above quick actions and show
          the talent agent and interview details that happened and show a timer
          for results within 24 hours"). One stage earlier the identical card
          held the countdown to the call in `.dc-when`; here the call is over, so
          the row drops its Join (`join:false`) and the countdown becomes the
          24-hour results clock. Same recipe as `booked` — §75's `.dark-card`,
          §77's `.crow-dark`, the agent read off `CALL_ROW.iv()` so it cannot
          disagree with who was booked — and `.dark-card` is not in `DARK_CARD`,
          so it stays in the body above Quick Actions rather than being hoisted.

          THE CLOCK IS `heldArm`'s, and it is `joinArm`'s pattern exactly: a
          fixed deadline in `S`, a 1s interval that writes the remaining time in
          place from `Date.now()` (never rAF — trap 17), so a background tab
          simply repaints with the right figure and a `render()` recomputes the
          same string it wrote. */}
    <div class="sec sec-call dark-card crow-dark">
      <div class="dc-hd">
        <div class="dc-hd-r"><h2 class="dc-t">Your interview is complete</h2>
          ${heldOverdue()
            ? `<span class="dc-when">${I.time}Taking a little longer than usual</span>`
            : `<span class="dc-when">${I.time}Results in <span class="held-timer" data-heldtill="${heldTill()}" style="font-variant-numeric:tabular-nums">${heldFmt(heldTill() - Date.now())}</span></span>`}</div>
      </div>
      ${crow('iv', {when:false, second:false, join:false})}
    </div>
    ${quickActions([
      {ic:I.lightning, hue:'ic-prep', t:'What happens next',
       d:'How your report and level are decided.',
       ask:'What happens now that my interview is done?'},
      {ic:I.video, hue:'ic-cover', t:'Your interview',
       d:'The recording your report is built from.', go:'interviews'}
    ])}`;

  else if(S.stage==='assessed') body = `
    ${dashPh('Welcome back, Maryam!','Explorer Track &ndash; E3 &middot; level 3 of 15 &middot; not enrolled yet')}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>You were confirmed at <b>E3, rung 3 of 15</b> after your interview. Your growth areas are chapters 4 and 12. The next cohort starts within two weeks; enrolling locks in your spot and your price.</p></div>
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
    ${''/* FULL WIDTH AND WHITE ON THIS STAGE — `enrolOffer`, not `enrolPlate`.
          The long argument is over that function; the short one is that this
          page's whole job is the enrolment, so the offer is the page's second
          block rather than a card in the head band's column. `promoted` keeps
          the plate, where the offer sits beside a certificate. */}
    ${enrolOffer('E3')}
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
    ${''/* AND THE LAST TWO SECTIONS BECOME TWO QUICK ACTIONS — Maryam,
          31 Aug 2026, "change the What the 90 days cover and What the
          interview found in quick actions, just like we are using".

          THIS IS §79'S MOVE ON A SECOND PAGE AND THE ARGUMENT IS ITS ARGUMENT.
          There, the pulse's three columns became three Quick Actions on the
          reasoning that "nothing on the dashboard states a figure any more;
          the dashboard states what to do about it". This page had the same
          shape one stage earlier: 528px of chapter preview and Priya's whole
          write-up, both of them a READING, under a card whose job is a single
          decision. What is left is the band, the offer, and two ways in.

          ONE CARD PER SECTION, AND EACH GOES WHERE THAT SECTION'S DETAIL
          LIVES — §79's rule, which is what makes this a move rather than a
          deletion. The preview's own head action was already "See the full
          course" pointing at `V.enrol`, which draws all thirteen; the
          disclosure's was already "Read the full report" pointing at
          `V.report`, which is Priya's write-up in full. Both cards inherit
          those exact destinations, so nothing on this page has become
          unreachable and no route is new.

          THE HUES ARE THE ONES THE TWO BLOCKS ALREADY WORE, per §70.6's rule
          that a Quick Action's hue is NAMED and never cycled: violet is
          `.cov-pill`'s "Curated for your growth" (§63 §13 picks `--mk-3` for
          it) and blue is §74's hue for Priya's note, the third of the three
          finding cards. A reader who knew the preview as the violet block
          finds it violet as a card. §81.5 states both.

          THE DESCRIPTIONS ARE READ, NOT TYPED, which is `pulseQA`'s rule:
          `CH.length` is the chapter count, so a chapter added to the course
          moves this card. The second card names no DATE deliberately — the
          block it replaces said "signed 21 August" while `signedSummary`'s own
          header says "20 August 2026", a pre-existing disagreement this must
          not spread to a third surface. Both dates are on `V.report`. */}
    ${''/* BOTH DESCRIPTIONS ARE MARYAM'S COPY (1 Sep 2026), and each drops a
          clause the card did not need.

          THE COUNT IS STILL DERIVED. The ask was "13 Chapters, weekly live
          cohort calls" with the number typed; `${CH.length}` is kept, because
          the one thing the previous note promises is that "a chapter added to
          the course moves this card" and a literal 13 breaks it silently. The
          rendered string is identical today.
          Sentence case on "chapters" is §63's rule, which is why the C is not
          capital — the only word of the ask this does not take verbatim.

          "one a week, with a live cohort call" -> "weekly live cohort calls".
          The cadence was said twice, once per clause: thirteen chapters at one
          a week IS thirteen weeks, and the call is weekly for the same reason.

          THE SECOND CARD STOPS NAMING PRIYA, which is the `booked` section's own
          "your agent, not Priya" rule arriving one stage later. `bkStamp` (ai7)
          rewrites the hand-written mentions of the booked agent so a booking
          made inside Tal reads back correctly, and its note says a new surface
          naming the agent has to be added there — this one now needs no entry
          and cannot go stale. "on interview" also keeps the card free of the
          date disagreement the note above records. */}
    ${quickActions([
      {ic:I.book, hue:'ic-cover', t:'What the 90 days cover',
       d:`${CH.length} chapters, weekly live cohort calls`, go:'enrol'},
      {ic:I.document, hue:'ic-found', t:'What the interview found',
       d:'Write-up by the agent on interview', go:'report'}
    ])}`;

  else if(f.complete) body = `
    ${dashPh('Welcome back, Maryam!','Explorer Track &ndash; E4 &middot; level 4 of 15 &middot; Cohort 41 closed')}
    ${''/* THIS PAGE FOLLOWS THE `assessed` DASHBOARD — Maryam, 31 Aug 2026:
          "the Promoted to E4 prototype is similar to the Leveled, not enrolled
          prototype, so you need to follow that dashboard ui here."

          THE NOTE BELOW ALREADY SAID THE TWO WERE THE SAME PAGE and only got
          half way: "This page IS the `assessed` page again, one level up. Both
          stages are the same moment — a level has just been confirmed and a
          course has not been started." What it then copied was the two BLOCKS;
          what it did not copy was the SHAPE, because at the time there was no
          shape to copy. There is now, and it is three things:

            the band's second column   `jrnList`, where `enrolPlate` used to be
            the offer                  a full-width `.dark-card`, not a plate
            the two reading blocks     two Quick Actions

          WHAT DELIBERATELY DOES NOT FOLLOW, because `assessed` has no
          equivalent and inventing one would be designing rather than matching:
          "Cohort 41, in the end" (a closing figure strip with the score card),
          "What changes at E4" (two offers that are already actions with their
          own buttons), and the certificate. All three are this stage's own
          content and are untouched. */}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>You moved from <b>E3 to E4</b> in 90 days: 13 chapters, ${f.avg}% average, ${f.mins.toLocaleString()} minutes of coursework. E4 opens December 1 with a new cohort. Delegation and coaching, your two growth areas, are chapters 3 and 9.</p></div>
        ${''/* THE LADDER WING CAME OUT OF TAL'S CARD (Maryam, 1 Sep 2026:
               "remove the where you are on the ladder section from the tal
               summary section"). It was `<div class="stp-wing">${'$'}{wingBlock()}
               </div>` — `ladderWing`, the third of §56's three wing states: the
               heading, "Explorer &ndash; E4", "4 of 15 on the ladder" and the
               fifteen-block rail.

               THE PAGE SAYS ITS LEVEL FOUR OTHER TIMES, which is what makes this
               a subtraction rather than a loss: `dashPh`'s fact row is
               "Explorer Track &ndash; E4 &middot; level 4 of 15", the app bar
               reads "Explorer &ndash; E4", the journey list's first row is "E4
               &middot; signed by Priya, Nov 21", and Tal's own sentence directly
               above says "You moved from E3 to E4". The rail was the only one of
               the five that drew the ladder, and My Level is one press away with
               the full fifteen rungs and the tracks under them.

               WHAT IT LEAVES BEHIND, flagged rather than swept: `wingBlock()`'s
               `f.complete` branch was `ladderWing`'s only caller, so that
               function and §59's `.wing-lvl` hooks are now a gate nothing
               writes. They are NOT deleted here — `wingBlock`'s three states are
               §56's documented contract and `.wing-lvl` ships in
               `design-system/talentnext-ds.css`, so pruning it is a design-system
               decision rather than a side effect of moving one block on one
               page. `consult` still calls `wingBlock()` for `stepper()`. */}
      </div>
    </div>
    ${''/* THE OFFER IS THE BLACK CARD, NOT THE PLATE — and this is the change
          that empties the band's second column, which is why `jrnList` is
          written above. `enrolOffer` is a `.dark-card` and `.dark-card` is NOT
          in ai5's `DARK_CARD`, so `placeDark` leaves it in the page body where
          it spans the full width; `enrolPlate` was a `.plate`, which that pass
          hoists into §56's column two.

          §73 SAID THIS FUNCTION HAD TO STAY AND THE REASON HAS EXPIRED. Its
          note reads: "Taking `.plate` off would empty that column on a page
          this brief does not touch." The brief touches it now, and the column
          is filled by the journey list rather than left empty — so the one
          thing that argument was protecting is answered, and `enrolPlate` is
          deleted rather than kept as a second way to draw one offer.

          THE CERTIFICATE'S `.keep-place` STILL EARNS ITS KEEP. Its own note
          says the opt-out exists because "the band already holds the enrolment
          plate" — that clause is stale, but the conclusion is not: `.cert` is
          in `DARK_CARD`, so without `.keep-place` it would now be hoisted into
          the column the journey list occupies. One dark card per page still
          holds; the certificate is simply no longer the second one. */}
    ${''/* THE CERTIFICATE NOTICE SITS UNDER THE BLACK CARD (Maryam, 2 Sep 2026:
          "take the badge banner below the black card, wherever it is above the
          black card take it below"). It was above it — 1 Sep 2026, "take the
          banner above the black card" — and the two asks are a week apart on
          the same strip, so what follows is why the second one is an
          improvement rather than a reversal.

          THE BANNER IS THE PAST AND THE CARD IS THE NEXT STEP. Both readings
          are defensible and the first note argued the other one ("a dismissible
          strip at the head says 'that is closed, here is what is next' and then
          gets out of the way"). What settles it is which of the two the page is
          FOR: this dashboard's job is the E4 enrolment, and the offer is the
          only thing on it with a decision in it. A notice about a course that
          finished should not be the first object under the summary on the page
          that is selling the next one.

          THE STRIP IS STILL DISMISSIBLE, so the reader can close what they have
          already read; that is what the cross is for and it is unchanged.

          AND THE OFFER IS WHAT STOPS `placeBand`'s RUN NOW. The pass walks
          forward from the `.ph` taking Tal's card, the ask line and declared
          `.head-sec`s; a `.sec.dark-card` holding `enrolOffer` is none of those,
          so the run ends there instead of at the banner. The band is
          unaffected either way — it has been one column on this page since the
          plate left it. `.dark-card` is also not in ai5's `DARK_CARD`, which is
          §75's whole point and the reason the offer can be a page child at all.
          `certBanner`'s own note is the rest of the argument. */}
    ${enrolOffer('E4')}
    ${certBanner(f, {close:true, key:'dash'})}
    ${''/* AND THE TWO READING BLOCKS ARE THE SAME PAIR OF QUICK ACTIONS
          `assessed` DRAWS, one level up — §79's move, and the note on that
          page is the argument. What was here was the full thirteen-chapter
          `.ch-two` list and Priya's whole re-interview write-up: about 900px
          of reading between the offer and the closing figures, on a dashboard
          whose job is to say what to do about them.

          THE DESTINATIONS ARE THE HEAD ACTIONS THESE SECTIONS ALREADY HAD, so
          nothing is unreachable and no route is new: "See the full course"
          pointed at `V.enrol`, which draws all thirteen chapters, and "Read
          the full report" at `V.report`, which is the write-up in full. The
          hues are `assessed`'s, so a reader who has seen that page finds the
          same two cards in the same two colours a stage later.

          THE WORDS DIFFER BY ONE THING AND IT IS THE RIGHT ONE: this stage's
          report is the RE-interview's (`signedSummary(true, true)`), so the
          card says so. The chapter count is read from `CH`.

          AND THEY FOLLOW `assessed`'S REWRITE (Maryam, 1 Sep 2026), WHICH IS
          NOT SCOPE CREEP BUT THE RULE THIS PAIR EXISTS UNDER. The ask named the
          `assessed` cards; §82's whole point is that these two pages carry "the
          same two cards in the same two colours a stage later", so leaving this
          copy behind would have the two dashboards describe one course in two
          registers — "13 chapters, weekly live cohort calls" on one page and
          "13 chapters at E4, one a week, with a live cohort call" on the next.
          That is the drift the pairing was written to prevent.

          THE TWO DELIBERATE DIFFERENCES SURVIVE INTACT: `at E4`, because this
          stage's course is the level up, and `re-interview` in both the title
          and the description, because that is the report this page links to.
          Everything else is byte-identical to `assessed`. */}
    ${quickActions([
      {ic:I.book, hue:'ic-cover', t:'What the 90 days cover',
       d:`${CH.length} chapters at E4, weekly live cohort calls`, go:'enrol'},
      {ic:I.document, hue:'ic-found', t:'What the re-interview found',
       d:'Write-up by the agent on re-interview', go:'report'}
    ])}
    ${''/* TWO SECTIONS CAME OFF THE FOOT OF THIS PAGE (Maryam, 1 Sep 2026:
          "remove the Cohort 41, in the end section" and "remove the What
          changes at E4 section"). §82's note listed them as the three things
          `promoted` deliberately did NOT convert to Quick Actions, "because
          `assessed` has no equivalent and inventing one would be designing
          rather than matching". That reasoning was about not INVENTING a card
          for them; removing them outright is the other way to close the same
          gap, and it leaves the page at exactly `assessed`'s shape — the band,
          the offer as a black card, two Quick Actions — plus the two things
          this stage genuinely owns, the points strip and the certificate.

          "COHORT 41, IN THE END" WAS TWO BLOCKS IN ONE `.sec` AND BOTH GO, which
          is worth stating because only the first carries the heading: a `.stats`
          row of four cells (Chapters 13/13, Average 87%, Points 3,205, Level
          E3 → E4) AND, under it, the `.score-link` wrapping `scoreCard` — the
          Points 3,205 / 1-Star / "1,795 points to Silver" block, which reads on
          screen as a section of its own and is not one. Taking the section takes
          both.

          NOTHING IN EITHER IS THE ONLY COPY. The chapters and the average are in
          Tal's sentence at the top of this page word for word ("13 chapters,
          87% average"); the level is in the fact row, the app bar and the
          journey list's first step; and the points, the badge and the distance
          to Silver are `V.rewards`, which is exactly where the `.score-link`
          went and is on the rail. `Course Progress` was the head action and
          `V.transcript` is on the rail too.

          "WHAT CHANGES AT E4" was two `.chgrow` tiles — lead a cohort, and your
          listing goes public — each a heading, a line and a button. Both
          destinations survive: `V.transcript` and `V.account` are rail items.

          WHAT IS NOW ORPHANED, flagged rather than quietly deleted. `.chgrow` /
          `.chgrow-b` (§24) and `.score-link` had these as their ONLY call sites
          in either portal, so their rules are the "gate nothing writes" tell —
          and all three ship in `design-system/talentnext-ds.css`. Pruning them
          is a design-system call, not a side effect of emptying one page.
          `scoreCard` itself is untouched and still has `V.rewards`' caller. */}
    ${''/* THE CERTIFICATE CLOSES THE PAGE AS A TINTED BANNER, NOT A BLACK CARD
          (Maryam, 1 Sep 2026). `certBanner` is the drawing and its own note is
          the argument; what matters at this call site is that the wrapper went
          with it. `.certban` is not `.cert`, so it is not in ai5's `DARK_CARD`,
          so `placeDark` cannot lift it and `.keep-place` has nothing to opt out
          of — the section is a plain `.sec` again.

          THAT ALSO HANDS THE CLOSING HAIRLINE BACK TO §14.200. `.page > .sec
          :last-child::after{display:none}` is the build's answer to "a rule
          under the last section has nothing after it to separate", and it was
          `.keep-place` — a wrapper introduced for `placeDark` and nothing else —
          that broke its child combinator and made §82.5 necessary. With the
          wrapper gone the original rule matches again.

          THE PARAGRAPHS BELOW ARE THE HISTORY OF THE BLACK CARD IN THIS SLOT
          and are kept because they are why it is not in the band: the band is
          what you are being asked to do next, and this level's enrolment is
          that; the certificate is what you have already finished, which is where
          a page ends rather than where it starts. `.keep-place` was the opt-out
          and `placeDark` reads it — one class, so any other card that wants
          to stay where it was written can say so the same way.

          It is still the same `certCard` as `V.transcript`'s, so the two
          cannot disagree about what the certificate says.

          AND THE STRIP HAS SINCE MOVED TO THE HEAD OF THE PAGE (Maryam,
          1 Sep 2026) — the call is written above `enrolOffer` now, so this
          slot is empty and the page's last section is the Quick Actions.
          §14.200 turns that one's closing hairline off unaided, which is the
          same reason §82.5 could be deleted. */}`;

  else if(f.preStart && !f.cancelled) body = `
    ${dashPh('Welcome back, Maryam!',`Explorer Track &ndash; E3 &middot; Cohort 41 &middot; ${f.startIn>0?`starts in ${f.startIn} days`:'starts today'}`)}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>You are enrolled on <b>Cohort 41</b>, led by <b>Priya Nair</b>. It starts in ${f.startIn} days. Coursework opens on the start day; until then, you can meet your cohort.</p></div>
      </div>
    </div>
    ${preStartBlock(f)}`;

  else if(f.cancelled) body = `
    ${dashPh('Welcome back, Maryam!','Explorer Track &ndash; E3 &middot; cohort cancelled &middot; moved to Cohort 47')}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>Your cohort was cancelled. You have been moved to <b>Cohort 47</b>, which starts on 12 Mar 2026. Your place and payment carried over, so there is nothing to pay again.</p></div>
      </div>
    </div>
    ${preStartBlock(f)}`;

  else if(f.rebook) body = `
    ${dashPh('Welcome back, Maryam!','Explorer track &middot; interview could not take place &middot; free rebooking')}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>Your interview with <b>Priya</b> could not take place. You have a <b>free rebooking</b> with 14 days left to use it. Book another interview when you are ready.</p></div>
      </div>
    </div>
    <div class="sec">
      <div class="sec-h"><h2>Book another interview</h2></div>
      <div class="kv"><span class="k">Agent</span><span class="v">Priya Nair</span></div>
      <div class="kv"><span class="k">Rebooking</span><span class="v">Free rebooking</span></div>
      <div class="kv"><span class="k">Time left</span><span class="v">14 days</span></div>
      <div style="margin-top:var(--s05)"><button class="btn btn-p noic" data-go="agents">Book another interview ${I.arrowRight}</button></div>
    </div>`;

  else { /* enrolled: week1, day34, day90 */
    const g = GAME[S.stage];
    const stalling = isDay34(S.stage);
    const dueRe = S.stage==='day90';
    body = `
    ${''/* `Welcome Back, Maryam!` until §56 made the header visible again on
          every stage — capital B and an exclamation mark on one of eight
          dashboards, which was invisible while the greeting inside Tal's
          summary was drawing the title. Same words as the other seven now. */}
    ${dashPh('Welcome back, Maryam!', f.finished?'Explorer Track &ndash; E3 &middot; Cohort 41 &middot; ninety days complete':`Explorer Track &ndash; E3 &middot; Cohort 41 &middot; week ${f.week} of 13`)}
    ${''/* THE TWO HEAD MEMBERS THE FILE ADDS, AND THEY GO HERE BECAUSE THE RUN
          IS A RUN. `placeBand` walks forward from the `.ph` and stops at the
          first section that is neither Tal's card nor a declared `.head-sec`,
          so both have to be written before anything else — including `reBook`,
          which is a `.plate` and would end the run. The note over `progCol`
          is the long version. In the DOM they end up THIRD and FOURTH, because
          `talFirst` hoists Tal's card to sit directly under the header. */}
    ${progCol(f)}
    ${''/* THE CALL LEFT THE BAND (Maryam, 31 Aug 2026). `callRow(f)` stood here
          as a third band member spanning both columns — a white row with the
          countdown in a tinted cell and two buttons. It is inside `pulseCard`
          now, under the pulse's own head row and a hairline, with no buttons on
          it. So the band is the two columns the file draws and nothing else,
          which is what "the first row is fine, do not change it" means.

          `callRow()` ITSELF IS UNTOUCHED AND STILL HAS A READER — `V.cohort`
          draws it. This is one of its two call sites going away, not the
          component. */}
    ${''/* THE WING LEFT THIS CARD — §71. `wingBlock()` sat here in a `.stp-wing`
          and drew the progress strip as the last member of the band's LEFT
          column; 599:7418 gives the strip a column of its own, so what is left
          in here is what the card was always for. `progCol` above is the same
          block in its new slot. */}
    <div class="sec">
      <div class="ai-aura tile tight">
        <div class="ai-head">${talLabel()}<h3>${stalling?'Where you are stuck':dueRe?'Before your re-interview':'Getting started'}</h3></div>
        <div class="ai-body"><p>${stalling
          ?`Day ${f.day} of 90, week ${f.week}. You&rsquo;ve finished ${f.done} of 13 chapters, averaging ${f.avg}%, ${f.mins.toLocaleString()} minutes so far. But chapter 4 has been opened four times without finishing. The three furthest ahead in Cohort 41 had it done by now.`
          :dueRe?`All 13 chapters done in 90 days, ${f.avg}% average, ${f.mins.toLocaleString()} minutes total. Your growth areas were chapters 4 and 12, and you passed both. Book your re-interview to have Priya assess whether you move up.`
          :`Day ${f.day} of 90. Chapter 1 (${CH[0][0]}) unlocked today, ${CH[0][1]} minutes. Four of the ten in your cohort have already finished it. Nothing is assessed this week, so you can take it at your own pace.`}</p></div>
        <div class="ai-foot">${askChip(stalling?'Walk me through chapter 4':dueRe?'Prepare me for the re-interview':'What is chapter 1 about?',
          stalling?'Walk me through it':dueRe?'Prepare me':'Tell me more')}</div>
      </div>
    </div>
    ${''/* THE BLACK CARD AND THEN QUICK ACTIONS — the `new` prototype's shape,
          one stage on (Maryam, 31 Aug 2026). See the note over `pulseCols`.

          "This week", "Time on the course" and "Where you stand" were three
          sections, then three columns of one section, and are now three Quick
          Action cards pointing at the pages that hold them. The columns
          themselves are not lost: `pulseCols` draws them in full on Course
          Progress. The thirteen-week chart is already there. */}
    ${dueRe ? talRec('Your Next Step - Re-interview') : ''}
    ${''/* NO PULSE CARD ON DAY 90 (Maryam, 31 Aug 2026: "Remove the 'Your
          learning pulse' black card"). Two black cards on one page is trap 12's
          rule about `.plate` and `.cert` in a different register — and the
          second one was a reading of ninety days that are over, printed above a
          card whose whole job is the one thing that is not.

          NOTHING IN IT IS LOST. Its sentence is `PAGESUM.day90`'s first clause
          (all thirteen done, the average, the minutes); its three figures are
          the Quick Actions directly below; and `pulseCols` draws the columns in
          full on Course Progress, which is where the note over `pulseCols`
          says the record belongs. The card stays on week 1 and day 34, where
          the course is still running and the pulse is a live reading. */}
    ${g && !dueRe ? pulseCard(f,g) : ''}
    ${g?pulseQA(f,g):''}
`;
  }
  return `<main class="main"><div class="page">${body}</div></main>`;
};

const lvlWing = f => {
  const confirmed = !f.pred;
  return `<div class="sec dark-card">
    <div class="stp stp-open stp-titled wing-lvl">
      ${wingHead('Where you are on the ladder')}
      <div class="prog">
        <div class="prog-top">
          <div><div class="prog-pct">${confirmed?lvlName(f.level):f.track}</div>
            ${''/* THE SIGNATURE IS THE SUB-LINE, WHICH IS WHERE THE EYEBROW'S
                  CONTENT ACTUALLY BELONGED. "Confirmed August 21, signed by
                  Priya Nair" is a fact about the level printed 4px above it,
                  and it read as a caption for the bar when `placeLevelCards`
                  parked it under the ladder. The middot became a comma: the
                  hero drew this as its own row and a `&middot;` was the
                  separator; here it is one line under a headline, which is
                  prose, and ai6's note on `_slot` makes the same call. */}
            <div class="prog-l">${confirmed
              ?(f.complete?'Promoted 21 November, set by TalentNext':'Confirmed 21 August, set by TalentNext')
              :(S.stage==='held'?'Your report is on its way':'Your level is set after your interview')}</div></div>
          ${''/* THE RIGHT-HAND FIGURE IS THE POSITION, AND BEFORE THE INTERVIEW
                THE POSITION IS A RANGE. "4 of 15" is the reference's figure and
                it needs a level; with none set, the honest answer is the five
                rungs the track covers, which is exactly what the marked run in
                the bar below is drawing. It is not a prediction — every
                Explorer is somewhere in E1 to E5 whatever the interview says —
                which is the distinction §29.4 makes about the band itself. */}
          <div class="prog-day">
            <div class="prog-dn">${confirmed?rungOf(f.level):'1&ndash;5'}<small> of 15</small></div>
            <div class="prog-l">${confirmed?'on the ladder':'in this track'}</div></div>
        </div>
        ${confirmed?ladder(f.level, true):trackBand(f.track, true)}
      </div>
    </div>
  </div>`;
};

V.level = (f) => {
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'My Level')}
  ${''/* NO DESCRIPTION. The old pair named the page's three sections, which
        is the caption failure ai6's note opens with — and a `&middot;` spine
        of track and position, which is what replaced them first, turned out
        to be two thirds of Tal's own first sentence. This page's spine is
        DRAWN: the fifteen-rung ladder below is the position, and Tal says
        which rung and what moves it. See the note over `ph()`. */}
  ${ph('My Level')}
  ${''/* THE CERTIFICATE BAND SITS UNDER THE LADDER (Maryam, 2 Sep 2026: "take
        the badge banner below the black card, wherever it is above the black
        card take it below"), and the two notes it has already carried are both
        kept because the third position is the one that agrees with both.

        IT WAS BETWEEN THE LADDER AND "How the ladder works" first, on the
        argument "position, proof, then how the ladder works for everyone".
        Then it opened the page body (1 Sep 2026, "take the badge banner below
        the tal summary section"), on the argument that the proof of the rung
        comes before the drawing of it. The ladder is a black card now (§97, and
        `lvlWing`'s own note), and the standing instruction is that a badge
        banner goes below one — which puts it back in its original slot, with
        the original reasoning intact.

        `lvlWing` IS WHAT STOPS `placeBand`'s RUN NOW, and it stops it for
        exactly the reason the banner used to. That pass walks forward from the
        `.ph` and takes members until it meets a sibling that is not head
        furniture (Tal's card, the ask line, a declared `.head-sec`); a
        `.sec.dark-card` is none of the three. The band is one column on this
        page and stays one column, and neither `.dark-card` nor `.certban` is in
        ai5's `DARK_CARD`, so `placeDark` leaves both in the page body. */}
  ${lvlWing(f)}
  ${f.done>0?certBanner(f,{close:true, key:'level'}):''}
  ${''/* THE RANKING SITS UNDER THE BLACK CARD (Maryam, 11 Sep 2026: "remove the
        ranking tab from [cohort] and take it to the My Level module ... after
        the black card"). It moved off the cohort page because a cohort now
        holds candidates at different levels, so ranking them together is unfair;
        the board is the SAME-level standing across TALENTnext instead, from any
        cohort. `boardList` is the same table the cohort tab drew, now on
        anonymised data (`RANK`) — avatar and nickname only, never a real name
        or face. It comes after the two blocks about YOUR level (the ladder, the
        certificate) and before "How the ladder works", which is the only block
        on this page that is not about you. */}
  ${''/* THE RANKING IS HIDDEN BEFORE THE COHORT STARTS (Maryam, 1 Oct 2026). On
        `enrolPre`/`cancelled` the candidate has a level but has not begun the
        journey, so a standing board among peers reads as odd — there is nothing
        yet to stand against. The board returns on the start day with the rest of
        the running-cohort surfaces. Gated on `!f.preStart` on top of the level
        test, so the confirmed-and-running stages are unchanged. */}
  ${f.level && !f.preStart ? `<div class="sec sec-rank">
    <div class="sec-h"><h2>Ranking</h2><span class="t-desc">Candidates at your level across TALENTnext, from any cohort.</span></div>
    ${boardList()}
  </div>` : ''}
  ${''/* THE SIGNED REPORT BLOCK LEFT THIS PAGE (Maryam, 1 Sep 2026: "instead of
        this page, remove the report section above the How the ladder works and
        show this against the interview details in interviews module"). It was
        `signedSummary(false, false, true)` in a `.sec mt6` right here — the
        two-fact signature header, the Strengths and Growth areas cards, and
        "Read the full report" at the foot.

        AND THE PAGE IS BETTER FOR IT, WHICH IS WHY THE MOVE IS THE RIGHT SHAPE
        RATHER THAN JUST A RELOCATION. This page answers "where am I on the
        ladder": the fifteen rungs, the track names, and how the thing works.
        The signed block answers "what did Priya say about me in August" — the
        same question `ivRow` is a row about, one module over, sitting in a list
        of the interviews it came out of. Read here it was a report with no
        interview beside it; read there it is the newest row's own findings.

        THE NON-CONFIRMED BRANCH — "What the Explorer track means" — HAS SINCE
        GONE TOO (Maryam, 2 Sep 2026: "remove the A quiz cannot set your level
        row and what the explorer track means as well"), so this slot now holds
        nothing on any stage and the note below is the second half of the same
        removal.

        WHAT THIS PAGE NO LONGER HAS IS A ROUTE TO `V.report`, and that is
        stated rather than discovered: the foot action went with the block. The
        report is still reached from `ivRow` (every row on the Interviews
        module), from the `assessed` and `promoted` dashboards' "What the
        interview found" Quick Action, and from the block's own foot button in
        its new home. Three ways in, none of them this page. */}
  ${''/* AND THE TRACK EXPLAINER IS GONE — TWO PARAGRAPHS ABOUT THE TRACK ON A
        PAGE THAT DRAWS IT (Maryam, 2 Sep 2026). It was a `.tile bordered` with
        "What the Explorer track means", gated on `!confirmed`.

        BOTH OF ITS SENTENCES ARE SAID BETTER 200px EITHER SIDE OF IT. "Explorer
        is the first of three tracks" is the first row of "How the ladder works"
        at the foot of this page — "Explorer (E1–E5), Builder (B1–B5),
        Trailblazer (T1–T5)" — which states it as the three names rather than as
        a claim about one. "Your interview places you on one of five levels
        inside it" is what the wing directly above it draws: the fifteen-rung
        band with Explorer's five lit and "1–5 of 15 in this track" beside them,
        under a subtitle reading "Your level is set at the interview".

        SO IT WAS PROSE RESTATING A DIAGRAM ON THE ONE PAGE WHOSE SUBJECT IS
        THAT DIAGRAM, which is the same test `.sec-qa` was cut down by and the
        one `PAGESUM`'s note calls "no pointing at the UI" one level up.

        `confirmed` GOES WITH IT. Both of the blocks it gated are gone and it had
        no third reader in this view — a `const` nothing reads is the "gate
        nothing writes" tell in JS. `lvlWing` keeps its own copy, which is where
        the pre-interview / confirmed split is actually drawn. */}
  ${''/* THE CERTIFICATE BAND IS NOT HERE ANY MORE — IT OPENS THE PAGE (Maryam,
        1 Sep 2026: "take the badge banner below the tal summary section"). The
        call is directly after `ph()` and the note there is the placement
        argument; what is kept here is why it was ever in this slot and the two
        decisions that outlived the move.

        IT HAD TAKEN THE SLOT THE SIGNED REPORT BLOCK LEFT, on the reading that
        the page should go position, proof, then how the ladder works for
        everyone. That ordering was a judgement about a page whose first block
        is the ladder; putting the proof first is the same three things in the
        order the instruction asks for, and the reference block is still last
        because it is the only part of this page that is not about you.

        `.keep-place` WENT WITH THE BLACK CARD THIS REPLACED and has no writer
        anywhere in the build. It existed only to opt a `.cert` out of
        `placeDark`'s lift (trap 12); a `.certban` is not in ai5's `DARK_CARD`,
        so there is nothing to opt out of. Flagged rather than deleted: it is a
        pass's documented escape hatch, not a style rule, and the next `.cert`
        on a page with a band will want it.

        GATED ON `f.done > 0`, WHICH IS `V.transcript`'S OWN CONDITION rather
        than a new one. A certificate is a course you finished, so the stages
        with nothing finished draw nothing — and matching Course Progress means
        the two pages cannot disagree about whether one exists. */}
  ${''/* "A QUIZ CANNOT SET YOUR LEVEL" IS OFF THIS PAGE (Maryam, 2 Sep 2026:
        "remove the A quiz cannot set your level row"). It was a `.note quiet
        note-act` — the info mark, the two-sentence rule, and a black "Book your
        interview" beside it — gated on `!confirmed`.

        THE SENTENCE IS STILL MADE, THREE TIMES, AND NOT AS A CAVEAT. Tal's
        summary at the head of this page says it in the reader's own numbers
        ("Still no level — the interview on 20 August sets it… the quiz only
        predicted the band"), the wing's subtitle says "Your level is set at the
        interview" against the rungs, and "Who decides" at the foot names the
        agent and the signature. A fourth statement in a bordered strip is the
        product correcting a misunderstanding nobody on this page can still
        have.

        AND ITS BUTTON WAS THE WEAKEST OF THE FOUR ROUTES TO BOOKING. `data-go=
        "agents"` from a footnote, on a stage where the dashboard's black card,
        the Quick Action, the Interviews module's own agent list and Tal's ask
        bar all point at the same six people. Removing the row removes the
        page's only route to `agents` — stated rather than discovered, the way
        the report route above it was. §24.315's `.note-act` rules stay:
        `V.welcome`'s payment note is the other writer. */}
   C3 
  <div class="sec flat tint">
    <div class="sec-h"><h2>How the ladder works</h2></div>
    <div class="acc">
      <div class="acc-i"><button class="acc-h"><span class="ttl">The three tracks</span><span class="chev">${I.chevDown}</span></button>
        <div class="acc-b"><p>Explorer (E1&ndash;E5), Builder (B1&ndash;B5), Trailblazer (T1&ndash;T5). Fifteen levels in one line. You do not jump tracks, you move up one level at a time.</p></div></div>
      <div class="acc-i"><button class="acc-h"><span class="ttl">Moving up</span><span class="chev">${I.chevDown}</span></button>
        <div class="acc-b"><p>Every course is 90 days. Once the 90 days are up you re-interview, and you move up a level, hold where you are, or drop back one.</p></div></div>
      <div class="acc-i"><button class="acc-h"><span class="ttl">Who decides</span><span class="chev">${I.chevDown}</span></button>
        <div class="acc-b"><p>A talent agent interviews you. TalentNext then sets your level from that interview, after analysing it. At the end of a course, a re-interview decides whether you move up, hold or drop back.</p></div></div>
    </div>
  </div>
</div></main>`;
};


const SCORES = [['Decisiveness',78],['Delegation',41],['Directness',66],
                ['Coaching',38],['Composure',84]];
const qzBand = v => v >= 70 ? ['s','Strong'] : v >= 50 ? ['m','Mixed'] : ['w','Weak'];
const qzLow  = (n) => SCORES.slice().sort((a,b) => a[1] - b[1]).slice(0, n || 2);

const QZ_STR = ['Execution under pressure','Comfortable with ambiguity',
                'Holds a line under challenge'];
const QZ_DEV = ['Delegates too late','Avoids conflict until it escalates',
                'Coaches by telling'];

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


const qzRung = (v, track) => {
  const T = ['Explorer','Builder','Trailblazer'];
  const lo = Math.max(0, T.indexOf(track || 'Explorer')) * 5;
  const fifth = Math.min(5, Math.max(1, Math.ceil(v / 20)));
  return LVL_CODES[lo + fifth - 1];
};

function qzLede(f){
  const asc = SCORES.slice().sort((a,b) => a[1] - b[1]);
  const low = asc[0], high = asc[asc.length - 1];
  return `<b>${high[0]}</b> at ${high[1]} is your strongest band, `
    + `${low[0].toLowerCase()} at ${low[1]} your weakest. An agent pushes hardest on `
    + `the two lowest, and both are holding you a rung below the rest of you.`;
}

const qzList = (title, hue, items) => `<div class="qzp-g">
  <div class="qzp-t ${hue}">${title}</div>
  <ol class="qzp-l">${items.map(t => `<li>${t}</li>`).join('')}</ol>
</div>`;

function quizPeek(f){
  const asc = SCORES.slice().sort((a,b) => a[1] - b[1]);
  const impact = asc.slice(0, 2).map(r => r[0]);
  const rows = asc.slice(0, 2).map(([band, v]) => `
    <button class="qzp-r" data-go="level">
      <span class="qzp-r-ic">${I.group}</span>
      <span class="qzp-r-b">
        <span class="qzp-r-k">${band} &middot; ${v}</span>
        <span class="qzp-r-v">Reads at ${qzRung(v, f.track)} on the ${f.track || 'Explorer'} track</span>
        <span class="qzp-r-tag">High impact</span>
      </span>
      <span class="qzp-r-go">${I.chevRight}</span>
    </button>`).join('');

  return `<aside class="peek peek-qz" aria-label="Your quiz results">
    <div class="peek-h">
      ${''/* NO DESCRIPTION UNDER THE TITLE (Maryam, 31 Aug 2026). §44's
             `.peek-t > small` is a second line explaining what the panel is,
             which the agent portal's preview genuinely needs — "What a candidate
             sees in browse" is the whole of why that column exists. This panel's
             title is its own explanation, and the date said "From the quiz you
             sat 12 Aug" directly above a sentence that starts by naming two of
             that quiz's scores. `qzTaken` keeps its two readers and is not
             called from here any more. */}
      <span class="peek-t">Your Quiz Results</span>
      <button class="peek-x" data-peek="" aria-label="Close the quiz results">${I.close}</button>
    </div>
    <div class="peek-b">
      ${''/* TAL'S MARK AND NOT `.ai-label` OR `.ai-aura` — §72 records this trap
             at length. `talFirst` hoists any `.sec` containing an `.ai-aura` to
             under the `.ph` and `placeBand`'s `_mhIsTal` claims either class as
             head furniture; the peek is outside `.page` so neither pass can
             reach it today, which is exactly the accident not to depend on.

             AND IT HOLDS NO GLYPH. §70 draws the sparkle by MASKING a gradient
             — `--ai-star` is a data-URI of the shape, not a colour — so the
             mark is an empty box that §80.2 paints, the way `.aih-mk` is.
             `fill:var(--ai-star)` was the first version and painted nothing:
             it set `fill` to a URL. */}
      <p class="qzp-lede"><span class="qzp-mk" aria-hidden="true"></span>${qzLede(f)}</p>
      ${qzList('What you do well', 'ok', QZ_STR)}
      ${qzList('Where you lose ground', 'acc', QZ_DEV)}
      <div class="qzp-rose">${quizRose(SCORES, 64, true)}</div>
      <div class="qzp-g">
        <div class="qzp-t">Where this puts you on the ladder</div>
        <div class="qzp-rows">${rows}</div>
      </div>
    </div>
    ${''/* THE FOOTER IS THE ONE THING TO DO ABOUT ALL OF IT (Maryam, 31 Aug
           2026: add "Book your interview today" with an arrow). It goes to
           `agents` rather than to Priya: the panel is about five bands and two
           weaknesses, and the page's own CTA a column to the left is already
           the one that books the agent Tal picked. It is also the sentence that
           settles the rungs above it — the interview is what sets a level, and
           this is the control that starts one. */}
    <div class="peek-f">
      <button class="qzp-cta" data-go="agents">Book your interview today${I.arrowRight}</button>
    </div>
  </aside>`;
}

function peekPanel(f){
  if(S.peek === 'quiz') return quizPeek(f);
  return '';
}

const qzTaken = (long) => S.stage === 'consult'
  ? (long ? '3 August 2026'  : '3 Aug')
  : (long ? '12 August 2026' : '12 Aug');

function quizRose(dims, score, bare){
  const CX = 180, CY = 158, R0 = 36, R = 108, GAP = 1.4;
  const pol = (a,r) => [CX + r * Math.cos(a * Math.PI/180), CY + r * Math.sin(a * Math.PI/180)];
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
    ${bare ? '' : `<div class="qz-key">
      ${dims.map(([k,v]) => { const [cls,word] = qzBand(v);
        return `<div class="kv"><span class="k"><i class="qz-sw ${cls}"></i>${k}</span>
          <span class="v">${v}<span class="tag qz-vd">${word}</span></span></div>`; }).join('')}
    </div>
    <p class="t-helper-01 qz-note">Each wedge reaches out as far as its score. The two shortest are what
      the interview probes hardest, and what the course spends most of its time on.</p>`}
  </div>`;
}

V.result = (f) => `<main class="main"><div class="page">
  ${crumb(['My Level','level'],'Quiz result')}
  ${ph('Quiz result', 'Explorer track')}
  <div class="sec">
    <div class="sec-h"><h2>Your track</h2></div>
    <p>Your latest quiz put you on the <b>Explorer track</b>.</p>
    <p class="t-helper-01 mt4">Your track is the band you start in. Your <b>level is set at your interview</b>, not by the quiz.${f.pred ? '' : ' A later level can move you onto another track, but this stays the track your quiz produced.'}</p>
    ${f.pred ? `<div class="mt5"><button class="btn btn-p" data-go="agents">Book your interview ${I.calendar}</button></div>` : ''}
  </div>
</div></main>`;

V.report = (f) => `<main class="main"><div class="page">
  ${crumb(['My Level','level'],'Report')}
  ${''/* THE EYEBROW IS GONE (Maryam, 2 Sep 2026: "remove the Level interview ·
        confirmed August 21 text from the black card"), and nothing else needs
        to change for it. `placeLevelCards` (ai5) builds the `.lvl-foot` out of
        whatever it finds — `if(eb)` for the eyebrow, and `if(!eb &&
        !acts.children.length) return` — so with no eyebrow and no button row
        under the card the foot is simply not built.

        WHAT IS LOST IS THE DATE, and it is said twice elsewhere on the way in:
        `PAGESUM.assessed` dates the report and `signedSummary` prints "Assessed
        and signed by Priya Nair" 400px below this card. The crumb above says
        Report. §05's `.lvl-hero .eb` rules keep a caller — `V.level`'s
        pre-interview state — so nothing is orphaned. */}
  <div class="lvl-hero">
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
        it, so they go where the eye lands.

        AND THE CHOOSER IS HERE TOO NOW (Maryam, 9 Sep 2026: "take the choose
        your scenes flow inside the interview it is related to"). It used to
        open the Interviews module; this is the same move the strengths/growth
        block made on 1 Sep, one level lower — the flow that picks THIS
        interview's three scenes belongs on the page about THIS interview.
        Gated on `sceneDone`: while nothing is committed the section IS the
        chooser, and the moment three are saved it becomes the kept row. That
        gate answers the old module note's worry — the chooser is not re-offered
        on a report already settled, because `sceneDone` is true by then. `S.iv`
        (or `level` as the default) is the interview, the same key the hero and
        the write-up below read, so all three name one interview. */}
  ${(() => { const k = S.iv === 're' ? 're' : 'level';
    return sceneDone(k)
    ? `<div class="sec sec-scene">
    ${''/* THE SCENES HEADING CARRIES NO HELPER CAPTION (Maryam, 24 Sep 2026:
          "remove the text 'The three you kept'"). It was a `.t-helper-01` span
          reading "The three you kept" / "The full interview, all scenes"; the
          section is self-evidently the kept scenes, so the caption was furniture. */}
    <div class="sec-h"><h2>Scenes</h2></div>
    ${sceneRow(k)}
  </div>`
    : `<div class="sec">
    <div class="sec-h"><div class="scene-hb"><h2>Choose your scenes</h2>
    <p class="scene-lede">Six moments were cut from your interview. Keep the three you would be happy for someone to watch.</p>
    </div>${sceneSave(k)}</div>
    ${scenePick(k)}
  </div>`;
  })()}
  ${''/* WHAT THE INTERVIEW FOUND — MOVED HERE FROM THE INTERVIEWS MODULE
        (Maryam, 1 Sep 2026: "the strengths and growth section should show
        inside interview details, remove from here and add in the interview
        detail page"). This is that page.

        IT REPLACED TWO TILES RATHER THAN JOINING THEM, and that is the whole
        of the change. What stood here was Priya's write-up drawn the way §74
        was built to stop drawing it: a `row-lead` tile carrying "Assessed and
        signed by Priya Nair" with a `.note band` under it, then a second tile
        headed "Strengths and growth areas" with two grey labels and two
        paragraphs. §74's own note is the argument against exactly that shape —
        "nothing in it said that the three are three different KINDS of
        finding" — and it had been answered everywhere except here, because
        this page was never one of `signedSummary`'s call sites. Appending the
        cards would have left the page saying it twice.

        THE THREE ARGUMENTS ARE THE SAME ONES, so nothing new is decided here:
        `withNote` is on because her note is one of the three findings and this
        page is where it was already drawn; `re` reads `S.iv`, which is what the
        hero above it reads, so the cards and the eyebrow name one interview;
        and `footAction` is OFF — it opens "Read the full report", and this is
        the full report.

        THE REVIEW BUTTON IS GONE (Maryam, 2 Sep 2026), and the sentence above
        used to be its argument: it was the only route to a level dispute in the
        product, stated here because it did not come from `signedSummary`. That
        is worth knowing rather than deleting, because the route goes with the
        button — `V.account`'s Data use section is still where a dispute would
        be raised and there is now nothing on the report pointing at it. Tal
        answers "can my level be reviewed" and hands over to support, which is
        the only path left. */}
  <div class="sec">
    ${signedSummary(true, S.iv === 're', false)}
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
  ${''/* RATE THE TALENT AGENT — NO LONGER ON THE LEVELLED REPORT (Maryam, 30 Sep
        2026: "the candidate could rate the talent agent before they got levelled
        ... do not show the talent agent rating option if the candidate got
        levelled"). The rating now floats above the Tal dock on every page of the
        HELD stage (interview held, report pending) — injected by `placeReviewFloat`
        (ai4.js) while `S.stage==='held'` — and is gone once a level is set. */}
  ${''/* "DOWNLOAD REPORT AS PDF" IS GONE (Maryam, 2 Sep 2026) AND THE SECTION
        GOES WITH IT WHEN IT IS EMPTY. On `week1` and after, the enrol button is
        already suppressed, so what was left would have been a `.sec` holding an
        empty `.btn-set` — 48px of white and a join rule under it, which reads as
        a section that failed to load rather than one that has nothing to say.
        The whole block is conditional on the one control it can still hold. */}
  ${f.enrolled||f.complete?'':`<div class="sec"><div class="btn-set">
    <button class="btn btn-p" data-go="enrol">Enroll on Explorer Track &ndash; E3 ${I.arrowRight}</button>
  </div></div>`}
</div></main>`;

function howItWorks(){
  return `<div class="sec found${discOpen('how')?' on':''}">
    ${foundHead('How it works','how')}
    <div class="found-b">
    <div class="facts">
      <div><span class="l">Length</span><span class="v">45 minutes</span></div>
      <div><span class="l">Format</span><span class="v">Video, recorded</span></div>
      <div><span class="l">Your report</span><span class="v">Within 24 hours</span></div>
      <div><span class="l">Fee</span><span class="v">First one free</span></div>
    </div>
    <ol class="steps">
      <li><span class="s-n">1</span><span class="s-b"><b>You choose the agent</b>
        Every agent who assesses your track is listed with their next free slot. You pick who you talk to.</span></li>
      <li><span class="s-n">2</span><span class="s-b"><b>You have the conversation</b>
        Forty-five minutes by video. Your agent walks you through real situations from your own answers and asks what you did and why. There is nothing to revise and no way to fail it.</span></li>
      <li><span class="s-n">3</span><span class="s-b"><b>Your level is set</b>
        Within 24 hours your interview is analysed and TalentNext sets your level: your strengths, your growth areas, and the level you have been confirmed at.</span></li>
      <li><span class="s-n">4</span><span class="s-b"><b>The report is yours</b>
        It stays in your account and you decide who ever sees it. Your level opens the course built for that level.</span></li>
    </ol>
    </div>
  </div>`;
}

function ivTopicBlock(){
  if(!S.ivTopic) return '';
  return `<div class="tile" style="margin-bottom:var(--s05)">
    <div class="t-label" style="color:var(--text-secondary)">What you wanted to talk about</div>
    <p class="t-body-01" style="margin:var(--s02) 0 0">${escHtml(S.ivTopic)}</p>
  </div>`;
}

const IV_CANCEL_REASONS = ['Something came up','I want a different agent','I am not ready','Other'];
function ivCancelModal(){
  const reason = S.ddVal.ivcancel || IV_CANCEL_REASONS[0];
  return `<div class="modal on" data-ivcancelclose="1">
    <div class="sheet conf" role="dialog" aria-modal="true" aria-label="Cancel interview">
      <div class="sheet-b conf-b${S.dd==='ivcancel'?' dd-open':''}">
        <span class="conf-mk">${I.warning}</span>
        <h2 class="conf-t">Cancel this interview?</h2>
        <p class="conf-x">Your time with Priya Nair is given up and the slot goes back to the marketplace. You can book another interview whenever you like.</p>
        <div class="f" style="text-align:left"><label>Why are you cancelling?</label>${dd('ivcancel', IV_CANCEL_REASONS, reason)}</div>
        ${reason==='Other'?`<div class="f" style="text-align:left"><label for="ivcnote">Anything else</label><textarea class="inp" id="ivcnote" rows="3" maxlength="300" placeholder="Tell us what happened." data-ivcancelnote>${escHtml(S.ivCancelNote)}</textarea></div>`:''}
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-s noic" data-ivcancelclose="1">Keep it</button>
        <button class="btn btn-t danger noic" data-ivcanceldo="1">Cancel interview ${I.close}</button>
      </div>
    </div>
  </div>`;
}

V.interviews = (f) => {
  const booked = isBooked(S.stage);
  const held = S.stage==='held';
  const dueRe = !!f.reinterview;
  const dueFirst = !!f.pred && !booked && !held;
  const due = dueRe || dueFirst;
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Interviews')}
  ${''/* THE SPINE, NOT THE SENTENCE — see the note over `ph()`. All four of
        these were descriptions of the page, and the last one was the plate's
        own paragraph forty pixels below said in different words. What is
        left states where the candidate is in the one sequence this module is
        about, and Tal's summary does the counting. */}
  ${ph('Interviews','45 minutes, by video &middot; recorded &middot; sets your level')}
  ${''/* THE PLATE WENT AND NOTHING REPLACED IT IN THE HEAD — THE LIST BELOW
        CARRIES THE RECOMMENDATION AS A CHIP (Maryam, 31 Aug 2026: "remove this
        recommended by tal whole section and add a 'Recommended' chip next to
        priya nair name in all agent card").

        WHAT THE PLATE WAS SAYING, AND WHY IT HAD TO GO EITHER WAY. Eyebrow
        "Next step", title "Book your level interview", a paragraph restating the
        `.ph` fact row one line above it, and a button reading "Choose an agent"
        — which sent you to a list to do the work Tal is supposed to have already
        done. Four elements to say "go and choose", on the page whose whole
        subject is the choice.

        AND `talRec` WAS NOT THE ANSWER HERE EITHER, WHICH TOOK TWO TRIES TO
        SEE. It went into the band's second column first as a `.head-col`, then
        full width directly under the band. Both drew the same person twice on
        one screen: a 166px portrait with six rows of facts, and then the same
        face, rating, band and fee again as card one of six 300px lower. The
        recommendation is one BIT of information — which of these six — and it
        does not need a block of its own on the page that lists them. On the
        `new` dashboard it still does, because there the list is a page away and
        the block IS the shortlist; `talRec` is unchanged and that page is
        untouched.

        SO THE MODULE'S HEAD IS THE BAND AND NOTHING ELSE, and `agentCardH`
        stamps `.ag-rec` on whichever agent `recKey()` returns. One chip, in the
        grid, on the row you would press anyway.

        THE RE-INTERVIEW STAGE READS THE SAME WAY. `dueRe`'s plate carried its
        own sentence about E4 / E3 / E2, which is `PAGESUM`'s job and is said in
        the band above it; what is due on day 90 is still a 45-minute
        conversation with one of six people, and the chip points at the same one
        for both stages. */}
  ${due?allAgents():''}
  ${''/* THE SCENE CHOOSER MOVED TO THE INTERVIEW DETAIL (Maryam, 9 Sep 2026:
        "take the choose your scenes flow inside the interview it is related
        to"). It used to open this module \u2014 the argument was that it is the one
        thing on the page waiting on the candidate and it happens once. The ask
        draws the line one level lower, the same move the strengths/growth block
        made on 1 Sep: the flow that picks an interview's three scenes belongs on
        the page about that interview. It is on `V.report` now, gated on
        `sceneDone` so the report shows the chooser until three are saved and the
        kept row after. `scenePick` / `sceneSave` / the copy went with it. */}
  ${''/* PAST INTERVIEWS IS A VERTICAL BLOCK. §10.15 gives a `.sec` with a
        `.sec-h` a 184px label column at desktop, which put "Past interviews /
        Kept for 24 months" in a narrow gutter beside the rows and set the
        heading three words to a line. The section's contents decide the
        opt-out (trap 13) and `.ivlist` is now in §10.15's list, so the
        heading sits above the rows and the rows take the column. */}
  ${(f.enrolled||f.complete||!f.pred)?`
  <div class="sec">
    ${''/* "KEPT FOR 24 MONTHS" CAME OFF (Maryam, 31 Aug 2026). It was a
          retention POLICY in the corner of a heading — the fourth of the four
          content bans `PAGESUM`'s note lists ("no policy: nothing renews, no
          card is kept on file"), stated for the section rather than for Tal but
          the same mistake. Where a candidate needs it is `V.account`'s Data use
          notice, which is where every other retention line in the build lives.
          The row underneath already says what this section is for. */}
    <div class="sec-h"><h2>Past interviews</h2></div>
    <div class="ivlist">
      ${f.complete?ivRow('re','Re-interview','November 21, 2026','Promoted to Explorer &ndash; E4','44:06'):''}
      ${ivRow('level','Level interview','August 20, 2026','Confirmed Explorer &ndash; E3','45:12')}
    </div>
    ${''/* THE SIGNED FINDINGS ARE NOT HERE ANY MORE — THEY ARE ON THE INTERVIEW
          ITSELF (Maryam, 1 Sep 2026: "the strengths and growth section should
          show inside interview details, remove from here and add in the
          interview detail page"). `V.report` is that page, and it is one press
          away: every row in `.ivlist` is `data-go="report"`.

          WHY IT READS BETTER THERE, AND WHY IT WAS DEFENSIBLE HERE. The block
          arrived on this module when it left `V.level`, on the argument that
          "the interview details on this module ARE these rows" — true of the
          module, and the ask has now drawn the line one level lower: a LIST is
          a list, and what one interview found belongs on the page about that
          interview. The list holds TWO rows on `promoted`, so the block sitting
          under both of them had to name which one it was reporting in its own
          header; on `V.report` the whole page is one interview and `S.iv` has
          already picked it, so the question does not arise.

          AND IT WAS THE SECOND WRITE-UP THERE. `V.report` already drew Priya's
          two paragraphs and her note as two `.tile`s of prose — the exact block
          §74 was built to replace. Moving this one in did not add a section, it
          finished a swap that had been half done since §74 shipped. The long
          version is over `signedSummary`. */}
  </div>`:''}
  ${''/* SCHEDULED IS THE DASHBOARD'S ROW — Maryam, 31 Aug 2026. It was a
        four-row `.kv` tile, a three-button set under it and a legal line: the
        agent as the VALUE of a row labelled "Agent", between a date and a card
        number, with the join buttons in a separate block below. `crow('iv')` is
        the same appointment drawn as one object — the countdown and what the
        session is on the left, the person in the middle, the two actions on the
        right — and it is already what the `booked` dashboard shows. Two
        drawings of one appointment is the mistake `CALL_ROW`'s own note was
        written about; this is the third surface joining the component rather
        than a fourth drawing.

        AND IT NEEDS NO STAMP. `bkStamp` (ai7) exists because six views TYPE
        "Priya Nair, Thursday 20 August, 6:30 PM, $95" into their prose, and
        this tile was one of the six. `CALL_ROW.iv` reads the booked agent out
        of `S.booking` / `S.bk` and the expertise out of `REC`, so the row
        cannot disagree with the booking in the first place — the note over
        `bkStamp` says to prefer that, and this is one fewer site for it.

        WHAT IT DROPS, AND WHY THAT IS NOT A LOSS. "Paid $95 · Visa ending 4242"
        is a receipt line and the receipt is `V.booking`, one click from the
        crumb, with the same three rows and the card on it; every charge is also
        a row on Payments with its own Receipt button. "Add to calendar" goes
        with the third button — `.crow-a` is two actions by construction (§71
        fixes both at 185px), and the confirmation page's own note records that
        control coming off for the same reason: the invite is in the email the
        moment the booking clears.

        AND IT IS THE BLACK CARD NOW — THE DASHBOARD'S, EXACTLY (Maryam, 31 Aug
        2026). §77 converted the `booked` dashboard's row to §75's `.dark-card`
        and its own note argues this page should NOT follow: "the other two sit
        under section headings on pages about interviews and cohorts, where the
        row is one item rather than the answer." That reasoning is right about
        `V.cohort` and weakest exactly here — on the `booked` stage this row is
        the only thing on the page that has not happened yet, sitting under a
        section called "Past interviews". It is the answer, and it is the same
        appointment the dashboard is calling the answer two clicks away.

        THE HEADING CAME BACK AND ITS REMOVAL IS WHAT MADE THAT FINE. This
        section was headingless on the argument that "Scheduled" over a row
        already reading "6 days left · Level interview" is the row's first cell
        restated. §77 moved the countdown OUT of the row and into the card's
        heading row (`.dc-when`, `crow('iv',{when:false})`), so the cell that
        made it a repeat no longer exists — and the heading row is structural on
        a `.dark-card` rather than optional, since a bare countdown floating at
        the right of an empty row is what the alternative draws. One word, the
        page's own name for the block, in sentence case.

        `.dc-t` IS NOT `.sec-h`, so §10.15's label column still does not reach
        this section — the heading is the card's, inside it. The opt-out, the
        gutter restatement and the heading padding a `.sec-h` would have needed
        are all still moot.

        RESCHEDULE STAYS, AND §77.3 IS WHERE THE PRICE OF THAT IS WRITTEN. The
        dashboard drops it (`{second:false}`) because a next-step card has one
        action; this is the interviews page, which is where a person comes TO
        reschedule, so dropping it would remove the control from the one page
        that should carry it. §77 deleted the two rules a quiet button on this
        card needs and left instructions to restore both — its own border and
        §63 §17's ink — and both are back, keyed on `:not(.btn-p)` so the
        dashboard's single-button card is untouched.

        THE COUNTDOWN STRING IS `callLeft(CALL_ROW.iv().when)`, the dashboard's
        expression verbatim, so the two surfaces cannot disagree about the same
        appointment — the failure `bkStamp` exists to prevent, answered here the
        way the note over `bkStamp` says to prefer: derive it, do not stamp it.

        THE LEGAL LINE STAYS OFF. The 24-hour reschedule window is stated where
        the money is, on `V.booking` and `V.payment` — the two lines `wRefund`
        (ai8) reads when Tal is asked — and a policy line under a Join button is
        the "no policy" ban `PAGESUM`'s note lists, applied to page copy. */}
  ${booked?`
  <div class="sec sec-call dark-card crow-dark">
    <div class="dc-hd">
      <div class="dc-hd-r"><h2 class="dc-t">Scheduled</h2>
        <span class="dc-when">${I.time}${S.stage===RESCHED?"In 2 days":callLeft(CALL_ROW.iv().when)}</span></div>
    </div>
    ${crow('iv', {when:false})}
  </div>
  ${''/* WHAT YOU TOLD YOUR AGENT + CANCEL (16.3 / 16.4). The topic typed at
        booking is echoed so the candidate can see what Priya has; Cancel opens
        the reason modal and, confirmed, returns to the marketplace. Both sit on
        the white page under the black card, not inside it: `.danger` ink is a
        light red that does not read on the dark ground. */}
  <div class="sec iv-manage">
    ${ivTopicBlock()}
    <button class="btn btn-t danger noic" data-ivcancel="1">${I.close}Cancel interview</button>
  </div>`:''}
  ${''/* THE 24-HOUR WAIT (17.1). No agent card, no Join, no cancel — the call
        happened. The report is on its way and there is nothing to do; the topic
        the candidate raised is echoed for reference. */}
  ${held?`
  <div class="sec">
    <div class="tile">
      <h3 class="t-h3">Interview held</h3>
      <p class="t-body-01" style="color:var(--text-secondary);margin-top:var(--s02)">Your interview is being analysed and your level will be set by TalentNext within 24 hours. You will be notified then. There is nothing to do.</p>
    </div>
    ${ivTopicBlock()}
  </div>`:''}
  ${''/* "HOW IT WORKS" IS ON EVERY STAGE NOW, `booked` INCLUDED (Maryam,
        2 Sep 2026: "add the How It Works section we have on interview module
        on the Interview booked prototype as well"). It was the ELSE arm of the
        Scheduled card above — the one stage that has an interview coming was
        the one stage with nothing explaining what the interview is.

        THE TERNARY WAS NEVER AN ARGUMENT, IT WAS AN ACCIDENT OF ORDER. The
        card and the disclosure answer different questions — one is "the
        appointment you have", the other is "what the thing is" — and there was
        no reason a page could not hold both. `booked` is in fact the stage
        where the reference is most likely to be re-read: it is the only stage
        where the conversation is still ahead of the reader.

        AND IT COSTS NOTHING TO SIT UNDER THE CARD. §77.1 already restates the
        join for `.sec-call.dark-card + .sec` at `--s06` inside the 900 query
        (§20's own rule zeroes it, which is right for a full-bleed call band and
        wrong under an inset card), and §20's two pair rules carry
        `:not(.dark-card)` on both sides, so the pair falls to §10's base 24 on
        each edge — the product's one 48px rhythm, with the card's own 32px
        frame inside it.

        STEP 1 READS AS DONE RATHER THAN AS AN INSTRUCTION HERE, and that is
        the same thing it does on the five stages after `booked` where the
        interview has already happened. A closed disclosure whose whole subject
        is the sequence you are inside does not have to be re-worded per
        stage; the four figures and the four steps are true whichever end of
        the arc is reading them. */}
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
  ${''/* AND IT IS A DISCLOSURE, CLOSED TO START — §65, `key='how'` (Maryam,
        31 Aug 2026: "collapse that how it works section, just like the What the
        interview found collapsed section"). Same component and the same
        argument `foundHead`'s note makes: four figures and four numbered steps
        is the longest block on this page, it is a re-read, and it is the one
        part a reader who has already decided does not need. With the band now
        naming an agent and the list of five under it, this is the third thing
        on a page whose first two are the decision.

        THE KEY IS WHY THIS COST NOTHING. `S.disc` is keyed by name — the note
        over `discOpen` records that it was a single boolean until "How your
        cohort works" appeared — so a third disclosure is a heading, a wrapper
        and a string. Nothing in this reaches the stylesheet: §65's rules are
        about the SHAPE of a disclosure and all of them key on `.found`.

        TRAP 13 IS ALREADY ANSWERED, AND NOT BY LUCK. §65.1a restates §10.15's
        label-column opt-out on `.app .page .sec.found` inside the container
        query, precisely because wrapping a panel in `.found-b` is what loses
        the `:has(> .facts)` opt-out this section used to rely on. That was the
        bug §65 was written around; it is the reason this one does not have it.

        THE FOUR FIGURES STAY INSIDE THE PANEL, unlike `V.enrol`'s cohort
        disclosure which keeps its lede outside. There the visible line answers
        "what IS a cohort" while shut; here every one of the four figures is
        answered again in the steps below it (the note under this one is the
        argument), so there is nothing that has to be legible closed. */}
  ${howItWorks()}
</div></main>`;
};

const allAgents = () => `
  <div class="sec">
    <div class="hd-srch">
      <div class="hd-srch-t">
        ${/* "Choose an agent for your interview", not "All agents" (Maryam,
              31 Aug 2026). The block is the only thing left on the page since
              the shortlist rail and the summary came off, so the heading is no
              longer distinguishing this list from another one above it — it is
              the page's instruction, and a count of the set is what the search
              field beside it already says ("Search all 24 agents"). It names
              the task on both call sites: on `V.agents` the page title says the
              same thing one size up, and on `V.interviews` this is the block a
              candidate with no interview booked scrolls to. */''}
        <div class="sec-h"><h2>Choose an agent for your interview</h2></div>
        <p class="all-desc">Select an agent from whom you want to be interviewed.</p>
      </div>
      <div class="srch all-srch">
        <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
        <input class="inp" placeholder="Search all 24 agents" aria-label="Search agents">
      </div>
    </div>
  </div>

  ${''/* THE GRID OF CARDS IS A TABLE NOW (Maryam, 3 Sep 2026 — the reference
        screen); `agentsTable` is where the argument is written. `AG_ORDER` is
        still the list and still not a literal: the `new` dashboard's "Other
        Agents" section was the same set minus the recommended one, and two
        surfaces drawing one set from two arrays is how a seventh agent reaches
        one page and not the other.

        THE `.rail-wrap` WENT WITH THE RAIL. That wrapper is §14.496's
        full-bleed scroller housing, which a table does not want — it pulls its
        child out to the column edges by `--pad-x`, and the head row's labels
        have to line up with the section heading above them. The table pays the
        page gutter like an ordinary section child. */}
  ${agentsTable()}`;

V.courses = (f) => `<main class="main"><div class="page">
  ${crumb('All courses')}
  ${allCourses(f)}
</div></main>`;

V.agents = (f) => `<main class="main"><div class="page">
  ${crumb(['Interviews','interviews'],'All agents')}
  ${''/* NO FACT ROW (Maryam, 31 Aug 2026). "3 agents at your level &middot; 45
        minutes, by video &middot; recorded" was three marks and three phrases
        under the title, and `phSub` draws each with its own 15px icon — so the
        heaviest row on a page whose job is to show twenty-four faces was the
        one above them. All three are said better elsewhere and none of them is
        a spine: the count is the grid you are looking at, and "45 minutes,
        recorded" is a `.kv` row on every agent's own page, where it is about
        the interview you are actually booking. `ph()`'s own note is the rule —
        where a page has no factual spine, it has no `sub` — and this page's
        spine is the grid. */}
  ${ph(f.reinterview?'Choose an agent for your re-interview':'Choose an agent')}

  ${''/* AND TAL'S CARD IS GONE WITH THE SUMMARY (Maryam, 31 Aug 2026: remove
        the summary from this page). BOTH HALVES HAVE TO GO, and that is trap
        11 rather than tidiness: `placeSummaryPass` strips a band card's chips
        and its head-row action BEFORE it reaches `if(!text) return`, so
        deleting `PAGESUM.agents` while this card stayed would leave it in the
        band stripped, with its `h3` intact, in a shape §33 does not style —
        the band renders ~700px wider than the page. With no card and no entry
        the pass builds nothing and the band is the title.

        NOTHING IS LOST WITH THE WORDS. The card said "3 of 24 agents assess at
        your level and have a slot inside seven days, ordered by how their past
        candidates progressed", and the grid under it is that list, in that
        order, with each agent's range, rating and next slot on their own card.
        The page is a directory and it now opens as one. */}

  ${''/* AND THE THREE SUGGESTED CARDS ABOVE "ALL AGENTS" ARE GONE (Maryam,
        31 Aug 2026). A `.rail` of Priya, Owen and Lena sat between the summary
        and the grid — and the grid's own first row is Priya, Owen and Lena, at
        the same size, in the same order, with the same price, slot and Book
        button. Two identical rows separated by one hairline is not a shortlist,
        it is the page printed twice, and the second copy is the one with the
        search field and the other twenty-one agents attached to it.

        THE RANKING SURVIVES WITHOUT THE RAIL, which is what makes this a
        subtraction rather than a loss. `allAgents()` draws its rows in the same
        order, so the three Tal recommends are still the three you meet first;
        what the rail added was a claim that they were a different KIND of
        result, and Tal's sentence in the band above names all three with their
        fees and says why. `agentCardH` keeps its other callers. */}
  ${allAgents()}
  ${''/* "HOW IT WORKS" IS ON THIS PAGE TOO (16.2, Maryam, 15 Sep 2026). The
        directory is where a candidate weighs agents, so the reference for what
        an interview IS belongs here, not only on the Interviews module. Same
        `howItWorks()` disclosure, closed to start. */}
  ${howItWorks()}
</div></main>`;

V.agent = (f) => {
  const a = AGENTS[S.agent||'priya'];
  const rec = REC[S.agent||'priya'];
  const isRe = !!f.reinterview;  /* first interview complimentary, re paid */
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
  ${''/* THE THREE BLOCKS ARE ONE SECTION, AND THAT IS NOT TIDINESS.
        §10.2 closes every `.sec` with a full-bleed hairline `::after` and, at
        760 and up, a pair of tick marks where it crosses the rails. Three
        sections would therefore put a page-wide rule one pixel under each
        block — the "TWO 1px rules one pixel apart" artefact §14's note on
        `.sec-qa` spends a paragraph on, three times over. One section, three
        blocks separated by their own rules, and the section's closing rule
        ends the page where it should.

        AND THE THREE ARE NO LONGER PANELS (Maryam, 31 Aug 2026: "what even is
        this UI?"). Every one of them carried §41's `1px solid var(--rule)` on
        `--layer-01`, so the page was three bordered boxes inside a bordered
        frame inside a section that closes itself with a rule — four edges deep
        before any content, and the two-column splits INSIDE the first two then
        drew a fifth. The frames are off, the blocks take the page's own gutter,
        and what separates them is one hairline each: after the profile, and
        above the checkout. Three blocks, two rules, no boxes. §02's opening
        note is the argument this belatedly follows — "depth is expressed as
        rhythm and rule weight, nothing else".

        THE `style="padding-top"` CAME OFF WITH THE MERGE — trap 1. It was
        beating §10's own top padding at both widths with an inline
        declaration no stylesheet could answer, to buy 8px against the `.ph`
        above. The page takes the section rhythm every other page takes. */}
  <div class="sec sec-bk">
    ${''/* THE BLOCK BESIDE THE PHOTOGRAPH IS `talRec`'S — 581:6460, Maryam,
          31 Aug 2026. The identity card here was its own drawing: five gold
          stars, the rating, the interview count, "Assesses E1–E3" and a green
          "Verified" word — three lines and eight objects saying what the
          dashboard's recommendation says in two. The two are the same subject
          on two pages, so they are one shape now: name, the green check, the
          single orange star with the figure, then the expertise line, then the
          fact row.

          THE MARKUP IS `talRec`'S VERBATIM AND NEEDS NO NEW CSS. Every §70.5
          selector for this family is written `.app .rec-…` rather than under
          `.rec`, so the block travels; `.agid` keeps the photograph's column
          and `.rec-b` is what sits in the second one.

          NO "NEXT SLOT" CELL (Maryam, same note). The recommendation card
          carries `a.slot` because it is the reason to press Book from a
          dashboard; this page IS the picker, so the next free time is the lit
          cell in `.daystrip` 200px below and naming another one above it is
          the disagreement `PAGESUM.agent` was removed for.

          THE EXPERTISE LINE AND THE BIO ARE BOTH GONE (Maryam, 31 Aug 2026),
          and with them the last two things on this block that were about the
          agent rather than about the booking. "Expertise: System Architecture,
          Assesses E1–E3" and "Fifteen years running operations teams…" are a
          profile, and this page is a picker — you arrive on it having already
          chosen, which is what the "Book <name>" title says. Both are still
          READ where choosing happens: `agentCardH` on All Agents carries the
          expertise, and `PAGESUM.agent` quotes the bio into Tal's summary in
          the head band 200px above this, so the sentence had been printed twice
          on one screen.

          `.rec-x` KEEPS TWO OTHER CALLERS (`V.enrol`'s leader tile and the
          cohort-lead row), so its rules are not the "gate nothing writes" tell
          and stay. `.agid-bio` keeps ai7's booking widget. Neither family is
          deleted — this page simply stops writing them. */}
    ${''/* THE BLOCK IS TWO COLUMNS AND THE RULE BETWEEN THEM IS THE WHOLE
          POINT. Left is the person — who they are and the two figures that
          belong to their profile. Right is what BUYING one costs, which is a
          different question, so it gets its own column rather than a full-width
          row underneath.

          THE RATING MOVED UNDER THE NAME (Maryam, 31 Aug 2026), which is now
          `talRec`'s shape EXACTLY rather than a second arrangement of the same
          three classes. The note that used to stand here said the rating stays
          on the name's line "because this page keeps the expertise line, so
          `.rec-top` still has two rows" — that was the whole of the reason, and
          removing the expertise line removed it. The two blocks are the same
          subject on two pages and they are now one shape, which is what §75's
          `.app .rec-…` scoping was for. */}
    <div class="bkp">
      <div class="agid">
        ${avatar(a,96)}
        <div class="rec-b">
          <div class="rec-top">
            <p class="rec-id"><span class="rec-who"><span class="rec-n">${a.n}</span>
                <span class="rec-v">${I.verified}</span></span></p>
            <p class="rec-r">${I.star}${a.r.toFixed(1)} &middot; ${a.ivs} interviews</p>
          </div>
          ${''/* COMPLIMENTARY SHOWS THE STRUCK PRICE "$95 Free", not the word
                 "Complimentary" + wallet mark (Maryam, 1 Oct 2026). `ivFeeLabel`
                 is the same label the dashboard rec card and booking fee use; the
                 charged case keeps the wallet + "$X Interview Fee". */}
          <p class="rec-f"><span>${ivCharged(isRe)?I.wallet+a.price+' Interview Fee':ivFeeLabel(false, a.price)}</span>
            <span>${I.video}${(rec||{}).mins||'45 mins call'}</span></p>
        </div>
      </div>
      ${''/* THE THREE PURCHASE FACTS CAME OFF AND THE BLOCK IS ONE COLUMN
            (Maryam, 31 Aug 2026). "Interview fee $95 / Length 45 minutes,
            recorded / Report turnaround Within 24 hours" was the reference's
            right-hand column and it survived four rewrites of this page; what
            it never survived is the question of what it ADDED. Two of the three
            are printed 40px to their left in `.rec-f` — "$95 Interview Fee" and
            "45 mins call" — so the block stated the fee twice and the length
            twice, in two different type pairs, either side of a divider whose
            job was to separate them from each other.

            THE FEE IS ALSO IN THE CHECKOUT ROW, which is where a price belongs
            on a page that ends in a Proceed button.

            WHAT IS ACTUALLY LOST IS "Within 24 hours" — the report turnaround,
            the one of the three this page did not already say twice. It is
            still true and `V.booking` still states it, but this page no longer
            does. Raised rather than assumed: if it should stay, it belongs
            beside the other two facts about the appointment in `.rec-f`, not in
            a column of its own.

            `.bkp-r`, `.bkp-f`, `.bkp-fi`, `.bkp-fl`, `.bkp-fv` and
            `.bkp-fv-acc` are written by nothing now, so §76's column and §63's
            two type roles go with the markup rather than being left as gates
            nothing writes. The divider goes too — it was a `border-left` on a
            column that no longer exists. */}
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
  ${''/* THE PICKER IS TWO NUMBERED STEPS AND THE "Pick a slot" HEADING IS GONE
        WITH THEM. One heading over two controls said the pair was one act; it
        is two, and the second depends on the first, which is exactly what a
        numeral in front of each says without a word of copy. It also buys the
        thing the old shape could not have: with the day named above the times,
        "Thursday, August 20" is READ rather than inferred from which cell in
        the row above is orange.

        THE HEADING IS A `<h3>`, NOT A `.sec-h`. §15's own slot-picker block
        keys on `.sec:has(> .daystrip)` and re-lays that section's `.sec-h` at
        desktop — a rule written for one heading over the whole width, which is
        the shape this replaces. Two headings inside a panel are not that
        section's heading, so the panel takes none and §76 draws the row.

        TRAP 13 DOES NOT BITE HERE and it is worth saying why rather than
        finding out: §10.15's 184px label column only reaches a `.sec` that
        CONTAINS a `.sec-h`, and neither of these two sections has one. That is
        the reason the picker keeps its own heading inside the panel rather than
        being given the section's — the opt-out list would have had to grow by a
        class, and §69/§73 both record how quietly that is lost again. */}
  ${''/* THE CALENDLY BOOKING IMAGE, IN THE SLOT THE PICKER USED TO HOLD.
        Maryam supplied it; it goes on the page as it is. It keeps `.bks-w`, so
        the page's rhythm is unchanged — §76.1's 32px either side of the two
        seams and §76.1b's centred 830px measure — and the picture fills it.

        A BASE64 EMBED (`CALENDLY_SHOT`), NOT A RELATIVE PATH — fixed 1 Oct 2026.
        It shipped as `src="build/calendly-booking.png"`, which resolves on a
        local `file://` open (the built HTML sits in `hifi/`, so `build/…` is
        `hifi/build/…`) but 404s on Vercel: the portal is served at `/candidate`
        and nothing maps `/build/`, so the image came back broken in production.
        build.py now inlines it like every other asset (see its `CALENDLY_SHOT`
        note), so it is host-independent. Still the embed-a-picture rule — a live
        Calendly iframe would replace the token, not the mechanism. */}
  <div class="bks-w">
    <img class="bkshot" src="${CALENDLY_SHOT}"
      alt="Calendly booking for ${a.n} — select a date and time">
  </div>

  ${''/* WHAT DO YOU WANT TO TALK ABOUT (16.3, Maryam, 15 Sep 2026). Filled at
        booking so it reaches the agent with the appointment. It is a plain form
        field in the same 830px `.bks-w` measure as the calendar, its value bound
        to `S.ivTopic` (trap 9, persisted by the `data-ivtopic` input handler),
        and echoed on the scheduled and held cards. */}
  <div class="bks-w">
    <div class="f"><label for="ivtopic">What do you want to talk about?</label>
      <textarea class="inp" id="ivtopic" rows="3" maxlength="300"
        placeholder="A real leadership situation from the last few months works best." data-ivtopic>${escHtml(S.ivTopic)}</textarea></div>
  </div>

  ${''/* THE PAGE CLOSES ON ONE BUTTON, AND IT REPLACED A FIXED BAR
        (Maryam, 31 Aug 2026). `.stickybar` — the one in either portal — was
        pinned to the bottom of the frame carrying the slot, the fee and
        "Continue to payment". It sat ON TOP of the ask dock's own reserved
        strip (§21.311 and §16.457 each push the dock and the FAB up 84px
        purely to clear it), so the foot of the frame was two floating rows
        deep, and the only thing on screen with a price on it was a slab that
        scrolled with nothing.

        THE THREE FACTS DID NOT COME WITH IT, AND THAT IS THE SECOND PASS. A
        `.plate` stood here for one build restating "Your slot · Thursday 20
        August at 6:30 PM · Interview fee $95" — and every one of those is
        already on the page: the day and the time are the two lit cells in the
        picker directly above, and the fee is the first cell of the `.facts`
        row. A summary card 40px under the thing it summarises is the page
        printed twice, so what is left is the ACTION, which is the one thing
        the page did not have.

        IT IS BLACK AND IT IS LEFT-ALIGNED. `.btn-p` in page flow is the
        product's primary — the black button "Back to my dashboard" and "Book
        Priya Now" are — and it is only the accent gradient INSIDE a plate,
        which §19 states and the design-system note records. Taking the plate
        away is therefore what makes the button black; there is no colour
        stated here. It also takes the card out of `DARK_CARD`, so `placeDark`
        no longer has anything to lift and `keep-place` is not needed.

        THE FIGURE IS A LITERAL $695 AND IT IS MARYAM'S, TWICE ASKED FOR
        (31 Aug 2026, reaffirmed after this was flagged). It was written
        `${'$'}{a.price}` first, on this file's own rule — do not type a number a
        record owns — which renders $95 for Priya, $85 for Owen, $80 for Lena.
        It is a literal now because the instruction was explicit and repeated.

        WHAT IS STILL OUT OF STEP, SO THE NEXT READER DOES NOT THINK IT IS
        SETTLED: nothing else in the build says 695. The `.facts` row on this
        same page prints `a.price`, the agent card you arrived from prints it,
        `V.booking`'s Paid row prints it, and `AGENTS` is where all three read
        it. If 695 is the real fee, the fix is `AGENTS.<agent>.price` and all
        four surfaces follow; if it is the fee plus something this page does not
        draw, the something belongs on the page before the total does. */}
  ${''/* AND THE CHECKOUT IS A ROW, NOT A LOOSE BUTTON (Maryam, 31 Aug 2026).
        The button had a section of its own with nothing else in it, so the page
        ended on 40px of black in a field of white and the transaction had no
        boundary — you could not tell whether the button belonged to the picker
        above it or to the page. It is a row now: what it costs on the left, the
        action on the right.

        THE BOUNDARY IS A RULE ABOVE IT, NOT A BOX ROUND IT (Maryam, 31 Aug
        2026, same pass as the other two). The four-sided border was doing one
        job — separating the transaction from the picker — and three sides of it
        were paying for that one. A hairline above says the same thing and is
        the same object the profile block closes on 400px higher, so the page
        reads as three blocks divided twice rather than as three boxes.

        "SECURE & ENCRYPTED PAYMENT" WENT WITH IT. It was the one piece of new
        copy on the page and it was true — `ai7`'s note is explicit that the fee
        is taken by Stripe on its own hosted page — but true is not the test for
        a line that sits beside the button it qualifies. It was reassurance
        offered before anything had been asked for, on a screen that does not
        draw a card field, and with the box gone it was a grey sentence floating
        between a figure and a black button. The handoff still says it: the next
        screen is Stripe's. `.bkc-s` goes from §76 and §63 with the markup.

        IT IS STILL NOT `.stickybar`, AND THAT IS THE SAME DECISION AS BEFORE.
        The bar this replaced was `position:fixed` and sat ON TOP of the ask
        dock's reserved strip — §21.311 and §16.457 each push the dock up 84px
        purely to clear it — so the foot of the frame was two floating rows
        deep. This is in page flow. The reference's is too: it scrolls with the
        page and is simply the last thing on it.

        THE BUTTON STAYS BLACK. `.btn-p` in page flow is the product's primary
        and the accent gradient is what it takes INSIDE a plate (§19, and §75
        for the recommendation's black card). The reference's is orange because
        everything else on its page is violet; ours is orange only where it is
        the one lit thing on a dark ground, and this row is white.

        THE FEE AND THE BUTTON DISAGREE, AND THIS ROW IS WHERE IT BECAME
        VISIBLE. `$695` is a literal and it is Maryam's, twice asked for
        (31 Aug 2026, reaffirmed after being flagged); every other surface in
        the build reads `AGENTS.<agent>.price`, which is $95 for Priya — the
        `.rec-f` chip in the panel above, that panel's first fact, the agent
        card you arrived from, and `V.booking`'s Paid row. Those two figures
        used to sit ~600px apart down a column and now sit on one line, which is
        the reference's structure doing what a checkout row is for: it puts the
        price beside the total. THE STRUCTURE IS NOT THE BUG. If 695 is the real
        fee the fix is `AGENTS.<agent>.price` and all five surfaces follow; if
        it is the fee plus something this page does not draw, that something
        belongs in this row as a second line before the total does. */}
  ${''/* PAYMENT ALREADY HAPPENED ON THE CHECKOUT STEP (Maryam, 19 Sep 2026):
        booking now OPENS on `V.checkout` (via `agent:<k>`), so by the time the
        reader reaches this calendar the card is captured (first interview, $0) or
        the fee is charged (re-interview). This is the LAST step — it confirms the
        chosen time and nothing more. The fee row and "Proceed to pay/book" are
        gone; the fee lives on the payment step. */}
  <div class="bks-w bkpay">
    ${''/* PAYING LANDS ON THE DASHBOARD, NOT ON A CONFIRMATION SCREEN (Maryam,
           31 Aug 2026: "rather than this screen after the payment, i would like
           to take the user directly on the dashboard where it now goes on
           clicking 'Back to dashboard'").

           `stage:booked` IS EXACTLY WHERE `V.booking`'s OWN BUTTON WENT, so
           this removes a screen from the path rather than changing the
           destination: the confirmation said "Interview booked", printed the
           agent, the time and the fee, and offered one black button to the
           dashboard — where the `booked` dashboard's own plate says the same
           three facts and offers Join. One press, one page.

           IT IS `stage:booked`, NOT `dashboard`. `go()`'s `stage:` branch runs
           `setStage`, which is what actually moves the journey on — a plain
           `data-go="dashboard"` would land on the `new` dashboard with nothing
           booked. The `booked` stage is the confirmation.

           WHAT THIS ORPHANS: `V.booking` now has no button pointing at it
           anywhere in the build. It is NOT deleted — it is still in the
           verification sweep's `reachable` list, still addressable as
           `#<stage>/booking`, and `bkStamp` (ai7) still fills it from the real
           choice — but if it is not wanted, that view and its `PARENT` entry go
           together. Recorded here rather than left for a grep. */}
    ${''/* PROCEED NOW LANDS ON THE CHECKOUT (`V.checkout`), NOT STRAIGHT ON THE
           BOOKED DASHBOARD (Maryam, 6 Sep 2026: "we need to show the saved cards
           on the next screen for the user to select the card for payment"). That
           screen carries the card-picker and its own "Pay" button, which is what
           now carries `stage:booked` — so the commit point moved one screen on,
           and the destination did not. */}
    ${''/* A COMPLIMENTARY BOOKING SKIPS THE CHECKOUT SCREEN (Maryam, 18 Sep 2026:
          "no need to show this screen") — there is nothing to pay, so Proceed
          books straight away (`data-book`) and the success dialog opens on the
          booked dashboard. A CHARGED re-interview still goes to `V.checkout` for
          the card picker, and confirms there. */}
    <div class="bkpay-go"><button class="btn btn-p" data-book="1">Confirm booking ${I.arrowRight}</button></div>
  </div>
  </div>
</div></main>`;
};

V.checkout = (f) => {
  const a = AGENTS[S.agent||'priya'];
  const rec = REC[S.agent||'priya'];
  const isRe = !!f.reinterview;  /* first interview complimentary, re paid */
  const charged = ivCharged(isRe);
  const first = a.n.split(' ')[0];
  return `<main class="main"><div class="page">
  ${ph('Payment', null, null, 'agents')}
  ${''/* THE AGENT HEAD MIRRORS V.agent's `.bkp` (Maryam, 9 Sep 2026) so moving
        between the payment step and the calendar only swaps the card, not the
        width — the same 830px `.bks-w` measure holds both. */}
  <div class="sec sec-bk">
    <div class="bkp">
      <div class="agid">
        ${avatar(a,96)}
        <div class="rec-b">
          <div class="rec-top">
            <p class="rec-id"><span class="rec-who"><span class="rec-n">${a.n}</span>
                <span class="rec-v">${I.verified}</span></span></p>
            <p class="rec-r">${I.star}${a.r.toFixed(1)} &middot; ${a.ivs} interviews</p>
          </div>
          ${''/* COMPLIMENTARY SHOWS THE STRUCK PRICE "$95 Free", not the word
                 "Complimentary" + wallet mark (Maryam, 1 Oct 2026). `ivFeeLabel`
                 is the same label the dashboard rec card and booking fee use; the
                 charged case keeps the wallet + "$X Interview Fee". */}
          <p class="rec-f"><span>${ivCharged(isRe)?I.wallet+a.price+' Interview Fee':ivFeeLabel(false, a.price)}</span>
            <span>${I.video}${(rec||{}).mins||'45 mins call'}</span></p>
        </div>
      </div>
    </div>
    ${''/* FREE (first interview): NO card is on file yet, so the screen shows an
          EMPTY-STATE placeholder (a card glyph + "No payment method added yet"),
          never a saved card (Maryam, 19 Sep 2026). "Add a card" opens the Stripe
          modal, and closing it flips `S.pmAdded` — the empty state is then replaced
          by the saved card AND the CTA "Continue to Pay" appears. WHILE NO CARD IS
          ON FILE THERE IS NO BUTTON (Maryam, 19 Sep 2026: "remove button when no
          payment method is added") — you cannot continue without adding one. PAID
          (re-interview): the saved-cards picker, the fee on the button, always
          shown. Either way `data-payok` raises the success dialog — it does NOT
          commit the booking (the calendar does). */}
    <div class="bks-w bkpay">
      ${charged
        ? `<div class="sec-h"><h2>Pay with</h2>${addCardAct}</div>
      ${cardPicker()}`
        : `<div class="tile"><p class="t-body-01">Your first interview with ${first} is <b>complimentary</b>, so <b>$0</b> is charged today. Add a payment method to continue; it is saved securely for your next booking.</p></div>
      <div class="sec-h"><h2>Payment method</h2>${addCardAct}</div>
      ${S.pmAdded
        ? cardPicker()
        : `<div class="empty pm-empty">${I.creditCard}<h3>No payment method added yet</h3><p>Add a card to continue. Your first interview is complimentary, so nothing is charged today.</p></div>`}`}
      ${(charged || S.pmAdded)
        ? `<div class="bkpay-go"><button class="btn btn-p" data-payok="1">${charged?'Pay '+a.price:'Continue to Pay'} ${I.arrowRight}</button></div>`
        : ''}
    </div>
  </div>
  </div></main>`;
};

const paySuccessModal = () => {
  const a = AGENTS[S.agent||'priya'] || AGENTS.priya;
  const isRe = !!cfg(S.stage).reinterview;
  const charged = ivCharged(isRe);
  return `<div class="modal on" data-close="paysuccess">
    <div class="sheet conf conf-ok" role="dialog" aria-modal="true" aria-label="Payment successful">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.checkFilled}</span>
        <h2 class="conf-t">Payment successful</h2>
        ${''/* THE AMOUNT IS ITS OWN ROW, not a figure buried in the copy (Maryam,
              19 Sep 2026): an "Interview Fee" label over the value, reusing the
              booking page's own fee treatment (`.bkc-fee`/`.bkc-fl`/`.bkc-fv`). A
              complimentary first interview shows the standard fee STRUCK with
              "Free" beside it (`ivFeeLabel`); a re-interview shows the charged
              amount. The copy then explains, without repeating the figure. */}
        <div class="bkc-fee pay-fee" style="align-items:center"><span class="bkc-fl">Interview Fee</span>
          <span class="bkc-fv">${charged ? a.price : ivFeeLabel(false, a.price)}</span></div>
        <p class="conf-x">${charged
          ? `Your payment was successfully processed. You can now continue to select a time for your interview.`
          : `Your first interview is complimentary. No payment was charged, and your payment method is saved for future bookings.`}</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-p noic" data-paygo="${S.agent||'priya'}">Pick a slot</button>
      </div>
    </div>
  </div>`;
};


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
  ${''/* THE RECEIPT IS THE TWO COMPONENTS THIS PRODUCT ALREADY HAS (Maryam,
        31 Aug 2026). It was a `.tile` holding a 40px `row-lead` and three `.kv`
        bands — a 184px label column with one short value beside it, three times,
        under a name in a smaller type than the page it confirms.

        THE PERSON IS `talRec`'S BLOCK, the one `V.agent` now opens with, so the
        agent you chose is drawn the same way on the page where you chose her,
        the page that confirms it and the dashboard that reminds you. 96px
        rather than 40: this is the subject of the receipt, not a row in it.

        THE THREE FACTS ARE `.facts.eo-facts`, the row with the marks and the
        centred dividers — the same cell the Enroll page's four figures use and
        the same one `V.agent` states the fee, the length and the turnaround in.
        Three cells, so §73's grid sizes three tracks (it counts its children).

        THE MARKS ARE THE SUBJECTS, per `PH_IC`'s own rule: a calendar for when,
        a clock for how long, a wallet for what was paid. No accent on any of
        them — `.eo-fv-acc` is for a figure that is a DECISION, and this page is
        the decision already taken.

        THE PORTRAIT IS 56 AND THE ROW HAS AIR UNDER IT (Maryam, 31 Aug 2026).
        `.agid`'s 96 — 112 at desktop — is sized for `V.agent`, where the block
        beside it is three rows and a bio; here it is two, so the photograph ran
        40px past the words and the pair read as a picture with a caption rather
        than as one row. 56 is the height of the two lines it sits beside, and
        `avatar()` writes the size inline, which is trap 1 working FOR us: the
        inline value beats §15's `.agid > .av-ph` without a rule and without
        touching the page that wants 96.

        `mt6` on the figures is the space asked for: `.eo-facts`' own 20px top
        padding is the gap between a HEADING and its cells, and this row follows
        a person rather than a heading. */}
  <div class="sec">
    <div class="agid">
      ${avatar(a,56)}
      <div class="rec-b">
        <div class="rec-top">
          <p class="rec-id"><span class="rec-who"><span class="rec-n">${a.n}</span>
              <span class="rec-v">${I.verified}</span></span>
            <span class="rec-r">${I.star}${a.r.toFixed(1)} &middot; ${a.ivs} interviews</span></p>
          <p class="rec-x"><b>Talent agent,</b> assesses ${a.range}</p>
        </div>
      </div>
    </div>
    <div class="facts eo-facts mt6">
      ${[[I.calendar,'When',  'Thu, Aug 20 &middot; 6:30 PM ET'],
         [I.time,    'Length','45 minutes, recorded'],
         [I.wallet,  'Paid',  `${a.price} &middot; Visa ending 4242`]
        ].map(([ic,lab,val])=>`<div>
        <i class="eo-fi">${ic}</i>
        <span class="eo-fb"><span class="eo-fl">${lab}</span>
          <span class="eo-fv">${val}</span></span>
      </div>`).join('')}
    </div>
  </div>
  <div class="sec"><button class="btn btn-p" data-go="stage:booked">Back to my dashboard ${I.arrowRight}</button></div>
</div></main>`;
};

const COHORT_LEAD = {
  n:'Priya Nair', i:'PN', img:AV.priya,
  since:'March 2024',
  range:'E1–E3',
  expertise:'System Architecture',
};

const COHORT_LEAD_E4 = {
  n:AGENTS.lena.n, i:AGENTS.lena.i, img:AGENTS.lena.img,
  range:AGENTS.lena.range,
  since:'January 2025'
};

function leaderCard(co, lab){
  const L = COHORT_LEAD;
  return `<div class="tile">
    ${lab?`<span class="lbl">${lab}</span>`:''}
    <div class="row-lead">
      ${avatar(L,48)}
      <div style="flex:1">
        <div class="t-heading-compact-01">${L.n}</div>
        <div class="t-helper-01 mt3">Cohort leader &middot; leading cohorts since ${L.since}</div>
      </div>
    </div>
    ${''/* NO FACT ROWS ABOUT THE CALL. The card carried "On the call" and
          "Between calls", and both are LOGISTICS rather than facts about the
          person: on the Enroll page they are two of the six rows in "How your
          cohort works" a screen below, and on the confirmation they are steps
          2 and 3 of "What happens next". Said in both places the card stopped
          being an introduction and became a second timetable — and it is the
          first block on the page now, where the reader is asking who this is
          and not when the call is. Maryam's cut, 28 Aug 2026.

          THE ONE ROW LEFT IS THE ONE THAT IS NOT LOGISTICS. "Leads Cohort 41"
          is the assignment itself, it is the fact the confirmation page exists
          to deliver, and it is true of nothing else on that screen. It is also
          why this stays a `.kv` rather than becoming a third line under the
          name: a key and a value is what the product draws for an assignment. */}
    ${co?`<div class="kv mt5"><span class="k">Leads</span><span class="v">Cohort ${co} &middot; ten of you at Explorer &ndash; E3</span></div>`:''}
  </div>`;
}

const RPT_GROWTH = ['Delegation Without Drop-Off','Coaching vs Fixing']
  .map(t => CH.findIndex(c => c[0] === t));

const ENROL_CREDIT = {E3:'Interview already paid', E4:'Returning candidate credit'};
const LEARN = [
  'Decide with incomplete information and explain the call afterwards',
  'Hand work over without it dropping, and without taking it back',
  'Say the hard thing directly, and give feedback that lands',
  'Coach people through a problem instead of fixing it for them',
  'Hold a team steady through conflict, repair and change'
];

const CH_SYL = [
  {learn:['Say what the business is for in one sentence other people repeat',
          'Trace your own work back to the outcome it is paid for',
          'Tell a value the company lives from a slogan on a wall'],
   skills:['Purpose','Business literacy','Strategic context','Storytelling']},
  {learn:['Take a problem end to end instead of passing it on',
          'Pick the smallest change that moves the number',
          'Tell being busy apart from being effective'],
   skills:['Ownership','Prioritisation','Execution','Bias to action']},
  {learn:['Notice what a room is not saying, and name it safely',
          'Read when agreement in a meeting is not agreement',
          'Change how you say a thing for who is in front of you'],
   skills:['Situational awareness','Listening','Reading stakeholders','Influence']},
  {learn:[LEARN[1],
          'Agree the check-in before the work starts, not after it slips',
          'Match how closely you follow up to how much is at stake'],
   skills:['Delegation','Accountability','Trust','Follow-through']},
  {learn:['Open a hard conversation without it being an ambush',
          'Say the thing once, plainly, and early',
          'Stay in the conversation after the other person reacts'],
   skills:['Directness','Difficult conversations','Candour','Composure']},
  {learn:['Be useful enough to be trusted inside the first week',
          'Make small commitments in public and keep them',
          'Repair trust quickly when you get something wrong'],
   skills:['Trust','Credibility','Reliability','Building relationships']},
  {learn:[LEARN[0],
          'Separate a decision you can reverse from one you cannot',
          'Name what would change your mind before you commit'],
   skills:['Decisiveness','Judgement','Weighing risk','Reasoning out loud']},
  {learn:['Give your manager the version of the problem they can act on',
          'Ask for a decision rather than for permission',
          'Disagree with someone senior and keep the relationship'],
   skills:['Managing up','Escalation','Written updates','Stakeholder management']},
  {learn:['Give feedback that changes what happens next',
          'Separate what somebody did from who they are',
          'Ask for feedback in a way that gets you the real answer'],
   skills:['Feedback','Directness','Developing people','Growth conversations']},
  {learn:['Run a weekly meeting people leave knowing what to do',
          'Keep one list that tells you what is actually moving',
          'Close last week before you open this one'],
   skills:['Operating rhythm','Running meetings','Planning','Follow-through']},
  {learn:['Take the heat out of a disagreement without avoiding it',
          'Hold a team steady while two people are still angry',
          'Repair a working relationship after it has broken'],
   skills:['Handling conflict','Repair','Mediation','Composure']},
  {learn:[LEARN[3],
          'Ask the question instead of giving the answer',
          'Know when coaching is the wrong tool and step in'],
   skills:['Coaching','Questioning','Developing people','Restraint']},
  {learn:['Keep the work going while the ground moves',
          'Say what you know, what you do not, and when you will know',
          'Take a team through a change nobody chose'],
   skills:['Leading change','Communication','Resilience','Composure']}
];

const outlSec = (t, items) => `<h3 class="skl-h">${t}</h3>${items}`;

const outlCert = (lvl) => `<div class="acc-i ol-cert">
      <div class="cardrow">
        ${''/* THE REAL BADGE, NOT A GLYPH (Maryam, 3 Sep 2026: "show a real
               badge instead of icon"). It was `I.certificate` in §02's 40px
               `.cardrow-ic` chip — a line drawing of the CATEGORY, which is
               `ACH`'s own argument against a generic shield read one component
               over ("a generic glyph of a shield is a picture of the category
               instead").

               `CERT_ART.explorer` IS THE RIGHT ONE OF THE SIX AND IT IS NOT A
               GUESS. `certAll` stamps `k:'explorer'` on the LEVEL certificate
               — the two `CERTS` rows — and this row is that certificate before
               it is earned ("Earn your Explorer Track – E4 certificate"). The
               other five badges in `CERT_ART` are the `CERTIFS` achievements,
               each with a gate; none of them is what finishing thirteen
               chapters issues.

               `.crt-art` RATHER THAN A NEW CLASS, so the badge is the same
               object §96 draws in the certificate grid and §105 draws in the
               profile — one picture, one wrapper, three sizes. §110.1d
               re-points `--crt-art-w/h` for a row, which is exactly how §105
               fits it into a half-width column.

               AND THE CHIP GOES WITH THE GLYPH. §02's `.cardrow-ic` is a 40px
               tinted square, which behind a photographic badge is a box behind
               a picture — §72's "a bare mark holds the line alone" and §106's
               "artwork is not a face" are the same call. */}
        <span class="crt-art ol-cert-art"><img src="${CERT_ART.explorer}" alt=""></span>
        <span class="cardrow-b">
          <span class="cardrow-t">Earn your Explorer Track &ndash; ${lvl} certificate</span>
          <span class="cardrow-d">Issued when all ${CH.length} chapters are done, signed by your cohort leader, and yours to download or share by link.</span>
        </span>
      </div>
    </div>`;

const outlineSec = (lvl) => `<div class="sec">
    <div class="sec-h"><h2>Course Outline</h2></div>
    <div class="acc ol">
      ${CH.map(([t, mins], i) => {
        const s = CH_SYL[i];
        return `<div class="acc-i${S.outl === i ? ' on' : ''}">
        ${''/* "CHAPTER DETAILS" APPEARS UNDER THE POINTER (Maryam, 3 Sep 2026:
               "you see on coursera, on hover the course details button
               appears"). Two things about it are not guessable:

               IT IS `display:none`, NOT `visibility:hidden`. Hidden reserves
               the label's width, so the chevron would sit ~120px in from the
               right edge on all thirteen rows with a phantom gap beside it —
               the reference keeps the chevron on the rail and lets the label
               appear to its LEFT, which is what `display` gives. `.ttl` is
               `flex:1` and absorbs the slack, so the title's text does not
               move when the label arrives. NOT `opacity` either: trap 2 —
               §13 runs its entrances with `fill-mode:both` and a resting
               state on opacity fights a keyframe.

               AND THE ROW CARRIES `.ol-row` SO THE HOVER CAN BE ARMED. Trap 6:
               `build.py` rewrites every `:hover` to `:hover:where(.__nh)`
               unless its compound is in `HOVER_KEEP`, and `.__nh` is on no
               element — so a hover written on `.acc-h` would simply never
               match. `.acc-h` cannot go in that list either: it would arm
               §04.53's row wash and §10.711's everywhere in the product. A
               class of its own is the narrow thing to name.

               "CHAPTER details", not "Course details" — the reference's rows
               are courses and ours are the chapters of one. */}
        <button class="acc-h ol-row" data-outl="${i}" aria-expanded="${S.outl === i ? 'true' : 'false'}">
          <span class="ttl"><span class="ol-t">${t}</span><span class="ol-m t-desc">Chapter ${i + 1} &middot; ${mins} min</span></span>
          <span class="ol-cd">Chapter details</span>
          <span class="chev">${I.chevDown}</span></button>
        <div class="acc-b">
          ${s ? outlSec('What you&rsquo;ll learn', `<ul class="lrn">
            ${s.learn.map(l => `<li class="lrn-i"><span class="lrn-tk">${I.check}</span><span class="lrn-t">${l}</span></li>`).join('')}
          </ul>`) : ''}
          ${s ? outlSec('Skills you&rsquo;ll gain', `<div class="skl">
            ${s.skills.map(k => `<span class="skl-c">${k}</span>`).join('')}
          </div>`) : ''}
        </div></div>`;
      }).join('')}
      ${outlCert(lvl)}
    </div>
  </div>`;

const checkoutPlate = lvl => `<div class="sec">
    <div class="plate">
      <div class="plate-t">Your enrolment</div>
      <div class="plate-d">One payment, and the re-interview that can move you up is included.</div>
      <div class="plate-b">Course fee <b>$690</b> &middot; ${ENROL_CREDIT[lvl]} <b>&minus;$95</b> &middot; Due today <b>$595</b></div>
      <div class="note acc plate-n"><span>${I.calendar}</span><div class="nb"><b>${ENROL_OPENS[lvl][0]}</b>${ENROL_OPENS[lvl][1]?`<span class="sub">${ENROL_OPENS[lvl][1]}</span>`:''}</div></div>
      <div class="plate-a">
        <button class="btn btn-p btn-sm noic" data-go="payment">Continue to payment ${I.arrowRight}</button>
      </div>
    </div>
  </div>`;

V.enrol = (f) => {
  const next = f.complete;
  const lvl = next?'E4':'E3';
  const [g1,g2] = RPT_GROWTH;
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],next?'Next course':'Course Enrollment')}
  ${''/* A `&middot;` SPINE, NOT A SENTENCE. Tal's summary used to open "90
        days, 13 chapters and a cohort of ten with a live leader" — this line
        with two commas moved. The facts stay here where a description belongs
        and Tal keeps the commitment, which is the hours. See the note over
        `ph()`.

        AND IT GOES THROUGH `ph()` NOW. This page hand-wrote the `.ph` — a
        `.ph-top` and a bare `<p>` — which predates `phSub`, so it was the one
        `&middot;` row in the candidate portal with no marks on its facts while
        every other page had them. Byte-identical markup otherwise. */}
  ${ph(`Explorer Track &ndash; ${lvl}`,'90 days &middot; 13 chapters &middot; a cohort of ten with a live leader')}
  ${''/* THE LEADER IS A PERSON, NOT A GREY NOTE.
        This block was `.note` + `I.group` + "Your cohort is assigned for you",
        which is the only thing on a $595 page that said anything about who you
        would be doing it with — and it said it as a disclaimer. A candidate is
        buying thirteen Thursdays with a named person; she gets the component
        the product already uses for that (see `leaderCard`). The sentence the
        note was carrying — that the cohort is assigned rather than chosen — is
        a mechanic and moved into "How your cohort works", which is where the
        mechanics now are.

        IT IS A FACE, A NAME AND A ROLE LINE, AND THAT IS THE WHOLE CARD. It
        opened with two fact rows about the call and a sentence in her own
        voice, and both were cut when the block moved to the top of the page
        (the notes in `leaderCard` and on `COHORT_LEAD` are the argument for
        each). What is left is what a reader in the first two inches of the
        page is actually asking, which is who.

        AND THE SUBTRACTION TOOK THE LABEL-COLUMN OPT-OUT WITH IT — trap 13,
        the mirror of §65.1a. The section was opting out through
        `.sec:has(.kv)` because of those two rows; with them gone it fell into
        the 184px column at desktop and nothing warned. §69.3 restates the
        opt-out on `:has(> .tile > .row-lead)`, which is the honest condition —
        a card whose subject is a person. Read that note before adding or
        removing anything from this card.

        THE E4 PAGE DOES NOT DRAW IT, AND THAT IS ABOUT PRIYA RATHER THAN ABOUT
        THE BLOCK. `COHORT_LEAD` is one person and her range is E1–E3 — the
        three cohorts `LEAD_COHORTS` gives her are E3, E1 and E2 — so naming
        her as the leader of an E4 cohort is the one thing on this page that
        would be false. There is no second leader in the prototype and
        inventing one to fill a section is worse than the section being
        absent; what a leader IS is the second row of "How your cohort works",
        on both levels. */}
  ${''/* THE PAGE IS THREE BLOCKS NOW (Maryam, 1 Sep 2026): Tal's summary, the
        black enrolment card, and what you'll learn. Four sections came off and
        each one is accounted for below — none of them is a figure that now
        appears nowhere.

        THE CHECKOUT PLATE WENT AND `V.payment` ALREADY HELD ITS THREE FIGURES.
        `checkoutPlate` was "Course fee $690 / Interview already paid −$95 / Due
        today $595" with "Continue to payment" under it. The payment page states
        all three as `.kv` rows — $690, Interview credit −$95, Total $595 — and
        its button reads "Pay $595 and start", so the breakdown is one press away
        and unchanged. What the black card carries instead is the fee and the
        four things it buys; the CREDIT is the one line that is now only on
        `V.payment`, which is where a credit belongs.

        THE COHORT LEADER CARD WENT. Priya is named on this page by Tal's
        summary and, one step later, by `V.welcome`'s "Leads Cohort 41" —
        which is the receipt, and the point at which she becomes yours.

        "HOW YOUR COHORT WORKS" WENT, AND IT IS THE ONE REAL SUBTRACTION. Six
        `.kv` rows — who is in it, who leads it, the weekly call, between calls,
        if you miss one, which cohort — and they exist nowhere else in the build.
        Flagged rather than quietly dropped: if they should stay, they are the
        §65 disclosure again with `key:'cohort'` and `discOpen` is untouched.

        "WHAT YOU GET" WENT because the black card's own `.facts` row is four
        figures about the same purchase — Chapters 13, Assessments 13, Cohort of
        10 — and the two rows disagreed on nothing. Live calls and Day 91 are
        said by the lede and by Tal.

        THE ACTION IS THIS PAGE'S, NOT THE DASHBOARD'S. `enrolOffer` takes the
        button as a second argument for exactly this: on a dashboard it opens
        this page, and here it goes to payment. Without it the CTA would be a
        link to the page it is on. */}
  ${enrolOffer(lvl, `<button class="btn btn-p btn-sm noic" data-go="payment">Continue to payment ${I.arrowRight}</button>`)}
  ${outlineSec(lvl)}
</div></main>`;
};

V.payment = (f) => {
  const lvl = f.complete ? 'E4' : 'E3';
  return `<main class="main"><div class="page">
  ${crumb(['Course Enrollment','enrol'],'Payment')}
  ${''/* The last clause was a sentence spliced onto a `&middot;` row, and Tal
        below said it as one — "your cohort is assigned as soon as it clears".
        A spine states, it does not promise. */}
  ${''/* NO FACT ROW — THE DASHBOARD OWNS THESE THREE. Maryam's rule: the `·`
        row under the dashboard's greeting ("Explorer Track – E4 · Level 4 of 15
        · Cohort 41 closed") is the HOME page's, and no other page reprints it.
        This one opened on "Explorer Track – E3" and named the 90 days and the
        thirteen chapters — the track and the level said again on a page about
        paying for a course, and the two counts said a third time by the `.stats`
        strip forty pixels below.

        The rule over `ph()` is unchanged and this is inside it, not an exception
        to it: a page with no spine of its own passes `title` alone, and once the
        borrowed facts come off this page has none left that the block under the
        heading does not already carry. Tal's summary is the opening line. */}
  ${ph('Payment')}
  ${''/* THE PREVIOUS SCREEN'S BLACK CARD RIDES ON TOP, MINUS ITS CTA — Maryam,
        9 Sep 2026 ("on the payment screen show the previous screen's black card
        of the course; do not give the payment button in the card since the user
        is already on the payment screen; show the payment details below in less
        width, just like the payment screen of booking an agent"). So this now
        MIRRORS `V.checkout`: the block the reader came from stays on top — there
        the Calendly agent head, here the course's `enrolOffer` card — and the
        paying happens in the narrower `.bks-w` column (§76.1b) rather than
        rail-to-rail. `enrolOffer(lvl, false)` is the same card `V.enrol` draws
        with its "Continue to payment" action SUPPRESSED (the `false` third state
        at its call site), because the CTA's destination is the page it is on;
        the card's own fee, chapters and cohort are what the reader is confirming
        they are buying. */}
  ${enrolOffer(lvl, false)}
  ${''/* PAY FROM A SAVED CARD, NOT A RE-TYPED ONE (Maryam, 6 Sep 2026: "we need
        to show the saved cards here as well"). The hand-drawn card form (number,
        name, expiry, CVC, ZIP, "save this card") is gone — `cardPicker` lists the
        cards on file with the default selected, and "Add a card" opens the shared
        Stripe modal. A `.tile-stack` opts the headed section out of §10.15's
        label column. */}
  ${''/* THE PAGE IS THE CARD PICKER AND THE PAY BUTTON, NOTHING ELSE (Maryam,
        7 Sep 2026: "remove the summary from paying screen", "remove the … Total
        $595 section", "remove the Full refund … line"). The Tal band is gone
        (its `PAGESUM.payment` entry removed), the order breakdown is gone, and
        the refund line is gone. "Add a card" rides the heading; the price is on
        the button. */}
  <div class="sec sec-bk">
    <div class="bks-w bkpay">
    <div class="sec-h"><h2>Pay with</h2>${addCardAct}</div>
    ${cardPicker()}
    ${''/* PAYING LANDS ON WEEK 1 WITH THE RECEIPT AS A DIALOG OVER IT
          (Maryam, 3 Sep 2026: "instead of this screen, i want you to take the
          user on the next prototype that is Week 1 but on that view, a modal
          of success icon on top and then 'Successfully enrolled' with some
          description, and a secondary button 'Close'").

          IT IS A REVERSAL AND THE ARGUMENT IT REVERSES IS KEPT, because it is
          still true and it is what the dialog's copy has to answer. This went
          straight to `stage:week1` once before; it was moved to `V.welcome` on
          the reading that "the dashboard in the middle of the 90 days, with a
          chapter already unlocked, is a strange place to be thirty seconds
          after paying and confirms nothing". The second half of that is what
          `enrolSheet` now does — it confirms, on top of the page, and nothing
          else on the screen has to carry the receipt. The FIRST half stands and
          is a real cost: the reader lands on a course that has already started.
          So the dialog's description says what is true of that page (chapter 1
          open today) rather than `V.welcome`'s "nothing is due until chapter 1
          unlocks", which would contradict the dashboard behind it.

          `data-paid` RATHER THAN `data-go="stage:week1"`, because the button has
          to do two things and `go()`'s `stage:` branch can only do one. The
          handler sets the flag and THEN calls `setStage`, which renders once —
          see its own note for why that order is the whole of the mechanism.

          `V.welcome` IS STILL IN THE BUILD AND IS NOW REACHED BY NOTHING. Its
          receipt row, its two cards and "What happens next" are all one hash
          away (`#assessed/welcome`) and none of it is drawn in the flow. Left
          rather than deleted, because taking it out takes §69.6's `.wpair`
          grid, `leaderCard`'s `lab` argument, `PAGESUM.welcome`, the `welcome`
          rows in `PARENT` / `TALCTX` / ai4's crumb table and two entries in
          `respcheck.mjs` with it — a screen's worth of deletion that this ask
          does not name. */}
    <div class="bkpay-go"><button class="btn btn-p" data-paid="1">Pay $595 and start ${I.arrowRight}</button></div>
    </div>
  </div>
</div></main>`;
};

const enrolSheet = () => {
  return `<div class="modal on" data-close="enrolok">
    <div class="sheet conf conf-ok" role="dialog" aria-modal="true" aria-label="Successfully enrolled">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.checkFilled}</span>
        <h2 class="conf-t">Successfully enrolled</h2>
        ${''/* THE FEE IS ITS OWN ROW, like the pay-success dialog (Maryam, 20 Sep
              2026): a "Course Fee" label over the amount, the shared
              `.bkc-fee`/`.bkc-fl`/`.bkc-fv` treatment centred in `.pay-fee`. The
              copy no longer repeats the figure. $595 is the enrol flow's own
              due-today literal (course $690 less the $95 interview credit). */}
        <div class="bkc-fee pay-fee" style="align-items:center"><span class="bkc-fl">Course Fee</span>
          <span class="bkc-fv">$595</span></div>
        <p class="conf-x">Your payment was successful, and your enrollment is confirmed. You&rsquo;re all set to begin your TalentNext journey.</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-s noic" data-enrolok="0">Close</button>
      </div>
    </div>
  </div>`;
};

const ivBookedModal = () => {
  const k = (S.booking && S.booking.agent) || (S.bk && S.bk.agent) || S.agent || 'priya';
  const a = AGENTS[k] || AGENTS.priya;
  return `<div class="modal on" data-close="ivbooked">
    <div class="sheet conf conf-ok" role="dialog" aria-modal="true" aria-label="Interview booked">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.checkFilled}</span>
        <h2 class="conf-t">Interview booked</h2>
        <p class="conf-x">Your time with ${a.n} is confirmed. It is on your dashboard, and the interview is what sets your level.</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-p noic" data-ivbooked="0">View My Dashboard</button>
      </div>
    </div>
  </div>`;
};

const levelModal = () => {
  return `<div class="modal on" data-close="level">
    <div class="sheet conf conf-level" role="dialog" aria-modal="true" aria-label="You are now Explorer E3">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.trophy}</span>
        <h2 class="conf-t">You&rsquo;re now Explorer &ndash; E3</h2>
        <p class="conf-x">Your interview evaluation places you at Level E3 on the Explorer track. You&rsquo;re ready to take the next step in your TALENTnext journey.</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-s noic" data-levelgo="report">View evaluation</button>
        <button class="btn btn-p noic" data-levelclose="1">Enroll in course</button>
      </div>
    </div>
  </div>`;
};

const beganModal = () => `<div class="modal on" data-close="began">
    <div class="sheet conf" role="dialog" aria-modal="true" aria-label="Your learning journey has begun">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.book}</span>
        <h2 class="conf-t">Your learning journey has begun</h2>
        <p class="conf-x">Your 90-day cohort is now active. Start exploring Business Fundamentals and continue your learning journey.</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-p noic" data-beganclose="1">Continue Learning</button>
      </div>
    </div>
  </div>`;

const scenesUpsellModal = (kind) => {
  return `<div class="modal on" data-scenesclose="1">
    <div class="sheet conf" role="dialog" aria-modal="true" aria-label="Keep more of your interview">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.video}</span>
        <h2 class="conf-t">Get All Scenes</h2>
        ${''/* THE PRICE IS ITS OWN ROW, like the interview-fee and course-fee
              dialogs (Maryam, 21 Sep 2026): an "Only in" label over the amount,
              the shared `.bkc-fee`/`.bkc-fl`/`.bkc-fv` centred stack. $29 is an
              authored placeholder (`SCENES_PRICE`, §74). */}
        <div class="bkc-fee pay-fee" style="align-items:center"><span class="bkc-fl">Only in</span>
          <span class="bkc-fv">${SCENES_PRICE}</span></div>
        <p class="conf-x">You&rsquo;ve selected your 3 included scenes. Want to keep the rest? Purchase the remaining interview scenes and get access to the complete set.</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-s noic" data-scenesok="1">Continue with 3</button>
        <button class="btn btn-p noic" data-scenesall="${kind}">Get All Scenes ${I.arrowRight}</button>
      </div>
    </div>
  </div>`;
};

V.welcome = () => `<main class="main"><div class="page">
  ${ph('Welcome to Cohort 41','Explorer Track &ndash; E3 &middot; starts 1 December &middot; a cohort of ten at your level',null,'dashboard')}
  ${''/* THE RECEIPT ROW CARRIES ITS OWN WAY IN (Maryam, 31 Aug 2026, from the
        reference). The banner said "your receipt is in Payments" and left the
        reader to find Payments in the rail — a sentence pointing at the UI,
        which is `PAGESUM`'s third content ban applied to page copy. `note-act`
        is §24's shape for exactly this and the product already uses it on My
        Level: the note keeps its words and the route sits at the far end of the
        same row. Quiet, not accent — the page's one primary action is "Go to my
        dashboard" at the foot, and a receipt is a thing you may want rather than
        the thing to do. §64 gives it its own arrow, so no icon is written. */}
  <div class="sec">
    <div class="note succ note-act"><span>${I.checkFilled}</span>
      <div class="nb"><b>You are enrolled</b>$595 paid on Visa ending 4242. Your receipt is in Payments and a copy is in your email.</div>
      <button class="btn btn-t btn-sm note-cta" data-go="billing">View payment</button></div>
  </div>
  ${''/* THE LEADER AND THE COHORT ARE TWO CARDS ABREAST — the reference's
        second row, in our language. They were one card with a `.kv` under the
        photograph, which made the cohort a property OF Priya; they are two
        answers to two questions — who is running this, and what am I in — and
        the page is the moment both are true for the first time.

        `leaderCard()` IS CALLED WITH NO COHORT, which is what takes the `.kv`
        row off it: that row moved into the second card whole, so nothing is
        restated and the one function still draws the person on both pages.
        The mark on the right-hand card is `.cardrow-ic`, the warm 40px chip
        the product already uses for a row's subject — the reference draws a
        tinted square there and this is ours.

        NO `.sec-h` ON THE SECTION, so §10.15's label column never applies
        (trap 13 answered by not creating the problem): each card carries its
        own `.lbl`, which is §63's label role and needs no new type rule. */}
  <div class="sec wpair">
    ${leaderCard(null,'Your cohort leader')}
    <div class="tile">
      <span class="lbl">Leads</span>
      <div class="row-lead">
        <span class="cardrow-ic">${I.group}</span>
        <div style="flex:1"><div class="t-heading-compact-01">Cohort 41 &middot; ten of you at Explorer &ndash; E3</div></div>
      </div>
    </div>
  </div>
  ${''/* AND THE ANSWER TO "SO WHAT DO I DO NOW" IS NOTHING, IN THREE PARTS.
        Counted rather than marked, which is the `.cardrow-n` shape the
        `booked` dashboard's "What to bring" uses — these are in time order and
        a number is what says so. None of them is a task: the point of the
        block is that the next move is the product's, not the reader's.

        EACH ROW GAINS ITS SUBJECT'S MARK AT THE FAR END, which is the
        reference's right-hand chip and is `.cardrow-ic` again — the chapter is
        a book, the board is the ten of you, the call is a date. It sits last
        rather than first because `.cardrow-n` already opens the row and two
        marks before the words would be a number introducing a picture. No rule
        needed: `.cardrow-b` is `flex:1` (§02.256), so anything after it is
        pushed to the right edge. */}
  <div class="sec">
    <div class="sec-h"><h2>What happens next</h2></div>
    <div class="tile-stack">
      ${[['Nothing, until 1 December','Chapter 1, '+CH[0][0]+', unlocks that morning &middot; '+CH[0][1]+' min',I.book],
         ['Priya introduces the cohort on the board','Before the first call, so you know the ten of you by name',I.group],
         ['Your first live call is that Thursday','6:00 PM ET &middot; 60 minutes &middot; the invite is already in your email',I.calendar]
        ].map(([t,d,ic],i) => `<div class="cardrow"><span class="cardrow-n">${i+1}</span>
        <span class="cardrow-b"><span class="cardrow-t">${t}</span><span class="cardrow-d">${d}</span></span>
        <span class="cardrow-ic">${ic}</span></div>`).join('')}
    </div>
  </div>
  <div class="sec"><button class="btn btn-p" data-go="stage:week1">Go to my dashboard ${I.arrowRight}</button></div>
</div></main>`;

const lsvtFrame = () => `<main class="main lsvt-blank"><div class="page"><div class="lsvt-slot">
  <iframe class="lsvt-if" title="Coursework &mdash; LightspeedVT"></iframe></div></div></main>`;

const courseworkPreview = (f) => `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Coursework')}
  <div class="sec">
    <div class="sec-h"><h2>${COHORT_COURSE}</h2></div>
    <div class="note"><span>${I.info}</span><div class="nb">Your cohort has not started yet. This is the full outline of what you&rsquo;ll cover; the chapters open in LightSpeed VT when the cohort begins${f.startIn>0?`, in ${f.startIn} days`:' today'}.</div></div>
  </div>
  ${outlineSec(f.level || 'E3')}
</div></main>`;

V.coursework = (f) => (f && f.preStart) ? courseworkPreview(f) : lsvtFrame();
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
  const inprog = isDay34(S.stage) && i===3;
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
      ${''/* THE ROLEPLAY STAGE IS GONE (Client, 9 Sep 2026): a chapter is Video →
            Reading → Assessment, and the assessment is no longer gated behind an
            AI roleplay — candidates practise through their real week, not a Tal
            partner. The sequential CHAPTER lock (finish a chapter to open the
            next) is a different mechanism and is untouched. */}
      <div class="kv"><span class="k">Assessment</span><span class="v n">${done?SCORE[i]+'%':'Not started'}</span></div>
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
  if(!g) return `<main class="main"><div class="page">${ph('Achievements')}
    <div class="sec"><div class="empty" style="padding:0 0 var(--s07)">${I.trophy}<h3 style="margin-top:var(--s06)">Nothing to show yet</h3>
      <p>Points, badges and rank begin when your cohort starts.</p></div></div></div></main>`;
  const tab = S.rtab || 'points';
  const TAB_N = {points:'Points', badges:'Badges', rank:'Rank', certs:'Certificates'};
  const counts = {points:`${g.got.length} of ${PTS.length} earned`, badges:`${g.badges} of ${BDG.length} earned`, rank:`Currently ${RANKS[g.rank-1].n}`};
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Achievements')}
  ${''/* NO DESCRIPTION HERE EITHER. "Points, badges and rank come from your
        activity across the course and the community" is the page's three
        section names plus a claim, and Tal's summary states the three
        figures. A `&middot;` spine of the same three would have made it
        three statements of one thing on the one page in the product where
        the numbers change nothing. */}
  ${ph('Achievements')}
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
  ${''/* THE POINTS STRIP GOES BESIDE THE SUMMARY, NOT UNDER IT (Maryam,
        1 Sep 2026: "the points section on the bottom of the summary should be
        on the right side of the summary just like our component where we have
        summary and progress side by side").

        THE COMPONENT SHE MEANS IS §56'S TWO-COLUMN BAND, AND IT NEEDS NO NEW
        CSS — two classes on the section this already drew. `.head-sec` is
        `placeBand`'s documented opt-in: that pass walks a RUN forward from the
        `.ph` and takes Tal's card, the ask line, and anything a view has
        DECLARED as head furniture, so a section that is neither of the first
        two says so itself. `.head-col` is the half that opens column two —
        §56.742 and §71.35 both record that the gate was corrected from
        `.sec-jrn` to `.head-col` exactly so a second tenant could use the slot,
        and this is the third: the journey list on the pre-course dashboards,
        `progressWing` on the enrolled ones, the points strip here.

        IT HAS TO STAY WRITTEN THIRD, after the `.ph` and the ask chips, because
        the run STOPS at the first sibling that is not head furniture. The
        `.tabs` row below is what ends it, which is also why the strip could not
        simply be moved above the chips.

        AND THE INLINE `padding-bottom` CAME OFF — trap 1. An inline
        declaration beats every stylesheet rule at any specificity, and in the
        band the column's spacing is §70.3's. Left there it would have been a
        value from the page body silently winning inside the head. */}
  ${''/* `.sec-score` NAMES THE TENANT, which is the pattern §70.3's own note
        sets out: "`.head-col` IS WHAT OPENS THE SECOND COLUMN AND `.sec-jrn` IS
        ONLY WHICH TENANT". The journey list, the progress wing and now the
        points strip are three tenants of one slot, and each needs a word so a
        rule about ITS spacing cannot reach the other two. §89.4 is the rule. */}
  <div class="sec head-sec head-col sec-score">${scoreCard(g)}</div>
  <div class="tabs">
    ${['points','badges','rank','certs'].map(k=>`<button class="${k===tab?'on':''}" data-rtab="${k}">${TAB_N[k]}</button>`).join('')}
  </div>
  ${''/* THE CERTIFICATES TAB LEAVES THE SHARED WRAPPER ENTIRELY (Maryam,
        2 Sep 2026). The other three are one list inside one `.sec`; this one is
        a black card and then a headed grid, which is two sections — and a
        `.dark-card` inside a `.sec` that also holds a meta row would pay that
        section's padding on top of its own 32px frame. Branching here rather
        than inside the wrapper is also what drops the inline `padding-top`
        (trap 1) for this tab, which was a value from the page body that no
        stylesheet could answer. */}
  ${tab==='certs' ? certsTab(f, g) : `<div class="sec nofill">
    ${''/* THE META ROW IS OFF ON THE CERTIFICATES TAB (Maryam, 2 Sep 2026), and
          the row survives on the other three because their left half is a real
          figure — "3 of 12 earned", "Currently 1-Star" — read off the same
          record the list below is drawn from. On certs it was "1 earned" over a
          list of one, which is the count restating the thing it counts. Both
          halves go together: "Updated today" alone would be a right-aligned
          timestamp with nothing on its line. */}
    <div class="sec-h" style="margin-bottom:var(--s04)"><span class="t-helper-01">${counts[tab]}</span>
      <span class="t-helper-01" style="margin-left:auto">Updated today</span></div>
    ${''/* THE WRAPPER KEEPS `.aw-list` AND TAKES A MODIFIER — it is not a new
          class, and that is the whole of trap 13 answered here. Six layers
          reach this element through `:has(> .aw-list)` (§12's ground and its
          transparent rows, §15's panel strip, §18's fill edge, §10's bleed) and
          §10.15's label-column opt-out is keyed on `.sec:has(.aw)` — the ROW,
          by descendant. So a card that is still an `.aw` inside a wrapper that
          is still an `.aw-list` inherits every one of those decisions, and §102
          only has to say what a grid does differently. A fresh `.aw-grid`
          wrapper on its own would have dropped all six and put the heading in
          the 184px column. */}
    <div class="aw-list${tab==='points'?'':' aw-grid'}">
      ${tab==='points'?pointsList(g):tab==='badges'?badgeList(g):rankList(g)}
    </div>
    ${tab==='points'?`<p class="t-helper-01 mt5">Points update within a few minutes of the activity.</p>`:''}
    ${tab==='rank'?`<p class="t-helper-01 mt5">Rank reflects your activity. It is separate from your level.</p>`:''}
  </div>`}
</div></main>`;
};

const COHORT_AVG = 79;

const perfAvg = a => Math.round(a.reduce((x,y)=>x+y,0) / a.length);

function perfParts(f){
  const done  = SCORE.slice(0, f.done);
  const first = done.slice(0, 5), rest = done.slice(5);
  const lo = done.indexOf(Math.min(...done));
  const hi = done.indexOf(Math.max(...done));
  return {done, lo, hi,
    delta: rest.length ? perfAvg(rest) - perfAvg(first) : null};
}

function perfInsight(f){
  const {done, lo, delta} = perfParts(f);
  const ch = i => `chapter ${i+1}, ${CH[i][0]},`;
  const pt = n => n === 1 ? 'point' : 'points';
  if(delta === null)
    return `Five chapters are assessed so far. ${ch(lo)[0].toUpperCase()+ch(lo).slice(1)} is your lowest at ${done[lo]}%.`;
  if(delta > 0)
    return `Your average is ${delta} ${pt(delta)} higher from chapter 6 on than across the first five, and ${done.filter(v=>v>=COHORT_AVG).length} of ${done.length} chapters are at or above the cohort's ${COHORT_AVG}%.`;
  if(delta < 0)
    return `Your average is ${-delta} ${pt(-delta)} lower from chapter 6 on than across the first five. ${ch(lo)[0].toUpperCase()+ch(lo).slice(1)} is the lowest at ${done[lo]}%.`;
  return `Your average is level with the first five chapters, and ${ch(lo)} at ${done[lo]}%, is the lowest.`;
}

function perfChart(f){
  const {done, lo, hi} = perfParts(f);
  const W=900, H=180, L=40, R=10, T=12, B=24;
  const IW=W-L-R, IH=H-T-B;
  const x=i=> L + (done.length>1 ? i*(IW/12) : IW/2);
  const y=v=> T + IH - (v/100)*IH;
  const path = done.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)).join(' ');
  const grid = [0,20,40,60,80,100].map(v=>`
    ${v===80?'':`<line x1="${L}" x2="${W-R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"
      stroke="var(--rule)" stroke-width="1" vector-effect="non-scaling-stroke"/>`}
    <text class="perf-yl" x="${L-8}" y="${(y(v)+4).toFixed(1)}" text-anchor="end">${v}%</text>`).join('');
  const dots = done.map((v,i)=>{
    const call = i===lo ? ' perf-lo' : i===hi ? ' perf-hi' : '';
    return `${call?`<circle class="perf-halo${call}" cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="9"/>`:''}
      <circle class="perf-dot${call}" cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4"/>`;
  }).join('');
  const xl = Array.from({length:13},(_,i)=>`
    <text class="perf-xl" x="${x(i).toFixed(1)}" y="${H-10}" text-anchor="middle">${i+1}</text>`).join('');
  const cal = (hi >= 0 && f.avg != null) ? (() => {
    const bw = 104, bh = 34, gap = 12, r = 9;
    let bx = x(hi) + gap;
    if(bx + bw > W - R) bx = x(hi) - gap - bw;
    bx = Math.max(L, Math.min(W - R - bw, bx));
    const by = Math.max(T, Math.min(T + IH - bh, y(done[hi]) - bh / 2));
    const cx = bx + 8 + r, cy = by + bh / 2;
    const C = 2 * Math.PI * r;
    const arc = (C * Math.min(100, Math.max(0, f.avg)) / 100).toFixed(1);
    return `<g class="perf-cal">
      <rect x="${bx}" y="${by}" width="${bw}" height="${bh}"/>
      <circle class="perf-cal-trk" cx="${cx}" cy="${cy}" r="${r}"/>
      <circle class="perf-cal-arc" cx="${cx}" cy="${cy}" r="${r}"
        stroke-dasharray="${arc} ${(C - arc).toFixed(1)}"
        transform="rotate(-90 ${cx} ${cy})"/>
      <text class="perf-cal-l" x="${bx + 34}" y="${by + 15}">Average score</text>
      <text class="perf-cal-v" x="${bx + 34}" y="${by + 27}">${f.avg}%</text>
    </g>`;
  })() : '';
  return `<div class="perf-plot">
    <svg class="perf-svg" viewBox="0 0 ${W} ${H}" role="img"
      aria-label="Assessment score for each of the ${done.length} assessed chapters, against a cohort average of ${COHORT_AVG}%">
      ${''/* THE LINE, THE DOTS AND THE COHORT RULE ARE ALL ONE GREEN (Maryam,
             2 Sep 2026), so the `g-perf` gradient is gone with its `<defs>` —
             §63 §23 and §88.2 carry the colour and nothing here paints. The
             two-stop `--dv-grad-a/b` ramp was the build's chart idiom and it
             is the wrong idiom for a series that has to read as ONE
             measurement against a threshold: a line that changes hue along its
             length invites the reader to look for what changed at the middle.
             The only hue break left is the one that means something — the
             lowest point in red. */}
      ${grid}
      <line class="perf-avg-line" x1="${L}" x2="${W-R}"
        y1="${y(COHORT_AVG).toFixed(1)}" y2="${y(COHORT_AVG).toFixed(1)}"
        stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>
      <path class="perf-line" d="${path}" fill="none" stroke-width="2"
        stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      ${dots}${xl}${cal}
    </svg>
  </div>`;
}

const perfSec = f => {
  return `<div class="sec perf">
    ${''/* THE LEGEND IS THE HEADING ROW'S CONTROL SLOT (Maryam, 2 Sep 2026:
           "the Your score / Cohort average 79% row should come on the right
           end of the heading and desc row of this section"). It was the first
           child of `.perf-plot`, which put it level with the rail's figure and
           gave the plot a row of its own furniture; on the heading row it is
           the key to the whole section, read before the drawing rather than
           inside it. Same shape `.scene-hb` takes on the Interviews module —
           §24.6 already makes `.sec-h` a flex row and hands the right-hand
           child an `auto` margin, so nothing new is invented for the position.

           THE `<h2>` AND THE LEDE MOVE INSIDE `.perf-hb` TOGETHER, and that is
           what loses §10.15's label-column opt-out — TRAP 13, third time this
           week. The section was opting out through `.all-desc` as a DIRECT
           child of the `.sec`; one level down it stops matching, and the
           heading sets in a 184px gutter with the chart crushed beside it.
           §88.1a restates it on `:has(> .perf-b)` inside the container query.
           §69's sentence covers both directions: a wrapper loses an opt-out
           and so does removing the content it was keyed on. */}
    <div class="sec-h"><div class="perf-hb"><h2>Your performance</h2>
    ${''/* ONE LINE, AND IT IS THE REFERENCE'S OWN (Maryam, 1 Sep 2026: 'this
           desc will be changed to "Assessment average across 13 chapters."').
           It ran two lines and carried two more claims — "Every chapter closes
           with one, and their average is what an agent reads at your
           re-interview" — which is the same sentence "What you'll learn" was
           opening with on the Enroll page until its lede came off the same
           afternoon. Said twice in one product, and here it sat between the
           heading and the figure the section is about.

           IT ALSO DROPS THE DERIVED `${f.done} of 13`, WHICH IS THE ONE THING
           WORTH KNOWING. The figure below still reads the assessed count, and
           `perfInsight` still opens on it ("Five chapters are assessed so far")
           — so the count is on the page twice rather than three times, and the
           line that names it is the one deriving it. A fixed "13 chapters" is
           what the course HAS; how many are marked is a figure, not a lede.

           `.all-desc` STAYS AND IS LOAD-BEARING — trap 13. Neither `.perf-b`
           nor `.perf-f` is in §10.15's opt-out list, so this paragraph is what
           keeps the section out of the 184px label column. Shortening it is
           safe; deleting it is what §87.1a had to answer for `learnSec`. */}
    <p class="all-desc">Assessment average across 13 chapters.</p></div>
      <div class="perf-leg">
        <span class="perf-lg"><i class="perf-lg-l"></i>Your score</span>
        <span class="perf-lg"><i class="perf-lg-d"></i>Cohort average ${COHORT_AVG}%</span>
      </div>
    </div>
    ${''/* THE RAIL IS GONE AND THE PLOT TAKES THE ROW (Maryam, 2 Sep 2026:
           "remove the left side 88% part", "stretch the graph from left to
           right"). `.perf-b` was `auto minmax(0,1fr)` — a content-sized column
           holding the figure and the delta, then the chart in what was left.

           THE FIGURE IS NOT LOST, IT IS ON THE CHART. `perfChart`'s callout box
           hangs "Average score" and the percentage under the highest point, so
           the section still states its one number once. What DID go with the
           rail is the delta row — "Improvement from the first five chapters" —
           and that is a real subtraction rather than a move: it only ever drew
           past chapter 5, and `perfInsight` computes the same comparison in
           words at the foot of the section. Two readings of one trend, one of
           them a figure with no chart position; the sentence is the better of
           the two and it is the one that survives.

           `.perf-b` STAYS AS THE WRAPPER even though it now holds one child.
           It is what §88.1a's opt-out is keyed on, it carries the row's top
           margin, and a second column is exactly what a wider reference would
           want back — deleting it would mean re-deriving the grid to add one. */}
    <div class="perf-b">${perfChart(f)}</div>
    <div class="perf-f">
      <div class="perf-ins">
        <span class="perf-ins-mk"></span>
        <span class="perf-ins-b"><b>Key insight</b><span>${perfInsight(f)}</span></span>
      </div>
      ${''/* FOCUS AREAS CAME OFF THE STRIP (Maryam, 2 Sep 2026). It printed
             "Chapter 4, Chapter 12" from `RPT_GROWTH`, which is the same pair
             the page states three times over: the chapter rows above carry
             "Your growth area" on both, `perfInsight` names chapter 4 by title
             in the sentence 200px to its left, and the report block on
             Interviews closes on "Chapters 4 and 12 are built on exactly
             this". A labelled block restating two numbers already on screen is
             the fourth telling, and it was the one with the least around it.

             `RPT_GROWTH` KEEPS ITS OTHER READERS, so nothing in data.js
             changes — this was one of several. The divider §88.3 draws between
             the insight and this block goes with it; the strip is the sentence
             and the action now, which is the shape it had before the reference
             added a third column. */}
      <button class="btn btn-g btn-sm noic perf-a" data-scores="1">View scores</button>
    </div>
  </div>`;
};

const scoresSheet = f => `<div class="modal ${S.scores?'on':''}" data-close="scores">
    <div class="sheet">
      <div class="sheet-h"><h2>Assessment scores</h2>
        <button class="x" data-scores="0" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="kv-list">
          ${SCORE.slice(0, f.done).map((v,i)=>`<div class="kv"><span class="k">Chapter ${i+1} &middot; ${CH[i][0]}</span><span class="v n">${v}%</span></div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;

const courseStats = (f, pct, hrs) => `<div class="stats">
      ${statCell(I.book, `Chapters done`, `${f.done} <small>of 13</small>`, `${pct}%`)}
      ${statCell(I.chart, `Assessment average`, `${f.avg?f.avg+'<small>%</small>':'<small>Not yet</small>'}`, `${f.avg?'cohort average 79%':'nothing assessed yet'}`)}
      ${statCell(I.time, `Time invested`, `${hrs.split(' ')[0]}<small>${hrs.replace(/^\S+/,'')}</small>`, `${f.done?Math.round(f.mins/f.done)+' min per chapter':'not started'}`)}
      ${statCell(I.flag, `Tasks on time`, `${isDay34(S.stage)?'4 <small>of 5</small>':S.stage==='week1'?'0 <small>of 0</small>':'12 <small>of 13</small>'}`, `${S.stage==='week1'?'none due yet':'one overdue'}`)}
    </div>`;

const pastInsight = (f) => {
  const [g1, g2] = RPT_GROWTH;
  return `${perfInsight(f)} ${CH[g1][0]} and ${CH[g2][0]} (chapters ${g1+1} and ${g2+1}) are the two your report names as growth areas.`;
};

const pastSec = (f, pct, hrs) => {
  const c = certsFor(f).slice(-1)[0];
  return `<div class="sec found${discOpen('past')?' on':''}">
    ${''/* "READ THE FULL REPORT" IS REMOVED (Maryam, 3 Sep 2026), AND §65's
           THIRD DECISION GOES WITH IT. That note argued the control belonged
           OUTSIDE the disclosure — "it is the way to the whole document and it
           is useful whether or not the summary is open" — which was right when
           this heading row was the only place on the page that reached the
           report. It is not any more: `signedSummary`'s own foot carries the
           same words on the stages that draw it, `SUMDROP.report` offers them
           as Tal's action, and the rail's Interviews module is one press away.
           A control repeated is the drift this build keeps deleting.

           WHAT IT COSTS ON *THIS* PAGE IS ONE PRESS, NOT A ROUTE. `promoted`
           draws `signedSummary` with `footAction` OFF (see its note — the two
           sat 300px apart saying the same words), so with this gone the page
           has no direct link to `V.report`. That is a real subtraction and is
           flagged rather than hidden: if the record should reach the report,
           the honest place is `signedSummary`'s foot, where the words already
           exist and where the summary being read is the thing you would want
           the full version of.

           `foundHead`'S SECOND ARGUMENT IS DELETED WITH IT. The only other
           caller passed `''`, so keeping the parameter would be a slot nothing
           fills — the "gate nothing writes" tell, one level up. `.found-h` is
           a `.sec-h` and §24.13's `flex:1 1 auto` on `.found-t` is what let a
           control sit at the far end; that still holds for any future one, and
           §65.1's note records it. */}
    ${foundHead(`Your ${c.cohort} record`, 'past')}
    <p class="all-desc">Explorer Track &ndash; ${c.lvl}, closed ${c.on} and signed by ${c.by}.</p>
    <div class="found-b">
      ${courseStats(f, pct, hrs)}
      ${''/* THE STRIP IS `perfSec`'s FOOTER, REUSED WHOLE — §88.3's shape: the
             insight takes the slack on a real `flex:1 1 320px` basis so the
             sentence wraps to its own line instead of shrinking to nothing,
             and `.perf-a`'s auto margin puts the action at the far end. None
             of it is scoped to `.perf`, so this is the same three rules doing
             the same job one section along. */}
      <div class="perf-f">
        <div class="perf-ins">
          <span class="perf-ins-mk"></span>
          <span class="perf-ins-b"><b>Key insight</b><span>${pastInsight(f)}</span></span>
        </div>
        <button class="btn btn-g btn-sm noic perf-a" data-scores="1">View scores</button>
      </div>
    </div>
  </div>`;
};

V.transcript = (f) => {
  const pct = Math.round(f.done/13*100);
  const hrs = Math.floor(f.mins/60)+'h '+(f.mins%60)+'m';
  const g = GAME[S.stage];
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Course Progress')}
  ${''/* NO FACT ROW HERE EITHER — see the note over `V.payment`'s header. This
        was the closest reprint of the dashboard's own three: "Explorer Track –
        E3 · Cohort 41 · day 34 of 90" against the dashboard's "Explorer Track –
        E3 · Cohort 41 · week 5 of 13", the same two facts and the same clock in
        a different unit. The day, the week and the percentage are what the
        progress strip on this page draws, at the size a figure should be read
        at, and Tal's summary opens on where you stand. */}
  ${ph('Course Progress')}
  ${''/* `.sec-joined` SAYS "THE BLOCK UNDER ME DRAWS ITS OWN RULE" (Maryam, 31
        Aug 2026: "remove the divider after blocks"). §10.2 closes every `.sec`
        with a full-bleed hairline; `.stats` already draws its own box on all
        four sides (§29.17) and the pulse below states its own `border-top`, so
        the seam landed between two things that were each already edged.

        A CLASS RATHER THAN `:has(+ .sec > .pulse)`, which is what this was
        first written as. That selector MATCHES — verified against the live DOM —
        and the rule reached the built stylesheet, and the pseudo-element still
        computed `display:block`. Rather than keep bisecting a `:has()` chain
        whose failure I could not account for, the section says what it is. It
        is also the more honest statement: this is a decision about THIS pair on
        THIS page, not a rule about every `.stats` that happens to precede a
        pulse. §72.1d keys on it.

        AND IT SURVIVES THE PULSE MOVING ABOVE IT (1 Sep 2026), which is worth
        stating because it was nearly dropped in that edit. The paragraph above
        gives TWO reasons and only one of them was about the neighbour: `.stats`
        draws its own box on all four sides, so the section's full-bleed closing
        hairline lands one pixel under that box's bottom border whatever follows
        it. That is §14's "two 1px rules one pixel apart" and it is a property of
        this section alone. The pulse's `border-top` was the second edge in the
        pair and has gone; the first is still here. */}
  ${''/* THE PULSE COMES FIRST NOW (Maryam, 1 Sep 2026: "the your pulse should
        be in black card above the 4 blocks"). It sat under the four-cell strip
        and is above it — the black card is what the page is about, and the
        strip is the detail underneath.

        THE ORDER IS ALSO WHAT THE PAGE SAYS IN WORDS. Tal's summary opens on
        "5 of 13 chapters at 88%, about 4 hours in"; the pulse then reads those
        numbers back as pace and standing, and the `.stats` row is the four
        figures the reading is made of. Reading detail-then-conclusion was the
        wrong way round for a page whose first line is already the conclusion.

        `.sec-joined` STAYS ON THE STRIP, and dropping it was the first thing
        this edit got wrong. Its note reads as one reason and is two: `.stats`
        draws its own box AND the pulse below drew a `border-top`. Only the
        second is about the neighbour. The strip is still a boxed component, so
        its section's full-bleed hairline still lands a pixel under that box —
        that is why the class is where it was.

        THE NEW SEAM, above the card, is §85.1b's: a section before a
        `.dark-card` draws no closing hairline. Keyed on the card rather than on
        this page, so it is the same rule the `promoted` dashboard's banner
        needed. */}
  ${''/* AND AT `promoted` THE BLACK CARD IS THE ENROLMENT OFFER (Maryam, 2 Sep
        2026: "the black card will be the enrollment card which user has to
        enroll in to start the course").

        THE PULSE CARD WAS DRAWING A COURSE THAT DOES NOT EXIST YET. `CFG.promoted`
        carries no `finished` flag and inherits `open:0` from `CFG_BASE`, so
        `pulseLede`'s live branch fired on a stage with all thirteen chapters
        done: "You have completed 0 of 45 minutes for Why We Exist … Complete
        chapter 1 to stay on the pace", with "Open chapter 1" beside it. A page
        cannot have everything finished and chapter 1 open — `PAGESUM.coursework`
        records the identical bug on its own copy and the fix there was the same
        one: state the stage rather than fall through to the live branch.

        SO THE SLOT CHANGES SUBJECT RATHER THAN EMPTYING. §75's rule for a black
        card is "this is the one thing the page is about", and once the cohort is
        closed the one thing this page is about is enrolling on the next one.
        `enrolOffer` is the component, unchanged and un-parameterised beyond the
        level — the same card the `promoted` dashboard draws, reading
        `ENROL_OPENS`, `ENROL_DESC` and the fee from one place, so the two
        surfaces cannot disagree about the offer. Its default action is
        `data-go="enrol"`, which is right here: this is not the Enroll page, and
        `enrol` is in the `next` rail.

        `'E4'` IS WRITTEN OUT, NOT READ FROM `f.level`, to match the dashboard's
        own call site byte for byte. `f.level` is 'E4' at this stage and would
        work today; `ENROL_OPENS` / `ENROL_DESC` are keyed E3/E4 only, so a
        derived level is a silent `undefined` in the lede the moment a fifth rung
        enrols. Two call sites, one literal, one branch that only `promoted`
        reaches.

        `pulseCols` KEEPS ITS CALLER at week 1, day 34 and day 90 — the three
        stages the note over it was written for. */}
  ${''/* AND AT `day90` THE LEARNING-PULSE CARD BECOMES THE COURSE RATING (Maryam,
        13 Sep 2026: "the course already finished ... we will remove the learning
        pulse black card from course progress page ... and we will show the rating
        section here"). `f.finished` is day90 only; `promoted` (`f.complete`) keeps
        the enrolment offer, every running stage keeps the pulse.

        THE RATING MOVED TO THE FOOT OF THE PAGE (Maryam, 14 Sep 2026: "on this
        page take this section to the bottom"). At day90 this slot draws nothing —
        the pulse's old spot stays empty — and `reviewCard` is rendered last,
        after the chapter list. Only the transcript's copy moves; the interview
        report and cohort still rate in place. */}
  ${f.complete ? enrolOffer('E4') : (f.finished ? '' : (g?pulseCols(f,g):''))}
  ${''/* THE FOUR FIGURES ARE THE ARCHIVE'S RECAP NOW, so at `promoted` they are
        inside `pastSec`'s panel rather than a section of their own. Same
        `courseStats` either way. */}
  ${f.complete ? '' : `<div class="sec sec-joined">
    ${courseStats(f, pct, hrs)}
  </div>`}
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
  ${''/* AND THE SIGNED-SUMMARY TILE IS DELETED — `pastSec` says all three of its
        facts and says them better (Maryam, 2 Sep 2026). It drew a `.tile` with
        "90-day summary · signed", a sentence dating the signature, a green
        "Signed by Priya Nair" tag and `<a class="lk">Read the summary</a>`.

        `f.complete` IS ONLY `promoted`, so this block had exactly one stage and
        that stage is the one being rebuilt — there is no other caller to keep it
        for. Its three facts survive as the disclosure's visible lede (the level,
        the close date and the signer, read off `CERTS` instead of hardcoded as
        "November 21"), and its fourth part was a §60 DEAD CONTROL: that `.lk`
        carried no `data-go`, so "Read the summary" has never opened anything.
        `foundHead`'s "Read the full report" is the live version of it.

        THE GREEN TAG GOES WITH IT rather than moving. A chip reading "Signed by
        Priya Nair" beside a sentence reading "signed by Priya Nair" is one fact
        drawn twice, and §74's rule for a tag is a one-word label on a finding.
        The `.tag.green` / `.tag-row` classes have plenty of other writers. */}
  ${''/* "ASSESSMENT SCORES" IS "YOUR PERFORMANCE" NOW (Maryam, 1 Sep 2026, with
        a reference screen). It was `lineChart('sc', …)` in a `.tile` — a 320x104
        sparkline over a thirteen-row data table. The note over `perfSec` is the
        argument; what changes on the page is that the average is the largest
        figure on it and the block ends on a conclusion rather than on a table.
        The table is not lost: it is behind "View scores". */}
  ${''/* AND IT IS OFF THE PAGE AT `promoted` — the plotted axis, the legend, the
        thirteen dots and the average callout are "these much details from their
        previous 90-day cohort" almost exactly (Maryam, 2 Sep 2026). What the
        section was FOR survives inside the disclosure: its average is one of
        `courseStats`' four figures, its conclusion is `pastInsight`'s first
        sentence, and its "View scores" button is the same control on the same
        `scoresSheet`. `perfSec` keeps its callers at day 34 and day 90. */}
  ${f.done && !f.complete ? perfSec(f) : ''}
  ${''/* "TIME ON THE COURSE" IS OFF THIS PAGE (Maryam, 1 Sep 2026: "remove the
        time on the course section"). It was `stackChart('wk', …)` — thirteen
        stacked bars of minutes a week split four ways (video, reading, roleplay,
        assessment), a 55-minute target line, and a week-by-week table under it.

        `stackChart` NOW HAS NO CALLER AND IS KEPT, WHICH IS THE ONE EXCEPTION
        THIS FILE MAKES TO ITS OWN RULE. Every other orphan today was deleted —
        `certCard`, `enrolPlate`, `quizResults`, `coverSec`. This one is ~100
        lines of chart with a four-series legend, a target rule and a readout,
        and it is the only stacked chart in the build: `design-system/` ships its
        stylesheet and `gallery.html` documents the markup, so the box has a
        live reader even though the portal does not. Deleting the function would
        leave that recipe undrawable.
        The DATA is untouched too — `GAME[stage].weeks` is what `pacePart` reads
        for the pulse's own thirteen-week bar, so the record survives in the one
        place that still reads it.

        WHAT THE PAGE LOSES is the four-way split of where the minutes went.
        Nothing else in the build states it; `.stats`' "Time invested" is the
        total and the pulse's bar is the weekly rhythm. Flagged rather than
        buried: if the split should stay, this is one `stackChart` call. */}
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
  ${''/* THIRTEEN CHAPTER ROWS ARE THE DEFINITION OF THE DETAIL THIS STAGE DOES
        NOT WANT, so the list is off the page at `promoted` too. Each row is a
        number, a title, a tick, minutes, a percentage and sometimes a growth
        marker — the finest grain the product keeps about a course that closed.
        `pastInsight` carries the two rows that still matter (the growth pair)
        and `scoresSheet` carries all thirteen percentages, so the grain is one
        press away rather than printed. `chRow` keeps its callers. */}
  ${f.complete ? '' : `<div class="sec tint">
    <div class="sec-h"><h2>Your progress by chapter</h2></div>
    <div class="tile-stack">${(S.chAll?CH:CH.slice(0,5)).map((_,i)=>chRow(i,f)).join('')}</div>
    <div class="mt4"><button class="btn btn-g" data-chall="1">${S.chAll?`Show the first five ${I.chevUp}`:`Show all 13 ${I.chevDown}`}</button></div>
  </div>`}
  ${''/* THE COURSE RATING IS THE LAST THING ON THE PAGE (Maryam, 14 Sep 2026).
        Day90 only (`f.finished`); moved here from the pulse's old slot near the
        top. It is the one ask that outlives the record above it, so it reads
        after the candidate has seen where they landed. */}
  ${f.finished ? reviewCard({key:'course', title:'How would you rate this course?', sub:'', capsule:'How would you rate this course?'}) : ''}
  ${''/* AND THE WHOLE OF THE ABOVE COMES BACK AS ONE COLLAPSED BLOCK AT THE FOOT.
        `pastSec` is the note; it is last on the page because a closed cohort is
        the last thing a candidate enrolling on the next one needs. */}
  ${f.complete ? pastSec(f, pct, hrs) : ''}
  ${''/* THE CERTIFICATE CARD IS OFF THIS PAGE (Maryam, 1 Sep 2026: "remove this
        black card from course progress page"). It was `certCard(f)` gated on
        `f.done>0`.

        AND IT WAS THE LAST CALLER, SO `certCard` IS DELETED. The candidate's
        three drawings of a certificate resolved to one over the course of the
        day: the `promoted` dashboard and My Level both took `certBanner`, and
        this was the only place the black card was still drawn. A function whose
        callers have all gone is deleted rather than left orphaned — the same
        discipline `quizResults`, `enrolPlate`, `coverSec` and `enrolHours` were
        each held to.

        `.cert`'S STYLESHEET STAYS AND IS NOT ORPHANED, which is the difference
        from those four. `V.leadCerts` (lead4.js) draws the leader's most recent
        certification as a `.cert` hero with the same `.cert-mark` / `.cert-eb` /
        `.cert-act` parts, so §15's rules keep a live writer one portal over.
        Deleting them would take a working component off that page.

        NOTHING BECAME UNREACHABLE. The certificate is on My Level as the tinted
        band, on the `promoted` dashboard as the dismissible notice, and in full
        in the Achievements module's Certificates tab, which is the one place it
        is a LIST and the only one that shows both. */}
</div></main>`;
};

const cohortPreStart = (f) => `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Cohort 41')}
  ${ph('Cohort 41',`Ten people at Explorer &ndash; E3 &middot; led by Priya Nair &middot; ${f.startIn>0?`starts in ${f.startIn} days`:'starts today'}`)}
  <div class="sec head-sec head-col sec-lead">
    <div class="jrn">
      <div class="jrn-h"><h2 class="jrn-t">Your cohort leader</h2></div>
      <div class="row-lead">
        ${avatar(COHORT_LEAD)}
        <div style="flex:1">
          <div class="t-heading-compact-01">${COHORT_LEAD.n}</div>
          <div class="t-helper-01 mt3">Cohort leader &middot; leads Cohort 41</div>
        </div>
        <button class="btn btn-t btn-sm noic lead-msg" data-go="messages"
          aria-label="Message ${COHORT_LEAD.n.split(' ')[0]}">${I.chat}</button>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Who&rsquo;s in your cohort</h2><span class="t-desc">The ten of you start together on Monday, 18 August. The discussion opens on the start day.</span></div>
    ${''/* NO ACTIVITY META BEFORE THE START — nobody has a chapter or a last-active
          yet, so the "you" row drops its running-cohort meta too; every row is a
          face and a name. */}
    <div class="tile-stack">${COHORT.map(([n,i,img,meta,you])=>mem(n,i,'',you,img)).join('')}</div>
  </div>
</div></main>`;

V.cohort = (f) => f.preStart ? cohortPreStart(f) : `<main class="main"><div class="page">
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
  ${''/* THE BAND'S SECOND COLUMN IS THE LEADER, AND THE CALL LEFT THE BAND
        ALTOGETHER (Maryam, 31 Aug 2026). The plate that stood here — Priya's
        face, "Weekly call · in 2 days", the three facts, Join and Add to
        calendar — was the fourth drawing of the one appointment this product
        has, and the note it replaces argued its way TO the plate for exactly
        that reason. The answer has moved on: `crow` is that component now and
        it is what the enrolled dashboards draw, so the call is a `.sec-call`
        row under the band like everywhere else.

        WHAT GOES IN THE SLOT IS THE PERSON, WHICH IS THE PAGE'S OTHER SUBJECT.
        Cohort 41 is ten people and a leader; the discussion below is the ten,
        so the head is the one. `.head-sec head-col` is the documented opt-in —
        §70.3 gives `.head-col` column two, a hairline down its left edge and
        `--layer-01` — so this is the dashboard's own top section with a third
        tenant in it rather than a new arrangement. The instruction is that
        rule: whatever goes beside Tal follows the dashboard's band.

        THE WHITE GROUND COMES FREE AND IS THE POINT (Maryam: "the right side
        card is not the part of the tal summary, that is why it will have white
        bg"). §70.3's `background:var(--layer-01)` paints over the band's ramp,
        so the wash reads as Tal's cell and the column beside it as the page's.
        Nothing here states a colour.

        `.jrn` / `.jrn-h` / `.jrn-t` ARE THE COLUMN'S FURNITURE, not the
        journey's: a flex column and a heading row (§70.5). Reusing them is what
        puts "Your cohort leader" on the same baseline as "Summary by Tal"
        without a rule — the same reason `.sec-prog` reuses the wing's.

        AND THE MESSAGE CONTROL RIDES THE PERSON'S ROW (Maryam, 31 Aug 2026).
        It was a labelled button at the foot of the column, which made the card
        four rows deep and put the action a whole block away from the face it
        acts on. As a mark at the right-hand end of the name row it is where a
        message control sits in every list this product draws — and losing the
        row takes ~60px off the column, which is the height reduction asked for
        and needs no rule: §70.3 stretches both cells to whichever is taller, so
        the band simply closes up around Tal's sentence instead.

        `data-go="messages"` OPENS THE PRIYA THREAD ITSELF rather than an inbox
        — `V.messages` IS that conversation — so the mark does what it looks
        like. The label moves to `aria-label`, because an icon alone is not a
        name; §70.6 sizes the control. */}
  <div class="sec head-sec head-col sec-lead">
    <div class="jrn">
      <div class="jrn-h"><h2 class="jrn-t">Your cohort leader</h2></div>
      ${''/* EXPERTISE IS THE THIRD LINE OF THE PERSON, NOT A ROW UNDER THE CARD
            (Maryam, 31 Aug 2026). It sat outside `.row-lead`, which put it back
            on the column's own left edge under the photograph — so the card read
            as a person and then a separate fact about somebody, and it cost a
            whole row of the column's height. Inside the text cell it is what it
            is: the third thing you know about her, on the same left edge as her
            name and her role. `.crow-b` states the same three lines in the same
            order on the call row 200px below, which is the shape this now
            matches rather than invents. */}
      ${''/* A DISC, AS TALL AS THE TWO LINES BESIDE IT (Maryam, 1 Sep 2026:
             "priya image on right should be in circle and should have the
             height equal to the right side content").

             THE SIZE IS NOT TYPED HERE, WHICH IS THE WHOLE OF IT. `avatar(x,
             48)` writes 48px inline and inline beats every rule (trap 1), so
             the 48 was unanswerable from any layer — and 48 is a number that
             has to change every time the text cell does. It already had: the
             expertise line moved in and then out again over two days, and the
             portrait sat at 48 through both. `avatar(COHORT_LEAD)` with no
             size hands the measurement to §70.3e, which stretches it to the
             cell and takes the width off `aspect-ratio`.

             AND THE CIRCLE IS THE SECOND HALF OF THE SAME ASK. `--radius` is
             `0px` by token and §56 grants the one curve this system allows to
             MARKS — the journey's step discs are the precedent. A portrait
             introducing a person is that, and it is the only avatar in the
             build drawn round, which is stated in §70 rather than pushed onto
             `.av-ph` where nine other surfaces would follow it. */}
      <div class="row-lead">
        ${avatar(COHORT_LEAD)}
        <div style="flex:1">
          <div class="t-heading-compact-01">${COHORT_LEAD.n}</div>
          <div class="t-helper-01 mt3">Cohort leader &middot; leads Cohort 41</div>
        </div>
        ${''/* THE EXPERTISE LINE CAME OFF (Maryam, 1 Sep 2026). The note above
               argued it INTO the text cell as "the third thing you know about
               her", and that was the right fix for a line already on the page in
               the wrong place. What it did not ask is whether the page needs it:
               `crow('cohort')` states the identical string 200px below in
               `.crow-x`, so the column and the call row said one claim about
               Priya twice. This card is who she is; the call row is the
               appointment and carries the credential.
               `COHORT_LEAD.expertise` and `.range` keep their readers — the call
               row here, `V.enrol`'s leader card, and the leader portal. */}
        ${''/* THE MESSAGE CONTROL IS A DISC (Maryam, 1 Sep 2026: "the message
               icon on the right of the cohort leader should have circle frame
               not square"). `--radius` is `0px` by token and §02's opening note
               is that depth is rhythm and rule weight — so a curve is spent only
               on a MARK, which §56 grants as one of the two exceptions. This is
               an icon control beside a round photograph, which is exactly that
               case: the disc pairs it with the face it acts on rather than with
               the page's rectangles. §89 is the one declaration. */}
        <button class="btn btn-t btn-sm noic lead-msg" data-go="messages"
          aria-label="Message ${COHORT_LEAD.n.split(' ')[0]}">${I.chat}</button>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>What to bring on Thursday</h3></div>
      <div class="ai-body"><p>Priya is running week ${f.week} on ${f.week<=1?'why we exist':'hard conversations'}. Bring the Sam handover from your notes — it is the closest example you have.</p></div>

    </div>
  </div>
  ${''/* THE CALL, AS THE ROW EVERY OTHER PAGE DRAWS IT. `crow('cohort')` reads
        `WEEK_CALL` and `COHORT_LEAD`, so the countdown, the session number and
        the leader cannot disagree with the dashboard's copy of the same row —
        which is the whole argument for `CALL_ROW` being the data and `crow`
        being the markup. `.sec.sec-call` is `booked`'s wrapper rather than
        `callRow()`'s: that one is a `.head-sec` for the band, and this band's
        second column is spoken for. §73 takes the section's vertical padding
        off, everywhere. */}
  ${''/* THE CALL IS THE BLACK CARD (Maryam, 1 Sep 2026: "the call card should be
        the black card like how we have on our platform"). `.dark-card crow-dark`
        is §75's recipe and §77's caller — the same two classes the `booked`
        dashboard's interview wears — so this states nothing of its own and the
        standing instruction is honoured: the inset, the haze, the frame, the
        hairline under the heading, the ink flip and the accent Join all come
        with the class.

        THE HEADING ROW IS THE CARD'S, and it carries the countdown rather than a
        control. §77's rule is that `.dc-act` and `.dc-when` share one auto margin
        and are one-or-the-other: on `talRec` the slot is "View all agents"
        because the recommendation is one of five, and here — as on `booked` —
        there is one call and the figure that changes by itself is what the card
        is about. "Cohort week call · session 36" is the row's own label.

        `when:false` FOLLOWS FROM THAT, exactly as §77 argues it: the countdown
        moves to the heading row, so the row must not print it again. What that
        flag also takes is the label, and here the loss is covered twice over —
        the heading names the call and Tal's card two sections up says which week
        it is and what it covers.

        `second:false` BECAUSE THE ROW'S SECOND ACTION WAS "Message Priya", and
        the disc at the top of this page's own leader card is now that control.
        Two ways to message one person on one page is what §77 removed from the
        interview card for the same reason. */}
  ${''/* ONCE THE 90 DAYS ARE OVER THE CALL CARD BECOMES THE LEADER RATING
        (Maryam, 13 Sep 2026: "the rating could be given when the cohort is
        completed ... instead of the black call card i need the rating section
        here"). `f.finished` is the day90 stage only; every earlier stage still
        has a next call, so it keeps the black card. */}
  ${f.finished
    ? reviewCard({key:'leader', title:`How was your experience with ${COHORT_LEAD.n.split(' ')[0]}?`, sub:'', capsule:`How was your experience with ${COHORT_LEAD.n.split(' ')[0]}?`})
    : `<div class="sec sec-call dark-card crow-dark">
    <div class="dc-hd">
      <div class="dc-hd-r"><h2 class="dc-t">Your Next Call</h2>
        <span class="dc-when">${I.time}${callLeft(WEEK_CALL.when)}</span></div>
    </div>
    ${crow('cohort', {when:false, second:false})}
  </div>`}
  ${/* sec-cs: this section holds a full-bleed tab strip, and §20 needs to know
        so the call plate above it can sit flush. Named rather than sniffed —
        the `:has()` that would have detected it has to nest, and nested
        `:has()` is invalid CSS that takes its whole rule down with it. */''}
  <div class="sec sec-cs">
    ${''/* RANKING LEFT THIS STRIP (Maryam, 11 Sep 2026) — it lives on My Level
          now, over the same-level board, because a cohort mixes levels and
          ranking cohort-mates on points would be unfair. Discussion and Members
          are what a cohort page is: the people in it and the room they talk in. */}
    <div class="cs">
      <button class="${(S.ctab||'discussion')==='discussion'?'on':''}" data-ctab="discussion">Discussion</button>
      <button class="${S.ctab==='members'?'on':''}" data-ctab="members">Members</button>
    </div>
    ${''/* A CANDIDATE DOES NOT SEE OTHER MEMBERS' ACTIVITY (Maryam, 20 Sep 2026):
           only the reader's own row keeps its meta line; every other member is
           name + face alone. `mem` omits `.mem-m` when the meta is empty. */}
    ${S.ctab==='members'
      ? `<div class="tile-stack">${COHORT.map(([n,i,img,meta,you])=>mem(n,i,you?meta:'',you,img)).join('')}</div>`
      : discussionRoom()}
  </div>
</div></main>`;

V.messages = (f) => {
  const her = AGENTS.priya;
  const you = {i:'MN', img: AV.hana};
  const av = a => avatar(a, 32);
  const m = (side, who, body, when, name) => `<div class="m ${side}">
    <span class="m-av">${av(side === 'me' ? you : her)}</span>
    <div class="m-c">
      <div class="m-b">${body}</div>
      <div class="m-w">${name ? who + ' &middot; ' : ''}${when}${
        side === 'me' ? `<i class="m-tick">${I.doneAll}</i>` : ''}</div>
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
  if(f.preStart) return `<main class="main"><div class="page msg-page">
  <div class="ph"><h1>Messages</h1></div>
  <div class="mhead">
    <span class="mhead-av">${avatar(her)}<i class="av-on" aria-hidden="true"></i></span>
    <span class="mhead-b">
      <span class="mhead-n">Priya Nair<i class="mhead-dot" aria-hidden="true"></i></span>
      <span class="mhead-s">Cohort leader &middot; your cohort starts Monday, 18 August</span>
    </span>
    <span class="mhead-a">
      <button class="mhead-act" title="Call" aria-label="Call">${I.phone}</button>
      <button class="mhead-act" title="Video call" aria-label="Video call">${I.video}</button>
      <button class="mhead-act" title="About this thread" aria-label="About this thread">${I.info}</button>
      <button class="mhead-act" title="More" aria-label="More">${I.overflow}</button>
    </span>
  </div>
  <div class="msgs">
    <div class="m-day"><span>Before you start</span></div>
    ${m('them','Priya Nair','Welcome to Cohort 41. I&rsquo;m Priya, your cohort leader. We begin on Monday, 18 August. I&rsquo;ll be in touch here once we start, so there is nothing you need to do until then. Looking forward to the ninety days with you.','10:20 AM')}
  </div>
  <div class="msg-foot">
    <div class="composer composer-off">
      <button class="composer-act composer-lead" aria-label="Attach a file" disabled>${I.attachment}</button>
      <input class="inp" placeholder="Messaging opens when your cohort starts" aria-label="Message" disabled>
      <button class="composer-act" aria-label="Record a voice message" disabled>${I.microphone}</button>
      <button class="composer-send" aria-label="Send" disabled>${I.send}</button>
    </div>
  </div>
</div></main>`;
  return `<main class="main"><div class="page msg-page">
  <div class="ph"><h1>Messages</h1></div>
  <div class="mhead">
    ${''/* NO SIZE ARGUMENT — `avatar(a, size)` writes it as an inline style and
          that is trap 1: the header's face steps down on a phone and an inline
          declaration cannot be answered from a layer. §62's `youMark` refuses
          the helper's size for exactly this reason and states both in CSS. */}
    <span class="mhead-av">${avatar(her)}<i class="av-on" aria-hidden="true"></i></span>
    <span class="mhead-b">
      <span class="mhead-n">Priya Nair<i class="mhead-dot" aria-hidden="true"></i></span>
      <span class="mhead-s">Cohort leader &middot; private, and it stays after the cohort closes</span>
    </span>
    <span class="mhead-a">
      <button class="mhead-act" title="Call" aria-label="Call">${I.phone}</button>
      <button class="mhead-act" title="Video call" aria-label="Video call">${I.video}</button>
      <button class="mhead-act" title="About this thread" aria-label="About this thread">${I.info}</button>
      <button class="mhead-act" title="More" aria-label="More">${I.overflow}</button>
    </span>
  </div>

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

const PAY_E2 = ['Explorer Track &ndash; E2','Feb 4, 2026','$490','Mastercard','8210'];

function payRows(f){
  const rows = [];
  if(f.enrolled||f.complete) rows.push(['Explorer Track &ndash; E3','Aug 14, 2026','$595','Visa','4242']);
  if(!f.pred || isBooked(S.stage) || S.stage==='held')
    rows.push(ivCharged(false)
      ? ['Interview &middot; Priya Nair','Aug 13, 2026','$95','Visa','4242']
      : ['Interview &middot; Priya Nair','Aug 13, 2026','Complimentary','','']);
  if(f.complete) rows.push(['Re-interview &middot; Priya Nair','Nov 20, 2026','$95','Visa','4242']);
  rows.push(PAY_E2.slice());
  return rows;
}

function receiptModal(){
  if(S.receipt == null) return '';
  const r = payRows(cfg(S.stage))[S.receipt];
  if(!r) return '';
  const [n,d,amt,br,last] = r;
  return `<div class="modal on" data-receiptclose="1">
    <div class="sheet" role="dialog" aria-modal="true" aria-label="Receipt">
      <div class="sheet-b">
        <div style="margin-bottom:var(--s05)">
          <div class="t-label" style="color:var(--text-secondary)">TalentNext</div>
          <h2 class="u-h2" style="margin:var(--s01) 0 0">Receipt</h2>
        </div>
        <div class="kv"><span class="k">Paid for</span><span class="v">${n}</span></div>
        <div class="kv"><span class="k">Date</span><span class="v">${d}</span></div>
        <div class="kv"><span class="k">Card</span><span class="v">${br?bmk(br)+'<span style="margin-left:var(--s02)">&bull;&bull;&bull;&bull; '+last+'</span>':'Complimentary'}</span></div>
        <div class="kv"><span class="k">Amount</span><span class="v n">${amt}</span></div>
        <div class="kv"><span class="k">Status</span><span class="v">Paid</span></div>
      </div>
      <div class="sheet-f"><button class="btn btn-s noic" data-receiptclose="1">Close</button></div>
    </div>
  </div>`;
}

V.billing = (f) => {
  const rows = payRows(f);
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','dashboard'],'Payments')}
  ${''/* NO DESCRIPTION, AND THE SUMMARY IS BACK ABOVE IT (Maryam, 31 Aug
        2026). This slot once held "One-off payments only. Nothing here
        recurs." — two statements of one fact, and a policy line, which is the
        second of `PAGESUM`'s four content bans applied to page copy. There is
        no spine to state here either: Payments is one of the eight pages that
        pass `title` alone.

        WHAT TAL SAYS INSTEAD IS NOT ABOUT THE TABLE, and the reason is worth
        knowing before adding to it: the `NEVER` list (ai2) and clause 4 of the
        Data use notice both say Tal has never seen billing, and `wLedger`
        (ai8) declines a "what have I paid" question and points at this page.
        `PAGESUM.billing` is where that is argued out. Do not "improve" the
        line by putting a total in it. */}
  ${ph('Payments')}
  ${''/* THE LEDGER HAS A HEADING NOW (Maryam, 2 Sep 2026: "give the previous
        transactions section a heading 'Previous Transactions'"). It was the one
        block on the page with none — the table's own column head row said
        What / When / Card / Amount, which names the COLUMNS and not the block,
        so "Saved cards" 40px below it was the first heading a reader met.

        TRAP 13 IS ALREADY ANSWERED AND §10.15's OWN NOTE PREDICTED THIS EXACT
        EDIT. `.paytbl` is on the label-column opt-out list, and the argument
        recorded beside it is that the table bleeds — "it had never been drawn
        under a heading before: `V.billing` gives the page a `.ph` and a `.sec`
        with no `.sec-h` at all, so the label column never applied and nothing
        showed". That entry was added for the agent portal's Earnings ledger; it
        is what makes this a one-line change here rather than a new rule.

        THE WORDS ARE MARYAM'S CAPITALISATION. §63 §2's rule is that nothing is
        set in capitals by CSS and the words go in the markup as they should
        read; it does not overrule a title the product's owner has typed, and
        "Quick Actions" is the same shape two pages over. */}
  <div class="sec pay-sec">
    <div class="sec-h"><h2>Previous Transactions</h2></div>
    <div class="paytbl">
      ${''/* "Paid for" AND "Paid on", NOT "What" AND "When" (Maryam, 2 Sep
             2026). Both old labels were generic enough to head any table in the
             product; these two say what the column holds ON A LEDGER, which is
             the one thing a payment row's first two cells are about. Card and
             Amount already named themselves and are unchanged. */}
      <div class="payrow payhead">
        <span>Paid for</span><span>Paid on</span><span>Card</span>
        <span class="num">Amount</span><span></span>
      </div>
      ${rows.map(([n,d,amt,br,last],i)=>`<div class="payrow">
        <span class="pay-n">${n}</span>
        <span class="pay-d">${d}</span>
        <span class="pay-c">${br?bmk(br)+`<span class="n">&bull;&bull;&bull;&bull; ${last}</span>`:''}</span>
        <span class="pay-a num">${amt}</span>
        <span class="pay-r"><button class="lnk" data-receipt="${i}">Receipt</button></span>
      </div>`).join('')}
    </div>
  </div>
  <div class="sec">
    ${/* NO "1 OF 3". The three-card cap is a rule the cards themselves
          already enforce — "Add a card" disappears at the third one, which is
          the only moment the number would have told you anything, and by then
          it is not on the page either. Until then it is a count of a list you
          can see in full, set against a ceiling nobody is near. */''}
    ${/* AND IT IS TEXT WITH A PLUS ON IT, NOT A BLACK BUTTON (Maryam,
          31 Aug 2026). `.btn-p` is the page's ONE primary action, and on
          Payments that is not adding a second card — the page is a ledger you
          came to read, and the black slab beside "Saved cards" was the
          loudest object on it. `.btn-t` is §64's quiet variant: the border is
          already transparent there, and §64's `.sec-h .btn-t{padding-right:0}`
          sits the words flush with the column edge, so what is left is the
          label and the mark. `I.add` stays, which is also what keeps §64 from
          appending its arrow — that pseudo-element is gated on
          `:not(:has(svg))`. `noic` stays too: it means "do not push the icon
          to the far edge", which is the whole point of a text control. */''}
    ${/* THE PLUS LEADS (Maryam, 31 Aug 2026). `ic-l` is the class the product
          already uses for a mark that opens a label rather than closing it —
          `.crow-a`'s Reschedule, the note's Book your interview — and it is the
          right side for this one: a trailing mark reads as the RESULT of the
          control (§64's arrow, "and then you go there"), a leading one reads as
          what the control does to the list under it. Add is the second kind. */''}
    ${''/* THE CAP IS GONE AND SO IS THE SENTENCE ABOUT IT (Maryam, 2 Sep 2026:
          "remove the card limitation text… take back the add card button on
          this screen as well"). Both halves are one change: "Three cards is the
          maximum. Remove one to add another." only appeared AT three cards, and
          it was there to explain why the control above it had disappeared. With
          the sentence gone the hidden button would be an unexplained absence,
          so `Add a card` is unconditional now.

          THAT ALSO RETIRES THE NOTE ABOVE ABOUT "NO 1 OF 3" — its argument was
          "a count of a list you can see in full, set against a ceiling nobody
          is near", and there is no ceiling left to count against. The other
          three notes stand: the control is still text with a leading plus
          rather than a black button, for the reasons written there. */}
    <div class="sec-h"><h2>Your Cards</h2><button class="btn btn-t btn-sm noic ic-l sec-h-act" data-addcard="1">${I.add}Add a card</button></div>
    ${''/* THE DEFAULT IS A RADIO ON THE LEFT, NOT A "Make default" LINK ON THE
          RIGHT (Maryam, 2 Sep 2026: "instead of the make default text, add a
          radio button on the left side of each card row, the one with default
          will be selected").

          IT IS THE RIGHT COMPONENT BECAUSE THE QUESTION IS EXCLUSIVE. One card
          of three is the default, and a radio is the only control that says
          "one of these" in its own shape — where two "Make default" links said
          it three times over, once per row that was not it, and the row that
          WAS it had a gap where the others had a control. `.rad` is §02's own
          radio, the same one `.ldr-rec` and the log in screen's role blocks
          use, so nothing new is drawn.

          `checked` IS WRITTEN FROM `c.def` ON EVERY RENDER — trap 9. The
          handler is unchanged: `data-setdef` stays on the label, which is what
          lets the existing `[data-setdef]` branch answer both the click on the
          ring and the click on the row's own control. Nothing about the state
          moved into the DOM.

          THE RING IS THE COMPONENT'S BLACK, NOT THE ACCENT. §104's role blocks
          re-point it to `--accent` because Maryam asked for an orange radio
          there; nothing was asked here, so it keeps §02.201's `--brand-primary`
          — which is what `.ldr-rec` already draws one portal over.

          THE "Default" PILL STAYS. It is not the same statement as the ring:
          the ring is the control you press, the pill is the word for the state
          it is in, and a reader scanning three rows for which card gets charged
          reads the word. Only "Make default" was named in the ask. */}
    <div class="tile-stack">
      ${S.cards.map((c,i)=>`<div class="cardrow">
        <label class="rad card-rad" data-setdef="${i}" title="Make this my default card">
          <input type="radio" name="paydef"${c.def?' checked':''}><span class="box"></span></label>
        <span class="cardrow-ic">${BMK[c.brand]||BMK.card}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${c.brand} ending ${c.last}${c.def?' <span class="pill-def">Default</span>':''}</span>
          <span class="cardrow-d">Expires ${c.exp}</span>
        </span>
        ${''/* REMOVE IS RED WITH A BIN IN FRONT OF IT AND NO UNDERLINE (Maryam,
               2 Sep 2026). All three parts point the same way: this is the one
               destructive control in the list, and the product's rule for those
               is §29's `.btn.danger` — `--danger-ink` on the words AND on the
               mark. The underline came off because it is no longer standing in
               for a colour: §12's decision is that a link is blue because blue
               is the only blue on the screen, and a red underlined word beside
               a red glyph is two ways of saying "this is not ordinary text".

               THE MARK LEADS, which is `ic-l`'s own argument (§64): a trailing
               mark reads as the RESULT of pressing ("and then you go there"), a
               leading one as what the control does to the row it is on. `I.delete`
               is new to the set and its note in icons.js says why `misuse` —
               "Delete my account"'s circle-slash — is not it. */}
        <span class="cardrow-a">
          <button class="lnk card-del" data-delcard="${i}">${I.delete}Remove</button>
        </span>
      </div>`).join('')}
    </div>
  </div>
</div></main>`;
};

function photoSheet(){
  const tab = S.photoTab === 'avatar' ? 'avatar' : 'photo';
  const prev = S.photoPreview;               /* null | data-URL | 'removed' */
  const curPhoto = AV.hana;
  const avKeys = (typeof AVATARS !== 'undefined') ? Object.keys(AVATARS) : [];
  const cur = S.avatarPick || avKeys[0];

  const photoPane = `<div class="photopane">
    ${prev === 'removed'
      ? `<span class="photo-ph" aria-label="No photo">${I.image}</span>`
      : `<span class="av-ph photo-cur" style="width:160px;height:160px"><img src="${prev || curPhoto}" alt=""></span>`}
    <div class="btn-row photo-acts">
      <input type="file" id="photoUp" accept="image/*" hidden onchange="pfPhotoUpload(this)">
      <label class="btn btn-s noic photo-up" for="photoUp" role="button" tabindex="0">${I.upload} Upload Photo</label>
      <button class="btn btn-t noic" data-photoremove>${I.close} Remove</button>
    </div>
  </div>`;

  const avPane = `<div class="photogrid avgrid">
    ${avKeys.map(k=>`<button class="photopick ${k===cur?'on':''}" data-avpick="${k}" aria-label="Avatar">
      <span class="av-ph" style="width:100%;height:100%"><img src="${AVATARS[k]}" alt=""></span></button>`).join('')}
  </div>`;

  return `<div class="modal ${S.editPhoto?'on':''}" data-close="editphoto">
    <div class="sheet photo-sheet">
      <div class="sheet-h"><h2>Your photo</h2>
        <button class="x" data-editphoto="0" aria-label="Close">${I.close}</button></div>
      <div class="cs photo-cs">
        <button class="${tab==='photo'?'on':''}" data-phototab="photo">Profile Image</button>
        <button class="${tab==='avatar'?'on':''}" data-phototab="avatar">Avatar</button>
      </div>
      <div class="sheet-b">
        ${tab === 'avatar' ? avPane : photoPane}
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-editphoto="0">Cancel</button>
        <button class="btn btn-p noic" data-editphoto="0">${tab==='avatar'?'Update Avatar':'Update Photo'}</button>
      </div>
    </div>
  </div>`;
}
function pfPhotoUpload(input){
  const f = input && input.files && input.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = () => { S.photoPreview = r.result; S.photoTab = 'photo'; render(); };
  r.readAsDataURL(f);
}
if(typeof window !== 'undefined') window.pfPhotoUpload = pfPhotoUpload;

function payForm(tab, open){
  const card = tab !== 'bank';
  const tabTop = card ? '7.75%' : '9.70%', tabH = card ? '8.70%' : '10.89%';
  const clsTop = card ? '93%' : '91.3%', clsH = card ? '6%' : '7%';
  const z = 'position:absolute;background:transparent;border:0;cursor:pointer';
  return `<div class="modal pay-modal ${open?'on':''}" data-payclose style="align-items:center;padding:var(--s06)">
    <div class="pay-embed" style="position:relative;width:100%;max-width:460px;max-height:100%;overflow:auto;margin:auto">
      <img src="${card?PAY_ART.card:PAY_ART.bank}" alt="Add a payment method" style="display:block;width:100%">
      <button data-paytab="card" aria-label="Pay by card" style="${z};top:${tabTop};height:${tabH};left:3.5%;width:46%"></button>
      <button data-paytab="bank" aria-label="Pay by US bank account" style="${z};top:${tabTop};height:${tabH};left:50.4%;width:46%"></button>
      <button data-payclose aria-label="Close" style="${z};top:${clsTop};height:${clsH};left:48%;width:50%"></button>
    </div>
  </div>`;
}

function cardSheet(){ return payForm(S.payTab, S.addCard); }

function payWithIdx(){
  const s = S.payWith;
  if(s != null && S.cards[s]) return s;
  const d = S.cards.findIndex(c => c.def);
  return d < 0 ? 0 : d;
}
const addCardAct = `<button class="btn btn-t btn-sm noic ic-l sec-h-act" data-addcard="1">${I.add}Add a card</button>`;
function cardPicker(){
  const sel = payWithIdx();
  return `<div class="tile-stack">
    ${S.cards.map((c, i) => `<div class="cardrow" data-paypick="${i}" style="cursor:pointer">
      <span class="rad card-rad"><input type="radio" name="paywith"${i === sel ? ' checked' : ''} tabindex="-1"><span class="box"></span></span>
      <span class="cardrow-ic">${BMK[c.brand] || BMK.card}</span>
      <span class="cardrow-b">
        <span class="cardrow-t">${c.brand} ending ${c.last}${c.def ? ' <span class="pill-def">Default</span>' : ''}</span>
        <span class="cardrow-d">Expires ${c.exp}</span></span>
    </div>`).join('')}
  </div>`;
}


const MEMBER_SINCE = 'January 8, 2026';

const pfFact = (ic, mk, label, val) => `<div style="--mk:var(${mk})">
  <span class="l pf-l">${ic}${label}</span>
  <span class="v">${val}</span></div>`;



const INTENTS = ['Develop in my current role','Develop for another role','Develop for ownership'];
const PF = {
  general: {
    name:'Maryam Naz',
    nickname:'@maryamsss',
    role:'Operations Lead',
    industry:'Software',
    years:'5 years',
    intent:'Develop in my current role',
    headline:'Senior UX/UI Designer',
    company:'Tkxel',
    location:'Lahore, Punjab, Pakistan',
    email:'maryam.naz@tkxel.io',
    phone:'0305-4672294',
    tz:'Pakistan Standard Time (PKT)',
    about:'Senior UX/UI Designer with hands-on experience delivering user-centered designs across SaaS platforms, dashboards, mobile applications and web experiences. Strong background in building design systems, crafting user journeys, and partnering with cross-functional teams to turn ideas into polished digital products.'
  },
  experience: [
    {role:'Operations Lead', org:'Tkxel', kind:'Full-time',
     from:'Jan 2024', to:'Present', span:'2 yrs 8 mos'},
    {role:'Business Operations Analyst', org:'TechmateTech LLC', kind:'Full-time',
     from:'Mar 2021', to:'Dec 2023', span:'2 yrs 10 mos'}
  ],
  education: [
    {school:'COMSATS Institute of Information and Technology', art:'comsats',
     degree:'', field:'', from:'2018', to:'2022'}
  ],
  certs: [
    {name:'Enterprise Design Thinking Co-Creator', org:'IBM', art:'ibmco',
     issued:'Jan 2023', cred:'User Experience Design (UXD)'},
    {name:'Enterprise Design Thinking Practitioner', org:'IBM', art:'ibmpr',
     issued:'Dec 2022', cred:'Enterprise Design Thinking'}
  ],
  skills: ['Mockups','Low-fidelity designs','User Experience Design (UXD)',
           'Interaction Design','Visual Design','Web Design','Brand Design',
           'Logo Design','UX Research','Wireframing','Prototyping',
           'Adobe Photoshop']
};

const PF_SEC = [
  {k:'general', lab:'General Details',            ic:'user'},
  {k:'work',    lab:'Experience',                 ic:'growth'},
  {k:'edu',     lab:'Education',                  ic:'book'},
  {k:'cert',    lab:'Licenses &amp; Certifications', ic:'certificate'},
  {k:'skill',   lab:'Skills',                     ic:'skill'}
];

function pfMiss(k){
  const out = [];
  if(k === 'general'){
    const g = PF.general;
    [['name','Your name'],['nickname','Nickname'],['role','Current role'],
     ['industry','Industry'],['years','Years of experience'],['intent','Intent aspiration'],
     ['email','Email'],['about','About']]
      .forEach(([f,l]) => { if(!g[f]) out.push(l); });
  }
  if(k === 'edu') PF.education.forEach(e => {
    if(!e.degree) out.push(`Degree at ${e.school}`);
    if(!e.field)  out.push('Field of study');
  });
  if(k === 'cert') PF.certs.forEach(c => { if(!c.cred) out.push(`Credential for ${c.name}`); });
  if(k === 'skill' && !PF.skills.length) out.push('At least one skill');
  return out;
}
const pfSecDone = k => pfMiss(k).length === 0;

function pfDone(){
  const done = PF_SEC.filter(s => pfSecDone(s.k)).length;
  return {done, total:PF_SEC.length, pct:Math.round(done / PF_SEC.length * 100)};
}

const PF_COURSES_DONE = new Set(['day90','promoted']);
const pfCourses = () => PF_COURSES_DONE.has(S.stage) ? 1 : 0;

function pfRing(){
  const d = pfDone();
  return ring(d.pct, `Profile ${d.pct}% complete, ${d.done} of ${d.total} sections`, 'qa-ring');
}


S.pfEdit = null;

S.dd = null;
S.ddVal = {};

const pfFirstGap = () => (PF_SEC.find(s => !pfSecDone(s.k)) || PF_SEC[0]).k;


function dd(key, opts, val){
  const open = S.dd === key, cur = val || opts[0];
  return `<div class="dd${open ? ' on' : ''}" data-dd="${key}">
    <button type="button" class="inp dd-btn" data-ddtoggle="${key}"
      aria-haspopup="listbox" aria-expanded="${open}">
      <span class="dd-val t-body">${cur}</span>
      <svg class="dd-cx" viewBox="0 0 24 24">${inner('chevDown')}</svg>
    </button>
    <div class="dd-menu" role="listbox">
      ${opts.map(o => `<button type="button" class="dd-opt${o === cur ? ' on' : ''}"
        role="option" aria-selected="${o === cur}" data-ddset="${key}:${o}">
        <span class="dd-opt-t t-body">${o}</span>
        <svg class="dd-tick" viewBox="0 0 24 24">${inner('check')}</svg></button>`).join('')}
    </div>
  </div>`;
}

function pfField(id, [k, lab, v, o]){
  const opt = o || {};
  const fid = `pf-${id}-${k}`;
  const body = opt.t === 'area'
    ? `<textarea class="inp" id="${fid}" rows="4" placeholder="${opt.ph || ''}">${v || ''}</textarea>`
    : opt.t === 'dd'
      ? dd(fid, opt.o, S.ddVal[fid] || v)
    : opt.t === 'sel'
      ? `<select class="inp" id="${fid}">${opt.o.map(x =>
          `<option${x === v ? ' selected' : ''}>${x}</option>`).join('')}</select>`
      : opt.t === 'pw'
        ? `<input class="inp" id="${fid}" type="password" autocomplete="${opt.ac || 'new-password'}" placeholder="${opt.ph || ''}">`
        : opt.ro
          ? `<input class="inp pfe-ro" id="${fid}" value="${v || ''}" readonly aria-readonly="true">`
        : `<input class="inp" id="${fid}" value="${v || ''}" placeholder="${opt.ph || ''}">`;
  return `<div class="f pfe-f${opt.w ? ' pfe-f-w' : ''}">
    <label for="${fid}">${lab}${(v || opt.ro) ? '' : '<span class="pfe-need">Needed</span>'}</label>
    ${body}
  </div>`;
}
const pfFields = (id, rows, cls) => `<div class="pfe-g${cls ? ' ' + cls : ''}">${rows.map(r => pfField(id, r)).join('')}</div>`;

const pfEntry = (title, body) => `<div class="pfe-e">
  <div class="pfe-e-h">
    <span class="pfe-e-t t-h4">${title}</span>
    <button class="btn btn-t btn-sm pfe-e-x">Remove ${I.delete}</button>
  </div>
  ${body}
</div>`;

const pfChips = (items, add) => `<div class="skl pfe-chips">
  ${items.length
    ? items.map(x => `<span class="skl-c pfe-chip">${x}<button class="pfe-chip-x" aria-label="Remove ${x}">${I.close}</button></span>`).join('')
    : `<span class="pfe-chip-none t-desc">Nothing here yet.</span>`}
  <button class="btn btn-g btn-sm pfe-chip-add">${add} ${I.add}</button>
</div>`;

const pfFormGeneral = () => {
  const g = PF.general;
  return `
  ${''/* `data-pfsec` IS ON BOTH STATES OF EVERY SECTION — the read view's first
        `.sec` and the form's — because the click handler scrolls to it AFTER
        the render that opened the form, so the element it looks for is the one
        that replaced the row it was pressed on. Written on the read view only,
        the target is gone by the time the scroll runs. */}
  ${''/* ONE SECTION, NOT TWO, BECAUSE THE HEAD ROW IS NOW THE STATE. The form
        used to open with "Photo and identity" and follow with "Your details";
        with Save and Discard living in a section's head row, two sections would
        mean two heads and only one of them carrying the pair. The photo row is
        the first thing inside the one section instead. */}
  <div class="sec" data-pfsec="general">
    ${''/* NO "General details" HEADING IN THE EDIT VIEW (Maryam, 14 Sep 2026) —
          the form opens straight on the photo row. The `.sec-h` stays as the
          carrier for the Save / Discard pair, which `.pfe-acts{margin-left:auto}`
          still floats to the far right of the label-column-free profile page
          (§111 "this page has no label column"). The READ view keeps its
          heading; only this form drops it. */}
    <div class="sec-h">${pfActs('general')}</div>
    ${''/* THE PHOTO CARRIES ITS OWN EDIT CONTROL NOW — Maryam, 7 Sep 2026: "the
          change photo should not come on the right, an edit icon could appear on
          the image bottom right in edit view". The right-hand "Change photo"
          button (`.idhead-a`) is gone; `.idphoto-edit` is the pencil badge on the
          photograph's lower-right, which §11 places on the round disc's edge. This
          REVERSES §105 — it took the badge off the photo because there were "two
          controls doing one job 40px apart"; with the right button removed the
          badge is the one control, so the argument that ended it is what brings it
          back. The badge is drawn only in this edit state; the read view's photo
          stays a plain disc. */}
    <div class="idhead pfe-id">
      <button class="idphoto" data-editphoto="1" aria-label="Change your photo">
        ${pfFlipAvatar()}
        <span class="idphoto-edit">${I.edit}</span>
      </button>
      <div class="idhead-b">
        <span class="idname">${g.name}</span>
        ${''/* THE SUB-LINE IS THE NICKNAME, NOT THE HEADLINE — Maryam, 7 Sep
              2026: "in place of the Senior UX/UI Designer at Tkxel beneath name
              I need you to show the nickname". The read view says the same thing
              now (`pfSecView.general`), so both states of this row read name +
              handle. `headline`/`company` are no longer printed anywhere; they
              stay on the record, flagged. */}
        <span class="idmeta">${g.nickname}</span>
      </div>
    </div>
    ${''/* FOUR FIELDS, THREE ACROSS — Maryam, 7 Sep 2026: "Name, Nickname (which
          is kind of a user name), Email address (which will not be editable),
          About", then "email could also come in the same row of the name and
          nickname". `.pfe-g3` puts Name / Nickname / Email on one row; About is
          `w:1` (`.pfe-f-w`), which spans `1 / -1` — all three columns — so it sits
          full width under them. Email is `ro`: read and not change. */}
    ${''/* THE FIVE ONBOARDING FIELDS join the form (Client, 9 Sep 2026). Name /
          Nickname / Email fill row 1; Current role / Industry / Years of
          experience fill row 2; Intent aspiration is a `sel` over `INTENTS` and
          sits alone on row 3 (a single control, not full-width); About stays
          `w:1` full width last. The `.pfe-g3` grid still collapses to one column
          below 700, so every field stacks on a phone. Current role doubles as
          the student flag — "Student" here is what makes them a student, and the
          degree program is the Education section's own field. */}
    ${pfFields('gen', [
      ['name','Name', g.name],
      ['nickname','Nickname', g.nickname, {ph:'A short name others can call you'}],
      ['email','Email', g.email, {ro:true}],
      ['role','Current role', g.role, {ph:'e.g. Operations Lead — or Student'}],
      ['industry','Industry', g.industry, {ph:'e.g. Software'}],
      ['years','Years of experience', g.years, {ph:'e.g. 5 years'}],
      ['intent','Intent aspiration', g.intent, {t:'dd', o:INTENTS}],
      ['about','About', g.about, {t:'area', w:1,
        ph:'Two or three sentences on what you do and what you are good at.'}]
    ], 'pfe-g3')}
    ${''/* THE LEVEL/TRACK NOTE IS GONE (Maryam, 7 Sep 2026: "remove the Your
          level and your track … line"). It read "Your level and your track are
          set by your agent at the interview and cannot be edited here" — true,
          and no longer needed on a form that no longer even hints at a level
          control. The fact still holds: nothing here edits a level. */}
  </div>`;
};

const pfFormWork = () => `
  <div class="sec" data-pfsec="work">
    ${pfHead('work','Experience')}
    ${PF.experience.map((e, i) => pfEntry(`${e.role} &middot; ${e.org}`, pfFields('w' + i, [
      ['role','Title', e.role],
      ['org','Company', e.org],
      ['kind','Employment type', e.kind, {t:'sel', o:['Full-time','Part-time','Freelance','Contract','Internship']}],
      ['from','Start', e.from],
      ['to','End', e.to, {ph:'Present'}]
    ]))).join('')}
  </div>`;

const pfFormEdu = () => `
  <div class="sec" data-pfsec="edu">
    ${pfHead('edu','Education')}
    ${PF.education.map((e, i) => pfEntry(e.school, pfFields('e' + i, [
      ['school','School', e.school, {w:1}],
      ['degree','Degree', e.degree, {ph:'BS'}],
      ['field','Field of study', e.field, {ph:'Computer Science'}],
      ['from','Start year', e.from],
      ['to','End year', e.to]
    ]))).join('')}
  </div>`;

const pfFormCert = () => `
  <div class="sec" data-pfsec="cert">
    ${pfHead('cert','Licenses &amp; certifications')}
    ${PF.certs.map((c, i) => pfEntry(c.name, pfFields('c' + i, [
      ['name','Name', c.name, {w:1}],
      ['org','Issuing organisation', c.org],
      ['issued','Issue date', c.issued],
      ['cred','Credential', c.cred, {w:1, ph:'What the credential is in'}]
    ]))).join('')}
  </div>`;

const pfFormSkill = () => `
  <div class="sec" data-pfsec="skill">
    ${pfHead('skill','Skills')}
    ${pfChips(PF.skills, 'Add a skill')}
  </div>`;


const PF_FORM = {general:pfFormGeneral, work:pfFormWork, edu:pfFormEdu,
                 cert:pfFormCert, skill:pfFormSkill};

const PF_TABS = [['me','My Profile'], ['linked','Linked Accounts'], ['courses','My Courses'],
                 ['notif','Notifications'], ['priv','Privacy Settings']];
const pfTabList = () => S.stage === 'promoted'
  ? [...PF_TABS, ['lead', 'Volunteer to lead a Cohort']]
  : PF_TABS;
S.pfTab = 'me';

const CL_DO = [
  ['group','--mk-1','Guide your cohort',
   'Support a group of learners by answering questions, sharing insights, and encouraging meaningful discussions.'],
  ['chat','--mk-2','Facilitate conversations',
   'Lead weekly discussions and activities that help your cohort stay engaged and on track.'],
  ['book','--mk-3','Share resources',
   'Curate and share helpful resources, tools, and examples that add value to your cohort.'],
  ['star','--mk-4','Be a role model',
   'Lead by example. Inspire others with your journey, mindset, and commitment to growth.']
];
const CL_GET = ['Earn a Cohort Leader certification',
  'Build your leadership and communication skills',
  'Get recognised on your TalentNext profile',
  'Expand your network and collaborate with leaders',
  'Make a real impact by helping others grow'];
const CL_DUTY = ['Commit 2&ndash;3 hours per week',
  'Stay active and responsive in cohort discussions',
  'Encourage participation and inclusivity',
  'Uphold community guidelines and values',
  'Communicate updates and feedback to the team'];

const CL_STEPS = [
  ['add','--mk-1','Volunteer',
   'Put your name forward to lead a cohort. It is a volunteer role, open to you now that your 90 days are complete.'],
  ['chat','--mk-2','Interview with a talent agent',
   'A talent agent meets you for a short interview to understand your strengths and how you support other learners.'],
  ['checkFilled','--mk-3','Selection decision',
   'If you are selected, you are matched with a cohort to lead. If not, you get feedback and can volunteer again next cohort.']
];

const clList = (items) => `<ul class="lrn">
  ${items.map(t => `<li class="lrn-i"><span class="lrn-tk">${I.check}</span><span class="lrn-t">${t}</span></li>`).join('')}
</ul>`;

const pfLead = () => `
  <div class="sec">
    ${aiHead({
      title:'Volunteer for cohort leader',
      desc:'Cohort leaders are experienced learners who volunteer to guide and support their peers. Volunteer for the role, meet a talent agent for a short interview, and if you are selected you will be matched with a cohort to lead.',
      act:S.ledApplied
        ? `<button class="btn btn-p noic" disabled>Request sent ${I.checkFilled}</button>`
        : `<button class="btn btn-p noic" data-leadapply="1">Volunteer to lead a cohort ${I.arrowRight}</button>`})}
    ${''/* THE CONFIRMATION IS GREEN AND NAMES THE NEXT STEP (Maryam, 13 Sep 2026:
          volunteering now leads to a talent-agent interview, so the sent state
          says the agent will be in touch rather than "moved forward"). `.cl-ok`
          re-points §02's `.note` mark from the information blue to §02.440's
          success pair, the same hue §109 gives the enrolment dialog's tick.
          "TALENTnext" stays set the way the wordmark is (§63 §2's capitals
          exception is the wordmark). No em dashes (Tal-voice/house rule). */}
    ${S.ledApplied ? `<div class="note cl-ok"><span>${I.checkFilled}</span><div class="nb">Thanks for volunteering. A talent agent will reach out on your email to schedule your interview, and you will hear whether you have been selected after it. Sent by the TALENTnext team.</div></div>` : ''}
  </div>
  <div class="sec sec-noline">
    ${''/* HOW IT WORKS — the volunteer → interview → decision flow, in the same
          card grid as the duties below (`CL_STEPS`, 13 Sep 2026). `sec-noline`
          drops this section's foot hairline so it reads as one band with "What
          does a cohort leader do?" below it — no divider between the two (Maryam,
          13 Sep 2026: "remove the line above What does a cohort leader do?"). */}
    <div class="sec-h"><h2>How volunteering works</h2></div>
    <div class="cl-do">
      ${CL_STEPS.map(([ic, mk, t, d]) => `<div class="cl-c" style="--mk:var(${mk})">
        <span class="cl-ic">${I[ic]}</span>
        <span class="cl-t t-h4">${t}</span>
        <span class="cl-d t-desc">${d}</span>
      </div>`).join('')}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>What does a cohort leader do?</h2></div>
    <div class="cl-do">
      ${CL_DO.map(([ic, mk, t, d]) => `<div class="cl-c" style="--mk:var(${mk})">
        <span class="cl-ic">${I[ic]}</span>
        <span class="cl-t t-h4">${t}</span>
        <span class="cl-d t-desc">${d}</span>
      </div>`).join('')}
    </div>
  </div>
  <div class="sec">
    ${''/* THE PAIR HAS NO HEADING OF ITS OWN, because each panel's own `<h3>` is
          a question and two questions under a third heading would be a heading
          naming a heading. The reference does the same. */}
    <div class="cl-pair">
      <div class="cl-p"><h3 class="t-h4">What&rsquo;s in it for you?</h3>${clList(CL_GET)}</div>
      <div class="cl-p"><h3 class="t-h4">What are the responsibilities?</h3>${clList(CL_DUTY)}</div>
    </div>
    ${''/* THE ELIGIBILITY NOTE IS GONE (Maryam, 4 Sep 2026: "remove this"). It
          read "Who can apply? Graduates who have completed their 90-day journey
          and are currently at or above Explorer – E3 level" in §02's `.note`,
          and it was the reference's closing block.

          WHAT IT SAID IS NOT LOST, WHICH IS WHY IT GOES CHEAPLY: `leadSec`'s
          card — the invitation on every other tab — states the same two
          conditions as `.lead-tags` ("Volunteer role", "Earns a certification",
          "Teaches below <level>") and opens with "You've completed your 90-day
          journey". A rule stated twice on one page in two registers is the
          repetition this page spent the afternoon removing.

          AND IT WAS THE PAGE'S ONE HARDCODED LEVEL. Every other level in the
          product is read off the record; this one was the threshold an
          application is judged against, which does not move when the reader is
          promoted — so if it comes back it comes back as a string, and §116.3
          keeps that argument with the deleted `.cl-who` rule. */}
  </div>`;

const pfTabs = () => {
  if(S.pfTab === 'lead' && S.stage !== 'promoted') S.pfTab = 'me';
  const d = pfDone();
  return `<div class="sec sec-cs pf-cs">
  <div class="cs" role="tablist" aria-label="Profile sections">
    ${pfTabList().map(([k, lab]) => `<button class="${S.pfTab === k ? 'on' : ''}" role="tab"
      aria-selected="${S.pfTab === k}" data-pftab="${k}">${lab}${
      k === 'me' ? `<span class="lf-n">${d.done}/${d.total}</span>` : ''}</button>`).join('')}
  </div>
</div>`;
};

const PF_ADD = {work:'a role', edu:'a school', cert:'a certification'};

const pfActs = (k) => S.pfEdit === k
  ? `<div class="pfe-acts">
      ${''/* `.btn-sm` ON BOTH, so the pair is one 32px line. Without it Discard
            takes `.btn`'s 40 against Save's 32 and the group is two heights in
            a heading row that is 22px tall. */}
      <button class="btn btn-t btn-sm danger pfe-discard" data-pfedit="">${I.delete} Discard Changes</button>
      <button class="btn btn-p btn-sm noic" data-pfedit="">Save Changes ${I.check}</button>
    </div>`
  : `<div class="pfe-acts">
      ${PF_ADD[k] ? `<button class="btn btn-g btn-sm noic pfe-ic" data-pfedit="${k}" aria-label="Add ${PF_ADD[k]}">${I.add}</button>` : ''}
      <button class="btn btn-g btn-sm noic pfe-ic" data-pfedit="${k}" aria-label="Edit ${(PF_SEC.find(s => s.k === k) || {}).lab || 'this section'}">${I.edit}</button>
    </div>`;

const pfHead = (k, lab) => `<div class="sec-h"><h2>${lab}</h2>
  ${pfActs(k)}
</div>`;


const pfArt = (k, fb) => PF_ART[k]
  ? `<span class="pfe-art"><img src="${PF_ART[k]}" alt="" loading="lazy"></span>`
  : `<span class="cardrow-ic pfe-art-fb">${fb}</span>`;

const pfRow = (lead, t, d, x) => `<div class="cardrow pfe-row">
  ${lead}
  <span class="cardrow-b"><span class="cardrow-t">${t}</span>
    <span class="cardrow-d">${d}</span>${x ? `<span class="pfe-row-x t-desc">${x}</span>` : ''}</span>
</div>`;

function scenesCarousel(title, scenes, opts){
  opts = opts || {};
  const role = opts.role || 'Talent Agent';
  return `<div class="sec">
    <div class="sec-h"><h2>${title}</h2>
      <div class="scv-nav">
        <button class="scv-ch" data-scv="-1" aria-label="Previous scenes">${I.chevLeft}</button>
        <button class="scv-ch" data-scv="1" aria-label="Next scenes">${I.chevRight}</button>
      </div>
    </div>
    <div class="scv-row">
      ${scenes.map((s, idx) => `<div class="scv">
        <span class="scv-art">
          <img src="${s.img}" alt="">
          <span class="scv-play">${I.play}</span>
          <span class="scv-at t-caption">${s.at}</span>
        </span>
        ${''/* THE SHARE CONTROL IS A SIBLING OF `.scv-art`, NOT A CHILD — the
              art is `overflow:hidden`, so its menu would be clipped inside it.
              `opts.shareFor(idx)` is the caller's own control (candidate only,
              it needs `S.shareOpen`); a portal that hands no `shareFor` gets
              nothing, which is why this builder stays pure enough for the DS. */}
        ${opts.shareFor ? opts.shareFor(idx) : ''}
        <span class="scv-b">
          <span class="scv-h t-h4">${s.title}</span>
        </span>
        <p class="t-desc eo-lead">
          <span class="av-ph eo-lead-ph"><i>${s.i || ''}</i><img src="${s.img}" alt="" loading="lazy" onerror="this.style.display='none'"></span>
          ${role}: <b>${s.name}</b></p>
      </div>`).join('')}
    </div>
    ${opts.foot || ''}
  </div>`;
}

function scvScroll(btn){
  const sec = btn.closest('.sec');
  const row = sec && sec.querySelector('.scv-row');
  const card = row && row.firstElementChild;
  if(row && card) row.scrollBy({left:(card.offsetWidth + 16) * +btn.dataset.scv, behavior:'instant'});
}

const pfScenes = () => {
  const a = AGENTS[(S.booking && S.booking.agent) || S.agent || recKey()] || AGENTS.priya;
  const scenes = SCENES.level.map(([t, , at]) => ({img:a.img, i:a.i, name:a.n, at, title:t}));
  const foot = `<button class="scene-ask" data-tal-ask="Why were these scenes chosen from my interview?"><i class="aih-mk"></i>Ask Tal why these scenes were chosen from your interview?</button>`;
  return scenesCarousel('Interview scenes', scenes, {foot, shareFor: i => shareControl('scv:' + i)});
};

const pfSecView = {
  general: (f) => {
    const g = PF.general;
    return `
    ${''/* THE IDENTITY ROW OPENS THE TAB, AND IT IS THE PAGE'S OLD ONE. Before
          the strip this `.idhead` was the first thing under the head band on
          every visit. Nothing about it changed — the same 72px photograph, the
          same `data-editphoto`, the same name and address — and it is one of
          the two doors into `photoSheet`, the other being the same row inside
          the form. The page's own "Edit details" button is not here: `pfHead`
          puts one Edit on the section a row below, and two controls doing one
          job 40px apart is what §105 took the pencil badge off the photo for. */}
    ${''/* THE `General details` SECTION IS GONE AND ITS EDIT MOVED ONTO THE
          IDENTITY ROW (Maryam, 3 Sep 2026: "remove general details section,
          take the 4 card right after the first row of image name and email").

          THE ROW IS WHERE THAT CONTROL BELONGS ANYWAY, and `V.account` drew it
          exactly there before the tabs — "Edit details" on `.idhead-a`,
          opposite the photograph and the name it changes, which is §29.10's
          rule and the reason §105 took the pencil badge off the photo. It is
          the only door to the General form now, so it is not optional.

          FLAGGED: HEADLINE, CURRENT COMPANY, LOCATION AND PHONE ARE NO LONGER
          READ ANYWHERE ON THIS PAGE. They are still in `PF.general`, still on
          the form behind Edit, and still what `pfMiss` counts — the read view
          simply stops printing them. Time zone survives because the `.facts`
          band already carried it. If they should come back, `.idhead-b` is the
          place (LinkedIn's own header puts the headline and the location under
          the name) rather than a second band. */}
    <div class="sec" data-pfsec="general">
      <div class="idhead">
        <button class="idphoto" data-editphoto="1" aria-label="Change your photo">
          ${pfFlipAvatar()}
        </button>
        <div class="idhead-b">
          ${''/* THE RANK CHIP RIDES BESIDE THE NAME (Maryam, 9 Sep 2026: a red
                pill like Rank #2, light red with red accent text). The number is
                the real star-rank index off GAME for this stage (the same figure
                the dashboard standing block reads, so it cannot drift), drawn
                only on stages that have a rank; pre-enrolment there is nothing to
                rank yet. */}
          <span class="idname-row">
            <span class="idname">${g.name}</span>
            ${GAME[S.stage] ? `<span class="rank-chip t-label">Rank #${GAME[S.stage].rank}</span>` : ''}
          </span>
          ${''/* THE SUB-LINE IS THE NICKNAME (Maryam, 7 Sep 2026: "in place of the
                saved view, the nickname should be shown instead of the email").
                The email is a field on the form one press away, and the head band
                above already reads off the account — so the handle is the one
                identity fact this row was not already saying twice. The edit
                form's own idhead matches it. */}
          <span class="idmeta">${g.nickname}</span>
        </div>
        <div class="idhead-a"><button class="btn btn-g" data-pfedit="general">Edit details ${I.edit}</button></div>
      </div>
      ${''/* THE FOUR FACTS SHARE THE ROW'S SECTION AND HAVE NO HEADING. "Right
            after the first row" is what was asked, and a heading between the
            two would be the block that has just come out. §10.15's label column
            cannot reach them either: `.facts` is on its opt-out list, and this
            section has no `.sec-h` at all.

            THE FOUR ARE MY TRACK / MY LEVEL / POINTS / TOTAL COURSES TAKEN
            (Maryam, 3 Sep 2026), and the set they replaced is worth recording
            because two of the four were the same string. It was Time zone,
            Level, Member since and Primary track — and before the interview
            Level printed the TRACK, so "Explorer track" appeared in cells 2 and
            4 of a band whose whole job is four different readings. Time zone is
            a preference rather than a reading and belongs to the form; Member
            since is a date nothing else on the page acts on.

            EVERY ONE OF THE FOUR IS READ. The track and the level come off the
            stage's own `CFG` row (`f.track`, `f.level`, and `f.pred` for
            whether an agent has set it yet), the points off `GAME[S.stage]` —
            absent on the four pre-course stages, where the honest figure is 0
            rather than a dash — and the courses off `pfCourses`.

            "No level yet" IS THE PRODUCT'S OWN PHRASE for the pre-interview
            state, not new copy: `dashPh` prints it on `new` and on `booked` in
            the fact row under the greeting. */}
      ${''/* THE FIVE ONBOARDING FIELDS READ HERE (Client, 9 Sep 2026). Current
            role, Industry, Years of experience and the Intent aspiration append
            to the same headingless `.facts` band under the name — `.facts` is a
            §10.15 label-column opt-out and auto-fits, so the row simply wraps to
            more lines as it grows and no breakpoint work is needed. Degree/
            student read in the Education tab. Icons are all real `IP` names
            (trap 7): user / skill / time / flag. */}
      <div class="facts pf-facts">
        ${pfFact(I.growth, '--mk-4', 'My track', f.track + ' track')}
        ${pfFact(I.chart, '--mk-3', 'My level', f.pred ? 'No level yet' : lvlName(f.level))}
        ${pfFact(I.trophy, '--mk-2', 'Points', (GAME[S.stage] ? GAME[S.stage].pts : 0).toLocaleString())}
        ${pfFact(I.book, '--mk-1', 'Total courses taken', String(pfCourses()))}
        ${pfFact(I.user, '--mk-1', 'Current role', g.role)}
        ${pfFact(I.skill, '--mk-2', 'Industry', g.industry)}
        ${pfFact(I.time, '--mk-3', 'Years of experience', g.years)}
        ${pfFact(I.flag, '--mk-4', 'Aspiration', g.intent)}
      </div>
    </div>
    <div class="sec">
      <div class="sec-h"><h2>About</h2></div>
      <p class="t-body pfe-about">${g.about}</p>
    </div>`;
  },

  work: () => `
    <div class="sec" data-pfsec="work">
      ${pfHead('work','Experience')}
      <div class="tile-stack">
        ${''/* TWO LINES, DOWN FROM FOUR, IN TWO ASKS AN HOUR APART (Maryam, 4
              Sep 2026: "remove ... the bottom detail desc row from
              experiences", then "remove the lahore punjab row from both
              experiences"). What is left is what a role IS — the title and the
              company — and WHEN it ran. Both rows said the same city, so the
              line that was meant to distinguish them distinguished nothing;
              the one word in it that varied was the mode, and On-site against
              Hybrid is not what a reader scans a work history for.

              THE FIELDS WENT WITH THE LINE, as `desc`'s did. A form control
              writing a value nothing draws is the "gate nothing writes" tell
              from the other side, so `place` and `mode` are out of the record
              and out of `pfFormWork`. **They are the two facts to put back
              first if this row returns** — the record is otherwise role, org,
              kind and the two dates, which is what the read row prints. */}
        ${PF.experience.map((e) => pfRow('',
          `${e.role} &middot; ${e.org}`,
          `${e.kind} &middot; ${e.from} &ndash; ${e.to} &middot; ${e.span}`)).join('')}
      </div>
    </div>`,

  edu: () => `
    <div class="sec" data-pfsec="edu">
      ${pfHead('edu','Education')}
      <div class="tile-stack">
        ${PF.education.map((e) => pfRow(pfArt(e.art, I.book), e.school,
          `${e.from} &ndash; ${e.to}`,
          e.degree || e.field ? [e.degree, e.field].filter(Boolean).join(' &middot; ') : '')).join('')}
      </div>
    </div>`,

  cert: () => `
    <div class="sec" data-pfsec="cert">
      ${pfHead('cert','Licenses &amp; certifications')}
      <div class="tile-stack">
        ${PF.certs.map((c) => pfRow(pfArt(c.art, I.certificate), c.name,
          `${c.org} &middot; issued ${c.issued}`, c.cred)).join('')}
      </div>
    </div>`,

  skill: () => `
    <div class="sec" data-pfsec="skill">
      ${pfHead('skill','Skills')}
      <div class="skl">${PF.skills.map(n => `<span class="skl-c">${n}</span>`).join('')}</div>
    </div>`
};

S.pfPw = false;

const PF_PW_SET = '14 August 2026';
const pfSecurity = () => `
  <div class="sec">
    <div class="sec-h"><h2>Sign in and security</h2></div>
    <div class="tile-stack">
      ${''/* NO CHIP AND NO RULE BETWEEN THE ROWS (Maryam, 4 Sep 2026: "remove
            the dividers between these two rows", "instead of these blocked icon
            please use colored icons without blocks"). `.cardrow-ic`'s 40px
            tinted square goes the way §29's `.stat-ic` and §72's `.pulse-ic`
            went — a bare 20px glyph in a stated hue — and `.pf-sr` is what
            turns §02.229's row border off. Two rows of one subject need no line
            between them; §111.14 is both rules. The hues are NAMED per §72's
            `pulseCol` idiom, not cycled: blue for the address, violet for the
            lock, so they cannot swap if a third row is added. */}
      <div class="cardrow pfe-row pf-sr">
        <span class="pf-sr-ic" style="--mk:var(--mk-1)">${I.email}</span>
        <span class="cardrow-b"><span class="cardrow-t">${PF.general.email}</span>
          <span class="cardrow-d">The address you sign in with &middot; change it under My Profile</span></span>
      </div>
      <div class="cardrow pfe-row pf-sr">
        <span class="pf-sr-ic" style="--mk:var(--mk-3)">${I.locked}</span>
        <span class="cardrow-b"><span class="cardrow-t">Password</span>
          <span class="cardrow-d">Last changed ${PF_PW_SET}</span></span>
        ${S.pfPw
          ? `<button class="btn btn-g btn-sm" data-pfpw="0">Cancel ${I.close}</button>`
          : `<button class="btn btn-g btn-sm" data-pfpw="1">Reset password ${I.renew}</button>`}
      </div>
    </div>
    ${S.pfPw ? `
    ${pfFields('pw', [
      ['cur','Current password','x',{t:'pw', ac:'current-password', w:1, ph:'The one you use now'}],
      ['new','New password','x',{t:'pw', ph:'At least 12 characters'}],
      ['rep','Repeat new password','x',{t:'pw', ph:'The same again'}]
    ])}
    ${''/* THE FOOT IS INSIDE THE SECTION AND IS NOT A `.sec` — `pfFoot`'s row is
          a section of its own because it follows one, and a `.sec` nested in a
          `.sec` would pay §10's frame twice and draw §10.2's closing hairline
          in the middle of this block. Same class for the layout, no `.sec`, and
          §111.7a gives it the top margin the section gap would have been.
          The primary says what it does to the password rather than "Save
          changes", because this is the only form on the page that is not
          editing a record you can see. */}
    <div class="pfe-foot pfe-foot-in">
      <button class="btn btn-g" data-pfpw="0">Cancel ${I.close}</button>
      <button class="btn btn-p noic" data-pfpw="0">Update password ${I.check}</button>
    </div>` : ''}
  </div>`;

const pfPrivacy = () => `
  ${pfSecurity()}
  ${''/* "What Tal can do" AND "Your data" ARE DELETED (Maryam, 4 Sep 2026:
        "remove what tal can do and your data sections"). The tab is Sign in and
        security over Closing your account now.

        WHAT WENT: three `.tg` switches — read my chapter notes, act without
        asking, pause Tal — and three `.cardrow`s: download everything we hold,
        ask for a level review (`data-tal-ask`), and the recordings row linking
        the notice.

        AND IT PUTS A PROMISE BACK OUT OF REACH, WHICH IS WORTH SAYING OUT LOUD
        RATHER THAN DISCOVERING LATER. Clause 6 of the Data use notice
        (`AUTH.terms`) still reads "Profile holds every switch: pause Tal, ask
        for a level review, download everything we hold, delete a recording, or
        close your account" — of those five, only the last is on this page now.
        That clause is what these two blocks were built from three days ago.
        Two ways to settle it if it matters: edit the clause to promise what
        Profile actually holds, or put the three data ROWS back without the
        switches. Not done either way, because the instruction was to remove
        them. `PAGESUM.account` is the other reader of the same promise — Tal's
        summary on this page still says "what I'm allowed to remember, and what
        I can do without asking", and the block it points at is gone.

        THE SWITCH COMPONENT SURVIVES with Notifications as its writer, so
        `.pf-tgs`, `.tg`, `.tg-mk` and §105.4's rules all keep a caller. */}
  <div class="sec">
    <div class="sec-h"><h2>Closing your account</h2></div>
     C4 
    <div class="close-b">
      <p class="t-body-01 close-x">Deleting your account removes your profile, your notes and your interview recordings. Certificates you have already earned stay valid and stay downloadable.</p>
      <div class="close-a">
        <button class="btn btn-t danger" data-del="1">Delete my account ${I.misuse}</button>
      </div>
    </div>
  </div>
  ${''/* LEGAL & DATA USE, IN THE PRIVACY SETTINGS TAB (22.7, Maryam, 15 Sep
        2026: "for signed in users we just have to show it in the privacy
        settings tab"). Same `legalDoc()` the pre-auth screen draws, so the
        notices cannot diverge. The profile page opts the whole page out of
        §10.15's label column (§111.11), so this `.sec-h` sits above its content
        like the two sections over it rather than in a 184px gutter. */}
  <div class="sec sec-legal">
    <div class="sec-h"><h2>Legal &amp; data use</h2></div>
    ${legalDoc()}
  </div>`;

const pfNotif = () => `
  <div class="sec">
    <div class="sec-h"><h2>Email notifications</h2></div>
    ${''/* EACH TOGGLE STATES ITS OWN TIMING (22.4). These govern EMAIL; the bell
          is not a setting and always arrives. */}
    <div class="pf-tgs">
      <label class="tg"><span class="tg-mk" style="--mk:var(--mk-1)">${I.calendar}</span><div class="tb"><b>Weekly call reminders</b><span>24 hours and 1 hour before a cohort call</span></div><input type="checkbox" checked><span class="sw"></span></label>
      <label class="tg"><span class="tg-mk" style="--mk:var(--support-attention)">${I.hourglass}</span><div class="tb"><b>Task deadlines</b><span>The morning a task is due</span></div><input type="checkbox" checked><span class="sw"></span></label>
      <label class="tg"><span class="tg-mk" style="--mk:var(--mk-3)">${I.email}</span><div class="tb"><b>Product and course emails</b><span>Occasional, never more than monthly</span></div><input type="checkbox"><span class="sw"></span></label>
    </div>
  </div>
  ${''/* ALWAYS ON — the service messages a candidate cannot switch off (22.4).
        They tell you your money moved, your level changed or your booking
        changed, so they are not marketing and carry no toggle. Drawn as plain
        rows (no `.sw`), the same `.pf-sr` bare-glyph row the security tab uses;
        §29/§70 ink the marks. In the bell these always arrive whatever the
        toggles above say. */}
  <div class="sec">
    <div class="sec-h"><h2>Always on</h2></div>
    <p class="t-desc" style="margin-bottom:var(--s04)">These tell you your money moved, your level changed or your booking changed. They cannot be switched off, and they always arrive in your notifications.</p>
    <div class="tile-stack">
      <div class="cardrow pf-sr"><span class="pf-sr-ic">${I.wallet}</span><span class="cardrow-b"><span class="cardrow-t">Payments</span><span class="cardrow-d">A payment taken, failed or refunded</span></span></div>
      <div class="cardrow pf-sr"><span class="pf-sr-ic">${I.document}</span><span class="cardrow-b"><span class="cardrow-t">Your level</span><span class="cardrow-d">Your report is ready, or your level is set or changed</span></span></div>
      <div class="cardrow pf-sr"><span class="pf-sr-ic">${I.calendar}</span><span class="cardrow-b"><span class="cardrow-t">Your booking</span><span class="cardrow-d">An interview confirmed, moved or cancelled</span></span></div>
      <div class="cardrow pf-sr"><span class="pf-sr-ic">${I.group}</span><span class="cardrow-b"><span class="cardrow-t">Your cohort</span><span class="cardrow-d">Your cohort is cancelled, or your place in it changes</span></span></div>
    </div>
  </div>`;

const SOCIAL = [
  {k:'linkedin',  n:'LinkedIn',  color:'#0A66C2', handle:'@maryamsss',
   svg:'<svg viewBox="0 0 24 24" fill="currentColor"><g transform="translate(2 2) scale(0.83333)"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></g></svg>'},
  {k:'instagram', n:'Instagram', color:'#E4405F', handle:'@maryam.designs',
   svg:'<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor"/><circle cx="12" cy="12" r="4" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.3" fill="#fff"/></svg>'},
  {k:'facebook',  n:'Facebook',  color:'#1877F2', handle:'Maryam Naz',
   svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'},
  {k:'twitter',   n:'X',         color:'#000000', handle:'@maryamsss',
   svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z"/></svg>'},
  {k:'youtube',   n:'YouTube',   color:'#FF0000', handle:'@maryamnaz',
   svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'},
  {k:'tiktok',    n:'TikTok',    color:'#010101', handle:'@maryam.designs',
   svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'}
];
S.linked = S.linked || {linkedin:true, instagram:true, twitter:true};

const SHARE_NETS = ['linkedin', 'instagram', 'twitter'];
S.shareOpen = S.shareOpen || null;
function shareControl(id){
  const open = S.shareOpen === id;
  return `<span class="scv-share${open ? ' on' : ''}">
    <button class="scv-share-t" data-shareopen="${id}" aria-haspopup="true" aria-expanded="${open}" aria-label="Share this scene">${I.share}</button>
    ${open ? `<div class="scv-share-menu" role="menu">
      ${SHARE_NETS.map(k => {
        const s = SOCIAL.find(x => x.k === k);
        return `<button class="scv-share-i" data-shareto="${s.k}" role="menuitem" style="--brand:${s.color}"><span class="scv-share-ic">${s.svg}</span><span class="t-body">Share on ${s.n}</span></button>`;
      }).join('')}
    </div>` : ''}
  </span>`;
}

function pfLinkedView(){
  return `<div class="sec sec-linked" data-pfsec="linked">
    <div class="sec-h"><h2>Linked accounts</h2><span class="t-desc">Link a social network to show it on your TALENTnext profile. Tap a card to connect or disconnect.</span></div>
    <div class="lacc-grid">
      ${SOCIAL.map(s => {
        const on = !!S.linked[s.k];
        return `<button class="lacc${on ? ' on' : ''}" data-link="${s.k}" aria-pressed="${on}" style="--brand:${s.color}">
          <span class="lacc-ic">${s.svg}</span>
          <span class="lacc-n t-h4">${s.n}</span>
          <span class="lacc-sub t-desc">${on ? (s.handle || 'Connected') : 'Not connected'}</span>
          ${''/* THE AVATAR DISC gives the card its height and echoes the
                reference: your profile photo when the account is connected, an
                empty placeholder disc when it is not. A person's photo is a
                disc (§106). */}
          <span class="lacc-av">${on
            ? avatar({i:'', img:AV.hana}, 36)
            : `<span class="lacc-av-empty">${I.user}</span>`}</span>
          <span class="lacc-cta t-label">${on
            ? `<span class="lacc-mk lacc-on">${I.checkFilled}</span>Linked`
            : `<span class="lacc-mk lacc-off">${I.add}</span>Link account`}</span>
        </button>`;
      }).join('')}
    </div>
  </div>`;
}

function pfScroll(k){
  if(!k) return;
  setTimeout(() => {
    const el = device.querySelector(`[data-pfsec="${k}"]`);
    const sc = device.querySelector('.view-col .main');
    if(!el || !sc) return;
    const prev = sc.style.scrollBehavior;
    sc.style.scrollBehavior = 'auto';
    el.scrollIntoView({block:'start'});
    sc.style.scrollBehavior = prev;
  }, 0);
}

const MY_COURSES = [
  {name:'Business Fundamentals', level:'E3', status:'Completed', done:13, avg:83, mins:700, tasksDone:12, tasksTotal:13, tasksSub:'one overdue'},
  {name:'Business Leadership', level:'E4', status:'In progress', done:6, avg:78, mins:330, tasksDone:5, tasksTotal:6, tasksSub:'on track'},
  {name:'Business Essentials', level:'E1', status:'Not started', done:0, avg:0, mins:0, tasksDone:0, tasksTotal:0, tasksSub:'not started'},
];
const crsInsight = (c) => {
  const pct = Math.round(c.done / 13 * 100);
  const h = Math.floor(c.mins / 60), m = c.mins % 60;
  return `<div class="stats">
    ${statCell(I.book, 'Chapters done', `${c.done} <small>of 13</small>`, `${pct}%`)}
    ${statCell(I.chart, 'Assessment average', c.avg ? `${c.avg}<small>%</small>` : '<small>Not yet</small>', c.avg ? 'cohort average 79%' : 'nothing assessed yet')}
    ${statCell(I.time, 'Time invested', c.mins ? `${h}h <small>${m}m</small>` : '<small>None yet</small>', c.done ? `${Math.round(c.mins / c.done)} min per chapter` : 'not started')}
    ${statCell(I.flag, 'Tasks on time', `${c.tasksDone} <small>of ${c.tasksTotal}</small>`, c.tasksSub)}
  </div>`;
};
function crsCertCard(c){
  return certHero({k:'explorer', lvl:c.level, n:c.name}, {title:'Course Completion Certificate'});
}
function pfCoursesView(){
  return `<div class="sec sec-crs" data-pfsec="courses">
    <div class="sec-h"><h2>My courses</h2></div>
    <div class="acc ol crs-acc">
      ${MY_COURSES.map(c => `<div class="acc-i">
        <button class="acc-h ol-row crs-row">
          ${''/* THE COURSE COVER ON THE LEFT (Maryam, 9 Sep 2026: "show course
                 image on the left of each course"). `courseArt` keyed by the
                 course's level — the same cover the all-courses list draws; an
                 inline size because it is a lone image, and `onerror` hides it
                 rather than 404-ing a broken frame (crow's rule). */}
          <img class="crs-thumb" src="${courseArt(c.level)}" alt="" loading="lazy"
            onerror="this.style.display='none'">
          <span class="ttl"><span class="ol-t">${c.name}</span><span class="ol-m t-desc">${c.status}</span></span>
          <span class="chev">${I.chevDown}</span></button>
        <div class="acc-b">${c.status === 'Completed' ? crsCertCard(c) : ''}${crsInsight(c)}</div>
      </div>`).join('')}
    </div>
  </div>`;
}

function pfPanel(f){
  if(S.pfTab === 'linked') return pfLinkedView();
  if(S.pfTab === 'courses') return pfCoursesView();
  if(S.pfTab === 'notif') return pfNotif();
  if(S.pfTab === 'priv')  return pfPrivacy();
  if(S.pfTab === 'lead')  return pfLead();
  return PF_SEC.map(s => {
    const body = S.pfEdit === s.k ? PF_FORM[s.k]() : pfSecView[s.k](f);
    return s.k === 'general' ? body + pfScenes() : body;
  }).join('');
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
  ${''/* THE STRIP OPENS THE PAGE BODY (Maryam, 3 Sep 2026: "it will have tabs
        after the tal section"), and it takes two jobs off the blocks that used
        to be here.

        THE IDENTITY BAND AND THE FOUR ACCOUNT FACTS MOVED INTO THE FIRST TAB
        rather than staying above the strip, and that is what "after the tal
        section" costs: nothing may stand between a page's head and its
        navigation. Neither is lost — `pfSecView.general` draws the same
        `.idhead` and the same `.facts` — and the reader's own face is in the
        app bar on every page of the product, which is where §78 put it.

        THE BLACK CARD KEEPS ITS ARGUMENT AND LOSES ONE OF ITS JOBS. Its note
        below still holds: an invitation goes above the record it is addressed
        to, and it still sits above the two ways to leave. What it stops being
        is `placeBand`'s run-stopper — the strip is the first `.sec` after the
        `.ph` now, and a plain `.sec` is not head furniture, so the run ends
        there and the band is one column exactly as before. Moving the card back
        up would put a block between the head and the tabs. */}
  ${pfTabs()}
  ${pfPanel(f)}
  ${''/* THE BLACK CARD STOOD HERE AND IS DELETED (Maryam, 4 Sep 2026: "remove
        become a leader black card from all tabs since we have a separate
        section for that now"). It was hidden on its own tab for half an hour
        first, on §112's duplicate test; the instruction takes the same argument
        one step further — a page does not need a short version of a block that
        is one tab away. `leadSec`'s own deletion note, above, keeps the four
        things about it that were about the machinery rather than the card. */}
  ${''/* ACHIEVEMENTS BESIDE RECENT ACTIVITY STOOD HERE — see the note over the
        deleted `pfPair`. What the page lost was a preview of two surfaces that
        exist in full elsewhere; what it gained is that every block left on
        Profile is something you can change from Profile. */}
  ${''/* NOTIFICATIONS AND CLOSING YOUR ACCOUNT STOOD HERE and are tabs 2 and 3
        now (Maryam, 3 Sep 2026 — the strip is My Profile / Notifications /
        Privacy Settings). Both moved VERBATIM, notes included: `pfNotif` and
        `pfPrivacy`, above. Nothing about either was redrawn, and the delete
        confirmation below is untouched — it is a page-level dialog gated on
        `S.delAsk`, so it does not care which tab opened it.

        AND THE INVITATION IS NOT UNDER THE STRIP AT ALL ANY MORE. `leadSec`'s
        argument for standing here on every tab — "an invitation goes above the
        record it is addressed to", and above the ways out — was written when
        the invitation was a card with nowhere to send you. It has a tab now.

        LOG OUT IS ON MY PROFILE ALONE NOW, WHICH TURNS OVER THE PARAGRAPH THAT
        STOOD HERE (Maryam, 4 Sep 2026: "remove logout from all settings tabs
        except My Profile"). That paragraph argued the opposite — "it belongs to
        no tab, and a Log out that appears on one tab of three is a way out you
        have to go looking for" — and the thing it did not account for is that
        the control is not the only way out and never was: §78's account menu
        and the RAIL'S FOOT both carry Log out on every page of the product,
        this one included. So it is not a way out that can be lost by putting it
        on one tab; it is a fourth copy, and on the three settings tabs it was
        landing under blocks about notifications, privacy and an application —
        a session control sitting at the foot of somebody else's subject. My
        Profile is the tab that IS the account. */}
   C5 
  ${S.pfTab === 'me' ? `<div class="sec sec-out">
    <button class="btn btn-g" data-go="stage:signup/login">Log out ${I.logout}</button>
  </div>` : ''}
</div></main>
${''/* THE CONFIRMATION IS A CENTRED DIALOG — §105.6, Maryam's anatomy diagram,
      2 Sep 2026: "on clicking to delete account, i want you to show such modal
      on the page, obviously in our design language."

      THE FIVE PARTS ARE THE DIAGRAM'S, IN ITS ORDER: the mark inside its signal
      rings, the title as a question, the description carrying the consequence,
      the friction field, then the safe exit and the destructive action side by
      side. Every one of them already existed here — what changes is that they
      are centred, the mark is drawn rather than boxed, and the header row is
      gone.

      THE `.sheet-h` AND ITS × ARE REMOVED, which the anatomy asks for and two
      other exits make safe: "Keep my account" is the labelled way out and the
      backdrop still carries `data-del="0"`. A × in the corner of a dialog whose
      whole point is a deliberate choice is a third way out, and the quietest of
      the three — §60's argument turned round.

      THE `.note err` BOX IS GONE AND ITS SENTENCE IS THE DESCRIPTION. A bordered
      red panel inside a dialog that is already about one destructive act is the
      "box in a box" §72 and §74 both take out; the consequence reads as prose,
      which is what the diagram calls Description. "This cannot be undone" is
      folded into it as the closing clause rather than a `<b>` heading over it.

      WHAT IT REFUSES FROM THE REFERENCE: the 16px radius and the drop shadow
      (§02's opening note — "depth is expressed as rhythm and rule weight,
      nothing else" — and `--radius` is 0 by token), the rose-red palette (ours
      is `--danger-ink`, which §29 already spends on this exact control), and
      the label-less friction field. That last one is the only deliberate
      departure from the anatomy: our forms label their fields (§02's `.f >
      label`), and a placeholder-only instruction disappears at exactly the
      moment the reader is typing the word it was telling them to type. */}
${''/* `.on` IS WHAT MAKES A MODAL VISIBLE, AND THIS ONE NEVER HAD IT. §02.398
      draws `.modal` at `opacity:0;visibility:hidden` and `.modal.on` is the
      only rule that turns it on — every other sheet in the build writes
      `class="modal ${state?'on':''}"` (the photo picker, the card form, Edit
      details, the leader's two). This one wrote `class="modal"` and gated the
      whole element on `S.delAsk` instead, so pressing "Delete my account" set
      the flag, rendered a complete dialog, and painted nothing.

      IT HAD NEVER WORKED — the same markup is in the last commit's source and
      in its built output, so the confirmation has been invisible for as long as
      it has existed. Conditional rendering and the `.on` class look like two
      ways to do one job and are not: the element has to be in the DOM for the
      transition to run against, which is why the pattern everywhere else is
      "always render, toggle the class".

      BOTH ARE KEPT rather than dropping the condition. `S.delAsk` decides
      whether the dialog exists at all, which keeps a `<input>` and two live
      buttons out of the page while it is shut; `.on` decides whether it is
      shown. Written together they cannot disagree. */}
${S.delAsk?`<div class="modal on" data-del="0">
  <div class="sheet sheet-c conf" role="dialog" aria-modal="true" aria-label="Delete your account">
    <div class="sheet-b conf-b">
      <span class="conf-mk">${I.warning}</span>
      <h2 class="conf-t">Delete your account?</h2>
      <p class="conf-x">Your profile, your notes and every interview recording are deleted. Your certificates stay valid and downloadable from the link in your email. This cannot be undone.</p>
      ${/* THE CONFIRM WORD IS SENTENCE CASE AND THE CHECK ALREADY ALLOWED IT.
            This was the one string in the build that was typed in capitals
            and rendered — §63 takes case off everything else, but no
            stylesheet can un-shout a word that was written shouting. It is
            safe to change because `ai3.js` tests
            `v.trim().toUpperCase() === 'DELETE'`, so the field has always
            accepted any casing; only the instruction was in capitals, and a
            capitalised instruction beside a lowercase-accepting field was
            telling the reader to do something the form did not require. */''}
      <div class="f conf-f"><label for="delc">Type Delete to confirm</label><input class="inp" id="delc" placeholder="Delete" autocomplete="off"></div>
    </div>
    <div class="sheet-f conf-a">
      <button class="btn btn-s noic" data-del="0">Keep my account</button>
      ${''/* "Delete Account", NOT "Delete everything" (Maryam, 2 Sep 2026) —
             the anatomy's own label for the destructive CTA. The old one named
             the CONSEQUENCE, which the description two rows above already
             states in full ("your profile, your notes and every interview
             recording"), and it did it in a word that does not appear anywhere
             else in the flow: the section is "Closing your account", the
             control that opens this is "Delete my account", the title asks
             "Delete your account?" and the safe exit is "Keep my account". One
             noun through the whole flow, and this button was the only place it
             changed. Title Case is the reference's and is deliberate here:
             §63 §2 takes CAPITALS off the product, which is a different thing
             from a two-word button label matching the diagram it is drawn
             from — and it is what pairs it with "Keep my account" at a glance
             without repeating that phrase's ending. */}
      <button class="btn btn-p noic danger" data-delgo="1">Delete Account</button>
    </div>
  </div>
</div>`:''}`;

V.terms = AUTH.terms;

const device = document.getElementById('device');

device.addEventListener('click', e => {
  const t = e.target.closest('[data-recswap]');
  if(!t || S.recBusy) return;
  S.recBusy = true;
  render();
  setTimeout(() => {
    S.recKey = REC_ORDER[(REC_ORDER.indexOf(recKey()) + 1) % REC_ORDER.length];
    S.recBusy = false;
    render();
  }, REC_MS);
});

const pick   = document.getElementById('pick');
const cap    = document.getElementById('cap');

pick.innerHTML = stagesShown().map(([k,l])=>`<button type="button" class="pt-stage-opt" data-stage="${k}">${l}</button>`).join('');

const DEFAULT_VIEW = {signup:'create', nil:'quiz', onboard:'ob'};
function setStage(k,keepView){
  k = stageResolve(k);
  S.portal = 'candidate';
  S.stage = k;
  const f = CFG[k];
  if(!keepView){
    S.view = DEFAULT_VIEW[k] || 'dashboard';
    S.ch = f.open;
  }
  const reachable = NAVSETS[f.nav].map(n=>n[0]).concat(['account','report','agents','agent','courses','booking','payment','chapter','terms','rewards','ivt','mem']);
  if(!DEFAULT_VIEW[k] && !reachable.includes(PARENT[S.view]||S.view)) S.view='dashboard';
  if(DEFAULT_VIEW[k]) S.view = DEFAULT_VIEW[k];
  S.scenes = { level: null, re: null };
  S.scPick = {level:[], re:[]};
  if(k === 'onboard'){
    S.obStep = 0; S.obSpoken = false;
    S.obMode = 'chat'; S.obChatOpen = false; S.obQi = 0;
    talReset();
  }
  S.hist = [];
  render();
}
function histWrite(fn, arg1, arg2, arg3){
  try { history[fn](arg1, arg2, arg3); } catch(e){ /* rate-limited: the URL
    stops tracking, the app keeps working */ }
}

function go(target, fresh){
  if(target.startsWith('stage:')){ const p = target.slice(6).split('/');
    setStage(p[0]); if(p[1]){ S.view = p[1]; S.nav = false; render(); } return; }
  if(target.startsWith('agent:')){ S.agent = target.slice(6); S.paySuccess=false; S.payWith=null; S.addCard=false; S.pmAdded=false;
    S.hist.push(S.view); histWrite('pushState',{v:'checkout'},''); S.view='checkout'; S.nav=false; render(); return; }
  if(target.startsWith('cal:')){ S.agent = target.slice(4); S.hist.push(S.view); histWrite('pushState',{v:'agent'},''); S.view='agent'; S.nav=false; render(); return; }
  if(target.startsWith('chapter:')){ S.ch = +target.slice(8); S.stg = 0; S.notes = false; S.ls = {screen:'menu', ch:1}; S.hist.push(S.view); histWrite('pushState',{v:'chapter'},''); S.view='chapter'; S.nav=false; render(); return; }
  if(target === 'coursework') S.ls = {screen:'menu', ch:1};
  if(S.view!==target) talReset();
  if(fresh) S.hist = [];
  else if(S.view!==target){ S.hist.push(S.view); histWrite('pushState',{v:target},''); }
  S.view = target;
  S.nav = false;
  render();
}

const TAL_BEAT = 1400;
let talTimer = null;
let talQueue = [];
const talAtLimit = () => S.talAsked >= TAL_LIMIT;
function ask(q){
  if(!q) return;
  if(talAtLimit()) return;
  S.talAsked++;
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
const STAGE_L = [
  ['Video','12 min · Sarah Kaplan','6:00 of 12:00 watched'],
  ['Reading','6 min · 3 pages','2 of 3 pages'],
  ['Workbook','10 min · 4 prompts','1 of 4 answered'],
  ['Assessment','8 questions · 70% to pass','0 of 8 answered'],
  ['Summary','3 min · what to try this week','']];

const LS_COURSE = 'TalentAgent Training', LS_CID = '242081';
const LS_CH = [
  ['Welcome and Orientation', '1198420', 'done'],
  ['Test Chapter',            '1203797', 'now' ],
  ['Working the Pipeline',    '1211044', 'todo'],
  ['Closing and Handover',    '1216508', 'todo']];
const LS_STATE = {done:['Complete',100], now:['Not started &middot; up next',0], todo:['Not started',0]};

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
<title>${LS_COURSE}</title><link rel="stylesheet" href="css/portal-2.css"></head>
<body>${(LS_SCREEN[S.ls.screen] || LS_SCREEN.menu)(S.ls.ch)}</body></html>`;

S.ls = {screen:'menu', ch:1};

function mountLsvt(){
  device.querySelectorAll('iframe.lsvt-if').forEach(fr => {
    const d = fr.contentDocument;
    if(!d) return;
    d.open(); d.write(LSVT_PAGE()); d.close();
    d.addEventListener('click', e => {
      const b = e.target.closest('[data-ls]');
      if(b) lsGo(b.dataset.ls, b.dataset.ch);
    });
  });
}

function lsGo(what, ch){
  if(what === 'open') S.ls = {screen:'chapter', ch:+ch};
  else if(what === 'done') S.ls = {screen:'done', ch:S.ls.ch};
  else if(what === 'next') S.ls = {screen:'chapter', ch:Math.min(S.ls.ch+1, LS_CH.length-1)};
  else S.ls = {screen:'menu', ch:S.ls.ch};
  mountLsvt();
}

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

function ivRow(kind, label, date, outcome, len){
  const a = AGENTS.priya;
  return `<div class="ivrow" role="button" tabindex="0" data-go="report" data-iv="${kind}">
    <div class="ivrow-who">
      ${avatar(a)}
      <span class="ivrow-wb">
        <b>${a.n}</b>
        <span class="ivrow-out">${outcome}</span>
        <span class="ivrow-eb">${date}</span>
      </span>
      <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
    </div>
  </div>`;
}

const COHORT = [
  ['Maryam Naz','MN','hana','Chapter 13 &middot; active today',true],
  ['Aisha Bello','AB','priya','Active today'],
  ['Daniel Kerr','DK','owen','Active today'],
  ['Sofia Marchetti','SM','lena','Active 2 days ago'],
  ['Ravi Chandran','RC','samuel','Active today'],
  ['Nora Lindqvist','NL','lena','Active 3 days ago'],
  ['James Whitby','JW','owen','Active today'],
  ['Chloe Ferreira','CF','priya','Active 5 days ago'],
  ['Tobias Mensah','TM','samuel','Active 2 days ago'],
  ['Yuki Tanaka','YT','hana','Not active recently']];

const ROOM = [
  ['day','Yesterday'],
  ['Daniel Kerr','owen','DK','Did anyone else find chapter 4 harder than the three before it? I have read the handover section twice.','4:12 PM',false,4],
  ['Aisha Bello','priya','AB','Yes. It is the first one that asks you to change something at work rather than understand something.','4:31 PM',false,6],
  ['Maryam Naz','hana','MN','I took a piece of work back off someone this week and could not explain why. That is the whole chapter, I think.','7:02 PM',true,3],
  ['day','Today'],
  ['Ravi Chandran','samuel','RC','Priya said on the call that the handover is where it fails, not the work. That helped me.','8:40 AM',false,2],
  ['Sofia Marchetti','lena','SM','Bringing my example on Thursday. Mine is a vendor review that went badly and I still think I was right to take it back.','9:15 AM']];

function roomLine(name, img, ini, body, when, mine, likes, idx){
  const votable = idx !== undefined;
  const vote = votable ? S.roomVote[idx] : null;
  const base = (likes || 0) - (ROOM_SEED[idx] ? 1 : 0);
  const n = base + (vote === 'up' ? 1 : 0);
  return `<div class="cmt"${votable ? ` data-cmt="${idx}" data-cmtbase="${base}"` : ''}>
    <span class="cmt-av">${avatar({i:ini, img:AV[img]}, 40)}</span>
    <div class="cmt-c">
      <div class="cmt-h"><b class="cmt-n">${mine ? 'You' : name}</b><span class="cmt-w">${when}</span></div>
      <div class="cmt-b">${body}</div>
      <div class="cmt-a">
        <button class="cmt-act${vote === 'up' ? ' on' : ''}"${votable ? ' data-cmtvote="up"' : ''} aria-label="Like" aria-pressed="${vote === 'up'}"><span class="cmt-ic">${vote === 'up' ? I.thumbsUpFilled : I.thumbsUp}</span><span class="cmt-ct">${n || ''}</span></button>
        <button class="cmt-act${vote === 'down' ? ' on' : ''}"${votable ? ' data-cmtvote="down"' : ''} aria-label="Dislike" aria-pressed="${vote === 'down'}"><span class="cmt-ic">${vote === 'down' ? I.thumbsDownFilled : I.thumbsDown}</span></button>
        <button class="cmt-act cmt-reply"${votable ? ` data-cmtreply="${name}"` : ''}>Reply</button>
      </div>
    </div>
  </div>`;
}

const ROOM_SEED = {};
ROOM.forEach((r, i) => { if(r[0] !== 'day' && r[6]) ROOM_SEED[i] = true; });
S.roomVote = {};
Object.keys(ROOM_SEED).forEach(i => { S.roomVote[i] = 'up'; });

function discussionRoom(){
  let day = '';
  return `<div class="cmts">
    ${ROOM.map((r, i) => {
      if(r[0] === 'day'){ day = r[1]; return ''; }
      return roomLine(r[0], r[1], r[2], r[3], day ? day + ' &middot; ' + r[4] : r[4], r[5], r[6], i);
    }).join('')}
  </div>
  ${''/* THE FIELD HAS AN ID BECAUSE REPLY WRITES INTO IT. `data-cmtreply` puts
         "@Name " at the head of whatever is already typed and focuses the
         field; it needs one handle, and the composer is the only input on the
         page. */}
  <div class="composer room-composer">
    <button class="composer-act composer-lead" aria-label="Attach a file">${I.attachment}</button>
    <input class="inp" id="roomPost" placeholder="Say something to Cohort 41" aria-label="Message the cohort">
    <button class="composer-send" aria-label="Send">${I.send}</button>
  </div>`;
}

function roomVotePaint(row){
  const i = row.dataset.cmt, vote = S.roomVote[i];
  const base = +row.dataset.cmtbase || 0;
  const up = row.querySelector('[data-cmtvote="up"]');
  const down = row.querySelector('[data-cmtvote="down"]');
  if(!up || !down) return;
  up.classList.toggle('on', vote === 'up');
  down.classList.toggle('on', vote === 'down');
  up.setAttribute('aria-pressed', vote === 'up');
  down.setAttribute('aria-pressed', vote === 'down');
  up.querySelector('.cmt-ic').innerHTML = vote === 'up' ? I.thumbsUpFilled : I.thumbsUp;
  down.querySelector('.cmt-ic').innerHTML = vote === 'down' ? I.thumbsDownFilled : I.thumbsDown;
  const n = base + (vote === 'up' ? 1 : 0);
  up.querySelector('.cmt-ct').textContent = n || '';
}

device.addEventListener('click', e => {
  const v = e.target.closest('[data-cmtvote]');
  if(v){
    const row = v.closest('.cmt');
    if(!row) return;
    const kind = v.dataset.cmtvote, i = row.dataset.cmt;
    S.roomVote[i] = S.roomVote[i] === kind ? null : kind;
    roomVotePaint(row);
    return;
  }
  const rp = e.target.closest('[data-cmtreply]');
  if(rp){
    const box = device.querySelector('#roomPost');
    if(!box) return;
    const at = '@' + rp.dataset.cmtreply + ' ';
    if(box.value.indexOf(at) !== 0) box.value = at + box.value;
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
    return;
  }
});

const RANK = [
  ['@cobaltotter','b1', 3420, 2, 1],
  ['@mossfinch','g2',   2980, 2, 1],
  ['@slatefox','b2',    2610, 1, 1],
  ['@dewlark','g3',     2240, 1, 0],
  ['You','av1',         1095, 1, 0, true],
  ['@emberkoi','g1',    1040, 1, 0],
  ['@pinewren','b3',     920, 1, 0],
  ['@fernquill','g4',    780, 1, 0],
  ['@tidalram','b4',     610, 1, 0],
  ['@plumjay','g5',      240, 1, 0]];

function boardList(){
  return `<div class="board">
    <div class="brow bhead">
      <span>#</span><span>Candidate</span><span>Earned</span><span class="num">Points</span>
    </div>
    ${RANK.map(([nick,av,pts,rank,bdg,mine],k)=>`<div class="brow${mine?' mine':''}">
      <span class="b-n">${k+1}</span>
      <span class="b-who">${avatar({i:'', img:AVATARS[av]}, 32)}<span class="b-nm">${nick}</span></span>
      <span class="b-earn">
        <span class="b-mk" title="${rank}-Star"><img src="${AWARD['rank'+rank]}" alt="${rank}-Star"></span>
        ${bdg?`<span class="b-mk" title="Bronze"><img src="${AWARD.bronze}" alt="Bronze"></span>`:''}
        <span class="b-earn-t">${rank}-Star${bdg?' &middot; '+bdg+' badge':''}</span>
      </span>
      <span class="b-pts num">${pts.toLocaleString()}</span>
    </div>`).join('')}
  </div>`;
}

const SIG_CARD = (mk, ic, title, tag, body) => `<div class="sig-c" style="--mk:var(--mk-${mk})">
        <i class="sig-ic">${ic}</i>
        <div class="sig-b">
          <div class="sig-top"><span class="sig-t">${title}</span>${
            tag ? `<span class="sig-tag">${tag}</span>` : ''}</div>
          <p class="sig-p">${body}</p>
        </div>
      </div>`;

function signedSummary(withNote, re, footAction){
  return `<div class="signed">
      ${''/* THE HEADER IS TWO FACTS WITH A RULE BETWEEN THEM — who signed it and
             which interview it was. They were one stacked pair under a 36px
             face, which made the date look like a subtitle on Priya's name; they
             are two separate facts and the reference splits them. */}
      <div class="signed-h">
        <span class="av-ph" style="width:44px;height:44px;font-size:13px"><i>PN</i><img src="${AV.priya}" alt=""></span>
        <span class="signed-b"><span class="sig-hl">Interviewed by</span><b>Priya Nair</b></span>
        <span class="signed-when">
          <i class="sig-ic sig-ic-sm" style="--mk:var(--mk-3)">${I.calendar}</i>
          <span class="signed-b"><span class="sig-hl">${re?'Re-interview':'Level interview'}</span><b>${re?'21 November 2026':'20 August 2026'}</b></span>
        </span>
      </div>
      <div class="sig-pair">
        ${SIG_CARD(2, I.star, 'Strengths', 'Strong', re
          ?'You argue your own decisions from evidence now, and you no longer play them down as you give them. Three examples out of the 90 days, each with a name and a date on it.'
          :'You reason from consequence to people, not policy. Three examples, each with a date and a name attached.')}
        ${SIG_CARD(3, I.growth, 'Growth areas', 'Focus', re
          ?'Delegation still, and coaching rather than fixing. Chapters 3 and 9 on the E4 course are built on exactly this.'
          :'Delegation, and coaching rather than fixing. Chapters 4 and 12 are built on exactly this.')}
      </div>
      ${withNote ? SIG_CARD(1, I.chat, 'Priya&rsquo;s note', '', re
        ?'&ldquo;She came back with the reorganization finished and could tell me which parts of it she would do differently. That is an E4.&rdquo;'
        :'&ldquo;She talks cautiously, but she has already run a reorganization and can explain every call she made in it. That is an E3, not an E2.&rdquo;') : ''}
      ${''/* THE FOOT ACTION IS TEXT AND AN ARROW (Maryam, 31 Aug 2026). It was
            `.btn-p` — the black slab — closing a block of three tinted cards on
            a white panel, which made the loudest object on the page the way OUT
            of the one thing on it a candidate reads. `.btn-t` is §64's quiet
            variant: the border is already transparent there and the arrow is
            already written, so what is left is the words and the mark. The one
            primary action on this page belongs to the enrolment offer above. */}
      ${''/* `data-iv` IS DERIVED FROM `re`, SO THE BUTTON CANNOT OPEN A REPORT
             THE CARDS ABOVE IT ARE NOT ABOUT (1 Sep 2026). It shipped as a bare
             `data-go="report"`, which was harmless while `V.level` was the only
             caller and always passed `re:false` — but `V.report` READS `S.iv`
             (its eyebrow is "Re-interview · confirmed November 22" or "Level
             interview · confirmed August 21"), and `S.iv` is only ever written
             by the `[data-iv]` capture listener. So the destination was
             whichever interview the reader had last touched, or the default if
             they had touched none.

             That became live the moment this block moved next to `ivRow`, where
             both rows write `S.iv` on the way past. `re` is already the flag
             that picks which interview's two paragraphs are printed, so reading
             the attribute off it means the summary and the report it opens are
             one decision rather than two that have to be kept in step. */}
      ${footAction?`<div class="ai-foot signed-foot"><button class="btn btn-t btn-sm noic" data-go="report" data-iv="${re?'re':'level'}">Read the full report ${I.arrowRight}</button></div>`:''}
    </div>`;
}

function statCell(ic, label, value, note, jump, at){
  const body = `${ic ? `<span class="stat-ic">${ic}</span>` : ''}
      <div class="stat-top"><div class="l">${label}</div><div class="n">${value}</div></div>
      <div class="d">${note}</div>`;
  if(at)   return `<button class="stat stat-jump" ${at}>${body}</button>`;
  if(jump) return `<button class="stat stat-jump" data-jump="${jump}">${body}</button>`;
  return `<div class="stat">${body}</div>`;
}

function standRow(g){
  const nb = nextBadge(g.pts);
  const bdgArt = ['bronze','silver','gold','involved'][Math.max(0, Math.min(3, g.badges-1))];
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
  if(S.call && typeof callScreen === 'function'){
    html = callScreen();
  } else
  if(S.stage==='nil'){
    html = NIL ? '<div class="nil">' + (NIL[S.view] || NIL.quiz)() + '</div>' : '';
  } else if(S.stage==='signup'){
    const inner = (AUTH[S.view]||AUTH.create)();
    html = S.view === 'terms' ? inner
         : '<div class="auth-card">' + AUTH_ART
           + '<div class="auth-col">' + inner + '</div></div>';
  } else
  if(S.stage==='onboard' && S.obReady){
    html = obScreen();
  } else {
    const view = V[S.view] || (isLead() && V.leadDash) || V.dashboard;
    const NO_FAB = ['terms','coursework','chapter'];
    const fabOff = NO_FAB.includes(S.view) && !(S.view==='coursework' && f && f.preStart);
    html = shell() + '<div class="shell-body">' + sidenav(f) + '<div class="view-col">' + view(f) + '</div>' + peekPanel(f) + '</div>' + (fabOff?'':talFab())
         + talPanel(f) + notifPanel() + (['billing','payment','checkout'].includes(S.view)?cardSheet():'')
         + (S.view==='account'?photoSheet():'')
         + (S.view==='transcript'?scoresSheet(f):'')
         + (S.enrolOk && S.stage==='enrolPre' ? enrolSheet() : '')
         + (S.view==='billing' && S.receipt!=null ? receiptModal() : '')
         + (S.view==='interviews' && S.ivCancel ? ivCancelModal() : '')
         + (S.ivBooked && (S.stage==='booked' || S.stage===RESCHED) ? ivBookedModal() : '')
         + (S.view==='dashboard' && S.stage==='assessed' && !S.levelSeen ? levelModal() : '')
         + (S.view==='dashboard' && S.stage==='week1' && !S.beganSeen ? beganModal() : '')
         + (S.view==='checkout' && S.paySuccess ? paySuccessModal() : '')
         + (S.view==='report' && S.scenesUpsell ? scenesUpsellModal(S.scenesUpsell) : '')
         + (S.quizModal ? quizModal() : '');
  }
  const key = S.stage + '/' + S.view + (S.call ? '/call' : '');
  const entered = key !== MO.key;
  const OVERLAYS = ['nav','notif','acct','peek','tal','editPhoto','addCard','notes','enrolOk'];
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
  [...pick.children].forEach(b => b.classList.toggle('on', b.dataset.stage === S.stage));
  const st = STAGES.find(s=>s[0]===S.stage);
  histWrite('replaceState',null,'',
    isLead() ? '#leader/'+S.view+'/'+S.stage : '#'+S.stage+'/'+S.view);
  for(const pass of [talFirst, enhanceTalCards, mountLsvt]){
    try { pass(); } catch(e) { console.warn('pass failed:', e); }
  }
  const app = device.querySelector('.app');
  if(app && app.hasAttribute('data-enter')){
    const kids = device.querySelectorAll('.page > .sec, .page > .ph, .page > .lvl-hero, .page > .acc, .page > .tabs');
    kids.forEach((el,i) => el.style.setProperty('--i', Math.min(i,7)));
  }
  const tb = device.querySelector('#talBody'); if(tb) tb.scrollTop = tb.scrollHeight;
  syncStagePick();
}

const ptMenu   = document.getElementById('ptMenu');
const ptToggle = document.getElementById('ptToggle');
function ptClose(){ if(ptMenu){ ptMenu.classList.remove('open'); if(ptToggle) ptToggle.setAttribute('aria-expanded','false'); } }
function syncStagePick(){
  if(!pick) return;
  pick.querySelectorAll('.pt-stage-opt').forEach(o => o.classList.toggle('on', o.dataset.stage === S.stage));
}
if(ptToggle && ptMenu){
  ptToggle.addEventListener('click', e => {
    e.stopPropagation();
    const open = ptMenu.classList.toggle('open');
    ptToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', e => { if(ptMenu.classList.contains('open') && !ptMenu.contains(e.target)) ptClose(); });
}
syncStagePick();

pick.onclick = e => { const b = e.target.closest('[data-stage]'); if(b){ setStage(b.dataset.stage); ptClose(); } };
window.addEventListener('popstate', () => { if(S.hist.length) back(); });

device.addEventListener('input', e => {
  if(e.target.dataset && e.target.dataset.ivtopic !== undefined){ S.ivTopic = e.target.value; return; }
  if(e.target.dataset && e.target.dataset.ivcancelnote !== undefined){ S.ivCancelNote = e.target.value; return; }
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


device.addEventListener('click', e => {
  const t = e.target;

  if(S.acct && !t.closest('.acct-t, .acct-menu')){ S.acct = false; render(); }
  if(S.crtMenu !== null && !t.closest('.crt-menu, .crt-pop')){ S.crtMenu = null; render(); }
  if(S.certShare && !t.closest('.crt-share-wrap')){ S.certShare = false; render(); }
  if(S.shareOpen && !t.closest('.scv-share')){ S.shareOpen = null; render(); }
  if(S.dd && !t.closest('.dd')){ S.dd = null; render(); }

  const ddt = t.closest('[data-ddtoggle]');
  if(ddt){
    const key = ddt.dataset.ddtoggle;
    S.dd = S.dd === key ? null : key;
    e.preventDefault(); render(); return;
  }
  const dds = t.closest('[data-ddset]');
  if(dds){
    const raw = dds.dataset.ddset, i = raw.indexOf(':');
    S.ddVal[raw.slice(0, i)] = raw.slice(i + 1);
    S.dd = null;
    e.preventDefault(); render(); return;
  }

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

  const cb = t.closest('[data-certban]');
  if(cb){ S.certBan[cb.dataset.certban] = true; render(); return; }

  const nmo = t.closest('[data-nilmodal]');
  if(nmo){ S.nilModal = true; render(); return; }
  const nmc = t.closest('[data-nilclose]');
  if(nmc){
    if(!(nmc.classList.contains('nil-modal-scrim') && t.closest('.nil-modal'))){ S.nilModal = false; render(); }
    return;
  }


  if(t.closest('[data-paid]')){ S.enrolOk = true; setStage('enrolPre'); return; }

  if(t.closest('[data-book]')){ S.paySuccess = false; S.ivBooked = true; setStage('booked'); return; }

  if(t.closest('[data-payok]')){ S.paySuccess = true; render(); return; }
  const pgo = t.closest('[data-paygo]');
  if(pgo){ S.paySuccess = false; go('cal:' + pgo.dataset.paygo); return; }
  if(t.closest('[data-close="paysuccess"]') && !t.closest('.sheet')){ S.paySuccess = false; render(); return; }
  const ivbk = t.closest('[data-ivbooked]');
  if(ivbk){ S.ivBooked = ivbk.dataset.ivbooked === '1'; render(); return; }
  if(t.closest('[data-close="ivbooked"]') && !t.closest('.sheet')){ S.ivBooked=false; render(); return; }

  const lvg = t.closest('[data-levelgo]');
  if(lvg){ S.levelSeen = true; go(lvg.dataset.levelgo); return; }
  if(t.closest('[data-levelclose]')){ S.levelSeen=true; render(); return; }
  if(t.closest('[data-close="level"]') && !t.closest('.sheet')){ S.levelSeen=true; render(); return; }

  if(t.closest('[data-beganclose]')){ S.beganSeen=true; render(); return; }
  if(t.closest('[data-close="began"]') && !t.closest('.sheet')){ S.beganSeen=true; render(); return; }

  const eo = t.closest('[data-enrolok]');
  if(eo){ S.enrolOk = eo.dataset.enrolok === '1'; render(); return; }
  if(t.closest('[data-close="enrolok"]') && !t.closest('.sheet')){ S.enrolOk=false; render(); return; }

  const scr = t.closest('[data-scores]');
  if(scr){ S.scores = scr.dataset.scores === '1'; render(); return; }
  if(t.closest('[data-close="scores"]') && !t.closest('.sheet')){ S.scores=false; render(); return; }

  const lgt = t.closest('[data-legaltab]');
  if(lgt){ S.legalTab = lgt.dataset.legaltab; render(); return; }

  const rcp = t.closest('[data-receipt]');
  if(rcp){ S.receipt = +rcp.dataset.receipt; render(); return; }
  const rcx = t.closest('[data-receiptclose]');
  if(rcx){ if(rcx.classList.contains('modal') && e.target !== rcx) return; S.receipt = null; render(); return; }

  if(t.closest('[data-ivcancel]')){ S.ivCancel = true; render(); return; }
  if(t.closest('[data-ivcanceldo]')){
    S.ivCancel = false; S.dd = null; S.ivTopic = ''; S.ivCancelNote = ''; delete S.ddVal.ivcancel;
    setStage('new'); return;
  }
  const ivx = t.closest('[data-ivcancelclose]');
  if(ivx){ if(ivx.classList.contains('modal') && e.target !== ivx) return; S.ivCancel = false; S.dd = null; render(); return; }

  const eph = t.closest('[data-editphoto]');
  if(eph){ S.editPhoto = eph.dataset.editphoto==='1';
    if(S.editPhoto){ S.photoTab='photo'; S.photoPreview=null; }
    render(); return; }

  const ptab = t.closest('[data-phototab]');
  if(ptab){ S.photoTab = ptab.dataset.phototab; render(); return; }
  const avp = t.closest('[data-avpick]');
  if(avp){ S.avatarPick = avp.dataset.avpick; render(); return; }
  if(t.closest('[data-photoremove]')){ S.photoPreview = 'removed'; render(); return; }

  const ac = t.closest('[data-addcard]');
  if(ac){ S.addCard = ac.dataset.addcard==='1'; if(S.addCard) S.payTab='card'; render(); return; }
  const pt = t.closest('[data-paytab]');
  if(pt){ S.payTab = pt.dataset.paytab; render(); return; }
  const px = t.closest('[data-payclose]');
  if(px){ if(px.classList.contains('modal') && e.target !== px) return; S.addCard=false; if(S.view==='checkout') S.pmAdded=true; render(); return; }
  const pp = t.closest('[data-paypick]');
  if(pp){ S.payWith = +pp.dataset.paypick; render(); return; }
  const sd = t.closest('[data-setdef]');
  if(sd){ S.cards.forEach((c,i)=>c.def = i===+sd.dataset.setdef); render(); return; }
  const dc = t.closest('[data-delcard]');
  if(dc){ const i=+dc.dataset.delcard; const wasDef=S.cards[i].def;
    S.cards.splice(i,1); if(wasDef && S.cards[0]) S.cards[0].def=true; render(); return; }

  const ra = t.closest('[data-readall]');
  if(ra){ notifList().forEach(n=>{ if(!S.read.includes(n.t)) S.read.push(n.t); }); render(); return; }

  const nd = t.closest('[data-dismiss]');
  if(nd){ const ti = nd.dataset.dismiss; if(!S.dismissed.includes(ti)) S.dismissed.push(ti); render(); return; }
  const dra = t.closest('[data-dismissread]');
  if(dra){ notifReadInfo().forEach(n=>{ if(!S.dismissed.includes(n.t)) S.dismissed.push(n.t); }); render(); return; }

  const doc = t.closest('[data-doc]');
  if(doc){ location.href = doc.dataset.doc; return; }

  const pw = t.closest('[data-swap]');
  if(pw){
    const k = pw.dataset.swap;
    if(k !== S.portal){
      S.portal = k;
      S.view = k==='leader' ? 'leadDash' : 'dashboard';
      S.hist = []; S.nav = false; S.notif = false; S.tal = false;
      talReset();
    }
    S.acct = false;
    render();
    return;
  }

  const qmc = t.closest('[data-quizmodal]');
  if(qmc){ S.quizModal = true; S.notif = false; S.acct = false; S.peek = null; render(); return; }
  const qmx = t.closest('[data-quizclose]');
  if(qmx){ if(qmx.classList.contains('modal') && e.target !== qmx) return; S.quizModal = false; render(); return; }

  const pkc = t.closest('[data-peek]');
  if(pkc){
    const k = pkc.dataset.peek;
    S.peek = (!k || S.peek === k) ? null : k;
    if(S.peek){ S.notif = false; S.acct = false; }
    render();
    return;
  }

  const li = t.closest('[data-loginas]');
  if(li){ e.preventDefault();
    if(li.dataset.loginas === 'agent'){ location.href = AGENT_PORTAL; return; }
    setStage('new');
    if(li.dataset.loginas === 'leader'){ S.portal = 'leader'; S.view = 'leadDash'; }
    S.hist = []; S.nav = false;
    render(); return;
  }

  const lr = t.closest('[data-lrole]');
  if(lr){ S.role = lr.dataset.lrole; render(); return; }

  const sendBtn = t.closest('[data-send]');
  if(sendBtn){ e.preventDefault();
    if(sendBtn.dataset.sending) return;
    sendBtn.dataset.sending = '1'; sendBtn.style.pointerEvents = 'none'; sendBtn.textContent = 'Sending...';
    const to = sendBtn.dataset.send;
    setTimeout(() => go(to), 900);
    return; }

  const ld = t.closest('[data-loadgo]');
  if(ld){ e.preventDefault();
    if(S.obLoading) return;
    S.obLoading = true;
    setStage('onboard');
    setTimeout(() => { S.obLoading = false; render(); }, 2000);
    return; }

  const g = t.closest('[data-go]');
  if(g){ e.preventDefault();
    const mark = g.dataset.read; if(mark && !S.read.includes(mark)) S.read.push(mark);
    const dk = g.dataset.disc; if(dk) S.disc[dk] = true;
    const tb = g.dataset.gotab; if(tb) S.rtab = tb;
    const pe = g.dataset.pfedit;
    if(pe !== undefined){ S.pfEdit = pe || null; if(pe){ S.pfTab = 'me'; pfScroll(pe); } }
    if(g.dataset.pftab) S.pfTab = g.dataset.pftab;
    if(S.notif) S.notif=false;
    if(S.acct) S.acct=false;
    const fresh = !!(g.closest('.sn-item') || g.classList.contains('shell-logo'));
    go(g.dataset.go, fresh); return; }

  const pfe = t.closest('[data-pfedit]');
  if(pfe){ const k = pfe.dataset.pfedit;
    S.pfEdit = k || null; S.dd = null; if(k) S.pfTab = 'me'; render(); pfScroll(k); return; }

  const pfp = t.closest('[data-pfpw]');
  if(pfp){ S.pfPw = pfp.dataset.pfpw === '1'; render(); return; }

  const scv = t.closest('[data-scv]');
  if(scv){ scvScroll(scv); return; }

  const pft = t.closest('[data-pftab]');
  if(pft){ S.pfTab = pft.dataset.pftab; S.pfEdit = null; render(); return; }

  const lnk = t.closest('[data-link]');
  if(lnk){ S.linked[lnk.dataset.link] = !S.linked[lnk.dataset.link]; render(); return; }

  const tog = t.closest('[data-toggle]');
  if(tog){
    const w = tog.dataset.toggle;
    if(w==='nav'){ S.nav=!S.nav; render(); }
    if(w==='tal'){ S.tal=!S.tal; if(!S.tal) talReset(); render(); }
    if(w==='notif'){ S.notif=!S.notif; if(S.notif) S.acct=false; render(); }
    if(w==='acct'){ S.acct=!S.acct; if(S.acct) S.notif=false; render(); }
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

  const fd = t.closest('[data-found]');
  if(fd){
    const k = fd.dataset.found || 'report';
    S.disc[k] = !S.disc[k];
    const sec = fd.closest('.found');
    if(sec) sec.classList.toggle('on', S.disc[k]);
    fd.setAttribute('aria-expanded', S.disc[k] ? 'true' : 'false');
    return;
  }
  const ol = t.closest('[data-outl]');
  if(ol){
    const i = +ol.dataset.outl;
    S.outl = S.outl === i ? null : i;
    const group = ol.closest('.acc');
    if(group){
      group.querySelectorAll('.acc-i.on').forEach(x => x.classList.remove('on'));
      group.querySelectorAll('.acc-h[aria-expanded]').forEach(x => x.setAttribute('aria-expanded','false'));
    }
    if(S.outl === i){
      ol.parentElement.classList.add('on');
      ol.setAttribute('aria-expanded','true');
    }
    return;
  }

  const ah = t.closest('.acc-h');
  if(ah){
    const item = ah.parentElement;
    const wasOn = item.classList.contains('on');
    const group = item.closest('.acc') || item.parentElement;
    group.querySelectorAll('.acc-i.on').forEach(x => x.classList.remove('on'));
    if(!wasOn) item.classList.add('on');
    return;
  }
  const sl = t.closest('.slot');        if(sl && !sl.disabled){ device.querySelectorAll('.slot').forEach(x=>x.classList.remove('on')); sl.classList.add('on'); return; }
  const dy = t.closest('.day');         if(dy){ device.querySelectorAll('.day').forEach(x=>x.classList.remove('on')); dy.classList.add('on'); return; }
  const cs = t.closest('.cs button:not([data-ctab]):not([data-rtab])');
  if(cs){ cs.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('on')); cs.classList.add('on'); return; }
  const rt2 = t.closest('[data-rtab]');
  if(rt2){ S.rtab = rt2.dataset.rtab; render(); return; }
  const cm = t.closest('[data-crtmenu]');
  if(cm){
    const i = +cm.dataset.crtmenu;
    S.crtMenu = S.crtMenu === i ? null : i;
    render(); return;
  }
  if(t.closest('[data-certshare]')){ S.certShare = !S.certShare; render(); return; }
  const so = t.closest('[data-shareopen]');
  if(so){ const id = so.dataset.shareopen; S.shareOpen = S.shareOpen === id ? null : id; render(); return; }
  if(t.closest('[data-shareto]')){ S.certShare = false; S.shareOpen = null; render(); return; }
  if(t.closest('[data-chall]')){ S.chAll = !S.chAll; render(); return; }

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
  const ss = t.closest('[data-scenesave]');
  if(ss){
    const kind = ss.dataset.scenesave;
    if(scenePicked(kind).length === 3){
      S.scenes[kind] = scenePicked(kind).slice();
      S.scenesUpsell = kind;
    }
    render(); return;
  }
  const sa = t.closest('[data-scenesall]');
  if(sa){
    const kind = sa.dataset.scenesall;
    S.scenes[kind] = SCENES[kind].map((_, i) => i);
    S.scenesUpsell = null;
    render(); return;
  }
  if(t.closest('[data-scenesok]')){ S.scenesUpsell = null; render(); return; }
  if(t.closest('[data-scenesclose]') && !t.closest('.sheet')){ S.scenesUpsell = null; render(); return; }
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
    const read = c && c.querySelector('[data-read]');
    if(!read) return;
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
    const scRead = c && c.querySelector('[data-read]');
    if(scRead) scRead.innerHTML =
      `<span class="k">Week ${i+1} &middot; ${parts}</span><span class="v">${tot} min</span>`;
    return;
  }

  const bar = t.closest('.chart-bar');
  if(bar){
    const c = device.querySelector('#'+bar.dataset.chart);
    c.querySelectorAll('.chart-bar').forEach(x=>x.classList.remove('on'));
    bar.classList.add('on');
    const read = c && c.querySelector('[data-read]');
    if(!read) return;
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
  const shown = stagesShown();
  const i = shown.findIndex(s=>s[0]===S.stage);
  if(e.key==='ArrowRight') setStage(shown[(i+1)%shown.length][0]);
  if(e.key==='ArrowLeft')  setStage(shown[(i-1+shown.length)%shown.length][0]);
});

const PF_AV_BACK = (typeof AVATARS !== 'undefined' && AVATARS.av1) || null;
let pfFlipped = false;
function pfFlipAvatar(){
  const inner = PF_AV_BACK
    ? `<span class="pf-flip-in${pfFlipped ? ' flipped' : ''}" data-avflip>
         <img class="pf-flip-f pf-flip-front" src="${AV.hana}" alt="">
         <img class="pf-flip-f pf-flip-back" src="${PF_AV_BACK}" alt="">
       </span>`
    : `<img src="${AV.hana}" alt="">`;
  return `<span class="av-ph pf-flip" style="width:72px;height:72px"><i>MN</i>${inner}</span>`;
}
if(typeof window !== 'undefined' && !window.__pfAvTimer && PF_AV_BACK){
  window.__pfAvTimer = setInterval(() => {
    pfFlipped = !pfFlipped;
    document.querySelectorAll('[data-avflip]').forEach(el => el.classList.toggle('flipped', pfFlipped));
  }, 3000);
}

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
