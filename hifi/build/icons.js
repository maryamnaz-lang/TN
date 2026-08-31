/* ============================================================
   ICONS — Material Symbols (Apache 2.0), the ROUNDED style at
   FILL 0, wght 400, GRAD 0 — Google's current icon library, and
   LINEAR: open forms with rounded terminals, not solid ones.

   This replaces the Material *Icons* filled cut the platform ran
   on until 31 Aug 2026 (Maryam, by name and with the Google
   Fonts panel: Material Symbols / Rounded / Fill off). Every
   mark below is the official Rounded outlined file from
   google/material-design-icons, pasted rather than drawn, so the
   whole platform is one optical family and there is nothing to
   keep in sync by hand.

   THE GRID CHANGED AND THAT IS THE ONE THING THAT BREAKS A CALL
   SITE. Material Icons were 24x24 with y down from 0. Material
   Symbols are `0 -960 960 960` — forty times the size, with the
   baseline at y=0 and the glyph drawn ABOVE it, into negative y.
   A Symbols path in a `0 0 24 24` box renders as an invisible
   speck in the top-left corner; nothing throws. The proxy at the
   foot of this file states the viewBox once, and the two dozen
   call sites that wrap `inner()` in an <svg> of their own were
   all repointed with it — grep `viewBox="0 0 24 24"` after
   touching this file and expect only the four exceptions below.

   WHAT IS STILL ON THE 24 GRID, all deliberately. The BUILT
   portal contains exactly five and every one is correct:
   `nil.js`'s `NILP` proxy and views.js's two `ls-*` chapter
   player marks — the NIL microsite and the LightspeedVT mock are
   pictures of somebody else's UI, which is why `build.py`
   excludes both from the design system too — plus the prototype
   chrome's Back and Reset buttons, which live in `build.py`'s
   HTML TEMPLATE rather than in a layer, because the frame around
   the device is not the product. In source, add `CHEV` and
   `TN_MARK` (the brand's own marks, which carry their own boxes)
   and `tn-agent-portal.html`'s own chrome Reset. That is the
   whole list; anything else is a call site that was missed.

   THE PREVIOUS NOTE'S ARGUMENT IS REVERSED, NOT LOST. The filled
   cut was chosen because the set had drifted half-filled and
   half-outlined, and two weights of one idea in a row read as a
   mistake. That reasoning still holds and is what makes this
   safe: the fix was never "fill everything", it was "pick one
   cut and hold it". The cut is now linear. So the three marks
   that used to be called out as deliberately open — `circle`,
   `circleDash`, `check` — need no exception any more.

   FOUR MARKS ARE STILL FILLED, AND THAT IS NOT A HOLE IN THE
   RULE — IT IS THE OTHER HALF OF IT. In Material Symbols `FILL`
   is an axis for conveying STATE, not a second look: a lit
   rating slot, a done tick, a solid stop. `star`/`starOutline`,
   `checkFilled` and `stopFilled` are the four, the full argument
   and the test for adding a fifth are written over them below,
   and the short version is: a mark earns FILL 1 only when the
   SAME glyph also appears unfilled and the difference is the
   information. `trophy`, `certificate` and `shield` do not
   qualify — they are subject marks, and they stay linear.

   `stars()` (views.js, and the agent portal's own copy) is where
   that pairing is spent, and it is the one call site that had to
   change: it printed one glyph five times and let colour carry
   the rating, which was doing half the work under a solid set
   and would have been doing all of it under this one.
   ============================================================ */

const IP = {
menu:'M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z',
close:'M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z',
notification:'M200-200q-17 0-28.5-11.5T160-240q0-17 11.5-28.5T200-280h40v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h40q17 0 28.5 11.5T800-240q0 17-11.5 28.5T760-200H200Zm280-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z',
arrowRight:'M647-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h447L451-716q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L508-188q-11 11-27.5 11T452-188q-12-12-12-28.5t12-28.5l195-195Z',
/* THE COMPOSER'S ATTACHMENT. Figma 451:923 draws it as
   `vuesax/linear/paperclip` — a 1.5px open stroke — and under the filled cut
   that was the one thing ruled out. It no longer is: the set is linear now,
   and Material's Rounded `attach_file` IS an open paperclip, so the file's
   drawing and this table finally agree. Still Material's rather than the
   file's, because it has to sit beside `arrowUp` in the same 20px row and
   those two must be one family. Maryam asked for the MUI one by name. */
attachFile:'M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-330q0-17 11.5-28.5T400-720q17 0 28.5 11.5T440-680v330q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-350q0-17 11.5-28.5T680-720q17 0 28.5 11.5T720-680v350Z',
arrowLeft:'m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z',
/* SEND, AND IT IS A DIFFERENT ARROW ON PURPOSE. Material's `arrow_upward`.
   `arrowRight` is this product's GO — it ends every button that takes you to
   another page, forty-odd of them — so using it to submit a sentence would
   make one glyph mean two things in the same row. Up is what every field you
   type a prompt into uses: "this text goes from here to there", not "you go
   there". */
arrowUp:'M440-647 244-451q-12 12-28 11.5T188-452q-11-12-11.5-28t11.5-28l264-264q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l264 264q11 11 11 27.5T772-452q-12 12-28.5 12T715-452L520-647v447q0 17-11.5 28.5T480-160q-17 0-28.5-11.5T440-200v-447Z',
chevDown:'M480-362q-8 0-15-2.5t-13-8.5L268-557q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-373q-6 6-13 8.5t-15 2.5Z',
/* The pair to `chevDown` — `expand_less` to `expand_more`, so the two states
   of one button are the same glyph reflected rather than two glyphs that
   happen to point opposite ways. */
chevUp:'M480-529 324-373q-11 11-28 11t-28-11q-11-11-11-28t11-28l184-184q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l184 184q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-529Z',
chevRight:'M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z',
/* THE PAIR TO `chevRight`, ADDED FOR THE BOOKING CALENDAR'S MONTH ROW (Maryam,
   31 Aug 2026). Material's own `chevron_left`, pasted from
   `symbols/web/chevron_left/materialsymbolsrounded/chevron_left_24px.svg` —
   NOT `chevRight` reflected in CSS, which is the tempting one-liner and is
   wrong twice over: a `scaleX(-1)` mirrors the ROUNDED TERMINALS as well as the
   direction, so the two arrows in one row are subtly different objects, and it
   puts a transform on a button that §13 may already be animating. The same
   argument `chevUp` records for not reflecting `chevDown`. */
chevLeft:'m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z',
check:'m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z',
/* ============================================================
   THE FILLED EXCEPTIONS — AND FILL IS A STATE, NOT A STYLE.

   The set is FILL 0. These are the marks that carry FILL 1, and
   the rule is Google's own rather than ours: in Material Symbols
   `FILL` is an AXIS FOR CONVEYING STATE — selected/unselected,
   on/off, done/not done — not a second look you may prefer. So
   the platform sits at 0 and flips to 1 to say "this one is on".

   Which makes the list short and testable. A mark gets FILL 1
   only where the fill IS the information, i.e. where the SAME
   glyph also appears unfilled somewhere and the difference is
   what a reader is being asked to see:

     star / starOutline    a rating's lit and unlit slots
     checkFilled           done, against `checkOutline`'s not-done
     stopFilled            a solid dot, which is what its name says

   Everything else stays linear even when it is about an
   achievement, because it never appears both ways: `trophy`,
   `certificate` and `shield` are SUBJECT marks — the topic of a
   Tal widget, a stat cell's category, the security note beside a
   card form — and a filled trophy would be an award nobody has
   or has not won. `circleDash` needs no entry either: Rounded's
   `radio_button_checked` already draws its centre solid at
   FILL 0, so "this one, now" is drawn by the glyph, not the axis.

   THIS IS WHY THE KEYS THAT SAY "FILLED" KEPT THEIR NAMES. Under
   a filled set `checkFilled` and `stopFilled` read as leftovers;
   under this one they are the axis, stated in the key, and
   `checkOutline` is the other end of the same pair.
   ============================================================ */
checkFilled:'m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z',
/* VERIFIED IS ITS OWN GLYPH AND IT IS NOT `checkFilled` — Maryam, 31 Aug 2026,
   about the recommendation card's green mark ("use verified icon instead of
   tick mark here").

   THE TWO MARKS SAY DIFFERENT THINGS AND THAT IS THE WHOLE REASON. A ringed
   tick is "this is done" — it is what `jrnList` puts against a finished step
   and what `signedSummary` puts against a signed report. A scalloped badge is
   "this identity has been checked", which is a property of the person rather
   than a state of anything, and it is the mark every product that vets people
   uses for exactly this. Beside a name the ringed tick was reading as "Priya
   Nair: complete".

   Material Symbols Rounded, FILL 0, wght 400, 24px optical, pasted from
   `symbols/web/verified/materialsymbolsrounded/verified_24px.svg` rather than
   drawn — the rule this whole file is built on. It is on the `0 -960 960 960`
   grid like everything else here, so the proxy at the foot states its viewBox
   and no call site needs one.

   IT KEEPS `checkFilled`'S GREEN AND ITS 20px BOX. §70.5 states both on
   `.rec-v` and neither is about which glyph is inside; the ring and the badge
   have the same optical weight at 20, so nothing moves. */
verified:'m438-452-58-57q-11-11-27.5-11T324-508q-11 11-11 28t11 28l86 86q12 12 28 12t28-12l170-170q12-12 11.5-28T636-592q-12-12-28.5-12.5T579-593L438-452ZM326-90l-58-98-110-24q-15-3-24-15.5t-7-27.5l11-113-75-86q-10-11-10-26t10-26l75-86-11-113q-2-15 7-27.5t24-15.5l110-24 58-98q8-13 22-17.5t28 1.5l104 44 104-44q14-6 28-1.5t22 17.5l58 98 110 24q15 3 24 15.5t7 27.5l-11 113 75 86q10 11 10 26t-10 26l-75 86 11 113q2 15-7 27.5T802-212l-110 24-58 98q-8 13-22 17.5T584-74l-104-44-104 44q-14 6-28 1.5T326-90Zm52-72 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Z',
/* THE THREE STATE MARKS, and under a linear cut they finally cost nothing to
   explain. `circle` is `radio_button_unchecked` (nothing yet), `circleDash` is
   `radio_button_checked` (this one, now). The old note warned that a solid
   disc in the not-started slot would read as done; with no solid disc anywhere
   in the set, that trap is gone rather than avoided. */
circle:'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
circleDash:'M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
locked:'M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z',
info:'M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
warning:'M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm69-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Zm0-100Z',
error:'m480-424 116 116q11 11 28 11t28-11q11-11 11-28t-11-28L536-480l116-116q11-11 11-28t-11-28q-11-11-28-11t-28 11L480-536 364-652q-11-11-28-11t-28 11q-11 11-11 28t11 28l116 116-116 116q-11 11-11 28t11 28q11 11 28 11t28-11l116-116Zm0 344q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
view:'M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-134 0-244.5-72T61-462q-5-9-7.5-18.5T51-500q0-10 2.5-19.5T61-538q64-118 174.5-190T480-800q134 0 244.5 72T899-538q5 9 7.5 18.5T909-500q0 10-2.5 19.5T899-462q-64 118-174.5 190T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z',
viewOff:'M607-627q29 29 42.5 66t9.5 76q0 15-11 25.5T622-449q-15 0-25.5-10.5T586-485q5-26-3-50t-25-41q-17-17-41-26t-51-4q-15 0-25.5-11T430-643q0-15 10.5-25.5T466-679q38-4 75 9.5t66 42.5Zm-127-93q-19 0-37 1.5t-36 5.5q-17 3-30.5-5T358-742q-5-16 3.5-31t24.5-18q23-5 46.5-7t47.5-2q137 0 250.5 72T904-534q4 8 6 16.5t2 17.5q0 9-1.5 17.5T905-466q-18 40-44.5 75T802-327q-12 11-28 9t-26-16q-10-14-8.5-30.5T753-392q24-23 44-50t35-58q-50-101-144.5-160.5T480-720Zm0 520q-134 0-245-72.5T60-463q-5-8-7.5-17.5T50-500q0-10 2-19t7-18q20-40 46.5-76.5T166-680l-83-84q-11-12-10.5-28.5T84-820q11-11 28-11t28 11l680 680q11 11 11.5 27.5T820-84q-11 11-28 11t-28-11L624-222q-35 11-71 16.5t-73 5.5ZM222-624q-29 26-53 57t-41 67q50 101 144.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z',
/* THE STAR IS FILLED AND ITS UNLIT SLOT IS `starOutline`. A rating is the one
   place in the product where the same glyph is printed five times and only the
   fill says what the number is, so this is the axis doing exactly the job it
   exists for. `stars()` (views.js, and the agent portal's own copy) picks
   between the two; it used to print `star` five times and separate them with a
   `.f` class and COLOUR alone, which was doing half the work when the glyph was
   solid and would have been doing all of it here.

   `star` is filled at every OTHER call site too, and that is deliberate rather
   than incidental: all of them are ratings or standings — `.rec-r`'s agent
   score, the widget that explains that score, the pulse's "Your standing"
   column. There is no call site where an empty star would be right. */
star:'M480-269 314-169q-11 7-23 6t-21-8q-9-7-14-17.5t-2-23.5l44-189-147-127q-10-9-12.5-20.5T140-571q4-11 12-18t22-9l194-17 75-178q5-12 15.5-18t21.5-6q11 0 21.5 6t15.5 18l75 178 194 17q14 2 22 9t12 18q4 11 1.5 22.5T809-528L662-401l44 189q3 13-2 23.5T690-171q-9 7-21 8t-23-6L480-269Z',
starOutline:'m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Zm126 18L314-169q-11 7-23 6t-21-8q-9-7-14-17.5t-2-23.5l44-189-147-127q-10-9-12.5-20.5T140-571q4-11 12-18t22-9l194-17 75-178q5-12 15.5-18t21.5-6q11 0 21.5 6t15.5 18l75 178 194 17q14 2 22 9t12 18q4 11 1.5 22.5T809-528L662-401l44 189q3 13-2 23.5T690-171q-9 7-21 8t-23-6L480-269Zm0-201Z',
time:'M520-496v-144q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v159q0 8 3 15.5t9 13.5l132 132q11 11 28 11t28-11q11-11 11-28t-11-28L520-496ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z',
/* HOURGLASS — `hourglass_top`, not `hourglass_empty`. Outlined, the empty cut
   is two hollow triangles and at the 15px a status mark is drawn at it reads
   as a bow tie; `_top` keeps sand in the upper bulb, so what a person sees is
   time that has not run yet. That is the state it is used for: a step that is
   yours and is not finished. `circleDash` used to carry that meaning and could
   not — a ring with a dot in it is a radio button, which is a CONTROL, and
   putting one beside a title made a status look selectable. */
hourglass:'M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120ZM200-80q-17 0-28.5-11.5T160-120q0-17 11.5-28.5T200-160h40v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-40q-17 0-28.5-11.5T160-840q0-17 11.5-28.5T200-880h560q17 0 28.5 11.5T800-840q0 17-11.5 28.5T760-800h-40v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h40q17 0 28.5 11.5T800-120q0 17-11.5 28.5T760-80H200Z',
calendar:'M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-40q0-17 11.5-28.5T280-880q17 0 28.5 11.5T320-840v40h320v-40q0-17 11.5-28.5T680-880q17 0 28.5 11.5T720-840v40h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z',
video:'M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l126-126q10-10 22-5t12 19v344q0 14-12 19t-22-5L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z',
book:'M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640h-80v245q0 12-10 17.5t-20-.5l-49-30q-10-6-20.5-6t-20.5 6l-49 30q-10 6-20.5.5T440-555v-245H240v640Zm0 0v-640 640Zm200-395q0 12 10.5 17.5t20.5-.5l49-30q10-6 20.5-6t20.5 6l49 30q10 6 20 .5t10-17.5q0 12-10 17.5t-20-.5l-49-30q-10-6-20.5-6t-20.5 6l-49 30q-10 6-20.5.5T440-555Z',
chat:'m240-240-92 92q-19 19-43.5 8.5T80-177v-623q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Zm-34-80h594v-480H160v525l46-45Zm-46 0v-480 480Zm120-80h240q17 0 28.5-11.5T560-440q0-17-11.5-28.5T520-480H280q-17 0-28.5 11.5T240-440q0 17 11.5 28.5T280-400Zm0-120h400q17 0 28.5-11.5T720-560q0-17-11.5-28.5T680-600H280q-17 0-28.5 11.5T240-560q0 17 11.5 28.5T280-520Zm0-120h400q17 0 28.5-11.5T720-680q0-17-11.5-28.5T680-720H280q-17 0-28.5 11.5T240-680q0 17 11.5 28.5T280-640Z',
/* THE ONE MARK IN HERE THAT IS NOT GOOGLE'S. Every other path above is the
   official Rounded outlined file; this one is TRACED, off the 27px PNG Maryam
   supplied for the Tal button. Material's `chat` (line above) is a bubble with
   a tail and rules inside it, which at the 22px the FAB draws collapses into
   mush. Hers is a squircle with the bottom-left corner squared off instead of
   tailed, and TWO rules, a long one and a short one, far enough apart to
   survive at that size.

   IT IS THE SAME TRACE, MOVED ONTO THE NEW GRID — not re-drawn. The measured
   24-box path was mapped through (x,y) -> (40x, 40y - 960), the exact affine
   that takes Material Icons' box to Material Symbols'. A uniform scale plus a
   translate cannot change a shape, and it was checked the way the trace itself
   was: both versions rendered into one 960 box, bounding boxes equal to 2dp.
   Re-tracing it against the Rounded cut would have been a redrawing of a mark
   that is not Google's to begin with.

   `chat` above is untouched — the rail's messages icon still uses it. */
talChat:'M280 -880 H671.2 A200 200 0 0 1 871.2 -680 V-288.8 A200 200 0 0 1 671.2 -88.8 H80 V-680 A200 200 0 0 1 280 -880 ZM248.8 -612 v60 h452 v-60 ZM248.8 -416 v64 h328 v-64 Z',
group:'M40-240q-17 0-28.5-11.5T0-280v-23q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H40Zm240 0q-17 0-28.5-11.5T240-280v-25q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v25q0 17-11.5 28.5T680-240H280Zm500 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v23q0 17-11.5 28.5T920-240H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z',
dashboard:'M520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560q-17 0-28.5-11.5T520-640ZM120-480v-320q0-17 11.5-28.5T160-840h240q17 0 28.5 11.5T440-800v320q0 17-11.5 28.5T400-440H160q-17 0-28.5-11.5T120-480Zm400 320v-320q0-17 11.5-28.5T560-520h240q17 0 28.5 11.5T840-480v320q0 17-11.5 28.5T800-120H560q-17 0-28.5-11.5T520-160Zm-400 0v-160q0-17 11.5-28.5T160-360h240q17 0 28.5 11.5T440-320v160q0 17-11.5 28.5T400-120H160q-17 0-28.5-11.5T120-160Zm80-360h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z',
chart:'M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Zm120 200q-17 0-28.5 11.5T280-520v200q0 17 11.5 28.5T320-280q17 0 28.5-11.5T360-320v-200q0-17-11.5-28.5T320-560Zm160-120q-17 0-28.5 11.5T440-640v320q0 17 11.5 28.5T480-280q17 0 28.5-11.5T520-320v-320q0-17-11.5-28.5T480-680Zm160 240q-17 0-28.5 11.5T600-400v80q0 17 11.5 28.5T640-280q17 0 28.5-11.5T680-320v-80q0-17-11.5-28.5T640-440Z',
wallet:'M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z',
user:'M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Zm80 0h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z',
logout:'M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h240q17 0 28.5 11.5T480-160q0 17-11.5 28.5T440-120H200Zm487-320H400q-17 0-28.5-11.5T360-480q0-17 11.5-28.5T400-520h287l-75-75q-11-11-11-27t11-28q11-12 28-12.5t29 11.5l143 143q12 12 12 28t-12 28L669-309q-12 12-28.5 11.5T612-310q-11-12-10.5-28.5T613-366l74-74Z',
launch:'M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h560v-240q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v240q0 33-23.5 56.5T760-120H200Zm560-584L416-360q-11 11-28 11t-28-11q-11-11-11-28t11-28l344-344H600q-17 0-28.5-11.5T560-800q0-17 11.5-28.5T600-840h200q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560q-17 0-28.5-11.5T760-600v-104Z',
document:'M360-240h240q17 0 28.5-11.5T640-280q0-17-11.5-28.5T600-320H360q-17 0-28.5 11.5T320-280q0 17 11.5 28.5T360-240Zm0-160h240q17 0 28.5-11.5T640-440q0-17-11.5-28.5T600-480H360q-17 0-28.5 11.5T320-440q0 17 11.5 28.5T360-400ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h287q16 0 30.5 6t25.5 17l194 194q11 11 17 25.5t6 30.5v447q0 33-23.5 56.5T720-80H240Zm280-560v-160H240v640h480v-440H560q-17 0-28.5-11.5T520-640ZM240-800v200-200 640-640Z',
download:'M480-337q-8 0-15-2.5t-13-8.5L308-492q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T365-549l75 75v-286q0-17 11.5-28.5T480-800q17 0 28.5 11.5T520-760v286l75-75q12-12 28.5-11.5T652-548q11 12 11.5 28T652-492L508-348q-6 6-13 8.5t-15 2.5ZM240-160q-33 0-56.5-23.5T160-240v-80q0-17 11.5-28.5T200-360q17 0 28.5 11.5T240-320v80h480v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80q0 33-23.5 56.5T720-160H240Z',
trophy:'M440-200v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80q0-33 23.5-56.5T360-840h240q33 0 56.5 23.5T680-760h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h120q17 0 28.5 11.5T680-160q0 17-11.5 28.5T640-120H320q-17 0-28.5-11.5T280-160q0-17 11.5-28.5T320-200h120ZM280-528v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z',
send:'M792-443 176-183q-20 8-38-3.5T120-220v-520q0-22 18-33.5t38-3.5l616 260q25 11 25 37t-25 37ZM200-280l474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z',
play:'M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Zm80-207Zm0 134 210-134-210-134v268Z',
ai:'M760 -628 q-5 0 -10.48 -3 Q744 -634 742 -640 l-32 -70 -70 -32 q-6 -2 -9 -7.52 Q628 -755 628 -760 t3 -10.52 Q634 -776 640 -778 l70 -32 32 -70 q2 -6 7.52 -9 5.48 -3 10.48 -3 t10.52 3 q5.48 3 7.48 9 l32 70 70 32 q6 2 9 7.48 3 5.52 3 10.52 t-3 10.48 Q886 -744 880 -742 l-70 32 -32 70 q-2 6 -7.48 9 -5.52 3 -10.52 3 Zm0 560 q-5 0 -10.48 -3 -5.52 -3 -7.52 -9 l-32 -70 -70 -32 q-6 -2 -9 -7.52 -3 -5.48 -3 -10.48 t3 -10.48 q3 -5.52 9 -7.52 l70 -32 32 -70 q2 -6 7.52 -9 5.48 -3 10.48 -3 t10.52 3 q5.48 3 7.48 9 l32 70 70 32 q6 2 9 7.52 3 5.48 3 10.48 t-3 10.48 q-3 5.52 -9 7.52 l-70 32 -32 70 q-2 6 -7.48 9 -5.52 3 -10.52 3 ZM360 -217 q-11 0 -21 -6 T324 -240 l-64 -140 L120 -444 q-11 -5 -17 -15 -6 -10 -6 -21 t6 -21 q6 -10 17 -15 l140 -64 L324 -720 q5 -11 15 -17 10 -6 21 -6 t21 6 q10 6 15 17 l64 140 140 64 q11 5 17 15 6 10 6 21 t-6 21 q-6 10 -17 15 l-140 64 L396 -240 q-5 11 -15 17 -10 6 -21 6 Zm0 -137 L400 -440 l86 -40 L400 -520 360 -606 320 -520 l-86 40 L320 -440 ZM360 -480 Z',
bot:'M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM360-280h240q17 0 28.5-11.5T640-320q0-17-11.5-28.5T600-360H360q-17 0-28.5 11.5T320-320q0 17 11.5 28.5T360-280Zm-120 80h480v-480H240v480Zm240-240Z',
restart:'M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-70q0-17 11.5-28.5T760-800q17 0 28.5 11.5T800-760v200q0 17-11.5 28.5T760-520H560q-17 0-28.5-11.5T520-560q0-17 11.5-28.5T560-600h128q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q68 0 124.5-34.5T692-367q8-14 22.5-19.5t29.5-.5q16 5 23 21t-1 30q-41 80-117 128t-169 48Z',
location:'M480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 79q-14 0-28-5t-25-15q-65-60-115-117t-83.5-110.5q-33.5-53.5-51-103T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 45-17.5 94.5t-51 103Q698-301 648-244T533-127q-11 10-25 15t-28 5Zm0-453Zm0 80q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Z',
shield:'M480-84q-7 0-13-1t-12-3q-135-45-215-166.5T160-516v-189q0-25 14.5-45t37.5-29l240-90q14-5 28-5t28 5l240 90q23 9 37.5 29t14.5 45v189q0 140-80 261.5T505-88q-6 2-12 3t-13 1Zm0-80q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z',
email:'M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm640-480L501-453q-5 3-10.5 4.5T480-447q-5 0-10.5-1.5T459-453L160-640v400h640v-400ZM480-520l320-200H160l320 200ZM160-640v10-59 1-32 32-.5 58.5-10 400-400Z',
edit:'M200-200h57l391-391-57-57-391 391v57Zm-40 80q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm600-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z',
filter:'M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z',
search:'M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z',
overflow:'M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z',
idea:'M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM360-200q-17 0-28.5-11.5T320-240q0-17 11.5-28.5T360-280h240q17 0 28.5 11.5T640-240q0 17-11.5 28.5T600-200H360Zm-30-120q-69-41-109.5-110T180-580q0-125 87.5-212.5T480-880q125 0 212.5 87.5T780-580q0 81-40.5 150T630-320H330Zm24-80h252q45-32 69.5-79T700-580q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 54 24.5 101t69.5 79Zm126 0Z',
ticket:'M160-160q-33 0-56.5-23.5T80-240v-135q0-11 7-19t18-10q24-8 39.5-29t15.5-47q0-26-15.5-47T105-556q-11-2-18-10t-7-19v-135q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v135q0 11-7 19t-18 10q-24 8-39.5 29T800-480q0 26 15.5 47t39.5 29q11 2 18 10t7 19v135q0 33-23.5 56.5T800-160H160Zm0-80h640v-102q-37-22-58.5-58.5T720-480q0-43 21.5-79.5T800-618v-102H160v102q37 22 58.5 58.5T240-480q0 43-21.5 79.5T160-342v102Zm320-40q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480q0 17 11.5 28.5T480-440Zm0-160q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 120Z',
pause:'M600-200q-33 0-56.5-23.5T520-280v-400q0-33 23.5-56.5T600-760h80q33 0 56.5 23.5T760-680v400q0 33-23.5 56.5T680-200h-80Zm-320 0q-33 0-56.5-23.5T200-280v-400q0-33 23.5-56.5T280-760h80q33 0 56.5 23.5T440-680v400q0 33-23.5 56.5T360-200h-80Zm320-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z',
microphone:'M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 480v-83q-92-13-157.5-78T203-479q-2-17 9-29t28-12q17 0 28.5 11.5T284-480q14 70 69.5 115T480-320q72 0 127-45.5T676-480q4-17 15.5-28.5T720-520q17 0 28 12t9 29q-14 91-79 157t-158 79v83q0 17-11.5 28.5T480-120q-17 0-28.5-11.5T440-160Zm40-320q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z',
/* THE CALL'S SIX — `mic_off`, `videocam_off`, `present_to_all`, `front_hand`,
   `closed_caption`, `call_end` — the official Rounded outlined files, pasted,
   not drawn. `more_vert` is NOT here because `overflow` already is it.

   THE TWO "OFF" MARKS ARE THE SLASHED PAIR of the two live ones, which is why
   a muted microphone does not need a colour to read as muted — though §60
   gives it one anyway, because on a control bar the state has to carry from
   across a desk. Outlined, the slash reads BETTER than it did filled: it now
   cuts through an open form instead of across a solid one. */
micOff:'M672-377q-14-8-18-24.5t4-30.5q7-11 11.5-23.5T676-481q4-17 15.5-28t28.5-11q17 0 28 12t9 29q-3 23-10.5 45T727-392q-8 14-24.5 18.5T672-377ZM480-594Zm0-286q50 0 85 35t35 85v190q0 20-12.5 30T560-530q-15 0-27.5-10.5T520-571v-189q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v30q0 20-12.5 30T400-690q-15 0-27.5-10.5T360-731v-29q0-50 35-85t85-35Zm-40 720v-83q-92-12-157.5-77.5T203-479q-2-17 9-29t28-12q17 0 29 11.5t15 28.5q14 71 69 115.5T480-320q34 0 64.5-10.5T600-360l57 57q-29 23-63.5 39T520-243v83q0 17-11.5 28.5T480-120q-17 0-28.5-11.5T440-160Zm324 76L84-764q-11-11-11-28t11-28q11-11 28-11t28 11l680 680q11 11 11 28t-11 28q-11 11-28 11t-28-11Z',
videoOff:'m720-540 126-126q10-10 22-5t12 19v344q0 14-12 19t-22-5L720-420q0 17-11.5 28.5T680-380q-17 0-28.5-11.5T640-420v-300H360q-20 0-30-12.5T320-760q0-15 10-27.5t30-12.5h280q33 0 56.5 23.5T720-720v180Zm74 486L54-794q-11-11-11-28t11-28q11-11 28-11t28 11l740 740q11 11 11 28t-11 28q-11 11-28 11t-28-11ZM498-575ZM382-464ZM160-800l80 80h-80v480h480v-80l80 80q0 33-23.5 56.5T640-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800Z',
screenShare:'M440-487v127q0 17 11.5 28.5T480-320q17 0 28.5-11.5T520-360v-126l36 35q12 11 28 11.5t28-11.5q12-12 12-28.5T612-508L508-612q-12-12-28-12t-28 12L348-508q-12 12-11.5 28t12.5 28q12 11 28 11.5t28-11.5l35-35ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z',
raiseHand:'M520-920q17 0 28.5 11.5T560-880v360q0 17-11.5 28.5T520-480q-17 0-28.5-11.5T480-520v-360q0-17 11.5-28.5T520-920Zm-160 40q17 0 28.5 11.5T400-840v320q0 17-11.5 28.5T360-480q-17 0-28.5-11.5T320-520v-320q0-17 11.5-28.5T360-880ZM500-40q-142 0-241-99t-99-241v-380q0-17 11.5-28.5T200-800q17 0 28.5 11.5T240-760v380q0 109 75.5 184.5T500-120q109 0 184.5-75.5T760-380v-140q-17 0-28.5 11.5T720-480v120q0 17-11.5 28.5T680-320h-80q-33 0-56.5 23.5T520-240v40q0 17-11.5 28.5T480-160q-17 0-28.5-11.5T440-200v-40q0-66 47-113t113-47h40v-400q0-17 11.5-28.5T680-840q17 0 28.5 11.5T720-800v207q10-3 19.5-5t20.5-2h40q17 0 28.5 11.5T840-560v180q0 142-99 241T500-40Zm40-320Z',
captions:'M200-160q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v480q0 33-23.5 56.5T760-160H200Zm0-80h560v-480H200v480Zm80-120h120q17 0 28.5-11.5T440-400v-20q0-9-6-15t-15-6h-18q-9 0-15 6t-6 15h-80v-120h80q0 9 6 15t15 6h18q9 0 15-6t6-15v-20q0-17-11.5-28.5T400-600H280q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm400-240H560q-17 0-28.5 11.5T520-560v160q0 17 11.5 28.5T560-360h120q17 0 28.5-11.5T720-400v-20q0-9-6-15t-15-6h-18q-9 0-15 6t-6 15h-80v-120h80q0 9 6 15t15 6h18q9 0 15-6t6-15v-20q0-17-11.5-28.5T680-600ZM200-240v-480 480Z',
callEnd:'m136-304-92-90q-12-12-12-28t12-28q88-95 203-142.5T480-640q118 0 232.5 47.5T916-450q12 12 12 28t-12 28l-92 90q-11 11-25.5 12t-26.5-8l-116-88q-8-6-12-14t-4-18v-114q-38-12-78-19t-82-7q-42 0-82 7t-78 19v114q0 10-4 18t-12 14l-116 88q-12 9-26.5 8T136-304Zm104-198q-29 15-56 34.5T128-424l40 40 72-56v-62Zm480 2v60l72 56 40-38q-29-26-56-45t-56-33Zm-480-2Zm480 2Z',
thumbsUp:'M840-640q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14H280v-520l240-238q15-15 35.5-17.5T595-888q19 10 28 28t4 37l-45 183h258Zm-480 34v406h360l120-280v-80H480l54-220-174 174ZM160-120q-33 0-56.5-23.5T80-200v-360q0-33 23.5-56.5T160-640h120v80H160v360h120v80H160Zm200-80v-406 406Z',
thumbsDown:'M120-320q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14h440v520L440-82q-15 15-35.5 17.5T365-72q-19-10-28-28t-4-37l45-183H120Zm480-34v-406H240L120-480v80h360l-54 220 174-174Zm200-486q33 0 56.5 23.5T880-760v360q0 33-23.5 56.5T800-320H680v-80h120v-360H680v-80h120Zm-200 80v406-406Z',
copy:'M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-520q0-17 11.5-28.5T160-720q17 0 28.5 11.5T200-680v520h400q17 0 28.5 11.5T640-120q0 17-11.5 28.5T600-80H200Zm160-240v-480 480Z',
renew:'M240-478q0 16 2 31.5t7 30.5q5 17-1 32.5T227-361q-16 8-31.5 1.5T175-383q-8-23-11.5-47t-3.5-48q0-134 93-228t227-94h7l-36-36q-11-11-11-28t11-28q11-11 28-11t28 11l104 104q12 12 12 28t-12 28L507-628q-11 11-28 11t-28-11q-11-11-11-28t11-28l36-36h-7q-100 0-170 70.5T240-478Zm480-4q0-16-2-31.5t-7-30.5q-5-17 1-32.5t21-22.5q16-8 31.5-1.5T785-577q8 23 11.5 47t3.5 48q0 134-93 228t-227 94h-7l36 36q11 11 11 28t-11 28q-11 11-28 11t-28-11L349-172q-12-12-12-28t12-28l104-104q11-11 28-11t28 11q11 11 11 28t-11 28l-36 36h7q100 0 170-70.5T720-482Z',
misuse:'m480-424 116 116q11 11 28 11t28-11q11-11 11-28t-11-28L536-480l116-116q11-11 11-28t-11-28q-11-11-28-11t-28 11L480-536 364-652q-11-11-28-11t-28 11q-11 11-11 28t11 28l116 116-116 116q-11 11-11 28t11 28q11 11 28 11t28-11l116-116Zm0 344q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
helpDesk:'M480-120q-17 0-28.5-11.5T440-160q0-17 11.5-28.5T480-200h280v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v204q0 17-11.5 28.5T160-240q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H480ZM360-400q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400Zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400Zm-359-62q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z',
certificate:'m480-483-68 52q-6 5-12 .5t-4-11.5l26-84-70-56q-5-5-3-11.5t9-6.5h86l26-82q2-7 10-7t10 7l26 82h85q7 0 9.5 6.5T608-582l-71 56 26 84q2 7-4 11.5t-12-.5l-67-52Zm0 363L293-58q-20 7-36.5-5T240-95v-254q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v254q0 20-16.5 32T667-58l-187-62Zm0-200q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z',
courseCard:'M242-249q-20-11-31-29.5T200-320v-192l-96-53q-11-6-16-15t-5-20q0-11 5-20t16-15l338-184q9-5 18.5-7.5T480-829q10 0 19.5 2.5T518-819l381 208q10 5 15.5 14.5T920-576v256q0 17-11.5 28.5T880-280q-17 0-28.5-11.5T840-320v-236l-80 44v192q0 23-11 41.5T718-249L518-141q-9 5-18.5 7.5T480-131q-10 0-19.5-2.5T442-141L242-249Zm238-203 274-148-274-148-274 148 274 148Zm0 241 200-108v-151l-161 89q-9 5-19 7.5t-20 2.5q-10 0-20-2.5t-19-7.5l-161-89v151l200 108Zm0-241Zm0 121Zm0 0Z',
lightning:'m422-232 207-248H469l29-227-185 267h139l-30 208Zm-62-128H236q-24 0-35.5-21.5T203-423l299-430q10-14 26-19.5t33 .5q17 6 25 21t6 32l-32 259h155q26 0 36.5 23t-6.5 43L416-100q-11 13-27 17t-31-3q-15-7-23.5-21.5T328-139l32-221Zm111-110Z',
flag:'M280-400v240q0 17-11.5 28.5T240-120q-17 0-28.5-11.5T200-160v-600q0-17 11.5-28.5T240-800h287q14 0 25 9t14 23l10 48h184q17 0 28.5 11.5T800-680v320q0 17-11.5 28.5T760-320H553q-14 0-25-9t-14-23l-10-48H280Zm306 0h134v-240H543q-14 0-25-9t-14-23l-10-48H280v240h257q14 0 25 9t14 23l10 48Zm-86-160Z',
settings:'M433-80q-27 0-46.5-18T363-142l-9-66q-13-5-24.5-12T307-235l-62 26q-25 11-50 2t-39-32l-47-82q-14-23-8-49t27-43l53-40q-1-7-1-13.5v-27q0-6.5 1-13.5l-53-40q-21-17-27-43t8-49l47-82q14-23 39-32t50 2l62 26q11-8 23-15t24-12l9-66q4-26 23.5-44t46.5-18h94q27 0 46.5 18t23.5 44l9 66q13 5 24.5 12t22.5 15l62-26q25-11 50-2t39 32l47 82q14 23 8 49t-27 43l-53 40q1 7 1 13.5v27q0 6.5-2 13.5l53 40q21 17 27 43t-8 49l-48 82q-14 23-39 32t-50-2l-60-26q-11 8-23 15t-24 12l-9 66q-4 26-23.5 44T527-80h-94Zm7-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z',
link:'M280-280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h120q17 0 28.5 11.5T440-640q0 17-11.5 28.5T400-600H280q-50 0-85 35t-35 85q0 50 35 85t85 35h120q17 0 28.5 11.5T440-320q0 17-11.5 28.5T400-280H280Zm80-160q-17 0-28.5-11.5T320-480q0-17 11.5-28.5T360-520h240q17 0 28.5 11.5T640-480q0 17-11.5 28.5T600-440H360Zm200 160q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360h120q50 0 85-35t35-85q0-50-35-85t-85-35H560q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h120q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H560Z',
receipt:'M240-80q-50 0-85-35t-35-85v-80q0-17 11.5-28.5T160-320h80v-536q0-7 6-9.5t11 2.5l29 29q6 6 14 6t14-6l32-32q6-6 14-6t14 6l32 32q6 6 14 6t14-6l32-32q6-6 14-6t14 6l32 32q6 6 14 6t14-6l32-32q6-6 14-6t14 6l32 32q6 6 14 6t14-6l32-32q6-6 14-6t14 6l32 32q6 6 14 6t14-6l29-29q5-5 11-2.5t6 9.5v656q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h320q17 0 28.5 11.5T680-280v80q0 17 11.5 28.5T720-160ZM400-680h160q17 0 28.5 11.5T600-640q0 17-11.5 28.5T560-600H400q-17 0-28.5-11.5T360-640q0-17 11.5-28.5T400-680Zm0 120h160q17 0 28.5 11.5T600-520q0 17-11.5 28.5T560-480H400q-17 0-28.5-11.5T360-520q0-17 11.5-28.5T400-560Zm280-40q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z',
attachment:'M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-330q0-17 11.5-28.5T400-720q17 0 28.5 11.5T440-680v330q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-350q0-17 11.5-28.5T680-720q17 0 28.5 11.5T720-680v350Z',
add:'M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z',
subtract:'M240-440q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h480q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H240Z',
caretDown:'M459-381 314-526q-3-3-4.5-6.5T308-540q0-8 5.5-14t14.5-6h304q9 0 14.5 6t5.5 14q0 2-6 14L501-381q-5 5-10 7t-11 2q-6 0-11-2t-10-7Z',
checkOutline:'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
warningAlt:'M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm69-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Zm0-100Z',
/* `stopFilled` IS THE SOLID DOT ITS NAME PROMISES — `circle` at FILL 1, the
   only mark here whose whole content is the fill. `checkOutline` two lines up
   is the same ring at FILL 0, which is the pair that makes the axis legible:
   ring = not yet, ring-with-tick = done, solid = stopped. */
stopFilled:'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z',
skill:'m434-410 4 32q1 8 6.5 13t13.5 5h44q8 0 13.5-5t6.5-13l4-32q8-3 14.5-7t11.5-9l30 13q7 3 14 1t11-9l22-38q4-7 2.5-14t-7.5-12l-26-19q2-8 2-16t-2-16l26-19q6-5 7.5-12t-2.5-14l-22-38q-4-7-11-9t-14 1l-30 13q-5-5-11.5-9t-14.5-7l-4-32q-1-8-6.5-13t-13.5-5h-44q-8 0-13.5 5t-6.5 13l-4 32q-8 3-14.5 7t-11.5 9l-30-13q-7-3-14-1t-11 9l-22 38q-4 7-2.5 14t7.5 12l26 19q-2 8-2 16t2 16l-26 19q-6 5-7.5 12t2.5 14l22 38q4 7 11 9t14-1l30-13q5 5 11.5 9t14.5 7Zm46-50q-25 0-42.5-17.5T420-520q0-25 17.5-42.5T480-580q25 0 42.5 17.5T540-520q0 25-17.5 42.5T480-460ZM240-252q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80q-17 0-28.5-11.5T520-120v-80q0-17 11.5-28.5T560-240h120v-160q0-17 11.5-28.5T720-440h68l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v168q0 17-11.5 28.5T280-80q-17 0-28.5-11.5T240-120v-132Zm254-188Z',
growth:'M108-255q-12-12-11.5-28.5T108-311l211-214q23-23 57-23t57 23l103 104 208-206h-64q-17 0-28.5-11.5T640-667q0-17 11.5-28.5T680-707h160q17 0 28.5 11.5T880-667v160q0 17-11.5 28.5T840-467q-17 0-28.5-11.5T800-507v-64L593-364q-23 23-57 23t-57-23L376-467 164-255q-11 11-28 11t-28-11Z',
creditCard:'M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z'
};
/* Chevron — the brand's own mark, not a Material icon. Used for the
   Explorer / Builder / Trailblazer signature and as a section device. */
const CHEV = 'M5.6 3h4.7l7.9 9-7.9 9H5.6l7.9-9-7.9-9Z';

/* ============================================================
   THE TALENTNEXT ICON MARK
   `TALENTnext Icon-Black.svg` as supplied, verbatim: three
   polygons on a 194.28 canvas. NOT rebuilt on the 24 grid the
   rest of this file uses — a mark is not an icon, and redrawing
   the brand to fit a grid is how a logo drifts. The viewBox does
   the scaling, so `width`/`height` from the call site are all it
   needs, and it inherits `fill` like everything else here.

   It is the same three chevrons as `CHEV`, which is the section
   device. That is not duplication: CHEV is one repeatable arrow
   the product draws levels and headings with, and this is the
   logo's own lockup of three at the logo's own proportions.
   ============================================================ */
const TN_MARK = '<svg viewBox="0 0 194.28 194.28" aria-hidden="true">' +
  '<polygon points="36.15 44.6 57.8 44.6 104.16 97.2 26.14 185.53 4.9 185.53 82.92 97.2 36.15 44.6"/>' +
  '<polygon points="121.65 68.7 146.77 97.2 68.75 185.53 47.51 185.53 125.53 97.2 100.19 68.7 121.65 68.7"/>' +
  '<polygon points="125.96 145.39 147.61 145.39 189.37 97.38 111.66 8.76 90.42 8.76 168.13 97.38 125.96 145.39"/>' +
  '</svg>';

/* ============================================================
   THE TAL CHAT'S ARROW IS A LINE, NOT A WEDGE

   Its own const rather than an `IP` entry, and that is forced
   rather than chosen: `IP` holds ONE FILLED PATH each and the
   proxy below wraps whatever it finds in a 24-box with no
   `fill` or `stroke` of its own. This mark is two STROKED
   paths on a 20-box — a shaft and a chevron — so there is no
   shape of it that the proxy can print.

   IT DOES NOT REPLACE `arrowRight`. Everything else in the
   product goes forward on the Material filled wedge, and the
   set is one optical family on purpose (the note at the head of
   this file, and CLAUDE.md's trap 7). This is the drawing Figma
   433:276 / 439:481 use in three places on ONE screen — the
   back control, the field's send, and the band — so it is an
   addition scoped to that screen, not a change to the set.

   `currentColor`, so the two places that draw it can each say
   what colour it is; and 1.5 rather than the file's default 1,
   because these render at exactly 20px, where a 1px stroke is
   one device pixel and half-disappears against the composer's
   mesh. Same drawing, at a weight that survives it.
   ============================================================ */
/* ============================================================
   THE LOGO AS THREE SEPARATE CHEVRONS

   `TN_MARK` above is the same lockup in one <svg>, and it stays
   — it is what the product draws the logo with anywhere the
   logo is a logo. This is the lockup taken apart, because the
   chat's empty state animates the three arriving one at a time
   (§50.4) and a path inside a shared <svg> cannot be moved
   independently of its siblings without a transform on the
   path, which then has to be composed with the animation's own.
   Three boxes, one path each, is the version with nothing to
   compose.

   THE VIEWBOX IS THE SAME 50 IN ALL THREE, and that is the
   trick that makes this cheap: each chevron keeps the x it has
   in the lockup, so the three stacked on top of each other ARE
   the logo, with no positioning to work out. Only the animation
   moves them.

   Paths are Maryam's `Tn Icon-white for sphere.svg` verbatim.
   `fill` is left to §50, which paints them white.
   ============================================================ */
const TN_CHEVRONS = [
  'M9.30424 11.4785H14.8761L26.8073 25.0157L6.72806 47.7483H1.26172L21.341 25.0157L9.30424 11.4785Z',
  'M31.3073 17.6807L37.7722 25.0154L17.6929 47.7481H12.2266L32.3058 25.0154L25.7843 17.6807H31.3073Z',
  'M32.4161 37.418H37.988L48.7354 25.0622L28.7359 2.25488H23.2695L43.269 25.0622L32.4161 37.418Z'
].map((d, i) =>
  `<i class="tnc tnc-${i + 1}"><svg viewBox="0 0 50 50" aria-hidden="true">` +
  `<path d="${d}"/></svg></i>`).join('');

const ARROW_LINE = '<svg viewBox="0 0 20 20" aria-hidden="true" fill="none">' +
  '<path d="M12.025 4.94167 17.0833 10l-5.0583 5.0583" stroke="currentColor" ' +
  'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<path d="M2.91667 10h14.025" stroke="currentColor" ' +
  'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';

const I = new Proxy({}, {
  get: (_, k) => `<svg viewBox="0 -960 960 960" aria-hidden="true">${IP[k] ? `<path d="${IP[k]}"/>` : ''}</svg>`
});
const inner = n => IP[n] ? `<path d="${IP[n]}"/>` : '';
