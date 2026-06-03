import DashboardCard from "../components/DashboardCard";
import SectionHeader from "../components/SectionHeader";

const riskPanels = [
  {
    title: "Market Volatility",
    score: "HIGH",
    detail: "Energy vol metrics remain above their 30-day averages.",
    color: "text-orange-400",
  },
  {
    title: "Liquidity Buffer",
    score: "Moderate",
    detail: "Capital reserves remain aligned to a conservative risk budget.",
    color: "text-cyan-400",
  },
  {
    title: "Macro Shock",
    score: "Elevated",
    detail: "Rate and dollar moves are the primary shock drivers.",
    color: "text-red-400",
  },
  {
    title: "Position Defense",
    score: "14%",
    detail: "Current risk budget is preserved through selective hedging.",
    color: "text-green-400",
  },
];

export default function Risk() {
  return (
    <div className="space-y-5">
      <SectionHeader title="Risk Monitor" subtitle="Core risk factors and stress signals" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {riskPanels.map((panel) => (
          <DashboardCard key={panel.title} title={panel.title} className="p-5">
            <p className={`text-4xl font-black ${panel.color}`}>{panel.score}</p>
            <p className="mt-4 text-gray-400">{panel.detail}</p>
          </DashboardCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <DashboardCard title="Geopolitical Summary" badge="See Geo">
          <p className="text-gray-400">High-level geopolitical risk is summarized here; use the dedicated Geopolitical Risk page for region-specific escalation and supply-impact analysis.</p>
        </DashboardCard>
        <DashboardCard title="Stress Profile" badge="Live">
          <p className="text-gray-400">Stress levels remain elevated across energy, credit, and liquidity channels without introducing duplicate geopolitical sections.</p>
        </DashboardCard>
        <DashboardCard title="Scenario Engine" badge="Signal">
          <p className="text-gray-400">Price and volatility scenarios are monitored separately from dedicated correlation and geopolitics workflows.</p>
        </DashboardCard>
      </div>
    </div>
  );
}
