import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonOk, jsonError } from "@/lib/admin-api";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const hero = await prisma.heroContent.findUnique({ where: { id: 1 } });
  const finalCta = await prisma.finalCta.findUnique({ where: { id: 1 } });
  return jsonOk({ settings, hero, finalCta });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON");

  const { settings, hero, finalCta } = body as {
    settings?: Record<string, unknown>;
    hero?: Record<string, unknown>;
    finalCta?: Record<string, unknown>;
  };

  if (settings) {
    const cities = settings.serviceCities;
    const serviceCities =
      typeof cities === "string"
        ? cities
        : Array.isArray(cities)
          ? JSON.stringify(cities)
          : undefined;

    await prisma.siteSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        brandName: String(settings.brandName ?? "Gulf Breeze HVAC"),
        tagline: String(settings.tagline ?? ""),
        phone: String(settings.phone ?? ""),
        phoneHref: String(settings.phoneHref ?? ""),
        serviceCities: serviceCities ?? "[]",
        demoBadgeText: String(settings.demoBadgeText ?? ""),
        footerBlurb: String(settings.footerBlurb ?? ""),
        heroImagePath: String(settings.heroImagePath ?? ""),
        logoMarkPath: String(settings.logoMarkPath ?? "/brand/logo-mark.svg"),
        logoWordmarkPath: String(settings.logoWordmarkPath ?? "/brand/logo-wordmark.svg"),
        logoMarkWhitePath: String(settings.logoMarkWhitePath ?? "/brand/logo-mark-white.svg"),
        logoWordmarkWhitePath: String(
          settings.logoWordmarkWhitePath ?? "/brand/logo-wordmark-white.svg"
        ),
        chatAvatarPath: String(settings.chatAvatarPath ?? "/ui/chat-avatar.webp"),
      },
      update: {
        ...(settings.brandName !== undefined && { brandName: String(settings.brandName) }),
        ...(settings.tagline !== undefined && { tagline: String(settings.tagline) }),
        ...(settings.phone !== undefined && { phone: String(settings.phone) }),
        ...(settings.phoneHref !== undefined && { phoneHref: String(settings.phoneHref) }),
        ...(serviceCities !== undefined && { serviceCities }),
        ...(settings.demoBadgeText !== undefined && {
          demoBadgeText: String(settings.demoBadgeText),
        }),
        ...(settings.footerBlurb !== undefined && { footerBlurb: String(settings.footerBlurb) }),
        ...(settings.heroImagePath !== undefined && {
          heroImagePath: String(settings.heroImagePath),
        }),
        ...(settings.logoMarkPath !== undefined && { logoMarkPath: String(settings.logoMarkPath) }),
        ...(settings.logoWordmarkPath !== undefined && {
          logoWordmarkPath: String(settings.logoWordmarkPath),
        }),
        ...(settings.logoMarkWhitePath !== undefined && {
          logoMarkWhitePath: String(settings.logoMarkWhitePath),
        }),
        ...(settings.logoWordmarkWhitePath !== undefined && {
          logoWordmarkWhitePath: String(settings.logoWordmarkWhitePath),
        }),
        ...(settings.chatAvatarPath !== undefined && {
          chatAvatarPath: String(settings.chatAvatarPath),
        }),
      },
    });
  }

  if (hero) {
    await prisma.heroContent.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        eyebrow: String(hero.eyebrow ?? ""),
        headline: String(hero.headline ?? ""),
        subhead: String(hero.subhead ?? ""),
        primaryCta: String(hero.primaryCta ?? ""),
        secondaryCta: String(hero.secondaryCta ?? ""),
      },
      update: {
        ...(hero.eyebrow !== undefined && { eyebrow: String(hero.eyebrow) }),
        ...(hero.headline !== undefined && { headline: String(hero.headline) }),
        ...(hero.subhead !== undefined && { subhead: String(hero.subhead) }),
        ...(hero.primaryCta !== undefined && { primaryCta: String(hero.primaryCta) }),
        ...(hero.secondaryCta !== undefined && { secondaryCta: String(hero.secondaryCta) }),
      },
    });
  }

  if (finalCta) {
    await prisma.finalCta.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        eyebrow: String(finalCta.eyebrow ?? ""),
        heading: String(finalCta.heading ?? ""),
        body: String(finalCta.body ?? ""),
        primaryBtn: String(finalCta.primaryBtn ?? ""),
        secondaryBtn: String(finalCta.secondaryBtn ?? ""),
        tertiaryBtn: String(finalCta.tertiaryBtn ?? ""),
        footnote: String(finalCta.footnote ?? ""),
      },
      update: {
        ...(finalCta.eyebrow !== undefined && { eyebrow: String(finalCta.eyebrow) }),
        ...(finalCta.heading !== undefined && { heading: String(finalCta.heading) }),
        ...(finalCta.body !== undefined && { body: String(finalCta.body) }),
        ...(finalCta.primaryBtn !== undefined && { primaryBtn: String(finalCta.primaryBtn) }),
        ...(finalCta.secondaryBtn !== undefined && {
          secondaryBtn: String(finalCta.secondaryBtn),
        }),
        ...(finalCta.tertiaryBtn !== undefined && { tertiaryBtn: String(finalCta.tertiaryBtn) }),
        ...(finalCta.footnote !== undefined && { footnote: String(finalCta.footnote) }),
      },
    });
  }

  return jsonOk({ ok: true });
}
