import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import s from "./field.module.css";
import { Text } from "../primitives/Text";
import { Icon } from "../Icon";

/* <Field> — a label (12.5, strong) 8px over its control. */
export function Field({ label, required, help, error, children, group }: {
  label: string; required?: boolean; help?: ReactNode; error?: ReactNode; children: ReactNode;
  /* A field holding several controls (a chip picker, an option list) is a
     plain group, not a <label> — a label forwards a click on its words to
     its first control. */
  group?: boolean;
}) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className={s.f} role={group ? "group" : undefined}>
      <Text role="label" as="span">{label}{required && <span className={s.req}>*</span>}</Text>
      {children}
      {error ? <Text role="caption" as="span" className={s.err}>{error}</Text>
        : help && <Text role="caption" as="span" className={s.help}>{help}</Text>}
    </Tag>
  );
}

export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={s.inp} />;
export const TextArea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={s.inp} />;

/* <PhoneInput> — a phone field that shows the flag of the country its dial code belongs
   to at the right end, once the code is typed: "+1" shows the US flag (Maryam 3 Nov 2026).
   The longest matching code wins (+971 over +97x). +1 is shared by the US and Canada and
   reads as the US. Unknown or no code: no flag. */
const DIAL: [string, string][] = [
  ["1", "US"], ["7", "RU"], ["20", "EG"], ["27", "ZA"], ["30", "GR"], ["31", "NL"], ["32", "BE"], ["33", "FR"], ["34", "ES"],
  ["39", "IT"], ["41", "CH"], ["43", "AT"], ["44", "GB"], ["45", "DK"], ["46", "SE"], ["47", "NO"], ["48", "PL"], ["49", "DE"],
  ["52", "MX"], ["54", "AR"], ["55", "BR"], ["56", "CL"], ["57", "CO"], ["60", "MY"], ["61", "AU"], ["62", "ID"], ["63", "PH"],
  ["64", "NZ"], ["65", "SG"], ["66", "TH"], ["81", "JP"], ["82", "KR"], ["84", "VN"], ["86", "CN"], ["90", "TR"], ["91", "IN"],
  ["92", "PK"], ["94", "LK"], ["234", "NG"], ["254", "KE"], ["351", "PT"], ["353", "IE"], ["852", "HK"], ["880", "BD"],
  ["961", "LB"], ["962", "JO"], ["965", "KW"], ["966", "SA"], ["968", "OM"], ["971", "AE"], ["972", "IL"], ["973", "BH"],
  ["974", "QA"], ["977", "NP"],
];
export function dialFlag(v: string) {
  const m = String(v || "").trim().match(/^\+\s*([\d\s()-]+)/);
  if (!m) return "";
  const d = m[1].replace(/\D/g, "");
  const hit = DIAL.filter(([c]) => d.startsWith(c)).sort((a, b) => b[0].length - a[0].length)[0];
  return hit ? [...hit[1]].map((ch) => String.fromCodePoint(0x1f1a5 + ch.charCodeAt(0))).join("") : "";
}
export function PhoneInput(p: InputHTMLAttributes<HTMLInputElement>) {
  const flag = dialFlag(String(p.value ?? ""));
  return (
    <span className={s.phone}>
      <input {...p} type="tel" inputMode="tel" className={s.inp} />
      {flag && <span className={s.flag} aria-hidden="true">{flag}</span>}
    </span>
  );
}

/* <Form> stacks fields 32 apart; <FormRow> puts two side by side from 600px. */
export const Form = ({ children }: { children: ReactNode }) => <div className={s.form}>{children}</div>;
export const FormRow = ({ children }: { children: ReactNode }) => <div className={s.row2}>{children}</div>;

/* <Search> — the toolbar search, with a clear (X) while it holds text. */
export function Search({ value, onChange, placeholder = "Search" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className={s.srch}>
      <Icon name="search" />
      <input className={s.inp} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {value && (
        <button type="button" className={s.srchX} aria-label="Clear search" onClick={() => onChange("")}>
          <Icon name="close" />
        </button>
      )}
    </div>
  );
}

/* <Toolbar> — a list page's toolbar: `search` on the left, `filters` on the right. */
export function Toolbar({ search, filters }: { search?: ReactNode; filters?: ReactNode }) {
  return (
    <div className={s.tools}>
      {search}
      {filters && <div className={s.filters}>{filters}</div>}
    </div>
  );
}
