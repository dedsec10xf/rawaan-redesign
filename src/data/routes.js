// Overland routes for the 7-step planner's routing step. Waypoint geography
// follows the real Karakoram Highway / Kaghan Valley corridors travellers
// actually drive; distances/hours and `canOvernight` calls are reasonable
// estimates, not surveyed figures — same demo-data status as tours.js's
// durationDays. `image` reuses existing assets/images/index.js keys (no new
// asset work) — picked for the closest visual match available, not a
// literal photo of each town.
//
// `regionId` is the explicit link to data/hotels.js's `region` and
// data/vehicles.js's `suitableFor` — added alongside `to` (the display name)
// rather than deriving it by lowercasing/hyphenating `to` at every call
// site, which would silently break the moment a destination's display name
// stopped being a trivial transform of its id (e.g. "Fairy Meadows").
export const routes = [
  {
    id: 'islamabad-hunza',
    from: 'Islamabad',
    to: 'Hunza',
    regionId: 'hunza',
    totalKm: 620,
    totalHours: 14,
    waypoints: [
      {
        id: 'besham',
        name: 'Besham',
        image: 'besham',
        description: 'The first overnight stop for most KKH convoys — where the highway starts climbing into the mountains proper.',
        hoursFromPrevious: 6,
        canOvernight: true,
      },
      {
        id: 'chilas',
        name: 'Chilas',
        image: 'chilas',
        description: 'A hot, dry waypoint at the meeting of three mountain ranges — Karakoram, Himalaya and Hindu Kush.',
        hoursFromPrevious: 4,
        canOvernight: true,
      },
      {
        id: 'gilgit',
        name: 'Gilgit',
        image: 'gilgit',
        description: 'The regional hub — the last real town before the road climbs into Hunza proper.',
        hoursFromPrevious: 3,
        canOvernight: true,
      },
    ],
  },
  {
    id: 'islamabad-skardu',
    from: 'Islamabad',
    to: 'Skardu',
    regionId: 'skardu',
    totalKm: 720,
    totalHours: 18,
    waypoints: [
      {
        id: 'besham-skardu-leg',
        name: 'Besham',
        image: 'besham',
        description: 'Same first stop as the Hunza route — the KKH corridor is shared this far north.',
        hoursFromPrevious: 6,
        canOvernight: true,
      },
      {
        id: 'chilas-skardu-leg',
        name: 'Chilas',
        image: 'chilas',
        description: 'Where the Skardu road splits east off the KKH, away from the Hunza-bound traffic.',
        hoursFromPrevious: 4,
        canOvernight: true,
      },
      {
        id: 'skardu-road',
        name: 'Skardu Road (Indus Valley)',
        image: 'skardu-road',
        description: 'A long, dramatic stretch along the Indus gorge — the final approach into Baltistan.',
        hoursFromPrevious: 5,
        canOvernight: false,
      },
    ],
  },
  {
    id: 'islamabad-fairy-meadows',
    from: 'Islamabad',
    to: 'Fairy Meadows',
    regionId: 'fairy-meadows',
    totalKm: 480,
    totalHours: 13,
    waypoints: [
      {
        id: 'besham-fm-leg',
        name: 'Besham',
        image: 'besham',
        description: 'A shared first stop with the Hunza and Skardu routes.',
        hoursFromPrevious: 6,
        canOvernight: true,
      },
      {
        id: 'chilas-fm-leg',
        name: 'Chilas',
        image: 'chilas',
        description: 'The last full-size town before the turnoff toward Nanga Parbat.',
        hoursFromPrevious: 4,
        canOvernight: true,
      },
      {
        id: 'fairy-meadows-jeep',
        name: 'Fairy Meadows (jeep + trek)',
        image: 'group-expeditions',
        description: 'A rough jeep track to Raikot Bridge, then a short trek up to the meadows themselves — no vehicle access beyond this point.',
        hoursFromPrevious: 3,
        canOvernight: true,
      },
    ],
  },
  {
    id: 'islamabad-naran',
    from: 'Islamabad',
    to: 'Naran',
    regionId: 'naran',
    totalKm: 260,
    totalHours: 7,
    waypoints: [
      {
        id: 'abbottabad',
        name: 'Abbottabad',
        image: 'abbottabad',
        description: 'A quick, comfortable first leg out of Islamabad — the gateway to the Kaghan Valley road.',
        hoursFromPrevious: 2,
        canOvernight: false,
      },
      {
        id: 'balakot',
        name: 'Balakot',
        image: 'balakot',
        description: 'The valley properly begins here — the road follows the Kunhar River from this point on.',
        hoursFromPrevious: 2,
        canOvernight: true,
      },
      {
        id: 'kaghan',
        name: 'Kaghan',
        image: 'kaghan',
        description: 'A quieter alternative base to Naran itself, a short drive further down the valley.',
        hoursFromPrevious: 2,
        canOvernight: true,
      },
    ],
  },
];
