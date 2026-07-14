import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

// Native <select> — deliberately not a custom ARIA listbox: a native element
// gets correct keyboard support (arrow keys, type-to-select, Esc) and screen
// reader behavior for free, which a hand-built combobox would have to
// reimplement and could easily get wrong. Styling is layered on top via the
// wrapper + a decorative chevron; the element itself stays unstyled-native
// underneath (appearance-none) so focus/keyboard behavior is never touched.
//
//   <Select label="Travel style" value={v} onChange={setV} options={[{ value: 'a', label: 'A' }]} />
//   <Select ... error="Required" /> — red border + role="alert" text, wired via aria-describedby/aria-invalid.
export function Select({ label, value, onChange, options, placeholder, id, error, className }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="label text-slate">
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'min-h-11 w-full appearance-none rounded-xl border border-line bg-white px-4 pr-10 font-sans text-body text-navy',
            error && 'border-red-500',
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate"
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-small text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
