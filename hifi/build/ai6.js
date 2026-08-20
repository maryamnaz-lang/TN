/* ==========================================================================
   EVERY PAGE OPENS WITH TAL SAYING WHAT THIS PAGE IS

   Until now Tal's card at the head of a page was ADVICE — "Before your
   re-interview", "What the 90 days ask of you" — and only nine of the
   twenty-three pages had one. That is a different job from the one this
   pass installs. The card is now a PAGE SUMMARY: two conversational
   sentences that tell you, before you read anything else, what is on this
   page and what is going on. Every page gets one, and they all read in the
   same voice.

   THREE THINGS CHANGE, AND ONLY IN THE HEAD BAND.

   1. The heading goes. "Tal" over a bold title over a grey sentence was
      three levels of hierarchy for one short paragraph, and the title was
      usually the page's own name said a second time. What is left is the
      mark, Tal's name, and the sentence — and with nothing above it to
      compete, the sentence is the prominent thing on the block, which is
      what it should have been all along. §33 gives it the ink to match.

   2. The suggested questions go, everywhere they appear at the top of a
      page. They were an offer made before you had read the page they were
      offering to explain, and on a summary they are noise around the one
      line you are meant to read. Tal is still one press away on the FAB,
      and the questions Tal's own panel offers are untouched — this pass
      only clears the top of a page.

   3. The card stops being a button. Its only visible affordance WAS the
      chips; with those gone, `enhanceTalCards`'s whole-card `role="button"`
      is an invisible control wrapped around a paragraph, which is worse
      than no control. Stripped here rather than in views.js because the
      chips are what justified it, and the chips leave here.

   A PASS, NOT TWENTY-THREE EDITS. The summaries are one voice and belong in
   one table; a page that gains a Tal card, or a whole new page, needs no
   work beyond a row in `PAGESUM`. This also reaches the four pages that
   have no `.ph` at all — report, agent, booking, messages — which
   `placeBand` skips by design, and gives them a band of their own with
   nothing in it but Tal.

   LAST IN THE JS ORDER, and that is load-bearing twice over: `placeBand`
   (ai5) has to have assembled the band before this can find it, and
   `enhanceTalCards` (views.js) has to have added its chips before this can
   take them out again.
   ========================================================================== */

/* --------------------------------------------------------------------------
   THE SUMMARIES

   WHAT A SUMMARY IS HERE, because the first pass of these got it wrong and
   the correction is the whole point of this table. A summary is not an index
   of the page. "Points, badges and rank, and what moves each one" names the
   three blocks below it and tells a reader nothing they could not get by
   looking — it is a caption, and a caption under a page the reader can
   already see is furniture.

   What Tal writes instead is what the page SAYS: the figures on it, read and
   put in order of what matters. "1,095 points, 1,405 short of Bronze" is a
   summary. "Your points" is a label. The test on every line below is whether
   it could have been written without reading the page — if it could, it is
   the wrong line.

   So:

     - LEAD WITH THE NUMBERS THE PAGE IS MADE OF. Days, chapters, averages,
       prices, dates, names. They come from `data.js` and `CFG`, and where a
       page's figures move with the stage the entry is a FUNCTION of them
       rather than a string, so the summary cannot drift from the page it is
       summarising.
     - THEN WHAT THEY MEAN. A number the reader cannot act on is trivia:
       2,955 points matters because Bronze was 2,500. Five chapters matters
       because there are thirteen.
     - THEN THE ONE THING OUTSTANDING, if there is one. Not a list of
       everything possible — the single thing this page is waiting on.
     - Second person, contractions, present tense. Tal is talking.
     - Length is whatever the page needs. Two sentences on a page with two
       facts; four or five on the day-34 dashboard, which genuinely has that
       much going on. Padding a thin page to match a full one is how a
       summary turns back into furniture.
     - Never repeat the page title. It is directly above.

   A value is a string, or a function of the stage's config, or an object
   keyed by stage with `_` as the fallback. Functions get `f` — `cfg(S.stage)`
   — and read the same globals the views do, so a change to `CFG` or `GAME`
   moves the summary with the page rather than leaving it lying.
   -------------------------------------------------------------------------- */

/* about-N-hours, from the minutes the course record holds. Rounded, and
   spoken as "about", because a summary that says 11.7 hours is reading the
   data out rather than summarising it. */
const _hrs = m => Math.round(m / 60);
const _n = x => x.toLocaleString('en-US');
/* "a 88% average" is the tell that a number was dropped into a sentence
   written around a different one. The article follows how the figure is
   SPOKEN, not how it is spelt: eighty, eleven and eighteen all open on a
   vowel, so 8x, 11 and 18x take "an" and everything else takes "a". */
const _an = n => /^(8|11|18)/.test(String(n)) ? 'an' : 'a';

const PAGESUM = {

  /* --- the journey -----------------------------------------------------
     THE DASHBOARD SUMMARY SAYS WHY YOU ARE ON THE DASHBOARD, and that is a
     narrower job than the other pages'. The first version of these read as a
     progress report on the whole journey — "the agent interview is still
     unbooked", "one thing is left before the ninety days can start" — which
     is the story of the product told from the top every time you land, and
     none of it is on the page you are looking at. A summary that narrates
     the steps around this one is answering a question nobody asked.

     What a person opens the dashboard FOR is orientation: where do I stand
     right now, what is live, and is anything on me today. So each of these
     opens by saying what the page has gathered, states the figures that are
     actually on it, and closes on what is being asked of the reader — which
     on four of the eight stages is honestly nothing. Steps that live on
     another page are that page's summary to write.
     ---------------------------------------------------------------------- */
  dashboard: {
    consult: 'The whole state of your account on one screen, while it is still new. Your quiz result carried over &mdash; Explorer track, 64 out of 100, taken on 3 August &mdash; and the one thing live is fifteen minutes with Jordan Blake on Thursday at 2:00 PM ET. Nothing on this page is waiting on you today; it is here so you can see where things stand before anything is asked of you.',

    new: 'Where you stand today, gathered in one view: on the Explorer track from a quiz score of 64, with no level, nothing booked and nothing paid. The page holds what the quiz decided, what it explicitly did not, and the agents open to you at this level, so the whole picture is in front of you before you commit to any of it.',

    booked: 'Your account with one thing live in it. Priya Nair, Thursday 20 August at 6:30 PM ET &mdash; 45 minutes, recorded, already paid &mdash; and she has run 210 interviews at E1 to E3 with a 4.8 rating. Everything decided about you so far sits underneath it. Nothing here needs you before the day itself.',

    assessed: 'Where you stand now that you have been assessed, in one view. Explorer &ndash; E3, rung 3 of 15, signed by Priya Nair on 21 August, with delegation and hard conversations named as your growth areas. The page gathers your result, the report behind it and the course built for that rung, so the whole of what was decided is on one screen.',

    week1: f => `Your first week in Cohort 41, gathered in one place: day ${f.day} of 90, ten of you at E3 with Priya Nair leading. Chapter 1, Why We Exist, unlocks today and runs 45 minutes, and the call is Thursday at 6:00 PM ET. Four of the ten have finished chapter 1 already. Nothing is assessed this week, so the page is here to get you oriented rather than to chase you.`,

    day34: f => `Everything about where you actually are, on one screen. Day ${f.day} of 90, ${f.done} of 13 chapters at ${_an(f.avg)} ${f.avg}% average, ${_n(GAME.day34.pts)} points &mdash; ${_n(2500 - GAME.day34.pts)} short of Bronze. Two things are genuinely open and both are visible below: chapter 4, Delegation Without Drop-Off, which you have started four times without finishing and which your report names as a growth area, and the week 4 reflection, which was due Monday and shows on Priya&rsquo;s roster. Thursday&rsquo;s call is week 5, on hard conversations.`,

    day90: f => `The ninety days, closed out and gathered here. Thirteen chapters at ${_an(f.avg)} ${f.avg}% average off about ${_hrs(f.mins)} hours of work, ${_n(GAME.day90.pts)} points, the Bronze badge and a 1-Star rank &mdash; and the 90-day summary written from all of it. This is the page that holds the evidence of what you did, in the form it gets read in.`,

    promoted: f => `Where you landed. Explorer &ndash; E4, signed by Priya Nair on 21 November off thirteen chapters at ${_an(f.avg)} ${f.avg}% average and ${_n(GAME.promoted.pts)} points, with Cohort 41 now closed. The page keeps the whole record of those ninety days together with what changes at your new rung, and there is nothing on it waiting for you.`,

    _: 'Where you stand right now, in one view: what has been decided about you, what is live, and anything that is waiting on you today.'
  },

  level: {
    consult: 'No level yet. The quiz gave you a track, not a rung &mdash; Explorer is the first of three and holds rungs 1 to 5 of 15. It is the band for people already leading work but not a whole function, and it covers rhythm, delegation, hard conversations and feedback. Only a 45-minute agent interview can put you on one of those five rungs, and the report follows within 48 hours of it.',
    new: 'No level yet. The quiz gave you a track, not a rung &mdash; Explorer is the first of three and holds rungs 1 to 5 of 15. It is the band for people already leading work but not a whole function, and it covers rhythm, delegation, hard conversations and feedback. Only a 45-minute agent interview can put you on one of those five rungs, and the report follows within 48 hours of it.',
    booked: 'Still no confirmed rung &mdash; the interview you have booked is what sets it. Explorer covers rungs 1 to 5 of 15 and your quiz predicted somewhere inside that band, which is a prediction and not a placement. Priya will confirm the actual rung on 20 August, and it is that number, not the quiz score, that decides which course you take.',
    promoted: 'Explorer &ndash; E4, rung 4 of 15, signed by Priya Nair on 21 November after your re-interview. You came up from E3 on thirteen chapters at an 87% average. E4 is the top half of the Explorer band and the first rung at which you can volunteer to lead a cohort below your own level; from here the ladder runs on into Builder at rung 6.',
    _: 'Explorer &ndash; E3, rung 3 of 15, confirmed by Priya Nair on 21 August off a 45-minute interview rather than off the quiz. That puts you in the middle of the Explorer band. There is exactly one way to move: finish a 90-day course and re-interview at the end of it, which takes you up a rung, holds you, or drops you one. Activity on its own does not move it and neither does the quiz.'
  },

  report: 'Priya Nair&rsquo;s write-up of the 45 minutes you spent with her on 20 August, signed the following day, confirming Explorer &ndash; E3. It sets out what she actually heard: that you rewrote a reorganization plan after sitting with two engineers rather than after reading the document, and that you play down your own answers as you give them. Delegation and hard conversations are the two growth areas she names, and both are chapters on the course you take next. The full transcript sits behind it, and the report stays yours whatever happens to your level later.',

  interviews: 'Every interview on your record and every one still to come. A level interview is 45 minutes with a talent agent, recorded, and it is the only thing in TalentNext that can set or change your rung &mdash; not the quiz, not your course average, not your points. Booking, rescheduling and cancelling all happen here, and each finished one links through to the report it produced.',

  agents: 'Three of the twenty-four talent agents assess at your level and have a slot inside seven days: Priya Nair at $95, rating 4.8 over 210 interviews; Owen Clarke at $85 and 4.6; Lena Fischer at $80 and 4.5. Price tracks how booked an agent is rather than how good they are, and the order here is how their past candidates went on to progress. Whoever you choose it is the same 45 minutes, recorded, with the report inside 48 hours.',

  agent: () => {
    const a = AGENTS[S.agent || 'priya'];
    return `${a.n} assesses ${a.range}, has run ${a.ivs} interviews and rates ${a.r.toFixed(1)} out of five. It is ${a.price} for 45 minutes, recorded, with your report inside 48 hours of the call.${a.bio ? ' In their own words: &ldquo;' + a.bio.split('.')[1].trim() + '.&rdquo;' : ''} The next free slot is ${a.slot} &mdash; pick a time at the foot of this page and that is the booking made.`;
  },

  booking: () => {
    const a = AGENTS[S.agent || 'priya'];
    return `Booked. ${a.n}, Thursday 20 August at 6:30 PM ET, 45 minutes, recorded, ${a.price} paid on a Visa ending 4242. The calendar invite and the joining link are already in your email. Nothing is expected of you before the day &mdash; and if it stops working, rescheduling and cancelling are both on this page rather than in an email thread.`;
  },

  enrol: 'The Explorer Track at E3: 90 days, 13 chapters and a cohort of ten with a live cohort leader, for $595 paid once. It works out at about an hour a week plus the 60-minute call, and the people who keep to that finish averaging above 85%. Enrolling puts you in the next cohort to open, usually inside two weeks, and the ninety days end with the re-interview that can move your rung.',

  payment: '$595 for the Explorer Track &ndash; E3, charged once. There is no subscription, nothing renews, and your card is not kept on file after this. Your cohort starts within two weeks of the payment clearing, and this is the last step before you are enrolled &mdash; everything after it happens inside the course.',

  /* --- the ninety days --------------------------------------------------- */
  coursework: f => {
    const cur = CH[f.open];
    return `Thirteen chapters, 45 to 70 minutes each, in the order they unlock &mdash; one a week, and you cannot jump ahead of the schedule. ${f.done ? `${f.done} are finished${f.avg ? ` at ${_an(f.avg)} ${f.avg}% average` : ''}` : 'None are finished yet'}${cur ? `, and chapter ${f.open + 1}, ${cur[0]}, is the one you have open` : ''}. They play in LightSpeed VT rather than here; your progress and your assessment score come back the moment you close one.`;
  },

  chapter: () => {
    const cur = CH[cfg(S.stage).open];
    return `${cur ? `Chapter ${cfg(S.stage).open + 1}, ${cur[0]} &mdash; ${cur[1]} minutes.` : 'You are inside a chapter.'} It runs in LightSpeed VT and it is four things in sequence: video, reading, a roleplay and an assessment at the end. Only the assessment score counts towards your average. You can stop part-way and come back to the same place, and whatever you have finished counts the moment you leave.`;
  },

  transcript: f => {
    if(!f.done) return 'Nothing on the record yet &mdash; the ninety days started this week and the first chapter has not been assessed. Once they are, this is the page an agent reads before your re-interview: chapters finished, assessment scores, time on the course week by week, and the 90-day summary your cohort leader signs at the end of it.';
    return `${f.done} of 13 chapters, ${_an(f.avg)} ${f.avg}% assessment average and about ${_hrs(f.mins)} hours on the course, set out week by week against a ${WEEK_TARGET}-minute target. This is the page an agent reads before a re-interview &mdash; it is the evidence your next rung is argued from, which is why it shows the weeks you missed as well as the ones you made. The 90-day summary at the foot is written from it, and Priya signs that.`;
  },

  rewards: () => {
    const g = GAME[S.stage];
    if(!g) return 'Points do not start until you are on a course, so there is nothing on your total yet. When they do: 10 for signing in, 25 for finishing a chapter, 250 for finishing a course, and 10 to 20 for taking part in the cohort discussion. Bronze is at 2,500 points, Silver at 5,000, Gold at 10,000. None of it touches your level, which only an interview can move.';
    const toB = 2500 - g.pts;
    return `${_n(g.pts)} points, ${g.badges} of 4 badges, and a ${RANKS[g.rank - 1].n} rank. ${toB > 0
      ? `Bronze is at 2,500, so you are ${_n(toB)} away from your first badge.`
      : `Bronze is yours; Silver is at 5,000, so it is ${_n(5000 - g.pts)} further on.`} They come from signing in (10 a day), finishing chapters (25 each) and taking part in the cohort (10 to post, 20 when someone reacts) &mdash; and going quiet costs you: a week away is &minus;50 and a month is &minus;250. None of it affects your level.`;
  },

  cohort: f => `Ten people at Explorer &ndash; E3, led by Priya Nair, in week ${f.week} of 13. The call is Thursday at 6:00 PM ET for 60 minutes; week 5 is hard conversations and Priya has asked everyone to bring a real one rather than a hypothetical. Between calls the discussion board is where the cohort actually talks &mdash; the live thread is Aisha asking where you draw the line between checking in and hovering, which is chapter 4&rsquo;s problem exactly.`,

  messages: 'Your one-to-one thread with Priya Nair, who leads Cohort 41. She can already see your chapter progress, your assessment scores and your attendance, so you never have to open by explaining where you have got to. Her last message asked you to bring the vendor review example to Thursday&rsquo;s call. Voice notes work here as well as text, and this thread is private &mdash; the cohort board is the other one.',

  /* --- account and money ------------------------------------------------- */
  billing: 'Every payment you have made to TalentNext, newest first, with the card each one went to. They are all one-off charges &mdash; $95 for a 45-minute agent interview, $595 for a 90-day course &mdash; so nothing on this page is a subscription, nothing renews, and no card is kept on file between purchases. Each row downloads its own receipt.',

  account: 'Your name, your email and how you want to be contacted &mdash; and the part most people come here for, which is what Tal is allowed to do. Tal keeps a list of things it has worked out about you from your interviews, your report and your course activity; you can read that list, mark anything on it wrong, or switch Tal off completely. Closing your account is at the foot, and it asks twice.',

  /* --- Tal's own pages --------------------------------------------------- */
  mem: () => {
    const live = MEMO.length - ((S.memDrop || []).length);
    return `${live} things Tal is holding about you, and every one of them traced to where it came from &mdash; a timestamp in an interview, a line in your report, or a note you wrote yourself. Most of it is from the 45 minutes with Priya: that you treat handing work over as a risk you are still carrying, that you change your mind in the room rather than on paper, that you play down your own answers as you give them. Mark any of it wrong and Tal stops using it. Delete it and it is gone.`;
  },

  rp: 'A rehearsal room for a conversation you are dreading. Tal plays the other person, briefed from what you actually said in your interview &mdash; Sam, the direct report you took the vendor review back from without telling him why, is one of three scenarios drawn straight off your own record. You choose what to say from three options at each turn and see how it lands. Nothing here is recorded, scored, or visible to your cohort leader.',

  ivt: () => {
    const iv = IVT[S.iv === 're' ? 're' : 'level'];
    return `The full ${iv.len} of your ${iv.label.toLowerCase()} with Priya Nair on ${iv.date}, written out and searchable, ending in ${iv.outcome.replace(/^Confirmed /, 'a confirmed ')}. Six moments are marked as scenes and every line is tagged, so you can filter down to just the delegation exchanges, the decisions, or the places you hedged. This is the source for everything in your report and everything Tal remembers about you &mdash; if something there looks wrong, it is quotable from here.`;
  },

  /* --- the cohort leader ------------------------------------------------- */
  leadDash: () => {
    const att = lattention(), pend = lpending(), next = lnext();
    const bad = att.filter(x => x.m.flag.k === 'bad').length;
    return `${LEAD_COHORTS.length} cohorts and ${lmembers().length} candidates. ${pend === 1
      ? 'One decision is'
      : _n(pend) + ' decisions are'} waiting on your signature, and nobody in that queue can enroll until you sign a level. ${att.length} people need a look, ${bad} of them seriously &mdash; mostly candidates who have not opened a chapter in over a week, and four of those are in Cohort 47, which is only on day 4.${next ? ` Your next session is ${next.name}, ${next.when.toLowerCase()}.` : ''} Cohort 41 meets Thursday at 6:00 PM, week 5 of 13.`;
  },

  /* The six that are not drawn yet. An honest summary of an empty page is
     what will be in it — the same sentence the empty state gives, said as
     Tal would say it rather than as a roadmap entry. */
  leadSessions:  'Not built yet. When it is: every interview you have run and every one booked, plus the run-a-session flow &mdash; join, end, write the evaluation, pick the rung, publish the summary.',
  leadEvals:     'Not built yet. When it is: the level decisions waiting on your signature, each one with the transcript reading, the competency breakdown and the evidence behind the rung being proposed.',
  leadCohorts:   'Not built yet. When it is: all three cohorts with their rosters, the weekly call brief, and a page per candidate carrying their progress and your notes.',
  leadReports:   'Not built yet. When it is: what the course platform sends back &mdash; chapter progress, assessment scores and attendance, per candidate and per cohort.',
  leadMessages:  'Not built yet. When it is: the cohort discussion boards, shared with the candidate side so a post here shows up there, and your one-to-one threads.',
  leadCerts:     'Not built yet. When it is: what leading earns you &mdash; cohorts closed, candidates promoted, and the certification each one counts towards.',
  leadProfile:   'Not built yet. When it is: the public profile candidates read when they are choosing an agent, the range you assess, and your availability calendar.'
};

function pageSummary(){
  const e = PAGESUM[S.view];
  const v = (e && typeof e === 'object' && !(typeof e === 'function')) ? (e[S.stage] || e._) : e;
  if(typeof v === 'function'){
    try { return v(cfg(S.stage)) || ''; } catch(err){ console.warn('pagesum copy', S.view, err); return ''; }
  }
  return v || '';
}

/* --------------------------------------------------------------------------
   THE PASS
   -------------------------------------------------------------------------- */
function placePageSummary(){
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;
  const page = main.querySelector('.page');
  if(!page) return;
  /* the ask thread and the sign-up screens are not modules and Tal does not
     summarise them — same two exclusions `placeBand` makes, for the same
     reasons, written down there */
  if(page.classList.contains('ask-page')) return;
  if(page.closest('.auth-card')) return;

  const band = page.querySelector(':scope > .modhead');

  /* 1. THE QUESTIONS LEAVE THE TOP OF THE PAGE.
     Both containers, because a card can hold either: `.ai-foot` is what the
     view prints and `.ai-asks` is what ai4 appends, and ai5 merges one into
     the other only when both exist. `.sec.ask-chips` is the row Points draws
     with no card around it. Scoped to the band — or, on a page that has no
     band, to the head of the page — so the chips inside `weekCard` and on
     the agent cards further down are untouched. */
  const top = band || page;
  top.querySelectorAll(':scope > .sec.ask-chips').forEach(el => el.remove());
  if(band) band.querySelectorAll('.ai-asks, .ai-foot').forEach(el => el.remove());

  /* AND SO DOES THE ACTION THAT RODE TAL'S HEAD ROW.
     `placeBand` promotes each Tal card's one next step onto the row Tal's
     name is on — and converts three cards' text links into buttons to do it.
     That was right when the row held a heading for the button to sit beside;
     with the heading gone the button is the whole row, and §25's `act` area
     draws it as a full-width black bar between Tal's name and the sentence
     it is meant to be about. It reads as the summary, and it is the loudest
     thing in a band whose job is to be read first.

     Removed rather than restyled: every one of these steps is also on the
     page under it — the plate's own button, the section's "View more", the
     rail — so the band loses a duplicate, not a route. */
  if(band) band.querySelectorAll('.ai-aura > .ai-head > .ai-do, .ai-aura > .ai-head > .btn-p, .ai-aura > .ai-head > .btn').forEach(el => el.remove());

  const text = pageSummary();
  if(!text) return;

  /* 2. FIND TAL'S CARD, OR MAKE ONE.
     ONLY EVER INSIDE THE BAND. An earlier version fell back to searching the
     whole page when there was no band, and that is not the same question:
     `V.booking` and `V.agent` both carry a Tal card in the BODY, doing the
     job Tal cards did before this pass existed — advice about the thing next
     to it. Searching the page found one of those, rewrote it as the page
     summary, and left it where it was, halfway down. A page with no header
     has no Tal card at the head of it by definition, so the answer there is
     always to build one. */
  let aura = band ? band.querySelector('.ai-aura') : null;
  if(!aura){
    const sec = document.createElement('div');
    sec.className = 'sec';
    sec.innerHTML = '<div class="ai-aura tile tight">' +
      '<div class="ai-head"><span class="ai-label">Tal</span></div>' +
      '<div class="ai-body"><p></p></div></div>';
    aura = sec.querySelector('.ai-aura');

    if(band){
      /* after the page header, which is where every hand-written Tal card
         already sits — the band's own grid does the rest */
      const ph = band.querySelector(':scope > .ph');
      if(ph) ph.insertAdjacentElement('afterend', sec);
      else band.appendChild(sec);
    } else {
      /* NO PAGE HEADER, SO NO BAND — report, agent, booking and messages all
         open on their own object instead of a title. They still get the
         wash and the closing rule, because the summary has to read as the
         same block it is on every other page; the band simply has one
         member. It goes under the crumb, which is navigation and belongs
         above anything Tal says. */
      const nb = document.createElement('div');
      nb.className = 'modhead';
      nb.appendChild(sec);
      const crumb = page.querySelector(':scope > .crumb');
      if(crumb) crumb.insertAdjacentElement('afterend', nb);
      else page.insertBefore(nb, page.firstChild);
    }
  }

  /* 3. THE HEADING GOES AND THE SENTENCE TAKES ITS PLACE. */
  const head = aura.querySelector(':scope > .ai-head');
  if(head) head.querySelectorAll('h3').forEach(h => h.remove());

  let body = aura.querySelector(':scope > .ai-body');
  if(!body){
    body = document.createElement('div');
    body.className = 'ai-body';
    aura.appendChild(body);
  }
  body.innerHTML = '<p>' + text + '</p>';

  /* 4. AND IT IS NOT A BUTTON. See the note at the head of this file. */
  aura.classList.remove('ai-clickable', 'ai-act-top');
  aura.removeAttribute('data-tal-ask');
  aura.removeAttribute('role');
  aura.removeAttribute('tabindex');
  aura.removeAttribute('aria-label');

  /* the flag §33 styles against, so nothing here reaches a Tal card that is
     further down a page doing its old job */
  aura.classList.add('talsum');
}

const _baseSum = render;
render = function(){
  _baseSum();
  try { placePageSummary(); } catch(e){ console.warn('pagesum', e); }
};

/* the boot render is the last statement in views.js and ran long before this
   file was parsed, so this pass has to draw the first paint itself */
render();
