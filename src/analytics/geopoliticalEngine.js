export function overallRisk(data) {

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

  return "Moderate Risk";
}

export function supplyAtRisk() {
  return 3.8;
}