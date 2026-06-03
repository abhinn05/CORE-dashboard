import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function PositioningChart({
  data,
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <LineChart data={data}>
        <XAxis dataKey="week" />

        <YAxis />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="longs"
          stroke="#22c55e"
          strokeWidth={3}
        />

        <Line
          type="monotone"
          dataKey="shorts"
          stroke="#ef4444"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}