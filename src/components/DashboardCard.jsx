export default function DashboardCard({
  title,
  children,
  badge,
  className = "",
}) {
  return (
    <div className={`rounded-[24px] bg-[#0a0f18] border border-white/[0.05] p-3 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {badge && (
          <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-gray-400">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
