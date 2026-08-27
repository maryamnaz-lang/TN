/* ==========================================================================
   AI9 — ONLY THE LAST ANSWER KEEPS ITS CHIPS

   `twChips` (views.js) puts follow-up questions at the foot of an answer, and
   they stayed there: ten exchanges deep the thread was five sets of chips, all
   still pressable, four of them about a question that had already been asked
   and answered. A chip is an invitation to say the next thing — once you HAVE
   said the next thing it is a record of a road not taken, and a live control
   is the wrong way to record that.

   SO: the last thing Tal said keeps its chips, everything above it loses them.
   It does not matter how the conversation moved on — pressing a chip and
   typing your own sentence both push a new turn, and both make the answer
   above it no longer the last one.

   THIS IS A PASS AND NOT A CHANGE TO `twChips`, WHICH IS TRAP 9 IN CLAUDE.md.
   `render()` replaces `device.innerHTML`, and `placeAsk` (ai4.js) then rebuilds
   the whole `.ask-page` out of `S.thread` — so a class or a removal applied by
   a click handler is gone by the next paint. What survives is anything that is
   a pure function of state, re-run after every render. "Which answer is last"
   is exactly that, so it is computed from the DOM each time rather than
   remembered, and `S.thread` is left holding the chips it always held.

   AND IT HAS TO BE THE LAST PASS. ai4's `placeAsk` builds the thread, ai7's
   `placeBook` fills the booking hosts, ai8's wrapper stamps `.tw-top` — this
   reads what all three produced, so it can only run after them. The file ends
   in `render()` for the reason CLAUDE.md's trap 8 gives: the boot render is the
   last statement of views.js and has already happened, so each pass re-renders
   at its own foot or its work is missing from the first paint.
   ========================================================================== */

function pruneStaleChips(){
  const th = device.querySelector('.ask-page .ask-thread');
  if(!th) return;

  /* `:not(.me)` is what makes this Tal's turns only. The typing bubble is a
     `.tal-msg` too, and that is correct rather than a special case: while Tal
     is composing, the answer above it is already not the last one, so its
     chips go the moment you press one instead of a beat later. */
  const turns = [...th.querySelectorAll('.tal-msg:not(.me)')];
  const last = turns[turns.length - 1];

  turns.forEach(turn => {
    if(turn === last) return;
    /* THE WRAPPER GOES, NOT THE BUTTONS. `.tw-chips` is a flex row with a gap
       and `.bb > * + *` gives it a 20px top margin, so emptying it leaves 20px
       of air and no reason for it. The second sweep is for a `.chip-tal`
       written straight into an answer without one. */
    turn.querySelectorAll('.tw-chips').forEach(n => n.remove());
    turn.querySelectorAll('.chip-tal').forEach(n => n.remove());
  });
}

const _baseChips = render;
render = function(){
  _baseChips.apply(this, arguments);
  try{ pruneStaleChips(); }
  catch(err){ console.warn('pruneStaleChips', err); }
};

render();
