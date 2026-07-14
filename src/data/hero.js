import { images } from '@/assets/images';

// Hero — Section 1 (v2 planner). No video/cinematic media; a bright,
// inviting still (Hunza's terraced orchards) reads as "come plan a trip",
// not the moody v1 establishing shot. Categories mirror the client's own
// taxonomy (CLAUDE.md's Business model section) — used verbatim so the
// planner's Category field matches the language Rawaan already uses.
export const hero = {
  eyebrow: 'PLAN YOUR JOURNEY',
  headline: 'Build your Pakistan journey',
  sub: 'Tell us where and how you want to travel — we\'ll shape a licensed, fully-supported itinerary around it.',
  trustStrip: ['Licensed operator', 'Dept. of Tourism', 'PATO', 'UNWTO'],
  browseCta: { label: 'Or browse featured tours →', href: '#featured-tours' },
  categories: ['Adventure', 'Trekking', 'Religious', 'Culture', 'Leisure'],
  background: {
    ...images.hunza,
    alt: 'Terraced orchards and Karakoram peaks above Hunza valley',
  },
};
