import { useNews } from "../hooks";

import {
  bullishPercentage,
  bearishPercentage,
  overallSentiment,
  dominantNarrative,
} from "../analytics/newsEngine";

export default function NewsIntelligence() {
  const { data: liveNews } = useNews();
  const effective = liveNews ?? [];
  const isLive = effective.length > 0;

  const sentiment = overallSentiment(effective);
  const bullish = bullishPercentage(effective);
  const bearish = bearishPercentage(effective);
  const neutral = typeof bullish === 'number' && typeof bearish === 'number' ? 100 - bullish - bearish : "N/A";
  const narrative = dominantNarrative(effective);

  const latestNews = useMemo(
  () => (liveNews ?? []).slice(0, 5),
  [liveNews]
);
  const formatTimestamp = (value) => {
  if (!value) return "";

  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

  return (
    <div className="h-full grid grid-cols-12 gap-5">

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8 overflow-y-auto">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black">
              News Intelligence
            </h2>

            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mt-2">
              {isLive ? "Live News Feed" : "Waiting for live news..."}
            </p>
          </div>

          <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
        </div>

        <div className="mt-8 space-y-4">
          {effective.map((item, index) => (
            <div
              key={index}
              className="rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6 hover:bg-white/[0.05] transition-all duration-200"
            >
              <div className="flex items-center justify-between">

                <span
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em]
                  ${
                    item.sentiment === "Bullish"
                      ? "bg-green-500/10 text-green-300"
                      : item.sentiment === "Bearish"
                      ? "bg-red-500/10 text-red-300"
                      : "bg-gray-500/10 text-gray-300"
                  }`}
                >
                  {item.sentiment}
                </span>

                <span className="text-orange-300 font-semibold">
                  {item.impact}
                </span>
              </div>

              <h3 className="mt-4 text-lg leading-relaxed">
                {item.headline}
              </h3>

              <div className="mt-4 flex items-center justify-between">

                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  {item.category}
                </span>

                <div className="text-right">

                  <div className="text-xs text-gray-500">
                    {item.source ?? "NewsAPI Live"}
                  </div>

                  <div className="text-[10px] text-gray-600 mt-1">
                    {formatTimestamp(
                      item.timestamp ??
                      item.publishedAt ??
                      item.time
                    )}
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">

        <h3 className="text-2xl font-semibold">
          Sentiment Dashboard
        </h3>

        <div className="mt-8 flex justify-center">

          <div className="w-[220px] h-[220px] rounded-full border-[16px] border-green-400 flex flex-col items-center justify-center">

            <h2 className={`text-6xl font-black ${sentiment.color}`}>
              {sentiment.score !== "N/A" ? `${sentiment.score}%` : "N/A"}
            </h2>

            <p className="text-gray-400 mt-2">
              {sentiment.label}
            </p>

          </div>

        </div>

        <div className="mt-10 space-y-5">

          {[
            [
              "Bullish Headlines",
              bullish !== "N/A" ? `${bullish}%` : "N/A",
              "bg-green-400",
            ],
            [
              "Bearish Headlines",
              bearish !== "N/A" ? `${bearish}%` : "N/A",
              "bg-red-400",
            ],
            [
              "Neutral",
              neutral !== "N/A" ? `${neutral}%` : "N/A",
              "bg-gray-400",
            ],
          ].map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">

                <span className="text-sm text-gray-400">
                  {item[0]}
                </span>

                <span className="text-sm text-white">
                  {item[1]}
                </span>

              </div>

              <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">

                <div
                  className={`h-full rounded-full ${item[2]}`}
                  style={{
                    width: item[1] !== "N/A" ? item[1] : "0%",
                  }}
                />

              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">

          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Dominant Narrative
          </p>

          <h3 className="text-xl font-bold mt-4 text-orange-300">
            {narrative.title}
          </h3>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            {narrative.description}
          </p>

        </div>

      </div>

    </div>
  );
}
