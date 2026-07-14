import { useId } from 'react';
import { Stepper } from '@/components/ui';
import { useTripStore } from '@/store/tripStore';
import { destinations } from '@/data/destinations';
import { StepIntro } from './StepIntro';

const destinationsById = new Map(destinations.map((d) => [d.id, d]));
const FIELD = 'min-h-11 w-full max-w-xs rounded-xl border border-line bg-white px-4 font-sans text-body text-navy';

// Step 2 — Travellers. Guests shapes which vehicles fit (Step 3) and how
// many rooms you'll need (Step 5); nights and departure date shape every
// per-night line in the summary. dates.start IS the departure date field —
// no separate store field for it.
export function StepTravellers() {
  const dateId = useId();
  const destinationId = useTripStore((s) => s.destinationId);
  const groupSize = useTripStore((s) => s.groupSize);
  const nights = useTripStore((s) => s.nights);
  const dates = useTripStore((s) => s.dates);
  const setField = useTripStore((s) => s.setField);
  const setNights = useTripStore((s) => s.setNights);

  const destination = destinationsById.get(destinationId);
  const nightsLabel = destination ? `Nights in ${destination.name}` : 'Nights at your destination';

  return (
    <div>
      <StepIntro
        number={2}
        name="Travellers"
        heading="Who's coming, and for how long?"
        copy="Your group size decides which vehicle actually fits everyone and how many rooms we book — get this right first and every price after it stays accurate."
      />

      <div className="flex flex-col gap-8">
        <Stepper label="Guests" value={groupSize} onChange={(v) => setField('groupSize', v)} min={1} max={20} />
        <Stepper label={nightsLabel} value={nights} onChange={setNights} min={1} max={21} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor={dateId} className="label text-slate">
            Departure date
          </label>
          <input
            id={dateId}
            type="date"
            value={dates.start ?? ''}
            onChange={(e) => setField('dates', { ...dates, start: e.target.value })}
            className={FIELD}
          />
        </div>
      </div>
    </div>
  );
}
