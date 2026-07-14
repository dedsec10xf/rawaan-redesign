import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { resolveImage } from '@/assets/images';
import { useTripStore } from '@/store/tripStore';
import { destinations } from '@/data/destinations';
import { routes } from '@/data/routes';
import { cn } from '@/utils/cn';
import { StepIntro } from './StepIntro';

const routesById = new Map(routes.map((r) => [r.id, r]));

// Step 1 — Destination. Single-select (tripStore.destinationId is a scalar,
// unlike the OLD 5-step planner's multi-region `destination` array — this
// builder plans ONE self-drive trip to one place, not a multi-region tour).
// role="radiogroup" — a single-select grid of cards is exactly a radio
// group semantically, not a listbox or a set of independent toggle buttons.
export function StepDestination() {
  const destinationId = useTripStore((s) => s.destinationId);
  const setDestinationId = useTripStore((s) => s.setDestinationId);
  const reduced = usePrefersReducedMotion();

  return (
    <div>
      <StepIntro
        number={1}
        name="Destination"
        heading="Where would you like to go?"
        copy="Every route below is one we drive ourselves — the timing, the stops, and the hotels are all things our team has actually checked in person, not looked up."
      />

      <div role="radiogroup" aria-label="Destination" className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {destinations.map((destination) => {
          const route = routesById.get(destination.routeId);
          const isSelected = destinationId === destination.id;
          const image = resolveImage(destination.image);
          return (
            <motion.button
              key={destination.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setDestinationId(destination.id)}
              whileHover={reduced ? undefined : { y: -2 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'group relative overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-shadow duration-200 hover:shadow-md',
                isSelected ? 'border-accent ring-2 ring-accent' : 'border-line',
              )}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-line">
                <img
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes={image.sizes}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-navy"
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 p-5">
                <span className="label text-cyan-deep">{destination.corridor}</span>
                <h3 className="font-display text-h3 text-navy">{destination.name}</h3>
                <p className="text-small text-slate">{destination.tagline}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-slate">
                  {route && <span>≈{route.totalHours} hrs from {route.from}</span>}
                  <span>Best {destination.bestSeason}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
