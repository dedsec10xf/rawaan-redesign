import { ScrollTrigger } from '@/lib/gsap';

// Resolve a hash to a Lenis-compatible scroll target, at CALL time (so it
// reflects the latest ScrollTrigger.refresh(), not stale mount-time layout):
//   - '#top' / falsy        → 0
//   - a pinned section      → the pin ScrollTrigger's `.start` (px), so we land
//                             exactly at the pin start, not the element offset
//                             (which can sit pre/mid-pin because of the spacer)
//   - a plain section       → the element itself
//   - unknown               → null
export function resolveAnchor(hash) {
  if (!hash || hash === '#top') return 0;

  const el = document.querySelector(hash);
  if (!el) return null;

  // Any pinned trigger anchored to this element resolves to its start px.
  const pinned = ScrollTrigger.getAll().find(
    (t) => t.pin && (t.trigger === el || t.pin === el),
  );
  return pinned ? pinned.start : el;
}

// Resolve + scroll via Lenis, with a no-Lenis fallback (reduced motion, or
// before the provider has published the instance).
export function scrollToAnchor(lenis, hash) {
  const target = resolveAnchor(hash);
  if (target == null) return;

  if (lenis) {
    lenis.scrollTo(target);
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    target.scrollIntoView?.({ behavior: 'smooth' });
  }
}
