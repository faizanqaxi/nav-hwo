// src/hooks/useExoplanets.ts

import { useState, useEffect } from "react";
import { fetchExoplanets } from "@/services/exoplanetService";
import { Exoplanet } from "@/types/exoplanet";

/**
 * Custom hook to fetch and manage exoplanet data.
 * @returns Exoplanet data and loading state.
 */
const useExoplanets = (viewMode: string) => {
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getExoplanets = async () => {
      setLoading(true);
      const planets = await fetchExoplanets(viewMode);
      setExoplanets(planets);
      setLoading(false);
    };

    getExoplanets();
  }, [viewMode]);

  return { exoplanets, loading };
};

export default useExoplanets;
