import { useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { createLenis } from '../../lib/lenis';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { LenisContext } from './lenisContext';

// Single Lenis instance for the app, driven by a single gsap.ticker raf so
// smooth scroll and ScrollTrigger stay perfectly in sync. Disabled entirely
// under prefers-reduced-motion.
export function SmoothScrollProvider({ children }) {
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (reduced) return; // native scroll only

    const instance = createLenis();

    // Keep ScrollTrigger updated on every Lenis scroll frame.
    instance.on('scroll', ScrollTrigger.update);

    // One raf source: gsap.ticker drives Lenis (ticker time is in seconds).
    const update = (time) => instance.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Publish the instance to consumers — the intended "connect to an external
    // system" use of setState in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      gsap.ticker.remove(update);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
