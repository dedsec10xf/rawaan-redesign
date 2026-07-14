import { useId } from 'react';
import { cn } from '@/utils/cn';

const FIELD = 'min-h-11 w-full rounded-xl border border-line bg-white px-4 font-sans text-body text-navy';

// Two native <input type="date"> fields — a full custom calendar widget is
// out of scope for this milestone (V6 wires this into the real planner
// step); native date inputs are fully keyboard-operable and don't need any
// of that to be correct today.
//
//   <DateRange label="Dates" value={{ start, end }} onChange={setDates} />
export function DateRange({ label, value, onChange, className }) {
  const startId = useId();
  const endId = useId();

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="label text-slate">{label}</span>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label htmlFor={startId} className="sr-only">
            {label} start
          </label>
          <input
            id={startId}
            type="date"
            value={value.start ?? ''}
            onChange={(e) => onChange({ ...value, start: e.target.value })}
            className={FIELD}
          />
        </div>
        <span aria-hidden="true" className="text-slate">
          –
        </span>
        <div className="flex-1">
          <label htmlFor={endId} className="sr-only">
            {label} end
          </label>
          <input
            id={endId}
            type="date"
            value={value.end ?? ''}
            min={value.start || undefined}
            onChange={(e) => onChange({ ...value, end: e.target.value })}
            className={FIELD}
          />
        </div>
      </div>
    </div>
  );
}
