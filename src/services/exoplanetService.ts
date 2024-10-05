// src/services/exoplanetService.ts

import { Exoplanet } from "@/types/exoplanet";
import { calculateCoordinates, calculateHabitabilityScore } from "@/utils/math";

// API configurations
const API_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

// Fields to get from the API
const PLANET_FIELDS =
  "pl_name,ra,dec,pl_orbsmax,pl_rade,pl_radj,pl_bmasse,pl_bmassj,pl_eqt,pl_dens,st_spectype,sy_dist,pl_orbper,st_teff,st_lum,pl_insol,pl_orbeccen,pl_trandep,st_rad,st_mass,disc_year,discoverymethod,hostname";

// Table name
const TABLE_NAME = "pscomppars";

// Query to get all exoplanets
const QUERY = `?query=select+${PLANET_FIELDS}+from+${TABLE_NAME}&format=json`;

// Query to get the top 10 exoplanets
const QUERY10 = `?query=select+top+100+${PLANET_FIELDS}+from+${TABLE_NAME}&format=json`;

// Query to get a specific exoplanet
const PLANET_NAME = "Proxima Cen b";
const QUERYP = `?query=select+${PLANET_FIELDS}+from+${TABLE_NAME}+where+pl_name='${PLANET_NAME}'&format=json`;

const CORS_PROXY = "https://corsproxy.io/?";

/**
 * Fetches exoplanet data from the API.
 * @returns Array of Exoplanet objects.
 */
export const fetchExoplanets = async (
  viewMode: string
): Promise<Exoplanet[]> => {
  console.log("Fetching Exoplanet Data");

  let query = QUERY; // Default to all planets

  if (viewMode === "single") {
    query = QUERYP;
  } else if (viewMode === "top10") {
    query = QUERY10;
  }

  try {
    const response = await fetch(
      CORS_PROXY + encodeURIComponent(`${API_URL}${query}`)
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    console.log("data: ", data);

    const transformedData: Exoplanet[] = data.map((planet: any) => {
      const { x, y, z } = calculateCoordinates(
        planet.ra,
        planet.dec,
        planet.sy_dist
      );

      const exoplanet: Exoplanet = {
        id: planet.pl_name,
        name: planet.pl_name,
        x,
        y,
        z,
        ra: parseFloat(planet.ra),
        dec: parseFloat(planet.dec),
        orbitalSemiMajorAxis: parseFloat(planet.pl_orbsmax),
        radiusEarth: parseFloat(planet.pl_rade),
        radiusJupiter: parseFloat(planet.pl_radj),
        massEarth: parseFloat(planet.pl_bmasse),
        massJupiter: parseFloat(planet.pl_bmassj),
        equilibriumTemperature: parseFloat(planet.pl_eqt),
        density: parseFloat(planet.pl_dens),
        hostname: planet.hostname,
        starSpectralType: planet.st_spectype,
        distance: parseFloat(planet.sy_dist),
        distanceLightYears: parseFloat(planet.sy_dist) * 3.26156,
        orbitalPeriod: parseFloat(planet.pl_orbper),
        starEffectiveTemperature: parseFloat(planet.st_teff),
        starLuminosity: parseFloat(planet.st_lum),
        insolationFlux: parseFloat(planet.pl_insol),
        orbitalEccentricity: parseFloat(planet.pl_orbeccen),
        transitDepth: parseFloat(planet.pl_trandep),
        starRadius: parseFloat(planet.st_rad),
        starMass: parseFloat(planet.st_mass),
        discoveryYear: parseInt(planet.disc_year),
        discoveryMethod: planet.discoverymethod,
        size: parseFloat(planet.pl_rade) || 1,
        habitability: 0,
      };

      exoplanet.habitability = calculateHabitabilityScore(exoplanet);

      return exoplanet;
    });

    console.log("transformedData: ", transformedData);

    return transformedData;
  } catch (error) {
    console.error("Error fetching exoplanet data:", error);
    return [];
  }
};

/**
 * Fetches data for a single exoplanet by name.
 * @param planetName The name of the exoplanet to fetch.
 * @returns An Exoplanet object or null if not found.
 */
export const fetchExoplanet = async (
  planetName: string
): Promise<Exoplanet | null> => {
  console.log(`Fetching data for exoplanet: ${planetName}`);

  try {
    const query = `?query=select+${PLANET_FIELDS}+from+${TABLE_NAME}+where+pl_name='${planetName}'&format=json`;
    const response = await fetch(
      CORS_PROXY + encodeURIComponent(`${API_URL}${query}`)
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.length === 0) {
      console.log(`No data found for exoplanet: ${planetName}`);
      return null;
    }

    const planet = data[0];
    const { x, y, z } = calculateCoordinates(
      planet.ra,
      planet.dec,
      planet.sy_dist
    );

    const exoplanet: Exoplanet = {
      id: planet.pl_name,
      name: planet.pl_name,
      x,
      y,
      z,
      ra: parseFloat(planet.ra),
      dec: parseFloat(planet.dec),
      orbitalSemiMajorAxis: parseFloat(planet.pl_orbsmax),
      radiusEarth: parseFloat(planet.pl_rade),
      radiusJupiter: parseFloat(planet.pl_radj),
      massEarth: parseFloat(planet.pl_bmasse),
      massJupiter: parseFloat(planet.pl_bmassj),
      equilibriumTemperature: parseFloat(planet.pl_eqt),
      density: parseFloat(planet.pl_dens),
      starSpectralType: planet.st_spectype,
      distance: parseFloat(planet.sy_dist),
      distanceLightYears: parseFloat(planet.sy_dist) * 3.26156,
      orbitalPeriod: parseFloat(planet.pl_orbper),
      starEffectiveTemperature: parseFloat(planet.st_teff),
      starLuminosity: parseFloat(planet.st_lum),
      insolationFlux: parseFloat(planet.pl_insol),
      orbitalEccentricity: parseFloat(planet.pl_orbeccen),
      transitDepth: parseFloat(planet.pl_trandep),
      starRadius: parseFloat(planet.st_rad),
      starMass: parseFloat(planet.st_mass),
      discoveryYear: parseInt(planet.disc_year),
      discoveryMethod: planet.discoverymethod,
      size: parseFloat(planet.pl_rade) || 1,
      habitability: 0, // We'll calculate this next
      hostname: planet.hostname,
    };

    exoplanet.habitability = calculateHabitabilityScore(exoplanet);

    return exoplanet;
  } catch (error) {
    console.error(`Error fetching data for exoplanet ${planetName}:`, error);
    return null;
  }
};

export const fetchAllExoplanets = async (): Promise<Exoplanet[]> => {
  console.log("Fetching All Exoplanet Data");

  try {
    const response = await fetch(
      CORS_PROXY + encodeURIComponent(`${API_URL}${QUERY}`)
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const transformedData: Exoplanet[] = data.map((planet: any) => {
      const { x, y, z } = calculateCoordinates(
        planet.ra,
        planet.dec,
        planet.sy_dist
      );

      const exoplanet: Exoplanet = {
        id: planet.pl_name,
        name: planet.pl_name,
        x,
        y,
        z,
        ra: parseFloat(planet.ra),
        dec: parseFloat(planet.dec),
        orbitalSemiMajorAxis: parseFloat(planet.pl_orbsmax),
        radiusEarth: parseFloat(planet.pl_rade),
        radiusJupiter: parseFloat(planet.pl_radj),
        massEarth: parseFloat(planet.pl_bmasse),
        massJupiter: parseFloat(planet.pl_bmassj),
        equilibriumTemperature: parseFloat(planet.pl_eqt),
        density: parseFloat(planet.pl_dens),
        hostname: planet.hostname,
        starSpectralType: planet.st_spectype,
        distance: parseFloat(planet.sy_dist),
        distanceLightYears: parseFloat(planet.sy_dist) * 3.26156,
        orbitalPeriod: parseFloat(planet.pl_orbper),
        starEffectiveTemperature: parseFloat(planet.st_teff),
        starLuminosity: parseFloat(planet.st_lum),
        insolationFlux: parseFloat(planet.pl_insol),
        orbitalEccentricity: parseFloat(planet.pl_orbeccen),
        transitDepth: parseFloat(planet.pl_trandep),
        starRadius: parseFloat(planet.st_rad),
        starMass: parseFloat(planet.st_mass),
        discoveryYear: parseInt(planet.disc_year),
        discoveryMethod: planet.discoverymethod,
        size: parseFloat(planet.pl_rade) || 1,
        habitability: 0, // We'll calculate this next
      };

      exoplanet.habitability = calculateHabitabilityScore(exoplanet);

      return exoplanet;
    });

    return transformedData;
  } catch (error) {
    console.error("Error fetching all exoplanet data:", error);
    return [];
  }
};
