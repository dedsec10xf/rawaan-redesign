// Testimonials — Section 7 (CLAUDE.md's homepage IA). Names, quotes and
// ratings are invented demo data (same status as tours.js's ratings) — not
// real traveller accounts. `tripSlug` links to the real tour/package it
// references; `tripType` picks the right detail route.
export const testimonials = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    country: 'United Kingdom',
    rating: 5,
    tripName: 'K2 Base Camp',
    tripSlug: 'k2-base-camp',
    tripType: 'tour',
    quote:
      "Every permit, porter and camp was handled before we arrived. Three weeks in the Karakoram and the only thing we had to think about was the walk in front of us.",
  },
  {
    id: 'ahmed-alfarsi',
    name: 'Ahmed Al-Farsi',
    country: 'United Arab Emirates',
    rating: 4.8,
    tripName: 'Hunza Valley',
    tripSlug: 'hunza-valley',
    tripType: 'tour',
    quote:
      'Our guide adjusted the pace daily for my parents without us ever asking. Hunza in autumn, arranged down to the smallest detail — we are already planning the next one.',
  },
  {
    id: 'emma-chen',
    name: 'Emma Chen',
    country: 'Singapore',
    rating: 4.9,
    tripName: 'Wisdom in the Mountains',
    tripSlug: 'wisdom-in-the-mountains',
    tripType: 'package',
    quote:
      'Kalash and Hunza back to back felt like two completely different trips stitched together seamlessly. Rawaan planned every transfer so we never lost a day to logistics.',
  },
];
