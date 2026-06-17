import CrackChart
from "../components/crack/CrackChart";
import { useCrack } from "../hooks";

import {
  crackTrend,
  crackChange,
  refinerySignal,
  crackPercentile
}
from "../analytics/crackSpreadEngine";

export default function CrackSpreadAnalytics() {

  const { data: live } = useCrack();
  const effective = live ?? [];

  const trend = effective.length > 1 ? crackTrend(effective) : "N/A";
  const change = effective.length > 1 ? crackChange(effective) : null;
  const signal = effective.length > 1 ? refinerySignal(effective) : "N/A";

  const currentCrack = effective[effective.length - 1]?.crack;
  const fiveYearAverage = effective.length > 0 ? Number((effective.reduce((sum, item) => sum + item.crack, 0) / effective.length).toFixed(2)) : null;

  const percentile = effective.length > 0 && currentCrack != null && fiveYearAverage != null 
    ? crackPercentile(currentCrack, fiveYearAverage) 
    : null;

  const liveEconomics = effective.length > 1 ? (
    change >= 0
      ? `Rising crack spreads indicate stronger refinery profitability. Refiners are incentivized to run harder, increasing crude demand and supporting front-month oil prices.`
      : `Falling crack spreads indicate weakening refinery margins. Refiners may cut utilization rates, reducing prompt crude demand and weighing on front-month prices.`
  ) : "Waiting for live crack spread data...";

  const refineryEconomics = live?.refineryEconomics || liveEconomics;

 return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">

      <div className="space-y-5">

        {/* Row 1: Full-width Chart */}
        <div className="rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

          <h2 className="text-3xl font-black mb-6">
            Crack Spread Analytics
          </h2>

          <CrackChart data={effective} />

        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

          {/* Refinery Signal */}
          <div className="xl:col-span-2 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Refinery Signal
            </p>

            <h2 className="text-5xl font-black mt-4 text-orange-400">
              {signal}
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">

              <div>
                <p className="text-gray-400 text-sm">
                  Change
                </p>

                <p className="font-semibold">
                  {change != null
                    ? `${change > 0 ? "+" : ""}${change}`
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Trend
                </p>

                <p className="font-semibold">
                  {trend}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Current Crack
                </p>

                <p className="font-semibold">
                  {currentCrack != null
                    ? `$${currentCrack}`
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  5Y Average
                </p>

                <p className="font-semibold">
                  {fiveYearAverage != null
                    ? `$${fiveYearAverage}`
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Percentile
                </p>

                <p className="font-semibold">
                  {percentile != null
                    ? `${percentile}th`
                    : "N/A"}
                </p>
              </div>

            </div>

          </div>

          {/* Refinery Economics */}
          <div className="xl:col-span-3 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

            <h3 className="text-2xl font-bold mb-4">
              Refinery Economics
            </h3>

            <p className="text-gray-400 leading-relaxed text-lg">

              {refineryEconomics}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
