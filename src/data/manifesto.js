import { images } from '@/assets/images';

// Manifesto — Section 2 (first bone breather).
export const manifesto = {
  label: { text: 'Our Philosophy', index: '02' },
  body:
    "We don't chase checklists. We follow weather and light, the slow rhythm of the high valleys, and the quiet knowledge of the people who have kept them for centuries. To travel unhurried is to arrive fully — and to let the place change you.",
  images: [
    {
      image: images['manifesto-1'],
      alt: 'Prayer flags strung against a Karakoram ridgeline',
      aspectRatio: '3/4',
    },
    {
      image: images['manifesto-2'],
      alt: 'The weathered hands of a Hunza farmer at harvest',
      aspectRatio: '4/5',
    },
  ],
};
