export function dollarSignal(dxy) {
  return dxy.change < 0
    ? "Bullish Crude"
    : "Bearish Crude";
}

export function chinaDemandSignal(pmi) {
  return pmi.value > 50
    ? "Demand Expansion"
    : "Demand Contraction";
}

export function macroRegime(data) {
  if (
    data.dxy.change < 0 &&
    data.pmi.value > 50
  ) {
    return "Bullish Macro";
  }

  return "Neutral Macro";
}