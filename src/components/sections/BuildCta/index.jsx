import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// Slim band between Experiences and Trust (CLAUDE.md's V8 note). The
// Header's "Plan your trip" pill is persistent but small and easy to miss;
// Experiences' own "Continue to planner" button only appears once the
// traveler has already selected something. This is the homepage's one
// unconditional, prominent "Build your own journey" entry point outside the
// Hero — no GSAP/Framer here, it's static chrome, same as a section divider.
export default function BuildCta() {
  return (
    <div className="border-y border-line bg-mist py-10">
      <div className="container-editorial flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-display text-h3 text-navy">Not seeing quite the right trip?</p>
        <Link
          to="/build"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 font-sans text-sm font-medium text-navy transition-colors duration-300 hover:bg-cyan-deep hover:text-white"
        >
          Build your own journey
          <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
