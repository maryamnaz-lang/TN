const SUPPORT = {
  email: 'support@talentnext.com',
  phone: '(555) 123-4567',
  hours: 'Mon&ndash;Fri, 9:00 AM &ndash; 6:00 PM ET',
  reply: 'One working day'
};

let TAL_Q = '';

const hl = (s) => `<b class="tw-hl">${s}</b>`;

function wSupport(askFor){
  return tw(twIc('helpDesk','acc') + 'TalentNext support',
    `<span class="tw-lines">
       <span><b>Ask for</b>${askFor}</span>
       <span><b>Email</b>${SUPPORT.email}</span>
       <span><b>Phone</b>${SUPPORT.phone}</span>
       <span><b>Hours</b>${SUPPORT.hours}</span>
     </span>
     <span class="tw-k">They answer inside one working day. ${supportCohortLine()}</span>`);
}
function supportCohortLine(){
  if(typeof isLead === 'function' && isLead() && typeof LEAD_COHORTS !== 'undefined'){
    const ids = LEAD_COHORTS.map(c => c.id);
    const list = ids.length > 1
      ? ids.slice(0, -1).join(', ') + ' and ' + ids[ids.length - 1]
      : String(ids[0]);
    return `Say you lead Cohort${ids.length > 1 ? 's' : ''} ${list}.`;
  }
  return 'Quote your cohort number, Cohort 41.';
}

function talNoAnswer(){
  const bare = S.stage === 'onboard';
  const ctx = (isLead() && typeof LEAD_TAL !== 'undefined' ? LEAD_TAL.ctx : TALCTX);
  const set = ctx[S.view] || ctx[isLead() ? 'leadDash' : 'dashboard'];
  return `I ${hl('do not have an answer')} for that one, and I would rather say so than guess at it. Anyone on the support desk can pick it up.`
    + wSupport('this question, worded exactly as you asked me. They will have your account open')
    + (bare ? '' : `<span class="tw-k">Here is what I can answer from where you are.</span>`
        + twChips(set));
}

function talOff(sentence, near){
  return sentence + (near ? twChips(near) : '');
}

function wScope(){
  if(isLead()) return `I read your side of the product: your cohorts and where each person is, your sessions, your evaluations and the reports. I can tell you who needs attention and why, and draft a note or a brief for you. Nothing I write is sent until you send it.`
    + twChips((typeof LEAD_TAL !== 'undefined' && LEAD_TAL.ctx.leadDash) || ['How are my cohorts doing?']);
  const f = cfg(S.stage);
  const on = f.enrolled || f.complete;
  return tw(twIc('ai') + 'What I can do',
    `<span class="tw-lines">
       <span><b>Course</b>${on
         ? 'what is in a chapter, what your assessments measured, where you are against the other nine, and what to do this week'
         : 'what the 90 days are, what they ask of you each week, and what they cost'}</span>
       <span><b>Level</b>the Explorer track, what ${f.pred ? 'the interview decides' : f.level + ' means'}, and what would move you up</span>
       <span><b>Interviews</b>book one, prepare for one, practise against the real scenarios from yours, and search the transcript of one you have done</span>
       <span><b>Cohort</b>the Thursday call, who leads it, and the board</span>
       <span><b>Me</b>everything I hold about you, where each line came from, and how to correct it or switch me off</span>
     </span>
     <span class="tw-k">What I will not do is ${hl('guess')}. I cannot see your payments, your one-to-one messages with Priya, or anything said on a cohort call, and where I do not have an answer I will say so and give you the support desk rather than invent one.</span>`,
    `${twBtn('See what I hold about you','mem')}<button class="tw-btn ghost" data-ask="1">What should I do next?</button>`);
}

const leadNA = (what) => `That is a candidate question: ${what} is not part of the cohort-leader role. I can read your cohorts, your sessions and your evaluations.`
  + twChips((typeof LEAD_TAL !== 'undefined' && LEAD_TAL.ctx.leadDash) || ['How are my cohorts doing?']);
const cand = (re, fn, what) => [re, () => isLead() ? leadNA(what) : fn()];


function wCost(){
  return tw(twIc('wallet','acc') + 'What the 90 days cost',
    `<span class="tw-lines">
       <span><b>$95</b>the interview that sets your level, paid to the agent</span>
       <span><b>$690</b>the Explorer &ndash; E3 course</span>
       <span><b>&minus;$95</b>your interview, credited against it</span>
       <span><b>$595</b>due when you enroll</span>
     </span>
     <span class="tw-k">${hl('One payment')}. Nothing recurs, no card is kept on file by us, and the re-interview at day 91 is included. The agent&rsquo;s fee is theirs and it varies: $80 to $110 across the twenty-four.</span>`,
    twBtn('Open Enroll','enrol'));
}

function wReCost(){
  return `The re-interview is ${hl('included')}. You paid an agent $95 to set your level at the start; the one at day 91 that decides whether you move up is part of the $690 course fee, and there is nothing further to pay for it.`
    + twChips(['What happens at the re-interview?','What would move me to E4?']);
}

function wRefund(){
  return tw(twIc('time','acc') + 'The two refund windows',
    `<span class="tw-lines">
       <span><b>Interview</b>free to move or cancel up to 24 hours before. Inside 24 hours the fee is not refundable.</span>
       <span><b>Course</b>full refund up to 7 days after your cohort starts, as long as you have not finished more than one chapter.</span>
     </span>
     <span class="tw-k">Both are decided by ${hl('the support desk')}, not by me. I can tell you which window you are in, and they are the ones who action it.</span>`)
    + wSupport('a refund, and say which of the two windows it falls in');
}

function wCard(){
  return tw(twIc('shield') + 'Where your card actually is',
    `<span class="tw-list">
       <span>The number goes straight to our payment processor. It never reaches a TalentNext server.</span>
       <span>We keep the brand and the last four digits, so a saved card is something you can recognise and choose again, not something we could charge on our own.</span>
       ${''/* THE CAP CAME OFF THE PRODUCT, SO IT CAME OFF THIS ANSWER (2 Sep
              2026). This read "Three saved cards is the maximum, and you can
              remove any of them from Payments" — and `V.billing` no longer
              hides "Add a card" at three or states a limit, so the sentence
              was Tal asserting a rule the page had stopped having. That is the
              exact failure this file's own note warns about: "do not restate a
              number here that a page owns; read it, or the two drift."
              What is left is the half that is still the page's: you can take
              any of them off, there. */}
       <span>You can add another or remove any of them from Payments.</span>
     </span>
     <span class="tw-k">I ${hl('cannot see')} any of it. Card details are on the list of things I have never been shown.</span>`,
    twBtn('Open Payments','billing'));
}

function wLedger(){
  return tw(twIc('receipt') + 'Your payments, and why I am not reading them',
    `<span class="tw-list">
       <span>Payments has every charge with its date, the card it went to, and a Receipt button on each row.</span>
       <span>Billing is on the short list of things I have never been shown, along with your messages with Priya and anything said on a cohort call.</span>
     </span>
     <span class="tw-k">So I ${hl('cannot tell you the figure')}. The page can, and it is the same tap as asking me.</span>`,
    `${twBtn('Open Payments','billing')}<button class="tw-btn ghost" data-go="mem">See what I do hold</button>`);
}

function wBillingProblem(){
  return `That one ${hl('needs a person')}, and quickly. I cannot see charges and I cannot reverse one, so there is nothing I can check first that would save you the message.`
    + wSupport('a charge to be checked. Give them the amount, the date and the last four digits, and attach the receipt from Payments')
    + twChips(['What is the refund window?','Is my card stored?']);
}


function wCycle(){
  return tw(twIc('calendar') + 'How the 90 days run',
    `<span class="tw-lines">
       <span><b>Day 1</b>your cohort of ten starts together, all at the same level</span>
       <span><b>Weekly</b>one chapter, its assessment, and a 60-minute call on Thursday</span>
       <span><b>Day 90</b>13 chapters done, and your 90-day summary written</span>
       <span><b>Day 91</b>the re-interview: you move up, hold, or drop back</span>
     </span>
     <span class="tw-k">About ${hl('two hours a week')}. The cohort is fixed for the whole 90 days and your leader is a volunteer who has already done the level above yours.</span>`,
    twBtn('See the 13 chapters','coursework'));
}

function wEnd(){
  return tw(twIc('certificate') + 'What you have at the end',
    `<span class="tw-list">
       <span>A confirmed level, decided at the re-interview and signed by an agent.</span>
       <span>Your 90-day summary: the signed record of the 13 chapters, your assessment scores and what your leader wrote. It is yours to read and to share.</span>
       <span>Everything you earned along the way: your points, your badges and your rank stay on the account.</span>
     </span>
     <span class="tw-k">Deleting your account later ${hl('does not')} take a signed summary off you.</span>`,
    twBtn('Open course progress','transcript'));
}

function wSummary(){
  const f = cfg(S.stage);
  return tw(twIc('document') + 'What is in the 90-day summary',
    `<span class="tw-list">
       <span>Every chapter you finished and what it was assessed at.</span>
       <span>The growth areas from your level interview, and whether the 90 days moved them.</span>
       <span>What your cohort leader wrote, and their recommendation: move up, hold, or drop back.</span>
     </span>
     <span class="tw-k">${f.complete
        ? 'Yours was signed by Priya on November 21. It is what your re-interview was assessed against.'
        : f.finished
          ? 'Yours is written. Priya signs it once you book the re-interview, and whoever you pick reads it before the call.'
          : 'Yours is being assembled as you go. It is signed at day 90.'}</span>`,
    twBtn('Open course progress','transcript'));
}

function wChapterAny(nums){
  const f = cfg(S.stage);
  const list = nums.filter(n => n >= 1 && n <= 13);
  if(!list.length) return '';
  const rows = list.map(n => {
    const i = n - 1, name = CH[i][0], mins = CH[i][1];
    const state = i < f.done ? `finished, assessed ${SCORE[i]}%`
      : (i === f.open && f.enrolled) ? 'open now'
      : (OPEN_DATES[i] && f.week < i) ? 'opens ' + OPEN_DATES[i]
      : 'not started';
    return `<span><b>Chapter ${n} &middot; ${name}</b><br>${mins} min &middot; ${state}${GROWTH.includes(i) ? ' &middot; your growth area' : ''}</span>`;
  }).join('');
  const growth = list.filter(n => GROWTH.includes(n - 1));
  return tw(twIc('book') + (list.length > 1 ? 'The chapters you asked about' : 'Chapter ' + list[0]),
    `<span class="tw-list">${rows}</span>
     ${growth.length ? `<span class="tw-k">${growth.length === list.length && list.length > 1
        ? 'Both are growth areas from your report, which is why they are named together.'
        : 'Chapter ' + growth.join(' and ') + ' is a growth area from your report.'} Extra time there moves your level more than extra time anywhere else.</span>` : ''}`,
    twBtn(list.length > 1 ? 'Open Coursework' : 'Open chapter ' + list[0],
          list.length > 1 ? 'coursework' : 'chapter:' + (list[0] - 1)));
}

function wLowest(){
  const f = cfg(S.stage);
  if(!f.done) return `Nothing is assessed yet, so there is no average to drag down. Your first score lands when you finish chapter 1.`
    + twChips(['What should I do next?','How are chapters assessed?']);
  const done = SCORE.slice(0, f.done);
  const lo = Math.min(...done), i = done.indexOf(lo);
  return tw(twIc('chart') + 'Your lowest assessment',
    `<span class="tw-lines">
       <span><b>${lo}%</b>chapter ${i + 1}, ${CH[i][0]}</span>
       <span><b>${f.avg}%</b>your average across ${f.done} assessed</span>
       <span><b>79%</b>the cohort average</span>
     </span>
     <span class="tw-k">${lo}% is below the cohort average and well below your own, so it is the one with the most left in it${GROWTH.includes(i) ? ', and your report names it as a growth area' : ''}. Finishing it properly is worth more than any other hour this week.</span>`,
    twBtn('Open chapter ' + (i + 1), 'chapter:' + i));
}

function wStanding(){
  const f = cfg(S.stage);
  if(!f.enrolled && !f.complete) return `You are not on a course yet, so there is nothing to be doing well or badly at. What is decided so far is your track (Explorer, from the quiz) and the next thing that moves is your level.`
    + twChips(['What should I do next?','How does the ladder work?']);
  return tw(twIc('growth') + 'Where you are',
    `<span class="tw-lines">
       <span><b>${f.done} of 13</b>chapters finished</span>
       <span><b>${f.avg ? f.avg + '%' : '&mdash;'}</b>${f.avg ? 'your average, against a cohort average of 79%' : 'nothing assessed yet'}</span>
       <span><b>Day ${f.day}</b>of 90, week ${f.week} of 13</span>
     </span>
     <span class="tw-k">${f.complete
        ? 'All 13 done and the re-interview signed. You moved to E4 on November 21.'
        : f.finished
          ? 'All 13 done, above the cohort average on every one. The re-interview is the only thing left.'
          : f.avg
            ? 'Comfortably above the cohort on the work you have finished. Pace is the open question, not quality.'
            : 'Too early to say anything about scores. Nothing this week is assessed.'}</span>`,
    twBtn('Open course progress','transcript'));
}

function wPace(){
  const f = cfg(S.stage);
  const w = WEEKLY[S.stage];
  if(!f.enrolled) return `There is no pace to be behind yet. The 90 days start when your cohort does.`
    + twChips(['What should I do next?','Explain the 90-day cycle']);
  if(f.finished || f.complete) return `You are not behind. All 13 chapters are done and the 90 days are finished. What is outstanding is the re-interview, and that is a booking rather than a backlog.`
    + twChips(['What happens at the re-interview?','What is in the 90-day summary?']);
  if(!w) return '';
  return tw(twIc('time','acc') + 'Against your cohort',
    `<span class="tw-lede">${w.tal}</span>`,
    `${twBtn('Open Coursework','coursework')}<button class="tw-btn ghost" data-ask="1">${w.ask[0]}</button>`);
}

const NEXT = {
  consult:  ['Nothing, and that is the point', 'Your call with Jordan Blake is Thursday, August 13 at 2:00 PM ET. Fifteen minutes, nothing assessed, nothing to prepare. He points you at the agents whose range fits, and you book after that.', 'What happens on the consultant call?', 'interviews'],
  new:      ['Book the interview that sets your level', 'Your quiz put you on the Explorer track, and that is a title rather than a level. Forty-five minutes with an agent is what turns it into E1 to E5, and the course you can enroll on follows from it.', 'Book an interview with a top agent', 'agents'],
  booked:   ['Spend ten minutes preparing', 'Priya Nair, Thursday 20 August, 6:30 PM ET. She opens with a situation from your own answers, so the useful preparation is one story you can actually tell, not revision. I can run it with you now.', 'Run a mock interview with me', 'interviews'],
  resched:  ['Spend ten minutes preparing', 'Priya Nair, Thursday 20 August, 6:30 PM ET. She opens with a situation from your own answers, so the useful preparation is one story you can actually tell, not revision. I can run it with you now.', 'Run a mock interview with me', 'interviews'],
  assessed: ['Enroll in the Explorer &ndash; E3 course', 'Your report is signed and E3 is confirmed. The cohort is assigned for you and the 90 days start when it does, $595 with your interview credited.', 'What do the 90 days ask of me?', 'enrol'],
  week1:    ['Finish chapter 1', 'Forty-five minutes, and nothing this week is assessed. Four of the ten in Cohort 41 have already done it, so the only thing between you and their pace is the chapter itself.', 'What is next week about?', 'coursework'],
  day34:    ['Finish chapter 4', 'You are 12 minutes into it after four opens, it is 70 minutes long, and it is the growth area Priya named in your report. It is the one place extra time changes your level rather than your average.', 'How do I catch up?', 'chapter:3'],
  day90:    ['Book the re-interview', 'All 13 chapters are done at 83% and your 90-day summary is written. Priya signs it once the re-interview is booked, and whoever you pick reads it before the call. There is nothing further to pay.', 'What happens at the re-interview?', 'interviews'],
  promoted: ['Enroll in the E4 course', 'You moved up on November 21. The next 90 days are built for E4, and your returning-candidate credit comes off the fee.', 'What is different about E4?', 'enrol'],
  reddemo:  ['Finish chapter 4', 'You are 12 minutes into it after four opens, it is 70 minutes long, and it is the growth area Priya named in your report. It is the one place extra time changes your level rather than your average.', 'How do I catch up?', 'chapter:3']
};

function wNext(){
  const n = NEXT[S.stage];
  if(!n) return '';
  const [title, body, chip, go] = n;
  return tw(twIc('flag','acc') + 'Next',
    `<span class="tw-lede">${title}</span>
     <span class="tw-k">${body}</span>`,
    `${twBtn(go === 'enrol' ? 'Open Enroll' : go === 'agents' ? 'See the agents' : go === 'coursework' ? 'Open Coursework' : go === 'interviews' ? 'Open Interviews' : 'Open chapter 4', go)}<button class="tw-btn ghost" data-ask="1">${chip}</button>`);
}

function wMoveUp(){
  const f = cfg(S.stage);
  if(f.pred) return `Nothing yet, because you are not on the ladder. The quiz gave you a track and an interview gives you a level (E1 to E5) and until an agent has done that there is no rung to move off.`
    + twChips(['What happens in the 45 minutes?', 'How does the ladder work?']);
  if(f.complete) return `You moved on November 21. E5 is the top of the Explorer track and the next 90 days are what decide it; the shape is the same: the chapters, the leader&rsquo;s recommendation, the re-interview.`
    + twChips(['What is different about E4?', 'What is in the 90-day summary?']);
  return tw(twIc('growth','acc') + 'What moves you from ' + f.level + ' to E4',
    `<span class="tw-list">
       <span>The two growth areas Priya named in your report: <b>chapter 4, Delegation Without Drop-Off</b> and <b>chapter 5, Hard Conversations</b>. Those are what she will re-test.</span>
       <span>Your cohort leader&rsquo;s recommendation at day 90, which is written from your weekly tasks and the calls, not from your average.</span>
       <span>The re-interview at day 91. It is the same 45 minutes and the same questions, and what is assessed is whether the answers changed.</span>
     </span>
     <span class="tw-k">${f.avg ? 'Your average is ' + f.avg + '% against a cohort average of 79%, so scores are not what is holding you. ' : ''}A high average with the growth areas untouched ${hl('holds you at ' + f.level)}.</span>`,
    `${twBtn('Open my level','level')}<button class="tw-btn ghost" data-go="report">Read the report</button>`);
}

function wFinish(){
  const f = cfg(S.stage);
  if(!f.enrolled && !f.complete) return `Ninety days from the day your cohort starts, and the cohort starts when it is full. The re-interview is day 91.`
    + twChips(['Explain the 90-day cycle', 'What should I do next?']);
  if(f.complete) return `It is finished. All 13 chapters, the summary signed on November 21, and the re-interview decided. You moved to E4. What is open now is the next course, not this one.`
    + twChips(['What is different about E4?', 'What do I have at the end?']);
  return tw(twIc('calendar') + 'What is left',
    `<span class="tw-lines">
       <span><b>Day ${f.day}</b>of 90, ${90 - f.day} days to go</span>
       <span><b>Week ${f.week}</b>of 13, ${13 - f.week} chapters still to open</span>
       <span><b>Day 91</b>the re-interview, which is the last thing in the course</span>
     </span>
     <span class="tw-k">Your cohort finishes together. The ten of you started on the same day and the calls stop on the same week.</span>`,
    twBtn('Open course progress','transcript'));
}

function wPause(){
  return tw(twIc('pause') + 'Pausing, or moving cohort',
    `<span class="tw-list">
       <span>A cohort is a fixed ten moving together for 90 days, with one live call a week. There is no self-service pause, because pausing means leaving the group you are in.</span>
       <span>Your cohort leader can carry you through a bad fortnight. That is what the flag on their dashboard is for, and it clears itself when you come back.</span>
       <span>Anything longer than that is a transfer to a later cohort, and the support desk decides those case by case.</span>
     </span>
     <span class="tw-k">${hl('Tell your leader')} first. Most of what people ask a pause for, a leader can just absorb.</span>`,
    twBtn('Message your leader','messages'))
    + wSupport('a transfer to a later cohort, and say which weeks you would miss');
}


function wMove(){
  return tw(twIc('renew') + 'Moving or cancelling an interview',
    `<span class="tw-lines">
       <span><b>Up to 24h</b>free to move to any of the agent&rsquo;s other slots, or to cancel for a full refund</span>
       <span><b>Inside 24h</b>you can still move it, but the fee is not refundable</span>
       <span><b>No-show</b>treated as inside 24 hours</span>
     </span>
     <span class="tw-k">Rescheduling is on the booking itself. It ${hl('does not need a person')}, and it does not go back to the start of the queue.</span>`,
    twBtn('Open Interviews','interviews'));
}

function wNoQuestions(){
  return `There is no list to send you, and that is deliberate rather than cagey. The agent opens on something from your own first few answers and follows it, so the second half of the interview is built out of the first half: ${hl('nobody')} has the questions in advance, including them.`
    + tw(twIc('checkOutline') + 'So preparation is three things, not revision',
      `<span class="tw-check">
         <span>One story where you handed work over and it went wrong</span>
         <span>What you would do differently, in one sentence</span>
         <span>One decision you changed after listening to someone</span>
       </span>`);
}

function wNotDo(){
  return tw(twIc('warningAlt','acc') + 'The four that cost people most',
    `<span class="tw-list">
       <span>Do not qualify your answer while you are giving it. Say the thing, then say what you would change.</span>
       <span>Do not bring the story where you were right. Bring the one that went wrong. The judgement is in what you did next.</span>
       <span>Do not answer in the abstract. &ldquo;I would usually&rdquo; cannot be assessed; &ldquo;in March I&rdquo; can.</span>
       <span>Do not negotiate the level in the room. The report comes 24 hours later and there is a proper route to a review.</span>
     </span>
     <span class="tw-k">None of this is about polish. Priya assesses ${hl('judgement under pressure')} rather than vocabulary, and she says so on her profile.</span>`);
}

function wWhenLevel(){
  return `${hl('Inside 24 hours')}. The agent writes the report after the call rather than during it, and your level appears on My Level the moment they sign it. There is no panel and no waiting list. If you disagree with what they set, you can ask for a review by a second agent.`
    + twChips(['What is on my report?','How do I ask for a review?']);
}

function wRank(){
  return tw(twIc('star') + 'The number on an agent card',
    `<span class="tw-lines">
       <span><b>4.8</b>the average score past candidates gave Priya after their interview, out of 5, across 210 of them</span>
       <span><b>E1&ndash;E3</b>the levels she is certified to assess, not the levels she tends to give</span>
       <span><b>210</b>interviews conducted</span>
     </span>
     <span class="tw-k">The shortlist itself is ordered by how each agent&rsquo;s past candidates went on to progress, which is a different measure from the rating. ${hl('Neither one predicts')} the level you will get. That comes out of your own 45 minutes.</span>`,
    twBtn('See the agents','agents'));
}

function wPrice(){
  return tw(twIc('wallet') + 'What the price is and is not',
    `<span class="tw-lines">
       <span><b>$80</b>Lena Fischer &middot; 4.5 &middot; E1&ndash;E4</span>
       <span><b>$95</b>Priya Nair &middot; 4.8 &middot; E1&ndash;E3</span>
       <span><b>$110</b>Hana Kim &middot; 4.3 &middot; B1&ndash;B4</span>
     </span>
     <span class="tw-k">The dearest of the three is the lowest rated and the cheapest is not the worst, so price is not a quality ranking. It is the agent&rsquo;s own rate, and it tracks the level band they assess and how booked they are. It buys you a different person, ${hl('never a different level')}. The level comes out of the 45 minutes.</span>`,
    twBtn('Compare the agents','agents'));
}

function wAgentPair(){
  const q = TAL_Q;
  const keys = Object.keys(AGENTS).filter(k => new RegExp('\\b' + k + '\\b|' + AGENTS[k].n.split(' ')[1], 'i').test(q));
  const pick = keys.length >= 2 ? keys.slice(0, 2) : ['priya', 'owen'];
  const [a, b] = pick.map(k => AGENTS[k]);
  return tw(null,
    `<span class="tw-ag">${avatar(a, 40)}<span><b>${a.n}</b><span class="tw-k">${a.range} &middot; ${a.r.toFixed(1)} &middot; ${a.ivs} interviews &middot; ${a.price}</span></span></span>
     <span class="tw-ag">${avatar(b, 40)}<span><b>${b.n}</b><span class="tw-k">${b.range} &middot; ${b.r.toFixed(1)} &middot; ${b.ivs} interviews &middot; ${b.price}</span></span></span>
     <span class="tw-list">
       <span>${a.n.split(' ')[0]} pushes hardest on how you decide under pressure and will tell you plainly where you are.</span>
       <span>${b.n.split(' ')[0]} works on incomplete information. Expect &ldquo;and then what happened&rdquo; more than once.</span>
     </span>
     <span class="tw-k">Both assess Explorer candidates and both report inside 24 hours. The difference you will feel is the register, not the standard.</span>`,
    twBtn('See both profiles','agents'));
}


function wLeader(){
  const p = AGENTS.priya;
  return tw(null,
    `<span class="tw-ag">${avatar(p, 40)}<span><b>Priya Nair</b><span class="tw-k">Cohort leader, Cohort 41 &middot; leading since March 2024</span></span></span>
     <span class="tw-list">
       <span>She runs the Thursday call, reads your weekly tasks and writes the recommendation at day 90.</span>
       <span>She is also the agent who interviewed you and set your level at E3, the same person in two roles, which is common but not required.</span>
       <span>It is a ${hl('volunteer role')}. Cohort leaders are unpaid; what they earn is the cohort-leader certification.</span>
     </span>
     <span class="tw-k">She can only lead cohorts below her own level, so she is always a step ahead of the ten of you.</span>`,
    `${twBtn('Open Cohort 41','cohort')}<button class="tw-btn ghost" data-go="messages">Message her</button>`);
}

function wCallLogistics(){
  return tw(twIc('video') + 'The weekly call',
    `<span class="tw-lines">
       <span><b>When</b>Thursday, 6:00 PM ET, every week for 13 weeks</span>
       <span><b>Long</b>60 minutes, video, you and the other nine</span>
       <span><b>Missed</b>tell your leader beforehand and it is fine. It is not recorded, so there is nothing to catch up on afterwards. Ask on the board instead</span>
     </span>
     <span class="tw-k">Times follow the time zone on your profile, which is Eastern. Reminders go out 24 hours and 1 hour before unless you have turned them off.</span>`,
    `${twBtn('Open Cohort 41','cohort')}<button class="tw-btn ghost" data-go="account">Change your time zone</button>`);
}

function wSwitch(){
  return `${hl('Not once it has started')}. Your cohort is ten people at the same level moving through the same 13 weeks together, and the group is a large part of what you are paying for, so it is assigned for you and it is fixed for the 90 days.`
    + tw('What can change',
      `<span class="tw-list">
         <span>Before your cohort starts, the support desk can move you to a later intake.</span>
         <span>Once it has started, a bad fortnight is something your leader absorbs rather than something you move cohort for.</span>
       </span>`)
    + twChips(['What is the refund window?','What happens on the weekly call?']);
}


function wSeen(){
  return tw(twIc('group') + 'Who sees your interview',
    `<span class="tw-list">
       <span>The agent who interviewed you, and the cohort leader who runs your course. Nobody else, unless you share your report yourself.</span>
       <span>Recordings are video and audio, transcribed so the agent can write the report, kept for 24 months and then deleted.</span>
       <span>You can ask for a specific recording to be deleted at any time. Deleting the recording behind a confirmed level does not reverse the level.</span>
       <span>Your weekly cohort calls are not recorded at all.</span>
     </span>
     <span class="tw-k">TalentNext ${hl('does not sell')} your data and does not share your individual progress with an employer without your written instruction.</span>`,
    twBtn('Read the data use notice','terms'));
}

function wTalScope(){
  const live = (typeof MEMO !== 'undefined')
    ? MEMO.filter((m, i) => !(S.memDrop || []).includes(i)).length : 0;
  return tw(twIc('view') + 'What I can and cannot see',
    `<span class="tw-lines">
       <span><b>I see</b>your course progress, your chapter notes, your points, your interview transcripts and your report</span>
       <span><b>I never</b>${(typeof NEVER !== 'undefined' ? NEVER : []).map(n => n.replace(/\.$/, '')).join('; ') || 'see your messages, your calls or your card'}</span>
     </span>
     <span class="tw-k">${live} things are held about you right now and every one of them opens the thing it came from. Mark a line wrong and I stop using it; forget it and it is gone. Profile is where you pause me altogether. Nothing breaks, the pages just stop carrying my summaries.</span>`,
    `${twBtn('See everything I hold','mem')}<button class="tw-btn ghost" data-go="account">Open Profile</button>`);
}

function wClose(){
  return tw(twIc('warning') + 'Closing your account',
    `<span class="tw-list">
       <span>It removes your profile, your notes and your interview recordings.</span>
       <span>Certificates and signed summaries you have already earned stay valid and stay downloadable.</span>
       <span>Profile also holds &ldquo;download everything we hold&rdquo;, which is worth doing first.</span>
     </span>
     <span class="tw-k">The control is on Profile, under Closing your account, and it asks you to confirm. I ${hl('cannot do it for you')} and I would not want to be the one that could.</span>`,
    twBtn('Open Profile','account'));
}


function wBroken(){
  const q = TAL_Q;
  if(/verif|confirmation email|activation|did ?n.?t get the email|no email/i.test(q))
    return `Give it a minute and then look in your spam folder. The sender is hello@talentnext.com. If it is not there after five minutes, the address on the account is usually the reason, and support can check it and resend.`
    + wSupport('the verification email again, with the address you signed up with');
  if(/sign ?in|log ?in|password|locked out|cannot get in/i.test(q))
    return `I cannot see anything to do with signing in. I only exist once you are already inside. Reset the password from the log-in screen first; that clears most of these, and it does not touch your course record.`
    + wSupport('a password reset by hand, if the reset email does not arrive either. Give them the address you signed up with');
  return `That is not something I can see from in here. I have your course and your interviews, not your browser or the video player.`
    + tw(twIc('renew') + 'Worth trying once',
      `<span class="tw-list">
         <span>${hl('Reload the page')}. Coursework runs inside LightspeedVT, and it is usually the frame rather than the course.</span>
         <span>If it is the same on a second browser, it is our end, not yours.</span>
       </span>`)
    + wSupport('the page you were on, what you were doing and which browser. A screenshot saves a round trip');
}

function wNoAnswers(){
  return talOff(`I ${hl('will not')} do that one. The assessment is what tells your leader where you are, and an answer I handed you tells them something false. It comes out of your level at the re-interview, not out of a mark.`
    + `<span class="tw-k">If it is the time rather than the material, say so and I will tell you the shortest honest route through this week.</span>`,
    ['How do I catch up?', 'Explain this chapter in 60 seconds', 'I am stuck, ask me a question instead']);
}

const CH_PAIR = /chapters?\s*(\d{1,2})\s*(?:and|&|,|\+|to|through|–|-)\s*(\d{1,2})/i;
const CH_ONE  = /chapters?\s*(1[0-3]|[235-9])\b(?!\d)/i;

function wScenes(){
  const kind = S.iv === 're' ? 're' : 'level';
  const set = (typeof SCENES === 'object' && SCENES[kind]) || [];
  if(!set.length) return '';
  const kept = (typeof sceneKeep === 'function' && sceneKeep(kind)) || null;
  const picked = (typeof scenePicked === 'function' && scenePicked(kind)) || [];
  const which = kind === 're' ? 're-interview' : 'level interview';
  return tw(twIc('play') + `The six moments from your ${which}`,
    `<span class="tw-lede">Each one is a stretch of the recording where you were doing
       something the interview was looking for, not a highlight, and not a
       verdict.</span>
     <span class="tw-list">
       ${set.map(s => `<span><b>${s[0]}</b><br>${s[1]} &middot; ${s[3]}</span>`).join('')}
     </span>
     <span class="tw-k">${kept
        ? 'You kept ' + kept.map(i => set[i][0]).join(', ') + '. Those three are what shows on your interview; the other three are not published anywhere.'
        : picked.length
          ? 'You have ' + picked.length + ' of three chosen. Save them and those three are what shows on your interview from now on. The other three are not published anywhere.'
          : 'Keep three of the six. Those three are what shows on your interview from now on, and the other three are not published anywhere.'}</span>`,
    twBtn('Open Interviews','interviews'));
}

TAL_ROUTES.unshift(
  [/\bscenes?\b[^.?!]{0,40}\b(chosen|choose|choosing|cut|keep|kept|pick|picked|show|shown|publish\w*|mean)\b|\b(why|which|what)\b[^.?!]{0,30}\bscenes?\b|six moments/i, wScenes],

  [/what can you (help|do)|what do you do|what are you (for|able)|how can you help|who are you|what is tal|are you (a )?(human|real|bot|ai)|what can i ask/i, wScope],

  [/\b(answers?|solutions?)\b[^.?!]{0,25}\b(assessment|quiz|test|chapter)\b|\b(assessment|quiz|test)\b[^.?!]{0,25}\banswers?\b|do (it|the assessment) for me|pass it for me/i, wNoAnswers],

  [/\b(salary|salaries|earn|pay(ing)? me|paid|worth|market rate|compensation)\b[^.?!]{0,30}\b(e[1-5]|b[1-4]|level|explorer|promotion)\b|\b(e[1-5]|level|explorer)\b[^.?!]{0,25}\b(salary|worth|earn|pays?)\b/i,
    () => talOff(`I do not have that, and TalentNext does not publish it. A level is an assessment of how you operate, made by an agent inside this product. It is not a pay band and it is not benchmarked against a market. Anyone who told you an E4 is worth a number would be making it up, and so would I.`,
      ['What would move me to E4?', 'What is on my report?'])],

  [/\bget me a job\b|find me a (job|role|position)|place me|do you place|recruit|hiring|apply for (a )?(job|role)|introduce me to (an )?employer/i,
    () => talOff(`TalentNext does not place people. It assesses how you operate and gives you a level and a record you can show. What you do with that is yours. There is no job board in here and I cannot introduce you to anyone.`,
      ['What is in the 90-day summary?', 'What do I have at the end?'])],

  [/performance review|appraisal|write (my|a) review|review for (my|one of my)|\b1:1 (notes|doc)\b|write up my (report|team)/i,
    () => talOff(`Not that one. I write about your work on this course: a reply in the messages thread, or your chapter note turned into a proper reflection. A review of somebody on your team is a judgement I have no part of and a document I have never seen the shape of.`,
      ['Help me word a reply', 'Turn my note into a reflection'])],

  [/\b(joke|weather|football|recipe|who won|your favourite|favorite)\b|what do you think of (my|the) (boss|manager|company|employer)|should i (quit|resign|leave my job)|\b(is|are) my (boss|manager) \b/i,
    () => talOff(`That is outside what I am for. I am the assistant inside your course: the 13 chapters, your level, your interviews, your cohort and what I hold about you. I am not the one to ask about your job or the people in it, and I would rather say so than have an opinion.`,
      ['What should I do next?', 'How am I doing overall?'])],

  [/\b(will ?not|won.?t|does ?not|doesn.?t|did ?not|didn.?t|cannot|can.?t|unable to|failed to)\b[^.?!]{0,22}\b(play|load|open|sign in|log ?in|save|saved|submit|start|work|working|upload)\b|\b(broken|blank|stuck loading|crash(ed|ing)?|frozen|not working|lost my progress|locked out)\b|\b(verif\w+|confirmation|activation)\b[^.?!]{0,20}\bemail\b|did ?n.?t get the email|forgot my password|reset my password/i,
    wBroken],

  cand(/\b(card)\b[^.?!]{0,25}\b(stored|store|kept|keep|safe|secure|held)\b|\b(store|keep|saving|hold)\b[^.?!]{0,20}\bcard\b|\bpci\b|is my (card|payment) (data|info\w*) safe/i, wCard, 'a card'),

  [/\b(reschedul\w+|move|cancel\w*|postpone|push back|change the (date|time|slot))\b[^.?!]{0,30}\b(interview|slot|booking|appointment|re-?interview)\b|\b(interview|slot|booking)\b[^.?!]{0,30}\b(reschedul\w+|cancel\w*|postpone|moved?)\b|\bno.?show\b/i, wMove],

  cand(/charged twice|double charge|charged (me )?(twice|again|two)|wrong amount|overcharg\w+|dispute|unauthori[sz]ed|took the money twice|refund my/i, wBillingProblem, 'a charge'),

  cand(/\b(paid|payments? history|receipt|invoice|statement|charges?|charged|transaction)\b|what have i (paid|spent)|how much have i|\b(change|update|remove|add|new)\b[^.?!]{0,20}\bcard\b/i, wLedger, 'a payment'),

  cand(/refund|money back|cancellation policy|cancel the course|\bfee\b[^.?!]{0,20}\brefund\w*\b|is it refundable/i, wRefund, 'a refund'),

  cand(/\b(who pays|cost|costs|price|priced|fee|charge|pay|paid|free|included|extra)\b[^.?!]{0,30}\bre-?interview\b|\bre-?interview\b[^.?!]{0,30}\b(cost|costs|price|fee|paid|pay|free|included|extra)\b/i, wReCost, 'a fee'),

  cand(/how much (does|is|do|will) (it|this|the course|the whole)|what does (it|the course|this) cost|\b(total )?cost\b|\bprice of\b|course fee|\bfees?\b|instal(l)?ment|payment plan|pay monthly|split the payment|discount|coupon|promo|cheaper|bursary|scholarship/i, wCost, 'a fee'),

  [/questions (in advance|first|beforehand|up front)|see the questions|know the questions|what will (they|she|he) ask|list of questions/i, wNoQuestions],

  [/what should i not do|what not to do|things to avoid|\bavoid\b[^.?!]{0,25}\binterview\b|common mistakes|get it wrong|mess (it|this) up|put (them|her|him) off/i, wNotDo],

  [/how (soon|long|quickly)[^.?!]{0,30}\b(level|report|result|score)\b|when (do|will) i (get|know|see)[^.?!]{0,25}\b(level|report|result)\b|\breport\b[^.?!]{0,20}\b(back|ready|when)\b/i, wWhenLevel],

  [/\b(rank|ranking|rating|star|stars|score|number)\b[^.?!]{0,30}\b(mean|means|meaning|based on|calculated|for)\b|what does the (rank|rating|star|number)|how are agents (ranked|rated|ordered|sorted)/i, wRank],

  [/pricier|more expensive|expensive agent|cheaper agent|\bprice\b[^.?!]{0,30}\b(mean|matter|better|higher|quality|score|level)\b|does paying more|worth paying more|\bcost\b[^.?!]{0,25}\bbetter (agent|level|report)\b/i, wPrice],

  [/\bcompare\b[^.?!]{0,30}\b(priya|owen|lena|samuel|hana|agents?)\b|\b(priya|owen|lena|samuel|hana)\b[^.?!]{0,15}\b(vs|versus|or)\b[^.?!]{0,15}\b(priya|owen|lena|samuel|hana)\b|difference between (priya|owen|lena|the agents|two agents)|which of them|\bwhich agent\b[^.?!]{0,20}\b(better|right for me|should i)\b/i,
    wAgentPair],

  [/who (leads|runs|is)[^.?!]{0,25}\b(cohort|leader|my leader)\b|\b(cohort )?leader\b[^.?!]{0,20}\b(who|name|is)\b|who is my (leader|mentor)|about my leader|contact (my )?(cohort )?leader|message my leader|is (the|my) leader paid/i, wLeader],

  [/\b(miss|missed|missing|skip)\b[^.?!]{0,30}\b(call|session|thursday)\b|\b(call|session)\b[^.?!]{0,25}\b(recorded|recording|replay|catch up)\b|what time (is|are)[^.?!]{0,20}\b(call|calls|session)\b|time ?zone|how long is the call|how often (is|are) the call/i, wCallLogistics],

  cand(/change (my )?cohort|switch (my )?cohort|different cohort|another cohort|move cohort|join a (later|different) cohort|swap cohort/i, wSwitch, 'a cohort place'),

  cand(/when (does|do|will)[^.?!]{0,30}\b(finish|end|ends|over|done|complete|graduat\w+)\b|how (much )?(long|many (days|weeks))[^.?!]{0,25}\b(left|to go|remaining|until)\b|\b(finish|end) date\b|last (day|week) of the course/i, wFinish, 'a course'),

  cand(/\bpause\b|\bdefer\b|\bextension\b|extend (my|the) course|take a break|freeze my|put (it|the course) on hold|drop out|quit the course|\bwithdraw\b/i, wPause, 'a course place'),

  [/who (can |else )?(see|sees|read|reads|has access)|who else (sees|can)|\bshare\b[^.?!]{0,25}\b(employer|manager|boss|company)\b|\bemployer\b[^.?!]{0,25}\b(see|told|know|share)\b|\brecording(s)?\b[^.?!]{0,25}\b(deleted|delete|kept|keep|stored|store|how long|retain\w*)\b|\b(delete|deleted|how long)\b[^.?!]{0,25}\brecording(s)?\b|sell my data|\bgdpr\b|my data|is (my|the) (data|interview) private/i, wSeen],

  [/turn (you|tal) off|switch (you|tal) off|disable (you|tal)|stop (you|tal) (from )?(reading|seeing|using|watching)|opt out of (you|tal|ai)|do not use my|stop reading my (notes|messages)|can you see my (messages|card|payments)|what can(o|')?t you see|what do you not see/i, wTalScope],

  [/delete (my )?account|close (my )?account|deactivate|remove my account|download (everything|my data|all my data)|export my data/i, wClose],

  [CH_PAIR, () => { const m = TAL_Q.match(CH_PAIR); return m ? wChapterAny([+m[1], +m[2]]) : ''; }],

  [CH_ONE, () => { const m = TAL_Q.match(CH_ONE); return m ? wChapterAny([+m[1]]) : ''; }],

  cand(/\b(move|moving|get|getting|step|progress|promot\w+|climb)\b[^.?!]{0,25}\b(me )?up\b|move me up|\b(get|getting) to (e[1-5]|the next level)\b|how do i (progress|advance|get promoted)|next level|what would move me/i, wMoveUp, 'a level'),

  cand(/\b(lowest|worst|weakest|dragged|dragging|pulling|pulled|bringing)\b[^.?!]{0,30}\b(average|score|down|mark)\b|\baverage\b[^.?!]{0,25}\b(down|lowest|worst)\b|which chapter did i do (worst|badly)/i, wLowest, 'an assessment score'),

  cand(/how (am i|is it) (doing|going)|how am i doing|am i doing (ok|okay|well|badly|alright)|how do i compare (with|to) (my )?cohort|where do i stand|my (overall )?progress|how far (through|along) am i/i, wStanding, 'a course record'),

  cand(/how far behind|am i behind|\bbehind\b[^.?!]{0,25}\b(others|cohort|schedule|pace)\b|catch up|caught up|falling behind|\bon track\b|keeping up/i, wPace, 'a course pace'),

  cand(/what should i do next|what (do i|should i) do now|what next|whats next|what is next(?! week)|where do i (start|begin)|what now|priorit(y|ies)|most important thing/i, wNext, 'a course'),

  cand(/90.?day (cycle|course|structure|programme|program)|explain the 90|how (does|do) the (90|course|cycle) work|how is the course structured|what are the 90 days|structure of the course/i, wCycle, 'the 90 days'),

  cand(/90.?day summary|what is in the summary|the summary document/i, wSummary, 'a summary'),

  cand(/\b(certificate|certification|certified|diploma|qualification|credential)\b|what do i (get|have|leave with) at the end|what do i get out of|end of the (course|90)/i, wEnd, 'a certification'),

  [/hard conversation|difficult conversation|awkward conversation/i,
    () => (typeof ivtAnswer === 'function'
      ? ivtAnswer('Priya asked you for a real hard conversation, and this is the exchange it turned into. Chapter 5 is built on the same thing.',
          ivtFind(S.iv === 're' ? 're' : 'level', 'conflict'), S.iv === 're' ? 're' : 'level')
        || wChapterAny([5])
      : wChapterAny([5]))]
);

TAL_ROUTES.push([/[\s\S]/, talNoAnswer]);

const _talReplyBase = talReply;
talReply = function(q){
  TAL_Q = String(q || '');
  let html = null;
  try { html = _talReplyBase(TAL_Q); } catch(e){ console.warn('talReply', e); }
  return twTop(html || talNoAnswer());
};

function twTop(html){
  return /^\s*<span class="tw">/.test(html)
    ? html.replace('<span class="tw">', '<span class="tw tw-top">')
    : html;
}

TALCTX.billing = ['What does the course fee cover?', 'What is the refund window?', 'Is my card stored?'];


render();
