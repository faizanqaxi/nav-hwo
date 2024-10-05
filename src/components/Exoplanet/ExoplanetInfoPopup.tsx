import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { Exoplanet } from "@/types/exoplanet";

interface ExoplanetInfoPopupProps {
  exoplanet: Exoplanet | null;
  onClose: () => void;
}

const ExoplanetInfoPopup: React.FC<ExoplanetInfoPopupProps> = ({
  exoplanet,
  onClose,
}) => {
  if (!exoplanet) return null;

  const encodedData = encodeURIComponent(JSON.stringify(exoplanet));

  return (
    <Card className="absolute top-4 right-4 w-64 z-10 bg-gray-800 bg-opacity-80 text-white border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{exoplanet.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p>Distance: {exoplanet.distanceLightYears?.toFixed(2)} light years</p>
        <p>Star Type: {exoplanet.starSpectralType || "Unknown"}</p>
        <p>Planet Radius: {exoplanet.radiusEarth?.toFixed(2)} Earth radii</p>
        <p>
          Equilibrium Temp: {exoplanet.equilibriumTemperature?.toFixed(2)} K
        </p>
        <p>Habitability Score: {exoplanet.habitability?.toFixed(2)}</p>
        <Link href={`/exoplanet/${exoplanet.id}?data=${encodedData}`} passHref>
          <Button className="mt-2 w-full bg-blue-600 hover:bg-blue-700">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ExoplanetInfoPopup;
