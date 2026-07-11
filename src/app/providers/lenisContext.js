import { createContext } from 'react';

// Holds the live Lenis instance (or null when disabled / before mount).
// Kept separate from the provider so the provider file only exports a
// component (fast-refresh requirement).
export const LenisContext = createContext(null);
