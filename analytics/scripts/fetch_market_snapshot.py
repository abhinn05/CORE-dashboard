import json
import requests
from pathlib import Path
from datetime import datetime, UTC

API_URL = "http://localhost:4010/api/market"

OUTPUT_FILE = (
    Path(__file__)
    .parent.parent
    / "live"
    / "market_snapshot.json"
)


def main():

    response = requests.get(API_URL)

    response.raise_for_status()

    payload = response.json()

    snapshot = payload["data"]

    snapshot["_metadata"] = {
        "timestamp": datetime.now(UTC).isoformat(),
        "source": payload.get("source", "unknown"),
    }

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(OUTPUT_FILE, "w") as f:

        json.dump(
            snapshot,
            f,
            indent=2,
        )

    print(
        f"Saved market snapshot → {OUTPUT_FILE}"
    )


if __name__ == "__main__":

    main()