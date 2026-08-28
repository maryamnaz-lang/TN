/* ==========================================================================
   THE MODULE HEAD IS ONE BAND
   Figma 292:288.

   Every module's landing page opens with the same four things: where you
   are (crumb), what this page is (the header and its description), what Tal
   has to say about it, and the line you can ask Tal something in. Until now
   those were four sections stacked on the canvas with a hairline between
   each — four separate objects that happened to be adjacent.

   Maryam's frame draws them as ONE thing: a single band carrying a warm
   gradient wash, closed by a single rule that runs edge to edge. The wash
   is what says "this part of the page is the assistant"; the rule is what
   says where that part stops. Both only read as one surface if the members
   are one element, so this pass wraps them.

   WHY A PASS AND NOT MARKUP. The ask line does not exist in the view: it is
   injected by `placeAsk` in ai4.js after the view has rendered. So the band
   cannot be assembled by the view layer — the last member has not arrived
   yet. It has to happen after ai4's pass, which is exactly where this one
   sits. It also means one edit covers all nine landing pages rather than
   nine edits covering one each, and a page that gains or loses a Tal card
   needs no further work.

   The required action rides the Tal head row. `.ai-do` is Tal's own button
   and it sat under the sentence; the frame puts it at the right-hand end of
   the row Tal's name is on, because it is the one thing you would do about
   what Tal just said, and a required action belongs at the top of the block
   that required it. It is genuinely optional — most Tal cards offer a
   question instead — so the class that opens a third grid track is added
   only when there is a button to put in it. See the trap in the handover:
   `.agh` grew a phantom third column exactly this way.
   ========================================================================== */

/* a member of the band: the crumb if it leads, the page header, a Tal
   section if the page has one, and the ask line if ai4 placed one */
/* `.ask-chips` is a row of suggested questions with no card around it — what
   Tal's card offers, on a page that has no card. Points is the only page that
   draws one (see the note in `V.rewards`), and without this it fell out of the
   band and read as the first block of the page body. */
function _mhIsTal(el){
  return el.classList.contains('sec')
    && (!!el.querySelector('.ai-aura, .ai-label') || el.classList.contains('ask-chips'));
}

function placeBand(){
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;
  const page = main.querySelector('.page');
  /* the ask thread replaces the page with its own column — it has no header
     and no band, and wrapping its first two children would be wrapping the
     back control */
  if(!page || page.classList.contains('ask-page')) return;
  /* THE FRONT DOOR IS NOT A MODULE. The sign-up screens have a `.ph` like
     every other page, so the band would happily wrap one — and the wash
     that says "Tal is speaking here" on a page where Tal is not is worse
     than no wash at all. Auth carries its own header treatment in §17. */
  if(page.closest('.auth-card')) return;
  if(page.querySelector(':scope > .modhead')) return;

  const ph = page.querySelector(':scope > .ph');
  if(!ph) return;

  const members = [];
  const crumb = page.querySelector(':scope > .crumb');
  if(crumb && crumb.nextElementSibling === ph) members.push(crumb);
  members.push(ph);
  /* everything after the header that still belongs to the head of the page.
     Stop at the first section that is neither Tal nor the ask line — that
     one is the body of the page and the rule goes above it. */
  let n = ph.nextElementSibling;
  while(n && (n.classList.contains('ask-sec') || _mhIsTal(n))){
    members.push(n);
    n = n.nextElementSibling;
  }

  const band = document.createElement('div');
  band.className = 'modhead';
  page.insertBefore(band, members[0]);
  members.forEach(el => band.appendChild(el));

  /* --- the head of the card: what Tal says, and the one thing you do --- */
  const aura = band.querySelector('.ai-aura');
  if(!aura) return;
  const head = aura.querySelector(':scope > .ai-head');
  const foot = aura.querySelector(':scope > .ai-foot');
  if(!head) return;

  /* A BLUE LINK IS NOT AN ACTION. Three of the eight Tal cards offered their
     one next step as underlined text — "See the cohorts", "Read my report" —
     sitting under the sentence where the button sits on every other card.
     Same job, two drawings, and the one that looks like a footnote is on the
     page where the step is the whole point. Every one of them becomes the
     button the frame draws, in the place the frame draws it. */
  let doer = foot && foot.querySelector('.ai-do, .btn-p');
  if(!doer && foot){
    const link = foot.querySelector('a.lk, a.lnk, a[data-go]');
    if(link){
      const b = document.createElement('button');
      b.className = 'btn btn-p btn-sm ai-do';
      if(link.dataset.go) b.setAttribute('data-go', link.dataset.go);
      if(link.dataset.talAsk) b.setAttribute('data-tal-ask', link.dataset.talAsk);
      b.textContent = link.textContent.trim();
      link.replaceWith(b);
      doer = b;
    }
  }
  if(doer){
    head.appendChild(doer);
    aura.classList.add('ai-act-top');
  }

  /* THE QUESTIONS ARE ONE ROW. Tal's own suggestions are printed into
     `.ai-foot` by the view and the contextual ones are appended to
     `.ai-asks` by a later pass, so a card with both drew two rows — and
     because the second spans the card while the first does not, they landed
     as one chip hard left and one hard right with the width of the page
     between them. They are the same offer. One container, in reading order:
     what the card suggested first, then what the page added. */
  const asks = aura.querySelector(':scope > .ai-asks');
  if(foot && asks && foot !== asks){
    const moving = [...foot.children].filter(c => !c.classList.contains('sp'));
    moving.reverse().forEach(c => asks.insertBefore(c, asks.firstChild));
    foot.remove();
  }
  /* AND THE QUIET PAIR GOES LAST, WHEREVER IT ENDED UP. `.sp` carries
     `margin-left:auto` — it is meant to hold the right-hand end of the row.
     The contextual question is appended to the foot AFTER it, so the auto
     margin pushed that chip to the far right and left the first one hard
     left with the width of the page between them. That is the split. It is
     not a layout bug, it is an order bug: the pair is moved to the end so
     the auto margin has nothing behind it to push. */
  const box = aura.querySelector(':scope > .ai-asks, :scope > .ai-foot');
  if(box){
    const sp = box.querySelector(':scope > .sp');
    if(sp) box.appendChild(sp);
    if(!box.querySelector('.btn, .chip-tal')) box.classList.add('ai-foot-bare');
  }
}

const _baseBand = render;
render = function(){
  _baseBand();
  try { placeBand(); } catch(e){ console.warn('band', e); }
};


/* ==========================================================================
   THERE IS NO BACK FROM THE FIRST SCREEN
   `ph()` prints a back control whenever the history stack is not empty, and
   on the prototype it is never empty by the time you reach create account —
   you got there from the log-in screen. But create account is the front
   door: the file draws no arrow on it, and an arrow that undoes signing up
   is an arrow to nowhere. Verify keeps its own, which the file does draw,
   because verify has somewhere to go back TO.
   ========================================================================== */
function trimAuthBack(){
  if(S.view !== 'create') return;
  const b = device.querySelector('.auth-card .form-page .ph-back');
  if(b) b.remove();
}

const _baseAuthBack = render;
render = function(){
  _baseAuthBack();
  try { trimAuthBack(); } catch(e){ console.warn('authback', e); }
};


/* ==========================================================================
   EVERY BLACK LEVEL CARD IS THE SAME CARD
   Figma: the My Level band, plus a foot row.

   Five prototypes draw a confirmed level and each drew it slightly
   differently — the eyebrow above the name on one, the actions inside the
   card on another, the actions in a white section underneath on a third.
   They are one component stating one fact, so this normalises them in the
   DOM rather than in five separate edits to five views:

     row 1   the level, the level, and the ladder — the My Level layout
     row 2   who signed it and when on the left, every action on the right

   The actions come from wherever that view happened to put them: a
   `.lvl-split-a` inside the card, or the section immediately after it if
   that section holds nothing but buttons. A section that holds anything
   else is left alone — it is a section, not a stray button row.
   ========================================================================== */
function placeLevelCards(){
  device.querySelectorAll('.main .lvl-hero').forEach(hero => {
    if(hero.querySelector(':scope > .lvl-foot')) return;   /* already built */
    /* THE PRE-INTERVIEW CARD IS NOT A DIFFERENT CARD ANY MORE. It was skipped
       here because it drew the three tracks as a grid and the foot treatment
       had nothing to attach to. It draws the same ladder as the confirmed
       card now (§29.4), so it takes the same foot: the eyebrow moves under
       the bar and the actions line up beside it. One structure, two states. */

    const foot = document.createElement('div');
    foot.className = 'lvl-foot';

    const eb = hero.querySelector(':scope > .eb, :scope > .eyebrow');
    if(eb) foot.appendChild(eb);

    const acts = document.createElement('div');
    acts.className = 'lvl-foot-a';

    /* the actions this view already put inside the card */
    const inside = hero.querySelector(':scope > .lvl-split-a');
    if(inside){
      [...inside.querySelectorAll('.btn')].forEach(b => acts.appendChild(b));
      inside.remove();
    }

    /* or the section directly under it, if all it holds is buttons */
    const host = hero.closest('.sec');
    const next = host && host.nextElementSibling;
    if(next && next.classList.contains('sec')){
      const btns = [...next.querySelectorAll('.btn')];
      const other = next.querySelector('h2, h3, p, .tile, .sec-h, input, .kv, .ch, .ag');
      if(btns.length && !other){
        btns.forEach(b => acts.appendChild(b));
        next.remove();
      }
    }

    if(!eb && !acts.children.length) return;
    if(acts.children.length) foot.appendChild(acts);
    hero.appendChild(foot);
    hero.classList.add('lvl-foot-card');
  });
}

/* ==========================================================================
   A BLACK CARD BELONGS AGAINST THE HEAD, WHEREVER IT IS

   The dark card is this product's one loud object. Every page has at most one
   and it is always the same kind of thing: the required action (book the
   re-interview, join the call), the fact the page exists to state (your level,
   your certificate), or the one offer it carries. A page can only have one
   loudest thing, so where that thing sits is not a per-page decision — it
   goes directly under the module head, and the two read as one opening block.

   Most pages already drew it there and a handful did not, which is the whole
   reason this is a pass rather than a set of edits:

     week1, day90, promoted dashboards   the achievement banner sat between
                                         the band and the card. A dismissible
                                         notice was pushing the page's
                                         required action below the fold —
                                         and dismissing it changed where the
                                         card sat, which is how the same
                                         dashboard came to look like two
                                         different layouts.
     account                             the leader wall was fourth.
     transcript                          the certificate was last.

   MEMBERSHIP, NOT JUST ORDER. The card goes INSIDE the band, as its last
   member, and takes the band's own content padding — so it is inset to the
   spine the description and the chips sit on, with the wash showing to its
   left, to its right and below it. An earlier cut of this only reordered:
   the card sat immediately AFTER the band, full-bleed to the page's edges,
   butted against the band's closing rule. That reads as two blocks that
   happen to touch. Inside, inset, on the wash, it reads as what it is — the
   last thing the head of the page has to say, which is the one thing to do
   about everything above it.

   A DARK CARD IS FULL-BLEED BY DEFAULT and stops being so in here: §25.12
   takes the negative margins off, so the card pays the gutter its host
   section pays and keeps its own internal padding on top of that. That is
   the two-step inset the frame draws — card edge on the band's spine, card
   text one gutter further in.

   THE ANCHOR IS THE BAND, and where there is no band it is the crumb: on a
   sub-page with no header there is nothing to be a member of, so the card
   follows the crumb instead — the same relationship one level down.

   A BARE CARD GETS A SECTION. Most dark cards are already wrapped in a `.sec`
   that carries the gutter; the level card is a child of the page itself. It
   is wrapped here so every member of the band is inset by the same rule
   rather than by two.

   Idempotent by position: if the host already ends the band there is nothing
   to do, so the pass survives running on a page it has already arranged —
   which it does, on every render.
   ========================================================================== */
/* `.ldr-read` — the competency read on a level decision — is a card class
   INSIDE its section rather than a `.sec` variant, and that is what keeps it
   out of the wrapping branch below: a host that matches this list is wrapped
   in a fresh `.sec` (the branch `.lvl-hero` needs, having no section of its
   own), and a `.sec` wrapped in a `.sec` pays the gutter twice. */
const DARK_CARD = '.plate, .cert, .sec.on-dark, .score.on-dark, .lead-b, .lvl-hero, .ldr-read';

function placeDark(){
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;
  const page = main.querySelector('.page');
  /* the ask thread has no head and no page body — see the same guard in
     `placeBand` above */
  if(!page || page.classList.contains('ask-page')) return;
  if(page.closest('.auth-card')) return;

  const band = page.querySelector(':scope > .modhead');
  const anchor = band || page.querySelector(':scope > .crumb');
  if(!anchor) return;

  /* THE HOST IS THE PAGE-LEVEL BLOCK, NOT THE CARD. Most dark cards are
     wrapped in a `.sec` that carries the section's padding and its rules;
     `.lvl-hero` is the exception and sits on the page itself. Moving the card
     out of its `.sec` would strip it of both, so what moves is whichever
     child of the page contains it. */
  const hosts = [];
  for(const k of page.children){
    if(k === anchor || k === band) continue;
    if(k.matches(DARK_CARD) || k.querySelector(DARK_CARD)) hosts.push(k);
  }
  if(!hosts.length) return;

  if(band){
    hosts.forEach(h => {
      let host = h;
      /* the level card is a child of the page rather than of a section — give
         it one, so the band's gutter reaches it the same way it reaches
         everything else in here */
      if(h.matches(DARK_CARD)){
        const sec = document.createElement('div');
        sec.className = 'sec';
        h.replaceWith(sec);
        sec.appendChild(h);
        host = sec;
      }
      host.classList.add('sec-dark');
      if(band.lastElementChild !== host) band.appendChild(host);
    });
    return;
  }

  /* no band to join — the crumb leads and the card follows it */
  let after = anchor;
  hosts.forEach(h => {
    if(after.nextElementSibling !== h) after.insertAdjacentElement('afterend', h);
    after = h;
  });
}

/* ==========================================================================
   THE PLATE READS TOP DOWN: WHAT IT IS, WHEN, WHO

   Every plate in the build was drawn in the order it was written, and that
   order was wrong in the same way six times: the PERSON came first. A 56px
   photograph and a name at the top of the card, then the eyebrow, then the
   title. So the first thing you read on "Cohort 41, week 13" was "Priya Nair,
   cohort leader" — the least changing fact on the card, at its loudest point,
   above the thing the card is actually about.

   The order now:

     .plate-h     the label and, at the far right, WHEN. One row.
     .plate-t     what this is — the title
     .plate-b     the detail line: time, how many others, how long
     .plate-a     what you would do about it (column two at desktop)
     .plate-who   the person, last

   WHO GOES LAST BECAUSE IT IS CONTEXT, NOT NEWS. The face is worth having —
   it says a real person is running this — but it answers "who" and you only
   ask that after "what" and "when". Same chunk, same composition, moved.

   THE TIMER LEAVES THE EYEBROW. `plate-eb` was carrying two different things
   joined by a middot: a label ("Weekly call", "Booked", "Next up") and a
   distance in time ("in 2 days", "today 4:30 pm"). The first is a category
   and the second is the one value on the card that changes by itself, so they
   are not one line. The distance moves to the card's top-right corner, where
   a live value belongs and where the eye lands after the title; the label
   stays where it was.

   SPLIT AT THE FIRST MIDDOT, and a plate with no middot keeps its whole
   eyebrow as the label. That is deliberate rather than incidental: "Next up"
   and "Due now" are states, not distances, and promoting either into a timer
   slot would put a word where a clock is expected.

   A PASS AND NOT SIX EDITS, for the same reason `placeBand` is one: the six
   plates live in views.js and lead.js, three of them behind stage branches,
   and the composition is one component's business. This also picks up any
   plate a later page adds without that page having to know the order.
   ========================================================================== */
/* THE DETAIL LINE IS A LIST, AND EACH ITEM WEARS ITS OWN MARK.
   `.plate-b` is written as one `&middot;` run — "Thursday at 6:00 PM ET · 9
   others · 60 minutes" — which is three different facts (a date, a headcount, a
   duration) told as one sentence. It held together while the card ran the width
   of the page; in §56's column the run wraps to two and three lines and the
   middots land mid-line, so the one thing on the card you actually need to act
   on is the hardest part of it to read.

   Split at the middots, one row each, a 16px mark in front. Same table shape
   and the same first-match-wins order as `stepIcon` and `factIcon` in views.js,
   and the same argument for deriving it: six plates across two portals and a
   seventh whenever a page adds an appointment.

   ON EVERY PLATE, NOT ONLY THE ONE IN THE COLUMN. Every plate in the product is
   moved into the head band by `placeDark` below, so "the narrow one" is all of
   them at desktop; and below 900, where the card is full width, the column it
   sits in is a phone's. A list is the better drawing at both.

   ONE PART IS LEFT AS PROSE. A `.plate-b` with no middot in it is a sentence
   rather than a row of facts, and a sentence with a mark in front of it is a
   callout. */
/* FIRST MATCH WINS, so the order is the argument — and three of these are only
   in the right place because of a row that got the wrong mark first:

   MONEY LEADS. "$595 due today" was matching the date rule on the word `today`
   and came out as a calendar. A figure with a currency sign in it is money
   whatever else the row says.
   ASSESSMENTS BEFORE CHAPTERS, because "13 assessments, one per chapter" says
   both words and is about the assessments.
   CALLS BEFORE THE COHORT, so "13 live cohort calls" is a camera rather than a
   group of people — and "9 others" still has no call in it, so it keeps its. */
const PLATE_IC = [
  [/\$|\bfee\b|paid|price/i,                        'wallet'],
  [/assessment|average|\bscore/i,                   'chart'],
  [/chapter|module|course|curriculum/i,             'book'],
  [/\d{1,2}:\d{2}|[ap]\.?m\.?|\bET\b|\bPT\b/i,     'time'],
  [/minute|hour|\bmin\b|long/i,                     'hourglass'],
  [/monday|tuesday|wednesday|thursday|friday|saturday|sunday|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|today|tomorrow/i, 'calendar'],
  [/\bcalls?\b|recorded|video/i,                    'video'],
  [/situation|conversation|question|asks|hypothetical/i,'chat'],
  [/others|people|cohort|candidates|members|one to one|1:1/i,'group'],
  [/online|link|remote/i,                           'launch'],
  [/report|signed|level/i,                          'certificate']
];
function plateIcon(t){
  const s = String(t || '').replace(/<[^>]*>/g, ' ');
  for(const [re,k] of PLATE_IC) if(re.test(s)) return I[k];
  return I.circle;
}
function splitPlateBody(plate){
  const b = plate.querySelector(':scope > .plate-b');
  if(!b || b.querySelector(':scope > .plate-bi')) return;
  const parts = b.innerHTML.split(/\s*(?:&middot;|·)\s*/).map(s => s.trim()).filter(Boolean);
  if(parts.length < 2) return;
  b.classList.add('plate-lines');
  b.innerHTML = parts.map(t =>
    `<span class="plate-bi">${plateIcon(t)}<span>${t}</span></span>`).join('');
}

/* ==========================================================================
   THE BLACK WALL IS FOR THE THING THAT CANNOT WAIT

   Maryam's rule, and it is a rule about MEANING rather than about a card:
   black ground plus the warm haze off the top-right corner is the loudest
   object this product draws, and it should be spent on an action that is
   time-sensitive or wants attention now. A call today is that. A call on
   Thursday is not, and drawing the two the same way makes the loud one mean
   nothing — every dashboard in the build opened on a black wall, so the wall
   stopped being a signal and became the shape a plate is.

   TWENTY-FOUR HOURS IS THE LINE. Inside it the card is the black plate
   unchanged; outside it the same card is QUIET — the ground goes, the haze
   goes, the ink flips, and in the head band a vertical rule takes over the job
   the black edge was doing of saying where column one stops (§59). The card
   does not move, lose a fact or lose its buttons: the same content, one
   priority down. As the appointment comes inside the day it goes black on its
   own, because the only thing that decides is the distance in time.

   DERIVED FROM THE WORDS, BECAUSE THE WORDS ARE ALL THERE IS. Every
   appointment in this prototype is a hand-written string — `data-when="in 2
   days"`, "Weekly call &middot; thursday", "Today 4:30 PM" off `LEAD_SESSIONS`
   — and there is no clock behind any of them to subtract from. So the test is
   the vocabulary of "inside the day": now, today, tonight, starting, and any
   count of hours or minutes. Everything else — tomorrow, a weekday, a date, "in
   2 days" — is outside it. A real build swaps this one function for a date
   difference and nothing else in the file changes.

   THE LABEL COUNTS AS WELL AS THE CLOCK, and that is what makes "Due now" work.
   `placePlates` splits the eyebrow at the middot: "Weekly call · in 2 days"
   leaves a label and a time, but "Due now" has no middot and stays a label
   entirely. It is the most urgent thing either portal says and it would have
   read as quiet if only the timer slot were tested.

   AND A CARD WITH NO CLOCK AT ALL IS QUIET. Three plates carry no time because
   there is no appointment in them — the enrolment offer, and the two cards that
   explain what a level interview IS. None of them expires, which is the whole
   test. `data-urgent="1"` / `="0"` on the card overrides the reading for
   anything that needs to say so directly; nothing in the build does yet, which
   is why it is an attribute rather than a list of call sites here.

   ONLY `.plate`. `DARK_CARD` covers six components and the other five are not
   actions: `.cert` is an award, `.lvl-hero` a level, `.score` a table,
   `.ldr-read` a competency read. A quiet certificate would be a certificate
   with the ceremony taken off it, and none of the five has a deadline to be
   inside or outside. They keep their ground.
   ========================================================================== */
const PLATE_SOON = /\b(now|today|tonight|imminent|starting|under an hour|in an hour|in \d+ ?(h|hr|hrs|hour|hours|m|min|mins|minute|minutes)\b)/i;
function plateUrgent(plate, when, label){
  const flag = plate.dataset.urgent;
  if(flag === '1' || flag === 'true')  return true;
  if(flag === '0' || flag === 'false') return false;
  return PLATE_SOON.test(when || '') || PLATE_SOON.test(label || '');
}

function placePlates(){
  device.querySelectorAll('.plate').forEach(plate => {
    if(plate.querySelector(':scope > .plate-h')) return;   /* already arranged */
    splitPlateBody(plate);

    const eb   = plate.querySelector(':scope > .plate-eb');
    const t    = plate.querySelector(':scope > .plate-t');
    const b    = plate.querySelector(':scope > .plate-b');
    const a    = plate.querySelector(':scope > .plate-a');
    const who  = plate.querySelector(':scope > .plate-who');
    /* the closing block under a hairline — what to expect from the thing the
       card has just described. Last, and it has to be named in the reorder
       below or it stays wherever the view happened to print it, which after
       the reorder is ABOVE the title rather than under everything. */
    const x    = plate.querySelector(':scope > .plate-x');
    if(!eb && !t) return;

    const head = document.createElement('div');
    head.className = 'plate-h';

    /* THE DISTANCE IN TIME comes from one of two places. Normally it is the
       tail of a "label · when" eyebrow, split off here. A plate that carries
       no eyebrow at all states it as `data-when` on the card instead, because
       there is no line left for it to be the tail of. */
    let when = plate.dataset.when || '';
    if(eb){
      const cut = eb.textContent.indexOf('·');
      if(cut > -1){
        when = eb.textContent.slice(cut + 1).trim();
        eb.textContent = eb.textContent.slice(0, cut).trim();
      }
      if(eb.textContent) head.appendChild(eb);
    }

    /* THE PRIORITY, READ OFF THE CLOCK AND THE LABEL — the note over
       `plateUrgent` is the argument. It is stamped here rather than in a pass
       of its own because this is the one place in the build where the two
       halves of the eyebrow have already been told apart: before the split the
       string is "Weekly call · in 2 days" and neither half can be tested on its
       own; after it, `when` is the clock and `eb.textContent` is the label. */
    if(!plateUrgent(plate, when, eb ? eb.textContent : ''))
      plate.classList.add('plate-quiet');

    /* A HEAD ROW WITH NO LABEL TAKES THE TITLE INSTEAD.
       The head exists to hold the corner the timer sits in. With the label
       gone there is nothing in its left half, and a row that is empty on one
       side and 28px tall on the other is a row of air above the title —
       exactly the height the card does not need. So the title moves up into
       it: the two are then one line, title left and timer right, on the
       `baseline` the row was already set on. The card loses a whole row and
       reads as one block rather than as a heading floating under a chip.

       `.plate-h-bare` is the flag for the stylesheet (§15 zeroes the title's
       own `margin-top` inside the row); the title is otherwise untouched, so
       everything that styles `.plate-t` still applies. */
    const bare = !head.childElementCount && !!t;
    if(bare) head.classList.add('plate-h-bare');

    /* NO MARK AT THE HEAD OF THIS CARD, AND THAT IS A DECISION THAT WAS TRIED.
       486:1084 opens the call card on a 40px calendar tile, left of the title,
       and it was built that way: the tile said what KIND of object the card is
       before you read which one. Two things were wrong with it here. Every plate
       in this build is an appointment, so the tile said the same word on all
       four of them — and in a 268px card it took 52px off the one row the title
       has, which is what pushed "Cohort Week 36 Session" onto two lines and then
       onto its own line. The countdown chip already says the card is dated, in
       the corner the file puts it in. Removed on Maryam's read of the built
       card; the note stays because the file still draws it. */

    if(when){
      const w = document.createElement('span');
      w.className = 'plate-when';
      /* the glyph is the one the transcript's own "time invested" figure
         uses — a clock means a clock everywhere in the build */
      w.innerHTML = I.time + '<b>' + when + '</b>';
      head.appendChild(w);
    }

    /* AND THE SEATED TITLE GOES IN LAST, AFTER THE COUNTDOWN. It used to be
       appended the moment `bare` was decided, which put it BETWEEN the mark and
       the clock — and §56 wraps that row, giving the title a row of its own (the
       note there is where our column's arithmetic is written down). A title in
       the middle of the source order takes its row in the middle: mark, then
       title, then the clock on a third line under it. Source order is the row
       order, so the two things that share the first line have to be the first
       two children. */
    if(bare) head.appendChild(t);

    /* the glow is absolutely positioned and painted from the card's own box,
       so it stays where `placeGlow` put it — first — and is not reordered */
    const glow = plate.querySelector(':scope > .dark-glow');
    if(glow) plate.insertBefore(head, glow.nextSibling);
    else plate.insertBefore(head, plate.firstChild);

    /* `parentElement !== head` so the reorder does not drag a title that has
       just been seated in the head row back out to the foot of the card */
    [t, b, a, who, x].forEach(el => {
      if(el && el.parentElement !== head) plate.appendChild(el);
    });
  });
}

const _basePlate = render;
render = function(){
  _basePlate();
  try { placePlates(); } catch(e){ console.warn('plate', e); }
};

/* WRAPPED AFTER `placeLevelCards`, AND THAT ORDER IS LOAD-BEARING. The level
   card absorbs the section directly beneath it when that section holds nothing
   but buttons — the promoted dashboard's Enroll and Download certificate are
   its foot row — and it finds that section as `host.nextElementSibling`. Move
   the card first and the buttons are no longer next to it, so they stay behind
   as a loose row under the wrong block. The card is assembled, then it moves.
   `placeDark` is declared above and wrapped below for that reason alone. */
const _baseLvl = render;
render = function(){
  _baseLvl();
  try { placeLevelCards(); } catch(e){ console.warn('lvlcard', e); }
};

const _baseDark = render;
render = function(){
  _baseDark();
  try { placeDark(); } catch(e){ console.warn('dark', e); }
};


/* ==========================================================================
   THE APP SAYS WHICH VIEW IT IS SHOWING
   Several corrections are true of one page and not of the others — the
   settings page's label column, the account page's rules — and there was no
   way to say so in CSS because nothing in the DOM carried the view. One
   attribute, set on every render, and the stylesheet can address a page by
   name instead of by guessing at its contents.
   ========================================================================== */
function stampView(){
  const app = device.querySelector('.app');
  if(app) app.dataset.view = S.view || '';
}

const _baseStamp = render;
render = function(){
  _baseStamp();
  try { stampView(); } catch(e){ console.warn('stamp', e); }
};

/* ==========================================================================
   AND THE PAGE IS DRAWN ONCE MORE, WITH THIS FILE'S PASSES IN IT

   The boot render is the last statement in views.js, so it runs while views.js
   is still executing — before any of ai.js .. ai5.js has been parsed. Every
   pass file therefore re-renders after installing its wrapper, and ai.js,
   ai2.js, ai3.js and ai4.js each do exactly that at their own foot.

   This file did not. It installs four wrappers — the band, the auth back
   control, the level card's foot and the view stamp — and then let the page
   stand as ai4 last drew it. So on first paint the module head was still four
   separate sections with a hairline between each: no wash, no single closing
   rule, the level card without its foot, and no `data-view` for the stylesheet
   to address. Any interaction at all called `render` again, by then the fully
   wrapped one, and the band appeared — which is why it read as the layout
   correcting itself a moment after load rather than as a missing pass.

   One call, same as its four predecessors. It belongs at the very foot of the
   last pass file, where every wrapper in the chain is installed.
   ========================================================================== */
render();
