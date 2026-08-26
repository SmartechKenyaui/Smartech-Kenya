export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-cream-warm" />
          <div className="absolute inset-0 rounded-full border-2 border-t-ink animate-spin" />
        </div>
        <p className="text-ink-faint text-sm font-medium tracking-wide">Loading…</p>
      </div>
    </div>
  );
}
