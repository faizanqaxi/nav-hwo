import React, { useRef, useMemo, useEffect } from "react";
import { InstancedMesh, Object3D, Vector3 } from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Exoplanet } from "@/types/exoplanet";

interface ExoplanetInstancedProps {
  exoplanets: Exoplanet[];
  onClick: (position: [number, number, number]) => void;
  onHover: (position: [number, number, number]) => void;
  onHoverEnd: () => void;
  showNames: boolean;
}

const ExoplanetInstanced: React.FC<ExoplanetInstancedProps> = ({
  exoplanets,
  onClick,
  onHover,
  onHoverEnd,
  showNames,
}) => {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (meshRef.current) {
      exoplanets.forEach((planet, index) => {
        dummy.position.set(planet.x, planet.y, planet.z);
        dummy.scale.setScalar(planet.size * 0.01);
        dummy.rotation.y += 0.01;
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(index, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [exoplanets, dummy]);

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, exoplanets.length]}
        onPointerOver={(event) => {
          const instanceId = event.instanceId;
          if (instanceId !== undefined) {
            const planet = exoplanets[instanceId];
            onHover([planet.x, planet.y, planet.z]);
          }
        }}
        onPointerOut={onHoverEnd}
        onClick={(event) => {
          const instanceId = event.instanceId;
          if (instanceId !== undefined) {
            const planet = exoplanets[instanceId];
            onClick([planet.x, planet.y, planet.z]);
          }
        }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#7FD1B9"
          emissive="#7FD1B9"
          emissiveIntensity={0.5}
        />
      </instancedMesh>

      {showNames &&
        exoplanets.map((planet, index) => (
          <Html key={index} position={[planet.x, planet.y, planet.z]}>
            <div
              className="text-white text-xs bg-black bg-opacity-50 px-1 rounded cursor-pointer"
              onClick={() => onClick([planet.x, planet.y, planet.z])}
              onMouseEnter={() => onHover([planet.x, planet.y, planet.z])}
              onMouseLeave={onHoverEnd}
            >
              {planet.name}
            </div>
          </Html>
        ))}
    </>
  );
};

export default ExoplanetInstanced;
