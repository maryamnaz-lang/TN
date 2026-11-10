"use client";
import { useState } from "react";
import { Section, SectionHeader, Stack, Text } from "../primitives";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Dropdown } from "../ui/Dropdown";
import { Icon } from "../Icon";
import { WEEK_SHIFTS, SLOT_DAYS, SLOT_TIMES, slotMin, type Shift } from "@/data/agent";
import s from "./slots.module.css";

/* ============================================================
   AVAILABILITY — on the agent's My Profile, after About (Maryam 19 Oct 2026).
   The agent sets SHIFTS, not single times: a day carries any number of shifts
   (no two-a-day cap since Maryam 10 Nov 2026),
   each a start-to-end window ("9:00 AM – 5:00 PM"), and candidates book
   45-minute interviews inside them. Single start times read wrongly, since
   10:00 and 10:30 on one day overlap a 45-minute call.
   Layout: one white card per weekday that has a shift, three across on a
   desktop page; a card heads with the day and its shift count, then each shift
   as a grey removable block. The heading's "Add Shift" is the one way to add.
   Removing a shift leaves booked interviews alone.
   ============================================================ */
/* The profile may hold the shifts itself (its Visibility toggle needs to know whether any
   exist, Maryam 10 Nov 2026); without them the section keeps its own. */
export function Availability({ shifts: held, setShifts: setHeld }: { shifts?: Shift[]; setShifts?: (v: Shift[] | ((x: Shift[]) => Shift[])) => void } = {}) {
  const [own, setOwn] = useState<Shift[]>(WEEK_SHIFTS);
  const shifts = held ?? own, setShifts = setHeld ?? setOwn;
  const [adding, setAdding] = useState(false);
  const byDay = SLOT_DAYS.map((day) => [day, shifts.filter((x) => x.day === day).sort((a, b) => slotMin(a.start) - slotMin(b.start))] as const);
  const rows = byDay.filter(([, list]) => list.length);
  return (
    <Section>
      <SectionHeader title="Availability" desc="Shifts repeat every week. Removing one keeps interviews already booked."
        actions={<Button kind="link" icon="add" onClick={() => setAdding(true)}>Add Shift</Button>} />
      {rows.length ? (
        <div className={s.grid}>
          {rows.map(([day, list]) => (
            <div key={day} className={s.card}>
              <div className={s.day}>
                <Text role="h4" as="span" strong>{day}</Text>
                <Text role="desc" as="span">{list.length} {list.length === 1 ? "shift" : "shifts"}</Text>
              </div>
              <div className={s.times}>
                {list.map((x) => (
                  <span key={x.id} className={s.time}>
                    <Text role="body" as="span">{x.start} – {x.end}</Text>
                    <button className={s.x} aria-label={`Remove ${day} ${x.start} to ${x.end}`} onClick={() => setShifts(shifts.filter((y) => y.id !== x.id))}><Icon name="close" /></button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : <Text role="desc" as="p">No shifts yet. Add the hours candidates can book you.</Text>}
      {adding && (
        <AddShift shifts={shifts} onClose={() => setAdding(false)} onSave={(day, start, end) => {
          setShifts([...shifts, { id: `${day} ${start}`, day, start, end }]);
          setAdding(false);
        }} />
      )}
    </Section>
  );
}

/* The add-shift dialog: a weekday, then start "to" end. Save stays off, with the reason
   underneath, until the end is after the start, the shift does not overlap one already
   on that day. A day takes any number of shifts (Maryam 10 Nov 2026). */
function AddShift({ shifts, onClose, onSave }: { shifts: Shift[]; onClose: () => void; onSave: (day: string, start: string, end: string) => void }) {
  const onDay = (d: string) => shifts.filter((x) => x.day === d);
  const [day, setDay] = useState(SLOT_DAYS[0]);
  const [start, setStart] = useState("9:00 AM");
  const [end, setEnd] = useState("5:00 PM");
  const opt = (v: string) => ({ value: v, label: v });
  const a = slotMin(start), b = slotMin(end);
  const clash = onDay(day).find((x) => a < slotMin(x.end) && slotMin(x.start) < b);
  const err = b <= a ? "The shift must end after it starts."
    : b - a < 45 ? "A shift must be at least 45 minutes, the length of one interview."
    : clash ? `This overlaps the ${clash.start} – ${clash.end} shift on ${day}.`
    : "";
  return (
    <Modal label="Add a shift" onClose={onClose} footer={
      <>
        <Button kind="secondary" onClick={onClose}>Cancel</Button>
        <Button kind="primary" disabled={!!err} onClick={() => onSave(day, start, end)}>Save Shift</Button>
      </>
    }>
      <Stack gap={5}>
        <Text role="h3">Add a shift</Text>
        <Dropdown variant="form" value={day} onChange={setDay} options={SLOT_DAYS.map(opt)} />
        <div className={s.tm}>
          <Dropdown variant="form" value={start} onChange={setStart} options={SLOT_TIMES.map(opt)} />
          <Text role="desc" as="span">to</Text>
          <Dropdown variant="form" value={end} onChange={setEnd} options={SLOT_TIMES.map(opt)} />
        </div>
        {err && <Text role="label" as="p" className={s.err}>{err}</Text>}
      </Stack>
    </Modal>
  );
}
