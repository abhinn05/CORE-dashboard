import { useQuery } from '@tanstack/react-query';

async function fetchMarket() {
  // This now fetches from the live backend endpoint
  const response = await fetch('/api/market');
  if (!response.ok) {
    // If the API fails, we can fall back to the mock for development, or throw an error.
    // For this request, we will throw an error to show 'N/A' states.
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  const json = await response.json();
  return json.data; // The server wraps response in { data, ts, source }
}

export default function useMarket({ refetchInterval = 1000 } = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['market'],
    queryFn: fetchMarket,
    refetchInterval,
    refetchOnWindowFocus: false,
  });

  return { data, loading: isLoading, error };
}
