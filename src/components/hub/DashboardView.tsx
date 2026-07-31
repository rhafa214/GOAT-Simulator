import React from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { 
  Trophy, 
  Calendar, 
  Star, 
  TrendingUp, 
  CheckCircle,
  Play,
  ArrowRight,
  Shield,
  Goal
} from 'lucide-react';
import { PlayerAvatar } from '../ui/PlayerAvatar';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardView() {
  const { state, dispatch } = useGameEngine();
  const { player, career, finances } = state;
  
  const overall = Math.floor(Object.values(player.technical || {}).reduce((a, b) => a + (b as number), 0) / Math.max(1, Object.keys(player.technical || {}).length)) || 70;
  
  // Dummy data for the graph
  const evolutionData = [
    { name: 'Jan', ovr: overall - 5 },
    { name: 'Fev', ovr: overall - 4 },
    { name: 'Mar', ovr: overall - 4 },
    { name: 'Abr', ovr: overall - 2 },
    { name: 'Mai', ovr: overall },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. PLAYER PROFILE CARD */}
      <div className="w-full bg-[#1A1C23] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-black/50 border-2 border-white/10 overflow-hidden flex-shrink-0">
              <PlayerAvatar player={player} className="w-full h-full scale-150 translate-y-4" />
            </div>
            
            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">{player.name}</h2>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded border border-green-500/20">
                  Titular
                </span>
              </div>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                {player.position} <span className="w-1 h-1 rounded-full bg-zinc-600"></span> {player.age} anos <span className="w-1 h-1 rounded-full bg-zinc-600"></span> Brasil
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center mb-1 bg-black/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <span className="text-2xl font-black text-white">{overall}</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold tracking-widest">GER</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center gap-4 text-sm">
                <span className="text-zinc-400">NÍVEL DE FAMA</span>
                <span className="text-yellow-400 flex items-center gap-1 font-medium"><Star size={14} className="fill-yellow-400" /> Ídolo Local</span>
              </div>
              <div className="flex justify-between items-center gap-4 text-sm">
                <span className="text-zinc-400">MORAL</span>
                <span className="text-green-400 flex items-center gap-1 font-medium">Muito Feliz</span>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Bottom Stats Row */}
        <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap gap-8 justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-500 font-medium">Clube</div>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              {career.currentClub?.logo && <img src={career.currentClub.logo} alt="Club" className="w-5 h-5 object-contain" />}
              {career.currentClub?.name || 'Agente Livre'}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-zinc-500 font-medium">Número</div>
            <div className="text-sm font-bold text-white">{career.shirtNumber || 10}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-zinc-500 font-medium">Contrato</div>
            <div className="text-sm font-bold text-white">{career.year + 4}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-zinc-500 font-medium">Salário</div>
            <div className="text-sm font-bold text-white">R$ {(finances.weeklyWage / 1000).toFixed(0)}k</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-zinc-500 font-medium">Valor de Mercado</div>
            <div className="text-sm font-bold text-white">R$ 78M</div>
          </div>
        </div>
      </div>
      
      {/* 2. MIDDLE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Match */}
        <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="text-xs font-bold text-zinc-400 tracking-wider mb-6">PRÓXIMO JOGO</div>
          
          {career.nextMatch ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-sm text-zinc-300 mb-6">{career.nextMatch.competition}</div>
              
              <div className="flex items-center justify-center w-full gap-4 mb-8">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center mb-3 border border-white/5 p-2">
                    {career.nextMatch.isHome ? (
                      career.currentClub?.logo ? <img src={career.currentClub.logo} alt="Home" className="w-full h-full object-contain" /> : <div className="text-xs font-bold truncate px-1">{career.currentClub?.name.substring(0,3)}</div>
                    ) : (
                      career.nextMatch.opponentLogo ? <img src={career.nextMatch.opponentLogo} alt="Away" className="w-full h-full object-contain" /> : <div className="text-xs font-bold truncate px-1">{career.nextMatch.opponent.substring(0,3)}</div>
                    )}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-white tracking-wider text-center line-clamp-1">{career.nextMatch.isHome ? career.currentClub?.name : career.nextMatch.opponent}</div>
                </div>
                
                <div className="text-xl font-black text-zinc-600 px-2">X</div>
                
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center mb-3 border border-white/5 p-2">
                    {!career.nextMatch.isHome ? (
                      career.currentClub?.logo ? <img src={career.currentClub.logo} alt="Home" className="w-full h-full object-contain" /> : <div className="text-xs font-bold truncate px-1">{career.currentClub?.name.substring(0,3)}</div>
                    ) : (
                      career.nextMatch.opponentLogo ? <img src={career.nextMatch.opponentLogo} alt="Away" className="w-full h-full object-contain" /> : <div className="text-xs font-bold truncate px-1">{career.nextMatch.opponent.substring(0,3)}</div>
                    )}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-white tracking-wider text-center line-clamp-1">{!career.nextMatch.isHome ? career.currentClub?.name : career.nextMatch.opponent}</div>
                </div>
              </div>
              
              <div className="text-xs text-zinc-500 text-center mb-6">
                Domingo, 20 Mai {career.year}<br/>16:00
              </div>
              
              <button 
                onClick={() => dispatch({ type: 'ADVANCE_WEEK' })}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors text-sm"
              >
                IR PARA O JOGO
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
              Sem jogos agendados
            </div>
          )}
        </div>
        
        {/* Recent Performance */}
        <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="text-xs font-bold text-zinc-400 tracking-wider mb-4">DESEMPENHO RECENTE</div>
          
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar">
            {career.matches.length > 0 ? career.matches.slice(0, 4).map((match, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 flex-1">
                   <div className="w-6 h-6 flex items-center justify-center bg-white/5 rounded">
                     {career.currentClub?.logo ? <img src={career.currentClub.logo} className="w-4 h-4 object-contain" /> : <Trophy size={10} />}
                   </div>
                   <div className="text-xs text-white truncate max-w-[80px]">{career.currentClub?.name}</div>
                </div>
                <div className="text-xs font-bold text-white mx-2">{Math.floor(Math.random()*4)} - {Math.floor(Math.random()*4)}</div>
                <div className="flex items-center justify-end gap-2 flex-1">
                   <div className="text-xs text-white truncate max-w-[80px]">{match.opponent}</div>
                   <div className="w-6 h-6 flex items-center justify-center bg-white/5 rounded">
                     {match.opponentLogo ? <img src={match.opponentLogo} className="w-4 h-4 object-contain" /> : <Shield size={10} />}
                   </div>
                </div>
                <div className={`ml-4 w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${match.rating >= 8 ? 'bg-green-500/20 text-green-400' : match.rating >= 6 ? 'bg-zinc-500/20 text-zinc-300' : 'bg-red-500/20 text-red-400'}`}>
                  {match.rating.toFixed(1)}
                </div>
              </div>
            )) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                Nenhum jogo disputado
              </div>
            )}
          </div>
          
          <button className="text-xs text-indigo-400 hover:text-indigo-300 text-center mt-4 w-full">Ver todas</button>
        </div>
        
        {/* Evolution */}
        <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="text-xs font-bold text-zinc-400 tracking-wider mb-4">EVOLUÇÃO DO JOGADOR</div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center bg-black/30">
              <span className="text-lg font-black text-white">{overall}</span>
            </div>
            <div>
              <div className="text-green-400 font-bold flex items-center gap-1"><TrendingUp size={14} /> +5</div>
              <div className="text-[10px] text-zinc-500">Desde o início da temporada</div>
            </div>
          </div>
          
          <div className="flex-1 w-full h-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0C10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Line type="monotone" dataKey="ovr" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#1A1C23', stroke: '#22c55e', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
      
      {/* 3. BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Season Stats */}
        <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-6">
          <div className="text-xs font-bold text-zinc-400 tracking-wider mb-6">ESTATÍSTICAS DA TEMPORADA</div>
          <div className="flex justify-between items-center text-center">
            <div className="flex flex-col gap-2">
               <div className="w-8 h-8 mx-auto bg-white/5 rounded flex items-center justify-center text-zinc-400"><Play size={14} /></div>
               <div className="text-xs text-zinc-500">Jogos</div>
               <div className="text-xl font-bold text-white">{career.currentSeasonStats.matchesPlayed}</div>
            </div>
            <div className="flex flex-col gap-2">
               <div className="w-8 h-8 mx-auto bg-white/5 rounded flex items-center justify-center text-zinc-400"><Goal size={14} /></div>
               <div className="text-xs text-zinc-500">Gols</div>
               <div className="text-xl font-bold text-white">{career.currentSeasonStats.goals}</div>
            </div>
            <div className="flex flex-col gap-2">
               <div className="w-8 h-8 mx-auto bg-white/5 rounded flex items-center justify-center text-zinc-400"><ArrowRight size={14} /></div>
               <div className="text-xs text-zinc-500">Assistências</div>
               <div className="text-xl font-bold text-white">{career.currentSeasonStats.assists}</div>
            </div>
            <div className="flex flex-col gap-2">
               <div className="w-8 h-8 mx-auto bg-white/5 rounded flex items-center justify-center text-zinc-400"><Star size={14} /></div>
               <div className="text-xs text-zinc-500">Nota Média</div>
               <div className="text-xl font-bold text-white">{career.currentSeasonStats.avgRating.toFixed(1)}</div>
            </div>
          </div>
        </div>
        
        {/* Objectives */}
        <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-6">
          <div className="text-xs font-bold text-zinc-400 tracking-wider mb-4">OBJETIVOS</div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block mr-2" /> Vencer o Brasileirão</span>
              <CheckCircle size={16} className="text-green-500" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block mr-2" /> Marcar 20 gols</span>
              <CheckCircle size={16} className="text-green-500" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-300"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block mr-2" /> Vencer a Libertadores</span>
              <Star size={16} className="text-green-500" />
            </div>
          </div>
        </div>
        
        {/* News */}
        <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-6">
          <div className="text-xs font-bold text-zinc-400 tracking-wider mb-4">NOTÍCIAS</div>
          <div className="flex flex-col gap-3">
             <div className="text-sm text-zinc-300 truncate">João Silva é eleito o jogador do mês de abril</div>
             <div className="text-sm text-zinc-300 truncate">Interesse do Manchester United em João Silva</div>
             <div className="text-sm text-zinc-300 truncate">Flamengo avança na Libertadores</div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
