import { useRef } from 'react';
import { useClipReveal } from '@/hooks/useClipReveal';
import { cn } from '@/utils/cn';

// Responsive image with a clip-path reveal and a slow scale-settle on scroll
// (shared with CinematicMedia via useClipReveal). Reserves space via
// aspect-ratio (no CLS), lazy by default (eager for hero), and shows a blurred
// LQIP behind the reveal. Static under reduced motion.
//
// `src` accepts either a plain URL string OR the image registry's responsive
// object ({ src, srcSet, sizes, lqip } — see assets/images/index.js). This
// means most call sites need no changes after the M8 image-pipeline swap —
// they were already just passing `src={someImage}`. Explicit srcSet/sizes/
// lqip props (if passed) win over whatever the object provides, so a call
// site can still override e.g. `sizes` for its own layout.
//
//   <RevealImage src={journey.image} alt="K2 base camp" aspectRatio="4/5" />
//   <RevealImage src="/k2.webp" srcSet="…" sizes="…" alt="…" lqip="data:image/…" />
//
// containerAnimation: pass the horizontal tween of a pinned section (M6) so the
// trigger resolves against horizontal scroll instead of the viewport.
// start: ScrollTrigger start (e.g. 'left 80%' for horizontal reveals); defaults
// to useClipReveal's 'top 85%'.
export function RevealImage({
  src,
  alt = '',
  srcSet,
  sizes,
  aspectRatio = '4/5',
  eager = false,
  lqip,
  start,
  reveal = true,
  static: isStatic = false,
  containerAnimation,
  className,
  imgClassName,
}) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);

  const isResponsiveObject = src != null && typeof src === 'object';
  const finalSrc = isResponsiveObject ? src.src : src;
  const finalSrcSet = srcSet ?? (isResponsiveObject ? src.srcSet : undefined);
  const finalSizes = sizes ?? (isResponsiveObject ? src.sizes : undefined);
  const finalLqip = lqip ?? (isResponsiveObject ? src.lqip : undefined);

  // reveal={false} / static → render the image in its final state, no internal
  // tween, no ScrollTrigger created at all (a section drives the reveal instead).
  useClipReveal({ frameRef, mediaRef: imgRef, start, containerAnimation, enabled: reveal && !isStatic });

  return (
    <div
      ref={frameRef}
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio }}
    >
      {finalLqip && (
        <img
          src={finalLqip}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
        />
      )}
      <img
        ref={imgRef}
        src={finalSrc}
        srcSet={finalSrcSet}
        sizes={finalSizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        className={cn('relative h-full w-full object-cover', imgClassName)}
      />
    </div>
  );
}
