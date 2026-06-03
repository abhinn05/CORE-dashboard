import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function InventoryChart({
  data
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <AreaChart data={data}>
        <XAxis dataKey="week" />

        <YAxis
          domain={[
            "dataMin - 10",
            "dataMax + 10"
          ]}
        />

        <Tooltip />

        <Area
          dataKey="freight"
          stroke="#f97316"
          fill="#f97316"  
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}