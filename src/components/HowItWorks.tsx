type Step = { title: string; body: string; detail: string };
type Section = { eyebrow?: string; heading?: string; subhead?: string };

type Props = {
  section?: Section;
  steps?: Step[];
};

const DEFAULT_STEPS: Step[] = [
  {
    title: "24/7 AI dispatcher",
    body: "Chat or call anytime. Our demo AI confirms your Lee County zip, understands the issue, and gathers contact details — no hold music.",
    detail: "Mocked client-side · no external AI APIs",
  },
  {
    title: "Book a real-feel slot",
    body: "Pick from same-day or next-day appointment windows. The demo shows confirmation instantly so sales pitches feel tangible.",
    detail: "Fake calendar slots for pitch demos",
  },
  {
    title: "Tech SMS alert",
    body: 'In production, your assigned technician gets an SMS with address and issue notes. Here we simulate the "tech notified" moment.',
    detail: "Narrative only · no Twilio in this sample",
  },
];

export default function HowItWorks({ section, steps = DEFAULT_STEPS }: Props) {
  const eyebrow = section?.eyebrow ?? "How it works";
  const heading = section?.heading ?? "From chat to cool air in three calm steps";
  const subhead =
    section?.subhead ??
    "Built for urgent Florida heat — without the chaos. This flow is the demo narrative we walk through on sales calls.";

  return (
    <section id="how" className="relative overflow-hidden bg-white py-20 sm:py-24" aria-labelledby="how-heading">
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label mx-auto mb-4">{eyebrow}</p>
          <h2 id="how-heading" className="text-3xl font-extrabold tracking-tight text-gb-navy sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-gb-muted">{subhead}</p>
        </div>

        <ol className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map((step, i) => (
            <li key={`${step.title}-${i}`} className="card relative p-6 sm:p-7">
              {i < steps.length - 1 && (
                <div
                  className="absolute right-0 top-1/2 hidden h-px w-6 translate-x-full bg-gradient-to-r from-gb-aqua to-transparent lg:block"
                  aria-hidden="true"
                />
              )}
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gb-navy text-lg font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gb-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gb-muted">{step.body}</p>
              {step.detail ? (
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 ring-1 ring-amber-200/80">
                  {step.detail}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
