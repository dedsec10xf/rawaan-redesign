import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';

const SIZE = {
  sm: 'h-7 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
};

// Selectable/toggle chip (Add/Remove an experience, a filter pill, etc.) or a
// static, non-interactive chip (e.g. TripCard's included-experience tags).
//
//   <Chip size="sm">Guided Glacier Trek</Chip>                           // static
//   <Chip variant="toggle" selected={on} onToggle={() => ...}>Adventure</Chip>
export function Chip({ children, variant = 'static', size = 'sm', selected = false, onToggle, className }) {
  const reduced = usePrefersReducedMotion();
  const transition = reduced ? { duration: 0 } : { duration: 0.2 };

  const base = cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-full border font-sans font-medium leading-none transition-colors',
    SIZE[size],
    selected ? 'border-accent bg-accent/10 text-cyan-deep' : 'border-line bg-white text-navy',
    className,
  );

  if (variant === 'static') {
    return <span className={base}>{children}</span>;
  }

  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={transition}
      className={cn(base, 'min-h-11 cursor-pointer')}
    >
      {children}
    </motion.button>
  );
}
