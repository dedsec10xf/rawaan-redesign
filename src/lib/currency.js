// Fixed demo FX rate — the ONE place it's defined, per CLAUDE.md's data-
// foundation brief. Real-world rates float constantly; a live conversion API
// is out of scope for a demo, so every PKR<->USD conversion in the app reads
// this one constant instead of hand-rolling its own guess. NOT a live rate —
// update by hand if the demo needs to look current.
export const USD_TO_PKR_RATE = 278;

export function usdToPkr(amountUSD) {
  return Math.round(amountUSD * USD_TO_PKR_RATE);
}

export function pkrToUsd(amountPKR) {
  return Math.round(amountPKR / USD_TO_PKR_RATE);
}

// Renders an amount (already in the given currency's own unit — PKR amounts
// stay PKR, USD amounts stay USD; this does NOT convert) as a display string.
// tripStore's `currency` field picks which unit a consumer should be passing
// in the first place — this is just the last-mile formatter.
export function formatCurrency(amount, currency = 'PKR') {
  if (currency === 'USD') return `$${Math.round(amount).toLocaleString()}`;
  return `Rs ${Math.round(amount).toLocaleString()}`;
}

// Every price in the data layer (vehicles/hotels/experiences/breakdown) is
// authored/computed in PKR — this is the one call site that both converts
// AND formats, so a component showing a price never has to remember to do
// the conversion step itself before calling formatCurrency.
export function formatAmountPKR(amountPKR, currency = 'PKR') {
  return currency === 'USD' ? formatCurrency(pkrToUsd(amountPKR), 'USD') : formatCurrency(amountPKR, 'PKR');
}
