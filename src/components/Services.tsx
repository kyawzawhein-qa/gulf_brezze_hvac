type Service = {
  title: string;
  desc: string;
  badge: string;
  iconPath: string;
};

type Section = {
  eyebrow?: string;
  heading?: string;
  subhead?: string;
  areaTitle?: string;
  areaSubhead?: string;
};

type Props = {
  section?: Section;
  services?: Service[];
  cities?: string[];
};

const DEFAULT_SERVICES: Service[] = [
  {
    title: "Emergency Repair",
    desc: "Compressor failures, frozen coils, no-cool calls — dispatched around the clock across Lee County.",
    iconPath: "/ui/icon-emergency.svg",
    badge: "24/7",
  },
  {
    title: "AC Replacement",
    desc: "Right-sized systems for coastal humidity. Clear quotes, financing options, and haul-away of old equipment.",
    iconPath: "/ui/icon-replacement.svg",
    badge: "Same-week installs",
  },
  {
    title: "Tune-Ups & Maintenance",
    desc: "Seasonal checkups that keep efficiency high before peak heat hits Fort Myers and Cape Coral.",
    iconPath: "/ui/icon-tuneup.svg",
    badge: "Membership plans",
  },
  {
    title: "Indoor Air Quality",
    desc: "Filtration, UV, and humidity control for mold-prone Gulf Coast homes and allergy season.",
    iconPath: "/ui/icon-iaq.svg",
    badge: "Healthier air",
  },
];

const DEFAULT_CITIES = [
  "Fort Myers",
  "Cape Coral",
  "Bonita Springs",
  "Lehigh Acres",
  "Estero",
  "Sanibel",
  "Fort Myers Beach",
  "North Fort Myers",
];

export default function Services({
  section,
  services = DEFAULT_SERVICES,
  cities = DEFAULT_CITIES,
}: Props) {
  const eyebrow = section?.eyebrow ?? "What we do";
  const heading = section?.heading ?? "Full-spectrum HVAC for Lee County homes";
  const subhead =
    section?.subhead ??
    "From midnight no-cool emergencies to planned replacements — one local team that shows up prepared.";
  const areaTitle = section?.areaTitle ?? "Service area — Lee County, Florida";
  const areaSubhead =
    section?.areaSubhead ?? "Licensed & insured. Proudly serving coastal Southwest Florida.";

  return (
    <section id="services" className="bg-gb-sand py-20 sm:py-24" aria-labelledby="services-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label mx-auto mb-4">{eyebrow}</p>
          <h2 id="services-heading" className="text-3xl font-extrabold tracking-tight text-gb-navy sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-gb-muted">{subhead}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {services.map((s) => (
            <article key={s.title} className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-xl sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gb-foam to-sky-100 text-gb-teal transition group-hover:from-gb-teal group-hover:to-gb-aqua group-hover:text-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.iconPath} alt="" width={28} height={28} className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-gb-foam px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gb-teal">
                  {s.badge}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gb-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gb-muted">{s.desc}</p>
            </article>
          ))}
        </div>

        <div className="card mt-10 overflow-hidden">
          <div className="border-b border-slate-100 bg-gradient-to-r from-gb-deep to-gb-teal px-6 py-4 sm:px-8">
            <h3 className="text-lg font-bold text-white">{areaTitle}</h3>
            <p className="mt-1 text-sm text-sky-100/85">{areaSubhead}</p>
          </div>
          <ul className="flex flex-wrap gap-2 p-6 sm:p-8" aria-label="Cities we serve">
            {cities.map((city) => (
              <li
                key={city}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gb-slate shadow-sm"
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
