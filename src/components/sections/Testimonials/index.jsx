import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Quote } from 'lucide-react';
import { useGSAP } from '@/lib/gsap';
import { SectionHeader, Rating } from '@/components/ui';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { testimonials } from '@/data/testimonials';
import { initTestimonials } from './anim';

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
}

// Section 7 — Testimonials (CLAUDE.md's homepage IA). 3 static cards, no
// carousel — clean and scannable rather than another interactive widget on a
// page that already has plenty. Avatars are initials in a circle rather than
// an invented stock photo (a fabricated name is already demo data; a
// fabricated PHOTO of a person reads as more deceptive than a monogram).
export default function Testimonials() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRefs = useRef([]);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      initTestimonials({ header: headerRef.current, cards: cardRefs.current, section: sectionRef.current });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section ref={sectionRef} id="testimonials" className="bg-mist py-24 md:py-32">
      <div className="container-editorial">
        <div ref={headerRef}>
          <SectionHeader eyebrow="TRAVELLER STORIES" heading="What our travellers say" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
            >
              <Quote size={24} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
              <p className="text-body text-navy">&ldquo;{t.quote}&rdquo;</p>
              <Rating value={t.rating} size="md" />
              <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 font-sans text-sm font-medium text-cyan-deep"
                >
                  {initials(t.name)}
                </span>
                <div>
                  <p className="font-sans text-sm font-medium text-navy">{t.name}</p>
                  <p className="text-small text-slate">
                    {t.country} ·{' '}
                    {/* Both tours and packages resolve under /packages/:slug
                        (App.jsx's one detail route) — tripType is kept on
                        the data for documentation, not branching here. */}
                    <Link to={`/packages/${t.tripSlug}`} className="text-cyan-deep underline-offset-4 hover:underline">
                      {t.tripName}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
