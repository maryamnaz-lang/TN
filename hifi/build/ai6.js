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
   rewritten three times and every earlier version failed in a way worth
   recording, because the pull is towards all of them.

   The first version NAMED THE SECTIONS: "Points, badges and rank, and what
   moves each one." That is a caption, and a caption under a page the reader
   can already see is furniture. The test that kills it: could the line have
   been written without reading the page?

   The second version over-corrected into PROSE. It had the right facts and
   the wrong register — "The 90 days, closed out and gathered here",
   "This is the page that holds the evidence of what you did". Openers that
   set a scene, closers that explain what the page is for, five sentences
   where two would do. Nobody reads a summary for the writing. The client's
   word for it was "a story", and it is: a paragraph performing rather than
   telling you the two things you needed.

   The third version — the one this replaces — got the register right and
   still lost, on two counts that only show up once you look at the page
   rather than at the table.

   IT SAID WHAT THE GREY LINE ABOVE IT HAD JUST SAID. `ph()`'s second
   argument is a page description, and on nineteen pages it was a SENTENCE
   explaining the page — so the reader met the same fact twice, six
   millimetres apart, in two voices. Profile: "Your details, your
   preferences, and what Tal is allowed to do", then Tal saying "Your
   details, how you want to be contacted, and what Tal is allowed to do."
   Cohort: "Ten people at Explorer – E3, led by Priya Nair · week 5 of 13",
   then Tal saying "Ten of you at E3 with Priya leading, week 5 of 13". On
   Interviews the plate below it made it three times. That is fixed on BOTH
   sides and the split is now a rule: THE DESCRIPTION CARRIES FACTS, TAL
   CARRIES THE READING. Where a page has a factual spine it goes in the
   description as a `·` row — the shape Course Progress and one-candidate
   already used — and where it has none the description is dropped and the
   title stands alone over Tal's sentence. Before adding a summary here,
   read the page's `ph()` and make sure they are not the same sentence.

   IT EXPLAINED THE PRODUCT INSTEAD OF READING THE PAGE. A third of the
   table was policy and mechanism — "each row downloads its receipt",
   "closing your account is at the foot", "this is the only thing that sets
   or changes your level", "the same thread its members read on their own
   Cohort page". None of it is what a person came to catch up on, two of
   them pointed at controls the reader can see, and the last one explains
   the OTHER PORTAL to a leader who does not use it. An AI-native product
   does not get to spend its one paragraph describing itself.

   So the rule, and it is now five things:

     - TWO SENTENCES, 18 TO 28 WORDS. Not three. Say the thing and stop.
     - THE FACTS, IN THE ORDER A PERSON WOULD ASK FOR THEM. Where you are,
       what is open, what is on you. Numbers are the content: "day 34 of 90,
       5 of 13 chapters at 88%" is the whole first sentence.
     - IT MUST BE A CATCH-UP, NOT A DESCRIPTION. The reader is someone
       returning to a page they have seen before and wanting to know what
       moved. If the sentence would read the same next week, it is a caption.
     - NO FRAMING, NO POLICY, NO POINTING AT THE UI. Nothing that describes
       the page rather than what is on it, nothing about how the product
       works in general, and nothing about where a control is. The reader is
       looking at the page.
     - AND NOTHING FROM THE OTHER PORTAL. A candidate is not told they could
       lead a cohort; a leader is not told what their candidates' Cohort page
       looks like. Both were in the last version, twice each, and both are
       the reason a reader stops trusting the paragraph.
     - CONTRACTIONS, PLAIN WORDS. It is Tal talking to one person, not a
       report being filed.
     - Never repeat the page title or its description. Both are directly above.

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
/* SMALL COUNTS ARE SPELT AT THE START OF A SENTENCE, and this is not
   fussiness — it is the single change that did most for the leader side's
   voice. "4 decisions are waiting on your signature" opens on a glyph and
   reads as a figure lifted off a dashboard; "Four decisions are waiting"
   reads as somebody telling you. Twelve is the ceiling: past it the numeral
   IS how a person says the number, and a spelt "twenty-eight" beside a
   numeric 28 elsewhere on the same page is worse than either choice made
   consistently. MID-SENTENCE, ALWAYS THE NUMERAL — "5 of 13 chapters" is
   the figure being read, and spelling it there would be the opposite
   mistake. `_W` capitalises for sentence-start, `_w` does not, for the
   clause-subject case ("and four have never signed in").

   THIS IS NOT A NEW CONVENTION, it is one the product already kept without
   writing down: every "Forty-five minutes" in the build opens a sentence and
   every "45 minutes" sits inside one — eight against twenty-seven, and not a
   single exception either way. The leader side was the half that had drifted
   off it, because those summaries are assembled from counts rather than
   written out, and a template that starts `${n} decisions` has no way to
   know it is starting a sentence. That is what these two exist for. */
const _WORDS = ['no','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
/* AND `a.slot` IS A CARD LABEL, NOT A CLAUSE. It is stored as "Thu, Aug 20
   &middot; 6:30 PM", which is correct on the agent card and wrong inside a
   sentence twice over: a middot mid-prose reads as the sentence breaking, and
   three-letter days and months are an abbreviation a person does not speak.
   Spoken out here only — the card keeps its own compact drawing. */
const _DAYW = {Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
const _MONW = {Jan:'January',Feb:'February',Mar:'March',Apr:'April',May:'May',Jun:'June',
               Jul:'July',Aug:'August',Sep:'September',Oct:'October',Nov:'November',Dec:'December'};
const _slot = s => {
  const m = /^(\w{3}), (\w{3}) (\d+)\s*(?:&middot;|\u00b7)\s*(.+)$/.exec(String(s || ''));
  return m ? `${_DAYW[m[1]] || m[1]} ${m[3]} ${_MONW[m[2]] || m[2]} at ${m[4]}` : s;
};
const _w = n => n >= 0 && n <= 12 ? _WORDS[n] : _n(n);
const _W = n => { const s = _w(n); return s.charAt(0).toUpperCase() + s.slice(1); };

const PAGESUM = {

  /* --- the journey ----------------------------------------------------- */
  /* THE GREETING HAS LEFT THE SUMMARY, AND IT IS THE PAGE'S `<h1>` AGAIN.
     Every entry in this block used to open with `<span class="tal-greet">
     Welcome back, Maryam!</span>`, which §33.9 sizes at 22px and — the other
     half of that decision — hides the page's own `.ph` for. It was the right
     shape while Tal's card was the first thing in the band: one voice, saying
     hello and then saying where you stand.

     §56 gives the band two columns and puts the title, the fact row and the
     steps ABOVE Tal in the left one, so the greeting would have been the
     fourth thing on the page and the second heading in the same column. The
     `.ph` is the heading again — `Welcome back, Maryam` over `Explorer Track
     – E3 · Cohort 41 · week 5 of 13`, which is exactly the pair the leader's
     dashboard has always drawn (`lead.js`, `ph('Welcome back, Priya', …)`) and
     the shape the frame asks for.

     NOTHING IS LOST FROM THE COPY: every `.ph` on the eight dashboard stages
     already carried the same words, because the greeting was written from
     them. What Tal says now starts at the reading, which is what the rest of
     the table has always done — and it means the summary is the only prose in
     the band on the dashboard too, not just on the other nineteen pages.

     `.tal-greet` ITSELF STAYS, in §33.9 and in the design system. It is a real
     component — a greeting line inside a summary — and `tn-agent-portal.html`
     is built on it. This is the candidate portal choosing the other shape, not
     the shape being withdrawn. */
  dashboard: {
    consult: 'Your quiz put you on the Explorer track from a score of 64. Jordan Blake calls on Thursday at 2:00 PM ET for fifteen minutes &mdash; nothing to prepare, and it doesn&rsquo;t set your level.',

    new: 'You&rsquo;re on the Explorer track from a quiz score of 64, but you have no level yet &mdash; that comes from a 45-minute interview. Three agents have a slot this week, $80 to $95.',

    booked: 'Your interview with Priya is in 6 days &mdash; Thursday 20 August at 6:30 PM ET, 45 minutes, recorded. Delegation is the question she asks most often; ten minutes of practice is usually enough.',

    assessed: 'You&rsquo;re Explorer &ndash; E3, rung 3 of 15, signed by Priya on 21 August, with delegation and hard conversations as your growth areas. Enrolling is the only thing left.',

    week1: f => `Day ${f.day} of 90 in Cohort 41. Chapter 1 &mdash; ${CH[0][0]} &mdash; unlocks today, ${CH[0][1]} minutes. Four of the ten in your cohort have already finished it; nothing&rsquo;s assessed this week.`,

    day34: f => `Day ${f.day} of 90, week ${f.week}. ${f.done} of 13 chapters at ${f.avg}%, ${_n(f.mins)} minutes so far. Chapter 4 has been opened four times without finishing &mdash; the three furthest ahead in Cohort 41 had it done by now.`,

    day90: f => `All 13 chapters done in 90 days, ${f.avg}% average, ${_n(f.mins)} minutes total. Your growth areas were chapters 4 and 12 &mdash; and you passed both. Book the re-interview to have Priya assess whether you move up.`,

    /* THE DATE CAME OFF THIS LINE, AND IT IS THE CARD THAT HAS IT NOW. The
       sentence used to close on "E4 opens December 1, and at this level you can
       volunteer to lead a cohort" — right while the enrolment card beside it
       stated no date at all. `ENROL_OPENS` (views.js) puts the opening in a band
       on the card, which is where a reader looks for it, and one date said twice
       inside one head band is the duplication this whole table exists to stop.
       Tal keeps the consequence of the level, which is the half the card cannot
       say: 26 words, and the two figures are still `f`'s. */
    promoted: f => `You moved from E3 to E4 in 90 days &mdash; 13 chapters, ${f.avg}% average, ${_n(f.mins)} minutes of coursework. At this level you can also volunteer to lead a cohort.`,

    _: 'Where you stand right now, and anything waiting on you today.'
  },

  /* ONE STRING, NOT TWO IDENTICAL ONES. `consult` and `new` were separate
     keys holding the same sentence, which is a thing that stays in step for
     exactly as long as nobody edits one of them. */
  level: (() => {
    const pre = 'No level yet. The quiz gives you a track, not a level &mdash; Explorer is levels 1 to 5 of 15, and a 45-minute interview decides which.';
    return {
      consult: pre,
      new: pre,
      booked: 'Still no level &mdash; the interview on 20 August sets it. Explorer covers levels 1 to 5 of 15; the quiz only predicted the band.',
      promoted: 'E4, level 4 of 15, signed on 21 November after your re-interview &mdash; one up from where the 90 days started. Another course and re-interview moves it again.',
      _: 'E3, level 3 of 15 on the Explorer track, confirmed by Priya on 21 August. Only a re-interview at the end of a course moves it.'
    };
  })(),

  report: 'Priya&rsquo;s write-up of the 20 August interview, confirming Explorer &ndash; E3. Delegation and hard conversations are the growth areas &mdash; both are chapters on your course.',

  /* THE BREAKDOWN'S READING, AND IT IS TWO FIGURES THE PAGE DRAWS RATHER THAN
     LISTS. The rose is five wedges and five numbers; what a person wants said
     out loud is which is highest, which two are lowest, and what happens to
     the low ones next — so the sentence names them and leaves the other two
     to the chart.

     BOTH FIGURES ARE READ OFF `SCORES` through `qzLow`, the same call the
     page's own closing section makes. Written out as "Composure (84) and
     Coaching (38)" this would be the fourth place those numbers appear and
     the first one that could disagree with the chart above it.

     ONLY THE LOWEST IS NAMED, not both of the two lowest: the closing section
     names the pair with their chapters, and naming them here as well put
     "coaching" in the same sentence twice and took the line to 37 words. 28
     is the ceiling — see the head of this block. */
  result: () => {
    const lo = qzLow(1)[0];
    const hi = SCORES.slice().sort((a,b) => b[1] - a[1])[0];
    return `${hi[0]} at ${hi[1]} is your strongest band, ${lo[0].toLowerCase()} at ${lo[1]} `
      + `your weakest. An agent pushes hardest on the two lowest, and both have a chapter `
      + `on the course.`;
  },

  /* THIS ONE HAD NO FACTS IN IT AT ALL. "Every interview you've had and
     every one booked. This is the only thing that sets or changes your
     level, and each finished one links to its report." — a caption, a
     policy statement and a pointer at a link, on a page whose description
     and whose plate both already said the policy. What a person wants off
     this page is how many interviews there have been, when, and whether one
     is owed. Staged, because the answer is different five times. */
  interviews: f => {
    if(f.complete) return 'Two interviews on record: 20 August set Explorer &ndash; E3, and 21 November moved you to E4. Both reports are yours to keep.';
    if(f.reinterview) return 'One interview on record, and the re-interview still to book. Whoever you pick reads your 90-day summary before the call.';
    if(f.booked) return 'One interview booked, 20 August with Priya Nair. Nothing to do before it &mdash; the level and the report both come out of those 45 minutes.';
    if(f.pred) return 'Nothing on record yet. One 45-minute conversation is what sets your level, and three agents have a slot this week.';
    return 'One on record: 20 August with Priya, which set Explorer &ndash; E3. A re-interview at the end of the 90 days is what moves the level.';
  },

  agents: 'Three agents assess at your level and have a slot this week &mdash; Priya $95, Owen $85, Lena $80. Same 45 minutes whoever you pick.',

  /* `a.slot` IS A DATA STRING, NOT A CLAUSE. It is drawn on the agent card
     as "Thu, Aug 20 · 6:30 PM", which is right in a card and wrong inside a
     sentence — a middot mid-prose reads as a break in the sentence. The
     separator becomes "at" here and nowhere else, so the card keeps its own
     drawing. Same reason `a.r` gains its denominator: "rates 4.8" is a
     figure read out, "4.8 out of 5" is a figure a person can use. */
  agent: () => {
    const a = AGENTS[S.agent || 'priya'];
    return `${a.n} assesses ${a.range} and has run ${a.ivs} interviews, rated ${a.r.toFixed(1)} out of 5. ${a.price} for 45 minutes, next free ${_slot(a.slot)}.`;
  },

  /* ai7.js replaces this one — see the note there for why it says nothing
     about the booking itself. Kept in step so the two cannot read as two
     different writers if the override ever goes. */
  booking: 'Nothing to prepare and nothing to bring &mdash; Thursday is a conversation, not a test. It is recorded, and your report follows within 48 hours.',

  /* THE COURSE'S SHAPE MOVED TO THE PAGE DESCRIPTION — "90 days · 13
     chapters · a cohort of ten" — because it is a factual spine and this
     summary was saying it word for word underneath. What is left is the
     part a description cannot carry: the commitment. */
  enrol: '$595 once, no subscription. About an hour a week plus the weekly call, and you start with the next cohort &mdash; within two weeks of paying.',

  payment: 'One charge of $595 and the 90 days are yours &mdash; nothing renews and there is nothing to cancel. Your cohort is assigned as soon as it clears.',

  /* --- the 90 days --------------------------------------------------- */

  /* PARKED, BOTH OF THEM — `placePageSummary` bails on the LightspeedVT
     frame, so nothing below is on screen today. Kept correct anyway, because
     the moment a chapter shell renders outside the iframe these are the
     copy, and the old pair had a bug that would have shipped with it: at day
     90 they said "13 of 13 chapters done, and chapter 13 is open", and at
     `promoted` "13 of 13 done, and chapter 1, Why We Exist, is open". A page
     cannot have everything finished and something open. The trailing "45 to
     70 minutes each and one unlocks a week" went for its own reason — the
     same clause on all four stages, still being explained on day 90. */
  coursework: f => {
    const cur = CH[f.open];
    if(f.done >= 13) return `All 13 chapters finished at ${f.avg}%. Nothing left to unlock &mdash; the re-interview is what turns the record into a level.`;
    if(!f.done) return `None of the 13 finished yet${cur ? `, and chapter ${f.open + 1}, ${cur[0]}, is open` : ''}. They&rsquo;re 45 to 70 minutes each and one unlocks a week.`;
    return `${f.done} of 13 chapters done at ${f.avg}%${cur ? `, and chapter ${f.open + 1}, ${cur[0]}, is open &mdash; ${cur[1]} minutes` : ''}. One more unlocks each week.`;
  },

  chapter: () => {
    const i = cfg(S.stage).open, cur = CH[i];
    return `${cur ? `Chapter ${i + 1}, ${cur[0]} &mdash; ${cur[1]} minutes.` : 'You&rsquo;re inside a chapter.'} Video, reading, a roleplay, then an assessment &mdash; only the assessment counts towards your average.`;
  },

  transcript: f => f.done
    ? `${f.done} of 13 chapters at ${f.avg}%, about ${_hrs(f.mins)} hours in. This is the record an agent reads before your re-interview.`
    : 'Nothing on the record yet &mdash; the 90 days only started this week.',

  /* THE PAGE DESCRIPTION HELD THE SAME SENTENCE ("Points, badges and rank
     come from your activity across the course and the community") and is now
     the figure row, so this opens on the figures and closes on the one thing
     a person actually wants to know about points, which is whether they
     count for anything. That last clause repeats across all four stages on
     purpose: it is the answer to the only question this page raises. */
  rewards: () => {
    const g = GAME[S.stage];
    if(!g) return 'Points start when you enroll &mdash; 10 for signing in, 25 a chapter, Bronze at 2,500. None of it affects your level.';
    const toB = 2500 - g.pts;
    return `${_n(g.pts)} points at ${RANKS[g.rank - 1].n}, ${toB > 0
      ? `${_n(toB)} short of the Bronze badge at 2,500`
      : `with Bronze earned and Silver at 5,000`}. Points come from signing in, chapters and cohort posts &mdash; none of it touches your level.`;
  },

  /* "Ten of you at E3 with Priya leading, week 5 of 13" was the page
     description verbatim. The description keeps it; this keeps the call,
     which is the thing on the page that has a date on it. */
  cohort: 'Thursday&rsquo;s call is at 6:00 PM ET on hard conversations, and Priya has asked everyone to bring a real one to talk through.',

  /* PARKED — `.msg-page` is excluded, for the reason written at the pass
     below. Trimmed to match the rule anyway: the policy sentence about what
     Priya can see belongs on Profile, and paraphrasing the last bubble is
     summarising something two inches away. */
  messages: 'Priya can see your chapters, scores and attendance already, so you never have to explain where you are.',

  /* --- account and money ------------------------------------------------- */

  /* WHAT THE OLD LINE GOT WRONG, TWICE. "No card is kept on file" — `S.cards`
     holds a Visa and this page draws it under a heading that says so, three
     sections down. And "each row downloads its receipt" is a caption for a
     button. A total and a count is what a person opens Payments for; the
     rows are the itemisation. Counted from the same conditions `V.billing`
     pushes them on, so the two cannot disagree. */
  billing: f => {
    const paid = [];
    if(f.enrolled || f.complete) paid.push(595);
    if(!f.pred) paid.push(95);
    if(f.booked) paid.push(95);
    paid.push(490);
    const t = `$${_n(paid.reduce((a, b) => a + b, 0))}`;
    return paid.length === 1
      ? `One payment, ${t}, and it was a single charge &mdash; nothing here renews.`
      : `${_W(paid.length)} payments, ${t} in total, every one of them a single charge. Nothing here renews.`;
  },

  /* The page description said "Your details, your preferences, and what Tal
     is allowed to do" and this said the same three nouns back. The
     description is gone and this says the one thing worth opening the page
     for, which on an AI-native product is the permissions. */
  account: 'Everything here saves as you go. The block worth a look is the last one &mdash; what I&rsquo;m allowed to remember, and what I can do without asking.',

  /* --- Tal's own pages --------------------------------------------------- */
  mem: () => {
    const live = MEMO.length - ((S.memDrop || []).length);
    return `${_W(live)} things I&rsquo;ve learned about you, each traced back to where it came from. Mark anything wrong and I&rsquo;ll stop using it.`;
  },

  rp: 'Rehearse a hard conversation before you have it for real. I play the other person, briefed from your interview &mdash; nothing is recorded or scored.',

  /* The date, the length and the outcome are the page description's `·` row
     directly above, so naming them again was the duplication this rewrite
     is about. What is left is the two things the row cannot say. */
  ivt: () => {
    const iv = IVT[S.iv === 're' ? 're' : 'level'];
    return `Searchable and tagged by topic, all ${iv.len} of it. Everything in your report was drawn from here, and the quotes link back to the minute.`;
  },

  /* --- the cohort leader ------------------------------------------------- */
  leadDash: () => {
    const att = lattention(), pend = lpending();
    const bad = att.filter(x => x.m.flag.k === 'bad').length;
    /* THE NEXT SESSION LEFT THIS SENTENCE. It was the third clause of three
       and it is the one fact on the page that has its own card with its own
       time on it — so the summary was spending a third of itself on the
       thing hardest to miss. What is left is the two things that are only
       findable by reading, and the first is first because it blocks other
       people: an unsigned decision is a candidate who cannot enroll. */
    return `${_W(pend)} decision${pend === 1 ? '' : 's'} ${pend === 1 ? 'is' : 'are'} waiting on your signature, and nobody in that queue can enroll until you sign. ${_W(att.length)} candidates need a look, ${_w(bad)} of them seriously.`;
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
    return `${_W(up.length)} booked and ${_w(done.length)} already run${nx ? `, ${nx.name} next at ${nx.when.toLowerCase().replace(/^today /, '')} today` : ''}.${due ? ` ${_W(due)} of the finished ones still ${due === 1 ? 'needs' : 'need'} your evaluation before ${due === 1 ? 'that candidate' : 'those candidates'} can enroll.` : ''}`;
  },

  leadEvals: () => {
    const pe = LEAD_EVALS.filter(e => e.status === 'pending');
    const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
    const e0 = pe[0];
    if(!pe.length && !ps.length) return 'Nothing is waiting on your signature &mdash; every level and every summary is signed.';
    return `${pe.length ? `${_W(pe.length)} level decision${pe.length === 1 ? '' : 's'}` : 'No level decisions'} and ${ps.length ? `${_w(ps.length)} 90-day ${ps.length === 1 ? 'summary' : 'summaries'}` : 'no summaries'} waiting on you.${e0 ? ` I&rsquo;ve proposed Explorer &ndash; ${e0.ai} for ${e0.name}, but the level is yours to set.` : ''}`;
  },

  /* THE QUIZ SCORE LEFT THIS ONE. It arrived as a bare third sentence —
     "Their quiz was 64 of 100." — under an analysis that had already said
     the quiz and the interview agree, and above a `.note` on the same page
     whose whole subject is how to read that 64. Three statements of one
     number, and this was the one with nothing to add. */
  leadEval: () => {
    const e = LEAD_EVALS.filter(x => x.id === S.ldrEv)[0] || LEAD_EVALS[0];
    const an = typeof LDR_AN !== 'undefined' ? LDR_AN[e.id] : null;
    if(e.status === 'done')
      return `Signed at Explorer &ndash; ${e.assigned}${e.override ? `, against my proposal of ${e.ai}` : ''}. ${e.name} can enroll now.`;
    return an ? an.sum : e.why;
  },

  leadSum: () => {
    const s = LEAD_SUMMARIES.filter(x => x.id === S.ldrSum)[0] || LEAD_SUMMARIES[0];
    const c = lcoOf(s.cohort);
    const m = lmemOf(c, s.name);
    if(s.status === 'done') return `Published. You recommended: ${s.rec}.`;
    return `${s.name} finished the 90 days at ${m.pc}% with ${m.avg}% on assessments and ${lchDone(m)} of 13 chapters. The recommendation is the part only you can write.`;
  },

  /* The next call was the third sentence and it is a card on the page with
     its own time on it, the same trade as `leadDash`. What is left is the
     roll-up and the one cohort that needs attention. */
  leadCohorts: () => {
    const flagged = lmembers().filter(x => x.m.flag);
    const worst = LEAD_COHORTS.slice().sort((a,b) => (lavg(a,'pc') - lpace(a)) - (lavg(b,'pc') - lpace(b)))[0];
    return `Cohort ${worst.id} is ${lpace(worst) - lavg(worst,'pc')} points behind pace, the widest gap of the ${_w(LEAD_COHORTS.length)}. ${flagged.length} of the ${lmembers().length} candidates are flagged, and every cohort has its call this week.`;
  },

  /* "10 candidates at Explorer – E3, week 5 of 13" was the page description
     word for word, and dropping it took a three-sentence paragraph down to
     two without losing a fact. THE GAP ALSO READ WRONG: `gap >= 0` printed
     "0 ahead" when a cohort was exactly on pace, which is not a thing
     anybody says. */
  leadCohort: () => {
    const c = lcoOf(S.ldrCo);
    const gap = lavg(c,'pc') - lpace(c);
    const bad = c.members.filter(m => m.flag && m.flag.k === 'bad').length;
    return `Averaging ${lavg(c,'pc')}% against ${lpace(c)}% expected &mdash; ${gap === 0 ? 'exactly on pace' : gap > 0 ? `${gap} points ahead` : `${Math.abs(gap)} points behind`} &mdash; with assessments at ${lavg(c,'avg')}%. ${bad ? `${_W(bad)} candidate${bad === 1 ? '' : 's'} ${bad === 1 ? 'is' : 'are'} at risk.` : 'Nobody is at risk this week.'}`;
  },

  leadMember: () => {
    const c = lcoOf(S.ldrCo);
    const m = lmemOf(c, S.ldrMem);
    return ldrRead(m, c);
  },

  /* "Ordered by distance from expected pace" was a caption for a sort order
     the column headings state, so the finding is the first sentence now. */
  leadReports: () => {
    const sel = S.ldrRep;
    const all = lmembers();
    const rows = sel === 'all' ? all : all.filter(x => x.c.id === +sel);
    const behind = rows.filter(x => x.m.pc - lpace(x.c) <= -5);
    const never = rows.filter(x => x.m.last === 'Never');
    const worst = behind.slice().sort((a,b) => (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c)))[0];
    const where = sel === 'all' ? `of the ${rows.length}` : `of the ${rows.length} in cohort ${sel}`;
    if(!behind.length) return `None ${where} is more than five points behind pace${never.length ? `, though ${_w(never.length)} ${never.length === 1 ? 'has' : 'have'} never signed in` : ''}.`;
    return `${_W(behind.length)} ${where} are five points or more behind pace${never.length ? `, and ${_w(never.length)} ${never.length === 1 ? 'has' : 'have'} never signed in` : ''}.${worst ? ` ${worst.m.name} is furthest back at ${worst.m.pc}%.` : ''}`;
  },

  /* THIS WAS THE CLEAREST CASE OF THE RULE ABOUT THE OTHER PORTAL. It spent
     its first sentence explaining the CANDIDATE'S Cohort page to a leader
     who never sees it, and its second defining what "direct" means. Neither
     is a catch-up and the second is a tab label. What a leader wants off
     Messages is who is waiting, and the one consequence worth a reminder is
     that a board post is public to the cohort. */
  leadMessages: () => {
    const waiting = LDR_THREADS.filter(t => t.msgs[t.msgs.length - 1].me === 0).length;
    const co = lcoOf(S.ldrBoardCo);
    return `${waiting ? `${_W(waiting)} direct thread${waiting === 1 ? '' : 's'} ${waiting === 1 ? 'is' : 'are'} waiting on a reply` : 'Nothing is waiting on a reply'}. Anything you post to ${lname(co)}&rsquo;s board, all ${_w(co.members.length)} of them see.`;
  },

  leadCerts: () => `${_W(LDR_CERTS.length)} earned and one in progress, off eight cohorts led and 62 interviews run. Candidate Mentoring is the open one, and it opens the Builder band.`,

  leadProfile: 'Your listing is what candidates read when they choose you. The bio and photo are yours to write; the assessing range comes from your certifications.'
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
   AND IT TYPES ITSELF

   The summary is the one line on the page that is WRITTEN RATHER THAN
   STORED — it is Tal's reading of where you are, assembled from `S` at the
   moment you arrive. Printed whole it looks like a caption that was always
   there; typed, it reads as something being said to you now, which is what
   it is. That is the whole of the argument, and it is why this animates the
   summary and nothing else at the head of a page.

   THE HEIGHT IS RESERVED BEFORE THE FIRST CHARACTER. A typewriter that
   simply appends text grows its own box, and this box is at the top of the
   page with the whole page under it — two lines arriving one at a time
   would shove the page down 26px mid-read, and on the dashboard the
   `.stp-wing` beside it re-centres as it goes. So the paragraph is drawn
   TWICE: `.tsum-g` is the finished line, `visibility:hidden`, holding the
   final box open, and `.tsum-t` is the visible copy laid over it,
   absolutely positioned, filling in. §52 owns those two rules. Both are
   built from the same `innerHTML`, so they wrap identically and the typed
   text lands exactly where the finished text will be.

   THE GREETING DOES NOT TYPE, WHERE THERE IS ONE. `<span class="tal-greet">`
   is not part of the sentence — §33.9 sets it at 22px and hides the page's own
   `.ph` when it is present, so it IS the page's title, and no other page's
   `<h1>` types itself in. Its text nodes are filled before the clock starts;
   the sentence under it is what animates. The test is `closest()` rather than a
   node count, so a second block-level span in the same paragraph gets the
   same answer without an edit here.

   NO SUMMARY IN THIS BUILD CARRIES ONE ANY MORE — the note over `PAGESUM`'s
   `dashboard` block is where that is written down: §56's two-column band puts
   the title and the fact row above Tal, so the eight dashboards greet you from
   their `.ph` like every other page. `SUM_LEAVE` stays because the shape does:
   `dsTypeSummary` is the same twelve lines in the design system, and
   `tn-agent-portal.html` still opens its dashboard with a greeting.

   ONE RUN PER ARRIVAL, and `sumKey` is what decides what an arrival is —
   the portal, the view, the stage, AND THE TEXT. The first three are the
   page; the text is there because a detail page keeps its view name while
   its subject changes (`S.ldrMem`, `S.ldrCo`), and because a summary that
   has genuinely changed under you — a booking made, a stage advanced — is a
   new reading and reads better re-typed than silently swapped. A re-render
   that leaves the sentence alone does not re-type: it prints instantly,
   which is why every other interaction on the page is unaffected.

   AND IT SURVIVES A RE-RENDER MID-RUN. `render()` replaces
   `device.innerHTML`, so the nodes this is writing into are thrown away by
   any interaction — and at boot by the two passes after this one, each of
   which ends with its own `render()` (trap 8). Resuming from `_sumAt`
   rather than restarting is what stops those three synchronous boot renders
   from showing the line three times from zero; the generation counter is
   what stops the abandoned rAF loops from writing into detached nodes.

   `setTimeout` AND NOT `requestAnimationFrame`, WHICH IS THE ONE THING HERE
   THAT WAS FOUND RATHER THAN CHOSEN. rAF is the right scheduler for anything
   that has to agree with the compositor, and it is the wrong one for this:
   a hidden document does not get frames AT ALL, so the first version left
   the summary showing nothing but the greeting — indefinitely — in any tab
   that was not at the front when the page booted, which includes the preview
   pane this was verified in. `setTimeout` is throttled in the background
   rather than stopped, and because every tick derives what to show from the
   ELAPSED TIME rather than from a counter, a throttled tick simply arrives
   with more characters to reveal. Worst case in a background tab the line
   lands whole in one step, which is the correct answer for a page nobody is
   looking at. `SUM_STEP` at 16ms is a frame's worth, so on screen it is
   indistinguishable from the rAF version.

   `reduce()` (ai4) is the same helper the ask transitions use. Under it the
   line prints whole, immediately — a two-second reveal is exactly the kind
   of motion that setting is asking us not to make.
   -------------------------------------------------------------------------- */
/* THE PACE, AND IT IS A BUDGET RATHER THAN A RATE. `SUM_MS` is what a whole
   line may take and the per-character interval is derived from it, so a
   28-word summary and an 18-word one both finish in about the same time —
   which is what makes the effect read as one consistent habit of Tal's
   rather than as a page-by-page delay.

   3400ms, AND IT GOT THERE IN TWO STEPS FROM 1500 — BY EYE, WHICH IS THE
   ONLY WAY TO SET THIS. The first version divided 1500ms across the line: at
   the ~150 characters these summaries run to that is 10ms each, and 10ms
   reads as the sentence APPEARING rather than as being written, which is the
   whole point of doing it at all. 2300 was better and still hurried. At 3400
   the interval lands near 22ms and the line reads as somebody typing it,
   which is what was asked for both times.

   THE NUMBER TO CHANGE IS THIS ONE, and the floor and the ceiling only guard
   the division. Measured across all 128 summaries the build actually draws:
   the longest is 192 characters and prices at 17.7ms, so `SUM_MS` alone sets
   the pace for the body of the table; the shortest is 63 (`transcript`) and
   would crawl at 54ms a character, so the 34ms ceiling catches it and it
   lands in 2.1s instead of 3.4. `SUM_MIN` is never reached today — it is
   there for a summary longer than about 240 characters, which the 18-28 word
   rule in `PAGESUM`'s own note is supposed to prevent. */
const SUM_LEAVE = '.tal-greet';   /* filled before the clock starts */
const SUM_MS    = 3400;           /* the longest a whole line may take */
const SUM_MIN   = 14;             /* ms per character, floor */
const SUM_MAX   = 34;             /* ms per character, ceiling */
const SUM_STEP  = 16;             /* ms between ticks — see below */

let SUM_GEN  = 0;      /* invalidates the rAF loop of every earlier run */
let SUM_KEY  = null;   /* the arrival the current run belongs to */
let SUM_AT   = 0;      /* characters revealed, so a re-render can resume */
let SUM_DONE = false;

const sumKey = (text) =>
  (S.portal || 'candidate') + '/' + S.view + '/' + S.stage + '/' + text;

/* every text node under `root`, in reading order */
function sumRuns(root){
  const out = [];
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for(let n = w.nextNode(); n; n = w.nextNode()){
    if(!n.nodeValue) continue;
    if(n.parentElement && n.parentElement.closest(SUM_LEAVE)) continue;
    out.push([n, n.nodeValue]);
  }
  return out;
}

/* A PAGE WITH NO SUMMARY CLEARS THE KEY, and forgetting this was a real bug
   rather than a tidiness point. Eight pages get no summary at all — Messages,
   the courseware frame, the ask thread, the auth screens — and on those the
   pass returns before it ever reaches the typer. With the key left standing,
   `dashboard → messages → dashboard` came back to a key that had not changed
   and printed the line instantly: you left the page and returned, which is an
   arrival by any reading, and the one case where nothing typed. Clearing here
   makes the next summary that appears a new arrival whatever you did in
   between. It is also what makes `starter.html`'s three-page skeleton behave,
   where two of the three pages have no head band at all. */
function sumIdle(){ SUM_KEY = null; SUM_AT = 0; SUM_DONE = false; }

function typeSummary(p){
  /* THE SOURCE IS THE GHOST WHEN THERE IS ONE. After a run the paragraph's
     `innerHTML` is no longer the sentence — it is the ghost and the overlay —
     so reading it back would wrap the pair in a second pair, and it would also
     make the key a function of the previous run's markup rather than of the
     words. `placeSummaryPass` rebuilds the paragraph from `PAGESUM` one
     statement before calling this, so the portal cannot reach that state; the
     design system's port of this can, and does (`gallery.html`'s replay types
     the same element again with no render in between). Both are written the
     same way so the two stay one component. */
  const prior = p.querySelector(':scope > .tsum-g');
  const html  = prior ? prior.innerHTML : p.innerHTML;

  const key = sumKey(html);
  if(key !== SUM_KEY){ SUM_KEY = key; SUM_AT = 0; SUM_DONE = false; }
  if(SUM_DONE || reduce()){ SUM_DONE = true; return; }

  const gen = ++SUM_GEN;

  const ghost = document.createElement('span');
  ghost.className = 'tsum-g';
  ghost.setAttribute('aria-hidden', 'true');
  ghost.innerHTML = html;

  const live = document.createElement('span');
  live.className = 'tsum-t';
  live.innerHTML = html;

  p.innerHTML = '';
  p.classList.add('tsum');
  p.appendChild(ghost);
  p.appendChild(live);

  const runs  = sumRuns(live);
  const total = runs.reduce((a, r) => a + r[1].length, 0);
  if(!total){ SUM_DONE = true; return; }

  /* THE CARET CONTRIBUTES NO WIDTH. It is 2px with a -3px right margin, so
     its inline advance is zero and it can never be the character that wraps
     a line — which would put the visible copy one line taller than the box
     the ghost is holding open. §52 states the geometry; this is only why. */
  const caret = document.createElement('span');
  caret.className = 'tsum-c';
  caret.setAttribute('aria-hidden', 'true');

  const per = Math.max(SUM_MIN, Math.min(SUM_MAX, SUM_MS / total));
  const t0  = performance.now() - SUM_AT * per;

  (function tick(now){
    if(gen !== SUM_GEN || !live.isConnected) return;
    const shown = Math.max(0, Math.min(total, Math.round((now - t0) / per)));
    SUM_AT = shown;

    /* `host` is the first run that is not finished — the run the caret is
       sitting in. Null means the line is whole. */
    let left = shown, host = null;
    for(const [n, s] of runs){
      const k = Math.min(left, s.length);
      n.nodeValue = s.slice(0, k);
      left -= k;
      if(host === null && k < s.length) host = n;
    }

    if(host){
      if(host.nextSibling !== caret) host.parentNode.insertBefore(caret, host.nextSibling);
      setTimeout(() => tick(performance.now()), SUM_STEP);
    } else {
      caret.remove();
      SUM_DONE = true;
    }
  })(performance.now());
}

/* --------------------------------------------------------------------------
   THE PASS

   TWO FUNCTIONS RATHER THAN ONE, AND ONLY TO GET THE BAIL PATH RIGHT. The pass
   below has eight early returns — the ask thread, the auth screens, the
   courseware frame, both Messages surfaces, a page with no `.main`, a view
   with no `PAGESUM` row — and every one of them means "this page has no
   summary", which is exactly when the typer's key has to be cleared. Doing
   that at eight `return` sites is eight places to forget it, and the one that
   was forgotten is the one that would go unnoticed. So the pass keeps its
   plain returns and says so by returning nothing; the wrapper reads that as
   idle. The successful path ends `return true`, which is the only signal
   either function needs.
   -------------------------------------------------------------------------- */
function placePageSummary(){
  if(placeSummaryPass() !== true) sumIdle();
}

function placeSummaryPass(){
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;
  const page = main.querySelector('.page');
  if(!page) return;
  /* the ask thread and the sign-up screens are not modules and Tal does not
     summarise them — same two exclusions `placeBand` makes, for the same
     reasons, written down there */
  if(page.classList.contains('ask-page')) return;
  if(page.closest('.auth-card')) return;

  /* AND NEITHER IS THE COURSEWARE. `coursework` and `chapter` render one empty
     slot for the LightspeedVT iframe and nothing else — see the note over
     `lsvtFrame` in views.js: the whole module is somebody else's interface, so
     anything we draw here is a second set of chrome around a screen that has
     its own. That note lists `placeBand` (ai5) and `placeAI` (ai2) as bailing
     of their own accord because both need a `.ph` to hang off; this pass does
     NOT need one — the branch below BUILDS a `.modhead` when there is no band —
     so it put a Tal card above the frame that nothing else in the module would
     have. It is the one pass that has to be told.

     Tested on the slot rather than on the two view names, for the reason the
     composer exclusion in ai4 gives: the condition is "this page is a frame we
     do not own", and a third view that embeds one would want the same answer
     without having to be added to a list. `PAGESUM.coursework` and
     `PAGESUM.chapter` stay where they are, unreached, alongside `PARKED` in
     views.js — they are the copy for whatever turns out to live outside the
     frame once the LightspeedVT screens are confirmed. */
  if(page.querySelector(':scope > .lsvt-slot')) return;

  /* AND NEITHER IS THE CONVERSATION WITH PRIYA. Every other page in the product
     is a set of blocks that a reader has to be told the shape of; this one is a
     thread, and the last message in it — visible, two inches below — IS the
     summary. Tal's `messages` entry said Priya can see your chapters and that
     her last message asked for the vendor review example: the first half is a
     policy statement that belongs on the account page, and the second is a
     paraphrase of a bubble already on screen.

     It also cost the thread real height, on the one page in the product whose
     footer has to be reachable without scrolling (§37.7): the band took ~116px
     off a box that the composer sits at the bottom of.

     `.msg-page` is the candidate's Messages and nothing else — the leader's
     Messages is a list of threads, not a thread — so the class is the whole
     test. `PAGESUM.messages` stays where it is, unreached, for the same reason
     the courseware's entries do. */
  if(page.classList.contains('msg-page')) return;

  /* AND NEITHER IS THE LEADER'S MESSAGES MODULE, `msg-mod`, for the argument
     above plus one of its own. Both of its tabs are a conversation — a cohort
     board or a one-to-one — so the last thing said is the summary either way;
     and the Direct tab is a two-column inbox whose right-hand column has to
     fit the frame with its composer at the foot, which is the height the band
     was taking. A separate class rather than reusing `.msg-page` because that
     class also carries the candidate page's own flex layout (§16, §37.7), and
     this page is a tab strip over two surfaces, not one thread. */
  if(page.classList.contains('msg-mod')) return;

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

  /* 1b. AND A CHIP WITH NO CARD AROUND IT LEAVES THE PAGE ENTIRELY.
     `askChip` was used two ways. Inside a Tal card it is Tal's own suggested
     next question and it belongs there — the card says who is asking. Dropped
     straight into page flow (`<div class="mt5">${askChip(…)}</div>` on the
     report, the clip list, the cohort card) it is a lone pill in the middle of
     a column of prose: nothing says it is Tal's, nothing says why it is there,
     and the ask bar at the foot of the frame is the standing answer to
     "anything else?" on every page in the product. Two invitations to ask,
     the floating one quieter and less explicable than the docked one.

     THE TEST IS "IS IT IN SOMETHING THAT IS TAL'S" — the aura card, the panel,
     the thread, a sheet, or the band this pass has just built. Anything else
     is page flow. The empty wrapper goes with it, because `.mt5` on a div with
     nothing left in it is 24px of space nobody can see the reason for.
     `.chip-tal` is also what the Tal panel's suggestions and the thread's
     follow-ups are made of, which is why the closest() list is the guard
     rather than a blanket removal. */
  page.querySelectorAll('.chip-tal').forEach(chip => {
    if(chip.closest('.ai-aura, .tal-panel, .ask-page, .sheet, .modhead, .ai-asks, .ai-foot')) return;
    const host = chip.parentElement;
    chip.remove();
    if(host && host !== page && !host.children.length && !host.textContent.trim()) host.remove();
  });

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

  /* 5. AND TAL SAYS IT RATHER THAN HAVING SAID IT.
     Last, after the flag: `typeSummary` splits the paragraph into a hidden
     ghost and a visible copy, and §52's rules are all gated on `.talsum`
     being there. It is also after the class removals above because those
     read the card, not the paragraph, and this is the only step that leaves
     the paragraph in a shape nothing else in the build expects — so it is
     the last thing that happens to this card. */
  const para = body.querySelector(':scope > p');
  if(!para) return;
  typeSummary(para);
  return true;   /* read by placePageSummary — see the note above it */
}

const _baseSum = render;
render = function(){
  _baseSum();
  try { placePageSummary(); } catch(e){ console.warn('pagesum', e); }
};

/* the boot render is the last statement in views.js and ran long before this
   file was parsed, so this pass has to draw the first paint itself */
render();
