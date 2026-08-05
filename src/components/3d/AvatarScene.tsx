import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import AvatarRenderer from "./AvatarRenderer";
import { useAvatarManager } from "./AvatarManager";

interface AvatarSceneProps {
  clubColor?: string;
  pose?: "idle" | "confident" | "celebration" | "arms_crossed";
}

export default function AvatarScene({
  clubColor = "#ffffff",
  pose = "idle",
}: AvatarSceneProps) {
  const { quality } = useAvatarManager();
  const dpr =
    quality === "high"
      ? ([1, 2] as [number, number])
      : ([1, 1] as [number, number]);
      
  // Sombra de contato habilitada para todos os níveis, garantindo que o avatar 
  // pareça ancorado ao piso do estúdio.
  const useContactShadows = true;

  return (
    <div className="w-full h-full relative overflow-hidden bg-zinc-950">
      
      {/* Background Gradient & Halo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-zinc-950 opacity-90" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Text Branding */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <h1 className="text-[8vw] font-black tracking-tighter text-white whitespace-nowrap uppercase">
          Goat
        </h1>
      </div>
      <div className="absolute top-6 left-8 pointer-events-none z-10">
        <p className="text-zinc-500 text-xs tracking-[0.2em] font-medium uppercase">
          Goat Player Studio
        </p>
      </div>

      <Canvas shadows dpr={dpr}>
        {/* 
          Câmera e Enquadramento:
          O modelo tem aprox 1.8m de altura e base no y=-1.5.
          A câmera e o target foram ajustados para enquadrar ~70-75% da tela.
          Isso evita a necessidade de zoom manual inicial e mantém margens seguras 
          para a cabeça e os pés.
        */}
        <PerspectiveCamera makeDefault position={[0, 0, 4.0]} fov={35} />
        
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={5.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2 + 0.05}
          target={[0, -0.4, 0]}
        />
        
        {/* Iluminação do Estúdio */}
        <ambientLight intensity={0.5} />
        
        {/* Key Light (Luz Principal Frontal-Lateral Esquerda) */}
        <directionalLight
          position={[3, 4, 5]}
          intensity={1.2}
          color="#ffffff"
          castShadow
          shadow-mapSize={quality === "high" ? 2048 : 512}
          shadow-bias={-0.0001}
        />
        
        {/* Fill Light (Preenchimento Frontal-Lateral Direita, Suave) */}
        <directionalLight
          position={[-4, 2, 4]}
          intensity={0.6}
          color="#ffeedd"
        />
        
        {/* Rim Light (Recorte nas costas, efeito dourado sutil) */}
        <spotLight
          position={[0, 4, -5]}
          intensity={2.0}
          color="#ffdf80"
          angle={0.8}
          penumbra={1.0}
          castShadow={false}
        />
        
        {/* Bounce Light (Luz de rebatimento inferior) */}
        <directionalLight
          position={[0, -2, 2]}
          intensity={0.3}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          {quality === "high" && <Environment preset="city" />}
          <AvatarRenderer clubColor={clubColor} pose={pose} quality={quality} />
        </Suspense>
        
        {/* ContactShadows no y=-1.49 para ancorar o modelo perfeitamente */}
        {useContactShadows && (
          <ContactShadows
            position={[0, -1.49, 0]}
            opacity={0.65}
            scale={5}
            blur={2.5}
            far={3}
            color="#000000"
          />
        )}
      </Canvas>
      {/* Vinheta Leve */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </div>
  );
}
