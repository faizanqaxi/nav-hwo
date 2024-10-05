import React from "react";
import { Html } from "@react-three/drei";
import { Mesh } from "three";
import { SphereGeometry, MeshStandardMaterial } from "three";

const Earth: React.FC = () => {
  return (
    <>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.01, 32, 32]} />
        <meshStandardMaterial
          color="#4B9CD3"
          emissive="#4B9CD3"
          emissiveIntensity={0.2}
        />
      </mesh>
      <Html position={[0, 0.015, 0]}>
        <div className="text-white text-xs bg-blue-800 bg-opacity-70 px-2 py-1 rounded-full border border-blue-400 cursor-pointer">
          Earth
        </div>
      </Html>
    </>
  );
};

export default Earth;
