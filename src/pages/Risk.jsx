import DashboardCard from "../components/DashboardCard";
import SectionHeader from "../components/SectionHeader";
import { useMarket } from "../hooks";

export default function Risk() {
  const { data: liveMarket } = useMarket();
  const effectiveRisk = liveMarket?.riskMonitor ?? {};
  const riskPanels = effectiveRisk.panels ?? [];

  return (
    <div className="space-y-5">
      <SectionHeader title="Risk Monitor" subtitle="Core risk factors and stress signals" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {riskPanels.length > 0 ? (
          riskPanels.map((panel) => (
            <DashboardCard key={panel.title} title={panel.title} className="p-5">
              <p className={`text-4xl font-black ${panel.color || "text-white"}`}>{panel.score}</p>
              <p className="mt-4 text-gray-400">{panel.detail}</p>
            </DashboardCard>
          ))
        ) : (
          <div className="col-span-4 rounded-[20px] bg-white/[0.03] border border-white/[0.04] p-5 text-center">
            <p className="text-gray-500">Waiting for live risk data...</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <DashboardCard title="Geopolitical Summary" badge="See Geo">

          <p className="text-gray-400">
            {effectiveRisk.geoSummary ??
              "Waiting for live geopolitical data..."}
          </p>

        </DashboardCard>

        <DashboardCard title="Stress Profile" badge="Live">

          <p className="text-gray-400">
            {effectiveRisk.stressProfile ??
              "Waiting for live stress profile data..."}
          </p>

        </DashboardCard>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {(effectiveRisk.scenarios ?? []).map((scenario) => (

          <DashboardCard
            key={scenario.title}
            title={scenario.title}
            badge={scenario.probability}
          >

            <div className="space-y-3">

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Shock
                </span>

                <span>
                  {scenario.shock}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Portfolio VaR
                </span>

                <span>
                  {scenario.var}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-400">
                  Drawdown
                </span>

                <span>
                  {scenario.drawdown}
                </span>

              </div>

            </div>

          </DashboardCard>

        ))}

            </div>

      {/* Stress Contributors + Recommendations */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <DashboardCard
          title="Stress Contributors"
          badge="Live"
        >

          <div className="space-y-5">

            {(effectiveRisk.contributors ?? []).map(

              (contributor) => (

                <div key={contributor.factor}>

                  <div className="flex justify-between mb-2">

                    <span>

                      {contributor.factor}

                    </span>

                    <span>

                      {contributor.score}%

                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-white/[0.05]">

                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width:
                          `${contributor.score}%`
                      }}
                    />

                  </div>

                </div>

              )

            )}

          </div>

        </DashboardCard>

        <DashboardCard
          title="CORE Recommendations"
          badge="Signal"
        >

          <div className="space-y-4">

            {(effectiveRisk.recommendations ?? []).map(

              (recommendation) => (

                <div
                  key={recommendation}
                  className="text-gray-300"
                >

                  ✓ {recommendation}

                </div>

              )

            )}

          </div>

        </DashboardCard>

      </div>

    </div>
  );
}