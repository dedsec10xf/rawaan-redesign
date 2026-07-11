// Central image registry — the ONE module that imports assets (Vite +
// vite-imagetools resolve each to hashed, build-tracked URLs). Data files
// import this map and reference images by key; the KEYS are stable across
// M8's pipeline change, only the per-key VALUE shape changed — from a plain
// URL string to { src, srcSet, sizes, lqip }. Consumers (RevealImage,
// CinematicMedia, plain <img>) now read src/srcSet/sizes off that object;
// `sizes` here is a sensible per-category default — pass a more specific
// `sizes` prop at the call site where the rendered width is known precisely.
//
// Two size categories (per the M8 brief):
//   - FULL-BLEED / backdrop images: widths [800, 1400, 2400], default
//     sizes="100vw", and an inline base64 LQIP (blurred, tiny, webp).
//   - Panel / strip / preview images: widths [400, 800, 1200], no LQIP —
//     they're smaller and already get a clip-reveal treatment on entry.
//
// Region images are dual-use (tiny inline strip AND full-bleed backdrop in
// Regions/index.jsx) — they're kept in the full-bleed category since the
// backdrop is the more demanding consumer; the strip usage declares its own
// much smaller `sizes` at the call site so the browser still picks the
// smallest matching file from the same srcSet, not the 2400w one.
//
// Import query pattern:
//   ?w=<widths>&format=webp&as=srcset   → the srcset string
//   ?w=<mid-width>&format=webp          → a single fallback URL (no `as`)
//   ?w=20&format=webp&blur=2&inline     → base64 LQIP data URI (full-bleed only)

// --- journeys (panel category) ---
import k2BaseCampSrcSet from './journeys/k2-base-camp.jpg?w=400;800;1200&format=webp&as=srcset';
import k2BaseCamp from './journeys/k2-base-camp.jpg?w=800&format=webp';
import kalashChilamJoshiSrcSet from './journeys/kalash-chilam-joshi.jpg?w=400;800;1200&format=webp&as=srcset';
import kalashChilamJoshi from './journeys/kalash-chilam-joshi.jpg?w=800&format=webp';
import skarduBaltistanSrcSet from './journeys/skardu-baltistan.jpg?w=400;800;1200&format=webp&as=srcset';
import skarduBaltistan from './journeys/skardu-baltistan.jpg?w=800&format=webp';
// file is shandur-polo (no -festival)
import shandurPoloSrcSet from './journeys/shandur-polo.jpg?w=400;800;1200&format=webp&as=srcset';
import shandurPolo from './journeys/shandur-polo.jpg?w=800&format=webp';
import gandharaTrailSrcSet from './journeys/gandhara-trail.jpg?w=400;800;1200&format=webp&as=srcset';
import gandharaTrail from './journeys/gandhara-trail.jpg?w=800&format=webp';

// --- experiences (panel category) ---
import experienceCustomSrcSet from './experience-custom.jpg?w=400;800;1200&format=webp&as=srcset';
import experienceCustom from './experience-custom.jpg?w=800&format=webp';
import experienceGroupSrcSet from './experience-group.jpg?w=400;800;1200&format=webp&as=srcset';
import experienceGroup from './experience-group.jpg?w=800&format=webp';
import experienceStaysSrcSet from './experience-stays.jpg?w=400;800;1200&format=webp&as=srcset';
import experienceStays from './experience-stays.jpg?w=800&format=webp';
import experienceAdventureSrcSet from './experience-adventure.jpg?w=400;800;1200&format=webp&as=srcset';
import experienceAdventure from './experience-adventure.jpg?w=800&format=webp';
import experienceCulturalSrcSet from './experience-cultural.jpg?w=400;800;1200&format=webp&as=srcset';
import experienceCultural from './experience-cultural.jpg?w=800&format=webp';

// --- regions (full-bleed category — dual-use, see note above) ---
import regionHunzaSrcSet from './region-hunza.jpg?w=800;1400;2400&format=webp&as=srcset';
import regionHunza from './region-hunza.jpg?w=1400&format=webp';
import regionHunzaLqip from './region-hunza.jpg?w=20&format=webp&blur=2&inline';
import regionSkarduSrcSet from './region-skardu.jpg?w=800;1400;2400&format=webp&as=srcset';
import regionSkardu from './region-skardu.jpg?w=1400&format=webp';
import regionSkarduLqip from './region-skardu.jpg?w=20&format=webp&blur=2&inline';
import regionChitralSrcSet from './region-chitral.jpg?w=800;1400;2400&format=webp&as=srcset';
import regionChitral from './region-chitral.jpg?w=1400&format=webp';
import regionChitralLqip from './region-chitral.jpg?w=20&format=webp&blur=2&inline';
import regionSwatSrcSet from './region-swat.jpg?w=800;1400;2400&format=webp&as=srcset';
import regionSwat from './region-swat.jpg?w=1400&format=webp';
import regionSwatLqip from './region-swat.jpg?w=20&format=webp&blur=2&inline';
import regionLahoreSrcSet from './region-lahore.jpg?w=800;1400;2400&format=webp&as=srcset';
import regionLahore from './region-lahore.jpg?w=1400&format=webp';
import regionLahoreLqip from './region-lahore.jpg?w=20&format=webp&blur=2&inline';
import regionNaranSrcSet from './region-naran.jpg?w=800;1400;2400&format=webp&as=srcset';
import regionNaran from './region-naran.jpg?w=1400&format=webp';
import regionNaranLqip from './region-naran.jpg?w=20&format=webp&blur=2&inline';

// --- sections (full-bleed category) ---
import heroPosterSrcSet from './hero-poster.jpg?w=800;1400;2400&format=webp&as=srcset';
import heroPoster from './hero-poster.jpg?w=1400&format=webp';
import heroPosterLqip from './hero-poster.jpg?w=20&format=webp&blur=2&inline';
import manifesto1SrcSet from './manifesto-1.jpg?w=800;1400;2400&format=webp&as=srcset';
import manifesto1 from './manifesto-1.jpg?w=1400&format=webp';
import manifesto1Lqip from './manifesto-1.jpg?w=20&format=webp&blur=2&inline';
import manifesto2SrcSet from './manifesto-2.jpg?w=800;1400;2400&format=webp&as=srcset';
import manifesto2 from './manifesto-2.jpg?w=1400&format=webp';
import manifesto2Lqip from './manifesto-2.jpg?w=20&format=webp&blur=2&inline';
import testimonialBgSrcSet from './testimonial-bg.jpg?w=800;1400;2400&format=webp&as=srcset';
import testimonialBg from './testimonial-bg.jpg?w=1400&format=webp';
import testimonialBgLqip from './testimonial-bg.jpg?w=20&format=webp&blur=2&inline';

const FULL_BLEED_SIZES = '100vw';
const PANEL_SIZES = '(min-width: 768px) 500px, 60vw';

const panel = (src, srcSet) => ({ src, srcSet, sizes: PANEL_SIZES });
const fullBleed = (src, srcSet, lqip) => ({ src, srcSet, sizes: FULL_BLEED_SIZES, lqip });

export const images = {
  // journeys — keyed by journey id
  'k2-base-camp': panel(k2BaseCamp, k2BaseCampSrcSet),
  'kalash-chilam-joshi': panel(kalashChilamJoshi, kalashChilamJoshiSrcSet),
  'skardu-baltistan': panel(skarduBaltistan, skarduBaltistanSrcSet),
  'shandur-polo-festival': panel(shandurPolo, shandurPoloSrcSet),
  'gandhara-trail': panel(gandharaTrail, gandharaTrailSrcSet),
  // experiences — keyed by experience id
  'custom-journeys': panel(experienceCustom, experienceCustomSrcSet),
  'group-expeditions': panel(experienceGroup, experienceGroupSrcSet),
  'luxury-stays': panel(experienceStays, experienceStaysSrcSet),
  adventure: panel(experienceAdventure, experienceAdventureSrcSet),
  cultural: panel(experienceCultural, experienceCulturalSrcSet),
  // regions — keyed by region id, dual-use (strip + backdrop), full-bleed category
  hunza: fullBleed(regionHunza, regionHunzaSrcSet, regionHunzaLqip),
  skardu: fullBleed(regionSkardu, regionSkarduSrcSet, regionSkarduLqip),
  chitral: fullBleed(regionChitral, regionChitralSrcSet, regionChitralLqip),
  swat: fullBleed(regionSwat, regionSwatSrcSet, regionSwatLqip),
  lahore: fullBleed(regionLahore, regionLahoreSrcSet, regionLahoreLqip),
  naran: fullBleed(regionNaran, regionNaranSrcSet, regionNaranLqip),
  // sections
  'hero-poster': fullBleed(heroPoster, heroPosterSrcSet, heroPosterLqip),
  'manifesto-1': fullBleed(manifesto1, manifesto1SrcSet, manifesto1Lqip),
  'manifesto-2': fullBleed(manifesto2, manifesto2SrcSet, manifesto2Lqip),
  'testimonial-bg': fullBleed(testimonialBg, testimonialBgSrcSet, testimonialBgLqip),
};
