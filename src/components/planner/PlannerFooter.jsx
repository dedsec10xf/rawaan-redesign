import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/primitives';
import { cn } from '@/utils/cn';

const NEXT_HELPER_ID = 'planner-next-helper';

// Back/Next at the panel foot — sticky to the viewport bottom on mobile
// (per CLAUDE.md's mobile call) since a 5-step form's primary actions
// shouldn't require scrolling back down past the whole panel; static on
// desktop where the panel already sits above the fold.
//
// Next uses aria-disabled rather than the native `disabled` attribute
// whenever there's a helperText reason: a natively-disabled button is
// pulled out of the tab order, so a screen reader user tabbing through the
// form would never reach it and would never hear why it's blocked. Staying
// focusable + aria-describedby'd to the reason means the explanation is
// always reachable, not just visible to sighted users. The click handler
// stays guarded by canGoNext regardless (Build.jsx's handleNext no-ops when
// invalid), so aria-disabled never lets the step actually advance early.
export function PlannerFooter({ onBack, onNext, canGoBack, canGoNext, nextLabel = 'Next', helperText }) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-20 -mx-4 mt-10 border-t border-line bg-white/95 px-4 py-4 shadow-sm backdrop-blur',
        'sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={onBack}
          disabled={!canGoBack}
          className="disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </Button>
        <div className="flex flex-col items-end gap-1">
          <Button
            onClick={onNext}
            aria-disabled={!canGoNext}
            aria-describedby={helperText ? NEXT_HELPER_ID : undefined}
            icon={ArrowRight}
            className={cn(!canGoNext && 'cursor-not-allowed opacity-40 hover:bg-accent')}
          >
            {nextLabel}
          </Button>
          {/* aria-live so the reason updates get announced as fields change,
              not just when focus happens to land here. */}
          <div aria-live="polite">
            {helperText && (
              <p id={NEXT_HELPER_ID} className="text-small text-slate">
                {helperText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
