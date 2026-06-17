import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
  YAxis,
} from "recharts";

import useMarket from "../hooks/useMarket";
import { useInventory } from "../hooks";
import { useNews } from "../hooks";
import { inventoryTrend } from "../analytics/inventoryEngine";
import SectionHeader from "../components/SectionHeader";
import DashboardCard from "../components/DashboardCard";
import AlertCenter from "../components/AlertCenter";
import TradeRecommendation from "../components/TradeRecommendation";
import SignalLogCard from "../components/quant/SignalLogCard";

export default function MasterDashboard() {
  const { data: liveMarket } = useMarket();
  const { data: liveInventory } = useInventory();

  const effectiveMarket = useMemo(() => liveMarket ?? {}, [liveMarket]);
  const effectiveInventory = useMemo(() => liveInventory?.inventoryData ?? (Array.isArray(liveInventory) && liveInventory.length > 0 ? liveInventory : []), [liveInventory]);

  const inventoryCard = useMemo(() => ({
    title: "Inventory Signal",
    value: effectiveInventory[effectiveInventory.length - 1]?.inventory ?? (effectiveMarket.inventory?.value || "N/A"),
    detail: effectiveMarket.inventory?.detail ?? "N/A",
    accent: effectiveInventory.length > 1 ? inventoryTrend(effectiveInventory) : "Neutral",
  }), [effectiveInventory, effectiveMarket]);

  const { data: liveNews } = useNews();

  const latestNews = useMemo(
    () => (liveNews ?? []).slice(0, 5),
    [liveNews]
  );

  const cardList = useMemo(() => {
    const dynamicIntelligenceCards = effectiveMarket.dynamicIntelligenceCards ?? [
      {
        title: "CFTC Positioning",
        value: effectiveMarket.cftc?.value ?? `${effectiveMarket.cftc?.net ?? "N/A"}k net`,
        detail: effectiveMarket.cftc?.detail ?? "N/A",
        accent: effectiveMarket.cftc?.sentiment ?? "Neutral",
      },
      {
        title: "Shipping Risk",
        value: effectiveMarket.shipping?.value ?? "N/A",
        detail: effectiveMarket.shipping?.detail ?? "N/A",
        accent: effectiveMarket.shipping?.accent ?? "Neutral",
      },
      {
        title: "Macro Regime",
        value: effectiveMarket.macro?.value ?? "N/A",
        detail: effectiveMarket.macro?.detail ?? "N/A",
        accent: effectiveMarket.macro?.accent ?? "Neutral",
      },
      {
        title: "Geopolitical Risk",
        value: effectiveMarket.geopolitical?.value ?? "N/A",
        detail: effectiveMarket.geopolitical?.detail ?? "N/A",
        accent: effectiveMarket.geopolitical?.accent ?? "Neutral",
      },
      {
        title: "Correlation Regime",
        value: effectiveMarket.correlation?.value ?? "N/A",
        detail: effectiveMarket.correlation?.detail ?? "N/A",
        accent: effectiveMarket.correlation?.accent ?? "Neutral",
      },
    ];
    return [inventoryCard, ...dynamicIntelligenceCards];
  }, [inventoryCard, effectiveMarket]);

  const alerts = useMemo(() => effectiveMarket.alertRules || [], [effectiveMarket]);
  const recommendation = useMemo(() => effectiveMarket.tradeRecommendation || {}, [effectiveMarket]);

  const inventory = cardList.find(
    (card) => card.title === "Inventory Signal"
  );

  const cftc = cardList.find(
    (card) => card.title === "CFTC Positioning"
  );

  const shipping = cardList.find(
    (card) => card.title === "Shipping Risk"
  );

  const macro = cardList.find(
    (card) => card.title === "Macro Regime"
  );

  const geopolitical = cardList.find(
    (card) => card.title === "Geopolitical Risk"
  );

  const correlation = cardList.find(
    (card) => card.title === "Correlation Regime"
  );

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
                <AreaChart data={effectiveMarket.priceHistory} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

            {/* Row 1 */}
            {[inventory, cftc, shipping].map((card) => (
              <DashboardCard
                key={card.title}
                title={card.title}
                badge={card.accent}
                className="p-4"
              >
                <p className="text-3xl font-black text-white">
                  {card.value}
                </p>

                <p className="mt-3 text-sm text-gray-400">
                  {card.detail}
                </p>
              </DashboardCard>
            ))}

            {/* Column 1 */}
            <div className="space-y-3">

              {[macro, correlation].map((card) => (
                <DashboardCard
                  key={card.title}
                  title={card.title}
                  badge={card.accent}
                  className="p-4"
                >
                  <p className="text-3xl font-black text-white">
                    {card.value}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    {card.detail}
                  </p>
                </DashboardCard>
              ))}

            </div>

            {/* Column 2 */}
            <DashboardCard
              title="Latest Energy News"
              badge="Live"
              className="p-4"
            >
              <div className="space-y-3">

                {latestNews.slice(0, 5).map((news, idx) => (

                  <div
                    key={idx}
                    className="
                      group relative
                      border border-transparent
                      border-b border-white/5 last:border-b-0
                      rounded-2xl px-3 py-3
                      transition-all duration-300 ease-out
                      hover:-translate-y-1
                      hover:scale-[1.3]
                      hover:bg-gradient-to-br
                      hover:from-cyan-500/[0.08]
                      hover:to-blue-500/[0.04]
                      hover:border-cyan-400/20
                      hover:shadow-[0_8px_32px_rgba(34,211,238,0.12)]
                      hover:z-20
                      hover:cursor-pointer
                    "
                  >

                    <p className="text-sm text-white line-clamp-2">
                      {news.headline}
                    </p>

                    <div className="mt-2 flex justify-between">

                      <span className="text-xs text-gray-500">
                        {news.source}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          news.sentiment === "Bullish"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {news.sentiment}
                      </span>

                    </div>

                  </div>

                ))}

              </div>
            </DashboardCard>

            {/* Column 3 */}
            <DashboardCard
              title={geopolitical.title}
              badge={geopolitical.accent}
              className="p-4 self-start"
            >
              <p className="text-3xl font-black text-white">
                {geopolitical.value}
              </p>

              <p className="mt-3 text-sm text-gray-400">
                {geopolitical.detail}
              </p>
            </DashboardCard>

          </div>

        </div>

        <div className="space-y-5">
          <DashboardCard title="AI Market Signal" badge="Signal">
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>Current outlook</span>
                <span className={recommendation.bias?.includes('Bearish') ? 'text-red-400' : 'text-green-400'}>{recommendation.bias || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Confidence</span>
                <span className="text-cyan-400">{recommendation.confidence || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Volatility (OVX)</span>
                <span className={effectiveMarket.ovx?.status?.includes('High') ? "text-red-400" : "text-amber-300"}>{effectiveMarket.ovx?.status || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Supply momentum</span>
                <span className={effectiveMarket.inventory?.momentum?.includes('Tightening') ? 'text-green-400' : 'text-red-400'}>{effectiveMarket.inventory?.momentum || 'N/A'}</span>
              </div>
            </div>
          </DashboardCard>

          <TradeRecommendation recommendation={recommendation} />
        </div>

        <div className="space-y-5">
          <SignalLogCard
            variant="compact"
          />
          <AlertCenter alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
