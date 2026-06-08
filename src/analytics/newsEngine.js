export function bullishPercentage(news) {
  if (!news || !news.length) return "N/A";

  const bullish = news.filter(
    (n) => n.sentiment === "Bullish"
  ).length;

  return Math.round(
    (bullish / news.length) * 100
  );
}

export function bearishPercentage(news) {
  if (!news || !news.length) return "N/A";

  const bearish = news.filter(
    (n) => n.sentiment === "Bearish"
  ).length;

  return Math.round(
    (bearish / news.length) * 100
  );
}

export function overallSentiment(news) {
  if (!news || !news.length) return { score: "N/A", label: "Waiting for data...", color: "text-gray-500" };
  const bullish = bullishPercentage(news);
  const bearish = bearishPercentage(news);
  const score = Math.max(0, Math.min(100, bullish - bearish + 50));

  if (bullish > bearish)
    return {
      score,
      label: "Bullish",
      color: "text-green-400",
    };

  if (bearish > bullish)
    return {
      score,
      label: "Bearish",
      color: "text-red-400",
    };

  return {
    score,
    label: "Neutral",
    color: "text-gray-400",
  };
}

export function dominantNarrative(news) {
  if (!news || !news.length) {
    return {
      title: "N/A",
      description: "Waiting for live news feed...",
    };
  }

  const topStory = news.reduce((prev, current) => {
    return (prev.impact > current.impact) ? prev : current;
  });

  const categoryCounts = news.reduce((acc, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.keys(categoryCounts).reduce((a, b) =>
    categoryCounts[a] > categoryCounts[b] ? a : b
  );

  const bullishCount = news.filter(n => n.sentiment === "Bullish").length;
  const bearishCount = news.filter(n => n.sentiment === "Bearish").length;
  const overallBias = bullishCount > bearishCount ? "bullish" : (bearishCount > bullishCount ? "bearish" : "mixed");

  return {
    title: `${topCategory} Driven`,
    description: `Narrative is dominated by ${topCategory.toLowerCase()} news with a ${overallBias} tone. Key driver: "${topStory.headline}"`,
  };
}
