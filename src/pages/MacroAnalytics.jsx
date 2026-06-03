import MetricCard from "../components/MetricCard";
import MacroCard from "../components/macro/MacroCard";

import {
  marketData,
} from "../data/marketData";

import {
  macroData,
  economicCalendar,
} from "../data/macroData";

import {
  dollarSignal,
  chinaDemandSignal,
  macroRegime,
}
from "../analytics/macroEngine";

export default function MacroAnalytics() {

  const dollar =
    dollarSignal(macroData.dxy);

  const china =
    chinaDemandSignal(
      macroData.pmi
    );

  const regime =
    macroRegime(macroData);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">

      <div className="col-span-1">
        <MetricCard
          title="DXY"
          value={marketData.dxy.value}
          change={marketData.dxy.change}
          trend={marketData.dxy.trend}
        />
      </div>

      <div className="col-span-1">
        <MacroCard
          title="CPI"
          value={macroData.cpi.value}
          change={macroData.cpi.change}
        />
      </div>

      <div className="col-span-1">
        <MacroCard
          title="Fed Funds"
          value={macroData.fedFunds.value}
          change={macroData.fedFunds.change}
        />
      </div>

      <div className="col-span-1">
        <MacroCard
          title="GDP"
          value={macroData.gdp.value}
          change={macroData.gdp.change}
        />
      </div>

      <div className="col-span-1">
        <MacroCard
          title="Payrolls"
          value={macroData.payrolls.value}
          change={macroData.payrolls.change}
        />
      </div>

      <div className="col-span-2">
        <MacroCard
          title="China PMI"
          value={macroData.pmi.value}
          change={macroData.pmi.change}
        />
      </div>

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-6">
          Economic Calendar
        </h2>

        <div className="space-y-4">

          {economicCalendar.map(
            (item) => (
              <div
                key={item.event}
                className="flex justify-between border-b border-white/[0.05] pb-3"
              >
                <span>
                  {item.event}
                </span>

                <span className="text-orange-400">
                  {item.date}
                </span>
              </div>
            )
          )}

        </div>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Macro Regime
        </p>

        <h2 className="text-5xl font-black mt-4 text-green-400">
          {regime}
        </h2>

        <div className="mt-8 space-y-4">

            <div className="flex justify-between">
                <span>DXY Signal</span>
                <span>{dollar}</span>
            </div>

            <div className="flex justify-between">
                <span>China Demand</span>
                <span>{china}</span>
            </div>

            <div className="flex justify-between">
                <span>Macro Score</span>
                <span>82 / 100</span>
            </div>

            <div className="flex justify-between">
                <span>Oil Impact</span>

                <span className="text-green-400">
                    Strong Positive
                </span>
            </div>

        </div>

      </div>

    </div>
  </div>
  );
}