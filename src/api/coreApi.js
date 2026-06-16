const API = import.meta.env.VITE_API_URL;

export async function getCurrentRegime() {
  const res = await fetch(`${API}/api/current-regime`);

  if (!res.ok) {
    throw new Error("Failed to fetch regime");
  }

  return res.json();
}

export async function getOpportunities() {
  const res = await fetch(`${API}/api/opportunities`);

  if (!res.ok) {
    throw new Error("Failed to fetch opportunities");
  }

  return res.json();
}

export async function getModelResults() {
  const res = await fetch(`${API}/api/model-results`);

  if (!res.ok) {
    throw new Error("Failed to fetch models");
  }

  return res.json();
}

export async function getRegimeCounts() {

  const res = await fetch(
    `${API}/api/regime-counts`
  );

  if (!res.ok) {

    throw new Error(
      "Failed to fetch regime counts"
    );

  }

  return res.json();

}
export async function getRegimeStats() {

  const res = await fetch(
    `${API}/api/regime-stats`
  );

  return res.json();

}