import { cn } from '@/utils/cn';

// Eyebrow + Fraunces heading + optional sub-copy + optional right-side slot
// (a filter bar, a "See all" link, etc.) — the standard section-opening
// pattern for the v2 homepage IA.
//
// tone="dark" is for the one dark band on the page (Trust, navy bg) — swaps
// heading/sub to white/white-70 instead of navy/slate.
//
//   <SectionHeader eyebrow="Featured" heading="Tours built around you" />
//   <SectionHeader eyebrow="Featured" heading="Tours" right={<Filters />} />
//   <SectionHeader eyebrow="Why Rawaan" heading="..." tone="dark" />
export function SectionHeader({ eyebrow, heading, sub, right, tone = 'light', className }) {
  const dark = tone === 'dark';
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        {eyebrow && <span className={cn('label', dark ? 'text-white/60' : 'text-slate')}>{eyebrow}</span>}
        <h2 className={cn('mt-2 font-display text-h2', dark ? 'text-white' : 'text-navy')}>{heading}</h2>
        {sub && <p className={cn('mt-3 max-w-prose text-body', dark ? 'text-white/70' : 'text-slate')}>{sub}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
