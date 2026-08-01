import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Trophy, Medal, Target, Shield, Clock, Activity, ArrowRightLeft, Star, Shirt, History, BarChart } from 'lucide-react';
import { useMuseumData } from './useMuseumData';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { 
  TimelineSection, SeasonsSection, LegacySection, 
  TrophiesSection, AwardsSection, RecordsSection, 
  TransfersSection, StatsSection, ShirtsSection, HistoricMatchesSection,
  ClubsSection
} from './MuseumSections';

const TABS = [
  { id: 'timeline', label: 'Linha do Tempo', icon: Clock },
  { id: 'stats', label: 'Estatísticas', icon: BarChart },
  { id: 'clubs', label: 'Clubes', icon: Shield },
  { id: 'seasons', label: 'Temporadas', icon: Calendar },
  { id: 'transfers', label: 'Transferências', icon: ArrowRightLeft },
  { id: 'trophies', label: 'Troféus', icon: Trophy },
  { id: 'awards', label: 'Prêmios', icon: Medal },
  { id: 'records', label: 'Recordes', icon: Target },
  { id: 'matches', label: 'Partidas Históricas', icon: History },
  { id: 'shirts', label: 'Camisas', icon: Shirt },
  { id: 'legacy', label: 'Legado & GOAT', icon: Star },
];

export default function MuseumView() {
  const { player } = useMuseumData();
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[100rem] h-[calc(100vh-100px)] flex flex-col bg-black/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] relative"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0" />
      <div className="absolute -top-1/4 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-yellow-500/10 blur-[150px] mix-blend-screen pointer-events-none" />
      
      {/* Header */}
      <header className="p-8 md:px-12 md:pt-12 md:pb-6 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center relative z-10 gap-8">
         <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(234,179,8,0.3)] bg-gradient-to-br from-yellow-500 to-yellow-900 relative">
               <div className="absolute inset-0 bg-black/40 mix-blend-overlay" />
               <PlayerPortrait player={player} className="w-full h-full scale-[1.3] mt-4 relative z-10 drop-shadow-2xl" />
            </div>
            <div>
               <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 uppercase tracking-tighter drop-shadow-2xl">
                 {player.name || 'Lenda'}
               </h1>
               <h2 className="text-white/70 font-bold uppercase tracking-[0.3em] text-xs md:text-sm flex items-center gap-2 mt-2">
                  <Star size={14} className="fill-yellow-500 text-yellow-500 animate-pulse" /> Arquivo Vivo da Carreira
               </h2>
            </div>
         </div>
      </header>

      {/* Tabs Navigation */}
      <div className="relative z-10 px-8 md:px-12 py-4 border-b border-white/5 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
           {TABS.map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                 activeTab === tab.id 
                 ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-105'
                 : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
               }`}
             >
               <tab.icon size={14} className={activeTab === tab.id ? 'text-black' : 'text-zinc-500'} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-8 md:p-12 relative z-10">
         <AnimatePresence mode="wait">
            <motion.div 
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
               className="h-full"
            >
               {activeTab === 'timeline' && <TimelineSection />}
               {activeTab === 'stats' && <StatsSection />}
               {activeTab === 'clubs' && <ClubsSection />}
               {activeTab === 'seasons' && <SeasonsSection />}
               {activeTab === 'transfers' && <TransfersSection />}
               {activeTab === 'trophies' && <TrophiesSection />}
               {activeTab === 'awards' && <AwardsSection />}
               {activeTab === 'records' && <RecordsSection />}
               {activeTab === 'matches' && <HistoricMatchesSection />}
               {activeTab === 'shirts' && <ShirtsSection />}
               {activeTab === 'legacy' && <LegacySection />}
            </motion.div>
         </AnimatePresence>
      </div>
    </motion.div>
  );
}
