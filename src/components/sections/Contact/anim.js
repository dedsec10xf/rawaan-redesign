import { fadeUp, STAG } from '@/lib/presets';

// Minimal, entrance only — label and the button row fade up together; the
// headline (RevealText) and the AltitudeRule both self-animate via their own
// primitives, so there's nothing for this section to drive there. FAQ rows
// aren't individually entrance-animated — they're already inside the
// section's own reveal, and their open/close state is Framer's, not GSAP's.
export function initContact({ label, buttons, section }) {
  fadeUp([label, buttons], {
    stagger: STAG.base,
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
