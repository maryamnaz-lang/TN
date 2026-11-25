"use client";
import { Chips, Chip } from "../ui/Chip";
import { useRef, useState, type CSSProperties } from "react";
import { Page, PageHeader, Section, SectionHeader, Stack, Text } from "../primitives";
import { Tabs } from "../ui/Tabs";
import { Button } from "../ui/Button";
import { Facts, Fact, Stats, Stat } from "../ui/Figures";
import { Field, Input, TextArea, Form, FormRow } from "../ui/Field";
import { Dropdown } from "../ui/Dropdown";
import { MonthInput, ymLabel } from "../ui/DateFilter";
import { Accordion } from "../ui/Accordion";
import { ToggleRow } from "../ui/Toggle";
import { Modal } from "../ui/Modal";
import { Confirm } from "../ui/Confirm";
import { Icon } from "../Icon";
import { useDemo } from "@/lib/demo";
import { PF, INTENTS, EMPLOYMENT, AVATARS, PF_SCENES, SOCIAL, MY_COURSES, EMAIL_TOGGLES, ALWAYS_ON } from "@/data/profile";
import { levelCard } from "@/data/level";
import { SCENE_STILL } from "@/data/interviews";
import { PEOPLE } from "@/data/seed";
import { ShareMenu } from "./Interviews";
import { TimeZoneSection } from "./TimeZone";
import s from "./profile.module.css";
import t from "./interviews.module.css";

/* ============================================================
   /candidate/profile/ — Phase 1 V.account, five tabs: My Profile ·
   Linked Accounts · My Courses · Notifications · Privacy Settings.
   CUT: "Volunteer to lead a Cohort" (G8), the rank chip and Points (G9),
   "Ask Tal" under the scenes (G2), the cohort notification rows (G8).
   Edits are in place (a prototype: Save keeps the change for the session).
   ============================================================ */
const TABS = [
  { key: "me", label: "My Profile", count: "4/5" }, { key: "linked", label: "Linked Accounts" }, { key: "courses", label: "My Courses" },
  { key: "priv", label: "Privacy Settings" }, /* Notifications tab removed (Maryam 16 Oct 2026) */
];

export function ProfilePage() {
  const [tab, setTab] = useState("me");
  return (
    <Page>
      <PageHeader title="Profile" desc="Your details, linked accounts, courses and privacy settings." />
      <Section kind="tabs"><Tabs value={tab} onChange={setTab} items={TABS} /></Section>
      {tab === "me" && <MyProfile />}
      {tab === "linked" && <Linked />}
      {tab === "courses" && <Courses />}
      {tab === "priv" && <Privacy />}
    </Page>
  );
}

/* ---------------- My Profile ---------------- */
/* ============================================================
   MY PROFILE'S EDITING MODEL (dev-team review, 24 Nov 2026).
   - ONE SECTION IN EDIT AT A TIME. `edit` names the open section (Details, Time Zone, Experience,
     Education, Certifications, Skills). Opening another while the open one has unsaved changes asks
     first ("Discard your changes?"); with nothing changed it simply switches.
   - EVERY SECTION EDITS A DRAFT. Save writes the draft back, Discard throws it away. Before this the
     Details and Skills forms wrote straight into the page, so Discard kept the edits, and the CV forms
     were uncontrolled, so Save kept nothing.
   - ADD opens the section with a new empty entry at the top; REMOVE takes an entry out of the draft.
   - A CV entry carries a logo (upload / remove), and its dates are month/year pickers.
   ============================================================ */
type Sec = "general" | "tz" | "work" | "edu" | "cert" | "skill";
const SEC_NAME: Record<Sec, string> = { general: "Details", tz: "Time Zone", work: "Experience", edu: "Education", cert: "Licenses & certifications", skill: "Skills" };
type Exp = (typeof PF.experience)[number];
type Edu = (typeof PF.education)[number];
type Cert = (typeof PF.certs)[number];
const BLANK_EXP: Exp = { role: "", org: "", kind: "Full-time", from: "", to: "", art: "" };
const BLANK_EDU: Edu = { school: "", art: "", degree: "", field: "", from: "", to: "" };
const BLANK_CERT: Cert = { name: "", org: "", art: "", issued: "", cred: "" };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/* How long a role ran, "2 yrs 8 mos", from "YYYY-MM" to "YYYY-MM" (or to this month when current). */
function span(from: string, to: string) {
  if (!from) return "";
  const now = new Date();
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to ? to.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const n = (ty - fy) * 12 + (tm - fm) + 1;
  if (n <= 0) return "";
  const y = Math.floor(n / 12), m = n % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}
const yearsLabel = (n: number) => `${n} ${n === 1 ? "year" : "years"}`;

function MyProfile() {
  const { stage, setUi } = useDemo();
  const [g, setG] = useState(PF.general);
  const [exp, setExp] = useState<Exp[]>(PF.experience);
  const [edu, setEdu] = useState<Edu[]>(PF.education);
  const [certs, setCerts] = useState<Cert[]>(PF.certs);
  const [skills, setSkills] = useState(PF.skills);
  /* The candidate's own zone (24 Nov 2026), New York as the seed (AUTHORED PLACEHOLDER). */
  const [tz, setTz] = useState("America/New_York");

  const [edit, setEdit] = useState<Sec | null>(null);
  const [dG, setDG] = useState(g);
  const [dTz, setDTz] = useState<string | null>(null);
  const [dExp, setDExp] = useState<Exp[]>([]);
  const [dEdu, setDEdu] = useState<Edu[]>([]);
  const [dCert, setDCert] = useState<Cert[]>([]);
  const [dSkill, setDSkill] = useState<string[]>([]);
  /* Set after a Save that found a required field empty: the form then shows its errors. */
  const [tried, setTried] = useState(false);
  const [pending, setPending] = useState<{ k: Sec; add: boolean } | null>(null);

  const [photo, setPhoto] = useState(PEOPLE.maryam.img);
  const [photoOpen, setPhotoOpen] = useState(false);
  const lc = levelCard(stage);
  const track = "Explorer track";
  const level = lc.kind === "level" ? lc.level : "Not set yet";
  /* Phase 1 counts COMPLETED courses only: one once the 90 days are done. */
  const courses = stage === "day90" || stage === "promoted" ? 1 : 0;

  const dirty = () => {
    switch (edit) {
      case "general": return !same(dG, g);
      case "tz": return dTz !== null && dTz !== tz;
      case "work": return !same(dExp, exp);
      case "edu": return !same(dEdu, edu);
      case "cert": return !same(dCert, certs);
      case "skill": return !same(dSkill, skills);
      default: return false;
    }
  };
  const close = () => { setEdit(null); setDTz(null); setTried(false); };
  /* Opens a section with a fresh draft; `add` puts a new empty entry at the top. */
  const start = (k: Sec, add: boolean) => {
    setTried(false);
    setDTz(k === "tz" ? tz : null);
    if (k === "general") setDG(g);
    if (k === "work") setDExp(add ? [{ ...BLANK_EXP }, ...exp] : exp);
    if (k === "edu") setDEdu(add ? [{ ...BLANK_EDU }, ...edu] : edu);
    if (k === "cert") setDCert(add ? [{ ...BLANK_CERT }, ...certs] : certs);
    if (k === "skill") setDSkill(skills);
    setEdit(k);
  };
  /* EVERY SWITCH ASKS FIRST (Maryam 25 Nov 2026): while one section is in edit, opening another
     always confirms, changed or not, so no section ever closes silently. Add on the section that
     is already open just puts a new blank entry on top of the draft, keeping what was typed. */
  const open = (k: Sec, add = false) => {
    if (edit === k) {
      if (!add) return;
      if (k === "work") setDExp((d) => [{ ...BLANK_EXP }, ...d]);
      if (k === "edu") setDEdu((d) => [{ ...BLANK_EDU }, ...d]);
      if (k === "cert") setDCert((d) => [{ ...BLANK_CERT }, ...d]);
      return;
    }
    if (edit) setPending({ k, add });
    else start(k, add);
  };

  /* Save: refuses while a required field is empty (the fields then say which), else writes the draft. */
  const save = () => {
    if (edit === "general") {
      if (!dG.name.trim()) return setTried(true);
      setG(dG);
    } else if (edit === "work") {
      if (dExp.some((e) => !e.role.trim() || !e.org.trim() || !e.from)) return setTried(true);
      setExp(dExp);
    } else if (edit === "edu") {
      if (dEdu.some((e) => !e.school.trim() || !e.from)) return setTried(true);
      setEdu(dEdu);
    } else if (edit === "cert") {
      if (dCert.some((c) => !c.name.trim() || !c.org.trim() || !c.issued)) return setTried(true);
      setCerts(dCert);
    } else if (edit === "skill") setSkills(dSkill);
    close();
  };
  const editActs = (
    <Stack row gap={3}>
      <Button kind="secondary" icon="delete" onClick={close}>Discard Changes</Button>
      <Button kind="primary" icon="check" onClick={save}>Save Changes</Button>
    </Stack>
  );
  /* A CV section's heading carries icon-only controls (Phase 1, 4 Sep 2026): Add (where the
     section takes entries) to the left of Edit. */
  const icons = (k: Sec, edit_: string, add?: string) => (
    <Stack row gap={3}>
      {add && <Button kind="ghost" size="sm" icon="add" label={add} onClick={() => open(k, true)} />}
      <Button kind="ghost" size="sm" icon="edit" label={edit_} onClick={() => open(k)} />
    </Stack>
  );
  const req = (v: string, msg: string) => (tried && !v.trim() ? msg : undefined);
  const patch = <T,>(set: React.Dispatch<React.SetStateAction<T[]>>, i: number, p: Partial<T>) =>
    set((l) => l.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const drop = <T,>(set: React.Dispatch<React.SetStateAction<T[]>>, i: number) => set((l) => l.filter((_, j) => j !== i));
  /* An entry's head row: its logo on the left, Remove on the right, one line (Maryam 25 Nov 2026:
     the logo had a row of its own under an empty Remove row). */
  const entryHead = (logo: React.ReactNode, onRemove: () => void) => (
    <div className={s.entryH}>{logo}<Button kind="link" size="sm" icon="delete" onClick={onRemove}>Remove</Button></div>
  );
  const empty = (what: string) => <Text role="desc" as="p">No {what} yet. Use Add to put one here.</Text>;

  return (
    <>
      <Section kind="block">
        <div className={s.idhead}>
          <span className={s.photo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" />
            {edit === "general" && <button className={s.pencil} aria-label="Change photo" onClick={() => setPhotoOpen(true)}><Icon name="edit" /></button>}
          </span>
          <span className={s.idB}>
            <Text role="h2" as="span">{g.name}</Text>
            <Text role="desc" as="span">{g.nickname}</Text>
          </span>
          <span className={s.idAct}>{edit === "general" ? editActs : <Button kind="ghost" icon="edit" size="sm" onClick={() => open("general")}>Edit Details</Button>}</span>
        </div>
      </Section>

      {edit === "general" ? (
        <Section kind="block"><GeneralForm g={dG} onChange={setDG} nameError={req(dG.name, "Enter your name")} /></Section>
      ) : (
        <Section kind="block">
          <Facts>
            <Fact icon="flag" label="My track" value={track} />
            <Fact icon="growth" label="My level" value={level} />
            <Fact icon="book" label="Total courses taken" value={String(courses)} />
            <Fact icon="user" label="Current role" value={g.role} />
            <Fact icon="skill" label="Industry" value={g.industry} />
            <Fact icon="time" label="Years of experience" value={yearsLabel(g.years)} />
            <Fact icon="flag" label="Aspiration" value={g.intent} />
          </Facts>
        </Section>
      )}

      {/* About is edited inside the Details form, so while that form is open this section is not
          drawn: the paragraph would otherwise show twice, once in the form and once here. */}
      {edit !== "general" && (
        <Section>
          <SectionHeader title="About Me" />
          <Text role="body" ink="secondary">{g.about}</Text>
        </Section>
      )}

      <TimeZoneSection tz={tz} onChange={setTz} draft={edit === "tz" ? dTz : null}
        setDraft={(z) => (z === null ? close() : setDTz(z))} onEdit={() => open("tz")} />

      <ScenesCarousel />

      <CvSection title="Experience" editing={edit === "work"} acts={editActs} pen={icons("work", "Edit Experience", "Add a role")}
        view={exp.length ? exp.map((e, i) => <CvRow key={i} icon="work" art={e.art} title={`${e.role} · ${e.org}`}
          sub={[e.kind, `${ymLabel(e.from)} – ${e.to ? ymLabel(e.to) : "Present"}`, span(e.from, e.to)].filter(Boolean).join(" · ")} />) : empty("roles")}
        form={dExp.length ? dExp.map((e, i) => (
          <div key={i} className={s.entry}>
            {entryHead(<LogoField art={e.art} icon="work" what="company" onChange={(art) => patch(setDExp, i, { art })} />, () => drop(setDExp, i))}
            <Form>
              <FormRow>
                <Field label="Title" required error={req(e.role, "Enter a title")}><Input value={e.role} placeholder="e.g. Operations Lead" onChange={(x) => patch(setDExp, i, { role: x.target.value })} /></Field>
                <Field label="Company" required error={req(e.org, "Enter a company")}><Input value={e.org} placeholder="e.g. Tkxel" onChange={(x) => patch(setDExp, i, { org: x.target.value })} /></Field>
              </FormRow>
              <div className={s.g3}>
                <Field label="Employment type"><Dropdown variant="form" value={e.kind} onChange={(kind) => patch(setDExp, i, { kind })} options={EMPLOYMENT.map((o) => ({ value: o, label: o }))} /></Field>
                <Field label="Start" required error={tried && !e.from ? "Choose a start month" : undefined}>
                  <MonthInput label="Start" value={e.from} error={tried && !e.from} onChange={(from) => patch(setDExp, i, { from, to: e.to && e.to < from ? "" : e.to })} />
                </Field>
                <Field label="End">
                  <MonthInput label="End" value={e.to} min={e.from} placeholder="Present" disabled={!e.to} onChange={(to) => patch(setDExp, i, { to })} />
                </Field>
              </div>
              <CheckRow on={!e.to} label="I currently work here" onChange={(on) => patch(setDExp, i, { to: on ? "" : thisMonth() })} />
            </Form>
          </div>
        )) : empty("roles")} />

      <CvSection title="Education" editing={edit === "edu"} acts={editActs} pen={icons("edu", "Edit Education", "Add a school")}
        view={edu.length ? edu.map((e, i) => <CvRow key={i} icon="book" art={e.art} title={e.school}
          sub={[[e.degree, e.field].filter(Boolean).join(", "), `${ymLabel(e.from)} – ${e.to ? ymLabel(e.to) : "Present"}`].filter(Boolean).join(" · ")} />) : empty("schools")}
        form={dEdu.length ? dEdu.map((e, i) => (
          <div key={i} className={s.entry}>
            {entryHead(<LogoField art={e.art} icon="book" what="school" onChange={(art) => patch(setDEdu, i, { art })} />, () => drop(setDEdu, i))}
            <Form>
              {/* School + Degree, then Field of study + the two years (Maryam 25 Nov 2026). */}
              <FormRow>
                <Field label="School" required error={req(e.school, "Enter a school")}><Input value={e.school} placeholder="e.g. COMSATS University" onChange={(x) => patch(setDEdu, i, { school: x.target.value })} /></Field>
                <Field label="Degree"><Input placeholder="BS" value={e.degree} onChange={(x) => patch(setDEdu, i, { degree: x.target.value })} /></Field>
              </FormRow>
              <div className={s.g3}>
                <Field label="Field of study"><Input placeholder="Computer Science" value={e.field} onChange={(x) => patch(setDEdu, i, { field: x.target.value })} /></Field>
                <Field label="Start year" required error={tried && !e.from ? "Choose a start year" : undefined}>
                  <MonthInput mode="year" label="Start year" value={e.from} error={tried && !e.from} onChange={(from) => patch(setDEdu, i, { from, to: e.to && e.to < from ? "" : e.to })} />
                </Field>
                <Field label="End year (or expected)">
                  <MonthInput mode="year" label="End year" value={e.to} min={e.from} future placeholder="Select year" onChange={(to) => patch(setDEdu, i, { to })} />
                </Field>
              </div>
            </Form>
          </div>
        )) : empty("schools")} />

      <CvSection title="Licenses & certifications" editing={edit === "cert"} acts={editActs} pen={icons("cert", "Edit Licenses & Certifications", "Add a certification")}
        view={certs.length ? certs.map((c, i) => <CvRow key={i} icon="certificate" art={c.art} title={c.name} sub={`${c.org} · issued ${ymLabel(c.issued)}`} sub2={c.cred} />) : empty("certifications")}
        form={dCert.length ? dCert.map((c, i) => (
          <div key={i} className={s.entry}>
            {entryHead(<LogoField art={c.art} icon="certificate" what="issuer" onChange={(art) => patch(setDCert, i, { art })} />, () => drop(setDCert, i))}
            <Form>
              <FormRow>
                <Field label="Name" required error={req(c.name, "Enter the certification name")}><Input value={c.name} onChange={(x) => patch(setDCert, i, { name: x.target.value })} /></Field>
                <Field label="Issuing organisation" required error={req(c.org, "Enter the issuing organisation")}><Input value={c.org} onChange={(x) => patch(setDCert, i, { org: x.target.value })} /></Field>
              </FormRow>
              <FormRow>
                <Field label="Issue date" required error={tried && !c.issued ? "Choose the issue month" : undefined}>
                  <MonthInput label="Issue date" value={c.issued} error={tried && !c.issued} onChange={(issued) => patch(setDCert, i, { issued })} />
                </Field>
                <Field label="Credential"><Input placeholder="What the credential is in" value={c.cred} onChange={(x) => patch(setDCert, i, { cred: x.target.value })} /></Field>
              </FormRow>
            </Form>
          </div>
        )) : empty("certifications")} />

      <Skills editing={edit === "skill"} list={edit === "skill" ? dSkill : skills} setList={setDSkill} acts={editActs} pen={icons("skill", "Edit Skills")} />

      <Section kind="block">
        <Button kind="secondary" icon="logout" onClick={() => setUi({ logout: true })}>Log Out</Button>
      </Section>

      {photoOpen && <PhotoSheet current={photo} onClose={() => setPhotoOpen(false)} onSave={(p) => { setPhoto(p); setPhotoOpen(false); }} />}
      {pending && edit && (
        <Confirm icon="edit" title={dirty() ? "Discard your changes?" : `Close ${SEC_NAME[edit]}?`}
          desc={dirty()
            ? <>You have unsaved changes in <b>{SEC_NAME[edit]}</b>. Opening {SEC_NAME[pending.k]} discards them.</>
            : <>You are editing <b>{SEC_NAME[edit]}</b>. Opening {SEC_NAME[pending.k]} closes it.</>}
          ok={dirty() ? "Discard Changes" : "Continue"} onCancel={() => setPending(null)}
          onOk={() => { const p = pending; setPending(null); start(p.k, p.add); }} />
      )}
    </>
  );
}

const thisMonth = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; };

function GeneralForm({ g, onChange, nameError }: { g: typeof PF.general; onChange: (g: typeof PF.general) => void; nameError?: string }) {
  const set = (k: keyof typeof PF.general) => (e: { target: { value: string } }) => onChange({ ...g, [k]: e.target.value });
  return (
    <Form>
      <div className={s.g3}>
        <Field label="Name" required error={nameError}><Input value={g.name} onChange={set("name")} /></Field>
        <Field label="Nickname"><Input value={g.nickname} placeholder="A short name others can call you" onChange={set("nickname")} /></Field>
        <Field label="Email"><Input value={g.email} readOnly /></Field>
      </div>
      <div className={s.g3}>
        <Field label="Current role"><Input value={g.role} placeholder="e.g. Operations Lead — or Student" onChange={set("role")} /></Field>
        <Field label="Industry"><Input value={g.industry} placeholder="e.g. Software" onChange={set("industry")} /></Field>
        {/* A whole number of years, 0 to 60 (24 Nov 2026, was free text). */}
        <Field label="Years of experience">
          <Input type="number" inputMode="numeric" min={0} max={60} step={1} value={g.years} placeholder="e.g. 5"
            onChange={(e) => { const n = Math.min(60, Math.max(0, Math.floor(Number(e.target.value.replace(/\D/g, "")) || 0))); onChange({ ...g, years: n }); }} />
        </Field>
      </div>
      <Field label="Intent aspiration">
        <Dropdown variant="form" value={g.intent} onChange={(v) => onChange({ ...g, intent: v })} options={INTENTS.map((i) => ({ value: i, label: i }))} />
      </Field>
      <Field label="About"><TextArea value={g.about} placeholder="Two or three sentences on what you do and what you are good at." onChange={set("about")} /></Field>
    </Form>
  );
}

/* An entry's logo, edited the way the profile photo is (Maryam 25 Nov 2026: "keep this consistent
   with how we allow the profile image edit"): the logo square carries the same blue pencil badge,
   and the badge opens a preview with Upload and Remove. Empty, the section's icon stands in.
   Logos are artwork, so the preview stays square (DESIGN.md: only a person's photo is a disc). */
function LogoField({ art, icon, what, onChange }: { art: string; icon: "work" | "book" | "certificate"; what: string; onChange: (art: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={s.logoF}>
      <span className={`${s.cvArt} ${art ? s.logoImg : ""}`} style={art ? ({ "--art": `url(${art})` } as CSSProperties) : undefined}>{!art && <Icon name={icon} />}</span>
      <button type="button" className={`${s.pencil} ${s.pencilSm}`} aria-label={`Change ${what} logo`} onClick={() => setOpen(true)}><Icon name="edit" /></button>
      {open && <LogoSheet current={art} icon={icon} what={what} onClose={() => setOpen(false)} onSave={(v) => { onChange(v); setOpen(false); }} />}
    </div>
  );
}

/* The logo picker: the PhotoSheet's Profile Image pane, square, with no avatar tab. */
function LogoSheet({ current, icon, what, onClose, onSave }: {
  current: string; icon: "work" | "book" | "certificate"; what: string; onClose: () => void; onSave: (v: string) => void;
}) {
  const [img, setImg] = useState(current);
  const file = useRef<HTMLInputElement>(null);
  return (
    <Modal label={`Change ${what} logo`} onClose={onClose} footer={<>
      <Button kind="secondary" onClick={onClose}>Cancel</Button>
      <Button kind="primary" onClick={() => onSave(img)}>Update Logo</Button>
    </>}>
      <div className={s.pick}>
        <span className={`${s.bigSq} ${img ? s.logoImg : ""}`} style={img ? ({ "--art": `url(${img})` } as CSSProperties) : undefined}>{!img && <Icon name={icon} />}</span>
        <Stack row gap={3}>
          <input ref={file} className={s.upload} type="file" accept="image/*" aria-label={`Upload a ${what} logo`}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setImg(URL.createObjectURL(f)); e.target.value = ""; }} />
          <Button kind="ghost" icon="upload" onClick={() => file.current?.click()}>Upload</Button>
          <Button kind="ghost" icon="close" onClick={() => setImg("")}>Remove</Button>
        </Stack>
      </div>
    </Modal>
  );
}

/* A labelled checkbox (the table's row-select box, Phase 1 .tbl-cb): a button, never a native input. */
function CheckRow({ on, label, onChange }: { on: boolean; label: string; onChange: (on: boolean) => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} className={s.chk} onClick={() => onChange(!on)}>
      <span className={`${s.cb} ${on ? s.cbOn : ""}`}>{on && <Icon name="check" />}</span>
      <Text role="body" as="span">{label}</Text>
    </button>
  );
}

/* The Profile's "Interview scenes" (Phase 1 .scv-row): a carousel of 240px cards, each a
   3:4 still with a play disc, the time and a share disc (top right), the title and the
   agent; the heading carries the previous / next arrows, which scroll the row. */
function ScenesCarousel() {
  const row = useRef<HTMLDivElement>(null);
  const go = (dir: number) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <Section kind="block">
      <SectionHeader title="Interview scenes" actions={
        <Stack row gap={3}>
          <button className={s.scvCh} aria-label="Previous scenes" onClick={() => go(-1)}><Icon name="chevLeft" /></button>
          <button className={s.scvCh} aria-label="Next scenes" onClick={() => go(1)}><Icon name="chevRight" /></button>
        </Stack>
      } />
      <div className={s.scvRow} ref={row}>
        {PF_SCENES.map(([at, title]) => (
          <div key={title} className={s.scv}>
            <span className={s.scvArt}>
              <span className={`${t.still} ${s.scvStill}`} style={{ "--still": `url(${SCENE_STILL})` } as CSSProperties}>
                <span className={t.play}><Icon name="play" /></span>
                <Text role="caption" as="span" className={`${t.len} ${t.lenScv}`}>{at}</Text>
              </span>
              <ShareMenu />
            </span>
            <Text role="h4" as="span">{title}</Text>
            <span className={s.att}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PEOPLE.priya.img} alt="" />
              <Text role="caption" as="span">Talent Agent: Priya Nair</Text>
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CvSection({ title, editing, acts, pen, view, form }: {
  title: string; editing: boolean; acts: React.ReactNode; pen: React.ReactNode; view: React.ReactNode; form: React.ReactNode;
}) {
  return (
    <Section>
      <SectionHeader title={title} actions={editing ? acts : pen} />
      {editing ? <div>{form}</div> : <div className={s.cv}>{view}</div>}
    </Section>
  );
}

/* A CV row: the entry's logo, or the section's icon when it has none. */
function CvRow({ icon, art, title, sub, sub2 }: { icon: "work" | "book" | "certificate"; art?: string; title: string; sub: string; sub2?: string }) {
  return (
    <div className={s.cvRow}>
      <span className={s.cvArt} style={art ? ({ "--art": `url(${art})` } as CSSProperties) : undefined}>{!art && <Icon name={icon} />}</span>
      <span className={s.cvB}>
        <Text role="h4" as="span">{title}</Text>
        <Text role="desc" as="span">{sub}</Text>
        {sub2 && <Text role="desc" as="span">{sub2}</Text>}
      </span>
    </div>
  );
}

/* Skills edit the page's draft list (`list` is the draft while editing), so Discard puts them back. */
function Skills({ editing, list, setList, acts, pen }: {
  editing: boolean; list: string[]; setList: React.Dispatch<React.SetStateAction<string[]>>; acts: React.ReactNode; pen: React.ReactNode;
}) {
  const [adding, setAdding] = useState("");
  const add = () => { const v = adding.trim(); if (v && !list.includes(v)) setList((l) => [...l, v]); setAdding(""); };
  return (
    <Section>
      <SectionHeader title="Skills" actions={editing ? acts : pen} />
      <Chips>
        {list.map((k) => (
          <Chip key={k}>
            {k}
            {editing && <button aria-label={`Remove ${k}`} onClick={() => setList((l) => l.filter((x) => x !== k))}><Icon name="close" /></button>}
          </Chip>
        ))}
      </Chips>
      {editing && (
        <Stack row gap={3}>
          <Input value={adding} placeholder="Add a skill" onChange={(e) => setAdding(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} />
          <Button kind="link" icon="add" onClick={add}>Add</Button>
        </Stack>
      )}
    </Section>
  );
}

/* The photo picker: Profile Image (upload / remove) and Avatar (ten discs). */
function PhotoSheet({ current, onClose, onSave }: { current: string; onClose: () => void; onSave: (p: string) => void }) {
  const [tab, setTab] = useState("img");
  const [img, setImg] = useState<string | null>(current);
  const [av, setAv] = useState(AVATARS[0]);
  const file = useRef<HTMLInputElement>(null);
  return (
    <Modal label="Change photo" onClose={onClose} footer={<>
      <Button kind="secondary" onClick={onClose}>Cancel</Button>
      <Button kind="primary" onClick={() => onSave(tab === "img" ? (img ?? current) : av)}>{tab === "img" ? "Update Photo" : "Update Avatar"}</Button>
    </>}>
      <Tabs value={tab} onChange={setTab} items={[{ key: "img", label: "Profile Image" }, { key: "av", label: "Avatar" }]} />
      <div className={s.pick}>
        {tab === "img" ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {img ? <img className={s.big} src={img} alt="" /> : <span className={s.bigEmpty}><Icon name="image" /></span>}
            <Stack row gap={3}>
              <input ref={file} className={s.upload} type="file" accept="image/*" aria-label="Upload a photo"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setImg(URL.createObjectURL(f)); }} />
              <Button kind="ghost" icon="upload" onClick={() => file.current?.click()}>Upload</Button>
              <Button kind="ghost" icon="close" onClick={() => setImg(null)}>Remove</Button>
            </Stack>
          </>
        ) : (
          <div className={s.avs}>
            {AVATARS.map((a) => (
              <button key={a} className={`${s.av} ${a === av ? s.on : ""}`} aria-pressed={a === av} onClick={() => setAv(a)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ---------------- Linked Accounts ---------------- */
function Linked() {
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(SOCIAL.map((x) => [x.k, x.linked])));
  return (
    <Section kind="block">
      <SectionHeader title="Linked accounts" desc="Connect your social accounts to display them on your TALENTnext profile. Select an account to connect or disconnect it." />
      <div className={s.lacc}>
        {SOCIAL.map((x) => (
          <button key={x.k} className={s.la} style={{ "--brand": x.color } as CSSProperties} onClick={() => setOn((o) => ({ ...o, [x.k]: !o[x.k] }))}>
            <span className={s.laMk} dangerouslySetInnerHTML={{ __html: x.svg }} />
            <span className={s.laB}>
              <Text role="h4" as="span">{x.n}</Text>
              <Text role="desc" as="span">{on[x.k] ? x.handle : "Not connected"}</Text>
            </span>
            {on[x.k] ? <Text role="label" as="span" className={s.linked}>Linked</Text> : <Text role="label" as="span" ink="accent">Link account</Text>}
          </button>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- My Courses ---------------- */
function Courses() {
  return (
    <Section>
      <SectionHeader title="My courses" />
      {/* The course figures run the full column (Maryam 16 Oct 2026). */}
      <Accordion full items={MY_COURSES.map((c) => ({
        title: c.name, sub: c.status,
        body: (
          <Stats>
            <Stat icon="book" label="Chapters done" value={String(c.done)} of="of 13" desc={`${Math.round((c.done / 13) * 100)}%`} />
            <Stat icon="chart" label="Assessment average" value={c.avg ? `${c.avg}%` : "Not yet"} desc={c.avg ? "Course average 79%" : "Nothing assessed yet"} />
            <Stat icon="time" label="Time invested" value={`${Math.floor(c.mins / 60)}h ${c.mins % 60}m`} desc={c.done ? `${Math.round(c.mins / c.done)} min per chapter` : "Not started"} />
            <Stat icon="flag" label="Tasks on time" value={c.tasks.split(" of ")[0]} of={`of ${c.tasks.split(" of ")[1]}`} desc={c.tasksSub} />
          </Stats>
        ),
      }))} />
    </Section>
  );
}

/* ---------------- Notifications ---------------- */
function Notifications() {
  return (
    <>
      <Section>
        <SectionHeader title="Email Notifications" />
        {EMAIL_TOGGLES.map(([title, desc]) => <ToggleRow key={title} title={title} desc={desc} />)}
      </Section>
      <Section>
        <SectionHeader title="Always On" desc="Essential updates on payments, levels and bookings. These notifications cannot be turned off." />
        {ALWAYS_ON.map(([title, desc]) => (
          <div key={title} className={s.srow}><span className={s.srowB}><Text role="h4" as="span">{title}</Text><Text role="desc" as="span">{desc}</Text></span></div>
        ))}
      </Section>
    </>
  );
}

/* ---------------- Privacy Settings ----------------
   No "Legal & Data Use" section in Phase 0 (Maryam 19 Oct 2026). The notices stay
   at /auth/terms/, which the sign-up consent links to. */
function Privacy() {
  const { setUi } = useDemo();
  const [pw, setPw] = useState(false);
  const [del, setDel] = useState(false);
  return (
    <>
      <Section>
        <SectionHeader title="Sign-In & Security" />
        <div className={s.srow}>
          <span className={s.srowB}><Text role="h4" as="span">Email Address</Text><Text role="body" as="span">{PF.general.email}</Text><Text role="desc" as="span">Your sign-in email. Manage your account details under My Profile.</Text></span>
        </div>
        <div className={s.srow}>
          <span className={s.srowB}><Text role="h4" as="span">Password</Text><Text role="desc" as="span">Last changed 08/14/2026</Text></span>
          {!pw && <Button kind="ghost" size="sm" onClick={() => setPw(true)}>Reset Password</Button>}
        </div>
        {pw && (
          <div className={s.pwForm}>
            <Form>
              <Field label="Current password"><Input type="password" /></Field>
              <FormRow>
                <Field label="New password"><Input type="password" /></Field>
                <Field label="Confirm new password"><Input type="password" /></Field>
              </FormRow>
              <Stack row gap={3}>
                <Button kind="secondary" onClick={() => setPw(false)}>Cancel</Button>
                <Button kind="primary" onClick={() => setPw(false)}>Update Password</Button>
              </Stack>
            </Form>
          </div>
        )}
      </Section>
      <Section>
        <SectionHeader title="Closing Your Account" />
        {/* The words left, the button at the right end of the row (Maryam 16 Oct 2026; Phase 1 .close-b). */}
        <div className={s.closeB}>
          <Text role="body" ink="secondary" className={s.closeX}>Deleting your account removes your profile, notes, and interview recordings.</Text>
          <Button kind="dangerInk" onClick={() => setDel(true)}>Delete My Account</Button>
        </div>
      </Section>
      {del && (
        <Confirm icon="delete" danger title="Delete your account?" ok="Delete My Account"
          desc="Your profile, notes and interview recordings will be removed. This cannot be undone."
          onCancel={() => setDel(false)} onOk={() => { setDel(false); setUi({ logout: true }); }} />
      )}
    </>
  );
}
