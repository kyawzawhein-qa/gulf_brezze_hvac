import { prisma } from "./prisma";
import { DEFAULT_CONTENT, DEFAULT_CITIES, DEFAULT_ZIPS } from "./defaults";
import type { SiteContent } from "./cms-types";
import { writeRuntimeTheme } from "./theme";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

function parseCities(raw: string | null | undefined): string[] {
  if (!raw) return DEFAULT_CITIES;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      return parsed;
    }
  } catch {
    /* fall through */
  }
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseZips(raw: string | null | undefined): string[] {
  if (!raw) return DEFAULT_ZIPS;
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const [
      settings,
      hero,
      captions,
      servicesSection,
      services,
      howSection,
      howSteps,
      trustSection,
      reviews,
      stats,
      finalCta,
      chatSettings,
      issues,
      slots,
      design,
    ] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 1 } }),
      prisma.heroContent.findUnique({ where: { id: 1 } }),
      prisma.storyCaption.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.servicesSection.findUnique({ where: { id: 1 } }),
      prisma.serviceItem.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.howSection.findUnique({ where: { id: 1 } }),
      prisma.howStep.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.trustSection.findUnique({ where: { id: 1 } }),
      prisma.review.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.stat.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.finalCta.findUnique({ where: { id: 1 } }),
      prisma.chatSettings.findUnique({ where: { id: 1 } }),
      prisma.chatIssue.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.chatSlot.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.designTokens.findUnique({ where: { id: 1 } }),
    ]);

    if (!settings) return DEFAULT_CONTENT;

    const heroStats = stats.filter((s) => s.group === "hero");
    const trustStats = stats.filter((s) => s.group === "trust");

    return {
      settings: {
        brandName: settings.brandName,
        tagline: settings.tagline,
        phone: settings.phone,
        phoneHref: settings.phoneHref,
        serviceCities: parseCities(settings.serviceCities),
        demoBadgeText: settings.demoBadgeText,
        footerBlurb: settings.footerBlurb,
        heroImagePath: settings.heroImagePath,
        logoMarkPath: settings.logoMarkPath,
        logoWordmarkPath: settings.logoWordmarkPath,
        logoMarkWhitePath: settings.logoMarkWhitePath,
        logoWordmarkWhitePath: settings.logoWordmarkWhitePath,
        chatAvatarPath: settings.chatAvatarPath,
      },
      hero: hero
        ? {
            eyebrow: hero.eyebrow,
            headline: hero.headline,
            subhead: hero.subhead,
            primaryCta: hero.primaryCta,
            secondaryCta: hero.secondaryCta,
          }
        : DEFAULT_CONTENT.hero,
      captions: captions.length
        ? captions.map((c) => ({
            id: c.id,
            at: c.at,
            text: c.text,
            sortOrder: c.sortOrder,
          }))
        : DEFAULT_CONTENT.captions,
      servicesSection: servicesSection
        ? {
            eyebrow: servicesSection.eyebrow,
            heading: servicesSection.heading,
            subhead: servicesSection.subhead,
            areaTitle: servicesSection.areaTitle,
            areaSubhead: servicesSection.areaSubhead,
          }
        : DEFAULT_CONTENT.servicesSection,
      services: services.length
        ? services.map((s) => ({
            id: s.id,
            title: s.title,
            desc: s.desc,
            badge: s.badge,
            iconPath: s.iconPath,
            sortOrder: s.sortOrder,
          }))
        : DEFAULT_CONTENT.services,
      howSection: howSection
        ? {
            eyebrow: howSection.eyebrow,
            heading: howSection.heading,
            subhead: howSection.subhead,
          }
        : DEFAULT_CONTENT.howSection,
      howSteps: howSteps.length
        ? howSteps.map((s) => ({
            id: s.id,
            title: s.title,
            body: s.body,
            detail: s.detail,
            sortOrder: s.sortOrder,
          }))
        : DEFAULT_CONTENT.howSteps,
      trustSection: trustSection
        ? {
            eyebrow: trustSection.eyebrow,
            heading: trustSection.heading,
            subhead: trustSection.subhead,
          }
        : DEFAULT_CONTENT.trustSection,
      reviews: reviews.length
        ? reviews.map((r) => ({
            id: r.id,
            name: r.name,
            city: r.city,
            text: r.text,
            stars: r.stars,
            sortOrder: r.sortOrder,
          }))
        : DEFAULT_CONTENT.reviews,
      heroStats: heroStats.length
        ? heroStats.map((s) => ({
            id: s.id,
            value: s.value,
            label: s.label,
            group: s.group,
            sortOrder: s.sortOrder,
          }))
        : DEFAULT_CONTENT.heroStats,
      trustStats: trustStats.length
        ? trustStats.map((s) => ({
            id: s.id,
            value: s.value,
            label: s.label,
            group: s.group,
            sortOrder: s.sortOrder,
          }))
        : DEFAULT_CONTENT.trustStats,
      finalCta: finalCta
        ? {
            eyebrow: finalCta.eyebrow,
            heading: finalCta.heading,
            body: finalCta.body,
            primaryBtn: finalCta.primaryBtn,
            secondaryBtn: finalCta.secondaryBtn,
            tertiaryBtn: finalCta.tertiaryBtn,
            footnote: finalCta.footnote,
          }
        : DEFAULT_CONTENT.finalCta,
      chat: {
        welcomeText: chatSettings?.welcomeText ?? DEFAULT_CONTENT.chat.welcomeText,
        validZips: parseZips(chatSettings?.validZips),
        launcherLabel: chatSettings?.launcherLabel ?? DEFAULT_CONTENT.chat.launcherLabel,
        issues: issues.length
          ? issues.map((i) => ({ id: i.id, label: i.label, sortOrder: i.sortOrder }))
          : DEFAULT_CONTENT.chat.issues,
        slots: slots.length
          ? slots.map((s) => ({
              id: s.id,
              label: s.label,
              note: s.note,
              sortOrder: s.sortOrder,
            }))
          : DEFAULT_CONTENT.chat.slots,
      },
      design: design
        ? {
            navy: design.navy,
            deep: design.deep,
            teal: design.teal,
            aqua: design.aqua,
            sky: design.sky,
            foam: design.foam,
            sand: design.sand,
            coral: design.coral,
            coralDark: design.coralDark,
            slate: design.slate,
            muted: design.muted,
          }
        : DEFAULT_CONTENT.design,
    };
  } catch (err) {
    console.error("[cms] getSiteContent fallback", err);
    return DEFAULT_CONTENT;
  }
}

export async function syncCaptionsToManifest(
  captions: { at: number; text: string }[]
): Promise<void> {
  const manifestPath = join(process.cwd(), "public", "scroll", "sequence", "manifest.json");
  if (!existsSync(manifestPath)) return;
  try {
    const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      captions?: { at: number; text: string; frames?: number[] }[];
      [key: string]: unknown;
    };
    const prev = Array.isArray(raw.captions) ? raw.captions : [];
    raw.captions = captions.map((c, i) => ({
      at: c.at,
      text: c.text,
      ...(prev[i]?.frames ? { frames: prev[i].frames } : {}),
    }));
    writeFileSync(manifestPath, JSON.stringify(raw, null, 2) + "\n");
  } catch (err) {
    console.error("[cms] syncCaptionsToManifest failed", err);
  }
}

export { writeRuntimeTheme };
