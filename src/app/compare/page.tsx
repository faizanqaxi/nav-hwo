"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock data for exoplanets
const exoplanets = [
  {
    id: 1,
    name: "Kepler-186f",
    distance: 500,
    hostStar: "Kepler-186",
    type: "Super-Earth",
    size: 1.17,
    habitability: 0.8,
    observability: 0.7,
  },
  {
    id: 2,
    name: "HD 40307g",
    distance: 42,
    hostStar: "HD 40307",
    type: "Super-Earth",
    size: 2.4,
    habitability: 0.6,
    observability: 0.9,
  },
  {
    id: 3,
    name: "Proxima Centauri b",
    distance: 4.2,
    hostStar: "Proxima Centauri",
    type: "Earth-like",
    size: 1.08,
    habitability: 0.9,
    observability: 0.8,
  },
];

function ExoplanetCard({ exoplanet, telescopeDiameter }) {
  const observability =
    Math.min(telescopeDiameter / 20, 1) * exoplanet.observability;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>{exoplanet.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Distance: {exoplanet.distance} light years</p>
        <p>Host Star: {exoplanet.hostStar}</p>
        <p>Type: {exoplanet.type}</p>
        <p>Size: {exoplanet.size} Earth radii</p>
        <p>Habitability Score: {exoplanet.habitability.toFixed(2)}</p>
        <div className="mt-2">
          <p>Observability:</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
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
        </div>
        <Link href={`/exoplanet/${exoplanet.id}`}>
          <Button className="mt-4 w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function ComparisonScreen() {
  const [telescopeDiameter, setTelescopeDiameter] = useState(10);

  return (
    <div className="w-full min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Exoplanet Comparison</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>Telescope Diameter</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              min={1}
              max={20}
              step={0.1}
              value={[telescopeDiameter]}
              onValueChange={(value) => setTelescopeDiameter(value[0])}
            />
            <p className="mt-2">{telescopeDiameter} meters</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exoplanets.map((exoplanet) => (
            <ExoplanetCard
              key={exoplanet.id}
              exoplanet={exoplanet}
              telescopeDiameter={telescopeDiameter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
