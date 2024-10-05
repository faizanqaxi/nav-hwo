"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, useGLTF, Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, Globe, Ruler, Sun, Thermometer } from "lucide-react";
import Link from "next/link";
import { Exoplanet } from "@/types/exoplanet";

function Loader() {
  return (
    <Html center>
      <div className="text-white flex items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-2"></div>
        Loading...
      </div>
    </Html>
  );
}

function ExoplanetModelInner({ size }) {
  const meshRef = useRef();
  const { nodes, materials } = useGLTF("/rocky.glb");

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={[size, size, size]}
      geometry={nodes.Sphere.geometry}
      material={materials.rocky2}
    />
  );
}

function ExoplanetModel({ size }) {
  return (
    <Suspense fallback={<Loader />}>
      <ExoplanetModelInner size={size} />
    </Suspense>
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
  const [exoplanetData, setExoplanetData] = useState<Exoplanet | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      const decodedData = JSON.parse(decodeURIComponent(data));
      setExoplanetData(decodedData);
    }
  }, [searchParams]);

  const updateObservability = (diameter) => {
    // This is a simplified calculation and should be replaced with a more accurate model
    setObservability(Math.min(diameter / 20, 1));
  };

  if (!exoplanetData) {
    return <div>Loading...</div>;
  }

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
                  <ExoplanetModel size={2.5 || exoplanetData.radiusEarth} />
                  {/* <HostStarModel
                    size={1 || exoplanetData.starRadius}
                    type={exoplanetData.starSpectralType || "Unknown"}
                  /> */}
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
                  {/* <Text
                    position={[0, 2, 0]}
                    color="white"
                    fontSize={0.2}
                    anchorX="center"
                    anchorY="middle"
                  >
                    {exoplanetData.name}
                  </Text> */}
                  {/* <Text
                    position={[0, -2, 0]}
                    color="white"
                    fontSize={0.2}
                    anchorX="center"
                    anchorY="middle"
                  >
                    {exoplanetData.starSpectralType || "Unknown"}
                  </Text> */}
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
                <span>
                  Distance:{" "}
                  {exoplanetData.distanceLightYears?.toFixed(2) || "Unknown"}{" "}
                  light years
                </span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Host Star: {exoplanetData.hostname || "Unknown"}</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>
                  Size: {exoplanetData.radiusEarth?.toFixed(2) || "Unknown"}{" "}
                  Earth radii
                </span>
              </div>
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2" />
                <span>
                  Type:{" "}
                  {exoplanetData.radiusEarth && exoplanetData.radiusEarth > 1.6
                    ? "Super-Earth"
                    : "Earth-like"}
                </span>
              </div>
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 mr-2" />
                <span>
                  Equilibrium Temperature:{" "}
                  {exoplanetData.equilibriumTemperature?.toFixed(2) ||
                    "Unknown"}{" "}
                  K
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
              <p>
                Orbital Period:{" "}
                {exoplanetData.orbitalPeriod?.toFixed(2) || "Unknown"} days
              </p>
              <p>
                Insolation:{" "}
                {exoplanetData.insolationFlux?.toFixed(2) || "Unknown"} Earth
                flux
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Host Star Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Type: {exoplanetData.starSpectralType || "Unknown"}</p>
              <p>
                Size: {exoplanetData.starRadius?.toFixed(2) || "Unknown"} solar
                radii
              </p>
              <p>
                Luminosity:{" "}
                {exoplanetData.starLuminosity?.toFixed(4) || "Unknown"} solar
                luminosity
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Potential for Habitability</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Score: {exoplanetData.habitability?.toFixed(2) || "Unknown"}
              </p>
              <p>
                Assessment:{" "}
                {exoplanetData.habitability
                  ? exoplanetData.habitability > 0.7
                    ? "High"
                    : exoplanetData.habitability > 0.4
                    ? "Moderate"
                    : "Low"
                  : "Unknown"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Discovery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Year: {exoplanetData.discoveryYear || "Unknown"}</p>
              <p>Method: {exoplanetData.discoveryMethod || "Unknown"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

useGLTF.preload("/rocky.glb");
