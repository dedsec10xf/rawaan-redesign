import { gsap, useGSAP } from '@/lib/gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// Shared clip-path reveal used by RevealImage and CinematicMedia: the frame
// wipes open from the bottom while the inner media settles from a slight zoom.
// Handles reduced motion internally (renders static). Pass `containerAnimation`
// to resolve the trigger inside a pinned horizontal section (M6).
const CLIP_HIDDEN = 'inset(100% 0% 0% 0%)';
const FRAME_DUR = 1.4;
const MEDIA_DUR = 1.6;
const MEDIA_FROM_SCALE = 1.15;

export function useClipReveal({
  frameRef,
  mediaRef,
  start = 'top 85%',
  containerAnimation,
  enabled = true,
} = {}) {
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !enabled) return;
      const st = { trigger: frameRef.current, start, containerAnimation };
      // Wipe the frame open while the media eases down from a slight zoom.
      gsap.from(frameRef.current, { clipPath: CLIP_HIDDEN, duration: FRAME_DUR, scrollTrigger: st });
      if (mediaRef?.current) {
        gsap.from(mediaRef.current, { scale: MEDIA_FROM_SCALE, duration: MEDIA_DUR, scrollTrigger: st });
      }
    },
    { dependencies: [reduced, enabled, start, containerAnimation], scope: frameRef },
  );
}
