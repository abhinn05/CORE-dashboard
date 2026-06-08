import MetricCard from "../components/MetricCard";
import MacroCard from "../components/macro/MacroCard";
import { useMacro, useMarket } from "../hooks";

import {
  dollarSignal,
  manufacturingDemandSignal,
  macroRegime,
}
from "../analytics/macroEngine";

export default function MacroAnalytics() {

  const { data: liveMacro } = useMacro();
  const { data: liveMarket } = useMarket();

  const effectiveMacro = liveMacro ?? { dxy: {}, cpi: {}, fedFunds: {}, gdp: {}, payrolls: {}, pmi: {}, economicCalendar: [] };
  const effectiveMarket = liveMarket ?? { dxy: {} };

  const dollar = dollarSignal(effectiveMacro.dxy || {});
  const manufacturing = manufacturingDemandSignal(effectiveMacro.pmi || {});
  const regime = macroRegime(effectiveMacro);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">

      <div className="col-span-1">
          <MetricCard
          title="DXY"
          value={effectiveMarket.dxy?.value}
          change={effectiveMarket.dxy?.change}
          trend={effectiveMarket.dxy?.trend}
        />
      </div>

      <div className="col-span-1">
        <MacroCard
          title="CPI"
          value={effectiveMacro.cpi?.value}
          change={effectiveMacro.cpi?.change}
        />
      </div>

      <div className="col-span-1">
        <MacroCard
          title="Fed Funds"
          value={effectiveMacro.fedFunds?.value}
          change={effectiveMacro.fedFunds?.change}
        />
      </div>

      <div className="col-span-1">
        <MacroCard
          title="GDP"
          value={effectiveMacro.gdp?.value}
          change={effectiveMacro.gdp?.change}
        />
      </div>

      <div className="col-span-1">
        <MacroCard
          title="Payrolls"
          value={effectiveMacro.payrolls?.value}
          change={effectiveMacro.payrolls?.change}
        />
      </div>

      <div className="col-span-2">
        <MacroCard
          title="Manufacturing PMI"
          value={effectiveMacro.pmi?.value}
          change={effectiveMacro.pmi?.change}
        />
      </div>

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-6">
          Economic Calendar
        </h2>

        <div className="space-y-4">

          {effectiveMacro.economicCalendar.length > 0 ? (
            effectiveMacro.economicCalendar.map(
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
            )
          ) : (
            <p className="text-sm text-gray-500">Waiting for live calendar data...</p>
          )}

        </div>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Macro Regime
        </p>

        <h2 className={`text-5xl font-black mt-4 ${regime.includes('Bearish') ? 'text-red-400' : regime.includes('Bullish') ? 'text-green-400' : 'text-gray-400'}`}>
          {regime}
        </h2>

        <div className="mt-8 space-y-4">

            <div className="flex justify-between">
                <span>DXY Signal</span>
                <span>{dollar}</span>
            </div>

            <div className="flex justify-between">
                <span>Manufacturing Demand</span>
                <span>{manufacturing}</span>
            </div>

            <div className="flex justify-between">
                <span>Macro Score</span>
                <span>{effectiveMacro.macroScore ?? "N/A"}</span>
            </div>

            <div className="flex justify-between">
                <span>Oil Impact</span>

                <span className={effectiveMacro.oilImpact?.includes("Negative") ? "text-red-400" : "text-gray-400"}>
                    {effectiveMacro.oilImpact ?? "N/A"}
                </span>
            </div>

        </div>

      </div>

    </div>
  </div>
  );
}
