import json
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

INPUT_FILE = BASE_DIR / "live" / "market_snapshot.json"

OUTPUT_FILE = BASE_DIR / "live" / "live_features.json"


def parse_float(value):

    if value is None:
        return None

    if isinstance(value, (int, float)):
        return float(value)

    value = (
        str(value)
        .replace("%", "")
        .replace("M bbl", "")
        .replace(",", "")
        .strip()
    )

    return float(value)


def main():

    with open(INPUT_FILE) as f:
        snapshot = json.load(f)

    features = {

        #
        # Phase 2B Core Features
        #

        "WB_C1":

            parse_float(
                snapshot["spread"]["value"]
            ),

        "CL_VOL20":

            parse_float(
                snapshot["ovx"]["value"]
            ),

        "INVENTORY_DRAW":

            parse_float(
                snapshot["inventory"]["draw"]
            ),

        "WTI_PRICE":

            parse_float(
                snapshot["wti"]["value"]
            ),

        "BRENT_PRICE":

            parse_float(
                snapshot["brent"]["value"]
            ),

        "DXY":

            parse_float(
                snapshot["dxy"]["value"]
            ),

        "TIMESTAMP":

            snapshot["_metadata"]["timestamp"],

    }

    with open(OUTPUT_FILE, "w") as f:

        json.dump(
            features,
            f,
            indent=2,
        )

    print(
        f"Saved live features → {OUTPUT_FILE}"
    )

    print("\nFeatures:\n")

    for k, v in features.items():

        print(f"{k:20s} {v}")


if __name__ == "__main__":

    main()