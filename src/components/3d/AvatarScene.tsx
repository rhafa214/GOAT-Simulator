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
  const useContactShadows = quality === "high";

  return (
    // Etapa 1 - Estúdio Esportivo Premium (Gradiente, fundo não totalmente preto)
    // Usamos elementos de profundidade e halo via HTML/CSS absoluto
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
        {/* Etapa 2 - Câmera 
            O modelo está no y = -1.5 e tem scale 2.0. 
            Ajustamos a câmera para y=0.5, z=5.5 e o target do OrbitControls para y=0.5 
            para focar confortavelmente no centro do corpo.
        */}
        <PerspectiveCamera makeDefault position={[0, 0, 4.1]} fov={35} />
        
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={3.5}
          maxDistance={7.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2 + 0.05}
          target={[0, -0.6, 0]}
        />
        
        {/* Etapa 3 - Iluminação Reforçada */}
        {/* Ambient Light para evitar áreas 100% escuras */}
        <ambientLight intensity={0.4} />
        
        {/* Key Light - Luz Principal Frontal-Lateral */}
        <directionalLight
          position={[3, 4, 5]}
          intensity={1.8}
          color="#ffffff"
          castShadow
          shadow-mapSize={quality === "high" ? 2048 : 512}
          shadow-bias={-0.0001}
        />
        
        {/* Fill Light - Luz de Preenchimento do lado oposto, ligeiramente quente */}
        <directionalLight
          position={[-4, 2, 4]}
          intensity={0.8}
          color="#ffeedd"
        />
        
        {/* Rim Light - Luz Dourada Forte nas Costas para separar do fundo */}
        <spotLight
          position={[0, 4, -5]}
          intensity={3.0}
          color="#ffdf80"
          angle={0.8}
          penumbra={1.0}
          castShadow={false}
        />
        
        {/* Luz adicional inferior para pés/pernas (Bounce light simulado) */}
        <directionalLight
          position={[0, -2, 2]}
          intensity={0.5}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          {quality === "high" && <Environment preset="city" />}
          <AvatarRenderer clubColor={clubColor} pose={pose} quality={quality} />
        </Suspense>
        
        {/* ContactShadows acompanhando a altura y=-1.5 do Avatar */}
        {useContactShadows && (
          <ContactShadows
            position={[0, -1.48, 0]}
            opacity={0.65}
            scale={8}
            blur={2.5}
            far={4}
            color="#000000"
          />
        )}
      </Canvas>

      {/* Vinheta Leve */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </div>
  );
}
