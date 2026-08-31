/* ==========================================================================
   ASK TAL, IN PLACE
   Tal already lives in a side panel. A panel is a good place to keep a
   conversation, and a bad place to START one: it is behind a button, it
   covers the thing you were reading, and nothing on the page invites you to
   type. So every module's landing page now opens with one line you can type
   into — and typing into it does not open a panel, it turns the page you are
   on into the conversation.

   The model is the AI overview that expands: the surrounding chrome does not
   move, the column you were reading becomes the thread, and one control puts
   it back. Two states of one page, not two pages.

     collapsed   a grey-ruled line, a mark, a prompt. No send control —
                 there is nothing to send yet, and a button that submits an
                 empty field is a button that lies.
     open        the same field at the foot of a thread, with the questions
                 that make sense HERE offered above it, and a way back that
                 names where back is.

   The thread, the answers and the suggestions are the ones Tal already has
   (`S.thread`, `ask()`, `TALCTX`) — this is a second surface onto the same
   assistant, not a second assistant.
   ========================================================================== */

/* ==========================================================================
   THE FIELD LEFT THE BAND AND BECAME THE PAGE'S BOTTOM EDGE
   It used to be the fourth member of the module head — a full-width line
   under what Tal had just said, on the nine landing pages and nowhere else.
   Two things were wrong with that, and they pull in the same direction.

   It was ONLY on landings. A sub-page is where you actually get stuck: the
   chapter, the report, the agent's profile, the interview transcript. Those
   are the screens with a question on them, and they were the screens with no
   way to ask one except the panel behind the floating button.

   And in the band it read as part of what Tal said. It sat inside the wash,
   directly under Tal's sentence, so it looked like the end of Tal's turn
   rather than the start of yours. Moving it off the page and onto the bottom
   edge separates the two: what Tal has to say stays in the head, and the
   thing you type into is the same object in the same place on every screen —
   which is what a persistent control is for.

   So the rule is EXCLUSIONS now, not an allow-list. Everything gets the
   field except two cases, and only one of them is a list.

   A PAGE THAT ALREADY ENDS IN A FIELD DOES NOT GET A SECOND ONE. Two fields
   at the bottom of one screen is a question about which one is which — ai4's
   original reason for keeping the line off Messages — and with the dock at
   the bottom it is a physical overlap as well. That is tested structurally,
   by looking for a `.composer`, rather than by naming views: it catches
   Messages and the leader's Messages, and it also catches the cohort page's
   discussion tab, which no name list would have — the composer there comes
   and goes with the tab, so the condition has to be asked per render.

   The named list is for pages where the dock has nowhere to be:

     coursework, chapter   the LightspeedVT frame. views.js refuses to put
                           even the Tal button here, for two reasons that
                           both hold for a field: the bottom of the column is
                           somebody else's Continue, and Tal can read nothing
                           inside a frame we do not own.
     terms                 renders without a shell, so there is no scroller
                           for the dock to sit in.

   `signup` and `nil` need no entry: the first returns below, and the second
   draws its own scroller with no `.view-col` at all.
   ========================================================================== */
const NO_ASK = ['coursework','chapter','terms'];

/* WHERE BACK IS, FROM EVERYWHERE. `askView` prints "Back to ${where}", so a
   view missing from this map sends you back to "TalentNext" — which was
   survivable while the field only existed on eight landings and is not now
   that it is on every screen. The names are the ones the Tal panel already
   prints for the same views (the `where` map in `talPanel`, views.js): the
   two surfaces name the same page the same way, or they are two assistants.
   The leader's half is merged in by lead.js from `LEAD_TAL.where`. */
const ASK_WHERE = {dashboard:'Dashboard', level:'My Level', coursework:'Coursework',
  transcript:'Course Progress', rewards:'Points', cohort:'Cohort 41',
  interviews:'Interviews', enrol:'Enrolling', billing:'Payments',
  report:'Your report', agents:'Choosing an agent', agent:'Agent profile',
  booking:'Interview booked', payment:'Payment', welcome:'Enrolled', account:'Profile',
  messages:'Messages', chapter:'A chapter', ivt:'An interview transcript',
  rp:'Practising with Tal', mem:'A cohort member'};

S.askOpen = false;
S.askFrom = null;
/* true only between the moment you press the line and the first build of the
   conversation, so the entrance animation runs once per opening */
let ASK_FRESH = false;

/* --- the collapsed line ---------------------------------------------- */
/* WHAT THE LINE OFFERS, AND WHY IT IS FOUR THINGS AND NOT ONE.
   It used to be a mark and a grey prompt. Read as the bottom edge of every
   page it is the product's one standing invitation, and a grey sentence is a
   weak one — it reads as a disabled field rather than as somewhere to type.
   So it carries what a prompt field carries:

     the mark      Tal, at 32px and moving. It is the only animated thing
                   left on the page now that the floating button is gone
                   (§27.9), and it is what makes the row read as alive
                   rather than as a text input.
     the prompt    "Ask Tal anything", in FULL INK. This is the line's own
                   voice and it is the thing you are being offered.
     a question    one real suggestion, in the helper tone, rotating every
                   three seconds. Grey because it is an example of what you
                   could type, not a label — the same distinction Tesla's
                   field draws by quoting it.
     send          disabled, and drawn as such. There is nothing to send yet.
                   §21's original note argued a send control on an empty
                   field "is a button that lies"; a control that is visibly
                   OFF tells the truth and still says what the field does,
                   which the empty row did not.

   The question is a `<span>` inside the button rather than a control of its
   own: pressing it opens the same conversation pressing anywhere else on the
   line opens, and a button inside a button is a click whose destination
   depends on where in the row you land. It is `aria-hidden` for the same
   reason — the row already has one accessible name, and reading a rotating
   example out as part of it would make that name change under the user. */
/* THE LIGHT THAT RUNS THE FIELD'S BORDER — §70.1 has the whole argument for
   why this is a stroked rectangle and not a moving element or a masked conic.
   What lives here is the half that has to be markup: an SVG cannot be a
   pseudo-element, and a dash needs a path to be a dash ON.

   `pathLength` AND THE GRADIENT ARE THE ONLY THINGS THE MARKUP DECIDES. The
   rect carries no x/y/width/height — §70 sets those as CSS geometry properties
   so the line can inset itself by half its own stroke without this function
   knowing how wide the dock is. `pathLength="1000"` renumbers the perimeter so
   the dash is a percentage rather than a pixel count.

   ONE `id` IN THE DOCUMENT, AND THAT IS SAFE HERE because there is exactly one
   dock: `placeAsk` returns early if the view column already has one. A second
   copy of this component on a page would need the id suffixed.

   THE LINE'S RAMP IS ITS OWN AND NO LONGER `--ai-grad`'S, which is worth
   knowing before "tidying" the two back together. Both started as 581:6584's
   #F47113 -> #E2A600 -> #F0530C; Maryam re-cut the LINE to
   #F4B413 -> #E2A600 -> #F0BF0C on 30 Aug 2026 and left every other AI surface
   alone. So the label, the "ask for a different agent" link, the send chip and
   the step pill are still the orange ramp in §70.0, and this one is gold. The
   two are meant to differ: those four are ink and a fill, read against white
   at rest, and this is a moving light read against the field's orange border.
   Stated as literals here rather than as tokens because they are five exported
   numbers belonging to one object, and a token implies a second user. */
const AI_RUN = `<span class="ai-run" aria-hidden="true">
    <svg preserveAspectRatio="none">
      <defs>
        <linearGradient id="aiRunGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="0.1952" stop-color="#f4b413"/>
          <stop offset="0.3989" stop-color="#e2a600"/>
          <stop offset="0.7921" stop-color="#f0bf0c"/>
          <stop offset="1" stop-color="#ffffff"/>
        </linearGradient>
      </defs>
      <rect pathLength="1000"/>
    </svg>
  </span>`;

function askBar(){
  const q = askQ();
  return `<button class="askline" data-askopen="1" aria-label="Ask Tal anything">
    ${AI_RUN}
    <span class="askline-mark"><span class="tal-mk"></span></span>
    <span class="askline-t">Ask Tal anything</span>
    <span class="askline-q" aria-hidden="true">${q ? '&ldquo;' + q + '&rdquo;' : ''}</span>
    ${''/* ARROW-RIGHT, NOT ARROW-UP — Figma 578:5966 (581:6589), and it agrees
          with the note above about the control being drawn OFF. Up is the chat
          convention for "send this message"; the collapsed line does not send
          anything, it OPENS the conversation, and the file draws that as the
          same forward arrow every other "go on to the next screen" control in
          the build carries. §70 gives the chip the accent gradient at the
          file's own 20%, which is what says the control is not live yet. */}
    <span class="askline-send" aria-hidden="true">${I.arrowRight}</span>
  </button>`;
}

/* THE SUGGESTIONS ARE THE ONES TAL ALREADY HAS. `TALCTX` is the per-view set
   the ask page prints as chips and the answer fallback offers when Tal does
   not follow a question — so the line suggests exactly what the surface it
   opens would suggest, rather than keeping a second list that can drift. The
   leader's half lives in `LEAD_TAL.ctx`, same shape, and is reached the same
   way `askView` reaches it. */
function askCtx(v){
  const view = v || S.view;
  const lead = isLead() && typeof LEAD_TAL !== 'undefined' ? LEAD_TAL : null;
  return (lead ? (lead.ctx[view] || lead.ctx.leadDash)
               : (TALCTX[view] || TALCTX.dashboard)) || [];
}

/* --- one question at a time ---------------------------------------------
   A single interval for the life of the app, started the first time a dock
   is built. It does NOT call `render()`: a re-render every three seconds
   would rebuild the frame, throw away any caret, and replay whatever
   entrance was mid-flight — for a two-word change inside one span. It edits
   that span and nothing else.

   It also does not hold a reference to the span. The base render replaces the
   whole frame, so the node identity changes constantly; the tick looks the
   node up, and on a page with no dock it finds nothing and does nothing.

   The index is keyed to the VIEW. Landing on a page shows its first
   suggestion, which is the one its own author put first, and the count only
   advances while you stay there — so the rotation is a second offer rather
   than a carousel you have to catch. */
const ASK_ROT_MS = 3000;
let ASK_ROT_KEY = null, ASK_ROT_I = 0, ASK_ROT_ON = false;

const askQKey = () => (S.portal || 'candidate') + '/' + S.view;

/* THE ONE `askBar` PRINTS, WHICH IS NOT ALWAYS THE FIRST. Every interaction
   re-renders, and the base render rebuilds this line — so reading index 0 at
   build time would snap the suggestion back to the first one every time you
   clicked anything, mid-rotation. The index lives outside the DOM and this is
   where the two are reconciled: same view, keep counting; new view, start
   again at the suggestion its author put first. */
function askQ(){
  const list = askCtx();
  if(askQKey() !== ASK_ROT_KEY){ ASK_ROT_KEY = askQKey(); ASK_ROT_I = 0; }
  return list.length ? list[ASK_ROT_I % list.length] : '';
}

function askRotate(){
  const q = device.querySelector('.askdock .askline-q');
  if(!q) return;
  const list = askCtx();
  /* arriving on a new view is not a tick — the build already showed its
     first suggestion, and advancing here would skip it */
  if(askQKey() !== ASK_ROT_KEY){ ASK_ROT_KEY = askQKey(); ASK_ROT_I = 0; return; }
  if(list.length < 2) return;
  ASK_ROT_I = (ASK_ROT_I + 1) % list.length;
  /* out, swap, in — the text changes while nothing can be read of it, which
     is what stops the swap reading as a glitch */
  q.classList.add('going');
  setTimeout(() => {
    const still = device.querySelector('.askdock .askline-q');
    if(!still) return;
    still.innerHTML = '&ldquo;' + list[ASK_ROT_I % list.length] + '&rdquo;';
    still.classList.remove('going');
  }, 200);
}

/* --- the open thread --------------------------------------------------- */
/* THE SPEAKER IS NAMED ABOVE WHAT THEY SAID — the same structure the panel
   uses (292:737), because this is the same conversation on a second surface
   and a thread that changes shape when it changes surface is two threads.
   Kept identical to `bubble()` in the panel, deliberately: the two are one
   component and the moment they drift they stop being one. */
function askBubble(who, html){
  return who === 'me'
    ? `<div class="tal-msg me"><span class="tal-who"><span class="tal-who-n">You</span><span class="av"><img src="${isLead()?AV.priya:AV.hana}" alt=""><i>${isLead()?'PN':'MN'}</i></span></span><div class="bb">${html}</div></div>`
    : `<div class="tal-msg"><span class="tal-who"><span class="tal-mk sm"></span><span class="tal-who-n">Tal</span></span><div class="bb">${html}</div></div>`;
}

function askView(f){
  /* THE SAME PORTAL SPLIT THE PANEL MAKES, and for the reason this file gives
     for keeping `askBubble` identical to `bubble()`: the two are one
     conversation on two surfaces, so the moment one of them knows who is
     signed in and the other does not, they stop being one. `LEAD_TAL` is
     declared in lead.js, which is parsed after this file — it is a `var` there
     precisely so this guard can be asked before it has run. */
  const lead = isLead() && typeof LEAD_TAL !== 'undefined' ? LEAD_TAL : null;
  const where = (lead ? lead.where[S.askFrom] : ASK_WHERE[S.askFrom]) || 'TalentNext';
  const ctx = (lead ? (lead.ctx[S.askFrom] || lead.ctx.leadDash) : (TALCTX[S.askFrom] || TALCTX.dashboard));
  const state = lead ? lead.state()
    : f.complete ? lvlName(f.level)+', cohort complete'
    : f.enrolled ? lvlName(f.level)+', day '+f.day+' of 90'
    : f.pred ? f.track+' track, level not set yet'
    : lvlName(f.level)+' confirmed, not enrolled';

  /* THE EMPTY STATE IS THE PANEL'S EMPTY STATE
     Tal used to speak first here, in a bubble: "you are on dashboard, I can
     see your course and your notes". Two problems with it. A bubble is a
     TURN in a conversation, and nothing had been said yet — so the thread
     opened already one message deep, and the first thing you did was read
     rather than type. And the side panel answers the same moment with a
     different drawing: the mark at its largest, a greeting, one line about
     what Tal is for. Two designs for "Tal is open and you have not asked
     anything" is one too many, and the panel's is the one Maryam drew.

     So this surface takes it verbatim — the same `.tal-hero` markup the
     panel builds, so there is one composition to keep, not two. Only the
     empty state changes: the moment you ask something the hero goes and the
     thread is the thread, exactly as the panel behaves. */
  /* THE GREETING IS A QUESTION NOW, and it is written in two halves because
     the file colours them differently: Figma 433:276 sets "Hey, Derek! " in
     the sentence's own black and "What's going on?" in a black-to-orange
     gradient, which §51.4 paints by clipping that gradient to the glyphs of
     `.askv-q`. Two spans, one sentence.

     "What's going on?" MOVED UP OUT OF THE PARAGRAPH. It used to end the line
     below — "…anything you need help with. What's going on?" — and the file
     makes it the second half of the heading, which leaves the paragraph as
     the one flat statement of what Tal is for. Asking the question twice on
     one screen is what the move avoids, so the paragraph loses it here.

     The leader's own greeting keeps its shape: their question is "what do you
     need?" and it is a different question from the candidate's, so the split
     is applied to their sentence rather than the candidate's borrowed. */
  /* THE 120px MARK IS THE CLIP ITSELF, NOT THE SHARED ARTWORK.
     `--tal-mark` is a 96-square animated WebP and that is 3x oversampled for
     every OTHER mark in the platform — the largest is 32px. Here it would be
     upscaled 1.5x on a 2x screen, and a soft blob upscaled reads as a mistake
     rather than as a texture. build.py's note over `TAL_BLOB` has the whole
     argument, including why the fix cannot just be a bigger WebP; the short
     version is that this is the one Tal mark a VIEW prints, so it is the one
     that can be an element and therefore the one that can be a video.

     `muted` is what makes `autoplay` legal, and the file carries no audio
     track anyway. `playsinline` stops iOS taking it fullscreen. AND AUTOPLAY
     IS THE ONE THING REDUCED MOTION WITHHOLDS: a paused `<video>` shows its
     `poster`, which is frame 0 at the same 320 with the same circular alpha,
     so that reader gets the mark standing still rather than an empty box —
     the same call §50.5 makes about the chevrons, for the same reason.

     `aria-hidden` because the greeting under it is what says Tal is here; a
     decorative loop with no accessible name is one more thing to skip past. */
  const opened = S.thread.length > 0;
  const blob = `<video class="tal-blobv" src="${TAL_BLOB}"`
    + ` poster="${TAL_BLOB_POSTER}"${reduce() ? '' : ' autoplay'}`
    + ` loop muted playsinline preload="auto" aria-hidden="true"></video>`;
  const hero = `<div class="tal-hero">
      <span class="tal-mk lg orb tnlogo">${blob}${TN_CHEVRONS}</span>
      <h2>Hey, ${isLead()?'Priya':'Maryam'}!<br><span class="askv-q">${isLead()?'What do you need?':'What&rsquo;s going on?'}</span></h2>
      <p>${isLead()?'I can read your cohorts, your evaluations and where people are stuck.':'I am here to assist you with anything you need help with.'}</p>
    </div>`;
  const thread = (opened ? '' : hero)
    + S.thread.map(m => askBubble(m.who, m.html)).join('')
    + (S.typing ? askBubble('tal', `<div class="ai-stream"><i></i><i></i><i></i></div>`) : '');

  /* THE BAND IS `← ◍ Tal`, from Figma 439:512, and the back control keeps its
     destination in `aria-label` rather than on screen. The words "Back to
     Dashboard" were the band's whole left side; the file replaces them with
     Tal's own name and mark, which is what the band is for — you can see
     which page you came from the moment you leave. A screen reader cannot, so
     the sentence stays where it was already being said.

     `.ask-top-s` stays on the right. The file puts a second arrow-right there
     with nowhere to go; §51.2 has the argument.

     THE BACK ARROW IS MUI's `arrow_back`, NOT THE FILE'S MIRRORED LINE ARROW.
     §51.2 built it by taking the file's `arrow-right` and flipping it with
     `scaleX(-1)` — one drawing, two directions, which was the cheap answer
     while the band was the only place it appeared. It is a 1.5px open stroke,
     and icons.js's header is explicit that this set is Material's FILLED cut:
     `IP.arrowLeft` is already `arrow_back` from
     @material-design-icons/svg/filled and is what the other forty back
     controls in the build use. Maryam asked for MUI's, which is the same
     answer, and it also retires the mirror. */
  return `<div class="page ask-page">
    <div class="ask-top">
      <button class="ph-back" data-askback="1" aria-label="Back to ${where}">${I.arrowLeft}</button>
      <span class="ask-top-id">
        <span class="tal-mk"></span>
        <span class="ask-top-t">Tal</span>
      </span>
      <span class="ask-top-s">${state}</span>
    </div>
    <div class="ask-thread" id="askThread">${thread}</div>
    <div class="ask-foot">
      ${opened ? '' : `<div class="ask-sugg">${ctx.map(s =>
        `<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>${s}</button>`).join('')}</div>`}
      <div class="askfield">
        <span class="askv-clip">${I.attachFile}</span>
        <input class="inp" id="askIn" placeholder="What can I help you with?" autocomplete="off">
        <button class="askfield-send" data-asksend="1" aria-label="Send">${ARROW_LINE}</button>
      </div>
    </div>
  </div>`;
}

/* --- the pass ---------------------------------------------------------- */
/* The capture bar is gone: it WAS this field, with a different question and
   a send control on it. One line at the head of a page can only be one
   thing, and "ask me" is the more useful of the two — the moment you wanted
   to log is a thing you can now just say. */
placeCapture = function(){};

function placeAsk(){
  if(S.stage === 'signup') return;
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;

  if(S.askOpen){
    /* BUILD ONCE, THEN PATCH. Rebuilding the view on every render would
       replay the entrance animation on every message, throw away the
       caret, and reset the scroll — three ways of telling you the page
       just reloaded when it did not. After the first build only the new
       bubbles are appended, and only they animate. */
    let pg = main.querySelector('.ask-page');
    if(!pg){
      main.innerHTML = askView(cfg(S.stage));
      pg = main.querySelector('.ask-page');
      /* THE COUNTER IS THE THREAD, NOT ZERO.
         `askView` prints every message in `S.thread` as part of the build.
         Setting the counter to 0 afterwards told `askSync` that none of them
         had been printed yet, so it printed them all a second time — and
         because the base render replaces the view column on EVERY render,
         that rebuild happens on every message, not just on reopen. One click
         on a suggestion therefore produced two of everything, which reads
         exactly like the click having sent more than you asked it to. */
      const th0 = pg && pg.querySelector('#askThread');
      if(th0) th0.dataset.n = String(S.thread.length);
      /* and the page only makes its entrance once: replaying it under each
         new message would say "this screen just opened" every time you spoke */
      if(pg && ASK_FRESH){ pg.classList.add('ask-in'); ASK_FRESH = false; }
    }
    if(pg) askSync(pg);
    return;
  }

  device.querySelectorAll('.cap-sec').forEach(n => n.remove());
  if(NO_ASK.includes(S.view)) return;
  const col = main.parentElement;
  /* the page already ends in a field — see the note above NO_ASK */
  if(col && col.querySelector('.composer')) return;
  const page = main.querySelector('.page');
  if(!page) return;

  /* THE DOCK FLOATS IN THE VIEW COLUMN, NOT IN THE PAGE.
     Three things follow from that, and each of them is the reason:

       it does not scroll   the page is what scrolls (`.view-col > .main`), so
                            a child of the page would ride the content up and
                            off the top. A field that leaves is not a field
                            that is always there.
       it centres on the CONTENT, not on the app. The rail is a flex item at
                            desktop and its width changes when you open it, so
                            anything centred against `.app` slides sideways by
                            half a rail every time the rail moves. The view
                            column is the content's own box at every width.
       it is not in the flow  it hovers over the page rather than ending it.
                            One intermediate version DID sit in the flow, as
                            the last child of `.main`, to inherit the page's
                            exact width — it read as a docked band welded to
                            the bottom of the page instead of a control
                            floating above it. Floating is the ask.

     Nothing needs clearing first — the base render replaces the whole frame
     on every render, so this pass rebuilds the dock each time.

     A wrapper rather than the bare line: the line is `width:100%` of whatever
     holds it (§21.1) and is the SAME control the ask page's own field grows
     out of. The floating and the width belong to the dock, so the control
     stays one control. */
  if(!col || col.querySelector(':scope > .askdock')) return;
  const dock = document.createElement('div');
  dock.className = 'askdock';
  dock.innerHTML = askBar();
  col.appendChild(dock);

  /* one interval for the life of the app, started the first time there is
     something for it to edit — see the note above `askRotate` */
  if(!ASK_ROT_ON){ ASK_ROT_ON = true; setInterval(askRotate, ASK_ROT_MS); }
}

const _baseAsk = render;
render = function(){ _baseAsk(); try { placeAsk(); } catch(e){ console.warn('ask', e); } };

/* append only what is new, and let only that animate */
function askSync(pg){
  const th = pg.querySelector('#askThread');
  if(!th) return;
  th.querySelectorAll('.ai-stream').forEach(n => {
    const b = n.closest('.tal-msg'); if(b) b.remove();
  });
  const have = +(th.dataset.n || 0);
  for(let i = have; i < S.thread.length; i++){
    th.insertAdjacentHTML('beforeend', askBubble(S.thread[i].who, S.thread[i].html));
    th.lastElementChild.classList.add('msg-in');
  }
  th.dataset.n = String(S.thread.length);
  if(S.typing){
    th.insertAdjacentHTML('beforeend',
      askBubble('tal', `<div class="ai-stream"><i></i><i></i><i></i></div>`));
    th.lastElementChild.classList.add('msg-in');
  }
  if(S.thread.length){
    const sg = pg.querySelector('.ask-sugg');
    if(sg && !sg.classList.contains('going')){
      sg.classList.add('going');
      setTimeout(() => sg.remove(), 200);
    }
  }
  try { th.scrollTo({top: th.scrollHeight, behavior: 'smooth'}); }
  catch(e){ th.scrollTop = th.scrollHeight; }
  /* you asked one thing; you are almost certainly about to ask another */
  const inp = pg.querySelector('#askIn');
  if(inp && document.activeElement !== inp && S.askOpen) inp.focus({preventScroll:true});
}

/* --- opening and closing, with the time it takes ------------------------
   Nothing here is instant. The page you were reading leaves before the
   conversation arrives, and on the way back the conversation leaves before
   the page returns — so the two are never on screen fighting each other,
   and the order of the movement tells you which direction you went.
   `prefers-reduced-motion` collapses both to zero in the stylesheet; the
   timings below stay, and simply have nothing to wait for. */
const ASK_OUT = 170, ASK_BACK = 190;
const reduce = () => window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* `q` IS OPTIONAL, AND IT IS THE WHOLE DOOR IN FROM THE REST OF THE PRODUCT.
   Pressed on the dock, this opens an empty thread and puts the caret in the
   field. Called with a question — a chip, a Tal star, a clickable card, a
   rail suggestion, the transcript's own ask field — it opens the same thread
   with that question already asked. Every one of those used to set `S.tal`
   and slide the side panel over the page; the panel is off (§27.9) and they
   come here instead, which is why this takes an argument at all.

   The question is asked INSIDE `go2`, after the render that builds the ask
   page. `ask()` pushes to `S.thread` and renders, and until `S.askOpen` is
   true that render draws the page you are still on — so asking first and
   opening second would put the first turn of the conversation nowhere.

   And it does not focus the field when it was handed a question: the caret
   belongs where your attention is, and your attention is on the answer
   arriving, not on typing the next thing. */
function askOpen(q){
  if(S.askOpen){ if(q) ask(q); return; }
  const go2 = () => {
    S.askFrom = S.view;
    S.askOpen = true;
    ASK_FRESH = true;
    S.nav = false; S.notif = false; S.tal = false;
    render();
    if(q) return ask(q);
    const el = device.querySelector('#askIn');
    if(el) el.focus();
  };
  const pg = device.querySelector('.view-col .page');
  if(!pg || reduce()) return go2();
  /* the page defers to the line: everything except the ask lifts and fades,
     the line itself holds its place and widens into the field it becomes */
  pg.classList.add('page-to-ask');
  setTimeout(go2, ASK_OUT);
}

function askClose(){
  if(!S.askOpen) return;
  const back = () => {
    S.askOpen = false;
    if(S.askFrom) S.view = S.askFrom;
    render();
    const pg = device.querySelector('.view-col .page');
    if(pg && !reduce()) pg.classList.add('page-from-ask');
  };
  const pg = device.querySelector('.ask-page');
  if(!pg || reduce()) return back();
  pg.classList.remove('ask-in');
  pg.classList.add('ask-out');
  setTimeout(back, ASK_BACK);
}

device.addEventListener('click', e => {
  if(e.target.closest('[data-askopen]')){ askOpen(); return; }
  if(e.target.closest('[data-askback]')){ askClose(); return; }
  if(e.target.closest('[data-asksend]')){
    const el = device.querySelector('#askIn');
    const v = el && el.value.trim();
    if(v){ el.value = ''; ask(v); }
    return;
  }
});

device.addEventListener('keydown', e => {
  if(e.target.id === 'askIn' && e.key === 'Enter'){
    const v = e.target.value.trim();
    if(v){ e.target.value = ''; ask(v); }
    e.preventDefault();
    return;
  }
  if(e.key === 'Escape' && S.askOpen){ askClose(); }
});

/* leaving the module closes the conversation with it — the thread belongs to
   the page it was opened from, and carrying it onto another one would make
   "back" point somewhere you never were */
const _goAsk = go;
go = function(v){ if(S.askOpen && v !== S.askFrom){ S.askOpen = false; } _goAsk(v); };

render();

/* ==========================================================================
   THE GLOW ON A DARK CARD
   Figma 281:142. A blurred ellipse in the brand orange, sitting off the top
   right corner of every black card and clipped by it.

   The geometry is recovered from the export rather than eyeballed. Figma
   pads a blurred layer's SVG by 3 sigma and reports that padding as an
   inset: -516.29% of the height and -71.17% of the width. Those are equal
   in pixels only if the ellipse is 702.6 x 96.85 rotated 11.85deg — which
   is exactly the rotation that turns that ellipse into the 707.47 x 238.97
   bounding box the file states. So 3 sigma = 500, sigma = 167, and the
   ellipse's centre lands 163 in from the card's right edge and 19 below its
   top.

   It is a real element rather than a pseudo because ::before and ::after
   are already spoken for on some of these cards — the level hero paints its
   ground with one, and a dark section closes with the other.
   ========================================================================== */
/* `.lead-b` — the cohort-leader wall — belongs in this list and was missing
   from it, which is the whole reason that one card read as flat black while
   every other dark surface in the product carried the warm haze. It is the
   same component in the same role: a full-bleed dark band offering something
   you could do next.

   `.lvl-hero` — the level card — is OUT, and it is the one dark surface in
   the product that should be. Every other card on this list is a black
   ground with type on it, and the haze is the only thing giving that ground
   a direction. The level card is not: it carries the fifteen-level ladder,
   whose first levels are painted in the same brand orange the glow is made
   of. Two orange gradients on one black card, one of them meaning "level 4 of
   15" and the other meaning nothing, and they meet in the top right corner
   where the ladder's unearned levels are — so the haze read as though the
   levels under it were lit, which is exactly the thing the ladder exists to
   say they are not. The card keeps its ground and loses the light.

   This is a removal from the LIST, not a deletion of the mechanism: `.cert`
   and `.plate` sit next to a level card on the same pages and still carry
   the haze, which is what keeps the level card's flat black readable as a
   deliberate difference rather than as a card that failed to load. */
/* `.ldr-read` IS NOT ON THE LIST, and it fails the test above for a second
   reason the level card did not have. The haze reaches in from the top right
   and dies out two thirds of the way across — over a plate that is a title and
   a sentence, that is light on an empty ground. The competency read is a TABLE
   in that corner: the haze crossed the "what I heard" column, so four rows of
   prose were each set on a slightly different brown, and the confidence chip
   sat in the brightest part of it. A gradient behind data is a gradient you
   read as data. Flat black, and the card keeps §21's clip either way — see the
   note there about what escapes without it. */
const GLOW_ON = '.plate, .cert, .sec.on-dark, .score.on-dark, .lead-b';

function placeGlow(){
  device.querySelectorAll(GLOW_ON).forEach(card => {
    if(card.querySelector(':scope > .dark-glow')) return;
    const i = document.createElement('i');
    i.className = 'dark-glow';
    i.setAttribute('aria-hidden', 'true');
    card.prepend(i);
  });
}

const _baseGlow = render;
render = function(){ _baseGlow(); try { placeGlow(); } catch(e){ console.warn('glow', e); } };
render();
