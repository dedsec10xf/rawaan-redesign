import { fadeUp } from '@/lib/presets';

// Entrance only, fired once on scroll-in. Selecting/deselecting cards
// afterward never re-triggers this — Framer (index.jsx) owns the grid itself.
export function initExperiences({ header, section }) {
  fadeUp(header, {
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
