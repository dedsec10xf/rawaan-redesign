// `image`/`gallery` are image-registry KEYS (see tours.js's note), resolved
// via resolveImage() at the consuming component.
//
// Curated multi-tour packages — shape per CLAUDE.md's Data model
// ("+ card fields" = whatever TripCard needs to render a package the same
// way it renders a tour: image, rating, region, groupSizeMax, summary,
// highlights). Wisdom in the Mountains' $1800→$1600 is client-provided; the
// other two packages' pricing is a reasonable estimate, not a client figure —
// same status as tours.js's invented ratings.
export const packages = [
  {
    id: 'past-to-peaks',
    slug: 'past-to-peaks',
    name: 'Past to Peaks',
    tagline: 'Gandhara heritage into the high Karakoram',
    category: 'Adventure',
    region: 'Khyber Pakhtunkhwa / Baltistan',
    durationDays: [19, 20],
    priceUSD: 3800,
    priceWas: 4200,
    rating: 4.8,
    reviewCount: 54,
    groupSizeMax: 10,
    image: 'k2-base-camp',
    gallery: ['k2-base-camp', 'gandhara-trail'],
    summary: 'From the Buddhist heartland of Gandhara to a Karakoram base camp — history first, altitude after.',
    highlights: ['Peshawar Museum & Takht-i-Bahi', 'Skardu approach', 'Full base-camp trek'],
    includes: ['buddhist-trail', 'rakaposhi-base-camp'],
    // Connective days not owned by either constituent tour — reconciles
    // 5 (buddhist-trail) + 6 (rakaposhi-base-camp) = 11 up to durationDays[0]
    // 19. loadPackage splices these in: arrival first, transit between the
    // two tours, departure last.
    bufferPhases: {
      arrival: {
        title: 'Islamabad arrival & briefing',
        description: 'Arrive in Islamabad, trip briefing and gear check ahead of the Peshawar leg.',
        durationDays: 2,
        hotel: 'Islamabad (3-star)',
        transport: 'Private vehicle',
      },
      transit: {
        title: 'Peshawar to Skardu transfer',
        description: 'Domestic flight from Peshawar to Islamabad, then on to Skardu for the base-camp leg.',
        durationDays: 4,
        hotel: 'En route',
        transport: 'Domestic flight',
      },
      departure: {
        title: 'Skardu to Islamabad departure',
        description: 'Fly back to Islamabad for onward international connections.',
        durationDays: 2,
        hotel: '—',
        transport: 'Domestic flight',
      },
    },
  },
  {
    id: 'surood-e-south',
    slug: 'surood-e-south',
    name: 'Surood-e-South',
    tagline: 'Punjab’s pilgrimage circuit, at a considered pace',
    category: 'Religious',
    region: 'Punjab / Khyber Pakhtunkhwa',
    durationDays: [14, 15],
    priceUSD: 1950,
    priceWas: 2200,
    rating: 4.9,
    reviewCount: 41,
    groupSizeMax: 20,
    image: 'lahore',
    gallery: ['lahore', 'gandhara-trail'],
    summary: 'Sikh and Buddhist heritage sites across Punjab and Khyber Pakhtunkhwa, combined into one guided circuit.',
    highlights: ['Nankana Sahib & Panja Sahib', 'Lahore’s walled city', 'Takht-i-Bahi & Swat stupas'],
    includes: ['sikh-yatra', 'buddhist-trail'],
    // 4 (sikh-yatra) + 5 (buddhist-trail) = 9 up to durationDays[0] 14.
    bufferPhases: {
      arrival: {
        title: 'Lahore arrival & briefing',
        description: 'Arrive in Lahore, trip briefing ahead of the pilgrimage circuit.',
        durationDays: 2,
        hotel: 'Lahore (3-star)',
        transport: 'Private vehicle',
      },
      transit: {
        title: 'Lahore to Peshawar transfer',
        description: 'Overland transfer from Lahore to Peshawar for the Gandhara leg.',
        durationDays: 2,
        hotel: 'En route',
        transport: 'Private vehicle',
      },
      departure: {
        title: 'Peshawar departure',
        description: 'Final morning in Peshawar ahead of onward travel.',
        durationDays: 1,
        hotel: '—',
        transport: 'Private vehicle',
      },
    },
  },
  {
    id: 'wisdom-in-the-mountains',
    slug: 'wisdom-in-the-mountains',
    name: 'Wisdom in the Mountains',
    tagline: 'Kalash culture and Hunza’s easiest pace, together',
    category: 'Culture',
    region: 'Chitral / Hunza',
    durationDays: [14, 15],
    priceUSD: 1600,
    priceWas: 1800,
    rating: 4.9,
    reviewCount: 89,
    groupSizeMax: 16,
    image: 'kalash-chilam-joshi',
    gallery: ['kalash-chilam-joshi', 'hunza'],
    summary: 'The Kalash valleys and Hunza, back to back — living culture, then terraced-orchard leisure.',
    highlights: ['Kalash village life', 'Baltit & Altit forts', 'Attabad Lake'],
    includes: ['kalash-valley', 'hunza-valley'],
    // 6 (kalash-valley) + 5 (hunza-valley) = 11 up to durationDays[0] 14.
    bufferPhases: {
      arrival: {
        title: 'Chitral arrival & briefing',
        description: 'Arrive in Chitral, trip briefing ahead of the Kalash valleys leg.',
        durationDays: 1,
        hotel: 'Chitral (3-star)',
        transport: 'Private vehicle',
      },
      transit: {
        title: 'Chitral to Hunza transfer',
        description: 'Overland transfer from the Kalash valleys to Hunza.',
        durationDays: 1,
        hotel: 'En route',
        transport: 'Private vehicle',
      },
      departure: {
        title: 'Hunza departure',
        description: 'Final morning in Hunza ahead of onward travel.',
        durationDays: 1,
        hotel: '—',
        transport: 'Private vehicle',
      },
    },
  },
];
