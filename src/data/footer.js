// Footer content. No copy lives in JSX. `external` links open in a new tab;
// contact `kind` is reserved for future icons. `to` values are react-router
// routes (see App.jsx's V1 route shells).
export const footer = {
  columns: {
    explore: {
      heading: 'Explore',
      links: [
        { label: 'Packages', to: '/packages' },
        { label: 'Destinations', to: '/destinations' },
        { label: 'Experiences', to: '/experiences' },
        { label: 'Corporate', to: '/corporate' },
        { label: 'Blog', to: '/blog' },
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
  // Placeholder row — text stand-ins until badge SVGs land (mirrors the
  // StatsPartners logo-placeholder pattern this replaces). Ground truth is
  // the client audit in CLAUDE.md's Business model section.
  trustBadges: ['Licensed Operator', 'Dept. of Tourism', 'PATO', 'UNWTO'],
  legal: {
    company: 'Rawaan Pakistan',
    rights: 'All rights reserved.',
  },
};
