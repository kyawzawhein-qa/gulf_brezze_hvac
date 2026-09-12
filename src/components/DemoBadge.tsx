export default function DemoBadge({ text = "Sample / Demo Site" }: { text?: string }) {
  return (
    <div
      className="fixed top-3 left-1/2 z-[60] -translate-x-1/2 pointer-events-none"
      aria-hidden="true"
    >
      <span className="inline-flex items-center rounded-full bg-amber-400/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-950 shadow-lg ring-1 ring-amber-500/40">
        {text}
      </span>
    </div>
  );
}
