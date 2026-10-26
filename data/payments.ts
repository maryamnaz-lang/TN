/* PAYMENTS — Phase 1 V.billing / payRows / receiptModal, read 15 Oct 2026. */
import { atLeast } from "@/lib/demo";
import { AGENT_PRIYA } from "./candidate";
import { courseByKey } from "./level";

/* `original` + `discount` are set when a discount code was used (Maryam 26 Oct 2026); the
   receipt then shows the price, the code's line and the amount actually paid. */
export type Payment = { id: string; item: string; date: string; card?: string; brand?: string; amount: string; original?: string; discount?: { code: string; off: string } };

/* A course row names the COURSE, read off the catalogue (Maryam 26 Oct 2026). */
const E2: Payment = { id: "e2", item: courseByKey("E2").name, date: "Feb 4, 2026", card: "8210", brand: "Mastercard", amount: "$490" };
/* No row for the first interview: nothing was paid, and its booking carries no price or
   "Complimentary" wording anywhere (Maryam 26 Oct 2026). */
const E3: Payment = { id: "e3", item: courseByKey("E3").name, date: "Aug 14, 2026", card: "4242", brand: "Visa", amount: "$690" };
/* The re-interview is charged at Priya's price for this candidate's track (data/candidate.ts), not typed twice. */
const RE: Payment = { id: "re", item: "Re-interview · Priya Nair", date: "Nov 20, 2026", card: "4242", brand: "Visa", amount: `$${AGENT_PRIYA.price}` };

/* Newest first; what has been paid by the stage the candidate is at, with anything bought
   during this visit (`made`, the demo's `ui.purchases`) on top. A purchase replaces the
   stage row with the same id, so buying the E3 course shows today's date and the card
   actually picked, not the seed's (Maryam 26 Oct 2026: a purchase lands in Payments with
   its receipt). */
export function payments(stage: string, made: Payment[] = []): Payment[] {
  const rows: Payment[] = [];
  if (atLeast(stage, "week1")) rows.push(E3);
  if (stage === "promoted") rows.push(RE);
  rows.push(E2);
  const ids = new Set(made.map((p) => p.id));
  return [...made, ...rows.filter((p) => !ids.has(p.id))];
}

/* A purchase's date in the ledger's own format ("Oct 26, 2026"). */
export const ledgerDate = (d = new Date()) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* What a purchase records: the row the Payments ledger and its receipt read. */
export const purchase = (id: string, item: string, price: number, card: { brand: string; last4: string }, disc?: { code: string; off: number }): Payment =>
  ({ id, item, date: ledgerDate(), card: card.last4, brand: card.brand, amount: `$${price - (disc?.off ?? 0)}`,
     ...(disc ? { original: `$${price}`, discount: { code: disc.code, off: `$${disc.off}` } } : {}) });
