import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

interface HWOTelescopeProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

const HWOTelescope: React.FC<HWOTelescopeProps> = ({ position, rotation }) => {
  const meshRef = useRef<THREE.Group>(null);
  const eulerRotation = useMemo(() => new THREE.Euler(...rotation), [rotation]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
      meshRef.current.setRotationFromEuler(eulerRotation);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main telescope body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 32]} />
        <meshStandardMaterial
          color="#E0E0E0"
          emissive="#E0E0E0"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* A starshade (as a ring around the telescope) */}
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Back part of the telescope */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.05, 32]} />
        <meshStandardMaterial color="#A0A0A0" emissive="#707070" />
      </mesh>

      {/* Text label for the telescope */}
      <Html position={[0, 0.3, 0]}>
        <div className="text-white text-[10px] bg-purple-800 bg-opacity-70 px-2 py-0.5 rounded-full border border-purple-400 cursor-pointer">
          HWO Telescope
        </div>
      </Html>
    </group>
  );
};

export default HWOTelescope;
