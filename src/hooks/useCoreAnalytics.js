import { useEffect, useState } from "react";

import {
  getCurrentRegime,
  getModelResults,
  getOpportunities,
} from "../api/coreApi";

import {
  getRegimeStats,
  getRegimeCounts,
} from "../api/coreApi";


export function useCoreAnalytics() {

  const [regime, setRegime] =
    useState(null);

  const [models, setModels] =
    useState([]);

  const [
    opportunities,
    setOpportunities,
  ] = useState([]);

  const [regimeStats,
      setRegimeStats] =
    useState([]);

  const [
  regimeCounts,
  setRegimeCounts,
] = useState([]);

  useEffect(() => {

    async function load() {

      try {

        const regimeData =
          await getCurrentRegime();
        
        console.log(
          "REGIME FETCHED:",
          regimeData
        );
        
          console.log(
            "REGIME DATA:",
            regimeData
          );

        setRegime(regimeData);

      } catch (err) {

        console.error(err);

      }

      try {

        const modelData =
          await getModelResults();
        
        console.log(
          "MODEL DATA:",
          modelData
        );

        setModels(
          modelData.data ?? []
        );

      } catch (err) {

        console.error(err);

      }

      try {

        const opportunityData =
          await getOpportunities();
        console.log(
          "OPPORTUNITY DATA:",
          opportunityData
        );
        setOpportunities(
          opportunityData.data ?? []
        );

      } catch (err) {

        console.error(err);

      }

      try {

        const statsData =
          await getRegimeStats();

        console.log(
          "REGIME STATS:",
          statsData
        );

        setRegimeStats(
          statsData.data ?? []
        );

      } catch (err) {

        console.error(err);

      }


      try {

        const countData =
          await getRegimeCounts();

        console.log(
          "REGIME COUNTS:",
          countData
        );

        setRegimeCounts(
          countData.data ?? []
        );

      } catch (err) {

        console.error(err);

      }

    }

    console.log(
      "API URL:",
      import.meta.env.VITE_API_URL
    );

    load();

    const interval = setInterval(

        load,

        60000

    );

    return () => clearInterval(

        interval

    );

  }, []);

  return {
    regime,
    models,
    opportunities,
    regimeStats,
    regimeCounts,
  };

}