import { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@/lib/gsap';
import { SectionHeader, Chip, TripCard, Select } from '@/components/ui';
import { Button } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { tours } from '@/data/tours';
import { experiences } from '@/data/experiences';
import { categories } from '@/data/categories';
import { initFeaturedTours } from './anim';

const experiencesById = new Map(experiences.map((e) => [e.id, e]));

const DIFFICULTY_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: '1-2', label: '1–2 · Easy' },
  { value: '3', label: '3 · Moderate' },
  { value: '4-5', label: '4–5 · Challenging' },
];

function matchesDifficulty(difficulty, filter) {
  if (filter === 'any') return true;
  if (filter === '1-2') return difficulty <= 2;
  if (filter === '3') return difficulty === 3;
  if (filter === '4-5') return difficulty >= 4;
  return true;
}

// Section 3 — Featured Tours (CLAUDE.md's homepage IA). The Hero's
// "#featured-tours" anchor target and Categories' filter destination. Category
// filter state is LIFTED to Home.jsx and shared with Categories (a tile click
// sets it here too); difficulty is local — nothing else on the page needs it.
//
// Entrance/filter split: the header's one-time scroll reveal stays GSAP (this
// file's anim.js), same as every other section. The GRID itself is Framer end
// to end — both its initial stagger-in AND its filter add/remove transitions —
// rather than layering a GSAP ScrollTrigger stagger UNDER Framer's
// layout/AnimatePresence choreography for the same cards. The reveal-ownership
// rule (CLAUDE.md's KEPT list) says one system owns hide+reveal per element;
// since filtering already requires Framer to own these cards' mount/unmount,
// giving it the initial reveal too avoids two engines fighting over the same
// opacity/transform, at the cost of the grid's very first appearance running
// on Framer's mount animation instead of a ScrollTrigger-gated one.
export default function FeaturedTours({ category, onCategoryChange, difficulty, onDifficultyChange }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      initFeaturedTours({ header: headerRef.current, section: sectionRef.current });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const filtered = useMemo(
    () =>
      tours.filter(
        (tour) =>
          (category == null || tour.category === category) &&
          matchesDifficulty(tour.difficulty, difficulty),
      ),
    [category, difficulty],
  );

  const clearFilters = () => {
    onCategoryChange(null);
    onDifficultyChange('any');
  };

  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  return (
    <section ref={sectionRef} id="featured-tours" className="bg-white py-24 md:py-32">
      <div className="container-editorial">
        <div ref={headerRef}>
          <SectionHeader
            eyebrow="OUR TOURS"
            heading="Featured expeditions"
            right={
              <div className="flex flex-col gap-3 sm:items-end">
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
                  <Chip variant="toggle" selected={category == null} onToggle={() => onCategoryChange(null)}>
                    All
                  </Chip>
                  {categories.map((c) => (
                    <Chip
                      key={c.id}
                      variant="toggle"
                      selected={category === c.id}
                      onToggle={() => onCategoryChange(category === c.id ? null : c.id)}
                    >
                      {c.name}
                    </Chip>
                  ))}
                </div>
                <Select
                  label="Difficulty"
                  value={difficulty}
                  onChange={onDifficultyChange}
                  options={DIFFICULTY_OPTIONS}
                  className="w-full sm:w-48"
                />
              </div>
            }
          />
        </div>

        {filtered.length > 0 ? (
          <motion.ul
            role="list"
            initial="hidden"
            animate="visible"
            variants={gridVariants}
            className="mt-10 grid list-none grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((tour) => {
                const includedExperiences = tour.includedExperienceIds
                  .map((id) => experiencesById.get(id))
                  .filter(Boolean);
                return (
                  <motion.li key={tour.id} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
                    <TripCard item={tour} type="tour" experiences={includedExperiences} className="h-full" />
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-line bg-mist py-16 text-center md:mt-12">
            <p className="text-body text-slate">No tours match those filters.</p>
            <Button variant="ghost" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
