import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { SmoothScrollProvider } from './app/providers/SmoothScrollProvider';
import { LazyMountContext, useLazyMountSignal } from './app/providers/lazyMountContext';
import { useFontsReady } from './hooks/useFontsReady';
import Preloader from './components/layout/Preloader';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';

// Below-fold sections are code-split — Hero/Header/Preloader stay eager
// (LCP path). Each gets its own Suspense boundary (independent resolution —
// a slow section doesn't hold up the others) and a fixed-height, bg-matched
// fallback (see FALLBACKS below) so a late mount doesn't shift layout.
const Manifesto = lazy(() => import('./components/sections/Manifesto'));
const JourneyShowcase = lazy(() => import('./components/sections/JourneyShowcase'));
const Experiences = lazy(() => import('./components/sections/Experiences'));
const Regions = lazy(() => import('./components/sections/Regions'));
const StatsPartners = lazy(() => import('./components/sections/StatsPartners'));
const Testimonial = lazy(() => import('./components/sections/Testimonial'));
const Contact = lazy(() => import('./components/sections/Contact'));
const Footer = lazy(() => import('./components/sections/Footer'));

const LAZY_SECTION_COUNT = 8;

// Estimated typical height per section (not measured — real height varies by
// breakpoint/content/font metrics). Testimonial's matches its real section
// exactly (min-h-[80svh] md:min-h-svh) since that value is fixed in its own
// markup; the rest are rough approximations picked to keep the swap-in close
// to imperceptible, not pixel-perfect — see the delivery report.
const FALLBACKS = {
  Manifesto: 'min-h-[60svh] bg-bone',
  JourneyShowcase: 'min-h-svh bg-ink',
  Experiences: 'min-h-[90svh] bg-ink',
  Regions: 'min-h-[50svh] bg-ink',
  StatsPartners: 'min-h-[60svh] bg-bone',
  Testimonial: 'min-h-[80svh] md:min-h-svh bg-ink',
  Contact: 'min-h-[90svh] bg-ink',
  Footer: 'min-h-[70svh] bg-tarn',
};

function SectionFallback({ name }) {
  return <div aria-hidden="true" className={FALLBACKS[name]} />;
}

// Placed INSIDE the Suspense boundary, wrapping the lazy section itself —
// React only commits this subtree once the lazy import has resolved, so this
// effect firing is a reliable "this section is really mounted" signal.
function MountSignal({ children }) {
  const notify = useLazyMountSignal();
  useEffect(() => {
    notify();
  }, [notify]);
  return children;
}

// App shell. Sections are added per milestone; this establishes the
// smooth-scroll provider, the grain overlay, and the semantic landmarks.
function App() {
  // Fires the single ScrollTrigger.refresh() once fonts settle.
  const fontsReady = useFontsReady();

  // A SECOND, independent refresh once every lazy section has committed —
  // pin positions/trigger measurements taken before a later section mounts
  // (changing total document height) are stale until this fires. Cheapest
  // robust pattern: count mounts via context, refresh once the count hits
  // the known total.
  const [mountedCount, setMountedCount] = useState(0);
  const notifyMounted = useCallback(() => setMountedCount((c) => c + 1), []);

  useEffect(() => {
    if (mountedCount === LAZY_SECTION_COUNT) ScrollTrigger.refresh();
  }, [mountedCount]);

  return (
    <SmoothScrollProvider>
      {/* Preloader overlay owns scroll-lock + exit; sits above everything */}
      <Preloader />

      {/* Film grain sits above all content, non-interactive */}
      <div className="grain" aria-hidden="true" />

      <Header />

      <LazyMountContext.Provider value={notifyMounted}>
        <main data-fonts-ready={fontsReady || undefined}>
          <Hero />

          <Suspense fallback={<SectionFallback name="Manifesto" />}>
            <MountSignal>
              <Manifesto />
            </MountSignal>
          </Suspense>

          <Suspense fallback={<SectionFallback name="JourneyShowcase" />}>
            <MountSignal>
              <JourneyShowcase />
            </MountSignal>
          </Suspense>

          <Suspense fallback={<SectionFallback name="Experiences" />}>
            <MountSignal>
              <Experiences />
            </MountSignal>
          </Suspense>

          <Suspense fallback={<SectionFallback name="Regions" />}>
            <MountSignal>
              <Regions />
            </MountSignal>
          </Suspense>

          <Suspense fallback={<SectionFallback name="StatsPartners" />}>
            <MountSignal>
              <StatsPartners />
            </MountSignal>
          </Suspense>

          <Suspense fallback={<SectionFallback name="Testimonial" />}>
            <MountSignal>
              <Testimonial />
            </MountSignal>
          </Suspense>

          <Suspense fallback={<SectionFallback name="Contact" />}>
            <MountSignal>
              <Contact />
            </MountSignal>
          </Suspense>
        </main>

        <Suspense fallback={<SectionFallback name="Footer" />}>
          <MountSignal>
            <Footer />
          </MountSignal>
        </Suspense>
      </LazyMountContext.Provider>
    </SmoothScrollProvider>
  );
}

export default App;
