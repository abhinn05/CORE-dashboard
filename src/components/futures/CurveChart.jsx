import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function CurveChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis
          domain={[
            "dataMin - 1",
            "dataMax + 1"
          ]}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="price"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}