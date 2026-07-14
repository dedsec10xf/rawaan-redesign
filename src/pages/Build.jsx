import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useTripStore } from '@/store/tripStore';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  StepRail,
  StepDestination,
  StepTravellers,
  StepRide,
  StepRoute,
  StepHotels,
  StepExperiences,
  StepReview,
  SummaryCard,
  PlannerFooter,
  STEPS,
  getStepValidity,
  getNextHelper,
  getLandingStep,
} from '@/components/planner';
import { tours } from '@/data/tours';
import { packages } from '@/data/packages';

const toursById = new Map(tours.map((t) => [t.id, t]));
const packagesById = new Map(packages.map((p) => [p.id, p]));

const PANEL_BY_STEP = {
  1: StepDestination,
  2: StepTravellers,
  3: StepRide,
  4: StepRoute,
  5: StepHotels,
  6: StepExperiences,
  7: StepReview,
};

// Directional slide+fade, ≤250ms — Framer owns every transition on this page
// (state UI, per CLAUDE.md's scroll=GSAP/state=Framer rule; there's nothing
// here that needs a scroll reveal). `custom` carries the direction so
// forward/back use mirrored enter/exit offsets.
const panelVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

// Flagship /build page — the 7-step trip builder (Destination · Travellers ·
// Ride · Route · Hotels · Experiences · Review), replacing the old 5-step
// planner entirely. Two columns on desktop (step panel + sticky SummaryCard);
// SummaryCard self-manages its own mobile bottom-bar-to-sheet presentation,
// so this page doesn't need separate mobile layout branching for it.
export default function Build() {
  const baseTourId = useTripStore((s) => s.baseTourId);
  const reset = useTripStore((s) => s.reset);
  const reduced = usePrefersReducedMotion();

  // Landing step is computed once, from whatever the store already holds
  // when this page first mounts ("Customize this trip" / cold visit / a
  // returning visit to an already-complete trip) — not recomputed as the
  // user edits fields inside the page.
  const [step, setStep] = useState(() => getLandingStep(useTripStore.getState()));
  const [visited, setVisited] = useState(() => new Set([getLandingStep(useTripStore.getState())]));
  const [direction, setDirection] = useState(1);

  const validity = useTripStore(useShallow(getStepValidity));
  const currentStepIndex = step - 1;
  const canGoNext = validity[currentStepIndex];

  const base = baseTourId ? toursById.get(baseTourId) ?? packagesById.get(baseTourId) : null;

  const goTo = (nextStep) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
    setVisited((prev) => new Set(prev).add(nextStep));
  };

  const handleBack = () => step > 1 && goTo(step - 1);
  const handleNext = () => step < 7 && canGoNext && goTo(step + 1);

  const Panel = PANEL_BY_STEP[step];
  const nextHelper = getNextHelper(step, validity);
  const nextLabel = step === 6 ? 'Review your trip' : 'Next';

  return (
    <div className="min-h-[80svh] bg-mist pb-24 lg:pb-0">
      <div className="container-editorial py-12 md:py-16">
        <p className="label text-cyan-deep">PLAN YOUR JOURNEY</p>
        {base ? (
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display text-h2 text-navy">Customizing: {base.name}</h1>
            <button
              type="button"
              onClick={reset}
              className="text-small text-slate underline-offset-4 hover:text-cyan-deep hover:underline"
            >
              Start from scratch
            </button>
          </div>
        ) : (
          <>
            <h1 className="mt-3 font-display text-h2 text-navy">Build your journey</h1>
            <p className="mt-2 max-w-prose text-body text-slate">
              Seven short steps — destination, travellers, ride, route, hotels, experiences, and a review you can
              send straight to a Rawaan specialist.
            </p>
          </>
        )}
      </div>

      <StepRail current={step} validity={validity} visited={visited} onSelect={goTo} />

      <div className="container-editorial py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            {/* The panel itself is the white card floating on the page's
                soft mist background — steps used to render straight onto
                that background with no surface of their own, which read as
                one flat "opaque slab" from header to footer instead of a
                card-based UI. */}
            <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={reduced ? undefined : panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="sr-only">{STEPS[currentStepIndex].label}</h2>
                  <Panel goToStep={goTo} />
                </motion.div>
              </AnimatePresence>
            </div>

            {step < 7 && (
              <PlannerFooter
                onBack={handleBack}
                onNext={handleNext}
                canGoBack={step > 1}
                canGoNext={canGoNext}
                nextLabel={nextLabel}
                helperText={nextHelper}
              />
            )}
            {/* Step 7 has no Next — StepReview's own "Send to Rawaan" CTA
                replaces it — but Back still needs to work, so it gets a
                minimal standalone footer instead of PlannerFooter's full
                pair. */}
            {step === 7 && (
              <button
                type="button"
                onClick={handleBack}
                className="mt-10 text-small text-slate underline-offset-4 hover:text-cyan-deep hover:underline"
              >
                ← Back to Experiences
              </button>
            )}
          </div>

          <SummaryCard
            onContinue={handleNext}
            canContinue={canGoNext}
            continueLabel={nextLabel}
            continueHelper={nextHelper}
            hideContinue={step === 7}
          />
        </div>
      </div>
    </div>
  );
}
