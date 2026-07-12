import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Marquee, SectionLabel } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMedia } from '@/hooks/useMedia';
import { useLenis } from '@/hooks/useLenis';
import { resolveAnchor, scrollToAnchor } from '@/lib/resolveAnchor';
import { cn } from '@/utils/cn';
import { regions } from '@/data/regions';

const HEADING_ID = 'regions-heading';

// Speed multiplier tuning — ambient baseline 1x, scroll-velocity can push it
// up to 3x, hover/focus eases it down to 0.3x. lenis.velocity is px/tick (an
// animatedScroll delta, not px/s), so VELOCITY_SCALE is a tuned-by-feel
// constant, not a physical unit conversion — see the delivery report.
const AMBIENT_SCALE = 1;
const MAX_SCALE = 3;
const HOVER_SCALE = 0.3;
const VELOCITY_SCALE = 0.05;
const DAMPING = 0.1; // per-tick lerp factor — smooths velocity, hover/focus, and backdrop-visible transitions

// Backdrop: two stacked <img>s crossfade (true overlap, no src-swap gap).
const BACKDROP_IN = 0.8;
const BACKDROP_OUT = 1;
const KEN_BURNS_SCALE = 1.06;
const KEN_BURNS_DURATION = 8;

// Inline-image window parallax: driven by each row's own tween progress (not
// raw elapsed time) so it's tied to actual scroll motion, not a wall clock —
// PARALLAX_CYCLES is an integer so sin() has zero phase discontinuity at the
// marquee's loop boundary (progress wraps 1→0, sin(2π·N)=sin(0)). Row 2 gets
// an inverted sign so the two rows visibly complement each other's opposite
// travel direction — a symmetric oscillation can't literally have one single
// "opposite" direction, this is the phase-inversion compromise; see the
// delivery report.
const PARALLAX_MAX_PERCENT = 8;
const PARALLAX_CYCLES = 6;

// Section 5 — Where We Go. Two Marquee rows, opposite directions, reactive to
// Lenis scroll velocity and hover/focus, plus a full-bleed attention backdrop
// and per-image window parallax. No anim.js: nothing here is scroll-enter
// choreography — it's all ongoing interaction (ticker + hover), so it lives
// in the component, matching where MagneticWrap's quickTo lives.
//
// Refs are declared individually (not bundled in a custom hook's returned
// object, and never passed through a property chain into a JSX `ref` prop) —
// the stricter react-hooks/refs + react-hooks/immutability rules can't
// statically verify a ref nested inside a hook-returned plain object is safe
// to mutate. Grouping happens only inside the effect callback (non-render
// context), where it's just a normal local variable.
export default function Regions() {
  const sectionRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const canHover = useMedia('(hover: hover) and (pointer: fine)');
  const lenis = useLenis();
  // State (not a ref) because it drives which CLASSES render — the strip
  // images' resting treatment needs to visibly lighten while the backdrop is
  // up, or they read as nearly invisible against ink/85 + their own dimming.
  const [backdropActive, setBackdropActive] = useState(false);

  const row1TweenRef = useRef(null);
  const row1PausedRef = useRef(false);
  const row1ScaleRef = useRef(AMBIENT_SCALE);
  const row1WrapperRef = useRef(null);
  const row1ImagesRef = useRef(null);

  const row2TweenRef = useRef(null);
  const row2PausedRef = useRef(false);
  const row2ScaleRef = useRef(AMBIENT_SCALE);
  const row2WrapperRef = useRef(null);
  const row2ImagesRef = useRef(null);

  const backdropWrapRef = useRef(null);
  const imgARef = useRef(null);
  const imgBRef = useRef(null);
  const backdropActiveIsARef = useRef(true);
  const backdropCurrentIdRef = useRef(null);
  const backdropKenBurnsRef = useRef(null);
  const backdropShowRef = useRef(null); // (id, src) => void — assigned in the effect, called from render-time handlers
  const backdropHideRef = useRef(null);

  useGSAP(
    () => {
      if (reduced) return; // Marquee itself is frozen under reduced motion — the ticker must not run at all

      // Cache each row's inner images once (window-parallax targets).
      row1ImagesRef.current = row1WrapperRef.current.querySelectorAll('img');
      row2ImagesRef.current = row2WrapperRef.current.querySelectorAll('img');

      // Backdrop show/hide — GSAP-owned crossfade + Ken Burns. `image` is the
      // registry's responsive object ({ src, srcSet, sizes }) — the backdrop
      // is full-bleed, so it uses the full srcSet, not just the fallback src.
      backdropShowRef.current = (id, image) => {
        if (id === backdropCurrentIdRef.current) return;
        const wasHidden = backdropCurrentIdRef.current == null;
        backdropCurrentIdRef.current = id;

        const from = backdropActiveIsARef.current ? imgARef.current : imgBRef.current;
        const to = backdropActiveIsARef.current ? imgBRef.current : imgARef.current;
        to.src = image.src;
        if (image.srcSet) to.srcset = image.srcSet;
        if (image.sizes) to.sizes = image.sizes;
        gsap.to(from, { opacity: 0, duration: BACKDROP_IN });
        gsap.to(to, { opacity: 1, duration: BACKDROP_IN });
        backdropActiveIsARef.current = !backdropActiveIsARef.current;

        if (wasHidden) {
          gsap.to(backdropWrapRef.current, { autoAlpha: 1, duration: BACKDROP_IN });
          backdropKenBurnsRef.current?.kill();
          gsap.set(backdropWrapRef.current, { scale: 1 });
          backdropKenBurnsRef.current = gsap.to(backdropWrapRef.current, {
            scale: KEN_BURNS_SCALE,
            duration: KEN_BURNS_DURATION,
            ease: 'none',
          });
          setBackdropActive(true);
        }
      };
      backdropHideRef.current = () => {
        if (backdropCurrentIdRef.current == null) return;
        backdropCurrentIdRef.current = null;
        gsap.to(backdropWrapRef.current, { autoAlpha: 0, duration: BACKDROP_OUT });
        backdropKenBurnsRef.current?.kill();
        backdropKenBurnsRef.current = null;
        setBackdropActive(false);
      };

      // Local grouping for the tick loop — plain variables inside the effect
      // callback (not render, not a hook return), safe to close over and mutate.
      const rows = [
        { tweenRef: row1TweenRef, pausedRef: row1PausedRef, scaleRef: row1ScaleRef, imagesRef: row1ImagesRef, sign: 1 },
        { tweenRef: row2TweenRef, pausedRef: row2PausedRef, scaleRef: row2ScaleRef, imagesRef: row2ImagesRef, sign: -1 },
      ];

      const tick = () => {
        const velocity = lenis ? Math.abs(lenis.velocity) : 0;
        const ambient = Math.min(AMBIENT_SCALE + velocity * VELOCITY_SCALE, MAX_SCALE);

        for (const row of rows) {
          const target = row.pausedRef.current ? HOVER_SCALE : ambient;
          row.scaleRef.current += (target - row.scaleRef.current) * DAMPING;
          row.tweenRef.current?.timeScale(row.scaleRef.current);

          // Window parallax: driven by the row's own tween progress, not a
          // wall clock — ties the drift to actual scroll motion.
          const progress = row.tweenRef.current?.progress() ?? 0;
          const offset = Math.sin(progress * Math.PI * 2 * PARALLAX_CYCLES) * PARALLAX_MAX_PERCENT * row.sign;
          if (row.imagesRef.current) {
            gsap.set(row.imagesRef.current, { xPercent: offset });
          }
        }
      };

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        backdropKenBurnsRef.current?.kill();
        backdropShowRef.current = null;
        backdropHideRef.current = null;
      };
    },
    { dependencies: [reduced, lenis], scope: sectionRef },
  );

  const handleClick = (e) => {
    e.preventDefault();
    // #contact doesn't exist yet — same fallback as Experiences.
    const hasContact = resolveAnchor('#contact') != null;
    scrollToAnchor(lenis, hasContact ? '#contact' : '#footer');
  };

  // Image treatment: desaturated/dimmed by default so the TYPE reads as the
  // dominant editorial element and the images sit as quiet accents; eases to
  // full color, wider tracking, and the backdrop preview together on
  // hover/focus of the pair (one `group` scope covers name + image, so
  // hovering either wakes the whole pair).
  //
  // Compensation: while the backdrop is active, EVERY strip image (not just
  // the hovered one) sits against ink/85 — the resting treatment alone would
  // read as nearly invisible. backdropActive (React state, since it must
  // drive which classes render) lightens the resting ink overlay (20%→5%)
  // and lifts resting brightness (90%→100%, matching what hover already
  // uses) so they stay legible as "windows" onto the backdrop. Still a CSS
  // transition doing the actual easing — only the target values are
  // state-driven, same pattern as the existing hover treatment.
  const renderRegions = (backdropIsActive) =>
    regions.map((region) => (
      <span
        key={region.id}
        className="group inline-flex items-center gap-[1.75em]"
        onMouseEnter={() => canHover && backdropShowRef.current?.(region.id, region.image)}
        onFocus={() => backdropShowRef.current?.(region.id, region.image)}
      >
        <a
          href="#contact"
          onClick={handleClick}
          className={cn(
            'font-display leading-none tracking-[0em] transition-[color,letter-spacing] duration-300',
            // Compensation for the lowered backdrop overlay (see below): resting
            // text alone (text-stone) only clears 4.5:1 against a worst-case
            // bright backdrop pixel down to ~ink/83 — below that it needs a
            // brighter resting color. bone/90 measures ~5.48:1 at ink/70,
            // still short of the hover state's full bone so the hovered pair
            // still reads as the brightest.
            backdropIsActive ? 'text-bone/90' : 'text-stone',
            'group-hover:tracking-[0.02em] group-hover:text-bone group-focus-within:tracking-[0.02em] group-focus-within:text-bone',
          )}
        >
          {region.name}
        </a>
        <span className="relative block aspect-[3/2] h-[1.4em] w-auto shrink-0 overflow-hidden">
          <img
            src={region.image.src}
            srcSet={region.image.srcSet}
            sizes="80px"
            alt=""
            loading="lazy"
            decoding="async"
            className={cn(
              'h-full w-full object-cover grayscale-[.4] saturate-[.75] transition-[filter] duration-500',
              'group-hover:grayscale-0 group-hover:saturate-100 group-hover:brightness-100',
              backdropIsActive ? 'brightness-100' : 'brightness-90',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-0 transition-colors duration-500',
              backdropIsActive ? 'bg-ink/5' : 'bg-ink/20',
            )}
          />
        </span>
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      id="regions"
      aria-labelledby={HEADING_ID}
      onMouseLeave={() => canHover && backdropHideRef.current?.()}
      // Keyboard parity: the spec only asks for pointer-leave, but a
      // keyboard user tabbing past the section (last region link → next
      // section) needs the same dismissal, or the backdrop is stuck open
      // with no pointer involved at all.
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && backdropHideRef.current?.()}
      className="relative overflow-hidden bg-ink py-20 text-bone md:py-28"
    >
      {/* Attention backdrop — full-bleed, behind everything, crossfades to
          whichever region is hovered/focused. Off entirely under reduced
          motion (not just inactive — no DOM at all). */}
      {!reduced && (
        <div
          ref={backdropWrapRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-0"
        >
          <img ref={imgARef} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0" />
          <img ref={imgBRef} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0" />
          {/* ink/70 (down from /85 for a brighter active backdrop) — worst case
              (pure-white backdrop pixel): plain text-stone alone would drop to
              ~2.72:1, so the resting name compensates to bone/90 whenever the
              backdrop is active (~5.48:1, still under the hover state's full
              bone). Hover/focus text (full bone) clears ~6.3:1 unconditionally. */}
          <div className="absolute inset-0 bg-ink/70" />
        </div>
      )}

      <div className="container-editorial relative z-10">
        <SectionLabel as="h2" index="05">
          Where We Go
        </SectionLabel>
      </div>

      {/* Full-bleed — no container-editorial on the rows themselves. Each row
          sets its own font-size context (text-display) so the em-based image
          height/gap/offset above track the fluid type; row 2 runs at 0.85x
          that size (and a matched 0.85x ambient speed) so the two rows read
          as a deliberate pair, not a repeat. */}
      <div className="relative z-10 mt-12 flex flex-col gap-8 md:mt-16 md:gap-10">
        <div
          ref={row1WrapperRef}
          onMouseEnter={() => canHover && (row1PausedRef.current = true)}
          onMouseLeave={() => canHover && (row1PausedRef.current = false)}
          onFocus={() => (row1PausedRef.current = true)}
          onBlur={() => (row1PausedRef.current = false)}
          className="font-display text-h2"
        >
          <Marquee speed={40} gap="1.25em" tweenRef={row1TweenRef}>
            {renderRegions(backdropActive)}
          </Marquee>
        </div>
        <div
          ref={row2WrapperRef}
          onMouseEnter={() => canHover && (row2PausedRef.current = true)}
          onMouseLeave={() => canHover && (row2PausedRef.current = false)}
          onFocus={() => (row2PausedRef.current = true)}
          onBlur={() => (row2PausedRef.current = false)}
          className="font-display"
          style={{ fontSize: 'calc(var(--text-h2) * 0.85)' }}
        >
          <Marquee speed={34} reverse gap="1.25em" tweenRef={row2TweenRef}>
            {renderRegions(backdropActive)}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
