"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { Card, Input, Label, TextArea } from "@/components/admin/Field";
import { useSave } from "@/components/admin/useSave";

type Review = { name: string; city: string; text: string; stars: number };
type Stat = { value: string; label: string; group: string };

export default function TrustAdminPage() {
  const [section, setSection] = useState({ eyebrow: "", heading: "", subhead: "" });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const { saving, message, error, run } = useSave();

  useEffect(() => {
    fetch("/api/admin/trust")
      .then((r) => r.json())
      .then((j) => {
        if (j.section) setSection({ eyebrow: "", heading: "", subhead: "", ...j.section });
        setReviews(
          (j.reviews ?? []).map((r: Review) => ({
            name: r.name,
            city: r.city,
            text: r.text,
            stars: r.stars,
          }))
        );
        setStats(
          (j.stats ?? []).map((s: Stat) => ({
            value: s.value,
            label: s.label,
            group: s.group || "trust",
          }))
        );
      });
  }, []);

  const save = () =>
    run(async () => {
      const res = await fetch("/api/admin/trust", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, reviews, stats }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
    });

  return (
    <AdminShell title="Trust — reviews & stats">
      <Card title="Section copy">
        <div className="grid gap-3">
          {(["eyebrow", "heading", "subhead"] as const).map((k) => (
            <div key={k}>
              <Label>{k}</Label>
              {k === "subhead" ? (
                <TextArea rows={2} value={section[k]} onChange={(e) => setSection({ ...section, [k]: e.target.value })} />
              ) : (
                <Input value={section[k]} onChange={(e) => setSection({ ...section, [k]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
      </Card>

      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Stats (hero + trust)</h2>
      {stats.map((s, i) => (
        <Card key={i} title={`Stat ${i + 1}`}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>Value</Label>
              <Input value={s.value} onChange={(e) => setStats((p) => p.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))} />
            </div>
            <div>
              <Label>Label</Label>
              <Input value={s.label} onChange={(e) => setStats((p) => p.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))} />
            </div>
            <div>
              <Label>Group (hero|trust)</Label>
              <Input value={s.group} onChange={(e) => setStats((p) => p.map((x, idx) => (idx === i ? { ...x, group: e.target.value } : x)))} />
            </div>
          </div>
          <button type="button" className="mt-2 text-xs text-red-600" onClick={() => setStats((p) => p.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </Card>
      ))}
      <button
        type="button"
        className="mb-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        onClick={() => setStats((p) => [...p, { value: "", label: "", group: "trust" }])}
      >
        + Add stat
      </button>

      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Reviews</h2>
      {reviews.map((r, i) => (
        <Card key={i} title={`Review ${i + 1}`}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>Name</Label>
              <Input value={r.name} onChange={(e) => setReviews((p) => p.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={r.city} onChange={(e) => setReviews((p) => p.map((x, idx) => (idx === i ? { ...x, city: e.target.value } : x)))} />
            </div>
            <div>
              <Label>Stars</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={r.stars}
                onChange={(e) =>
                  setReviews((p) => p.map((x, idx) => (idx === i ? { ...x, stars: Number(e.target.value) } : x)))
                }
              />
            </div>
            <div className="sm:col-span-3">
              <Label>Text</Label>
              <TextArea rows={3} value={r.text} onChange={(e) => setReviews((p) => p.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x)))} />
            </div>
          </div>
          <button type="button" className="mt-2 text-xs text-red-600" onClick={() => setReviews((p) => p.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </Card>
      ))}
      <button
        type="button"
        className="mb-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        onClick={() => setReviews((p) => [...p, { name: "", city: "", text: "", stars: 5 }])}
      >
        + Add review
      </button>

      <SaveBar saving={saving} message={message} error={error} onSave={save} />
    </AdminShell>
  );
}
