import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button, SectionLabel } from '@/components/primitives';
import { EXPO_OUT } from '@/lib/easings';
import { images } from '@/assets/images';
import { nav } from '@/data/nav';

const { primary, cta, contact, socials } = nav;

const STAGGER = 0.07;

// Satellite-zoom background: same hero still, cropped-in when closed, easing out
// to the full contained image on open. (Uses the shared asset URL — does not
// touch the Hero section.)
const MENU_IMAGE = images['hero-poster'].src;
const MENU_IMAGE_SRCSET = images['hero-poster'].srcSet;
const imageV = {
  hidden: { scale: 2.4 }, // matches the hero's cropped framing
  visible: { scale: 1, transition: { duration: 1.2, ease: EXPO_OUT } },
  exit: { scale: 2.4, transition: { duration: 0.6, ease: EXPO_OUT } },
};

// Secondary link treatment inside the menu (44px tap targets).
const SUB_LINK = 'inline-flex min-h-11 items-center text-bone/80 transition-colors hover:text-bone';

// Controlled full-screen menu overlay. State (open/close) is owned by Header;
// this component only renders + choreographs via Framer variants. Reduced motion
// collapses the reveal to a quick fade with no stagger/rise.
//
// Portaled to <body> so it's a top-level fixed layer (never trapped by an
// ancestor's transform/stacking context) at --z-menu-overlay, below the header
// bar so the toggle stays the close control.
const Menu = forwardRef(function Menu({ id, reduced, onNavigate }, ref) {
  const overlayV = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
        visible: {
          clipPath: 'inset(0% 0% 0% 0%)',
          transition: { duration: 0.7, ease: EXPO_OUT, when: 'beforeChildren' },
        },
        exit: { clipPath: 'inset(100% 0% 0% 0%)', transition: { duration: 0.5, ease: EXPO_OUT } },
      };

  const listV = reduced
    ? { hidden: {}, visible: {} }
    : { hidden: {}, visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.25 } } };

  const itemV = reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { y: '110%' },
        visible: { y: '0%', transition: { duration: 0.6, ease: EXPO_OUT } },
      };

  return createPortal(
    <motion.div
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      className="fixed inset-0 z-[var(--z-menu-overlay)] overflow-hidden bg-ink text-bone"
      style={{ willChange: 'clip-path' }}
      variants={overlayV}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Satellite-zoom image + scrim (motion only). Reduced motion → solid ink. */}
      {!reduced && (
        <>
          <motion.img
            src={MENU_IMAGE}
            srcSet={MENU_IMAGE_SRCSET}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-contain will-change-transform"
            variants={imageV}
          />
          {/* ink/60: keeps bone menu text ≥4.5:1 even over a bright image */}
          <div aria-hidden="true" className="absolute inset-0 bg-ink/60" />
        </>
      )}

      <div className="container-editorial relative z-10 flex h-full flex-col pb-10 pt-28">
        <nav aria-label="Primary" className="flex flex-1 items-center">
          <motion.ul variants={listV} className="w-full">
            {primary.map((item) => (
              <li key={item.href} className="overflow-hidden">
                <motion.a
                  variants={itemV}
                  href={item.href}
                  onClick={(e) => onNavigate(e, item.href)}
                  className="group flex items-baseline gap-4 py-1.5 text-bone md:py-2"
                >
                  <span className="label text-stone transition-colors group-hover:text-accent">
                    {item.index}
                  </span>
                  <span
                    className="font-display leading-[1.05] transition-colors group-hover:text-accent"
                    style={{ fontSize: 'var(--text-h2)' }}
                  >
                    {item.label}
                  </span>
                </motion.a>
              </li>
            ))}
          </motion.ul>
        </nav>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col">
            <SectionLabel as="h2">{contact.heading}</SectionLabel>
            <a href={contact.phone.href} className={SUB_LINK}>
              {contact.phone.label}
            </a>
            <a href={contact.email.href} className={SUB_LINK}>
              {contact.email.label}
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-6">
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className={`${SUB_LINK} label`}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <Button
            href={cta.href}
            variant="primary"
            icon={ArrowRight}
            magnetic
            onClick={(e) => onNavigate(e, cta.href)}
          >
            {cta.label}
          </Button>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
});

export default Menu;
