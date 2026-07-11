import { images } from '@/assets/images';

// Hero — Section 1. The video files aren't in the repo yet (paths are
// placeholders); CinematicMedia falls back to the poster/still. There's no
// separate hero.jpg, so the poster doubles as the mobile/reduced still.
export const hero = {
  label: { text: 'Pakistan, Unscripted', index: 'Est. 2014' },
  // Two deliberate lines (rendered with a <br/>) so the reveal masks two rows.
  headline: ['The mountains', 'have been waiting.'],
  cta: { label: 'Begin the journey', href: '#journeys' },
  altitude: '8,611 M',
  scrollLabel: 'Scroll',
  media: {
    video: {
      webm: '/src/assets/videos/hero.webm',
      mp4: '/src/assets/videos/hero.mp4',
    },
    poster: images['hero-poster'],
    image: images['hero-poster'],
    alt: 'Dawn light on the Karakoram peaks, northern Pakistan',
  },
};
