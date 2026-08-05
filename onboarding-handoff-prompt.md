# Handoff prompt — build the candidate onboarding flow, from arrival to a booked interview

Paste everything below the line into Claude Code.

---

## Before you start

Read `tal-handoff-prompt.md` in this same folder first. It describes the file you're editing
(`tn-portals.html`), how it's structured, the black-and-white wireframe rules, the product
constraints, and how to verify changes with jsdom. All of that applies here unchanged. This prompt
only describes the new flow.

## The gap being closed

The candidate portal currently begins at the **"Just joined"** state (`data-act="jump:new"`) — a
candidate who already has an account and is about to book their interview. Everything before that
point is missing from the prototype.

## What is explicitly out of scope

Everything that happens on the Next In Leadership marketing website, which per the BA's onboarding
diagram is: the quiz itself, **contact capture** (first name, last name, email, mobile — all four
required before any result is shown), **phone verification**, and the **result reveal**. Do not build
any of it. A candidate cannot get a result, an account, or any progress until their number is
validated, so by the time TalentNext exists to them, all four steps are behind them.

Our flow starts at the moment the candidate moves from their result into TalentNext to book an
interview, and ends when they reach the existing "Just joined" dashboard.

## What arrives with the candidate

Treat the arrival as a hand-off carrying:

- Their **bucket** — Explorer, Builder or Trailblazer. Per the diagram this is framed as a
  **narrative, not a score**. The website never shows a number, and neither should the first screens
  here.
- Their underlying quiz dimensions (Decisiveness, Delegation, Directness, Coaching, Composure), which
  the existing My Level screen already uses.
- First name, last name, email, and a mobile number that is **already verified**.
- A participant ID. This is the durable identifier for this person across every system — LightSpeed's
  CTO confirmed their platform can key off ours — so surface it internally but never to the candidate.

Two consequences to honour:

- **Never re-ask and never re-verify.** No OTP step, no phone confirmation, no re-entry of anything
  captured upstream. Pre-fill it.
- The website already checked the phone against existing records, so a duplicate is caught before we
  see it. Don't design a duplicate-account screen; do handle "this person already has an account" on
  the sign-in path below.

## The rule about AI at the start

The diagram is explicit that at result reveal the AI stays invisible — no mention of scoring, models
or algorithms. Carry that forward into the first screens of our flow: **Tal does not appear during
onboarding.** Tal's first appearance is when the candidate reaches booking, where a recommendation is
useful and obviously a recommendation. Nothing in steps 1–4 below should reference AI, scoring, or
how the bucket was derived.

## Screens to build, in order

Build these as a stepped flow using the existing centred stepper component (not full width). Each
step gets a breadcrumb, consistent with the rest of the portal.

1. **Claim your account.** The candidate sets a password. TalentNext is the identity provider for the
   whole system, so this is the only place a password is ever created. Their name, email and verified
   mobile are shown pre-filled and not editable-by-default. Reference their bucket in narrative terms
   as continuity from the website — no numbers.

2. **Consent.** This is the most important screen in the flow and currently the least defined in the
   whole product. There are **three separate processing purposes** and no decisions have been made on
   any of them. Build it with genuinely separate, individually toggleable consents — not one blanket
   checkbox — because that is the only structure that survives whatever gets decided later. Do not
   invent legal copy; use short placeholder purpose descriptions.

3. **Profile.** Current role, company, and **timezone**. Timezone is not optional — the whole booking
   flow shows agent slots, and they are meaningless without it. Include the profile picture affordance
   in the wireframe crossed-box style already used on the Account screen.

4. **Hand-off into booking.** Do not end the flow on a dead "you're all set" screen. End it by moving
   the candidate straight into the existing interview booking flow, with Tal's recommended agent
   surfaced there — see item 3 of `tal-handoff-prompt.md`. The candidate's first real action in the
   product should be booking, not dismissing a success message.

Also build the **returning sign-in** screen: email and password, forgot-password, and a route for
someone who completed the website steps but abandoned onboarding, landing them back at the step they
left.

## Open questions — flag, don't design

Add each of these to the internal Integration notes screen (`VIEWS.seam`) as an open item. Do not
invent an answer on a candidate screen.

- **Verification limits.** Attempt limit, lockout behaviour and the support fallback are all
  undefined upstream. If a candidate arrives having been locked out, we have no defined state.
- **The consent purposes.** Three purposes, no wording and no decision on which are mandatory versus
  optional. Note that continuing is currently blocked only on the ones marked mandatory in the
  prototype, and that this is a placeholder assumption.
- **Where origin capture lives.** "How did you hear about us" appears in the BA's flow, but the lead
  is created on the website, so it may already be captured upstream. Do not build it here until
  confirmed; note the question.
- **Bucket versus level.** The website reveals Explorer / Builder / Trailblazer. The existing
  prototype uses its own level naming with dimension dials on My Level. Whether the buckets replace
  that naming across the product, or sit alongside it as an entry-level label, is unresolved. Keep the
  existing My Level screen untouched and flag the conflict.

## Rules specific to this flow

- **Keep to the steps above.** They come from the BA's onboarding diagram and Umair's requirements
  document. Do not add steps of your own invention.
- **No LightSpeed account is created here, and none is mentioned.** LightSpeed creates its own user
  silently on the candidate's first course click, driven by SSO claims. Onboarding must contain no
  reference to LightSpeed, SAML, SSO, or a second set of credentials.
- **One person, one record.** A candidate who later becomes an agent keeps the same participant ID.
  Don't design anything that would break if the same human held both roles.
- Where a step could fail — a stale or missing hand-off, an email that already has an account, a
  password that doesn't meet policy — show the error state. These are the states that get skipped in
  wireframes and then argued about in build.

## Wiring it into the prototype

- Add the flow so it is reachable and demoable: a new entry in the prototype-state switcher alongside
  the existing six, e.g. `data-act="jump:signup"`, landing on step 1.
- Completing step 4 must leave `S` in exactly the state the existing `jump:new` produces, so the
  candidate lands on the current "Just joined" dashboard with no discontinuity. Verify this by
  comparing the two paths.
- Persist partial progress in `S` the way the rest of the prototype persists state, so the
  resume-where-you-left-off route in the sign-in screen actually works.

## Verify

Alongside the harness patterns in `tal-handoff-prompt.md`:

- Walk all four steps in order and assert each renders, has a breadcrumb, and has a centred stepper.
- Assert **no OTP or phone-verification screen exists anywhere in the flow**, and that email and
  mobile are pre-filled rather than requested.
- Assert no screen in steps 1–3 contains "AI", "Tal", "score", "algorithm" or "model".
- Assert the consent screen exposes three independently toggleable consents, and that continuing is
  blocked until the mandatory ones are given.
- Assert the profile step collects a timezone, and that the booking slots shown after step 4 reflect
  it.
- Assert the flow ends on the same dashboard as `jump:new`, with equivalent `S`.
- Re-run the leak test: no screen may contain "lightspeed", "SAML", "Service Provider", or "Join Now".
- Confirm the quiz, contact capture and result reveal were not built anywhere.
