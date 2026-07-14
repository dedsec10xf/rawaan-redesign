import { fadeUp, STAG } from '@/lib/presets';

// Entrance only — header then tiles, staggered. Filtering/active-ring state
// on the tiles themselves is Framer's job (hover/tap + the shared-with-
// FeaturedTours category state), not GSAP's — same scroll/state boundary as
// every other v2 section.
export function initCategories({ header, tiles, section }) {
  fadeUp([header, ...tiles], {
    stagger: STAG.base,
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
