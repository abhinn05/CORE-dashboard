import pandas as pd
import numpy as np
from pathlib import Path

from pathlib import Path

BASE_DIR = Path(__file__).parent

INPUT = BASE_DIR / "data" / "processed" / "master_features.parquet"
OUTPUT = BASE_DIR / "data" / "processed" / "regime_database.parquet"

print("Loading master features...")

df = pd.read_parquet(INPUT)

print("Initial shape:", df.shape)


# ==========================
# VOLATILITY REGIME
# ==========================

print("\nCreating volatility regimes...")

vol = df["CL_VOL20"].dropna()

low = vol.quantile(0.33)
high = vol.quantile(0.67)

df["VOL_REGIME"] = np.select(
    [
        df["CL_VOL20"] <= low,
        df["CL_VOL20"] <= high,
    ],
    [
        "LOW_VOL",
        "MED_VOL",
    ],
    default="HIGH_VOL",
)


# ==========================
# CURVE REGIME
# ==========================

print("Creating curve regimes...")

df["CURVE_REGIME"] = np.where(
    df["CL_M1M6"] > 0,
    "BACKWARDATION",
    "CONTANGO",
)


# ==========================
# PRODUCT REGIME
# ==========================

print("Creating product regimes...")

product_median = df["HO_CL_DIFF"].median()

df["PRODUCT_REGIME"] = np.where(
    df["HO_CL_DIFF"] >= product_median,
    "STRONG_PRODUCTS",
    "WEAK_PRODUCTS",
)


# ==========================
# WTI-BRENT REGIME
# ==========================

print("Creating WTI-Brent regimes...")

wb_median = df["WB_C1"].median()

thresholds = {
    "CL_VOL20": {
        "low": float(low),
        "high": float(high)
    },
    "WB_C1_median": float(wb_median),
    "HO_CL_DIFF_median": float(product_median)
}

df["WB_REGIME"] = np.where(
    df["WB_C1"] >= wb_median,
    "TIGHT_WB",
    "LOOSE_WB",
)


# ==========================
# FINAL REGIME LABEL
# ==========================

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

# ==========================
# REGIME DRIVERS
# ==========================

df["CURVE_DRIVER"] = df["CURVE_REGIME"]

df["VOL_DRIVER"] = df["VOL_REGIME"]

df["PRODUCT_DRIVER"] = (
    df["PRODUCT_REGIME"]
)

df["WB_DRIVER"] = df["WB_REGIME"]




# ==========================
# REGIME STATS
# ==========================

print("\nRegime Counts:")

counts = (
    df["REGIME"]
    .value_counts()
    .sort_values(ascending=False)
)

print(counts)


print("\nTop 10 Regimes:")

print(counts.head(10))


# ==========================
# SAVE OUTPUTS
# ==========================

df.to_parquet(OUTPUT)

REGIME_CSV = BASE_DIR / "data" / "processed" / "regime_database.csv"
COUNTS_CSV = BASE_DIR / "data" / "processed" / "regime_counts.csv"

df.to_csv(REGIME_CSV)

counts.to_csv(COUNTS_CSV)


THRESHOLD_FILE = (
    BASE_DIR
    / "models"
    / "thresholds.json"
)

with open(THRESHOLD_FILE, "w") as f:
    import json
    json.dump(
        thresholds,
        f,
        indent=4,
    )


print("\nSaved:")

print("regime_database.parquet")
print("regime_database.csv")
print("regime_counts.csv")
print("thresholds.json")

print("\nFinal shape:")

print(df.shape)