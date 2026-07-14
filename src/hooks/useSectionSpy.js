import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { waitForElement } from '@/lib/resolveAnchor';

// Which homepage section is currently in view (Header nav audit, V8+) — for
// highlighting the matching nav item. IntersectionObserver, not GSAP
// ScrollTrigger: this is a pure "which one am I looking at" boolean per
// section, not a scroll-progress-driven animation, so the lighter native API
// fits without pulling GSAP into a job it doesn't need to do. Each id is
// added to the observer via waitForElement rather than a single upfront
// querySelectorAll — Trust/Testimonials/Contact are lazy-loaded and don't
// exist in the DOM yet on first render.
export function useSectionSpy(ids) {
  const { pathname } = useLocation();
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    // Nothing to observe off the homepage — the cleanup below (which runs on
    // the way OUT of '/', including into this branch) is what clears
    // activeId, so there's no setState directly in this branch's body.
    if (pathname !== '/') return undefined;

    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b));
        setActiveId(topmost.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    ids.forEach((id) => {
      waitForElement(`#${id}`).then((el) => {
        if (!cancelled && el) observer.observe(el);
      });
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      setActiveId(null);
    };
  }, [pathname, ids]);

  return activeId;
}
