export const MARKET_LABELS = {
  wti: "WTI",
  brent: "Brent",
  dxy: "DXY",
  ovx: "OVX",
  heatingOil: "Heating Oil",
  spread: "WTI-Brent Spread",
};

export const MARKET_ORDER = [
  "wti",
  "brent",
  "dxy",
  "ovx",
  "heatingOil",
  "spread",
];

const SYMBOL_NORMALIZATION = [
  { pattern: /^(CL=F|CL|WTI)$/i, id: "wti" },
  { pattern: /^(BZ=F|BZ|BRENT)$/i, id: "brent" },
  { pattern: /^(DX-Y\.NYB|DXY|USDX)$/i, id: "dxy" },
  { pattern: /^(\^OVX|OVX)$/i, id: "ovx" },
  { pattern: /^(HO=F|HEATING\s*OIL|HEATINGOIL|HO)$/i, id: "heatingOil" },
];

export function normalizeMarketSymbol(rawSymbol = "") {
  const symbol = String(rawSymbol).trim();
  for (const entry of SYMBOL_NORMALIZATION) {
    if (entry.pattern.test(symbol)) {
      return entry.id;
    }
  }
  return symbol.toLowerCase().replace(/[^\w]/g, "") || "unknown";
}

export function toNumeric(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

export function formatPercentChange(value) {
  const numeric = toNumeric(value);
  if (numeric == null) return "";
  const rounded = Math.round(numeric * 100) / 100;
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

export function formatMarketQuote(quote) {
  const rawSymbol =
    quote.symbol ?? quote.ticker ?? quote.code ?? quote.name ?? "";
  const id = normalizeMarketSymbol(rawSymbol);
  const label = MARKET_LABELS[id] ?? String(rawSymbol || id);

  const rawValue =
    quote.price ?? quote.close ?? quote.last ?? quote.regularMarketPrice ?? quote.previousClose ?? quote.value;
  const valueNumber = toNumeric(rawValue);
  const value = valueNumber != null ? String(valueNumber) : String(rawValue ?? "");

  const rawChange =
    quote.change ??
    quote.changesPercentage ??
    quote.changePercent ??
    quote.regularMarketChangePercent ??
    "";
  const changeText = formatPercentChange(rawChange);
  const parsedChange = toNumeric(changeText);
  const absChange = parsedChange != null ? Math.abs(parsedChange) : 0;

  return {
    id,
    label,
    value,
    change: changeText || "",
    trend: parsedChange != null
      ? parsedChange > 0
        ? "Bullish"
        : parsedChange < 0
          ? "Bearish"
          : "Neutral"
      : "Neutral",
    severity: absChange > 2 ? "High" : absChange > 1 ? "Medium" : "Low",
  };
}

export function resolveMarketMetric(marketData, id) {
  if (!marketData) {
    return {
      id,
      label: MARKET_LABELS[id] ?? id,
      value: "—",
      change: "",
      trend: "",
    };
  }

  const direct = marketData[id];
  if (direct && typeof direct === "object" && direct.value != null) {
    return {
      id,
      label: direct.label ?? MARKET_LABELS[id],
      ...direct,
    };
  }

  const byKpi = (marketData.kpis ?? []).find(
    (item) =>
      item.id?.toLowerCase() === id.toLowerCase() ||
      item.label?.toLowerCase() === id.toLowerCase(),
  );

  if (byKpi) {
    return {
      id,
      label: byKpi.label ?? MARKET_LABELS[id],
      ...byKpi,
    };
  }

  return {
    id,
    label: MARKET_LABELS[id] ?? id,
    value: "—",
    change: "",
    trend: "",
  };
}

export function buildMarketStrip(marketData) {
  return MARKET_ORDER.map((id) => {
    const metric = resolveMarketMetric(marketData, id);
    return {
      ...metric,
      color: metric.change?.startsWith("-")
        ? "text-red-400"
        : metric.change?.startsWith("+")
          ? "text-green-400"
          : "text-gray-300",
    };
  });
}

export function computeSpreadValue(marketData) {
  const wti = toNumeric(resolveMarketMetric(marketData, "wti").value);
  const brent = toNumeric(resolveMarketMetric(marketData, "brent").value);
  if (wti == null || brent == null) return null;
  return Number((wti - brent).toFixed(2));
}
