import pandas as pd
import numpy as np
import json
from pathlib import Path
from sklearn.linear_model import LinearRegression, Ridge, Lasso

INPUT = Path("data/processed/regime_database.parquet")
OUTPUT = Path("data/processed/opportunities.json")

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
    {
        "target": "LGO_LCO_DIFF",
        "features": [
            "CL_M1M2",
            "WB_C1",
            "CL_VOL20",
        ],
    },
]

models = {
    "Linear": LinearRegression(),
    "Ridge": Ridge(alpha=1.0),
    "Lasso": Lasso(alpha=0.001),
}

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

    regime_df = None

    used_regime = None

    for regime in reversed(df["REGIME"].tolist()):

        candidate = df[df["REGIME"] == regime]

        candidate = candidate[
            features + [target]
        ].dropna()

        if len(candidate) >= 30:

            regime_df = candidate

            used_regime = regime

            break

    if regime_df is None:

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

    best_model = None
    best_r2 = -999

    for model_name, model in models.items():

        model.fit(X_train, y_train)

        pred = model.predict(
            data[features]
        )

        r2 = (
            1
            - np.sum(
                (data[target] - pred) ** 2
            )
            / np.sum(
                (
                    data[target]
                    - data[target].mean()
                )
                ** 2
            )
        )

        if r2 > best_r2:
            best_r2 = r2
            best_model = (
                model_name,
                model,
            )

    print(
    f"{target} | "
    f"{used_regime} | "
    f"Best R² = {best_r2:.4f}"
    )

    if best_r2 < 0:
        continue

    model_name, model = best_model

    actual = current_row[target]

    X_current = pd.DataFrame(
        [current_row[features]],
        columns=features,
    )

    expected = model.predict(
        X_current
    )[0]

    residuals = (
        data[target]
        - model.predict(
            data[features]
        )
    )

    resid_std = residuals.std()

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

    score = abs(zscore) * best_r2

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