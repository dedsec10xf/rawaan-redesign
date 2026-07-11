import { fadeUp, STAG } from '@/lib/presets';

// Entrance only — every other choreography in this section is component-level
// (Framer for the hover/accordion expand, CSS for the title/x-offset, GSAP
// quickTo for the cursor-following image), per the interaction-vs-scroll split.
// The AltitudeRules aren't touched here — the primitive already self-draws on
// scroll-enter; wrapping it with the drawIn preset would double-animate it.
export function initExperiences({ section, rows }) {
  fadeUp(rows, {
    stagger: STAG.base,
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}
