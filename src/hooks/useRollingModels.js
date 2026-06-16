import { useQuery } from "@tanstack/react-query";

export function useRollingModels() {

  return useQuery({

    queryKey: ["rolling-models"],

    queryFn: async () => {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rolling-models`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to fetch rolling models"
        );

      }

      const data = await response.json();

      return data.data ?? [];

    },

    staleTime: 5 * 60 * 1000,

  });

}