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
/* `min` (ISO) greys out and disables every day before it, and stops the month arrow going back
   past it, so a date that is not allowed cannot be picked (Maryam 11 Nov 2026). */
function Calendar({ value, label, onPick, align = "right", min }: { value: string; label: string; onPick: (iso: string) => void; align?: "left" | "right"; min?: string }) {
  const base = value ? new Date(value + "T00:00:00") : min ? new Date(min + "T00:00:00") : new Date();
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
        <button type="button" className={s.nav} aria-label="Previous month" disabled={!!min && `${ym.y}-${pad(ym.m + 1)}` <= min.slice(0, 7)} onClick={() => step(-1)}><Icon name="chevLeft" /></button>
        <span className={`${s.m} t-compact w-strong`}>{MONTHS[ym.m]} {ym.y}</span>
        <button type="button" className={s.nav} aria-label="Next month" onClick={() => step(1)}><Icon name="chevRight" /></button>
      </div>
      <div className={`${s.wd} t-caption`}>{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className={s.grid}>
        {Array.from({ length: first }, (_, i) => <span key={`x${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const iso = `${ym.y}-${pad(ym.m + 1)}-${pad(i + 1)}`;
          const off = !!min && iso < min;
          return (
            <button key={iso} type="button" disabled={off} aria-disabled={off} className={`${s.d} ${iso === value ? s.on : ""} ${iso === today ? s.today : ""} ${off ? s.off : ""} t-compact`}
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
export function DateInput({ value, onChange, label = "Date", example = "11/30/2026", min }: { value: string; onChange: (v: string) => void; label?: string; example?: string; min?: string }) {
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
      {open && <Calendar value={value} label={label} min={min} onPick={(iso) => { onChange(iso); setOpen(false); }} />}
    </div>
  );
}

/* <MonthInput> — a month-and-year (or year-only) field for a CV entry (24 Nov 2026: "calendar fields
   should be displayed for experience period selections"). A day grid is the wrong grain for "Jan 2024",
   so this opens a 12-cell grid: the twelve months of the shown year, or twelve years at a time in
   `year` mode. Values are "YYYY-MM" (month) or "YYYY" (year), "" for none. `min` and `max` (same
   format) grey out what cannot be picked; `max` defaults to this month, so a past date cannot be
   in the future unless the field says so (an expected graduation passes `future`). */
const SHORT = MONTHS.map((m) => m.slice(0, 3));
export const ymLabel = (v: string) => {
  if (!v) return "";
  const [y, m] = v.split("-");
  return m ? `${SHORT[Number(m) - 1]} ${y}` : y;
};
export function MonthInput({ value, onChange, label, mode = "month", min, future, placeholder, error }: {
  value: string; onChange: (v: string) => void; label: string; mode?: "month" | "year";
  min?: string; future?: boolean; placeholder?: string; error?: boolean;
}) {
  const now = new Date();
  const max = future ? undefined : mode === "year" ? String(now.getFullYear()) : `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const [open, setOpen] = useState(false);
  const seed = Number((value || max || String(now.getFullYear())).slice(0, 4));
  /* month mode: the year shown; year mode: the first year of the page of twelve. */
  const [at, setAt] = useState(mode === "year" ? seed - 11 : seed);
  useEffect(() => { if (open) setAt(mode === "year" ? seed - 11 : seed); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const ref = useOutside(open, () => setOpen(false));
  const minCut = min ? (mode === "year" ? min.slice(0, 4) : min) : "";
  const cells = Array.from({ length: 12 }, (_, i) => mode === "year"
    ? { v: String(at + i), t: String(at + i) }
    : { v: `${at}-${pad(i + 1)}`, t: SHORT[i] });
  const off = (v: string) => (!!minCut && v < minCut) || (!!max && v > max);
  const step = mode === "year" ? 12 : 1;
  const head = mode === "year" ? `${at} – ${at + 11}` : String(at);
  return (
    <div ref={ref} className={s.di}>
      <button type="button" className={`${s.diInp} ${s.miT} ${error ? s.miErr : ""} ${value ? "" : s.miPh}`} aria-haspopup="dialog" aria-expanded={open}
        aria-label={`${label}${value ? `: ${ymLabel(value)}` : ""}`} onClick={() => setOpen((o) => !o)}>
        {value ? ymLabel(value) : placeholder ?? (mode === "year" ? "Select year" : "Select month")}
      </button>
      <span className={s.diBtn} aria-hidden="true"><Icon name="calendar" /></span>
      {open && (
        <div className={`${s.pop} ${s.popL}`} role="dialog" aria-label={`${label} picker`}>
          <div className={s.h}>
            <button type="button" className={s.nav} aria-label={mode === "year" ? "Earlier years" : "Previous year"}
              disabled={!!minCut && String(at - 1) < minCut.slice(0, 4)} onClick={() => setAt((a) => a - step)}><Icon name="chevLeft" /></button>
            <span className={`${s.m} t-compact w-strong`}>{head}</span>
            <button type="button" className={s.nav} aria-label={mode === "year" ? "Later years" : "Next year"}
              disabled={!!max && String(at + (mode === "year" ? 12 : 1)) > max.slice(0, 4)} onClick={() => setAt((a) => a + step)}><Icon name="chevRight" /></button>
          </div>
          <div className={s.mGrid}>
            {cells.map((c) => (
              <button key={c.v} type="button" disabled={off(c.v)} aria-disabled={off(c.v)} aria-pressed={c.v === value}
                className={`${s.mo} ${c.v === value ? s.on : ""} ${off(c.v) ? s.off : ""} t-compact`}
                onClick={() => { onChange(c.v); setOpen(false); }}>{c.t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
