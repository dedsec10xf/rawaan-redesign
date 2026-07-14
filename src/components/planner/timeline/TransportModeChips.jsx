import { Chip } from '@/components/ui';
import { TRANSPORT_MODES } from '@/store/tripStore';

// Ground-vehicle quick-pick for a day — separate from the day's free-text
// `transport` description (see tripStore's TRANSPORT_MODES note).
export function TransportModeChips({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TRANSPORT_MODES.map((mode) => (
        <Chip key={mode} variant="toggle" selected={value === mode} onToggle={() => onChange(mode)}>
          {mode}
        </Chip>
      ))}
    </div>
  );
}
