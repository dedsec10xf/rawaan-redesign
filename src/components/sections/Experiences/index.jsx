import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@/lib/gsap';
import { SectionHeader, Chip, ExperienceCard } from '@/components/ui';
import { Button } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTripStore } from '@/store/tripStore';
import { experiences } from '@/data/experiences';
import { initExperiences } from './anim';

const experiencesById = new Map(experiences.map((e) => [e.id, e]));
const CATEGORIES = [...new Set(experiences.map((e) => e.category))];

// Section 6 — Local Experiences (CLAUDE.md's homepage IA). The v2 selectable
// grid — not the v1 hover-list (removed in V1). Reuses the SAME
// ExperienceCard instance the planner (V6) will use, in mode="toggle", so
// selection here and there share one component with no surface-specific
// logic — verified by both reading straight from tripStore.toggleExperience.
//
// Category filter state is LOCAL (unlike FeaturedTours' lifted `category`):
// nothing outside this section reads it, it only narrows which of the fixed
// experience pool is shown. Same Framer-owns-the-grid split as FeaturedTours:
// GSAP fires the header's one-time reveal, Framer owns the grid's entrance
// AND its filter add/remove transitions end to end.
//
// The bottom conversion strip is this section's own "Continue to planner"
// hook — self-contained ahead of V8's global floating Trip Summary, per the
// milestone's ask.
export default function Experiences() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const navigate = useNavigate();

  const selectedIds = useTripStore((state) => state.selectedExperienceIds);
  const [category, setCategory] = useState(null);

  useGSAP(
    () => {
      if (reduced) return;
      initExperiences({ header: headerRef.current, section: sectionRef.current });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const filtered = useMemo(
    () => (category == null ? experiences : experiences.filter((e) => e.category === category)),
    [category],
  );

  const selectedCount = selectedIds.length;
  const estimatedCost = selectedIds.reduce((sum, id) => sum + (experiencesById.get(id)?.priceUSD ?? 0), 0);

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
    <section ref={sectionRef} id="experiences" className="bg-mist py-24 md:py-32">
      <div className="container-editorial">
        <div ref={headerRef}>
          <SectionHeader
            eyebrow="ADD-ONS"
            heading="Local experiences"
            sub="Add any of these to your trip — mix and match, then continue to the planner."
            right={
              selectedCount > 0 ? (
                <span className="label text-cyan-deep">{selectedCount} selected</span>
              ) : undefined
            }
          />
        </div>

        <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip variant="toggle" selected={category == null} onToggle={() => setCategory(null)}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} variant="toggle" selected={category === c} onToggle={() => setCategory(category === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>

        <motion.ul
          role="list"
          initial="hidden"
          animate="visible"
          variants={gridVariants}
          className="mt-8 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((experience) => (
              <motion.li key={experience.id} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
                <ExperienceCard experience={experience} className="h-full" />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <div aria-live="polite" className="mt-8">
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row"
              >
                <p className="text-body text-navy">
                  <span className="font-medium">
                    {selectedCount} experience{selectedCount === 1 ? '' : 's'} added
                  </span>{' '}
                  · Est. +${estimatedCost}
                </p>
                <Button icon={ArrowRight} onClick={() => navigate('/build')}>
                  Continue to planner
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
