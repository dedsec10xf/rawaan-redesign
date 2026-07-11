import { images } from '@/assets/images';

// Regions — Section 5 (marquee). image = resolved URL from the central
// registry. Every region now has its own dedicated photo (region-<id>.jpg) —
// no reuse from journeys/experiences. This is the single source of truth:
// both the marquee strip and the attention backdrop read `region.image`
// directly, never a second lookup.
export const regions = [
  {
    id: 'hunza',
    name: 'Hunza',
    image: images.hunza,
    imageAlt: 'A road through the Hunza valley lined with autumn poplars, snow peaks ahead',
  },
  {
    id: 'skardu',
    name: 'Skardu',
    image: images.skardu,
    imageAlt: 'Bare trees and a lodge roof against a snow-capped ridge near Skardu',
  },
  {
    id: 'chitral',
    name: 'Chitral',
    image: images.chitral,
    imageAlt: 'Snow-streaked peaks above a Chitral valley slope at dusk',
  },
  {
    id: 'swat',
    name: 'Swat',
    image: images.swat,
    imageAlt: 'A pine-forested valley and glacial river in Swat',
  },
  {
    id: 'lahore',
    name: 'Lahore',
    image: images.lahore,
    imageAlt: "Badshahi Mosque's minaret and courtyard in Lahore",
  },
  {
    id: 'naran',
    name: 'Naran',
    image: images.naran,
    imageAlt: 'A boat crossing an alpine lake near Naran, snow peaks behind',
  },
];
