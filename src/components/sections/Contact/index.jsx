import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useGSAP } from '@/lib/gsap';
import { SectionHeader, LeadCard } from '@/components/ui';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';
import { faq } from '@/data/faq';
import { initContact } from './anim';

const HEADING_ID = 'contact-heading';
const ANSWER_VARIANTS = { closed: { height: 0, opacity: 0 }, open: { height: 'auto', opacity: 1 } };

// Section 8 — FAQ + Lead (CLAUDE.md's homepage IA). Replaces v1's Contact
// section entirely (deleted: the display headline, mailto CTA, and 4-item
// FAQ tail written for a cinematic-brochure audience). Same id="contact" and
// file path — every existing "#contact" link across the site (nav, footer,
// resolveAnchor fallbacks) keeps working unchanged.
//
// The lead form is the shared `LeadCard` (src/components/ui/LeadCard.jsx —
// promoted from this section in V8 to a shared component, now also used by
// TourDetail/V9). It is NOT the planner's LeadForm
// (src/components/planner/LeadForm): that one shows a trip's already-
// captured `notes` read-only and asks for a preferred CONTACT method; this
// one asks what kind of trip you're interested in. The two field sets
// diverge enough that one shared component would mean conditionally hiding/
// adding fields rather than actually sharing logic.
export default function Contact() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const accordionRef = useRef(null);
  const formCardRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [openId, setOpenId] = useState(null);

  useGSAP(
    () => {
      if (reduced) return;
      initContact({ header: headerRef.current, columns: [accordionRef.current, formCardRef.current], section: sectionRef.current });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const transition = reduced ? { duration: 0 } : { duration: 0.25 };

  return (
    <section ref={sectionRef} id="contact" aria-labelledby={HEADING_ID} className="bg-white py-24 md:py-32">
      <div className="container-editorial">
        <div ref={headerRef} id={HEADING_ID}>
          <SectionHeader eyebrow="QUESTIONS" heading="Everything you need to know" />
        </div>

        <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
          <div ref={accordionRef}>
            {faq.map((item) => {
              const open = openId === item.id;
              const answerId = `${item.id}-answer`;
              return (
                <div key={item.id} className="border-t border-line first:border-t-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex min-h-11 w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-display text-h3 text-navy">{item.question}</span>
                    <Plus
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className={cn('shrink-0 text-slate transition-transform duration-300', open && 'rotate-45')}
                    />
                  </button>
                  <motion.div
                    id={answerId}
                    initial="closed"
                    animate={open ? 'open' : 'closed'}
                    variants={ANSWER_VARIANTS}
                    transition={transition}
                    className="overflow-hidden"
                  >
                    <p className="max-w-prose pb-5 text-body text-slate">{item.answer}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <div ref={formCardRef}>
            <LeadCard heading="Send us a message" />
          </div>
        </div>
      </div>
    </section>
  );
}
