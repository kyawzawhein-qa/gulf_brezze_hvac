import AdminNav from "./AdminNav";

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f0f7fa] text-[#0a2a3a] lg:flex">
      <AdminNav />
      <div className="flex-1">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h1>
        </header>
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
