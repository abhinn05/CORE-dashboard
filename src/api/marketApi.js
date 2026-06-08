const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchMarket() {
  try {
    const res = await fetch(`${API_BASE}/api/market`);

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('fetchMarket error', err);
    throw err;
  }
}
