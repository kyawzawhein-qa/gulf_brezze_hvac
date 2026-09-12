import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

const CARDS = [
  { href: "/admin/settings", title: "Settings", desc: "Brand, phone, cities, footer, logos" },
  { href: "/admin/story", title: "Story", desc: "Scrollytelling captions" },
  { href: "/admin/services", title: "Services", desc: "Services + how-it-works steps" },
  { href: "/admin/trust", title: "Trust", desc: "Reviews and stats" },
  { href: "/admin/chat", title: "Chat", desc: "Welcome, zips, issues, slots" },
  { href: "/admin/media", title: "Media", desc: "Uploads & scroll frames" },
  { href: "/admin/design", title: "Design", desc: "Brand color tokens" },
];

export default async function AdminDashboard() {
  const content = await getSiteContent();
  return (
    <AdminShell title="Dashboard">
      <p className="mb-6 text-sm text-slate-600">
        Editing <strong>{content.settings.brandName}</strong> — public site reads from this CMS on each
        request. After saving, refresh the homepage.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="font-bold text-[#0a2a3a]">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
        <p>
          <strong>Counts:</strong> {content.services.length} services · {content.captions.length} captions ·{" "}
          {content.reviews.length} reviews · {content.chat.validZips.length} zips
        </p>
      </div>
    </AdminShell>
  );
}
