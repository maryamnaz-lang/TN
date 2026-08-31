/* ==========================================================================
   THE PAGE'S NAME IS IN THE TOP BAR — Maryam, 31 Aug 2026

   "since we are showing heading on the top header so remove the heading from
   the first section."

   The header now carries the trail and the trail ends on the page, so the
   `<h1>` under it was the same words twice, 40px apart, at two sizes. This
   pass is what joins the two halves: it finishes the trail `crumbBar()`
   started and takes the heading off the page.

   IT HAS TO BE A PASS, and the reason is one line in `render()`:

       html = shell() + '<div class="shell-body">' + … + view(f) + …

   `shell()` is evaluated first. It cannot read a page that has not been built
   yet, and it cannot be moved after `view()` without the header ending up
   below the body in the DOM. So the header ships an EMPTY `.crumb-trail` and
   this draws the whole of it once both exist — the same shape `placeBand`,
   `placeDark` and `placePageSummary` all take, and the reason CLAUDE.md's trap
   11 warns that a card written into a view will be rewritten by a pass.

   AND IT IS THE LAST PASS IN THE BUNDLE, DELIBERATELY. It reads `.ph h1`, and
   three passes before it move the `.ph` or write into it — `talFirst` hoists
   Tal's card to sit under it, `placeBand` lifts the whole `.ph` into the
   `.modhead`, §62's `dashPh` puts a face and a celebration inside it. None of
   them changes the heading's TEXT, so the order is not load-bearing for
   correctness; it is load-bearing for `tidyPh`, which asks whether anything is
   LEFT in the `.ph` once the heading is out and would get the wrong answer if
   a later pass then put something back.

   WHAT IT DOES NOT DO IS INVENT A TITLE. Every crumb it writes is either a
   name the page already draws — its `<h1>`, or its own `crumb()`'s tail — or
   the label the RAIL is already using for that module. Nothing is composed
   here, including from the control that was pressed: "Book Priya now" on the
   dashboard leads to a page whose heading already reads "Book Priya Nair", so
   the destination names itself and the two cannot drift.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. THE TRAIL IS THE PATH YOU TOOK, NOT THE PLACE YOU ARE

   Maryam, 31 Aug 2026: "the breadcrum should not be fixed but dynamic, like
   since i have clicked on the 'Book Priya Now' button on dashboard so the
   breadcrum should be dashboard and then Book Priya Nair".

   THIS REVERSES WHAT THIS FILE DID FOR TWO BUILDS and the difference is worth
   naming, because both things are called a breadcrumb. The first version read
   a fixed HIERARCHY — the view's hand-written `crumb()`, or `PARENT` — and
   printed where the page SITS: `Interviews / All agents / Priya Nair`, the
   same three crumbs however you arrived. That is a site map with the current
   page marked on it, and its defect is that it is a route the reader did not
   take: pressing "Book Priya now" on the dashboard never went near All agents,
   so every crumb in it but the last is a link BACK to somewhere they have not
   been.

   THE PATH IS ALREADY KEPT AND IT IS `S.hist`. The back stack is what `bk()`
   draws its arrow from and what `back()` pops, so a trail built from it agrees
   with the back button by construction — press the last-but-one crumb and you
   land exactly where the arrow would have taken you. Nothing new is stored and
   nothing has to be kept in step.

   THAT ALSO MAKES THE RAIL'S OWN RULE FREE. `go(target, fresh)` empties
   `S.hist` when the target came from the rail or the wordmark, on the
   reasoning that a module is a top-level destination and starts a fresh stack
   — so opening Interviews from the rail is one crumb, and reaching it from a
   card is two. The trail says which of those happened without being told.

   WHAT IS LOST, AND IT IS THE THING TO WATCH: the hand-written `crumb()`
   hierarchies. Twenty-one views state one, some of them three deep, and none
   of them is read as a trail any more — only as a fallback LABEL, and only for
   a page with no `<h1>`. They are still removed from the page (§78 and the
   note below), because two breadcrumbs on one screen was the duplication this
   whole change exists to remove.
   -------------------------------------------------------------------------- */

/* A VIEW'S NAME, AND THE ORDER OF THE FOUR SOURCES IS THE WHOLE FUNCTION.

   1. A MODULE IS ITS RAIL LABEL, NEVER ITS HEADING. This is first because it
      is the one that would otherwise go visibly wrong: the six dashboards'
      `<h1>` is a greeting, so a heading-first order gives "Welcome back,
      Maryam! / Book Priya Nair". A view with no `PARENT` entry that `crumbMod`
      resolves IS a module, and the rail is already calling it "Dashboard".
   2. THE `<h1>` IS THE PAGE'S OWN NAME. On `V.agent` that is "Book Priya
      Nair" — which is what Maryam asked the crumb to say, and it is already
      written in the view. Nothing here composes a label out of the button that
      was pressed: the destination names itself.
   3. THE HAND-WRITTEN `crumb()`'s TAIL, for a sub-page with no heading.
   4. THE MODULE, for a sub-page whose module resolves but which has neither.

   There is no fifth. A view that reaches the end of this list is one nothing
   in the build can name, and it returns null rather than printing a key. */
function pageLabel(page){
  const h = page.querySelector('.ph h1');
  const title = h ? h.textContent.trim() : '';
  const mod = crumbMod();
  if(!PARENT[S.view] && mod) return mod[0];
  if(title) return title;
  const c = page.querySelector('.crumb span:not(.sep)');
  if(c && c.textContent.trim()) return c.textContent.trim();
  return mod ? mod[0] : null;
}

/* THE LABELS OF THE PAGES BEHIND YOU ARE A STACK BESIDE `S.hist`, AND A MAP
   KEYED BY VIEW IS NOT GOOD ENOUGH. That was the first version and it is worth
   recording why it failed, because it looks correct until you visit one view
   twice: `S.hist` holds view KEYS, and `agent` is whichever agent `S.agent`
   currently points at. Book Priya from the dashboard, then open Owen from All
   agents, and the earlier crumb — a different visit, to a different person —
   silently became "Book Owen Clarke", because both visits wrote the same key.
   `leadMember` and `chapter` have the identical shape.

   SO THE STACK IS KEPT BY DIFFING `S.hist`, NOT BY HOOKING THE PUSHES. There
   are six `S.hist.push` sites across five files and two more places that empty
   it outright (`go`'s `fresh` branch, the portal swap), so a label pushed at
   each call site is seven things to keep in step and one more for the next
   flow that navigates. This pass runs after EVERY render, so it can watch the
   stack's LENGTH instead: grown by one means the page drawn last render is now
   the entry on top, and `prev` is still holding its label; shrunk means a pop
   or a reset, and the labels above the new length go with it. One rule, no
   call site, and it cannot be forgotten by a flow written later.

   THE FALLBACK IS THE RAIL. An entry with no label — the stack grew while this
   pass was not the thing that drew the page, or a hash deep-link arrived with
   a stack already in it — is named by `crumbMod(v)`, its module. That is why
   `crumbMod` takes a view argument at all. An entry that not even that can
   name is dropped rather than printed as a key.

   IT IS NOT PART OF `S`, DELIBERATELY. `S` is the product's state and every
   field in it is something a screen renders FROM; this is a record of screens
   already rendered, it decides nothing, and a stale entry costs one wrong word
   rather than a wrong page. */
const CRUMB_STACK = [];
let CRUMB_PREV = null;

function syncStack(){
  const n = S.hist.length;
  if(n < CRUMB_STACK.length){ CRUMB_STACK.length = n; return; }
  while(CRUMB_STACK.length < n){
    /* The page that was on screen last render is the one that has just been
       pushed, so it is the top of the stack and `CRUMB_PREV` is its name. Only
       the LAST of several — a jump that pushed more than one entry cannot say
       what the ones underneath were called, and they fall to their module. */
    const at = CRUMB_STACK.length;
    CRUMB_STACK.push(at === n - 1 ? CRUMB_PREV : null);
  }
}

function trailParts(page){
  const label = pageLabel(page);
  syncStack();

  const out = S.hist.map((v, i) => {
    const m = crumbMod(v);
    return {label: CRUMB_STACK[i] || (m ? m[0] : null), go: v};
  }).filter(p => p.label);

  /* A DEEP LINK HAS NO PATH, so the module is put in front of it — otherwise
     loading `#new/agent` straight from the hash gives a one-crumb trail
     reading "Book Priya Nair", which says nothing about where that sits. Only
     when the stack is empty: the moment there IS a path, the path is the
     answer and prepending a module would put a crumb in it the reader never
     pressed, which is the whole defect this rewrite removes. */
  if(!out.length && PARENT[S.view]){
    const m = crumbMod();
    if(m) out.push({label: m[0], go: m[1]});
  }

  if(label) out.push({label});
  CRUMB_PREV = label;
  return out;
}

/* THE PAGE LOSES ITS HEADING AND ITS OWN BREADCRUMB, and both are unconditional
   — that is the instruction ("remove the heading from the first section"), and
   the `.crumb` goes with it because the bar is now the only breadcrumb on the
   screen. Read first, removed second: `pageLabel` above is the only reader of
   either, and it runs one line earlier in `trailParts`.

   THE TWO ARE REMOVED EVEN WHEN NEITHER WAS USED as a label. A page whose name
   came from the rail still had an `<h1>` — every dashboard does — and leaving
   it because the trail happened not to need it would put the greeting back on
   three of the six dashboards and not the others. */
function stripPageHead(page){
  const h = page.querySelector('.ph h1');
  if(h) h.remove();
  const c = page.querySelector('.crumb');
  if(c) c.remove();
}

/* THE LAST CRUMB IS NOT A LINK, because it is the page you are on. Everything
   before it is `data-go`, which is the product's one navigation attribute — so
   the trail needs no branch in the router and inherits the "opened from the
   rail starts a fresh stack" rule for free.

   THE SEPARATOR IS A CHEVRON AND IT IS A REAL `<svg>` (Maryam, 31 Aug 2026:
   "use 12px sized chevron in place of backslash"). It was `content:'/'` on a
   `::before`, which is what this note used to argue for: a separator written
   as an element is a text node a screen reader reads aloud between every pair
   of crumbs, and one more child to count when the trail is trimmed on a
   phone. Both are answered rather than avoided — `aria-hidden` on the mark,
   and §78.2 hides the whole `<li>` below 600 rather than any part of it.

   AND IT IS `I.chevRight`, NOT A GLYPH AND NOT A MASK. A `content:'›'` would
   come from the stand-in face, which carries 68 glyphs and not that one — §64
   records the identical problem with an arrow. §64 then reached for a
   `mask-image` because an `<svg>` would have meant editing 88 call sites;
   there is ONE call site here, so the official Material Symbols chevron goes
   in directly and trap 7's "one cut, pasted rather than drawn" holds with
   nothing to keep in step. */
function drawTrail(trail, parts){
  const sep = `<span class="crumb-sep" aria-hidden="true">${I.chevRight}</span>`;
  trail.innerHTML = parts.map((p, i) => {
    const now = i === parts.length - 1;
    return `<li class="crumb-i${now ? ' crumb-now' : ''}">${i ? sep : ''}${now
      ? `<span class="crumb-l" aria-current="page">${p.label}</span>`
      : p.go
        ? `<a class="crumb-l" data-go="${p.go}">${p.label}</a>`
        : `<span class="crumb-l">${p.label}</span>`}</li>`;
  }).join('');
}

/* --------------------------------------------------------------------------
   2. WHAT IS LEFT OF THE `.ph`

   Take the `<h1>` out and most pages' page-header is empty — `phSub` already
   returns nothing for a `&middot;` row (its own note says why), so `ph('Profile')`
   was the heading and nothing else. An empty flex box still pays its margins,
   which on the Profile page is 24px of white between the header band's top and
   Tal's card.

   IT IS HIDDEN, NOT REMOVED, AND THAT IS THE WHOLE OF THE CARE HERE. §56 and
   §70 place the band's members with `:has()` gates and explicit grid rows —
   `.modhead:has(> .head-col) > .ph.ph-you`, `:has(> .ph:not(.ph-you))` — and
   `:has()` is structural, so a `display:none` element still satisfies every
   one of them while costing no space. Removing the element would change which
   of §70's two grid arrangements the band gets, on pages this change has no
   business moving. `.ph-bare` is the class and §78 draws it.

   THE BACK ARROW COUNTS AS CONTENT. `bk()` puts it inside `.ph-top` beside the
   heading, and on a sub-page reached from a card it is the only way back that
   is not the trail itself. So `.ph-top` survives when it still holds one, and
   the `.ph` with it.

   THE DASHBOARDS ARE THE OTHER SURVIVOR and they are why this is a test rather
   than a blanket rule: §62 puts the reader's own face, their rank medal and
   the celebration line in this same `.ph`. Take the greeting out and all three
   are still there, so the header stays and simply starts on the face.
   -------------------------------------------------------------------------- */
function tidyPh(page){
  const ph = page.querySelector('.ph');
  if(!ph) return;
  const top = ph.querySelector('.ph-top');
  if(top && !top.firstElementChild) top.remove();
  const main = ph.querySelector('.ph-main');
  if(main && !main.firstElementChild) main.remove();
  ph.classList.toggle('ph-bare', !ph.firstElementChild);
  /* `.ph-backonly` IS THE OTHER HALF OF TAKING THE HEADING OUT, and it is a
     class rather than a `:has()` because the test is "this and NOTHING else".
     §10 gives the `.ph` 40px of top padding and 32 of bottom, and §02 gives
     `.ph-top` 8 more underneath — spacing measured for a 26px page title with
     a fact row under it. With the title gone the block is a 40px control
     paying a 26px title's separation, which is the ~100px of white Maryam
     measured between the arrow and the content below it.

     A `:has()` cannot say it. `.ph:has(.ph-back)` matches the dashboards too
     (they have no back arrow, but `.ph:not(:has(h1))` is now every page), and
     `:has(.ph-back):not(:has(*))` is not a thing — the arrow IS a descendant.
     The count is the test, and a pass that has just finished removing the
     other children is the one thing that knows the answer. */
  ph.classList.toggle('ph-backonly',
    !!ph.querySelector('.ph-back') &&
    ph.querySelectorAll('.ph-main > *, .ph > *:not(.ph-main)').length === 1 &&
    ph.querySelectorAll('.ph-top > *').length === 1);
}

function placeTopbar(){
  const trail = device.querySelector('.shell .crumb-trail');
  const page  = device.querySelector('.view-col .page');
  /* The call surface, the sign-up front door and the NIL microsite each draw
     their own chrome and reach neither branch — `render()` returns before
     `shell()` for all three. `authShell` has no trail either. Bailing on
     whichever half is missing covers every one of them. */
  if(!trail || !page) return;

  const parts = trailParts(page);
  stripPageHead(page);
  drawTrail(trail, parts);
  tidyPh(page);
}

const _baseTop = render;
render = function(){
  _baseTop();
  try { placeTopbar(); } catch(e){ console.warn('topbar', e); }
};

/* THE LAST STATEMENT, per CLAUDE.md's trap 8: the boot render is the final
   line of views.js and has already run by the time this file is parsed, so a
   pass that installs a wrapper and stops leaves the first paint without it —
   here that is a bar with an empty trail and every page's `<h1>` still on it,
   until the reader touches something. */
render();
