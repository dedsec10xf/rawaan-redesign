import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@/lib/gsap';
import { Select, Stepper, DateRange, Slider } from '@/components/ui';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLenis } from '@/hooks/useLenis';
import { scrollToAnchor } from '@/lib/resolveAnchor';
import { tours } from '@/data/tours';
import { hero } from '@/data/hero';
import { useTripStore } from '@/store/tripStore';
import { initHeroEntrance } from './anim';

// Region options for the Destination field — deduped from tours.js rather
// than hand-maintained, so a new tour's region shows up here automatically.
const DESTINATION_OPTIONS = [...new Set(tours.map((t) => t.region))]
  .sort()
  .map((region) => ({ value: region, label: region }));
const CATEGORY_OPTIONS = hero.categories.map((c) => ({ value: c, label: c }));

const BUDGET_MIN = 500;
const BUDGET_MAX = 5000;

// Section 1 (v2) — the planning entry point. This is the whole complaint the
// client's audit raised about v1: "how can Rawaan help me plan my trip?"
// must be answerable in 5 seconds, so the planner card sits beside the
// headline instead of below a cinematic scroll. See CLAUDE.md's Product /
// V3 milestone sections.
export default function Hero() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const trustRef = useRef(null);
  const cardRef = useRef(null);

  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();
  const navigate = useNavigate();
  const setField = useTripStore((s) => s.setField);

  const [destination, setDestination] = useState(null);
  const [category, setCategory] = useState(null);
  const [guests, setGuests] = useState(2);
  const [dates, setDates] = useState({ start: null, end: null });
  const [budget, setBudget] = useState(2000);
  const [errors, setErrors] = useState({});

  useGSAP(
    () => {
      if (reduced) return; // static final state — form is already interactive
      initHeroEntrance({
        eyebrow: eyebrowRef.current,
        headline: headlineRef.current,
        sub: subRef.current,
        trust: trustRef.current,
        card: cardRef.current,
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const handleBrowse = (e) => {
    e.preventDefault();
    scrollToAnchor(lenis, hero.browseCta.href);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!destination) nextErrors.destination = 'Pick a destination';
    if (!category) nextErrors.category = 'Pick a category';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    // Hero's own quick-pick stays single-select (a fast planning entry
    // point, not the full multi-region builder) — tripStore.destination is
    // an array, so it wraps the one pick.
    setField('destination', [destination]);
    setField('category', category);
    setField('groupSize', guests);
    setField('dates', dates);
    setField('budget', budget);
    navigate('/build');
  };

  return (
    <section ref={sectionRef} className="relative min-h-[85svh] overflow-hidden bg-mist">
      {/* Background photo + light scrim, desktop only (per CLAUDE.md's mobile
          call: dropped in favor of a plain mist bg rather than a shorter
          band, so the single-column form reads clean with no busy backdrop). */}
      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        <img
          src={hero.background.src}
          srcSet={hero.background.srcSet}
          sizes={hero.background.sizes}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        {/* Mist-to-transparent scrim from the left: keeps the left column's
            navy text on a near-solid light surface (≥4.5:1) while the photo
            still reads on the right, behind the planner card. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, var(--color-mist) 0%, var(--color-mist) 42%, rgb(244 247 249 / 0.55) 58%, transparent 78%)',
          }}
        />
      </div>

      <div className="container-editorial relative z-10 grid min-h-[85svh] items-center gap-12 py-24 md:grid-cols-12 md:py-32">
        {/* Left column — the 5-second answer */}
        <div className="md:col-span-6">
          <p ref={eyebrowRef} className="label text-cyan-deep">
            {hero.eyebrow}
          </p>
          <h1 ref={headlineRef} className="mt-4 font-display text-display leading-[1.05] text-navy">
            {hero.headline}
          </h1>
          <p ref={subRef} className="mt-4 max-w-md text-body text-slate">
            {hero.sub}
          </p>
          <ul ref={trustRef} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {hero.trustStrip.map((item) => (
              <li key={item} className="label text-slate">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — the planner card */}
        <div ref={cardRef} className="md:col-span-6">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Plan your trip"
            className="rounded-2xl bg-white p-6 shadow-md md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Destination"
                placeholder="Choose a region"
                value={destination}
                onChange={(v) => {
                  setDestination(v);
                  if (errors.destination) setErrors((e) => ({ ...e, destination: undefined }));
                }}
                options={DESTINATION_OPTIONS}
                error={errors.destination}
              />
              <Select
                label="Category"
                placeholder="Choose a category"
                value={category}
                onChange={(v) => {
                  setCategory(v);
                  if (errors.category) setErrors((e) => ({ ...e, category: undefined }));
                }}
                options={CATEGORY_OPTIONS}
                error={errors.category}
              />
              <Stepper label="Guests" value={guests} onChange={setGuests} min={1} max={20} />
              <Slider
                label="Budget"
                value={budget}
                onChange={setBudget}
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={100}
              />
              <DateRange label="Dates" value={dates} onChange={setDates} className="sm:col-span-2" />
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 font-sans text-sm font-medium text-navy transition-colors duration-300 hover:bg-cyan-deep hover:text-white"
            >
              <span>Generate Journey</span>
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>

            <a
              href={hero.browseCta.href}
              onClick={handleBrowse}
              className="mt-4 block text-center text-small text-slate underline-offset-4 hover:text-cyan-deep hover:underline"
            >
              {hero.browseCta.label}
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}
