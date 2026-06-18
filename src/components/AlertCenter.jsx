import { memo } from "react";
import DashboardCard from "./DashboardCard";

const severityStyles = {
  Low: "bg-green-500/10 text-green-300",
  Medium: "bg-amber-500/10 text-amber-300",
  High: "bg-orange-500/10 text-orange-300",
  Critical: "bg-red-500/10 text-red-300",
};

const alertIcons = {
  "WTI Price Alert": "📈",
  "OVX Volatility Spike": "⚡",
  "Inventory Draw": "🛢",
  "Macro Alert": "🌍",
  "Geopolitical Risk": "🌐",
};

function AlertCenter({ alerts }) {
  const effectiveAlerts = alerts || [];

  return (
    <DashboardCard
      title="Alert Center"
      badge="Live"
      className="h-full"
    >
      <div className="space-y-3">

        {effectiveAlerts.length > 0 ? (

          effectiveAlerts.map((item) => (

            <div
              key={item.title}
              className="
                rounded-2xl
                border
                border-white/[0.05]
                bg-white/[0.03]
                px-4
                py-4

                hover:bg-white/[0.05]
                hover:border-cyan-400/20
                hover:shadow-[0_0_18px_rgba(34,211,238,0.08)]

                transition-all
                duration-300
                cursor-pointer
              "
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">

                    {(alertIcons[item.title] ?? "●")} {item.title}

                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">

                    {item.value}

                  </p>

                </div>

                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    ${
                      severityStyles[item.severity] ??
                      "bg-white/5 text-gray-300"
                    }
                  `}
                >
                  {item.severity}
                </span>

              </div>

              <p className="mt-3 text-sm text-gray-400">

                {item.status}

              </p>

              {/* tiny severity bar */}

              <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">

                <div
                  className={`h-full rounded-full ${
                    item.severity === "Low"
                      ? "w-1/4 bg-green-400"
                      : item.severity === "Medium"
                      ? "w-2/4 bg-amber-400"
                      : item.severity === "High"
                      ? "w-3/4 bg-orange-400"
                      : "w-full bg-red-400"
                  }`}
                />

              </div>

            </div>

          ))

        ) : (

          <p className="text-sm text-gray-500">

            No active alerts.

          </p>

        )}

      </div>
    </DashboardCard>
  );
}

export default memo(AlertCenter);