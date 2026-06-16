import pandas as pd
import numpy as np
import json
from pathlib import Path
from sklearn.linear_model import LinearRegression, Ridge, Lasso

MODEL_INPUT = Path(
    "data/processed/regression_results.json"
)


INPUT = Path("data/processed/regime_database.parquet")
OUTPUT = Path("data/processed/opportunities.json")

print("Loading regime database...")

df = pd.read_parquet(INPUT)

with open(MODEL_INPUT) as f:
    approved_models = json.load(f)

approved_lookup = {
    (m["regime"], m["target"]): m
    for m in approved_models
}

print(
    f"Loaded {len(approved_models)} approved models"
)

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
    {
        "target": "LGO_LCO_DIFF",
        "features": [
            "CL_M1M2",
            "WB_C1",
            "CL_VOL20",
        ],
    },
]



opportunities = []

required_features = set()

for task in tasks:
    required_features.update(task["features"])

required_features = list(required_features)

for d in reversed(df.index):

    row = df.loc[d]

    if row[required_features].notna().all():

        latest_date = d

        break

print(f"\nUsing latest valid date: {latest_date}")

for task in tasks:

    target = task["target"]
    features = task["features"]

    current_row = df.loc[latest_date]

    current_regime = current_row["REGIME"]

    used_regime = current_regime

    regime_df = (
        df[
            df["REGIME"] == current_regime
        ][features + [target]]
        .dropna()
    )

    if len(regime_df) < 30:

        continue


    data = regime_df

    print(
        f"{target}: "
        f"using {used_regime} "
        f"({len(data)} rows)"
    )

    split = int(len(data) * 0.8)

    train = data.iloc[:split]

    X_train = train[features]
    y_train = train[target]

    key = (used_regime, target)

    if key not in approved_lookup:

        print(
            f"No approved model for "
            f"{used_regime} | {target}"
        )

        continue

    model_info = approved_lookup[key]

    best_r2 = model_info["r2"]

    coefficients = model_info["coefficients"]

    intercept = model_info["intercept"]

    model_name = model_info["model"]

    print(
    f"{target} | "
    f"{used_regime} | "
    f"Best R² = {best_r2:.4f}"
    )

    if best_r2 < 0:
        continue


    actual = current_row[target]


    expected = intercept

    for feature, coef in coefficients.items():

        expected += (
            current_row[feature]
            * coef
        )

    predictions = (
        intercept
        + data[list(coefficients.keys())]
        .mul(
            pd.Series(coefficients)
        )
        .sum(axis=1)
    )

    residuals = (
        data[target]
        - predictions
    )

    resid_std = model_info[
        "residual_std"
    ]

    if resid_std == 0:
        continue

    zscore = (
        actual - expected
    ) / resid_std

    MIN_Z = 1.5
    MIN_R2 = 0.25

    if abs(zscore) < MIN_Z:
        continue

    if best_r2 < MIN_R2:
        continue

    score = (
        abs(zscore)
        * best_r2
        * np.log(
            model_info[
                "observations"
            ]
        )
    )

    opportunities.append(
        {
            "date": str(latest_date),
            "regime": used_regime,
            "target": target,
            "model": model_name,
            "actual": round(float(actual), 4),
            "expected": round(float(expected), 4),
            "residual": round(
                float(actual - expected),
                4,
            ),
            "zscore": round(
                float(zscore),
                4,
            ),
            "r2": round(
                float(best_r2),
                4,
            ),
            "opportunity_score": round(
                float(score),
                4,
            ),
            "explanation": (
                f"{target} trading "
                f"{abs(zscore):.1f}σ "
                f"{'rich' if zscore > 0 else 'cheap'} "
                f"versus regime expectations."
            ),
            "confidence": (
                "High"
                if score > 5
                else "Medium"
                if score > 2
                else "Low"
            ),
        }
    )

opportunities = sorted(
    opportunities,
    key=lambda x: x[
        "opportunity_score"
    ],
    reverse=True,
)

with open(OUTPUT, "w") as f:
    json.dump(
        opportunities,
        f,
        indent=4,
    )

print("\nTop Opportunities:\n")

for opp in opportunities:

    print(
        f"{opp['target']}: "
        f"score={opp['opportunity_score']} | "
        f"z={opp['zscore']} | "
        f"actual={opp['actual']} | "
        f"expected={opp['expected']}"
    )

print(
    "\nSaved:",
    OUTPUT,
)

print(
    "Total Opportunities:",
    len(opportunities),
)