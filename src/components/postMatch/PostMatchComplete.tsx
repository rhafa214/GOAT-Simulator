import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, ArrowRight, Activity, Zap, Play, ShieldAlert, Newspaper, BarChart3, Clock, LineChart, Target, Award } from 'lucide-react';
import { MatchStats, GameState } from '../../types';
import { GeneratedMatchStory } from './postMatchStoryEngine';
import { GoatBadge, GoatButton } from '../ui/goat';

interface PostMatchCompleteProps {
  match: MatchStats;
  story: GeneratedMatchStory;
  state: GameState;
  onContinue: () => void;
}

export function PostMatchComplete({ match, story, state, onContinue }: PostMatchCompleteProps) {
  const { career } = state;
  const club = career.currentClub;
  const nextMatch = career.nextMatch;

  const [activeTab, setActiveTab] = useState<'summary' | 'events' | 'stats' | 'news'>('summary');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="w-full max-w-4xl mx-auto bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Level Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <GoatBadge variant="gold" size="sm">
            Nível 2 • Relatório Completo
          </GoatBadge>
          <span className="text-xs font-semibold text-zinc-400">
            {match.competition} • Clássico & Jogo Decisivo
          </span>
        </div>
        <span className={`text-xs font-black uppercase tracking-widest ${story.resultColor}`}>
          {story.resultLabel}
        </span>
      </div>

      {/* Main Scorecard Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Home Team */}
        <div className="flex items-center gap-4 flex-1">
          {club?.logo ? (
            <img src={club.logo} alt={club.name} className="w-16 h-16 object-contain drop-shadow" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400 text-2xl">
              {club?.name?.charAt(0) || 'C'}
            </div>
          )}
          <div>
            <h3 className="text-xl font-black text-white">{club?.name || 'Seu Clube'}</h3>
            <span className="text-xs font-bold text-amber-400/80 uppercase tracking-wider">Mandante</span>
          </div>
        </div>

        {/* Big Score */}
        <div className="flex items-center gap-4 px-6 py-3 bg-black/80 border border-amber-500/30 rounded-2xl shadow-inner">
          <span className="text-4xl md:text-5xl font-black text-white">{story.homeScore}</span>
          <span className="text-amber-500/60 font-bold text-xl">x</span>
          <span className="text-4xl md:text-5xl font-black text-white">{story.awayScore}</span>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-4 flex-1 justify-end text-right">
          <div>
            <h3 className="text-xl font-black text-white">{match.opponent}</h3>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Visitante</span>
          </div>
          {match.opponentLogo ? (
            <img src={match.opponentLogo} alt={match.opponent} className="w-16 h-16 object-contain drop-shadow" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-zinc-300 text-2xl">
              {match.opponent.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'summary' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'events' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Eventos & Tempo ({story.events.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'stats' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" /> Impacto na Tabela & Stats
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'news' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" /> Notícia & Mídia
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className="flex flex-col gap-6">
          {/* Key Player Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider mb-1 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" /> Nota
              </span>
              <span className="text-3xl font-black text-amber-400">{match.rating.toFixed(1)}</span>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider mb-1">Minutos</span>
              <span className="text-2xl font-black text-white">{match.minutesPlayed}'</span>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider mb-1">Gols / Assist.</span>
              <span className="text-2xl font-black text-amber-400">{match.goals}G / {match.assists}A</span>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider mb-1">Cartões</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-yellow-400">🟨 {match.yellowCards || 0}</span>
                <span className="text-xs font-bold text-rose-400">🟥 {match.redCards || 0}</span>
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider mb-1">Passes / Chutes</span>
              <span className="text-sm font-black text-zinc-200">{match.passes} ({match.passAccuracy}%) | {match.shots} C</span>
            </div>
          </div>

          {/* Decisive Moment Summary */}
          <div className="bg-zinc-900/60 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Target className="w-4 h-4" /> Momento Decisivo
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              {story.decisiveMoment}
            </p>
          </div>

          {/* Evolution & Morale/Fitness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider block">Evolução de Atributos</span>
                <span className="text-lg font-black text-emerald-400">+{story.evolution.xpGained} XP de Desenvolvimento</span>
              </div>
              <Zap className="w-8 h-8 text-emerald-400 opacity-80" />
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider block">Moral & Fitness</span>
                <span className="text-xs font-bold text-zinc-200">
                  Moral: {story.evolution.currentMorale}% ({story.evolution.moraleChange >= 0 ? '+' : ''}{story.evolution.moraleChange}%) • Fitness: {story.evolution.currentFitness}% (-{story.evolution.fitnessDrain}%)
                </span>
              </div>
              <Activity className="w-8 h-8 text-amber-400 opacity-80" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Linha do Tempo dos Eventos da Partida
          </h4>
          {story.events.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">Nenhum evento registrado nesta partida.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {story.events.map((ev, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-zinc-900/90 border border-zinc-800/80 rounded-xl">
                  <span className="text-xs font-black text-amber-400 w-10 text-right">{ev.minute}'</span>
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white block">{ev.player}</span>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {ev.type === 'GOAL' && '⚽ GOL SENSACIONAL'}
                      {ev.type === 'ASSIST' && '👟 ASSISTÊNCIA DECISIVA'}
                      {ev.type === 'YELLOW_CARD' && '🟨 Cartão Amarelo'}
                      {ev.type === 'RED_CARD' && '🟥 Cartão Vermelho'}
                      {ev.type === 'INJURY' && '🚑 Lesão'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <LineChart className="w-4 h-4" /> Impacto na Tabela de Classificação
            </h4>
            <div className="flex items-center justify-between bg-black/60 p-4 rounded-xl border border-zinc-800">
              <div>
                <span className="text-2xl font-black text-white">{story.standingsImpact.position}º Lugar</span>
                <span className="text-xs text-emerald-400 font-bold block">{story.standingsImpact.positionChange}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">+{story.standingsImpact.pointsGained} Pts</span>
                <span className="text-xs text-zinc-400 block">Total: {story.standingsImpact.points} Pts</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Marcas & Recordes Conquistados
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
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Newspaper className="w-4 h-4" /> Manchete da Mídia Esportiva
          </h4>
          <div className="bg-black/60 p-5 rounded-xl border border-zinc-800/80 flex flex-col gap-2">
            <h3 className="text-base font-black text-amber-300 leading-snug">
              "{story.headline}"
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {story.decisiveMoment}
            </p>
          </div>
        </div>
      )}

      {/* Next Match Commitment */}
      {nextMatch && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Próximo Compromisso</span>
              <span className="text-xs font-bold text-zinc-200">
                vs {nextMatch.opponent} ({nextMatch.isHome ? 'Casa' : 'Fora'}) • {nextMatch.competition}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-2">
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
