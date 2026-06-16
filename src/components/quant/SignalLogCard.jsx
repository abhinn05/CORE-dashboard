import { useSignalLog } from "../../hooks/useSignalLog";

export default function SignalLogCard({

    signals: propSignals,

    variant = "full",

}) {

    const {

        signals: liveSignals,

        loading,

        error,

    } = useSignalLog();

    const signals = propSignals ?? liveSignals;

    if (loading) {

        return (

            <div className="rounded-[24px] bg-[#0f172a] border border-white/[0.05] p-5">

                <p className="text-gray-400">

                    Loading signals...

                </p>

            </div>

        );

    }

    if (error) {

        return (

            <div className="rounded-[24px] bg-[#0f172a] border border-white/[0.05] p-5">

                <p className="text-red-400">

                    Failed to load signals.

                </p>

            </div>

        );

    }

    if (variant === "compact") {

        const latestSignal = signals[0];

        if (!latestSignal) {

            return (

                <div className="rounded-[24px] bg-[#0f172a] border border-white/[0.05] p-5">

                    <div className="flex items-center justify-between">

                        <h3 className="text-xl font-semibold">

                            CORE Trade Signal

                        </h3>

                        <span className="text-xs tracking-[0.3em] text-slate-500">

                            LIVE

                        </span>

                    </div>

                    <p className="mt-5 text-gray-400">

                        No active signals.

                    </p>

                </div>

            );

        }

        const [

            signalId,
            timestamp,
            regime,
            target,
            direction,
            actual,
            expected,
            zscore,
            confidence,
            rationale,
            opportunityScore,
            status,
            entryPrice,
            exitPrice,
            pnl,
            exitTimestamp,  

        ] = latestSignal.split(",");

        return (

            <div className="rounded-[24px] bg-[#0f172a] border border-white/[0.05] p-5">

                <div className="flex items-center justify-between">

                    <h3 className="text-xl font-semibold">

                        CORE Trade Signal

                    </h3>

                    <span className="text-xs tracking-[0.3em] text-slate-500">

                        LIVE

                    </span>

                </div>

                <div className="mt-5 flex items-center justify-between">

                    <div>

                        <p className="text-sm text-gray-400">

                            Instrument

                        </p>

                        <p className="text-3xl font-black">

                            {target}

                        </p>

                    </div>

                    <div className="text-right">

                        <p className="text-sm text-gray-400">

                            Signal

                        </p>

                        <p className={`text-3xl font-black ${
                            direction === "BUY"

                                ? "text-green-400"

                                : "text-red-400"

                        }`}>

                            {direction}

                        </p>

                    </div>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">

                    <div>

                        <p className="text-gray-500">

                            Confidence

                        </p>

                        <p>

                            {confidence}

                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">

                            Status

                        </p>

                        <p>

                            {status}

                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">

                            Z-Score

                        </p>

                        <p>

                            {zscore}

                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">

                            Score

                        </p>

                        <p>

                            {opportunityScore}

                        </p>

                    </div>

                </div>

            </div>

        );

    }

  return (

    <div className="rounded-[24px] bg-[#0f172a] border border-white/[0.05] p-5">

      <h3 className="text-xl font-semibold">

        Signal Log

      </h3>

      <div className="mt-4 space-y-3">

        {

          signals.length === 0

          ? (

              <p className="text-gray-400 text-sm">

                No signals recorded.

              </p>

            )

          : (

              signals.map((signal, index) => {

                const [

                    signalId,
                    timestamp,
                    regime,
                    target,
                    direction,
                    actual,
                    expected,
                    zscore,
                    confidence,
                    rationale,
                    opportunityScore,
                    status,
                    entryPrice,
                    exitPrice,
                    pnl,
                    exitTimestamp,

                ] = signal.split(",");

                return (

                    <div
                        key={index}
                        className="rounded-xl bg-white/[0.03] p-4"
                    >

                        <div className="flex justify-between">

                            <div>

                                <p className="font-semibold">

                                    {target}

                                </p>

                                <p
                                    className={`text-sm font-medium ${
                                        direction === "BUY"

                                            ? "text-green-400"

                                            : "text-red-400"
                                    }`}
                                >

                                    {direction}

                                </p>

                            </div>

                            <div className="text-right">

                                <p>

                                    {confidence}

                                </p>

                                <p className="text-sm text-gray-400">

                                    {status}

                                </p>

                            </div>

                        </div>

                        <div className="mt-3 text-sm text-gray-300">

                            <p>

                                Regime:

                                {" "}

                                {regime}

                            </p>

                            <p>

                                Z-score:

                                {" "}

                                {zscore}

                            </p>

                            <p>

                                Score:

                                {" "}

                                {opportunityScore}

                            </p>

                        </div>

                    </div>

                );

            })

            )

        }

      </div>

    </div>

  );

}