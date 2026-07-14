// Rawaan's real service taxonomy (CLAUDE.md's Business model — use these
// words verbatim). Tour counts are NOT hand-maintained here — Categories/
// index.jsx derives them from tours.js at render time, so a new tour's
// category shows up in the tile automatically. `image` is a KEY into the
// image registry (assets/images/index.js), resolved via resolveImage() at
// the consuming component, not looked up here — see resolveImage's comment
// for why.
export const categories = [
  { id: 'Adventure', name: 'Adventure', image: 'adventure' },
  { id: 'Trekking', name: 'Trekking', image: 'skardu-baltistan' },
  { id: 'Religious', name: 'Religious', image: 'gandhara-trail' },
  { id: 'Culture', name: 'Culture', image: 'cultural' },
  { id: 'Leisure', name: 'Leisure', image: 'naran' },
];
