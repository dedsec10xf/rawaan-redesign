import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@/lib/gsap';
import { SectionHeader, TripCard } from '@/components/ui';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { packages } from '@/data/packages';
import { tours } from '@/data/tours';
import { initPackages } from './anim';

const toursById = new Map(tours.map((t) => [t.id, t]));

// Section 4 — Curated Packages (CLAUDE.md's homepage IA). Fixed 3-card grid,
// no filter UI (unlike Featured Tours) — same Framer-owns-the-grid-entrance
// split as every other section, just without a second Framer transition for
// filtering since there's nothing to filter.
export default function Packages() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      initPackages({ header: headerRef.current, section: sectionRef.current });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <section ref={sectionRef} id="packages" className="bg-white py-24 md:py-32">
      <div className="container-editorial">
        <div ref={headerRef}>
          <SectionHeader
            eyebrow="CURATED"
            heading="Multi-region journeys"
            sub="Two or more of our tours, combined into one guided circuit with the connecting days already planned — at a lower price than booking each separately."
          />
        </div>

        <motion.ul
          role="list"
          initial="hidden"
          animate="visible"
          variants={gridVariants}
          className="mt-10 grid list-none grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {packages.map((pkg) => {
            const includedTours = pkg.includes.map((id) => toursById.get(id)).filter(Boolean);
            return (
              <motion.li key={pkg.id} variants={cardVariants}>
                <TripCard item={pkg} type="package" experiences={includedTours} chipsLabel="Includes" className="h-full" />
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
