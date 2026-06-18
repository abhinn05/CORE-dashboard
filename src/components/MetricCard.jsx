import AnimatedNumber from "./AnimatedNumber";

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
    <div className={`rounded-[24px]
        bg-gradient-to-b
        from-[#0c1320]
        to-[#090d16]
        border
        border-white/[0.06]
        shadow-[0_0_30px_rgba(0,255,255,0.03)]
        hover:border-cyan-400/20
        hover:shadow-[0_0_40px_rgba(34,211,238,0.08)]
        transition-all
        duration-300 p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
            {title}
          </p>
          <h3 className="text-3xl font-black mt-2 text-white">
            {typeof value === "number" ? (
              <AnimatedNumber value={value} />
            ) : (
              value
            )}
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

        <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
          <span>Updated just now</span>

          <span>Live</span>
      </div>
    </div>
    
  );
}
