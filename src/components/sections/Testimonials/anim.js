import { fadeUp, STAG } from '@/lib/presets';

// Header, then the 3 cards, staggered — no carousel, so this is a plain
// one-time reveal like every other non-filterable grid on the page.
export function initTestimonials({ header, cards, section }) {
  fadeUp([header, ...cards], {
    stagger: STAG.base,
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
