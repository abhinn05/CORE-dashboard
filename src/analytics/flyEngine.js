export function computeFlys(curve) {
  const flys = [];

  for (let i = 0; i < curve.length - 2; i++) {
    flys.push({
      name: `Fly ${i + 1}`,
      value: (
        curve[i]
        - 2 * curve[i + 1]
        + curve[i + 2]
      ).toFixed(2),
    });
  }

  return flys;
}