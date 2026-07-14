// Ground transport fleet for the 7-step planner's vehicle step (data
// foundation only — no UI reads this yet). Pricing is invented, plausible
// Pakistan self-drive-with-driver rental market demo data (2024-ish rates),
// NOT a real Rawaan rate card — flagged the same way tours.js flags its
// ratings. `suitableFor` uses the same regionId vocabulary as data/hotels.js
// and data/routes.js (matching assets/images/index.js's region keys where
// possible — hunza/skardu/chitral/naran/swat/lahore — plus 'islamabad' and
// 'gilgit-baltistan' for the two that aren't their own homepage region tile).
export const vehicles = [
  {
    id: 'corolla',
    name: 'Toyota Corolla',
    type: 'Sedan',
    seats: 4,
    pricePerDayPKR: 9000,
    image: 'corolla',
    tags: ['AC & heater', 'Best fuel economy', 'City & plains only'],
    note: 'Not recommended beyond Naran — mountain roads need higher clearance.',
    suitableFor: ['islamabad', 'lahore'],
  },
  {
    id: 'brv',
    name: 'Honda BR-V',
    type: 'Crossover',
    seats: 6,
    pricePerDayPKR: 12500,
    image: 'adventure',
    tags: ['AC & heater', 'Good luggage space', 'Comfortable on hill roads'],
    note: 'Fine for Naran and Swat; a 4x4 is a better call beyond Chilas.',
    suitableFor: ['islamabad', 'lahore', 'swat', 'naran'],
  },
  {
    id: 'prado',
    name: 'Toyota Prado',
    type: '4x4 SUV',
    seats: 6,
    pricePerDayPKR: 25000,
    image: 'prado',
    tags: ['4x4 drivetrain', 'High ground clearance', 'Good luggage space'],
    note: 'The standard choice for Hunza, Skardu, Chitral and Gilgit-Baltistan roads.',
    suitableFor: ['hunza', 'skardu', 'chitral', 'naran', 'gilgit-baltistan', 'fairy-meadows'],
  },
  {
    id: 'land-cruiser',
    name: 'Toyota Land Cruiser',
    type: '4x4 SUV',
    seats: 6,
    pricePerDayPKR: 35000,
    image: 'land-cruiser',
    tags: ['4x4 drivetrain', 'Premium interior', 'Best ride comfort on rough roads'],
    note: 'A premium upgrade over the Prado for the same routes — same clearance, more comfort.',
    suitableFor: ['hunza', 'skardu', 'chitral', 'naran', 'gilgit-baltistan', 'fairy-meadows'],
  },
  {
    id: 'hiace',
    name: 'Toyota Hiace',
    type: 'Hiace Van',
    seats: 12,
    pricePerDayPKR: 18000,
    image: 'hiace',
    tags: ['Best for groups', 'AC & heater', 'Large luggage capacity'],
    note: 'Not ideal on narrow switchbacks beyond Chilas — fine for Naran, Swat and the plains.',
    suitableFor: ['islamabad', 'lahore', 'swat', 'naran'],
  },
];
