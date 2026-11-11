"use client";
import { Text } from "../primitives/Text";
import { Button } from "./Button";
import s from "./paybar.module.css";

/* <PayBar> — the checkout's pay action, STUCK TO THE FOOT of the page (Maryam 10 Nov 2026, off a
   food-delivery cart, in our UI language). A white bar on one hairline, the page's own gutter:
   "Total" on the left with the amount under it (the full price struck before it when a code
   or sale applies), and the black pay button on the right. Below 600 the button
   drops under the total and runs the full width. It never scrolls away, so the price and the
   action stay in view while the candidate picks a card and enters a code. */
export function PayBar({ amount, was, label, onPay }: { amount: number; was?: number; label: string; onPay: () => void }) {
  const off = was != null && was > amount ? was - amount : 0;
  return (
    <>
    {/* The least space between the content and the bar; the bar's own auto margin takes the rest. */}
    <div className={s.gap} aria-hidden />
    <div className={s.bar}>
      <div className={s.in}>
        {/* The amount sits UNDER "Total", the full price struck before it when a code or sale
            applies; nothing between the total and the button (Maryam 11 Nov 2026). */}
        <span className={s.total}>
          <Text role="desc" as="span">Total</Text>
          <span className={s.amt}>
            {off > 0 && <s className={s.was}>${was}</s>}
            <Text role="h3" as="span">${amount}</Text>
          </span>
        </span>
        <span className={s.act}><Button kind="primary" go onClick={onPay}>{label}</Button></span>
      </div>
    </div>
    </>
  );
}
