import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonOk, jsonError } from "@/lib/admin-api";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [section, services, howSection, howSteps] = await Promise.all([
    prisma.servicesSection.findUnique({ where: { id: 1 } }),
    prisma.serviceItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.howSection.findUnique({ where: { id: 1 } }),
    prisma.howStep.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return jsonOk({ section, services, howSection, howSteps });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON");

  const { section, services, howSection, howSteps } = body as {
    section?: Record<string, string>;
    services?: { title: string; desc: string; badge: string; iconPath: string; sortOrder?: number }[];
    howSection?: Record<string, string>;
    howSteps?: { title: string; body: string; detail: string; sortOrder?: number }[];
  };

  if (section) {
    await prisma.servicesSection.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        eyebrow: section.eyebrow ?? "",
        heading: section.heading ?? "",
        subhead: section.subhead ?? "",
        areaTitle: section.areaTitle ?? "",
        areaSubhead: section.areaSubhead ?? "",
      },
      update: {
        ...(section.eyebrow !== undefined && { eyebrow: section.eyebrow }),
        ...(section.heading !== undefined && { heading: section.heading }),
        ...(section.subhead !== undefined && { subhead: section.subhead }),
        ...(section.areaTitle !== undefined && { areaTitle: section.areaTitle }),
        ...(section.areaSubhead !== undefined && { areaSubhead: section.areaSubhead }),
      },
    });
  }

  if (Array.isArray(services)) {
    await prisma.$transaction([
      prisma.serviceItem.deleteMany({}),
      prisma.serviceItem.createMany({
        data: services.map((s, i) => ({
          title: String(s.title ?? ""),
          desc: String(s.desc ?? ""),
          badge: String(s.badge ?? ""),
          iconPath: String(s.iconPath ?? ""),
          sortOrder: s.sortOrder ?? i,
        })),
      }),
    ]);
  }

  if (howSection) {
    await prisma.howSection.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        eyebrow: howSection.eyebrow ?? "",
        heading: howSection.heading ?? "",
        subhead: howSection.subhead ?? "",
      },
      update: {
        ...(howSection.eyebrow !== undefined && { eyebrow: howSection.eyebrow }),
        ...(howSection.heading !== undefined && { heading: howSection.heading }),
        ...(howSection.subhead !== undefined && { subhead: howSection.subhead }),
      },
    });
  }

  if (Array.isArray(howSteps)) {
    await prisma.$transaction([
      prisma.howStep.deleteMany({}),
      prisma.howStep.createMany({
        data: howSteps.map((s, i) => ({
          title: String(s.title ?? ""),
          body: String(s.body ?? ""),
          detail: String(s.detail ?? ""),
          sortOrder: s.sortOrder ?? i,
        })),
      }),
    ]);
  }

  return jsonOk({ ok: true });
}
