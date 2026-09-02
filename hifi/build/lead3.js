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

/* `lranChapter` WAS HERE AND IS DELETED WITH "ALREADY RUN" (1 Sep 2026). It read
   the chapter a past call covered off `CH` — the same read `lcall` takes for an
   upcoming one, one week back — so that `LEAD_RUN` only ever had to state the
   ATTENDANCE, which is the one thing about a finished call no other record
   knows. That principle is still how `LEAD_RUN` is shaped and is worth keeping:
   if the list ever comes back, the chapter is derived, not stored. */

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

   IT EARNED ITS PLACE ON THE PAST AND NO LONGER HOLDS ONE. The page opened with
   "This week" and "Already run", and the second was the argument for the module:
   `V.leadCohorts` had been listing the week's three calls too, so the calls
   BEHIND the leader were the half nothing else held. Maryam took that section
   off on 1 Sep 2026 (its own note in the view is the record), which leaves this
   as the diary and nothing else — and the reason it still earns the slot is the
   simpler one: `V.leadCohorts` gave its call list up to this page in the same
   pass, so this is now the only place the week's appointments are listed at all.
   Worth knowing before anything else is moved here or away.

   THE MONEY IS GONE AND SO IS THE FEE COLUMN. `SESSIONS` in the wireframe
   carried `fee:180` on every row; lead.js states the rule this portal is built
   on — a cohort leader volunteers — so the fact band reports what the leader is
   committing rather than what anybody is paying.
   ========================================================================== */
V.leadCalls = () => {
  const up = lcalls();
  const next = up[0];
  /* `run`, `seats` and `came` were read here for "Already run"'s heading count
     and went with the section. `LEAD_RUN` is still summed — in
     `PAGESUM.leadCalls`, which is its one remaining reader. */

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
        ${''/* RESCHEDULE, NOT BRIEF, AND IT IS A SECONDARY (Maryam, 1 Sep 2026:
               "instead of brief, give a reschedule button, a secondary button,
               not in black color, just a black text with reschedule icon on its
               left").

               `.btn-t` IS THE BLACK-TEXT BUTTON. §64 took the border off
               `.btn-s` / `.btn-t` / `.btn-g` and left the ink at
               `--text-primary`, so a text button on a page IS black words —
               and §64's arrow does NOT arrive, because its own test is
               `:not(:has(svg))` and this one carries a mark. `ic-l` is what
               seats that mark on the LEFT; without it the icon is pushed to
               the far edge.

               THE MARK IS `I.calendar`, WHICH IS WHAT RESCHEDULE ALREADY WEARS.
               `CALL_ROW.iv`'s own Reschedule (views.js) is `ic:I.calendar`, so
               this is one word with one mark across both portals rather than a
               second glyph for the same verb. `I.renew` was the alternative and
               reads better in isolation — circular arrows say "move it" — but a
               product where Reschedule is a calendar on one page and arrows on
               another is the drift `stepIcon`'s table exists to prevent.

               IT OPENS THE WEEKLY-CALLS SHEET, which is the surface that
               actually moves a call: `data-ldravail` (lead4), mounted on every
               leader page by `placeLdrSheets`. Pointing it at the brief sheet
               would have been a button lying about what it does, and leaving it
               inert would be §60's "a dead control on a live surface is worse
               than a missing one". THE BRIEF IS NOT LOST — it is the black
               card's own action at the top of this page, and the cohort page
               has it twice. */}
        <span class="cardrow-a">
          <button class="btn btn-t btn-sm ic-l" data-ldravail="1">${I.calendar}Reschedule</button>
        </span>
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

   THE PAGE IS TWO LISTS AND IT USED TO BE ONE (Maryam, 1 Sep 2026: "all members
   of the cohort will be there, not only 2 … the other members' evaluations have
   been sent but these two are awaiting. Show these two on top and add another
   section below with the name Evaluated Candidates").

   THE SCENARIO IS WHAT THE DASHBOARD ALREADY CLAIMS. Cohort 33 is in week 11 and
   this page opens when a cohort closes, so the queue is not a list of two people
   — it is a list of two people who are LEFT. `LEAD_SUMMARIES` now carries all
   eight, six of them `done`, and lead.js's note is the argument for reading the
   roster rather than picking a number.

   ONE LIST COULD NOT SAY THAT. The published rows were in the same `.tile-stack`
   as the waiting ones, separated only by a green tag on row three — so the
   section heading said "2 waiting" over a stack of eight, and the eye had to
   read every row's tag to find the two that are the work. Two sections, two
   headings, two counts.

   THE FOUR FIGURE CELLS ARE DELETED WITH THEIR SECTION AND THEIR HAIRLINE
   (Maryam, same day: "remove the top 4 blocks and the divider below those
   blocks"). Every one of them was a count the page now draws as a list:
   "90-day summaries 2" is the first heading's own `2 waiting`, "Published by
   you 0" is the second heading's count and was WRONG as written — it said 0 on
   a page where six are published, because it counted this SESSION's signatures
   — "Cohort closing 33" is on every row of both lists, and "Due by Day 90" is
   the page's premise rather than a figure. `c0` goes with them and `statCell`
   does NOT — `V.leadSum` draws four of them about one candidate, which is the
   band this page was borrowing the shape from. The divider was that `.sec`'s own
   §10.2 closing rule, so removing the section removes the line.

   WHAT THE BAND WAS FOR is worth keeping: it was written when the page opened on
   a queue of one to four and needed to say which cohort and by when. The list
   answers both now that it holds the whole cohort.
   ========================================================================== */
V.leadEvals = () => {
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const published = LEAD_SUMMARIES.filter(s => s.status === 'done');

  /* BOTH ROWS ARE THE SAME COMPONENT AND THE DIFFERENCE IS THE SUBTITLE, which
     is what made the split cheap. A published row says what you decided; a
     waiting row says what the numbers are and what pressing it does. Both open
     `V.leadSum` — the published state of that page is fully drawn (the
     recommendation, the reason, the four figures), and it was previously
     reachable only in the seconds after signing, which is §60's dead-content
     tell wearing the other hat: the page existed and nothing pointed at it.

     THE "PUBLISHED" TAG IS GONE (Maryam, 1 Sep 2026). It was a green pill after
     every name in the second list — eight rows, six pills, all saying the same
     word — and by the time it shipped the list itself was already saying it: a
     row is under the heading "Evaluated Candidates" and its own subtitle opens
     "you recommended". The tag was written when both kinds of row sat in ONE
     stack and it was the only thing telling them apart; the split retired it and
     it stayed a build too long. It is the "gate nothing writes" test applied to
     COPY rather than CSS — a word that is true of every row in a list is the
     list's heading, not the row's. */
  const sumRow = s => {
    const c = lcoOf(s.cohort);
    const m = lmemOf(c, s.name);
    return `<button class="tile clk gcard face-row" data-ldrsum="${s.id}" data-go="leadSum">
      <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 36)}</span>
      <span class="gcard-b"><h3>${s.name}</h3>
        <span class="sub">${s.status === 'done'
          ? `${lname(c)} &middot; you recommended: ${s.rec}`
          : `${lname(c)} &middot; ${m.pc}% complete &middot; assessments ${m.avg}% &middot; sign to close their 90 days`}</span></span>
      <svg class="tile-arrow" viewBox="0 -960 960 960">${inner('arrowRight')}</svg>
    </button>`;
  };

  /* ------------------------------------------------------------------------
     A WAITING CANDIDATE IS A COLUMN, NOT A ROW (Maryam, 1 Sep 2026, with a
     reference screen). §90 is the drawing and its head carries the three things
     the reference was refused; what this function decides is the CONTENT.

     THE COLUMN IS NOT A BUTTON, and that is what having an action costs. The
     stacked version was a `<button>` ending in a chevron, so the whole row was
     the target; a column with "Evaluate Candidate" in it cannot also be one —
     nested interactive elements. The button carries the `data-ldrsum` the row
     used to, so the route is unchanged and lead3's capture listener still sets
     the subject before `go()` runs.

     THE RING SHOWS `m.avg` AND THE WORD UNDER IT IS "Scored". The reference puts
     course progress in the circle over the word "Complete"; the label Maryam
     asked for names a score, and the assessments average is the only score this
     product holds. So the ring is 87 / 90 and the progress percentage stays in
     the line under the name, where the stacked row already had it — one figure
     each, neither printed twice.

     `aria-label` SAYS WHAT THE RING IS, because "Scored" beside a bare number is
     the one thing a screen reader gets less of than the eye does: the visual
     pairing of a figure with the word under it is not in the markup order.

     THE SUPPORTING LINE IS POINTS, AND THE BADGE SITS BESIDE THE NAME (Maryam,
     1 Sep 2026: "instead of Cohort 33 · 92% complete, show the points earned by
     the candidate with the small points icon on its left … next to the name,
     show the highest badge earned"). Three subtractions and two additions:

       gone   the cohort — it is in the card's own context (every row on this
              page is Cohort 33's, and Tal's sentence above names it once) and it
              was the same three words on both columns.
       gone   "92% complete" — course progress, which is not what this card is
              for: the ring beside it is the score and the button opens the page
              that holds the four figures.
       gone   from an earlier pass, "assessments 87%" (now the ring) and "sign to
              close their 90 days" (now the button, in the words of what it does).
       new    the points total, `m.pts` off the member record, with `I.trophy` on
              its left — the product's own subject mark for points (`statCell(
              I.trophy, 'Points', …)` on the candidate's dashboard, and §72's
              pulse takes the same one for "Your standing").
       new    the highest badge, `lbadge(m.pts)` — DERIVED from those points via
              `BDG`'s ladder, so the two cannot disagree. Owen has cleared Silver
              and Lena has not, which is what makes the pair legible as a fact
              about each candidate rather than a decoration on both.

     THE BADGE IS THE AWARD ARTWORK, THE POINTS MARK IS A GLYPH, and §72 already
     drew that line: its three column marks are bare glyphs because they name a
     subject, and its standing rows keep the award WebPs at 24px because "a
     generic glyph of a shield is a picture of the category instead". A badge is
     an object somebody earned; points are a topic.

     NO BADGE IS NO ELEMENT. Below 2,500 `lbadge` returns null and the span is not
     drawn — an empty slot beside a name would read as artwork that failed to
     load, which is `crow`'s own rule for a missing `img`.
     ------------------------------------------------------------------------ */
  const evCol = s => {
    const c = lcoOf(s.cohort);
    const m = lmemOf(c, s.name);
    const b = lbadge(m.pts);
    return `<div class="ev-c">
      <div class="ev-top">
        <span class="mem-av mem-ph">${avatar({i:s.i, img:AV[s.img]}, 44)}</span>
        <span class="ev-id">
          <span class="ev-nm">
            <h3 class="ttl">${s.name}</h3>
            ${b ? `<span class="ev-bdg"><img src="${AWARD[b.n.toLowerCase()]}" alt="">
              <span class="sub">${b.n}</span></span>` : ''}
          </span>
          <span class="sub ev-pts">${I.trophy}${m.pts.toLocaleString()} points</span>
        </span>
        <span class="ev-ring">
          ${ring(m.avg, `${m.avg}% scored on assessments`)}
          <span class="sub">Scored</span>
        </span>
      </div>
      <button class="btn btn-s btn-sm noic" data-ldrsum="${s.id}" data-go="leadSum">Evaluate Candidate</button>
    </div>`;
  };

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
  ${''/* THE TWO WAITING ARE THE PAGE'S BLACK CARD (Maryam, 1 Sep 2026: "take
         the 2 candidates awaiting in the black card with the card heading
         Awaiting Evaluations", and "remove the 90-day summaries heading").

         THE WHOLE §75 RECIPE COMES WITH THE CLASS and none of it is written
         here — the standing instruction is that "make this a black card" means
         the inset, the top-right haze, the `--s07` frame, the 20px gap, the
         section's own hairlines off, the head row's `--on-dark-rule`, the ink
         flip (§63 §6a) and the internal seams (§75.5). This card is the FOURTH
         caller and, like the leader's own call card, it states not one rule of
         its own: the two rows are `.tile`s, so §75.5 turns their ground
         transparent and their seam to 16% white, and §63 §6a inks the name
         `--on-dark` and the subtitle `--on-dark-2`.

         NEVER `.plate` OR `.sec.on-dark` — both are in ai5's `DARK_CARD`, so
         `placeDark` would hoist this section into the head band, where it would
         land beside Tal's summary at ~330px with each row's face, name and
         subtitle on three lines of their own. §75.3 records that exact bug.

         THE HEADING MOVED INTO THE CARD RATHER THAN BEING DELETED TWICE. "90-day
         summaries" was the section's `.sec-h` and "Awaiting Evaluations" is the
         card's `.dc-t`, which is the same slot one component in — so the page
         still names this block, and it now names it with the word the dashboard
         card and the rail-side queue already use. The count went with the
         heading: `.dc-hd-r` takes a `.dc-t` and then EITHER a control or a time
         (§75, they share one auto margin), and a bare "2 waiting" is neither —
         Tal's sentence above the card states it in words anyway.

         WHY IT EARNS THE LOUDEST OBJECT ON THE PAGE: §75's test is "this is the
         one thing the page is about", and on a page whose other list is a record
         of work already done, two signatures somebody is waiting on is exactly
         that. §59's clock test is the `.plate` test, not this one. */}
  <div class="sec dark-card">
    <div class="dc-hd">
      <div class="dc-hd-r"><h2 class="dc-t">Awaiting Evaluations</h2></div>
    </div>
    ${ps.length ? `<div class="ev-row">
      ${ps.map(evCol).join('')}
    </div>` : `<div class="empty" style="border:0">${I.checkFilled}
      <h3>Nothing waiting</h3><p>Every 90-day summary in this cohort is published.</p></div>`}
    ${/* THE FOOTNOTE IS GONE. It explained what a summary is FOR — "the
          document a candidate's next level is argued from" — to the one person
          who already knows, at the foot of a list of two rows that each say
          "sign to close their 90 days". A closing line earns its place
          when it tells you something the rows do not; this one restated the
          page's own subject. */''}
  </div>
  ${''/* THE SECOND SECTION IS TINTED, WHICH IS THE PAGE'S RHYTHM AND NOT A
         JUDGEMENT ABOUT THE CONTENT. White, tint, white down a page is what
         every other leader page does (§55/§84 draw it, `leadDash` alternates
         its four blocks by POSITION), and it happens to say the useful thing
         here too: the work is on the white ground at the top and the record is
         on the quiet one below it.
         THE COUNT CAME OFF THE HEADING ROW (Maryam, 1 Sep 2026), AND THE ROW
         IS WHY IT COULD. "6 published" was a `.t-helper-01` at the far right of
         the heading — the shape the Calls page and the Messages inbox use for a
         count — and it was saying the word the heading beside it already says
         ("Evaluated") about rows that each say it again ("you recommended").
         Tal's sentence at the top of the page is what states the arithmetic:
         two of eight are still waiting, so six are not. Both counts on this page
         went the same way and for the same reason; the card's heading lost "2
         waiting" 30 lines up. */}
  ${published.length ? `<div class="sec tint">
    <div class="sec-h"><h2>Evaluated Candidates</h2></div>
    <div class="tile-stack">
      ${published.map(sumRow).join('')}
    </div>
  </div>` : ''}
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
/* EACH ONE CARRIES A LINE NOW, and the lines are this note's own argument said
   in five short forms rather than new product copy (1 Sep 2026, with a reference
   screen that puts a sentence under every option). The reference's own wording
   ("Strong performance. Ready to fast-track.") describes the CANDIDATE, which is
   the one thing an option list must not do — it would be praising somebody
   before the leader has chosen. These say what the CHOICE means, which is what
   the paragraphs above already establish: the expected end, the two departures
   upwards, and the two downwards.
   THE THIRD FIELD IS OPTIONAL BY POSITION, so `LDR_RECS.map(([k,l]) => …)` at any
   other call site keeps working — `ldrDraftRead`'s publish handler reads `r[1]`
   by index and is untouched. */
const LDR_RECS = [
  ['promote',  'Ready to promote',        'The end 90 days are built for.'],
  ['promote2', 'Promote two levels',      'More than 90 days can normally move.'],
  ['hold',     'Hold at this level',      'Another 90 days at the same level.'],
  ['down',     'Move down a level',       'The level was set too high.'],
  ['notready', 'Not ready to re-interview','Not enough here to assess yet.']];

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

  /* `nosum` IS HOW A PAGE DECLINES TAL'S SUMMARY (Maryam, 1 Sep 2026: "do
         not show tal summary on this page"), and ai6's `placeSummaryPass` reads
         it beside `.msg-page` and `.msg-mod` — the class is the whole test.
         WHY THIS PAGE. It is the one page in the portal that IS a summary, and
         Tal's line was reprinting what the page states in its own words 500px
         below: published, the band read "Published. You recommended: Ready to
         promote." over a `.kv` row reading "Recommendation — Ready to promote";
         waiting, it restated the four figures in the band directly above them.
         That is the duplication CLAUDE.md's two-copy-slots rule exists to stop,
         and here the second copy is not a sentence in a grey line but the whole
         body of the page.
         `PAGESUM.leadSum` STAYS IN ai6, UNREACHED, which is that file's own
         convention for `PAGESUM.messages` and the courseware's entries — the
         words are the record of what the band used to say. */
  /* ------------------------------------------------------------------------
     THE PAGE IS THE CANDIDATE BESIDE THE DECISION (1 Sep 2026, with a reference
     screen: "this page should look like the reference, obviously with our design
     language"). §91 draws it. What was here was four stacked sections — an
     identity header, a four-cell figure band, and then either the record or the
     form — so on a 1280 frame the decision the page exists for started 700px
     down and the figures it turns on had scrolled off the top.

     TWO COLUMNS, ONE SECTION. Left: who this is and what the 90 days produced.
     Right: the recommendation and the prose. The reference draws each as a
     bordered, rounded card; §76 is the precedent for refusing that and it is the
     same argument Maryam made about the Evaluations columns a moment earlier
     ("do not close the candidates in cards since this is not our ui language") —
     `--radius` is 0, and a column beside a hairline is how this product says
     "two things, side by side".

     WHAT THE REFERENCE GETS RIGHT AND THIS TAKES: the candidate's figures beside
     the decision rather than above it; a ring on the progress figure; the five
     options shown as a strip with the chosen one lit, so a published summary
     records what was chosen *out of what was available*; the three prose blocks
     under it as headed paragraphs; the sharing notice at the top where it is a
     condition of the page rather than a footnote to the form; and a signature
     line at the foot.

     WHAT IT REFUSES: "Days to Close 90 days" and "Sign to Close 90 days" — the
     same number twice, and neither is a figure this build holds; the round
     tinted glyph behind every mark, because a mark in this product has been a
     bare 20px glyph since 1 Sep 2026 (CLAUDE.md states it: "the icons should not
     have the background … increase the size of the icons"); and the `···`
     overflow control, which would open a menu of nothing.
     ------------------------------------------------------------------------ */
  const figRow = (ic, hue, label, val) => `<div class="sump-f">
    <span class="sump-fi" style="--mk:${hue}">${ic}</span>
    <span class="sump-fl">${label}</span>
    <span class="sump-fv">${val}</span>
  </div>`;

  /* ------------------------------------------------------------------------
     THE TWO STATES ARE TWO PAGES NOW, AND THAT IS THE CORRECTION (Maryam, 1 Sep
     2026: "we will not change the ui for the candidate evaluation page that are
     not done yet. I need the ui of this page back").

     §91's two-column shape came in for the whole view, and it should not have:
     the reference it was drawn from is a PUBLISHED summary, and the two states
     are not the same kind of screen. Published, this is a record — the figures
     and the decision are read side by side, which is what the columns are for.
     Waiting, it is a FORM: a stack you work down, and the four figures are the
     brief you read before you fill it in. Restated as one rule, the rule the
     restructure broke: **a two-column layout is for reading, a single column is
     for filling in.**

     SO THE WAITING BRANCH IS THE PAGE IT WAS, restored slot for slot — the
     `.idhead` header with "Their full record", the `.stats` band under "What the
     90 days produced", and the tinted "Your recommendation" section holding the
     `.btn-set` of five, the reason box, the two prose boxes, the sharing line
     and the two buttons. The placeholders say "the numbers above" again, because
     in this layout they are above.

     WHAT DOES NOT COME BACK IS TAL'S CARD, and that was a separate instruction
     one message earlier ("do not show tal summary on this page") rather than
     part of the restructure: `nosum` stays on the page, so neither state draws
     it. Waiting, the sentence it printed was the four figures directly below it
     said again; published, it was the recommendation printed twice.
     ------------------------------------------------------------------------ */
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
  ${/* THE SECTION IS WHITE (Maryam, 2 Sep 2026: "remove the grey background from
        Your recommendation section"). It was `.sec tint` — §55's tinted panel —
        and the tint was doing the job the `.tile` inside it already does: a 4%
        grey band wrapping a bordered white card is two frames around one form,
        which is §39's "one frame" argument and §74's ("a 5%-tinted card on a 4%
        grey ground is two washes a shade apart"). The published branch has no
        tint either, so the two states of this page now stand on the same
        ground. */''}
  <div class="sec">
    <div class="sec-h"><h2>Your recommendation</h2><span class="t-helper-01">This is what the next agent reads</span></div>
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
      <div class="f mt5"><label for="ldrGrowth">Where they grew</label>
        <textarea class="inp" id="ldrGrowth" rows="3" placeholder="What changed over the 90 days that the numbers above do not show."></textarea></div>
      <div class="f mt5"><label for="ldrDev">Still to develop</label>
        <textarea class="inp" id="ldrDev" rows="3" placeholder="What the next 90 days, or the re-interview, should look at."></textarea></div>
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
    <div class="btn-set mt5">
      <button class="btn btn-p" data-ldrpub="${s.id}">Send Recommendation ${I.checkFilled}</button>
    </div>
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
