type Review = { name: string; city: string; text: string; stars: number };
type Stat = { value: string; label: string };
type Section = { eyebrow?: string; heading?: string; subhead?: string };

type Props = {
  section?: Section;
  reviews?: Review[];
  stats?: Stat[];
};

const DEFAULT_REVIEWS: Review[] = [
  {
    name: "Maria G.",
    city: "Cape Coral",
    stars: 5,
    text: "AC died at 9pm on a 94° day. Gulf Breeze’s dispatcher had a tech at our door by 10:15. Kids were finally able to sleep.",
  },
  {
    name: "James R.",
    city: "Fort Myers",
    stars: 5,
    text: "Straight talk on replacement vs repair. They saved us from overbuying a unit we didn’t need. Solid, premium feel without the pressure.",
  },
  {
    name: "Priya S.",
    city: "Estero",
    stars: 5,
    text: "Membership tune-up caught a failing capacitor before summer. Booking through chat was easier than calling three other companies.",
  },
  {
    name: "Derek & Ana L.",
    city: "Bonita Springs",
    stars: 5,
    text: "Lehigh Acres friends recommended them. Same-day slot, clean work, and the tech texted ETA like a rideshare. Exactly what we needed.",
  },
];

const DEFAULT_STATS: Stat[] = [
  { value: "42 min", label: "Median emergency response" },
  { value: "4.9★", label: "Average local review score" },
  { value: "98%", label: "Same-day booking when called before 2pm" },
  { value: "12 yr", label: "Serving Southwest Florida families" },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#f59e0b" aria-hidden="true">
          <path d="M10 1.5l2.5 5.3 5.8.7-4.3 4 1.2 5.7L10 14.6l-5.2 2.6 1.2-5.7-4.3-4 5.8-.7L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Trust({
  section,
  reviews = DEFAULT_REVIEWS,
  stats = DEFAULT_STATS,
}: Props) {
  const eyebrow = section?.eyebrow ?? "Trust & proof";
  const heading = section?.heading ?? "Neighbors across Lee County already breathe easier";
  const subhead =
    section?.subhead ??
    "Plausible demo reviews and stats for pitch conversations — not live review-platform data.";

  return (
    <section id="trust" className="bg-gb-foam/40 py-20 sm:py-24" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label mx-auto mb-4">{eyebrow}</p>
          <h2 id="trust-heading" className="text-3xl font-extrabold tracking-tight text-gb-navy sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-gb-muted">{subhead}</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card px-4 py-5 text-center sm:px-5">
              <p className="stat-value text-2xl font-extrabold text-gb-teal sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-gb-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {reviews.map((r) => (
            <blockquote key={r.name} className="card flex flex-col p-6">
              <Stars count={r.stars} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gb-slate">&ldquo;{r.text}&rdquo;</p>
              <footer className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gb-teal to-gb-aqua text-xs font-bold text-white">
                  {r.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <cite className="not-italic text-sm font-semibold text-gb-navy">{r.name}</cite>
                  <p className="text-xs text-gb-muted">{r.city}, FL</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
