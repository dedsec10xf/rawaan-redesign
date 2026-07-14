import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';

// The "altitude line" — a hairline rule used to separate sections in place of
// borders/cards. Draws in (scaleX 0 → 1 from the left) when it scrolls into
// view; renders full-width and static under reduced motion.
//
//   <AltitudeRule />
//   <AltitudeRule animated={false} className="bg-navy/20" />
//
// containerAnimation: pass the horizontal tween of a pinned section (M6) so the
// trigger resolves against horizontal scroll instead of the viewport.
export function AltitudeRule({ animated = true, containerAnimation, className }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!animated || reduced) return;
      // scaleX from 0 with left origin; immediateRender avoids a full-width flash.
      gsap.from(ref.current, {
        scaleX: 0,
        duration: 1.2,
        scrollTrigger: { trigger: ref.current, start: 'top 88%', containerAnimation },
      });
    },
    { dependencies: [animated, reduced, containerAnimation], scope: ref },
  );

  return (
    <hr
      ref={ref}
      className={cn('h-px w-full origin-left border-0 bg-line', className)}
    />
  );
}
