import { cn } from '@/utils/cn';

// Color per surface. `.label` doesn't hardcode a color, so tone sets it.
const TONE = {
  slate: 'text-slate', // light surfaces (default)
  white: 'text-white/70', // dark (navy) panels
};

// Micro-label, e.g. "Speak to us / 05". Dumb + prop-driven: pass the word(s)
// as children and an optional index. Static by design (no motion), so
// nothing to gate on reduced-motion.
//
//   <SectionLabel index="01">Speak to us</SectionLabel>      // slate on light
//   <SectionLabel tone="white" as="h2">Contact</SectionLabel> // white on navy
export function SectionLabel({ children, index, as: Tag = 'span', tone = 'slate', className }) {
  return (
    <Tag className={cn('label inline-flex items-center gap-2', TONE[tone], className)}>
      <span>{children}</span>
      {index != null && (
        <>
          {/* Decorative separator — inherits the label color at half strength */}
          <span aria-hidden="true" className="opacity-50">
            /
          </span>
          <span>{index}</span>
        </>
      )}
    </Tag>
  );
}
