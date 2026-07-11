import { fadeUp, STAG } from '@/lib/presets';

// Minimal by design: the only section-owned choreography is the stat blocks
// fading up on enter (STAG.base). Everything else self-animates — AltitudeRule
// (draw-in), Counter (counts on view-enter), Marquee (ambient loop).
export function initStatsPartners({ statBlocks, section }) {
  fadeUp(statBlocks, {
    stagger: STAG.base,
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
