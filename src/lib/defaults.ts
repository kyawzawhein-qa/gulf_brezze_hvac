import type { SiteContent } from "./cms-types";

export const DEFAULT_CITIES = [
  "Fort Myers",
  "Cape Coral",
  "Bonita Springs",
  "Lehigh Acres",
  "Estero",
  "Sanibel",
  "Fort Myers Beach",
  "North Fort Myers",
];

export const DEFAULT_ZIPS = [
  "33901", "33902", "33903", "33904", "33905", "33907", "33908", "33909",
  "33912", "33913", "33914", "33916", "33917", "33919", "33920", "33921",
  "33922", "33924", "33928", "33931", "33936", "33957", "33966", "33967",
  "33971", "33972", "33973", "33974", "33975", "33976", "33990", "33991",
  "33993", "34134", "34135",
];

export const DEFAULT_CONTENT: SiteContent = {
  settings: {
    brandName: "Gulf Breeze HVAC",
    tagline: "Lee County · 24/7 Emergency",
    phone: "(239) 555-0147",
    phoneHref: "tel:+12395550147",
    serviceCities: DEFAULT_CITIES,
    demoBadgeText: "Sample / Demo Site",
    footerBlurb:
      "Sample contractor site · Fort Myers, Cape Coral, Bonita Springs, Lehigh Acres, Estero",
    heroImagePath: "",
    logoMarkPath: "/brand/logo-mark.svg",
    logoWordmarkPath: "/brand/logo-wordmark.svg",
    logoMarkWhitePath: "/brand/logo-mark-white.svg",
    logoWordmarkWhitePath: "/brand/logo-wordmark-white.svg",
    chatAvatarPath: "/ui/chat-avatar.webp",
  },
  hero: {
    eyebrow: "Average callback under 45 minutes",
    headline: "Ready for cool air again?",
    subhead:
      "Fort Myers, Cape Coral, Bonita Springs, Lehigh Acres & Estero — talk to our AI dispatcher or book a tech in minutes.",
    primaryCta: "Book Appointment",
    secondaryCta: "Chat with AI Dispatcher",
  },
  captions: [
    { id: 1, at: 0.0, text: "Blistering Florida Heat Outside? Stay 100% Cool Inside.", sortOrder: 0 },
    { id: 2, at: 0.25, text: "Engineered for Southwest Florida Humidity & Comfort.", sortOrder: 1 },
    { id: 3, at: 0.55, text: "Whisper-Quiet, Zoned Temperature Control in Every Room.", sortOrder: 2 },
    { id: 4, at: 0.85, text: "Voted Best HVAC Contractor in Lee County.", sortOrder: 3 },
  ],
  servicesSection: {
    eyebrow: "What we do",
    heading: "Full-spectrum HVAC for Lee County homes",
    subhead:
      "From midnight no-cool emergencies to planned replacements — one local team that shows up prepared.",
    areaTitle: "Service area — Lee County, Florida",
    areaSubhead: "Licensed & insured. Proudly serving coastal Southwest Florida.",
  },
  services: [
    {
      id: 1,
      title: "Emergency Repair",
      desc: "Compressor failures, frozen coils, no-cool calls — dispatched around the clock across Lee County.",
      badge: "24/7",
      iconPath: "/ui/icon-emergency.svg",
      sortOrder: 0,
    },
    {
      id: 2,
      title: "AC Replacement",
      desc: "Right-sized systems for coastal humidity. Clear quotes, financing options, and haul-away of old equipment.",
      badge: "Same-week installs",
      iconPath: "/ui/icon-replacement.svg",
      sortOrder: 1,
    },
    {
      id: 3,
      title: "Tune-Ups & Maintenance",
      desc: "Seasonal checkups that keep efficiency high before peak heat hits Fort Myers and Cape Coral.",
      badge: "Membership plans",
      iconPath: "/ui/icon-tuneup.svg",
      sortOrder: 2,
    },
    {
      id: 4,
      title: "Indoor Air Quality",
      desc: "Filtration, UV, and humidity control for mold-prone Gulf Coast homes and allergy season.",
      badge: "Healthier air",
      iconPath: "/ui/icon-iaq.svg",
      sortOrder: 3,
    },
  ],
  howSection: {
    eyebrow: "How it works",
    heading: "From chat to cool air in three calm steps",
    subhead:
      "Built for urgent Florida heat — without the chaos. This flow is the demo narrative we walk through on sales calls.",
  },
  howSteps: [
    {
      id: 1,
      title: "24/7 AI dispatcher",
      body: "Chat or call anytime. Our demo AI confirms your Lee County zip, understands the issue, and gathers contact details — no hold music.",
      detail: "Mocked client-side · no external AI APIs",
      sortOrder: 0,
    },
    {
      id: 2,
      title: "Book a real-feel slot",
      body: "Pick from same-day or next-day appointment windows. The demo shows confirmation instantly so sales pitches feel tangible.",
      detail: "Fake calendar slots for pitch demos",
      sortOrder: 1,
    },
    {
      id: 3,
      title: "Tech SMS alert",
      body: 'In production, your assigned technician gets an SMS with address and issue notes. Here we simulate the "tech notified" moment.',
      detail: "Narrative only · no Twilio in this sample",
      sortOrder: 2,
    },
  ],
  trustSection: {
    eyebrow: "Trust & proof",
    heading: "Neighbors across Lee County already breathe easier",
    subhead:
      "Plausible demo reviews and stats for pitch conversations — not live review-platform data.",
  },
  reviews: [
    {
      id: 1,
      name: "Maria G.",
      city: "Cape Coral",
      stars: 5,
      text: "AC died at 9pm on a 94° day. Gulf Breeze’s dispatcher had a tech at our door by 10:15. Kids were finally able to sleep.",
      sortOrder: 0,
    },
    {
      id: 2,
      name: "James R.",
      city: "Fort Myers",
      stars: 5,
      text: "Straight talk on replacement vs repair. They saved us from overbuying a unit we didn’t need. Solid, premium feel without the pressure.",
      sortOrder: 1,
    },
    {
      id: 3,
      name: "Priya S.",
      city: "Estero",
      stars: 5,
      text: "Membership tune-up caught a failing capacitor before summer. Booking through chat was easier than calling three other companies.",
      sortOrder: 2,
    },
    {
      id: 4,
      name: "Derek & Ana L.",
      city: "Bonita Springs",
      stars: 5,
      text: "Lehigh Acres friends recommended them. Same-day slot, clean work, and the tech texted ETA like a rideshare. Exactly what we needed.",
      sortOrder: 3,
    },
  ],
  heroStats: [
    { id: 1, value: "42 min", label: "Avg. response", group: "hero", sortOrder: 0 },
    { id: 2, value: "4,800+", label: "Lee County jobs", group: "hero", sortOrder: 1 },
    { id: 3, value: "Today", label: "Same-day slots", group: "hero", sortOrder: 2 },
  ],
  trustStats: [
    { id: 4, value: "42 min", label: "Median emergency response", group: "trust", sortOrder: 0 },
    { id: 5, value: "4.9★", label: "Average local review score", group: "trust", sortOrder: 1 },
    { id: 6, value: "98%", label: "Same-day booking when called before 2pm", group: "trust", sortOrder: 2 },
    { id: 7, value: "12 yr", label: "Serving Southwest Florida families", group: "trust", sortOrder: 3 },
  ],
  finalCta: {
    eyebrow: "Ready when you are",
    heading: "Don't wait out another Florida afternoon without AC",
    body: "Book a slot, chat with the demo AI dispatcher, or call our sample line. Perfect for walking a prospect through the Gulf Breeze experience.",
    primaryBtn: "Open AI Chat",
    secondaryBtn: "Call",
    tertiaryBtn: "Back to top",
    footnote: "Demo only — bookings, SMS, and phone routing are simulated for sales pitches.",
  },
  chat: {
    welcomeText:
      "Hi — I'm the Gulf Breeze AI dispatcher (demo). I can help book emergency AC service in Lee County, FL. Ready?",
    validZips: DEFAULT_ZIPS,
    launcherLabel: "24/7 Chat",
    issues: [
      { id: "no-cool", label: "No cool / warm air", sortOrder: 0 },
      { id: "frozen", label: "Frozen coil / ice", sortOrder: 1 },
      { id: "noise", label: "Strange noise", sortOrder: 2 },
      { id: "leak", label: "Water leak", sortOrder: 3 },
      { id: "tuneup", label: "Tune-up / maintenance", sortOrder: 4 },
      { id: "replace", label: "Replacement quote", sortOrder: 5 },
    ],
    slots: [
      { id: "today-230", label: "Today · 2:30 PM", note: "Emergency priority", sortOrder: 0 },
      { id: "today-530", label: "Today · 5:30 PM", note: "Same-day", sortOrder: 1 },
      { id: "tom-9", label: "Tomorrow · 9:00 AM", note: "Morning window", sortOrder: 2 },
      { id: "tom-1", label: "Tomorrow · 1:00 PM", note: "Afternoon", sortOrder: 3 },
    ],
  },
  design: {
    navy: "#0a2a3a",
    deep: "#0d3d4f",
    teal: "#0e7490",
    aqua: "#14b8a6",
    sky: "#38bdf8",
    foam: "#e0f7fa",
    sand: "#f8fafc",
    coral: "#f97316",
    coralDark: "#ea580c",
    slate: "#334155",
    muted: "#64748b",
  },
};
