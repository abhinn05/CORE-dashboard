import { memo } from "react";
import DashboardCard from "./DashboardCard";

const severityStyles = {
  Low: "bg-green-500/10 text-green-300",
  Medium: "bg-amber-500/10 text-amber-300",
  High: "bg-orange-500/10 text-orange-300",
  Critical: "bg-red-500/10 text-red-300",
};

function AlertCenter({ alerts }) {
  const effectiveAlerts = alerts || [];

  return (
    <DashboardCard title="Alert Center" badge="Live">
      <div className="space-y-4">
        {effectiveAlerts.length > 0 ? (
          effectiveAlerts.map((item) => (
            <div key={item.title} className="rounded-[20px] bg-white/[0.03] p-4 border border-white/[0.04]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-400">{item.title}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${severityStyles[item.severity] || "bg-white/[0.06] text-gray-300"}`}>
                  {item.severity}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.status}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No active alerts.</p>
        )}
      </div>
    </DashboardCard>
  );
}

export default memo(AlertCenter);
