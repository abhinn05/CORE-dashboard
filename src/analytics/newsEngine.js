export function bullishPercentage(news) {
  const bullish = news.filter(
    (n) => n.sentiment === "Bullish"
  ).length;

  return Math.round(
    (bullish / news.length) * 100
  );
}

export function bearishPercentage(news) {
  const bearish = news.filter(
    (n) => n.sentiment === "Bearish"
  ).length;

  return Math.round(
    (bearish / news.length) * 100
  );
}

export function overallSentiment(news) {
  const bullish = bullishPercentage(news);
  const bearish = bearishPercentage(news);

  if (bullish > bearish)
    return {
      score: 72,
      label: "Bullish",
      color: "text-green-400",
    };

  return {
    score: 50,
    label: "Neutral",
    color: "text-gray-400",
  };
}

export function dominantNarrative(news) {
  const supplyNews = news.filter(
    (n) =>
      n.category === "Supply" ||
      n.category === "Geopolitical"
  );

  const avgImpact =
    supplyNews.reduce(
      (acc, cur) => acc + cur.impact,
      0
    ) / supplyNews.length;

  if (avgImpact > 7) {
    return {
      title: "OPEC Supply Tightening",
      description:
        "Production discipline and Red Sea disruptions continue supporting crude prices globally.",
    };
  }

  return {
    title: "Balanced Market",
    description:
      "Supply and demand remain broadly balanced.",
  };
}