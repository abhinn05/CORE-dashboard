import PositioningChart from "../components/cftc/PositioningChart";

import { cftcData } from "../data/cftcData";

import {
  latestNetPosition,
  positioningSignal,
  openInterestTrend,
  positioningPercentile,
crowdingScore
}
from "../analytics/cftcEngine";

export default function CFTCAnalytics() {

  const signal =
    positioningSignal(cftcData);

  const net =
    latestNetPosition(cftcData);

  const oiTrend =
    openInterestTrend(cftcData);

    const percentile =
  positioningPercentile(cftcData);

    const crowding =
    crowdingScore(cftcData);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

      <div className="xl:col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-6">
          CFTC Positioning
        </h2>

        <PositioningChart
          data={cftcData}
        />

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Smart Money Signal
        </p>

        <h2 className="text-5xl font-black mt-4 text-green-400">
          {signal}
        </h2>

        <div className="mt-8 space-y-4">

          <div className="flex justify-between">
            <span className="text-gray-400">
              Net Position
            </span>

            <span>
              {net}
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
            {percentile}%
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
          515K
        </p>

      </div>

      <div className="xl:col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-xl font-bold">
          Short Positions
        </h3>

        <p className="text-5xl font-black mt-4 text-red-400">
          150K
        </p>

      </div>

      <div className="xl:col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-xl font-bold">
          Open Interest
        </h3>

        <p className="text-5xl font-black mt-4 text-cyan-400">
          2.5M
        </p>

      </div>

      <div className="xl:col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Positioning Interpretation
        </h3>

        <p className="text-gray-400 leading-relaxed">

          Managed money positioning
          remains heavily net long while
          open interest continues to rise.
          This combination suggests
          increasing speculative
          participation and supports a
          bullish medium-term outlook.

        </p>

      </div>

      </div>
    </div>
  );
}