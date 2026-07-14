import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useClipReveal } from '@/hooks/useClipReveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMedia } from '@/hooks/useMedia';
import { cn } from '@/utils/cn';

const OVERLAYS = {
  scrim: 'bg-navy/40',
  gradient: 'bg-gradient-to-t from-navy/85 via-navy/25 to-transparent',
  none: '',
};

const MAX_TRAVEL = 12; // % — parallax motion budget cap (see CLAUDE.md)

// Cinematic background media: autoplay video with a still-image fallback,
// an optional scrim/gradient overlay, and scroll parallax. Renders image-only
// on mobile / Save-Data / reduced-motion (or when no video is provided).
// Composes the shared clip reveal (useClipReveal) rather than duplicating it.
// Used by the Hero (M4) and Testimonial (M7).
//
// `image`/`poster` accept either a plain URL string or the image registry's
// responsive object ({ src, srcSet, sizes, lqip } — see assets/images/index.js).
// `poster` (the <video> element's own poster attribute) always resolves to a
// single URL, since that attribute can't take a srcset; `image` (the actual
// <img> shown when there's no video) gets the full responsive treatment plus
// a blurred LQIP behind it while the real image loads (image-only mode only —
// when a video plays, its own poster already covers that gap).
//
//   <CinematicMedia video={{ webm, mp4 }} poster={hero.media.poster} image={hero.media.image}
//                   alt="K2 at dawn" overlay="gradient" parallax={10} priority />
export function CinematicMedia({
  video,
  poster,
  image,
  alt = '',
  overlay = 'scrim',
  parallax = 10,
  priority = false,
  reveal = true,
  aspectRatio,
  containerAnimation,
  className,
  children,
}) {
  const posterSrc = poster != null && typeof poster === 'object' ? poster.src : poster;
  const isResponsiveImage = image != null && typeof image === 'object';
  const imageSrc = isResponsiveImage ? image.src : image;
  const imageSrcSet = isResponsiveImage ? image.srcSet : undefined;
  const imageSizes = isResponsiveImage ? image.sizes : undefined;
  const imageLqip = isResponsiveImage ? image.lqip : undefined;
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const parallaxRef = useRef(null);

  const reduced = usePrefersReducedMotion();
  const isMobile = useMedia('(max-width: 768px)');
  const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;

  // Video is a progressive enhancement — fall back to the still image where a
  // heavy autoplay video isn't wanted.
  const imageOnly = reduced || isMobile || saveData || !video;

  // Shared clip reveal (frame wipe + media scale). Static under reduced motion.
  // `reveal={false}` opts out entirely (e.g. Hero owns media choreography).
  useClipReveal({ frameRef, mediaRef, containerAnimation, enabled: reveal });

  const travel = Math.min(Math.max(parallax, 0), MAX_TRAVEL);
  const peak = travel / 2;
  const overscan = peak + 2; // buffer so the translate never reveals a gap

  useGSAP(
    () => {
      if (reduced || travel === 0) return;
      // Transform-only vertical parallax on the overscanned wrapper.
      gsap.fromTo(
        parallaxRef.current,
        { yPercent: peak },
        {
          yPercent: -peak,
          ease: 'none',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            containerAnimation,
          },
        },
      );
    },
    { dependencies: [reduced, travel, peak, containerAnimation], scope: frameRef },
  );

  // When parallax is on, the wrapper overscans top/bottom so it can travel
  // without exposing an edge.
  const parallaxStyle =
    travel === 0 ? undefined : { top: `-${overscan}%`, bottom: `-${overscan}%`, left: 0, right: 0 };

  return (
    <div
      ref={frameRef}
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <div ref={parallaxRef} className="absolute inset-0" style={parallaxStyle}>
        {imageOnly ? (
          <>
            {imageLqip && (
              <img
                src={imageLqip}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
              />
            )}
            <img
              ref={mediaRef}
              src={imageSrc ?? posterSrc}
              srcSet={imageSrcSet}
              sizes={imageSizes}
              alt={alt}
              className="relative h-full w-full object-cover"
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
            />
          </>
        ) : (
          <video
            ref={mediaRef}
            className="h-full w-full object-cover"
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload={priority ? 'auto' : 'metadata'}
          >
            {video.webm && <source src={video.webm} type="video/webm" />}
            {video.mp4 && <source src={video.mp4} type="video/mp4" />}
          </video>
        )}
      </div>

      {overlay !== 'none' && (
        <div
          className={cn('pointer-events-none absolute inset-0', OVERLAYS[overlay])}
          aria-hidden="true"
        />
      )}

      {children}
    </div>
  );
}
