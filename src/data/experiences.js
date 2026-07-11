import { images } from '@/assets/images';

// Experiences — Section 4 (hover-expand list + cursor image; mobile accordion).
// image = resolved URL from the central registry (keyed by experience id).
export const experiences = [
  {
    id: 'custom-journeys',
    index: '01',
    title: 'Custom Journeys',
    description:
      'Itineraries built line by line around how you actually want to travel.',
    image: images['custom-journeys'],
    imageAlt: 'A guide and traveller reviewing a route by lamplight',
  },
  {
    id: 'group-expeditions',
    index: '02',
    title: 'Group Expeditions',
    description:
      'Small, like-minded parties on our flagship routes, fully guided.',
    image: images['group-expeditions'],
    imageAlt: 'A small group crossing a suspension bridge over a glacial river',
  },
  {
    id: 'luxury-stays',
    index: '03',
    title: 'Luxury Stays',
    description:
      'The best rooms in the valley — and the right camp where there are none.',
    image: images['luxury-stays'],
    imageAlt: 'A lantern-lit expedition tent interior at dusk',
  },
  {
    id: 'adventure',
    index: '04',
    title: 'Adventure',
    description:
      'Trekking, climbing and high passes, matched to your appetite for it.',
    image: images.adventure,
    imageAlt: 'A climber ascending a fixed rope on a high glacier',
  },
  {
    id: 'cultural',
    index: '05',
    title: 'Cultural',
    description:
      'Festivals, craft and table — travel that stays with the people who live there.',
    image: images.cultural,
    imageAlt: 'Artisans at work in a hillside workshop',
  },
];
