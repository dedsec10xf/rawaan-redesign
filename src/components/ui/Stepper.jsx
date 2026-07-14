import { useId } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';

const BUTTON =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-navy transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:border-navy';

// −/value/+ counter (group size). Native <button>s, so keyboard/focus
// support is free; min/max clamping happens here so callers can't pass an
// out-of-range value through.
//
//   <Stepper label="Travelers" value={groupSize} onChange={setGroupSize} min={1} max={20} />
export function Stepper({ label, value, onChange, min = 1, max = 20, className }) {
  const id = useId();
  const reduced = usePrefersReducedMotion();

  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span id={id} className="label text-slate">
        {label}
      </span>
      <div role="group" aria-labelledby={id} className="inline-flex items-center gap-4">
        <button type="button" aria-label={`Decrease ${label}`} onClick={dec} disabled={value <= min} className={BUTTON}>
          <Minus size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <motion.span
          key={value}
          initial={reduced ? undefined : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="w-8 text-center font-sans text-body tabular-nums text-navy"
        >
          {value}
        </motion.span>

        <button type="button" aria-label={`Increase ${label}`} onClick={inc} disabled={value >= max} className={BUTTON}>
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
