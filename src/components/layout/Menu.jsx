import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { nav } from '@/data/nav';
import { useAnchorNav } from '@/hooks/useAnchorNav';
import { cn } from '@/utils/cn';

const { primary, cta, contact, socials } = nav;

// v2 motion spec (CLAUDE.md): 150–250ms UI, fade + 8px rise, stagger 60ms,
// nothing over 400ms.
const PANEL_V = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, staggerChildren: 0.06 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};
const ITEM_V = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const LINK = 'inline-flex min-h-11 items-center text-navy transition-colors hover:text-cyan-deep';
const SUB_LINK = 'inline-flex min-h-11 items-center text-slate transition-colors hover:text-navy';

// Light dropdown panel (v2) — anchored under the header bar, not a fullscreen
// overlay. No portal, no scroll-lock, no satellite-zoom background: a plain
// UI dropdown doesn't need any of the v1 editorial menu's choreography.
//
// Primary items are a MIX of homepage-section hashes ('#featured-tours') and
// real routes ('/build') — nav.js's own comment explains the split. Hash
// items render as plain <a> with useAnchorNav's click handler (same-page
// scroll on '/', cross-route navigate+scroll everywhere else); route items
// stay plain react-router <Link>. `activeTo` (Header's scroll-spy + route
// match) highlights whichever one matches the current section/route.
const Menu = forwardRef(function Menu({ id, reduced, activeTo, onNavigate }, ref) {
  const handleAnchorClick = useAnchorNav();
  const variants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.15 } }, exit: { opacity: 0 } }
    : PANEL_V;
  const itemVariants = reduced ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : ITEM_V;

  return (
    <motion.div
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      className="absolute inset-x-0 top-full border-b border-line bg-white shadow-md"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container-editorial flex flex-col gap-8 py-8 md:flex-row md:justify-between">
        <nav aria-label="Primary">
          <motion.ul className="flex flex-col gap-1">
            {primary.map((item) => {
              const isHash = item.to.startsWith('#');
              const isActive = item.to === activeTo;
              const linkClassName = cn(LINK, 'font-display text-h3', isActive && 'text-cyan-deep underline underline-offset-4');
              return (
                <motion.li key={item.to} variants={itemVariants}>
                  {isHash ? (
                    <a
                      href={item.to}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={(e) => {
                        handleAnchorClick(item.to)(e);
                        onNavigate();
                      }}
                      className={linkClassName}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={onNavigate}
                      className={linkClassName}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        <div className="flex flex-col gap-6 md:items-end">
          <motion.div variants={itemVariants} className="flex flex-col md:items-end">
            <span className="label text-slate">{contact.heading}</span>
            <a href={contact.phone.href} className={SUB_LINK}>
              {contact.phone.label}
            </a>
            <a href={contact.email.href} className={SUB_LINK}>
              {contact.email.label}
            </a>
          </motion.div>

          <motion.ul variants={itemVariants} className="flex flex-wrap gap-x-6 md:justify-end">
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className={`${SUB_LINK} label`}>
                  {s.label}
                </a>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={itemVariants}>
            <Link
              to={cta.to}
              onClick={onNavigate}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 font-sans text-sm font-medium text-navy transition-colors duration-300 hover:bg-accent/90"
            >
              {cta.label}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

export default Menu;
