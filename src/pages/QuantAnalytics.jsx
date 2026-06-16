import {
  useCoreAnalytics,
} from "../hooks/useCoreAnalytics";

import RegimeCard from "../components/quant/RegimeCard";

import OpportunityCard from "../components/quant/OpportunityCard";

import ModelCard from "../components/quant/ModelCard";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from "recharts";

import { useQuant } from "../hooks";

import {
  getVolatilityColor,
} from "../analytics/quantEngine";

export default function QuantAnalytics() {
  const { data: live } = useQuant();
  const {
    regime,
    models,
    opportunities,
  } = useCoreAnalytics();
  console.log("PAGE REGIME:", regime);
  console.log("PAGE MODELS:", models);
  console.log("PAGE OPPS:", opportunities);
  const effective = live ?? {
    betaSeries: [],
    momentumSignals: [],
    volatilityRegimes: [],
    arbitrage: {},
    signalStrengths: [],
    stats: []
  };

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

      <div className="xl:col-span-7 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">

        <h2 className="text-4xl font-black">
          Quant Analytics
        </h2>

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-5">

          <div className="h-full rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6 flex flex-col">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Quant Themes
            </p>

            <div className="mt-5 space-y-3 text-sm text-gray-300">
              <p>{effective.quantThemesDescription ?? "Waiting for live quant data..."}</p>
              <div className="rounded-[18px] bg-white/[0.05] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Beta Regime</p>
                <p className="mt-2 text-white">{effective.betaSeries.slice(-1)[0]?.beta ?? "N/A"} latest</p>
              </div>
              <div className="rounded-[18px] bg-white/[0.05] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Momentum Breadth</p>
                <p className="mt-2 text-white">{effective.momentumSignals.length > 0 ? `${effective.momentumSignals.filter((item) => item.signal === "BUY").length} buy signals` : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Rolling Beta */}

          <div className="h-full rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6 flex flex-col">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Rolling Beta
            </p>

            <div className="flex-1 min-h-[110px] mt-4">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={effective.betaSeries}
                >
                  <Tooltip />

                  <Line
                    dataKey="beta"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

            </div>
          </div>

          {/* Volatility */}

          <div className="h-full rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6 flex flex-col">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Volatility Regime
            </p>

            <div className="flex gap-2 mt-8">

              {effective.volatilityRegimes.map(
                (regime, index) => (
                    <div
                        key={`${regime}-${index}`}
                        className={`flex-1 h-5 rounded-full ${getVolatilityColor(
                            regime
                        )}`}
                    />
                )
            )}

            </div>

            <div className="grid grid-cols-4 gap-2 mt-4 text-[10px] text-center text-gray-400">

                {effective.volatilityRegimes.map(
                  (regime, index) => (
                      <div key={`${regime}-${index}`}>
                          {regime}
                      </div>
                  )
              )}

            </div>
          </div>

          {/* Momentum */}

          <div className="h-full rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6 flex flex-col">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Momentum Signals
            </p>

            <div className="space-y-4 mt-6">

              {effective.momentumSignals.map(
                (item) => (
                  <div
                    key={item.asset}
                    className="flex justify-between"
                  >
                    <span className="text-gray-400">
                      {item.asset}
                    </span>

                    <span
                      className={
                        item.signal === "BUY"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {item.signal}
                    </span>
                  </div>
                )
              )}

            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-5">

          <div className="rounded-[24px] bg-[#111827] border border-purple-500/10 p-5">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Spread Z-Score
            </p>

              <h3 className="text-5xl font-black mt-4 text-purple-400">
              {effective.zScore != null ? `${effective.zScore}σ` : "N/A"}
            </h3>

            <p className="text-gray-400 mt-3 text-sm">
              {effective.zScore != null ? (Math.abs(effective.zScore) > 1.5 ? "Elevated deviation from mean" : "Within normal ranges") : "Waiting for live data..."}
            </p>

          </div>

          <div className="rounded-[24px] bg-[#111827] border border-purple-500/10 p-5">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Statistical Arbitrage
            </p>

            <h3 className="text-3xl font-bold mt-4 text-purple-300">
              {effective.arbitrage?.strategy ?? "N/A"}
            </h3>

              <p className="text-gray-400 mt-3 text-sm">
              {effective.arbitrage?.description ?? "Waiting for live quant data..."}
            </p>

          </div>
        </div>
      </div>

      <div className="xl:col-span-5 rounded-[28px] bg-[#0f172a] border border-white/[0.05] p-8">

        <h3 className="text-2xl font-semibold">
          Signal Strength
        </h3>

        <div className="mt-8 space-y-8">

          {effective.signalStrengths.map(
            (item) => (
              <div key={item.name}>

                <div className="flex justify-between mb-1">
                  <span>{item.name}</span>
                  <span className="text-cyan-400">
                    {String(item.value).includes("%") ? item.value : `${item.value}%`}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">

                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{
                      width: `${item.value}%`,
                    }}
                  />

                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">

          {effective.stats.map(
            (item) => (
              <div
                key={item.label}
                className="rounded-[16px] bg-[#111827] border border-purple-500/10 p-3"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  {item.label}
                </p>

                <h3 className="text-lg font-bold mt-2 text-purple-300">
                  {item.value}
                </h3>
              </div>
            )
          )}
        </div>
            </div>

    </div>

   <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-5">

      <div className="xl:col-span-3 space-y-5">

        <RegimeCard
          regime={regime}
        />

        <OpportunityCard
          opportunities={opportunities}
        />

      </div>

      <div className="xl:col-span-9">

        <ModelCard
          models={models}
        />

      </div>

    </div>

  </div>
  );
}
