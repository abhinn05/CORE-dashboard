export default function RegimeCard({
  regime,
}) {

  return (

    <div className="rounded-[24px] bg-[#111827] border border-purple-500/10 p-5">

      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">

        Current Regime

      </p>

      <h3 className="mt-6 text-lg font-bold text-white break-words">

        {regime?.regime ?? "N/A"}

      </h3>

      <p className="mt-4 text-sm text-gray-400">

        {regime?.date ?? ""}

      </p>

    </div>

  );

}