import SplitType from 'split-type';
import { gsap } from '@/lib/gsap';
import { DUR, STAG, scrubDefaults, fadeUp } from '@/lib/presets';

// Faint → solid via OPACITY only (motion rule forbids animating color). Ink
// text at low opacity on bone reads as the intended stone-ish faint state.
const WORD_FROM_OPACITY = 0.2;

// Manifesto choreography. Responsive via matchMedia:
//   desktop → per-word opacity fill scrubbed to section progress
//   mobile  → a single whole-paragraph fade-up on enter (no per-word scrub)
// Returns a cleanup fn (reverts matchMedia + split-type). Not a timeline: the
// desktop effect is one scrub tween over a DOM split that must be reverted.
export function initManifesto({ paragraph, section }) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const split = new SplitType(paragraph, { types: 'words' });
    gsap.from(split.words, {
      opacity: WORD_FROM_OPACITY,
      ease: 'none',
      stagger: STAG.tight,
      scrollTrigger: { ...scrubDefaults, trigger: section },
    });
    return () => split.revert(); // restore original markup when query stops matching
  });

  mm.add('(max-width: 767.98px)', () => {
    fadeUp(paragraph, {
      duration: DUR.reveal,
      scrollTrigger: { trigger: section, start: 'top 80%' },
    });
  });

  return () => mm.revert();
}
