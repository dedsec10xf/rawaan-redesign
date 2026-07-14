import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@/lib/gsap';
import { SectionHeader } from '@/components/ui';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { resolveImage } from '@/assets/images';
import { cn } from '@/utils/cn';
import { categories } from '@/data/categories';
import { tours } from '@/data/tours';
import { initCategories } from './anim';

const IMAGE_V = { rest: { scale: 1 }, hover: { scale: 1.03 } };

// Section 2 — Explore by category (CLAUDE.md's homepage IA). Five tiles for
// Rawaan's real taxonomy; clicking one sets the shared category filter (lifted
// to Home.jsx — NOT tripStore, this is homepage browse UI, not trip data) and
// smooth-scrolls down to Featured Tours, where the same value drives the grid.
//
//   <Categories active={category} onSelect={setCategory} />
export default function Categories({ active, onSelect }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const tileRefs = useRef([]);
  const reduced = usePrefersReducedMotion();

  const counts = useMemo(() => {
    const map = new Map();
    for (const tour of tours) map.set(tour.category, (map.get(tour.category) ?? 0) + 1);
    return map;
  }, []);

  useGSAP(
    () => {
      if (reduced) return;
      initCategories({ header: headerRef.current, tiles: tileRefs.current, section: sectionRef.current });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const handleSelect = (id) => {
    onSelect(active === id ? null : id);
    document.getElementById('featured-tours')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section ref={sectionRef} id="categories" className="bg-mist py-24 md:py-32">
      <div className="container-editorial">
        <div ref={headerRef}>
          <SectionHeader eyebrow="WHERE TO START" heading="Explore by category" />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-12 md:grid-cols-5 md:gap-6">
          {categories.map((category, i) => {
            const count = counts.get(category.id) ?? 0;
            const isActive = active === category.id;
            const image = resolveImage(category.image);
            return (
              <motion.button
                key={category.id}
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleSelect(category.id)}
                initial="rest"
                whileHover={reduced ? undefined : 'hover'}
                animate="rest"
                className={cn(
                  'group relative overflow-hidden rounded-xl border text-left shadow-sm transition-shadow duration-200 hover:shadow-md',
                  isActive ? 'border-accent ring-2 ring-accent' : 'border-line',
                )}
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-line">
                  <motion.img
                    variants={reduced ? undefined : IMAGE_V}
                    transition={{ duration: 0.2 }}
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes={image.sizes}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-h3 text-white">{category.name}</h3>
                  <p className="label mt-1 text-white/80">
                    {count} {count === 1 ? 'tour' : 'tours'}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
