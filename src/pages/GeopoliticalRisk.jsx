import { useGeopolitical } from "../hooks";

import {
  overallRisk,
  geopoliticalSignal,
  supplyAtRisk
}
from "../analytics/geopoliticalEngine";

export default function GeopoliticalRisk() {

  const { data: live } = useGeopolitical();
  const effective = live ?? [];

  const risk = effective.length > 0 ? overallRisk(effective) : null;
  const signal = effective.length > 0 ? geopoliticalSignal(effective) : "N/A";
  const percent = (value) => value == null || value === "N/A" ? "N/A" : String(value).includes("%") ? value : `${value}%`;
  const byRegion = Object.fromEntries(effective.map((item) => [item.region, item]));
  const level = (value) => value == null || value === "N/A" ? "N/A" : value >= 85 ? "Severe" : value >= 65 ? "Elevated" : value <= 40 ? "Low" : "Watch";

  const highestRiskRegion =
  effective.length > 0
    ? [...effective].sort(
        (a, b) => b.risk - a.risk
      )[0]
    : null;

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

      {effective.map((item) => {

  const riskColor =
    item.risk >= 85
      ? "text-red-400"
      : item.risk >= 75
      ? "text-orange-400"
      : "text-yellow-400";

  const bgRiskColor =
    item.risk >= 85
      ? "bg-red-400"
      : item.risk >= 75
      ? "bg-orange-400"
      : "bg-yellow-400";

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
          {percent(item.risk)}
        </span>
      </div>

      <div className="mt-4 h-2 bg-white/5 rounded-full">

        <div
          className={`h-2 ${bgRiskColor} rounded-full`}
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
          Supply At Risk
        </p>

        <h2 className="text-5xl font-black mt-4 text-red-300">
          {effective.length > 0 ? `${supplyAtRisk(effective)}M` : "N/A"}
        </h2>

        <p className="mt-3 text-gray-400">
          Barrels/day exposed
        </p>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Priority Monitor
        </p>

        <h2 className="text-5xl font-black mt-4 text-red-300">

          {highestRiskRegion?.region ?? "N/A"}

        </h2>

        <p className="mt-3 text-gray-400">

          {highestRiskRegion?.description ??
            "Waiting for live geopolitical data..."}

        </p>

        <div className="mt-6 flex justify-between">

          <span>Risk Score</span>

          <span>

            {percent(highestRiskRegion?.risk)}

          </span>

        </div>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Supply Vulnerability
        </p>

        <div className="mt-8 space-y-5">

          {effective.map((item) => (

            <div key={item.region}>

              <div className="flex justify-between mb-2">

                <span>

                  {item.region}

                </span>

                <span>

                  {percent(item.risk)}

                </span>

              </div>

              <div className="h-2 rounded-full bg-white/5">

                <div
                  className="h-full rounded-full bg-orange-400"
                  style={{
                    width: `${item.risk}%`
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Sanctions Impact
        </p>

        <h2 className="text-5xl font-black mt-4 text-yellow-300">
          {level(byRegion.Russia?.risk ?? risk)}
        </h2>

        <p className="mt-3 text-gray-400">
          {byRegion.Russia?.description ?? "Waiting for live geopolitical data..."}
        </p>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          OPEC Discipline
        </p>

        <h2 className="text-5xl font-black mt-4 text-orange-400">
          {level(byRegion.OPEC?.risk ?? risk)}
        </h2>

        <p className="mt-3 text-gray-400">
          {byRegion.OPEC?.description ?? "Waiting for live geopolitical data..."}
        </p>

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Route Congestion
        </p>

        <h2 className="text-5xl font-black mt-4 text-red-300">
          {percent(byRegion["Red Sea"]?.risk ?? risk)}
        </h2>

        <p className="mt-3 text-gray-400">
          {byRegion["Red Sea"]?.description ?? "Waiting for live geopolitical data..."}
        </p>

      </div>

    </div>

  );
}
