import fs from 'fs';

const path = 'src/components/creation/CreationAppearance.tsx';
let content = fs.readFileSync(path, 'utf8');

const returnIndex = content.indexOf('return (', 100);
const helperIndex = content.indexOf('function Section({');

const beforeReturn = content.substring(0, returnIndex);
const helpers = content.substring(helperIndex);

const newReturn = `  const footer = (
    <div className="flex gap-4">
      <button
        onClick={() => dispatch({ type: "CHANGE_PHASE", payload: "CREATION_POSITION" })}
        className="flex-1 bg-zinc-900 border border-white/10 text-white font-bold text-sm py-4 rounded-xl hover:bg-zinc-800 transition-colors uppercase tracking-widest"
      >
        Voltar
      </button>
      <button
        onClick={handleNext}
        className="flex-[2] bg-yellow-500 text-yellow-950 font-black text-sm py-4 rounded-xl hover:bg-yellow-400 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
      >
        Confirmar
      </button>
    </div>
  );

  return (
    <StudioLayout
      title="Aparência & Estilo"
      subtitle="Personalize cada detalhe visual do seu jogador."
      customAppearance={appearance}
      footer={footer}
    >
      <div className="space-y-10">
        <Section title="Rosto e Expressão">
          <Select label="Tom de Pele" value={appearance.skinColor} options={SKIN_COLORS} onChange={(v) => update("skinColor", v)} />
          <Select label="Olhos" value={appearance.eyes} options={EYES} onChange={(v) => update("eyes", v)} />
          <Select label="Nariz" value={appearance.nose} options={NOSES.map((n) => ({ label: n, value: n }))} onChange={(v) => update("nose", v)} />
          <Select label="Boca" value={appearance.mouth} options={MOUTHS} onChange={(v) => update("mouth", v)} />
        </Section>
        
        <Section title="Cabelo e Barba">
          <Select label="Estilo de Cabelo" value={appearance.hairStyle} options={HAIR_STYLES} onChange={(v) => update("hairStyle", v)} />
          <Select label="Cor do Cabelo" value={appearance.hairColor} options={HAIR_COLORS} onChange={(v) => update("hairColor", v)} />
          <Select label="Barba" value={appearance.facialHair} options={FACIAL_HAIR} onChange={(v) => update("facialHair", v)} />
          {appearance.facialHair !== "none" && (
            <Select label="Cor da Barba" value={appearance.facialHairColor} options={HAIR_COLORS} onChange={(v) => update("facialHairColor", v)} />
          )}
        </Section>
        
        <Section title="Atributos Físicos">
          <div className="grid grid-cols-2 gap-4 col-span-full">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-3">
                Altura (cm): <span className="text-white text-sm">{appearance.height}</span>
              </label>
              <input
                type="range" min="160" max="210" value={appearance.height}
                onChange={(e) => update("height", parseInt(e.target.value))}
                className="w-full accent-yellow-500"
              />
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-3">
                Peso (kg): <span className="text-white text-sm">{appearance.weight}</span>
              </label>
              <input
                type="range" min="55" max="110" value={appearance.weight}
                onChange={(e) => update("weight", parseInt(e.target.value))}
                className="w-full accent-yellow-500"
              />
            </div>
          </div>
          <Select label="Porte Físico" value={appearance.physique} options={PHYSIQUES.map((p) => ({ label: p, value: p }))} onChange={(v) => update("physique", v)} />
        </Section>
        
        <Section title="Estilo em Campo">
          <Select label="Chuteiras" value={appearance.boots} options={BOOTS.map((b) => ({ label: b, value: b }))} onChange={(v) => update("boots", v)} />
          <Select label="Mangas da Camisa" value={appearance.sleeves} options={SLEEVES.map((s) => ({ label: s, value: s }))} onChange={(v) => update("sleeves", v)} />
          <Select label="Tatuagens" value={appearance.tattoos} options={TATTOOS.map((t) => ({ label: t, value: t }))} onChange={(v) => update("tattoos", v)} />
          <Select label="Acessórios Rosto" value={appearance.accessories} options={ACCESSORIES} onChange={(v) => update("accessories", v)} />
          
          <div className="col-span-full flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/10">
            <span className="font-bold text-sm">Usa Luvas (Jogadores de linha)</span>
            <button
              onClick={() => update("gloves", !appearance.gloves)}
              className={\`w-14 h-7 rounded-full transition-colors relative \${appearance.gloves ? "bg-yellow-500" : "bg-zinc-700"}\`}
            >
              <div className={\`w-5 h-5 bg-white rounded-full absolute top-1 transition-all \${appearance.gloves ? "left-8" : "left-1"}\`} />
            </button>
          </div>
          
          <Select label="Comemoração Padrão" value={appearance.celebration} options={CELEBRATIONS.map((c) => ({ label: c, value: c }))} onChange={(v) => update("celebration", v)} className="col-span-full" />
        </Section>
      </div>
    </StudioLayout>
  );
}

`;

const newHelpers = helpers
  .replace('PlayerPortrait', 'StudioLayout') // if any
  .replace(/bg-zinc-950/g, 'bg-black/60')
  .replace(/border-zinc-800\/50/g, 'border-white/10')
  .replace(/border-zinc-800/g, 'border-white/10')
  .replace(/text-xs font-bold text-zinc-500 uppercase tracking-wider/g, 'text-[10px] font-black text-white/50 uppercase tracking-[0.2em]')
  .replace(/rounded-xl/g, 'rounded-xl');

// Add import StudioLayout
let newContent = beforeReturn.replace("import { PlayerPortrait } from \"../ui/PlayerPortrait\";", "import { StudioLayout } from './StudioLayout';");

fs.writeFileSync(path, newContent + newReturn + newHelpers);
