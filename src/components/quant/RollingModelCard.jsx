import {
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

export default function RollingModelCard({
  rollingModels,
}) {

const grouped = {};

rollingModels.forEach(
    (row) => {

        if (
            !grouped[
                row.target
            ]
        ) {

            grouped[
                row.target
            ] = [];

        }

        grouped[
            row.target
        ].push(row);

    }
);

  return (

    <div className="rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">

      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">

        Rolling Model Stability

      </p>

      <div className="mt-6 space-y-4">

        {Object.entries(grouped).map(([target, targetSeries]) => (

          <div
            key={target}
            className="rounded-[16px] bg-white/[0.04] p-4"
          >

            <div className="flex justify-between">

              <span>

                {target}

              </span>

              <span className="text-purple-400">

                R²:

                {" "}

                {
                  targetSeries[
                    targetSeries.length - 1
                  ]?.r2
                }

              </span>

            </div>

            <div className="mt-4 h-[50px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={targetSeries}
                >

                  <Line
                    dataKey="r2"
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

            <div className="mt-2 text-sm text-gray-400">

              {
                new Date(
                  targetSeries[
                    targetSeries.length - 1
                  ]?.window_end
                ).toLocaleDateString()
              }

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}