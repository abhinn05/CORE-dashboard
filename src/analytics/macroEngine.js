export function dollarSignal(dxy) {
  if (dxy.change == null) return "N/A";
  return dxy.change < 0
    ? "Bullish Crude"
    : dxy.change > 0 ? "Bearish Crude" : "Neutral";
}

export function manufacturingDemandSignal(pmi) {
  if (pmi.value == null) return "N/A";
  return pmi.value > 50
    ? "Demand Expansion"
    : "Demand Contraction";
}

export function macroRegime(data) {
  if (data.dxy?.change == null || data.pmi?.value == null) return "N/A";
  
  if (
    data.dxy.change < 0 &&
    data.pmi.value > 50
  ) {
    return "Bullish Macro";
  }
  if (data.dxy.change > 0 && data.pmi.value < 50) return "Bearish Macro";

  return "Neutral Macro";
}
