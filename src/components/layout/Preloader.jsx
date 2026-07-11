import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { ScrollTrigger } from '@/lib/gsap';
import { EXPO_OUT } from '@/lib/easings';
import { useFontsReady } from '@/hooks/useFontsReady';
import { useLenis } from '@/hooks/useLenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Timing budget (ms). Never shorter than MIN (avoids a flash), never longer
// than CAP regardless of network/load state.
const MIN_MS = 1200;
const CAP_MS = 2500;

// Choreography (seconds) — named so there are no magic numbers inline.
const STAGGER = 0.08;
const DELAY_CHILDREN = 0.1;
const LETTER_DUR = 0.8;
const COUNTER_DUR = 1.2;
const COUNTER_DELAY = 0.2;
const EXIT_WIPE_DUR = 0.9;
const EXIT_FADE_DUR = 0.3;

const WORDMARK = 'RAWAAN';
const LETTERS = WORDMARK.split('');

// Masked line-rise for each letter — same visual language as RevealText.
const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: DELAY_CHILDREN } },
};
const LETTER = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: LETTER_DUR, ease: EXPO_OUT } },
};

// Full-screen preloader overlay. State-based, so Framer Motion owns mount/exit
// (first Framer usage in the app). Waits for real load signals but honors a hard
// 2.5s cap and 1.2s floor; locks scroll via Lenis while active.
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [docReady, setDocReady] = useState(
    () => typeof document !== 'undefined' && document.readyState === 'complete',
  );
  const startRef = useRef(null);

  const reduced = usePrefersReducedMotion();
  const fontsReady = useFontsReady();
  const lenis = useLenis();
  const ready = fontsReady && docReady;

  // Counter 0 → 100 as a motion value (skipped under reduced motion).
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  // Hard upper bound: exit at CAP no matter what. Also captures the start time.
  useEffect(() => {
    startRef.current = performance.now();
    const cap = setTimeout(() => setVisible(false), CAP_MS);
    return () => clearTimeout(cap);
  }, []);

  // Exit once load signals are in, respecting the minimum display floor.
  useEffect(() => {
    if (!ready) return;
    const elapsed = performance.now() - (startRef.current ?? performance.now());
    const wait = Math.max(0, MIN_MS - elapsed);
    const t = setTimeout(() => setVisible(false), wait);
    return () => clearTimeout(t);
  }, [ready]);

  // Track document load (fonts handled by useFontsReady).
  useEffect(() => {
    if (docReady) return;
    const onLoad = () => setDocReady(true);
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [docReady]);

  // Lock scroll while active; resumed in onExitComplete after the wipe.
  useEffect(() => {
    lenis?.stop();
  }, [lenis]);

  // Roll the counter.
  useEffect(() => {
    if (reduced) return;
    const controls = animate(count, 100, {
      duration: COUNTER_DUR,
      ease: EXPO_OUT,
      delay: COUNTER_DELAY,
    });
    return () => controls.stop();
  }, [reduced, count]);

  // Overlay fully gone: unlock scroll and re-measure ScrollTriggers.
  const handleExitComplete = () => {
    lenis?.start();
    ScrollTrigger.refresh();
  };

  const exit = reduced
    ? { opacity: 0, transition: { duration: EXIT_FADE_DUR, ease: 'linear' } }
    : {
        clipPath: 'inset(0% 0% 100% 0%)', // wipe upward, revealing the page
        transition: { duration: EXIT_WIPE_DUR, ease: EXPO_OUT },
      };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[var(--z-preloader)] bg-ink text-bone"
          style={{ willChange: 'clip-path' }}
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={exit}
        >
          {/* Screen-reader label for the decorative wordmark */}
          <span className="sr-only">{WORDMARK}</span>

          {/* Centered wordmark — letters as individual masked spans */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              aria-hidden="true"
              className="flex font-display leading-none text-bone"
              style={{ fontSize: 'var(--text-display)' }}
              variants={CONTAINER}
              initial={reduced ? false : 'hidden'}
              animate={reduced ? false : 'show'}
            >
              {LETTERS.map((char, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span className="inline-block" variants={reduced ? undefined : LETTER}>
                    {char}
                  </motion.span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* Bottom-left load counter */}
          <div className="absolute inset-x-0 bottom-8">
            <div className="container-editorial">
              <span className="label text-bone/70" aria-hidden="true">
                {reduced ? '100' : <motion.span>{rounded}</motion.span>}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
