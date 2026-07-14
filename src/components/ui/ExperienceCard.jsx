import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { useTripStore } from '@/store/tripStore';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { resolveImage } from '@/assets/images';
import { cn } from '@/utils/cn';

// The ONE experience card for all three surfaces (homepage grid, planner
// step 4, tour detail page — CLAUDE.md's core loop).
//
// mode='toggle' (default): selection state + the Add/Added action both come
// straight from the trip store — nothing for a calling surface to configure.
// mode='static': read-only display, no button, no store writes — e.g. a tour
// detail page listing its included experiences, where "selected" isn't a
// user choice to make.
//
// `selected` is an optional controlled override for the checkmark badge in
// EITHER mode (falls back to the store lookup in 'toggle' mode, to `false`
// in 'static' mode if omitted). The toggle button's onClick always calls the
// store regardless of this override — it only affects what's displayed.
//
//   <ExperienceCard experience={experiences[0]} />                         // toggle, store-driven
//   <ExperienceCard experience={e} mode="static" selected />               // read-only "included" row
export function ExperienceCard({ experience, mode = 'toggle', selected: selectedProp, className }) {
  const storeSelected = useTripStore((state) => state.selectedExperienceIds.includes(experience.id));
  const toggleExperience = useTripStore((state) => state.toggleExperience);
  const reduced = usePrefersReducedMotion();

  const selected = selectedProp ?? (mode === 'toggle' ? storeSelected : false);
  const image = resolveImage(experience.image);

  return (
    <motion.div
      className={cn(
        'overflow-hidden rounded-xl border bg-white transition-shadow duration-200',
        selected ? 'border-accent shadow-md' : 'border-line shadow-sm',
        className,
      )}
      whileHover={reduced ? undefined : { y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        {selected && (
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-navy"
          >
            <Check size={14} strokeWidth={2.5} />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-h3 text-navy">{experience.name}</h3>
          <p className="label mt-1 text-slate">
            {experience.durationHours}h · ${experience.priceUSD}
          </p>
        </div>

        {mode === 'toggle' && (
          <button
            type="button"
            aria-pressed={selected}
            onClick={() => toggleExperience(experience.id)}
            className={cn(
              'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border font-sans text-sm font-medium transition-colors duration-200',
              selected ? 'border-accent bg-accent/10 text-cyan-deep' : 'border-line text-navy hover:border-navy',
            )}
          >
            {selected ? (
              <>
                <Check size={16} strokeWidth={2} aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                Add
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
