const quantData = {
  correlationMatrix: [
    0.92,
    0.88,
    -0.71,
    0.84,
    0.77,
    -0.62,
  ],

  betaSeries: [
    { name: "Jan", beta: 0.82 },
    { name: "Feb", beta: 0.89 },
    { name: "Mar", beta: 0.95 },
    { name: "Apr", beta: 1.04 },
    { name: "May", beta: 1.12 },
    { name: "Jun", beta: 1.08 },
    { name: "Jul", beta: 1.16 },
    { name: "Aug", beta: 1.21 },
  ],

  volatilityRegimes: [
    "Low",
    "Moderate",
    "High",
    "Extreme",
  ],

  momentumSignals: [
    {
      asset: "WTI",
      signal: "BUY",
    },
    {
      asset: "Brent",
      signal: "BUY",
    },
    {
      asset: "Nat Gas",
      signal: "SELL",
    },
  ],

  zScore: 1.84,

  arbitrage: {
    strategy: "Mean Reversion",
    description:
      "WTI-Brent spread stretched +2.1σ",
  },

  signalStrengths: [
    {
      name: "Momentum",
      value: 82,
    },
    {
      name: "Mean Reversion",
      value: 76,
    },
    {
      name: "Spread Strength",
      value: 88,
    },
    {
      name: "Inventory Surprise",
      value: 71,
    },
  ],

  stats: [
    {
      label: "Sharpe",
      value: "1.82",
    },
    {
      label: "VaR",
      value: "2.4%",
    },
    {
      label: "Skew",
      value: "-0.42",
    },
    {
      label: "Kurtosis",
      value: "3.1",
    },
  ],
};

export default quantData;