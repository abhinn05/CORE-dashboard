export default function RegimeStatsCard({
  regime,
  regimeStats,
}) {

  const stats = regimeStats.find(
    (item) =>
      item.REGIME === regime?.regime
  );

  return (

    <div className="rounded-[24px] bg-[#111827] border border-purple-500/10 p-6">

      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">

        Regime Metrics

      </p>

      {stats ? (

        <div className="mt-5 space-y-3 text-sm">

          <p>

            Avg CL M1M2:
            {" "}
            {Number(
              stats.CL_M1M2_mean
            ).toFixed(2)}

          </p>

          <p>

            Avg WB:
            {" "}
            {Number(
              stats.WB_C1_mean
            ).toFixed(2)}

          </p>

          <p>

            Avg Vol:
            {" "}
            {Number(
              stats.CL_VOL20_mean
            ).toFixed(2)}

          </p>

        </div>

      ) : (

        <p className="mt-5 text-gray-400">

          No statistics available.

        </p>

      )}

    </div>

  );

}