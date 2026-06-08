export function overallRisk(data) {
  if (!data.length) return "0";

  const avg =
    data.reduce(
      (sum, item) =>
        sum + item.risk,
      0
    ) / data.length;

  return avg.toFixed(0);
}

export function geopoliticalSignal(data) {

  const avg =
    Number(overallRisk(data));

  if (avg >= 85)
    return "Extreme Risk";

  if (avg >= 70)
    return "Elevated Risk";

  if (avg <= 40)
    return "Low Risk";

  return "Moderate Risk";
}

export function supplyAtRisk(data = []) {
  const risk = Number(overallRisk(data));
  return ((risk / 100) * 5).toFixed(1);
}
