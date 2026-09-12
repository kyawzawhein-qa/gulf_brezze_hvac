import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

const CITIES = [
  "Fort Myers",
  "Cape Coral",
  "Bonita Springs",
  "Lehigh Acres",
  "Estero",
  "Sanibel",
  "Fort Myers Beach",
  "North Fort Myers",
];

const ZIPS =
  "33901,33902,33903,33904,33905,33907,33908,33909,33912,33913,33914,33916,33917,33919,33920,33921,33922,33924,33928,33931,33936,33957,33966,33967,33971,33972,33973,33974,33975,33976,33990,33991,33993,34134,34135";

const CAPTIONS = [
  { at: 0.0, text: "Blistering Florida Heat Outside? Stay 100% Cool Inside.", sortOrder: 0 },
  { at: 0.25, text: "Engineered for Southwest Florida Humidity & Comfort.", sortOrder: 1 },
  { at: 0.55, text: "Whisper-Quiet, Zoned Temperature Control in Every Room.", sortOrder: 2 },
  { at: 0.85, text: "Voted Best HVAC Contractor in Lee County.", sortOrder: 3 },
];

const SERVICES = [
  {
    title: "Emergency Repair",
    desc: "Compressor failures, frozen coils, no-cool calls — dispatched around the clock across Lee County.",
    iconPath: "/ui/icon-emergency.svg",
    badge: "24/7",
    sortOrder: 0,
  },
  {
    title: "AC Replacement",
    desc: "Right-sized systems for coastal humidity. Clear quotes, financing options, and haul-away of old equipment.",
    iconPath: "/ui/icon-replacement.svg",
    badge: "Same-week installs",
    sortOrder: 1,
  },
  {
    title: "Tune-Ups & Maintenance",
    desc: "Seasonal checkups that keep efficiency high before peak heat hits Fort Myers and Cape Coral.",
    iconPath: "/ui/icon-tuneup.svg",
    badge: "Membership plans",
    sortOrder: 2,
  },
  {
    title: "Indoor Air Quality",
    desc: "Filtration, UV, and humidity control for mold-prone Gulf Coast homes and allergy season.",
    iconPath: "/ui/icon-iaq.svg",
    badge: "Healthier air",
    sortOrder: 3,
  },
];

const STEPS = [
  {
    title: "24/7 AI dispatcher",
    body: "Chat or call anytime. Our demo AI confirms your Lee County zip, understands the issue, and gathers contact details — no hold music.",
    detail: "Mocked client-side · no external AI APIs",
    sortOrder: 0,
  },
  {
    title: "Book a real-feel slot",
    body: "Pick from same-day or next-day appointment windows. The demo shows confirmation instantly so sales pitches feel tangible.",
    detail: "Fake calendar slots for pitch demos",
    sortOrder: 1,
  },
  {
    title: "Tech SMS alert",
    body: "In production, your assigned technician gets an SMS with address and issue notes. Here we simulate the “tech notified” moment.",
    detail: "Narrative only · no Twilio in this sample",
    sortOrder: 2,
  },
];

const REVIEWS = [
  {
    name: "Maria G.",
    city: "Cape Coral",
    stars: 5,
    text: "AC died at 9pm on a 94° day. Gulf Breeze’s dispatcher had a tech at our door by 10:15. Kids were finally able to sleep.",
    sortOrder: 0,
  },
  {
    name: "James R.",
    city: "Fort Myers",
    stars: 5,
    text: "Straight talk on replacement vs repair. They saved us from overbuying a unit we didn’t need. Solid, premium feel without the pressure.",
    sortOrder: 1,
  },
  {
    name: "Priya S.",
    city: "Estero",
    stars: 5,
    text: "Membership tune-up caught a failing capacitor before summer. Booking through chat was easier than calling three other companies.",
    sortOrder: 2,
  },
  {
    name: "Derek & Ana L.",
    city: "Bonita Springs",
    stars: 5,
    text: "Lehigh Acres friends recommended them. Same-day slot, clean work, and the tech texted ETA like a rideshare. Exactly what we needed.",
    sortOrder: 3,
  },
];

const HERO_STATS = [
  { value: "42 min", label: "Avg. response", group: "hero", sortOrder: 0 },
  { value: "4,800+", label: "Lee County jobs", group: "hero", sortOrder: 1 },
  { value: "Today", label: "Same-day slots", group: "hero", sortOrder: 2 },
];

const TRUST_STATS = [
  { value: "42 min", label: "Median emergency response", group: "trust", sortOrder: 0 },
  { value: "4.9★", label: "Average local review score", group: "trust", sortOrder: 1 },
  { value: "98%", label: "Same-day booking when called before 2pm", group: "trust", sortOrder: 2 },
  { value: "12 yr", label: "Serving Southwest Florida families", group: "trust", sortOrder: 3 },
];

const ISSUES = [
  { id: "no-cool", label: "No cool / warm air", sortOrder: 0 },
  { id: "frozen", label: "Frozen coil / ice", sortOrder: 1 },
  { id: "noise", label: "Strange noise", sortOrder: 2 },
  { id: "leak", label: "Water leak", sortOrder: 3 },
  { id: "tuneup", label: "Tune-up / maintenance", sortOrder: 4 },
  { id: "replace", label: "Replacement quote", sortOrder: 5 },
];

const SLOTS = [
  { id: "today-230", label: "Today · 2:30 PM", note: "Emergency priority", sortOrder: 0 },
  { id: "today-530", label: "Today · 5:30 PM", note: "Same-day", sortOrder: 1 },
  { id: "tom-9", label: "Tomorrow · 9:00 AM", note: "Morning window", sortOrder: 2 },
  { id: "tom-1", label: "Tomorrow · 1:00 PM", note: "Afternoon", sortOrder: 3 },
];

const TOKENS = {
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
};

function writeRuntimeTheme() {
  const dir = join(process.cwd(), "public", "brand");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "runtime-theme.json"),
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        tokens: {
          "gb-navy": TOKENS.navy,
          "gb-deep": TOKENS.deep,
          "gb-teal": TOKENS.teal,
          "gb-aqua": TOKENS.aqua,
          "gb-sky": TOKENS.sky,
          "gb-foam": TOKENS.foam,
          "gb-sand": TOKENS.sand,
          "gb-coral": TOKENS.coral,
          "gb-coral-dark": TOKENS.coralDark,
          "gb-slate": TOKENS.slate,
          "gb-muted": TOKENS.muted,
        },
      },
      null,
      2
    )
  );
}

function syncCaptionsToManifest() {
  const manifestPath = join(process.cwd(), "public", "scroll", "sequence", "manifest.json");
  if (!existsSync(manifestPath)) return;
  const raw = JSON.parse(require("fs").readFileSync(manifestPath, "utf8"));
  raw.captions = CAPTIONS.map((c, i) => {
    const existing = Array.isArray(raw.captions) ? raw.captions[i] : null;
    return {
      at: c.at,
      text: c.text,
      ...(existing?.frames ? { frames: existing.frames } : {}),
    };
  });
  require("fs").writeFileSync(manifestPath, JSON.stringify(raw, null, 2) + "\n");
}

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      brandName: "Gulf Breeze HVAC",
      tagline: "Lee County · 24/7 Emergency",
      phone: "(239) 555-0147",
      phoneHref: "tel:+12395550147",
      serviceCities: JSON.stringify(CITIES),
      demoBadgeText: "Sample / Demo Site",
      footerBlurb:
        "Sample contractor site · Fort Myers, Cape Coral, Bonita Springs, Lehigh Acres, Estero",
      logoMarkPath: "/brand/logo-mark.svg",
      logoWordmarkPath: "/brand/logo-wordmark.svg",
      logoMarkWhitePath: "/brand/logo-mark-white.svg",
      logoWordmarkWhitePath: "/brand/logo-wordmark-white.svg",
      chatAvatarPath: "/ui/chat-avatar.webp",
    },
    update: {},
  });

  await prisma.heroContent.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });

  await prisma.servicesSection.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });

  await prisma.howSection.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });

  await prisma.trustSection.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });

  await prisma.finalCta.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });

  await prisma.chatSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      welcomeText:
        "Hi — I'm the Gulf Breeze AI dispatcher (demo). I can help book emergency AC service in Lee County, FL. Ready?",
      validZips: ZIPS,
      launcherLabel: "24/7 Chat",
    },
    update: {},
  });

  await prisma.designTokens.upsert({
    where: { id: 1 },
    create: { id: 1, ...TOKENS },
    update: {},
  });

  const captionCount = await prisma.storyCaption.count();
  if (captionCount === 0) {
    await prisma.storyCaption.createMany({ data: CAPTIONS });
  }

  const serviceCount = await prisma.serviceItem.count();
  if (serviceCount === 0) {
    await prisma.serviceItem.createMany({ data: SERVICES });
  }

  const stepCount = await prisma.howStep.count();
  if (stepCount === 0) {
    await prisma.howStep.createMany({ data: STEPS });
  }

  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    await prisma.review.createMany({ data: REVIEWS });
  }

  const statCount = await prisma.stat.count();
  if (statCount === 0) {
    await prisma.stat.createMany({ data: [...HERO_STATS, ...TRUST_STATS] });
  }

  const issueCount = await prisma.chatIssue.count();
  if (issueCount === 0) {
    await prisma.chatIssue.createMany({ data: ISSUES });
  }

  const slotCount = await prisma.chatSlot.count();
  if (slotCount === 0) {
    await prisma.chatSlot.createMany({ data: SLOTS });
  }

  writeRuntimeTheme();
  syncCaptionsToManifest();

  console.log("Seed complete: site content + runtime theme written.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
