"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { DarkCard } from "../ui/DarkCard";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { Disclosure, HowItWorks } from "../ui/Disclosure";
import { CardPicker, PayModal, defaultCard } from "../ui/CardPicker";
import { ReceiptModal } from "../ui/Receipt";
import { DiscountField, type Applied } from "../ui/DiscountField";
import { redeem, saleFor } from "@/data/discounts";
import { Price } from "../ui/Price";
import { COMMISSION_PCT } from "@/data/fees";
import { PEOPLE } from "@/data/seed";
import { purchase, type Payment } from "@/data/payments";
import { LevelCard } from "./LevelCard";
import { Field, TextArea } from "../ui/Field";
import { Icon } from "../Icon";
import { useDemo } from "@/lib/demo";
import { atLeast } from "@/lib/demo";
import { AGENTS, HOW_IT_WORKS, PAST, REPORT, SAVED_CARDS, SCENES, SCENES_PRICE, SCENE_STILL, SHARE_NETS, CAND_TRACK, agentByKey, isReinterview, type Agent } from "@/data/interviews";
import { CallRow, When } from "./CallRow";
import s from "./interviews.module.css";

const BASE = "/candidate/interviews";
/* Where "Book" goes: a re-interview pays first (checkout); a first interview goes straight
   to the calendar and is booked there, with no price, "Free" or "$0" anywhere on the way
   (Maryam 26 Oct 2026; Phase 1 13 Oct 2026 for the skipped payment step). */
export const bookHref = (stage: string, key = "priya") =>
  `${BASE}/${isReinterview(stage) ? "checkout" : "book"}/${key}/`;

/* ============================================================
   /candidate/interviews/ — the module page. Phase 1 V.interviews, stage
   by stage: the agents table (before a booking, and again for the
   re-interview), the scheduled card (booked), the held tile, past
   interviews, and "How It Works" on every stage.
   ============================================================ */
export function InterviewsHome() {
  const { stage } = useDemo();
  const booked = stage === "booked" || stage === "resched";
  const choosing = stage === "new" || stage === "day90";
  const past = PAST[stage] ?? [];
  return (
    <Page>
      <PageHeader title="Interviews" desc="Your interviews with talent agents, past and upcoming, and how a session works." />
      {booked && (
        <DarkCard title="Scheduled" slot={<When>{stage === "resched" ? "In 2 days" : "In 5 minutes"}</When>}>
          <CallRow action={<Stack row gap={3}>
            <Button kind="secondary" icon="calendar" href={`${BASE}/book/priya/`}>Reschedule</Button>
            <Button kind="accent" go disabled>Join call</Button>
          </Stack>} />
        </DarkCard>
      )}
      {stage === "held" && (
        <Section kind="block">
          <div className={s.tile}>
            <Text role="h3">Interview Held</Text>
            <Text role="body">Your interview is being analysed. TALENTnext will assign your level and notify you when your report is ready, within 24 hours.</Text>
          </div>
        </Section>
      )}
      {choosing && (
        <Section kind="block">
          <SectionHeader title="Choose Your Interview Agent" desc="Select an agent to conduct your interview." />
          <AgentsTable />
        </Section>
      )}
      {past.length > 0 && (
        <Section>
          <SectionHeader title="Past interviews" />
          <PastList items={past} />
        </Section>
      )}
      <Section>
        <Disclosure title="How It Works"><HowItWorks {...HOW_IT_WORKS} /></Disclosure>
      </Section>
    </Page>
  );
}

/* /candidate/interviews/agents/ — "View All Agents" from the dashboard. */
export function AgentsPage() {
  return (
    <Page>
      <PageHeader title="All Agents" desc="Select an agent to conduct your interview." back={`${BASE}/`} />
      <Section kind="block"><AgentsTable /></Section>
    </Page>
  );
}

function AgentsTable() {
  const { stage } = useDemo();
  const charged = isReinterview(stage);
  /* A first interview is booked with no price shown anywhere (Maryam 26 Oct 2026): no Rate column. */
  const heads = charged ? ["Agent", "Expertise", "Experience", "Rate", ""] : ["Agent", "Expertise", "Experience", ""];
  return (
    <div className={`${s.agt} ${charged ? "" : s.noRate}`}>
      <div className={s.agtH}>
        {heads.map((h, i) => <Text key={i} role="compact" as="span" strong ink="primary">{h}</Text>)}
      </div>
      {AGENTS.map((a) => (
        <div key={a.key} className={s.agtR}>
          <div className={s.who}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.img} alt="" />
            <span className={s.wb}>
              <span className={s.nm}>
                <Text role="h4" as="span">{a.name}</Text>
                {a.recommended && <Text role="caption" as="span" className={s.recTag}>Recommended</Text>}
              </span>
              <span className={s.rate}><Stars n={a.rating} /><Text role="label" as="span">{a.rating}</Text></span>
              <Text role="caption" as="span">{a.range} · {a.ivs} interviews</Text>
            </span>
          </div>
          <div className={`${s.tags} ${s.tagsC}`}>
            {/* Two chips and a count keep the row on one line (Maryam 16 Oct 2026). */}
            {a.tags.slice(0, 2).map((t) => <Text key={t} role="label" as="span" className={s.tag}>{t}</Text>)}
            {a.tags.length > 2 && <Text role="label" as="span" className={s.tag}>+{a.tags.length - 2}</Text>}
          </div>
          <div><Text role="caption" as="span" className={s.cellL}>Experience</Text><Text role="compact" as="span">{a.yrs} yrs</Text></div>
          {charged && <div><Text role="caption" as="span" className={s.cellL}>Rate</Text><Text role="h4" as="span"><Price amount={a.price} /></Text></div>}
          <div className={s.act}><Button kind="primary" size="sm" href={bookHref(stage, a.key)}>Book</Button></div>
        </div>
      ))}
    </div>
  );
}

const Stars = ({ n }: { n: number }) => (
  <span className={s.stars} aria-label={`${n} out of 5`}>
    {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name={i <= Math.round(n) ? "star" : "starOutline"} />)}
  </span>
);

function PastList({ items }: { items: (typeof PAST)[string] }) {
  const a = agentByKey("priya");
  return (
    <div className={s.ivlist}>
      {items.map((p) => (
        <a key={p.kind} href={`${BASE}/report/${p.kind}/`} className={s.ivrow}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.img} alt="" />
          <span className={s.ivB}>
            <Text role="h4" as="span" className={s.ivN}>{a.name}</Text>
            <Text role="compact" as="span" className={s.ivOut}>{p.outcome}</Text>
            <Text role="eyebrow" as="span" className={s.ivEb}>{p.date}</Text>
          </span>
          <Icon name="chevRight" />
        </a>
      ))}
    </div>
  );
}

/* The agent's head on the booking and checkout pages (Phase 1 .bkp). */
function AgentHead({ a, charged }: { a: Agent; charged: boolean }) {
  return (
    <div className={s.bkp}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.img} alt="" />
      <div className={s.bkpB}>
        <span className={s.nameRow}><Text role="h3" as="span">{a.name}</Text><Icon name="verified" className={s.verified} /></span>
        <Text role="compact" as="span" className={s.rating}><Icon name="star" />{a.rating} · {a.ivs} interviews</Text>
        <Text role="compact" as="span" className={s.meta}>
          {/* A first interview shows no fee line at all (Maryam 26 Oct 2026). */}
          {charged && <span><Icon name="wallet" /><Price amount={a.price} /> Interview Fee</span>}
          <span><Icon name="video" />45 mins call</span>
        </Text>
      </div>
    </div>
  );
}

/* ============================================================
   /candidate/interviews/book/<agent>/ — pick a slot (Phase 1 V.agent).
   Calendly is third-party UI, so it is EMBEDDED as its picture, never
   redrawn. "Confirm booking" books: stage → booked (a reschedule keeps
   its stage), then the dashboard opens on "Interview Booked!".
   ============================================================ */
export function BookPage({ agent }: { agent: string }) {
  const a = agentByKey(agent);
  const { stage, setStage, setUi } = useDemo();
  const router = useRouter();
  const charged = isReinterview(stage);
  const confirm = () => {
    setUi({ ivBooked: { agent: a.key, charged } });
    /* A first booking moves to the "booked" stage; a paid RE-interview stays on its own
       stage (day 90), or the candidate would drop back to the first-interview journey and
       lose the course from Payments (26 Oct 2026). */
    if (!charged && stage !== "resched") setStage("booked");
    router.push("/candidate/");
  };
  return (
    <Page>
      <PageHeader title={`Book ${a.name}`} back={`${BASE}/`} desc="Pick a time that suits you for your 45-minute recorded interview." />
      <Section><AgentHead a={a} charged={charged} /></Section>
      <Section kind="block">
        <div className={s.col}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.shot} src="/images/art/calendly-shot.png" alt="Calendly booking calendar" />
          <Field label="What do you want to talk about?">
            <TextArea rows={3} maxLength={300} placeholder="A real leadership situation from the last few months works best." />
          </Field>
          <div className={s.go}><Button kind="primary" go onClick={confirm}>Confirm booking</Button></div>
        </div>
      </Section>
    </Page>
  );
}

/* ============================================================
   /candidate/interviews/checkout/<agent>/ — a charged re-interview pays
   first (Phase 1 V.checkout): saved cards, "Add a Card" (the Stripe
   picture), "Pay $X" → "Payment successful" → "Pick a slot" → calendar.
   ============================================================ */
export function CheckoutPage({ agent }: { agent: string }) {
  const a = agentByKey(agent);
  const router = useRouter();
  const { ui, setUi } = useDemo();
  const [add, setAdd] = useState(false);
  const [card, setCard] = useState(defaultCard(SAVED_CARDS));
  const [review, setReview] = useState(false);
  const [paid, setPaid] = useState(false);
  /* The receipt the candidate reviews BEFORE paying (Maryam 26 Oct 2026) is the row the
     Payments ledger keeps afterwards: same item, card, date and amount. */
  const [disc, setDisc] = useState<Applied>(null);
  /* A discount code works on the candidate's track fee with TalentNext's commission in; the
     candidate portal's agents carry no platform fee (data/interviews.ts). */
  const auto = saleFor(a.price);
  const eff: Applied = disc ?? (auto ? { code: auto.name, off: auto.off, d: auto.d } : null);
  const bill = purchase("re", `Re-interview · ${a.name}`, a.price, SAVED_CARDS[card], eff ?? undefined);
  const confirm = () => {
    if (eff) redeem(eff.d, PEOPLE.maryam.name, `TXN-${String(Date.now()).slice(-4)}`, a.price, eff.off);
    const made = (ui.purchases as Payment[] | undefined) ?? [];
    setUi({ purchases: [bill, ...made.filter((p) => p.id !== bill.id)] });
    setReview(false);
    setPaid(true);
  };
  return (
    <Page>
      <PageHeader title="Checkout" back={`${BASE}/`} desc="Choose a saved card to pay for your interview." />
      <Section><AgentHead a={a} charged /></Section>
      <Section kind="block">
        <div className={`${s.col} ${s.full}`}>
          <div>
            <SectionHeader small title="Pay with" actions={<Button kind="link" icon="add" asIs onClick={() => setAdd(true)}>Add a Card</Button>} />
            <CardPicker cards={SAVED_CARDS} value={card} onChange={setCard} />
          </div>
          <DiscountField ctx={{ kind: "interview", track: CAND_TRACK, fee: a.fees[CAND_TRACK], pct: COMMISSION_PCT, platform: 0 }} cand={PEOPLE.maryam.name} value={disc} onChange={setDisc} auto={auto} />
          <div className={s.go}><Button kind="primary" go onClick={() => setReview(true)}>Pay ${a.price - (eff?.off ?? 0)}</Button></div>
        </div>
      </Section>
      {add && <PayModal onClose={() => setAdd(false)} />}
      {review && <ReceiptModal r={bill} review onClose={() => setReview(false)} onConfirm={confirm} />}
      {paid && (
        <Dialog icon="checkFilled" title="Payment successful"
          fee={{ label: "Interview Fee", value: <Price amount={a.price} paid={a.price - (eff?.off ?? 0)} /> }}
          desc="Your payment was successfully processed. You can now continue to select a time for your interview."
          actions={<Button kind="primary" onClick={() => router.push(`${BASE}/book/${a.key}/`)}>Pick a slot</Button>} />
      )}
    </Page>
  );
}

/* The "Interview Booked!" dialog, raised on the dashboard after booking. */
export function BookedDialog() {
  const { ui, setUi } = useDemo();
  const b = ui.ivBooked as { agent: string; charged: boolean } | undefined;
  if (!b) return null;
  const a = agentByKey(b.agent);
  const close = () => setUi({ ivBooked: undefined });
  /* What was actually paid for the re-interview (Maryam 26 Oct 2026), after any code or sale. */
  const bought = ((ui.purchases as Payment[] | undefined) ?? []).find((p) => p.id === "re");
  const paid = bought ? Number(bought.amount.replace(/[^\d.]/g, "")) : undefined;
  return (
    <Dialog icon="checkFilled" title="Interview Booked!" onClose={close}
      desc={<>{b.charged ? <>You have booked an interview with {a.name} for <Price amount={a.price} paid={paid} />.</> : <>You have booked an interview with {a.name}.</>} Join the interview on your selected slot and get to know of your level.</>}
      actions={<Button kind="primary" onClick={close}>View My Dashboard</Button>} />
  );
}

/* ============================================================
   /candidate/interviews/report/<level|re>/ — Phase 1 V.report: the level
   card (black, with the ladder), Choose Your Scenes (pick three → save →
   offer the rest), the kept scenes with share, Interview Details, Enroll.
   CUT (G2): "Ask Tal: Why were these scenes selected…".
   ============================================================ */
export function ReportPage({ kind }: { kind: "level" | "re" }) {
  const { stage, ui, setUi } = useDemo();
  const lv = REPORT[kind];
  const d = REPORT.details;
  const key = `scenes-${kind}`;
  const kept = ui[key] as number[] | undefined;
  const [pick, setPick] = useState<number[]>([]);
  const [upsell, setUpsell] = useState(false);
  const toggle = (i: number) => setPick((p) => p.includes(i) ? p.filter((x) => x !== i) : p.length < 3 ? [...p, i] : p);
  const save = () => { setUi({ [key]: pick.slice() }); setUpsell(true); };
  const enrolled = atLeast(stage, "week1");

  return (
    <Page>
      <PageHeader title="Interview Report" back={`${BASE}/`} desc="Your level, what your agent saw in the interview, and the scenes you kept." />
      <LevelCard card={{ kind: "level", level: lv.level, rung: lv.rung, when: lv.when }} />

      {kept ? (
        <Section>
          <SectionHeader title="Scenes" />
          <div className={s.kept}>
            {kept.map((i) => <SceneCell key={i} i={i} share />)}
          </div>
        </Section>
      ) : (
        <Section>
          <SectionHeader title="Choose Your Scenes" desc="Six moments were selected from your interview. Choose three you’re comfortable sharing."
            actions={<Button kind="primary" size="sm" go disabled={pick.length !== 3} onClick={save}>Save Scenes</Button>} />
          <div className={s.pick}>
            {SCENES.map((_, i) => <SceneCell key={i} i={i} selectable selected={pick.includes(i)} onToggle={() => toggle(i)} />)}
          </div>
        </Section>
      )}

      <Section>
        <SectionHeader title="Interview Details" />
        <div className={s.sigH}>
          <span className={s.sigWho}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={agentByKey("priya").img} alt="" />
            <span className={s.sigB}><Text role="desc" as="span">Interviewed By</Text><Text role="h4" as="span">{d.agent}</Text></span>
          </span>
          <span className={s.sigWhen}>
            <Icon name="calendar" />
            <span className={s.sigB}><Text role="desc" as="span">Interview Date</Text><Text role="h4" as="span">{d.date}</Text></span>
          </span>
        </div>
        <div className={s.pair}>
          <SigCard tone="green" icon="growth" title="Strengths" tag="Strong" text={d.strengths} />
          <SigCard tone="violet" icon="flag" title="Growth Areas" tag="Focus" text={d.growth} />
        </div>
        <div className={s.note}><SigCard tone="blue" icon="comment" title="Priya’s Note" text={d.note} /></div>
      </Section>

      {!enrolled && (
        <Section kind="block"><Button kind="primary" go asIs href="/candidate/enrollment/">Enroll in Course</Button></Section>
      )}

      {upsell && (
        <Dialog icon="video" title="Get All Scenes" fee={{ label: "Only in", value: SCENES_PRICE }} onClose={() => setUpsell(false)}
          desc="You’ve selected your 3 included scenes. Want to keep the rest? Purchase the remaining interview scenes and get access to the complete set."
          actions={<>
            <Button kind="secondary" onClick={() => setUpsell(false)}>Continue with 3</Button>
            <Button kind="primary" go onClick={() => { setUi({ [key]: SCENES.map((_, i) => i) }); setUpsell(false); }}>Get All Scenes</Button>
          </>} />
      )}
    </Page>
  );
}

export function SigCard({ tone, icon, title, tag, text }: { tone: "green" | "violet" | "blue"; icon: "growth" | "flag" | "comment"; title: string; tag?: string; text: string }) {
  return (
    <div className={`${s.sigC} ${s[tone]}`}>
      <Icon name={icon} />
      <div className={s.sigCB}>
        <span className={s.sigTop}><Text role="h4" as="span" className={s.sigT}>{title}</Text>{tag && <span className={s.sigTag}>{tag}</span>}</span>
        <Text role="body" as="p" className={s.sigX}>{text}</Text>
      </div>
    </div>
  );
}

function SceneCell({ i, selectable, selected, onToggle, share }: {
  i: number; selectable?: boolean; selected?: boolean; onToggle?: () => void; share?: boolean;
}) {
  const [len, title] = SCENES[i];
  return (
    <div className={s.cell}>
      <button className={`${s.scene} ${selected ? s.sel : ""}`} onClick={onToggle} aria-pressed={selectable ? selected : undefined}>
        <span className={s.still} style={{ "--still": `url(${SCENE_STILL})` } as CSSProperties}>
          <span className={s.play}><Icon name="play" /></span>
          <span className={s.len}>{len}</span>
          {selectable && <span className={s.box}>{selected && <Icon name="check" />}</span>}
        </span>
        <span className={s.sceneT}>{title}</span>
      </button>
      {share && <ShareMenu />}
    </div>
  );
}

/* Share: a round disc on the still → Share on LinkedIn / Instagram / X. Also on the Profile scenes. */
export function ShareMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  return (
    <div className={s.share} ref={ref}>
      <button className={s.shareT} aria-label="Share scene" aria-expanded={open} onClick={() => setOpen((o) => !o)}><Icon name="share" /></button>
      {open && (
        <div className={s.shareM} role="menu">
          {SHARE_NETS.map((n) => (
            <button key={n} role="menuitem" className={`${s.shareI} t-body`} onClick={() => setOpen(false)}>Share on {n}</button>
          ))}
        </div>
      )}
    </div>
  );
}
