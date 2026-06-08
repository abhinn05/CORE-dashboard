export default function MacroCard({
  title,
  value,
  change,
}) {
  const numericChange = Number(String(change).replace(/[^0-9.-]/g, ""));
  const changeText = change == null || change === ""
    ? ""
    : String(change).includes("%")
      ? String(change)
      : Number.isFinite(numericChange)
        ? `${numericChange > 0 ? "+" : ""}${numericChange}%`
        : String(change);

  const color =
    numericChange > 0
      ? "text-green-400"
      : numericChange < 0
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
        {changeText}
      </p>

    </div>
  );
}
