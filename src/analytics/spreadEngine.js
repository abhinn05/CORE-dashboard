export function computeCalendarSpreads(curve) {
  const spreads = [];

  for (let i = 0; i < curve.length - 1; i++) {
    spreads.push({
      name: `M${i + 1}-M${i + 2}`,
      value: (curve[i] - curve[i + 1]).toFixed(2),
    });
  }

  return spreads;
}