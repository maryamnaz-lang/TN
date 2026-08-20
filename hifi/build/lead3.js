/* ==========================================================================
   THE INTERVIEW PIPELINE — SESSIONS, EVALUATIONS, AND THE TWO SIGNATURES

   The three remaining pages of the leader's actual job: the interviews she
   runs, the level decisions those interviews produce, and the ninety-day
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
   readings, two quoted moments, then takes a rung and a reason. That is a
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

   A COMPETENCY MAY READ ABOVE THE ASSIGNED RUNG, and two of Rachel's do.
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
    sum:'The quiz and the interview agree on the Explorer band, and the interview places them at the entry rung. Clear intent and sound scoping, but two moments of keeping the work rather than handing it over cap the number at 1.',
    quiz:'64 out of 100 sits inside the Explorer band. The foundational questions carried the score; the multi-step delegation items are where the points went, which is the same gap the interview surfaced.',
    comps:[
      ['Task delegation','E1','Completed the steps personally. Handed work over only when asked to directly.'],
      ['Handling ambiguity','E2','Asked scoping questions before acting &mdash; a notch above the entry rung.'],
      ['Quality checking','E1','Accepted the first output without a verification pass on two of three tasks.'],
      ['Communication','E2','Narrated intent clearly. Left some of the detail unexplained.']
    ],
    ev:[
      ['pos','14:20','Let me confirm the date range before I pull anything.','Scoped the task before acting. A genuine strength and the reason this is not below E1.'],
      ['neg','31:05','I&rsquo;d rather write that part myself than explain it to someone else.','Handover avoidance, said twice. This is the entry-rung tell.']
    ],
    watch:'The two handover moments are what hold this at E1 rather than E2. Worth re-checking delegation at the ninety-day mark.'
  },
  e2: {
    conf:'Medium',
    sum:'Top of the Explorer band, with standout reframing. Ambiguity and stakeholder reading come out a rung above everything else, and a weak conflict-repair answer is what pulls the blend back to 3.',
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

/* The five rungs Priya may sign. `AGENTS.priya.range` is E1–E3 as an
   ASSESSING range — the band she is certified to interview in — and the band
   itself holds five rungs. The picker offers all five of the candidate's band
   because the interview can land anywhere in it; what her range constrains is
   whose interviews reach her queue, which has already happened by the time
   this page is open. */
const LDR_RUNGS = [1,2,3,4,5];

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
  ${ph('Sessions','Every interview you have run and every one booked. Forty-five minutes, recorded, and you sign the rung afterwards.',
    `<button class="btn btn-g" data-go="leadProfile">Your availability ${I.calendar}</button>`)}
  ${next ? `
  <div class="sec">
    <div class="plate">
      <div class="plate-who">${avatar({i:next.i, img:AV[next.img]},56)}
        <span class="plate-wb"><b>${next.name}</b><span>Explorer band from their quiz &middot; ${next.re ? 'ninety days behind them' : 'no level yet'}</span></span>
      </div>
      <div class="plate-eb">Next up &middot; ${next.when.toLowerCase()}</div>
      <div class="plate-t">${next.re ? 'Re-interview' : 'Level interview'}</div>
      <div class="plate-b">${next.mins} minutes, recorded &middot; ${next.re ? 'read their 90-day summary first' : 'you sign the rung afterwards'}</div>
      <div class="plate-a">
        <button class="btn btn-p btn-sm noic">Join the interview ${I.video}</button>
        <button class="btn btn-sm noic plate-b2">Reschedule ${I.time}</button>
      </div>
    </div>
  </div>` : ''}
  <div class="sec">
    <div class="facts">
      <div><span class="l">Length</span><span class="v">45 minutes</span></div>
      <div><span class="l">Format</span><span class="v">Video, recorded</span></div>
      <div><span class="l">Evaluation due</span><span class="v">Within 48 hours</span></div>
      <div><span class="l">Recording kept</span><span class="v">24 months</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Booked</h2><span class="t-helper-01">${up.length} interview${up.length === 1 ? '' : 's'}</span></div>
    ${up.length ? `<div class="tile-stack">
      ${up.map(s => `<div class="cardrow bk-row">
        <span class="day bk-day"><div class="d">${s.day}</div><div class="n">${s.time}</div></span>
        <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 36)}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${s.name}${s.re ? ' <span class="tag sm">Re-interview</span>' : ''}</span>
          <span class="cardrow-d">${s.mins} minutes &middot; quiz ${s.quiz} of 100, ${s.bucket} band &middot; ${s.re ? 'assessed against their ninety days' : 'no level yet'}</span>
        </span>
        <span class="cardrow-a">
          <button class="btn btn-p btn-sm noic">Join</button>
        </span>
      </div>`).join('')}
    </div>` : `<div class="empty" style="border:0">${I.calendar}
      <h3>Nothing booked</h3><p>Candidates book you from the times you open on your profile.</p></div>`}
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Finished</h2><span class="t-helper-01">${waiting ? waiting + ' still need an evaluation' : 'all written up'}</span></div>
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
    <p class="t-helper-01 mt4">A candidate cannot enroll until the rung is signed, so the evaluation is the thing holding up their ninety days &mdash; not the interview.</p>
  </div>
</div></main>`;
};

/* ==========================================================================
   EVALUATIONS

   TWO QUEUES, ONE PAGE, AND THEY ARE NOT THE SAME OBJECT. A level decision
   opens a candidate's ninety days; a ninety-day summary closes them. Both are
   "a signature you owe somebody", which is why the dashboard counts them
   together in one figure — and both are listed here for the same reason. They
   are separate SECTIONS rather than one merged list because the two rows
   answer different questions: a level decision shows the rung being proposed,
   a summary shows the record it is drawn from.

   THIS PAGE SPENDS THE `.ai-aura` CARD. Tal has proposed a rung and the whole
   page exists to accept or overturn it, so the proposal and its reasoning
   belong at the top in Tal's own surface rather than in a row's sub-line.
   ========================================================================== */
V.leadEvals = () => {
  const pe = LEAD_EVALS.filter(e => e.status === 'pending');
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const signed = LEAD_EVALS.filter(e => e.status === 'done');
  const published = LEAD_SUMMARIES.filter(s => s.status === 'done');
  const e0 = pe[0];

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Evaluations')}
  ${ph('Evaluations','The level decisions and the ninety-day summaries waiting on your signature.')}
  ${e0 ? `
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>I have proposed Explorer &ndash; ${e0.ai} for ${e0.name}</h3></div>
      <div class="ai-body"><p>${e0.why}</p></div>
      <div class="ai-foot noline">
        <button class="btn btn-p btn-sm ic-l ai-do" data-ldrev="${e0.id}" data-go="leadEval">${I.arrowRight}Read it and decide</button>
        <span class="sp">${ldrConf(LDR_AN[e0.id] ? LDR_AN[e0.id].conf : 'Medium')}</span>
      </div>
      <div class="ai-asks">
        ${askChip('Why did you propose ' + e0.ai + ' for ' + e0.name + '?','Why this rung?')}
        ${askChip('What evidence supports this rung?','What is the evidence?')}
      </div>
    </div>
  </div>` : ''}
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
            <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
          </button>`
        : `<div class="cardrow">
            <span class="mem-av mem-ph">${avatar({i:e.i, img:AV[e.img]}, 36)}</span>
            <span class="cardrow-b">
              <span class="cardrow-t">${e.name} <span class="tag green sm">Signed Explorer &ndash; ${e.assigned}</span>${e.override ? ' <span class="tag org sm">override</span>' : ''}</span>
              <span class="cardrow-d">${e.override ? 'You signed ' + e.assigned + ' against my ' + e.ai + ' &middot; your reason is on the decision' : 'You signed the rung I proposed'}</span>
            </span>
          </div>`).join('')}
    </div>` : ''}
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Ninety-day summaries</h2><span class="t-helper-01">${ps.length ? ps.length + ' waiting' : 'nothing waiting'}</span></div>
    <div class="tile-stack">
      ${LEAD_SUMMARIES.map(s => {
        const c = lcoOf(s.cohort);
        const m = lmemOf(c, s.name);
        return s.status === 'pending'
        ? `<button class="tile clk gcard face-row" data-ldrsum="${s.id}" data-go="leadSum">
            <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 36)}</span>
            <span class="gcard-b"><h3>${s.name}</h3>
              <span class="sub">${lname(c)} &middot; ${m.pc}% complete &middot; assessments ${m.avg}% &middot; sign to close their ninety days</span></span>
            <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
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
    <p class="t-helper-01 mt4">A summary is what the next agent reads before a re-interview, so it is the document a candidate&rsquo;s next rung is argued from.</p>
  </div>
</div></main>`;
};

/* ==========================================================================
   ONE LEVEL DECISION

   THE READING IS THE PAGE AND THE PICKER IS AT THE FOOT, in that order,
   because a leader who has already chosen does not need to scroll past the
   evidence and a leader who has not needs to read it first.

   AN OVERRIDE COSTS A SENTENCE. Picking a rung other than the proposal opens
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
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>I read the transcript and propose Explorer &ndash; ${e.ai}</h3></div>
      <div class="ai-body"><p>${an ? an.sum : e.why}</p></div>
      <div class="ai-foot noline">
        <span class="sp">${ldrConf(an ? an.conf : 'Medium')}</span>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="facts">
      <div><span class="l">Quiz</span><span class="v">${e.quiz} of 100</span></div>
      <div><span class="l">Band</span><span class="v">${e.bucket || 'Explorer'}</span></div>
      <div><span class="l">I propose</span><span class="v">Explorer &ndash; ${e.ai}</span></div>
      <div><span class="l">Recorded</span><span class="v">45 minutes</span></div>
    </div>
  </div>
  ${an ? `
  ${/* The quiz reading is an aside about a number in the band above it, which
        is what `.note` is: a bold lead and a sentence. A `.tile` with a bare
        paragraph in it has no rule for the paragraph — `.tile` styles rows and
        headings, not prose. */''}
  <div class="sec">
    <div class="note"><span>${I.info}</span><div class="nb"><b>How the quiz reads</b>${an.quiz}</div></div>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Competency read</h2><span class="t-helper-01">Four readings, blended into one rung</span></div>
    <div class="tbl-wrap">
      <table class="tbl ldr-tbl">
        <tr><th>Competency</th><th>Reads at</th><th>What I heard</th></tr>
        ${an.comps.map(([n,r,read]) => `<tr>
          <td><b>${n}</b></td>
          <td><span class="tag ${r === e.ai ? 'brand' : +r[1] > +e.ai[1] ? 'green' : 'org'} sm">${r}</span></td>
          <td>${read}</td>
        </tr>`).join('')}
      </table>
    </div>
    <p class="t-helper-01 mt4">${an.watch}</p>
  </div>
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
    <div class="sec-h"><h2>Your decision</h2><span class="t-helper-01">The rung is yours, not mine</span></div>
    <div class="tile">
      <div class="f"><label>Explorer, rung 1 to 5</label>
        <div class="btn-set ldr-rungs">
          ${LDR_RUNGS.map(n => `<button class="btn ${band + n === pick ? 'btn-p' : 'btn-g'} noic" data-ldrpick="${band + n}">${band + n}</button>`).join('')}
        </div>
      </div>
      ${over ? `
      <div class="f mt5"><label for="ldrWhy">Why ${pick} instead of ${e.ai}?</label>
        <textarea class="inp" id="ldrWhy" rows="3" placeholder="Recorded on the decision. The human call wins, and the record says why."></textarea></div>
      ${S.ldrErr ? `<div class="note"><span>${I.warningAlt}</span><div class="nb"><b>An override needs a reason</b>You are signing ${pick} against my ${e.ai}. Say why in a sentence and it goes on the record with the decision.</div></div>` : ''}
      ` : ''}
      <div class="f mt5"><label for="ldrNotes">Notes for their report</label>
        <textarea class="inp" id="ldrNotes" rows="3" placeholder="Strengths, growth areas, and what to work on during the ninety days."></textarea></div>
      <p class="t-helper-01">The quiz fixes the band and you set the rung. ${over ? 'Overrides are logged with your reason.' : 'Agreeing with me is still your signature, not mine.'}</p>
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

   FOUR RECOMMENDATIONS, AND THREE OF THEM COST A SENTENCE. Promotion is the
   expected end of ninety days that went well; anything else is the leader
   saying the ninety days did not do what they were meant to, and that has to
   carry a reason for the same reason an override does.
   ========================================================================== */
const LDR_RECS = [['promote','Ready to promote'],['hold','Hold at this level'],
                  ['down','Move down a rung'],['notready','Not ready to re-interview']];

V.leadSum = () => {
  const s = ldrSumOf(S.ldrSum);
  const c = lcoOf(s.cohort);
  const m = lmemOf(c, s.name);
  const rec = S.ldrRec || 'promote';
  const needsWhy = rec !== 'promote';
  const done = s.status === 'done';
  const first = s.name.split(' ')[0];
  const retakes = m.att > 1.4 ? 3 : m.att > 1.1 ? 2 : 1;

  return `<main class="main"><div class="page">
  ${crumb(['Evaluations','leadEvals'], s.name)}
  ${ph(`Ninety-day summary &middot; ${s.name}`, `${lname(c)} &middot; ${llevel(c)} &middot; ${done ? 'published' : 'waiting on your signature'}`)}
  <div class="sec">
    <div class="idhead">
      <span class="av-ph" style="width:72px;height:72px"><i>${s.i}</i><img src="${AV[s.img]}" alt=""></span>
      <div class="idhead-b">
        <span class="idname">${s.name}</span>
        <span class="idmeta">${lname(c)} &middot; ninety days complete</span>
        <span class="tag sm">${llevel(c)}</span>
      </div>
      <div class="idhead-a"><button class="btn btn-g" data-ldrco="${c.id}" data-ldrmem="${s.name}" data-go="leadMember">Their full record ${I.arrowRight}</button></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>What the ninety days produced</h2><span class="t-helper-01">From the course platform &middot; read-only</span></div>
    <div class="stats">
      ${statCell(I.book,  'Chapters', lchDone(m) + '<small> of 13</small>', m.pc + '% complete')}
      ${statCell(I.chart, 'Assessment average', m.avg + '<small>%</small>', m.avg >= 85 ? 'well above the pass mark' : 'above the pass mark')}
      ${statCell(I.time,  'Time on the course', lhrs(lmins(m)), Math.round(lmins(m)/lchDone(m)) + ' min a chapter')}
      ${statCell(I.renew, 'Chapters retaken', retakes, m.att.toFixed(1) + ' attempts on average')}
    </div>
  </div>
  <div class="sec">
    <div class="facts">
      <div><span class="l">Calls attended</span><span class="v">${Math.max(0, c.week - 1)} of ${c.week}</span></div>
      <div><span class="l">Tasks on time</span><span class="v">${Math.max(0, lchDone(m) - retakes + 1)} of ${lchDone(m)}</span></div>
      <div><span class="l">Last active</span><span class="v">${m.last}</span></div>
      <div><span class="l">Your notes</span><span class="v">${lnotes(s.name).length}</span></div>
    </div>
  </div>
  ${done ? `
  <div class="sec tint">
    <div class="sec-h"><h2>What you published</h2></div>
    <div class="tile">
      <div class="kv"><span class="k">Recommendation</span><span class="v">${s.rec}</span></div>
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
        <label>Where ${first} stands after ninety days</label>
        <div class="btn-set ldr-recs">
          ${LDR_RECS.map(([k,l]) => `<button class="btn ${rec === k ? 'btn-p' : 'btn-g'} noic" data-ldrrec="${k}">${l}</button>`).join('')}
        </div>
      </div>
      ${needsWhy ? `
      <div class="f mt5"><label for="ldrSumWhy">Why not a promotion?</label>
        <textarea class="inp" id="ldrSumWhy" rows="3" placeholder="Ninety days that did not end in a promotion needs a reason on the record."></textarea></div>
      ${S.ldrErr ? `<div class="note"><span>${I.warningAlt}</span><div class="nb"><b>This one needs a reason</b>Anything other than a promotion is you saying the ninety days did not do what they were meant to. Say why, and it goes on the summary.</div></div>` : ''}
      ` : ''}
      <div class="f mt5"><label for="ldrGrowth">Where they grew</label>
        <textarea class="inp" id="ldrGrowth" rows="3" placeholder="What changed over the ninety days that the numbers above do not show."></textarea></div>
      <div class="f mt5"><label for="ldrDev">Still to develop</label>
        <textarea class="inp" id="ldrDev" rows="3" placeholder="What the next ninety days, or the re-interview, should look at."></textarea></div>
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
   candidate signed would otherwise be the rung offered for the next one.
   ========================================================================== */
device.addEventListener('click', e => {
  const ev = e.target.closest('[data-ldrev]');
  if(ev){ S.ldrEv = ev.dataset.ldrev; S.ldrPick = ldrEvOf(S.ldrEv).ai; S.ldrErr = false; }
  const su = e.target.closest('[data-ldrsum]');
  if(su){ S.ldrSum = su.dataset.ldrsum; S.ldrRec = 'promote'; S.ldrErr = false; }
}, true);

/* WHAT IS TYPED SURVIVES A PICK. Choosing a different rung re-renders the
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

const _baseLdr3 = render;
render = function(){
  _baseLdr3();
  try { ldrDraftWrite(); } catch(e){ console.warn('ldr draft', e); }
};

render();
