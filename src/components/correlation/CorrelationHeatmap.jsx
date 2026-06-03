export default function CorrelationHeatmap({
  data
}) {

  return (
    <div className="space-y-4">

      {data.map((item) => (

        <div
          key={item.asset}
          className="flex items-center justify-between"
        >

          <span>
            {item.asset}
          </span>

          <div
            className={`px-4 py-2 rounded-xl font-bold
            ${
              item.value > 0
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {item.value}
          </div>

        </div>

      ))}

    </div>
  );
}