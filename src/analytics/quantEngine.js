export function getVolatilityColor(regime) {
  switch (regime) {
    case "Low":
      return "bg-green-500";

    case "Moderate":
      return "bg-yellow-500";

    case "High":
      return "bg-orange-500";

    case "Extreme":
      return "bg-red-500";

    default:
      return "bg-gray-500";
  }
}

export function correlationColor(value) {
  return value >= 0
    ? "bg-green-500/20 text-green-400"
    : "bg-red-500/20 text-red-400";
}