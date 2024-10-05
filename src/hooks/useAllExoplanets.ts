import { useState, useEffect } from "react";
import { fetchAllExoplanets } from "@/services/exoplanetService";
import { Exoplanet } from "@/types/exoplanet";

const useAllExoplanets = () => {
  const [allExoplanets, setAllExoplanets] = useState<Exoplanet[]>([]);
  const [allExoplanetsLoading, setAllExoplanetsLoading] =
    useState<boolean>(true);

  useEffect(() => {
    const getAllExoplanets = async () => {
      setAllExoplanetsLoading(true);
      const planets = await fetchAllExoplanets();
      setAllExoplanets(planets);
      setAllExoplanetsLoading(false);
    };

    getAllExoplanets();
  }, []);

  return { allExoplanets, allExoplanetsLoading };
};

export default useAllExoplanets;
