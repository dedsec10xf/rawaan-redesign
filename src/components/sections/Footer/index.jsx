import { useRef } from 'react';
import { useGSAP } from '@/lib/gsap';
import { AltitudeRule, SectionLabel } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { footer } from '@/data/footer';
import { initFooter } from './anim';

const { columns, watermark, wordmark, legal } = footer;

// Shared link treatment: bone-on-tarn for contrast, stone hover→bone, and a
// 44px min tap target.
const LINK = 'inline-flex min-h-11 items-center text-stone transition-colors duration-300 hover:text-bone';

// External-link attributes, applied only when a link opts in.
const ext = (external) => (external ? { target: '_blank', rel: 'noreferrer' } : {});

// Section 8 tail. Tarn panel with three columns, a decorative Nastaliq
// watermark, and an oversized wordmark clipped at the section's bottom edge
// that rises on scroll (see anim.js). Parallax is disabled under reduced motion.
export default function Footer() {
  const scope = useRef(null);
  const wordmarkRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return; // section parallax off under reduced motion
      initFooter({ root: scope.current, wordmark: wordmarkRef.current });
    },
    { scope, dependencies: [reduced] },
  );

  const year = new Date().getFullYear();

  return (
    <footer id="footer" ref={scope} className="relative overflow-hidden bg-tarn text-bone">
      <div className="container-editorial relative pt-16 pb-40 md:pt-20 md:pb-56">
        {/* Decorative watermark — sits behind the content (z-0) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[4%] top-[6%] z-0 select-none leading-none text-stone/[0.08]"
          style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: 'clamp(7rem, 20vw, 17rem)' }}
        >
          {watermark}
        </span>

        <div className="relative z-10">
          <AltitudeRule className="bg-stone/30" />

          <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
            {/* Explore */}
            <nav aria-label="Footer">
              <SectionLabel as="h2">{columns.explore.heading}</SectionLabel>
              <ul className="mt-6 flex flex-col">
                {columns.explore.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={LINK}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div>
              <SectionLabel as="h2">{columns.contact.heading}</SectionLabel>
              <ul className="mt-6 flex flex-col">
                {columns.contact.items.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={LINK} {...ext(item.external)}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <address className="mt-4 whitespace-pre-line not-italic leading-relaxed text-stone">
                {columns.contact.address}
              </address>
            </div>

            {/* Social */}
            <div>
              <SectionLabel as="h2">{columns.social.heading}</SectionLabel>
              <ul className="mt-6 flex flex-col">
                {columns.social.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={LINK} {...ext(link.external)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal */}
          <div className="mt-16">
            <p className="label text-stone">
              © {year} {legal.company}. {legal.rights}
            </p>
          </div>
        </div>
      </div>

      {/* Oversized wordmark, clipped by the section's overflow-hidden bottom edge.
          Outer wrapper holds the static clip offset; the inner span carries the
          GSAP parallax transform (kept separate so they don't fight). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex translate-y-[15%] justify-center"
      >
        <span
          ref={wordmarkRef}
          className="whitespace-nowrap font-display leading-[0.8] text-bone/[0.05]"
          style={{ fontSize: 'clamp(4rem, 26vw, 22rem)' }}
        >
          {wordmark}
        </span>
      </div>
    </footer>
  );
}
