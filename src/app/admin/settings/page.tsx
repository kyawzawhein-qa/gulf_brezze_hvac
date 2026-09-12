"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import SaveBar from "@/components/admin/SaveBar";
import { Card, Input, Label, TextArea } from "@/components/admin/Field";
import { useSave } from "@/components/admin/useSave";

const Field = { Label, Input, TextArea, Card };

type State = {
  settings: {
    brandName: string;
    tagline: string;
    phone: string;
    phoneHref: string;
    serviceCities: string;
    demoBadgeText: string;
    footerBlurb: string;
    heroImagePath: string;
    logoMarkPath: string;
    logoWordmarkPath: string;
    logoMarkWhitePath: string;
    logoWordmarkWhitePath: string;
    chatAvatarPath: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
  };
  finalCta: {
    eyebrow: string;
    heading: string;
    body: string;
    primaryBtn: string;
    secondaryBtn: string;
    tertiaryBtn: string;
    footnote: string;
  };
};

const empty: State = {
  settings: {
    brandName: "",
    tagline: "",
    phone: "",
    phoneHref: "",
    serviceCities: "",
    demoBadgeText: "",
    footerBlurb: "",
    heroImagePath: "",
    logoMarkPath: "",
    logoWordmarkPath: "",
    logoMarkWhitePath: "",
    logoWordmarkWhitePath: "",
    chatAvatarPath: "",
  },
  hero: { eyebrow: "", headline: "", subhead: "", primaryCta: "", secondaryCta: "" },
  finalCta: {
    eyebrow: "",
    heading: "",
    body: "",
    primaryBtn: "",
    secondaryBtn: "",
    tertiaryBtn: "",
    footnote: "",
  },
};

export default function SettingsPage() {
  const [data, setData] = useState<State>(empty);
  const { saving, message, error, run } = useSave();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((j) => {
        const s = j.settings ?? {};
        let cities = s.serviceCities ?? "";
        try {
          const parsed = JSON.parse(cities);
          if (Array.isArray(parsed)) cities = parsed.join("\n");
        } catch {
          /* keep */
        }
        setData({
          settings: {
            brandName: s.brandName ?? "",
            tagline: s.tagline ?? "",
            phone: s.phone ?? "",
            phoneHref: s.phoneHref ?? "",
            serviceCities: cities,
            demoBadgeText: s.demoBadgeText ?? "",
            footerBlurb: s.footerBlurb ?? "",
            heroImagePath: s.heroImagePath ?? "",
            logoMarkPath: s.logoMarkPath ?? "",
            logoWordmarkPath: s.logoWordmarkPath ?? "",
            logoMarkWhitePath: s.logoMarkWhitePath ?? "",
            logoWordmarkWhitePath: s.logoWordmarkWhitePath ?? "",
            chatAvatarPath: s.chatAvatarPath ?? "",
          },
          hero: {
            eyebrow: j.hero?.eyebrow ?? "",
            headline: j.hero?.headline ?? "",
            subhead: j.hero?.subhead ?? "",
            primaryCta: j.hero?.primaryCta ?? "",
            secondaryCta: j.hero?.secondaryCta ?? "",
          },
          finalCta: {
            eyebrow: j.finalCta?.eyebrow ?? "",
            heading: j.finalCta?.heading ?? "",
            body: j.finalCta?.body ?? "",
            primaryBtn: j.finalCta?.primaryBtn ?? "",
            secondaryBtn: j.finalCta?.secondaryBtn ?? "",
            tertiaryBtn: j.finalCta?.tertiaryBtn ?? "",
            footnote: j.finalCta?.footnote ?? "",
          },
        });
      });
  }, []);

  const save = () =>
    run(async () => {
      const cities = data.settings.serviceCities
        .split(/[\n,]/)
        .map((c) => c.trim())
        .filter(Boolean);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: { ...data.settings, serviceCities: cities },
          hero: data.hero,
          finalCta: data.finalCta,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
    });

  const setS = (k: keyof State["settings"], v: string) =>
    setData((d) => ({ ...d, settings: { ...d.settings, [k]: v } }));
  const setH = (k: keyof State["hero"], v: string) =>
    setData((d) => ({ ...d, hero: { ...d.hero, [k]: v } }));
  const setF = (k: keyof State["finalCta"], v: string) =>
    setData((d) => ({ ...d, finalCta: { ...d.finalCta, [k]: v } }));

  return (
    <AdminShell title="Settings">
      <Field.Card title="Brand & contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Field.Label>Brand name</Field.Label>
            <Field.Input value={data.settings.brandName} onChange={(e) => setS("brandName", e.target.value)} />
          </div>
          <div>
            <Field.Label>Tagline</Field.Label>
            <Field.Input value={data.settings.tagline} onChange={(e) => setS("tagline", e.target.value)} />
          </div>
          <div>
            <Field.Label>Phone display</Field.Label>
            <Field.Input value={data.settings.phone} onChange={(e) => setS("phone", e.target.value)} />
          </div>
          <div>
            <Field.Label>Phone href</Field.Label>
            <Field.Input value={data.settings.phoneHref} onChange={(e) => setS("phoneHref", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Field.Label>Demo badge text</Field.Label>
            <Field.Input value={data.settings.demoBadgeText} onChange={(e) => setS("demoBadgeText", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Field.Label>Footer blurb</Field.Label>
            <Field.TextArea rows={2} value={data.settings.footerBlurb} onChange={(e) => setS("footerBlurb", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Field.Label>Service cities (one per line)</Field.Label>
            <Field.TextArea rows={5} value={data.settings.serviceCities} onChange={(e) => setS("serviceCities", e.target.value)} />
          </div>
        </div>
      </Field.Card>

      <Field.Card title="Hero / intro CTA">
        <div className="grid gap-4">
          <div>
            <Field.Label>Eyebrow</Field.Label>
            <Field.Input value={data.hero.eyebrow} onChange={(e) => setH("eyebrow", e.target.value)} />
          </div>
          <div>
            <Field.Label>Headline</Field.Label>
            <Field.Input value={data.hero.headline} onChange={(e) => setH("headline", e.target.value)} />
          </div>
          <div>
            <Field.Label>Subhead</Field.Label>
            <Field.TextArea rows={3} value={data.hero.subhead} onChange={(e) => setH("subhead", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field.Label>Primary CTA</Field.Label>
              <Field.Input value={data.hero.primaryCta} onChange={(e) => setH("primaryCta", e.target.value)} />
            </div>
            <div>
              <Field.Label>Secondary CTA</Field.Label>
              <Field.Input value={data.hero.secondaryCta} onChange={(e) => setH("secondaryCta", e.target.value)} />
            </div>
          </div>
        </div>
      </Field.Card>

      <Field.Card title="Final CTA">
        <div className="grid gap-4">
          <div>
            <Field.Label>Eyebrow</Field.Label>
            <Field.Input value={data.finalCta.eyebrow} onChange={(e) => setF("eyebrow", e.target.value)} />
          </div>
          <div>
            <Field.Label>Heading</Field.Label>
            <Field.Input value={data.finalCta.heading} onChange={(e) => setF("heading", e.target.value)} />
          </div>
          <div>
            <Field.Label>Body</Field.Label>
            <Field.TextArea rows={3} value={data.finalCta.body} onChange={(e) => setF("body", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Field.Label>Primary button</Field.Label>
              <Field.Input value={data.finalCta.primaryBtn} onChange={(e) => setF("primaryBtn", e.target.value)} />
            </div>
            <div>
              <Field.Label>Secondary button</Field.Label>
              <Field.Input value={data.finalCta.secondaryBtn} onChange={(e) => setF("secondaryBtn", e.target.value)} />
            </div>
            <div>
              <Field.Label>Tertiary button</Field.Label>
              <Field.Input value={data.finalCta.tertiaryBtn} onChange={(e) => setF("tertiaryBtn", e.target.value)} />
            </div>
          </div>
          <div>
            <Field.Label>Footnote</Field.Label>
            <Field.Input value={data.finalCta.footnote} onChange={(e) => setF("footnote", e.target.value)} />
          </div>
        </div>
      </Field.Card>

      <Field.Card title="Media paths (or set via Media page)">
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["heroImagePath", "Hero image path"],
              ["logoMarkPath", "Logo mark"],
              ["logoWordmarkPath", "Logo wordmark"],
              ["logoMarkWhitePath", "Logo mark (white)"],
              ["logoWordmarkWhitePath", "Logo wordmark (white)"],
              ["chatAvatarPath", "Chat avatar"],
            ] as const
          ).map(([k, label]) => (
            <div key={k}>
              <Field.Label>{label}</Field.Label>
              <Field.Input value={data.settings[k]} onChange={(e) => setS(k, e.target.value)} />
            </div>
          ))}
        </div>
      </Field.Card>

      <SaveBar saving={saving} message={message} error={error} onSave={save} />
    </AdminShell>
  );
}
