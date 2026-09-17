/* ============================================================================
   orb-wire.js — the orb's states, driven by what the product already does

   §132 ships eight states and orb.js can reach all of them; neither knows
   anything about this product, so on its own the orb sits in `idle` forever.
   This file is the only place that decides which state is true, and it decides
   it from state the app was already keeping — nothing here adds a flag to the
   product that the product did not already have.

     thinking   S.typing — set by `talSay` the moment a reply is queued and
                cleared when the queue drains. It is already what draws the
                three-dot stream in the bubble, so the orb and the dots now
                say the same thing at the same time.
     speaking   `obBars(on)`, which ob.js already calls from the greeting
                audio's own `playing` / `pause` / `ended` events. This is the
                one state §132 cannot do in CSS — orb.js regenerates the
                chevron paths per frame — so it is also the one that needs the
                mount below to have happened.
     listening  a voice take being open: `askRecStart` opens the recorder and
                `askRecClear` / `askRecFinish` close it. NOT the microphone
                permission — §ai4.907 opens the recorder either way and runs
                the meter synthetically when `getUserMedia` is refused, so
                keying on the stream would leave the orb idle on `file://`
                and in the headless sweep, which is where it is looked at most.

   WHICH ORBS. Not all of them — that was this file's first mistake and it is
   the one worth reading before changing anything here. An orb is either the
   subject of the exchange or an identity mark, and only the first kind takes
   a state: `orbSync` drives `.borb[data-borb-live]` and PINS every other
   `.borb` to idle. The live ones are the chat hero and the byline on the
   reply that is streaming; the chat header, the floating dock, the panel
   header, the composer, the summary band and every settled byline are marks
   that say "Tal" and nothing more. Driving those too meant asking a question
   set six orbs thinking across the frame at once, which read as the page
   glitching rather than as Tal working. `borbMark(cls, live)` is where a call
   site opts in.

   PRIORITY, HIGHEST FIRST: listening, speaking, thinking. They overlap in
   ordinary use — Tal's reply is queued (`thinking`) while the greeting is
   still playing (`speaking`) — and an orb can only be in one state, so the
   order is stated once here rather than argued at each call site. Listening
   outranks speaking because it is the reader's own voice; speaking outranks
   thinking because a sound playing is the louder claim.

   `loading` and `error` ARE DELIBERATELY NOT WIRED. §132 draws both and they
   are reachable by hand, but this prototype has no surface that fails or
   waits on a network — every answer is local and instant. A state wired to a
   condition that never happens is a state nobody can review.

   WHY WRAPPING. `render` rebuilds the frame's innerHTML, so every orb on
   screen is a NEW element with no `data-borb-bound` on it and no state
   stamped. Rather than teach nine call sites to re-state themselves, the four
   functions that already mark these transitions are wrapped — the idiom
   ai7.js uses on `talReply` and nil.js on `talReset`, for the same reason.

   LAST IN THE BUNDLE, after orb.js: it reads `window.BorbOrb`, and it wraps
   `render`, `obBars`, `askRecStart`, `askRecClear` and `askRecFinish`, all of
   which have to exist to be wrapped.
   ========================================================================== */

(function () {
  'use strict';

  var orbSpeaking = false;
  var orbListening = false;

  function orbWanted() {
    if (orbListening) { return 'listening'; }
    if (orbSpeaking) { return 'speaking'; }
    /* `S` is a top-level `const`, so it is a lexical global rather than a
       property of `window` — the typeof guard is what keeps this file safe to
       drop into a page that does not have the app on it. */
    if (typeof S !== 'undefined' && S && S.typing) { return 'thinking'; }
    return 'idle';
  }

  /* ONLY THE LIVE ORBS TAKE THE STATE, and the rest are pinned to idle in the
     same pass rather than merely skipped. Skipping would leave an orb wearing
     whatever it was last given — by `hold()`, or by an earlier build of this
     file — with nothing to put it back; pinning makes "chrome is idle" an
     invariant this function restores on every render instead of a convention
     the call sites have to keep. `data-borb-live` is stamped by borbMark's
     second argument; see the note there for which orbs earn it. */
  function orbSync() {
    var want = orbWanted();
    var all = document.querySelectorAll('.borb');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var state = el.hasAttribute('data-borb-live') ? want : 'idle';
      if (el.getAttribute('data-state') !== state) {
        el.setAttribute('data-state', state);
      }
    }
  }

  /* Mount is idempotent — orb.js guards on `data-borb-bound` — so this is
     cheap to call after every render, and it is the only thing that makes the
     speaking state reachable on an orb that did not exist at DOMContentLoaded. */
  function orbRefresh() {
    if (window.BorbOrb) { window.BorbOrb.mountAll(); }
    orbSync();
  }

  /* The wrapped function's own return value is passed through untouched, and
     the addition runs in a try — an orb that fails to restate itself must not
     be able to take a render, an audio event or a voice take down with it. */
  function orbWrap(name, after) {
    var prev = window[name];
    if (typeof prev !== 'function') { return false; }
    window[name] = function () {
      var out = prev.apply(this, arguments);
      try { after.apply(this, arguments); } catch (e) { /* never fatal */ }
      return out;
    };
    return true;
  }

  orbWrap('render', orbRefresh);
  orbWrap('obBars', function (on) { orbSpeaking = !!on; orbSync(); });
  orbWrap('askRecStart', function () { orbListening = true; orbSync(); });
  orbWrap('askRecClear', function () { orbListening = false; orbSync(); });
  orbWrap('askRecFinish', function () { orbListening = false; orbSync(); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', orbRefresh);
  } else {
    orbRefresh();
  }

  window.BorbWire = {
    sync: orbSync,
    refresh: orbRefresh,
    /* For a reviewer holding one state still: BorbWire.hold('thinking2').
       It deliberately takes EVERY orb, live or not, so a state can be read at
       each of the sizes §133 lays out at once — and it lasts until the next
       render, when orbSync pins the chrome back to idle. */
    hold: function (state) {
      var all = document.querySelectorAll('.borb');
      for (var i = 0; i < all.length; i++) { all[i].setAttribute('data-state', state); }
    }
  };
}());
