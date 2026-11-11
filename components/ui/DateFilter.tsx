"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import s from "./datefilter.module.css";

/* Dates are shown in the US format, MM/DD/YYYY with slashes, everywhere (Maryam 11 Nov 2026).
   Every value here is ISO yyyy-mm-dd underneath, or "" for none. Never a native date input. */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n: number) => String(n).padStart(2, "0");
export const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const usOf = (iso: string) => { const [y, m, d] = iso.split("-"); return `${m}/${d}/${y}`; };
/* "11/30/2026" → "2026-11-30", or "" when it is not a real date. */
const isoFromUs = (t: string) => {
  const m = t.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return "";
  const [mo, d, y] = [Number(m[1]), Number(m[2]), Number(m[3])], x = new Date(y, mo - 1, d);
  return x.getFullYear() === y && x.getMonth() === mo - 1 && x.getDate() === d ? isoOf(x) : "";
};

/* The month grid both controls open (Phase 1 .dcal): Sunday first, today ringed, the pick in accent. */
function Calendar({ value, label, onPick, align = "right" }: { value: string; label: string; onPick: (iso: string) => void; align?: "left" | "right" }) {
  const base = value ? new Date(value + "T00:00:00") : new Date();
  const [ym, setYm] = useState({ y: base.getFullYear(), m: base.getMonth() });
  const first = new Date(ym.y, ym.m, 1).getDay(), days = new Date(ym.y, ym.m + 1, 0).getDate();
  const today = isoOf(new Date());
  const step = (d: number) => setYm(({ y, m }) => { const n = new Date(y, m + d, 1); return { y: n.getFullYear(), m: n.getMonth() }; });
  /* Opened near the foot of a scrolling slider, the grid would sit below the fold: bring it into view. */
  const pop = useRef<HTMLDivElement>(null);
  useEffect(() => { pop.current?.scrollIntoView({ block: "nearest" }); }, []);
  return (
    <div ref={pop} className={`${s.pop} ${align === "left" ? s.popL : ""}`} role="dialog" aria-label={`${label} date`}>
      <div className={s.h}>
        <button type="button" className={s.nav} aria-label="Previous month" onClick={() => step(-1)}><Icon name="chevLeft" /></button>
        <span className={`${s.m} t-compact w-strong`}>{MONTHS[ym.m]} {ym.y}</span>
        <button type="button" className={s.nav} aria-label="Next month" onClick={() => step(1)}><Icon name="chevRight" /></button>
      </div>
      <div className={`${s.wd} t-caption`}>{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className={s.grid}>
        {Array.from({ length: first }, (_, i) => <span key={`x${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const iso = `${ym.y}-${pad(ym.m + 1)}-${pad(i + 1)}`;
          return (
            <button key={iso} type="button" className={`${s.d} ${iso === value ? s.on : ""} ${iso === today ? s.today : ""} t-compact`}
              onClick={() => onPick(iso)}>{i + 1}</button>
          );
        })}
      </div>
    </div>
  );
}

function useOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) close(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, close]);
  return ref;
}

/* <DateFilter> — Phase 1's toolbar date filter (admin): a bordered pill "From: 10/01/2026"
   with a clear ×, opening the month grid. For list toolbars only; a FORM uses <DateInput>. */
export function DateFilter({ label: l, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutside(open, () => setOpen(false));
  return (
    <div ref={ref} className={s.f}>
      <button type="button" className={`${s.t} t-compact`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="calendar" /><span>{l}: {value ? usOf(value) : "Any"}</span>
      </button>
      {value && <button type="button" className={s.x} aria-label={`Clear ${l}`} onClick={() => onChange("")}><Icon name="close" /></button>}
      {open && <Calendar value={value} label={l} onPick={(iso) => { onChange(iso); setOpen(false); }} />}
    </div>
  );
}

/* <DateInput> — the date field in a FORM (Maryam 11 Nov 2026). It looks like every other field
   (the one underline, no box): the date is typed on the left as MM/DD/YYYY, with the
   placeholder "e.g. 11/30/2026" showing the format, and the calendar mark at the right end is a
   button that opens the month grid. A typed date that is complete and real is taken at once;
   anything else waits, and leaving the field puts back the last good date. */
export function DateInput({ value, onChange, label = "Date", example = "11/30/2026" }: { value: string; onChange: (v: string) => void; label?: string; example?: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value ? usOf(value) : "");
  useEffect(() => { setText(value ? usOf(value) : ""); }, [value]);
  const ref = useOutside(open, () => setOpen(false));
  return (
    <div ref={ref} className={s.di}>
      <input className={s.diInp} inputMode="numeric" placeholder={`e.g. ${example}`} value={text} aria-label={label}
        onChange={(e) => {
          const t = e.target.value.replace(/[^\d/]/g, "").slice(0, 10);
          setText(t);
          if (!t) onChange("");
          else { const iso = isoFromUs(t); if (iso) onChange(iso); }
        }}
        onBlur={() => setText(value ? usOf(value) : "")} />
      <button type="button" className={s.diBtn} aria-label={`Choose ${label.toLowerCase()} from a calendar`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="calendar" />
      </button>
      {open && <Calendar value={value} label={label} onPick={(iso) => { onChange(iso); setOpen(false); }} />}
    </div>
  );
}
