import { useId } from 'react';
import { cn } from '@/utils/cn';

// Native <input type="range"> — arrow-key/Home/End keyboard support comes
// free with the element; `accent-cyan` colors the native thumb/track without
// hand-rolling a custom slider. Live $ label mirrors the current value.
//
//   <Slider label="Budget" value={budget} onChange={setBudget} min={500} max={10000} step={100} />
export function Slider({ label, value, onChange, min, max, step = 1, format = (v) => `$${v.toLocaleString()}`, className }) {
  const id = useId();

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="label text-slate">
          {label}
        </label>
        <span className="font-sans text-sm font-medium tabular-nums text-navy">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full accent-cyan"
      />
    </div>
  );
}
