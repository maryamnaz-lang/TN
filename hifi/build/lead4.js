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
   notes on the end of the 90 days. Cohort 47 is four days old, so its
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
    ['Priya Nair','priya','PN','Welcome to Cohort 47. First call is Monday at 6. Before then: open chapter 1, and post one sentence here about what you are hoping to get out of the 90 days.','9:00 AM',true],
    ['Ahmed Farouk','owen','AF','Hoping to stop being the bottleneck on my own team. That is the honest version.','11:34 AM'],
    ['Beatriz Lima','lena','BL','Mine is hard conversations. I avoid them until they are twice as hard.','2:12 PM']
  ]
};

const ldrBoard = id => +id === LEAD_COHORTS[0].id ? ROOM : (LDR_BOARDS[id] || []);
/* THE POST COUNT IS NO LONGER DRAWN. It rode inside each cohort tab as an
   `.lf-n` — "Cohort 41  5" — and a tab is a place you go, not a figure you
   read: three counts in a three-tab strip is three numbers competing with the
   three names you are actually choosing between, and the count of posts on a
   board you are about to open is on the board. The helper stays because the
   board's own head is where a count belongs if one is ever wanted. */
const ldrPosts = id => ldrBoard(id).filter(r => r[0] !== 'day').length;

/* --------------------------------------------------------------------------
   THE LEADER'S ONE-TO-ONE THREADS

   Three candidates, and each thread is about the thing their flag says. The
   candidate side draws its own half of the Priya thread in `V.messages`; this
   is not that thread — Maryam's is with her own leader and Maryam is in
   Cohort 41, so it IS the same relationship. It is left out of this list on
   purpose: the three here are the three the flags said Priya owed a message,
   which is what a leader opens this page to do.

   TOBIAS IS NO LONGER FLAGGED AND HIS THREAD STAYS, which is the right way round
   for an inbox. The attention queue was cut to three on 1 Sep 2026 and he was
   one of the nine who came back — so his thread is now what a resolved one looks
   like: Priya's message four days ago about eight days of silence, and his reply
   two days ago saying he is back and at 35%. A message list that only held
   currently-flagged people would delete its own history every time somebody
   recovered, which is the opposite of what `lnotes` and this page are for.
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
    {me:1, t:'Tobias — eight days quiet and 18% at week 5. Not chasing you, just checking the course is still something you want.', w:'4 days ago'},
    {me:0, t:'Sorry — work ate the fortnight. I am back in and through to 35%.', w:'2 days ago'}
  ]}
];

/* WHICH CONVERSATION IS OPEN: 'boards', 'direct' or 'new'. It used to be which
   TAB was open, which is the same key doing a smaller job — the rail holds both
   kinds now, so this says what the right-hand pane is showing. */
S.ldrMsg = 'boards';
/* The inbox filter, 'all' or 'unread'. On `S` because it is a decision rather
   than a keystroke: the panel re-renders whenever a message is sent, and coming
   back to the list you chose is right where coming back to a half-typed query
   is not (the notes panel makes the same split). */
S.ldrBoardCo = LEAD_COHORTS[0].id;
S.ldrTh = 0;
/* NARROW WIDTHS SHOW ONE OF THE TWO COLUMNS AT A TIME, and this is which.
   Both columns are always rendered — the class on `.ldr-dm` is what §36.17
   reads to decide, so at 900px and up the pair is a two-pane inbox whatever
   this says, and below it the same markup is a list you tap into and come
   back out of. State rather than a DOM class because `render()` rebuilds the
   panel from scratch (trap 9). */
S.ldrThOpen = false;
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
/* ==========================================================================
   MESSAGES IS ONE INBOX — 2 Sep 2026
   Maryam, with a reference: "i want messages module to have the structure like
   the reference attached." One left rail holding BOTH kinds of conversation —
   the three cohort boards and the direct threads, grouped and labelled — with
   the conversation on the right, a filter row above the pair, and one field at
   the foot of whatever is open.

   WHAT IT REPLACES, AND WHY THE TWO-TAB VERSION HAD TO GO. The module was
   `Cohort boards | Direct` as a `.cs` strip, and each tab drew its own surface:
   boards a single board with a cohort picker in its heading row, Direct a
   two-pane list-and-thread. Both halves were right about their own content and
   the pair was wrong about the module: a leader with a board post and two
   people waiting had to choose a TAB before they could see either, and the
   unread count sat on a tab rather than on the row it belonged to. An inbox is
   one list of conversations, sorted by kind, and this product already draws
   that shape one tab down — so the two-pane frame stays, the cohort picker and
   the tab strip both go, and the rail carries everything.

   THE RIGHT-HAND PANE IS UNCHANGED IN KIND: `.msgs` for the thread, `.composer`
   pinned under it, the pair scrolling inside its own box (§36.17). What changes
   is that it now renders one of THREE things — a board, a thread, or the
   new-message picker — off `S.ldrMsg`.

   FOUR CONTROLS FROM THE REFERENCE ARE NOT DRAWN, and each is §60 rather than
   an omission: the **filter funnel** (All and Unread are the filter, and a
   second one would filter by a field no conversation carries), **Mentions** (no
   message in this build records a mention, so the tab would open an empty list
   for ever), **Archived conversations** (nothing archives one, and a row that
   opens an empty drawer is the dead control the rule is about) and the chat
   header's **call / video / info / more** — `callOpen` builds the CANDIDATE's
   interview, so every leader-side Join in this build is unwired, and three of
   the four are menus with nothing in them.
   WHAT IS DRAWN IS WIRED: All / Unread, the search, New message, picking any
   conversation, and posting to either kind.
   ========================================================================== */
/* THE INBOX SEARCH FILTERS THE DOM AND DOES NOT RE-RENDER, for the reason ai4
   records and the notes panel repeats: `render()` replaces `device.innerHTML`,
   so a re-render per keystroke destroys the field and takes the caret with it.
   The rail is a flat run of group headings and rows, so the walk carries the
   heading it last passed and switches it off when nothing under it survived —
   a group label over an empty group is the tell that a filter is hiding
   something rather than that there is nothing there. */

V.leadMessages = () => {
  const co = lcoOf(S.ldrBoardCo);
  const board = ldrBoard(co.id);
  const th = LDR_THREADS[S.ldrTh] || LDR_THREADS[0];
  const waiting = t => t.msgs.length && t.msgs[t.msgs.length - 1].me === 0;
  /* `fresh` WENT WITH THE PICKER — it derived "everybody you have not written
     to yet" for the New message list, and with that list gone it was a query
     with no reader. `lmembers()` keeps three other callers. */

  /* THE ROW IS ONE SHAPE FOR BOTH KINDS, which is the whole point of merging
     the two lists: a board and a person are both "a conversation, what was said
     last, and when". Only the mark differs — a cover for a board (§86's 9:5
     rectangle, so a cohort wears the same picture here as on its own card) and
     a face for a person. */
  const boardRow = c => {
    const b = ldrBoard(c.id), last = b.filter(r => r[0] !== 'day').pop();
    const on = S.ldrMsg === 'boards' && c.id === co.id;
    return `<button class="ldr-dm-t${on ? ' on' : ''}" data-ldrpick="board:${c.id}" role="tab" aria-selected="${on}">
      <span class="ldr-inbox-mk">${I.group}</span>
      <span class="ldr-dm-tb">
        ${''/* THE LEVEL IS ON THE SECOND LINE, NOT BESIDE THE NAME. It shipped
               as a caption inside the title and the rail is ~235px wide at a
               1280 frame: "Cohort 41" plus "Explorer – E3" wrapped, and the
               wrapped half ran under the timestamp holding the row's right
               edge. The title line is one string on every row now — a name,
               exactly like the DM rows beside it — and the level joins the
               facts underneath, where §36's own truncation already handles a
               line that is too long. */}
        <span class="ldr-dm-tn">${lname(c)}</span>
        <span class="ldr-dm-tx">${llevel(c)} &middot; ${c.members.length} members${last ? ' &middot; ' + (last[5] ? 'You: ' : last[0].split(' ')[0] + ': ') + last[3] : ''}</span>
      </span>
      <span class="ldr-dm-tw">${last ? last[4] : ''}</span>
    </button>`;
  };
  const dmRow = (t, i) => {
    const last = t.msgs[t.msgs.length - 1];
    const on = S.ldrMsg === 'direct' && i === S.ldrTh;
    return `<button class="ldr-dm-t${on ? ' on' : ''}" data-ldrpick="dm:${i}" role="tab" aria-selected="${on}">
      <span class="mem-av mem-ph">${avatar({i:t.i, img:AV[t.img]}, 36)}</span>
      <span class="ldr-dm-tb">
        <span class="ldr-dm-tn">${t.who}${waiting(t) ? '<i class="ldr-dm-dot" aria-label="waiting on your reply"></i>' : ''}</span>
        <span class="ldr-dm-tx">${last ? (last.me ? 'You: ' : '') + last.t : 'No messages yet'}</span>
      </span>
      <span class="ldr-dm-tw">${last ? last.w.replace(/ \d?\d:\d\d [AP]M/,'') : ''}</span>
    </button>`;
  };

  return `<main class="main"><div class="page msg-mod">
  ${crumb(['Dashboard','leadDash'],'Messages')}
  ${ph('Messages')}
  <div class="sec ldr-dm-sec">
    ${''/* THERE IS NO BAR ABOVE THE TWO PANES (Maryam, 2 Sep 2026: "remove the
           top bar of tabs and search"). It held an All / Unread pair, a search
           field and New message, and all three were answers to a list that is
           nine rows long: three cohort boards and six threads, every one of
           them on screen at once at desktop. A filter over a list you can see
           in full is a control that can only ever hide something.
           THE CANDIDATE'S MESSAGES IS THE REFERENCE for this whole view and it
           has no such bar either — the rail IS the index, and the waiting dot
           on a row is what "unread" means here.
           WHAT WENT WITH IT: `S.ldrInbox` and its two branches in the list,
           `ldrInboxFilter` and the `input` listener that drove it, and the
           `S.ldrMsg === 'new'` picker, which `data-ldrnew` was the only way
           into. Starting a thread is unchanged and still lives where the
           REASON to start one is — `data-ldrdm` on the attention queue's
           Contact button (lead.js) and on the member page's Contact Candidate
           (lead2.js) — which is the better entry point anyway: you write to a
           candidate because of something you just read about them. */}
    <div class="ldr-dm${S.ldrThOpen ? ' show-thread' : ''}">
      <div class="ldr-dm-list" role="tablist" aria-label="Your conversations">
        <div class="ldr-dm-lh">Cohort boards<span class="t-helper-01">${LEAD_COHORTS.length}</span></div>
        ${LEAD_COHORTS.map(boardRow).join('')}
        <div class="ldr-dm-lh">Direct messages<span class="t-helper-01">${LDR_THREADS.length}</span></div>
        ${LDR_THREADS.map(dmRow).join('')}
      </div>
      <div class="ldr-dm-thread">
        ${S.ldrMsg === 'boards' ? `
        <div class="ldr-dm-h">
          <button class="ph-back ldr-dm-back" data-ldrthback="1" aria-label="Back to your conversations">${I.arrowLeft}</button>
          <span class="ldr-inbox-mk">${I.group}</span>
          <span class="ldr-dm-hb"><b>${lname(co)}</b><span>${co.members.length} members &middot; week ${co.week} of 13 at ${llevel(co)} &middot; the same board they read on their own Cohort page</span></span>
        </div>
        ${board.length ? `<div class="msgs room">
          ${board.map(r => r[0] === 'day'
            ? `<div class="m-day"><span>${r[1]}</span></div>`
            : roomLine(r[0], r[1], r[2], r[3], r[4], r[5])).join('')}
        </div>` : `<div class="msgs"><div class="empty" style="border:0">${I.chat}
          <h3>Nothing posted yet</h3><p>${lname(co)} started ${co.day} day${co.day === 1 ? '' : 's'} ago. Opening the board yourself is usually what starts it.</p></div></div>`}
        <div class="composer">
          <input class="inp" id="ldrPost" placeholder="Post to ${lname(co)}" aria-label="Post to the cohort">
          <button class="composer-send" data-ldrpost="1" aria-label="Post">${I.send}</button>
        </div>`
        : `
        <div class="ldr-dm-h">
          <button class="ph-back ldr-dm-back" data-ldrthback="1" aria-label="Back to your conversations">${I.arrowLeft}</button>
          <span class="mem-av mem-ph">${avatar({i:th.i, img:AV[th.img]}, 36)}</span>
          <span class="ldr-dm-hb"><b>${th.who}</b><span>Private &middot; Cohort ${th.co} &middot; you can see their chapters, scores and attendance</span></span>
        </div>
        <div class="msgs">
          ${th.msgs.length ? '' : `<div class="m-day"><span>No messages yet &mdash; this one starts with you</span></div>`}
          ${th.msgs.map(msg => `<div class="m ${msg.me ? 'me' : 'them'}">
            <span class="m-av">${avatar(msg.me ? {i:LEADER.i, img:LEADER.img} : {i:th.i, img:AV[th.img]}, 32)}</span>
            <div class="m-c">
              <div class="m-b">${msg.t}</div>
              <div class="m-w">${msg.me ? 'You' : th.who} &middot; ${msg.w}</div>
            </div>
          </div>`).join('')}
        </div>
        <div class="composer">
          <input class="inp" id="ldrReply" placeholder="${th.msgs.length ? 'Reply to' : 'Message'} ${th.who.split(' ')[0]}" aria-label="${th.msgs.length ? 'Reply' : 'Message'}">
          <button class="composer-send" data-ldrreply="1" aria-label="Send">${I.send}</button>
        </div>`}
      </div>
    </div>
  </div>
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
/* `k` IS THE BADGE ARTWORK AND IT IS STATED PER ROW, NOT DERIVED (Maryam, 2 Sep
   2026: "this certifications page on cohort leader should look like the
   certifications experience on the candidate portal"). `CERT_ART` is the six
   embedded WebPs `build.py` carries, and the candidate's own tab reads it the
   same way through `certAll`'s `k`. Deriving the key from the name would be a
   string match on product copy — the thing `factIcon`'s `\bstar\b` bug is the
   worked example of, one file over.
   THE THREE PICKED HERE ARE ABOUT THE SUBJECT: `cohort` for leading one,
   `assess` for levelling, `course` for facilitating the 90 days. Nothing is
   minted; a fourth certification takes whichever of the six fits. */
const LDR_CERTS = [
  {k:'cohort', n:'Certified Cohort Leader', track:'Foundation', on:'February 12, 2026', by:'TalentNext'},
  {k:'assess', n:'Assessment &amp; Levelling', track:'Core', on:'March 3, 2026', by:'TalentNext'},
  {k:'course', n:'90-Day Programme Facilitation', track:'Core', on:'April 21, 2026', by:'TalentNext'}
];

/* ==========================================================================
   THE CERTIFICATIONS PAGE IS THE CANDIDATE'S, ONE PORTAL OVER — 2 Sep 2026

   `certsTab` (views.js) was rebuilt the same day against two screenshots of a
   Credly profile: a black card headed "Congratulations on your most recent
   certification" holding the badge, the name and the issuer with the two
   controls at the end of the row, then "All certifications" over a grid of
   upright cards. This page had the same content in the shapes that preceded
   it — a `.cert` hero and a `.tile-stack` of `.cardrow`s — so what changes is
   the drawing and not one figure.

   IT IS THE SAME CLASSES, NOT A CALL TO `certHero` / `certGrid`. Both of those
   read `CERT_ART[c.k]` (which crosses) and then do two things that do not: the
   hero's Download is `data-go="transcript"`, a CANDIDATE view, and every grid
   card is a `data-go="transcript"` target. A leader's certificate has no page
   of its own in this build, so the leader's cards are `<div>`s — §60's rule,
   arrived at from the honest side: rather than draw a control that goes
   nowhere, do not draw a control.

   THE HERO IS `.dark-card` AND IT LEADS THE PAGE. It was the third section,
   under the figure band and a `.note`; the reference puts the certification
   first because it is what the page is about, which is also §75's own test for
   who may be black. It is NOT `.cert` any more, and that is the fix for the
   trap the old note here recorded at length: `.cert` is in ai5's `DARK_CARD`,
   so `placeDark` hoisted it into the head band and the page had to be written
   around that. `.dark-card` is in no pass's list, so the card simply stays
   where it is written and the band keeps its own full-width summary.
   ========================================================================== */
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

/* THE NEWEST ONE IS IN THE GRID TOO, which is the candidate tab's own decision
   and its note is the argument: an "all" that silently drops the newest is a
   collection with a hole in it. Newest first, so the grid opens on the card the
   hero is about. */
const ldrCertGrid = list => list.slice().reverse().map(c => `<div class="crt-card">
    <span class="crt-art"><img src="${CERT_ART[c.k]}" alt=""></span>
    <span class="crt-n">${c.n}</span>
    <span class="crt-i">${c.by}</span>
    <span class="crt-on">Issued ${c.on}</span>
  </div>`).join('');

V.leadCerts = () => {
  const led = 8, hours = 42;
  const promoted = 34;
  /* THIRTEEN CALLS A COHORT, DERIVED FROM THE COHORTS CLOSED (1 Sep 2026). This
     cell was "Interviews conducted: 62", which is an AGENT's figure — the same
     number the public listing printed, and the one thing on a volunteer's own
     record that belonged to the paid role. A cohort leader's throughput is the
     calls they ran, and a closed cohort ran thirteen of them, so the figure is
     `led` × 13 rather than a second literal that could disagree with it. */
  const calls = led * 13;
  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Certifications')}
  ${''/* Three blocks in a row were explaining this page: this line, Tal's
        summary, and a 44-word `.note` about the volunteer role. The stat
        cells below state the four figures, Tal reads them, and the note
        makes the one point neither can. This line was the redundant third. */}
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
  <div class="sec">
    <div class="note"><span>${I.info}</span><div class="nb"><b>Leading is a volunteer role</b>There are no fees and no settlements on this side of TalentNext. What the time earns is recognised in certifications, and in the training that leads to them.</div></div>
  </div>
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
  <div class="sec tint">
    <div class="sec-h"><h2>In progress</h2><span class="t-helper-01">Candidate Mentoring &middot; Advanced track</span></div>
    <div class="tile">
      <div class="kv"><span class="k">What it opens</span><span class="v n">Assessing the Builder band, B1 to B3</span></div>
      <div class="kv"><span class="k">Awarded when</span><span class="v n">All three below are complete</span></div>
    </div>
    <ol class="steps mt5">
      <li><span class="s-n">${I.checkFilled}</span><span class="s-b"><b>Lead six cohorts to completion</b>
        Eight closed, so this one is done. Completion means the cohort finished the 90 days, not that every candidate was promoted.</span></li>
      <li><span class="s-n">${I.checkFilled}</span><span class="s-b"><b>Forty hours of leader training</b>
        ${hours} hours this year. The Advanced track adds twelve more, which is the part still open.</span></li>
      ${''/* IT WAS "TWELVE SIGNED LEVEL DECISIONS REVIEWED" (1 Sep 2026). A
             cohort leader does not set levels, so the requirement that named
             them named nothing — and the requirement it becomes is the same
             SHAPE, which is the point: nine of twelve reviewed, three still
             waiting, and the one thing on this list you cannot finish alone.
             What is reviewed is the 90-day summary, which is the leader's own
             signed document and the only one there is. */}
      <li><span class="s-n">3</span><span class="s-b"><b>Twelve published 90-day summaries reviewed</b>
        Nine of twelve reviewed by the manager of cohort leaders. The three waiting are from the cohorts you closed in June.</span></li>
    </ol>
    <p class="t-helper-01 mt4">Reviewed means a manager of cohort leaders read your summary against the cohort&rsquo;s own record and agreed with the recommendation. It is the one requirement you cannot finish on your own.</p>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>The record behind them</h2></div>
    <div class="facts">
      <div><span class="l">Leading since</span><span class="v">${LEADER.since}</span></div>
      <div><span class="l">Cohorts closed</span><span class="v">${led}</span></div>
      <div><span class="l">Cohort calls led</span><span class="v">${calls}</span></div>
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
   that IS about leading — the rating, the cohorts, the range and the bio — and
   it says which of the two roles the page is about.

   AND SINCE 1 SEP 2026 THE SEPARATION IS THE WHOLE PAGE, NOT A CAVEAT ON IT.
   A cohort leader does not interview, so three things on this page were the
   agent's record standing on the volunteer's page: "62 interviews" on the
   public card and again under Your standing, a 45-minute "session length", and
   an availability calendar whose entire purpose was letting candidates book an
   interview. Each is replaced by the leading equivalent rather than deleted,
   because the page still has to answer the same four questions — who you are,
   what candidates see, when you are on, and how you are measured.

   EDITING IS A SHEET, READING IS THE PAGE. Same shape as the candidate's own
   Profile: `.idhead` with the photo, a `.tile` of `.kv` rows for what is set,
   and an Edit control on the row it edits (§29.10). A page of live inputs
   would be the wireframe's drawing, and this product does not have one.
   ========================================================================== */
V.leadProfile = () => `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Your profile')}
  ${''/* Tal's summary is now this sentence done properly — "your listing is
        what candidates read when they choose you" — so the line above it
        went rather than the line below. */}
  ${ph('Your profile',`${LEADER.range} &middot; leading since ${LEADER.since}`)}
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
      <div class="kv"><span class="k">Call length</span><span class="v n">60 minutes, weekly</span></div>
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
          <span class="idmeta">${stars(4.9)} 4.9 &middot; 8 cohorts led &middot; ${LEADER.range}</span>
        </div>
      </div>
      <p class="t-helper-01">&ldquo;Fifteen years running operations teams. I am direct, I move quickly, and I do not pad feedback &mdash; if something is not working I will say so in the first ten minutes.&rdquo;</p>
    </div>
    <p class="t-helper-01 mt4">This is your listing as a cohort leader. Interviews and their fees belong to your agent listing and are set there, not here &mdash; leading a cohort is unpaid, and nobody books you from this card.</p>
  </div>
  <div class="sec">
    ${''/* TWO ROWS BECAME ONE, AND THE ONE THAT SURVIVED IS THE REAL ONE
           (1 Sep 2026). The first row was a bookable calendar — "Tuesday and
           Thursday afternoons &middot; 6 slots open next week" — which only
           meant anything while candidates could book this person for an
           interview. Nobody books a cohort leader. The second row was already
           the truth and is now the section: three cohorts, three fixed hours a
           week, read off the same cohort record `lcall` reads.
           IT KEEPS THE SHEET, because the hours themselves are still a setting
           a leader changes — what changed is that changing one moves a call
           rather than opening a slot. */}
    <div class="sec-h"><h2>When you are on</h2><span class="t-helper-01">Three cohorts, one hour a week each</span></div>
    <div class="tile-stack">
      <div class="cardrow">
        <span class="cardrow-ic">${I.group}</span>
        <span class="cardrow-b">
          <span class="cardrow-t">Your cohort calls</span>
          <span class="cardrow-d">${LEAD_COHORTS.map(c => c.call.toLowerCase()).join(' &middot; ')}</span>
        </span>
        <span class="cardrow-a">
          <button class="btn btn-sm noic" data-ldravail="1">Manage</button>
        </span>
      </div>
      <div class="cardrow">
        <span class="cardrow-ic">${I.calendar}</span>
        <span class="cardrow-b">
          ${''/* IT NO LONGER SAYS WHERE THE ATTENDANCE IS (1 Sep 2026). "Attendance
                 is on the Calls page" was true until that page's "Already run"
                 section was removed; the figure survives in `PAGESUM.leadCalls`,
                 which is Tal's own reading of it, and a settings row is not the
                 place to say so. What is left is the count, which this row is
                 for, and the way to the page it belongs to. */}
          <span class="cardrow-t">Calls already run</span>
          <span class="cardrow-d">${LEAD_RUN.length} behind you across your three cohorts</span>
        </span>
        <span class="cardrow-a">
          <button class="btn btn-sm noic" data-go="leadCalls">Upcoming Sessions</button>
        </span>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Your standing</h2><span class="t-helper-01">Read-only &middot; across every cohort you have closed</span></div>
    <div class="facts">
      <div><span class="l">Candidate rating</span><span class="v stand-rate">${stars(4.9)}4.9</span></div>
      <div><span class="l">Cohorts led</span><span class="v">8</span></div>
      <div><span class="l">Completion rate</span><span class="v">84%</span></div>
      <div><span class="l">Level movement</span><span class="v">+0.8 levels</span></div>
    </div>
    <p class="t-helper-01 mt4">Completion rate is the one of the four you cannot improve by being generous at evaluation &mdash; recommending a promotion somebody is not ready for comes back later as a candidate who does not finish the next 90 days.</p>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Who reviews you</h2></div>
    <div class="tile">
      <div class="kv"><span class="k">You</span><span class="v">Cohort leader</span></div>
      <div class="kv"><span class="k">Reviewed by</span><span class="v n">Manager of cohort leaders, then supervisor</span></div>
      <div class="kv"><span class="k">Your own level</span><span class="v n">Adjustable by a super-admin</span></div>
      <div class="kv"><span class="k">Summaries reviewed</span><span class="v n">9 of 12 published this year</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Notifications</h2></div>
    <label class="tg"><div class="tb"><b>A candidate goes quiet</b><span>After four days without a sign-in</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>A cohort call is an hour away</b><span>One reminder, on the day</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Posts on a cohort board</b><span>A daily digest rather than each one</span></div><input type="checkbox" checked><span class="sw"></span></label>
    <label class="tg"><div class="tb"><b>Summary reminders</b><span>A week before a cohort reaches day 90</span></div><input type="checkbox"><span class="sw"></span></label>
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

/* THE CALENDAR IS A WEEK OF TOGGLES, not a month grid. What a leader sets is a
   repeating weekly pattern — "Thursday evenings" — and a month view would ask
   them to do that fifty-two times. `.tg` with `.sw` is the product's own switch
   row, so the hours a leader commits are drawn by the same control as the
   notification they turn off.

   IT IS THE CALL SCHEDULE NOW, NOT BOOKABLE HOURS (1 Sep 2026). Every row used
   to carry two different things: an open window a candidate could book an
   interview in ("2:00 – 5:00 PM") and a fixed cohort call shown "for context".
   Nobody books a cohort leader, so the windows are gone and the calls are the
   whole list — which also fixes something the old sheet could not: the three
   days with a call were the three that were ON, so a leader turning Thursday
   off was switching off a bookable window and appearing to switch off Cohort
   41's call.

   THE DAYS ARE READ OFF `LEAD_COHORTS`, NOT TYPED. `c.call` is already
   "Thursday 6:00 PM" and the Cohorts page, the roster and the candidate's own
   Cohort page all read it; a second copy here is the drift `bkStamp` exists to
   prevent, and this sheet had already drifted once — its Monday row said
   "Cohort 47 call at 6:00 PM" while `LEAD_COHORTS[2].call` said the same thing
   in two other places. A day with no call is `Nothing scheduled` and is off. */
const LDR_DAY_NAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const ldrDays = () => LDR_DAY_NAMES.map(d => {
  const c = LEAD_COHORTS.filter(x => x.call.split(' ')[0] === d)[0];
  return c
    ? [d, `${lname(c)} &middot; ${c.call.split(' ').slice(1).join(' ')} &middot; 60 minutes`, 1]
    : [d, 'Nothing scheduled', 0];
});

function ldrAvailSheet(){
  return `<div class="modal ${S.ldrAvail ? 'on' : ''}" data-ldrclose="avail">
    <div class="sheet">
      <div class="sheet-h"><h2>Your weekly calls</h2>
        <button class="x" data-ldrclose="avail" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <p class="t-helper-01 mb6">One call a week for each cohort you lead. Moving one moves it for every candidate in that cohort, so the change is announced on their board.</p>
        ${ldrDays().map(([d,detail,on],i) => `
        <label class="tg"><div class="tb"><b>${d}</b><span>${detail}</span></div>
          <input type="checkbox" id="ldrDay${i}" ${on ? 'checked' : ''}><span class="sw"></span></label>`).join('')}
        <p class="t-helper-01 mt5">${LEAD_COHORTS.length} calls a week, ${LEAD_COHORTS.length * 60} minutes in total. A cohort that reaches day 90 gives its slot back.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-ldrclose="avail">Cancel</button>
        <button class="btn btn-p noic" data-ldrclose="avail">Save changes</button>
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
  /* pressing the tab always lands on the list, never back inside whichever
     thread was open last time — the tab is "Direct", not "Yuki Tanaka" */
  if(ms){ S.ldrMsg = ms.dataset.ldrmsg; S.ldrThOpen = false; render(); return; }

  const bd = t.closest('[data-ldrboard]');
  if(bd){ S.ldrBoardCo = +bd.dataset.ldrboard; render(); return; }

  /* ONE BRANCH PICKS EITHER KIND. The rail's two groups are one list of
     conversations, so a row carries `kind:id` and this sets both halves of what
     the right-hand pane reads. Split on the FIRST colon: the id is a number and
     the kind is a word, neither of which can contain one. `S.ldrThOpen` is what
     §36.17 reads below 900, where the list and the pane are two screens. */
  const pk = t.closest('[data-ldrpick]');
  if(pk){
    const [kind, id] = pk.dataset.ldrpick.split(':');
    if(kind === 'board'){ S.ldrMsg = 'boards'; S.ldrBoardCo = +id; }
    else { S.ldrMsg = 'direct'; S.ldrTh = +id; }
    S.ldrThOpen = true;
    render();
    return;
  }



  const th = t.closest('[data-ldrth]');
  if(th){ S.ldrTh = +th.dataset.ldrth; S.ldrThOpen = true; render(); return; }
  if(t.closest('[data-ldrthback]')){ S.ldrThOpen = false; render(); return; }

  /* ------------------------------------------------------------------------
     CONTACT A CANDIDATE BY NAME — `data-ldrdm`
     Maryam, 1 Sep 2026: the attention queue's last column "takes the user on
     the direct chat with that candidate on click".

     IT RESOLVES A NAME, NOT AN INDEX, and that is the whole reason it is a
     function rather than a `data-ldrth`. `LDR_THREADS` is an inbox in
     most-recent order — the note over it says so, and Tobias is in it because a
     resolved thread keeps its history — so an index written into the attention
     table would point at whoever happened to be third the day it was written.
     The queue is derived from `lflag` and the inbox is not, so the only stable
     thing the two share is the person.

     A CANDIDATE WITH NO THREAD GETS AN EMPTY ONE, WHICH IS THE POINT. Two of
     the three flagged candidates have been written to and Chloe Ferreira has
     not, so the alternatives were to leave her button dead — §60's dead control
     on a live surface — or to write her a conversation, which is inventing the
     product copy §74 rules out. An empty thread is neither: it is what "you
     have not messaged her yet" actually looks like, and `V.leadMessages` draws
     it (three readers guard for it, see the note on `unread`).

     THE FACE AND THE COHORT COME OFF THE MEMBER RECORD, never typed here —
     `lmembers()` is the same walk the queue itself is built from, so the
     initials, the photograph and the cohort number in the thread header are the
     ones the roster shows. A name that is in no cohort simply does not
     navigate, rather than opening a thread with somebody who does not exist.

     IT NAVIGATES ITSELF because it has two things to set that `data-go` cannot
     carry — the tab and the person. `S.ldrThOpen` is `true` for the same reason
     the row-press sets it: below 900 the list and the thread are two screens,
     and arriving on the list having asked for one person is a press wasted.
     ------------------------------------------------------------------------ */
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
    S.ldrMsg = 'direct';
    S.ldrTh = i;
    S.ldrThOpen = true;
    go('leadMessages');
    return;
  }

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
   THE PAGES UNDER A MODULE NAME THEMSELVES

   `LEAD_TAL.where` is the leader's map of view to page name, written in
   lead.js for the Tal panel's own header and copied into `ASK_WHERE` for the
   ask field's "Back to ..." label. It has an entry per module, which was
   every leader page there was. These four are pages UNDER a module — a
   roster, a candidate, a summary — and without an entry each one would be
   labelled "TalentNext" by ai4's fallback. `leadEval` was the fourth and is
   deleted with the level decision (1 Sep 2026).

   `.ctx` is the same story for Tal's suggested questions: a page with no
   entry falls back to the dashboard's three, which ask about the wrong page.
   Extended from here rather than edited in lead.js, so the module map and the
   detail map are each written where the pages they name are built.
   ========================================================================== */
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

/* ==========================================================================
   THE THREAD OPENS AT ITS FOOT — `ldrPinThread`
   Maryam, 2 Sep 2026: "the latest one appears at the bottom".

   §36.18b's `margin-top:auto` answers a SHORT thread — the messages sit on the
   composer instead of floating at the top of an empty pane. It cannot answer a
   long one: once the content is taller than the scroller, a fresh `scrollTop`
   of 0 shows the OLDEST message and the newest is below the fold. One line of
   geometry, after the paint.

   IT IS NOT `scrollIntoView` AND NOT `behavior:'smooth'`. The pane is inside
   `#device`, which is itself a scroller inside a scaled frame, and
   `scrollIntoView` walks every ancestor — it scrolls the page as well as the
   thread, so opening Messages jumped the whole app down. Setting `scrollTop` on
   the one element moves the one element. Smooth would animate on every render,
   including the render that only moved a class.

   RUN AFTER `_baseLead`, NOT INSIDE A VIEW, because `render()` replaces
   `device.innerHTML` and the element this measures does not exist until it has.
   Wrapping is lead.js's own idiom for the same reason `leadStick` is wrapped
   there, and this file is parsed after it, so the wrapper composes rather than
   competing.

   NO STICK-TO-BOTTOM STATE, unlike ai3's thread pin. That one tracks whether
   the reader has scrolled up so an arriving message does not yank them back;
   here every render is a navigation or a sent message — both of which SHOULD
   land at the foot — and there is no background arrival to fight with.
   ========================================================================== */
function ldrPinThread(){
  if(S.portal !== 'leader' || S.view !== 'leadMessages') return;
  const box = device.querySelector('.ldr-dm-thread > .msgs');
  if(box) box.scrollTop = box.scrollHeight;
}
const _baseLead4 = render;
render = function(){
  _baseLead4();
  try { ldrPinThread(); } catch(e){ console.warn('thread pin', e); }
};

render();
