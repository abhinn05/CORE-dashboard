import ShippingChart
from "../components/shipping/ShippingChart";
import { useShipping } from "../hooks";

import {
  freightChange,
  freightTrend,
  shippingSignal,
}
from "../analytics/shippingEngine";

export default function ShippingAnalytics() {

  const { data: live } = useShipping();
  const effective = live ?? { shippingData: [], shippingMetrics: {} };

  const change = effective.shippingData?.length > 1 ? freightChange(effective.shippingData) : null;
  const trend = effective.shippingData?.length > 1 ? freightTrend(effective.shippingData) : "N/A";
  const signal = Object.keys(effective.shippingMetrics || {}).length > 0 ? shippingSignal(effective.shippingMetrics) : "N/A";
  const percent = (value) => value == null ? "N/A" : String(value).includes("%") ? value : `${value}%`;
  const signed = (value) => value == null ? "N/A" : `${value > 0 ? "+" : ""}${value}`;

  const liveInterpretation = effective.shippingData?.length > 1 ? (
    signal.includes("Bullish") 
      ? `Elevated port congestion and rising transit delays are constraining prompt crude availability. Strong export demand combined with logistical bottlenecks is actively supporting physical premiums.`
      : `Physical flow logistics remain largely unimpeded. Healthy floating storage and efficient transit metrics suggest adequate near-term supply availability without significant bottleneck premiums.`
  ) : "Waiting for live shipping data...";
  const flowMarketInterpretation = effective.flowMarketInterpretation || liveInterpretation;

  return (
    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-6">
          Petroleum Flow Intelligence
        </h2>

        <ShippingChart
          data={effective.shippingData}
        />

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Shipping Signal
        </p>

        <h2 className="text-5xl font-black mt-4 text-orange-400">
          {signal}
        </h2>

        <div className="mt-8 space-y-4">

          <div className="flex justify-between">
            <span>Trend</span>
            <span>{trend}</span>
          </div>

          <div className="flex justify-between">
            <span>Flow Change</span>
            <span>{signed(change)}</span>
          </div>

          <div className="flex justify-between">
            <span>Flow Pressure</span>
            <span>{percent(effective.shippingMetrics.redSeaRisk)}</span>
          </div>

          <div className="flex justify-between">
            <span>Flow Delay Proxy</span>
            <span>{effective.shippingMetrics?.transitDelay != null ? `${effective.shippingMetrics.transitDelay} days` : "N/A"}</span>
          </div>

          <div className="flex justify-between">
            <span>
              Floating Storage
            </span>

            <span>
              {percent(effective.shippingMetrics?.floatingStorage)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              Total Crude Flow
            </span>

            <span>
              {effective.shippingMetrics?.balticDirty ?? "N/A"}
            </span>
          </div>

        </div>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
        <h3 className="text-2xl font-bold">
          Export Pressure
        </h3>

          <h2 className="text-5xl font-black mt-4 text-cyan-400">
          {percent(effective.shippingMetrics?.vlcc)}
        </h2>
      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
        <h3 className="text-2xl font-bold">
          Flow Pressure
        </h3>

          <h2 className="text-5xl font-black mt-4 text-green-400">
          {percent(effective.shippingMetrics?.suezmax)}
        </h2>
      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
              <h3 className="text-2xl font-bold">
                Import Pressure
              </h3>

              <h2 className="text-5xl font-black mt-4 text-orange-400">
                {percent(effective.shippingMetrics?.aframax)}
              </h2>
            </div>

            <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold">
          Total Crude Flow
        </h3>

            <h2 className="text-5xl font-black mt-4 text-cyan-400">
          {effective.shippingMetrics?.balticDirty ?? "N/A"}
        </h2>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold">
          Flow Congestion
        </h3>

          <h2 className="text-5xl font-black mt-4 text-red-400">
          {percent(effective.shippingMetrics?.portCongestion)}
        </h2>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold">
          Flow Volatility
        </h3>

          <h2 className="text-5xl font-black mt-4 text-orange-400">
          {percent(effective.shippingMetrics?.weatherRisk)}
        </h2>

      </div>

      <div className="col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Flow Market Interpretation
        </h3>

        <p className="text-gray-400 leading-relaxed">
          {flowMarketInterpretation}
        </p>

      </div>

    </div>
  );
}
