import { useState } from 'react';

export default function OilEnergyDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const correctPassword = 'Abhinn14';
  const [activeTab, setActiveTab] = useState('dashboard');
  const bottomMetrics = [
    { name: 'DXY', value: '104.12', change: '-0.42%' },
    { name: 'OVX', value: '36.8', change: '+3.1%' },
    { name: 'Inventories', value: '-4.2M', change: 'Bullish' },
    { name: 'Rig Count', value: '612', change: '+8' },
    { name: 'OPEC', value: 'Cuts', change: 'Supportive' },
  ];

  const news = [
    'OPEC signals additional production cuts for next quarter',
    'US crude inventories unexpectedly rise by 4.2M barrels',
    'Weak dollar continues supporting oil prices globally',
    'China refinery throughput reaches multi-month highs',
    'Red Sea shipping risks remain elevated amid tensions',
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
      <div className="h-screen w-screen bg-[#05070d] flex items-center justify-center text-white">

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
    <div className="h-screen w-screen overflow-hidden bg-[#05070d] text-white flex font-sans">
      {/* Left Sidebar */}
      <aside className="w-[78px] border-r border-white/[0.06] bg-[#070b12] flex flex-col items-center justify-between py-6">
        <div className="flex flex-col items-center gap-5">
          <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center font-black text-lg tracking-tight">
            C
          </div>

          <div className="flex flex-col gap-3 mt-6">
            {[
              { icon: '⌂', id: 'dashboard' },
              { icon: '◫', id: 'markets' },
              { icon: '◧', id: 'quant' },
              { icon: '◎', id: 'news' },
              { icon: '◌', id: 'risk' },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.id)}
                className={`w-11 h-11 rounded-xl border transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.04] text-gray-400 hover:text-white'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        <button className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.04] text-gray-400 hover:text-white">
          ⚙
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[72px] border-b border-white/[0.06] bg-[#070b12]/80 backdrop-blur-xl flex items-center justify-between px-8">
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

        <div className="h-[42px] border-b border-white/[0.05] flex items-center gap-8 px-8 text-sm overflow-hidden bg-[#05070d]">
        <div className="text-green-400">WTI +1.84%</div>
        <div className="text-green-400">Brent +1.22%</div>
        <div className="text-red-400">DXY -0.42%</div>
        <div className="text-cyan-400">OVX +3.1%</div>
        <div className="text-green-400">Heating Oil +0.82%</div>
        <div className="text-orange-400">WTI-Brent Spread 3.74</div>
      </div>

        {/* Main Grid */}
        <main className="flex-1 overflow-hidden p-3">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-12 gap-5 h-full">
          {/* Center Section */}
          <section className="col-span-8 flex flex-col gap-5 overflow-hidden">
            {/* Main Hero Chart */}
            <div className="flex-1 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-7 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/[0.04] blur-[140px] rounded-full" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-[11px] uppercase tracking-[0.25em] text-green-400">
                      WTI CRUDE FUTURES
                    </span>
                  </div>

                  <h2 className="text-6xl font-black tracking-tight leading-none">
                    78.42
                  </h2>

                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-green-400 text-xl font-semibold">
                      +1.84%
                    </span>

                    <span className="text-gray-500 text-sm">
                      +1.42 Today
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                {['1D', '1W', '1M', '3M', '1Y'].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setTimeframe(item)}
                    className={`px-4 min-w-[54px] h-10 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      timeframe === item
                        ? 'bg-white text-black border-white'
                        : 'bg-white/[0.03] text-gray-400 border-white/[0.05] hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              </div>

              {/* Real Styled Chart */}
              <div className="relative z-10 h-[340px] mt-6 rounded-[24px] bg-[#05070d] border border-white/[0.04] p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

                <svg
                  viewBox="0 0 1000 320"
                  className="w-full h-full relative z-10"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d={
                      timeframe === '1D'
                        ? 'M0 250 C100 230,180 200,260 180 C340 160,420 170,500 140 C580 110,660 130,740 90 C820 50,900 70,1000 30'
                        : timeframe === '1W'
                        ? 'M0 270 C120 220,220 180,320 190 C420 200,520 120,620 100 C720 80,820 70,1000 20'
                        : timeframe === '1M'
                        ? 'M0 290 C100 260,200 230,300 180 C400 120,500 150,600 110 C700 70,850 60,1000 10'
                        : timeframe === '3M'
                        ? 'M0 300 C120 260,240 220,360 180 C480 140,600 110,720 90 C840 70,920 40,1000 20'
                        : 'M0 310 C150 260,300 220,450 170 C600 130,750 90,900 50 C960 30,980 20,1000 10'
                    }
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  <path
                    d={
                      (
                        timeframe === '1D'
                          ? 'M0 250 C100 230,180 200,260 180 C340 160,420 170,500 140 C580 110,660 130,740 90 C820 50,900 70,1000 30'
                          : timeframe === '1W'
                          ? 'M0 270 C120 220,220 180,320 190 C420 200,520 120,620 100 C720 80,820 70,1000 20'
                          : timeframe === '1M'
                          ? 'M0 290 C100 260,200 230,300 180 C400 120,500 150,600 110 C700 70,850 60,1000 10'
                          : timeframe === '3M'
                          ? 'M0 300 C120 260,240 220,360 180 C480 140,600 110,720 90 C840 70,920 40,1000 20'
                          : 'M0 310 C150 260,300 220,450 170 C600 130,750 90,900 50 C960 30,980 20,1000 10'
                      ) + ' L1000 320 L0 320 Z'
                    }
                    fill="url(#areaGradient)"
                  />
                </svg>

                <div className="absolute bottom-4 left-6 right-6 flex justify-between text-[10px] uppercase tracking-[0.2em] text-gray-600 z-20">
                  <span>09:00</span>
                  <span>11:00</span>
                  <span>13:00</span>
                  <span>15:00</span>
                  <span>17:00</span>
                  <span>Close</span>
                </div>
              </div>
              </div>
            {/* Bottom Strip */}
            <div className="h-[110px] grid grid-cols-5 gap-4">
              {bottomMetrics.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[22px] bg-[#0a0f18] border border-white/[0.05] px-5 py-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      {item.name}
                    </span>

                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {item.value}
                    </h3>

                    <p
                      className={`text-sm mt-1 ${
                        item.change.includes('-')
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}
                    >
                      {item.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Right Panel */}
          <section className="col-span-4 flex flex-col gap-5 overflow-hidden">
            {/* News Feed */}
            <div className="flex-1 rounded-[28px] bg-[#0a0f18] shadow-[0_0_40px_rgba(34,211,238,0.06)] border border-white/[0.05] p-6 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    News Intelligence
                  </h3>

                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">
                    Live Market Drivers
                  </p>
                </div>

                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>

              <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                {news.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-[20px] bg-white/[0.025] border border-white/[0.04] p-4 hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />

                      <div>
                        <p className="text-sm text-gray-200 leading-relaxed">
                          {item}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-500">
                          <span>Reuters</span>
                          <span>•</span>
                          <span>2m ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment + Risk */}
            <div className="h-[220px] grid grid-cols-2 gap-4">
              <div className="rounded-[24px] bg-[#0a0f18] border border-white/[0.05] p-5 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Sentiment
                  </p>

                  <h3 className="text-5xl font-black mt-4 text-green-400">
                    72%
                  </h3>
                </div>

                <div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full w-[72%] rounded-full bg-green-400" />
                  </div>

                  <p className="text-sm text-gray-400 mt-3">
                    Bullish Positioning
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#0a0f18] border border-white/[0.05] p-5 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Geopolitical Risk
                  </p>

                  <h3 className="text-5xl font-black mt-4 text-orange-400">
                    HIGH
                  </h3>
                </div>

                <div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full w-[82%] rounded-full bg-orange-400" />
                  </div>

                  <p className="text-sm text-gray-400 mt-3">
                    Red Sea + OPEC Risk
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
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
          

          {activeTab === 'quant' && (
            <div className="h-full grid grid-cols-12 gap-5">
              <div className="col-span-7 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">
                <h2 className="text-4xl font-black">Quant Analytics</h2>

                <div className="mt-8 grid grid-cols-2 gap-5">
                  {['Correlation Matrix', 'Rolling Beta', 'Volatility Regime', 'Momentum Signals'].map((item, index) => (
                    <div
                      key={index}
                      className="h-[180px] rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6"
                    >
                      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                        {item}
                      </p>

                      <div className="mt-6 h-24 rounded-2xl bg-[#05070d] border border-white/[0.04] p-4 overflow-hidden">
                        {index === 0 && (
                          <div className="grid grid-cols-3 gap-2 h-full">
                            {[
                              ['0.92', 'bg-green-500/20 text-green-400'],
                              ['0.88', 'bg-green-500/20 text-green-400'],
                              ['-0.71', 'bg-red-500/20 text-red-400'],
                              ['0.84', 'bg-green-500/20 text-green-400'],
                              ['0.77', 'bg-green-500/20 text-green-400'],
                              ['-0.62', 'bg-red-500/20 text-red-400'],
                            ].map((cell, i) => (
                              <div
                                key={i}
                                className={`rounded-lg flex items-center justify-center text-xs font-semibold ${cell[1]}`}
                              >
                                {cell[0]}
                              </div>
                            ))}
                          </div>
                        )}

                        {index === 1 && (
                          <svg viewBox="0 0 300 80" className="w-full h-full">
                            <path
                              d="M0 60 C40 55,80 40,120 42 C160 44,200 20,240 30 C270 35,290 15,300 10"
                              fill="none"
                              stroke="#a855f7"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}

                        {index === 2 && (
                          <div className="h-full flex items-center gap-3">
                            <div className="flex-1 h-4 rounded-full bg-green-500" />
                            <div className="flex-1 h-4 rounded-full bg-yellow-500" />
                            <div className="flex-1 h-4 rounded-full bg-orange-500" />
                            <div className="flex-1 h-4 rounded-full bg-red-500" />
                          </div>
                        )}

                        {index === 3 && (
                          <div className="space-y-2">
                            {[
                              ['WTI', 'BUY'],
                              ['Brent', 'BUY'],
                              ['Nat Gas', 'SELL'],
                            ].map((item, i) => (
                              <div
                                key={i}
                                className="flex justify-between text-xs"
                              >
                                <span className="text-gray-400">{item[0]}</span>
                                <span
                                  className={
                                    item[1] === 'BUY'
                                      ? 'text-green-400'
                                      : 'text-red-400'
                                  }
                                >
                                  {item[1]}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>


              <div className="mt-6 grid grid-cols-2 gap-5">
                  <div className="rounded-[24px] bg-[#111827] border border-purple-500/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Spread Z-Score
                    </p>

                    <h3 className="text-5xl font-black mt-4 text-purple-400">
                      1.84σ
                    </h3>

                    <p className="text-gray-400 mt-3 text-sm">
                      Elevated deviation from mean
                    </p>
                  </div>

                  <div className="rounded-[24px] bg-[#111827] border border-purple-500/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Statistical Arbitrage
                    </p>

                    <h3 className="text-3xl font-bold mt-4 text-purple-300">
                      Mean Reversion
                    </h3>

                    <p className="text-gray-400 mt-3 text-sm">
                      WTI-Brent spread stretched +2.1σ
                    </p>
                  </div>
                </div>

              </div>




              <div className="col-span-5 rounded-[28px] bg-[#0f172a] border border-white/[0.05] p-8">
                <h3 className="text-2xl font-semibold">Signal Strength</h3>

                <div className="mt-8 space-y-6">
                  {['Momentum', 'Mean Reversion', 'Spread Strength', 'Inventory Surprise'].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-3">
                        <span>{item}</span>
                        <span className="text-cyan-400">Strong</span>
                      </div>

                      <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{ width: `${70 + index * 5}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    ['Sharpe', '1.82'],
                    ['VaR', '2.4%'],
                    ['Skew', '-0.42'],
                    ['Kurtosis', '3.1'],
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[16px] bg-[#111827] border border-purple-500/10 p-3"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                        {item[0]}
                      </p>

                      <h3 className="text-lg font-bold mt-2 text-purple-300">
                        {item[1]}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="h-full grid grid-cols-12 gap-5">
              <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8 overflow-hidden">
                <h2 className="text-4xl font-black">News Intelligence Engine</h2>

                <div className="mt-8 space-y-4">
                  {news.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-[24px] bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-200"
                    >
                      <div>
                        <p className="text-lg leading-relaxed">{item}</p>

                        <div className="mt-4 flex items-center gap-3">
                          <div className="h-2 flex-1 rounded-full bg-white/[0.05] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                index === 0
                                  ? 'bg-orange-400'
                                  : index === 1
                                  ? 'bg-cyan-400'
                                  : index === 2
                                  ? 'bg-green-400'
                                  : index === 3
                                  ? 'bg-purple-400'
                                  : 'bg-red-400'
                              }`}
                              style={{
                                width: `${72 + index * 4}%`,
                              }}
                            />
                          </div>

                          <span className="text-sm text-white font-medium">
                            {(7.2 + index * 0.3).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                          Reuters • Live
                        </p>

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] ${
                            index === 0
                              ? 'bg-orange-500/10 text-orange-300'
                              : index === 1
                              ? 'bg-orange-500/10 text-cyan-300'
                              : index === 2
                              ? 'bg-green-500/10 text-green-300'
                              : index === 3
                              ? 'bg-purple-500/10 text-purple-300'
                              : 'bg-red-500/10 text-red-300'
                          }`}
                        >
                          {
                            ['Supply', 'Inventories', 'Macro', 'Demand', 'Geopolitical'][index]
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">
                <h3 className="text-2xl font-semibold">Sentiment Analysis</h3>

                <div className="mt-10 flex items-center justify-center">
                  <div className="w-[220px] h-[220px] rounded-full border-[16px] border-green-400 flex flex-col items-center justify-center">
                    <h2 className="text-6xl font-black text-green-400">72%</h2>
                    <p className="text-gray-400 mt-2">Bullish</p>
                  </div>
                </div>
                <div className="mt-10 space-y-4">
  {[
    ['Bullish Headlines', '68%', 'bg-green-400'],
    ['Bearish Headlines', '21%', 'bg-red-400'],
    ['Neutral', '11%', 'bg-gray-400'],
  ].map((item, index) => (
    <div key={index}>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">
          {item[0]}
        </span>

        <span className="text-sm text-white">
          {item[1]}
        </span>
      </div>

      <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className={`h-full rounded-full ${item[2]}`}
                style={{
                  width: item[1],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[20px] bg-white/[0.03] border border-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Dominant Narrative
        </p>

        <h3 className="text-xl font-bold mt-4 text-orange-300">
          OPEC Supply Tightening
        </h3>

        <p className="text-gray-400 mt-3 text-sm leading-relaxed">
          Production discipline and Red Sea disruptions continue supporting crude prices globally.
        </p>
      </div>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="h-full grid grid-cols-12 gap-5">
              <div className="col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8 flex flex-col">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                    Geopolitical Monitor
                  </p>

                  <h2 className="text-5xl font-black mt-4">
                    Global Oil Risk Intelligence
                  </h2>
                </div>

                {/* Risk Cards */}
                <div className="grid grid-cols-4 gap-5 mt-8">
                  {['Middle East', 'Russia', 'Red Sea', 'OPEC'].map((item, index) => (
                    <div
                      key={index}
                      className="h-[260px] rounded-[24px] bg-white/[0.03] border border-white/[0.04] shadow-[0_0_40px_rgba(251,146,60,0.08)] p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                            {item}
                          </p>

                          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        </div>

                        <div className="mt-6 flex items-end justify-between">
                          <h3 className="text-4xl font-black text-orange-400">
                            HIGH
                          </h3>

                          <span className="text-2xl font-bold text-white">
                            {78 + index * 4}
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 mt-5 leading-relaxed">
                          {
                            [
                              'Iran-Israel tensions remain elevated',
                              'Russian export sanctions tightening',
                              'Red Sea shipping disruptions ongoing',
                              'OPEC production discipline maintained',
                            ][index]
                          }
                        </p>
                      </div>

                      <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-400"
                          style={{
                            width: `${80 + index * 3}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Analytics */}
                <div className="mt-8 grid grid-cols-3 gap-5">
                  <div className="rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Supply At Risk
                    </p>

                    <h3 className="text-5xl font-black mt-4 text-red-400">
                      3.8M
                    </h3>

                    <p className="text-gray-400 mt-3">
                      Barrels/day exposed
                    </p>

                    <div className="mt-5 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full w-[76%] rounded-full bg-red-400" />
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Shipping Stress
                    </p>

                    <h3 className="text-5xl font-black mt-4 text-orange-400">
                      82%
                    </h3>

                    <p className="text-gray-400 mt-3">
                      Red Sea route pressure
                    </p>

                    <div className="mt-5 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full w-[82%] rounded-full bg-orange-400" />
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Sanctions Impact
                    </p>

                    <h3 className="text-5xl font-black mt-4 text-yellow-300">
                      Severe
                    </h3>

                    <p className="text-gray-400 mt-3">
                      Russian crude flows affected
                    </p>

                    <div className="mt-5 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full w-[68%] rounded-full bg-yellow-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
