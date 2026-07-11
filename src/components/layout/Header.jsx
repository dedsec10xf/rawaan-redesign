import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EXPO_OUT } from '@/lib/easings';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLenis } from '@/hooks/useLenis';
import { scrollToAnchor } from '@/lib/resolveAnchor';
import { nav } from '@/data/nav';
import Menu from './Menu';

// Fixed, always-visible header + full-screen menu. Owns the open/close state
// (Framer via AnimatePresence), scroll-lock, focus trap, and Escape.
//
// No hide-on-scroll transform: writing a transform onto the header made the
// fixed <Menu> descendant resolve against the header instead of the viewport
// (menu collapsed / bar drifted off-screen after any scroll). The header now
// carries no transform, and the menu is portaled out (see Menu.jsx).
export default function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const openedOnce = useRef(false); // gate focus-restore on first render
  const pendingHashRef = useRef(null); // anchor to scroll to AFTER the menu closes
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();

  const scrollToHash = useCallback((href) => scrollToAnchor(lenis, href), [lenis]);

  // Scroll-lock + focus management tied to open state.
  useEffect(() => {
    if (open) {
      openedOnce.current = true;
      lenis?.stop();
      const id = requestAnimationFrame(() => {
        menuRef.current?.querySelector('a[href], button')?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
    // Menu closed: restart Lenis FIRST, then fire any deferred nav — otherwise
    // lenis.scrollTo runs while Lenis is still stopped and is ignored.
    lenis?.start();
    if (openedOnce.current) toggleRef.current?.focus();
    if (pendingHashRef.current) {
      scrollToHash(pendingHashRef.current);
      pendingHashRef.current = null;
    }
  }, [open, lenis, scrollToHash]);

  // Escape to close + Tab focus trap across the toggle and menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') return setOpen(false);
      if (e.key !== 'Tab') return;
      const nodes = [
        toggleRef.current,
        ...(menuRef.current?.querySelectorAll('a[href], button:not([disabled])') ?? []),
      ].filter(Boolean);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // If the menu is open, defer the scroll until it closes and Lenis restarts
  // (see the open-state effect). If it's already closed, scroll immediately.
  const handleNavigate = (e, href) => {
    e?.preventDefault();
    if (open) {
      pendingHashRef.current = href;
      setOpen(false);
    } else {
      scrollToHash(href);
    }
  };

  // Burger → X: each line slides to center and rotates.
  const line = (offset, rotate) => ({ y: open ? 0 : offset, rotate: open ? rotate : 0 });
  const lineTransition = { duration: reduced ? 0 : 0.3, ease: EXPO_OUT };

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-[var(--z-header)]">
      <div className="container-editorial flex items-center justify-between py-5">
        <a
          href="#top"
          onClick={(e) => handleNavigate(e, '#top')}
          className="font-display text-xl leading-none text-bone"
        >
          {nav.brand}
        </a>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="main-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
          className="-mr-2 flex h-11 w-11 items-center justify-center"
        >
          <span className="relative block h-4 w-6">
            <motion.span
              className="absolute inset-x-0 top-1/2 block h-px bg-bone"
              animate={line(-4, 45)}
              transition={lineTransition}
            />
            <motion.span
              className="absolute inset-x-0 top-1/2 block h-px bg-bone"
              animate={line(4, -45)}
              transition={lineTransition}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <Menu id="main-menu" ref={menuRef} reduced={reduced} onNavigate={handleNavigate} />
        )}
      </AnimatePresence>
    </header>
  );
}
