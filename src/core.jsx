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

export default function OilEnergyDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const correctPassword = 'Abhinn1445';
  const [activeTab, setActiveTab] = useState('master');
  const bottomMetrics = [
    { name: 'DXY', value: '104.12', change: '-0.42%' },
    { name: 'OVX', value: '36.8', change: '+3.1%' },
    { name: 'Inventories', value: '-4.2M', change: 'Bullish' },
    { name: 'Rig Count', value: '612', change: '+8' },
    { name: 'OPEC', value: 'Cuts', change: 'Supportive' },
  ];



  const [timeframe, setTimeframe] = useState('1D');

  const chartData = {
    '1D': [40, 55, 48, 70, 62, 80, 76, 92, 105, 95, 120, 138],
    '1W': [60, 80, 70, 95, 110, 125, 140, 135, 150, 165, 180, 210],
    '1M': [40, 50, 70, 90, 120, 110, 150, 180, 210, 240, 270, 300],
    '3M': [30, 45, 60, 80, 110, 140, 170, 190, 220, 250, 290, 330],
    '1Y': [20, 35, 50, 70, 95, 130, 170, 220, 260, 310, 360, 420],
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
              className="w-full h-14 rounded-2xl bg-black/30 border border-white/[0.08] px-5 outline-none text-white"
            />

            <button
              onClick={() => {
                if (password === correctPassword) {
                  setAuthenticated(true);
                } else {
                  alert('Incorrect Password');
                }
              }}
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
        <div className="text-green-400">WTI +1.84%</div>
        <div className="text-green-400">Brent +1.22%</div>
        <div className="text-red-400">DXY -0.42%</div>
        <div className="text-cyan-400">OVX +3.1%</div>
        <div className="text-green-400">Heating Oil +0.82%</div>
        <div className="text-orange-400">WTI-Brent Spread 3.74</div>
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

                <div className="mt-8 h-[280px] rounded-[28px] bg-[#05070d] border border-white/[0.04] p-6 overflow-hidden relative">

                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

                  <div className="absolute top-6 right-6 flex gap-5 text-xs uppercase tracking-[0.2em]">
                    <span className="text-cyan-400">WTI</span>
                    <span className="text-green-400">Brent</span>
                    <span className="text-orange-400">Heating Oil</span>
                  </div>

                  <svg
                    viewBox="0 0 1000 300"
                    className="w-full h-full relative z-10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 240 C120 220,240 170,360 180 C480 190,600 130,720 100 C840 70,920 40,1000 30"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <path
                      d="M0 260 C120 240,240 210,360 190 C480 160,600 140,720 120 C840 100,920 70,1000 60"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <path
                      d="M0 280 C120 250,240 230,360 220 C480 210,600 190,720 170 C840 160,920 120,1000 100"
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-5 mt-10">
                  {[
                  'WTI',
                  'Brent',
                  'WTI-Brent Spread',
                  'Heating Oil',
                  'EU Carbon',
                  'DXY',
                ].map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6"
                    >
                      <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
                        {item}
                      </p>

                      <h3 className="text-4xl font-bold mt-4">
                        {70 + index * 4}.42
                      </h3>

                      <p className="text-green-400 mt-2 text-sm">+1.82%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">
                <h3 className="text-2xl font-semibold">Market Movers</h3>

                <div className="mt-6 space-y-4">
                  {['OPEC Cuts', 'China Demand', 'Inventory Draw', 'Weak Dollar'].map((item, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-[22px] bg-white/[0.03] border border-white/[0.04]"
                    >
                      <p className="text-lg">{item}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {
                          [
                            'Supply Shock',
                            'Demand Recovery',
                            'Inventory Surprise',
                            'Macro Tailwind',
                          ][index]
                        }
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-[20px] bg-white/[0.03] border border-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Volume
                    </p>

                    <h3 className="text-3xl font-bold mt-4">
                      2.4M
                    </h3>

                    <p className="text-green-400 mt-2 text-sm">
                      +12.4%
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-white/[0.03] border border-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Open Interest
                    </p>

                    <h3 className="text-3xl font-bold mt-4">
                      1.8M
                    </h3>

                    <p className="text-cyan-400 mt-2 text-sm">
                      Active Futures
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
