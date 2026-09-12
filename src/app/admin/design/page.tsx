"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { Card, Input, Label } from "@/components/admin/Field";
import { useSave } from "@/components/admin/useSave";

const KEYS = [
  "navy",
  "deep",
  "teal",
  "aqua",
  "sky",
  "foam",
  "sand",
  "coral",
  "coralDark",
  "slate",
  "muted",
] as const;

type Design = Record<(typeof KEYS)[number], string>;

const EMPTY: Design = {
  navy: "#0a2a3a",
  deep: "#0d3d4f",
  teal: "#0e7490",
  aqua: "#14b8a6",
  sky: "#38bdf8",
  foam: "#e0f7fa",
  sand: "#f8fafc",
  coral: "#f97316",
  coralDark: "#ea580c",
  slate: "#334155",
  muted: "#64748b",
};

export default function DesignAdminPage() {
  const [design, setDesign] = useState<Design>(EMPTY);
  const { saving, message, error, run } = useSave();

  useEffect(() => {
    fetch("/api/admin/design")
      .then((r) => r.json())
      .then((j) => {
        if (j.design) setDesign({ ...EMPTY, ...j.design });
      });
  }, []);

  const save = () =>
    run(async () => {
      const res = await fetch("/api/admin/design", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
    });

  return (
    <AdminShell title="Design tokens">
      <p className="mb-4 text-sm text-slate-600">
        Saves to the database and writes <code className="rounded bg-slate-100 px-1">public/brand/runtime-theme.json</code>.
        The public layout injects CSS variables on each request.
      </p>
      <Card title="Colors">
        <div className="grid gap-4 sm:grid-cols-2">
          {KEYS.map((k) => (
            <div key={k} className="flex items-end gap-3">
              <div className="flex-1">
                <Label>{k}</Label>
                <Input value={design[k]} onChange={(e) => setDesign({ ...design, [k]: e.target.value })} />
              </div>
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(design[k]) ? design[k] : "#000000"}
                onChange={(e) => setDesign({ ...design, [k]: e.target.value })}
                className="h-10 w-12 cursor-pointer rounded border border-slate-200"
              />
            </div>
          ))}
        </div>
      </Card>
      <SaveBar saving={saving} message={message} error={error} onSave={save} />
    </AdminShell>
  );
}
