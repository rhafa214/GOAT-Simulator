import React, { useEffect, useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { useAI } from '../../hooks/useAI';
import { Newspaper, Loader2, Quote } from 'lucide-react';
import { motion } from 'motion/react';

export default function NewsFeed() {
  const { state, dispatch } = useGameEngine();
  const { generate, loading } = useAI();
  const [generatingForWeek, setGeneratingForWeek] = useState<number | null>(null);

  const currentWeek = state.career.week;
  const latestNews = state.narrative.news;
  
  useEffect(() => {
    // Generate news if we don't have any for this week (30% chance each week to get random news)
    const hasNewsThisWeek = latestNews.some(n => n.date === currentWeek);
    
    if (!hasNewsThisWeek && generatingForWeek !== currentWeek && !loading) {
      if (Math.random() > 0.6 || currentWeek === 1) { // 40% chance or first week
        setGeneratingForWeek(currentWeek);
        
        const prompt = `Gere uma manchete e um parágrafo curto de notícia sobre o jogador ${state.player.name} (${state.player.age} anos, joga no ${state.career.currentClub?.name || 'sem clube'}). O time está na semana ${currentWeek}. A notícia pode ser um rumor, uma declaração de um comentarista, fofoca ou sobre um jogo recente.`;
        const systemInstruction = "Você é um jornalista de um portal de fofocas esportivas. Crie uma manchete chocante e uma notícia bem curta. Seja dramático. Responda APENAS com um objeto JSON: {\"title\": \"manchete curta\", \"content\": \"notícia de 1 a 2 linhas máximo\", \"type\": \"gossip\"}";
        
        generate(prompt, systemInstruction, true).then(res => {
          try {
             // Remove markdown json wrappers if present
             const cleaned = res.replace(/```json/g, '').replace(/```/g, '').trim();
             const data = JSON.parse(cleaned);
             dispatch({ 
               type: 'ADD_NEWS', 
               payload: { 
                 title: data.title || "Notícia Urgente", 
                 content: data.content || data.text || res, 
                 date: currentWeek,
                 type: data.type || 'gossip'
               } 
             });
          } catch (e) {
             console.error("Failed to parse AI news JSON:", e, res);
             dispatch({ 
               type: 'ADD_NEWS', 
               payload: { 
                 title: "Rumores nos Bastidores", 
                 content: res, 
                 date: currentWeek,
                 type: 'gossip'
               } 
             });
          }
        });
      }
    }
  }, [currentWeek, latestNews, generatingForWeek, generate, loading, state.player, state.career, dispatch]);

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 relative overflow-hidden flex flex-col flex-1 min-h-[300px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
          <Newspaper size={20} />
        </div>
        <h3 className="text-zinc-300 font-bold uppercase tracking-wider text-xs">Feed de Notícias</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {loading && (
           <div className="flex items-center gap-3 text-zinc-500 p-4 border border-zinc-800/50 rounded-2xl bg-zinc-950/50">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-bold">Buscando notícias frescas...</span>
           </div>
        )}
        
        {latestNews.map((news) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={news.id} 
            className="p-5 border border-zinc-800/50 rounded-2xl bg-zinc-950/30 hover:bg-zinc-900/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
               <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md uppercase border border-blue-500/20">
                 {news.type === 'interview' ? 'Entrevista' : news.type === 'transfer' ? 'Mercado' : news.type === 'match' ? 'Partida' : 'Bastidores'}
               </span>
               <span className="text-[10px] text-zinc-500 font-bold uppercase">Semana {news.date}</span>
            </div>
            <h4 className="font-black text-sm text-zinc-200 mb-2 group-hover:text-white transition-colors leading-tight">{news.title}</h4>
            <div className="text-xs text-zinc-400 leading-relaxed relative line-clamp-3">
              {news.content}
            </div>
          </motion.div>
        ))}
        
        {!loading && latestNews.length === 0 && (
           <div className="text-center text-zinc-600 p-10 font-bold text-sm">
              Tudo quieto por enquanto...
           </div>
        )}
      </div>
    </div>
  );
}
