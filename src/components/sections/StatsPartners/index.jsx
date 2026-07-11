import { useRef } from 'react';
import { useGSAP } from '@/lib/gsap';
import { AltitudeRule, Counter, Marquee, SectionLabel } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { partners, stats } from '@/data/partners';
import { initStatsPartners } from './anim';

const HEADING_ID = 'stats-partners-heading';

// Section 6 — second bone breather. Composes primitives + presets: Counter
// stats (self-fire on view), AltitudeRules (self-draw), and a partner-logo
// Marquee (self-loop). The section gates ONLY the stat fade-up for reduced
// motion; every primitive handles its own.
export default function StatsPartners() {
  const sectionRef = useRef(null);
  const statsGridRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return; // stat fade-up only; primitives self-handle the rest
      initStatsPartners({
        statBlocks: statsGridRef.current.children,
        section: sectionRef.current,
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      id="partners"
      aria-labelledby={HEADING_ID}
      className="relative overflow-hidden bg-bone py-24 text-ink md:py-36"
    >
      <div className="container-editorial">
        <AltitudeRule className="bg-ink/15" />

        {/* id on the existing spacing wrapper → aria-labelledby target */}
        <div id={HEADING_ID} className="mt-8">
          <SectionLabel tone="ink" as="h2" index="05">
            In Good Company
          </SectionLabel>
        </div>

        {/* Stats — 4 across on desktop, 2×2 on mobile */}
        <div
          ref={statsGridRef}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-20 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.id}>
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="block font-display text-h2 leading-none text-ink"
              />
              <span className="label mt-3 block text-ink/60">{stat.label}</span>
            </div>
          ))}
        </div>

        <AltitudeRule className="mt-20 bg-ink/15 md:mt-28" />

        {/* Partner logos — Fraunces name lockups stand in until SVG assets land */}
        <Marquee speed={35} gap="clamp(2.5rem, 6vw, 5rem)" className="mt-12">
          {partners.map((partner) => (
            <span key={partner.id} className="whitespace-nowrap font-display text-h3 text-stone">
              {partner.name}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
