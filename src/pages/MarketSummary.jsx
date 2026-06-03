import {
  marketBias,
  confidenceScore,
  marketDrivers
}
from "../analytics/marketSummaryEngine";

export default function MarketSummary() {

  const bias =
    marketBias({
      futures:
        "Deep Contango",

      inventory:
        "Bullish Draw",

      crack:
        "Very Bullish",

      cftc:
        "Extremely Bullish",

      macro:
        "Bullish Macro",

      shipping:
        "Severely Bullish"
    });

  const confidence =
    confidenceScore({
      futures: true,
      inventory: true,
      crack: true,
      cftc: true,
      macro: true,
      shipping: true
    });

  const drivers =
    marketDrivers({
      inventory:
        "Bullish Draw",

      crack:
        "Very Bullish",

      cftc:
        "Extremely Bullish",

      macro:
        "Bullish Macro",

      shipping:
        "Severely Bullish"
    });

  return (
    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                AI GENERATED SUMMARY
            </p>

            <h2 className="text-5xl font-black mt-4 text-green-400">
                {bias}
            </h2>

            <div className="mt-8 space-y-4">

                {drivers.map(
                (driver) => (
                    <div
                    key={driver}
                    className="text-lg"
                    >
                    ✓ {driver}
                    </div>
                )
                )}

            </div>

            {/* ADD THIS HERE */}

            <div className="mt-10">

                <h3 className="text-xl font-bold mb-4">
                Risk Factors
                </h3>

                <div className="space-y-3">

                <div>
                    • Crowded Fund Positioning
                </div>

                <div>
                    • Elevated Freight Costs
                </div>

                <div>
                    • Macro Event Volatility
                </div>

                </div>

            </div>

        </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          CONFIDENCE
        </p>

        <h2 className="text-6xl font-black mt-5 text-cyan-400">
          {confidence}%
        </h2>

        <div className="mt-8 h-3 rounded-full bg-white/[0.05]">

          <div
            className="h-full rounded-full bg-cyan-400"
            style={{
              width:
                `${confidence}%`
            }}
          />

        </div>

      </div>

    </div>
  );
}