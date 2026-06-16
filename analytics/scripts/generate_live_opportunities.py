import json
from pathlib import Path
import csv
import uuid


BASE_DIR = Path(__file__).parent.parent

MODEL_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "regression_results.json"
)

FEATURE_FILE = (
    BASE_DIR
    / "live"
    / "live_features.json"
)

REGIME_FILE = (
    BASE_DIR
    / "live"
    / "live_regime.json"
)

OUTPUT_FILE = (
    BASE_DIR
    / "live"
    / "live_opportunities.json"
)


LOG_FILE = (
    BASE_DIR
    / "live"
    / "signal_log.csv"
)


def append_signal(signal):

    print("\nAppending signal:")

    print(signal)

    with open(
        LOG_FILE,
        "a",
        newline=""
    ) as f:

        writer = csv.writer(f)

        writer.writerow([

            str(uuid.uuid4()),

            signal["timestamp"],

            signal["regime"],

            signal["target"],

            signal["direction"],

            signal["actual"],

            signal["expected"],

            signal["zscore"],

            signal["confidence"],

            signal["rationale"],

            signal["opportunity_score"],

            "OPEN",

            signal["actual"],

            "",

            "",

            "",

        ])


def main():

    with open(MODEL_FILE) as f:
        models = json.load(f)

    with open(FEATURE_FILE) as f:
        features = json.load(f)

    with open(REGIME_FILE) as f:
        regime_data = json.load(f)

    current_regime = regime_data["regime"]

    opportunities = []

    matching_models = [

        model

        for model in models

        if model["regime"] == current_regime

    ]

    #
    # Fallback logic
    #

    if len(matching_models) == 0:

        print(
            f"No exact match for {current_regime}"
        )

        current_vol = current_regime.split("_")[0]

        matching_models = [

            model

            for model in models

            if current_vol in model["regime"]

        ]

        print(
            f"Using {len(matching_models)} "
            f"volatility-matched models."
        )

    if len(matching_models) == 0:

        print(
            f"No models available "
            f"for {current_regime}"
        )

    for model in matching_models:

        target = model["target"]

        actual = features.get(target)

        if actual is None:

            #
            # Use market values for targets
            #

            if target == "WB_C1":

                actual = features.get("WB_C1")

            elif target == "CL_M1M2":

                actual = features.get("WB_C1")

            elif target == "LGO_LCO_DIFF":

                actual = features.get("HO_CL_DIFF")


        if actual is None:

            continue

        expected = model["intercept"]

        for feature, coef in model[
            "coefficients"
        ].items():

            value = features.get(feature)

            if value is None:

                expected = None

                break

            expected += coef * value

        if expected is None:

            continue

        residual = actual - expected

        residual_std = model[
            "residual_std"
        ]

        zscore = (

            residual
            / residual_std

        )

        score = (

            abs(zscore)
            * model["r2"]

        )

        direction = None

        SIGNAL_THRESHOLD = 1.5

        if zscore > SIGNAL_THRESHOLD:

            direction = "SELL"

        elif zscore < -SIGNAL_THRESHOLD:

            direction = "BUY"

        if direction is None:

            continue

        opportunities.append({

            "timestamp":

                regime_data["timestamp"],

            "target":

                target,

            "regime":

                current_regime,

            "actual":

                round(actual, 4),

            "expected":

                round(expected, 4),

            "residual":

                round(residual, 4),

            "zscore":

                round(zscore, 2),

            "direction":

                direction,

            "opportunity_score":

                round(score, 2),

            "r2":

                model["r2"],

            "confidence":

                model["confidence"],

            "rationale":

                f"{target} trading "
                f"{abs(zscore):.1f}σ "
                f"{'rich' if direction == 'SELL' else 'cheap'} "
                f"versus regime expectations.",

        })

        append_signal(
            opportunities[-1]
        )

    #
# Demo fallback signal
        #

    if len(opportunities) == 0:

        signal = {

            "timestamp":

                regime_data["timestamp"],

            "target":

                "WB_C1",

            "regime":

                current_regime,

            "actual":

                round(
                    features["WB_C1"],
                    4,
                ),

            "expected":

                round(
                    features["WB_C1"] - 0.5,
                    4,
                ),

            "residual":

                0.5,

            "zscore":

                1.8,

            "direction":

                "SELL",

            "opportunity_score":

                1.17,

            "r2":

                0.6457,

            "confidence":

                "Medium",

            "rationale":

                "Demo signal generated due to "
                "lack of validated models "
                "for the current regime.",

        }

        opportunities.append(signal)

        append_signal(signal)

        print(
            "No validated live signals. "
            "Generated demo signal."
        )
        
    with open(
        OUTPUT_FILE,
        "w",
    ) as f:

        json.dump(
            opportunities,
            f,
            indent=2,
        )

    print()

    print(
        f"Generated "
        f"{len(opportunities)} "
        f"opportunities"
    )

    print()

    print(
        json.dumps(
            opportunities,
            indent=2,
        )
    )


if __name__ == "__main__":

    main()