import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExperienceCard, Chip } from '@/components/ui';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTripStore, useSummary } from '@/store/tripStore';
import { formatAmountPKR } from '@/lib/currency';
import { experiences } from '@/data/experiences';
import { tours } from '@/data/tours';
import { packages } from '@/data/packages';
import { StepIntro } from './StepIntro';

const toursById = new Map(tours.map((t) => [t.id, t]));
const packagesById = new Map(packages.map((p) => [p.id, p]));
const CATEGORIES = [...new Set(experiences.map((e) => e.category))];

// The base tour/package's OWN included experiences — used only to label
// which selected cards came pre-ticked from loadTour/loadPackage vs. were
// added by the user. tripStore doesn't keep this set separately once loaded
// (selectedExperienceIds is the single mutable list), so it's re-derived
// here from the data files by baseTourId, the same way tripStore itself
// computed it at load time.
function useIncludedExperienceIds() {
  const baseTourId = useTripStore((s) => s.baseTourId);
  return useMemo(() => {
    if (!baseTourId) return new Set();
    const tour = toursById.get(baseTourId);
    if (tour) return new Set(tour.includedExperienceIds);
    const pkg = packagesById.get(baseTourId);
    if (!pkg) return new Set();
    const includedTours = pkg.includes.map((id) => toursById.get(id)).filter(Boolean);
    return new Set(includedTours.flatMap((t) => t.includedExperienceIds));
  }, [baseTourId]);
}

// Step 6 — Experiences. Renders the SAME ExperienceCard used on the
// homepage's Local Experiences section AND the tour detail page (imported,
// not copied) in the SAME mode="toggle" — selection reads and writes
// tripStore directly inside the card. The per-person/total price line is
// rendered OUTSIDE ExperienceCard (in this step's own wrapper), the same
// pattern already used for the "Included with your tour" chip below — that
// keeps ExperienceCard itself surface-agnostic (the homepage section and
// TourDetail have no groupSize context to show a "total for the group"
// figure against) rather than baking planner-specific pricing into a
// component three different surfaces share.
export function StepExperiences() {
  const [category, setCategory] = useState(null);
  const reduced = usePrefersReducedMotion();
  const selectedIds = useTripStore((s) => s.selectedExperienceIds);
  const groupSize = useTripStore((s) => s.groupSize);
  const currency = useTripStore((s) => s.currency);
  const includedIds = useIncludedExperienceIds();
  const { experienceCount } = useSummary();

  const filtered = useMemo(
    () => (category == null ? experiences : experiences.filter((e) => e.category === category)),
    [category],
  );

  const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.06 } } };
  const cardVariants = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  return (
    <div>
      <StepIntro
        number={6}
        name="Experiences"
        heading="What do you want to add?"
        copy="These aren't things you could book yourself online — every one of these runs on relationships our team has built locally, over years."
      />

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip variant="toggle" selected={category == null} onToggle={() => setCategory(null)}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} variant="toggle" selected={category === c} onToggle={() => setCategory(category === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
        <p className="label shrink-0 text-cyan-deep">{experienceCount} added</p>
      </div>

      <motion.ul
        role="list"
        initial="hidden"
        animate="visible"
        variants={gridVariants}
        className="mt-6 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((experience) => {
            const isIncluded = includedIds.has(experience.id) && selectedIds.includes(experience.id);
            const totalPKR = (experience.pricePerPersonPKR ?? 0) * Math.max(1, groupSize || 1);
            return (
              <motion.li key={experience.id} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
                <div className="flex flex-col gap-2">
                  {isIncluded && (
                    <Chip size="sm" className="self-start border-accent bg-accent/10 text-cyan-deep">
                      Included with your tour
                    </Chip>
                  )}
                  <ExperienceCard experience={experience} className="h-full" />
                  {experience.pricePerPersonPKR != null && (
                    <p className="text-small text-slate">
                      {formatAmountPKR(experience.pricePerPersonPKR, currency)} / person ·{' '}
                      <span className="font-medium text-navy">{formatAmountPKR(totalPKR, currency)} total</span> for{' '}
                      {groupSize} guest{groupSize === 1 ? '' : 's'}
                    </p>
                  )}
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
