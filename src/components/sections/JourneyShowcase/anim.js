import { gsap } from '@/lib/gsap';

// % drift each way on the full-bleed image layer — total travel (2×PARALLAX)
// is 8%, up from the portrait's 6% now that the image is the whole canvas,
// still under the 12% cap (CLAUDE.md). Panel.jsx overscans the wrapper
// left/right by PARALLAX + 2% so this drift never reveals a gap at the panel
// edge (same overscan formula as CinematicMedia's peak+2).
const PARALLAX = 4;

// Pinned horizontal scaffold + panel choreography. ALL of it lives inside
// matchMedia('(min-width: 768px)'); below that (mobile carousel cut — see M6
// decisions log) panels are a plain vertical stack in normal document flow,
// always visible, no reveal of any kind (the component also gates reduced
// motion off before calling this at all). matchMedia owns teardown —
// reverting it kills the tweens + ScrollTriggers and removes the pin-spacer.
//
// Reveal ownership (CLAUDE.md): anim.js is the single owner of hide+reveal for
// every panel's image / name / meta+button (the full-bleed layer, the name
// block, and the two [data-reveal-meta] nodes — meta rows + Explore button —
// read as one logical target) — RevealImage always renders `static` (see
// Panel.jsx). Panel 1 (on-screen at pin start) keeps its original plain
// vertical ScrollTrigger, unchanged — it was never reported broken. Panels
// 2–5 are owned entirely here: hidden via `gsap.set` and revealed via a
// paused tween played from the track tween's own onUpdate once a progress
// threshold is crossed — the same self.progress read that drives the
// counter/progress bar, not a nested per-panel ScrollTrigger (a one-shot
// ScrollTrigger nested inside a scrubbed containerAnimation proved unreliable
// for activation in earlier attempts).
//
// initialProgress guards against re-init mid-scroll (e.g. dev-mode HMR, or
// any future remount): native ScrollTrigger self-corrects for an
// already-passed trigger point on creation (that's why panel 1 never broke);
// this mechanism has no such check built in, so it's done explicitly —
// checking the tween's current progress at setup time and skipping straight
// to the revealed state for any panel whose threshold is already satisfied.
export function initJourneyShowcase({ section, pin, track, progressBar, counter, panelCount }) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const getTravel = () => track.scrollWidth - window.innerWidth;

    const setBar = gsap.quickSetter(progressBar, 'scaleX'); // no React state per frame
    let lastIndex = -1;
    const reveals = []; // { threshold, fired, play } for panels 2–5, read in onUpdate

    const tween = gsap.to(track, {
      x: () => -getTravel(), // function value → re-evaluated on invalidateOnRefresh
      ease: 'none', // scrubbed tween must stay linear; Lenis provides the smoothing
      scrollTrigger: {
        trigger: section,
        pin, // pin the h-svh wrapper; section top = pin start (= #journeys anchor)
        start: 'top top',
        end: () => `+=${getTravel()}`,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setBar(self.progress);
          const idx = Math.min(panelCount, Math.round(self.progress * (panelCount - 1)) + 1);
          if (idx !== lastIndex) {
            counter.textContent = String(idx).padStart(2, '0');
            lastIndex = idx;
          }
          for (const r of reveals) {
            if (!r.fired && self.progress >= r.threshold) {
              r.fired = true;
              r.play();
            }
          }
        },
      },
    });

    const initialProgress = tween.scrollTrigger.progress;

    track.querySelectorAll('[data-panel]').forEach((panel, i) => {
      const parallax = panel.querySelector('[data-parallax]');
      if (parallax) {
        gsap.fromTo(
          parallax,
          { xPercent: -PARALLAX },
          {
            xPercent: PARALLAX,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      }

      const targets = [
        panel.querySelector('[data-reveal-image]'),
        panel.querySelector('[data-reveal-name]'),
        ...panel.querySelectorAll('[data-reveal-meta]'),
      ].filter(Boolean);
      if (!targets.length) return;

      if (i === 0) {
        // On-screen at pin start — plain vertical trigger, unchanged.
        gsap.from(targets, {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          stagger: 0.12,
          scrollTrigger: { trigger: panel, start: 'top 85%' },
        });
        return;
      }

      // Panels 2–5: hide + reveal both owned here, on the same nodes, no
      // nested ScrollTrigger. Threshold mirrors the panel's left edge
      // reaching 80% of viewport width, expressed as containerAnimation
      // progress: panel i's screen x = i·vw − progress·(panelCount−1)·vw;
      // solve for progress at x = 0.8vw.
      const threshold = Math.max(0, (i - 0.8) / (panelCount - 1));

      if (initialProgress >= threshold) {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
        reveals.push({ threshold, fired: true, play: () => {} });
        return;
      }

      gsap.set(targets, { autoAlpha: 0, y: 40 });
      const revealTween = gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        paused: true,
      });
      reveals.push({ threshold, fired: false, play: () => revealTween.play() });
    });
  });

  return mm;
}
