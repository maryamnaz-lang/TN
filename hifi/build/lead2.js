/* ==========================================================================
   THE COHORT LEADER'S COHORTS — index, roster, one candidate

   lead.js drew the leader's dashboard and left seven module landings as
   honest empty states. This file replaces three of them with the pages the
   wireframe's `V.cohorts`, `cohortDetail()` and `memberDetail()` describe,
   plus `V.reports`, which reads the same numbers from the other end.

   THE WIREFRAME'S `talRead` IS THIS PRODUCT'S HEAD BAND, NOT A CARD.
   Every leader page in `tn-portals.html` opened with a `talRead(lead,sub,chips)`
   — Tal's reading of the page, above the page. Transcribing that would put a
   second Tal card on every page, because ai6.js ALREADY writes one: `PAGESUM`
   is keyed by view and `placePageSummary` lands it in the module head band at
   the top of every page in both portals. So the wireframe's per-page Tal read
   crosses as a `PAGESUM` entry (written at the foot of ai6.js), and an
   `.ai-aura` card is spent only where Tal is doing something a paragraph
   cannot: proposing a level, or briefing a call. Same argument lead.js used for
   the dashboard banner, applied to the other seven pages.

   AND THE WIREFRAME'S ANNOTATIONS DO NOT CROSS AT ALL.
   Several of these pages carried `<div class="note i">` blocks addressed to
   the client rather than to the leader — "Open question — client decision",
   "Why this is separate from Evaluations". They are the wireframe doing its
   job as a wireframe. In a high-fidelity portal a bordered note is product
   copy, read by Priya, so a note that says "this is not yet decided" reads as
   the product being unfinished. The DECISIONS those notes record are kept —
   they are why there is no money on this portal and why Sessions and
   Evaluations are two modules — but the annotations themselves stay in the
   wireframe. `.note` is used here only where the sentence is for the leader.

   THE COMPONENTS ARE THE ONES §10.15 ALREADY KNOWS ABOUT.
   The desktop label column is opted out of BY CONTENTS — `.sec:has(.gcard)`,
   `:has(.cardrow)`, `:has(> .tile-stack)`, `:has(> .stats)`, `:has(> .tbl-wrap)`,
   `:has(> .facts)`. Every section on these four pages is built out of one of
   those, which is why this file needs almost no CSS: a page assembled from
   the components on that list gets the right spine for free, and a page that
   invents a wrapper has to be added to a list inside a container query, which
   per trap 3 cannot be corrected from a later layer.
   ========================================================================== */

/* --------------------------------------------------------------------------
   STATE, AND WHY IT IS ON `S`

   `S.ldrCo` and `S.ldrMem` are WHICH cohort and WHICH candidate the two
   detail views are showing. They have to survive a render they did not cause
   — opening Tal, the bell, the ask field — for the same reason `S.leadQ`
   does, which is that `render()` rebuilds the view column from `S` and
   nothing else. Prefixed `ldr` rather than `lead` because `S.leadQ` and
   `S.leadFilter` are already taken by the dashboard's queue, and two
   prefixes that differ by one letter are worse than two that do not overlap.
   -------------------------------------------------------------------------- */
S.ldrCo = LEAD_COHORTS[0].id;
S.ldrMem = null;
S.ldrRep = 'all';
S.ldrBrief = null;
S.ldrNote = null;

/* A leader's notes are the one thing on this portal they WRITE, so they are
   the one thing that has to be mutable. Keyed by candidate name because that
   is what the roster and the reports both hand over, and seeded with two so
   the member page shows the component doing its job rather than its empty
   state on first look. */
S.ldrNotes = {
  'Yuki Tanaka':[{t:'Twelve days without a sign-in. Emailed the address on file and got no bounce, so it is being read. Trying the cohort board next before I escalate.', w:'2 days ago'}],
  'James Whitby':[{t:'Re-taking assessments three and four rather than moving on. Told him on the call to leave them at 65 and come back after chapter 6 — the material builds, the score does not.', w:'Last week'},
                  {t:'Asked for the handover framework twice. Sent it. Worth checking he used it.', w:'Earlier'}]
};

/* --------------------------------------------------------------------------
   READINGS OF THE ROSTER

   All of it derived, none of it stored — the same rule lead.js set for the
   flags. `lmem()` carries seven fields and the wireframe's member carried
   eleven; rather than widen the record and have two places to keep the same
   candidate consistent, the four the wireframe added are computed here from
   the three that decide them.

   `lchDone` is the reading the whole course platform reports against: 13
   chapters, so a percentage IS a chapter count and printing both is printing
   one fact twice. `lmins` is that chapter count against `CH`'s own running
   times — the candidate portal's `f.mins` counts the same way, so the two
   portals give the same candidate the same hours. Multiplying by attempts is
   the point of it: someone who went round twice spent twice the time, and
   time-with-nothing-to-show-for-it is the signal a leader acts on.
   -------------------------------------------------------------------------- */
const lcoOf   = id => LEAD_COHORTS.filter(c => c.id === +id)[0] || LEAD_COHORTS[0];
const lco     = () => lcoOf(S.ldrCo);
const lmemOf  = (c,name) => (c.members.filter(m => m.name === name)[0] || c.members[0]);
const lchDone = m => Math.round(m.pc / 100 * 13);
const lmins   = m => Math.round(CH.slice(0, lchDone(m)).reduce((s,ch) => s + ch[1], 0) * Math.max(1, m.att || 1));
/* Under an hour reads as minutes. "0h 45m" is a figure with a zero in front
   of it, and the stat cell it lands in is 90px wide — the leading "0h " wrapped
   the whole value onto a second line to say nothing. */
const lhrs    = n => !n ? '&mdash;' : n < 60 ? n + 'm' : Math.floor(n/60) + 'h ' + (n%60) + 'm';
const lidle   = m => /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1] : 0;

/* THE WEEK'S TASK, DERIVED FROM PACE — because the course platform is the
   only thing that knows about tasks and it reports progress, not intent. A
   candidate at or past expected pace has this week's task done; one who has
   never signed in has not started it; the two readings in between are the
   difference between late and still working. */
const ltask = (m,c) => m.last === 'Never' ? ['none','Not started']
  : m.pc >= lpace(c) ? ['done','Done']
  : m.pc >= lpace(c) - 8 ? ['open','In progress'] : ['late','Late'];

const lnotes = name => S.ldrNotes[name] || [];

/* Severity as a tag, for the pages that show a flag on a ROW rather than in
   the dashboard's table. The table has `.flag-t` and a row class; a row in a
   tile-stack has neither, and `.tag` already carries the two inks — `red` and
   `org` are §12's tuned severity pair, which is what 31-lead.css §117 chose
   for exactly this reading. */
const lflagTag = f => !f ? '' :
  `<span class="tag ${f.k === 'bad' ? 'red' : 'org'} sm">${f.t}</span>`;

/* A MARK FOR SOMETHING THAT IS NOT A PERSON.
   The plate's leading slot is sized for `.av-ph` and every plate in the
   product puts a face there. A cohort has ten faces and no one of them is the
   answer to "who am I meeting", so the mark is the cohort's own number in the
   same plate — which is `.av-ph`'s FALLBACK state, drawn on purpose: the
   element with an `<i>` and no `<img>` is exactly what `avatar()` degrades to
   when a photo fails, so this needs no rule of its own. The alternative was a
   40px `.cardrow-ic` in a 56px slot, which §15 sizes for the avatar. */
const ldrMark = (label,size) => `<span class="av-ph" style="width:${size}px;height:${size}px"><i>${label}</i></span>`;

/* A cohort's own headline number, said the way the leader asks for it: not
   "46%" but "46% against 38% expected", because a percentage on its own
   cannot tell them whether to act. */
/* THE ASSESSMENT AVERAGE COUNTS ONLY WHO HAS BEEN ASSESSED.
   `lavg(c,'avg')` divides by every member, so a cohort four days old — half of
   whom have not opened a chapter, and carry `avg:0` for "nothing yet" — reported
   26%. That is not a low score, it is an absent one, and a leader reading 26%
   against a 75% pass mark would act on a cohort that has done nothing wrong.
   `lavg` stays as it is: the dashboard uses it for PROGRESS, where 0 genuinely
   means zero progress. Assessment is the field where 0 means "no data". */
const lassess = c => {
  const on = c.members.filter(m => m.avg > 0);
  return on.length ? Math.round(on.reduce((s,m) => s + m.avg, 0) / on.length) : 0;
};

const lpaceLine = c => `${lavg(c,'pc')}% against ${lpace(c)}% expected`;
const lpaceGap  = c => lavg(c,'pc') - lpace(c);

/* ==========================================================================
   COHORTS — THE INDEX

   THE THREE COHORTS ARE A TABLE, NOT THREE CARDS.
   The wireframe drew a `.g3` of three cards, each with a progress bar and
   five `.kv` rows. Every cohort therefore reported the same six facts in a
   column, and comparing two of them meant reading down one card and across
   to the next. The question this page exists to answer is which cohort needs
   the leader most, which is a comparison — so the six facts become six
   columns and the three cohorts become three rows, and the answer is a scan
   down one column instead of a diff across three cards. It is also what the
   client has asked for twice: aligned figures over decorative charts.

   THE BAR DOES NOT SURVIVE THE MOVE. `.bar` inside a table cell would set a
   width against a column that is being negotiated against five others, and
   §12 has no rule for it. Progress against expected pace is two numbers and
   it reads better as two numbers.

   ONE ROW OPENS ONE ROSTER, AND THE WHOLE ROW IS THE TARGET — the argument
   lead.js records for `faceRow`: a 60px "Open" button on a 700px row that is
   otherwise dead, and a verb that promises the opening happens here. `.ldr-tr`
   in §35 is the whole of what that costs.
   ========================================================================== */
V.leadCohorts = () => {
  const flagged = lmembers().filter(x => x.m.flag);
  const severe = flagged.filter(x => x.m.flag.k === 'bad');
  const next = LEAD_COHORTS.slice().sort((a,b) => a.callOrd - b.callOrd)[0];
  /* Worst is by GAP, not by raw average: cohort 47 is on 6% and four days
     old, which is nothing to act on, while 41 is on 46% in week five and
     eight points down. Same reading as the dashboard queue's own sort. */
  const worst = LEAD_COHORTS.slice().sort((a,b) => lpaceGap(a) - lpaceGap(b))[0];

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Cohorts')}
  ${''/* Tal's summary opened with "Three cohorts, 28 candidates" — this
        line with the numbers spelt instead of set, which also meant the page
        showed the same count in two notations. The spine keeps the figures in
        one notation and Tal keeps the finding. */}
  ${ph('Cohorts',`${LEAD_COHORTS.length} cohorts &middot; ${lmembers().length} candidates &middot; all Explorer`)}
  <div class="sec">
    <div class="stats">
      ${statCell(I.group,  'Cohorts',   LEAD_COHORTS.length, `${lmembers().length} candidates`)}
      ${statCell(I.growth, 'On pace',   LEAD_COHORTS.filter(c => lpaceGap(c) >= 0).length + ` <small>of ${LEAD_COHORTS.length}</small>`, 'against expected progress')}
      ${statCell(I.warningAlt, 'Flagged', flagged.length, `${severe.length} severe`)}
      ${statCell(I.calendar, 'Next call', next.callDay, `${lname(next)} &middot; ${next.callTime.toLowerCase()}`)}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>This week&rsquo;s calls</h2><span class="t-helper-01">Sixty minutes each</span></div>
    <div class="tile-stack">
      ${LEAD_COHORTS.slice().sort((a,b) => a.callOrd - b.callOrd).map(c => `
      <div class="cardrow bk-row">
        <span class="day bk-day"><div class="d">${c.callDay}</div><div class="n">${c.callTime}</div></span>
        <span class="cardrow-ic">${I.group}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${lname(c)} &middot; week ${c.week} of 13</span>
          <span class="cardrow-d">${c.members.length} candidates at ${llevel(c)} &middot; ${CH[Math.min(12, c.week - 1)][0]}</span>
        </span>
        <span class="cardrow-a">
          <button class="btn btn-sm noic" data-ldrbrief="${c.id}">Brief</button>
        </span>
      </div>`).join('')}
    </div>
    <p class="t-helper-01 mt4">A brief is generated from where the cohort actually is, not from where the syllabus says it should be.</p>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>All cohorts</h2><span class="t-helper-01">Expected pace is day of 90, evenly spread</span></div>
    <div class="tbl-wrap">
      <table class="tbl ldr-tbl">
        <tr><th>Cohort</th><th>Week</th><th class="num">Progress</th><th class="num">Assessment</th>
            <th class="num">Flagged</th><th>Next call</th><th></th></tr>
        ${LEAD_COHORTS.map(c => {
          const bad = c.members.filter(m => m.flag && m.flag.k === 'bad').length;
          const wa  = c.members.filter(m => m.flag && m.flag.k === 'wa').length;
          const gap = lpaceGap(c);
          return `<tr class="ldr-tr" data-ldrco="${c.id}" data-go="leadCohort" tabindex="0" role="button">
            <td>${lname(c)} <span class="t-helper-01">${llevel(c)}</span></td>
            <td>${c.week} <span class="t-helper-01">of 13</span></td>
            <td class="num">${lavg(c,'pc')}% <span class="t-helper-01">of ${lpace(c)}%</span></td>
            <td class="num">${lassess(c) ? lassess(c) + '%' : '<span class="t-helper-01">not yet</span>'}</td>
            <td class="num">${bad ? `<span class="tag red sm">${bad} at risk</span> ` : ''}${wa ? `<span class="tag org sm">${wa} watch</span>` : ''}${!bad && !wa ? '<span class="t-helper-01">none</span>' : ''}</td>
            <td>${c.callDay} <span class="t-helper-01">${c.callTime.toLowerCase()}</span></td>
            <td class="ldr-go"><svg viewBox="0 0 24 24">${inner('chevRight')}</svg></td>
          </tr>`;
        }).join('')}
      </table>
    </div>
    ${/* THE PACE FOOTNOTE IS GONE. Two sentences: one defining "expected
          pace", which the heading's own helper line already defines — "day of
          90, evenly spread" — and one naming the worst cohort, which the
          Tal card at the top of this page states in the same words and the
          PROGRESS column shows on the row it belongs to. Three copies of one
          fact, the quietest of them last. */''}
  </div>
</div></main>`;
};

/* ==========================================================================
   ONE COHORT — THE ROSTER

   THE CALL IS A PLATE, for the reason views.js records on the candidate's own
   cohort page: every appointment in this product is the black wall with a
   face, and the weekly call is an appointment. The candidate side draws this
   exact call with Priya's face on it; here the face is the cohort, so the
   plate takes `I.group` in the same slot — same component, and the two
   portals draw one call the same way.

   THE ROSTER IS SEVEN COLUMNS, NOT TEN. The wireframe's roster carried
   Progress, vs pace, Assess avg, Attempts, Time, Last active, Week task, Flag
   and an Open button. Ten columns on a 900px view column is a horizontal
   scroll on every width, and three of them were saying one thing: progress
   as a bar, progress as a per cent, and progress against pace. The per cent
   against expected is the reading — the bar is decoration next to it, and
   time is derivable from chapters. What is left fits without scrolling and
   every column is a column a leader sorts on in their head.
   ========================================================================== */
V.leadCohort = () => {
  const c = lco();
  const gap = lpaceGap(c);
  const flagged = c.members.filter(m => m.flag);
  const severe = flagged.filter(m => m.flag.k === 'bad');
  const weakest = c.members.filter(m => m.avg > 0).slice().sort((a,b) => a.avg - b.avg)[0];
  const chapter = CH[Math.min(12, c.week - 1)];

  return `<main class="main"><div class="page">
  ${crumb(['Cohorts','leadCohorts'], lname(c))}
  ${ph(lname(c), `${c.members.length} candidates at ${llevel(c)} &middot; week ${c.week} of 13 &middot; day ${c.day} of 90`,
    `<button class="btn btn-p" data-ldrbrief="${c.id}">Generate the brief ${I.arrowRight}</button>`)}
  <div class="sec">
    <div class="plate">
      <div class="plate-who">${ldrMark(String(c.id), 56)}
        <span class="plate-wb"><b>${c.members.length} candidates</b><span>${llevel(c)} &middot; led by you</span></span>
      </div>
      <div class="plate-eb">Weekly call &middot; ${c.callDay.toLowerCase()}</div>
      <div class="plate-t">Week ${c.week} &middot; ${chapter[0]}</div>
      <div class="plate-b">${c.call} &middot; 60 minutes &middot; ${severe.length ? severe.length + ' to raise privately, not in the group' : 'nobody flagged severely this week'}</div>
      <div class="plate-a">
        ${''/* one or two short words — the note over `leadDash`'s plate is why */}
        <button class="btn btn-p btn-sm noic">Join ${I.video}</button>
        <button class="btn btn-sm noic plate-b2" data-ldrbrief="${c.id}">Brief</button>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="stats">
      ${statCell(I.growth, 'Average progress', lavg(c,'pc') + '<small>%</small>', `${gap >= 0 ? '+' + gap : gap} against pace`)}
      ${statCell(I.time,   'Expected pace',    lpace(c) + '<small>%</small>', `day ${c.day} of 90`)}
      ${statCell(I.chart,  'Assessment average', lassess(c) ? lassess(c) + '<small>%</small>' : '<small>Not yet</small>', weakest ? `lowest ${weakest.avg}% &middot; ${c.members.filter(m => m.avg > 0).length} of ${c.members.length} assessed` : 'nothing assessed yet')}
      ${statCell(I.warningAlt, 'Flagged', flagged.length + `<small> of ${c.members.length}</small>`, `${severe.length} severe`)}
    </div>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Roster</h2><span class="t-helper-01">From the course platform &middot; ordered by progress</span></div>
    <div class="tbl-wrap">
      <table class="tbl ldr-tbl">
        <tr><th>Candidate</th><th class="num">Progress</th><th class="num">Assessment</th>
            <th class="num">Attempts</th><th>Week ${c.week} task</th><th>Last active</th><th>Flag</th><th></th></tr>
        ${c.members.slice().sort((a,b) => b.pc - a.pc).map(m => {
          const [tk,tl] = ltask(m,c);
          const d = m.pc - lpace(c);
          return `<tr class="ldr-tr${m.flag ? (m.flag.k === 'bad' ? ' sev' : ' mod') : ''}" data-ldrco="${c.id}" data-ldrmem="${m.name}" data-go="leadMember" tabindex="0" role="button">
            <td>${m.name}</td>
            <td class="num">${m.pc}% <span class="t-helper-01">${d >= 0 ? '+' + d : d}</span></td>
            <td class="num">${m.avg ? m.avg + '%' : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="num">${m.att ? m.att.toFixed(1) : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td><span class="tag ${tk === 'done' ? 'green' : tk === 'late' ? 'org' : tk === 'none' ? 'red' : ''} sm">${tl}</span></td>
            <td>${m.last.toLowerCase()}</td>
            <td>${m.flag ? `<span class="flag-t">${I[m.flag.ic]}${m.flag.t}</span>` : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="ldr-go"><svg viewBox="0 0 24 24">${inner('chevRight')}</svg></td>
          </tr>`;
        }).join('')}
      </table>
    </div>
  </div>
  <div class="sec">
    <div class="note"><span>${I.info}</span><div class="nb"><b>Attempts</b>How many times a candidate went back through the same content. Above 2.0 with assessments under 75% is the clearest struggle signal this data can give you.</div></div>
    <div class="btn-set mt5">
      <button class="btn btn-g" data-go="leadMessages">Post to the cohort board ${I.chat}</button>
      <button class="btn btn-t" data-go="leadReports">Course reports ${I.chart}</button>
    </div>
  </div>
</div></main>`;
};

/* ==========================================================================
   TAL'S READING OF A CANDIDATE

   THE PAGE DOES NOT DRAW THIS. It is `PAGESUM.leadMember`, and that is not a
   compromise — it is where this product keeps a page's Tal copy, learnt the
   hard way and written down here so the next pass does not spend an afternoon
   on it.

   `talFirst()` in views.js hoists ANY section containing an `.ai-aura` to
   immediately after the page header: "the card is authored where it reads
   best in source order; this moves it." `placeBand` (ai5) then finds it
   adjacent to the header and pulls it into the module head band. And ai6
   strips `.ai-foot`, `.ai-asks` and any action out of whatever is in that
   band, then replaces the card's heading and body with `pageSummary()`.

   Three consequences, and every one of them is a rule for this file:
   1. A hand-authored Tal card cannot sit lower down a page. It will be moved.
   2. It cannot carry a button or an ask chip. They will be removed — ai6's
      note explains why, and requires the route to exist on the page instead.
   3. Its words will be replaced by the `PAGESUM` entry for the view — and if
      there is NO entry, the card is left in a shape §33 does not style, which
      renders a 1786px-wide head band on a 1068px page.

   So the reading lives here as a function, `PAGESUM.leadMember` calls it, and
   the page below is figures and record. One Tal card per page, at the top,
   with its copy in the one place the rest of the product keeps it.

   IT IS ONE PARAGRAPH, NOT A HEADING AND A PARAGRAPH. The band has no heading
   — ai6 removes it — so the judgement has to be the first sentence instead.
   Which is better anyway: "Yuki has never signed in" is the finding, and a
   summary whose first six words are the finding is one a leader can act on
   without reading the rest.

   AND IT IS TWO SENTENCES, WHICH IT WAS NOT. Every branch below used to run
   to three, 40 to 55 words, and the third was always the same kind of thing:
   the reasoning read back out. "They are moving slowly, Yuki has not started,
   and a cohort place is being held open. Cohort 41 is on day 34 of 90." —
   two clauses of argument and a fact the page header states. On the longest
   branch that was 55 words in the block a leader reads first on a page whose
   whole job is to be scanned. The finding stays first, the action follows it
   in the same breath, and the working-out is gone. Which is also the rule the
   rest of `PAGESUM` now holds to: 18 to 28 words, two sentences, no framing.
   ========================================================================== */
function ldrRead(m,c){
  const d = m.pc - lpace(c);
  const first = m.name.split(' ')[0];
  const done = lchDone(m);
  if(m.last === 'Never')
    return `${first} has never signed in &mdash; no chapter opened, no assessment, no time on the course at all. Act on this before any of the behind-pace names: a cohort place is being held open.`;
  if(lidle(m) >= 7)
    return `${first} stopped ${lidle(m)} days ago at ${m.pc}% &mdash; ${done} of 13 chapters, then nothing. Worth a direct message rather than a mention on the call; people who stop mid-course rarely restart unasked.`;
  if(m.att >= 2.0 && m.avg < 75)
    return `${first} is trying, not absorbing: ${m.att.toFixed(1)} attempts on average against a ${m.avg}% assessment score. The material is landing badly rather than the effort being missing &mdash; this is the pattern that gets worse if you push harder.`;
  if(d <= -15)
    return `${first} is well behind pace at ${m.pc}% against ${lpace(c)}% expected on day ${c.day}. Assessments hold up at ${m.avg}%, so this is time rather than comprehension &mdash; worth direct outreach before the next call.`;
  if(d <= -5)
    return `${first} is ${Math.abs(d)} points behind pace, ${m.pc}% against ${lpace(c)}% expected, with assessments at ${m.avg}%. A gap this size usually recovers on its own &mdash; worth watching rather than intervening.`;
  return `Nothing alarming in ${first}&rsquo;s numbers &mdash; ${m.pc}% against ${lpace(c)}% expected, assessments at ${m.avg}%, ${done} of 13 chapters. ${m.att <= 1.2 ? 'First-time passes on almost everything.' : 'A second pass on some, which at this score is thoroughness.'}`;
}

/* ==========================================================================
   ONE CANDIDATE

   THE IDENTITY ROW IS `.idhead`, THE CANDIDATE PORTAL'S OWN. It carries a
   face, a name, a meta line, a tag and an action held at the right end, which
   is exactly this row — and §29.10 already settled where the action sits on
   it. `.idphoto` becomes a plain `.av-ph` here because a leader cannot change
   somebody else's photo, and a button that looks editable and is not is worse
   than a picture.

   THE CHAPTER RECORD IS A TABLE OF WHAT HAPPENED, NOT OF ALL THIRTEEN.
   The wireframe printed the chapters reached plus one, and a line saying the
   rest were not reached. That is right and it is kept: thirteen rows of
   "&mdash;" is a table telling you nothing in thirteen places.

   THE KEPT SCENES REUSE `clip()`. The candidate chose three moments from
   their interview to show; `clip()` is the component their own portal shows
   them in. Its checkbox is what picks a clip, and the leader does not pick —
   so the scenes here are drawn by `ldrScene`, which is `clip()` with the
   control taken out rather than a second drawing of a video row.
   ========================================================================== */
const ldrScene = (title,note,stamp,len) => `<div class="clip">
    <span class="thumb">${I.play}<span class="t">${len}</span></span>
    <span class="cb"><span class="ct">${title}</span><span class="cq">${note} &middot; from ${stamp}</span></span>
  </div>`;

/* The six moments an interview is cut into. Three are picked per candidate,
   by name, so the same person always shows the same three — a stable demo
   without a store to keep them in. Same list the wireframe used. */
const LDR_SCENES = [
  ['Handing over a project that was going wrong','Delegation','minute 14','1:12'],
  ['Holding a line under pressure from a peer','Composure','minute 22','0:48'],
  ['Explaining a decision they later regretted','Decisiveness','minute 31','1:35'],
  ['Coaching a struggling team member','Coaching','minute 38','1:04'],
  ['Naming a problem before it became visible','Directness','minute 44','0:52'],
  ['Re-planning the week after a setback','Composure','minute 51','1:18']
];

V.leadMember = () => {
  const c = lco();
  const m = lmemOf(c, S.ldrMem);
  const d = m.pc - lpace(c);
  const done = lchDone(m);
  const notes = lnotes(m.name);
  const first = m.name.split(' ')[0];
  const [tk,tl] = ltask(m,c);

  /* Three scenes, chosen by the name so they are stable, in the wireframe's
     own arithmetic. */
  let seed = 0; for(let i = 0; i < m.name.length; i++) seed += m.name.charCodeAt(i);
  const pick = [seed % 6, (seed + 2) % 6, (seed + 4) % 6];

  return `<main class="main"><div class="page">
  ${crumb(['Cohorts','leadCohorts'],[lname(c),'leadCohort'], m.name)}
  ${/* THE HEADER TAKES NO ACTION, and the two actions sit together instead.
        "Add a note" was in `ph()`'s action slot, hard right of the h1, while
        "Message" sat in the identity row 80px below it — two things you can do
        about one person, drawn as far apart as the page allows, and the one in
        the header was the loudest object above the fold on a page whose subject
        is a record. They are one group: the person, then what you can do about
        them, in the row that names them. Same argument the interviews page
        makes for emptying its own header slot (views.js `V.interviews`). */''}
  ${ph(m.name, `${lname(c)} &middot; ${llevel(c)} &middot; week ${c.week} &middot; last active ${m.last.toLowerCase()}`)}
  <div class="sec">
    <div class="idhead">
      <span class="av-ph" style="width:72px;height:72px"><i>${m.ini}</i><img src="${AV[m.img]}" alt=""></span>
      <div class="idhead-b">
        <span class="idname">${m.name}</span>
        <span class="idmeta">${llevel(c)} &middot; ${lname(c)}</span>
        ${m.flag ? lflagTag(m.flag) : '<span class="tag green sm">On track</span>'}
      </div>
      ${/* MESSAGE FIRST, NOTE SECOND. A message goes TO them and a note is
            for the leader's own record, so the outward-facing one leads; and
            the note keeps the pencil it carried in the header. Both are
            `.btn-g` — neither is the page's primary action, the record is. */''}
      <div class="idhead-a">
        <button class="btn btn-g" data-go="leadMessages">Message ${I.chat}</button>
        <button class="btn btn-g" data-ldrnote="${m.name}">Add a note ${I.edit}</button>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="stats">
      ${statCell(I.growth, 'Progress',   m.pc + '<small>%</small>', `${d >= 0 ? '+' + d : d} against pace`)}
      ${statCell(I.chart,  'Assessment', m.avg ? m.avg + '<small>%</small>' : '<small>Not yet</small>', m.avg ? (m.avg < 75 ? 'below the 75% pass mark' : 'above the pass mark') : 'nothing assessed yet')}
      ${statCell(I.renew,  'Attempts',   m.att ? m.att.toFixed(1) : '<small>&mdash;</small>', m.att >= 2 ? 'going round twice' : 'first time through')}
      ${statCell(I.time,   'Time on the course', lhrs(lmins(m)), done ? Math.round(lmins(m)/done) + ' min a chapter' : 'not started')}
    </div>
  </div>
  ${done ? `<div class="sec tint">
    <div class="sec-h"><h2>Chapter record</h2><span class="t-helper-01">From the course platform</span></div>
    <div class="tbl-wrap">
      <table class="tbl ldr-tbl">
        <tr><th>#</th><th>Chapter</th><th>Status</th><th class="num">Score</th><th class="num">Attempts</th></tr>
        ${CH.slice(0, Math.min(13, done + 1)).map((ch,i) => {
          const complete = i < done;
          /* NO SCORE WITHOUT AN ASSESSMENT AVERAGE. `m.avg` of 0 means the
             course platform has sent nothing back, so a per-chapter score
             derived from it invented a 60% for a candidate the band above
             this table describes as "nothing assessed yet". */
          const sc = (complete && m.avg > 0) ? Math.max(60, Math.min(100, m.avg + ((i % 3) - 1) * 7)) : null;
          const at = complete ? (m.att >= 2 ? (i % 2 ? 3 : 2) : 1) : 1;
          return `<tr>
            <td class="num">${i+1}</td>
            <td><b>${ch[0]}</b></td>
            <td><span class="tag ${complete ? 'green' : ''} sm">${complete ? 'Complete' : 'In progress'}</span></td>
            <td class="num">${sc ? `<span class="tag ${sc >= 85 ? 'green' : sc >= 75 ? '' : 'org'} sm">${sc}%</span>` : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="num">${at}</td>
          </tr>`;
        }).join('')}
      </table>
    </div>
    ${done < 12 ? `<p class="t-helper-01 mt4">Chapters ${done+2}&ndash;13 not reached yet.</p>` : ''}
  </div>` : `<div class="sec tint">
    <div class="sec-h"><h2>Chapter record</h2></div>
    <div class="empty" style="border:0">${I.book}
      <h3>Nothing on the record</h3>
      <p>${first} has not opened a chapter, so the course platform has sent nothing back. The record fills in the moment they start.</p>
    </div>
  </div>`}
  <div class="sec">
    ${/* SHORT HEADINGS IN THIS COLUMN. At desktop §10 gives a section with a
          `.sec-h` a 184px label column, and "Where the level came from" set
          three words to a line in it while the helper under it took four more.
          Two words, and the sentence it needed moves under the tile. */''}
    <div class="sec-h"><h2>Their level</h2></div>
    <div class="tile">
      <div class="kv"><span class="k">Quiz band</span><span class="v n">Explorer &middot; ${m.avg ? m.avg >= 85 ? 'top of the band' : 'mid band' : 'not assessed'}</span></div>
      <div class="kv"><span class="k">Proposed at interview</span><span class="v n">Explorer &ndash; ${c.level[0]}${Math.min(5, +c.level[1] + 1)}</span></div>
      <div class="kv"><span class="k">Assigned</span><span class="v">${llevel(c)} <span class="tag org sm">reviewer went lower</span></span></div>
      <div class="kv"><span class="k">Next level</span><span class="v n">Explorer &ndash; ${c.level[0]}${Math.min(5, +c.level[1] + 1)} &middot; at the re-interview</span></div>
    </div>
    <p class="t-helper-01 mt4">Set at the interview, not by the quiz. The reviewer placed ${first} one below the proposal, so this level should be within reach. Persistent struggle at a level set conservatively is usually something other than placement.</p>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Your private notes</h2><span class="t-helper-01">${notes.length ? notes.length + ' note' + (notes.length === 1 ? '' : 's') + ' &middot; feeds the 90-day summary' : 'Feeds the 90-day summary'}</span></div>
    ${notes.length ? `<div class="tile-stack">
      ${notes.map((n,i) => `<div class="cardrow ldr-note">
        <span class="cardrow-ic">${I.edit}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${n.t}</span>
          <span class="cardrow-d">${n.w}</span>
        </span>
        <span class="cardrow-a">
          <button class="ic ldr-note-x" data-ldrnotedel="${m.name}:${i}" aria-label="Delete this note">${I.close}</button>
        </span>
      </div>`).join('')}
    </div>` : `<div class="empty" style="border:0">${I.edit}
      <h3>No notes yet</h3>
      <p>What you write here is private to you, and it is what the 90-day summary is drafted from at the end of the 90 days.</p>
    </div>`}
    <div class="btn-set mt5">
      <button class="btn btn-g" data-ldrnote="${m.name}">Add a note ${I.add}</button>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Attendance and this week</h2></div>
    <div class="facts">
      <div><span class="l">Calls attended</span><span class="v">${Math.max(0, c.week - (m.flag && m.flag.k === 'bad' ? 3 : 1))} of ${c.week}</span></div>
      <div><span class="l">Passed first time</span><span class="v">${Math.max(0, done - (m.att > 1 ? 1 : 0))} of ${done}</span></div>
      <div><span class="l">Week ${c.week} task</span><span class="v">${tl}</span></div>
      <div><span class="l">Last active</span><span class="v">${m.last}</span></div>
    </div>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Interview scenes</h2><span class="t-helper-01">The three ${first} chose to show</span></div>
    <div class="tile-stack">
      ${pick.map(i => ldrScene(...LDR_SCENES[i])).join('')}
    </div>
    <p class="t-helper-01 mt4">These are the clips ${first} kept from their interview and published on their profile &mdash; the same three visible in their own portal. The full recording is never shared with you.</p>
  </div>
</div></main>`;
};

/* ==========================================================================
   COURSE REPORTS

   THE SAME NUMBERS AS THE ROSTER, ASKED FROM THE OTHER END. The roster
   answers "how is this cohort doing"; this page answers "who across all
   three has stopped". So it is one list of twenty-eight, filtered, rather
   than three rosters — and the filter is the cohort, which is what the
   wireframe's `.rep-tabs` did.

   THE FILTER IS `.cs`, THE PRODUCT'S OWN SEGMENTED CONTROL, and it re-renders
   rather than hiding rows: unlike the dashboard's attention queue there is no
   text field here to lose the caret out of, and a filter that re-renders can
   change the figure band above it as well as the rows below it. Which it
   does — the four figures are of the SELECTION, or a leader reading "3 behind
   pace" under a cohort tab would be reading a number about all three.
   ========================================================================== */
V.leadReports = () => {
  const sel = S.ldrRep;
  const all = lmembers();
  const rows = (sel === 'all' ? all : all.filter(x => x.c.id === +sel));
  const behind = rows.filter(x => x.m.pc - lpace(x.c) <= -5);
  const weak = rows.filter(x => x.m.avg > 0 && x.m.avg < 75);
  const never = rows.filter(x => x.m.last === 'Never');
  const avg = rows.length ? Math.round(rows.reduce((s,x) => s + x.m.pc, 0) / rows.length) : 0;
  const worst = behind.slice().sort((a,b) => (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c)))[0];

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Course Reports')}
  ${''/* Shortened, not dropped: WHERE this data comes from is the one fact
        about this page that is not visible on it, and the `.note` below makes
        the argument at length. Tal now opens on the finding instead of on a
        description of the sort order. */}
  ${ph('Course Reports','From the course platform &middot; chapters, scores, attempts, attendance')}
  <div class="sec sec-cs">
    <div class="cs">
      <button class="${sel === 'all' ? 'on' : ''}" data-ldrrep="all">All cohorts<span class="lf-n">${all.length}</span></button>
      ${LEAD_COHORTS.map(c => `<button class="${sel === String(c.id) ? 'on' : ''}" data-ldrrep="${c.id}">${lname(c)}<span class="lf-n">${c.members.length}</span></button>`).join('')}
    </div>
  </div>
  <div class="sec">
    <div class="stats">
      ${statCell(I.growth, 'Average progress', avg + '<small>%</small>', sel === 'all' ? 'across all three cohorts' : 'in this cohort')}
      ${statCell(I.warningAlt, 'Behind pace', behind.length, 'five points or more')}
      ${statCell(I.chart, 'Below pass mark', weak.length, 'assessments under 75%')}
      ${statCell(I.misuse, 'Never signed in', never.length, never.length ? 'no activity at all' : 'everyone has started')}
    </div>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Course progress</h2><span class="t-helper-01">Ordered by the gap to expected pace</span></div>
    <div class="tbl-wrap">
      <table class="tbl ldr-tbl">
        <tr><th>Candidate</th>${sel === 'all' ? '<th>Cohort</th>' : ''}<th class="num">Chapters</th>
            <th class="num">Assessment</th><th class="num">Attempts</th><th class="num">Time</th><th>Last active</th><th></th></tr>
        ${rows.slice().sort((a,b) => (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c))).map(x => {
          const m = x.m, d = m.pc - lpace(x.c);
          return `<tr class="ldr-tr${m.flag ? (m.flag.k === 'bad' ? ' sev' : ' mod') : ''}" data-ldrco="${x.c.id}" data-ldrmem="${m.name}" data-go="leadMember" tabindex="0" role="button">
            ${/* A FACE IN THE FIRST CELL, the same argument `faceRow` makes in
                  lead.js: every row on this portal is a PERSON, and twenty-eight
                  rows of name-and-figures is the page where that is hardest to
                  hold. The mark is `mem-av mem-ph` at 24px — the roster's own
                  slot, one step down for a table row — so the reports table and
                  the roster draw the same candidate the same way. */''}
            <td><span class="ldr-who">
              <span class="mem-av mem-ph">${avatar({i:m.ini, img:AV[m.img]}, 24)}</span>
              <span class="ldr-who-n">${m.name}</span>
              ${d <= -5 ? `<span class="tag org sm">${Math.abs(d)} behind</span>` : ''}
            </span></td>
            ${sel === 'all' ? `<td>${x.c.id} <span class="t-helper-01">${x.c.level}</span></td>` : ''}
            <td class="num">${lchDone(m)} <span class="t-helper-01">of 13</span></td>
            <td class="num">${m.avg ? `${m.avg}%` : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="num">${m.att ? m.att.toFixed(1) : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="num">${lmins(m) ? lhrs(lmins(m)) : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td>${m.last.toLowerCase()}</td>
            <td class="ldr-go"><svg viewBox="0 0 24 24">${inner('chevRight')}</svg></td>
          </tr>`;
        }).join('')}
      </table>
    </div>
    ${worst ? `<p class="t-helper-01 mt4">${worst.m.name} is furthest behind &mdash; ${worst.m.pc}% against ${lpace(worst.c)}% expected in ${lname(worst.c).toLowerCase()}.</p>` : ''}
  </div>
  <div class="sec">
    <div class="note"><span>${I.info}</span><div class="nb"><b>Activity, not quality</b>Chapters, scores, attempts and timing are everything the course platform can tell you. None of it says how well somebody is thinking &mdash; that is in their written answers.</div></div>
  </div>
</div></main>`;
};

/* ==========================================================================
   THE BRIEF, AND THE NOTE — TWO SHEETS

   Both are `.modal > .sheet`, the component the candidate portal uses for
   editing details and adding a card. A brief is READ and dismissed, a note is
   WRITTEN and saved, and the sheet holds both because both are one task begun
   and finished without leaving the page underneath.

   THEY ARE MOUNTED BY A PASS, NOT BY THE VIEW. `render()` in views.js mounts
   its sheets itself, keyed on `S.view` — a line this file cannot add to
   without editing views.js. So the wrapper at the foot appends them to `.app`
   after the base render, which is what `placeBand` and `placeDark` do for the
   head band and the dark plate. `.modal` is `position:absolute;inset:0`, so
   `.app` is the element it has to be inside to cover the frame.
   ========================================================================== */
function ldrBriefSheet(){
  const c = S.ldrBrief ? lcoOf(S.ldrBrief) : null;
  if(!c) return `<div class="modal" data-ldrclose="brief"></div>`;
  const att = c.members.filter(m => m.flag);
  const severe = att.filter(m => m.flag.k === 'bad');
  const weakest = c.members.filter(m => m.avg > 0).slice().sort((a,b) => a.avg - b.avg)[0];
  const chapter = CH[Math.min(12, c.week - 1)];
  const behind = c.members.filter(m => m.pc < lpace(c) - 5).length;

  return `<div class="modal on" data-ldrclose="brief">
    <div class="sheet">
      <div class="sheet-h"><h2>Week ${c.week} brief</h2>
        <button class="x" data-ldrclose="brief" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="ai-aura tile mb6">
          <div class="ai-head">${talLabel()}<h3>Run the call like this</h3></div>
          <div class="ai-body"><p>${lname(c)} is ${lpaceGap(c) >= 0 ? 'on pace' : Math.abs(lpaceGap(c)) + ' points behind'} at week ${c.week} of 13, and this is drawn from where they actually are rather than from the syllabus.</p></div>
        </div>
        <ol class="steps mb6">
          <li><span class="s-n">1</span><span class="s-b"><b>Open on ${chapter[0]}</b>
            It is this week's chapter and the one carrying the cohort's lowest scores${weakest ? ` &mdash; ${weakest.name.split(' ')[0]} is at ${weakest.avg}%` : ''}.</span></li>
          <li><span class="s-n">2</span><span class="s-b"><b>Skip what is already landing</b>
            Anything with near-universal completion and scores above 85% does not need the hour. ${lavg(c,'avg')}% is the cohort average.</span></li>
          <li><span class="s-n">3</span><span class="s-b"><b>Ask for a real example, not a hypothetical</b>
            ${behind} of ${c.members.length} are behind pace, which is usually time rather than comprehension. A concrete example from their own week gets further than more material.</span></li>
          <li><span class="s-n">4</span><span class="s-b"><b>Raise ${severe.length ? 'the ' + severe.length + ' at risk privately' : 'nothing privately this week'}</b>
            ${severe.length ? 'Never in the group. ' + severe.slice(0,2).map(m => m.name).join(' and ') + (severe.length > 2 ? ' and others' : '') + '.' : 'Nobody in this cohort is flagged severely.'}</span></li>
        </ol>
        ${/* `.kv` ROWS, NOT A `.facts` BAND. `.facts` is an auto-fit grid sized
              for a page; inside a 520px sheet it fits three across and the
              fourth cell lands alone on a second row, where §10 stretches it
              the full width with its own fill. Four rows in a tile are four
              rows at any width, which is what a sheet needs. */''}
        <div class="tile mb6">
          <div class="kv"><span class="k">Average progress</span><span class="v">${lavg(c,'pc')}%</span></div>
          <div class="kv"><span class="k">Expected by now</span><span class="v n">${lpace(c)}%</span></div>
          <div class="kv"><span class="k">Assessment average</span><span class="v n">${lassess(c) ? lassess(c) + '%' : 'nothing assessed yet'}</span></div>
          <div class="kv"><span class="k">Behind pace</span><span class="v n">${behind} of ${c.members.length}</span></div>
        </div>
        ${att.length ? `<h3 class="ldr-sh">Bring these ${att.length} up privately</h3>
        <div class="tile-stack">
          ${att.slice(0,4).map(m => `<div class="cardrow">
            <span class="mem-av mem-ph">${avatar({i:m.ini, img:AV[m.img]}, 36)}</span>
            <span class="cardrow-b">
              <span class="cardrow-t">${m.name} ${lflagTag(m.flag)}</span>
              <span class="cardrow-d">${m.pc}% at day ${c.day} &middot; last active ${m.last.toLowerCase()}</span>
            </span>
          </div>`).join('')}
        </div>` : ''}
        <p class="t-helper-01 mt5">Everything above is computed from course activity &mdash; progress, scores, attempts and timing. Nothing in it reads their written answers, so it cannot tell you how well they are thinking.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-ldrclose="brief">Close</button>
        <button class="btn btn-p noic" data-ldrclose="brief">Print for the call</button>
      </div>
    </div>
  </div>`;
}

function ldrNoteSheet(){
  const name = S.ldrNote;
  return `<div class="modal ${name ? 'on' : ''}" data-ldrclose="note">
    <div class="sheet">
      <div class="sheet-h"><h2>${name ? 'A note on ' + name.split(' ')[0] : 'Add a note'}</h2>
        <button class="x" data-ldrclose="note" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="f"><label for="ldrNoteT">What you want to remember</label>
          <textarea class="inp" id="ldrNoteT" rows="4" placeholder="What you saw, what you asked them to try, what to check next."></textarea></div>
        <p class="t-helper-01">Private to you. ${name ? name.split(' ')[0] : 'The candidate'} never sees it, and it is what the 90-day summary is drafted from at the end of the 90 days.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-ldrclose="note">Cancel</button>
        <button class="btn btn-p noic" data-ldrnotesave="1">Save the note</button>
      </div>
    </div>
  </div>`;
}

/* A REGISTRY, NOT A LIST WRITTEN OUT HERE. The leader portal's sheets are
   spread across the files that own the pages they belong to — the brief and
   the note here, the profile and availability sheets in lead4.js — and there
   is one host for all of them. A later file pushes its own drawing function
   onto this array rather than mounting a second host of its own, so there is
   exactly one place in the DOM where a leader-side sheet can be and exactly
   one pass that fills it. */
const LDR_SHEETS = [ldrBriefSheet, ldrNoteSheet];

function placeLdrSheets(){
  const app = device.querySelector('.app');
  if(!app) return;
  let host = app.querySelector(':scope > .ldr-sheets');
  /* Only the leader portal has these, and the host is removed rather than
     emptied on the candidate side so nothing of this file is in the DOM of a
     portal it has no business in. */
  if(!isLead()){ if(host) host.remove(); return; }
  if(!host){
    host = document.createElement('div');
    host.className = 'ldr-sheets';
    app.appendChild(host);
  }
  host.innerHTML = LDR_SHEETS.map(f => { try { return f(); } catch(e){ return ''; } }).join('');
}

/* ==========================================================================
   THE LISTENERS

   NAVIGATION WITH A PARAMETER, WITHOUT TOUCHING `go()`.
   A row that opens a roster has to say two things: which cohort, and that a
   cohort page is where you are going. The candidate side solves this by
   putting the parameter in the target — `data-go="agent:priya"` — and giving
   `go()` a branch that splits on the colon. That branch is in views.js, and
   the wireframe's own version of this file records what splitting on a colon
   costs once a value can contain one: `data-ag="member:41:Maryam Naz"` had to
   be reassembled by the handler.

   So the parameter travels in its OWN attribute and the target stays a plain
   view name. This listener is registered in the CAPTURE phase, so it sets
   `S.ldrCo` and `S.ldrMem` on the way down and views.js's own bubble-phase
   `[data-go]` branch does the navigating on the way up with the state already
   correct. No copy of `go()`, no parsing, and a candidate called
   "Jean-Luc: Picard" would still work.
   ========================================================================== */
device.addEventListener('click', e => {
  const co = e.target.closest('[data-ldrco]');
  if(co) S.ldrCo = +co.dataset.ldrco;
  const mem = e.target.closest('[data-ldrmem]');
  if(mem) S.ldrMem = mem.dataset.ldrmem;
}, true);

/* A TABLE ROW IS A BUTTON, so it answers the keyboard like one. `role=button`
   and `tabindex=0` are on the row in the markup; Enter and Space have to be
   wired by hand, because a `tr` is not a `button` however it is labelled. */
device.addEventListener('keydown', e => {
  if(e.key !== 'Enter' && e.key !== ' ') return;
  const row = e.target.closest && e.target.closest('tr.ldr-tr[data-go]');
  if(!row) return;
  e.preventDefault();
  row.click();
});

device.addEventListener('click', e => {
  /* the cohort filter on Course Reports */
  const rep = e.target.closest('[data-ldrrep]');
  if(rep){ S.ldrRep = rep.dataset.ldrrep; render(); return; }

  /* the brief */
  const br = e.target.closest('[data-ldrbrief]');
  if(br){ S.ldrBrief = +br.dataset.ldrbrief; render(); return; }

  /* a note: open, save, delete. The textarea is read BEFORE the render that
     closes the sheet, because that render replaces it. */
  const nt = e.target.closest('[data-ldrnote]');
  if(nt){ S.ldrNote = nt.dataset.ldrnote; render(); return; }

  if(e.target.closest('[data-ldrnotesave]')){
    const box = device.querySelector('#ldrNoteT');
    const text = box ? box.value.trim() : '';
    if(!text){ if(box) box.focus(); return; }
    const name = S.ldrNote;
    if(name){
      S.ldrNotes[name] = S.ldrNotes[name] || [];
      S.ldrNotes[name].unshift({t:text, w:'Just now'});
    }
    S.ldrNote = null;
    render();
    return;
  }

  const del = e.target.closest('[data-ldrnotedel]');
  if(del){
    /* `name:index`, split from the RIGHT: the index is the last field and a
       name may contain anything at all, including a colon. */
    const raw = del.dataset.ldrnotedel;
    const cut = raw.lastIndexOf(':');
    const name = raw.slice(0, cut), i = +raw.slice(cut + 1);
    if(S.ldrNotes[name]) S.ldrNotes[name].splice(i, 1);
    render();
    return;
  }

  /* closing a sheet: the scrim, the x, and both feet */
  const cl = e.target.closest('[data-ldrclose]');
  if(cl){
    /* the scrim carries the attribute AND so does the sheet's own x, so a
       click inside the sheet body must not close it — only the element that
       actually carries the attribute counts as the target. */
    if(cl.classList.contains('modal') && e.target !== cl) return;
    if(cl.dataset.ldrclose === 'brief') S.ldrBrief = null;
    if(cl.dataset.ldrclose === 'note') S.ldrNote = null;
    render();
    return;
  }
});

/* ==========================================================================
   AND THE PAGE IS DRAWN AGAIN, WITH THIS FILE'S SHEETS ON IT
   The boot render is the last statement in views.js and every pass since has
   re-rendered at its own foot for the same reason: the paint on screen when
   this file is parsed was made without it. `placeLdrSheets` is a DOM pass, so
   it has to run after the base render rather than inside a view.
   ========================================================================== */
const _baseLdr = render;
render = function(){
  _baseLdr();
  try { placeLdrSheets(); } catch(e){ console.warn('ldr sheets', e); }
};

render();
