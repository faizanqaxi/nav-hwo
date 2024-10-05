"use client";

import { useState, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Filter, BarChart2, Star } from "lucide-react";
import Link from "next/link";
import * as THREE from "three";

import Earth from "@/components/Earth/Earth";
import HWOTelescope from "@/components/HWOTelescope/HWOTelescope";
import ExoplanetInstanced from "@/components/Exoplanet/ExoplanetInstanced";
import ObservationPath from "@/components/Exoplanet/ObservationPath";
import ExoplanetInfoPopup from "@/components/Exoplanet/ExoplanetInfoPopup";
import FilterMenu from "@/components/FilterMenu/FilterMenu";
import SearchBar from "@/components/SearchBar/SearchBar";

import useExoplanets from "@/hooks/useExoplanets";
import { Exoplanet } from "@/types/exoplanet";
import useAllExoplanets from "@/hooks/useAllExoplanets";

export default function Page() {
  const [telescopeDiameter, setTelescopeDiameter] = useState(10);
  const [maxDistance, setMaxDistance] = useState(500);
  const [selectedExoplanet, setSelectedExoplanet] = useState<Exoplanet | null>(
    null
  );
  const [telescopePosition, setTelescopePosition] = useState<
    [number, number, number]
  >([0.5, 0.5, 0.5]);
  const [telescopeRotation, setTelescopeRotation] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [hoveredPlanetPosition, setHoveredPlanetPosition] = useState<
    [number, number, number] | null
  >(null);
  const [showNames, setShowNames] = useState(true);
  const [planetViewMode, setPlanetViewMode] = useState<string>("top10");

  const { exoplanets, loading } = useExoplanets(planetViewMode);
  const { allExoplanets, allExoplanetsLoading } = useAllExoplanets();

  const resetFilters = () => {
    setTelescopeDiameter(10);
    setMaxDistance(500);
    setTelescopePosition([0.5, 0.5, 0.5]);
    setTelescopeRotation([0, 0, 0]);
    setShowNames(false);
  };

  const isExoplanetObservable = useCallback(
    (exoplanetPosition: [number, number, number]) => {
      const distance = new THREE.Vector3(...exoplanetPosition).distanceTo(
        new THREE.Vector3(...telescopePosition)
      );
      return distance <= maxDistance;
    },
    [maxDistance, telescopePosition]
  );

  const observableExoplanets = useMemo(() => {
    return exoplanets.filter((planet) =>
      isExoplanetObservable([planet.x, planet.y, planet.z])
    );
  }, [exoplanets, isExoplanetObservable]);

  const handleExoplanetClick = (position: [number, number, number]) => {
    const clickedExoplanet = exoplanets.find(
      (e) => e.x === position[0] && e.y === position[1] && e.z === position[2]
    );
    setSelectedExoplanet(clickedExoplanet || null);
    setHoveredPlanetPosition(position);
    rotateTelescopeTowards(position);
  };

  const handleExoplanetHover = (position: [number, number, number]) => {
    setHoveredPlanetPosition(position);
  };

  const handleExoplanetHoverEnd = () => {
    if (!selectedExoplanet) {
      setHoveredPlanetPosition(null);
    }
  };

  const rotateTelescopeTowards = (targetPosition: [number, number, number]) => {
    const telescopePos = new THREE.Vector3(...telescopePosition);
    const targetPos = new THREE.Vector3(...targetPosition);
    const direction = new THREE.Vector3()
      .subVectors(targetPos, telescopePos)
      .normalize();

    const telescopeQuaternion = new THREE.Quaternion();
    const forwardVector = new THREE.Vector3(0, 1, 0); // Assuming Y is forward
    telescopeQuaternion.setFromUnitVectors(forwardVector, direction);

    const rotationEuler = new THREE.Euler().setFromQuaternion(
      telescopeQuaternion
    );

    setTelescopeRotation([rotationEuler.x, rotationEuler.y, rotationEuler.z]);
  };

  return (
    <div className="w-full h-screen relative bg-[#1E1E2F]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 90 }} // camera position
        shadows // Enable shadows if needed
      >
        {/* Background Color */}
        <color attach="background" args={["#000000"]} />

        {/* Ambient Light */}
        <ambientLight intensity={0.3} />

        {/* Directional Light for Exoplanets */}
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Hemisphere Light for Additional Soft Lighting */}
        <hemisphereLight
          skyColor={0xaaaaaa}
          groundColor={0x444444}
          intensity={0.5}
        />

        {/* Point Light for Enhanced Specular Highlights */}
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Stars in the Background */}
        <Stars
          radius={300}
          depth={60}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
        />

        {/* Earth Component */}
        <Earth />

        {/* HWO Telescope Component */}
        <HWOTelescope
          position={telescopePosition}
          rotation={telescopeRotation}
        />

        {/* Exoplanets Instanced Mesh */}
        {!loading && (
          <ExoplanetInstanced
            exoplanets={observableExoplanets}
            onClick={handleExoplanetClick}
            onHover={handleExoplanetHover}
            onHoverEnd={handleExoplanetHoverEnd}
            showNames={showNames}
          />
        )}

        {/* Observation Path Between Telescope and Exoplanet */}
        {hoveredPlanetPosition && (
          <ObservationPath
            start={telescopePosition}
            end={hoveredPlanetPosition}
            visible={true}
          />
        )}
      </Canvas>

      {/* UI Components */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <SearchBar exoplanets={allExoplanets} />
      </div>
      <FilterMenu
        telescopeDiameter={telescopeDiameter}
        setTelescopeDiameter={setTelescopeDiameter}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        telescopePosition={telescopePosition}
        setTelescopePosition={setTelescopePosition}
        telescopeRotation={telescopeRotation}
        setTelescopeRotation={setTelescopeRotation}
        showNames={showNames}
        setShowNames={setShowNames}
        resetFilters={resetFilters}
        planetViewMode={planetViewMode}
        setPlanetViewMode={setPlanetViewMode}
      />
      <ExoplanetInfoPopup
        exoplanet={selectedExoplanet}
        onClose={() => {
          setSelectedExoplanet(null);
          setHoveredPlanetPosition(null);
        }}
      />
      <div className="absolute top-4 right-4 space-x-2">
        <Link href="/filter">
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800 bg-opacity-80 text-white border-gray-700"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/compare">
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800 bg-opacity-80 text-white border-gray-700"
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/favorites">
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800 bg-opacity-80 text-white border-gray-700"
          >
            <Star className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
