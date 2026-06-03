export function latestNetPosition(data) {
  const latest = data[data.length - 1];

  return latest.longs - latest.shorts;
}

export function positioningSignal(data) {
  const net = latestNetPosition(data);

  if (net > 300)
    return "Extremely Bullish";

  if (net > 200)
    return "Bullish";

  if (net > 100)
    return "Neutral";

  return "Bearish";
}

export function openInterestTrend(data) {
  const first = data[0].oi;
  const last = data[data.length - 1].oi;

  return last > first
    ? "Rising"
    : "Falling";
}

export function positioningPercentile(data) {
  const latest = latestNetPosition(data);

  const maxPossible = 500;

  return Math.round(
    (latest / maxPossible) * 100
  );
}

export function crowdingScore(data) {
  const net = latestNetPosition(data);

  if (net > 350) return "Extreme";
  if (net > 250) return "High";
  if (net > 150) return "Moderate";

  return "Low";
}