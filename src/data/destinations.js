// Canonical destination list for the 7-step trip builder (/build). This is
// a DELIBERATELY SEPARATE, smaller concept from tours.js's `region` field
// (which spans 7 regions across 9 curated tours) — the builder is a
// self-drive road-trip planner (route + vehicle + waypoint hotels), and only
// these 4 destinations currently have a full route (routes.js) AND hotel
// picklist (hotels.js) to actually drive Steps 3–5. tripStore's existing
// `destination` (string[], tour-region based) is untouched and keeps
// serving Hero's planner widget and "Customize this trip" exactly as
// before; this feeds a new, separate `destinationId` field.
//
// `regionId` links to data/hotels.js's `region` and data/vehicles.js's
// `suitableFor`. `routeId` links to data/routes.js's `id`. `bestSeason` is
// invented, plausible demo data — not a client-provided figure.
export const destinations = [
  {
    id: 'hunza',
    regionId: 'hunza',
    routeId: 'islamabad-hunza',
    name: 'Hunza',
    corridor: 'Karakoram Highway',
    tagline: 'Terraced orchards, Karakoram peaks, and the easiest pace in the north.',
    image: 'hunza',
    bestSeason: 'April – October',
  },
  {
    id: 'skardu',
    regionId: 'skardu',
    routeId: 'islamabad-skardu',
    name: 'Skardu',
    corridor: 'Karakoram Highway',
    tagline: 'The gateway to K2 and the Baltoro — dramatic, high, and remote.',
    image: 'skardu',
    bestSeason: 'May – September',
  },
  {
    id: 'fairy-meadows',
    regionId: 'fairy-meadows',
    routeId: 'islamabad-fairy-meadows',
    name: 'Fairy Meadows',
    corridor: 'Karakoram Highway',
    tagline: 'A meadow at the foot of Nanga Parbat, reachable only by jeep and foot.',
    image: 'group-expeditions',
    bestSeason: 'June – September',
  },
  {
    id: 'naran',
    regionId: 'naran',
    routeId: 'islamabad-naran',
    name: 'Naran',
    corridor: 'Kaghan Valley',
    tagline: "The Kaghan Valley's easiest high-altitude escape from Islamabad.",
    image: 'naran',
    bestSeason: 'May – September',
  },
];
