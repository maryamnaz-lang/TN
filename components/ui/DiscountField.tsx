"use client";
import { useState } from "react";
import { Text } from "../primitives/Text";
import { Button } from "./Button";
import { Input } from "./Field";
import { Icon } from "../Icon";
import { applyCode, type DiscCtx, type Sale } from "@/data/discounts";
import s from "./discountfield.module.css";

/* <DiscountField> — "Have a discount code?" on a checkout (Maryam 26 Oct 2026). Closed it is
   one quiet link; open it is the code input with Apply. A good code shows as a chip
   (the code and the amount off) with its own remove cross; a bad one shows the refusal
   from data/discounts.ts under the input. The page keeps the applied code and reprices
   off `onChange`. */
export type Applied = { code: string; off: number; d: unknown } | null;
/* `auto` is a live whole-platform discount (Maryam 26 Oct 2026): it shows as a chip with no
   remove, already applied. A typed code replaces it only when it takes off MORE; the two
   never stack. */
export function DiscountField({ ctx, cand, value, onChange, auto }: { ctx: DiscCtx; cand: string; value: Applied; onChange: (a: Applied) => void; auto?: Sale }) {
  const [open, setOpen] = useState(false), [code, setCode] = useState(""), [err, setErr] = useState("");
  const autoChip = auto && !value && (
    <span className={s.chip}>
      <Icon name="checkFilled" />
      <Text role="compact" as="span" strong>{auto.name}</Text>
      <Text role="compact" as="span" ink="secondary">−${auto.off} · applied automatically</Text>
    </span>
  );
  if (value) {
    return (
      <div className={s.applied}>
        <span className={s.chip}>
          <Icon name="checkFilled" />
          <Text role="compact" as="span" strong>{value.code}</Text>
          <Text role="compact" as="span" ink="secondary">−${value.off}</Text>
          <button type="button" className={s.x} aria-label={`Remove ${value.code}`} onClick={() => { onChange(null); setCode(""); }}><Icon name="close" /></button>
        </span>
      </div>
    );
  }
  if (!open) return <div className={s.stack}>{autoChip}<div><Button kind="link" icon="add" asIs onClick={() => setOpen(true)}>Have a discount code?</Button></div></div>;
  const apply = () => {
    const r = applyCode(code, ctx, cand);
    if (!r.ok) setErr(r.reason);
    else if (auto && r.off <= auto.off) setErr(`The ${auto.name} already takes as much or more off. Discounts don’t combine.`);
    else { setErr(""); onChange({ code: String(r.d.code).toUpperCase(), off: r.off, d: r.d }); }
  };
  return (
    <div className={s.stack}>
    {autoChip}
    <div className={s.f}>
      <Text role="label" as="span">Discount code</Text>
      <div className={s.row}>
        <Input value={code} autoFocus placeholder="Enter your code" onChange={(e) => { setCode(e.target.value.toUpperCase()); setErr(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") apply(); }} />
        <Button kind="secondary" onClick={apply}>Apply</Button>
      </div>
      {err && <Text role="caption" as="span" className={s.err}>{err}</Text>}
    </div>
    </div>
  );
}
