import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, PartyPopper, Send } from 'lucide-react';
import { Button, Counter } from '@/components/primitives';
import { useTripStore, useSummary } from '@/store/tripStore';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { tours } from '@/data/tours';
import { packages } from '@/data/packages';
import { destinations } from '@/data/destinations';
import { vehicles } from '@/data/vehicles';
import { hotels } from '@/data/hotels';
import { formatAmountPKR } from '@/lib/currency';
import { Timeline } from './timeline/Timeline';
import { LeadForm } from './LeadForm';
import { BreakdownRows } from './BreakdownRows';
import { StepIntro } from './StepIntro';

const toursById = new Map(tours.map((t) => [t.id, t]));
const packagesById = new Map(packages.map((p) => [p.id, p]));
const destinationsById = new Map(destinations.map((d) => [d.id, d]));
const vehiclesById = new Map(vehicles.map((v) => [v.id, v]));
const hotelsById = new Map(hotels.map((h) => [h.id, h]));

function formatDate(dateStr) {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// Downloads the trip as a JSON file — a real client-side download (not a
// no-op), just not a PDF: rendering a formatted PDF is out of scope for this
// delivery and JSON is a truthful stand-in that still gives the user
// something they can actually save and reopen.
function downloadSummary(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rawaan-journey-summary.json';
  a.click();
  URL.revokeObjectURL(url);
}

// SummaryRow — label/value with an optional "Edit" link back to the step
// that owns the field, so Review reads as a checkpoint you can still act on,
// not a dead end.
function SummaryRow({ label, value, onEdit }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-0">
      <div>
        <p className="label text-slate">{label}</p>
        <p className="mt-0.5 font-sans text-body text-navy">{value}</p>
      </div>
      {onEdit && (
        <button type="button" onClick={onEdit} className="shrink-0 text-small text-cyan-deep underline-offset-4 hover:underline">
          Edit
        </button>
      )}
    </div>
  );
}

// Step 7 — Review, the payoff of the whole flow: a checkpoint summary (now
// wired to the 7-step builder's own fields — destination/vehicle/hotel/
// route, not the old 5-step planner's category/travelStyle), the editable
// Journey Timeline, and the lead-capture CTA that closes the loop.
//
// Sub-blocks use bg-mist (not bg-white) — Build.jsx wraps every step in its
// own white rounded-2xl card, so a bg-white block in here would sit
// invisibly on a bg-white parent. bg-mist reads as a soft inset panel
// instead, same convention LeadCard already uses for its own form surface.
export function StepReview({ goToStep }) {
  const state = useTripStore((s) => s);
  const summary = useSummary();
  const reduced = usePrefersReducedMotion();
  const [showForm, setShowForm] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);

  const base = state.baseTourId ? toursById.get(state.baseTourId) ?? packagesById.get(state.baseTourId) : null;
  const destination = destinationsById.get(state.destinationId);
  const vehicle = vehiclesById.get(state.vehicleId);
  const selectedHotel = destination ? hotelsById.get(state.hotelSelections[destination.regionId]) : undefined;

  const handleSubmitLead = (lead) => {
    const payload = {
      trip: {
        destinationId: state.destinationId,
        dates: state.dates,
        nights: state.nights,
        groupSize: state.groupSize,
        vehicleId: state.vehicleId,
        roomCount: state.roomCount,
        hotelSelections: state.hotelSelections,
        overnightStops: state.overnightStops,
        notes: state.notes,
        baseTourId: state.baseTourId,
        selectedExperienceIds: state.selectedExperienceIds,
        itinerary: state.itinerary,
        summary,
      },
      lead,
      submittedAt: new Date().toISOString(),
    };
    // Future-CRM hook — no backend this delivery, so the payload just needs
    // to be inspectable, not actually sent anywhere yet.
    console.log('[Rawaan lead submission]', payload);
    setSubmittedLead({ ...lead, payload });
  };

  if (submittedLead) {
    return (
      <div aria-live="polite" className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-mist p-10 text-center">
        <PartyPopper size={32} strokeWidth={1.5} className="text-cyan-deep" aria-hidden="true" />
        <h2 className="font-display text-h2 text-navy">Your journey has been sent</h2>
        <p className="max-w-md text-body text-slate">
          A Rawaan specialist will reply within 24 hours at {submittedLead.email}.
        </p>
        <Button variant="ghost" icon={Download} onClick={() => downloadSummary(submittedLead.payload)}>
          Download summary
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <StepIntro
        number={7}
        name="Review"
        heading="Everything, in one place"
        copy="Check every choice below, edit anything that's not quite right, then send it — a real person picks this up from here, not a booking engine."
      />

      <div className="rounded-2xl border border-line bg-mist p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-h3 text-navy">Trip summary</h2>
          <p className="font-display text-h3 text-cyan-deep">
            <Counter value={summary.breakdown.totalPKR} prefix="Rs " />
          </p>
        </div>
        <div className="mt-2">
          {base && <SummaryRow label="Based on" value={base.name} />}
          <SummaryRow label="Destination" value={destination?.name ?? 'Not set'} onEdit={() => goToStep?.(1)} />
          <SummaryRow
            label="Travellers"
            value={`${formatDate(state.dates.start)} · ${state.nights ?? 0} nights · ${summary.travelers} traveler${summary.travelers === 1 ? '' : 's'}`}
            onEdit={() => goToStep?.(2)}
          />
          <SummaryRow label="Ride" value={vehicle?.name ?? 'Not set'} onEdit={() => goToStep?.(3)} />
          <SummaryRow
            label="Route"
            value={`${state.overnightStops.length} overnight stop${state.overnightStops.length === 1 ? '' : 's'} added`}
            onEdit={() => goToStep?.(4)}
          />
          <SummaryRow label="Hotel" value={selectedHotel ? `${selectedHotel.name} (${selectedHotel.tier})` : 'Not set'} onEdit={() => goToStep?.(5)} />
          <SummaryRow label="Experiences" value={`${summary.experienceCount} added`} onEdit={() => goToStep?.(6)} />
        </div>

        <div className="mt-6 border-t border-line pt-4">
          <h3 className="label text-slate">Itemised total</h3>
          <div className="mt-2">
            <BreakdownRows items={summary.breakdown.items} currency={state.currency} />
          </div>
          <p className="mt-2 text-small text-slate">
            ≈ {formatAmountPKR(summary.breakdown.perPersonPKR, state.currency)} per person
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-h2 text-navy">Your journey</h2>
        <p className="mt-2 max-w-prose text-body text-slate">
          Every day is editable — add or remove experiences, change the hotel class, or add a day of your own.
        </p>
        <div className="mt-6">
          <Timeline />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-mist p-6">
        <AnimatePresence mode="wait" initial={false}>
          {!showForm ? (
            <motion.div
              key="cta"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-start gap-3"
            >
              <h2 className="font-display text-h3 text-navy">Ready to plan this trip?</h2>
              <p className="text-body text-slate">Send your journey to Rawaan and a specialist will follow up.</p>
              <Button icon={Send} onClick={() => setShowForm(true)}>
                Send to Rawaan
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="mb-5 font-display text-h3 text-navy">Send your journey to Rawaan</h2>
              <LeadForm notes={state.notes} onSubmit={handleSubmitLead} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
