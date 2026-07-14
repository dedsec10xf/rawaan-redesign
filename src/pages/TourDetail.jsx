import { useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, Car, Hotel, Mountain, Users } from 'lucide-react';
import { useGSAP } from '@/lib/gsap';
import { fadeUp } from '@/lib/presets';
import { Chip, Rating, SectionHeader, TripCard, ExperienceCard, LeadCard } from '@/components/ui';
import { Button, RevealImage } from '@/components/primitives';
import { Timeline } from '@/components/planner';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLenis } from '@/hooks/useLenis';
import { scrollToAnchor } from '@/lib/resolveAnchor';
import { useTripStore } from '@/store/tripStore';
import { resolveImage } from '@/assets/images';
import { tours } from '@/data/tours';
import { packages } from '@/data/packages';
import { experiences } from '@/data/experiences';
import { expandPhases, buildPackageItinerary } from '@/lib/itinerary';
import { cn } from '@/utils/cn';

const toursById = new Map(tours.map((t) => [t.id, t]));
const experiencesById = new Map(experiences.map((e) => [e.id, e]));

// Disambiguating tours.js vs packages.js on the shared /packages/:slug route:
// tours.js is checked first (a tour's own slug), packages.js second — the two
// files' slugs are authored independently but never collide in practice
// (tour slugs are single-tour names like "k2-base-camp", package slugs are
// their own curated-circuit names like "past-to-peaks"). First match wins;
// neither match falls through to the not-found state below.
function resolveItem(slug) {
  const tour = tours.find((t) => t.slug === slug);
  if (tour) return { item: tour, type: 'tour' };
  const pkg = packages.find((p) => p.slug === slug);
  if (pkg) return { item: pkg, type: 'package' };
  return { item: null, type: null };
}

function formatPrice(item, type) {
  if (type === 'package') {
    return (
      <>
        {item.priceWas != null && <span className="mr-2 text-body text-slate line-through">${item.priceWas.toLocaleString()}</span>}
        <span className="font-display text-h2 text-navy">${item.priceUSD.toLocaleString()}</span>
      </>
    );
  }
  return (
    <>
      <span className="font-display text-h2 text-navy">From ${item.priceUSD[0].toLocaleString()}</span>
      <span className="ml-2 text-small text-slate">
        range ${item.priceUSD[0].toLocaleString()}–${item.priceUSD[1].toLocaleString()}
      </span>
    </>
  );
}

// Union of every constituent tour's included experiences — packages have no
// includedExperienceIds of their own (same derivation tripStore.loadPackage
// uses for selectedExperienceIds).
function resolveIncludedExperienceIds(item, type) {
  if (type === 'tour') return item.includedExperienceIds;
  const includedTours = item.includes.map((id) => toursById.get(id)).filter(Boolean);
  return [...new Set(includedTours.flatMap((t) => t.includedExperienceIds))];
}

// /packages/:slug — V9's "itinerary builder, not brochure" page (the
// client's explicit complaint about their current package pages). No
// anim.js — GSAP reveals are simple, single-purpose fadeUps inlined per
// section (this page composes shared components more than it owns bespoke
// choreography, unlike a homepage IA section).
export default function TourDetail() {
  const { slug } = useParams();
  const { item, type } = resolveItem(slug);

  if (!item) return <NotFound />;
  return <TourDetailContent item={item} type={type} />;
}

function NotFound() {
  return (
    <div className="container-editorial flex min-h-[60svh] flex-col items-center justify-center gap-4 py-32 text-center">
      <h1 className="font-display text-h2 text-navy">Trip not found</h1>
      <p className="text-body text-slate">This tour or package doesn't exist, or the link may be out of date.</p>
      <Link to="/" className="text-small text-cyan-deep underline-offset-4 hover:underline">
        Back to homepage
      </Link>
    </div>
  );
}

function TourDetailContent({ item, type }) {
  const navigate = useNavigate();
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const loadTour = useTripStore((s) => s.loadTour);
  const loadPackage = useTripStore((s) => s.loadPackage);

  const heroRef = useRef(null);
  const overviewRef = useRef(null);
  const itineraryRef = useRef(null);
  const experiencesRef = useRef(null);
  const galleryRef = useRef(null);
  const relatedRef = useRef(null);
  const leadRef = useRef(null);

  useGSAP(
    () => {
      if (reduced) return;
      for (const ref of [overviewRef, itineraryRef, experiencesRef, galleryRef, relatedRef, leadRef]) {
        if (!ref.current) continue;
        fadeUp(ref.current, { scrollTrigger: { trigger: ref.current, start: 'top 85%' } });
      }
    },
    { dependencies: [reduced], scope: heroRef },
  );

  const itinerary = type === 'tour' ? expandPhases(item) : buildPackageItinerary(item, toursById);
  const includedExperienceIds = resolveIncludedExperienceIds(item, type);
  const includedExperiences = includedExperienceIds.map((id) => experiencesById.get(id)).filter(Boolean);
  const relatedTours = type === 'tour' ? (item.relatedTourIds ?? []).map((id) => toursById.get(id)).filter(Boolean) : [];
  const image = resolveImage(item.image);

  const handleCustomize = () => {
    if (type === 'package') loadPackage(item.id);
    else loadTour(item.id);
    navigate('/build');
  };
  const handleEnquire = () => scrollToAnchor(lenis, '#enquire');

  return (
    <div className="bg-mist pb-24 md:pb-0">
      {/* 1 — Hero band */}
      <div ref={heroRef}>
        <RevealImage src={image} alt={item.name} aspectRatio="21/9" eager reveal={!reduced} className="rounded-b-3xl" />

        <div className="container-editorial">
          <div className="relative z-10 -mt-16 rounded-2xl border border-line bg-white p-6 shadow-md md:-mt-20 md:p-8">
            <Chip size="sm">{item.category}</Chip>
            <h1 className="mt-3 font-display text-display leading-[1.05] text-navy">{item.name}</h1>
            {item.rating != null && <Rating value={item.rating} reviewCount={item.reviewCount} size="md" className="mt-3" />}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-slate">
              <span>
                {item.durationDays[0]}–{item.durationDays[1]} days
              </span>
              {item.difficulty != null && <span>Difficulty {item.difficulty}/5</span>}
              {item.region && <span>{item.region}</span>}
              {item.groupSizeMax != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Users size={15} strokeWidth={1.5} aria-hidden="true" />
                  Up to {item.groupSizeMax}
                </span>
              )}
              {item.transportModes?.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Car size={15} strokeWidth={1.5} aria-hidden="true" />
                  {item.transportModes.join(', ')}
                </span>
              )}
            </div>

            <p className="mt-4">{formatPrice(item, type)}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button icon={ArrowUpRight} onClick={handleCustomize}>
                Customize this trip
              </Button>
              <Button variant="ghost" onClick={handleEnquire}>
                Enquire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2 — Overview */}
      <div ref={overviewRef} className="container-editorial mt-16 md:mt-24">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="font-display text-h2 text-navy">Overview</h2>
            <p className="mt-4 text-body text-slate">{item.summary}</p>
            {item.highlights?.length > 0 && (
              <ul className="mt-6 flex flex-col gap-2">
                {item.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-body text-navy">
                    <Mountain size={16} strokeWidth={1.5} className="mt-1 shrink-0 text-cyan-deep" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {/* tours.js authors explicit inclusions/exclusions; packages.js
                doesn't (no client-provided figures for a bundled circuit),
                so a package falls back to its own highlights list instead of
                inventing inclusion/exclusion data that doesn't exist. */}
            {item.inclusions && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="label text-slate">Included</h3>
                  <ul className="mt-2 flex flex-col gap-1.5 text-small text-navy">
                    {item.inclusions.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="label text-slate">Excluded</h3>
                  <ul className="mt-2 flex flex-col gap-1.5 text-small text-navy">
                    {item.exclusions.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sticky info card (desktop only — mobile gets the fixed bottom
              bar below). */}
          <div className="hidden md:block">
            <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm">
              {item.hotelClass != null && (
                <span className="inline-flex items-center gap-1.5 text-small text-slate">
                  <Hotel size={16} strokeWidth={1.5} aria-hidden="true" />
                  {item.hotelClass}-star hotels
                </span>
              )}
              <p>{formatPrice(item, type)}</p>
              <Button icon={ArrowUpRight} onClick={handleCustomize} className="w-full">
                Customize this trip
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 — Itinerary (the centrepiece) */}
      <div ref={itineraryRef} className="container-editorial mt-16 md:mt-24">
        <SectionHeader eyebrow="DAY BY DAY" heading="Itinerary" />
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-accent bg-accent/10 p-5 sm:flex-row sm:items-center">
          <p className="text-body text-navy">This itinerary is fully customisable.</p>
          <button
            type="button"
            onClick={handleCustomize}
            className="inline-flex items-center gap-1.5 text-small font-medium text-cyan-deep hover:underline"
          >
            Customize this trip
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-8">
          <Timeline itinerary={itinerary} readOnly />
        </div>
      </div>

      {/* 4 — Included experiences */}
      {includedExperiences.length > 0 && (
        <div ref={experiencesRef} className="container-editorial mt-16 md:mt-24">
          <SectionHeader eyebrow="ADD-ONS INCLUDED" heading="Included experiences" />
          <ul role="list" className="mt-8 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {includedExperiences.map((experience) => (
              <li key={experience.id}>
                <ExperienceCard experience={experience} mode="static" selected className="h-full" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5 — Gallery */}
      {item.gallery?.length > 0 && (
        <div ref={galleryRef} className="container-editorial mt-16 md:mt-24">
          <SectionHeader eyebrow="GALLERY" heading="A closer look" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {item.gallery.map((key) => (
              <RevealImage key={key} src={resolveImage(key)} alt={`${item.name} — photo`} aspectRatio="4/3" className="rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* 6 — Related tours (tours only — packages have no relatedTourIds) */}
      {relatedTours.length > 0 && (
        <div ref={relatedRef} className="container-editorial mt-16 md:mt-24">
          <SectionHeader eyebrow="YOU MIGHT ALSO LIKE" heading="Related tours" />
          <ul role="list" className="mt-8 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTours.map((related) => (
              <li key={related.id}>
                <TripCard item={related} type="tour" className="h-full" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 7 — Lead form */}
      <div ref={leadRef} id="enquire" className="container-editorial mt-16 py-8 md:mt-24 md:py-0">
        <div className="mx-auto max-w-2xl">
          <LeadCard heading={`Enquire about ${item.name}`} defaultInterest={item.name} />
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-white p-4 shadow-md md:hidden">
        <p className={cn('font-display text-h3 text-navy')}>{formatPrice(item, type)}</p>
        <Button icon={ArrowUpRight} onClick={handleCustomize}>
          Customize
        </Button>
      </div>
    </div>
  );
}
