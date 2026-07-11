// Footer content — Section 8 tail. No copy lives in JSX.
// `external` links open in a new tab; contact `kind` is reserved for future icons.
export const footer = {
  columns: {
    explore: {
      heading: 'Explore',
      links: [
        { label: 'Signature Journeys', href: '#journeys' },
        { label: 'Experiences', href: '#experiences' },
        { label: 'Regions', href: '#regions' },
        { label: 'The Manifesto', href: '#manifesto' },
        { label: 'Journal', href: '#journal' },
      ],
    },
    contact: {
      heading: 'Speak to us',
      items: [
        { label: '+92 51 234 5678', href: 'tel:+925112345678', kind: 'phone' },
        {
          label: 'WhatsApp us',
          href: 'https://wa.me/925112345678',
          kind: 'whatsapp',
          external: true,
        },
        { label: 'hello@rawaanpak.com', href: 'mailto:hello@rawaanpak.com', kind: 'email' },
      ],
      address: 'Jinnah Avenue, Blue Area,\nIslamabad 44000, Pakistan',
    },
    social: {
      heading: 'Follow',
      links: [
        { label: 'Instagram', href: 'https://instagram.com/rawaanpak', external: true },
        { label: 'Facebook', href: 'https://facebook.com/rawaanpak', external: true },
        { label: 'YouTube', href: 'https://youtube.com/@rawaanpak', external: true },
        { label: 'LinkedIn', href: 'https://linkedin.com/company/rawaanpak', external: true },
      ],
    },
  },
  // Decorative Urdu (Nastaliq) watermark — "Rawaan".
  watermark: 'رواں',
  wordmark: 'RAWAAN',
  legal: {
    company: 'Rawaan Pakistan',
    rights: 'All rights reserved.',
  },
};
