"use client";
import { saleFor } from "@/data/discounts";
import s from "./price.module.css";

/* <Price> — every price a candidate sees (Maryam 26 Oct 2026). While a whole-platform
   discount is live (data/discounts.ts saleFor) it comes off automatically: the old price
   struck through, then the new one. Otherwise just the price. Inline, so it sits in a
   sentence ("for $95") as well as in a fact. */
/* `paid` is what was actually charged, for a confirmation after the fact (Maryam 26 Oct 2026):
   a typed code or a sale lowered it, so it shows struck the same way. */
export function Price({ amount, paid }: { amount: number; paid?: number }) {
  const now = paid ?? saleFor(amount)?.now;
  if (now == null || now >= amount) return <>${paid ?? amount}</>;
  return <span className={s.p}><s className={s.was}>${amount}</s>${now}</span>;
}
