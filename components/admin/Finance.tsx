"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Table, PersonCell, Status, RowMenu, type RowAction } from "../ui/Table";
import { Tabs } from "../ui/Tabs";
import { KV } from "../ui/KV";
import { Button } from "../ui/Button";
import { Dropdown, MultiDropdown } from "../ui/Dropdown";
import { Search, Toolbar, Field, Input, TextArea } from "../ui/Field";
import { DateFilter, isoOf } from "../ui/DateFilter";
import { Sheet } from "../ui/Sheet";
import { Slider } from "../ui/Slider";
import { Confirm } from "../ui/Confirm";
import { Icon } from "../Icon";
import { commit, toast, useStore } from "@/lib/store";
import { RAW, TXNS, PAYOUTS, FEE_LOG, DISCOUNTS, SETTLEMENTS, face, money, dpFmt, type Tone } from "@/data/admin";
import { FUNDER, KIND_OPTS, SCOPE_OPTS, discStatus, discUsed, discValue, valueLabel, appliesLabel, tracksLabel, coursesLabel, isPlatform, codeLabel } from "@/data/discounts";
import { FEE_TRACKS } from "@/data/fees";
import { COURSE_LIST } from "@/data/level";
import s from "./admin.module.css";
import f from "./finance.module.css";

/* ============================================================
   FINANCE & SETTLEMENT — Phase 1 Epic 9: Transactions (9.1) + one
   transaction (9.2), Payouts (9.3), Fee Settings (9.4), Discount Codes
   (9.5/9.6) and Reconciliation (9.8) + one batch.
   CUT (rebooking credit): its tab, its rows and its Active / Used /
   Expired statuses on the register.
   ============================================================ */
const TYPE: Record<string, string> = RAW.TX_TYPE_LABEL;
const St = ({ m, k }: { m: Record<string, [string, string]>; k: string }) => { const x = m[k] || ["", k]; return <Status tone={(["green", "warn", "red"].includes(x[0]) ? x[0] : "plain") as Tone}>{x[1]}</Status>; };
const TXS: any[] = TXNS.filter((t) => t.type !== "rbcredit");
const inRange = (iso: string, from: string, to: string) => !/^\d{4}-\d{2}-\d{2}$/.test(iso || "") || ((!from || iso >= from) && (!to || iso <= to));
const twoLine = (a: ReactNode, b?: ReactNode) => <span className={s.two}><span>{a}</span>{b ? <Text role="caption" as="span">{b}</Text> : null}</span>;
const exportToast = (what: string) => toast(`A download link for the ${what} export will reach your notifications, valid 7 days.`);
const ExportBtn = ({ what }: { what: string }) => <Button kind="ghost" size="sm" icon="download" onClick={() => exportToast(what)}>Export</Button>;
const todayISO = () => isoOf(new Date());

/* The method cell: the brand logo alone, never the card number. */
const METHOD: Record<string, [string, string]> = {
  visa: ["/images/pay/visa-1.jpg", f.mkVisa], mastercard: ["/images/pay/mastercard-logo-0.webp", f.mkMc],
  stripe: ["/images/pay/m_logo.png", f.mkStripe], amex: ["/images/pay/m_logo.png", f.mkStripe], bank: ["/images/pay/m_logo.png", f.mkStripe], ach: ["/images/pay/m_logo.png", f.mkStripe],
};
const methodBrand = (m: string) => (!m || m === "—" ? "" : m.trim().split(/[\s•]/)[0]);
function MethodMark({ method }: { method: string }) {
  const b = methodBrand(method);
  if (!b) return <Text role="caption" as="span">—</Text>;
  const img = METHOD[b.toLowerCase()];
  // eslint-disable-next-line @next/next/no-img-element
  return img ? <span className={f.mk} title={b}><img src={img[0]} alt={b} className={img[1]} /></span> : <Text role="caption" as="span">{b}</Text>;
}
const PartyCell = ({ t }: { t: any }) => t.party === "Platform"
  ? <PersonCell name={t.who} img="/images/logos/auth-mark.webp" sub="Platform" />
  : <PersonCell name={t.who} img={face(t.who)} sub={t.party} />;

/* ---------------- 9.1 Transactions ---------------- */
export function AdminTransactions() {
  useStore();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all"), [st, setSt] = useState("all"), [party, setParty] = useState("all");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const ql = q.toLowerCase();
  const rows = TXS.filter((t) => type === "all" || t.type === type)
    .filter((t) => st === "all" || t.status === st)
    .filter((t) => party === "all" || (party === "candidate" ? t.party === "Candidate" : party === "agent" ? t.party === "Talent agent" : t.party === "Platform"))
    .filter((t) => inRange(t.date, from, to))
    .filter((t) => !q || [t.ref, t.stripeRef, t.who, t.email, t.desc, methodBrand(t.method)].some((x) => String(x || "").toLowerCase().includes(ql)));
  return (
    <Page>
      <PageHeader title="Transactions" desc="Every movement of money, each traced to what caused it." actions={<ExportBtn what="Transactions" />} />
      <Section kind="tabs">
        <Tabs value={type} onChange={setType} items={[["all", "All"], ["course", "Course fees"], ["interview", "Interview fees"], ["payout", "Payouts"]].map(([k, label]) => ({ key: k, label, count: TXS.filter((t) => k === "all" || t.type === k).length }))} />
      </Section>
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by reference, Stripe ref, person or email" />}
          filters={<>
            <Dropdown label="Status" value={st} onChange={setSt} options={[["all", "All"], ["succeeded", "Succeeded"], ["pending", "Pending"], ["failed", "Failed"]].map(([value, label]) => ({ value, label }))} />
            <Dropdown label="Party type" value={party} onChange={setParty} options={[["all", "All"], ["candidate", "Candidate"], ["agent", "Talent Agent"], ["platform", "Platform"]].map(([value, label]) => ({ value, label }))} />
            <DateFilter label="From" value={from} onChange={setFrom} />
            <DateFilter label="To" value={to} onChange={setTo} />
          </>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(t) => t.id} href={(t) => `/admin/finance/transactions/${t.id}/`} cols={[
            { key: "r", label: "Reference", cell: (t) => twoLine(t.ref, t.stripeRef && t.stripeRef !== "—" ? t.stripeRef : "") },
            { key: "d", label: "Date", cell: (t) => twoLine(dpFmt(t.date), t.time) },
            { key: "t", label: "Type", cell: (t) => TYPE[t.type] || t.type },
            { key: "p", label: "Party", cell: (t) => <PartyCell t={t} /> },
            { key: "a", label: "Amount", cell: (t) => (t.dir === "out" ? "−" : "") + (t.amt ? money(t.amt) : "—") },
            { key: "s", label: "Split", cell: (t) => (t.sp ? `${money(t.sp.share)} agent · ${money(t.sp.com)} commission` : <Text role="caption" as="span">—</Text>) },
            { key: "m", label: "Method", cell: (t) => <MethodMark method={t.method} /> },
            { key: "st", label: "Status", cell: (t) => <St m={RAW.TX_STATUS_META} k={t.status} /> },
          ]} />
        ) : <Empty icon="wallet" title="No transactions match" />}
      </Section>
    </Page>
  );
}
const Empty = ({ icon, title, desc = "Nothing in this filter yet." }: { icon: "wallet" | "receipt" | "ticket" | "chart"; title: string; desc?: string }) => (
  <div className={s.empty}><Icon name={icon} /><Text role="h4" as="span">{title}</Text><Text role="desc" as="span">{desc}</Text></div>
);

/* ---------------- 9.2 One transaction ---------------- */
export function AdminTransaction({ id }: { id: string }) {
  useStore();
  const t = TXNS.find((x) => x.id === id);
  if (!t) return null;
  const disc = DISCOUNTS.flatMap((d) => (d.red || []).filter((r: any) => r.txId === t.id).map((r: any) => ({ d, r })))[0];
  const settled = t.status === "succeeded" ? `${dpFmt(t.date)}${t.time ? " · " + t.time : ""}` : t.status === "pending" ? "Not settled yet" : "—";
  return (
    <Page>
      <PageHeader back="/admin/finance/transactions/" title={t.ref} desc={`${TYPE[t.type] || t.type} · ${t.desc || t.kind}`} />
      <Section>
        <SectionHeader title="Transaction" />
        <KV rows={[
          ["Amount", `${money(t.amt)} USD`], ["Status", <St key="s" m={RAW.TX_STATUS_META} k={t.status} />],
          ["Created", `${dpFmt(t.date)}${t.time ? " · " + t.time : ""}`], ["Settled", settled],
          ...(t.method && t.method !== "—" ? [["Method", t.method] as [string, string]] : []),
          ["Stripe reference", t.stripeRef || "—"],
          ...(t.funder ? [["Funder", t.funder] as [string, string]] : []),
          ["Party", `${t.who} · ${t.party}`],
          ...(t.email ? [["Email", t.email] as [string, string]] : []),
          ...(t.status === "failed" ? [["Provider reason", "The card was declined by the issuer."] as [string, string]] : []),
        ]} />
      </Section>
      {t.sp && (
        <Section>
          <SectionHeader title="Split" />
          {/* The stored split already reads the 26 Oct 2026 rule (data/fees.ts): the candidate's
              price, the agent's fee paid in full, and the commission as a share of the price. */}
          <KV rows={[["Candidate paid", money(t.sp.fee)], ["Agent fee (paid in full)", money(t.sp.share)], [`Commission (${t.sp.pct}%)`, money(t.sp.com)], ["Net", money(t.type === "payout" ? t.sp.share : t.sp.fee)]]} />
          <Text role="caption" as="p">Read as stored — the share and commission add back to the gross exactly. The split is unchanged by who funded the interview.</Text>
        </Section>
      )}
      {disc && (
        <Section>
          <SectionHeader title="Discount" />
          {/* A code used on this purchase (Maryam 26 Oct 2026): the gap is funded by Next in
              Leadership, so the agent's fee and TalentNext's share above are untouched. */}
          <KV rows={[
            ["Code", <Link key="c" className={f.link} href={`/admin/finance/discounts/${disc.d.id}/`}>{codeLabel(disc.d)}</Link>],
            ["Price before discount", money(disc.r.original)], ["Discount", `−${money(disc.r.discounted)}`],
            ["Candidate paid", money(disc.r.paid)], ["Funded by", FUNDER],
          ]} />
        </Section>
      )}
      <Section>
        <SectionHeader title="Cause" />
        <KV rows={[["What caused this", t.cause ? <Link key="c" className={f.link} href={causeHref(t.cause.go)}>{t.cause.l}</Link> : "—"]]} />
      </Section>
    </Page>
  );
}
const causeHref = (go: string) => go.startsWith("users/users") ? `/admin/users/all/${go.includes("?") ? go.slice(go.indexOf("?")) : ""}`
  : go.startsWith("market/bookings") ? "/admin/interviews/all/" : go.startsWith("finance/payouts") ? "/admin/finance/payouts/" : "/admin/finance/transactions/";

/* ---------------- 9.3 Payouts ---------------- */
/* Read-only: payouts are released outside the platform, through QuickBooks / FAS
   (Maryam's senior, 19 Oct 2026), so there is no Release early and no Run Weekly Run. */
export function AdminPayouts() {
  useStore();
  const [q, setQ] = useState("");
  const [state, setState] = useState("all"), [fund, setFund] = useState("all");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const ql = q.toLowerCase();
  const rows = PAYOUTS.filter((p) => state === "all" || p.state === state)
    .filter((p) => fund === "all" || (fund === "candidate" ? p.funder === "Candidate" : p.funder === "Platform"))
    .filter((p) => inRange(p.ivDate, from, to))
    .filter((p) => !q || [p.agent, p.agentEmail, p.candidate, p.ref].some((x) => String(x || "").toLowerCase().includes(ql)));
  const releases = (p: any) => {
    if (p.state === "paid") return twoLine(dpFmt(p.releasedOn) || "—", "Paid");
    if (p.state === "returned") return <Text role="caption" as="span">—</Text>;
    if (!p.releases) return <Status tone="warn">Recommendation outstanding</Status>;
    return twoLine(dpFmt(p.releases), p.runFailed ? <span className={f.err}>Last run failed: {p.runFailed}</span> : p.noDest ? <span className={f.warn}>No payout destination — the run skips it</span> : undefined);
  };
  return (
    <Page>
      <PageHeader title="Payouts" desc="An agent’s share per interview and where it stands. Payouts are released outside TalentNext, through QuickBooks / FAS."
        actions={<ExportBtn what="Payouts" />} />
      <Section kind="tabs">
        <Tabs value={state} onChange={setState} items={[["all", "All"], ["escrow", "Funds held"], ["paid", "Paid"], ["returned", "Refunded"]].map(([k, label]) => ({ key: k, label, count: PAYOUTS.filter((p) => k === "all" || p.state === k).length }))} />
      </Section>
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by agent name, email or candidate" />}
          filters={<>
            <Dropdown label="Funded by" value={fund} onChange={setFund} options={[["all", "All"], ["candidate", "Candidate"], ["platform", "Platform"]].map(([value, label]) => ({ value, label }))} />
            <DateFilter label="From" value={from} onChange={setFrom} />
            <DateFilter label="To" value={to} onChange={setTo} />
          </>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(p) => p.id} cols={[
            { key: "a", label: "Agent", cell: (p) => <PersonCell name={p.agent} img={face(p.agent)} sub={p.agentEmail} /> },
            { key: "c", label: "Candidate", cell: (p) => <PersonCell name={p.candidate} img={face(p.candidate)} /> },
            { key: "i", label: "Interview", cell: (p) => twoLine(dpFmt(p.ivDate), p.ivKind) },
            { key: "m", label: "Amount", cell: (p) => twoLine(money(p.gross), `${money(p.agentShare)} to agent`) },
            { key: "f", label: "Funded by", cell: (p) => p.funder },
            { key: "s", label: "State", cell: (p) => <St m={RAW.PO_STATE_META} k={p.state} /> },
            { key: "r", label: "Releases", cell: releases },
          ]} />
        ) : <Empty icon="wallet" title="No payouts match" />}
      </Section>
    </Page>
  );
}

/* ---------------- 9.4 Fee Settings (read-only history) ---------------- */
const feeISO = (e: any) => { const d = String(e.on || "").split(",")[0].trim(); return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : ""; };
export function AdminFeeSettings() {
  useStore();
  const [q, setQ] = useState(""), [vt, setVt] = useState("all");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const LBL: Record<string, string> = RAW.FEE_VALUE_LABEL;
  const ql = q.toLowerCase();
  const rows = FEE_LOG.filter((e) => vt === "all" || e.valueType === vt).filter((e) => inRange(feeISO(e), from, to))
    .filter((e) => !q || [e.agent, e.agentEmail, e.changedBy].some((x) => String(x || "").toLowerCase().includes(ql)));
  return (
    <Page>
      <PageHeader title="Fee Settings" desc="The record of every fee value ever set or changed. It is read-only and cannot be edited or cleared by anyone." actions={<ExportBtn what="Fee Settings" />} />
      <Section kind="tabs">
        <Tabs value={vt} onChange={setVt} items={[["all", "All"], ["commission", "Agent commission"], ["delay", "Payout release delay"], ["runday", "Payout run day"]].map(([k, label]) => ({ key: k, label, count: FEE_LOG.filter((e) => k === "all" || e.valueType === k).length }))} />
      </Section>
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by agent, email or who changed it" />}
          filters={<><DateFilter label="From" value={from} onChange={setFrom} /><DateFilter label="To" value={to} onChange={setTo} /></>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(e) => e.id} cols={[
            { key: "v", label: "Value", cell: (e) => LBL[e.valueType] || e.valueType },
            { key: "a", label: "Agent", cell: (e) => (e.valueType === "commission" ? <PersonCell name={e.agent} img={face(e.agent)} sub={e.agentEmail} /> : <Text role="caption" as="span">—</Text>) },
            { key: "f", label: "From", cell: (e) => e.from },
            { key: "t", label: "To", cell: (e) => e.to },
            { key: "b", label: "Changed by", cell: (e) => twoLine(e.changedBy, e.role) },
            { key: "o", label: "Changed on", cell: (e) => { const iso = feeISO(e); const tail = String(e.on || "").includes(",") ? String(e.on).split(",").slice(1).join(",").trim() : ""; return twoLine(iso ? dpFmt(iso) : e.on, tail); } },
            { key: "r", label: "Reason", cell: (e) => <span className={f.clamp} title={e.reason}>{e.reason}</span> },
          ]} />
        ) : <Empty icon="receipt" title="No fee changes match" />}
      </Section>
    </Page>
  );
}

/* ---------------- 9.5 / 9.6 Discount Codes ----------------
   Rebuilt 26 Oct 2026 (Maryam) on data/discounts.ts: a code is a percentage or a fixed
   amount off; it applies to courses, interviews or both; it can be held to tracks and
   (for courses) to chosen courses; on an interview it targets the whole price, the
   interview commission or the platform fee. Every discount is funded by Next in Leadership. */
const ORDER: Record<string, number> = RAW.DISC_ORDER;
const DISC_TONE: Record<string, [Tone, string]> = { live: ["green", "Live"], scheduled: ["warn", "Scheduled"], expired: ["red", "Expired"], deactivated: ["plain", "Deactivated"] };
const DiscSt = ({ d }: { d: any }) => { const [t, l] = DISC_TONE[discStatus(d)]; return <Status tone={t}>{l}</Status>; };
const valid = (d: any) => `${dpFmt(d.start)} – ${dpFmt(d.end)}`;
const opts = (xs: [string, string][]) => xs.map(([value, label]) => ({ value, label }));
const TRACK_OPTS = FEE_TRACKS.map((t) => ({ value: t.key, label: t.label }));
const COURSE_OPTS = COURSE_LIST.map((c) => ({ value: c.key, label: c.name }));
type DSheet = null | { k: "create" } | { k: "edit" | "deact"; id: string };
function discActs(d: any, open: (x: DSheet) => void, go?: (h: string) => void): RowAction[] {
  const st = discStatus(d);
  const a: RowAction[] = go ? [{ icon: "view", label: "View", onClick: () => go(`/admin/finance/discounts/${d.id}/`) }] : [];
  /* No system-owned first-interview code: the first interview is simply free, never a
     discount (Maryam 26 Oct 2026). Every code here is one an admin created. */
  if (st === "scheduled" || st === "live") {
    a.push({ icon: "edit", label: "Edit", onClick: () => open({ k: "edit", id: d.id }) });
    a.push({ icon: "close", label: "Deactivate", onClick: () => open({ k: "deact", id: d.id }) });
  }
  return a;
}
export function AdminDiscounts() {
  useStore();
  const router = useRouter();
  const [q, setQ] = useState(""), [st, setSt] = useState("all"), [ap, setAp] = useState("all");
  const [sheet, setSheet] = useState<DSheet>(null);
  const ql = q.toLowerCase();
  const rows = DISCOUNTS.filter((d) => st === "all" || discStatus(d) === st)
    .filter((d) => ap === "all" || d.scope === ap)
    .filter((d) => !q || [d.code, d.name].some((x) => String(x).toLowerCase().includes(ql)))
    .sort((a, b) => ORDER[discStatus(a)] - ORDER[discStatus(b)] || String(a.end || "").localeCompare(String(b.end || "")));
  return (
    <Page>
      <PageHeader title="Discount Codes" desc={`Every discount code and how much it has given away. Discounts are funded by ${FUNDER}.`}
        actions={<Stack row gap={3}><ExportBtn what="Discount Codes" /><Button kind="primary" size="sm" icon="add" onClick={() => setSheet({ k: "create" })}>Create Discount Code</Button></Stack>} />
      <Section kind="tabs">
        <Tabs value={st} onChange={setSt} items={["all", "scheduled", "live", "expired", "deactivated"].map((k) => ({ key: k, label: k === "all" ? "All" : DISC_TONE[k][1], count: DISCOUNTS.filter((d) => k === "all" || discStatus(d) === k).length }))} />
      </Section>
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by code or name" />}
          filters={<>
            <Dropdown label="Applies to" value={ap} onChange={setAp} options={[{ value: "all", label: "All" }, ...SCOPE_OPTS.map(([value, label]) => ({ value, label: value === "all" ? "Whole platform" : label }))]} />
          </>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(d) => d.id} href={(d) => `/admin/finance/discounts/${d.id}/`} actions={(d) => discActs(d, setSheet, router.push)} cols={[
            /* A whole-platform discount has no code: it applies on its own (Maryam 26 Oct 2026). */
            { key: "c", label: "Code", cell: (d) => (isPlatform(d) ? <Text role="compact" as="span" ink="secondary">Automatic, no code</Text> : d.code.toUpperCase()) },
            { key: "n", label: "Name", cell: (d) => d.name },
            { key: "p", label: "Discount", cell: valueLabel },
            { key: "a", label: "Applies to", cell: appliesLabel },
            { key: "v", label: "Valid", cell: valid },
            { key: "u", label: "Used", cell: (d) => String(discUsed(d)) },
            { key: "g", label: "Value given", cell: (d) => money(discValue(d)) },
            { key: "s", label: "Status", cell: (d) => <DiscSt d={d} /> },
          ]} />
        ) : <Empty icon="ticket" title="No discount codes match" />}
      </Section>
      <DiscSheets sheet={sheet} close={() => setSheet(null)} />
    </Page>
  );
}
export function AdminDiscount({ id }: { id: string }) {
  useStore();
  const [sheet, setSheet] = useState<DSheet>(null);
  const d = DISCOUNTS.find((x) => x.id === id);
  if (!d) return null;
  const used = discUsed(d);
  const acts = discActs(d, setSheet);
  return (
    <Page>
      <PageHeader back="/admin/finance/discounts/" title={codeLabel(d)} desc={`${isPlatform(d) ? "Automatic" : d.name} · ${valueLabel(d)} · ${appliesLabel(d)}`}
        actions={<span className={s.headAct}><DiscSt d={d} />{acts.length > 0 && <RowMenu items={acts} />}</span>} />
      <Section>
        <SectionHeader title="Summary" />
        <KV rows={[
          ["Code", isPlatform(d) ? "None. It applies to every candidate price automatically while live." : d.code.toUpperCase()], ["Status", <DiscSt key="s" d={d} />],
          ["Discount type", d.kind === "amount" ? "Fixed amount off" : "Percentage off"], ["Discount", valueLabel(d)],
          ["Applies to", SCOPE_OPTS.find(([k]) => k === d.scope)?.[1] ?? d.scope],
          /* Only the one follow-up its Applies-to choice has. */
          ...(d.scope === "track" ? [["Tracks", tracksLabel(d)] as [string, string]] : []),
          ...(d.scope === "course" ? [["Courses", coursesLabel(d)] as [string, string]] : []),
          ["Valid", valid(d)], ["Redemptions", String(used)], ["Value given away", money(discValue(d))], ["Funded by", FUNDER],
        ]} />
      </Section>
      <Section kind="block">
        <SectionHeader title="Redemptions" />
        {d.red?.length ? (
          <Table rows={d.red as any[]} rowKey={(r) => r.ref} href={(r) => (r.txId && TXNS.some((t) => t.id === r.txId) ? `/admin/finance/transactions/${r.txId}/` : undefined)} cols={[
            { key: "c", label: "Candidate", cell: (r) => <PersonCell name={r.cand} img={face(r.cand)} /> },
            { key: "r", label: "Reference", cell: (r) => (r.txId && TXNS.some((t) => t.id === r.txId) ? <span className={f.ref}>{r.ref}</span> : r.ref) },
            { key: "d", label: "Date", cell: (r) => dpFmt(r.date) },
            { key: "o", label: "Original", cell: (r) => money(r.original) },
            { key: "x", label: "Discounted", cell: (r) => money(r.discounted) },
            { key: "p", label: "Paid", cell: (r) => money(r.paid) },
            { key: "s", label: "Funding source", cell: (r) => r.source },
          ]} />
        ) : <Empty icon="ticket" title="No redemptions yet" desc="No one has used this code." />}
      </Section>
      <DiscSheets sheet={sheet} close={() => setSheet(null)} />
    </Page>
  );
}

function DiscSheets({ sheet, close }: { sheet: DSheet; close: () => void }) {
  if (!sheet) return null;
  if (sheet.k === "create") return <DiscForm close={close} />;
  if (sheet.k === "edit") return <DiscForm id={sheet.id} close={close} />;
  const d = DISCOUNTS.find((x) => x.id === sheet.id)!;
  const code = codeLabel(d);
  return <ReasonThenConfirm title={`Deactivate ${code}`} hint="The code stops working immediately. Discounts already given are unaffected." ask={`Deactivate ${code}?`}
    desc="It stops working immediately. Discounts already given are unaffected." ok="Deactivate" danger close={close}
    onOk={() => commit(() => { d.deactivated = true; }, `Discount code ${code} deactivated`)} />;
}
function ReasonThenConfirm({ title, hint, ask, desc, ok, danger, stepup, close, onOk }: { title: string; hint: string; ask: string; desc: string; ok: string; danger?: boolean; stepup?: boolean; close: () => void; onOk: () => void }) {
  const [why, setWhy] = useState(""), [asking, setAsking] = useState(false);
  if (asking) return <Confirm icon="warning" danger={danger} stepup={stepup} title={ask} desc={desc} ok={ok} onCancel={close} onOk={() => { onOk(); close(); }} />;
  return (
    <Sheet title={title} onClose={close} footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!why.trim()} onClick={() => setAsking(true)}>Continue</Button></>}>
      <Stack gap={4}>
        <Field label="Reason" required><TextArea rows={3} maxLength={500} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Recorded on the audit log (1–500 characters)." /></Field>
        <Text role="desc" as="p">{hint}</Text>
      </Stack>
    </Sheet>
  );
}

/* Create (a plain form) / Edit (a Scheduled code: everything but the code; a
   Live code: end date only, with a reason and a step-up). Every code is unlimited
   (Maryam 26 Oct 2026): no usage or per-candidate limit. Its one
   follow-up (Tracks or Courses) shows only for that Applies-to choice. */
function DiscForm({ id, close }: { id?: string; close: () => void }) {
  const d = id ? DISCOUNTS.find((x) => x.id === id) : null;
  const live = !!d && discStatus(d) === "live";
  const [v, setV] = useState({ code: d?.code ?? "", name: d?.name ?? "", kind: d?.kind ?? "", value: d ? String(d.value) : "", scope: d?.scope ?? "",
    start: d?.start ?? "", end: d?.end ?? "", reason: "" });
  const [tracks, setTracks] = useState<string[]>(d?.tracks ?? []), [courses, setCourses] = useState<string[]>(d?.courses ?? []);
  const [ask, setAsk] = useState(false);
  const set = (k: string, x: string) => setV((o) => ({ ...o, [k]: x }));
  const t = todayISO();
  const shape = { scope: v.scope };
  /* ONE Applies-to choice, at most ONE follow-up (Maryam 26 Oct 2026): Tracks picks tracks,
     Courses picks courses; the others need nothing more. */
  const platform = isPlatform(shape), forTrack = v.scope === "track", forCourse = v.scope === "course";
  const code = v.code.trim().toUpperCase(), value = Number(v.value);
  const err =
    !d && !platform && !code ? "A code is required" : !d && !platform && DISCOUNTS.some((x) => x.code.toUpperCase() === code) ? "That code already exists"
    : !v.name.trim() ? "A name is required" : !v.kind ? "Choose a discount type"
    : v.kind === "pct" && !(value >= 1 && value <= 100) ? "Enter a percentage between 1 and 100"
    : v.kind === "amount" && !(value >= 1) ? "Enter an amount of $1 or more" : !v.scope ? "Choose what the code applies to"
    : forTrack && !tracks.length ? "Pick at least one track" : forCourse && !courses.length ? "Pick at least one course"
    : !v.start ? "A start date is required" : !live && v.start < t ? "The start date must be today or later" : !v.end ? "An end date is required"
    : v.end < v.start ? "The end date must be on or after the start date" : live && v.end < t ? "The end date must be today or later"
    : d && !v.reason.trim() ? "A reason is required" : "";
  const save = () => commit(() => {
    const ch = live ? { end: v.end }
      : { name: v.name.trim(), kind: v.kind, value, scope: v.scope, tracks: forTrack ? tracks : [], courses: forCourse ? courses : [], start: v.start, end: v.end };
    if (d) Object.assign(d, ch);
    else DISCOUNTS.unshift({ id: `dc${Date.now()}`, code: platform ? "" : code, ...ch, deactivated: false, red: [] });
  }, d ? `${codeLabel(d)} updated` : platform ? `${v.name.trim()} created. It applies automatically while live.` : `Discount code ${code} created`);
  if (ask && d) return <Confirm icon="warning" stepup title={`Save these changes to ${codeLabel(d)}?`} desc="Discounts already given are unaffected. The new values apply to redemptions made from now on." ok="Save Changes" onCancel={close} onOk={() => { save(); close(); }} />;
  const ro = (x: string) => <Input value={x} readOnly />;
  return (
    <Slider open title={d ? `Edit discount — ${codeLabel(d)}` : "Create discount code"} onClose={close}
      footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!!err} onClick={() => (d ? setAsk(true) : (save(), close()))}>{d ? "Continue" : "Create Discount Code"}</Button></>}>
      <Stack gap={6}>
        {!platform && <Field label="Code" required={!d}><Input value={d ? d.code.toUpperCase() : v.code} readOnly={!!d} maxLength={24} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="The string a candidate enters, e.g. WELCOME20" /></Field>}
        <Field label="Name" required={!live} help={platform ? "Candidates see this name beside every discounted price." : undefined}><Input value={v.name} readOnly={live} onChange={(e) => set("name", e.target.value)} placeholder={platform ? "e.g. Black Friday sale" : "Internal name for the promotion"} /></Field>
        <Field label="Discount type" required={!live}>
          {live ? ro(KIND_OPTS.find(([k]) => k === v.kind)?.[1] ?? "") : <Dropdown variant="form" placeholder="Percentage or fixed amount" value={v.kind || undefined} onChange={(x) => set("kind", x)} options={opts(KIND_OPTS)} />}
        </Field>
        <Field label={v.kind === "amount" ? "Amount off ($)" : "Discount (%)"} required={!live}>
          <Input inputMode="numeric" value={v.value} readOnly={live} onChange={(e) => set("value", e.target.value.replace(/\D/g, ""))} placeholder={v.kind === "amount" ? "e.g. 25" : "1 to 100"} />
        </Field>
        <Field label="Applies to" required={!live}>
          {live ? ro(SCOPE_OPTS.find(([k]) => k === v.scope)?.[1] ?? "") : <Dropdown variant="form" placeholder="Choose what the discount covers" value={v.scope || undefined} onChange={(x) => set("scope", x)} options={opts(SCOPE_OPTS)} />}
        </Field>
        {forTrack && (
          <Field label="Tracks" required={!live} help="Every course and interview on these tracks.">
            {live ? ro(tracksLabel({ tracks })) : <MultiDropdown value={tracks} onChange={setTracks} options={TRACK_OPTS} placeholder="Choose tracks" allLabel="All tracks" />}
          </Field>
        )}
        {forCourse && (
          <Field label="Courses" required={!live}>
            {live ? ro(coursesLabel({ courses })) : <MultiDropdown value={courses} onChange={setCourses} options={COURSE_OPTS} placeholder="Choose courses" allLabel="All courses" />}
          </Field>
        )}
        <Field label="Start date" required={!live}>{live ? ro(dpFmt(v.start)) : <DateFilter label="Start" value={v.start} onChange={(x) => set("start", x)} />}</Field>
        <Field label="End date" required><DateFilter label="End" value={v.end} onChange={(x) => set("end", x)} /></Field>
        {d && <Field label="Reason" required><TextArea rows={3} maxLength={500} value={v.reason} onChange={(e) => set("reason", e.target.value)} placeholder="Recorded on the audit log (1–500 characters)." /></Field>}
        {/* The create-form footnote (checkout + funding) is removed (Maryam 26 Oct 2026); only the
            edit rules remain. */}
        {d && <Text role="desc" as="p">{live ? "While a code is live, only the end date can be changed. The other fields are shown for reference." : "The code string is fixed for the life of the code."}</Text>}
        {err && v.name && <Text role="caption" as="p">{err}</Text>}
      </Stack>
    </Slider>
  );
}

/* ---------------- 9.8 Reconciliation ---------------- */
const BATCH: Record<string, [string, string]> = RAW.BATCH_STATUS_META;
const diff = (b: any) => (b.providerTotal == null ? null : b.platformTotal - b.providerTotal);
export function AdminReconciliation() {
  useStore();
  const [q, setQ] = useState(""), [st, setSt] = useState("all");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const ql = q.toLowerCase();
  const rows = SETTLEMENTS.filter((b) => st === "all" || b.status === st).filter((b) => inRange(b.sent, from, to))
    .filter((b) => !q || [b.ref, b.providerRef].some((x) => String(x).toLowerCase().includes(ql)));
  return (
    <Page>
      <PageHeader title="Reconciliation" desc="Match what Stripe says it paid against what the platform released, so a difference is found before it becomes a missing payout." actions={<ExportBtn what="Reconciliation" />} />
      <Section kind="tabs">
        <Tabs value={st} onChange={setSt} items={["all", "sent", "settled", "part", "discrepancy", "failed"].map((k) => ({ key: k, label: k === "all" ? "All" : BATCH[k][1], count: SETTLEMENTS.filter((b) => k === "all" || b.status === k).length }))} />
      </Section>
      <Section kind="block">
        <Toolbar search={<Search value={q} onChange={setQ} placeholder="Search by batch or provider reference" />}
          filters={<><DateFilter label="From" value={from} onChange={setFrom} /><DateFilter label="To" value={to} onChange={setTo} /></>} />
        {rows.length ? (
          <Table rows={rows} rowKey={(b) => b.id} href={(b) => `/admin/finance/reconciliation/${b.id}/`} cols={[
            { key: "b", label: "Batch", cell: (b) => twoLine(b.ref, b.providerRef) },
            { key: "s", label: "Sent", cell: (b) => twoLine(dpFmt(b.sent), b.sentTime) },
            { key: "i", label: "Items", cell: (b) => String(b.list.length) },
            { key: "p", label: "Platform total", cell: (b) => money(b.platformTotal) },
            { key: "pr", label: "Provider total", cell: (b) => (b.providerTotal == null ? <Text role="caption" as="span">Awaiting provider</Text> : money(b.providerTotal)) },
            { key: "d", label: "Difference", cell: (b) => { const x = diff(b); return x == null ? <Text role="caption" as="span">—</Text> : x === 0 ? money(0) : <Status tone="red">{money(x)}</Status>; } },
            { key: "st", label: "Status", cell: (b) => <St m={BATCH} k={b.status} /> },
          ]} />
        ) : <Empty icon="chart" title="No settlement batches match" />}
      </Section>
    </Page>
  );
}
export function AdminBatch({ id }: { id: string }) {
  useStore();
  const [items, setItems] = useState("all");
  const [rev, setRev] = useState(false);
  const b = SETTLEMENTS.find((x) => x.id === id);
  if (!b) return null;
  const d = diff(b);
  const list = (b.list as any[]).filter((it) => items === "all" || it.match !== "matched");
  const recheck = () => commit(() => {
    if (b.status === "sent" || b.status === "part") {
      b.providerTotal = b.platformTotal; b.ingestErr = null;
      b.list.forEach((it: any) => { if (it.providerAmt == null) { it.providerAmt = it.platformAmt; it.providerState = it.platformState; it.match = "matched"; } });
      b.status = "settled";
    }
  }, b.status === "sent" || b.status === "part" ? `${b.ref} re-checked — now settled` : `${b.ref} re-checked — the difference still stands`);
  return (
    <Page>
      <PageHeader back="/admin/finance/reconciliation/" title={b.ref} desc={`${b.providerRef} · sent ${dpFmt(b.sent)} · ${BATCH[b.status][1]}`}
        actions={<Stack row gap={3}>
          {b.status !== "settled" && <Button kind="ghost" size="sm" icon="renew" onClick={recheck}>Re-check With Provider</Button>}
          {["discrepancy", "part", "failed"].includes(b.status) && <Button kind="ghost" size="sm" icon="check" onClick={() => setRev(true)}>Mark Reviewed</Button>}
        </Stack>} />
      {b.ingestErr && <Section><div className={f.note}><Icon name="warning" /><span><Text role="h4" as="span">Ingestion failed</Text><Text role="desc" as="span">{b.ingestErr}</Text></span></div></Section>}
      {b.reviewed && <Section><div className={f.note}><Icon name="info" /><span><Text role="h4" as="span">Reviewed by {b.reviewed.by} on {dpFmt(b.reviewed.on) || b.reviewed.on}</Text><Text role="desc" as="span">{b.reviewed.note}</Text></span></div></Section>}
      <Section>
        <SectionHeader title="Batch" />
        <KV rows={[["Batch reference", b.ref], ["Provider reference", b.providerRef], ["Sent", `${dpFmt(b.sent)}${b.sentTime ? " · " + b.sentTime : ""}`], ["Status", <St key="s" m={BATCH} k={b.status} />],
          ["Items", String(b.list.length)], ["Platform total", money(b.platformTotal)], ["Provider total", b.providerTotal == null ? "Awaiting provider" : money(b.providerTotal)], ["Difference", d == null ? "—" : money(d)]]} />
      </Section>
      <Section kind="tabs"><Tabs value={items} onChange={setItems} items={[{ key: "all", label: "All items" }, { key: "unmatched", label: "Unmatched only" }]} /></Section>
      <Section kind="block">
        {list.length ? (
          <Table rows={list} rowKey={(it) => `${it.recipient}${it.forWhat}`} href={(it) => (it.txId && TXNS.some((t) => t.id === it.txId) ? `/admin/finance/transactions/${it.txId}/` : undefined)} cols={[
            { key: "r", label: "Recipient", cell: (it) => <PersonCell name={it.recipient} img={face(it.recipient)} /> },
            { key: "f", label: "For", cell: (it) => it.forWhat },
            { key: "p", label: "Platform", cell: (it) => money(it.platformAmt) },
            { key: "pr", label: "Provider", cell: (it) => (it.providerAmt == null ? <Text role="caption" as="span">—</Text> : money(it.providerAmt)) },
            { key: "ps", label: "Platform state", cell: (it) => it.platformState },
            { key: "vs", label: "Provider state", cell: (it) => it.providerState },
            { key: "m", label: "Match", cell: (it) => <St m={RAW.MATCH_META} k={it.match} /> },
          ]} />
        ) : <Empty icon="chart" title="Nothing unmatched" desc="Every item in this batch matched." />}
      </Section>
      {rev && <MarkReviewed close={() => setRev(false)} onSave={(note) => commit(() => { b.reviewed = { by: "Derek Sole", on: todayISO(), note }; }, `${b.ref} marked reviewed`)} />}
    </Page>
  );
}
function MarkReviewed({ close, onSave }: { close: () => void; onSave: (note: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <Sheet title="Mark as reviewed" onClose={close} footer={<><Button kind="secondary" onClick={close}>Cancel</Button><Button kind="primary" disabled={!note.trim()} onClick={() => { onSave(note.trim()); close(); }}>Mark Reviewed</Button></>}>
      <Stack gap={4}>
        <Text role="desc" as="p">This records that you have looked at the batch. It changes no figure and resolves nothing.</Text>
        <Field label="Note" required><TextArea rows={3} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What you found (1–500 characters)." /></Field>
      </Stack>
    </Sheet>
  );
}
