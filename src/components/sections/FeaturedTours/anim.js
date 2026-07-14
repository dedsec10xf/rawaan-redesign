import { fadeUp } from '@/lib/presets';

// Entrance only, fired once on scroll-in. Filter-driven re-ordering/removal of
// cards afterward is Framer's job (layout + AnimatePresence in index.jsx) —
// this never re-runs on filter change, only on first reveal.
export function initFeaturedTours({ header, section }) {
  fadeUp(header, {
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
