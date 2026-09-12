import { readdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonOk, jsonError } from "@/lib/admin-api";
import { readFileSync, writeFileSync } from "fs";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  let scrollFrames: string[] = [];
  const seqDir = join(process.cwd(), "public", "scroll", "sequence");
  if (existsSync(seqDir)) {
    const files = await readdir(seqDir);
    scrollFrames = files
      .filter((f) => /^frame_\d+\.webp$/i.test(f))
      .sort()
      .map((f) => `/scroll/sequence/${f}`);
  }

  return jsonOk({ assets, settings, scrollFrames, scrollFrameCount: scrollFrames.length });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const path = body?.path as string | undefined;
  if (!path || !path.startsWith("/uploads/")) {
    return jsonError("Only /uploads/ assets can be deleted this way");
  }
  const abs = join(process.cwd(), "public", path.replace(/^\//, ""));
  if (existsSync(abs)) await unlink(abs);
  await prisma.mediaAsset.deleteMany({ where: { path } });
  return jsonOk({ ok: true });
}

/** Rebuild sequence manifest frames list from disk */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  if (body?.action !== "rebuild-manifest") {
    return jsonError("Unknown action");
  }

  const seqDir = join(process.cwd(), "public", "scroll", "sequence");
  const manifestPath = join(seqDir, "manifest.json");
  if (!existsSync(seqDir)) return jsonError("sequence dir missing");

  const files = (await readdir(seqDir))
    .filter((f) => /^frame_\d+\.webp$/i.test(f))
    .sort((a, b) => {
      const na = Number(a.match(/\d+/)?.[0] || 0);
      const nb = Number(b.match(/\d+/)?.[0] || 0);
      return na - nb;
    });

  const frames = files.map((f) => `/scroll/sequence/${f}`);
  let raw: Record<string, unknown> = {};
  if (existsSync(manifestPath)) {
    raw = JSON.parse(readFileSync(manifestPath, "utf8"));
  }
  raw.frames = frames;
  raw.frameCount = frames.length;
  writeFileSync(manifestPath, JSON.stringify(raw, null, 2) + "\n");
  return jsonOk({ ok: true, frameCount: frames.length });
}
