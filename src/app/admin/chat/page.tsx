"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { Card, Input, Label, TextArea } from "@/components/admin/Field";
import { useSave } from "@/components/admin/useSave";

type Issue = { id: string; label: string };
type Slot = { id: string; label: string; note: string };

export default function ChatAdminPage() {
  const [welcomeText, setWelcomeText] = useState("");
  const [launcherLabel, setLauncherLabel] = useState("");
  const [validZips, setValidZips] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const { saving, message, error, run } = useSave();

  useEffect(() => {
    fetch("/api/admin/chat")
      .then((r) => r.json())
      .then((j) => {
        setWelcomeText(j.settings?.welcomeText ?? "");
        setLauncherLabel(j.settings?.launcherLabel ?? "24/7 Chat");
        setValidZips((j.settings?.validZips ?? "").replace(/,/g, "\n"));
        setIssues((j.issues ?? []).map((i: Issue) => ({ id: i.id, label: i.label })));
        setSlots((j.slots ?? []).map((s: Slot) => ({ id: s.id, label: s.label, note: s.note })));
      });
  }, []);

  const save = () =>
    run(async () => {
      const res = await fetch("/api/admin/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            welcomeText,
            launcherLabel,
            validZips: validZips
              .split(/[\n,]/)
              .map((z) => z.trim())
              .filter(Boolean)
              .join(","),
          },
          issues,
          slots,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
    });

  return (
    <AdminShell title="Chat widget">
      <Card title="Welcome & launcher">
        <div className="grid gap-3">
          <div>
            <Label>Welcome text</Label>
            <TextArea rows={3} value={welcomeText} onChange={(e) => setWelcomeText(e.target.value)} />
          </div>
          <div>
            <Label>Launcher label</Label>
            <Input value={launcherLabel} onChange={(e) => setLauncherLabel(e.target.value)} />
          </div>
          <div>
            <Label>Valid ZIPs (one per line)</Label>
            <TextArea rows={8} value={validZips} onChange={(e) => setValidZips(e.target.value)} />
          </div>
        </div>
      </Card>

      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Issues</h2>
      {issues.map((item, i) => (
        <Card key={i} title={`Issue ${i + 1}`}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>ID</Label>
              <Input value={item.id} onChange={(e) => setIssues((p) => p.map((x, idx) => (idx === i ? { ...x, id: e.target.value } : x)))} />
            </div>
            <div>
              <Label>Label</Label>
              <Input value={item.label} onChange={(e) => setIssues((p) => p.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))} />
            </div>
          </div>
          <button type="button" className="mt-2 text-xs text-red-600" onClick={() => setIssues((p) => p.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </Card>
      ))}
      <button
        type="button"
        className="mb-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        onClick={() => setIssues((p) => [...p, { id: `issue-${p.length + 1}`, label: "" }])}
      >
        + Add issue
      </button>

      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Slots</h2>
      {slots.map((s, i) => (
        <Card key={i} title={`Slot ${i + 1}`}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>ID</Label>
              <Input value={s.id} onChange={(e) => setSlots((p) => p.map((x, idx) => (idx === i ? { ...x, id: e.target.value } : x)))} />
            </div>
            <div>
              <Label>Label</Label>
              <Input value={s.label} onChange={(e) => setSlots((p) => p.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))} />
            </div>
            <div>
              <Label>Note</Label>
              <Input value={s.note} onChange={(e) => setSlots((p) => p.map((x, idx) => (idx === i ? { ...x, note: e.target.value } : x)))} />
            </div>
          </div>
          <button type="button" className="mt-2 text-xs text-red-600" onClick={() => setSlots((p) => p.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </Card>
      ))}
      <button
        type="button"
        className="mb-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        onClick={() => setSlots((p) => [...p, { id: `slot-${p.length + 1}`, label: "", note: "" }])}
      >
        + Add slot
      </button>

      <SaveBar saving={saving} message={message} error={error} onSave={save} />
    </AdminShell>
  );
}
