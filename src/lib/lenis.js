import Lenis from 'lenis';

// Factory for the single Lenis instance. The provider owns lifecycle and
// wires it to gsap.ticker — this only centralizes the tuned defaults.
export function createLenis(options = {}) {
  return new Lenis({
    duration: 1.1,
    // expo-out feel for the wheel/inertia
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
    ...options,
  });
}
