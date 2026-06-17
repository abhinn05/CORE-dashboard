import pandas as pd
import numpy as np
import json
from pathlib import Path

from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.feature_selection import RFECV

BASE_DIR = Path(__file__).resolve().parent

INPUT = (
    BASE_DIR
    / "data"
    / "processed"
    / "regime_database.parquet"
)

OUTPUT = (
    BASE_DIR
    / "data"
    / "processed"
    / "regression_results.json"
)
print("Loading regime database...")

df = pd.read_parquet(INPUT)

results = []


tasks = [
    {
        "target": "WB_C1",
        "features": [
            "CL_M1M2",
            "LCO_M1M2",
            "CL_VOL20",
            "HO_CL_DIFF",
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
        "target": "HO_CL_DIFF",
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


MIN_REGIME_OBSERVATIONS = 30
MIN_R2 = 0.20
MIN_TEST_OBSERVATIONS = 5

for regime in df["REGIME"].unique():

    regime_df = df[df["REGIME"] == regime]

    if len(regime_df) < MIN_REGIME_OBSERVATIONS:
        print(
            f"Skipping {regime}: "
            f"{len(regime_df)} observations"
        )
        continue

    print(f"\n{regime}: {len(regime_df)} observations")

    for task in tasks:

        cols = task["features"] + [task["target"]]

        data = regime_df[cols].dropna()

        print(
            f"  {task['target']} usable rows = {len(data)}"
        )

        if len(data) < MIN_REGIME_OBSERVATIONS:

            print(
                f"    Not enough rows "
                f"for {task['target']}"
            )

            continue

        X = data[task["features"]]
        y = data[task["target"]]

        split = max(int(len(data) * 0.8), 10)

        if len(data) - split < MIN_TEST_OBSERVATIONS:
            continue

        
        

        X_train = X.iloc[:split]
        X_test = X.iloc[split:]

        y_train = y.iloc[:split]
        y_test = y.iloc[split:]

        selector = RFECV(
            estimator=LinearRegression(),
            step=1,
            cv=3,
            scoring="r2",
        )

        selector.fit(
            X_train,
            y_train,
        )

        selected_features = list(
            X_train.columns[
                selector.support_
            ]
        )

        X_train = X_train[
            selected_features
        ]

        X_test = X_test[
            selected_features
        ]

        best_result = None

        for model_name, model in models.items():

            model.fit(X_train, y_train)

            pred = model.predict(X_test)

            r2 = r2_score(y_test, pred)

            mae = mean_absolute_error(y_test, pred)

            residual_std = float(
            np.std(
            y_test - pred
            )
            )


            print(
                f"    TRAINED {task['target']} | "
                f"{model_name} | "
                f"R²={r2:.4f}"
            )

            

            if r2 < MIN_R2:
                continue

            if r2 >= 0.70:

                confidence = "High"

            elif r2 >= 0.40:

                confidence = "Medium"

            else:

                confidence = "Low"

            
            importance = sorted(
                zip(
                    selected_features,
                    model.coef_,
                ),
            key=lambda x: abs(x[1]),
            reverse=True,
            )


            candidate = {
                "regime": regime,
                "target": task["target"],
                "model": model_name,
                "observations": len(data),
                "r2": round(float(r2), 4),
                "mae": round(float(mae), 4),
                "residual_std": round(
                    residual_std,
                    4,
                ),

                "confidence":
                    confidence,

                "top_driver":
                    importance[0][0],
                "coefficients": dict(
                    zip(
                        selected_features,
                        [
                            round(float(c), 4)
                            for c in model.coef_
                        ],
                    )
                ),
                "intercept": round(
                    float(model.intercept_),
                    4,
                ),
                "selected_features":
                    selected_features,
            }

            if (
                best_result is None
                or candidate["r2"] > best_result["r2"]
            ):
                best_result = candidate


        if best_result is not None:

            results.append(best_result)


results = sorted(
    results,
    key=lambda x: x["r2"],
    reverse=True,
)


with open(OUTPUT, "w") as f:
    json.dump(results, f, indent=4)


print("\nTop 10 Models:")

for r in results[:10]:

    print(
        f"{r['target']} | "
        f"{r['model']} | "
        f"R²={r['r2']} | "
        f"{r['regime']}"
    )


print("\nSaved:")

print(OUTPUT)

print("\nTotal models:", len(results))