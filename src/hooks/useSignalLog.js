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

            const rows = text
                .trim()
                .split(/\r?\n/);

            const headers = rows[0]
                .split(",");

            return rows
                .slice(1)
                .filter(Boolean)
                .map((row) => {

                    const values =
                        row.split(",");

                    return headers.reduce(

                        (obj, header, index) => {

                            obj[
                                header.trim()
                            ] =
                                values[index];

                            return obj;

                        },

                        {}

                    );

                });

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