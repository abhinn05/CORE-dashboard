import json
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

FEATURE_FILE = BASE_DIR / "live" / "live_features.json"

THRESHOLD_FILE = BASE_DIR / "models" / "thresholds.json"

OUTPUT_FILE = BASE_DIR / "live" / "live_regime.json"


def main():

    with open(FEATURE_FILE) as f:
        features = json.load(f)

    with open(THRESHOLD_FILE) as f:
        thresholds = json.load(f)

    #
    # Volatility regime
    #

    vol = features["CL_VOL20"]

    if vol < thresholds["CL_VOL20"]["low"]:

        vol_regime = "LOW_VOL"

    elif vol > thresholds["CL_VOL20"]["high"]:

        vol_regime = "HIGH_VOL"

    else:

        vol_regime = "MED_VOL"

    #
    # WTI-Brent regime
    #

    wb = features["WB_C1"]

    if wb > thresholds["WB_C1_median"]:

        wb_regime = "TIGHT_WB"

    else:

        wb_regime = "LOOSE_WB"

    #
    # Inventory regime
    #

    inv = features["INVENTORY_DRAW"]

    if inv < thresholds["INVENTORY_DRAW_median"]:

        inventory_regime = "DRAW"

    else:

        inventory_regime = "BUILD"

    regime = "_".join([
        vol_regime,
        wb_regime,
        inventory_regime,
    ])

    output = {

        "timestamp":

            features["TIMESTAMP"],

        "regime":

            regime,

        "drivers": {

            "volatility":

                vol_regime,

            "wb":

                wb_regime,

            "inventory":

                inventory_regime,

        },

        "values": {

            "CL_VOL20":

                vol,

            "WB_C1":

                wb,

            "INVENTORY_DRAW":

                inv,

        }

    }

    with open(OUTPUT_FILE, "w") as f:

        json.dump(
            output,
            f,
            indent=2,
        )

    print(
        f"Saved live regime → {OUTPUT_FILE}"
    )

    print()

    print(
        json.dumps(
            output,
            indent=2,
        )
    )


if __name__ == "__main__":

    main()