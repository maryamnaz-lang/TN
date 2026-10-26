/* ============================================================
   THE INTERVIEW PRICE — one rule, read by all three portals (Maryam 26 Oct 2026).

   A talent agent has a fee PER TRACK: Explorer, Builder, Trailblazer. The fee for an
   interview is the one for the candidate's track, and it is paid to the agent IN FULL.
   TalentNext's COMMISSION is one percentage (default 20%), separate from all three fees,
   and it is a share of what the CANDIDATE PAYS. So the candidate's price is
   fee / (1 - commission): an $80 fee at 20% is a $100 price, $80 to the agent and $20
   commission. This is the split the Finance ledger already stores ($180 agent + $45
   commission = $225), so the ledger needs no re-seeding.
   ============================================================ */
export type TrackKey = "explorer" | "builder" | "trailblazer";
export type TrackFees = Record<TrackKey, number>;

export const FEE_TRACKS: { key: TrackKey; label: string }[] = [
  { key: "explorer", label: "Explorer" }, { key: "builder", label: "Builder" }, { key: "trailblazer", label: "Trailblazer" },
];

/* The default commission (AUTHORED PLACEHOLDER until the client names a figure). */
export const COMMISSION_PCT = 20;

/* A level, band or track string → its track: "Builder – B1", "B3 · Builder", "T1", "Explorer, predicted…". */
export const trackOf = (s?: string): TrackKey =>
  /trailblazer|\bT\d/i.test(s || "") ? "trailblazer" : /builder|\bB\d/i.test(s || "") ? "builder" : "explorer";

/* What the candidate pays for an agent fee, and the commission inside it. A PLATFORM FEE
   (a flat dollar amount, set per agent after the commission, Maryam 26 Oct 2026) is added
   on top; agents with none set it to 0, so every existing price is unchanged. */
export const priceFor = (fee: number, pct: number = COMMISSION_PCT, platform = 0) => (fee > 0 ? Math.round(fee / (1 - pct / 100)) + platform : 0);
export const commissionFor = (fee: number, pct: number = COMMISSION_PCT) => priceFor(fee, pct) - fee;
