import { lazy, Suspense, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ScrollTrigger } from './lib/gsap';
import { SmoothScrollProvider } from './app/providers/SmoothScrollProvider';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { useFontsReady } from './hooks/useFontsReady';
import { useLenis } from './hooks/useLenis';
import { scrollToAnchor, waitForElement } from './lib/resolveAnchor';
import Header from './components/layout/Header';
import { TripSummaryPanel } from './components/layout/TripSummaryPanel';
import Home from './pages/Home';
import Build from './pages/Build';
import TourDetail from './pages/TourDetail';
import StubPage from './pages/StubPage';

// DEV-only referential-integrity scan across tours/packages/experiences/
// categories, run once at module load (not per-render). The import itself is
// gated too, not just the call inside — so validateData.js (and its data-file
// imports) never end up in the PROD bundle at all.
if (import.meta.env.DEV) {
  import('./lib/validateData').then(({ validateData }) => validateData());
}

// Footer persists across every route (mounted once, outside <Routes>) —
// lazy so it stays out of the initial bundle, same pattern the v1 sections
// used for below-fold code-splitting.
const Footer = lazy(() => import('./components/sections/Footer'));

// /build (V6) and /packages/:slug (V9) are real, built pages now. The rest
// are stub shells with just a heading.
const STUB_ROUTES = [
  { path: '/packages', title: 'Packages' },
  { path: '/destinations', title: 'Destinations' },
  { path: '/experiences', title: 'Experiences' },
  { path: '/corporate', title: 'Corporate' },
  { path: '/about', title: 'About' },
  { path: '/blog', title: 'Blog' },
  { path: '/contact', title: 'Contact' },
];

// Scroll-to-top + re-measure on every route change, OR scroll to a pending
// cross-route anchor (Header nav audit, V8+: a hash link clicked from a
// non-home route navigates here via useAnchorNav with { state: { scrollTo }
// }). `consumedKeyRef` dedupes by react-router's per-navigation `location.key`
// rather than clearing state with a second navigate() call — clearing state
// that way would itself be a new location change, re-firing this effect and
// immediately yanking the scroll back to top right after landing on the
// anchor. waitForElement resolves once the target section actually exists
// (lazy sections mount after this effect first runs), not on a timer guess.
//
// A pushState navigation doesn't reset scroll position on its own, and Lenis
// owns scroll when it's running, so the reset has to go through it (an
// immediate jump, not an animated one — this isn't a user-facing scroll
// action). ScrollTrigger positions computed against the PREVIOUS route's
// layout are stale the instant the new route's DOM commits, so one refresh
// follows on the next frame, mirroring the fonts-ready/lazy-mount refreshes
// below.
function RouteChangeEffects() {
  const location = useLocation();
  const lenis = useLenis();
  const consumedKeyRef = useRef(null);

  useEffect(() => {
    const pendingHash = location.pathname === '/' ? location.state?.scrollTo : null;

    if (pendingHash && consumedKeyRef.current !== location.key) {
      let cancelled = false;
      waitForElement(pendingHash).then((el) => {
        if (cancelled || !el) return;
        scrollToAnchor(lenis, pendingHash);
        consumedKeyRef.current = location.key;
      });
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }

    if (!pendingHash) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [location, lenis]);

  return null;
}

// App shell — header + routed content + a persistent footer, wrapped in the
// smooth-scroll provider. Sections are added per milestone.
function App() {
  // Fires the single ScrollTrigger.refresh() once fonts settle (headline
  // splits shift layout as Fraunces/Archivo swap in) — global, not per-route.
  const fontsReady = useFontsReady();
  const { pathname } = useLocation();

  return (
    <SmoothScrollProvider>
      <Header />
      <RouteChangeEffects />

      <main data-fonts-ready={fontsReady || undefined}>
        {/* key={pathname} remounts the boundary on navigation — otherwise a
            caught error would keep the panel showing forever, even after the
            user has moved to a route that doesn't have the bug. */}
        <ErrorBoundary key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/build" element={<Build />} />
            <Route path="/packages/:slug" element={<TourDetail />} />
            {STUB_ROUTES.map(({ path, title }) => (
              <Route key={path} path={path} element={<StubPage title={title} />} />
            ))}
          </Routes>
        </ErrorBoundary>
      </main>

      <Suspense fallback={<div aria-hidden="true" className="min-h-[40svh] bg-navy" />}>
        <Footer />
      </Suspense>

      <TripSummaryPanel />
    </SmoothScrollProvider>
  );
}

export default App;
