import { Check, Users } from 'lucide-react';
import { Chip } from '@/components/ui';
import { resolveImage } from '@/assets/images';
import { useTripStore } from '@/store/tripStore';
import { destinations } from '@/data/destinations';
import { vehicles } from '@/data/vehicles';
import { formatAmountPKR } from '@/lib/currency';
import { cn } from '@/utils/cn';
import { StepIntro } from './StepIntro';

const destinationsById = new Map(destinations.map((d) => [d.id, d]));

// Step 3 — Ride. Only vehicles suitableFor the chosen destination's region
// are shown at all (a Corolla offered for Hunza would just be a wrong
// answer, not a valid-but-worse one). Within that set, vehicles too small
// for the group stay VISIBLE but disabled with the reason shown, rather
// than hidden or silently sorted last — picking one only to find out later
// it doesn't fit is worse than seeing it up front and understanding why
// it's not an option today.
export function StepRide() {
  const destinationId = useTripStore((s) => s.destinationId);
  const groupSize = useTripStore((s) => s.groupSize);
  const vehicleId = useTripStore((s) => s.vehicleId);
  const setVehicleId = useTripStore((s) => s.setVehicleId);
  const currency = useTripStore((s) => s.currency);

  const destination = destinationsById.get(destinationId);
  const options = destination ? vehicles.filter((v) => v.suitableFor.includes(destination.regionId)) : vehicles;

  return (
    <div>
      <StepIntro
        number={3}
        name="Your ride"
        heading="How will you get there?"
        copy="These mountain roads aren't forgiving of the wrong vehicle — every option below is one our own drivers actually take on this route, not a generic rental fleet."
      />

      <div role="radiogroup" aria-label="Vehicle" className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {options.map((vehicle) => {
          const isSelected = vehicleId === vehicle.id;
          const tooFewSeats = vehicle.seats < groupSize;
          const image = resolveImage(vehicle.image);
          return (
            <button
              key={vehicle.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={tooFewSeats}
              aria-describedby={tooFewSeats ? `${vehicle.id}-seats-warning` : undefined}
              onClick={() => setVehicleId(vehicle.id)}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-shadow duration-200',
                tooFewSeats ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md',
                isSelected ? 'border-accent ring-2 ring-accent' : 'border-line',
              )}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-line">
                <img src={image.src} srcSet={image.srcSet} sizes={image.sizes} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                {isSelected && (
                  <span aria-hidden="true" className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-navy">
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-h3 text-navy">{vehicle.name}</h3>
                  <span className="shrink-0 font-display text-h3 text-cyan-deep">{formatAmountPKR(vehicle.pricePerDayPKR, currency)}</span>
                </div>
                <p className="label text-slate">
                  {vehicle.type} · <Users size={13} strokeWidth={1.5} className="inline -translate-y-px" aria-hidden="true" /> {vehicle.seats} seats
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {vehicle.tags.map((tag) => (
                    <Chip key={tag} size="sm">
                      {tag}
                    </Chip>
                  ))}
                </div>
                {tooFewSeats ? (
                  <p id={`${vehicle.id}-seats-warning`} role="alert" className="mt-auto text-small text-red-600">
                    Only seats {vehicle.seats} — not enough for {groupSize} guests.
                  </p>
                ) : (
                  <p className="mt-auto text-small italic text-slate">{vehicle.note}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
