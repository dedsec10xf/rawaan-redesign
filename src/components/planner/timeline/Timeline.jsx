import { useRef } from 'react';
import { Plus } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Button } from '@/components/primitives';
import { useTripStore } from '@/store/tripStore';
import { DayCard } from './DayCard';

// The Journey Timeline — planner step 5's centerpiece (absorbed from the
// former standalone V7 milestone; it belongs in the flow, not the homepage —
// see CLAUDE.md). Vertical connecting line draws in on scroll: the ONE place
// GSAP earns its keep on this page (everything else here is state UI, owned
// by Framer per CLAUDE.md's scroll=GSAP/state=Framer split). Day cards
// themselves are a semantic <ol> — expand/collapse is Framer, inside DayCard.
//
// ONE component, two modes (shared-component discipline, CLAUDE.md) — this
// is also TourDetail's (V9) itinerary display, read-only:
//   - `itinerary` prop: pass a tour/package's own expanded day rows (built
//     via lib/itinerary.js's expandPhases/buildPackageItinerary) to display
//     THAT data instead of the live trip store. Omit it (planner usage) and
//     it reads/writes tripStore as before.
//   - `readOnly`: hides Add/Remove day controls and renders each DayCard
//     inert (see DayCard.jsx) — a brochure page must never mutate the
//     visitor's in-progress trip just because they scrolled past a tour page.
//
//   <Timeline />                                         // planner, live store
//   <Timeline itinerary={expandPhases(tour)} readOnly />  // tour detail page
export function Timeline({ itinerary: itineraryProp, readOnly = false }) {
  const storeItinerary = useTripStore((s) => s.itinerary);
  const addDay = useTripStore((s) => s.addDay);
  const itinerary = itineraryProp ?? storeItinerary;
  const listRef = useRef(null);
  const lineRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || itinerary.length === 0) return;
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
    { dependencies: [reduced, itinerary.length], scope: listRef },
  );

  if (itinerary.length === 0) {
    if (readOnly) return null;
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-white py-16 text-center">
        <p className="max-w-sm text-body text-slate">
          Your journey doesn't have any days yet. Start from scratch, or browse a featured tour for a ready-made
          itinerary you can customize.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button icon={Plus} onClick={() => addDay({ title: 'New day' })}>
            Add your first day
          </Button>
          <a href="/#featured-tours" className="text-small text-slate underline-offset-4 hover:text-cyan-deep hover:underline">
            Browse featured tours
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ol ref={listRef} className="relative flex list-none flex-col gap-4 pl-8">
        <div
          ref={lineRef}
          aria-hidden="true"
          className="absolute left-3 top-2 h-[calc(100%-1rem)] w-px origin-top bg-line"
        />
        {itinerary.map((day, i) => (
          <li key={day.day} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-8 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-medium text-navy"
            >
              {i + 1}
            </span>
            <DayCard day={day} index={i} readOnly={readOnly} />
          </li>
        ))}
      </ol>

      {!readOnly && (
        <Button variant="ghost" icon={Plus} onClick={() => addDay({ title: 'New day' })} className="self-start">
          Add a day
        </Button>
      )}
    </div>
  );
}
