"use client";
import { useMemo, useState } from "react";
import { Section, SectionHeader, Stack } from "../primitives";
import { Button } from "../ui/Button";
import { KV } from "../ui/KV";
import { Field, Form } from "../ui/Field";
import { SearchDropdown } from "../ui/Dropdown";
import { Confirm } from "../ui/Confirm";
import { zoneOptions, tzLabel, tzOffsetMin, deviceTz } from "@/data/agent";

/* ============================================================
   TIME ZONE on the candidate's My Profile (Maryam 24 Nov 2026: "the way we have implemented
   time zone on the talent agent portal settings, I want it to be a selection on the candidate
   portal as well"). The same behaviour as the agent's WorkWeekSection, zone only — a candidate
   has no working hours:
   - read view: one kv row with the zone and its UTC offset, a pencil to edit;
   - edit view: the SAME typeable SearchDropdown (type a city, region or offset; clicking keeps
     the current text), Discard / Save in the heading row;
   - THE DEVICE CHECK: saving a CHANGED zone whose offset differs from the device's opens a
     non-blocking confirmation naming both. The candidate can keep any zone.
   Agents' open times and every booking are shown to the candidate in this zone.
   ============================================================ */
/* The page owns the edit state (24 Nov 2026): only one profile section is in edit at a time, so
   `draft` is null when this section is shut and the zone being chosen while it is open. */
export function TimeZoneSection({ tz, onChange, draft, setDraft, onEdit }: {
  tz: string; onChange: (tz: string) => void; draft: string | null; setDraft: (z: string | null) => void; onEdit: () => void;
}) {
  const zones = useMemo(() => zoneOptions(), []);
  const [ask, setAsk] = useState<{ device: string } | null>(null);

  const commit = (z: string) => { onChange(z); setDraft(null); setAsk(null); };
  const save = () => {
    if (draft === null) return;
    const device = deviceTz();
    const differs = !!device && tzOffsetMin(device) !== tzOffsetMin(draft);
    if (draft !== tz && differs) setAsk({ device });
    else commit(draft);
  };

  return (
    <Section>
      <SectionHeader title="Time Zone" desc="Agents' open times and your bookings are shown in this time zone."
        actions={draft !== null ? (
          <Stack row gap={3}>
            <Button kind="secondary" icon="delete" onClick={() => setDraft(null)}>Discard Changes</Button>
            <Button kind="primary" icon="check" onClick={save}>Save Changes</Button>
          </Stack>
        ) : <Button kind="ghost" size="sm" icon="edit" label="Edit time zone" onClick={onEdit} />} />
      {draft !== null ? (
        <Form>
          <Field label="Time zone"><SearchDropdown label="Time zone" value={draft} onChange={setDraft} options={zones}
            placeholder="Type a city, region or UTC offset" empty="No time zone matches. Try a city name." /></Field>
        </Form>
      ) : (
        <KV rows={[["Time zone", tzLabel(tz)]]} />
      )}
      {ask && draft !== null && (
        <Confirm icon="time" title="Confirm your time zone"
          desc={<>Your device is set to <b>{tzLabel(ask.device)}</b>. Agents&apos; open times and your bookings will show in <b>{tzLabel(draft)}</b>. Continue if that is your time zone.</>}
          ok="Keep This Time Zone" onCancel={() => setAsk(null)} onOk={() => commit(draft)} />
      )}
    </Section>
  );
}
