import React, { useState } from "react";
import { useGameEngine } from "../../engine/GameEngine";
import { motion } from "motion/react";
import { PlayerPortrait } from "../ui/PlayerPortrait";
import { PhysicalAppearance } from "../../types";

const SKIN_COLORS = [
  { label: "Branco", value: "ffdbb4" },
  { label: "Moreno Claro", value: "edb98a" },
  { label: "Moreno", value: "fd9841" },
  { label: "Pardo", value: "d08b5b" },
  { label: "Negro", value: "ae5d29" },
  { label: "Negro Escuro", value: "614335" },
];

const HAIR_STYLES = [
  { label: "Curto", value: "shortHairShortFlat" },
  { label: "Ondulado", value: "shortHairShortWaved" },
  { label: "Espetado", value: "shortHairFrizzle" },
  { label: "Dreads", value: "shortHairDreads01" },
  { label: "Dreads Longos", value: "shortHairDreads02" },
  { label: "Careca", value: "noHair" },
  { label: "Longo", value: "longHairStraight" },
  { label: "Coque", value: "longHairBun" },
];

const HAIR_COLORS = [
  { label: "Preto", value: "2c1b18" },
  { label: "Castanho Escuro", value: "4a3123" },
  { label: "Castanho Claro", value: "724133" },
  { label: "Loiro", value: "b58143" },
  { label: "Platinado", value: "e8e1e1" },
  { label: "Ruivo", value: "ca4420" },
  { label: "Grisalho", value: "e6e6e6" },
  { label: "Colorido", value: "c93305" }, // Just a placeholder
];

const FACIAL_HAIR = [
  { label: "Sem Barba", value: "none" },
  { label: "Barba Rala", value: "beardLight" },
  { label: "Barba Média", value: "beardMedium" },
  { label: "Barba Cheia", value: "beardMajestic" },
  { label: "Cavanhaque", value: "moustaceMagnum" },
  { label: "Bigode", value: "mustacheFancy" },
];

const EYES = [
  { label: "Normal", value: "default" },
  { label: "Feliz", value: "happy" },
  { label: "Sério", value: "squint" },
  { label: "Determinado", value: "surprised" },
];

const MOUTHS = [
  { label: "Sério", value: "serious" },
  { label: "Sorriso", value: "smile" },
  { label: "Feliz", value: "twinkle" },
];

const NOSES = ["Pequeno", "Largo", "Fino", "Arrebitado", "Adunco"];
const ACCESSORIES = [
  { label: "Nenhum", value: "none" },
  { label: "Óculos", value: "prescription01" },
  { label: "Óculos Redondo", value: "round" },
  { label: "Óculos Escuros", value: "sunglasses" },
];

const PHYSIQUES = ["Magra", "Atlética", "Musculosa", "Pesada"] as const;
const BOOTS = [
  "Pretas Clássicas",
  "Neon Modernas",
  "Brancas",
  "Douradas",
  "Personalizadas",
];
const SLEEVES = ["Curtas", "Longas", "Térmica"] as const;
const CELEBRATIONS = [
  "Salto e Soco no Ar",
  "Dança",
  "Silêncio",
  "Mão na Orelha",
  "Tirar Camisa",
];
const TATTOOS = ["Nenhuma", "Braço Fechado", "Pescoço", "Perna", "Múltiplas"];

export default function CreationAppearance() {
  const { state, dispatch } = useGameEngine();
  const [appearance, setAppearance] = useState<PhysicalAppearance>(
    state.player.appearance,
  );

  const update = (key: keyof PhysicalAppearance, value: any) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    dispatch({
      type: "INITIALIZE_PLAYER",
      payload: { appearance, avatarUrl: "" },
    }); // avatarUrl will be handled dynamically now
    dispatch({ type: "CHANGE_PHASE", payload: "CREATION_DRAFT_LENGTH" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl w-full flex gap-8 h-[85vh]"
    >
      {/* Left Column: Avatar Preview */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 z-10 pointer-events-none" />
        
        {/* Full body 3D Avatar */}
        <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
            <PlayerPortrait player={{ ...state.player, appearance }} className="w-full h-full" />
        </div>
        
        {/* Overlaid Info */}
        <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex justify-between items-end">
           <div>
             <h2 className="text-4xl font-black mb-1 text-white drop-shadow-md">{state.player.name || 'Jogador'}</h2>
             <div className="text-sm font-bold text-yellow-500 uppercase tracking-widest drop-shadow-md">{state.player.position || 'ST'} • {state.player.nationality || 'BR'}</div>
           </div>
           
           <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-sm w-48 shadow-xl">
             <div className="flex justify-between mb-2"><span className="text-zinc-400">Altura:</span> <span className="font-bold text-white">{appearance.height} cm</span></div>
             <div className="flex justify-between mb-2"><span className="text-zinc-400">Peso:</span> <span className="font-bold text-white">{appearance.weight} kg</span></div>
             <div className="flex justify-between mb-2"><span className="text-zinc-400">Porte:</span> <span className="font-bold text-white">{appearance.physique}</span></div>
           </div>
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="w-1/2 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800">
          <h2 className="text-3xl font-black mb-2">Aparência & Estilo</h2>
          <p className="text-zinc-400">
            Personalize cada detalhe do seu jogador.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          {/* Rosto */}
          <Section title="Rosto e Expressão">
            <Select
              label="Tom de Pele"
              value={appearance.skinColor}
              options={SKIN_COLORS}
              onChange={(v) => update("skinColor", v)}
            />
            <Select
              label="Olhos"
              value={appearance.eyes}
              options={EYES}
              onChange={(v) => update("eyes", v)}
            />
            <Select
              label="Nariz"
              value={appearance.nose}
              options={NOSES.map((n) => ({ label: n, value: n }))}
              onChange={(v) => update("nose", v)}
            />
            <Select
              label="Boca"
              value={appearance.mouth}
              options={MOUTHS}
              onChange={(v) => update("mouth", v)}
            />
          </Section>

          {/* Cabelo e Barba */}
          <Section title="Cabelo e Barba">
            <Select
              label="Estilo de Cabelo"
              value={appearance.hairStyle}
              options={HAIR_STYLES}
              onChange={(v) => update("hairStyle", v)}
            />
            <Select
              label="Cor do Cabelo"
              value={appearance.hairColor}
              options={HAIR_COLORS}
              onChange={(v) => update("hairColor", v)}
            />
            <Select
              label="Barba"
              value={appearance.facialHair}
              options={FACIAL_HAIR}
              onChange={(v) => update("facialHair", v)}
            />
            {appearance.facialHair !== "none" && (
              <Select
                label="Cor da Barba"
                value={appearance.facialHairColor}
                options={HAIR_COLORS}
                onChange={(v) => update("facialHairColor", v)}
              />
            )}
          </Section>

          {/* Físico */}
          <Section title="Atributos Físicos">
            <div className="grid grid-cols-2 gap-4 col-span-full">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Altura (cm): {appearance.height}
                </label>
                <input
                  type="range"
                  min="160"
                  max="210"
                  value={appearance.height}
                  onChange={(e) => update("height", parseInt(e.target.value))}
                  className="w-full accent-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Peso (kg): {appearance.weight}
                </label>
                <input
                  type="range"
                  min="55"
                  max="110"
                  value={appearance.weight}
                  onChange={(e) => update("weight", parseInt(e.target.value))}
                  className="w-full accent-yellow-500"
                />
              </div>
            </div>
            <Select
              label="Porte Físico"
              value={appearance.physique}
              options={PHYSIQUES.map((p) => ({ label: p, value: p }))}
              onChange={(v) => update("physique", v)}
            />
          </Section>

          {/* Estilo de Jogo */}
          <Section title="Estilo em Campo">
            <Select
              label="Chuteiras"
              value={appearance.boots}
              options={BOOTS.map((b) => ({ label: b, value: b }))}
              onChange={(v) => update("boots", v)}
            />
            <Select
              label="Mangas da Camisa"
              value={appearance.sleeves}
              options={SLEEVES.map((s) => ({ label: s, value: s }))}
              onChange={(v) => update("sleeves", v)}
            />
            <Select
              label="Tatuagens"
              value={appearance.tattoos}
              options={TATTOOS.map((t) => ({ label: t, value: t }))}
              onChange={(v) => update("tattoos", v)}
            />
            <Select
              label="Acessórios Rosto"
              value={appearance.accessories}
              options={ACCESSORIES}
              onChange={(v) => update("accessories", v)}
            />

            <div className="col-span-full flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
              <span className="font-bold">Usa Luvas (Jogadores de linha)</span>
              <button
                onClick={() => update("gloves", !appearance.gloves)}
                className={`w-12 h-6 rounded-full transition-colors relative ${appearance.gloves ? "bg-yellow-500" : "bg-zinc-700"}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${appearance.gloves ? "left-7" : "left-1"}`}
                />
              </button>
            </div>

            <Select
              label="Comemoração Padrão"
              value={appearance.celebration}
              options={CELEBRATIONS.map((c) => ({ label: c, value: c }))}
              onChange={(v) => update("celebration", v)}
              className="col-span-full"
            />
          </Section>
        </div>

        <div className="p-8 border-t border-zinc-800 flex justify-between gap-4">
          <button
            onClick={() =>
              dispatch({ type: "CHANGE_PHASE", payload: "CREATION_POSITION" })
            }
            className="flex-1 bg-zinc-800 text-zinc-300 font-bold text-lg py-4 rounded-xl hover:bg-zinc-700 transition-colors uppercase tracking-wider"
          >
            Voltar
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-yellow-500 text-yellow-950 font-black text-lg py-4 rounded-xl hover:bg-yellow-400 transition-colors uppercase tracking-wider"
          >
            Confirmar Aparência
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800/50 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none focus:border-yellow-500 transition-colors cursor-pointer appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
