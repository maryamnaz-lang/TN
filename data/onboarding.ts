/* ONBOARDING QUESTIONS ARE DYNAMIC (Maryam, 4 Nov 2026). Super Admin adds, edits, deletes,
   reorders and switches questions on or off under Onboarding Questions, and the candidate's
   onboarding reads this SAME list (active ones, in order) — there is no second copy.
   Each question names what its answer FEEDS on the candidate's profile. A question that feeds
   Intent maps EACH OPTION to one of the course intents, so whatever the wording, an answer still
   lands on an intent and Tal can match a course. One question per field; Intent is the one field
   that must always be fed. Seeded from Phase 1's ONBOARDING_Q (the client's five, 21 Sep 2026):
   the option scores are dropped (Feeds replaced Weight, 2 Nov 2026) and Phase 1's candidate
   placeholders kept. A reload resets the list, like every prototype record. */
import { ONBOARDING_Q, RAW } from "./admin";

export type ObType = "single" | "text" | "dropdown";
/* FEEDS IS TWO OPTIONS, INTENT OR QUIZ (Maryam 11 Nov 2026; was Intent / Persona / Current role /
   Industry / Years working / Nothing).    Every question maps to one of the two, and ANY NUMBER of questions may feed either
   (Maryam 11 Nov 2026: "we can have intent from different questions"). An Intent question maps
   each of its options to a course intent; a Quiz question counts towards the leadership quiz.
   At least one active question must still feed Intent, or Tal cannot recommend a course. */
export type ObFeed = "intent" | "quiz";
export type ObOpt = { label: string; intent?: string };
export type ObQuestion = {
  id: string; text: string; type: ObType; feeds: ObFeed; active: boolean;
  options: ObOpt[]; placeholder?: string; other?: boolean;
};

export const OB_TYPES: [ObType, string][] = [["single", "Single choice"], ["dropdown", "Dropdown"], ["text", "Free text"]];
export const OB_FEEDS: [ObFeed, string][] = [["intent", "Intent"], ["quiz", "Quiz"]];
/* Only Intent must have a question feeding it: without it Tal cannot recommend a course. */
export const OB_REQUIRED: ObFeed[] = ["intent"];
/* An intent comes from a pick, so a free-text question cannot feed it. */
export const feedFits = (f: ObFeed, t: ObType) => !(f === "intent" && t === "text");
export const OB_INTENTS: [string, string][] = RAW.INTENTS;
export const feedName = (f: ObFeed) => OB_FEEDS.find(([k]) => k === f)?.[1] ?? "—";

const SEED: Record<string, { feeds: ObFeed; placeholder?: string; intents?: string[] }> = {
  obq1: { feeds: "intent", intents: ["role", "another", "ownership", "another"] },
  obq2: { feeds: "quiz" },
  obq3: { feeds: "quiz", placeholder: "Operations coordinator, student, own a detailing business" },
  obq4: { feeds: "quiz", placeholder: "Select your industry" },
  obq5: { feeds: "quiz" },
};
export const OB_QUESTIONS: ObQuestion[] = ONBOARDING_Q as ObQuestion[];
for (const q of OB_QUESTIONS as any[]) {
  if (q.feeds === "intent" || q.feeds === "quiz") continue;
  const seed = SEED[q.id] ?? { feeds: "quiz" };
  q.feeds = seed.feeds; q.active = true;
  if (seed.placeholder) q.placeholder = seed.placeholder;
  q.options = (q.options || []).map((o: any, i: number) => ({ label: o.label, ...(seed.intents ? { intent: seed.intents[i] } : {}) }));
  delete q.weight;
}
/* Another active question feeding a field, other than `except`. */
export const feederOf = (f: ObFeed, except?: string) => OB_QUESTIONS.find((q) => q.active && q.feeds === f && q.id !== except);
/* The one question feeding a required field cannot be deleted, switched off or re-pointed. */
export const lockedFeeder = (q: ObQuestion) => q.active && OB_REQUIRED.includes(q.feeds) && !feederOf(q.feeds, q.id);
/* What the candidate is asked: the active questions, in order. */
export const obLive = () => OB_QUESTIONS.filter((q) => q.active);

export const OB_WELCOME = {
  title: "Welcome to TALENTnext, Maryam!",
  /* Two paragraphs, as Phase 1 sets them. */
  lede: ["I’m Tal, your guide throughout your TALENTnext journey.", "Before we get started, I have a few quick questions to learn more about you and personalize your experience."],
};

/* CUT (G8): "Locks in your cohort and your price" → "Locks in your price";
   "90-Day Cohort Journey" → "Course Journey" (self-paced, Maryam 16 Oct 2026). */
export const OB_DONE = {
  title: "You’re all set",
  lede: "That is everything I needed. Here is where you are, and what comes next.",
  steps: [
    ["Leadership Quiz", "You have taken it. Explorer track.", "done"],
    ["Interview & Levelling", "You are here. 45 minutes with a talent agent, and it is what sets your level.", "on"],
    ["Course Enrollment", "Locks in your price.", ""],
    ["Course Journey", "13 chapters, at your own pace.", ""],
  ] as [string, string, string][],
};
