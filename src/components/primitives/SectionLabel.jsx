import { cn } from '@/utils/cn';

// Color per surface. `.label` no longer hardcodes a color, so tone sets it.
const TONE = {
  stone: 'text-stone', // dark sections (default)
  ink: 'text-ink/60', // bone breathers — passes contrast without !important
};

// Uppercase editorial micro-label, e.g. "EXPEDITIONS / 01".
// Dumb + prop-driven: pass the word(s) as children and an optional index.
// Static by design (no motion), so nothing to gate on reduced-motion.
//
//   <SectionLabel index="01">Expeditions</SectionLabel>       // stone on dark
//   <SectionLabel tone="ink" as="h2">Manifesto</SectionLabel> // ink on bone
export function SectionLabel({ children, index, as: Tag = 'span', tone = 'stone', className }) {
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
