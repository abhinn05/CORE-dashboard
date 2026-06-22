import { useMemo, useState } from "react";
import { useNews } from "../hooks";


export default function NewsIntelligence() {
  const { data } = useNews();
  console.log("NEWS DATA:", data);

  const headlines = data?.headlines ?? [];

  const summary = data?.summary;

  const narrative = data?.narrative;

  const isLive = data?.live ?? false;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  

  const filteredNews = useMemo(() => {

  let news = headlines;

  if(search){

  news = news.filter(item=>

  item.headline
  .toLowerCase()
  .includes(search.toLowerCase())

  );

  }

  if(filter!=="All"){

  news = news.filter(item=>

  item.sentiment===filter ||

  item.category===filter ||

  item.tags?.includes(filter)

  );

  }

  return news.slice(0,5);

  },[headlines,search,filter]);
  

  return (
    <div className="h-full grid grid-cols-12 gap-5">

      <div className="col-span-8 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8 overflow-y-auto">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black">
              News Intelligence
            </h2>
            
          </div>

            <div className="flex flex-col items-end">

  <div className="flex items-center gap-2">

    <div
      className={`w-3 h-3 rounded-full ${
        isLive
          ? "bg-green-400 animate-pulse"
          : "bg-yellow-400"
      }`}
    />

    <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
      {isLive ? "LIVE" : "OFFLINE"}
    </span>

  </div>

  <p className="text-[11px] text-gray-500 mt-1">
    Last Update{" "}
    {data?.lastUpdated
      ? new Date(data.lastUpdated).toLocaleTimeString()
      : "--"}
  </p>

</div>
        </div>

        <div className="mt-6">

        <input
        value={search}
        onChange={(e)=>setSearch(e.target.value)}

        type="text"

        placeholder="Search Headlines..."

        className="
        w-full
        bg-white/[0.03]
        rounded-xl
        border
        border-white/10
        px-4
        py-3
        text-sm
        placeholder:text-gray-500
        outline-none
        focus:border-cyan-500
        "

        />

        </div>

        <div className="flex flex-wrap gap-2 mt-5">

        {summary?.filters?.map(option=>(

        <button

        key={option}
        onClick={()=>setFilter(option)}

        className={`

          px-3
          py-1.5
          rounded-full
          text-xs
          transition

          ${
          filter===option
          ?
          "bg-cyan-500/20 text-cyan-300"

          :
          "bg-white/5 hover:bg-cyan-500/20"
          }
        `}

        >

        {option}

        </button>

        ))}

        </div>

        <div className="mt-8 space-y-4">
          {filteredNews.map((item, index) => (
            <div
            key={index}
            className={`rounded-[24px]
            bg-white/[0.03]
            border
            border-white/[0.05]
            border-l-4
            p-5
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-white/[0.05]
            hover:border-cyan-500/20

            ${
            item.sentimentColor==="green"
            ? "border-l-green-400"

            : item.sentimentColor==="red"

            ? "border-l-red-400"

            : "border-l-gray-400"
            }
            `}
            >
              <div className="flex items-center justify-between">

                <span
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em]
                  ${item.sentimentBadgeClass}
                  `}
                >
                  {item.sentiment}
                </span>

                <span
                className={`px-3 py-1 rounded-lg text-xs font-bold ${item.importanceColor}`}
                >
                Impact {item.impact}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">

                  {item.tags?.map(tag => (

                  <span

                  key={tag}

                  className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px]"

                  >

                  {tag}

                  </span>

                  ))}

              </div>

              <h3 className="mt-3 text-base font-semibold leading-relaxed text-white">
                {item.headline}
              </h3>
              <p className="mt-2 text-sm text-gray-400 leading-6 line-clamp-2">
                {item.description || item.summary || "No summary available."}
              </p>

              <div className="mt-4 flex items-center justify-between">

                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  {item.category}
                </span>

                <div className="text-right">

                  <p className="text-xs text-cyan-300 font-medium">
                  {item.source || item.domain}
                  </p>

                  <p className="text-[11px] text-gray-500">
                  {item.relativeTime}
                  </p>

                </div>

              </div>
              {item.url && (

                <div className="mt-5">

                <a

                href={item.url}

                target="_blank"

                rel="noreferrer"

                className="text-cyan-400 text-sm hover:text-cyan-300"

                >

                Read Full Article →

                </a>

                </div>

                )}
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4 rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-8">

        <h3 className="text-2xl font-semibold">
          Sentiment Dashboard
        </h3>

        <div className="mt-8 flex justify-center">

          <div
          className={`

          w-[220px]
          h-[220px]
          rounded-full
          border-[16px]

          ${summary?.ringClass}

          flex
          flex-col
          items-center
          justify-center
          `}
          >

            <h2
            className={`

            text-6xl
            font-black

            ${summary?.textClass}
            `}
            >

              {summary?.overallScore != null

              ? `${summary.overallScore}%`

              : "N/A"}

            </h2>

            <p>

                {summary?.label ?? "N/A"}

            </p>

          </div>

        </div>

        <div className="mt-10 space-y-5">

          {summary?.progressBars?.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">
                {item.label}
              </span>

              <span className="text-sm text-white">
                {item.value}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className={`h-full rounded-full ${item.barClass}`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
            
        </div>

        <div className="mt-10 rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-5">

          <div className="mt-10">

              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">

              Top Themes

              </p>



              <div className="flex flex-wrap gap-2 mt-4">
                {summary?.themes?.map((theme) => (
                  <span
                    key={theme.name}
                    className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs"
                  >
                    {theme.name} ({theme.count})
                  </span>
                ))}
              </div>

            

          </div>
          
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Dominant Narrative
          </p>

          <div className="mt-8 rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">

            AI Insight

            </p>

            <p className="mt-4 text-sm text-gray-400 leading-7">

            {summary?.insight ?? "Waiting for live AI analysis..."}

            </p>

          </div>

          <div className="mt-6 rounded-[24px] bg-white/[0.03] border border-white/[0.04] p-6">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">

            Expected Market Reaction

            </p>

            <div className="mt-5 space-y-3">

            {summary?.marketReaction &&
            Object.entries(summary.marketReaction).map(([asset, reaction]) => (

            <div
            key={asset}
            className="flex justify-between"
            >

            <span>{asset}</span>

            <span className={reaction.textClass}>
            {reaction.signal}
            </span>

            </div>

            ))}

            </div>

          </div>

          <h3 className="text-xl font-bold mt-4 text-orange-300">
            {narrative?.title ?? "No dominant narrative"}
          </h3>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            {narrative?.description ?? "Waiting for live news..."}
          </p>

        </div>

      </div>

    </div>
  );
}
