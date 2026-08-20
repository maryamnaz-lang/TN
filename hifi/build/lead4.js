/* ==========================================================================
   MESSAGES, CERTIFICATIONS, AND THE LEADER'S OWN PROFILE

   The last three modules. Two of them are about other people and one is the
   only page on this portal that is about Priya.

   THE BOARD IS THE SAME BOARD. `ROOM` in views.js is Cohort 41's discussion
   and the candidate reads it on their own Cohort page; the wireframe's leader
   read the identical thread from the other side, and that was the point of
   sharing it. So Cohort 41's board here IS `ROOM` — the same array, so a post
   made on this portal is on the candidate's page when the switcher flips, and
   the two sides cannot drift. The other two cohorts get their own boards
   because nothing on the candidate side has drawn them yet.
   ========================================================================== */

/* --------------------------------------------------------------------------
   THE OTHER TWO BOARDS

   Cohort 33 is in week 11 and its board sounds like it: people comparing
   notes on the end of the ninety days. Cohort 47 is four days old, so its
   board is the leader's own opening post and one reply — a thin board is the
   honest drawing of a cohort that has barely started, and it is what makes
   the picker worth having.

   Same row shape as `ROOM` — [name, img, initials, body, when, mine] — so
   `roomLine` draws all three without a branch, and `mine` marks a post as the
   leader's own.
   -------------------------------------------------------------------------- */
const LDR_BOARDS = {
  33: [
    ['day','Yesterday'],
    ['Owen Clarke','owen','OC','Two chapters left and I have started re-reading my own notes from week 1. The delegation stuff reads completely differently now.','5:20 PM'],
    ['Lena Fischer','lena','LF','Same. I went back to chapter 4 last night and it was almost annoying how obvious it seemed.','6:02 PM'],
    ['day','Today'],
    ['Priya Nair','priya','PN','That is exactly what week 11 is supposed to feel like. Bring one thing you would do differently now to Friday and we will spend the hour on those rather than on chapter 12.','8:15 AM',true],
    ['Zoe Bennett','lena','ZB','I am behind the rest of you — is it worth catching up before Friday or just coming as I am?','9:47 AM']
  ],
  47: [
    ['day','Monday'],
    ['Priya Nair','priya','PN','Welcome to Cohort 47. First call is Monday at 6. Before then: open chapter 1, and post one sentence here about what you are hoping to get out of the ninety days.','9:00 AM',true],
    ['Ahmed Farouk','owen','AF','Hoping to stop being the bottleneck on my own team. That is the honest version.','11:34 AM'],
    ['Beatriz Lima','lena','BL','Mine is hard conversations. I avoid them until they are twice as hard.','2:12 PM']
  ]
};

const ldrBoard = id => +id === LEAD_COHORTS[0].id ? ROOM : (LDR_BOARDS[id] || []);
const ldrPosts = id => ldrBoard(id).filter(r => r[0] !== 'day').length;

/* --------------------------------------------------------------------------
   THE LEADER'S ONE-TO-ONE THREADS

   Three candidates, and each thread is about the thing their flag says. The
   candidate side draws its own half of the Priya thread in `V.messages`; this
   is not that thread — Maryam's is with her own leader and Maryam is in
   Cohort 41, so it IS the same relationship. It is left out of this list on
   purpose: the three here are the three the flags say Priya owes a message,
   which is what a leader opens this page to do.
   -------------------------------------------------------------------------- */
const LDR_THREADS = [
  {who:'Yuki Tanaka', i:'YT', img:'hana', co:41, msgs:[
    {me:1, t:'Yuki — you have not been in since week 1 and I would rather ask than assume. Is the course the problem, or is it everything else?', w:'Mon 9:12 AM'},
    {me:0, t:'Sorry. Work went sideways and I kept telling myself I would catch up at the weekend, and then I did not.', w:'Mon 10:40 PM'},
    {me:1, t:'That is the normal version of this, not the shameful one. Do not try to catch up — start at chapter 2 and come to Thursday even if you have done nothing. Turning up is the part that restarts it.', w:'Tue 8:05 AM'}
  ]},
  {who:'James Whitby', i:'JW', img:'owen', co:41, msgs:[
    {me:0, t:'I have re-taken the chapter 4 assessment three times and I am still at 65. Should I keep going at it?', w:'Yesterday 7:15 PM'},
    {me:1, t:'No. Leave it at 65 and move to 5. Four is the one that only makes sense after you have tried the thing at work and it has gone badly once. Come back to it in week 8 and it will score itself.', w:'Yesterday 8:02 PM'}
  ]},
  {who:'Tobias Mensah', i:'TM', img:'samuel', co:41, msgs:[
    {me:1, t:'Tobias — eight days quiet and 18% at week 5. Not chasing you, just checking the course is still something you want.', w:'2 days ago'}
  ]}
];

S.ldrMsg = 'boards';
S.ldrBoardCo = LEAD_COHORTS[0].id;
S.ldrTh = 0;
S.ldrEditProfile = false;
S.ldrAvail = false;

/* ==========================================================================
   MESSAGES

   ONE TAB STRIP, NOT TWO. The wireframe had a pair of buttons for the two
   sections and then a second list inside each one to pick the cohort or the
   thread. Two strips stacked is two decisions before you have read anything.
   Here the strip picks the SECTION, and what it picks between is a board with
   a cohort picker made of buttons and a thread list made of rows — a picker
   for three things that are the same kind, and a list for three things that
   are each a person.

   THE COMPOSER IS THE PRODUCT'S OWN, on both. `.composer` with `.room-composer`
   is what the candidate's cohort board uses and `.composer` alone is what
   their one-to-one uses, so the leader's two surfaces are drawn by the two
   components the candidate already reads.
   ========================================================================== */
V.leadMessages = () => {
  const tab = S.ldrMsg;
  const co = lcoOf(S.ldrBoardCo);
  const board = ldrBoard(co.id);
  const th = LDR_THREADS[S.ldrTh] || LDR_THREADS[0];
  const unread = LDR_THREADS.filter(t => t.msgs[t.msgs.length-1].me === 0).length;

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Messages')}
  ${ph('Messages','The cohort boards, which your candidates read too, and your one-to-one threads.')}
  <div class="sec sec-cs">
    <div class="cs">
      <button class="${tab === 'boards' ? 'on' : ''}" data-ldrmsg="boards">Cohort boards<span class="lf-n">${LEAD_COHORTS.length}</span></button>
      <button class="${tab === 'direct' ? 'on' : ''}" data-ldrmsg="direct">Direct${unread ? `<span class="lf-n">${unread}</span>` : ''}</button>
    </div>
  </div>
  ${tab === 'boards' ? `
  <div class="sec">
    <div class="sec-h"><h2>${lname(co)}</h2><span class="t-helper-01">${co.members.length} members &middot; week ${co.week} of 13</span></div>
    <div class="btn-set ldr-picker">
      ${LEAD_COHORTS.map(c => `<button class="btn ${c.id === co.id ? 'btn-p' : 'btn-g'} noic" data-ldrboard="${c.id}">${lname(c)} <span class="ldr-n">${ldrPosts(c.id)}</span></button>`).join('')}
    </div>
    <p class="t-helper-01 mt4">This is the same board your candidates see on their own Cohort page. Anything you post here, the whole group reads.</p>
  </div>
  <div class="sec tint">
    ${board.length ? `<div class="msgs room">
      ${board.map(r => r[0] === 'day'
        ? `<div class="m-day"><span>${r[1]}</span></div>`
        : roomLine(r[0], r[1], r[2], r[3], r[4], r[5])).join('')}
    </div>` : `<div class="empty" style="border:0">${I.chat}
      <h3>Nothing posted yet</h3><p>${lname(co)} started ${co.day} day${co.day === 1 ? '' : 's'} ago. Opening the board yourself is usually what starts it.</p></div>`}
    <div class="composer room-composer">
      <span class="composer-star">${I.ai}</span>
      <input class="inp" id="ldrPost" placeholder="Post to ${lname(co)}" aria-label="Post to the cohort">
      <button class="composer-act" aria-label="Attach a file">${I.attachment}</button>
      <button class="composer-send" data-ldrpost="1" aria-label="Post">${I.send}</button>
    </div>
  </div>` : `
  <div class="sec">
    <div class="sec-h"><h2>Your threads</h2><span class="t-helper-01">${unread ? unread + ' waiting on a reply from you' : 'nothing waiting'}</span></div>
    <div class="tile-stack">
      ${LDR_THREADS.map((t,i) => {
        const last = t.msgs[t.msgs.length-1];
        return `<button class="tile clk gcard face-row${i === S.ldrTh ? ' ldr-on' : ''}" data-ldrth="${i}">
          <span class="mem-av mem-ph">${avatar({i:t.i, img:AV[t.img]}, 36)}</span>
          <span class="gcard-b"><h3>${t.who} ${last.me === 0 ? '<span class="tag org sm">Your reply</span>' : ''}</h3>
            <span class="sub">Cohort ${t.co} &middot; ${t.msgs.length} message${t.msgs.length === 1 ? '' : 's'} &middot; ${last.w.toLowerCase()}</span></span>
          <svg class="tile-arrow" viewBox="0 0 24 24">${inner('chevRight')}</svg>
        </button>`;
      }).join('')}
    </div>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>${th.who}</h2><span class="t-helper-01">Private &middot; Cohort ${th.co}</span></div>
    <div class="msgs">
      ${th.msgs.map(msg => `<div class="m ${msg.me ? 'me' : 'them'}">
        <span class="m-av">${avatar(msg.me ? {i:LEADER.i, img:LEADER.img} : {i:th.i, img:AV[th.img]}, 32)}</span>
        <div class="m-c">
          <div class="m-b">${msg.t}</div>
          <div class="m-w">${msg.me ? 'You' : th.who} &middot; ${msg.w}</div>
        </div>
      </div>`).join('')}
    </div>
    <div class="composer">
      <span class="composer-star">${I.ai}</span>
      <input class="inp" id="ldrReply" placeholder="Reply to ${th.who.split(' ')[0]}" aria-label="Reply">
      <button class="composer-act" aria-label="Attach a file">${I.attachment}</button>
      <button class="composer-send" data-ldrreply="1" aria-label="Send">${I.send}</button>
    </div>
    <p class="t-helper-01 mt4">You can see ${th.who.split(' ')[0]}&rsquo;s chapter progress, scores and attendance, so a thread never has to open by asking where they have got to.</p>
  </div>`}
</div></main>`;
};

/* ==========================================================================
   CERTIFICATIONS

   WHAT LEADING EARNS, AND IT IS NOT MONEY. This is the module that replaced
   Earnings, and the replacement is the whole argument: a cohort leader
   volunteers, and certifications are how the contribution is recognised. The
   note saying so is the one wireframe note that IS for the leader, so it
   crosses.

   A CERTIFICATION IS A `.cert`, THE COMPONENT THE CANDIDATE GETS AT THE END
   OF A COURSE. Same object, same drawing: a mark, an eyebrow, a name, the
   date and the signature, and something to download. The wireframe drew them
   as a four-column table; a table is right for comparing cohorts and wrong
   for a thing you earned and want to look at.

   THE ONE IN PROGRESS IS NOT A `.cert`, because there is nothing to download
   and a greyed-out certificate is a certificate you have not got. It is a
   requirements list — the three things it takes and which are done — which is
   the only page on this portal that tells the leader what to do next for
   themselves.
   ========================================================================== */
const LDR_CERTS = [
  {n:'Certified Cohort Leader', track:'Foundation', on:'February 12, 2026', by:'TalentNext'},
  {n:'Assessment &amp; Levelling', track:'Core', on:'March 3, 2026', by:'TalentNext'},
  {n:'90-Day Programme Facilitation', track:'Core', on:'April 21, 2026', by:'TalentNext'}
];

V.leadCerts = () => {
  const led = 8, hours = 42;
  const promoted = 34;
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Certifications')}
  ${ph('Certifications','What leading earns you. Cohorts closed, candidates promoted, and the certification each one counts towards.')}
  <div class="sec">
    <div class="stats">
      ${statCell(I.certificate, 'Certifications', LDR_CERTS.length, 'one more in progress')}
      ${statCell(I.group, 'Cohorts led', led, 'as a volunteer')}
      ${statCell(I.trophy, 'Candidates promoted', promoted, 'across those eight cohorts')}
      ${statCell(I.time, 'Training hours', hours, 'this year')}
    </div>
  </div>
  <div class="sec">
    <div class="note"><span>${I.info}</span><div class="nb"><b>Leading is a volunteer role</b>There are no fees and no settlements on this side of TalentNext. What the time earns is recognised in certifications and in the training that leads to them &mdash; and a certification is what lets you assess a wider band.</div></div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Earned</h2><span class="t-helper-01">Yours to keep and to share</span></div>
    ${LDR_CERTS.map(c => `
    <div class="cert">
      <span class="cert-mark">${I.certificate}</span>
      <div class="cert-b">
        <div class="cert-eb">${c.track} track</div>
        <div class="n">${c.n}</div>
        <div class="m">Awarded ${c.on} &middot; ${LEADER.n}</div>
        <div class="m">Issued by ${c.by}</div>
      </div>
      <div class="cert-act">
        <button class="btn btn-sm noic cert-btn">Download</button>
        <button class="btn btn-sm noic cert-btn">Share link</button>
      </div>
    </div>`).join('')}
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>In progress</h2><span class="t-helper-01">Candidate Mentoring &middot; Advanced track</span></div>
    <div class="tile">
      <div class="kv"><span class="k">What it opens</span><span class="v n">Assessing the Builder band, B1 to B3</span></div>
      <div class="kv"><span class="k">Awarded when</span><span class="v n">All three below are complete</span></div>
    </div>
    <ol class="steps mt5">
      <li><span class="s-n">${I.checkFilled}</span><span class="s-b"><b>Lead six cohorts to completion</b>
        Eight closed, so this one is done. Completion means the cohort finished the ninety days, not that every candidate was promoted.</span></li>
      <li><span class="s-n">${I.checkFilled}</span><span class="s-b"><b>Forty hours of leader training</b>
        ${hours} hours this year. The Advanced track adds twelve more, which is the part still open.</span></li>
      <li><span class="s-n">3</span><span class="s-b"><b>Twelve signed level decisions reviewed</b>
        Nine of twelve reviewed by the manager of cohort leaders. The three waiting are from the cohorts you closed in June.</span></li>
    </ol>
    <p class="t-helper-01 mt4">Reviewed means a manager of cohort leaders read your decision against the transcript and agreed with the rung. It is the one requirement you cannot finish on your own.</p>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>The record behind them</h2></div>
    <div class="facts">
      <div><span class="l">Leading since</span><span class="v">${LEADER.since}</span></div>
      <div><span class="l">Cohorts closed</span><span class="v">${led}</span></div>
      <div><span class="l">Interviews conducted</span><span class="v">62</span></div>
      <div><span class="l">Assessing range</span><span class="v">${LEADER.range}</span></div>
    </div>
  </div>
</div></main>`;
};

/* ==========================================================================
   THE LEADER'S PROFILE

   THE MONEY PROBLEM, STATED. Priya is in `AGENTS` on the candidate side with
   a price of $95, because as a TALENT AGENT she is paid for a 45-minute
   interview. As a COHORT LEADER she volunteers. Both are true of the same
   person and the wireframe never had to face it, because its leader was a
   different human from any of its agents.

   So this page does NOT draw `agentCardH('priya')`, which would be the neat
   reuse: that component prints `a.price`, and a fee on the volunteer portal
   would contradict the rule lead.js is built on in the one place a leader
   looks at themselves. What it draws instead is the part of the public listing
   that IS about leading — the rating, the interviews, the range and the bio —
   and it says which of the two roles the page is about.

   EDITING IS A SHEET, READING IS THE PAGE. Same shape as the candidate's own
   Profile: `.idhead` with the photo, a `.tile` of `.kv` rows for what is set,
   and an Edit control on the row it edits (§29.10). A page of live inputs
   would be the wireframe's drawing, and this product does not have one.
   ========================================================================== */
V.leadProfile = () => `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Your profile')}
  ${ph('Your profile','What candidates read when they choose you, the band you assess, and the times you are open.')}
  <div class="sec">
    <div class="idhead">
      <span class="av-ph" style="width:72px;height:72px"><i>${LEADER.i}</i><img src="${LEADER.img}" alt=""></span>
      <div class="idhead-b">
        <span class="idname">${LEADER.n}</span>
        <span class="idmeta">Volunteer cohort leader &middot; leading since ${LEADER.since}</span>
        <span class="tag sm">Assesses ${LEADER.range}</span>
      </div>
      <div class="idhead-a"><button class="btn btn-g" data-ldrprof="1">Edit details ${I.edit}</button></div>
    </div>
    <div class="tile">
      <div class="kv"><span class="k">Display name</span><span class="v">${LEADER.n}</span></div>
      <div class="kv"><span class="k">Specialism</span><span class="v n">Operations teams, first-line leadership</span></div>
      <div class="kv"><span class="k">Assessing range</span><span class="v n">${LEADER.range} &middot; set by your certifications</span></div>
      <div class="kv"><span class="k">Session length</span><span class="v n">45 minutes</span></div>
      <div class="kv"><span class="k">Role</span><span class="v n">Volunteer cohort leader &middot; unpaid</span></div>
    </div>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>What candidates see</h2><span class="t-helper-01">Your card in the agent list</span></div>
    <div class="tile">
      <div class="idhead" style="padding-top:0">
        <span class="av-ph" style="width:56px;height:56px"><i>${LEADER.i}</i><img src="${LEADER.img}" alt=""></span>
        <div class="idhead-b">
          <span class="idname">${LEADER.n}</span>
          <span class="idmeta">${stars(4.9)} 4.9 &middot; 62 interviews &middot; ${LEADER.range}</span>
        </div>
      </div>
      <p class="t-helper-01">&ldquo;Fifteen years running operations teams. I am direct, I move quickly, and I do not pad feedback &mdash; if something is not working I will say so in the first ten minutes.&rdquo;</p>
    </div>
    <p class="t-helper-01 mt4">This is your listing as a cohort leader. Interview fees, where they apply, are set on your agent listing and not here &mdash; leading a cohort is unpaid.</p>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Availability</h2><span class="t-helper-01">Candidates can only book what you open</span></div>
    <div class="tile-stack">
      <div class="cardrow">
        <span class="cardrow-ic">${I.calendar}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">Weekly calendar</span>
          <span class="cardrow-d">Tuesday and Thursday afternoons, Friday morning &middot; 6 slots open next week</span>
        </span>
        <span class="cardrow-a">
          <button class="btn btn-sm noic" data-ldravail="1">Manage</button>
        </span>
      </div>
      <div class="cardrow">
        <span class="cardrow-ic">${I.group}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">Cohort calls</span>
          <span class="cardrow-d">${LEAD_COHORTS.map(c => c.callDay + ' ' + c.callTime.toLowerCase()).join(' &middot; ')}</span>
        </span>
        <span class="cardrow-a">
          <button class="btn btn-sm noic" data-go="leadCohorts">Cohorts</button>
        </span>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Your standing</h2><span class="t-helper-01">Read-only &middot; across every cohort you have closed</span></div>
    <div class="facts">
      <div><span class="l">Candidate rating</span><span class="v stand-rate">${stars(4.9)}4.9</span></div>
      <div><span class="l">Interviews conducted</span><span class="v">62</span></div>
      <div><span class="l">Completion rate</span><span class="v">84%</span></div>
      <div><span class="l">Level movement</span><span class="v">+0.8 rungs</span></div>
    </div>
    <p class="t-helper-01 mt4">Completion rate is the one of the four you cannot improve by being generous at evaluation &mdash; levelling somebody too high comes back later as a candidate who does not finish.</p>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Who reviews you</h2></div>
    <div class="tile">
      <div class="kv"><span class="k">You</span><span class="v">Cohort leader</span></div>
      <div class="kv"><span class="k">Reviewed by</span><span class="v n">Manager of cohort leaders, then supervisor</span></div>
      <div class="kv"><span class="k">Your own level</span><span class="v n">Adjustable by a super-admin</span></div>
      <div class="kv"><span class="k">Decisions reviewed</span><span class="v n">9 of 12 signed this year</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Notifications</h2></div>
    <label class="tg"><div class="tb"><b>A candidate goes quiet</b><span>After four days without a sign-in</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>An interview is booked with you</b><span>As soon as a candidate takes a slot</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Posts on a cohort board</b><span>A daily digest rather than each one</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Evaluation reminders</b><span>24 hours before the 48-hour deadline</span></div><input type="checkbox"><span class="sw"></span></label>
  </div>
</div></main>`;

/* ==========================================================================
   THE TWO SHEETS THIS PAGE OWNS
   Pushed onto lead2.js's registry rather than mounted separately, so every
   leader-side sheet lives in the one host that pass already maintains.
   ========================================================================== */
function ldrProfileSheet(){
  return `<div class="modal ${S.ldrEditProfile ? 'on' : ''}" data-ldrclose="prof">
    <div class="sheet">
      <div class="sheet-h"><h2>Edit your details</h2>
        <button class="x" data-ldrclose="prof" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="idhead mb6">
          <span class="av-ph" style="width:64px;height:64px"><i>${LEADER.i}</i><img src="${LEADER.img}" alt=""></span>
          <div class="idhead-b">
            <span class="idname">Your photo</span>
            <span class="idmeta">Shown on your card and to every cohort you lead.</span>
            <button class="lk">Change photo</button>
          </div>
        </div>
        <div class="f"><label for="ldrPn">Display name</label>
          <input class="inp" id="ldrPn" value="${LEADER.n}"></div>
        <div class="f"><label for="ldrPs">Specialism</label>
          <input class="inp" id="ldrPs" value="Operations teams, first-line leadership"></div>
        <div class="f"><label for="ldrPb">Bio shown on your card</label>
          <textarea class="inp" id="ldrPb" rows="3">Fifteen years running operations teams. I am direct, I move quickly, and I do not pad feedback — if something is not working I will say so in the first ten minutes.</textarea></div>
        <div class="f"><label for="ldrPl">Session length</label>
          <select class="inp" id="ldrPl"><option>45 minutes</option><option>30 minutes</option><option>60 minutes</option></select></div>
        <p class="t-helper-01">Your assessing range comes from your certifications and cannot be set here.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-ldrclose="prof">Cancel</button>
        <button class="btn btn-p noic" data-ldrclose="prof">Save changes</button>
      </div>
    </div>
  </div>`;
}

/* THE CALENDAR IS A WEEK OF TOGGLES, not a month grid. What a leader opens is
   a repeating weekly pattern — "Tuesday afternoons" — and a month view would
   ask them to do that fifty-two times. `.tg` with `.sw` is the product's own
   switch row, so the availability a candidate books against is drawn by the
   same control as the notification a leader turns off. */
const LDR_DAYS = [['Monday','Cohort 47 call at 6:00 PM',0],['Tuesday','2:00 – 5:00 PM',1],
                  ['Wednesday','Nothing open',0],['Thursday','2:00 – 5:00 PM &middot; Cohort 41 call at 6:00 PM',1],
                  ['Friday','9:00 AM – 12:00 PM &middot; Cohort 33 call at 5:00 PM',1],
                  ['Saturday','Nothing open',0],['Sunday','Nothing open',0]];

function ldrAvailSheet(){
  return `<div class="modal ${S.ldrAvail ? 'on' : ''}" data-ldrclose="avail">
    <div class="sheet">
      <div class="sheet-h"><h2>Your weekly availability</h2>
        <button class="x" data-ldrclose="avail" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <p class="t-helper-01 mb6">Candidates can only book the hours you open here. Your three cohort calls are fixed and shown for context &mdash; they are not bookable.</p>
        ${LDR_DAYS.map(([d,detail,on],i) => `
        <label class="tg"><div class="tb"><b>${d}</b><span>${detail}</span></div>
          <input type="checkbox" id="ldrDay${i}" ${on ? 'checked' : ''}><span class="sw"></span></label>`).join('')}
        <p class="t-helper-01 mt5">Six slots open next week. A candidate booking one of them is the interview appearing on your Sessions page.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-ldrclose="avail">Cancel</button>
        <button class="btn btn-p noic" data-ldrclose="avail">Save availability</button>
      </div>
    </div>
  </div>`;
}

LDR_SHEETS.push(ldrProfileSheet, ldrAvailSheet);

/* ==========================================================================
   THE LISTENERS
   ========================================================================== */
device.addEventListener('click', e => {
  const t = e.target;

  const ms = t.closest('[data-ldrmsg]');
  if(ms){ S.ldrMsg = ms.dataset.ldrmsg; render(); return; }

  const bd = t.closest('[data-ldrboard]');
  if(bd){ S.ldrBoardCo = +bd.dataset.ldrboard; render(); return; }

  const th = t.closest('[data-ldrth]');
  if(th){ S.ldrTh = +th.dataset.ldrth; render(); return; }

  /* POSTING PUTS IT ON THE SHARED ARRAY. Cohort 41's board IS `ROOM`, so a
     post here is on the candidate's Cohort page the moment the switcher
     flips — which is the whole reason the two sides share one board. `true`
     in the last field is what marks a line as the poster's own; on this
     portal that is the leader, and `roomLine` prints "You" for it. */
  if(t.closest('[data-ldrpost]')){
    const box = device.querySelector('#ldrPost');
    const text = box ? box.value.trim() : '';
    if(!text){ if(box) box.focus(); return; }
    ldrBoard(S.ldrBoardCo).push([LEADER.n, 'priya', LEADER.i, text, 'Just now', true]);
    render();
    return;
  }

  if(t.closest('[data-ldrreply]')){
    const box = device.querySelector('#ldrReply');
    const text = box ? box.value.trim() : '';
    if(!text){ if(box) box.focus(); return; }
    (LDR_THREADS[S.ldrTh] || LDR_THREADS[0]).msgs.push({me:1, t:text, w:'Just now'});
    render();
    return;
  }

  const pf = t.closest('[data-ldrprof]');
  if(pf){ S.ldrEditProfile = true; render(); return; }

  const av = t.closest('[data-ldravail]');
  if(av){ S.ldrAvail = true; render(); return; }

  const cl = t.closest('[data-ldrclose]');
  if(cl && (cl.dataset.ldrclose === 'prof' || cl.dataset.ldrclose === 'avail')){
    if(cl.classList.contains('modal') && t !== cl) return;
    if(cl.dataset.ldrclose === 'prof') S.ldrEditProfile = false;
    if(cl.dataset.ldrclose === 'avail') S.ldrAvail = false;
    render();
    return;
  }
});

/* Enter posts, on both composers, because a composer that only responds to a
   button is a composer you have to reach for the mouse to use. */
device.addEventListener('keydown', e => {
  if(e.key !== 'Enter' || e.shiftKey) return;
  if(e.target.id === 'ldrPost'){ e.preventDefault(); device.querySelector('[data-ldrpost]').click(); }
  if(e.target.id === 'ldrReply'){ e.preventDefault(); device.querySelector('[data-ldrreply]').click(); }
});

/* ==========================================================================
   THE FOUR NEW PAGES NAME THEMSELVES

   `LEAD_TAL.where` is the leader's map of view to page name, written in
   lead.js for the Tal panel's own header and copied into `ASK_WHERE` for the
   ask field's "Back to ..." label. It has an entry per module, which was
   every leader page there was. These four are pages UNDER a module — a
   roster, a candidate, a decision, a summary — and without an entry each one
   would be labelled "TalentNext" by ai4's fallback.

   `.ctx` is the same story for Tal's suggested questions: a page with no
   entry falls back to the dashboard's three, which ask about the wrong page.
   Extended from here rather than edited in lead.js, so the module map and the
   detail map are each written where the pages they name are built.
   ========================================================================== */
Object.assign(LEAD_TAL.where, {
  leadCohort:'a cohort', leadMember:'a candidate',
  leadEval:'a level decision', leadSum:'a 90-day summary'
});
Object.assign(LEAD_TAL.ctx, {
  leadCohort: ['Where is this cohort stuck?','Brief me for this call','Who here needs me most?'],
  leadMember: ['What should I say to them?','Is this recoverable?','Draft a check-in'],
  leadEval:   ['Why did you propose this rung?','What evidence supports it?','What would change your mind?'],
  leadSum:    ['Are they ready to be promoted?','What should I write here?']
});
Object.assign(ASK_WHERE, LEAD_TAL.where);

render();
