import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonOk, jsonError } from "@/lib/admin-api";
import { syncCaptionsToManifest } from "@/lib/cms";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const captions = await prisma.storyCaption.findMany({ orderBy: { sortOrder: "asc" } });
  return jsonOk({ captions });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.captions)) return jsonError("captions array required");

  const captions = body.captions as { at: number; text: string; sortOrder?: number }[];

  await prisma.$transaction([
    prisma.storyCaption.deleteMany({}),
    prisma.storyCaption.createMany({
      data: captions.map((c, i) => ({
        at: Number(c.at) || 0,
        text: String(c.text ?? ""),
        sortOrder: c.sortOrder ?? i,
      })),
    }),
  ]);

  await syncCaptionsToManifest(
    captions.map((c) => ({ at: Number(c.at) || 0, text: String(c.text ?? "") }))
  );

  const saved = await prisma.storyCaption.findMany({ orderBy: { sortOrder: "asc" } });
  return jsonOk({ ok: true, captions: saved });
}
