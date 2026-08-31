
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
const S = {stage:'new', view:'dashboard', portal:'candidate', tal:false, talQ:null, nav:false, notif:false, acct:false, read:[], rtab:'points', ctab:'discussion', hist:[], thread:[], typing:false,
  addCard:false, editProfile:false, editPhoto:false, stg:0, notes:false, iv:'level',
  /* EVERY DISCLOSURE IS CLOSED UNTIL IT IS OPENED, AND THEY ARE KEYED BY NAME.
     "What the interview found" starts closed because it is the longest block
     on the two dashboards that carry it and it is a re-read — see the note
     over `foundHead`. That was a single `found:false` flag, on the reasoning
     that the two dashboards never appear together so a second key would only
     ever hold the first one's value. True of those two; false the moment a
     THIRD disclosure exists on a different page, which "How your cohort
     works" on the Enroll page now is — one flag would have meant opening the
     report on the dashboard and finding the cohort block already open.

     A map rather than a second boolean, so the next one costs a string. The
     keys are the names the views pass to `foundHead`: `report`, `cohort`. */
  disc:{},
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
   THE PORTAL SWITCH IS IN THE ACCOUNT MENU — Maryam, 31 Aug 2026

   It was a two-segment control beside the logo, and the note that used to
   stand here argued for that position: "the right-hand end of the bar is
   already the row of things about YOU, so a portal switch there would read as
   another personal control rather than as the frame around everything below
   it." That argument was answered rather than overruled — SWITCHING PORTAL IS
   A PERSONAL CONTROL. It does not reframe the page you are on; it signs you in
   as somebody else, which is the same kind of act as opening your own profile,
   and it belongs in the same menu. What frames the page is the trail, and that
   is what took the space beside the logo.

   IT IS ALSO A CONTROL YOU PRESS TWICE A DEMO AND NEVER AGAIN. A black segment
   permanently lit next to the wordmark spent the loudest fill in the bar on
   that, on every screen of both portals.

   `PORTALS` CARRIES THE FACE NOW, and it is the row's mark rather than a glyph.
   The argument is `ACH`'s: you are switching to a named person the product has
   already introduced — Priya leads Cohort 41 and is this candidate's own agent
   — and a generic silhouette is a picture of the category instead. It also
   means the menu needs no icon that `icons.js` does not already carry.

   IT IS STILL NOT A NAV ITEM. `data-swap` is its own branch in the delegated
   listener rather than a `data-go`, because `go()` pushes history and swaps a
   view inside the current portal — and this changes who is signed in. Crossing
   that line resets the stack rather than adding to it.

   AND IT IS `data-swap`, NOT `data-portal`, WHICH THE OLD BUTTONS USED. That
   name is also the stamp `lead.js` writes on `.app` for 31-lead.css to scope
   against, and the listener's note four hundred lines down records what a
   `closest('[data-portal]')` did when it started matching the root: every
   navigation in the product died at once, silently. The branch was rescued by
   scoping it to `.psw-t[data-portal]` — the class that no longer exists. A
   different attribute retires the collision instead of re-pointing it.
   ============================================================ */
const PORTALS = [['candidate','Candidate','hana'],['leader','Cohort Leader','priya']];
const otherPortal = () => PORTALS.find(([k]) => k !== S.portal);

/* ============================================================
   THE TRAIL, AND THE ONE CRUMB THE HEADER CANNOT KNOW

   `shell()` is evaluated BEFORE `view()` — they are two calls in one string
   concatenation in `render()` — so the header cannot read anything the page is
   about to draw. Everything derivable from state is decided here, in
   `crumbMod`, and the LIST ITSELF IS DRAWN BY A PASS: `placeTopbar` (ai11.js)
   fills `.crumb-trail`, which ships empty.

   THE PASS DRAWS THE WHOLE TRAIL RATHER THAN APPENDING TO IT, and the first
   version did the other thing. `crumbBar()` wrote home and the module, the
   pass appended the page — and then had to *unwrite* the module on the
   twenty-one views that hand-author a deeper `crumb()` of their own, which
   means one function guessing which `<li>`s another function put there. One
   builder, one list, no removal.

   THE TRAIL IS THE PATH, NOT THE HIERARCHY (Maryam, 31 Aug 2026), and it took
   two corrections to get there. It opened with the product's name — a full
   trail from home — and that was the wrong trade on a product two levels deep:
   a constant first crumb in front of every page, with the wordmark 80px to its
   left already saying the same word, costs the room the page's own name needs.
   Then it started at the MODULE, read off the view's hand-written `crumb()`,
   which was the deeper mistake: that prints where a page SITS, so pressing
   "Book Priya now" on the dashboard gave `Interviews / All agents / Priya
   Nair` — three crumbs, two of them links back to pages the reader had never
   opened. `trailParts` (ai11.js) walks `S.hist` now, and the long version of
   the argument is over that function.

   THE MODULE IS READ THE SAME WAY THE RAIL READS IT. `PARENT[S.view] ||
   S.view` is `sidenav`'s own line, so the crumb and the lit rail entry cannot
   disagree about which module you are in. `NAVSETS` then supplies the label,
   which is why the trail says "Course Progress" and "Points" rather than
   `transcript` and `rewards`.

   THE RAIL'S FOOT IS NOT IN `NAVSETS` and has to be named: Profile is drawn in
   `.sn-foot`, under both portals, and is the parent of `terms` and of What Tal
   knows. Two entries, and the map is the place a third would go.
   ============================================================ */
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

/* ============================================================
   THE ACCOUNT MENU

   Two items and no more. "Profile settings" is where the face has always gone
   — it is the same `data-go` the rail's foot and the old avatar button both
   used, so nothing about that destination changed — and the portal switch
   joins it. Log out is deliberately NOT here: it is in the rail's foot, it is
   the one item in this family that ends the session, and duplicating it into a
   menu that opens under the pointer is how a demo gets signed out by accident.

   THE MENU IS RENDERED WHETHER OR NOT IT IS OPEN, with `.on` carrying the
   state, which is `notifPanel`'s shape and is what lets §77 transition it.
   Nothing inside it keeps state in the DOM (trap 9).

   SENTENCE CASE, per §63 §4: the words go in the markup the way they are read.
   ============================================================ */
function acctMenu(){
  const [ok, ol, oi] = otherPortal();
  return `<div class="acct-menu ${S.acct?'on':''}" role="menu" aria-label="Account">
    <button class="acct-i" role="menuitem" data-go="${isLead()?'leadProfile':'account'}">
      <span class="acct-i-mk">${I.settings}</span>
      <span class="acct-i-t">Profile settings</span>
    </button>
    <button class="acct-i" role="menuitem" data-swap="${ok}">
      <span class="acct-i-mk acct-i-av"><img src="${AV[oi]}" alt=""></span>
      <span class="acct-i-t">Switch to ${ol}</span>
    </button>
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
    ${crumbBar()}
    <div class="shell-right">
      <span class="shell-name">${name}</span>
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
        <svg class="acct-c" viewBox="0 -960 960 960" aria-hidden="true">${inner('chevDown')}</svg>
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

/* ============================================================
   SHARED PIECES
   ============================================================ */
const talLabel = (s) => `<span class="ai-label${s?' '+s:''}">Tal</span>`;

function stars(n){
  let out='';
  /* THE LIT SLOT IS A DIFFERENT GLYPH, NOT THE SAME ONE IN A DIFFERENT COLOUR.
     Under the filled icon set this printed `star` five times and let the `.f`
     class carry the whole rating in colour; the set is linear now, so an unlit
     star and a lit one would differ by hue alone at 12px. `star` is FILL 1 and
     `starOutline` FILL 0 — see the note over the pair in icons.js. `.f` stays,
     because the colour is still right and §26 keys on it. */
  for(let i=1;i<=5;i++) out += `<svg class="${i<=Math.round(n)?'f':''}" viewBox="0 -960 960 960">${inner(i<=Math.round(n)?'star':'starOutline')}</svg>`;
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
/* THE RECOMMENDATION IS A CHIP ON THE CARD (Maryam, 31 Aug 2026: "add a
   'Recommended' chip next to priya nair name in all agent card"). It replaces
   `talRec` on the Interviews module — the note in `V.interviews` is the
   argument, and the short version is that on the page which LISTS the six
   agents, a 166px block about one of them printed that person twice.

   IT IS DERIVED FROM `recKey()`, NEVER FROM THE NAME. Priya is only today's
   answer: `S.recKey` cycles through `REC_ORDER` and the chip has to follow it,
   or the page would recommend Priya in the grid while Tal's own block on the
   dashboard recommended Owen. Testing the key rather than `a.n` also means the
   sixth card cannot wear it by accident — that cell used to be `'priya'` again.

   IT IS BLUE ON LIGHT BLUE AND IT IS NOT A `.tag` (Maryam, 31 Aug 2026). Both
   halves of that were corrections. It shipped for one round as `.tag.acc.sm`,
   which is a solid ACCENT block — and at 24px tall against a 17px name it read
   as a status banner stretched across the card rather than a note beside a name.
   The accent was wrong for a second reason too: on this page the accent is the
   Book button on all six cards, so an orange chip on one of them competes with
   the thing you press.

   AND `.tag` COULD NOT BE MADE TO BEHAVE, WHICH IS THE PART WORTH RECORDING.
   §02.12 declares it `display:inline-flex`, but it computes to `display:flex` —
   so in `.agh-nn` it became a block-level flex and took the whole line: 570px
   wide at a 744 frame, and squeezed to 18px inside §26.4's `minmax(0,1fr)` track
   at 1024, where it was unreadable. A chip that has to sit inside a line of text
   cannot inherit a block's display, so `.ag-rec` states its own — see §26.3b.

   THE NAME IS WRAPPED IN `.agh-nn` AND THAT IS THE WHOLE REASON THIS NEEDED
   MARKUP. `.agh-n` looks like a line of text and is a GRID in the two cases
   that matter: §26.4 makes it `grid-template-columns:minmax(0,1fr) auto` inside
   a three-across `.rail` at 900+, and §26's `max-width:479.98px` block does the
   same on a phone — both so the fee can sit in its own track instead of
   overhanging a 130px column. In a grid the name is an ANONYMOUS grid item, so
   a chip written beside it is a SECOND item: it auto-placed into row 2 column 1
   and was squeezed to 18px by `minmax(0,1fr)`, which also made the recommended
   card 32px taller than the five next to it. Nothing errored; the chip was
   simply somewhere else, at a size it could not be read at.

   Wrapping the name puts the two in ONE cell, where the chip is an ordinary
   inline-flex after a text node and wraps under the name only when the column
   is too narrow for both. Every existing rule keeps working — §26 and §24 place
   `.ag-price`, and `.agh-n`'s own type inherits down. */
function agentCardH(key){
  const a=AGENTS[key];
  const rec = key === recKey() ? '<span class="ag-rec">Recommended</span>' : '';
  return `<div class="agh draw agh-book">
    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${avatar(a,72)}
    <span class="agh-n"><span class="agh-nn">${a.n}${rec}</span><span class="ag-price">${a.price}</span></span>
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
    <svg class="card-go" viewBox="0 -960 960 960">${inner('arrowRight')}</svg>
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
    payment:'Payment',welcome:'Enrolled',coursework:'Coursework',chapter:'Chapter '+((S.ch??3)+1),transcript:'Course Progress',rewards:'Points',
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
  <svg class="tile-arrow" viewBox="0 -960 960 960">${inner('arrowRight')}</svg>
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
/* ==========================================================================
   A CELEBRATION IS ONE LINE IN THE HEADER — Figma 486:1084, §62

   Maryam's cut, in two passes, and the second one settled it. `ACH` holds three
   celebrations — a rank, a badge and a promotion — and all three were drawn as a
   green band across the page under the head: a mark, a heading, a sentence, a
   View button and a dismiss. THE BAND IS GONE FOR ALL THREE. What replaces it is
   one line at the right-hand end of the page header, in `--link` with its last
   word underlined, and that is enough — telling somebody what just happened does
   not need a slab, a second heading and a control to make it go away.

   THE FIRST PASS ONLY MOVED THE RANK, on the argument that a rank is a property
   of you while a badge and a promotion are news you dismiss. The distinction is
   real and it did not survive contact: a promotion is not news you want to close
   either, and two announcement shapes on one dashboard — a blue line at the top
   for one kind and a green slab lower down for another — is the product saying
   the same thing in two registers. One shape, three sentences.

   SO THE HEADER ROW CARRIES BOTH HALVES, and they still have different
   lifetimes:

     the mark   your own face at 75px with the rank medal on its corner, left of
                the `<h1>`. NOT an announcement — it is on every dashboard, and
                the medal is there on every stage that HAS a rank (`GAME`, the
                four enrolled and complete stages). It changes when the rank does.
     the line   `achLine`, at the right-hand end of the same row. THIS is the
                announcement, and it is conditional: it appears exactly where the
                banner would have, on the three stages `ACH` names.

   AND NOTHING IS DISMISSIBLE ANY MORE. `S.hideAch` and the `data-hideach`
   handler went with the band — a one-line update in a header is not something a
   reader needs to clear, and a control for it would have been the largest thing
   in the row. `.ach*` still ships in the design system, unreferenced by `hifi/`,
   the same disposition §27 records for `.tal-panel` and §56 for `.stp-pop`.
   ========================================================================== */

/* THE MEDAL IS A SIBLING OF THE AVATAR, NOT A CHILD, and that is the one thing
   about this markup that is not free choice: §09 gives `.av-ph` `overflow:hidden`
   so the photograph cannot escape its box, which clips anything else in there
   too. The file hangs the medal 4px past the top-right corner, so it has to sit
   in a positioned wrapper beside the avatar rather than inside it.

   AND IT DOES NOT CALL `avatar()`, WHICH IS TRAP 1 AND NOT A STYLE PREFERENCE.
   That helper writes the size as `style="width:75px;height:75px"`, and an inline
   declaration beats every stylesheet rule at every specificity — so the 56 this
   mark steps down to below 900 could only have been won with `!important`. The
   size is §62's, on both sides of the breakpoint. Everything else about the
   element is the helper's own markup, initials-behind-photograph included. */
function youMark(){
  const g = GAME[S.stage];
  return `<span class="ph-you-av">
    <span class="av-ph"><i>MN</i><img src="${AV.hana}" alt="" loading="lazy" onerror="this.style.display='none'"></span>
    ${g ? `<span class="ph-rank"><img src="${AWARD['rank'+g.rank]}" alt="${RANKS[g.rank-1].n} rank"></span>` : ''}
  </span>`;
}

/* AND THE ANNOUNCEMENT RIDES `.ph-act`, WHICH ALREADY EXISTS FOR THIS SHAPE.
   §15 draws the page header as "the heading and its sentence take the measure
   they need; the one action the page is for sits against the right edge of the
   column, on the same band" — which is 498:1578's own arrangement, and it
   already stacks under the title below 672. §62 only has to change the cross-axis
   alignment, because the left half of this row is 75px tall rather than two
   lines of type.

   IT IS A LINK, NOT A BUTTON, and the underline is on the LAST WORD only — both
   are the file's. §12 makes every link `--link` (#0371a4, its own note explains
   the darkening off the file's #0488C5), so the colour is the token rather than
   the hex. The whole phrase is the target; the underline marks where it goes,
   and underlining the sentence instead would make a one-line update read as a
   paragraph somebody turned into a hyperlink.

   THE SPLIT IS ON THE LAST SPACE AND THE COPY IS WRITTEN TO IT. Every `up`
   string in `ACH` ends on the thing it is about — "rank!", "badge!", "E4!" — so
   one `lastIndexOf` does for all three and a fourth needs no code, only a
   sentence of the same shape. The note over `ACH` says so where the strings are.

   THE MARK IS THE AWARD WHERE THERE IS ONE. `art` is the client's own artwork
   and it is preferred for the reason `ACH`'s note gives: you earned a specific
   shield, and a generic glyph of a shield is a picture of the category. The
   promotion has no artwork — it is a decision, not an object — so it falls back
   to `ic`, and §62 sizes that glyph to the line's own ink rather than to the
   28px box the artwork gets. */
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

/* ONE WRAPPER FOR THE SIX DASHBOARDS rather than five extra arguments at six
   call sites. Every other page in the product calls `ph()` exactly as before;
   this is the only header with a face in it, because it is the only page whose
   subject is the reader. */
const dashPh = (title, sub) =>
  ph(title, sub, achLine(), null, youMark());

/* ==========================================================================
   "WHAT THE INTERVIEW FOUND" IS A DISCLOSURE, CLOSED TO START
   ==========================================================================
   The block is the whole of Priya's write-up — strengths, growth areas, her
   note, and a signature row with a face in it. On the two dashboards that
   carry it that is the longest thing on the page, and it is a RE-READ: you
   have seen it once when the report was signed, and after that it sits
   between you and everything the dashboard is actually for.

   So it starts closed and the heading opens it. Three decisions in here:

   1. THE CHEVRON IS ON THE LEFT OF THE HEADING, not on the right of the row.
      A chevron at the far right of a `.sec-h` is 700px from the words it
      belongs to at desktop, and the row already ends in "Read the full
      report" — two controls at the same edge, one of which opens in place
      and one of which navigates away. On the left it reads as part of the
      heading, which is what it is.

   2. THE STATE IS IN `S`, NOT ON THE ELEMENT. The accordion at `.acc-h`
      toggles a class in the DOM and gets away with it because nothing
      re-renders those pages. This block is on a DASHBOARD, where Tal
      answering a question or the stage picker moving both re-render in
      place — and per trap 9 `render()` replaces `device.innerHTML`, so a
      DOM class would take the panel shut again mid-read. `S.disc` survives.
      Re-rendering is cheap here: entrance animations gate on `data-open`,
      a one-render marker (trap 5), and `typeSummary` keys on the summary's
      text, so neither replays.

   3. "READ THE FULL REPORT" STAYS OUTSIDE THE PANEL. It is the way to the
      whole document and it is useful whether or not the summary is open —
      putting it inside would mean opening the short version to find the
      link to the long one.
   ========================================================================== */
/* AND IT IS KEYED, BECAUSE THERE IS MORE THAN ONE OF THEM NOW.
   `data-found` carried the constant `1` while `S.found` was the only flag.
   It carries the disclosure's NAME instead — the same string the section
   reads through `discOpen` — so the handler needs no branch and a new
   disclosure is a heading and a key. `report` is the default so the two
   dashboards read as they did.

   The section still wears `.found` / `.found.on`: §65's rules are about the
   SHAPE of a disclosure, not about which one, and every one of them keys on
   that class. Nothing in this change reaches the stylesheet. */
const discOpen = (key) => !!S.disc[key || 'report'];
const foundHead = (title, act, key) => `<div class="sec-h found-h">
    <button class="found-t" data-found="${key||'report'}" aria-expanded="${discOpen(key)?'true':'false'}">
      <span class="found-chev">${I.chevRight}</span><h2>${title}</h2></button>
    ${act||''}
  </div>`;

/* ==========================================================================
   THE CERTIFICATE IS A CARD, AND THERE IS ONE OF IT
   ==========================================================================
   The promoted dashboard used to close on a lone `<button>` reading "Download
   my certificate" in an otherwise empty `.btn-set` — a download with nothing
   to say what was being downloaded, on the one page whose whole subject is
   that the 90 days are finished. The certificate itself is the thing worth
   showing; the download is one of its two actions.

   The component already existed twice over: `V.transcript` draws exactly this
   card for the candidate, and `V.leadCerts` draws it for the cohort leader
   (`lead4.js`). So this is a THIRD copy of four lines of markup and two
   buttons, which is how the three of them start to disagree — the leader's
   says "Awarded … / Issued by …" and the candidate's says "Completed … /
   Signed by …", and nothing but attention was keeping the difference
   deliberate. One function, both candidate call sites.

   The leader's stays where it is: `LDR_CERTS` is a list with a track and an
   issuer per row and this takes neither, so folding them together would mean
   a parameter for every line. Same component, same CSS, two callers with
   different data — which is what `.cert` is.

   TRAP 12 APPLIES: `.cert` is in `DARK_CARD`, so `placeDark` lifts whichever
   page child contains it into the head band. On `promoted` that band already
   holds the enrolment `.plate`, so this arrives as the SECOND dark card and
   §56 spans it across both columns underneath — which is the behaviour that
   is written down, not a surprise. Do not add a third.
   ========================================================================== */
function certCard(f){
  return `<div class="sec">
    <div class="cert">
      <span class="cert-mark">${I.certificate}</span>
      <div class="cert-b">
        <div class="cert-eb">Certificate of completion</div>
        <div class="n">Explorer Track &ndash; ${f.complete?'E3':'E2'}</div>
        <div class="m">${f.complete?'Completed November 21, 2026 &middot; Cohort 41':'Completed May 4, 2026 &middot; Cohort 12'}</div>
        <div class="m">Signed by ${f.complete?'Priya Nair':'Daniel Kerr'}</div>
      </div>
      <div class="cert-act">
        <button class="btn btn-sm noic cert-btn" data-go="transcript">Download</button>
        <button class="btn btn-sm noic cert-btn">Share link</button>
      </div>
    </div>
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

/* ==========================================================================
   THE WEEK PULSE — one section, three columns

   THREE SECTIONS BECAME ONE, AND THE ARGUMENT IS THAT THEY WERE ALREADY ONE
   QUESTION ASKED THREE TIMES. Under the head band this dashboard drew "This
   week" (the open chapter, a ring, what you finished, what Tal expects), "Time
   on the course" (thirteen stacked bars) and "Where you stand" (points, badges,
   rank) as three separate `.sec`s with three headings and 1230px between the
   first hairline and the last. Every one of them answers "how am I doing", and
   split across three panels a person has to hold the first in their head to
   read the third.

   ONE SECTION, THREE COLUMNS, IN THE ORDER THE QUESTION IS ACTUALLY ASKED:

     current focus   what I am in the middle of — the chapter, its ring, and
                     what the week already contains.
     your pace       whether that is enough — the week's minutes against the
                     55-minute target, and the same figure three ways.
     your standing   what it has earned — `standRow`, unchanged, stacked.

   WHAT WENT, AND BOTH ARE SUBTRACTIONS WORTH ARGUING:

   THE SECOND TAL PARAGRAPH. `weekCard` closed with Tal comparing you against
   the members of the cohort furthest ahead — written when Tal spoke fourth on
   this page and this was the assistant's first word on it. §71 moved Tal's
   sentence to the head band's whole left column, and the two then said the same
   thing twice: week 1's card was "Four of the ten in Cohort 41 have already
   finished chapter 1. Nothing is assessed this week…" against a summary 500px
   above it reading "Right now, four of the ten in your cohort have already
   finished it… This week has no graded assessments". That is the duplication
   the two-copy-slot rule exists to stop, and the head band is the slot that
   wins. `WEEKLY[stage].tal` is left in data.js — the words are still the right
   words if a surface ever needs them again, and nothing reads them today.

   THE ASK CHIP WENT WITH IT, AND IT HAD ALREADY GONE. `weekCard` closed on
   `askChip(w.ask[0], w.ask[1])` and that chip has never rendered: step 1b of
   `placePageSummary` (ai6) removes every `.chip-tal` on the page that is not
   inside something of Tal's — the aura card, the panel, the thread, a sheet,
   or the band — on the reasoning that a lone pill in page flow says neither
   who is asking nor why, and the ask dock at the foot of the frame is the
   standing answer to "anything else?". `.wkc-a` is page flow, so the chip was
   stripped on every render of both stages.

   It was drawn again at the foot of the pace column for one build, on the
   argument that both of `WEEKLY[stage].ask`'s strings are about the week's
   WORKLOAD and that is what the column is about. Same rule, same removal — and
   the rule is right: a figure column is not Tal's either. `WEEKLY[stage].ask`
   is left in data.js with `.tal` for the same reason, and nothing reads it.

   THE THIRTEEN-WEEK STACKED CHART. It cannot be a third of a column — it is
   thirteen bars, a four-series legend and a data table — and Maryam's call was
   that the time data belongs "around week progress", which is what the pace
   column is. The chart is not deleted: it MOVED to Course Progress, next to the
   assessment-scores chart, which is the page that already holds the chapter
   record and the four course figures. That is also where `V.dashboard`'s
   promoted branch has claimed the week-by-week record lives since it dropped
   its own copy — the claim was stale when it was written and this makes it
   true.
   ========================================================================== */
/* ==========================================================================
   THE AI-NATIVE SECTION HEAD — `aiHead`, and it is ONE component for all three

   THE HEADING AND ITS DESCRIPTION ARE ONE BLOCK, AND THE ACTIONS ARE CENTRED
   AGAINST THAT BLOCK — 613:7984. This is the structural point and it is what
   three sections got wrong in three slightly different ways before it existed.

   What the wrong version was: a `.sec-h` holding the title and the action group,
   with the description as the section's NEXT child. The action group is 40px
   tall and the title's line box is 22, so the row was 40 and the title sat
   centred in it — which put 9px of empty row under the title before its own
   12px margin even began, and the description read as a detached paragraph
   floating below the heading. The gaps measured 12 and 20 exactly as specified
   and still looked wrong, which is why measuring the margins was not enough:
   the margin was right and the BOX was wrong.

   613:7984 is explicit about it. Frame 209 — the left column — is the title row
   (27) plus 12 plus the description (29), 68 tall. Frame 211, the 447x40 action
   group, sits at y=14 inside that same 68: centred against the pair, not against
   the title. So the title starts at the top of its column and the actions
   straddle both lines.

   ONE FUNCTION, THREE CALLERS, AND THAT IS THE WHOLE POINT (Maryam, 31 Aug
   2026: "no section should have this kind of heading and description random
   placements, do this one time"). `.aih-t` and `.aih-d` are one title role and
   one description role — §63 §13 states each once, instead of the three pairs
   that had drifted to 12.5 / 14 / 16 depending on which `:has()` in §63 §8b a
   section happened to match. A fourth section needs no new class and no new
   type rule.

   `mark` IS OPTIONAL AND ONLY ONE SECTION PASSES IT. The sparkle is Tal's voice
   and a page carries one — the band's "Summary by Tal" is the first, the
   enrolment offer's heading is the second, and a third on the block underneath
   stops reading as attribution. `.aih-mk` is deliberately NOT `.ai-label` or
   `.ai-aura`: `talFirst` hoists any `.sec` containing an `.ai-aura` to under the
   `.ph` and `placeBand`'s `_mhIsTal` claims either class as head furniture, so
   wearing one would move the section into the band. §72 records that trap at
   length. */
function aiHead({mark, title, desc, act, extra}){
  return `<div class="sec-h aih">
    <div class="aih-b">
      <h2 class="aih-t">${mark ? '<i class="aih-mk"></i>' : ''}${title}${extra || ''}</h2>
      ${desc ? `<p class="aih-d">${desc}</p>` : ''}
    </div>
    ${act ? `<div class="aih-a">${act}</div>` : ''}
  </div>`;
}

/* THE PACE COLUMN HAS TWO READINGS AND THE COURSE BEING OVER IS WHAT PICKS ONE.
   While the 90 days run, "pace" is this week against the weekly target and the
   segments are the target itself — one block per TWO minutes, so 28 blocks IS
   the 55 and ten of them lit is 20 minutes rather than a decorative 36%. That
   density is 599:7418's; the file draws 7 lit beside its own "36% Of target",
   which wants 10, so the count is derived here and the two cannot disagree.
   Once they are over there is no "this week" to be on pace with: the reading
   becomes the whole course against thirteen weeks of that target, and the
   segments become the thirteen WEEKS with a week that met its target lit. That
   second bar is the stacked chart's one durable fact — which weeks you hit —
   in the same thirteen-block language §71 draws the chapters in. */
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

/* THE MARK IS THE `.stat` CHIP AND THE HUES ARE NAMED, NOT CYCLED — the same
   call §65 records for `progressStrip`'s three figures. A column keeps its hue
   wherever it is drawn, so "your pace" is the green one on day 34 and on day 90
   where the focus column is absent and it has moved to first. `nth-child` would
   have made it blue on one of those two. */
function pulseCol(mk, ic, label, body){
  return `<div class="pulse-c" style="--mk:var(--mk-${mk})">
    <div class="pulse-h"><i class="pulse-ic">${ic}</i><span class="pulse-lab">${label}</span></div>
    ${body}
  </div>`;
}

/* THE LEDE IS DERIVED, NOT WRITTEN, WHICH IS THE ONLY WAY IT CAN BE HERE AT ALL.
   Every figure in it is read off the same `f` / `g` / `pacePart` the three
   columns are drawn from, so the sentence cannot disagree with the block under
   it — which is the risk a second prose slot on this page carries and the
   reason `PAGESUM`'s entries are hand-written and this one is not.

   IT IS NOT A `PAGESUM` ENTRY AND MUST NOT BECOME ONE. That slot is the head
   band's, one per page, and `placePageSummary` owns it. This is the section's
   own opening line: it names the chapter, the week's minutes and the one thing
   to do, in that order, and it is the sentence the three columns then answer in
   figures. The overlap with the band's summary is the chapter name and the
   45 minutes; the band says what has HAPPENED (unlocked today, four of ten
   ahead of you) and this says where you ARE in it. */
function pulseLede(f, g, p){
  if(f.finished){
    const n = g.weeks.length;
    return `All <b>13 chapters</b> are done &mdash; ${p.figs[0][0]} across ${n} weeks, ${p.figs[2][0]} of the ${WEEK_TARGET} min weekly target. Booking the re-interview is the only thing left.`;
  }
  const i = f.open, mins = CH[i][1];
  const did = S.stage === 'day34' ? 12 : 0;
  const wk = g.weeks[g.weeks.length-1] || 0;
  /* THE SECOND CLAUSE COLLAPSES WHEN THE TWO FIGURES ARE THE SAME NUMBER.
     Day 34 has 12 minutes on chapter 4 and 12 minutes on the course this week,
     because the chapter IS what the week has been spent on — so the sentence
     came out "12 of 70 minutes … and have spent 12 minutes", which reads as
     two facts that happen to agree rather than one fact stated once, and
     invites the reader to look for the difference. Said in words instead. The
     `did` guard keeps week 1 on the two-figure form, where 0 and 20 are
     genuinely different and the mock prints both. */
  const same = did > 0 && did === wk;
  return `You have completed <b>${did} of ${mins} minutes</b> for <span class="pulse-hl">${CH[i][0]}</span>, ${
    same ? `which is all the time you have spent learning this week`
         : `and have spent <b>${wk} minutes</b> learning overall this week`
  }. Complete chapter ${i+1} to stay on the pace.`;
}

function pulse(f, g){
  const w = WEEKLY[S.stage] || WEEKLY.week1;
  const p = pacePart(f, g);

  /* THE FOCUS COLUMN IS THE ONE THAT CAN BE ABSENT, and `f.finished` is the
     same test that used to hide the whole "This week" section: on day 90 all
     thirteen chapters are done and there is nothing to be in the middle of.
     The row is two columns there, which is why §72 sizes the grid by counting
     its children rather than writing three tracks. */
  let focus = '';
  if(!f.finished){
    const i = f.open, mins = CH[i][1];
    const did = S.stage === 'day34' ? 12 : 0;
    const pct = Math.round(did / mins * 100);
    /* THE TITLE COMES FIRST AND THE CHAPTER LINE UNDER IT — 599:7418's own
       order, and `weekCard`'s inverted. The eyebrow-over-title shape is right
       when the eyebrow is a CATEGORY the title belongs to; here it is the
       chapter's number and state, which is a fact ABOUT the thing named above
       it. Read down: what I am on, which chapter that is, how far in.
       So it is no longer an eyebrow — §63 §12 sets it as a description. */
    focus = pulseCol(1, I.book, 'Current focus', `
      <h3 class="pulse-t">${CH[i][0]}</h3>
      <div class="pulse-eb">Chapter ${i+1} &middot; ${S.stage === 'week1' ? 'Unlocked today' : 'In progress'}</div>
      <div class="pulse-ring">
        ${ring(pct, `${pct}% of chapter ${i+1} done`)}
        <span class="pulse-rb"><b>${did} / ${mins} min</b><span class="pulse-rl">completed</span></span>
      </div>
      ${''/* WHAT THE WEEK ALREADY CONTAINS, AND IT DRAWS ONLY WHEN THERE IS
             SOMETHING IN IT. Facts only, past tense — the note over WEEKLY in
             data.js is the argument, and nothing undone appears in it.

             THE EMPTY STATE IS GONE AND THAT IS WHY THE MOCK MATCHES. Week 1's
             list is empty and `weekCard` printed `w.none` in its place —
             "Nothing finished yet. Chapter 1 unlocked today and nothing this
             week is assessed." That sentence says what the ring beside it
             already shows (0%) and what the band's summary says in full, and
             on 599:7418 the column ends on the button instead. So the empty
             branch is dropped rather than restyled: on week 1 this column is
             exactly the four rows the file draws, and on day 34 the two real
             facts sit above the button rather than being thrown away. */}
      ${w.did.length
        ? `<ul class="pulse-did">${w.did.map(([t,m]) => `<li>
            <span class="pulse-tick">${I.checkFilled}</span>
            <span class="pulse-db"><b>${t}</b><span class="pulse-dm">${m}</span></span></li>`).join('')}</ul>`
        : ''}
      ${''/* THE COLUMN'S OWN WAY IN, AND IT IS THE SECOND ROUTE TO THE CHAPTER
             ON THIS SECTION — the head row's "Open chapter N" is the first.
             That is normally the thing this codebase argues against (§29.16's
             report card, `weekCard`'s own "Coursework" button), and it is
             Maryam's call on 599:7418: the two are at opposite ends of a 357px
             block and the section head's button belongs to the SECTION while
             this one belongs to the column it closes. The words differ for the
             same reason — one names the chapter, one names the act. */}
      <div class="pulse-go"><button class="btn btn-g btn-sm" data-go="chapter:${i}">Continue learning ${I.arrowRight}</button></div>`);
  }

  const pace = pulseCol(2, I.time, 'Your pace', `
    <div class="pulse-fig">${p.fig}<small>${p.unit}</small></div>
    <div class="pulse-sub">${p.sub}</div>
    <div class="pulse-bar">
      <span class="pulse-bl">${p.label}</span>
      <span class="pulse-seg" role="img" aria-label="${p.sub}">${
        p.segs.map(s => `<i class="${s}"></i>`).join('')}</span>
    </div>
    <div class="pulse-3">${p.figs.map(([v,l]) =>
      `<span><b>${v}</b><span class="pulse-3l">${l}</span></span>`).join('')}</div>`);

  /* `standRow` UNCHANGED, and that is the point of reusing it: the rewards page
     draws the same three cells and the two cannot disagree about what a badge
     is worth. §72.4 turns the three-across grid into a stacked card and re-lays
     each row against the file's arrangement — all of it from the outside, with
     not one declaration on the cell and no change to the markup. */
  const stand = pulseCol(3, I.star, 'Your standing', standRow(g));

  /* THE SECTION'S ACTION IS THE ONE THING IT EXISTS TO MAKE HAPPEN, which
     while the course runs is the open chapter and once it is over is the
     standing the last surviving column is about. */
  const act = f.finished
    ? `<button class="btn btn-g btn-sm noic" data-go="rewards">View more</button>`
    : `<button class="btn btn-p btn-sm" data-go="chapter:${f.open}">Open chapter ${f.open+1} ${I.arrowRight}</button>`;

  /* THE HEADING IS TAL'S AND THE MARK SAYS SO — 599:7418 puts the sparkle and
     "Your learning pulse" where a section heading goes, because the block below
     it is a reading of your numbers rather than a table of them.

     AND IT IS DELIBERATELY NOT `.ai-label` OR `.ai-aura`, WHICH IS THE ONE
     THING IN THIS FUNCTION THAT WOULD BREAK THE PAGE. Three passes hunt for
     those two classes by name: `talFirst` HOISTS any `.sec` containing an
     `.ai-aura` to directly under the `.ph` (trap 11), and `placeBand`'s
     `_mhIsTal` treats a section containing EITHER as head furniture and pulls
     it into the band. §70's own note records that exact bug — "Tal's
     recommends" wore an `.ai-label.bare`, the band's run walked into it, and
     the section rendered at 576px instead of 901 with nothing thrown and
     nothing warned. The one-Tal cap in that run would save this section today,
     which is precisely the kind of accident not to depend on. `.pulse-mk` is
     its own class, §72.1b paints it with §70's `--ai-star` and `--ai-grad`, so
     the mark is the same object the band's label wears and no pass can see it. */
  return `<div class="sec">
    ${''/* ONE STAR PER PAGE, AND ON THE ENROLLED DASHBOARDS THIS IS IT. The rule
          is Maryam's (31 Aug 2026) — "do not use star with each new section" —
          and it is a rule about a page, not about a component: the mark says a
          block is Tal speaking, and a page that says it three times has stopped
          attributing and started decorating. The band's "Summary by Tal" carries
          its own label, and this is the one section below it that is Tal's
          reading rather than the product's list. `What the 90 days cover` on
          `assessed` is the case that went the other way. */}
    ${aiHead({mark:true, title:'Your learning pulse', desc:pulseLede(f, g, p), act})}
    <div class="pulse">${focus}${pace}${stand}</div>
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
  /* `\b\d+ days?\b` IS THE GENERALISATION OF `week|month` THAT WAS MISSING,
     and it is written that narrowly on purpose: the Enroll page's spine opens
     on "90 days", which matched nothing and came out as the fallback ring —
     a mark that says the fact has no subject. A bare `days?\b` would have
     matched Thursday. `day \d` stays for "day 34 of 90", which is the other
     shape the product writes. */
  /* THE MONTH LIST IS SPELT OUT AS WELL AS ABBREVIATED. `\bDec\b` does not
     match "December", so the enrolment confirmation's "starts 1 December"
     fell past this row — and past every row after it until `star` inside
     "Starts" caught it and drew a trophy. May is the one month left out on
     purpose: the table is matched case-insensitively and "may" is a word. */
  [/week|\b\d+ days?\b|day \d|of 90|month|\bAug\b|\bNov\b|\bDec\b|\b(january|february|march|april|june|july|august|september|october|november|december)\b/i,'calendar'],
  [/minute|hour|\bmin\b/i,                            'time'],
  [/\$|paid|fee|price|refund/i,                        'wallet'],
  [/session|call|thread|message/i,                     'chat'],
  [/chapter|course|module|training/i,                  'book'],
  [/vetting|verif|identity|reference/i,                'shield'],
  /* `\bstars?\b`, NOT `star`. Unanchored it matched "Starts", "started" and
     "restart", and because this row is LAST it was the catch-all that got
     them — a date fact drawn as a trophy, with nothing to say it had been
     matched on the wrong word. Every other pattern here is anchored or is a
     word that cannot be a prefix of another. */
  [/certificate|award|badge|\bstars?\b/i,              'trophy']
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
/* ==========================================================================
   THE FACT ROW IS OFF, EVERYWHERE — Maryam, 31 Aug 2026: "remove this
   component where we have insights with the heading, we just need to show the
   heading everywhere. please do this everywhere."

   ONE RETURN, NOT THIRTY EDITS. Thirty-odd `ph()` calls across two portals
   pass a `&middot;` spine as their second argument, and every one of them
   reaches this function; answering it here means a call site keeps its string
   and simply stops drawing it, so nothing has to be found and nothing can be
   missed. It also leaves the sentence in the view for whoever brings the row
   back — the argument for it is in `ph()`'s own note above, and the argument
   against is that the head of a page now says its name once and lets Tal do
   the rest.

   THE PROSE BRANCH SURVIVES, AND THAT IS THE ONE EXCEPTION. A `sub` with no
   middot in it is not a fact row — it is the auth screens' one line of prose,
   and those pages have no Tal card under the title, so removing it would leave
   `Create your account` with nothing at all. That is the exception `ph()`'s
   note already states, and it is the same test this function already made.

   `factIcon` / `PH_IC` / `_cap` STAY. They are unreached from here now, and
   they are not the "gate nothing writes" case CLAUDE.md describes — that is
   about CSS shipped without its behaviour. This is markup with no caller, kept
   because bringing the row back is one line and re-deriving thirty icon
   patterns is not. If the row is not wanted by the next release, delete all
   four together.
   ========================================================================== */
const phSub = sub => {
  const parts = String(sub).split(/\s*(?:&middot;|·)\s*/).map(s => s.trim()).filter(Boolean);
  if(parts.length < 2) return `<p>${sub}</p>`;
  return '';
};
/* `mark` IS A FIFTH ARGUMENT AND NOT A SIXTH SHAPE. One page in the product
   opens with a face — the dashboard, whose subject is the reader — and 486:1084
   puts it left of the `<h1>` spanning both the title and the fact row under it.
   §62 does that with a two-column grid on `.ph-main` rather than a wrapper
   around the two text rows, so the thirty-odd `ph()` calls that pass no mark
   emit byte-identical markup to what they emitted before. `.ph-you` is the gate;
   nothing without a mark ever sees the grid. */
function ph(title,sub,act,backTo,mark){
  return `<div class="ph${act?' ph-has-act':''}${mark?' ph-you':''}">
    <div class="ph-main">${mark||''}<div class="ph-top">${bk(backTo)}<h1>${title}</h1></div>${sub?phSub(sub):''}</div>
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
/* `codes` IS THE SAME OPT-IN `ladder()` TAKES, AND FOR THE SAME REASON.
   The note over `ladder` is the argument: the black hero prints the level at
   34px directly above fifteen small blocks, so naming them there is the card
   saying it twice, and the wing on white gives each block ~40px and reads
   better named. My Level draws this band in the wing now (`lvlWing`), so the
   pre-interview state and the confirmed one are the same bar with the same
   labels — which is what makes "you are somewhere in E1 to E5" a picture
   rather than five orange blocks the reader has to place by counting. The
   hero on `V.report` still calls this with no argument and is unchanged. */
function trackBand(track, codes){
  const T = ['Explorer','Builder','Trailblazer'];
  const ti = Math.max(0, T.indexOf(track));
  const lo = ti * 5;
  return `<div class="ladder ladder-track" role="img" aria-label="${track} track, levels ${lo+1} to ${lo+5} of 15. Your level is set at the interview.">
    ${Array.from({length:15},(_,i)=>`<i class="${i>=lo&&i<lo+5?'mine':''}">${codes?`<b>${LVL_CODES[i]}</b>`:''}</i>`).join('')}
  </div>
  <div class="ladder-lab">${T.map(n=>`<span${n===track?' class="on"':''}>${n}</span>`).join('')}</div>`;
}
/* THE FIFTEEN LEVELS, THREE TRACKS OF FIVE, IN ONE LIST. `RUNG` (data.js) maps
   only the five Explorer codes to positions, because that is all the candidate
   portal ever needed to look up; the full ladder was written out a second time
   in lead3.js as `LDR_RUNGS` for the leader's level picker. Two generators for
   one list is one edit away from a ladder that disagrees with itself, so this is
   the list and `LDR_RUNGS` is now an alias of it. It has to live HERE rather
   than there because views.js parses first — the note in `build.py` on lead3's
   position is the long version. */
const LVL_CODES = ['E','B','T'].flatMap(b => [1,2,3,4,5].map(n => b + n));

/* `codes` PUTS THE LEVEL'S NAME IN EVERY BLOCK, and it is opt-in rather than
   always-on. The head band's ladder (§59, `.wing-lvl`) is on white with 40-odd
   pixels per block and reads better named — "you are at E4" is the whole point
   of the bar, and counting orange blocks to find that out is work the bar can
   do for you. The BLACK level hero draws the same fifteen blocks in a different
   place at a different size, and it has the level printed at 34px directly
   above it, so a second set of fifteen labels there is the page saying it
   twice. One component, two states, the caller decides.

   `confirmed` WAS THE SECOND ARGUMENT AND WAS NEVER READ — three callers, none
   of them passing it, and no branch in the body. Replaced rather than kept
   beside the new one: a parameter that does nothing is a parameter the next
   reader has to check the body for. */
function ladder(cur,codes){
  const r = rungOf(cur);
  return `<div class="ladder">${LVL_CODES.map((c,i)=>
    `<i class="${i<r-1?'done':(i===r-1?'on':'')}">${codes?`<b>${c}</b>`:''}</i>`).join('')}</div>
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
   APPOINTMENT — and enrolling has no clock. Which is not the same as having no
   DATE: see the note over `ENROL_OPENS` below, which is where that changed.

   --------------------------------------------------------------------------
   AND IT IS AN OFFER NOW, NOT A LIST — Maryam's read against 486:1084's own
   enrolment card, which this had four differences from. All four are the same
   argument: the reader is being asked to spend $690, and a card that answers
   "what is this and what does it cost" in one glance is what an offer looks
   like.

     1. A SENTENCE UNDER THE TITLE. `ENROL_DESC` — what the 90 days DO for you,
        which is the one thing neither the fact rows nor Tal's sentence said.
     2. THE PRICE IS THE ACCENT AND IT HOLDS THE ROW'S RIGHT EDGE. Written as
        `Label <b>figure</b>`, which `splitPlateBody` (ai5) lifts into a
        `.plate-v` — the note there is where the general rule is stated.
     3. A RULE UNDER EVERY FACT ROW, so the four read as a spec rather than as
        a paragraph broken into four (§66).
     4. WHEN IT OPENS, IN A BAND OF ITS OWN — `ENROL_OPENS`.

   THREE OF THE FOUR ARE MARKUP AND ONE IS A STYLESHEET, which is why nothing
   here says `border` or `orange`: §66 draws the rules and the ground, §63 owns
   the two inks, and this function's job is the words and their order. */
/* WHEN THE COURSE OPENS IS THE CARD'S OWN FACT NOW, AND THAT REVERSES A
   DECISION RECORDED DIRECTLY ABOVE. The old note argued that a countdown chip
   over the price "read as a deadline on the offer" and handed the date to Tal,
   two inches to the left. The chip is still wrong for the reason it gives — a
   clock is for an appointment — but a start date is not a clock, and on a card
   whose whole subject is a course that has not opened it is the fact the reader
   reaches for second, after the price. As a band under the facts rather than a
   chip in the corner it is dated without being urgent.

   ONE PAIR PER LEVEL, IN ONE TABLE, so the two stages cannot drift — the same
   argument the function itself makes for being one function. Every string is
   the product's own, read off a surface that already states it: E3's pair is
   `PAGESUM.enrol`'s "you start with the next cohort — within two weeks of
   paying" and the line the `assessed` card used to carry; E4's is the
   notification in `data.js` ("Explorer Track – E4 opens December 1", "Cohort 58
   has 7 places left"). Nothing here is a new number.

   AND TAL GAVE THE DATE UP RATHER THAN SAYING IT TWICE. `PAGESUM.dashboard.
   promoted` used to close on "E4 opens December 1, and at this level you can
   volunteer to lead a cohort" — with the band on the card that is one date
   said twice inside one head band, which is the duplication `ai6.js`'s own
   note is mostly written to prevent. The clause came off there; the sentence
   keeps the consequence, which is the half only Tal can say. */
/* AND BOTH HEADINGS ARE "<LEVEL> OPENS <WHEN>", WHICH IS A MEASURE AGAIN. The
   heading is 13.5/600 in the note's 233px of inside width — 30 characters to the
   line — and E3's first cut, "The next cohort starts within two weeks", ran to
   39 and broke with "weeks" alone on the second line, beside a calendar mark
   floated against the first. E4's fits on one at 22. So the pair is written to
   one shape: the level, the verb, the date. 25 and 22, both one line, and the
   two stages now read as the same band with a different date in it. The cohort
   is what the second line is for. */
const ENROL_OPENS = {
  /* E3 NAMES THE DATE AND DROPS ITS SECOND LINE, and both halves of that are
     one decision. "opens within two weeks" is a DURATION, and a duration on a
     card that might be read a fortnight from now is a fact with a shelf life
     — it also said the same thing as `PAGESUM.enrol`'s "within two weeks of
     paying", two inches to the left in the same head band. A date says it
     once and stays true. "You keep the same cohort for all 90 days" was a
     POLICY rather than a fact about this enrolment, which is the second of
     `PAGESUM`'s four content bans.

     THE SECOND ELEMENT IS OPTIONAL NOW, which is why the markup tests for it.
     E4 keeps its sub: "Cohort 58 has 7 places left" is a live figure about
     the thing being bought, not a rule about how cohorts work. */
  E3: ['Cohort starts on 1st Dec, 2026'],
  E4: ['E4 opens on December 1', 'Cohort 58 has 7 places left.']
};
/* WHAT THE 90 DAYS DO, AND IT IS THE ONE SLOT ON THIS CARD THAT IS NOT A
   FIGURE. Both read forward to the re-interview, because that is what the
   money buys that the four fact rows do not mention — and because it is the
   only thing on either page that says why a course you have already done once
   is worth doing again at the next level.

   NEITHER ONE REPEATS THE ROWS OR TAL. The price, the chapter count, the
   assessments and the cohort are the rows directly under it; the 90 days you
   have just finished, your average and your growth chapters are Tal's, on the
   other side of the band.

   TWO LINES IS A MEASURE, NOT A STYLE, AND IT IS 68 CHARACTERS. The card is 265
   wide in the band's column with §15's 24 of padding on each side, so the
   sentence has 217px at 13.5/22 — measured at 34 characters to the line. The
   first cut of both of these ran to 95 and 100 and came out THREE lines, which
   is a paragraph rather than a standfirst and pushed the band 22px taller than
   the column beside it. 67 and 66. A third line is the tell that a rewrite has
   drifted; measure it rather than counting words. */
const ENROL_DESC = {
  E3: '90 days at your own level, then a re-interview that can move you up.',
  E4: 'Harder chapters at E4, then a re-interview that can move you again.'
};
const enrolPlate = lvl => `<div class="sec">
      <div class="plate">
        <div class="plate-t">Enroll on Explorer &ndash; ${lvl}</div>
        <div class="plate-d">${ENROL_DESC[lvl]}</div>
        <div class="plate-b">Course price <b>$690</b> &middot; 13 chapters, one a week &middot; 13 assessments, one per chapter &middot; A cohort of ten with a live leader</div>
        ${''/* `.note acc` IS THE COMPONENT AND `.plate-n` IS THE SLOT — one
              element wearing both, because a wrapper round it would be a div
              whose only job is to be found by `placePlates`. The accent note is
              the product's own tinted callout (§02 assigned it the brand tint
              and §66 gives it its ground back); the second line is a `.sub` so
              it takes the description grey rather than the body ink, which is
              the two-tier shape the file draws. */}
        ${''/* THE SUB IS EMITTED ONLY IF THERE IS ONE. `.nb` is a flex column
              with a gap, so an empty `<span class="sub">` is not nothing — it
              is a second row of zero height with the gap still above it, which
              left 6px hanging under E3's single line. */}
        <div class="note acc plate-n"><span>${I.calendar}</span><div class="nb"><b>${ENROL_OPENS[lvl][0]}</b>${ENROL_OPENS[lvl][1]?`<span class="sub">${ENROL_OPENS[lvl][1]}</span>`:''}</div></div>
        <div class="plate-a">
          <button class="btn btn-p btn-sm noic" data-go="enrol">Enroll now ${I.arrowRight}</button>
        </div>
      </div>
    </div>`;

/* ==========================================================================
   THE ENROLMENT OFFER — Figma, the `assessed` dashboard

   THE SAME MOVE §71 MADE FOR THE WEEKLY CALL, MADE FOR THE ONE THING THIS PAGE
   EXISTS TO SELL. `enrolPlate` is a `.plate` — black ground plus §21's warm haze
   — and §59 spends a layer arguing that is the loudest object this product draws
   and is spent on something TIME-SENSITIVE. Enrolling has no clock: the note
   over `enrolPlate` already records that its `data-when` was removed because "IN
   2 WEEKS" over the price read as a deadline on the offer. So the card was
   drawing §59's quiet state permanently, which is a loud object turned down
   rather than the right object.

   Full width and white, with the offer's four figures as a ROW rather than a
   stacked list: the section is the page's second block and 901px wide, and four
   facts in a 265px column had to be four lines when they are four cells.

   WHY IT IS A SECOND FUNCTION AND NOT A CHANGED `enrolPlate`. `promoted` draws
   the same offer one level up, and there it IS in the head band — `placeDark`
   moves the plate into §56's second column, where the certificate is the second
   dark card spanning underneath. Taking `.plate` off would empty that column on
   a page this brief does not touch. The two surfaces are genuinely different
   shapes now: a full-width offer that is the page's subject, and a card beside a
   certificate. What they must not do is disagree about the OFFER, and they
   cannot — `ENROL_OPENS`, `ENROL_DESC` and the fee are read from one place by
   both, which is what those tables were written for.

   THE FOUR FACTS ARE THIS PAGE'S OWN, AND TWO OF THE FILE'S ARE NOT.
   The reference draws Course Fee, Cohort of 10, **Report Turnaround** and
   **Nearest Available Slot**. The last two are INTERVIEW facts — a turnaround on
   the write-up and a bookable slot — and on `assessed` the interview has already
   happened: Priya signed the report on 21 August, which is what put the
   candidate on this page. Printing a nearest slot here would offer a booking
   that is not on offer, and a report turnaround for a report that is two blocks
   below, readable. So the row keeps the file's SHAPE — mark, label, value — and
   takes the four facts `enrolPlate`'s own `.plate-b` states, which are the four
   things enrolling actually buys. */
const ENROL_FACTS = [
  [I.wallet, 'Course fee',   '$690',                          1],
  [I.book,   'Chapters',     '13, one a week'],
  [I.chart,  'Assessments',  '13, one per chapter'],
  [I.group,  'Cohort of 10', 'live calls with your leader']
];

const enrolOffer = lvl => `<div class="sec eo">
      ${aiHead({
        mark:true,
        title:`You&rsquo;re enrolling on Explorer &ndash; ${lvl}`,
        desc:ENROL_DESC[lvl],
        act:`<span class="eo-when">${I.calendar}<b>${ENROL_OPENS[lvl][0]}</b></span>
          <button class="btn btn-p btn-sm noic" data-go="enrol">Enroll now ${I.arrowRight}</button>`
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
      <div class="facts eo-facts">
        ${ENROL_FACTS.map(([ic, lab, val, acc]) => `<div>
          <i class="eo-fi">${ic}</i>
          <span class="eo-fb"><span class="eo-fl">${lab}</span>
            <span class="eo-fv${acc ? ' eo-fv-acc' : ''}">${val}</span></span>
        </div>`).join('')}
      </div>
    </div>`;

/* WHAT THE 90 DAYS COVER — four chapters, then the count of what is behind them.
   The list was all thirteen as a two-column flat run, 528px of it, on a page
   whose next block is Priya's write-up. Four cards say what the course is LIKE;
   the section's own head action goes to `V.enrol`, which draws all thirteen, so
   nothing is unreachable. The fifth cell is the remainder and is a real count
   (`CH.length - 4`), not a "more" link — it is the only cell that is not a
   chapter, so it says how many there are rather than pretending to be one.

   THE HUES ARE `--mk-1/2/3` CYCLED AND THAT IS CORRECT HERE, against §65's and
   §72's decision to name them: those two cycle over cells whose MEANING is
   fixed (a chapter, a pace, a standing), where a positional hue would move a
   subject's colour between screens. A chapter's number has no subject — 01 is
   not "the blue one" — so position is all there is to key on, which is exactly
   the case §29 wrote the cycle for. */
const coverSec = () => `<div class="sec cov">
      ${aiHead({
        title:'What the 90 days cover',
        extra:'<span class="cov-pill">Curated for your growth</span>',
        desc:`${CH.length} chapters, one a week, with a live cohort call alongside each.`,
        act:'<button class="btn btn-g btn-sm noic" data-go="enrol">See the full course</button>'
      })}
      <div class="cov-row">
        ${CH.slice(0, 4).map((c, i) => `<div class="cov-c" style="--mk:var(--mk-${i % 3 + 1})">
          <span class="cov-n">${String(i + 1).padStart(2, '0')}</span>
          <span class="cov-t">${c[0]}</span>
          <span class="cov-m">${c[1]} min</span>
        </div>`).join('')}
        <div class="cov-c cov-more">
          <span class="cov-n">+${CH.length - 4}</span>
          <span class="cov-t">More chapters up ahead</span>
        </div>
      </div>
      ${''/* AND NOTHING UNDER THE ROW. A tinted closing bar sat here — "Learners
            like you spend about 12 hours on the chapters…", three cohort faces
            and "You're in good company" — and it is gone (Maryam, 31 Aug 2026).
            Two of its three parts were already on the page: the hours are the
            five cells above it read together, and the cohort of ten is one of
            the enrolment offer's four figures. What was left was the social
            proof, which is the one claim on this page the product makes about
            other people rather than about this candidate.

            `enrolHours()` went with it — it was that sentence's only caller, and
            a derived figure nothing prints is the "gate no caller writes" tell
            §72 records for the ask chip. `COHORT` and `AV` are untouched. */}
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
   `.prog-top` and a rail — so the three wings read as one component in three
   states rather than as three blocks that happen to share one slot. `ladder()`
   draws the fifteen levels and the three track names under them.

   AND IT HAS NO `.prog-figs`, WHICH IS WHERE IT DIFFERS FROM THE OTHER TWO.
   Three cells sat under the bar for one build — "Dec 1 next cohort opens", "13
   chapters at E4", "90 days then you re-interview" — on the reasoning that the
   forward-looking figures were the one thing this page did not already say.
   Maryam's call to take them out, and the page agrees with her: the enrolment
   card in the band's second column IS the next course, stating the price, the
   thirteen chapters and the cohort three inches to the right, so two of the
   three cells were that card said again in smaller type. What is left is a
   level, a position and the ladder that puts one in the other, which is the
   whole of what the wing is for.

   The wing is shorter than the other two states because of it. That is correct
   rather than something to pad: `.sec-dark` stretches to the left column and the
   band closes on whichever is taller, so nothing has to be filled to keep the
   two columns level. */
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

/* AND THE ENROLLED STATE LEFT THIS FUNCTION — §71, Figma 599:7418.
   The table above listed three states and there are two here now. The middle
   one — `progressStrip` for the three stages with a course running — is still
   `progressWing` and is still the same block; what changed is the SLOT. 599:7418
   turns the band round for those stages the way 578:5966 turned it round for the
   way in: Tal's sentence takes the whole left column and "Your 90 days so far"
   becomes the second one, so the strip is no longer a member of the left column
   at all and there is nothing for a wing to be inside. `progCol` (below) is what
   draws it, and it calls `progressWing` unchanged — the argument for that is the
   same one the table makes: this is a move, not a redraw.

   `consult` and `promoted` are the two stages left. Neither has a second column
   spoken for, so both keep §56's band and both still ask this function which
   block goes in the wing. */
function wingBlock(){
  const f = cfg(S.stage);
  if(f.complete) return ladderWing(f);
  return stepper(journey());
}

/* ==========================================================================
   THE COURSE HEAD — Figma 599:7418

   THE SAME REVERSAL §70 MADE FOR THE WAY IN, MADE FOR THE 90 DAYS. 578:5966
   answered "the product says it is AI-native and then draws a dashboard" for
   `new`, `booked` and `assessed`; the three stages with a course actually
   running were left on §56's band — title, fact row, rule, wing, rule, Tal,
   with the weekly call as a black plate in column two. So the product changed
   voice halfway down its own journey: Tal spoke first for the four weeks
   before the course and fourth for the thirteen weeks of it.

   THE FILE DRAWS THREE BLOCKS AND THAT IS THE WHOLE OF THE HEAD:

     the summary    Tal's sentence, the band's whole left column, on §70's wash.
                    Nothing new — `.talsum` in a `.modhead` already gets the
                    wash, the gradient label and the tinted phrases from §70.2.
     the progress   "Your 90 days so far" in the second column. `progressWing`
                    exactly as the wing drew it, moved.
     the call       a full-width row UNDER both columns: how long you have, who
                    leads it, and the two things to do about it.

   Everything after the call row is the page as it was — the week card, the
   chart, the standing row — which is what the brief asked for and is also the
   only way this stays a head-band change rather than a redesign of three pages.

   WHY THE CALL IS NOT A `.plate` ANY MORE, AND IT IS THE ONE SUBTRACTION WORTH
   ARGUING. It was black with §21's warm haze, which §59 spends a layer saying is
   this product's loudest object and is spent on something time-sensitive — and
   it was already standing down to `.plate-quiet` on both stages that draw it,
   because a weekly call two days out is not inside the day. So the plate was
   drawing its quiet state ~100% of the time. The file draws that same "it is
   coming, it is not urgent" as a white row with the countdown in its own tinted
   cell, and takes the countdown out of `placePlates`'s chip and into words. One
   object doing one job, instead of a loud object permanently turned down.

   WHAT THE ROW DROPS: "Thursday at 6:00 PM ET · 9 others · 60 minutes". That is
   the file's decision and it is a real loss — the row now says WHEN relative
   ("2 days left") and never absolutely. It is said in full on the Cohort page,
   in Interviews, in the notification and in Tal's `cohort` summary, so nothing
   is unreachable; it is one press further away than it was.
   ========================================================================== */
/* THE STRIP IS THE SECOND COLUMN AND IT DECLARES ITSELF WITH `.head-sec`.
   `placeBand` (ai5) takes a run of sections after the `.ph` and recognises three
   kinds: the ask line, anything carrying Tal's mark, and a section the VIEW has
   declared as head furniture. This is the third, exactly as `.sec-jrn` is —
   and, like it, has to be written directly after `ph()` because the loop is a
   run rather than a search.

   `.head-col` IS THE CLASS THAT OPENS THE COLUMN, AND IT USED TO BE `.sec-jrn`.
   §70.3 built the two-column band gated on the journey list by name; there are
   two tenants now, so the structural half of that gate is a class both wear and
   `.sec-jrn` / `.sec-prog` are left saying only WHICH tenant it is. `placeDark`
   tests the same class — see its note. */
const progCol = f => `<div class="sec head-sec head-col sec-prog">
    ${progressWing(f)}
  </div>`;

/* THE CALL ROW — 600:7699 (outside the day) and 608:7772 (inside it).

   THREE CELLS: how long you have, who runs it, and what you would do. The first
   is the only ground on the row and it is where the two states differ — which is
   §59's argument arriving at a different drawing. That layer says the loudest
   object this product has is spent on something time-sensitive and gives a
   `.plate` two grounds, black-with-a-haze inside the day and quiet outside it.
   The file keeps the priority and moves it off the whole card and onto the one
   cell that states the time:

     outside 24h   600:7703, the 4% grey. The row is a white band across the
                   head with one quiet figure in it.
     inside 24h    608:7774, the accent, white ink. Everything else on the row
                   is identical to the pixel — same 24/32 on the cell, same
                   20/32 on the leader, same 32 on the right, same two 185x40
                   buttons. One ground is the whole difference.

   ONE ROW WITH TWO GROUNDS RATHER THAN TWO COMPONENTS, and the file is explicit
   about it: 608:7772 is 600:7699 with the fill changed and the session number
   dropped. Drawing them as two would be the mistake §29.4 records for the level
   card, at the exact moment — an appointment about to start — when the two must
   not disagree about who is running it.

   THE STATE IS READ FROM THE WORDS, because the words are all there is. Every
   appointment in this build is a hand-written string, so `PLATE_SOON` — now
   declared here, see the note over `plateUrgent` in ai5 for why it moved — is
   the vocabulary of inside-the-day, and one pattern serves the row and the
   plate so a call cannot be urgent on one surface and quiet on the other. Swap
   it for a date difference in a real build; the class is the contract.

   AND THE SESSION NUMBER COMES OFF WHEN IT IS URGENT. 600:7705's cell reads
   "2 days Left / Cohort Week Call Session 36" and 608:7775's reads "In 2hrs /
   Cohort Week Call". Two hours out, which session of thirteen this is stops
   being the useful half of the sentence, and the cell's measure is 89/80 rather
   than 134 — the number would have taken a third line for nothing.

   THE PORTRAIT IS SQUARE AND IT IS NOT `avatar()`. Same reasoning §70.5 records
   for `.rec-ph`: that helper writes its size inline (trap 1) and draws a disc,
   and 600:7723 is an `aspect-[736/736]` that is `self-stretch`. The initials sit
   behind the photograph as the same fallback `avatar()` provides.

   EVERY FACT IS `COHORT_LEAD`'S. The name, the mark, the range and the expertise
   are read off the record rather than typed here, which is what stops this row
   and the Enroll page's leader card disagreeing about who Priya is. The one
   string that is this row's own is the session, because nothing else in the
   build names it.

   IT IS A `.head-sec` TOO, so `placeBand` takes it as the band's third member,
   and §71.2b spans it across both columns on the row under them. Written after
   `progCol` for the same reason `progCol` is written after `ph()`. */
const PLATE_SOON = /\b(now|today|tonight|imminent|starting|under an hour|in an hour|in \d+ ?(h|hr|hrs|hour|hours|m|min|mins|minute|minutes)\b)/i;

/* THE WEEKLY CALL, STATED ONCE. `when` is the countdown in `PLATE_SOON`'s own
   vocabulary and everything else about the cell is derived from it, so moving
   the call closer is one edit: "in 2 days" is a grey cell reading "2 days left
   · session 36" and "in 2 hours" is an accent cell reading "In 2 hours". */
const WEEK_CALL = {when:'in 2 days', session:36};

/* HOW THE CELL SAYS THE COUNTDOWN. The file writes the two states two ways —
   600:7705 puts the unit first and the verb last ("2 days Left"), 608:7775 puts
   the preposition first ("In 2hrs") — and both are the same string with "in "
   moved. Outside the day the distance is a quantity you have; inside it, it is
   a time it happens at. Anything that is not an "in …" phrase is already
   written as the cell wants it ("Due now", "Today 4:30 PM") and is left alone. */
const callLeft = w => !/^in /i.test(w) ? w
  : PLATE_SOON.test(w) ? 'In ' + w.slice(3) : w.slice(3) + ' left';

/* ==========================================================================
   ONE ROW FOR ALL THREE CALLS — Maryam, 31 Aug 2026

   This product has three appointments and it was drawing them two ways: the
   weekly cohort call as the `.crow` below (600:7723 — a countdown cell, a
   square portrait, who they are, two actions) and the level interview as a
   black `.plate` on `booked`. Same object, same four facts, two components —
   which is the mistake §29.4 records for the level card and the one this
   file's own note about `.plate` makes for the consultant call.

   SO THE COMPONENT IS THE MARKUP AND `CALL_ROW` IS THE DATA. `crow(kind)`
   draws the row; a row in the table says who the call is with, what to call
   it, when it is, and what the second button does. A fourth appointment is a
   fourth row and no markup.

   THE COUNTDOWN DRIVES THE WHOLE CELL, which is why `when` is written in
   `PLATE_SOON`'s vocabulary rather than as a date: inside the day the cell
   goes accent and drops the session number, outside it the cell is grey and
   keeps it. Move a call closer by editing one string.

   WHO IS READ, NEVER TYPED. The cohort call reads `COHORT_LEAD`, the interview
   reads whoever was actually booked (`bkAgent`, ai7 — late-bound because that
   file parses after this one, which is fine for a function called at render).
   The expertise line comes from `REC` for an agent and from the record for the
   leader, so this row cannot disagree with the recommendation block or with
   the Enroll page about who somebody is.
   ========================================================================== */
const CALL_ROW = {
  /* the level interview, on `booked` */
  iv: () => {
    /* READ `S`, NOT ai7'S HELPER — and the guard this replaces is the trap.
       It was `(typeof bkRec === 'function' && bkRec().agent)`, which looks like
       the safe form of a late-bound reference and is not: **`typeof` only
       shields an identifier that was never DECLARED.** `bkRec` is
       `const bkRec = …` (ai7:88), so before ai7 parses it is a declared binding
       in the temporal dead zone, and `typeof` on one of those THROWS rather
       than returning 'undefined'.

       views.js's boot `render()` is the last statement in this file and runs
       before ai7 exists, so a COLD LOAD at `#booked/dashboard` reached this
       line, threw, and took the whole first paint with it — `device.innerHTML`
       0 bytes, a white page. A hash change from another stage did not
       reproduce it, because by then ai7 has parsed; that is why both a
       220-combination and a 3,065-render in-page sweep passed over it.

       `bkRec()` is `S.booking || S.bk || {defaults}` and all this needs is the
       agent key, so reading the two state objects directly is the same answer
       with no ordering question left in it. Same precedence as `bkAgent`:
       the completed booking, then the flow in progress, then `S.agent`. */
    const k = (S.booking && S.booking.agent) || (S.bk && S.bk.agent) || S.agent || 'priya';
    const a = AGENTS[k] || AGENTS.priya;
    /* THE COUNTDOWN IS 'in 1 minute' (Maryam, 31 Aug 2026), AND IT IS STILL
       ONE STRING RATHER THAN A LITERAL IN THE MARKUP. `callLeft` turns it into
       exactly "In 1 minute" — `PLATE_SOON` matches `in \d+ minute`, so the
       branch that puts the preposition first is the one that fires — which
       means the words Maryam asked for come out of the machinery that was
       already here and nothing on the card is typed.
       WHAT IT NOW DISAGREES WITH, stated rather than left to be found: Tal's
       summary on this stage says the interview is "confirmed for Thursday,
       August 20 at 6:30 PM" and `dashPh` says "interview 20 August". A
       countdown of one minute cannot be true at the same time as a date six
       days out. One edit either way — this line, or those two — and the note
       over `bkStamp` is the argument for why they must agree. */
    return {who:a, role:'Talent agent', when:'in 1 minute',
      label:'Level interview &middot; 45 minutes, recorded',
      x:`${(REC[k] || REC.priya).expertise}, assesses ${a.range}`,
      kind:'iv', second:{go:'interviews', ic:I.calendar, t:'Reschedule'}};
  },
  /* the weekly cohort call, on the enrolled dashboards */
  cohort: () => {
    const L = COHORT_LEAD, w = WEEK_CALL.when;
    return {who:L, role:'Cohort leader', when:w,
      label:`Cohort week call${PLATE_SOON.test(w) ? '' : ` &middot; session ${WEEK_CALL.session}`}`,
      x:`${L.expertise}, assesses ${L.range}`,
      kind:'cohort', second:{go:'messages', ic:I.chat, t:'Message ' + L.n.split(' ')[0]}};
  },
  /* the re-interview. NOT DRAWN YET and the reason is worth keeping: on day 90
     the card is "Book your re-interview / Choose an agent" — there is no person
     on it, because choosing the person IS the action. A row whose subject is a
     photograph cannot be the card for picking whose photograph it will be. It
     is here so that a booked re-interview is one call site away. */
  re: () => {
    const a = AGENTS.priya;
    return {who:a, role:'Talent agent', when:'due now',
      label:'Re-interview &middot; 45 minutes, recorded',
      x:`${REC.priya.expertise}, assesses ${a.range}`,
      kind:'re', second:{go:'interviews', ic:I.calendar, t:'See the booking'}};
  }
};

/* THE ROW ONLY — the caller wraps it. On the enrolled dashboards it is a
   `.head-sec` so `placeBand` takes it into the band as a third member spanning
   both columns; on `booked` it is an ordinary section in the page body, because
   that band's second column is already the journey (§70.3). Returning the bare
   `.crow` is what lets one component sit in both places without the component
   knowing which. */
/* TWO PARTS ARE OPTIONAL, AND BOTH MODES HAVE A CALLER — Maryam, 31 Aug 2026.
   The `booked` dashboard draws this row inside §75's black card, and a card
   brings its own furniture: the countdown belongs in the heading row above the
   divider (`.dc-when`), which is where a card states what it is ABOUT, and the
   row is that card's one action. The other three call sites are the row on its
   own in a white section, where the cell IS the row's ground and the second
   button is its only way out — so both keep everything.

   `when:false` TAKES THE LABEL WITH IT, and that is the part worth checking
   before reusing this flag. The cell is a countdown OVER "Level interview · 45
   minutes, recorded", so dropping it drops both. On `booked` the label is not
   lost — Tal's summary 40px above says "45 minutes, video-recorded" in the same
   breath as the date — which is the only reason this is a subtraction rather
   than a move. On a page with no summary it would be a fact going missing.

   TWO FLAGS RATHER THAN ONE, because they are two decisions: one is about where
   the time is drawn and one is about whether Reschedule exists. A single `bare`
   would make the next caller take both to get either. */
function crow(kind, o){
  const c = (CALL_ROW[kind] || CALL_ROW.cohort)();
  const p = c.who;
  const soon = PLATE_SOON.test(c.when);
  o = o || {};
  return `<div class="crow${soon ? ' urgent' : ''}">
      ${o.when === false ? '' : `<div class="crow-when">
        <b>${callLeft(c.when)}</b>
        <span>${c.label}</span>
      </div>`}
      <div class="crow-who">
        <span class="crow-ph"><i>${p.i}</i><img src="${p.img}" alt="" loading="lazy" onerror="this.style.display='none'"></span>
        <div class="crow-b">
          <p class="crow-id"><span class="crow-n">${p.n}</span>
            <span class="crow-v">${I.checkFilled}</span></p>
          <p class="crow-role">${c.role}</p>
          <p class="crow-x"><b>Expertise:</b> ${c.x}</p>
        </div>
      </div>
      <div class="crow-a">
        ${o.second === false ? '' : `<button class="btn btn-sm noic ic-l" data-go="${c.second.go}">${c.second.ic}${c.second.t}</button>`}
        <button class="btn btn-p btn-sm noic" data-call="${c.kind}">Join call ${I.arrowRight}</button>
      </div>
    </div>`;
}

/* the enrolled dashboards' wrapper — a band member, per the note above */
const callRow = () => `<div class="sec head-sec head-col sec-call">${crow('cohort')}</div>`;

/* ==========================================================================
   THE AI-NATIVE HEAD — Figma 578:5966

   THE JOURNEY LEAVES TAL'S CARD AND BECOMES THE BAND'S SECOND COLUMN.
   §56 built the left column as `<h1>` / fact row / rule / wing / rule / Tal,
   with the page's one DARK card in column two. The file turns that inside
   out for the way in: Tal's sentence is the whole of the left column, on its
   own warm wash, and the four steps are the right one. Everything that moves
   is a move rather than a redraw — `journey()` is still the single list,
   `stepIcon` still picks the mark, and `stepper()` is untouched for the three
   stages that still draw the horizontal row (`consult`, `booked`, and the
   leader's pages).

   WHY IT IS A `.head-sec` AND NOT A SECOND `.sec-dark`. `placeBand` (ai5)
   takes a run of sections after the `.ph` and only recognises three kinds:
   the ask line, anything containing Tal's mark, and a section the VIEW has
   declared as head furniture. This is the third — a judgement about one page,
   which is exactly what `.head-sec` was added for (`V.enrol`'s cohort leader
   is the other user of it). Column two is then §70's, gated on the band
   actually containing one, so no other page moves.

   IT STILL HAS TO BE WRITTEN DIRECTLY AFTER `ph()`: the loop is a run, not a
   search. `placePageSummary` inserts Tal's card after the `.ph` two passes
   later, so the order in the DOM ends up header, Tal, journey — and §70 puts
   the journey in the other column regardless, so the source order is only
   about being collected at all.

   THE FOUR LABELS ARE THE FILE'S, IN `JRN_AI`, AND THAT IS A REVERSAL.
   The first cut used `JRN` — "Leadership quiz", "Interview and level",
   "Enrolled", "90-day course" — on two good reasons: `JRN` is where the four
   steps were settled (the long note over `journey()` is the argument) and §63
   is explicit that the words go in the markup in sentence case. Maryam's call
   on 30 Aug 2026 was the file's words exactly, so they are here.

   A SEPARATE LIST RATHER THAN AN EDIT TO `JRN`, because `JRN` is also the
   horizontal `stepper()` that `consult`, `booked` and the leader's pages draw,
   and those are not this design. The two are the same four steps in the same
   order — `JRN_AI[i]` is `JRN[i]` — so `stepIcon` still derives the right mark
   from either, and a fifth step would have to be added to both. What the file
   contributes beyond the words is the SHAPE: a numbered vertical list, a tick
   on what is done, the subject mark on what is not, and the count as a pill on
   the heading row.

   THE COUNT IS DERIVED. "Step 2 of 4" is the position of the `on` step in the
   list `journey()` returned, so a stage that moves the marker moves the pill
   with it and the two cannot disagree. A stage with nothing `on` — every step
   done — reads as the last step rather than as "Step 0". */
const JRN_AI = ['Nextinleadership Quiz','Interview &amp; Levelling',
                'Course Enrollment','90 days Cohort Journey'];

function jrnList(){
  const steps = journey();
  const at = steps.findIndex(s => s.st === 'on');
  const now = at < 0 ? steps.length : at + 1;
  /* `.head-col` IS WHAT OPENS THE SECOND COLUMN AND `.sec-jrn` IS ONLY WHICH
     TENANT. §70.3 keyed the whole two-column band on `.sec-jrn` because this
     was the only thing that ever went in there; §71 puts the progress strip in
     the same slot on the enrolled dashboards, so the structural half of that
     gate is now a class both wear. `placeDark` tests the same one. */
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
          <span class="jrn-n">${i + 1}.</span>
          <span class="jrn-lab">${JRN_AI[i] || s.lab}</span>
        </li>`).join('')}
      </ol>
    </div>
  </div>`;
}

/* ==========================================================================
   TAL'S ONE RECOMMENDATION — Figma 578:5966 (581:6456)

   THE RAIL OF THREE BECOMES A CHOICE OF ONE, AND THAT IS THE WHOLE POINT OF
   THE PAGE. `new` used to end its head band with "Book your interview" over a
   `.rail` of three `agentCardH`s — a shortlist, which is a list you still have
   to work through. An AI-native page does the working: Tal names ONE person,
   says on what evidence, and offers the way to disagree with it. The other two
   are one press away behind that link and behind the nav's own Agents page, so
   nothing is lost except the obligation to compare.

   EVERY FIGURE IS `AGENTS.priya`'S, READ RATHER THAN RESTATED. The name, the
   rating, the interview count, the level range and the next slot all come off
   the record, which is what stops this block and the Agents page disagreeing.
   THE FEE IS THE ONE PLACE THE FILE AND THE PRODUCT DIFFER: 581:6479 says
   "$120 Interview Fee" and `AGENTS.priya.price` is $95 — and $95 is also the
   top of the range Tal's own sentence quotes two inches away, and the number
   `V.agent` and `V.booking` both charge. A file's placeholder does not get to
   be the third price on one journey, so the record wins and the design's
   layout keeps it.

   `REC` IS THE PART THAT IS NOT IN `AGENTS`, and it is here rather than in
   data.js because it is a statement about THIS candidate's overlap with this
   agent — a match, a need and a strength — not a property of the agent. One
   object so the three strings are stated once; the tags read the agent's own
   first name off the record rather than carrying "Priya" a fourth time. */
/* ONE ROW PER AGENT, BECAUSE THE OVERLAP IS ABOUT THE PAIR. `AGENTS` holds
   what is true of the agent — rating, range, fee, slot — and this holds what is
   true of THIS candidate against them: a match, the need it answers and the
   strength that answers it. A single row would have made "98% match" a property
   of the recommendation slot rather than of the recommendation, so swapping the
   agent would have kept the number and the claim.

   THE THREE ARE THE THREE THE PAGE ALREADY OFFERS — `['priya','owen','lena']`
   is the shortlist `V.new` drew as a rail before §70, and the copy under it
   said "three agents assess Explorer candidates". Samuel and Hana assess E3–B2
   and B1–B4, which is above this candidate.

   AND EVERY STRENGTH IS READ OFF THE AGENT'S OWN `bio` (data.js) rather than
   invented: Owen's is "how you decide when the information is incomplete",
   which is also chapter 7's title, and Lena "came up through engineering
   management". The needs are the candidate's own — delegation is what
   `PAGESUM.booked` and chapter 4 both name as their growth area. */
const REC_ORDER = ['priya','owen','lena'];
const REC = {
  priya:{match:'98%', need:'System Design',    strength:'Architecture',
         expertise:'System Architecture', mins:'45 mins call'},
  owen: {match:'94%', need:'Decision Making',  strength:'Incomplete Information',
         expertise:'Retail Operations',   mins:'45 mins call'},
  lena: {match:'91%', need:'Delegation',       strength:'Engineering Teams',
         expertise:'Engineering Management', mins:'45 mins call'}
};

/* THE RECOMMENDATION IS STATE, AND `S` IS WHERE IT LIVES — trap 9. `render()`
   replaces `device.innerHTML`, so which agent is on screen cannot be a class or
   a dataset value on the card; it is read back out of `S` on every paint and
   the card is a pure function of it. */
S.recKey = 'priya';
S.recBusy = false;
const recKey = () => REC_ORDER.includes(S.recKey) ? S.recKey : REC_ORDER[0];

/* HOW LONG TAL TAKES TO FIND ONE. Maryam asked for four to five seconds — long
   enough that the search reads as work rather than as a flicker, short enough
   that it is not a page that has stopped. */
const REC_MS = 4500;

/* WHAT TAL LOOKS LIKE WHILE IT IS THINKING — Figma 588:6781 (588:6822).

   THE SKELETON IS THIS BLOCK'S OWN SHAPE, NOT A GENERIC LOADER. Every bar is
   the box of the thing it stands in for — 236x24 where the name goes, three
   140s where the three facts go, two 29-tall pills where the two tags go — so
   nothing moves when the real content lands. A spinner would have been the
   dashboard answer: a page saying "wait" instead of a page saying "I am
   assembling this".

   AND IT IS THE BRAND RAMP AT 20%, which is what makes it read as AI rather
   than as a grey loading state. §70.5b draws the fill and the left-to-right
   sweep; the file's own bars carry `rgba(244,113,19,.2)` through amber to
   `rgba(240,83,12,.2)`, one gradient per shape.

   THE BUTTON KEEPS THE OLD AGENT'S NAME at 20% — 588:6992 — because the old
   recommendation has not been withdrawn yet, it is being replaced. The link
   under it stops being an offer and becomes a status: "Finding another agent",
   upright rather than italic, because it is no longer something being quoted. */
/* `no-band` IS AN OPT-OUT AND IT STOPS THE ONE-TAL CAP BEING LOAD-BEARING.

   `placeBand` (ai5) collects a RUN of sections after the `.ph` and `_mhIsTal`
   recognises a member by CONTENT — anything containing `.ai-aura` or
   `.ai-label`. This block wears an `.ai-label.bare` for "Agent recommended by
   Tal", so it
   qualifies, and §70's own note records the bug that caused: on the `new`
   dashboard the run walked into it and laid the whole recommendation out in the
   band's left column at 576px instead of the page's 901, with the photograph,
   the facts and the actions each wrapping onto a line of their own. Nothing
   threw and nothing warned.

   WHAT SAVED IT WAS AN ACCIDENT. The run also breaks on a SECOND Tal member,
   and on that page Tal's own summary card comes first, so the cap caught it —
   which §70's note calls "precisely the accident not to depend on". On a MODULE
   page it does not hold: `placePageSummary` (ai6) inserts the summary card two
   passes later, so at `placeBand` time this block is the FIRST member after the
   `.ph` and the cap is not armed. `V.interviews` draws it directly under the
   band, which is exactly that case.

   SO THE VIEW SAYS SO, which is `head-sec`'s mechanism turned round: that class
   opts a section IN when what it contains cannot tell the pass anything, and
   this opts one OUT when what it contains says the wrong thing. One class, one
   `break`, and the cap goes back to being a backstop.

   NOT A FIX TO `.rec-lab` ITSELF, and that is worth recording because it is the
   tidier-looking answer. §72 solved the same trap by giving `.pulse-mk` its own
   class rather than wearing `.ai-label`, and it could afford to because that
   mark was new. This label is drawn by §03, §12, §19, §37, §53 and §63 between
   them — six layers of gradient, mask, size and ink — so re-creating it on
   `.rec-lab` means restating all six and keeping them in step, to change a
   class name. The opt-out is one line. */
/* `rec-dark` IS THE BLACK CARD AND IT IS DELIBERATELY NOT `.sec.on-dark`
   (Maryam, 31 Aug 2026 — "make this card black, you know what our black card
   do right? it has the top right gradient").

   THE PRODUCT ALREADY HAS TWO NAMES FOR THIS SURFACE AND BOTH ARE TRAPS HERE.
   `.plate` is §15's black card and `.sec.on-dark` is §02's black section — and
   ai5's `DARK_CARD` names both, so `placeDark` would lift this block out of the
   page and into the head band's second column. On the `new` dashboard that
   column is the journey list (§70 turned the band round), so the recommendation
   would land on top of it at 330px wide with the photograph, the facts and the
   two buttons each on a line of their own. That is the same failure §70's note
   records for `placeBand` walking into `.rec-lab`, one pass later.
   §75 states the ground and the haze against this class instead; the values are
   `.plate`'s own (`--gray-100`, §21.22's radial), so it is the same object
   without the two names that make a pass move it. */
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
          <p class="rec-f"><span class="sk sk-f"></span><span class="sk sk-f"></span><span class="sk sk-f"></span></p>
          <div class="rec-ov">
            <p class="rec-tags"><span class="sk sk-t sk-why"></span></p>
          </div>
        </div>
      </div>
      <div class="rec-a">
        <button class="btn btn-p btn-sm noic rec-off" disabled>Book ${first} Now ${I.arrowRight}</button>
        <span class="rec-alt rec-finding">Finding another agent</span>
      </div>
    </div>
  </div>`;
}

function talRec(){
  if(S.recBusy) return recSkeleton();
  const a = AGENTS[recKey()];
  const rec = REC[recKey()];
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
        <h2 class="dc-t">Your Next Step - Interview</h2>
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
          ${''/* THE FEE IS `AGENTS.priya.price` AND THE FILE SAYS $120.
                581:6479 is the one number on this block that contradicts the
                product: the record says $95, and so do the Agents page, the
                agent profile and the booking flow. A file's placeholder does
                not get to be the fourth price on one journey, so the record
                wins and the file's wording keeps it. Change `AGENTS.priya` if
                $120 is the real fee and all four surfaces move together. */}
          <p class="rec-f"><span>${I.wallet}${a.price} Interview Fee</span>
            <span>${I.video}${rec.mins}</span>
            <span>${I.calendar}Next slot: ${a.slot}</span></p>
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
        <button class="btn btn-p btn-sm noic" data-go="agent:${recKey()}">Book ${first} Now ${I.arrowRight}</button>
      </div>
    </div>
  </div>`;
}

/* ==========================================================================
   QUICK ACTIONS — Figma 578:5966 (581:6344)

   TWO CARDS, AND BOTH OF THEM ARE THINGS THAT USED TO BE SECTIONS. The quiz
   block (`quizResults`) was ~500px of figures at the foot of this page and its
   own page already exists — `V.result`, the breakdown §61 built — so the card
   is the block replaced by the route to it. The second is a question, which is
   the AI-native half of the pair: the page's other next step is not a screen,
   it is asking Tal to get you ready.

   THE SENTENCE UNDER THE HEADING IS GONE (Maryam, 31 Aug 2026) — "Schedule
   your interview with an agent to complete your level assessment." Two cards
   that each name their own action and describe it in a line under that name do
   not need a third description above them, and this one described only the
   first of the two.

   AND IT TOOK THE LABEL-COLUMN OPT-OUT WITH IT — trap 13, the same way §69 and
   §73 both lost one. A `.sec` with a `.sec-h` takes §10.4's 184px column at
   desktop unless it contains one of seven components, and `.qa` is not one of
   them; this section was opting out through §16's `.sec:has(> .all-desc)`,
   because the sentence was a DIRECT child. §70.6 restates the opt-out on
   `.sec-qa` itself, inside the same container query per trap 3. Removing
   content loses an opt-out exactly as adding a wrapper does. */
const quickActions = () => `<div class="sec sec-qa">
  <div class="sec-h"><h2>Quick Actions</h2></div>
  <div class="qa">
    <button class="qa-c" data-go="result">
      <span class="qa-ic ic-quiz">${I.trophy}</span>
      <span class="qa-b"><b>Open Quiz Results</b><span>Review your score and quiz performance.</span></span>
      <span class="qa-go">${I.arrowRight}</span>
    </button>
    <button class="qa-c" data-tal-ask="Prepare me for my level interview">
      <span class="qa-ic ic-prep">${I.lightning}</span>
      <span class="qa-b"><b>Quick-Start Preparation</b><span>Ask Tal to prepare you for the interview.</span></span>
      <span class="qa-go">${I.arrowRight}</span>
    </button>
  </div>
</div>`;

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
          <svg class="tile-arrow" viewBox="0 -960 960 960">${inner('arrowRight')}</svg></button>`).join('')}
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
    ${dashPh('Hi Maryam','Explorer track &middot; quiz 64 of 100 &middot; no level yet')}
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
          <button class="btn btn-p btn-sm noic">Join ${I.video}</button>
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

  /* ============================================================
     THE WAY IN, REDRAWN AI-NATIVE — Figma 578:5966

     Four blocks and nothing else: what Tal makes of where you are, how far
     along you are, the one person Tal picked, and two things to press. The
     helpers above carry the arguments; what this branch decides is what came
     OFF the page, and all four subtractions are the same one — the page said
     the next step five times and now says it once.

       the dark plate       "Your level interview", four facts and a Book
                            button, in the band's second column. The journey
                            has that column now, and the four facts it carried
                            (45 minutes, recorded, sets E1–E5, $80–$95) are on
                            the recommendation as that agent's own figures.
       the rail of three    `agentCardH` × 3 under "Book your interview". A
                            shortlist is the work Tal is supposed to have done;
                            `talRec` is the answer and the nav's Agents page is
                            still the list.
       the quiz block       `quizResults`, ~500px of settled figures at the
                            foot of a page about what happens next. It is a
                            Quick Action now, pointing at `V.result`, which is
                            the page that holds all of it.
       the wing             `wingBlock()` inside Tal's card. Same four steps,
                            moved to `jrnList` — see the note over it.

     THE GREETING IS BACK IN THE SENTENCE, AND THE `.ph` GOES WITH IT. It is
     still printed — `dashPh` is unchanged, so the `<h1>`, the fact row and the
     rank furniture are all in the DOM and in the accessibility tree — and §70
     takes it off the screen for the one band that carries a journey column,
     because 578:5966 opens on Tal speaking and a title above that would be the
     page saying hello twice. Visually hidden rather than §33.9's `display:none`
     (which is what `.tal-greet` would have bought): a page whose only heading
     is inside a paragraph that types itself has no heading at all for a screen
     reader, and that is a real loss for a look decision.
     ============================================================ */
  else if(S.stage==='new') body = `
    ${dashPh('Welcome back, Maryam!','Explorer track &middot; quiz 64 of 100 &middot; no level yet')}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>You&rsquo;re on the <b>Explorer track</b> from a quiz score of 64, but you have no level yet &mdash; that comes from a 45-minute interview. Three agents have a slot this week, $80 to $95.</p></div>
      </div>
    </div>
    ${talRec()}
    ${quickActions()}`;

  else if(S.stage==='booked') body = `
    ${dashPh('Welcome back, Maryam!','Explorer track &middot; interview 20 August &middot; no level yet')}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>Your interview with <b>Priya</b> is in 6 days. Delegation is the question she asks most often &mdash; ten minutes of practice is usually enough. Your quiz scored 64; the interview is what sets your actual rung.</p></div>
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
          <span class="dc-when">${I.time}${callLeft(CALL_ROW.iv().when)}</span></div>
      </div>
      ${crow('iv', {when:false, second:false})}
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

          BOTH ON THE CANVAS NOW, AND THE JOIN IS A HAIRLINE AGAIN. These two
          were a pair for three builds — "two sections in a row cannot both be
          filled or the page reads as panels all the way down", so the quiz block
          took §12's panel and this one took the canvas. The quiz block is white
          from this build (Maryam's call; the note over `quizResults` is the long
          version), which answers the pair rule the other way round: neither
          filled rather than one filled.

          What that changes here is one line and it comes back on its own. While
          the block below was a `.cards` panel, §55.2 took the closing rule off
          THIS section on the ground that a change of ground is already a
          boundary. There is no change of ground now, so that selector stops
          matching and the hairline is the boundary — which is the ordinary
          rhythm every other pair of sections on the page uses. Nothing is
          restated to get it; §55.2 is keyed on `.cards` and the class went with
          the panel. A `.sec-notop` class lived in §56 for one build to subtract
          the same boundary from the other direction, and went the same way.

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
      ${''/* `.prose` IS THE ROW SAYING IT IS A SENTENCE, NOT A TITLE (Maryam,
             31 Aug 2026). `.cardrow-t` is the h4 role in §63 and everywhere
             else in both portals it holds a NAME — a member, a cohort, a
             session, a card brand — where the strong weight is what separates
             the name from the description under it. These three rows have no
             description: they are the whole of the row, and each is a full
             sentence up to nine words long. Nine words of Kräftig in a numbered
             list reads as three headings with nothing under them, which is why
             they came out heavier than the section heading above them.
             §63 §7b takes the weight to Buch and leaves the 15/20 size alone —
             the row is still a row, it is just not shouting. The class goes on
             the STACK rather than the row so the whole list is declared at
             once, and it is scoped rather than global because `V.welcome`'s
             "What happens next" uses the same `.cardrow-n` shape with real
             titles and a `.cardrow-d` under each — that one is correct as it
             is. */}
      <div class="tile-stack prose mt4">
        ${['One situation from the last three months that did not go well',
           'A decision you would make differently now',
           'Somewhere quiet &mdash; the transcript is part of the assessment'
          ].map((t,i) => `<div class="cardrow"><span class="cardrow-n">${i+1}</span>
          <span class="cardrow-b"><span class="cardrow-t">${t}</span></span></div>`).join('')}
      </div>
    </div>`;
  /* AND THE QUIZ BLOCK IS NOT HERE ANY MORE — the long version of why is the
     note where `quizResults` used to be defined. In short: the four figures
     were the last ~500px of this page and every one of them is settled
     somewhere above. `V.result` still holds all five bands. */

  else if(S.stage==='assessed') body = `
    ${dashPh('Welcome back, Maryam!','Explorer Track &ndash; E3 &middot; level 3 of 15 &middot; not enrolled yet')}
    ${jrnList()}
    <div class="sec">
      <div class="ai-aura tile">
        <div class="ai-head">${talLabel()}<h3>Your next step</h3></div>
        <div class="ai-body"><p>Priya confirmed you at <b>E3 &mdash; rung 3 of 15</b>. Your growth areas are chapters 4 and 12. The next cohort starts within two weeks; enrolling locks in your spot and your price.</p></div>
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
    ${''/* FOUR CHAPTERS AND A COUNT, NOT ALL THIRTEEN — see the note over
          `coverSec`. The full list is `V.enrol`, which is where the section's
          own head action goes. */}
    ${coverSec()}
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
    ${''/* WHITE, NOT `tint cards` — the note over `signedSummary` is the
          argument: the findings are tinted cards now and a 5% wash on a 4%
          grey ground is invisible. */}
    <div class="sec found${discOpen('report')?' on':''}">
      ${foundHead('What the interview found',
        '<button class="btn btn-g btn-sm noic" data-go="report">Read the full report</button>')}
      <div class="found-b">
        <p class="all-desc">The short version of Priya&rsquo;s write-up, signed 21 August. Your strengths, your growth areas and the scenes you kept sit behind it.</p>
        ${signedSummary(true)}
      </div>
    </div>`;

  else if(f.complete) body = `
    ${dashPh('Welcome back, Maryam!','Explorer Track &ndash; E4 &middot; level 4 of 15 &middot; Cohort 41 closed')}
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
    ${''/* WHITE, NOT `tint cards` — the note over `signedSummary` is the
          argument: the findings are tinted cards now and a 5% wash on a 4%
          grey ground is invisible. */}
    <div class="sec found${discOpen('report')?' on':''}">
      ${foundHead('What the re-interview found',
        '<button class="btn btn-g btn-sm noic" data-go="report">Read the full report</button>')}
      <div class="found-b">
        <p class="all-desc">The short version of Priya&rsquo;s write-up, signed 22 November off the 90 days you had just finished.</p>
        ${signedSummary(true, true)}
      </div>
    </div>
    ${''/* AND THE COHORT CLOSES OUT IN FIGURES, NOT IN A CHART.
          The weekly-minutes chart lived here — thirteen stacked bars of how
          long you spent, week by week, on a course that is over. That is a
          chart you read WHILE you are behind on it; once the 90 days are
          closed the only questions left are what you finished, how well, and
          what it earned, and all four of those are one number each. The
          chart is still on Course Progress, which is where the week-by-week
          record belongs and which the heading links to. */}
    ${''/* AND THESE TWO ARE ON THE CANVAS, WHILE THE WRITE-UP ABOVE KEEPS ITS
          PANEL. Maryam's call, and the pair rule is what it turns on: three
          filled sections running to the foot of the page read as panels all the
          way down, so the tone has to say which one is different rather than
          which three are the same.

          THE WRITE-UP IS THE ONE THAT IS DIFFERENT. §45's test is whether a
          block is READ or acted on, and Priya's re-interview summary is the only
          thing down here you read — a closing figure strip and two offers with
          buttons on them are not. `sec tint cards` stays on it; these two lose
          `tint` and their cells go white by §10 rather than by §55's override,
          which is the same swap `quizResults` made. */}
    <div class="sec">
      <div class="sec-h"><h2>Cohort 41, in the end</h2><button class="btn btn-g btn-sm noic" data-go="transcript">Course Progress</button></div>
      <div class="stats">
        ${statCell(I.book, `Chapters`, `13<small>/13</small>`, `all finished`)}
        ${statCell(I.chart, `Average`, `${f.avg}<small>%</small>`, `assessments, all thirteen`)}
        ${statCell(I.trophy, `Points`, GAME.promoted.pts.toLocaleString(), `${GAME.promoted.badges} of 4 badges`)}
        ${statCell(I.growth, `Level`, `E3 &rarr; E4`, `up one, on 21 November`)}
      </div>
      <button class="score-link mt5" data-go="rewards">${scoreCard(GAME.promoted)}</button>
    </div>
    <div class="sec">
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
    </div>
    ${''/* THE CERTIFICATE CLOSES THE PAGE, AND IT HAS TO OPT OUT OF THE BAND
          TO DO IT. `.cert` is in `DARK_CARD`, so `placeDark` (ai5) lifts
          whichever page child contains one into the head band — trap 12 —
          and on this page the band already holds the enrolment plate, so it
          arrived as a second black slab directly under the fold.

          That is the wrong place for it. The band is what you are being
          asked to do next, and this level's enrolment is that; the
          certificate is what you have already finished, which is where a
          page ends rather than where it starts. `.keep-place` is the opt-out
          and `placeDark` reads it — one class, so any other card that wants
          to stay where it was written can say so the same way.

          It is still the same `certCard` as `V.transcript`'s, so the two
          cannot disagree about what the certificate says. */}
    <div class="keep-place">${certCard(f)}</div>`;

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
    ${dashPh('Welcome back, Maryam!', f.finished?'Explorer Track &ndash; E3 &middot; Cohort 41 &middot; ninety days complete':`Explorer Track &ndash; E3 &middot; Cohort 41 &middot; week ${f.week} of 13`)}
    ${''/* THE TWO HEAD MEMBERS THE FILE ADDS, AND THEY GO HERE BECAUSE THE RUN
          IS A RUN. `placeBand` walks forward from the `.ph` and stops at the
          first section that is neither Tal's card nor a declared `.head-sec`,
          so both have to be written before anything else — including `reBook`,
          which is a `.plate` and would end the run. The note over `progCol`
          is the long version. In the DOM they end up THIRD and FOURTH, because
          `talFirst` hoists Tal's card to sit directly under the header. */}
    ${progCol(f)}
    ${''/* NO CALL ON DAY 90. `f.finished` is the 90 days being over, and the
          weekly call goes with them — the same test the plate this replaces
          carried. The band is then two columns and no third row, which is
          correct rather than something to fill. */}
    ${f.finished?'':callRow(f)}
    ${reBook}
    ${''/* THE WING LEFT THIS CARD — §71. `wingBlock()` sat here in a `.stp-wing`
          and drew the progress strip as the last member of the band's LEFT
          column; 599:7418 gives the strip a column of its own, so what is left
          in here is what the card was always for. `progCol` above is the same
          block in its new slot. */}
    <div class="sec">
      <div class="ai-aura tile tight">
        <div class="ai-head">${talLabel()}<h3>${stalling?'Where you are stuck':dueRe?'Before your re-interview':'Getting started'}</h3></div>
        <div class="ai-body"><p>${stalling
          ?`Day ${f.day} of 90, week ${f.week}. You&rsquo;ve finished ${f.done} of 13 chapters, averaging ${f.avg}% &mdash; ${f.mins.toLocaleString()} minutes so far. But chapter 4 has been opened four times without finishing. The three furthest ahead in Cohort 41 had it done by now.`
          :dueRe?`All 13 chapters done in 90 days, ${f.avg}% average, ${f.mins.toLocaleString()} minutes total. Your growth areas were chapters 4 and 12 &mdash; and you passed both. Book your re-interview to have Priya assess whether you move up.`
          :`Day ${f.day} of 90. Chapter 1 &mdash; ${CH[0][0]} &mdash; unlocked today, ${CH[0][1]} minutes. Four of the ten in your cohort have already finished it. Nothing is assessed this week, so you can take it at your own pace.`}</p></div>
        <div class="ai-foot">${askChip(stalling?'Walk me through chapter 4':dueRe?'Prepare me for the re-interview':'What is chapter 1 about?',
          stalling?'Walk me through it':dueRe?'Prepare me':'Tell me more')}</div>
      </div>
    </div>
    ${''/* THE THREE SECTIONS THAT USED TO BE HERE ARE ONE — see the note over
          `pulse`. "This week", "Time on the course" and "Where you stand" were
          three headings and three panels asking one question; they are three
          COLUMNS of one section now, in the order the question is asked. The
          thirteen-week chart went with the merge and is on Course Progress. */}
    ${g?pulse(f,g):''}
`;
  }
  return `<main class="main"><div class="page">${body}</div></main>`;
};

/* ==========================================================================
   MY LEVEL OPENS ON THE LADDER WING, NOT ON THE BLACK HERO — Maryam, 31 Aug
   2026: take the black card out of the summary section, put it after it, and
   draw it the way the promoted-to-E4 prototype draws the ladder, on white.

   THREE THINGS THAT ALL FOLLOW FROM ONE MOVE, and the move is the class.

   1. IT LEAVES THE HEAD BAND BY CEASING TO BE A DARK CARD. `.lvl-hero` is in
      `DARK_CARD` (ai5), so `placeDark` lifted it into the `.modhead` and §25.12
      gave it the full width under the header — which is why the level card was
      INSIDE the summary block with the band's rule closing underneath it. There
      is no `keep-place` needed and no pass to teach: `.wing-lvl` is not a dark
      card, so nothing lifts it, and it stays exactly where the view writes it —
      the first section after the band. The band is the title and Tal's sentence,
      which is what a summary section is.

   2. IT IS `ladderWing`'S SHAPE AND ALL OF §59's RULES ALREADY REACH IT.
      Every `.wing-lvl` selector in that layer is written `.app .wing-lvl …`
      rather than scoped to `.modhead`, so the component travels: the ladder's
      track goes to `--layer-accent-01` instead of the hero's on-dark white,
      each block carries its level code, the level you are ON is lit rather than
      filled, and the three track names sit over their own first rungs. That is
      the whole of "like the promoted prototype but with a white background" —
      there is no dark-to-light translation to write, because §59 wrote it for
      the wing on the band's wash and the wash is not what any of it depends on.

   3. THE EYEBROW IS GONE, AND ON THE PRE-INTERVIEW STATE IT IS THE THING THAT
      WAS ASKED FOR. `placeLevelCards` (ai5) moves `.eb` into a `.lvl-foot`
      under the bar, which is where "Your track, from the quiz" was printed. The
      wing has no eyebrow slot: the confirmation line is `.prog-l`, directly
      under the level, where the reference puts "confirmed at your re-interview".
      So the quiz attribution is not relocated, it is dropped — the page's own
      note two blocks down ("A quiz cannot set your level") is the sentence that
      was doing that job properly, and Tal's summary says it a third time.

   WHY IT IS NOT `ladderWing` ITSELF. That function has one state — a confirmed
   level, `f.track &ndash; f.level`, "confirmed at your re-interview" — because
   `wingBlock` only calls it when `f.complete`. This page is drawn at every
   stage including the two where there is no level at all, and it has its own
   right-hand figure for each. Sharing would mean a second parameter and two
   branches inside a function whose one caller passes neither.

   `.lvl-hero` STAYS IN THE BUILD. `V.report` still opens on it, so the black
   card, `placeLevelCards` and §05/§10/§15/§29's hero rules all keep a live
   caller — this is a change to one page, not the retirement of a component. */
const lvlWing = f => {
  const confirmed = !f.pred;
  return `<div class="sec">
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
              ?(f.complete?'Promoted 21 November, signed by Priya Nair':'Confirmed 21 August, signed by Priya Nair')
              :'Your level is set at the interview'}</div></div>
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
  ${lvlWing(f)}
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

     THE FOUR FIGURES. Title given, quiz score, taken, level — that was
     `quizResults`, the block whose "See full breakdown" button used to bring
     you here, and restating it as the first thing on the destination is the
     breakdown of a breakdown you have already read. The `ph` fact row says
     the same three facts in one line because a page has to say where it sits.
     THE BLOCK ITSELF IS GONE FROM ALL THREE DASHBOARDS NOW (31 Aug 2026, the
     note where `quizResults` was defined), which does not change this refusal
     — it strengthens it. This page is the only place those figures live, so
     printing them here as a header over the same five bands would be the one
     surface that has them saying everything twice.

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

/* WHEN IT WAS TAKEN, ONCE. `quizResults` took the date as an argument because
   each dashboard's stepper prints its own and the block could not contradict
   the line above it. THAT BLOCK IS GONE (31 Aug 2026) and this is not: two
   readers are left — `V.result` and `SUMDROP.quiz` (ai6.js) — and they are on
   two different surfaces reached from two different pages, so one function is
   still what stops the quiz being sat on two dates. It stays keyed on
   `S.stage` because `consult` is genuinely a different candidate's timeline. */
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

        AND IT IS THE ROW ALONE — no heading and no legal line (Maryam, 31 Aug
        2026). "Scheduled" over a single row that already says "6 days left ·
        Level interview" is the row's own first cell restated as a heading, and
        the section is the only thing on this part of the page. The 24-hour
        reschedule window goes with it: the sentence is stated where the money
        is, on `V.booking` and `V.payment` — which are the two lines `wRefund`
        (ai8) reads when Tal is asked — and a policy line under a Join button
        is the "no policy" ban `PAGESUM`'s note lists, applied to page copy.

        WITH NO `.sec-h` THIS NEEDS NO LAYER. §10.15's label column only reaches
        `.sec:has(> .sec-h)`, so the section is the same shape the `booked`
        dashboard already draws — `.sec.sec-call` holding the bare row — and the
        opt-out, the gutter restatement and the heading padding a headed version
        needed are all moot. That is why the wrapper matches the dashboard's
        exactly rather than being this page's own. */}
  ${booked?`
  <div class="sec sec-call">${crow('iv')}</div>`:`
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
  <div class="sec found${discOpen('how')?' on':''}">
    ${foundHead('How it works','','how')}
    <div class="found-b">
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
  </div>
`}
</div></main>`;
};

/* ==========================================================================
   "ALL AGENTS" IS ONE BLOCK WITH TWO CALL SITES

   Maryam, 31 Aug 2026: the Interviews module should carry the agent list under
   its own head band, not only send you to `V.agents` for it. Two copies of a
   heading, a sentence, a search field and a six-card grid is how the two start
   to disagree — the `certCard` precedent, and the same reason `jrnList` is one
   function drawn by three dashboards.

   THE SIXTH CARD WAS PRIYA AGAIN AND IS NOW CAMILA ROCHA. `AGENTS` held five
   people and §15.1113 lays `.rail-all` out three to a row, so the sixth cell
   repeated the first — the same name, rating and fee printed twice in one grid.
   Maryam's call on 31 Aug 2026 was to add the sixth agent rather than drop to a
   five-card grid (which leaves an empty cell against the hairline the
   `nth-child(3n)` rule draws). Her row in `AGENTS` carries the whole argument,
   including why every figure in it was picked to sit in a gap.

   `.all-desc` IS LOAD-BEARING — trap 13. `.hd-srch` is not on §10.15's opt-out
   list, so without a direct-child `.all-desc` this heading would take the 184px
   label column and set "All agents" beside its own search field. It is inside
   `.hd-srch-t` here, so the opt-out that actually fires is §16's on the SECTION
   — which is why the sentence must stay a `.sec` descendant and not move into
   the grid.
   ========================================================================== */
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
        <svg class="mag" viewBox="0 -960 960 960">${inner('search')}</svg>
        <input class="inp" placeholder="Search all 24 agents" aria-label="Search agents">
      </div>
    </div>
  </div>

  <div class="rail-wrap">
    <div class="rail rail-all">${['priya','owen','lena','samuel','hana','camila'].map(k=>agentCardH(k)).join('')}</div>
  </div>`;

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
</div></main>`;

/* ==========================================================================
   THE BOOKING PAGE IS THREE PANELS — Maryam, 31 Aug 2026, with a reference
   screen: "update the booking page content ui to this. the look and feel will
   be ours, but take the structuring inspo from the reference".

   WHAT THE PAGE WAS: six loose blocks stacked down one column — the identity
   card, the bio, a `.facts` row, a "Pick a slot" heading, a day strip, a time
   row and a button — each one a section of its own, all the same weight,
   nothing saying which of them was a DECISION and which was context. The page
   asks for $695 and a Thursday evening, and it was drawn as a reading page.

   WHAT THE REFERENCE CONTRIBUTES, and it is structure rather than styling:

     1  WHO, AND WHAT IT COSTS, IN ONE BOUNDED PANEL. The identity, the bio and
        the three purchase facts were three separate blocks answering one
        question. They are one panel now, split — the person on the left, the
        three facts in a column on the right behind a vertical rule.
     2  THE PICKER IS TWO NUMBERED STEPS, side by side. "Pick a slot" was one
        heading over two controls; a date and a time are two choices and the
        numbers say so, which is also what lets the chosen day be NAMED above
        the times instead of inferred from a lit cell in the row above.
     3  THE TIMES ARE A GRID, not a single row — the reference's three columns,
        which is what turns six chips into a thing you scan by shape.
     4  A CHECKOUT ROW CLOSES THE PAGE: the fee, a security note and the button
        on one line, so the last thing on the page is the transaction rather
        than a button on its own under white space.

   WHAT IS OURS AND IS NOT NEGOTIABLE: no radius (`--radius` is 0 by token and
   every corner in the build resolves through it), no shadows — panels are
   hairlines on `--layer-01` the way §41's calendar is — no violet, and the
   accent stays the ONE selection colour §10.29 reserves it for. The reference's
   three purple objects (the step numerals, the selected time, the send button)
   are our accent, our black and our `--brand-tint-2` respectively.

   WHAT IT REFUSES FROM THE REFERENCE, each for a reason this build already
   states somewhere:

     THE "TALENT AGENT" CHIP under the name. The crumb two rows above reads
     `Interviews › All agents › Priya Nair` and the page title is "Book Priya
     Nair" — the chip names the category the reader is already standing inside.
     §73's note refuses a social-proof row on the same test.
     THE MONTH CALENDAR. §41 is a whole layer arguing the opposite way and it
     argues it about this exact page: "a chip row answers 'which of these do
     you want' perfectly, which is the candidate's question in the booking flow
     and is where `.slot` belongs. It is not the agent's question." A month grid
     is the shape for "where are my gaps", which is the agent's own availability
     page. The other half is data: this agent has five open days and a month
     would be 26 cells of nothing, so the grid would have to invent
     availability — the one thing a redesign must not do (§74).
     WHAT IT TAKES INSTEAD is the reference's real point, that column one needs
     vertical mass or the rule between the two columns runs past nothing: the
     five days are a 3-across GRID rather than a scrolling strip, so the block
     is two rows tall and the days are in a shape.

   THE FIGURES ARE ALL READ, NEVER TYPED. `dayCount` is the enabled slots
   counted, not "6 available" copied off the reference — two of its six are
   struck through, so the reference's own chip disagrees with the grid beneath
   it. `daySel` names the day from the same tuple the strip is drawn from. The
   one literal on the page is the button's $695, which is Maryam's and is twice
   asked for; the note over the checkout row is where that stands.
   ========================================================================== */
V.agent = (f) => {
  const a = AGENTS[S.agent||'priya'];
  const rec = REC[S.agent||'priya'];
  /* THE DAY CARRIES ITS OWN LONG NAME. The strip prints `d` and `n`; the
     heading over the times prints `long` and the month. One tuple, so the two
     cannot name different Thursdays — which is the failure `bkStamp` exists to
     stop six prose mentions of the booking committing. */
  const days = [['Wed','Wednesday',19],['Thu','Thursday',20],['Fri','Friday',21],
                ['Mon','Monday',24],['Tue','Tuesday',25]];
  const dSel = 1;
  /* ------------------------------------------------------------------------
     THE MONTH GRID — Maryam, 31 Aug 2026, with the reference: "the calendar
     should follow the reference like dates and month look".

     THIS REVERSES §76'S OWN REFUSAL AND THE REFUSAL IS WORTH READING BEFORE
     REVERSING IT AGAIN. §76 declined the month on §41's argument — "a chip row
     answers 'which of these do you want' perfectly, which is the candidate's
     question in the booking flow" — and on the data: this agent has five open
     days, so a month is 26 cells with no availability behind them. The second
     half is answered rather than overridden: the 26 are drawn DISABLED, which
     is the reference's own treatment of its struck-out days and is a true
     statement about the month rather than an invented one. A month you cannot
     click 26 days of is a calendar telling you where the five are.

     IT IS AUGUST 2026, NOT THE REFERENCE'S AUGUST 2025, and the difference is
     load-bearing rather than cosmetic. The five open days are Wed 19, Thu 20,
     Fri 21, Mon 24, Tue 25 — which is August 2026 (Aug 20 2025 is a Wednesday,
     so the reference's own grid disagrees with its own strip). The weekday of
     every cell is read off `Date` rather than typed, so the grid cannot say
     Thursday over a column the strip calls Wednesday.

     THE MONTH NAME IS READ ONCE. `.bks-day` printed "August" as a literal 40px
     from a heading that would have printed its own; `CAL_MN` is both, so the
     two cannot name different months.

     THERE ARE NO ‹ › ARROWS AND THAT IS §60'S RULE, not an omission. Nothing in
     this build holds availability for July or September, so both controls would
     be permanently dead — "a dead control on a live surface is worse than a
     missing one". Real month navigation needs a second month of `days`.

     THE DOT UNDER A DATE IS THE REFERENCE'S AFFORDANCE USED HONESTLY. It draws
     one under the selected day only; here it marks every day with slots, so the
     five are findable before you press one, and it is derived from the same
     `days` array the cells are enabled from. */
  const CAL_Y = 2026, CAL_M = 7, CAL_MN = 'August';
  const calOpen = days.map(d => d[2]);
  const calSel  = days[dSel][2];
  const calLead = new Date(CAL_Y, CAL_M, 1).getDay();
  const calLast = new Date(CAL_Y, CAL_M + 1, 0).getDate();
  const calPrev = new Date(CAL_Y, CAL_M, 0).getDate();
  const calCells = [];
  for(let i = 0; i < calLead; i++) calCells.push([calPrev - calLead + 1 + i, true]);
  for(let n = 1; n <= calLast; n++) calCells.push([n, false]);
  while(calCells.length % 7) calCells.push([calCells.length - calLead - calLast + 1, true]);
  /* TAKEN AND CHOSEN ARE DATA, so the count under the heading is derived from
     the same array the grid is drawn from. §41's note is why the taken ones are
     still drawn rather than omitted. */
  const slots = ['9:00 AM','11:30 AM','2:00 PM','4:30 PM','6:30 PM','8:00 PM'];
  const taken = [0,5], sSel = 4;
  const open = slots.length - taken.length;
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
          <p class="rec-f"><span>${I.wallet}${a.price} Interview Fee</span>
            <span>${I.video}${(rec||{}).mins||'45 mins call'}</span></p>
        </div>
      </div>
      ${''/* THE THREE FACTS ARE THREE LINES, LABEL LEFT AND VALUE RIGHT
            (Maryam, 31 Aug 2026). They were a name over a value with a 28px
            tinted chip beside the pair — §65's figure cell, which is the shape
            for a number you SCAN against the two beside it. These are not that:
            they are three different questions with one answer each, and an
            answer belongs on the line of its question. Stacked, the eye read
            six lines to get three facts.

            THE CHIP WENT AND THE GLYPH STEPS 16 -> 20, which is exactly the
            trade §72 made for the pulse's column marks: "the hue survives and
            the wash goes; the glyph steps because it now holds the line alone".
            The reason is the same one, one page over — three filled squares in
            a column of three rows are the heaviest objects in a block that no
            longer has a border round it, and a chip on a row is a box on a
            line rather than a mark in front of one.

            THE THREE ROWS ARE ONE WIDTH AND IT IS THE WIDEST ROW'S, which is
            the whole of what makes the right edge read as an edge. §76 sizes
            the grid track with `fit-content()` rather than a fixed `minmax()`,
            so the column is exactly as wide as "Report turnaround / Within 24
            hours" needs and the other two stretch to it. A fixed track would
            either clip that row or leave the other two ending short of it.

            THE HUES ARE NAMED, NOT CYCLED — §65's and §72's rule both. The fee
            is `--mk-1` on both this page and anywhere else these three appear,
            so a fact cannot change colour by moving position.

            THE LABEL IS THE STRONG ONE AND THE VALUE IS THE QUIET ONE, which
            inverts `.kv` and `.stat` both and is §73's argument kept verbatim
            through the turn onto one line: these are three different things,
            so what you scan is the names. The fee is the one accent string,
            because it is the only one of the three that is a decision. */}
      <div class="bkp-r">
        ${[[I.wallet,   'Interview fee',    a.price, 1],
           [I.time,     'Length',           '45 minutes, recorded'],
           [I.document, 'Report turnaround','Within 24 hours']
          ].map(([ic,lab,val,acc],i)=>`<div class="bkp-f" style="--mk:var(--mk-${i+1})">
          <i class="bkp-fi">${ic}</i>
          <span class="bkp-fl">${lab}</span>
          <span class="bkp-fv${acc?' bkp-fv-acc':''}">${val}</span>
        </div>`).join('')}
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
  <div class="bks-w">
    <div class="bks">
      <div class="bks-c">
        <div class="bks-h"><span class="bks-n">1</span><h3>Choose a date</h3></div>
        ${''/* THE CELL KEEPS `.day` SO THE SELECTION KEEPS WORKING. views.js's
              own delegated handler is `t.closest('.day')` — it clears `.on`
              across every `.day` in the device and sets it on the one pressed —
              so an open date wearing that class is selectable for free, and
              §10.29's accent fill is what draws it. Re-creating either is the
              mistake §75's note records about `.rec-lab`.

              AND ONLY AN OPEN DATE WEARS IT. The 26 closed ones and the six
              adjacent-month ones are `.bkd` alone and `disabled`, so the
              handler cannot see them and there is no state to clear. That is
              also what keeps the class honest: `.day` means "a day you can
              book" on this page exactly as it does on every other.

              THE DISC IS A STATED EXCEPTION TO `--radius` (§76). Every
              `border-radius` in the build resolves through a 0px token; §56
              grants marks the one curve this system allows, and a date numeral
              in a 7-column grid is a mark. A square accent fill on one cell of
              42 reads as a filled table cell, which is the thing the tick-mark
              lattice already means somewhere else. */}
        <div class="bkcal">
          <p class="bkcal-m">${CAL_MN} ${CAL_Y}</p>
          <div class="bkcal-w">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
            .map(d=>`<span>${d}</span>`).join('')}</div>
          <div class="bkcal-g">${calCells.map(([n,out])=>{
            const open = !out && calOpen.includes(n);
            return `<button class="bkd${open?' day':''}${out?' bkd-out':''}${
              open&&n===calSel?' on':''}"${open?'':' disabled'}>${n}</button>`;
          }).join('')}</div>
        </div>
      </div>
      <div class="bks-c">
        <div class="bks-h"><span class="bks-n">2</span><h3>Choose a time</h3>
          <span class="bks-tz">${I.time}Times in ET</span></div>
        ${''/* THE COUNT IS COUNTED. The reference prints "6 available slots"
              over a grid in which two of the six are struck through, so its own
              chip disagrees with the thing it labels by two. `open` is
              `slots.length - taken.length`, so the pill cannot drift from the
              grid however either changes. */}
        <p class="bks-day"><b>${days[dSel][1]}, ${CAL_MN} ${days[dSel][2]}</b>
          <span class="bks-cnt">${open} available slots</span></p>
        <div class="slots bks-slots">${slots.map((t,i)=>
          `<button class="slot ${i===sSel?'on':''}" ${taken.includes(i)?'disabled':''}>${t}</button>`).join('')}</div>
        ${''/* WHAT THE THING YOU ARE BUYING ACTUALLY IS. The reference puts it
              here and it is the one piece of its copy the product can stand
              behind without inventing anything: `V.booking`, `CALL` and the
              `booked` dashboard all already say this interview is a video call,
              and `callOpen('iv')` is the surface it opens. It sits under the
              times because that is the moment the abstraction — "a slot" —
              becomes a thing that happens to you on a Thursday evening. */}
        <div class="bks-note"><i class="bks-ni">${I.video}</i>
          <span class="bks-nb"><b>Video interview</b>
            <span>You&rsquo;ll join a video call with ${a.n.split(' ')[0]}.</span></span></div>
      </div>
    </div>
    ${''/* THE TIMEZONE IS SAID ONCE NOW (Maryam, 31 Aug 2026). "All available
          times are in Eastern Time (ET)" stood under the picker as well as
          `.bks-tz` on the column heading, and the argument for keeping both —
          that "ET" beside the numbers is not enough for a reader who does not
          know the abbreviation — did not survive the row being read: the
          sentence sat below the grid it qualifies, so a reader who needed it
          had already read the times. The tag stays, because it is beside them.
          `.bks-foot`'s rules go with the markup rather than being left as the
          "gate nothing writes" tell — §76 and §63 both. */}
    ${''/* NO SCARCITY LINE (Maryam, 31 Aug 2026). "Two other candidates are
          looking at Thursday. Slots are held for 10 minutes once you continue."
          was two claims and the product can stand behind neither: nothing in
          the build counts who is looking at a day, and no timer holds anything
          — pressing Continue goes to a payment screen that waits indefinitely.
          A countable-strangers line under a picker is a pressure device, and
          §59 is a whole layer arguing that this product spends urgency only
          where urgency is real. THE REFERENCE HAS NONE EITHER, which is worth
          recording: the pressure it applies is "6 available slots", and that is
          a count of a real thing. */}
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
  <div class="bkc">
    <div class="bkc-fee"><span class="bkc-fl">Interview fee</span>
      <span class="bkc-fv">${a.price}</span></div>
    <button class="btn btn-p" data-go="booking">Proceed to pay $695 ${I.arrowRight}</button>
  </div>
  </div>
</div></main>`;
};

/* `.stickybar` IS NOW DRAWN BY NOTHING IN THIS PORTAL, AND ITS RULES STAY.
   The class had one call site — the bar removed above — so eight layers
   (§10, §11, §15, §16, §21, §29, §37, §63) now hold a family the product
   never writes. That is deliberate and is NOT the "a gate nothing writes"
   tell CLAUDE.md warns about: that test is for a component shipped without
   the JS its behaviour needs, and `.stickybar` is complete CSS for a
   self-contained shape a hand-authored page on `design-system/` can still
   use. Include-by-default says an unused rule costs a rule; deleting it
   across eight layers costs the cascade positions those layers argue for.
   `.app:has(.stickybar)` in §21 and §16 simply never matches, which is what
   gives the ask dock its own foot of the frame back. */

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

/* ==========================================================================
   WHO LEADS YOUR COHORT — ONE RECORD, READ FROM BOTH PORTALS
   ==========================================================================
   Priya Nair is a talent agent in `AGENTS` and a cohort leader in `LEADER`
   (lead.js), and the candidate side needs the second of those before it has
   ever seen the first file: the Enroll page and the enrolment confirmation
   both introduce her, and either can be the boot render off a hash.

   `LEADER` CANNOT BE READ FROM HERE. lead.js parses AFTER this file and after
   the boot `render()` at the foot of it, so `#assessed/enrol` in the address
   bar would reach it in the temporal dead zone — the same hazard `notifList`
   guards `LEAD_NOTIF` against with a `typeof`. So the shared facts are stated
   in the EARLIER file and lead.js reads them off this record; one place says
   how long she has been leading, and the leader's own profile page and the
   candidate's enrolment page cannot disagree about it.

   IT IS NOT A SIXTH ENTRY IN `AGENTS`, for the reason `CONSULTANT`'s note in
   data.js gives about the consultant: `AGENTS` carries a price, a rating and
   an interview count, and every one of those is a claim about the AGENT she
   also is. A cohort leader is unpaid, is not rated and interviews nobody.
   ========================================================================== */
const COHORT_LEAD = {
  n:'Priya Nair', i:'PN', img:AV.priya,
  since:'March 2024',
  /* the literal en dash rather than `&ndash;`, which is what `AGENTS` writes
     for the same field — every reader of it drops it into innerHTML, and one
     of the two spellings would eventually be compared against the other */
  range:'E1–E3',
  /* WHAT SHE IS EXPERT IN — 600:7748, added for §71's call row.
     `REC.priya.expertise` (above `talRec`) carries the same three words and
     that is not a duplicate to fold together: `REC` is what is true of this
     candidate's overlap with an AGENT they might book, and this is what is true
     of the cohort LEADER they have been assigned. The two happen to be the same
     person in the prototype and would not be in a real cohort — Priya assesses
     E1–E3 as an agent AND leads Cohort 41, which is why she has a row in both
     objects at all. Change one and read the other before assuming it follows.

     A JS-side reference cannot be used the other way round either: `REC` is
     declared ~1700 lines above this and evaluates at parse time, so it could
     not read a field stated here. */
  expertise:'System Architecture',
  /* AND THERE IS NO BIO FIELD, WHICH WAS A DECISION AND THEN A REVERSAL.
     A sentence in her own voice about how she runs the call was written here
     and cut on Maryam's read, 28 Aug 2026 — with the logistics rows gone too
     (see `leaderCard`) the card is the person and nothing else, and on a page
     whose job is to get somebody to the payment screen a paragraph of
     first-person copy is the block that stops them.

     `AGENTS.priya.bio` STAYS WHERE IT IS AND IS STILL NOT REUSED. It is the
     agent's pitch — how she sets a level in a 45-minute interview — and it is
     drawn on `V.agent`, which is a page for CHOOSING somebody. A cohort leader
     is assigned, so there is nothing here to choose between and nothing for a
     pitch to do. */
};

/* THE LEADER AS A CARD, ON THE TWO PAGES THAT INTRODUCE HER.
   `row-lead` + `.kv` is the shape `V.booking` already uses to say who you have
   just paid to spend time with, and this is the same moment one product step
   later — so it is that component rather than a new one.

   IT IS A LIGHT TILE AND NOT A `.plate`, WHICH IS TRAP 12 RATHER THAN TASTE.
   `.plate` is in `DARK_CARD`, so `placeDark` would lift it into the head band;
   the Enroll page already puts the checkout there and one dark card per page
   is the rule that note states. It is also the wrong claim — a plate is "the
   one thing to do next", and there is nothing to do about Priya until the 90
   days start.

   `co` NAMES THE COHORT AND IS ONLY PASSED ONCE. Before the payment clears
   there is no cohort to name (`PAGESUM.payment`: "your cohort is assigned as
   soon as it clears"), so the Enroll page calls this with nothing and the
   confirmation calls it with 41. */
/* `lab` IS A SECOND ARGUMENT AND NOT A SECOND FUNCTION. The confirmation draws
   this card beside a second one and the reference labels each inside its own
   box; the Enroll page draws it inside the head band, where the section already
   says what it is. One optional line rather than a `bare` variant, because the
   only thing that differs is whether the card names itself. */
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

/* THE TWO CHAPTERS THE REPORT NAMES, LOOKED UP RATHER THAN NUMBERED.
   `signedSummary` closes on "Chapters 4 and 12 are built on exactly this", and
   `QZ_CH` (§61) is the precedent for how a number like that is arrived at: the
   SUBJECT is what is written down and `CH.findIndex` supplies the number, so
   renaming or reordering a chapter cannot leave two pages naming different
   ones. `GROWTH` (data.js) is not this list — it holds three indices and is
   what `chRow` stamps "Your growth area" on; the report names two of them. */
const RPT_GROWTH = ['Delegation Without Drop-Off','Coaching vs Fixing']
  .map(t => CH.findIndex(c => c[0] === t));

/* ==========================================================================
   THE PAGE THAT ASKS FOR $595 PUTS THE $595 IN THE HEAD BAND
   ==========================================================================
   The fee was a three-row `.kv` tile 860px down the page with the only button
   on the screen under it, so on a desktop frame a reader arriving from "Enroll
   now" saw a title, a Tal card, four figures and a grey note before anything
   told them the price or gave them a way to pay. Everything above the fold was
   context for a decision the page never got round to putting.

   So the money is the page's DARK CARD and `placeDark` puts it in the band's
   second column, beside the title — the same slot the `assessed` dashboard's
   enrolment offer occupies, one step on. The offer card sells the course; this
   one is the checkout, and it is the only place on the page the three figures
   appear.

   IT IS QUIET BY CONSTRUCTION AND THAT IS CORRECT (§59). `plateUrgent` returns
   false for a card with no clock on it, so this takes the light ground and the
   vertical rule rather than the black wall. Enrolling has no deadline: the
   cohort's start date is a fact on the card, not a countdown, which is the
   argument `ENROL_OPENS` was written to settle and this reuses verbatim rather
   than restating.

   THE THREE ROWS ARE AN INVOICE, NOT A SPINE OF SUBJECTS. Written as
   `Label <b>figure</b>`, which `splitPlateBody` (ai5) lifts into `.plate-v`;
   because EVERY row here ends in a figure the pass marks the list `.plate-tab`
   and drops the subject marks, since three wallet glyphs in a column say the
   same word three times. §69 rules the total off and §63 keeps the accent for
   the figure that is actually due. The note over `splitPlateBody` is where
   that rule is stated.
   ========================================================================== */
const ENROL_CREDIT = {E3:'Interview already paid', E4:'Returning candidate credit'};
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
  ${crumb(['Dashboard','dashboard'],next?'Next course':'Enroll')}
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
  ${next?'':`<div class="sec head-sec">
    <div class="sec-h"><h2>Your cohort leader</h2></div>
    ${leaderCard()}
  </div>`}
  ${''/* THE HAND-WRITTEN TAL CARD IS GONE AND NOTHING IS LOST WITH IT.
        Per trap 11 `placePageSummary` strips a page's Tal card back to its
        label and replaces the heading and the body with `PAGESUM.enrol`, so
        "What the 90 days ask of you" and its sentence were never on screen —
        and the ask chip beside it was removed by the same pass's step 1b. The
        pass BUILDS the card when a page has none, which is what `V.payment`
        has always relied on. The words live in `PAGESUM.enrol`. */}
  ${checkoutPlate(lvl)}
  ${''/* THE ORDER OF THIS PAGE IS THE ORDER OF THE QUESTIONS, and it was
        settled by reading it rather than by argument (Maryam, 28 Aug 2026).
        The band answers "what is this and what does it cost" before anything
        scrolls. Then, in the column: WHO you would be doing it with, WHAT you
        would learn, HOW the cohort runs, and last the four figures that recap
        all three. The person leads because she is the only thing on the page
        that is not a fact about a product; the mechanics sit under the
        curriculum because nobody asks how a cohort works before they know
        what is in it, which is also why they are behind a disclosure. */}
  ${''/* WHAT YOU LEARN IS THIRTEEN CHAPTERS, AND IT IS ALL THIRTEEN.
        This was four `chRow`s and an "All 13" button. Both halves were wrong.
        `chRow` draws a chapter's PROGRESS — "Not started &middot; 45 min" — on
        a page for somebody who has not bought the course, so the one thing
        every row said about itself was that nothing had happened yet; and the
        button went to `coursework`, which is the LightspeedVT frame and is
        empty until you are enrolled, so the way to see the other nine was a
        blank screen.

        `.ch-two` is the flat form the `assessed` dashboard already uses — a
        number, a title, a length, no state — and all thirteen of them fit in
        two columns. The dashboard's block ends on "See the full course" and
        points here, so this page has to be the fuller one; it is, by the
        section under it.

        THE OPT-OUT IS `> .all-desc` (§16, trap 13). `.ch-two` is not in
        §10.15's list, so the lede is what keeps this section out of the 184px
        label column, and it has to stay a DIRECT child of the `.sec`. */}
  <div class="sec">
    <div class="sec-h"><h2>What you&rsquo;ll learn</h2></div>
    <p class="all-desc">Thirteen chapters, one a week, 45 to 70 minutes each. Every one closes with an assessment, and the average of the thirteen is what an agent reads at your re-interview.</p>
    <div class="ch-two">${CH.map((c,i)=>`
      <div class="ch ch-flat">
        <span class="ch-num">${String(i+1).padStart(2,'0')}</span>
        <span class="ch-b"><span class="ch-t">${c[0]}</span><span class="ch-s">${c[1]} min</span></span>
      </div>`).join('')}</div>
    ${''/* AND TWO OF THE THIRTEEN ARE THIS READER'S, WHICH IS THE ONLY THING
          ON THE PAGE THAT IS NOT TRUE OF EVERYBODY. It closes the section for
          the reason the dashboard's report block closes its own: read after
          the list, the thirteen stop being a catalogue and become the answer
          to what Priya wrote down.

          ONLY ON THE FIRST COURSE. At `promoted` the report is the
          re-interview's and it names chapters 3 and 9 of the E4 curriculum —
          a curriculum this page does not list, since `CH` is E3's. Naming a
          number against the wrong list is worse than saying nothing. */}
    ${next?'':`<div class="note mt5"><span>${I.certificate}</span><div class="nb"><b>Two of these are yours by name</b>Priya&rsquo;s report names delegation, and coaching rather than fixing. Chapter ${g1+1}, ${CH[g1][0]}, and chapter ${g2+1}, ${CH[g2][0]}, are built on exactly that.</div></div>`}
  </div>
  ${''/* AND THE MECHANICS ARE A DISCLOSURE, ON THE SAME COMPONENT AS "WHAT THE
        INTERVIEW FOUND" — Maryam's ask, and the same argument holds: six rows
        of how-it-works is the longest block on the page and it is the one part
        a reader who has already decided does not need. `foundHead`'s note is
        the long version; the key is `cohort` so the report's disclosure on the
        dashboard keeps its own state.

        THE LEDE STAYS OUTSIDE `.found-b`. §65 hides the panel and nothing
        else, so a closed disclosure is normally a heading on its own; here the
        one line that answers "what IS a cohort" is visible shut, and what
        expands is the detail. Somebody who has read it once never opens it
        again and still knows what the block says.

        NO MEMBER LIST. Ten faces here would be a claim the product has not
        made — the cohort is assigned when the payment clears, which is the
        last row in the panel. `V.cohort` is where the ten people are. */}
  <div class="sec tint cards found${discOpen('cohort')?' on':''}">
    ${foundHead('How your cohort works','','cohort')}
    <p class="all-desc">Ten people at Explorer &ndash; ${lvl}, the same ten for all 90 days, with one live call a week.</p>
    <div class="found-b">
      <div class="kv mt5"><span class="k">Who is in it</span><span class="v">Up to ten candidates, all at your level</span></div>
      <div class="kv"><span class="k">Who leads it</span><span class="v n">A volunteer, certified by TalentNext and unpaid</span></div>
      <div class="kv"><span class="k">The weekly call</span><span class="v n">Thursdays, 6:00 PM ET &middot; 60 minutes, not recorded</span></div>
      <div class="kv"><span class="k">Between calls</span><span class="v n">A discussion board the whole cohort can see</span></div>
      <div class="kv"><span class="k">If you miss one</span><span class="v n">Nothing is marked &mdash; your leader posts what was covered</span></div>
      <div class="kv"><span class="k">Which cohort</span><span class="v n">Assigned by your level and start date, not chosen</span></div>
    </div>
  </div>
  ${''/* THE STRIP KEEPS ITS FOUR CELLS AND GAINS A HEADING. `.stats` is a
        fixed four-column grid (trap 13's opt-out list, so no label column) and
        these are the four figures the fee buys that the card does not state.
        Unheaded it was a row of numbers floating under a title. */}
  <div class="sec">
    <div class="sec-h"><h2>What you get</h2></div>
    <div class="stats">
      ${statCell(I.book, `Chapters`, `13`, `one a week`)}
      ${statCell(I.video, `Live calls`, `13`, `60 min, weekly`)}
      ${statCell(I.group, `Cohort size`, `10`, `max, all at ${lvl}`)}
      ${statCell(I.calendar, `Re-interview`, `Day 91`, `then you move`)}
    </div>
  </div>
</div></main>`;
};

V.payment = (f) => `<main class="main"><div class="page">
  ${crumb(['Enroll','enrol'],'Payment')}
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
    ${''/* PAYING LANDS ON THE CONFIRMATION, NOT ON DAY 4 OF THE COURSE.
          This was `stage:week1` — the dashboard in the middle of the 90 days,
          with a chapter already unlocked and a call in two days, which is a
          strange place to be thirty seconds after paying and confirms nothing.
          `V.welcome` is the receipt and it is what advances the stage. Same
          shape as the interview's `data-go="booking"` two hundred lines up. */}
    <div class="mt5"><button class="btn btn-p" data-go="welcome">Pay $595 and start ${I.arrowRight}</button></div>
    <p class="t-legal-01 mt5" style="color:var(--text-helper)">Full refund up to 7 days after your cohort starts, provided you have not completed more than one chapter.</p>
  </div>
</div></main>`;

/* ==========================================================================
   PAYING IS NOT ARRIVING — THE CONFIRMATION IS ITS OWN SCREEN
   ==========================================================================
   "Pay $595 and start" went straight to `stage:week1`, which is the dashboard
   on day 4 of the 90: "Welcome back, Maryam", a chapter open, a progress strip
   and a cohort call in two days. Thirty seconds after paying that page is
   wrong twice over — nothing on it says the payment went through, and it opens
   in the middle of a course the reader has not started.

   The pattern is `V.booking`'s and its note is the argument: a confirmation is
   a RECEIPT, read once, immediately after paying, to check that what happened
   is what was meant to happen. So this answers four things and stops — you
   paid, you are in a cohort, here is who runs it, here is what happens next —
   and the last control on it is the way to the dashboard.

   IT DOES NOT MOVE THE STAGE, which is `V.booking`'s behaviour rather than an
   omission: the confirmation renders in the stage you paid from and the button
   at the foot is what advances it. So the rail still shows the `assessed` set
   while this is open. That is correct — Coursework, Cohort and Messages open
   when the 90 days do, not when the card clears.

   AND IT IS THE FIRST PLACE THE COHORT HAS A NUMBER. Before the payment clears
   there is nothing to name, which `PAGESUM.payment` says in as many words
   ("your cohort is assigned as soon as it clears") and which is why the Enroll
   page is careful not to name one. This page is the other side of that
   sentence, and naming it is most of what makes it a welcome.

   NO DARK CARD, so the head band is the title, the fact row and Tal. `.plate`
   is "the one thing to do next" and there is nothing to do here: the chapter
   does not open for weeks and the call is after that. `V.booking` has none
   either, for the same reason its note gives about the calendar button.
   ========================================================================== */
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
  ${''/* NO FACT ROW HERE EITHER — see the note over `V.payment`'s header. This
        was the closest reprint of the dashboard's own three: "Explorer Track –
        E3 · Cohort 41 · day 34 of 90" against the dashboard's "Explorer Track –
        E3 · Cohort 41 · week 5 of 13", the same two facts and the same clock in
        a different unit. The day, the week and the percentage are what the
        progress strip on this page draws, at the size a figure should be read
        at, and Tal's summary opens on where you stand. */}
  ${ph('Course Progress')}
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
  ${''/* THE WEEK-BY-WEEK MINUTES ARRIVED HERE FROM THE DASHBOARD, and this is
        the page that page's promoted branch has claimed they were on since it
        dropped its own copy of them: "The chart is still on Course Progress,
        which is where the week-by-week record belongs and which the heading
        links to." That was not true when it was written — `stackChart` had
        exactly one caller, the enrolled dashboard — and it is true now.

        IT COMES BECAUSE IT COULD NOT BE A COLUMN. `pulse` compresses the
        dashboard's three panels into three columns and the pace one carries
        the time data as a WEEK PROGRESS read: this week against the target, or
        once the 90 days are over the whole course against thirteen of them.
        What that cannot carry is the four-series split — video, reading,
        roleplay, assessment — and the thirteen weeks side by side, which is a
        RECORD rather than a position. The distinction is the one the dashboard
        already drew between the progress strip and this chart, one step on:
        the position is at the head of the dashboard, the record is here.

        IT SITS UNDER THE SCORES, NOT OVER THEM. Both are thirteen-slot charts
        of the same 90 days and the scores are the sharper reading — what you
        got — so the minutes follow as the working behind it. `f.done` gates
        both: with nothing finished there is no record to draw and week 1's
        single 20-minute bar in a thirteen-slot frame is an empty chart with a
        mark in the corner. */}
  ${f.done && GAME[S.stage]?`<div class="sec">
    <div class="tile" style="padding-top:var(--s05)">
      ${stackChart('wk',{title:'Time on the course',sub:'minutes each week',weeks:GAME[S.stage].weeks,
        target:WEEK_TARGET,targetLabel:WEEK_TARGET+' min target'})}
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
  ${f.done>0?certCard(f):''}
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
      <div class="row-lead">
        ${avatar(COHORT_LEAD,48)}
        <div style="flex:1">
          <div class="t-heading-compact-01">${COHORT_LEAD.n}</div>
          <div class="t-helper-01 mt3">Cohort leader &middot; leads Cohort 41</div>
          <p class="rec-x mt3"><b>Expertise:</b> ${COHORT_LEAD.expertise}, assesses ${COHORT_LEAD.range}</p>
        </div>
        <button class="btn btn-t btn-sm noic" data-go="messages"
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
  <div class="sec sec-call">${crow('cohort')}</div>
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
    <div class="sec-h"><h2>Saved cards</h2>${S.cards.length<3?`<button class="btn btn-t btn-sm noic ic-l sec-h-act" data-addcard="1">${I.add}Add a card</button>`:''}</div>
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
      ${/* THE CONFIRM WORD IS SENTENCE CASE AND THE CHECK ALREADY ALLOWED IT.
            This was the one string in the build that was typed in capitals
            and rendered — §63 takes case off everything else, but no
            stylesheet can un-shout a word that was written shouting. It is
            safe to change because `ai3.js` tests
            `v.trim().toUpperCase() === 'DELETE'`, so the field has always
            accepted any casing; only the instruction was in capitals, and a
            capitalised instruction beside a lowercase-accepting field was
            telling the reader to do something the form did not require. */''}
      <div class="f mt5"><label for="delc">Type Delete to confirm</label><input class="inp" id="delc" placeholder="Delete" autocomplete="off"></div>
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

/* ASKING FOR ANOTHER AGENT — the one interaction on the recommendation block.
   It sets a flag, paints, and comes back four and a half seconds later with the
   next agent in `REC_ORDER`. Three things it deliberately is not:

   NOT A ROUTE INTO TAL'S THREAD. The link carried `data-tal-ask` for one build,
   which opened the conversation with the question typed in. That is the right
   answer for "what is Priya like to be interviewed by" and the wrong one here —
   the reader is not asking to talk, they are asking for a different card, and
   the answer belongs where the card is.

   NOT `requestAnimationFrame` — trap 17. rAF never fires in a hidden document
   and this prototype is usually read in a pane that reports itself hidden, so a
   frame loop would leave the skeleton up for ever in exactly the case nobody
   would think to test. `setTimeout` is throttled in the background but it
   arrives.

   AND NOT UP BESIDE `talRec`, WHICH IS WHERE IT WAS WRITTEN AND WHERE IT BLANKS
   THE PAGE. `device` is `const`, declared on the line above this one, so a
   listener registered at the top of the file reads it in the temporal dead zone
   and throws before the first render — the whole app comes up empty, which is
   the hazard the note over `COHORT_LEAD` records for `LEADER`. Handlers go with
   the other handlers, under the declaration. */
/* ASKING FOR ANOTHER AGENT — the one interaction on this block.
   It sets a flag, paints, and comes back four and a half seconds later with the
   next agent in `REC_ORDER`. Two things it deliberately is not:

   NOT A ROUTE INTO TAL'S THREAD. The link carried `data-tal-ask` for one build,
   which opened the conversation with the question typed in. That is the right
   answer for "what is Priya like to be interviewed by" and the wrong one here —
   the reader is not asking to talk, they are asking for a different card, and
   the answer belongs where the card is.

   NOT `requestAnimationFrame` — trap 17. rAF never fires in a hidden document
   and this prototype is usually read in a pane that reports itself hidden, so a
   frame loop would leave the skeleton up for ever in exactly the case nobody
   would think to test. `setTimeout` is throttled in the background but it
   arrives. */
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
      <svg class="tile-arrow" viewBox="0 -960 960 960">${inner('arrowRight')}</svg>
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
/* ==========================================================================
   WHAT THE INTERVIEW FOUND — three findings, three hues

   THE BLOCK WAS FOUR PARAGRAPHS AND TWO GREY LABELS. Priya's write-up is the
   only thing on the `assessed` dashboard a candidate READS rather than acts on,
   and it was set as continuous prose: "Strengths", a paragraph, "Growth areas",
   a paragraph, then her note in a `.note band`. Nothing in it said that the
   three are three different KINDS of finding — what you are good at, what you
   are not, and what the assessor thought — so the block read as one long
   sentence about you and the two things a reader actually wants to compare sat
   400px apart in one column.

   THREE CARDS, THREE NAMED HUES, TWO ABREAST: green for the strengths, violet
   for the growth areas, blue for the note. §29's argument, which §65 and §72
   both apply: "four readings drawn in one colour look like four instances of one
   thing; four hues say these are different measurements before you have read a
   word of them." Strengths and growth areas are a PAIR and share a row, because
   the whole point of the two is that you read one against the other; the note is
   about both and takes the width under them.

   NOT ORANGE, AND THAT IS THE POINT (Maryam, 31 Aug 2026: "do not go for orange
   color only"). The accent is Tal's voice and the page's one CTA — it is spent
   twice on this page already. These three are the product reporting what a
   PERSON found, which is not Tal speaking, so they take the three marker hues
   §12 defines and §29 cycles.

   AND THE SECTION GOES WHITE, WHICH IS THE DECISION THE TINT FORCED. The block
   lives in a `sec tint cards` — #F7F7F7 — and a 5%-tinted card on a 4% grey
   ground is two washes a shade apart: the green and the violet disappeared and
   the row read as three empty boxes. Two ways out, and taking the panel to white
   is the better one, for the reason `quizResults` records when it made exactly
   this swap: "the cells were already WHITE — that is the whole of what `cards`
   did — so the panel was a 16px frame of #F7F7F7 around four white boxes." Here
   the cells are not white, they are tinted, and the frame was the thing stopping
   them from reading. White panel, coloured cards.

   WHAT IT DOES NOT TAKE FROM THE REFERENCE. A "Key takeaways" strip of three
   more claims — "Clear decision maker", "People impact", "Ready to grow" — and
   an orange planet. The first is three sentences of new product copy about a
   candidate that no data in this build supports, which is the one thing a
   redesign must not invent; the second is decoration on the block that is meant
   to be read. The tags it DOES take, "Strong" and "Focus", are labels on
   findings that already exist rather than new findings.
   ========================================================================== */
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
        <span class="signed-b"><span class="sig-hl">Assessed and signed by</span><b>Priya Nair</b></span>
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
      ${footAction?`<div class="ai-foot signed-foot"><button class="btn btn-t btn-sm noic" data-go="report">Read the full report ${I.arrowRight}</button></div>`:''}
    </div>`;
}

/* ==========================================================================
   THE QUIZ RESULT BLOCK IS OFF THE DASHBOARDS — Maryam, 31 Aug 2026

   `quizResults` is DELETED, not orphaned: it had two callers left, `consult`
   and `booked`, and both are gone. `new` had already replaced it with a Quick
   Action pointing at `V.result` when §70 rebuilt that page (the note over
   `quickActions` makes the same argument this one finishes), so what happened
   here is that decision applied to the two stages it had not reached.

   WHY. The block was ~500px of figures at the FOOT of a dashboard, and none
   of the four is news by the time you scroll to it:

     Title given · Explorer   the `.ph` fact row prints "Explorer track" at
                              the top of the same page, and the journey step
                              beside it says the same thing again.
     Quiz score · 64/100      Tal's summary states it in the band, in a
                              sentence that also says what it is FOR.
     Taken · 12 Aug           a date the reader has no decision to make about.
     Level · Not set          the whole of what every one of these pages is
                              already about, printed as a fourth figure.

   Four settled facts under a heading, at the end of a page whose job is the
   one thing that is NOT settled, is the product answering a question nobody
   asked twice as loudly as the one it did.

   NOTHING IS ORPHANED AND `V.result` IS UNCHANGED. The breakdown page §61
   built still holds all five bands, the rose, the two weakest against their
   chapters — everything the block's "See full breakdown" button went to — and
   there are still three ways in: the `new` dashboard's Quick Action
   (`quickActions`, `data-go="result"`), the `quiz` card behind the summary's
   own phrase (`SUMDROP.quiz`, ai6.js), and the NIL microsite's Verify &
   continue. That is the trade this makes: the figures stop being printed on
   three pages that have moved past them, and stay on the one page that is
   about them.

   `qzTaken()` STAYS AND STILL HAS READERS. Its own note below says "all three
   `quizResults` call sites"; that half is now historical — `V.result` and the
   `quiz` summary card are what read it, and they still must not disagree.

   THE ARGUMENT THE FUNCTION CARRIED IS KEPT BELOW, because two of the three
   parts of it are about `.stat` and the canvas rather than about the quiz,
   and both are live decisions somewhere else.
   -------------------------------------------------------------------------
   THE ORIGINAL NOTE, for the record:

   THE QUIZ RESULT, ON EVERY DASHBOARD STAGE THAT STILL HAS NO LEVEL
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
/* THE TWO TINTS THIS BLOCK USED TO WEAR, kept in one sentence because both are
   one step off white and mixing them up is easy: §12's `.tint` is #F7F7F7, the
   ground for "a section the reader is meant to treat as one object", and §45's
   `.tint.info` is #FBFBFB, for a section that should RECEDE. §45 works by
   declaring `--surface-2` ON the element, so §12's twenty-odd `.sec.tint`
   selectors follow whichever value is in scope — which is why `.info` is never
   written without `.tint`. Neither is on this block any more; see below. */
/* THE QUIZ BLOCK IS WHITE — Maryam's call, and it settles a tone that had
   oscillated four times. The block has worn `tint info` (#FBFBFB, §45's
   "background reading"), then `tint cards` (#F7F7F7 with white cells, §55),
   then plain white for one build, then `tint cards` again. It is the canvas
   now, and it stays there.

   WHAT THE PANEL ARGUMENT WAS, because it is the one that will be made again.
   §12's test for a panel is "a section the reader is meant to treat as one
   object", and four figures under one heading are exactly that; the pair
   argument came with it — on the booked dashboard this block closes the page
   under "Your session, step by step", and two sections in a row cannot both be
   filled or the page reads as panels all the way down, so one takes the ground
   and the other takes the canvas.

   WHAT IT MISSED. The pair rule only bites when both are filled, and the fix is
   symmetrical: neither filled is as good an answer as one filled, and it is the
   better one here. The cells were already WHITE — that is the whole of what
   `cards` did — so the panel was a 16px frame of #F7F7F7 around four white
   boxes, which is a ground doing nothing but outline a grid the 1px gaps
   already draw. On white the same four cells read the same way and the block
   stops claiming to be a summary you treat as one object, which is right: a
   title, a score, a date and a level are four facts with four icons.

   `cards` GOES WITH `tint` AND HAS TO. Every §55 selector is
   `.sec.tint.cards` — the class is a correction TO the panel, so on the canvas
   it is inert. §55 keeps two live users (the interview and re-interview digests
   on `assessed` and `promoted`), so nothing there is orphaned.

   AND THE SECTION ABOVE GETS ITS RULE BACK, which is the one visible knock-on.
   §55.2 takes the closing hairline off whatever sits above a `.cards` block on
   the stated ground that "the ground changes at that line, and a change of
   ground is already a boundary". With no change of ground there is no boundary,
   so the hairline is the boundary again — and it comes back on its own, because
   that selector simply stops matching.

   ALL THREE STAGES, because this is one function and the block is the same
   block. `consult`, `new` and `booked` print the same four figures.
   ========================================================================== */
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
   badges are a count out of four, rank is where those two put you.

   THE MARK IS THE CLIENT'S AWARD ARTWORK, AND IT CAME BACK (Maryam, 31 Aug
   2026). A glyph mode was added for the pulse on the reasoning that the WebPs
   are the only photographic objects in that section and that two of the three
   rows describe an award you have NOT won yet. Maryam's call is the artwork,
   smaller — which also restores `ACH`'s own argument for it: "you earned a
   specific shield, and a generic glyph of a shield is a picture of the category
   instead." §72.4 sizes it down to 24 inside the pulse; the parameter and the
   three icons are gone rather than left unused, because a mode nothing asks for
   is the "gate no caller writes" tell. */
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
  const OVERLAYS = ['nav','notif','acct','tal','editProfile','editPhoto','addCard','notes'];
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

  /* CLICK AWAY CLOSES THE ACCOUNT MENU, AND IT IS THE FIRST THING IN HERE.

     The other two overlays do not need this. `.sidenav` has a `.scrim` to
     press and the notification panel carries its own close — a 360px panel
     with a heading can afford one. A two-row menu hanging off a 32px face
     cannot: a control that has to be dismissed by finding the same 32px
     square again is a control the reader has to aim at twice.

     IT DOES NOT `return`, AND THAT IS THE DIFFERENCE FROM THE STEPS PANEL
     LISTENER IT REPLACES (see the note above this one). A press outside the
     menu is usually a press ON something — a rail item, a card, the bell —
     and swallowing it would make the first click after opening the menu do
     nothing at all. So the state is cleared and the event carries on to
     whichever branch below wants it; every one of those ends in `render()`,
     which is what draws the menu shut.

     THE ONE CASE THAT NEEDS ITS OWN `render()` is a press on nothing — the
     page's own background — where no branch below matches and nothing would
     repaint. Cheap enough to do unconditionally, and a second render inside
     one handler is harmless here: `data-open` is a transition marker that has
     already been consumed by the time this runs (trap 5). */
  if(S.acct && !t.closest('.acct-t, .acct-menu')){ S.acct = false; render(); }

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

  const ra = t.closest('[data-readall]');
  if(ra){ notifList().forEach(n=>{ if(!S.read.includes(n.t)) S.read.push(n.t); }); render(); return; }

  /* CROSSING PORTALS IS NOT NAVIGATION. It changes who is signed in, so the
     back stack, the open overlays and anything Tal was mid-conversation about
     all belong to the account you are leaving. Everything resets except the
     stage, which is the candidate's and is waiting where you left it. */
  /* ONE ATTRIBUTE CANNOT BE BOTH A CONTROL AND A STATE STAMP, and this branch
     is where that cost a day. It was `t.closest('[data-portal]')`, which was
     right when `data-portal` appeared only on the two switch buttons. It did
     not stay right: `lead.js`'s render wrapper stamps `data-portal` on `.app`
     so that 31-lead.css can scope its rules with `.app[data-portal="leader"]`,
     and `.app` is the ancestor of EVERYTHING. So `closest` matched the root on
     every click in the product, `k !== S.portal` was false, and the
     unconditional `return` below swallowed the event before it could reach the
     `[data-go]` branch four lines down.

     Every navigation in the app died at once — the rail, the shell logo, every
     card, every button — while the stage picker went on working, because that
     is an `onchange` on the prototype chrome and never enters this listener.
     A page that highlights on click and then does nothing, with nothing in the
     console.

     The rescue was to scope it to the control's own class, `.psw-t`. THAT
     CLASS NO LONGER EXISTS — the switch is a row in the account menu now — so
     the attribute is retired rather than re-pointed: `data-swap` cannot
     collide with a state stamp because nothing stamps it. The `.app` stamp
     keeps its name and 31-lead.css is untouched. */
  const pw = t.closest('[data-swap]');
  if(pw){
    const k = pw.dataset.swap;
    if(k !== S.portal){
      S.portal = k;
      S.view = k==='leader' ? 'leadDash' : 'dashboard';
      S.hist = []; S.nav = false; S.notif = false; S.tal = false;
      talReset();
    }
    /* The menu closes either way. It is the surface the press came from, and
       pressing "Switch to Candidate" while already the candidate has to do
       SOMETHING — leaving the menu standing open reads as a dead control. */
    S.acct = false;
    render();
    return;
  }

  const g = t.closest('[data-go]');
  if(g){ e.preventDefault();
    const mark = g.dataset.read; if(mark && !S.read.includes(mark)) S.read.push(mark);
    if(S.notif) S.notif=false;
    if(S.acct) S.acct=false;
    /* a module opened from the side nav is a top-level destination, so it starts
       a fresh stack and shows no back control */
    const fresh = !!(g.closest('.sn-item') || g.classList.contains('shell-logo'));
    go(g.dataset.go, fresh); return; }

  const tog = t.closest('[data-toggle]');
  if(tog){
    const w = tog.dataset.toggle;
    if(w==='nav'){ S.nav=!S.nav; render(); }
    if(w==='tal'){ S.tal=!S.tal; if(!S.tal) talReset(); render(); }
    /* THE BELL AND THE FACE CANNOT BOTH BE OPEN. Both hang off the same corner
       and the notification panel is 360px wide, so the menu would open behind
       it — a control that appears to do nothing. Same reason `S.call.panel`
       holds one name rather than two booleans (ai10). */
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

  /* THE DISCLOSURE TOGGLES IN PLACE AND RECORDS ITSELF IN `S`, and it needs
     both halves.

     The first version called `render()`, on the reasoning in the note over
     `foundHead` — the block is on a dashboard, dashboards re-render, and a
     DOM class would not survive that. All true, and it made the control
     unusable: `render()` replaces `device.innerHTML`, which resets the
     scroller to the top, so opening a section 1200px down the page threw you
     back to the header — and closing it threw you back again. A disclosure
     that moves the page is worse than one that forgets.

     So the class goes on the element for THIS interaction, and `S.disc`
     records it for the NEXT render. Nothing re-renders on the click, the
     scroll position is never touched, and a later re-render still comes back
     open because the views read `S.disc`. */
  const fd = t.closest('[data-found]');
  if(fd){
    const k = fd.dataset.found || 'report';
    S.disc[k] = !S.disc[k];
    const sec = fd.closest('.found');
    if(sec) sec.classList.toggle('on', S.disc[k]);
    fd.setAttribute('aria-expanded', S.disc[k] ? 'true' : 'false');
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
