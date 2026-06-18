import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
  YAxis,
  XAxis,
} from "recharts";

import MarketStatusBar from "../components/MarketStatusBar";
import useMarket from "../hooks/useMarket";
import { useSignalLog } from "../hooks/useSignalLog";
import { useInventory } from "../hooks";
import { useNews } from "../hooks";
import { inventoryTrend } from "../analytics/inventoryEngine";
import SectionHeader from "../components/SectionHeader";
import DashboardCard from "../components/DashboardCard";
import AlertCenter from "../components/AlertCenter";
import TradeRecommendation from "../components/TradeRecommendation";


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

  const {
  signals = [],
} = useSignalLog();


  const latestNews = useMemo(
    () => (liveNews ?? []).slice(0, 5),
    [liveNews]
  );

  const formatTimestamp = (value) => {

    if (!value) return "";

    try {

      return new Date(value).toLocaleString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );

    } catch {

      return value;

    }

  };

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

  const priceHistory = effectiveMarket.priceHistory ?? [];


  const { highPrice, lowPrice } = useMemo(() => {

      if (!priceHistory.length)
          return {
              highPrice: "N/A",
              lowPrice: "N/A",
          };

      return {

          highPrice: Math.max(
              ...priceHistory.map(p => p.value)
          ).toFixed(2),

          lowPrice: Math.min(
              ...priceHistory.map(p => p.value)
          ).toFixed(2),

      };

  }, [priceHistory]);

  const recommendation = useMemo(() => effectiveMarket.tradeRecommendation || {}, [effectiveMarket]);

  const coreSignal = useMemo(() => {

    const sortedSignals = [...signals].sort(

      (a, b) =>
        new Date(b.timestamp) -
        new Date(a.timestamp)

    );

    return (

      sortedSignals.find(

        signal => signal.status === "OPEN"

      ) ||

      sortedSignals[0]

    );

  }, [signals]);

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
    <div className="h-full w-full overflow-y-auto overflow-x-hidden space-y-6 pb-6">
      <SectionHeader
        title="Command Center"
        subtitle="CORE Energy Intelligence Dashboard"
      />

      <MarketStatusBar
          regime={coreSignal?.regime ?? "N/A"}
          signal={coreSignal?.direction ?? "N/A"}
          confidence={recommendation.confidence ?? null}
          risk={effectiveMarket.ovx?.status ?? "N/A"}
          lastUpdated={effectiveMarket._metadata?.timestamp}
      />

      {/* KPI quick row removed as requested */}

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <DashboardCard title="WTI Price Signal" badge="Market" className="p-5">

            <div className="mb-5 grid grid-cols-4 gap-3">

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  WTI
                </p>

                <p className="text-xl font-bold text-white">
                  {effectiveMarket.wti?.value ?? "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Change
                </p>

                <p className="text-xl font-bold text-red-400">
                  {effectiveMarket.wti?.change ?? "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  High
                </p>

                <p className="text-xl font-bold text-white">
                  {highPrice}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Low
                </p>

                <p className="text-xl font-bold text-white">
                  {lowPrice}
                </p>
              </div>

            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={effectiveMarket.priceHistory ?? []}
                >
                  <defs>
                    <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.65} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="rgba(255,255,255,.06)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
                  <XAxis
                    dataKey="t"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={35}
                  />
                  <Tooltip
                    cursor={{
                      stroke: "#22d3ee",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                    contentStyle={{
                      background: "#08101c",
                      border: "1px solid rgba(34,211,238,.25)",
                      borderRadius: "16px",
                      color: "#fff",
                      backdropFilter: "blur(18px)",
                    }}
                    labelStyle={{
                      color: "#22d3ee",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={3.5}
                    fill="url(#mainGradient)"
                    activeDot={{
                      r: 6,
                      stroke: "#22d3ee",
                      strokeWidth: 2,
                      fill: "#08101c",
                    }}
                    dot={false}
                    animationDuration={1200}
                    baseValue="dataMin"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.2fr_1.45fr] gap-6">

            {/* LEFT COLUMN */}
            <div className="space-y-6">

                <DashboardCard
                  title={inventory.title}
                  badge={inventory.accent}
                  className="px-5 py-4 min-h-[95px]"
                >
                  <p className="text-3xl font-black text-white">
                    {inventory.value}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    {inventory.detail}
                  </p>
                </DashboardCard>

                {[macro, correlation, cftc, shipping, geopolitical].map((card) => (

                  <DashboardCard
                    key={card.title}
                    title={card.title}
                    badge={card.accent}
                    className="px-5 py-4 min-h-[95px]"
                  >
                    <p className="text-2xl font-black text-white">
                      {card.value}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {card.detail}
                    </p>

                  </DashboardCard>

                ))}

              </div>

              <div className="space-y-6">

                <AlertCenter alerts={alerts} />

              </div>


            {/* NEWS COLUMN */}
            {/* ================= RIGHT COLUMN ================= */}

            <div className="space-y-6">

              {/* ---------- NEWS ---------- */}

              <DashboardCard
                title="Latest Energy News"
                badge="LIVE"
                className="p-5"
              >

                <div className="space-y-6">

                  {latestNews.slice(0, 5).map((news, idx) => (

                    <div
                      key={idx}
                      className="
                        group
                        relative
                        rounded-xl
                        px-3
                        py-3
                        border-b
                        border-white/5
                        last:border-none

                        hover:bg-white/[0.03]
                        hover:border-cyan-400/20
                        hover:shadow-[0_0_20px_rgba(34,211,238,0.06)]
                        transition-all
                        duration-300
                        cursor-pointer
                      "
                    >

                      <p className="text-sm text-white line-clamp-2">
                        {news.headline}
                      </p>

                      <div className="mt-2 flex justify-between items-start">

                        <div>

                          <div className="text-xs text-gray-500">
                            {news.source ?? "Unknown"}
                          </div>

                          <div className="text-[10px] text-gray-600 mt-1">
                            {formatTimestamp(
                              news.timestamp ??
                              news.publishedAt ??
                              news.time
                            )}
                          </div>

                        </div>

                        <span
                          className={`text-xs font-semibold ${
                            news.sentiment === "Bullish"
                              ? "text-green-400"
                              : news.sentiment === "Bearish"
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {news.sentiment}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </DashboardCard>


              {/* ---------- CATALYSTS ---------- */}

              <DashboardCard
                title="Upcoming Catalysts"
                badge="Calendar"
                className="p-5"
              >

                <div className="space-y-4">

                  {(effectiveMarket.catalysts ?? []).map((event) => (

                    <div
                      key={event.title}
                      className="
                        flex
                        justify-between
                        items-center
                        border-b
                        border-white/5
                        pb-3
                        last:border-none
                      "
                    >

                      <div>

                        <p className="font-medium">
                          {event.title}
                        </p>

                        <p className="text-xs text-gray-500">
                          {event.date}
                        </p>

                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          event.impact === "High"
                            ? "bg-red-500/10 text-red-300"
                            : event.impact === "Medium"
                            ? "bg-orange-500/10 text-orange-300"
                            : "bg-green-500/10 text-green-300"
                        }`}
                      >
                        {event.impact}
                      </span>

                    </div>

                  ))}

                </div>

              </DashboardCard>

            </div>

          </div>

        </div>

        <div className="col-span-12 xl:col-span-4 space-y-6">
          <DashboardCard
            title="CORE Trade Signal"
            badge={
              coreSignal?.status ??
              "LIVE"
            }
          >

            <div className="grid grid-cols-2 gap-3">

                <Metric
                  label="Direction"
                  value={coreSignal?.direction ?? "N/A"}
                  color={
                    coreSignal?.direction === "BUY"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                />

                <Metric
                  label="Instrument"
                  value={coreSignal?.instrument ?? coreSignal?.target ?? "N/A"}
                />

                <Metric
                  label="Regime"
                  value={coreSignal?.regime ?? "N/A"}
                />

                <Metric
                  label="Confidence"
                  value={
                    typeof coreSignal?.confidence === "number"
                      ? `${coreSignal.confidence}%`
                      : coreSignal?.confidence ?? "N/A"
                  }
                  color="text-cyan-400"
                />

                <Metric
                  label="Entry"
                  value={coreSignal?.entry_price ?? "N/A"}
                />

                <Metric
                  label="Status"
                  value={coreSignal?.status ?? "N/A"}
                  color="text-green-400"
                />

              </div>


              <div className="mt-8">

                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">

                  Why This Signal

                </p>

                <div className="space-y-6">

                  {(effectiveMarket.signalExplanation ?? []).map(

                    (reason, idx) => (

                      <div
                        key={idx}
                        className="
                          rounded-xl
                          bg-white/[0.03]
                          border border-white/[0.04]
                          px-4 py-3
                          text-sm text-gray-300
                        "
                      >

                        ✓ {reason}

                      </div>

                    )

                  )}

                </div>

              </div>

          </DashboardCard>

          

          <DashboardCard
            title="Trade Execution"
            badge="Execution"
          >

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Entry
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {coreSignal?.entry_price ?? "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-green-500/10 bg-green-500/[0.05] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-green-300">
                  Target
                </p>
                <p className="mt-2 text-2xl font-bold text-green-400">
                  {coreSignal?.target_price ?? "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-red-500/10 bg-red-500/[0.05] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-red-300">
                  Stop
                </p>
                <p className="mt-2 text-2xl font-bold text-red-400">
                  {coreSignal?.stop_loss ?? "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.05] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                  Risk / Reward
                </p>
                <p className="mt-2 text-2xl font-bold text-cyan-300">
                  {coreSignal?.risk_reward ?? "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Position Size
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {coreSignal?.position_size ?? "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.05] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                  Expected Return
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {coreSignal?.expected_return ?? "N/A"}
                </p>
              </div>

            </div>

          </DashboardCard>

          <TradeRecommendation recommendation={recommendation} />
        </div>

        
      </div>
    </div>
  );
}

function Metric({ label, value, color = "text-white" }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
        {label}
      </p>

      <p className={`mt-2 text-xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}
