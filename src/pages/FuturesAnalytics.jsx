import CurveChart from "../components/futures/CurveChart";
import { useCurve } from "../hooks";

import {
  classifyCurve,
  curveSlope,
  steepness,
} from "../analytics/futuresCurve";

import { computeCalendarSpreads } from "../analytics/spreadEngine";
import { computeFlys } from "../analytics/flyEngine";

export default function FuturesAnalytics() {
  const { data: live } = useCurve();
  const effective = live ?? [];

  const prices = effective.map((item) => item.price);

  const regime = prices.length > 1 ? classifyCurve(prices) : "N/A";
  const slope = prices.length > 1 ? curveSlope(prices) : null;
  const steep = prices.length > 1 ? steepness(prices) : null;

  const spreads = prices.length > 1 ? computeCalendarSpreads(prices) : [];

  const flys = prices.length > 2 ? computeFlys(prices) : [];

  const liveInterpretation = prices.length > 1 ? (
    regime.includes("Backwardation") 
      ? `Current curve exhibits ${regime.toLowerCase()}. Prompt months trade at a premium to deferred contracts, suggesting tight near-term supply and strong current demand. Front-end spreads remain robust while the back-end curve slopes downward.`
      : regime.includes("Contango")
      ? `Current curve exhibits ${regime.toLowerCase()}. Deferred contracts trade above prompt months, suggesting adequate inventory levels and limited near-term supply stress. Front-end spreads remain soft while the back-end curve continues to steepen.`
      : `Current curve exhibits a ${regime.toLowerCase()} structure. Spreads are relatively flat, indicating a balanced market without significant near-term supply or demand stress.`
  ) : "Waiting for live curve data...";

  const marketInterpretation = live?.marketInterpretation || live?.interpretation || liveInterpretation;

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

      {/* Chart */}
      <div className="xl:col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
        <h2 className="text-3xl font-black mb-6">
          Futures Curve Analytics
        </h2>

        <CurveChart data={effective} />
      </div>

      {/* Regime */}
      <div className="xl:col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Current Regime
        </p>

        <h2 className={`text-5xl font-black mt-4 ${regime.includes('Contango') ? 'text-red-400' : regime.includes('Backwardation') ? 'text-green-400' : 'text-gray-400'}`}>
          {regime}
        </h2>

        <div className="mt-8 space-y-4">

          <div className="flex justify-between">
            <span className="text-gray-400">
              Curve Slope
            </span>

            <span>
          {slope != null ? slope.toFixed(2) : "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">
              Steepness
            </span>

            <span>
          {steep != null ? steep.toFixed(2) + "%" : "N/A"}
            </span>
          </div>

        </div>
      </div>

      {/* Spreads */}
      <div className="xl:col-span-6 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-5">
          Calendar Spreads
        </h3>

        <div className="space-y-3">
          {spreads.map((spread) => (
            <div
              key={spread.name}
              className="flex justify-between border-b border-white/[0.05] pb-2"
            >
              <span>{spread.name}</span>

              <span
                className={
                  spread.value > 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {spread.value}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Flys */}
      <div className="xl:col-span-6 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-5">
          Fly Analytics
        </h3>

        <div className="space-y-3">
          {flys.map((fly) => (
            <div
              key={fly.name}
              className="flex justify-between border-b border-white/[0.05] pb-2"
            >
              <span>{fly.name}</span>

              <span className="text-cyan-400">
                {fly.value}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* AI Interpretation */}
      <div className="col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Market Interpretation
        </h3>

        <p className="text-gray-400 leading-relaxed">
          {marketInterpretation}
        </p>

      </div>

    </div>
  </div>
  );
}