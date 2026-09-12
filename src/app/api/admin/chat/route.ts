import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonOk, jsonError } from "@/lib/admin-api";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [settings, issues, slots] = await Promise.all([
    prisma.chatSettings.findUnique({ where: { id: 1 } }),
    prisma.chatIssue.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.chatSlot.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return jsonOk({ settings, issues, slots });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON");

  const { settings, issues, slots } = body as {
    settings?: { welcomeText?: string; validZips?: string | string[]; launcherLabel?: string };
    issues?: { id: string; label: string; sortOrder?: number }[];
    slots?: { id: string; label: string; note: string; sortOrder?: number }[];
  };

  if (settings) {
    let zips: string | undefined;
    const rawZips: unknown = settings.validZips;
    if (typeof rawZips === "string") zips = rawZips;
    else if (Array.isArray(rawZips)) zips = rawZips.map(String).join(",");

    await prisma.chatSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        welcomeText: settings.welcomeText ?? "",
        validZips: zips ?? "",
        launcherLabel: settings.launcherLabel ?? "24/7 Chat",
      },
      update: {
        ...(settings.welcomeText !== undefined && { welcomeText: settings.welcomeText }),
        ...(zips !== undefined && { validZips: zips }),
        ...(settings.launcherLabel !== undefined && { launcherLabel: settings.launcherLabel }),
      },
    });
  }

  if (Array.isArray(issues)) {
    await prisma.$transaction([
      prisma.chatIssue.deleteMany({}),
      prisma.chatIssue.createMany({
        data: issues.map((i, idx) => ({
          id: String(i.id || `issue-${idx}`).replace(/\s+/g, "-").toLowerCase(),
          label: String(i.label ?? ""),
          sortOrder: i.sortOrder ?? idx,
        })),
      }),
    ]);
  }

  if (Array.isArray(slots)) {
    await prisma.$transaction([
      prisma.chatSlot.deleteMany({}),
      prisma.chatSlot.createMany({
        data: slots.map((s, idx) => ({
          id: String(s.id || `slot-${idx}`).replace(/\s+/g, "-").toLowerCase(),
          label: String(s.label ?? ""),
          note: String(s.note ?? ""),
          sortOrder: s.sortOrder ?? idx,
        })),
      }),
    ]);
  }

  return jsonOk({ ok: true });
}
