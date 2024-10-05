"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, X } from "lucide-react";
import Link from "next/link";

// Mock data for favorite exoplanets
const initialFavorites = [
  {
    id: 1,
    name: "Kepler-186f",
    distance: 500,
    type: "Super-Earth",
    observable: true,
  },
  {
    id: 2,
    name: "HD 40307g",
    distance: 42,
    type: "Super-Earth",
    observable: true,
  },
  {
    id: 3,
    name: "Proxima Centauri b",
    distance: 4.2,
    type: "Earth-like",
    observable: true,
  },
  {
    id: 4,
    name: "TRAPPIST-1e",
    distance: 39,
    type: "Earth-sized",
    observable: false,
  },
];

function FavoriteExoplanetCard({ exoplanet, onRemove }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{exoplanet.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(exoplanet.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-400">
          Distance: {exoplanet.distance} light years
        </p>
        <p className="text-xs text-gray-400">Type: {exoplanet.type}</p>
        <div className="flex items-center mt-2">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              exoplanet.observable ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <p className="text-xs">
            {exoplanet.observable ? "Observable" : "Not Observable"}
          </p>
        </div>
        <Link href={`/exoplanet/${exoplanet.id}`}>
          <Button className="mt-4 w-full" size="sm">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState(initialFavorites);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((exoplanet) => exoplanet.id !== id));
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
          <h1 className="text-3xl font-bold">Favorite Exoplanets</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        {favorites.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center h-40">
              <Star className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400">No favorite exoplanets yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favorites.map((exoplanet) => (
              <FavoriteExoplanetCard
                key={exoplanet.id}
                exoplanet={exoplanet}
                onRemove={removeFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
