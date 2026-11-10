"use client";
import { useState } from "react";
import s from "./toggle.module.css";
import { Text } from "../primitives/Text";

/* <ToggleRow> — a setting that switches on and off. `disabled` holds it off and
   unpressable; `tip` is a short line shown on hover or focus explaining why (Maryam
   10 Nov 2026, the agent's marketplace visibility). aria-disabled rather than the
   disabled attribute, so the switch still takes focus and the tip can be read. */
export function ToggleRow({ title, desc, on: start = true, disabled, tip }: { title: string; desc: string; on?: boolean; disabled?: boolean; tip?: string }) {
  const [on, setOn] = useState(start);
  return (
    <div className={s.row}>
      <span className={s.b}><Text role="h4" as="span">{title}</Text><Text role="desc" as="span">{desc}</Text></span>
      <span className={s.tipWrap}>
        <button className={s.sw} role="switch" aria-checked={!disabled && on} aria-disabled={disabled || undefined} aria-label={title}
          onClick={() => { if (!disabled) setOn((o) => !o); }} />
        {disabled && tip && <Text role="label" as="span" className={s.tip} aria-hidden>{tip}</Text>}
      </span>
    </div>
  );
}
