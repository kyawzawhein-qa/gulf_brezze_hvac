"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { Card, Input, Label } from "@/components/admin/Field";
import { useSave } from "@/components/admin/useSave";

type Asset = { id: number; path: string; filename: string; bytes: number };

export default function MediaAdminPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [scrollFrameCount, setScrollFrameCount] = useState(0);
  const [paths, setPaths] = useState({
    heroImagePath: "",
    logoMarkPath: "",
    logoWordmarkPath: "",
    logoMarkWhitePath: "",
    logoWordmarkWhitePath: "",
    chatAvatarPath: "",
  });
  const [status, setStatus] = useState("");
  const { saving, message, error, run } = useSave();

  const reload = () =>
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((j) => {
        setAssets(j.assets ?? []);
        setScrollFrameCount(j.scrollFrameCount ?? 0);
        const s = j.settings ?? {};
        setPaths({
          heroImagePath: s.heroImagePath ?? "",
          logoMarkPath: s.logoMarkPath ?? "",
          logoWordmarkPath: s.logoWordmarkPath ?? "",
          logoMarkWhitePath: s.logoMarkWhitePath ?? "",
          logoWordmarkWhitePath: s.logoWordmarkWhitePath ?? "",
          chatAvatarPath: s.chatAvatarPath ?? "",
        });
      });

  useEffect(() => {
    reload();
  }, []);

  const upload = async (file: File, target: string, frameName?: string) => {
    setStatus("Uploading…");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("target", target);
    if (frameName) fd.append("frameName", frameName);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || "Upload failed");
    setStatus(`Uploaded ${j.path}`);
    await reload();
    return j.path as string;
  };

  const savePaths = () =>
    run(async () => {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: paths }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
    });

  return (
    <AdminShell title="Media library">
      <Card title="Upload image">
        <input
          type="file"
          accept="image/*,.webp,.png,.jpg,.jpeg,.svg"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              await upload(f, "uploads");
            } catch (err) {
              setStatus(err instanceof Error ? err.message : "Upload failed");
            }
          }}
        />
        {status && <p className="mt-2 text-sm text-teal-700">{status}</p>}
      </Card>

      <Card title="Assign site media paths">
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["heroImagePath", "Hero image"],
              ["logoMarkPath", "Logo mark"],
              ["logoWordmarkPath", "Logo wordmark"],
              ["logoMarkWhitePath", "Logo mark white"],
              ["logoWordmarkWhitePath", "Logo wordmark white"],
              ["chatAvatarPath", "Chat avatar"],
            ] as const
          ).map(([k, label]) => (
            <div key={k}>
              <Label>{label}</Label>
              <Input value={paths[k]} onChange={(e) => setPaths({ ...paths, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <SaveBar saving={saving} message={message} error={error} onSave={savePaths} />
      </Card>

      <Card title={`Scroll sequence frames (${scrollFrameCount})`}>
        <p className="mb-3 text-sm text-slate-600">
          Replace a frame by uploading a webp named like <code>frame_001.webp</code>, or any webp (gets a unique name).
          Then rebuild the manifest.
        </p>
        <div className="flex flex-wrap gap-3">
          <label className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
            Replace named frame
            <input
              type="file"
              accept=".webp,image/webp"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const name = prompt("Frame filename (e.g. frame_042.webp)", f.name);
                if (!name) return;
                try {
                  await upload(f, "scroll", name);
                } catch (err) {
                  setStatus(err instanceof Error ? err.message : "Upload failed");
                }
              }}
            />
          </label>
          <button
            type="button"
            className="rounded-full bg-[#0e7490] px-4 py-2 text-sm font-bold text-white"
            onClick={async () => {
              const res = await fetch("/api/admin/media", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "rebuild-manifest" }),
              });
              const j = await res.json();
              setStatus(res.ok ? `Manifest rebuilt · ${j.frameCount} frames` : j.error);
              await reload();
            }}
          >
            Rebuild manifest
          </button>
        </div>
      </Card>

      <Card title="Uploaded assets">
        <ul className="space-y-2">
          {assets.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.path} alt="" className="h-12 w-12 rounded object-cover bg-slate-100" />
              <code className="flex-1 break-all text-xs">{a.path}</code>
              <button
                type="button"
                className="text-xs text-teal-700"
                onClick={() => navigator.clipboard?.writeText(a.path)}
              >
                Copy path
              </button>
            </li>
          ))}
          {assets.length === 0 && <p className="text-sm text-slate-500">No uploads yet.</p>}
        </ul>
      </Card>
    </AdminShell>
  );
}
