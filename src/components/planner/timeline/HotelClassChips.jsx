import { Chip } from '@/components/ui';
import { HOTEL_CLASSES } from '@/store/tripStore';

// Standard/Deluxe/Luxury per day — Standard is the implicit default (a day
// with no `hotelClass` set reads as Standard, $0 upcharge; see tripStore's
// HOTEL_CLASS_UPCHARGE_PER_NIGHT note).
export function HotelClassChips({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {HOTEL_CLASSES.map((tier) => (
        <Chip
          key={tier}
          variant="toggle"
          selected={(value ?? 'Standard') === tier}
          onToggle={() => onChange(tier)}
        >
          {tier}
        </Chip>
      ))}
    </div>
  );
}
