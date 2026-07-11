import { useRef } from 'react';
import { useGSAP } from '@/lib/gsap';
import { AltitudeRule, RevealImage, SectionLabel } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { manifesto } from '@/data/manifesto';
import { initManifesto } from './anim';

// Section 2. First bone breather: an oversized editorial manifesto on an
// asymmetric column, with two offset texture images (one bleeding past the
// right margin). Word-scrub / entrance are gated for reduced motion here.
export default function Manifesto() {
  const sectionRef = useRef(null);
  const paragraphRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return; // full-opacity static text, static images
      return initManifesto({ paragraph: paragraphRef.current, section: sectionRef.current });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative overflow-hidden bg-bone py-24 text-ink md:py-40"
    >
      <div className="container-editorial">
        <AltitudeRule className="bg-ink/15" />

        <div className="mt-8">
          <SectionLabel tone="ink" index={manifesto.label.index}>
            {manifesto.label.text}
          </SectionLabel>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-16 md:grid-cols-12 md:items-start md:gap-x-6">
          {/* Manifesto copy — cols 2–9 (asymmetric, not centered) */}
          <p
            ref={paragraphRef}
            className="font-display text-h2 leading-[1.12] text-ink md:col-span-8 md:col-start-2"
          >
            {manifesto.body}
          </p>

          {/* Offset texture images — cols 10–12, staggered by vertical offset */}
          <div className="flex flex-col gap-10 md:col-span-3 md:col-start-10 md:mt-24">
            <RevealImage
              src={manifesto.images[0].image}
              alt={manifesto.images[0].alt}
              aspectRatio={manifesto.images[0].aspectRatio}
              className="ml-auto w-2/3 bg-stone/20 md:w-full"
            />
            {/* Second image bleeds past the container's right margin (clipped by
                the section's overflow-hidden) for the editorial overlap. */}
            <div
              className="ml-auto w-2/3 md:w-4/5"
              style={{ marginRight: 'calc(-1 * clamp(16px, 5vw, 96px))' }}
            >
              <RevealImage
                src={manifesto.images[1].image}
                alt={manifesto.images[1].alt}
                aspectRatio={manifesto.images[1].aspectRatio}
                className="bg-stone/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
