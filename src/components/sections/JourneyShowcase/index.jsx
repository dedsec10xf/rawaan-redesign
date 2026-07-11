import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { SectionLabel } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';
import { journeys } from '@/data/journeys';
import { Panel } from './Panel';
import { initJourneyShowcase } from './anim';

const TOTAL = String(journeys.length).padStart(2, '0');

// Section 3 — Signature Journeys. Desktop (≥768, motion): panels scrub
// horizontally while the section pins; the pin, parallax, and per-panel
// reveals are all created together in anim.js. Mobile / reduced motion: plain
// vertical stack, no pin, no carousel (cut — see M6 decisions log).
export default function JourneyShowcase() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const counterRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      // Desktop (≥768, motion): pinned horizontal scrub. Skipped under
      // reduced motion or below 768 (→ vertical stack, unpinned).
      if (reduced) return;

      const mmPin = initJourneyShowcase({
        section: sectionRef.current,
        pin: pinRef.current,
        track: trackRef.current,
        progressBar: progressBarRef.current,
        counter: counterRef.current,
        panelCount: journeys.length,
      });

      // One refresh after the pin is created, so the spacer + container
      // positions settle before the reveals compute their starts.
      const raf = requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        // DEV-only regression guard: only meaningful while the pin is
        // actually on screen (a fresh page load 2s in, before the user has
        // scrolled anywhere near #journeys, would otherwise false-positive
        // on every still-correctly-hidden panel). Runs on a poll while the
        // section intersects the viewport; flags a reveal target as broken
        // only once it's FULLY inside the viewport (any partial overlap is
        // legitimately still pre-threshold — panels reveal at 80% entered,
        // not on first pixel).
        if (import.meta.env.DEV) {
          const check = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const rows = [];
            trackRef.current?.querySelectorAll('[data-panel]').forEach((panel, i) => {
              ['[data-reveal-image]', '[data-reveal-name]'].forEach((sel) => {
                const el = panel.querySelector(sel);
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const fullyOnScreen = rect.left >= 0 && rect.right <= vw && rect.top >= 0 && rect.bottom <= vh;
                if (!fullyOnScreen) return;
                const opacity = window.getComputedStyle(el).opacity;
                rows.push({ panel: i, target: sel, opacity, rect: { w: Math.round(rect.width), h: Math.round(rect.height) } });
              });
            });
            const broken = rows.filter((r) => r.opacity === '0' || r.rect.w === 0 || r.rect.h === 0);
            if (broken.length) {
              console.warn(
                `[JourneyShowcase] Regression: ${broken.length} on-screen reveal target(s) invisible or zero-size.`,
                broken,
                performance.now(),
              );
            }
          };
          let interval;
          const io = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                interval ??= setInterval(check, 500);
              } else {
                clearInterval(interval);
                interval = undefined;
              }
            },
            { threshold: 0.1 },
          );
          io.observe(sectionRef.current);
          setTimeout(() => {
            io.disconnect();
            clearInterval(interval);
          }, 30000); // dev-session guard, not meant to run forever
        }
      });

      return () => {
        cancelAnimationFrame(raf);
        mmPin.revert();
      };
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  // Two layouts: plain vertical stack below md (and always under reduced
  // motion) vs. the pinned horizontal track at md+. Panels own their own
  // sizing (see Panel); track only sets the flex axis.
  const pinClass = reduced ? '' : 'md:h-svh md:overflow-hidden';
  const trackClass = cn('flex will-change-transform', reduced ? 'flex-col' : 'flex-col md:h-full md:flex-row');

  return (
    <section
      ref={sectionRef}
      id="journeys"
      aria-label="Signature journeys"
      className="relative bg-ink text-bone"
    >
      <div ref={pinRef} className={cn('relative', pinClass)}>
        <div ref={trackRef} className={trackClass}>
          {journeys.map((journey) => (
            <Panel key={journey.id} journey={journey} />
          ))}
        </div>

        {/* Fixed UI within the pinned viewport — desktop, motion only */}
        {!reduced && (
          <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
            <div className="container-editorial flex h-full flex-col justify-between py-24">
              <SectionLabel as="h2" index="03">
                Signature Journeys
              </SectionLabel>

              <div className="flex flex-col gap-3">
                <p className="label">
                  <span ref={counterRef} className="text-bone">
                    01
                  </span>
                  <span className="text-stone"> / {TOTAL}</span>
                </p>
                <span className="block h-px w-40 bg-stone/25">
                  <span
                    ref={progressBarRef}
                    className="block h-full w-full origin-left scale-x-0 bg-bone"
                  />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
