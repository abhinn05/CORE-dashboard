import InventoryChart from "../components/inventory/InventoryChart";

import { inventoryData } from "../data/inventoryData";
import { marketData } from "../data/marketData";

import {
  inventoryChange,
  inventoryTrend,
  inventorySurprise
} from "../analytics/inventoryEngine";

export default function InventoryAnalytics() {

  const change =
    inventoryChange(inventoryData);

  const trend =
    inventoryTrend(inventoryData);

  const expectedDraw = marketData.inventory.expectedDraw;
  const actualDraw = marketData.inventory.draw;

  const surprise = inventorySurprise(actualDraw, expectedDraw);

  return (
    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h2 className="text-3xl font-black mb-6">
          Inventory Intelligence
        </h2>

        <InventoryChart
          data={inventoryData}
        />

      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Inventory Trend
        </p>

        <h2 className="text-5xl font-black mt-4 text-green-400">
          {trend}
        </h2>

        <div className="mt-8 space-y-4">

  <div className="flex justify-between">
    <span className="text-gray-400">
      Total Change
    </span>

    <span>
      {change} MMbbl
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-400">
      Expected Draw
    </span>

    <span>
      {expectedDraw} MMbbl
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-400">
      Actual Draw
    </span>

    <span>
      {actualDraw} MMbbl
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-400">
      Surprise
    </span>

    <span
      className={
        Number(surprise) < 0
          ? "text-green-400"
          : "text-red-400"
      }
    >
      {surprise} MMbbl
    </span>
  </div>

</div>

      </div>

      <div className="col-span-12 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

        <h3 className="text-2xl font-bold mb-4">
          Market Impact
        </h3>

        <p className="text-gray-400 leading-relaxed">

          Persistent inventory draws
          indicate tightening crude
          balances and typically support
          backwardation in the futures
          curve. Current inventory trend
          remains supportive for prompt
          crude pricing.

        </p>

      </div>

    </div>
  );
}