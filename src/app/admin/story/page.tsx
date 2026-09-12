"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { Card, Input, Label, TextArea } from "@/components/admin/Field";
import { useSave } from "@/components/admin/useSave";

type Cap = { at: number; text: string; sortOrder: number };

export default function StoryPage() {
  const [captions, setCaptions] = useState<Cap[]>([]);
  const { saving, message, error, run } = useSave();

  useEffect(() => {
    fetch("/api/admin/story")
      .then((r) => r.json())
      .then((j) =>
        setCaptions(
          (j.captions ?? []).map((c: Cap & { id?: number }, i: number) => ({
            at: c.at,
            text: c.text,
            sortOrder: c.sortOrder ?? i,
          }))
        )
      );
  }, []);

  const save = () =>
    run(async () => {
      const res = await fetch("/api/admin/story", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captions: captions.map((c, i) => ({ ...c, sortOrder: i })),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
    });

  const update = (i: number, patch: Partial<Cap>) =>
    setCaptions((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  return (
    <AdminShell title="Story captions">
      <p className="mb-4 text-sm text-slate-600">
        Ordered captions for the GSAP scrollytelling sequence. Saving also syncs{" "}
        <code className="rounded bg-slate-100 px-1">public/scroll/sequence/manifest.json</code>.
      </p>
      {captions.map((c, i) => (
        <Card key={i} title={`Caption ${i + 1}`}>
          <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
            <div>
              <Label>At (0–1)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                max={1}
                value={c.at}
                onChange={(e) => update(i, { at: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Text</Label>
              <TextArea rows={2} value={c.text} onChange={(e) => update(i, { text: e.target.value })} />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="text-xs font-medium text-red-600"
              onClick={() => setCaptions((prev) => prev.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
        </Card>
      ))}
      <button
        type="button"
        className="mb-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        onClick={() => setCaptions((prev) => [...prev, { at: 0, text: "", sortOrder: prev.length }])}
      >
        + Add caption
      </button>
      <SaveBar saving={saving} message={message} error={error} onSave={save} />
    </AdminShell>
  );
}
