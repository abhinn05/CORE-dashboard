import InventoryChart from "../components/inventory/InventoryChart";
import { useInventory } from "../hooks";

import {
  inventoryChange,
  inventoryTrend,
} from "../analytics/inventoryEngine";

export default function InventoryAnalytics() {

  const { data: liveInventory, isLoading, isError, error } = useInventory();

  const effectiveInventory = liveInventory?.inventoryData ?? (Array.isArray(liveInventory) && liveInventory.length > 0 ? liveInventory : []);

  const sourceLabel = isLoading
    ? "Loading live inventory…"
    : isError
    ? "Live inventory unavailable, using fallback"
    : liveInventory && (liveInventory.length > 0 || liveInventory.inventoryData)
    ? "Live EIA inventory"
    : "Using fallback inventory";

  const change = effectiveInventory.length > 1 ? inventoryChange(effectiveInventory) : null;
  const trend = effectiveInventory.length > 1 ? inventoryTrend(effectiveInventory) : "N/A";
  const actualDraw =
    effectiveInventory.length > 1
      ? effectiveInventory[effectiveInventory.length - 1].inventory -
        effectiveInventory[effectiveInventory.length - 2].inventory
      : null;

  const expectedDraw = effectiveInventory.length > 2
    ? (effectiveInventory
      .slice(1)
      .map((point, index) => point.inventory - effectiveInventory[index].inventory)
      .reduce((sum, value) => sum + value, 0) / (effectiveInventory.length - 1)).toFixed(1)
    : null;

  const surprise = actualDraw != null && expectedDraw != null
    ? Math.abs(actualDraw - expectedDraw).toFixed(1)
    : null;

  return (
    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-black">
            Inventory Intelligence
          </h2>

          <p className="text-sm text-gray-400">
            {sourceLabel} · {effectiveInventory.length} weeks loaded
          </p>

          {isError && (
            <p className="text-xs text-red-400">
              Live fetch error: {error?.message}
            </p>
          )}
        </div>

        <InventoryChart
          data={effectiveInventory}
        />

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Inventory Trend
        </p>

        <h2 className={`text-5xl font-black mt-4 ${trend.includes('Building') ? 'text-red-400' : trend.includes('Drawing') || trend.includes('Tightening') ? 'text-green-400' : 'text-gray-400'}`}>
          {trend}
        </h2>

        <div className="mt-8 space-y-4">

  <div className="flex justify-between">
    <span className="text-gray-400">
      Total Change
    </span>

    <span>
      {change != null ? `${change} MMbbl` : "N/A"}
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-400">
      Expected Draw
    </span>

    <span>
      {expectedDraw != null ? `${expectedDraw} MMbbl` : "N/A"}
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-400">
      Actual Draw
    </span>

    <span className={actualDraw != null ? (actualDraw < 0 ? "text-green-400" : "text-red-400") : "text-gray-500"}>
      {actualDraw != null ? `${actualDraw.toFixed(1)} MMbbl` : "N/A"}
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-400">
      Surprise
    </span>

    <span className="text-gray-400">
      {surprise != null ? `${surprise} MMbbl` : "N/A"}
    </span>
  </div>

</div>

      </div>

      <div className="col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Market Impact
        </h3>

        <p className="text-gray-400 leading-relaxed">
          {liveInventory?.marketImpact ?? "Waiting for live inventory data..."}

        </p>

      </div>

    </div>
  );
}