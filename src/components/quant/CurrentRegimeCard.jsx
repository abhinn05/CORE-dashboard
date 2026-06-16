import DashboardCard from "../DashboardCard";

export default function CurrentRegimeCard({
  regime,
}) {
  return (
    <DashboardCard title="Current Regime">

      <h3>{regime?.regime}</h3>

      <p>{regime?.date}</p>

    </DashboardCard>
  );
}