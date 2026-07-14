import { useId } from 'react';
import { cn } from '@/utils/cn';

// Free-text field (planner step 4's "Additional instructions") — same field
// chrome as Select/DateRange (rounded-xl border border-line bg-white), just
// multi-line and no native affordance to layer on top of.
//
//   <Textarea label="Additional instructions" value={notes} onChange={setNotes} />
export function Textarea({ label, value, onChange, placeholder, rows = 4, id, className }) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="label text-slate">
        {label}
      </label>
      <textarea
        id={fieldId}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-line bg-white p-4 font-sans text-body text-navy placeholder:text-slate/60"
      />
    </div>
  );
}
