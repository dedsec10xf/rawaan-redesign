import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EXPO_OUT } from '@/lib/easings';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLenis } from '@/hooks/useLenis';
import { useSectionSpy } from '@/hooks/useSectionSpy';
import { cn } from '@/utils/cn';
import { nav } from '@/data/nav';
import Menu from './Menu';

const SCROLLED_THRESHOLD = 8; // px — matches the shadow-on-scroll trigger point

// Homepage sections a nav hash can point at, in document order — the
// module-level constant keeps this array reference-stable across renders so
// useSectionSpy's effect doesn't re-run every render (its dependency array
// includes `ids`).
const SPY_IDS = ['featured-tours', 'packages', 'experiences', 'trust', 'contact'];

// Light, sticky header (v2). Owns the dropdown open/close state (Framer via
// AnimatePresence) and the "has the page scrolled" flag that toggles the
// shadow. No scroll-lock, no focus-restore-on-close, no portal — the v1
// full-screen menu's choreography doesn't apply to a plain light dropdown.
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();
  const { pathname } = useLocation();
  const activeSectionId = useSectionSpy(SPY_IDS);
  // Active nav target: the in-view homepage section's hash, or '/build' when
  // that route is current — either way it resolves to the exact string a
  // primary nav item's `to` would match, so Menu just does `item.to === activeTo`.
  const activeTo = pathname === '/build' ? '/build' : activeSectionId ? `#${activeSectionId}` : null;

  // Shadow-on-scroll: subscribe to Lenis when it's running; fall back to a
  // native scroll listener under reduced motion (Lenis is disabled there).
  useEffect(() => {
    const check = (scrollY) => setScrolled(scrollY > SCROLLED_THRESHOLD);

    if (lenis) {
      const onScroll = ({ scroll }) => check(scroll);
      lenis.on('scroll', onScroll);
      return () => lenis.off('scroll', onScroll);
    }

    const onNativeScroll = () => check(window.scrollY);
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    return () => window.removeEventListener('scroll', onNativeScroll);
  }, [lenis]);

  // Escape to close + Tab focus trap across the toggle and dropdown.
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

  // Burger → X: each line slides to center and rotates.
  const line = (offset, rotate) => ({ y: open ? 0 : offset, rotate: open ? rotate : 0 });
  const lineTransition = { duration: reduced ? 0 : 0.3, ease: EXPO_OUT };

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-header)] border-b bg-white/95 backdrop-blur transition-shadow duration-300',
        scrolled ? 'border-transparent shadow-md' : 'border-line shadow-none',
      )}
    >
      <div className="container-editorial flex items-center justify-between py-4">
        <Link to="/" onClick={() => setOpen(false)} className="font-display text-xl leading-none text-navy">
          {nav.brand}
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to={nav.cta.to}
            className="hidden min-h-11 items-center justify-center rounded-full bg-accent px-6 font-sans text-sm font-medium text-navy transition-colors duration-300 hover:bg-accent/90 md:inline-flex"
          >
            {nav.cta.label}
          </Link>

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
                className="absolute inset-x-0 top-1/2 block h-px bg-navy"
                animate={line(-4, 45)}
                transition={lineTransition}
              />
              <motion.span
                className="absolute inset-x-0 top-1/2 block h-px bg-navy"
                animate={line(4, -45)}
                transition={lineTransition}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && <Menu id="main-menu" ref={menuRef} reduced={reduced} activeTo={activeTo} onNavigate={() => setOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}
