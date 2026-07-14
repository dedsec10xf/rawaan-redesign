import { destinations } from '@/data/destinations';

const destinationsById = new Map(destinations.map((d) => [d.id, d]));

// Step config for the 7-step trip builder (/build). One source of truth for
// the rail and Build.jsx so labels/required-fields logic never drift apart
// across files. Replaces the old 5-step planner entirely.
export const STEPS = [
  { id: 1, label: 'Destination' },
  { id: 2, label: 'Travellers' },
  { id: 3, label: 'Ride' },
  { id: 4, label: 'Route' },
  { id: 5, label: 'Hotels' },
  { id: 6, label: 'Experiences' },
  { id: 7, label: 'Review' },
];

// validity per step, 0-indexed to match STEPS. Required fields:
//   1 Destination  — a destination picked
//   2 Travellers   — a departure date (dates.start); nights/guests always
//                    have defaults, so they never block Continue on their own
//   3 Ride         — a vehicle picked
//   4 Route        — none (overnight stops are optional add-ons)
//   5 Hotels       — a hotel picked FOR THE CHOSEN DESTINATION's region
//                    (hotelSelections is keyed by regionId, not destinationId)
//   6 Experiences  — none (the pool is optional to add to; always valid)
//   7 Review       — always false; terminal action step, not a fill-in-
//                    fields step (same reasoning as the old 5-step Review)
export function getStepValidity(state) {
  const destination = destinationsById.get(state.destinationId);
  return [
    Boolean(state.destinationId),
    Boolean(state.dates.start),
    Boolean(state.vehicleId),
    true,
    Boolean(destination && state.hotelSelections[destination.regionId]),
    true,
    false,
  ];
}

// Reason shown next to a disabled Next button — every step with a required
// field must explain what's missing rather than present a dead-looking
// button. Steps 4/6 never call this (no required field). Step 7 has no
// Next — the CTA inside StepReview replaces it.
export function getNextHelper(step, validity) {
  if (step === 1 && !validity[0]) return 'Pick a destination to continue.';
  if (step === 2 && !validity[1]) return 'Choose your departure date to continue.';
  if (step === 3 && !validity[2]) return 'Choose a vehicle to continue.';
  if (step === 5 && !validity[4]) return 'Choose a hotel to continue.';
  return undefined;
}

// Landing step for a fresh /build visit:
//   - a tour/package already loaded (arrived via "Customize this trip") →
//     land straight on 7 (Review). loadTour/loadPackage already populate a
//     full itinerary from the tour's own authored phases — the Destination/
//     Ride/Route/Hotels steps are about building a self-drive trip from
//     scratch and don't apply to an already-curated tour.
//   - every required field is already filled → land on 7 (Review) too —
//     covers a returning visit to an already-complete trip AND the floating
//     Trip Summary panel's "Continue planning" CTA, which always navigates
//     to plain /build and relies on this to route a finished trip straight
//     to Review instead of restarting the form.
//   - cold visit → step 1.
export function getLandingStep(state) {
  if (state.baseTourId) return 7;
  const validity = getStepValidity(state);
  if (validity[0] && validity[1] && validity[2] && validity[4]) return 7;
  return 1;
}
