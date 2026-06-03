import newsData from "../data/newsData";

import {
  bullishPercentage,
  bearishPercentage,
  overallSentiment,
  dominantNarrative,
} from "../analytics/newsEngine";

export default function NewsIntelligence() {
  const sentiment =
    overallSentiment(newsData);

  const bullish =
    bullishPercentage(newsData);

  const bearish =
    bearishPercentage(newsData);

  const neutral =
    100 - bullish - bearish;

  const narrative =
    dominantNarrative(newsData);

  return (
    <div className="h-full grid grid-cols-12 gap-5">

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8 overflow-y-auto">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black">
              News Intelligence
            </h2>

            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mt-2">
              Reuters • Bloomberg Style Feed
            </p>
          </div>

          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        </div>

        <div className="mt-8 space-y-4">
          {newsData.map((item, index) => (
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
                      : "bg-red-500/10 text-red-300"
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

                <span className="text-xs text-gray-500">
                  Reuters • Live
                </span>

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

            <h2 className="text-6xl font-black text-green-400">
              {sentiment.score}%
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
              `${bullish}%`,
              "bg-green-400",
            ],
            [
              "Bearish Headlines",
              `${bearish}%`,
              "bg-red-400",
            ],
            [
              "Neutral",
              `${neutral}%`,
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
                    width: item[1],
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