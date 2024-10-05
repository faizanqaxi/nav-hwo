"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, Globe, Ruler, Sun, Thermometer } from "lucide-react";
import Link from "next/link";

// Extended mock exoplanet data
const exoplanetData = {
  name: "Kepler-186f",
  distance: 500,
  hostStar: "Kepler-186",
  habitabilityScore: 0.8,
  size: 1.17,
  type: "Super-Earth",
  orbitalPeriod: 130,
  hostStarType: "M dwarf",
  hostStarSize: 0.47,
  hostStarLuminosity: 0.04,
  potentialForHabitability: "High",
  mass: 1.5,
  radius: 1.17,
  equilibriumTemperature: 188,
  insolation: 0.32,
  discoveryYear: 2014,
  discoveryMethod: "Transit",
};

function ExoplanetModel({ size }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} scale={[size, size, size]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
}

function HostStarModel({ size, type }) {
  const color = type === "M dwarf" ? "#FF4500" : "#FFFF00";
  return (
    <mesh scale={[size * 5, size * 5, size * 5]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function ObservabilityMeter({ observability }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-4">
      <div
        className="h-full rounded-full transition-all duration-500 ease-in-out"
        style={{
          width: `${observability * 100}%`,
          backgroundColor:
            observability > 0.66
              ? "#22c55e"
              : observability > 0.33
              ? "#eab308"
              : "#ef4444",
        }}
      />
    </div>
  );
}

export default function ExoplanetDetailScreen() {
  const [telescopeDiameter, setTelescopeDiameter] = useState(10);
  const [observability, setObservability] = useState(0.6);

  const updateObservability = (diameter) => {
    // This is a simplified calculation and should be replaced with a more accurate model
    setObservability(Math.min(diameter / 20, 1));
  };

  return (
    <div className="w-full min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{exoplanetData.name}</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Exoplanet Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <ExoplanetModel size={exoplanetData.radius} />
                  <HostStarModel
                    size={exoplanetData.hostStarSize}
                    type={exoplanetData.hostStarType}
                  />
                  <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                  />
                  <Stars
                    radius={300}
                    depth={60}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                  />
                  <Text
                    position={[0, 2, 0]}
                    color="white"
                    fontSize={0.2}
                    anchorX="center"
                    anchorY="middle"
                  >
                    {exoplanetData.name}
                  </Text>
                  <Text
                    position={[0, -2, 0]}
                    color="white"
                    fontSize={0.2}
                    anchorX="center"
                    anchorY="middle"
                  >
                    {exoplanetData.hostStar}
                  </Text>
                </Canvas>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Key Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Ruler className="h-5 w-5 mr-2" />
                <span>Distance: {exoplanetData.distance} light years</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>
                  Host Star: {exoplanetData.hostStar} (
                  {exoplanetData.hostStarType})
                </span>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>Size: {exoplanetData.size} Earth radii</span>
              </div>
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2" />
                <span>Type: {exoplanetData.type}</span>
              </div>
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 mr-2" />
                <span>
                  Equilibrium Temperature:{" "}
                  {exoplanetData.equilibriumTemperature} K
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Observability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ObservabilityMeter observability={observability} />
              <p>Telescope Diameter: {telescopeDiameter} meters</p>
              <Slider
                min={1}
                max={20}
                step={0.1}
                value={[telescopeDiameter]}
                onValueChange={(value) => {
                  setTelescopeDiameter(value[0]);
                  updateObservability(value[0]);
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Orbital Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Orbital Period: {exoplanetData.orbitalPeriod} days</p>
              <p>Insolation: {exoplanetData.insolation} Earth flux</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Host Star Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Type: {exoplanetData.hostStarType}</p>
              <p>Size: {exoplanetData.hostStarSize} solar radii</p>
              <p>
                Luminosity: {exoplanetData.hostStarLuminosity} solar luminosity
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Potential for Habitability</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Score: {exoplanetData.habitabilityScore}</p>
              <p>Assessment: {exoplanetData.potentialForHabitability}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Discovery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Year: {exoplanetData.discoveryYear}</p>
              <p>Method: {exoplanetData.discoveryMethod}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
