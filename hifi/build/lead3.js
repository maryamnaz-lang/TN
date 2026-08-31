/* ==========================================================================
   THE INTERVIEW PIPELINE — SESSIONS, EVALUATIONS, AND THE TWO SIGNATURES

   The three remaining pages of the leader's actual job: the interviews she
   runs, the level decisions those interviews produce, and the 90-day
   summaries that close a cohort. lead2.js drew the cohort side; this is the
   assessment side.

   WHY SESSIONS AND EVALUATIONS ARE STILL TWO MODULES.
   The wireframe put a note on Sessions explaining it: a booking has its own
   lifecycle — booked, attended, no-showed, cancelled — and a cancelled
   session never produces an evaluation, so the two cannot be one record. That
   reasoning is kept and the note is not: it argues with a reader who thinks
   they should be merged, and the leader is not that reader. What the leader
   gets instead is the LINK — a finished session shows whether its evaluation
   is written and opens it, which is the only part of the argument they need.

   THE DECISION IS A PAGE, NOT A SLIDE-OVER.
   The wireframe ran both signatures in a right-hand `.bk` sheet. This product
   has `.sheet` and lead2.js uses it for the brief and the note — but those are
   a thing you read and a thing you jot. A level decision is the most
   consequential act on this portal: it reads a transcript, four competency
   readings, two quoted moments, then takes a level and a reason. That is a
   page's worth of reading, it wants the page's measure, and it wants a URL of
   its own in the history so the back arrow works. `.sheet` maxes at 520px and
   88% height, which is where the wireframe's sheet had to scroll its own
   analysis; a page does not.
   ========================================================================== */

/* --------------------------------------------------------------------------
   TAL'S READ OF AN INTERVIEW

   Carried over from the wireframe's `EVALS[].an`, with one translation. The
   wireframe's second candidate was a Builder at B3, and on this portal Priya
   assesses E1–E3 only (`AGENTS.priya.range`) — a Builder in her queue
   contradicts data the candidate side already publishes. So the competency
   readings move into the Explorer band, which is what lead.js already did to
   the proposal itself.

   A COMPETENCY MAY READ ABOVE THE ASSIGNED LEVEL, and two of Rachel's do.
   That is the whole point of showing the breakdown rather than the average:
   the number being signed is a blend, and the leader is entitled to see which
   parts of it disagree with each other. It is also the argument the summary
   line makes — ambiguity at E4 against conflict repair at E2 is why the blend
   lands at 3 rather than 4.

   Keyed by eval id and kept here rather than in lead.js, because the queue
   only needs the proposal and its one-line reason. This is the module that
   needs the reading, so this is where the reading lives.
   -------------------------------------------------------------------------- */
const LDR_AN = {
  e1: {
    conf:'High',
    sum:'Quiz and interview both land in the Explorer band, at entry level. Clear intent and sound scoping, but two refusals to hand work over cap this at 1.',
    quiz:'64 out of 100 sits inside the Explorer band. The foundational questions carried the score; the multi-step delegation items are where the points went, which is the same gap the interview surfaced.',
    comps:[
      ['Task delegation','E1','Completed the steps personally. Handed work over only when asked to directly.'],
      ['Handling ambiguity','E2','Asked scoping questions before acting &mdash; a notch above the entry level.'],
      ['Quality checking','E1','Accepted the first output without a verification pass on two of three tasks.'],
      ['Communication','E2','Narrated intent clearly. Left some of the detail unexplained.']
    ],
    ev:[
      ['pos','14:20','Let me confirm the date range before I pull anything.','Scoped the task before acting. A genuine strength and the reason this is not below E1.'],
      ['neg','31:05','I&rsquo;d rather write that part myself than explain it to someone else.','Handover avoidance, said twice. This is the entry-level tell.']
    ],
    watch:'The two handover moments are what hold this at E1 rather than E2. Worth re-checking delegation at the 90-day mark.'
  },
  e2: {
    conf:'Medium',
    sum:'Top of the Explorer band, with standout reframing. Ambiguity and stakeholder reading come out a level above the rest; a weak conflict-repair answer pulls the blend back to 3.',
    quiz:'71 out of 100 is the top of the Explorer band. The structural questions drove the score and the interpersonal ones pulled it back, which is exactly what the interview then showed.',
    comps:[
      ['Handling ambiguity','E4','Reframed an under-specified brief into three testable options, unprompted.'],
      ['Stakeholder reading','E4','Named the real decision-makers and the incentives pulling against each other.'],
      ['Conflict repair','E2','Took the disagreement to escalation rather than working it through.'],
      ['Delegation','E3','Comfortable splitting work up. Lighter on checking what came back.']
    ],
    ev:[
      ['pos','18:44','There are really three readings of this ask &mdash; here is how I would test which one they mean.','Reframing at the E4 level, and the strongest single moment in the interview.'],
      ['neg','36:12','If they pushed back I would probably just escalate it to the lead.','Avoids repairing the conflict directly. The E2 signal, and the one thing holding this at 3.']
    ],
    watch:'Ambiguity and stakeholder reading sit at E4; conflict repair at E2 is what averages this to E3. Confidence is medium &mdash; one more interpersonal scenario would firm it up.'
  }
};

/* Confidence takes the tuned inks rather than a fourth colour: high is the
   same green as a passed assessment, low the same red as a severe flag. */
const ldrConf = k => `<span class="tag ${k === 'High' ? 'green' : k === 'Low' ? 'red' : 'org'} sm">${k} confidence</span>`;

const ldrEvOf  = id => LEAD_EVALS.filter(e => e.id === id)[0] || LEAD_EVALS[0];
const ldrSumOf = id => LEAD_SUMMARIES.filter(s => s.id === id)[0] || LEAD_SUMMARIES[0];
const ldrEvFor = name => LEAD_EVALS.filter(e => e.name === name)[0];

/* THE WHOLE LADDER, NOT ONE BAND OF IT. This was `[1,2,3,4,5]` — the five
   levels inside the band the quiz proposed — on the argument that the quiz
   fixes the band and the interview only picks the level inside it. That is the
   rule for the QUIZ, and this page is the one place it can be departed from:
   the leader has just spent forty-five minutes with the person, and a reading
   that lands them outside the proposed band is exactly the case the override
   box exists to record. A picker that cannot express it forces the leader to
   sign a level they do not mean and say so in prose.

   So it is all fifteen, in the one line the product draws everywhere else:
   Explorer E1–E5, Builder B1–B5, Trailblazer T1–T5 — the same order and the
   same labels as `ladder()` in views.js and the accordion on the interviews
   page ("Fifteen levels in one line"). Anything away from my proposal still
   costs a reason, and now that includes a band. */
/* AND IT IS `LVL_CODES` (views.js) UNDER ANOTHER NAME, not a second generator.
   The same fifteen strings were written out here and there, which is one edit
   away from a picker that offers a level the ladder does not draw. views.js
   parses first, so that is where the list lives; this keeps its own name because
   `LDR_RUNGS` is what the leader's picker and `ldrRungView` are written against,
   and because two `const` of the same name in one script would not parse. */
const LDR_RUNGS = LVL_CODES;

S.ldrEv = null;
S.ldrSum = null;
S.ldrPick = null;
S.ldrRec = null;
S.ldrErr = false;

/* ==========================================================================
   SESSIONS

   THE MONEY IS GONE AND SO IS THE FEE COLUMN. `SESSIONS` in the wireframe
   carried `fee:180` on every row and the leader's own pages never printed it;
   lead.js states the rule this portal is built on — a cohort leader
   volunteers — so the fact band reports what the leader is committing rather
   than what anybody is paying: the length, the format, when the evaluation is
   due, and how long the recording is kept.

   AN UPCOMING SESSION AND A FINISHED ONE ARE DIFFERENT ROWS ON PURPOSE.
   Upcoming answers "when, and who is this person" and its action is Join.
   Finished answers "did I write it up yet" and its action is the evaluation.
   The wireframe drew both as the same `.li` with a different dot; here the
   upcoming rows carry the date chip that the dashboard's Booked list uses,
   and the finished ones carry the evaluation's state instead — because a
   date chip on something that already happened is the least useful thing in
   the row.
   ========================================================================== */
V.leadSessions = () => {
  const up = LEAD_SESSIONS.filter(s => s.state === 'upcoming');
  const done = LEAD_SESSIONS.filter(s => s.state === 'done');
  const next = up[0];
  const waiting = done.filter(s => { const e = ldrEvFor(s.name); return e && e.status === 'pending'; }).length;

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Sessions')}
  ${''/* THE AVAILABILITY BUTTON CAME OFF THE HEADING (Maryam, 31 Aug 2026).
         It was a `ph()` action, so it sat above Tal's summary as the first
         thing on the page — a settings link introducing a page about this
         week's appointments. It came off the DASHBOARD's Booked section in
         the same pass, so the route now lives where the setting does:
         `V.leadProfile`, which owns the availability sheet, reachable from
         the rail and the account menu. Two buttons pointing at one settings
         page from two lists of appointments was the thing to remove, not
         the page. */}
  ${ph('Sessions','45 minutes each, recorded &middot; you sign the level afterwards')}
  ${''/* THE PLATE IS NOW THE BLACK CARD, AND IT IS THE DASHBOARD'S OWN
         (Maryam, 31 Aug 2026 — "follow the same summary and beneath that
         black call card layout"). `leadCallCard` already states this shape
         one file up: §75's `.dark-card` recipe, the time in `.dc-when` at
         the end of the heading row, `livTitle` / `livDetail` for the two
         strings. Calling it here rather than copying it is the `bkStamp`
         rule — one appointment, two pages, one drawing.
         WHY THE PLATE HAD TO GO RATHER THAN BE RESTYLED: `.plate` is in
         ai5's `DARK_CARD`, so `placeDark` hoists it into the head band —
         which is exactly what put it beside the summary in the first
         place. `.dark-card` is in no pass's list, so the summary keeps the
         full width and the card lands under it, in flow. §81's note on the
         leader dashboard is the long version of that same move.
         `second:false` — "All sessions" from the Sessions page is a link
         to the page you are on. */}
  ${next ? leadCallCard(next, {second:false}) : ''}
  <div class="sec">
    <div class="sec-h"><h2>Booked</h2><span class="t-helper-01">${up.length} interview${up.length === 1 ? '' : 's'}</span></div>
    ${up.length ? `<div class="tile-stack">
      ${up.map(s => `<div class="cardrow bk-row">
        <span class="day bk-day"><div class="d">${s.day}</div><div class="n">${s.time}</div></span>
        <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 36)}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${s.name}${s.re ? ' <span class="tag sm">Re-interview</span>' : ''}</span>
          <span class="cardrow-d">${s.mins} minutes &middot; quiz ${s.quiz} of 100, ${s.bucket} band &middot; ${s.re ? 'assessed against their 90 days' : 'no level yet'}</span>
        </span>
        <span class="cardrow-a">
          <button class="btn btn-p btn-sm noic">Join</button>
        </span>
      </div>`).join('')}
    </div>` : `<div class="empty" style="border:0">${I.calendar}
      <h3>Nothing booked</h3><p>Candidates book you from the times you open on your profile.</p></div>`}
  </div>
  <div class="sec tint">
    ${''/* "AWAITING DECISIONS", NOT "FINISHED" (Maryam, 31 Aug 2026). The
           interview being over is the least interesting thing about these
           rows — every one of them is a candidate whose 90 days cannot
           start until this leader signs. "Finished" named the state of the
           CALL; this names the state of the WORK, which is what the
           section's own count ("2 still need an evaluation") and its one
           action ("Write it up") have always been about. */}
    <div class="sec-h"><h2>Awaiting Decisions</h2><span class="t-helper-01">${waiting ? waiting + ' still need an evaluation' : 'all written up'}</span></div>
    <div class="tile-stack">
      ${done.map(s => {
        const e = ldrEvFor(s.name);
        const pend = e && e.status === 'pending';
        return `<div class="cardrow">
          <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 36)}</span>
          <span class="cardrow-b">
            <span class="cardrow-t">${s.name} ${pend ? '<span class="tag org sm">Evaluation due</span>' : e ? `<span class="tag green sm">Signed ${e.assigned ? 'Explorer &ndash; ' + e.assigned : ''}</span>` : '<span class="tag green sm">Written up</span>'}</span>
            <span class="cardrow-d">${s.when.toLowerCase()} &middot; ${s.mins} minutes &middot; recording and transcript available</span>
          </span>
          <span class="cardrow-a">
            ${pend
              ? `<button class="btn btn-p btn-sm noic" data-ldrev="${e.id}" data-go="leadEval">Write it up</button>`
              : `<button class="btn btn-sm noic">Recording</button>`}
          </span>
        </div>`;
      }).join('')}
    </div>
    ${''/* THE CLOSING LINE WENT WITH THE HEADING (Maryam, 31 Aug 2026). It
           existed to explain why a finished interview still needed
           something from you — which is the question "Finished" raised and
           "Awaiting Decisions" answers in two words. A sentence under the
           list restating the heading above it is the section explaining its
           own title. */}
  </div>
</div></main>`;
};

/* ==========================================================================
   EVALUATIONS

   TWO QUEUES, ONE PAGE, AND THEY ARE NOT THE SAME OBJECT. A level decision
   opens a candidate's 90 days; a 90-day summary closes them. Both are
   "a signature you owe somebody", which is why the dashboard counts them
   together in one figure — and both are listed here for the same reason. They
   are separate SECTIONS rather than one merged list because the two rows
   answer different questions: a level decision shows the level being proposed,
   a summary shows the record it is drawn from.

   NEITHER PAGE DRAWS A TAL CARD, and the long note above `ldrRead` in lead2.js
   is why: `talFirst` hoists one, `placeBand` claims it, ai6 strips its action
   and overwrites its words with `PAGESUM`. Tal's proposal is therefore a
   `PAGESUM.leadEvals` / `PAGESUM.leadEval` entry — the band at the top of each
   page — and the ROUTE the card would have offered is on the page instead,
   which is the condition ai6's own note sets for removing it: every pending
   decision is a row you press.
   ========================================================================== */
V.leadEvals = () => {
  const pe = LEAD_EVALS.filter(e => e.status === 'pending');
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const signed = LEAD_EVALS.filter(e => e.status === 'done');
  const published = LEAD_SUMMARIES.filter(s => s.status === 'done');
  const e0 = pe[0];

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Evaluations')}
  ${''/* Tal states the two counts and names the first candidate, so a line
        saying that there are level decisions and summaries waiting is the
        same sentence without the numbers in it. */}
  ${ph('Evaluations',`${lpending()} waiting on your signature`)}
  <div class="sec">
    <div class="stats">
      ${statCell(I.edit, 'Level decisions', pe.length, pe.length ? 'nobody can enroll until signed' : 'all signed')}
      ${statCell(I.document, 'Summaries', ps.length, ps.length ? 'closing a cohort' : 'all published')}
      ${statCell(I.checkFilled, 'Signed by you', signed.length + published.length, 'this session')}
      ${statCell(I.time, 'Due within', '48<small>h</small>', 'of the interview')}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Level decisions</h2><span class="t-helper-01">${pe.length ? pe.length + ' waiting' : 'nothing waiting'}</span></div>
    ${LEAD_EVALS.length ? `<div class="tile-stack">
      ${LEAD_EVALS.map(e => e.status === 'pending'
        ? `<button class="tile clk gcard face-row" data-ldrev="${e.id}" data-go="leadEval">
            <span class="mem-av mem-ph">${avatar({i:e.i, img:AV[e.img]}, 36)}</span>
            <span class="gcard-b"><h3>${e.name}</h3>
              <span class="sub">Interviewed ${e.when.toLowerCase()} &middot; quiz ${e.quiz} of 100 &middot; I proposed Explorer &ndash; ${e.ai}</span></span>
            <svg class="tile-arrow" viewBox="0 -960 960 960">${inner('arrowRight')}</svg>
          </button>`
        : `<div class="cardrow">
            <span class="mem-av mem-ph">${avatar({i:e.i, img:AV[e.img]}, 36)}</span>
            <span class="cardrow-b">
              <span class="cardrow-t">${e.name} <span class="tag green sm">Signed Explorer &ndash; ${e.assigned}</span>${e.override ? ' <span class="tag org sm">override</span>' : ''}</span>
              <span class="cardrow-d">${e.override ? 'You signed ' + e.assigned + ' against my ' + e.ai + ' &middot; your reason is on the decision' : 'You signed the level I proposed'}</span>
            </span>
          </div>`).join('')}
    </div>` : ''}
  </div>
  <div class="sec tint">
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
   ONE LEVEL DECISION

   THE READING IS THE PAGE AND THE PICKER IS AT THE FOOT, in that order,
   because a leader who has already chosen does not need to scroll past the
   evidence and a leader who has not needs to read it first.

   AN OVERRIDE COSTS A SENTENCE. Picking a level other than the proposal opens
   a required field, and the button will not submit without it. That is the
   wireframe's rule and it is the one piece of validation on either portal:
   the human decision wins, and the record has to say why it disagreed. The
   failure shows as a `.note` on the field rather than a toast, because this
   product has no toast and because the message belongs next to the box it is
   about.

   THE PICKER IS FIVE BUTTONS, NOT A `.cs` STRIP. `.cs` is a full-bleed tab
   strip that changes what is rendered; this changes a value in a form. Five
   `.btn`s with the chosen one taking `.btn-p` is what the wireframe used and
   what the product's own toggles look like.
   ========================================================================== */
V.leadEval = () => {
  const e = ldrEvOf(S.ldrEv);
  const an = LDR_AN[e.id];
  const pick = S.ldrPick || e.ai;
  const over = pick !== e.ai;
  const band = e.ai[0];
  const signed = e.status === 'done';

  return `<main class="main"><div class="page">
  ${crumb(['Evaluations','leadEvals'], e.name)}
  ${ph(`Level decision &middot; ${e.name}`, `Interviewed ${e.when.toLowerCase()} &middot; 45 minutes, recorded &middot; ${signed ? 'signed Explorer &ndash; ' + e.assigned : 'waiting on your signature'}`)}
  ${/* Tal's reading of the interview is the band at the top of this page —
        `PAGESUM.leadEval` — for the reason lead2.js records above `ldrRead`.
        What stays on the page is the EVIDENCE for it, which is the part a
        leader argues with: the quiz reading, the four competencies, the two
        quoted moments, and how confident Tal is about the blend. The
        confidence rides the competency heading rather than a card of its own,
        because it is a statement about those four readings. */''}
  ${/* THE COMPETENCY READ IS TAL'S, SO IT GOES WHERE TAL'S CARD GOES.
        The four readings and the confidence on them are the body of the
        paragraph `PAGESUM.leadEval` states in one sentence at the top of the
        page — the same claim, itemised. Drawn as a light section three blocks
        down, it read as the page's own record; a leader scrolling past it had
        no way to tell Tal's inference from the platform's facts, which is the
        one distinction this page exists to make.

        So it takes the DARK CARD, the object this product uses for exactly
        that — the dashboard's due-now plate, the level card, the certificate —
        and `placeDark` (ai5) lifts it into the module head band with them, one
        block under the sentence it expands. It comes FIRST in the source for
        the case where there is no band to join: `placeDark`'s fallback seats
        dark cards straight after the crumb, and a page whose Tal card has been
        hoisted still reads Tal-first that way.

        `.ldr-read` IS THE HOOK, NOT `.sec.on-dark`. Both are DARK_CARD
        members, but a `.sec` that matches gets WRAPPED in a second `.sec` by
        `placeDark` — the branch that exists for `.lvl-hero`, which has no
        section of its own — and two nested sections pay the gutter twice. A
        card class inside the section means the section is the host and moves
        as it stands, which is what every other dark card does. */''}
  ${an ? `
  <div class="sec">
    <div class="ldr-read on-dark">
      <div class="ldr-read-h"><h2>Competency read</h2>${ldrConf(an.conf)}</div>
      <div class="tbl-wrap">
        <table class="tbl ldr-tbl">
          <tr><th>Competency</th><th>Reads at</th><th>What I heard</th></tr>
          ${an.comps.map(([n,r,read]) => `<tr>
            <td>${n}</td>
            <td><span class="tag ${r === e.ai ? 'brand' : +r[1] > +e.ai[1] ? 'green' : 'org'} sm">${r}</span></td>
            <td class="ldr-prose">${read}</td>
          </tr>`).join('')}
        </table>
      </div>
      <p class="ldr-read-x">${an.watch}</p>
    </div>
  </div>` : ''}
  <div class="sec">
    <div class="facts">
      <div><span class="l">Quiz</span><span class="v">${e.quiz} of 100</span></div>
      <div><span class="l">Band</span><span class="v">${e.bucket || 'Explorer'}</span></div>
      <div><span class="l">I propose</span><span class="v">Explorer &ndash; ${e.ai}</span></div>
      <div><span class="l">Recorded</span><span class="v">45 minutes</span></div>
    </div>
  </div>
  ${an ? `
  <div class="sec">
    <div class="sec-h"><h2>From the interview</h2><span class="t-helper-01">Quoted from the transcript</span></div>
    <div class="ivt-lines">
      ${an.ev.map(([k,t,q,note]) => `
      <div class="tq them">
        <span class="tq-t">${t}</span>
        <span class="tq-b">
          <span class="tq-w">${e.name}
            <span class="ldr-${k}">${k === 'pos' ? I.checkFilled : I.warningAlt}${k === 'pos' ? 'Strength' : 'Concern'}</span></span>
          <span class="tq-x">&ldquo;${q}&rdquo;</span>
          <span class="tq-x t-helper-01">${note}</span>
        </span>
      </div>`).join('')}
    </div>
  </div>
  ${/* THE QUIZ READING FOLLOWS THE EVIDENCE, NOT THE FACTS BAND.
        It is a footnote on one number — "64 of 100" — and it sat directly
        under the band that prints it, which put the smallest claim on the page
        above the two things the decision actually turns on: the competency
        read and what the candidate said. A leader reads the inference, then
        the quotes, and only then wants to know how the score was made up.
        It is a `.note` and not a `.tile` for the reason it always was: `.tile`
        styles rows and headings, not prose. */''}
  <div class="sec">
    <div class="note"><span>${I.info}</span><div class="nb"><b>How the quiz reads</b>${an.quiz}</div></div>
  </div>` : ''}
  ${signed ? `
  <div class="sec">
    <div class="sec-h"><h2>Your decision</h2></div>
    <div class="tile">
      <div class="kv"><span class="k">Signed at</span><span class="v">Explorer &ndash; ${e.assigned}</span></div>
      <div class="kv"><span class="k">My proposal</span><span class="v n">Explorer &ndash; ${e.ai}${e.override ? ' &middot; you overrode it' : ' &middot; you agreed'}</span></div>
      ${e.reason ? `<div class="kv"><span class="k">Your reason</span><span class="v n">${e.reason}</span></div>` : ''}
      ${e.notes ? `<div class="kv"><span class="k">For their report</span><span class="v n">${e.notes}</span></div>` : ''}
    </div>
    <div class="btn-set mt5">
      <button class="btn btn-p" data-go="leadEvals">Back to evaluations ${I.arrowLeft}</button>
    </div>
  </div>` : `
  <div class="sec">
    ${/* NO HELPER OPPOSITE THE HEADING. "The level is yours, not mine" is the
          page's whole argument and it is already made twice where it counts —
          the closing line under the fields says it in full ("Agreeing with me
          is still your signature, not mine"), and Tal's own card says the
          proposal is a proposal. Beside the heading it was a third copy, set
          hard against the far edge of a 1500px column, which is where a COUNT
          or a state belongs and not a sentence: the heading and its own words
          ended up a metre apart with nothing between them. */''}
    <div class="sec-h"><h2>Your decision</h2></div>
    <div class="tile">
      ${/* THE LABEL NAMES THE LADDER AND WHERE THE QUIZ PUT THEM, because with
            all fifteen levels offered the picker no longer says which band was
            proposed — the five buttons used to say it by being the only five
            there. `data-band` marks the proposed band's five so §36.5 can
            group them; it is a mark on the SET, not a lock on the others. */''}
      <div class="f"><label>Level, E1 to T5 &middot; the quiz puts ${e.name.split(' ')[0]} in ${e.bucket || 'Explorer'}</label>
        <div class="btn-set ldr-rungs">
          ${LDR_RUNGS.map(r => `<button class="btn ${r === pick ? 'btn-p' : 'btn-g'} noic" data-ldrpick="${r}"${r[0] === band ? ' data-band="1"' : ''}>${r}</button>`).join('')}
        </div>
      </div>
      ${over ? `
      <div class="f mt5"><label for="ldrWhy">Why ${pick} instead of ${e.ai}?</label>
        <textarea class="inp" id="ldrWhy" rows="3" placeholder="Recorded on the decision. The human call wins, and the record says why."></textarea></div>
      ${S.ldrErr ? `<div class="note"><span>${I.warningAlt}</span><div class="nb"><b>An override needs a reason</b>You are signing ${pick} against my ${e.ai}. Say why in a sentence and it goes on the record with the decision.</div></div>` : ''}
      ` : ''}
      <div class="f mt5"><label for="ldrNotes">Notes for their report</label>
        <textarea class="inp" id="ldrNotes" rows="3" placeholder="Strengths, growth areas, and what to work on during the 90 days."></textarea></div>
      ${/* THE CLOSING LINE HAD TO CHANGE WITH THE PICKER. It said "the quiz
            fixes the band and you set the level", which was true of five
            buttons and is not true of fifteen: the band is now yours to
            depart from as well, and the sentence that describes the control
            has to describe the control. */''}
      <p class="t-helper-01">You can sign any level on the ladder, including outside the band the quiz proposed. ${over ? 'Overrides are logged with your reason.' : 'Agreeing with me is still your signature, not mine.'}</p>
    </div>
    <div class="btn-set mt5">
      <button class="btn btn-p" data-ldrsign="${e.id}">${over ? 'Sign as ' + pick + ' &middot; override' : 'Sign as ' + e.ai} ${I.checkFilled}</button>
      <button class="btn btn-t" data-go="leadEvals">Decide later ${I.time}</button>
    </div>
  </div>`}
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
   direction or the other, and a departure carries a reason for exactly the
   reason an override does on a level decision — the human call wins, and the
   record says why.

   TWO LEVELS IS A DEPARTURE UPWARDS, and it was the case the four could not
   say. A leader who thinks 90 days moved somebody two levels had no way to
   write it down: they could recommend the promotion the platform expected, or
   they could hold, and the extra level went in prose that nothing acts on. It
   is the same shape as "hold" — an exception the next agent has to know about
   before the re-interview — so it is offered as an option and gated by the
   same box, and the question above the box changes direction with it.

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
   Opening a decision also RESETS the draft — `S.ldrPick` from the last
   candidate signed would otherwise be the level offered for the next one.
   ========================================================================== */
device.addEventListener('click', e => {
  const ev = e.target.closest('[data-ldrev]');
  if(ev){ S.ldrEv = ev.dataset.ldrev; S.ldrPick = ldrEvOf(S.ldrEv).ai; S.ldrErr = false; }
  const su = e.target.closest('[data-ldrsum]');
  if(su){ S.ldrSum = su.dataset.ldrsum; S.ldrRec = 'promote'; S.ldrErr = false; }
}, true);

/* WHAT IS TYPED SURVIVES A PICK. Choosing a different level re-renders the
   page, and the render rebuilds the form — so both boxes are read into `S`
   BEFORE anything that renders, and printed back as the textarea's content.
   The same trap ai4.js records for the ask thread and lead.js for the queue's
   search field, met here by carrying the draft rather than by not rendering. */
function ldrDraftRead(){
  const why = device.querySelector('#ldrWhy');
  if(why) S.ldrWhy = why.value;
  const notes = device.querySelector('#ldrNotes');
  if(notes) S.ldrEvNotes = notes.value;
  const sw = device.querySelector('#ldrSumWhy');
  if(sw) S.ldrSumWhy = sw.value;
  const g = device.querySelector('#ldrGrowth');
  if(g) S.ldrGrowth = g.value;
  const d = device.querySelector('#ldrDev');
  if(d) S.ldrDev = d.value;
}

device.addEventListener('click', e => {
  const pk = e.target.closest('[data-ldrpick]');
  if(pk){ ldrDraftRead(); S.ldrPick = pk.dataset.ldrpick; S.ldrErr = false; render(); return; }

  const rc = e.target.closest('[data-ldrrec]');
  if(rc){ ldrDraftRead(); S.ldrRec = rc.dataset.ldrrec; S.ldrErr = false; render(); return; }

  const sg = e.target.closest('[data-ldrsign]');
  if(sg){
    ldrDraftRead();
    const ev = ldrEvOf(sg.dataset.ldrsign);
    const pick = S.ldrPick || ev.ai;
    const over = pick !== ev.ai;
    if(over && !(S.ldrWhy || '').trim()){
      S.ldrErr = true; render();
      const box = device.querySelector('#ldrWhy'); if(box) box.focus();
      return;
    }
    /* THE SIGNATURE MUTATES THE QUEUE, and that is the point: `lpending()` on
       the dashboard, the count on Sessions and the figure band on this page
       all read `status`, so signing here empties them everywhere at once
       rather than in one place. */
    ev.status = 'done';
    ev.assigned = pick;
    ev.override = over;
    ev.reason = (S.ldrWhy || '').trim();
    ev.notes = (S.ldrEvNotes || '').trim();
    S.ldrWhy = ''; S.ldrEvNotes = ''; S.ldrErr = false;
    render();
    return;
  }

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
  put('ldrWhy', S.ldrWhy);
  put('ldrNotes', S.ldrEvNotes);
  put('ldrSumWhy', S.ldrSumWhy);
  put('ldrGrowth', S.ldrGrowth);
  put('ldrDev', S.ldrDev);
}

/* THE CHOSEN LEVEL HAS TO BE IN VIEW, and below 900px the picker is a scroller
   (§36.5) fifteen levels long — so a leader who signs B3 on a phone is looking
   at a row that starts at E1 and shows five, with the one thing they just
   chose two screens to the right. The picker is rebuilt on every render (trap
   9), so this is a post-render pass like the draft above rather than state on
   the element: find the pressed level, and if the row scrolls, centre it.
   `scrollLeft` directly rather than `scrollIntoView`, which would also scroll
   the PAGE to reach a row that is already on screen. */
function ldrRungView(){
  const set = device.querySelector('.ldr-rungs');
  if(!set || set.scrollWidth <= set.clientWidth + 1) return;
  const on = set.querySelector('.btn-p');
  if(!on) return;
  set.scrollLeft = on.offsetLeft - (set.clientWidth - on.offsetWidth) / 2;
}

const _baseLdr3 = render;
render = function(){
  _baseLdr3();
  try { ldrDraftWrite(); } catch(e){ console.warn('ldr draft', e); }
  try { ldrRungView(); } catch(e){ console.warn('ldr rung', e); }
};

render();
