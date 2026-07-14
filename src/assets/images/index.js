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

// --- tours (panel category) — dedicated photos added post-launch-audit ---
import mashabrumBaseCampSrcSet from './mashabrum-base-camp.jpg?w=400;800;1200&format=webp&as=srcset';
import mashabrumBaseCamp from './mashabrum-base-camp.jpg?w=800&format=webp';

// --- experiences (panel category) — dedicated photos added post-launch-audit ---
import glacierTrekSrcSet from './glacier-trek.jpg?w=400;800;1200&format=webp&as=srcset';
import glacierTrek from './glacier-trek.jpg?w=800&format=webp';
import porterGuideSupportSrcSet from './porter-guide-support.jpg?w=400;800;1200&format=webp&as=srcset';
import porterGuideSupport from './porter-guide-support.jpg?w=800&format=webp';
import kalashCulturalEveningSrcSet from './kalash-cultural-evening.jpg?w=400;800;1200&format=webp&as=srcset';
import kalashCulturalEvening from './kalash-cultural-evening.jpg?w=800&format=webp';
import sufiHeritageWalkSrcSet from './sufi-heritage-walk.jpg?w=400;800;1200&format=webp&as=srcset';
import sufiHeritageWalk from './sufi-heritage-walk.jpg?w=800&format=webp';
import sikhPilgrimageGuideSrcSet from './sikh-pilgrimage-guide.jpg?w=400;800;1200&format=webp&as=srcset';
import sikhPilgrimageGuide from './sikh-pilgrimage-guide.jpg?w=800&format=webp';
import poloVipViewingSrcSet from './polo-vip-viewing.jpg?w=400;800;1200&format=webp&as=srcset';
import poloVipViewing from './polo-vip-viewing.jpg?w=800&format=webp';

// --- vehicles (panel category) ---
import corollaSrcSet from './corolla.jpg?w=400;800;1200&format=webp&as=srcset';
import corolla from './corolla.jpg?w=800&format=webp';
import pradoSrcSet from './prado.jpg?w=400;800;1200&format=webp&as=srcset';
import prado from './prado.jpg?w=800&format=webp';
import landCruiserSrcSet from './land-cruiser.jpg?w=400;800;1200&format=webp&as=srcset';
import landCruiser from './land-cruiser.jpg?w=800&format=webp';
import hiaceSrcSet from './hiace.jpg?w=400;800;1200&format=webp&as=srcset';
import hiace from './hiace.jpg?w=800&format=webp';

// --- hotels (panel category) ---
import oldHunzaInnSrcSet from './old-hunza-inn.jpg?w=400;800;1200&format=webp&as=srcset';
import oldHunzaInn from './old-hunza-inn.jpg?w=800&format=webp';
import hunzaEmbassySrcSet from './hunza-embassy.jpg?w=400;800;1200&format=webp&as=srcset';
import hunzaEmbassy from './hunza-embassy.jpg?w=800&format=webp';
import hunzaSerenaSrcSet from './hunza-serena.jpg?w=400;800;1200&format=webp&as=srcset';
import hunzaSerena from './hunza-serena.jpg?w=800&format=webp';
import k2MotelSrcSet from './k2-motel.jpg?w=400;800;1200&format=webp&as=srcset';
import k2Motel from './k2-motel.jpg?w=800&format=webp';
import skarduContinentalSrcSet from './skardu-continental.jpg?w=400;800;1200&format=webp&as=srcset';
import skarduContinental from './skardu-continental.jpg?w=800&format=webp';
import shangrilaSkarduSrcSet from './shangrila-skardu.jpg?w=400;800;1200&format=webp&as=srcset';
import shangrilaSkardu from './shangrila-skardu.jpg?w=800&format=webp';
import ptdcChitralSrcSet from './ptdc-chitral.jpg?w=400;800;1200&format=webp&as=srcset';
import ptdcChitral from './ptdc-chitral.jpg?w=800&format=webp';
import chitralReserveSrcSet from './chitral-reserve.jpg?w=400;800;1200&format=webp&as=srcset';
import chitralReserve from './chitral-reserve.jpg?w=800&format=webp';
import hindukushHeightsSrcSet from './hindukush-heights.jpg?w=400;800;1200&format=webp&as=srcset';
import hindukushHeights from './hindukush-heights.jpg?w=800&format=webp';
import fairyMeadowsCottagesSrcSet from './fairy-meadows-cottages.jpg?w=400;800;1200&format=webp&as=srcset';
import fairyMeadowsCottages from './fairy-meadows-cottages.jpg?w=800&format=webp';
import raikotSaraiSrcSet from './raikot-sarai.jpg?w=400;800;1200&format=webp&as=srcset';
import raikotSarai from './raikot-sarai.jpg?w=800&format=webp';
import nangaParbatViewLodgeSrcSet from './nanga-parbat-view-lodge.jpg?w=400;800;1200&format=webp&as=srcset';
import nangaParbatViewLodge from './nanga-parbat-view-lodge.jpg?w=800&format=webp';
import lalazarInnSrcSet from './lalazar-inn.jpg?w=400;800;1200&format=webp&as=srcset';
import lalazarInn from './lalazar-inn.jpg?w=800&format=webp';
import parkViewNaranSrcSet from './park-view-naran.jpg?w=400;800;1200&format=webp&as=srcset';
import parkViewNaran from './park-view-naran.jpg?w=800&format=webp';
import pcNaranSrcSet from './pc-naran.jpg?w=400;800;1200&format=webp&as=srcset';
import pcNaran from './pc-naran.jpg?w=800&format=webp';

// --- route waypoints (panel category) — one photo per physical stop, reused
// across every route that passes through it (Besham/Chilas sit on 3 routes
// each but are the same real place) ---
import beshamSrcSet from './besham.jpg?w=400;800;1200&format=webp&as=srcset';
import besham from './besham.jpg?w=800&format=webp';
import chilasSrcSet from './chilas.jpg?w=400;800;1200&format=webp&as=srcset';
import chilas from './chilas.jpg?w=800&format=webp';
import gilgitSrcSet from './gilgit.jpg?w=400;800;1200&format=webp&as=srcset';
import gilgit from './gilgit.jpg?w=800&format=webp';
import skarduRoadSrcSet from './skardu-road.jpg?w=400;800;1200&format=webp&as=srcset';
import skarduRoad from './skardu-road.jpg?w=800&format=webp';
import abbottabadSrcSet from './abbottabad.jpg?w=400;800;1200&format=webp&as=srcset';
import abbottabad from './abbottabad.jpg?w=800&format=webp';
import balakotSrcSet from './balakot.jpg?w=400;800;1200&format=webp&as=srcset';
import balakot from './balakot.jpg?w=800&format=webp';
import kaghanSrcSet from './kaghan.jpg?w=400;800;1200&format=webp&as=srcset';
import kaghan from './kaghan.jpg?w=800&format=webp';

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

  // tours — dedicated photo (post-launch-audit; most tours still fall back
  // to a shared journeys/ shot above until their own photo arrives)
  'mashabrum-base-camp': panel(mashabrumBaseCamp, mashabrumBaseCampSrcSet),

  // experiences — dedicated photos (post-launch-audit; whitewater-rafting,
  // photography-workshop, luxury-yurt-glamping and gandhara-monastery-tour
  // still fall back to a shared category shot above)
  'glacier-trek': panel(glacierTrek, glacierTrekSrcSet),
  'porter-guide-support': panel(porterGuideSupport, porterGuideSupportSrcSet),
  'kalash-cultural-evening': panel(kalashCulturalEvening, kalashCulturalEveningSrcSet),
  'sufi-heritage-walk': panel(sufiHeritageWalk, sufiHeritageWalkSrcSet),
  'sikh-pilgrimage-guide': panel(sikhPilgrimageGuide, sikhPilgrimageGuideSrcSet),
  'polo-vip-viewing': panel(poloVipViewing, poloVipViewingSrcSet),

  // vehicles — keyed by vehicle id (brv still falls back to 'adventure')
  corolla: panel(corolla, corollaSrcSet),
  prado: panel(prado, pradoSrcSet),
  'land-cruiser': panel(landCruiser, landCruiserSrcSet),
  hiace: panel(hiace, hiaceSrcSet),

  // hotels — keyed by hotel id
  'old-hunza-inn': panel(oldHunzaInn, oldHunzaInnSrcSet),
  'hunza-embassy': panel(hunzaEmbassy, hunzaEmbassySrcSet),
  'hunza-serena': panel(hunzaSerena, hunzaSerenaSrcSet),
  'k2-motel': panel(k2Motel, k2MotelSrcSet),
  'skardu-continental': panel(skarduContinental, skarduContinentalSrcSet),
  'shangrila-skardu': panel(shangrilaSkardu, shangrilaSkarduSrcSet),
  'ptdc-chitral': panel(ptdcChitral, ptdcChitralSrcSet),
  'chitral-reserve': panel(chitralReserve, chitralReserveSrcSet),
  'hindukush-heights': panel(hindukushHeights, hindukushHeightsSrcSet),
  'fairy-meadows-cottages': panel(fairyMeadowsCottages, fairyMeadowsCottagesSrcSet),
  'raikot-sarai': panel(raikotSarai, raikotSaraiSrcSet),
  'nanga-parbat-view-lodge': panel(nangaParbatViewLodge, nangaParbatViewLodgeSrcSet),
  'lalazar-inn': panel(lalazarInn, lalazarInnSrcSet),
  'park-view-naran': panel(parkViewNaran, parkViewNaranSrcSet),
  'pc-naran': panel(pcNaran, pcNaranSrcSet),

  // route waypoints — keyed by physical place, not per-route waypoint id
  // (routes.js's waypoint `image` fields point at these same keys directly)
  besham: panel(besham, beshamSrcSet),
  chilas: panel(chilas, chilasSrcSet),
  gilgit: panel(gilgit, gilgitSrcSet),
  'skardu-road': panel(skarduRoad, skarduRoadSrcSet),
  abbottabad: panel(abbottabad, abbottabadSrcSet),
  balakot: panel(balakot, balakotSrcSet),
  kaghan: panel(kaghan, kaghanSrcSet),
};

// Flat grey box, no build-time asset — the PROD fallback for an unknown key.
// Same {src, srcSet, sizes} shape as every real entry so a consumer never has
// to special-case it.
const PLACEHOLDER = {
  src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23E3E9ED'/%3E%3C/svg%3E",
  srcSet: undefined,
  sizes: '100vw',
};

// The ONE way data-driven consumers (TripCard, ExperienceCard, Categories,
// any future one) should read an image — never `images[key]` directly. A
// bad key (typo, renamed asset) is a data bug, not a reason to crash: DEV
// throws loud and immediately at the call site so it's caught while
// building; PROD swaps in a visible grey placeholder instead of taking the
// whole page down (see the fairy-meadows/rakaposhi-base-camp incident this
// guard was added for — a wrong key silently produced `undefined` and blew
// up TripCard's `item.image.src` with no error boundary in front of it).
export function resolveImage(key) {
  const resolved = images[key];
  if (resolved) return resolved;

  if (import.meta.env.DEV) {
    throw new Error(`Unknown image key: "${key}". Available: ${Object.keys(images).join(', ')}`);
  }
  return PLACEHOLDER;
}
