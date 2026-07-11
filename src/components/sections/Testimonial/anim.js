import { fadeUp, STAG } from '@/lib/presets';

// Minimal: label + attribution fade up (STAG.base) on enter. The quote reveals
// itself (RevealText asLines on view-enter) and CinematicMedia owns the media
// entrance — so the section choreographs almost nothing.
export function initTestimonial({ label, attribution, section }) {
  fadeUp([label, attribution], {
    stagger: STAG.base,
    scrollTrigger: { trigger: section, start: 'top 70%' },
  });
}
