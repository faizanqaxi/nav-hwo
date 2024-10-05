"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FilterScreen() {
  const [distanceRange, setDistanceRange] = useState([0, 1000]);
  const [telescopeDiameter, setTelescopeDiameter] = useState(10);
  const [planetTypes, setPlanetTypes] = useState({
    rocky: true,
    gasGiant: true,
    iceGiant: true,
  });
  const [starTypes, setStarTypes] = useState({
    mDwarf: true,
    sunLike: true,
    giantStar: true,
  });
  const [habitableZoneOnly, setHabitableZoneOnly] = useState(false);
  const router = useRouter();

  const handlePlanetTypeChange = (type) => {
    setPlanetTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleStarTypeChange = (type) => {
    setStarTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleApplyFilters = () => {
    // Here you would typically update a global state or context
    // For now, we'll just log the filter state
    console.log({
      distanceRange,
      telescopeDiameter,
      planetTypes,
      starTypes,
      habitableZoneOnly,
    });
    // Navigate back to home screen
    router.push("/");
  };

  return (
    <div className="w-full min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Filter Exoplanets</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>Distance Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={distanceRange}
              onValueChange={setDistanceRange}
            />
            <p className="mt-2">
              {distanceRange[0]} - {distanceRange[1]} light years
            </p>
          </CardContent>
        </Card>

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

        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>Planet Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rocky"
                checked={planetTypes.rocky}
                onCheckedChange={() => handlePlanetTypeChange("rocky")}
              />
              <label htmlFor="rocky">Rocky Planets</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gasGiant"
                checked={planetTypes.gasGiant}
                onCheckedChange={() => handlePlanetTypeChange("gasGiant")}
              />
              <label htmlFor="gasGiant">Gas Giants</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="iceGiant"
                checked={planetTypes.iceGiant}
                onCheckedChange={() => handlePlanetTypeChange("iceGiant")}
              />
              <label htmlFor="iceGiant">Ice Giants</label>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>Star Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mDwarf"
                checked={starTypes.mDwarf}
                onCheckedChange={() => handleStarTypeChange("mDwarf")}
              />
              <label htmlFor="mDwarf">M Dwarfs</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sunLike"
                checked={starTypes.sunLike}
                onCheckedChange={() => handleStarTypeChange("sunLike")}
              />
              <label htmlFor="sunLike">Sun-like Stars</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="giantStar"
                checked={starTypes.giantStar}
                onCheckedChange={() => handleStarTypeChange("giantStar")}
              />
              <label htmlFor="giantStar">Giant Stars</label>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>Habitable Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="habitableZone"
                checked={habitableZoneOnly}
                onCheckedChange={setHabitableZoneOnly}
              />
              <label htmlFor="habitableZone">
                Show only planets in habitable zone
              </label>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
