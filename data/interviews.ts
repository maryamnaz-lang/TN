/* ============================================================
   CANDIDATE INTERVIEWS DATA — copied from Phase 1 (hifi data.js AGENTS,
   views.js report / scenes / checkout / modals), read 15 Oct 2026.
   ============================================================ */
import { PEOPLE } from "./seed";
import { COMMISSION_PCT, priceFor, type TrackFees, type TrackKey } from "./fees";

/* `fees` is the agent's fee per track (paid to them in full); `price` is what THIS candidate
   pays: the fee for their track with TalentNext's commission in (data/fees.ts, 26 Oct 2026). */
export type Agent = {
  key: string; name: string; img: string; rating: number; range: string; ivs: number;
  slot: string; fees: TrackFees; price: number; yrs: string; tags: string[]; recommended?: boolean;
};

/* Every Phase 0 candidate stage is on the Explorer track (STAGE descs in data/candidate.ts). */
export const CAND_TRACK: TrackKey = "explorer";
export const candPrice = (fees: TrackFees) => priceFor(fees[CAND_TRACK], COMMISSION_PCT);

/* Phase 1 AGENTS (data.js:629-660). Camila's photo is Phase 1's CALL_ART.faceW. The per-track
   fees are AUTHORED PLACEHOLDER; each Explorer fee keeps the price the candidate saw before,
   except Owen, now $110 to match his own portal (data/agent.ts). */
const ROWS: Omit<Agent, "price">[] = [
  { key: "priya", name: "Priya Nair", img: PEOPLE.priya.img, rating: 4.8, range: "E1–E3", ivs: 210, slot: "Thu, Aug 20 · 6:30 PM", fees: { explorer: 76, builder: 96, trailblazer: 116 }, yrs: "3", tags: ["Leadership", "Strategy", "Communication", "Operations"], recommended: true },
  { key: "owen", name: "Owen Clarke", img: PEOPLE.owen.img, rating: 4.6, range: "E2–B1", ivs: 164, slot: "Fri, Aug 21 · 5:00 PM", fees: { explorer: 88, builder: 100, trailblazer: 120 }, yrs: "2.5", tags: ["Technical", "Problem Solving", "Systems", "Retail Operations"] },
  { key: "lena", name: "Lena Fischer", img: PEOPLE.lena.img, rating: 4.5, range: "E1–E4", ivs: 98, slot: "Mon, Aug 24 · 7:00 PM", fees: { explorer: 64, builder: 80, trailblazer: 96 }, yrs: "4", tags: ["Product", "Communication", "Leadership", "Engineering Management"] },
  { key: "samuel", name: "Samuel Adeyemi", img: PEOPLE.samuel.img, rating: 4.4, range: "E3–B2", ivs: 143, slot: "Wed, Sep 2 · 6:00 PM", fees: { explorer: 72, builder: 88, trailblazer: 104 }, yrs: "2", tags: ["Data", "Analytics", "Problem Solving", "Reporting", "Forecasting"] },
  { key: "hana", name: "Hana Kim", img: "/images/people/av-hana.jpg", rating: 4.3, range: "B1–B4", ivs: 121, slot: "Thu, Sep 3 · 5:30 PM", fees: { explorer: 88, builder: 104, trailblazer: 120 }, yrs: "3", tags: ["UX Research", "Design", "Strategy", "Research Ops"] },
  { key: "camila", name: "Camila Rocha", img: "/images/people/call-art-facew.webp", rating: 4.7, range: "E4–B1", ivs: 176, slot: "Tue, Aug 25 · 5:30 PM", fees: { explorer: 80, builder: 96, trailblazer: 112 }, yrs: "3", tags: ["Product", "Growth", "Communication", "Go-to-Market"] },
];
export const AGENTS: Agent[] = ROWS.map((a) => ({ ...a, price: candPrice(a.fees) }));
export const agentByKey = (k: string) => AGENTS.find((a) => a.key === k) ?? AGENTS[0];

/* The first interview is booked straight away with no payment step and no price shown
   anywhere, never "Free", "$0" or "Complimentary" (Maryam 26 Oct 2026); the re-interview
   (day 90) is charged at the agent's price (Phase 1 ivCharged). */
export const isReinterview = (stage: string) => stage === "day90";

/* The "Fee · First interview free" fact is gone with the wording (26 Oct 2026); the facts
   grid is auto-fit, so three cells fill the row. */
export const HOW_IT_WORKS = {
  facts: [["Duration", "45 minutes"], ["Format", "Recorded video call"], ["Your Report", "Within 24 hours"]] as const,
  steps: [
    ["Choose Your Agent", "Browse available agents and choose your preferred interview slot."],
    ["Complete Your Interview", "Join a 45-minute video call to discuss real-life situations based on your answers. No preparation or passing score required."],
    ["Get Your Level", "Within 24 hours, your interview is evaluated to determine your level, strengths, and growth areas."],
    ["Access Your Report", "Your report stays in your account, and you control who can access it. Your confirmed level determines which course you can enroll in."],
  ] as const,
};

export const SAVED_CARDS = [
  { brand: "Visa", last4: "4242", exp: "09/29", def: true },
  { brand: "Mastercard", last4: "8210", exp: "04/28" },
  { brand: "Amex", last4: "1005", exp: "11/27" },
];

/* Past interviews, by stage. */
export const PAST: Record<string, { kind: "level" | "re"; outcome: string; date: string }[]> = {
  assessed: [{ kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" }],
  week1: [{ kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" }],
  day34: [{ kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" }],
  day90: [{ kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" }],
  promoted: [
    { kind: "re", outcome: "Promoted to Explorer – E4", date: "November 21, 2026" },
    { kind: "level", outcome: "Confirmed Explorer – E3", date: "August 20, 2026" },
  ],
};

export const SCENES = [
  ["1:48", "The reorganization call"], ["2:10", "Handing over the vendor review"], ["1:22", "The Friday rhythm"],
  ["2:41", "Managing up"], ["1:56", "Conflict with a peer"], ["1:11", "Closing reflection"],
] as const;
export const SCENES_PRICE = "$29"; // authored placeholder in Phase 1 (§74)
export const SCENE_STILL = PEOPLE.maryam.img; // Phase 1 draws every still from the candidate's photo

/* The report. FLAG: Phase 1's re-interview report (promoted) shows the E4 level
   card over the FIRST interview's details (Aug 20, "an E3, not an E2"). Copied
   as Phase 1 has it; needs a real re-interview write-up. */
export const REPORT = {
  level: { level: "Explorer – E3", rung: 3, when: "Confirmed August 21 · Assigned by TALENTnext" },
  re: { level: "Explorer – E4", rung: 4, when: "Promoted November 21 · Assigned by TALENTnext" },
  details: {
    agent: "Priya Nair · Talent Agent",
    date: "August 20, 2026",
    strengths: "You consider both outcomes and people when making decisions, supported by specific examples from your interview.",
    growth: "Delegation and coaching instead of taking over. Chapters 4 and 12 address these skills.",
    note: "“She talks cautiously, but she has already run a reorganization and can explain every call she made in it. That is an E3, not an E2.”",
  },
};
export const LADDER = ["E1", "E2", "E3", "E4", "E5", "B1", "B2", "B3", "B4", "B5", "T1", "T2", "T3", "T4", "T5"];
export const SHARE_NETS = ["LinkedIn", "Instagram", "X"];
