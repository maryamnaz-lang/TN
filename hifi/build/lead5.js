/* ==========================================================================
   lead5.js — THE COHORT-LEADER CHAT ROUTER

   Every question a leader typed used to fall through the candidate routes:
   "week" hit the transcript route and returned Maryam's private quote,
   "promoted" and "certification" were refused as candidate questions, and the
   rest landed on the support card or a candidate-voiced answer about Maryam's
   course. lead.js's own note (§542) called a leader router "its own piece of
   work"; this is it. Built to `docs/tal-scenarios/02-cohort-leader-tal-
   scenarios.md` section 4 (L-01…L-24) — the doc doubles as the spec.

   WHY IT LOADS AFTER ai8 AND WRAPS `talReply`. `talReply` returns on the first
   regex match and a `''`/throw falls to `talNoAnswer` (the support card), never
   to the next route — so a leader route that "declined" to a candidate would
   swallow the question. Instead this wraps the ai8 wrapper: for a leader it
   consults `LEAD_ROUTES` first, and only if nothing matches defers to the
   existing chain, which already handles the leader's REFUSALS correctly —
   candidate routes are `cand()`-wrapped to `leadNA` (L-25), the off-topic route
   is leader-shaped (L-28), and the catch-all support card (L-27) now names the
   leader's three cohorts (see `supportCohortLine`, ai8). So this file carries
   the leader's ANSWERS only; the nos are already there.

   It reads leader data + helpers from lead.js–lead4.js (`LEAD_COHORTS`, `lavg`,
   `lpace`, `lassess`, `lattention`, `lbehind`, `lmembers`, `lgap`, `lcalls`,
   `lnext`, `lcall`, `lcoOf`, `lmemOf`, `lchDone`, `ldrRead`, `LEAD_RUN`,
   `LEAD_SUMMARIES`, `lpending`, `LDR_CERTS`), the chat primitives from views.js
   (`tw`, `twChips`, `twIc`, `avatar`, `I`, `CH`, `AV`) and `_w`/`_W`/`twTop`
   from ai6/ai8. Nothing is hand-typed that the seed already carries; the few
   authored figures a volunteer's record does not hold (certification
   requirements, completion rate) are flagged where they are used, the same as
   the candidate doc's authored placeholders.
   ========================================================================== */

/* ---- shared bits -------------------------------------------------------- */
/* the pill button, no arrow (§39), carrying whatever nav attributes a target
   needs — leader nav is `data-go` plus `data-ldrco`/`data-ldrmem`/`data-ldrsum`
   /`data-ldrrep`/`data-ldrbrief`/`data-ldrdm`, all delegated on `device`. */
const lBtn = (label, attrs) => `<button class="tw-btn" ${attrs || ''}>${label}</button>`;
const lTag = f => f ? ` <span class="flag-t">${I[f.ic] || ''}${f.t}</span>` : '';
/* a person row is the candidate widget's `.tw-ag` (styled §39), reused: disc,
   name, its flag tag, a detail line. Members carry `.ini`/`.img`, so the disc
   is built the way every leader view builds it — `avatar({i,img:AV[...]})`. */
const lRow = (m, detail) => `<span class="tw-ag">${avatar({i: m.ini, img: AV[m.img]}, 36)}<span><b>${m.name}</b><span class="tw-k">${m.flag ? lTag(m.flag) + ' &middot; ' : ''}${detail}</span></span></span>`;
const lPeople = items => `<span class="tw-people">${items.map(x => lRow(x.m, x.detail)).join('')}</span>`;
const lPointWord = g => { const a = Math.abs(g); return g === 0 ? 'on pace' : `${_w(a)} point${a === 1 ? '' : 's'} ${g > 0 ? 'ahead' : 'behind'}`; };

/* the cohort a question is about: a named id wins, else the open cohort
   (`S.ldrCo`/`S.ldrRep`), else the next call's cohort. */
function lQCohort(){
  const q = (TAL_Q || '').toLowerCase();
  const named = LEAD_COHORTS.find(c => q.includes('cohort ' + c.id) || new RegExp('\\b' + c.id + '\\b').test(q));
  if(named) return named;
  if(S.ldrCo) return lcoOf(S.ldrCo);
  if(S.ldrRep) return lcoOf(S.ldrRep);
  return lcoOf(lnext().co);
}
/* the candidate a question names, else the open member, else the most-flagged
   person — every candidate route has a sensible subject even with no name. */
function lQMember(){
  const q = (TAL_Q || '').toLowerCase();
  for(const x of lmembers()){
    const first = x.m.name.split(' ')[0].toLowerCase();
    if(q.includes(x.m.name.toLowerCase()) || new RegExp('\\b' + first + '\\b').test(q)) return x;
  }
  if(S.ldrMem){ const c = lcoOf(S.ldrCo); const m = lmemOf(c, S.ldrMem); if(m) return {m, c}; }
  return lattention()[0] || lmembers()[0];
}

/* ---- 4.1 preparing a call ---------------------------------------------- */
function wLeadBrief(){
  const q = (TAL_Q || '').toLowerCase();
  const c = LEAD_COHORTS.find(x => q.includes('cohort ' + x.id)) || lcoOf(lnext().co);
  const k = lcall(c);
  const gap = lavg(c, 'pc') - lpace(c);
  const chapter = CH[Math.min(12, c.week - 1)][0];
  const weakest = c.members.filter(m => m.avg > 0).slice().sort((a, b) => a.avg - b.avg)[0];
  const behind = c.members.filter(m => m.pc - lpace(c) <= -5).length;
  const severe = c.members.filter(m => m.flag && m.flag.k === 'bad');
  const prose = `Cohort ${c.id} meets at ${k.time.toLowerCase()} ${k.day.toLowerCase()}, week ${c.week} of 13, ${lPointWord(gap)} at ${lavg(c, 'pc')}% against ${lpace(c)}% expected. Open on ${chapter}, this week&rsquo;s chapter and the one carrying the lowest scores${weakest ? `; ${weakest.name.split(' ')[0]} is at ${weakest.avg}%` : ''}. Skip what is already landing above 85%. Ask for a real example rather than a hypothetical, because ${_w(behind)} of the ${_w(c.members.length)} are behind on time, not comprehension. ${severe.length ? `Raise ${severe.map(m => m.name.split(' ')[0]).join(' and ')} privately, never in the group.` : 'Nothing needs raising privately this week.'}`;
  const steps = [
    `<span><b>1.</b> Open on ${chapter}, this week&rsquo;s chapter and the lowest scores${weakest ? `, ${weakest.name.split(' ')[0]} at ${weakest.avg}%` : ''}.</span>`,
    `<span><b>2.</b> Skip what is already landing above 85%; it does not need the hour.</span>`,
    `<span><b>3.</b> Ask for a real example, not a hypothetical: ${_w(behind)} of ${_w(c.members.length)} are behind on time.</span>`,
    severe.length ? `<span><b>4.</b> Raise the ${_w(severe.length)} at risk privately, never in the group.</span>` : `<span><b>4.</b> Raise nothing privately this week.</span>`
  ].join('');
  const facts = `<span class="tw-lines"><span><b>${lavg(c, 'pc')}%</b>average progress</span><span><b>${lpace(c)}%</b>expected by now</span><span><b>${lassess(c) ? lassess(c) + '%' : '&mdash;'}</b>assessment average</span><span><b>${behind} of ${c.members.length}</b>behind pace</span></span>`;
  return prose + tw(twIc('idea') + 'Run the call like this',
    `<span class="tw-list">${steps}</span>${facts}`,
    lBtn('Open the full brief', `data-ldrbrief="${c.id}"`))
    + twChips(['Who should I raise privately?', 'Which chapter is losing people?']);
}

function wLeadSessions(){
  const cs = lcalls(), nx = cs[0];
  const rows = cs.map(k => `<span><b>Cohort ${k.co}</b>${k.day}, ${k.time} &middot; week ${k.week}</span>`).join('');
  return `${_W(cs.length)} calls this week. Cohort ${nx.co} is first, at ${nx.time.toLowerCase()} ${nx.day.toLowerCase()}. Each is 60 minutes, and the brief for each reads from where that cohort actually is.`
    + tw(twIc('calendar') + 'This week&rsquo;s calls', `<span class="tw-lines">${rows}</span>`, lBtn('Open Upcoming Sessions', 'data-go="leadCalls"'));
}

function wLeadMissed(){
  /* NO PER-MEMBER ATTENDANCE IN THE SEED — `LEAD_RUN` carries a COUNT, not a
     roster. So "who missed" is answered by the honest proxy the doc uses: the
     most recent call whose cohort holds a severe flag, and the flagged name as
     the likely absence (Yuki missed week 4 and has not been back since). */
  const runs = LEAD_RUN.slice().sort((a, b) => b.week - a.week);
  const run = runs.find(r => lcoOf(r.co).members.some(m => m.flag && m.flag.k === 'bad')) || runs[0];
  const c = lcoOf(run.co);
  const missed = c.members.filter(m => m.flag && m.flag.k === 'bad');
  const seats = LEAD_RUN.reduce((s, r) => s + lcoOf(r.co).members.length, 0);
  const came = LEAD_RUN.reduce((s, r) => s + r.attended, 0);
  if(!missed.length)
    return `Everyone was on Cohort ${run.co}&rsquo;s week ${run.week} call. Across the ${_w(LEAD_RUN.length)} calls behind you, ${came} of ${seats} seats were filled.`;
  const rows = missed.map(m => ({m, detail: `last active ${m.last.toLowerCase()} &middot; ${lchDone(m)} of 13 chapters`}));
  const since = missed.length === 1 && /\d+d/.test(missed[0].last) ? ', and has not opened a chapter since, so the two are the same absence' : '';
  return `${run.attended} of ${c.members.length} were on Cohort ${run.co}&rsquo;s week ${run.week} call. ${missed.map(m => m.name).join(' and ')} missed it${since}. Across the ${_w(LEAD_RUN.length)} calls behind you, ${came} of ${seats} seats were filled.`
    + tw(twIc('group') + 'Who missed the last call', lPeople(rows), lBtn('Open Cohort ' + run.co, `data-go="leadCohort" data-ldrco="${run.co}"`))
    + twChips(['Draft a check-in to ' + missed[0].name, 'Who should I worry about this week?']);
}

function wLeadMoveCall(){
  return `You can, from the session card, and the members are told the moment you save it. The call is the one fixed hour in their week, so a move inside 24 hours costs attendance; if tonight cannot happen, post to the board first and move it after.`
    + twChips(['Brief me for tonight&rsquo;s call', 'Who missed the last one?']);
}

/* ---- 4.2 who needs attention ------------------------------------------- */
function wLeadAttention(){
  const att = lattention();
  if(!att.length)
    return `Nobody needs a look this week. All ${_w(lmembers().length)} are within five points of pace and everyone has been in recently.`;
  const bad = att.filter(x => x.m.flag.k === 'bad');
  const clause = x => {
    const first = x.m.name.split(' ')[0];
    if(x.m.flag.k === 'bad') return `${first} stopped ${x.m.last.toLowerCase()} at ${x.m.pc}% and is the one to message today`;
    if(x.m.att >= 2 && x.m.avg < 75) return `${first} is passing on the second or third attempt, so the material is landing badly rather than the effort being missing`;
    return `${first} is ${Math.abs(lgap(x))} points behind with assessments holding at ${x.m.avg}%, which usually recovers on its own`;
  };
  const prose = `${_W(att.length)} need a look, ${_w(bad.length)} seriously. ` + att.slice(0, 3).map(clause).join('. ') + '.';
  const rows = att.map(x => ({m: x.m, detail: `${x.m.pc}% at day ${x.c.day} &middot; Cohort ${x.c.id}`}));
  return prose + tw(twIc('warningAlt', 'acc') + 'Who needs a look', lPeople(rows), lBtn('Open the attention queue', 'data-go="leadDash"'))
    + twChips(['Draft a check-in to ' + att[0].m.name, 'Is ' + att[0].m.name.split(' ')[0] + ' recoverable?']);
}

function wLeadStopped(){
  /* STOPPED IS IDLE 7+ DAYS — the same threshold `lflag` uses for its severe
     "Inactive" flag; five days is "behind pace", a different reading. */
  const idle = lmembers().filter(x => /(\d+)d ago/.test(x.m.last) && +x.m.last.match(/(\d+)d/)[1] >= 7)
    .sort((a, b) => +b.m.last.match(/(\d+)d/)[1] - +a.m.last.match(/(\d+)d/)[1]);
  const never = lmembers().filter(x => x.m.last === 'Never');
  if(!idle.length && !never.length)
    return `Nobody in your three cohorts has gone quiet this week, and nobody has never signed in.`;
  const top = idle[0];
  const rows = idle.map(x => ({m: x.m, detail: `last active ${x.m.last.toLowerCase()} &middot; ${lchDone(x.m)} of 13 chapters &middot; Cohort ${x.c.id}`}));
  return `${idle.length ? `${idle.length === 1 ? 'One person has' : _W(idle.length) + ' people have'} gone quiet: ${top.m.name}, last active ${top.m.last.toLowerCase()}, ${lchDone(top.m)} ${lchDone(top.m) === 1 ? 'chapter' : 'chapters'} in. ` : ''}${never.length ? `${_W(never.length)} ${never.length === 1 ? 'has' : 'have'} never signed in. ` : `Nobody in your three cohorts has never signed in.`}`
    + tw(twIc('time') + 'Gone quiet', lPeople(rows), lBtn('Open Course reports', `data-go="leadReports" data-ldrrep="${top.c.id}"`));
}

function wLeadBehind(){
  const be = lbehind().slice().sort((a, b) => lgap(a) - lgap(b));
  if(!be.length)
    return `Nobody across your ${_w(LEAD_COHORTS.length)} cohorts is more than five points behind pace right now.`;
  const worst = be[0];
  const rows = be.map(x => ({m: x.m, detail: `${x.m.pc}% against ${lpace(x.c)}% expected &middot; Cohort ${x.c.id}`}));
  const cos = [...new Set(be.map(x => x.c.id))];
  return `${_W(be.length)} of the ${_w(lmembers().length)} are five points or more behind pace${cos.length === 1 ? `, all in Cohort ${cos[0]}` : ''}. ${worst.m.name} is furthest back at ${worst.m.pc}% against ${lpace(worst.c)}% expected.`
    + tw(twIc('growth') + 'Behind pace', lPeople(rows), lBtn('Open Course reports', `data-go="leadReports" data-ldrrep="${worst.c.id}"`));
}

function wLeadCandidate(){
  const x = lQMember();
  const m = x.m, c = x.c;
  return ldrRead(m, c)
    + tw(twIc('growth') + m.name,
      `<span class="tw-lines"><span><b>${m.pc}%</b>progress, against ${lpace(c)}% expected</span><span><b>${m.avg || 0}%</b>assessments${m.att ? `, ${m.att} attempts` : ''}</span><span><b>${lchDone(m)} of 13</b>chapters</span><span><b>${m.last.toLowerCase()}</b>last active</span></span>`,
      lBtn('Open ' + m.name, `data-go="leadMember" data-ldrco="${c.id}" data-ldrmem="${m.name}"`))
    + twChips(['What should I say to ' + m.name.split(' ')[0] + '?', 'Is this recoverable?']);
}

function wLeadRecoverable(){
  const x = lQMember(), m = x.m, c = x.c, first = m.name.split(' ')[0];
  const left = 90 - c.day;
  let body;
  if(m.flag && m.flag.k === 'bad')
    body = `For ${first}, yes, but only with a message today. ${left} days remain and the chapters left are about ${Math.round((13 - lchDone(m)) * 0.9)} hours of work, so the time is there; what is missing is a reason to come back, and people who stop mid-course rarely restart unasked. If there is no reply in a week, that is the point to talk to support about a later cohort.`;
  else if(m.att >= 2 && m.avg < 75)
    body = `Yes, but not by pushing. Two or three attempts a chapter means the material needs a different route in; ten minutes on the call working ${first}&rsquo;s own example is worth more than another reminder.`;
  else
    body = `Yes, and probably on ${first === m.name.split(' ')[0] ? 'their' : 'their'} own. A gap this size with assessments holding is time, not comprehension, and gaps like it close by week 8 more often than not.`;
  return body + twChips(['Draft a check-in to ' + m.name, 'What should I say to them?']);
}

function wLeadApproach(){
  const x = lQMember(), m = x.m, first = m.name.split(' ')[0];
  const done = lchDone(m);
  return `Ask, do not chase. ${first} ${m.flag && m.flag.k === 'bad' ? `stopped after chapter ${done || 1}, so the useful question is what happened after it, not why the rest is not done` : 'is putting the work in, so the useful move is a real example on the call rather than more reading'}. One line, direct thread, no mention of the numbers. ${first} can see them. I can draft it and you change every word before it goes.`
    + twChips(['Draft a check-in to ' + m.name, 'Is this recoverable?']);
}

function wLeadDraftCheckin(){
  const x = lQMember(), m = x.m, first = m.name.split(' ')[0];
  const done = lchDone(m);
  const draft = m.flag && m.flag.k === 'bad'
    ? `Hi ${first}. You finished chapter ${done || 1} and then it went quiet, and I would rather ask than guess. Did something get in the way after it? There is time to catch up and I would like you on this week&rsquo;s call. Reply here whenever you can.`
    : `Hi ${first}. I can see you are putting the work in, and I would like to spend ten minutes of this week&rsquo;s call on your own example rather than the reading. Bring the one that went wrong. That is where the chapter lives.`;
  return `I can put a check-in in your Messages for ${m.name}. It asks what is actually in the way rather than why the rest is not done, and it does not quote the numbers. You change every word before it goes.`
    + tw(twIc('edit') + 'Drawn from ' + first + '&rsquo;s course record',
      `<span class="tw-quote">${draft}</span>`,
      lBtn('Open the message to ' + first, `data-ldrdm="${m.name}"`));
}

/* ---- 4.3 cohorts -------------------------------------------------------- */
function wLeadCohortsTable(){
  const rows = LEAD_COHORTS.map(c => {
    const g = lavg(c, 'pc') - lpace(c);
    const fl = c.members.filter(m => m.flag).length;
    return `<span><b>Cohort ${c.id}</b>week ${c.week} &middot; ${lavg(c, 'pc')}% vs ${lpace(c)}% &middot; ${fl} flagged</span>`;
  }).join('');
  const worst = lattention()[0];
  const needs = worst ? lcoOf(worst.c.id) : LEAD_COHORTS[0];
  return `All ${_w(LEAD_COHORTS.length)} are within two points of pace. Cohort ${needs.id} needs you most: it holds the flagged names and its call is this week. The others are close, one a week old and ahead.`
    + tw(twIc('chart') + 'Your cohorts', `<span class="tw-lines">${rows}</span>`, lBtn('Open Cohorts', 'data-go="leadCohorts"'));
}

function wLeadStuck(){
  const c = lQCohort();
  const assessed = c.members.filter(m => m.avg > 0);
  if(!assessed.length)
    return `Nowhere yet. Cohort ${c.id} is week ${c.week}, nothing is assessed, and the cohort has only just opened chapter 1.`;
  const weakest = assessed.slice().sort((a, b) => a.avg - b.avg)[0];
  const chNow = CH[Math.min(12, c.week - 1)][0];
  return `The lowest-scoring work in Cohort ${c.id} is where it is stuck: ${weakest.name.split(' ')[0]} and the bottom of the cohort sit around ${weakest.avg}% on assessments. This week&rsquo;s chapter, ${chNow}, is landing fine so far, so the drag is the earlier material rather than the one due.`
    + tw(twIc('chart') + 'Where Cohort ' + c.id + ' is stuck',
      `<span class="tw-lines"><span><b>${lassess(c) ? lassess(c) + '%' : '&mdash;'}</b>assessment average</span><span><b>${weakest.avg}%</b>lowest, ${weakest.name.split(' ')[0]}</span><span><b>${c.members.filter(m => m.pc - lpace(c) <= -5).length} of ${c.members.length}</b>behind pace</span></span>`,
      lBtn('Open Course reports', `data-go="leadReports" data-ldrrep="${c.id}"`))
    + twChips(['Brief me for this call', 'Who here needs me most?']);
}

function wLeadCohortAvg(){
  const c = lQCohort();
  const bad = c.members.filter(m => m.flag && m.flag.k === 'bad').length;
  const fl = c.members.filter(m => m.flag).length;
  return `Cohort ${c.id} is averaging ${lavg(c, 'pc')}% progress against ${lpace(c)}% expected on day ${c.day}, with ${lassess(c) ? `assessments at ${lassess(c)}% across those who have sat one` : 'nothing assessed yet'}. ${bad ? `${_W(bad)} of the ${c.members.length} ${bad === 1 ? 'is' : 'are'} at risk.` : 'Nobody is at risk this week.'}`
    + tw(twIc('group') + 'Cohort ' + c.id,
      `<span class="tw-lines"><span><b>${lavg(c, 'pc')}%</b>progress, vs ${lpace(c)}%</span><span><b>${lassess(c) ? lassess(c) + '%' : '&mdash;'}</b>assessments</span><span><b>${c.members.length}</b>members</span><span><b>${fl}${bad ? `, ${bad} severe` : ''}</b>flagged</span></span>`,
      lBtn('Open Cohort ' + c.id, `data-go="leadCohort" data-ldrco="${c.id}"`));
}

function wLeadBoard(){
  const c = lQCohort();
  return `Tal reads what is posted to Cohort ${c.id}&rsquo;s board, not the one-to-one threads. The board is worth a line from you before the call when a question has gone unanswered. That is the one thing a leader can clear in a sentence.`
    + tw(twIc('chat') + 'The cohort board', `<span class="tw-list"><span>Posts are public to the ${_w(c.members.length)} in the cohort.</span><span>Direct threads stay between you and the candidate.</span></span>`, lBtn('Open the board', `data-go="leadCohort" data-ldrco="${c.id}"`));
}

/* ---- 4.4 evaluations and the 90-day summary ---------------------------- */
function wLeadSignature(){
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  if(!ps.length) return `Nothing is waiting on your signature. Every 90-day summary is published.`;
  const rows = ps.map(s => { const c = lcoOf(s.cohort), m = lmemOf(c, s.name); return {m, detail: `${m.pc}% &middot; ${m.avg}% assessments &middot; ${lchDone(m)} of 13 &middot; Cohort ${c.id}`}; });
  const co = ps[0].cohort;
  return `${_W(ps.length)} 90-day ${ps.length === 1 ? 'summary' : 'summaries'} in Cohort ${co}: ${ps.map(s => s.name).join(' and ')}. Nothing reaches their next agent, and no level moves, until you publish what you saw.`
    + tw(twIc('certificate') + 'Waiting on your signature', lPeople(rows), lBtn('Open Evaluations', 'data-go="leadEvals"'))
    + twChips(['Is ' + ps[0].name + ' ready to be promoted?', 'What should the summary say?']);
}

function wLeadPromote(){
  const q = (TAL_Q || '').toLowerCase();
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const s = ps.find(s => q.includes(s.name.toLowerCase()) || q.includes(s.name.split(' ')[0].toLowerCase())) || ps[0] || LEAD_SUMMARIES[0];
  const c = lcoOf(s.cohort), m = lmemOf(c, s.name), first = s.name.split(' ')[0];
  return `The numbers say yes: ${first} finished at ${m.pc}% with ${m.avg}% on assessments and ${lchDone(m)} of 13 chapters. What the numbers cannot say is whether the growth area named in the interview actually moved, and that is the part only you can write. The recommendation is yours; I state the evidence and never a level.`
    + tw(twIc('certificate') + s.name,
      `<span class="tw-lines"><span><b>${m.pc}%</b>progress</span><span><b>${m.avg}%</b>assessments</span><span><b>${lchDone(m)} of 13</b>chapters</span></span>`,
      lBtn('Open ' + first + '&rsquo;s summary', `data-go="leadSum" data-ldrsum="${s.id}"`))
    + twChips(['What should the summary say?', 'Draft the evidence paragraph']);
}

function wLeadSummaryHelp(){
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const s = ps[0] || LEAD_SUMMARIES[0], first = s.name.split(' ')[0];
  return `Three things, in this order: what the 90 days were meant to move for ${first}; what you saw move, with one example from a call rather than a score; and your recommendation with its reason. The figures are already on the page, so the paragraph does not repeat them. I can draft the first two from the record; the third is yours.`
    + twChips(['Draft the evidence paragraph', 'Is ' + s.name + ' ready to be promoted?']);
}

function wLeadDraftEvidence(){
  const q = (TAL_Q || '').toLowerCase();
  const ps = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const s = ps.find(s => q.includes(s.name.split(' ')[0].toLowerCase())) || ps[0] || LEAD_SUMMARIES[0];
  const c = lcoOf(s.cohort), m = lmemOf(c, s.name), first = s.name.split(' ')[0];
  const draft = `${first} came into Cohort ${c.id} with a named growth area. Over the 90 days ${first} finished ${lchDone(m)} of 13 chapters at ${m.avg}% on assessments and was a steady presence on the calls. The record shows the thing that was hard in the interview being done in the room rather than described.`;
  return `I can put the evidence half into the summary field: what ${first} came in to work on and what the record shows moved. The recommendation and its reason stay blank for you.`
    + tw(twIc('edit') + 'Drawn from ' + first + '&rsquo;s record',
      `<span class="tw-quote">${draft}</span>`,
      lBtn('Open ' + first + '&rsquo;s summary', `data-go="leadSum" data-ldrsum="${s.id}"`));
}

/* ---- 4.5 certifications and standing ----------------------------------- */
function wLeadCert(){
  /* THE FOUR REQUIREMENTS ARE AUTHORED (doc L-20): the seed carries the earned
     certs (`LDR_CERTS`) and the standing, not the mentoring-log counts, so the
     "6 sessions, 4 done" target is placeholder copy — real once the record has
     a mentoring log. Earned count and standing are read. */
  return `Candidate Mentoring is the open one, and it opens the Builder band. You have three of its four requirements: eight cohorts&rsquo; worth of leading, a standing above 4.5, and this quarter&rsquo;s published summaries. The one left is a mentoring log of six sessions, and you have four.`
    + tw(twIc('certificate') + 'Candidate Mentoring',
      `<span class="tw-lines"><span><b>8 of 6</b>cohorts led &check;</span><span><b>4.9</b>standing &check;</span><span><b>2 of 2</b>summaries this quarter &check;</span><span><b>4 of 6</b>mentoring sessions</span></span>`,
      lBtn('Open Certifications', 'data-go="leadCerts"'));
}

function wLeadStanding(){
  /* completion 84% is authored on the profile card (doc L-21); 4.9 and "8
     cohorts led" are the record's own printed figures (lead4.js). */
  return `4.9, from the candidates you have led rating the 90 days after their re-interview, across eight cohorts. Completion in your cohorts is 84%, which is read separately and does not feed the rating. Neither number changes your assessing range. That comes from your certifications.`
    + tw(twIc('trophy') + 'Your standing',
      `<span class="tw-lines"><span><b>4.9</b>standing</span><span><b>8</b>cohorts led</span><span><b>84%</b>completion</span><span><b>${LEADER.range}</b>range, from certifications</span></span>`,
      lBtn('Open Your profile', 'data-go="leadProfile"'));
}

/* ---- 4.6 Tal itself ----------------------------------------------------- */
function wLeadHelp(){
  return `I read your side of the product: your cohorts and where each person is, your sessions, your evaluations and the reports. I can tell you who needs attention and why, and draft a note or a brief for you. Nothing I write is sent until you send it.`
    + twChips(['Brief me for the call', 'Who should I worry about this week?', 'What is waiting on my signature?']);
}

function wLeadSee(){
  return tw(twIc('shield', 'acc') + 'What I can and cannot see',
    `<span class="tw-lines"><span><b>I see</b>progress, scores, attempts and timing for every candidate in your cohorts, the board, and your published summaries</span><span><b>I never</b>a candidate&rsquo;s written answers; your one-to-one threads; anything said on a call; any money, of which there is none here</span></span>
     <span class="tw-k">Everything in a brief is computed from course activity, so it can tell you who is stuck and cannot tell you how well they are thinking.</span>`);
}

function wLeadPaid(){
  return `Leading is a volunteer role, and there is no money anywhere on this side of the product. What it earns is the cohort-leader certifications, and Candidate Mentoring is the one that opens the Builder band.`
    + twChips(['What do I need for the next certification?', 'How is my standing calculated?']);
}

/* ---- the table. Order is first-match-wins, so the specific vocabulary sits
   above the general, and a candidate-colliding word (week / promoted / pace)
   is caught here before the wrapper would defer to the candidate routes. ---- */
const LEAD_ROUTES = [
  [/\bbrief me\b|prepare me for|what should i cover|run the call|brief for/i, wLeadBrief],
  [/next call|what'?s on this week|show my sessions|how many calls|my sessions|upcoming session/i, wLeadSessions],
  [/who missed|was ?n'?t on|who wasn|attendance|missed the (last|call)/i, wLeadMissed],
  [/reschedule|move .*(call|session|thursday|it)|cancel .*(call|session|tonight)|can i move/i, wLeadMoveCall],

  [/ready to (be )?promot|should i promote|promotable/i, wLeadPromote],
  [/what should the summary|what should i write|help me with the recommendation|what goes in the summary/i, wLeadSummaryHelp],
  [/draft the evidence|draft .*summary|start the write-?up|write.*summary for me/i, wLeadDraftEvidence],
  [/waiting on my signature|pending .*(summar|signature)|need to sign|what do i (need to )?sign|summaries.*(pending|waiting)/i, wLeadSignature],

  [/draft a check|draft a message|write a message to|help me word|check-?in to/i, wLeadDraftCheckin],
  [/recoverable|can .* (still|catch up|finish)|too late for|is it too late/i, wLeadRecoverable],
  [/what should i say|how do i approach|what do i say to|how should i talk/i, wLeadApproach],
  [/worry about|needs me most|at risk|attention queue|who is inactive|who'?s inactive|who needs a look/i, wLeadAttention],
  [/who has stopped|has stopped|not signed in|who is idle|who'?s idle|gone quiet/i, wLeadStopped],
  [/behind pace|who is behind|how many are behind|on track|falling behind/i, wLeadBehind],

  [/how are my cohorts|which cohort needs me|compare my cohorts|compare cohorts|how are the cohorts|summar(y|ise) (of )?cohort/i, wLeadCohortsTable],
  [/where is .*stuck|where .*stuck|which chapter is losing|which chapter.*lowest|losing people/i, wLeadStuck],
  [/cohort average|how is cohort .* scoring|how is cohort .* doing|show me cohort|scoring/i, wLeadCohortAvg],
  [/on the board|discussion board|what are they talking|what came up/i, wLeadBoard],

  [/next certification|how do i get certified|builder band|what opens the/i, wLeadCert],
  [/how is my standing|my rating|where does .* come from|standing calculated|my standing/i, wLeadStanding],
  [/what can you (do|help)|what do you do|who are you|how can you help/i, wLeadHelp],
  [/what can you see|read (their|the) answers|do you read my messages|what do you know about my/i, wLeadSee],
  [/paid for leading|am i paid|fee for this|how much do i get paid|do i get paid|is there a fee/i, wLeadPaid],

  /* candidate-by-name has to be LAST of the answer routes: "how is X doing" is
     broad, so it only fires once nothing more specific has. */
  [/who is |tell me about|how is |how'?s |what is .*progress|'?s progress|is .* doing/i, wLeadCandidate]
];

/* ---- wrap the ai8 `talReply`. Leader → LEAD_ROUTES first, then defer to the
   existing chain (which owns the leader's refusals). ---- */
(function(){
  const _prev = talReply;
  talReply = function(q){
    TAL_Q = String(q || '');
    if(typeof isLead === 'function' && isLead()){
      for(const [m, fn] of LEAD_ROUTES){
        if(m.test(TAL_Q)){
          let r = '';
          try { r = fn(); } catch(e){ console.warn('leadReply', e); }
          if(r) return twTop(r);
        }
      }
    }
    return _prev(q);
  };
})();

render();
