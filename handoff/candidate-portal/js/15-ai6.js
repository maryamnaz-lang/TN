const _hrs = m => Math.round(m / 60);
const _n = x => x.toLocaleString('en-US');
const _an = n => /^(8|11|18)/.test(String(n)) ? 'an' : 'a';
const _WORDS = ['no','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
const _DAYW = {Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
const _MONW = {Jan:'January',Feb:'February',Mar:'March',Apr:'April',May:'May',Jun:'June',
               Jul:'July',Aug:'August',Sep:'September',Oct:'October',Nov:'November',Dec:'December'};
const _slot = s => {
  const m = /^(\w{3}), (\w{3}) (\d+)\s*(?:&middot;|\u00b7)\s*(.+)$/.exec(String(s || ''));
  return m ? `${_DAYW[m[1]] || m[1]} ${m[3]} ${_MONW[m[2]] || m[2]} at ${m[4]}` : s;
};
const _w = n => n >= 0 && n <= 12 ? _WORDS[n] : _n(n);
const _W = n => { const s = _w(n); return s.charAt(0).toUpperCase() + s.slice(1); };

const _greet = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

const PAGESUM = {

  dashboard: {
    consult: 'Your quiz put you on the Explorer track from a score of 64. Jordan Blake calls on Thursday at 2:00 PM ET for fifteen minutes. Nothing to prepare, and it doesn&rsquo;t set your level.',

    new: () => {
      const said = (S.obReady && S.ob && S.ob.why)
        ? 'You told me &ldquo;<b>' + obLabel('why') + '</b>&rdquo;, so I have gone through the active roster and '
        : 'Considering your strengths I have analyzed the active roster and ';
      return 'Welcome Back, Maryam! Based on your <b data-sum="quiz">quiz results</b>, you are currently on <b data-sum="track">Explorer track</b>. Your level from E1 - E5 anchors after a 45-minute interview. '
        + said + '<b data-sum="match">matched you with ' + AGENTS[recKey()].n + ' below</b> to specifically anchor your growth areas.';
    },

    booked: 'Welcome back, Maryam! Your <b data-sum="interview">levelling interview with Priya Nair</b> is confirmed for Thursday, August 20 at 6:30 PM ET (45 minutes, video-recorded). My analysis of Priya&rsquo;s historical evaluation patterns shows a heavy emphasis on delegation frameworks. Since your initial quiz score placed you on the <b data-sum="track">Explorer track</b>, spending just <b data-sum="prep">10 minutes practising your delegation talking points</b> before Thursday is your best strategy to secure an optimal levelling outcome.',
    resched: 'Welcome back, Maryam! Your <b data-sum="interview">levelling interview with Priya Nair</b> is confirmed for Thursday, August 20 at 6:30 PM ET (45 minutes, video-recorded). My analysis of Priya&rsquo;s historical evaluation patterns shows a heavy emphasis on delegation frameworks. Since your initial quiz score placed you on the <b data-sum="track">Explorer track</b>, spending just <b data-sum="prep">10 minutes practising your delegation talking points</b> before Thursday is your best strategy to secure an optimal levelling outcome.',

    held: () => (typeof heldOverdue === 'function' && heldOverdue())
      ? 'Your interview result is taking a little longer than usual. We will have it to you shortly.'
      : 'Your interview with Priya Nair is done. It is being analysed now, and TalentNext sets your level from it within <b>24 hours</b>. There is nothing to do but wait.',

    assessed: 'Welcome Back, Maryam! You are <b data-sum="level">Explorer &ndash; E3</b>, rung 3 of 15, set by TalentNext on 21 August after your interview, with <b data-sum="growth">delegation and hard conversations</b> as your growth areas. <b data-sum="enrol">Enrolling</b> is the only thing left.',

    enrolPre: 'You are enrolled on <b>Cohort 41</b>, led by <b>Priya Nair</b>. It starts in 6 days. You can <b>read the course outline</b> and meet your cohort now; the chapters, Course Progress and Achievements open on the start day.',

    cancelled: 'Your cohort was cancelled, and you have been moved to <b>Cohort 47</b>, which starts on 12 Mar 2026. Your place and your payment carried over, so there is nothing to pay again.',

    rebook: 'Your interview with <b>Priya Nair</b> could not take place. You have a <b>free rebooking</b> with 14 days left to use it, so book another interview whenever you are ready.',

    week1: f => `${_greet()}, Maryam! <b>Chapter 1 (&lsquo;${CH[0][0]}&rsquo;)</b> has unlocked today. This week has no graded assessments, so you have a buffer window to explore.<br>Right now, <b>four of the ten in your cohort</b> have already finished it. It takes about ${CH[0][1]} minutes, so starting today puts your <b>${WEEK_TARGET}-minute weekly target</b> within reach without touching next week.`,

    day34: f => `${_greet()}, Maryam! You are <b>${f.done} of 13 chapters</b> in at ${f.avg}%, ${_n(f.mins)} minutes on the course so far. <b>Chapter ${f.open + 1} (&lsquo;${CH[f.open][0]}&rsquo;)</b> has been opened four times without finishing, and the three furthest ahead in Cohort 41 had it done by now.<br>It is ${CH[f.open][1]} minutes of work. Clearing it this week is what puts you back on the <b>${WEEK_TARGET}-minute weekly target</b> before week ${f.week + 1} adds its own.`,

    reddemo: f => `${_greet()}, Maryam! You are <b>${f.done} of 13 chapters</b> in at ${f.avg}%, ${_n(f.mins)} minutes on the course so far. <b>Chapter ${f.open + 1} (&lsquo;${CH[f.open][0]}&rsquo;)</b> has been opened four times without finishing, and the three furthest ahead in Cohort 41 had it done by now.<br>It is ${CH[f.open][1]} minutes of work. Clearing it this week is what puts you back on the <b>${WEEK_TARGET}-minute weekly target</b> before week ${f.week + 1} adds its own.`,

    day90: f => `${_greet()}, Maryam! <b>All 13 chapters</b> are done in 90 days, ${f.avg}% average, ${_n(f.mins)} minutes total. Your growth areas were <b>chapters 4 and 12</b>, and you passed both.<br>The re-interview is what decides whether your level moves, so I have been over the roster and <b>matched you with ${AGENTS[recKey()].n} below</b>.`,

    promoted: f => `You moved from E3 to E4 in 90 days: 13 chapters, ${f.avg}% average, ${_n(f.mins)} minutes of coursework. At this level you can also volunteer to lead a cohort.`,

    _: 'Where you stand right now, and anything waiting on you today.'
  },

  level: (() => {
    const pre = 'Your <b data-sum="quiz">quiz result</b> places you on the <b data-sum="track">Explorer track</b>, with your level to be determined through a <b data-sum="ivwhat">45-minute interview</b>. The ladder shows your current path across Explorer &rarr; Builder &rarr; Trailblazer, with five levels in each track.';
    return {
      consult: pre,
      new: pre,
      booked: 'Your interview is booked for <b data-sum="interview">20 August</b>, but your exact level is still to be determined. Your quiz placed you on the <b data-sum="track">Explorer track (E1&ndash;E5)</b>, and the interview will establish where you land on the ladder.',
      resched: 'Your interview is booked for <b data-sum="interview">20 August</b>, but your exact level is still to be determined. Your quiz placed you on the <b data-sum="track">Explorer track (E1&ndash;E5)</b>, and the interview will establish where you land on the ladder.',
      promoted: 'E4, level 4 of 15, signed on 21 November after your re-interview, one up from where the 90 days started. Another course and re-interview moves it again.',
      _: 'E3, level 3 of 15 on the Explorer track, confirmed by Priya on 21 August. Only a re-interview at the end of a course moves it.'
    };
  })(),

  report: 'Priya&rsquo;s write-up of the 20 August interview, confirming Explorer &ndash; E3. Delegation and hard conversations are the growth areas. Both are chapters on your course.',

  result: 'This is the track from your latest quiz. Your <b>level is set at your interview</b>, not here and not by the quiz.',

  interviews: f => {
    if(f.complete) return 'Two interviews on record: 20 August set Explorer &ndash; E3, and 21 November moved you to E4. Both reports are yours to keep.';
    if(f.reinterview) return 'One interview on record, and the re-interview still to book. Whoever you pick reads your 90-day summary before the call.';
    if(f.booked){
      const c = CALL_ROW.iv();
      const ex = String(c.x || '').split(', assesses ')[0] || 'your';
      const rng = (c.who && c.who.range) || 'E1&ndash;E3';
      return `Your <b data-sum="interview">45-minute interview with ${c.who.n}</b> is scheduled for Thursday, August 20 at 6:30 PM ET. `
        + `She&rsquo;ll assess your ${ex} skills across the ${rng} levels, and your final level `
        + `and report will be based on this conversation.`;
    }
    if(f.pred) return 'You haven&rsquo;t completed an interview yet. Choose from <b data-sum="roster">24 available agents</b> to book a <b data-sum="ivwhat">45-minute conversation</b> and determine your level, with options across different experience areas, ratings, and fees.';
    return 'One on record: 20 August with Priya, which set Explorer &ndash; E3. A re-interview at the end of the 90 days is what moves the level.';
  },




  enrol: 'About an hour a week on the chapter, plus the 60-minute call. People who keep to that finish all 13 and average above 85%.',


  welcome: 'Your place is paid and the cohort is yours for the 90 days. Nothing is due from you until chapter 1 unlocks, and Priya posts to the board before then.',


  coursework: f => {
    const cur = CH[f.open];
    if(f.preStart) return `Your cohort has not started yet${f.startIn>0?`, it begins in ${f.startIn} days`:''}. This is the full outline of the thirteen chapters; they unlock in LightSpeed VT on the start day, one a week.`;
    if(f.done >= 13) return `All 13 chapters finished at ${f.avg}%. Nothing left to unlock. The re-interview is what turns the record into a level.`;
    if(!f.done) return `None of the 13 finished yet${cur ? `, and chapter ${f.open + 1}, ${cur[0]}, is open` : ''}. They&rsquo;re 45 to 70 minutes each and one unlocks a week.`;
    return `${f.done} of 13 chapters done at ${f.avg}%${cur ? `, and chapter ${f.open + 1}, ${cur[0]}, is open, ${cur[1]} minutes` : ''}. One more unlocks each week.`;
  },

  chapter: () => {
    const i = cfg(S.stage).open, cur = CH[i];
    return `${cur ? `Chapter ${i + 1}, ${cur[0]}: ${cur[1]} minutes.` : 'You&rsquo;re inside a chapter.'} Video, reading, a roleplay, then an assessment. Only the assessment counts towards your average.`;
  },

  transcript: f => f.complete
    ? `${certsFor(f).slice(-1)[0].cohort} is closed: ${f.done} chapters at ${f.avg}%, about ${_hrs(f.mins)} hours of coursework. Nothing lands on this record again until you enroll at ${f.level}.`
    : f.done
    ? `${f.done} of 13 chapters at ${f.avg}%, about ${_hrs(f.mins)} hours in. This is the record an agent reads before your re-interview.`
    : 'Nothing on the record yet. The 90 days only started this week.',

  rewards: () => {
    const g = GAME[S.stage];
    if(!g) return 'Points start when you enroll: 10 for signing in, 25 a chapter, Bronze at 2,500. None of it affects your level.';
    const toB = 2500 - g.pts;
    return `${_n(g.pts)} points at ${RANKS[g.rank - 1].n}, ${toB > 0
      ? `${_n(toB)} short of the Bronze badge at 2,500`
      : `with Bronze earned and Silver at 5,000`}. Points come from signing in, chapters and cohort posts. None of it touches your level.`;
  },

  cohort: (f) => (f.finished || f.complete)
    ? 'Cohort 41 has finished all thirteen weeks with Priya leading. The discussion stays open for the ten of you to keep working through what changed.'
    : f.preStart
    ? `Cohort 41 has not started yet${f.startIn>0?`, it begins in ${f.startIn} days`:''}. The ten of you are listed below with Priya leading; the discussion and the weekly calls open on the start day.`
    : 'Thursday&rsquo;s call is at 6:00 PM ET on hard conversations, and Priya has asked everyone to bring a real one to talk through.',

  messages: 'Priya can see your chapters, scores and attendance already, so you never have to explain where you are.',


  billing: 'Your saved Visa, Mastercard and Amex cards are on file for future payments, with your default set to <b data-sum="defcard">Visa ending 4242</b>. A course and an interview have <b data-sum="refund">different refund windows</b>, and I can state both. Every charge keeps its own receipt in the table below.',

  account: 'Everything here saves as you go. The block worth a look is the last one, what I&rsquo;m allowed to remember, and what I can do without asking.',

  mem: () => {
    const live = MEMO.length - ((S.memDrop || []).length);
    return `${_W(live)} things I&rsquo;ve learned about you, each traced back to where it came from. Mark anything wrong and I&rsquo;ll stop using it.`;
  },

  rp: 'Rehearse a hard conversation before you have it for real. I play the other person, briefed from your interview. Nothing is recorded or scored.',

  ivt: () => {
    const iv = IVT[S.iv === 're' ? 're' : 'level'];
    return `Searchable and tagged by topic, all ${iv.len} of it. Everything in your report was drawn from here, and the quotes link back to the minute.`;
  },

  leadDash: () => {
    const att = lattention(), pend = lpending();
    const bad = att.filter(x => x.m.flag.k === 'bad').length;
    const nx = lcalls()[0];
    const look = `${_W(att.length)} candidate${att.length === 1 ? '' : 's'} need${att.length === 1 ? 's' : ''} a look, ${_w(bad)} of them seriously`;
    if(pend === 0)
      return `Nothing is waiting on your signature. ${look}${nx ? `, and Cohort ${nx.co} meets ${nx.day.toLowerCase()} at ${nx.time}` : ''}.`;
    return `${_W(pend)} 90-day ${pend === 1 ? 'summary is' : 'summaries are'} waiting on your signature, and nothing reaches ${pend === 1 ? 'that candidate&rsquo;s' : 'those candidates&rsquo;'} next agent until you publish. ${look}.`;
  },

  leadCalls: () => {
    const up = lcalls();
    const nx = up[0];
    const run = LEAD_RUN.length;
    const seats = LEAD_RUN.reduce((s,r) => s + lcoOf(r.co).members.length, 0);
    const came = LEAD_RUN.reduce((s,r) => s + r.attended, 0);
    return `${_W(up.length)} calls this week${nx ? `, Cohort ${nx.co} first at ${nx.time.toLowerCase()} ${nx.day.toLowerCase()}` : ''}. ${run ? `Across the ${_w(run)} behind you, ${came} of ${seats} seats were filled. The brief reads from where each cohort actually is.` : 'Your first cohort call is this week.'}`;
  },

  leadEvals: () => {
    const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
    const s0 = ps[0];
    if(!ps.length) return 'Nothing is waiting on your signature. Every 90-day summary is published.';
    const size = _w(lcoOf(s0.cohort).members.length);
    return `${_W(ps.length)} of Cohort ${s0.cohort}&rsquo;s ${size} 90-day summaries ${ps.length === 1 ? 'is' : 'are'} still waiting on you. ${s0.name}&rsquo;s numbers are the argument; the recommendation is the part only you can write.`;
  },

  leadSum: () => {
    const s = LEAD_SUMMARIES.filter(x => x.id === S.ldrSum)[0] || LEAD_SUMMARIES[0];
    const c = lcoOf(s.cohort);
    const m = lmemOf(c, s.name);
    if(s.status === 'done') return `Published. You recommended: ${s.rec}.`;
    return `${s.name} finished the 90 days at ${m.pc}% with ${m.avg}% on assessments and ${lchDone(m)} of 13 chapters. The recommendation is the part only you can write.`;
  },

  leadCohorts: () => {
    const flagged = lmembers().filter(x => x.m.flag);
    const c = LEAD_COHORTS[0];
    const g = lavg(c,'pc') - lpace(c), gp = Math.abs(g);
    const pace = g === 0 ? 'on pace' : `${_w(gp)} point${gp === 1 ? '' : 's'} ${g < 0 ? 'behind' : 'ahead of'} pace`;
    const past = LEAD_PAST.length ? ` Cohort ${LEAD_PAST[0].id} is closed behind you, its last summaries still to sign.` : '';
    return `Cohort ${c.id} is ${pace} in week ${c.week} of 13, and <b>${flagged.length} of its ${lmembers().length} candidates are flagged</b>.${past}`;
  },

  leadCohort: () => {
    const c = lcoOf(S.ldrCo);
    const gap = lavg(c,'pc') - lpace(c);
    const bad = c.members.filter(m => m.flag && m.flag.k === 'bad').length;
    const assess = lassess(c) ? `assessments at ${lassess(c)}%` : 'nothing assessed yet';
    const ga = Math.abs(gap);
    const pace = gap === 0 ? 'exactly on pace' : `${_w(ga)} point${ga === 1 ? '' : 's'} ${gap > 0 ? 'ahead' : 'behind'}`;
    return `Averaging ${lavg(c,'pc')}% against ${lpace(c)}% expected, ${pace}, with ${assess}. ${bad ? `${_W(bad)} candidate${bad === 1 ? '' : 's'} ${bad === 1 ? 'is' : 'are'} at risk.` : 'Nobody is at risk this week.'}`;
  },

  leadMember: () => {
    const c = lcoOf(S.ldrCo);
    const m = lmemOf(c, S.ldrMem);
    return ldrRead(m, c);
  },

  leadReports: () => {
    const sel = S.ldrRep;
    const rows = lallmembers().filter(x => x.c.id === +sel);
    const behind = rows.filter(x => x.m.pc - lpace(x.c) <= -5);
    const never = rows.filter(x => x.m.last === 'Never');
    const worst = behind.slice().sort((a,b) => (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c)))[0];
    const where = `of the ${rows.length} in cohort ${sel}`;
    if(!behind.length) return `None ${where} is more than five points behind pace${never.length ? `, though ${_w(never.length)} ${never.length === 1 ? 'has' : 'have'} never signed in` : ''}.`;
    return `${_W(behind.length)} ${where} are five points or more behind pace${never.length ? `, and ${_w(never.length)} ${never.length === 1 ? 'has' : 'have'} never signed in` : ''}.${worst ? ` ${worst.m.name} is furthest back at ${worst.m.pc}%.` : ''}`;
  },

  leadMessages: () => {
    const waiting = LDR_THREADS.filter(t => t.msgs[t.msgs.length - 1].me === 0).length;
    return `${waiting ? `${_W(waiting)} direct thread${waiting === 1 ? '' : 's'} ${waiting === 1 ? 'is' : 'are'} waiting on a reply` : 'Nothing is waiting on a reply'}, out of ${_w(LDR_THREADS.length)} you have open. Everything here is private to you and the candidate.`;
  },

  leadCerts: () => `${_W(LDR_CERTS.length)} earned and one in progress, off eight cohorts led. Candidate Mentoring is the open one, and it opens the Builder band.`,

  leadProfile: 'Your listing is what candidates read when they choose you. The bio is yours to write, the assessing range comes from your certifications. The rest is the account behind it.'
};

function pageSummary(){
  const e = PAGESUM[S.view];
  const v = (e && typeof e === 'object' && !(typeof e === 'function')) ? (e[S.stage] || e._) : e;
  if(typeof v === 'function'){
    try { return v(cfg(S.stage)) || ''; } catch(err){ console.warn('pagesum copy', S.view, err); return ''; }
  }
  return v || '';
}

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

function sumIdle(){ SUM_KEY = null; SUM_AT = 0; SUM_DONE = false; }

function typeSummary(p){
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

  const caret = document.createElement('span');
  caret.className = 'tsum-c';
  caret.setAttribute('aria-hidden', 'true');

  const per = Math.max(SUM_MIN, Math.min(SUM_MAX, SUM_MS / total));
  const t0  = performance.now() - SUM_AT * per;

  (function tick(now){
    if(gen !== SUM_GEN || !live.isConnected) return;
    const shown = Math.max(0, Math.min(total, Math.round((now - t0) / per)));
    SUM_AT = shown;

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

function placePageSummary(){
  if(placeSummaryPass() !== true) sumIdle();
}

function placeSummaryPass(){
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;
  const page = main.querySelector('.page');
  if(!page) return;
  if(page.classList.contains('ask-page')) return;
  if(page.closest('.auth-card')) return;

  if(page.querySelector(':scope > .lsvt-slot')) return;

  if(page.classList.contains('msg-page')) return;

  if(page.classList.contains('msg-mod')) return;

  if(page.classList.contains('nosum')) return;

  const band = page.querySelector(':scope > .modhead');

  const top = band || page;
  top.querySelectorAll(':scope > .sec.ask-chips').forEach(el => el.remove());
  if(band) band.querySelectorAll('.ai-asks, .ai-foot').forEach(el => el.remove());

  page.querySelectorAll('.chip-tal').forEach(chip => {
    if(chip.closest('.ai-aura, .tal-panel, .ask-page, .sheet, .modhead, .ai-asks, .ai-foot')) return;
    const host = chip.parentElement;
    chip.remove();
    if(host && host !== page && !host.children.length && !host.textContent.trim()) host.remove();
  });

  if(band) band.querySelectorAll('.ai-aura > .ai-head > .ai-do, .ai-aura > .ai-head > .btn-p, .ai-aura > .ai-head > .btn').forEach(el => el.remove());

  const text = pageSummary();
  if(!text) return;

  let aura = band ? band.querySelector('.ai-aura') : null;
  if(!aura){
    const sec = document.createElement('div');
    sec.className = 'sec';
    sec.innerHTML = '<div class="ai-aura tile tight">' +
      '<div class="ai-head"><span class="ai-label">Tal</span></div>' +
      '<div class="ai-body"><p></p></div></div>';
    aura = sec.querySelector('.ai-aura');

    if(band){
      const ph = band.querySelector(':scope > .ph');
      if(ph) ph.insertAdjacentElement('afterend', sec);
      else band.appendChild(sec);
    } else {
      const nb = document.createElement('div');
      nb.className = 'modhead';
      nb.appendChild(sec);
      const crumb = page.querySelector(':scope > .crumb');
      if(crumb) crumb.insertAdjacentElement('afterend', nb);
      else page.insertBefore(nb, page.firstChild);
    }
  }

  const head = aura.querySelector(':scope > .ai-head');
  if(head) head.querySelectorAll('h3').forEach(h => h.remove());

  const lab = head && head.querySelector(':scope > .ai-label');
  if(lab && lab.textContent.trim() === 'Tal') lab.textContent = 'Summary by Tal';
  if(lab && !lab.querySelector(':scope > .borb')){
    lab.insertAdjacentHTML('afterbegin', borbMark('tal-mk'));
  }

  let body = aura.querySelector(':scope > .ai-body');
  if(!body){
    body = document.createElement('div');
    body.className = 'ai-body';
    aura.appendChild(body);
  }
  body.innerHTML = '<p>' + text + '</p>';

  aura.classList.remove('ai-clickable', 'ai-act-top');
  aura.removeAttribute('data-tal-ask');
  aura.removeAttribute('role');
  aura.removeAttribute('tabindex');
  aura.removeAttribute('aria-label');

  aura.classList.add('talsum');

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

const _sumTop = () => SCORES.slice().sort((a,b) => b[1] - a[1])[0];

const _bookedAct = () => {
  const f = (typeof cfg === 'function' ? cfg(S.stage) : null) || {};
  if(f.pred && !f.booked && !S.booking){
    const k = recKey();
    return {ic: I.calendar, go: 'agent:' + k, t: 'Book your interview with ' + AGENTS[k].n};
  }
  if(S.view === 'interviews') return {ic: I.calendar, go: 'booking', t: 'See the booking details'};
  return f.booked || S.booking
    ? {ic: I.calendar, go: 'interviews', t: 'See the booking'}
    : {ic: I.document, go: 'interviews', t: 'See your interviews'};
};

const SUMDROP = {
  quiz: () => {
    const [hiN, hiV] = _sumTop();
    const low = qzLow(2);
    return {
      lead: `You scored 64 of 100 on the Next in Leadership quiz on ${qzTaken()}, across five bands.`,
      label: 'What it measured:',
      read: `${hiN} came out highest at ${hiV}, and ${low[0][0]} lowest at ${low[0][1]}. A quiz sets the track, not the level. It is the interview that decides which of E1 to E5 you sit on.`,
      next: 'Open the full breakdown to see all five bands scored, and the two chapters built on the ones you scored lowest.'
    };
  },

  track: () => ({
    lead: 'According to the Next in leadership quiz, you are evaluated as an Explorer.',
    label: 'Discovering your direction:',
    read: 'You&rsquo;re exploring what fits you best, and that&rsquo;s a strength. Stay curious, ask questions, and keep trying new experiences.',
    next: 'Connect with Talent Next Agent to get yourself evaluated and get a level. Your level anchors after a 45-minute interview.',
    act: _bookedAct()
  }),

  match: () => {
    const k = recKey(), a = AGENTS[k], r = REC[k];
    return {
      lead: `${a.n} assesses ${a.range} and has run ${a.ivs} interviews, rated ${a.r.toFixed(1)}.`,
      label: 'Why this pair:',
      read: `Your growth area is ${r.need.toLowerCase()} and their strength is ${r.strength.toLowerCase()}. ${r.match} of what your quiz surfaced overlaps with what they assess.`,
      next: `Their next opening is ${a.slot}, 45 minutes, ${a.price}. Nothing is charged until you confirm the slot.`,
      act: {ic: I.calendar, go: 'agent:' + k, t: 'Book your interview with ' + a.n}
    };
  }
,

  interview: () => ({
    lead: `Your interview with ${AGENTS[(S.booking || {}).agent || 'priya'].n} is `
      + (() => { try { return bkLong(); }
                 catch(e){ return 'booked for Thursday 20 August at 6:30 PM ET'; } })() + '.',
    label: 'What happens in it:',
    read: '45 minutes, recorded, and real situations rather than hypotheticals. She confirms which of E1 to E5 you sit on and signs a report you keep.',
    next: 'Nothing has to be prepared. If you want to, ten minutes on delegation is the most useful ten minutes you can spend.',
    act: _bookedAct()
  }),

  prep: () => {
    const d = SCORES.find(b => b[0] === 'Delegation') || qzLow(2)[0];
    return {
      lead: `${d[0]} is the question Priya asks most often, and it is one of your two lowest quiz bands at ${d[1]}.`,
      label: 'How to spend ten minutes:',
      read: 'Have one real example ready: something you handed over, what actually happened, and what you would do differently. She is assessing judgement, not vocabulary.',
      next: 'Tal can run a mock interview on it whenever you want one, and it does not go on your record.',
      act: {ic: I.chat, ask: 'Run a mock interview on delegation', t: 'Run a mock interview'}
    };
  },

  level: () => ({
    lead: 'You were confirmed at Explorer &ndash; E3 on 21 August after your interview, rung 3 of the fifteen-rung ladder.',
    label: 'What a level is:',
    read: 'Explorer is rungs 1 to 5 of 15, and the interview is the only thing that sets one. A quiz cannot. E3 opens the course built for E3, and 90 days later you re-interview.',
    next: 'The ladder shows all fifteen rungs and the three tracks they sit in.',
    act: {ic: I.certificate, go: 'level', t: 'See where you are on the ladder'}
  }),

  growth: () => {
    const low = qzLow(2);
    const ch = low.map(b => QZ_CH && QZ_CH[b[0]] ? CH.findIndex(c => c[0] === QZ_CH[b[0]]) + 1 : 0).filter(Boolean);
    return {
      lead: `Your two lowest bands were ${low[0][0]} at ${low[0][1]} and ${low[1][0]} at ${low[1][1]}.`,
      label: 'Where the course meets them:',
      read: ch.length === 2
        ? `Chapters ${ch[0]} and ${ch[1]} are built on exactly these two, which is why they are the two Priya wrote up.`
        : 'Two of the thirteen chapters are built on exactly these, which is why they are the two Priya wrote up.',
      next: 'The full report has her write-up on both, in her own words, with the evidence she based it on.',
      act: {ic: I.document, go: 'report', t: 'Read the full report'}
    };
  },

  enrol: () => ({
    lead: 'Enrolling locks in your place in the next cohort and the price you were quoted.',
    label: 'What the 90 days are:',
    read: '13 chapters, one a week, each closing on an assessment, with a cohort of ten and a live leader running a weekly call. The average of the thirteen is what an agent reads at your re-interview.',
    next: 'The next cohort starts within two weeks of paying, and the interview you have already paid for comes off the price.',
    act: {ic: I.wallet, go: 'enrol', t: 'See what enrolling costs'}
  }),


  ivwhat: () => ({
    lead: 'A level interview is 45 minutes with a talent agent, video-recorded, and it is the only thing that sets a level.',
    label: 'What happens in it:',
    read: 'Real situations rather than hypotheticals. The agent decides which of E1 to E5 you sit on and signs a report you keep. A quiz can predict the track, but it cannot set the rung.',
    next: 'Any agent whose range covers your track can run it. Nothing is charged until you confirm a slot.',
    act: _bookedAct()
  }),

  roster: () => {
    const ks = Object.keys(AGENTS);
    const ps = ks.map(k => Number(String(AGENTS[k].price).replace(/[^0-9.]/g, ''))).filter(Boolean);
    const rs = ks.map(k => AGENTS[k].r);
    return {
      lead: `Every agent sets their own fee and assesses their own band of levels: $${Math.min(...ps)} to $${Math.max(...ps)} here, rated ${Math.min(...rs).toFixed(1)} to ${Math.max(...rs).toFixed(1)}.`,
      label: 'What has to match:',
      read: 'The range, and only the range. An agent assesses a band of the fifteen rungs, and yours has to sit inside it. Fee, rating and what they assess for are yours to weigh after that.',
      next: 'Tal already has a pick, on the strength of what your quiz surfaced.',
      act: _bookedAct()
    };
  },


  refund: () => ({
    lead: 'A course and an interview are refunded on different clocks.',
    label: 'Two windows, not one:',
    read: 'A course purchase and an interview fee are always separate rows, and each keeps its own receipt and its own refund window for as long as the account is open.',
    next: 'Tal can state both windows against your charges. The figures come from the terms, not from a billing ledger Tal cannot see.',
    act: {ic: I.time, ask: 'What is the refund window?', t: 'Ask about the refund windows'}
  }),

  defcard: () => {
    const cs = S.cards || [];
    const def = cs.find(c => c.def) || cs[0] || {brand: 'Visa', last: '4242', exp: '09/29'};
    const others = Math.max(0, cs.length - 1);
    return {
      lead: `${def.brand} ending ${def.last} is your default card, expiring ${def.exp}.`,
      label: 'What default means:',
      read: 'It is the card a new charge is offered against first, and it is a preference rather than a commitment. You can switch it, or take a card off, without touching anything already paid.',
      next: others
        ? `The other ${others === 1 ? 'one is' : _w(others) + ' are'} on file for later, and each can be made the default from the list below.`
        : 'It is the only card on file.',
      act: {ic: I.shield, ask: 'Is my card stored?', t: 'Ask how your card is held'}
    };
  },

  join: () => ({
    lead: `The call opens ${_w(JOIN_EARLY)} minutes before the start and stays open until the session ends.`,
    label: 'What you are joining:',
    read: 'A video call in the browser: camera, microphone, screen share and captions. It is recorded, and the recording goes to your agent rather than to Tal.',
    next: 'Nothing has to be prepared. If the time no longer works, reschedule from the card below.',
    act: {ic: I.video, call: 'iv', t: 'Join the interview'}
  })
};

function sumDropCard(key){
  const src = SUMDROP[key];
  if(!src) return '';
  const d = typeof src === 'function' ? src() : src;
  return `<div class="sd-b">
      <p class="sd-lead">${d.lead}</p>
      <p class="sd-read"><b>${d.label}</b> ${d.read}</p>
    </div>
    <div class="sd-next">
      <p class="sd-nt">Your Next Step</p>
      <p class="sd-nb">${d.next}</p>
    </div>
    ${d.act ? `<button class="sd-act" ${d.act.ask
      ? `data-tal-ask="${d.act.ask}"`
      : d.act.call
        ? `data-call="${d.act.call}"`
        : `data-go="${d.act.go}"`}><span class="sd-ic">${d.act.ic}</span>${d.act.t}</button>` : ''}`;
}

function quizModal(){
  if(!S.quizModal) return '';
  return `<div class="modal on" data-quizclose="1">
    <div class="sheet" role="dialog" aria-modal="true" aria-label="Your quiz results">
      <div class="sheet-b"><div class="sumdrop sd-flat">${sumDropCard('quiz')}</div></div>
      <div class="sheet-f"><button class="btn btn-s noic" data-quizclose="1">Close</button></div>
    </div>
  </div>`;
}

function placeSumDrop(){
  device.querySelectorAll('.sumdrop:not(.sd-flat)').forEach(n => n.remove());
  device.querySelectorAll('[data-sum].on').forEach(n => n.classList.remove('on'));
  if(!S.sumDrop) return;
  device.querySelectorAll(`[data-sum="${S.sumDrop}"]`).forEach(n => n.classList.add('on'));
  const body = device.querySelector('.modhead .ai-aura.talsum .ai-body');
  if(!body) return;
  const sel = `[data-sum="${S.sumDrop}"]`;
  const anchor = body.querySelector('.tsum-g ' + sel) || body.querySelector(sel);
  if(!anchor){ S.sumDrop = null; return; }

  const card = document.createElement('div');
  card.className = 'sumdrop';
  card.innerHTML = sumDropCard(S.sumDrop);
  body.appendChild(card);

  const bb = body.getBoundingClientRect(), ab = anchor.getBoundingClientRect();
  const max = Math.max(0, body.offsetWidth - card.offsetWidth);
  card.style.left = Math.round(Math.max(0, Math.min(ab.left - bb.left, max))) + 'px';
  card.style.top  = Math.round(ab.bottom - bb.top + 8) + 'px';
}

const _baseDrop = render;
render = function(){
  _baseDrop();
  try { placeSumDrop(); } catch(e){ console.warn('sumdrop', e); }
};

device.addEventListener('click', e => {
  const b = e.target.closest('[data-sum]');
  if(b){
    S.sumDrop = S.sumDrop === b.dataset.sum ? null : b.dataset.sum;
    placeSumDrop();
    return;
  }
  if(S.sumDrop && !e.target.closest('.sumdrop')){ S.sumDrop = null; placeSumDrop(); }
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && S.sumDrop){ S.sumDrop = null; placeSumDrop(); }
});

render();
