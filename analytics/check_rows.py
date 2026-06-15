import pandas as pd

df = pd.read_parquet("data/processed/regime_database.parquet")

regime = "CONTANGO_HIGH_VOL_WEAK_PRODUCTS_TIGHT_WB"

subset = df[df["REGIME"] == regime]

print("Total rows:", len(subset))

targets = [
    "CL_M1M2",
    "WB_C1",
    "LGO_LCO_DIFF"
]

features = [
    "CL_C1",
    "LCO_C1",
    "HO_C1",
    "LGO_C1"
]

for t in targets:
    temp = subset.dropna(subset=[t] + features)

    print("\nTarget:", t)
    print("usable rows =", len(temp))
