import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { Exoplanet } from "@/types/exoplanet";

interface SearchBarProps {
  exoplanets: Exoplanet[];
}

const SearchBar: React.FC<SearchBarProps> = ({ exoplanets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Exoplanet[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const filtered = exoplanets
        .filter((planet) =>
          planet.name.toLowerCase().includes(term.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prevIndex) =>
            prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
          break;
        case "Enter":
          if (selectedIndex >= 0) {
            const selectedPlanet = suggestions[selectedIndex];
            window.location.href = `/exoplanet/${
              selectedPlanet.id
            }?data=${encodeURIComponent(JSON.stringify(selectedPlanet))}`;
          }
          break;
      }
    }
  };

  return (
    <div ref={searchRef} className="relative w-64">
      <div className="flex">
        <Input
          type="text"
          placeholder="Search planets..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-gray-800 bg-opacity-80 text-white border-gray-700"
        />
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 bg-gray-800 bg-opacity-80 text-white border-gray-700"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 bg-opacity-90 border border-gray-700 rounded-md shadow-lg">
          {suggestions.map((planet, index) => (
            <Link
              key={planet.id}
              href={`/exoplanet/${planet.id}?data=${encodeURIComponent(
                JSON.stringify(planet)
              )}`}
              passHref
            >
              <div
                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${
                  index === selectedIndex ? "bg-gray-700" : ""
                }`}
              >
                {planet.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
