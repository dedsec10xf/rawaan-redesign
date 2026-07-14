// Generic stub shell for routes with no real page yet (/packages,
// /destinations, /experiences, /corporate, /about, /blog, /contact). Just a
// heading so the route is distinguishable while navigating during dev.
export default function StubPage({ title }) {
  return (
    <div className="container-editorial flex min-h-[60svh] items-center py-32">
      <h1 className="font-display text-h2 text-navy">{title}</h1>
    </div>
  );
}
