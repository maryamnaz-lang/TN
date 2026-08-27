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
HOVER_KEEP = ('sn-item', 'btn-p', 'nav-t', 'stat-jump', 'psw-t')

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
    '__AUTHART__':   ('auth-art.webp',  'image/webp'),
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


def main():
    if not SRC.is_dir():
        sys.exit(f'source layers not found: {SRC}')

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
    # official Material filled cut (CLAUDE.md trap 7), so it is copied rather
    # than re-derived.
    icons = (SRC / 'icons.js').read_text()
    js_header = """/* ==========================================================================
   TALENTNEXT DESIGN SYSTEM — icons and helpers
   Generated by design-system/build-ds.py — DO NOT EDIT THIS FILE.
   The icon set is hifi/build/icons.js verbatim: 75 Material *filled* marks,
   the brand chevron, and the TalentNext lockup.

       document.body.insertAdjacentHTML('beforeend', I.calendar)  // <svg>
       inner('calendar')                                          // <path>
       TN_MARK                                                    // the logo
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
