export default function ModelCard({
  models,
}) {

  return (

    <div className="rounded-[24px] bg-[#111827] border border-purple-500/10 p-6 h-full">

      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">

        Approved Models

      </p>

      <div className="mt-6">

        {models.length === 0 ? (

          <p className="text-gray-400">
            No approved models.
          </p>

        ) : (

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

            {models.map((model, index) => (

              <div
                key={`${model.regime}-${model.target}-${index}`}
                className="
                  rounded-[18px]
                  bg-white/[0.04]
                  border border-white/[0.04]
                  p-4
                "
              >

                <div className="flex justify-between items-start">

                  <span className="font-bold text-white">

                    {model.target}
                    <p className="mt-2 text-xs text-gray-500">

                      {model.regime
                        .replaceAll("_", " ")
                        .slice(0, 30)}

                      ...

                    </p>

                  </span>

                  <span className="text-purple-400 text-sm">

                    {model.model}

                  </span>

                </div>

                <div className="mt-4 space-y-1 text-sm text-gray-400">

                  <p>

                    R²:
                    {" "}
                    <span className="text-white">

                      {model.r2}

                    </span>

                  </p>

                  <p>

                    Obs:
                    {" "}
                    <span className="text-white">

                      {model.observations}

                    </span>

                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}