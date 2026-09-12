import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonOk, jsonError } from "@/lib/admin-api";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [section, reviews, stats] = await Promise.all([
    prisma.trustSection.findUnique({ where: { id: 1 } }),
    prisma.review.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.stat.findMany({ orderBy: [{ group: "asc" }, { sortOrder: "asc" }] }),
  ]);
  return jsonOk({ section, reviews, stats });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON");

  const { section, reviews, stats } = body as {
    section?: Record<string, string>;
    reviews?: { name: string; city: string; text: string; stars: number; sortOrder?: number }[];
    stats?: { value: string; label: string; group: string; sortOrder?: number }[];
  };

  if (section) {
    await prisma.trustSection.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        eyebrow: section.eyebrow ?? "",
        heading: section.heading ?? "",
        subhead: section.subhead ?? "",
      },
      update: {
        ...(section.eyebrow !== undefined && { eyebrow: section.eyebrow }),
        ...(section.heading !== undefined && { heading: section.heading }),
        ...(section.subhead !== undefined && { subhead: section.subhead }),
      },
    });
  }

  if (Array.isArray(reviews)) {
    await prisma.$transaction([
      prisma.review.deleteMany({}),
      prisma.review.createMany({
        data: reviews.map((r, i) => ({
          name: String(r.name ?? ""),
          city: String(r.city ?? ""),
          text: String(r.text ?? ""),
          stars: Math.min(5, Math.max(1, Number(r.stars) || 5)),
          sortOrder: r.sortOrder ?? i,
        })),
      }),
    ]);
  }

  if (Array.isArray(stats)) {
    await prisma.$transaction([
      prisma.stat.deleteMany({}),
      prisma.stat.createMany({
        data: stats.map((s, i) => ({
          value: String(s.value ?? ""),
          label: String(s.label ?? ""),
          group: String(s.group ?? "trust"),
          sortOrder: s.sortOrder ?? i,
        })),
      }),
    ]);
  }

  return jsonOk({ ok: true });
}
