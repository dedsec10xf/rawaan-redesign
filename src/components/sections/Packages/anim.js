import { fadeUp } from '@/lib/presets';

// Entrance only — same split as FeaturedTours: GSAP fires the header's
// one-time reveal, Framer owns the grid's own mount stagger end to end
// (there's no filter UI here to add a second Framer-owned transition for).
export function initPackages({ header, section }) {
  fadeUp(header, {
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
