export default function MetricCard({
  title,
  value,
  change,
  trend,
  badge,
  className = "",
}) {
  const numericChange = Number(String(change).replace(/[^0-9.-]/g, ""));
  const changeText = change == null || change === ""
    ? ""
    : String(change).includes("%")
      ? String(change)
      : Number.isFinite(numericChange)
        ? `${numericChange > 0 ? "+" : ""}${numericChange}%`
        : String(change);
  const trendColor =
    changeText.startsWith("+")
      ? "text-green-400"
      : changeText.startsWith("-")
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div className={`rounded-[24px] bg-[#0a0f18] border border-white/[0.05] p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
            {title}
          </p>
          <h3 className="text-3xl font-black mt-2 text-white">
            {value}
          </h3>
        </div>
        {badge && (
          <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-gray-400">
            {badge}
          </span>
        )}
      </div>

      {changeText && (
        <p className={`mt-2 text-sm font-medium ${trendColor}`}>
          {changeText}
        </p>
      )}

      {trend && (
        <p className="mt-1 text-xs text-gray-500">{trend}</p>
      )}
    </div>
  );
}
