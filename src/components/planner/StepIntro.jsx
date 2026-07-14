// Shared step-opening block — every one of the 7 steps uses this exact
// shape (eyebrow · Fraunces question heading · one line of guiding copy),
// so it's a single component instead of 7 near-identical headers drifting
// apart. The guiding copy is written in Rawaan's voice on purpose (a
// knowledgeable local operator explaining why a choice matters, not a form
// label) — it's the thing that makes this read as a planning conversation
// rather than a checkout flow.
//
//   <StepIntro number={3} name="Your ride" heading="How will you get there?" copy="..." />
export function StepIntro({ number, name, heading, copy }) {
  return (
    <div className="mb-8">
      <p className="label text-cyan-deep">
        STEP {number} · {name.toUpperCase()}
      </p>
      <h2 className="mt-2 font-display text-h2 text-navy">{heading}</h2>
      <p className="mt-3 max-w-prose text-body text-slate">{copy}</p>
    </div>
  );
}
