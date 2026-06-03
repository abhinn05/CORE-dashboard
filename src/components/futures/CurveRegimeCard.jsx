export default function CurveRegimeCard({
  regime,
  slope,
  steepness,
}) {
  return (
    <div className="rounded-[24px] bg-[#0a0f18] border border-white/[0.05] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
        Curve Regime
      </p>

      <h2 className="text-4xl font-black mt-4 text-orange-400">
        {regime}
      </h2>

      <div className="mt-6 space-y-3">
        <div>
          <span className="text-gray-500">
            Slope
          </span>

          <span className="float-right">
            {slope.toFixed(2)}
          </span>
        </div>

        <div>
          <span className="text-gray-500">
            Steepness
          </span>

          <span className="float-right">
            {steepness.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  )
}