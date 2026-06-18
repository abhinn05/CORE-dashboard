import json
from pathlib import Path
import csv
import uuid
import math

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

            signal.get("entry_price", ""),

            signal.get("target_price", ""),

            signal.get("stop_loss", ""),

            signal.get("position_size", ""),

            signal.get("risk_reward", ""),

            signal.get("expected_return", ""),

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

        FEATURE_MAP = {
            "WB_C1": "WB_C1",
            "CL_M1M2": "CL_M1M2",
            "LGO_LCO_DIFF": "HO_CL_DIFF",
        }

        feature_name = FEATURE_MAP.get(target, target)

        actual = features.get(feature_name)

        print(f"\nTarget: {target}")
        print(f"Feature used: {feature_name}")
        print(f"Actual: {actual}")


        if actual is None:

            continue

        expected = model["intercept"]

        for feature, coef in model[
            "coefficients"
        ].items():
            
            print(feature, features.get(feature))

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

        if residual_std <= 0:
            continue
        


        zscore = residual / residual_std

        print(f"Expected: {expected}")
        print(f"Residual: {residual}")
        print(f"Residual Std: {residual_std}")
        print(f"Z-score: {zscore}")

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

       #
        # Institutional execution metrics
        #

        entry_price = round(actual, 4)

        target_price = round(expected, 4)

        # Residual standard deviation becomes the risk estimate
        risk_distance = max(
            residual_std,
            min(
                abs(residual) * 0.5,
                residual_std * 3,
            ),
        )

        if direction == "BUY":

            stop_loss = round(
                entry_price - risk_distance,
                4,
            )

        else:

            stop_loss = round(
                entry_price + risk_distance,
                4,
            )

        price_based_targets = {
            "WTI",
            "BRENT",
            "CL",
        }

        if target in price_based_targets:

            if direction == "BUY":

                expected_return = (
                    (target_price - entry_price)
                    / entry_price
                ) * 100

            else:

                expected_return = (
                    (entry_price - target_price)
                    / entry_price
                ) * 100

        else:

            expected_return = round(
                target_price - entry_price,
                4,
            ) 

        expected_return = round(
            expected_return,
            2,
        )

        risk_reward = round(
            abs(target_price - entry_price)
            /
            max(abs(stop_loss - entry_price), 1e-8),
            2,
        )

        position_size = max(
            0.5,
            min(
                5.0,
                math.log1p(abs(zscore)) * model["r2"] * 2
            )
        )

        position_size = f"{position_size:.1f}%"

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

            "entry_price":

                entry_price,

            "target_price":

                target_price,

            "stop_loss":

                stop_loss,

            "position_size":

                position_size,

            "risk_reward":

                risk_reward,

            "expected_return":

                expected_return,

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

    with open(
        OUTPUT_FILE,
        "w",
    ) as f:

        json.dump(
            opportunities,
            f,
            indent=2,
        )

    print(f"Generated {len(opportunities)} opportunities")


if __name__ == "__main__":

    main()