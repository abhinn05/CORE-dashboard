import pandas as pd
import numpy as np
from pathlib import Path

RAW_DIR = Path("data/raw")
OUT_DIR = Path("data/processed")

OUT_DIR.mkdir(parents=True, exist_ok=True)


def process_market(file_path, prefix):

    print(f"\nProcessing {prefix}...")

    chunks = []

    cols_to_use = [
        "timestamp",
        "c1||weighted_mid",
        "c2||weighted_mid",
        "c3||weighted_mid",
        "c4||weighted_mid",
        "c6||weighted_mid",
        "c12||weighted_mid",
    ]

    for chunk in pd.read_csv(
        file_path,
        skiprows=1,
        usecols=lambda x: x in cols_to_use,
        chunksize=200000,
        low_memory=False,
    ):

        chunk["timestamp"] = pd.to_datetime(
            chunk["timestamp"],
            utc=True,
        )

        chunk.rename(
            columns={
                "c1||weighted_mid": f"{prefix}_C1",
                "c2||weighted_mid": f"{prefix}_C2",
                "c3||weighted_mid": f"{prefix}_C3",
                "c4||weighted_mid": f"{prefix}_C4",
                "c6||weighted_mid": f"{prefix}_C6",
                "c12||weighted_mid": f"{prefix}_C12",
            },
            inplace=True,
        )

        chunk.set_index("timestamp", inplace=True)

        daily = chunk.resample("D").last()

        chunks.append(daily)

    result = pd.concat(chunks)

    result = result.groupby(result.index).last()

    print(result.shape)

    return result


CL = process_market(RAW_DIR / "CL_data.csv", "CL")
LCO = process_market(RAW_DIR / "LCO_data.csv", "LCO")
HO = process_market(RAW_DIR / "HO_data.csv", "HO")
LGO = process_market(RAW_DIR / "LGO_data.csv", "LGO")
WB = process_market(
    RAW_DIR / "wtcl_lco_outrights_1min.csv",
    "WB"
)


master = (
    CL
    .join(LCO, how="outer")
    .join(HO, how="outer")
    .join(LGO, how="outer")
    .join(WB, how="outer")
)

print("\nGenerating spreads...")

markets = ["CL", "LCO", "HO", "LGO", "WB"]

for mkt in markets:

    try:
        master[f"{mkt}_M1M2"] = (
            master[f"{mkt}_C1"]
            - master[f"{mkt}_C2"]
        )
    except:
        pass

    try:
        master[f"{mkt}_M1M3"] = (
            master[f"{mkt}_C1"]
            - master[f"{mkt}_C3"]
        )
    except:
        pass

    try:
        master[f"{mkt}_M1M6"] = (
            master[f"{mkt}_C1"]
            - master[f"{mkt}_C6"]
        )
    except:
        pass

    try:
        master[f"{mkt}_M1M12"] = (
            master[f"{mkt}_C1"]
            - master[f"{mkt}_C12"]
        )
    except:
        pass

    try:
        master[f"{mkt}_FLY123"] = (
            master[f"{mkt}_C1"]
            - 2 * master[f"{mkt}_C2"]
            + master[f"{mkt}_C3"]
        )
    except:
        pass


print("Generating volatility...")

for mkt in markets:

    try:

        price = master[f"{mkt}_C1"].dropna()

        ret = price.pct_change()

        vol20 = (
            ret.rolling(20)
            .std()
            * np.sqrt(252)
        )

        vol60 = (
            ret.rolling(60)
            .std()
            * np.sqrt(252)
        )

        master[f"{mkt}_VOL20"] = (
            vol20.reindex(master.index)
        )

        master[f"{mkt}_VOL60"] = (
            vol60.reindex(master.index)
        )

    except Exception as e:

        print(f"{mkt} failed:", e)


print("Generating cross-market features...")

try:
    master["HO_CL_DIFF"] = (
        master["HO_C1"]
        - master["CL_C1"]
    )
except:
    pass

try:
    master["LGO_LCO_DIFF"] = (
        master["LGO_C1"]
        - master["LCO_C1"]
    )
except:
    pass

try:
    master["LGO_HO_DIFF"] = (
        master["LGO_C1"]
        - master["HO_C1"]
    )
except:
    pass

try:
    master["CURVE_TIGHTNESS"] = (
        master["CL_M1M2"]
        - master["LCO_M1M2"]
    )
except:
    pass


master.sort_index(inplace=True)

# Keep only the common historical window
master = master.loc[
    (master.index >= "2021-01-01")
    & (master.index <= "2024-06-30")
]

master.to_parquet(
    OUT_DIR / "master_features.parquet"
)

master.to_csv(
    OUT_DIR / "master_features.csv"
)

print("\nDone.")
print(master.shape)

print(
    "\nSaved:",
    OUT_DIR / "master_features.parquet"
)