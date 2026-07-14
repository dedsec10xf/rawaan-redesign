// Expands a tour's phase-based itinerary (tours.js authors 4–5 milestone
// phases, each with a `durationDays` span) into real day rows — one object
// per calendar day, not per phase. A phase's own fields repeat across every
// day it spans (you're doing the glacier trek on each of those days, not
// just the first), except `title`, which gets a "(Day n of N)" suffix on
// multi-day phases so consecutive rows read as one phase, not N unrelated
// entries.
//
//   expandPhases(tours[0]) → [{ day: 1, phaseTitle, title, description, hotel, transport, experienceIds }, ...]
export function expandPhases(tour) {
  const days = [];

  for (const phase of tour.itinerary) {
    const span = phase.durationDays ?? 1;
    for (let i = 0; i < span; i++) {
      days.push({
        day: phase.day + i,
        phaseTitle: phase.title,
        title: span > 1 ? `${phase.title} (Day ${i + 1} of ${span})` : phase.title,
        description: phase.description,
        hotel: phase.hotel,
        transport: phase.transport,
        experienceIds: [...phase.experienceIds],
      });
    }
  }

  return days;
}

// Expands a PACKAGE into real day rows — the same buffer-splicing algorithm
// tripStore.js's loadPackage uses (arrival first, transit between each pair
// of constituent tours, departure last), extracted here as a pure function
// so both the store AND TourDetail (V9 — a package's own itinerary display,
// not just the trip-planning copy) share one implementation instead of two
// copies drifting apart. `toursById` is passed in rather than imported, so
// this file stays free of data-layer imports (same discipline as
// expandPhases above).
//
//   buildPackageItinerary(packages[0], toursById) → [{ day: 1, ... }, ...]
export function buildPackageItinerary(pkg, toursById) {
  const includedTours = pkg.includes.map((tourId) => toursById.get(tourId)).filter(Boolean);
  const { arrival, transit, departure } = pkg.bufferPhases ?? {};
  const expandBuffer = (phase) =>
    phase ? expandPhases({ itinerary: [{ ...phase, day: 1, experienceIds: [] }] }) : [];

  const merged = [
    ...expandBuffer(arrival),
    ...includedTours.flatMap((t, i) => [
      ...expandPhases(t),
      ...(i < includedTours.length - 1 ? expandBuffer(transit) : []),
    ]),
    ...expandBuffer(departure),
  ];

  return merged.map((d, i) => ({ ...d, day: i + 1 }));
}

// Builds day rows for the 7-step builder's self-drive itinerary — the
// outbound leg (one day per chosen overnight stop, or a single "drive
// straight through" day if none are chosen), then one day per night at the
// destination. Unlike expandPhases/buildPackageItinerary (which expand
// AUTHORED tour phases), this GENERATES rows from the traveler's own Route/
// Hotels choices — so it's called by tripStore itself (not just consumed by
// it) every time destinationId/vehicleId/overnightStops/hotelSelections/
// nights changes in steps 1-5, replacing the itinerary wholesale each time
// (same "reload replaces, doesn't merge" rule loadTour/loadPackage already
// follow, for the same reason: the previous itinerary belonged to a
// different set of choices).
//
//   buildRouteItinerary({ destination, route, overnightStopIds: ['chilas'], nights: 3, vehicle, hotel })
export function buildRouteItinerary({ destination, route, overnightStopIds = [], nights = 0, vehicle, hotel }) {
  const days = [];
  const transport = vehicle?.name ?? 'Private vehicle (TBD)';
  const overnightWaypoints = route.waypoints.filter((wp) => overnightStopIds.includes(wp.id));

  if (overnightWaypoints.length === 0) {
    days.push({
      phaseTitle: 'On the road',
      title: `${route.from} to ${destination.name}`,
      description: `A ${route.totalHours}-hour drive along the ${route.from}–${route.to} corridor, covering roughly ${route.totalKm}km in one push.`,
      hotel: null,
      transport,
      experienceIds: [],
    });
  } else {
    let fromLabel = route.from;
    for (const wp of overnightWaypoints) {
      days.push({
        phaseTitle: 'On the road',
        title: `${fromLabel} to ${wp.name}`,
        description: wp.description,
        hotel: 'Arranged by Rawaan',
        transport,
        experienceIds: [],
      });
      fromLabel = wp.name;
    }
    days.push({
      phaseTitle: 'On the road',
      title: `${fromLabel} to ${destination.name}`,
      description: `The final leg into ${destination.name}.`,
      hotel: null,
      transport,
      experienceIds: [],
    });
  }

  for (let i = 0; i < nights; i++) {
    days.push({
      phaseTitle: destination.name,
      title: `${destination.name} — Day ${i + 1}`,
      description: `Free time to explore ${destination.name} at your own pace, with Rawaan on call.`,
      hotel: hotel ? `${hotel.name} (${hotel.tier})` : null,
      hotelClass: hotel?.tier,
      transport: 'On foot / local transport',
      experienceIds: [],
    });
  }

  return days.map((d, i) => ({ day: i + 1, ...d }));
}
