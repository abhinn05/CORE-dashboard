export default function MacroCard({
  title,
  value,
  change,
}) {

  const color =
    change > 0
      ? "text-green-400"
      : change < 0
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div className="rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-6">

      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
        {title}
      </p>

      <h2 className="text-4xl font-black mt-3">
        {value}
      </h2>

      <p className={`mt-2 ${color}`}>
        {change > 0 ? "+" : ""}
        {change}
      </p>

    </div>
  );
}