/* ==========================================================================
   THE RED ACCENT TRIAL — WHICH PAGES ARE IN IT
   TEMPORARY. Delete this file with §67; see that layer's head for the whole
   argument and for how to remove the trial completely.

   One array and one class. `TMP_ACCENT_ON` is the list of pages, as
   [stage, view] pairs, and it is the ONLY place the list lives — §67 states
   no page in its selector, so widening or narrowing the trial is an edit
   here and nothing else.

   Wrapping `render` rather than editing it keeps this file the only place
   the trial touches the runtime, which is the same reasoning `lead.js`
   records for `data-portal` and `ai5.js` for `stampView`.

   Two things this deliberately does NOT do:

   - It does not stamp a stage on `.app` the way `stampView` stamps a view.
     A `data-stage` attribute would be a new, permanent hook on the shell for
     a temporary trial, and §67 would then need `.app[data-stage=...]` in its
     selector — which carries the class `app`, and `build-ds.py` would ship
     it into the design system. A single `tmp-`prefixed class is dropped by
     name, so the trial cannot leak.

   - It does not fire on the live call surface. `callOpen` leaves `S.view`
     alone, so joining a call from either dashboard would otherwise paint the
     call bar red — and a call is its own surface with its own colour rules
     (§60: black for off, --brand-tint-2 for on). `!S.call` keeps the trial
     on the page it was asked for.
   ========================================================================== */

/* IT IS ONE WHOLE STAGE NOW, NOT THREE SINGLE PAGES (Maryam, 31 Aug 2026).
   The trial began as three dashboards read side by side against their orange
   selves, and was switched off after that comparison. What replaced it is the
   `reddemo` stage — "Red Accent Demo" in the picker, a frozen copy of Day 34
   whose whole purpose is to be red — so the list names the STAGE and lets the
   view be anything: a demo you can only walk one page of is a screenshot.

   `'*'` IS THE VIEW WILDCARD, and the list still holds [stage, view] pairs so
   a single page can be named again without changing the shape. The nine real
   stages are untouched by construction: they are simply not in this array, and
   §67 states no page in its own selector.

   TO DELETE IT FOR GOOD: see the removal note at the head of §67, and the one
   on the `reddemo` row in data.js's `STAGES` for the stage itself. */
const TMP_ACCENT_ON = [
  [RED_DEMO, '*'],   // "Red Accent Demo" — every page of it
];

const _baseTmpAccent = render;
render = function(){
  _baseTmpAccent();
  try {
    const app = device.querySelector('.app');
    if(!app) return;
    const on = !S.call && TMP_ACCENT_ON.some(([st, vw]) =>
      S.stage === st && (vw === '*' || S.view === vw));
    /* toggle, not add: `render` rebuilds `.app` from scratch on every pass,
       but this wrapper also runs on renders where the class must come OFF —
       navigating day34 -> messages is the same element being rewritten. */
    app.classList.toggle('tmp-accent', on);

    /* THE §131 UI TRIAL'S ONE GLYPH SWAP. The "week N tasks" figure in the
       "90 days" summary is `I.checkFilled` (a FILLED check_circle) in the shared
       prog band (views.js), and §131's ask is a LINED mark like the book and
       clock beside it. A pasted SVG path is not a CSS property, so it cannot go
       in the layer; it lives HERE, gated to this stage, so day34 keeps the filled
       glyph and the whole UI trial stays removable with §131 + this file.

       It runs after `_baseTmpAccent()` above, which has already chained every
       ai pass and built the modhead, so the mark is in the DOM; `ob.js`'s later
       wrapper only toggles audio, so nothing rebuilds it after this. The path
       signature `Zm56 328` is unique to `checkFilled`'s filled disc, so the swap
       is idempotent and never touches an already-swapped mark.

       `I.check` (a bare stroked checkmark), NOT `I.checkOutline`: the latter is an
       empty ring — the "not-done" STATE glyph (trap 7) — which would read as an
       unchecked box, not a tick. `check` is the lined tick the ask means. */
    if(on){
      app.querySelectorAll('.prog-figs .prog-ic').forEach(ic => {
        if(/Zm56 328/.test(ic.innerHTML)) ic.innerHTML = I.check;
      });
    }
  } catch(e){ console.warn('tmp accent', e); }
};

/* THE LAST STATEMENT, per trap 8. The boot render is the final line of
   views.js and runs before this file is parsed, so the page on screen at that
   moment was drawn without the class — and every page in the trial is
   reachable as a boot hash (`#reddemo/dashboard`). One call, at the foot,
   same as every pass before it. */
render();
