// `image` is an image-registry KEY (see tours.js's note), resolved via
// resolveImage() at the consuming component.
//
// Bookable add-on activities (NOT the v1 service-line "Experiences" section —
// those were removed in V1). Each tour's includedExperienceIds points here;
// Planner step 4 (V6) shows this full pool with a tour's own pre-ticked.
// `priceUSD` is a reasonable placeholder, not a client-provided figure — same
// demo-data status as tours.js's ratings. `pricePerPersonPKR` (added for the
// 7-step planner's PKR-primary pricing, V-next data foundation) is NOT
// priceUSD converted via lib/currency's demo FX rate — it's authored
// independently, since Rawaan's real local pricing for these add-ons
// wouldn't be a straight USD conversion either. Both figures are demo data.
export const experiences = [
  {
    id: 'glacier-trek',
    name: 'Guided Glacier Trek',
    category: 'Adventure',
    durationHours: 8,
    priceUSD: 120,
    pricePerPersonPKR: 33000,
    image: 'glacier-trek',
    regionsAvailable: ['baltistan', 'gilgit-baltistan'],
  },
  {
    id: 'porter-guide-support',
    name: 'High-Altitude Porter & Guide Support',
    category: 'Trekking',
    durationHours: 24,
    priceUSD: 85,
    pricePerPersonPKR: 23000,
    image: 'porter-guide-support',
    regionsAvailable: ['baltistan', 'gilgit-baltistan', 'hunza'],
  },
  {
    id: 'kalash-cultural-evening',
    name: 'Traditional Kalash Cultural Evening',
    category: 'Culture',
    durationHours: 3,
    priceUSD: 60,
    pricePerPersonPKR: 16500,
    image: 'kalash-cultural-evening',
    regionsAvailable: ['chitral'],
  },
  {
    id: 'sufi-heritage-walk',
    name: 'Sufi Shrine & Heritage Walk',
    category: 'Religious',
    durationHours: 4,
    priceUSD: 40,
    pricePerPersonPKR: 11000,
    image: 'sufi-heritage-walk',
    regionsAvailable: ['punjab'],
  },
  {
    id: 'sikh-pilgrimage-guide',
    name: 'Sikh Heritage Pilgrimage Guide',
    category: 'Religious',
    durationHours: 6,
    priceUSD: 50,
    pricePerPersonPKR: 14000,
    image: 'sikh-pilgrimage-guide',
    regionsAvailable: ['punjab'],
  },
  {
    id: 'polo-vip-viewing',
    name: 'Polo Match VIP Viewing',
    category: 'Leisure',
    durationHours: 5,
    priceUSD: 80,
    pricePerPersonPKR: 22000,
    image: 'polo-vip-viewing',
    regionsAvailable: ['chitral', 'gilgit'],
  },
  {
    id: 'whitewater-rafting',
    name: 'White-Water Rafting',
    category: 'Adventure',
    durationHours: 4,
    priceUSD: 90,
    pricePerPersonPKR: 25000,
    image: 'adventure',
    regionsAvailable: ['hunza', 'skardu'],
  },
  {
    id: 'photography-workshop',
    name: 'Photography Workshop with Local Guide',
    category: 'Culture',
    durationHours: 6,
    priceUSD: 70,
    pricePerPersonPKR: 19500,
    image: 'cultural',
    regionsAvailable: ['hunza', 'skardu', 'chitral', 'khyber-pakhtunkhwa'],
  },
  {
    id: 'luxury-yurt-glamping',
    name: 'Luxury Yurt Glamping Night',
    category: 'Leisure',
    durationHours: 12,
    priceUSD: 150,
    pricePerPersonPKR: 41500,
    image: 'luxury-stays',
    regionsAvailable: ['hunza', 'chitral'],
  },
  {
    id: 'gandhara-monastery-tour',
    name: 'Buddhist Heritage Museum & Monastery Tour',
    category: 'Religious',
    durationHours: 5,
    priceUSD: 45,
    pricePerPersonPKR: 12500,
    image: 'cultural',
    regionsAvailable: ['khyber-pakhtunkhwa'],
  },
];
