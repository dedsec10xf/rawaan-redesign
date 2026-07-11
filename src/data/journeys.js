import { images } from '@/assets/images';

// Signature Journeys — Section 3 (pinned horizontal gallery).
// nameLines: intentional line breaks for the RevealText asLines headline.
// image = resolved URL from the central registry (keyed by journey id).
export const journeys = [
  {
    id: 'k2-base-camp',
    index: '01',
    name: 'K2 Base Camp',
    nameLines: ['K2', 'Base Camp'],
    region: 'Baltistan',
    duration: '21 days',
    priceFrom: '$4,900',
    season: 'Jun – Aug',
    summary:
      'The long walk to the foot of the savage mountain, unhurried and fully supported.',
    image: images['k2-base-camp'],
    imageAlt: 'K2 rising above the Baltoro glacier at first light',
  },
  {
    id: 'kalash-chilam-joshi',
    index: '02',
    name: 'Kalash at Chilam Joshi',
    nameLines: ['Kalash at', 'Chilam Joshi'],
    region: 'Chitral',
    duration: '9 days',
    priceFrom: '$2,400',
    season: 'May',
    summary:
      'Spring rites in the Kalash valleys — a living culture met on its own terms.',
    image: images['kalash-chilam-joshi'],
    imageAlt: 'Kalash women in embroidered headdresses during the spring festival',
  },
  {
    id: 'skardu-baltistan',
    index: '03',
    name: 'Skardu & Baltistan',
    nameLines: ['Skardu &', 'Baltistan'],
    region: 'Gilgit-Baltistan',
    duration: '12 days',
    priceFrom: '$3,200',
    season: 'Apr – Oct',
    summary:
      'Cold deserts, turquoise lakes, and forts above the Indus, at a considered pace.',
    image: images['skardu-baltistan'],
    imageAlt: 'A fort above the Indus with turquoise water below',
  },
  {
    id: 'shandur-polo-festival',
    index: '04',
    name: 'Shandur Polo Festival',
    nameLines: ['Shandur', 'Polo Festival'],
    region: 'Chitral / Gilgit',
    duration: '8 days',
    priceFrom: '$2,800',
    season: 'Jul',
    summary:
      'Freestyle polo on the roof of the world, at the highest ground in the game.',
    image: images['shandur-polo-festival'],
    imageAlt: 'Horsemen mid-chukka on the high Shandur plateau',
  },
  {
    id: 'gandhara-trail',
    index: '05',
    name: 'Gandhara Trail',
    nameLines: ['Gandhara', 'Trail'],
    region: 'Khyber Pakhtunkhwa',
    duration: '7 days',
    priceFrom: '$1,900',
    season: 'Oct – Mar',
    summary:
      'Buddhist monasteries and museum halls along the old Gandhara heartland.',
    image: images['gandhara-trail'],
    imageAlt: 'Carved Buddhist relief from the Gandhara period',
  },
];
