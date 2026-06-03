import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from "recharts";

import quantData from "../data/quantData";

import {
  correlationColor,
  getVolatilityColor,
} from "../analytics/quantEngine";

export default function QuantAnalytics() {
  return (
    <div className="h-full grid grid-cols-12 gap-5">

      <div className="col-span-7 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">

        <h2 className="text-4xl font-black">
          Quant Analytics
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-5">

          <div className="h-[180px] rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Quant Themes
            </p>

            <div className="mt-5 space-y-3 text-sm text-gray-300">
              <p>Volatility regimes and beta trends are highlighted here. For full cross-asset correlation visuals, use the Correlation page.</p>
              <div className="rounded-[18px] bg-white/[0.05] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Beta Regime</p>
                <p className="mt-2 text-white">{quantData.betaSeries.slice(-1)[0]?.beta ?? "N/A"} latest</p>
              </div>
              <div className="rounded-[18px] bg-white/[0.05] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Momentum Breadth</p>
                <p className="mt-2 text-white">{quantData.momentumSignals.filter((item) => item.signal === "BUY").length} buy signals</p>
              </div>
            </div>
          </div>

          {/* Rolling Beta */}

          <div className="h-[180px] rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Rolling Beta
            </p>

            <div className="h-[110px] mt-4">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={quantData.betaSeries}
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

          <div className="h-[180px] rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Volatility Regime
            </p>

            <div className="flex gap-2 mt-8">

              {quantData.volatilityRegimes.map(
                (regime) => (
                  <div
                    key={regime}
                    className={`flex-1 h-5 rounded-full ${getVolatilityColor(
                      regime
                    )}`}
                  />
                )
              )}

            </div>

            <div className="grid grid-cols-4 gap-2 mt-4 text-[10px] text-center text-gray-400">

              {quantData.volatilityRegimes.map(
                (regime) => (
                  <div key={regime}>
                    {regime}
                  </div>
                )
              )}

            </div>
          </div>

          {/* Momentum */}

          <div className="h-[180px] rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Momentum Signals
            </p>

            <div className="space-y-4 mt-6">

              {quantData.momentumSignals.map(
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

        <div className="mt-6 grid grid-cols-2 gap-5">

          <div className="rounded-[24px] bg-[#111827] border border-purple-500/10 p-5">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Spread Z-Score
            </p>

            <h3 className="text-5xl font-black mt-4 text-purple-400">
              {quantData.zScore}σ
            </h3>

            <p className="text-gray-400 mt-3 text-sm">
              Elevated deviation from mean
            </p>

          </div>

          <div className="rounded-[24px] bg-[#111827] border border-purple-500/10 p-5">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Statistical Arbitrage
            </p>

            <h3 className="text-3xl font-bold mt-4 text-purple-300">
              {quantData.arbitrage.strategy}
            </h3>

            <p className="text-gray-400 mt-3 text-sm">
              {quantData.arbitrage.description}
            </p>

          </div>
        </div>
      </div>

      <div className="col-span-5 rounded-[28px] bg-[#0f172a] border border-white/[0.05] p-8">

        <h3 className="text-2xl font-semibold">
          Signal Strength
        </h3>

        <div className="mt-8 space-y-6">

          {quantData.signalStrengths.map(
            (item) => (
              <div key={item.name}>

                <div className="flex justify-between mb-3">
                  <span>{item.name}</span>
                  <span className="text-cyan-400">
                    Strong
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

        <div className="mt-8 grid grid-cols-2 gap-3">

          {quantData.stats.map(
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
  );
}