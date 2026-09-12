"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  brandName?: string;
  tagline?: string;
  phone?: string;
  phoneHref?: string;
  logoMarkWhitePath?: string;
  logoWordmarkWhitePath?: string;
};

export default function Header({
  brandName = "Gulf Breeze HVAC",
  tagline = "Lee County · 24/7 Emergency",
  phone = "(239) 555-0147",
  phoneHref = "tel:+12395550147",
  logoMarkWhitePath = "/brand/logo-mark-white.svg",
  logoWordmarkWhitePath = "/brand/logo-wordmark-white.svg",
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { href: "#top", label: "Story" },
    { href: "#services", label: "Services" },
    { href: "#how", label: "How It Works" },
    { href: "#trust", label: "Reviews" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gb-navy/90 backdrop-blur-md shadow-lg shadow-black/10 py-2"
          : "bg-gb-navy/25 backdrop-blur-sm py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="focus-ring group flex items-center gap-2.5 rounded-lg">
          <Image
            src={logoMarkWhitePath}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 md:hidden"
            priority
          />
          <Image
            src={logoWordmarkWhitePath}
            alt={brandName}
            width={168}
            height={36}
            className="hidden h-9 w-auto md:block"
            priority
          />
          <span className="leading-tight md:hidden">
            <span className="block text-sm font-bold text-white">{brandName}</span>
            <span className="hidden text-[10px] font-medium text-sky-200/80 sm:block">
              {tagline}
            </span>
          </span>
          <span className="hidden text-[10px] font-medium text-sky-200/80 lg:block">
            {tagline}
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring rounded text-sm font-medium text-sky-100/90 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={phoneHref}
            className="focus-ring hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/15 sm:inline-flex"
          >
            <span className="pulse-dot" aria-hidden="true" />
            {phone}
          </a>
          <a href="#book" className="btn-primary focus-ring !px-3 !py-2 text-sm sm:!px-4">
            Book Now
          </a>
          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-white/10 bg-gb-navy/98 px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="focus-ring block rounded-lg px-3 py-2.5 text-sm font-medium text-sky-100 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={phoneHref}
                className="focus-ring mt-2 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                <span className="pulse-dot" /> Call {phone}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
