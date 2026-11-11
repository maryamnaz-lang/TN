"use client";
import { isValidElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import s from "./table.module.css";
import { Icon } from "../Icon";
import { Dropdown } from "./Dropdown";
import { Text } from "../primitives/Text";
import type { IconName } from "@/lib/icons";

/* Every column is the same width and every cell is left-aligned, on every table (Maryam
   19 Oct 2026: one format for all tables, never opt-in). */
/* `sort` is optional: without it a column sorts by the text its cell shows. `sort: false`
   turns sorting off for that column. */
export type Col<R> = { key: string; label: string; cell: (r: R) => ReactNode; sort?: ((r: R) => string | number) | false };

/* COLUMN SORTING, EVERY TABLE (Maryam 4 Nov 2026). Click a header: ascending, again:
   descending, a third time: back to the table's own order. The sort value is the text
   the cell shows, so no table has to declare anything: a person cell sorts by name,
   status by its word, dates (MM/DD/YYYY) by date, money and counts by number. */
function nodeText(n: ReactNode): string {
  if (n == null || typeof n === "boolean") return "";
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(nodeText).join(" ");
  if (isValidElement(n)) {
    const p = n.props as Record<string, unknown>;
    if (p.children != null) return nodeText(p.children as ReactNode);
    for (const k of ["name", "label", "value", "title"]) if (typeof p[k] === "string" || typeof p[k] === "number") return String(p[k]);
  }
  return "";
}
function sortKey(v: string | number): string | number {
  if (typeof v === "number") return v;
  const s = v.trim();
  const d = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
  if (d) return Number(d[3] + d[1] + d[2]);
  const n = s.replace(/[$,%\s]/g, "");
  if (/^-?\d+(\.\d+)?$/.test(n)) return Number(n);
  return s === "—" || s === "-" ? "" : s.toLowerCase();
}
const COLLATE = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
function cmp(a: string | number, b: string | number) {
  const ea = a === "", eb = b === "";
  if (ea || eb) return ea === eb ? 0 : ea ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return COLLATE.compare(String(a), String(b));
}
export type RowAction = { icon: IconName; label: string; onClick: () => void; danger?: boolean };

/* <Table> — one page at a time (5 rows by default, 10 on the Super Admin portal —
   Maryam 3 Nov 2026; 5/10/25/50). A row with
   `href` opens it; `actions` adds the one kebab per row. */
export function Table<R>({
  cols, rows, rowKey, href, actions, pageSize, selected, onSelect, loading,
}: {
  cols: Col<R>[]; rows: R[]; rowKey: (r: R) => string;
  href?: (r: R) => string | undefined; actions?: (r: R) => RowAction[]; pageSize?: number;
  /* Row selection (Phase 1 admin tables with a kebab): a box per row and a
     select-all that takes the whole list, every page. */
  selected?: string[]; onSelect?: (ids: string[]) => void;
  /* While true the header stays and the body is a shimmering skeleton of
     `pageSize` rows; pagination waits for the data. */
  loading?: boolean;
}) {
  const router = useRouter();
  const admin = usePathname()?.startsWith("/admin") ?? false;
  const [size, setSize] = useState(pageSize ?? (admin ? 10 : 5));
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const sortCol = sort && cols.find((c) => c.key === sort.key);
  /* Blanks ("—") always sink to the bottom, whichever way the column runs. */
  const ordered = sortCol && sortCol.sort !== false ? rows.map((r) => ({ r, k: sortKey(sortCol.sort ? sortCol.sort(r) : nodeText(sortCol.cell(r))) }))
    .sort((a, b) => (a.k === "" || b.k === "" ? cmp(a.k, b.k) : cmp(a.k, b.k) * sort!.dir)).map((x) => x.r) : rows;
  const flip = (k: string) => { setSort((x) => (!x || x.key !== k ? { key: k, dir: 1 } : x.dir === 1 ? { key: k, dir: -1 } : null)); setPage(1); };
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const cur = Math.min(page, pages);
  const slice = ordered.slice((cur - 1) * size, cur * size);

  return (
    <div>
      <div className={s.wrap}>
        <table className={s.tbl} style={{ "--tpl": `${onSelect ? "max-content " : ""}repeat(${cols.length}, auto)${actions ? " max-content" : ""}` } as CSSProperties}>
          <thead>
            <tr>
              {onSelect && (
                <th className={s.sel}>
                  <Check on={rows.length > 0 && rows.every((r) => selected?.includes(rowKey(r)))}
                    label="Select all" onClick={() => onSelect(rows.every((r) => selected?.includes(rowKey(r))) ? [] : rows.map(rowKey))} />
                </th>
              )}
              {cols.map((c) => {
                if (c.sort === false) return <th key={c.key} className="t-compact w-strong">{c.label}</th>;
                const on = sort?.key === c.key ? sort.dir : 0;
                return (
                  <th key={c.key} className="t-compact w-strong" aria-sort={on === 1 ? "ascending" : on === -1 ? "descending" : "none"}>
                    <button type="button" className={`${s.sortB} ${on ? s.sortOn : ""}`} onClick={() => flip(c.key)}>
                      {c.label}<SortMark dir={on} />
                    </button>
                  </th>
                );
              })}
              {actions && <th className={`${s.act} t-compact w-strong`}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? <SkeletonRows n={size} cols={cols.length} sel={!!onSelect} act={!!actions} /> : slice.map((r) => {
              const to = href?.(r);
              return (
                <tr key={rowKey(r)} className={to ? s.clk : undefined} onClick={to ? () => router.push(to) : undefined}>
                  {onSelect && (
                    <td className={s.sel} onClick={(e) => e.stopPropagation()}>
                      <Check on={!!selected?.includes(rowKey(r))} label="Select row"
                        onClick={() => { const k = rowKey(r); onSelect(selected?.includes(k) ? selected.filter((x) => x !== k) : [...(selected ?? []), k]); }} />
                    </td>
                  )}
                  {cols.map((c, i) => (
                    <td key={c.key} className={`t-compact ${i === 0 ? "w-strong" : ""}`}>{c.cell(r)}</td>
                  ))}
                  {actions && <td className={s.act} onClick={(e) => e.stopPropagation()}><RowMenu items={actions(r)} /></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!loading && rows.length > 5 && (
        <div className={s.pgn}>
          <div className={`${s.pgnSize} t-body`}>
            Rows per page
            <Dropdown value={String(size)} onChange={(v) => { setSize(Number(v)); setPage(1); }}
              options={[5, 10, 25, 50].map((n) => ({ value: String(n), label: String(n) }))} />
          </div>
          <div className={`${s.pgnInfo} t-body`}>{(cur - 1) * size + 1}–{Math.min(cur * size, rows.length)} of {rows.length}</div>
          <div className={s.pgnNav}>
            <button className={s.pgBtn} disabled={cur === 1} onClick={() => setPage(cur - 1)} aria-label="Previous page"><Icon name="chevLeft" /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={`${s.pgBtn} ${n === cur ? s.on : ""}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className={s.pgBtn} disabled={cur === pages} onClick={() => setPage(cur + 1)} aria-label="Next page"><Icon name="chevRight" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Skeleton rows (Maryam 3 Nov 2026, the YouTube loading preview): every cell is a
   very light grey block with a shimmer sweeping through it, laid out as the real row
   (a round face + two lines in the first column, one bar in the rest) so nothing
   jumps when the data lands. Widths vary per column so it does not read as a grid. */
const SK_W = [72, 96, 64, 84, 56, 90];
function SkeletonRows({ n, cols, sel, act }: { n: number; cols: number; sel: boolean; act: boolean }) {
  return (
    <>
      {Array.from({ length: n }, (_, r) => (
        <tr key={r} aria-hidden="true">
          {sel && <td className={s.sel}><span className={`${s.sk} ${s.skBox}`} /></td>}
          {Array.from({ length: cols }, (_, c) => (
            <td key={c}>
              {c === 0 ? (
                <span className={s.pcell}>
                  <span className={`${s.sk} ${s.skFace}`} />
                  <span className={s.skLines}><span className={s.sk} style={{ width: 120 }} /><span className={s.sk} style={{ width: 150, height: 10 }} /></span>
                </span>
              ) : <span className={s.sk} style={{ width: SK_W[(c + r) % SK_W.length] }} />}
            </td>
          ))}
          {act && <td className={s.act}><span className={`${s.sk} ${s.skBox}`} /></td>}
        </tr>
      ))}
    </>
  );
}

/* The sort mark: an up and a down chevron stacked, always shown, light grey at rest. The
   sorted column darkens the half that names its direction (Maryam 4 Nov 2026, replacing a
   single chevron that only appeared on hover). */
function SortMark({ dir }: { dir: 0 | 1 | -1 }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={s.sortMk}>
      <path d="M8 9.5L12 5.5L16 9.5" className={dir === 1 ? s.sortMkOn : undefined} />
      <path d="M8 14.5L12 18.5L16 14.5" className={dir === -1 ? s.sortMkOn : undefined} />
    </svg>
  );
}

/* A row-select box: a quiet light-grey square, the accent with a white
   tick when on (Phase 1 .tbl-cb). A button, never a native input. */
function Check({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} aria-label={label} className={`${s.cb} ${on ? s.cbOn : ""}`} onClick={onClick}>
      {on && <Icon name="check" />}
    </button>
  );
}

/* The bulk action bar that stands in for nothing else on the admin: shown
   while rows are selected, centred at the foot of the frame. */
export function BulkBar({ count, actions, onClear }: { count: number; actions: { icon: IconName; label: string; onClick: () => void }[]; onClear: () => void }) {
  /* Portalled into the shell's dock layer: bottom-centre of the content column, 20px up. */
  const [host, setHost] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => { setHost(document.getElementById("p0-dock")); }, []);
  if (!count) return null;
  const bar = (
    <div className={s.bulk} role="toolbar" aria-label="Selected rows">
      <Text role="body" as="span" ink="secondary"><b>{count}</b> selected</Text>
      <span className={s.bulkSep} />
      {actions.map((a) => (
        <button key={a.label} type="button" className={`${s.bulkB} t-body`} onClick={a.onClick}><Icon name={a.icon} />{a.label}</button>
      ))}
      <button type="button" className={s.bulkX} aria-label="Clear selection" onClick={onClear}><Icon name="close" /></button>
    </div>
  );
  return host ? createPortal(bar, host) : null;
}

/* The kebab menu. The table wrapper scrolls sideways, which clips anything
   that overflows it, so the open list is portalled to <body> and placed
   against the kebab: below it, or above when there is no room below.
   Scrolling or resizing closes it. */
export function RowMenu({ items }: { items: RowAction[] }) {
  const [pos, setPos] = useState<{ top: number; right: number; up: boolean } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pos) return;
    const close = (e: Event) => {
      if (e.type === "mousedown" && (list.current?.contains(e.target as Node) || btn.current?.contains(e.target as Node))) return;
      setPos(null);
    };
    document.addEventListener("mousedown", close);
    window.addEventListener("resize", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("resize", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [pos]);
  const toggle = () => {
    if (pos) return setPos(null);
    const r = btn.current!.getBoundingClientRect();
    const up = window.innerHeight - r.bottom < 220;
    setPos({ top: up ? r.top : r.bottom, right: window.innerWidth - r.right, up });
  };
  return (
    <div className={s.rm}>
      <button ref={btn} className={s.rmT} aria-label="Actions" aria-expanded={!!pos} onClick={toggle}><Icon name="overflow" /></button>
      {pos && createPortal(
        <div ref={list} className={`${s.rmList} ${pos.up ? s.up : ""}`} role="menu"
          style={{ "--rm-top": `${pos.top}px`, "--rm-right": `${pos.right}px` } as CSSProperties}>
          {items.map((a) => (
            <button key={a.label} role="menuitem" className={`${s.rmI} ${a.danger ? s.danger : ""} t-body`}
              onClick={() => { setPos(null); a.onClick(); }}>
              <Icon name={a.icon} />{a.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

/* A person cell: round face + name (+ optional sub-line). */
export function PersonCell({ name, img, sub }: { name: string; img: string; sub?: string }) {
  return (
    <span className={s.pcell}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" />
      <span className={s.pcellB}>
        <span>{name}</span>
        {sub && <Text role="caption" as="span">{sub}</Text>}
      </span>
    </span>
  );
}

/* Status is coloured text, never a chip. */
/* <StatusChip> — Phase 1 .tag.sm: the state word in its hue inside a round
   hairline pill (a service's state, "This device"). Lists use <Status>. */
export function StatusChip({ tone, children }: { tone: "green" | "warn" | "red" | "plain"; children: ReactNode }) {
  return <span className={`${s.chip} ${s["st-" + tone]}`}>{children}</span>;
}

export function Status({ tone, children }: { tone: "green" | "warn" | "red" | "plain"; children: ReactNode }) {
  return <span className={s[`st-${tone}`]}>{children}</span>;
}
