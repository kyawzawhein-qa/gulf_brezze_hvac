"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { Card, Input, Label, TextArea } from "@/components/admin/Field";
import { useSave } from "@/components/admin/useSave";

type Service = { title: string; desc: string; badge: string; iconPath: string };
type Step = { title: string; body: string; detail: string };

export default function ServicesAdminPage() {
  const [section, setSection] = useState({
    eyebrow: "",
    heading: "",
    subhead: "",
    areaTitle: "",
    areaSubhead: "",
  });
  const [services, setServices] = useState<Service[]>([]);
  const [howSection, setHowSection] = useState({ eyebrow: "", heading: "", subhead: "" });
  const [howSteps, setHowSteps] = useState<Step[]>([]);
  const { saving, message, error, run } = useSave();

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((j) => {
        if (j.section) setSection({ ...section, ...j.section });
        setServices(
          (j.services ?? []).map((s: Service) => ({
            title: s.title,
            desc: s.desc,
            badge: s.badge,
            iconPath: s.iconPath,
          }))
        );
        if (j.howSection) setHowSection({ eyebrow: "", heading: "", subhead: "", ...j.howSection });
        setHowSteps(
          (j.howSteps ?? []).map((s: Step) => ({
            title: s.title,
            body: s.body,
            detail: s.detail,
          }))
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () =>
    run(async () => {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, services, howSection, howSteps }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
    });

  return (
    <AdminShell title="Services & How it works">
      <Card title="Services section">
        <div className="grid gap-3">
          {(["eyebrow", "heading", "subhead", "areaTitle", "areaSubhead"] as const).map((k) => (
            <div key={k}>
              <Label>{k}</Label>
              {k === "subhead" || k === "areaSubhead" ? (
                <TextArea rows={2} value={section[k]} onChange={(e) => setSection({ ...section, [k]: e.target.value })} />
              ) : (
                <Input value={section[k]} onChange={(e) => setSection({ ...section, [k]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {services.map((s, i) => (
        <Card key={i} title={`Service ${i + 1}`}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input value={s.title} onChange={(e) => setServices((p) => p.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} />
            </div>
            <div>
              <Label>Badge</Label>
              <Input value={s.badge} onChange={(e) => setServices((p) => p.map((x, idx) => (idx === i ? { ...x, badge: e.target.value } : x)))} />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <TextArea rows={2} value={s.desc} onChange={(e) => setServices((p) => p.map((x, idx) => (idx === i ? { ...x, desc: e.target.value } : x)))} />
            </div>
            <div className="sm:col-span-2">
              <Label>Icon path</Label>
              <Input value={s.iconPath} onChange={(e) => setServices((p) => p.map((x, idx) => (idx === i ? { ...x, iconPath: e.target.value } : x)))} />
            </div>
          </div>
          <button type="button" className="mt-2 text-xs text-red-600" onClick={() => setServices((p) => p.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </Card>
      ))}
      <button
        type="button"
        className="mb-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        onClick={() => setServices((p) => [...p, { title: "", desc: "", badge: "", iconPath: "" }])}
      >
        + Add service
      </button>

      <Card title="How it works section">
        <div className="grid gap-3">
          {(["eyebrow", "heading", "subhead"] as const).map((k) => (
            <div key={k}>
              <Label>{k}</Label>
              {k === "subhead" ? (
                <TextArea rows={2} value={howSection[k]} onChange={(e) => setHowSection({ ...howSection, [k]: e.target.value })} />
              ) : (
                <Input value={howSection[k]} onChange={(e) => setHowSection({ ...howSection, [k]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {howSteps.map((s, i) => (
        <Card key={i} title={`Step ${i + 1}`}>
          <div className="grid gap-3">
            <div>
              <Label>Title</Label>
              <Input value={s.title} onChange={(e) => setHowSteps((p) => p.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} />
            </div>
            <div>
              <Label>Body</Label>
              <TextArea rows={2} value={s.body} onChange={(e) => setHowSteps((p) => p.map((x, idx) => (idx === i ? { ...x, body: e.target.value } : x)))} />
            </div>
            <div>
              <Label>Detail note</Label>
              <Input value={s.detail} onChange={(e) => setHowSteps((p) => p.map((x, idx) => (idx === i ? { ...x, detail: e.target.value } : x)))} />
            </div>
          </div>
          <button type="button" className="mt-2 text-xs text-red-600" onClick={() => setHowSteps((p) => p.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </Card>
      ))}
      <button
        type="button"
        className="mb-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        onClick={() => setHowSteps((p) => [...p, { title: "", body: "", detail: "" }])}
      >
        + Add step
      </button>

      <SaveBar saving={saving} message={message} error={error} onSave={save} />
    </AdminShell>
  );
}
