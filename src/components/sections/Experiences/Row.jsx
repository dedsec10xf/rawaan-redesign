import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useLenis } from '@/hooks/useLenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { resolveAnchor, scrollToAnchor } from '@/lib/resolveAnchor';
import { EXPO_OUT } from '@/lib/easings';
import { cn } from '@/utils/cn';

const descriptionVariants = {
  closed: { height: 0, opacity: 0 },
  open: { height: 'auto', opacity: 1 },
};

// One experience row. Two interaction modes, chosen by the parent
// (desktopInteractive = pointer-fine, ≥768, motion allowed):
//   - true:  the row IS the link (<a href="#contact">). Hover/focus expands
//     the description (Framer state) and drives the section's single
//     floating cursor-image (GSAP, owned by the parent — this component only
//     reports which image via onHoverImage). Title-color + x-offset are plain
//     CSS transitions (group-hover/group-focus-visible) — no JS needed for those.
//   - false: the row is an accordion trigger (<button>). Tap toggles the
//     description open, which also carries an inline thumbnail. No hover
//     concept, no floating image, no x-offset.
//
// desktopInteractive already folds in reduced-motion at the parent (an
// unhurried reduced-motion visitor gets the simpler, non-hover-dependent
// accordion too — hover-expand isn't meaningful without the motion to sell it).
export function Row({ experience, desktopInteractive, onHoverImage }) {
  const [open, setOpen] = useState(false); // mobile/reduced accordion state
  const [active, setActive] = useState(false); // desktop hover/focus state
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();

  const expanded = desktopInteractive ? active : open;
  const transition = reduced ? { duration: 0 } : { duration: 0.4, ease: EXPO_OUT };
  const descId = `${experience.id}-description`;

  const handleEnter = () => {
    if (!desktopInteractive) return;
    setActive(true);
    onHoverImage(experience.image, experience.imageAlt);
  };
  const handleLeave = () => {
    if (!desktopInteractive) return;
    setActive(false);
  };

  const handleClick = (e) => {
    if (!desktopInteractive) {
      setOpen((o) => !o);
      return;
    }
    e.preventDefault();
    // #contact doesn't exist yet — fall back to the footer so the click still
    // does something rather than silently no-op.
    const hasContact = resolveAnchor('#contact') != null;
    scrollToAnchor(lenis, hasContact ? '#contact' : '#footer');
  };

  const Tag = desktopInteractive ? 'a' : 'button';
  const interactiveProps = desktopInteractive
    ? { href: '#contact', 'aria-describedby': descId }
    : { type: 'button', 'aria-expanded': open, 'aria-controls': descId };

  return (
    <Tag
      data-row
      {...interactiveProps}
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className={cn(
        'group flex w-full flex-col py-6 text-left transition-transform duration-300 md:py-8',
        desktopInteractive && 'hover:translate-x-3 focus-visible:translate-x-3',
      )}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="label shrink-0 text-stone">{experience.index}</span>
        <span
          className={cn(
            'font-display text-h2 leading-none text-bone transition-colors duration-300',
            desktopInteractive && 'group-hover:text-accent group-focus-visible:text-accent',
          )}
        >
          {experience.title}
        </span>
        {!desktopInteractive && (
          <Plus
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className={cn('ml-auto shrink-0 text-stone transition-transform duration-300', open && 'rotate-45')}
          />
        )}
      </div>

      <motion.div
        id={descId}
        initial="closed"
        animate={expanded ? 'open' : 'closed'}
        variants={descriptionVariants}
        transition={transition}
        className="overflow-hidden"
      >
        <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-start md:gap-6 md:pl-[calc(2rem+3ch)]">
          {!desktopInteractive && (
            <img
              src={experience.image.src}
              srcSet={experience.image.srcSet}
              sizes="96px"
              alt={experience.imageAlt}
              loading="lazy"
              decoding="async"
              className="aspect-[3/4] w-24 shrink-0 object-cover"
            />
          )}
          <p className="max-w-[42ch] text-body text-stone">{experience.description}</p>
        </div>
      </motion.div>
    </Tag>
  );
}
