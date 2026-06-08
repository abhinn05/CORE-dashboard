import { useQuery } from '@tanstack/react-query';
import { fetchMarket } from '../api/marketApi';

export default function useMarket({ refetchInterval = 1000 } = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['market'],
    queryFn: fetchMarket,
    refetchInterval,
    refetchOnWindowFocus: false,
  });

  return { data, loading: isLoading, error };
}
