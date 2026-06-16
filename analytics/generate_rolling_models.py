import pandas as pd
import json
from pathlib import Path
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

INPUT = Path(
    "data/processed/regime_database.parquet"
)

OUTPUT = Path(
    "data/processed/rolling_model_results.json"
)

WINDOW = 30

print("Loading regime database...")

df = pd.read_parquet(INPUT)

tasks = [
    {
        "target": "WB_C1",
        "features": [
            "CL_M1M2",
            "LCO_M1M2",
            "CL_VOL20",
            "LGO_LCO_DIFF",
        ],
    },
    {
        "target": "CL_M1M2",
        "features": [
            "WB_C1",
            "CL_VOL20",
            "HO_CL_DIFF",
        ],
    },
]

results = []

for regime in df["REGIME"].unique():

    regime_df = (
        df[df["REGIME"] == regime]
        .sort_index()
    )

    if len(regime_df) < WINDOW:
        continue

    print(
        f"\n{regime}: "
        f"{len(regime_df)} observations"
    )

    for task in tasks:

        cols = (
            task["features"]
            + [task["target"]]
        )

        data = (
            regime_df[cols]
            .dropna()
        )

        if len(data) < WINDOW:
            continue

        for i in range(
            WINDOW,
            len(data) + 1,
        ):

            sample = data.iloc[
                i - WINDOW : i
            ]

            X = sample[
                task["features"]
            ]

            y = sample[
                task["target"]
            ]

            model = (
                LinearRegression()
            )

            model.fit(X, y)

            pred = (
                model.predict(X)
            )

            r2 = r2_score(
                y,
                pred,
            )

            results.append(
                {
                    "regime": regime,
                    "target":
                        task[
                            "target"
                        ],
                    "window_end":
                        str(
                            sample.index[
                                -1
                            ]
                        ),
                    "r2":
                        round(
                            float(r2),
                            4,
                        ),
                }
            )

print(
    f"\nGenerated "
    f"{len(results)} "
    f"rolling models"
)

with open(OUTPUT, "w") as f:

    json.dump(
        results,
        f,
        indent=4,
    )

print(
    "\nSaved:",
    OUTPUT,
)