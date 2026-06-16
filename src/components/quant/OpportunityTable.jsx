import DashboardCard from "../DashboardCard";

export default function OpportunityTable({
  opportunities,
}) {
  return (
    <DashboardCard title="Analytical Opportunities">

      {opportunities.length === 0 ? (

        <p>
          No high-confidence opportunities
          under the current regime.
        </p>

      ) : (

        <table>

          <thead>

            <tr>

              <th>Target</th>

              <th>Z</th>

              <th>R²</th>

              <th>Score</th>

            </tr>

          </thead>

          <tbody>

            {opportunities.map((opp) => (

              <tr key={opp.target}>

                <td>{opp.target}</td>

                <td>{opp.zscore}</td>

                <td>{opp.r2}</td>

                <td>{opp.opportunity_score}</td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </DashboardCard>
  );
}