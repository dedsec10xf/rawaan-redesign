import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { AltitudeRule, SectionLabel } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMedia } from '@/hooks/useMedia';
import { experiences } from '@/data/experiences';
import { Row } from './Row';
import { initExperiences } from './anim';

const HEADING_ID = 'experiences-heading';

// Section 4 — What We Do. A vertical list of oversized rows: desktop hovers
// expand each row's description and drive a single cursor-following preview
// image; mobile taps toggle an accordion with an inline thumbnail instead.
// anim.js only owns the entrance fade-up — everything else here is
// component-level (Framer for state UI, CSS for simple hover transitions,
// GSAP quickTo for the cursor-driven image), per the scroll-vs-interaction split.
export default function Experiences() {
  const sectionRef = useRef(null);
  const rowsRef = useRef(null);
  const listRef = useRef(null);
  const floatRef = useRef(null);
  const floatImgRef = useRef(null);
  const controllerRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMedia('(min-width: 768px)');
  const canHover = useMedia('(hover: hover) and (pointer: fine)');
  // Hover-expand + floating image only when all three hold — under reduced
  // motion the row falls back to the accordion (hover-expand isn't meaningful
  // without the motion that sells it), same as touch/narrow viewports.
  const desktopInteractive = isDesktop && canHover && !reduced;

  useGSAP(
    () => {
      if (reduced) return; // entrance only; nothing to animate under reduced motion
      initExperiences({
        section: sectionRef.current,
        rows: rowsRef.current.querySelectorAll('[data-row]'),
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  // Cursor-following preview image — GSAP-owned end to end (position via
  // quickTo, visibility + image-swap via direct tweens), so hover/pointermove
  // never triggers a React re-render. Rows only report which image to show;
  // this effect owns showing/hiding/moving it.
  useGSAP(
    () => {
      if (!desktopInteractive) return;
      const wrapper = floatRef.current;
      const img = floatImgRef.current;
      const xTo = gsap.quickTo(wrapper, 'x', { duration: 0.5, ease: 'expoOut' });
      const yTo = gsap.quickTo(wrapper, 'y', { duration: 0.5, ease: 'expoOut' });
      let currentSrc = null;

      // `image` is the registry's responsive object ({ src, srcSet, sizes }).
      const show = (image, alt) => {
        if (image.src === currentSrc) return;
        const firstShow = currentSrc == null;
        currentSrc = image.src;
        const apply = () => {
          img.src = image.src;
          if (image.srcSet) img.srcset = image.srcSet;
          img.sizes = image.sizes ?? '300px';
          img.alt = alt;
        };
        if (firstShow) {
          apply();
          gsap.to(wrapper, { autoAlpha: 1, duration: 0.3 });
        } else {
          // Quick crossfade (fade out → swap src → fade in) rather than an
          // instant swap — reads calmer as the cursor moves between rows.
          gsap.timeline().to(img, { opacity: 0, duration: 0.15 }).call(apply).to(img, { opacity: 1, duration: 0.15 });
        }
      };
      const hide = () => {
        currentSrc = null;
        gsap.to(wrapper, { autoAlpha: 0, duration: 0.3 });
      };
      const move = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      controllerRef.current = show;
      const list = listRef.current;
      list.addEventListener('pointermove', move);
      list.addEventListener('pointerleave', hide);
      return () => {
        list.removeEventListener('pointermove', move);
        list.removeEventListener('pointerleave', hide);
        controllerRef.current = null;
      };
    },
    { dependencies: [desktopInteractive], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="experiences"
      aria-labelledby={HEADING_ID}
      className="relative bg-ink py-24 text-bone md:py-36"
    >
      <div className="container-editorial">
        <AltitudeRule className="bg-stone/25" />

        <div id={HEADING_ID} className="mt-8">
          <SectionLabel as="h2" index="04">
            What We Do
          </SectionLabel>
        </div>

        <div ref={listRef} className="relative mt-16 md:mt-20">
          <div ref={rowsRef}>
            {experiences.map((experience) => (
              <div key={experience.id}>
                <AltitudeRule className="bg-stone/25" />
                <Row
                  experience={experience}
                  desktopInteractive={desktopInteractive}
                  onHoverImage={(src, alt) => controllerRef.current?.(src, alt)}
                />
              </div>
            ))}
          </div>
          <AltitudeRule className="bg-stone/25" />
        </div>

        {/* Cursor-following preview image — desktop hover only, decorative */}
        {desktopInteractive && (
          <div
            ref={floatRef}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-40 opacity-0"
            style={{ willChange: 'transform' }}
          >
            <div className="h-[400px] w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
              <img ref={floatImgRef} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
