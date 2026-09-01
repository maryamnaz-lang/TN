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

   AND THE LEADER DOES NOT INTERVIEW ANYBODY — Maryam, 1 Sep 2026. This is the
   largest departure from the wireframe on this side, and it is a correction
   rather than a redraw: the wireframe's leader ran the initial level interview
   AND led the 90 days, which put the same act on two portals at once, because
   the candidate side has always shown a TALENT AGENT doing the interviewing and
   the signing. A cohort leader takes cohort calls. Three consequences run
   through every file here, and each one is written up where it lands:

   1. `LEAD_SESSIONS` and `LEAD_EVALS` are gone, and the diary is derived from
      `LEAD_COHORTS` (`lcall` / `lcalls`, with `LEAD_RUN` for the calls already
      run). The note over those is the argument.
   2. `Sessions` is `Calls` — one rail slot, renamed and repointed, holding this
      week's three calls and the ones behind them. `V.leadCalls` in lead3.js.
   3. `Evaluations` is the 90-day summary alone. Its second queue and the whole
      of `V.leadEval` — Tal's competency read, the transcript quotes, the
      fifteen-rung picker and the override box — are deleted, not hidden.

   What survives untouched is point 2 above it: the leader is still measured on
   their candidates, and a summary that closes 90 days they were in the room for
   is still theirs to sign.
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

/* THE COVER IS KEYED BY LEVEL, NOT BY COHORT ID (Maryam, 1 Sep 2026, with three
   images). `COHORT_ART` is embedded by build.py — its note is the argument for
   the crop and the file order — and this is the whole of the lookup.

   BY LEVEL BECAUSE A FOURTH COHORT MUST NOT NEED A FOURTH FILE. There are three
   cohorts today and three covers, so keying on `c.id` would have worked and
   would have been a coincidence: the next cohort would land on `undefined`,
   which `crow`'s own note explains is worse than a missing image (an undefined
   `src` 404s on every render, which `respcheck` reads as a broken screen). The
   level is the one property of a cohort this build guarantees, and it also makes
   the assignment a RULE rather than three arbitrary pairings.

   THE FALLBACK IS E1, NOT NOTHING. `AGENTS.priya.range` is E1–E3 so nothing on
   this portal is outside it today, but a leader certified into the Builder band
   is the next thing this page will hold (the Certifications page says so in as
   many words), and a B-band cohort with no cover would be the blank square the
   paragraph above is about. `lc()` lowercases because the record's `level` is
   `E1` and the keys are `e1`. */
const cohortArt = c => COHORT_ART[String(c.level).toLowerCase()] || COHORT_ART.e1;

/* --------------------------------------------------------------------------
   THE CALLS THE LEADER RUNS — AND THERE IS ONLY ONE KIND OF APPOINTMENT

   A COHORT LEADER TAKES COHORT CALLS AND DOES NOT INTERVIEW ANYBODY (Maryam,
   1 Sep 2026: "a cohort leader will only be taking cohort calls, not
   interviewing the initial candidates, so please change this flow overall").
   `LEAD_SESSIONS` — five 45-minute level interviews, each with a face, a quiz
   score and a level to sign afterwards — is DELETED, and so is the whole
   assessment pipeline it fed (`LEAD_EVALS`, `V.leadEval`, `LDR_AN`, the level
   picker and the override box; lead3.js's head is the long version).

   THE INITIAL INTERVIEW IS THE TALENT AGENT'S AND THE PRODUCT ALREADY SAID SO.
   One portal over, Priya interviews the candidate, Priya signs the report, and
   the candidate enrols on the strength of it — `signedSummary` (§74) draws that
   report, `PAGESUM.assessed` dates it, and §73's whole argument is about the
   page it unlocks. A leader signing a level as well was one act performed twice
   by two people, and the leader's half was the half with no evidence under it:
   lead2.js tells them in as many words that "the full recording is never shared
   with you". What the leader keeps is the signature that is genuinely theirs —
   the 90-day summary, which closes thirteen weeks they were in the room for.

   THE DIARY IS DERIVED FROM `LEAD_COHORTS`, NOT STATED A SECOND TIME. Every
   fact about a weekly call — the day, the hour, which week of thirteen, how many
   candidates and at what level — is already on the cohort record that the
   Cohorts page, the roster and the candidate's own Cohort page all read. A
   parallel list of the same three appointments is exactly the drift `bkStamp`
   exists to prevent, so there is not one: `lcall(c)` is a VIEW of a cohort and
   `ord` is the cohort's own `callOrd` (an explicit sort key, because "Today" and
   "Mon" are human strings and parsing them into dates would be a date library's
   job on a fixed demo week).

   WHAT IS NOT DERIVABLE IS WHO TURNED UP. That, and only that, is written down.
   `LEAD_RUN` is the calls already run — cohort, week, the date in words, and the
   attendance — and the chapter each one covered is read off `CH` the way `lcall`
   reads it, because a call in week 4 covered chapter 4 and writing that down
   would be a fourth place for it to disagree. Cohort 47 is in week 1 and has no
   rows here at all, which is the empty half of the list the page has to draw
   anyway.
   -------------------------------------------------------------------------- */
const lcall = c => ({
  id:'c' + c.id, co:c.id, ord:c.callOrd, day:c.callDay, time:c.callTime,
  when:c.callDay + ' ' + c.callTime, mins:60,
  week:c.week, level:c.level, seats:c.members.length,
  chapter:CH[Math.min(12, c.week - 1)][0]
});
const lcalls = () => LEAD_COHORTS.map(lcall).sort((a,b) => a.ord - b.ord);
const lnext  = () => lcalls()[0];

const LEAD_RUN = [
  {co:41, week:4,  when:'Thursday 28 August', attended:9},
  {co:33, week:10, when:'Friday 22 August',   attended:7},
  {co:41, week:3,  when:'Thursday 21 August', attended:8},
  {co:33, week:9,  when:'Friday 15 August',   attended:8}
];
const LEAD_SUMMARIES = [
  {id:'m1', name:'Owen Clarke',  i:'OC', img:'owen', cohort:33, status:'pending'},
  {id:'m2', name:'Lena Fischer', i:'LF', img:'lena', cohort:33, status:'pending'}
];

/* ONE QUEUE, NOT TWO. This was level decisions plus summaries, and the note
   over `V.leadEvals` argued the pair well — "a level decision opens a
   candidate's 90 days; a 90-day summary closes them". Only the closing half is
   the leader's now, so the sum has one term. It is still a function rather than
   a literal because publishing a summary empties it live. */
const lpending = () => LEAD_SUMMARIES.filter(s => s.status === 'pending').length;

/* WHAT A CALL IS CALLED AND WHAT IT COMMITS YOU TO, stated once and read by
   three surfaces — the dashboard's black card, its Booked list and the Calls
   page. Two copies of these strings is the failure `bkStamp` exists to prevent
   on the candidate side, one portal over. */
const lcTitle  = k => 'Cohort ' + k.co + ' call';
const lcDetail = k => k.mins + ' minutes &middot; week ' + k.week + ' of 13 &middot; ' + k.chapter;

const lbooked = () => lcalls().map(k => ({
  ...k,
  t:lcTitle(k),
  d:k.seats + ' candidates at Explorer &ndash; ' + k.level + ' &middot; ' + lcDetail(k),
  go:'leadCalls'
}));

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
/* HOW MANY APPOINTMENTS THE DASHBOARD SHOWS (Maryam, 31 Aug 2026). Three, with
   "All calls" in the heading row for the rest — the full list is a page of its
   own and printing it twice made that link a route to the same content. Named
   rather than a literal at the call site because it is a decision about the
   DASHBOARD and not a fact about the data: it happens to equal the number of
   cohorts today, and a fourth cohort must not turn this section into the whole
   list with a link pointing at itself. `V.leadCalls` slices nothing. */
const BOOKED_SHOWN = 3;

const LEAD_JUMPS = [
  {id:'lead-cohorts',   ic:'group',      l:'Cohorts'},
  {id:'lead-attention', ic:'warningAlt', l:'Attention'},
  {id:'lead-waiting',   ic:'edit',       l:'Waiting on you'},
  {id:'lead-booked',    ic:'video',      l:'Calls'}
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
/* TWO OF THESE FIVE WERE THE INTERVIEWER'S AND BOTH ARE REPLACED IN KIND
   (1 Sep 2026). "Thomas Beck is waiting on a level decision" pointed at a queue
   that no longer exists; the summary it becomes is the signature that IS the
   leader's, and it still blocks somebody. "Femi Adebayo booked you for 4:30 PM"
   was the bookable-slot model in one line — nobody books a cohort leader now —
   so the calendar row is the appointment the leader actually has today, read off
   the same cohort record `lcall` reads. */
var LEAD_NOTIF = [
  {ic:'edit',       t:'Owen Clarke is waiting on his 90-day summary',b:'Cohort 33 closes next week. Nothing goes to his next agent until you publish it.', w:'25 min ago', go:'leadEvals',    unread:1},
  {ic:'warningAlt', t:'Yuki Tanaka has not signed in for 12 days',  b:'Cohort 41, week 5. Nine per cent through the chapters.',                w:'2h ago',     go:'leadReports',  unread:1},
  {ic:'chat',       t:'3 new posts in Cohort 41',                    b:'Chapter 4 came up again on the discussion board.',                     w:'4h ago',     go:'leadMessages', unread:1},
  {ic:'calendar',   t:'Cohort 41 meets today at 6:00 PM',            b:'Week 5 of 13. Sixty minutes, ten candidates.',                         w:'Today',      go:'leadCalls',    unread:0},
  {ic:'certificate',t:'Your fourth cohort completed',                b:'Cohort 26 closed with eight of ten promoted.',                         w:'Yesterday',  go:'leadCerts',    unread:0}
];

/* --- what Tal knows here -------------------------------------------------
   Read by `talPanel()` in views.js. Tal's ANSWERS are not ported: the router
   in views.js answers candidate questions with candidate widgets, and a
   leader-side router is its own piece of work. What the panel gets now is an
   accurate opener and leader-shaped suggestions, so nothing in it claims to
   know something it does not.                                             */
var LEAD_TAL = {   /* `var` for the reason given above LEAD_NOTIF */
  where: {leadDash:'Dashboard', leadCalls:'Calls', leadEvals:'Evaluations',
          leadCohorts:'Cohorts', leadReports:'Course reports', leadMessages:'Messages',
          leadCerts:'Certifications', leadProfile:'Your profile'},
  state: () => LEAD_COHORTS.length + ' cohorts, ' + lmembers().length + ' candidates, '
             + lpending() + ' summar' + (lpending()===1?'y':'ies') + ' waiting',
  ctx: {
    leadDash: ['Brief me for Thursday&rsquo;s call','Who should I worry about this week?','What is waiting on my signature?'],
    leadCalls: ['Brief me for tonight&rsquo;s call','Who missed the last one?'],
    leadEvals: ['Is Owen Clarke ready to be promoted?','What should the summary say?'],
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

   THE MARK IS A GROUP, AND IT IS NO LONGER A BRANCH (1 Sep 2026). This slot
   used to answer "who am I meeting" two ways — a face for an interview, a group
   for a cohort call — which is what made the two kinds distinguishable without a
   tag saying which. With interviews off the portal there is one kind left, so
   the face branch is deleted rather than left standing: a condition that is
   false every time it is evaluated is the "gate nothing writes" tell in JS. The
   argument survives as the reason the mark is `I.group` and not a photograph —
   for ten people it is not any one of them.

   THE CHIP IS ONE WIDTH FOR EVERY ROW, set in §31.5 — not sized to its own
   words. "TODAY", "TOMORROW" and "NOV 21" are three different lengths, so a
   chip that hugged its text started each row's face and title at a different
   x and the column read as ragged. A diary is scanned down the date and across
   the detail, and both of those need a straight edge.

   AN ARROW, NOT A VERB — the same argument `faceRow` above makes, and it
   applies here for one extra reason. The two words in this slot were "Join"
   and "Brief", which named the KIND of appointment as much as the action, and
   neither happened here: both opened another page. So the row is the target,
   it carries the arrow every openable row in this product wears. `go` survives
   on the row data; `cta` does not, because nothing prints it any more.
   -------------------------------------------------------------------------- */
function bookedRow(b){
  const mark = `<span class="cardrow-ic">${I.group}</span>`;
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
    <svg class="tile-arrow" viewBox="0 -960 960 960">${inner('arrowRight')}</svg>
  </button>`;
}

/* ==========================================================================
   THE NEXT COHORT CALL IS THE BLACK CALL CARD

   IT WAS THE NEXT INTERVIEW UNTIL 1 SEP 2026, and everything below about HOW it
   is drawn is unchanged — the card is still §75's `.dark-card` with §77's row in
   it, still directly after Tal's `.sec`, still the reason the summary has the
   band to itself. What changed is its SUBJECT: with interviews off this portal
   the leader's next appointment is a cohort call, so the card reads the same
   cohort record the Cohorts page and the roster read (`lcall`) instead of a
   session record that no longer exists.

   THREE THINGS THE NEW SUBJECT CHANGES, AND `crow` WAS ALREADY BUILT FOR ALL
   THREE — its own note names this card as the case it was widened for:

     the mark      a cohort is not a person, so the record carries `i:'41'` and
                   NO `img`. `crow` omits the `<img>` rather than writing an
                   undefined `src` (its note is the argument: a 404 on every
                   render is what `respcheck` reads as a broken screen), §71.405
                   normalises the `<i>` out of italic for exactly this row, and
                   §77/§63 §17 give the square the card's own register so a
                   label reads as a mark rather than as a failed photograph.
     the ONE ACTION is "Generate the brief", and it is the first action on this
                   card that actually does something. It was "All sessions" — a
                   way out of a set of one — and before that a Join that §81 had
                   to gate shut for twenty-three hours a day. The brief is
                   `data-ldrbrief="<id>"`, a SHEET rather than a route, which is
                   what `second.at` exists for; `go` still wins where a caller
                   has one.
     no tick       `v:false` for a new reason. It was "a candidate nobody has
                   assessed is not a checked identity"; now the subject is not
                   an identity at all.

   Maryam, 31 Aug 2026, on the shape itself:
   "The call card from the top will be out and will be next to the summary
   section. Just like the black call card we have on the candidate portal.
   Content will be the same just the ui changes."

   So this is a MOVE and a re-drawing, not a rewrite: every fact on the card is
   the fact the plate carried, in the same order, and the black card is §75's
   recipe with §77's row inside it. The candidate portal's `booked` dashboard
   is the reference and it is one call site of the same two layers.

   1. IT IS NOT A `.plate` ANY MORE, WHICH IS THE WHOLE OF "OUT OF THE TOP".
   `.plate` is in ai5's `DARK_CARD`, so `placeDark` lifted whichever page child
   contained it into the head band — that is why the card was at the top, above
   the four figures, in a 330px column beside Tal's sentence. `.dark-card` is in
   no pass's list (§75 exists so that a black card is one class and no
   machinery), so the section stays exactly where this view writes it.

   AND THE SUMMARY TAKES THE WIDTH BACK BY ITSELF. §56's two-column band is
   gated on `.modhead:has(> .sec-dark .plate)`; with no plate on the page the
   gate does not match and the band is `minmax(0,1fr)` — one column, full width,
   with nothing restated. That is the second half of the ask answered by the
   first half's mechanism.

   2. DIRECTLY AFTER TAL'S CARD, WHICH IS THE SLOT `talRec` AND `crow` BOTH TAKE
   ON THE CANDIDATE SIDE. §77's note is the argument: on `new` the page's next
   step is "book an interview", on `booked` it is "join the one you booked", and
   here it is "the cohort you meet next" — one slot, one object, three readings
   of the same sentence. It also has to be after Tal's `.sec` rather than before
   it: `placeBand`'s run walks forward from the `.ph` and stops at the first
   section that is not head furniture, so a card written between the two would
   leave Tal's summary in the page body (trap 11's neighbourhood).

   3. THE CONTENT IS ONE COHORT RECORD, ROW FOR ROW.

     `lcall(c)` reads              the card draws
     `callDay` + `callTime`        `.dc-when` in the heading row (§75)
     the cohort's id              `.dc-t` "Cohort 41 call" (`lcTitle`)
     the cohort's id              `.crow-ph`'s label + `.crow-n` at 78
     `members.length`, `level`    `.crow-role` "10 candidates at Explorer – E3"
     `week` + `CH[week-1]`        `.crow-x` (`lcDetail`, stated once)
     the brief sheet              `.crow-a`, one button

   4. THE JOIN IS GONE AND THE GATE WENT WITH IT (Maryam, 31 Aug 2026). §81 built
   `joinLive` because the button was live for fifty minutes a day and a control
   that looks pressable and is not reads as a broken page; the gate was the
   honest answer to that. What it could not fix is that the card then spent
   almost all of its life showing a DISABLED primary — §60's "a dead control on
   a live surface is worse than a missing one", arrived at from the other side.
   So the card's one action is the way onward, and `crow`'s `join:false` is
   where the shape of that is stated. It reads better still now that the one
   action DOES something: `callOpen` builds the CANDIDATE's interview, so every
   leader-side Join in this build is unwired (§60's note), and the brief sheet is
   the leader's real next move on a call sixty minutes long.
   §81'S MACHINERY IS NOT DELETED. `joinLive` / `joinArm` / `JOIN_NOW` still
   run for `crow`'s gated call sites and the layer's disabled treatment on
   `.dark-card` is what any future gated action there will want; this card
   simply stops asking for it. Removing the gate as well would be deleting a
   decision, not a button.
   ========================================================================== */
/* THE SECONDARY IS THE RECORD'S AND IT IS THE SAME ON BOTH PAGES NOW. It used
   to be the caller's, because "All sessions" from the Sessions page was a link
   to the page you were already on — the "gate nothing writes" tell wearing a
   different hat — so that page passed `second:false` and the card ended with no
   action at all. The brief is per-CALL rather than per-page, so it is correct on
   the dashboard and on Calls alike, and the parameter survives for a caller that
   genuinely has nothing to offer. */
const leadCall = (k, second) => ({
  who:{n:'Cohort ' + k.co, i:String(k.co), img:cohortArt(k)},
  role:`${k.seats} candidates at Explorer &ndash; ${k.level}`,
  x:lcDetail(k),
  xl:'',            /* the line is the appointment, not the cohort */
  v:false,          /* a cohort is not an identity, checked or otherwise */
  when:k.when, mins:k.mins,
  second:second === undefined
    ? {go:'leadCalls', ic:I.calendar, t:'View all calls'}
    : second
  /* no `kind`, so no `data-call` — see 4 above */
});

const leadCallCard = (k, o) => `<div class="sec dark-card crow-dark">
    <div class="dc-hd">
      <div class="dc-hd-r"><h2 class="dc-t">${lcTitle(k)}</h2>
        <span class="dc-when">${I.time}${k.when}</span></div>
    </div>
    ${crow(leadCall(k, (o || {}).second), {when:false, join:false,
      second:(o || {}).second === false ? false : undefined})}
  </div>`;

function faceRow(p, detail, go){
  return `<button class="tile clk gcard face-row" data-go="${go}">
    <span class="mem-av mem-ph">${avatar({i:p.i, img:AV[p.img]}, 36)}</span>
    <span class="gcard-b"><h3>${p.name}</h3><span class="sub">${detail}</span></span>
    <svg class="tile-arrow" viewBox="0 -960 960 960">${inner('arrowRight')}</svg>
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

   THE SESSION BECOMES A PLATE — AND SINCE 31 AUG 2026 IT IS THE BLACK CALL
   CARD INSTEAD, which is the same argument arriving at a component that did not
   exist when this was written. An appointment is a subject at a time that you
   join, and every one of those in this product WAS a `.plate` — the black wall
   with a face. `.plate` moves itself into the head band (`placeDark`), so the
   card sat above the four figures in a 330px column; Maryam took it out of the
   band and put it where the candidate portal puts the same object, directly
   under Tal's summary, as §75's `.dark-card` with §77's row in it. The note over
   `leadCallCard` is the long version. What survives from this paragraph is its
   conclusion: the card says "this is an appointment" without a heading having to
   say it, and it is still the only appointment drawn on the page — which since
   1 Sep 2026 is the next COHORT CALL, the only kind of appointment a cohort
   leader has.

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
    'lead-waiting':   [pend,                '90-day summaries'],
    'lead-booked':    [booked.length,       booked[0] ? 'next ' + booked[0].day.toLowerCase() + ' ' + booked[0].time.toLowerCase() : 'nothing booked']
  };

  /* Tal leads with whatever is most urgent, and the required action follows the
     same test the wireframe's banner used: a signature blocks a candidate, so
     it outranks a call that is still two days away.
     THE FIRST BRANCH IS SUMMARIES NOW, NOT LEVEL DECISIONS (1 Sep 2026), and it
     is still first for the same reason it always was — nothing about the person
     it names moves until the leader signs. The second branch is the call the
     card 40px below already draws, so it says the one thing the card does not:
     what the brief is FOR. */
  const s0 = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const talRead = pend
    ? {h:`${pend === 1 ? 'One summary is' : 'Two summaries are'} waiting on you`,
       p:`${s0.map(s => `<b>${s.name}</b>`).join(' and ')} finished the 90 days in Cohort ${s0[0].cohort}. Nothing reaches their next agent, and no level moves, until you publish what you saw.`,
       a:'leadEvals', ab:'Open evaluations'}
    : next
    ? {h:'Cohort ' + next.co + ' meets ' + next.day.toLowerCase(),
       p:`Week ${next.week} of 13, ${next.seats} candidates. I can pull a brief from where the cohort actually is rather than from where the syllabus says it should be.`,
       a:'leadCalls', ab:'Open calls'}
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
  ${next ? leadCallCard(next) : ''}
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
  ${''/* THE PLATE STOOD HERE AND IS NOW `leadCallCard(next)`, 60 lines up the
         page, directly under Tal's summary (Maryam, 31 Aug 2026). Two notes it
         carried are worth keeping where a reader of this view will look for
         them:

         NO "NEXT UP" LABEL, AND THE CARD STILL HAS NONE. The eyebrow was a
         category name over a card of one; what says "next" is the time at the
         right end of the heading row, which is `.dc-when`'s whole job on §75's
         card and was `data-when` + `placePlates` on the plate.

         "A PLATE'S BUTTON IS ONE OR TWO SHORT WORDS" NO LONGER APPLIES AND THE
         REASON IS THE GEOMETRY, NOT A CHANGE OF MIND. §56 gives the band's dark
         card `minmax(300px,330px)`, so a two-button row had about 250px to
         divide and "Join the interview" beside "All sessions" set BOTH labels on
         two lines (measured: 147 + 95 in a 250 row) — which is why this plate's
         button said `Join` and nothing else. §71 gives `.crow-a` two 185px
         buttons on a card that spans the page, so "Join call" and "All sessions"
         each sit on one line with room to spare. §56's rule is still the rule
         for anything that lands in that column. */}
  <div class="sec" id="lead-cohorts">
    <div class="sec-h"><h2>Your cohorts</h2><button class="btn btn-g btn-sm noic" data-go="leadCohorts">View all ${LEAD_COHORTS.length}</button></div>
    <div class="tile-stack">
      ${LEAD_COHORTS.map(c=>{
        const b = c.members.filter(m=>m.flag&&m.flag.k==='bad').length;
        const ahead = lavg(c,'pc') >= lpace(c);
        return gcard('cohort', lname(c)+' &middot; '+llevel(c), 'Week '+c.week+' of 13',
          `${c.call} &middot; ${lavg(c,'pc')}% average progress against ${lpace(c)}% expected`
          + (b?` &middot; ${b} at risk`:ahead?' &middot; on pace':''), 'leadCohorts',
          {src:cohortArt(c), i:String(c.id)});
      }).join('')}
    </div>
  </div>
  <div class="sec tint" id="lead-attention">
    <div class="sec-h"><h2>Needs attention</h2><span class="t-helper-01">From course activity, not from you</span></div>
    <div class="lead-tools">
      <div class="srch lead-srch">
        <svg class="mag" viewBox="0 -960 960 960">${inner('search')}</svg>
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
      ${LEAD_SUMMARIES.filter(s=>s.status==='pending').map(s=>
        faceRow(s, `90-day summary &middot; Cohort ${s.cohort} &middot; sign to close their 90 days`, 'leadEvals')).join('')}
    </div>`:`<div class="empty" style="border:0">${I.checkFilled}<h3>Nothing outstanding</h3><p>Every 90-day summary is published.</p></div>`}
  </div>
  <div class="sec tint" id="lead-booked">
    ${''/* THE WAY OUT MOVED INTO THE HEADING ROW AND THE SENTENCE CAME OFF
           (Maryam, 31 Aug 2026). "Interviews and cohort calls, in the order
           they happen" described the list underneath it, which the list
           already says — every row names its kind and the dates run down
           the page. The slot it held is where this section's control
           belongs, and `Your cohorts` 50 lines up already states that shape
           (`.sec-h` › `<h2>` + `.btn-g.btn-sm.noic`), so this is the page
           agreeing with itself rather than a new arrangement.
           "Your availability" is GONE from the page, not moved — it is a
           profile setting, reachable from the account menu and from
           `leadProfile` itself, and it was the second of two buttons under
           a list whose own action is on every row. */}
    <div class="sec-h"><h2>Your calls</h2><button class="btn btn-g btn-sm noic" data-go="leadCalls">All calls ${I.arrowRight}</button></div>
    ${''/* THE HEADING IS "YOUR CALLS", NOT "BOOKED" (1 Sep 2026). "Booked" was
           the right word for a diary holding two kinds of thing — an interview
           somebody else took a slot for and a call that repeats every week —
           and it was chosen precisely because a leader reading it "is asking
           about their diary, not about one of the two kinds". With one kind
           left, the word that named the merge names nothing, and nobody books
           a cohort leader. The count in the card above it is unchanged.

           `BOOKED_SHOWN` STILL EARNS ITS NAME with three cohorts and three
           calls, because it is a decision about the DASHBOARD rather than a
           fact about the data: a fourth cohort is a fourth call, and the day
           that happens this section must not silently become the whole list
           again with "All calls" pointing at itself. */}
    ${booked.length?`<div class="tile-stack">
      ${booked.slice(0, BOOKED_SHOWN).map(bookedRow).join('')}
    </div>`:`<div class="empty" style="border:0">${I.calendar}<h3>Nothing this week</h3><p>Every cohort you lead has a weekly call, and they all show up here.</p></div>`}
  </div>
  ${''/* "YOUR STANDING" IS OFF THE DASHBOARD (Maryam, 31 Aug 2026), AND IT
         IS NOT LOST — `V.leadProfile` (lead4.js) draws the same four figures
         under the same heading, which is where a record of your own belongs:
         the dashboard is a queue of what needs you today, and a lifetime
         rating sitting under it was the one section that asked for nothing.
         `leadStick`'s exit trigger moved with it — see the note there. */}
</div></main>`;
};

/* ==========================================================================
   ALL SEVEN MODULES ARE DRAWN, AND NOT IN THIS FILE

   This is where `LEAD_SOON` used to be: seven "coming in the next pass" empty
   states, one per module, so that a rail offering seven modules from the first
   paint was not offering seven dead ends. All seven are now real pages, and
   four more sit under them:

     lead2.js   Cohorts, one cohort's roster, one candidate, Course Reports
     lead3.js   Calls, Evaluations, one 90-day summary
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

  /* THE BAR LEAVES WHEN THE LAST COUNTED SECTION IS FULLY ON SCREEN.

     THE ANCHOR USED TO BE "YOUR STANDING" AND THAT SECTION IS GONE (Maryam,
     31 Aug 2026). The rule it encoded still holds — the bar goes when it has
     nothing left to point at — but the thing that made Your standing the right
     anchor was that no card counted it: it sat AFTER the last queue, so
     reaching it meant the queues were behind you. With it removed, Booked is
     both the last queue and the end of the page, so the anchor is Booked
     itself. The reading is the same one step earlier: once the final queue is
     fully on screen, the bar is pointing at what you are already looking at.

     "Fully visible" rather than "has reached the bar", and that is the half of
     this worth keeping: the anchor is the LAST thing on the page, so at the
     very bottom of the scroll its top is still well down the window. A trigger
     waiting for it to reach the top is one the page can never reach, and the
     first version of this never fired once. `bottom <= mr.bottom` is what
     makes it reachable, and it is why this survived the anchor moving.

     Gated on `stuck` because on a window tall enough to show the whole page at
     once, every section is always fully visible — and an unstuck bar sitting in
     its own flow position must not hide, or the page has a hole where its
     figures should be.

     NOT `LEAD_JUMPS[LEAD_JUMPS.length-1]`, which would be the clever version:
     the bar's own list is what decides which sections it POINTS at, and tying
     the exit to it would mean a future card added to that list silently moves
     the exit too. The anchor is a judgement about the page's last section. */
  const stand = device.querySelector('#lead-booked');
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
