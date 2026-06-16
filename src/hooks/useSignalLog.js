import { useQuery } from "@tanstack/react-query";

const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4010";

export function useSignalLog() {

    const {

        data,

        isLoading,

        error,

    } = useQuery({

        queryKey: ["signal-log"],

        queryFn: async () => {

            const response = await fetch(

                `${API_BASE}/api/signal-log`

            );

            const text = await response.text();

            return text

                .trim()

                .split(/\r?\n/)

                .slice(1)

                .filter(Boolean);

        },

        refetchInterval: 60000,

        refetchOnWindowFocus: false,

    });

    return {

        signals: data ?? [],

        loading: isLoading,

        error,

    };

}