// Hotel picklist for the 7-step planner's accommodation step. Names,
// ratings and pricing are invented, plausible Pakistan hospitality market
// demo data — NOT real Rawaan-vetted properties, same status as tours.js's
// ratings. Every entry now has its own dedicated `image` (post-launch
// photo audit) — each key matches the hotel's own `id` in the registry.
// `chitral` is kept (still valid tour-region hotel data) but isn't one of
// the 4 destinations the 7-step builder's Route step covers — no route
// currently connects to it, so the builder's Hotels step never reaches it.
export const hotels = [
  // --- Hunza ---
  { id: 'old-hunza-inn', name: 'Old Hunza Inn', region: 'hunza', tier: 'Standard', rating: 4.3, pricePerNightPKR: 9000, image: 'old-hunza-inn', blurb: 'A simple guesthouse with Karakoram views from every room.' },
  { id: 'hunza-embassy', name: 'Hunza Embassy Hotel', region: 'hunza', tier: 'Deluxe', rating: 4.6, pricePerNightPKR: 20000, image: 'hunza-embassy', blurb: 'Terraced gardens overlooking the valley, a short walk from Karimabad.' },
  { id: 'hunza-serena', name: 'Hunza Serena Inn', region: 'hunza', tier: 'Luxury', rating: 4.8, pricePerNightPKR: 45000, image: 'hunza-serena', blurb: "Rawaan's top Hunza pick — full-service comfort at altitude." },

  // --- Skardu ---
  { id: 'k2-motel', name: 'K2 Motel', region: 'skardu', tier: 'Standard', rating: 4.2, pricePerNightPKR: 10000, image: 'k2-motel', blurb: 'A trekker-friendly base with easy access to the Skardu bazaar.' },
  { id: 'skardu-continental', name: 'Skardu Continental', region: 'skardu', tier: 'Deluxe', rating: 4.5, pricePerNightPKR: 22000, image: 'skardu-continental', blurb: 'Comfortable rooms and a proper hot shower before or after the trek.' },
  { id: 'shangrila-skardu', name: 'Shangrila Resort Skardu', region: 'skardu', tier: 'Luxury', rating: 4.9, pricePerNightPKR: 50000, image: 'shangrila-skardu', blurb: "The lake-set landmark resort — Skardu's best-known luxury stay." },

  // --- Chitral ---
  { id: 'ptdc-chitral', name: 'PTDC Motel Chitral', region: 'chitral', tier: 'Standard', rating: 4.1, pricePerNightPKR: 8500, image: 'ptdc-chitral', blurb: 'A reliable government-run motel close to the old town.' },
  { id: 'chitral-reserve', name: 'Chitral Reserve', region: 'chitral', tier: 'Deluxe', rating: 4.5, pricePerNightPKR: 18000, image: 'chitral-reserve', blurb: 'Mountain-facing rooms a short drive from the Kalash valleys.' },
  { id: 'hindukush-heights', name: 'Hindukush Heights', region: 'chitral', tier: 'Luxury', rating: 4.8, pricePerNightPKR: 38000, image: 'hindukush-heights', blurb: 'A boutique lodge with the best Tirich Mir views in the valley.' },

  // --- Fairy Meadows ---
  { id: 'fairy-meadows-cottages', name: 'Fairy Meadows Cottages', region: 'fairy-meadows', tier: 'Standard', rating: 4.2, pricePerNightPKR: 8000, image: 'fairy-meadows-cottages', blurb: 'Simple wooden cottages right on the meadow, Nanga Parbat framed from the porch.' },
  { id: 'raikot-sarai', name: 'Raikot Sarai', region: 'fairy-meadows', tier: 'Deluxe', rating: 4.5, pricePerNightPKR: 17000, image: 'raikot-sarai', blurb: 'The most comfortable beds on the meadow, with proper hot water on generator hours.' },
  { id: 'nanga-parbat-view-lodge', name: 'Nanga Parbat View Lodge', region: 'fairy-meadows', tier: 'Luxury', rating: 4.7, pricePerNightPKR: 32000, image: 'nanga-parbat-view-lodge', blurb: "The closest thing to a luxury stay this far off the road — Rawaan's top Fairy Meadows pick." },

  // --- Naran ---
  { id: 'lalazar-inn', name: 'Lalazar Inn', region: 'naran', tier: 'Standard', rating: 4.0, pricePerNightPKR: 9500, image: 'lalazar-inn', blurb: 'A no-frills base right on the Naran main road.' },
  { id: 'park-view-naran', name: 'Park View Hotel Naran', region: 'naran', tier: 'Deluxe', rating: 4.4, pricePerNightPKR: 16000, image: 'park-view-naran', blurb: 'River-facing rooms, a short drive from Saif-ul-Malook.' },
  { id: 'pc-naran', name: 'Pearl Continental Naran', region: 'naran', tier: 'Luxury', rating: 4.7, pricePerNightPKR: 42000, image: 'pc-naran', blurb: 'Full-service luxury at the top of the Kaghan Valley season.' },
];
