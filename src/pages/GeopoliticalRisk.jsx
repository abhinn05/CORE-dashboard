import { geopoliticalData }
from "../data/geopoliticalData";

import {
  overallRisk,
  geopoliticalSignal,
  supplyAtRisk
}
from "../analytics/geopoliticalEngine";

export default function GeopoliticalRisk() {

  const risk =
    overallRisk(
      geopoliticalData
    );

  const signal =
    geopoliticalSignal(
      geopoliticalData
    );

  return (

    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">

          Geopolitical Monitor

        </p>

        <h1 className="text-5xl font-black mt-4">

          Global Oil Risk Intelligence

        </h1>

      </div>

      {geopoliticalData.map((item) => {

  const riskColor =
    item.risk >= 85
      ? "text-red-400"
      : item.risk >= 75
      ? "text-orange-400"
      : "text-yellow-400";

  return (

    <div
      key={item.region}
      className="col-span-3 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6"
    >

      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
        {item.region}
      </p>

      <h2 className={`text-4xl font-black mt-4 ${riskColor}`}>
        {item.status}
      </h2>

      <p className="mt-4 text-gray-400">
        {item.description}
      </p>

      <div className="mt-8 flex justify-between">
        <span>Risk Score</span>

        <span className="font-bold">
          {item.risk}
        </span>
      </div>

      <div className="mt-4 h-2 bg-white/5 rounded-full">

        <div
          className="h-2 bg-orange-400 rounded-full"
          style={{
            width: `${item.risk}%`
          }}
        />

      </div>

    </div>

  );

})}

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Overall Risk
        </p>

        <h2 className="text-5xl font-black mt-4 text-red-400">
          {signal}
        </h2>

        <div className="mt-8 flex justify-between">
          <span>Risk Score</span>
          <span>{risk}</span>
        </div>

        <div className="mt-4 h-2 bg-white/5 rounded-full">

          <div
            className="h-2 bg-red-400 rounded-full"
            style={{
              width: `${risk}%`
            }}
          />

        </div>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Supply At Risk
        </p>

        <h2 className="text-5xl font-black mt-4 text-red-300">
          {supplyAtRisk()}M
        </h2>

        <p className="mt-3 text-gray-400">
          Barrels/day exposed
        </p>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Shipping Stress
        </p>

        <h2 className="text-5xl font-black mt-4 text-orange-400">
          82%
        </h2>

        <p className="mt-3 text-gray-400">
          Red Sea route pressure
        </p>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Sanctions Impact
        </p>

        <h2 className="text-5xl font-black mt-4 text-yellow-300">
          Severe
        </h2>

        <p className="mt-3 text-gray-400">
          Russian crude flows affected
        </p>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          OPEC Discipline
        </p>

        <h2 className="text-5xl font-black mt-4 text-orange-400">
          Strong
        </h2>

        <p className="mt-3 text-gray-400">
          Production cuts maintained
        </p>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Route Congestion
        </p>

        <h2 className="text-5xl font-black mt-4 text-red-300">
          72%
        </h2>

        <p className="mt-3 text-gray-400">
          Suez route pressure
        </p>

      </div>

    </div>

  );
}