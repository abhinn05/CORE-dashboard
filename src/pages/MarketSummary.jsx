import { 
  useInventory, 
  useMarket,
  useCurve,
  useCrack,
  useCftc,
  useShipping,
  useMacro
} from "../hooks";
import {
  inventoryTrend,
} from "../analytics/inventoryEngine";
import { classifyCurve } from "../analytics/futuresCurve";
import { refinerySignal } from "../analytics/crackSpreadEngine";
import { positioningSignal } from "../analytics/cftcEngine";
import { macroRegime } from "../analytics/macroEngine";
import { shippingSignal } from "../analytics/shippingEngine";
import {
  marketBias,
  confidenceScore,
  marketDrivers
}
from "../analytics/marketSummaryEngine";

export default function MarketSummary() {
  const { data: liveInventory } = useInventory();
  const { data: liveMarket } = useMarket();
  const { data: liveCurve } = useCurve();
  const { data: liveCrack } = useCrack();
  const { data: liveCftc } = useCftc();
  const { data: liveShipping } = useShipping();
  const { data: liveMacro } = useMacro();

  const effectiveInventory = liveInventory?.inventoryData ?? (Array.isArray(liveInventory) && liveInventory.length > 0 ? liveInventory : []);
  const effectiveMarket = liveMarket ?? {};
  const effectiveCurve = liveCurve ?? [];
  const effectiveCrack = liveCrack ?? [];
  const effectiveCftc = liveCftc ?? [];
  const effectiveShipping = liveShipping ?? { shippingMetrics: {} };
  const effectiveMacro = liveMacro ?? { dxy: {}, pmi: {} };

  const inventorySignal = effectiveInventory.length > 1 ? inventoryTrend(effectiveInventory) : "N/A";

  const futuresPrices = effectiveCurve.map((item) => item.price).filter(Boolean);
  const futures = futuresPrices.length > 1 ? classifyCurve(futuresPrices) : "N/A";

  const crack = effectiveCrack.length > 1 ? refinerySignal(effectiveCrack) : "N/A";
  const cftc = effectiveCftc.length > 0 ? positioningSignal(effectiveCftc) : "N/A";
  
  const macro = (effectiveMacro.dxy?.change !== undefined && effectiveMacro.pmi?.value !== undefined)
    ? macroRegime(effectiveMacro)
    : "N/A";
    
  const shipping = Object.keys(effectiveShipping.shippingMetrics || {}).length > 0
    ? shippingSignal(effectiveShipping.shippingMetrics)
    : "N/A";

  const hasAnyData = futuresPrices.length > 1 || effectiveInventory.length > 1 || effectiveCrack.length > 1 || effectiveCftc.length > 0 || Object.keys(effectiveShipping.shippingMetrics || {}).length > 0;

  const bias = hasAnyData ?
    marketBias({
      futures,
      inventory: inventorySignal,
      crack,
      cftc,
      macro,
      shipping,
    }) : "N/A";

  const confidenceValue =
    confidenceScore({
      futures: futuresPrices.length > 1,
      inventory: effectiveInventory.length > 1,
      crack: effectiveCrack.length > 1,
      cftc: effectiveCftc.length > 0,
      macro: effectiveMacro.dxy?.change !== undefined,
      shipping: Object.keys(effectiveShipping.shippingMetrics || {}).length > 0,
    });
  const confidence = hasAnyData && confidenceValue > 0 ? confidenceValue : "N/A";

  const drivers =
    marketDrivers({
      inventory: inventorySignal,
      crack,
      cftc,
      macro,
      shipping,
    });

  return (
    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                AI GENERATED SUMMARY
            </p>

            <h2 className={`text-5xl font-black mt-4 ${bias.includes('Bearish') ? 'text-red-400' : bias.includes('Bullish') ? 'text-green-400' : 'text-gray-400'}`}>
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
                    • WTI {effectiveMarket.wti?.change ?? ''} signals prompt crude tension
                </div>

                <div>
                    • DXY at {effectiveMarket.dxy?.value ?? 'N/A'} remains the macro swing factor
                </div>

                <div>
                    • Inventory draw dynamics continue to define prompt balance
                </div>

                </div>

            </div>

        </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          CONFIDENCE
        </p>

        <h2 className="text-6xl font-black mt-5 text-cyan-400">
          {confidence !== "N/A" ? `${confidence}%` : "N/A"}
        </h2>

        <div className="mt-8 h-3 rounded-full bg-white/[0.05]">

          <div
            className="h-full rounded-full bg-cyan-400"
            style={{
              width:
                confidence !== "N/A" ? `${confidence}%` : "0%"
            }}
          />

        </div>

      </div>

    </div>
  );
}