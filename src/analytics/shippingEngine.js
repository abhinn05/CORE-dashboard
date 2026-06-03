export function freightChange(data) {
  return (
    data[data.length - 1].freight -
    data[0].freight
  );
}

export function freightTrend(data) {
  const change = freightChange(data);

  return change > 15
    ? "Shipping Tightness"
    : "Normal Conditions";
}

export function shippingSignal(metrics) {
  if (
    metrics.redSeaRisk > 75 &&
    metrics.transitDelay > 8
  ) {
    return "Severely Bullish";
  }

  if (metrics.redSeaRisk > 50) {
    return "Bullish";
  }

  return "Neutral";
}