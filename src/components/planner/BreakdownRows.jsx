import { formatAmountPKR } from '@/lib/currency';

// Renders a breakdown.items array (tripStore's useSummary().breakdown) as
// label/sublabel/amount rows — shared by the SummaryCard (every step,
// sticky right column) and StepReview's own itemised summary block, so the
// two places that show the same array render it identically instead of
// keeping two markup copies in sync by hand.
//
//   <BreakdownRows items={breakdown.items} currency={currency} />
export function BreakdownRows({ items, currency }) {
  if (items.length === 0) {
    return <p className="py-3 text-small text-slate">Nothing added yet — your choices will appear here.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-line">
      {items.map((item) => (
        <div key={`${item.label}-${item.sublabel}`} className="flex items-start justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-sans text-sm font-medium text-navy">{item.label}</p>
            <p className="text-small text-slate">{item.sublabel}</p>
          </div>
          <p className="shrink-0 font-sans text-sm font-medium text-navy">{formatAmountPKR(item.amountPKR, currency)}</p>
        </div>
      ))}
    </div>
  );
}
