#!/usr/bin/env python3
"""
Extract the TalentNext design system out of the hi-fi portal's build layers.

WHY THIS IS AN EXTRACTION AND NOT A REWRITE
The portal's look is not a set of values you can restate — it is 38 CSS layers
in which later layers correct earlier ones by name, and the cascade order IS
the architecture (see hifi/build/build.py, and CLAUDE.md's traps 3 and 4). A
hand-written "design system" that re-declared the tokens and re-drew the
buttons would look right for a week and then drift, because the corrections
that make the real thing sit correctly at 900px live in §10, §14, §18, §20,
§29 and §37 — not in §01 and §02.

So this script walks THE SAME LAYERS IN THE SAME ORDER as build.py, and keeps
the rules that belong to the shared vocabulary while dropping the rules that
belong to one product surface. Every rule in the output is a real rule from
the real portal, in its real cascade position. Nothing here is re-typed.

HOW A RULE IS CLASSIFIED
By its selector's class names, against the two sets below. A selector survives
only if EVERY class in it is in SYSTEM — so `.app .sec .tile` is kept and
`.app .lvl-hero .tile` is dropped, which is what makes the output the shared
part rather than a sample of the whole.

One refinement, and it is load-bearing: inside `:not()` / `:is()` / `:where()`
the argument list is FILTERED rather than judged. §20's desktop rule carries a
13-class `:not()` exclusion list, some of it product classes; judging the whole
selector would drop the rule that decides which sections join, and losing it
would silently re-join every pair. Filtering the list keeps the rule and keeps
it honest.

Run:  python3 build-ds.py
"""
import base64
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).parent
SRC = HERE.parent / 'hifi' / 'build'

# The layer order is build.py's, verbatim. It is not alphabetical by accident
# and it must not be sorted: `05` unsets what `02` sets, `37` corrects `26`.
LAYERS = [
    '01-foundation.css', '02-components.css', '03-product.css', '04-fixes.css',
    '05-refine.css', '06-polish.css', '07-final.css', '08-last.css',
    '09-avatar.css', '10-lattice.css', '11-type.css', '12-tone.css',
    '13-motion.css', '14-desktop.css', '15-course.css', '16-ai.css',
    '17-auth.css', '18-contain.css', '19-accent.css', '20-group.css',
    '21-ask.css', '22-noedge.css', '23-ink.css', '24-dash.css',
    '25-modhead.css', '26-agent.css', '27-tal.css', '28-frame.css',
    '29-consistency.css', '30-nil.css', '31-lead.css', '32-week.css',
    '33-talsum.css', '34-rail.css', '35-book.css', '36-lead2.css',
    '37-refit.css', '38-scene.css',
    # Tal's chat widgets, unboxed. Every rule in it is `.tal-msg > .bb .tw*`,
    # and both `tal` and `tw` are in PRODUCT_PREFIXES — so the whole layer is
    # dropped. It is listed anyway, because the invariant this list exists to
    # hold is that it IS build.py's list: a layer missing from here is not
    # visibly missing, it is quietly never considered.
    '39-talwidget.css',
    # The empty state's sphere. `.tal-hero .tal-mk.orb` — `tal` is a PRODUCT
    # prefix, so under include-by-default it comes across, along with the one
    # keyframe set it declares (`tal-sphere-glow-lg`, beside §33's 32px pair).
    # Listed for the same reason as the layer above: this list's whole job is
    # to BE build.py's list.
    '40-talorb.css',
    # The month calendar and the card that opens beside a day. The first layer
    # written FOR the design system rather than for the candidate portal — the
    # component it draws belongs to the Talent Agent's Availability page, and it
    # is stated here as a layer for the reason this file's header gives: a
    # component built anywhere else is one the next portal re-implements.
    '41-cal.css',
    # A row's status beside its title (`.row-st`), its subject in its mark. The
    # second layer written for the design system rather than for the candidate
    # portal: the component it corrects is the agent portal's checklist row, and
    # the arrangement it states — subject on the left, status by the title,
    # action at the end — is §15's chapter row generalised. Same reason as the
    # layer above for stating it here: a component built in one portal is one
    # the next portal re-implements.
    '42-rowstatus.css',
    # An empty state owning the page it is on. Written for the design system for
    # the same reason as the two layers above — the page that showed the problem
    # is the agent's, and the component is `.empty`, which every portal has.
    '43-empty.css',
    # The peek: a right-hand column that takes space instead of covering it.
    # Written here for the same reason as §41-§43 — the surface belongs to the
    # Talent Agent's Listing preview, and a component built in one portal is one
    # the next portal re-implements.
    '44-peek.css',
    # The quiet ground for a section you read rather than act on. One token and
    # one rule; every portal has pages that mix the two kinds of section.
    '45-info.css',
    # The status note's fill, put back. Every portal draws `.note.warn`.
    '46-statusnote.css',
    # The faceless plate's text, packed to the top. `.plate` is in the system
    # and so is the shape that needs this.
    '47-plate.css',
    # Tal's mark carries the logo in ONE place — the chat's empty state, where
    # the three chevrons fly in and out — and is a plain sphere everywhere
    # else. That split is the brand's rather than the chat's, and the chevron
    # animation is the most characteristic motion the product has, so both
    # come across whole. `.tnc` and `tn-chev-*` are names nothing else uses.
    '50-talsphere.css',
    # The Tal chat view: the ivory ground and its peach wash, an unframed
    # answer beside its mark, the user's turn as a black block, and a composer
    # standing on the coral mesh. `ask*` is NOT on EXCLUDE_PREFIXES any more,
    # so this arrives intact — which is right for a second portal: the chat is
    # the one screen every portal will want and the least like a plain page.
    # The one thing it brings that needs the portal is `--askm-mesh`'s data
    # URI, and that is embedded, not fetched.
    '51-askview.css',
    # The page summary typing itself. Two of these three rules are pure layout
    # — a hidden copy of the finished line reserving its box, the visible copy
    # laid over it — and they are the part that is hard to get right, because
    # a typewriter that grows its own box shoves the page down mid-read.
    #
    # AND THE CLOCK SHIPS WITH IT, as `dsTypeSummary` in the JS half. It did
    # not at first, and that was the whole of the bug: three rules gated on a
    # class that only a clock ever stamps went into the box with no clock, so
    # the component was present and could not be switched on by anything that
    # had it. §52's selectors were also scoped to `.modhead .ai-aura.talsum`
    # then — a shape `placeBand` builds and a hand-authored page does not — so
    # they could not have matched even if a page had written its own typer.
    # Both halves are here now and the gate is `.tsum` alone.
    '52-talsumtype.css',
    # The chat as ONE surface, and Tal's mark as footage. Both halves belong
    # here and for different reasons.
    #
    # The surface half is the chat's, and `ask*` ships, so it comes across
    # with the rest of §51 — including the composer's stroke, which is the
    # only continuously-moving gradient border in the system and the kind of
    # thing a second portal would otherwise re-invent from a screenshot.
    #
    # THE MARK HALF IS WHY THIS LAYER CANNOT BE LEFT OUT. §53.8 turns the
    # three CSS-drawn spheres back into `--tal-mark`, and one of those three
    # is §33.6's — the head band's, which is the mark a page built on this
    # stylesheet actually draws. Without this layer the token points at the
    # animated blob and that one surface goes on painting a gradient sphere,
    # so the agent's portal would have Tal's old face at the head of every
    # page and the new one everywhere else.
    '53-talground.css',
    # A tinted block is its own top edge. One declaration, and it has to be
    # here because the rule it subtracts from is: §37.1 gives the card rail a
    # closing hairline, §37 is in this list, and `.rail-wrap`, `.sec` and
    # `.tint` are all system names — so a page built on this stylesheet that
    # puts a `.sec.tint` under a rail draws the same two-boundary join the
    # candidate portal did, four pixels apart. Shipping §37.1 without this is
    # shipping the bug.
    '54-tintedge.css',
    # Cells on a panel as cards rather than divisions. `.sec.tint.cards` takes
    # the figure fills and the head action white, replacing §12's "same colour
    # as the panel, hairlines drawn by the grid gaps". Every name it touches is
    # a system name — `.sec.tint`, `.stats`, `.facts`, `.prog-figs`, `.sec-h`,
    # `.btn-g` — and `.cards` is an opt-in a second portal applies or does not,
    # so it costs one rule unused and saves the next portal rediscovering which
    # of §12's twenty fills has to move.
    '55-panelcards.css',
    # The head of a page as two columns, and the steps open. Every name in it
    # is a system name — `.modhead`, `.ai-aura.talsum`, `.stp-wing`, `.stp-top`,
    # `.pi-lab`, `.plate`, `.sec-dark` — and the arrangement is the band a
    # second portal copies: title, the `·` fact row, where you are, a divider,
    # then what Tal says, with the one loud card beside it.
    #
    # AND `.stps` IS THE HALF A HAND-AUTHORED PAGE HAS TO WRITE ITSELF. The row
    # is markup plus these rules and no render pass — `.stps` > `.stps-i.done`
    # / `.on` > `.stps-m` (the mark) and `.stps-b` (the label and its detail
    # line) — so unlike §33.7's dropdown it needs no JS at all. `stepIcon`'s
    # table in views.js is the one thing that does not cross: both portals
    # already carry their own copy so a step's subject icon cannot differ
    # between them, which is the note in views.js over `STEP_IC`.
    #
    # WHAT DOES NOT CROSS IS §33.9's HIDE, and it is not in this layer to
    # begin with: `.tal-greet` still hides a page's `.ph`, and the agent's
    # portal still opens its dashboard on a greeting. This layer is the
    # candidate portal choosing the other shape — a title with a fact row
    # under it — and a page on this stylesheet can take either.
    '56-headband.css',
    # The front door as a split (Figma 483:976). In for the same reason §54 is:
    # `17-auth.css` is in this list, so the composition it states already ships
    # here, and shipping that without the layer that restates it would give a
    # second portal the 2026 sign-up markup and the 2025 frame. It also brings
    # `.auth-id`, the orange identity panel, which is the one part of it that is
    # a component rather than a correction — every portal with a front door has
    # a screen that has to say which account it is about.
    '57-authsplit.css',
    # The two findings as headings. `.sig-l` is a new name and the rules are
    # ordinary type and spacing, so it costs one rule unused in a portal that
    # has no interview write-up — and saves the next one rediscovering that the
    # inline style had to come out of the markup first.
    '58-finding.css',
    # TWO PRIORITIES FOR THE DARK CARD, plus the wing's two new blocks. The
    # quiet plate is the half of this a second portal wants most: it is the
    # answer to "what does an appointment card look like when the appointment
    # is not today", which every portal with a calendar in it eventually asks,
    # and it is stated as three custom-property reassignments rather than as a
    # variant of every rule §15 writes — so a page that adds `.plate-quiet` to
    # a plate gets the whole thing, and any rule a later layer writes against
    # `--on-dark*` is correct on both states without knowing this layer exists.
    # `.wing-prog` / `.wing-lvl` cost four rules in a portal with no course.
    #
    # `plate-quiet` IS WRITTEN BY THE BOX, which is the test CLAUDE.md sets for
    # a family that is decoration. `plateUrgent` is in the JS the design system
    # ships (see `dsPlateQuiet` in talentnext-ds.js), because the decision needs
    # only the card's own eyebrow and countdown — not `S`.
    '59-priority.css',
    # THE LIVE CALL — Figma 499:2022 and 499:1617. A surface rather than a
    # page: a dark bar with a clock, a full-bleed feed with the far side's
    # photograph on it and their name written over the corner, a column of
    # participants beside it for a group call, and one light row of controls.
    # Every portal with an appointment in it has the other end of this call —
    # the candidate joins an interview, the agent takes it, the cohort leader
    # hosts the weekly hour.
    #
    # IT IS MARKUP PLUS CSS AND NO JS, which is the `.stps` case rather than
    # the `.tsum` one. The portal's ai10.js holds three things the box does not
    # want: `S.call`, a render branch, and a clock that fast-forwards a
    # 45-minute session into 42 seconds so a prototype can be watched. A real
    # product's call surface gets its clock and its participants from a video
    # SDK; what it needs from a design system is the drawing. The recipe is in
    # gallery.html, and a page that copies it prints a fixed time.
    #
    # THE THREE PHOTOGRAPHS SHIP WITH IT, as `CALL_ART` beside `AV` in the JS
    # half — the feed needs a LANDSCAPE picture and every face in `AV` is a
    # 200px square cut for a 36px disc, which is a 6x upscale in a 1200px 16:9
    # box. A component whose one asset the box does not have is a component the
    # next portal draws badly.
    '60-call.css',
    # THE QUIZ ROSE — five bands as wedges from a common hub, each reaching out
    # as far as its score, the overall figure in the middle, and the legend as
    # `.kv` rows with a fill-matched swatch.
    #
    # AND THE GEOMETRY SHIPS WITH IT, as `dsQuizRose` in the JS half, for the
    # reason §52's note gives about `dsTypeSummary`: every `qz*` class is
    # written by a generator and by nothing else, so the rules alone would have
    # been a family in the box that nothing in the box can switch on. The
    # function needs only its arguments — an array of pairs and a number — not
    # `S`, which is the test that decides it.
    '61-quizrose.css',
    # A RANK IN THE HEADER INSTEAD OF A BANNER. The signed-in person's own face
    # at the head of the page with their standing on its corner, and the
    # announcement at the right-hand end of the same row — which is a shape any
    # second portal wants the moment it has a header about the reader rather
    # than about a record. It is also the layer that makes `.ph-act` work
    # against a tall left half: `.ph-you` switches the row to `center` and lets
    # it wrap, so the action drops below the title instead of crushing it.
    #
    # NO JS SHIPS WITH IT, and that is not the §52 mistake. There is no clock
    # and no generator here: the markup is a mark, a medal and a link, and
    # `gallery.html` carries it verbatim under Signature. The one thing a
    # hand-authored page has to know is that `.ph-rank` is a SIBLING of `.av-ph`
    # rather than a child, because §09 clips the avatar's box.
    '62-rankhead.css',
    # TYPOGRAPHY — THE AUTHORITY, and the single most important layer in this
    # list for a second portal.
    #
    # A design system whose type is "whatever the component happened to say"
    # is not a design system, and that is what the previous output shipped:
    # a computed sweep of the portal found 26 rendered sizes, five weights in
    # a face that loads two, 1283 elements set in uppercase and two greys
    # doing one job. A page built on that box could match the portal only by
    # copying four numbers off whichever component it was nearest.
    #
    # §63 states the scale as `--t-*` TOKENS, which is what actually crosses
    # the boundary. A hand-authored page does not have the portal's class
    # names, so `.cardrow-t` being correct is worth nothing to it — but
    # `font-size:var(--t-h3-size)` is, and so are the eleven `.t-*` role
    # classes the tokens back. That is the difference between shipping a
    # stylesheet and shipping a system.
    #
    # LAST, exactly as in build.py, and for the same reason: it supersedes
    # every layer above it by position. Nothing may be appended after it that
    # sets a font size.
    '63-typography.css',
    # THE OUTLINED BUTTON LOSES ITS BOX AND GAINS AN ARROW. `.btn-s` /
    # `.btn-t` / `.btn-g` were a drawn rectangle; on a product made of
    # hairlines that is one edge too many, and an arrow says "this goes
    # somewhere" where a box only says "this is a control". The arrow is a
    # mask taking `currentColor`, so it is correct on white, on the black
    # card and under §19's accent without a variant for each — which is
    # exactly what a second portal needs, since it will not have the
    # portal's own call sites to edit.
    '64-quietbtn.css',
    # THE FOUND DISCLOSURE + THE FIGURE STRIP'S MARKS. The disclosure is the
    # generic half — a section whose heading is a chevron and a title, with
    # the panel below it — and it ships because a collapsible section is the
    # one layout every portal reinvents. Its JS is four lines in the click
    # delegate and it needs no `S`, only the element, so it passes the test
    # in the include-by-default note: the class is the contract, and a
    # hand-authored page toggles `.on` on the section itself.
    # `.prog-ic` rides with it: `.stat`'s chip on a `.prog-figs` cell.
    '65-founddisc.css',
    # THE CARD THAT SELLS SOMETHING IS DRAWN AS AN OFFER — a sentence under
    # the plate's title, the price in the accent on the row's right edge, a
    # hairline under every fact row, and a tinted band for the date. It
    # ships whole because every gate is a condition in the MARKUP rather
    # than a call site in `hifi/`: `.plate-d`, `.plate-v` and `.note.acc`
    # are three shapes a hand-authored page writes for itself, and none of
    # them needs `S`. What does not cross is `splitPlateBody`'s lift of a
    # trailing `<b>` into `.plate-v` — that is a render pass, and a page
    # with none writes the `.plate-bi` / `.plate-v` row directly, exactly as
    # it already writes `.plate-h` / `.plate-when`. The recipe is in
    # `gallery.html` under Signature.
    # It also carries `.note.acc`'s ground, which makes the accent note the
    # system's tinted callout rather than two lines of orange text.
    '66-enrolcard.css',
    # TEMPORARY — the red accent trial. Its only selector is `.tmp-accent`,
    # `tmp` is an EXCLUDE_PREFIX, and `keep_selector` drops a selector if ANY
    # class in it is excluded, so the whole layer is dropped and no red
    # reaches this stylesheet. It is LISTED ANYWAY, for exactly the reason
    # §39 and §40 are: the invariant this list exists to hold is that it IS
    # build.py's list. Leaving it out would keep the red out too, but by
    # accident rather than by decision — and the next person to compare the
    # two lists would find a layer in one and not the other with nothing
    # saying why. Delete this entry when the trial is removed.
    '67-tmpaccent.css',
    # THE PLATE'S PERSON COMES FIRST. `.plate` is in the system and so is
    # `.plate-who`, so the stack order crosses with them — a second portal
    # drawing a card with a person on it should get the person above the
    # logistics without having to rediscover that. Order only; it states none
    # of the four properties §63 owns.
    '68-platestack.css',
    # THE ENROLMENT FLOW. Two components, and both cross for the same reason
    # §66 does: neither is scoped to a page by name and both key on something
    # that is in the markup.
    # `.plate-tab` is a plate whose fact rows are ALL labelled figures — an
    # invoice rather than a spine of subjects — and it rules the last row off
    # as the total. In the portal the class is stamped by `splitPlateBody`
    # (ai5), a render pass, which does not port; a hand-authored page writes
    # the class and the mark-less rows itself, which is exactly what §66's
    # own note already says about `.plate-bi` / `.plate-v`. That makes it
    # MARKUP rather than the decoration CLAUDE.md warns about — the tell it
    # describes is a class nothing outside the stylesheet ever writes, and
    # the gallery writes this one.
    # The second is a disclosure with a lede visible while it is shut, which
    # is `.found` plus an `.all-desc` outside the panel. `.found` is already
    # in the system (§65) and this only restates its closed padding.
    '69-enrolflow.css',
    # THE AI-NATIVE HEAD. Four families and a travelling light, and all of it
    # crosses — none of it is assembled by a render pass and none of it is a
    # second surface.
    # `.jrn*` is a numbered step list, `.rec*` a recommendation card, `.qa*` a
    # pair of action cards: markup a hand-authored page writes in full, which
    # is the test §69's note applies to `.plate-tab`.
    # `.ai-edge` is the comet, and it is the one that has to be here rather
    # than looked at twice. Both halves of it are CSS — a pseudo-element on a
    # motion path — so unlike §52's typing summary there is no clock left
    # behind in a JS file, and the class is one a page puts on any block it
    # wants the light to run round. Its tokens (`--ai-grad`, `--ai-comet`,
    # `--ai-amber`) ride on `.app`, which is the host every DS page already
    # declares, and `@keyframes ai-comet` is kept whole by the tokenizer the
    # same way §40's sphere keyframes are.
    # LEAVING IT OUT WAS THE FIRST CUT AND IT PRODUCED THE WORST OF THE THREE
    # OUTCOMES, which is why this note is long: §63 §10 is in the list and
    # states the type for every one of these families, so the design system
    # shipped `.jrn-pill`'s ink and size with nothing to draw the pill, and
    # `.rec-alt`'s `color:transparent` with no gradient under it — a link that
    # renders as an empty space. A layer of layout whose type layer crosses
    # without it is not "missing", it is broken, and it is invisible until
    # somebody builds a page on it. The check that catches it is the one at
    # the foot of this file: grep the output for a class §70 introduces.
    '70-ainative.css',
    # THE COURSE HEAD. Two families and a grid, and all three cross for the
    # same reason §70's four do: nothing here is assembled by a render pass
    # and nothing is a second surface.
    # `.crow*` is the call row — a countdown cell, a square portrait, a name
    # and two actions, with `.urgent` as its inside-the-day state. It is
    # markup a hand-authored page writes in full, which is the test §69's
    # note applies to `.plate-tab`; the ONE thing a caller has to decide for
    # itself is which of the two states to write, and that decision is a
    # regex over a hand-written string (`PLATE_SOON`, views.js) rather than
    # product state — `dsCallUrgent` ships it, the same way `dsPlateQuiet`
    # ships §59's. Per CLAUDE.md's test: the behaviour needs only the words
    # it is handed, not `S`.
    # `.sec-prog` is the progress column, and what crosses is its LAYOUT of
    # `.prog` / `.prog-figs` — both already in the system since §02/§10. So
    # this adds no component, it adds the arrangement that turns the page's
    # figure band into a 300px column: two dividers instead of four borders,
    # `auto`/`1fr` tracks instead of equal thirds, and `overflow-wrap:normal`
    # so a narrow column cannot break "chapters" in half.
    # AND THE GRID IS THE REAL REASON IT CANNOT BE LEFT OUT. §70.3's
    # two-column band is keyed on `.head-col` BECAUSE of this layer, and §71
    # is where the second tenant's own track width lives — ship §70 without
    # §71 and a DS page that writes `.head-col` gets a column sized for a
    # list of four labels with a figure strip in it.
    # LEAVING IT OUT WAS ALREADY HALF-DONE ONCE AND IT LOOKED EXACTLY LIKE
    # §70'S OWN WARNING, which is why this note repeats it: §63 §11 is in the
    # list and states the type for every one of these families, so for one
    # build the output carried `.crow-when > b`'s violet, `.crow-n`'s size and
    # `.sec-prog .prog-figs`'s pair with NO row and NO grid under any of them
    # — a countdown in magenta on nothing. Grep the output for `.crow-ph`
    # after either build.
    '71-coursehead.css',
    # THE WEEK PULSE — three sections become one row of three columns: what
    # you are on, whether that is enough, what it has earned. It crosses for
    # the reason §71 does, and with the same one JS dependency in the same
    # place: `pacePart` derives the segment counts, everything else is markup
    # plus this layer.
    # AND IT ADDS NO COMPONENT, WHICH IS WHY IT IS CHEAP TO CARRY. The ring is
    # `ring()`, the standing cells are `standRow`, the marks are §65's `.stat`
    # chip in §65's three named hues, the bar is §71.1b's rail with a different
    # count. What `.pulse*` states is the GRID that holds them and the four
    # places a component drawn for a full-width section has to change to live
    # in a 290px column — which is exactly the kind of rearrangement a second
    # portal wants and cannot work out from the components alone.
    # TWO REASONS IT CANNOT BE LEFT OUT, and both are the failure this list has
    # now hit twice. §63 §12 IS in the list and states the type for every
    # `.pulse*` family, so without this layer the output carries their sizes
    # and inks with no grid under any of them. And `.pulse .stand` re-points
    # four declarations §15/§29 make on `.stand` — ship one without the other
    # and the standing column renders as a full-bleed three-across grid inside
    # a 278px box. Grep the output for `.pulse-ring` after either build.
    '72-weekpulse.css',
    # THE ENROLMENT OFFER, and the AI-native section head with it. `aiHead` is
    # the one component in these four layers that a second portal will reach
    # for on its first page: a heading, its description and the row's actions
    # as ONE block, with the actions centred against the pair rather than
    # against the title. §73.1 is the whole of that drawing, and it exists
    # because three sections had already drifted three ways in ONE portal — a
    # second portal with no rule for it drifts on its first section. `.eo*` and
    # `.cov*` cross with it because they are that head's two worked examples:
    # a figure row whose cells are content-sized with the dividers centred
    # between them, and a horizontal card scroller that becomes a grid at 900.
    # THE §63 ORPHAN ARGUMENT, WHICH IS NOW THE THIRD TIME THIS LIST HAS HIT
    # IT. §63 §13 IS in the list and states the type for `.aih-t`, `.aih-d`,
    # `.eo-*` and `.cov-*` — and `--t-sec-size`, the ninth size, exists only
    # for these headings. Leaving this layer out shipped `.aih-t`'s size and
    # `.eo-pill`'s violet with nothing to draw either, exactly as §70 shipped
    # `.jrn-pill`'s ink with no pill and §72 would have shipped `.pulse*`'s
    # sizes with no grid. Grep the output for `.aih-mk` after either build.
    '73-enroloffer.css',
    # WHAT THE INTERVIEW FOUND — three findings as three cards in three of
    # §12's named marker hues. It crosses for the reason §65's chip does: it is
    # the system's answer to "this block is read, not acted on, and its parts
    # are different KINDS", which is a shape every portal has and none of the
    # components state. The three mixes are the transferable part — 5% for a
    # card, 12% for a 28px chip, 14% for a tag, all from one `--mk` — and the
    # card-title-takes-the-hue rule that §72 §12 deliberately reverses.
    # SAME ORPHAN ARGUMENT: §63 §14 states `.signed-*`'s type and the card
    # title's `--mk`, so without this layer the output carries a title coloured
    # from a variable no rule ever sets. It also restates §55's white-cell
    # assumption and reaches past §15's `.signed-h`, so shipping §63's half
    # alone leaves the pair mismatched in both directions.
    '74-signedcards.css',
    # THE RECOMMENDATION AS THE BLACK CARD. It crosses, and the transferable
    # part is not the recommendation — it is the CARD. `.plate`'s ground and
    # §21.22's haze reach a hand-authored page as one class here, with no pass
    # to run: §21 draws the light as `.dark-glow`, a div `injectGlow` (ai4)
    # appends, so a page with no render passes gets a black rectangle and no
    # light. §75.1 states the same radial as a `background-image`, which needs
    # nothing but the class — which is exactly the `dsPlateQuiet` argument, one
    # component along.
    # SAME ORPHAN ARGUMENT, AND THIS ONE IS THE SHARPEST YET: §63 IS in the
    # list and states `.rec-dark`'s two inks AND an 18px heading that exists
    # for one rule in THIS layer. Left out, the output ships white-on-white —
    # `--on-dark` text with no dark ground under it, which renders as a section
    # that has silently lost its content. Grep the output for `.rec-dark` after
    # either build.
    '75-recdark.css',
    # THE BOOKING PAGE'S THREE PANELS. It crosses because what it states is not
    # "a booking page" — it is a BOUNDED PANEL SPLIT IN TWO, which is the shape
    # every portal reaches for and which the system did not carry: §41's `.cal`
    # is the only other frame in the build and it is a calendar. `.bkp` / `.bks`
    # are that frame with a divider that turns over correctly at the stack
    # (a `border-left` becoming a `border-top`, which §72's absolutely
    # positioned version cannot do), and `.bkc` is a fee-note-action row.
    # SAME ORPHAN ARGUMENT: §63 §16 states the type for every one of these
    # families AND is the fourth and fifth reader of `--t-sec-size`. Left out,
    # the output ships nine sized, coloured strings with no panel, no divider
    # and no chip under any of them.
    '76-bookpage.css',
    # THE CALL ROW ON THE BLACK CARD. It crosses for one reason and it is the
    # same one §75 crosses for: this is the WORKED EXAMPLE of converting an
    # existing component onto `.dark-card`, and every part of it is a thing a
    # second portal will hit — a section whose padding four earlier rules zero,
    # a tinted cell whose `--layer-02` ground disappears on black, a quiet
    # button whose `var(--rule)` border does the same, and a stacked row that
    # brings the page gutter inside a card that already pays it (trap 10).
    # SAME ORPHAN ARGUMENT: §63 §17 states this row's two on-dark inks, so
    # without this layer the output carries `--on-dark` text with no card
    # under it and a countdown cell still painted 4% grey.
    '77-crowdark.css',
    # THE TOP BAR — the breadcrumb, the account menu and `.ph-bare`.
    # IT CROSSES BECAUSE THE APP BAR IS THE FIRST THING A SECOND PORTAL BUILDS
    # and it was the one part of the frame the system shipped only half of:
    # `.shell`, `.shell-act`, `.shell-logo`, `.shell-avatar` and the rail all
    # cross already, and what a hand-authored page then had to invent for
    # itself was the two controls that make the bar a bar — where you are, and
    # who you are signed in as. `tn-agent-portal.html` hand-wrote neither.
    # SAME ORPHAN ARGUMENT AS §75 AND §77, and this one is the sharpest of the
    # three because §63 IS in this list: §63 §18 states the trail's three inks,
    # the separator's grey and the menu row's body size, so leaving this layer
    # out ships a breadcrumb's TYPE with no list, no separator and no panel
    # under it — the exact half-shipped failure the head of this file
    # describes, on a family whose whole job is to be one line.
    # THE PASS DOES NOT CROSS AND DOES NOT NEED TO. `placeTopbar` (ai11.js)
    # reads `S.view`, `PARENT` and `NAVSETS` — portal state, so it fails the
    # `dsTypeSummary` test at the head of this file ("does the behaviour need
    # the portal's STATE, or only the element you hand it"). A hand-authored
    # page writes its own `<li class="crumb-i">` rows, which is markup and no
    # more; `gallery.html` carries the recipe.
    '78-topbar.css',
    # THE PULSE ON A BLACK CARD. Everything in it crosses, and the reason is
    # the one this file keeps repeating: §63 IS in this list, so §63 §19 states
    # the card's two inks, "Your Next Call" at h4 and the time's compact
    # strong — and leaving §79 out would ship all of that with no rule under
    # the heading, no grid under the portrait and no hue on the three Quick
    # Action marks. §75 and §77's entries make the same argument; this is the
    # third layer in a row to convert a block onto `.dark-card` and the third
    # time the type would strand.
    # WHAT A HAND-AUTHORED PAGE GETS IS THE WHOLE THING, because none of it
    # needs a pass. The card is a `.sec` with two children, the rule is a
    # `border-top`, and the portrait-sized-by-its-text is a three-track grid —
    # the `.rec-l` technique §75 already ships, one component along. There is
    # no `placeDark` involvement: `.dark-card` is deliberately NOT in ai5's
    # `DARK_CARD` list, which is what stops the band hoisting it.
    '79-pulsedark.css',
    # THE QUIZ RESULTS INSIDE §44's RIGHT-HAND COLUMN.
    # IT CROSSES BECAUSE §44 ALREADY DOES and this is what finally makes that
    # layer usable from a page with no render passes: the peek's CSS has shipped
    # here since it was written with `tn-agent-portal.html` as its only caller,
    # and what a second portal had to invent for itself was everything that goes
    # INSIDE the column. Five blocks, all of them generic — a marked lede, two
    # titled lists, a centred chart and a row of derived findings — and none of
    # them needs a class §44 does not already provide as their host.
    # SAME ORPHAN ARGUMENT AS §75, §77, §78 AND §79: §63 IS in this list, so
    # §63 §19 states the lede's size, the two group headings' hues, the list's
    # ink, the row's three tiers and the footer's blue. Without this layer the
    # output carries all of that with no stack, no marker indent, no chip and no
    # pinned footer row under it.
    # THE PASS DOES NOT CROSS AND CANNOT. `quizPeek` reads `SCORES`, `S.stage`
    # and `f.track` — portal state, so it fails the `dsTypeSummary` test at the
    # head of this file. A hand-authored page writes its own `<aside class=peek>`
    # and its own rows; `gallery.html` is where that recipe belongs.
    '80-quizpeek.css',
    # THE JOIN THAT IS NOT OPEN YET — the disabled accent button on the black
    # card. Three declarations and a flag.
    # IT CROSSES BECAUSE THE GATE IS AN HTML ATTRIBUTE, NOT A CLASS A PASS
    # STAMPS. This is the one distinction the head of this file draws about
    # behaviour, answered the easy way round: a hand-authored page writes
    # `<button class="btn btn-p" disabled>` and needs nothing from the portal to
    # do it, so unlike §52's typing summary there is no clock to leave behind.
    # What it must NOT do is ship the ink without the ground: §63 IS in this
    # list, so §63 §20 states `--on-dark-2` on this exact selector, and leaving
    # this layer out would put a disabled label on a card still painted the full
    # accent gradient — grey words on orange at 2.2:1, which is worse than
    # either half alone. The same orphan argument §75, §77, §78, §79 and §80
    # each carry.
    # THE WINDOW DOES NOT CROSS AND DOES NOT NEED TO. `joinLive` (views.js)
    # reads a hand-written appointment string out of the portal's own records;
    # a second portal's "is it time yet" is its own question, and the attribute
    # is the whole contract between the answer and the drawing.
    '81-joingate.css',
    # THE ENROLMENT OFFER AS A BLACK CARD. It crosses for the orphan argument
    # §75/§77/§79 each carry, and here that argument is at its sharpest: §63 IS
    # in this list, so §63 §21 already states `--on-dark`, `--on-dark-2` and
    # `--accent-on-dark` on `.dark-card .eo-fl` / `.eo-fv` / `.eo-fv-acc`.
    # Leaving §82 out would ship those three inks with nothing painting the
    # ground under them — white labels on a white page, which is the
    # half-shipped stylesheet CLAUDE.md describes and is invisible until
    # somebody builds the page.
    # WHAT ACTUALLY CROSSES IS SMALL AND GENERAL: an `aiHead` inside a
    # `.dark-card` needs its flex model restated against §10.15's label column
    # (trap 13), needs the head's own margin off so it does not add to the
    # card's gap, and needs its rule and its dividers in `--on-dark-rule`
    # instead of `--rule`. All four are true of ANY headed black card a second
    # portal writes, not just of this one, which is why the selectors are
    # `.dark-card`-scoped rather than `.eo`-scoped wherever they can be.
    '82-enroldark.css',
    # TEMPORARY — the red accent trial, part two. It is in this list rather
    # than in NOT_IN_DS on purpose: `tmp` is on EXCLUDE_PREFIXES and every
    # selector in the layer carries `.tmp-accent`, so `keep_selector` drops
    # all of it by name and the output is unchanged either way. Listing it
    # keeps `check_coverage()` honest — a layer that is deliberately dropped
    # is a different fact from a layer nobody thought about, and the whole
    # point of that check is that the second kind cannot hide. Delete this
    # entry with §67, §83 and `tmpaccent.js`.
    '83-tmpaccent2.css',
    # A TINTED SECTION HAS NO HAIRLINE ABOVE OR BELOW IT, and all of it
    # crosses. Every selector is `.sec` / `.tint` / `.ph` / `.crumb` — the
    # JS-free core, four classes `SYSTEM` already names — and the rule it
    # states is a fact about the LOOK rather than about a page: a change of
    # ground is already a boundary, so a grey band does not also draw an edge.
    # A second portal that tints a section gets the same answer for free, and
    # a second portal that does not tint anything is unaffected, because every
    # selector needs `.tint` (or `.sec-rep`) to match at all.
    # `.sec-rep` CROSSES TOO, and it is a marker rather than a component: it
    # says "the section above me draws no closing rule", which is the same job
    # §20's list gives `.sec-cs`, `.sec-out` and `.cap-sec`. A hand-authored
    # page with a white table under a figure band wants exactly that word.
    '84-tintnorule.css',
    # THE CERTIFICATE BANNER AND TWO ALIGNMENTS, AND ALL OF IT CROSSES.
    # `.certban*` is a component in the plainest sense — a tinted band with a
    # mark, two lines and a pair of buttons, drawn entirely in flexbox off
    # `--accent`, `--pad-x` and the spacing scale. No render pass touches it
    # (it is deliberately NOT `.cert`, so `placeDark` cannot see it — that is
    # the whole point of the class), no JS writes it, and a hand-authored page
    # that wants a quiet "here is a document you earned" row wants exactly
    # this. It is the counter-example to the `.cert` card, which a second
    # portal often cannot afford to draw at full volume.
    # THE TWO ALIGNMENT RULES ARE SCOPED TO `.sec-pulse` AND `.pnc-row`, both
    # of which the design system already ships (§72/§79 are in this list), so
    # they cross with the components they correct rather than as loose rules.
    # A page that draws neither is unaffected: every selector needs one of
    # those two classes to match at all.
    # NOTHING HERE IS RENDER-PASS-BOUND, which is the test this list applies —
    # `.certban` is markup plus CSS, and `gallery.html` can write it as-is.
    '85-certbanner.css',
    # THE COHORT COVER CROSSES, AND IT IS THE PURE CASE FOR THIS LIST'S POLICY.
    # §86 is `.gcard-art`: a cover image in a list row's leading slot, sized to
    # the row's own content height. The IMAGES are the portal's (build.py embeds
    # three cohort covers and this build embeds none of them), but the rules know
    # nothing about them — they are layout, a ground and an `object-fit`, and a
    # hand-authored page pointing the `<img>` at its own artwork gets the whole
    # component. `.gcard` is already here with 68 rules and its own gallery entry,
    # so this is one more shape of a component the box ships rather than a new
    # dependency.
    # NO RENDER PASS IS INVOLVED — the markup is `gcard`'s optional sixth
    # argument, five lines of template, and `gallery.html` can write it as-is.
    # THE `calc()` READS §63'S TOKENS, which this build ships (§63 is in this
    # list), so the square stays equal to the three lines beside it in the box
    # exactly as it does in the portal.
    '86-cohortart.css',
    # WHAT YOU'LL LEARN — the tick list and the chip row, and all of it
    # crosses. `.lrn*` is a two-column list with a mark against each item and
    # `.skl*` is a row of pill tokens with a text control on the end: two of the
    # plainest components in the box, drawn in grid and flex off the spacing
    # scale and `--layer-02`, with no render pass and no JS anywhere near them.
    # A second portal listing what a thing includes wants the first; one listing
    # tags or topics wants the second.
    # `.skl-full` IS THE ONE RULE THAT NEEDS THE DIALOG, and §02's `.modal` /
    # `.sheet` are already in the system — so a hand-authored page can write the
    # "Show all" sheet from `gallery.html`'s own modal recipe plus this class.
    # The BOOLEAN behind it does not cross and does not need to: the sheet is
    # `.on` or not, which is one class a page can toggle however it likes.
    '87-learnsec.css',
    # YOUR PERFORMANCE — the figure/plot/conclusion block, and all of it
    # crosses. `.perf*` is a grid, a legend, an inline SVG and a hairline
    # footer strip: no render pass, no JS, and every value off the spacing
    # scale, `--rule`, `--dv-grad-a/b` and §12's success and danger inks —
    # all of which the system already ships. A second portal reporting a
    # score over time wants exactly this, and it is the only chart in the box
    # with a y axis.
    # THE INSIGHT'S MARK NEEDS §70's `--ai-star` / `--ai-grad`, which cross
    # too, so the sparkle is drawn rather than half-shipped — the failure
    # §70's own entry in this list records for `.jrn-pill` and `.rec-alt`.
    # `.kv-list` CROSSES WITH IT: one flex column round §02's `.kv` rows, for
    # a dialog listing label-and-value pairs.
    '88-perfsec.css',
    # THE COHORT PAGE'S UI, and all of it crosses. `.cmt*` is a comment
    # thread — a grid, a round mark, a name row, prose and three borderless
    # controls — which is the one discussion shape the box did not have (it
    # ships the two-sided chat as `.m*` and now the many-sided board too). No
    # render pass, no JS, no state: the row is markup plus these rules.
    # THE THREE ROUND-AVATAR RULES CROSS AS WRITTEN and are deliberately
    # SCOPED — `.cmt-av`, `.b-who`, `.mem-av` — so a hand-authored page gets
    # round photographs in a comment thread, a ranking and a member list and
    # square ones everywhere else, which is the portal's own arrangement
    # rather than a global that would round the app bar too.
    '89-cohortui.css',
    # THE AWAITING-EVALUATIONS ROW (§90) — two people side by side inside a
    # black card, each with a ring and a quiet action, an inset hairline
    # between them, stacking below 900.
    # IT CROSSES WHOLE AND IT IS WORTH HAVING: `.ev-row` is the answer to "two
    # or three of something abreast inside a `.dark-card`", which the box could
    # not draw before — §72's pulse columns are for a white section and carry
    # that section's own type and marks. Every class is new, so nothing is
    # excluded and nothing collides.
    # NO JS AND NO RENDER PASS. The row is markup plus these rules; the ring is
    # `ring(pct,label)`, which the design system already ships as `dsRing` — so
    # a hand-authored page writes the two circles and the `--arc` length the way
    # `gallery.html` documents under Signature.
    '90-evalrow.css',
    # THE 90-DAY SUMMARY PAGE (§91) — a 280px figure column beside a prose
    # column, a hairline between them, stacking below 900.
    # IT CROSSES WHOLE: `.sump` is "evidence beside a decision", which is a page
    # shape any second portal will want and the box could not draw — §76's
    # three-panel booking grid is the only other two-column section in it and
    # that one is about a picker. The figure row (`.sump-f`) is also the answer
    # to "a label and a value with a mark, in a narrow column", which `.stats`
    # cannot be at 280px.
    # NO JS AND NO RENDER PASS. The ring is `ring(pct,label)` — the same two
    # circles and `--arc` length `gallery.html` documents under Signature.
    '91-sumpage.css',
    # THE COHORT CARD (§92) — a cover, a pill over it, a name, a derived line
    # and four labelled rows on one grid, in a `auto-fit` grid of them.
    # IT CROSSES WHOLE AND IT IS THE SHAPE THE BOX WAS MISSING: every other card
    # this system ships is a ROW (`.gcard`, `.cardrow`, `.ag`) or a black card,
    # so "three of something abreast, each with its own picture" had no answer in
    # it. Every class is new, so nothing collides and nothing is excluded.
    # ITS TWO REUSED PARTS ALREADY SHIP. The marks are §65's `.prog-ic` (the
    # chip, its wash and its 16px glyph) and the progress bar is §03's `.bar`, so
    # a hand-authored page writes the markup and gets both.
    # NO JS AND NO RENDER PASS — the hue of the pill and of each mark is a custom
    # property the markup states, which is `pulseCol`'s idiom and needs no pass.
    # THE ONE THING THAT DOES NOT CROSS IS THE PICTURE: `COHORT_ART` is the
    # portal's own three covers, so a second portal points the `<img>` at its
    # own artwork exactly as it does for `.gcard-art`.
    '92-cohortcards.css',
    # A ROW WITH TWO ACTIONS STACKS ON A PHONE (§93) — below 600 a `.cardrow`
    # whose action cell holds more than one button wraps that cell onto its own
    # line, indented to the text column.
    # IT CROSSES BECAUSE IT IS A FIX TO A COMPONENT THE BOX ALREADY SHIPS, not a
    # new one: `.cardrow` and `.cardrow-a` are both in the output and §02.282's
    # `flex:none` crosses with them, so a hand-authored page that puts two
    # buttons in a row inherits the 55px text column unless this comes too.
    # KEYED ON THE SHAPE (`> .cardrow-a > .btn + .btn`), so it reaches a second
    # portal's own two-action rows with no class to remember.
    # NO JS AND NO RENDER PASS — flex and one derived padding.
    '93-tworowact.css',
    # THE POINTS LIST'S MARK (§94) — `.aw-ph`, a duotone glyph on a 36px disc
    # tinted 12% of the row's own `--mk`, with an unearned state that re-points
    # that one variable to grey.
    # IT CROSSES BECAUSE BOTH HALVES DO. icons.js is copied verbatim, so `P` and
    # the nine Phosphor paths are already in `talentnext-ds.js`; shipping the
    # proxy with no rules to draw its output is precisely the half-shipped
    # component this build has been burned by (§70's `.jrn-pill`).
    # THE HUE IS THE MARKUP'S — `style="--mk:var(--mk-3)"` — so a hand-authored
    # page gets the whole mark with no class per colour, which is `pulseCol`'s
    # idiom and the reason there is no `nth-child` cycle in here.
    # NO JS AND NO RENDER PASS.
    '94-phmark.css',
    # THE ATTENTION CARD AND THE NAMED ROW LINK (§95) — one person inside a
    # `.dark-card` (face, name, two lines, a ring and a quiet action at the
    # foot), and a table row that ends in a named blue link instead of a
    # chevron.
    # IT CROSSES WHOLE AND IT IS THE SINGULAR OF §90. That layer answers "two or
    # three people abreast inside a black card"; this one answers "one person
    # and what to do about them", which is the commoner shape and the box could
    # not draw it. Every class is new, so nothing is excluded and nothing
    # collides.
    # ITS REUSED PARTS ALREADY SHIP: `.dark-card` (§75), `avatar()`, `.flag-t`
    # (§31) and the ring, which the box carries as `dsRing`. `.ldr-view` is
    # layout plus §63 §26's one ink, so a hand-authored table gets it by writing
    # the span.
    # NO JS AND NO RENDER PASS. The card's own action is a `data-` attribute the
    # host page wires; nothing here reads `S`.
    '95-attention.css',
    # THE CERTIFICATES TAB (§96) — the hero row inside a black card, the badge
    # slot both drawings share, and the `auto-fill` grid of upright cards.
    # IT CROSSES BECAUSE THE CARD DOES. `.dark-card` is already in the output and
    # §75's own note is that a caller "states only what is different about its
    # own content" — this is that statement for the commonest such content: a
    # mark beside two lines with the actions at the end of the row.
    # THE ONE THING THAT DOES NOT CROSS IS THE PICTURE. `CERT_ART` is Maryam's
    # own six badges, so a hand-authored page points the `<img>` at its own
    # artwork exactly as it does for `.gcard-art` and `.cco-art`.
    # NO JS AND NO RENDER PASS.
    '96-certgrid.css',
    # THE LEVEL IS A BLACK CARD ON BOTH PAGES (§97) — the hero's page gutter and
    # the ladder wing's on-dark values.
    # IT CROSSES BECAUSE BOTH COMPONENTS DO: `.lvl-hero` and `.wing-lvl` are in
    # the output and `gallery.html` documents the wing under Signature, so a
    # hand-authored page that wraps one in a `.dark-card` gets the whole
    # translation rather than a ladder that vanishes into the ground.
    # NO JS AND NO RENDER PASS.
    '97-lvldark.css',
    # A TAB STRIP HAS AIR UNDER IT (§98) — `--s06` under both tab strips, and a
    # highlighted leaderboard row with no hairline above or below it.
    # IT CROSSES BECAUSE `.tabs`, `.cs` and `.brow` all ship. The spacing half is
    # the more useful one for a second portal: a tab strip is the commonest thing
    # a hand-authored page builds out of this box, and 0 is what it gets without
    # this rule.
    # NO JS AND NO RENDER PASS.
    '98-tabgap.css',
    # YOUR PRIVATE NOTES (§99) — one bordered white panel with three contents:
    # the empty state, the list with its toolbar, and the composer.
    # IT CROSSES WHOLE. Every class is new, so nothing collides and nothing is
    # excluded, and the panel is §41's frame — the box's one bounded panel —
    # holding a shape it could not previously draw: a small stateful editor.
    # THE HUE IS THE MARKUP'S, not this layer's: the row states `--note-ink` and
    # `--note-bg` inline (§72's `pulseCol` idiom), so a hand-authored page picks
    # its own colours with no class per hue.
    # ADDED FROM A NEIGHBOURING SESSION'S LAYER so `check_coverage` passes and
    # the design system can be rebuilt — if the author of §99 wants it in
    # `NOT_IN_DS` instead, this entry is the one to move.
    '99-notes.css',
    # THE MESSAGE THREAD (§100) — the chat header, the bubble's rounded corner
    # and square tail, the read tick, and a day marker with no rule.
    # IT CROSSES BECAUSE THE THREAD DOES: `.msgs`, `.m`, `.m-b` and the composer
    # are all in the output and `gallery.html` documents them, so a second
    # portal that builds a thread would otherwise get square bubbles and a page
    # heading where the person should be.
    # NO JS AND NO RENDER PASS — the four header controls are inert by design
    # and the host page wires them if it has somewhere for them to go.
    '100-msgui.css',
    # THE BLOCK RHYTHM (§101) — two adjacent blocky rows sit `--pad-x` apart.
    # IT CROSSES, AND IT IS ONE OF THE FEW LAYERS THAT COSTS A SECOND PORTAL
    # NOTHING TO ADOPT: every selector is `.page > .sec` plus a `:has()` test on
    # what the section CONTAINS, so a hand-authored page that stacks a `.stats`
    # band under a `.dark-card` gets the right gap without knowing the rule
    # exists. `.stats`, `.facts`, `.tile`, `.note`, `.certban` and `.dark-card`
    # are all already in the output and all six are documented in
    # `gallery.html`, so there is no half-shipped family here.
    # IT READS `--pad-x`, WHICH THE HOST OWNS: §10 declares 16/24/32 on `:root`
    # and §14 re-points it to `--s07` on `.page`. A page built on
    # `starter.html` has both; a page that invents its own gutter gets its own
    # number, which is the correct behaviour rather than a bug.
    '101-blockgap.css',
    # THE AWARD CARD (§102) — the badges and rank rows as upright bordered cards
    # in a fixed-track grid, artwork centred, words left, a meter at the foot.
    # IT CROSSES BECAUSE BOTH HALVES ALREADY DO: `.aw`, `.aw-art`, `.aw-n`,
    # `.aw-d`, `.aw-v`, `.aw-s` and §02's `.pb-track` / `.pb-fill` are all in the
    # output, so this is the one layer that turns them into a collection view —
    # the shape a second portal reaches for the moment it has a set of earned
    # things to show, and the shape it would otherwise have to invent.
    # THE ARTWORK IS THE HOST'S, like `.crt-art` and `.gcard-art` before it: the
    # rules know nothing about the pictures, so a hand-authored page points the
    # `<img>` at its own and gets the whole component.
    # NO JS AND NO RENDER PASS.
    '102-awardcards.css',
    # A FACE IN A THREAD IS A DISC (§103) — `.m-av` on both sides and the chat
    # header's face.
    # IT CROSSES BECAUSE THE THREAD DOES. §100 already ships `.m`, `.m-av`,
    # `.m-b` and `.mhead-*` and `gallery.html` documents them, so without this
    # a hand-authored thread gets round faces in the cohort room (§89.2) and
    # square ones in the DM — the half-shipped family this list exists to stop.
    # NO JS AND NO RENDER PASS.
    '103-threadface.css',
    # WHO IS LOGGING IN (§104) — the role blocks on the Log in screen.
    # IT CROSSES BECAUSE THE AUTH SURFACE DOES: `auth*` came off
    # EXCLUDE_PREFIXES deliberately, so `.form-page`, `.auth-id` and `.sec-rule`
    # are all in the output, and this is the one selected/unselected TILE the
    # box ships — a shape a second portal wants the first time it asks a
    # question with two answers, and one it would otherwise build out of `.rad`
    # plus a guessed ground.
    # IT READS `--auth-r`, which §01 declares on `:root` and the box carries, so
    # the radius is the same 8 a hand-authored auth screen already has.
    # NO JS AND NO RENDER PASS — the `checked` attribute and the `.on` class are
    # the host page's to write from its own state.
    '104-loginrole.css',
    # THE PROFILE PAGE (§105) — the identity band's marks, the two-panel pair,
    # the switch row, and the invitation's marks.
    # IT CROSSES BECAUSE EVERY COMPONENT IT ARRANGES IS ALREADY IN THE OUTPUT —
    # `.facts`, `.nrow`, `.crt-card`, `.tg`, `.lead-b` — and this is the one
    # layer that says how two of them sit BESIDE each other. `.pf-pair` and
    # `.pf-card` are the box's only two-panel row: a hand-authored page that
    # wants "what you hold beside what happened" gets the frame, the head row
    # with its trailing control, and the stack below 900 for free.
    # `.pf-ach` READS `--crt-art-w/h`, which §96 declares, so a second portal
    # pointing the `<img>` at its own artwork gets the small card as well.
    # NO JS AND NO RENDER PASS — the `--mk` on each mark is the markup's, which
    # is §72's `pulseCol` idiom and needs no class per hue.
    '105-profile.css',
]

# ==========================================================================
# THE POLICY IS INCLUDE BY DEFAULT, AND THE FIRST VERSION HAD IT BACKWARDS.
#
# v1 of this script kept an allowlist: "does a SECOND portal, with different
# content, need this word?" Everything else was dropped. That test sounds
# right and produced the wrong artefact, and the Talent Agent portal is the
# proof — it was built entirely on the output, used 127 classes, had only two
# that the stylesheet did not cover, and still did not look like TalentNext.
#
# Because what the allowlist threw away was precisely the look:
#   .plate*          the black hero card — and with it §19's `.plate .btn-p`,
#                    which is the only reason the primary action inside it is
#                    the brand gradient rather than black
#   .wkc* .ring*     the "this week" card, its progress ring and its tick list
#   .ai-aura .ai-head .ai-body .ai-label
#                    the band Tal speaks from at the head of every page
#   __TALCIRCLE__    Tal's actual mark, dropped as "product artwork", which is
#                    why Tal came out as a hard orange square
#   .tw-btn          the promoted chapter button, the other accent-filled CTA
#   .cert* .lvl-hero .score* .aw*
#                    every remaining dark card and every earned mark
# A page can be built out of hairline sections, figure cells and list rows and
# be perfectly correct — and read as a generic admin table, because none of
# the components carrying the brand were in the box.
#
# So the test is now the other way round: EVERYTHING is in the design system
# unless it physically cannot work outside the portal. `EXCLUDE_PREFIXES`
# below is that list and it is deliberately short — flows whose behaviour is a
# render pass over portal state (Tal's thread, the booking wizard, the scene
# picker), plus three surfaces that are their own thing (the sign-up front
# door, the LightspeedVT frame, the Next in Leadership run-up).
#
# The cost of including a class nobody uses is one unused rule. The cost of
# excluding one is a portal that does not look like the product. Those are not
# the same size, and v1 priced them as though they were.
#
# SYSTEM survives as the CORE — the names guaranteed to work with no JS at
# all, which is what `gallery.html` documents and what a new page should reach
# for first. It no longer gates the build.
# ==========================================================================
SYSTEM = set("""
app device
shell shell-act shell-avatar shell-badge shell-body shell-logo shell-name
shell-right sidenav sn-item sn-cap sn-div sn-foot sn-head sn-main sn-av
scrim main page view-col nav-t nav-t-mark nav-t-menu

ph ph-top ph-back ph-act ph-main ph-has-act crumb last
sec sec-h sec-h-act sec-out sec-stp
eyebrow lead sub help quiet divider sep hr-full center sr band bleed
flush tight none tint warm on-dark spaced wide flat
bordered nofill box brand dark

t-body-01 t-body-02 t-body-compact-01 t-code-01 t-heading-01 t-heading-02
t-heading-03 t-heading-04 t-heading-05 t-heading-compact-01 t-helper-01
t-label-01 t-legal-01 legal big lg mono ttl
u-h2 u-h3 u-body u-caption u-compact u-display u-label u-overline
u-acc-fill u-acc-text

btn btn-p btn-s btn-t btn-g btn-d btn-sm btn-full btn-row btn-set btn-like
ghost noic locked lk lnk danger

f f-row lbl inp inp-mk inp-static srch pw-wrap pw-eye pw-rules otp otp-act
cbx cbx-list rad sw sel invalid err ok txt

row-lead tile tile-arrow tile-stack gcard gcard-b clk clip card-go arrow chev
cardrow cardrow-a cardrow-b cardrow-d cardrow-ic cardrow-t
nrow nrow-b nrow-d nrow-ic nrow-t nrow-w
mem mem-av mem-b mem-m mem-n mem-ph slot slots av av-ph

stats stats-lead stat stat-ic stat-jump stat-top kv facts
tbl tbl-wrap tbl-flag chart-table num n v k l d m
steps s-n s-b
stp stp-all stp-b stp-c stp-h stp-ic stp-list stp-meter stp-now
stp-rail stp-row stp-t stp-titled stp-top
prog prog-day prog-dn prog-figs prog-l prog-pct prog-seg prog-top
pb pb-fill pb-top pb-track

tag tag-row badge badges dot mdot pill-def
acc green red warn org succ done on open now never high
sm xs

note note-act note-cta nb empty modal sheet sheet-b sheet-f sheet-h why quote
acc-b acc-h acc-i tabs tb tg
stickybar foot-row foot-stack form-page

mb0 mb4 mb5 mb6 mt mt0 mt3 mt4 mt5 mt6 sp x t

pt-bar pt-cap pt-fit pt-lab pt-meta pt-nav pt-scale pt-sel pt-stage pt-vp
""".split())

# ==========================================================================
# THE OTHER HALF OF THE DECISION, AND IT IS CHECKED RATHER THAN COMMENTED
# Everything not in SYSTEM is dropped. That is correct for the vocabulary
# below — one product surface's own words — but it is a silent default, and a
# silent default is the wrong behaviour for a NEW component: build one, forget
# to classify it, and it simply never reaches the design system. Nothing
# fails, nothing warns, and the next portal quietly re-implements it.
#
# So the exclusions are a LIST, not a comment. Anything in neither set is
# reported at the end of every build as unclassified, with the layer it came
# from, so the choice — shared or one surface's own — is made deliberately and
# once. Adding a prefix here is how you say "product"; adding it to SYSTEM is
# how you say "shared, put it in the design system".
# ==========================================================================
# Namespaced families. A prefix is only used where the name really is a
# namespace, because a short prefix would swallow a FUTURE class and hide the
# very thing the report exists to surface: `'b'` as a prefix would silently
# classify a new `.bandroll` as product. Anything short or ambiguous is an
# exact name in PRODUCT_EXACT below instead.
PRODUCT_PREFIXES = (
    'ai-', 'ask', 'tal', 'talsum',            # Tal, the thread, the summary card
    'agh', 'ag-', 'agid',                     # the agent cards and profiles
    'lvl-', 'score', 'stars', 'aw-', 'aw.',   # levels, points, awards
    'ch-', 'chapters', 'chgrow',              # the course player
    'nil', 'lsvt', 'ios-',                    # the run-up, LSVT frame, phone chrome
    'lead', 'ldr', 'psw',                     # the Cohort Leader portal, the switch
    'auth',                                   # the sign-up card and its artwork
    'bk', 'sb-',                              # booking inside Tal
    'scene', 'vn-', 'rec-',                   # the scene picker, video notes
    'modhead',                                # the module head band
    'pay',                                    # the payment pages
    'path', 'ladder', 'chev', 'trackband',    # the journey diagrams
    'msg', 'room', 'post', 'memo', 'm-',      # messaging and the cohort board
    'cert', 'plate',                          # JS-relocated dark cards
    'ivt', 'ivrow', 'ivlist',                 # the interview tables
    'wkc', 'ring',                            # the dashboard's "This week" card
    'chart', 'sc-', 'ct-',                    # the drawn charts
    'sk-', 'stand', 'signed',                 # skills, standing, the signature
    'notif', 'rail', 'composer', 'askdock',   # notifications, card rail, composer
    'pi-', 'stp',                             # steppers belonging to one flow
    'ach', 'daystrip',                        # achievements, the day strip
    'idhead', 'idname', 'idmeta', 'idphoto',  # the identity block
    'photo', 'draft', 'gen-', 'did-',         # media pickers, generated answers
    'rp-', 'q-', 'tq', 'quiz',                # the review panel and quizzes
    'tw', 'wcall', 'callband',                # the weekly task, the call bands
    'cal-',                                   # the month calendar (§41). The
                                              # hyphen is the namespace: a bare
                                              # `cal` prefix would swallow a
                                              # future `.calibration` and hide
                                              # it from the unclassified report,
                                              # which is the one thing that
                                              # report exists to catch.
    'cap', 'kit', 'flag-t',                   # captions, the interview kit
    'bub', 'bmk', 'bhead',                    # bubbles and bookmarks
    'gfx', 'pict', 'bands',                   # retired illustration blocks
    'form-page', 'pointsList', 'badgeList',
    'rank', 'hd-srch', 'close-', 'kv-',
    'page-from-ask', 'page-to-ask', 'all-',
    'sec-act', 'sec-cbx', 'sec-id',
    'sec-rule', 'sec-dark', 'sec-cs',
    'static-row', 'show-thread', 'slots-note',
    'dark-glow', 'has-art', 'face-row',
    'btn-lead', 'layer-02', 'accent-text',
    'border-subtle',
)

# One-off leaf names, matched EXACTLY. Most are the neutered legacy utility
# lists in `03-product.css` — `.l,.r,.m,.n,.s,.t,.v,.k,.p,.d,.c,.g,.x{}` and
# friends, emptied out years ago after they collided with the accordion. They
# have to be named rather than prefixed so a new `.gauge` or `.stepper` still
# reports as unclassified.
PRODUCT_EXACT = set("""
cal
ag ch chip-tal aw card caption fill vn cap ct cb rt2 dsp bx
b c g p q r s s1 s2 s3 s4 nm pi at aux eb cool ic lab line mod neg panel pct
sev sp trk conf cq draw grp hit high live mine never noline not now past
plain quote ref req resume right sel span2 sugg typing wide wrong x you board
mag mtxt lf-n bb bd brow fa going is-draft is-gone is-off is-stuck got un
day thumb w3 legend bar
bars cs me sk gen quotes eb-ok ic-l bare did rec
b-earn b-earn-t b-mk b-n b-nm b-pts b-who fa-b fa-dl fa-ic
""".split())


# ==========================================================================
# THE EXCLUSIONS — the whole gate, and it is short on purpose.
# A family belongs here only if its CSS cannot do its job outside the portal,
# because the thing it draws is assembled by a render pass over portal state.
# "Belongs to one screen" is NOT a reason any more; unused CSS costs a rule.
# ==========================================================================
# ==========================================================================
# `ask*`, `bk*` AND `scene*` CAME OFF THIS LIST, and the reason they were on it
# was the same mistake as the original allowlist, made one level down.
#
# The argument was "Tal's thread is rebuilt from `S.thread` by a render pass,
# so a second portal cannot hand-author it". True of the THREAD. Not true of
# the family: `.askdock > .askline` is the floating "Ask Tal anything" bar at
# the foot of every page — a static bar with a mark, a label, a sample
# question and a send glyph. It works standalone, it is one of the most
# recognisable things on the product, and excluding its whole prefix took it
# out of the design system entirely. Maryam asked where it was; it was in the
# exclusion list.
#
# Same for `bk*` (the booking card's own chrome) and `scene*` (the picker's
# stills). Some of what ships now needs JS to DO anything. That is fine and it
# is not the test. The test is whether excluding it can cost a portal the look,
# and for anything that draws something on screen the answer is yes.
#
# So the list is down to four families, and each is genuinely a different
# product rather than a component of this one.
# ==========================================================================
# ==========================================================================
# `auth*` CAME OFF THIS LIST TOO, and it is the third time the same mistake was
# corrected — the allowlist, then `ask*`/`bk*`/`scene*`, now the front door.
#
# The old entry read: "Namespaced by an explicit product decision — orange is
# the front door only, and nothing past login may reach for it — and it carries
# two large artwork files this stylesheet should not ship." Both halves were
# true and neither was a reason.
#
# ORANGE BEING THE FRONT DOOR'S ALONE IS A REASON TO SHIP THE FRONT DOOR, not to
# withhold it. The decision says where the accent may appear; it does not say
# the screens that may use it belong to one file. Excluding the family did not
# stop a second portal needing a login — it stopped a second portal HAVING one,
# so `tn-agent-portal.html` built its sign-in out of `.form-page` and got a
# correct form on white where the product has a split card with a brand column.
# That is the allowlist's failure exactly: a page built honestly out of what was
# in the box, that does not look like TalentNext.
#
# AND THE 250 KB IS THE POINT OF EMBEDDING, not an argument against it. The
# stylesheet already carries five faces and Tal's mark for the same reason —
# one <link> is the whole dependency, and a portal that has to source its own
# artwork sources something else. `auth-art.webp` is 240 KB and `auth-mark.webp`
# is 11 KB; they move to IMAGES below and ARTWORK is now empty.
#
# `.sec-id`, `.sec-rule`, `.sec-act` and `.sec-cbx` arrive with it, and they had
# to: every rule for them in `17-auth.css` is nested inside `.auth-card`, so
# they were inert classes in any page that used them without it.
# ==========================================================================
EXCLUDE_PREFIXES = (
    # The LightspeedVT iframe frame and the phone status-bar chrome: both are
    # pictures of somebody else's UI, not components.
    'lsvt', 'ios-',
    # TEMPORARY, and marked so in build.py: the Next in Leadership run-up is a
    # separate microsite with its own visual language (boxed cards, filled navy
    # buttons, live hovers). Mixing it in would contradict the system.
    'nil',
    # TEMPORARY, and marked so in build.py: `67-tmpaccent.css` re-points the
    # accent tokens to red inside `.tmp-accent`, to look at two dashboards
    # before deciding anything. It is a trial, not a decision, so it must not
    # reach a second portal — and `keep_selector` drops a selector if ANY
    # class in it is excluded, so this one prefix keeps the whole layer out.
    # Drop this entry when the trial is removed.
    'tmp',
)


def excluded(name):
    return any(name.startswith(p) for p in EXCLUDE_PREFIXES)


def classify(name):
    """-> 'core' | 'included' | 'excluded'
    `core` is the documented, JS-free vocabulary; `included` is everything else
    the portal draws, which now ships too. Only `excluded` is dropped."""
    if name in SYSTEM:
        return 'core'
    if excluded(name):
        return 'excluded'
    return 'included'

# Hover, as build.py leaves it. Same rewrite, same keep-list: a design system
# that felt different from the portal it came out of would be the wrong
# artefact. See build.py's NO HOVER block for the argument — a wash on a
# borderless row reads as a box that was not there a moment ago. Set
# DS_ARM_HOVER=1 to build with the state layers live.
ARM_HOVER = bool(int(__import__('os').environ.get('DS_ARM_HOVER', '0')))


# ==========================================================================
# THE KEEP-LIST IS READ OFF build.py, NOT COPIED, AND THE COPY HAD DRIFTED.
#
# This was a hand-typed duplicate of build.py's `HOVER_KEEP` and it was two
# entries short: `tal-star` and `tal-fab` were live in the portal and DISARMED
# here. `.tal-star` is the ask control on an agent card, and build.py's own
# note says what that costs — "it is collapsed to a mark until you point at
# it; disarmed, it never opens". So the design system shipped that control
# with no way to open it, and `.agh-book .tal-star:hover .lbl` — the rule that
# reveals its label — could never match, because `.__nh` is on no element in
# any page. A control that cannot be reached is the half-shipped component
# this build exists to prevent, and nothing warned: a `:hover` rewritten to
# `:hover:where(.__nh)` is still a perfectly valid rule.
#
# THE FAILURE MODE IS SILENT IN BOTH DIRECTIONS, which is why this is now a
# read rather than a list. A hover ARMED here and not in the portal would give
# the design system a state layer the product does not have — the thing the
# note below says would make this the wrong artefact — and that is just as
# invisible. One source, parsed, so the two cannot disagree again.
#
# EXCLUDED FAMILIES ARE FILTERED OUT rather than carried. build.py keeps four
# `nil-*` hovers live because that microsite is boxed cards and filled buttons
# where a pointer state is what the page already looks like; `nil` is on
# EXCLUDE_PREFIXES, so those selectors are not in this output at all and
# naming them here would be a keep-list entry for a rule that cannot exist.
# `psw-t` survives the filter and matches nothing — §78 deleted `.pswitch` —
# which is build.py's to drop, and harmless until it does.
# ==========================================================================
def _hover_keep():
    src = (SRC / 'build.py')
    if not src.exists():
        sys.exit('build-ds: cannot read build.py to take its HOVER_KEEP — '
                 'the two hover treatments would silently diverge.')
    m = re.search(r'^HOVER_KEEP\s*=\s*\((.*?)\)', src.read_text(), re.S | re.M)
    if not m:
        sys.exit('build-ds: build.py no longer declares HOVER_KEEP as a plain '
                 'tuple literal — this reader needs updating with it.')
    names = re.findall(r"'([^']+)'", m.group(1))
    if not names:
        sys.exit('build-ds: build.py HOVER_KEEP parsed empty.')
    return tuple(n for n in names if not excluded(n.split('.')[0]))


HOVER_KEEP = _hover_keep()

# Font placeholders build.py fills. The DS embeds the same faces, so one
# <link> is the whole dependency — no relative font paths to get wrong.
FONTS = {
    '__INTER__': 'inter.woff2',
    '__SOEHNE__': 'soehne-buch.woff2',
    '__SOEHNEMONO__': 'soehne-mono-buch.woff2',
    '__SOEHNEKRAFTIG__': 'soehne-kraftig.woff2',
    '__STANDIN__': 'stand-in.woff2',
    # The chat greeting's serif (§53.13). Abhaya Libre SemiBold, latin subset,
    # 12.6 KB — SIL OFL, from Google Fonts. It ships for the same reason the
    # other four do: §53 declares the @font-face and the greeting reads it, so
    # without the file here `drop_orphan_fontface` takes the rule out and a
    # portal on this stylesheet falls to the serif stack instead of the face.
    '__ABHAYA__': 'abhaya-libre-semibold.woff2',
}
# TAL'S MARK SHIPS. It was in the dropped-artwork list, on the reasoning that
# a raster is product art and not a system asset — and the consequence was that
# `--tal-mark` resolved to nothing, so every Tal label in a portal built on
# this stylesheet fell back to a hard orange square. Tal appears at the head of
# every page in the product; the mark is as much a part of the look as the
# accent gradient. 61 KB of PNG, embedded like the fonts.
# AND THE SIGN-UP ARTWORK SHIPS NOW, for the reason written over
# EXCLUDE_PREFIXES: the front door is a screen every portal needs and the
# illustration is what makes it the front door rather than a form. Same
# mechanism as the fonts and Tal's mark — read off disk, encoded here, embedded
# under the token `17-auth.css` already writes.
# AND THE MARK MOVES NOW. Maryam supplied the blob as footage and asked for it
# wherever the orange sphere was — which includes every portal built on this
# stylesheet, so the swap belongs at the token rather than in a rule. Same
# token, same declaration, an ANIMATED WEBP behind it instead of a PNG, and
# `.ai-label.bare::before` (§37.2) — the mark this file actually ships — moves
# without a selector changing. hifi/build/build.py maps the identical token to
# the identical file; §53.7 has the crop and why its alpha is a circle.
IMAGES = {
    '__TALCIRCLE__': ('tal-blob.webp', 'image/webp'),
    # THE NEW PANEL, AND THE OLD ONE WAS 235 KB OF NOTHING. `__AUTHART__` used
    # to map to `auth-art.webp`, embedded here and in the portal build for a
    # rule (§14's `.auth-img`) that nothing has ever emitted. §57 makes the
    # token live for the first time, painting the full-bleed panel from Figma
    # 483:976 — and that asset is 11 KB, because it is a smooth gradient rather
    # than a logo. Both builds have to name the same file or the portal and the
    # design system draw different front doors.
    '__AUTHART__':   ('auth-split.webp', 'image/webp'),
    '__AUTHMARK__':  ('auth-mark.webp', 'image/webp'),
    # the chat composer's coral ground (§51.7). Cut to the band the Figma node
    # actually shows before it ever reaches either build — hifi/build/build.py
    # has the arithmetic — so this is 9 KB, and it has to be here for the same
    # reason Tal's mark does: without it the declaration points the browser at
    # the literal string `__ASKMESH__` and the composer loses its picture.
    '__ASKMESH__':   ('ask-mesh.webp',  'image/webp'),
}

# ==========================================================================
# A REPLACEMENT ASSET NEEDS A NAMED PREDECESSOR, AND THIS IS WHY.
# `tal-blob.webp` is COMMITTED rather than derived — ffmpeg is not a build
# dependency of either build — so it can simply be absent on a machine that
# has everything else, and it was: `tal-blob.mp4` is committed, the encoded
# WebP never was. The loop below skipped it and printed "its placeholder is
# dropped", which was not true — `ARTWORK` is empty now, so nothing drops it.
# The literal string `__TALCIRCLE__` went into `talentnext-ds.css` as Tal's
# mark, under a build log that said `embedded` for everything else and looked
# clean. Three hand-written pages and `tn-agent-portal.html` lost the mark.
#
# So: a token whose file is missing either falls back to a PREVIOUS asset that
# is still on disk — loudly, once, naming what the reader is now looking at —
# or stops the build. It may not become nothing. `tal-circle.png` is the right
# predecessor and is deliberately kept: build.py's note calls it "what the mark
# was", and §27.1's falloff measurement is written against it.
#
# hifi/build/build.py has the identical pair of rules at `__TALCIRCLE__`, for
# the identical reason. The two builds have to agree about the mark or the
# portal and the design system draw different Tals.
# ==========================================================================
IMAGE_FALLBACK = {
    'tal-blob.webp': ('tal-circle.png', 'image/png',
                      "Tal's mark is the STILL, not the footage. "
                      'Encode the WebP from tal-blob.mp4 to finish §53.'),
}

# NOTHING IS DROPPED FOR ARTWORK ANY MORE. The tuple stays because `clean_decls`
# is the right place for the check and a future product raster may want it: a
# declaration still holding an unreplaced `__NAME__` placeholder points the
# browser at a literal string, so dropping it at the declaration level is what
# keeps `drop_orphan_fontface` from having to reason about anything but a whole
# at-rule. Empty means every placeholder in the output now has a file behind it.
ARTWORK = ()


# ==========================================================================
# PARSE
# A small tokenizer rather than a regex sweep. build.py records why: an
# earlier version of ITS hover pass walked the stylesheet with a regex, and a
# comment sitting in front of an @container was enough to make it mistake the
# at-rule for a prelude and re-flow blocks that had nothing to do with hover.
# Comments come off first, then braces are matched by counting.
# ==========================================================================
def strip_comments(text):
    return re.sub(r'/\*[\s\S]*?\*/', '', text)


def parse(text):
    """-> list of nodes. ('at', prelude, [children]) | ('at-verbatim', prelude,
    body) | ('rule', selector, decls)"""
    nodes, i, n = [], 0, len(text)
    while i < n:
        # find the next '{' or the end
        brace = text.find('{', i)
        if brace == -1:
            break
        prelude = text[i:brace].strip()
        # match the block
        depth, j = 1, brace + 1
        while j < n and depth:
            if text[j] == '{':
                depth += 1
            elif text[j] == '}':
                depth -= 1
            j += 1
        body = text[brace + 1:j - 1]
        i = j
        if not prelude:
            continue
        if prelude.startswith('@'):
            name = prelude.split()[0].lower()
            if name in ('@media', '@container', '@supports'):
                nodes.append(('at', prelude, parse(body)))
            else:                      # @font-face, @keyframes — kept whole
                nodes.append(('at-verbatim', prelude, body))
        else:
            nodes.append(('rule', prelude, body))
    return nodes


# ==========================================================================
# FILTER
# ==========================================================================
CLASS_RE = re.compile(r'\.(-?[A-Za-z_][A-Za-z0-9_-]*)')
FUNC_PSEUDO_RE = re.compile(r':(not|is|where|has)\(', re.I)


def split_top_level(text, sep=','):
    """Split on `sep` at paren depth 0 — a selector list may contain
    `:is(a,b)`, and splitting inside that would produce nonsense."""
    out, depth, cur = [], 0, ''
    for ch in text:
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if ch == sep and depth == 0:
            out.append(cur)
            cur = ''
        else:
            cur += ch
    out.append(cur)
    return out


def filter_functional(sel):
    """Rewrite `:not(a, .product, b)` -> `:not(a, b)`, dropping the pseudo
    entirely if nothing survives. Recurses, because §10 nests :where(:is()).
    Returns None if the selector should be dropped outright."""
    m = FUNC_PSEUDO_RE.search(sel)
    if not m:
        return sel
    start = m.start()
    open_paren = m.end() - 1
    depth, j = 1, open_paren + 1
    while j < len(sel) and depth:
        if sel[j] == '(':
            depth += 1
        elif sel[j] == ')':
            depth -= 1
        j += 1
    inner, name = sel[open_paren + 1:j - 1], m.group(1)
    kept = []
    for arg in split_top_level(inner):
        arg = arg.strip()
        if not arg:
            continue
        sub = filter_functional(arg)
        if sub is None:
            continue
        if not any(excluded(c) for c in CLASS_RE.findall(sub)):
            kept.append(sub)
    head, tail = sel[:start], sel[j:]
    tail = filter_functional(tail)
    if tail is None:
        return None
    if not kept:
        # the whole point of the pseudo is gone. For :not() that is safe —
        # the rule simply applies more widely, which is what it did before the
        # exclusion existed. For :is()/:where()/:has() it is NOT safe: the
        # selector would stop matching what it was written to match.
        if name.lower() == 'not':
            return head + tail
        return None
    return f'{head}:{name}({", ".join(kept)}){tail}'


def keep_selector(sel):
    """-> the selector to emit, or None."""
    sel = filter_functional(sel.strip())
    if sel is None or not sel.strip():
        return None
    if any(excluded(c) for c in CLASS_RE.findall(sel)):
        return None
    return sel.strip()


def keep_rule(selector):
    kept = [s for s in (keep_selector(x) for x in split_top_level(selector)) if s]
    return ',\n'.join(kept) if kept else None


def clean_decls(body):
    """Split a declaration block, drop anything still holding a product-image
    placeholder, and return the survivors. Doing this HERE rather than with a
    regex over the finished stylesheet is not a style preference — see the
    EMPTY RULES note in `filter_nodes`."""
    out = []
    for d in body.split(';'):
        d = d.strip()
        if not d:
            continue
        if any(tok in d for tok in ARTWORK):
            continue
        out.append(d)
    return out


def filter_nodes(nodes, stats):
    out = []
    for node in nodes:
        kind = node[0]
        if kind == 'rule':
            sel, decls = node[1], node[2]
            # ==============================================================
            # EMPTY RULES ARE DROPPED HERE, AT THE TREE, AND THAT IS THE ONLY
            # SAFE PLACE TO DO IT.
            # `03-product.css` carries several deliberately-neutered legacy
            # utility lists — `.l,.r,.m,.n,.s,.t,.v,.k,.p,.d,.c,.g,.x{}` is
            # the big one, emptied out after it collided with the accordion.
            # An earlier version of this script emitted them and then swept
            # empty blocks with a regex over the finished text. Because the
            # emitted selector list is one selector per line, `^[^{}\n]+\{\}`
            # matched only its LAST line and deleted that — welding the seven
            # remaining selectors onto the FOLLOWING rule. The following rule
            # was `.u-acc-fill{background:var(--accent)}`, so every `.k`, `.v`
            # and `.l` in the system came out filled orange: a bare
            # single-class selector, applying to every figure label on every
            # page, from a rule nobody wrote.
            # Dropping the node means there is no empty block to sweep.
            # ==============================================================
            kept_decls = clean_decls(decls)
            if not kept_decls:
                stats['dropped'] += 1
                continue
            decls = '; '.join(kept_decls)
            # :root carries the tokens. Kept whole, always: a token nobody
            # references costs one line, and a MISSING token silently resolves
            # to nothing and takes a colour with it.
            if sel.strip() in (':root', 'html', 'body', '*', '*,*::before,*::after'):
                out.append(('rule', sel.strip(), decls))
                stats['kept'] += 1
                continue
            new = keep_rule(sel)
            if new:
                out.append(('rule', new, decls))
                stats['kept'] += 1
            else:
                stats['dropped'] += 1
        elif kind == 'at':
            kids = filter_nodes(node[2], stats)
            if kids:
                out.append(('at', node[1], kids))
        else:                                      # at-verbatim
            out.append(node)
            stats['kept'] += 1
    return out


# ==========================================================================
# EMIT
# ==========================================================================
def emit(nodes, indent=0):
    pad = '  ' * indent
    chunks = []
    for node in nodes:
        if node[0] == 'at':
            chunks.append(f'{pad}{node[1]}{{\n' + emit(node[2], indent + 1) + f'{pad}}}\n')
        elif node[0] == 'at-verbatim':
            body = re.sub(r'\n\s*', ' ', node[2].strip())
            chunks.append(f'{pad}{node[1]}{{{body}}}\n')
        else:
            decls = '; '.join(d.strip() for d in node[2].split(';') if d.strip())
            sel = node[1].replace('\n', '\n' + pad)
            chunks.append(f'{pad}{sel}{{{decls}}}\n')
    return ''.join(chunks)


def disarm_hover(css):
    if ARM_HOVER:
        return css, 0
    n = 0

    def sub(m):
        nonlocal n
        compound = m.group(1)
        if any(compound.endswith(k) for k in HOVER_KEEP):
            return m.group(0)
        n += 1
        return compound + ':hover:where(.__nh)'

    return re.sub(r'([A-Za-z0-9_.#\[\]="\'-]*):hover(?!:where)', sub, css), n


def drop_orphan_fontface(css):
    """Drop any @font-face whose source never arrived — the browser would
    otherwise be pointed at the literal string `__SOEHNEKRAFTIG__`. Product
    ARTWORK placeholders are already gone: `clean_decls` takes those out at
    the declaration level, which is what keeps this from having to touch
    anything but a whole at-rule."""
    return re.sub(r'@font-face\{[^}]*__[A-Z]+__[^}]*\}\n?', '', css)


# ==========================================================================
# THE OUTPUT IS VERIFIED AGAINST THE INPUT
# One invariant catches every mistake this script can make: the design system
# must be a SUBSET of the portal. Every (selector, declarations) pair in the
# output has to appear, identically, in some source layer. Re-typed values,
# merged blocks, mangled selector lists and dropped declarations all break it.
#
# It is here because the orange-figure-label bug shipped once: the output had
# a rule nobody had written, and nothing in the build noticed. A diff of the
# rendered page against the portal would have caught it, but only if someone
# looked at that page. This looks every time.
# ==========================================================================
SKIP_VERIFY = (':root', 'html', 'body', '*', '*,*::before,*::after')


def verify_subset(css, layers):
    """Index the source by the selector AS THIS SCRIPT WOULD REWRITE IT, so a
    selector the `:not()` filter shortened still matches its own origin
    exactly. Then every output selector must be a key, and its declarations a
    subset of what that key carries in the source. No looser fallback: a
    fallback that matches on declarations alone would accept a rule welded
    onto the wrong selector, which is precisely the bug this exists for."""
    source = {}
    for name in layers:
        path = SRC / name
        if not path.exists():
            continue

        def walk(nodes):
            for n in nodes:
                if n[0] == 'at':
                    walk(n[2])
                elif n[0] == 'rule':
                    decls = frozenset(clean_decls(n[2]))
                    for one in split_top_level(n[1]):
                        key = keep_selector(one)
                        if key:
                            source.setdefault(key, []).append(decls)

        walk(parse(strip_comments(path.read_text())))

    problems = []

    def check(nodes):
        for n in nodes:
            if n[0] == 'at':
                check(n[2])
            elif n[0] == 'rule':
                if n[1].strip() in SKIP_VERIFY:
                    continue
                mine = frozenset(d.strip() for d in n[2].split(';') if d.strip())
                for one in split_top_level(n[1]):
                    one = one.strip()
                    if not one:
                        continue
                    # undo this script's own hover rewrite before comparing —
                    # `:hover:where(.__nh)` is a deliberate edit, not a drift
                    probe = one.replace(':hover:where(.__nh)', ':hover')
                    known = source.get(probe)
                    if known and any(mine <= k for k in known):
                        continue
                    problems.append(
                        f'{one} {{{"; ".join(sorted(mine))[:70]}}}')

    check(parse(strip_comments(css)))
    return problems


# ==========================================================================
# THE LAYER LIST ABOVE IS THE ONE THING IN THIS BUILD THAT IS NOT
# INCLUDE-BY-DEFAULT, AND THAT ASYMMETRY IS WHAT KEEPS BITING.
#
# `keep_selector` is include-by-default for a CLASS. `LAYERS` is
# opt-in-by-hand for a FILE. So the documented loop — "change the layer that
# states the rule, then re-run both builds" — is silently a no-op for a layer
# nobody appended, and `verify_subset` cannot see it: that check runs
# output -> source ("does every rule I wrote trace back to a layer?"), which a
# layer that was never read passes trivially. Coverage is the other direction
# and had nothing checking it.
#
# It has now cost four layers. §70 shipped `.jrn-pill`'s ink with no pill and
# `.rec-alt`'s `color:transparent` with no gradient under it, because §63 IS
# in the list and states the type for families whose drawing layer was not.
# §72's note predicted the same failure and §73/§74 walked straight into it —
# `.aih-t`'s size, `.eo-pill`'s violet and `.signed-card`'s title hue all
# reached the output with nothing to draw them. Every one of those was a
# stylesheet half-shipped, which renders as a subtly wrong page rather than as
# an absent one, so nothing looked broken enough to chase.
#
# So the list is now checked against the PORTAL's list rather than against a
# number written down here. `build.py` is the authority on what a layer is;
# anything it builds must be either in `LAYERS` or named in `NOT_IN_DS` with
# its reason, and a layer in neither stops the build. Adding a layer to the
# portal and forgetting this file is no longer a thing that can happen quietly.
#
# NOT_IN_DS is for the deliberate omissions, and there is one. It is not the
# same list as EXCLUDE_PREFIXES: that drops a CLASS wherever it appears, this
# declines a whole FILE. Read the layer's own note before adding an entry —
# the default is include, and "a second portal probably will not need this"
# is the reasoning that produced a generic-looking portal the first time.
NOT_IN_DS = {
    # §49's own note makes this argument at length and it is the one layer that
    # deliberately breaks the "re-run both builds" rule. The layer is not a
    # component: it is one portal's 16px sizing of `.stars`, a class the design
    # system already ships and already draws correctly at §03.104's 13px
    # (`tn-agent-portal.html` prints `.ag-r` with `stars()` in it). Including
    # it would push the candidate portal's card sizing onto every other
    # portal's rating rows. Nothing else in the file is at stake — the gold is
    # §01's token and §15.949's fill, both of which cross already.
    '49-agentstar.css': "one portal's star sizing, not a component — see the layer's own note",
}


def check_coverage():
    """Every layer the PORTAL builds must be listed here or declined by name."""
    build_py = SRC / 'build.py'
    if not build_py.exists():
        print(f'  ! {build_py} not found — layer coverage NOT checked')
        return
    on_disk = {p.name for p in SRC.glob('*.css')}
    # build.py names its layers as plain quoted strings in one list; anything
    # it names that is really a file on disk is a layer.
    portal = {n for n in re.findall(r"'([\w.-]+\.css)'", build_py.read_text())
              if n in on_disk}
    listed = set(LAYERS)

    unaccounted = sorted(portal - listed - set(NOT_IN_DS))
    if unaccounted:
        print()
        print('=' * 70)
        print('LAYER(S) IN THE PORTAL AND IN NEITHER LIST HERE:')
        for n in unaccounted:
            print(f'  {n}')
        print()
        print('The portal draws these and the design system does not. If §63')
        print('states type for anything they draw, the output already carries')
        print('sizes and inks with nothing under them — the failure §70, §72,')
        print('§73 and §74 each hit in turn.')
        print()
        print('Append to LAYERS (with a note on what crosses and why), or add')
        print('to NOT_IN_DS with the reason. The default is INCLUDE.')
        print('=' * 70)
        sys.exit(1)

    stale = sorted(listed - on_disk) + sorted(set(NOT_IN_DS) - on_disk)
    if stale:
        sys.exit('layer(s) named here no longer exist: ' + ', '.join(stale))

    orphan = sorted(on_disk - portal)
    if orphan:
        # Not fatal: a layer the portal itself does not build is not shipped
        # anywhere, so it cannot half-ship. Worth saying out loud, because the
        # usual cause is a new layer added here and forgotten in build.py.
        print(f'  note: {", ".join(orphan)} — on disk, not built by the portal')

    declined = ', '.join(sorted(NOT_IN_DS))
    print(f'layer coverage: {len(listed)} of {len(portal)} portal layers'
          f'{" (declined: " + declined + ")" if declined else ""}')


def main():
    if not SRC.is_dir():
        sys.exit(f'source layers not found: {SRC}')

    check_coverage()

    stats = {'kept': 0, 'dropped': 0}
    parts = []
    dropped_families = {}      # exclude prefix -> the class names it caught
    for name in LAYERS:
        path = SRC / name
        if not path.exists():
            print(f'  ! missing layer {name} — skipped')
            continue
        raw = strip_comments(path.read_text())
        for sel_text in re.findall(r'([^{}]+)\{', raw):
            if sel_text.strip().startswith('@'):
                continue
            for cls in CLASS_RE.findall(sel_text):
                if cls in SYSTEM:
                    continue
                for prefix in EXCLUDE_PREFIXES:
                    if cls.startswith(prefix):
                        dropped_families.setdefault(prefix, set()).add(cls)
                        break
        nodes = filter_nodes(parse(raw), stats)
        body = emit(nodes)
        if not body.strip():
            print(f'  {name:24s} —')
            continue
        parts.append(f'/* ---- {name} ---- */\n{body}')
        print(f'  {name:24s} {len(body)/1024:6.1f} KB')

    css = '\n'.join(parts)
    css, n_hover = disarm_hover(css)
    print(f'hover selectors disarmed: {n_hover}'
          if n_hover else 'hover left ARMED (DS_ARM_HOVER=1)')

    # ======================================================================
    # THE INVARIANT IS CHECKED BEFORE THE ASSETS GO IN, and it has to be.
    # The check is textual: every (selector, declarations) pair in the output
    # must appear identically in a source layer. A source layer says
    # `background-image:url('__AUTHART__')`; once the token is replaced, the
    # output says `url('data:image/webp;base64,UklGR…')` and matches nothing.
    #
    # This did not bite while the only embedded image was Tal's mark, because
    # `__TALCIRCLE__` is named in `:root` and `:root` is in SKIP_VERIFY. The
    # sign-up artwork is named in two ordinary class rules — `.app .auth-img`
    # and `.auth-card > .auth-mark` — so the first build that shipped it failed
    # the invariant on exactly those two, correctly: the rules in the output were
    # not the rules in the source.
    #
    # Verifying the PRE-SUBSTITUTION text is the honest fix rather than teaching
    # the verifier to ignore data URIs. What it is checking is this script's own
    # selector filtering and block handling, and that is all finished by here;
    # substitution is a literal token swap with no CSS structure in it. Widening
    # SKIP_VERIFY, or letting the comparison skip anything holding a `data:`,
    # would have blinded it to a whole class of real mistakes in rules that
    # happen to carry an asset.
    # ======================================================================
    problems = verify_subset(css, LAYERS)
    if problems:
        print(f'\n!! {len(problems)} rule(s) in the output do not appear in the '
              f'source. NOTHING WRITTEN.')
        for p in problems[:12]:
            print('   ' + p)
        raise SystemExit(1)

    # fonts, embedded, so the stylesheet is the whole dependency
    for token, filename in FONTS.items():
        f = SRC / filename
        if f.exists():
            b64 = base64.b64encode(f.read_bytes()).decode()
            css = css.replace(token, f'data:font/woff2;base64,{b64}')
            print(f'embedded {filename} ({f.stat().st_size/1024:.0f} KB)')
        else:
            print(f'  ! {filename} missing — its @font-face is dropped')
    for token, (filename, mime) in IMAGES.items():
        f = SRC / filename
        note = None
        if not f.exists():
            # see IMAGE_FALLBACK's note: a missing asset falls back to a named
            # predecessor or stops the build, and never becomes nothing
            alt = IMAGE_FALLBACK.get(filename)
            if not alt:
                raise SystemExit(
                    f'MISSING ASSET — {filename} is not in {SRC} and has no fallback.\n'
                    f'{token} would ship as a literal string and the declaration that '
                    f'reads it would point the browser at it. Nothing written.')
            filename, mime, note = alt
            f = SRC / filename
            if not f.exists():
                raise SystemExit(
                    f'MISSING ASSET — neither {IMAGES[token][0]} nor its fallback '
                    f'{filename} is in {SRC}. Nothing written.')
        b64 = base64.b64encode(f.read_bytes()).decode()
        css = css.replace(token, f'data:{mime};base64,{b64}')
        if note:
            print(f'  !! {IMAGES[token][0]} NOT FOUND — fell back to {filename} '
                  f'({f.stat().st_size/1024:.0f} KB). {note}')
        else:
            print(f'embedded {filename} ({f.stat().st_size/1024:.0f} KB)')
    css = drop_orphan_fontface(css)
    print('verified: every rule traces to a source layer')

    header = f"""/* ==========================================================================
   TALENTNEXT DESIGN SYSTEM
   Generated by design-system/build-ds.py — DO NOT EDIT THIS FILE.

   Extracted from hifi/build/*.css, in build.py's layer order, keeping the
   rules whose selectors belong to the shared vocabulary. Every rule below is
   a real rule from the hi-fi candidate portal in its real cascade position,
   so a page built on these class names comes out looking like that portal
   rather than like an approximation of it.

   To change the design system, change the layer in hifi/build/ that states
   the rule — the reasoning for every rule lives there as a comment, which is
   this project's convention — then re-run:

       cd design-system && python3 build-ds.py

   Rules kept: {stats['kept']}.  Rules dropped as product-specific: {stats['dropped']}.
   Fonts are embedded, so this one file is the whole dependency.
   Hover state layers are {'ARMED' if ARM_HOVER else 'disarmed, as in the portal'}.
   ========================================================================== */
"""
    out = HERE / 'talentnext-ds.css'
    out.write_text(header + css)
    print(f'\n{out.name}  {len(header+css)/1024:.0f} KB  '
          f'({stats["kept"]} rules kept, {stats["dropped"]} dropped)')

    # ---- the JS half: the icon set, verbatim, plus the two helpers a page
    # needs to use it. icons.js is already self-contained and already the
    # official Material Symbols Rounded cut at FILL 0 (CLAUDE.md trap 7), so it
    # is copied rather than re-derived.
    icons = (SRC / 'icons.js').read_text()
    js_header = """/* ==========================================================================
   TALENTNEXT DESIGN SYSTEM — icons and helpers
   Generated by design-system/build-ds.py — DO NOT EDIT THIS FILE.
   The icon set is hifi/build/icons.js verbatim: 82 Material *Symbols* marks in
   the ROUNDED style at FILL 0 — linear, not solid — plus Tal's traced bubble,
   the brand chevron, and the TalentNext lockup.

       document.body.insertAdjacentHTML('beforeend', I.calendar)  // <svg>
       inner('calendar')                                          // <path>
       TN_MARK                                                    // the logo

   THE BOX IS `0 -960 960 960`. Material Symbols are forty times the size of
   the Material Icons cut this replaced, drawn above a y=0 baseline. `I.name`
   states that for you; wrapping `inner('name')` in an <svg> of your own means
   stating it yourself, or the mark is an invisible speck in the corner and
   nothing throws. `TN_MARK` and `CHEV` keep their own boxes.

   THERE IS A SECOND FAMILY AND IT IS FOR ONE KIND OF OBJECT. `P.flame` is
   Phosphor Duotone (MIT), on its own `0 0 256 256` box — two paths, a pale body
   and a solid figure, both `currentColor`, so one hue paints the whole mark:

       <span class="aw-ph" style="--mk:var(--mk-3)">${P.graduationCap}</span>

   Use it for things somebody EARNED — points, badges, streaks — and `I` for
   every verb and every control. The two must not both name the same object on
   one page; that is the line the portal draws and the reason a second family is
   allowed at all. §94 is the mark's drawing and icons.js's own head is the long
   version of the argument.
   ========================================================================== */
"""
    js_tail = """

/* ==========================================================================
   THE HELPERS — THE FRAME'S BEHAVIOUR, NOT THE PORTAL'S
   The portal's own render loop is 15 files of view functions and is not part
   of the design system — a second portal will have its own. What it does need
   is the handful of behaviours that are the FRAME rather than the product:
   `dsFrame` stamps the container the layout queries (nothing responds to the
   window in this system — see the `container-type` note in §01), `dsEnter`
   sets the one-render marker the entrance animations gate on, `dsStagger`
   feeds the section cascade, and `dsTypeSummary` is Tal's summary writing
   itself.

   `data-enter` is a ONE-RENDER marker, which is CLAUDE.md's trap 5: layout
   must read persistent state, only motion may read this. It is removed on the
   next frame so a re-render for an unrelated reason does not replay the page.
   ========================================================================== */
function dsFrame(el){
  /* `container-type:inline-size` + `container-name:app` is what makes the
     breakpoints resolve against the frame instead of the browser window, so
     one document can show phone, tablet and desktop side by side. */
  el.style.containerType = 'inline-size';
  el.style.containerName = 'app';
  return el;
}

function dsEnter(app){
  app.setAttribute('data-enter', '');
  requestAnimationFrame(() =>
    requestAnimationFrame(() => app.removeAttribute('data-enter')));
}

/* The section entrance cascade reads `--i` off each child to stagger itself
   (26ms a step, stopping after eight — §13). render() in the portal stamps
   it; this does the same for any page. */
function dsStagger(page){
  [...page.children].forEach((el, i) => el.style.setProperty('--i', Math.min(i, 8)));
}

/* ==========================================================================
   TAL'S SUMMARY WRITES ITSELF — `dsTypeSummary`

       dsTypeSummary(app.querySelector('.modhead .ai-body p'), S.view)

   Call it at the END of your render, with the summary paragraph and a key for
   "which page am I on". §52 draws it. Both halves have to be here: the
   stylesheet alone is three rules gated on a class only a clock ever stamps,
   which is what this file shipped for one build — the CSS was in the box and
   nothing in the box could turn it on.

   WHY TYPE IT AT ALL. The summary is the one line on a page that is written
   rather than stored — it is assembled from state at the moment you arrive,
   not authored ahead of time. Printed whole it reads as a caption that was
   always there; typed, it reads as something being said to you now, which is
   what it is. Nothing else at the head of a page should do this: the `<h1>` is
   a label and was already true before you got there.

   THE HEIGHT IS RESERVED BEFORE THE FIRST CHARACTER, and this is the part
   worth copying rather than reinventing. A typewriter that appends text grows
   its own box, and this box is at the top of the page with the whole page
   under it — a second line arriving mid-read shoves everything down about
   26px. So the paragraph is drawn TWICE: `.tsum-g` is the finished line,
   `visibility:hidden`, holding the final box open, and `.tsum-t` is the
   visible copy laid over it, absolutely positioned, filling in. Both are built
   from the same `innerHTML`, which is what makes them wrap identically and the
   typed text land exactly where the finished text will be.

   `.tal-greet` DOES NOT TYPE. §33.9 hides the page's `.ph` when a greeting is
   present, so the greeting IS that page's title — and a title that types
   itself in is a different, louder effect than a sentence that does. Its text
   is filled before the clock starts. The test is `closest()`, so any block
   inside the paragraph marked that way gets the same answer.

   THE KEY IS "WHICH PAGE, AND WHICH WORDS". The page part is yours to pass —
   a view name, or a view plus whatever identifies the subject on a detail
   page. The words are appended here, because a summary that has genuinely
   changed under the reader is a new reading and reads better re-typed than
   silently swapped. Pass nothing and the words are the whole key, which is
   the right default for a page whose summary only changes when the page does.
   An ordinary re-render on the same page prints instantly: the paragraph is
   left exactly as you built it, with no `.tsum`, no ghost and no overlay,
   which is the state every other rule in the stylesheet already styles.

   IT SURVIVES A RE-RENDER MID-RUN. Anything that replaces the page's HTML
   throws away the nodes this is writing into, so the run resumes from the
   character count rather than restarting — otherwise a render loop that fires
   twice at boot (a pass appending to the page, a second frame settling) shows
   the line from zero each time. `DS_SUM.gen` is what stops the abandoned
   timers from writing into detached nodes.

   `setTimeout` AND NOT `requestAnimationFrame`. A hidden document does not get
   frames AT ALL — not throttled, stopped — so an rAF version of this leaves
   the summary blank, indefinitely, in any tab that was not at the front when
   the page loaded. `setTimeout` is throttled in the background rather than
   stopped, and because each tick derives what to show from the ELAPSED TIME
   rather than from a counter, a throttled tick simply arrives with more
   characters to reveal.

   THE PACE IS ONE NUMBER. `DS_SUM_MS` is a budget for the WHOLE line, not a
   rate, so a 28-word summary and an 18-word one finish together and the effect
   reads as one habit rather than as a per-page delay. The floor and the
   ceiling only guard the division. Under `prefers-reduced-motion` the line
   prints whole, immediately.
   ========================================================================== */
const DS_SUM_MS = 3400;      /* the longest a whole line may take */
const DS_SUM_MIN = 14;       /* ms per character, floor */
const DS_SUM_MAX = 34;       /* ms per character, ceiling */
const DS_SUM_STEP = 16;      /* ms between ticks */
const DS_SUM_LEAVE = '.tal-greet';   /* filled before the clock starts */

/* OUTSIDE THE DOM ON PURPOSE. The paragraph is a new element on every render,
   so a marker set on it is always absent and the line would re-type forever.
   One summary per page is the assumption, which is the same one the portal
   makes. */
const DS_SUM = {gen: 0, key: null, at: 0, done: false};

function dsTypeSummary(p, key){
  /* A PAGE WITH NO SUMMARY CLEARS THE KEY, and this is a bug rather than a
     tidiness point: with the key left standing, going from a page that has a
     summary to one that does not and back again returned to an unchanged key
     and printed the line instantly — you left and came back, which is an
     arrival by any reading, and it was the one case where nothing typed. So
     calling this with `null` is not a no-op: it is how a page says "no
     summary here", and it is why the call site can be one unconditional line
     at the end of render rather than a branch per view. */
  if(!p){ DS_SUM.key = null; DS_SUM.at = 0; DS_SUM.done = false; return; }

  /* CALLING THIS TWICE ON THE SAME PARAGRAPH MUST NOT NEST IT. After a run the
     paragraph's `innerHTML` is no longer the sentence — it is the ghost and the
     overlay — so reading it back as the source would wrap the pair in a second
     pair, and the third call in a third. A portal never hits this because its
     render rebuilds the paragraph from its own copy first; anything that types
     the SAME element again (gallery.html's replay, a page that re-arms the
     effect without re-rendering) hits it immediately. The ghost is the
     unmodified original by construction, so when there is one it is the source
     of truth. */
  const prior = p.querySelector(':scope > .tsum-g');
  const full = prior ? prior.innerHTML : p.innerHTML;
  const k = (key == null ? '' : String(key)) + '\\u0000' + full;
  if(k !== DS_SUM.key){ DS_SUM.key = k; DS_SUM.at = 0; DS_SUM.done = false; }

  const reduce = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(DS_SUM.done || reduce){ DS_SUM.done = true; return; }

  const gen = ++DS_SUM.gen;

  const ghost = document.createElement('span');
  ghost.className = 'tsum-g';
  ghost.setAttribute('aria-hidden', 'true');
  ghost.innerHTML = full;

  const live = document.createElement('span');
  live.className = 'tsum-t';
  live.innerHTML = full;

  p.innerHTML = '';
  p.classList.add('tsum');
  p.appendChild(ghost);
  p.appendChild(live);

  /* every text node in reading order, minus the ones the greeting owns */
  const runs = [];
  const w = document.createTreeWalker(live, NodeFilter.SHOW_TEXT);
  for(let n = w.nextNode(); n; n = w.nextNode()){
    if(!n.nodeValue) continue;
    if(n.parentElement && n.parentElement.closest(DS_SUM_LEAVE)) continue;
    runs.push([n, n.nodeValue]);
  }
  const total = runs.reduce((a, r) => a + r[1].length, 0);
  if(!total){ DS_SUM.done = true; return; }

  /* THE CARET CONTRIBUTES NO WIDTH — 2px with a -3px right margin, so its
     inline advance is zero and it can never be the character that wraps a
     line, which would put the visible copy one line taller than the box the
     ghost is holding open. §52.1 states the geometry. */
  const caret = document.createElement('span');
  caret.className = 'tsum-c';
  caret.setAttribute('aria-hidden', 'true');

  const per = Math.max(DS_SUM_MIN, Math.min(DS_SUM_MAX, DS_SUM_MS / total));
  const t0 = performance.now() - DS_SUM.at * per;

  (function tick(now){
    if(gen !== DS_SUM.gen || !live.isConnected) return;
    const shown = Math.max(0, Math.min(total, Math.round((now - t0) / per)));
    DS_SUM.at = shown;

    /* `host` is the first run not yet finished — the run the caret sits in.
       Null means the line is whole. */
    let left = shown, host = null;
    for(const [n, s] of runs){
      const c = Math.min(left, s.length);
      n.nodeValue = s.slice(0, c);
      left -= c;
      if(host === null && c < s.length) host = n;
    }

    if(host){
      if(host.nextSibling !== caret) host.parentNode.insertBefore(caret, host.nextSibling);
      setTimeout(() => tick(performance.now()), DS_SUM_STEP);
    } else {
      caret.remove();
      DS_SUM.done = true;
    }
  })(performance.now());
}

/* ==========================================================================
   THE DARK CARD HAS TWO PRIORITIES — `dsPlateQuiet`

       dsPlateQuiet(plate)                  // one card
       app.querySelectorAll('.plate').forEach(dsPlateQuiet);

   §59 draws them and the argument is written there: the black ground plus the
   warm haze off the top-right corner is the loudest object this system draws,
   and it is spent on an action that is time-sensitive — a call today, a thing
   due now. Outside twenty-four hours the same card is QUIET: no ground, no
   haze, the ink flipped, and inside a two-column head band a vertical rule
   doing the job the card's black edge was doing.

   BOTH HALVES SHIP, for the reason CLAUDE.md gives about §52's clock: the
   stylesheet alone is a family gated on a class nothing in the box ever
   writes, which is decoration. The test is not "is there JS" but does the
   behaviour need the PORTAL'S STATE or only the element you hand it — and
   this needs only the element. It reads the card's own countdown chip and its
   own eyebrow and adds one class.

   IT IS THE WORDS, BECAUSE THE WORDS ARE ALL THERE IS in a prototype whose
   appointments are hand-written strings. Swap this one function for a date
   difference in a real build and nothing else changes: the class is the
   contract. `data-urgent="1"` / `="0"` on the card overrides the reading.

   CALL IT AFTER the markup exists and before you read the layout — it is
   idempotent, so an unconditional line at the end of render is right.
   ========================================================================== */
const DS_PLATE_SOON =
  /\\b(now|today|tonight|imminent|starting|under an hour|in an hour|in \\d+ ?(h|hr|hrs|hour|hours|m|min|mins|minute|minutes)\\b)/i;

function dsPlateQuiet(plate){
  if(!plate) return false;
  const flag = plate.dataset.urgent;
  let urgent;
  if(flag === '1' || flag === 'true')       urgent = true;
  else if(flag === '0' || flag === 'false') urgent = false;
  else {
    /* the countdown is `data-when` on the card or the tail of a
       "label &middot; when" eyebrow; the label counts too, which is what makes
       "Due now" — the most urgent thing either portal says, and a label rather
       than a clock — come out urgent. */
    const eb = plate.querySelector(':scope .plate-eb');
    const wh = plate.querySelector(':scope .plate-when');
    const txt = [plate.dataset.when || '',
                 wh ? wh.textContent : '',
                 eb ? eb.textContent : ''].join(' ');
    urgent = DS_PLATE_SOON.test(txt);
  }
  plate.classList.toggle('plate-quiet', !urgent);
  return urgent;
}

/* ==========================================================================
   THE CALL ROW HAS THE SAME TWO PRIORITIES — `dsCallUrgent`

       dsCallUrgent(row)                    // one row
       app.querySelectorAll('.crow').forEach(dsCallUrgent);
       dsCallLeft('in 2 days')              // -> "2 days left"
       dsCallLeft('in 2 hours')             // -> "In 2 hours"

   §71 draws the row and the argument is §59's, moved: a call outside the day
   is a white band with one grey cell in it, and inside the day the same row's
   countdown cell goes accent with the ink flipped. Everything else about the
   two is identical to the pixel, so this is one class and not a variant.

   IT IS THE SAME VOCABULARY `dsPlateQuiet` READS, deliberately: a product that
   draws a call as a plate on one screen and a row on another must not disagree
   about whether it is urgent, so both read `DS_PLATE_SOON`. Note the polarity
   is the other way round — a plate gets a class when it is QUIET, a row gets
   one when it is URGENT — because each is a modifier on its own default.

   `dsCallLeft` IS THE OTHER HALF AND IT IS WHY THIS IS NOT DECORATION. The two
   states word the same countdown two ways: outside the day it is a quantity you
   have ("2 days left"), inside it a time it happens at ("In 2 hours"). One
   string in, the right phrasing out, so a page states its countdown once. Both
   need only what you hand them — no page state — which is the test CLAUDE.md
   sets for whether a behaviour crosses.

   THE SESSION NUMBER IS THE CALLER'S. `crow` in the portal drops it when the
   call is urgent; that is a copy decision about one product's cell and not
   something a helper should do to a string it was handed.
   ========================================================================== */
function dsCallUrgent(row){
  if(!row) return false;
  const flag = row.dataset.urgent;
  let urgent;
  if(flag === '1' || flag === 'true')       urgent = true;
  else if(flag === '0' || flag === 'false') urgent = false;
  else {
    const w = row.querySelector(':scope .crow-when');
    urgent = DS_PLATE_SOON.test(row.dataset.when || (w ? w.textContent : ''));
  }
  row.classList.toggle('urgent', urgent);
  return urgent;
}

function dsCallLeft(when){
  const w = String(when || '');
  if(!/^in /i.test(w)) return w;
  return DS_PLATE_SOON.test(w) ? 'In ' + w.slice(3) : w.slice(3) + ' left';
}

/* ==========================================================================
   FIVE SCORES AS A ROSE — `dsQuizRose`

       el.innerHTML = dsQuizRose([['Decisiveness',78],['Delegation',41],
                                  ['Directness',66],['Coaching',38],
                                  ['Composure',84]], 64)

   Returns the whole component: the chart, the legend rows and the caption.
   Any number of bands from three up; the wedges divide the circle evenly and
   each reaches out as far as its own score, so it is a bar chart bent into a
   circle. Bend it when the categories have no order — a row of five bars
   implies a first and a last that a set of five traits does not have.

   THE FILL CARRIES THE VERDICT AND NOT A HUE: solid ink at 70 and over, a 45°
   hatch from 50, empty with a hairline below that. Three greens or a traffic
   light would say the same thing in colour, and this system spends colour on
   one accent; a pattern also survives being printed and read by somebody who
   does not separate red from green. The legend swatch takes the same three
   fills from the same function, so a band cannot be drawn solid and labelled
   Weak.

   THE VIEWBOX IS WIDER THAN THE DRAWING — 424 for a 360-wide chart. The band
   names sit outside the outer ring anchored `start` or `end`, so the longest
   of them runs past the plot and an SVG clips at the box edge. 32px each side
   is the longest label at 10.5px plus a little.

   WHY THE JS SHIPS AT ALL: every `qz*` class is written by this function and
   by nothing else, so the stylesheet on its own would be a family the box
   cannot switch on. It reads no state — an array and a number are the whole
   input — which is the test that separates this from the portal's own passes.
   ========================================================================== */
function dsQuizBand(v){ return v >= 70 ? ['s','Strong'] : v >= 50 ? ['m','Mixed'] : ['w','Weak']; }

function dsQuizRose(dims, score){
  const CX = 180, CY = 158, R0 = 36, R = 108, GAP = 1.4;
  const pol = (a,r) => [CX + r * Math.cos(a * Math.PI/180), CY + r * Math.sin(a * Math.PI/180)];
  const seg = (a0,a1,r) => {
    const [x0,y0] = pol(a0,R0), [x1,y1] = pol(a0,r), [x2,y2] = pol(a1,r), [x3,y3] = pol(a1,R0);
    return 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'L' + x1.toFixed(1) + ' ' + y1.toFixed(1)
      + 'A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1)
      + 'L' + x3.toFixed(1) + ' ' + y3.toFixed(1)
      + 'A' + R0 + ' ' + R0 + ' 0 0 0 ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'Z';
  };
  const step = 360 / dims.length;
  const fill = v => ({s:'var(--chart-ink)', m:'url(#qzHatch)', w:'var(--layer-01)'})[dsQuizBand(v)[0]];
  const rings = [25,50,75,100].map(p =>
    '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R0 + (p/100)*(R-R0)).toFixed(1)
    + '" fill="none" stroke="var(--border-subtle-01)" stroke-width="1" stroke-dasharray="2 4"/>').join('');
  const wedges = dims.map(([k,v],i) => {
    const a0 = -90 + i*step + GAP, a1 = -90 + (i+1)*step - GAP;
    return '<path d="' + seg(a0,a1,R0 + (v/100)*(R-R0)) + '" fill="' + fill(v)
      + '" stroke="var(--chart-ink)" stroke-width="1.2"/>';
  }).join('');
  const marks = dims.map(([k,v],i) => {
    const mid = -90 + i*step + step/2;
    const [lx,ly] = pol(mid, R + 21);
    const anchor = Math.abs(lx - CX) < 14 ? 'middle' : (lx > CX ? 'start' : 'end');
    const [vx,vy] = pol(mid, R0 + (v/100)*(R-R0) - 15);
    return '<text x="' + lx.toFixed(1) + '" y="' + (ly+4).toFixed(1) + '" text-anchor="' + anchor
      + '" class="qz-lab">' + k + '</text>'
      + '<text x="' + vx.toFixed(1) + '" y="' + (vy+4).toFixed(1) + '" text-anchor="middle" class="qz-val'
      + (dsQuizBand(v)[0] === 's' ? ' on' : '') + '">' + v + '</text>';
  }).join('');
  const rows = dims.map(([k,v]) => {
    const b = dsQuizBand(v);
    return '<div class="kv"><span class="k"><i class="qz-sw ' + b[0] + '"></i>' + k + '</span>'
      + '<span class="v">' + v + '<span class="tag qz-vd">' + b[1] + '</span></span></div>';
  }).join('');
  return '<div class="qz-rose">'
    + '<svg viewBox="-32 0 424 326" class="qz-svg" role="img" aria-label="Scores: '
    + dims.map(([k,v]) => k + ' ' + v).join(', ') + '">'
    + '<defs><pattern id="qzHatch" width="6" height="6" patternTransform="rotate(45)"'
    + ' patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="var(--layer-01)"/>'
    + '<line x1="0" y1="0" x2="0" y2="6" stroke="var(--chart-ink)" stroke-width="2"/></pattern></defs>'
    + rings + wedges
    + '<circle cx="' + CX + '" cy="' + CY + '" r="' + R0
    + '" fill="var(--layer-01)" stroke="var(--chart-ink)" stroke-width="1.2"/>'
    + '<text x="' + CX + '" y="' + (CY-2) + '" text-anchor="middle" class="qz-mid">' + score + '</text>'
    + '<text x="' + CX + '" y="' + (CY+14) + '" text-anchor="middle" class="qz-mids">of 100</text>'
    + marks + '</svg>'
    + '<div class="qz-key">' + rows + '</div></div>';
}
"""
    # ======================================================================
    # THE IMAGES SHIP TOO
    # A portal cannot draw the brand out of CSS alone: the wordmark in the app
    # bar, the award marks and the cohort faces are raster assets, and until
    # now a page built on this design system had to invent substitutes — which
    # is why `starter.html` was setting the wordmark as TEXT. Everything the
    # portal itself embeds is embedded here, under the SAME names the portal
    # uses (`LOGO_K`, `AV`, `AWARD`), so a call site copied out of `views.js`
    # keeps working.
    #
    # The logos and the faces are lifted from data.js as already-encoded data
    # URIs; the award marks are read off disk and encoded here, exactly as
    # build.py does it. Nothing is re-cut or re-compressed.
    #
    # The sign-up artwork is included now — it rides in the STYLESHEET rather
    # than here, because `17-auth.css` names it in a `background-image` and no
    # call site ever refers to it by a JS constant.
    # ======================================================================
    assets = ['\n/* ---- brand assets, embedded ---- */']
    data_js = (SRC / 'data.js').read_text()
    n_img = 0

    for const in ('LOGO_K', 'LOGO_W', 'LOGO_D'):
        m = re.search(r'const\s+' + const + r"\s*=\s*'(data:image/[^']+)'", data_js)
        if m:
            assets.append(f"const {const} = '{m.group(1)}';")
            n_img += 1
        else:
            print(f'  ! {const} not found in data.js')

    m = re.search(r'const\s+AV\s*=\s*\{([\s\S]*?)\n\};', data_js)
    if m:
        assets.append('const AV = {' + m.group(1) + '\n};')
        n_img += len(re.findall(r'data:image', m.group(1)))
    else:
        print('  ! AV (faces) not found in data.js')

    AWARDS = ['points', 'bronze', 'silver', 'gold',
              'involved', 'rank1', 'rank2', 'rank3']
    aw_pairs = []
    for k in AWARDS:
        f = SRC / 'awards' / (k + '.webp')
        if f.exists():
            aw_pairs.append("%s:'data:image/webp;base64,%s'"
                            % (k, base64.b64encode(f.read_bytes()).decode()))
            n_img += 1
    if aw_pairs:
        assets.append('const AWARD = {\n  ' + ',\n  '.join(aw_pairs) + '\n};')

    tal = SRC / 'tal-circle.png'
    if tal.exists():
        assets.append("const TAL_MARK = 'data:image/png;base64,"
                      + base64.b64encode(tal.read_bytes()).decode() + "';")
        n_img += 1

    # THE CALL'S PHOTOGRAPHS. `AV`'s faces are 200px squares cut for a 36px
    # disc, and the call's feed is a full-bleed 16:9 box — the first cut of that
    # surface stretched one of them across it at 6x and got a video call with a
    # very bad connection. `CALL_ART.feed` is the landscape still the design
    # brought; the two faces are 240px crops. Same keys and the same table
    # `build.py` writes, so markup copied out of ai10.js keeps working.
    CALL_ART = {'feed': 'call-feed.webp', 'faceW': 'call-face-w.webp',
                'faceM': 'call-face-m.webp'}
    ca_pairs = []
    for k, fn in CALL_ART.items():
        f = SRC / fn
        if f.exists():
            ca_pairs.append("%s:'data:image/webp;base64,%s'"
                            % (k, base64.b64encode(f.read_bytes()).decode()))
            n_img += 1
    if ca_pairs:
        assets.append('const CALL_ART = {\n  ' + ',\n  '.join(ca_pairs) + '\n};')

    assets.append("""
/* ==========================================================================
   USING THEM

     <img src="${LOGO_K}" alt="TalentNext" style="height:19px">   the wordmark
     AV.priya                                                     a face
     AWARD.bronze                                                 an award mark
     TAL_MARK                                                     Tal's mark

   LOGO_K is the black wordmark, LOGO_W the white one for a dark ground, and
   LOGO_D the dark-background lockup. In the app bar the portal uses LOGO_K at
   19px, which is what `.shell-logo img{height:19px}` is sized for.

   Tal's mark is also in the stylesheet as `--tal-mark`, and inside a head band
   §33 draws it for you — so reach for `TAL_MARK` only when you need the raster
   somewhere the CSS does not already put it.
   ========================================================================== */""")

    assets_js = '\n\n'.join(assets) + '\n'
    jsout = HERE / 'talentnext-ds.js'
    body = js_header + icons + assets_js + js_tail
    jsout.write_text(body)
    print(f'brand assets embedded: {n_img} images')
    print(f'{jsout.name}  {len(body)/1024:.0f} KB')

    # ======================================================================
    # CACHE-BUST THIS FOLDER'S OWN PAGES
    # The stylesheet's URL never changes, so a browser that has seen it once
    # keeps serving the old copy after a rebuild — and the failure is silent
    # and very convincing: the reference page renders a component unstyled and
    # it looks like the design system is missing it. That happened with the
    # floating Tal bar: 2774 rules loaded against a 3285-rule build, and the
    # dock came out as raw text and a giant arrow.
    #
    # So the build stamps a content hash onto the links in its own three
    # pages. A portal of your own should do the same, or hard-reload after a
    # rebuild — `?b=` is not magic, it is just a URL the browser has not
    # cached yet.
    # ======================================================================
    import hashlib
    stamp = hashlib.sha1(css.encode() + body.encode()).hexdigest()[:8]
    stamped = 0
    # EVERY HTML FILE IN THIS FOLDER, discovered rather than listed. The first
    # version named three files, and `proof-tal.html` was written afterwards —
    # so the one page whose whole job is to show Tal was the one page left
    # serving a cached stylesheet after a rebuild. A hardcoded list of pages
    # has the same failure mode as a hardcoded list of layers: what is missing
    # from it is not visibly missing.
    for f in sorted(HERE.glob('*.html')):
        txt = f.read_text()
        # ONLY THE REAL LINKS, NOT THE PROSE. The first version of this matched
        # the bare filename anywhere in the file, so it rewrote the copy-paste
        # snippet in the gallery's own "Two files" example too — the page then
        # told the reader to type `?b=8f52743f`, which is an internal build
        # detail and wrong in their portal. The documented paths carry the
        # `design-system/` prefix and the live links do not, so requiring the
        # attribute form and excluding that prefix separates them exactly.
        new_txt = re.sub(
            r'((?:href|src)=")(?!design-system/)(talentnext-ds\.(?:css|js))(?:\?b=[0-9a-f]+)?"',
            lambda m: f'{m.group(1)}{m.group(2)}?b={stamp}"', txt)
        if new_txt != txt:
            f.write_text(new_txt)
            stamped += 1
    print(f'cache-bust stamp {stamp} written into {stamped} page(s)')

    # ======================================================================
    # WHAT WAS LEFT OUT
    # Under include-by-default there is nothing for a person to decide per
    # class — a new component is in the design system the moment it is built.
    # So the closing report is the inverse of v1's: not "what did I drop and
    # what should I do about it", but "here is the short list of families that
    # are NOT in the box", which is the thing worth re-reading when a portal
    # looks wrong. Anything unexpected on this list is a bug in the exclusions.
    # ======================================================================
    if dropped_families:
        print(f'\n{"=" * 70}')
        print('NOT IN THE DESIGN SYSTEM — excluded because their CSS cannot work')
        print('outside the portal (a render pass assembles what they draw), or')
        print('because they are a separate surface with their own language:')
        for prefix in sorted(dropped_families):
            names = sorted(dropped_families[prefix])
            shown = ' '.join('.' + n for n in names[:6])
            more = f'  (+{len(names) - 6} more)' if len(names) > 6 else ''
            print(f'  {prefix + "*":<12s} {shown}{more}')
        print('\nEverything else the portal draws is in. To pull one of these in,')
        print('remove its prefix from EXCLUDE_PREFIXES and rebuild — but read the')
        print('note beside it first: most need JS to be more than decoration.')
        print('=' * 70)


if __name__ == '__main__':
    main()
