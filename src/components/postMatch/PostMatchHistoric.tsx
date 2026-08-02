import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, ArrowRight, Activity, Zap, ShieldAlert, Newspaper, BarChart3, Clock, LineChart, Target, Award, BookmarkCheck, Save, Sparkles, Check } from 'lucide-react';
import { MatchStats, GameState } from '../../types';
import { GeneratedMatchStory } from './postMatchStoryEngine';
import { GoatBadge, GoatButton } from '../ui/goat';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { useGameEngine } from '../../engine/GameEngine';

interface PostMatchHistoricProps {
  match: MatchStats;
  story: GeneratedMatchStory;
  state: GameState;
  onContinue: () => void;
}

export function PostMatchHistoric({ match, story, state, onContinue }: PostMatchHistoricProps) {
  const { dispatch } = useGameEngine();
  const { career, player } = state;
  const club = career.currentClub;
  const nextMatch = career.nextMatch;

  const [saved, setSaved] = useState(Boolean(match.isSavedInMuseum));
  const [activeTab, setActiveTab] = useState<'historic' | 'events' | 'stats' | 'news'>('historic');

  const handleSaveToMuseum = () => {
    dispatch({ type: 'SAVE_HISTORIC_MATCH', payload: { matchId: match.id } });
    setSaved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-5xl mx-auto bg-black/95 backdrop-blur-3xl border border-amber-500/40 p-6 md:p-10 rounded-[2.5rem] shadow-[0_0_60px_rgba(234,179,8,0.2)] flex flex-col gap-8 relative overflow-hidden"
    >
      {/* Golden Aura Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <GoatBadge variant="gold" size="sm">
            Nível 3 • Partida Histórica & Final
          </GoatBadge>
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> {match.competition}
          </span>
        </div>
        <span className={`text-sm font-black uppercase tracking-widest ${story.resultColor}`}>
          {story.resultLabel}
        </span>
      </div>

      {/* Hero Historic Spotlight Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 p-6 md:p-8 rounded-3xl shadow-2xl">
        {/* Avatar Spotlight (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-amber-400 shadow-[0_0_40px_rgba(234,179,8,0.4)] bg-gradient-to-b from-amber-500/20 to-black relative overflow-hidden flex items-center justify-center">
            <PlayerPortrait player={player} className="w-full h-full scale-[1.35] mt-4 relative z-10 drop-shadow-2xl" />
          </div>
          <h3 className="text-lg font-black text-amber-300 mt-3">{player.name}</h3>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Destaque da Partida</span>
        </div>

        {/* Score & Trophy (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-black/60 border border-amber-500/20 p-4 rounded-2xl">
            {/* Club */}
            <div className="flex items-center gap-3">
              {club?.logo ? (
                <img src={club.logo} alt={club.name} className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400">
                  {club?.name?.charAt(0)}
                </div>
              )}
              <div>
                <span className="text-sm font-black text-white block">{club?.name}</span>
                <span className="text-[10px] font-bold text-amber-400 uppercase">Campeão</span>
              </div>
            </div>

            {/* Score */}
            <div className="px-5 py-2 bg-amber-500/10 border border-amber-500/40 rounded-xl text-center">
              <span className="text-2xl md:text-3xl font-black text-white">{story.homeScore} x {story.awayScore}</span>
            </div>

            {/* Opponent */}
            <div className="flex items-center gap-3 text-right">
              <div>
                <span className="text-sm font-black text-white block">{match.opponent}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Adversário</span>
              </div>
              {match.opponentLogo ? (
                <img src={match.opponentLogo} alt={match.opponent} className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-zinc-400">
                  {match.opponent.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Trophy & Conquista Badge */}
          {story.trophyWon && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/50 p-3.5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300">
                <Trophy className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Conquista Histórica</span>
                <span className="text-sm font-black text-white">{story.trophyWon}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Headline & Narratives */}
      <div className="flex flex-col gap-4 relative z-10">
        {/* Headline (Up to 12 words) */}
        <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/10 border border-amber-500/30 p-5 rounded-2xl text-center shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">Manchete Histórica</span>
          <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 leading-snug">
            "{story.headline}"
          </h2>
        </div>

        {/* Narrative & Decisive Moment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Decisive Moment (Up to 45 words) */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Target className="w-4 h-4" /> Momento Decisivo
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {story.decisiveMoment}
            </p>
          </div>

          {/* Historic Narrative (Up to 80 words) */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Narrativa da Lenda
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {story.historicNarrative}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto hide-scrollbar relative z-10">
        <button
          onClick={() => setActiveTab('historic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'historic' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Estatísticas Globais
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'events' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Linha do Tempo ({story.events.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'stats' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" /> Tabela & Recordes
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'news' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" /> Imprensa
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'historic' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Nota Final</span>
            <span className="text-3xl font-black text-amber-400">{match.rating.toFixed(1)}</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Minutos</span>
            <span className="text-2xl font-black text-white">{match.minutesPlayed}'</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Gols / Assist.</span>
            <span className="text-2xl font-black text-amber-400">{match.goals}G / {match.assists}A</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">XP Ganho</span>
            <span className="text-2xl font-black text-emerald-400">+{story.evolution.xpGained} XP</span>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 relative z-10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Linha do Tempo dos Eventos Históricos
          </h4>
          <div className="flex flex-col gap-2">
            {story.events.map((ev, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-black/60 border border-zinc-800 rounded-xl">
                <span className="text-xs font-black text-amber-400 w-10 text-right">{ev.minute}'</span>
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="flex-1">
                  <span className="text-xs font-bold text-white block">{ev.player}</span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {ev.type === 'GOAL' && '⚽ GOL HISTÓRICO'}
                    {ev.type === 'ASSIST' && '👟 ASSISTÊNCIA DECISIVA'}
                    {ev.type === 'YELLOW_CARD' && '🟨 Cartão Amarelo'}
                    {ev.type === 'RED_CARD' && '🟥 Cartão Vermelho'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <LineChart className="w-4 h-4" /> Impacto na Tabela
            </h4>
            <div className="flex items-center justify-between bg-black/60 p-4 rounded-xl border border-zinc-800">
              <div>
                <span className="text-2xl font-black text-white">{story.standingsImpact.position}º Lugar</span>
                <span className="text-xs text-emerald-400 font-bold block">{story.standingsImpact.positionChange}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">+{story.standingsImpact.pointsGained} Pts</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Recordes
            </h4>
            <div className="flex flex-col gap-2">
              {story.records.map((rec, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-zinc-200 bg-black/40 p-2.5 rounded-lg border border-zinc-800">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 relative z-10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
            <Newspaper className="w-4 h-4" /> Cobertura da Mídia Mundial
          </h4>
          <div className="bg-black/60 p-5 rounded-xl border border-zinc-800/80 flex flex-col gap-2">
            <h3 className="text-base font-black text-amber-300">"{story.headline}"</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">{story.decisiveMoment}</p>
          </div>
        </div>
      )}

      {/* Action Footer: Save to Museum & Continue */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-500/20 relative z-10">
        {/* Botão Salvar no Museu */}
        <GoatButton
          data-testid="save-to-museum-button"
          variant={saved ? "secondary" : "primary"}
          size="lg"
          glow={!saved}
          disabled={saved}
          leftIcon={saved ? <Check className="w-5 h-5 text-emerald-400" /> : <Save className="w-5 h-5" />}
          onClick={handleSaveToMuseum}
          className="w-full sm:w-auto"
        >
          {saved ? "Salvo no Museu do Atleta!" : "Salvar no Museu"}
        </GoatButton>

        <GoatButton
          data-testid="continue-career-button"
          variant="primary"
          size="lg"
          glow
          rightIcon={<ArrowRight className="w-5 h-5" />}
          onClick={onContinue}
          className="w-full sm:w-auto px-10"
        >
          Continuar Carreira
        </GoatButton>
      </div>
    </motion.div>
  );
}
