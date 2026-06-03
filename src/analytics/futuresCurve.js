export function classifyCurve(curve) {
  const slope =
    curve[curve.length - 1] - curve[0];

  if (slope > 10)
    return "Deep Contango";

  if (slope > 2)
    return "Contango";

  if (slope < -10)
    return "Deep Backwardation";

  return "Backwardation";
}

export function curveSlope(curve) {
  return (
    curve[curve.length - 1] -
    curve[0]
  );
}

export function steepness(curve) {
  return (
    ((curve[curve.length - 1] -
      curve[0]) /
      curve[0]) *
    100
  );
}