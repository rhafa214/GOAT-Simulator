import React, { useState, useEffect } from "react";
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
  X,
  Shield,
  Briefcase,
  Calendar,
  ArrowRightLeft,
  Flame,
  Award,
  Crown,
  Settings,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import DashboardView from "./DashboardView";
import StatsView from "./StatsView";
import { AttributesView } from "./AttributesView";
import { NewsFeedTab } from "./NewsFeedTab";
import TrainingTab from "./TrainingTab";
import CareerSubView from "./CareerSubView";
import ClubSubView from "./ClubSubView";
import CalendarSubView from "./CalendarSubView";
import CompetitionsSubView from "./CompetitionsSubView";
import TrophiesSubView from "./TrophiesSubView";
import TransferHub from "../../presentation/features/transfers/TransferHub";
import MuseumView from "../museum/MuseumView";
import SettingsModal from "./SettingsModal";
import {
  GoatBadge,
  GoatButton,
  GOAT_TOKENS
} from "../ui/goat";

export default function MainHub() {
  const { state, dispatch } = useGameEngine();
  const { career } = state;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Keyboard Shortcuts navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if typing in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else {
          setActiveTab("dashboard");
        }
        return;
      }

      const key = e.key.toLowerCase();
      switch (key) {
        case '1': case 'h': setActiveTab('dashboard'); break;
        case '2': case 'j': setActiveTab('jogador'); break;
        case '3': case 'c': setActiveTab('carreira'); break;
        case '4': case 'l': setActiveTab('clube'); break;
        case '5': case 'k': setActiveTab('calendario'); break;
        case '6': case 'm': setActiveTab('competicoes'); break;
        case '7': case 't': setActiveTab('transferencias'); break;
        case '8': case 'n': setActiveTab('noticias'); break;
        case '9': case 'e': setActiveTab('estatisticas'); break;
        case '0': case 'r': setActiveTab('treinamento'); break;
        case 'a': case 'w': setActiveTab('conquistas'); break;
        case 'f': case 'u': setActiveTab('museu'); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen]);

  // CATEGORIES & TABS MAPPING
  const CATEGORIES = [
    { id: "dashboard", label: "Início", icon: <Home className="h-4 w-4" /> },
    {
      id: "jogador_group",
      label: "Jogador",
      icon: <User className="h-4 w-4" />,
      subTabs: [
        { id: "jogador", label: "Atributos & Perfil", icon: <User className="h-3.5 w-3.5" /> },
        { id: "treinamento", label: "Treinos", icon: <Dumbbell className="h-3.5 w-3.5" /> },
      ]
    },
    {
      id: "carreira_group",
      label: "Carreira & Clube",
      icon: <Briefcase className="h-4 w-4" />,
      subTabs: [
        { id: "carreira", label: "Contrato & Agente", icon: <Briefcase className="h-3.5 w-3.5" /> },
        { id: "clube", label: "Informações do Clube", icon: <Shield className="h-3.5 w-3.5" /> },
        { id: "transferencias", label: "Transferências", icon: <ArrowRightLeft className="h-3.5 w-3.5" /> },
        { id: "conquistas", label: "Sala de Troféus", icon: <Crown className="h-3.5 w-3.5" /> },
      ]
    },
    {
      id: "mundo_group",
      label: "Competições & Notícias",
      icon: <Trophy className="h-4 w-4" />,
      subTabs: [
        { id: "calendario", label: "Calendário", icon: <Calendar className="h-3.5 w-3.5" /> },
        { id: "competicoes", label: "Competições", icon: <Trophy className="h-3.5 w-3.5" /> },
        { id: "noticias", label: "Feed de Notícias", icon: <Bell className="h-3.5 w-3.5" /> },
        { id: "estatisticas", label: "Estatísticas", icon: <Activity className="h-3.5 w-3.5" /> },
        { id: "museu", label: "Museu da Carreira", icon: <Award className="h-3.5 w-3.5" /> },
      ]
    }
  ];

  // Helper to resolve active category
  const activeCategory = CATEGORIES.find(
    cat => cat.id === activeTab || (cat.subTabs && cat.subTabs.some(sub => sub.id === activeTab))
  ) || CATEGORIES[0];

  const getBreadcrumbLabel = () => {
    if (activeTab === "dashboard") return "Início / Hub Principal";
    const sub = activeCategory.subTabs?.find(s => s.id === activeTab);
    return `${activeCategory.label} / ${sub ? sub.label : activeTab}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-black font-goat-body text-zinc-100 overflow-x-hidden selection:bg-amber-500 selection:text-black pb-16 md:pb-0">
      
      {/* BACKGROUND LIGHTING */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[900px] rounded-full bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 py-3 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab("dashboard")}
              role="button"
              tabIndex={0}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 font-black">
                G
              </div>
              <div>
                <h1 className="font-goat-display text-lg font-black tracking-wider text-amber-400 goat-gold-text-glow leading-none">
                  GOAT
                </h1>
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mt-0.5">
                  SIMULATOR
                </span>
              </div>
            </div>

            {/* Desktop Primary Nav Bar */}
            <nav className="hidden lg:flex items-center gap-1.5" role="tablist" aria-label="Navegação do Hub">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      if (cat.subTabs && cat.subTabs.length > 0) {
                        setActiveTab(cat.subTabs[0].id);
                      } else {
                        setActiveTab(cat.id);
                      }
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-150 ${GOAT_TOKENS.focusState} ${
                      isSelected
                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Season Badge */}
            <div className="hidden sm:flex flex-col text-right pr-2 border-r border-zinc-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                Temp. {career.season || 1} • Sem {career.week}
              </span>
              <span className="text-xs font-bold text-zinc-300">
                Ano {career.year}
              </span>
            </div>

            {/* Notifications Shortcut */}
            <button
              onClick={() => setActiveTab("noticias")}
              aria-label="Ver Notícias"
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-amber-500/50 hover:text-white transition-colors ${GOAT_TOKENS.focusState}`}
            >
              <Bell className="h-4 w-4" />
              {state.narrative.news.length > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            {/* Settings Gear Shortcut */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Configurações do Jogo"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-amber-500/50 hover:text-white transition-colors ${GOAT_TOKENS.focusState}`}
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Abrir Menu de Navegação"
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 ${GOAT_TOKENS.focusState}`}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* SECONDARY SUB-NAVBAR & BREADCRUMBS */}
      <div className="w-full bg-zinc-950/60 border-b border-zinc-800/60 px-4 py-2 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
            {activeTab !== "dashboard" && (
              <button
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 hover:bg-zinc-800 text-[11px] font-extrabold uppercase transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Hub
              </button>
            )}
            <span className="text-zinc-500 hidden sm:inline">•</span>
            <span className="text-zinc-300 font-extrabold uppercase tracking-wider text-[11px]">
              {getBreadcrumbLabel()}
            </span>
          </div>

          {/* Sub-tabs if available */}
          {activeCategory.subTabs && activeCategory.subTabs.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              {activeCategory.subTabs.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveTab(sub.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    activeTab === sub.id
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  {sub.icon}
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* MOBILE OVERLAY DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="dialog"
            aria-label="Menu Mobile Completo"
            className="lg:hidden sticky top-[61px] z-30 w-full border-b border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur-xl space-y-4 shadow-2xl"
          >
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-2 py-1 flex items-center gap-1.5">
                  {cat.icon} {cat.label}
                </div>

                {cat.subTabs ? (
                  <div className="grid grid-cols-2 gap-1.5 pl-2">
                    {cat.subTabs.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab(sub.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold text-left transition-colors ${
                          activeTab === sub.id
                            ? "bg-amber-500 text-black font-extrabold"
                            : "bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        {sub.icon}
                        <span className="truncate">{sub.label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab(cat.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl p-2.5 text-xs font-bold transition-colors ${
                      activeTab === cat.id ? "bg-amber-500 text-black" : "bg-zinc-900/60 text-zinc-300"
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="flex items-center gap-2 text-xs font-bold text-zinc-300 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <Settings className="h-4 w-4 text-amber-400" />
                <span>Configurações</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT CANVAS */}
      <main className="relative z-10 flex-1 p-4 sm:p-6 md:p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="mx-auto max-w-7xl h-full"
        >
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "jogador" && <AttributesView />}
          {activeTab === "treinamento" && <TrainingTab />}
          {activeTab === "carreira" && <CareerSubView />}
          {activeTab === "clube" && <ClubSubView />}
          {activeTab === "calendario" && <CalendarSubView />}
          {activeTab === "competicoes" && <CompetitionsSubView />}
          {activeTab === "transferencias" && <TransferHub />}
          {activeTab === "noticias" && <NewsFeedTab />}
          {activeTab === "estatisticas" && <StatsView />}
          {activeTab === "conquistas" && <TrophiesSubView />}
          {activeTab === "museu" && <MuseumView />}
        </motion.div>
      </main>

      {/* MOBILE BOTTOM NAV BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800/90 bg-zinc-950/95 p-1.5 backdrop-blur-xl flex items-center justify-around">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-colors ${
            activeTab === "dashboard" ? "text-amber-400" : "text-zinc-500"
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Início</span>
        </button>

        <button
          onClick={() => setActiveTab("jogador")}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-colors ${
            activeTab === "jogador" || activeTab === "treinamento" ? "text-amber-400" : "text-zinc-500"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Jogador</span>
        </button>

        <button
          onClick={() => setActiveTab("carreira")}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-colors ${
            ["carreira", "clube", "transferencias", "conquistas"].includes(activeTab) ? "text-amber-400" : "text-zinc-500"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Carreira</span>
        </button>

        <button
          onClick={() => setActiveTab("competicoes")}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-colors ${
            ["calendario", "competicoes", "noticias", "estatisticas", "museu"].includes(activeTab) ? "text-amber-400" : "text-zinc-500"
          }`}
        >
          <Trophy className="h-4 w-4" />
          <span>Mundo</span>
        </button>
      </nav>

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}
