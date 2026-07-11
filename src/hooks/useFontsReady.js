import { useEffect, useState } from 'react';
import { ScrollTrigger } from '../lib/gsap';

// Resolves once web fonts have loaded and laid out, then runs the single
// ScrollTrigger.refresh() so scroll measurements use final text metrics
// (headline splits shift layout as Fraunces/Archivo swap in). Returns a flag
// sections can gate reveals on.
export function useFontsReady() {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const done = () => {
      if (cancelled) return;
      setFontsReady(true);
      ScrollTrigger.refresh();
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(done);
    } else {
      done();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return fontsReady;
}
