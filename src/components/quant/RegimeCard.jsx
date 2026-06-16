export default function RegimeCard({
  regime,
}) {
  console.log("REGIME CARD:", regime);

  return (
    <div className="rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">

      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
        Current Regime
      </p>

      <h3 className="mt-6 text-xl font-bold">
        {regime?.regime ?? "N/A"}
      </h3>

      <p className="mt-2 text-gray-400 text-sm">
        {regime?.date ?? ""}
      </p>

      <div className="mt-4 space-y-2 text-sm">

        <p>
          Curve: {regime?.drivers?.curve ?? "N/A"}
        </p>

        <p>
          Volatility: {regime?.drivers?.volatility ?? "N/A"}
        </p>

        <p>
          Products: {regime?.drivers?.products ?? "N/A"}
        </p>

        <p>
          WTI-Brent: {regime?.drivers?.wb ?? "N/A"}
        </p>

      </div>

    </div>
  );
}