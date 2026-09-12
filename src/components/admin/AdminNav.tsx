"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/story", label: "Story" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/trust", label: "Trust" },
  { href: "/admin/chat", label: "Chat" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/design", label: "Design" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex w-full flex-col gap-4 border-b border-white/10 bg-[#0a2a3a] text-white lg:min-h-screen lg:w-56 lg:border-b-0 lg:border-r lg:border-white/10">
      <div className="px-4 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/70">CMS</p>
        <p className="mt-1 text-sm font-bold">Gulf Breeze Admin</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0" aria-label="Admin">
        {LINKS.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-teal-500/25 text-white" : "text-sky-100/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex items-center gap-2 border-t border-white/10 px-3 py-4">
        <a href="/" className="rounded-lg px-3 py-2 text-xs font-medium text-sky-100/80 hover:bg-white/10" target="_blank" rel="noreferrer">
          View site
        </a>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg px-3 py-2 text-xs font-medium text-orange-200 hover:bg-white/10"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
