import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Car, Hotel, Users } from 'lucide-react';
import { Button } from '@/components/primitives';
import { Rating } from './Rating';
import { Chip } from './Chip';
import { useTripStore } from '@/store/tripStore';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { resolveImage } from '@/assets/images';
import { cn } from '@/utils/cn';

// Card variants — Framer variant propagation: the outer card declares
// initial/whileHover, the inner image inherits the same labels with no
// override, so one hover on the card animates both shadow and image scale.
// The two boxShadow values are the literal --shadow-sm/--shadow-md strings
// from globals.css, not var() refs — Framer interpolates box-shadow as a
// multi-layer numeric value, which only works against literal values (a
// var() reference has no numeric structure to interpolate, so it would just
// snap). Keep these in sync with globals.css by hand if that token changes.
const CARD_V = {
  rest: { boxShadow: '0 1px 2px 0 rgb(14 34 51 / 0.06), 0 1px 3px 0 rgb(14 34 51 / 0.08)' },
  hover: { boxShadow: '0 8px 16px -4px rgb(14 34 51 / 0.1), 0 4px 8px -2px rgb(14 34 51 / 0.08)' },
};
const IMAGE_V = {
  rest: { scale: 1 },
  hover: { scale: 1.04 },
};

// The standard tour/package card (CLAUDE.md's Card anatomy). Covers BOTH
// data shapes via `type`:
//   - tour:    priceUSD is a [min, max] range → footer shows "From $min".
//   - package: priceUSD is a flat number, priceWas (optional) strikes through.
//
// `experiences` is the resolved subset of `item.includedExperienceIds` (just
// the fields the chip row needs, e.g. [{ id, name }]) — the calling section
// does the id→object lookup against data/experiences.js, keeping this
// component free of data-file imports (same rule as v1's dumb primitives).
//
// Icon row shows hotel class · max group · transport (tours.js's tour-level
// `transportModes[]`, joined). Packages don't carry hotelClass/transportModes
// of their own, so each icon segment renders only when the field is present.
//
//   <TripCard item={tour} type="tour" experiences={includedExperiences} />
//   <TripCard item={pkg} type="package" experiences={includedExperiences} />
//   <TripCard item={pkg} type="package" experiences={includedTours} chipsLabel="Includes" />
export function TripCard({
  item,
  type = 'tour',
  experiences = [],
  chipsLabel,
  onCustomize,
  onViewDetails,
  className,
}) {
  const navigate = useNavigate();
  const loadTour = useTripStore((state) => state.loadTour);
  const loadPackage = useTripStore((state) => state.loadPackage);
  const reduced = usePrefersReducedMotion();

  const handleCustomize = () => {
    if (onCustomize) return onCustomize(item);
    if (type === 'package') loadPackage(item.id);
    else loadTour(item.id);
    navigate('/build');
  };

  const handleViewDetails = () => {
    if (onViewDetails) return onViewDetails(item);
    navigate(`/packages/${item.slug}`);
  };

  const visibleExperiences = experiences.slice(0, 3);
  const remainingCount = experiences.length - visibleExperiences.length;
  const image = resolveImage(item.image);

  return (
    <motion.article
      initial="rest"
      whileHover={reduced ? undefined : 'hover'}
      animate="rest"
      variants={CARD_V}
      transition={{ duration: 0.2 }}
      className={cn('flex flex-col overflow-hidden rounded-xl border border-line bg-white', className)}
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-mist">
        <motion.img
          variants={reduced ? undefined : IMAGE_V}
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        {item.rating != null && (
          <Rating
            value={item.rating}
            reviewCount={item.reviewCount}
            size="sm"
            className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 shadow-sm"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-h3 text-navy">{item.name}</h3>
          <p className="label mt-1.5 text-slate">
            {item.durationDays[0]}–{item.durationDays[1]} days
            {item.difficulty != null && ` · Difficulty ${item.difficulty}/5`}
            {item.region && ` · ${item.region}`}
          </p>
        </div>

        {(item.hotelClass != null || item.groupSizeMax != null || item.transportModes?.length > 0) && (
          <div className="flex flex-wrap items-center gap-4 text-slate">
            {item.hotelClass != null && (
              <span className="inline-flex items-center gap-1.5 text-sm">
                <Hotel size={16} strokeWidth={1.5} aria-hidden="true" />
                {item.hotelClass}-star
              </span>
            )}
            {item.groupSizeMax != null && (
              <span className="inline-flex items-center gap-1.5 text-sm">
                <Users size={16} strokeWidth={1.5} aria-hidden="true" />
                Up to {item.groupSizeMax}
              </span>
            )}
            {item.transportModes?.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-sm">
                <Car size={16} strokeWidth={1.5} aria-hidden="true" />
                {item.transportModes.join(', ')}
              </span>
            )}
          </div>
        )}

        {visibleExperiences.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {chipsLabel && <span className="label text-slate">{chipsLabel}</span>}
            <div className="flex flex-wrap gap-2">
              {visibleExperiences.map((experience) => (
                <Chip key={experience.id} size="sm">
                  {experience.name}
                </Chip>
              ))}
              {remainingCount > 0 && <Chip size="sm">+{remainingCount}</Chip>}
            </div>
          </div>
        )}

        {/* mt-auto pins price/CTA to the card's bottom edge regardless of how
            tall the icon row / experience-chip row above it is — otherwise
            cards with more chips (wrapping to a second line) push their
            footer lower than neighboring cards in the same grid row. */}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4">
          <div>
            {type === 'package' && item.priceWas != null && (
              <span className="mr-2 text-sm text-slate line-through">${item.priceWas.toLocaleString()}</span>
            )}
            <span className="font-display text-h3 text-navy">
              {type === 'package' ? `$${item.priceUSD.toLocaleString()}` : `From $${item.priceUSD[0].toLocaleString()}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleViewDetails} className="hidden sm:inline-flex">
              View details
            </Button>
            <Button variant="primary" icon={ArrowUpRight} onClick={handleCustomize}>
              Customize this trip
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
