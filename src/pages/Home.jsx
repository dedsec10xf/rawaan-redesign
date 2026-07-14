import { lazy, Suspense, useEffect, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import Hero from '@/components/sections/Hero';
import Categories from '@/components/sections/Categories';
import FeaturedTours from '@/components/sections/FeaturedTours';
import Packages from '@/components/sections/Packages';
import Experiences from '@/components/sections/Experiences';
import BuildCta from '@/components/sections/BuildCta';

// Below-fold on Home is code-split — Hero stays eager (LCP path). Trust,
// Testimonials and Contact (FAQ + Lead) share one Suspense boundary since
// they're always requested together at the bottom of the page; a single
// fixed-height, bg-matched fallback covers all three so a late mount doesn't
// shift layout.
const Trust = lazy(() => import('@/components/sections/Trust'));
const Testimonials = lazy(() => import('@/components/sections/Testimonials'));
const Contact = lazy(() => import('@/components/sections/Contact'));

const TAIL_FALLBACK = 'min-h-[200svh] bg-navy';

// Home — full homepage IA (CLAUDE.md): Hero → Categories → Featured Tours →
// Curated Packages → Experiences → Build CTA band → Trust → Testimonials →
// FAQ/Lead. `category` is lifted here rather than owned by either section: a
// Categories tile click must drive Featured Tours' grid, so the two need one
// shared value, not tripStore (this is homepage browse UI, not trip-planning
// data — see CLAUDE.md's state boundary). `difficulty` stays local to
// FeaturedTours, nothing else reads it. A second ScrollTrigger.refresh()
// fires once the lazy tail has actually committed — its mount changes
// document height, which can invalidate trigger positions measured before it
// landed.
export default function Home() {
  const [tailMounted, setTailMounted] = useState(false);
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState('any');

  useEffect(() => {
    if (tailMounted) ScrollTrigger.refresh();
  }, [tailMounted]);

  return (
    <>
      <Hero />
      <Categories active={category} onSelect={setCategory} />
      <FeaturedTours
        category={category}
        onCategoryChange={setCategory}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
      />
      <Packages />
      <Experiences />
      <BuildCta />
      <Suspense fallback={<div aria-hidden="true" className={TAIL_FALLBACK} />}>
        <TailMountSignal onMount={() => setTailMounted(true)}>
          <Trust />
          <Testimonials />
          <Contact />
        </TailMountSignal>
      </Suspense>
    </>
  );
}

// Placed INSIDE the Suspense boundary, wrapping the lazy tail — React only
// commits this subtree once every lazy import has resolved, so this effect
// firing is a reliable "the tail is really mounted" signal.
function TailMountSignal({ children, onMount }) {
  useEffect(() => {
    onMount();
  }, [onMount]);
  return children;
}
