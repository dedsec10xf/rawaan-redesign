import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// Reactive prefers-reduced-motion. Primitives read this internally so
// sections never have to branch on it.
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
