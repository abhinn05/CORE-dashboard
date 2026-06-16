export default function OpportunityCard({
  opportunities,
}) {
  return (
    <div className="rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-5 min-h-[120px]">

      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">

        Opportunities

      </p>

      <div className="mt-6 space-y-4">

        {opportunities.length === 0 ? (

          <p className="text-gray-400">

            No high-confidence opportunities
            under the current regime.

          </p>

        ) : (

          opportunities.map((opp) => (

            <div
              key={opp.target}
              className="rounded-[16px] bg-white/[0.04] p-4"
            >

              <div className="flex justify-between">

                <span>

                  {opp.target}

                </span>

                <span className="text-cyan-400">

                  {opp.opportunity_score}

                </span>

              </div>

              <div className="mt-2 text-sm text-gray-400">

                Z:

                {" "}

                {opp.zscore}

                {" • "}

                R²:

                {" "}

                {opp.r2}

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}