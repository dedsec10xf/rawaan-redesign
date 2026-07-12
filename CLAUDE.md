# CLAUDE.md — Rawaan Pakistan Homepage Redesign

## Project
Frontend-only demo. Premium luxury travel homepage for Rawaan Pakistan (rawaanpak.com).
Design philosophy: "The Unhurried Expedition" — Black Tomato's editorial voice + Active Theory's cinematic motion. Do NOT copy either site.
No backend, no CMS, no auth, no booking system, no Next.js, no Bootstrap, no MUI.

## Stack
- React 18+ (Vite), JavaScript (JSX, no TypeScript)
- Tailwind CSS v4 (CSS-first `@theme` config in `src/styles/globals.css`)
- GSAP + ScrollTrigger (ALL scroll-driven animation)
- Lenis (smooth scroll)
- Framer Motion (state-based UI ONLY: menu, accordion, preloader exit, hover variants)
- Lucide React (utility icons only: arrow, plus, menu, phone — stroke 1.5, size 16–20)
- split-type (headline line splits), clsx + tailwind-merge via `src/utils/cn.js`

**Hard rule: scroll = GSAP, component state = Framer Motion. Never mix.**

## Design Tokens (locked)
Colors (define in @theme as `--color-*`):
- ink `#0C1210` (primary dark bg), bone `#F4F1EA` (light bg / text-on-dark)
- stone `#A89F91` (secondary text/borders), glacier `#B8CDD3` (cool accent, focus rings)
- saffron `#C9722B` (CTA accent — use on <5% of surface), pine `#22322B` (deep panels)

Typography:
- Display serif: Fraunces (variable) — headlines, journey names
- Sans: Archivo — UI, body, labels
- Labels: 11–12px uppercase, tracking +0.2em (pattern: "EXPEDITIONS / 01")
- Fluid scale via clamp(): Display 96→40, H2 64→32, H3 32→22, body 18→16

Motion:
- Global ease: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) — export from `src/lib/easings.js`, never hardcode
- Reveals 0.8–1.4s, micro-interactions 0.3s, stagger 60–90ms
- Parallax: max 3 layers per section, ≤12% travel
- Animate ONLY transform / opacity / clip-path

Layout:
- 12-col grid, content max-w 1440, gutters 24/16, outer margin `clamp(16px, 5vw, 96px)` → `.container-editorial`
- Editorial asymmetry: text on cols 2–6 or 8–12; centered only in hero
- No cards/borders/shadows — separate via whitespace, 1px rules ("altitude line"), bg shifts
- Dark-first page; sections 2 (Manifesto) and 6 (Stats/Partners) are bone breathers
- Film grain overlay `.grain` at 3–4% opacity, fixed, pointer-events-none

## Architecture Rules
- Section folders: `src/components/sections/SectionName/index.jsx` + `anim.js`
  - `anim.js` exports `initSectionName(refs)` returning a GSAP timeline; component calls it inside `useGSAP({ scope })`
- Primitives are dumb, prop-driven, handle `prefers-reduced-motion` internally (sections never check it)
- All content lives in `src/data/*.js` (journeys.js, experiences.js, partners.js, faq.js) — no copy hardcoded in JSX
- GSAP: register plugins ONCE in `src/lib/gsap.js`, export configured gsap with defaults. Use `gsap.matchMedia()` for responsive variants. One `ScrollTrigger.refresh()` after fonts/images load.
- Lenis: single instance in `src/app/providers/SmoothScrollProvider.jsx`, driven by `gsap.ticker` (single raf), fires `ScrollTrigger.update` on scroll, exposed via context/`useLenis`, destroyed on unmount, disabled when reduced-motion.
- State: local useState only; context only for Lenis + reduced-motion. No state libraries.
- Cleanup every effect / GSAP context. Use `useGSAP` from `@gsap/react`.

## Conventions
- Components `PascalCase.jsx`; hooks `useCamelCase.js`; lib/data `camelCase.js`; assets `kebab-case.webp`
- Named exports for primitives, default export for sections
- Tailwind utility-first; only custom classes: `.container-editorial`, `.grain`, `.label`. No `@apply` sprawl.
- Comments explain WHY, not what. No magic numbers in animation code.
- Accessibility: semantic landmarks, single h1, focus-visible glacier rings, contrast ≥4.5:1, tap targets ≥44px, keyboard-operable menus/carousels, honor prefers-reduced-motion (fades only, Lenis off)
- Images: through `RevealImage` — lazy (hero eager), decoding async, explicit aspect-ratio, WebP, responsive srcSet, LQIP behind clip reveal
- Perf targets: LCP <2.5s, CLS <0.05, TBT <200ms. Lazy-import below-fold sections.

## Workflow Rules (IMPORTANT)
- Build ONE component at a time. Wait for approval before the next.
- Never generate multiple components/sections in one response unless explicitly asked.
- Each component must be production-ready when delivered: responsive, reduced-motion handled, cleaned-up effects.
- Briefly explain architectural decisions; keep responses token-efficient.
- Do not refactor unrelated files while building a component.

## Page Sections (build order lives in Milestones)
0 Preloader · 1 Hero · 2 Manifesto (bone) · 3 Signature Journeys (pinned horizontal, ONLY pinned section) · 4 Experiences (hover-expand list + cursor image; mobile accordion) · 5 Regions marquee · 6 Stats + Partners (bone) · 7 Testimonial · 8 Final CTA + FAQ + Footer

Journeys data (5): K2 Base Camp, Kalash at Chilam Joshi, Skardu & Baltistan, Shandur Polo Festival, Gandhara Trail.
Experiences (5): Custom Journeys, Group Expeditions, Luxury Stays, Adventure, Cultural.
Regions (6): Hunza, Skardu, Chitral, Swat, Lahore, Naran.

## Milestones
- **M1 Foundation (CURRENT)**: Tailwind @theme tokens, fonts (Fraunces + Archivo, subsetted, font-display swap, preload), `lib/gsap.js`, `lib/easings.js`, `lib/lenis.js` + SmoothScrollProvider, `usePrefersReducedMotion`, `useLenis`, `useMedia`, `cn()`, `.container-editorial`, `.grain`, data file stubs, App shell rendering.
- M2 Primitives: SectionLabel, AltitudeRule, Button + MagneticWrap, RevealText, RevealImage, Counter, Marquee
- M3 Shell: Header + full-screen menu, Footer, Preloader
- M4 Hero
- M5 Editorial: Manifesto, Stats/Partners, Testimonial
- M6 Journey Showcase (pinned horizontal; mobile = CSS snap carousel, unpinned)
- M7 Experiences, Regions marquee, CTA + FAQ
- M8 Polish: responsive re-choreography, reduced-motion audit, a11y audit, Lighthouse ≥90

## Mobile Re-choreography (not squishing)
- Pinned gallery → native snap carousel with counter
- No mouse parallax / magnetic hover on touch
- Hero video → static image on mobile/saveData
- Experiences cursor-image → inline accordion thumbnails
## Decisions Log (locked in review)
- M1: Fonts self-hosted via @fontsource-variable (no Google Fonts requests). document.fonts.ready → ScrollTrigger.refresh() + fontsReady flag. CSS reduced-motion rules scoped to CSS-owned properties only — GSAP reduced-motion is handled in JS by primitives. lagSmoothing(0) set where Lenis rides gsap.ticker. `@` alias = /src.
- M2: Scroll-reveal primitives (RevealText, RevealImage, AltitudeRule) accept optional `containerAnimation` prop for use inside the M6 pinned horizontal section.
- Only ONE pinned section ever (Journey Showcase). Never create a pin inside a pinned section.
- Animation ownership: primitives own element-level animation; each section's anim.js owns section choreography and may only compose presets + primitives; presets never touch pinning.
- lib/presets.js: create in M5 (not before), containing only DUR/STAG constants, fadeUp (non-text elements), drawIn, and shared scrub defaults. Never duplicate what a primitive already does. Section-specific choreography (e.g. hero entrance) lives in that section's anim.js.
- CinematicMedia primitive: build as FIRST task of M4. Props: video (webm+mp4), poster, image, overlay (scrim|gradient|none), parallax amount, priority. Renders image-only on mobile / saveData / reduced-motion. Composes RevealImage's reveal logic (shared useClipReveal), never duplicates it. Also used by Testimonial (M7).
- M3 Footer: wordmark pattern = outer wrapper holds static clip offset, inner span carries GSAP transform. Sections gate their OWN choreography's reduced-motion; primitives still self-handle theirs.
- Nastaliq watermark uses @fontsource/noto-nastaliq-urdu (loaded, subsetted by usage). 
- M8 reminder: React.lazy below-fold sections + manual vendor chunking; JS was 365kB/124kB gzip at M3.
- M4: useClipReveal hook is the single source of the clip-wipe + scale-settle language; RevealImage and CinematicMedia compose it. Parallax always lives on a separate overscanned wrapper element (never the reveal target), clamped to 12% with +2% overscan buffer. saveData read once at load (non-reactive) by design.
- Hero entrance must be triggerable externally (exported play() / started-by-event) so the Preloader's onExitComplete can start it mid-wipe.
- M4 Hero: CinematicMedia gets a `reveal` prop (default true); Hero passes reveal={false} because its entrance timeline owns the media choreography. Rule: a section that choreographs its own media entrance must disable the primitive's built-in reveal — never let two entrances race.
- Intentional multi-line headlines: render each line as a block span; RevealText masks pre-made line blocks instead of relying on split-type parsing <br/>.
- M3 closed (Footer, Preloader, Header/menu all built and confirmed working in-browser by Hasnat). 
- M8 polish additions: (1) evaluate menu CTA saffron fill vs ghost variant against <5% saffron rule; (2) menu focus-visible parity with hover state; (3) all anchor nav must scroll via lenis.scrollTo, never native jump.
- Process note: Hasnat confirms in-browser behavior himself; reports focus on code/API changes.
- M5 Manifesto: word-scrub is section-owned split (types:'words'), not a RevealText mode — per-word scrubbed opacity is a distinct language. anim.js may return a cleanup fn instead of a timeline when gsap.matchMedia owns teardown (documented exception). Faint-text effects use opacity on ink (never animate color).
- .label uses currentColor; SectionLabel has tone prop ('stone' default | 'ink' for bone sections). No !important overrides.
- Z-index scale as CSS vars: --z-preloader > --z-menu-overlay > --z-header > grain > content. Header is fixed.
- Z-scale locked: --z-grain:100 < --z-menu-overlay:150 < --z-header:160 < --z-preloader:200. Header sits ABOVE menu overlay (close affordance lives in header). Menu is portaled to document.body — fixed overlays must never live under a transformed ancestor (containing-block trap). Hide-on-scroll header removed; if reintroduced in M8, it must not conflict with the portal pattern.
- .label is colorless (currentColor). Raw .label consumers set explicit color; SectionLabel via tone prop.
- StatsPartners confirmed working in-browser. Partner logos are text stand-ins until SVG assets land (M8 asset pass).
- M5 closed. Testimonial: CinematicMedia reused unmodified; scrim gaps solved by section-owned deepening layers; scrimStrength prop deferred until a 3rd consumer needs it.
- M6 split into 3 deliveries: (1) pin scaffold + scrub mechanics, (2) panel content + containerAnimation reveals, (3) mobile snap carousel. Pin exists ONLY inside gsap.matchMedia ≥768px; below 768 there is no pin, no ScrollTrigger horizontal scrub.
- M6 delivery 1 confirmed: pin + horizontal scrub mechanics working (Lenis + pin verified in-browser). Scrubbed tweens use ease:'none' — never ease a scrubbed tween.
- M6 d2: RevealImage gained optional `start` passthrough (default unchanged). Panel transform ownership: [data-parallax] GSAP x › hover-scale div CSS › RevealImage GSAP clip+scale — never merge these layers. Panel 1 uses vertical triggers (gated index>0 for horizontal). Keyboard-in-pin limitation documented; M8 candidates: focus→scrub handler, inert+roving tabindex, skip link.
- Images: real placeholder photography wired via Vite imports (assets/images/index.js) from M6 onward; finals swapped in M8. Never public-folder string paths.
- ACCENT CHANGE: saffron retired from use. New semantic token --color-accent = deep desaturated Rawaan teal (derived from client brand). All interactive/accent color references use accent token, never a raw palette color. Saffron remains defined but unreferenced.
- Menu background: the overlay renders its OWN copy of the hero image and plays a satellite zoom-out (scale ~2.4→1) on open + subtle scrim; works from any scroll position; never transforms the live Hero. Ink fallback under reduced motion.
- Reveal ownership rule: for any element, exactly ONE system may own both its hidden initial state and its reveal. Primitives own both, or a section's anim.js owns both — never split across the two. In desktop pinned mode, JourneyShowcase panels 2–5: anim.js owns hide+reveal on the same nodes; primitives render inert/final-state.
- clearProps only accepts real CSS property names ('all', 'opacity', 'visibility', 'transform') — 'autoAlpha' is not valid in clearProps.
- SCOPE CUT: mobile snap carousel removed. JourneyShowcase mobile behavior = plain vertical stack (delivery-1 fallback), official and final. Desktop pin showcase = delivery-2 mechanism, restored via revert. Do not rebuild the carousel.
- M6 closed (desktop pin + mobile stack). Post-mortem: the delivery-3 dual-composition Panel refactor broke desktop; five forward-fix cycles failed; resolution was revert + scope cut. Lessons already logged: reveal ownership, HMR trap, bisect-after-two-failures, commit discipline.
- M7 closed: Experiences (hover-expand + floating preview), Regions (window-strip backdrop), Contact (CTA + FAQ, id="contact"). Final section order: Hero → Manifesto → JourneyShowcase → Experiences → Regions → StatsPartners → Testimonial → Contact → Footer. Full anchor circuit live via resolveAnchor.
- M8 in progress, 4 deliveries: (1) perf: code-split + vendor chunks + imagetools pipeline + preload, (2) reduced-motion + a11y audits + section renumbering, (3) design refinements (menu CTA, preview saturation, regions images, grain consistency), (4) final verification (Lighthouse ≥90, cross-browser, cold-start walkthrough). Lazy-section rule: one ScrollTrigger.refresh() after all lazy sections mount.
- M8 design pass (delivery 3, partial): JourneyShowcase panels rebuilt as full-bleed image compositions — [data-parallax] now wraps the whole image (PARALLAX amplitude 4 → 8% total travel, overscan 6%, up from the portrait's 6% travel/3% amplitude), left+bottom scrims (ink/70, ink/80, each HELD at full strength through the zone the text/button actually occupies, not a plain linear fade — needed for a deterministic worst-case contrast check), decorative index span removed. Reveal ownership extended: anim.js's targets now include `[data-reveal-meta]` (meta rows + Explore button, queried via querySelectorAll since 2 nodes share that attribute) alongside `[data-reveal-image]`/`[data-reveal-name]` — meta/button were previously ungated. Baseline-strip lesson: the fixed counter/progress (index.jsx) and the panel's Explore button intentionally share one bottom-right/bottom-left line (both pb-24) — but the name+meta column must NOT also sit flush on that line (same bottom-left corner as the counter → visual collision); it needs its own `md:mb-16` to clear the counter's footprint. Regions: row1 text-display→text-h2, row2 stays 0.85x of row1; inline window images 0.8em→1.4em (translate-y micro-nudge removed, no longer valid at the new size — flagged for an in-browser by-eye check); Marquee `gap` 4rem→1.25em (em-based so it scales with each row's own font-size) on both rows; backdrop overlay ink/85→ink/70 for a brighter active backdrop. Contrast math (worst case = pure-white backdrop pixel): plain text-stone alone only clears 4.5:1 down to ~ink/83, so resting region names now compensate to `text-bone/90` whenever the backdrop is active (~5.48:1) — hover/focus stays full bone (~6.3:1) as the brightest state. Verified cold-start via a scripted Playwright walkthrough (desktop + mobile, panels 1–5 scrubbed via direct scrollTo, backdrop triggered via focus since the marquee's continuous motion defeats hover actionability checks): no console errors, all reveal targets read opacity 1 once fully on-screen, resting/hover text colors matched the intended compensation.