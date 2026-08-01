import React from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { Newspaper, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '../ui';

export default function NewsFeed() {
  const { state } = useGameEngine();
  const latestNews = state.narrative.news;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center border border-amber-500/20">
          <Newspaper size={20} />
        </div>
        <h3 className="text-white/60 font-bold uppercase tracking-wider text-xs">Feed de Notícias</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {latestNews.map((news) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={news.id} 
            className="p-5 border border-white/5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
               <Badge variant={news.category === 'partida' ? 'success' : 'gold'}>
                 {news.category === 'entrevista' ? 'Entrevista' : news.category === 'transferência' ? 'Mercado' : news.category === 'partida' ? 'Partida' : 'Bastidores'}
               </Badge>
               <span className="text-[10px] text-white/40 font-bold uppercase">Semana {news.week || news.date}</span>
            </div>
            <h4 className="font-bold text-sm text-white mb-2 leading-tight">{news.headline}</h4>
            <div className="text-xs text-white/60 leading-relaxed relative line-clamp-3">
              {news.summary}
            </div>
          </motion.div>
        ))}
        
        {latestNews.length === 0 && (
           <div className="text-center text-white/40 p-10 font-bold text-sm h-full flex items-center justify-center">
              Tudo quieto por enquanto...
           </div>
        )}
      </div>
    </div>
  );
}
