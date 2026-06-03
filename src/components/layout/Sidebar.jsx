import { useState } from "react";
import sidebarItems from "../../config/sidebarItems";

export default function Sidebar({
  activeTab,
  setActiveTab
}) {

  const [expanded, setExpanded] =
    useState(false);

  return (

    <aside
      onMouseEnter={() =>
        setExpanded(true)
      }
      onMouseLeave={() =>
        setExpanded(false)
      }
      className={`
        ${
          expanded
            ? "w-[220px]"
            : "w-[44px]"
        }
        border-r border-white/[0.06]
        bg-[#070b12]
        flex flex-col
        justify-between
        py-2
        transition-all
        duration-300
      `}
    >

      <div>

        <div className="flex items-center gap-2 px-2">

          <div className="w-5 h-5 rounded-2xl bg-white text-black flex items-center justify-center font-black text-[10px]">
            C
          </div>

          {expanded && (

            <div>

              <div className="font-black text-white">
                CORE
              </div>

              <div className="text-xs text-gray-500">
                Crude Oil Risk Engine
              </div>

            </div>

          )}

        </div>

        <div className="flex flex-col gap-5 mt-8 px-3">
          {sidebarItems.map((section) => (
            <div key={section.section} className="space-y-3 transition-all duration-300">
                <div className={`text-[10px] uppercase tracking-[0.35em] text-gray-500 px-2 overflow-hidden transition-all duration-300 ${expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                {section.section}
              </div>
              <div className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                        flex items-center
                        gap-2
                        h-6
                        ${
                          expanded
                            ? "w-full px-3"
                            : "w-6 justify-center"
                        }
                        rounded-xl
                        border
                        transition-all
                        duration-200
                        ${
                          activeTab === item.id
                            ? "bg-white text-black border-white"
                            : "bg-white/[0.03] border-white/[0.04] text-gray-400"
                        }
                      `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {expanded && (
                      <span className="text-sm font-medium overflow-visible">
                        {item.label}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      

    </aside>

  );
}