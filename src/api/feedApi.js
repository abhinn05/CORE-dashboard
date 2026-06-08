export async function fetchFeed(feed) {
  const res = await fetch(`${API_BASE}/api/${feed}`);

  if (!res.ok) throw new Error('Network response was not ok');

  const json = await res.json();

  if (json.data && (Array.isArray(json.data) || typeof json.data === 'object')) {
    Object.defineProperty(json.data, '_source', {
      value: json.source,
      enumerable: false,
    });
  }

  return json.data;
}