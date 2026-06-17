import CorrelationHeatmap from "../components/correlation/CorrelationHeatmap";
import { useCorrelation } from "../hooks";

import {
  strongestPositive,
  strongestNegative,
  marketRegime
}
from "../analytics/correlationEngine";

export default function CorrelationAnalytics() {

  const { data: live } = useCorrelation();
  const effective = live ?? [];

  const positives = effective.length > 0 ? strongestPositive(effective) : [];
  const negatives = effective.length > 0 ? strongestNegative(effective) : [];
  const regime = effective.length > 0 ? marketRegime(effective) : "Neutral";

  const liveInterpretation = effective.length > 0 ? (
    regime === "Clustered"
      ? `Market correlations are tightly clustered across the energy complex. Strong linkages signal regime-based positioning, meaning macro forces and broader market flows are driving crude prices more than isolated supply/demand fundamentals.`
      : `Energy complex correlations are currently decoupled. Assets are trading on idiosyncratic fundamentals rather than broader macro flows, allowing for greater relative value and spread opportunities.`
  ) : "Waiting for live correlation data...";
  const aiInterpretation = live?.aiInterpretation || liveInterpretation;

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

      <div className="xl:col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-2">
          Cross-Asset Relationships
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Energy correlations across macro, currencies, and refined products
        </p>

        <CorrelationHeatmap
          data={effective}
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

      {/* <div className="col-span-6 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Strong Positive
        </h3>

        {positives.length > 0 ? (
          positives.map((x) => (
            <div
              key={x.asset}
              className="flex justify-between py-2"
            >
              <span>{x.asset}</span>
              <span className="text-green-400">
                {x.value}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Waiting for live data...</p>
        )}

      </div> */}

      {/* <div className="col-span-6 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Strong Negative
        </h3>

        {negatives.length > 0 ? (
          negatives.map((x) => (
            <div
              key={x.asset}
              className="flex justify-between py-2"
            >
              <span>{x.asset}</span>
              <span className="text-red-400">
                {x.value}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Waiting for live data...</p>
        )}

      </div> */}

      <div className="xl:col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-6">

          Key Relationships

        </h3>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {positives.slice(0,3).map((item) => (

            <div
              key={item.asset}
              className="rounded-[20px] bg-white/[0.03] border border-white/[0.04] p-5"
            >

              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">

                Strong Link

              </p>

              <h4 className="text-xl font-bold mt-3">

                {item.asset}

              </h4>

              <p className="mt-3 text-green-400">

                Correlation: {item.value}

              </p>

            </div>

          ))}

        </div>

      </div>

      <div className="xl:col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Cross-Asset Commentary
        </h3>

        <p className="text-gray-400 leading-relaxed">
          {aiInterpretation}
        </p>

      </div>

      </div>
    </div>
  );
}