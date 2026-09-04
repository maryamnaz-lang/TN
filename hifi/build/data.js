
const LOGO_K = 'data:image/png;base64,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';

const LOGO_W = 'data:image/png;base64,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';

const LOGO_D = 'data:image/png;base64,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';

const STAGES = [
  /* TEMPORARY, and first because it happens first. Everything a candidate did
     before TalentNext had heard of them: the What's Next quiz, the phone
     check, the result, the talent-consultant form. Its last button lands on
     `signup`, so the whole journey reads top to bottom in this list. Remove
     the row with nil.js and 30-nil.css. */
  ['nil',     'Next in Leadership run-up','The quiz, the result and the consultant form, before TalentNext.'],
  ['signup',  'Account creation',      'Credentials, consent and email verification.'],
  /* THE FIRST THING THAT HAPPENS INSIDE THE PRODUCT IS A CONVERSATION, AND IT
     IS TAL'S NOW (Maryam, 3 Sep 2026). The row below this one is the same
     argument with a person in it, and it is the one this replaces: `new` opens
     by asking a four-second-old member to choose and pay a talent agent, so
     something has to take the reading first. The consultant did it on a
     fifteen-minute call; Tal does it on five screens, and keeps the answers.

     IT IS A STAGE RATHER THAN A GATE ON `new`, because the stage picker is
     this prototype's whole demo mechanism — a screen nobody can walk to is a
     screen nobody can be shown. ob.js is the flow, §107 draws it, and the row
     above it is where it is entered from: `verify`'s Verify & Continue. */
  ['onboard', 'Tal onboarding',        'Account created, quiz carried over. Tal takes the reading the consultant call used to take &mdash; no level set, no agent booked.'],
  /* THE SAME STEP, WITH A PERSON IN IT — SUPERSEDED BY `onboard` ABOVE.
     `new` used to be the landing stage, and it opens by asking the candidate
     to choose and pay an agent — the biggest decision on the ladder, put to
     someone who has been a member for four seconds. A talent consultant
     screens first: fifteen minutes, free, and it sets nothing. So the stage
     between them is not a waiting room, it is the step where the product
     explains itself. `new` becomes what it always described — quiz result
     carried over, consultant call done, interview still to book. */
  /* HIDDEN FOR NOW — see `STAGES_HIDDEN` under this list. The row stays where
     it is because it is where the journey is written down, and the stage still
     works in full; it is simply not offered. */
  ['consult', 'Consultant call',       'Account created and a 15-minute screening call booked. Quiz result carried over; no level and no agent interview yet.'],
  ['new',     'Just joined',           'Quiz result carried over. Nothing booked. Navigation at its smallest, four items.'],
  ['booked',  'Interview booked',      'Waiting for the interview, with preparation offered.'],
  ['assessed','Levelled, not enrolled','Report signed, level confirmed at E3. Enroll appears in the nav.'],
  ['week1',   'Week 1',                'Cohort 41 has started. Full navigation, eight items. Nothing done yet.'],
  ['day34',   'Day 34',                'Mid-course. Chapter 4 has stalled and one task is overdue.'],
  ['day90',   'Day 90, course finished','All 13 chapters done. The re-interview unlocks now.'],
  ['promoted','Promoted to E4',        'Cohort closed, level moved up one, next course offered.'],
  /* TEMPORARY, AND LAST BECAUSE IT IS NOT PART OF THE JOURNEY (Maryam,
     31 Aug 2026). A frozen copy of Day 34 drawn in solid #FF0000, to show
     somebody what a red accent looks like. It sits after `promoted` rather
     than beside `day34` for exactly that reason: the nine rows above it read
     top to bottom as one candidate's ninety days, and a demo of a colour is
     not a step in that.

     IT IS A FORK, NOT AN ALIAS, and that is the whole point of it. Every
     stage-keyed record day 34 owns is COPIED here rather than shared —
     `CFG`, `NOTIF`, `GAME`, `WEEKLY` below, `PAGESUM` in ai6.js and `NEXT`
     in ai8.js — so editing day 34's content leaves this untouched and
     editing this one leaves day 34 untouched. See `RED_DEMO` under the
     hidden-stages note for what IS still shared and why.

     TO DELETE IT COMPLETELY: this row, the four records below, `RED_DEMO`
     and `isDay34` under them, the two records in ai6.js / ai8.js, the eight
     `isDay34(S.stage)` call sites in views.js (back to `S.stage==='day34'`),
     and the one row in `TMP_ACCENT_ON`. Nothing else was touched. */
  ['reddemo', 'Red Accent Demo',       'A frozen copy of Day 34 in solid #FF0000. Temporary, for a demo &mdash; nothing else in the product links to it.']
];

/* ==========================================================================
   STAGES THAT ARE NOT OFFERED YET

   `consult` — the talent-consultant call — is hidden for now. Every part of it
   still exists and still works: `CFG.consult`, the dashboard branch in
   views.js, `PAGESUM.consult`, its stepper and its quiz block. What it does not
   have is a way in.

   A SET RATHER THAN A DELETED ROW, and rather than a fourth column on the row.
   The row is where the journey is documented — the note above `consult`'s own
   entry is the argument for why the product opens with a conversation, and
   deleting it would delete the reasoning along with the stage. A fourth column
   would change the shape every consumer destructures (`STAGES.find`,
   `.map(([k,l]) => …)`). One name in one set is the whole change, and taking it
   out again is the whole revert.

   IT IS ENFORCED IN `setStage`, NOT AT THE THREE CALL SITES. Three things
   navigate to a stage — the picker, the arrow keys, and `data-go="stage:…"` on
   a button (the OTP screen's "Verify & Continue" lands here) — plus the boot
   reader, which will happily restore `#consult/dashboard` from someone's
   bookmark. Filtering the picker alone would leave three ways in and a picker
   showing a blank value when one of them was used. `setStage` is where every
   one of those converges, so hiding it there is what makes it actually hidden.

   RESOLVED FORWARD, not bounced to a default: a hidden stage hands you the next
   VISIBLE stage in the list, which is the one the journey would have gone to
   next anyway. So signing up still lands you at the start of the product
   (`new`) rather than on a dashboard chosen by a fallback.
   ========================================================================== */
const STAGES_HIDDEN = new Set(['consult']);

/* the list every stage control should be built from */
const stagesShown = () => STAGES.filter(([k]) => !STAGES_HIDDEN.has(k));

/* the next visible stage at or after `k` — and the last visible one if `k` is
   hidden and everything after it is too, so this can never return undefined */
function stageResolve(k){
  if(!STAGES_HIDDEN.has(k)) return k;
  const i = STAGES.findIndex(s => s[0] === k);
  for(let j = i + 1; j < STAGES.length; j++)
    if(!STAGES_HIDDEN.has(STAGES[j][0])) return STAGES[j][0];
  const shown = stagesShown();
  return shown.length ? shown[shown.length - 1][0] : k;
}


/* ==========================================================================
   THE RED ACCENT DEMO — WHAT IS FORKED AND WHAT IS SHARED

   `reddemo` copies day 34's CONTENT and shares day 34's VIEW CODE, and the
   line between those two is worth stating plainly because it is the whole of
   what "not linked to anything else" can honestly mean here.

   FORKED — every stage-keyed record, written out in full rather than derived
   from day 34's. Six of them: `CFG`, `NOTIF`, `GAME` and `WEEKLY` in this
   file, `PAGESUM` in ai6.js, `NEXT` in ai8.js. A copy TAKEN AT RUNTIME
   (`{...CFG.day34}`) would have been three characters instead of forty lines
   and would have re-linked the two by construction — the demo would follow
   every later edit to day 34, which is the one thing it was asked not to do.
   So the values are typed out. They are allowed to drift; that is the point.

   SHARED — `views.js` itself. Eight branches there ask "is this day 34?" to
   decide seven facts the mock has nowhere else to put: chapter 4's `12 of 70
   min · 4 opens`, its in-progress bar, `1 of 3` tasks this week, `4 of 5` on
   time, one overdue, 12 minutes done, and whether the dashboard reads as
   stalling. `isDay34` is the ONE place that question is asked, so the demo
   answers it the same way day 34 does and the two pages draw identically
   today. A change to how those SEVEN facts are DRAWN reaches both pages; a
   change to any stage's data reaches one. If the demo ever needs a rendering
   of its own, the move is to lift those seven literals onto the `CFG` record
   — where they arguably belong anyway — not to add a second branch here.

   TEMPORARY. See the note on the `reddemo` row in `STAGES` for the whole
   removal list.
   ========================================================================== */
const RED_DEMO = 'reddemo';

/* the stage that draws mid-course-and-stalled. Two answer yes. */
const isDay34 = s => s === 'day34' || s === RED_DEMO;


const CFG = {
  /* the run-up has no product chrome at all — no rail, no app bar — but
     cfg() and setStage() both read `nav`, so it names the smallest set and
     never draws it. */
  nil:     {nav:'early',  track:'Explorer', pred:true},
  signup:  {nav:'early',  track:'Explorer', pred:true},
  /* THE ONBOARDING DRAWS NO CHROME EITHER — ob.js takes the whole frame the
     way the auth card does — but `cfg()` and `setStage()` both read `nav`, so
     it names the smallest set and never draws it, exactly as `nil` and
     `signup` do above.

     `pred:true` IS THE FOURTH BOUNDARY IN ob.js's HEAD, EXPRESSED AS DATA.
     The shell reads it to print "Explorer track" rather than a level, and the
     one thing this stage must never claim is a level: Tal takes the reading,
     the agent interview sets the rung. `booked:false` because nothing is. */
  onboard: {nav:'early',  track:'Explorer', pred:true,  booked:false},
  /* `pred:true` — the shell reads it to print "Explorer track" rather than a
     level, and that is exactly right here: the consultant call sets nothing.
     `booked:false` too, because `booked` means the AGENT interview is booked
     and it is not; the consultant call is a different appointment and the
     dashboard names it separately rather than borrowing that flag. */
  consult: {nav:'early',  track:'Explorer', pred:true,  booked:false},
  new:     {nav:'early',  track:'Explorer', pred:true,  booked:false},
  booked:  {nav:'early',  track:'Explorer', pred:true,  booked:true},
  assessed:{nav:'assessed',track:'Explorer',level:'E3',pred:false},
  week1:   {nav:'full',   track:'Explorer', level:'E3', pred:false, enrolled:true, day:4,  week:1,  done:0,  open:0, avg:null, mins:0},
  day34:   {nav:'full',   track:'Explorer', level:'E3', pred:false, enrolled:true, day:34, week:5,  done:5,  open:3, avg:75,   mins:260},
  day90:   {nav:'full',   track:'Explorer', level:'E3', pred:false, enrolled:true, day:90, week:13, done:13, open:12, avg:83,  mins:700, reinterview:true, finished:true},
  promoted:{nav:'next',   track:'Explorer', level:'E4', pred:false, complete:true, day:90, week:13, done:13, avg:83, mins:700},
  /* THE RED ACCENT DEMO — day 34's record, copied. Typed out rather than
     spread from `CFG.day34` so the two can be edited apart; see `RED_DEMO`. */
  reddemo: {nav:'full',   track:'Explorer', level:'E3', pred:false, enrolled:true, day:34, week:5,  done:5,  open:3, avg:75,   mins:260}
};

const CFG_BASE = {track:'Explorer', level:'E3', pred:true, day:1, week:1, done:0, open:0, avg:null, mins:0};


/* ==========================================================================
   "LEVEL", NOT "RUNG" — AND WHY THIS CONSTANT STILL SAYS RUNG

   The product used to call a position on the ladder a RUNG: "rung 3 of 15",
   "you move up a rung", "sign the rung". Every one of those strings now says
   LEVEL, on the client's instruction, across the hi-fi portal and the two
   earlier prototypes — one word for the thing, everywhere a person can read
   it, including the leader's evaluation form and Tal's answers.

   THE CODE KEEPS THE OLD SPELLING, DELIBERATELY, in four places: `RUNG` and
   `rungOf` here and in views.js, and the class name `.tw-rungs`. Two of the
   four were `LDR_RUNGS` / `ldrRungView` and `.ldr-rungs`, the leader's
   fifteen-level picker, and all three are deleted with the level decision
   (1 Sep 2026 — a cohort leader does not interview, so nothing on that portal
   sets a level). Two reasons for the two that remain, and the second
   is the real one:

   1. A class name and a variable are not product language. Renaming them
      changes nothing a person sees and touches six files, four of which are
      stylesheets that would then have to be kept in step with the JS.
   2. "Level" is now doing two jobs — `f.level` is the CODE ("E3") and
      `rungOf(f.level)` is the POSITION (3). Calling both `level` in the same
      expression is how a reader ends up passing one where the other was
      meant. The old word survives in code precisely because it still
      distinguishes them, and this note is what stops the next reader
      "finishing" the rename.
   ========================================================================== */
const RUNG = {E1:1,E2:2,E3:3,E4:4,E5:5};


const CH = [
  ['Why We Exist',45],['The Operator Mindset',60],['Reading the Room',50],
  ['Delegation Without Drop-Off',70],['Hard Conversations',55],['Building Trust at Speed',60],
  ['Decisions Under Incomplete Information',65],['Managing Up',50],['Feedback That Lands',55],
  ['Running the Weekly Rhythm',45],['Conflict and Repair',60],['Coaching vs Fixing',55],
  ['Leading Through Change',60]
];

/* THE THIRTEEN ASSESSMENT SCORES, AND THE FIRST FIVE WERE RESHAPED TO THE
   CURVE MARYAM DREW (2 Sep 2026: "the graph first point starts from 75%", "the
   red point should be at 50%", "the last point should be the top point").

   THE SHAPE IS SET HERE RATHER THAN IN THE CHART, WHICH IS THE WHOLE POINT.
   `perfChart` plots `SCORE.slice(0, f.done)` and eight other surfaces read the
   same array — the per-chapter rows on Course Progress, the scores sheet,
   `perfInsight`, the pulse's standing, and every Tal summary that says "5 of 13
   chapters at N%". Giving the chart its own numbers would have made the
   drawing disagree with the table under it, which is the one thing this build
   does not allow. One record, nine readers, so the curve is the data.

   WHAT THE FIVE NOW SAY: 75, 80, 78, 50, 92. The first point opens at 75, the
   low is 50 at chapter 4 and the fifth is the highest — the three positions
   asked for, and nothing between them was invented beyond the two middle
   values that make the line read as a dip rather than a step.

   CHAPTER 4 BEING THE FLOOR IS NOT A COINCIDENCE AND IS WORTH KEEPING. It is
   `Delegation Without Drop-Off`, it is `GROWTH[0]`, it is one of the two
   `RPT_GROWTH` focus areas, and `SCORES` puts Delegation at 41 on the quiz —
   the lowest of the five bands. So a 50 here is the same story the quiz, the
   report and the course all already tell, and `perfInsight` names it without
   being told to.

   AND THE THIRTEENTH WENT 89 -> 94 SO THE RULE HOLDS AT DAY 90 TOO. "The last
   point should be the top point" is a statement about the line, and the line
   is five points on day 34 and thirteen on day 90; leaving 89 there would have
   made the shape true on one stage and false on the other, with the green halo
   jumping back to chapter 5.

   THE CONSEQUENCE IS REAL AND IS NOT HIDDEN: day 34's average falls 88 -> 75,
   which is BELOW the cohort's 79. Every surface follows by derivation (`CFG`'s
   `avg` is restated below, and the Tal summaries template it), and it fits the
   stage rather than fighting it — day 34 is the stalling dashboard, the one
   with a chapter opened four times unfinished and a task overdue. Day 90 lands
   at 83, so the 90 days still read as a recovery. */
const SCORE = [75,80,78,50,92,90,83,88,91,85,87,84,94];

const OPEN_DATES = ['','','','','','Mon, Aug 18','Mon, Aug 25','Mon, Sep 1','Mon, Sep 8','Mon, Sep 15','Mon, Sep 22','Mon, Sep 29','Mon, Oct 6'];

const GROWTH = [3,4,11];

const NOTIF = {
  /* Two unread, and neither of them is an instruction: the call is booked and
     the quiz result travelled with the account. There is nothing for the
     candidate to do at this stage, which is the stage's whole character, so
     the bell reports facts rather than tasks. */
  consult:[
    {ic:'calendar',   t:'Your consultant call is booked', b:'Jordan Blake, Thursday, August 13 at 2:00 PM ET. A calendar invite is on its way.', w:'1h ago',    go:'dashboard', unread:1},
    {ic:'trophy',     t:'Your quiz result carried over',  b:'You are on the Explorer track. Your level comes later, from an agent interview.',   w:'3h ago',    go:'level',     unread:1},
    {ic:'checkFilled',t:'Account created',                b:'Welcome to TalentNext, Maryam.',                                                    w:'Yesterday', go:'account',   unread:0}
  ],
  new:[
    {ic:'trophy',   t:'Your quiz result is in',       b:'You are on the Explorer track. An interview sets your level.', w:'2h ago', go:'level',      unread:1},
    {ic:'calendar', t:'3 agents have slots this week',b:'Booking early usually means starting a cohort inside 10 days.', w:'5h ago', go:'agents',     unread:1},
    {ic:'checkFilled',t:'Account created',            b:'Welcome to TalentNext, Maryam.',                               w:'Yesterday', go:'account', unread:1}
  ],
  booked:[
    {ic:'calendar', t:'Interview confirmed',          b:'Priya Nair, Thursday, August 20 at 6:30 PM ET.',                 w:'1h ago', go:'interviews', unread:1},
    {ic:'email',    t:'Calendar invite sent',         b:'Check maryam.naz@tkxel.io for the joining link.',               w:'1h ago', go:'interviews', unread:1},
    {ic:'creditCard',t:'Payment received',            b:'$95 for your interview. Receipt in Payments.',                 w:'Yesterday', go:'billing',  unread:0}
  ],
  assessed:[
    {ic:'document', t:'Your report is ready',         b:'Priya confirmed you at Explorer – E3 and signed it off.',      w:'3h ago', go:'report',     unread:1},
    {ic:'ticket',   t:'Enrollment is open',            b:'Cohort 41 starts in 6 days and has 7 places left.',            w:'3h ago', go:'enrol',      unread:1},
    {ic:'video',    t:'Interview recording available',b:'Yours to watch or delete at any time.',                        w:'Yesterday', go:'report',  unread:0}
  ],
  week1:[
    {ic:'book',     t:'Chapter 1 is unlocked',        b:'Why We Exist. 45 minutes, opens in LightSpeed VT.',            w:'Today', go:'coursework',  unread:1},
    {ic:'group',    t:'First cohort call on Thursday',b:'6:00 PM ET with Priya Nair and 9 others.',                      w:'Today', go:'cohort',      unread:1},
    {ic:'trophy',   t:'250 points awarded',           b:'1-Star rank. You are a member of Cohort 41.',                  w:'Yesterday', go:'rewards', unread:1}
  ],
  day34:[
    {ic:'warning',  t:'Week 4 reflection is overdue', b:'It was due Monday. Priya can see it on her roster.',           w:'2h ago', go:'coursework',  unread:1},
    {ic:'group',    t:'Weekly call in 2 days',        b:'Thursday 6:00 PM ET. Week 5 covers hard conversations.',        w:'Today', go:'cohort',      unread:1},
    {ic:'trophy',   t:'25 points awarded',            b:'Chapter completion. You are 1,405 points from Bronze.',        w:'Today', go:'rewards',     unread:1},
    {ic:'chat',     t:'Priya replied',                b:'“Bring the vendor review example on Thursday.”',               w:'Yesterday', go:'messages', unread:0},
    {ic:'book',     t:'Chapter 5 opens Monday',       b:'Hard Conversations. 55 minutes.',                              w:'3 days ago', go:'coursework', unread:0}
  ],
  day90:[
    {ic:'calendar', t:'Your re-interview is available',b:'The 90 days are complete. Book it to have them assessed.', w:'Today', go:'agents',      unread:1},
    {ic:'document', t:'Your 90-day summary is ready to read',b:'Priya signs it once the re-interview is booked.',       w:'Today', go:'transcript',  unread:1},
    {ic:'checkFilled',t:'Course complete',           b:'All 13 chapters done, 83% average.',                           w:'Yesterday', go:'transcript', unread:1}
  ],
  promoted:[
    {ic:'trophy',   t:'Promoted to Explorer – E4',    b:'Priya signed the decision on November 21.',                    w:'Today', go:'level',       unread:1},
    {ic:'certificate',t:'Certificate available',      b:'Explorer Track – E3, Cohort 41. Yours to download and share.', w:'Today', go:'transcript',  unread:1},
    {ic:'ticket',   t:'Explorer Track – E4 opens December 1',b:'Cohort 58 has 7 places left.',                          w:'Yesterday', go:'enrol',    unread:0}
  ],
  /* THE RED ACCENT DEMO — day 34's five, copied. See `RED_DEMO` in this file. */
  reddemo:[
    {ic:'warning',  t:'Week 4 reflection is overdue', b:'It was due Monday. Priya can see it on her roster.',           w:'2h ago', go:'coursework',  unread:1},
    {ic:'group',    t:'Weekly call in 2 days',        b:'Thursday 6:00 PM ET. Week 5 covers hard conversations.',        w:'Today', go:'cohort',      unread:1},
    {ic:'trophy',   t:'25 points awarded',            b:'Chapter completion. You are 1,405 points from Bronze.',        w:'Today', go:'rewards',     unread:1},
    {ic:'chat',     t:'Priya replied',                b:'“Bring the vendor review example on Thursday.”',               w:'Yesterday', go:'messages', unread:0},
    {ic:'book',     t:'Chapter 5 opens Monday',       b:'Hard Conversations. 55 minutes.',                              w:'3 days ago', go:'coursework', unread:0}
  ]
};

const NAVSETS = {
  early:   [['dashboard','Dashboard','dashboard'],['level','My Level','growth'],['interviews','Interviews','calendar'],['billing','Payments','wallet']],
  assessed:[['dashboard','Dashboard','dashboard'],['level','My Level','growth'],['interviews','Interviews','calendar'],['enrol','Course Enrollment','ticket'],['billing','Payments','wallet']],
  /* THE MODULE IS "ACHIEVEMENTS" AND THE CURRENCY IS STILL "POINTS" (Maryam,
     31 Aug 2026). The rename is the module's NAME — this label, the page's
     `ph()`, its `crumb()`, Tal's `where` map and the "Open Achievements" button
     — and it stops there. Every other "Points" in the build is the unit: the
     `.score-pts` label, `statCell`'s figure on the promoted dashboard, the
     `.stand-l` row in the pulse, and `PAGESUM.rewards`'s "Points come from
     signing in, chapters and cohort posts". Renaming those would make the
     sentences false — achievements do not come from signing in, points do, and
     the page is where the two meet. The key stays `rewards`, which is neither
     word and is what `PARENT`, `TALCTX` and every `data-go` already use. */
  full:    [['dashboard','Dashboard','dashboard'],['level','My Level','growth'],['coursework','Coursework','book'],['transcript','Course Progress','chart'],['rewards','Achievements','trophy'],['cohort','Cohort','group'],['messages','Messages','chat',1],['interviews','Interviews','calendar'],['billing','Payments','wallet']],
  next:    [['dashboard','Dashboard','dashboard'],['level','My Level','growth'],['transcript','Course Progress','chart'],['rewards','Achievements','trophy'],['enrol','Next course','ticket'],['interviews','Interviews','calendar'],['billing','Payments','wallet']],
  /* THE COHORT LEADER'S SEVEN MODULES, ported from the Cohort Leader portal in
     tn-portals.html. Same order, same names, with one correction the wireframe
     already made and this set keeps: there is no Earnings module. A cohort
     leader volunteers — they are unpaid, and what they earn is the
     certification. So `wallet` never appears on this rail, and no page under it
     shows a fee. Every key is prefixed `lead` because these views live in the
     same `V` registry as the candidate's and `messages` is a page in both.

     THE SECOND SLOT IS "UPCOMING SESSIONS" (Maryam, 2 Sep 2026), and it is the
     third name that slot has had. It was Sessions when the leader interviewed
     candidates, became Calls on 1 Sep when they stopped (a cohort leader takes
     cohort calls and interviews nobody — lead.js's head is the argument), and
     is now Upcoming Sessions. The KEY is `leadCalls` throughout and does not
     move: it is in `PARENT`, in five `data-go`s and in `PAGESUM`, and a rail
     label is a word on a screen while a key is a contract between files.
     FOUR OTHER PLACES NAME THE MODULE and all four follow, because `pageLabel`
     (ai11) reads THIS label for the breadcrumb and a page whose trail says
     "Upcoming Sessions" must not be introduced anywhere as "Calls":
     `V.leadCalls`'s own `crumb()` and `ph()` (lead3), `LEAD_TAL.where` (lead.js)
     and the button on `V.leadProfile` (lead4). The two buttons that POINT at it
     — the black card's "View all sessions" and the dashboard section's "All
     sessions" — follow the same rule lead.js records for that pair: the label
     is the destination.
     WHAT DOES NOT FOLLOW IS THE PROSE. A cohort call is still a call, so
     `PAGESUM.leadCalls`, `lcTitle`'s "Cohort 41 call" and the dashboard's own
     "Cohort Calls" heading are unchanged — the module is being named, not the
     thing it holds. */
  leader:  [['leadDash','Dashboard','dashboard'],['leadCalls','Upcoming Sessions','calendar'],['leadEvals','Evaluations','edit'],['leadCohorts','Cohorts','group'],['leadReports','Course Reports','chart'],['leadMessages','Messages','chat',2],['leadCerts','Certifications','certificate']]
};

const PARENT = {report:'level', result:'level', agents:'interviews', agent:'interviews',
                booking:'interviews', chapter:'coursework', payment:'enrol', terms:'account',
                /* the enrolment confirmation is the far end of Enroll → Payment
                   and keeps the same rail entry lit; it does not move the stage
                   (its own note says why), so the module it belongs to is still
                   the one you paid from */
                welcome:'enrol',
                /* leader sub-pages, so the rail keeps the module lit while you are inside one */
                leadCohort:'leadCohorts', leadMember:'leadCohorts'};

const AV = {
  priya:'data:image/jpeg;base64,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',
  owen:'data:image/jpeg;base64,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',
  lena:'data:image/jpeg;base64,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',
  samuel:'data:image/jpeg;base64,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',
  hana:'data:image/jpeg;base64,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'
};

const AGENTS = {
/* TWO FIELDS THE AGENTS TABLE NEEDS, AND THEY ARE THE REFERENCE'S OWN NUMBERS
   (Maryam, 3 Sep 2026: "for the agents screen, I want you to use the reference
   design"). That design draws a six-column table and two of its columns had no
   record behind them — a row of skill chips and a years-of-experience figure.

   THE REFERENCE WAS DRAWN ON THIS DATA, WHICH IS WHY ALMOST NOTHING IS
   INVENTED. Its six rows carry OUR interview counts to the number — 210, 164,
   98, 143, 121, 176 — our ratings, our ranges, our next slots and our prices.
   So `yrs` and the first three of each `tags` are transcribed from the drawing
   rather than made up, in the same way §110's chapter list is transcribed from
   `CH`.

   WHAT IS AUTHORED IS THE OVERFLOW, AND IT IS EIGHT STRINGS. The reference
   shows three chips and a `+1` (a `+2` for Samuel), so the hidden ones had to
   be named for the count to be true — a `+1` over a list with nothing in it is
   the invented figure §74 rules out, one level down. Owen's and Lena's are not
   authored at all: they are `REC.owen.expertise` and `REC.lena.expertise`
   verbatim, so the chip a reader uncovers is the phrase the recommendation card
   already uses for them.

   PRIYA'S IS THE ONE THAT IS NOT, AND THE DISAGREEMENT IS PRE-EXISTING.
   `REC.priya.expertise` is 'System Architecture' while her bio is "fifteen
   years running operations teams in logistics" and the reference's three chips
   for her are Leadership / Strategy / Communication. Following the derivation
   here would put a fourth voice on her row, so her overflow is 'Operations',
   which is her bio's word. `REC` is untouched — it has readers in `ai6` and on
   `V.agent` — and the conflict is flagged rather than settled here.

   `yrs` IS A STRING, NOT A NUMBER, because one of the six is '2.5' and the
   column prints it verbatim; a number would need formatting logic for one row.
   The pair reads as a cell — the years over `ivs` — so the two must not
   disagree in spirit: Lena is the long-serving one with the fewest interviews
   (4 yrs, 98) and that is the reference's own reading, not an accident. */
  priya:{n:'Priya Nair',i:'PN',img:AV.priya,r:4.8,range:'E1–E3',ivs:210,slot:'Thu, Aug 20 · 6:30 PM',price:'$95',
    yrs:'3',tags:['Leadership','Strategy','Communication','Operations'],
    bio:'Fifteen years running operations teams in logistics. I assess for judgement under pressure rather than vocabulary, and I will tell you plainly where you are.'},
  owen:{n:'Owen Clarke',i:'OC',img:AV.owen,r:4.6,range:'E2–B1',ivs:164,slot:'Fri, Aug 21 · 5:00 PM',price:'$85',
    yrs:'2.5',tags:['Technical','Problem Solving','Systems','Retail Operations'],
    bio:'Ex-retail operations. I look for how you decide when the information is incomplete, which is most of the time.'},
  lena:{n:'Lena Fischer',i:'LF',img:AV.lena,r:4.5,range:'E1–E4',ivs:98,slot:'Mon, Aug 24 · 7:00 PM',price:'$80',
    yrs:'4',tags:['Product','Communication','Leadership','Engineering Management'],
    bio:'I came up through engineering management. Expect a lot of "and then what happened".'},
  samuel:{n:'Samuel Adeyemi',i:'SA',img:AV.samuel,r:4.4,range:'E3–B2',ivs:143,slot:'Wed, Sep 2 · 6:00 PM',price:'$90',bio:'',
    yrs:'2',tags:['Data','Analytics','Problem Solving','Reporting','Forecasting']},
  hana:{n:'Hana Kim',i:'HK',img:AV.hana,r:4.3,range:'B1–B4',ivs:121,slot:'Thu, Sep 3 · 5:30 PM',price:'$110',bio:'',
    yrs:'3',tags:['UX Research','Design','Strategy','Research Ops']},
  /* THE SIXTH AGENT EXISTS TO STOP THE GRID REPEATING A FACE (Maryam, 31 Aug
     2026). `.rail-all` is three across and there were five people, so the sixth
     cell was `'priya'` again — the same name, fee and rating printed twice in
     one grid, six inches apart.

     THE PHOTOGRAPH IS `CALL_ART.faceW` AND IT IS NOT COPIED INTO `AV`, which is
     what build.py's note on it asks for: `AV` is the table nine pages read, and
     a face added there changes all nine. Pointing at `CALL_ART` directly works
     because build.py concatenates `call_js` BEFORE data.js, so the const is
     already initialised by the time this object is built — the same ordering
     `AWARD` relies on.

     THE FACE IS ALSO A COHORT MEMBER'S, AND THAT IS THE PROTOTYPE'S OWN HABIT
     RATHER THAN A NEW COMPROMISE. `COHORT` already dresses all ten members in
     the five agent portraits — Aisha wears Priya's, Daniel wears Owen's — and
     `CALL_FACE` overrides exactly two of them with their own photographs on the
     call surface. So this file has seven real faces for twenty-odd people. What
     this does NOT do is reuse the NAME: Nora Lindqvist is a candidate in Cohort
     41, and making her an interviewer would put one person on both sides of an
     assessment. Same face on two surfaces, two people; that is the trade the
     duplicate was worth.

     EVERY FIGURE IS PICKED TO SIT IN A GAP, so nothing else in the build has to
     move. 4.7 is the one rating between Owen's 4.6 and Priya's 4.8. $100 sits
     between $95 and $110 and leaves Lena's $80 as the minimum, which is what
     "Fee: From $80" on the Interviews module states. E4–B1 is a band no other
     agent covers, and — the load-bearing half — it does NOT include E3, so she
     is correctly absent from `REC_ORDER`: that shortlist is "who assesses
     Explorer candidates", Tal's summary calls it "three agents … $80 to $95",
     and an E3-capable sixth would have made both of those wrong and needed a
     `REC` row of three more invented strings. `bio:''` for the same reason
     Samuel's and Hana's are empty — a paragraph in her own voice is product
     copy no data here supports. */
  camila:{n:'Camila Rocha',i:'CR',img:CALL_ART.faceW,r:4.7,range:'E4–B1',ivs:176,slot:'Tue, Aug 25 · 5:30 PM',price:'$100',bio:'',
    yrs:'3',tags:['Product','Growth','Communication','Go-to-Market']}
};

/* ============================================================
   THE TALENT CONSULTANT IS NOT A TALENT AGENT
   Two roles, one word apart, and the product depends on the difference: an
   AGENT interviews you for forty-five minutes, charges for it, sets your
   level and signs a report. A CONSULTANT has a fifteen-minute screening
   chat, charges nothing, and decides nothing at all.

   So this record is its own rather than a sixth entry in AGENTS. Everything
   AGENTS carries — a rating, a level range, an interview count, a price —
   would be a claim about the consultant that is not true, and a record
   shaped like an agent's is a record that will be rendered like one the
   first time somebody reuses a card. Three fields, which is what the
   `.plate` and `avatar()` actually read.

   The photograph is Samuel's. Five portraits are embedded and there are more
   people than that in the prototype — the same fidelity choice COHORT states
   for its ten members, not a claim that these are one person.
   ============================================================ */
const CONSULTANT = {n:'Jordan Blake', i:'JB', img:AV.samuel};

const TALCTX = {
  dashboard:['What should I do next?','How am I doing overall?','Explain the 90-day cycle'],
  level:['What would move me up?','How does the ladder work?','What is the Explorer track?'],
  report:['What do chapters 4 and 12 cover?','How do I get to E4?','What does E3 mean in practice?'],
  interviews:['What happens in the 45 minutes?','What should I not do?','How soon do I get my level?'],
  agents:['What does the rank number mean?','Compare Priya and Owen for me','Does a pricier agent score higher?'],
  agent:['What is this agent like?','Run a mock interview with me','What should I prepare?'],
  booking:['Run a mock on delegation','What if I freeze?','Can I see the questions first?'],
  enrol:['What happens on the weekly call?','Can I change cohort later?','Is the fee refundable?'],
  payment:['Is my card stored?','What is the refund window?'],
  /* THE CONFIRMATION'S THREE ARE ABOUT THE 90 DAYS, NOT ABOUT THE PAYMENT.
     The transaction is finished and the page says so; what a person wants
     from Tal here is the thing they have just committed to. */
  welcome:['What should I do before it starts?','What happens on the weekly call?','Can I change cohort later?'],
  coursework:['Which chapter should I do first?','How far behind am I?','What is next week about?'],
  chapter:['Explain this chapter in 60 seconds','Give me the two key terms','I am stuck, ask me a question instead'],
  transcript:['How do I compare with my cohort?','What is in the 90-day summary?','Which chapter dragged my average down?'],
  cohort:['What should I say on the call?','Am I behind the others?','Who leads this cohort?'],
  billing:['What have I paid so far?','Can I get a receipt?'],
  account:['What can you see about me?','How do I turn you off?'],
  messages:['Help me word a reply'],
  rewards:['How do I earn more points?','What is the Bronze badge?','Does rank affect my level?'],
  /* THREE SUB-PAGES THAT HAD NO ENTRY, added when §21's docked field started
     printing a suggestion from this map on every screen rather than only on
     the nine landings. Without them those pages fell back to the dashboard's
     three, which offers "What should I do next?" to somebody who is reading a
     transcript — a suggestion that is not wrong so much as not listening. */
  mem:['How is this cohort doing overall?','Who else is at my level?'],
  ivt:['Summarise this interview','What did I say about delegation?','Find the part on hard conversations'],
  rp:['Give me a harder scenario','How did I do?','Play the other person again']
};

/* FIRST MATCH WINS, so these two lead.
   The consultant-call dashboard puts two chips on Tal's card and neither of
   them had an answer. "What happens on the call?" is worse than unanswered:
   `/call|thursday|cohort/` is four rows down and it would have replied with
   the WEEKLY COHORT CALL and its widget — a confident answer about a
   different appointment, on the one screen where the distinction is the whole
   point. So the chip asks Tal "What happens on the CONSULTANT call?" while it
   is labelled "What happens on the call?", and the route keys on `consultant`
   rather than on `call`. Keying on `call` here would have taken the cohort's
   question away on week1 and day34, which is the mirror image of the same
   bug: these routes are global, not per-stage, and the specific one has to be
   both first AND narrow. */
const TAL_ROUTES = [
  [/consultant|screening|jordan/i, () => 'Fifteen minutes with Jordan Blake, and nothing in it is assessed. He asks where you are now and what you want next, then points you at the agents whose range fits. There is nothing to prepare and it sets no level.'
    + twChips(['How is that different from the agent interview?','What happens in the interview?'])],
  [/quiz result|my quiz|quiz score|title given|which track am i/i, () => 'You scored 64 out of 100, which puts you on the Explorer track &mdash; the first of three. That is a TITLE, not a level: the five levels inside it are set by an interview with a talent agent, and the quiz cannot do it.'
    + wLadder() + twChips(['What is the Explorer track?','How do I get my level?'])],
  [/key terms|two terms/i, () => 'Chapter 4 turns on two ideas.' + wTerms() + twChips(['Explain the chapter in 60 seconds','What does the roleplay ask for?'])],
  [/chapter 4|walk me through|stuck|60 seconds|explain this chapter|roleplay/i,
    () => 'The whole chapter is one question: what has to be true before you hand something over. Most people read it as trust when it is really clarity.' + wChapter(3) + twChips(['Give me the two key terms','How are chapters assessed?'])],
  [/chapter 1|what is chapter/i, () => 'Chapter 1 sets up why the operator role exists and how your week ladders up to the outcome your team owns.' + wChapter(0) + twChips(['What happens on the call?','How are chapters assessed?'])],
  [/points|earn more|bronze|badge|rank/i, () => 'Points come from finishing chapters, turning up to calls and being useful on the board.' + wPoints() + twChips(['Does rank affect my level?','What is the Get Involved badge?'])],
  [/level|move up|ladder|e3|e4|explorer track|assessed/i, () => 'Your level is where you sit on the Explorer track, set by an interview and reviewed at the end of each course.' + wLadder() + twChips(['What would move me to E4?','What is on my report?'])],
  [/mock|practice|practise|prepare|freeze|questions in advance/i, () => 'We can run it now. I ask, you answer out loud, and I tell you where the answer went thin.' + wPrep() + twChips(['What should I not do in the interview?','How long is the interview?'])],
  [/priya|owen|lena|interviewed by|what is .* like/i, () => 'Here is what past candidates say about her.' + wAgent() + twChips(['What should I prepare?','How soon do I get my level?'])],
  [/call|thursday|cohort|say on|behind the others/i, () => 'Your next call is Thursday. Here is what it covers and what to bring.' + wCall() + twChips(['Am I behind the others?','Can I message the whole cohort?'])],
  [/reply|wording|message/i, () => 'Here is a draft in your own register. Change anything that does not sound like you.' + wDraft()],
  [/time|workload|how much|each week|hour|fall behind|work ahead/i, () => 'Plan for about two hours a week.' + wWorkload() + twChips(['What if I fall behind?','Can I work ahead?'])],
  [/interview|45 minutes|what happens in|recording/i, () => 'Forty-five minutes, recorded, with a talent agent you pick. They work through real situations from your own answers and then write your report.' + twChips(['What should I prepare?','Who sees the recording?'])],
  [/reflection|note|turn this into/i, () => 'Here is your note turned into something you could bring to the call.' + wDraft()]
];

const PTS = [
  {n:'Daily sign in',           d:'Sign in daily and earn 10 points every time',                   v:10},
  {n:'Sign in 100 times',       d:'Sign in 100 times and earn 250 points',                         v:250},
  {n:'Chapter completion',      d:'Complete any chapter and earn 25 points, up to 10 a day',       v:25},
  {n:'Course completion',       d:'Complete any course and earn 250 points',                       v:250},
  {n:'Start a new conversation',d:'Post a new conversation in the community',                      v:10},
  {n:'Join the conversation',   d:'Reply to a post in the community',                              v:10},
  {n:'Get a reaction',          d:'Someone replies or reacts to your post',                        v:20},
  {n:'7 days away',             d:'No sign in for 7 days takes 50 points off your total',          v:-50},
  {n:'30 days away',            d:'No sign in for 30 days takes 250 points off your total',        v:-250}
];

const BDG = [
  {n:'Bronze',       d:'Accumulate 2,500 points',   v:200, need:2500,  c:'#8a3800'},
  {n:'Silver',       d:'Accumulate 5,000 points',   v:300, need:5000,  c:'#6f6f6f'},
  {n:'Gold',         d:'Accumulate 10,000 points',  v:400, need:10000, c:'#b28600'},
  {n:'Get Involved', d:'Post in the community',     v:100, need:null,  c:'var(--dv-3)'}
];

const RANKS = [
  {n:'1-Star', d:'Everyone who signs up is a 1-Star',              v:250},
  {n:'2-Star', d:'Earn the Silver badge and the Get Involved badge',v:500},
  {n:'3-Star', d:'Earn the Gold badge',                             v:1000}
];

const GAME = {
  week1:   {pts:985,  got:[0,1,3],           badges:0, rank:1, last:['08/13/2026','07/23/2026','','07/23/2026','','','','',''], weeks:[20]},
  day34:   {pts:1095, got:[0,1,2,3],         badges:0, rank:1, last:['08/13/2026','07/23/2026','08/04/2026','07/23/2026','','','','',''], weeks:[52,61,48,55,12]},
  day90:   {pts:2955, got:[0,1,2,3,4,5,6],   badges:1, rank:1, last:['08/13/2026','07/23/2026','11/14/2026','11/16/2026','09/12/2026','09/21/2026','09/24/2026','',''], weeks:[52,61,48,55,62,58,70,49,55,60,52,66,58]},
  promoted:{pts:3205, got:[0,1,2,3,4,5,6],   badges:1, rank:1, last:['08/13/2026','07/23/2026','11/18/2026','11/21/2026','09/12/2026','09/21/2026','09/24/2026','',''], weeks:[52,61,48,55,62,58,70,49,55,60,52,66,58]},
  /* THE RED ACCENT DEMO — day 34's row, copied. See `RED_DEMO` in this file. */
  reddemo: {pts:1095, got:[0,1,2,3],         badges:0, rank:1, last:['08/13/2026','07/23/2026','08/04/2026','07/23/2026','','','','',''], weeks:[52,61,48,55,12]}
};

const WEEK_TARGET = 55;

/* ==========================================================================
   THIS WEEK, IN TWO HALVES
   The dashboard's "This week" card used to be one chapter and a full-width
   bar: the chapter you have open, and how far into its running time you
   are. That answers "what am I in the middle of" and nothing else — not what
   the week already contains, and not whether that is enough. Both of those
   are now asked of the card, so the week is stated in two halves and the
   chapter's own progress becomes a ring beside the title rather than the
   whole card:

     did    what is DONE — chapters finished, assessments scored, a post
            made. Past tense, facts only. Nothing you have NOT done appears
            in this list: an achievement list that quietly carries misses is
            not an achievement list, it is a to-do list wearing ticks. When
            the list is empty the card says so in a sentence rather than
            drawing an empty box.
     tal    what is expected of you, which is Tal comparing you with the
            members of your cohort who are furthest ahead. This is the only
            place in the card where the numbers are not yours, so it is
            attributed — and it names the cohort SIZE, because "3 of the 10"
            is a fraction a person can hold and it is what stops "the top of
            the cohort" from meaning one outlier.

   STATED PER STAGE, NOT DERIVED. The prototype has no per-week ledger: `CFG`
   carries running totals (`done`, `mins`) and `GAME[stage].weeks` carries
   minutes per week, and the two already disagree at week 1 (weeks:[20] against
   mins:0). Deriving "this week" from either would put a third number on a
   page that already has two. These are written to agree with what the rest of
   the page says instead — the scores come from SCORE, the post is the one in
   POSTS carrying `mine`, and the minutes in Tal's line are the remainder of
   the open chapter's running time in CH.

   Keyed by stage, and only the two enrolled stages that draw the card have an
   entry: day 90 is finished, and a week's pace is not a thing you can be
   behind on when the 90 days are over. */
const WEEKLY = {
  week1: {
    did: [],
    /* Nothing is assessed in week 1 — that is the stage's whole character —
       so the empty state is not a gap in the data, it is the answer. */
    none: 'Nothing finished yet. Chapter 1 unlocked today and nothing this week is assessed.',
    tal: 'Four of the ten in Cohort 41 have already finished chapter 1. Nothing is assessed this week, so the only thing between you and their pace is the 45 minutes of the chapter itself.',
    ask: ['What should I get done this week?', 'Plan my week']
  },
  day34: {
    /* ONE ROW, NOT TWO (Maryam, 31 Aug 2026). "Posted in the cohort discussion
       / Yesterday · earned Get Involved" came out of the focus column: it is a
       cohort event rather than coursework, and the badge it earned is printed
       again in the standing column two panels to the right. What is left is the
       one fact this column is about — a chapter finished and what it scored.
       `WEEKLY[stage].did` is read only by `pulse` now, so removing it here
       removes it from the product rather than hiding it. */
    did: [
      ['Chapter 5 finished', 'Assessed 86%']
    ],
    tal: 'The three furthest ahead in Cohort 41 had this week&rsquo;s chapter finished and its assessment submitted by day 34. You are 58 minutes and one assessment behind that pace, and chapter 4 is the growth area in your report — so it is the one worth the extra time.',
    ask: ['What do I have to do to catch up this week?', 'How do I catch up?']
  },
  /* THE RED ACCENT DEMO — day 34's entry, copied. See `RED_DEMO` in this file. */
  reddemo: {
    did: [
      ['Chapter 5 finished', 'Assessed 86%']
    ],
    tal: 'The three furthest ahead in Cohort 41 had this week&rsquo;s chapter finished and its assessment submitted by day 34. You are 58 minutes and one assessment behind that pace, and chapter 4 is the growth area in your report — so it is the one worth the extra time.',
    ask: ['What do I have to do to catch up this week?', 'How do I catch up?']
  }
};

/* `art` is a key into AWARD — the client's own artwork for the thing that was
   just won. It is preferred over `ic` wherever it exists, because the mark on
   the banner should be the SAME object the rewards page and the leaderboard
   draw: you earned a specific shield, and a generic glyph of a shield is a
   picture of the category instead. `ic` stays as the fallback for the one
   achievement that is not an award — a promotion has no artwork to show. */
/* `up` IS THE WHOLE OF IT NOW, AND `t` / `b` ARE THE BANNER THAT WENT.
   These three were drawn as a green band across the page under the head — a
   mark, a heading, a sentence, a View button and a dismiss. Maryam's call: none
   of that is needed, and a one-line update in the page header is enough to tell
   somebody what just happened. `achLine` (views.js) draws it, at the right-hand
   end of the header row, in `--link`.

   THE LAST WORD IS THE LINK, so every sentence here has to END on the thing it
   is about — "rank!", "badge!", "E4!". `achLine` underlines it rather than the
   whole line, which is 486:1084's own treatment and what stops a sentence of
   blue text reading as a paragraph somebody made into a hyperlink. Write the
   next one to that shape and it needs no code.

   `t` AND `b` STAY, and are not dead weight: the Rewards page's own award list
   is a different component that names the same three things, and this is where
   the product's wording for each of them lives. A future surface that wants the
   long form has it. `ic` is the fallback mark for the one achievement with no
   artwork — a promotion is not an object you can photograph. */
const ACH = {
  week1:   {ic:'trophy',     art:'rank1',  t:'1-Star rank unlocked',       b:'Everyone who joins a cohort starts here. 250 points added.', go:'rewards',
            up:'You have earned 1-star rank!'},
  day90:   {ic:'certificate',art:'bronze', t:'Bronze badge earned',        b:'You passed 2,500 points. 200 points added.',                 go:'rewards',
            up:'You have earned the Bronze badge!'},
  promoted:{ic:'trophy',                   t:'Promoted to Explorer &ndash; E4', b:'Priya signed your re-interview decision on November 21.', go:'level',
            up:'You have been promoted to E4!'}
};

const SPLIT = [0.44,0.19,0.26,0.11];

const SERIES = [['Video','var(--dv-1)'],['Reading','var(--dv-2)'],['Roleplay','var(--dv-3)'],['Assessment','var(--dv-4)']];

const POSTS = [
  {a:'Aisha Bello',i:'AB',w:'2h ago',t:'Where do you draw the line on checking in?',
   b:'Chapter 4 says an operating rhythm lets you check without hovering. In practice I cannot tell the difference. How often is too often?',
   r:6,k:4,mine:false},
  {a:'Maryam Naz',i:'MN',w:'Yesterday',t:'Taking work back after you have handed it over',
   b:'I did this last week and did not tell the person why. Has anyone found a way to hand it back without it landing badly?',
   r:9,k:7,mine:true},
  {a:'Daniel Kerr',i:'DK',w:'3 days ago',t:'Week 5 prep, what are you bringing?',
   b:'Priya asked for a real hard conversation. Mine is a contractor I should have let go two months earlier.',
   r:4,k:3,mine:false}
];

const MKF = "'IBM Plex Sans',system-ui,sans-serif";

const mkFrame = '<rect x=".5" y=".5" width="39" height="25" rx="3" fill="#fff" stroke="#c6c6c6"/>';

const BMK = {
  Visa: `<svg viewBox="0 0 40 26">${mkFrame}<text x="20" y="17.5" text-anchor="middle" font-family="${MKF}" font-size="10.5" font-weight="700" font-style="italic" letter-spacing=".4" fill="#1434cb">VISA</text></svg>`,
  Mastercard: `<svg viewBox="0 0 40 26">${mkFrame}<circle cx="16.5" cy="13" r="7.2" fill="#eb001b"/><circle cx="23.5" cy="13" r="7.2" fill="#f79e1b"/><path d="M20 7.1a7.2 7.2 0 0 0 0 11.8 7.2 7.2 0 0 0 0-11.8Z" fill="#ff5f00"/></svg>`,
  Amex: `<svg viewBox="0 0 40 26"><rect x=".5" y=".5" width="39" height="25" rx="3" fill="#1f70c1" stroke="#1b5fa5"/><text x="20" y="16.5" text-anchor="middle" font-family="${MKF}" font-size="7.5" font-weight="700" letter-spacing=".3" fill="#fff">AMEX</text></svg>`,
  Discover: `<svg viewBox="0 0 40 26">${mkFrame}<path d="M25 25.5h11a3.5 3.5 0 0 0 3.5-3.5v-4c-4.6 3.4-9.7 5.9-14.5 7.5Z" fill="#f26e21"/><text x="18" y="15" text-anchor="middle" font-family="${MKF}" font-size="6" font-weight="700" letter-spacing=".2" fill="#161616">DISCOVER</text></svg>`,
  card: `<svg viewBox="0 0 40 26">${mkFrame}<rect x="4" y="8" width="32" height="3.5" fill="#c6c6c6"/><rect x="4" y="16" width="9" height="3" fill="#e0e0e0"/><rect x="15" y="16" width="9" height="3" fill="#e0e0e0"/></svg>`
};