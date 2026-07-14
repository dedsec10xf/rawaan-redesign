import { fadeUp, STAG } from '@/lib/presets';

// Header, then the 4 credential cards, staggered. The stats row's own count-up
// is Counter's self-contained ScrollTrigger (see Counter.jsx) — not
// duplicated here.
export function initTrust({ header, cards, section }) {
  fadeUp([header, ...cards], {
    stagger: STAG.base,
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
