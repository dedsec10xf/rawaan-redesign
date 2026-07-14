import { fadeUp } from '@/lib/presets';

// Entrance only — header, then the two columns (accordion + form card) fade
// up together. The accordion's own open/close is Framer state UI, unrelated
// to this one-time scroll reveal.
export function initContact({ header, columns, section }) {
  fadeUp([header, ...columns], {
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
