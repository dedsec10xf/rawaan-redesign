import { useId, useState } from 'react';
import { Select } from '@/components/ui';

const FIELD = 'min-h-11 w-full rounded-xl border border-line bg-white px-4 font-sans text-body text-navy';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_OPTIONS = [
  { value: 'Email', label: 'Email' },
  { value: 'Phone', label: 'Phone' },
  { value: 'WhatsApp', label: 'WhatsApp' },
];

// Real form (labels, native validation attrs, associated error text) — name
// and email are required, phone and preferredContact default to sensible
// values so a fast submit isn't blocked on fields most leads will fill
// anyway. `notes` (planner step 4's free text) is shown read-only here as a
// reminder of what's already been captured, not re-collected.
export function LeadForm({ notes, onSubmit }) {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState('Email');
  const [errors, setErrors] = useState({});

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
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim(), preferredContact });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
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

        <Select
          label="Preferred contact method"
          value={preferredContact}
          onChange={setPreferredContact}
          options={CONTACT_OPTIONS}
        />
      </div>

      {notes && (
        <p className="rounded-xl bg-mist p-4 text-small text-slate">
          <span className="font-medium text-navy">Your instructions: </span>
          {notes}
        </p>
      )}

      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-6 font-sans text-sm font-medium text-navy transition-colors duration-300 hover:bg-cyan-deep hover:text-white sm:w-auto"
      >
        Send to Rawaan
      </button>
    </form>
  );
}
