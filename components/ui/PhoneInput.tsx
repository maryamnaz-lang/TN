"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../Icon";
import s from "./phone.module.css";

/* <PhoneInput> — the phone field (Maryam 11 Nov 2026, off the UAT design, in our UI language).
   One underlined control, like every other field: a country picker on the LEFT (the flag, the
   dial code and a chevron) opens a searchable list of countries, and the number is typed to
   its right with "201 555 0123" as the placeholder. The United States (+1) is picked by
   default. The value handed back is one string, "+1 201 555 0123", or "" while no number is
   typed, so a required check needs nothing new. */
const DIAL: [string, string][] = [
  ["1", "US"], ["1", "CA"], ["7", "RU"], ["20", "EG"], ["27", "ZA"], ["30", "GR"], ["31", "NL"], ["32", "BE"], ["33", "FR"], ["34", "ES"],
  ["39", "IT"], ["41", "CH"], ["43", "AT"], ["44", "GB"], ["45", "DK"], ["46", "SE"], ["47", "NO"], ["48", "PL"], ["49", "DE"],
  ["52", "MX"], ["54", "AR"], ["55", "BR"], ["56", "CL"], ["57", "CO"], ["60", "MY"], ["61", "AU"], ["62", "ID"], ["63", "PH"],
  ["64", "NZ"], ["65", "SG"], ["66", "TH"], ["81", "JP"], ["82", "KR"], ["84", "VN"], ["86", "CN"], ["90", "TR"], ["91", "IN"],
  ["92", "PK"], ["94", "LK"], ["234", "NG"], ["254", "KE"], ["351", "PT"], ["353", "IE"], ["852", "HK"], ["880", "BD"],
  ["961", "LB"], ["962", "JO"], ["965", "KW"], ["966", "SA"], ["968", "OM"], ["971", "AE"], ["972", "IL"], ["973", "BH"],
  ["974", "QA"], ["977", "NP"],
];
const flagOf = (iso: string) => [...iso].map((ch) => String.fromCodePoint(0x1f1a5 + ch.charCodeAt(0))).join("");
const nameOf = (() => {
  let dn: Intl.DisplayNames | null = null;
  try { dn = new Intl.DisplayNames(["en"], { type: "region" }); } catch { dn = null; }
  return (iso: string) => dn?.of(iso) ?? iso;
})();
type Country = { iso: string; dial: string; name: string; flag: string };
const COUNTRIES: Country[] = DIAL.map(([dial, iso]) => ({ iso, dial, name: nameOf(iso), flag: flagOf(iso) }))
  .sort((a, b) => (a.iso === "US" ? -1 : b.iso === "US" ? 1 : a.name.localeCompare(b.name)));

/* "+44 20 7946 0000" → the United Kingdom and "20 7946 0000". The longest code wins; +1 reads as the US. */
function parse(v: string): { c: Country; rest: string } {
  const m = String(v || "").trim().match(/^\+\s*(\d+)\s*(.*)$/);
  if (m) {
    const hit = COUNTRIES.filter((c) => m[1].startsWith(c.dial)).sort((a, b) => b.dial.length - a.dial.length || (a.iso === "US" ? -1 : 1))[0];
    if (hit) return { c: hit, rest: (m[1].slice(hit.dial.length) + " " + m[2]).trim() };
  }
  return { c: COUNTRIES[0], rest: String(v || "").replace(/^\+/, "").trim() };
}
/* The flag a typed number belongs to, for other readers ("" when there is no code). */
export function dialFlag(v: string) { return /^\s*\+/.test(String(v || "")) ? parse(v).c.flag : ""; }

export function PhoneInput({ value, onChange, placeholder = "201 555 0123", label = "Phone number" }: {
  value: string; onChange: (e: { target: { value: string } }) => void; placeholder?: string; label?: string;
}) {
  const start = useMemo(() => parse(value), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [c, setC] = useState<Country>(start.c);
  const [num, setNum] = useState(start.rest);
  const [open, setOpen] = useState(false), [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    /* Opened near the foot of a scrolling slider, the list would sit below the fold: bring it into view. */
    ref.current?.querySelector(`.${s.menu}`)?.scrollIntoView({ block: "nearest" });
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const emit = (cc: Country, n: string) => onChange({ target: { value: n.trim() ? `+${cc.dial} ${n.trim()}` : "" } });
  const list = COUNTRIES.filter((x) => !q || x.name.toLowerCase().includes(q.toLowerCase()) || `+${x.dial}`.includes(q.replace(/\s/g, "")));
  return (
    <div ref={ref} className={s.ph}>
      <button type="button" className={`${s.cc} t-compact`} aria-haspopup="listbox" aria-expanded={open} aria-label={`Country code, ${c.name} +${c.dial}`}
        onClick={() => { setOpen((o) => !o); setQ(""); }}>
        <span className={s.flag} aria-hidden>{c.flag}</span>
        <span>+{c.dial}</span>
        <Icon name="chevDown" />
      </button>
      <input className={s.num} type="tel" inputMode="tel" aria-label={label} placeholder={placeholder} value={num}
        onChange={(e) => { const n = e.target.value.replace(/[^\d\s()-]/g, ""); setNum(n); emit(c, n); }} />
      {open && (
        <div className={s.menu} role="listbox" aria-label="Countries">
          <input className={`${s.q} t-compact`} autoFocus placeholder="Search country or code" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className={s.opts}>
            {list.map((x) => (
              <button key={x.iso} type="button" role="option" aria-selected={x.iso === c.iso}
                className={`${s.opt} ${x.iso === c.iso ? s.on : ""} t-compact`}
                onClick={() => { setC(x); setOpen(false); emit(x, num); }}>
                <span className={s.flag} aria-hidden>{x.flag}</span>
                <span className={s.name}>{x.name}</span>
                <span className={`${s.dial} t-label`}>+{x.dial}</span>
              </button>
            ))}
            {!list.length && <span className={`${s.none} t-label`}>No country matches.</span>}
          </div>
        </div>
      )}
    </div>
  );
}
