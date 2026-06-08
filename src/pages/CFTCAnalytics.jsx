import PositioningChart from "../components/cftc/PositioningChart";
import { useCftc } from "../hooks";

import {
  latestNetPosition,
  positioningSignal,
  openInterestTrend,
  positioningPercentile,
crowdingScore
}
from "../analytics/cftcEngine";

export default function CFTCAnalytics() {

  const { data: liveCftc } = useCftc();
  const effective = liveCftc ?? [];

  const signal = effective.length > 0 ? positioningSignal(effective) : "N/A";
  const net = effective.length > 0 ? latestNetPosition(effective) : null;
  const oiTrend = effective.length > 1 ? openInterestTrend(effective) : "N/A";
  const percentile = effective.length > 0 ? positioningPercentile(effective) : null;
  const crowding = effective.length > 0 ? crowdingScore(effective) : "N/A";
  const latest = effective[effective.length - 1] ?? {};

  const liveInterpretation = effective.length > 1 ? (
    signal.includes("Bullish") 
      ? `Managed money positioning is net long with open interest trending ${oiTrend.toLowerCase()}. This combination suggests strong speculative participation and supports a bullish outlook.`
      : signal.includes("Bearish")
      ? `Managed money positioning is skewed short. Continued selling pressure could weigh on prices, though high crowding introduces short-covering squeeze risk.`
      : `Managed money positioning is largely neutral. Speculators lack a strong directional conviction, aligning with current consolidation trends.`
  ) : "Waiting for live CFTC positioning data...";

  const positioningInterpretation = liveCftc?.positioningInterpretation || liveInterpretation;

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

      <div className="xl:col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-6">
          CFTC Positioning
        </h2>

        <PositioningChart
          data={effective}
        />

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Smart Money Signal
        </p>

        <h2 className={`text-5xl font-black mt-4 ${signal.includes('Bearish') ? 'text-red-400' : signal.includes('Bullish') ? 'text-green-400' : 'text-gray-400'}`}>
          {signal}
        </h2>

        <div className="mt-8 space-y-4">

          <div className="flex justify-between">
            <span className="text-gray-400">
              Net Position
            </span>

            <span>
          {net != null ? net : "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">
              Open Interest
            </span>

            <span>
              {oiTrend}
            </span>
          </div>

        </div>

                <div className="flex justify-between">
        <span className="text-gray-400">
            Percentile
        </span>

        <span>
        {percentile != null ? `${percentile}%` : "N/A"}
        </span>
        </div>

        <div className="flex justify-between">
        <span className="text-gray-400">
            Crowding
        </span>

        <span>
            {crowding}
        </span>
        </div>

      </div>

      <div className="xl:col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-xl font-bold">
          Long Positions
        </h3>

        <p className="text-5xl font-black mt-4 text-green-400">
          {latest.longs ?? "N/A"}K
        </p>

      </div>

      <div className="xl:col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-xl font-bold">
          Short Positions
        </h3>

        <p className="text-5xl font-black mt-4 text-red-400">
          {latest.shorts ?? "N/A"}K
        </p>

      </div>

      <div className="xl:col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-xl font-bold">
          Open Interest
        </h3>

        <p className="text-5xl font-black mt-4 text-cyan-400">
          {latest.oi ?? "N/A"}K
        </p>

      </div>

      <div className="xl:col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Positioning Interpretation
        </h3>

        <p className="text-gray-400 leading-relaxed">
          {positioningInterpretation}

        </p>

      </div>

      </div>
    </div>
  );
}
