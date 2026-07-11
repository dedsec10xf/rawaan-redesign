import { Children, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';

// Continuous, seamless horizontal loop (regions, partners). The child list is
// duplicated; each item carries trailing space so an xPercent -50 shift lines
// up exactly. Ambient autoplay — not scroll-linked — and frozen (static) under
// reduced motion. speed is px/second.
//
// tweenRef: optional ref — if passed, receives the created tween so a
// consumer can drive `timeScale` externally (e.g. scroll-velocity reactivity).
// Untouched (stays null) under reduced motion, since no tween is created.
//
//   <Marquee gap="4rem">{regions.map(r => <span key={r.id}>{r.name}</span>)}</Marquee>
export function Marquee({ children, speed = 60, reverse = false, gap = '3rem', className, tweenRef }) {
  const trackRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const items = Children.toArray(children);

  useGSAP(
    () => {
      if (reduced) return;
      const track = trackRef.current;
      const distance = track.scrollWidth / 2; // one copy's width incl. trailing gap
      const seconds = distance / speed;
      const tween = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: seconds, ease: 'none', repeat: -1 },
      );
      if (tweenRef) tweenRef.current = tween;
      return () => {
        tween.kill();
        if (tweenRef) tweenRef.current = null;
      };
    },
    { dependencies: [reduced, speed, reverse], scope: trackRef },
  );

  const renderCopy = (hidden) =>
    items.map((child, i) => (
      <div
        key={`${hidden ? 'b' : 'a'}-${i}`}
        className="shrink-0"
        style={{ paddingRight: gap }}
        aria-hidden={hidden || undefined}
        // inert (not just aria-hidden) — aria-hidden alone hides content from
        // the accessibility tree but doesn't remove focusable descendants
        // from tab order. Any consumer putting links/buttons inside a
        // duplicated copy needs this, or clones become keyboard-reachable.
        inert={hidden}
      >
        {child}
      </div>
    ));

  return (
    <div className={cn('overflow-hidden', className)}>
      <div ref={trackRef} className="flex w-max flex-nowrap will-change-transform">
        {renderCopy(false)}
        {renderCopy(true)}
      </div>
    </div>
  );
}
