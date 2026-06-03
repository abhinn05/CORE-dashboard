import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function CrackChart({
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
            "dataMin - 2",
            "dataMax + 2"
          ]}
        />

        <Tooltip />

        <Area
          dataKey="crack"
          stroke="#f97316"
          fill="#f9731622"
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}