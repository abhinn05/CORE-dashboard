import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import DashboardCard from "../components/DashboardCard";
import SectionHeader from "../components/SectionHeader";
import { useMarket } from "../hooks";

export default function PortfolioRisk() {
  const { data: liveMarket } = useMarket();
  const effectiveRisk = liveMarket?.portfolioRisk ?? {};
  const memoizedRiskData = useMemo(() => effectiveRisk.riskData ?? [], [effectiveRisk.riskData]);
  
  const summaryMetrics = [
    { title: "Long Exposure", value: effectiveRisk.longExposure ?? "N/A" },
    { title: "Short Exposure", value: effectiveRisk.shortExposure ?? "N/A" },
    { title: "Net Exposure", value: effectiveRisk.netExposure ?? "N/A" },
    { title: "VaR", value: effectiveRisk.var ?? "N/A" },
    { title: "Drawdown", value: effectiveRisk.drawdown ?? "N/A" },
    { title: "Risk Budget", value: effectiveRisk.riskBudget ?? "N/A" },
  ];

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden space-y-5 pb-8">
      <SectionHeader
        title="Portfolio Risk"
        subtitle="Position and capital management"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {summaryMetrics.map((metric) => (
          <DashboardCard key={metric.title} title={metric.title} className="p-5">
            <p className="text-4xl font-black text-white">{metric.value}</p>
          </DashboardCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <DashboardCard title="Exposure Profile" className="xl:col-span-2">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoizedRiskData} margin={{ top: 20, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#ffffff14" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ backgroundColor: "#08101c", borderColor: "#ffffff14" }} />
                <Legend wrapperStyle={{ color: "#94a3b8" }} />
                <Bar dataKey="long" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                <Bar dataKey="short" fill="#fb7185" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Net Exposure" className="p-0">
          <div className="h-[320px] px-4 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoizedRiskData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ backgroundColor: "#08101c", borderColor: "#ffffff14" }} />
                <Area type="monotone" dataKey="net" stroke="#38bdf8" fill="url(#netGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <DashboardCard title="Capital Usage">
          <p className="text-gray-400">
            {effectiveRisk.capitalUsage ?? "Waiting for live portfolio data..."}
          </p>
        </DashboardCard>
        {/* <DashboardCard title="Stress Scenario">
          <p className="text-gray-400">
            {effectiveRisk.stressScenario ?? "Waiting for live portfolio data..."}
          </p>
        </DashboardCard> */}
        <DashboardCard title="Liquidity Profile">
          <p className="text-gray-400">
            {effectiveRisk.liquidityProfile ?? "Waiting for live portfolio data..."}
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
