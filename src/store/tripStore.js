import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { tours } from '@/data/tours';
import { packages } from '@/data/packages';
import { experiences } from '@/data/experiences';
import { vehicles } from '@/data/vehicles';
import { hotels } from '@/data/hotels';
import { destinations } from '@/data/destinations';
import { routes } from '@/data/routes';
import { expandPhases, buildPackageItinerary, buildRouteItinerary } from '@/lib/itinerary';
import { usdToPkr } from '@/lib/currency';

const experiencesById = new Map(experiences.map((e) => [e.id, e]));
const toursById = new Map(tours.map((t) => [t.id, t]));
const packagesById = new Map(packages.map((p) => [p.id, p]));
const vehiclesById = new Map(vehicles.map((v) => [v.id, v]));
const hotelsById = new Map(hotels.map((h) => [h.id, h]));
const destinationsById = new Map(destinations.map((d) => [d.id, d]));
const routesById = new Map(routes.map((r) => [r.id, r]));

// Rawaan's cut on a self-built trip — invented demo rate, not a real fee
// schedule, same status as every other invented figure in the data layer.
const CURATION_FEE_RATE = 0.04;

// nights, in priority order: the 7-step builder's own explicit stepper
// value (state.nights) first — it's a direct user choice and shouldn't be
// silently overridden by a date-range diff; then an explicit dates.start/end
// range (the OLD Hero widget flow); then a loaded tour/package's minimum
// duration, so the summary shows something useful before either is set.
function resolveNights({ explicitNights, dates, tour, pkg }) {
  if (explicitNights != null) return Math.max(0, explicitNights);
  if (dates.start && dates.end) {
    const ms = new Date(dates.end) - new Date(dates.start);
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
  }
  const minDays = tour?.durationDays?.[0] ?? pkg?.durationDays?.[0];
  return minDays ? Math.max(0, minDays - 1) : 0;
}

// Per-day hotel class (Journey Timeline, planner step 5) — a day's tier
// defaults to 'Standard' when unset (the tour's authored `hotel` string is
// already priced into priceUSD; this only prices an UPGRADE over that
// baseline, not a full nightly rate, so Standard stays $0). Figures are
// invented demo data, same status as tours.js's ratings — not client-provided.
export const HOTEL_CLASSES = ['Standard', 'Deluxe', 'Luxury'];
export const HOTEL_CLASS_STARS = { Standard: 3, Deluxe: 4, Luxury: 5 };
const HOTEL_CLASS_UPCHARGE_PER_NIGHT = { Standard: 0, Deluxe: 40, Luxury: 100 };

// Per-day ground transport vehicle (Journey Timeline, planner step 5) — a
// fixed vehicle picklist rather than the free-text `transport` string tours
// author (e.g. "Domestic flight / 4x4"). The day's own `transport` text is
// left untouched (still shown/editable) since it can describe flights/trek
// legs a vehicle picklist can't express; this is a quick, single-click way
// to record ground-vehicle preference on top of that.
export const TRANSPORT_MODES = ['Prado 4x4', 'BRV', 'Bus'];

// Fields a fresh trip starts with. Kept separate from the store definition so
// `reset()` and the initial `create()` state share one literal instead of
// drifting apart.
const INITIAL_FIELDS = {
  destination: [], // multi-select tour-region strings — Hero's widget + "Customize this trip" (loadTour/loadPackage). Untouched by the 7-step builder below.
  category: null,
  dates: { start: null, end: null }, // dates.start = the 7-step builder's departure date; dates.end is only ever set by the OLD Hero widget flow
  groupSize: 2,
  budget: null,
  travelStyle: null,
  notes: '', // free-text special requests / premium add-ons, from planner step 4 (Style & Notes)
  baseTourId: null,
  selectedExperienceIds: [],
  itinerary: [],
  // 7-step builder (its own track — see data/destinations.js's file comment
  // for why this is deliberately separate from `destination` above).
  destinationId: null, // data/destinations.js id
  nights: 2, // explicit stepper value, defaulted like groupSize — takes priority over dates.start/end's day-diff in useSummary/useBreakdown
  vehicleId: null, // data/vehicles.js id
  roomCount: 1,
  hotelSelections: {}, // { [regionId]: hotelId } — data/hotels.js
  overnightStops: [], // waypointIds — data/routes.js
  currency: 'PKR', // 'PKR' | 'USD' — display preference, not trip content (see useIsDirty)
};

// Renumbers a concatenated itinerary to a clean 1..N sequence. Used by
// loadTour/loadPackage/removeDay — none of them should leave gaps or
// out-of-order day numbers for the Journey Timeline (V7) to render.
const renumber = (days) => days.map((d, i) => ({ ...d, day: i + 1 }));

// Regenerates the 7-step builder's itinerary from its own current choices —
// called by every step 1-5 action that touches destinationId/nights/
// vehicleId/overnightStops/hotelSelections, REPLACING itinerary wholesale
// each time (same "reload replaces, doesn't merge" rule as loadTour/
// loadPackage, and for the same reason: the previous rows belonged to a
// different set of choices). Returns [] (a no-op replace) until a
// destination is actually picked — Step 1 must run before there's anything
// to build. NOTE: if the traveler arrived via "Customize this trip"
// (baseTourId set, itinerary already populated by loadTour/loadPackage) and
// then manually navigates back into Steps 1-5, interacting with them WILL
// overwrite that tour's itinerary with a generated one — an accepted edge
// case, not specifically guarded against (the two flows are meant to stay
// separate; see Build.jsx's landing-step logic, which sends a baseTourId
// trip straight to Review so this path isn't hit in normal use).
function regenerateRouteItinerary(state) {
  const destination = destinationsById.get(state.destinationId);
  if (!destination) return [];
  const route = routesById.get(destination.routeId);
  if (!route) return [];

  const vehicle = vehiclesById.get(state.vehicleId);
  const hotelId = state.hotelSelections[destination.regionId];
  const hotel = hotelId ? hotelsById.get(hotelId) : undefined;

  return buildRouteItinerary({
    destination,
    route,
    overnightStopIds: state.overnightStops,
    nights: state.nights ?? 0,
    vehicle,
    hotel,
  });
}

export const useTripStore = create(
  persist(
    (set) => ({
      ...INITIAL_FIELDS,

      // Generic setter for the flat planner fields (destination, category,
      // dates, groupSize, budget, travelStyle) — one action instead of one
      // setter per field.
      setField: (key, value) => set({ [key]: value }),

      // 7-step builder actions — each one that changes what the generated
      // itinerary would look like calls regenerateRouteItinerary to keep
      // `itinerary` (the thing the Review-step Timeline actually renders)
      // in sync, rather than leaving it stale until some later step.
      setDestinationId: (id) =>
        set((state) => {
          // Overnight stops belong to the OLD destination's route waypoints
          // — carrying them over would reference waypoint ids that don't
          // exist on the new route at all.
          const next = { ...state, destinationId: id, overnightStops: [] };
          return { destinationId: id, overnightStops: [], itinerary: regenerateRouteItinerary(next) };
        }),

      setNights: (nights) =>
        set((state) => {
          const next = { ...state, nights };
          return { nights, itinerary: regenerateRouteItinerary(next) };
        }),

      setVehicleId: (vehicleId) =>
        set((state) => {
          const next = { ...state, vehicleId };
          return { vehicleId, itinerary: regenerateRouteItinerary(next) };
        }),

      toggleOvernightStop: (waypointId) =>
        set((state) => {
          const overnightStops = state.overnightStops.includes(waypointId)
            ? state.overnightStops.filter((id) => id !== waypointId)
            : [...state.overnightStops, waypointId];
          const next = { ...state, overnightStops };
          return { overnightStops, itinerary: regenerateRouteItinerary(next) };
        }),

      setHotelSelection: (regionId, hotelId) =>
        set((state) => {
          const hotelSelections = { ...state.hotelSelections, [regionId]: hotelId };
          const next = { ...state, hotelSelections };
          return { hotelSelections, itinerary: regenerateRouteItinerary(next) };
        }),

      toggleExperience: (id) =>
        set((state) => ({
          selectedExperienceIds: state.selectedExperienceIds.includes(id)
            ? state.selectedExperienceIds.filter((existing) => existing !== id)
            : [...state.selectedExperienceIds, id],
        })),

      // Preloads a tour: its own included experiences pre-ticked, its
      // itinerary EXPANDED to real day rows (lib/itinerary.js's
      // expandPhases — tours.js only authors phases) as the editable
      // starting point (the core loop — see CLAUDE.md). Re-loading a
      // different tour replaces the previous selection/itinerary rather
      // than merging, since they belonged to a different base trip.
      loadTour: (id) => {
        const tour = toursById.get(id);
        if (!tour) return;
        set({
          baseTourId: tour.id,
          destination: [tour.region],
          category: tour.category,
          selectedExperienceIds: [...tour.includedExperienceIds],
          itinerary: renumber(expandPhases(tour)),
        });
      },

      // A package has no itinerary/experiences of its own — it's a bundle of
      // tourIds. buildPackageItinerary (lib/itinerary.js) does the
      // expand+splice+renumber; it's a standalone pure function (not inlined
      // here) so TourDetail (V9) can build the SAME package's itinerary for
      // display without going through the store at all.
      loadPackage: (id) => {
        const pkg = packagesById.get(id);
        if (!pkg) return;
        const includedTours = pkg.includes.map((tourId) => toursById.get(tourId)).filter(Boolean);
        const mergedItinerary = buildPackageItinerary(pkg, toursById);
        const mergedExperienceIds = [...new Set(includedTours.flatMap((t) => t.includedExperienceIds))];
        set({
          baseTourId: pkg.id,
          destination: [pkg.region],
          category: pkg.category,
          selectedExperienceIds: mergedExperienceIds,
          itinerary: mergedItinerary,
        });
      },

      // Day-level experience assignment (Journey Timeline). Adding an
      // experience to a specific day also adds it to the trip-level
      // selectedExperienceIds pool if it isn't there yet, since scheduling it
      // implies wanting it on the trip. Removing it from a day is scheduling
      // ONLY — it does NOT drop it from selectedExperienceIds, since the
      // traveler's trip-wide "I want this" choice (made in step 3) shouldn't
      // silently reverse just because they unscheduled one day slot; step 3's
      // own toggle remains the one way to remove it from the trip entirely.
      toggleDayExperience: (day, experienceId) =>
        set((state) => {
          const itinerary = state.itinerary.map((d) => {
            if (d.day !== day) return d;
            const has = d.experienceIds.includes(experienceId);
            return {
              ...d,
              experienceIds: has
                ? d.experienceIds.filter((id) => id !== experienceId)
                : [...d.experienceIds, experienceId],
            };
          });
          const nowAssigned = itinerary.find((d) => d.day === day)?.experienceIds.includes(experienceId);
          const selectedExperienceIds =
            nowAssigned && !state.selectedExperienceIds.includes(experienceId)
              ? [...state.selectedExperienceIds, experienceId]
              : state.selectedExperienceIds;
          return { itinerary, selectedExperienceIds };
        }),

      addDay: (partialDay = {}) =>
        set((state) => ({
          itinerary: [...state.itinerary, { day: state.itinerary.length + 1, experienceIds: [], ...partialDay }],
        })),

      editDay: (day, updates) =>
        set((state) => ({
          itinerary: state.itinerary.map((d) => (d.day === day ? { ...d, ...updates } : d)),
        })),

      removeDay: (day) =>
        set((state) => ({
          itinerary: renumber(state.itinerary.filter((d) => d.day !== day)),
        })),

      reset: () => set({ ...INITIAL_FIELDS }),
    }),
    {
      name: 'rawaan-trip', // sessionStorage key
      storage: createJSONStorage(() => sessionStorage),
      // v1: `destination` changed from a single string|null to a string[]
      // (multi-select regions). A session persisted under the old shape
      // would otherwise rehydrate with a stale string and crash the first
      // `.map`/`.includes` call — coerce it forward instead.
      version: 1,
      migrate: (persistedState, version) => {
        if (version < 1 && persistedState && typeof persistedState === 'object') {
          const { destination } = persistedState;
          persistedState.destination = Array.isArray(destination) ? destination : destination ? [destination] : [];
        }
        return persistedState;
      },
    },
  ),
);

// nights: from explicit dates if both are set; otherwise falls back to the
// loaded tour/package's minimum duration (days − 1 night), so the summary
// shows something useful before the user has picked exact dates. This stays
// consistent with the now-expanded `itinerary` (dayCount below): each tour's
// phases are authored to sum exactly to durationDays[0], so a freshly loaded
// tour has dayCount === durationDays[0] and nights === dayCount − 1 — verified
// by hand against all 9 tours' phase durationDays when they were added.
// travelers: groupSize, floored at 1.
// estimatedCost: (base price per person + sum of selected experience prices
// per person) × travelers. Base price = the loaded package's flat priceUSD,
// or a loaded tour's priceUSD[0] (the same minimum the "From $X" card
// treatment already uses) — 0 if nothing is loaded yet.
// breakdown: the itemised PKR line-by-line summary (7-step planner data
// foundation — no summary-panel UI reads this yet). Deliberately a SEPARATE
// field from the fields above rather than a replacement: estimatedCost is
// USD-only and already shipped to real UI (StepReview's Counter,
// TripSummaryPanel) — changing its formula would regress those. `breakdown`
// is the new, richer PKR-native total for whatever consumes it next.
//   items: [{ label, sublabel, amountPKR }] — one row per priced thing
//     (base trip, vehicle, each selected hotel, each selected experience),
//     PLUS the curation fee as its own row — the whole array is meant to be
//     mapped directly by a summary panel, no separate fee line to splice in.
//   subtotalPKR: sum of every row EXCEPT the curation fee.
//   curationFeePKR: CURATION_FEE_RATE × subtotalPKR (already the last item
//     in `items` too — exposed again here since a panel likely wants it
//     without re-deriving it from the array).
//   totalPKR: subtotal + curation fee.
//   perPersonPKR: totalPKR ÷ travelers.
// Base trip price and experiencesTotal (used by the legacy estimatedCost
// above) stay USD, converted via lib/currency's ONE demo FX rate only where
// PKR is needed (the base trip row) — experiences/vehicles/hotels are
// authored in PKR natively (pricePerPersonPKR / pricePerDayPKR /
// pricePerNightPKR), not converted.
function buildBreakdown(
  { vehicleId, roomCount, hotelSelections, selectedExperienceIds },
  { travelers, nights, dayCount, basePrice, tour, pkg },
) {
  const items = [];

  if (tour || pkg) {
    const basePricePKR = usdToPkr(basePrice);
    items.push({
      label: (tour ?? pkg).name,
      sublabel: `Base trip price × ${travelers} traveler${travelers === 1 ? '' : 's'}`,
      amountPKR: basePricePKR * travelers,
    });
  }

  const vehicle = vehiclesById.get(vehicleId);
  if (vehicle) {
    const tripDays = Math.max(1, dayCount || nights + 1 || 1);
    items.push({
      label: vehicle.name,
      sublabel: `${tripDays} day${tripDays === 1 ? '' : 's'} × Rs ${vehicle.pricePerDayPKR.toLocaleString()} · driver & fuel included`,
      amountPKR: tripDays * vehicle.pricePerDayPKR,
    });
  }

  const rooms = Math.max(1, roomCount || 1);
  for (const hotelId of Object.values(hotelSelections)) {
    const hotel = hotelsById.get(hotelId);
    if (!hotel) continue;
    const hotelNights = Math.max(1, nights || 1);
    items.push({
      label: hotel.name,
      sublabel: `${hotelNights} night${hotelNights === 1 ? '' : 's'} × Rs ${hotel.pricePerNightPKR.toLocaleString()} × ${rooms} room${rooms === 1 ? '' : 's'}`,
      amountPKR: hotelNights * hotel.pricePerNightPKR * rooms,
    });
  }

  for (const id of selectedExperienceIds) {
    const experience = experiencesById.get(id);
    if (!experience?.pricePerPersonPKR) continue;
    items.push({
      label: experience.name,
      sublabel: `Rs ${experience.pricePerPersonPKR.toLocaleString()} × ${travelers} traveler${travelers === 1 ? '' : 's'}`,
      amountPKR: experience.pricePerPersonPKR * travelers,
    });
  }

  const subtotalPKR = items.reduce((sum, item) => sum + item.amountPKR, 0);
  const curationFeePKR = Math.round(subtotalPKR * CURATION_FEE_RATE);
  items.push({
    label: 'Rawaan curation fee',
    sublabel: `${Math.round(CURATION_FEE_RATE * 100)}% of subtotal`,
    amountPKR: curationFeePKR,
  });
  const totalPKR = subtotalPKR + curationFeePKR;
  const perPersonPKR = Math.round(totalPKR / travelers);

  return { items, subtotalPKR, curationFeePKR, totalPKR, perPersonPKR };
}

// breakdown is deliberately NOT computed inside useSummary's useShallow
// selector below — useShallow only compares TOP-LEVEL keys of the selector's
// return value, and `breakdown` (an object containing a freshly-built array)
// is a NEW reference on literally every call. That defeats useShallow's
// whole purpose for this one key: it would read as "changed" on every single
// store update anywhere in the app (not just summary-relevant ones), causing
// every useSummary() consumer to re-render constantly — and badly enough,
// once (an uncaught runaway update loop, since TripSummaryPanel calls
// useSummary() from OUTSIDE App.jsx's ErrorBoundary), it blanked the entire
// page instead of showing an error screen.
//
// The fix: subscribe to each RAW field breakdown actually depends on
// individually (each of these selectors returns either a primitive or the
// SAME object/array reference until that exact field is reassigned by a
// `set()` call — zustand's default Object.is equality is correct for that),
// then let React's useMemo — not zustand — decide when to actually recompute
// the derived array. This is the general lesson: derive expensive
// arrays/objects in a memo keyed off stable field subscriptions, never
// inside a useShallow selector itself.
function useBreakdown() {
  const vehicleId = useTripStore((s) => s.vehicleId);
  const roomCount = useTripStore((s) => s.roomCount);
  const hotelSelections = useTripStore((s) => s.hotelSelections);
  const selectedExperienceIds = useTripStore((s) => s.selectedExperienceIds);
  const baseTourId = useTripStore((s) => s.baseTourId);
  const dates = useTripStore((s) => s.dates);
  const explicitNights = useTripStore((s) => s.nights);
  const groupSize = useTripStore((s) => s.groupSize);
  const itinerary = useTripStore((s) => s.itinerary);

  return useMemo(() => {
    const travelers = Math.max(1, groupSize || 1);
    const tour = toursById.get(baseTourId);
    const pkg = !tour ? packagesById.get(baseTourId) : undefined;
    const nights = resolveNights({ explicitNights, dates, tour, pkg });
    const basePrice = pkg?.priceUSD ?? tour?.priceUSD?.[0] ?? 0;

    return buildBreakdown(
      { vehicleId, roomCount, hotelSelections, selectedExperienceIds },
      { travelers, nights, dayCount: itinerary.length, basePrice, tour, pkg },
    );
  }, [vehicleId, roomCount, hotelSelections, selectedExperienceIds, baseTourId, dates, explicitNights, groupSize, itinerary]);
}

export function useSummary() {
  const summary = useTripStore(
    useShallow((state) => {
      const { dates, groupSize, baseTourId, selectedExperienceIds, itinerary, nights: explicitNights } = state;
      const travelers = Math.max(1, groupSize || 1);

      const tour = toursById.get(baseTourId);
      const pkg = !tour ? packagesById.get(baseTourId) : undefined;
      const nights = resolveNights({ explicitNights, dates, tour, pkg });
      const basePrice = pkg?.priceUSD ?? tour?.priceUSD?.[0] ?? 0;
      const experiencesTotal = selectedExperienceIds.reduce(
        (sum, id) => sum + (experiencesById.get(id)?.priceUSD ?? 0),
        0,
      );
      const hotelUpchargeTotal = itinerary.reduce(
        (sum, d) => sum + (HOTEL_CLASS_UPCHARGE_PER_NIGHT[d.hotelClass] ?? 0),
        0,
      );
      const estimatedCost = (basePrice + experiencesTotal + hotelUpchargeTotal) * travelers;

      return {
        nights,
        travelers,
        experienceCount: selectedExperienceIds.length,
        estimatedCost,
        dayCount: itinerary.length,
      };
    }),
  );
  const breakdown = useBreakdown();

  return { ...summary, breakdown };
}

// isDirty: computed, not a stored flag — deriving it from the fields
// themselves means every action that touches state automatically keeps it
// correct, instead of every action having to remember to flip a flag.
// `currency` is deliberately EXCLUDED — it's a display preference (which
// unit to render existing numbers in), not trip content, so switching it
// alone shouldn't make an otherwise-empty trip look "in progress."
export function useIsDirty() {
  return useTripStore((state) => {
    const fieldsChanged =
      state.destination.length > 0 ||
      state.category !== INITIAL_FIELDS.category ||
      state.dates.start !== null ||
      state.dates.end !== null ||
      state.groupSize !== INITIAL_FIELDS.groupSize ||
      state.budget !== INITIAL_FIELDS.budget ||
      state.travelStyle !== INITIAL_FIELDS.travelStyle ||
      state.notes !== INITIAL_FIELDS.notes ||
      state.baseTourId !== INITIAL_FIELDS.baseTourId ||
      state.destinationId !== INITIAL_FIELDS.destinationId ||
      state.nights !== INITIAL_FIELDS.nights ||
      state.vehicleId !== INITIAL_FIELDS.vehicleId ||
      state.roomCount !== INITIAL_FIELDS.roomCount;
    return (
      fieldsChanged ||
      state.selectedExperienceIds.length > 0 ||
      state.itinerary.length > 0 ||
      Object.keys(state.hotelSelections).length > 0 ||
      state.overnightStops.length > 0
    );
  });
}
