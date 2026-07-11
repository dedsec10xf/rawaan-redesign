import { useEffect, useState } from 'react';

// Generic matchMedia hook — breakpoint / feature queries for
// responsive re-choreography (e.g. useMedia('(max-width: 768px)')).
export function useMedia(query, defaultState = false) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : defaultState,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
