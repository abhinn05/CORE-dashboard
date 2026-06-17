import pandas as pd
from pathlib import Path
from datetime import datetime, UTC

BASE_DIR = Path(__file__).parent.parent

SIGNAL_FILE = (
    BASE_DIR
    / "live"
    / "signal_log.csv"
)

FEATURE_FILE = (
    BASE_DIR
    / "live"
    / "live_features.json"
)


def main():

    df = pd.read_csv(SIGNAL_FILE)

    if "exit_timestamp" not in df.columns:
        df["exit_timestamp"] = None
    else:
        df["exit_timestamp"] = df["exit_timestamp"].astype(object)

    if len(df) == 0:

        print("No signals.")

        return

    import json

    with open(FEATURE_FILE) as f:

        features = json.load(f)

    current_price = features["WB_C1"]

    updated = 0

    for idx, row in df.iterrows():

        if row["status"] != "OPEN":

            continue

        entry = row["entry_price"]

        direction = row["direction"]

        pnl = (

            current_price - entry

            if direction == "BUY"

            else entry - current_price

        )

        df.loc[idx, "pnl"] = round(pnl, 4)

        #
        # Exit logic
        #

        if abs(pnl) >= 0.5:

            df.loc[idx, "status"] = "CLOSED"

            df.loc[idx, "exit_price"] = current_price

            df.loc[idx, "exit_timestamp"] = (

                datetime.now(UTC).isoformat()

            )

        updated += 1

    df.to_csv(

        SIGNAL_FILE,

        index=False,

    )

    print(

        f"Updated {updated} signals."

    )


if __name__ == "__main__":

    main()