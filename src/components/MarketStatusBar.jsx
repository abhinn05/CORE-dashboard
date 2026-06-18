import { Activity, ShieldAlert, Clock3, TrendingDown } from "lucide-react";

export default function MarketStatusBar({
  regime,
  signal,
  confidence,
  risk,
  lastUpdated,
}) {
  const formattedTime = lastUpdated
  ? new Date(lastUpdated).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  : "N/A";

  return (
    <div className="mb-6 rounded-3xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-transparent p-5">

      <div className="grid grid-cols-5 gap-6">

        <StatusItem
          icon={<Activity size={16} />}
          label="REGIME"
          value={regime ?? "N/A"}
          color="text-cyan-400"
        />

        <StatusItem
          icon={<TrendingDown size={16} />}
          label="SIGNAL"
          value={signal ?? "N/A"}
          color="text-red-400"
        />

        <StatusItem
          icon={<ShieldAlert size={16} />}
          label="CONFIDENCE"
          value={confidence ?? "N/A"}
          color="text-sky-300"
        />

        <StatusItem
          icon={<ShieldAlert size={16} />}
          label="RISK"
          value={risk ?? "N/A"}
          color="text-orange-400"
        />

        <div className="flex justify-end">
          <div>
            <div className="flex items-center gap-2">

                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                    LIVE
                </span>

            </div>

            <div className="mt-3">

                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    Last Refresh
                </p>

                <div className="mt-1 flex items-center gap-2 text-cyan-300">

                    <Clock3 size={15} />

                    <span>{formattedTime}</span>

                </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatusItem({ icon, label, value, color }) {
  return (
    <div>

      <div className="flex items-center gap-2 text-gray-500">

        {icon}

        <p className="text-[10px] uppercase tracking-[0.3em]">
          {label}
        </p>

      </div>

      <h3 className={`mt-2 text-xl font-bold ${color}`}>
        {value}
      </h3>

    </div>
  );
}