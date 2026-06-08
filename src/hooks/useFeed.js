import { useQuery } from '@tanstack/react-query';
import { fetchFeed } from '../api/feedApi';

export default function useFeed(feedName, { refetchInterval = 1000 } = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: [feedName],
    queryFn: () => fetchFeed(feedName),
    refetchInterval,
    refetchOnWindowFocus: false,
  });

  return { data, loading: isLoading, error };
}
