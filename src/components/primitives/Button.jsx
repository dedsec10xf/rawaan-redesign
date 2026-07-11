import { cn } from '@/utils/cn';
import { MagneticWrap } from './MagneticWrap';

// Variant → class map. Saffron is the only filled accent (kept <5% of surface);
// ghost is the restrained default on dark panels.
const VARIANTS = {
  primary: 'bg-accent text-ink hover:bg-accent/90',
  ghost: 'border border-stone/40 text-bone hover:border-bone',
};

// CTA / action. Renders <button> or <a> (when href is set), optionally
// wrapped in MagneticWrap. Pass a Lucide icon component via `icon`.
//
//   <Button href="#journeys" icon={ArrowRight} magnetic>Begin the journey</Button>
export function Button({
  as,
  href,
  children,
  variant = 'primary',
  magnetic = false,
  icon: Icon,
  className,
  ...props
}) {
  const Tag = as ?? (href ? 'a' : 'button');

  const el = (
    <Tag
      href={href}
      className={cn(
        'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6',
        'font-sans text-sm font-medium transition-colors duration-300',
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {Icon && (
        <Icon
          size={18}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </Tag>
  );

  return magnetic ? <MagneticWrap>{el}</MagneticWrap> : el;
}
