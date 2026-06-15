import pandas as pd
import numpy as np
from pathlib import Path

INPUT = Path("data/processed/master_features.parquet")
OUTPUT = Path("data/processed/regime_database.parquet")

print("Loading features...")
df = pd.read_parquet(INPUT)

print("Creating volatility regimes...")

# Volatility regimes
vol_q1 = df["CL_VOL20"].quantile(0.33)
vol_q2 = df["CL_VOL20"].quantile(0.67)

df["VOL_REGIME"] = np.select(
    [
        df["CL_VOL20"] <= vol_q1,
        df["CL_VOL20"] <= vol_q2,
    ],
    [
        "LOW",
        "MEDIUM",
    ],
    default="HIGH",
)

print("Creating curve regimes...")

# Curve regime
df["CURVE_REGIME"] = np.where(
    df["CL_M1M6"] > 0,
    "BACKWARDATION",
    "CONTANGO",
)

print("Creating product regimes...")

# Product strength
product_med = df["LGO_LCO_DIFF"].median()

df["PRODUCT_REGIME"] = np.where(
    df["LGO_LCO_DIFF"] > product_med,
    "STRONG_PRODUCTS",
    "WEAK_PRODUCTS",
)

print("Creating WTI-Brent regimes...")

# WTI-Brent regime
wb_med = df["WB_C1"].median()

df["WB_REGIME"] = np.where(
    df["WB_C1"] > wb_med,
    "TIGHT",
    "LOOSE",
)

print("Combining regimes...")

df["REGIME"] = (
    df["CURVE_REGIME"]
    + "_"
    + df["VOL_REGIME"]
    + "_"
    + df["PRODUCT_REGIME"]
    + "_"
    + df["WB_REGIME"]
)

print("\nRegime counts:")

print(
    df["REGIME"]
    .value_counts()
    .sort_values(ascending=False)
)

df.to_parquet(OUTPUT)

df.to_csv(
    "data/processed/regime_database.csv"
)

print("\nSaved:")
print(OUTPUT)

print("\nShape:", df.shape)