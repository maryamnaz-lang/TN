"use client";
import type { ReactNode } from "react";
import { Text } from "../primitives/Text";
import { Status } from "./Table";
import { Button } from "./Button";
import { Modal } from "./Modal";
import s from "./receipt.module.css";

/* <Receipt> — ONE receipt for both portals (Maryam 26 Oct 2026): a title (and an optional
   line under it), label/value rows over one hairline, the status (optional; the pre-pay review has none, Maryam 26 Oct 2026) as its last row, then the
   total on its own hairline. `footer` defaults to Close. The candidate's purchases and the
   talent agent's interview earnings both draw this, so the two read as one document. */
type Tone = "green" | "warn" | "plain";
export function Receipt({ title, desc, rows, status, total, footer, onClose }: {
  title: string; desc?: ReactNode; rows: [string, ReactNode][]; status?: { tone: Tone; text: string };
  total: [string, string]; footer?: ReactNode; onClose: () => void;
}) {
  return (
    <Modal label={title} onClose={onClose} footer={footer ?? <Button kind="secondary" onClick={onClose}>Close</Button>}>
      <div className={s.rec}>
        <div className={s.head}>
          <Text role="h3">{title}</Text>
          {desc && <Text role="desc">{desc}</Text>}
        </div>
        <div className={s.kv}>
          {rows.map(([l, v]) => [
            <Text key={`${l}-l`} role="compact" as="span" ink="secondary">{l}</Text>,
            <Text key={`${l}-v`} role="compact" as="span" strong>{v}</Text>,
          ])}
          {status && <><Text role="compact" as="span" ink="secondary">Status</Text><Status tone={status.tone}>{status.text}</Status></>}
        </div>
        <div className={s.total}>
          <Text role="h4" as="span">{total[0]}</Text>
          <Text role="h3" as="span">{total[1]}</Text>
        </div>
      </div>
    </Modal>
  );
}

/* <ReceiptModal> — the CANDIDATE's payment receipt.
   review  : shown BEFORE the money moves, from "Pay $X", so the candidate sees exactly
             what is charged and to which card; Cancel or "Confirm and Pay $X".
   (paid)  : the record afterwards, opened from Payments → View Receipt; Close.
   The same rows either way, so what was reviewed is what the ledger keeps. */
export type ReceiptData = { item: string; date: string; card?: string; brand?: string; amount: string; original?: string; discount?: { code: string; off: string } };

export function ReceiptModal({ r, review, onClose, onConfirm }: { r: ReceiptData; review?: boolean; onClose: () => void; onConfirm?: () => void }) {
  return (
    <Receipt
      title={review ? "Review your payment" : "TalentNext Receipt"}
      rows={[[review ? "Paying for" : "Paid for", r.item], ["Date", r.date], ["Card", r.card ? `${r.brand} •••• ${r.card}` : "—"],
        /* A discount code shows the price before it and its own line (Maryam 26 Oct 2026). */
        ...(r.discount && r.original ? [["Price", r.original], [`Discount (${r.discount.code})`, `−${r.discount.off}`]] as [string, string][] : [])]}
      status={review ? undefined : { tone: "green", text: "Paid" }}
      total={[review ? "Total to pay" : "Total paid", r.amount]}
      footer={review ? <><Button kind="secondary" onClick={onClose}>Cancel</Button><Button kind="primary" onClick={onConfirm}>Confirm and Pay {r.amount}</Button></> : undefined}
      onClose={onClose} />
  );
}
