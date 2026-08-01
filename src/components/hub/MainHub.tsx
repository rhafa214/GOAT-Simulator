import React, { useState } from "react";
import { useGameEngine } from "../../engine/GameEngine";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  User,
  Activity,
  Trophy,
  Dumbbell,
  LogOut,
  Bell,
  Menu,
  X
} from "lucide-react";
import DashboardView from "./DashboardView";
import StatsView from "./StatsView";
import { AttributesView } from "./AttributesView";
import { NewsFeedTab } from "./NewsFeedTab";
import TrainingTab from "./TrainingTab";
import { IconButton, Button, Badge } from "../ui";
import { PlayerPortrait } from "../ui/PlayerPortrait";

export default function MainHub() {
  const { state, dispatch } = useGameEngine();
  const { player, career } = state;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const TABS = [
    { id: "dashboard", label: "Hub", icon: <Home size={20} /> },
    { id: "atributos", label: "Perfil", icon: <User size={20} /> },
    { id: "estatisticas", label: "Histórico", icon: <Activity size={20} /> },
    { id: "treinamento", label: "Treino", icon: <Dumbbell size={20} /> },
    { id: "noticias", label: "Mundo", icon: <Trophy size={20} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Top Header (Desktop & Tablet) */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              GOAT
            </h1>
            <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-widest leading-none mt-1">
              Simulator
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
              S{career.season || 1} • Sem {career.week}
            </span>
            <span className="text-sm font-bold text-white">
              {career.year}
            </span>
          </div>
          
          <div className="relative">
            <IconButton
              icon={<Bell size={20} />}
              aria-label="Notificações"
              variant="ghost"
              className="text-white/60 hover:text-white"
            />
            {state.narrative.news.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-black"></span>
            )}
          </div>

          <div className="md:hidden">
            <IconButton
              icon={isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              aria-label="Menu"
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
          
          <div className="hidden md:block">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => dispatch({ type: "CHANGE_PHASE", payload: "RETIREMENT" })}
              className="text-white/40 hover:text-rose-400 gap-2"
            >
              <LogOut size={16} /> Aposentar
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-30 top-[73px] bg-black border-b border-white/10 p-4 flex flex-col gap-2"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-4 px-4 py-4 rounded-md text-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            
            <div className="mt-auto pt-4 border-t border-white/10">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-white/40 hover:text-rose-400 gap-4 py-4 text-lg"
                onClick={() => dispatch({ type: "CHANGE_PHASE", payload: "RETIREMENT" })}
              >
                <LogOut size={20} /> Aposentar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto h-full"
        >
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "estatisticas" && <StatsView />}
          {activeTab === "atributos" && <AttributesView />}
          {activeTab === "treinamento" && <TrainingTab />}
          {activeTab === "noticias" && <NewsFeedTab />}
        </motion.div>
      </main>
      
      {/* Mobile Bottom Bar Placeholder (if we want bottom nav instead of menu, but we used hamburger for now) */}
    </div>
  );
}
