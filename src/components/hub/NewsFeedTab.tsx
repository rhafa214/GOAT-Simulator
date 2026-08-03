import React, { useEffect, useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { Newspaper, Loader2, Sparkles, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';

export function NewsFeedTab() {
  const { state } = useGameEngine();
  const [news, setNews] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchNews() {
      setLoading(true);
      setIsOffline(false);
      
      const clubName = state.career.currentClub?.name || 'sem clube';
      const playerName = state.player.name;
      const week = state.career.week;
      const sho = state.player.technical.SHO;
      const fame = state.player.rpg.fame;

      // Local fallback generator function
      const getLocalFallbackNews = () => {
        if (fame > 60) {
          return `A popularidade de ${playerName} atingiu patamares impressionantes nesta semana. Camisas personalizadas com o nome da jovem promessa estão esgotando rapidamente nas lojas do ${clubName}. Analistas esportivos afirmam que o garoto tem um magnetismo raro com a torcida e atrai olhares de grandes marcas.`;
        }
        if (sho > 70) {
          return `O poder de finalização de ${playerName} tem sido o assunto principal nos bastidores do ${clubName}. O atleta demonstrou chutes cirúrgicos nos últimos treinos coletivos, ganhando elogios públicos do treinador por sua precisão milimétrica e postura decidida na área.`;
        }
        if (sho < 45) {
          return `Focado na evolução, ${playerName} tem realizado sessões extras de treinamento para aprimorar seu repertório de finalizações. Fontes ligadas ao ${clubName} destacam que a resiliência do jovem atacante tem motivado todo o elenco rumo às próximas rodadas.`;
        }
        return `O início de trajetória de ${playerName} no ${clubName} continua sendo acompanhado com enorme expectativa na Semana ${week}. Comentadores esportivos ressaltam a excelente leitura de jogo e a rápida adaptação tática que o jovem atleta vem demonstrando em campo.`;
      };

      try {
        const prompt = `Você é um jornalista esportivo. Escreva um parágrafo de notícia sobre o jogador ${playerName}, que joga no time ${clubName} e está na semana ${week} da sua carreira. O tom deve ser dramático e engajador, focando no seu desempenho recente e expectativas (Nível técnico: ${sho}, Fama: ${fame}). Limite-se a 400 caracteres.`;
        
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
             prompt, 
             systemInstruction: "You are a professional sports journalist. Write a very concise match report in Portuguese. Maximum 3 short paragraphs. Get straight to the point.",
             provider: "openai" // Will fallback to gemini if OpenAI is not configured in server
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setNews(data.text || getLocalFallbackNews());
          }
        } else {
          if (isMounted) {
            setIsOffline(true);
            setNews(getLocalFallbackNews());
          }
        }
      } catch (e) {
         if (isMounted) {
            setIsOffline(true);
            setNews(getLocalFallbackNews());
         }
      }
      if (isMounted) setLoading(false);
    }

    fetchNews();
    
    return () => { isMounted = false; }
  }, [state.career.week, state.player.name, state.career.currentClub?.name, state.player.technical.SHO, state.player.rpg.fame]);

  return (
    <div className="flex-1 h-full w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
      
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6 relative z-10">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-yellow-500 shadow-inner">
               <Newspaper size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-widest">Feed de Notícias</h2>
               <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                  <Sparkles size={12} className="text-yellow-500" />
                  Gerado por IA (OpenAI / Gemini)
               </div>
            </div>
         </div>

         {isOffline && (
            <div className="px-3 py-1 bg-zinc-800/80 border border-zinc-700 rounded-full flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider" title="O servidor de IA está offline ou indisponível. Notícia gerada localmente.">
               <WifiOff size={12} className="text-zinc-500" />
               IA Indisponível (Modo Local)
            </div>
         )}
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
         {loading ? (
            <div className="flex flex-col items-center gap-4 text-zinc-500">
               <Loader2 size={32} className="animate-spin text-yellow-500" />
               <p className="font-bold uppercase tracking-widest text-xs">Redigindo a matéria...</p>
            </div>
         ) : (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-2xl text-center"
            >
               <div className="text-6xl text-white/10 font-serif mb-[-20px] leading-none">"</div>
               <p className="text-xl md:text-2xl text-zinc-300 font-serif leading-relaxed italic px-8">
                  {news}
               </p>
               <div className="text-6xl text-white/10 font-serif mt-[-10px] text-right leading-none">"</div>
               <div className="mt-8 text-xs font-bold text-yellow-500/80 uppercase tracking-widest">
                  — Diário Esportivo, Semana {state.career.week}
               </div>
            </motion.div>
         )}
      </div>
    </div>
  );
}
