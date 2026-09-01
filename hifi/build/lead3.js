/* ==========================================================================
   THE CALLS AND THE ONE SIGNATURE

   The two remaining pages of the leader's actual job: the cohort calls she
   runs, and the 90-day summaries that close a cohort. lead2.js drew the cohort
   side; this is the diary and the sign-off.

   WHAT THIS FILE WAS UNTIL 1 SEP 2026, and why the whole of it went.
   It was "the interview pipeline" — Sessions, Evaluations and TWO signatures:
   `V.leadSessions` listed five 45-minute level interviews and `V.leadEval` was
   the most consequential page on the portal, reading a transcript, four
   competency readings and two quoted moments before taking a level and a
   reason. All of that is DELETED, because a cohort leader does not interview
   the initial candidates (Maryam, 1 Sep 2026); the talent agent does, one
   portal over, and the candidate side has always drawn it that way. lead.js's
   head is the long version.

   WHAT WENT WITH IT, ALL OF IT DELETED RATHER THAN LEFT UNREACHABLE:
   `LDR_AN` (Tal's per-candidate competency read, two records with four
   readings, two quotes and a confidence each), `ldrConf`, `ldrEvOf`,
   `ldrEvFor`, `LDR_RUNGS`, `V.leadEval`, `S.ldrEv` / `S.ldrPick`, the
   `[data-ldrpick]` and `[data-ldrsign]` handlers, the `ldrWhy` / `ldrNotes`
   drafts, and `ldrRungView` — the post-render pass that centred the chosen rung
   in a fifteen-level scroller on a phone. Two arguments in them were good and
   are not lost, because the SUMMARY makes both: an exception costs a sentence
   (`LDR_RECS` + the required box), and the human call wins with the record
   saying why.

   THE SIGNATURE IS STILL A PAGE, NOT A SLIDE-OVER.
   The wireframe ran it in a right-hand `.bk` sheet. This product has `.sheet`
   and lead2.js uses it for the brief and the note — but those are a thing you
   read and a thing you jot. A 90-day summary reads four figures off the roster
   and then takes a recommendation, a reason and two paragraphs; that is a
   page's worth of work, it wants the page's measure, and it wants a URL of its
   own in the history so the back arrow works. `.sheet` maxes at 520px and 88%
   height, which is where the wireframe's sheet had to scroll its own analysis;
   a page does not.
   ========================================================================== */

const ldrSumOf = id => LEAD_SUMMARIES.filter(s => s.id === id)[0] || LEAD_SUMMARIES[0];

/* THE CHAPTER A PAST CALL COVERED IS DERIVED, NOT STORED — the same read
   `lcall` takes for an upcoming one, one week back. `LEAD_RUN` states the
   attendance and nothing else, because the attendance is the only thing about a
   call that has already happened that no other record knows. */
const lranChapter = r => CH[Math.min(12, r.week - 1)][0];

S.ldrSum = null;
S.ldrRec = null;
S.ldrErr = false;

/* ==========================================================================
   CALLS — THE LEADER'S DIARY

   IT IS "CALLS" AND IT WAS "SESSIONS" (Maryam, 1 Sep 2026). The rail slot
   survives the interviews leaving because a leader still needs one page that
   answers "when am I on", and the word that named a diary of two kinds now
   names one: three cohort calls a week, sixty minutes each, and the ones
   already behind them.

   THE PAGE EARNS ITS PLACE ON THE PAST, WHICH IS THE HALF NOTHING ELSE HOLDS.
   `V.leadCohorts` already lists this week's three calls with their briefs, so a
   page that only did that would be the "route to the same content" this portal
   keeps deleting — the note over `BOOKED_SHOWN` is the same argument from the
   dashboard's side. So Cohorts gives its own call list UP to this page (its
   heading row points here), and this page holds both halves: what is coming,
   and what happened — the week, the chapter it covered, and who turned up.

   AN UPCOMING CALL AND A FINISHED ONE ARE DIFFERENT ROWS ON PURPOSE, and this
   is the one piece of the interview page's reasoning that ports verbatim.
   Upcoming answers "when, and which cohort" and its action is the brief.
   Finished answers "how did it go" and has no action at all. So the upcoming
   rows carry the date chip the dashboard's list uses, and the past rows carry
   the attendance instead — a date chip on something that already happened is
   the least useful thing in the row.

   THE MONEY IS GONE AND SO IS THE FEE COLUMN. `SESSIONS` in the wireframe
   carried `fee:180` on every row; lead.js states the rule this portal is built
   on — a cohort leader volunteers — so the fact band reports what the leader is
   committing rather than what anybody is paying.
   ========================================================================== */
V.leadCalls = () => {
  const up = lcalls();
  const next = up[0];
  const run = LEAD_RUN;
  /* Every attendance in `LEAD_RUN` against every seat those calls had, so the
     figure is the real ratio rather than a number typed next to it. */
  const seats = run.reduce((s,r) => s + lcoOf(r.co).members.length, 0);
  const came  = run.reduce((s,r) => s + r.attended, 0);

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Calls')}
  ${''/* THE AVAILABILITY BUTTON CAME OFF THE HEADING (Maryam, 31 Aug 2026).
         It was a `ph()` action, so it sat above Tal's summary as the first
         thing on the page — a settings link introducing a page about this
         week's appointments. It came off the DASHBOARD's own list in the same
         pass, so the route lives where the setting does: `V.leadProfile`,
         reachable from the rail and the account menu. Two buttons pointing at
         one settings page from two lists of appointments was the thing to
         remove, not the page. The sentence it sat beside has changed with the
         subject: the leader is not booked BY anybody now, so the spine states
         the shape of the commitment instead. */}
  ${ph('Calls',`${up.length} cohorts &middot; one call a week each &middot; 60 minutes, not recorded`)}
  ${''/* THE PLATE IS NOW THE BLACK CARD, AND IT IS THE DASHBOARD'S OWN
         (Maryam, 31 Aug 2026 — "follow the same summary and beneath that
         black call card layout"). `leadCallCard` states that shape one file
         up: §75's `.dark-card` recipe, the time in `.dc-when` at the end of
         the heading row, `lcTitle` / `lcDetail` for the two strings. Calling
         it here rather than copying it is the `bkStamp` rule — one
         appointment, two pages, one drawing.
         WHY THE PLATE HAD TO GO RATHER THAN BE RESTYLED: `.plate` is in
         ai5's `DARK_CARD`, so `placeDark` hoists it into the head band —
         which is exactly what put it beside the summary in the first
         place. `.dark-card` is in no pass's list, so the summary keeps the
         full width and the card lands under it, in flow. §81's note on the
         leader dashboard is the long version of that same move.
         THE SECONDARY IS THE CALLER'S AGAIN, and this page is why. The
         dashboard's card says "View all calls" and points here (Maryam,
         1 Sep 2026); on THIS page that would be a link to the page you are
         already on — the "gate nothing writes" tell wearing a different hat,
         and the reason this call site used to pass `second:false` and end
         with no action at all. The brief is per-CALL rather than per-page, so
         it is the right action here and the card keeps one. */}
  ${next ? leadCallCard(next, {second:{at:`data-ldrbrief="${next.co}"`, ic:I.edit, t:'Generate the brief'}}) : ''}
  <div class="sec">
    <div class="sec-h"><h2>This week</h2><span class="t-helper-01">${up.length} call${up.length === 1 ? '' : 's'} &middot; sixty minutes each</span></div>
    ${up.length ? `<div class="tile-stack">
      ${up.map(k => `<div class="cardrow bk-row${/^today$/i.test(k.day) ? ' bk-now' : ''}">
        <span class="day bk-day"><div class="d">${k.day}</div><div class="n">${k.time}</div></span>
        <span class="cardrow-ic">${I.group}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${lcTitle(k)}</span>
          <span class="cardrow-d">${k.seats} candidates at Explorer &ndash; ${k.level} &middot; ${lcDetail(k)}</span>
        </span>
        <span class="cardrow-a">
          <button class="btn btn-p btn-sm noic" data-ldrbrief="${k.co}">Brief</button>
        </span>
      </div>`).join('')}
    </div>` : `<div class="empty" style="border:0">${I.calendar}
      <h3>Nothing this week</h3><p>Every cohort you lead has a weekly call, and they all show up here.</p></div>`}
    <p class="t-helper-01 mt4">A brief is generated from where the cohort actually is, not from where the syllabus says it should be.</p>
  </div>
  <div class="sec tint">
    ${''/* THE COUNT OPPOSITE THE HEADING IS THE ATTENDANCE ACROSS ALL OF THEM,
           because that is the one reading a list of past calls is FOR. Row by
           row it says who came to which; read together it says whether the
           cohorts are still turning up, which is the question the attention
           queue answers about the chapters and nothing answered about the
           calls. Cohort 47 is in week 1 and has no rows here at all — the
           empty half of the list, drawn rather than hidden. */}
    <div class="sec-h"><h2>Already run</h2><span class="t-helper-01">${run.length ? came + ' of ' + seats + ' seats filled' : 'nothing yet'}</span></div>
    ${run.length ? `<div class="tile-stack">
      ${run.map(r => {
        const c = lcoOf(r.co);
        const miss = c.members.length - r.attended;
        return `<div class="cardrow">
          <span class="cardrow-ic">${I.group}</span>
          <span class="cardrow-b">
            <span class="cardrow-t">Cohort ${r.co} &middot; week ${r.week} <span class="tag ${miss > 2 ? 'org' : 'green'} sm">${r.attended} of ${c.members.length} attended</span></span>
            <span class="cardrow-d">${r.when} &middot; ${lranChapter(r)}${miss ? ' &middot; ' + miss + ' did not join' : ''}</span>
          </span>
        </div>`;
      }).join('')}
    </div>` : `<div class="empty" style="border:0">${I.time}
      <h3>No calls behind you yet</h3><p>Your first cohort call is this week.</p></div>`}
  </div>
</div></main>`;
};

/* ==========================================================================
   EVALUATIONS — ONE QUEUE NOW, AND IT IS THE 90-DAY SUMMARY

   IT WAS TWO QUEUES AND THE ARGUMENT FOR THE PAIR WAS GOOD: "a level decision
   opens a candidate's 90 days; a 90-day summary closes them. Both are a
   signature you owe somebody." Only the closing half is the leader's (Maryam,
   1 Sep 2026) — the opening half is the talent agent's, one portal over, and
   lead.js's head is the argument. So the first section, its `.stats` cells and
   the page it opened are deleted.

   THE MODULE KEEPS THE NAME "EVALUATIONS", which is a judgement rather than
   inertia. A 90-day summary IS the leader's evaluation of a candidate — four
   figures off the roster, a recommendation and a reason — and "Summaries" names
   the artefact rather than the act. The heading inside the page names the
   artefact, which is where that word belongs.

   THE PAGE DOES NOT DRAW A TAL CARD, and the long note above `ldrRead` in
   lead2.js is why: `talFirst` hoists one, `placeBand` claims it, ai6 strips its
   action and overwrites its words with `PAGESUM`. Tal's reading is therefore a
   `PAGESUM.leadEvals` / `PAGESUM.leadSum` entry — the band at the top of each
   page — and the ROUTE the card would have offered is on the page instead,
   which is the condition ai6's own note sets for removing it: every pending
   summary is a row you press.

   THE FIGURE BAND IS FOUR CELLS ABOUT ONE QUEUE, NOT TWO ABOUT TWO. "Due
   within 48h of the interview" went with the interview; a summary is due when
   the cohort closes, which is a date the cohort record already knows.
   ========================================================================== */
V.leadEvals = () => {
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const published = LEAD_SUMMARIES.filter(s => s.status === 'done');
  /* the cohort every waiting summary belongs to — all of them are Cohort 33
     today, and `lcoOf` is what makes the week and the seats read rather than
     be typed if a second cohort ever reaches day 90 */
  const c0 = lcoOf((ps[0] || LEAD_SUMMARIES[0]).cohort);

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Evaluations')}
  ${''/* NO `sub`, AND THAT IS THE DOCUMENTED MOVE. It said "2 waiting on your
         signature" directly above Tal saying "Two 90-day summaries are waiting
         on you" — the exact duplication CLAUDE.md's two-copy-slots rule exists
         to stop, and it survived the old version only because Tal's sentence
         there led on level decisions instead. This page has no factual SPINE of
         its own: the queue is one to four candidates from whichever cohort has
         reached day 90, which is a count rather than a coordinate, and the four
         figure cells below state it four ways. So Tal's sentence is the opening
         line, which is what the rule prescribes for a page with no spine. */}
  ${ph('Evaluations')}
  <div class="sec">
    <div class="stats">
      ${statCell(I.document, '90-day summaries', ps.length, ps.length ? 'closing a cohort' : 'all published')}
      ${statCell(I.checkFilled, 'Published by you', published.length, 'this session')}
      ${statCell(I.group, 'Cohort closing', c0.id, `week ${c0.week} of 13`)}
      ${statCell(I.time, 'Due by', 'Day 90', 'of their cohort')}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>90-day summaries</h2><span class="t-helper-01">${ps.length ? ps.length + ' waiting' : 'nothing waiting'}</span></div>
    <div class="tile-stack">
      ${LEAD_SUMMARIES.map(s => {
        const c = lcoOf(s.cohort);
        const m = lmemOf(c, s.name);
        return s.status === 'pending'
        ? `<button class="tile clk gcard face-row" data-ldrsum="${s.id}" data-go="leadSum">
            <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 36)}</span>
            <span class="gcard-b"><h3>${s.name}</h3>
              <span class="sub">${lname(c)} &middot; ${m.pc}% complete &middot; assessments ${m.avg}% &middot; sign to close their 90 days</span></span>
            <svg class="tile-arrow" viewBox="0 -960 960 960">${inner('arrowRight')}</svg>
          </button>`
        : `<div class="cardrow">
            <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 36)}</span>
            <span class="cardrow-b">
              <span class="cardrow-t">${s.name} <span class="tag green sm">Published</span></span>
              <span class="cardrow-d">${lname(c)} &middot; you recommended: ${s.rec}</span>
            </span>
          </div>`;
      }).join('')}
    </div>
    ${/* THE FOOTNOTE IS GONE. It explained what a summary is FOR — "the
          document a candidate's next level is argued from" — to the one person
          who already knows, at the foot of a list of two rows that each say
          "sign to close their 90 days". A closing line earns its place
          when it tells you something the rows do not; this one restated the
          page's own subject. */''}
  </div>
</div></main>`;
};

/* ==========================================================================
   ONE NINETY-DAY SUMMARY

   THE RECORD IS READ-ONLY AND THE RECOMMENDATION IS NOT. Everything above the
   recommendation comes back from the course platform for a candidate the
   leader has watched for thirteen weeks — and it is READ OFF THE ROSTER, not
   stored on the summary. The wireframe's `SUMMARIES` carried its own `pc`,
   `avg`, `mins` and `calls`, which is the same candidate's numbers written
   down twice; here `lmemOf` reads the member record the roster and the reports
   both read, so a summary cannot disagree with the page the leader was just
   looking at.

   FIVE RECOMMENDATIONS, AND FOUR OF THEM COST A SENTENCE. One level after
   90 days that went well is the expected end, and it is the only one that
   costs nothing: it is what the course is for and the numbers above it are the
   argument. Every other answer is the leader departing from that, in one
   direction or the other, and a departure carries a reason for one reason: the
   human call wins, and the record says why. This USED to be stated as "for
   exactly the reason an override does on a level decision", and with that page
   gone (1 Sep 2026) this is the only place in the portal that makes the
   argument — which is why it is now made in full here rather than by reference.

   TWO LEVELS IS A DEPARTURE UPWARDS, and it was the case the four could not
   say. A leader who thinks 90 days moved somebody two levels had no way to
   write it down: they could recommend the promotion the platform expected, or
   they could hold, and the extra level went in prose that nothing acts on. It
   is the same shape as "hold" — an exception the next agent has to know about
   before the re-interview — so it is offered as an option and gated by the same
   required box, and the question above the box changes direction with it.

   WHY THE COPY BRANCHES ON `up` RATHER THAN ON THE KEY. There are two kinds of
   exception here and one field: asking "why not a promotion?" of a leader who
   has just chosen a DOUBLE promotion is asking the opposite of what happened,
   and asking "why two levels?" of a hold is worse. One boolean, three strings.
   ========================================================================== */
const LDR_RECS = [['promote','Ready to promote'],['promote2','Promote two levels'],
                  ['hold','Hold at this level'],
                  ['down','Move down a level'],['notready','Not ready to re-interview']];

V.leadSum = () => {
  const s = ldrSumOf(S.ldrSum);
  const c = lcoOf(s.cohort);
  const m = lmemOf(c, s.name);
  const rec = S.ldrRec || 'promote';
  const needsWhy = rec !== 'promote';
  /* the one exception that goes UP. `next` is the level two above where they
     are, printed so the question names the thing being asked for rather than
     asking about "two levels" in the abstract. */
  const up = rec === 'promote2';
  const rung = +llevel(c).replace(/\D/g,'') || 1;
  const twoUp = llevel(c).replace(/\d+/, Math.min(5, rung + 2));
  const done = s.status === 'done';
  const first = s.name.split(' ')[0];
  const retakes = m.att > 1.4 ? 3 : m.att > 1.1 ? 2 : 1;

  return `<main class="main"><div class="page">
  ${crumb(['Evaluations','leadEvals'], s.name)}
  ${ph(`90-day summary &middot; ${s.name}`, `${lname(c)} &middot; ${llevel(c)} &middot; ${done ? 'published' : 'waiting on your signature'}`)}
  <div class="sec">
    <div class="idhead">
      <span class="av-ph" style="width:72px;height:72px"><i>${s.i}</i><img src="${AV[s.img]}" alt=""></span>
      <div class="idhead-b">
        <span class="idname">${s.name}</span>
        <span class="idmeta">${lname(c)} &middot; 90 days complete</span>
        <span class="tag sm">${llevel(c)}</span>
      </div>
      <div class="idhead-a"><button class="btn btn-g" data-ldrco="${c.id}" data-ldrmem="${s.name}" data-go="leadMember">Their full record ${I.arrowRight}</button></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>What the 90 days produced</h2><span class="t-helper-01">From the course platform &middot; read-only</span></div>
    <div class="stats">
      ${statCell(I.book,  'Chapters', lchDone(m) + '<small> of 13</small>', m.pc + '% complete')}
      ${statCell(I.chart, 'Assessment average', m.avg + '<small>%</small>', m.avg >= 85 ? 'well above the pass mark' : 'above the pass mark')}
      ${statCell(I.time,  'Time on the course', lhrs(lmins(m)), Math.round(lmins(m)/lchDone(m)) + ' min a chapter')}
      ${statCell(I.renew, 'Chapters retaken', retakes, m.att.toFixed(1) + ' attempts on average')}
    </div>
  </div>
  ${/* ONE BAND OF FIGURES, NOT TWO. A `.facts` row of four sat directly under
        the `.stats` row of four — the same object twice, one with an icon and
        a sub-line and one without, and nothing said why "calls attended"
        belonged in the plain row while "chapters retaken" belonged in the
        marked one. Two identical grids stacked also read as one eight-cell
        table that had wrapped, which put a border between rows four and five
        for no reason a reader could name.

        The four that stayed are the four the recommendation turns on: how much
        of the course is done, how well it was assessed, how long it took, how
        much was retaken. Calls attended, tasks on time and last-active are the
        roster's numbers and they are one click away on "Their full record",
        which is the button this page already puts beside the person's name.
        The leader's own note count is not a fact about the candidate at all. */''}
  ${done ? `
  <div class="sec tint">
    <div class="sec-h"><h2>What you published</h2></div>
    <div class="tile">
      <div class="kv"><span class="k">Recommendation</span><span class="v">${s.rec}</span></div>
      ${/* THE REASON IS PART OF THE RECORD, so the record prints it. The
            publish handler has always stored `s.why` and this block never
            showed it, which made the gate look like a formality: the leader
            was made to justify an exception into a box whose contents then
            appeared nowhere. It sits directly under the recommendation it
            qualifies, because that pair is the whole exception. */''}
      ${s.why ? `<div class="kv"><span class="k">Why</span><span class="v n">${s.why}</span></div>` : ''}
      ${s.growth ? `<div class="kv"><span class="k">Where they grew</span><span class="v n">${s.growth}</span></div>` : ''}
      ${s.develop ? `<div class="kv"><span class="k">Still to develop</span><span class="v n">${s.develop}</span></div>` : ''}
    </div>
    <div class="btn-set mt5">
      <button class="btn btn-p" data-go="leadEvals">Back to evaluations ${I.arrowLeft}</button>
    </div>
  </div>` : `
  <div class="sec tint">
    <div class="sec-h"><h2>Your recommendation</h2><span class="t-helper-01">This is what the next agent reads</span></div>
    <div class="tile">
      <div class="f">
        <label>Where ${first} stands after 90 days</label>
        <div class="btn-set ldr-recs">
          ${LDR_RECS.map(([k,l]) => `<button class="btn ${rec === k ? 'btn-p' : 'btn-g'} noic" data-ldrrec="${k}">${l}</button>`).join('')}
        </div>
      </div>
      ${needsWhy ? `
      <div class="f mt5"><label for="ldrSumWhy">${up
          ? `Why two levels, to ${twoUp}?`
          : 'Why not a promotion?'}</label>
        <textarea class="inp" id="ldrSumWhy" rows="3" placeholder="${up
          ? 'Two levels is more than 90 days is built to move. Say what they did that the numbers above do not show.'
          : '90 days that did not end in a promotion needs a reason on the record.'}"></textarea></div>
      ${S.ldrErr ? `<div class="note"><span>${I.warningAlt}</span><div class="nb"><b>This one needs a reason</b>${up
          ? 'A double promotion is you saying 90 days did more than they are built to. Say why, and it goes on the summary the next agent reads.'
          : 'Anything other than a promotion is you saying the 90 days did not do what they were meant to. Say why, and it goes on the summary.'}</div></div>` : ''}
      ` : ''}
      <div class="f mt5"><label for="ldrGrowth">Where they grew</label>
        <textarea class="inp" id="ldrGrowth" rows="3" placeholder="What changed over the 90 days that the numbers above do not show."></textarea></div>
      <div class="f mt5"><label for="ldrDev">Still to develop</label>
        <textarea class="inp" id="ldrDev" rows="3" placeholder="What the next 90 days, or the re-interview, should look at."></textarea></div>
      <p class="t-helper-01">Published to ${first} and to whichever agent runs their re-interview. Your private notes stay private.</p>
    </div>
    <div class="btn-set mt5">
      <button class="btn btn-p" data-ldrpub="${s.id}">Publish the summary ${I.checkFilled}</button>
      <button class="btn btn-t" data-go="leadEvals">Finish later ${I.time}</button>
    </div>
  </div>`}
</div></main>`;
};

/* ==========================================================================
   THE LISTENERS

   Same capture-phase trick lead2.js records: the parameter travels in its own
   attribute so `data-go` stays a plain view name and `go()` needs no branch.
   Opening a summary also RESETS the recommendation — `S.ldrRec` from the last
   candidate published would otherwise be the answer offered for the next one.

   `[data-ldrev]` WENT WITH THE LEVEL DECISION (1 Sep 2026), and so did the
   `[data-ldrpick]` and `[data-ldrsign]` handlers below. Nothing in either
   portal writes those attributes any more; a listener matching a selector no
   markup emits is the "gate nothing writes" tell in JS, and it costs more than
   a dead CSS rule because it reads as a live flow to whoever greps for it.
   ========================================================================== */
device.addEventListener('click', e => {
  const su = e.target.closest('[data-ldrsum]');
  if(su){ S.ldrSum = su.dataset.ldrsum; S.ldrRec = 'promote'; S.ldrErr = false; }
}, true);

/* WHAT IS TYPED SURVIVES A PICK. Choosing a different recommendation
   re-renders the page, and the render rebuilds the form — so every box is read
   into `S` BEFORE anything that renders, and printed back as the textarea's
   content. The same trap ai4.js records for the ask thread and lead.js for the
   queue's search field, met here by carrying the draft rather than by not
   rendering. */
function ldrDraftRead(){
  const sw = device.querySelector('#ldrSumWhy');
  if(sw) S.ldrSumWhy = sw.value;
  const g = device.querySelector('#ldrGrowth');
  if(g) S.ldrGrowth = g.value;
  const d = device.querySelector('#ldrDev');
  if(d) S.ldrDev = d.value;
}

device.addEventListener('click', e => {
  const rc = e.target.closest('[data-ldrrec]');
  if(rc){ ldrDraftRead(); S.ldrRec = rc.dataset.ldrrec; S.ldrErr = false; render(); return; }

  /* PUBLISHING MUTATES THE QUEUE, and that is the point: `lpending()` on the
     dashboard, its "Waiting on you" list and the figure band on Evaluations all
     read `status`, so publishing here empties them everywhere at once rather
     than in one place. */
  const pb = e.target.closest('[data-ldrpub]');
  if(pb){
    ldrDraftRead();
    const s = ldrSumOf(pb.dataset.ldrpub);
    const rec = S.ldrRec || 'promote';
    if(rec !== 'promote' && !(S.ldrSumWhy || '').trim()){
      S.ldrErr = true; render();
      const box = device.querySelector('#ldrSumWhy'); if(box) box.focus();
      return;
    }
    s.status = 'done';
    s.rec = (LDR_RECS.filter(r => r[0] === rec)[0] || LDR_RECS[0])[1];
    s.why = (S.ldrSumWhy || '').trim();
    s.growth = (S.ldrGrowth || '').trim();
    s.develop = (S.ldrDev || '').trim();
    S.ldrSumWhy = ''; S.ldrGrowth = ''; S.ldrDev = ''; S.ldrErr = false;
    render();
    return;
  }
});

/* THE DRAFT IS PRINTED BACK INTO THE BOXES after every render, rather than
   inlined into the markup: a `value` attribute on a textarea is its INITIAL
   content, and setting it from `S` inside the template would also mean
   escaping whatever was typed. Writing `.value` after the paint has neither
   problem, and it is the same shape as `leadFilterApply`. */
function ldrDraftWrite(){
  const put = (id,v) => { const el = device.querySelector('#' + id); if(el && v) el.value = v; };
  put('ldrSumWhy', S.ldrSumWhy);
  put('ldrGrowth', S.ldrGrowth);
  put('ldrDev', S.ldrDev);
}

/* `ldrRungView` WAS THE SECOND POST-RENDER PASS HERE AND IT IS GONE WITH THE
   PICKER (1 Sep 2026). It centred the chosen rung in `.ldr-rungs`, which below
   900px is a fifteen-level scroller (§36.5) — a leader who signed B3 on a phone
   was otherwise looking at a row that starts at E1 and shows five. Nothing
   writes `.ldr-rungs` now, so the pass and §36.5's rules both go; the reasoning
   is worth keeping because `LDR_RECS` is a `.btn-set` in the same shape and
   would want the same pass if it ever grew past a phone's width. It has five
   entries and wraps, so it does not. */
const _baseLdr3 = render;
render = function(){
  _baseLdr3();
  try { ldrDraftWrite(); } catch(e){ console.warn('ldr draft', e); }
};

render();
