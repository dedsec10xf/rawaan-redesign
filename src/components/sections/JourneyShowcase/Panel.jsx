import { ArrowUpRight } from 'lucide-react';
import { Button, RevealImage } from '@/components/primitives';

// One journey panel. Single composition (carousel cut — mobile is now the
// plain vertical stack, delivery-1's matchMedia fallback):
//   • Below md: normal document flow — image (height-constrained, so it — the
//     tallest element — fits comfortably; width follows aspect 3/4), name
//     below it, meta + CTA below that. min-h-svh so nothing is clipped.
//   • ≥md: asymmetric pin composition — oversized name floats off the image's
//     right edge, meta as a side block, giant decorative index behind.
//
// Reveal ownership (CLAUDE.md): anim.js is the SINGLE owner of hide+reveal for
// every panel's image/name, in every mode — RevealImage always renders
// `static`, never animates itself here.
//
// eager is required, not optional: panels sit multiple viewport-widths to the
// right in the real (untransformed) flex layout — only a GSAP transform on the
// track brings them visually into view, which native loading="lazy" has no way
// to anticipate. Only 5 images in this section, so eager-loading all of them
// is cheap.
//
// Hover scope = the IMAGE+NAME cluster (`group`), NOT the full-viewport panel.
export function Panel({ journey }) {
  return (
    <article
      data-panel
      className="relative flex min-h-svh w-full flex-none items-center overflow-hidden md:h-svh md:w-screen"
    >
      {/* Decorative index behind the content */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display leading-none text-stone/[0.06]"
        style={{ fontSize: '46vh' }}
      >
        {journey.index}
      </span>

      <div className="container-editorial relative flex w-full flex-col items-center gap-12 py-28 md:flex-row md:justify-between md:gap-8 md:py-0">
        {/* Image + name cluster — the hover scope */}
        <div className="group relative shrink-0">
          {/* Separate transform owners: [data-parallax] = GSAP x drift, inner =
              CSS hover scale, [data-reveal-image] = GSAP reveal (y + fade). */}
          <div data-parallax className="w-fit will-change-transform">
            <div className="w-fit transition-transform duration-500 ease-out group-hover:scale-[1.04]">
              <div data-reveal-image className="w-fit">
                <RevealImage
                  src={journey.image}
                  alt={journey.imageAlt}
                  aspectRatio="3/4"
                  static
                  eager
                  className="h-[clamp(300px,56svh,620px)] w-auto bg-stone/10"
                />
              </div>
            </div>
          </div>

          {/* Name flows below the image on mobile; overlaps its right edge on
              desktop. GSAP reveals the inner span; the h3 keeps position. */}
          <h3 className="mt-6 font-display text-display leading-[0.95] text-bone transition-colors duration-300 group-hover:text-accent [&_span]:transition-colors [&_span]:duration-300 md:absolute md:left-[66%] md:top-1/2 md:mt-0 md:-translate-y-1/2">
            <span data-reveal-name className="block">
              {journey.nameLines.map((line, i) => (
                <span key={i} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </span>
          </h3>
        </div>

        {/* Meta + CTA — one centred block, always within the viewport */}
        <div className="flex shrink-0 flex-col gap-8">
          <dl className="flex flex-col gap-2">
            <div className="label text-stone">{journey.duration}</div>
            <div className="label text-stone">{journey.region}</div>
            <div className="label text-stone">From {journey.priceFrom}</div>
          </dl>
          <Button href="#contact" variant="ghost" magnetic icon={ArrowUpRight}>
            Explore
          </Button>
        </div>
      </div>
    </article>
  );
}
