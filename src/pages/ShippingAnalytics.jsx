import ShippingChart
from "../components/shipping/ShippingChart";

import {
  shippingData,
  shippingMetrics,
}
from "../data/shippingData";

import {
  freightChange,
  freightTrend,
  shippingSignal,
}
from "../analytics/shippingEngine";

export default function ShippingAnalytics() {

  const change =
    freightChange(shippingData);

  const trend =
    freightTrend(shippingData);

  const signal =
    shippingSignal(shippingMetrics);

  return (
    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-6">
          Shipping Intelligence
        </h2>

        <ShippingChart
          data={shippingData}
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
            <span>Freight Change</span>
            <span>+{change}</span>
          </div>

          <div className="flex justify-between">
            <span>Route Risk</span>
            <span>{shippingMetrics.redSeaRisk}</span>
          </div>

          <div className="flex justify-between">
            <span>Transit Delay</span>
            <span>{shippingMetrics.transitDelay} days</span>
          </div>

          <div className="flex justify-between">
            <span>
              Floating Storage
            </span>

            <span>
              {shippingMetrics.floatingStorage}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              Baltic Dirty
            </span>

            <span>
              {shippingMetrics.balticDirty}
            </span>
          </div>

        </div>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
        <h3 className="text-2xl font-bold">
          VLCC
        </h3>

        <h2 className="text-5xl font-black mt-4 text-cyan-400">
          {shippingMetrics.vlcc}
        </h2>
      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
        <h3 className="text-2xl font-bold">
          Suezmax
        </h3>

        <h2 className="text-5xl font-black mt-4 text-green-400">
          {shippingMetrics.suezmax}
        </h2>
      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
              <h3 className="text-2xl font-bold">
                Aframax
              </h3>

              <h2 className="text-5xl font-black mt-4 text-orange-400">
                {shippingMetrics.aframax}
              </h2>
            </div>

            <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold">
          Baltic Dirty
        </h3>

        <h2 className="text-5xl font-black mt-4 text-cyan-400">
          {shippingMetrics.balticDirty}
        </h2>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold">
          Port Congestion
        </h3>

        <h2 className="text-5xl font-black mt-4 text-red-400">
          {shippingMetrics.portCongestion}%
        </h2>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold">
          Weather Risk
        </h3>

        <h2 className="text-5xl font-black mt-4 text-orange-400">
          {shippingMetrics.weatherRisk}
        </h2>

      </div>

      <div className="col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Freight Market Interpretation
        </h3>

        <p className="text-gray-400 leading-relaxed">

          Elevated freight rates and supply-chain pressures continue to increase transport costs, supporting regional crude dislocations and tightening prompt logistics.

        </p>

      </div>

    </div>
  );
}