export function crackTrend(data) {
  const change =
    data[data.length - 1].crack -
    data[0].crack;

  return change > 0
    ? "Refining Margins Expanding"
    : "Refining Margins Contracting";
}

export function crackChange(data) {
  return (
    data[data.length - 1].crack -
    data[0].crack
  );
}

export function refinerySignal(data) {
  const latest =
    data[data.length - 1].crack;

  if (latest > 25)
    return "Very Bullish";

  if (latest > 20)
    return "Bullish";

  return "Neutral";
}

export function crackPercentile(
  current,
  average
) {
  return Math.round(
    (current / average) * 50
  );
}