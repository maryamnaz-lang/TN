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
/* THE SPEECH API, TESTED ONCE AND ABOVE `askView` — §69's direction rule, which
   is the one thing that would have broken this: `askView` reads `SPEECH_OK` to
   decide whether to draw the mic at all, so a `const` declared further down the
   file would be in the temporal dead zone for any render that happened before
   this line ran. `COHORT_LEAD` is the worked example of that hazard and
   `notifList` the guard against it. */
const SPEECH = window.SpeechRecognition || window.webkitSpeechRecognition;
const SPEECH_OK = !!SPEECH;
/* the live recogniser lives with the recorder now — see `_vrec` over
   `askRecStart`, which replaced the dictation this const used to hold. */

const AI_RUN = `<span class="ai-run" aria-hidden="true">
    <svg preserveAspectRatio="none">
      <defs>
        ${''/* THE COMET'S FIVE STOPS — Maryam, 9 Sep 2026, off Figma 875:6598,
              given as the exact CSS to follow:
              `linear-gradient(90.13deg, rgba(255,255,255,0.7) 0%,
              rgba(213,81,215,0.7) 22.6%, rgba(255,110,36,0.7) 49.04%,
              rgba(255,55,51,0.7) 75%, rgba(255,255,255,0.7) 100%)`.

              WHITE INTO MAGENTA, ORANGE, RED AND BACK TO WHITE. The offsets are
              unchanged from the 4 Sep set (0 / .226 / .4904 / .75 / 1); the
              THREE middle colours are new — #d551d7 (magenta), #ff6e24 (orange)
              and #ff3733 (red), where the ramp had been red / pale-green / red.
              So the light is no longer symmetric: it warms across rather than
              mirroring, which is the node's own gradient.

              90.13deg IS HORIZONTAL, so the SVG gradient is `x2=1 y2=0` now,
              not the corner-to-corner `y2=1` §70.3a's note argued for. On a wide,
              short field the ramp lives on the top and bottom edges and the white
              ends fall on the short sides — which is where the file draws them —
              so the comet fades through the corners rather than at mid-edge.

              THE .7 IS `stop-opacity`, NOT A COLOUR. SVG has no `rgba()` in
              `stop-color`, and baking the alpha into the hex would need it
              composited against whatever is behind — the dock's own border, not
              white. Stated as the attribute the stop is genuinely 70% and the
              border shows through it, which is what the spec's `rgba` means on a
              `filter:blur(1px)` line lying over a coloured edge. The white ends
              at 70% are what make the dash fade in and out of its travel; §70.1's
              note has the long version, including why the loop has no seam. */}
        ${''/* THE MAGENTA STOP IS DROPPED (Maryam, 9 Sep 2026): the comet is now
              white → orange → red → white, four stops, off the updated node —
              `linear-gradient(90.13deg, rgba(255,255,255,.7) 0%,
              rgba(255,110,36,.7) 49.04%, rgba(255,55,51,.7) 75%,
              rgba(255,255,255,.7) 100%)`. The offsets that remain are unchanged
              (0 / .4904 / .75 / 1); only #d551d7 at .226 came out, so the light
              warms straight from white into orange with no purple lead-in. */}
        <linearGradient id="aiRunGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".7"/>
          <stop offset="0.4904" stop-color="#ff6e24" stop-opacity=".7"/>
          <stop offset="0.75" stop-color="#ff3733" stop-opacity=".7"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity=".7"/>
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
    ${''/* "Ask Tal", not "Ask Tal anything" — Figma 875:6598, 9 Sep 2026. The
          example question beside it carries the "…anything" sense; the label is
          the shorter of the two now. The aria-label keeps the full phrase. */}
    <span class="askline-t">Ask Tal</span>
    <span class="askline-q" aria-hidden="true">${q ? '&ldquo;' + q + '&rdquo;' : ''}</span>
    ${''/* ARROW-RIGHT, NOT ARROW-UP — Figma 578:5966 (581:6589), and it agrees
          with the note above about the control being drawn OFF. Up is the chat
          convention for "send this message"; the collapsed line does not send
          anything, it OPENS the conversation, and the file draws that as the
          same forward arrow every other "go on to the next screen" control in
          the build carries. §70 gives the chip the accent gradient at the
          file's own 20%, which is what says the control is not live yet. */}
    ${''/* THE DOCK CARRIES THE SAME PAIR AS THE CHAT'S FIELD (Maryam, 2 Sep
           2026: "the tal bar should also have the round arrow icon with the mic
           like we have on the tal chat page"), and the mic here is a `<span>`
           for the reason this whole row is one `<button>`: §21's note — "a
           button inside a button is a click whose destination depends on where
           in the row you land".

           IT IS NOT A DEAD CONTROL EITHER, which is the other half. §60's rule
           would refuse a decorative mic, so pressing it does the one thing it
           can honestly mean on a collapsed line: it opens the conversation AND
           starts recording, in that order (Maryam, 6 Sep 2026: recording is not
           offered on the floating bar itself — pressing the bar's mic opens the
           chat and begins the take there, with no second press). `data-askmicopen`
           is read before `data-askopen` in the click handler, so the mark is a
           shortcut into the same surface rather than a second destination.

           AND IT IS DRAWN ONLY WHERE DICTATION EXISTS — `SPEECH_OK`, the same
           constructor test the chat's field uses. A browser with no Web Speech
           API gets the row exactly as it was. */}
    ${SPEECH_OK ? `<span class="askline-mic" data-askmicopen="1"
      title="Ask Tal by voice">${I.microphone}</span>` : ''}
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
  /* THE STATUS LINE IS GONE FROM THE HEADER — Maryam, 4 Sep 2026: "remove the
     right side text on the tal top header … do not show this in any portal."
     It read `Explorer track, level not set yet` / `Explorer – E3, day 34 of
     90` / the leader's `LEAD_TAL.state()`, and every one of those is the
     band's fact row said again on a screen whose header is Tal's name. The
     four-way branch that composed it is deleted with the `.ask-top-s` span
     and §21's rule for it; `LEAD_TAL.state` keeps its other readers. */

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
      <h2>Hey, ${isLead()?'Priya':'Maryam'}! <span class="askv-q">${isLead()?'What do you need?':'What&rsquo;s going on?'}</span></h2>
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

     `.ask-top-s` used to stay on the right (§51.2 argued it against the
     file's second arrow); it is gone since 4 Sep 2026 — see `state`'s note.

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
    </div>
    <div class="ask-thread" id="askThread">${thread}</div>
    <div class="ask-foot">
      ${opened ? '' : `<div class="ask-sugg">${ctx.map(s =>
        `<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>${s}</button>`).join('')}</div>`}
      <div class="askfield">
        <span class="askv-clip">${I.attachFile}</span>
        <input class="inp" id="askIn" placeholder="What can I help you with?" autocomplete="off">
        ${''/* THE MIC IS DRAWN ONLY WHERE IT CAN WORK — §60's rule, applied to a
               browser capability rather than to missing data: "a dead control on
               a live surface is worse than a missing one", which is why the
               month chevrons stayed off §76 until `AGENT_CAL` gave them
               somewhere to go. `SPEECH_OK` is the constructor test, so in a
               browser with no Web Speech API the field is exactly what it was.

               IT IS A VOICE MESSAGE, NOT DICTATION (Maryam, 6 Sep 2026). It
               used to write the Web Speech transcript straight into this input;
               pressing it now turns the whole field into the §121 recorder —
               `askRecStart` adds `.rec` and the `.askrec` row. It still sits
               beside the send because it is the field's own control, and it is
               still drawn only where the recogniser exists (`SPEECH_OK`), so a
               browser with no Web Speech keeps the field it always had. */}
        ${SPEECH_OK ? `<button class="askfield-mic" data-askmic="1"
          aria-label="Record a voice message"
          title="Record a voice message">${I.microphone}</button>` : ''}
        ${''/* THE SEND IS OFF UNTIL THERE IS SOMETHING TO SEND (Maryam, 2 Sep
               2026: "keep the send arrow circle little disable until nothing has
               been written or no voice has been recorded yet"). It is the real
               `disabled` attribute rather than a class, so the control cannot be
               pressed as well as not looking pressable — §21's original note for
               the collapsed line makes the argument for the look ("a control
               that is visibly OFF tells the truth"), and this adds the half that
               makes it true.

               `disabled` AT RENDER IS ALWAYS CORRECT, which is why there is no
               state to keep: `placeAsk` rebuilds the field on every render, so
               the `<input>` is new and empty every time it is drawn. What turns
               it on is `askSendArm`, from the field's own `input` event and from
               dictation's `onresult` — neither of which re-renders, for the
               caret reason ai4's own trap records. */}
        ${''/* THE SEND IS THE ARROW, LIKE THE FLOATING FIELD (Maryam, 9 Sep 2026:
               "the voice and send icon should also be like the ones we have on
               the floating field"). The dock's `.askline-send` is `I.arrowRight`;
               this was `I.send` (a paper plane). The mic is already `I.microphone`
               on both, so only the send changes. */}
        <button class="askfield-send" data-asksend="1" aria-label="Send" disabled>${I.arrowRight}</button>
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
  /* TWO STAGES HAVE NO DOCK, AND `onboard` IS THE SECOND (3 Sep 2026).

     `signup` returns for the obvious reason: there is nobody signed in yet.
     The onboarding gate returns for a better one — it is Tal asking the
     CANDIDATE five questions, and a docked "Ask Tal anything" on the same
     screen is two conversations with one assistant running side by side. It
     is also a way out of a gate that is meant not to have one: the answers
     are what the dashboard's recommendation is built from, so the way on is
     the last screen's button and nothing else.

     AND IT WAS DRAWING BADLY AS WELL AS WRONGLY. The dock is
     `position:absolute` against `.view-col`, and this stage has no
     `.view-col` — so `device.querySelector('.main')` found the auth column's
     `<main>` and the field was placed against the nearest positioned
     ancestor it could find, landing 989px from the left of a 1280 frame at
     704px wide: 413px off the right edge, on every step. A `.main` inside a
     composition this pass was not written for is the general shape of it, so
     the guard is a stage test rather than a selector fix.

     `nil` NEEDS NO ENTRY — its own render branch replaces the whole frame and
     never emits a `.main` for this to find.

     THE ONBOARDING BRIEFLY HAD AN EXCEPTION TO THIS AND IT IS GONE AGAIN
     (3 Sep 2026). For one build the gate's "Chat" pill opened `askView` here,
     so the PAGE half of this pass was allowed to run on the stage and
     `obScreen` emitted an empty `.main` for it to fill. Maryam's answer to
     seeing it was that this composition is wrong for a first message — a
     messaging screen where the reference is a centred column with the orb at
     the top of it — so §107 §0e draws the gate's chat itself and shares only
     `S.thread`. With nothing here to build, the guard is a plain stage test
     again: the gate gets neither the page nor the line. */
  if(S.stage === 'signup' || S.stage === 'onboard') return;
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

/* THE REVIEW CAPSULE FLOATS BESIDE THE DOCK (Maryam, 14 Sep 2026: "the capsule
   should be fix above the tal floating field"). `reviewCard` (views.js) renders
   `.rev-float` at the foot of `.main`, but a pin has to share the DOCK's
   containing block or it centres over the whole frame (rail included) instead of
   the content column. The dock lives in `.view-col` (placeAsk above), so this
   lifts `.rev-float` up to `.view-col` too; §130 then pins it there, above the
   dock. Runs after placeAsk so the dock exists; idempotent (the base render
   rebuilds `.main` each paint, so the float is back inside it and re-lifted). */
function placeReviewFloat(){
  const col = device.querySelector('.view-col'); if(!col) return;
  const rf = col.querySelector('.main .rev-float'); if(!rf) return;
  col.appendChild(rf);
  /* pages with no Tal dock (e.g. the cohort page) have nothing to clear, so the
     capsule drops lower (Maryam, 14 Sep 2026: "since we do not have tal chat here
     ... the capsule will come little down"). placeAsk has already added the dock
     by now if this page has one. */
  rf.classList.toggle('rev-float-nodock', !col.querySelector(':scope > .askdock'));
}
const _baseRevFloat = render;
render = function(){ _baseRevFloat(); try { placeReviewFloat(); } catch(e){ console.warn('revfloat', e); } };

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
/* `then` RUNS ONCE THE ASK PAGE EXISTS, and it is what the dock's mic needs.
   `askOpen` may render immediately (reduced motion, or already on the ask page)
   or after the 170ms page-out, so a caller that wants to touch the built field
   — the floating bar starting a recording the moment the chat opens — cannot
   just call the next line itself. It hands the work here, and `go2` runs it
   after `render()` has built the field, in both timing branches. */
function askOpen(q, then){
  if(S.askOpen){ if(q) ask(q); if(then) then(); return; }
  const go2 = () => {
    S.askFrom = S.view;
    S.askOpen = true;
    ASK_FRESH = true;
    S.nav = false; S.notif = false; S.acct = false; S.tal = false;
    render();
    if(q){ ask(q); if(then) then(); return; }
    const el = device.querySelector('#askIn');
    if(el) el.focus();
    if(then) then();
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
  /* BEFORE `data-askopen`, AND IT HAS TO BE: the dock's mic is a `<span>` INSIDE
     the row's own button, so both attributes match the same press and the
     handler that runs is whichever is tested first. Recording is NOT offered on
     the floating bar (Maryam, 6 Sep 2026); pressing its mic opens the chat and
     starts the take there, once the ask page exists. `then` is the whole of
     that timing — `askOpen` may render now or after the 170ms page-out, and
     `askRecStart` needs the built field either way. */
  if(e.target.closest('[data-askmicopen]')){ askOpen(undefined, askRecStart); return; }
  if(e.target.closest('[data-askopen]')){ askOpen(); return; }
  if(e.target.closest('[data-askback]')){ askClose(); return; }
  /* THE VOICE MESSAGE, AND IT IS REAL (Maryam, 6 Sep 2026: the field should
     become the recorder in the reference, stop should hand the words back to
     edit, and send should post the take straight away). Pressing the field's
     mic opens the §121 recorder in place; the three controls it draws are the
     three exits.

     NOTHING ABOUT IT IS IN `S` AND THAT IS DELIBERATE — §65's split. But note
     the recorder is only ever open while the reader is holding it, and nothing
     re-renders in that window (no `ask()` runs until they send), so the
     `.askrec` row survives on the same `.askfield` node the whole take. The
     recogniser is closed over in `_vrec`, exactly as the dictation it replaces
     was, and every exit stops it.

     THE TRANSCRIPT IS THE HONEST HALF. The waveform is synthetic (§121 says so
     by moving rather than claiming an amplitude it cannot read from `file://`),
     but the words are the real recogniser's — captured when the browser has one
     and simply empty when it does not, the same failure mode dictation had: on
     `file://` the API reports `not-allowed`, the take yields no words, and stop
     lands an empty field rather than a made-up sentence. */
  if(e.target.closest('[data-askmic]')){ askRecStart(); return; }
  if(e.target.closest('[data-askreccancel]')){ askRecCancel(); return; }
  if(e.target.closest('[data-askrecstop]')){ askRecToField(); return; }
  if(e.target.closest('[data-askrecsend]')){ askRecSend(); return; }
  if(e.target.closest('[data-asksend]')){
    const el = device.querySelector('#askIn');
    const v = el && el.value.trim();
    if(v){ el.value = ''; askSendArm(); ask(v); }
    return;
  }
});

/* THE SEND FOLLOWS THE FIELD, IN PLACE. One function so the three things that
   can put words in that field — typing, dictation, and a render that clears it
   — all reach the same test. `disabled` is toggled on the element rather than
   re-rendered, per ai4's caret trap. */
function askSendArm(){
  const el = device.querySelector('#askIn');
  const b = device.querySelector('.askfield-send');
  if(el && b) b.disabled = !el.value.trim();
}
device.addEventListener('input', e => { if(e.target.id === 'askIn') askSendArm(); });

/* ==========================================================================
   THE VOICE MESSAGE RECORDER (§121) — built to Maryam's ChatGPT recording,
   6 Sep 2026.

   The field's mic opens this in place: `.askfield` takes `.rec`, one `.askrec`
   row is appended. Two real things run behind it, and both are the point:

     the waveform is the LIVE MICROPHONE. `getUserMedia` + a Web Audio
       `AnalyserNode` give an amplitude every ~55ms; the bars are that reading,
       newest flush right, the quiet past trailing left as dots — the reference,
       not the flat tally marks the first cut drew.
     the transcript is the REAL recogniser. Web Speech runs continuous, and
       `_vtxt` is the whole take. Stop transcribes it into the field to edit;
       send transcribes and posts it. Between the press and the words there is a
       `.rectx` "Transcribing…" beat, the reference's own.

   WHY IT CAN FAIL, AND WHY THAT IS A STATE AND NOT A NO-OP. Both halves need
   the mic, and the mic needs a secure, permitted origin. Served over http/https
   (localhost or the deployed portal) they work; opened from `file://` the
   browser blocks them. The first cut answered that by doing nothing — you
   pressed stop and the field stayed empty — which read as broken. So a take
   that reaches the mic but comes back with no words, or a mic that never opens,
   lands in `.recerr` with a note that says what happened and how to fix it, and
   only the cancel disc stays. The control always says something true.

   NOTHING IS IN `S`: the recorder lives entirely between one press and the next
   and no `ask()` runs inside that window, so the `.askrec` row survives on the
   same node the whole take. The stream, analyser, tick and recogniser are all
   closed over here and every exit tears them down.
   ========================================================================== */
let _vrec = null;        /* the live recogniser, or null */
let _vtxt = '';          /* the transcript so far */
let _vstream = null;     /* the getUserMedia stream feeding the waveform */
let _vac = null;         /* the AudioContext, closed on teardown */
let _vanal = null;       /* the AnalyserNode read each tick */
let _vtick = null;       /* the waveform setTimeout handle */
let _vbars = [];         /* the bar elements, left → right */
let _vsamples = [];      /* amplitudes, oldest → newest, capped at _vbars.length */
let _vactive = false;    /* true while a take is open (for the recogniser restart) */
let _vpending = null;    /* 'field' | 'send' — what to do when the take finalises */
let _vfatal = false;     /* the recogniser hit a permission/network wall — do not restart it */
let _vsyn = null;        /* the smoothed value the synthetic meter walks when there is no mic */

/* the ask page's field, or null off it */
const askField = () => device.querySelector('.ask-page .askfield');

/* one of Tal's own suggested questions, to stand in when a take comes back with
   no words (Maryam, 6 Sep 2026) — the same chips the ask page offers above the
   field, so the demo always lands a real, in-context, sendable message rather
   than a dead end. `askCtx` is this file's own per-view suggestion set. */
function askRecFallback(){
  const list = askCtx(S.askFrom || S.view) || [];
  return list.length ? list[Math.floor(Math.random() * list.length)] : '';
}

/* stop the microphone, the meter and the recogniser — everything but the DOM */
function askRecTeardown(){
  _vactive = false;
  if(_vtick){ clearTimeout(_vtick); _vtick = null; }
  if(_vrec){ try{ _vrec.stop(); }catch(err){} _vrec = null; }
  if(_vstream){ try{ _vstream.getTracks().forEach(t => t.stop()); }catch(err){} _vstream = null; }
  if(_vac){ try{ _vac.close(); }catch(err){} _vac = null; }
  _vanal = null; _vsamples = []; _vbars = [];
}

/* take the recorder skin off the field and drop the row */
function askRecClear(){
  askRecTeardown();
  _vtxt = ''; _vpending = null;
  const fld = askField();
  if(!fld) return;
  fld.classList.remove('rec', 'rectx', 'recerr');
  const row = fld.querySelector('.askrec');
  if(row) row.remove();
}

/* the meter loop — one amplitude per tick, pushed on the right; `setTimeout`
   not rAF, because a backgrounded tab freezes rAF (trap 17) and a recorder that
   stops painting reads as a hang. It reads the REAL amplitude when the mic gave
   us an analyser, and walks a smoothed random value when it did not (the mic was
   denied) so the row still reads as alive — the take's honesty is the transcript
   underneath, not the bars. */
function askRecTick(){
  if(!_vbars.length){ return; }
  let amp;
  if(_vanal){
    const buf = new Uint8Array(_vanal.fftSize);
    _vanal.getByteTimeDomainData(buf);
    let sum = 0;
    for(let i = 0; i < buf.length; i++){ const v = (buf[i] - 128) / 128; sum += v * v; }
    amp = Math.min(1, Math.sqrt(sum / buf.length) * 3.4);
  }else{
    _vsyn = (_vsyn == null ? 0.4 : _vsyn) * 0.7 + (0.15 + Math.random() * 0.7) * 0.3;
    amp = _vsyn;
  }
  _vsamples.push(amp);
  if(_vsamples.length > _vbars.length) _vsamples.shift();
  const off = _vbars.length - _vsamples.length;
  for(let i = 0; i < _vbars.length; i++){
    const s = i >= off ? _vsamples[i - off] : 0;
    _vbars[i].style.height = (3 + s * 33).toFixed(1) + 'px';   /* 3px dot → 36px peak in a 40px row */
  }
  _vtick = setTimeout(askRecTick, 55);
}

/* swap the waveform for a note, in one of the two off-states */
function askRecNote(state, msg){
  const fld = askField();
  if(!fld) return;
  fld.classList.remove('rectx', 'recerr');
  fld.classList.add(state);
  const n = fld.querySelector('.askrec-note');
  if(n) n.textContent = msg;
}

async function askRecStart(){
  const fld = askField();
  if(!fld || fld.classList.contains('rec')) return;
  askRecClear();
  _vtxt = ''; _vpending = null; _vactive = true; _vfatal = false; _vsyn = null;
  const row = document.createElement('div');
  row.className = 'askrec';
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', 'Recording a voice message');
  row.innerHTML =
    `<button class="askrec-x" data-askreccancel="1" aria-label="Cancel recording">${I.close}</button>`
    + `<div class="askrec-body">`
    +   `<div class="askrec-wave" aria-hidden="true"></div>`
    +   `<span class="askrec-note t-caption"></span>`
    + `</div>`
    + `<button class="askrec-stop" data-askrecstop="1" aria-label="Stop and edit"><span class="askrec-sq"></span></button>`
    + `<button class="askrec-send" data-askrecsend="1" aria-label="Send voice message">${I.arrowUp}</button>`;
  fld.classList.add('rec');
  fld.appendChild(row);

  /* THE MICROPHONE. `getUserMedia` resolves on a secure, permitted origin and
     rejects on `file://` or a denied prompt. Its stream drives the REAL meter;
     a rejection is not a dead end — the recorder still opens and the meter runs
     synthetically, because the take's honest half is the transcript, not the
     bars, and the fallback question covers the case where that comes back empty. */
  try{
    _vstream = await navigator.mediaDevices.getUserMedia({audio:true});
  }catch(err){
    _vstream = null;
  }
  /* the reader may have cancelled during the permission prompt */
  const fld2 = askField();
  if(!fld2 || !fld2.classList.contains('rec')){ askRecTeardown(); return; }

  /* build exactly the bars that fill the measured wave, then run the meter —
     real amplitude if the mic opened, a smoothed random walk if it did not */
  const wave = fld2.querySelector('.askrec-wave');
  const w = wave ? wave.offsetWidth : 0;
  const n = Math.max(8, Math.floor((w || 240) / 6));   /* 3px bar + 3px gap = 6px pitch */
  wave.innerHTML = Array.from({length:n}, () => '<i></i>').join('');
  _vbars = [...wave.querySelectorAll('i')];
  _vsamples = [];
  if(_vstream){
    try{
      _vac = new (window.AudioContext || window.webkitAudioContext)();
      const src = _vac.createMediaStreamSource(_vstream);
      _vanal = _vac.createAnalyser();
      _vanal.fftSize = 512;
      src.connect(_vanal);
    }catch(err){ _vanal = null; }
  }
  askRecTick();

  /* THE TRANSCRIPT. Runs alongside the meter; `onresult` rebuilds the whole
     take each event so `_vtxt` is always current. It restarts itself if the
     service ends the session early while the take is still open. */
  /* the constructor is read HERE, not closed over from load — so a browser that
     gains the API after boot is picked up, and the recorder has one honest
     source of truth for "can I transcribe". `SPEECH_OK` still gates whether the
     mic is drawn at all. */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(SR){
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = true;
    r.continuous = true;
    r.onresult = ev => {
      let full = '';
      for(let i = 0; i < ev.results.length; i++) full += ev.results[i][0].transcript;
      _vtxt = full.trim();
    };
    /* a permission/network wall is fatal — restarting it just spins error→end
       forever (which is exactly what `file://` and a blocked pane do). Mark it
       so `onend` stops, and let the note on finalise carry the failure. */
    r.onerror = ev => {
      if(/not-allowed|service-not-allowed|audio-capture|network/.test(ev.error || '')) _vfatal = true;
    };
    r.onend = () => {
      if(_vpending){ const m = _vpending; _vpending = null; _vrec = null; askRecDeliver(m); return; }
      if(_vactive && !_vfatal){ try{ r.start(); }catch(err){ _vrec = null; } }
      else _vrec = null;
    };
    try{ r.start(); _vrec = r; }catch(err){ _vrec = null; }
  }
}

/* land the take, once the recogniser has given up its last words */
function askRecDeliver(mode){
  /* the reader's own words where the mic and speech service were reachable; one
     of Tal's suggested questions standing in where they were not, so the take
     always becomes a real message rather than an empty field */
  const txt = (_vtxt || '').trim() || askRecFallback();
  if(!txt){ askRecClear(); return; }   /* nothing, and no suggestion to stand in — just close */
  if(mode === 'send'){ askRecClear(); ask(txt); return; }
  /* 'field' — drop the message in to edit, arm the send, leave the caret there */
  askRecClear();
  const el = device.querySelector('#askIn');
  if(el){ el.value = txt; askSendArm(); el.focus(); }
}

/* stop the meter and show the transcribing beat, then wait for the recogniser's
   `onend` (or deliver now if it has already stopped) */
function askRecFinish(mode){
  const fld = askField();
  if(!fld || !fld.classList.contains('rec')) return;
  if(fld.classList.contains('recerr') || fld.classList.contains('rectx')) return;
  _vactive = false;
  if(_vtick){ clearTimeout(_vtick); _vtick = null; }
  if(_vstream){ try{ _vstream.getTracks().forEach(t => t.stop()); }catch(err){} _vstream = null; }
  askRecNote('rectx', 'Transcribing…');
  if(_vrec){
    _vpending = mode;
    try{ _vrec.stop(); }
    catch(err){ _vpending = null; _vrec = null; setTimeout(() => askRecDeliver(mode), 450); }
  }else{
    /* no live recogniser to wait on (the browser has none, or it already hit a
       wall) — hold the transcribing beat briefly so the fallback does not snap
       in, then land the message */
    setTimeout(() => askRecDeliver(mode), 450);
  }
}

/* THE X — throw the take away and return to the empty field */
function askRecCancel(){ askRecClear(); }
/* THE STOP SQUARE — transcribe into the input to edit and send when ready */
function askRecToField(){ askRecFinish('field'); }
/* THE SEND ARROW — transcribe and post the take straight to Tal */
function askRecSend(){ askRecFinish('send'); }

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
/* A WRAPPER MUST PASS ON EVERY ARGUMENT IT WAS GIVEN, and this one dropped
   `fresh` for as long as it has existed. `go(target, fresh)` empties `S.hist`
   when the destination came from the rail or the wordmark — a module is a
   top-level destination and starts a new stack, which is the rule the note
   over that branch states — and calling `_goAsk(v)` threw the second argument
   away, so the stack only ever grew. Nothing showed it: `bk()` hides the back
   arrow on a rail root anyway (`railRoots().includes(S.view)`), so the one
   surface that reads `S.hist.length` was masking it on exactly the pages the
   bug applied to.

   §78's breadcrumb is drawn from `S.hist`, so it showed it immediately —
   opening Interviews from the rail after booking an agent read "Dashboard /
   Book Priya Nair / Interviews", three crumbs for a destination reached in one
   press. The trail is the first thing in the product to render the whole
   stack rather than just ask whether it is empty. */
const _goAsk = go;
go = function(v, fresh){ if(S.askOpen && v !== S.askFrom){ S.askOpen = false; } _goAsk(v, fresh); };

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
/* `.ldr-read` WAS NOT ON THE LIST and the card itself is now gone too (1 Sep
   2026 — a cohort leader does not interview, so there is no level decision).
   The reasoning is kept because it is the one worked example in the build of a
   haze failing over CONTENT rather than over a ground, and the next dark table
   will want it. It failed the test above for a second reason the level card did
   not have: the haze reaches in from the top right
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
