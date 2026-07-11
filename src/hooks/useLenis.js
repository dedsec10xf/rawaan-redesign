import { useContext } from 'react';
import { LenisContext } from '../app/providers/lenisContext';

// Access the active Lenis instance (null under reduced-motion / before mount).
// e.g. const lenis = useLenis(); lenis?.scrollTo('#journeys');
export function useLenis() {
  return useContext(LenisContext);
}
