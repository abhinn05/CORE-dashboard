import CorrelationHeatmap from "../components/correlation/CorrelationHeatmap";

import {
  correlations
}
from "../data/correlationData";

import {
  strongestPositive,
  strongestNegative,
  marketRegime
}
from "../analytics/correlationEngine";

export default function CorrelationAnalytics() {

  const positives =
    strongestPositive(
      correlations
    );

  const negatives =
    strongestNegative(
      correlations
    );

  const regime =
    marketRegime(
      correlations
    );

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

      <div className="xl:col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-6">
          Correlation Matrix
        </h2>

        <CorrelationHeatmap
          data={correlations}
        />

      </div>

      <div className="xl:col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Market Regime
        </p>

        <h2 className="text-5xl font-black mt-4 text-cyan-400">
          {regime}
        </h2>

      </div>

      <div className="col-span-6 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Strong Positive
        </h3>

        {positives.map((x) => (
          <div
            key={x.asset}
            className="flex justify-between py-2"
          >
            <span>{x.asset}</span>
            <span className="text-green-400">
              {x.value}
            </span>
          </div>
        ))}

      </div>

      <div className="col-span-6 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Strong Negative
        </h3>

        {negatives.map((x) => (
          <div
            key={x.asset}
            className="flex justify-between py-2"
          >
            <span>{x.asset}</span>
            <span className="text-red-400">
              {x.value}
            </span>
          </div>
        ))}

      </div>

      <div className="xl:col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          AI Interpretation
        </h3>

        <p className="text-gray-400 leading-relaxed">
          Market correlations are clustering across the energy complex, showing the strongest positive linkages in
          refined products and the deepest negative divergence with macro risk factors. This signals regime-based
          positioning rather than isolated commodity moves.
        </p>

      </div>

      </div>
    </div>
  );
}