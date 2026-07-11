import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { preload } from 'react-dom';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@/lib/gsap';
import { Button, CinematicMedia, RevealText, SectionLabel } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLenis } from '@/hooks/useLenis';
import { scrollToAnchor } from '@/lib/resolveAnchor';
import { hero } from '@/data/hero';
import { initHero, initHeroScrub } from './anim';

const AUTOPLAY_DELAY = 300; // ms — auto-play if no external trigger (e.g. Preloader)

// Section 1. Full-viewport cinematic hero. Owns its entrance timeline (created
// paused) and exposes play() via ref so the Preloader can hand off later; if
// nothing plays it in time it auto-plays. Reduced motion renders the final
// state with no timeline or scrub (section gates its own choreography).
const Hero = forwardRef(function Hero(_props, ref) {
  // LCP element — react-dom's Float dispatcher is only active once a render
  // is underway, so this must be called here (during Hero's own render),
  // not at main.jsx's module top-level (before any commit, the dispatcher is
  // a no-op there — confirmed via an empty <head>, see the delivery report).
  // Emits <link rel="preload" as="image"> with the same responsive set the
  // <img>/poster will use, without needing a build-time hash in index.html.
  preload(hero.media.poster.src, {
    as: 'image',
    imageSrcSet: hero.media.poster.srcSet,
    imageSizes: hero.media.poster.sizes,
    fetchPriority: 'high',
  });

  const sectionRef = useRef(null);
  const mediaLayerRef = useRef(null);
  const contentRef = useRef(null);
  const labelRef = useRef(null);
  const ctaRef = useRef(null);
  const cueRef = useRef(null);
  const playHeadlineRef = useRef(null); // RevealText's controlled play()
  const tlRef = useRef(null);
  const playedRef = useRef(false);

  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();

  // Route the CTA through the shared resolver (pin-aware) instead of a native
  // hash jump, which bypasses Lenis and can land mid-pin.
  const handleCta = (e) => {
    e.preventDefault();
    scrollToAnchor(lenis, hero.cta.href);
  };

  const play = useCallback(() => {
    playedRef.current = true;
    tlRef.current?.play();
  }, []);
  useImperativeHandle(ref, () => ({ play }), [play]);

  const handleHeadlineReady = useCallback((playFn) => {
    playHeadlineRef.current = playFn;
  }, []);

  useGSAP(
    () => {
      if (reduced) return; // static final state

      tlRef.current = initHero({
        mediaLayer: mediaLayerRef.current,
        playHeadline: () => playHeadlineRef.current?.(),
        label: labelRef.current,
        button: ctaRef.current,
        cue: cueRef.current,
      });
      initHeroScrub({ section: sectionRef.current, content: contentRef.current });

      const t = setTimeout(() => {
        if (!playedRef.current) play();
      }, AUTOPLAY_DELAY);

      return () => {
        clearTimeout(t);
        tlRef.current = null;
      };
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section ref={sectionRef} className="relative min-h-svh overflow-hidden bg-ink text-bone">
      {/* Background media layer (settle-zoom target for the entrance) */}
      <div ref={mediaLayerRef} className="absolute inset-0">
        <CinematicMedia
          video={hero.media.video}
          poster={hero.media.poster}
          image={hero.media.image}
          alt={hero.media.alt}
          overlay="scrim"
          parallax={10}
          priority
          reveal={false}
          className="h-full w-full"
        />
      </div>

      {/* Content layer */}
      <div
        ref={contentRef}
        className="container-editorial relative z-10 flex min-h-svh flex-col justify-end pb-16 md:pb-24"
      >
        <div ref={labelRef}>
          <SectionLabel index={hero.label.index}>{hero.label.text}</SectionLabel>
        </div>

        <RevealText
          as="h1"
          asLines
          paused
          onReady={handleHeadlineReady}
          className="mt-6 font-display text-display leading-[1.02] text-bone"
        >
          {hero.headline.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </RevealText>

        <div ref={ctaRef} className="mt-8">
          <Button href={hero.cta.href} onClick={handleCta} variant="primary" magnetic icon={ArrowRight}>
            {hero.cta.label}
          </Button>
        </div>

        {/* Scroll cue — desktop only, decorative; CSS pulse dies under reduced motion */}
        <div
          ref={cueRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-16 right-0 hidden flex-col items-center gap-3 md:flex md:bottom-24"
        >
          <span className="label text-stone">{hero.altitude}</span>
          <span className="label text-stone">{hero.scrollLabel}</span>
          <span className="h-12 w-px animate-pulse bg-stone/60" />
        </div>
      </div>
    </section>
  );
});

export default Hero;
