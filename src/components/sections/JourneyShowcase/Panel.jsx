import { ArrowUpRight } from 'lucide-react';
import { Button, RevealImage } from '@/components/primitives';

// One journey panel — full-bleed image composition (replaces the earlier
// floated-portrait + giant decorative index; see M8 design pass).
//   • The journey photo IS the panel: absolute inset-0, object-cover, inside
//     the same [data-parallax] wrapper as before (now overscanned
//     horizontally so the wider drift — see anim.js — never reveals an edge).
//   • Two scrims (left-edge + bottom) carry legibility for the text sitting
//     over the image; both are held at full strength through the zone the
//     text actually occupies, not a plain linear fade, so contrast doesn't
//     degrade at an arbitrary midpoint (see contrast note below).
//   • Content is one baseline strip, bottom-anchored with the same pb-24 the
//     section's fixed counter/progress-bar uses (index.jsx), so the name+meta
//     block (lower-left) and the Explore button (bottom-right on desktop)
//     share a horizontal band with that fixed UI.
//
// Contrast check (WCAG AA, ≥4.5:1, worst case = pure-white image pixel):
//   - Name (bone) + meta (stone) sit in the OVERLAP of both scrims (left
//     hold 0.70 + bottom hold 0.80 → combined alpha 1-(0.3*0.2)=0.94 over
//     ink #0C1210) → bone ~14.6:1, stone ~6.3:1. Both clear.
//   - Explore button (bone text) sits right of the left-scrim's fade-out, so
//     only the bottom scrim (0.80) applies → ~9.2:1. Clears.
//
// Reveal ownership (CLAUDE.md): anim.js is the SINGLE owner of hide+reveal for
// every panel's image / name / meta+button, in every mode — RevealImage
// always renders `static` here, never animates itself.
//
// eager is required, not optional: panels sit multiple viewport-widths to the
// right in the real (untransformed) flex layout — only a GSAP transform on the
// track brings them visually into view, which native loading="lazy" has no way
// to anticipate. Only 5 images in this section, so eager-loading all of them
// is cheap.
export function Panel({ journey }) {
  return (
    <article
      data-panel
      className="relative flex min-h-[80svh] w-full flex-none overflow-hidden md:h-svh md:w-screen"
    >
      {/* Full-bleed image — parallax wrapper overscans left/right (PARALLAX + 2%,
          see anim.js) so its xPercent drift never shows a gap. */}
      <div data-parallax className="absolute inset-y-0 -left-[6%] -right-[6%] will-change-transform">
        <div data-reveal-image className="absolute inset-0">
          <RevealImage
            src={journey.image}
            alt={journey.imageAlt}
            aspectRatio="auto"
            static
            eager
            className="absolute inset-0"
            objectPosition={journey.imageFocalPoint}
          />
        </div>
      </div>

      {/* Scrims — left-edge (held through the text column, then fades) and
          bottom (held through the lower band, then fades upward). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(12,18,16,0.70) 0%, rgba(12,18,16,0.70) 38%, rgba(12,18,16,0) 78%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
        style={{
          background:
            'linear-gradient(to top, rgba(12,18,16,0.80) 0%, rgba(12,18,16,0.80) 45%, rgba(12,18,16,0) 100%)',
        }}
      />

      {/* Content — bottom-anchored baseline strip, shared pb-24 with the
          fixed counter/progress in index.jsx. Only the button shares that
          exact line (bottom-right, clear of the counter which lives
          bottom-left in index.jsx's fixed overlay); the name+meta column adds
          its own md:mb-16 to clear the counter's footprint instead of
          colliding with it at the same bottom-left position. */}
      <div className="container-editorial absolute inset-0 z-10 flex flex-col justify-end pb-12 md:pb-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex flex-col gap-4 md:mb-16">
            <h3 className="font-display text-display leading-[0.95] text-bone">
              <span data-reveal-name className="block">
                {journey.nameLines.map((line, i) => (
                  <span key={i} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </span>
            </h3>

            <div data-reveal-meta>
              <dl className="flex flex-col gap-2">
                <div className="label text-stone">{journey.duration}</div>
                <div className="label text-stone">{journey.region}</div>
                <div className="label text-stone">From {journey.priceFrom}</div>
              </dl>
            </div>
          </div>

          <div data-reveal-meta className="shrink-0">
            <Button href="#contact" variant="ghost" magnetic icon={ArrowUpRight}>
              Explore
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
