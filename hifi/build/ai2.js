/* ==========================================================================
   AI LAYER — pass 2
   Two things an assistant needs before it is part of a product rather than a
   feature bolted to one.

   1. MEMORY YOU CAN SEE AND CORRECT. 90 days of data is only worth
      anything if something carries the thread through it. But a system that
      remembers you and will not show you what it remembers is worse than one
      that forgets. So: every claim Tal holds, the exact thing it was drawn
      from, and two buttons — that is wrong, and forget this.

   2. AN ASSISTANT THAT ACTS. Until now every Tal affordance returned a
      paragraph. Nothing it offered changed the state of the product. Here it
      drafts into the field you were going to type in, and what it wrote is
      marked as a draft until you accept it. Every action it takes announces
      itself and can be undone in one click.
   ========================================================================== */

/* --------------------------------------------------------------------------
   WHAT TAL KNOWS
   Seven claims, each with the thing it came from. `at` is a transcript
   timestamp where the source is an interview, so the source chip opens the
   line rather than describing it.
   -------------------------------------------------------------------------- */
const MEMO = [
  {k:'You treat handing work over as a risk you are still carrying.',
   why:'You said it in the level interview, unprompted, after describing the vendor review.',
   src:'Level interview', kind:'interview', iv:'level', at:'13:20', when:'20 Aug'},
  {k:'You change your mind when you are in the room, and not when you are sent a document.',
   why:'The reorganization: you rewrote a structural plan after sitting with two engineers.',
   src:'Level interview', kind:'interview', iv:'level', at:'04:02', when:'20 Aug'},
  {k:'You qualify your own answers as you give them.',
   why:'Four separate moments where you played down something you had just described.',
   src:'Level interview', kind:'interview', iv:'level', at:'06:15', when:'20 Aug'},
  {k:'Delegation and hard conversations are your growth areas.',
   why:'Written and signed by Priya Nair in your report.',
   src:'Your report', kind:'report', when:'21 Aug'},
  {k:'Chapter 4 is where you stalled — four opens, never finished.',
   why:'Course activity, not something you told me.',
   src:'Course record', kind:'course', when:'day 34'},
  {k:'You took the vendor review back from Sam and did not tell him why.',
   why:'You wrote this in your notes on chapter 4.',
   src:'Your note', kind:'note', when:'12 Sept'},
  {k:'You would rather be right in a week than roughly right on Tuesday.',
   why:'You named this as the new gap at the re-interview.',
   src:'Re-interview', kind:'interview', iv:'re', at:'22:25', when:'21 Nov'}
];

const NEVER = [
  'Your messages with Priya — the one-to-one thread is not readable by me.',
  'Anything said on a cohort call. The calls are not recorded.',
  'Your card details and billing history.'
];

const MEMO_IC = {interview:'video', report:'document', course:'book', note:'edit'};

/* ==========================================================================
   WHAT THE ONBOARDING TOLD TAL IS HELD HERE TOO, AND THAT IS THE POINT OF IT

   3 Sep 2026. The `onboard` gate replaced a fifteen-minute call with a talent
   consultant, and the one thing it can do that the call could not is KEEP the
   answers. A call's went into one person's head; these are four things the
   candidate said, each traceable to the question that produced it, on the page
   that promises "Mark anything wrong and I will stop using it".

   THEY ARE DERIVED, NOT PUSHED. `obMemo()` reads `S.ob` on every render rather
   than appending to `MEMO` when the gate is left — three reasons, and the
   first is the one that bites: a push would double the rows every time the
   reader walked the gate again from the stage picker, which is a thing this
   prototype invites. The second is that a derived row cannot disagree with the
   read-back the candidate approved. The third is that `MEMO`'s own entries are
   a hand-written record of one candidate's ninety days, and mixing generated
   rows into it would make that list two kinds of thing.

   THEY GO AT THE END, WHICH IS BOTH CORRECT AND NECESSARY. Correct, because
   the section says "Newest first" and these are the oldest things Tal knows —
   they predate the interview by three weeks. Necessary, because `S.memDrop`
   and `S.memWrong` hold INDICES into this list: rows added at the front would
   silently shift every existing index by four, so "Forget this" on the vendor
   review would forget something else.

   `kind:'note'` REUSES `MEMO_IC`'s EXISTING GLYPH rather than adding a fifth.
   Its mark is `I.edit` and its meaning in that table is "you wrote this", which
   is exactly what these are — the only rows in the list whose source is the
   candidate saying something rather than a recording, a report or an activity
   log. `src` names the screen so the provenance reads honestly.

   NO `at` AND NO `iv`, so `V.mem` draws the flat `.memo-src` span rather than
   the button that opens an interview at a timestamp. There is no recording to
   open, and a control that navigates nowhere is §60's dead control.
   ========================================================================== */
const OB_MEMO_WHEN = '4 Aug';
function obMemo(){
  if(!S.obReady || !S.ob || !S.ob.why) return [];
  const rows = [
    ['where', 'Where you were when you joined: ' + obLabel('where').toLowerCase() + '.',
     'You told me on the first screen, before anything was assessed.'],
    ['why',   'You said this is the hard part: &ldquo;' + obLabel('why') + '&rdquo;',
     'Your own words, about the band your quiz put lowest.'],
    ['want',  'What you want out of the 90 days: ' + obLabel('want').toLowerCase() + '.',
     'You chose it from four, on the way in.']
  ].map(([k, key, why]) => ({k:key, why, src:'What you told me', kind:'note', when:OB_MEMO_WHEN}));

  /* THE NOTE TO THE AGENT IS ONLY HELD IF IT WAS WRITTEN, and it is quoted
     verbatim — ob.js's rule is that Tal repeats that string and never
     interprets it, and a `MEMO` row is Tal stating what it holds, so the same
     rule applies here. It is escaped for the same reason ob.js escapes it. */
  if(S.ob.note) rows.push({
    k:'What you wanted your agent to know: &ldquo;' + obEsc(S.ob.note) + '&rdquo;',
    why:'You wrote it yourself, for whoever interviews you.',
    src:'What you told me', kind:'note', when:OB_MEMO_WHEN});
  return rows;
}

V.mem = (f) => {
  const dropped = S.memDrop || [];
  const wrong = S.memWrong || [];
  /* ONE LIST FROM TWO SOURCES, BUILT ONCE AND USED THREE TIMES BELOW — the
     `live` count, the `map` and the indices all have to be reading the same
     array or "Forget this" points at the wrong row. */
  const HELD = MEMO.concat(obMemo());
  const live = HELD.filter((m,i) => !dropped.includes(i));
  return `<main class="main"><div class="page">
  ${crumb(['Profile','account'],'What Tal knows')}
  ${''/* NO DESCRIPTION. This said "N things, each drawn from something you
        can open. Correct anything that is wrong — I will stop using it" and
        `PAGESUM.mem` said "N things I've learned about you, each traced back
        to where it came from. Mark anything wrong and I'll stop using it" —
        the same two clauses in the same order, in the third person and then
        the first. On Tal's own page the voice should be Tal's, so the
        description went and the summary stayed. See the note over `ph()`. */}
  ${ph('What Tal knows about you')}

  <div class="sec">
    <div class="sec-h"><h2>Held about you</h2><span class="t-helper-01">Newest first</span></div>
    <div class="memo">
      ${live.length ? HELD.map((m,i) => dropped.includes(i) ? '' : `
        <div class="memo-r${wrong.includes(i)?' wrong':''}">
          <div class="memo-k">${m.k}</div>
          <div class="memo-w">${m.why}</div>
          <div class="memo-f">
            ${m.at
              ? `<button class="memo-src" data-ivt="${m.iv}" data-at="${m.at}">${I[MEMO_IC[m.kind]]}${m.src} &middot; ${m.at}</button>`
              : `<span class="memo-src flat">${I[MEMO_IC[m.kind]]}${m.src}</span>`}
            <span class="memo-when">Learned ${m.when}</span>
            <span class="memo-act">
              ${wrong.includes(i)
                ? `<span class="memo-flag">Marked wrong &mdash; not in use</span><button class="lnk" data-memok="${i}">Undo</button>`
                : `<button class="lnk" data-memow="${i}">This is wrong</button>`}
              <button class="lnk" data-memod="${i}">Forget this</button>
            </span>
          </div>
        </div>`).join('')
      : `<div class="empty" style="border:0">${I.idea}<h3>Nothing held</h3><p>You have asked me to forget everything. I will start again from what happens next.</p></div>`}
    </div>
  </div>

  <div class="sec">
    <div class="sec-h"><h2>What I have never seen</h2></div>
    <ul class="never">
      ${NEVER.map(n => `<li>${I.viewOff}<span>${n}</span></li>`).join('')}
    </ul>
    <p class="t-legal-01 mt5" style="color:var(--text-helper)">Forgetting a line here removes it from what I use. It does not delete the interview recording or the note it came from &mdash; those are yours and they are managed in Profile.</p>
  </div>
</div></main>`;
};

/* --------------------------------------------------------------------------
   TAL ACTS
   `did` is the record of the last thing Tal changed. It renders as a bar at
   the top of the page it affected, it names the change in the past tense,
   and it can be reversed. Nothing Tal writes is committed: a draft stays a
   draft, visibly, until the person accepts it.
   -------------------------------------------------------------------------- */
const DRAFTS = {
  reply: {
    where: 'messages',
    said: 'Tal drafted a reply to Priya',
    body: 'Thursday works. I will bring the Sam handover — the one I took back after two days without telling him why. I have read the one-pager and the three sentences are the part I did not do.'
  },
  reflection: {
    where: 'chapter',
    said: 'Tal turned your note into a reflection',
    body: 'What I did: gave the vendor review to Sam, then took it back two days later and told him it was capacity. What was actually true: I could see the meeting going wrong and I did not want to own that. What I will try: say the worry out loud at the handover, and let the work stay handed over.'
  }
};

function talDo(kind){
  const d = DRAFTS[kind];
  if(!d) return;
  S.draft = {kind, body: d.body, state: 'new'};
  S.did = {said: d.said, kind};
  S.tal = false;
  if(S.view !== d.where){ S.hist.push(S.view); S.view = d.where; }
  render();
}

const didBar = () => S.did ? `<div class="did">
  <span class="did-mk">${I.ai}</span>
  <span class="did-t">${S.did.said}</span>
  <button class="lnk" data-undo="1">Undo</button>
</div>` : '';

/* the draft, wherever it lands: marked, editable, and not yours until you
   say it is */
const draftBlock = (kind) => {
  const d = S.draft;
  if(!d || d.kind !== kind || d.state === 'gone') return '';
  if(d.state === 'kept') return '';
  return `<div class="draft">
    <div class="draft-h">${talLabel()}<span class="draft-l">Draft &mdash; not sent</span></div>
    <textarea class="inp draft-x" id="draftX" aria-label="Draft">${d.body}</textarea>
    <div class="draft-a">
      <button class="btn btn-p btn-sm noic" data-draft="keep">Use this</button>
      <button class="btn btn-g btn-sm noic" data-draft="redo">Try again</button>
      <button class="btn btn-t btn-sm noic" data-draft="drop">Discard</button>
      <span class="draft-n">Nothing is sent until you send it.</span>
    </div>
  </div>`;
};

/* Tal offers the action rather than an opinion about it */
TAL_ROUTES.unshift(
  [/draft|write (me )?(a )?(reply|response)|word a reply|reply to priya|help me reply/i, () => `<div class="gen">
    <div class="gen-h">${talLabel()}<span class="gen-src">Drawn from her message and your chapter 4 note</span></div>
    <p>I can put a reply in the field for you. It picks up the handover she asked about and the thing you wrote in your notes — you can change every word of it before it goes.</p>
    <div class="gen-f"><button class="btn btn-p btn-sm noic" data-taldo="reply">Draft the reply ${I.arrowRight}</button></div>
  </div>`],
  [/reflection|turn (my|this) note|write up my note/i, () => `<div class="gen">
    <div class="gen-h">${talLabel()}<span class="gen-src">Drawn from your note on chapter 4</span></div>
    <p>Your note has the event but not the shape the chapter asks for. I can restructure it into what you did, what was true, and what you will try — and put it in the notes panel as a draft.</p>
    <div class="gen-f"><button class="btn btn-p btn-sm noic" data-taldo="reflection">Write the reflection ${I.arrowRight}</button></div>
  </div>`],
  [/what do you know about me|what you know|your memory|remember about me/i, () => {
    const live = MEMO.filter((m,i) => !(S.memDrop||[]).includes(i));
    return `<div class="gen">
      <div class="gen-h">${talLabel()}<span class="gen-src">${live.length} things, all sourced</span></div>
      <p>Everything I hold about you came from something you can open — an interview line, your report, your notes, or your course activity. Nothing came from your messages with Priya.</p>
      <div class="quotes">${live.slice(0,3).map(m => `
        <button class="quote" ${m.at?`data-ivt="${m.iv}" data-at="${m.at}"`:'data-go="mem"'}>
          <span class="q-t">${m.at || m.when}</span>
          <span class="q-b"><span class="q-w">${m.src}</span><span class="q-x">${m.k}</span></span>
        </button>`).join('')}</div>
      <div class="gen-f"><button class="lnk" data-go="mem">See all of it, and correct it</button></div>
    </div>`;
  }]
);

/* --------------------------------------------------------------------------
   HANDLERS
   -------------------------------------------------------------------------- */
device.addEventListener('click', e => {
  const t = e.target;

  const doer = t.closest('[data-taldo]');
  if(doer){ talDo(doer.dataset.taldo); return; }

  if(t.closest('[data-undo]')){
    S.draft = null; S.did = null; render(); return;
  }

  const dr = t.closest('[data-draft]');
  if(dr){
    const box = document.getElementById('draftX');
    if(box && S.draft) S.draft.body = box.value;
    const a = dr.dataset.draft;
    if(a === 'keep'){ S.draft.state = 'kept'; S.did = {said:'Tal’s draft is in your field', kind:S.draft.kind}; }
    if(a === 'drop'){ S.draft = null; S.did = null; }
    if(a === 'redo'){ S.draft.body = DRAFTS[S.draft.kind].body; }
    render(); return;
  }

  const mw = t.closest('[data-memow]');
  if(mw){ S.memWrong = [...(S.memWrong||[]), +mw.dataset.memow]; render(); return; }
  const mk = t.closest('[data-memok]');
  if(mk){ S.memWrong = (S.memWrong||[]).filter(x => x !== +mk.dataset.memok); render(); return; }
  const md = t.closest('[data-memod]');
  if(md){ S.memDrop = [...(S.memDrop||[]), +md.dataset.memod]; render(); return; }
});

S.draft = null; S.did = null; S.memWrong = []; S.memDrop = [];

/* --------------------------------------------------------------------------
   PLACING WHAT TAL WROTE
   The draft has to appear where the person was going to type, and the did
   bar at the top of the page it changed. Both are inserted after render
   rather than threaded through every view, so no existing view had to learn
   about them.
   -------------------------------------------------------------------------- */
function placeAI(){
  const page = device.querySelector('.main > .page');
  if(!page) return;

  if(S.did && ((S.did.kind === 'reply' && S.view === 'messages') ||
               (S.did.kind === 'reflection' && S.view === 'chapter'))){
    const anchor = page.querySelector(':scope > .ph') || page.querySelector(':scope > .crumb');
    const bar = document.createElement('div');
    bar.className = 'sec did-sec';
    bar.innerHTML = didBar();
    if(anchor) anchor.insertAdjacentElement('afterend', bar); else page.prepend(bar);
  }

  if(!S.draft) return;

  if(S.draft.kind === 'reply' && S.view === 'messages'){
    const foot = page.querySelector('.msg-foot');
    if(!foot) return;
    if(S.draft.state === 'kept'){
      const inp = foot.querySelector('.composer .inp');
      if(inp){ inp.value = S.draft.body; inp.classList.add('is-draft'); }
    } else {
      const holder = document.createElement('div');
      holder.className = 'draft-wrap';
      holder.innerHTML = draftBlock('reply');
      foot.prepend(holder);
    }
  }

  if(S.draft.kind === 'reflection' && S.view === 'chapter'){
    const notes = page.querySelector('.lsvt-notes');
    const host = notes || page.querySelector('.lsvt-sec');
    if(!host) return;
    if(S.draft.state === 'kept'){
      const box = host.querySelector('textarea');
      if(box){ box.value = S.draft.body; box.classList.add('is-draft'); }
    } else {
      const holder = document.createElement('div');
      holder.className = 'draft-wrap';
      holder.innerHTML = draftBlock('reflection');
      host.appendChild(holder);
    }
  }
}

const _base2 = render;
render = function(){ _base2(); try { placeAI(); } catch(e){ console.warn('placeAI', e); } };
render();
