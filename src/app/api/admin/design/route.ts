import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonOk, jsonError } from "@/lib/admin-api";
import { writeRuntimeTheme } from "@/lib/theme";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const design = await prisma.designTokens.findUnique({ where: { id: 1 } });
  return jsonOk({ design });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body?.design) return jsonError("design object required");

  const d = body.design as Record<string, string>;
  const data = {
    navy: String(d.navy ?? "#0a2a3a"),
    deep: String(d.deep ?? "#0d3d4f"),
    teal: String(d.teal ?? "#0e7490"),
    aqua: String(d.aqua ?? "#14b8a6"),
    sky: String(d.sky ?? "#38bdf8"),
    foam: String(d.foam ?? "#e0f7fa"),
    sand: String(d.sand ?? "#f8fafc"),
    coral: String(d.coral ?? "#f97316"),
    coralDark: String(d.coralDark ?? "#ea580c"),
    slate: String(d.slate ?? "#334155"),
    muted: String(d.muted ?? "#64748b"),
  };

  const design = await prisma.designTokens.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });

  writeRuntimeTheme(data);
  return jsonOk({ ok: true, design });
}
