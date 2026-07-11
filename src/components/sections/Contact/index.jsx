import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useGSAP } from '@/lib/gsap';
import { AltitudeRule, Button, RevealText, SectionLabel } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EXPO_OUT } from '@/lib/easings';
import { cn } from '@/utils/cn';
import { contact } from '@/data/contact';
import { footer } from '@/data/footer';
import { faq } from '@/data/faq';
import { initContact } from './anim';

const HEADING_ID = 'contact-heading';

// Contact details are NOT duplicated here. footer.js is already the
// established single source of truth for phone/WhatsApp/email — nav.js
// already reuses it the exact same way (see its own comment: "Contact/socials
// reuse footer data so there's a single source of truth"). Importing it
// directly here, rather than inventing a third shared data location, keeps
// that one existing pattern instead of leaving two side by side.
const { items: contactItems } = footer.columns.contact;
const phone = contactItems.find((item) => item.kind === 'phone');
const whatsapp = contactItems.find((item) => item.kind === 'whatsapp');
const email = contactItems.find((item) => item.kind === 'email');

// 4 of the 5 FAQ entries, for a luxury audience. Dropped 'fitness' — it's a
// practical logistics question better resolved in a personal consultation
// than sitting in a public FAQ; the four kept (season, solo/couple, permits,
// safety) speak directly to planning confidence and full-service trust.
const FAQ_IDS = ['best-season', 'solo', 'permits', 'safety'];
const faqItems = FAQ_IDS.map((id) => faq.find((item) => item.id === id));

const ANSWER_VARIANTS = { closed: { height: 0, opacity: 0 }, open: { height: 'auto', opacity: 1 } };
const LINK = 'label inline-flex min-h-11 items-center text-stone transition-colors duration-300 hover:text-bone';

// Section 8 — Final CTA + FAQ. The page's exhale before the ask: a two-line
// display headline, a primary CTA, a quieter secondary contact row, then a
// small accordion. Anchor target for every "#contact" link built across M6/M7
// (Journey panels, Experiences rows, Regions names) — those previously fell
// back to #footer via resolveAnchor when this section didn't exist yet.
export default function Contact() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const buttonsRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [openId, setOpenId] = useState(null);

  useGSAP(
    () => {
      if (reduced) return; // label/button fade-up only; RevealText + AltitudeRule self-handle theirs
      initContact({ label: labelRef.current, buttons: buttonsRef.current, section: sectionRef.current });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const transition = reduced ? { duration: 0 } : { duration: 0.4, ease: EXPO_OUT };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby={HEADING_ID}
      className="relative bg-ink py-32 text-bone md:py-48"
    >
      <div className="container-editorial">
        <div id={HEADING_ID} ref={labelRef}>
          <SectionLabel index={contact.label.index}>{contact.label.text}</SectionLabel>
        </div>

        <RevealText as="h2" asLines className="mt-8 font-display text-display leading-[0.95] text-bone">
          {contact.headlineLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </RevealText>

        <div
          ref={buttonsRef}
          className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-center md:gap-12"
        >
          {/* Primary: mailto — a written first inquiry suits a considered,
              luxury booking flow better than pushing straight to a call. */}
          <Button href={email.href} variant="primary" magnetic icon={ArrowUpRight}>
            {contact.cta.label}
          </Button>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={whatsapp.href} target="_blank" rel="noreferrer" className={LINK}>
              {whatsapp.label}
            </a>
            <a href={phone.href} className={LINK}>
              {phone.label}
            </a>
          </div>
        </div>

        {/* Plain hairline, not AltitudeRule — AltitudeRule self-draws via its
            own ScrollTrigger, which is the right cost for a section-level
            rule but needless overhead repeated per accordion row; a static
            border is the cheaper, correct choice for a list separator. */}
        <AltitudeRule className="mt-24 bg-stone/25 md:mt-32" />

        <div className="mt-12 md:mt-16">
          {faqItems.map((item) => {
            const open = openId === item.id;
            const answerId = `${item.id}-answer`;
            return (
              <div key={item.id} className="border-t border-stone/25 first:border-t-0">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={answerId}
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex min-h-11 w-full items-center justify-between gap-6 py-6 text-left md:py-8"
                >
                  <span className="font-display text-h3 text-bone">{item.question}</span>
                  <Plus
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className={cn('shrink-0 text-stone transition-transform duration-300', open && 'rotate-45')}
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
                  <p className="max-w-prose pb-6 text-body text-stone md:pb-8">{item.answer}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
