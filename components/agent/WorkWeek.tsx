"use client";
import { useMemo, useState } from "react";
import { Section, SectionHeader, Stack } from "../primitives";
import { Button } from "../ui/Button";
import { KV } from "../ui/KV";
import { Field, Form, FormRow } from "../ui/Field";
import { Dropdown, SearchDropdown } from "../ui/Dropdown";
import { Confirm } from "../ui/Confirm";
import { zoneOptions, WORK_DAYS, WORK_TIMES, slotMin, tzLabel, tzOffsetMin, deviceTz, type WorkWeek } from "@/data/agent";
import s from "./agent.module.css";

/* ============================================================
   TIME ZONE & WORKING HOURS (Maryam 20 Nov 2026), on the agent's My Profile, above the
   Outlook connection. Each agent sets their own zone, working days and working hours; once
   the calendar is connected, their open times are read inside these, in this zone.
   Read view: a kv of the three. Edit view: the zone (our dropdown), the days as toggle pills
   (at least one), and the hours as a start and an end (the end after the start).

   THE DEVICE CHECK. When the agent saves a zone that is not the one their device reports
   (compared by the offset NOW, so US Eastern and Canada Eastern count as the same), a
   confirmation names both and asks them to confirm. It never blocks: they can keep any zone,
   since an agent may be travelling or work to another region's hours. It asks only when the
   zone is CHANGED to one that differs, never on every save of their hours.
   ============================================================ */
const opts = (xs: string[]) => xs.map((x) => ({ value: x, label: x }));

/* "Monday to Friday" for a run of three or more days, else "Mon, Wed, Fri". */
function daysLabel(days: string[]) {
  const idx = WORK_DAYS.map((d, i) => (days.includes(d) ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return "None";
  const run = idx.every((v, i) => !i || v === idx[i - 1] + 1);
  if (run && idx.length >= 3) return `${WORK_DAYS[idx[0]]} to ${WORK_DAYS[idx[idx.length - 1]]}`;
  return idx.map((i) => WORK_DAYS[i].slice(0, 3)).join(", ");
}

export function WorkWeekSection({ week, onChange }: { week: WorkWeek; onChange: (w: WorkWeek) => void }) {
  const [draft, setDraft] = useState<WorkWeek | null>(null);
  /* Every zone, built once: the named ones first, then the rest of the world (typed to find). */
  const zones = useMemo(() => zoneOptions(), []);
  const [ask, setAsk] = useState<{ device: string } | null>(null);
  const timeErr = draft && slotMin(draft.end) <= slotMin(draft.start) ? "The end time must be after the start time." : undefined;
  const ready = !!draft && draft.days.length > 0 && !timeErr;

  const commit = (w: WorkWeek) => { onChange(w); setDraft(null); setAsk(null); };
  const save = () => {
    if (!draft || !ready) return;
    const device = deviceTz();
    const differs = !!device && tzOffsetMin(device) !== tzOffsetMin(draft.tz);
    if (draft.tz !== week.tz && differs) setAsk({ device });
    else commit(draft);
  };
  const toggleDay = (d: string) => draft && setDraft({
    ...draft, days: draft.days.includes(d) ? draft.days.filter((x) => x !== d) : [...draft.days, d],
  });

  return (
    <Section>
      <SectionHeader title="Time Zone & Working Hours" desc="Candidates can book you only inside these hours, shown in their own time zone."
        actions={draft ? (
          <Stack row gap={3}>
            <Button kind="secondary" icon="delete" onClick={() => setDraft(null)}>Discard Changes</Button>
            <Button kind="primary" icon="check" disabled={!ready} onClick={save}>Save Changes</Button>
          </Stack>
        ) : <Button kind="ghost" size="sm" icon="edit" label="Edit time zone and working hours" onClick={() => setDraft({ ...week })} />} />
      {draft ? (
        <Form>
          {/* Type to find a zone by name, city or offset, or scroll (Maryam 20 Nov 2026). */}
          <Field label="Time zone"><SearchDropdown label="Time zone" value={draft.tz} onChange={(tz) => setDraft({ ...draft, tz })} options={zones}
            placeholder="Type a city, region or UTC offset" empty="No time zone matches. Try a city name." /></Field>
          <Field label="Working days" group error={draft.days.length ? undefined : "Choose at least one working day."}>
            <div className={s.ltrs}>
              {WORK_DAYS.map((d) => {
                const on = draft.days.includes(d);
                return (
                  <button key={d} type="button" aria-pressed={on} aria-label={d} className={`${s.ltr} ${on ? s.on : ""}`} onClick={() => toggleDay(d)}>
                    {d.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </Field>
          <FormRow>
            <Field label="Start time"><Dropdown variant="form" value={draft.start} onChange={(start) => setDraft({ ...draft, start })} options={opts(WORK_TIMES)} /></Field>
            <Field label="End time" error={timeErr}><Dropdown variant="form" value={draft.end} onChange={(end) => setDraft({ ...draft, end })} options={opts(WORK_TIMES)} /></Field>
          </FormRow>
        </Form>
      ) : (
        <KV rows={[
          ["Time zone", tzLabel(week.tz)],
          ["Working days", daysLabel(week.days)],
          ["Working hours", `${week.start} to ${week.end}`],
        ]} />
      )}
      {ask && draft && (
        <Confirm icon="time" title="Confirm your time zone"
          desc={<>Your device is set to <b>{tzLabel(ask.device)}</b>. Your working hours and every booking will follow <b>{tzLabel(draft.tz)}</b>. Continue if that is the time zone you work in.</>}
          ok="Keep This Time Zone" onCancel={() => setAsk(null)} onOk={() => commit(draft)} />
      )}
    </Section>
  );
}
