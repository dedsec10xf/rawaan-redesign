import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { STEPS } from './steps';

// Sticky step rail — 7 pills in one horizontally-scrollable row at every
// breakpoint (not a separate mobile text-indicator mode): it always fits on
// desktop and scrolls on mobile, so there's one implementation instead of
// two. `top-16` approximates the Header's rendered height (py-4 + logo
// line-height, no exact px available without measuring it) — close enough
// that the rail sits flush under it without a gap or overlap.
//
//   <StepRail current={3} validity={[true,true,false,true,false,false,false]} visited={new Set([1,2,3])} onSelect={setStep} />
export function StepRail({ current, validity, visited, onSelect }) {
  const completedCount = validity.filter(Boolean).length;
  const progressPct = (completedCount / STEPS.length) * 100;

  const isClickable = (step) => {
    if (visited.has(step.id)) return true;
    // Reachable without having visited it yet if every step before it is
    // already valid (e.g. deep-linking in with a fully pre-filled store).
    return validity.slice(0, step.id - 1).every(Boolean);
  };

  return (
    <nav aria-label="Journey steps" className="sticky top-16 z-30 border-b border-line bg-white/95 shadow-sm backdrop-blur">
      <div className="container-editorial py-4">
        <ol className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {STEPS.map((step) => {
            const isCurrent = step.id === current;
            const isDone = validity[step.id - 1] && step.id !== current;
            const clickable = isClickable(step);
            return (
              <li key={step.id} className="shrink-0">
                <button
                  type="button"
                  disabled={!clickable}
                  aria-current={isCurrent ? 'step' : undefined}
                  onClick={() => onSelect(step.id)}
                  className={cn(
                    'flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-1.5 font-sans text-sm font-medium transition-colors duration-200',
                    isCurrent && 'border-accent bg-accent text-navy',
                    isDone && !isCurrent && 'border-accent bg-accent/15 text-cyan-deep',
                    !isCurrent && !isDone && 'border-line text-slate',
                    clickable ? 'cursor-pointer hover:border-navy/40' : 'cursor-not-allowed opacity-40',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                      isCurrent && 'bg-navy text-white',
                      isDone && !isCurrent && 'bg-cyan-deep text-white',
                      !isCurrent && !isDone && 'border border-line text-slate',
                    )}
                  >
                    {isDone && !isCurrent ? <Check size={12} strokeWidth={3} /> : step.id}
                  </span>
                  {step.label}
                </button>
              </li>
            );
          })}
        </ol>

        <div aria-hidden="true" className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </nav>
  );
}
