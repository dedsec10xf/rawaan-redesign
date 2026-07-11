import { gsap } from '@/lib/gsap';

// Shared animation presets composed by section anim.js files. These NEVER
// duplicate a primitive (text → RevealText, images → RevealImage/CinematicMedia,
// rules → AltitudeRule) and NEVER touch pinning — they're small building blocks
// for section-owned choreography of non-primitive elements.

export const DUR = { micro: 0.3, reveal: 1.0, slow: 1.4 };
export const STAG = { tight: 0.06, base: 0.08 };

// Shared ScrollTrigger config for progress-linked (scrubbed) animation. Spread
// into a scrollTrigger and add `trigger` (override start/end per section).
export const scrubDefaults = { start: 'top 80%', end: 'bottom 60%', scrub: true };

// fadeUp — rise + fade for NON-text elements. Returns the tween; pass a
// scrollTrigger (or timeline position) via opts to bind it.
export function fadeUp(targets, { y = 24, duration = DUR.reveal, stagger = STAG.base, ...vars } = {}) {
  return gsap.from(targets, { opacity: 0, y, duration, stagger, ...vars });
}

// drawIn — scaleX line draw from an origin, for section-owned rules/dividers.
// (The AltitudeRule primitive already self-animates — don't wrap it with this.)
export function drawIn(targets, { duration = DUR.slow, transformOrigin = 'left center', ...vars } = {}) {
  return gsap.from(targets, { scaleX: 0, duration, transformOrigin, ...vars });
}
