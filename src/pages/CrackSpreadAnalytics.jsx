import CrackChart
from "../components/crack/CrackChart";

import { crackData }
from "../data/crackSpreadData";

import {
  crackTrend,
  crackChange,
  refinerySignal,
  crackPercentile
}
from "../analytics/crackSpreadEngine";

export default function CrackSpreadAnalytics() {

  const trend =
    crackTrend(crackData);

  const change =
    crackChange(crackData);

  const signal =
    refinerySignal(crackData);

    const currentCrack = 27;

const fiveYearAverage = 18;

const percentile =
  crackPercentile(
    currentCrack,
    fiveYearAverage
  );

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

      <div className="xl:col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-6">
          Crack Spread Analytics
        </h2>

        <CrackChart
          data={crackData}
        />

      </div>

      <div className="xl:col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Refinery Signal
        </p>

        <h2 className="text-5xl font-black mt-4 text-orange-400">
          {signal}
        </h2>

        <div className="mt-8 space-y-4">

          <div className="flex justify-between">
            <span className="text-gray-400">
              Change
            </span>

            <span>
              +{change}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">
              Trend
            </span>

            <span>
              {trend}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">
              Current Crack
            </span>

            <span>
              ${currentCrack}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">
              5Y Average
            </span>

            <span>
              ${fiveYearAverage}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">
              Percentile
            </span>

            <span>
              {percentile}th
            </span>
          </div>

        </div>

      </div>

      <div className="col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Refinery Economics
        </h3>

        <p className="text-gray-400 leading-relaxed">

          Rising crack spreads indicate
          stronger refinery profitability.
          Refiners are incentivized to run
          harder, increasing crude demand
          and supporting front-month oil
          prices.

        </p>

      </div>

      </div>
    </div>
  );
}