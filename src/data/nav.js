import { footer } from './footer';

// Primary navigation + menu content. Contact/socials reuse footer data so
// there's a single source of truth.
export const nav = {
  brand: 'Rawaan',
  primary: [
    { label: 'Signature Journeys', href: '#journeys', index: '01' },
    { label: 'Experiences', href: '#experiences', index: '02' },
    { label: 'Regions', href: '#regions', index: '03' },
    { label: 'The Manifesto', href: '#manifesto', index: '04' },
    { label: 'Contact', href: '#contact', index: '05' },
  ],
  cta: { label: 'Plan your journey', href: '#contact' },
  contact: {
    heading: 'Speak to us',
    phone: footer.columns.contact.items.find((i) => i.kind === 'phone'),
    email: footer.columns.contact.items.find((i) => i.kind === 'email'),
  },
  socials: footer.columns.social.links,
};
