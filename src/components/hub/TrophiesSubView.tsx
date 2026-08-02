import React from 'react';
import { useCareer } from '../../engine/selectors';
import { GoatCard, GoatBadge } from '../ui/goat';
import { Trophy, Award, Medal, Crown, Star, Sparkles } from 'lucide-react';

export default function TrophiesSubView() {
  const career = useCareer();
  const awards = (career.awards || {}) as Record<string, number>;

  const trophiesList = [
    { title: 'Bola de Ouro (Ballon d\'Or)', count: awards.ballonDor || 0, icon: Crown, desc: 'Melhor jogador do mundo na temporada' },
    { title: 'Chuteira de Ouro', count: awards.goldenBoot || 0, icon: Award, desc: 'Artilheiro máximo das ligas mundiais' },
    { title: 'UEFA Champions League / Libertadores', count: awards.championsLeague || 0, icon: Trophy, desc: 'Campeão continental' },
    { title: 'Títulos Nacionais de Liga', count: awards.leagueTitles || 0, icon: Medal, desc: 'Campeão do Brasileirão ou ligas europeias' },
    { title: 'Seleção do Ano (TOTY)', count: awards.toty || 0, icon: Star, desc: 'Integrado ao time ideal da temporada' },
    { title: 'Melhor da Partida (MOTM)', count: awards.motm || 0, icon: Sparkles, desc: 'Prêmios de homem do jogo recebidos' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      
      {/* HEADER HERO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Trophy className="h-7 w-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Sala de Troféus</span>
            <h2 className="text-2xl font-black uppercase text-zinc-100">Galeria de Conquistas</h2>
            <p className="text-xs text-zinc-400">Exiba os títulos coletivos e reconhecimentos individuais conquistados ao longo da carreira.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GoatBadge variant="gold" size="md">
            Status: Em Busca da Lenda
          </GoatBadge>
        </div>
      </div>

      {/* TROPHIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trophiesList.map((t, idx) => {
          const IconComponent = t.icon;
          const isUnlocked = t.count > 0;

          return (
            <GoatCard key={idx} variant={isUnlocked ? 'gold' : 'mineral'} glow={isUnlocked} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl border ${
                  isUnlocked ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className={`text-2xl font-black ${isUnlocked ? 'text-amber-400' : 'text-zinc-600'}`}>
                  x{t.count}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-zinc-100 mb-1">{t.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">{t.desc}</p>

              <GoatBadge variant={isUnlocked ? 'victory' : 'neutral'} size="sm">
                {isUnlocked ? 'Conquistado' : 'Bloqueado'}
              </GoatBadge>
            </GoatCard>
          );
        })}
      </div>

    </div>
  );
}
