import DashboardCard from "../DashboardCard";

export default function ModelSummaryTable({
  models,
}) {
  return (
    <DashboardCard title="Approved Models">

      <table>

        <thead>

          <tr>

            <th>Target</th>

            <th>Model</th>

            <th>R²</th>

            <th>Obs</th>

          </tr>

        </thead>

        <tbody>

          {models.map((m) => (

            <tr key={`${m.regime}-${m.target}`}>

              <td>{m.target}</td>

              <td>{m.model}</td>

              <td>{m.r2}</td>

              <td>{m.observations}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </DashboardCard>
  );
}