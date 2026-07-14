import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Counter } from '@/components/primitives';
import { useTripStore, useSummary } from '@/store/tripStore';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { destinations } from '@/data/destinations';
import { formatAmountPKR, pkrToUsd } from '@/lib/currency';
import { cn } from '@/utils/cn';
import { BreakdownRows } from './BreakdownRows';

const destinationsById = new Map(destinations.map((d) => [d.id, d]));

// The builder's centrepiece — sticky on every step (desktop: right column;
// mobile: bottom bar that expands to a sheet), so the price feels alive as
// choices are made rather than something you only see at the end. Every
// amount is PKR-native from tripStore's breakdown; the currency toggle here
// is the ONE place PKR<->USD conversion is user-facing (lib/currency does
// the actual math).
//
//   <SummaryCard onContinue={handleNext} canContinue continueLabel="Continue" />
export function SummaryCard({ onContinue, canContinue, continueLabel = 'Continue', continueHelper, hideContinue }) {
  const summary = useSummary();
  const destinationId = useTripStore((s) => s.destinationId);
  const currency = useTripStore((s) => s.currency);
  const setField = useTripStore((s) => s.setField);
  const reduced = usePrefersReducedMotion();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const destination = destinationsById.get(destinationId);
  const { items, totalPKR, perPersonPKR } = summary.breakdown;
  const totalDisplay = currency === 'USD' ? pkrToUsd(totalPKR) : totalPKR;
  const totalPrefix = currency === 'USD' ? '$' : 'Rs ';

  const body = (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-h3 text-navy">Your trip</h2>
        <div role="group" aria-label="Currency" className="flex rounded-full border border-line p-0.5">
          {['PKR', 'USD'].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={currency === c}
              onClick={() => setField('currency', c)}
              className={cn(
                'rounded-full px-3 py-1 font-sans text-xs font-medium transition-colors',
                currency === c ? 'bg-accent text-navy' : 'text-slate hover:text-navy',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {destination && (
        <span className="label w-fit rounded-full bg-accent/10 px-3 py-1 text-cyan-deep">
          {destination.name.toUpperCase()} · {summary.dayCount}D/{summary.nights}N
        </span>
      )}

      <BreakdownRows items={items} currency={currency} />

      <div className="rounded-xl bg-navy p-4 text-white">
        <div aria-live="polite" className="flex items-baseline justify-between gap-3">
          <span className="label text-white/70">Total</span>
          <span className="font-display text-h3 text-white">
            <Counter value={totalDisplay} prefix={totalPrefix} duration={0.6} />
          </span>
        </div>
        <p className="mt-1 text-small text-white/70">
          ≈ {formatAmountPKR(perPersonPKR, currency)} per person · {summary.travelers} guest{summary.travelers === 1 ? '' : 's'}
        </p>
      </div>

      {!hideContinue && (
        <div className="flex flex-col gap-1">
          <Button onClick={onContinue} aria-disabled={!canContinue} className={cn('w-full', !canContinue && 'cursor-not-allowed opacity-40')}>
            {continueLabel}
          </Button>
          {continueHelper && <p className="text-center text-small text-slate">{continueHelper}</p>}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop — sticky right column */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-line bg-white p-6 shadow-sm">{body}</div>
      </div>

      {/* Mobile/tablet — sticky bottom bar that expands to a sheet */}
      <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
        <button
          type="button"
          aria-expanded={mobileExpanded}
          onClick={() => setMobileExpanded((v) => !v)}
          className="flex min-h-11 w-full items-center justify-between border-t border-line bg-white px-4 py-3 shadow-md"
        >
          <span className="font-sans text-sm text-navy">
            {destination ? `${destination.name} · ` : ''}
            {summary.experienceCount} experience{summary.experienceCount === 1 ? '' : 's'}
          </span>
          <span className="flex items-center gap-2">
            <span aria-live="polite" className="font-display text-h3 text-cyan-deep">
              <Counter value={totalDisplay} prefix={totalPrefix} duration={0.6} />
            </span>
            {mobileExpanded ? (
              <ChevronDown size={18} strokeWidth={2} aria-hidden="true" className="text-slate" />
            ) : (
              <ChevronUp size={18} strokeWidth={2} aria-hidden="true" className="text-slate" />
            )}
          </span>
        </button>
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              className="max-h-[70svh] overflow-y-auto border-t border-line bg-white shadow-md"
            >
              <div className="p-5">{body}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
