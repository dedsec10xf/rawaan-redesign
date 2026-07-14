# CLAUDE.md — Rawaan Pakistan v2: The Planner

## Product
NOT a cinematic brochure. A travel-planning PLATFORM for Rawaan (a licensed Pakistani DMC).
Homepage answers in 5 seconds: "How can Rawaan help me plan my trip?"
Users CONFIGURE, they don't browse. Every section narrows a choice, adds to a trip, or builds trust.
Design language: Apple / Airbnb / Linear / Notion travel-product UI. NOT Black Tomato, NOT experimental.
Motion serves usability and never blocks interaction. No pins, no scrubs, no cinematic intros, no preloader.

v1 (cinematic editorial) is preserved at git tag `v1-editorial`. We mutate in place toward v2.

## Stack (unchanged foundation)
React + Vite · Tailwind v4 (@theme) · GSAP + ScrollTrigger (scroll reveals, counters, timeline draws) · Lenis · Framer Motion (ALL state UI: planner steps, chips, accordions, summary panel, filters) · Zustand (trip state) · react-router · Lucide · split-type · vite-imagetools · cn()
Rule stands: scroll = GSAP, state = Framer.

## Design tokens v2 (replace v1 palette)
--color-cyan #18C4E6 (accent/CTA/active) · --color-cyan-deep #0E8FAA (hover, accent text on white)
--color-navy #0E2233 (primary text, dark panels, footer) · --color-slate #5A6B78 (secondary text)
--color-mist #F4F7F9 (page bg) · --color-white #FFFFFF (cards) · --color-line #E3E9ED (borders)
--color-accent repoints to cyan. Ink/bone/stone/saffron/pine retired.
Light-first. Radius: xl 16px (cards) / 2xl 24px (panels) / full (pills). Shadow: sm resting, md hover — elevation is the hover language.
Type: Fraunces = section headlines + card titles ONLY. Archivo = all UI, body, labels, numbers, fields.
Scale: Display 56→36, H2 36→26, H3 22→18, body 16, small 14, label 12.
Motion: 150–250ms UI, reveals = fade + 8px rise, stagger 60ms. Nothing over 400ms.

## Business model (from client audit — ground truth)
Categories (THEIR taxonomy, use these words): Adventure · Trekking · Religious · Culture · Leisure
Service lines: Custom Tours · Group Travel · Luxury Stays · Corporate · Educational
Two product tiers:
- TOURS (destination): K2 Base Camp ($3500–4500, 15–25d), Mashabrum BC ($2800–3800, 8–12d), Fairy Meadows, Rakaposhi BC, Kalash Valley, Hunza Valley, Shandur Polo, Sikh Yatra, Buddhist Trail
- PACKAGES (curated multi-day, discounted): Past to Peaks (19–20d), Surood-e-South (14–15d), Wisdom in the Mountains (14–15d) — $1800 struck → $1600
Trust assets (real, lead with them): licensed operator, Dept. of Tourism, PATO, UNWTO, corporate + educational + conference clients.
Pricing UI: cards show "From $3,500"; detail pages show the full range.
Ratings: invented for demo (4.7–4.9 + plausible review counts) — flag as demo data in a code comment.
Images: reuse existing v1 assets as placeholders (client's own photos to be swapped later).

## Data model (data/*.js)
tours.js: { id, name, slug, category, region, durationDays:[min,max], priceUSD:[min,max], difficulty:1-5, rating, reviewCount, hotelClass, groupSizeMax, image, gallery[], summary, highlights[], inclusions[], exclusions[], itinerary:[{day,title,description,hotel,transport,experienceIds[]}], includedExperienceIds[], relatedTourIds[] }
packages.js: { id, name, tagline, durationDays, priceUSD, priceWas, includes:tourIds[], + card fields }
experiences.js: { id, name, category, durationHours, priceUSD, image, regionsAvailable[] }

## The core loop (this is the product; the client rejected v1 for lacking it)
Featured tour card shows its included-experience chips → "Customize this trip" → store.loadTour(id) preloads tour + its included experiences → Planner step 4 shows the full experience pool with those pre-ticked → user adds/removes → Journey Timeline and floating Trip Summary update live (days, cost, count).
ONE ExperienceCard component serves three surfaces: homepage section, planner step 4, tour detail page.

## State (src/store/tripStore.js — Zustand)
{ destination[], category, dates{start,end}, groupSize, budget, travelStyle, notes, baseTourId, selectedExperienceIds[], itinerary[] }
actions: setField, toggleExperience, toggleDayExperience, loadTour, loadPackage, addDay, editDay, removeDay, reset
derived: useSummary() → { nights, travelers, experienceCount, estimatedCost, dayCount }
Trip Summary panel appears only once the store is dirty.

## Routes (react-router)
/ (home) · /build (Build Your Journey) · /packages/:slug (tour/package detail — itinerary builder, not brochure) — these three are REAL.
/packages · /destinations · /experiences · /corporate · /about · /blog · /contact — routed shells for the demo.

## Homepage IA (build order = milestones)
1 Hero + Planner widget · 2 Explore by Category (5 tiles) · 3 Featured Tours (filterable grid) · 4 Curated Packages · 5 Build Your Own Journey (5-step, /build — step 5/Review contains the Journey Timeline) · 6 Local Experiences · 7 Trust · 8 Testimonials · 9 FAQ + Lead form. Persistent: floating Trip Summary. Header: light, sticky, cyan "Plan your trip" pill. Footer: navy, compact, trust badges.

## Card anatomy (standard, from Intrepid/Dribbble references)
[image + rating chip ★4.8] [title Fraunces] [meta: duration · difficulty · region] [icon row: hotel class, transport, max group] [included experience chips: 3 + "+2"] [footer: "From $X" ↔ CTA]

## KEPT from v1 (do not rebuild)
lib/gsap + useGSAP + presets + easings · Lenis + SmoothScrollProvider · RevealText / RevealImage / useClipReveal / Counter / Button + MagneticWrap · imagetools pipeline + assets · resolveAnchor · reduced-motion contract (primitives self-handle; sections gate their own) · reveal-ownership rule (ONE system owns hide+reveal per element) · a11y patterns · z-scale · Reporting Contract · commit discipline · HMR trap rule (cold-start to verify GSAP work)

## REMOVED in v2
Manifesto · pinned JourneyShowcase (pins block interaction) · Regions marquee · Experiences hover-list · menu satellite zoom · film grain · preloader · footer wordmark · ink/bone palette

## Milestones
V1 Foundation swap (tokens, type, radius/shadow, kill removed sections, light Header/Footer, react-router + route shells)
V2 Zustand store + shared primitives (TripCard, ExperienceCard, Chip, FormField set, Rating, SectionHeader)
V3 Hero + planner widget · V4 Featured Tours + Category tiles · V5 Local Experiences · V6 Build Your Own Journey (5-step planner; step 5/Review absorbs the former standalone V7 Journey Timeline milestone — it lives inside the planner flow, not as a homepage section) · V7 Trip Summary floating panel · V8 Packages + Trust + Testimonials + FAQ/Lead · V9 Tour Detail page · V10 Polish (perf, a11y forms, reduced-motion, responsive, Lighthouse)

## Workflow (unchanged)
One component/section at a time. Stop for review. Reporting Contract applies: files changed, public API changes on shared components, judgement calls, direct answers to every question asked, lint/build results.
## Reporting Contract (v2 — concise)
After each delivery, report ONLY:
1. DECISIONS LOG — one entry per non-obvious choice:
   [what changed] / Reason: [why] / Risk: [what it might cost later]
2. API CHANGES — any new/changed props or exports on SHARED components, hooks, or the store (exact names, types, defaults). Skip if none.
3. ANSWERS — direct answers to every question the prompt asked.
4. lint + build status (one line).
No file-by-file narration, no spec-compliance walkthroughs, no restating what the prompt said.
- Boundary refinement: when a grid/list is filterable, Framer owns BOTH its entrance and its filter transitions (one owner per element). Surrounding non-animated chrome (section headers) stays GSAP. Never layer a GSAP entrance under Framer layout animations.
- Homepage browse/filter UI state lives in Home.jsx (lifted), never in tripStore. tripStore = trip data only.