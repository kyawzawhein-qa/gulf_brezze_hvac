import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, extname } from "path";
import { requireAdmin, jsonOk, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await req.formData();
  const file = form.get("file");
  const target = String(form.get("target") || "uploads"); // uploads | scroll | brand | ui

  if (!(file instanceof File)) return jsonError("file required");

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > 25 * 1024 * 1024) return jsonError("File too large (max 25MB)");

  const orig = safeName(file.name || "upload.bin");
  const ext = extname(orig) || ".bin";
  const stamp = Date.now();

  let relDir = "uploads";
  let publicPath = "";
  let filename = `${stamp}-${orig}`;

  if (target === "scroll") {
    relDir = "scroll/sequence";
    // allow replacing a named frame: frame_001.webp
    const frameName = String(form.get("frameName") || "");
    filename = frameName && /^frame_\d{3}\.webp$/i.test(frameName)
      ? frameName.toLowerCase()
      : `frame_upload_${stamp}${ext}`;
  } else if (target === "brand") {
    relDir = "brand";
  } else if (target === "ui") {
    relDir = "ui";
  } else {
    relDir = "uploads";
  }

  const absDir = join(process.cwd(), "public", relDir);
  if (!existsSync(absDir)) await mkdir(absDir, { recursive: true });
  const absPath = join(absDir, filename);
  await writeFile(absPath, bytes);

  publicPath = `/${relDir}/${filename}`.replace(/\\/g, "/");

  await prisma.mediaAsset.upsert({
    where: { path: publicPath },
    create: {
      path: publicPath,
      filename,
      mimeType: file.type || "application/octet-stream",
      bytes: bytes.length,
    },
    update: {
      filename,
      mimeType: file.type || "application/octet-stream",
      bytes: bytes.length,
    },
  });

  return jsonOk({ ok: true, path: publicPath, filename, bytes: bytes.length });
}
