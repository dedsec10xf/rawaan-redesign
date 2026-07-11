import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMedia } from '@/hooks/useMedia';
import { cn } from '@/utils/cn';

// Makes its child drift toward the cursor on hover, easing back on leave.
// Pointer-fine + hover devices only (no touch), and off under reduced motion.
//
//   <MagneticWrap><Button>Begin</Button></MagneticWrap>
export function MagneticWrap({ children, strength = 0.35, className, as: Tag = 'div' }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const canHover = useMedia('(hover: hover) and (pointer: fine)');
  const enabled = canHover && !reduced;

  useGSAP(
    () => {
      if (!enabled) return;
      const el = ref.current;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'expoOut' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'expoOut' });

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { dependencies: [enabled, strength], scope: ref },
  );

  return (
    <Tag ref={ref} className={cn('inline-block will-change-transform', className)}>
      {children}
    </Tag>
  );
}
