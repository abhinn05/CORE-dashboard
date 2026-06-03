export function strongestPositive(
  data
) {
  return [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
}

export function strongestNegative(
  data
) {
  return [...data]
    .sort((a, b) => a.value - b.value)
    .slice(0, 2);
}

export function marketRegime(
  data
) {

  const positive =
    data.filter(
      x => x.value > 0
    ).length;

  const negative =
    data.filter(
      x => x.value < 0
    ).length;

  if (positive > negative)
    return "Trend Following";

  return "Risk-Off";
}