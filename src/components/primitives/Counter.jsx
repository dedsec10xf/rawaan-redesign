import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';

// Counts up to `value` once it scrolls into view. Renders the final value in
// markup (correct without JS / for reduced motion), then animates from zero.
//
//   <Counter value={8611} suffix="m" />
export function Counter({
  value,
  prefix = '',
  suffix = '',
  duration = 2,
  className,
  as: Tag = 'span',
}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      const render = (n) => {
        el.textContent = `${prefix}${Math.round(n).toLocaleString()}${suffix}`;
      };
      if (reduced) return; // markup already shows the final value

      const counter = { n: 0 };
      render(0);
      gsap.to(counter, {
        n: value,
        duration,
        snap: { n: 1 },
        onUpdate: () => render(counter.n),
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    },
    { dependencies: [value, prefix, suffix, duration, reduced], scope: ref },
  );

  return (
    <Tag ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </Tag>
  );
}
