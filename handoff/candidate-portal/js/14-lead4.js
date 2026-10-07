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
    ['Priya Nair','priya','PN','Welcome to Cohort 47. First call is Monday at 6. Before then: open chapter 1, and post one sentence here about what you are hoping to get out of the 90 days.','9:00 AM',true],
    ['Ahmed Farouk','owen','AF','Hoping to stop being the bottleneck on my own team. That is the honest version.','11:34 AM'],
    ['Beatriz Lima','lena','BL','Mine is hard conversations. I avoid them until they are twice as hard.','2:12 PM']
  ]
};

const ldrBoard = id => +id === LEAD_COHORTS[0].id ? ROOM : (LDR_BOARDS[id] || []);

const LDR_THREADS = [
  {who:'Yuki Tanaka', i:'YT', img:'hana', co:41, readAt:'Tue 9:10 AM', msgs:[
    {me:1, t:'Yuki — you have not been in since week 1 and I would rather ask than assume. Is the course the problem, or is it everything else?', w:'Mon 9:12 AM'},
    {me:0, t:'Sorry. Work went sideways and I kept telling myself I would catch up at the weekend, and then I did not.', w:'Mon 10:40 PM'},
    {me:1, t:'That is the normal version of this, not the shameful one. Do not try to catch up — start at chapter 2 and come to Thursday even if you have done nothing. Turning up is the part that restarts it.', w:'Tue 8:05 AM'}
  ]},
  {who:'James Whitby', i:'JW', img:'owen', co:41, readAt:'Yesterday 8:30 PM', msgs:[
    {me:0, t:'I have re-taken the chapter 4 assessment three times and I am still at 65. Should I keep going at it?', w:'Yesterday 7:15 PM'},
    {me:1, t:'No. Leave it at 65 and move to 5. Four is the one that only makes sense after you have tried the thing at work and it has gone badly once. Come back to it in week 8 and it will score itself.', w:'Yesterday 8:02 PM'},
    {me:1, kind:'file', name:'handover-framework.pdf', size:184320, type:'PDF', w:'Yesterday 8:03 PM'}
  ]},
  {who:'Tobias Mensah', i:'TM', img:'samuel', co:41, readAt:null, msgs:[
    {me:1, t:'Tobias — eight days quiet and 18% at week 5. Not chasing you, just checking the course is still something you want.', w:'4 days ago'},
    {me:0, kind:'voice', dur:'0:22', w:'2 days ago'},
    {me:0, t:'Sorry — work ate the fortnight. I am back in and through to 35%.', w:'2 days ago'}
  ]},
  {who:'Aisha Bello', i:'AB', img:'priya', co:41, readAt:'Wed 7:40 PM', msgs:[
    {me:0, t:'Ran the delegation piece from chapter 6 with my team this morning and it actually landed. Thank you.', w:'Wed 6:55 PM'},
    {me:1, t:'That is the whole point of it. Bring what happened to Thursday and we will pull it apart with the group.', w:'Wed 7:38 PM'}
  ]},
  {who:'Daniel Kerr', i:'DK', img:'owen', co:41, readAt:'Yesterday 4:10 PM', msgs:[
    {me:1, t:'Daniel, you are a week ahead of pace. Slow down on 7 and sit with the hard-conversation drill before you move on.', w:'Yesterday 3:20 PM'},
    {me:0, t:'Noted. I will hold on 7 and bring a real one to work on.', w:'Yesterday 4:05 PM'}
  ]},
  {who:'Sofia Marchetti', i:'SM', img:'lena', co:41, readAt:null, msgs:[
    {me:0, t:'Could we move my one-to-one to after the Thursday call this week? Something has come up at work.', w:'Today 9:15 AM'}
  ]},
  {who:'Ravi Chandran', i:'RC', img:'samuel', co:41, readAt:'Mon 8:05 PM', msgs:[
    {me:1, t:'Ravi — your attempts are creeping up on every chapter. It is not the material, it is that you are grading yourself as you go. Answer first, check after.', w:'Mon 7:50 PM'},
    {me:0, t:'That is exactly it. I will try leaving the checking until the end.', w:'Mon 8:02 PM'}
  ]},
  {who:'Nora Lindqvist', i:'NL', img:'lena', co:41, readAt:'3 days ago', msgs:[
    {me:0, t:'Missed Thursday — was it recorded anywhere I can catch up on?', w:'3 days ago'},
    {me:1, t:'It was. I will send the LightspeedVT link. The part you want is the middle twenty minutes on the week-5 assessment.', w:'3 days ago'}
  ]},
  {who:'Chloe Ferreira', i:'CF', img:'priya', co:41, readAt:null, msgs:[
    {me:1, t:'Chloe — quiet week. Everything alright, or is the course slipping down the list?', w:'5 days ago'}
  ]},
  {who:'Maryam Naz', i:'MN', img:'hana', co:41, readAt:'Today 10:30 AM', msgs:[
    {me:0, t:'Booked my re-interview for next Tuesday. Anything I should go in ready to talk about?', w:'Today 10:05 AM'},
    {me:1, t:'The two calls you ran in weeks 3 and 4, not the chapter scores. They are what moved you.', w:'Today 10:28 AM'}
  ]},
  {who:'Owen Clarke', i:'OC', img:'owen', co:33, readAt:'12 Sep', msgs:[
    {me:0, t:'Thank you for the recommendation. The re-interview is next week and I feel ready for it.', w:'11 Sep'},
    {me:1, t:'You earned it. Go in and talk about the calls you ran, not the chapters you finished.', w:'11 Sep'}
  ]}
];

S.ldrTh = 0;
S.ldrDmQ = '';   /* the DM list search query (filters in place, `ldrDmSearch`) */
S.ldrThOpen = false;
S.ldrRec = null;   /* EPIC 12.8 — voice-note recording in progress */
S.ldrEditProfile = false;

device.addEventListener('change', e => {
  if(e.target.id !== 'ldrFile') return;
  const f = e.target.files && e.target.files[0]; if(!f) return;
  if(f.size > 25*1048576){ e.target.value=''; return; }   /* 25 MB cap */
  const ext = (f.name.split('.').pop()||'').toUpperCase();
  (LDR_THREADS[S.ldrTh] || LDR_THREADS[0]).msgs.push({me:1, kind:'file', name:f.name, size:f.size, type:ext, w:'Just now'});
  render();
});
function ldrRecTick(){
  if(S.ldrRec){
    if(!window.__ldrRecInt) window.__ldrRecInt = setInterval(() => {
      if(!S.ldrRec){ clearInterval(window.__ldrRecInt); window.__ldrRecInt = 0; return; }
      const ms = Date.now() - S.ldrRec.start;
      const el = device.querySelector('#ldrRecTime');
      if(el) el.textContent = Math.floor(ms/60000) + ':' + String(Math.floor(ms/1000)%60).padStart(2,'0');
      if(ms >= 300000){ const stop = device.querySelector('[data-ldrrecstop]'); if(stop) stop.click(); }
    }, 250);
  } else if(window.__ldrRecInt){ clearInterval(window.__ldrRecInt); window.__ldrRecInt = 0; }
}

S.ldrPfTab = 'general';

const KB = n => n < 1024 ? n + ' B' : n < 1048576 ? Math.round(n/1024) + ' KB' : (n/1048576).toFixed(1) + ' MB';
const dmName = name => SHOW_REAL.has(name)
  ? `<b>${name}</b> <span class="dm-h">${handleOf(name)}</span>`
  : `<b>${handleOf(name)}</b>`;
const threadActive = th => !!leadLive() && th.co === leadLive().id;

function ldrDmSearch(inp){
  S.ldrDmQ = inp.value;
  const q = (S.ldrDmQ||'').trim().toLowerCase();
  device.querySelectorAll('.ldr-dm-rows > .ldr-dm-t[data-dmname]').forEach(b=>{
    b.hidden = !!q && !b.getAttribute('data-dmname').includes(q);
  });
}

function msgBubble(msg, th){
  let body;
  if(msg.kind === 'voice') body = `<span class="m-voice">${I.microphone}<span class="m-voice-bar"></span><span class="m-voice-d">${msg.dur}</span></span>`;
  else if(msg.kind === 'file') body = `<span class="m-file">${I.attachment}<span class="m-file-b"><span class="m-file-n">${msg.name}</span><span class="m-file-s">${msg.type} &middot; ${KB(msg.size)}</span></span></span>`;
  else body = msg.t;
  return `<div class="m ${msg.me ? 'me' : 'them'}">
    <span class="m-av">${avatar(msg.me ? {i:LEADER.i, img:LEADER.img} : {i:th.i, img:AV[th.img]}, 32)}</span>
    <div class="m-c">
      <div class="m-b${msg.kind?' m-b-'+msg.kind:''}">${body}</div>
      <div class="m-w">${msg.w}${msg.me ? `<i class="m-tick">${I.check}</i>` : ''}</div>
    </div>
  </div>`;
}

V.leadMessages = () => {
  const th = LDR_THREADS[S.ldrTh] || LDR_THREADS[0];
  const waiting = t => t.msgs.length && t.msgs[t.msgs.length - 1].me === 0;
  const current = LDR_THREADS.map((t,i)=>({t,i})).filter(x=>threadActive(x.t));
  const lastMine = (() => { for(let i=th.msgs.length-1;i>=0;i--) if(th.msgs[i].me) return i; return -1; })();
  const active = threadActive(th);
  const rec = S.ldrRec;

  const dmRow = ({t,i}) => {
    const last = t.msgs[t.msgs.length - 1];
    const on = i === S.ldrTh;
    const lastTxt = last ? (last.me ? 'You: ' : '') + (last.kind==='voice'?'Voice note':last.kind==='file'?last.name:last.t) : 'No messages yet';
    const key = (t.who + ' ' + handleOf(t.who)).toLowerCase();
    return `<button class="ldr-dm-t${on ? ' on' : ''}" data-ldrpick="${i}" data-dmname="${key.replace(/"/g,'&quot;')}" role="tab" aria-selected="${on}">
      <span class="mem-av mem-ph">${avatar({i:t.i, img:AV[t.img]}, 36)}</span>
      <span class="ldr-dm-tb">
        <span class="ldr-dm-tn">${dmName(t.who)}${waiting(t) ? '<i class="ldr-dm-dot" aria-label="waiting on your reply"></i>' : ''}</span>
        <span class="ldr-dm-tx">${lastTxt}</span>
      </span>
      <span class="ldr-dm-tw">${last ? last.w.replace(/ \d?\d:\d\d [AP]M/,'') : ''}</span>
    </button>`;
  };

  return `<main class="main"><div class="page msg-mod">
  ${crumb(['My Cohort','leadDash'],'Messages')}
  ${ph('Messages')}
  <div class="sec ldr-dm-sec">
    <div class="ldr-dm${S.ldrThOpen ? ' show-thread' : ''}">
      <div class="ldr-dm-list" role="tablist" aria-label="Your conversations">
        <div class="ldr-dm-lh">Direct messages<span class="t-helper-01">${current.length}</span></div>
        <label class="ldr-dm-srch">${I.search}
          <input type="search" placeholder="Search conversations" value="${(S.ldrDmQ||'').replace(/"/g,'&quot;')}" oninput="ldrDmSearch(this)" aria-label="Search conversations"></label>
        <div class="ldr-dm-rows">${current.map(dmRow).join('')}</div>
      </div>
      <div class="ldr-dm-thread">
        <div class="ldr-dm-h">
          <button class="ph-back ldr-dm-back" data-ldrthback="1" aria-label="Back to your conversations">${I.arrowLeft}</button>
          <span class="mem-av mem-ph">${avatar({i:th.i, img:AV[th.img]}, 36)}</span>
          <span class="ldr-dm-hb"><b>${SHOW_REAL.has(th.who)?th.who:handleOf(th.who)}</b><span>Private &middot; Cohort ${th.co}${active?'':' &middot; closed'}</span></span>
        </div>
        <div class="msgs">
          ${th.msgs.length ? '' : `<div class="m-day"><span>No messages yet &mdash; this one starts with you</span></div>`}
          ${th.msgs.map((msg,i) => msgBubble(msg, th) + (i===lastMine && th.readAt ? `<div class="m-read">Read ${th.readAt}</div>` : '')).join('')}
        </div>
        ${!active
          ? `<div class="dm-closed">This cohort has closed. You can still read your messages.</div>`
          : rec
          ? `<div class="composer composer-rec">
              <button class="composer-act dm-rec-x" data-ldrrecdiscard="1" aria-label="Discard">${I.close}</button>
              <span class="dm-rec-live"><span class="dm-rec-dot"></span>Recording <span id="ldrRecTime">0:00</span></span>
              <button class="composer-send" data-ldrrecstop="1" aria-label="Send voice note">${I.send}</button>
            </div>`
          : `<div class="composer">
              <label class="composer-act composer-lead" aria-label="Attach a file">${I.attachment}
                <input type="file" id="ldrFile" hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif,.heic"></label>
              <input class="inp" id="ldrReply" placeholder="${th.msgs.length ? 'Reply to' : 'Message'} ${th.who.split(' ')[0]}" aria-label="${th.msgs.length ? 'Reply' : 'Message'}">
              <button class="composer-act" data-ldrrecstart="1" aria-label="Record a voice message">${I.microphone}</button>
              <button class="composer-send" data-ldrreply="1" aria-label="Send">${I.send}</button>
            </div>`}
      </div>
    </div>
  </div>
</div></main>`;
};

const LDR_CERTS = [
  {k:'cohort', n:'Certified Cohort Leader', track:'Foundation', on:'February 12, 2026', by:'TalentNext'},
  {k:'assess', n:'Assessment &amp; Levelling', track:'Core', on:'March 3, 2026', by:'TalentNext'},
  {k:'course', n:'90-Day Programme Facilitation', track:'Core', on:'April 21, 2026', by:'TalentNext'}
];

const ldrCertHero = c => `<div class="sec dark-card crt-dark">
    <div class="dc-hd"><div class="dc-hd-r">
      <h2 class="dc-t">Congratulations on your most recent certification &#127881;</h2>
    </div></div>
    <div class="crt-hero">
      <span class="crt-art"><img src="${CERT_ART[c.k]}" alt=""></span>
      <span class="crt-hero-b">
        <span class="crt-hero-n">${c.n}</span>
        <span class="crt-hero-i">TALENTnext</span>
      </span>
      ${''/* Download leads and takes the accent, Share link is the quiet one —
            the order and the fill the candidate's card settled on 2 Sep, and
            the reason is the same on both: this product's certificate is a
            thing you TAKE, and a share link is something you generate after. */}
      <span class="crt-hero-a">
        <button class="btn btn-p btn-sm ic-l">${I.download} Download</button>
        <button class="btn btn-sm ic-l">${I.link} Share link</button>
      </span>
    </div>
  </div>`;

const ldrCertGrid = list => list.slice().reverse().map(c => `<div class="crt-card">
    <span class="crt-art"><img src="${CERT_ART[c.k]}" alt=""></span>
    <span class="crt-n">${c.n}</span>
    <span class="crt-i">${c.by}</span>
    <span class="crt-on">Issued ${c.on}</span>
  </div>`).join('');

V.leadCerts = () => {
  const led = 8, hours = 42;
  const promoted = 34;
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Certifications')}
  ${''/* Three blocks in a row were explaining this page: this line, Tal's
        summary, and a 44-word `.note` about the volunteer role. The stat
        cells below state the four figures, Tal reads them, and the note
        makes the one point neither can. This line was the redundant third.
        THE NOTE IS NOW GONE TOO (Maryam, 2 Sep 2026 — "remove the 'Leading is
        a volunteer role' part"), so of the three only Tal's summary is left,
        which is where a page's own reading belongs. */}
  ${ph('Certifications')}
  ${ldrCertHero(LDR_CERTS[LDR_CERTS.length - 1])}
  <div class="sec">
    <div class="stats">
      ${statCell(I.certificate, 'Certifications', LDR_CERTS.length, 'one more in progress')}
      ${statCell(I.group, 'Cohorts led', led, 'as a volunteer')}
      ${statCell(I.trophy, 'Candidates promoted', promoted, 'across those eight cohorts')}
      ${statCell(I.time, 'Training hours', hours, 'this year')}
    </div>
  </div>
  ${''/* THE VOLUNTEER NOTE STOOD HERE AND IS DELETED (Maryam, 2 Sep 2026:
         "remove the 'Leading is a volunteer role' part") — a `.note` with
         `I.info`, a bold lead-in and 44 words about there being no fees and no
         settlements on this side of TalentNext.

         WHY IT WAS HERE, so it is not rebuilt by accident: this page replaced
         an Earnings page, and the note was the replacement's explanation of
         itself. "No money anywhere" is one of the four rules the wireframe
         settled for this portal, and a page of certifications standing where a
         balance used to stand is the one place a reader might ask where the
         money went.

         WHY IT CAN GO. Nothing on this portal has said anything about a fee
         for two builds — there is no Earnings slot in the rail, no figure with
         a currency on any leader page — so the note was answering a question
         the product no longer prompts. What it actually asserted survives in
         two places that are not explanations: `V.leadProfile`'s Role row reads
         "Volunteer cohort leader · unpaid", and the figure cell 40px above this
         said "as a volunteer" under Cohorts led. A fact stated in a record beats
         the same fact stated in a panel about the record.

         THE `.note` COMPONENT IS UNTOUCHED and has readers on both portals —
         this is one caller, not the class. */}
  ${''/* "EARNED" IS "ALL CERTIFICATIONS" AND ITS ROWS ARE CARDS. The list was
         a `.tile-stack` of `.cardrow`s — a 40px glyph, the name with an
         "Active" tag, the track and date, and a "Certificate" button at the far
         end — and the candidate tab's own note is why that shape lost: the
         badge IS the object rather than an icon standing in for it, and a 40px
         slot cannot hold a 90px disc with type around its rim.
         TWO THINGS WENT WITH THE ROW AND NEITHER IS A LOSS. The "Active" tag
         said the same thing for all three, on a page where nothing expires;
         and the per-row "Certificate" button was the only control on the page
         that did nothing, which the hero's Download now does — once, on the
         card the page is about. */}
  <div class="sec">
    <div class="sec-h"><h2>All certifications</h2><span class="t-helper-01">Yours to keep and to share</span></div>
    <div class="crt-grid">${ldrCertGrid(LDR_CERTS)}</div>
  </div>
  ${''/* "IN PROGRESS" AND "THE RECORD BEHIND THEM" ARE BOTH DELETED (Maryam,
         2 Sep 2026). The page is now the hero certificate and the grid of all
         of them, which is what "Certifications" is.

         WHAT "IN PROGRESS" WAS: the Candidate Mentoring / Advanced track
         requirement — a `.kv` pair (what it opens, awarded when) over a
         three-step `ol.steps` with two ticked and one counted, and a paragraph
         explaining what "reviewed" means. It was the longest block on the page
         and it was about a certificate that does not exist yet, under a heading
         that says the page is about the ones that do.

         WHAT "THE RECORD BEHIND THEM" WAS: a four-cell `.facts` band — leading
         since, cohorts closed, cohort calls led, assessing range. Every one of
         those four is on `V.leadProfile`, which is where a fact about the
         LEADER belongs rather than on a page about their certificates.

         ONLY `calls` LOSES ITS READER. `led` and `hours` are still the third
         and fourth cells of the `.stats` band at the top of this page, so they
         stay; `LEADER.since` and `LEADER.range` are drawn on `V.leadProfile`.
         The one figure with nowhere left to go is the call count, and its
         derivation is recorded where it was declared rather than deleted in
         silence. */}
</div></main>`;
};

V.leadProfile = () => `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Your profile')}
  ${ph('Your profile',`${LEADER.range} &middot; leading since ${LEADER.since}`)}

  ${''/* FOUR TABS, THE CANDIDATE'S PROFILE MODULE MIRRORED (Maryam, 7 Sep 2026:
        "the cohort leader profile module needs to be same as the candidate profile
        module", then "notifications will be a different tab, add privacy settings
        tab as well"). General is the candidate's My Profile shape — a 72px idhead,
        a four-fact band and an About paragraph, with the four figures and the bio
        made leader-appropriate. Notifications and Privacy Settings are their own
        tabs now; Privacy is the candidate's `pfPrivacy` composition (Sign in and
        security over Closing your account), reusing `S.pfPw`/`data-pfpw` and the
        shared delete confirm. */}
  <div class="sec sec-cs">
    <div class="cs" role="tablist" aria-label="Profile sections">
      <button class="${S.ldrPfTab === 'general' ? 'on' : ''}" role="tab"
        aria-selected="${S.ldrPfTab === 'general'}" data-ldrpf="general">General Profile</button>
      <button class="${S.ldrPfTab === 'public' ? 'on' : ''}" role="tab"
        aria-selected="${S.ldrPfTab === 'public'}" data-ldrpf="public">Public Profile</button>
      <button class="${S.ldrPfTab === 'notif' ? 'on' : ''}" role="tab"
        aria-selected="${S.ldrPfTab === 'notif'}" data-ldrpf="notif">Notifications</button>
      <button class="${S.ldrPfTab === 'privacy' ? 'on' : ''}" role="tab"
        aria-selected="${S.ldrPfTab === 'privacy'}" data-ldrpf="privacy">Privacy Settings</button>
    </div>
  </div>

  ${S.ldrPfTab === 'general' ? `
  ${''/* GENERAL — idhead + four facts + About, the candidate's `pfSecView.general`
        shape. The four are the leader's standing (candidate rating, cohorts led,
        completion, level movement) — the figures that used to sit under "Your
        standing" on the Public tab; here they are the reader's own dashboard, and
        the Public card keeps the two a candidate reads (rating and cohorts). */}
  <div class="sec">
    <div class="idhead">
      <span class="idphoto"><span class="av-ph" style="width:72px;height:72px"><i>${LEADER.i}</i><img src="${LEADER.img}" alt=""></span><i class="av-on" aria-hidden="true"></i></span>
      <div class="idhead-b">
        <span class="idname">${LEADER.n}</span>
        ${''/* "Leading since …" ALONE (Maryam, 9 Sep 2026: "remove the line
              'Volunteer cohort leader · ' and make the next word 'Leading' L
              capital"). The unpaid/volunteer fact lives elsewhere; the sub-line
              is the tenure. */}
        <span class="idmeta">Leading since ${LEADER.since}</span>
        ${''/* THE ASSESS RANGE IS A BORDERLESS LINE, LEFT-ALIGNED WITH THE NAME
              (Maryam, 9 Sep 2026: "remove the border of Assesses E1–E3 and align
              it with other above content"). It was a `.tag sm` chip, indented by
              its own border and padding; a plain `.idmeta` line sits at the same
              left edge as the name and the tenure. */}
        <span class="idmeta">Assesses ${LEADER.range}</span>
      </div>
      <div class="idhead-a"><button class="btn btn-g" data-ldrprof="1">Edit details ${I.edit}</button></div>
    </div>
    <div class="facts pf-facts">
      ${pfFact(I.star, '--mk-2', 'Candidate rating', '4.9')}
      ${pfFact(I.group, '--mk-1', 'Cohorts led', '8')}
      ${pfFact(I.chart, '--mk-3', 'Completion rate', '84%')}
      ${pfFact(I.growth, '--mk-4', 'Level movement', '+0.8 levels')}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>About</h2></div>
    <p class="t-body pfe-about">${LEADER.bio}</p>
  </div>
  ${''/* SPECIALITIES ON THE GENERAL TAB TOO (Maryam, 9 Sep 2026: "the cohort
         leader profile should have specialities as well"). The same `.skl` chip
         cloud and `LEADER.specs` the Public tab draws — the leader's own record
         of what they lead on, on both tabs. */}
  <div class="sec">
    <div class="sec-h"><h2>Specialities</h2></div>
    <div class="skl">${LEADER.specs.map(t => `<span class="skl-c">${t}</span>`).join('')}</div>
  </div>` : ''}

  ${S.ldrPfTab === 'public' ? `
  ${''/* PUBLIC — REBUILT ON THE TALENT AGENT'S PUBLIC PROFILE (Maryam, 9 Sep 2026:
        "improve the cohort leader public profile just like talent agent public
        profile"). The agent's tab is: a large 72px identity with the rating and
        assess range on one `.idmeta` line, a four-cell figure band, an About me
        paragraph and a Specialities chip cloud — no "public profile" heading, no
        description and no edit button (editing lives one tab over, on General's
        "Edit details"). This tab now reads the same, with the leader's own facts.

        THE FOUR CELLS are the leader's, not the agent's: the agent's Interview
        Fee / Availability / Evaluation Time / Experience become Cohorts led /
        Call length / Cadence / Leading since — a cohort leader is unpaid and
        nobody books them from this card (the old disclaimer's point), so there is
        no fee cell; the rating and range stay in the `.idmeta` line, so the cells
        do not repeat them. The old "Your listing" kv (Specialism / Assessing
        range / Call length) is folded in: range to the idmeta, call length to a
        cell, and Specialism becomes the chip cloud (`LEADER.specs`).

        `.sec-noline` on the first two so identity, figures, About and
        Specialities read as ONE band, exactly as the agent's do; no `.av-on` dot
        — the green marker is the owner's own view, not the listing (§09). */}
  <div class="sec sec-noline">
    <div class="idhead">
      <span class="idphoto"><span class="av-ph" style="width:72px;height:72px"><i>${LEADER.i}</i><img src="${LEADER.img}" alt=""></span></span>
      <div class="idhead-b">
        <span class="idname">${LEADER.n}</span>
        <span class="idmeta"><span style="color:var(--star)">&#9733;</span> 4.9 &middot; Assesses ${LEADER.range}</span>
      </div>
    </div>
    <div class="facts pf-facts">
      ${pfFact(I.group, '--mk-1', 'Cohorts led', '8')}
      ${pfFact(I.time, '--mk-2', 'Call length', '60 min')}
      ${pfFact(I.calendar, '--mk-3', 'Cadence', 'Weekly')}
      ${pfFact(I.shield, '--mk-4', 'Leading since', LEADER.since)}
    </div>
  </div>
  <div class="sec sec-noline">
    <div class="sec-h"><h2>About</h2></div>
    <p class="t-body pfe-about">${LEADER.bio}</p>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Specialities</h2></div>
    <div class="skl">${LEADER.specs.map(t => `<span class="skl-c">${t}</span>`).join('')}</div>
  </div>` : ''}

  ${S.ldrPfTab === 'notif' ? `
  <div class="sec">
    <div class="sec-h"><h2>Notifications</h2></div>
    <label class="tg"><div class="tb"><b>A candidate goes quiet</b><span>After four days without a sign-in</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>A cohort call is an hour away</b><span>One reminder, on the day</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Posts on a cohort board</b><span>A daily digest rather than each one</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Summary reminders</b><span>A week before a cohort reaches day 90</span></div><input type="checkbox"><span class="sw"></span></label>
  </div>` : ''}

  ${S.ldrPfTab === 'privacy' ? `
  <div class="sec">
    <div class="sec-h"><h2>Sign in and security</h2></div>
    <div class="tile-stack">
      <div class="cardrow pfe-row pf-sr">
        <span class="pf-sr-ic" style="--mk:var(--mk-1)">${I.email}</span>
        <span class="cardrow-b"><span class="cardrow-t">${LEADER.email}</span>
          <span class="cardrow-d">The address you sign in with &middot; change it under General Profile</span></span>
      </div>
      <div class="cardrow pfe-row pf-sr">
        <span class="pf-sr-ic" style="--mk:var(--mk-3)">${I.locked}</span>
        <span class="cardrow-b"><span class="cardrow-t">Password</span>
          <span class="cardrow-d">Last changed ${PF_PW_SET}</span></span>
        ${S.pfPw
          ? `<button class="btn btn-g btn-sm" data-pfpw="0">Cancel ${I.close}</button>`
          : `<button class="btn btn-g btn-sm" data-pfpw="1">Reset password ${I.renew}</button>`}
      </div>
    </div>
    ${S.pfPw ? `
    ${pfFields('pw', [
      ['cur','Current password','x',{t:'pw', ac:'current-password', w:1, ph:'The one you use now'}],
      ['new','New password','x',{t:'pw', ph:'At least 12 characters'}],
      ['rep','Repeat new password','x',{t:'pw', ph:'The same again'}]
    ])}
    <div class="pfe-foot pfe-foot-in">
      <button class="btn btn-g" data-pfpw="0">Cancel ${I.close}</button>
      <button class="btn btn-p noic" data-pfpw="0">Update password ${I.check}</button>
    </div>` : ''}
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Closing your account</h2></div>
    <div class="close-b">
      <p class="t-body close-x">Deleting your account removes your profile, your cohort notes and the record of everything you have led. Certificates you have already earned stay valid and stay downloadable.</p>
      <div class="close-a">
        <button class="btn btn-t danger" data-del="1">Delete my account ${I.misuse}</button>
      </div>
    </div>
  </div>` : ''}
</div></main>`;

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
        <div class="f"><label for="ldrPl">Cohort call length</label>
          <select class="inp" id="ldrPl"><option>60 minutes</option><option>45 minutes</option><option>90 minutes</option></select></div>
        <p class="t-helper-01">Your assessing range comes from your certifications and cannot be set here.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-ldrclose="prof">Cancel</button>
        <button class="btn btn-p noic" data-ldrclose="prof">Save changes</button>
      </div>
    </div>
  </div>`;
}


S.discReplyTo = null;
S.discEdit = null;
S.discPinAsk = null;

const LEAD_ME = {n:'Priya Nair', handle:'@priya', img:AV.priya, ini:'PN', leader:true};
const discWho = m => ({n:m.name, handle:handleOf(m.name), img:AV[m.img], ini:m.ini});
const discM = name => { const c = leadLive(); const m = c && c.members.find(x=>x.name===name);
  return m ? discWho(m) : {n:name, handle:handleOf(name), img:AV.hana, ini:name.slice(0,2).toUpperCase()}; };

let LEAD_DISC = [
  {id:'t1', who:LEAD_ME, text:'Thursday we run chapter 5, Hard Conversations. Bring one real example from your own week, not a hypothetical. It does not have to have gone well.', when:'2 days ago', at:0, pinned:true, reacts:['Aisha Bello','Daniel Kerr','Ravi Chandran','Sofia Marchetti'], replies:[
    {id:'r1', who:discM('Daniel Kerr'), text:'Mine went badly, so this is good timing.', when:'2 days ago', at:0, reacts:['Aisha Bello']}]},
  {id:'t2', who:discM('Daniel Kerr'), text:'Did anyone else find chapter 4 harder than the three before it? I have read the handover section twice.', when:'Yesterday', at:0, pinned:false, reacts:['Aisha Bello','Ravi Chandran','Nora Lindqvist'], replies:[
    {id:'r2', who:discM('Aisha Bello'), text:'Yes. It is the first one that asks you to change something at work rather than understand something.', when:'Yesterday', at:0, reacts:['Daniel Kerr','Sofia Marchetti']},
    {id:'r3', who:LEAD_ME, text:'That is the point of it. The reading is the easy half. Try one small handover this week and we will look at it on the call.', when:'Yesterday', at:0, reacts:['Daniel Kerr']}]},
  {id:'t3', who:discM('Sofia Marchetti'), text:'Bringing my example on Thursday. Mine is a vendor review that went badly and I still think I was right to take it back.', when:'5 hours ago', at:0, pinned:false, reacts:['Ravi Chandran'], replies:[]}
];

const DISC_EDIT_MS = 60*60*1000;
const discEditable = p => !!p.at && (Date.now() - p.at) < DISC_EDIT_MS && p.who.handle === LEAD_ME.handle;
const discPinned = () => LEAD_DISC.find(t => t.pinned);
const discFind = id => { for(const t of LEAD_DISC){ if(t.id===id) return t; const r=t.replies.find(x=>x.id===id); if(r) return r; } return null; };

function discPost(p, tid, reply){
  const mine = p.who.handle === LEAD_ME.handle;
  const reacted = p.reacts.includes(LEAD_ME.n);
  const editing = S.discEdit === p.id;
  return `<div class="disc-post${reply?' disc-reply':''}${p.pinned?' disc-pinned':''}">
    <span class="disc-av"><span class="av-ph" style="width:${reply?28:36}px;height:${reply?28:36}px"><i>${p.who.ini}</i><img src="${p.who.img}" alt=""></span></span>
    <div class="disc-b">
      <div class="disc-head">
        <span class="disc-nm">${p.who.n}</span>
        ${p.who.leader?'<span class="disc-badge">Cohort Leader</span>':''}
        ${mine?'<span class="disc-you">You</span>':`<span class="disc-h">${p.who.handle}</span>`}
        <span class="disc-w">&middot; ${p.when}${p.edited?' &middot; edited':''}</span>
        ${p.pinned?`<span class="disc-pin-tag">${I.location} Pinned</span>`:''}
      </div>
      ${editing
        ? `<div class="disc-edit"><textarea class="inp" id="discEditTa" rows="3" maxlength="2000">${p.text}</textarea>
            <div class="disc-edit-a"><button class="btn btn-s btn-sm noic" data-disccancel="1">Cancel</button>
              <button class="btn btn-p btn-sm noic" data-disceditsave="${p.id}">Save</button></div></div>`
        : `<p class="disc-text">${p.text}</p>`}
      <div class="disc-acts">
        <button class="disc-act${reacted?' on':''}" data-discreact="${p.id}">${reacted?I.thumbsUpFilled:I.thumbsUp} ${p.reacts.length||''}</button>
        ${!reply?`<button class="disc-act" data-discreply="${tid}">${I.chat} Reply</button>`:''}
        ${LEAD_ME.leader && !reply ? (p.pinned
          ? `<button class="disc-act" data-discunpin="${p.id}">${I.location} Unpin</button>`
          : `<button class="disc-act" data-discpin="${p.id}">${I.location} Pin</button>`) : ''}
        ${discEditable(p) && !editing ? `<button class="disc-act" data-discedit="${p.id}">${I.edit} Edit</button>` : ''}
      </div>
    </div>
  </div>`;
}

function discThread(t){
  const replying = S.discReplyTo === t.id;
  return `<div class="disc-thread">
    ${discPost(t, t.id, false)}
    ${t.replies.length ? `<div class="disc-replies">${t.replies.map(r=>discPost(r, t.id, true)).join('')}</div>` : ''}
    ${replying ? `<div class="disc-reply-box">
      <textarea class="inp" id="discReplyTa" rows="2" maxlength="2000" placeholder="Write a reply"></textarea>
      <div class="disc-reply-a"><button class="btn btn-s btn-sm noic" data-disccancel="1">Cancel</button>
        <button class="btn btn-p btn-sm noic" data-discsendreply="${t.id}">Reply</button></div>
    </div>` : ''}
  </div>`;
}

V.leadDiscussion = () => {
  const c = leadLive();
  if(!c) return `<main class="main"><div class="page">${ph('Discussion')}
    <div class="sec"><div class="empty" style="border:0">${I.chat}<h3>You are not leading a cohort at the moment.</h3>
      <p>Your past cohorts&rsquo; discussions stay readable.</p></div></div></div></main>`;
  const pin = discPinned();
  const threads = LEAD_DISC.filter(t => !t.pinned);
  return `<main class="main"><div class="page">
  ${ph('Discussion')}
  <div class="sec">
    <div class="disc-compose">
      <span class="disc-av"><span class="av-ph" style="width:36px;height:36px"><i>PN</i><img src="${LEAD_ME.img}" alt=""></span></span>
      <div class="disc-compose-b">
        <textarea class="inp" id="discMsg" rows="2" maxlength="2000" placeholder="Post to your cohort"></textarea>
        <div class="disc-compose-a">
          <label class="disc-pin-cb"><input type="checkbox" id="discPinNew"> Pin to the top</label>
          <button class="btn btn-p btn-sm noic" data-discpost="1">Post</button>
        </div>
      </div>
    </div>
  </div>
  ${pin ? `<div class="sec"><div class="sec-h"><h2>Pinned</h2></div><div class="disc-thread">${discThread(pin)}</div></div>` : ''}
  <div class="sec">
    <div class="sec-h"><h2>Discussion</h2></div>
    ${threads.length ? threads.map(discThread).join('') : `<div class="empty" style="border:0">${I.chat}<h3>No posts yet</h3><p>Start the cohort&rsquo;s conversation above.</p></div>`}
  </div>
</div></main>`;
};

function discPinSheet(){
  const id = S.discPinAsk; if(!id) return `<div class="modal" data-dpclose="1"></div>`;
  return `<div class="modal on" data-dpclose="1">
    <div class="sheet conf" role="dialog" aria-modal="true" aria-label="Pin post">
      <div class="sheet-b conf-b">
        <span class="conf-mk">${I.location}</span>
        <h2 class="conf-t">Pin this post?</h2>
        <p class="conf-x">It replaces the post currently pinned.</p>
      </div>
      <div class="sheet-f conf-a">
        <button class="btn btn-s noic" data-dpclose="1">Go back</button>
        <button class="btn btn-p noic" data-discdopin="${id}">Pin</button>
      </div>
    </div>
  </div>`;
}
LDR_SHEETS.push(discPinSheet);

LDR_SHEETS.push(ldrProfileSheet);

device.addEventListener('click', e => {
  const t = e.target;

  const pk = t.closest('[data-ldrpick]');
  if(pk){
    S.ldrTh = +pk.dataset.ldrpick;
    S.ldrThOpen = true;
    render();
    return;
  }



  const th = t.closest('[data-ldrth]');
  if(th){ S.ldrTh = +th.dataset.ldrth; S.ldrThOpen = true; render(); return; }
  if(t.closest('[data-ldrthback]')){ S.ldrThOpen = false; render(); return; }

  const dm = t.closest('[data-ldrdm]');
  if(dm){
    const who = dm.dataset.ldrdm;
    let i = LDR_THREADS.findIndex(x => x.who === who);
    if(i < 0){
      const rec = lmembers().find(x => x.m.name === who);
      if(!rec) return;
      LDR_THREADS.push({who, i:rec.m.ini, img:rec.m.img, co:rec.c.id, msgs:[]});
      i = LDR_THREADS.length - 1;
    }
    S.ldrTh = i;
    S.ldrThOpen = true;
    go('leadMessages');
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
  if(t.closest('[data-ldrrecstart]')){ S.ldrRec = {start:Date.now()}; render(); return; }
  if(t.closest('[data-ldrrecdiscard]')){ S.ldrRec = null; render(); return; }
  if(t.closest('[data-ldrrecstop]')){
    const ms = S.ldrRec ? Math.min(300000, Date.now() - S.ldrRec.start) : 0;
    const dur = Math.floor(ms/60000) + ':' + String(Math.floor(ms/1000)%60).padStart(2,'0');
    (LDR_THREADS[S.ldrTh] || LDR_THREADS[0]).msgs.push({me:1, kind:'voice', dur: dur==='0:00'?'0:01':dur, w:'Just now'});
    S.ldrRec = null; render(); return;
  }

  const tab = t.closest('[data-ldrpf]');
  if(tab){ S.ldrPfTab = tab.dataset.ldrpf; render(); return; }

  const pf = t.closest('[data-ldrprof]');
  if(pf){ S.ldrEditProfile = true; render(); return; }

  const cl = t.closest('[data-ldrclose]');
  if(cl && cl.dataset.ldrclose === 'prof'){
    if(cl.classList.contains('modal') && t !== cl) return;
    S.ldrEditProfile = false;
    render();
    return;
  }
});

device.addEventListener('keydown', e => {
  if(e.key !== 'Enter' || e.shiftKey) return;
  if(e.target.id === 'ldrReply'){ e.preventDefault(); device.querySelector('[data-ldrreply]').click(); }
});

Object.assign(LEAD_TAL.where, {
  leadCohort:'a cohort', leadMember:'a candidate',
  leadSum:'a 90-day summary'
});
Object.assign(LEAD_TAL.ctx, {
  leadCohort: ['Where is this cohort stuck?','Brief me for this call','Who here needs me most?'],
  leadMember: ['What should I say to them?','Is this recoverable?','Draft a check-in'],
  leadSum:    ['Are they ready to be promoted?','What should I write here?']
});
Object.assign(ASK_WHERE, LEAD_TAL.where);

function ldrPinThread(){
  if(S.portal !== 'leader' || S.view !== 'leadMessages') return;
  const box = device.querySelector('.ldr-dm-thread > .msgs');
  if(box) box.scrollTop = box.scrollHeight;
}
device.addEventListener('click', e => {
  const g = sel => device.querySelector(sel);
  const now = () => 'Just now';

  if(e.target.closest('[data-discpost]')){
    const ta = g('#discMsg'); const text = ta ? ta.value.trim() : '';
    if(!text){ if(ta) ta.focus(); return; }
    const pin = g('#discPinNew') && g('#discPinNew').checked;
    if(pin) LEAD_DISC.forEach(t => t.pinned = false);
    LEAD_DISC.unshift({id:'t'+Date.now(), who:LEAD_ME, text, when:now(), at:Date.now(), pinned:!!pin, reacts:[], replies:[]});
    render(); return;
  }
  const rp = e.target.closest('[data-discreply]');
  if(rp){ S.discReplyTo = rp.dataset.discreply; S.discEdit = null; render(); return; }
  const sr = e.target.closest('[data-discsendreply]');
  if(sr){ const t = LEAD_DISC.find(x=>x.id===sr.dataset.discsendreply); const ta=g('#discReplyTa');
    const text = ta ? ta.value.trim() : ''; if(!text){ if(ta) ta.focus(); return; }
    if(t) t.replies.push({id:'r'+Date.now(), who:LEAD_ME, text, when:now(), at:Date.now(), reacts:[]});
    S.discReplyTo = null; render(); return; }
  const rc = e.target.closest('[data-discreact]');
  if(rc){ const p = discFind(rc.dataset.discreact); if(p){ const i=p.reacts.indexOf(LEAD_ME.n);
    if(i>=0) p.reacts.splice(i,1); else p.reacts.push(LEAD_ME.n); } render(); return; }
  const pn = e.target.closest('[data-discpin]');
  if(pn){ const id=pn.dataset.discpin;
    if(discPinned()){ S.discPinAsk = id; } else { const p=discFind(id); if(p) p.pinned=true; }
    render(); return; }
  const dp = e.target.closest('[data-discdopin]');
  if(dp){ const id=dp.dataset.discdopin; LEAD_DISC.forEach(t=>t.pinned=false);
    const p=LEAD_DISC.find(t=>t.id===id); if(p) p.pinned=true; S.discPinAsk=null; render(); return; }
  const up = e.target.closest('[data-discunpin]');
  if(up){ const p=discFind(up.dataset.discunpin); if(p) p.pinned=false; render(); return; }
  const ed = e.target.closest('[data-discedit]');
  if(ed){ S.discEdit = ed.dataset.discedit; S.discReplyTo = null; render(); return; }
  const es = e.target.closest('[data-disceditsave]');
  if(es){ const p=discFind(es.dataset.disceditsave); const ta=g('#discEditTa');
    const text = ta ? ta.value.trim() : ''; if(!text){ if(ta) ta.focus(); return; }
    if(p){ p.text=text; p.edited=true; } S.discEdit=null; render(); return; }
  if(e.target.closest('[data-disccancel]')){ S.discReplyTo=null; S.discEdit=null; render(); return; }
  const dpc = e.target.closest('[data-dpclose]');
  if(dpc){ if(dpc.classList.contains('modal') && e.target !== dpc) return; S.discPinAsk=null; render(); return; }
});

const _baseLead4 = render;
render = function(){
  _baseLead4();
  try { ldrPinThread(); } catch(e){ console.warn('thread pin', e); }
  try { ldrRecTick(); } catch(e){ console.warn('rec tick', e); }
};

render();
