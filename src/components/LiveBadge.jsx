export default function LiveBadge() {
  return (
    <div className="flex items-center gap-2 text-xs text-emerald-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>

      LIVE
    </div>
  );
}