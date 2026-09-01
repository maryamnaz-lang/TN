#!/usr/bin/env python3
"""Assemble the single self-contained v24 file."""
import base64, re, pathlib, re

here = pathlib.Path(__file__).parent
css = '\n'.join((here / f).read_text() for f in
                ['01-foundation.css', '02-components.css', '03-product.css', '04-fixes.css', '05-refine.css', '06-polish.css', '07-final.css', '08-last.css', '09-avatar.css', '10-lattice.css', '11-type.css', '12-tone.css', '13-motion.css', '14-desktop.css', '15-course.css', '16-ai.css', '17-auth.css', '18-contain.css', '19-accent.css', '20-group.css', '21-ask.css', '22-noedge.css', '23-ink.css', '24-dash.css', '25-modhead.css', '26-agent.css', '27-tal.css', '28-frame.css', '29-consistency.css',
                 # TEMPORARY — the Next in Leadership run-up. Last because it
                 # patches nothing: every rule in it is under `.nil`, which no
                 # earlier layer mentions, so its position in the cascade is
                 # the one place it cannot cause an argument. Delete this
                 # entry with 30-nil.css and nil.js.
                 '30-nil.css',
                 # The portal switch and the Cohort Leader's pages. After nil
                 # for the same reason nil is last: everything in it is either
                 # a new component (`.pswitch`) or scoped to
                 # `[data-portal="leader"]`, an attribute no earlier layer
                 # mentions — so its place in the cascade cannot be argued
                 # with, and the corrections it makes to shared components
                 # (`.tbl`, `.kv`) have to land after those components' own
                 # layers to be corrections at all.
                 '31-lead.css',
                 # The dashboard's "This week" card and the progress ring.
                 # Last, on the same argument as the two above: everything in
                 # it is a new class (`.wkc*`, `.ring*`) that no earlier layer
                 # mentions, and the one rule that IS a correction — §10's
                 # label column, at the foot of the file — has to land after
                 # the layer it corrects to be a correction at all.
                 '32-week.css',
                 # Tal's page summary at the head of every page. Last because
                 # it is the one layer that has to beat §25 — §25 states the
                 # band's Tal card as a named-area grid inside a container
                 # query, and a query is its own cascade tier, so the only way
                 # to restate that card's shape is from a later layer INSIDE
                 # the same query. Everything else in it is gated on
                 # `.talsum`, a class no earlier layer mentions.
                 '33-talsum.css',
                 # The rail: the count's red, the accent on the module you
                 # are on, and the mark-becomes-menu corner. After §33 and
                 # after §19 in particular — §19 paints every accent fill in
                 # the product from a GENERATED list, so a fill that must NOT
                 # be accent can only be corrected from later than it.
                 '34-rail.css',
                 # Booking an interview inside Tal's thread. LAST, and it has
                 # to be: every rule in it takes a page indent off a component
                 # that is being borrowed into a chat bubble, so it can only
                 # be a subtraction if it lands after the layer that stated
                 # the indent — §07 for the agent card, §10 for the slot grid,
                 # §15 for the fact rows. The one rule that is not a
                 # subtraction widens a Tal bubble that has a card in it, and
                 # that is §27's cap, so it too can only be answered from
                 # later. Everything else is `.bkw` / `.bk-*`, which nothing
                 # earlier mentions.
                 '35-book.css',
                 # The Cohort Leader's other seven modules — Cohorts, one
                 # cohort, one candidate, Course Reports, Sessions,
                 # Evaluations, one decision, one summary, Messages,
                 # Certifications and the leader's own profile. Last for §31's
                 # reason and only that one: every rule in it is either a new
                 # `.ldr-*` class no earlier layer mentions, or a correction
                 # to a shared component (`.tq`, `.cardrow`, `.steps`) that
                 # has to land after that component's own layer to be a
                 # correction at all. It does not compete with §35 — nothing
                 # in either file names a selector the other does.
                 #
                 # ELEVEN VIEWS AND NO ADDITIONS TO §10.15's OPT-OUT LIST,
                 # which is the test of whether a pass reused the design
                 # system or forked it: every section on those pages is built
                 # from `.stats`, `.facts`, `.tbl-wrap`, `.tile-stack`,
                 # `.cardrow` or `.gcard`, so the desktop label column comes
                 # out right without being argued with from inside a container
                 # query.
                 '36-lead2.css',
                 # Three corrections that can only be corrections from the
                 # end of the list: the card rail's own closing rule (§26
                 # takes the rule ABOVE the rail off and never gave it one
                 # below), Tal's chip without its fill (§12 states the fill
                 # and the sheen, §19 restates both — a variant has to be
                 # later than the later of the two), and the week card's
                 # promoted chapter button, which is a class no earlier layer
                 # mentions. Nothing in it competes with §35 or §36.
                 '37-refit.css',
                 # THE SCENES. A new component and the only layer in the file
                 # that patches nothing at all: every selector in it is
                 # `.scene*`, a prefix no earlier layer mentions, so it could
                 # sit anywhere and is put last because that is where a new
                 # thing goes. It DOES reach into two shared components — the
                 # interview row's kit strip and `.ivlist`'s label column —
                 # and both of those have to be later than §10.15 and §15 to
                 # be corrections, which the end of the list gives for free.
                 '38-scene.css',
                 # TAL'S WIDGETS, UNBOXED. `.tw` carried a background (§03)
                 # and a border (§10) from when these were read in the side
                 # panel, where the bubble had no frame. On the ask page the
                 # bubble has one, so every widget was a box inside a box with
                 # 31px of gutter. This takes the inner frame off and puts the
                 # spacing back — plus the action row's missing gap, the
                 # headline that was a bulleted list of one, and the figure
                 # rows set closer together than their own line leading.
                 #
                 # LAST, and load-bearing: it corrects §10 (the border and the
                 # ground), §27 (the bubble) and §03 (every gap), so it can
                 # only be a correction from after all three. It names no
                 # selector §36, §37 or §38 mentions.
                 '39-talwidget.css',
                 # THE EMPTY STATE WEARS §33's SPHERE. §33.6 replaced the
                 # head band's flat Tal mark with a CSS-only gradient sphere —
                 # chevron, specular highlight, breathing glow, a conic band
                 # of light turning across it — at 32px. The 132px mark at the
                 # head of an unstarted conversation was still the flat PNG
                 # blob, so Tal had two faces on two screens a person sees in
                 # the same minute. This puts the sphere on the larger one.
                 #
                 # The four backgrounds are all proportional and copy across
                 # untouched; the box-shadow glow is PIXEL lengths and is
                 # x4.125, which also means `tal-sphere-glow` cannot be reused
                 # (it animates those same 32px shadows) — hence a scaled
                 # `-lg` pair. `tal-sphere-spin` is a bare rotation and is.
                 #
                 # LAST: it takes §27.1's `.tal-mk` background OFF, CORRECTS
                 # §27.4's -6px bottom margin (that number is measured against
                 # the PNG's soft tail; a hard-edged disc has none, so it goes
                 # positive), and runs §33.6's spin. All three have to exist
                 # first. Nothing in §34-§39 names its selectors.
                 '40-talorb.css',
                 # THE MONTH CALENDAR AND ITS POPOVER. A new component rather
                 # than a correction, so its position in the order is almost
                 # free — it names `.cal*` and nothing else in the product does.
                 # It is LAST for the two places it does touch something older:
                 # it hands `.cal-slot.next` §19's `--on-brand-fill` flag so a
                 # control inside a gradient block inherits on-accent ink, and
                 # its phone block restates the grid from §10's own breakpoint.
                 # Both have to land after the layers that state them.
                 '41-cal.css',
                 # A ROW'S STATUS BESIDE ITS TITLE, its subject in its mark.
                 # `.row-st` and the `.rst-*` row classes are names no earlier
                 # layer mentions, so the position is nearly free — it is last
                 # for the one correction it makes, §02's `display:block` on
                 # `.cardrow-t` and `.gcard-b h3`, which it takes off ONLY for a
                 # title that contains a status (`:has()`). §11 restates those
                 # titles' type without touching display, so nothing between
                 # §02 and here is in the way.
                 '42-rowstatus.css',
                 # AN EMPTY STATE OWNS THE PAGE IT IS ON. Three things: §10.15's
                 # label-column opt-out list extended (restated inside the same
                 # container query, per trap 3 — it cannot be outranked from
                 # outside one), the page made a flex column so the section can
                 # take the height that is left, and the actions folded into the
                 # centred block. Scoped with `:has(> .sec > .empty)` throughout,
                 # so it reaches only a page that carries one. Nothing in §41 or
                 # §42 names `.empty`, and §02 is the only layer that lays it
                 # out, so this has to land after §02 and is otherwise free.
                 '43-empty.css',
                 # THE PEEK — the agent's "see how you appear" preview as a
                 # third column in `.shell-body`, in flow beside the page rather
                 # than over it (§27's notification panel is absolute and comes
                 # with a scrim, and a thing you are comparing against must not
                 # be dimmed). `.peek*` is a prefix no other layer mentions; the
                 # only thing it reaches outside itself is `--pad-x` on `.page`,
                 # a variable rather than a rule, so its position is free.
                 '44-peek.css',
                 # AN INFORMATION SECTION ON A QUIETER GROUND. `.sec.tint.info`
                 # redeclares `--surface-2` on the element so §12's whole tone
                 # system resolves against #fbfbfb with nothing restated — the
                 # same move §37.11c makes for `.tint-2`. `.info` is a name no
                 # earlier layer mentions and the one thing it touches is a
                 # token, so its position is free; it is last because that is
                 # where a new thing goes.
                 '45-info.css',
                 # A STATUS NOTE IS A CARD AGAIN. §12.510 takes the fill off
                 # every `.note` — right for the plain summary note it was
                 # written about, collateral for `.warn` / `.err` / `.succ`,
                 # which are statuses and were left as coloured text with a
                 # padding-left for a ground that was no longer there. LAST,
                 # because it corrects §12, which corrects §02.
                 '46-statusnote.css',
                 # A PLATE WITH NO FACE PACKS ITS TEXT TO THE TOP. §15 centres
                 # `.plate`'s columns against each other, which is right for a
                 # card carrying a `.plate-who` and wrong for the faceless ones
                 # the agent's enabling stages draw — there the text column is
                 # the shorter and centring pushed the heading 50px down. After
                 # §15, which is all it needs.
                 '47-plate.css',
                 # THE AGENT CARD'S STARS ARE 16px, on the candidate's three
                 # agent-card rating rows and nowhere else. It WAS a gradient
                 # too — pink #FBB2D4 to orange #E98B46, given as a spec — and
                 # that is reverted: it drew salmon on a card that already has
                 # an orange CTA, and it left the two portals rating on
                 # different-coloured stars. The colour is §15.949's
                 # `var(--star)` again, restored by DELETING the mask rather
                 # than by restating anything, which also retires the build's
                 # one duplicated icon path. Late because it restates §03.104's
                 # 13px; the layer's own note carries the whole argument.
                 '49-agentstar.css',
                 # TAL'S MARK IS THE IRIDESCENT SPHERE, EVERYWHERE. The asset
                 # swap is done above, at `__TALCIRCLE__`, so every one of the
                 # sixty-odd places that reads `--tal-mark` picks it up with no
                 # rule changed. What this layer is for is the two places that
                 # do NOT read the token: §33.6's 32px CSS sphere in the head
                 # band and §40's 132px port of it on the chat empty state,
                 # both of which draw a sphere out of gradients and keyframes
                 # and would otherwise sit next to the real one. It turns both
                 # off — pseudo-elements, animations and the reduced-motion
                 # blocks with them — and corrects the two MEASURED margins
                 # (§27.4's -6px, §40's +16px) that were derived from the old
                 # PNG's soft tail. LAST of the two sphere layers: it can only
                 # subtract §33 and §40 from after them.
                 '50-talsphere.css',
                 # THE TAL CHAT VIEW, from Figma 433:276 (empty) and 439:481
                 # (in conversation). A warm ivory ground with one blurred
                 # peach ellipse, an unframed Tal turn beside its mark, the
                 # user's turn as a black block, and a composer standing on the
                 # coral mesh with a white field on it. LAST, and every part of
                 # it needs to be: it subtracts §21.4's hairline and §24's
                 # ellipse from the foot, §27's frame from Tal's bubble and its
                 # black square from the send, §40's sphere sizing from the
                 # hero, and §13's lattice from behind the mark. All of those
                 # are plain declarations, so after is the only place they can
                 # be answered from. Scoped to `.ask-page` throughout.
                 '51-askview.css',
                 # THE PAGE SUMMARY TYPES ITSELF. The summary is the one line
                 # on a page that is written rather than stored — Tal's
                 # reading of `S` at the moment you arrive — so it is said to
                 # you rather than already sitting there. Three rules and a
                 # caret; the layer holds the layout half of the effect (a
                 # hidden ghost copy reserving the final box, the visible
                 # copy laid over it) and `typeSummary` in ai6.js holds the
                 # clock. LAST, and it only needs to be after §33: every
                 # selector is gated on `.talsum` and on the `.tsum` class
                 # ai6 stamps, so it adds to that block rather than
                 # correcting it, and a paragraph that is not being typed
                 # matches nothing here.
                 '52-talsumtype.css',
                 # THE CHAT IS ONE SURFACE. Figma 446:347 redraws 433:276 with
                 # the wash running across the FULL frame — under the margins
                 # and under the column alike — so the sheet-on-a-ground the
                 # rest of the product is built on has to come apart here:
                 # §18's panel-toned margin goes white, §51's ground comes off
                 # `.ask-page` entirely, and the one gradient is stated once
                 # and painted on the surface both of them share. Takes §51.7's
                 # coral mesh off the foot with it (446:347 has no picture
                 # there), turns the composer's stroke into a moving conic of
                 # the same four colours, and swaps §40's CSS sphere for the
                 # supplied footage, round-cropped. LAST: §18's rule and §51's
                 # ground are plain declarations, §40's sphere is five classes
                 # deep, and three of these live inside `@container app
                 # (min-width:900px)` because per trap 3 that tier can only be
                 # answered from inside itself.
                 '53-talground.css',
                 # A TINTED BLOCK IS ITS OWN TOP EDGE. One declaration, and it
                 # subtracts from §37.1: the agent rail's closing hairline is
                 # right where the next section is white and wrong where the
                 # next section is filled, because a change of ground is
                 # already a boundary and both together is two boundaries four
                 # pixels apart. §18 makes the same argument for the `.sec`
                 # case and answers it by giving that rule the full bleed;
                 # §37.1's rail hairline is inset by `--pad-x`, so it cannot be
                 # the fill's edge and comes off instead. Scoped to
                 # `+ .sec.tint`, so every rail followed by white keeps its
                 # rule. After §37 by necessity, last because that is where a
                 # new thing goes.
                 '54-tintedge.css',
                 # CELLS ON A PANEL CAN BE CARDS INSTEAD OF DIVISIONS.
                 # `.sec.tint.cards` takes the figure fills and the head action
                 # WHITE. §12 makes a tinted panel's `.stats` cells the panel's
                 # own colour and lets the grid's 1px gaps draw the hairlines —
                 # right for a band that should read as one divided block, wrong
                 # for the quiz results, which are four separate facts sitting
                 # under three bordered agent cards. A class the page applies,
                 # for §45's reason: whether a panel's cells are cards is an
                 # editorial call and `:has(> .stats)` would get it wrong on the
                 # first band that wanted the other reading. LAST because every
                 # declaration replaces one of §12's `.sec.tint` fills at equal
                 # weight.
                 '55-panelcards.css',
                 # THE HEAD OF A PAGE IS TWO COLUMNS, AND THE STEPS ARE OPEN.
                 # Maryam's arrangement of the band: title, the `·` fact row,
                 # every step of Where you are in a row, a divider, then what
                 # Tal says — and the black card beside all of it, content
                 # centred, as tall as the column it stands next to. Three
                 # removals ride with it: the greeting inside Tal's paragraph
                 # (the `.ph` is the title again, so §33.9's hide stops
                 # matching), the "All steps" toggle with its dropdown, and the
                 # meter and current-step block that only existed because the
                 # other four steps were hidden. Gated on the dark card being a
                 # `.plate`: `.lvl-hero`, `.cert` and `.score` are wide objects
                 # and a 320px column would break all three.
                 # LAST, and it has to be — it restates §25.11's named-area
                 # grid, §33.1/§33.8's talsum templates, §33.7's wing and §15's
                 # desktop plate, four of which live inside `@container app
                 # (min-width:900px)` and per trap 3 can only be answered from
                 # inside the same query.
                 '56-headband.css',
                 # THE FRONT DOOR, REDRAWN AS A SPLIT — Figma 483:976. Same
                 # screen §17 built, different composition: the artwork bleeds
                 # to the frame edge on the left (52.6%), the right half is
                 # white, and the form is a bordered 608px card centred in it.
                 # Takes §17's floating 1196px card, its two blurred ellipses
                 # and its `--surface-2` ground off; adds the orange identity
                 # panel and turns the primary action black, which is what
                 # `.btn-p` is everywhere else in the product.
                 #
                 # LAST, and every part of it needs to be. §17 states the card
                 # as a flex box with a width, a padding, a background and a
                 # shadow INSIDE `@container app (min-width:900px)`, so per
                 # trap 3 the only place those can be restated is a later
                 # layer inside the same query; the orange action is §17's
                 # plain declaration and can only be answered from after it.
                 # The identity panel is the one part that is a new component
                 # rather than a correction, and it is ungated for the reason
                 # §17 gives about the column's contents.
                 '57-authsplit.css',
                 # "STRENGTHS" AND "GROWTH AREAS" AS HEADINGS. Priya's two
                 # findings were 10.5px `--text-helper` with 16px above them —
                 # the lightest ink and the smallest size in the system, with a
                 # gap above only four pixels bigger than the one between two
                 # ordinary paragraphs — so the reader met four blocks of grey
                 # text and had to infer which two were titles. Full ink and
                 # 28px above; the 4px below is unchanged, because the grouping
                 # is the ratio between those two numbers. Also the layer that
                 # made an inline `style="color:…"` come out of views.js: trap
                 # 1, no rule could have won against it. After §10 (the margins
                 # and the helper ink) and §11 (the type).
                 '58-finding.css',
                 # TWO PRIORITIES FOR THE DARK CARD, AND TWO MORE THINGS FOR
                 # THE WING. Maryam's rule: the black wall plus the warm haze is
                 # the loudest object the product draws and it is spent on an
                 # action that is time-sensitive — a call today, something due
                 # now. Outside twenty-four hours the same card goes QUIET: no
                 # ground, no haze, the ink flipped by re-pointing the three
                 # `--on-dark*` tokens, and in the head band a vertical rule
                 # taking over the job the card's black edge was doing of saying
                 # where column one stops. `plateUrgent` (ai5.js) is what
                 # decides and the argument is written there. Riding with it:
                 # the wing's two new blocks — the course progress strip from
                 # week 1 and the ladder once promoted — which need a gutter and
                 # a track colour each, because both are page components
                 # borrowed into the band (trap 10) and one of them was drawn
                 # for a black card.
                 # LAST, and every part of it has to be: the quiet card
                 # contradicts §15's ground and on-dark ink, §21's haze and
                 # §56's asymmetric column padding, and three of §56's rules are
                 # inside `@container app (min-width:900px)` so per trap 3 they
                 # can only be answered from inside the same query.
                 '59-priority.css',
                 # THE LIVE CALL — the first surface in the build that is not a
                 # page: Join on an interview or on the weekly cohort call now
                 # opens it, and ai10.js holds its state, its copy and its
                 # clock. `call*` is a name no earlier layer mentions, so its
                 # position is nearly free; it is last because it is new, and
                 # because the two rules that reach outside the prefix — the
                 # leave button's height, correcting §02's 48px `.btn`, and the
                 # aside's `--pad-x`, correcting §10's page gutter — have to
                 # land after the layers they correct.
                 '60-call.css',
                 # THE QUIZ ROSE. "See full breakdown" went to My Level, which
                 # is the page about the ladder and holds none of the quiz;
                 # `V.result` is the breakdown itself — five bands as wedges
                 # from a hub, the score in the middle, and what the answers
                 # did well and badly under it. `qz*` is a name no earlier
                 # layer mentions; it is last because it is newest, and its one
                 # rule that needs the position is `.qz-vd`, a `.tag`, which
                 # §02 fills and §11 sizes.
                 '61-quizrose.css',
                 # A RANK GOES IN THE HEADER, NOT IN A BANNER — Figma 486:1084.
                 # The dashboard opens on the reader's own face at 75 with the
                 # rank medal on its corner, and at the far right of that same
                 # row "You have earned 1-star rank!" in the link blue with its
                 # last word underlined. The green `.ach` band no longer draws
                 # for a rank; `achBanner` in views.js is where the split is
                 # argued, and it is that a badge is news you dismiss while a
                 # rank is what you now ARE. The two halves have different
                 # lifetimes — the mark is on every dashboard that has a rank,
                 # the sentence only where the banner would have been — which
                 # is why they are two rules rather than one component.
                 # LAST, and two of its rules need to be: `align-items` on
                 # `.ph-has-act` is §15's, declared inside `@container app
                 # (min-width:672px)`, so per trap 3 it can only be answered
                 # from a later layer inside the same query; and the fact row's
                 # top margin is §56.1b's. Everything else is `.ph-you*` /
                 # `.ph-earned*`, names no earlier layer mentions.
                 '62-rankhead.css',
                 # TYPOGRAPHY — THE AUTHORITY, AND IT HAS TO BE LAST FOREVER.
                 # §11 was written to be this layer and lost, not by being
                 # wrong but by being in the middle: `.app .foo` in §15 beats
                 # `.app .foo` in §11 on order alone, so every later layer
                 # that wanted a size simply took one. A computed sweep of
                 # ten stages by 34 views found 26 rendered font sizes
                 # against §11's nine, 160 distinct type signatures, five
                 # weights in a face that ships two, 1283 elements set in
                 # uppercase and two greys doing one job.
                 # §63 states the scale as tokens, assigns every family in
                 # both portals to one of eleven roles over eight sizes,
                 # takes the case off all 66 uppercase rules across 18
                 # layers, snaps weight to the two Söhne actually loads, and
                 # brings SVG `<text>` inside — §11 neutralises HTML
                 # elements by name and `text` is not one, which is why the
                 # charts had 6px labels.
                 # LAST, and unconditionally: it supersedes §01-§62 by
                 # position exactly as §11 supersedes §01-§10, and three of
                 # its rules have to be inside `@container app` per trap 3 —
                 # §15's two uppercase heads and the h1's desktop step.
                 # ANYTHING ADDED AFTER THIS POINT MUST NOT SET A FONT SIZE.
                 # If a new layer needs one, it is either a role that belongs
                 # in §63 or an exception that belongs in §63's §7 list.
                 '63-typography.css',
                 # THE OUTLINED BUTTON LOSES ITS BOX AND GAINS AN ARROW.
                 # `.btn-s` / `.btn-t` / `.btn-g` — 88 of them — were drawn as
                 # a rectangle, which on a product made of hairlines is one
                 # more edge than the page has: "Read the full report" in a
                 # drawn box inside a `.sec-h` that is already ruled off reads
                 # as the box first and the words second. The border goes
                 # transparent (not away — §02's 1px is in the contained
                 # button's box model too, so `border:0` makes a `.btn-g` 2px
                 # shorter than the `.btn-p` beside it) and an arrow goes on,
                 # as a mask so it takes `currentColor` on white, on the black
                 # card and under §19's accent alike.
                 # AFTER §63 AND ALLOWED TO BE: it sets borders, padding and a
                 # pseudo-element and states no font-size, no font-weight, no
                 # text-transform and no colour, which are the four §63 owns.
                 # It has to be this late because §02 states the outlined
                 # colour and §10 re-points it to `--rule`, and both have a
                 # hover pair — five rules across two layers, all answered
                 # here.
                 '64-quietbtn.css',
                 # THE FOUND DISCLOSURE + THE FIGURE STRIP'S MARKS. Two small
                 # dashboard components that arrived together.
                 # "What the interview found" is the longest block on the two
                 # dashboards that carry it and it is a re-read, so it starts
                 # closed with the chevron on the LEFT of its heading — the
                 # row already ends in "Read the full report", and two
                 # controls at the same edge, one opening in place and one
                 # navigating away, is the ambiguity worth avoiding. State is
                 # `S.found` rather than a DOM class because this is a
                 # dashboard and a dashboard re-renders under it (trap 9).
                 # The strip's three figures get `.stat`'s chip — 28px, a 13%
                 # wash, a 16px glyph — with the hues NAMED rather than
                 # cycled, so chapters are blue here and blue in a `.stats`
                 # grid.
                 # After §63 and allowed to be, on the same test as §64: it
                 # states layout, a rotation and two SVG fills, and none of
                 # the four properties §63 owns.
                 '65-founddisc.css',
                 # THE CARD THAT SELLS SOMETHING IS DRAWN AS AN OFFER.
                 # Maryam's read of 486:1084's enrolment card against ours,
                 # which had the same four facts and none of the four things
                 # the file does with them: a sentence under the title, the
                 # price in the accent holding the row's right edge, a
                 # hairline under every fact row, and the date the course
                 # opens in a band of its own. The two dashboards that draw
                 # `enrolPlate` — `assessed` at E3 and `promoted` at E4 —
                 # are the two surfaces it lands on.
                 # EVERY GATE IS A CONDITION IN THE MARKUP, never a call
                 # site: a card with a `.plate-d` in it, a fact list with a
                 # `.plate-v` in it, a note wearing `.acc`. So the six plates
                 # that are appointments keep §56's card exactly as it was
                 # and the next card that is an offer is drawn as one for
                 # free. There is no `.plate-enrol`.
                 # It also gives `.note.acc` its ground back, which is §46's
                 # argument applied to the fourth variant §46 left out —
                 # nothing drew one until now. The ground is `--accent-tint`
                 # and not §02's `--brand-tint-2` for a measured reason; the
                 # note in the layer has the two ratios.
                 # AFTER §63 AND ALLOWED TO BE, on §64's and §65's test: it
                 # states grounds, borders, padding, `order` and one SVG
                 # fill. The two inks it needs are stated in §63 — the
                 # description's grey beside `.plate-b`'s, and the price's
                 # accent, which has to be conditional on the card being
                 # quiet because #b94a09 on #111 is 1.6:1.
                 '66-enrolcard.css',
                 # TEMPORARY — the red accent trial, on the `reddemo` stage
                 # ("Red Accent Demo") only. Delete this entry, the layer,
                 # `tmpaccent.js` and its entry below, and `'tmp'` in
                 # `build-ds.py`'s EXCLUDE_PREFIXES, and it is gone.
                 # LAST, and it has to be: it re-points accent tokens inside
                 # one scope class, so it must land after every layer that
                 # states one. It modifies no component and no existing
                 # token. Allowed after §63 on §64's and §65's test — it
                 # declares no size, weight, transform or text colour, only
                 # custom properties.
                 '67-tmpaccent.css',
                 # THE PLATE'S PERSON COMES FIRST. `.plate-who` was ordered
                 # under `.plate-b`, so the weekly-call card read title ->
                 # time, others, length -> who is running it, which puts the
                 # only person on the card below three lines of logistics.
                 # The two swap. LAST because the order is stated in three
                 # container-query tiers (§15 twice, §56 once) and per trap 3
                 # each can only be answered from inside its own query at its
                 # own specificity — §56's is 0,5,0.
                 # It deliberately does NOT touch `.note.acc`'s ground; §66.3
                 # argues that on contrast and owns it. Sets no font-size,
                 # weight, case or colour — §63 still owns all four.
                 '68-platestack.css',
                 # THE ENROLMENT FLOW. Two components from the Enroll page:
                 # the checkout card's invoice rows (a `.plate-b` whose rows
                 # ALL end in a figure — `splitPlateBody` stamps `.plate-tab`
                 # and drops the subject marks, since three wallets in a
                 # column say one word three times), and a disclosure with a
                 # lede visible while it is shut.
                 # AFTER §68 because the invoice's closing rule has to land
                 # after §68.2b's `border-bottom:0` on the same rows, and
                 # after §65 because it restates that layer's closed-panel
                 # padding at 0,5,0. Sets no font-size, weight, case or
                 # colour — the one ink decision the invoice needed (the
                 # accent is the total, not the working) is stated in §63
                 # beside the `.plate-v` rule it corrects.
                 '69-enrolflow.css',
                 # THE AI-NATIVE HEAD — Figma 578:5966. The `new` dashboard
                 # redrawn so the machine is the page rather than a card on
                 # it: Tal's sentence is the band's whole left column on its
                 # own wash, the four steps are the right one, and the page's
                 # next step is ONE agent Tal picked rather than a shortlist
                 # of three. Plus the gradient comet that runs the border of
                 # the summary panel and the ask dock (Maryam's ask, on the
                 # file's own parked 374x2 bar).
                 # LAST, and three reasons it has to be. It opens a second
                 # column on `.modhead` the way §56 does for `.sec-dark`, so
                 # it must land after §56 — and after §59, which re-points
                 # the tokens that column's tenant reads. It restates
                 # `.app .modhead .ai-aura.talsum > .ai-head > .ai-label`
                 # (0,6,0) against §33.2, and per trap 3 its own desktop
                 # rules are inside `@container app (min-width:900px)` where
                 # §10, §14 and §56 all state theirs. And its wash lands on
                 # the same `.sec` §33.4 pads, so it has to be the later of
                 # the two.
                 # AFTER §63 AND ALLOWED TO BE, on §64's and §65's test: it
                 # states grounds, gradients, borders, radii, spacing,
                 # `offset-path` and one keyframe set, and not one
                 # font-size, font-weight, text-transform or text colour.
                 # All of those are in §63 §10 — including the two that look
                 # like mechanism rather than type, the `color:transparent`
                 # under each clipped gradient and the three step-state inks,
                 # which are the two somebody reading §70 alone would
                 # otherwise go looking for in the wrong file.
                 '70-ainative.css',
                 # THE COURSE HEAD — Figma 599:7418. §70's reversal applied to
                 # the three stages with 90 days actually running: Tal's
                 # sentence is the band's whole left column, "Your 90 days so
                 # far" is the second one, and the weekly cohort call is a
                 # full-width white row under both instead of a black plate
                 # beside them. Everything below that row is the page as it
                 # was.
                 # AFTER §70, AND IT COULD NOT BE ANYWHERE ELSE. It is a second
                 # TENANT of §70.3's two-column grid rather than a second grid
                 # — §70's gate was re-keyed from `.sec-jrn` to `.head-col` for
                 # this, so both layers point at one set of nine rules — and it
                 # then adds the one thing that grid has no member for, a third
                 # band row spanning both columns. Its own desktop rules are
                 # inside `@container app (min-width:900px)` where §10, §14,
                 # §56 and §70 all state theirs (trap 3).
                 # AFTER §63 AND ALLOWED TO BE, on §64/§65/§70's test: grounds,
                 # gradients, borders, spacing and one grid placement, and not
                 # one font-size, font-weight, text-transform or text colour.
                 # Those are §63 §11 — including the figure strip's re-
                 # proportioned pair and the countdown's violet, which are the
                 # two somebody reading this layer alone would go looking for
                 # in the wrong file.
                 '71-coursehead.css',
                 # THE WEEK PULSE. §71 redrew the head of the three enrolled
                 # stages and left the page under it as three separate panels —
                 # "This week", "Time on the course", "Where you stand" — which
                 # are one question asked three times over 1230px. They are
                 # three COLUMNS of one section now: what I am on, whether that
                 # is enough, what it has earned. The thirteen-week stacked
                 # chart could not be a third of a column and moved to Course
                 # Progress, which is where `V.dashboard`'s promoted branch has
                 # claimed the week-by-week record lives since it dropped its
                 # own copy; the pace column carries that data as a week-
                 # progress read instead (Maryam, 31 Aug 2026).
                 # LAST, AND FOR ONE REASON THAT IS NOT NEGOTIABLE: §72.1a
                 # restates §10.15's label-column opt-out for a wrapper class
                 # §10 has never heard of, and per trap 3 a rule inside
                 # `@container app (min-width:900px)` can only be answered from
                 # inside the same tier. It also re-points four declarations
                 # §15 and §29 make on `.stand` — the three-across grid, the
                 # full bleed, the outer border and the end cells' gutter — so
                 # it has to land after both. Nothing about it interacts with
                 # §70 or §71; it could sit anywhere after §29 that is also
                 # after §63, and after §63 is what decides it.
                 # AFTER §63 AND ALLOWED TO BE, on §64/§65/§70/§71's test: it
                 # states grids, borders, grounds, spacing and one gradient,
                 # and not one font-size, font-weight, text-transform or text
                 # colour. Those are §63 §12 — including the two that read as
                 # mechanism, the display role on the pace figure and the
                 # tabular numerals on the three that are meant to be compared.
                 '72-weekpulse.css',
                 # THE ENROLMENT OFFER. The `assessed` dashboard's black
                 # enrolment plate becomes a full-width white offer — the head
                 # row carries the date and the CTA, the four figures become a
                 # `.facts` row — and its thirteen-chapter flat list becomes
                 # four cards plus the remainder, closed by one tinted row
                 # where the cohort is people. §71's plate-to-white-row move,
                 # applied to the one decision this page exists to ask
                 # (Maryam, 31 Aug 2026).
                 # LAST, and the reasons are §72's plus one. It restates the
                 # sparkle §70.2a and §72.1b both draw, so it must land after
                 # both; its head rows extend §24.13's `.sec-h`; and it leans
                 # on §10.15 having already opted `.facts` out of the label
                 # column and on §29.17 having already drawn that grid's cells,
                 # so it has to be after both of those too. Its own responsive
                 # rules are inside `@container app (max-width:899.98px)`.
                 # AFTER §63 AND ALLOWED TO BE, on §64/§65/§70/§71/§72's test:
                 # grounds, grids, borders, spacing, one mask and one negative
                 # margin, and not one font-size, font-weight, text-transform
                 # or text colour. Those are §63 §13 — including the two that
                 # read as mechanism, the h3 on both headings (which needs
                 # (0,3,1) to beat §63 §4's `.app .sec-h h2`) and the pill's
                 # violet.
                 '73-enroloffer.css',
                 # WHAT THE INTERVIEW FOUND. Priya's write-up was four
                 # paragraphs and two grey labels; it is three cards in three
                 # of §12's named hues now — green for the strengths, violet
                 # for the growth areas, blue for her note — with the pair
                 # abreast and the note under them. Maryam's call on 31 Aug
                 # 2026, explicitly NOT in the accent: "do not go for orange
                 # color only". The section goes white in views.js to make the
                 # tints readable, which is `quizResults`'s own swap.
                 # LAST, and only one reason is structural: it restates §55's
                 # white-cell assumption now that the panel is gone, and it
                 # reaches past §15's `.signed-h` and §02's `.note band`. It
                 # could sit anywhere after §55; after §63 is what decides it.
                 # AFTER §63 AND ALLOWED TO BE: grids, grounds, marks, spacing
                 # and two `color-mix` washes, and not one font-size,
                 # font-weight, text-transform or text colour. Those are §63
                 # §14 — including the one that reads as mechanism, the card
                 # title taking `--mk` where §72 §12 deliberately keeps its
                 # column labels in grey. The note there says why the two
                 # differ.
                 '74-signedcards.css',
                 # THE RECOMMENDATION IS THE BLACK CARD. Maryam, 31 Aug 2026 —
                 # `talRec` on the `new` dashboard takes `.plate`'s ground and
                 # §21.22's top-right haze, with the heading and the
                 # attribution split into two lines above it. `.rec-dark`
                 # rather than `.plate` or `.sec.on-dark` on purpose: both of
                 # those are in ai5's `DARK_CARD`, so `placeDark` would hoist
                 # the block into the head band's second column, which on this
                 # page is the journey list. The note over `recWrap` is the
                 # long version.
                 # LAST, and every reason is structural: it re-points §70.5's
                 # own ground, geometry and skeleton bars, it turns over §70's
                 # stated reversal of §64 on the quiet button, and it copies
                 # §15.1853 + §19's plate CTA onto a class neither could have
                 # named. Nothing before §70 can reach it.
                 # AFTER §63 AND ALLOWED TO BE: a ground, a radial, five
                 # geometry rules, two button fills, two borders and two
                 # skeleton gradients, and not one font-size, font-weight,
                 # text-transform or text colour. Those are §63's own
                 # recommendation group — including the 18px heading, which is
                 # a STATED §7 exception rather than a tenth role (the nearest
                 # is h3 at 17; the note says why it is not tokenised).
                 '75-recdark.css',
                 # THE BOOKING PAGE IS THREE PANELS. Maryam, 31 Aug 2026, with
                 # a reference screen — "the look and feel will be ours, but
                 # take the structuring inspo from the reference". Six loose
                 # blocks down one column become the profile beside its three
                 # purchase facts, the picker as two numbered steps, and a
                 # checkout row. The long argument, including what it refuses
                 # from the reference (the role chip, the month calendar) and
                 # why, is over `V.agent` in views.js.
                 # LAST, and the reasons are structural: it re-lays §10.29's
                 # `.daystrip` and `.slots` (including giving back §10.3's
                 # bleed, trap 10), it reaches past §15's `.agid-bio` margin,
                 # and it borrows §65's chip and §41's panel frame. Nothing
                 # before §15 can reach it.
                 # AFTER §63 AND ALLOWED TO BE: grids, flex, grounds, borders,
                 # spacing, three marks and one auto margin, and not one
                 # font-size, font-weight, text-transform or text colour.
                 # Those are §63 §16 — including the two that read as
                 # mechanism, the step numeral's `--accent-text` on the tint
                 # and the fee's tabular figures.
                 '76-bookpage.css',
                 # THE CALL IS A BLACK CARD. Maryam, 31 Aug 2026 — the `booked`
                 # dashboard's interview row takes §75's `.dark-card` under the
                 # same heading `talRec` carries one stage earlier, because the
                 # two are the same slot: "book an interview" then "join the one
                 # you booked". This layer is ONLY what is true of the row on a
                 # dark ground — §75 owns the card and states the recipe once,
                 # per Maryam's standing instruction that a conversion never
                 # asks about the ground, the inset or the hairlines again.
                 # LAST, and every reason is structural: it beats four
                 # `.sec-call` padding rules from §71 and §73 (two of them
                 # inside the 900 query, so it is restated there per trap 3),
                 # it answers §20's `+ .sec{padding-top:0}` from inside §20's
                 # own tier, and it re-points §71.1's countdown ground and
                 # §71.2's quiet-button border.
                 # AFTER §63 AND ALLOWED TO BE: paddings, one ground, one
                 # border colour and one custom-property reset, and not one
                 # font-size, font-weight, text-transform or text colour.
                 # Those are §63 §17 — including the one that reads as
                 # mechanism, the quiet button's `fill:currentColor`.
                 '77-crowdark.css',
                 # THE TOP BAR: the breadcrumb that took the portal switch's
                 # place beside the wordmark, the account menu the switch moved
                 # INTO, and the page heading the trail replaced.
                 # LAST, and two of the three reasons are structural. It
                 # re-shapes §01's `.shell-act` for the one control in that bar
                 # that holds two objects, and it restates §34's own
                 # `var(--s05)` inset inside its own copy of that container
                 # query (trap 3) now that the trail rather than the switch is
                 # what follows the wordmark. The third is §78.6: `.ph-bare`
                 # has to beat every `.ph` rule §25, §56, §62 and §70 write.
                 # AFTER §63 AND ALLOWED TO BE, on the same test §64/§65/
                 # §69-§77 each pass: geometry, grounds, borders, one
                 # transition and two fills, and not one font-size,
                 # font-weight, text-transform or text colour. Those four are
                 # §63 §18 — including the separator's ink, which reads as
                 # mechanism and is a type decision.
                 '78-topbar.css',
                 # THE PULSE IS A BLACK CARD: the enrolled dashboards take the
                 # `Just Joined` shape — the white call row and the pulse's own
                 # head row become one §75 card with a hairline between them,
                 # and the three pulse columns become three Quick Actions.
                 # AFTER §75 BECAUSE IT CONVERTS §75'S CARD, and after §77 for
                 # the same reason that layer is after §75: both are "what is
                 # true of THIS content on a dark ground" and neither restates
                 # the recipe. It needs less than §77 did — `.sec-pulse` is a
                 # new class with no padding history to beat, so the section
                 # rules are two lines against that layer's four-rule fight
                 # with `.sec-call`.
                 # AND AFTER §70, WHICH IS WHAT MAKES §79.4 POSSIBLE: the three
                 # Quick Action hues are named classes on §70's `.qa-ic`, per
                 # that layer's own rule against cycling.
                 # AFTER §63 AND ALLOWED TO BE, on the same test §64/§65/
                 # §69-§78 each pass: grids, flex, one border, three fills and
                 # spacing, and not one font-size, font-weight, text-transform
                 # or text colour. Those four are §63 §19.
                 '79-pulsedark.css',
                 # THE QUIZ RESULTS IN §44's RIGHT-HAND COLUMN. A Quick Action
                 # opens the peek beside the dashboard instead of navigating
                 # away; this is the five blocks INSIDE the panel, and §44 is
                 # still the panel. It is also the first thing in `hifi/` to
                 # write `.peek*` at all — that layer's only caller until now
                 # was tn-agent-portal.html, which is the mild form of the
                 # "gate nothing writes" tell.
                 # LAST, and one rule needs it: §44.164 turns off the closing
                 # hairline on `.peek-b > .sec:last-child`, and §80.1 replaces
                 # that whole approach with a flex stack on `.peek-b` — which
                 # has to land after the layer it is answering.
                 # AFTER §63 AND ALLOWED TO BE: grids, flex, grounds, borders,
                 # spacing, three marks, one radius and one float, and not one
                 # font-size, font-weight, text-transform or text colour.
                 # Those are §63 §19 — including the two that read as
                 # mechanism, the `<ol>` marker's inherited ink and the tag's.
                 '80-quizpeek.css',
                 # THE JOIN THAT IS NOT OPEN YET: the disabled state of the
                 # accent button on §75's black card. The cohort leader's next
                 # interview is the first caller (Maryam, 31 Aug 2026 — "disable
                 # the join call button and enable it at time of the call") and
                 # `joinLive` in views.js owns the window.
                 # AFTER §75 AND §71, WHICH IS THE WHOLE OF WHY IT IS A LAYER
                 # RATHER THAN A LINE IN ONE. Both of those paint this button the
                 # accent — a colour AND a gradient — and §02.108's disabled
                 # ground is (0,2,0) against their (0,4,0), so the default
                 # `disabled` treatment never landed: the button was the full
                 # accent fill and unpressable, which reads as a broken control
                 # rather than a closed door. It is stated on `.dark-card` rather
                 # than on `.crow-dark` so the next black card with a gated
                 # action gets it free.
                 # AFTER §63 AND ALLOWED TO BE, on the same test §64/§65/
                 # §69-§80 each pass: one ground, one image, one border colour,
                 # one fill and one flag, and not one font-size, font-weight,
                 # text-transform or text colour. Those four are §63 §20 — one
                 # declaration, because this layer points the arrow at
                 # `currentColor`.
                 '81-joingate.css',
                 # THE ENROLMENT OFFER BECOMES A BLACK CARD. §73 made it a
                 # full-width white section on the argument that `.plate` is
                 # §59's time-sensitive object and enrolling has no clock;
                 # `.dark-card` is a different object with a different rule —
                 # §75's "this is the one thing the page is about" — so this
                 # is not a reversal of that layer and its note says which
                 # half of §73's argument still stands.
                 # LATE, and it has to be after §73 and §79: it overrides
                 # §73.1a's `.facts.eo-facts` padding at equal weight, and it
                 # re-runs §79.1's answer to trap 13 for a second `aiHead`
                 # inside a `.dark-card`. §82 IS THE NUMBER BECAUSE §81 WAS
                 # TAKEN while this was being written — the two were authored
                 # in parallel and neither depends on the other.
                 # Allowed after §63 on §64/§75/§79's test: flex, one border,
                 # two backgrounds, two fills and spacing, and not one
                 # font-size, font-weight, text-transform or text colour.
                 # Those four are §63 §21.
                 '82-enroldark.css',
                 # TEMPORARY — the red accent trial, part two. Delete with §67
                 # and `tmpaccent.js`; that layer's head has the full removal
                 # note and this one's says why the trial needs two layers.
                 # DEAD LAST, and that is the entire reason it exists as a
                 # separate file: §70 states `--ai-1/2/3` on `.app`, which is
                 # the same (0,1,0) as §67's `.tmp-accent`, so a re-point
                 # written in §67 loses on ORDER and the AI ramp stays orange
                 # silently. Everything here either restates a rule that lands
                 # after §67 or needs a class more than the rule it answers.
                 # It DOES state `color` three times, against §63's rule, and
                 # §83.4 lists the three with their weights: each re-points a
                 # hardcoded `#f47113` that §63 itself wrote as a literal
                 # rather than a token, so there is nothing for §67 to move.
                 '83-tmpaccent2.css',
                 # A TINTED SECTION HAS NO HAIRLINE ABOVE OR BELOW IT. §54 and
                 # §55.2 each reached this conclusion for one neighbour; the
                 # layer's own head is the argument for applying it to every
                 # grey section, which is what was asked for.
                 # AFTER §83 ON THE NUMBERING AND THAT IS SAFE. §83's "dead
                 # last" claim is about the accent TOKENS — it has to land
                 # after §70 states `--ai-1/2/3` at equal weight. This layer
                 # states three `display:none`s and nothing else, so the two
                 # touch disjoint properties and neither can lose to the
                 # other. When §67/§83 are deleted with the red trial, this
                 # one is last on its own and nothing moves.
                 # THE OTHER HALF IS IN §14, NOT HERE, and that is trap 4: at
                 # desktop the closing hairlines are re-enabled by a (0,12,0)
                 # rule inside a container query, which cannot be answered
                 # from a later layer at all. The `:not()` list is where "which
                 # pairs are joined" is decided, so the desktop half is two
                 # entries added to it. This file is the phone tier.
                 # AFTER §63 AND ALLOWED TO BE on the usual test: three
                 # `display` declarations, and not one font-size, font-weight,
                 # text-transform or text colour.
                 '84-tintnorule.css'])
# ==========================================================================
# NO HOVER
# The state layer was fighting the layout everywhere it appeared: a wash on a
# borderless row reads as a box that was not there a moment ago, and on a
# page made of rules that is one more edge than the page has.
#
# Rather than hunt forty rules across fourteen files and hope none comes
# back, the build disarms them — and it does it TEXTUALLY, not by parsing.
# An earlier version of this walked the stylesheet rule by rule and deleted
# the hover ones; a comment sitting in front of an @container was enough to
# make it mistake the at-rule for a prelude, and it quietly re-flowed blocks
# that had nothing to do with hover. Rewriting `:hover` to `:hover:where(.__nh)`
# has no such failure mode: `:where()` contributes no specificity, `.__nh` is
# a class that never appears in the DOM, so the rule simply never matches and
# every other rule keeps its exact place in the cascade.
#
# Two are left armed, by name:
#   .sn-item:hover   — the navigation rail. Icon-only at desktop, so the
#                      pointer needs to know which target it is on.
#   .btn-p / .tal-fab — the primary action going black to purple. The one
#                      place hover carries the brand rather than a grey plate.
#
# :focus-visible is untouched: it is how the keyboard sees the page.
# ==========================================================================
#   .tal-star:hover — the ask control on an agent card. It is collapsed to a
#                     mark until you point at it; disarmed, it never opens.
#   .nil-btn / .nil-fbtn / .nil-step.live — the run-up's buttons. The
#                     argument above is about THIS product's surfaces: a wash
#                     on a borderless row, on a page made of hairlines. The
#                     Next in Leadership screens are neither — they are boxed
#                     cards and filled navy buttons on white, where a pointer
#                     state is what the page already looks like. And they are
#                     the screens whose entire brief is "the buttons should
#                     work", which is worth being able to feel.
#   .psw-t:hover  — the portal switch. It is the one control in the app bar
#                     that changes who is signed in, and the two halves are
#                     plain text until one of them is live, so without a
#                     pointer state the inactive half gives no sign that it is
#                     a target at all.
#   .nav-t          — the rail's corner. The mark becomes the hamburger
#                     under the pointer, which is the control saying what it
#                     does rather than a state layer decorating one. Disarmed,
#                     the mark simply never becomes a menu. See §34.
#   .stat-jump    — the leader dashboard's four figure cells. They look exactly
#                     like the read-only figure cells everywhere else in the
#                     product, and unlike those they scroll the page. The
#                     pointer state is the only thing on the card that says so.
HOVER_KEEP = ('sn-item', 'btn-p', 'tal-fab', 'tal-star',
              'nil-btn', 'nil-fbtn', 'nil-step.live', 'nil-btn.ghost',
              'psw-t', 'nav-t', 'stat-jump')
_hover_n = 0

def _disarm(m):
    global _hover_n
    compound = m.group(1)
    if any(compound.endswith(k) for k in HOVER_KEEP):
        return m.group(0)
    _hover_n += 1
    return compound + ':hover:where(.__nh)'

css = re.sub(r'([A-Za-z0-9_.#\[\]="\'-]*):hover(?!:where)', _disarm, css)
print(f'hover selectors disarmed: {_hover_n}')

# ==========================================================================
# THE COMMENTS STAY IN THE SOURCE
# Every rule in this stylesheet carries the reasoning for it, and that is the
# point: the next person to touch it needs to know why a thing is the way it
# is. But the reasoning belongs in build/*.css, which is where it is written
# and where it survives. Shipping 110 KB of prose inside a single-file
# prototype only makes the file harder to move around — and this one has to
# be openable by double-click and small enough to share.
# ==========================================================================
_css_before = len(css)
css = re.sub(r'/\*[\s\S]*?\*/', '', css)
css = re.sub(r'\n[ \t]*\n+', '\n', css)
print(f'css comments stripped: {(_css_before - len(css))/1024:.0f} KB')

# ==========================================================================
# AND A STRAY `*/` IS THE ONE TYPO THIS BUILD USED TO SWALLOW
# Layers here open with a long comment and the rules follow it, so the common
# edit is "add a paragraph to the note above the rule" — and if the paragraph
# lands after the `*/` instead of before it, CSS reads the prose as the start
# of a selector and eats the rule underneath it. Nothing throws: the file
# builds, the page renders, and one declaration is silently absent. It has
# happened twice — §39.3's `.tw-lede` sizing (the widget's headline shipped at
# the body size for as long as that layer has existed) and §33.7's panel
# padding, found the same afternoon while fixing the first.
#
# After the strip above, an unmatched delimiter is all that is left of it, and
# it costs one regex to refuse. The check runs on the CONCATENATION rather than
# per file, and reports the layer by counting newlines, because a comment could
# in principle be opened in one layer and closed in the next — it never is, and
# saying so here is cheaper than a rule that assumes it.
# ==========================================================================
_stray = [m.start() for m in re.finditer(r'/\*|\*/', css)]
if _stray:
    _at = _stray[0]
    raise SystemExit(
        'STRAY COMMENT DELIMITER — nothing written.\n'
        f'  {len(_stray)} unmatched `/*` or `*/` survived the comment strip, '
        f'the first around line {css.count(chr(10), 0, _at) + 1} of the '
        'concatenated CSS:\n'
        f'    …{css[max(0, _at - 120):_at + 60]}…\n'
        '  Almost always a paragraph written AFTER the closing `*/` of the note '
        'above a rule.\n'
        '  The rule that follows it is being eaten. Move the prose inside the '
        'comment.')

inter = base64.b64encode((here / 'inter.woff2').read_bytes()).decode()
css = css.replace('__INTER__', f'data:font/woff2;base64,{inter}')
standin = base64.b64encode((here / 'stand-in.woff2').read_bytes()).decode()
css = css.replace('__STANDIN__', f'data:font/woff2;base64,{standin}')
soehne = base64.b64encode((here / 'soehne-buch.woff2').read_bytes()).decode()
css = css.replace('__SOEHNE__', f'data:font/woff2;base64,{soehne}')
soehnemono = base64.b64encode((here / 'soehne-mono-buch.woff2').read_bytes()).decode()
css = css.replace('__SOEHNEMONO__', f'data:font/woff2;base64,{soehnemono}')

# THE CHAT GREETING'S SERIF, AND IT IS THE ONE FACE HERE THAT IS NOT SÖHNE.
# Figma 446:402 sets "Hey, Derek! / What's going on?" in Abhaya Libre SemiBold
# at 40px — a serif, against a product that is otherwise two styles of one
# grotesque. That is the point of it: the greeting is the only line in the
# build that is Tal speaking as itself rather than the interface labelling
# something, and the file gives it a different voice to say so. §53.13 has the
# type spec and why the gradient span has to stay inline.
#
# Abhaya Libre is SIL OFL. This is Google Fonts' own latin subset, 12.6 KB, so
# the one embedded face covers the two sentences it is used for and nothing
# else — the sinhala and latin-ext cuts the family also ships are not fetched.
abhaya = base64.b64encode((here / 'abhaya-libre-semibold.woff2').read_bytes()).decode()
css = css.replace('__ABHAYA__', f'data:font/woff2;base64,{abhaya}')

# SÖHNE KRÄFTIG. The system is two styles of one face, and this is the
# second. If the file is not here the @font-face is dropped rather than left
# pointing at nothing — the browser then synthesises 600 from Buch, which is
# worse than Kräftig and better than a second typeface.
# ==========================================================================
# TAL'S MARK IS A GRADIENT CIRCLE
# The four-pointed star was the product's own drawing of "AI". Maryam
# supplied the real mark: a soft orange sphere, blurred at the edge. It is a
# RASTER — the falloff is a gradient with noise in it and an SVG of it would
# either band or be larger than the PNG — so it is embedded as a data URI and
# placed with `background-size:contain`, which lets one file serve the 15px
# mark on a thread label and the 81px one on the panel's empty state.
#
# THE ONE THING IT DOES NOT CARRY IS THE LOGO, and that is now a rule rather
# than an accident of the artwork: Figma 433:318 puts the three chevrons on
# the sphere in exactly ONE place — the chat's empty state, before anything
# has been asked — and leaves every other mark in the platform a plain
# sphere. §50 is where that split is stated.
# ==========================================================================
#
# AND IT IS FOOTAGE NOW, NOT A STILL. Maryam supplied the blob as a 15s
# 1600x1200 clip and asked for it wherever the orange sphere was — this build,
# the leader's portal, and the agent's, which is built on the design system.
# That is one token, so it is one edit: `tal-blob.webp` is the clip as an
# ANIMATED WEBP and everything reading `--tal-mark` moves without a selector.
# `build-ds.py` maps the same token to the same file, which is what carries it
# across; §53.7 has the crop, the round-crop proof and the loop measurement,
# and §53.8 has the three CSS-drawn spheres that had to be turned back into
# the artwork by hand because they never painted this token at all.
#
# THE ALPHA IS A CIRCLE, cut into the asset rather than left to a
# `border-radius` on a dozen selectors and two hand-written portals. It costs
# nothing: no lit pixel in any frame reaches past 391.3 of the 400 the
# inscribed circle allows, so the round crop removes none of the animation.
#
# CROPPED, SCALED AND ENCODED OUT OF BUILD. `tal-blob.webp` is committed at
# its final size because ffmpeg is not a build dependency and re-deriving it
# every build would make it one. `tal-blob.mp4` beside it is the cropped
# master the WebP was encoded from — kept for the next size change, embedded
# by nothing. `tal-circle.png` is kept for the same reason: it is what the
# mark was, and §27.1's note about its falloff is written against it.
# ==========================================================================
# AND IT FALLS BACK TO THE STILL, LOUDLY, BECAUSE THE ENCODE IS NOT A BUILD
# STEP. `tal-blob.webp` is committed rather than derived — the note above says
# why: ffmpeg is not a build dependency. The consequence is that the file can
# be ABSENT on a machine that has the source (`tal-blob.mp4` is committed, the
# WebP was not), and this line read it unguarded: the whole build died on a
# FileNotFoundError, which means the portal cannot be regenerated at all — and
# `hifi/talentnext-candidate-portal-v24.html` has to stay buildable, because
# Vercel serves the committed output and there is no build step in front of it.
#
# `tal-circle.png` is the honest fallback and it is already kept: the note
# above says it is "what the mark was", and §27.1's falloff measurement is
# written against it. So a machine without the clip builds the portal it built
# before §53, and says so in one line rather than looking finished. Drop the
# WebP in and it takes over with nothing else changed.
#
# NOT SILENT, and that distinction is the whole of this block. `build-ds.py`
# had the same substitution with a silent skip, and it shipped the literal
# string `__TALCIRCLE__` into `talentnext-ds.css` as Tal's mark — a broken URL
# in the design system, in three hand-written pages, with a successful build
# log above it. A missing asset must either be replaced by a named predecessor
# or stop the build; it must never quietly become nothing.
_blob = here / 'tal-blob.webp'
_circ = _blob if _blob.exists() else (here / 'tal-circle.png')
_mime = 'image/webp' if _circ.suffix == '.webp' else 'image/png'
if not _circ.exists():
    raise SystemExit(f'MISSING TAL MARK — neither {_blob.name} nor tal-circle.png '
                     f'is in {here}. Nothing written.')
css = css.replace('__TALCIRCLE__',
    f'data:{_mime};base64,' + base64.b64encode(_circ.read_bytes()).decode())
if _circ is _blob:
    print(f'Tal blob embedded: {_circ.stat().st_size/1024:.0f} KB')
else:
    print(f'!! tal-blob.webp NOT FOUND — fell back to {_circ.name} '
          f'({_circ.stat().st_size/1024:.0f} KB). Tal\'s mark is the STILL, not '
          f'the footage. Encode the WebP from tal-blob.mp4 to finish §53.')

# ==========================================================================
# THE COMPOSER'S GROUND
# `image 134` in Figma 433:276 / 439:481: a painterly coral gradient, 1672 x
# 941. The node shows it at h:424.86% top:-243.24% of the block, which is the
# band from 57.26% to 80.83% of its height — and that band is the SAME band
# whatever the block's height, because both numbers are percentages OF that
# block. So the crop is a constant, it is cut once here rather than at render
# time, and the CSS paints what is left at `100% 100%` with no crop of its
# own. 222 source rows instead of 941 is 9 KB instead of 1.5 MB.
# ==========================================================================
_mesh = here / 'ask-mesh.webp'
css = css.replace('__ASKMESH__',
    'data:image/webp;base64,' + base64.b64encode(_mesh.read_bytes()).decode())
print(f'ask mesh embedded: {_mesh.stat().st_size/1024:.0f} KB')

_kr = here / 'soehne-kraftig.woff2'
if _kr.exists():
    kraftig = base64.b64encode(_kr.read_bytes()).decode()
    css = css.replace('__SOEHNEKRAFTIG__', f'data:font/woff2;base64,{kraftig}')
    print('Söhne Kräftig embedded')
else:
    css = re.sub(r'@font-face\{[^}]*__SOEHNEKRAFTIG__[^}]*\}', '', css)
    print('Söhne Kräftig MISSING — 600 falls to the stand-in')

# ==========================================================================
# THE SIGN-UP ARTWORK, AND IT IS A DIFFERENT FILE NOW — 11 KB INSTEAD OF 235.
# `auth-split.webp` is the full-bleed painterly panel from Figma 483:976 (node
# 484:1064), 1010 x 1200, the left half of the new front door. §57 paints it.
#
# WHAT IT REPLACES WAS DEAD, WHICH IS THE PART WORTH KNOWING. `auth-art.webp`
# is 235 KB and was read by exactly one rule — §14's `.app .auth-img` — and
# NOTHING IN THE BUILD EVER EMITS `.auth-img`: `AUTH_ART` (views.js) prints
# `.auth-brand` and `.auth-mark`, and §17 supersedes §14's composition
# entirely. So a quarter of a megabyte of base64 was being embedded into every
# copy of the portal for a selector that could not match. It went unnoticed
# because a missing background image looks like a design decision.
#
# LOSSY, DELIBERATELY, AND THE OLD NOTE'S ARGUMENT DOES NOT CARRY OVER. That
# note said lossless "because the graphic is the logo". This graphic is not a
# logo — it is a smooth painterly gradient with no text, no edges and no marks
# in it, which is the content type WebP is best at. Encoded at q80: 45.4 dB
# PSNR, max channel error 18, 11 KB against 902 KB of source PNG. The wordmark
# on top of it is `LOGO_K`, a separate asset, still exact.
#
# `auth-art.webp` STAYS ON DISK, unreferenced, for the reason `tal-circle.png`
# does: it is what the front door looked like, and §17's chevron-mark geometry
# is written against it.
# ==========================================================================
art = base64.b64encode((here / 'auth-split.webp').read_bytes()).decode()
css = css.replace('__AUTHART__', f'data:image/webp;base64,{art}')
print(f'auth split artwork embedded: {(here / "auth-split.webp").stat().st_size/1024:.0f} KB')

# the brand chevron that bleeds off the left edge of the sign-up card, as
# exported from the Figma file at its placed size (112 x 294). Lossless WebP,
# so the embedded copy is the export: the crop is part of the artwork and it
# is neither redrawn nor re-scaled.
mark = base64.b64encode((here / 'auth-mark.webp').read_bytes()).decode()
css = css.replace('__AUTHMARK__', f'data:image/webp;base64,{mark}')

# the client's award artwork — the coin stack, the four shields and the three
# star medallions — embedded as one table so nothing on this page reaches the
# network. Cropped to their own alpha bounds at build time so every mark fills
# its box the same way.
# ==========================================================================
# THE CALL'S PHOTOGRAPHS — Figma 499:1617 and 499:2022, Maryam's own exports.
#
# THE FEED NEEDED A LANDSCAPE PHOTOGRAPH AND THE PORTAL HAD NONE. `AV`'s five
# faces are 200px squares, cut for a 36px disc, and the first cut of the call
# surface stretched one of them across a 1200px 16:9 feed — a 6x upscale, which
# read as a video call with a very bad connection. `call-feed.webp` is 735x412
# at its native size, 1.78:1, and it is NOT resized up: a bigger blur is still
# a blur, and 735 across a 1200px feed is 1.6x rather than 6x.
#
# THE TWO FACES ARE 240px SQUARES, cropped on the face, because the cohort
# call draws its members as 72px discs and 240 covers that on a 2x screen with
# room to spare. They are two members' own photographs — `CALL_FACE` in ai10.js
# says which two and why — and they do NOT go into `AV`: an avatar table the
# whole product reads is the wrong place for a photograph two tiles on one
# surface use, and changing a face in `AV` changes it on nine other pages.
#
# `faceW` HAS A THIRD READER NOW AND THE RULE ABOVE STILL HOLDS. `AGENTS.camila`
# (data.js) is the sixth agent, added on 31 Aug 2026 so the All-agents grid stops
# repeating Priya in its sixth cell, and her portrait is `CALL_ART.faceW` read
# DIRECTLY rather than copied into `AV` — which is the distinction that note is
# making: one more named reader is fine, one more row in the table nine pages
# walk is not. It works because this block is concatenated ahead of data.js
# below, so the const is initialised before `AGENTS` is built; if that order ever
# changes, `AGENTS.camila.img` is the thing that breaks. 240px also covers her
# 72px `.agh` card and the 166px `.rec-ph` if she is ever recommended.
#
# WebP at q78/q80 for the reason the sign-up artwork's note gives: these are
# photographs, which is the content type WebP is best at, and 28 KB for all
# three against 99 KB of source JPEG.
# ==========================================================================
CALL_ART = {'feed': 'call-feed.webp', 'faceW': 'call-face-w.webp', 'faceM': 'call-face-m.webp'}
_ca = ',\n  '.join(
    "%s:'data:image/webp;base64,%s'" % (k, base64.b64encode((here / f).read_bytes()).decode())
    for k, f in CALL_ART.items())
call_js = 'const CALL_ART = {\n  ' + _ca + '\n};\n'
print(f'call photographs embedded: {len(CALL_ART)} files, '
      f'{sum((here / f).stat().st_size for f in CALL_ART.values())/1024:.0f} KB')

AWARDS = ['points', 'bronze', 'silver', 'gold', 'involved', 'rank1', 'rank2', 'rank3']
_aw = ',\n  '.join(
    "%s:'data:image/webp;base64,%s'" % (k, base64.b64encode((here / 'awards' / (k + '.webp')).read_bytes()).decode())
    for k in AWARDS)
award_js = 'const AWARD = {\n  ' + _aw + '\n};\n'
print(f'award artwork embedded: {len(AWARDS)} marks, {len(award_js)/1024:.0f} KB')

# ==========================================================================
# THE 120px MARK IS A VIDEO, AND THE OTHER SEVEN SIZES ARE NOT
#
# `tal-blob.webp` — the animated WebP `--tal-mark` resolves to — serves every
# mark in the platform at 96 square, and that is the right size for all but
# one of them: the largest live consumer is 32px (the head band, the ask
# dock), so 96 is 3x on the densest screen anybody reads this on.
#
# THE CHAT'S EMPTY STATE IS THE EXCEPTION AND IT IS WHY THIS BLOCK EXISTS.
# §51.4 draws that mark at 120 CSS px, which is 240 device pixels at 2x — so
# the same asset that is 3x oversampled everywhere else is upscaled 1.5x
# THERE, and a soft-edged blob upscaled is the one thing that reads as a
# mistake rather than as a texture. It shipped that way once; this is the fix.
#
# AND THE FIX CANNOT BE A BIGGER WEBP. Animated WebP has no real inter-frame
# prediction — every frame carries its own detail — so the file scales with
# area: 96 square is 242 KB, 160 was 421 KB, and the 320 this mark actually
# wants would be about 2 MB. H.264 does the same 15 seconds at 320 square, 30
# fps, for 189 KB, because it predicts. So the one place that needs the
# resolution gets the codec that can afford it.
#
# WHICH MEANS AN ELEMENT, AND THAT IS THE WHOLE COST. A video cannot be a
# `background-image`, so it can only reach a surface a view prints — which is
# exactly the one surface that needs it (`askView`, ai4.js), and no help at
# all to the seven pseudo-element marks. Hence two assets rather than one, and
# the token still carries the general case: `build-ds.py` embeds only the
# WebP, so a portal built on the design system gets moving marks everywhere
# without needing this half at all.
#
# THE POSTER IS NOT DECORATION. It is frame 0 at the video's own 320, with the
# same circular alpha, 7 KB — what the box shows before the clip has decoded,
# and the whole of what reduced motion gets, since `autoplay` is the only
# thing `askView` withholds there and a paused `<video>` with no poster paints
# nothing at all.
# ==========================================================================
_blob = here / 'tal-blob.mp4'
_blobp = here / 'tal-blob-poster.webp'
blob_js = (
    "const TAL_BLOB = 'data:video/mp4;base64,"
    + base64.b64encode(_blob.read_bytes()).decode() + "';\n"
    "const TAL_BLOB_POSTER = 'data:image/webp;base64,"
    + base64.b64encode(_blobp.read_bytes()).decode() + "';\n")
print(f'Tal blob video embedded: {_blob.stat().st_size/1024:.0f} KB'
      f' + {_blobp.stat().st_size/1024:.0f} KB poster')

# TEMPORARY — nil.js is LAST, and that is load-bearing. It declares `const
# NIL`, which render() reads inside the `S.stage==='nil'` branch; a const is
# in its temporal dead zone until its own statement runs, so the boot render
# at the foot of views.js and the five re-renders at the feet of ai.js .. ai5.js
# would all throw if any of them were on that stage. None is — they are on
# `new` — and by the time a stage change can reach the run-up, this file has
# run. Being last also means its own closing render() is the final paint, with
# every wrapper in the chain installed. Delete with 30-nil.css.
# lead.js is after nil.js so that its render() is the final paint and its
# wrapper is the outermost in the chain — the `data-portal` stamp has to run
# after ai5's view stamp, not before it. It reads `AV` and `V` from data.js and
# views.js, and calls nothing that nil.js declares, so nothing about its
# position is load-bearing beyond being last.
js = award_js + '\n\n' + call_js + '\n\n' + blob_js + '\n\n' + '\n\n'.join((here / f).read_text() for f in ['icons.js', 'data.js', 'views.js', 'ai.js', 'ai2.js', 'ai3.js', 'ai4.js', 'ai5.js', 'nil.js', 'lead.js',
                                                        # The leader's seven module pages, plus the four pages under
                                                        # them. After lead.js because they read its data
                                                        # (`LEAD_COHORTS`, `LEAD_EVALS`, `LEADER`, `lpace`, `lavg`)
                                                        # and because each one REPLACES a `LEAD_SOON` stub that file
                                                        # assigns into `V` — the later assignment is the whole
                                                        # mechanism, so being after it is load-bearing. Before ai6
                                                        # so the note above it stays true: it has to see these views
                                                        # to summarise them.
                                                        #
                                                        # Order among the three is not load-bearing except in one
                                                        # place: lead4 pushes onto lead2's `LDR_SHEETS` registry, so
                                                        # it cannot be parsed first.
                                                        'lead2.js', 'lead3.js', 'lead4.js',
                                                        # LAST, and that is load-bearing twice: `placeBand` (ai5)
                                                        # has to have assembled the head band before this pass can
                                                        # find it, and `enhanceTalCards` (views.js) has to have
                                                        # added its suggested questions before this can take them
                                                        # out again. It also has to see lead.js's views to
                                                        # summarise them.
                                                        'ai6.js',
                                                        # Booking an interview inside Tal's thread. AFTER ai6, and
                                                        # for two reasons that both point the same way. Its own pass
                                                        # fills the widget hosts that `placeAsk` (ai4) has just
                                                        # printed, so its render wrapper has to be the outermost in
                                                        # the chain — which means being parsed last. And it REPLACES
                                                        # two of ai6's page summaries and wraps `pageSummary` itself,
                                                        # so ai6 has to have declared them before this can.
                                                        # It reads `AGENTS`, `S.cards` and `BMK` from
                                                        # data.js and views.js, and reassigns `talReset` — all of
                                                        # them function declarations or consts that have long since
                                                        # run by the time this file is parsed.
                                                        'ai7.js',
                                                        # TAL'S SCOPE. Adds no capability and no view — it states the
                                                        # narrow routes that have to be tried BEFORE the broad ones in
                                                        # data.js, and it wraps `talReply` so an unmatched question
                                                        # gets a support handoff instead of a capability list.
                                                        #
                                                        # LAST, and that is load-bearing for the only reason that ever
                                                        # matters in this list: `talReply` walks TAL_ROUTES first match
                                                        # wins, every pass unshifts, so the file parsed last is tried
                                                        # first. A correction has to be in front of the thing it
                                                        # corrects, which means being parsed after it — including
                                                        # after ai7, whose booking route this deliberately sits in
                                                        # front of.
                                                        #
                                                        # It reads `NEVER` and `MEMO` from ai2.js, `ivtAnswer` and
                                                        # `ivtFind` from ai.js, `LEAD_TAL` from lead.js, and `tw` /
                                                        # `twBtn` / `twChips` / `cfg` / `avatar` from views.js — all
                                                        # of them declared long before this parses, and the two ai.js
                                                        # ones guarded by typeof because the leader portal never
                                                        # reaches that route.
                                                        'ai8.js',
                                                        # ONLY THE LAST ANSWER KEEPS ITS CHIPS. `twChips`
                                                        # puts follow-up questions at the foot of a reply
                                                        # and they stayed pressable forever — ten exchanges
                                                        # deep the thread was five sets of chips, four of
                                                        # them about questions already answered. This
                                                        # strips them from every Tal turn but the last.
                                                        # LAST, and it has to be: ai4's `placeAsk` builds
                                                        # the thread, ai7's `placeBook` fills the booking
                                                        # hosts and ai8's wrapper stamps `.tw-top`, so this
                                                        # reads what all three produced. It adds no view and
                                                        # no route, and per trap 9 it keeps nothing — which
                                                        # answer is last is recomputed after every render
                                                        # rather than remembered.
                                                        'ai9.js',
                                                        # THE LIVE CALL. Join did nothing on any of the four
                                                        # appointments the candidate can be in; this is the
                                                        # surface it opens — the interview, the re-interview
                                                        # and the weekly cohort call, drawn by §60.
                                                        # LAST, and three things in it need to be. It reads
                                                        # `bkAgent` / `bkShort` from ai7.js so a call names
                                                        # the agent Tal actually booked rather than keeping
                                                        # its own copy of the slot; it wraps `setStage` and
                                                        # `go`, both of which every earlier pass calls; and
                                                        # `callScreen` is what views.js's first render branch
                                                        # looks for, which is only reachable once a Join has
                                                        # been pressed. It reads `COHORT`, `CH`, `AV`, `cfg`
                                                        # and `who` from views.js and data.js.
                                                        'ai10.js',
                                                        # THE TOP BAR'S BREADCRUMB, and the page heading it
                                                        # replaces. The portal switch left the bar for the
                                                        # account menu and the trail took its place, so the
                                                        # header now names the page — which made the `<h1>`
                                                        # 40px below it the same words twice.
                                                        # IT IS A PASS BECAUSE `shell()` IS EVALUATED BEFORE
                                                        # `view()`: one string concatenation in `render()`,
                                                        # so the header cannot read a page that does not
                                                        # exist yet. It ships an empty `.crumb-trail` and
                                                        # this fills it — the same shape `placeBand` and
                                                        # `placePageSummary` take, and trap 11's family.
                                                        # LAST, and it is the tidy-up at the foot that needs
                                                        # it rather than the trail: `tidyPh` asks whether
                                                        # anything is LEFT in the `.ph` once the heading is
                                                        # out, and §62's face, `talFirst`'s hoist and
                                                        # `placeBand`'s lift all have to have finished
                                                        # before that question has a stable answer.
                                                        # It reads `CRUMB_HOME`, `crumbHome` and `crumbMod`
                                                        # from views.js and touches no other state.
                                                        'ai11.js',
                                                        # TEMPORARY — the red accent trial's page list.
                                                        # Delete with §67; that layer's head has the
                                                        # full removal note. LAST so its wrapper is the
                                                        # outermost one and the class is decided after
                                                        # every other pass has finished with `.app`. It
                                                        # reads only `S.stage`, `S.view` and `S.call`.
                                                        'tmpaccent.js'])
# same argument as the stylesheet: the reasoning lives in build/*.js, which is
# where it is written and where it survives. Verified safe by scan — no `/*`
# or `*/` appears inside a string or a regex literal anywhere in the sources.
_js_before = len(js)
js = re.sub(r'^[ \t]*/\*[\s\S]*?\*/[ \t]*\n?', '', js, flags=re.M)
print(f'js comments stripped: {(_js_before - len(js))/1024:.0f} KB')

HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TalentNext — Candidate Portal · v24 · Material UI · Responsive</title>
<style>
{css}
</style>
</head>
<body>
<!-- prototype chrome — not part of the product -->
<div class="pt-bar">
  <img id="ptLogo" alt="TalentNext" style="height:18px;width:auto">
  <span class="dot"></span>
  <span class="pt-meta">Candidate portal · v24 · Material UI · Next in Leadership</span>
  <span class="pt-lab">Stage</span>
  <select class="pt-sel" id="pick" aria-label="Candidate stage"></select>
  <div class="pt-vp" id="vp" role="group" aria-label="Viewport">
    <button data-vp="mobile" class="on">Mobile</button>
    <button data-vp="tablet">Tablet</button>
    <button data-vp="fluid">Desktop</button>
    <span class="pt-scale" id="vpscale">100%</span>
  </div>
  <div class="pt-nav">
    <button id="back" title="Back" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z"/></svg></button>
    <button id="reset" title="Reset this stage" aria-label="Reset"><svg viewBox="0 0 24 24"><path d="M12 5V2L8 6l4 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7Z"/></svg></button>
  </div>
</div>

<div class="pt-stage">
  <div class="pt-fit" id="fit">
    <div class="device" id="device" data-vp="mobile"></div>
  </div>
</div>

<!-- ============================================================
     THE FRAME IS RESTORED BEFORE THE FIRST PAINT, NOT AFTER THE BUNDLE
     Maryam, 31 Aug 2026, with a screen recording: a reload showed a phone
     bezel on the dark stage, an empty white block inside it, and then the
     desktop frame sliding out from under it.

     ALL THREE ARE THE SAME CAUSE. `vpSet` is the LAST statement of the
     script below, so the stored preference could not be applied until two
     megabytes of bundle had parsed and rendered — until then the markup's
     own `data-vp="mobile"` stood, which is the bezel. §01 then gives
     `.device` a `transition` on `max-width` and `height`, so the correction
     was not a jump but a 240ms slide, which is what made it read as the page
     reloading twice.

     THIS SCRIPT IS TINY AND IT IS FIRST. It stamps the attribute and the
     switcher's `.on` before anything paints — and because the element has
     no previous computed style at that point, THE TRANSITION DOES NOT RUN.
     That is the whole fix for the slide; nothing had to be turned off, and
     the transition is still there for a real press of the switcher, which is
     the interaction it was written for.

     AND THE BOX IS HIDDEN UNTIL THE APP IS IN IT, which is the third part —
     a correctly sized empty white rectangle is still an empty white
     rectangle for as long as the bundle takes to parse. `visibility` rather
     than `display`, so the frame keeps its space and the stage does not
     reflow when it arrives; and it is set from JS onto the element's own
     style rather than stated in §01, DELIBERATELY: `.device` crosses into
     `design-system/`, `tn-agent-portal.html` hosts itself in one, and a rule
     hiding it until some class arrives would hide a hand-authored page for
     good. A prototype-chrome concern belongs in the prototype's chrome.

     IF THE BUNDLE NEVER PARSES the box stays hidden, and that is the right
     failure: the alternative was an empty frame that looked like a rendered
     product with nothing in it, which is the exact symptom the `node --check`
     below exists to prevent shipping.
     ============================================================ -->
<script>
(function(){{
  var SIZE = {{mobile:[390,844], tablet:[744,1133], fluid:[1440,900]}};
  var d = document.getElementById('device');
  d.style.visibility = 'hidden';
  var v = null;
  try {{ v = localStorage.getItem('tn-vp'); }} catch(e){{ /* storage denied */ }}
  if(!SIZE[v]) return;
  d.dataset.vp = v;
  var b = document.querySelectorAll('#vp button');
  for(var i = 0; i < b.length; i++) b[i].classList.toggle('on', b[i].dataset.vp === v);
  /* The inline size too, not just the attribute: `fitFrame` writes
     `style.width` / `style.height` and the attribute alone only moves
     §01's `max-width`, so the box would still be 844 tall on a desktop
     frame until the bundle got round to it. */
  if(v === 'fluid'){{
    d.style.width = '100%';
    d.style.height = Math.max(520, window.innerHeight - 160) + 'px';
  }} else {{
    d.style.width = SIZE[v][0] + 'px';
    d.style.height = Math.min(SIZE[v][1], Math.round(window.innerHeight * 0.82)) + 'px';
  }}
}})();
</script>

<script>
{js}

/* ============================================================
   VIEWPORT SWITCHER — prototype chrome.
   The app itself responds to its container, not to the window, so one
   document renders phone, tablet and desktop without a reload.
   ============================================================ */
/* Each frame keeps its true pixel size so the container queries inside it
   resolve honestly — a 1280px desktop frame must query as 1280 even when the
   preview pane is 700px wide. It is scaled down to fit instead of squashed,
   which is the only way the desktop layout is visible in a narrow panel. */
const VP_SIZE = {{mobile:[390,844], tablet:[744,1133], fluid:[1440,900]}};
const fitBox = document.getElementById('fit');

function fitFrame(){{
  const vp = device.dataset.vp;
  const stage = fitBox.parentElement;
  const pct = document.getElementById('vpscale');
  /* Desktop is not a device. It has no bezel and no fixed size: it takes the
     whole stage, which is also the honest preview, because a desktop browser
     is whatever width the person's window happens to be. */
  if(vp === 'fluid'){{
    device.style.transform = 'none';
    device.style.width = '100%';
    device.style.height = Math.max(520, window.innerHeight - stage.getBoundingClientRect().top) + 'px';
    fitBox.style.width = '100%';
    fitBox.style.height = device.style.height;
    if(pct) pct.textContent = Math.round(stage.clientWidth) + 'px';
    return;
  }}
  const [w, h] = VP_SIZE[vp] || VP_SIZE.mobile;
  device.style.width = w + 'px';
  device.style.height = Math.min(h, Math.round(window.innerHeight * 0.82)) + 'px';
  const avail = stage.clientWidth - 8;
  const scale = Math.min(1, avail / w);
  device.style.transform = scale < 1 ? `scale(${{scale}})` : 'none';
  fitBox.style.width = Math.round(w * scale) + 'px';
  fitBox.style.height = Math.round(parseFloat(device.style.height) * scale) + 'px';
  if(pct) pct.textContent = scale < 1 ? Math.round(scale * 100) + '%' : '100%';
}}

/* ============================================================
   AND THE FRAME YOU CHOSE SURVIVES A RELOAD.

   The hash already restores the app: `#day34/cohort`, `#leader/leadEvals`
   — portal, stage and view, written by the renderer and read by views.js at
   boot. The frame was the one thing it did not carry, so reloading while
   reading a desktop screen dropped you back into the 390px phone and you
   had to press Desktop again. Reviewing this prototype is mostly reload,
   look, edit, reload.

   `localStorage` AND NOT THE HASH, and the line is between the two kinds of
   state that are on this page. The hash is the APP: it is what you send
   somebody when you want them to see the screen you are looking at, and the
   renderer writes it on every render. The frame is not the app — it is
   prototype chrome, this reader's preference for how to look at it, and it
   has no business in a link or in a function that runs 200 times a sweep.
   Keeping it out also keeps `histWrite`'s contract intact: the URL stays
   three fields the boot reader already knows how to parse.

   IN A TRY/CATCH, for the reason `histWrite` is: `localStorage` THROWS
   rather than returning null when storage is denied — a sandboxed iframe or
   a browser set to block site data — and an unguarded read here is the last
   statement in the file, so it would take `fitFrame()` with it and leave the
   frame unsized. A refused write costs the preference and nothing else.

   NO `render()` ON THE RESTORE, though the click handler has one. Nothing in
   the JS reads `data-vp` — the app answers its CONTAINER, which is the whole
   design of this preview — so the attribute plus `fitFrame()` is the entire
   layout change. The click handler's render is there for `S.nav = false`,
   closing the drawer you may have left open on the phone, and at boot the
   drawer is already closed. Calling it anyway would mean a fourth boot
   render for nothing.
   ============================================================ */
const VP_KEY = 'tn-vp';

function vpSet(v, boot){{
  if(!VP_SIZE[v]) v = 'mobile';
  document.querySelectorAll('#vp button').forEach(x => x.classList.toggle('on', x.dataset.vp === v));
  device.dataset.vp = v;
  try {{ localStorage.setItem(VP_KEY, v); }} catch(e){{ /* storage denied: the
    choice stops surviving a reload, the switcher keeps working */ }}
  if(!boot){{ S.nav = false; render(); }}
  fitFrame();
}}

document.getElementById('vp').addEventListener('click', e => {{
  const b = e.target.closest('button[data-vp]');
  if(!b) return;
  vpSet(b.dataset.vp);
}});
window.addEventListener('resize', fitFrame);

let vpFirst = null;
try {{ vpFirst = localStorage.getItem(VP_KEY); }} catch(e){{}}
vpSet(vpFirst || 'mobile', true);
/* THE FRAME IS SHOWN ONLY NOW. The early script above hid it; this is the
   first moment the app is actually inside it — the bundle has parsed, every
   pass has run and `fitFrame` has just set the exact scale. Clearing the
   inline value rather than setting `visible` hands the property back to the
   stylesheet, so nothing here can outrank a rule §01 might want later. */
device.style.visibility = '';
</script>
</body>
</html>
"""

# ==========================================================================
# THE BUNDLE IS SYNTAX-CHECKED, BECAUSE ITS FAILURE MODE IS SILENT
# Nine files of template literals concatenate into one classic script. A
# single stray backtick — one inside a comment written into a template, which
# is how this check came to exist — closes the literal and the whole bundle
# stops parsing. The page then loads, styles, and renders an EMPTY frame:
# `<div id=device>` never gets its innerHTML because the script that would
# have set it was never run. Nothing appears in the console after the fact
# either, since the error is at parse time, so the symptom reads as "the app
# is blank" with no lead at all.
#
# `node --check` on the assembled script catches it in one second. Node is
# not a build dependency — it is here for verify.mjs and audit.mjs — so a
# machine without it gets a warning rather than a failed build, and a machine
# with it gets a hard stop before the broken file is written.
# ==========================================================================
import shutil, subprocess, tempfile
_node = shutil.which('node')
if _node:
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(js)
        _probe = fh.name
    _r = subprocess.run([_node, '--check', _probe], capture_output=True, text=True)
    pathlib.Path(_probe).unlink(missing_ok=True)
    if _r.returncode:
        # the temp path in node's message is meaningless to the reader; the
        # line number is not, and it maps onto the concatenation order above
        raise SystemExit('BUNDLE DOES NOT PARSE — nothing written.\n'
                         + _r.stderr.replace(_probe, '<bundle>'))
    print('bundle parses')
else:
    print('node not found — bundle NOT syntax-checked')

out = here.parent / 'talentnext-candidate-portal-v24.html'
out.write_text(HTML)
print(f'{out.name}  {len(HTML):,} chars  ({len(HTML)/1024:.0f} KB)')
