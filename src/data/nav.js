import { footer } from './footer';

// Primary navigation + menu content. `to` is EITHER a react-router route
// (currently only /build — a real page) OR a homepage section hash (e.g.
// '#featured-tours') — Header/Menu tell the two apart by the '#' prefix.
// Route shells (/packages, /destinations, /corporate, /about, /blog,
// /contact) stay registered in App.jsx so deep links don't 404, but are
// deliberately NOT linked from here until they have real content — the nav
// points at the working homepage section instead (header nav audit, V8+).
// Contact/socials reuse footer data so there's a single source of truth.
export const nav = {
  brand: 'Rawaan',
  primary: [
    { label: 'Tours', to: '#featured-tours' },
    { label: 'Packages', to: '#packages' },
    { label: 'Experiences', to: '#experiences' },
    { label: 'Build your journey', to: '/build' },
    { label: 'Why Rawaan', to: '#trust' },
    { label: 'Contact', to: '#contact' },
  ],
  cta: { label: 'Plan your trip', to: '/build' },
  contact: {
    heading: 'Speak to us',
    phone: footer.columns.contact.items.find((i) => i.kind === 'phone'),
    email: footer.columns.contact.items.find((i) => i.kind === 'email'),
  },
  socials: footer.columns.social.links,
};
