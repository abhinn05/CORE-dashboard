import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
  YAxis,
} from "recharts";

import { marketData } from "../data/marketData";
import MetricCard from "../components/MetricCard";
import SectionHeader from "../components/SectionHeader";
import DashboardCard from "../components/DashboardCard";
import AlertCenter from "../components/AlertCenter";
import TradeRecommendation from "../components/TradeRecommendation";

const intelligenceCards = [
  {
    title: "Inventory Signal",
    value: marketData.inventory.value,
    detail: "Current inventory draw remains a primary supply signal.",
    accent: "Bullish",
  },
  {
    title: "CFTC Positioning",
    value: `${marketData.cftc.net}k net`,
    detail: "Long bias remains dominant.",
    accent: marketData.cftc.sentiment,
  },
  {
    title: "Shipping Risk",
    value: "73%",
    detail: "Red Sea disruptions remain priced in.",
    accent: "High",
  },
  {
    title: "Macro Regime",
    value: "Bullish",
    detail: "Dollar weakness supports energy demand.",
    accent: "Medium",
  },
  {
    title: "Geopolitical Risk",
    value: "Critical",
    detail: "Risk premiums remain elevated.",
    accent: "Critical",
  },
  {
    title: "Correlation Regime",
    value: "Clustered",
    detail: "Energy complex remains aligned.",
    accent: "Neutral",
  },
];

const dashboardNavigation = [
  {
    title: "Full Intelligence Feed",
    description: "Open the dedicated News Intelligence page for the complete real-time headline feed.",
    action: "news",
  },
  {
    title: "Geopolitical Risk",
    description: "Review event escalation, region-specific risk scores, and supply impact in the geopolitics hub.",
    action: "geo",
  },
  {
    title: "Inventory Analytics",
    description: "See the full inventory history, draw analysis, and storage trends in the dedicated page.",
    action: "inventory",
  },
];

export default function MasterDashboard({ openTab }) {
  const kpis = useMemo(() => marketData.kpis, []);
  const alerts = useMemo(() => marketData.alertRules, []);
  const recommendation = useMemo(() => marketData.tradeRecommendation, []);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden space-y-4 pb-6">
      <SectionHeader
        title="Command Center"
        subtitle="CORE Energy Intelligence Dashboard"
      />

      {/* KPI quick row removed as requested */}

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.3fr_0.9fr_0.9fr] items-start">
        <div className="space-y-3">
          <DashboardCard title="WTI Price Signal" badge="Market" className="p-2">
            <div className="h-[130px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData.priceHistory} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.65} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff14" vertical={false} />
                  <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip contentStyle={{ backgroundColor: "#08101c", borderColor: "#ffffff14" }} />
                  <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="url(#mainGradient)" strokeWidth={3} baseValue="dataMin" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {intelligenceCards.map((card) => (
              <DashboardCard key={card.title} title={card.title} badge={card.accent} className="p-4">
                <p className="text-3xl font-black text-white">{card.value}</p>
                <p className="mt-3 text-sm text-gray-400">{card.detail}</p>
              </DashboardCard>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <DashboardCard title="AI Market Signal" badge="Signal">
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>Current outlook</span>
                <span className="text-green-400">Bullish</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Volatility</span>
                <span className="text-amber-300">Elevated</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Supply momentum</span>
                <span className="text-green-400">Tightening</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Demand signal</span>
                <span className="text-cyan-400">Stable</span>
              </div>
            </div>
          </DashboardCard>

          <TradeRecommendation recommendation={recommendation} />
        </div>

        <div className="space-y-5">
          <AlertCenter alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
