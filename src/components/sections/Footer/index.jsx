import { Link } from 'react-router-dom';
import { AltitudeRule, SectionLabel } from '@/components/primitives';
import { footer } from '@/data/footer';

const { columns, trustBadges, legal } = footer;

// Shared link treatment: white-on-navy for contrast, white/70 hover→white, and
// a 44px min tap target.
const LINK = 'inline-flex min-h-11 items-center text-white/70 transition-colors duration-300 hover:text-white';

// External-link attributes, applied only when a link opts in.
const ext = (external) => (external ? { target: '_blank', rel: 'noreferrer' } : {});

// Compact navy footer (v2) — three columns + a trust-badge placeholder row.
// No parallax wordmark (removed in the v2 pass) — nothing here needs GSAP, so
// there's no anim.js.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-navy text-white">
      <div className="container-editorial py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Explore */}
          <nav aria-label="Footer">
            <SectionLabel tone="white" as="h2">
              {columns.explore.heading}
            </SectionLabel>
            <ul className="mt-6 flex flex-col">
              {columns.explore.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <SectionLabel tone="white" as="h2">
              {columns.contact.heading}
            </SectionLabel>
            <ul className="mt-6 flex flex-col">
              {columns.contact.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={LINK} {...ext(item.external)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <address className="mt-4 whitespace-pre-line not-italic leading-relaxed text-white/70">
              {columns.contact.address}
            </address>
          </div>

          {/* Social */}
          <div>
            <SectionLabel tone="white" as="h2">
              {columns.social.heading}
            </SectionLabel>
            <ul className="mt-6 flex flex-col">
              {columns.social.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={LINK} {...ext(link.external)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <AltitudeRule animated={false} className="mt-12 bg-white/15 md:mt-16" />

        {/* Trust badges — text stand-ins until badge SVGs land (client audit
            ground truth, see CLAUDE.md's Business model section). */}
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          {trustBadges.map((badge) => (
            <li key={badge} className="label text-white/70">
              {badge}
            </li>
          ))}
        </ul>

        {/* Legal */}
        <div className="mt-8">
          <p className="label text-white/50">
            © {year} {legal.company}. {legal.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
