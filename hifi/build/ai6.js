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

   SHORT. CONVERSATIONAL. THE FEW THINGS THAT MATTER. This table has been
   rewritten twice and both earlier versions failed in a way worth recording,
   because the pull is towards both of them.

   The first version NAMED THE SECTIONS: "Points, badges and rank, and what
   moves each one." That is a caption, and a caption under a page the reader
   can already see is furniture. The test that kills it: could the line have
   been written without reading the page?

   The second version over-corrected into PROSE. It had the right facts and
   the wrong register — "The ninety days, closed out and gathered here",
   "This is the page that holds the evidence of what you did". Openers that
   set a scene, closers that explain what the page is for, five sentences
   where two would do. Nobody reads a summary for the writing. The client's
   word for it was "a story", and it is: a paragraph performing rather than
   telling you the two things you needed.

   What is left is the rule:

     - TWO SENTENCES. Three only when the page genuinely has three things on
       it that matter. Say the thing and stop.
     - THE FACTS, IN THE ORDER A PERSON WOULD ASK FOR THEM. Where you are,
       what is open, what is on you. Numbers are the content: "day 34 of 90,
       5 of 13 chapters at 88%" is the whole first sentence.
     - NO FRAMING. Nothing that describes the page rather than what is on it
       — no "gathered here", no "this is the page that", no "in one view".
       The reader is looking at the page.
     - CONTRACTIONS, PLAIN WORDS. It is Tal talking to one person, not a
       report being filed.
     - Never repeat the page title. It is directly above.

   A value is a string, a function of the stage's config, or an object keyed
   by stage with `_` as the fallback. Functions get `f` — `cfg(S.stage)` —
   and read the same globals the views do, so the figures cannot drift from
   the page they are summarising.
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

  /* --- the journey ----------------------------------------------------- */
  dashboard: {
    consult: 'You&rsquo;re all set up. Jordan Blake calls on Thursday at 2:00 PM ET for fifteen minutes &mdash; nothing to prepare, and it doesn&rsquo;t set your level.',

    new: 'You&rsquo;re on the Explorer track from a quiz score of 64, but you have no level yet &mdash; that comes from a 45-minute interview. Three agents have a slot this week, $80 to $95.',

    booked: 'You&rsquo;re booked with Priya Nair, Thursday 20 August at 6:30 PM ET. Forty-five minutes, recorded, already paid &mdash; nothing to do before the day.',

    assessed: 'You&rsquo;re Explorer &ndash; E3, rung 3 of 15, signed by Priya on 21 August, with delegation and hard conversations as your growth areas. Enrolling is the only thing left.',

    week1: f => `Day ${f.day} of 90 in Cohort 41. Chapter 1 unlocks today and your first call is Thursday at 6:00 PM ET &mdash; nothing&rsquo;s assessed this week.`,

    day34: f => `Day ${f.day} of 90, ${f.done} of 13 chapters at ${f.avg}%, ${_n(GAME.day34.pts)} points. Chapter 4 is still unfinished after four goes and your week 4 reflection is overdue. Thursday&rsquo;s call is on hard conversations.`,

    day90: f => `All 13 chapters done at ${f.avg}%, and you&rsquo;re on ${_n(GAME.day90.pts)} points with the Bronze badge. Your 90-day summary is written &mdash; Priya signs it once you book the re-interview.`,

    promoted: f => `You&rsquo;re Explorer &ndash; E4 now, signed by Priya on 21 November, and Cohort 41 is closed. At E4 you can volunteer to lead a cohort below your level.`,

    _: 'Where you stand right now, and anything waiting on you today.'
  },

  level: {
    consult: 'No level yet &mdash; the quiz gives you a track, not a rung. Explorer is rungs 1 to 5 of 15, and a 45-minute interview decides which one.',
    new: 'No level yet &mdash; the quiz gives you a track, not a rung. Explorer is rungs 1 to 5 of 15, and a 45-minute interview decides which one.',
    booked: 'Still no rung &mdash; the interview on 20 August is what sets it. Explorer covers rungs 1 to 5 of 15, and the quiz only predicted the band.',
    promoted: 'You&rsquo;re at E4, rung 4 of 15, signed on 21 November after your re-interview. At E4 you can volunteer to lead a cohort below your level.',
    _: 'You&rsquo;re at E3, rung 3 of 15 on the Explorer track, confirmed by Priya on 21 August. Only a re-interview at the end of a 90-day course moves it.'
  },

  report: 'Priya&rsquo;s write-up of your 20 August interview, confirming Explorer &ndash; E3. Delegation and hard conversations are the growth areas she named, and both are chapters on your course.',

  interviews: 'Every interview you&rsquo;ve had and every one booked. This is the only thing that sets or changes your rung, and each finished one links to its report.',

  agents: 'Three agents assess at your level and have a slot this week &mdash; Priya at $95, Owen at $85, Lena at $80. Same 45 minutes whoever you pick.',

  agent: () => {
    const a = AGENTS[S.agent || 'priya'];
    return `${a.n} assesses ${a.range}, has run ${a.ivs} interviews and rates ${a.r.toFixed(1)}. ${a.price} for 45 minutes, and the next free slot is ${a.slot}.`;
  },

  booking: () => {
    const a = AGENTS[S.agent || 'priya'];
    return `Booked &mdash; ${a.n}, Thursday 20 August at 6:30 PM ET. The invite and joining link are already in your email, and you can move it from here.`;
  },

  enrol: '90 days, 13 chapters and a cohort of ten with a live leader, for $595 paid once. About an hour a week plus the call, and you start with the next cohort.',

  payment: '$595, charged once &mdash; no subscription and nothing renews. Your cohort starts within two weeks of the payment clearing.',

  /* --- the ninety days --------------------------------------------------- */
  coursework: f => {
    const cur = CH[f.open];
    return `${f.done ? `${f.done} of 13 chapters done${f.avg ? ` at ${f.avg}%` : ''}` : 'None of the 13 chapters finished yet'}${cur ? `, and chapter ${f.open + 1}, ${cur[0]}, is open` : ''}. They&rsquo;re 45 to 70 minutes each and one unlocks a week.`;
  },

  chapter: () => {
    const i = cfg(S.stage).open, cur = CH[i];
    return `${cur ? `Chapter ${i + 1}, ${cur[0]} &mdash; ${cur[1]} minutes.` : 'You&rsquo;re inside a chapter.'} Video, reading, a roleplay, then an assessment; only the assessment counts towards your average. Stop any time and come back.`;
  },

  transcript: f => f.done
    ? `${f.done} of 13 chapters, ${f.avg}% average, about ${_hrs(f.mins)} hours in. This is what an agent reads before your re-interview.`
    : 'Nothing on the record yet &mdash; the ninety days only started this week.',

  rewards: () => {
    const g = GAME[S.stage];
    if(!g) return 'Points start when you enroll on a course &mdash; 10 for signing in, 25 a chapter, Bronze at 2,500. None of it affects your level.';
    const toB = 2500 - g.pts;
    return `${_n(g.pts)} points, ${g.badges} of 4 badges, ${RANKS[g.rank - 1].n}. ${toB > 0
      ? `Bronze is at 2,500, so you&rsquo;re ${_n(toB)} off it.`
      : `Bronze is yours and Silver is at 5,000.`} Points come from signing in, chapters and cohort posts &mdash; none of it touches your level.`;
  },

  cohort: f => `Ten of you at E3 with Priya leading, week ${f.week} of 13. Thursday&rsquo;s call is at 6:00 PM ET on hard conversations, and she&rsquo;s asked everyone to bring a real one.`,

  messages: 'Your private thread with Priya. She can already see your chapters, scores and attendance, so you never have to explain where you are. Her last message asked for the vendor review example.',

  /* --- account and money ------------------------------------------------- */
  billing: 'Everything you&rsquo;ve paid, newest first &mdash; all one-off charges. Nothing renews, no card is kept on file, and each row downloads its receipt.',

  account: 'Your details, how you want to be contacted, and what Tal is allowed to do. Changes save as you go; closing your account is at the foot.',

  /* --- Tal's own pages --------------------------------------------------- */
  mem: () => {
    const live = MEMO.length - ((S.memDrop || []).length);
    return `${live} things I&rsquo;ve learned about you, each traced back to where it came from. Mark anything wrong and I&rsquo;ll stop using it.`;
  },

  rp: 'Rehearse a hard conversation before you have it for real. I play the other person, briefed from your interview &mdash; nothing here is recorded or scored.',

  ivt: () => {
    const iv = IVT[S.iv === 're' ? 're' : 'level'];
    return `The full ${iv.len} of your ${iv.label.toLowerCase()} with Priya on ${iv.date}, searchable and tagged by topic. Everything in your report came from here.`;
  },

  /* --- the cohort leader ------------------------------------------------- */
  leadDash: () => {
    const att = lattention(), pend = lpending(), next = lnext();
    const bad = att.filter(x => x.m.flag.k === 'bad').length;
    return `${pend === 1 ? 'One decision is' : _n(pend) + ' decisions are'} waiting on your signature, and nobody in that queue can enroll until you sign. ${att.length} candidates need a look, ${bad} of them seriously.${next ? ` Next session is ${next.name}, ${next.when.toLowerCase()}.` : ''}`;
  },

  /* THE SEVEN MODULES, AND THE FOUR PAGES UNDER THEM.
     An entry here is what turns a hand-authored Tal card at the head of a
     leader page into `.talsum`; a page with NO entry leaves that card in a
     shape §33 does not style — a 1786px head band on a 1068px page. The long
     note above `ldrRead` in lead2.js records the whole mechanism. So every
     leader view has one, and the four detail pages read their subject off
     `S` the way `agent` and `chapter` do on the candidate side. */
  leadSessions: () => {
    const up = LEAD_SESSIONS.filter(s => s.state === 'upcoming');
    const done = LEAD_SESSIONS.filter(s => s.state === 'done');
    const due = done.filter(s => { const e = LEAD_EVALS.filter(x => x.name === s.name)[0]; return e && e.status === 'pending'; }).length;
    const nx = up[0];
    return `${up.length} interview${up.length === 1 ? '' : 's'} booked, ${done.length} already run.${nx ? ` Next is ${nx.name}, ${nx.when.toLowerCase()}.` : ''}${due ? ` ${due === 1 ? 'One' : _n(due)} still ${due === 1 ? 'needs' : 'need'} an evaluation before those candidates can enroll.` : ''}`;
  },

  leadEvals: () => {
    const pe = LEAD_EVALS.filter(e => e.status === 'pending');
    const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
    const e0 = pe[0];
    if(!pe.length && !ps.length) return 'Nothing is waiting on your signature &mdash; every level and every summary is signed.';
    return `${pe.length ? `${pe.length === 1 ? 'One level decision' : _n(pe.length) + ' level decisions'}` : 'No level decisions'} and ${ps.length ? `${ps.length === 1 ? 'one ninety-day summary' : _n(ps.length) + ' summaries'}` : 'no summaries'} waiting on you.${e0 ? ` I&rsquo;ve proposed Explorer &ndash; ${e0.ai} for ${e0.name}, but the rung is yours to set.` : ''}`;
  },

  leadEval: () => {
    const e = LEAD_EVALS.filter(x => x.id === S.ldrEv)[0] || LEAD_EVALS[0];
    const an = typeof LDR_AN !== 'undefined' ? LDR_AN[e.id] : null;
    if(e.status === 'done')
      return `Signed at Explorer &ndash; ${e.assigned}${e.override ? `, against my proposal of ${e.ai}` : ''}. ${e.name} can enroll now.`;
    return `${an ? an.sum : e.why} Their quiz was ${e.quiz} of 100.`;
  },

  leadSum: () => {
    const s = LEAD_SUMMARIES.filter(x => x.id === S.ldrSum)[0] || LEAD_SUMMARIES[0];
    const c = lcoOf(s.cohort);
    const m = lmemOf(c, s.name);
    if(s.status === 'done') return `Published. You recommended: ${s.rec}.`;
    return `${s.name} finished the ninety days at ${m.pc}% with ${m.avg}% on assessments and ${lchDone(m)} of 13 chapters. The recommendation is the part only you can write.`;
  },

  leadCohorts: () => {
    const flagged = lmembers().filter(x => x.m.flag);
    const worst = LEAD_COHORTS.slice().sort((a,b) => (lavg(a,'pc') - lpace(a)) - (lavg(b,'pc') - lpace(b)))[0];
    const next = LEAD_COHORTS.slice().sort((a,b) => a.callOrd - b.callOrd)[0];
    return `Three cohorts, ${lmembers().length} candidates, all Explorer. Cohort ${worst.id} is ${Math.abs(lavg(worst,'pc') - lpace(worst))} points behind pace &mdash; the widest of the three &mdash; and ${flagged.length} candidates are flagged. Next call is ${lname(next).toLowerCase()}, ${next.callDay.toLowerCase()} at ${next.callTime.toLowerCase()}.`;
  },

  leadCohort: () => {
    const c = lcoOf(S.ldrCo);
    const gap = lavg(c,'pc') - lpace(c);
    const bad = c.members.filter(m => m.flag && m.flag.k === 'bad').length;
    return `${c.members.length} candidates at ${llevel(c)}, week ${c.week} of 13. Averaging ${lavg(c,'pc')}% against ${lpace(c)}% expected &mdash; ${gap >= 0 ? `${gap} ahead` : `${Math.abs(gap)} behind`} &mdash; with assessments at ${lavg(c,'avg')}%. ${bad ? `${bad === 1 ? 'One candidate is' : _n(bad) + ' candidates are'} at risk.` : 'Nobody is at risk this week.'}`;
  },

  leadMember: () => {
    const c = lcoOf(S.ldrCo);
    const m = lmemOf(c, S.ldrMem);
    return ldrRead(m, c);
  },

  leadReports: () => {
    const sel = S.ldrRep;
    const all = lmembers();
    const rows = sel === 'all' ? all : all.filter(x => x.c.id === +sel);
    const behind = rows.filter(x => x.m.pc - lpace(x.c) <= -5);
    const never = rows.filter(x => x.m.last === 'Never');
    const worst = behind.slice().sort((a,b) => (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c)))[0];
    return `${sel === 'all' ? `All ${rows.length} candidates` : `The ${rows.length} in cohort ${sel}`}, ordered by distance from expected pace. ${behind.length ? `${behind.length} ${behind.length === 1 ? 'is' : 'are'} five points or more behind` : 'None is behind pace'}${never.length ? ` and ${never.length} ${never.length === 1 ? 'has' : 'have'} never signed in` : ''}.${worst ? ` ${worst.m.name} is furthest back at ${worst.m.pc}%.` : ''}`;
  },

  leadMessages: () => {
    const co = lcoOf(S.ldrBoardCo);
    return `${lname(co)}&rsquo;s board is the same thread its members read on their own Cohort page, so anything you post there the whole group sees. The direct threads are private, one candidate each.`;
  },

  leadCerts: 'Three certifications earned and one in progress, off eight cohorts led and 62 interviews run. Candidate Mentoring is the open one, and it is what would let you assess into the Builder band.',

  leadProfile: 'Your listing, your availability and the four numbers you&rsquo;re measured on. The bio and photo are yours to write; the assessing range comes from your certifications.'
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
