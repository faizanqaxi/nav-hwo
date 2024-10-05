import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterMenuProps {
  telescopeDiameter: number;
  setTelescopeDiameter: (value: number) => void;
  maxDistance: number;
  setMaxDistance: (value: number) => void;
  telescopePosition: [number, number, number];
  setTelescopePosition: (position: [number, number, number]) => void;
  telescopeRotation: [number, number, number];
  setTelescopeRotation: (rotation: [number, number, number]) => void;
  showNames: boolean;
  setShowNames: (show: boolean) => void;
  resetFilters: () => void;
  planetViewMode: string;
  setPlanetViewMode: (mode: string) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  telescopeDiameter,
  setTelescopeDiameter,
  maxDistance,
  setMaxDistance,
  telescopePosition,
  setTelescopePosition,
  telescopeRotation,
  setTelescopeRotation,
  showNames,
  setShowNames,
  resetFilters,
  planetViewMode,
  setPlanetViewMode,
}) => {
  const handlePlanetViewModeChange = (mode: string) => {
    if (mode === "all") {
      setShowNames(false);
    }
    setPlanetViewMode(mode);
  };

  return (
    <Card className="absolute left-4 top-4 w-64 z-10 bg-gray-800 bg-opacity-80 text-white border-gray-700">
      <CardHeader>
        <CardTitle>Filters & Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Planet View Mode Selector */}
        <div className="space-y-2">
          <label htmlFor="planet-view-mode" className="text-sm font-medium">
            Planet View Mode
          </label>
          <Select
            value={planetViewMode}
            onValueChange={handlePlanetViewModeChange}
          >
            <SelectTrigger id="planet-view-mode">
              <SelectValue placeholder="Select view mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Planet</SelectItem>
              <SelectItem value="top10">Top 100 Planets</SelectItem>
              <SelectItem value="all">All Planets</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Telescope Diameter */}
        <div className="space-y-2">
          <label htmlFor="telescope-diameter" className="text-sm font-medium">
            Telescope Diameter: {telescopeDiameter}m
          </label>
          <Slider
            id="telescope-diameter"
            min={1}
            max={20}
            step={0.1}
            value={[telescopeDiameter]}
            onValueChange={(value) => setTelescopeDiameter(value[0])}
            className="bg-gray-700"
          />
        </div>

        {/* Max Distance */}
        <div className="space-y-2">
          <label htmlFor="max-distance" className="text-sm font-medium">
            Max Distance: {maxDistance} light years
          </label>
          <Slider
            id="max-distance"
            min={0}
            max={1000}
            step={10}
            value={[maxDistance]}
            onValueChange={(value) => setMaxDistance(value[0])}
            className="bg-gray-700"
          />
        </div>

        {/* Telescope Position X */}
        <div className="space-y-2">
          <label htmlFor="telescope-x" className="text-sm font-medium">
            Telescope X: {telescopePosition[0].toFixed(2)}
          </label>
          <Slider
            id="telescope-x"
            min={-5}
            max={5}
            step={0.1}
            value={[telescopePosition[0]]}
            onValueChange={(value) =>
              setTelescopePosition([
                value[0],
                telescopePosition[1],
                telescopePosition[2],
              ])
            }
            className="bg-gray-700"
          />
        </div>

        {/* Telescope Position Y */}
        <div className="space-y-2">
          <label htmlFor="telescope-y" className="text-sm font-medium">
            Telescope Y: {telescopePosition[1].toFixed(2)}
          </label>
          <Slider
            id="telescope-y"
            min={-5}
            max={5}
            step={0.1}
            value={[telescopePosition[1]]}
            onValueChange={(value) =>
              setTelescopePosition([
                telescopePosition[0],
                value[0],
                telescopePosition[2],
              ])
            }
            className="bg-gray-700"
          />
        </div>

        {/* Telescope Position Z */}
        <div className="space-y-2">
          <label htmlFor="telescope-z" className="text-sm font-medium">
            Telescope Z: {telescopePosition[2].toFixed(2)}
          </label>
          <Slider
            id="telescope-z"
            min={-5}
            max={5}
            step={0.1}
            value={[telescopePosition[2]]}
            onValueChange={(value) =>
              setTelescopePosition([
                telescopePosition[0],
                telescopePosition[1],
                value[0],
              ])
            }
            className="bg-gray-700"
          />
        </div>

        {/* Telescope Rotation X */}
        <div className="space-y-2">
          <label htmlFor="telescope-rotation-x" className="text-sm font-medium">
            Telescope Rotation X:{" "}
            {((telescopeRotation[0] * 180) / Math.PI).toFixed(2)}°
          </label>
          <Slider
            id="telescope-rotation-x"
            min={-Math.PI}
            max={Math.PI}
            step={0.1}
            value={[telescopeRotation[0]]}
            onValueChange={(value) =>
              setTelescopeRotation([
                value[0],
                telescopeRotation[1],
                telescopeRotation[2],
              ])
            }
            className="bg-gray-700"
          />
        </div>

        {/* Telescope Rotation Y */}
        <div className="space-y-2">
          <label htmlFor="telescope-rotation-y" className="text-sm font-medium">
            Telescope Rotation Y:{" "}
            {((telescopeRotation[1] * 180) / Math.PI).toFixed(2)}°
          </label>
          <Slider
            id="telescope-rotation-y"
            min={-Math.PI}
            max={Math.PI}
            step={0.1}
            value={[telescopeRotation[1]]}
            onValueChange={(value) =>
              setTelescopeRotation([
                telescopeRotation[0],
                value[0],
                telescopeRotation[2],
              ])
            }
            className="bg-gray-700"
          />
        </div>

        {/* Telescope Rotation Z */}
        <div className="space-y-2">
          <label htmlFor="telescope-rotation-z" className="text-sm font-medium">
            Telescope Rotation Z:{" "}
            {((telescopeRotation[2] * 180) / Math.PI).toFixed(2)}°
          </label>
          <Slider
            id="telescope-rotation-z"
            min={-Math.PI}
            max={Math.PI}
            step={0.1}
            value={[telescopeRotation[2]]}
            onValueChange={(value) =>
              setTelescopeRotation([
                telescopeRotation[0],
                telescopeRotation[1],
                value[0],
              ])
            }
            className="bg-gray-700"
          />
        </div>

        {/* Show Names Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="show-names"
            checked={showNames}
            onCheckedChange={setShowNames}
            disabled={planetViewMode === "all"}
          />
          <Label htmlFor="show-names">Show Exoplanet Names</Label>
        </div>

        {/* Reset Button */}
        <Button
          onClick={resetFilters}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Reset All
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterMenu;
