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
                 '54-tintedge.css'])
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

# the sign-up artwork, exported from the Figma file. Lossless WebP so the
# embedded copy is pixel-identical to what came out of Figma — the graphic is
# the logo and it does not get re-drawn, re-scaled or re-compressed.
art = base64.b64encode((here / 'auth-art.webp').read_bytes()).decode()
css = css.replace('__AUTHART__', f'data:image/webp;base64,{art}')

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
js = award_js + '\n\n' + blob_js + '\n\n' + '\n\n'.join((here / f).read_text() for f in ['icons.js', 'data.js', 'views.js', 'ai.js', 'ai2.js', 'ai3.js', 'ai4.js', 'ai5.js', 'nil.js', 'lead.js',
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
                                                        'ai9.js'])
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
