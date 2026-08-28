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

const TMP_ACCENT_ON = [
  ['assessed', 'dashboard'],   // "Levelled, not enrolled"
  ['day34',    'dashboard'],   // "Day 34"
  ['promoted', 'dashboard'],   // "Promoted to E4"
];

const _baseTmpAccent = render;
render = function(){
  _baseTmpAccent();
  try {
    const app = device.querySelector('.app');
    if(!app) return;
    const on = !S.call && TMP_ACCENT_ON.some(([st, vw]) => S.stage === st && S.view === vw);
    /* toggle, not add: `render` rebuilds `.app` from scratch on every pass,
       but this wrapper also runs on renders where the class must come OFF —
       navigating day34 -> messages is the same element being rewritten. */
    app.classList.toggle('tmp-accent', on);
  } catch(e){ console.warn('tmp accent', e); }
};

/* THE LAST STATEMENT, per trap 8. The boot render is the final line of
   views.js and runs before this file is parsed, so the page on screen at that
   moment was drawn without the class — and the two pages in the trial are
   both reachable as a boot hash (`#day34/dashboard`). One call, at the foot,
   same as every pass before it. */
render();
