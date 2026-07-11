import { gsap } from '@/lib/gsap';

// Footer choreography. The oversized wordmark rises slightly as the footer
// scrolls into view — a transform-only parallax (≤12% travel) scrubbed to
// scroll. Returns the timeline so the section owns cleanup via useGSAP.
//
// refs: { root, wordmark } — root is the trigger, wordmark is the target.
export function initFooter({ root, wordmark }) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top bottom', // footer top enters the viewport
      end: 'bottom bottom', // footer fully in view
      scrub: true,
    },
  });

  // Rise from +12% to rest. `ease: none` keeps it linear against the scrub.
  tl.from(wordmark, { yPercent: 12, ease: 'none' });

  return tl;
}
