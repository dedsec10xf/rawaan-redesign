import { useId, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Select } from './Select';
import { categories } from '@/data/categories';
import { cn } from '@/utils/cn';

const FIELD = 'min-h-11 w-full rounded-xl border border-line bg-white px-4 font-sans text-body text-navy';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BASE_INTEREST_OPTIONS = [
  ...categories.map((c) => ({ value: c.id, label: c.name })),
  { value: 'Corporate', label: 'Corporate / Group' },
  { value: 'Not sure yet', label: 'Not sure yet' },
];

// Shared lead-capture card — built for V8's homepage FAQ/Lead section,
// reused as-is by TourDetail (V9): name, email, phone, trip interest,
// message. Client validation only, `console.log(...)` as the stated
// future-CRM hook, polished success state. This is a DIFFERENT component
// from the planner's LeadForm (src/components/planner/LeadForm) — that one
// shows a trip's already-captured `notes` read-only and asks for a
// preferred CONTACT method; this one asks what kind of trip you're
// interested in. The two field sets diverge enough that one shared
// component would mean conditionally hiding/adding fields rather than
// actually sharing logic (decision logged in V8's report).
//
// `defaultInterest` pre-fills + pins an extra option at the top of the Trip
// interest select (e.g. a specific tour/package name on its detail page) —
// the fixed category list alone can't express "this exact tour."
//
//   <LeadCard />
//   <LeadCard defaultInterest="K2 Base Camp" heading="Enquire about this trip" />
export function LeadCard({
  heading = 'Send us a message',
  submitLabel = 'Send message',
  successMessage = 'A Rawaan specialist will reply within 24 hours.',
  defaultInterest,
  className,
}) {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const messageId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState(defaultInterest ?? '');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const interestOptions = defaultInterest
    ? [{ value: defaultInterest, label: defaultInterest }, ...BASE_INTEREST_OPTIONS]
    : BASE_INTEREST_OPTIONS;

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Enter your name';
    if (!email.trim()) nextErrors.email = 'Enter your email';
    else if (!EMAIL_RE.test(email)) nextErrors.email = 'Enter a valid email';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      interest: interest || null,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };
    // Same future-CRM hook as the planner's lead form (StepReview) — no
    // backend this delivery, just an inspectable payload.
    console.log('[Rawaan lead]', payload);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        aria-live="polite"
        className={cn('flex flex-col items-center gap-3 rounded-2xl border border-line bg-mist p-8 text-center', className)}
      >
        <CheckCircle2 size={28} strokeWidth={1.5} className="text-cyan-deep" aria-hidden="true" />
        <h3 className="font-display text-h3 text-navy">Message sent</h3>
        <p className="max-w-sm text-body text-slate">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn('flex flex-col gap-4 rounded-2xl border border-line bg-mist p-6', className)}
    >
      <h3 className="font-display text-h3 text-navy">{heading}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="label text-slate">
            Full name
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className={FIELD}
          />
          {errors.name && (
            <p id={`${nameId}-error`} role="alert" className="text-small text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={emailId} className="label text-slate">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            className={FIELD}
          />
          {errors.email && (
            <p id={`${emailId}-error`} role="alert" className="text-small text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={phoneId} className="label text-slate">
            Phone (optional)
          </label>
          <input id={phoneId} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={FIELD} />
        </div>

        <Select label="Trip interest" placeholder="Select one" value={interest} onChange={setInterest} options={interestOptions} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={messageId} className="label text-slate">
          Message
        </label>
        <textarea
          id={messageId}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(FIELD, 'resize-y py-3')}
        />
      </div>

      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-6 font-sans text-sm font-medium text-navy transition-colors duration-300 hover:bg-cyan-deep hover:text-white sm:w-auto"
      >
        {submitLabel}
      </button>
    </form>
  );
}
