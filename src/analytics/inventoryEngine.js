export function inventoryChange(data) {
  return (
    data[data.length - 1].inventory -
    data[0].inventory
  );
}

export function inventoryTrend(data) {
  const change = inventoryChange(data);

  return change < 0
    ? "Bullish Draw"
    : "Bearish Build";
}

export function surpriseScore(
  actual,
  expected
) {
  return actual - expected;
}

export function inventorySurprise(
  actual,
  expected
) {
  return (
    actual - expected
  ).toFixed(1);
}

