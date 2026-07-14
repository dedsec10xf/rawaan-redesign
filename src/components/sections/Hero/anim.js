import { gsap } from '@/lib/gsap';

// v2 motion contract (CLAUDE.md): 150–400ms, fade + 8px rise, 60ms stagger —
// an ordinary mount tween, not a paused/gated cinematic entrance. Fields are
// interactive immediately; this timeline never blocks input.
const RISE = 8;
const DUR = 0.4;
const STAGGER = 0.06;
const CARD_DELAY = 0.12; // card starts slightly after the left column

export function initHeroEntrance({ eyebrow, headline, sub, trust, card }) {
  const tl = gsap.timeline({ defaults: { ease: 'expoOut' } });

  tl.from([eyebrow, headline, sub, trust], {
    opacity: 0,
    y: RISE,
    duration: DUR,
    stagger: STAGGER,
  });

  tl.from(card, { opacity: 0, y: RISE, duration: DUR }, CARD_DELAY);

  return tl;
}
