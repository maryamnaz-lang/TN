/* ==========================================================================
   THE COHORT LEADER'S COHORTS — index, roster, one candidate

   lead.js drew the leader's dashboard and left seven module landings as
   honest empty states. This file replaces three of them with the pages the
   wireframe's `V.cohorts`, `cohortDetail()` and `memberDetail()` describe,
   plus `V.reports`, which reads the same numbers from the other end.

   THE WIREFRAME'S `talRead` IS THIS PRODUCT'S HEAD BAND, NOT A CARD.
   Every leader page in `tn-portals.html` opened with a `talRead(lead,sub,chips)`
   — Tal's reading of the page, above the page. Transcribing that would put a
   second Tal card on every page, because ai6.js ALREADY writes one: `PAGESUM`
   is keyed by view and `placePageSummary` lands it in the module head band at
   the top of every page in both portals. So the wireframe's per-page Tal read
   crosses as a `PAGESUM` entry (written at the foot of ai6.js), and an
   `.ai-aura` card is spent only where Tal is doing something a paragraph
   cannot: proposing a level, or briefing a call. Same argument lead.js used for
   the dashboard banner, applied to the other seven pages.

   AND THE WIREFRAME'S ANNOTATIONS DO NOT CROSS AT ALL.
   Several of these pages carried `<div class="note i">` blocks addressed to
   the client rather than to the leader — "Open question — client decision",
   "Why this is separate from Evaluations". They are the wireframe doing its
   job as a wireframe. In a high-fidelity portal a bordered note is product
   copy, read by Priya, so a note that says "this is not yet decided" reads as
   the product being unfinished. The DECISIONS those notes record are kept —
   they are why there is no money on this portal and why Sessions and
   Evaluations are two modules — but the annotations themselves stay in the
   wireframe. `.note` is used here only where the sentence is for the leader.

   THE COMPONENTS ARE THE ONES §10.15 ALREADY KNOWS ABOUT.
   The desktop label column is opted out of BY CONTENTS — `.sec:has(.gcard)`,
   `:has(.cardrow)`, `:has(> .tile-stack)`, `:has(> .stats)`, `:has(> .tbl-wrap)`,
   `:has(> .facts)`. Every section on these four pages is built out of one of
   those, which is why this file needs almost no CSS: a page assembled from
   the components on that list gets the right spine for free, and a page that
   invents a wrapper has to be added to a list inside a container query, which
   per trap 3 cannot be corrected from a later layer.
   ========================================================================== */

/* --------------------------------------------------------------------------
   STATE, AND WHY IT IS ON `S`

   `S.ldrCo` and `S.ldrMem` are WHICH cohort and WHICH candidate the two
   detail views are showing. They have to survive a render they did not cause
   — opening Tal, the bell, the ask field — for the same reason `S.leadQ`
   does, which is that `render()` rebuilds the view column from `S` and
   nothing else. Prefixed `ldr` rather than `lead` because `S.leadQ` and
   `S.leadFilter` were taken by the dashboard's queue when this was written (both
   deleted with its search and filter on 1 Sep 2026 — the prefix stays, since the
   collision it avoids is with `lead*` as a whole), and two
   prefixes that differ by one letter are worse than two that do not overlap.
   -------------------------------------------------------------------------- */
S.ldrCo = LEAD_COHORTS[0].id;
S.ldrMem = null;
/* THE REPORTS PAGE OPENS ON A COHORT, NOT ON "ALL COHORTS" (Maryam, 2 Sep
   2026: "remove all cohorts tab just show the other three"). It was `'all'`,
   which is the only value that was never one of the three tabs — so the tab
   strip is now exactly the record, and `S.ldrRep` is always a cohort id as a
   STRING (`data-ldrrep` hands it back as one and `+sel` is what reads it). The
   first cohort rather than a literal, so a re-ordered `LEAD_COHORTS` opens on
   whatever is first rather than on a number written down here. */
S.ldrRep = String(LEAD_COHORTS[0].id);
/* The chapter list's own expand state — NOT the candidate's `S.chAll`, per
   §65's two-disclosures lesson: one boolean for two surfaces holds the first
   one's value the moment both can be open, and the portal switch resets
   neither. */
S.ldrChAll = false;
S.ldrBrief = null;
S.ldrNote = null;

/* A leader's notes are the one thing on this portal they WRITE, so they are
   the one thing that has to be mutable. Keyed by candidate name because that
   is what the roster and the reports both hand over, and seeded with two so
   the member page shows the component doing its job rather than its empty
   state on first look. */
/* A NOTE IS FOUR FIELDS NOW — `t` title, `b` body, `k` kind, `w` when (Maryam,
   2 Sep 2026, with three annotated states). It was two, `t` and `w`, and the
   list drew the whole note as its own title, which is why the rows ran to three
   lines of bold. The reference's row is a heading, a paragraph under it and a
   type tag, and the tag is the field that did not exist.

   THE KIND IS ONE OF THREE AND THE LIST IS CLOSED: `strength`, `develop`,
   `general`. Two are the reference's own ("Strength", "Area to develop") and
   the third is what a note that is neither has to be — most of these are
   neither, and forcing a leader to call an escalation a strength or a weakness
   would be the form filling in the reader. */
S.ldrNotes = {
  'Yuki Tanaka':[{k:'develop', t:'Twelve days without a sign-in', b:'Emailed the address on file and got no bounce, so it is being read. Trying the cohort board next before I escalate.', w:'2 days ago'}],
  'James Whitby':[{k:'develop', t:'Re-taking assessments rather than moving on', b:'Told him on the call to leave three and four at 65 and come back after chapter 6 — the material builds, the score does not.', w:'Last week'},
                  {k:'general', t:'Asked for the handover framework twice', b:'Sent it. Worth checking he used it.', w:'Earlier'}]
};

/* The composer's state. `S.ldrNoteAt` is null when it is shut, `-1` while a new
   note is being written and the note's index while one is being edited — one
   key for three states, so the panel cannot be adding and editing at once. */
/* Which of the cohort page's three tabs is open. Its own key, not the
   candidate's `S.ctab` — the two pages can both be open behind the portal
   switch, which resets neither. */
S.ldrCTab = 'discussion';
S.ldrNoteAt = null;
S.ldrNoteK = 'general';

/* --------------------------------------------------------------------------
   READINGS OF THE ROSTER

   All of it derived, none of it stored — the same rule lead.js set for the
   flags. `lmem()` carries seven fields and the wireframe's member carried
   eleven; rather than widen the record and have two places to keep the same
   candidate consistent, the four the wireframe added are computed here from
   the three that decide them.

   `lchDone` is the reading the whole course platform reports against: 13
   chapters, so a percentage IS a chapter count and printing both is printing
   one fact twice. `lmins` is that chapter count against `CH`'s own running
   times — the candidate portal's `f.mins` counts the same way, so the two
   portals give the same candidate the same hours. Multiplying by attempts is
   the point of it: someone who went round twice spent twice the time, and
   time-with-nothing-to-show-for-it is the signal a leader acts on.
   -------------------------------------------------------------------------- */
const lcoOf   = id => LEAD_COHORTS.filter(c => c.id === +id)[0] || LEAD_COHORTS[0];
const lco     = () => lcoOf(S.ldrCo);
const lmemOf  = (c,name) => (c.members.filter(m => m.name === name)[0] || c.members[0]);
const lchDone = m => Math.round(m.pc / 100 * 13);
const lmins   = m => Math.round(CH.slice(0, lchDone(m)).reduce((s,ch) => s + ch[1], 0) * Math.max(1, m.att || 1));
/* Under an hour reads as minutes. "0h 45m" is a figure with a zero in front
   of it, and the stat cell it lands in is 90px wide — the leading "0h " wrapped
   the whole value onto a second line to say nothing. */
const lhrs    = n => !n ? '&mdash;' : n < 60 ? n + 'm' : Math.floor(n/60) + 'h ' + (n%60) + 'm';
const lidle   = m => /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1] : 0;

/* THE WEEK'S TASK, DERIVED FROM PACE — because the course platform is the
   only thing that knows about tasks and it reports progress, not intent. A
   candidate at or past expected pace has this week's task done; one who has
   never signed in has not started it; the two readings in between are the
   difference between late and still working. */
const ltask = (m,c) => m.last === 'Never' ? ['none','Not started']
  : m.pc >= lpace(c) ? ['done','Done']
  : m.pc >= lpace(c) - 8 ? ['open','In progress'] : ['late','Late'];

const lnotes = name => S.ldrNotes[name] || [];

/* THE COHORT'S RANKING, DERIVED FROM ITS OWN ROSTER — `boardList`'s markup with
   this cohort's numbers. That function reads `BOARD`, which is the CANDIDATE's
   own leaderboard (ten rows, one of them "You", with star ranks off `GAME`);
   a leader looking at Cohort 33 has no row in it and neither do its members.
   Everything here is data the roster already carries: `pts` per member — the
   same scale the candidate's Points page awards against — and `lbadge`, which
   is arithmetic on it, so a candidate cannot hold a badge their points do not
   support. THE STAR RANK IS NOT DRAWN, because a rank is `GAME[stage]`'s and
   this side holds none: three columns that are real beat four with a guess. */
const ldrRankBoard = c => `<div class="board">
    <div class="brow bhead">
      <span>#</span><span>Member</span><span>Earned</span><span class="num">Points</span>
    </div>
    ${c.members.slice().sort((a,b) => b.pts - a.pts).map((m,k) => {
      const b = lbadge(m.pts);
      return `<div class="brow">
        <span class="b-n">${k + 1}</span>
        <span class="b-who">${avatar({i:m.ini, img:AV[m.img]}, 32)}<span class="b-nm">${m.name}</span></span>
        <span class="b-earn">
          ${b ? `<span class="b-mk" title="${b.n}"><img src="${AWARD[b.n.toLowerCase().replace(/ /g,'')]}" alt="${b.n}"></span>` : ''}
          <span class="b-earn-t">${b ? b.n + ' badge' : 'No badge yet'}</span>
        </span>
        <span class="num b-pts">${m.pts.toLocaleString()}</span>
      </div>`;
    }).join('')}
  </div>`;

/* ==========================================================================
   YOUR PRIVATE NOTES — three states, all live (Maryam, 2 Sep 2026, with an
   annotated sheet of all three): empty, a list, and the composer.

   THE SECTION IS WHITE. It was `.sec tint`, and the panel inside it is a
   bordered white card — §74's decision, word for word: "a 5%-tinted card on a
   4% grey ground is two washes a shade apart", and here it is a white card on
   a grey one, which reads as the panel having failed to load rather than as a
   card lying on a ground. `quizResults` made the same swap.

   THE COMPOSER IS INLINE AND THE SHEET IS DELETED. Adding a note was a
   `.modal > .sheet` — a full-screen surface with a scrim, a title, a textarea
   and two feet — for one field. The reference puts it in the panel, which is
   also what the note IS: a row being written where the rows are. `ldrNoteSheet`
   and its `LDR_SHEETS` entry go with it; `data-ldrnote` now opens the composer
   in place, so the chip at the top of the page and the button in the panel
   still work and still mean the same thing.

   WHAT THE REFERENCE DRAWS AND THIS DOES NOT, and each is §60 rather than a
   shortcut — a dead control on a live surface is worse than a missing one:
     the paperclip   nothing in this build stores a file.
     the `@`         there is nobody to mention: a note is private to one
                     leader and nothing else reads it.
     the kebab       its only real item is Delete, and a menu holding one thing
                     is a menu too many. The row carries the pencil and an ×,
                     both live, which is the same two actions one press sooner.
   WHAT IT DOES DRAW AND WIRE: search, the type filter, add, edit, delete, and
   the type itself.

   SEARCH FILTERS THE DOM AND DOES NOT RE-RENDER, which is the technique
   lead.js kept in a note when the attention queue's own search was deleted:
   `render()` replaces `device.innerHTML`, so a re-render on every keystroke
   destroys the `<input>` and takes the caret with it. The rows are hidden by
   class instead and the count line is written in place.
   ========================================================================== */
const NOTE_K = {
  strength:{t:'Strength',        ink:'--support-success-ink', mix:'12%'},
  develop: {t:'Area to develop', ink:'--support-attention',   mix:'14%'},
  general: {t:'General',         ink:'--link',                mix:'10%'}
};

const ldrNoteRow = (n, name, i) => {
  const k = NOTE_K[n.k] || NOTE_K.general;
  return `<div class="note-row" data-note-i="${i}" data-note-k="${n.k || 'general'}"
       style="--note-ink:var(${k.ink});--note-bg:color-mix(in srgb, var(${k.ink}) ${k.mix}, var(--layer-01))">
    <span class="note-mk">${I.edit}<i class="note-dot"></i></span>
    <span class="note-b">
      <span class="note-t">${n.t}</span>
      ${n.b ? `<span class="note-x">${n.b}</span>` : ''}
      <span class="note-f"><span class="note-tag">${k.t}</span><span class="note-w">Added by you &middot; ${n.w}</span></span>
    </span>
    ${''/* THE TWO ACTIONS ARE CHIPS (Maryam, 2 Sep 2026: "instead of this, give
           chips of edit and delete, edit chip will have the blue color … delete
           chip will have red text red icon on left and light red bg"). They
           were two bare `.ic` glyphs — a pencil and a cross — which is the
           product's shape for an action on a ROW in a dense list, and these two
           sit on a note that is three lines tall with nothing else beside it.
           A chip names what it does, which is what an irreversible one should.
           SAME COMPONENT AS THE HEADER'S PAIR: `.ldr-chip`, the mark leading
           the words, the ground mixed from the ink the words are set in. Blue
           is §12's "goes somewhere" and red is `--danger-ink`, this build's red
           as INK — §31 measures both pairs.
           THE DELETE MARK IS `I.close`, NOT A BIN. The icon set has no `delete`
           glyph, and trap 7's rule is that a mark is PASTED from the official
           Rounded set rather than drawn — inventing a path here would be the
           one thing that file forbids. The × is what this row already used and
           what every sheet in the build dismisses with. */}
    <span class="note-a">
      <button class="ldr-chip chip-edit" data-ldrnoteedit="${name}:${i}">${I.edit} Edit</button>
      <button class="ldr-chip chip-del" data-ldrnotedel="${name}:${i}">${I.close} Delete</button>
    </span>
  </div>`;
};

/* THE COMPOSER. One textarea and a type, which is what the reference has, plus
   a title field it does not — and the field is not an addition for its own
   sake: state 2's row is a heading with a paragraph under it, so a composer
   with one box could only fill that heading by cutting the first sentence off
   the body, which is a guess about the writing dressed up as a feature. */
const ldrNoteBox = (name, n) => `<div class="note-box">
    <span class="note-mk note-mk-w">${I.edit}</span>
    ${''/* THE TYPE AND THE TWO BUTTONS ARE INSIDE THE BOX (Maryam, 2 Sep 2026:
           "the type selection should not have a bottom line and it should be
           inside the note block at the bottom left, and it should have a
           chevron with it so user knows that there is some kind of selection
           option here"). The textarea kept the frame and the row sat under it,
           so the composer read as a field and then two unrelated controls; one
           box holding all three is the reference's own arrangement and says
           they belong to the note being written.
           SO THE FRAME MOVES OFF THE TEXTAREA AND ONTO `.note-fbox`, and the
           textarea goes borderless inside it — otherwise the box has a second
           box in it, which is the thing this whole pass has been removing.
           THE CHEVRON IS A REAL `I.chevDown` OVER A REAL `<select>`, not a
           background image and not a menu of our own: the select keeps the
           keyboard and the platform's own picker, and the mark sits over it
           with `pointer-events:none` so a press still opens it. */}
    <div class="note-form">
      <input class="inp note-ttl" id="ldrNoteT" placeholder="A short title"
        value="${n ? n.t.replace(/"/g,'&quot;') : ''}" aria-label="Note title">
      <div class="note-fbox">
        <textarea class="inp note-body" id="ldrNoteB" rows="3"
          placeholder="Write your note here…" aria-label="Note">${n ? n.b || '' : ''}</textarea>
        <div class="note-form-a">
          ${''/* THE LABEL IS DRAWN AND THE SELECT IS LAID OVER IT INVISIBLY
                 (Maryam, 2 Sep 2026: "take the chevron close to the type, it
                 should have only 8px gap"). A native `<select>` at `width:auto`
                 sizes to its WIDEST option, so with "Area to develop" in the
                 list the box stayed that wide whatever was chosen and the
                 chevron sat ~100px past the word — nothing in CSS shrinks a
                 select to its selected option. Drawing the chosen label as text
                 and stretching the real select over the pair gives the exact
                 width, keeps the keyboard and the platform's own picker, and
                 costs one span. */}
          <span class="note-sel-w">
            <span class="note-sel-t">${NOTE_K[(n ? n.k : S.ldrNoteK)] ? NOTE_K[(n ? n.k : S.ldrNoteK)].t : NOTE_K.general.t}</span>
            <span class="note-sel-ch">${I.chevDown}</span>
            <select class="note-sel" id="ldrNoteK" aria-label="Note type">
              ${Object.keys(NOTE_K).map(k => `<option value="${k}"${(n ? n.k : S.ldrNoteK) === k ? ' selected' : ''}>${NOTE_K[k].t}</option>`).join('')}
            </select>
          </span>
          <span class="note-form-b">
            <button class="btn btn-s btn-sm noic note-cancel" data-ldrnotecancel="1">Cancel</button>
            <button class="btn btn-p btn-sm noic" data-ldrnotesave="${name}">Save note</button>
          </span>
        </div>
      </div>
    </div>
  </div>`;

const ldrNotesSec = m => {
  const notes = lnotes(m.name);
  const open = S.ldrNoteAt !== null;
  const editing = S.ldrNoteAt >= 0 ? notes[S.ldrNoteAt] : null;
  /* THE SECTION LOST ITS FURNITURE (Maryam, 2 Sep 2026: "there are a lot of
     unnecessary lines in this section"). Four things went and each was drawing
     a line or a box round something that did not need one:

       the panel's border   the notes ARE the section; a frame round them drew a
                            second edge inside a page already made of hairlines,
                            and the panel's own width was less than the column's.
       the toolbar          "1 note", the search field and the type filter. On a
                            list that is one or two rows long a search is a
                            control for finding what is already on the screen —
                            §60 from the other side. `ldrNoteFilter` and its two
                            listeners are deleted with it rather than left
                            listening for a field nothing draws.
       the foot             "Showing 1 of 1 note" reported what the search had
                            filtered, so it went with the search.
       the rules            a note had a hairline above it and another below.
                            One BETWEEN two notes is the list's rhythm; one over
                            the first and under the last is a box drawn in two
                            pieces, which is what the border was already doing.

     THE ADD BUTTON MOVES INTO THE HEADING ROW and the helper line comes out of
     it, which is the shape every other headed section on this portal uses
     (`.sec-h` › `<h2>` + `.btn-g.btn-sm`). "Feeds the 90-day summary" is not
     lost: it is the one sentence the empty state still makes, which is where a
     reader who has never written a note actually needs it. */
  return `<div class="sec">
    <div class="sec-h"><h2>Your private notes</h2>
      ${open ? '' : `<button class="btn btn-g btn-sm ic-l" data-ldrnote="${m.name}">${I.edit} Add note</button>`}
    </div>
    ${!notes.length && !open
      ? `<div class="note-panel note-empty">
          <span class="note-mk note-mk-lg">${I.edit}</span>
          <h3>No notes added yet</h3>
          <p>Write anything that helps capture ${m.name.split(' ')[0]}&rsquo;s progress, strengths and areas to develop. These private notes feed the 90-day summary.</p>
          <button class="btn btn-s noic note-first" data-ldrnote="${m.name}">${I.add} Add your first note</button>
        </div>`
      : `<div class="note-list">
          ${open ? ldrNoteBox(m.name, editing) : ''}
          ${notes.map((n,i) => ldrNoteRow(n, m.name, i)).join('')}
        </div>`}
  </div>`;
};


/* Severity as a tag, for the pages that show a flag on a ROW rather than in
   the dashboard's table. The table has `.flag-t` and a row class; a row in a
   tile-stack has neither, and `.tag` already carries the two inks — `red` and
   `org` are §12's tuned severity pair, which is what 31-lead.css §117 chose
   for exactly this reading. */
const lflagTag = f => !f ? '' :
  `<span class="tag ${f.k === 'bad' ? 'red' : 'org'} sm">${f.t}</span>`;

/* A MARK FOR SOMETHING THAT IS NOT A PERSON.
   The plate's leading slot is sized for `.av-ph` and every plate in the
   product puts a face there. A cohort has ten faces and no one of them is the
   answer to "who am I meeting", so the mark is the cohort's own number in the
   same plate — which is `.av-ph`'s FALLBACK state, drawn on purpose: the
   element with an `<i>` and no `<img>` is exactly what `avatar()` degrades to
   when a photo fails, so this needs no rule of its own. The alternative was a
   40px `.cardrow-ic` in a 56px slot, which §15 sizes for the avatar. */
const ldrMark = (label,size) => `<span class="av-ph" style="width:${size}px;height:${size}px"><i>${label}</i></span>`;

/* A cohort's own headline number, said the way the leader asks for it: not
   "46%" but "46% against 38% expected", because a percentage on its own
   cannot tell them whether to act. */
/* THE ASSESSMENT AVERAGE COUNTS ONLY WHO HAS BEEN ASSESSED.
   `lavg(c,'avg')` divides by every member, so a cohort four days old — half of
   whom have not opened a chapter, and carry `avg:0` for "nothing yet" — reported
   26%. That is not a low score, it is an absent one, and a leader reading 26%
   against a 75% pass mark would act on a cohort that has done nothing wrong.
   `lavg` stays as it is: the dashboard uses it for PROGRESS, where 0 genuinely
   means zero progress. Assessment is the field where 0 means "no data". */
const lassess = c => {
  const on = c.members.filter(m => m.avg > 0);
  return on.length ? Math.round(on.reduce((s,m) => s + m.avg, 0) / on.length) : 0;
};

const lpaceLine = c => `${lavg(c,'pc')}% against ${lpace(c)}% expected`;
const lpaceGap  = c => lavg(c,'pc') - lpace(c);

/* ==========================================================================
   COHORTS — THE INDEX

   THE THREE COHORTS ARE THREE CARDS (Maryam, 2 Sep 2026, with a reference
   screen: "I want such cards for my cohorts", then "we already have 3 cohort
   images that we are using on the dashboard, use those here as well").

   WHAT THIS TURNS OVER, AND THE HALF OF IT THAT SURVIVES. This page drew a
   seven-column table, and the note that stood here made the case for it: the
   question is which cohort needs the leader most, which is a COMPARISON, so
   six facts became six columns and the answer was a scan down one column
   rather than a diff across three cards. That is still true of a table and it
   was never the whole question — a table can be scanned and it cannot be
   RECOGNISED. Three cohorts are three places a leader spends thirteen weeks,
   and the cover is what says which is which before a figure is read.
   The comparison is kept INSIDE the card instead of given up: four labelled
   rows in one order on all three cards, on one grid, with the figures on a
   shared right edge — so "which cohort is behind" is still a scan across three
   cards at the same height. §92 is the drawing and the long version.

   THE BAR COMES BACK, and the old note is why it could not be here before:
   "`.bar` inside a table cell would set a width against a column that is being
   negotiated against five others". A card negotiates with nothing, so the
   progress row draws §03's own bar, the same object the candidate's course
   progress uses.

   ONE CARD OPENS ONE ROSTER, AND THE WHOLE CARD IS THE TARGET — the argument
   lead.js records for `faceRow` and this file recorded for `.ldr-tr`. The
   arrow in the corner is the mark, not the control.

   `.ldr-tbl` / `.ldr-tr` / `.ldr-go` KEEP FOUR OTHER WRITERS (the roster, the
   reports list and two on this file's own member pages), so none of §36's
   table rules is orphaned by this and none is deleted.
   ========================================================================== */

/* THE COVER IS THE ONE THE DASHBOARD ALREADY DRAWS, and that was the whole of
   the second instruction: `cohortArt(c)` reads `COHORT_ART` by LEVEL, so one
   cohort wears one picture on its dashboard row, on the leader's black call
   card and here. The `<i>` behind the `<img>` is the fallback the `onerror`
   uncovers — §86's arrangement, and the reason it is the cohort's NUMBER is
   `gcard`'s: a component cannot know which of two strings holds the identity,
   so the caller states it.

   THE PILL ON THE COVER IS BACK, AND IT COUNTS PEOPLE (Maryam, 2 Sep 2026:
   "we had tags on the top left of the cohort cards before, take them back, but
   the text in those tags will be the candidate count like 10 Candidates"). It
   was "Explorer – E3" and came off earlier the same day; what returns is the
   same object in the same corner with a different string, so the class is
   `.cco-pill` rather than the `.cco-lvl` it was — a name that says where it
   sits rather than what it happened to hold.

   THE HUE IS STILL KEYED BY LEVEL, and that is now decoration rather than a
   label — which is the honest description of it, so it is worth stating. The
   three cards carry three colours because three cards want telling apart at a
   glance, and level is the one property that already keys the artwork under it,
   so the pill and its cover can never disagree. `nth-child` would colour it by
   position, so re-sorting the list would recolour E3.

   THE LEVEL IS STILL SAID ELSEWHERE, which is what made it safe to give the
   slot away: the `ph()` line reads "all Explorer" and the roster one click in
   names the level in full.

   THE COUNT LEAVES THE LINE UNDER THE NAME AS IT ARRIVES HERE (Maryam, same
   message pair: "below cohort name, only show Week 5 of 13, remove the other
   candidate and chapter content"), so the card states it once. The chapter goes
   with it — `CH` has no reader on this card now.

   THE PROGRESS IS A RING, NOT A ROW (Maryam, 2 Sep 2026: "instead of showing
   the progress in the row, use a progress circle with the percentage in it,
   this will be on the right end of the … row"). It is `ring(pct,label)`, §32's
   own component, at §90's 56px — so the card, the pulse and the evaluation row
   all draw one object. Two consequences:
     - THE BAR GOES WITH IT. A bar under a ring is the same figure drawn twice,
       which is §90's own note about its reference ("a second drawing of the
       figure already in the ring").
     - THE EXPECTED PACE STAYS, AS A CAPTION UNDER THE RING. The row said "39%
       of 38%" and the second half is not decoration: cohort 47 is on 6% and
       reads like a disaster until you see the 4% beside it. A ring cannot hold
       two figures, so the comparison sits under it in the same words the row
       used, and the ring's own `aria-label` states both for a screen reader.

   THE LINE UNDER THE NAME IS DERIVED, AND IT IS NOT THE REFERENCE'S. That
   screen prints a sentence of level marketing under each title ("Building the
   foundation of leadership through exploration and self-awareness"); nothing
   in this build holds a description of a level, and inventing three is the one
   thing §74 rules out — "three sentences of new product copy no data in this
   build supports". What the slot takes instead is the two facts the card does
   not otherwise state: the headcount, and the chapter the cohort is on this
   week, read off `CH` by week the way `lcDetail` does it so the two cannot
   disagree. The WEEK moves here from the table's own column, where it was
   being compared; on a card it is read once. */
/* THE RING'S HUE IS HOW FAR THROUGH THE 90 DAYS THE COHORT IS, IN THREE BANDS
   (Maryam, 2 Sep 2026: "change 6% progress color to yellow, 83% to green").

   IT IS THE FIGURE, NOT A VERDICT, and the difference matters because the two
   readings point opposite ways on this very data. Against PACE, cohort 47 is
   ahead (6% of 4%, four days old) and cohort 33 is a point behind (83% of 84%)
   — so a pace colouring would make 47 green and 33 amber, the exact inverse of
   what was asked for. What the ask describes is the odometer: just started,
   under way, nearly done. Named that way it cannot be misread as "cohort 47 is
   in trouble", which is the misreading the `of 4%` caption under the ring
   already exists to head off.

   THE TWO THRESHOLDS ARE THE ONES THE ASK IMPLIES — a quarter and three
   quarters of the course, which is 6 / 39 / 83 falling one to a band. Round
   numbers rather than tuned ones, so a fourth cohort lands somewhere sensible
   rather than in whichever band three data points happened to leave open.

   THE HUES ARE §01's SUPPORT TOKENS, and the middle band keeps the accent it
   already had. `--support-warning-ic` rather than `--support-warning` for the
   same reason §02 gives it to `.note.warn`'s edge: it is the cut of that yellow
   meant for a MARK, and #f1c21b on white against a pale warm track is a stroke
   you have to look for. */
const ccoRing = pc => pc >= 75 ? '--support-success'
                    : pc < 25  ? '--support-warning-ic'
                    : '--accent';

/* The pill's hue, by level. Three of §12's marker hues, written as a custom
   property the way `pulseCol` writes `--mk`. */
const CCO_PILL = {e1:'--mk-2', e2:'--mk-3', e3:'--mk-1'};

const cohortCard = c => {
  const bad  = c.members.filter(m => m.flag && m.flag.k === 'bad').length;
  const wa   = c.members.filter(m => m.flag && m.flag.k === 'wa').length;
  const pc   = lavg(c,'pc');
  const pace = lpace(c);
  const pill = CCO_PILL[String(c.level).toLowerCase()] || '--mk-1';
  /* A row is a mark, a label and a figure. The mark is a BARE glyph (Maryam,
     2 Sep 2026: "remove the icons backgrounds") — the same subtraction §72 made
     for the pulse's column marks and §29 for `.stat`, and the same 20px it left
     them at, since a mark with no ground has no padding to hold the line with.
     The hue survives the chip and is named per row, never cycled. */
  const row = (mk,ic,label,val) => `<span class="cco-r" style="--mk:var(${mk})">
      <span class="cco-ic">${ic}</span>
      <span class="cco-l">${label}</span>
      <span class="cco-v">${val}</span>
    </span>`;
  return `<button class="cco clk" data-go="leadCohort" data-ldrco="${c.id}">
    <span class="cco-art">
      <i>${c.id}</i>
      <img src="${cohortArt(c)}" alt="" loading="lazy" onerror="this.style.display='none'">
      <span class="cco-pill" style="--pill:var(${pill})">${c.members.length} Candidates</span>
    </span>
    <span class="cco-b">
      <span class="cco-hd">
        <span class="cco-hb">
          <span class="cco-n">${lname(c)}</span>
          <span class="cco-d">Week ${c.week} of 13</span>
        </span>
        ${''/* THE "of 38%" CAPTION IS GONE (Maryam, 2 Sep 2026: "remove the
               'of n%' from the bottom of each progress circle"). It was the
               second half of the row this ring replaced — "39% of 38%" — and
               what it bought is worth naming so nobody re-derives it by
               accident: without it a card states progress and not progress
               AGAINST PACE, so cohort 47's 6% reads as a cohort that has
               stopped rather than one that is four days old and ahead. Two
               things still carry the comparison and neither is on this card:
               Tal's summary at the head of the page names the widest gap by
               cohort, and Course Reports is built on it per candidate. The
               ring's `aria-label` keeps both figures, so a screen reader is
               told what a sighted reader is now trusted to know from the week
               beside the name. */}
        <span class="cco-ring" style="--ring-ink:var(${ccoRing(pc)})">
          ${ring(pc, `${pc}% of ${pace}% expected`)}
        </span>
      </span>
      ${row('--mk-3', I.chart, 'Assessment',
            lassess(c) ? lassess(c) + '%' : '<span class="t-helper-01">not yet</span>')}
      ${row('--support-attention', I.warningAlt, 'Flagged',
            bad || wa
              ? `<span class="cco-tags">${bad ? `<span class="tag red sm">${bad} at risk</span>` : ''}${wa ? `<span class="tag org sm">${wa} watch</span>` : ''}</span>`
              : '<span class="t-helper-01">none</span>')}
      ${row('--mk-4', I.calendar, 'Next call',
            `${c.callDay} <small>${c.callTime.toLowerCase()}</small>`)}
      ${''/* THE CORNER ARROW IS GONE (Maryam, 2 Sep 2026: "remove the bottom
             arrows from each card"), and with it §92.5's whole argument for
             drawing a box round it. The card is still the button — that has not
             changed and is what makes the arrow subtractable: §64's rule is
             that on a product made of hairlines a drawn rectangle is one more
             edge than the page has, and this was the last one on the card.
             `.cco-f` / `.cco-go` are deleted rather than hidden, which takes
             `margin-top:auto` with them: the cards are stretched to the tallest
             by the grid and now simply end after their last row. */}
    </span>
  </button>`;
};
V.leadCohorts = () => {
  const flagged = lmembers().filter(x => x.m.flag);
  const severe = flagged.filter(x => x.m.flag.k === 'bad');
  const next = LEAD_COHORTS.slice().sort((a,b) => a.callOrd - b.callOrd)[0];
  /* `worst` WAS COMPUTED HERE AND READ BY NOTHING, and it goes with the
     identical one on the reports page. The argument it carried is worth
     keeping: worst is by GAP, not by raw average — cohort 47 is on 6% and four
     days old, which is nothing to act on, while 41 is on 46% in week five and
     eight points down. That is the dashboard queue's own sort, and `lpaceGap`
     is where it lives. The reader here was the pace footnote under the table,
     deleted when the table became three cards. */

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Cohorts')}
  ${''/* Tal's summary opened with "Three cohorts, 28 candidates" — this
        line with the numbers spelt instead of set, which also meant the page
        showed the same count in two notations. The spine keeps the figures in
        one notation and Tal keeps the finding. */}
  ${ph('Cohorts',`${LEAD_COHORTS.length} cohorts &middot; ${lmembers().length} candidates &middot; all Explorer`)}
  ${''/* ONE SECTION, ONE HEADING (Maryam, 2 Sep 2026: "take the All cohorts
         heading above the 4 cards row", and "remove the grey background of the
         3 cards section"). The figure band and the three cards were two
         sections and the second one carried the heading, so the page opened on
         four unlabelled figures and then named itself half way down. They are
         one block and always were: the band is the three cohorts added up and
         the cards are the three cohorts, so "All cohorts" heads both and the
         helper line that defines expected pace now sits above the first figure
         it applies to rather than below it.
         THE TINT GOES WITH THE MERGE and would have had to anyway: §12 steps a
         `.stats` band down onto a panel by re-pointing its cells to the panel's
         own colour and drawing the hairlines as the grid's gaps, so a band and
         a row of white cards on one grey ground is two different treatments of
         "a thing lying on a panel" in one section. On white the band draws its
         own rules and the cards their own border. */}
  <div class="sec">
    ${''/* THE HELPER LINE IS GONE (Maryam, 2 Sep 2026: "remove the Expected
           pace is day of 90, evenly spread text"). It defined what the Progress
           COLUMN was measured against, and that column left with the table: the
           comparison now sits on each card as "of 38%" under its own ring,
           where the figure it qualifies is 20px away rather than 400. The
           heading row holds the heading alone. */}
    <div class="sec-h"><h2>All cohorts</h2></div>
    <div class="stats">
      ${statCell(I.group,  'Cohorts',   LEAD_COHORTS.length, `${lmembers().length} candidates`)}
      ${statCell(I.growth, 'On pace',   LEAD_COHORTS.filter(c => lpaceGap(c) >= 0).length + ` <small>of ${LEAD_COHORTS.length}</small>`, 'against expected progress')}
      ${statCell(I.warningAlt, 'Flagged', flagged.length, `${severe.length} severe`)}
      ${''/* THE FOURTH CELL OPENS THE CALLS MODULE (Maryam, 2 Sep 2026: "the 4
             card of the next call should be clickable and should take me to the
             calls module"). It is the one cell of the four whose subject lives
             on another page — the other three are counts OF this page — and it
             is also the route the closing "This week's calls" button used to
             carry, so the way there is back on the page in the place the figure
             already names it. `statCell`'s sixth argument is a raw attribute
             and the capture-phase router does the rest. */}
      ${statCell(I.calendar, 'Next call', next.callDay, `${lname(next)} &middot; ${next.callTime.toLowerCase()}`, null, 'data-go="leadCalls"')}
    </div>
    <div class="cco-grid">
      ${LEAD_COHORTS.map(cohortCard).join('')}
    </div>
  </div>
  ${''/* "THIS WEEK'S CALLS" IS OFF THIS PAGE ENTIRELY, IN TWO STEPS.
         The LIST went to `V.leadCalls` on 1 Sep 2026 — three `.bk-row`s with a
         date chip and a Brief button, which is exactly the list the Calls page
         opens with, and two pages drawing one list is the "route to the same
         content" this portal keeps deleting. What was left behind was a
         `.btn-set` at the foot carrying the way there, on the rule that "a list
         handed to another page needs a route to it, or the subtraction is a
         dead end rather than a move".
         THE BUTTON IS GONE TOO (Maryam, 2 Sep 2026: "remove the bottom This
         week's calls row"), and the rule it was answering is satisfied a
         different way: Calls is a RAIL MODULE, one slot above Cohorts, so the
         way there is permanent and one click from anywhere. A button at the
         foot of a page repeating a rail item is the third copy of a route
         rather than the only one — which is the same test the list itself
         failed. The page now ends on the three cards, which is what it is
         about.
         NOTHING ABOUT THE CALLS IS LOST HERE EITHER: the figure band's fourth
         cell is "Next call" with the cohort and the hour in its note, and every
         card carries a "Next call" row of its own. */}
</div></main>`;
};

/* ==========================================================================
   ONE COHORT — THE ROSTER

   THE CALL IS A PLATE, for the reason views.js records on the candidate's own
   cohort page: every appointment in this product is the black wall with a
   face, and the weekly call is an appointment. The candidate side draws this
   exact call with Priya's face on it; here the face is the cohort, so the
   plate takes `I.group` in the same slot — same component, and the two
   portals draw one call the same way.

   THE ROSTER IS SEVEN COLUMNS, NOT TEN. The wireframe's roster carried
   Progress, vs pace, Assess avg, Attempts, Time, Last active, Week task, Flag
   and an Open button. Ten columns on a 900px view column is a horizontal
   scroll on every width, and three of them were saying one thing: progress
   as a bar, progress as a per cent, and progress against pace. The per cent
   against expected is the reading — the bar is decoration next to it, and
   time is derivable from chapters. What is left fits without scrolling and
   every column is a column a leader sorts on in their head.
   ========================================================================== */
V.leadCohort = () => {
  const c = lco();
  const gap = lpaceGap(c);
  const flagged = c.members.filter(m => m.flag);
  const severe = flagged.filter(m => m.flag.k === 'bad');
  const weakest = c.members.filter(m => m.avg > 0).slice().sort((a,b) => a.avg - b.avg)[0];
  const chapter = CH[Math.min(12, c.week - 1)];

  return `<main class="main"><div class="page">
  ${crumb(['Cohorts','leadCohorts'], lname(c))}
  ${ph(lname(c), `${c.members.length} candidates at ${llevel(c)} &middot; week ${c.week} of 13 &middot; day ${c.day} of 90`)}
  ${''/* THE WEEKLY CALL IS `leadCallCard`, AND THIS PAGE IS THE THIRD SURFACE
         TO MAKE THE SAME MOVE (Maryam, 2 Sep 2026: "you know well about our
         other pages layout, please position and update the design of this page
         accordingly"). It was a `.plate`, and §81 records what that costs and
         why the dashboard stopped doing it on 1 Sep — word for word the
         arrangement this page still had:

           `.plate` IS IN ai5's `DARK_CARD`, so `placeDark` hoists it into the
           head band. §56 then makes the band two columns, and the LEFT column
           on this page holds one sentence — Tal's summary, two lines — against
           a 370px card. The result is the band's own note describing a page
           that does not exist: 200px of empty cream beside a black box.
           `.dark-card` is in no pass's list, so the gate stops matching, the
           band falls to one `minmax(0,1fr)` column and the summary takes the
           width back with nothing restated. That is §81's sentence exactly:
           "out of the top" and "full width" are one change, not two.

         AND THE `ph()` ACTION SLOT EMPTIES WITH IT. "Generate the brief" was a
         `.btn-p` in that slot, which sits ABOVE Tal's summary — the placement
         both this file and lead3 record emptying for exactly that reason, twice.
         It is the card's own secondary now, which is where the Calls page
         already puts it: the brief is per-CALL, so it belongs on the card that
         names the call rather than on the page that happens to contain it.

         ONE DRAWING, THREE PAGES. The dashboard, the Calls page and now this one
         all call `leadCallCard(lcall(c))`, so the same appointment cannot be
         described three ways — the `bkStamp` rule, one portal over. What this
         caller states is only its own secondary. */}
  ${leadCallCard(lcall(c), {second:{at:`data-ldrbrief="${c.id}"`, ic:I.edit, t:'Generate the brief'}})}
  <div class="sec">
    <div class="stats">
      ${statCell(I.growth, 'Average progress', lavg(c,'pc') + '<small>%</small>', `${gap >= 0 ? '+' + gap : gap} against pace`)}
      ${statCell(I.time,   'Expected pace',    lpace(c) + '<small>%</small>', `day ${c.day} of 90`)}
      ${statCell(I.chart,  'Assessment average', lassess(c) ? lassess(c) + '<small>%</small>' : '<small>Not yet</small>', weakest ? `lowest ${weakest.avg}% &middot; ${c.members.filter(m => m.avg > 0).length} of ${c.members.length} assessed` : 'nothing assessed yet')}
      ${statCell(I.warningAlt, 'Flagged', flagged.length + `<small> of ${c.members.length}</small>`, `${severe.length} severe`)}
    </div>
  </div>
  <div class="sec tint">
    ${''/* THE ROSTER IS THE COURSE REPORTS TABLE WITH THE FLAG COLUMN ON IT
           (Maryam, 2 Sep 2026: "instead of the roasters table, we should have
           the discussions, ranking, and members against a cohort but before
           that we need to show the candidate progress table just like we have
           on the course report page but … we have the flags column in the
           roaster table, add that").

           IT IS ONE TABLE DRAWN TWICE, NOT TWO TABLES. Course Reports and this
           page were reporting the same ten people in two column sets — Progress
           against pace, a week task and a flag here; chapters, assessment,
           attempts and time there — so a leader comparing the two saw the same
           roster described two ways. The columns are Course Reports' now,
           because they are the platform's own fields, plus the FLAG, which is
           the one reading this page had that the other did not.
           WHAT WENT WITH THE OLD COLUMNS: "Progress %+gap" is the figure band
           two blocks up (it states the cohort's own average and its gap), and
           the "Week N task" chip is `ltask`, which is derived from progress
           against pace — the same reading the flag column makes, said twice.
           `ltask` keeps its other reader on the member page.
           THE ROW IS THE COURSE REPORTS ROW to the class: `.ldr-tbl.tbl-flag`
           for §31's quiet treatment, a face in the first cell, and "View
           Progress" in the last. */}
    <div class="sec-h"><h2>Candidate Progress</h2><span class="t-helper-01">From the course platform</span></div>
    <div class="tbl-wrap">
      <table class="tbl ldr-tbl tbl-flag">
        <tr><th>Candidate</th><th class="num">Chapters</th><th class="num">Assessment</th>
            <th class="num">Attempts</th><th class="num">Time</th><th>Last active</th><th>Flag</th><th></th></tr>
        ${c.members.slice().sort((a,b) => (a.pc - lpace(c)) - (b.pc - lpace(c))).map(m => `
          <tr class="ldr-tr${m.flag ? (m.flag.k === 'bad' ? ' sev' : ' mod') : ''}" data-ldrco="${c.id}" data-ldrmem="${m.name}" data-go="leadMember" tabindex="0" role="button">
            <td><span class="ldr-who">
              <span class="mem-av mem-ph">${avatar({i:m.ini, img:AV[m.img]}, 24)}</span>
              <span class="ldr-who-n">${m.name}</span>
            </span></td>
            <td class="num">${lchDone(m)} <span class="t-helper-01">of 13</span></td>
            <td class="num">${m.avg ? `${m.avg}%` : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="num">${m.att ? m.att.toFixed(1) : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="num">${lmins(m) ? lhrs(lmins(m)) : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td>${m.last.toLowerCase()}</td>
            <td>${m.flag ? `<span class="flag-t">${I[m.flag.ic]}${m.flag.t}</span>` : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="ldr-go"><span class="ldr-view">View Progress ${I.arrowRight}</span></td>
          </tr>`).join('')}
      </table>
    </div>
  </div>
  ${''/* AND THE COHORT'S OWN THREE TABS, WHICH ARE THE CANDIDATE'S. The
         candidate's Cohort page has drawn Discussion / Ranking / Members since
         it existed, and this is the leader's view of the same cohort — so it is
         the same strip, the same components and, for Cohort 41, the same board:
         `ROOM` and `COHORT` ARE Cohort 41, which is the decision lead.js records
         ("post on the leader side and it is there on the candidate side").

         `S.ldrCTab` IS ITS OWN KEY, not the candidate's `S.ctab` — §65's
         two-disclosures lesson, and here the two really can be open at once
         because the portal switch resets neither.

         RANKING AND MEMBERS ARE DERIVED FROM THE COHORT, so all three cohorts
         have them: `c.members` carries the names, the faces and `pts`, and
         `lbadge` turns the points into the badge. That is why this is
         `ldrRankBoard(c)` rather than a call to `boardList()`, which reads the
         CANDIDATE's own `BOARD`.

         DISCUSSION IS COHORT 41'S ONLY, AND THE OTHER TWO SAY SO. There is one
         board in this build. Drawing it under Cohort 33 would be ten posts by
         people who are not in it — the invented data §74 rules out — so 33 and
         47 get the empty state and the composer, which is what a board with
         nothing on it is. */}
  <div class="sec sec-cs">
    <div class="cs">
      <button class="${(S.ldrCTab || 'discussion') === 'discussion' ? 'on' : ''}" data-ldrctab="discussion">Discussion</button>
      <button class="${S.ldrCTab === 'ranking' ? 'on' : ''}" data-ldrctab="ranking">Ranking</button>
      <button class="${S.ldrCTab === 'members' ? 'on' : ''}" data-ldrctab="members">Members</button>
    </div>
    ${S.ldrCTab === 'members'
      ? `<div class="tile-stack">${c.members.map(m => mem(m.name, m.ini, `${llevel(c)} &middot; ${m.pc}% of the course`, false, m.img)).join('')}</div>`
      : S.ldrCTab === 'ranking' ? ldrRankBoard(c)
      : c.id === 41 ? discussionRoom()
      : `<div class="empty" style="border:0">${I.chat}
          <h3>Nothing posted yet</h3>
          <p>${lname(c)}&rsquo;s board is empty. Anything you post here, all ${c.members.length} of them read.</p>
        </div>`}
  </div>
  ${''/* THE "ATTEMPTS" NOTE IS DELETED (Maryam, 2 Sep 2026: "remove the bottom
         Attempts section"). It defined the column — how many times a candidate
         went back through the same content, and that over 2.0 with assessments
         under 75% is the clearest struggle signal the data gives. The
         definition is not lost so much as made unnecessary: `lflag` applies
         exactly that test and prints its answer as "Struggling" in the Flag
         column, on the row it is about. A footnote explaining a column the
         table already interprets is the third copy of a reading. */}
  ${''/* THE CLOSING BUTTON ROW IS GONE (Maryam, 2 Sep 2026: "remove the bottom
         Post to the cohort board / Course reports texts"). Both were routes to
         somewhere else and both stopped being the only one on the same day:
         the Discussion tab 200px above now carries the board's OWN composer, so
         "Post to the cohort board" was a link to a field already on the screen,
         and Course Reports is a rail module one click from anywhere. The page
         ends on the cohort, which is what it is about — the same subtraction
         `V.leadCohorts` made when its "This week's calls" button came off. */}
</div></main>`;
};

/* ==========================================================================
   TAL'S READING OF A CANDIDATE

   THE PAGE DOES NOT DRAW THIS. It is `PAGESUM.leadMember`, and that is not a
   compromise — it is where this product keeps a page's Tal copy, learnt the
   hard way and written down here so the next pass does not spend an afternoon
   on it.

   `talFirst()` in views.js hoists ANY section containing an `.ai-aura` to
   immediately after the page header: "the card is authored where it reads
   best in source order; this moves it." `placeBand` (ai5) then finds it
   adjacent to the header and pulls it into the module head band. And ai6
   strips `.ai-foot`, `.ai-asks` and any action out of whatever is in that
   band, then replaces the card's heading and body with `pageSummary()`.

   Three consequences, and every one of them is a rule for this file:
   1. A hand-authored Tal card cannot sit lower down a page. It will be moved.
   2. It cannot carry a button or an ask chip. They will be removed — ai6's
      note explains why, and requires the route to exist on the page instead.
   3. Its words will be replaced by the `PAGESUM` entry for the view — and if
      there is NO entry, the card is left in a shape §33 does not style, which
      renders a 1786px-wide head band on a 1068px page.

   So the reading lives here as a function, `PAGESUM.leadMember` calls it, and
   the page below is figures and record. One Tal card per page, at the top,
   with its copy in the one place the rest of the product keeps it.

   IT IS ONE PARAGRAPH, NOT A HEADING AND A PARAGRAPH. The band has no heading
   — ai6 removes it — so the judgement has to be the first sentence instead.
   Which is better anyway: "Yuki has never signed in" is the finding, and a
   summary whose first six words are the finding is one a leader can act on
   without reading the rest.

   AND IT IS TWO SENTENCES, WHICH IT WAS NOT. Every branch below used to run
   to three, 40 to 55 words, and the third was always the same kind of thing:
   the reasoning read back out. "They are moving slowly, Yuki has not started,
   and a cohort place is being held open. Cohort 41 is on day 34 of 90." —
   two clauses of argument and a fact the page header states. On the longest
   branch that was 55 words in the block a leader reads first on a page whose
   whole job is to be scanned. The finding stays first, the action follows it
   in the same breath, and the working-out is gone. Which is also the rule the
   rest of `PAGESUM` now holds to: 18 to 28 words, two sentences, no framing.
   ========================================================================== */
function ldrRead(m,c){
  const d = m.pc - lpace(c);
  const first = m.name.split(' ')[0];
  const done = lchDone(m);
  if(m.last === 'Never')
    return `${first} has never signed in &mdash; no chapter opened, no assessment, no time on the course at all. Act on this before any of the behind-pace names: a cohort place is being held open.`;
  if(lidle(m) >= 7)
    return `${first} stopped ${lidle(m)} days ago at ${m.pc}% &mdash; ${done} of 13 chapters, then nothing. Worth a direct message rather than a mention on the call; people who stop mid-course rarely restart unasked.`;
  if(m.att >= 2.0 && m.avg < 75)
    return `${first} is trying, not absorbing: ${m.att.toFixed(1)} attempts on average against a ${m.avg}% assessment score. The material is landing badly rather than the effort being missing &mdash; this is the pattern that gets worse if you push harder.`;
  if(d <= -15)
    return `${first} is well behind pace at ${m.pc}% against ${lpace(c)}% expected on day ${c.day}. Assessments hold up at ${m.avg}%, so this is time rather than comprehension &mdash; worth direct outreach before the next call.`;
  if(d <= -5)
    return `${first} is ${Math.abs(d)} points behind pace, ${m.pc}% against ${lpace(c)}% expected, with assessments at ${m.avg}%. A gap this size usually recovers on its own &mdash; worth watching rather than intervening.`;
  return `Nothing alarming in ${first}&rsquo;s numbers &mdash; ${m.pc}% against ${lpace(c)}% expected, assessments at ${m.avg}%, ${done} of 13 chapters. ${m.att <= 1.2 ? 'First-time passes on almost everything.' : 'A second pass on some, which at this score is thoroughness.'}`;
}

/* ==========================================================================
   ONE CANDIDATE

   THE IDENTITY ROW IS `.idhead`, THE CANDIDATE PORTAL'S OWN. It carries a
   face, a name, a meta line, a tag and an action held at the right end, which
   is exactly this row — and §29.10 already settled where the action sits on
   it. `.idphoto` becomes a plain `.av-ph` here because a leader cannot change
   somebody else's photo, and a button that looks editable and is not is worse
   than a picture.

   THE CHAPTER RECORD IS A TABLE OF WHAT HAPPENED, NOT OF ALL THIRTEEN.
   The wireframe printed the chapters reached plus one, and a line saying the
   rest were not reached. That is right and it is kept: thirteen rows of
   "&mdash;" is a table telling you nothing in thirteen places.

   THE KEPT SCENES REUSE `clip()`. The candidate chose three moments from
   their interview to show; `clip()` is the component their own portal shows
   them in. Its checkbox is what picks a clip, and the leader does not pick —
   so the scenes here are drawn by `ldrScene`, which is `clip()` with the
   control taken out rather than a second drawing of a video row.
   ========================================================================== */
/* A CHAPTER ROW ON THE LEADER'S SIDE — `chRow`'s markup, this member's data.
   Maryam, 2 Sep 2026, with the candidate portal's own list as the reference.

   WHY IT IS NOT A CALL TO `chRow`. That function takes the SIGNED-IN
   candidate's stage facts and reads three of their own records — `SCORE` (their
   thirteen assessments), `GROWTH` (their two growth areas) and `OPEN_DATES` —
   and it stamps `data-go="chapter:i"`, which from a leader page would open the
   leader inside somebody else's chapter player. Every class here is §15's, so
   the two portals draw one component; what differs is where the numbers come
   from and that this row is not a control.

   THE SCORE IS DERIVED THE WAY THE TABLE THIS REPLACES DERIVED IT, and its
   guard is kept word for word: no score without an assessment average, because
   `m.avg` of 0 means the course platform has sent nothing back and a
   per-chapter figure spun out of it invents a 60% for a candidate the band
   above describes as "nothing assessed yet".

   NO TRAIL ON A FINISHED CHAPTER. The candidate's row ends in "Restart"; a
   leader cannot restart anybody's chapter and §60's rule is that a dead control
   is worse than a missing one. The unfinished rows keep §15's state mark, which
   is a picture rather than a control. */
const ldrChRow = (i, m, done) => {
  const [name, mins] = CH[i];
  const complete = i < done, open = i === done;
  const sc = (complete && m.avg > 0)
    ? Math.max(60, Math.min(100, m.avg + ((i % 3) - 1) * 7)) : null;
  const meta = complete ? `${mins} min &middot; ${sc ? sc + '% assessment' : 'not assessed'}`
             : open     ? `Started &middot; ${mins} min`
             :            `Not started &middot; ${mins} min`;
  return `<div class="ch ${complete ? 'done' : open ? 'open' : ''}">
    <span class="ch-num">${String(i + 1).padStart(2,'0')}</span>
    <span class="ch-b">
      <span class="ch-n">${name}${complete ? `<span class="ch-tick">${I.checkFilled}</span>` : ''}</span>
      <span class="ch-m">${meta}</span>
    </span>
    ${complete ? '' : `<span class="ch-ic"><span style="fill:var(--gray-40)">${I.circle}</span></span>`}
  </div>`;
};

/* A SCENE CARD ON THE LEADER'S SIDE — `sceneCard`'s markup, this member's face.
   `STILL_Y` is views.js's own six crops of one portrait, reused so a scene here
   and the same scene in the candidate's portal are framed identically. It is a
   `<button>` with no `data-scene-play`, which is exactly what the `.clip` row it
   replaces was: the play mark is part of the picture of a video, and nothing in
   either portal opens a clip yet. */
const ldrSceneCard = (sc, m, i) => `<button class="scene" type="button" aria-label="${sc[0]}, ${sc[3]}">
    <span class="scene-still" style="background-image:url('${AV[m.img]}');--still-y:${STILL_Y[i % 6]}">
      <span class="scene-play">${I.play}</span>
      <span class="scene-len">${sc[3]}</span>
    </span>
    <span class="scene-b"><span class="scene-t">${sc[0]}</span></span>
  </button>`;

const ldrScene = (title,note,stamp,len) => `<div class="clip">
    <span class="thumb">${I.play}<span class="t">${len}</span></span>
    <span class="cb"><span class="ct">${title}</span><span class="cq">${note} &middot; from ${stamp}</span></span>
  </div>`;

/* The six moments an interview is cut into. Three are picked per candidate,
   by name, so the same person always shows the same three — a stable demo
   without a store to keep them in. Same list the wireframe used. */
const LDR_SCENES = [
  ['Handing over a project that was going wrong','Delegation','minute 14','1:12'],
  ['Holding a line under pressure from a peer','Composure','minute 22','0:48'],
  ['Explaining a decision they later regretted','Decisiveness','minute 31','1:35'],
  ['Coaching a struggling team member','Coaching','minute 38','1:04'],
  ['Naming a problem before it became visible','Directness','minute 44','0:52'],
  ['Re-planning the week after a setback','Composure','minute 51','1:18']
];

V.leadMember = () => {
  const c = lco();
  const m = lmemOf(c, S.ldrMem);
  const d = m.pc - lpace(c);
  const done = lchDone(m);
  const notes = lnotes(m.name);
  const first = m.name.split(' ')[0];
  const [tk,tl] = ltask(m,c);

  /* Three scenes, chosen by the name so they are stable, in the wireframe's
     own arithmetic. */
  let seed = 0; for(let i = 0; i < m.name.length; i++) seed += m.name.charCodeAt(i);
  const pick = [seed % 6, (seed + 2) % 6, (seed + 4) % 6];

  return `<main class="main"><div class="page">
  ${crumb(['Cohorts','leadCohorts'],[lname(c),'leadCohort'], m.name)}
  ${/* THE HEADER TAKES NO ACTION, and the two actions sit together instead.
        "Add a note" was in `ph()`'s action slot, hard right of the h1, while
        "Message" sat in the identity row 80px below it — two things you can do
        about one person, drawn as far apart as the page allows, and the one in
        the header was the loudest object above the fold on a page whose subject
        is a record. They are one group: the person, then what you can do about
        them, in the row that names them. Same argument the interviews page
        makes for emptying its own header slot (views.js `V.interviews`). */''}
  ${ph(m.name, `${lname(c)} &middot; ${llevel(c)} &middot; week ${c.week} &middot; last active ${m.last.toLowerCase()}`)}
  <div class="sec">
    <div class="idhead">
      <span class="av-ph" style="width:72px;height:72px"><i>${m.ini}</i><img src="${AV[m.img]}" alt=""></span>
      <div class="idhead-b">
        <span class="idname">${m.name}</span>
        <span class="idmeta">${llevel(c)} &middot; ${lname(c)}</span>
        ${m.flag ? lflagTag(m.flag) : '<span class="tag green sm">On track</span>'}
      </div>
      ${/* MESSAGE FIRST, NOTE SECOND. A message goes TO them and a note is
            for the leader's own record, so the outward-facing one leads; and
            the note keeps the pencil it carried in the header. Both are
            `.btn-g` — neither is the page's primary action, the record is. */''}
      ${''/* THEY ARE CHIPS NOW, AND THE MARK LEADS (Maryam, 2 Sep 2026: "i
             need message and notes icons to be on the left side of the texts",
             "the message and notes should be chips, notes should yellow text
             and light bg, message should be blue text and light blue bg").
             `.btn-g` put the glyph after the label — §02's own order for a
             button, where the trailing mark is the direction of travel. A chip
             is a label, so its mark leads the words the way `.flag-t`'s does.
             THE TWO HUES SAY WHICH DIRECTION EACH ONE FACES. Blue is this
             build's "information / goes somewhere" ink (§12) and the message
             leaves the page; yellow is the note, which stays. Neither is the
             accent, because neither is the page's primary action — the record
             is, which is what `.btn-g` was saying in a different way. */}
      <div class="idhead-a">
        <button class="ldr-chip chip-msg" data-go="leadMessages">${I.chat} Message</button>
        <button class="ldr-chip chip-note" data-ldrnote="${m.name}">${I.edit} Add a note</button>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="stats">
      ${statCell(I.growth, 'Progress',   m.pc + '<small>%</small>', `${d >= 0 ? '+' + d : d} against pace`)}
      ${statCell(I.chart,  'Assessment', m.avg ? m.avg + '<small>%</small>' : '<small>Not yet</small>', m.avg ? (m.avg < 75 ? 'below the 75% pass mark' : 'above the pass mark') : 'nothing assessed yet')}
      ${statCell(I.renew,  'Attempts',   m.att ? m.att.toFixed(1) : '<small>&mdash;</small>', m.att >= 2 ? 'going round twice' : 'first time through')}
      ${statCell(I.time,   'Time on the course', lhrs(lmins(m)), done ? Math.round(lmins(m)/done) + ' min a chapter' : 'not started')}
    </div>
  </div>
  ${''/* PROGRESS BY CHAPTER IS THE CANDIDATE'S OWN LIST (Maryam, 2 Sep 2026,
         with a screenshot of it: "use that ui but the heading should be
         Progress by Chapter and show chapters like the candidate with the show
         all button at bottom"). It replaces a five-column `.tbl` — #, chapter,
         status, score, attempts — which said the same four things in a shape
         built for scanning twenty-eight rows rather than reading thirteen.
         `ldrChRow` IS `chRow`'S MARKUP WITH THE LEADER'S DATA, not a call to it.
         Every class is §15's (`.ch`, `.ch-num`, `.ch-b`, `.ch-n`, `.ch-tick`,
         `.ch-m`, `.ch-ic`) so the two portals draw one component, and three
         things could not cross: `chRow` reads `SCORE`, `GROWTH` and
         `OPEN_DATES`, which are the SIGNED-IN candidate's own; and it stamps
         `data-go="chapter:i"`, which from here would open the leader inside
         somebody else's chapter player.
         THE TRAIL IS EMPTY ON A FINISHED CHAPTER, WHICH IS THE ONE VISIBLE
         DIFFERENCE. The candidate's row ends in "Restart" — an action on their
         own course. A leader cannot restart anybody's chapter, and §60's rule
         is that a dead control on a live surface is worse than a missing one,
         so the slot carries the state mark and nothing else.
         `S.ldrChAll` IS ITS OWN KEY, not the candidate's `S.chAll`. §65 records
         why: one boolean for two surfaces holds the first one's value the
         moment they can both be open, and these two can — the portal switch
         does not reset either. */}
  <div class="sec tint">
    <div class="sec-h"><h2>Progress by Chapter</h2><span class="t-helper-01">From the course platform</span></div>
    ${done ? `<div class="tile-stack">
      ${(S.ldrChAll ? CH : CH.slice(0,5)).map((_,i) => ldrChRow(i, m, done)).join('')}
    </div>
    <div class="mt4"><button class="btn btn-g" data-ldrchall="1">${S.ldrChAll ? `Show the first five ${I.chevUp}` : `Show all 13 ${I.chevDown}`}</button></div>`
    : `<div class="empty" style="border:0">${I.book}
      <h3>Nothing on the record</h3>
      <p>${first} has not opened a chapter, so the course platform has sent nothing back. The record fills in the moment they start.</p>
    </div>`}
  </div>
  ${''/* "THEIR LEVEL" AND "ATTENDANCE AND THIS WEEK" ARE BOTH DELETED (Maryam,
         2 Sep 2026). What each was and what is left of it:
         THEIR LEVEL was a four-row `.kv` — quiz band, proposed at interview,
         signed by their agent, next level — under a sentence explaining that
         the level is the talent agent's decision and not the leader's. That
         sentence is the part worth not losing, and it is not lost: `V.leadSum`
         makes the same point where it matters, on the page where the leader
         signs something. The four rows were a record of a decision taken in
         another portal, on a page about how this person is doing this week.
         ATTENDANCE AND THIS WEEK was four `.facts` cells, and three of the four
         were DERIVED FROM THE FLAG rather than reported: "calls attended"
         subtracted 3 from the week if the candidate was flagged and 1 if they
         were not, and "passed first time" subtracted 1 if their attempts
         average was over 1. Nothing in this build holds per-candidate
         attendance (`LEAD_RUN` counts seats per CALL), so those two figures
         were arithmetic dressed as data — the invented figures §74 rules out —
         and deleting the section is the honest way to stop printing them. The
         fourth, "last active", is in the `ph()` line and on the flag chip. */}
  ${ldrNotesSec(m)}
  <div class="sec tint">
    ${''/* THE HEADING STANDS ALONE (Maryam, 2 Sep 2026: "remove the top right
           The three Maryam chose to show text ... remove the bottom These are
           the clips ... text as well").
           BOTH LINES SAID THE SAME THING, ONE ABOVE THE ROW AND ONE BELOW IT:
           the helper said the candidate chose these three, the paragraph said it
           again at length and added the privacy rule. Three stills under a
           heading that names them do not need a caption saying there are three.
           THE PRIVACY FACT IS NOT LOST — it is on `V.leadProfile`'s data-use row
           and in the Data use notice, which is where a rule about what a leader
           may see belongs; a caption under one row of clips is a bad place for a
           policy, and lead.js's own note cites the sentence rather than this
           element. */}
    <div class="sec-h"><h2>Interview scenes</h2></div>
    ${''/* THE SCENES ARE THE CANDIDATE PORTAL'S CARDS (Maryam, 2 Sep 2026:
           "Interview scenes section should be from the candidate portal, the
           three scene row should be added here"). They were `.clip` rows — a
           40px thumbnail, a title and a caption, stacked — and the candidate
           sees the same three moments as three stills across a row. One
           component, both portals, which is the rule `lcTitle` and `bkStamp`
           already hold this side to.
           THE STILL IS THE CANDIDATE'S OWN PHOTOGRAPH, which is the one place
           this improves on the original: `sceneCard` hardcodes `AV.hana`
           because the candidate portal has exactly one signed-in face, and
           here the row is about whichever of the 28 you opened. */}
    <div class="scene-row">
      ${pick.map((i,n) => ldrSceneCard(LDR_SCENES[i], m, i)).join('')}
    </div>
  </div>
</div></main>`;
};

/* ==========================================================================
   COURSE REPORTS

   THE SAME NUMBERS AS THE ROSTER, ASKED FROM THE OTHER END. The roster
   answers "how is this cohort doing"; this page answers "who across all
   three has stopped". So it is one list of twenty-eight, filtered, rather
   than three rosters — and the filter is the cohort, which is what the
   wireframe's `.rep-tabs` did.

   THE FILTER IS `.cs`, THE PRODUCT'S OWN SEGMENTED CONTROL, and it re-renders
   rather than hiding rows: unlike the dashboard's attention queue there is no
   text field here to lose the caret out of, and a filter that re-renders can
   change the figure band above it as well as the rows below it. Which it
   does — the four figures are of the SELECTION, or a leader reading "3 behind
   pace" under a cohort tab would be reading a number about all three.
   ========================================================================== */
/* ==========================================================================
   THE ONE CANDIDATE WHO NEEDS THE LEADER — `ldrAttention`, a `.dark-card`
   Maryam, 2 Sep 2026: "add a black card on the screens after the tabs row,
   this black card will show the candidate who has been inactive for more then
   7 days or are not performing any assessment or not taking cohort calls, this
   black card will have the profile image and info of the candidate with its
   progress, the flag, last activity, and at the bottom right a text with icon
   of Contact Candidate."

   IT IS ONE PERSON, WHICH IS WHAT MAKES IT A BLACK CARD. §75's rule is that
   the card is "the one thing the page is about", and the standing instruction
   is that asking for one is asking for the whole recipe. A queue of everybody
   flagged is a different object and this page already draws it — the table
   under this card is every candidate in the cohort, sorted worst first. So the
   card takes the top of that sort and states it as a person rather than a row.

   THE TEST IS `lflag`, NOT A SECOND ONE WRITTEN HERE. That function already
   encodes the ask almost word for word — `Never signed in`, `Inactive N days`
   at seven days or more, `Struggling` for attempts over 2.0 with an average
   under the pass mark — and it is DERIVED, so the card clears itself when the
   candidate comes back. Writing the three conditions again here would be the
   drift `bkStamp` exists to prevent, one portal over.
   THE THIRD CONDITION IS THE ONE THIS BUILD CANNOT ANSWER, and it is flagged
   rather than faked: nothing holds per-candidate call attendance. `m.att` is
   attempts per chapter (the reports table prints it under "Attempts"), and the
   only attendance figure in the product is `LEAD_RUN`'s per-CALL seat count.
   A cohort-call absence flag needs a field on `lmem` first.

   THE ORDER IS THE DASHBOARD QUEUE'S: severity first, then the longest silence,
   then the widest gap to pace. Same reading, so the person on this card cannot
   disagree with the person at the top of the dashboard's own queue for the same
   cohort.

   NOTHING ON IT IS TINTED, AND THAT IS §77'S RULE RATHER THAN AN OMISSION. The
   flag would carry `--danger-ink` on a white page; on black that red is 3.7:1
   and the two support inks are tuned for paper. §77 settled this for the
   countdown that used to be violet: "§59's answer to urgency IS the card". The
   ground is the alarm, so the chip and the ring are `--on-dark` and no new
   on-dark hue had to be minted.

   THE ACTION IS THE DASHBOARD'S — `data-ldrdm` opens a thread with that person
   by name (lead4's listener sets the tab, the thread and, below 900, the open
   state). "Contact Candidate" rather than the queue's "Contact" because here it
   is the card's only control and has the width for the noun.
   ========================================================================== */
const ldrAtt = rows => {
  const rank = x => x.m.flag ? (x.m.flag.k === 'bad' ? 0 : 1) : 2;
  const idle = m => /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1]
             : m.last === 'Never' ? 99 : 0;
  return rows.filter(x => x.m.flag).slice().sort((a,b) =>
    rank(a) - rank(b)
    || idle(b.m) - idle(a.m)
    || (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c)))[0];
};

const ldrAttention = x => {
  if(!x) return '';
  const m = x.m, c = x.c;
  const last = m.last === 'Never' ? 'Never signed in' : 'Last active ' + m.last.toLowerCase();
  return `${''/* THE CLASS GOES ON THE `.sec`, NOT ON A DIV INSIDE IT. §75 is
                written `.app .sec.dark-card` — the ground, the haze, the 32px
                frame and the `--pad-x` inset are the SECTION's, and the layer's
                seam rules turn that section's own `::after` off. Wrapped in a
                plain `.sec` the card matched nothing and rendered as a
                transparent block with white ink on white paper: every rule
                missing at once, and no warning. This is the whole of what
                "convert a section to a black card" means literally. */}
  <div class="sec dark-card att">
      ${''/* THE ACTION IS IN THE HEADING ROW (Maryam, 2 Sep 2026: "take the
             contact candidate button to the top right of the card aligned with
             the heading"), which is `.dc-act` — the slot §75 documents on
             `.dc-hd-r` and `talRec` already uses for "View all agents". It is
             the same button with the same handler; what changes is that §75
             gives it the row's baseline, the auto margin and the borderless
             white ink for free, so the card's own footer row is deleted rather
             than restyled.
             THE SLOT IS ONE-OR-THE-OTHER: `.dc-act` (a control) or `.dc-when`
             (a time). Both carry `margin-left:auto`, so a card wanting both
             needs a group rather than a second auto margin — §77's note. */}
      <div class="dc-hd"><div class="dc-hd-r"><h2 class="dc-t">Needs your attention</h2>
        <button class="btn btn-s btn-sm noic dc-act" data-ldrdm="${m.name}">${I.chat} Contact Candidate</button>
      </div></div>
      <div class="att-b">
        <span class="att-av">${avatar({i:m.ini, img:AV[m.img]}, 56)}</span>
        <span class="att-who">
          <span class="ttl">${m.name}</span>
          <span class="sub">${lname(c)} &middot; ${llevel(c)} &middot; week ${c.week} of 13</span>
          <span class="att-fl">
            <span class="flag-t">${I[m.flag.ic]}${m.flag.t}</span>
            <span class="sub">${last}</span>
          </span>
        </span>
        <span class="att-ring">${ring(m.pc, `${m.pc}% of ${lpace(c)}% expected`)}</span>
      </div>
  </div>`;
};

V.leadReports = () => {
  const sel = S.ldrRep;
  const all = lmembers();
  const rows = all.filter(x => x.c.id === +sel);
  const behind = rows.filter(x => x.m.pc - lpace(x.c) <= -5);
  const weak = rows.filter(x => x.m.avg > 0 && x.m.avg < 75);
  const never = rows.filter(x => x.m.last === 'Never');
  const avg = rows.length ? Math.round(rows.reduce((s,x) => s + x.m.pc, 0) / rows.length) : 0;

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Course Reports')}
  ${''/* Shortened, not dropped: WHERE this data comes from is the one fact
        about this page that is not visible on it, and the `.note` below makes
        the argument at length. Tal now opens on the finding instead of on a
        description of the sort order. */}
  ${ph('Course Reports','From the course platform &middot; chapters, scores, attempts, attendance')}
  ${''/* THE STRIP IS THE RECORD AND NOTHING ELSE (Maryam, 2 Sep 2026: "remove
         all cohorts tab just show the other three"). "All cohorts" was the
         first tab and the default, and it was the one tab that was not a
         cohort: 28 candidates from three courses at three different weeks, sorted
         into one list by a gap to a pace that means something different in each
         of them. The four figures above it read "across all three cohorts" for
         the same reason and were the same average of three unlike things.
         WHAT IT COSTS, STATED RATHER THAN HIDDEN: there is no longer one list
         of everybody on this page. The dashboard's Attention Required queue is
         the cross-cohort view — it is the only reading of all 28 that is a
         comparison of like with like ("who has stopped"), and it is already
         drawn. `lmembers()` keeps two readers here, the strip's own counts and
         the figure band's denominators. */}
  <div class="sec sec-cs">
    <div class="cs">
      ${LEAD_COHORTS.map(c => `<button class="${sel === String(c.id) ? 'on' : ''}" data-ldrrep="${c.id}">${lname(c)}<span class="lf-n">${c.members.length}</span></button>`).join('')}
    </div>
  </div>
  ${ldrAttention(ldrAtt(rows))}
  ${''/* THE FIGURE BAND PAYS A HALF FRAME (Maryam, 2 Sep 2026: "reduce the
         space above and below the 4 cards row"). `.sec-band` is the marker and
         §92.7 is the rule; §10's own `--s06` is what it steps down from, so the
         page's other sections keep the 48px rhythm the 1 Sep instruction set.
         It is a marker class rather than a `:has(> .stats)` selector for §55's
         reason: whether a band is tight is an editorial call about one page,
         and every other `.stats` in both portals wants the standard frame. */}
  <div class="sec sec-band">
    <div class="stats">
      ${statCell(I.growth, 'Average progress', avg + '<small>%</small>', 'in this cohort')}
      ${statCell(I.warningAlt, 'Behind pace', behind.length, 'five points or more')}
      ${statCell(I.chart, 'Below pass mark', weak.length, 'assessments under 75%')}
      ${statCell(I.misuse, 'Never signed in', never.length, never.length ? 'no activity at all' : 'everyone has started')}
    </div>
  </div>
  ${''/* THE TABLE IS WHITE AND HAS NOTHING DRAWN ABOVE IT — Maryam, 31 Aug 2026:
        "remove the grey bg color of the 4 tables against all 4 tabs. also remove
        the top border of the table that is dividing it from the upper blocks.
        also remove the 'Ordered by the gap to expected pace' text."

        ONE SECTION, FOUR STATES. "The 4 tables" are this block under each of the
        four tabs — the filter re-renders rather than hiding rows (the note at
        the head of this view is the argument), so there is one place to change
        and the change lands on all four by construction.

        `.sec-rep` IS A NAME, NOT A STYLE. With `tint` gone the grey goes, and
        the hairline above it is then the only thing left dividing the table from
        the figure band — which is what the second half of the instruction takes
        off. That line belongs to the section ABOVE (§18.129), and at desktop it
        is drawn by §14's (0,12,0) re-enabler, which per trap 4 can only be
        answered from inside its own `:not()` list. So the section says what it
        IS and two rules name it: §14's list and §84's phone tier. The marker
        idiom is §20's own — `.sec-cs`, `.sec-out`, `.cap-sec`, `.lead-bar`.

        THE SORT ORDER IS NO LONGER STATED IN WORDS, and that is the third half
        of the instruction. It was already the weakest line on the page: the
        `.tag` on every row ("32 behind") states the gap this is sorted by, the
        first row IS the worst, and the sentence under the table names them. Tal
        says the same thing at the top — the note above `ph()` in this view
        records the earlier round of exactly this subtraction. */}
  ${''/* IT IS DRAWN LIKE THE DASHBOARD'S ATTENTION QUEUE (Maryam, 2 Sep 2026:
         "i want this tab structure to be like the Attention Required section
         table on the dashboard, the spacing, colors, implementation should be
         like that"), and the implementation is the same CLASS rather than the
         same rules written twice. `.tbl-flag` carries five decisions §31 made
         for that queue on 1 Sep — no rule between rows, one light-grey rule
         under the heads instead of §10's `#111`, the first row standing 24px
         off it, cells centred rather than top-aligned, and the rounded flag
         chip — and every one of them is about a SHORT table of people rather
         than about flags. So the class now has two writers and §31's note says
         so; nothing about the queue moved.
         `.ldr-tbl` STAYS ON IT: that class carries §36's own four rules (the
         row cursor, the chevron cell, the focus ring) which this table needs
         and the dashboard's queue does not have, because its rows are not
         links. The two classes answer two different questions. */}
  <div class="sec sec-rep">
    <div class="sec-h"><h2>Candidate Progress</h2></div>
    <div class="tbl-wrap">
      <table class="tbl ldr-tbl tbl-flag">
        <tr><th>Candidate</th><th class="num">Chapters</th>
            <th class="num">Assessment</th><th class="num">Attempts</th><th class="num">Time</th><th>Last active</th><th></th></tr>
        ${rows.slice().sort((a,b) => (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c))).map(x => {
          const m = x.m;
          return `<tr class="ldr-tr${m.flag ? (m.flag.k === 'bad' ? ' sev' : ' mod') : ''}" data-ldrco="${x.c.id}" data-ldrmem="${m.name}" data-go="leadMember" tabindex="0" role="button">
            ${/* A FACE IN THE FIRST CELL, the same argument `faceRow` makes in
                  lead.js: every row on this portal is a PERSON, and twenty-eight
                  rows of name-and-figures is the page where that is hardest to
                  hold. The mark is `mem-av mem-ph` at 24px — the roster's own
                  slot, one step down for a table row — so the reports table and
                  the roster draw the same candidate the same way. */''}
            ${/* THE "n BEHIND" CHIP IS GONE (Maryam, 2 Sep 2026: "i do not know
                  what does the 29 behind tag means, if it is stupid then remove
                  these tags"). It was the gap in PERCENTAGE POINTS between a
                  candidate's chapter progress and the pace expected on the day
                  — so "29 behind" was 9% against 38% — and a figure that has to
                  be explained on a row that also prints "1 of 13" is a figure
                  the row does not need. Nothing is lost: the table is SORTED by
                  that gap so the worst is still the first row, the figure band
                  above counts everyone five points or more back, and the line
                  under the table names the furthest behind and states both
                  numbers in full. `d` goes with it. */''}
            <td><span class="ldr-who">
              <span class="mem-av mem-ph">${avatar({i:m.ini, img:AV[m.img]}, 24)}</span>
              <span class="ldr-who-n">${m.name}</span>
            </span></td>
            <td class="num">${lchDone(m)} <span class="t-helper-01">of 13</span></td>
            <td class="num">${m.avg ? `${m.avg}%` : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="num">${m.att ? m.att.toFixed(1) : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="num">${lmins(m) ? lhrs(lmins(m)) : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td>${m.last.toLowerCase()}</td>
            ${''/* THE LAST CELL IS A NAMED LINK, NOT A CHEVRON (Maryam, 2 Sep
                  2026: "instead of a chevron at the end we should have View
                  Progress blue text with a blue arrow next to it"). The chevron
                  said "this row opens" and left what it opens to be guessed;
                  the words say it. It is NOT a `<button>` — the whole row is
                  the target (`role=button`, `tabindex=0`, `data-go`), and a
                  control inside a control is two targets for one action. The
                  arrow is `I.arrowRight` rather than §64's `mask-image`, which
                  only reaches a `.btn`. */}
            <td class="ldr-go"><span class="ldr-view">View Progress ${I.arrowRight}</span></td>
          </tr>`;
        }).join('')}
      </table>
    </div>
    ${''/* THE CLOSING LINE IS GONE (Maryam, 2 Sep 2026: "remove the bottom
           text Yuki Tanaka is furthest behind — 9% against 38% expected in
           cohort 41"). It named the worst candidate and printed the gap, and
           by the time it was written the page said that twice above it: Tal's
           summary at the head names the same person and the same figure, and
           the black card 200px below the tabs draws them with their photograph
           on it. The table is sorted worst first, so the first row is the third
           statement of it. `worst` goes with the line rather than being left
           computed and unread. */}
  </div>
  ${''/* "ACTIVITY, NOT QUALITY" IS DELETED (Maryam, 2 Sep 2026: "remove the
         bottom Activity, not quality section"). It was a `.note` closing the
         page: chapters, scores, attempts and timing are all the course platform
         can report, and none of them says how well somebody is THINKING.
         THE ARGUMENT IS KEPT BECAUSE IT IS STILL TRUE AND IS STILL SAID — the
         `ph()` line at the head of this page names the source in the same
         breath as the columns ("From the course platform · chapters, scores,
         attempts, attendance"), which is the fact the note existed to carry.
         What the note added on top of that was a caution about what the numbers
         do not mean, at the foot of a page nobody scrolls to twice. If it comes
         back it belongs beside the figures, not under them. */}
</div></main>`;
};

/* ==========================================================================
   THE BRIEF, AND THE NOTE — TWO SHEETS

   Both are `.modal > .sheet`, the component the candidate portal uses for
   editing details and adding a card. A brief is READ and dismissed, a note is
   WRITTEN and saved, and the sheet holds both because both are one task begun
   and finished without leaving the page underneath.

   THEY ARE MOUNTED BY A PASS, NOT BY THE VIEW. `render()` in views.js mounts
   its sheets itself, keyed on `S.view` — a line this file cannot add to
   without editing views.js. So the wrapper at the foot appends them to `.app`
   after the base render, which is what `placeBand` and `placeDark` do for the
   head band and the dark plate. `.modal` is `position:absolute;inset:0`, so
   `.app` is the element it has to be inside to cover the frame.
   ========================================================================== */
function ldrBriefSheet(){
  const c = S.ldrBrief ? lcoOf(S.ldrBrief) : null;
  if(!c) return `<div class="modal" data-ldrclose="brief"></div>`;
  const att = c.members.filter(m => m.flag);
  const severe = att.filter(m => m.flag.k === 'bad');
  const weakest = c.members.filter(m => m.avg > 0).slice().sort((a,b) => a.avg - b.avg)[0];
  const chapter = CH[Math.min(12, c.week - 1)];
  const behind = c.members.filter(m => m.pc < lpace(c) - 5).length;

  return `<div class="modal on" data-ldrclose="brief">
    <div class="sheet">
      <div class="sheet-h"><h2>Week ${c.week} brief</h2>
        <button class="x" data-ldrclose="brief" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="ai-aura tile mb6">
          <div class="ai-head">${talLabel()}<h3>Run the call like this</h3></div>
          <div class="ai-body"><p>${lname(c)} is ${lpaceGap(c) >= 0 ? 'on pace' : Math.abs(lpaceGap(c)) + ' points behind'} at week ${c.week} of 13, and this is drawn from where they actually are rather than from the syllabus.</p></div>
        </div>
        <ol class="steps mb6">
          <li><span class="s-n">1</span><span class="s-b"><b>Open on ${chapter[0]}</b>
            It is this week's chapter and the one carrying the cohort's lowest scores${weakest ? ` &mdash; ${weakest.name.split(' ')[0]} is at ${weakest.avg}%` : ''}.</span></li>
          <li><span class="s-n">2</span><span class="s-b"><b>Skip what is already landing</b>
            Anything with near-universal completion and scores above 85% does not need the hour. ${lavg(c,'avg')}% is the cohort average.</span></li>
          <li><span class="s-n">3</span><span class="s-b"><b>Ask for a real example, not a hypothetical</b>
            ${behind} of ${c.members.length} are behind pace, which is usually time rather than comprehension. A concrete example from their own week gets further than more material.</span></li>
          <li><span class="s-n">4</span><span class="s-b"><b>Raise ${severe.length ? 'the ' + severe.length + ' at risk privately' : 'nothing privately this week'}</b>
            ${severe.length ? 'Never in the group. ' + severe.slice(0,2).map(m => m.name).join(' and ') + (severe.length > 2 ? ' and others' : '') + '.' : 'Nobody in this cohort is flagged severely.'}</span></li>
        </ol>
        ${/* `.kv` ROWS, NOT A `.facts` BAND. `.facts` is an auto-fit grid sized
              for a page; inside a 520px sheet it fits three across and the
              fourth cell lands alone on a second row, where §10 stretches it
              the full width with its own fill. Four rows in a tile are four
              rows at any width, which is what a sheet needs. */''}
        <div class="tile mb6">
          <div class="kv"><span class="k">Average progress</span><span class="v">${lavg(c,'pc')}%</span></div>
          <div class="kv"><span class="k">Expected by now</span><span class="v n">${lpace(c)}%</span></div>
          <div class="kv"><span class="k">Assessment average</span><span class="v n">${lassess(c) ? lassess(c) + '%' : 'nothing assessed yet'}</span></div>
          <div class="kv"><span class="k">Behind pace</span><span class="v n">${behind} of ${c.members.length}</span></div>
        </div>
        ${att.length ? `<h3 class="ldr-sh">Bring these ${att.length} up privately</h3>
        <div class="tile-stack">
          ${att.slice(0,4).map(m => `<div class="cardrow">
            <span class="mem-av mem-ph">${avatar({i:m.ini, img:AV[m.img]}, 36)}</span>
            <span class="cardrow-b">
              <span class="cardrow-t">${m.name} ${lflagTag(m.flag)}</span>
              <span class="cardrow-d">${m.pc}% at day ${c.day} &middot; last active ${m.last.toLowerCase()}</span>
            </span>
          </div>`).join('')}
        </div>` : ''}
        <p class="t-helper-01 mt5">Everything above is computed from course activity &mdash; progress, scores, attempts and timing. Nothing in it reads their written answers, so it cannot tell you how well they are thinking.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-ldrclose="brief">Close</button>
        <button class="btn btn-p noic" data-ldrclose="brief">Print for the call</button>
      </div>
    </div>
  </div>`;
}

/* `ldrNoteSheet` IS DELETED (2 Sep 2026). Adding a note was a `.modal >
   .sheet` — scrim, heading, one textarea, a legal line and two feet — and the
   composer is inline in the panel now, where the rows are. The argument that
   put it in a sheet is in `LDR_SHEETS`'s own note ("one task begun and finished
   without leaving the page underneath"), and it still holds for the BRIEF,
   which is a document you read. A note is a row you write. */
const LDR_SHEETS = [ldrBriefSheet];

function placeLdrSheets(){
  const app = device.querySelector('.app');
  if(!app) return;
  let host = app.querySelector(':scope > .ldr-sheets');
  /* Only the leader portal has these, and the host is removed rather than
     emptied on the candidate side so nothing of this file is in the DOM of a
     portal it has no business in. */
  if(!isLead()){ if(host) host.remove(); return; }
  if(!host){
    host = document.createElement('div');
    host.className = 'ldr-sheets';
    app.appendChild(host);
  }
  host.innerHTML = LDR_SHEETS.map(f => { try { return f(); } catch(e){ return ''; } }).join('');
}

/* ==========================================================================
   THE LISTENERS

   NAVIGATION WITH A PARAMETER, WITHOUT TOUCHING `go()`.
   A row that opens a roster has to say two things: which cohort, and that a
   cohort page is where you are going. The candidate side solves this by
   putting the parameter in the target — `data-go="agent:priya"` — and giving
   `go()` a branch that splits on the colon. That branch is in views.js, and
   the wireframe's own version of this file records what splitting on a colon
   costs once a value can contain one: `data-ag="member:41:Maryam Naz"` had to
   be reassembled by the handler.

   So the parameter travels in its OWN attribute and the target stays a plain
   view name. This listener is registered in the CAPTURE phase, so it sets
   `S.ldrCo` and `S.ldrMem` on the way down and views.js's own bubble-phase
   `[data-go]` branch does the navigating on the way up with the state already
   correct. No copy of `go()`, no parsing, and a candidate called
   "Jean-Luc: Picard" would still work.
   ========================================================================== */
device.addEventListener('click', e => {
  const co = e.target.closest('[data-ldrco]');
  if(co) S.ldrCo = +co.dataset.ldrco;
  const mem = e.target.closest('[data-ldrmem]');
  if(mem) S.ldrMem = mem.dataset.ldrmem;
}, true);

/* A TABLE ROW IS A BUTTON, so it answers the keyboard like one. `role=button`
   and `tabindex=0` are on the row in the markup; Enter and Space have to be
   wired by hand, because a `tr` is not a `button` however it is labelled. */
device.addEventListener('keydown', e => {
  if(e.key !== 'Enter' && e.key !== ' ') return;
  const row = e.target.closest && e.target.closest('tr.ldr-tr[data-go]');
  if(!row) return;
  e.preventDefault();
  row.click();
});

/* `ldrNoteFilter` AND ITS TWO LISTENERS ARE DELETED (2 Sep 2026) with the
   toolbar they served — the search field, the type select and the count line.
   The technique is worth not re-deriving and lead.js already keeps it written
   down for the next control typed into on a leader page: filter the DOM and do
   NOT re-render, because `render()` replaces `device.innerHTML` and takes the
   caret with it. The notes panel had it; the notes panel no longer has a field.
   `S.ldrNoteF` goes too. `S.ldrNoteK` stays and keeps its own listener below —
   it is the composer's remembered type, which is a different thing from a
   filter: open the composer twice and it offers the kind you chose last. */
device.addEventListener('change', e => { if(e.target.id === 'ldrNoteK') S.ldrNoteK = e.target.value; });
device.addEventListener('click', e => {
  /* the cohort filter on Course Reports */
  const rep = e.target.closest('[data-ldrrep]');
  if(rep){ S.ldrRep = rep.dataset.ldrrep; render(); return; }

  /* the cohort page's three tabs */
  const ctb = e.target.closest('[data-ldrctab]');
  if(ctb){ S.ldrCTab = ctb.dataset.ldrctab; render(); return; }

  /* the member page's chapter list, five rows or thirteen */
  if(e.target.closest('[data-ldrchall]')){ S.ldrChAll = !S.ldrChAll; render(); return; }

  /* the brief */
  const br = e.target.closest('[data-ldrbrief]');
  if(br){ S.ldrBrief = +br.dataset.ldrbrief; render(); return; }

  /* A NOTE: OPEN, EDIT, CANCEL, SAVE, DELETE. All five read the fields BEFORE
     the render that closes the composer, because that render replaces them —
     the same order the sheet needed and the reason `render()` is always last. */
  const nt = e.target.closest('[data-ldrnote]');
  if(nt){ S.ldrNoteAt = -1; S.ldrNoteK = 'general'; render(); return; }

  const ed = e.target.closest('[data-ldrnoteedit]');
  if(ed){
    const raw = ed.dataset.ldrnoteedit, cut = raw.lastIndexOf(':');
    S.ldrNoteAt = +raw.slice(cut + 1);
    render();
    return;
  }

  if(e.target.closest('[data-ldrnotecancel]')){ S.ldrNoteAt = null; render(); return; }

  const sv = e.target.closest('[data-ldrnotesave]');
  if(sv){
    const name = sv.dataset.ldrnotesave;
    const tt = device.querySelector('#ldrNoteT'), bb = device.querySelector('#ldrNoteB');
    const kk = device.querySelector('#ldrNoteK');
    const t = tt ? tt.value.trim() : '', b = bb ? bb.value.trim() : '';
    /* A TITLE IS THE ONE REQUIRED FIELD, because it is the row. An empty body
       draws a two-line row rather than a broken one, which is why `.note-x` is
       conditional in the markup. */
    if(!t){ if(tt) tt.focus(); return; }
    const k = kk ? kk.value : 'general';
    S.ldrNotes[name] = S.ldrNotes[name] || [];
    if(S.ldrNoteAt >= 0) S.ldrNotes[name][S.ldrNoteAt] = {k, t, b, w:S.ldrNotes[name][S.ldrNoteAt].w};
    else S.ldrNotes[name].unshift({k, t, b, w:'Just now'});
    S.ldrNoteAt = null;
    render();
    return;
  }

  const del = e.target.closest('[data-ldrnotedel]');
  if(del){
    /* `name:index`, split from the RIGHT: the index is the last field and a
       name may contain anything at all, including a colon. */
    const raw = del.dataset.ldrnotedel;
    const cut = raw.lastIndexOf(':');
    const name = raw.slice(0, cut), i = +raw.slice(cut + 1);
    if(S.ldrNotes[name]) S.ldrNotes[name].splice(i, 1);
    render();
    return;
  }

  /* closing a sheet: the scrim, the x, and both feet */
  const cl = e.target.closest('[data-ldrclose]');
  if(cl){
    /* the scrim carries the attribute AND so does the sheet's own x, so a
       click inside the sheet body must not close it — only the element that
       actually carries the attribute counts as the target. */
    if(cl.classList.contains('modal') && e.target !== cl) return;
    if(cl.dataset.ldrclose === 'brief') S.ldrBrief = null;
    if(cl.dataset.ldrclose === 'note') S.ldrNote = null;
    render();
    return;
  }
});

/* ==========================================================================
   AND THE PAGE IS DRAWN AGAIN, WITH THIS FILE'S SHEETS ON IT
   The boot render is the last statement in views.js and every pass since has
   re-rendered at its own foot for the same reason: the paint on screen when
   this file is parsed was made without it. `placeLdrSheets` is a DOM pass, so
   it has to run after the base render rather than inside a view.
   ========================================================================== */
const _baseLdr = render;
render = function(){
  _baseLdr();
  try { placeLdrSheets(); } catch(e){ console.warn('ldr sheets', e); }
};

render();
