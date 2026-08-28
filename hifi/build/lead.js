/* ==========================================================================
   THE COHORT LEADER PORTAL

   Ported from the Cohort Leader portal in `tn-portals.html` — the same seven
   modules, the same data, the same order — and REDRAWN in this product's
   components rather than transcribed. The wireframe's portal had its own
   vocabulary (`data-ag` dispatch, `.bk` slide-overs, `.card`/`.stat`/`.tb`
   scoped to a `.ui` wrapper, a second state object `G`). None of that crosses:
   what crosses is the flow, the numbers and the decisions.

   WHY THE VIEWS LIVE IN `V`. There is one view registry and one renderer, and
   the leader is a different SIGNED-IN USER, not a different application. Every
   key is prefixed `lead` because `messages`, `dashboard` and `interviews` are
   pages in both portals, and `V` is flat.

   WHAT THE WIREFRAME DECIDED THAT THIS KEEPS
   1. No money anywhere. A cohort leader volunteers. The wireframe replaced its
      Earnings module with Certifications and stripped every fee from the
      leader's pages; a `wallet` on this rail would undo a decision the client
      has already signed off.
   2. The leader is measured on their candidates, not on their throughput —
      "Your standing" reports completion rate and average level movement, which
      is what the wireframe's own standing card reports.

   WHAT THIS CHANGES ON PURPOSE
   The wireframe's leader was Dana Whitfield running three cohorts at E1, B2 and
   T3. Two problems in this codebase: nobody here is Dana, and this product's
   agents each assess a RANGE (`AGENTS.priya.range` is E1–E3), so one leader
   holding a Trailblazer cohort contradicts data already on the candidate side.
   So the leader signed in is Priya Nair — already named in the candidate portal
   as Maryam's agent and the leader of Cohort 41 — and her three cohorts are all
   Explorer, at weeks 1, 5 and 11. Flipping the switcher now shows the other
   side of a cohort the demo was just looking at, which is the whole point of
   putting the two portals behind one control.

   Cohort 41 is Maryam's, and its ten members ARE `COHORT` in views.js — same
   names, same activity. The wireframe's per-member progress numbers are carried
   onto them so the two portals agree about the same ten people.
   ========================================================================== */

/* THE SAME PERSON THE CANDIDATE SEES, AND THE FACTS ARE STATED ONCE.
   `COHORT_LEAD` (views.js) is Priya from the candidate's side — the Enroll
   page and the enrolment confirmation both introduce her — and it has to live
   in that file rather than this one: views.js parses first and runs a boot
   `render()` at its foot, so a candidate page reached straight from the hash
   would hit a `LEADER` declared here in the temporal dead zone. Read in this
   direction it is safe, because lead.js parses after that file and nothing
   here renders before it.

   Three fields come across and two do not. The name, the range and how long
   she has been leading are one truth and used to be written out twice, one
   file apart. `i` stays local because the leader portal uses the initials as
   its own avatar fallback in five places, and `img` because `AV` is the
   dictionary both sides read anyway. */
const LEADER = {n:COHORT_LEAD.n, i:'PN', img:AV.priya,
  range:COHORT_LEAD.range, since:COHORT_LEAD.since};

/* The attention queue's own two controls. On `S` rather than in a closure so a
   re-render — a nav click, Tal opening — comes back to the same filtered view
   instead of silently resetting it. */
S.leadQ = '';
S.leadFilter = 'all';

/* --- the roster ----------------------------------------------------------
   `pc`   chapter progress, per cent
   `avg`  assessment average, per cent (0 = nothing assessed yet)
   `att`  calls attended out of the weeks run so far, as a ratio
   `last` when they were last active, in the words the course platform uses
   Everything the leader sees about a candidate comes back from the course
   platform. Nothing here is entered by hand, which is why there is no field
   the leader can edit — see the note on `flag` below.                      */
const lmem = (name,ini,img,pc,avg,att,last) => ({name,ini,img,pc,avg,att,last,flag:null});

const LEAD_COHORTS = [
  {id:41, level:'E3', week:5, day:34, call:'Thursday 6:00 PM', callDay:'Today', callTime:'6:00 PM', callOrd:2, starts:'', members:[
    lmem('Maryam Naz','MN','hana',46,84,1.3,'Today'),
    lmem('Aisha Bello','AB','priya',71,94,1.0,'Today'),
    lmem('Daniel Kerr','DK','owen',58,88,1.2,'Today'),
    lmem('Sofia Marchetti','SM','lena',41,79,1.0,'2d ago'),
    lmem('Ravi Chandran','RC','samuel',39,72,1.8,'Today'),
    lmem('Nora Lindqvist','NL','lena',36,81,1.1,'3d ago'),
    lmem('James Whitby','JW','owen',31,65,2.4,'Today'),
    lmem('Chloe Ferreira','CF','priya',28,77,1.0,'5d ago'),
    lmem('Tobias Mensah','TM','samuel',18,61,2.0,'8d ago'),
    lmem('Yuki Tanaka','YT','hana',9,0,0,'12d ago')]},
  {id:33, level:'E1', week:11, day:76, call:'Friday 5:00 PM', callDay:'Tomorrow', callTime:'5:00 PM', callOrd:4, starts:'', members:[
    lmem('Owen Clarke','OC','owen',92,87,1.3,'Today'),
    lmem('Lena Fischer','LF','lena',88,90,1.0,'Yesterday'),
    lmem('Samuel Adeyemi','SA','samuel',84,79,1.6,'Today'),
    lmem('Hana Kim','HK','hana',81,83,1.2,'Yesterday'),
    lmem('Marco Rossi','MR','owen',77,75,1.9,'2d ago'),
    lmem('Grace Mwangi','GM','priya',74,88,1.0,'Today'),
    lmem('Ivan Petrov','IP','samuel',68,70,2.1,'4d ago'),
    lmem('Zoe Bennett','ZB','lena',52,66,2.3,'9d ago')]},
  {id:47, level:'E2', week:1, day:4, call:'Monday 6:00 PM', callDay:'Mon', callTime:'6:00 PM', callOrd:5, starts:'', members:[
    lmem('Ahmed Farouk','AF','owen',15,100,1.0,'Today'),
    lmem('Beatriz Lima','BL','lena',12,88,1.0,'Today'),
    lmem('Callum Reid','CR','samuel',8,0,0,'Yesterday'),
    lmem('Dilnoza Karimova','DK','priya',8,0,0,'Today'),
    lmem('Ines Duarte','ID','hana',8,75,1.0,'Today'),
    lmem('Hugo Bernard','HB','owen',4,0,0,'2d ago'),
    lmem('Emeka Obi','EO','samuel',0,0,0,'Never'),
    lmem('Freya Olsen','FO','lena',0,0,0,'Never'),
    lmem('Gabriel Souza','GS','priya',0,0,0,'Never'),
    lmem('Jonas Weber','JW','hana',0,0,0,'Never')]}
];

/* Expected progress is linear across the 90 days. It is deliberately the
   crudest possible model: the leader is not being asked to beat a forecast,
   they are being shown who has stopped. */
const lpace = c => Math.round(c.day / 90 * 100);

/* THE FLAG IS DERIVED, NEVER SET. Every flag below is a reading of activity
   data, so a leader cannot mark someone at risk and cannot clear a flag by
   disagreeing with it — the flag goes away when the candidate comes back. The
   order matters: the first test that matches wins, hardest first.

   EACH FLAG NAMES ITS OWN ICON. A single marker per severity would say only
   what the colour already says. Six flags, six causes, and the cause is what a
   leader acts on: you write to someone who has never signed in, you look at
   the assessment scores of someone who is struggling. `ic` is a key into `I`,
   and the icon takes the severity's hue — so the mark carries the cause and its
   colour carries the weight, which is two readings out of one glyph. */
function lflag(m,c){
  const d = m.pc - lpace(c);
  const idle = /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1] : 0;
  if(m.last === 'Never')          return {k:'bad', t:'Never signed in',        ic:'misuse'};
  if(idle >= 7)                   return {k:'bad', t:'Inactive '+idle+' days', ic:'time'};
  if(d <= -15)                    return {k:'bad', t:'At risk',                ic:'warningAlt'};
  if(m.att >= 2.0 && m.avg < 75)  return {k:'wa',  t:'Struggling',             ic:'chart'};
  if(d <= -5)                     return {k:'wa',  t:'Behind pace',            ic:'growth'};
  if(idle >= 4)                   return {k:'wa',  t:'Slowing',                ic:'time'};
  return null;
}
LEAD_COHORTS.forEach(c => c.members.forEach(m => m.flag = lflag(m,c)));

const lmembers  = () => LEAD_COHORTS.flatMap(c => c.members.map(m => ({m, c})));
/* WITHIN A SEVERITY, ORDER BY THE GAP, NOT BY RAW PROGRESS. Sorted on `pc` the
   queue opened with four people at 0% — and all four were in a cohort that
   started four days ago, where 0% is four points behind and nothing to act on.
   Meanwhile someone at 9% in week five is twenty-nine points behind and was
   below the fold. The gap to expected pace is the reading; the raw number is
   only meaningful next to it, which is why the column prints both. */
const lgap = x => x.m.pc - lpace(x.c);
const lattention = () => lmembers().filter(x => x.m.flag)
  .sort((a,b) => (a.m.flag.k === b.m.flag.k ? lgap(a) - lgap(b) : a.m.flag.k === 'bad' ? -1 : 1));
const lbehind = () => lmembers().filter(x => x.m.pc - lpace(x.c) <= -5);
const lavg = (c,k) => Math.round(c.members.reduce((s,m) => s + m[k], 0) / c.members.length);
const lname = c => 'Cohort ' + c.id;
const llevel = c => 'Explorer &ndash; ' + c.level;

/* --- the interviews the leader runs -------------------------------------- */
/* EVERY PERSON ON THIS PORTAL CARRIES A FACE. The leader's whole job is people,
   and a leader scanning a queue recognises a face before they read a name — so
   `i` and `img` travel with the record rather than being chosen at the call
   site. `img` names one of the five photos in `AV`; the initials show through
   if the image fails, which is what `avatar()` is built to do. */
/* `day`, `time` and `ord` sit beside `when` rather than replacing it. `when` is
   a sentence — "today 4:30 pm" reads correctly inside a line of prose, which is
   where the plate and the waiting rows use it. The booked list is a COLUMN of
   appointments, and a column needs the day and the hour apart so they stack in
   a date chip and line up down the page. `ord` is an explicit sort key because
   these are human strings: parsing "Tomorrow" and "Nov 21" into comparable
   dates would be a date library's job, and the order here is a fixed demo
   week — Thursday — so it is stated rather than computed. */
const LEAD_SESSIONS = [
  {id:'s1', name:'Thomas Beck',   i:'TB', img:'samuel', when:'Today 10:00 AM',    day:'Today',    time:'10:00 AM', ord:0, mins:45, state:'done',     quiz:64, bucket:'Explorer'},
  {id:'s2', name:'Rachel Okonjo', i:'RO', img:'lena',   when:'Yesterday 3:30 PM', day:'Yesterday',time:'3:30 PM',  ord:-1,mins:45, state:'done',     quiz:71, bucket:'Explorer'},
  {id:'s3', name:'Femi Adebayo',  i:'FA', img:'owen',   when:'Today 4:30 PM',     day:'Today',    time:'4:30 PM',  ord:1, mins:45, state:'upcoming', quiz:58, bucket:'Explorer'},
  {id:'s4', name:'Sana Qureshi',  i:'SQ', img:'hana',   when:'Tomorrow 11:00 AM', day:'Tomorrow', time:'11:00 AM', ord:3, mins:45, state:'upcoming', quiz:69, bucket:'Explorer'},
  {id:'s5', name:'Maryam Naz',    i:'MN', img:'hana',   when:'Nov 21, 6:30 PM',   day:'Nov 21',   time:'6:30 PM',  ord:9, mins:45, state:'upcoming', quiz:64, bucket:'Explorer', re:true}
];

/* A LEVEL DECISION IS THE LEADER'S SIGNATURE, NOT THE MODEL'S. Tal reads the
   transcript and proposes a level with its reasoning; the level is not set until
   a person signs it. `ai` is the proposal and `status` is whether anybody has
   agreed yet — the wireframe kept those two facts apart and so does this. */
const LEAD_EVALS = [
  {id:'e1', name:'Thomas Beck',   i:'TB', img:'samuel', when:'Today 10:00 AM',    quiz:64, ai:'E1', status:'pending',
   why:'The quiz put them in the Explorer band and the interview places them at the entry level. Clear intent and good scoping, but they described keeping work rather than handing it over — twice.'},
  {id:'e2', name:'Rachel Okonjo', i:'RO', img:'lena',   when:'Yesterday 3:30 PM', quiz:71, ai:'E3', status:'pending',
   why:'Top of the Explorer band. Reframed an under-specified brief into three testable options unprompted; a weak conflict-repair answer is what holds this at 3 rather than 4.'}
];

const LEAD_SUMMARIES = [
  {id:'m1', name:'Owen Clarke',  i:'OC', img:'owen', cohort:33, status:'pending'},
  {id:'m2', name:'Lena Fischer', i:'LF', img:'lena', cohort:33, status:'pending'}
];

const lpending = () => LEAD_EVALS.filter(e => e.status === 'pending').length
                     + LEAD_SUMMARIES.filter(s => s.status === 'pending').length;
const lnext = () => LEAD_SESSIONS.filter(s => s.state === 'upcoming')[0];

/* --------------------------------------------------------------------------
   WHAT "BOOKED" MEANS

   There are two kinds of appointment in a cohort leader's week and the
   dashboard had only ever counted one of them. An INTERVIEW is one candidate,
   forty-five minutes, and it ends in a level the leader signs. A COHORT CALL is
   ten candidates, sixty minutes, every week, and it ends in nothing being
   decided. Different objects — but both are "a time you have to be somewhere",
   and a leader looking at a card that says Booked is asking about their diary,
   not about one of the two kinds.

   So the count is both, and the section lists both, interleaved in time rather
   than grouped by kind: the question the list answers is "what is next", and
   two separate groups make you read two lists and do the merge yourself.
   `kind` survives on each row so the mark and the detail line can differ, and
   `go` so the two kinds open different pages — an interview goes to Sessions,
   a call to Cohorts, where its brief is. There is no per-row VERB any more;
   `bookedRow` says why.
   -------------------------------------------------------------------------- */
const lbooked = () => LEAD_SESSIONS.filter(s => s.state === 'upcoming').map(s => ({
    kind:'iv', ord:s.ord, day:s.day, time:s.time, i:s.i, img:s.img,
    t:(s.re ? 'Re-interview' : 'Level interview') + ' &middot; ' + s.name,
    d:s.mins + ' minutes, recorded &middot; ' + (s.re
        ? 'they have 90 days behind them, so you read the summary first'
        : 'you sign the level afterwards'),
    go:'leadSessions'
  })).concat(LEAD_COHORTS.map(c => ({
    kind:'call', ord:c.callOrd, day:c.callDay, time:c.callTime,
    t:'Cohort call &middot; ' + lname(c),
    d:'60 minutes &middot; week ' + c.week + ' of 13 &middot; ' + c.members.length + ' candidates at ' + llevel(c),
    go:'leadCohorts'
  }))).sort((a,b) => a.ord - b.ord);

/* --------------------------------------------------------------------------
   THE FOUR CARDS AND THE FOUR SECTIONS ARE ONE LIST

   Each figure cell counts a section of this page, so pressing it goes there.
   That only holds together if three things stay in step: the order of the
   cards, the order of the sections down the page, and the four hues §31 keys
   by `nth-child`. Stating them here once is what keeps them in step — the
   cards are generated from this array and the sections carry these ids, so the
   only way to reorder either is to reorder this.

   PAGE ORDER FOLLOWS CARD ORDER, left to right. Scrolling then lights the
   cards in the order they are read, which is what makes the bar legible as a
   position indicator rather than as four buttons that happen to highlight.
   -------------------------------------------------------------------------- */
const LEAD_JUMPS = [
  {id:'lead-cohorts',   ic:'group',      l:'Cohorts'},
  {id:'lead-attention', ic:'warningAlt', l:'Attention'},
  {id:'lead-waiting',   ic:'edit',       l:'Waiting on you'},
  {id:'lead-booked',    ic:'video',      l:'Booked'}
];

/* --- the bell -----------------------------------------------------------
   Read by `notifList()` in views.js. Same row shape as the candidate's
   `NOTIF` entries so `notifPanel()` renders both without a branch. Every one
   of them is somebody else's work arriving, which is the character of this
   portal: a leader's day is made of other people finishing things.        */
/* `var`, DELIBERATELY, and the same for LEAD_TAL below. views.js guards both
   with `typeof X !== 'undefined'` because this file is parsed after it — and
   that guard is a LIE for a `const`: a const in its temporal dead zone makes
   `typeof` throw a ReferenceError rather than answer 'undefined'. `var` is
   hoisted, so the guard means what it says and deleting this file degrades to
   an empty bell instead of a broken render. */
var LEAD_NOTIF = [
  {ic:'edit',       t:'Thomas Beck is waiting on a level decision', b:'Interview finished at 10:00 AM. They cannot enroll until you sign it.', w:'25 min ago', go:'leadEvals',    unread:1},
  {ic:'warningAlt', t:'Yuki Tanaka has not signed in for 12 days',  b:'Cohort 41, week 5. Nine per cent through the chapters.',                w:'2h ago',     go:'leadReports',  unread:1},
  {ic:'chat',       t:'3 new posts in Cohort 41',                    b:'Chapter 4 came up again on the discussion board.',                     w:'4h ago',     go:'leadMessages', unread:1},
  {ic:'calendar',   t:'Femi Adebayo booked you for 4:30 PM',         b:'45 minutes. Explorer band from their quiz, no level yet.',              w:'Today',      go:'leadSessions', unread:0},
  {ic:'certificate',t:'Your fourth cohort completed',                b:'Cohort 26 closed with eight of ten promoted.',                         w:'Yesterday',  go:'leadCerts',    unread:0}
];

/* --- what Tal knows here -------------------------------------------------
   Read by `talPanel()` in views.js. Tal's ANSWERS are not ported: the router
   in views.js answers candidate questions with candidate widgets, and a
   leader-side router is its own piece of work. What the panel gets now is an
   accurate opener and leader-shaped suggestions, so nothing in it claims to
   know something it does not.                                             */
var LEAD_TAL = {   /* `var` for the reason given above LEAD_NOTIF */
  where: {leadDash:'Dashboard', leadSessions:'Sessions', leadEvals:'Evaluations',
          leadCohorts:'Cohorts', leadReports:'Course reports', leadMessages:'Messages',
          leadCerts:'Certifications', leadProfile:'Your profile'},
  state: () => LEAD_COHORTS.length + ' cohorts, ' + lmembers().length + ' candidates, '
             + lpending() + ' decision' + (lpending()===1?'':'s') + ' waiting',
  ctx: {
    leadDash: ['Brief me for Thursday&rsquo;s call','Who should I worry about this week?','Summarise the two evaluations waiting'],
    leadSessions: ['What should I ask Femi Adebayo?','Who is booked this week?'],
    leadEvals: ['Why did you propose E1 for Thomas?','What evidence supports this level?'],
    leadCohorts: ['Where is Cohort 41 stuck?','Which cohort needs me most?'],
    leadReports: ['Who has stopped in the last week?','Which chapter is losing people?'],
    leadMessages: ['Draft a check-in to Yuki Tanaka','What came up on the board this week?'],
    leadCerts: ['What do I need for the next certification?'],
    leadProfile: ['How is my standing calculated?']
  }
};

/* --------------------------------------------------------------------------
   A ROW ABOUT A PERSON

   A FACE, NOT A GLYPH. The leading slot on a list row is normally
   `.cardrow-ic` — a 40px plate holding a document or a pencil. On this portal
   every row in a queue is a PERSON, and four rows carrying the same pencil say
   nothing except "these are the same kind of task", which the heading above
   them already said. A face is the one mark that distinguishes the rows from
   each other, and recognising who is waiting is the actual work. It reuses
   `mem()`'s slot verbatim rather than a new one, because this IS that slot.

   AN ARROW, NOT A VERB. Each row ended in a small "Decide" or "Recommend"
   button. Three problems: two different words for one destination (both open
   Evaluations), a 60px target on a 700px row that is otherwise dead, and a
   label that promises the decision happens HERE when it happens on the page it
   opens. The whole row becomes the target and takes `.tile-arrow`, which is
   what every other openable row in this product wears — `gcard`, the chapter
   list, the settings rows. What you do is on the page you land on.
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   A ROW ABOUT AN APPOINTMENT

   THE DATE IS A CHIP, because a column of appointments is read down the date
   and across the detail. `.day` is the chip the booking flow already uses for
   exactly this — a bordered box, the word over the figure — so the leader's
   diary and the candidate's slot picker draw a date the same way.

   AN INTERVIEW SHOWS A FACE AND A CALL SHOWS A GROUP. The mark answers "who am
   I meeting", and for one person that is their face and for ten it is not any
   one of them. Same slot, two answers, and it means the two kinds are
   distinguishable at a glance without a tag saying which is which.

   THE CHIP IS ONE WIDTH FOR EVERY ROW, set in §31.5 — not sized to its own
   words. "TODAY", "TOMORROW" and "NOV 21" are three different lengths, so a
   chip that hugged its text started each row's face and title at a different
   x and the column read as ragged. A diary is scanned down the date and across
   the detail, and both of those need a straight edge.

   AN ARROW, NOT A VERB — the same argument `faceRow` above makes, and it
   applies here for one extra reason. The two words in this slot were "Join"
   and "Brief", which named the KIND of appointment as much as the action, and
   neither happened here: both opened another page. So the row is the target,
   it carries the arrow every openable row in this product wears, and `kind` is
   still legible from the mark and the detail line. `go` survives on the row
   data; `cta` does not, because nothing prints it any more.
   -------------------------------------------------------------------------- */
function bookedRow(b){
  const mark = b.kind === 'iv'
    ? `<span class="mem-av mem-ph">${avatar({i:b.i, img:AV[b.img]}, 36)}</span>`
    : `<span class="cardrow-ic">${I.group}</span>`;
  /* `bk-now` is the whole of "this one is today": §31.5 gives its label full
     ink and leaves every other day in helper grey. A date column read down
     needs one mark saying where NOW is, and a weight is the cheapest one. */
  const now = /^today$/i.test(b.day) ? ' bk-now' : '';
  return `<button class="cardrow bk-row" data-go="${b.go}">
    <span class="day bk-day${now}"><div class="d">${b.day}</div><div class="n">${b.time}</div></span>
    ${mark}
    <span class="cardrow-b">
      <span class="cardrow-t">${b.t}</span>
      <span class="cardrow-d">${b.d}</span>
    </span>
    <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
  </button>`;
}

function faceRow(p, detail, go){
  return `<button class="tile clk gcard face-row" data-go="${go}">
    <span class="mem-av mem-ph">${avatar({i:p.i, img:AV[p.img]}, 36)}</span>
    <span class="gcard-b"><h3>${p.name}</h3><span class="sub">${detail}</span></span>
    <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
  </button>`;
}

/* ==========================================================================
   THE DASHBOARD
   The wireframe's leader dashboard opened with a banner picking the single
   most urgent thing, then four stats, then three lists. That reading order is
   right and it is kept. What changes is what draws each part:

   THE BANNER BECOMES TAL'S CARD. The wireframe drew a bespoke `.bnr` — icon,
   eyebrow, headline, sentence, one button — for "the one thing to do about
   right now". This product already has that object and it is the Tal card in
   the module head band: eyebrow, sentence, and the required action riding the
   head row (see ai5.js). Drawing a second one would be two components for one
   idea, which is the mistake §29.4 records for the level card.

   THE SESSION BECOMES A PLATE. An interview is a named person at a time that
   you join, and every one of those in this product is a `.plate` — the black
   wall with a face. The wireframe put the next interview in a small card in
   the right-hand column; there is no right-hand column here, and a plate says
   "this is an appointment" without a heading having to say it.

   THE ATTENTION QUEUE STAYS A TABLE. It is five aligned facts about each of
   several people, read by scanning down a column — the one shape on either
   portal that genuinely is tabular. `.tbl` already exists.

   THE FIGURE CELLS GO THROUGH `statCell()`, NOT INLINE MARKUP. §29.17 moved the
   label and the figure onto one line inside a `.stat-top` wrapper; a hand-built
   `.stat` with `.l` and `.n` as direct children still matches the OLD grid
   areas in §24 and lands with the note in the label's slot. The helper is the
   only correct way to draw one — it is also why its `.d` note is three or four
   words in every existing call site, and these match that register.

   NO ACTION IN THE STANDING CARD'S HEADING. A section whose body is a tile
   keeps the desktop label column — §10.15 opts out sections of ROWS, and a tile
   is not a row — and that column is 184px wide. §10 records exactly what
   happens when a heading inside it also carries an unshrinkable button: the
   button takes the width and the h2 renders one letter per line. So that
   heading stays a heading and its action goes under the tile, which is where
   the transcript's "Show all 13" sits for the same reason.

   YOUR STANDING IS FOUR CELLS, NOT FIVE. `.facts` is an auto-fit grid, so a
   fifth cell lands alone on a second row and §10 spans it the full width — a
   band of four tidy figures with one stretched underneath it. Four is also what
   the fact band on Interviews holds and what the stats band at the top of this
   page holds, so the page keeps one rhythm instead of two. "Leading since" was
   the cell to lose: it is a fact ABOUT the leader rather than a measure OF
   them, and it reads better in the line that dates the other four.

   COMMENTS INSIDE A VIEW STAY OUT OF THE TEMPLATE LITERAL. An HTML comment in
   the returned markup is inside a backtick string, so a backtick in the prose —
   which this file's own convention puts around every class name — closes the
   string and the next line is parsed as a tagged template. It fails as
   "(intermediate value).tile is not a function", nowhere near the comment.
   Reasoning about a view belongs in a block like this one, above it.
   ========================================================================== */
V.leadDash = () => {
  const att = lattention(), next = lnext(), pend = lpending();
  const severe = att.filter(x => x.m.flag.k === 'bad');
  const moderate = att.filter(x => x.m.flag.k === 'wa');
  const bad = severe.length;
  /* THE QUEUE SHOWS THE WORST OF EACH KIND, NOT THE WORST OVERALL. Sorted
     purely by severity, the seven rows that fit were seven severe ones —
     week 1 of a new cohort alone contributes four candidates who have never
     signed in — so the moderate group was invisible and the column that
     distinguishes them had nothing to distinguish. Four severe and three
     moderate: the leader sees both populations and the count below says what
     is not on screen. */
  const shown = severe.slice(0,4).concat(moderate.slice(0,3));
  const rest = att.length - shown.length;
  const c41 = LEAD_COHORTS[0];
  const booked = lbooked();

  /* The figure each card carries, keyed by the section it goes to, so the
     numbers cannot drift out of step with `LEAD_JUMPS`. */
  const FIG = {
    'lead-cohorts':   [LEAD_COHORTS.length, `${lmembers().length} candidates`],
    'lead-attention': [att.length,          `${bad} severe`],
    'lead-waiting':   [pend,                'levels and summaries'],
    'lead-booked':    [booked.length,       booked[0] ? 'next ' + booked[0].day.toLowerCase() + ' ' + booked[0].time.toLowerCase() : 'nothing booked']
  };

  /* Tal leads with whatever is most urgent, and the required action follows the
     same test the wireframe's banner used: a signature blocks a candidate, so
     it outranks a call that is still two days away. */
  const talRead = pend
    ? {h:'Two decisions are blocking two people',
       p:`<b>${LEAD_EVALS[0].name}</b> and <b>${LEAD_EVALS[1].name}</b> finished their interviews and neither can enroll until you sign a level. Both of my proposals are in the band their quiz put them in.`,
       a:'leadEvals', ab:'Open evaluations'}
    : next
    ? {h:'Your next interview is '+next.when.toLowerCase(),
       p:`<b>${next.name}</b>, ${next.mins} minutes. Their quiz puts them in the Explorer band; they have no level yet, so this conversation sets it.`,
       a:'leadSessions', ab:'Open sessions'}
    : {h:'Cohort 41 meets on Thursday',
       p:`Week ${c41.week} of 13. I can pull a brief from where the cohort actually is rather than from where the syllabus says it should be.`,
       a:'leadCohorts', ab:'Open Cohort 41'};

  return `<main class="main"><div class="page">
  ${/* THE SAME GREETING THE CANDIDATE GETS. The candidate's dashboard opens
        "Welcome Back, Maryam!" and this one opened "Hi Priya" — two different
        greetings for the same moment, in a product where the two portals are
        the same person's two roles and the switch between them is one click in
        the app bar. Whichever wording wins, it has to be one wording. */''}
  ${ph('Welcome back, Priya',`Cohort leader &middot; ${LEAD_COHORTS.length} cohorts &middot; ${lmembers().length} candidates, all Explorer`)}
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>${talRead.h}</h3></div>
      <div class="ai-body"><p>${talRead.p}</p></div>
      <div class="ai-foot noline">
        <button class="btn btn-p btn-sm ic-l ai-do" data-go="${talRead.a}">${I.arrowRight}${talRead.ab}</button>
        <span class="sp"><button class="ic" aria-label="Helpful">${I.thumbsUp}</button><button class="ic" aria-label="More">${I.overflow}</button></span></div>
      <div class="ai-asks">
        ${askChip('Brief me for Thursday&rsquo;s call','Brief me for Thursday')}
        ${askChip('Who should I worry about this week?','Who should I worry about?')}
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="stats stats-lead">
      ${LEAD_JUMPS.map(j => statCell(I[j.ic], j.l, FIG[j.id][0], FIG[j.id][1], j.id)).join('')}
    </div>
  </div>
  <div class="sec lead-bar" id="leadBar">
    <div class="cs lead-tabs" role="tablist" aria-label="Sections of this page">
      ${LEAD_JUMPS.map(j =>
        `<button data-jump="${j.id}" role="tab">${j.l}<span class="lf-n">${FIG[j.id][0]}</span></button>`).join('')}
    </div>
  </div>
  ${next?`
  <div class="sec">
    <div class="plate" data-when="${next.when.toLowerCase()}">
      <div class="plate-who">${avatar({i:next.i, img:AV[next.img]},56)}
        <span class="plate-wb"><b>${next.name}</b><span>Explorer band from their quiz &middot; no level yet</span></span>
      </div>
      ${/* NO "NEXT UP" LABEL. The card is the only appointment on the page and
            the chip in the opposite corner already says when it is, so the
            eyebrow was a category name over a card of one. `data-when` carries
            the time on its own and `placePlates` seats the title in the head
            row beside it — the same treatment the candidate's weekly call and
            consultant call plates take, and the note in ai5.js is where it is
            written down. */''}
      <div class="plate-t">Level interview</div>
      <div class="plate-b">${next.mins} minutes, recorded &middot; you sign the level afterwards</div>
      <div class="plate-a">
        <button class="btn btn-p btn-sm noic">Join the interview ${I.video}</button>
        <button class="btn btn-sm noic plate-b2" data-go="leadSessions">All sessions</button>
      </div>
    </div>
  </div>`:''}
  <div class="sec" id="lead-cohorts">
    <div class="sec-h"><h2>Your cohorts</h2><button class="btn btn-g btn-sm noic" data-go="leadCohorts">View all ${LEAD_COHORTS.length}</button></div>
    <div class="tile-stack">
      ${LEAD_COHORTS.map(c=>{
        const b = c.members.filter(m=>m.flag&&m.flag.k==='bad').length;
        const ahead = lavg(c,'pc') >= lpace(c);
        return gcard('cohort', lname(c)+' &middot; '+llevel(c), 'Week '+c.week+' of 13',
          `${c.call} &middot; ${lavg(c,'pc')}% average progress against ${lpace(c)}% expected`
          + (b?` &middot; ${b} at risk`:ahead?' &middot; on pace':''), 'leadCohorts');
      }).join('')}
    </div>
  </div>
  <div class="sec tint" id="lead-attention">
    <div class="sec-h"><h2>Needs attention</h2><span class="t-helper-01">From course activity, not from you</span></div>
    <div class="lead-tools">
      <div class="srch lead-srch">
        <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
        <input class="inp" id="leadQ" value="${S.leadQ}" placeholder="Search a name or cohort" aria-label="Search flagged candidates" autocomplete="off">
      </div>
      <div class="cs lead-filter" role="tablist" aria-label="Severity">
        ${[['all','All',att.length],['sev','Severe',severe.length],['mod','Moderate',moderate.length]].map(([k,l,n])=>
          `<button class="${S.leadFilter===k?'on':''}" data-lfilter="${k}" role="tab" aria-selected="${S.leadFilter===k}">${l}<span class="lf-n">${n}</span></button>`).join('')}
      </div>
    </div>
    <div class="tbl-wrap">
      <table class="tbl tbl-flag">
        <tr><th>Candidate</th><th>Cohort</th><th>Flag</th><th class="num">Progress</th><th class="num">Last active</th></tr>
        ${att.map(x=>`<tr class="${x.m.flag.k==='bad'?'sev':'mod'}" data-nm="${x.m.name.toLowerCase()}" data-co="${x.c.id} ${x.c.level.toLowerCase()} explorer">
          <td>${x.m.name}</td>
          <td>${x.c.id} &middot; ${x.c.level}</td>
          <td><span class="flag-t">${I[x.m.flag.ic]}${x.m.flag.t}</span></td>
          <td class="num">${x.m.pc}% <span class="t-helper-01">of ${lpace(x.c)}%</span></td>
          <td class="num">${x.m.last.toLowerCase()}</td>
        </tr>`).join('')}
      </table>
      <div class="empty lead-none" id="leadEmpty" hidden style="border:0">${I.search}
        <h3>Nothing matches</h3><p>Try another name, or clear the filter.</p></div>
    </div>
    <p class="t-helper-01 mt4" id="leadCount"></p>
  </div>
  <div class="sec" id="lead-waiting">
    <div class="sec-h"><h2>Waiting on you</h2></div>
    ${pend?`<div class="tile-stack">
      ${LEAD_EVALS.filter(e=>e.status==='pending').map(e=>
        faceRow(e, `Level decision &middot; I proposed Explorer &ndash; ${e.ai} &middot; ${e.when.toLowerCase()}`, 'leadEvals')).join('')}
      ${LEAD_SUMMARIES.filter(s=>s.status==='pending').map(s=>
        faceRow(s, `90-day summary &middot; Cohort ${s.cohort} &middot; sign to close their 90 days`, 'leadEvals')).join('')}
    </div>`:`<div class="empty" style="border:0">${I.checkFilled}<h3>Nothing outstanding</h3><p>Every level decision and summary is signed.</p></div>`}
  </div>
  <div class="sec tint" id="lead-booked">
    <div class="sec-h"><h2>Booked</h2><span class="t-helper-01">Interviews and cohort calls, in the order they happen</span></div>
    ${booked.length?`<div class="tile-stack">
      ${booked.map(bookedRow).join('')}
    </div>
    <div class="btn-set mt5">
      <button class="btn btn-g" data-go="leadSessions">All sessions ${I.arrowRight}</button>
      <button class="btn btn-t" data-go="leadProfile">Your availability ${I.calendar}</button>
    </div>`:`<div class="empty" style="border:0">${I.calendar}<h3>Nothing booked</h3><p>Interviews you are booked for and your weekly cohort calls both show up here.</p></div>`}
  </div>
  <div class="sec" id="lead-standing">
    <div class="sec-h"><h2>Your standing</h2><span class="t-helper-01">Across every cohort you have closed since ${LEADER.since}</span></div>
    <div class="facts">
      <div><span class="l">Candidate rating</span><span class="v stand-rate">${stars(4.9)}4.9</span></div>
      <div><span class="l">Interviews conducted</span><span class="v">62</span></div>
      <div><span class="l">Completion rate</span><span class="v">84%</span></div>
      <div><span class="l">Level movement</span><span class="v">+0.8 levels</span></div>
    </div>
    <div class="btn-set mt5">
      <button class="btn btn-g" data-go="leadProfile">Edit public profile ${I.arrowRight}</button>
    </div>
  </div>
</div></main>`;
};

/* ==========================================================================
   ALL SEVEN MODULES ARE DRAWN, AND NOT IN THIS FILE

   This is where `LEAD_SOON` used to be: seven "coming in the next pass" empty
   states, one per module, so that a rail offering seven modules from the first
   paint was not offering seven dead ends. All seven are now real pages, and
   four more sit under them:

     lead2.js   Cohorts, one cohort's roster, one candidate, Course Reports
     lead3.js   Sessions, Evaluations, one level decision, one 90-day summary
     lead4.js   Messages, Certifications, the leader's own profile

   Two things a reader of this file needs from those three, both of which cost
   an afternoon to find out:

   1. A LEADER PAGE MUST HAVE A `PAGESUM` ENTRY (ai6.js). `talFirst` in
      views.js hoists any section holding an `.ai-aura` to the top of the page,
      `placeBand` pulls it into the module head band, and ai6 then replaces its
      words with `pageSummary()` — so a page's Tal copy is a `PAGESUM` row, not
      markup in the view. With no row, the card is left in a shape §33 does not
      style and the band renders 700px wider than the page.

   2. A DARK CARD MOVES. `.plate` and `.cert` are in ai5's `DARK_CARD` list,
      and `placeDark` lifts whichever page child contains one into the band.
      One per page; a second is a slab.
   ========================================================================== */

/* ==========================================================================
   THE FIGURE BAND BECOMES A POSITION INDICATOR

   Four cards that count four sections of the page they are on. Read as
   headings, they are a summary; pressed, they are navigation; and once the page
   has scrolled past them they are the only thing on screen that still says
   where in the page you are. So the band sticks to the top of the scroller and
   keeps all three jobs.

   THE BAND IS THE `.sec`, NOT THE `.stats` INSIDE IT. A sticky element can only
   travel inside its own containing block, and the section wrapping the grid is
   exactly as tall as the grid — stuck to its own top, it would not move at all.
   The section's containing block is `.page`, which runs the length of the
   document, so sticking the section gives it the whole page to travel.

   IT STAYS IN THE CONTENT COLUMN. It spans what the resting card row spans and
   no more. An earlier version measured `.main`'s side padding and pulled the
   stuck bar out over it, on the argument that chrome runs to the frame edge —
   but this is not the frame, it is the top of a page, and a strip that runs
   under the rail and past the right edge of every section it names has stopped
   belonging to them. §31 draws the states; neither needs a measurement.

   IT LEAVES AT "YOUR STANDING". Your standing is the one section on the page no
   card counts — it is the leader's own record, not a queue — so once it reaches
   the bar there is nothing left for the bar to point at, and a position
   indicator pointing at nothing is furniture. It hides by transform and
   `visibility`, never `display`: a sticky element still occupies its flow box,
   and removing that box would shift the page under a reader mid-scroll.

   ONE SCROLL LISTENER, ON `device`, IN CAPTURE. `render()` replaces `.main` on
   every render, so a listener bound to the scroller would leak one copy per
   render. Scroll events do not bubble, but they are delivered to capturing
   listeners on ancestors — so a single capture-phase listener on `device`
   survives every render and sees the new scroller for free.
   ========================================================================== */
function leadStick(){
  const app = device.querySelector('.app');
  if(!app) return;
  const bar = device.querySelector('#leadBar');
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!bar || !main) return;

  /* NOTHING IS MEASURED FOR WIDTH ANY MORE. This used to publish the distance
     from the scroller's edge to the page's so the stuck bar could pull itself
     out over `.main`'s padding — which put the strip under the rail and past
     the right edge of the sections it labels. The bar belongs in the content
     column, and the column's own width is something CSS already knows. */
  const mr = main.getBoundingClientRect();
  const h = bar.getBoundingClientRect().height;
  const stuck = bar.getBoundingClientRect().top <= mr.top + 2;
  bar.classList.toggle('is-stuck', stuck);

  /* THE BAR LEAVES WHEN YOUR STANDING IS FULLY ON SCREEN.

     Your standing is the one section on this page that no card counts — it is
     the leader's own record rather than a queue — so arriving at it is the
     moment the bar has nothing left to point at.

     "Arriving" has to mean FULLY VISIBLE, not "has reached the bar". Your
     standing is the last thing on the page, so at the very bottom of the scroll
     its top is still two thirds of the way down the window: a trigger that waits
     for it to reach the top is a trigger the page can never reach, and the first
     version of this never fired once.

     Gated on `stuck` because on a window tall enough to show the whole page at
     once, every section is always fully visible — and an unstuck bar sitting in
     its own flow position must not hide, or the page has a hole where its
     figures should be. */
  const stand = device.querySelector('#lead-standing');
  const gone = stuck && !!stand && stand.getBoundingClientRect().bottom <= mr.bottom;
  bar.classList.toggle('is-gone', gone);

  /* THE READING LINE IS 45% DOWN, NOT AT THE BAR'S EDGE.

     "The last section whose top has passed under the bar" is the obvious rule
     and it is wrong here, for a reason particular to the last card: Booked is
     the final counted section, so its top only reaches the bar at the very
     bottom of the scroll — by which point Your standing is visible and the bar
     has already gone. The Booked card could never light up, which made it the
     one card that looked broken.

     Measuring at 45% of the space below the bar gives every section a window,
     including the last, and it is the better reading of "which section am I
     in" anyway: the active one is the one occupying the place your eye is,
     not the one that just crossed the top edge. */
  const line = mr.top + h + (mr.height - h) * 0.45;
  let live = LEAD_JUMPS[0] && LEAD_JUMPS[0].id;
  LEAD_JUMPS.forEach(j => {
    const s = device.querySelector('#' + j.id);
    if(s && s.getBoundingClientRect().top <= line) live = j.id;
  });
  bar.querySelectorAll('[data-jump]').forEach(b =>
    b.classList.toggle('on', !gone && b.dataset.jump === live));
}

let LEAD_RAF = false;
device.addEventListener('scroll', () => {
  if(LEAD_RAF) return;
  LEAD_RAF = true;
  requestAnimationFrame(() => { LEAD_RAF = false; try { leadStick(); } catch(e){} });
}, true);
window.addEventListener('resize', () => { try { leadStick(); } catch(e){} });

/* PRESSING A CARD SCROLLS, IT DOES NOT NAVIGATE. `data-go` would open another
   page; these four are sections of THIS page, and the difference matters — the
   count on the card is a count of what is a few hundred pixels below it, and
   replacing the page to show it would lose the three other counts.

   `scrollIntoView`, NOT ARITHMETIC. The first version worked out the target
   itself and subtracted the bar's height, and it could not be right: the height
   it measured was the RESTING bar, four cards tall, and the height that ends up
   covering the heading is the STUCK bar, one strip tall. Every jump landed with
   the heading tucked behind the strip.

   The offset a sticky header needs is what `scroll-margin-top` is for, and the
   four sections declare it in §31. `scrollIntoView` honours it, `scrollTo` does
   not — so the browser does the arithmetic, the value lives next to the bar it
   is compensating for, and this handler has none of it. */
device.addEventListener('click', e => {
  const j = e.target.closest('[data-jump]');
  if(!j) return;
  const sec = device.querySelector('#' + j.dataset.jump);
  if(sec) sec.scrollIntoView({block:'start', behavior:'smooth'});
});

/* ==========================================================================
   SEARCH AND FILTER, WITHOUT RE-RENDERING

   The whole queue is in the table — all twelve rows, severe first — and the two
   controls decide which of them you are looking at. That is the opposite of the
   capped list this replaced: a cap has to choose for the leader, and a filter
   lets them choose, so the cap is gone and the count line reports what the
   filter is doing.

   IT FILTERS THE DOM, IT DOES NOT RE-RENDER. `render()` replaces the whole view
   column, which would destroy the input on every keystroke and take the caret
   and the focus with it — the same trap ai4.js records for the ask thread. So
   typing updates `S.leadQ` and toggles a class on each row; nothing is rebuilt.

   THE STATE STILL LIVES ON `S`, and the render wrapper re-applies it, so a
   filter survives a render triggered by something else (opening Tal, the bell).
   The view prints `S.leadQ` back into the field and marks the live chip, so the
   controls and the rows can never disagree about what is being shown.

   The `.on` class on the chips is moved by the generic `.cs button` branch in
   views.js, which fires before this listener and does not re-render. Moving it
   again here is deliberate belt-and-braces: this file must not depend on the
   ordering of two listeners on the same element.
   ========================================================================== */
function leadFilterApply(){
  const tb = device.querySelector('.tbl-flag');
  if(!tb) return;
  const q = (S.leadQ || '').trim().toLowerCase();
  const rows = tb.querySelectorAll('tr[data-nm]');
  let on = 0;
  rows.forEach(tr => {
    const kindOk = S.leadFilter === 'all'
      || (S.leadFilter === 'sev' && tr.classList.contains('sev'))
      || (S.leadFilter === 'mod' && tr.classList.contains('mod'));
    const textOk = !q || tr.dataset.nm.includes(q) || tr.dataset.co.includes(q);
    const show = kindOk && textOk;
    tr.classList.toggle('is-off', !show);
    if(show) on++;
  });
  const none = device.querySelector('#leadEmpty');
  if(none) none.hidden = on > 0;
  const count = device.querySelector('#leadCount');
  if(count) count.textContent = !on ? ''
    : on === rows.length ? `All ${rows.length} flagged candidates.`
    : `Showing ${on} of ${rows.length} flagged.`;
}

device.addEventListener('input', e => {
  if(e.target.id !== 'leadQ') return;
  S.leadQ = e.target.value;
  leadFilterApply();
});

device.addEventListener('click', e => {
  const f = e.target.closest('[data-lfilter]');
  if(!f) return;
  S.leadFilter = f.dataset.lfilter;
  f.parentElement.querySelectorAll('button').forEach(b => {
    b.classList.toggle('on', b === f);
    b.setAttribute('aria-selected', String(b === f));
  });
  leadFilterApply();
});

/* ==========================================================================
   THE LEADER'S PAGES NAME THEMSELVES IN THE ASK

   The ask line used to be the fourth member of the module head band, and this
   block is where the leader's landing page opted into it (`ASK_ON.push`). It
   does not have to opt in any more: ai4 moved the field out of the band and
   onto the bottom edge of the view column, on every page of both portals, so
   the list it was pushing to is gone — every leader page has the field,
   including the five module landings that are still stubs. That is the right
   answer for a stub too: "this page is not built yet" is a reasonable thing
   to want to ask Tal about, and the field is no longer part of the page's own
   composition, so it cannot make a thin page look thinner.

   What is still needed is the LABEL. `askView` prints "Back to ${where}", and
   ASK_WHERE is ai4's map of view to page name — the candidate's half only.
   `LEAD_TAL.where` is the same map for the leader, already written above for
   the Tal panel's own header, so the two surfaces name a page identically
   rather than each keeping a copy that can drift.
   ========================================================================== */
Object.assign(ASK_WHERE, LEAD_TAL.where);

/* ==========================================================================
   THE APP SAYS WHICH PORTAL IT IS SHOWING
   Same reasoning as `stampView` in ai5.js: a handful of corrections are true
   of one portal and not the other, and there was no way to say so in CSS.
   Wrapping rather than editing `render` keeps this file the only place the
   leader portal touches the runtime.
   ========================================================================== */
const _baseLead = render;
render = function(){
  _baseLead();
  try {
    const app = device.querySelector('.app');
    if(app) app.dataset.portal = S.portal || 'candidate';
    leadFilterApply();
    /* the bar's stuck state, its bleed and its live card are all read off
       geometry, and the geometry is new on every render — a nav click, Tal
       opening, the viewport switcher. Measured after the paint, not before it. */
    leadStick();
  } catch(e){ console.warn('portal stamp', e); }
};

/* THE LAST STATEMENT, FOR THE REASON ai5.js RECORDS. The boot render is the
   final line of views.js and runs before this file is parsed, so the page on
   screen at that moment was drawn without `data-portal` and without any of the
   leader views in `V`. One call, at the foot, same as every pass before it. */
render();
