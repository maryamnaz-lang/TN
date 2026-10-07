const ldrSumOf = id => LEAD_SUMMARIES.filter(s => s.id === id)[0] || LEAD_SUMMARIES[0];


S.ldrSum = null;
S.ldrRec = null;
S.ldrErr = false;
S.ldrGrowErr = false;
S.ldrDevErr = false;
S.ldrPubAsk = null;
S.ldrDraftSaved = null;

S.sesForm = null;
S.sesCancel = null;
S.ldrSes = null;



const WDAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const sesDayLbl = s => { const d = new Date(s.dISO + 'T00:00:00'); return WDAY[d.getDay()] + ' ' + d.getDate(); };
const t12 = hhmm => { let [h,m] = String(hhmm||'').split(':').map(Number); const ap = h>=12?'PM':'AM'; h = h%12||12; return h + ':' + String(m||0).padStart(2,'0') + ' ' + ap; };
function sesBkRow(c, s){
  const past = sesPast(s), cancelled = s.status === 'cancelled';
  const day = `<span class="bk-day"><span class="d">${sesDayLbl(s)}</span><span class="n">${t12(s.time)}</span></span>`;
  const wk = s.week || leadWeek(sesDayOf(c, s.dISO));
  const body = `<span class="cardrow-b">
      <span class="cardrow-t">Week ${wk} Cohort Session</span></span>`;
  let mark;
  if(cancelled) mark = `<span class="ses-mark ses-cancelled">Cancelled</span>`;
  else if(!past) mark = `<span class="ses-mark ses-upcoming">${sesCountdown(s)}</span>`;
  else if(s.unavail) mark = `<span class="ses-mark ses-na">Attendance unavailable</span>`;
  else { const reg = leadRegister(c, s); const att = reg.filter(x=>x.r&&x.r.att).length;
    mark = `<span class="ses-mark ses-att">${att} of ${reg.length} attended</span>`; }
  if(past && !cancelled)
    return `<button class="cardrow bk-row clk" data-go="leadSession" data-ldrses="${s.id}">${day}${body}${mark}<svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg></button>`;
  return `<div class="cardrow bk-row">${day}${body}${mark}</div>`;
}

V.leadSessions = () => {
  const c = leadLive();
  if(!c) return `<main class="main"><div class="page">${ph('Sessions')}
    <div class="sec"><div class="empty" style="border:0">${I.calendar}<h3>You are not leading a cohort at the moment.</h3>
      <p>Your sessions appear here while you are leading a cohort.</p></div></div></div></main>`;
  const all = leadSessionsOf(c);
  const next = leadNextSession(c);
  const upcoming = all.filter(s => sesEnd(s) >= LEAD_NOW && s.id !== (next&&next.id));
  const past = all.filter(s => sesEnd(s) < LEAD_NOW).reverse();
  return `<main class="main"><div class="page lead-ses-page">
  ${ph('Sessions')}
  ${''/* THE NEXT SESSION IS THE MY-COHORT BLACK CALL CARD (Maryam, 30 Sep 2026:
        "use the same black call card on my cohorts screen in place of the black card
        on the session screen"). The same `.lcal-next` `lcalCard` the dashboard draws
        (`lcall(c)` is its record) in its `.lcal-row` wrapper, so the two screens read
        identically — only the countdown differs, "In 02:40" here (Maryam: "just
        update the In 2hrs 40mins text to 'In 02:40'"). This replaces `leadCallCard`,
        the older crow-based card. */}
  ${next ? `<div class="sec lead-callsec"><div class="lcal-row">${lcalCard(lcall(c), true, {countdown:'In 02:40'})}</div></div>` : `<div class="sec"><div class="empty" style="border:0">${I.calendar}<h3>No session is scheduled yet.</h3></div></div>`}
  ${''/* TWO TABS — Upcoming / Past sessions (Maryam 30 Sep 2026: "instead of this
        long page, i need 2 tabs of Upcoming and Past Sessions"). The two lists
        were stacked down one scroll; they are one `.sec.sec-cs` strip now, the
        same `.cs` mechanism the cohort page uses (`data-ldrsestab` → `S.ldrSesTab`).
        The count rides each tab. */}
  ${(() => {
    const tab = S.ldrSesTab || 'upcoming';
    const rows = tab === 'past' ? past : upcoming;
    const empty = tab === 'past'
      ? `<div class="empty" style="border:0">${I.calendar}<h3>No past sessions yet</h3><p>Sessions move here once they have run.</p></div>`
      : `<div class="empty" style="border:0">${I.calendar}<h3>Nothing else upcoming</h3><p>The next session is the one above.</p></div>`;
    return `<div class="sec sec-cs">
      <div class="cs">
        <button class="${tab === 'upcoming' ? 'on' : ''}" data-ldrsestab="upcoming">Upcoming${upcoming.length?` <span class="lf-n">${upcoming.length}</span>`:''}</button>
        <button class="${tab === 'past' ? 'on' : ''}" data-ldrsestab="past">Past sessions${past.length?` <span class="lf-n">${past.length}</span>`:''}</button>
      </div>
      ${rows.length ? `<div class="tile-stack ses-list">${rows.map(s=>sesBkRow(c,s)).join('')}</div>` : empty}
    </div>`;
  })()}
</div></main>`;
};

V.leadSession = () => {
  const c = leadLive() || LEAD_COHORTS[0];
  const s = leadSessionsOf(c).find(x => x.id === S.ldrSes) || leadHeld(c)[0];
  if(!s) return `<main class="main"><div class="page">${crumb(['Sessions','leadSessions'],'Attendance')}
    ${ph('Attendance')}<div class="sec"><div class="empty" style="border:0">${I.calendar}<h3>No session</h3></div></div></div></main>`;
  const reg = leadRegister(c, s);
  const attended = reg.filter(x=>x.r&&x.r.att).length;
  return `<main class="main"><div class="page">
  ${crumb(['Sessions','leadSessions'], s.title)}
  ${ph(s.title)}
  ${''/* THE FOUR FACTS ARE A BLOCK BAND, NOT A kv (Maryam 30 Sep 2026: "make the
         top 4 rows into 4 blocks in a row"). A "Session" fact leads — "Week N
         Cohort Call" (Maryam: "add session - Week (n) Cohort Call") — then Chapter
         reads "Chapter N" (the week's chapter number, not its title — Maryam:
         'change "Delegation Without Drop-Off" to "Chapter 5"'), the date drops its
         "(London (UTC+01:00))" zone (Maryam: "remove (London (UTC+01:00))"), and
         Attendance. `.facts pf-facts` is the fixed-4 band `leadCounters` uses. */}
  <div class="sec">
    <div class="facts pf-facts">
      ${pfFact(I.video,    '--mk-3', 'Session', `Week ${s.week} Cohort Call`)}
      ${pfFact(I.book,     '--mk-1', 'Chapter', `Chapter ${s.week}`)}
      ${pfFact(I.calendar, '--mk-4', 'Date and time', `${s.date} &middot; ${s.time}`)}
      ${pfFact(I.group,    '--mk-2', 'Attendance', s.unavail?'Unavailable':attended+' of '+reg.length+' attended')}
    </div>
  </div>
  ${s.unavail ? `<div class="sec"><div class="ses-warn"><span class="ses-warn-mk">${I.warningAlt}</span>
      <div class="ses-warn-b"><h3>Attendance unavailable</h3><p>The platform received no participation data for this session, so no candidate is marked. It is left out of every attendance total.</p></div></div></div>`
  : `<div class="sec ses-reg-sec">
    ${''/* THE "Worked out from the room · 5 min minimum" CAPTION IS GONE (Maryam
           30 Sep 2026: "remove ... text"); the heading stands alone. */}
    <div class="sec-h"><h2>Register</h2></div>
    <div class="tile-stack ses-reg">
      ${reg.map(({m,r})=>`<div class="atd-row">
        <span class="atd-b"><span class="rname">${mAv(m,28)}${leadName(m)}</span></span>
        <span class="atd-mark ${r&&r.att?'atd-yes':'atd-no'}">${r&&r.att?`Attended &middot; ${r.mins} min`:`Did not attend${r?` &middot; ${r.mins} min`:''}`}</span>
      </div>`).join('')}
    </div>
  </div>`}
  ${''/* THE "Note on the session" SECTION IS REMOVED (Maryam 30 Sep 2026: "remove
         notes section from the end of this page"). `SESSION_NOTES` and the
         `data-sesnotesave` handler stay defined, just not drawn here. */}
</div></main>`;
};

function leadSessionSheet(){
  const f = S.sesForm; if(!f) return `<div class="modal" data-sesclose="1"></div>`;
  const c = leadLive() || LEAD_COHORTS[0];
  const editing = !!f.edit;
  const series = editing && (leadSessionsOf(c).find(s=>s.id===f.edit)||{}).series;
  const today = LEAD_NOW.toISOString().slice(0,10);
  return `<div class="modal on" data-sesclose="1">
    <div class="sheet">
      <div class="sheet-h"><h2>${editing?'Edit session':'Schedule a session'}</h2>
        <button class="x" data-sesclose="1" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        ${f.err ? `<div class="ses-err">${I.warningAlt} ${f.err}</div>` : ''}
        <div class="f"><label for="sesTitle">Title</label>
          <input class="inp" id="sesTitle" maxlength="100" value="${(f.title||'').replace(/"/g,'&quot;')}" placeholder="Cohort ${c.id} call"></div>
        <div class="f"><label for="sesChapter">Chapter covered</label>
          <select class="inp" id="sesChapter">
            <option value=""${f.chapter?'':' selected'} disabled>Choose a chapter</option>
            ${CH.map((ch,i)=>`<option value="${ch[0]}"${f.chapter===ch[0]?' selected':''}>${i+1}. ${ch[0]}</option>`).join('')}
          </select></div>
        <div class="f-row">
          <div class="f"><label for="sesDate">Date</label>
            <input class="inp" type="date" id="sesDate" min="${today}" max="${cohortEndISO(c)}" value="${f.date||''}"></div>
          <div class="f"><label for="sesTime">Start time <span class="f-tz">${LEAD_TZ}</span></label>
            <input class="inp" type="time" id="sesTime" value="${f.time||'18:00'}"></div>
        </div>
        <div class="f-row">
          <div class="f"><label for="sesDur">Duration (minutes)</label>
            <input class="inp" type="number" id="sesDur" min="15" max="240" value="${f.dur||60}"></div>
          <div class="f"><label for="sesRepeat">Repeat</label>
            <select class="inp" id="sesRepeat"${editing?' disabled':''}>
              <option value="none"${f.repeat==='none'?' selected':''}>Does not repeat</option>
              <option value="weekly"${f.repeat==='weekly'?' selected':''}>Weekly</option>
              <option value="fortnightly"${f.repeat==='fortnightly'?' selected':''}>Fortnightly</option>
            </select></div>
        </div>
        <div class="f"><label for="sesCover">What it covers <span class="f-opt">(optional)</span></label>
          <textarea class="inp" id="sesCover" rows="2" maxlength="1000" placeholder="Anything the cohort should read or bring">${f.cover||''}</textarea></div>
        ${editing && series ? `<div class="f"><span class="f-lbl">Apply to</span>
          <div class="ses-scope">
            <label class="ses-scope-o"><input type="radio" name="sesScope" value="this" ${f.scope!=='all'?'checked':''}> This session only</label>
            <label class="ses-scope-o"><input type="radio" name="sesScope" value="all" ${f.scope==='all'?'checked':''}> This and every later session</label>
          </div></div>` : ''}
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-sesclose="1">Cancel</button>
        <button class="btn btn-p noic" data-sessave="1">${editing?'Save changes':'Schedule session'}</button>
      </div>
    </div>
  </div>`;
}

function leadCancelSheet(){
  const x = S.sesCancel; if(!x) return `<div class="modal" data-cxclose="1"></div>`;
  const c = leadLive() || LEAD_COHORTS[0];
  const s = leadSessionsOf(c).find(y=>y.id===x.id); if(!s) return `<div class="modal" data-cxclose="1"></div>`;
  return `<div class="modal on" data-cxclose="1">
    <div class="sheet sheet-narrow">
      <div class="sheet-h"><h2>Cancel session</h2>
        <button class="x" data-cxclose="1" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <p class="t-body mb5">Cancel <b>${s.title}</b> on ${s.date}? Everyone in the cohort will be told.</p>
        ${x.err ? `<div class="ses-err">${I.warningAlt} ${x.err}</div>` : ''}
        <div class="f"><label for="cxReason">Reason <span class="f-req">Shown to candidates</span></label>
          <textarea class="inp" id="cxReason" rows="3" maxlength="500" placeholder="Why are you cancelling?">${x.reason||''}</textarea></div>
        ${s.series ? `<div class="f"><span class="f-lbl">Which sessions</span>
          <div class="ses-scope">
            <label class="ses-scope-o"><input type="radio" name="cxScope" value="this" ${x.scope!=='all'?'checked':''}> This session only</label>
            <label class="ses-scope-o"><input type="radio" name="cxScope" value="all" ${x.scope==='all'?'checked':''}> This and every later session</label>
          </div></div>` : ''}
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-cxclose="1">Go back</button>
        <button class="btn btn-p danger noic" data-sesdocancel="${s.id}">Cancel session</button>
      </div>
    </div>
  </div>`;
}

LDR_SHEETS.push(leadSessionSheet, leadCancelSheet);

V.leadCalls = () => {
  const up = lcalls();
  const next = up[0];

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Upcoming Sessions')}
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
  ${ph('Upcoming Sessions',`${up.length} cohorts &middot; one call a week each &middot; 60 minutes, not recorded`)}
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
        ${''/* `I.video`, NOT `I.group` — and for one build this slot held the
               cohort's cover instead. Both changes followed `bookedRow`'s and
               for the same reason: these are the dashboard's three rows drawn a
               second time, so a mark that differed between the two lists would
               be the drift `lcTitle` / `lcDetail` exist to prevent. The
               argument for the glyph and against the picture is written over
               `bookedRow` (lead.js). */}
        <span class="cardrow-ic">${I.video}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">${lcTitle(k)}</span>
          <span class="cardrow-d">${k.seats} candidates at Explorer &ndash; ${k.level} &middot; ${lcDetail(k)}</span>
        </span>
        ${''/* THE ROW HAS NO ACTION, AND THAT IS THE POINT (Maryam, 2 Sep 2026:
               "a cohort leader can not reschedule a weekly call so remove that
               flow"). It carried Reschedule for one day — `.btn-t btn-sm ic-l`
               with `I.calendar`, opening lead4's weekly-calls sheet — and the
               whole flow is deleted with it: the sheet, `S.ldrAvail`, the
               `data-ldravail` handler and the Profile row's Manage control.

               THE ASK IS ABOUT AUTHORITY, NOT ABOUT A BUTTON. A weekly cohort
               call is the PROGRAMME's — ten candidates, a fixed hour, thirteen
               weeks — and the sheet said so itself in its own helper line:
               "moving one moves it for every candidate in that cohort". That is
               not a leader's decision to make from a diary row, so there is
               nothing for a control here to open. This is the same correction
               as 1 Sep's "a cohort leader does not interview anybody", one
               surface smaller: the portal keeps drifting toward giving this
               person an agent's powers.

               SO THE ROW IS A FACT, and a diary you read is a legitimate page —
               `.cardrow` with no `.cardrow-a` is the shape §02 already draws
               for one. What a leader DOES on this page is at the top of it, on
               the black card: "Generate the brief".

               THE CANDIDATE'S RESCHEDULE IS UNTOUCHED. `CALL_ROW.iv`'s control
               moves an INTERVIEW the candidate booked and paid for with an
               agent who sets their own availability, which is a different
               appointment with a different owner. It keeps `I.calendar`, so the
               one-word-one-mark rule this note used to make is still true —
               there is simply one caller now instead of two. */}
      </div>`).join('')}
    </div>` : `<div class="empty" style="border:0">${I.calendar}
      <h3>Nothing this week</h3><p>Every cohort you lead has a weekly call, and they all show up here.</p></div>`}
    ${''/* THE CLOSING LINE WENT WITH THE BRIEF BUTTON (Maryam, same pass). "A
           brief is generated from where the cohort actually is, not from where
           the syllabus says it should be" was an explanation of the control on
           every row; with the control gone it explained nothing on the page. The
           sentence still earns its place next to a Brief button, and there is one
           on `V.leadCohort`. */}
  </div>
  ${''/* "ALREADY RUN" IS DELETED (Maryam, 1 Sep 2026). It was the calls behind
         this leader — cohort, week, the date, the chapter it covered and who
         turned up — and it was this page's whole claim to a rail slot of its
         own: the note at the head of this view argues that `V.leadCohorts`
         already lists the week's three calls, so the PAST was the half nothing
         else held. That argument is now spent, and what is left is the diary.
         Keeping it written down because the next person to ask "why is Calls a
         module" will find the answer here and it is no longer this.

         `LEAD_RUN` STAYS AND STILL HAS ONE READER. `PAGESUM.leadCalls` counts
         the seats across it — "across the four behind you, 32 of 36 seats were
         filled" — which is now the only place attendance appears anywhere in
         the product, and a figure read once is exactly what a Tal summary is
         for. `lranChapter` went with the rows; it had no other caller.
         `V.leadProfile`'s "Calls already run" row pointed at this section for
         the attendance and has been re-pointed at Tal. */}
</div></main>`;
};

V.leadEvals = () => {
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const published = LEAD_SUMMARIES.filter(s => s.status === 'done');

  const sumRow = s => {
    const c = lcoOf(s.cohort);
    const m = lmemOf(c, s.name);
    const done = s.status === 'done';
    return `<button class="tile clk gcard face-row" data-ldrsum="${s.id}" data-go="leadSum">
      <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 36)}</span>
      <span class="gcard-b"><h3>${s.name}${done ? ' ' + ldrRecTag(s.rec) : ''}</h3>
        <span class="sub">Scored ${m.avg}%</span></span>
      ${''/* THE ARROW'S LABEL — `.row-cta`, §112 (Maryam, 2 Sep 2026: "with
             right side arrows, give text 'View Evaluation' on the left of the
             arrow"). Written here rather than through `faceRow`'s fifth
             argument because this row is `sumRow`'s own markup: the two
             functions draw the same shape and only this one puts a chip in the
             heading.
             ONE VERB PER STATE: a published row VIEWs the evaluation, a waiting
             row opens the same page to WRITE it — "Evaluate Candidate" (Maryam
             30 Sep 2026). The black card that used to carry that verb is gone —
             the two states are now the SAME ROW under two tabs, so the label is
             what tells you which action the row opens. */}
      <span class="row-cta">${done ? 'View Evaluation' : 'Evaluate Candidate'}</span>
      <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
    </button>`;
  };

  const tab = S.ldrEvTab || 'awaiting';
  const listSec = (rows, empty) => rows.length
    ? `<div class="sec lead-evbody"><div class="tile-stack">${rows.map(sumRow).join('')}</div></div>`
    : `<div class="sec lead-evbody"><div class="empty" style="border:0">${I.checkFilled}${empty}</div></div>`;

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Evaluations')}
  ${ph('Evaluations')}
  <div class="sec sec-cs lead-evtabs">
    <div class="cs">
      <button class="${tab === 'awaiting' ? 'on' : ''}" data-ldrevtab="awaiting">Awaiting Evaluations${ps.length ? ` <span class="lf-n">${ps.length}</span>` : ''}</button>
      <button class="${tab === 'evaluated' ? 'on' : ''}" data-ldrevtab="evaluated">Evaluated Candidates${published.length ? ` <span class="lf-n">${published.length}</span>` : ''}</button>
    </div>
  </div>
  ${tab === 'awaiting'
    ? listSec(ps, '<h3>Nothing waiting</h3><p>Every 90-day summary in this cohort is published.</p>')
    : listSec(published, '<h3>No evaluations yet</h3><p>Nothing has been signed off in this cohort.</p>')}
</div></main>`;
};

const LDR_RECS = [
  ['promote',  'Ready to promote',        'The end 90 days are built for.',        '--support-success-ink'],
  ['promote2', 'Promote two levels',      'More than 90 days can normally move.',  '--support-success-ink'],
  ['hold',     'Hold at this level',      'Another 90 days at the same level.',    '--support-attention'],
  ['down',     'Move down a level',       'The level was set too high.',           '--danger-ink'],
  ['notready', 'Not ready to re-interview','Not enough here to assess yet.',       '']];

const ldrRecHue = rec => (LDR_RECS.filter(r => r[1] === rec)[0] || [])[3] || '';
const ldrRecTag = rec => { const h = ldrRecHue(rec);
  return `<span class="tag sm rec-tag"${h ? ` style="--mk:var(${h})"` : ''}>${rec}</span>`; };

V.leadSum = () => {
  const s = ldrSumOf(S.ldrSum);
  const c = lcoOf(s.cohort);
  const m = lmemOf(c, s.name);
  const rec = S.ldrRec || 'promote';
  const needsWhy = rec !== 'promote';
  const up = rec === 'promote2';
  const rung = +llevel(c).replace(/\D/g,'') || 1;
  const twoUp = llevel(c).replace(/\d+/, Math.min(5, rung + 2));
  const done = s.status === 'done';
  const first = s.name.split(' ')[0];
  const retakes = m.att > 1.4 ? 3 : m.att > 1.1 ? 2 : 1;

  const figRow = (ic, hue, label, val) => `<div class="sump-f">
    <span class="sump-fi" style="--mk:${hue}">${ic}</span>
    <span class="sump-fl">${label}</span>
    <span class="sump-fv">${val}</span>
  </div>`;

  if(!done) return `<main class="main"><div class="page nosum">
  ${crumb(['Evaluations','leadEvals'], s.name)}
  ${ph(`90-day summary &middot; ${s.name}`, `${lname(c)} &middot; ${llevel(c)} &middot; waiting on your signature`)}
  <div class="sec">
    <div class="idhead">
      <span class="av-ph" style="width:72px;height:72px"><i>${s.i}</i><img src="${AV[s.img]}" alt=""></span>
      <div class="idhead-b">
        <span class="idname">${s.name}</span>
        <span class="idmeta">${lname(c)} &middot; 90 days complete</span>
        <span class="tag sm">${llevel(c)}</span>
      </div>
      <div class="idhead-a"><button class="btn btn-g" data-ldrco="${c.id}" data-ldrmem="${s.name}" data-go="leadMember">View Candidates Progress ${I.arrowRight}</button></div>
    </div>
  </div>
  ${''/* NO "read-only" HELPER AND NO FOOT DIVIDER (Maryam, 9 Sep 2026: "remove
         these lines" for the two `.t-helper-01` captions, and "remove divider
         below 4 cards"). `sec-noline` drops §10.2's foot hairline so the figures
         run straight into "Your recommendation". */}
  <div class="sec sec-noline">
    <div class="sec-h"><h2>What the 90 days produced</h2></div>
    <div class="stats">
      ${statCell(I.book,  'Chapters', lchDone(m) + '<small> of 13</small>', m.pc + '% complete')}
      ${statCell(I.chart, 'Assessment average', m.avg + '<small>%</small>', m.avg >= 85 ? 'well above the pass mark' : 'above the pass mark')}
      ${statCell(I.time,  'Time on the course', lhrs(lmins(m)), Math.round(lmins(m)/lchDone(m)) + ' min a chapter')}
      ${statCell(I.renew, 'Chapters retaken', retakes, m.att.toFixed(1) + ' attempts on average')}
    </div>
  </div>
  ${''/* EPIC 12.9 — attendance, read-only, from the register the platform keeps.
         Sessions with no participation data are left out of both figures. */}
  ${(() => { const a = leadAttn(m, c); return `<div class="sec sec-noline">
    <div class="sec-h"><h2>Attendance</h2></div>
    <div class="kv"><span class="k">Sessions attended</span><span class="v">${a.held ? a.att + ' of ' + a.held + ' since they joined' : 'no sessions held'}</span></div>
  </div>`; })()}
  ${''/* THE LEADER'S OWN NOTES ON THIS CANDIDATE (Maryam, 9 Sep 2026: "there
         needs to be a section of the notes taken by the cohort leader about this
         candidate on this evaluation screen"). The same `S.ldrNotes` store and
         `.note-list` / `.note-row` styling the cohort page writes, drawn READ-ONLY
         here — no edit/delete chips, because this page has no composer to open (a
         chip would set state nothing on this page renders). It sits between the
         figures the leader reads and the recommendation they write, which is the
         order the note at 769 already assumes ("the numbers above" and the
         private notes). Nothing when the candidate has no notes yet. */}
  ${lnotes(s.name).length ? `
  <div class="sec">
    <div class="sec-h"><h2>Your notes on ${first}</h2></div>
    ${ldrNotesRead(s.name)}
  </div>` : ''}
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
  ${/* THE SECTION IS WHITE (Maryam, 2 Sep 2026: "remove the grey background from
        Your recommendation section"). It was `.sec tint` — §55's tinted panel —
        and the tint was doing the job the `.tile` inside it already does: a 4%
        grey band wrapping a bordered white card is two frames around one form,
        which is §39's "one frame" argument and §74's ("a 5%-tinted card on a 4%
        grey ground is two washes a shade apart"). The published branch has no
        tint either, so the two states of this page now stand on the same
        ground. */''}
  <div class="sec">
    <div class="sec-h"><h2>Your recommendation</h2></div>
    <div class="tile">
      ${/* THE CHOICE IS A RADIO LIST, NOT A BUTTON STRIP (Maryam, 2 Sep 2026:
            "instead of arrows and full button type selection, give radio buttons
            to each one"). Five `.btn`s in a `.btn-set` drew the one selected
            option as a solid black `.btn-p` and the other four as outlined
            `.btn-g` with §64's trailing arrow — so the control read as five
            ACTIONS, four of which promised to navigate somewhere, when it is one
            question with five answers. §60's rule from the other side: an arrow
            that goes nowhere is a dead control.
            `.rad` IS §02's OWN RADIO and needed no new component — a real
            `<label>` + `<input type="radio">`, which this can host because it is
            a form rather than §76's `<button>` grid. The `checked` attribute is
            written FROM `rec` on every render (trap 9: `render()` replaces
            `device.innerHTML`, so a natively-toggled input would be gone at the
            next paint); `data-ldrrec` stays on the label, so the existing
            handler — which calls `ldrDraftRead()` to keep the typed text — is
            untouched.
            IT IS VERTICAL, which is what makes the dependent field legible: the
            "Why not a promotion?" box below is a consequence of this answer, and
            a five-across strip put the cause and the effect on the same line. */''}
      <div class="f">
        <label>Where ${first} stands after 90 days</label>
        <div class="ldr-recs">
          ${LDR_RECS.map(([k,l]) => `<label class="rad ldr-rec" data-ldrrec="${k}"><input type="radio" name="ldrrec"${rec === k ? ' checked' : ''}><span class="box"></span><span class="txt">${l}</span></label>`).join('')}
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
      <div class="f mt5"><label for="ldrGrowth">Where they grew${S.ldrGrowErr?' <span class="f-req-err">Required</span>':''}</label>
        <textarea class="inp" id="ldrGrowth" rows="3" maxlength="2000" placeholder="What changed over the 90 days that the numbers above do not show."></textarea></div>
      <div class="f mt5"><label for="ldrDev">Still to develop${S.ldrDevErr?' <span class="f-req-err">Required</span>':''}</label>
        <textarea class="inp" id="ldrDev" rows="3" maxlength="2000" placeholder="What the next 90 days, or the re-interview, should look at."></textarea></div>
      <p class="t-helper-01">Published to ${first} and to whichever agent runs their re-interview. Your private notes stay private.</p>
    </div>
    ${/* ONE BUTTON, AND ITS WORDS ARE THE ACT (Maryam, 2 Sep 2026). "Send
          Recommendation" rather than "Publish the summary": the section above it
          is headed "Your recommendation" and the radio list asks for one, so the
          button now names the thing the page has just been filling in. It is the
          only place in either portal that says "publish", which was the odd word
          — the candidate's side never uses it.
          "FINISH LATER" IS GONE. It was `data-go="leadEvals"`, a plain route
          back to the list that saved nothing — `ldrDraftRead()` runs on the
          recommendation change, not on that press — so it promised a draft the
          build does not keep. The crumb and the rail already go back, and §60's
          rule is that a control which cannot do what it says should not be
          drawn. `.btn-set` stays on the wrapper for the spacing even with one
          child, which is what `.mt5` is measured against. */''}
    <div class="btn-set mt5 ldr-eval-a">
      <button class="btn btn-s" data-ldrdraft="${s.id}">Save draft</button>
      <button class="btn btn-p" data-ldrpub="${s.id}">Send Recommendation</button>
    </div>
    ${S.ldrDraftSaved === s.id ? `<p class="ldr-draft-note">Draft saved. ${first} stays in Awaiting until you send it.</p>` : ''}
  </div>
</div></main>`;

  return `<main class="main"><div class="page nosum">
  ${crumb(['Evaluations','leadEvals'], s.name)}
  ${ph(`90-day summary &middot; ${s.name}`, `${lname(c)} &middot; ${llevel(c)} &middot; published`)}
  ${/* THE PUBLISHED STATE NO LONGER ANNOUNCES ITSELF (Maryam, 2 Sep 2026:
        "remove the top published row and the Shared with Samuel and with
        whichever agent runs their re-interview banner beneath that").

        BOTH HALVES SAID THE SAME THING TWICE. The green "Published" pill and the
        green `.note succ` under it were the reference's title block, and between
        them they spent the whole first screen on the page's STATE — but `ph()`'s
        own fact row already ends in `&middot; published`, and the recommendation
        strip below is drawn in the settled register (§91.3's green cell and tick)
        precisely so the document reads as decided without a banner saying so.
        WHAT IS ACTUALLY LOST is the privacy sentence — "your private notes stay
        private" — and it is not lost, because the DRAFT states it directly over
        the button that does the sending, which is where a reader needs it. A
        page that only reports is the wrong place for a rule about what happens
        next.
        §91.5's `.sump-top` / `.sump-st` RULES GO WITH IT rather than being left
        as the "gate nothing writes" tell; `.note succ` is §02's and has other
        callers, so it stays. */''}
  <div class="sec">
    <div class="sump">
      ${/* THE LEFT COLUMN IS THE CANDIDATE, AND ITS HEADING IS ITS OWN.
            `.idhead` is gone: it is a full-width header row with the face, three
            lines and a button on one line, which is the shape this page had
            before it had a column to put them in. The face is 88px and round —
            §89.2's argument for the round mark, and the reference's own
            drawing — with the name under it rather than beside it, because a
            280px column reads down.
            "Their full record" SURVIVES as the column's foot: it is the one
            route off this page that is not the decision, and it was the
            `.idhead`'s only reason to hold a button. */''}
      <div class="sump-c">
        <div class="sec-h"><h2>Candidate</h2></div>
        <div class="sump-id">
          <span class="av-ph sump-face" style="width:88px;height:88px"><i>${s.i}</i><img src="${AV[s.img]}" alt=""></span>
          <span class="idname">${s.name}</span>
          <span class="idmeta">${lname(c)} &middot; ${llevel(c)}</span>
        </div>
        ${/* THE RING IS THE PROGRESS FIGURE AND THE OTHER THREE ARE ROWS, which
              is the reference's own split and it is right: the ring is the one
              figure that is a PROPORTION of something whole, and the other
              three are quantities. `ring()` is §32's component (two circles and
              `--arc` as a dasharray length) at 48px here.
              THE HUES ARE NAMED, NOT CYCLED — §65's rule and §72's. Blue for
              the course, violet for the assessments, green for time, rose for
              retakes, so a figure keeps its colour if the order ever changes. */''}
        <div class="sump-ring">
          ${ring(m.pc, `${m.pc}% of the course complete`)}
          <span class="sump-rb"><span class="sump-fl">Overall progress</span>
            <span class="sub">${lchDone(m)} of 13 chapters</span></span>
        </div>
        <div class="sump-figs">
          ${figRow(I.chart, 'var(--mk-3)', 'Assessment average', m.avg + '<small>%</small>')}
          ${figRow(I.time,  'var(--mk-2)', 'Time on the course', lhrs(lmins(m)))}
          ${figRow(I.renew, 'var(--mk-4)', 'Chapters retaken', retakes)}
        </div>
        <button class="btn btn-g btn-sm noic sump-go" data-ldrco="${c.id}" data-ldrmem="${s.name}" data-go="leadMember">Their full record</button>
      </div>

      <div class="sump-b">
        ${/* NO HELPER LINE (Maryam, 2 Sep 2026: "remove the What you published
              text"). It labelled the block as a record at the same moment the
              block became one — the strip below now draws only the answer that
              was given, in green, which says "published" better than the words
              did. The draft branch keeps ITS helper ("This is what the next agent
              reads") because there the sentence is a warning about a thing that
              has not happened yet. */''}
        <div class="sec-h"><h2>Your recommendation</h2></div>
        ${/* ONLY THE ANSWER IS DRAWN (Maryam, 2 Sep 2026: "since the cohort
              leader has already recommended so show only one green row that he
              has recommended, exclude the other 4 rows from this block, also
              remove the border of this block, green fill is enough").

              THIS TURNS OVER THE PREVIOUS BUILD'S ARGUMENT, WHICH IS RECORDED
              RATHER THAN DELETED. That version drew all five as one strip on the
              reasoning that "a published summary that prints only the answer says
              what was chosen, and a strip with one cell lit says what it was
              chosen INSTEAD OF". The instruction is that the four unchosen rows
              are not information on THIS page: the decision is taken, the leader
              made it, and four grey rows saying what did not happen is the page
              re-running a form it has already submitted. The alternatives are
              still on the draft, which is where a choice is live.
              WITH ONE ROW THE BOX IS THE ROW, so §91.3's outer `border` and the
              per-row `border-top` both come off — a 1px rectangle around a single
              green cell is the second frame §74 and §39 both argue against, and
              the green ground already bounds it.
              `LDR_RECS` IS STILL THE SOURCE and the row is still FOUND in it
              rather than printed from `s.rec` — that is what keeps the
              description in step with the label, and `ldrPub` only ever writes a
              label that came out of this list (lead3's publish handler). A record
              whose `rec` matched nothing would draw nothing, which is the honest
              empty rather than a row with a blank description. */''}
        ${/* THE LIT CELL IS GREEN, NOT THE ACCENT (Maryam, 1 Sep 2026: "for the
              candidates that have already been assessed I can see that you
              didn't follow the colors … from the reference"). It shipped for one
              build in `--brand-tint-2` with `--accent-text` on the title, on the
              reasoning that orange is this product's "you chose this" (§76's
              slot picker). That reasoning is about a choice you are MAKING; a
              published summary is a decision that has been taken, and the
              reference draws it in the success register — a light green ground
              and a green tick — which is also what this page's ring and its
              notice now use. §91.3 states the two values.
              `I.checkFilled` RATHER THAN THE REFERENCE'S STAR: a tick is what
              this build draws for a thing that is settled, and the star is
              Tal's mark (§70). */''}
        <div class="sump-recs">
          ${LDR_RECS.filter(([k,l]) => s.rec === l).map(([k,l,d]) => `<div class="sump-r on">
              <span class="sump-rm">${I.checkFilled}</span>
              <span class="sump-rb2"><span class="ttl">${l}</span><span class="sub">${d}</span></span>
            </div>`).join('')}
        </div>
        ${/* THE THREE PROSE BLOCKS ARE HEADED PARAGRAPHS, NOT `.kv` ROWS. That
              band gave a three-sentence answer a 184px label column and set it
              in the value's own 13.5px — which is right for "Recommendation —
              Ready to promote" and wrong for the paragraph this page exists to
              carry. A heading over its own prose is what the reference draws and
              what §63's body role is for.
              THE HEADINGS FOLLOW THE BOXES THEY CAME OUT OF, and the first one
              is `why` — the exception's reason, which only exists when the
              recommendation is not a promotion, so it is the one that can be
              absent on a legitimate record. */''}
        <div class="sump-prose">
          ${s.why ? `<div class="sump-p"><h3>${s.rec === 'Promote two levels'
            ? 'Why two levels' : 'Why this rather than a promotion'}</h3><p>${s.why}</p></div>` : ''}
          ${s.growth ? `<div class="sump-p"><h3>Where they grew</h3><p>${s.growth}</p></div>` : ''}
          ${s.develop ? `<div class="sump-p"><h3>Still to develop</h3><p>${s.develop}</p></div>` : ''}
          ${!s.why && !s.growth && !s.develop
            ? `<p class="t-helper-01">No notes were added to this summary.</p>` : ''}
        </div>
        ${''/* THE EMPTY STATE IS STILL HERE AND IT SHOULD NOW BE UNREACHABLE for
               every record in the build: all six published summaries carry
               `growth` and `develop`, and the three holds carry `why` as well.
               It stays because the publish handler stores whatever was typed and
               all three boxes are optional — a leader who publishes a promotion
               with both boxes blank is allowed, and this is what that record
               looks like rather than a column of headings with nothing under
               them. */}
        ${/* THE FOOT IS GONE — BOTH HALVES OF IT (Maryam, 2 Sep 2026: "remove
              the bottom published by priya and back to evaluations button").

              THE SIGNATURE was added one build earlier on the argument that "a
              90-day summary is a document somebody signed and the only name on it
              was in the app bar". The name is still in the app bar, and it is the
              signed-in leader's own — this page is only ever reached from that
              leader's own queue, so the line was telling the reader something
              they are. It reads as provenance on a document that has been handed
              over, and this page is the author's copy.
              THE BUTTON was a second way out of a page that already has two: §78
              put the trail in the top bar ("Evaluations ›") and the rail slot is
              live. A black `.btn-p` at the foot also made the LAST thing on a
              published record a call to action, which is the one thing a record
              does not want — §60's neighbourhood, from the other end.
              `.sump-sig`'s RULE GOES WITH IT (§91.4) rather than being left as a
              gate nothing writes. `LEADER` and `avatar` both keep other readers
              in this file and in lead4, so nothing else moves. */''}
      </div>
    </div>
  </div>
</div></main>`;
};

device.addEventListener('click', e => {
  const su = e.target.closest('[data-ldrsum]');
  if(su){ S.ldrSum = su.dataset.ldrsum; S.ldrErr = false; S.ldrGrowErr = false; S.ldrDevErr = false; S.ldrDraftSaved = null;
    const s = ldrSumOf(su.dataset.ldrsum), d = s.draft;
    S.ldrRec = d ? d.rec : 'promote'; S.ldrSumWhy = d ? d.why : ''; S.ldrGrowth = d ? d.growth : ''; S.ldrDev = d ? d.develop : ''; }
}, true);

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

  const pb = e.target.closest('[data-ldrpub]');
  if(pb){
    ldrDraftRead();
    S.ldrDraftSaved = null;
    const rec = S.ldrRec || 'promote';
    if(rec !== 'promote' && !(S.ldrSumWhy || '').trim()){
      S.ldrErr = true; render();
      const box = device.querySelector('#ldrSumWhy'); if(box) box.focus(); return;
    }
    if(!(S.ldrGrowth || '').trim()){ S.ldrGrowErr = true; render();
      const box = device.querySelector('#ldrGrowth'); if(box) box.focus(); return; }
    if(!(S.ldrDev || '').trim()){ S.ldrDevErr = true; render();
      const box = device.querySelector('#ldrDev'); if(box) box.focus(); return; }
    S.ldrGrowErr = false; S.ldrDevErr = false;
    S.ldrPubAsk = pb.dataset.ldrpub; render(); return;
  }
  const dp = e.target.closest('[data-ldrdopub]');
  if(dp){
    const s = ldrSumOf(dp.dataset.ldrdopub);
    const rec = S.ldrRec || 'promote';
    s.status = 'done';
    s.rec = (LDR_RECS.filter(r => r[0] === rec)[0] || LDR_RECS[0])[1];
    s.why = (S.ldrSumWhy || '').trim();
    s.growth = (S.ldrGrowth || '').trim();
    s.develop = (S.ldrDev || '').trim();
    delete s.draft;
    S.ldrSumWhy = ''; S.ldrGrowth = ''; S.ldrDev = ''; S.ldrErr = false;
    S.ldrPubAsk = null; render(); return;
  }
  const dd = e.target.closest('[data-ldrdraft]');
  if(dd){
    ldrDraftRead();
    const s = ldrSumOf(dd.dataset.ldrdraft);
    s.draft = {rec:S.ldrRec || 'promote', why:(S.ldrSumWhy||'').trim(), growth:(S.ldrGrowth||'').trim(), develop:(S.ldrDev||'').trim()};
    S.ldrDraftSaved = s.id; render(); return;
  }
  const epc = e.target.closest('[data-epclose]');
  if(epc){ if(epc.classList.contains('modal') && e.target !== epc) return; S.ldrPubAsk = null; render(); return; }
});

function leadEvalConfirmSheet(){
  const id = S.ldrPubAsk; if(!id) return `<div class="modal" data-epclose="1"></div>`;
  const s = ldrSumOf(id);
  return `<div class="modal on" data-epclose="1">
    <div class="sheet conf" role="dialog" aria-modal="true" aria-label="Send recommendation">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.send}</span>
        <h2 class="conf-t">Send your recommendation for ${handleOf(s.name)}?</h2>
        <p class="conf-x">It goes to the agent running their re-interview and cannot be changed afterwards.</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-s noic" data-epclose="1">Cancel</button>
        <button class="btn btn-p noic" data-ldrdopub="${id}">Send Recommendation</button>
      </div>
    </div>
  </div>`;
}
LDR_SHEETS.push(leadEvalConfirmSheet);

function ldrDraftWrite(){
  const put = (id,v) => { const el = device.querySelector('#' + id); if(el && v) el.value = v; };
  put('ldrSumWhy', S.ldrSumWhy);
  put('ldrGrowth', S.ldrGrowth);
  put('ldrDev', S.ldrDev);
}

device.addEventListener('click', e => {
  const cRec = leadLive() || LEAD_COHORTS[0];
  const g = sel => device.querySelector(sel);
  const today = LEAD_NOW.toISOString().slice(0,10);

  if(e.target.closest('[data-sesnew]')){
    S.sesForm = {edit:null, title:'', chapter:'', date:'', time:cRec.callTimeH||'18:00', dur:60, cover:'', repeat:'none', scope:'this', err:''};
    render(); return;
  }
  const se = e.target.closest('[data-sesedit]');
  if(se){ const s = leadSessionsOf(cRec).find(x=>x.id===se.dataset.sesedit);
    if(s) S.sesForm = {edit:s.id, title:s.title, chapter:s.chapter, date:s.dISO, time:s.time, dur:s.dur, cover:s.cover||'', repeat:s.repeat, scope:'this', err:''};
    render(); return;
  }

  if(e.target.closest('[data-sessave]')){
    const f = S.sesForm; if(!f) return;
    const title=(g('#sesTitle').value||'').trim(), chapter=g('#sesChapter').value,
      date=g('#sesDate').value, time=g('#sesTime').value, dur=+g('#sesDur').value,
      cover=(g('#sesCover').value||'').trim(), repeat=g('#sesRepeat')?g('#sesRepeat').value:'none',
      scopeEl=device.querySelector('input[name=sesScope]:checked'), scope=scopeEl?scopeEl.value:'this';
    S.sesForm = {...f, title, chapter, date, time, dur, cover, repeat, scope};
    let err='';
    if(!title) err='Add a title.';
    else if(!chapter) err='Choose the chapter this session covers.';
    else if(!date) err='Choose a date.';
    else if(date < today) err='The date must be today or later.';
    else if(date > cohortEndISO(cRec)) err='The date must fall within the cohort’s 90 days.';
    else if(!time) err='Choose a start time.';
    else if(!(dur>=15 && dur<=240)) err='Duration must be between 15 and 240 minutes.';
    else { const clash = leadOverlap(cRec, date, time, dur, f.edit);
      if(clash) err='This overlaps '+clash.title+' on '+clash.date+'. Change the time or the date.'; }
    if(err){ S.sesForm.err=err; render(); return; }
    const arr = LEAD_SESSIONS[cRec.id];
    if(f.edit){
      const s = arr.find(x=>x.id===f.edit);
      const apply = t => { t.title=title; t.chapter=chapter; t.time=time; t.dur=dur; t.cover=cover; t.week=leadWeek(sesDayOf(cRec,t.dISO)); };
      if(scope==='all' && s.series){ arr.filter(x=>x.series===s.series && sesDT(x)>=sesDT(s) && x.status==='scheduled').forEach(apply); }
      else { apply(s); s.dISO=date; s.date=dPretty(date); s.week=leadWeek(sesDayOf(cRec,date)); }
    } else {
      const sid = repeat!=='none' ? 'u'+Date.now() : null;
      let n=0; const mk = dISO => ({id:'s'+cRec.id+'u'+Date.now()+'_'+(n++), co:cRec.id, series:sid,
        title, chapter, dISO, date:dPretty(dISO), time, dur, cover, repeat,
        week:leadWeek(sesDayOf(cRec,dISO)), status:'scheduled', unavail:false, adhoc:true});
      const step = repeat==='weekly'?7:repeat==='fortnightly'?14:0;
      const endISO = cohortEndISO(cRec);
      let d = date;
      arr.push(mk(d));
      if(step){ d = dISOadd(d, step); while(d <= endISO){ arr.push(mk(d)); d = dISOadd(d, step); } }
    }
    S.sesForm=null; render(); return;
  }

  const cx = e.target.closest('[data-sescancel]');
  if(cx){ S.sesCancel = {id:cx.dataset.sescancel, reason:'', scope:'this', err:''}; render(); return; }
  const dcx = e.target.closest('[data-sesdocancel]');
  if(dcx){
    const arr = LEAD_SESSIONS[cRec.id], s = arr.find(x=>x.id===dcx.dataset.sesdocancel); if(!s) return;
    const reason=(g('#cxReason').value||'').trim();
    const scopeEl=device.querySelector('input[name=cxScope]:checked'), scope=scopeEl?scopeEl.value:'this';
    if(!reason){ S.sesCancel={...S.sesCancel, reason, scope, err:'Add a reason. It is shown to candidates.'}; render(); return; }
    const cancel = t => { t.status='cancelled'; t.reason=reason; };
    if(scope==='all' && s.series){ arr.filter(x=>x.series===s.series && sesDT(x)>=sesDT(s) && x.status==='scheduled').forEach(cancel); }
    else cancel(s);
    S.sesCancel=null; render(); return;
  }

  const sn = e.target.closest('[data-sesnotesave]');
  if(sn){ const ta=g('#sesNote'); if(ta) SESSION_NOTES[sn.dataset.sesnotesave]=ta.value.trim(); render(); return; }

  const sc = e.target.closest('[data-sesclose]');
  if(sc){ if(sc.classList.contains('modal') && e.target !== sc) return; S.sesForm = null; render(); return; }
  const cxc = e.target.closest('[data-cxclose]');
  if(cxc){ if(cxc.classList.contains('modal') && e.target !== cxc) return; S.sesCancel = null; render(); return; }
});

const _baseLdr3 = render;
render = function(){
  _baseLdr3();
  try { ldrDraftWrite(); } catch(e){ console.warn('ldr draft', e); }
};

render();
