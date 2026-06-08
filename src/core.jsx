import Sidebar from "./components/layout/Sidebar";
import FuturesAnalytics from "./pages/FuturesAnalytics";
import InventoryAnalytics from "./pages/InventoryAnalytics";
import CrackSpreadAnalytics from "./pages/CrackSpreadAnalytics";
import CFTCAnalytics from "./pages/CFTCAnalytics";
import MacroAnalytics from "./pages/MacroAnalytics";
import ShippingAnalytics from "./pages/ShippingAnalytics";
import MarketSummary from "./pages/MarketSummary";
import CorrelationAnalytics from "./pages/CorrelationAnalytics";
import GeopoliticalRisk from "./pages/GeopoliticalRisk";
import NewsIntelligence from "./pages/NewsIntelligence";
import QuantAnalytics from "./pages/QuantAnalytics";
import MasterDashboard from "./pages/MasterDashboard";
import Risk from "./pages/Risk";
import PortfolioRisk from "./pages/PortfolioRisk";

import { useState } from 'react';
import { useMarket } from "./hooks";
import { buildMarketStrip, resolveMarketMetric, formatPercentChange } from "./utils/marketUtils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function OilEnergyDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

const correctPassword = import.meta.env.VITE_ACCESS_PASSWORD || 'Abhinn14';
const [activeTab, setActiveTab] = useState('master');

  const { data: liveMarket } = useMarket();
  const effectiveMarket = liveMarket ?? {};
  const marketStrip = buildMarketStrip(effectiveMarket);
  const marketOverviewIds = ['wti', 'brent', 'heatingOil', 'dxy', 'ovx', 'spread'];

  const handleAuth = () => {
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };


  if (!authenticated) {

  return (
      <div className="min-h-screen w-screen bg-[#05070d] flex items-center justify-center text-white">

        <div className="w-[430px] rounded-[32px] bg-[#0a0f18] border border-white/[0.05] p-10 shadow-2xl">

          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Futures First
          </p>

          <h1 className="text-5xl font-black mt-4 tracking-tight">
            CORE Access
          </h1>

          <p className="text-gray-400 mt-5 leading-relaxed">
            Confidential Oil & Energy Intelligence Dashboard
          </p>

          <div className="mt-8">
            <input
              type="password"
              placeholder="Enter Access Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAuth();
                  }
                }}
              className="w-full h-14 rounded-2xl bg-black/30 border border-white/[0.08] px-5 outline-none text-white"
            />

            <button
              onClick={handleAuth}
              className="w-full h-14 rounded-2xl bg-cyan-400 text-black font-black mt-5 hover:opacity-90 transition-all duration-200"
            >
              Enter Dashboard
            </button>
          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen w-screen bg-[#05070d] text-white flex font-sans">
  
      {/*  left sidebar */}
      <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Topbar */}
        <header className="h-[72px] border-b border-white/[0.06] bg-[#070b12]/80 backdrop-blur-xl flex items-center justify-between px-3 xl:px-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">
              CORE
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mt-1">
              Crude Oil Risk Engine
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-[240px] h-[42px] rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center px-4 text-sm text-gray-500">
              Search Markets...
            </div>

            <div className="px-4 h-[42px] rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center text-sm text-green-400">
              Markets Open
            </div>
          </div>
        </header>

        <div className="h-[42px] border-b border-white/[0.05] flex items-center gap-6 px-4 text-sm overflow-x-auto whitespace-nowrap bg-[#05070d]">
          {marketStrip.map((item) => (
            <div key={item.id} className={item.color}>
              {item.label} {item.value} {formatPercentChange(item.change)}
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-3 xl:px-3 xl:py-3">


          {activeTab === "master" && (
            <MasterDashboard openTab={setActiveTab} />
          )}

          

          {activeTab === 'markets' && (
            <div className="h-full grid grid-cols-12 gap-5">
              <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                    Energy Markets Overview
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                        Global Energy Markets
                      </p>

                      <h2 className="text-4xl font-black mt-3">
                        Commodity Structure Overview
                      </h2>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 h-10 rounded-xl bg-white text-black text-sm font-medium">
                        Futures
                      </button>

                      <button className="px-4 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] text-gray-400 text-sm">
                        Spot
                      </button>

                      <button className="px-4 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] text-gray-400 text-sm">
                        Options
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 h-[280px] rounded-[28px] bg-[#05070d] border border-white/[0.04] p-6 relative">
                  <div className="absolute top-6 right-6 flex gap-5 text-xs uppercase tracking-[0.2em] z-10">
                    <span className="text-cyan-400">WTI</span>
                    <span className="text-green-400">Brent</span>
                    <span className="text-orange-400">Heating Oil</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={effectiveMarket.priceHistory}>
                      <CartesianGrid stroke="#ffffff14" vertical={false} />
                      <XAxis dataKey="name" hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: "#08101c", borderColor: "#ffffff14", borderRadius: "12px" }} />
                      <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={false} name="WTI" />
                      <Line type="monotone" dataKey="brent" stroke="#4ade80" strokeWidth={3} dot={false} name="Brent" />
                      <Line type="monotone" dataKey="ho" stroke="#fb923c" strokeWidth={3} dot={false} name="Heating Oil" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-5 mt-10">
                  {marketOverviewIds.map((id) => {
                    const metric = resolveMarketMetric(effectiveMarket, id);
                    return (
                      <div
                        key={id}
                        className="rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6"
                      >
                        <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
                          {metric.label}
                        </p>

                        <h3 className="text-4xl font-bold mt-4">
                          {metric.value}
                        </h3>

                        <p className={`${metric.change?.startsWith('-') ? 'text-red-400' : 'text-green-400'} mt-2 text-sm`}>
                          {formatPercentChange(metric.change) || '—'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
                <h3 className="text-2xl font-semibold">Market Movers</h3>

                <div className="mt-6 space-y-4">
                  {(effectiveMarket.marketMovers || []).map((item, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-[22px] bg-white/[0.03] border border-white/[0.04]"
                    >
                      <p className="text-lg">{item.title}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                  {(!effectiveMarket.marketMovers || effectiveMarket.marketMovers.length === 0) && (
                    <p className="text-sm text-gray-500">Waiting for live market movers...</p>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-[20px] bg-white/[0.03] border border-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Volume
                    </p>

                    <h3 className="text-3xl font-bold mt-4">
                      {effectiveMarket.marketStats?.volume?.value ?? "N/A"}
                    </h3>

                    <p className={`${effectiveMarket.marketStats?.volume?.change?.startsWith('-') ? 'text-red-400' : 'text-green-400'} mt-2 text-sm`}>
                      {effectiveMarket.marketStats?.volume?.change ?? ""}
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-white/[0.03] border border-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Open Interest
                    </p>

                    <h3 className="text-3xl font-bold mt-4">
                      {effectiveMarket.marketStats?.openInterest?.value ?? "N/A"}
                    </h3>

                    <p className="text-cyan-400 mt-2 text-sm">
                      {effectiveMarket.marketStats?.openInterest?.desc ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          

          {activeTab === "quant" && (
            <QuantAnalytics />
          )}

          {activeTab === "news" && (
            <NewsIntelligence />
          )}

          {activeTab === 'risk' && <Risk />}

          {activeTab === 'futures' && (
            <FuturesAnalytics />
          )}
          
          {activeTab === 'inventory' && (
            <InventoryAnalytics />
          )}

          {activeTab === 'crack' && (
            <CrackSpreadAnalytics />
          )}

          {activeTab === 'cftc' && (
          <CFTCAnalytics />
          )}
          
          {activeTab === 'macro' && (
            <MacroAnalytics />
          )}

          {activeTab === 'shipping' && (
          <ShippingAnalytics />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioRisk />
          )}

          {activeTab === "summary" && (
            <MarketSummary />
          )}

          {activeTab === "correlation" &&
            <CorrelationAnalytics />
          }

          {activeTab === "geo" &&
            <GeopoliticalRisk />
          }


        </main>
      </div>
    </div>
  );
}
