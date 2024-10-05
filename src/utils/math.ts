import { Exoplanet } from "@/types/exoplanet";

/**
 * Converts degrees to radians.
 * @param deg Degrees.
 * @returns Radians.
 */
export const degreesToRadians = (deg: number): number => deg * (Math.PI / 180);

/**
 * Calculates 3D Cartesian coordinates from RA, Dec, and distance.
 * @param raDeg Right Ascension in degrees.
 * @param decDeg Declination in degrees.
 * @param distance Distance to the star in parsecs.
 * @returns Cartesian coordinates { x, y, z }.
 */
export const calculateCoordinates = (
  raDeg: number,
  decDeg: number,
  distance: number = 100
): { x: number; y: number; z: number } => {
  const raRad = degreesToRadians(raDeg);
  const decRad = degreesToRadians(decDeg);
  const d = distance || 100;

  const x = d * Math.cos(decRad) * Math.cos(raRad);
  const y = d * Math.cos(decRad) * Math.sin(raRad);
  const z = d * Math.sin(decRad);

  return { x, y, z };
};

/**
 * Calculates a habitability score based on multiple exoplanet parameters.
 * @param exoplanet Exoplanet object containing relevant data.
 * @returns Habitability score between 0 and 1.
 */
export const calculateHabitabilityScore = (exoplanet: Exoplanet): number => {
  const weights = {
    eqt: 0.3,
    radius: 0.2,
    insolation: 0.2,
    density: 0.15,
    orbitalPeriod: 0.15,
  };

  const scores = {
    eqt: calculateEqtScore(exoplanet.equilibriumTemperature),
    radius: calculateRadiusScore(exoplanet.radiusEarth),
    insolation: calculateInsolationScore(exoplanet.insolationFlux),
    density: calculateDensityScore(exoplanet.density),
    orbitalPeriod: calculateOrbitalPeriodScore(exoplanet.orbitalPeriod),
  };

  // console.log("Individual scores:", scores); // Debugging line

  let totalScore = 0;
  let totalWeight = 0;

  for (const [key, score] of Object.entries(scores)) {
    if (score !== null) {
      totalScore += score * weights[key as keyof typeof weights];
      totalWeight += weights[key as keyof typeof weights];
    }
  }

  // console.log("Total score:", totalScore, "Total weight:", totalWeight); // Debugging line

  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

// Helper functions for individual parameter scores

const parseNumber = (value: number | string | null): number | null => {
  if (value === null || value === "") return null;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? null : num;
};

const calculateEqtScore = (eqt: number | string | null): number | null => {
  const parsedEqt = parseNumber(eqt);
  if (parsedEqt === null) return null;
  const optimalTemp = 278; // Earth-like temperature in Kelvin
  const tempDiff = Math.abs(parsedEqt - optimalTemp);
  return Math.max(0, 1 - tempDiff / 100); // Adjusted range
};

const calculateRadiusScore = (
  radiusEarth: number | string | null
): number | null => {
  const parsedRadius = parseNumber(radiusEarth);
  if (parsedRadius === null) return null;
  return Math.max(0, 1 - Math.abs(parsedRadius - 1) / 1); // Adjusted range
};

const calculateInsolationScore = (
  insolationFlux: number | string | null
): number | null => {
  const parsedFlux = parseNumber(insolationFlux);
  if (parsedFlux === null) return null;
  const optimalFlux = 1; // Earth's flux is defined as 1
  const fluxDiff = Math.abs(parsedFlux - optimalFlux);
  return Math.max(0, 1 - fluxDiff / 2); // Adjusted range
};

const calculateDensityScore = (
  density: number | string | null
): number | null => {
  const parsedDensity = parseNumber(density);
  if (parsedDensity === null) return null;
  const optimalDensity = 5.51; // Earth's density
  const densityDiff = Math.abs(parsedDensity - optimalDensity);
  return Math.max(0, 1 - densityDiff / 3); // Adjusted range
};

const calculateOrbitalPeriodScore = (
  orbitalPeriod: number | string | null
): number | null => {
  const parsedPeriod = parseNumber(orbitalPeriod);
  if (parsedPeriod === null) return null;
  const optimalPeriod = 365; // Earth's orbital period
  const periodDiff = Math.abs(parsedPeriod - optimalPeriod);
  return Math.max(0, 1 - periodDiff / 365); // Adjusted range
};
