import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedSphere() {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere args={[1.2, 64, 64]} ref={meshRef}>
      <MeshDistortMaterial
        color="#eab308"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

export function ThreeDElement() {
  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <AnimatedSphere />
      </Canvas>
      <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Powered by Three.js & Fiber</span>
      </div>
    </div>
  );
}
