import { useRef } from 'react';
import { Plus, Check } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { resolveImage } from '@/assets/images';
import { useTripStore } from '@/store/tripStore';
import { destinations } from '@/data/destinations';
import { routes } from '@/data/routes';
import { cn } from '@/utils/cn';
import { StepIntro } from './StepIntro';

const destinationsById = new Map(destinations.map((d) => [d.id, d]));
const routesById = new Map(routes.map((r) => [r.id, r]));

// Step 4 — Route. A vertical waypoint timeline for the chosen destination's
// route — same visual language as the Review step's Journey Timeline
// (vertical connecting line, numbered markers, GSAP draw-in on scroll), but
// over route.waypoints (drive-time stops) rather than itinerary day rows,
// so it's a parallel implementation, not a reused component. Adding an
// overnight at a waypoint calls toggleOvernightStop, which regenerates the
// itinerary (a day + a hotel-night line in the summary) — see tripStore.js.
export function StepRoute() {
  const destinationId = useTripStore((s) => s.destinationId);
  const overnightStops = useTripStore((s) => s.overnightStops);
  const toggleOvernightStop = useTripStore((s) => s.toggleOvernightStop);
  const reduced = usePrefersReducedMotion();
  const listRef = useRef(null);
  const lineRef = useRef(null);

  const destination = destinationsById.get(destinationId);
  const route = destination ? routesById.get(destination.routeId) : null;

  const waypoints = (route?.waypoints ?? []).reduce((acc, wp) => {
    const cumulativeHours = (acc.at(-1)?.cumulativeHours ?? 0) + wp.hoursFromPrevious;
    acc.push({ ...wp, cumulativeHours });
    return acc;
  }, []);

  useGSAP(
    () => {
      if (reduced || waypoints.length === 0) return;
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: { trigger: listRef.current, start: 'top 75%', end: 'bottom 75%', scrub: true },
        },
      );
    },
    { dependencies: [reduced, waypoints.length], scope: listRef },
  );

  if (!route) {
    return (
      <div>
        <StepIntro number={4} name="Route" heading="How you'll get there" copy="Pick a destination first — we'll show you the exact stops along the way." />
      </div>
    );
  }

  return (
    <div>
      <StepIntro
        number={4}
        name="Route"
        heading={`The road to ${destination.name}`}
        copy="Long mountain drives read better broken up. Add an overnight anywhere along the way and we'll fold a real stay into your itinerary and your total."
      />

      <ol ref={listRef} className="relative flex list-none flex-col gap-6 pl-8">
        <div ref={lineRef} aria-hidden="true" className="absolute left-3 top-2 h-[calc(100%-1rem)] w-px origin-top bg-line" />
        {waypoints.map((wp, i) => {
          const isOvernight = overnightStops.includes(wp.id);
          const image = resolveImage(wp.image);
          return (
            <li key={wp.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-8 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-medium text-navy"
              >
                {i + 1}
              </span>
              <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm sm:flex">
                <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-line sm:aspect-square sm:w-40">
                  <img src={image.src} srcSet={image.srcSet} sizes={image.sizes} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="label text-cyan-deep">≈{wp.cumulativeHours} HRS IN</span>
                  <h3 className="font-display text-h3 text-navy">{wp.name}</h3>
                  <p className="text-small text-slate">{wp.description}</p>
                  {wp.canOvernight && (
                    <button
                      type="button"
                      aria-pressed={isOvernight}
                      onClick={() => toggleOvernightStop(wp.id)}
                      className={cn(
                        'mt-2 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full border px-4 font-sans text-sm font-medium transition-colors duration-200',
                        isOvernight ? 'border-accent bg-accent/10 text-cyan-deep' : 'border-line text-navy hover:border-navy',
                      )}
                    >
                      {isOvernight ? <Check size={16} strokeWidth={2} aria-hidden="true" /> : <Plus size={16} strokeWidth={2} aria-hidden="true" />}
                      {isOvernight ? 'Overnight added' : 'Add an overnight here'}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
