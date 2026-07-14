import { Star } from 'lucide-react';
import { Stepper, Rating, Chip } from '@/components/ui';
import { resolveImage } from '@/assets/images';
import { useTripStore } from '@/store/tripStore';
import { destinations } from '@/data/destinations';
import { hotels } from '@/data/hotels';
import { formatAmountPKR } from '@/lib/currency';
import { cn } from '@/utils/cn';
import { StepIntro } from './StepIntro';

const destinationsById = new Map(destinations.map((d) => [d.id, d]));

// Step 5 — Hotels. One selection per region (hotelSelections is keyed by
// regionId) — in today's data this is exactly one group, the chosen
// destination's own region, since overnight waypoint stays (Step 4) are
// Rawaan-arranged rather than tier-selectable (no curated hotel picks exist
// yet for waypoint towns like Chilas or Besham — flagged in the delivery
// report, not silently faked here).
export function StepHotels() {
  const destinationId = useTripStore((s) => s.destinationId);
  const nights = useTripStore((s) => s.nights);
  const groupSize = useTripStore((s) => s.groupSize);
  const roomCount = useTripStore((s) => s.roomCount);
  const hotelSelections = useTripStore((s) => s.hotelSelections);
  const setField = useTripStore((s) => s.setField);
  const setHotelSelection = useTripStore((s) => s.setHotelSelection);
  const currency = useTripStore((s) => s.currency);

  const destination = destinationsById.get(destinationId);
  const options = destination ? hotels.filter((h) => h.region === destination.regionId) : [];
  const selectedHotelId = destination ? hotelSelections[destination.regionId] : undefined;

  return (
    <div>
      <StepIntro
        number={5}
        name="Hotels"
        heading="Where will you stay?"
        copy="We've stayed at every property on this list ourselves — nothing here is a booking-site listing we haven't actually checked."
      />

      <Stepper label={`Rooms for ${groupSize} guests`} value={roomCount} onChange={(v) => setField('roomCount', v)} min={1} max={10} className="mb-8" />

      {!destination ? (
        <p className="text-body text-slate">Pick a destination first — we'll show you our vetted stays there.</p>
      ) : (
        <div>
          <h3 className="label text-slate">
            {nights} night{nights === 1 ? '' : 's'} in {destination.name}
          </h3>
          <div role="radiogroup" aria-label={`Hotel in ${destination.name}`} className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {options.map((hotel) => {
              const isSelected = selectedHotelId === hotel.id;
              const image = resolveImage(hotel.image);
              return (
                <button
                  key={hotel.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setHotelSelection(destination.regionId, hotel.id)}
                  className={cn(
                    'flex flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-shadow duration-200 hover:shadow-md',
                    isSelected ? 'border-accent ring-2 ring-accent' : 'border-line',
                  )}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
                    <img src={image.src} srcSet={image.srcSet} sizes={image.sizes} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    <Chip size="sm" className="absolute left-2 top-2 border-none bg-white/95">
                      {hotel.tier}
                    </Chip>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-display text-h3 text-navy">{hotel.name}</h4>
                    </div>
                    <Rating value={hotel.rating} size="sm" />
                    <p className="text-small text-slate">{hotel.blurb}</p>
                    <p className="mt-auto pt-2 font-sans text-sm font-medium text-cyan-deep">
                      {formatAmountPKR(hotel.pricePerNightPKR, currency)}
                      <span className="text-slate"> / night</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {overnightNote(destination)}
        </div>
      )}
    </div>
  );
}

function overnightNote() {
  return (
    <p className="mt-6 flex items-start gap-2 text-small text-slate">
      <Star size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-cyan-deep" aria-hidden="true" />
      Any overnight stops you added on the Route step are arranged by Rawaan directly — those don't need a hotel
      pick here.
    </p>
  );
}
