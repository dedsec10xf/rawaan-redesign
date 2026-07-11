import { gsap } from '@/lib/gsap';

// Entrance tuning (seconds / unitless). Named so nothing is a magic number.
const ENTRANCE = {
  mediaScale: 1.08, // subtle settle-out zoom on the media layer
  mediaDur: 1.4,
  fadeShift: 40, // yPercent for label + button fade-up
  fadeDur: 0.8,
  stagger: 0.08,
  cueDur: 0.8,
};
const H1_LEAD = 0.4; // media begins, then the headline reveal is fired
const H1_HOLD = 0.9; // approx headline reveal length before the UI fades in

// Scroll-out tuning.
const SCRUB = { shift: -15, end: '60% top' }; // content lifts + fades by 60% scroll

// Paused entrance timeline. The component exposes play(); if nothing triggers
// it within 300ms it auto-plays. `playHeadline` fires RevealText's controlled
// reveal at the right beat.
export function initHero({ mediaLayer, playHeadline, label, button, cue }) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expoOut' } });

  tl.from(mediaLayer, { scale: ENTRANCE.mediaScale, duration: ENTRANCE.mediaDur }, 0);

  // Trigger the masked headline line-rise partway through the media settle.
  tl.add(() => playHeadline?.(), H1_LEAD);

  // Label + CTA rise once the headline is mostly in.
  tl.from(
    [label, button],
    { yPercent: ENTRANCE.fadeShift, opacity: 0, duration: ENTRANCE.fadeDur, stagger: ENTRANCE.stagger },
    H1_LEAD + H1_HOLD,
  );

  // Scroll cue arrives last.
  tl.from(cue, { opacity: 0, duration: ENTRANCE.cueDur }, '>-0.2');

  return tl;
}

// Separate scrubbed trigger: the content layer lifts faster than the media
// (which parallaxes inside CinematicMedia) and fades out as the hero leaves.
// Transform + opacity only. Returns the tween for the caller's GSAP context.
export function initHeroScrub({ section, content }) {
  return gsap.to(content, {
    yPercent: SCRUB.shift,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: SCRUB.end, scrub: true },
  });
}
