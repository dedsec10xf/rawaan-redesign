import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

// ★ value + review count, e.g. "★ 4.8 (142)". Used as TripCard's rating chip
// and anywhere else a tour/package/experience needs its rating shown inline.
export function Rating({ value, reviewCount, size = 'sm', className }) {
  const iconSize = size === 'md' ? 16 : 14;
  const textSize = size === 'md' ? 'text-sm' : 'text-xs';

  return (
    <span className={cn('inline-flex items-center gap-1 font-sans font-medium text-navy', textSize, className)}>
      <Star size={iconSize} strokeWidth={1.5} className="fill-accent text-accent" aria-hidden="true" />
      <span>{value.toFixed(1)}</span>
      {reviewCount != null && <span className="text-slate">({reviewCount})</span>}
    </span>
  );
}
