import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useGSAP } from '@/lib/gsap';
import { SectionHeader } from '@/components/ui';
import { Counter } from '@/components/primitives';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { credentials, stats, b2b } from '@/data/trust';
import { initTrust } from './anim';

// Section 6 — Trust (CLAUDE.md's homepage IA). The page's one dark band: a
// navy background breaks the otherwise light-first rhythm on purpose, so
// credentials read as weightier than another white card row would.
//
// Credential logo art isn't available yet — each card renders a plain grey
// placeholder box (not resolveImage: that throws loud in DEV for any key
// that isn't a real registered asset, which a not-yet-existing logo can
// never be — see resolveImage's own comment). This is the same "grey box,
// no invented content" intent, just expressed locally instead of routed
// through the real-asset registry.
export default function Trust() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRefs = useRef([]);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      initTrust({ header: headerRef.current, cards: cardRefs.current, section: sectionRef.current });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section ref={sectionRef} id="trust" className="bg-navy py-24 text-white md:py-32">
      <div className="container-editorial">
        <div ref={headerRef}>
          <SectionHeader eyebrow="WHY RAWAAN" heading="A licensed, government-recognised operator" tone="dark" />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-12 md:grid-cols-4 md:gap-6">
          {credentials.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/10" aria-hidden="true">
                <ShieldCheck size={20} strokeWidth={1.5} className="text-white/70" />
              </div>
              <h3 className="font-display text-h3 text-white">{c.name}</h3>
              <p className="text-small text-white/70">{c.meaning}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/15 pt-12 md:mt-20 md:grid-cols-4 md:pt-16">
          {stats.map((s) => (
            <div key={s.id}>
              <p className="font-display text-display leading-none text-white">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="label mt-2 text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 md:mt-20 md:flex-row md:items-center">
          <p className="text-body text-white/80">{b2b.line}</p>
          <Link
            to={b2b.cta.to}
            className="inline-flex min-h-11 items-center gap-1.5 text-small font-medium text-cyan transition-colors hover:text-white"
          >
            {b2b.cta.label}
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
