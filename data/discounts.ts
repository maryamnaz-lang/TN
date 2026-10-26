/* ============================================================
   DISCOUNT CODES — one rule, read by the Super Admin's module and both candidate
   checkouts (Maryam 26 Oct 2026).

   A code is a PERCENTAGE or a FIXED AMOUNT off. ONE "Applies to" choice says what it
   covers, and each choice brings at most one follow-up (Maryam 26 Oct 2026, the old
   applies-to + tracks + courses trio overlapped):
     all       Whole platform: every course and interview, AUTOMATIC, no code.
     track     Tracks: every course and interview on the tracks picked.
     course    Courses: the courses picked.
   A Tracks or Courses pick may be "All" (Maryam 26 Oct 2026), saved as ["*"] so tracks
   or courses added later are covered too, not frozen to today's list.
     interview Interviews: off the price the candidate pays. There is no "part" to pick
               (Maryam 26 Oct 2026): a discount is the candidate's, not the agent's or
               TalentNext's, so it is always on the whole price.

   Every discount is FUNDED BY NEXT IN LEADERSHIP (NIL), TalentNext's parent account:
   the talent agent still gets their full fee and TalentNext still books its full
   commission and platform fee. The amount off is capped at the price, never below $0. Amounts are whole dollars, like every price here.
   ============================================================ */
import { DISCOUNTS } from "./admin";
import { FEE_TRACKS, priceFor, trackOf, type TrackKey } from "./fees";
import { COURSE_LIST } from "./level";

export const FUNDER = "Next in Leadership";

export type DiscKind = "pct" | "amount";
export type DiscScope = "all" | "track" | "course" | "interview";

export const KIND_OPTS: [DiscKind, string][] = [["pct", "Percentage off"], ["amount", "Fixed amount off"]];
/* "Whole platform" (Maryam 26 Oct 2026): every course and every interview, on every track,
   on the whole price. It carries no track or course of its own. */
export const SCOPE_OPTS: [DiscScope, string][] = [["all", "Whole platform (automatic)"], ["track", "Tracks"], ["course", "Courses"], ["interview", "Interviews"]];

/* ---- status (moved here from Finance.tsx so both portals read one copy) ----
   Every code is UNLIMITED (Maryam 26 Oct 2026): no usage limit and no per-candidate limit,
   so there is no "Exhausted" status. A code ends by its end date or by deactivation. */
const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const discUsed = (d: any) => (d.red || []).length;
export const discValue = (d: any) => (d.red || []).reduce((n: number, r: any) => n + (Number(r.discounted) || 0), 0);
export function discStatus(d: any) {
  if (d.deactivated) return "deactivated";
  const t = isoOf(new Date());
  if (d.end && d.end < t) return "expired";
  if (d.start && d.start > t) return "scheduled";
  return "live";
}

/* ---- how a code reads ---- */
const courseName = (k: string) => COURSE_LIST.find((c) => c.key === k)?.name ?? k;
export const valueLabel = (d: any) => (d.kind === "amount" ? `$${d.value} off` : `${d.value}%`);
export const ALL_PICK = "*";
const hasAll = (xs?: string[]) => !!xs?.includes(ALL_PICK);
export const tracksLabel = (d: any) => (hasAll(d.tracks) ? "All tracks" : d.tracks?.length ? FEE_TRACKS.filter((t) => d.tracks.includes(t.key)).map((t) => t.label).join(", ") : "All tracks");
export const coursesLabel = (d: any) => (hasAll(d.courses) ? "All courses" : d.courses?.length ? d.courses.map(courseName).join(", ") : "All courses");
export const isPlatform = (d: any) => d.scope === "all";
/* A whole-platform discount is AUTOMATIC (Maryam 26 Oct 2026): it has no code; while it is
   live it comes off every candidate price on its own. It is named, not coded. */
export const codeLabel = (d: any) => (isPlatform(d) ? d.name : String(d.code).toUpperCase());
export const hasCourse = (d: any) => ["all", "track", "course"].includes(d.scope);
export const hasInterview = (d: any) => ["all", "track", "interview"].includes(d.scope);
/* What it covers, in one line: "Whole platform", "Tracks · Explorer, Builder", "Courses · All courses",
   "Courses · Business Fundamentals", "Interviews". */
export function appliesLabel(d: any) {
  if (d.scope === "all") return "Whole platform";
  if (d.scope === "track") return `Tracks · ${tracksLabel(d)}`;
  if (d.scope === "course") return `Courses · ${coursesLabel(d)}`;
  return "Interviews";
}

/* ---- the maths ---- */
export type DiscCtx =
  | { kind: "course"; courseKey: string; price: number }
  | { kind: "interview"; track: TrackKey; fee: number; pct: number; platform: number };
export type DiscResult = { ok: true; d: any; base: number; off: number; total: number } | { ok: false; reason: string };

const priceOf = (c: DiscCtx) => (c.kind === "course" ? c.price : priceFor(c.fee, c.pct, c.platform));
export function discountFor(d: any, c: DiscCtx) {
  const price = priceOf(c), base = price;
  const raw = d.kind === "amount" ? d.value : (base * d.value) / 100;
  const off = Math.max(0, Math.min(base, Math.round(raw)));
  return { base, off, total: price - off };
}

/* The automatic discount on a price: the best LIVE whole-platform discount, or null.
   It is always on the whole price, so the price alone is enough. */
export type Sale = { d: any; off: number; now: number; name: string } | null;
export function saleFor(price: number): Sale {
  let best: Sale = null;
  for (const d of DISCOUNTS) {
    if (!isPlatform(d) || discStatus(d) !== "live" || price <= 0) continue;
    const off = Math.max(0, Math.min(price, Math.round(d.kind === "amount" ? d.value : (price * d.value) / 100)));
    if (off > 0 && (!best || off > best.off)) best = { d, off, now: price - off, name: d.name };
  }
  return best;
}

/* Check a code a candidate typed against this purchase. The refusal is the line they see. */
export function applyCode(input: string, c: DiscCtx, _cand?: string): DiscResult {
  const code = input.trim().toUpperCase();
  if (!code) return { ok: false, reason: "Enter a discount code." };
  const d = DISCOUNTS.find((x) => !isPlatform(x) && String(x.code).toUpperCase() === code);
  if (!d) return { ok: false, reason: "That code doesn’t exist. Check it and try again." };
  const st = discStatus(d);
  if (st === "scheduled") return { ok: false, reason: "That code isn’t active yet." };
  if (st === "expired") return { ok: false, reason: "That code has expired." };
  if (st === "deactivated") return { ok: false, reason: "That code is no longer available." };
  if (c.kind === "course" && !hasCourse(d)) return { ok: false, reason: "That code is for interviews, not courses." };
  if (c.kind === "interview" && !hasInterview(d)) return { ok: false, reason: "That code is for courses, not interviews." };
  const track = c.kind === "course" ? trackOf(c.courseKey) : c.track;
  if (d.scope === "track" && !hasAll(d.tracks) && !(d.tracks || []).includes(track)) return { ok: false, reason: "That code isn’t valid for your track." };
  if (c.kind === "course" && d.scope === "course" && !hasAll(d.courses) && !(d.courses || []).includes(c.courseKey)) return { ok: false, reason: "That code isn’t valid for this course." };
  const r = discountFor(d, c);
  if (r.off <= 0) return { ok: false, reason: "That code takes nothing off this purchase." };
  return { ok: true, d, ...r };
}

/* Record a redemption on the code, funded by NIL. */
export function redeem(d: any, cand: string, ref: string, original: number, off: number) {
  const date = isoOf(new Date());
  d.red = [{ cand, ref, date, original, discounted: off, paid: original - off, source: FUNDER }, ...(d.red || [])];
}
