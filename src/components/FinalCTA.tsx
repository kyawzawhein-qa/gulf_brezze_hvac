"use client";

type Props = {
  phone?: string;
  phoneHref?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryBtn?: string;
  secondaryBtn?: string;
  tertiaryBtn?: string;
  footnote?: string;
};

export default function FinalCTA({
  phone = "(239) 555-0147",
  phoneHref = "tel:+12395550147",
  eyebrow = "Ready when you are",
  heading = "Don't wait out another Florida afternoon without AC",
  body = "Book a slot, chat with the demo AI dispatcher, or call our sample line. Perfect for walking a prospect through the Gulf Breeze experience.",
  primaryBtn = "Open AI Chat",
  secondaryBtn = "Call",
  tertiaryBtn = "Back to top",
  footnote = "Demo only — bookings, SMS, and phone routing are simulated for sales pitches.",
}: Props) {
  return (
    <section id="book" className="relative overflow-hidden py-20 sm:py-24" aria-labelledby="cta-heading">
      <div className="absolute inset-0 bg-gradient-to-br from-gb-navy via-gb-deep to-gb-teal" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(20,184,166,0.3), transparent 35%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "url(/ui/pattern-cta.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "240px 240px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="section-label mx-auto mb-4 !bg-white/10 !text-sky-200">{eyebrow}</p>
        <h2 id="cta-heading" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sky-100/90">{body}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="btn-primary focus-ring"
            onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
          >
            {primaryBtn}
          </button>
          <a href={phoneHref} className="btn-secondary focus-ring">
            {secondaryBtn.includes(phone) ? secondaryBtn : `${secondaryBtn} ${phone}`}
          </a>
          <a
            href="#top"
            className="focus-ring rounded-full px-4 py-2 text-sm font-semibold text-sky-100 underline-offset-4 hover:underline"
          >
            {tertiaryBtn}
          </a>
        </div>

        <p className="mt-8 text-xs text-sky-200/60">{footnote}</p>
      </div>
    </section>
  );
}
