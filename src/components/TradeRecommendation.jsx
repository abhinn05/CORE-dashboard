import { memo } from "react";
import DashboardCard from "./DashboardCard";

function TradeRecommendation({ recommendation }) {
  return (
    <DashboardCard title="AI Trade Recommendation" badge="Model">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[20px] bg-white/[0.03] p-4 border border-white/[0.04]">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Market Bias</p>
            <p className={`mt-3 text-3xl font-black ${recommendation.bias?.includes('Bearish') ? 'text-red-400' : 'text-green-400'}`}>
              {recommendation.bias || "N/A"}
            </p>
          </div>
          <div className="rounded-[20px] bg-white/[0.03] p-4 border border-white/[0.04]">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Confidence</p>
            <p className="mt-3 text-3xl font-black text-cyan-400">{recommendation.confidence || "N/A"}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[20px] bg-white/[0.03] p-4 border border-white/[0.04]">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Bullish Drivers</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-300 list-disc list-inside">
              {recommendation.bullishDrivers && recommendation.bullishDrivers.length > 0 ? (
                recommendation.bullishDrivers.map((driver) => (
                  <li key={driver}>{driver}</li>
                ))
              ) : (
                <li className="text-gray-500 list-none">No bullish drivers identified.</li>
              )}
            </ul>
          </div>
          <div className="rounded-[20px] bg-white/[0.03] p-4 border border-white/[0.04]">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Bearish Drivers</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-300 list-disc list-inside">
              {recommendation.bearishDrivers && recommendation.bearishDrivers.length > 0 ? (
                recommendation.bearishDrivers.map((driver) => (
                  <li key={driver}>{driver}</li>
                ))
              ) : (
                <li className="text-gray-500 list-none">No bearish drivers identified.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-[20px] bg-white/[0.03] p-4 border border-white/[0.04]">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Suggested Trade</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            {recommendation.suggestedTrade || "No trade suggestion available."}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

export default memo(TradeRecommendation);
