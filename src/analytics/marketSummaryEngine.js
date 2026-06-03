export function marketBias({
  futures,
  inventory,
  crack,
  cftc,
  macro,
  shipping
}) {

  let score = 0;

  if (futures === "Deep Backwardation")
    score += 2;

  if (inventory === "Bullish Draw")
    score += 2;

  if (
    crack === "Bullish" ||
    crack === "Very Bullish"
  )
    score += 2;

  if (
    cftc === "Bullish" ||
    cftc === "Extremely Bullish"
  )
    score += 2;

  if (
    macro === "Bullish Macro"
  )
    score += 1;

  if (
    shipping === "Bullish" ||
    shipping === "Severely Bullish"
  )
    score += 1;

  if (score >= 8)
    return "Strong Bullish";

  if (score >= 5)
    return "Bullish";

  if (score >= 3)
    return "Neutral";

  return "Bearish";
}

export function confidenceScore({
  futures,
  inventory,
  crack,
  cftc,
  macro,
  shipping
}) {

  let score = 50;

  if (futures) score += 5;
  if (inventory) score += 10;
  if (crack) score += 10;
  if (cftc) score += 10;
  if (macro) score += 5;
  if (shipping) score += 5;

  return Math.min(score, 95);
}

export function marketDrivers({
  inventory,
  crack,
  cftc,
  macro,
  shipping
}) {

  const drivers = [];

  if (inventory === "Bullish Draw")
    drivers.push(
      "Inventory Draws Tightening Supply"
    );

  if (
    crack === "Bullish" ||
    crack === "Very Bullish"
  )
    drivers.push(
      "Refining Margins Expanding"
    );

  if (
    cftc === "Bullish" ||
    cftc === "Extremely Bullish"
  )
    drivers.push(
      "Funds Increasing Net Longs"
    );

  if (
    macro === "Bullish Macro"
  )
    drivers.push(
      "Macro Demand Improving"
    );

  if (
    shipping === "Severely Bullish"
  )
    drivers.push(
      "Shipping Disruptions"
    );

  return drivers;
}