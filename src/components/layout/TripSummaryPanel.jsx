import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Counter } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTripStore, useSummary, useIsDirty } from '@/store/tripStore';
import { tours } from '@/data/tours';
import { packages } from '@/data/packages';
import { cn } from '@/utils/cn';

const toursById = new Map(tours.map((t) => [t.id, t]));
const packagesById = new Map(packages.map((p) => [p.id, p]));
const COLLAPSED_KEY = 'rawaan-trip-summary-collapsed';

function readCollapsed() {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(COLLAPSED_KEY) === '1';
}

// Global floating Trip Summary (V7) — mounted once in the app shell (App.jsx,
// outside <Routes>, alongside the persistent Footer) so it survives
// navigation rather than remounting per page.
//
// Hidden entirely on /build: the planner already surfaces this same data
// contextually per step (StepExperiences' live count/cost, StepReview's own
// Trip Summary block), and /build's sticky Back/Next footer already claims
// the bottom of the viewport — docking or offsetting the floating panel on
// top of that would fight the same screen real estate for information the
// user is already looking at. Every other route gets it.
export function TripSummaryPanel() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const isDirty = useIsDirty();
  const summary = useSummary();
  const state = useTripStore((s) => s);
  const reset = useTripStore((s) => s.reset);

  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  if (pathname === '/build') return null;

  const base = state.baseTourId ? toursById.get(state.baseTourId) ?? packagesById.get(state.baseTourId) : null;
  const destinationLabel = state.destination.length ? state.destination.join(', ') : 'Not set';

  const handleContinue = () => navigate('/build');
  const handleClear = () => {
    if (!confirmingClear) return setConfirmingClear(true);
    reset();
    setConfirmingClear(false);
  };

  const panelVariants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 24 } };
  const transition = { duration: reduced ? 0 : 0.25 };

  return (
    <AnimatePresence>
      {isDirty && (
        <motion.aside
          role="complementary"
          aria-label="Trip summary"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
          transition={transition}
          className="fixed inset-x-0 bottom-0 z-40 md:inset-x-auto md:bottom-6 md:right-6"
        >
          {/* Desktop — bottom-right card, collapsible to a compact pill. */}
          <div className="hidden md:block">
            {collapsed ? (
              <button
                type="button"
                aria-expanded={false}
                onClick={() => setCollapsed(false)}
                className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 shadow-md transition-shadow hover:shadow-lg"
              >
                <span className="font-sans text-sm font-medium text-navy">Your trip</span>
                <span aria-live="polite" className="font-sans text-sm font-medium text-cyan-deep">
                  <Counter value={summary.estimatedCost} prefix="$" duration={0.6} />
                </span>
                <ChevronUp size={16} strokeWidth={2} aria-hidden="true" className="text-slate" />
              </button>
            ) : (
              <div className="w-80 rounded-2xl border border-line bg-white p-5 shadow-md">
                <PanelBody
                  summary={summary}
                  base={base}
                  destinationLabel={destinationLabel}
                  onCollapse={() => setCollapsed(true)}
                  onContinue={handleContinue}
                  onClear={handleClear}
                  confirmingClear={confirmingClear}
                  onCancelClear={() => setConfirmingClear(false)}
                />
              </div>
            )}
          </div>

          {/* Mobile — compact bottom bar that expands into a sheet. */}
          <div className="md:hidden">
            {collapsed ? (
              <button
                type="button"
                aria-expanded={false}
                onClick={() => setCollapsed(false)}
                className="flex min-h-11 w-full items-center justify-between border-t border-line bg-white px-4 py-3 shadow-md"
              >
                <span className="font-sans text-sm text-navy">
                  {summary.experienceCount} experience{summary.experienceCount === 1 ? '' : 's'} ·{' '}
                  <span aria-live="polite" className="font-medium text-cyan-deep">
                    <Counter value={summary.estimatedCost} prefix="$" duration={0.6} />
                  </span>
                </span>
                <ChevronUp size={18} strokeWidth={2} aria-hidden="true" className="shrink-0 text-slate" />
              </button>
            ) : (
              <div className="max-h-[70svh] overflow-y-auto rounded-t-2xl border-t border-line bg-white p-5 shadow-md">
                <PanelBody
                  summary={summary}
                  base={base}
                  destinationLabel={destinationLabel}
                  onCollapse={() => setCollapsed(true)}
                  onContinue={handleContinue}
                  onClear={handleClear}
                  confirmingClear={confirmingClear}
                  onCancelClear={() => setConfirmingClear(false)}
                />
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PanelBody({ summary, base, destinationLabel, onCollapse, onContinue, onClear, confirmingClear, onCancelClear }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-h3 text-navy">Your trip</h2>
        <button
          type="button"
          aria-expanded
          aria-label="Collapse trip summary"
          onClick={onCollapse}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate hover:bg-mist hover:text-navy"
        >
          <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <dl className="flex flex-col gap-1.5 text-small">
        {base && (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate">Based on</dt>
            <dd className="font-medium text-navy">{base.name}</dd>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate">Destination</dt>
          <dd className="text-right font-medium text-navy">{destinationLabel}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate">Nights</dt>
          <dd className="font-medium text-navy">{summary.nights}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate">Travelers</dt>
          <dd className="font-medium text-navy">{summary.travelers}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate">Experiences</dt>
          <dd className="font-medium text-navy">{summary.experienceCount}</dd>
        </div>
      </dl>

      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <span className="label text-slate">Estimated cost</span>
        <span aria-live="polite" className="font-display text-h3 text-cyan-deep">
          <Counter value={summary.estimatedCost} prefix="$" duration={0.6} />
        </span>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-6 font-sans text-sm font-medium text-navy transition-colors duration-300 hover:bg-cyan-deep hover:text-white"
      >
        Continue planning
      </button>

      {confirmingClear ? (
        <div className="flex items-center justify-between gap-2 text-small">
          <span className="text-slate">Clear this trip?</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onCancelClear} className="text-slate hover:text-navy">
              Cancel
            </button>
            <button type="button" onClick={onClear} className="font-medium text-red-600 hover:underline">
              Clear
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onClear}
          className={cn('inline-flex items-center justify-center gap-1.5 text-small text-slate hover:text-red-600')}
        >
          <X size={14} strokeWidth={2} aria-hidden="true" />
          Clear trip
        </button>
      )}
    </div>
  );
}
