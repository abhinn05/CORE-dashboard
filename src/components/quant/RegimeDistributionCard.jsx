export default function RegimeDistributionCard({
  counts,
}) {

  return (

    <div className="
      rounded-[24px]
      bg-[#111827]
      border border-purple-500/10
      p-6
    ">

      <p className="
        text-sm uppercase
        tracking-[0.2em]
        text-gray-500
      ">

        Regime Distribution

      </p>

      <div className="
        mt-6 space-y-3
      ">

        {counts
          .slice(0, 10)
          .map((item) => (

            <div
              key={item.regime}
            >

              <div className="
                flex justify-between
                text-xs mb-1
              ">

                <span>

                  {
                    item.regime
                      .replaceAll(
                        "_",
                        " "
                      )
                  }

                </span>

                <span>

                  {
                    item.count
                  }

                </span>

              </div>

              <div className="
                h-2 rounded-full
                bg-white/[0.05]
                overflow-hidden
              ">

                <div
                  className="
                    h-full
                    bg-purple-400
                  "
                  style={{
                    width: `${
                      item.count /
                      counts[0].count *
                      100
                    }%`,
                  }}
                />

              </div>

            </div>

        ))}

      </div>

    </div>

  );

}