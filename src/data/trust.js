// Trust — Section 6 (CLAUDE.md's homepage IA). Credential copy is real
// (client audit, CLAUDE.md's Business model section); logo art itself isn't
// available yet, so each card renders a plain placeholder box instead of an
// invented mark — swapped for real badge art later.
export const credentials = [
  {
    id: 'licensed-operator',
    name: 'Licensed Tour Operator',
    meaning: 'Registered and licensed to operate tours across Pakistan, start to finish.',
  },
  {
    id: 'dept-tourism',
    name: 'Department of Tourism',
    meaning: "Recognised by Pakistan's Department of Tourism for compliant, safe operations.",
  },
  {
    id: 'pato',
    name: 'PATO',
    meaning: 'Member of the Pakistan Association of Tour Operators.',
  },
  {
    id: 'unwto',
    name: 'UNWTO',
    meaning: "Affiliated with the UN World Tourism Organization's standards for responsible travel.",
  },
];

// Invented demo figures (CLAUDE.md: plausible, flagged, not client-provided —
// same status as tours.js's ratings).
export const stats = [
  { id: 'years', value: 14, suffix: '+', label: 'Years operating' },
  { id: 'travellers', value: 8600, suffix: '+', label: 'Travellers hosted' },
  { id: 'expeditions', value: 420, suffix: '+', label: 'Expeditions run' },
  { id: 'corporate', value: 60, suffix: '+', label: 'Corporate & educational clients' },
];

export const b2b = {
  line: 'Corporate retreats · Educational tours · International conferences',
  cta: { label: 'Talk to our corporate team', to: '/corporate' },
};
