import { cn } from '@/utils/cn';
import { MagneticWrap } from './MagneticWrap';

// Variant → class map. primary = the cyan CTA fill — navy text clears ~7.8:1
// on plain cyan; cyan-deep (a darker, more saturated step) sits at a
// mid-luminance where NEITHER navy nor white text clears 4.5:1, so hover dims
// via opacity instead of swapping the fill color. ghost = light-surface
// outline default (v1's dark-panel ghost doesn't apply now that panels are
// light-first).
const VARIANTS = {
  primary: 'bg-accent text-navy hover:bg-accent/90',
  ghost: 'border border-line text-navy hover:border-navy',
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
