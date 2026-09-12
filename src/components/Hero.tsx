"use client";

type Stat = { value: string; label: string };

type Props = {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  primaryCta?: string;
  secondaryCta?: string;
  stats?: Stat[];
};

export default function Hero({
  eyebrow = "Average callback under 45 minutes",
  headline = "Ready for cool air again?",
  subhead = "Fort Myers, Cape Coral, Bonita Springs, Lehigh Acres & Estero — talk to our AI dispatcher or book a tech in minutes.",
  primaryCta = "Book Appointment",
  secondaryCta = "Chat with AI Dispatcher",
  stats = [
    { label: "Avg. response", value: "42 min" },
    { label: "Lee County jobs", value: "4,800+" },
    { label: "Same-day slots", value: "Today" },
  ],
}: Props) {
  return (
    <section
      id="story"
      className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-gb-navy via-gb-deep to-gb-sand pb-16 pt-12 sm:pb-20 sm:pt-14"
      aria-labelledby="hero-cta-heading"
    >
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:text-left">
        <div className="max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/80">
            {eyebrow}
          </p>
          <h2
            id="hero-cta-heading"
            className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
          >
            {headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-sky-100/85 sm:text-base">
            {subhead}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-end">
          <a href="#book" className="btn-primary focus-ring">
            {primaryCta}
          </a>
          <button
            type="button"
            className="btn-secondary focus-ring"
            onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
          >
            {secondaryCta}
          </button>
        </div>
      </div>

      <dl className="relative mx-auto mt-10 grid max-w-6xl grid-cols-3 gap-4 px-4 sm:px-6 lg:max-w-xl lg:ml-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center lg:text-left">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-sky-200/70">
              {s.label}
            </dt>
            <dd className="stat-value mt-1 text-lg font-bold text-white sm:text-xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
