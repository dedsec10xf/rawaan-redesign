import { useRef } from 'react';
import { useGSAP } from '@/lib/gsap';
import { CinematicMedia, RevealText, SectionLabel } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { testimonial } from '@/data/testimonial';
import { initTestimonial } from './anim';

const HEADING_ID = 'testimonial-heading';

// Section 7. Full-bleed dark testimonial over a scrimmed image. Centered — the
// one non-hero exception to editorial asymmetry, because a single voice earns
// center stage. ONE testimonial, no carousel (locked). Section gates only its
// own fade-ups; primitives self-handle the rest.
export default function Testimonial() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const attributionRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return; // label/attribution fade-ups only
      initTestimonial({
        label: labelRef.current,
        attribution: attributionRef.current,
        section: sectionRef.current,
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      id="testimonial"
      aria-labelledby={HEADING_ID}
      className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink text-bone md:min-h-svh"
    >
      {/* Background media (image-only; owns its own reveal + parallax) */}
      <CinematicMedia
        image={testimonial.image}
        alt={testimonial.imageAlt}
        overlay="scrim"
        parallax={8}
        className="absolute inset-0"
      />
      {/* Deepen the scrim so bone passes contrast on any image (see report) */}
      <div aria-hidden="true" className="absolute inset-0 bg-ink/50" />

      <div className="container-editorial relative z-10 text-center">
        <div id={HEADING_ID} ref={labelRef}>
          <SectionLabel index={testimonial.label.index}>{testimonial.label.text}</SectionLabel>
        </div>

        <figure className="mt-8">
          <blockquote className="mx-auto max-w-[24ch]">
            <RevealText
              as="p"
              asLines
              className="font-display text-h2 leading-[1.15] text-bone"
            >
              {testimonial.quote.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </RevealText>
          </blockquote>

          <figcaption ref={attributionRef} className="mt-8">
            <cite className="label not-italic text-stone">{testimonial.attribution}</cite>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
