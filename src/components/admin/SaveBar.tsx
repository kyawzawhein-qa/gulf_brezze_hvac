"use client";

export default function SaveBar({
  saving,
  message,
  error,
  onSave,
}: {
  saving: boolean;
  message?: string;
  error?: string;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-full bg-gradient-to-r from-[#0e7490] to-[#14b8a6] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      {message && <p className="text-sm font-medium text-teal-700">{message}</p>}
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
