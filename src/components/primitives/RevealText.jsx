import { Children, useRef } from 'react';
import SplitType from 'split-type';
import { gsap, useGSAP } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Line-by-line headline reveal: masked lines slide up. Under reduced motion it
// renders as a plain static block (no motion).
//
// Two line sources:
//   - default: split-type auto-splits the text into visual lines (reverts on
//     cleanup). Good for flowing copy where line count isn't controlled.
//   - `asLines`: caller supplies one block element per line (e.g. <span
//     className="block">…</span>); each is masked directly and split-type is
//     skipped. Good for intentional, fixed line breaks (headlines).
//
//   <RevealText as="h1">The unhurried expedition</RevealText>
//   <RevealText as="h1" asLines><span className="block">Line one</span>…</RevealText>
//
// containerAnimation: pass a pinned section's horizontal tween (M6) so the
// trigger resolves against horizontal scroll.
//
// Controlled mode (`paused`): skip the ScrollTrigger and build the tween paused,
// then hand play() to `onReady` so a parent timeline drives the reveal.
export function RevealText({
  children,
  as: Tag = 'p',
  className,
  stagger = 0.09,
  duration = 1,
  start = 'top 85%',
  containerAnimation,
  paused = false,
  onReady,
  asLines = false,
  static: isStatic = false,
}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      // static → render final state, no internal tween/ScrollTrigger at all
      // (a section drives the reveal instead), same early-return as reduced motion.
      if (reduced || isStatic) return;

      let lines;
      let cleanup;

      if (asLines) {
        // Line blocks are already masked in the markup — animate them directly.
        lines = el.querySelectorAll('[data-reveal-mask] > *');
      } else {
        const split = new SplitType(el, { types: 'lines' });
        split.lines.forEach((line) => {
          const mask = document.createElement('span');
          mask.style.display = 'block';
          mask.style.overflow = 'hidden';
          line.parentNode.insertBefore(mask, line);
          mask.appendChild(line);
        });
        lines = split.lines;
        cleanup = () => split.revert(); // restores original markup + wrappers
      }

      const tween = gsap.from(lines, {
        yPercent: 110,
        duration,
        stagger,
        paused,
        // In controlled mode there's no scroll trigger — the parent plays it.
        scrollTrigger: paused ? undefined : { trigger: el, start, containerAnimation },
      });

      if (paused) onReady?.(() => tween.play());

      return cleanup;
    },
    // onReady intentionally omitted — it's a callback, not structural state.
    { dependencies: [reduced, isStatic, stagger, duration, start, containerAnimation, paused, asLines], scope: ref },
  );

  if (asLines) {
    return (
      <Tag ref={ref} className={className}>
        {Children.map(children, (child, i) => (
          // overflow-hidden masks the line; pb/-mb adds descender headroom so
          // tight leading doesn't clip glyph tails (e.g. "waiting.").
          <span
            key={i}
            data-reveal-mask
            className="block overflow-hidden pb-[0.12em] -mb-[0.12em]"
          >
            {child}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
